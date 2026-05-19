import { describe, expect, it } from 'vitest';
import { compareSyntheticDrawdownDraft } from './drawdownDraftComparisonHarness';
import type { TaxAwareDrawdownDraftRow } from './resultSelectors';

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

describe('synthetic drawdown draft comparison harness', () => {
  it('scores a mocked annual override payload without product execution language', () => {
    const comparison = compareSyntheticDrawdownDraft({
      draft,
      baseline: {
        fundedYears: 20,
        firstShortfallYear: 2048,
        lifetimeTax: 420000,
        peakTax: 48000,
        oasRecoveryTax: 8000,
        projectedMoneyLeft: 180000
      },
      candidate: {
        fundedYears: 22,
        firstShortfallYear: null,
        lifetimeTax: 405000,
        peakTax: 43000,
        oasRecoveryTax: 5000,
        projectedMoneyLeft: 175000
      }
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
      baseline: {
        fundedYears: 20,
        firstShortfallYear: 2048,
        lifetimeTax: 420000,
        peakTax: 48000,
        oasRecoveryTax: 8000,
        projectedMoneyLeft: 180000
      },
      candidate: {
        fundedYears: 25,
        firstShortfallYear: null,
        lifetimeTax: 390000,
        peakTax: 42000,
        oasRecoveryTax: 4000,
        projectedMoneyLeft: 220000
      }
    });

    expect(comparison).toMatchObject({
      status: 'blocked',
      fundedYearsDelta: 0,
      lifetimeTaxDelta: 0,
      disposition: 'testHarnessOnly'
    });
    expect(comparison.reviewNote).toContain('not reachable from the product UI');
  });
});
