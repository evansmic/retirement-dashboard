import simulationEngineSource from '../../../engine/simulation_engine.js?raw';
import taxBenefitHelpersSource from '../../../engine/tax_benefit_helpers.js?raw';
import { V2PlanPayload } from '../types/plan';
import { SimulationConfig } from './runSimulation';

type ExtractedSimulationEngineModule = {
  createSimulationEngine: (plan: V2PlanPayload) => {
    runSimulation: (cfg: SimulationConfig) => unknown;
    SCENARIOS: Record<string, { label: string; cfg: SimulationConfig }>;
    RESULTS: Record<string, unknown>;
  };
  runSimulation: (plan: V2PlanPayload, cfg: SimulationConfig) => unknown;
  prepareEnginePlan: (plan: V2PlanPayload) => V2PlanPayload;
};

let moduleCache: ExtractedSimulationEngineModule | null = null;

function loadExtractedEngineModule(): ExtractedSimulationEngineModule {
  if (moduleCache) return moduleCache;

  const helpers = new Function(`${taxBenefitHelpersSource}; return RetirementTaxBenefitHelpers;`)();
  const runtime: {
    RetirementTaxBenefitHelpers: unknown;
    RetirementSimulationEngine?: ExtractedSimulationEngineModule;
  } = {
    RetirementTaxBenefitHelpers: helpers
  };

  const engine = new Function(
    'root',
    `const globalThis = root; ${simulationEngineSource}; return root.RetirementSimulationEngine;`
  )(
    runtime
  ) as ExtractedSimulationEngineModule | undefined;

  if (!engine) {
    throw new Error('Could not load extracted simulation engine.');
  }

  moduleCache = engine;
  return engine;
}

export function createExtractedSimulationEngine(plan: V2PlanPayload) {
  return loadExtractedEngineModule().createSimulationEngine(plan);
}

export function runExtractedSimulation(plan: V2PlanPayload, config: SimulationConfig) {
  return loadExtractedEngineModule().runSimulation(plan, config);
}
