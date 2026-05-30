import { describe, expect, it } from 'vitest';
import { SCHEMA_VERSION } from '../types/plan';
import { planImportResetDecision } from './planImportPolicy';

describe('plan import reset decision', () => {
  it('records the clean reset import wiring without changing the current runtime schema', () => {
    expect(planImportResetDecision.status).toBe('import-wiring-started');
    expect(planImportResetDecision.currentAcceptedSchemaVersion).toBe(SCHEMA_VERSION);
    expect(planImportResetDecision.futureImportBehavior).toBe('accept-wrapped-clean-reset-and-block-unsupported');
    expect(planImportResetDecision.message).toBe('This plan was created with an earlier version. Start a fresh plan to use the current features.');
  });

  it('keeps the package scoped away from migration and optimizer output', () => {
    expect(planImportResetDecision.rationale.join(' ')).toContain('silently misstate');
    expect(planImportResetDecision.allowedNow.join(' ')).toContain('Accept wrapped clean reset plan files');
    expect(planImportResetDecision.notYetImplemented).toEqual(
      expect.arrayContaining([
        'Save still writes the current editable v2 plan file until the save contract is approved.',
        'Current bundled examples are not replaced in this package.',
        'No engine output schema or account optimizer output is added here.'
      ])
    );
  });
});
