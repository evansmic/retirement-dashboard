export type PlanImportResetDecision = {
  status: 'import-wiring-started';
  currentAcceptedSchemaVersion: 2;
  futureImportBehavior: 'accept-wrapped-clean-reset-and-block-unsupported';
  message: string;
  rationale: string[];
  allowedNow: string[];
  notYetImplemented: string[];
};

export const planImportResetDecision: PlanImportResetDecision = {
  status: 'import-wiring-started',
  currentAcceptedSchemaVersion: 2,
  futureImportBehavior: 'accept-wrapped-clean-reset-and-block-unsupported',
  message: 'This plan was created with an earlier version. Start a fresh plan to use the current features.',
  rationale: [
    'The product is still in tester-only preview, so old test files can be discarded.',
    'Migrating desired-spending fields into minimum expenses could silently misstate what the household needs.',
    'Fresh example plans are clearer than carrying old compatibility into the capacity-first model.'
  ],
  allowedNow: [
    'Keep current wrapped schema v2 plan files working during the first wiring slice.',
    'Accept wrapped clean reset plan files through the production validator.',
    'Use plain blocking copy for older preview, raw, and unsupported future files.'
  ],
  notYetImplemented: [
    'Save still writes the current editable v2 plan file until the save contract is approved.',
    'Current bundled examples are not replaced in this package.',
    'No engine output schema or account optimizer output is added here.'
  ]
};
