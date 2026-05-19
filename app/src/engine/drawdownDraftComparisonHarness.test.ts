import { describe, expect, it } from 'vitest';
import { compareQueuedSandboxDraft, compareSyntheticDrawdownDraft } from './drawdownDraftComparisonHarness';
import type { TaxAwareDrawdownDraftRow, TaxAwareDrawdownSandboxSummary } from './resultSelectors';

const draft: TaxAwareDrawdownDraftRow = {
  id: 'lowTaxRegisteredDraft',
  label: 'Low-tax registered check',
  status: 'usableForFutureReview',
  year: 2028,
  accountBucket: 'registered',
  direction: 'testEarlier',
  amountBand: '$10k-$25k review band',
  evidenceSource: 'lowTaxWindow',
  detail: 'A later review could test a modest registered withdrawal band.',
  safetyNotes: ['This is a review draft only.'],
  disposition: 'draftOnly'
};

const sandbox: TaxAwareDrawdownSandboxSummary = {
  status: 'readyToCompareLater',
  headline: 'One future sandbox check is ready to hold for later comparison.',
  detail: 'This identifies the first draft shape to compare later.',
  rows: [
    {
      id: 'firstFutureSandboxCheck',
      label: 'First future sandbox check',
      status: 'queuedForFutureReview',
      draftId: 'lowTaxRegisteredDraft',
      baselineSignal: 'Low-tax registered check: $10k-$25k review band',
      compareWouldNeed: 'Mocked output only.',
      holdReason: 'Ready for later comparison.',
      disposition: 'sandboxPlanningOnly'
    }
  ],
  reviewNote: 'No sandbox comparison is run here.'
};

const baseline = {
  fundedYears: 20,
  firstShortfallYear: 2048,
  lifetimeTax: 420000,
  peakTax: 48000,
  oasRecoveryTax: 8000,
  projectedMoneyLeft: 180000
};

const candidate = {
  fundedYears: 22,
  firstShortfallYear: null,
  lifetimeTax: 405000,
  peakTax: 43000,
  oasRecoveryTax: 5000,
  projectedMoneyLeft: 175000
};

describe('synthetic drawdown draft comparison harness', () => {
  it('scores a mocked annual override payload without product execution language', () => {
    const comparison = compareSyntheticDrawdownDraft({
      draft,
      baseline,
      candidate
    });

    expect(comparison).toMatchObject({
      status: 'reviewOnly',
      draftId: 'lowTaxRegisteredDraft',
      fundedYearsDelta: 2,
      lifetimeTaxDelta: -15000,
      peakTaxDelta: -5000,
      oasRecoveryTaxDelta: -3000,
      projectedMoneyLeftDelta: -5000,
      disposition: 'testHarnessOnly'
    });
    expect(comparison.reviewNote).toContain('mocked payload shape');
    expect(comparison.reviewNote).toContain('without simulating annual overrides');
    expect(JSON.stringify(comparison).toLowerCase()).not.toContain('recommended withdrawal strategy');
    expect(JSON.stringify(comparison).toLowerCase()).not.toContain('optimal drawdown');
  });

  it('rejects blocked draft rows before scoring mocked output', () => {
    const comparison = compareSyntheticDrawdownDraft({
      draft: { ...draft, status: 'blocked' },
      baseline,
      candidate
    });

    expect(comparison).toMatchObject({
      status: 'blocked',
      fundedYearsDelta: 0,
      lifetimeTaxDelta: 0,
      disposition: 'testHarnessOnly'
    });
    expect(comparison.reviewNote).toContain('not reachable from the product UI');
  });

  it('compares only the queued sandbox draft with a valid mocked payload', () => {
    const comparison = compareQueuedSandboxDraft({
      sandbox,
      drafts: [draft],
      payload: {
        disposition: 'mockPayloadOnly',
        year: 2028,
        accountBucket: 'registered',
        amount: 15000
      },
      baseline,
      candidate
    });

    expect(comparison).toMatchObject({
      status: 'reviewOnly',
      sandboxStatus: 'readyToCompareLater',
      draftId: 'lowTaxRegisteredDraft',
      payloadAccepted: true,
      disposition: 'testHarnessOnly'
    });
    expect(comparison.comparison).toMatchObject({
      status: 'reviewOnly',
      lifetimeTaxDelta: -15000,
      disposition: 'testHarnessOnly'
    });
    expect(comparison.reviewNote).toContain('mocked outputs');
    expect(comparison.reviewNote).toContain('does not run annual withdrawal changes');
  });

  it('rejects sandbox comparisons when the gate is not queued', () => {
    const comparison = compareQueuedSandboxDraft({
      sandbox: { ...sandbox, status: 'needsInput', rows: [{ ...sandbox.rows[0], status: 'heldForInput' }] },
      drafts: [draft],
      payload: {
        disposition: 'mockPayloadOnly',
        year: 2028,
        accountBucket: 'registered',
        amount: 15000
      },
      baseline,
      candidate
    });

    expect(comparison).toMatchObject({
      status: 'notReady',
      payloadAccepted: false,
      comparison: null
    });
  });

  it('rejects invalid mocked payloads before scoring output', () => {
    const comparison = compareQueuedSandboxDraft({
      sandbox,
      drafts: [draft],
      payload: {
        disposition: 'mockPayloadOnly',
        year: 2028,
        accountBucket: 'registered',
        amount: -1
      },
      baseline,
      candidate
    });

    expect(comparison).toMatchObject({
      status: 'blocked',
      draftId: 'lowTaxRegisteredDraft',
      payloadAccepted: false,
      comparison: null
    });
    expect(comparison.reason).toContain('positive');
  });
});
