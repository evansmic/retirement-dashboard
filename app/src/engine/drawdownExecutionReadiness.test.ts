import { describe, expect, it } from 'vitest';
import { createPlanFile } from '../data/planFile';
import type { SimulationResult, V2PlanPayload } from '../types/plan';
import { runSingleDrawdownComparison } from './drawdownComparison';
import {
  buildDrawdownAnnualOverrideAdapterDraft,
  buildDrawdownExecutionContract,
  drawdownExecutionSavedPlanGuard,
  emptyMockedExecutionScorecard,
  runInternalDrawdownDryRun,
  scoreMockedDrawdownAdapterResult,
  selectDrawdownExecutionBoundaryDecision,
  selectDrawdownExecutionPrototypeGoNoGo,
  selectDrawdownPhaseReview,
  selectDrawdownPrototypeReadinessReview,
  selectDrawdownReviewPreview,
  selectDrawdownVisibleReviewGate,
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
});
