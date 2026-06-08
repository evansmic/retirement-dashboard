import { describe, expect, it } from 'vitest';
import { p2LooksBlank, validatePlanFile } from './planFile';
import { validatePlanForGuidedIntake } from './planValidation';
import {
  cleanExamplePlanCards,
  createCleanExamplePayload,
  createCleanExamplePlanFile,
  createCleanExampleRuntimePlan,
  createExamplePlan,
  examplePlanCards
} from './examplePlans';
import { CLEAN_SCHEMA_VERSION } from '../types/plan';
import { futurePlanFormatDraft } from './futurePlanFormat';

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

  it('defines the four fresh clean-schema examples without calculated answers', () => {
    expect(cleanExamplePlanCards.map((card) => card.id)).toEqual([
      'singleMinimumFloor',
      'coupleTightFloor',
      'pensionCoupleSurvivor',
      'estateHeavyRoom'
    ]);

    for (const card of cleanExamplePlanCards) {
      const payload = createCleanExamplePayload(card.id);

      expect(payload.schemaVersion).toBe(CLEAN_SCHEMA_VERSION);
      expect(payload.minimumMonthlyExpensesExMortgage).toBeGreaterThan(0);
      expect(payload.province).toBe('ON');
      expect(payload.taxYear).toBe(2026);
      expect(payload).not.toHaveProperty('confidentMonthlyAfterTaxSpend');
      expect(payload).not.toHaveProperty('fundingTrace');
      expect(payload).not.toHaveProperty('optimizer');
      expect(payload).not.toHaveProperty('annualAccountSequencing');
    }
  });

  it('opens fresh clean examples through the production importer and runtime adapter', () => {
    for (const card of cleanExamplePlanCards) {
      const file = createCleanExamplePlanFile(card.id);
      const imported = validatePlanFile(file);
      const runtime = createCleanExampleRuntimePlan(card.id);
      const validation = validatePlanForGuidedIntake(runtime);

      expect(file.app.schemaVersion).toBe(CLEAN_SCHEMA_VERSION);
      expect(file.plan.schemaVersion).toBe(CLEAN_SCHEMA_VERSION);
      expect(imported).toMatchObject({ ok: true });
      expect(runtime.schemaVersion).toBe(2);
      expect(runtime.title).toBe(file.title);
      expect(runtime.spending.gogo).toBe((file.plan.minimumMonthlyExpensesExMortgage + (file.plan.mortgageMonthlyPayment || 0)) * 12);
      expect(validation.blockers, `${card.id} blockers`).toEqual([]);
      expect(validation.canGenerate).toBe(true);
    }
  });

  it('keeps fresh clean single and couple examples distinct after runtime adaptation', () => {
    expect(p2LooksBlank(createCleanExampleRuntimePlan('singleMinimumFloor').p2)).toBe(true);
    expect(p2LooksBlank(createCleanExampleRuntimePlan('coupleTightFloor').p2)).toBe(false);
    expect(p2LooksBlank(createCleanExampleRuntimePlan('pensionCoupleSurvivor').p2)).toBe(false);
    expect(p2LooksBlank(createCleanExampleRuntimePlan('estateHeavyRoom').p2)).toBe(false);
    expect(createCleanExampleRuntimePlan('estateHeavyRoom').downsize).toEqual({ year: 2040, netProceeds: 250000 });
  });

  it('adds runtime-only planning seeds to clean examples without changing their clean files', () => {
    for (const card of cleanExamplePlanCards) {
      const file = createCleanExamplePlanFile(card.id);
      const runtime = createCleanExampleRuntimePlan(card.id);
      const runtimeAccountBalance =
        (runtime.p1.rrsp || 0) +
        (runtime.p1.tfsa || 0) +
        (runtime.p1.nonreg || 0) +
        (runtime.p2.rrsp || 0) +
        (runtime.p2.tfsa || 0) +
        (runtime.p2.nonreg || 0);

      expect(file.plan).not.toHaveProperty('p1');
      expect(file.plan).not.toHaveProperty('rrsp');
      expect(runtimeAccountBalance, `${card.id} runtime account balance`).toBeGreaterThan(0);
      expect(runtime.p1.cpp65_monthly, `${card.id} runtime CPP estimate`).toBeGreaterThan(0);
    }
  });

  it('keeps fresh clean examples aligned with the approved draft values', () => {
    for (const draft of futurePlanFormatDraft.futureExampleDataDrafts) {
      const payload = createCleanExamplePayload(draft.id);

      expect(payload.minimumMonthlyExpensesExMortgage).toBe(draft.minimumMonthlyExpensesExMortgage);
      expect(payload.mortgageMonthlyPayment).toBe(draft.mortgageMonthlyPayment);
      expect(payload.earlySpendingChangeAge).toBe(draft.earlySpendingChangeAge);
      expect(payload.laterSpendingChangeAge).toBe(draft.laterSpendingChangeAge);
    }
  });
});
