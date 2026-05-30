import { describe, expect, it } from 'vitest';
import { SCHEMA_VERSION } from '../types/plan';
import { planImportResetDecision } from './planImportPolicy';

describe('plan import reset decision', () => {
  it('records the future old-plan block without changing the current schema', () => {
    expect(planImportResetDecision.status).toBe('planned-reset');
    expect(planImportResetDecision.currentAcceptedSchemaVersion).toBe(SCHEMA_VERSION);
    expect(planImportResetDecision.futureImportBehavior).toBe('block-older-preview-files');
    expect(planImportResetDecision.message).toBe('This plan was created with an earlier version. Start a fresh plan to use the current features.');
  });

  it('keeps the package scoped away from migration and optimizer output', () => {
    expect(planImportResetDecision.rationale.join(' ')).toContain('silently misstate');
    expect(planImportResetDecision.allowedNow.join(' ')).toContain('Keep current schema v2 plan files working');
    expect(planImportResetDecision.notYetImplemented).toEqual(
      expect.arrayContaining([
        'No saved plan schema change is included in this package.',
        'No import rejection behavior changes until the new saved format is scoped.',
        'No engine output schema or account optimizer output is added here.'
      ])
    );
  });
});
