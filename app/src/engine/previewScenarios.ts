import { extractPlanPayload, p2LooksBlank } from '../data/planFile';
import { SimulationResult, V2PlanPayload } from '../types/plan';
import { runSimulationSafely, SimulationConfig } from './runSimulation';

export type PreviewScenarioId = 'retireLater' | 'spendLessGogo' | 'delayBenefits';

export type PreviewScenarioResults = Partial<Record<PreviewScenarioId, SimulationResult>>;

export type ResultsPreviewBundle = {
  result: SimulationResult;
  scenarios: PreviewScenarioResults;
  survivor: SimulationResult | null;
};

export type PreviewSimulationRunner = (plan: V2PlanPayload, config: SimulationConfig) => SimulationResult;

export function buildBaselinePreviewConfig(plan: V2PlanPayload): SimulationConfig {
  return {
    cppAgeF: 65,
    cppAgeM: 65,
    oasAgeF: 65,
    oasAgeM: 65,
    meltdown: false,
    returnRate: 0.05,
    pensionSplit: false,
    p1Dies: null,
    withdrawalOrder: plan.assumptions.withdrawalOrder || 'default'
  };
}

export function createRetireLaterPlan(plan: V2PlanPayload): V2PlanPayload {
  const retireLaterPlan = extractPlanPayload(plan);
  const retireLaterYear = (retireLaterPlan.assumptions.retireYear || retireLaterPlan.p1.retireYear || 0) + 2;
  if (retireLaterYear > 2) retireLaterPlan.assumptions.retireYear = retireLaterYear;
  if (retireLaterPlan.p1.retireYear) retireLaterPlan.p1.retireYear += 2;
  if (!p2LooksBlank(retireLaterPlan.p2) && retireLaterPlan.p2.retireYear) retireLaterPlan.p2.retireYear += 2;
  return retireLaterPlan;
}

export function createSpendLessGogoPlan(plan: V2PlanPayload): V2PlanPayload {
  const spendLessPlan = extractPlanPayload(plan);
  spendLessPlan.spending.gogo = Math.round((spendLessPlan.spending.gogo || 0) * 0.9);
  return spendLessPlan;
}

export function createDelayBenefitsConfig(config: SimulationConfig): SimulationConfig {
  return {
    ...config,
    cppAgeF: 70,
    cppAgeM: 70,
    oasAgeF: 70,
    oasAgeM: 70
  };
}

export function shouldRunSurvivorPreview(plan: V2PlanPayload): boolean {
  return !p2LooksBlank(plan.p2) && Boolean(plan.assumptions.p1DiesInSurvivor);
}

export function runResultsPreviewBundle(
  plan: V2PlanPayload,
  runner: PreviewSimulationRunner = runSimulationSafely
): ResultsPreviewBundle {
  const baselineConfig = buildBaselinePreviewConfig(plan);
  const result = runner(plan, baselineConfig);
  const scenarios: PreviewScenarioResults = {
    retireLater: runner(createRetireLaterPlan(plan), baselineConfig),
    spendLessGogo: runner(createSpendLessGogoPlan(plan), baselineConfig),
    delayBenefits: runner(plan, createDelayBenefitsConfig(baselineConfig))
  };
  const survivor = shouldRunSurvivorPreview(plan)
    ? runner(plan, { ...baselineConfig, p1Dies: plan.assumptions.p1DiesInSurvivor })
    : null;

  return { result, scenarios, survivor };
}
