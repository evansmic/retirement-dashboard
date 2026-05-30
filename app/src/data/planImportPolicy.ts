export type PlanImportResetDecision = {
  status: 'planned-reset';
  currentAcceptedSchemaVersion: 2;
  futureImportBehavior: 'block-older-preview-files';
  message: string;
  rationale: string[];
  allowedNow: string[];
  notYetImplemented: string[];
};

export const planImportResetDecision: PlanImportResetDecision = {
  status: 'planned-reset',
  currentAcceptedSchemaVersion: 2,
  futureImportBehavior: 'block-older-preview-files',
  message: 'This plan was created with an earlier version. Start a fresh plan to use the current features.',
  rationale: [
    'The product is still in tester-only preview, so old test files can be discarded.',
    'Migrating desired-spending fields into minimum expenses could silently misstate what the household needs.',
    'Fresh example plans are clearer than carrying old compatibility into the capacity-first model.'
  ],
  allowedNow: [
    'Keep current schema v2 plan files working until the reset is explicitly implemented.',
    'Create future examples directly in the new format.',
    'Use plain blocking copy when older preview files are no longer accepted.'
  ],
  notYetImplemented: [
    'No saved plan schema change is included in this package.',
    'No import rejection behavior changes until the new saved format is scoped.',
    'No engine output schema or account optimizer output is added here.'
  ]
};
