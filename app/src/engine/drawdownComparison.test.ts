import { describe, expect, it } from 'vitest';
import type { SimulationConfig } from './runSimulation';
import type { SimulationResult, V2PlanPayload } from '../types/plan';
import { drawdownComparisonSavedPlanGuard, runSingleDrawdownComparison, selectHiddenDrawdownComparisonGuardrails } from './drawdownComparison';

const plan: V2PlanPayload = {
  schemaVersion: 2,
  title: 'Hidden drawdown comparison plan',
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
      rrif_draw_m: 0,
      lif_draw: 0,
      tfsa_draw: 0,
      nonreg_draw: 0,
      cash_draw: 0,
      shortfall: 0,
      totalAftaxYear: 70000,
      bal_total: 600000,
      bal_rrsp: 300000,
      bal_lif: 0
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
      rrif_draw_m: 0,
      lif_draw: 0,
      tfsa_draw: 0,
      nonreg_draw: 0,
      cash_draw: 0,
      shortfall: 0,
      totalAftaxYear: 70000,
      bal_total: 500000,
      bal_rrsp: 260000,
      bal_lif: 0
    }
  ]
};

const candidate: SimulationResult = {
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

describe('hidden drawdown comparison', () => {
  it('runs one gated registered-timing comparison as review-only evidence', () => {
    const calls: SimulationConfig[] = [];
    const comparison = runSingleDrawdownComparison(plan, (_plan, config) => {
      calls.push(config);
      return config.meltdown ? candidate : baseline;
    });

    expect(comparison).toMatchObject({
      status: 'reviewOnly',
      candidateId: 'singleRegisteredTimingCheck',
      draftId: 'oasRecoveryDraft',
      label: 'Hidden registered-timing comparison',
      disposition: 'hiddenComparisonOnly'
    });
    expect(calls.some((config) => config.meltdown === true && config.withdrawalOrder === 'meltdown')).toBe(true);
    expect(comparison.deltas).toMatchObject({
      fundedYears: 0,
      lifetimeTax: -5500,
      oasRecoveryTax: -3200,
      projectedMoneyLeft: 5000
    });
    expect(comparison.evidenceRows.map((row) => row.id)).toEqual(['funding', 'tax', 'oasRecovery', 'estate']);
    expect(comparison.decisionGate).toMatchObject({
      status: 'eligibleForReview',
      rows: expect.arrayContaining([
        expect.objectContaining({ id: 'materiality', status: 'ok' }),
        expect.objectContaining({ id: 'funding', status: 'ok' }),
        expect.objectContaining({ id: 'savedPlan', status: 'ok' })
      ])
    });
    expect(comparison.decisionGate.headline).toContain('not a recommendation');
    expect(comparison.reviewNote).toContain('does not create account instructions');
    expect(comparison.reviewNote).toContain('does not change or save the plan');
    expect(selectHiddenDrawdownComparisonGuardrails(comparison, plan)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'hiddenOnly', status: 'ok' }),
        expect.objectContaining({ id: 'reviewOnly', status: 'ok' }),
        expect.objectContaining({ id: 'savedPlan', status: 'ok' })
      ])
    );
    expect(JSON.stringify(comparison).toLowerCase()).not.toContain('recommended withdrawal strategy');
    expect(JSON.stringify(comparison).toLowerCase()).not.toContain('optimal drawdown');
  });

  it('blocks when readiness does not queue a sandbox draft', () => {
    const comparison = runSingleDrawdownComparison(plan, () => ({ years: [] }));

    expect(comparison).toMatchObject({
      status: 'notReady',
      candidateId: null,
      draftId: null,
      evidenceRows: [],
      decisionGate: { status: 'notReady', rows: [] },
      disposition: 'hiddenComparisonOnly'
    });
  });

  it('holds back the decision gate when funding worsens', () => {
    const worseCandidate: SimulationResult = {
      years: candidate.years.map((row, index) => ({
        ...row,
        shortfall: index === 1 ? 5000 : 0,
        bal_total: index === 1 ? 450000 : row.bal_total
      }))
    };
    const comparison = runSingleDrawdownComparison(plan, (_plan, config) => (config.meltdown ? worseCandidate : baseline));

    expect(comparison.status).toBe('reviewOnly');
    expect(comparison.decisionGate).toMatchObject({
      status: 'blocked',
      rows: expect.arrayContaining([expect.objectContaining({ id: 'funding', status: 'blocked' })])
    });
    expect(comparison.reason).toContain('held back');
  });

  it('keeps hidden comparison output out of saved plan files', () => {
    expect(drawdownComparisonSavedPlanGuard(plan)).toBe(true);
  });
});
