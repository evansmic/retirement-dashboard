import { runExtractedSimulation } from './extractedSimulationEngine';
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

export function runSimulation(
  plan: V2PlanPayload,
  config: SimulationConfig = {},
  _options: SimulationOptions = {}
): SimulationResult {
  return runExtractedSimulation(plan, config) as SimulationResult;
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
