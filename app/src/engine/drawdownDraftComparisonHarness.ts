import type { TaxAwareDrawdownDraftRow } from './resultSelectors';

export type SyntheticDrawdownMetrics = {
  fundedYears: number;
  firstShortfallYear: number | null;
  lifetimeTax: number;
  peakTax: number;
  oasRecoveryTax: number;
  projectedMoneyLeft: number;
};

export type SyntheticDrawdownDraftComparison = {
  status: 'reviewOnly' | 'blocked';
  draftId: TaxAwareDrawdownDraftRow['id'];
  fundedYearsDelta: number;
  lifetimeTaxDelta: number;
  peakTaxDelta: number;
  oasRecoveryTaxDelta: number;
  projectedMoneyLeftDelta: number;
  explanation: string;
  reviewNote: string;
  disposition: 'testHarnessOnly';
};

export function compareSyntheticDrawdownDraft({
  draft,
  baseline,
  candidate
}: {
  draft: TaxAwareDrawdownDraftRow;
  baseline: SyntheticDrawdownMetrics;
  candidate: SyntheticDrawdownMetrics;
}): SyntheticDrawdownDraftComparison {
  if (draft.status === 'blocked') {
    return {
      status: 'blocked',
      draftId: draft.id,
      fundedYearsDelta: 0,
      lifetimeTaxDelta: 0,
      peakTaxDelta: 0,
      oasRecoveryTaxDelta: 0,
      projectedMoneyLeftDelta: 0,
      explanation: 'The mocked comparison is blocked because the draft row is not ready for future review.',
      reviewNote: 'Synthetic harness only. It is not reachable from the product UI and does not change saved plan data.',
      disposition: 'testHarnessOnly'
    };
  }

  const fundedYearsDelta = candidate.fundedYears - baseline.fundedYears;
  const lifetimeTaxDelta = candidate.lifetimeTax - baseline.lifetimeTax;
  const peakTaxDelta = candidate.peakTax - baseline.peakTax;
  const oasRecoveryTaxDelta = candidate.oasRecoveryTax - baseline.oasRecoveryTax;
  const projectedMoneyLeftDelta = candidate.projectedMoneyLeft - baseline.projectedMoneyLeft;
  const shortfallRepair =
    baseline.firstShortfallYear !== null && (candidate.firstShortfallYear === null || candidate.firstShortfallYear > baseline.firstShortfallYear);

  return {
    status: 'reviewOnly',
    draftId: draft.id,
    fundedYearsDelta,
    lifetimeTaxDelta,
    peakTaxDelta,
    oasRecoveryTaxDelta,
    projectedMoneyLeftDelta,
    explanation: shortfallRepair
      ? 'The mocked candidate repairs or delays a visible shortfall in the synthetic comparison.'
      : 'The mocked candidate is compared against baseline metrics for evidence only.',
    reviewNote: 'Synthetic harness only. It scores a mocked payload shape without simulating annual overrides or changing the current withdrawal order.',
    disposition: 'testHarnessOnly'
  };
}
