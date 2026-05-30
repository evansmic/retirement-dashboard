import { describe, expect, it } from 'vitest';
import {
  flattenFuturePlanFormatFields,
  futureAcceptedImportRuleIds,
  futureCapacitySelectorInputIds,
  futureCapacitySelectorOutputIds,
  futureCapacitySelectorStatusMappingIds,
  futureCleanSchemaResetFieldContractIds,
  futureCleanSchemaResetFixturePrepRows,
  futureCleanSchemaResetImportAdapterContractIds,
  futureCleanSchemaResetImplementationCloseoutRows,
  futureCleanSchemaResetPrepRows,
  futureCleanSchemaResetV1FeedbackGateIds,
  futureCleanSchemaResetV1TrustRows,
  futureCapacitySelectorBoundaryRows,
  futureCapacitySelectorScenarioIds,
  futureCapacityGapOptionIds,
  futureCapacityReviewFactorIds,
  futureBlockedImportRules,
  futureCapacityStatusIds,
  futureExampleRequirementIds,
  futureExampleDataBoundaryRows,
  futureExampleDataDraftIds,
  futureExampleRebuildAlignmentRows,
  futureFreshExampleRebuildPlanIds,
  futureFixtureExpectationHardeningIds,
  futureFixtureSampleCoverageRows,
  futureFixtureValidationHelperIds,
  futureFixtureSpecificationIds,
  futureFundingTraceAccountGroupIds,
  futureFundingTraceCashAndOneOffHandlingIds,
  futureFundingTraceCaveatCoverageRows,
  futureFundingTraceCloseoutRows,
  futureFundingTraceCopyBoundaryIds,
  futureFundingTraceDecisionGateIds,
  futureFundingTraceExampleSampleIds,
  futureFundingTraceFirstYearRowIds,
  futureFundingTraceInstructionGuardrailIds,
  futureFundingTraceReconciliationRuleIds,
  futureFundingTraceBoundaryRows,
  futureFundingTraceSampleCoverageRows,
  futureFundingTraceSurvivorEstateCaveatIds,
  futureFundingTraceTaxCaveatIds,
  futureImplementationStepIds,
  futureImportBlockExpectationCheckIds,
  futureMinimumFloorFixtureSample,
  futureOldPreviewFixtureSample,
  futureOptimizerReadinessIds,
  futureOptimizerContractItemIds,
  futureRawPayloadFixtureSample,
  futureRawPayloadSampleBlockExpectation,
  futureRollbackReleaseStopItems,
  futureSchemaResetDecisionEvidenceRows,
  futureSchemaResetFinalGateRows,
  futureSchemaResetImplementationGateRows,
  futureSchemaResetImportDecisionRows,
  futureSchemaResetDecisionReadinessIds,
  futureTestOnlyFixtureSamples,
  futureTestOnlyFixtureShapeIds,
  futureUnsupportedFormatFixtureSample,
  futurePlanFormatDraft,
  findFutureTestOnlyFixtureShape,
  futureFixtureExpectationCoverageRows,
  futureImportBlockExpectationCoverageRows,
  selectFutureCapacityStatusPreview,
  validateFutureExampleCapacityStatusDrafts,
  validateFutureCapacitySelectorScenarios,
  validateFutureFixtureSamples,
  validateFutureFixtureShapeBatch,
  validateFutureFixtureShape
} from './futurePlanFormat';

describe('future plan format draft', () => {
  it('keeps the future format as a clean reset planning artifact', () => {
    expect(futurePlanFormatDraft.status).toBe('planning-only');
    expect(futurePlanFormatDraft.schemaReset).toBe('clean-reset');
    expect(futurePlanFormatDraft.oldPreviewImportBehavior).toBe('block');
    expect(futurePlanFormatDraft.oldPreviewImportMessage).toBe(
      'This plan was created with an earlier version. Start a fresh plan to use the current features.'
    );
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
      'This plan was created with an earlier version. Start a fresh plan to use the current features.'
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

  it('keeps schema reset decision evidence gated before implementation begins', () => {
    expect(futureSchemaResetDecisionEvidenceRows()).toEqual([
      expect.objectContaining({ id: 'fieldListFrozen', status: 'pass', hasStopGate: true }),
      expect.objectContaining({ id: 'oldFileBlockAccepted', status: 'pass', avoidsUnsafeImplementation: true }),
      expect.objectContaining({ id: 'newExamplesReady', status: 'pass', hasRequiredEvidence: true }),
      expect.objectContaining({ id: 'rollbackReleaseReady', status: 'pass', hasStopGate: true })
    ]);
  });

  it('marks schema reset decision evidence incomplete when a stop gate is removed', () => {
    expect(
      futureSchemaResetDecisionEvidenceRows({
        ...futurePlanFormatDraft,
        schemaResetDecisionReadiness: futurePlanFormatDraft.schemaResetDecisionReadiness.map((item) =>
          item.id === 'rollbackReleaseReady' ? { ...item, stopIfMissing: false } : item
        )
      }).find((row) => row.id === 'rollbackReleaseReady')
    ).toMatchObject({ status: 'fail', hasStopGate: false });
  });

  it('keeps schema reset implementation blocked behind import, example, rollback, and UI boundaries', () => {
    expect(futureSchemaResetImplementationGateRows()).toEqual([
      { id: 'noProductionImportYet', status: 'pass', detail: 'Production import wiring waits for blocked-import tests.' },
      { id: 'noSavedOutputs', status: 'pass', detail: 'Calculated answers and optimizer outputs stay out of saved plan files.' },
      { id: 'freshExamplesRequired', status: 'pass', detail: 'Fresh examples are required before runtime wiring.' },
      { id: 'rollbackRequired', status: 'pass', detail: 'Rollback and smoke-test evidence remains required.' },
      { id: 'noUiOverhaul', status: 'pass', detail: 'The broad UI overhaul remains out of this gate.' }
    ]);
  });

  it('marks schema reset implementation gate incomplete if saved-output boundaries drift', () => {
    expect(
      futureSchemaResetImplementationGateRows({
        ...futurePlanFormatDraft,
        boundaries: futurePlanFormatDraft.boundaries.filter((boundary) => boundary !== 'Do not add account optimizer outputs to saved plan files.')
      }).find((row) => row.id === 'noSavedOutputs')
    ).toMatchObject({ status: 'fail' });
  });

  it('keeps schema reset import decisions explicit before loader wiring', () => {
    expect(futureSchemaResetImportDecisionRows()).toEqual([
      { id: 'acceptedFutureFixture', status: 'pass', detail: 'Accepted future format remains fixture-planned before production wiring.' },
      { id: 'oldPreviewBlock', status: 'pass', detail: 'Old preview files block with plain fresh-start copy.' },
      { id: 'unsupportedFutureBlock', status: 'pass', detail: 'Unsupported future files block before unknown fields can be dropped.' },
      { id: 'rawPayloadBlock', status: 'pass', detail: 'Raw payloads remain blocked unless wrapped as supported plan files.' },
      { id: 'currentCompatibilityDecision', status: 'pass', detail: 'Current v2 compatibility decision remains explicit before loader wiring.' }
    ]);
  });

  it('marks schema reset import decisions incomplete if old-preview copy drifts', () => {
    expect(
      futureSchemaResetImportDecisionRows({
        ...futurePlanFormatDraft,
        importAcceptanceRules: futurePlanFormatDraft.importAcceptanceRules.map((rule) =>
          rule.id === 'oldPreview' ? { ...rule, message: 'We tried to open part of this plan.' } : rule
        )
      }).find((row) => row.id === 'oldPreviewBlock')
    ).toMatchObject({ status: 'fail' });
  });

  it('closes the schema reset decision gate without marking implementation ready', () => {
    expect(futureSchemaResetFinalGateRows()).toEqual([
      { id: 'decisionEvidenceComplete', status: 'pass', detail: 'Decision evidence rows are complete enough for review.' },
      { id: 'implementationStillBlocked', status: 'pass', detail: 'Implementation remains blocked behind explicit gates.' },
      { id: 'importDecisionsPinned', status: 'pass', detail: 'Accepted and blocked import decisions are pinned for review.' },
      { id: 'notReadyToWireYet', status: 'pass', detail: 'No decision row marks the schema reset ready to wire yet.' },
      { id: 'nextStepIsExplicitReview', status: 'pass', detail: 'The next step is an explicit review, not implementation by implication.' }
    ]);
  });

  it('marks final schema reset gate incomplete if any row becomes ready to wire by implication', () => {
    expect(
      futureSchemaResetFinalGateRows({
        ...futurePlanFormatDraft,
        schemaResetDecisionReadiness: futurePlanFormatDraft.schemaResetDecisionReadiness.map((item) =>
          item.id === 'fieldListFrozen' ? { ...item, decision: 'ready-to-wire' } : item
        )
      }).find((row) => row.id === 'notReadyToWireYet')
    ).toMatchObject({ status: 'fail' });
  });

  it('starts clean schema reset implementation prep without wiring production behavior', () => {
    expect(futurePlanFormatDraft.cleanSchemaResetImplementationPrep.status).toBe('planning-scoped-implementation-prep');
    expect(futureCleanSchemaResetFieldContractIds()).toEqual([
      'minimumMonthlyExpensesExMortgage',
      'confidentMonthlyAfterTaxSpend',
      'fundingTrace'
    ]);
    expect(futureCleanSchemaResetImportAdapterContractIds()).toEqual(['acceptWrappedFuturePlan', 'blockOlderPreviewPlan', 'blockRawPayload']);
    expect(futureCleanSchemaResetPrepRows()).toEqual([
      { id: 'fieldContract', status: 'pass', detail: 'Saved inputs and runtime-derived answers are separated.' },
      { id: 'importAdapter', status: 'pass', detail: 'Import adapter prep keeps old-file blocking soft and crash-free.' },
      { id: 'feedbackGates', status: 'pass', detail: 'V1 feedback gates keep derived capacity and saved-output trust visible.' },
      { id: 'guardrails', status: 'pass', detail: 'Implementation prep remains planning-scoped.' }
    ]);
  });

  it('folds current v1 feedback into reset prep gates without starting the UI overhaul', () => {
    expect(futureCleanSchemaResetV1FeedbackGateIds()).toEqual([
      'derivedCapacityHero',
      'minimumExpenseBridgeExplanation',
      'drawdownOutputNotPersisted',
      'spendingPathOptionality',
      'overviewDensityPolish'
    ]);
    expect(
      futurePlanFormatDraft.cleanSchemaResetImplementationPrep.v1FeedbackGates.find((gate) => gate.id === 'derivedCapacityHero')?.mustAvoid
    ).toContain('user must guess desired spend first');
    expect(
      futurePlanFormatDraft.cleanSchemaResetImplementationPrep.v1FeedbackGates.find((gate) => gate.id === 'overviewDensityPolish')?.stage
    ).toBe('later-ux-pass');
  });

  it('keeps clean reset fixture prep in-memory, blocked where needed, and without persisted plan files', () => {
    expect(futureCleanSchemaResetFixturePrepRows()).toEqual([
      { id: 'acceptedFutureFixture', status: 'pass', detail: 'Accepted future fixture stays in memory and excludes calculated capacity.' },
      { id: 'oldPreviewFixture', status: 'pass', detail: 'Old preview fixture blocks without migration or partial state.' },
      { id: 'unsupportedFutureFixture', status: 'pass', detail: 'Unsupported future fixture blocks before unknown fields are dropped.' },
      { id: 'rawPayloadFixture', status: 'pass', detail: 'Raw payload fixture blocks without becoming a plan file.' },
      { id: 'noPersistedFixtureFiles', status: 'pass', detail: 'Fixture prep remains in-memory and does not create .plan.json files.' }
    ]);
  });

  it('marks clean reset fixture prep incomplete when old-preview block guardrails drift', () => {
    expect(
      futureCleanSchemaResetFixturePrepRows([
        ...futureTestOnlyFixtureSamples.filter((sample) => sample.fixtureId !== 'legacyPreviewDesiredSpendPayload'),
        {
          ...futureOldPreviewFixtureSample,
          mustNotDo: futureOldPreviewFixtureSample.mustNotDo.filter((item) => item !== 'partially load current plan state')
        }
      ]).find((row) => row.id === 'oldPreviewFixture')
    ).toMatchObject({ status: 'fail' });
  });

  it('tracks v1 trust feedback before clean reset implementation proceeds', () => {
    expect(futureCleanSchemaResetV1TrustRows()).toEqual([
      { id: 'capacityFirst', status: 'pass', detail: 'The primary answer must be derived capacity, not a guessed desired spend.' },
      { id: 'todayDollarsVisible', status: 'pass', detail: "Today's dollars must be visible near the monthly capacity answer." },
      { id: 'softOldFileBlock', status: 'pass', detail: 'Older preview files use soft fresh-start copy and avoid technical error framing.' },
      { id: 'minimumBridgeExplanatory', status: 'pass', detail: 'The minimum-expense bridge should read as explanation, not a saved input.' },
      { id: 'noPersistedRuntimeOutputs', status: 'pass', detail: 'Optimizer, drawdown, and funding trace outputs stay out of saved plan files.' }
    ]);
  });

  it('marks v1 trust feedback incomplete if old-file block copy becomes technical or harsh', () => {
    expect(
      futureCleanSchemaResetV1TrustRows({
        ...futurePlanFormatDraft,
        oldPreviewImportMessage: 'Schema error: unsupported old preview file.'
      }).find((row) => row.id === 'softOldFileBlock')
    ).toMatchObject({ status: 'fail' });
  });

  it('closes clean reset implementation prep without approving schema or import wiring', () => {
    expect(futureCleanSchemaResetImplementationCloseoutRows()).toEqual([
      { id: 'planningScoped', status: 'pass', detail: 'This package remains planning-scoped implementation prep.' },
      { id: 'contractsReady', status: 'pass', detail: 'Field and import adapter contracts are ready for review.' },
      { id: 'fixturePrepReady', status: 'pass', detail: 'Fixture prep is in-memory and covers accepted and blocked cases.' },
      { id: 'v1TrustGatesReady', status: 'pass', detail: 'Current v1 feedback is captured as trust gates.' },
      {
        id: 'nextPackageNeedsApproval',
        status: 'pass',
        detail: 'The next package still needs explicit approval before wiring schema or import behavior.'
      }
    ]);
  });

  it('marks clean reset implementation closeout incomplete if a decision row is ready to wire', () => {
    expect(
      futureCleanSchemaResetImplementationCloseoutRows(futureTestOnlyFixtureSamples, {
        ...futurePlanFormatDraft,
        schemaResetDecisionReadiness: futurePlanFormatDraft.schemaResetDecisionReadiness.map((item) =>
          item.id === 'fieldListFrozen' ? { ...item, decision: 'ready-to-wire' } : item
        )
      }).find((row) => row.id === 'nextPackageNeedsApproval')
    ).toMatchObject({ status: 'fail' });
  });

  it('defines test-only fixture shapes without saving calculated answers', () => {
    expect(futureTestOnlyFixtureShapeIds()).toEqual([
      'futureMinimumFloorPlan',
      'legacyPreviewDesiredSpendPayload',
      'unsupportedFuturePlanFile',
      'rawUnwrappedPayload'
    ]);
    expect(futurePlanFormatDraft.testOnlyFixtureShapes.find((shape) => shape.id === 'futureMinimumFloorPlan')?.forbiddenKeys).toContain(
      'confidentMonthlyAfterTaxSpend'
    );
    expect(futurePlanFormatDraft.testOnlyFixtureShapes.find((shape) => shape.id === 'legacyPreviewDesiredSpendPayload')?.expectedImportResult).toBe(
      'block'
    );
    expect(futurePlanFormatDraft.testOnlyFixtureShapes.find((shape) => shape.id === 'rawUnwrappedPayload')).toMatchObject({
      intent: 'blocked-raw-payload',
      wrapper: 'raw-unwrapped-payload',
      expectedImportResult: 'block'
    });
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
      'This plan was created with an earlier version. Start a fresh plan to use the current features.'
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

  it('validates accepted fixture shapes in memory without calculated answers', () => {
    const shape = futurePlanFormatDraft.testOnlyFixtureShapes.find((item) => item.id === 'futureMinimumFloorPlan');

    expect(shape).toBeDefined();
    expect(
      validateFutureFixtureShape(shape!, {
        schemaVersion: 3,
        minimumMonthlyExpensesExMortgage: 3600,
        earlySpendingChangeAge: 75,
        laterSpendingChangeAge: 85
      })
    ).toEqual({
      fixtureId: 'futureMinimumFloorPlan',
      expectedImportResult: 'accept',
      status: 'pass',
      missingRequiredKeys: [],
      presentForbiddenKeys: [],
      importResultMatches: true,
      mode: 'test-only'
    });
  });

  it('keeps the accepted clean-format sample in memory and test-only', () => {
    const shape = findFutureTestOnlyFixtureShape(futureMinimumFloorFixtureSample.fixtureId);

    expect(futureMinimumFloorFixtureSample).toMatchObject({
      id: 'singleCoveredMinimumFloorInMemory',
      fixtureId: 'futureMinimumFloorPlan',
      plannedImportResult: 'accept',
      mode: 'test-only'
    });
    expect(futureMinimumFloorFixtureSample.mustNotDo).toEqual([
      'write a .plan.json file',
      'wire production import behavior',
      'save calculated capacity',
      'include annual account sequencing'
    ]);
    expect(validateFutureFixtureShape(shape!, futureMinimumFloorFixtureSample.fixture, futureMinimumFloorFixtureSample.plannedImportResult)).toMatchObject({
      fixtureId: 'futureMinimumFloorPlan',
      status: 'pass',
      missingRequiredKeys: [],
      presentForbiddenKeys: [],
      importResultMatches: true
    });
  });

  it('flags forbidden calculated answers and old spending keys in accepted fixture shapes', () => {
    const shape = futurePlanFormatDraft.testOnlyFixtureShapes.find((item) => item.id === 'futureMinimumFloorPlan');

    expect(
      validateFutureFixtureShape(shape!, {
        schemaVersion: 3,
        minimumMonthlyExpensesExMortgage: 3600,
        earlySpendingChangeAge: 75,
        laterSpendingChangeAge: 85,
        gogo: 85000,
        confidentMonthlyAfterTaxSpend: 7200
      })
    ).toMatchObject({
      status: 'fail',
      missingRequiredKeys: [],
      presentForbiddenKeys: ['gogo', 'confidentMonthlyAfterTaxSpend'],
      importResultMatches: true,
      mode: 'test-only'
    });
  });

  it('validates blocked legacy-preview fixture paths without mapping old spending to the floor', () => {
    const shape = futurePlanFormatDraft.testOnlyFixtureShapes.find((item) => item.id === 'legacyPreviewDesiredSpendPayload');

    expect(
      validateFutureFixtureShape(shape!, {
        schemaVersion: 2,
        spending: {
          gogo: 85000,
          slowgo: 72000,
          nogo: 62000
        }
      })
    ).toMatchObject({
      fixtureId: 'legacyPreviewDesiredSpendPayload',
      expectedImportResult: 'block',
      status: 'pass',
      missingRequiredKeys: [],
      presentForbiddenKeys: [],
      importResultMatches: true
    });
  });

  it('keeps the old-preview sample blocked and unmapped in memory', () => {
    const shape = findFutureTestOnlyFixtureShape(futureOldPreviewFixtureSample.fixtureId);

    expect(futureOldPreviewFixtureSample).toMatchObject({
      id: 'legacyDesiredSpendInMemory',
      fixtureId: 'legacyPreviewDesiredSpendPayload',
      plannedImportResult: 'block',
      mode: 'test-only'
    });
    expect(futureOldPreviewFixtureSample.fixture).not.toHaveProperty('minimumMonthlyExpensesExMortgage');
    expect(futureOldPreviewFixtureSample.mustNotDo).toContain('map desired spending into minimum expenses');
    expect(futureOldPreviewFixtureSample.mustNotDo).toContain('ask for private tester files');
    expect(validateFutureFixtureShape(shape!, futureOldPreviewFixtureSample.fixture, futureOldPreviewFixtureSample.plannedImportResult)).toMatchObject({
      fixtureId: 'legacyPreviewDesiredSpendPayload',
      expectedImportResult: 'block',
      status: 'pass',
      missingRequiredKeys: [],
      presentForbiddenKeys: [],
      importResultMatches: true
    });
  });

  it('fails fixture validation when the planned import result drifts', () => {
    const shape = futurePlanFormatDraft.testOnlyFixtureShapes.find((item) => item.id === 'unsupportedFuturePlanFile');

    expect(
      validateFutureFixtureShape(
        shape!,
        {
          schemaVersion: 99,
          futureOnlyField: true
        },
        'accept'
      )
    ).toMatchObject({
      fixtureId: 'unsupportedFuturePlanFile',
      expectedImportResult: 'block',
      status: 'fail',
      importResultMatches: false,
      mode: 'test-only'
    });
  });

  it('keeps the unsupported-future sample blocked before unknown fields can be dropped', () => {
    const shape = findFutureTestOnlyFixtureShape(futureUnsupportedFormatFixtureSample.fixtureId);

    expect(futureUnsupportedFormatFixtureSample).toMatchObject({
      id: 'unsupportedFutureFieldInMemory',
      fixtureId: 'unsupportedFuturePlanFile',
      plannedImportResult: 'block',
      mode: 'test-only'
    });
    expect(futureUnsupportedFormatFixtureSample.mustNotDo).toContain('drop unknown future fields');
    expect(futureUnsupportedFormatFixtureSample.mustNotDo).toContain('change current plan state');
    expect(validateFutureFixtureShape(shape!, futureUnsupportedFormatFixtureSample.fixture, futureUnsupportedFormatFixtureSample.plannedImportResult)).toMatchObject({
      fixtureId: 'unsupportedFuturePlanFile',
      expectedImportResult: 'block',
      status: 'pass',
      missingRequiredKeys: [],
      presentForbiddenKeys: [],
      importResultMatches: true
    });
  });

  it('keeps the raw-payload sample blocked as an unwrapped payload', () => {
    const shape = findFutureTestOnlyFixtureShape(futureRawPayloadFixtureSample.fixtureId);

    expect(futureRawPayloadFixtureSample).toMatchObject({
      id: 'rawUnwrappedPayloadInMemory',
      fixtureId: 'rawUnwrappedPayload',
      plannedImportResult: 'block',
      mode: 'test-only'
    });
    expect(futureRawPayloadFixtureSample.fixture).not.toHaveProperty('plan');
    expect(futureRawPayloadFixtureSample.fixture).not.toHaveProperty('metadata');
    expect(futureRawPayloadFixtureSample.mustNotDo).toContain('treat raw payloads as plan files');
    expect(futureRawPayloadFixtureSample.mustNotDo).toContain('change current plan state');
    expect(validateFutureFixtureShape(shape!, futureRawPayloadFixtureSample.fixture, futureRawPayloadFixtureSample.plannedImportResult)).toMatchObject({
      fixtureId: 'rawUnwrappedPayload',
      expectedImportResult: 'block',
      status: 'pass',
      missingRequiredKeys: [],
      presentForbiddenKeys: [],
      importResultMatches: true
    });
  });

  it('finds future test-only fixture shapes by stable id', () => {
    expect(findFutureTestOnlyFixtureShape('futureMinimumFloorPlan')).toMatchObject({
      id: 'futureMinimumFloorPlan',
      intent: 'accepted-new-format',
      expectedImportResult: 'accept'
    });
    expect(findFutureTestOnlyFixtureShape('missingFixtureShape')).toBeUndefined();
  });

  it('summarizes all future fixture shapes from an in-memory fixture map', () => {
    const summary = validateFutureFixtureShapeBatch({
      futureMinimumFloorPlan: {
        schemaVersion: 3,
        minimumMonthlyExpensesExMortgage: 3600,
        earlySpendingChangeAge: 75,
        laterSpendingChangeAge: 85
      },
      legacyPreviewDesiredSpendPayload: {
        schemaVersion: 2,
        spending: {
          gogo: 85000,
          slowgo: 72000,
          nogo: 62000
        }
      },
      unsupportedFuturePlanFile: {
        schemaVersion: 99,
        futureOnlyField: true
      },
      rawUnwrappedPayload: {
        payloadKind: 'raw-unwrapped-json',
        rawPlanPayload: {
          schemaVersion: 3
        }
      }
    });

    expect(summary).toMatchObject({
      status: 'pass',
      total: 4,
      passed: 4,
      failed: 0,
      mode: 'test-only'
    });
    expect(summary.results.map((result) => result.fixtureId)).toEqual([
      'futureMinimumFloorPlan',
      'legacyPreviewDesiredSpendPayload',
      'unsupportedFuturePlanFile',
      'rawUnwrappedPayload'
    ]);
  });

  it('validates the complete in-memory sample registry against planned fixture shapes', () => {
    const summary = validateFutureFixtureSamples();

    expect(futureTestOnlyFixtureSamples.map((sample) => sample.id)).toEqual([
      'singleCoveredMinimumFloorInMemory',
      'legacyDesiredSpendInMemory',
      'unsupportedFutureFieldInMemory',
      'rawUnwrappedPayloadInMemory'
    ]);
    expect(futureTestOnlyFixtureSamples.every((sample) => sample.mode === 'test-only')).toBe(true);
    expect(summary).toMatchObject({
      status: 'pass',
      total: 4,
      passed: 4,
      failed: 0,
      mode: 'test-only'
    });
    expect(summary.results.map((result) => [result.fixtureId, result.expectedImportResult])).toEqual([
      ['futureMinimumFloorPlan', 'accept'],
      ['legacyPreviewDesiredSpendPayload', 'block'],
      ['unsupportedFuturePlanFile', 'block'],
      ['rawUnwrappedPayload', 'block']
    ]);
  });

  it('keeps every in-memory sample covered by a known test-only shape and guardrails', () => {
    const coverage = futureFixtureSampleCoverageRows();

    expect(coverage).toEqual([
      expect.objectContaining({
        sampleId: 'singleCoveredMinimumFloorInMemory',
        fixtureId: 'futureMinimumFloorPlan',
        status: 'pass',
        hasKnownShape: true,
        importResultMatchesShape: true,
        isTestOnly: true,
        hasGuardrails: true
      }),
      expect.objectContaining({
        sampleId: 'legacyDesiredSpendInMemory',
        fixtureId: 'legacyPreviewDesiredSpendPayload',
        status: 'pass'
      }),
      expect.objectContaining({
        sampleId: 'unsupportedFutureFieldInMemory',
        fixtureId: 'unsupportedFuturePlanFile',
        status: 'pass'
      }),
      expect.objectContaining({
        sampleId: 'rawUnwrappedPayloadInMemory',
        fixtureId: 'rawUnwrappedPayload',
        status: 'pass'
      })
    ]);
  });

  it('marks sample coverage incomplete when a sample drifts from its shape', () => {
    const coverage = futureFixtureSampleCoverageRows([
      {
        ...futureRawPayloadFixtureSample,
        plannedImportResult: 'accept',
        mustNotDo: []
      }
    ]);

    expect(coverage).toEqual([
      expect.objectContaining({
        sampleId: 'rawUnwrappedPayloadInMemory',
        status: 'fail',
        hasKnownShape: true,
        importResultMatchesShape: false,
        isTestOnly: true,
        hasGuardrails: false
      })
    ]);
  });

  it('ties the raw-payload sample to the planned raw block message and state boundary', () => {
    expect(futureRawPayloadSampleBlockExpectation()).toEqual({
      sampleId: 'rawUnwrappedPayloadInMemory',
      status: 'pass',
      expectedMessage: 'This file is not a supported plan file. Please start a new plan or open a saved plan from this preview.',
      messageMatchesRule: true,
      messageMatchesPolicy: true,
      preservesCurrentState: true,
      rejectsRawPlanFileTreatment: true
    });
  });

  it('marks the raw-payload sample block expectation incomplete if copy or guardrails drift', () => {
    expect(
      futureRawPayloadSampleBlockExpectation(
        {
          ...futureRawPayloadFixtureSample,
          mustNotDo: ['partially import raw payload data']
        },
        {
          ...futurePlanFormatDraft,
          rawPayloadPolicy: {
            ...futurePlanFormatDraft.rawPayloadPolicy,
            message: 'Different raw block message.'
          }
        }
      )
    ).toMatchObject({
      status: 'fail',
      messageMatchesRule: false,
      messageMatchesPolicy: false,
      preservesCurrentState: false,
      rejectsRawPlanFileTreatment: false
    });
  });

  it('summarizes missing batch fixtures as failures without reading files', () => {
    const summary = validateFutureFixtureShapeBatch({
      futureMinimumFloorPlan: {
        schemaVersion: 3,
        minimumMonthlyExpensesExMortgage: 3600,
        earlySpendingChangeAge: 75,
        laterSpendingChangeAge: 85
      }
    });

    expect(summary).toMatchObject({
      status: 'fail',
      total: 4,
      passed: 1,
      failed: 3,
      mode: 'test-only'
    });
    expect(summary.results.find((result) => result.fixtureId === 'legacyPreviewDesiredSpendPayload')?.missingRequiredKeys).toEqual([
      'schemaVersion',
      'spending.gogo',
      'spending.slowgo',
      'spending.nogo'
    ]);
  });

  it('keeps hardening expectations attached to known fixture shapes', () => {
    const coverage = futureFixtureExpectationCoverageRows();

    expect(coverage).toHaveLength(5);
    expect(coverage.every((row) => row.status === 'pass')).toBe(true);
    expect(coverage.find((row) => row.expectationId === 'acceptedFixtureNoCalculatedAnswers')).toMatchObject({
      fixtureId: 'futureMinimumFloorPlan',
      hasKnownFixtureShape: true,
      hasProofRequirements: true,
      hasAvoidanceRequirements: true
    });
    expect(coverage.find((row) => row.expectationId === 'rawPayloadFixtureBlockedDeliberately')).toMatchObject({
      fixtureId: 'rawUnwrappedPayload',
      status: 'pass'
    });
  });

  it('marks hardening expectations incomplete when fixture links or requirements are missing', () => {
    const coverage = futureFixtureExpectationCoverageRows({
      ...futurePlanFormatDraft,
      fixtureExpectationHardening: [
        {
          id: 'brokenExpectation',
          fixtureId: 'unsupportedFuturePlanFile',
          expectation: 'Broken expectation for test coverage.',
          mustProve: [],
          mustAvoid: ['silent import']
        },
        {
          id: 'unknownFixtureExpectation',
          fixtureId: 'missingShape' as never,
          expectation: 'Unknown fixture for test coverage.',
          mustProve: ['the link is checked'],
          mustAvoid: ['unchecked fixture ids']
        }
      ]
    });

    expect(coverage).toEqual([
      expect.objectContaining({
        expectationId: 'brokenExpectation',
        status: 'fail',
        hasKnownFixtureShape: true,
        hasProofRequirements: false,
        hasAvoidanceRequirements: true
      }),
      expect.objectContaining({
        expectationId: 'unknownFixtureExpectation',
        status: 'fail',
        hasKnownFixtureShape: false,
        hasProofRequirements: true,
        hasAvoidanceRequirements: true
      })
    ]);
  });

  it('keeps pinned block messages aligned with planned blocked import rules', () => {
    const coverage = futureImportBlockExpectationCoverageRows();

    expect(coverage).toEqual([
      expect.objectContaining({
        checkId: 'oldPreviewBlockMessage',
        blockedRuleId: 'oldPreview',
        status: 'pass',
        hasMatchingRule: true,
        messageMatchesRule: true,
        hasStatePreservation: true
      }),
      expect.objectContaining({
        checkId: 'futureUnknownBlockMessage',
        blockedRuleId: 'futureUnknown',
        status: 'pass',
        hasMatchingRule: true,
        messageMatchesRule: true,
        hasStatePreservation: true
      }),
      expect.objectContaining({
        checkId: 'rawPayloadBlockMessage',
        blockedRuleId: 'rawPayload',
        status: 'pass',
        hasMatchingRule: true,
        messageMatchesRule: true,
        hasStatePreservation: true
      })
    ]);
  });

  it('marks import-block expectations incomplete when rule messages drift', () => {
    const coverage = futureImportBlockExpectationCoverageRows({
      ...futurePlanFormatDraft,
      importAcceptanceRules: futurePlanFormatDraft.importAcceptanceRules.map((rule) =>
        rule.id === 'oldPreview' ? { ...rule, message: 'Different message.' } : rule
      )
    });

    expect(coverage.find((row) => row.checkId === 'oldPreviewBlockMessage')).toMatchObject({
      status: 'fail',
      hasMatchingRule: true,
      messageMatchesRule: false,
      hasStatePreservation: true,
      hasAvoidanceRequirements: true
    });
    expect(coverage.find((row) => row.checkId === 'futureUnknownBlockMessage')?.status).toBe('pass');
  });

  it('marks import-block expectations incomplete without state-preservation requirements', () => {
    const coverage = futureImportBlockExpectationCoverageRows({
      ...futurePlanFormatDraft,
      importBlockExpectationChecks: futurePlanFormatDraft.importBlockExpectationChecks.map((check) =>
        check.id === 'rawPayloadBlockMessage' ? { ...check, mustPreserve: ['wrapped-file requirement'] } : check
      )
    });

    expect(coverage.find((row) => row.checkId === 'rawPayloadBlockMessage')).toMatchObject({
      status: 'fail',
      hasMatchingRule: true,
      messageMatchesRule: true,
      hasStatePreservation: false,
      hasAvoidanceRequirements: true
    });
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

  it('keeps gap options neutral and review-oriented', () => {
    expect(futureCapacityGapOptionIds()).toEqual(['reduceSpending', 'workLonger', 'downsize', 'saveMore']);
    expect(futurePlanFormatDraft.capacitySelectorReadiness.gapOptions.every((option) => option.mustStay === 'option-to-compare')).toBe(true);
    expect(futurePlanFormatDraft.capacitySelectorReadiness.gapOptions.find((option) => option.id === 'reduceSpending')?.mustNotBecome).toContain(
      'automatic recommendation to cut spending'
    );
    expect(futurePlanFormatDraft.capacitySelectorReadiness.gapOptions.find((option) => option.id === 'workLonger')?.mustNotBecome).toContain(
      'instruction to delay retirement'
    );
    expect(futurePlanFormatDraft.capacitySelectorReadiness.gapOptions.find((option) => option.id === 'downsize')?.mustNotBecome).toContain(
      'instruction to sell a home'
    );
    expect(futurePlanFormatDraft.capacitySelectorReadiness.gapOptions.find((option) => option.id === 'saveMore')?.mustNotBecome).toContain(
      'savings command'
    );
  });

  it('previews covered capacity status without writing saved output', () => {
    expect(
      selectFutureCapacityStatusPreview({
        minimumMonthlyExpensesExMortgage: 3600,
        mortgageMonthlyPayment: 0,
        projectedMonthlyAfterTaxCapacity: 4800
      })
    ).toMatchObject({
      statusId: 'covered',
      monthlyFloor: 3600,
      monthlyCapacity: 4800,
      monthlyRoom: 1200,
      gapOptionIds: [],
      missingInputs: [],
      mode: 'planning-only'
    });
  });

  it('previews tight capacity status when room is narrow or assumptions are sensitive', () => {
    expect(
      selectFutureCapacityStatusPreview({
        minimumMonthlyExpensesExMortgage: 3600,
        mortgageMonthlyPayment: 400,
        projectedMonthlyAfterTaxCapacity: 4350
      })
    ).toMatchObject({
      statusId: 'tight',
      monthlyFloor: 4000,
      monthlyRoom: 350,
      gapOptionIds: []
    });
    expect(
      selectFutureCapacityStatusPreview({
        minimumMonthlyExpensesExMortgage: 3600,
        mortgageMonthlyPayment: 0,
        projectedMonthlyAfterTaxCapacity: 5000,
        sensitivityFlags: ['survivor']
      }).statusId
    ).toBe('tight');
  });

  it('previews gap status with practical options and no pushy recommendation', () => {
    const result = selectFutureCapacityStatusPreview({
      minimumMonthlyExpensesExMortgage: 6200,
      mortgageMonthlyPayment: 1800,
      projectedMonthlyAfterTaxCapacity: 7200
    });

    expect(result).toMatchObject({
      statusId: 'gap',
      monthlyFloor: 8000,
      monthlyCapacity: 7200,
      monthlyRoom: -800,
      gapOptionIds: ['reduceSpending', 'workLonger', 'downsize', 'saveMore'],
      missingInputs: [],
      mode: 'planning-only'
    });
    expect(result.reviewPrompt).toContain('Compare practical options');
  });

  it('previews cannot-tell status when core selector inputs are missing', () => {
    expect(
      selectFutureCapacityStatusPreview({
        minimumMonthlyExpensesExMortgage: null,
        mortgageMonthlyPayment: 0,
        projectedMonthlyAfterTaxCapacity: 4500
      })
    ).toMatchObject({
      statusId: 'cannotTell',
      monthlyFloor: null,
      monthlyCapacity: 4500,
      monthlyRoom: null,
      gapOptionIds: [],
      missingInputs: ['minimumMonthlyExpensesExMortgage'],
      mode: 'planning-only'
    });
  });

  it('keeps capacity selector boundaries runtime-only and non-instructional', () => {
    expect(futureCapacitySelectorBoundaryRows()).toEqual([
      expect.objectContaining({ id: 'runtimeOnly', status: 'pass' }),
      expect.objectContaining({ id: 'noSavedOutput', status: 'pass' }),
      expect.objectContaining({ id: 'gapOptionsNeutral', status: 'pass' }),
      expect.objectContaining({ id: 'noAccountInstructions', status: 'pass' })
    ]);
  });

  it('marks capacity selector boundaries incomplete if outputs or options drift', () => {
    const rows = futureCapacitySelectorBoundaryRows({
      ...futurePlanFormatDraft,
      capacitySelectorReadiness: {
        ...futurePlanFormatDraft.capacitySelectorReadiness,
        outputs: futurePlanFormatDraft.capacitySelectorReadiness.outputs.map((output) =>
          output.id === 'confidentMonthlyAfterTaxSpend' ? { ...output, mustAvoid: ['guaranteed safe-spend language'] } : output
        ),
        gapOptions: futurePlanFormatDraft.capacitySelectorReadiness.gapOptions.map((option) =>
          option.id === 'reduceSpending' ? { ...option, mustStay: 'option-to-compare', mustNotBecome: [] } : option
        )
      }
    });

    expect(rows.find((row) => row.id === 'noSavedOutput')?.status).toBe('fail');
    expect(rows.find((row) => row.id === 'gapOptionsNeutral')?.status).toBe('fail');
  });

  it('keeps capacity selector planning scenarios aligned to expected statuses', () => {
    expect(futureCapacitySelectorScenarioIds()).toEqual(['coveredFloor', 'tightFloor', 'gapReview', 'missingFloor']);
    expect(validateFutureCapacitySelectorScenarios()).toEqual([
      { id: 'coveredFloor', status: 'pass', expectedStatusId: 'covered', actualStatusId: 'covered' },
      { id: 'tightFloor', status: 'pass', expectedStatusId: 'tight', actualStatusId: 'tight' },
      { id: 'gapReview', status: 'pass', expectedStatusId: 'gap', actualStatusId: 'gap' },
      { id: 'missingFloor', status: 'pass', expectedStatusId: 'cannotTell', actualStatusId: 'cannotTell' }
    ]);
  });

  it('marks capacity selector scenario validation incomplete when expected status drifts', () => {
    expect(
      validateFutureCapacitySelectorScenarios([
        {
          id: 'driftedGap',
          label: 'Drifted gap expectation',
          input: {
            minimumMonthlyExpensesExMortgage: 6200,
            mortgageMonthlyPayment: 1800,
            projectedMonthlyAfterTaxCapacity: 7200
          },
          expectedStatusId: 'covered',
          mustAvoid: ['automatic recommendation to cut spending']
        }
      ])
    ).toEqual([{ id: 'driftedGap', status: 'fail', expectedStatusId: 'covered', actualStatusId: 'gap' }]);
  });

  it('drafts future example values without changing current examples', () => {
    expect(futureExampleDataDraftIds()).toEqual(['singleMinimumFloor', 'coupleTightFloor', 'pensionCoupleSurvivor', 'estateHeavyRoom']);
    const single = futurePlanFormatDraft.futureExampleDataDrafts.find((example) => example.id === 'singleMinimumFloor');

    expect(single).toEqual(
      expect.objectContaining({
        status: 'planning-only',
        minimumMonthlyExpensesExMortgage: 3600,
        mortgageMonthlyPayment: 0,
        projectedMonthlyAfterTaxCapacity: 4800,
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
        projectedMonthlyAfterTaxCapacity: 7200,
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
        projectedMonthlyAfterTaxCapacity: 5750,
        expectedCapacityStatus: 'tight'
      })
    );
    expect(survivor?.reviewFocus).toContain('survivor resilience is visible');
    expect(survivor?.mustAvoid).toContain('hiding survivor impact behind one number');
    expect(survivor?.mustAvoid).toContain('account withdrawal instructions');
  });

  it('drafts the estate-heavy example without permission-to-spend language', () => {
    const estate = futurePlanFormatDraft.futureExampleDataDrafts.find((example) => example.id === 'estateHeavyRoom');

    expect(estate).toEqual(
      expect.objectContaining({
        status: 'planning-only',
        minimumMonthlyExpensesExMortgage: 7000,
        mortgageMonthlyPayment: 0,
        projectedMonthlyAfterTaxCapacity: 8600,
        expectedCapacityStatus: 'covered'
      })
    );
    expect(estate?.reviewFocus).toContain('estate trade-off is visible');
    expect(estate?.mustAvoid).toContain('permission to spend more');
    expect(estate?.mustAvoid).toContain('guaranteed-room language');
    expect(estate?.mustAvoid).toContain('account withdrawal instructions');
  });

  it('keeps future example data planning-only and out of saved-answer territory', () => {
    expect(futureExampleDataBoundaryRows()).toEqual([
      expect.objectContaining({ id: 'singleMinimumFloor', status: 'pass' }),
      expect.objectContaining({ id: 'coupleTightFloor', status: 'pass' }),
      expect.objectContaining({ id: 'pensionCoupleSurvivor', status: 'pass' }),
      expect.objectContaining({ id: 'estateHeavyRoom', status: 'pass' })
    ]);
  });

  it('marks future example data boundaries incomplete when examples drift', () => {
    expect(
      futureExampleDataBoundaryRows({
        ...futurePlanFormatDraft,
        futureExampleDataDrafts: futurePlanFormatDraft.futureExampleDataDrafts.map((example) =>
          example.id === 'estateHeavyRoom'
            ? { ...example, status: 'planning-only', household: 'Tester export copied from a file', mustAvoid: ['estate recommendation'] }
            : example
        )
      }).find((row) => row.id === 'estateHeavyRoom')
    ).toEqual({
      id: 'estateHeavyRoom',
      status: 'fail',
      isPlanningOnly: true,
      hasSyntheticHousehold: false,
      avoidsSavedAnswers: false,
      avoidsAccountInstructions: false
    });
  });

  it('keeps future example capacity statuses aligned with selector planning', () => {
    expect(validateFutureExampleCapacityStatusDrafts()).toEqual([
      { id: 'singleMinimumFloor', status: 'pass', expectedStatusId: 'covered', actualStatusId: 'covered' },
      { id: 'coupleTightFloor', status: 'pass', expectedStatusId: 'gap', actualStatusId: 'gap' },
      { id: 'pensionCoupleSurvivor', status: 'pass', expectedStatusId: 'tight', actualStatusId: 'tight' },
      { id: 'estateHeavyRoom', status: 'pass', expectedStatusId: 'covered', actualStatusId: 'covered' }
    ]);
  });

  it('marks future example capacity status drafts incomplete when values drift', () => {
    expect(
      validateFutureExampleCapacityStatusDrafts({
        ...futurePlanFormatDraft,
        futureExampleDataDrafts: futurePlanFormatDraft.futureExampleDataDrafts.map((example) =>
          example.id === 'coupleTightFloor' ? { ...example, projectedMonthlyAfterTaxCapacity: 9000 } : example
        )
      }).find((result) => result.id === 'coupleTightFloor')
    ).toEqual({ id: 'coupleTightFloor', status: 'fail', expectedStatusId: 'gap', actualStatusId: 'covered' });
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

  it('keeps future example rebuild steps aligned with planning drafts', () => {
    const rows = futureExampleRebuildAlignmentRows();

    expect(rows.map((row) => row.id)).toEqual([
      'singleMinimumFloorDraftValues',
      'coupleTightFloorDraftValues',
      'pensionCoupleSurvivorDraftValues',
      'estateHeavyRoomDraftValues',
      'acceptedFixtureLater',
      'newFormatSmokeLater'
    ]);
    expect(rows.every((row) => row.status === 'pass')).toBe(true);
  });

  it('marks future example rebuild alignment incomplete when a step loses proofs', () => {
    expect(
      futureExampleRebuildAlignmentRows({
        ...futurePlanFormatDraft,
        freshExampleRebuildPlan: futurePlanFormatDraft.freshExampleRebuildPlan.map((step) =>
          step.id === 'singleMinimumFloorDraftValues' ? { ...step, mustProve: [] } : step
        )
      }).find((row) => row.id === 'singleMinimumFloorDraftValues')
    ).toMatchObject({
      status: 'fail',
      hasExampleDraft: true,
      isPlanningStage: true,
      hasProofs: false,
      hasAvoidance: true
    });
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

  it('plans first-year trace rows across known account groups', () => {
    expect(futureFundingTraceFirstYearRowIds()).toEqual([
      'incomeSources',
      'registeredWithdrawals',
      'tfsaWithdrawals',
      'nonRegisteredWithdrawals',
      'cashReserveDraw',
      'otherInflows',
      'estimatedTax',
      'minimumFloorGap'
    ]);
    expect(futurePlanFormatDraft.fundingTraceReadiness.firstYearTraceRows.find((row) => row.id === 'registeredWithdrawals')).toMatchObject({
      groupId: 'registered',
      role: 'source'
    });
    expect(futurePlanFormatDraft.fundingTraceReadiness.firstYearTraceRows.find((row) => row.id === 'estimatedTax')).toMatchObject({
      groupId: 'tax',
      role: 'tax'
    });
    expect(futurePlanFormatDraft.fundingTraceReadiness.firstYearTraceRows.find((row) => row.id === 'minimumFloorGap')?.mustAvoid).toContain(
      'failure language'
    );
  });

  it('plans funding trace samples for each future example draft', () => {
    expect(futureFundingTraceExampleSampleIds()).toEqual([
      'singleMinimumFloor',
      'coupleTightFloor',
      'pensionCoupleSurvivor',
      'estateHeavyRoom'
    ]);
    expect(futureFundingTraceSampleCoverageRows()).toEqual([
      expect.objectContaining({ id: 'singleMinimumFloor', status: 'pass' }),
      expect.objectContaining({ id: 'coupleTightFloor', status: 'pass' }),
      expect.objectContaining({ id: 'pensionCoupleSurvivor', status: 'pass' }),
      expect.objectContaining({ id: 'estateHeavyRoom', status: 'pass' })
    ]);
  });

  it('marks funding trace sample coverage incomplete when tax or row links drift', () => {
    expect(
      futureFundingTraceSampleCoverageRows({
        ...futurePlanFormatDraft,
        fundingTraceReadiness: {
          ...futurePlanFormatDraft.fundingTraceReadiness,
          exampleTraceSamples: futurePlanFormatDraft.fundingTraceReadiness.exampleTraceSamples.map((sample) =>
            sample.id === 'singleMinimumFloor' ? { ...sample, rowIds: ['missingRow'], mustShow: ['income sources'] } : sample
          )
        }
      }).find((row) => row.id === 'singleMinimumFloor')
    ).toMatchObject({
      status: 'fail',
      hasExampleDraft: true,
      statusMatchesExample: true,
      hasKnownRows: false,
      keepsTaxVisible: false
    });
  });

  it('keeps funding trace boundaries runtime-only, tax-visible, and non-instructional', () => {
    expect(futureFundingTraceBoundaryRows()).toEqual([
      expect.objectContaining({ id: 'runtimeOnly', status: 'pass' }),
      expect.objectContaining({ id: 'noAnnualSequencing', status: 'pass' }),
      expect.objectContaining({ id: 'noSavedTrace', status: 'pass' }),
      expect.objectContaining({ id: 'reviewLanguage', status: 'pass' }),
      expect.objectContaining({ id: 'taxVisible', status: 'pass' })
    ]);
  });

  it('marks funding trace boundaries incomplete if saved trace or tax visibility drifts', () => {
    const rows = futureFundingTraceBoundaryRows({
      ...futurePlanFormatDraft,
      fundingTraceReadiness: {
        ...futurePlanFormatDraft.fundingTraceReadiness,
        firstYearTraceRows: futurePlanFormatDraft.fundingTraceReadiness.firstYearTraceRows.filter((row) => row.id !== 'estimatedTax'),
        instructionGuardrails: futurePlanFormatDraft.fundingTraceReadiness.instructionGuardrails.map((guardrail) =>
          guardrail.id === 'noSavedTrace' ? { ...guardrail, mustAvoid: ['persisted account trace'] } : guardrail
        )
      }
    });

    expect(rows.find((row) => row.id === 'noSavedTrace')?.status).toBe('fail');
    expect(rows.find((row) => row.id === 'taxVisible')?.status).toBe('fail');
  });

  it('keeps survivor, estate, and gap caveats aligned with future examples', () => {
    expect(futureFundingTraceCaveatCoverageRows()).toEqual([
      expect.objectContaining({ id: 'singleMinimumFloor', status: 'pass', needsSurvivorCaveat: false, needsEstateCaveat: false, needsGapCaveat: false }),
      expect.objectContaining({ id: 'coupleTightFloor', status: 'pass', needsGapCaveat: true, hasGapCaveat: true }),
      expect.objectContaining({ id: 'pensionCoupleSurvivor', status: 'pass', needsSurvivorCaveat: true, hasSurvivorCaveat: true }),
      expect.objectContaining({ id: 'estateHeavyRoom', status: 'pass', needsEstateCaveat: true, hasEstateCaveat: true })
    ]);
  });

  it('marks caveat coverage incomplete when a needed funding trace caveat is missing', () => {
    expect(
      futureFundingTraceCaveatCoverageRows({
        ...futurePlanFormatDraft,
        fundingTraceReadiness: {
          ...futurePlanFormatDraft.fundingTraceReadiness,
          survivorEstateCaveats: futurePlanFormatDraft.fundingTraceReadiness.survivorEstateCaveats.filter(
            (caveat) => caveat.id !== 'estateIntentTradeoff'
          )
        }
      }).find((row) => row.id === 'estateHeavyRoom')
    ).toMatchObject({
      status: 'fail',
      needsEstateCaveat: true,
      hasEstateCaveat: false
    });
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

  it('keeps funding trace closeout blocked from saved schema and runtime implementation changes', () => {
    expect(futureFundingTraceCloseoutRows()).toEqual([
      { id: 'planningOnly', status: 'pass', detail: 'Funding trace readiness remains a planning artifact.' },
      { id: 'runtimeOnly', status: 'pass', detail: 'Funding trace remains a future runtime concept, not saved input.' },
      { id: 'schemaUnchanged', status: 'pass', detail: 'Saved plan and engine output schemas remain unchanged.' },
      { id: 'examplesDraftOnly', status: 'pass', detail: 'Future examples are drafted for later rebuild, not replacing current examples.' },
      { id: 'decisionGateRequired', status: 'pass', detail: 'Runtime trace work remains blocked behind explicit decision gates.' }
    ]);
  });

  it('marks funding trace closeout incomplete if the runtime-only guardrail is removed', () => {
    expect(
      futureFundingTraceCloseoutRows({
        ...futurePlanFormatDraft,
        fundingTraceReadiness: {
          ...futurePlanFormatDraft.fundingTraceReadiness,
          guardrails: futurePlanFormatDraft.fundingTraceReadiness.guardrails.filter(
            (guardrail) => guardrail !== 'Funding trace must stay runtime-only in this planning package.'
          )
        }
      }).find((row) => row.id === 'runtimeOnly')
    ).toMatchObject({ status: 'fail' });
  });
});
