import { runExtractedSimulation } from './extractedSimulationEngine';
import { validatePlanForGuidedIntake } from '../data/planValidation';
import { SimulationResult, V2PlanPayload } from '../types/plan';

export type SimulationConfig = {
  cppAgeF?: 65 | 70;
  cppAgeM?: 65 | 70;
  oasAgeF?: 65 | 70;
  oasAgeM?: 65 | 70;
  meltdown?: boolean;
  meltdownDraw60_64?: number;
  meltdownDraw65plus?: number;
  returnRate?: number;
  returnRates?: number[];
  spendMultiplier?: number;
  pensionSplit?: boolean;
  p1Dies?: number | null;
  withdrawalOrder?: string;
};

export type SimulationOptions = {
  source?: 'extracted-engine';
};

export type EngineRuntimeBoundary = {
  planInput: 'v2PlanPayload';
  resultOutput: 'simulationResult';
  sourceOwner: 'extractedSimulationModule';
  bridgeStatus: 'browserSourceBridge';
  usesDashboardGlobal: boolean;
  nativeModuleStatus: 'notYetNativeEsm';
  stressModuleStatus: 'stillInsideSimulationModule';
  annualOverrideExecution: 'notSupported';
  savedPlanOutput: 'none';
  disposition: 'engineRuntimeBoundaryOnly';
};

export const engineRuntimeBoundary: EngineRuntimeBoundary = {
  planInput: 'v2PlanPayload',
  resultOutput: 'simulationResult',
  sourceOwner: 'extractedSimulationModule',
  bridgeStatus: 'browserSourceBridge',
  usesDashboardGlobal: false,
  nativeModuleStatus: 'notYetNativeEsm',
  stressModuleStatus: 'stillInsideSimulationModule',
  annualOverrideExecution: 'notSupported',
  savedPlanOutput: 'none',
  disposition: 'engineRuntimeBoundaryOnly'
};

export function runSimulation(
  plan: V2PlanPayload,
  config: SimulationConfig = {},
  _options: SimulationOptions = {}
): SimulationResult {
  return runExtractedSimulation(plan, config) as SimulationResult;
}

export function runSimulationSafely(
  plan: V2PlanPayload,
  config: SimulationConfig = {},
  _options: SimulationOptions = {}
): SimulationResult {
  const validation = validatePlanForGuidedIntake(plan);
  if (!validation.canGenerate) return { years: [] };

  try {
    const result = runSimulation(plan, config);
    return simulationResultIsFinite(result) ? result : { years: [] };
  } catch {
    return { years: [] };
  }
}

function simulationResultIsFinite(result: SimulationResult | null | undefined): result is SimulationResult {
  if (!result || !Array.isArray(result.years)) return false;
  return result.years.every(
    (row) =>
      Number.isFinite(row.year) &&
      Number.isFinite(row.bal_total) &&
      Number.isFinite(row.totalAftaxYear) &&
      Number.isFinite(row.totalTaxYear)
  );
}

export const engineExtractionGate = {
  scaffoldReady: true,
  adaptersReady: true,
  browserSimulationBridgeReady: true,
  extractedSimulationReady: true,
  uiCanStart: true,
  message:
    'UI gate reached: the React app can validate v2 .plan.json files and run the extracted simulation module. The next slice should be the guided intake UI, while the stable dashboard remains the results fallback.'
} as const;
