import { describe, expect, it } from 'vitest';
import { createBlankPlan } from '../data/defaultPlan';
import { createPlanFile } from '../data/planFile';
import type { SimulationResult, V2PlanPayload } from '../types/plan';
import { buildBoundedOptimizerCandidates, runBoundedOptimizer, type BoundedOptimizerCandidateId } from './boundedOptimizer';
import type { SimulationConfig } from './runSimulation';

function readyPlan(): V2PlanPayload {
  const plan = createBlankPlan();
  plan.title = 'Bounded optimizer test';
  plan.p1 = {
    ...plan.p1,
    name: 'Alex',
    dob: 1968,
    retireYear: 2032,
    salary: 90000,
    rrsp: 250000,
    tfsa: 90000,
    nonreg: 60000,
    cpp65_monthly: 1200,
    cpp70_monthly: 1700,
    oas_monthly: 742
  };
  plan.spending.gogo = 85000;
  plan.spending.slowgo = 72000;
  plan.spending.nogo = 62000;
  plan.assumptions.retireYear = 2032;
  plan.assumptions.planEnd = 2065;
  plan.assumptions.withdrawalOrder = 'default';
  return plan;
}

function result(
  endPortfolio: number,
  lifetimeTax: number,
  firstShortfallYear: number | null = null,
  options: { oasRecovery?: number } = {}
): SimulationResult {
  const years = [2032, 2033, 2034].map((year, index) => ({
    year,
    ageF: 64 + index,
    ageM: 0,
    spending: 85000,
    grossIncome: 90000,
    dbPension: 0,
    cpp_f: 0,
    oas_f: 0,
    tfsa_draw: 0,
    nonreg_draw: 0,
    cash_draw: 0,
    totalTaxYear: Math.round(lifetimeTax / 3),
    taxableIncome: 90000,
    totalOasClawY: Math.round((options.oasRecovery || 0) / 3),
    totalAftaxYear: 85000,
    cashFlow: 0,
    shortfall: firstShortfallYear === year ? 5000 : 0,
    bal_rrsp: 0,
    bal_tfsa: 0,
    bal_lif: 0,
    bal_nonreg: 0,
    bal_cash: 0,
    bal_total: index === 2 ? endPortfolio : endPortfolio + (2 - index) * 10000
  }));
  return { years, totalTax: lifetimeTax } as SimulationResult;
}

describe('bounded optimizer runner', () => {
  it('builds a limited candidate set from optimizer contract levers', () => {
    const candidates = buildBoundedOptimizerCandidates(readyPlan());

    expect(candidates.map((candidate) => candidate.id)).toEqual([
      'baseline',
      'spendLess5',
      'spendLess10',
      'retireLater1',
      'retireLater2',
      'delayBenefits',
      'withdrawalRegisteredFirst',
      'withdrawalNonRegisteredFirst'
    ]);
    expect(candidates.find((candidate) => candidate.id === 'spendLess10')?.plan.spending.gogo).toBe(76500);
    expect(candidates.find((candidate) => candidate.id === 'delayBenefits')?.config).toMatchObject({
      cppAgeF: 70,
      cppAgeM: 70,
      oasAgeF: 70,
      oasAgeM: 70
    });
  });

  it('runs candidates through the provided runner and does not persist optimizer output', () => {
    const calls: Array<{ title: string | undefined; order: string | undefined; config: SimulationConfig }> = [];
    const byCandidate: Partial<Record<BoundedOptimizerCandidateId, SimulationResult>> = {
      baseline: result(100000, 90000, 2033),
      spendLess5: result(120000, 88000, null),
      spendLess10: result(125000, 87000, null),
      retireLater1: result(130000, 86000, null),
      retireLater2: result(140000, 85000, null),
      delayBenefits: result(155000, 83000, null),
      withdrawalRegisteredFirst: result(170000, 80000, null),
      withdrawalNonRegisteredFirst: result(160000, 82000, null)
    };

    const summary = runBoundedOptimizer(readyPlan(), (candidatePlan, config) => {
      calls.push({ title: candidatePlan.title, order: candidatePlan.assumptions.withdrawalOrder, config });
      const id =
        config.withdrawalOrder === 'registered-first'
          ? 'withdrawalRegisteredFirst'
          : config.withdrawalOrder === 'nonreg-first'
            ? 'withdrawalNonRegisteredFirst'
            : config.cppAgeF === 70
              ? 'delayBenefits'
              : candidatePlan.p1.retireYear === 2034
                ? 'retireLater2'
                : candidatePlan.p1.retireYear === 2033
                  ? 'retireLater1'
                  : candidatePlan.spending.gogo === 76500
                    ? 'spendLess10'
                    : candidatePlan.spending.gogo === 80750
                      ? 'spendLess5'
                      : 'baseline';
      return byCandidate[id] || result(0, 0);
    });

    expect(summary.status).toBe('ready');
    expect(summary.execution).toBe('boundedSearch');
    expect(summary.suggestedCandidateId).toBe('withdrawalRegisteredFirst');
    expect(summary.candidates).toHaveLength(8);
    expect(summary.explanation.plainLanguageSummary).toContain('first option to review');
    expect(summary.explanation.whyThisOption.join(' ')).toContain('Projected money left improves');
    expect(summary.explanation.tradeoffs.join(' ')).toContain('drawdown order');
    expect(summary.explanation.verifyBeforeUsing.join(' ')).toContain('Review taxes');
    expect(summary.driverRows.map((row) => row.id)).toEqual(['fundedYears', 'lifetimeTax', 'peakTax', 'oasRecovery', 'portfolio']);
    expect(summary.driverRows.find((row) => row.id === 'lifetimeTax')).toMatchObject({ value: '-$10,000', tone: 'ok' });
    expect(summary.driverRows.find((row) => row.id === 'portfolio')).toMatchObject({ value: '+$70,000', tone: 'ok' });
    expect(summary.guardrailNotes.find((note) => note.id === 'benefitTiming')).toMatchObject({
      status: 'tested',
      reason: expect.stringContaining('age-70 test range')
    });
    expect(summary.recommendationNotes.find((note) => note.candidateId === 'spendLess10')).toMatchObject({
      status: 'canHighlight',
      reason: expect.stringContaining('materially improves a visible funding shortfall')
    });
    expect(summary.recommendationNotes.find((note) => note.candidateId === 'withdrawalRegisteredFirst')).toMatchObject({
      status: 'canHighlight',
      reason: expect.stringContaining('without changing lifestyle or work timing')
    });
    expect(calls).toHaveLength(8);
    expect(createPlanFile(readyPlan()).plan).not.toHaveProperty('boundedOptimizer');
  });

  it('adds one bounded pension-splitting candidate for eligible two-person plans', () => {
    const plan = readyPlan();
    plan.p2 = {
      ...plan.p2,
      name: 'Morgan',
      dob: 1969,
      retireYear: 2033,
      rrsp: 120000,
      tfsa: 70000,
      cpp65_monthly: 900,
      cpp70_monthly: 1250,
      oas_monthly: 742
    };
    plan.p1.db_after65 = 30000;
    plan.assumptions.p1DiesInSurvivor = 2040;

    const candidates = buildBoundedOptimizerCandidates(plan);
    const summary = runBoundedOptimizer(plan, (candidatePlan, config) =>
      config.pensionSplit ? result(180000, 78000, null, { oasRecovery: 3000 }) : result(120000, 90000, null, { oasRecovery: 9000 })
    );

    expect(candidates.map((candidate) => candidate.id)).toContain('pensionSplit');
    expect(candidates.find((candidate) => candidate.id === 'pensionSplit')).toMatchObject({
      label: 'Test pension splitting',
      config: expect.objectContaining({ pensionSplit: true }),
      changedLevers: ['pensionSplitting']
    });
    expect(summary.eligibilityNotes.find((note) => note.lever === 'pensionSplitting')).toMatchObject({ status: 'eligible' });
    expect(summary.suggestedCandidateId).toBe('pensionSplit');
    expect(summary.explanation.tradeoffs.join(' ')).toContain('Pension-splitting');
    expect(summary.evidenceRows.map((row) => row.id)).toEqual([
      'pensionLifetimeTax',
      'pensionFirstYearTax',
      'pensionPeakTax',
      'pensionOasRecovery',
      'pensionPortfolio'
    ]);
    expect(summary.evidenceRows.find((row) => row.id === 'pensionLifetimeTax')).toMatchObject({
      label: 'Lifetime tax change',
      value: '-$12,000',
      tone: 'ok'
    });
    expect(summary.evidenceRows.find((row) => row.id === 'pensionPortfolio')).toMatchObject({
      label: 'Projected money-left change',
      value: '+$60,000',
      tone: 'ok'
    });
    expect(summary.driverRows.find((row) => row.id === 'oasRecovery')).toMatchObject({
      label: 'OAS recovery tax',
      value: '-$6,000',
      tone: 'ok'
    });
  });

  it('blocks bounded search when contract blockers remain', () => {
    const plan = createBlankPlan();
    plan.p1.retireYear = 0;
    plan.assumptions.retireYear = 0;
    plan.spending.gogo = 0;

    const summary = runBoundedOptimizer(plan, () => result(0, 0));

    expect(summary.status).toBe('blocked');
    expect(summary.suggestedCandidateId).toBeNull();
    expect(summary.candidates.map((candidate) => candidate.id)).toEqual(['baseline']);
    expect(summary.explanation.plainLanguageSummary).toContain('paused');
    expect(summary.reviewNotes.length).toBeGreaterThan(0);
  });

  it('skips ineligible levers without widening the optimizer search', () => {
    const plan = readyPlan();
    plan.spending.gogo = 25000;
    plan.spending.slowgo = 22000;
    plan.spending.nogo = 20000;
    plan.p1.dob = 1962;
    plan.p1.retireYear = 2032;
    plan.assumptions.retireYear = 2032;
    plan.p1.tfsa = 0;
    plan.p1.nonreg = 0;

    const candidates = buildBoundedOptimizerCandidates(plan);
    const summary = runBoundedOptimizer(plan, () => result(100000, 90000));

    expect(candidates.map((candidate) => candidate.id)).toEqual(['baseline']);
    expect(summary.eligibilityNotes.find((note) => note.lever === 'spending')).toMatchObject({ status: 'skipped' });
    expect(summary.eligibilityNotes.find((note) => note.lever === 'retirementTiming')).toMatchObject({ status: 'skipped' });
    expect(summary.eligibilityNotes.find((note) => note.lever === 'benefitTiming')).toMatchObject({ status: 'skipped' });
    expect(summary.eligibilityNotes.find((note) => note.lever === 'withdrawalOrder')).toMatchObject({ status: 'skipped' });
    expect(summary.guardrailNotes.find((note) => note.id === 'benefitTiming')).toMatchObject({
      status: 'notTested',
      reason: expect.stringContaining('before age 70')
    });
    expect(summary.candidates.map((candidate) => candidate.id)).toEqual(['baseline']);
  });

  it('keeps work-timing candidates inside the age-70 boundary per option', () => {
    const plan = readyPlan();
    plan.p1.dob = 1964;
    plan.p1.retireYear = 2033;
    plan.assumptions.retireYear = 2033;

    const candidates = buildBoundedOptimizerCandidates(plan);

    expect(candidates.map((candidate) => candidate.id)).toContain('retireLater1');
    expect(candidates.map((candidate) => candidate.id)).not.toContain('retireLater2');
  });

  it('keeps disruptive improvements review-only when the current plan has no visible funding problem', () => {
    const summary = runBoundedOptimizer(readyPlan(), (candidatePlan, config) => {
      const id =
        config.cppAgeF === 70
          ? 'delayBenefits'
          : candidatePlan.p1.retireYear === 2034
            ? 'retireLater2'
            : candidatePlan.p1.retireYear === 2033
              ? 'retireLater1'
              : candidatePlan.spending.gogo === 76500
                ? 'spendLess10'
                : candidatePlan.spending.gogo === 80750
                  ? 'spendLess5'
                  : 'baseline';
      return id === 'baseline' ? result(200000, 90000, null) : result(350000, 85000, null);
    });

    expect(summary.suggestedCandidateId).toBe('baseline');
    expect(summary.headline).toContain('first option to review');
    expect(summary.recommendationNotes.find((note) => note.candidateId === 'spendLess10')).toMatchObject({
      status: 'reviewOnly',
      reason: expect.stringContaining('changes lifestyle')
    });
    expect(summary.recommendationNotes.find((note) => note.candidateId === 'retireLater2')).toMatchObject({
      status: 'reviewOnly',
      reason: expect.stringContaining('changes lifestyle')
    });
    expect(summary.recommendationNotes.find((note) => note.candidateId === 'delayBenefits')).toMatchObject({
      status: 'reviewOnly',
      reason: expect.stringContaining('benefit timing')
    });
  });

  it('keeps benefit delay review-only when bridge years show a shortfall', () => {
    const summary = runBoundedOptimizer(readyPlan(), (candidatePlan, config) => {
      if (config.cppAgeF === 70) return result(500000, 70000, 2033);
      return candidatePlan.spending.gogo === 80750 ? result(260000, 88000, null) : result(100000, 90000, 2033);
    });

    expect(summary.suggestedCandidateId).toBe('spendLess5');
    expect(summary.recommendationNotes.find((note) => note.candidateId === 'delayBenefits')).toMatchObject({
      status: 'reviewOnly',
      reason: expect.stringContaining('bridge years before age 70')
    });
  });

  it('flags missing survivor setup for two-person optimizer review', () => {
    const plan = readyPlan();
    plan.p2 = {
      ...plan.p2,
      name: 'Morgan',
      dob: 1969,
      retireYear: 2033,
      rrsp: 150000,
      tfsa: 70000,
      cpp65_monthly: 900,
      cpp70_monthly: 1250,
      oas_monthly: 742
    };
    plan.assumptions.p1DiesInSurvivor = 0;

    const summary = runBoundedOptimizer(plan, () => result(100000, 90000));

    expect(summary.eligibilityNotes.find((note) => note.lever === 'survivor')).toMatchObject({
      status: 'needsReview',
      reason: expect.stringContaining('survivor scenario year')
    });
    expect(summary.status).toBe('ready');
  });
});
