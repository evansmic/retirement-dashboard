export type PlanImportResetDecision = {
  status: 'clean-save-import-active';
  currentAcceptedSchemaVersion: 2;
  futureImportBehavior: 'clean-files-only';
  message: string;
  rationale: string[];
  allowedNow: string[];
  notYetImplemented: string[];
};

export const planImportResetDecision: PlanImportResetDecision = {
  status: 'clean-save-import-active',
  currentAcceptedSchemaVersion: 2,
  futureImportBehavior: 'clean-files-only',
  message: 'This plan was created with an earlier version. Start a fresh plan to use the current features.',
  rationale: [
    'Tester legacy plans are retired before the clean schema becomes operational.',
    'Migrating desired-spending fields into minimum expenses could silently misstate what the household needs.',
    'Fresh plans are clearer than carrying old compatibility into the capacity-first model.'
  ],
  allowedNow: [
    'Save wrapped clean reset plan files.',
    'Accept wrapped clean reset plan files through the production validator.',
    'Use plain blocking copy for current v2, older preview, raw, and unsupported future files.'
  ],
  notYetImplemented: [
    'Current bundled examples are not replaced in this package.',
    'No engine output schema or account optimizer output is added here.'
  ]
};
