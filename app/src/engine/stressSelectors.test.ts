import { describe, expect, it } from 'vitest';
import { createExamplePlan, examplePlanCards } from '../data/examplePlans';
import { createPlanFile } from '../data/planFile';
import type { SimulationResult } from '../types/plan';
import { runResultsPreviewBundle } from './previewScenarios';
import type { SimulationConfig } from './runSimulation';
import {
  runSpendingStressResults,
  selectDetailedStressAdapterBatchCloseout,
  selectDetailedStressAdapterContract,
  selectDetailedStressAdapterValidation,
  selectDetailedStressBoundaryReview,
  selectDetailedStressMigrationCloseout,
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
});
