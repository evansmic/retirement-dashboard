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
  intent: 'accepted-new-format' | 'blocked-old-preview' | 'blocked-future-format';
  wrapper: 'future-plan-file' | 'legacy-preview-payload' | 'unsupported-future-file';
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

export type FutureCapacityStatusReadiness = {
  id: string;
  label: string;
  meaning: string;
  showWhen: string[];
  mustAvoid: string[];
};

export type FutureCapacitySelectorReadiness = {
  status: 'planning-only';
  inputs: FutureCapacitySelectorInput[];
  outputs: FutureCapacitySelectorOutput[];
  statusMappings: FutureCapacityStatusMapping[];
  reviewFactors: FutureCapacityReviewFactor[];
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
  statusId: 'covered' | 'tight' | 'gap' | 'cannotTell';
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
      fixtureId: 'legacyPreviewDesiredSpendPayload',
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
      earlySpendingChangeAge: 74,
      laterSpendingChangeAge: 84,
      expectedCapacityStatus: 'gap',
      reviewFocus: ['gap options are practical', 'work-longer and downsize comparisons are not pushy', 'tax review is visible without advice'],
      mustAvoid: ['single-option pressure', 'automatic recommendation to cut spending', 'false certainty that one option fixes the plan']
    },
    {
      id: 'pensionCoupleSurvivor',
      label: 'DB pension couple with survivor sensitivity',
      status: 'planning-only',
      household: 'Couple with one DB pension, survivor continuation risk, CPP/OAS income, and enough assets to make the first monthly answer look comfortable.',
      minimumMonthlyExpensesExMortgage: 5400,
      mortgageMonthlyPayment: 0,
      earlySpendingChangeAge: 76,
      laterSpendingChangeAge: 86,
      expectedCapacityStatus: 'tight',
      reviewFocus: ['survivor resilience is visible', 'DB pension continuation is easy to review', 'monthly capacity does not hide couple risk'],
      mustAvoid: ['hiding survivor impact behind one number', 'survivor recommendation', 'pension advice']
    },
    {
      id: 'estateHeavyRoom',
      label: 'Estate-heavy plan with room above the floor',
      status: 'planning-only',
      household: 'Mortgage-free couple with significant non-registered and TFSA assets, an explicit estate intent, and apparent room above the minimum floor.',
      minimumMonthlyExpensesExMortgage: 7000,
      mortgageMonthlyPayment: 0,
      earlySpendingChangeAge: 77,
      laterSpendingChangeAge: 87,
      expectedCapacityStatus: 'covered',
      reviewFocus: ['estate trade-off is visible', 'room above floor is caveated', 'tax and spending path caveats remain prominent'],
      mustAvoid: ['permission to spend more', 'guaranteed-room language', 'estate recommendation']
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

export function flattenFuturePlanFormatFields(draft = futurePlanFormatDraft): FuturePlanFormatField[] {
  return draft.sections.flatMap((section) => section.fields);
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

export function futureExampleDataDraftIds(draft = futurePlanFormatDraft): string[] {
  return draft.futureExampleDataDrafts.map((example) => example.id);
}

export function futureFreshExampleRebuildPlanIds(draft = futurePlanFormatDraft): string[] {
  return draft.freshExampleRebuildPlan.map((item) => item.id);
}

export function futureFundingTraceAccountGroupIds(draft = futurePlanFormatDraft): string[] {
  return draft.fundingTraceReadiness.accountGroups.map((group) => group.id);
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
