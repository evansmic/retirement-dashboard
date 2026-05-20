import { createPlanFile } from '../data/planFile';
import type { SimulationResult, V2PlanPayload } from '../types/plan';
import type { DrawdownComparisonDecisionGate, RealDrawdownComparisonResult } from './drawdownComparison';
import { runSimulationSafely, type SimulationConfig } from './runSimulation';

export type DrawdownExecutionAccountBucket = 'registered' | 'tfsa' | 'nonRegistered' | 'cash';
export type DrawdownExecutionDirection = 'increase' | 'decrease';
export type DrawdownExecutionAmountBand = 'upTo5000' | 'upTo10000';

export type RuntimeDrawdownOverridePayload = {
  disposition: 'runtimeReviewDraftOnly';
  year: number;
  accountBucket: DrawdownExecutionAccountBucket;
  direction: DrawdownExecutionDirection;
  amountBand: DrawdownExecutionAmountBand;
  evidenceSource: 'lowTaxWindow' | 'oasRecovery' | 'peakTax' | 'decisionGate';
  reviewReason: string;
};

export type DrawdownExecutionValidationRow = {
  id: 'runtimeOnly' | 'gate' | 'year' | 'bucket' | 'amount' | 'savedPlan';
  label: string;
  status: 'ok' | 'needsInput' | 'blocked';
  detail: string;
};

export type DrawdownExecutionContract = {
  status: 'readyForInternalDryRun' | 'needsInput' | 'blocked' | 'notReady';
  withdrawalStrategy: {
    mode: 'currentOrder';
    annualOverrides: [];
  };
  payloads: RuntimeDrawdownOverridePayload[];
  validationRows: DrawdownExecutionValidationRow[];
  summary: string;
  reviewNote: string;
  disposition: 'runtimeContractOnly';
};

export type InternalDrawdownDryRunEvidenceRow = {
  id: 'funding' | 'tax' | 'oasRecovery' | 'estate';
  label: string;
  value: string;
  detail: string;
};

export type InternalDrawdownDryRunResult = {
  status: 'reviewOnly' | 'blocked' | 'notReady';
  payloadAccepted: boolean;
  evidenceRows: InternalDrawdownDryRunEvidenceRow[];
  reason: string;
  reviewNote: string;
  disposition: 'testOnlyInternalDryRun';
};

export type DrawdownPrototypeReadinessReviewRow = {
  id: 'decisionGate' | 'contract' | 'savedPlan' | 'dryRun' | 'copyBoundary';
  label: string;
  status: 'ready' | 'review' | 'blocked';
  detail: string;
};

export type DrawdownPrototypeReadinessReview = {
  status: 'readyForNarrowPrototype' | 'holdForGuardrails' | 'notReady';
  headline: string;
  detail: string;
  rows: DrawdownPrototypeReadinessReviewRow[];
  reviewNote: string;
  disposition: 'readinessReviewOnly';
};

export function buildDrawdownExecutionContract({
  plan,
  comparison
}: {
  plan: V2PlanPayload;
  comparison: RealDrawdownComparisonResult | null;
}): DrawdownExecutionContract {
  const payload = comparison ? payloadFromComparison(plan, comparison) : null;
  const validationRows = validateRuntimeDrawdownPayload(plan, comparison?.decisionGate || null, payload);
  const hasBlocked = validationRows.some((row) => row.status === 'blocked');
  const hasNeedsInput = validationRows.some((row) => row.status === 'needsInput');
  const status: DrawdownExecutionContract['status'] = !comparison
    ? 'notReady'
    : hasBlocked
      ? 'blocked'
      : hasNeedsInput
        ? 'needsInput'
        : 'readyForInternalDryRun';

  return {
    status,
    withdrawalStrategy: {
      mode: 'currentOrder',
      annualOverrides: []
    },
    payloads: payload && status === 'readyForInternalDryRun' ? [payload] : [],
    validationRows,
    summary:
      status === 'readyForInternalDryRun'
        ? 'One runtime-only drawdown payload shape is ready for an internal dry-run check.'
        : status === 'blocked'
          ? 'A drawdown payload shape is blocked by the review gate or saved-plan boundary.'
          : status === 'needsInput'
            ? 'More household or account detail is needed before a drawdown payload shape can be dry-run.'
            : 'No drawdown payload shape is ready yet.',
    reviewNote:
      'Runtime contract only. It keeps the current withdrawal order, keeps annual overrides empty, and does not save drawdown output.',
    disposition: 'runtimeContractOnly'
  };
}

export function validateRuntimeDrawdownPayload(
  plan: V2PlanPayload,
  gate: DrawdownComparisonDecisionGate | null,
  payload: RuntimeDrawdownOverridePayload | null
): DrawdownExecutionValidationRow[] {
  const savedPlanClean = drawdownExecutionSavedPlanGuard(plan);
  const projectionStart = n(plan.assumptions?.retireYear) || n(plan.p1?.retireYear) || new Date().getFullYear();
  const projectionEnd = n(plan.assumptions?.planEnd) || projectionStart;

  return [
    {
      id: 'runtimeOnly',
      label: 'Runtime-only shape',
      status: payload?.disposition === 'runtimeReviewDraftOnly' ? 'ok' : 'needsInput',
      detail: payload ? 'The payload is marked as a review draft only.' : 'No payload shape is available yet.'
    },
    {
      id: 'gate',
      label: 'Decision gate',
      status: gate?.status === 'eligibleForReview' ? 'ok' : gate?.status === 'blocked' ? 'blocked' : 'needsInput',
      detail:
        gate?.status === 'eligibleForReview'
          ? 'The decision gate allows this to be held for internal review.'
          : gate?.summary || 'The decision gate is not ready.'
    },
    {
      id: 'year',
      label: 'Projection year',
      status: payload && payload.year >= projectionStart && payload.year <= projectionEnd ? 'ok' : 'blocked',
      detail:
        payload && payload.year >= projectionStart && payload.year <= projectionEnd
          ? 'The payload year sits inside the projection.'
          : 'The payload year is missing or outside the projection.'
    },
    {
      id: 'bucket',
      label: 'Account bucket',
      status: payload && bucketBalance(plan, payload.accountBucket) > 0 ? 'ok' : 'needsInput',
      detail:
        payload && bucketBalance(plan, payload.accountBucket) > 0
          ? 'The selected account bucket has an entered balance.'
          : 'The selected account bucket needs an entered balance before dry-run review.'
    },
    {
      id: 'amount',
      label: 'Amount band',
      status: payload && amountFromBand(payload.amountBand) > 0 ? 'ok' : 'blocked',
      detail: payload ? 'The payload uses a bounded amount band.' : 'No bounded amount band is available yet.'
    },
    {
      id: 'savedPlan',
      label: 'Saved plan boundary',
      status: savedPlanClean ? 'ok' : 'blocked',
      detail: savedPlanClean ? 'No drawdown execution output is saved into the plan file.' : 'Saved plan output contains drawdown execution data.'
    }
  ];
}

export function runInternalDrawdownDryRun({
  plan,
  contract,
  runner = runSimulationSafely,
  testOnly
}: {
  plan: V2PlanPayload;
  contract: DrawdownExecutionContract;
  runner?: (plan: V2PlanPayload, config: SimulationConfig) => SimulationResult;
  testOnly: boolean;
}): InternalDrawdownDryRunResult {
  if (!testOnly) {
    return blockedDryRun('The internal dry-run requires the explicit test-only flag.');
  }
  if (contract.status !== 'readyForInternalDryRun' || contract.payloads.length !== 1) {
    return {
      status: contract.status === 'blocked' ? 'blocked' : 'notReady',
      payloadAccepted: false,
      evidenceRows: [],
      reason: contract.summary,
      reviewNote: 'Internal dry-run only. No product UI path runs this comparison.',
      disposition: 'testOnlyInternalDryRun'
    };
  }

  const payload = contract.payloads[0];
  const baselineConfig = baselineConfigForPlan(plan);
  const candidateConfig: SimulationConfig = {
    ...baselineConfig,
    meltdown: true,
    withdrawalOrder: 'meltdown',
    meltdownDraw60_64: amountFromBand(payload.amountBand),
    meltdownDraw65plus: amountFromBand(payload.amountBand)
  };
  const baseline = runner(plan, baselineConfig);
  const candidate = runner(plan, candidateConfig);
  if (!baseline.years?.length || !candidate.years?.length) {
    return blockedDryRun('The internal dry-run could not produce complete projection rows.');
  }

  const baselineMetrics = metricsFromResult(baseline);
  const candidateMetrics = metricsFromResult(candidate);
  const fundedYearsDelta = candidateMetrics.fundedYears - baselineMetrics.fundedYears;
  const lifetimeTaxDelta = candidateMetrics.lifetimeTax - baselineMetrics.lifetimeTax;
  const oasRecoveryTaxDelta = candidateMetrics.oasRecoveryTax - baselineMetrics.oasRecoveryTax;
  const projectedMoneyLeftDelta = candidateMetrics.projectedMoneyLeft - baselineMetrics.projectedMoneyLeft;
  const weakensFunding =
    fundedYearsDelta < 0 || shortfallEarlier(candidateMetrics.firstShortfallYear, baselineMetrics.firstShortfallYear);

  return {
    status: weakensFunding ? 'blocked' : 'reviewOnly',
    payloadAccepted: true,
    evidenceRows: [
      {
        id: 'funding',
        label: 'Funding movement',
        value: signedWhole(fundedYearsDelta),
        detail: weakensFunding ? 'Funding worsens in this dry run, so it is blocked.' : 'Funding does not worsen in this dry run.'
      },
      {
        id: 'tax',
        label: 'Lifetime tax movement',
        value: moneyDelta(lifetimeTaxDelta),
        detail: 'Compares the current plan with one internal dry-run shape.'
      },
      {
        id: 'oasRecovery',
        label: 'OAS recovery movement',
        value: moneyDelta(oasRecoveryTaxDelta),
        detail: 'Keeps benefit recovery movement visible without creating instructions.'
      },
      {
        id: 'estate',
        label: 'Projected money left',
        value: moneyDelta(projectedMoneyLeftDelta),
        detail: 'Keeps estate movement visible before any product execution path exists.'
      }
    ],
    reason: weakensFunding
      ? 'The internal dry-run is blocked because funding worsened.'
      : 'The internal dry-run produced review evidence only.',
    reviewNote:
      'Test-only internal dry-run. It does not expose a product action, does not save output, and does not change the current withdrawal order.',
    disposition: 'testOnlyInternalDryRun'
  };
}

export function selectDrawdownPrototypeReadinessReview({
  plan,
  comparison,
  contract,
  dryRun
}: {
  plan: V2PlanPayload;
  comparison: RealDrawdownComparisonResult | null;
  contract: DrawdownExecutionContract | null;
  dryRun?: InternalDrawdownDryRunResult | null;
}): DrawdownPrototypeReadinessReview {
  const savedPlanClean = drawdownExecutionSavedPlanGuard(plan);
  const gateStatus = comparison?.decisionGate.status || 'notReady';
  const contractStatus = contract?.status || 'notReady';
  const rows: DrawdownPrototypeReadinessReviewRow[] = [
    {
      id: 'decisionGate',
      label: 'Decision gate',
      status: gateStatus === 'eligibleForReview' ? 'ready' : gateStatus === 'blocked' ? 'blocked' : 'review',
      detail: comparison?.decisionGate.summary || 'No drawdown comparison decision gate is ready yet.'
    },
    {
      id: 'contract',
      label: 'Runtime contract',
      status: contractStatus === 'readyForInternalDryRun' ? 'ready' : contractStatus === 'blocked' ? 'blocked' : 'review',
      detail: contract?.summary || 'No runtime-only drawdown payload shape is ready yet.'
    },
    {
      id: 'savedPlan',
      label: 'Saved plan boundary',
      status: savedPlanClean ? 'ready' : 'blocked',
      detail: savedPlanClean ? 'No drawdown prototype output is saved into the plan file.' : 'Saved plan output contains drawdown prototype data.'
    },
    {
      id: 'dryRun',
      label: 'Internal dry-run',
      status: dryRun?.status === 'reviewOnly' ? 'ready' : dryRun?.status === 'blocked' ? 'blocked' : 'review',
      detail: dryRun?.reason || 'Internal dry-run evidence remains test-only until a later sprint.'
    },
    {
      id: 'copyBoundary',
      label: 'Copy boundary',
      status: 'ready',
      detail: 'The user-facing language stays framed as review evidence, not instructions or a recommendation.'
    }
  ];
  const hasBlocked = rows.some((row) => row.status === 'blocked');
  const hasReview = rows.some((row) => row.status === 'review');
  const status: DrawdownPrototypeReadinessReview['status'] = hasBlocked || !comparison ? 'notReady' : hasReview ? 'holdForGuardrails' : 'readyForNarrowPrototype';

  return {
    status,
    headline:
      status === 'readyForNarrowPrototype'
        ? 'Drawdown prototype is ready for a narrow future review.'
        : status === 'holdForGuardrails'
          ? 'Hold the drawdown prototype until review items are cleared.'
          : 'Drawdown prototype is not ready yet.',
    detail:
      'This review checks whether the hidden comparison, runtime contract, saved-plan boundary, and internal dry-run posture are ready for a later narrow prototype.',
    rows,
    reviewNote:
      'Readiness review only. It does not create account instructions, change withdrawal order, run annual overrides in the product, or save output.',
    disposition: 'readinessReviewOnly'
  };
}

export function drawdownExecutionSavedPlanGuard(plan: V2PlanPayload): boolean {
  const saved = createPlanFile(plan).plan as Record<string, unknown>;
  return (
    !('drawdownExecutionContract' in saved) &&
    !('drawdownOverrideExecution' in saved) &&
    !('internalDrawdownDryRun' in saved) &&
    !('runtimeDrawdownOverridePayload' in saved) &&
    !('annualOverrides' in saved) &&
    !('withdrawalStrategy' in saved)
  );
}

function payloadFromComparison(plan: V2PlanPayload, comparison: RealDrawdownComparisonResult): RuntimeDrawdownOverridePayload | null {
  if (comparison.status !== 'reviewOnly' || comparison.decisionGate.status !== 'eligibleForReview') return null;
  const year = n(plan.assumptions?.retireYear) || n(plan.p1?.retireYear) || new Date().getFullYear();
  return {
    disposition: 'runtimeReviewDraftOnly',
    year,
    accountBucket: 'registered',
    direction: 'increase',
    amountBand: 'upTo10000',
    evidenceSource:
      comparison.draftId === 'oasRecoveryDraft' ? 'oasRecovery' : comparison.draftId === 'peakTaxDraft' ? 'peakTax' : 'lowTaxWindow',
    reviewReason: 'Evidence came from the hidden drawdown comparison gate.'
  };
}

function baselineConfigForPlan(plan: V2PlanPayload): SimulationConfig {
  return {
    cppAgeF: 65,
    cppAgeM: 65,
    oasAgeF: 65,
    oasAgeM: 65,
    meltdown: false,
    returnRate: 0.05,
    pensionSplit: false,
    p1Dies: null,
    withdrawalOrder: plan.assumptions?.withdrawalOrder || 'default'
  };
}

function metricsFromResult(result: SimulationResult) {
  const rows = result.years || [];
  const firstShortfall = rows.find((row) => n(row.shortfall) > 1);
  return {
    fundedYears: rows.filter((row) => n(row.shortfall) <= 1).length,
    firstShortfallYear: firstShortfall ? n(firstShortfall.year) : null,
    lifetimeTax: rows.reduce((total, row) => total + n(row.totalTaxYear), 0),
    oasRecoveryTax: rows.reduce((total, row) => total + n(row.totalOasClawY), 0),
    projectedMoneyLeft: n(rows[rows.length - 1]?.bal_total)
  };
}

function blockedDryRun(reason: string): InternalDrawdownDryRunResult {
  return {
    status: 'blocked',
    payloadAccepted: false,
    evidenceRows: [],
    reason,
    reviewNote: 'Internal dry-run only. No product UI path runs this comparison.',
    disposition: 'testOnlyInternalDryRun'
  };
}

function bucketBalance(plan: V2PlanPayload, bucket: DrawdownExecutionAccountBucket): number {
  if (bucket === 'registered') return n(plan.p1?.rrsp) + n(plan.p1?.lira) + n(plan.p1?.lif) + n(plan.p2?.rrsp) + n(plan.p2?.lira) + n(plan.p2?.lif);
  if (bucket === 'tfsa') return n(plan.p1?.tfsa) + n(plan.p2?.tfsa);
  if (bucket === 'nonRegistered') return n(plan.p1?.nonreg) + n(plan.p2?.nonreg);
  return n(plan.cashWedge?.balance);
}

function amountFromBand(band: DrawdownExecutionAmountBand): number {
  return band === 'upTo10000' ? 10000 : 5000;
}

function shortfallEarlier(candidate: number | null, baseline: number | null): boolean {
  if (candidate === null) return false;
  if (baseline === null) return true;
  return candidate < baseline;
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
