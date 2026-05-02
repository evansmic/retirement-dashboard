import { describe, expect, it } from 'vitest';
import { createBlankPlan } from './defaultPlan';
import { validatePlanForGuidedIntake } from './planValidation';

describe('guided intake validation', () => {
  it('blocks incoherent plans that cannot safely generate results', () => {
    const plan = createBlankPlan();
    plan.p1.dob = 0;
    plan.spending.gogo = 0;
    plan.assumptions.planEnd = 2020;

    const result = validatePlanForGuidedIntake(plan);

    expect(result.canGenerate).toBe(false);
    expect(result.blockers.map((issue) => issue.code)).toContain('p1_birth_year');
    expect(result.blockers.map((issue) => issue.code)).toContain('gogo_spending');
    expect(result.blockers.map((issue) => issue.code)).toContain('plan_end');
  });

  it('allows advisory warnings without blocking generation', () => {
    const plan = createBlankPlan();
    plan.p1.name = '';
    plan.p1.cpp65_monthly = 0;
    plan.p1.cpp70_monthly = 0;

    const result = validatePlanForGuidedIntake(plan);

    expect(result.canGenerate).toBe(true);
    expect(result.blockers).toHaveLength(0);
    expect(result.warnings.map((issue) => issue.code)).toContain('p1_name');
    expect(result.warnings.map((issue) => issue.code)).toContain('p1_cpp');
  });
});
