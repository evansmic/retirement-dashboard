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
  importAcceptanceRules: FutureImportAcceptanceRule[];
  sections: FuturePlanFormatSection[];
  freshExampleRequirements: FutureExampleRequirement[];
  boundaries: string[];
};

export type FutureImportAcceptanceRule = {
  id: string;
  decision: 'accept' | 'block' | 'defer';
  appliesTo: string;
  message?: string;
  reason: string;
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
      decision: 'defer',
      appliesTo: 'Raw unwrapped JSON payloads',
      reason: 'The reset should decide whether only wrapped local plan files are accepted.'
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
