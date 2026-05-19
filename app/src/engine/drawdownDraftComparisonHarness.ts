import type { TaxAwareDrawdownDraftRow, TaxAwareDrawdownSandboxSummary } from './resultSelectors';

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

export type SyntheticDrawdownOverridePayload = {
  disposition: 'mockPayloadOnly';
  year: number;
  accountBucket: 'registered' | 'tfsa' | 'nonRegistered' | 'cash';
  amount: number;
};

export type SyntheticDrawdownSandboxComparison = {
  status: 'reviewOnly' | 'blocked' | 'notReady';
  sandboxStatus: TaxAwareDrawdownSandboxSummary['status'];
  draftId: TaxAwareDrawdownDraftRow['id'] | null;
  payloadAccepted: boolean;
  comparison: SyntheticDrawdownDraftComparison | null;
  reason: string;
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

export function compareQueuedSandboxDraft({
  sandbox,
  drafts,
  payload,
  baseline,
  candidate
}: {
  sandbox: TaxAwareDrawdownSandboxSummary;
  drafts: TaxAwareDrawdownDraftRow[];
  payload: SyntheticDrawdownOverridePayload;
  baseline: SyntheticDrawdownMetrics;
  candidate: SyntheticDrawdownMetrics;
}): SyntheticDrawdownSandboxComparison {
  const queued = sandbox.rows.find((row) => row.status === 'queuedForFutureReview') || null;
  const draft = queued?.draftId ? drafts.find((row) => row.id === queued.draftId) || null : null;

  if (sandbox.status !== 'readyToCompareLater' || !queued || !draft) {
    return {
      status: sandbox.status === 'blocked' ? 'blocked' : 'notReady',
      sandboxStatus: sandbox.status,
      draftId: queued?.draftId || null,
      payloadAccepted: false,
      comparison: null,
      reason: 'The sandbox gate has not queued a draft for later comparison.',
      reviewNote: 'Synthetic harness only. No product calculation is run and no saved plan data changes.',
      disposition: 'testHarnessOnly'
    };
  }

  if (draft.status !== 'usableForFutureReview') {
    return {
      status: 'blocked',
      sandboxStatus: sandbox.status,
      draftId: draft.id,
      payloadAccepted: false,
      comparison: null,
      reason: 'The queued draft is no longer usable for future review.',
      reviewNote: 'Synthetic harness only. No product calculation is run and no saved plan data changes.',
      disposition: 'testHarnessOnly'
    };
  }

  const payloadProblem = validateMockPayloadForDraft(payload, draft);
  if (payloadProblem) {
    return {
      status: 'blocked',
      sandboxStatus: sandbox.status,
      draftId: draft.id,
      payloadAccepted: false,
      comparison: null,
      reason: payloadProblem,
      reviewNote: 'Synthetic harness only. Invalid mocked payloads are rejected before scoring.',
      disposition: 'testHarnessOnly'
    };
  }

  return {
    status: 'reviewOnly',
    sandboxStatus: sandbox.status,
    draftId: draft.id,
    payloadAccepted: true,
    comparison: compareSyntheticDrawdownDraft({ draft, baseline, candidate }),
    reason: 'The mocked payload matches the queued sandbox draft shape.',
    reviewNote: 'Synthetic harness only. It compares mocked outputs and does not run annual withdrawal changes in the product.',
    disposition: 'testHarnessOnly'
  };
}

function validateMockPayloadForDraft(payload: SyntheticDrawdownOverridePayload, draft: TaxAwareDrawdownDraftRow): string {
  if (payload.disposition !== 'mockPayloadOnly') return 'The payload must be marked as mock-only.';
  if (!Number.isFinite(payload.amount) || payload.amount <= 0) return 'The mocked amount must be positive.';
  if (draft.year !== null && payload.year !== draft.year) return 'The mocked year must match the queued draft year.';
  if (draft.accountBucket === 'registered' && payload.accountBucket !== 'registered') return 'The mocked bucket must match the registered draft bucket.';
  if (draft.accountBucket === 'flexible' && payload.accountBucket === 'registered') return 'The mocked bucket must use a flexible account bucket.';
  if (draft.accountBucket === 'none') return 'The queued draft has no account bucket to compare.';
  return '';
}
