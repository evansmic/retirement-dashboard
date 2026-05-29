import { describe, expect, it } from 'vitest';
import {
  flattenFuturePlanFormatFields,
  futureBlockedImportRules,
  futureExampleRequirementIds,
  futureFixtureSpecificationIds,
  futureImplementationStepIds,
  futureOptimizerReadinessIds,
  futurePlanFormatDraft
} from './futurePlanFormat';

describe('future plan format draft', () => {
  it('keeps the future format as a clean reset planning artifact', () => {
    expect(futurePlanFormatDraft.status).toBe('planning-only');
    expect(futurePlanFormatDraft.schemaReset).toBe('clean-reset');
    expect(futurePlanFormatDraft.oldPreviewImportBehavior).toBe('block');
    expect(futurePlanFormatDraft.oldPreviewImportMessage).toBe('This plan was created with an earlier preview format. Please start a new plan.');
  });

  it('defines minimum expenses as a new field instead of a migrated desired-spend value', () => {
    const fields = flattenFuturePlanFormatFields();
    const minimum = fields.find((field) => field.id === 'minimumMonthlyExpensesExMortgage');

    expect(minimum).toEqual(
      expect.objectContaining({
        status: 'new-format-field',
        label: 'Minimum monthly expenses, excluding mortgage payments already entered in Debts'
      })
    );
    expect(futurePlanFormatDraft.boundaries).toContain('Do not migrate old desired-spending fields into minimum monthly expenses.');
  });

  it('keeps capacity answers and account funding trace out of saved inputs', () => {
    const fields = flattenFuturePlanFormatFields();

    expect(fields.find((field) => field.id === 'confidentMonthlyAfterTaxSpend')?.status).toBe('derived-runtime');
    expect(fields.find((field) => field.id === 'discretionaryRoomAboveFloor')?.status).toBe('derived-runtime');
    expect(fields.find((field) => field.id === 'annualAccountFundingTrace')?.status).toBe('deferred-output');
    expect(futurePlanFormatDraft.boundaries).toContain('Do not add account optimizer outputs to saved plan files.');
  });

  it('requires fresh examples that cover capacity, gaps, survivor risk, and estate room', () => {
    expect(futureExampleRequirementIds()).toEqual([
      'singleMinimumFloor',
      'coupleTightFloor',
      'pensionCoupleSurvivor',
      'estateHeavyRoom'
    ]);
    expect(futurePlanFormatDraft.freshExampleRequirements.find((example) => example.id === 'coupleTightFloor')?.mustAvoid).toContain(
      'advice-like instructions'
    );
    expect(futurePlanFormatDraft.freshExampleRequirements.find((example) => example.id === 'estateHeavyRoom')?.mustAvoid).toContain(
      'safe-spend language'
    );
  });

  it('sets future import acceptance to block old preview and unknown future formats', () => {
    expect(futurePlanFormatDraft.importAcceptanceRules.find((rule) => rule.id === 'newFormat')?.decision).toBe('accept');
    expect(futureBlockedImportRules().map((rule) => rule.id)).toEqual(['oldPreview', 'futureUnknown']);
    expect(futurePlanFormatDraft.importAcceptanceRules.find((rule) => rule.id === 'oldPreview')?.message).toBe(
      'This plan was created with an earlier preview format. Please start a new plan.'
    );
    expect(futurePlanFormatDraft.importAcceptanceRules.find((rule) => rule.id === 'rawPayload')?.decision).toBe('defer');
  });

  it('requires a staged implementation checklist before the schema reset is wired', () => {
    expect(futureImplementationStepIds()).toEqual([
      'fieldReview',
      'fixturePlan',
      'loaderWire',
      'exampleRebuild',
      'verificationGate',
      'previewRelease'
    ]);
    expect(futurePlanFormatDraft.implementationChecklist.find((step) => step.id === 'loaderWire')?.requiredBeforeNext).toContain(
      'Raw payload policy decided'
    );
    expect(futurePlanFormatDraft.implementationChecklist.find((step) => step.id === 'verificationGate')?.rollback).toContain(
      'keep current v2 behavior'
    );
  });

  it('defines fixture specs for accepted new-format and blocked import cases', () => {
    expect(futureFixtureSpecificationIds()).toEqual([
      'acceptNewFormatMinimumFloor',
      'blockOldPreviewDesiredSpend',
      'blockUnsupportedFutureFormat',
      'rejectAmbiguousRawPayload'
    ]);
    expect(futurePlanFormatDraft.fixtureSpecifications.find((fixture) => fixture.id === 'blockOldPreviewDesiredSpend')?.mustProve).toContain(
      'old desired-spending fields are not mapped'
    );
    expect(futurePlanFormatDraft.fixtureSpecifications.find((fixture) => fixture.id === 'acceptNewFormatMinimumFloor')?.mustProve).toContain(
      'capacity answer is not saved as an input'
    );
  });

  it('keeps account optimizer readiness separate from annual account sequencing', () => {
    expect(futureOptimizerReadinessIds()).toEqual([
      'floorFirstObjective',
      'capacityObjective',
      'fundingTraceContract',
      'annualAccountSequencing'
    ]);
    expect(futurePlanFormatDraft.accountOptimizerReadiness.find((item) => item.id === 'floorFirstObjective')?.status).toBe(
      'needed-before-optimizer'
    );
    expect(futurePlanFormatDraft.accountOptimizerReadiness.find((item) => item.id === 'annualAccountSequencing')?.status).toBe(
      'deferred-until-sequencing'
    );
  });
});
