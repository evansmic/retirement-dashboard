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

function cppSharingPlan(): V2PlanPayload {
  const plan = readyPlan();
  plan.p1.oas_monthly = 0;
  plan.p1.rrsp = 0;
  plan.p1.lira = 0;
  plan.p1.lif = 0;
  plan.p1.tfsa = 160000;
  plan.p1.nonreg = 180000;
  plan.p1.db_after65 = 0;
  plan.p1.db_before65 = 0;
  plan.p2 = {
    ...plan.p2,
    name: 'Morgan',
    dob: 1969,
    retireYear: 2033,
    rrsp: 0,
    lira: 0,
    lif: 0,
    tfsa: 110000,
    nonreg: 90000,
    cpp65_monthly: 900,
    cpp70_monthly: 1250,
    oas_monthly: 742
  };
  plan.assumptions.cppSharing = false;
  plan.assumptions.p1DiesInSurvivor = 2040;
  return plan;
}

function downsizePlan(): V2PlanPayload {
  const plan = readyPlan();
  plan.p1.oas_monthly = 0;
  plan.downsize = { year: 2040, netProceeds: 250000 };
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
    expect(summary.optionGroups.map((group) => group.id)).toEqual(['currentPlan', 'lifestyle', 'timing', 'drawdownReview']);
    expect(summary.optionGroups.find((group) => group.id === 'lifestyle')).toMatchObject({
      label: 'Lifestyle choices',
      candidateIds: ['spendLess5', 'spendLess10']
    });
    expect(summary.optionGroups.find((group) => group.id === 'drawdownReview')).toMatchObject({
      label: 'Drawdown review',
      canHighlightCount: 2
    });
    expect(summary.driverRows.find((row) => row.id === 'lifetimeTax')).toMatchObject({ value: '-$10,000', tone: 'ok' });
    expect(summary.driverRows.find((row) => row.id === 'portfolio')).toMatchObject({ value: '+$70,000', tone: 'ok' });
    expect(summary.guardrailNotes.find((note) => note.id === 'benefitTiming')).toMatchObject({
      status: 'tested',
      reason: expect.stringContaining('can be reviewed')
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

  it('adds bridge-year evidence for the benefit timing check', () => {
    const summary = runBoundedOptimizer(readyPlan(), (candidatePlan, config) => {
      if (config.cppAgeF === 70) return result(500000, 70000, 2033);
      return candidatePlan.spending.gogo === readyPlan().spending.gogo ? result(100000, 90000, null) : result(90000, 95000, null);
    });

    expect(summary.evidenceRows.map((row) => row.id)).toEqual([
      'benefitBridgeYears',
      'benefitFirstBridgeShortfall',
      'benefitLifetimeTax',
      'benefitPortfolio'
    ]);
    expect(summary.evidenceRows.find((row) => row.id === 'benefitBridgeYears')).toMatchObject({
      label: 'Bridge years before age 70',
      value: '1 shortfall year',
      tone: 'watch'
    });
    expect(summary.recommendationNotes.find((note) => note.candidateId === 'delayBenefits')).toMatchObject({
      status: 'reviewOnly',
      reason: expect.stringContaining('1 bridge year before age 70')
    });
  });

  it('explains why benefit timing is skipped when estimates or age-70 timing are not ready', () => {
    const missingEstimate = readyPlan();
    missingEstimate.p1.oas_monthly = 0;
    const already70 = readyPlan();
    already70.p1.dob = 1960;
    const shortProjection = readyPlan();
    shortProjection.assumptions.planEnd = 2035;

    expect(runBoundedOptimizer(missingEstimate, () => result(100000, 90000)).eligibilityNotes.find((note) => note.lever === 'benefitTiming')).toMatchObject({
      status: 'skipped',
      reason: expect.stringContaining('needs CPP and OAS estimates')
    });
    expect(runBoundedOptimizer(already70, () => result(100000, 90000)).eligibilityNotes.find((note) => note.lever === 'benefitTiming')).toMatchObject({
      status: 'skipped',
      reason: expect.stringContaining('already age 70 or older')
    });
    expect(runBoundedOptimizer(shortProjection, () => result(100000, 90000)).eligibilityNotes.find((note) => note.lever === 'benefitTiming')).toMatchObject({
      status: 'skipped',
      reason: expect.stringContaining('does not reach age 70')
    });
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
    plan.p1.oas_monthly = 0;
    plan.assumptions.cppSharing = true;
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

  it('adds one bounded CPP sharing candidate for eligible couples without mutating the source plan', () => {
    const plan = cppSharingPlan();
    const candidates = buildBoundedOptimizerCandidates(plan);
    const cppSharingCandidates = candidates.filter((candidate) => candidate.id === 'cppSharing');
    const summary = runBoundedOptimizer(plan, (candidatePlan) =>
      candidatePlan.assumptions.cppSharing
        ? result(180000, 78000, null, { oasRecovery: 3000 })
        : result(120000, 90000, null, { oasRecovery: 9000 })
    );

    expect(cppSharingCandidates).toHaveLength(1);
    expect(cppSharingCandidates[0]).toMatchObject({
      label: 'Test CPP sharing',
      changedLevers: ['cppSharing'],
      changeSummary: 'Turn on CPP sharing in this test'
    });
    expect(cppSharingCandidates[0].plan.assumptions.cppSharing).toBe(true);
    expect(plan.assumptions.cppSharing).toBe(false);
    expect(summary.eligibilityNotes.find((note) => note.lever === 'cppSharing')).toMatchObject({ status: 'eligible' });
    expect(summary.suggestedCandidateId).toBe('cppSharing');
    expect(summary.explanation.tradeoffs.join(' ')).toContain('CPP sharing');
    expect(summary.recommendationNotes.find((note) => note.candidateId === 'cppSharing')).toMatchObject({
      status: 'canHighlight',
      reason: expect.stringContaining('without changing lifestyle or work timing')
    });
    expect(summary.evidenceRows.map((row) => row.id)).toEqual([
      'cppSharingLifetimeTax',
      'cppSharingFirstYearTax',
      'cppSharingPeakTax',
      'cppSharingOasRecovery',
      'cppSharingPortfolio'
    ]);
    expect(summary.evidenceRows.find((row) => row.id === 'cppSharingLifetimeTax')).toMatchObject({
      label: 'CPP sharing lifetime tax change',
      value: '-$12,000',
      tone: 'ok'
    });
    expect(summary.evidenceRows.find((row) => row.id === 'cppSharingOasRecovery')).toMatchObject({
      value: '-$6,000',
      tone: 'ok'
    });
    expect(summary.evidenceRows.find((row) => row.id === 'cppSharingPortfolio')).toMatchObject({
      value: '+$60,000',
      tone: 'ok'
    });
    expect(summary.optionGroups.find((group) => group.id === 'incomeSharing')).toMatchObject({
      label: 'Income-sharing checks',
      candidateIds: ['cppSharing']
    });
    expect(createPlanFile(plan).plan).not.toHaveProperty('boundedOptimizer');
    expect(createPlanFile(plan).plan.assumptions.cppSharing).toBe(false);
  });

  it('skips CPP sharing for single plans, missing CPP estimates, and plans where it is already on', () => {
    const single = readyPlan();
    const missingCpp = cppSharingPlan();
    missingCpp.p2.cpp65_monthly = 0;
    missingCpp.p2.cpp70_monthly = 0;
    const alreadyOn = cppSharingPlan();
    alreadyOn.assumptions.cppSharing = true;

    expect(buildBoundedOptimizerCandidates(single).map((candidate) => candidate.id)).not.toContain('cppSharing');
    expect(runBoundedOptimizer(single, () => result(100000, 90000)).eligibilityNotes.find((note) => note.lever === 'cppSharing')).toMatchObject({
      status: 'skipped',
      reason: expect.stringContaining('two-person plan')
    });
    expect(buildBoundedOptimizerCandidates(missingCpp).map((candidate) => candidate.id)).not.toContain('cppSharing');
    expect(runBoundedOptimizer(missingCpp, () => result(100000, 90000)).eligibilityNotes.find((note) => note.lever === 'cppSharing')).toMatchObject({
      status: 'skipped',
      reason: expect.stringContaining('both people have CPP estimates')
    });
    expect(buildBoundedOptimizerCandidates(alreadyOn).map((candidate) => candidate.id)).not.toContain('cppSharing');
    expect(runBoundedOptimizer(alreadyOn, () => result(100000, 90000)).eligibilityNotes.find((note) => note.lever === 'cppSharing')).toMatchObject({
      status: 'skipped',
      reason: expect.stringContaining('already included')
    });
  });

  it('adds one home-sale reliance candidate only when downsize year and proceeds are entered', () => {
    const plan = downsizePlan();
    const missingYear = downsizePlan();
    missingYear.downsize = { year: 0, netProceeds: 250000 };
    const missingProceeds = downsizePlan();
    missingProceeds.downsize = { year: 2040, netProceeds: 0 };

    const candidates = buildBoundedOptimizerCandidates(plan);
    const relianceCandidates = candidates.filter((candidate) => candidate.id === 'withoutDownsize');

    expect(relianceCandidates).toHaveLength(1);
    expect(relianceCandidates[0]).toMatchObject({
      label: 'Check without home-sale cash',
      changedLevers: ['downsizing'],
      changeSummary: 'Remove home-sale cash in this reliance check'
    });
    expect(relianceCandidates[0].plan.downsize).toEqual({ year: 0, netProceeds: 0 });
    expect(plan.downsize).toEqual({ year: 2040, netProceeds: 250000 });
    expect(buildBoundedOptimizerCandidates(missingYear).map((candidate) => candidate.id)).not.toContain('withoutDownsize');
    expect(buildBoundedOptimizerCandidates(missingProceeds).map((candidate) => candidate.id)).not.toContain('withoutDownsize');
  });

  it('keeps the home-sale reliance candidate review-only and adds reliance evidence rows', () => {
    const plan = downsizePlan();
    const summary = runBoundedOptimizer(plan, (candidatePlan) =>
      candidatePlan.downsize?.netProceeds === 0 ? result(900000, 50000, null) : result(120000, 90000, null)
    );

    expect(summary.suggestedCandidateId).not.toBe('withoutDownsize');
    expect(summary.recommendationNotes.find((note) => note.candidateId === 'withoutDownsize')).toMatchObject({
      status: 'reviewOnly',
      reason: expect.stringContaining('reliance check is evidence only')
    });
    expect(summary.evidenceRows.map((row) => row.id)).toEqual([
      'homeRelianceFundedYears',
      'homeRelianceFirstShortfall',
      'homeReliancePortfolio',
      'homeRelianceLifetimeTax'
    ]);
    expect(summary.evidenceRows.find((row) => row.id === 'homeReliancePortfolio')).toMatchObject({
      label: 'Projected money-left change',
      value: '+$780,000',
      tone: 'ok'
    });
    expect(summary.optionGroups.find((group) => group.id === 'homeEstate')).toMatchObject({
      label: 'Home and estate checks',
      candidateIds: ['withoutDownsize'],
      reviewOnlyCount: 1,
      canHighlightCount: 0
    });
    expect(createPlanFile(plan).plan).not.toHaveProperty('boundedOptimizer');
    expect(createPlanFile(plan).plan.downsize).toEqual({ year: 2040, netProceeds: 250000 });
  });

  it('holds back candidates that weaken an entered estate goal', () => {
    const plan = readyPlan();
    plan.inheritance = 300000;

    const summary = runBoundedOptimizer(plan, (candidatePlan, config) => {
      if (config.withdrawalOrder === 'registered-first') return result(250000, 50000, null);
      return candidatePlan.title === plan.title ? result(320000, 90000, null) : result(250000, 50000, null);
    });

    expect(summary.suggestedCandidateId).toBe('baseline');
    expect(summary.recommendationNotes.find((note) => note.candidateId === 'withdrawalRegisteredFirst')).toMatchObject({
      status: 'reviewOnly',
      reason: expect.stringContaining('weakens the entered estate goal')
    });
  });

  it('allows a shortfall repair when it does not worsen the estate-goal gap', () => {
    const plan = readyPlan();
    plan.inheritance = 300000;

    const summary = runBoundedOptimizer(plan, (candidatePlan) => {
      if (candidatePlan.spending.gogo === 80750) return result(310000, 88000, null);
      if (candidatePlan.spending.gogo === plan.spending.gogo) return result(250000, 90000, 2033);
      return result(240000, 95000, 2033);
    });

    expect(summary.suggestedCandidateId).toBe('spendLess5');
    expect(summary.recommendationNotes.find((note) => note.candidateId === 'spendLess5')).toMatchObject({
      status: 'canHighlight',
      reason: expect.stringContaining('materially improves a visible funding shortfall')
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
      reason: expect.stringContaining('already age 70')
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
      reason: expect.stringContaining('bridge year before age 70')
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
