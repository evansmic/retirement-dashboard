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
  testOnlyFixtureShapes: FutureTestOnlyFixtureShape[];
  optimizerContractReadiness: FutureOptimizerContractItem[];
  fixtureSpecifications: FutureFixtureSpecification[];
  accountOptimizerReadiness: FutureAccountOptimizerReadinessItem[];
  importAcceptanceRules: FutureImportAcceptanceRule[];
  rawPayloadPolicy: FutureRawPayloadPolicy;
  fixtureValidationHelpers: FutureFixtureValidationHelper[];
  capacityStatusReadiness: FutureCapacityStatusReadiness[];
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

export type FutureTestOnlyFixtureShape = {
  id: string;
  intent: 'accepted-new-format' | 'blocked-old-preview' | 'blocked-future-format';
  wrapper: 'future-plan-file' | 'legacy-preview-payload' | 'unsupported-future-file';
  requiredKeys: string[];
  forbiddenKeys: string[];
  expectedImportResult: 'accept' | 'block';
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

export type FutureExampleRequirement = {
  id: string;
  label: string;
  purpose: string;
  mustInclude: string[];
  mustAvoid: string[];
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

export function futureTestOnlyFixtureShapeIds(draft = futurePlanFormatDraft): string[] {
  return draft.testOnlyFixtureShapes.map((shape) => shape.id);
}

export function futureFixtureValidationHelperIds(draft = futurePlanFormatDraft): string[] {
  return draft.fixtureValidationHelpers.map((helper) => helper.id);
}

export function futureCapacityStatusIds(draft = futurePlanFormatDraft): string[] {
  return draft.capacityStatusReadiness.map((status) => status.id);
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
