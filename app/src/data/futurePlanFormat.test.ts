import { describe, expect, it } from 'vitest';
import {
  flattenFuturePlanFormatFields,
  futureAcceptedImportRuleIds,
  futureCapacitySelectorInputIds,
  futureCapacitySelectorOutputIds,
  futureCapacitySelectorStatusMappingIds,
  futureCapacityReviewFactorIds,
  futureBlockedImportRules,
  futureCapacityStatusIds,
  futureExampleRequirementIds,
  futureFixtureValidationHelperIds,
  futureFixtureSpecificationIds,
  futureImplementationStepIds,
  futureOptimizerReadinessIds,
  futureOptimizerContractItemIds,
  futureRollbackReleaseStopItems,
  futureTestOnlyFixtureShapeIds,
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
    expect(futureBlockedImportRules().map((rule) => rule.id)).toEqual(['oldPreview', 'futureUnknown', 'rawPayload']);
    expect(futurePlanFormatDraft.importAcceptanceRules.find((rule) => rule.id === 'oldPreview')?.message).toBe(
      'This plan was created with an earlier preview format. Please start a new plan.'
    );
    expect(futurePlanFormatDraft.importAcceptanceRules.find((rule) => rule.id === 'rawPayload')?.decision).toBe('block');
    expect(futureAcceptedImportRuleIds()).toEqual(['newFormat']);
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

  it('requires rollback and release evidence before the reset ships', () => {
    expect(futurePlanFormatDraft.rollbackReleaseChecklist.map((item) => item.id)).toEqual([
      'rollbackBuild',
      'testerFreshStartNotice',
      'importBlockSmoke',
      'newFormatSmoke',
      'postReleaseWatch'
    ]);
    expect(futureRollbackReleaseStopItems().map((item) => item.id)).toEqual([
      'rollbackBuild',
      'testerFreshStartNotice',
      'importBlockSmoke',
      'newFormatSmoke'
    ]);
    expect(futurePlanFormatDraft.rollbackReleaseChecklist.find((item) => item.id === 'testerFreshStartNotice')?.requiredEvidence).toContain(
      'No request to send private plan files'
    );
  });

  it('defines test-only fixture shapes without saving calculated answers', () => {
    expect(futureTestOnlyFixtureShapeIds()).toEqual([
      'futureMinimumFloorPlan',
      'legacyPreviewDesiredSpendPayload',
      'unsupportedFuturePlanFile'
    ]);
    expect(futurePlanFormatDraft.testOnlyFixtureShapes.find((shape) => shape.id === 'futureMinimumFloorPlan')?.forbiddenKeys).toContain(
      'confidentMonthlyAfterTaxSpend'
    );
    expect(futurePlanFormatDraft.testOnlyFixtureShapes.find((shape) => shape.id === 'legacyPreviewDesiredSpendPayload')?.expectedImportResult).toBe(
      'block'
    );
  });

  it('defines optimizer contract readiness without account instructions or saved outputs', () => {
    expect(futureOptimizerContractItemIds()).toEqual([
      'floorInputs',
      'capacityRuntimeOutput',
      'fundingTraceRuntimeOutput',
      'reviewBoundary'
    ]);
    expect(futurePlanFormatDraft.optimizerContractReadiness.find((item) => item.id === 'capacityRuntimeOutput')?.mustExclude).toContain(
      'saved output field'
    );
    expect(futurePlanFormatDraft.optimizerContractReadiness.find((item) => item.id === 'fundingTraceRuntimeOutput')?.mustExclude).toContain(
      'annual account-by-account instructions'
    );
  });

  it('decides future raw payload policy as wrapped-file only', () => {
    expect(futurePlanFormatDraft.rawPayloadPolicy.decision).toBe('block-raw-payloads-after-reset');
    expect(futurePlanFormatDraft.rawPayloadPolicy.allowed).toEqual(['Wrapped future clean-format plan files']);
    expect(futurePlanFormatDraft.rawPayloadPolicy.blocked).toContain('Raw unwrapped JSON payloads');
    expect(futurePlanFormatDraft.rawPayloadPolicy.message).toBe(
      'This file is not a supported plan file. Please start a new plan or open a saved plan from this preview.'
    );
  });

  it('plans test-only fixture validation helpers without wiring imports', () => {
    expect(futureFixtureValidationHelperIds()).toEqual(['assertRequiredKeys', 'assertForbiddenKeys', 'assertExpectedImportResult']);
    expect(futurePlanFormatDraft.fixtureValidationHelpers.every((helper) => helper.mode === 'test-only')).toBe(true);
    expect(futurePlanFormatDraft.fixtureValidationHelpers.find((helper) => helper.id === 'assertExpectedImportResult')?.mustNotDo).toContain(
      'wire the production loader'
    );
  });

  it('defines capacity statuses without guarantees or pressure language', () => {
    expect(futureCapacityStatusIds()).toEqual(['covered', 'tight', 'gap', 'cannotTell']);
    expect(futurePlanFormatDraft.capacityStatusReadiness.find((status) => status.id === 'covered')?.mustAvoid).toContain('guaranteed language');
    expect(futurePlanFormatDraft.capacityStatusReadiness.find((status) => status.id === 'gap')?.mustAvoid).toContain(
      'automatic recommendation to cut spending'
    );
    expect(futurePlanFormatDraft.capacityStatusReadiness.find((status) => status.id === 'cannotTell')?.mustAvoid).toContain('false precision');
  });

  it('plans capacity selector inputs and runtime-only outputs', () => {
    expect(futurePlanFormatDraft.capacitySelectorReadiness.status).toBe('planning-only');
    expect(futureCapacitySelectorInputIds()).toEqual([
      'minimumMonthlyExpensesExMortgage',
      'mortgageMonthlyPayment',
      'spendingPathBreakpoints',
      'projectedAfterTaxCapacity',
      'fundingTracePreview'
    ]);
    expect(futureCapacitySelectorOutputIds()).toEqual(['confidentMonthlyAfterTaxSpend', 'capacityStatus', 'reviewFactors']);
    expect(futurePlanFormatDraft.capacitySelectorReadiness.guardrails).toContain('The selector must not write to saved plans.');
    expect(futurePlanFormatDraft.capacitySelectorReadiness.outputs.find((output) => output.id === 'confidentMonthlyAfterTaxSpend')?.mustAvoid).toContain(
      'guaranteed safe-spend language'
    );
  });

  it('maps capacity statuses to review-oriented prompts', () => {
    expect(futureCapacitySelectorStatusMappingIds()).toEqual(['covered', 'tight', 'gap', 'cannotTell']);
    expect(futurePlanFormatDraft.capacitySelectorReadiness.statusMappings.find((mapping) => mapping.statusId === 'covered')?.reviewPrompt).toContain(
      'Review tax, survivor needs, estate intent, and spending path'
    );
    expect(futurePlanFormatDraft.capacitySelectorReadiness.statusMappings.find((mapping) => mapping.statusId === 'gap')?.reviewPrompt).toContain(
      'Compare practical options'
    );
  });

  it('keeps capacity review factors from becoming instructions or advice', () => {
    expect(futureCapacityReviewFactorIds()).toEqual(['tax', 'survivor', 'estate', 'fundingTrace', 'spendingPath']);
    expect(futurePlanFormatDraft.capacitySelectorReadiness.reviewFactors.every((factor) => factor.mustStay === 'review-factor')).toBe(true);
    expect(futurePlanFormatDraft.capacitySelectorReadiness.reviewFactors.find((factor) => factor.id === 'fundingTrace')?.mustNotBecome).toContain(
      'annual account instruction'
    );
    expect(futurePlanFormatDraft.capacitySelectorReadiness.reviewFactors.find((factor) => factor.id === 'estate')?.mustNotBecome).toContain(
      'permission to spend more'
    );
  });
});
