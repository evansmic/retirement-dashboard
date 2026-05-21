import { describe, expect, it } from 'vitest';
import { createPlanFile } from '../data/planFile';
import type { SimulationResult, V2PlanPayload } from '../types/plan';
import { runSingleDrawdownComparison } from './drawdownComparison';
import {
  buildDrawdownAnnualOverrideAdapterDraft,
  buildDrawdownExecutionContract,
  buildTaxAwareDrawdownV1ExecutionCandidate,
  drawdownExecutionSavedPlanGuard,
  emptyMockedExecutionScorecard,
  runContainedDrawdownExecutionPrototype,
  runInternalDrawdownDryRun,
  runTaxAwareDrawdownV1Execution,
  scoreMockedDrawdownAdapterResult,
  selectContainedDrawdownBlockerRegister,
  selectContainedDrawdownCopyGuard,
  selectContainedDrawdownDetailsDensity,
  selectContainedDrawdownExplanation,
  selectContainedDrawdownExampleGate,
  selectContainedDrawdownExamplePromotionGate,
  selectContainedDrawdownLimitations,
  selectContainedDrawdownMateriality,
  selectContainedDrawdownNextStepGuide,
  selectContainedDrawdownPhaseMilestoneCloseout,
  selectContainedDrawdownProductGoNoGo,
  selectContainedDrawdownPromotionReadiness,
  selectContainedDrawdownPrototypeSummary,
  selectContainedDrawdownReviewChecklist,
  selectContainedDrawdownUsefulnessCloseout,
  selectDrawdownAdapterAuditTrail,
  selectDrawdownExecutionBoundaryDecision,
  selectDrawdownExecutionContainmentGuard,
  selectDrawdownExecutionExampleMatrixCheckpoint,
  selectDrawdownExecutionPhaseCloseout,
  selectDrawdownExecutionPreflight,
  selectDrawdownExecutionPrototypeGoNoGo,
  selectDrawdownPhaseReview,
  selectDrawdownPrototypeReadinessReview,
  selectDrawdownReviewPreview,
  selectDrawdownVisibleReviewGate,
  selectTaxAwareDrawdownV1ExampleGate,
  selectTaxAwareDrawdownV1ConsumerCloseout,
  selectTaxAwareDrawdownV1ConsumerExampleGate,
  selectTaxAwareDrawdownV1ConsumerLimits,
  selectTaxAwareDrawdownV1ConsumerSummary,
  selectTaxAwareDrawdownV1ExecutionIntent,
  selectTaxAwareDrawdownV1ExecutionReview,
  selectTaxAwareDrawdownV1PhaseCloseout,
  selectTaxAwareDrawdownV1SafetyChecklist,
  selectTaxAwareDrawdownV1UxComparisonCard,
  selectTaxAwareDrawdownV1UxCopyGuard,
  selectTaxAwareDrawdownV1UxHeadline,
  selectTaxAwareDrawdownV1UxReadinessCloseout,
  selectTaxAwareDrawdownV1UxReviewActions,
  validateDrawdownAnnualOverrideAdapter,
  validateRuntimeDrawdownPayload,
  type DrawdownAnnualOverrideAdapterDraft,
  type RuntimeDrawdownOverridePayload
} from './drawdownExecutionReadiness';

const plan: V2PlanPayload = {
  schemaVersion: 2,
  title: 'Drawdown execution readiness plan',
  p1: {
    name: 'Avery',
    dob: 1962,
    retireYear: 2028,
    rrsp: 300000,
    tfsa: 90000,
    nonreg: 50000,
    cpp65_monthly: 1268,
    cpp70_monthly: 1800,
    oas_monthly: 742
  },
  p2: {
    name: '',
    dob: 0,
    retireYear: 0,
    rrsp: 0,
    tfsa: 0,
    lif: 0,
    lira: 0,
    nonreg: 0,
    cpp65_monthly: 0,
    oas_monthly: 0
  },
  spending: { gogo: 70000, gogoEnd: 75, slowgo: 50000, slowgoEnd: 85, nogo: 42000 },
  inheritance: 0,
  cashWedge: { balance: 40000, returnRate: 0.03, targetYears: 2 },
  assumptions: { retireYear: 2028, planEnd: 2060, returnRate: 0.0436, inflation: 0.021, p1DiesInSurvivor: 2035 }
};

const baseline: SimulationResult = {
  years: [
    {
      year: 2028,
      ageF: 66,
      ageM: 0,
      spending: 70000,
      grossIncome: 42000,
      taxableIncome: 42000,
      totalTaxYear: 3500,
      totalOasClawY: 0,
      rrif_draw_f: 0,
      tfsa_draw: 0,
      nonreg_draw: 0,
      cash_draw: 0,
      shortfall: 0,
      totalAftaxYear: 70000,
      bal_total: 600000,
      bal_rrsp: 300000
    },
    {
      year: 2029,
      ageF: 67,
      ageM: 0,
      spending: 70000,
      grossIncome: 125000,
      taxableIncome: 125000,
      totalTaxYear: 31000,
      totalOasClawY: 4200,
      rrif_draw_f: 65000,
      tfsa_draw: 0,
      nonreg_draw: 0,
      cash_draw: 0,
      shortfall: 0,
      totalAftaxYear: 70000,
      bal_total: 500000,
      bal_rrsp: 260000
    }
  ]
};

const comparisonCandidate: SimulationResult = {
  years: [
    {
      ...baseline.years[0],
      totalTaxYear: 7000,
      rrif_draw_f: 10000,
      taxableIncome: 52000,
      bal_rrsp: 292000,
      bal_total: 590000
    },
    {
      ...baseline.years[1],
      totalTaxYear: 22000,
      totalOasClawY: 1000,
      rrif_draw_f: 52000,
      taxableIncome: 108000,
      bal_rrsp: 250000,
      bal_total: 505000
    }
  ]
};

describe('drawdown execution readiness contract', () => {
  it('creates one runtime-only payload shape when the decision gate is eligible', () => {
    const comparison = runSingleDrawdownComparison(plan, (_plan, config) => (config.meltdown ? comparisonCandidate : baseline));
    const contract = buildDrawdownExecutionContract({ plan, comparison });

    expect(contract).toMatchObject({
      status: 'readyForInternalDryRun',
      withdrawalStrategy: { mode: 'currentOrder', annualOverrides: [] },
      disposition: 'runtimeContractOnly'
    });
    expect(contract.payloads).toHaveLength(1);
    expect(contract.payloads[0]).toMatchObject({
      disposition: 'runtimeReviewDraftOnly',
      accountBucket: 'registered',
      amountBand: 'upTo10000'
    });
    expect(contract.reviewNote).toContain('annual overrides empty');
  });

  it('keeps payloads out when the gate is held back', () => {
    const weakCandidate: SimulationResult = {
      years: comparisonCandidate.years.map((row, index) => ({
        ...row,
        shortfall: index === 1 ? 1000 : 0
      }))
    };
    const comparison = runSingleDrawdownComparison(plan, (_plan, config) => (config.meltdown ? weakCandidate : baseline));
    const contract = buildDrawdownExecutionContract({ plan, comparison });

    expect(contract.status).toBe('blocked');
    expect(contract.payloads).toEqual([]);
    expect(contract.withdrawalStrategy).toEqual({ mode: 'currentOrder', annualOverrides: [] });
  });

  it('validates payload years, account buckets, amount bands, and saved-plan boundary', () => {
    const payload: RuntimeDrawdownOverridePayload = {
      disposition: 'runtimeReviewDraftOnly',
      year: 2027,
      accountBucket: 'cash',
      direction: 'increase',
      amountBand: 'upTo5000',
      evidenceSource: 'decisionGate',
      reviewReason: 'Test payload'
    };

    const rows = validateRuntimeDrawdownPayload(
      { ...plan, cashWedge: { balance: 0, returnRate: 0.03, targetYears: 2 } },
      {
        status: 'eligibleForReview',
        headline: 'Eligible for review, not a recommendation.',
        summary: 'Ready for review.',
        nextStep: 'Keep it internal.',
        detail: 'No plan change.',
        rows: [],
        reviewNote: 'review-only'
      },
      payload
    );

    expect(rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'year', status: 'blocked' }),
        expect.objectContaining({ id: 'bucket', status: 'needsInput' }),
        expect.objectContaining({ id: 'amount', status: 'ok' }),
        expect.objectContaining({ id: 'savedPlan', status: 'ok' })
      ])
    );
  });

  it('runs one internal dry-run only behind the test-only flag', () => {
    const comparison = runSingleDrawdownComparison(plan, (_plan, config) => (config.meltdown ? comparisonCandidate : baseline));
    const contract = buildDrawdownExecutionContract({ plan, comparison });
    const dryRun = runInternalDrawdownDryRun({
      plan,
      contract,
      testOnly: true,
      runner: (_plan, config) => (config.meltdown ? comparisonCandidate : baseline)
    });

    expect(dryRun).toMatchObject({
      status: 'reviewOnly',
      payloadAccepted: true,
      disposition: 'testOnlyInternalDryRun'
    });
    expect(dryRun.evidenceRows.map((row) => row.id)).toEqual(['funding', 'tax', 'oasRecovery', 'estate']);
    expect(dryRun.reviewNote).toContain('Test-only internal dry-run');

    const blocked = runInternalDrawdownDryRun({ plan, contract, testOnly: false });
    expect(blocked).toMatchObject({ status: 'blocked', payloadAccepted: false });
  });

  it('keeps execution contract and dry-run output out of saved plan files', () => {
    const saved = createPlanFile(plan);
    expect(drawdownExecutionSavedPlanGuard(plan)).toBe(true);
    expect(saved.plan).not.toHaveProperty('drawdownExecutionContract');
    expect(saved.plan).not.toHaveProperty('runtimeDrawdownOverridePayload');
    expect(saved.plan).not.toHaveProperty('internalDrawdownDryRun');
    expect(saved.plan).not.toHaveProperty('drawdownVisibleReviewGate');
    expect(saved.plan).not.toHaveProperty('drawdownReviewPreview');
    expect(saved.plan).not.toHaveProperty('drawdownPhaseReview');
    expect(saved.plan).not.toHaveProperty('drawdownExecutionBoundaryDecision');
    expect(saved.plan).not.toHaveProperty('drawdownAnnualOverrideAdapter');
    expect(saved.plan).not.toHaveProperty('drawdownAdapterValidation');
    expect(saved.plan).not.toHaveProperty('mockedExecutionScorecard');
    expect(saved.plan).not.toHaveProperty('drawdownExecutionPrototypeGoNoGo');
    expect(saved.plan).not.toHaveProperty('drawdownExecutionPreflight');
    expect(saved.plan).not.toHaveProperty('drawdownAdapterAuditTrail');
    expect(saved.plan).not.toHaveProperty('drawdownExecutionContainmentGuard');
    expect(saved.plan).not.toHaveProperty('drawdownExecutionExampleMatrixCheckpoint');
    expect(saved.plan).not.toHaveProperty('drawdownExecutionPhaseCloseout');
    expect(saved.plan).not.toHaveProperty('containedDrawdownExecutionPrototype');
    expect(saved.plan).not.toHaveProperty('containedDrawdownPrototypeSummary');
    expect(saved.plan).not.toHaveProperty('containedDrawdownMateriality');
    expect(saved.plan).not.toHaveProperty('containedDrawdownExplanation');
    expect(saved.plan).not.toHaveProperty('containedDrawdownLimitations');
    expect(saved.plan).not.toHaveProperty('containedDrawdownUsefulnessCloseout');
    expect(saved.plan).not.toHaveProperty('containedDrawdownDetailsDensity');
    expect(saved.plan).not.toHaveProperty('containedDrawdownReviewChecklist');
    expect(saved.plan).not.toHaveProperty('containedDrawdownExampleGate');
    expect(saved.plan).not.toHaveProperty('containedDrawdownCopyGuard');
    expect(saved.plan).not.toHaveProperty('containedDrawdownProductGoNoGo');
    expect(saved.plan).not.toHaveProperty('containedDrawdownPromotionReadiness');
    expect(saved.plan).not.toHaveProperty('containedDrawdownNextStepGuide');
    expect(saved.plan).not.toHaveProperty('containedDrawdownBlockerRegister');
    expect(saved.plan).not.toHaveProperty('containedDrawdownExamplePromotionGate');
    expect(saved.plan).not.toHaveProperty('containedDrawdownPhaseMilestoneCloseout');
    expect(saved.plan).not.toHaveProperty('v1DrawdownExecutionIntent');
    expect(saved.plan).not.toHaveProperty('v1DrawdownExecutionCandidate');
    expect(saved.plan).not.toHaveProperty('v1DrawdownExecutionResult');
    expect(saved.plan).not.toHaveProperty('v1DrawdownExecutionReview');
    expect(saved.plan).not.toHaveProperty('v1DrawdownExecutionExampleGate');
    expect(saved.plan).not.toHaveProperty('v1DrawdownExecutionPhaseCloseout');
    expect(saved.plan).not.toHaveProperty('v1DrawdownConsumerSummary');
    expect(saved.plan).not.toHaveProperty('v1DrawdownSafetyChecklist');
    expect(saved.plan).not.toHaveProperty('v1DrawdownConsumerLimits');
    expect(saved.plan).not.toHaveProperty('v1DrawdownConsumerExampleGate');
    expect(saved.plan).not.toHaveProperty('v1DrawdownConsumerCloseout');
    expect(saved.plan).not.toHaveProperty('v1DrawdownUxHeadline');
    expect(saved.plan).not.toHaveProperty('v1DrawdownUxComparisonCard');
    expect(saved.plan).not.toHaveProperty('v1DrawdownUxReviewActions');
    expect(saved.plan).not.toHaveProperty('v1DrawdownUxCopyGuard');
    expect(saved.plan).not.toHaveProperty('v1DrawdownUxReadinessCloseout');
    expect(saved.plan).not.toHaveProperty('annualOverrides');
    expect(saved.plan).not.toHaveProperty('withdrawalStrategy');
  });

  it('summarizes prototype readiness without creating product execution', () => {
    const comparison = runSingleDrawdownComparison(plan, (_plan, config) => (config.meltdown ? comparisonCandidate : baseline));
    const contract = buildDrawdownExecutionContract({ plan, comparison });
    const dryRun = runInternalDrawdownDryRun({
      plan,
      contract,
      testOnly: true,
      runner: (_plan, config) => (config.meltdown ? comparisonCandidate : baseline)
    });
    const review = selectDrawdownPrototypeReadinessReview({ plan, comparison, contract, dryRun });

    expect(review).toMatchObject({
      status: 'readyForNarrowPrototype',
      disposition: 'readinessReviewOnly'
    });
    expect(review.rows.map((row) => row.id)).toEqual(['decisionGate', 'contract', 'savedPlan', 'dryRun', 'copyBoundary']);
    expect(review.reviewNote).toContain('Readiness review only');
    expect(JSON.stringify(review).toLowerCase()).not.toContain('recommended withdrawal strategy');
    expect(JSON.stringify(review).toLowerCase()).not.toContain('optimal drawdown');
  });

  it('allows a visible Details preview only after the final review gate passes', () => {
    const comparison = runSingleDrawdownComparison(plan, (_plan, config) => (config.meltdown ? comparisonCandidate : baseline));
    const contract = buildDrawdownExecutionContract({ plan, comparison });
    const gate = selectDrawdownVisibleReviewGate({ plan, comparison, contract });
    const preview = selectDrawdownReviewPreview({ gate, comparison, spendingStressStatus: 'balanced' });

    expect(gate).toMatchObject({
      status: 'readyForVisibleReview',
      disposition: 'visibleReviewGateOnly'
    });
    expect(preview).toMatchObject({
      status: 'visibleForReview',
      headline: 'Drawdown review preview',
      disposition: 'detailsPreviewOnly'
    });
    expect(preview.rows.map((row) => row.id)).toEqual(['funding', 'tax', 'oasRecovery', 'estate']);
    expect(preview.detail).toContain('does not tell you which account to withdraw from');
    expect(preview.reviewNote).toContain('Review preview only');
  });

  it('holds back the visible preview when spending stress is fragile', () => {
    const comparison = runSingleDrawdownComparison(plan, (_plan, config) => (config.meltdown ? comparisonCandidate : baseline));
    const contract = buildDrawdownExecutionContract({ plan, comparison });
    const gate = selectDrawdownVisibleReviewGate({ plan, comparison, contract });
    const preview = selectDrawdownReviewPreview({ gate, comparison, spendingStressStatus: 'fragile' });

    expect(preview.status).toBe('heldBack');
    expect(preview.rows).toEqual([]);
    expect(preview.detail).toContain('spending stress');
  });

  it('blocks the final visible gate when funding harm is present', () => {
    const weakCandidate: SimulationResult = {
      years: comparisonCandidate.years.map((row, index) => ({
        ...row,
        shortfall: index === 1 ? 1000 : 0
      }))
    };
    const comparison = runSingleDrawdownComparison(plan, (_plan, config) => (config.meltdown ? weakCandidate : baseline));
    const contract = buildDrawdownExecutionContract({ plan, comparison });
    const gate = selectDrawdownVisibleReviewGate({ plan, comparison, contract });
    const preview = selectDrawdownReviewPreview({ gate, comparison, spendingStressStatus: 'balanced' });

    expect(gate.status).toBe('blocked');
    expect(gate.rows).toEqual(expect.arrayContaining([expect.objectContaining({ id: 'decisionGate', status: 'blocked' })]));
    expect(preview.status).toBe('blocked');
  });

  it('summarizes drawdown phase go or hold status without adding execution', () => {
    const comparison = runSingleDrawdownComparison(plan, (_plan, config) => (config.meltdown ? comparisonCandidate : baseline));
    const contract = buildDrawdownExecutionContract({ plan, comparison });
    const gate = selectDrawdownVisibleReviewGate({ plan, comparison, contract });
    const preview = selectDrawdownReviewPreview({ gate, comparison, spendingStressStatus: 'balanced' });
    const phase = selectDrawdownPhaseReview({ plan, gate, preview });

    expect(phase).toMatchObject({
      status: 'readyToContinue',
      disposition: 'phaseReviewOnly'
    });
    expect(phase.rows.map((row) => row.id)).toEqual(['gate', 'preview', 'examples', 'stress', 'copy', 'savedPlan']);
    expect(phase.reviewNote).toContain('Phase review only');
  });

  it('decides whether drawdown execution should stay preview-only or proceed to adapter work', () => {
    const comparison = runSingleDrawdownComparison(plan, (_plan, config) => (config.meltdown ? comparisonCandidate : baseline));
    const contract = buildDrawdownExecutionContract({ plan, comparison });
    const gate = selectDrawdownVisibleReviewGate({ plan, comparison, contract });
    const preview = selectDrawdownReviewPreview({ gate, comparison, spendingStressStatus: 'balanced' });
    const phase = selectDrawdownPhaseReview({ plan, gate, preview });
    const boundary = selectDrawdownExecutionBoundaryDecision({ plan, phase, preview });

    expect(boundary).toMatchObject({
      status: 'readyForTinyExecutionPrototype',
      disposition: 'executionBoundaryDecisionOnly'
    });
    expect(boundary.reviewNote).toContain('Boundary decision only');

    const heldBoundary = selectDrawdownExecutionBoundaryDecision({ plan, phase, preview, examplesAllClear: false });
    expect(heldBoundary.status).toBe('hardenMore');
  });

  it('builds a runtime-only adapter draft and rejects unsafe adapter shapes', () => {
    const comparison = runSingleDrawdownComparison(plan, (_plan, config) => (config.meltdown ? comparisonCandidate : baseline));
    const contract = buildDrawdownExecutionContract({ plan, comparison });
    const gate = selectDrawdownVisibleReviewGate({ plan, comparison, contract });
    const preview = selectDrawdownReviewPreview({ gate, comparison, spendingStressStatus: 'balanced' });
    const phase = selectDrawdownPhaseReview({ plan, gate, preview });
    const boundary = selectDrawdownExecutionBoundaryDecision({ plan, phase, preview });
    const adapterValidation = buildDrawdownAnnualOverrideAdapterDraft({ plan, boundary, contract });

    expect(adapterValidation).toMatchObject({
      status: 'acceptedForMockScoring',
      disposition: 'adapterValidationOnly'
    });
    expect(adapterValidation.adapter).toMatchObject({
      disposition: 'adapterDraftOnly',
      accountBucket: 'registered',
      amount: 10000,
      sourcePayload: 'runtimeReviewDraftOnly'
    });
    expect(adapterValidation.reviewNote).toContain('does not call the engine');

    const badAdapter: DrawdownAnnualOverrideAdapterDraft = {
      disposition: 'adapterDraftOnly',
      year: 2027,
      accountBucket: 'cash',
      direction: 'increase',
      amount: -1,
      sourcePayload: 'runtimeReviewDraftOnly'
    };
    const rejected = validateDrawdownAnnualOverrideAdapter({
      plan: { ...plan, cashWedge: { balance: 0, returnRate: 0.03, targetYears: 2 } },
      boundary,
      adapter: badAdapter
    });

    expect(rejected.status).toBe('rejected');
    expect(rejected.adapter).toBeNull();
    expect(rejected.rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'year', status: 'blocked' }),
        expect.objectContaining({ id: 'bucket', status: 'blocked' }),
        expect.objectContaining({ id: 'amount', status: 'blocked' })
      ])
    );
  });

  it('scores a mocked adapter result and blocks funding or estate harm', () => {
    const comparison = runSingleDrawdownComparison(plan, (_plan, config) => (config.meltdown ? comparisonCandidate : baseline));
    const contract = buildDrawdownExecutionContract({ plan, comparison });
    const gate = selectDrawdownVisibleReviewGate({ plan, comparison, contract });
    const preview = selectDrawdownReviewPreview({ gate, comparison, spendingStressStatus: 'balanced' });
    const phase = selectDrawdownPhaseReview({ plan, gate, preview });
    const boundary = selectDrawdownExecutionBoundaryDecision({ plan, phase, preview });
    const adapterValidation = buildDrawdownAnnualOverrideAdapterDraft({ plan, boundary, contract });
    const scorecard = scoreMockedDrawdownAdapterResult({
      baseline,
      candidate: comparisonCandidate,
      adapterValidation
    });

    expect(scorecard).toMatchObject({
      status: 'reviewOnly',
      disposition: 'mockedScorecardOnly'
    });
    expect(scorecard.rows.map((row) => row.id)).toEqual(['funding', 'tax', 'oasRecovery', 'estate']);
    expect(scorecard.reviewNote).toContain('Mocked scorecard only');

    const harmfulCandidate: SimulationResult = {
      years: comparisonCandidate.years.map((row, index) => ({
        ...row,
        shortfall: index === 1 ? 1000 : 0,
        bal_total: index === 1 ? 450000 : row.bal_total
      }))
    };
    const blocked = scoreMockedDrawdownAdapterResult({
      baseline,
      candidate: harmfulCandidate,
      adapterValidation,
      estateTarget: 100000
    });
    expect(blocked.status).toBe('blocked');
    expect(blocked.rows.some((row) => row.status === 'blocked')).toBe(true);
  });

  it('summarizes execution prototype go/no-go without adding execution', () => {
    const comparison = runSingleDrawdownComparison(plan, (_plan, config) => (config.meltdown ? comparisonCandidate : baseline));
    const contract = buildDrawdownExecutionContract({ plan, comparison });
    const gate = selectDrawdownVisibleReviewGate({ plan, comparison, contract });
    const preview = selectDrawdownReviewPreview({ gate, comparison, spendingStressStatus: 'balanced' });
    const phase = selectDrawdownPhaseReview({ plan, gate, preview });
    const boundary = selectDrawdownExecutionBoundaryDecision({ plan, phase, preview });
    const adapterValidation = buildDrawdownAnnualOverrideAdapterDraft({ plan, boundary, contract });
    const scorecard = scoreMockedDrawdownAdapterResult({ baseline, candidate: comparisonCandidate, adapterValidation });
    const goNoGo = selectDrawdownExecutionPrototypeGoNoGo({ plan, boundary, adapterValidation, scorecard });

    expect(goNoGo).toMatchObject({
      status: 'readyForOneRealPrototype',
      disposition: 'executionPrototypeGoNoGoOnly'
    });
    expect(goNoGo.rows.map((row) => row.id)).toEqual(['boundary', 'adapter', 'scorecard', 'savedPlan', 'productScope']);
    expect(goNoGo.reviewNote).toContain('Execution prototype go/no-go only');

    const hold = selectDrawdownExecutionPrototypeGoNoGo({
      plan,
      boundary,
      adapterValidation,
      scorecard: emptyMockedExecutionScorecard()
    });
    expect(hold.status).toBe('holdForAdapterGuardrails');
  });

  it('summarizes execution preflight without opening a product path', () => {
    const comparison = runSingleDrawdownComparison(plan, (_plan, config) => (config.meltdown ? comparisonCandidate : baseline));
    const contract = buildDrawdownExecutionContract({ plan, comparison });
    const gate = selectDrawdownVisibleReviewGate({ plan, comparison, contract });
    const preview = selectDrawdownReviewPreview({ gate, comparison, spendingStressStatus: 'balanced' });
    const phase = selectDrawdownPhaseReview({ plan, gate, preview });
    const boundary = selectDrawdownExecutionBoundaryDecision({ plan, phase, preview });
    const adapterValidation = buildDrawdownAnnualOverrideAdapterDraft({ plan, boundary, contract });
    const scorecard = scoreMockedDrawdownAdapterResult({ baseline, candidate: comparisonCandidate, adapterValidation });
    const goNoGo = selectDrawdownExecutionPrototypeGoNoGo({ plan, boundary, adapterValidation, scorecard });
    const preflight = selectDrawdownExecutionPreflight({ plan, adapterValidation, goNoGo });

    expect(preflight).toMatchObject({
      status: 'holdForMissingEvidence',
      disposition: 'executionPreflightOnly'
    });
    expect(preflight.rows.map((row) => row.id)).toEqual(['goNoGo', 'adapter', 'accountMix', 'lockedIn', 'savedPlan', 'productPath']);
    expect(preflight.reviewNote).toContain('Preflight only');
    expect(JSON.stringify(preflight).toLowerCase()).not.toContain('recommended withdrawal strategy');
  });

  it('creates an adapter audit trail without creating account instructions', () => {
    const comparison = runSingleDrawdownComparison(plan, (_plan, config) => (config.meltdown ? comparisonCandidate : baseline));
    const contract = buildDrawdownExecutionContract({ plan, comparison });
    const gate = selectDrawdownVisibleReviewGate({ plan, comparison, contract });
    const preview = selectDrawdownReviewPreview({ gate, comparison, spendingStressStatus: 'balanced' });
    const phase = selectDrawdownPhaseReview({ plan, gate, preview });
    const boundary = selectDrawdownExecutionBoundaryDecision({ plan, phase, preview });
    const adapterValidation = buildDrawdownAnnualOverrideAdapterDraft({ plan, boundary, contract });
    const auditTrail = selectDrawdownAdapterAuditTrail(adapterValidation);

    expect(auditTrail).toMatchObject({
      status: 'availableForReview',
      disposition: 'adapterAuditTrailOnly'
    });
    expect(auditTrail.rows.map((row) => row.id)).toEqual(['source', 'year', 'bucket', 'amount', 'direction', 'guardrails']);
    expect(auditTrail.rows.find((row) => row.id === 'bucket')?.value).toBe('Registered accounts');
    expect(auditTrail.reviewNote).toContain('without creating detailed account instructions');

    const missing = selectDrawdownAdapterAuditTrail({ ...adapterValidation, status: 'rejected', adapter: null });
    expect(missing.status).toBe('missingDraft');
    expect(missing.rows).toEqual([]);
  });

  it('keeps execution contained before a real prototype exists', () => {
    const comparison = runSingleDrawdownComparison(plan, (_plan, config) => (config.meltdown ? comparisonCandidate : baseline));
    const contract = buildDrawdownExecutionContract({ plan, comparison });
    const gate = selectDrawdownVisibleReviewGate({ plan, comparison, contract });
    const preview = selectDrawdownReviewPreview({ gate, comparison, spendingStressStatus: 'balanced' });
    const phase = selectDrawdownPhaseReview({ plan, gate, preview });
    const boundary = selectDrawdownExecutionBoundaryDecision({ plan, phase, preview });
    const adapterValidation = buildDrawdownAnnualOverrideAdapterDraft({ plan, boundary, contract });
    const containment = selectDrawdownExecutionContainmentGuard({ plan, adapterValidation });

    expect(containment).toMatchObject({
      status: 'containedForReview',
      disposition: 'executionContainmentGuardOnly'
    });
    expect(containment.rows.map((row) => row.id)).toEqual(['detailsOnly', 'noApply', 'noEngineOverride', 'noSave', 'singleDraft']);
    expect(containment.reviewNote).toContain('does not open a product execution path');

    const blocked = selectDrawdownExecutionContainmentGuard({
      plan,
      adapterValidation: { ...adapterValidation, adapter: null, status: 'rejected' }
    });
    expect(blocked.status).toBe('blocked');
  });

  it('summarizes example checkpoint and phase closeout conservatively', () => {
    const comparison = runSingleDrawdownComparison(plan, (_plan, config) => (config.meltdown ? comparisonCandidate : baseline));
    const contract = buildDrawdownExecutionContract({ plan, comparison });
    const gate = selectDrawdownVisibleReviewGate({ plan, comparison, contract });
    const preview = selectDrawdownReviewPreview({ gate, comparison, spendingStressStatus: 'balanced' });
    const phase = selectDrawdownPhaseReview({ plan, gate, preview });
    const boundary = selectDrawdownExecutionBoundaryDecision({ plan, phase, preview });
    const adapterValidation = buildDrawdownAnnualOverrideAdapterDraft({ plan, boundary, contract });
    const scorecard = scoreMockedDrawdownAdapterResult({ baseline, candidate: comparisonCandidate, adapterValidation });
    const goNoGo = selectDrawdownExecutionPrototypeGoNoGo({ plan, boundary, adapterValidation, scorecard });
    const preflight = selectDrawdownExecutionPreflight({ plan, adapterValidation, goNoGo });
    const auditTrail = selectDrawdownAdapterAuditTrail(adapterValidation);
    const containment = selectDrawdownExecutionContainmentGuard({ plan, adapterValidation });
    const exampleCheckpoint = selectDrawdownExecutionExampleMatrixCheckpoint({ exampleCount: 4, heldOrBlockedCount: 0 });
    const closeout = selectDrawdownExecutionPhaseCloseout({ plan, preflight, auditTrail, containment, exampleCheckpoint });

    expect(exampleCheckpoint).toMatchObject({
      status: 'allClear',
      disposition: 'executionExampleMatrixCheckpointOnly'
    });
    expect(closeout).toMatchObject({
      status: 'holdBeforeNextPhase',
      disposition: 'executionPhaseCloseoutOnly'
    });
    expect(closeout.rows.map((row) => row.id)).toEqual(['preflight', 'auditTrail', 'containment', 'examples', 'savedPlan']);
    expect(closeout.reviewNote).toContain('Phase closeout only');

    const reviewExamples = selectDrawdownExecutionExampleMatrixCheckpoint({ exampleCount: 4, heldOrBlockedCount: 1 });
    const heldCloseout = selectDrawdownExecutionPhaseCloseout({ plan, preflight, auditTrail, containment, exampleCheckpoint: reviewExamples });
    expect(heldCloseout.status).toBe('holdBeforeNextPhase');
  });

  it('runs one contained real scenario prototype without applying annual overrides', () => {
    const comparison = runSingleDrawdownComparison(plan, (_plan, config) => (config.meltdown ? comparisonCandidate : baseline));
    const contract = buildDrawdownExecutionContract({ plan, comparison });
    const gate = selectDrawdownVisibleReviewGate({ plan, comparison, contract });
    const preview = selectDrawdownReviewPreview({ gate, comparison, spendingStressStatus: 'balanced' });
    const phase = selectDrawdownPhaseReview({ plan, gate, preview });
    const boundary = selectDrawdownExecutionBoundaryDecision({ plan, phase, preview });
    const adapterValidation = buildDrawdownAnnualOverrideAdapterDraft({ plan, boundary, contract });
    const containment = selectDrawdownExecutionContainmentGuard({ plan, adapterValidation });
    const prototype = runContainedDrawdownExecutionPrototype({
      plan,
      adapterValidation,
      containment,
      runner: (_plan, config) => (config.meltdown ? comparisonCandidate : baseline)
    });
    const summary = selectContainedDrawdownPrototypeSummary({ plan, prototype });

    expect(prototype).toMatchObject({
      status: 'reviewOnly',
      disposition: 'containedExecutionPrototypeOnly'
    });
    expect(prototype.rows.map((row) => row.id)).toEqual(['funding', 'tax', 'oasRecovery', 'estate', 'engineBoundary']);
    expect(prototype.detail).toContain('does not execute annual overrides');
    expect(prototype.reviewNote).toContain('does not apply a strategy');
    expect(summary).toMatchObject({
      status: 'readyForReview',
      disposition: 'containedPrototypeSummaryOnly'
    });
  });

  it('blocks the contained prototype when the real scenario weakens funding or estate goals', () => {
    const comparison = runSingleDrawdownComparison(plan, (_plan, config) => (config.meltdown ? comparisonCandidate : baseline));
    const contract = buildDrawdownExecutionContract({ plan, comparison });
    const gate = selectDrawdownVisibleReviewGate({ plan, comparison, contract });
    const preview = selectDrawdownReviewPreview({ gate, comparison, spendingStressStatus: 'balanced' });
    const phase = selectDrawdownPhaseReview({ plan, gate, preview });
    const boundary = selectDrawdownExecutionBoundaryDecision({ plan, phase, preview });
    const adapterValidation = buildDrawdownAnnualOverrideAdapterDraft({ plan, boundary, contract });
    const containment = selectDrawdownExecutionContainmentGuard({ plan, adapterValidation });
    const harmfulCandidate: SimulationResult = {
      years: comparisonCandidate.years.map((row, index) => ({
        ...row,
        shortfall: index === 1 ? 1000 : 0,
        bal_total: index === 1 ? 450000 : row.bal_total
      }))
    };
    const prototype = runContainedDrawdownExecutionPrototype({
      plan: { ...plan, inheritance: 100000 },
      adapterValidation,
      containment,
      runner: (_plan, config) => (config.meltdown ? harmfulCandidate : baseline)
    });
    const summary = selectContainedDrawdownPrototypeSummary({ plan: { ...plan, inheritance: 100000 }, prototype });

    expect(prototype.status).toBe('blocked');
    expect(prototype.rows.some((row) => row.status === 'blocked')).toBe(true);
    expect(summary.status).toBe('blocked');
  });

  it('explains material contained prototype movement without making it advice', () => {
    const comparison = runSingleDrawdownComparison(plan, (_plan, config) => (config.meltdown ? comparisonCandidate : baseline));
    const contract = buildDrawdownExecutionContract({ plan, comparison });
    const gate = selectDrawdownVisibleReviewGate({ plan, comparison, contract });
    const preview = selectDrawdownReviewPreview({ gate, comparison, spendingStressStatus: 'balanced' });
    const phase = selectDrawdownPhaseReview({ plan, gate, preview });
    const boundary = selectDrawdownExecutionBoundaryDecision({ plan, phase, preview });
    const adapterValidation = buildDrawdownAnnualOverrideAdapterDraft({ plan, boundary, contract });
    const containment = selectDrawdownExecutionContainmentGuard({ plan, adapterValidation });
    const prototype = runContainedDrawdownExecutionPrototype({
      plan,
      adapterValidation,
      containment,
      runner: (_plan, config) => (config.meltdown ? comparisonCandidate : baseline)
    });
    const summary = selectContainedDrawdownPrototypeSummary({ plan, prototype });
    const materiality = selectContainedDrawdownMateriality(prototype);
    const explanation = selectContainedDrawdownExplanation({ prototype, materiality });
    const limitations = selectContainedDrawdownLimitations();
    const closeout = selectContainedDrawdownUsefulnessCloseout({ plan, summary, materiality, explanation, limitations });

    expect(materiality).toMatchObject({
      status: 'materialForReview',
      disposition: 'containedPrototypeMaterialityOnly'
    });
    expect(explanation).toMatchObject({
      status: 'available',
      disposition: 'containedPrototypeExplanationOnly'
    });
    expect(explanation.rows.map((row) => row.id)).toEqual(['whyMoved', 'whyCautious', 'whatItDoesNotMean']);
    expect(limitations.rows.map((row) => row.id)).toEqual(['scenarioOnly', 'noAnnualOverride', 'notAdvice', 'needsReview']);
    expect(closeout).toMatchObject({
      status: 'usefulForReview',
      disposition: 'containedPrototypeUsefulnessOnly'
    });
    expect(JSON.stringify({ materiality, explanation, limitations, closeout }).toLowerCase()).not.toContain('recommended withdrawal strategy');
    expect(JSON.stringify({ materiality, explanation, limitations, closeout }).toLowerCase()).not.toContain('optimal drawdown');
  });

  it('holds usefulness when contained prototype movement is too small', () => {
    const smallPrototype = runContainedDrawdownExecutionPrototype({
      plan,
      adapterValidation: {
        status: 'acceptedForMockScoring',
        adapter: {
          disposition: 'adapterDraftOnly',
          year: 2028,
          accountBucket: 'registered',
          direction: 'increase',
          amount: 5000,
          sourcePayload: 'runtimeReviewDraftOnly'
        },
        rows: [],
        reason: 'Accepted for test.',
        reviewNote: 'Adapter validation only.',
        disposition: 'adapterValidationOnly'
      },
      containment: {
        status: 'containedForReview',
        rows: [],
        reviewNote: 'Containment guard only.',
        disposition: 'executionContainmentGuardOnly'
      },
      runner: () => baseline
    });
    const summary = selectContainedDrawdownPrototypeSummary({ plan, prototype: smallPrototype });
    const materiality = selectContainedDrawdownMateriality(smallPrototype);
    const explanation = selectContainedDrawdownExplanation({ prototype: smallPrototype, materiality });
    const limitations = selectContainedDrawdownLimitations();
    const closeout = selectContainedDrawdownUsefulnessCloseout({ plan, summary, materiality, explanation, limitations });

    expect(materiality.status).toBe('minorMovement');
    expect(explanation.status).toBe('heldBack');
    expect(closeout.status).toBe('holdForClearerEvidence');
  });

  it('summarizes contained prototype density, checklist, copy guard, and product go/no-go', () => {
    const comparison = runSingleDrawdownComparison(plan, (_plan, config) => (config.meltdown ? comparisonCandidate : baseline));
    const contract = buildDrawdownExecutionContract({ plan, comparison });
    const gate = selectDrawdownVisibleReviewGate({ plan, comparison, contract });
    const preview = selectDrawdownReviewPreview({ gate, comparison, spendingStressStatus: 'balanced' });
    const phase = selectDrawdownPhaseReview({ plan, gate, preview });
    const boundary = selectDrawdownExecutionBoundaryDecision({ plan, phase, preview });
    const adapterValidation = buildDrawdownAnnualOverrideAdapterDraft({ plan, boundary, contract });
    const containment = selectDrawdownExecutionContainmentGuard({ plan, adapterValidation });
    const prototype = runContainedDrawdownExecutionPrototype({
      plan,
      adapterValidation,
      containment,
      runner: (_plan, config) => (config.meltdown ? comparisonCandidate : baseline)
    });
    const summary = selectContainedDrawdownPrototypeSummary({ plan, prototype });
    const materiality = selectContainedDrawdownMateriality(prototype);
    const explanation = selectContainedDrawdownExplanation({ prototype, materiality });
    const limitations = selectContainedDrawdownLimitations();
    const usefulness = selectContainedDrawdownUsefulnessCloseout({ plan, summary, materiality, explanation, limitations });
    const density = selectContainedDrawdownDetailsDensity({ prototype, materiality, explanation, limitations, usefulness });
    const checklist = selectContainedDrawdownReviewChecklist({ usefulness, materiality, limitations });
    const exampleGate = selectContainedDrawdownExampleGate({ exampleCount: 4, blockedCount: 0, heldCount: 0 });
    const copyGuard = selectContainedDrawdownCopyGuard(plan);
    const productGoNoGo = selectContainedDrawdownProductGoNoGo({
      plan,
      usefulness,
      density,
      checklist,
      exampleGate,
      copyGuard
    });
    const promotionReadiness = selectContainedDrawdownPromotionReadiness({
      plan,
      productGoNoGo,
      usefulness,
      density,
      copyGuard
    });
    const nextStepGuide = selectContainedDrawdownNextStepGuide({ promotionReadiness, productGoNoGo });
    const blockerRegister = selectContainedDrawdownBlockerRegister({
      plan,
      promotionReadiness,
      productGoNoGo,
      checklist,
      copyGuard
    });
    const examplePromotionGate = selectContainedDrawdownExamplePromotionGate({
      exampleCount: 4,
      heldOrBlockedCount: 0
    });
    const phaseMilestone = selectContainedDrawdownPhaseMilestoneCloseout({
      plan,
      promotionReadiness,
      nextStepGuide,
      blockerRegister,
      examplePromotionGate
    });

    expect(density).toMatchObject({
      status: 'compactEnough',
      disposition: 'containedPrototypeDensityOnly'
    });
    expect(density.visibleSectionCount).toBeLessThanOrEqual(5);
    expect(checklist).toMatchObject({
      status: 'readyForReview',
      disposition: 'containedPrototypeChecklistOnly'
    });
    expect(exampleGate).toMatchObject({
      status: 'examplesClear',
      disposition: 'containedPrototypeExampleGateOnly'
    });
    expect(copyGuard).toMatchObject({
      status: 'copyClear',
      disposition: 'containedPrototypeCopyGuardOnly'
    });
    expect(productGoNoGo).toMatchObject({
      status: 'keepInDetails',
      disposition: 'containedPrototypeProductGoNoGoOnly'
    });
    expect(productGoNoGo.reviewNote).toContain('does not move the prototype into Overview');
    expect(promotionReadiness).toMatchObject({
      status: 'readyForLaterUx',
      disposition: 'containedPrototypePromotionReadinessOnly'
    });
    expect(nextStepGuide).toMatchObject({
      status: 'available',
      disposition: 'containedPrototypeNextStepGuideOnly'
    });
    expect(blockerRegister).toMatchObject({
      status: 'clear',
      disposition: 'containedPrototypeBlockerRegisterOnly'
    });
    expect(examplePromotionGate).toMatchObject({
      status: 'examplesClear',
      disposition: 'containedPrototypeExamplePromotionGateOnly'
    });
    expect(phaseMilestone).toMatchObject({
      status: 'readyForNextDesignPhase',
      disposition: 'containedPrototypePhaseMilestoneOnly'
    });
    expect(phaseMilestone.reviewNote).toContain('does not execute drawdown changes');

    const intent = selectTaxAwareDrawdownV1ExecutionIntent({ plan, phaseMilestone });
    const candidate = buildTaxAwareDrawdownV1ExecutionCandidate({ plan, intent, adapterValidation });
    const execution = runTaxAwareDrawdownV1Execution({
      plan,
      candidate,
      runner: (_plan, config) => (config.meltdown ? comparisonCandidate : baseline)
    });
    const review = selectTaxAwareDrawdownV1ExecutionReview({ plan, intent, candidate, execution });
    const v1ExampleGate = selectTaxAwareDrawdownV1ExampleGate({ exampleCount: 4, heldOrBlockedCount: 0 });
    const v1Closeout = selectTaxAwareDrawdownV1PhaseCloseout({ plan, intent, review, exampleGate: v1ExampleGate });

    expect(intent).toMatchObject({
      status: 'readyForBoundedExecution',
      disposition: 'v1DrawdownExecutionIntentOnly'
    });
    expect(candidate).toMatchObject({
      status: 'ready',
      candidateId: 'boundedRegisteredTimingExecution',
      disposition: 'v1DrawdownExecutionCandidateOnly'
    });
    expect(execution).toMatchObject({
      status: 'reviewOnly',
      disposition: 'v1DrawdownExecutionResultOnly'
    });
    expect(review).toMatchObject({
      status: 'readyForUserReview',
      disposition: 'v1DrawdownExecutionReviewOnly'
    });
    expect(v1ExampleGate).toMatchObject({
      status: 'examplesClear',
      disposition: 'v1DrawdownExecutionExampleGateOnly'
    });
    expect(v1Closeout).toMatchObject({
      status: 'readyForConsumerUx',
      disposition: 'v1DrawdownExecutionPhaseCloseoutOnly'
    });
    expect(execution.reviewNote).toContain('executed scenario comparison');
    expect(review.reviewNote).toContain('not a recommendation');

    const consumerSummary = selectTaxAwareDrawdownV1ConsumerSummary({ execution, review });
    const safety = selectTaxAwareDrawdownV1SafetyChecklist({ plan, execution });
    const limits = selectTaxAwareDrawdownV1ConsumerLimits();
    const consumerExampleGate = selectTaxAwareDrawdownV1ConsumerExampleGate({ exampleCount: 4, heldOrBlockedCount: 0 });
    const consumerCloseout = selectTaxAwareDrawdownV1ConsumerCloseout({
      plan,
      summary: consumerSummary,
      safety,
      limits,
      exampleGate: consumerExampleGate
    });

    expect(consumerSummary).toMatchObject({
      status: 'clearForReview',
      disposition: 'v1DrawdownConsumerSummaryOnly'
    });
    expect(safety).toMatchObject({
      status: 'ready',
      disposition: 'v1DrawdownSafetyChecklistOnly'
    });
    expect(limits).toMatchObject({
      status: 'visible',
      disposition: 'v1DrawdownConsumerLimitsOnly'
    });
    expect(consumerExampleGate).toMatchObject({
      status: 'examplesClear',
      disposition: 'v1DrawdownConsumerExampleGateOnly'
    });
    expect(consumerCloseout).toMatchObject({
      status: 'readyForUxCopy',
      disposition: 'v1DrawdownConsumerCloseoutOnly'
    });
    expect(consumerCloseout.reviewNote).toContain('does not save output');

    const uxHeadline = selectTaxAwareDrawdownV1UxHeadline({ consumerCloseout });
    const uxComparison = selectTaxAwareDrawdownV1UxComparisonCard({ execution });
    const uxActions = selectTaxAwareDrawdownV1UxReviewActions({ consumerCloseout });
    const uxCopyGuard = selectTaxAwareDrawdownV1UxCopyGuard(plan);
    const uxReadiness = selectTaxAwareDrawdownV1UxReadinessCloseout({
      plan,
      headline: uxHeadline,
      comparison: uxComparison,
      actions: uxActions,
      copyGuard: uxCopyGuard
    });

    expect(uxHeadline).toMatchObject({
      status: 'ready',
      disposition: 'v1DrawdownUxHeadlineOnly'
    });
    expect(uxHeadline.subhead).toContain('does not change the editable plan');
    expect(uxComparison).toMatchObject({
      status: 'ready',
      disposition: 'v1DrawdownUxComparisonCardOnly'
    });
    expect(uxComparison.rows.map((row) => row.id)).toEqual(['funding', 'tax', 'oasRecovery', 'estate']);
    expect(uxActions).toMatchObject({
      status: 'available',
      disposition: 'v1DrawdownUxReviewActionsOnly'
    });
    expect(uxActions.rows.map((row) => row.id)).toEqual([
      'reviewInputs',
      'compareCurrentPlan',
      'confirmTaxContext',
      'keepEditablePlan'
    ]);
    expect(uxCopyGuard).toMatchObject({
      status: 'clear',
      disposition: 'v1DrawdownUxCopyGuardOnly'
    });
    expect(uxReadiness).toMatchObject({
      status: 'readyForDesign',
      disposition: 'v1DrawdownUxReadinessCloseoutOnly'
    });
    expect(uxReadiness.reviewNote).toContain('does not move the result into Overview');
  });

  it('holds product go/no-go when contained prototype is dense or examples need review', () => {
    const smallPrototype = runContainedDrawdownExecutionPrototype({
      plan,
      adapterValidation: {
        status: 'acceptedForMockScoring',
        adapter: {
          disposition: 'adapterDraftOnly',
          year: 2028,
          accountBucket: 'registered',
          direction: 'increase',
          amount: 5000,
          sourcePayload: 'runtimeReviewDraftOnly'
        },
        rows: [],
        reason: 'Accepted for test.',
        reviewNote: 'Adapter validation only.',
        disposition: 'adapterValidationOnly'
      },
      containment: {
        status: 'containedForReview',
        rows: [],
        reviewNote: 'Containment guard only.',
        disposition: 'executionContainmentGuardOnly'
      },
      runner: () => baseline
    });
    const summary = selectContainedDrawdownPrototypeSummary({ plan, prototype: smallPrototype });
    const materiality = selectContainedDrawdownMateriality(smallPrototype);
    const explanation = selectContainedDrawdownExplanation({ prototype: smallPrototype, materiality });
    const limitations = selectContainedDrawdownLimitations();
    const usefulness = selectContainedDrawdownUsefulnessCloseout({ plan, summary, materiality, explanation, limitations });
    const density = selectContainedDrawdownDetailsDensity({ prototype: smallPrototype, materiality, explanation, limitations, usefulness });
    const checklist = selectContainedDrawdownReviewChecklist({ usefulness, materiality, limitations });
    const exampleGate = selectContainedDrawdownExampleGate({ exampleCount: 4, blockedCount: 0, heldCount: 1 });
    const copyGuard = selectContainedDrawdownCopyGuard(plan);
    const productGoNoGo = selectContainedDrawdownProductGoNoGo({
      plan,
      usefulness,
      density,
      checklist,
      exampleGate,
      copyGuard
    });
    const promotionReadiness = selectContainedDrawdownPromotionReadiness({
      plan,
      productGoNoGo,
      usefulness,
      density,
      copyGuard
    });
    const nextStepGuide = selectContainedDrawdownNextStepGuide({ promotionReadiness, productGoNoGo });
    const blockerRegister = selectContainedDrawdownBlockerRegister({
      plan,
      promotionReadiness,
      productGoNoGo,
      checklist,
      copyGuard
    });
    const examplePromotionGate = selectContainedDrawdownExamplePromotionGate({
      exampleCount: 4,
      heldOrBlockedCount: 1
    });
    const phaseMilestone = selectContainedDrawdownPhaseMilestoneCloseout({
      plan,
      promotionReadiness,
      nextStepGuide,
      blockerRegister,
      examplePromotionGate
    });

    expect(usefulness.status).toBe('holdForClearerEvidence');
    expect(checklist.status).toBe('holdBeforeReview');
    expect(exampleGate.status).toBe('needsExampleReview');
    expect(productGoNoGo.status).toBe('holdForUxPolish');
    expect(promotionReadiness.status).toBe('holdInDetails');
    expect(nextStepGuide.status).toBe('held');
    expect(blockerRegister.status).toBe('hasHolds');
    expect(examplePromotionGate.status).toBe('needsExampleReview');
    expect(phaseMilestone.status).toBe('holdBeforeNextPhase');

    const intent = selectTaxAwareDrawdownV1ExecutionIntent({ plan, phaseMilestone });
    const candidate = buildTaxAwareDrawdownV1ExecutionCandidate({
      plan,
      intent,
      adapterValidation: {
        status: 'acceptedForMockScoring',
        adapter: {
          disposition: 'adapterDraftOnly',
          year: 2028,
          accountBucket: 'registered',
          direction: 'increase',
          amount: 5000,
          sourcePayload: 'runtimeReviewDraftOnly'
        },
        rows: [],
        reason: 'Accepted for test.',
        reviewNote: 'Adapter validation only.',
        disposition: 'adapterValidationOnly'
      }
    });
    const execution = runTaxAwareDrawdownV1Execution({ plan, candidate, runner: () => baseline });
    const review = selectTaxAwareDrawdownV1ExecutionReview({ plan, intent, candidate, execution });
    const v1ExampleGate = selectTaxAwareDrawdownV1ExampleGate({ exampleCount: 4, heldOrBlockedCount: 1 });
    const v1Closeout = selectTaxAwareDrawdownV1PhaseCloseout({ plan, intent, review, exampleGate: v1ExampleGate });

    expect(intent.status).toBe('holdForReadiness');
    expect(candidate.status).toBe('hold');
    expect(execution.status).toBe('notReady');
    expect(review.status).toBe('holdForReview');
    expect(v1ExampleGate.status).toBe('needsExampleReview');
    expect(v1Closeout.status).toBe('holdForMoreGuardrails');

    const consumerSummary = selectTaxAwareDrawdownV1ConsumerSummary({ execution, review });
    const safety = selectTaxAwareDrawdownV1SafetyChecklist({ plan, execution });
    const limits = selectTaxAwareDrawdownV1ConsumerLimits();
    const consumerExampleGate = selectTaxAwareDrawdownV1ConsumerExampleGate({ exampleCount: 4, heldOrBlockedCount: 1 });
    const consumerCloseout = selectTaxAwareDrawdownV1ConsumerCloseout({
      plan,
      summary: consumerSummary,
      safety,
      limits,
      exampleGate: consumerExampleGate
    });

    expect(consumerSummary.status).toBe('needsCare');
    expect(safety.status).toBe('hold');
    expect(consumerExampleGate.status).toBe('needsExampleReview');
    expect(consumerCloseout.status).toBe('holdForCopyPolish');

    const uxHeadline = selectTaxAwareDrawdownV1UxHeadline({ consumerCloseout });
    const uxComparison = selectTaxAwareDrawdownV1UxComparisonCard({ execution });
    const uxActions = selectTaxAwareDrawdownV1UxReviewActions({ consumerCloseout });
    const uxCopyGuard = selectTaxAwareDrawdownV1UxCopyGuard(plan);
    const uxReadiness = selectTaxAwareDrawdownV1UxReadinessCloseout({
      plan,
      headline: uxHeadline,
      comparison: uxComparison,
      actions: uxActions,
      copyGuard: uxCopyGuard
    });

    expect(uxHeadline.status).toBe('hold');
    expect(uxComparison.status).toBe('hold');
    expect(uxActions.status).toBe('held');
    expect(uxCopyGuard.status).toBe('clear');
    expect(uxReadiness.status).toBe('holdForDesignPolish');
  });
});
