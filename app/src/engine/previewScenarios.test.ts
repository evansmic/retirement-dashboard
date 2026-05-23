import { describe, expect, it } from 'vitest';
import { createBlankPlan } from '../data/defaultPlan';
import { SimulationResult, V2PlanPayload } from '../types/plan';
import {
  buildBaselinePreviewConfig,
  createDelayBenefitsConfig,
  createRetireLaterPlan,
  createSpendLessGogoPlan,
  createSpendingStressPlan,
  PreviewSimulationRunner,
  runResultsPreviewBundle,
  shouldRunSurvivorPreview
} from './previewScenarios';
import { SimulationConfig, runSimulationSafely } from './runSimulation';

function testPlan(): V2PlanPayload {
  const plan = createBlankPlan();
  plan.title = 'Preview runner test';
  plan.p1 = {
    ...plan.p1,
    name: 'Alex',
    retireYear: 2031,
    salary: 90000,
    rrsp: 250000,
    tfsa: 80000,
    cpp65_monthly: 1200,
    oas_monthly: 742
  };
  plan.p2 = {
    ...plan.p2,
    name: 'Morgan',
    dob: 1970,
    dobMonth: 5,
    retireYear: 2033,
    salary: 70000,
    rrsp: 150000,
    tfsa: 60000,
    cpp65_monthly: 900,
    oas_monthly: 742
  };
  plan.spending.gogo = 90000;
  plan.assumptions.retireYear = 2031;
  plan.assumptions.p1DiesInSurvivor = 2035;
  plan.assumptions.withdrawalOrder = 'cashFirst';
  return plan;
}

function fakeResult(year: number): SimulationResult {
  return {
    years: [
      {
        year,
        ageF: 65,
        ageM: 63,
        spending: 1,
        grossIncome: 1,
        dbPension: 0,
        cpp_f: 0,
        oas_f: 0,
        tfsa_draw: 0,
        nonreg_draw: 0,
        cash_draw: 0,
        totalTaxYear: 0,
        taxableIncome: 0,
        totalOasClawY: 0,
        totalAftaxYear: 1,
        cashFlow: 0,
        shortfall: 0,
        bal_rrsp: 0,
        bal_tfsa: 0,
        bal_lif: 0,
        bal_nonreg: 0,
        bal_cash: 0,
        bal_total: year
      }
    ],
    totalTax: 0
  } as SimulationResult;
}

describe('preview scenario runner', () => {
  it('builds the same baseline preview config React used before extraction', () => {
    const plan = testPlan();
    expect(buildBaselinePreviewConfig(plan)).toEqual({
      cppAgeF: 65,
      cppAgeM: 65,
      oasAgeF: 65,
      oasAgeM: 65,
      meltdown: false,
      returnRate: 0.05,
      pensionSplit: false,
      p1Dies: null,
      withdrawalOrder: 'cashFirst'
    });
  });

  it('maps older diagnostic withdrawal order settings to the consumer default preview', () => {
    const plan = testPlan();
    plan.assumptions.withdrawalOrder = 'meltdown';

    expect(buildBaselinePreviewConfig(plan)).toMatchObject({
      meltdown: false,
      withdrawalOrder: 'default'
    });
  });

  it('creates a retire-later plan without mutating the original plan', () => {
    const plan = testPlan();
    const scenario = createRetireLaterPlan(plan);

    expect(scenario.assumptions.retireYear).toBe(2033);
    expect(scenario.p1.retireYear).toBe(2033);
    expect(scenario.p2.retireYear).toBe(2035);
    expect(plan.assumptions.retireYear).toBe(2031);
    expect(plan.p1.retireYear).toBe(2031);
    expect(plan.p2.retireYear).toBe(2033);
  });

  it('creates a spend-less go-go scenario without mutating the original plan', () => {
    const plan = testPlan();
    const scenario = createSpendLessGogoPlan(plan);

    expect(scenario.spending.gogo).toBe(81000);
    expect(plan.spending.gogo).toBe(90000);
  });

  it('creates spending stress plans without mutating the original plan', () => {
    const plan = testPlan();

    expect(createSpendingStressPlan(plan, 0.95).spending.gogo).toBe(85500);
    expect(createSpendingStressPlan(plan, 1.05).spending.gogo).toBe(94500);
    expect(plan.spending.gogo).toBe(90000);
  });

  it('creates the delay-benefits config from the baseline config', () => {
    const config: SimulationConfig = buildBaselinePreviewConfig(testPlan());
    expect(createDelayBenefitsConfig(config)).toMatchObject({
      cppAgeF: 70,
      cppAgeM: 70,
      oasAgeF: 70,
      oasAgeM: 70,
      returnRate: 0.05,
      withdrawalOrder: 'cashFirst'
    });
  });

  it('runs baseline, scenarios, spending stress, and survivor rerun for a couple survivor plan', () => {
    const plan = testPlan();
    const calls: Array<{ plan: V2PlanPayload; config: SimulationConfig }> = [];
    const runner: PreviewSimulationRunner = (nextPlan, config) => {
      calls.push({ plan: nextPlan, config });
      return fakeResult(2026 + calls.length);
    };

    const preview = runResultsPreviewBundle(plan, runner);

    expect(preview.result.years[0].year).toBe(2027);
    expect(Object.keys(preview.scenarios).sort()).toEqual(['delayBenefits', 'retireLater', 'spendLessGogo']);
    expect(Object.keys(preview.spendingStress).sort()).toEqual(['current', 'littleLess', 'littleMore', 'meaningfullyLess']);
    expect(preview.survivor?.years[0].year).toBe(2033);
    expect(calls).toHaveLength(7);
    expect(calls[1].plan.assumptions.retireYear).toBe(2033);
    expect(calls[2].plan.spending.gogo).toBe(81000);
    expect(calls[3].config).toMatchObject({ cppAgeF: 70, cppAgeM: 70, oasAgeF: 70, oasAgeM: 70 });
    expect(calls[4].plan.spending.gogo).toBe(85500);
    expect(calls[5].plan.spending.gogo).toBe(94500);
    expect(calls[6].config.p1Dies).toBe(2035);
  });

  it('does not run higher-spending stress when the baseline already has a shortfall', () => {
    const plan = testPlan();
    const calls: Array<{ plan: V2PlanPayload; config: SimulationConfig }> = [];
    const runner: PreviewSimulationRunner = (nextPlan, config) => {
      calls.push({ plan: nextPlan, config });
      return calls.length === 1
        ? { years: [{ ...fakeResult(2027).years[0], shortfall: 1000 }] } as SimulationResult
        : fakeResult(2026 + calls.length);
    };

    const preview = runResultsPreviewBundle(plan, runner);

    expect(preview.spendingStress.littleMore).toBeUndefined();
    expect(calls).toHaveLength(6);
  });

  it('does not run survivor preview for single-person plans or missing survivor years', () => {
    const single = createBlankPlan();
    const coupleWithoutYear = testPlan();
    coupleWithoutYear.assumptions.p1DiesInSurvivor = 0;
    let callCount = 0;
    const runner: PreviewSimulationRunner = () => {
      callCount += 1;
      return fakeResult(2026 + callCount);
    };

    expect(shouldRunSurvivorPreview(single)).toBe(false);
    expect(runResultsPreviewBundle(single, runner).survivor).toBeNull();
    expect(callCount).toBe(6);
    expect(shouldRunSurvivorPreview(coupleWithoutYear)).toBe(false);
    expect(runResultsPreviewBundle(coupleWithoutYear, runner).survivor).toBeNull();
    expect(callCount).toBe(12);
  });

  it('returns a safe empty result for invalid or extreme plans instead of throwing', () => {
    const invalid = createBlankPlan();
    invalid.p1.retireYear = 0;
    invalid.assumptions.retireYear = 0;
    invalid.assumptions.planEnd = 2026;
    invalid.spending.gogo = 0;

    expect(() => runSimulationSafely(invalid, buildBaselinePreviewConfig(invalid))).not.toThrow();
    expect(runSimulationSafely(invalid, buildBaselinePreviewConfig(invalid))).toEqual({ years: [] });
    expect(() => runResultsPreviewBundle(invalid)).not.toThrow();
    expect(runResultsPreviewBundle(invalid).result).toEqual({ years: [] });
  });
});
