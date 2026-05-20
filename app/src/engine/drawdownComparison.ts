import { createPlanFile } from '../data/planFile';
import type { SimulationResult, V2PlanPayload } from '../types/plan';
import { buildBaselinePreviewConfig, type PreviewSimulationRunner } from './previewScenarios';
import { runSimulationSafely, type SimulationConfig } from './runSimulation';
import { selectDrawdownReadinessSummary, type TaxAwareDrawdownDraftRow } from './resultSelectors';

export type RealDrawdownComparisonMetrics = {
  fundedYears: number;
  firstShortfallYear: number | null;
  lifetimeTax: number;
  peakTax: number;
  oasRecoveryTax: number;
  projectedMoneyLeft: number;
};

export type RealDrawdownComparisonResult = {
  status: 'reviewOnly' | 'blocked' | 'notReady';
  candidateId: 'singleRegisteredTimingCheck' | null;
  draftId: TaxAwareDrawdownDraftRow['id'] | null;
  label: string;
  baseline: RealDrawdownComparisonMetrics | null;
  candidate: RealDrawdownComparisonMetrics | null;
  deltas: RealDrawdownComparisonMetrics | null;
  evidenceRows: Array<{
    id: 'funding' | 'tax' | 'oasRecovery' | 'estate';
    label: string;
    value: string;
    detail: string;
  }>;
  reason: string;
  reviewNote: string;
  disposition: 'hiddenComparisonOnly';
};

export type HiddenDrawdownComparisonGuardrail = {
  id: 'hiddenOnly' | 'reviewOnly' | 'funding' | 'savedPlan';
  label: string;
  status: 'ok' | 'review' | 'blocked';
  detail: string;
};

const SUPPORTED_DRAFTS: TaxAwareDrawdownDraftRow['id'][] = ['lowTaxRegisteredDraft', 'oasRecoveryDraft', 'peakTaxDraft'];

export function runSingleDrawdownComparison(
  plan: V2PlanPayload,
  runner: PreviewSimulationRunner = runSimulationSafely
): RealDrawdownComparisonResult {
  const baselineConfig = buildBaselinePreviewConfig(plan);
  const baselineResult = runner(plan, baselineConfig);
  const readiness = selectDrawdownReadinessSummary(baselineResult, plan);
  const sandboxRow = readiness.drawdownOverrideDrafts.sandbox.rows.find((row) => row.status === 'queuedForFutureReview') || null;
  const draft = sandboxRow?.draftId
    ? readiness.drawdownOverrideDrafts.rows.find((row) => row.id === sandboxRow.draftId) || null
    : null;

  if (readiness.drawdownOverrideDrafts.comparisonReadiness.status !== 'readyForLaterComparison' || !sandboxRow || !draft) {
    return blockedResult(
      'notReady',
      sandboxRow?.draftId || null,
      'The plan is not ready for a hidden drawdown comparison yet.'
    );
  }

  if (!SUPPORTED_DRAFTS.includes(draft.id)) {
    return blockedResult('blocked', draft.id, 'This draft type is not part of the first hidden comparison path.');
  }

  const amount = amountFromBand(draft.amountBand);
  if (amount <= 0 || draft.year === null) {
    return blockedResult('blocked', draft.id, 'The queued draft does not provide a usable year and amount band.');
  }

  const candidateConfig: SimulationConfig = {
    ...baselineConfig,
    meltdown: true,
    withdrawalOrder: 'meltdown',
    meltdownDraw60_64: amount,
    meltdownDraw65plus: amount
  };
  const candidateResult = runner(plan, candidateConfig);
  if (!hasProjectionRows(baselineResult) || !hasProjectionRows(candidateResult)) {
    return blockedResult('blocked', draft.id, 'The hidden comparison could not produce complete projection rows.');
  }

  const baseline = summarizeComparisonMetrics(baselineResult);
  const candidate = summarizeComparisonMetrics(candidateResult);
  const deltas = {
    fundedYears: candidate.fundedYears - baseline.fundedYears,
    firstShortfallYear: shortfallYearDelta(candidate.firstShortfallYear, baseline.firstShortfallYear),
    lifetimeTax: candidate.lifetimeTax - baseline.lifetimeTax,
    peakTax: candidate.peakTax - baseline.peakTax,
    oasRecoveryTax: candidate.oasRecoveryTax - baseline.oasRecoveryTax,
    projectedMoneyLeft: candidate.projectedMoneyLeft - baseline.projectedMoneyLeft
  };
  const weakensFunding = candidate.fundedYears < baseline.fundedYears || shortfallEarlier(candidate.firstShortfallYear, baseline.firstShortfallYear);

  return {
    status: 'reviewOnly',
    candidateId: 'singleRegisteredTimingCheck',
    draftId: draft.id,
    label: 'Hidden registered-timing comparison',
    baseline,
    candidate,
    deltas,
    evidenceRows: [
      {
        id: 'funding',
        label: 'Funding movement',
        value: `${signedWhole(deltas.fundedYears)} funded years`,
        detail: weakensFunding ? 'The comparison weakens funding, so it must stay held back.' : 'Funding does not weaken in this hidden comparison.'
      },
      {
        id: 'tax',
        label: 'Tax movement',
        value: moneyDelta(deltas.lifetimeTax),
        detail: 'Compares lifetime tax in the current plan against one hidden registered-timing check.'
      },
      {
        id: 'oasRecovery',
        label: 'OAS recovery movement',
        value: moneyDelta(deltas.oasRecoveryTax),
        detail: 'Compares OAS recovery tax movement without changing the saved plan.'
      },
      {
        id: 'estate',
        label: 'Projected money left',
        value: moneyDelta(deltas.projectedMoneyLeft),
        detail: 'Keeps estate impact visible before any later execution path is considered.'
      }
    ],
    reason: weakensFunding
      ? 'The hidden comparison produced evidence but is held back because funding worsened.'
      : 'The hidden comparison produced review evidence only.',
    reviewNote:
      'Hidden comparison only. It uses existing simulation plumbing for evidence, does not create account instructions, and does not change or save the plan.',
    disposition: 'hiddenComparisonOnly'
  };
}

export function drawdownComparisonSavedPlanGuard(plan: V2PlanPayload): boolean {
  const saved = createPlanFile(plan).plan as Record<string, unknown>;
  return (
    !('drawdownComparison' in saved) &&
    !('singleRegisteredTimingCheck' in saved) &&
    !('annualOverrides' in saved) &&
    !('withdrawalStrategy' in saved)
  );
}

export function selectHiddenDrawdownComparisonGuardrails(
  comparison: RealDrawdownComparisonResult,
  plan: V2PlanPayload
): HiddenDrawdownComparisonGuardrail[] {
  const weakensFunding =
    comparison.deltas !== null &&
    (comparison.deltas.fundedYears < 0 || (comparison.deltas.firstShortfallYear !== null && comparison.deltas.firstShortfallYear < 0));
  const savedPlanClean = drawdownComparisonSavedPlanGuard(plan);

  return [
    {
      id: 'hiddenOnly',
      label: 'Hidden comparison boundary',
      status: comparison.disposition === 'hiddenComparisonOnly' ? 'ok' : 'blocked',
      detail: 'The comparison remains hidden and is not part of the React results flow.'
    },
    {
      id: 'reviewOnly',
      label: 'Review-only output',
      status: comparison.status === 'reviewOnly' || comparison.status === 'notReady' || comparison.status === 'blocked' ? 'ok' : 'blocked',
      detail: 'The output is evidence for review, not account instructions.'
    },
    {
      id: 'funding',
      label: 'Funding guardrail',
      status: weakensFunding ? 'review' : 'ok',
      detail: weakensFunding
        ? 'Funding worsened in the hidden comparison, so this must remain held back.'
        : 'Funding did not worsen, or the comparison did not run.'
    },
    {
      id: 'savedPlan',
      label: 'Saved plan boundary',
      status: savedPlanClean ? 'ok' : 'blocked',
      detail: savedPlanClean ? 'No hidden comparison output is saved into the plan file.' : 'Saved plan output contains hidden comparison data.'
    }
  ];
}

function blockedResult(
  status: RealDrawdownComparisonResult['status'],
  draftId: TaxAwareDrawdownDraftRow['id'] | null,
  reason: string
): RealDrawdownComparisonResult {
  return {
    status,
    candidateId: null,
    draftId,
    label: 'Hidden registered-timing comparison',
    baseline: null,
    candidate: null,
    deltas: null,
    evidenceRows: [],
    reason,
    reviewNote:
      'Hidden comparison only. It does not run unless readiness, sandbox, and draft checks are all available.',
    disposition: 'hiddenComparisonOnly'
  };
}

function summarizeComparisonMetrics(result: SimulationResult): RealDrawdownComparisonMetrics {
  const rows = result.years || [];
  const firstShortfall = rows.find((row) => n(row.shortfall) > 1);
  return {
    fundedYears: rows.filter((row) => n(row.shortfall) <= 1).length,
    firstShortfallYear: firstShortfall ? n(firstShortfall.year) : null,
    lifetimeTax: rows.reduce((total, row) => total + n(row.totalTaxYear), 0),
    peakTax: rows.reduce((peak, row) => Math.max(peak, n(row.totalTaxYear)), 0),
    oasRecoveryTax: rows.reduce((total, row) => total + n(row.totalOasClawY), 0),
    projectedMoneyLeft: n(rows[rows.length - 1]?.bal_total)
  };
}

function hasProjectionRows(result: SimulationResult | null | undefined): result is SimulationResult {
  return Boolean(result?.years?.length);
}

function amountFromBand(band: string): number {
  if (band.includes('$10k')) return 10000;
  if (band.includes('$5k')) return 5000;
  return 0;
}

function shortfallEarlier(candidate: number | null, baseline: number | null): boolean {
  if (candidate === null) return false;
  if (baseline === null) return true;
  return candidate < baseline;
}

function shortfallYearDelta(candidate: number | null, baseline: number | null): number {
  if (candidate === null && baseline === null) return 0;
  if (candidate === null) return 999;
  if (baseline === null) return -999;
  return candidate - baseline;
}

function moneyDelta(value: number): string {
  const rounded = Math.round(value);
  if (rounded === 0) return '$0';
  return `${rounded > 0 ? '+' : '-'}$${Math.abs(rounded).toLocaleString()}`;
}

function signedWhole(value: number): string {
  if (value === 0) return '0';
  return `${value > 0 ? '+' : ''}${value}`;
}

function n(value: unknown): number {
  return Number.isFinite(Number(value)) ? Number(value) : 0;
}
