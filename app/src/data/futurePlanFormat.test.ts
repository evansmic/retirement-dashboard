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
  futureExampleDataDraftIds,
  futureFreshExampleRebuildPlanIds,
  futureFixtureExpectationHardeningIds,
  futureFixtureValidationHelperIds,
  futureFixtureSpecificationIds,
  futureFundingTraceAccountGroupIds,
  futureFundingTraceCashAndOneOffHandlingIds,
  futureFundingTraceCopyBoundaryIds,
  futureFundingTraceDecisionGateIds,
  futureFundingTraceInstructionGuardrailIds,
  futureFundingTraceReconciliationRuleIds,
  futureFundingTraceSurvivorEstateCaveatIds,
  futureFundingTraceTaxCaveatIds,
  futureImplementationStepIds,
  futureImportBlockExpectationCheckIds,
  futureOptimizerReadinessIds,
  futureOptimizerContractItemIds,
  futureRollbackReleaseStopItems,
  futureSchemaResetDecisionReadinessIds,
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

  it('keeps the clean schema reset behind explicit decision evidence', () => {
    expect(futureSchemaResetDecisionReadinessIds()).toEqual([
      'fieldListFrozen',
      'oldFileBlockAccepted',
      'newExamplesReady',
      'rollbackReleaseReady'
    ]);
    expect(futurePlanFormatDraft.schemaResetDecisionReadiness.every((item) => item.stopIfMissing)).toBe(true);
    expect(futurePlanFormatDraft.schemaResetDecisionReadiness.find((item) => item.id === 'fieldListFrozen')?.requiredEvidence).toContain(
      'Runtime answers remain outside saved plan inputs.'
    );
    expect(futurePlanFormatDraft.schemaResetDecisionReadiness.find((item) => item.id === 'oldFileBlockAccepted')?.mustAvoid).toContain(
      'silent partial import'
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

  it('hardens fixture expectations before production import wiring', () => {
    expect(futureFixtureExpectationHardeningIds()).toEqual([
      'acceptedFixtureNoCalculatedAnswers',
      'acceptedFixtureMinimumFloorExplicit',
      'oldPreviewFixtureBlockedPlainly',
      'unsupportedFutureFixtureBlockedSafely',
      'rawPayloadFixtureBlockedDeliberately'
    ]);
    expect(
      futurePlanFormatDraft.fixtureExpectationHardening.find((item) => item.id === 'acceptedFixtureNoCalculatedAnswers')?.mustProve
    ).toContain('funding trace output is absent');
    expect(
      futurePlanFormatDraft.fixtureExpectationHardening.find((item) => item.id === 'oldPreviewFixtureBlockedPlainly')?.mustAvoid
    ).toContain('asking testers to send private files');
  });

  it('pins import-block expectations to plain messages and state preservation', () => {
    expect(futureImportBlockExpectationCheckIds()).toEqual(['oldPreviewBlockMessage', 'futureUnknownBlockMessage', 'rawPayloadBlockMessage']);
    expect(futurePlanFormatDraft.importBlockExpectationChecks.find((check) => check.id === 'oldPreviewBlockMessage')?.expectedMessage).toBe(
      'This plan was created with an earlier preview format. Please start a new plan.'
    );
    expect(futurePlanFormatDraft.importBlockExpectationChecks.find((check) => check.id === 'futureUnknownBlockMessage')?.mustAvoid).toContain(
      'silent downgrade'
    );
    expect(futurePlanFormatDraft.importBlockExpectationChecks.find((check) => check.id === 'rawPayloadBlockMessage')?.mustPreserve).toContain(
      'wrapped-file requirement'
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

  it('drafts future example values without changing current examples', () => {
    expect(futureExampleDataDraftIds()).toEqual(['singleMinimumFloor', 'coupleTightFloor', 'pensionCoupleSurvivor', 'estateHeavyRoom']);
    const single = futurePlanFormatDraft.futureExampleDataDrafts.find((example) => example.id === 'singleMinimumFloor');

    expect(single).toEqual(
      expect.objectContaining({
        status: 'planning-only',
        minimumMonthlyExpensesExMortgage: 3600,
        mortgageMonthlyPayment: 0,
        expectedCapacityStatus: 'covered'
      })
    );
    expect(single?.mustAvoid).toContain('migrated desired-spending values');
    expect(single?.mustAvoid).toContain('account withdrawal instructions');
  });

  it('drafts the tight couple example as a practical gap-review case', () => {
    const couple = futurePlanFormatDraft.futureExampleDataDrafts.find((example) => example.id === 'coupleTightFloor');

    expect(couple).toEqual(
      expect.objectContaining({
        status: 'planning-only',
        minimumMonthlyExpensesExMortgage: 6200,
        mortgageMonthlyPayment: 1800,
        expectedCapacityStatus: 'gap'
      })
    );
    expect(couple?.reviewFocus).toContain('work-longer and downsize comparisons are not pushy');
    expect(couple?.mustAvoid).toContain('automatic recommendation to cut spending');
  });

  it('drafts the DB pension survivor example as a tight survivor-review case', () => {
    const survivor = futurePlanFormatDraft.futureExampleDataDrafts.find((example) => example.id === 'pensionCoupleSurvivor');

    expect(survivor).toEqual(
      expect.objectContaining({
        status: 'planning-only',
        minimumMonthlyExpensesExMortgage: 5400,
        mortgageMonthlyPayment: 0,
        expectedCapacityStatus: 'tight'
      })
    );
    expect(survivor?.reviewFocus).toContain('survivor resilience is visible');
    expect(survivor?.mustAvoid).toContain('hiding survivor impact behind one number');
  });

  it('drafts the estate-heavy example without permission-to-spend language', () => {
    const estate = futurePlanFormatDraft.futureExampleDataDrafts.find((example) => example.id === 'estateHeavyRoom');

    expect(estate).toEqual(
      expect.objectContaining({
        status: 'planning-only',
        minimumMonthlyExpensesExMortgage: 7000,
        mortgageMonthlyPayment: 0,
        expectedCapacityStatus: 'covered'
      })
    );
    expect(estate?.reviewFocus).toContain('estate trade-off is visible');
    expect(estate?.mustAvoid).toContain('permission to spend more');
    expect(estate?.mustAvoid).toContain('guaranteed-room language');
  });

  it('plans fresh example rebuild steps before fixture or smoke wiring', () => {
    expect(futureFreshExampleRebuildPlanIds()).toEqual([
      'singleMinimumFloorDraftValues',
      'coupleTightFloorDraftValues',
      'pensionCoupleSurvivorDraftValues',
      'estateHeavyRoomDraftValues',
      'acceptedFixtureLater',
      'newFormatSmokeLater'
    ]);
    expect(
      futurePlanFormatDraft.freshExampleRebuildPlan.find((item) => item.id === 'acceptedFixtureLater')?.mustAvoid
    ).toContain('production loader wiring in planning package');
    expect(
      futurePlanFormatDraft.freshExampleRebuildPlan.find((item) => item.id === 'newFormatSmokeLater')?.mustAvoid
    ).toContain('account optimizer implementation');
  });

  it('plans funding trace account groups without withdrawal instructions', () => {
    expect(futurePlanFormatDraft.fundingTraceReadiness.status).toBe('planning-only');
    expect(futureFundingTraceAccountGroupIds()).toEqual([
      'income',
      'registered',
      'tfsa',
      'nonRegistered',
      'cash',
      'otherInflows',
      'tax'
    ]);
    expect(futurePlanFormatDraft.fundingTraceReadiness.accountGroups.find((group) => group.id === 'registered')?.mustAvoid).toContain(
      'account-by-account withdrawal instruction'
    );
    expect(futurePlanFormatDraft.fundingTraceReadiness.guardrails).toContain(
      'Funding trace must not become annual account-level sequencing.'
    );
  });

  it('plans funding trace tax caveats and reconciliation without tax advice', () => {
    expect(futureFundingTraceTaxCaveatIds()).toEqual(['oasRecoveryTax', 'registeredTaxable', 'nonRegisteredGains', 'ontarioHealthPremium']);
    expect(futureFundingTraceReconciliationRuleIds()).toEqual(['sourcesMinusTax', 'todayDollars', 'shortfallVisible']);
    expect(futurePlanFormatDraft.fundingTraceReadiness.taxCaveats.find((caveat) => caveat.id === 'registeredTaxable')?.mustAvoid).toContain(
      'tax advice'
    );
    expect(
      futurePlanFormatDraft.fundingTraceReadiness.reconciliationRules.find((rule) => rule.id === 'sourcesMinusTax')?.mustAvoid
    ).toContain('treating reconciliation as a withdrawal instruction');
  });

  it('plans first-year trace copy as review-oriented rather than instructional', () => {
    expect(futureFundingTraceCopyBoundaryIds()).toEqual(['traceIntro', 'reviewQualifier', 'taxQualifier', 'gapQualifier']);
    expect(futurePlanFormatDraft.fundingTraceReadiness.copyBoundaries.find((boundary) => boundary.id === 'traceIntro')?.phrase).toBe(
      'Where the first-year spending appears to come from'
    );
    expect(futurePlanFormatDraft.fundingTraceReadiness.copyBoundaries.find((boundary) => boundary.id === 'reviewQualifier')?.mustAvoid).toContain(
      'annual account-level sequence'
    );
  });

  it('plans survivor and estate funding trace caveats without advice language', () => {
    expect(futureFundingTraceSurvivorEstateCaveatIds()).toEqual([
      'survivorIncomeChange',
      'dbPensionContinuation',
      'estateIntentTradeoff',
      'jointToSingleTaxContext'
    ]);
    expect(
      futurePlanFormatDraft.fundingTraceReadiness.survivorEstateCaveats.find((caveat) => caveat.id === 'survivorIncomeChange')?.mustAvoid
    ).toContain('survivor recommendation');
    expect(
      futurePlanFormatDraft.fundingTraceReadiness.survivorEstateCaveats.find((caveat) => caveat.id === 'estateIntentTradeoff')?.mustAvoid
    ).toContain('permission to spend more');
  });

  it('plans cash and one-off inflow handling without turning assumptions into capacity promises', () => {
    expect(futureFundingTraceCashAndOneOffHandlingIds()).toEqual([
      'cashWedgeDraw',
      'downsizingProceeds',
      'inheritance',
      'oneOffOutflowOrInflow'
    ]);
    expect(futurePlanFormatDraft.fundingTraceReadiness.cashAndOneOffHandling.find((item) => item.id === 'cashWedgeDraw')?.mustAvoid).toContain(
      'cash target instruction'
    );
    expect(futurePlanFormatDraft.fundingTraceReadiness.cashAndOneOffHandling.find((item) => item.id === 'inheritance')?.mustAvoid).toContain(
      'counting uncertain inheritance as base capacity'
    );
  });

  it('blocks funding trace from becoming account sequencing or saved output', () => {
    expect(futureFundingTraceInstructionGuardrailIds()).toEqual([
      'noAccountOrder',
      'noAnnualRows',
      'noPersonalizedWithdrawal',
      'noSavedTrace',
      'reviewOnlyLanguage'
    ]);
    expect(
      futurePlanFormatDraft.fundingTraceReadiness.instructionGuardrails.find((guardrail) => guardrail.id === 'noAnnualRows')?.mustAvoid
    ).toContain('annual account-by-account sequencing');
    expect(futurePlanFormatDraft.fundingTraceReadiness.instructionGuardrails.find((guardrail) => guardrail.id === 'noSavedTrace')?.mustAvoid).toContain(
      'saved output field'
    );
  });

  it('adds a funding trace decision gate before runtime work begins', () => {
    expect(futureFundingTraceDecisionGateIds()).toEqual(['prototypeOnlyAfterContractReview', 'schemaResetBeforeRuntimeTrace']);
    expect(futurePlanFormatDraft.fundingTraceReadiness.decisionGate.every((gate) => gate.stopIfMissing)).toBe(true);
    expect(
      futurePlanFormatDraft.fundingTraceReadiness.decisionGate.find((gate) => gate.id === 'prototypeOnlyAfterContractReview')?.requiredEvidence
    ).toContain('Runtime-only boundary is still explicit.');
  });
});
