import { describe, expect, it } from 'vitest';
import { p2LooksBlank } from './planFile';
import { validatePlanForGuidedIntake } from './planValidation';
import { createExamplePlan, examplePlanCards } from './examplePlans';

describe('React example plans', () => {
  it('exposes the bundled consumer example stories with stable ids', () => {
    expect(examplePlanCards.map((card) => card.id)).toEqual([
      'diy-couple',
      'db-pension-couple',
      'single-late-career',
      'public-comparator-single',
      'retired-traditional',
      'fire-couple'
    ]);
    expect(new Set(examplePlanCards.map((card) => card.id)).size).toBe(examplePlanCards.length);
  });

  it('creates schema v2 editable plan payloads with no intake blockers', () => {
    for (const card of examplePlanCards) {
      const plan = createExamplePlan(card.id);
      const validation = validatePlanForGuidedIntake(plan);

      expect(plan.schemaVersion).toBe(2);
      expect(plan.title).toBeTruthy();
      expect(plan.p1.name).toBeTruthy();
      expect(plan.assumptions.retireYear).toBeGreaterThanOrEqual(2026);
      expect(validation.blockers, `${card.id} blockers`).toEqual([]);
      expect(validation.canGenerate).toBe(true);
    }
  });

  it('keeps single examples single and couple examples active for survivor-capable stories', () => {
    expect(p2LooksBlank(createExamplePlan('single-late-career').p2)).toBe(true);
    expect(p2LooksBlank(createExamplePlan('public-comparator-single').p2)).toBe(true);
    expect(p2LooksBlank(createExamplePlan('diy-couple').p2)).toBe(false);
    expect(p2LooksBlank(createExamplePlan('db-pension-couple').p2)).toBe(false);
    expect(p2LooksBlank(createExamplePlan('retired-traditional').p2)).toBe(false);
    expect(p2LooksBlank(createExamplePlan('fire-couple').p2)).toBe(false);
  });

  it('returns a fresh working copy each time', () => {
    const first = createExamplePlan('db-pension-couple');
    const second = createExamplePlan('db-pension-couple');

    first.p1.name = 'Changed';

    expect(second.p1.name).toBe('Robert');
    expect(first).not.toBe(second);
  });
});
