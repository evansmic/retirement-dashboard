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
  futureMinimumFloorFixtureSample,
  futureOldPreviewFixtureSample,
  futureOptimizerReadinessIds,
  futureOptimizerContractItemIds,
  futureRollbackReleaseStopItems,
  futureSchemaResetDecisionReadinessIds,
  futureTestOnlyFixtureSamples,
  futureTestOnlyFixtureShapeIds,
  futureUnsupportedFormatFixtureSample,
  futurePlanFormatDraft,
  findFutureTestOnlyFixtureShape,
  futureFixtureExpectationCoverageRows,
  futureImportBlockExpectationCoverageRows,
  validateFutureFixtureSamples,
  validateFutureFixtureShapeBatch,
  validateFutureFixtureShape
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
      }
    });

    expect(summary).toMatchObject({
      status: 'pass',
      total: 3,
      passed: 3,
      failed: 0,
      mode: 'test-only'
    });
    expect(summary.results.map((result) => result.fixtureId)).toEqual([
      'futureMinimumFloorPlan',
      'legacyPreviewDesiredSpendPayload',
      'unsupportedFuturePlanFile'
    ]);
  });

  it('validates the complete in-memory sample registry against planned fixture shapes', () => {
    const summary = validateFutureFixtureSamples();

    expect(futureTestOnlyFixtureSamples.map((sample) => sample.id)).toEqual([
      'singleCoveredMinimumFloorInMemory',
      'legacyDesiredSpendInMemory',
      'unsupportedFutureFieldInMemory'
    ]);
    expect(futureTestOnlyFixtureSamples.every((sample) => sample.mode === 'test-only')).toBe(true);
    expect(summary).toMatchObject({
      status: 'pass',
      total: 3,
      passed: 3,
      failed: 0,
      mode: 'test-only'
    });
    expect(summary.results.map((result) => [result.fixtureId, result.expectedImportResult])).toEqual([
      ['futureMinimumFloorPlan', 'accept'],
      ['legacyPreviewDesiredSpendPayload', 'block'],
      ['unsupportedFuturePlanFile', 'block']
    ]);
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
      total: 3,
      passed: 1,
      failed: 2,
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
      fixtureId: 'legacyPreviewDesiredSpendPayload',
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
