import { createPlanFile } from '../data/planFile';
import type { SimulationResult, V2PlanPayload } from '../types/plan';
import { runSimulationSafely, type SimulationConfig } from './runSimulation';
import { selectDrawdownReadinessSummary, type TaxAwareDrawdownDraftRow } from './resultSelectors';

export type DrawdownComparisonRunner = (plan: V2PlanPayload, config: SimulationConfig) => SimulationResult;

export type RealDrawdownComparisonMetrics = {
  fundedYears: number;
  firstShortfallYear: number | null;
  lifetimeTax: number;
  peakTax: number;
  oasRecoveryTax: number;
  projectedMoneyLeft: number;
};

export type HiddenDrawdownComparisonGuardrail = {
  id: 'hiddenOnly' | 'reviewOnly' | 'funding' | 'savedPlan';
  label: string;
  status: 'ok' | 'review' | 'blocked';
  detail: string;
};

export type DrawdownComparisonDecisionGateRow = {
  id: 'materiality' | 'funding' | 'estate' | 'survivor' | 'lockedIn' | 'savedPlan';
  label: string;
  status: 'ok' | 'review' | 'blocked';
  detail: string;
};

export type DrawdownComparisonDecisionGate = {
  status: 'eligibleForReview' | 'holdBack' | 'blocked' | 'notReady';
  headline: string;
  detail: string;
  rows: DrawdownComparisonDecisionGateRow[];
  reviewNote: string;
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
  decisionGate: DrawdownComparisonDecisionGate;
  reason: string;
  reviewNote: string;
  disposition: 'hiddenComparisonOnly';
};

const SUPPORTED_DRAFTS: TaxAwareDrawdownDraftRow['id'][] = ['lowTaxRegisteredDraft', 'oasRecoveryDraft', 'peakTaxDraft'];

export function runSingleDrawdownComparison(
  plan: V2PlanPayload,
  runner: DrawdownComparisonRunner = runSimulationSafely
): RealDrawdownComparisonResult {
  const baselineConfig = buildDrawdownComparisonBaselineConfig(plan);
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
  const decisionGate = buildDecisionGate({ baseline, candidate, deltas, plan, weakensFunding });

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
    decisionGate,
    reason: weakensFunding
      ? 'The hidden comparison produced evidence but is held back because funding worsened.'
      : 'The hidden comparison produced review evidence only.',
    reviewNote:
      'Hidden comparison only. It uses existing simulation plumbing for evidence, does not create account instructions, and does not change or save the plan.',
    disposition: 'hiddenComparisonOnly'
  };
}

function buildDrawdownComparisonBaselineConfig(plan: V2PlanPayload): SimulationConfig {
  return {
    cppAgeF: 65,
    cppAgeM: 65,
    oasAgeF: 65,
    oasAgeM: 65,
    meltdown: false,
    returnRate: 0.05,
    pensionSplit: false,
    p1Dies: null,
    withdrawalOrder: plan.assumptions.withdrawalOrder || 'default'
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
    decisionGate: {
      status: status === 'blocked' ? 'blocked' : 'notReady',
      headline: status === 'blocked' ? 'Drawdown comparison gate is blocked.' : 'Drawdown comparison gate is not ready.',
      detail: reason,
      rows: [],
      reviewNote: 'review-only gate: no drawdown comparison can be highlighted from this state.'
    },
    reason,
    reviewNote:
      'Hidden comparison only, review-only. It does not run unless readiness, sandbox, and draft checks are all available.',
    disposition: 'hiddenComparisonOnly'
  };
}

function buildDecisionGate({
  baseline,
  candidate,
  deltas,
  plan,
  weakensFunding
}: {
  baseline: RealDrawdownComparisonMetrics;
  candidate: RealDrawdownComparisonMetrics;
  deltas: RealDrawdownComparisonMetrics;
  plan: V2PlanPayload;
  weakensFunding: boolean;
}): DrawdownComparisonDecisionGate {
  const taxImprovement = deltas.lifetimeTax <= -1000 || deltas.oasRecoveryTax <= -500 || deltas.peakTax <= -1000;
  const fundingImprovement = deltas.fundedYears > 0 || (baseline.firstShortfallYear !== null && candidate.firstShortfallYear === null);
  const estateImprovement = deltas.projectedMoneyLeft >= 1000;
  const material = taxImprovement || fundingImprovement || estateImprovement;
  const estateTarget = n(plan.inheritance);
  const estateWorse = estateTarget > 0 && deltas.projectedMoneyLeft < 0;
  const isCouple = !personLooksBlank(plan.p2);
  const survivorMissing = isCouple && !n(plan.assumptions?.p1DiesInSurvivor);
  const lockedInAssets = n(plan.p1?.lif) + n(plan.p1?.lira) + n(plan.p2?.lif) + n(plan.p2?.lira);
  const savedPlanClean = drawdownComparisonSavedPlanGuard(plan);

  const rows: DrawdownComparisonDecisionGateRow[] = [
    {
      id: 'materiality',
      label: 'Material change',
      status: material ? 'ok' : 'review',
      detail: material
        ? 'The hidden comparison moves at least one tax, funding, or projected-money-left measure enough to review.'
        : 'The hidden comparison does not yet show enough movement to elevate beyond background evidence.'
    },
    {
      id: 'funding',
      label: 'Funding harm',
      status: weakensFunding ? 'blocked' : 'ok',
      detail: weakensFunding ? 'Funding worsens, so this comparison stays held back.' : 'Funding does not worsen in this comparison.'
    },
    {
      id: 'estate',
      label: 'Estate preference',
      status: estateWorse ? 'review' : 'ok',
      detail: estateWorse
        ? 'The entered estate goal could be weakened, so this needs review before any later highlight.'
        : 'No entered estate-goal harm is visible in this comparison.'
    },
    {
      id: 'survivor',
      label: 'Survivor guardrail',
      status: survivorMissing ? 'review' : 'ok',
      detail: survivorMissing
        ? 'A couple plan should confirm survivor impact before a drawdown comparison is highlighted.'
        : 'Survivor setup does not block this review gate.'
    },
    {
      id: 'lockedIn',
      label: 'Locked-in account guardrail',
      status: lockedInAssets > 0 ? 'review' : 'ok',
      detail: lockedInAssets > 0
        ? 'Locked-in account limits need review before a drawdown comparison is highlighted.'
        : 'No locked-in account balance is entered for this gate.'
    },
    {
      id: 'savedPlan',
      label: 'Saved plan boundary',
      status: savedPlanClean ? 'ok' : 'blocked',
      detail: savedPlanClean ? 'No drawdown comparison output is saved into the plan file.' : 'Saved plan output contains drawdown comparison data.'
    }
  ];
  const hasBlocked = rows.some((row) => row.status === 'blocked');
  const hasReview = rows.some((row) => row.status === 'review');
  const status: DrawdownComparisonDecisionGate['status'] = hasBlocked ? 'blocked' : hasReview ? 'holdBack' : 'eligibleForReview';

  return {
    status,
    headline:
      status === 'eligibleForReview'
        ? 'Eligible for review, not a recommendation.'
        : status === 'blocked'
          ? 'Held back by a blocking guardrail.'
          : 'Hold back until review items are resolved.',
    detail:
      'This gate decides whether the comparison can be reviewed more prominently later. It does not change the plan or create account instructions.',
    rows,
    reviewNote: 'Decision gate is review-only. It does not put a strategy into the plan, change withdrawal order, or save optimizer output.'
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

function personLooksBlank(person: V2PlanPayload['p2'] | null | undefined): boolean {
  if (!person) return true;
  return !person.name && !n(person.dob) && !n(person.rrsp) && !n(person.tfsa) && !n(person.lif) && !n(person.lira) && !n(person.nonreg);
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
