import { describe, expect, it } from 'vitest';
import { createExamplePlan, examplePlanCards } from '../data/examplePlans';
import { createPlanFile } from '../data/planFile';
import type { SimulationResult } from '../types/plan';
import { runResultsPreviewBundle } from './previewScenarios';
import type { SimulationConfig } from './runSimulation';
import {
  createDetailedStressAdapterRequest,
  createDetailedStressManualReportReference,
  runSpendingStressResults,
  runDetailedStressInjectedRunnerPrototype,
  runDetailedStressProbeBackedBridge,
  selectDetailedStressAdapterBatchCloseout,
  selectDetailedStressAdapterContract,
  selectDetailedStressAdapterValidation,
  selectDetailedStressBoundaryReview,
  selectDetailedStressBridgeBatchCloseout,
  selectDetailedStressManualComparisonCloseout,
  selectDetailedStressManualReportComparison,
  selectDetailedStressMigrationCloseout,
  selectDetailedStressProbeBackedRunnerBridge,
  selectDetailedStressProbeCoverage,
  selectDetailedStressPrototypeBatchCloseout,
  selectDetailedStressV1DecisionCloseout,
  selectDetailedStressV1MigrationDecision,
  selectStressExtractionReadinessSummary,
  selectStressIndicatorRows,
  selectStressTestRows,
  selectStressTestSummary,
  stressExtractionBoundary
} from './stressSelectors';

function withRows(rows: Array<Partial<SimulationResult['years'][number]>>): SimulationResult {
  return {
    years: rows.map((row, index) => ({
      year: 2028 + index,
      ageF: 65 + index,
      ageM: 0,
      spending: 70000,
      grossIncome: 70000,
      dbPension: 0,
      cpp_f: 0,
      oas_f: 0,
      tfsa_draw: 0,
      nonreg_draw: 0,
      cash_draw: 0,
      totalTaxYear: 10000,
      taxableIncome: 50000,
      totalOasClawY: 0,
      totalAftaxYear: 60000,
      cashFlow: 0,
      shortfall: 0,
      bal_rrsp: 100000,
      bal_tfsa: 50000,
      bal_lif: 0,
      bal_nonreg: 0,
      bal_cash: 0,
      bal_total: 150000,
      ...row
    })),
    totalTax: 0
  } as SimulationResult;
}

describe('stress selectors extraction', () => {
  it('keeps baseline stress rows and summary derived from simulation result rows', () => {
    const result = withRows([
      { shortfall: 0, bal_total: 200000, totalTaxYear: 12000 },
      { shortfall: 15000, bal_total: 0, totalTaxYear: 14000 }
    ]);

    expect(selectStressIndicatorRows(result).find((row) => row.id === 'shortfall')).toMatchObject({
      severity: 'watch',
      value: '2029 (15,000)'
    });
    expect(selectStressTestRows(result).map((row) => row.id)).toEqual([
      'spendingShortfall',
      'portfolioDepletion',
      'portfolioCushion',
      'taxPressure',
      'sourceReconciliation'
    ]);
    expect(selectStressTestSummary(result)).toMatchObject({
      status: 'watch',
      totalYears: 2,
      fundedYears: 1,
      firstStressYear: 2028
    });
  });

  it('summarizes extracted stress ownership without claiming full stress migration', () => {
    const readiness = selectStressExtractionReadinessSummary();

    expect(readiness).toMatchObject({
      status: 'holdForScenarioStress',
      disposition: 'stressExtractionReadinessOnly'
    });
    expect(readiness.rows.find((row) => row.id === 'baselineRows')).toMatchObject({ status: 'ready' });
    expect(readiness.rows.find((row) => row.id === 'spendingStress')).toMatchObject({ status: 'ready' });
    expect(readiness.rows.find((row) => row.id === 'monteCarlo')).toMatchObject({ status: 'hold' });
    expect(readiness.reviewNote).toContain('does not change simulation math');
  });

  it('builds nearby spending stress reruns through working copies', () => {
    const plan = createExamplePlan(examplePlanCards[0].id);
    const baseline = withRows([{ year: 2028, shortfall: 0, bal_total: 100000 }]);
    const calls: Array<{ planSpending: number; config: SimulationConfig }> = [];
    const results = runSpendingStressResults({
      plan,
      baseline,
      baselineConfig: { returnRate: 0.05, withdrawalOrder: 'default' },
      runner: (nextPlan, config) => {
        calls.push({ planSpending: nextPlan.spending.gogo || 0, config });
        return withRows([{ year: 2028 + calls.length, shortfall: 0, bal_total: 100000 - calls.length }]);
      }
    });

    expect(Object.keys(results).sort()).toEqual(['current', 'littleLess', 'littleMore', 'meaningfullyLess']);
    expect(calls.map((call) => call.planSpending)).toEqual([
      Math.round((plan.spending.gogo || 0) * 0.95),
      Math.round((plan.spending.gogo || 0) * 0.9),
      Math.round((plan.spending.gogo || 0) * 1.05)
    ]);
    expect(plan.spending.gogo).toBe(createExamplePlan(examplePlanCards[0].id).spending.gogo);
  });

  it('skips higher-spending rerun when the baseline already has a visible shortfall', () => {
    const plan = createExamplePlan(examplePlanCards[0].id);
    const baseline = withRows([{ year: 2028, shortfall: 1000, bal_total: 100000 }]);
    let callCount = 0;
    const results = runSpendingStressResults({
      plan,
      baseline,
      baselineConfig: {},
      runner: () => {
        callCount += 1;
        return withRows([{ year: 2028 + callCount }]);
      }
    });

    expect(results.littleMore).toBeUndefined();
    expect(callCount).toBe(2);
  });

  it('blocks readiness if stress extraction would change simulation math or persist output', () => {
    const readiness = selectStressExtractionReadinessSummary({
      ...stressExtractionBoundary,
      changesSimulationMath: true,
      persistedOutput: 'runtimeEvidenceLeaked'
    });

    expect(readiness.status).toBe('blocked');
    expect(readiness.rows.find((row) => row.id === 'reviewSelectors')).toMatchObject({ status: 'blocked' });
    expect(readiness.rows.find((row) => row.id === 'savedPlan')).toMatchObject({ status: 'blocked' });
  });

  it('runs built-in examples through extracted baseline stress selectors without saved output', () => {
    for (const card of examplePlanCards) {
      const plan = createExamplePlan(card.id);
      const preview = runResultsPreviewBundle(plan);
      const summary = selectStressTestSummary(preview.result);
      const saved = createPlanFile(plan);

      expect(['ok', 'review', 'watch']).toContain(summary.status);
      expect(summary.totalYears).toBeGreaterThan(0);
      expect(saved.plan).not.toHaveProperty('stressExtractionReadiness');
      expect(saved.plan).not.toHaveProperty('stressExtractionBoundary');
      expect(saved.plan).not.toHaveProperty('stressTestSummary');
      expect(saved.plan).not.toHaveProperty('stressTestRows');
      expect(saved.plan).not.toHaveProperty('detailedStressBoundaryReview');
      expect(saved.plan).not.toHaveProperty('detailedStressMigrationCloseout');
      expect(saved.plan).not.toHaveProperty('detailedStressAdapterContract');
      expect(saved.plan).not.toHaveProperty('detailedStressAdapterValidation');
      expect(saved.plan).not.toHaveProperty('detailedStressAdapterBatchCloseout');
      expect(saved.plan).not.toHaveProperty('detailedStressAdapterRequest');
      expect(saved.plan).not.toHaveProperty('detailedStressInjectedRunnerPrototype');
      expect(saved.plan).not.toHaveProperty('detailedStressPrototypeBatchCloseout');
      expect(saved.plan).not.toHaveProperty('detailedStressProbeCoverage');
      expect(saved.plan).not.toHaveProperty('detailedStressProbeBackedRunnerBridge');
      expect(saved.plan).not.toHaveProperty('detailedStressProbeBackedBridgeRun');
      expect(saved.plan).not.toHaveProperty('detailedStressBridgeBatchCloseout');
      expect(saved.plan).not.toHaveProperty('detailedStressManualReportReference');
      expect(saved.plan).not.toHaveProperty('detailedStressManualReportComparison');
      expect(saved.plan).not.toHaveProperty('detailedStressManualComparisonCloseout');
      expect(saved.plan).not.toHaveProperty('detailedStressV1MigrationDecision');
      expect(saved.plan).not.toHaveProperty('detailedStressV1DecisionCloseout');
    }
  });

  it('reviews detailed Monte Carlo and historical stress boundaries without moving them', () => {
    const review = selectDetailedStressBoundaryReview();

    expect(review).toMatchObject({
      status: 'holdInDetailedReport',
      disposition: 'detailedStressBoundaryReviewOnly'
    });
    expect(review.rows.map((row) => row.id)).toEqual([
      'monteCarlo',
      'progressiveMonteCarlo',
      'historicalSequence',
      'fullSpendingFunded',
      'dashboardOwnership',
      'probeCoverage',
      'savedPlan'
    ]);
    expect(review.rows.find((row) => row.id === 'monteCarlo')).toMatchObject({ status: 'hold' });
    expect(review.rows.find((row) => row.id === 'historicalSequence')).toMatchObject({ status: 'hold' });
    expect(review.rows.find((row) => row.id === 'probeCoverage')).toMatchObject({ status: 'ready' });
    expect(review.reviewNote).toContain('does not run Monte Carlo in React');
  });

  it('blocks detailed stress boundary review when probes or saved-plan boundaries are not clean', () => {
    const review = selectDetailedStressBoundaryReview({ includeProbeCoverage: false, savedPlanClean: false });

    expect(review.status).toBe('blocked');
    expect(review.rows.find((row) => row.id === 'probeCoverage')).toMatchObject({ status: 'blocked' });
    expect(review.rows.find((row) => row.id === 'savedPlan')).toMatchObject({ status: 'blocked' });
  });

  it('closes detailed stress migration as adapter-ready, not migrated', () => {
    const stressReadiness = selectStressExtractionReadinessSummary();
    const boundaryReview = selectDetailedStressBoundaryReview();
    const closeout = selectDetailedStressMigrationCloseout({ boundaryReview, stressReadiness });

    expect(closeout).toMatchObject({
      status: 'readyForThinAdapter',
      disposition: 'detailedStressMigrationCloseoutOnly'
    });
    expect(closeout.rows.map((row) => row.id)).toEqual(['boundaryReview', 'baselineStress', 'spendingStress', 'savedPlan']);
    expect(closeout.detail).toContain('adapter contract');
    expect(closeout.reviewNote).toContain('does not move Monte Carlo');
  });

  it('defines a thin detailed-stress adapter contract without moving execution into React', () => {
    const contract = selectDetailedStressAdapterContract();

    expect(contract).toMatchObject({
      status: 'readyForInjectedRunner',
      disposition: 'detailedStressAdapterContractOnly',
      inputBoundary: {
        acceptsExplicitPlan: true,
        acceptsExplicitConfig: true,
        readsGlobalDashboardState: false
      },
      executionBoundary: {
        owner: 'detailedReportEngine',
        reactMayRunMonteCarlo: false,
        reactMayRunHistoricalReplay: false,
        runnerMode: 'injectedOnly'
      },
      outputBoundary: {
        returnsExistingShapes: true,
        changesStressMath: false,
        persistedOutput: 'none'
      }
    });
    expect(contract.rows.map((row) => row.id)).toEqual([
      'inputPlan',
      'inputConfig',
      'runnerOwnership',
      'outputShape',
      'savedPlan'
    ]);
    expect(contract.rows.find((row) => row.id === 'runnerOwnership')).toMatchObject({ status: 'hold' });
    expect(contract.reviewNote).toContain('does not run Monte Carlo');
  });

  it('blocks detailed-stress adapter contracts that leak execution, shapes, or saved output', () => {
    const contract = selectDetailedStressAdapterContract({
      readsGlobalDashboardState: true,
      reactMayRunMonteCarlo: true,
      reactMayRunHistoricalReplay: true,
      runnerMode: 'directReactExecution',
      returnsExistingShapes: false,
      changesStressMath: true,
      persistedOutput: 'adapterOutputLeaked'
    });

    expect(contract.status).toBe('blocked');
    expect(contract.rows.find((row) => row.id === 'inputPlan')).toMatchObject({ status: 'blocked' });
    expect(contract.rows.find((row) => row.id === 'runnerOwnership')).toMatchObject({ status: 'blocked' });
    expect(contract.rows.find((row) => row.id === 'outputShape')).toMatchObject({ status: 'blocked' });
    expect(contract.rows.find((row) => row.id === 'savedPlan')).toMatchObject({ status: 'blocked' });
  });

  it('validates the detailed-stress adapter only as an injected-runner prototype', () => {
    const stressReadiness = selectStressExtractionReadinessSummary();
    const boundaryReview = selectDetailedStressBoundaryReview();
    const migrationCloseout = selectDetailedStressMigrationCloseout({ boundaryReview, stressReadiness });
    const adapterContract = selectDetailedStressAdapterContract();
    const validation = selectDetailedStressAdapterValidation({ boundaryReview, migrationCloseout, adapterContract });

    expect(validation).toMatchObject({
      status: 'validForPrototype',
      disposition: 'detailedStressAdapterValidationOnly'
    });
    expect(validation.rows.map((row) => row.id)).toEqual([
      'boundaryReview',
      'migrationCloseout',
      'adapterContract',
      'probeCoverage',
      'savedPlan'
    ]);
    expect(validation.rows.find((row) => row.id === 'boundaryReview')).toMatchObject({ status: 'hold' });
    expect(validation.rows.find((row) => row.id === 'adapterContract')).toMatchObject({ status: 'ready' });
    expect(validation.nextStep).toContain('injected runner wrapper');
    expect(validation.reviewNote).toContain('does not execute stress scenarios');
  });

  it('blocks detailed-stress adapter validation when contract or saved-plan guardrails fail', () => {
    const stressReadiness = selectStressExtractionReadinessSummary();
    const boundaryReview = selectDetailedStressBoundaryReview({ savedPlanClean: false });
    const migrationCloseout = selectDetailedStressMigrationCloseout({ boundaryReview, stressReadiness });
    const adapterContract = selectDetailedStressAdapterContract({ persistedOutput: 'adapterOutputLeaked' });
    const validation = selectDetailedStressAdapterValidation({ boundaryReview, migrationCloseout, adapterContract });

    expect(validation.status).toBe('blocked');
    expect(validation.rows.find((row) => row.id === 'adapterContract')).toMatchObject({ status: 'blocked' });
    expect(validation.rows.find((row) => row.id === 'savedPlan')).toMatchObject({ status: 'blocked' });
  });

  it('closes the adapter batch as prototype-ready without adding stress execution', () => {
    const stressReadiness = selectStressExtractionReadinessSummary();
    const boundaryReview = selectDetailedStressBoundaryReview();
    const migrationCloseout = selectDetailedStressMigrationCloseout({ boundaryReview, stressReadiness });
    const adapterContract = selectDetailedStressAdapterContract();
    const adapterValidation = selectDetailedStressAdapterValidation({
      boundaryReview,
      migrationCloseout,
      adapterContract
    });
    const closeout = selectDetailedStressAdapterBatchCloseout({ adapterContract, adapterValidation });

    expect(closeout).toMatchObject({
      status: 'readyForThinAdapterPrototype',
      disposition: 'detailedStressAdapterBatchCloseoutOnly'
    });
    expect(closeout.rows.map((row) => row.id)).toEqual(['contract', 'validation', 'execution', 'persistence']);
    expect(closeout.rows.find((row) => row.id === 'execution')).toMatchObject({ status: 'hold' });
    expect(closeout.reviewNote).toContain('does not add optimizer behavior');
    expect(closeout.reviewNote).toContain('run detailed stress in React');
  });

  it('creates a copied explicit request for a detailed-stress injected runner', () => {
    const plan = createExamplePlan(examplePlanCards[0].id);
    const validation = selectDetailedStressAdapterValidation({
      boundaryReview: selectDetailedStressBoundaryReview(),
      migrationCloseout: selectDetailedStressMigrationCloseout({
        boundaryReview: selectDetailedStressBoundaryReview(),
        stressReadiness: selectStressExtractionReadinessSummary()
      }),
      adapterContract: selectDetailedStressAdapterContract()
    });
    const request = createDetailedStressAdapterRequest({
      plan,
      config: { returnRate: 0.04, withdrawalOrder: 'default' },
      adapterValidation: validation
    });

    expect(request).toMatchObject({
      requestId: 'detailedStressExplicitPlanRequest',
      source: 'explicitPlanAndConfig',
      readsGlobalDashboardState: false,
      persistedOutput: 'none',
      disposition: 'detailedStressAdapterRequestOnly'
    });
    expect(request?.plan).not.toBe(plan);
    expect(request?.config).toEqual({ returnRate: 0.04, withdrawalOrder: 'default' });
    if (request) request.plan.spending.gogo = 1;
    expect(plan.spending.gogo).toBe(createExamplePlan(examplePlanCards[0].id).spending.gogo);
  });

  it('does not create a detailed-stress request when adapter validation is blocked', () => {
    const plan = createExamplePlan(examplePlanCards[0].id);
    const boundaryReview = selectDetailedStressBoundaryReview({ includeProbeCoverage: false });
    const migrationCloseout = selectDetailedStressMigrationCloseout({
      boundaryReview,
      stressReadiness: selectStressExtractionReadinessSummary()
    });
    const validation = selectDetailedStressAdapterValidation({
      boundaryReview,
      migrationCloseout,
      adapterContract: selectDetailedStressAdapterContract()
    });

    expect(createDetailedStressAdapterRequest({ plan, adapterValidation: validation })).toBeNull();
  });

  it('runs only an injected detailed-stress runner and accepts existing output shape metadata', () => {
    const plan = createExamplePlan(examplePlanCards[0].id);
    const boundaryReview = selectDetailedStressBoundaryReview();
    const migrationCloseout = selectDetailedStressMigrationCloseout({
      boundaryReview,
      stressReadiness: selectStressExtractionReadinessSummary()
    });
    const adapterValidation = selectDetailedStressAdapterValidation({
      boundaryReview,
      migrationCloseout,
      adapterContract: selectDetailedStressAdapterContract()
    });
    const calls: string[] = [];
    const prototype = runDetailedStressInjectedRunnerPrototype({
      plan,
      config: { returnRate: 0.05 },
      adapterValidation,
      runner: (request) => {
        calls.push(request.source);
        expect(request.plan).not.toBe(plan);
        return {
          shape: 'existingDetailedStressShape',
          status: 'complete',
          fullSpendingFundedRate: 0.82,
          monteCarloRunCount: 200,
          historicalSequenceCount: 4,
          notes: ['Detailed stress runner was injected for prototype coverage.']
        };
      }
    });

    expect(calls).toEqual(['explicitPlanAndConfig']);
    expect(prototype).toMatchObject({
      status: 'prototypeComplete',
      runnerCalled: true,
      disposition: 'detailedStressInjectedRunnerPrototypeOnly'
    });
    expect(prototype.rows.find((row) => row.id === 'outputShape')).toMatchObject({ status: 'ready' });
    expect(prototype.result).toMatchObject({
      shape: 'existingDetailedStressShape',
      fullSpendingFundedRate: 0.82
    });
    expect(prototype.reviewNote).toContain('does not run Monte Carlo in React');
  });

  it('holds the detailed-stress prototype when no injected runner is supplied', () => {
    const plan = createExamplePlan(examplePlanCards[0].id);
    const boundaryReview = selectDetailedStressBoundaryReview();
    const migrationCloseout = selectDetailedStressMigrationCloseout({
      boundaryReview,
      stressReadiness: selectStressExtractionReadinessSummary()
    });
    const adapterValidation = selectDetailedStressAdapterValidation({
      boundaryReview,
      migrationCloseout,
      adapterContract: selectDetailedStressAdapterContract()
    });
    const prototype = runDetailedStressInjectedRunnerPrototype({ plan, adapterValidation });

    expect(prototype.status).toBe('notReady');
    expect(prototype.runnerCalled).toBe(false);
    expect(prototype.result).toBeNull();
    expect(prototype.rows.find((row) => row.id === 'runner')).toMatchObject({ status: 'blocked' });
  });

  it('blocks detailed-stress prototype output that does not match existing shape metadata', () => {
    const plan = createExamplePlan(examplePlanCards[0].id);
    const boundaryReview = selectDetailedStressBoundaryReview();
    const migrationCloseout = selectDetailedStressMigrationCloseout({
      boundaryReview,
      stressReadiness: selectStressExtractionReadinessSummary()
    });
    const adapterValidation = selectDetailedStressAdapterValidation({
      boundaryReview,
      migrationCloseout,
      adapterContract: selectDetailedStressAdapterContract()
    });
    const prototype = runDetailedStressInjectedRunnerPrototype({
      plan,
      adapterValidation,
      runner: () =>
        ({
          shape: 'changedDetailedStressShape',
          status: 'complete',
          fullSpendingFundedRate: 2,
          monteCarloRunCount: -1,
          historicalSequenceCount: null,
          notes: []
        }) as never
    });

    expect(prototype.status).toBe('blocked');
    expect(prototype.runnerCalled).toBe(true);
    expect(prototype.result).toBeNull();
    expect(prototype.rows.find((row) => row.id === 'outputShape')).toMatchObject({ status: 'blocked' });
  });

  it('closes the detailed-stress prototype batch as ready for a later probe-backed runner', () => {
    const plan = createExamplePlan(examplePlanCards[0].id);
    const boundaryReview = selectDetailedStressBoundaryReview();
    const migrationCloseout = selectDetailedStressMigrationCloseout({
      boundaryReview,
      stressReadiness: selectStressExtractionReadinessSummary()
    });
    const adapterValidation = selectDetailedStressAdapterValidation({
      boundaryReview,
      migrationCloseout,
      adapterContract: selectDetailedStressAdapterContract()
    });
    const prototype = runDetailedStressInjectedRunnerPrototype({
      plan,
      adapterValidation,
      runner: () => ({
        shape: 'existingDetailedStressShape',
        status: 'complete',
        fullSpendingFundedRate: 0.75,
        monteCarloRunCount: 100,
        historicalSequenceCount: 3,
        notes: []
      })
    });
    const closeout = selectDetailedStressPrototypeBatchCloseout({ adapterValidation, prototype });

    expect(closeout).toMatchObject({
      status: 'readyForProbeBackedRunner',
      disposition: 'detailedStressPrototypeBatchCloseoutOnly'
    });
    expect(closeout.rows.map((row) => row.id)).toEqual(['request', 'prototype', 'executionBoundary', 'persistence']);
    expect(closeout.rows.find((row) => row.id === 'executionBoundary')).toMatchObject({ status: 'hold' });
    expect(closeout.reviewNote).toContain('does not move Monte Carlo');
  });

  function readyAdapterValidation() {
    const boundaryReview = selectDetailedStressBoundaryReview();
    const migrationCloseout = selectDetailedStressMigrationCloseout({
      boundaryReview,
      stressReadiness: selectStressExtractionReadinessSummary()
    });
    return selectDetailedStressAdapterValidation({
      boundaryReview,
      migrationCloseout,
      adapterContract: selectDetailedStressAdapterContract()
    });
  }

  function readyPrototypeCloseout() {
    const plan = createExamplePlan(examplePlanCards[0].id);
    const adapterValidation = readyAdapterValidation();
    const prototype = runDetailedStressInjectedRunnerPrototype({
      plan,
      adapterValidation,
      runner: () => ({
        shape: 'existingDetailedStressShape',
        status: 'complete',
        fullSpendingFundedRate: 0.7,
        monteCarloRunCount: 100,
        historicalSequenceCount: 3,
        notes: []
      })
    });
    return { adapterValidation, prototypeCloseout: selectDetailedStressPrototypeBatchCloseout({ adapterValidation, prototype }) };
  }

  it('summarizes probe coverage for a future detailed-stress bridge without running stress in React', () => {
    const coverage = selectDetailedStressProbeCoverage();

    expect(coverage).toMatchObject({
      status: 'covered',
      disposition: 'detailedStressProbeCoverageOnly'
    });
    expect(coverage.rows.map((row) => row.id)).toEqual([
      'monteCarlo',
      'progressiveMonteCarlo',
      'historicalSequence',
      'parity',
      'routeCaveat'
    ]);
    expect(coverage.rows.find((row) => row.id === 'routeCaveat')).toMatchObject({ status: 'caveat' });
    expect(coverage.reviewNote).toContain('does not run detailed stress in React');
  });

  it('blocks bridge readiness when required detailed-stress probe coverage is missing', () => {
    const coverage = selectDetailedStressProbeCoverage({ historicalSequenceCovered: false, parityCovered: false });

    expect(coverage.status).toBe('missingCoverage');
    expect(coverage.rows.find((row) => row.id === 'historicalSequence')).toMatchObject({ status: 'missing' });
    expect(coverage.rows.find((row) => row.id === 'parity')).toMatchObject({ status: 'missing' });
  });

  it('marks a probe-backed runner bridge ready only when prototype and coverage are clean', () => {
    const { prototypeCloseout } = readyPrototypeCloseout();
    const bridge = selectDetailedStressProbeBackedRunnerBridge({
      prototypeCloseout,
      probeCoverage: selectDetailedStressProbeCoverage()
    });

    expect(bridge).toMatchObject({
      status: 'readyForManualBridge',
      disposition: 'detailedStressProbeBackedRunnerBridgeOnly'
    });
    expect(bridge.rows.map((row) => row.id)).toEqual([
      'prototypeCloseout',
      'probeCoverage',
      'runnerInjection',
      'executionBoundary',
      'savedPlan'
    ]);
    expect(bridge.rows.find((row) => row.id === 'executionBoundary')).toMatchObject({ status: 'hold' });
    expect(bridge.reviewNote).toContain('does not move Monte Carlo');
  });

  it('holds or blocks the probe-backed runner bridge when runner or persistence boundaries are not ready', () => {
    const { prototypeCloseout } = readyPrototypeCloseout();
    const waiting = selectDetailedStressProbeBackedRunnerBridge({
      prototypeCloseout,
      probeCoverage: selectDetailedStressProbeCoverage(),
      injectedRunnerAvailable: false
    });
    const blocked = selectDetailedStressProbeBackedRunnerBridge({
      prototypeCloseout,
      probeCoverage: selectDetailedStressProbeCoverage(),
      savedPlanClean: false
    });

    expect(waiting.status).toBe('holdDetailedStress');
    expect(waiting.rows.find((row) => row.id === 'runnerInjection')).toMatchObject({ status: 'hold' });
    expect(blocked.status).toBe('blocked');
    expect(blocked.rows.find((row) => row.id === 'savedPlan')).toMatchObject({ status: 'blocked' });
  });

  it('runs a probe-backed bridge through the injected runner and keeps output runtime-only', () => {
    const plan = createExamplePlan(examplePlanCards[0].id);
    const { adapterValidation, prototypeCloseout } = readyPrototypeCloseout();
    const bridge = selectDetailedStressProbeBackedRunnerBridge({
      prototypeCloseout,
      probeCoverage: selectDetailedStressProbeCoverage()
    });
    const calls: string[] = [];
    const bridgeRun = runDetailedStressProbeBackedBridge({
      plan,
      config: { returnRate: 0.05 },
      adapterValidation,
      bridge,
      runner: (request) => {
        calls.push(request.source);
        return {
          shape: 'existingDetailedStressShape',
          status: 'complete',
          fullSpendingFundedRate: 0.9,
          monteCarloRunCount: 200,
          historicalSequenceCount: 4,
          notes: ['Bridge runner supplied by detailed-report path.']
        };
      }
    });

    expect(calls).toEqual(['explicitPlanAndConfig']);
    expect(bridgeRun).toMatchObject({
      status: 'bridgeComplete',
      disposition: 'detailedStressProbeBackedBridgeRunOnly'
    });
    expect(bridgeRun.rows.find((row) => row.id === 'runner')).toMatchObject({ status: 'ready' });
    expect(bridgeRun.rows.find((row) => row.id === 'outputShape')).toMatchObject({ status: 'ready' });
    expect(bridgeRun.reviewNote).toContain('does not move Monte Carlo');
    expect(createPlanFile(plan).plan).not.toHaveProperty('detailedStressProbeBackedBridgeRun');
  });

  it('does not call the injected runner when the probe-backed bridge is not ready', () => {
    const plan = createExamplePlan(examplePlanCards[0].id);
    const { adapterValidation, prototypeCloseout } = readyPrototypeCloseout();
    const bridge = selectDetailedStressProbeBackedRunnerBridge({
      prototypeCloseout,
      probeCoverage: selectDetailedStressProbeCoverage({ monteCarloCovered: false })
    });
    let calls = 0;
    const bridgeRun = runDetailedStressProbeBackedBridge({
      plan,
      adapterValidation,
      bridge,
      runner: () => {
        calls += 1;
        return {
          shape: 'existingDetailedStressShape',
          status: 'complete',
          fullSpendingFundedRate: 0.9,
          monteCarloRunCount: 200,
          historicalSequenceCount: 4,
          notes: []
        };
      }
    });

    expect(calls).toBe(0);
    expect(bridgeRun.status).toBe('blocked');
    expect(bridgeRun.prototype.runnerCalled).toBe(false);
  });

  it('closes the bridge batch as ready for manual detailed-report comparison', () => {
    const plan = createExamplePlan(examplePlanCards[0].id);
    const probeCoverage = selectDetailedStressProbeCoverage();
    const { adapterValidation, prototypeCloseout } = readyPrototypeCloseout();
    const bridge = selectDetailedStressProbeBackedRunnerBridge({ prototypeCloseout, probeCoverage });
    const bridgeRun = runDetailedStressProbeBackedBridge({
      plan,
      adapterValidation,
      bridge,
      runner: () => ({
        shape: 'existingDetailedStressShape',
        status: 'complete',
        fullSpendingFundedRate: 0.85,
        monteCarloRunCount: 200,
        historicalSequenceCount: 4,
        notes: []
      })
    });
    const closeout = selectDetailedStressBridgeBatchCloseout({ probeCoverage, bridge, bridgeRun });

    expect(closeout).toMatchObject({
      status: 'readyForManualReportComparison',
      disposition: 'detailedStressBridgeBatchCloseoutOnly'
    });
    expect(closeout.rows.map((row) => row.id)).toEqual(['coverage', 'bridge', 'bridgeRun', 'nextStep']);
    expect(closeout.reviewNote).toContain('does not migrate detailed stress execution');
  });

  function readyBridgeRun({
    fullSpendingFundedRate = 0.85,
    monteCarloRunCount = 200,
    historicalSequenceCount = 4
  }: {
    fullSpendingFundedRate?: number;
    monteCarloRunCount?: number;
    historicalSequenceCount?: number;
  } = {}) {
    const plan = createExamplePlan(examplePlanCards[0].id);
    const probeCoverage = selectDetailedStressProbeCoverage();
    const { adapterValidation, prototypeCloseout } = readyPrototypeCloseout();
    const bridge = selectDetailedStressProbeBackedRunnerBridge({ prototypeCloseout, probeCoverage });
    const bridgeRun = runDetailedStressProbeBackedBridge({
      plan,
      adapterValidation,
      bridge,
      runner: () => ({
        shape: 'existingDetailedStressShape',
        status: 'complete',
        fullSpendingFundedRate,
        monteCarloRunCount,
        historicalSequenceCount,
        notes: []
      })
    });
    return { plan, bridgeRun };
  }

  it('compares bridge output to detailed-report reference metadata without migration', () => {
    const { bridgeRun } = readyBridgeRun();
    const reference = createDetailedStressManualReportReference({
      fullSpendingFundedRate: 0.85,
      monteCarloRunCount: 200,
      historicalSequenceCount: 4
    });
    const comparison = selectDetailedStressManualReportComparison({ bridgeRun, reference });

    expect(reference).toMatchObject({
      source: 'detailedReportReference',
      persistedOutput: 'none',
      disposition: 'detailedStressManualReportReferenceOnly'
    });
    expect(comparison).toMatchObject({
      status: 'aligned',
      disposition: 'detailedStressManualReportComparisonOnly'
    });
    expect(comparison.rows.map((row) => row.id)).toEqual([
      'bridgeRun',
      'shape',
      'fullSpendingFunded',
      'monteCarloRuns',
      'historicalSequences',
      'savedPlan'
    ]);
    expect(comparison.rows.every((row) => row.status === 'aligned')).toBe(true);
    expect(comparison.reviewNote).toContain('does not migrate Monte Carlo');
  });

  it('marks manual comparison for review when detailed stress metrics differ', () => {
    const { bridgeRun } = readyBridgeRun({ fullSpendingFundedRate: 0.85, monteCarloRunCount: 200 });
    const reference = createDetailedStressManualReportReference({
      fullSpendingFundedRate: 0.8,
      monteCarloRunCount: 500,
      historicalSequenceCount: 4
    });
    const comparison = selectDetailedStressManualReportComparison({ bridgeRun, reference });

    expect(comparison.status).toBe('needsReview');
    expect(comparison.rows.find((row) => row.id === 'fullSpendingFunded')).toMatchObject({ status: 'review' });
    expect(comparison.rows.find((row) => row.id === 'monteCarloRuns')).toMatchObject({ status: 'review' });
    expect(comparison.rows.find((row) => row.id === 'historicalSequences')).toMatchObject({ status: 'aligned' });
  });

  it('blocks manual comparison when bridge run or saved-plan boundaries are not clean', () => {
    const plan = createExamplePlan(examplePlanCards[0].id);
    const { adapterValidation, prototypeCloseout } = readyPrototypeCloseout();
    const bridge = selectDetailedStressProbeBackedRunnerBridge({
      prototypeCloseout,
      probeCoverage: selectDetailedStressProbeCoverage({ parityCovered: false })
    });
    const bridgeRun = runDetailedStressProbeBackedBridge({ plan, adapterValidation, bridge });
    const reference = createDetailedStressManualReportReference({
      fullSpendingFundedRate: 0.85,
      monteCarloRunCount: 200,
      historicalSequenceCount: 4
    });
    const comparison = selectDetailedStressManualReportComparison({
      bridgeRun,
      reference,
      savedPlanClean: false
    });

    expect(comparison.status).toBe('blocked');
    expect(comparison.rows.find((row) => row.id === 'bridgeRun')).toMatchObject({ status: 'blocked' });
    expect(comparison.rows.find((row) => row.id === 'savedPlan')).toMatchObject({ status: 'blocked' });
  });

  it('closes aligned manual comparison as ready for a migration-or-deferral decision', () => {
    const { bridgeRun } = readyBridgeRun();
    const reference = createDetailedStressManualReportReference({
      fullSpendingFundedRate: 0.85,
      monteCarloRunCount: 200,
      historicalSequenceCount: 4
    });
    const comparison = selectDetailedStressManualReportComparison({ bridgeRun, reference });
    const closeout = selectDetailedStressManualComparisonCloseout({ comparison });

    expect(closeout).toMatchObject({
      status: 'readyForStressMigrationDecision',
      disposition: 'detailedStressManualComparisonCloseoutOnly'
    });
    expect(closeout.rows.map((row) => row.id)).toEqual(['comparison', 'executionBoundary', 'persistence', 'nextDecision']);
    expect(closeout.rows.find((row) => row.id === 'executionBoundary')).toMatchObject({ status: 'hold' });
    expect(closeout.reviewNote).toContain('does not alter stress calculations');
  });

  it('holds migration decisions when manual comparison needs review', () => {
    const { bridgeRun } = readyBridgeRun({ historicalSequenceCount: 3 });
    const reference = createDetailedStressManualReportReference({
      fullSpendingFundedRate: 0.85,
      monteCarloRunCount: 200,
      historicalSequenceCount: 4
    });
    const comparison = selectDetailedStressManualReportComparison({ bridgeRun, reference });
    const closeout = selectDetailedStressManualComparisonCloseout({ comparison });

    expect(closeout.status).toBe('holdDetailedStress');
    expect(closeout.rows.find((row) => row.id === 'comparison')).toMatchObject({ status: 'hold' });
    expect(closeout.rows.find((row) => row.id === 'nextDecision')).toMatchObject({ status: 'hold' });
  });

  function readyManualComparisonCloseout() {
    const { bridgeRun } = readyBridgeRun();
    const reference = createDetailedStressManualReportReference({
      fullSpendingFundedRate: 0.85,
      monteCarloRunCount: 200,
      historicalSequenceCount: 4
    });
    const comparison = selectDetailedStressManualReportComparison({ bridgeRun, reference });
    return selectDetailedStressManualComparisonCloseout({ comparison });
  }

  it('decides to defer detailed stress migration for v1 when comparison is clean and product value is low', () => {
    const decision = selectDetailedStressV1MigrationDecision({
      comparisonCloseout: readyManualComparisonCloseout()
    });

    expect(decision).toMatchObject({
      status: 'deferMigrationForV1',
      decision: 'keepDetailedReportForV1',
      disposition: 'detailedStressV1MigrationDecisionOnly'
    });
    expect(decision.rows.map((row) => row.id)).toEqual([
      'comparison',
      'consumerValue',
      'migrationRisk',
      'v1Scope',
      'savedPlan'
    ]);
    expect(decision.rows.every((row) => row.status === 'ready')).toBe(true);
    expect(decision.nextStep).toContain('Return to v1 recommended-plan');
    expect(decision.reviewNote).toContain('does not move Monte Carlo');
  });

  it('marks the v1 detailed stress decision for review when consumer value is high or migration risk is low', () => {
    const decision = selectDetailedStressV1MigrationDecision({
      comparisonCloseout: readyManualComparisonCloseout(),
      consumerValue: 'high',
      migrationRisk: 'low'
    });

    expect(decision.status).toBe('needsReview');
    expect(decision.decision).toBe('reviewBeforeDecision');
    expect(decision.rows.find((row) => row.id === 'consumerValue')).toMatchObject({ status: 'review' });
    expect(decision.rows.find((row) => row.id === 'migrationRisk')).toMatchObject({ status: 'review' });
  });

  it('blocks the v1 detailed stress decision when comparison or saved-plan boundaries fail', () => {
    const { bridgeRun } = readyBridgeRun();
    const reference = createDetailedStressManualReportReference({
      fullSpendingFundedRate: 0.85,
      monteCarloRunCount: 200,
      historicalSequenceCount: 4
    });
    const comparison = selectDetailedStressManualReportComparison({ bridgeRun, reference, savedPlanClean: false });
    const comparisonCloseout = selectDetailedStressManualComparisonCloseout({ comparison });
    const decision = selectDetailedStressV1MigrationDecision({ comparisonCloseout, savedPlanClean: false });

    expect(decision.status).toBe('blocked');
    expect(decision.decision).toBe('blocked');
    expect(decision.rows.find((row) => row.id === 'comparison')).toMatchObject({ status: 'blocked' });
    expect(decision.rows.find((row) => row.id === 'savedPlan')).toMatchObject({ status: 'blocked' });
  });

  it('closes deferred detailed stress decision as ready to return to v1 drawdown work', () => {
    const decision = selectDetailedStressV1MigrationDecision({
      comparisonCloseout: readyManualComparisonCloseout()
    });
    const closeout = selectDetailedStressV1DecisionCloseout({ decision });

    expect(closeout).toMatchObject({
      status: 'readyToReturnToV1Drawdown',
      disposition: 'detailedStressV1DecisionCloseoutOnly'
    });
    expect(closeout.rows.map((row) => row.id)).toEqual([
      'decision',
      'detailedReportHandoff',
      'reactScope',
      'nextWork'
    ]);
    expect(closeout.rows.find((row) => row.id === 'detailedReportHandoff')).toMatchObject({ status: 'ready' });
    expect(closeout.reviewNote).toContain('does not change optimizer behavior');
  });

  it('holds closeout when detailed stress decision still needs review', () => {
    const decision = selectDetailedStressV1MigrationDecision({
      comparisonCloseout: readyManualComparisonCloseout(),
      consumerValue: 'high'
    });
    const closeout = selectDetailedStressV1DecisionCloseout({ decision });

    expect(closeout.status).toBe('holdDetailedStress');
    expect(closeout.rows.find((row) => row.id === 'decision')).toMatchObject({ status: 'hold' });
    expect(closeout.rows.find((row) => row.id === 'nextWork')).toMatchObject({ status: 'hold' });
  });
});
