export type FuturePlanFormatField = {
  id: string;
  label: string;
  status: 'new-format-field' | 'derived-runtime' | 'deferred-output';
  reason: string;
};

export type FuturePlanFormatSection = {
  id: string;
  label: string;
  fields: FuturePlanFormatField[];
};

export type FuturePlanFormatDraft = {
  status: 'planning-only';
  schemaReset: 'clean-reset';
  oldPreviewImportBehavior: 'block';
  oldPreviewImportMessage: string;
  implementationChecklist: FutureImplementationStep[];
  rollbackReleaseChecklist: FutureRollbackReleaseItem[];
  schemaResetDecisionReadiness: FutureSchemaResetDecisionReadiness[];
  testOnlyFixtureShapes: FutureTestOnlyFixtureShape[];
  fixtureExpectationHardening: FutureFixtureExpectationHardening[];
  importBlockExpectationChecks: FutureImportBlockExpectationCheck[];
  optimizerContractReadiness: FutureOptimizerContractItem[];
  fixtureSpecifications: FutureFixtureSpecification[];
  accountOptimizerReadiness: FutureAccountOptimizerReadinessItem[];
  importAcceptanceRules: FutureImportAcceptanceRule[];
  rawPayloadPolicy: FutureRawPayloadPolicy;
  fixtureValidationHelpers: FutureFixtureValidationHelper[];
  capacityStatusReadiness: FutureCapacityStatusReadiness[];
  capacitySelectorReadiness: FutureCapacitySelectorReadiness;
  futureExampleDataDrafts: FutureExampleDataDraft[];
  freshExampleRebuildPlan: FutureFreshExampleRebuildPlan[];
  fundingTraceReadiness: FutureFundingTraceReadiness;
  sections: FuturePlanFormatSection[];
  freshExampleRequirements: FutureExampleRequirement[];
  boundaries: string[];
};

export type FutureImplementationStep = {
  id: string;
  phase: 'prepare' | 'fixture' | 'wire' | 'verify' | 'release';
  label: string;
  requiredBeforeNext: string[];
  rollback: string;
};

export type FutureRollbackReleaseItem = {
  id: string;
  stage: 'before-release' | 'during-release' | 'after-release';
  label: string;
  requiredEvidence: string[];
  stopIfMissing: boolean;
};

export type FutureSchemaResetDecisionReadiness = {
  id: string;
  decision: 'ready-to-wire' | 'keep-planning' | 'defer';
  label: string;
  requiredEvidence: string[];
  mustAvoid: string[];
  stopIfMissing: boolean;
};

export type FutureTestOnlyFixtureShape = {
  id: string;
  intent: 'accepted-new-format' | 'blocked-old-preview' | 'blocked-future-format' | 'blocked-raw-payload';
  wrapper: 'future-plan-file' | 'legacy-preview-payload' | 'unsupported-future-file' | 'raw-unwrapped-payload';
  requiredKeys: string[];
  forbiddenKeys: string[];
  expectedImportResult: 'accept' | 'block';
};

export type FutureFixtureExpectationHardening = {
  id: string;
  fixtureId: FutureTestOnlyFixtureShape['id'];
  expectation: string;
  mustProve: string[];
  mustAvoid: string[];
};

export type FutureImportBlockExpectationCheck = {
  id: string;
  blockedRuleId: 'oldPreview' | 'futureUnknown' | 'rawPayload';
  expectedMessage: string;
  mustPreserve: string[];
  mustAvoid: string[];
};

export type FutureOptimizerContractItem = {
  id: string;
  contractPart: 'input' | 'runtime-output' | 'review-boundary';
  label: string;
  mustInclude: string[];
  mustExclude: string[];
};

export type FutureFixtureSpecification = {
  id: string;
  kind: 'accepted-new-format' | 'blocked-old-preview' | 'blocked-future-format';
  purpose: string;
  expectedOutcome: string;
  mustProve: string[];
};

export type FutureAccountOptimizerReadinessItem = {
  id: string;
  label: string;
  status: 'needed-before-optimizer' | 'deferred-until-sequencing';
  reason: string;
};

export type FutureImportAcceptanceRule = {
  id: string;
  decision: 'accept' | 'block' | 'defer';
  appliesTo: string;
  message?: string;
  reason: string;
};

export type FutureRawPayloadPolicy = {
  decision: 'block-raw-payloads-after-reset';
  message: string;
  rationale: string[];
  allowed: string[];
  blocked: string[];
};

export type FutureFixtureValidationHelper = {
  id: string;
  validates: string;
  mode: 'test-only';
  checks: string[];
  mustNotDo: string[];
};

export type FutureFixtureValidationResult = {
  fixtureId: string;
  expectedImportResult: FutureTestOnlyFixtureShape['expectedImportResult'];
  status: 'pass' | 'fail';
  missingRequiredKeys: string[];
  presentForbiddenKeys: string[];
  importResultMatches: boolean;
  mode: 'test-only';
};

export type FutureFixtureValidationSummary = {
  status: 'pass' | 'fail';
  total: number;
  passed: number;
  failed: number;
  results: FutureFixtureValidationResult[];
  mode: 'test-only';
};

export type FutureTestOnlyFixtureSample = {
  id: string;
  fixtureId: FutureTestOnlyFixtureShape['id'];
  label: string;
  fixture: Record<string, unknown>;
  plannedImportResult: FutureTestOnlyFixtureShape['expectedImportResult'];
  mode: 'test-only';
  mustNotDo: string[];
};

export type FutureFixtureExpectationCoverageRow = {
  expectationId: string;
  fixtureId: FutureFixtureExpectationHardening['fixtureId'];
  status: 'pass' | 'fail';
  hasKnownFixtureShape: boolean;
  hasProofRequirements: boolean;
  hasAvoidanceRequirements: boolean;
};

export type FutureImportBlockExpectationCoverageRow = {
  checkId: string;
  blockedRuleId: FutureImportBlockExpectationCheck['blockedRuleId'];
  status: 'pass' | 'fail';
  hasMatchingRule: boolean;
  messageMatchesRule: boolean;
  hasStatePreservation: boolean;
  hasAvoidanceRequirements: boolean;
};

export type FutureFixtureSampleCoverageRow = {
  sampleId: string;
  fixtureId: FutureTestOnlyFixtureShape['id'];
  status: 'pass' | 'fail';
  hasKnownShape: boolean;
  importResultMatchesShape: boolean;
  isTestOnly: boolean;
  hasGuardrails: boolean;
};

export type FutureRawPayloadSampleBlockExpectation = {
  sampleId: string;
  status: 'pass' | 'fail';
  expectedMessage: string;
  messageMatchesRule: boolean;
  messageMatchesPolicy: boolean;
  preservesCurrentState: boolean;
  rejectsRawPlanFileTreatment: boolean;
};

export type FutureCapacityStatusReadiness = {
  id: string;
  label: string;
  meaning: string;
  showWhen: string[];
  mustAvoid: string[];
};

export type FutureCapacityStatusId = FutureCapacityStatusReadiness['id'];

export type FutureCapacitySelectorReadiness = {
  status: 'planning-only';
  inputs: FutureCapacitySelectorInput[];
  outputs: FutureCapacitySelectorOutput[];
  statusMappings: FutureCapacityStatusMapping[];
  reviewFactors: FutureCapacityReviewFactor[];
  gapOptions: FutureCapacityGapOption[];
  guardrails: string[];
};

export type FutureCapacitySelectorInput = {
  id: string;
  source: 'saved-field' | 'runtime-derived' | 'engine-result';
  label: string;
  requiredFor: string[];
};

export type FutureCapacitySelectorOutput = {
  id: string;
  status: 'derived-runtime';
  label: string;
  mustAvoid: string[];
};

export type FutureCapacityStatusMapping = {
  statusId: FutureCapacityStatusId;
  conditions: string[];
  reviewPrompt: string;
};

export type FutureCapacityReviewFactor = {
  id: string;
  label: string;
  reason: string;
  mustStay: 'review-factor';
  mustNotBecome: string[];
};

export type FutureCapacityGapOption = {
  id: 'reduceSpending' | 'workLonger' | 'downsize' | 'saveMore';
  label: string;
  reviewPrompt: string;
  mustStay: 'option-to-compare';
  mustNotBecome: string[];
};

export type FutureCapacitySelectorPreviewInput = {
  minimumMonthlyExpensesExMortgage?: number | null;
  mortgageMonthlyPayment?: number | null;
  projectedMonthlyAfterTaxCapacity?: number | null;
  firstShortfallYear?: number | null;
  roomAboveFloorTightThreshold?: number;
  sensitivityFlags?: string[];
};

export type FutureCapacitySelectorPreviewResult = {
  statusId: FutureCapacityStatusId;
  monthlyFloor: number | null;
  monthlyCapacity: number | null;
  monthlyRoom: number | null;
  reviewPrompt: string;
  gapOptionIds: FutureCapacityGapOption['id'][];
  missingInputs: string[];
  mode: 'planning-only';
};

export type FutureCapacitySelectorScenario = {
  id: string;
  label: string;
  input: FutureCapacitySelectorPreviewInput;
  expectedStatusId: FutureCapacityStatusId;
  mustAvoid: string[];
};

export type FutureExampleDataBoundaryRow = {
  id: FutureExampleDataDraft['id'];
  status: 'pass' | 'fail';
  isPlanningOnly: boolean;
  hasSyntheticHousehold: boolean;
  avoidsSavedAnswers: boolean;
  avoidsAccountInstructions: boolean;
};

export type FutureExampleRebuildAlignmentRow = {
  id: FutureFreshExampleRebuildPlan['id'];
  exampleId: FutureExampleDataDraft['id'];
  status: 'pass' | 'fail';
  hasExampleDraft: boolean;
  isPlanningStage: boolean;
  hasProofs: boolean;
  hasAvoidance: boolean;
};

export type FutureCapacitySelectorBoundaryRow = {
  id: 'runtimeOnly' | 'noSavedOutput' | 'gapOptionsNeutral' | 'noAccountInstructions';
  status: 'pass' | 'fail';
  detail: string;
};

export type FutureExampleRequirement = {
  id: string;
  label: string;
  purpose: string;
  mustInclude: string[];
  mustAvoid: string[];
};

export type FutureExampleDataDraft = {
  id: 'singleMinimumFloor' | 'coupleTightFloor' | 'pensionCoupleSurvivor' | 'estateHeavyRoom';
  label: string;
  status: 'planning-only';
  household: string;
  minimumMonthlyExpensesExMortgage: number;
  mortgageMonthlyPayment: number;
  projectedMonthlyAfterTaxCapacity: number;
  earlySpendingChangeAge: number;
  laterSpendingChangeAge: number;
  expectedCapacityStatus: 'covered' | 'tight' | 'gap' | 'cannotTell';
  reviewFocus: string[];
  mustAvoid: string[];
};

export type FutureFreshExampleRebuildPlan = {
  id: string;
  exampleId: FutureExampleDataDraft['id'];
  stage: 'draft-values' | 'fixture-later' | 'smoke-later';
  label: string;
  mustProve: string[];
  mustAvoid: string[];
};

export type FutureFundingTraceReadiness = {
  status: 'planning-only';
  accountGroups: FutureFundingTraceAccountGroup[];
  firstYearTraceRows: FutureFundingTraceFirstYearRow[];
  exampleTraceSamples: FutureFundingTraceExampleSample[];
  taxCaveats: FutureFundingTraceTaxCaveat[];
  reconciliationRules: FutureFundingTraceReconciliationRule[];
  copyBoundaries: FutureFundingTraceCopyBoundary[];
  survivorEstateCaveats: FutureFundingTraceSurvivorEstateCaveat[];
  cashAndOneOffHandling: FutureFundingTraceCashAndOneOffHandling[];
  instructionGuardrails: FutureFundingTraceInstructionGuardrail[];
  decisionGate: FutureFundingTraceDecisionGate[];
  guardrails: string[];
};

export type FutureFundingTraceAccountGroup = {
  id: string;
  label: string;
  includes: string[];
  mustAvoid: string[];
};

export type FutureFundingTraceAccountGroupId = FutureFundingTraceAccountGroup['id'];

export type FutureFundingTraceFirstYearRow = {
  id: string;
  groupId: string;
  label: string;
  role: 'source' | 'tax' | 'gap';
  mustAvoid: string[];
};

export type FutureFundingTraceExampleSample = {
  id: FutureExampleDataDraft['id'];
  expectedStatusId: FutureCapacityStatusId;
  rowIds: string[];
  mustShow: string[];
  mustAvoid: string[];
};

export type FutureFundingTraceSampleCoverageRow = {
  id: FutureExampleDataDraft['id'];
  status: 'pass' | 'fail';
  hasExampleDraft: boolean;
  statusMatchesExample: boolean;
  hasKnownRows: boolean;
  keepsTaxVisible: boolean;
  avoidsInstructions: boolean;
};

export type FutureFundingTraceBoundaryRow = {
  id: 'runtimeOnly' | 'noAnnualSequencing' | 'noSavedTrace' | 'reviewLanguage' | 'taxVisible';
  status: 'pass' | 'fail';
  detail: string;
};

export type FutureFundingTraceCaveatCoverageRow = {
  id: FutureExampleDataDraft['id'];
  status: 'pass' | 'fail';
  needsSurvivorCaveat: boolean;
  hasSurvivorCaveat: boolean;
  needsEstateCaveat: boolean;
  hasEstateCaveat: boolean;
  needsGapCaveat: boolean;
  hasGapCaveat: boolean;
};

export type FutureFundingTraceCloseoutRow = {
  id: 'planningOnly' | 'runtimeOnly' | 'schemaUnchanged' | 'examplesDraftOnly' | 'decisionGateRequired';
  status: 'pass' | 'fail';
  detail: string;
};

export type FutureFundingTraceTaxCaveat = {
  id: string;
  label: string;
  reason: string;
  mustAvoid: string[];
};

export type FutureFundingTraceReconciliationRule = {
  id: string;
  rule: string;
  mustAvoid: string[];
};

export type FutureFundingTraceCopyBoundary = {
  id: string;
  phrase: string;
  mustAvoid: string[];
};

export type FutureFundingTraceSurvivorEstateCaveat = {
  id: string;
  label: string;
  reason: string;
  mustAvoid: string[];
};

export type FutureFundingTraceCashAndOneOffHandling = {
  id: string;
  label: string;
  handling: string;
  mustAvoid: string[];
};

export type FutureFundingTraceInstructionGuardrail = {
  id: string;
  rule: string;
  mustAvoid: string[];
};

export type FutureFundingTraceDecisionGate = {
  id: string;
  decision: 'ready-to-prototype' | 'keep-planning' | 'defer';
  requiredEvidence: string[];
  stopIfMissing: boolean;
};

export const futurePlanFormatDraft: FuturePlanFormatDraft = {
  status: 'planning-only',
  schemaReset: 'clean-reset',
  oldPreviewImportBehavior: 'block',
  oldPreviewImportMessage: 'This plan was created with an earlier preview format. Please start a new plan.',
  implementationChecklist: [
    {
      id: 'fieldReview',
      phase: 'prepare',
      label: 'Review and freeze the future field list',
      requiredBeforeNext: ['Minimum expense field name approved', 'Spending-path breakpoint names approved', 'Derived answers stay out of saved inputs'],
      rollback: 'Keep schema v2 active and leave the future draft unused.'
    },
    {
      id: 'fixturePlan',
      phase: 'fixture',
      label: 'Create new-format fixture files and blocked old-preview fixtures',
      requiredBeforeNext: ['Accepted new-format fixture defined', 'Old preview fixture defined', 'Unsupported future fixture defined'],
      rollback: 'Delete fixture-only files before wiring import behavior.'
    },
    {
      id: 'loaderWire',
      phase: 'wire',
      label: 'Wire new-format import acceptance and old-preview blocking',
      requiredBeforeNext: ['Current v2 compatibility decision confirmed', 'Block copy verified', 'Raw payload policy decided'],
      rollback: 'Restore the current v2 loader and keep reset fixtures for planning.'
    },
    {
      id: 'exampleRebuild',
      phase: 'wire',
      label: 'Rebuild examples directly in the new format',
      requiredBeforeNext: ['Single floor example rebuilt', 'Tight couple example rebuilt', 'Pension survivor example rebuilt', 'Estate-room example rebuilt'],
      rollback: 'Revert to existing examples until reset wiring is stable.'
    },
    {
      id: 'verificationGate',
      phase: 'verify',
      label: 'Run full verification and import-block checks',
      requiredBeforeNext: ['Full tests pass', 'Full probes pass or known route bind is isolated', 'No .plan.json files created'],
      rollback: 'Do not release the reset; keep current v2 behavior.'
    },
    {
      id: 'previewRelease',
      phase: 'release',
      label: 'Release the reset only after tester fresh-start instructions are ready',
      requiredBeforeNext: ['Tester instructions updated', 'Old-file block copy visible', 'Rollback build identified'],
      rollback: 'Deploy the prior v2-compatible build.'
    }
  ],
  rollbackReleaseChecklist: [
    {
      id: 'rollbackBuild',
      stage: 'before-release',
      label: 'Identify the prior v2-compatible build',
      requiredEvidence: ['Known commit or deployment before reset wiring', 'Verification record for prior build', 'Clear instruction for returning to prior build'],
      stopIfMissing: true
    },
    {
      id: 'testerFreshStartNotice',
      stage: 'before-release',
      label: 'Prepare tester fresh-start notice',
      requiredEvidence: ['Tester instructions say old preview files are disposable', 'Block message is included', 'No request to send private plan files'],
      stopIfMissing: true
    },
    {
      id: 'importBlockSmoke',
      stage: 'during-release',
      label: 'Smoke test old-preview import blocking',
      requiredEvidence: ['Old-preview fixture is blocked', 'No partial plan state loads', 'Current plan remains usable after failed import'],
      stopIfMissing: true
    },
    {
      id: 'newFormatSmoke',
      stage: 'during-release',
      label: 'Smoke test new-format import acceptance',
      requiredEvidence: ['New-format fixture opens', 'Minimum expense field is retained', 'Capacity answer is calculated at runtime'],
      stopIfMissing: true
    },
    {
      id: 'postReleaseWatch',
      stage: 'after-release',
      label: 'Watch tester confusion after release',
      requiredEvidence: ['Feedback channel ready', 'Old-file confusion notes captured outside app', 'Rollback decision owner identified'],
      stopIfMissing: false
    }
  ],
  schemaResetDecisionReadiness: [
    {
      id: 'fieldListFrozen',
      decision: 'keep-planning',
      label: 'Freeze the clean-reset field list before wiring import behavior',
      requiredEvidence: [
        'Minimum monthly expenses replaces old desired spending as an input.',
        'Spending breakpoint ages are named and optional.',
        'Runtime answers remain outside saved plan inputs.'
      ],
      mustAvoid: ['partial migration of old desired-spending values', 'hidden calculated fields in saved plans'],
      stopIfMissing: true
    },
    {
      id: 'oldFileBlockAccepted',
      decision: 'keep-planning',
      label: 'Accept the old-preview block posture before release work',
      requiredEvidence: [
        'Tester fresh-start instruction is ready.',
        'Old preview files are blocked with plain copy.',
        'No private tester plan files are requested for migration.'
      ],
      mustAvoid: ['best-effort old file migration', 'silent partial import'],
      stopIfMissing: true
    },
    {
      id: 'newExamplesReady',
      decision: 'keep-planning',
      label: 'Rebuild examples in the new format before runtime wiring',
      requiredEvidence: [
        'Single covered-floor example drafted.',
        'Tight couple gap-review example drafted.',
        'DB survivor example drafted.',
        'Estate-room example drafted.'
      ],
      mustAvoid: ['reusing old desired-spending examples', 'creating persisted .plan.json files during planning'],
      stopIfMissing: true
    },
    {
      id: 'rollbackReleaseReady',
      decision: 'defer',
      label: 'Hold release until rollback evidence is complete',
      requiredEvidence: [
        'Prior compatible build is identified.',
        'Import block smoke test is defined.',
        'New-format smoke test is defined.',
        'Post-release watch owner is identified.'
      ],
      mustAvoid: ['release without rollback path', 'release before import-block smoke'],
      stopIfMissing: true
    }
  ],
  testOnlyFixtureShapes: [
    {
      id: 'futureMinimumFloorPlan',
      intent: 'accepted-new-format',
      wrapper: 'future-plan-file',
      requiredKeys: ['schemaVersion', 'minimumMonthlyExpensesExMortgage', 'earlySpendingChangeAge', 'laterSpendingChangeAge'],
      forbiddenKeys: ['gogo', 'slowgo', 'nogo', 'confidentMonthlyAfterTaxSpend'],
      expectedImportResult: 'accept'
    },
    {
      id: 'legacyPreviewDesiredSpendPayload',
      intent: 'blocked-old-preview',
      wrapper: 'legacy-preview-payload',
      requiredKeys: ['schemaVersion', 'spending.gogo', 'spending.slowgo', 'spending.nogo'],
      forbiddenKeys: ['minimumMonthlyExpensesExMortgage'],
      expectedImportResult: 'block'
    },
    {
      id: 'unsupportedFuturePlanFile',
      intent: 'blocked-future-format',
      wrapper: 'unsupported-future-file',
      requiredKeys: ['schemaVersion', 'futureOnlyField'],
      forbiddenKeys: ['silentlyDroppedFieldsAccepted'],
      expectedImportResult: 'block'
    },
    {
      id: 'rawUnwrappedPayload',
      intent: 'blocked-raw-payload',
      wrapper: 'raw-unwrapped-payload',
      requiredKeys: ['payloadKind', 'rawPlanPayload'],
      forbiddenKeys: ['plan', 'metadata', 'minimumMonthlyExpensesExMortgage'],
      expectedImportResult: 'block'
    }
  ],
  fixtureExpectationHardening: [
    {
      id: 'acceptedFixtureNoCalculatedAnswers',
      fixtureId: 'futureMinimumFloorPlan',
      expectation: 'Accepted future fixtures must not contain calculated answers.',
      mustProve: ['confident monthly capacity is absent', 'funding trace output is absent', 'capacity is derived at runtime later'],
      mustAvoid: ['saved calculated answer', 'test fixture that looks like a production export']
    },
    {
      id: 'acceptedFixtureMinimumFloorExplicit',
      fixtureId: 'futureMinimumFloorPlan',
      expectation: 'Accepted future fixtures must carry explicit minimum-expense inputs.',
      mustProve: ['minimum monthly expenses are present', 'mortgage payment remains separate', 'spending breakpoint ages are explicit'],
      mustAvoid: ['mapping old desired spending into the floor', 'go-go slow-go no-go keys']
    },
    {
      id: 'oldPreviewFixtureBlockedPlainly',
      fixtureId: 'legacyPreviewDesiredSpendPayload',
      expectation: 'Old preview fixtures must block with fresh-start copy.',
      mustProve: ['old desired-spending keys are detected', 'block message is plain', 'no partial plan state loads'],
      mustAvoid: ['migration fallback', 'asking testers to send private files']
    },
    {
      id: 'unsupportedFutureFixtureBlockedSafely',
      fixtureId: 'unsupportedFuturePlanFile',
      expectation: 'Unsupported future fixtures must block before unknown fields can be dropped.',
      mustProve: ['future-only fields are detected', 'newer-format message is used', 'current plan state is preserved'],
      mustAvoid: ['silent field loss', 'best-effort import']
    },
    {
      id: 'rawPayloadFixtureBlockedDeliberately',
      fixtureId: 'rawUnwrappedPayload',
      expectation: 'Raw unwrapped payload behavior must remain explicit and blocked after the reset.',
      mustProve: ['raw payloads are not treated as plan files', 'raw payload block copy is distinct', 'blocked raw payloads do not change current state'],
      mustAvoid: ['ambiguous raw import support', 'partial raw payload load']
    }
  ],
  importBlockExpectationChecks: [
    {
      id: 'oldPreviewBlockMessage',
      blockedRuleId: 'oldPreview',
      expectedMessage: 'This plan was created with an earlier preview format. Please start a new plan.',
      mustPreserve: ['current plan state', 'local-first posture', 'plain fresh-start instruction'],
      mustAvoid: ['migration promise', 'technical schema explanation']
    },
    {
      id: 'futureUnknownBlockMessage',
      blockedRuleId: 'futureUnknown',
      expectedMessage: 'This plan was created with a newer format this preview cannot open. Please use the newer planner version.',
      mustPreserve: ['current plan state', 'unsupported fields', 'clear newer-version boundary'],
      mustAvoid: ['silent downgrade', 'dropping unknown fields']
    },
    {
      id: 'rawPayloadBlockMessage',
      blockedRuleId: 'rawPayload',
      expectedMessage: 'This file is not a supported plan file. Please start a new plan or open a saved plan from this preview.',
      mustPreserve: ['current plan state', 'wrapped-file requirement', 'local-only file handling'],
      mustAvoid: ['raw payload fallback', 'partial import']
    }
  ],
  optimizerContractReadiness: [
    {
      id: 'floorInputs',
      contractPart: 'input',
      label: 'Minimum expense floor inputs',
      mustInclude: ['minimum monthly expenses excluding mortgage', 'mortgage payment from Debts', 'household tax assumptions'],
      mustExclude: ['old desired-spending fields as floor', 'calculated capacity as input']
    },
    {
      id: 'capacityRuntimeOutput',
      contractPart: 'runtime-output',
      label: 'Confident monthly after-tax capacity output',
      mustInclude: ['monthly after-tax amount', 'today-dollar framing', 'confidence or review status'],
      mustExclude: ['guaranteed safe-spend language', 'saved output field']
    },
    {
      id: 'fundingTraceRuntimeOutput',
      contractPart: 'runtime-output',
      label: 'Funding trace output',
      mustInclude: ['income sources', 'account groups', 'tax', 'cash wedge or other inflows when present'],
      mustExclude: ['annual account-by-account instructions', 'personalized withdrawal advice']
    },
    {
      id: 'reviewBoundary',
      contractPart: 'review-boundary',
      label: 'Review-oriented optimizer boundary',
      mustInclude: ['plain review actions', 'estate and survivor caveats', 'tax caveats'],
      mustExclude: ['automatic saved changes', 'advisor workflow', 'cloud account requirement']
    }
  ],
  fixtureSpecifications: [
    {
      id: 'acceptNewFormatMinimumFloor',
      kind: 'accepted-new-format',
      purpose: 'Prove the future loader accepts a clean-format plan with explicit minimum expenses.',
      expectedOutcome: 'Plan opens and keeps minimum expenses separate from calculated capacity.',
      mustProve: ['minimum monthly expenses are present', 'capacity answer is not saved as an input', 'spending path breakpoints are explicit']
    },
    {
      id: 'blockOldPreviewDesiredSpend',
      kind: 'blocked-old-preview',
      purpose: 'Prove old phased-spending preview files are blocked instead of migrated.',
      expectedOutcome: 'Import stops with the old-preview block message.',
      mustProve: ['old desired-spending fields are not mapped', 'block copy is calm', 'no partial plan state is loaded']
    },
    {
      id: 'blockUnsupportedFutureFormat',
      kind: 'blocked-future-format',
      purpose: 'Prove unsupported future files are blocked to avoid silent field loss.',
      expectedOutcome: 'Import stops with the newer-format message.',
      mustProve: ['future fields are not dropped', 'user sees newer-version copy', 'current plan state is preserved']
    },
    {
      id: 'rejectAmbiguousRawPayload',
      kind: 'blocked-old-preview',
      purpose: 'Prove raw payload policy is deliberate after the reset decision.',
      expectedOutcome: 'Raw payload behavior follows the final accepted policy.',
      mustProve: ['raw payload support is either explicitly accepted or explicitly blocked', 'unsupported raw files do not load partially']
    }
  ],
  accountOptimizerReadiness: [
    {
      id: 'floorFirstObjective',
      label: 'Test minimum expense floor before discretionary room',
      status: 'needed-before-optimizer',
      reason: 'The optimizer should answer whether the household floor is covered before comparing optional room.'
    },
    {
      id: 'capacityObjective',
      label: 'Estimate confident monthly after-tax capacity',
      status: 'needed-before-optimizer',
      reason: 'The primary result should be calculated from assets, income, tax, and assumptions.'
    },
    {
      id: 'fundingTraceContract',
      label: 'Define funding trace contract',
      status: 'needed-before-optimizer',
      reason: 'The future answer should explain where money appears to come from without becoming account instructions too early.'
    },
    {
      id: 'annualAccountSequencing',
      label: 'Annual account-level sequencing',
      status: 'deferred-until-sequencing',
      reason: 'Annual account-level instructions remain deferred until sequencing readiness is complete.'
    }
  ],
  importAcceptanceRules: [
    {
      id: 'newFormat',
      decision: 'accept',
      appliesTo: 'Plan files created with the future clean saved format',
      reason: 'The new format will carry minimum expenses and spending-path assumptions explicitly.'
    },
    {
      id: 'oldPreview',
      decision: 'block',
      appliesTo: 'Older preview files from the phased-spending schema',
      message: 'This plan was created with an earlier preview format. Please start a new plan.',
      reason: 'Old desired-spending fields should not be interpreted as minimum expenses.'
    },
    {
      id: 'futureUnknown',
      decision: 'block',
      appliesTo: 'Files from a newer unsupported future format',
      message: 'This plan was created with a newer format this preview cannot open. Please use the newer planner version.',
      reason: 'Opening unknown future formats could silently drop fields.'
    },
    {
      id: 'rawPayload',
      decision: 'block',
      appliesTo: 'Raw unwrapped JSON payloads',
      message: 'This file is not a supported plan file. Please start a new plan or open a saved plan from this preview.',
      reason: 'After the reset, only wrapped local plan files should be accepted so ambiguous raw payloads do not partially load.'
    }
  ],
  rawPayloadPolicy: {
    decision: 'block-raw-payloads-after-reset',
    message: 'This file is not a supported plan file. Please start a new plan or open a saved plan from this preview.',
    rationale: [
      'Raw JSON files can be mistaken for older preview payloads.',
      'Wrapped plan files give the loader a clear file type and version boundary.',
      'Blocking raw payloads reduces the risk of partially loading unsupported fields.'
    ],
    allowed: ['Wrapped future clean-format plan files'],
    blocked: ['Raw unwrapped JSON payloads', 'Old phased-spending preview payloads', 'Unknown future raw payloads']
  },
  fixtureValidationHelpers: [
    {
      id: 'assertRequiredKeys',
      validates: 'required fixture keys',
      mode: 'test-only',
      checks: ['all required keys are present', 'nested keys can be checked by path'],
      mustNotDo: ['normalize missing fields', 'load the fixture into app state']
    },
    {
      id: 'assertForbiddenKeys',
      validates: 'forbidden fixture keys',
      mode: 'test-only',
      checks: ['calculated answers are absent', 'old phased-spending keys are absent from new-format fixtures'],
      mustNotDo: ['delete forbidden keys automatically', 'treat forbidden keys as warnings only']
    },
    {
      id: 'assertExpectedImportResult',
      validates: 'planned accept or block result',
      mode: 'test-only',
      checks: ['accepted fixtures map to accept', 'blocked fixtures map to block', 'block messages remain plain'],
      mustNotDo: ['wire the production loader', 'change current import behavior']
    }
  ],
  capacityStatusReadiness: [
    {
      id: 'covered',
      label: 'Floor appears covered',
      meaning: 'The plan appears able to cover minimum expenses under the modelled assumptions.',
      showWhen: ['minimum floor is covered', 'capacity estimate is available', 'no immediate shortfall is visible'],
      mustAvoid: ['guaranteed language', 'safe-to-spend framing']
    },
    {
      id: 'tight',
      label: 'Floor looks tight',
      meaning: 'The plan may cover minimum expenses, but small changes could matter.',
      showWhen: ['room above floor is limited', 'tax or survivor caveats matter', 'spending path assumptions are sensitive'],
      mustAvoid: ['alarmist language', 'single-option pressure']
    },
    {
      id: 'gap',
      label: 'Minimum expenses need review',
      meaning: 'The plan does not appear to cover the minimum expense floor through the projection.',
      showWhen: ['minimum floor has a gap', 'capacity is below floor', 'shortfall appears before plan end'],
      mustAvoid: ['failure language', 'automatic recommendation to cut spending']
    },
    {
      id: 'cannotTell',
      label: 'Needs more inputs',
      meaning: 'The app does not have enough information to estimate confident monthly capacity.',
      showWhen: ['missing minimum expense floor', 'missing core asset or income data', 'projection cannot be trusted'],
      mustAvoid: ['invented capacity', 'false precision']
    }
  ],
  capacitySelectorReadiness: {
    status: 'planning-only',
    inputs: [
      {
        id: 'minimumMonthlyExpensesExMortgage',
        source: 'saved-field',
        label: 'Minimum monthly expenses excluding mortgage',
        requiredFor: ['floor coverage', 'capacity status', 'gap review']
      },
      {
        id: 'mortgageMonthlyPayment',
        source: 'saved-field',
        label: 'Mortgage payment already entered in Debts',
        requiredFor: ['floor explanation', 'cash flow context']
      },
      {
        id: 'spendingPathBreakpoints',
        source: 'saved-field',
        label: 'Spending path breakpoint ages',
        requiredFor: ['age-based spending path', 'capacity caveats']
      },
      {
        id: 'projectedAfterTaxCapacity',
        source: 'engine-result',
        label: 'Projected after-tax capacity',
        requiredFor: ['monthly capacity answer', 'floor comparison']
      },
      {
        id: 'fundingTracePreview',
        source: 'runtime-derived',
        label: 'First-year funding trace preview',
        requiredFor: ['where money comes from', 'tax caveats']
      }
    ],
    outputs: [
      {
        id: 'confidentMonthlyAfterTaxSpend',
        status: 'derived-runtime',
        label: 'Confident monthly after-tax spend',
        mustAvoid: ['saved output field', 'guaranteed safe-spend language']
      },
      {
        id: 'capacityStatus',
        status: 'derived-runtime',
        label: 'Capacity status',
        mustAvoid: ['failure language', 'false precision']
      },
      {
        id: 'reviewFactors',
        status: 'derived-runtime',
        label: 'Review factors',
        mustAvoid: ['account instructions', 'advisor workflow']
      }
    ],
    statusMappings: [
      {
        statusId: 'covered',
        conditions: ['minimum expense floor is covered', 'capacity is above floor', 'no near-term shortfall is visible'],
        reviewPrompt: 'Review tax, survivor needs, estate intent, and spending path before treating the plan as settled.'
      },
      {
        statusId: 'tight',
        conditions: ['floor is barely covered', 'room above floor is limited', 'small assumption changes can affect the answer'],
        reviewPrompt: 'Compare timing, spending path, tax, and estate choices before increasing discretionary spending.'
      },
      {
        statusId: 'gap',
        conditions: ['floor is not covered', 'capacity is below minimum expenses', 'shortfall appears before plan end'],
        reviewPrompt: 'Compare practical options such as work timing, spending, downsizing, savings, benefit timing, and tax review.'
      },
      {
        statusId: 'cannotTell',
        conditions: ['minimum expense floor is missing', 'core income or asset data is missing', 'projection cannot produce a reliable answer'],
        reviewPrompt: 'Complete the missing inputs before relying on a monthly capacity estimate.'
      }
    ],
    reviewFactors: [
      {
        id: 'tax',
        label: 'Tax and benefit timing',
        reason: 'Tax, OAS recovery tax, RRIF/LIF timing, and benefit timing can change after-tax capacity.',
        mustStay: 'review-factor',
        mustNotBecome: ['tax advice', 'automatic benefit timing instruction']
      },
      {
        id: 'survivor',
        label: 'Survivor resilience',
        reason: 'A household monthly answer can hide what changes after the first death in a couple plan.',
        mustStay: 'review-factor',
        mustNotBecome: ['survivor recommendation', 'estate advice']
      },
      {
        id: 'estate',
        label: 'Estate intent',
        reason: 'Preserving money can reduce room above the minimum floor.',
        mustStay: 'review-factor',
        mustNotBecome: ['permission to spend more', 'estate recommendation']
      },
      {
        id: 'fundingTrace',
        label: 'Funding trace',
        reason: 'The first-year trace can explain where money appears to come from without telling the household what to withdraw.',
        mustStay: 'review-factor',
        mustNotBecome: ['annual account instruction', 'personalized withdrawal advice']
      },
      {
        id: 'spendingPath',
        label: 'Spending path',
        reason: 'Capacity can depend on age-based spending assumptions and breakpoint ages.',
        mustStay: 'review-factor',
        mustNotBecome: ['required user expertise', 'go-go slow-go jargon']
      }
    ],
    gapOptions: [
      {
        id: 'reduceSpending',
        label: 'Reduce regular spending',
        reviewPrompt: 'Compare whether a lower minimum expense level would close the gap.',
        mustStay: 'option-to-compare',
        mustNotBecome: ['automatic recommendation to cut spending', 'failure language']
      },
      {
        id: 'workLonger',
        label: 'Work longer',
        reviewPrompt: 'Compare whether retiring later gives the plan more room.',
        mustStay: 'option-to-compare',
        mustNotBecome: ['instruction to delay retirement', 'employment advice']
      },
      {
        id: 'downsize',
        label: 'Downsize if realistic',
        reviewPrompt: 'Compare whether home equity could help if downsizing is a real option.',
        mustStay: 'option-to-compare',
        mustNotBecome: ['instruction to sell a home', 'real estate advice']
      },
      {
        id: 'saveMore',
        label: 'Save more before retirement',
        reviewPrompt: 'Compare whether adding savings before retirement changes the floor coverage picture.',
        mustStay: 'option-to-compare',
        mustNotBecome: ['savings command', 'guarantee that extra savings fixes the plan']
      }
    ],
    guardrails: [
      'The selector must not write to saved plans.',
      'The selector must not add engine output fields in this package.',
      'The selector must not call capacity safe or guaranteed.',
      'The selector must keep funding trace language review-oriented.'
    ]
  },
  futureExampleDataDrafts: [
    {
      id: 'singleMinimumFloor',
      label: 'Single person with a covered floor',
      status: 'planning-only',
      household: 'Single renter or mortgage-free owner with moderate registered savings and CPP/OAS income.',
      minimumMonthlyExpensesExMortgage: 3600,
      mortgageMonthlyPayment: 0,
      projectedMonthlyAfterTaxCapacity: 4800,
      earlySpendingChangeAge: 75,
      laterSpendingChangeAge: 85,
      expectedCapacityStatus: 'covered',
      reviewFocus: ['monthly capacity is visible', 'floor coverage is easy to understand', 'funding trace stays non-instructional'],
      mustAvoid: ['migrated desired-spending values', 'safe-spend language', 'account withdrawal instructions']
    },
    {
      id: 'coupleTightFloor',
      label: 'Couple with a tight or uncovered floor',
      status: 'planning-only',
      household: 'Retiring couple with moderate savings, a remaining mortgage, and a minimum expense floor that may not be fully covered.',
      minimumMonthlyExpensesExMortgage: 6200,
      mortgageMonthlyPayment: 1800,
      projectedMonthlyAfterTaxCapacity: 7200,
      earlySpendingChangeAge: 74,
      laterSpendingChangeAge: 84,
      expectedCapacityStatus: 'gap',
      reviewFocus: ['gap options are practical', 'work-longer and downsize comparisons are not pushy', 'tax review is visible without advice'],
      mustAvoid: [
        'single-option pressure',
        'automatic recommendation to cut spending',
        'false certainty that one option fixes the plan',
        'account withdrawal instructions'
      ]
    },
    {
      id: 'pensionCoupleSurvivor',
      label: 'DB pension couple with survivor sensitivity',
      status: 'planning-only',
      household: 'Couple with one DB pension, survivor continuation risk, CPP/OAS income, and enough assets to make the first monthly answer look comfortable.',
      minimumMonthlyExpensesExMortgage: 5400,
      mortgageMonthlyPayment: 0,
      projectedMonthlyAfterTaxCapacity: 5750,
      earlySpendingChangeAge: 76,
      laterSpendingChangeAge: 86,
      expectedCapacityStatus: 'tight',
      reviewFocus: ['survivor resilience is visible', 'DB pension continuation is easy to review', 'monthly capacity does not hide couple risk'],
      mustAvoid: [
        'hiding survivor impact behind one number',
        'safe-spend language',
        'survivor recommendation',
        'pension advice',
        'account withdrawal instructions'
      ]
    },
    {
      id: 'estateHeavyRoom',
      label: 'Estate-heavy plan with room above the floor',
      status: 'planning-only',
      household: 'Mortgage-free couple with significant non-registered and TFSA assets, an explicit estate intent, and apparent room above the minimum floor.',
      minimumMonthlyExpensesExMortgage: 7000,
      mortgageMonthlyPayment: 0,
      projectedMonthlyAfterTaxCapacity: 8600,
      earlySpendingChangeAge: 77,
      laterSpendingChangeAge: 87,
      expectedCapacityStatus: 'covered',
      reviewFocus: ['estate trade-off is visible', 'room above floor is caveated', 'tax and spending path caveats remain prominent'],
      mustAvoid: ['permission to spend more', 'guaranteed-room language', 'estate recommendation', 'account withdrawal instructions']
    }
  ],
  freshExampleRebuildPlan: [
    {
      id: 'singleMinimumFloorDraftValues',
      exampleId: 'singleMinimumFloor',
      stage: 'draft-values',
      label: 'Draft single covered-floor example values',
      mustProve: ['minimum monthly expenses are entered directly', 'monthly capacity is runtime-derived', 'funding trace is not instructional'],
      mustAvoid: ['desired-spend migration', 'safe-spend guarantee']
    },
    {
      id: 'coupleTightFloorDraftValues',
      exampleId: 'coupleTightFloor',
      stage: 'draft-values',
      label: 'Draft tight couple gap-review example values',
      mustProve: ['gap is visible', 'work-longer and downsize options are neutral', 'tax review remains visible'],
      mustAvoid: ['automatic recommendation to cut spending', 'single-option pressure']
    },
    {
      id: 'pensionCoupleSurvivorDraftValues',
      exampleId: 'pensionCoupleSurvivor',
      stage: 'draft-values',
      label: 'Draft DB pension survivor example values',
      mustProve: ['survivor resilience is visible', 'DB pension continuation is reviewable', 'monthly answer does not hide survivor risk'],
      mustAvoid: ['pension advice', 'survivor recommendation']
    },
    {
      id: 'estateHeavyRoomDraftValues',
      exampleId: 'estateHeavyRoom',
      stage: 'draft-values',
      label: 'Draft estate-room example values',
      mustProve: ['estate trade-off is visible', 'room above floor is caveated', 'tax and spending-path caveats remain visible'],
      mustAvoid: ['permission to spend more', 'guaranteed-room language']
    },
    {
      id: 'acceptedFixtureLater',
      exampleId: 'singleMinimumFloor',
      stage: 'fixture-later',
      label: 'Create accepted new-format fixture only after reset wiring is approved',
      mustProve: ['wrapped future plan file is accepted', 'capacity answer is not saved', 'minimum expense field survives import'],
      mustAvoid: ['production loader wiring in planning package', 'persisted .plan.json files']
    },
    {
      id: 'newFormatSmokeLater',
      exampleId: 'coupleTightFloor',
      stage: 'smoke-later',
      label: 'Define new-format smoke after example fixtures exist',
      mustProve: ['new-format example opens', 'gap review remains calm', 'old desired-spending fields are absent'],
      mustAvoid: ['broad UI redesign', 'account optimizer implementation']
    }
  ],
  fundingTraceReadiness: {
    status: 'planning-only',
    accountGroups: [
      {
        id: 'income',
        label: 'Income sources',
        includes: ['CPP', 'OAS', 'DB pension', 'salary or work income'],
        mustAvoid: ['benefit timing recommendation', 'pension advice']
      },
      {
        id: 'registered',
        label: 'Registered withdrawals',
        includes: ['RRSP', 'RRIF', 'LIRA', 'LIF'],
        mustAvoid: ['account-by-account withdrawal instruction', 'RRIF/LIF advice']
      },
      {
        id: 'tfsa',
        label: 'TFSA withdrawals',
        includes: ['TFSA principal and growth'],
        mustAvoid: ['tax-free means always best language', 'withdraw-this-first instruction']
      },
      {
        id: 'nonRegistered',
        label: 'Non-registered withdrawals',
        includes: ['non-registered assets', 'capital gains context'],
        mustAvoid: ['capital-gains advice', 'tax-loss instruction']
      },
      {
        id: 'cash',
        label: 'Cash and reserve draw',
        includes: ['cash wedge', 'cash savings'],
        mustAvoid: ['emergency fund advice', 'cash target instruction']
      },
      {
        id: 'otherInflows',
        label: 'Other inflows',
        includes: ['downsizing proceeds', 'inheritance', 'one-time inflows'],
        mustAvoid: ['guaranteed sale proceeds', 'inheritance certainty']
      },
      {
        id: 'tax',
        label: 'Estimated tax',
        includes: ['income tax', 'OAS recovery tax', 'Ontario Health Premium when applicable'],
        mustAvoid: ['tax advice', 'precision beyond the model']
      }
    ],
    firstYearTraceRows: [
      {
        id: 'incomeSources',
        groupId: 'income',
        label: 'Income sources',
        role: 'source',
        mustAvoid: ['benefit timing recommendation', 'pension advice']
      },
      {
        id: 'registeredWithdrawals',
        groupId: 'registered',
        label: 'Registered withdrawals',
        role: 'source',
        mustAvoid: ['account-by-account withdrawal instruction', 'withdraw-this-first instruction']
      },
      {
        id: 'tfsaWithdrawals',
        groupId: 'tfsa',
        label: 'TFSA withdrawals',
        role: 'source',
        mustAvoid: ['tax-free means always best language', 'withdraw-this-first instruction']
      },
      {
        id: 'nonRegisteredWithdrawals',
        groupId: 'nonRegistered',
        label: 'Non-registered withdrawals',
        role: 'source',
        mustAvoid: ['capital-gains advice', 'tax-loss instruction']
      },
      {
        id: 'cashReserveDraw',
        groupId: 'cash',
        label: 'Cash and reserve draw',
        role: 'source',
        mustAvoid: ['cash target instruction', 'emergency fund advice']
      },
      {
        id: 'otherInflows',
        groupId: 'otherInflows',
        label: 'Other inflows',
        role: 'source',
        mustAvoid: ['guaranteed sale proceeds', 'inheritance certainty']
      },
      {
        id: 'estimatedTax',
        groupId: 'tax',
        label: 'Estimated tax',
        role: 'tax',
        mustAvoid: ['tax advice', 'guaranteed tax result']
      },
      {
        id: 'minimumFloorGap',
        groupId: 'tax',
        label: 'Minimum floor gap',
        role: 'gap',
        mustAvoid: ['failure language', 'single-option pressure']
      }
    ],
    exampleTraceSamples: [
      {
        id: 'singleMinimumFloor',
        expectedStatusId: 'covered',
        rowIds: ['incomeSources', 'registeredWithdrawals', 'tfsaWithdrawals', 'estimatedTax'],
        mustShow: ['income sources', 'estimated tax', 'no gap row needed'],
        mustAvoid: ['account withdrawal instructions', 'safe-spend language']
      },
      {
        id: 'coupleTightFloor',
        expectedStatusId: 'gap',
        rowIds: ['incomeSources', 'registeredWithdrawals', 'cashReserveDraw', 'estimatedTax', 'minimumFloorGap'],
        mustShow: ['minimum floor gap', 'estimated tax', 'practical options stay separate'],
        mustAvoid: ['failure language', 'automatic recommendation to cut spending']
      },
      {
        id: 'pensionCoupleSurvivor',
        expectedStatusId: 'tight',
        rowIds: ['incomeSources', 'registeredWithdrawals', 'estimatedTax'],
        mustShow: ['DB pension context', 'survivor caveat', 'estimated tax'],
        mustAvoid: ['survivor recommendation', 'pension advice']
      },
      {
        id: 'estateHeavyRoom',
        expectedStatusId: 'covered',
        rowIds: ['incomeSources', 'nonRegisteredWithdrawals', 'tfsaWithdrawals', 'estimatedTax'],
        mustShow: ['estate caveat', 'tax caveat', 'room above floor is caveated'],
        mustAvoid: ['permission to spend more', 'estate recommendation']
      }
    ],
    taxCaveats: [
      {
        id: 'oasRecoveryTax',
        label: 'OAS recovery tax can change after-tax capacity',
        reason: 'Income changes and registered withdrawals can affect OAS recovery tax.',
        mustAvoid: ['OAS optimization advice', 'guaranteed recovery estimate']
      },
      {
        id: 'registeredTaxable',
        label: 'Registered withdrawals are taxable',
        reason: 'RRSP/RRIF/LIRA/LIF withdrawals can change taxable income and credits.',
        mustAvoid: ['withdrawal order instruction', 'tax advice']
      },
      {
        id: 'nonRegisteredGains',
        label: 'Non-registered withdrawals can include capital gains',
        reason: 'ACB and sale timing can affect taxable gains.',
        mustAvoid: ['capital gains strategy', 'tax-loss instruction']
      },
      {
        id: 'ontarioHealthPremium',
        label: 'Ontario Health Premium may apply',
        reason: 'Ontario tax assumptions can include Health Premium at certain income levels.',
        mustAvoid: ['province expansion', 'false precision']
      }
    ],
    reconciliationRules: [
      {
        id: 'sourcesMinusTax',
        rule: 'Income sources plus withdrawals plus other inflows minus estimated tax should reconcile to after-tax spending and surplus or shortfall.',
        mustAvoid: ['hiding tax from the trace', 'treating reconciliation as a withdrawal instruction']
      },
      {
        id: 'todayDollars',
        rule: 'Funding trace labels should clarify when amounts are shown in today dollars.',
        mustAvoid: ['mixing nominal and today-dollar labels', 'false precision']
      },
      {
        id: 'shortfallVisible',
        rule: 'If sources minus tax do not cover the minimum floor, the gap should remain visible.',
        mustAvoid: ['masking gaps with discretionary room', 'failure language']
      }
    ],
    copyBoundaries: [
      {
        id: 'traceIntro',
        phrase: 'Where the first-year spending appears to come from',
        mustAvoid: ['where to withdraw from', 'account instructions']
      },
      {
        id: 'reviewQualifier',
        phrase: 'This is a first-year trace for review, not a withdrawal plan.',
        mustAvoid: ['personalized advice', 'annual account-level sequence']
      },
      {
        id: 'taxQualifier',
        phrase: 'Tax can change as income sources and withdrawals change.',
        mustAvoid: ['tax strategy', 'guaranteed tax result']
      },
      {
        id: 'gapQualifier',
        phrase: 'If the trace does not cover the minimum floor, compare practical options before treating the plan as ready.',
        mustAvoid: ['failure language', 'single-option pressure']
      }
    ],
    survivorEstateCaveats: [
      {
        id: 'survivorIncomeChange',
        label: 'Survivor income can change monthly capacity',
        reason: 'CPP, OAS, pension income, and household tax context can change after the first death.',
        mustAvoid: ['survivor recommendation', 'hiding survivor impact behind one number']
      },
      {
        id: 'dbPensionContinuation',
        label: 'DB pension continuation needs visible review',
        reason: 'A DB pension may continue at a different amount for the survivor.',
        mustAvoid: ['pension election advice', 'assuming full continuation']
      },
      {
        id: 'estateIntentTradeoff',
        label: 'Estate intent changes how room above the floor is interpreted',
        reason: 'Room above minimum expenses should be shown with estate intent, not as permission to spend more.',
        mustAvoid: ['permission to spend more', 'estate recommendation']
      },
      {
        id: 'jointToSingleTaxContext',
        label: 'Tax context can change from couple to survivor',
        reason: 'A survivor may have different credits, income sources, account ownership, and taxable income.',
        mustAvoid: ['tax advice', 'false precision in survivor tax']
      }
    ],
    cashAndOneOffHandling: [
      {
        id: 'cashWedgeDraw',
        label: 'Cash wedge can appear as a source, not a target',
        handling: 'Show cash used in the trace when the engine uses cash-like balances, but do not tell the user how much cash to hold.',
        mustAvoid: ['cash target instruction', 'emergency fund advice']
      },
      {
        id: 'downsizingProceeds',
        label: 'Downsizing proceeds remain scenario assumptions',
        handling: 'Show proceeds only when entered as an assumption and keep sale timing and net proceeds reviewable.',
        mustAvoid: ['guaranteed sale proceeds', 'real estate advice']
      },
      {
        id: 'inheritance',
        label: 'Inheritance stays uncertain unless already received',
        handling: 'Treat future inheritance as a scenario inflow and make uncertainty visible.',
        mustAvoid: ['inheritance certainty', 'counting uncertain inheritance as base capacity']
      },
      {
        id: 'oneOffOutflowOrInflow',
        label: 'One-off events should not look recurring',
        handling: 'Keep one-time inflows and outflows separate from recurring monthly capacity.',
        mustAvoid: ['turning one-time money into a permanent spending promise', 'hiding one-time shortfalls']
      }
    ],
    instructionGuardrails: [
      {
        id: 'noAccountOrder',
        rule: 'Do not rank accounts or imply a preferred withdrawal order.',
        mustAvoid: ['withdraw from X first', 'take this account before that account']
      },
      {
        id: 'noAnnualRows',
        rule: 'Do not produce annual account-by-account rows in the funding trace.',
        mustAvoid: ['annual account-by-account sequencing', 'year-by-year withdrawal table']
      },
      {
        id: 'noPersonalizedWithdrawal',
        rule: 'Keep trace copy review-oriented and avoid personalized withdrawal instructions.',
        mustAvoid: ['you should withdraw', 'recommended withdrawal']
      },
      {
        id: 'noSavedTrace',
        rule: 'Do not save funding trace outputs into plan files.',
        mustAvoid: ['saved output field', 'persisted account trace']
      },
      {
        id: 'reviewOnlyLanguage',
        rule: 'Use review language that helps users understand inputs, tax caveats, and gaps.',
        mustAvoid: ['advice-like certainty', 'pressure language']
      }
    ],
    decisionGate: [
      {
        id: 'prototypeOnlyAfterContractReview',
        decision: 'keep-planning',
        requiredEvidence: [
          'Survivor and estate caveats are visible in the trace contract.',
          'Cash and one-off inflows cannot be mistaken for recurring spending capacity.',
          'Instruction guardrails block annual account sequencing and personalized withdrawal language.',
          'Runtime-only boundary is still explicit.'
        ],
        stopIfMissing: true
      },
      {
        id: 'schemaResetBeforeRuntimeTrace',
        decision: 'defer',
        requiredEvidence: [
          'Clean-reset import behavior is approved.',
          'Fresh example plans are rebuilt in the new format.',
          'No calculated funding trace outputs are added to saved plan files.'
        ],
        stopIfMissing: true
      }
    ],
    guardrails: [
      'Funding trace must explain where money appears to come from, not what to withdraw.',
      'Funding trace must not become annual account-level sequencing.',
      'Funding trace must stay runtime-only in this planning package.',
      'Funding trace must keep tax caveats visible.'
    ]
  },
  sections: [
    {
      id: 'minimumExpenses',
      label: 'Minimum expenses',
      fields: [
        {
          id: 'minimumMonthlyExpensesExMortgage',
          label: 'Minimum monthly expenses, excluding mortgage payments already entered in Debts',
          status: 'new-format-field',
          reason: 'The floor should come from the household need, not from desired retirement spending.'
        }
      ]
    },
    {
      id: 'spendingPath',
      label: 'Spending path assumptions',
      fields: [
        {
          id: 'earlySpendingChangeAge',
          label: 'Age when early retirement spending assumptions change',
          status: 'new-format-field',
          reason: 'Breakpoint ages should be optional calibration controls for reruns.'
        },
        {
          id: 'laterSpendingChangeAge',
          label: 'Age when later retirement spending assumptions change',
          status: 'new-format-field',
          reason: 'The model can still reflect age-based spending changes without asking users to know go-go language.'
        },
        {
          id: 'defaultSpendingPath',
          label: 'Default age-based spending path',
          status: 'derived-runtime',
          reason: 'Default reduction rates should be reviewed before they become persisted assumptions.'
        }
      ]
    },
    {
      id: 'capacityAnswer',
      label: 'Capacity answer',
      fields: [
        {
          id: 'confidentMonthlyAfterTaxSpend',
          label: 'Confident monthly after-tax spend',
          status: 'derived-runtime',
          reason: 'This is the main result answer and should be calculated, not entered by the user.'
        },
        {
          id: 'discretionaryRoomAboveFloor',
          label: 'Room above minimum expenses',
          status: 'derived-runtime',
          reason: 'Room above the floor is review evidence, not permission to spend more.'
        }
      ]
    },
    {
      id: 'fundingTrace',
      label: 'Funding trace',
      fields: [
        {
          id: 'annualAccountFundingTrace',
          label: 'Annual account-level funding trace',
          status: 'deferred-output',
          reason: 'Account-level sourcing waits for sequencing readiness and must not be added as saved input.'
        }
      ]
    }
  ],
  freshExampleRequirements: [
    {
      id: 'singleMinimumFloor',
      label: 'Single person with a covered floor',
      purpose: 'Show the basic capacity-first answer without couple or survivor complexity.',
      mustInclude: ['minimum monthly expenses', 'monthly after-tax capacity', 'spending path defaults'],
      mustAvoid: ['migrated desired-spending values', 'account withdrawal instructions']
    },
    {
      id: 'coupleTightFloor',
      label: 'Couple with a tight or uncovered floor',
      purpose: 'Test gap language and practical options without pushing one answer.',
      mustInclude: ['minimum expense gap', 'work-longer comparison', 'downsize comparison', 'tax review note'],
      mustAvoid: ['advice-like instructions', 'false certainty that one option fixes the plan']
    },
    {
      id: 'pensionCoupleSurvivor',
      label: 'DB pension couple with survivor sensitivity',
      purpose: 'Keep pension continuation and survivor resilience visible in the new format.',
      mustInclude: ['DB pension continuation', 'survivor review', 'after-tax monthly answer'],
      mustAvoid: ['hiding survivor impact behind a single household number']
    },
    {
      id: 'estateHeavyRoom',
      label: 'Estate-heavy plan with room above the floor',
      purpose: 'Test discretionary-room wording without sounding like permission to spend more.',
      mustInclude: ['estate intent', 'room above floor', 'tax and spending-path caveats'],
      mustAvoid: ['safe-spend language', 'guaranteed-room language']
    }
  ],
  boundaries: [
    'Do not migrate old desired-spending fields into minimum monthly expenses.',
    'Do not implement the schema reset until the field list is reviewed.',
    'Do not add account optimizer outputs to saved plan files.',
    'Do not start the broad UI overhaul in this package.'
  ]
};

export const futureMinimumFloorFixtureSample: FutureTestOnlyFixtureSample = {
  id: 'singleCoveredMinimumFloorInMemory',
  fixtureId: 'futureMinimumFloorPlan',
  label: 'Single covered minimum-floor fixture sample',
  fixture: {
    schemaVersion: 'future-clean-reset-draft',
    minimumMonthlyExpensesExMortgage: 3600,
    mortgageMonthlyPayment: 0,
    earlySpendingChangeAge: 75,
    laterSpendingChangeAge: 85,
    province: 'ON',
    taxYear: 2026,
    household: {
      p1BirthYear: 1966,
      p2BirthYear: null
    }
  },
  plannedImportResult: 'accept',
  mode: 'test-only',
  mustNotDo: [
    'write a .plan.json file',
    'wire production import behavior',
    'save calculated capacity',
    'include annual account sequencing'
  ]
};

export const futureOldPreviewFixtureSample: FutureTestOnlyFixtureSample = {
  id: 'legacyDesiredSpendInMemory',
  fixtureId: 'legacyPreviewDesiredSpendPayload',
  label: 'Legacy desired-spending fixture sample',
  fixture: {
    schemaVersion: 2,
    spending: {
      gogo: 85000,
      slowgo: 72000,
      nogo: 62000
    },
    assumptions: {
      retireYear: 2032
    }
  },
  plannedImportResult: 'block',
  mode: 'test-only',
  mustNotDo: [
    'map desired spending into minimum expenses',
    'partially load current plan state',
    'promise migration',
    'ask for private tester files'
  ]
};

export const futureUnsupportedFormatFixtureSample: FutureTestOnlyFixtureSample = {
  id: 'unsupportedFutureFieldInMemory',
  fixtureId: 'unsupportedFuturePlanFile',
  label: 'Unsupported future-format fixture sample',
  fixture: {
    schemaVersion: 'future-clean-reset-draft-plus-one',
    futureOnlyField: {
      name: 'futureFundingTraceVersion',
      value: 2
    }
  },
  plannedImportResult: 'block',
  mode: 'test-only',
  mustNotDo: [
    'drop unknown future fields',
    'silently downgrade the file',
    'best-effort import unsupported content',
    'change current plan state'
  ]
};

export const futureRawPayloadFixtureSample: FutureTestOnlyFixtureSample = {
  id: 'rawUnwrappedPayloadInMemory',
  fixtureId: 'rawUnwrappedPayload',
  label: 'Raw unwrapped payload fixture sample',
  fixture: {
    payloadKind: 'raw-unwrapped-json',
    rawPlanPayload: {
      schemaVersion: 'future-clean-reset-draft',
      minimumMonthlyExpensesExMortgage: 3600
    }
  },
  plannedImportResult: 'block',
  mode: 'test-only',
  mustNotDo: [
    'treat raw payloads as plan files',
    'partially import raw payload data',
    'create wrapped-file metadata',
    'change current plan state'
  ]
};

export const futureTestOnlyFixtureSamples: FutureTestOnlyFixtureSample[] = [
  futureMinimumFloorFixtureSample,
  futureOldPreviewFixtureSample,
  futureUnsupportedFormatFixtureSample,
  futureRawPayloadFixtureSample
];

export const futureCapacitySelectorScenarios: FutureCapacitySelectorScenario[] = [
  {
    id: 'coveredFloor',
    label: 'Covered minimum floor',
    input: {
      minimumMonthlyExpensesExMortgage: 3600,
      mortgageMonthlyPayment: 0,
      projectedMonthlyAfterTaxCapacity: 4800
    },
    expectedStatusId: 'covered',
    mustAvoid: ['guaranteed language', 'safe-spend framing']
  },
  {
    id: 'tightFloor',
    label: 'Tight minimum floor',
    input: {
      minimumMonthlyExpensesExMortgage: 3600,
      mortgageMonthlyPayment: 400,
      projectedMonthlyAfterTaxCapacity: 4350
    },
    expectedStatusId: 'tight',
    mustAvoid: ['alarmist language', 'single-option pressure']
  },
  {
    id: 'gapReview',
    label: 'Minimum expense gap review',
    input: {
      minimumMonthlyExpensesExMortgage: 6200,
      mortgageMonthlyPayment: 1800,
      projectedMonthlyAfterTaxCapacity: 7200
    },
    expectedStatusId: 'gap',
    mustAvoid: ['failure language', 'automatic recommendation to cut spending']
  },
  {
    id: 'missingFloor',
    label: 'Missing minimum floor',
    input: {
      minimumMonthlyExpensesExMortgage: null,
      mortgageMonthlyPayment: 0,
      projectedMonthlyAfterTaxCapacity: 4500
    },
    expectedStatusId: 'cannotTell',
    mustAvoid: ['invented capacity', 'false precision']
  }
];

export function flattenFuturePlanFormatFields(draft = futurePlanFormatDraft): FuturePlanFormatField[] {
  return draft.sections.flatMap((section) => section.fields);
}

function hasFixturePath(value: unknown, path: string): boolean {
  return path.split('.').every((segment, index, parts) => {
    if (index === 0) {
      return value !== null && typeof value === 'object' && segment in value;
    }

    const parent = parts.slice(0, index).reduce<unknown>((current, part) => {
      if (current === null || typeof current !== 'object' || !(part in current)) {
        return undefined;
      }
      return (current as Record<string, unknown>)[part];
    }, value);

    return parent !== null && typeof parent === 'object' && segment in parent;
  });
}

export function findMissingFutureFixtureRequiredKeys(
  shape: FutureTestOnlyFixtureShape,
  fixture: Record<string, unknown>
): string[] {
  return shape.requiredKeys.filter((key) => !hasFixturePath(fixture, key));
}

export function findPresentFutureFixtureForbiddenKeys(
  shape: FutureTestOnlyFixtureShape,
  fixture: Record<string, unknown>
): string[] {
  return shape.forbiddenKeys.filter((key) => hasFixturePath(fixture, key));
}

export function validateFutureFixtureShape(
  shape: FutureTestOnlyFixtureShape,
  fixture: Record<string, unknown>,
  plannedImportResult = shape.expectedImportResult
): FutureFixtureValidationResult {
  const missingRequiredKeys = findMissingFutureFixtureRequiredKeys(shape, fixture);
  const presentForbiddenKeys = findPresentFutureFixtureForbiddenKeys(shape, fixture);
  const importResultMatches = plannedImportResult === shape.expectedImportResult;

  return {
    fixtureId: shape.id,
    expectedImportResult: shape.expectedImportResult,
    status: missingRequiredKeys.length === 0 && presentForbiddenKeys.length === 0 && importResultMatches ? 'pass' : 'fail',
    missingRequiredKeys,
    presentForbiddenKeys,
    importResultMatches,
    mode: 'test-only'
  };
}

export function findFutureTestOnlyFixtureShape(
  fixtureId: string,
  draft = futurePlanFormatDraft
): FutureTestOnlyFixtureShape | undefined {
  return draft.testOnlyFixtureShapes.find((shape) => shape.id === fixtureId);
}

export function validateFutureFixtureShapeBatch(
  fixturesById: Partial<Record<FutureTestOnlyFixtureShape['id'], Record<string, unknown>>>,
  plannedImportResultsById: Partial<Record<FutureTestOnlyFixtureShape['id'], FutureTestOnlyFixtureShape['expectedImportResult']>> = {},
  draft = futurePlanFormatDraft
): FutureFixtureValidationSummary {
  const results = draft.testOnlyFixtureShapes.map((shape) =>
    validateFutureFixtureShape(shape, fixturesById[shape.id] || {}, plannedImportResultsById[shape.id] || shape.expectedImportResult)
  );
  const passed = results.filter((result) => result.status === 'pass').length;

  return {
    status: passed === results.length ? 'pass' : 'fail',
    total: results.length,
    passed,
    failed: results.length - passed,
    results,
    mode: 'test-only'
  };
}

export function validateFutureFixtureSamples(
  samples = futureTestOnlyFixtureSamples,
  draft = futurePlanFormatDraft
): FutureFixtureValidationSummary {
  const fixturesById = Object.fromEntries(samples.map((sample) => [sample.fixtureId, sample.fixture]));
  const plannedImportResultsById = Object.fromEntries(samples.map((sample) => [sample.fixtureId, sample.plannedImportResult]));

  return validateFutureFixtureShapeBatch(fixturesById, plannedImportResultsById, draft);
}

export function futureFixtureSampleCoverageRows(
  samples = futureTestOnlyFixtureSamples,
  draft = futurePlanFormatDraft
): FutureFixtureSampleCoverageRow[] {
  return samples.map((sample) => {
    const shape = findFutureTestOnlyFixtureShape(sample.fixtureId, draft);
    const hasKnownShape = Boolean(shape);
    const importResultMatchesShape = shape?.expectedImportResult === sample.plannedImportResult;
    const isTestOnly = sample.mode === 'test-only';
    const hasGuardrails = sample.mustNotDo.length > 0;

    return {
      sampleId: sample.id,
      fixtureId: sample.fixtureId,
      status: hasKnownShape && importResultMatchesShape && isTestOnly && hasGuardrails ? 'pass' : 'fail',
      hasKnownShape,
      importResultMatchesShape,
      isTestOnly,
      hasGuardrails
    };
  });
}

export function futureRawPayloadSampleBlockExpectation(
  sample = futureRawPayloadFixtureSample,
  draft = futurePlanFormatDraft
): FutureRawPayloadSampleBlockExpectation {
  const rawRule = draft.importAcceptanceRules.find((rule) => rule.id === 'rawPayload' && rule.decision === 'block');
  const expectedMessage = draft.rawPayloadPolicy.message;
  const messageMatchesRule = rawRule?.message === expectedMessage;
  const messageMatchesPolicy = draft.importBlockExpectationChecks.some(
    (check) => check.blockedRuleId === 'rawPayload' && check.expectedMessage === expectedMessage
  );
  const preservesCurrentState = sample.mustNotDo.includes('change current plan state');
  const rejectsRawPlanFileTreatment = sample.mustNotDo.includes('treat raw payloads as plan files');

  return {
    sampleId: sample.id,
    status: messageMatchesRule && messageMatchesPolicy && preservesCurrentState && rejectsRawPlanFileTreatment ? 'pass' : 'fail',
    expectedMessage,
    messageMatchesRule,
    messageMatchesPolicy,
    preservesCurrentState,
    rejectsRawPlanFileTreatment
  };
}

export function futureFixtureExpectationCoverageRows(draft = futurePlanFormatDraft): FutureFixtureExpectationCoverageRow[] {
  const fixtureIds = new Set(draft.testOnlyFixtureShapes.map((shape) => shape.id));

  return draft.fixtureExpectationHardening.map((expectation) => {
    const hasKnownFixtureShape = fixtureIds.has(expectation.fixtureId);
    const hasProofRequirements = expectation.mustProve.length > 0;
    const hasAvoidanceRequirements = expectation.mustAvoid.length > 0;

    return {
      expectationId: expectation.id,
      fixtureId: expectation.fixtureId,
      status: hasKnownFixtureShape && hasProofRequirements && hasAvoidanceRequirements ? 'pass' : 'fail',
      hasKnownFixtureShape,
      hasProofRequirements,
      hasAvoidanceRequirements
    };
  });
}

export function futureImportBlockExpectationCoverageRows(draft = futurePlanFormatDraft): FutureImportBlockExpectationCoverageRow[] {
  return draft.importBlockExpectationChecks.map((check) => {
    const rule = draft.importAcceptanceRules.find((item) => item.id === check.blockedRuleId && item.decision === 'block');
    const hasMatchingRule = Boolean(rule);
    const messageMatchesRule = rule?.message === check.expectedMessage;
    const hasStatePreservation = check.mustPreserve.includes('current plan state');
    const hasAvoidanceRequirements = check.mustAvoid.length > 0;

    return {
      checkId: check.id,
      blockedRuleId: check.blockedRuleId,
      status: hasMatchingRule && messageMatchesRule && hasStatePreservation && hasAvoidanceRequirements ? 'pass' : 'fail',
      hasMatchingRule,
      messageMatchesRule,
      hasStatePreservation,
      hasAvoidanceRequirements
    };
  });
}

export function futureExampleRequirementIds(draft = futurePlanFormatDraft): string[] {
  return draft.freshExampleRequirements.map((requirement) => requirement.id);
}

export function futureBlockedImportRules(draft = futurePlanFormatDraft): FutureImportAcceptanceRule[] {
  return draft.importAcceptanceRules.filter((rule) => rule.decision === 'block');
}

export function futureAcceptedImportRuleIds(draft = futurePlanFormatDraft): string[] {
  return draft.importAcceptanceRules.filter((rule) => rule.decision === 'accept').map((rule) => rule.id);
}

export function futureImplementationStepIds(draft = futurePlanFormatDraft): string[] {
  return draft.implementationChecklist.map((step) => step.id);
}

export function futureRollbackReleaseStopItems(draft = futurePlanFormatDraft): FutureRollbackReleaseItem[] {
  return draft.rollbackReleaseChecklist.filter((item) => item.stopIfMissing);
}

export function futureSchemaResetDecisionReadinessIds(draft = futurePlanFormatDraft): string[] {
  return draft.schemaResetDecisionReadiness.map((item) => item.id);
}

export function futureTestOnlyFixtureShapeIds(draft = futurePlanFormatDraft): string[] {
  return draft.testOnlyFixtureShapes.map((shape) => shape.id);
}

export function futureFixtureExpectationHardeningIds(draft = futurePlanFormatDraft): string[] {
  return draft.fixtureExpectationHardening.map((item) => item.id);
}

export function futureImportBlockExpectationCheckIds(draft = futurePlanFormatDraft): string[] {
  return draft.importBlockExpectationChecks.map((check) => check.id);
}

export function futureFixtureValidationHelperIds(draft = futurePlanFormatDraft): string[] {
  return draft.fixtureValidationHelpers.map((helper) => helper.id);
}

export function futureCapacityStatusIds(draft = futurePlanFormatDraft): string[] {
  return draft.capacityStatusReadiness.map((status) => status.id);
}

export function futureCapacitySelectorInputIds(draft = futurePlanFormatDraft): string[] {
  return draft.capacitySelectorReadiness.inputs.map((input) => input.id);
}

export function futureCapacitySelectorOutputIds(draft = futurePlanFormatDraft): string[] {
  return draft.capacitySelectorReadiness.outputs.map((output) => output.id);
}

export function futureCapacitySelectorStatusMappingIds(draft = futurePlanFormatDraft): string[] {
  return draft.capacitySelectorReadiness.statusMappings.map((mapping) => mapping.statusId);
}

export function futureCapacityReviewFactorIds(draft = futurePlanFormatDraft): string[] {
  return draft.capacitySelectorReadiness.reviewFactors.map((factor) => factor.id);
}

export function futureCapacityGapOptionIds(draft = futurePlanFormatDraft): FutureCapacityGapOption['id'][] {
  return draft.capacitySelectorReadiness.gapOptions.map((option) => option.id);
}

export function selectFutureCapacityStatusPreview(
  input: FutureCapacitySelectorPreviewInput,
  draft = futurePlanFormatDraft
): FutureCapacitySelectorPreviewResult {
  const missingInputs: string[] = [];
  const minimum = input.minimumMonthlyExpensesExMortgage;
  const mortgage = input.mortgageMonthlyPayment;
  const capacity = input.projectedMonthlyAfterTaxCapacity;

  if (minimum === null || minimum === undefined || minimum <= 0) {
    missingInputs.push('minimumMonthlyExpensesExMortgage');
  }
  if (mortgage === null || mortgage === undefined || mortgage < 0) {
    missingInputs.push('mortgageMonthlyPayment');
  }
  if (capacity === null || capacity === undefined || capacity < 0) {
    missingInputs.push('projectedMonthlyAfterTaxCapacity');
  }

  const monthlyFloor = missingInputs.includes('minimumMonthlyExpensesExMortgage')
    ? null
    : Number(minimum) + (missingInputs.includes('mortgageMonthlyPayment') ? 0 : Number(mortgage));
  const monthlyCapacity = missingInputs.includes('projectedMonthlyAfterTaxCapacity') ? null : Number(capacity);
  const monthlyRoom = monthlyFloor === null || monthlyCapacity === null ? null : monthlyCapacity - monthlyFloor;
  const tightThreshold = input.roomAboveFloorTightThreshold ?? 500;

  let statusId: FutureCapacityStatusId = 'covered';
  if (missingInputs.length > 0) {
    statusId = 'cannotTell';
  } else if ((monthlyRoom ?? 0) < 0 || input.firstShortfallYear) {
    statusId = 'gap';
  } else if ((monthlyRoom ?? 0) <= tightThreshold || (input.sensitivityFlags || []).length > 0) {
    statusId = 'tight';
  }

  const reviewPrompt =
    draft.capacitySelectorReadiness.statusMappings.find((mapping) => mapping.statusId === statusId)?.reviewPrompt || '';

  return {
    statusId,
    monthlyFloor,
    monthlyCapacity,
    monthlyRoom,
    reviewPrompt,
    gapOptionIds: statusId === 'gap' ? futureCapacityGapOptionIds(draft) : [],
    missingInputs,
    mode: 'planning-only'
  };
}

export function futureCapacitySelectorBoundaryRows(draft = futurePlanFormatDraft): FutureCapacitySelectorBoundaryRow[] {
  const outputsRuntimeOnly = draft.capacitySelectorReadiness.outputs.every((output) => output.status === 'derived-runtime');
  const noSavedOutput =
    draft.capacitySelectorReadiness.guardrails.includes('The selector must not write to saved plans.') &&
    draft.capacitySelectorReadiness.outputs.every((output) => output.mustAvoid.includes('saved output field') || output.id !== 'confidentMonthlyAfterTaxSpend');
  const gapOptionsNeutral = draft.capacitySelectorReadiness.gapOptions.every(
    (option) => option.mustStay === 'option-to-compare' && option.mustNotBecome.length > 0
  );
  const noAccountInstructions = draft.capacitySelectorReadiness.reviewFactors
    .find((factor) => factor.id === 'fundingTrace')
    ?.mustNotBecome.includes('annual account instruction');

  return [
    {
      id: 'runtimeOnly',
      status: outputsRuntimeOnly ? 'pass' : 'fail',
      detail: 'Capacity selector outputs remain runtime-derived.'
    },
    {
      id: 'noSavedOutput',
      status: noSavedOutput ? 'pass' : 'fail',
      detail: 'Capacity selector planning does not add saved output fields.'
    },
    {
      id: 'gapOptionsNeutral',
      status: gapOptionsNeutral ? 'pass' : 'fail',
      detail: 'Gap options stay as neutral options to compare.'
    },
    {
      id: 'noAccountInstructions',
      status: noAccountInstructions ? 'pass' : 'fail',
      detail: 'Funding trace remains a review factor, not annual account instructions.'
    }
  ];
}

export function futureCapacitySelectorScenarioIds(scenarios = futureCapacitySelectorScenarios): string[] {
  return scenarios.map((scenario) => scenario.id);
}

export function validateFutureCapacitySelectorScenarios(
  scenarios = futureCapacitySelectorScenarios,
  draft = futurePlanFormatDraft
): Array<{ id: string; status: 'pass' | 'fail'; expectedStatusId: FutureCapacityStatusId; actualStatusId: FutureCapacityStatusId }> {
  return scenarios.map((scenario) => {
    const actualStatusId = selectFutureCapacityStatusPreview(scenario.input, draft).statusId;

    return {
      id: scenario.id,
      status: actualStatusId === scenario.expectedStatusId ? 'pass' : 'fail',
      expectedStatusId: scenario.expectedStatusId,
      actualStatusId
    };
  });
}

export function futureExampleDataDraftIds(draft = futurePlanFormatDraft): string[] {
  return draft.futureExampleDataDrafts.map((example) => example.id);
}

export function validateFutureExampleCapacityStatusDrafts(
  draft = futurePlanFormatDraft
): Array<{ id: FutureExampleDataDraft['id']; status: 'pass' | 'fail'; expectedStatusId: FutureCapacityStatusId; actualStatusId: FutureCapacityStatusId }> {
  return draft.futureExampleDataDrafts.map((example) => {
    const actualStatusId = selectFutureCapacityStatusPreview(
      {
        minimumMonthlyExpensesExMortgage: example.minimumMonthlyExpensesExMortgage,
        mortgageMonthlyPayment: example.mortgageMonthlyPayment,
        projectedMonthlyAfterTaxCapacity: example.projectedMonthlyAfterTaxCapacity,
        sensitivityFlags: example.expectedCapacityStatus === 'tight' ? ['survivor'] : []
      },
      draft
    ).statusId;

    return {
      id: example.id,
      status: actualStatusId === example.expectedCapacityStatus ? 'pass' : 'fail',
      expectedStatusId: example.expectedCapacityStatus,
      actualStatusId
    };
  });
}

export function futureExampleDataBoundaryRows(draft = futurePlanFormatDraft): FutureExampleDataBoundaryRow[] {
  return draft.futureExampleDataDrafts.map((example) => {
    const isPlanningOnly = example.status === 'planning-only';
    const hasSyntheticHousehold = example.household.length > 0 && !example.household.toLowerCase().includes('tester');
    const avoidsSavedAnswers =
      example.mustAvoid.includes('safe-spend language') ||
      example.mustAvoid.includes('guaranteed-room language') ||
      example.mustAvoid.includes('false certainty that one option fixes the plan');
    const avoidsAccountInstructions = example.mustAvoid.some((item) => item.includes('account withdrawal instructions'));

    return {
      id: example.id,
      status: isPlanningOnly && hasSyntheticHousehold && avoidsSavedAnswers && avoidsAccountInstructions ? 'pass' : 'fail',
      isPlanningOnly,
      hasSyntheticHousehold,
      avoidsSavedAnswers,
      avoidsAccountInstructions
    };
  });
}

export function futureExampleRebuildAlignmentRows(draft = futurePlanFormatDraft): FutureExampleRebuildAlignmentRow[] {
  const exampleIds = new Set(draft.futureExampleDataDrafts.map((example) => example.id));

  return draft.freshExampleRebuildPlan.map((step) => {
    const hasExampleDraft = step.stage === 'fixture-later' || step.stage === 'smoke-later' || exampleIds.has(step.exampleId);
    const isPlanningStage = step.stage === 'draft-values' || step.stage === 'fixture-later' || step.stage === 'smoke-later';
    const hasProofs = step.mustProve.length > 0;
    const hasAvoidance = step.mustAvoid.length > 0;

    return {
      id: step.id,
      exampleId: step.exampleId,
      status: hasExampleDraft && isPlanningStage && hasProofs && hasAvoidance ? 'pass' : 'fail',
      hasExampleDraft,
      isPlanningStage,
      hasProofs,
      hasAvoidance
    };
  });
}

export function futureFreshExampleRebuildPlanIds(draft = futurePlanFormatDraft): string[] {
  return draft.freshExampleRebuildPlan.map((item) => item.id);
}

export function futureFundingTraceAccountGroupIds(draft = futurePlanFormatDraft): string[] {
  return draft.fundingTraceReadiness.accountGroups.map((group) => group.id);
}

export function futureFundingTraceFirstYearRowIds(draft = futurePlanFormatDraft): string[] {
  return draft.fundingTraceReadiness.firstYearTraceRows.map((row) => row.id);
}

export function futureFundingTraceExampleSampleIds(draft = futurePlanFormatDraft): FutureExampleDataDraft['id'][] {
  return draft.fundingTraceReadiness.exampleTraceSamples.map((sample) => sample.id);
}

export function futureFundingTraceSampleCoverageRows(draft = futurePlanFormatDraft): FutureFundingTraceSampleCoverageRow[] {
  const exampleById = new Map(draft.futureExampleDataDrafts.map((example) => [example.id, example]));
  const knownRows = new Set(draft.fundingTraceReadiness.firstYearTraceRows.map((row) => row.id));

  return draft.fundingTraceReadiness.exampleTraceSamples.map((sample) => {
    const example = exampleById.get(sample.id);
    const hasExampleDraft = Boolean(example);
    const statusMatchesExample = example?.expectedCapacityStatus === sample.expectedStatusId;
    const hasKnownRows = sample.rowIds.every((rowId) => knownRows.has(rowId));
    const keepsTaxVisible = sample.rowIds.includes('estimatedTax') && sample.mustShow.some((item) => item.includes('tax'));
    const avoidsInstructions = sample.mustAvoid.some((item) => item.includes('instruction') || item.includes('recommendation'));

    return {
      id: sample.id,
      status: hasExampleDraft && statusMatchesExample && hasKnownRows && keepsTaxVisible && avoidsInstructions ? 'pass' : 'fail',
      hasExampleDraft,
      statusMatchesExample,
      hasKnownRows,
      keepsTaxVisible,
      avoidsInstructions
    };
  });
}

export function futureFundingTraceBoundaryRows(draft = futurePlanFormatDraft): FutureFundingTraceBoundaryRow[] {
  const guardrails = draft.fundingTraceReadiness.guardrails;
  const instructionGuardrails = draft.fundingTraceReadiness.instructionGuardrails;
  const runtimeOnly = draft.fundingTraceReadiness.status === 'planning-only' && guardrails.includes('Funding trace must stay runtime-only in this planning package.');
  const noAnnualSequencing =
    guardrails.includes('Funding trace must not become annual account-level sequencing.') &&
    instructionGuardrails.some((guardrail) => guardrail.id === 'noAnnualRows');
  const noSavedTrace = instructionGuardrails.some(
    (guardrail) => guardrail.id === 'noSavedTrace' && guardrail.mustAvoid.includes('saved output field')
  );
  const reviewLanguage = instructionGuardrails.some(
    (guardrail) => guardrail.id === 'reviewOnlyLanguage' && guardrail.mustAvoid.includes('advice-like certainty')
  );
  const taxVisible =
    guardrails.includes('Funding trace must keep tax caveats visible.') &&
    draft.fundingTraceReadiness.firstYearTraceRows.some((row) => row.id === 'estimatedTax');

  return [
    { id: 'runtimeOnly', status: runtimeOnly ? 'pass' : 'fail', detail: 'Funding trace remains planning-only and runtime-only.' },
    { id: 'noAnnualSequencing', status: noAnnualSequencing ? 'pass' : 'fail', detail: 'Funding trace does not create annual account rows.' },
    { id: 'noSavedTrace', status: noSavedTrace ? 'pass' : 'fail', detail: 'Funding trace output is not saved into plan files.' },
    { id: 'reviewLanguage', status: reviewLanguage ? 'pass' : 'fail', detail: 'Funding trace language remains review-oriented.' },
    { id: 'taxVisible', status: taxVisible ? 'pass' : 'fail', detail: 'Estimated tax stays visible in the first-year trace plan.' }
  ];
}

export function futureFundingTraceCaveatCoverageRows(draft = futurePlanFormatDraft): FutureFundingTraceCaveatCoverageRow[] {
  const hasSurvivorCaveat = draft.fundingTraceReadiness.survivorEstateCaveats.some((caveat) => caveat.id === 'survivorIncomeChange');
  const hasEstateCaveat = draft.fundingTraceReadiness.survivorEstateCaveats.some((caveat) => caveat.id === 'estateIntentTradeoff');
  const hasGapCaveat = draft.fundingTraceReadiness.copyBoundaries.some((boundary) => boundary.id === 'gapQualifier');

  return draft.futureExampleDataDrafts.map((example) => {
    const needsSurvivorCaveat = example.id === 'pensionCoupleSurvivor';
    const needsEstateCaveat = example.id === 'estateHeavyRoom';
    const needsGapCaveat = example.expectedCapacityStatus === 'gap';

    return {
      id: example.id,
      status:
        (!needsSurvivorCaveat || hasSurvivorCaveat) &&
        (!needsEstateCaveat || hasEstateCaveat) &&
        (!needsGapCaveat || hasGapCaveat)
          ? 'pass'
          : 'fail',
      needsSurvivorCaveat,
      hasSurvivorCaveat,
      needsEstateCaveat,
      hasEstateCaveat,
      needsGapCaveat,
      hasGapCaveat
    };
  });
}

export function futureFundingTraceCloseoutRows(draft = futurePlanFormatDraft): FutureFundingTraceCloseoutRow[] {
  const planningOnly = draft.fundingTraceReadiness.status === 'planning-only';
  const runtimeOnly = draft.fundingTraceReadiness.guardrails.includes('Funding trace must stay runtime-only in this planning package.');
  const schemaUnchanged = draft.boundaries.includes('Do not add account optimizer outputs to saved plan files.');
  const examplesDraftOnly =
    draft.futureExampleDataDrafts.length === draft.fundingTraceReadiness.exampleTraceSamples.length &&
    draft.futureExampleDataDrafts.every((example) =>
      draft.freshExampleRebuildPlan.some((step) => step.exampleId === example.id && step.stage === 'draft-values')
    );
  const decisionGateRequired = draft.fundingTraceReadiness.decisionGate.every((gate) => gate.stopIfMissing);

  return [
    { id: 'planningOnly', status: planningOnly ? 'pass' : 'fail', detail: 'Funding trace readiness remains a planning artifact.' },
    { id: 'runtimeOnly', status: runtimeOnly ? 'pass' : 'fail', detail: 'Funding trace remains a future runtime concept, not saved input.' },
    { id: 'schemaUnchanged', status: schemaUnchanged ? 'pass' : 'fail', detail: 'Saved plan and engine output schemas remain unchanged.' },
    { id: 'examplesDraftOnly', status: examplesDraftOnly ? 'pass' : 'fail', detail: 'Future examples are drafted for later rebuild, not replacing current examples.' },
    { id: 'decisionGateRequired', status: decisionGateRequired ? 'pass' : 'fail', detail: 'Runtime trace work remains blocked behind explicit decision gates.' }
  ];
}

export function futureFundingTraceTaxCaveatIds(draft = futurePlanFormatDraft): string[] {
  return draft.fundingTraceReadiness.taxCaveats.map((caveat) => caveat.id);
}

export function futureFundingTraceReconciliationRuleIds(draft = futurePlanFormatDraft): string[] {
  return draft.fundingTraceReadiness.reconciliationRules.map((rule) => rule.id);
}

export function futureFundingTraceCopyBoundaryIds(draft = futurePlanFormatDraft): string[] {
  return draft.fundingTraceReadiness.copyBoundaries.map((boundary) => boundary.id);
}

export function futureFundingTraceSurvivorEstateCaveatIds(draft = futurePlanFormatDraft): string[] {
  return draft.fundingTraceReadiness.survivorEstateCaveats.map((caveat) => caveat.id);
}

export function futureFundingTraceCashAndOneOffHandlingIds(draft = futurePlanFormatDraft): string[] {
  return draft.fundingTraceReadiness.cashAndOneOffHandling.map((item) => item.id);
}

export function futureFundingTraceInstructionGuardrailIds(draft = futurePlanFormatDraft): string[] {
  return draft.fundingTraceReadiness.instructionGuardrails.map((guardrail) => guardrail.id);
}

export function futureFundingTraceDecisionGateIds(draft = futurePlanFormatDraft): string[] {
  return draft.fundingTraceReadiness.decisionGate.map((gate) => gate.id);
}

export function futureOptimizerContractItemIds(draft = futurePlanFormatDraft): string[] {
  return draft.optimizerContractReadiness.map((item) => item.id);
}

export function futureFixtureSpecificationIds(draft = futurePlanFormatDraft): string[] {
  return draft.fixtureSpecifications.map((fixture) => fixture.id);
}

export function futureOptimizerReadinessIds(draft = futurePlanFormatDraft): string[] {
  return draft.accountOptimizerReadiness.map((item) => item.id);
}
