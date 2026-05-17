import { validatePlanForGuidedIntake, type PlanValidationResult } from '../data/planValidation';
import type { V2PlanPayload } from '../types/plan';

export type OptimizerLeverId =
  | 'spending'
  | 'retirementTiming'
  | 'benefitTiming'
  | 'withdrawalOrder'
  | 'estateTarget'
  | 'downsizing';

export type OptimizerLeverPermission = 'canExplore' | 'mustPreserve' | 'needsDecision';

export type AnnualWithdrawalOverride = {
  year: number;
  rrsp?: number;
  lif?: number;
  tfsa?: number;
  nonRegistered?: number;
  cash?: number;
};

export type WithdrawalStrategyConfig = {
  mode: 'currentOrder' | 'annualOverrides';
  order: string;
  annualOverrides: AnnualWithdrawalOverride[];
};

export type OptimizerLeverContract = {
  id: OptimizerLeverId;
  permission: OptimizerLeverPermission;
  currentValue: string;
  guardrail: string;
};

export type OptimizerContract = {
  status: 'notReady' | 'readyForExtraction';
  execution: 'notRun';
  reason: string;
  withdrawalStrategy: WithdrawalStrategyConfig;
  levers: OptimizerLeverContract[];
  blockers: string[];
};

function n(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function hasBenefitEstimate(plan: V2PlanPayload): boolean {
  return n(plan.p1.cpp65_monthly) > 0 || n(plan.p1.cpp70_monthly) > 0 || n(plan.p1.oas_monthly) > 0;
}

export function buildOptimizerContract(
  plan: V2PlanPayload,
  validation: PlanValidationResult = validatePlanForGuidedIntake(plan)
): OptimizerContract {
  const blockers = validation.blockers.map((issue) => issue.message);
  const spending = n(plan.spending.gogo);
  const retirementYear = n(plan.assumptions.retireYear) || n(plan.p1.retireYear);
  const order = plan.assumptions.withdrawalOrder || 'default';
  const hasEstateTarget = n(plan.inheritance) > 0;
  const hasDownsizeChoice = n(plan.downsize?.year) > 0 || n(plan.downsize?.netProceeds) > 0;

  return {
    status: blockers.length > 0 ? 'notReady' : 'readyForExtraction',
    execution: 'notRun',
    reason:
      blockers.length > 0
        ? 'Clear plan blockers before optimizer extraction can evaluate this household.'
        : 'The plan has enough structure to describe optimizer inputs, but no optimizer has run.',
    withdrawalStrategy: {
      mode: 'currentOrder',
      order,
      annualOverrides: []
    },
    levers: [
      {
        id: 'spending',
        permission: spending > 0 ? 'canExplore' : 'needsDecision',
        currentValue: spending > 0 ? `$${Math.round(spending).toLocaleString()}` : 'Missing',
        guardrail: 'Treat spending as a household preference for review, not an automatic cut target.'
      },
      {
        id: 'retirementTiming',
        permission: retirementYear > 0 ? 'canExplore' : 'needsDecision',
        currentValue: retirementYear > 0 ? String(retirementYear) : 'Missing',
        guardrail: 'Move work timing only if the household says retirement timing is flexible.'
      },
      {
        id: 'benefitTiming',
        permission: hasBenefitEstimate(plan) ? 'canExplore' : 'needsDecision',
        currentValue: hasBenefitEstimate(plan) ? 'CPP/OAS estimates entered' : 'Missing CPP/OAS estimates',
        guardrail: 'Explore CPP/OAS timing only from credible monthly estimates.'
      },
      {
        id: 'withdrawalOrder',
        permission: 'canExplore',
        currentValue: order,
        guardrail: 'Future optimizer work may replace the fixed order with year-by-year withdrawal overrides.'
      },
      {
        id: 'estateTarget',
        permission: hasEstateTarget ? 'mustPreserve' : 'canExplore',
        currentValue: hasEstateTarget ? `$${Math.round(n(plan.inheritance)).toLocaleString()}` : 'Not set',
        guardrail: 'Preserve explicit estate wishes unless the household changes them.'
      },
      {
        id: 'downsizing',
        permission: hasDownsizeChoice ? 'mustPreserve' : 'canExplore',
        currentValue: hasDownsizeChoice ? 'Downsize choice entered' : 'No downsize choice entered',
        guardrail: 'Do not invent a home sale; only test downsizing when the household permits it.'
      }
    ],
    blockers
  };
}
