import { p2LooksBlank } from '../data/planFile';
import type { V2PlanPayload } from '../types/plan';

function n(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function hasTwoPersonDbPensionIncome(plan: V2PlanPayload): boolean {
  if (p2LooksBlank(plan.p2)) return false;
  return n(plan.p1.db_before65) + n(plan.p1.db_after65) + n(plan.p2.db_before65) + n(plan.p2.db_after65) > 0;
}

export function shouldIncludeBaselinePensionSplitting(plan: V2PlanPayload): boolean {
  return hasTwoPersonDbPensionIncome(plan);
}
