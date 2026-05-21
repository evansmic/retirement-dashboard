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

export type DrawdownVisibleReviewGateRow = {
  id: 'decisionGate' | 'contract' | 'savedPlan' | 'dryRun' | 'harm';
  label: string;
  status: 'ok' | 'review' | 'blocked';
  detail: string;
};

export type DrawdownVisibleReviewGate = {
  status: 'readyForVisibleReview' | 'holdForMoreEvidence' | 'blocked';
  headline: string;
  detail: string;
  rows: DrawdownVisibleReviewGateRow[];
  reviewNote: string;
  disposition: 'visibleReviewGateOnly';
};

export type DrawdownReviewPreviewRow = {
  id: 'funding' | 'tax' | 'oasRecovery' | 'estate';
  label: string;
  value: string;
  detail: string;
};

export type DrawdownReviewPreview = {
  status: 'visibleForReview' | 'heldBack' | 'blocked';
  headline: string;
  detail: string;
  rows: DrawdownReviewPreviewRow[];
  reviewNote: string;
  disposition: 'detailsPreviewOnly';
};

export type DrawdownPhaseReviewRow = {
  id: 'gate' | 'preview' | 'examples' | 'stress' | 'copy' | 'savedPlan';
  label: string;
  status: 'ready' | 'hold' | 'blocked';
  detail: string;
};

export type DrawdownPhaseReview = {
  status: 'readyToContinue' | 'holdForMoreGuardrails' | 'stopBeforeExecution';
  headline: string;
  detail: string;
  rows: DrawdownPhaseReviewRow[];
  reviewNote: string;
  disposition: 'phaseReviewOnly';
};

export type DrawdownExecutionBoundaryDecisionRow = {
  id: 'phase' | 'examples' | 'preview' | 'savedPlan' | 'productBoundary';
  label: string;
  status: 'ready' | 'hold' | 'blocked';
  detail: string;
};

export type DrawdownExecutionBoundaryDecision = {
  status: 'keepPreviewOnly' | 'hardenMore' | 'readyForTinyExecutionPrototype';
  headline: string;
  detail: string;
  rows: DrawdownExecutionBoundaryDecisionRow[];
  reviewNote: string;
  disposition: 'executionBoundaryDecisionOnly';
};

export type DrawdownAnnualOverrideAdapterDraft = {
  disposition: 'adapterDraftOnly';
  year: number;
  accountBucket: DrawdownExecutionAccountBucket;
  direction: DrawdownExecutionDirection;
  amount: number;
  sourcePayload: 'runtimeReviewDraftOnly';
};

export type DrawdownAdapterValidationRow = {
  id: 'boundary' | 'year' | 'bucket' | 'amount' | 'direction' | 'savedPlan';
  label: string;
  status: 'ok' | 'blocked';
  detail: string;
};

export type DrawdownAdapterValidation = {
  status: 'acceptedForMockScoring' | 'rejected';
  adapter: DrawdownAnnualOverrideAdapterDraft | null;
  rows: DrawdownAdapterValidationRow[];
  reason: string;
  reviewNote: string;
  disposition: 'adapterValidationOnly';
};

export type MockedExecutionScorecardRow = {
  id: 'funding' | 'tax' | 'oasRecovery' | 'estate';
  label: string;
  value: string;
  status: 'ok' | 'blocked';
  detail: string;
};

export type MockedExecutionScorecard = {
  status: 'reviewOnly' | 'blocked' | 'notReady';
  rows: MockedExecutionScorecardRow[];
  reason: string;
  reviewNote: string;
  disposition: 'mockedScorecardOnly';
};

export type DrawdownExecutionPrototypeGoNoGoRow = {
  id: 'boundary' | 'adapter' | 'scorecard' | 'savedPlan' | 'productScope';
  label: string;
  status: 'ready' | 'hold' | 'blocked';
  detail: string;
};

export type DrawdownExecutionPrototypeGoNoGo = {
  status: 'readyForOneRealPrototype' | 'holdForAdapterGuardrails' | 'stopBeforeExecution';
  headline: string;
  detail: string;
  rows: DrawdownExecutionPrototypeGoNoGoRow[];
  reviewNote: string;
  disposition: 'executionPrototypeGoNoGoOnly';
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

export function selectDrawdownVisibleReviewGate({
  plan,
  comparison,
  contract,
  dryRun
}: {
  plan: V2PlanPayload;
  comparison: RealDrawdownComparisonResult | null;
  contract: DrawdownExecutionContract | null;
  dryRun?: InternalDrawdownDryRunResult | null;
}): DrawdownVisibleReviewGate {
  const savedPlanClean = drawdownExecutionSavedPlanGuard(plan);
  const weakensEstateTarget = n(plan.inheritance) > 0 && n(comparison?.deltas?.projectedMoneyLeft) < 0;
  const weakensFunding = n(comparison?.deltas?.fundedYears) < 0 || n(comparison?.deltas?.firstShortfallYear) < 0;
  const rows: DrawdownVisibleReviewGateRow[] = [
    {
      id: 'decisionGate',
      label: 'Decision gate',
      status: comparison?.decisionGate.status === 'eligibleForReview' ? 'ok' : comparison?.decisionGate.status === 'blocked' ? 'blocked' : 'review',
      detail: comparison?.decisionGate.summary || 'No eligible decision gate is available.'
    },
    {
      id: 'contract',
      label: 'Runtime contract',
      status: contract?.status === 'readyForInternalDryRun' ? 'ok' : contract?.status === 'blocked' ? 'blocked' : 'review',
      detail: contract?.summary || 'No runtime-only contract is ready.'
    },
    {
      id: 'savedPlan',
      label: 'Saved plan boundary',
      status: savedPlanClean ? 'ok' : 'blocked',
      detail: savedPlanClean ? 'No preview or drawdown output is saved into the plan file.' : 'Saved plan output contains drawdown review data.'
    },
    {
      id: 'dryRun',
      label: 'Internal dry-run',
      status: dryRun?.status === 'blocked' ? 'blocked' : dryRun?.status === 'reviewOnly' ? 'ok' : 'review',
      detail: dryRun?.reason || 'Internal dry-run evidence is not part of the product preview.'
    },
    {
      id: 'harm',
      label: 'Harm check',
      status: weakensFunding || weakensEstateTarget ? 'blocked' : 'ok',
      detail:
        weakensFunding || weakensEstateTarget
          ? 'Funding or the entered estate goal weakens, so the preview stays blocked.'
          : 'No funding or entered estate-goal harm is visible in the review evidence.'
    }
  ];
  const hasBlocked = rows.some((row) => row.status === 'blocked');
  const blockingWithoutDryRun = rows.some((row) => row.id !== 'dryRun' && row.status === 'review');
  const status: DrawdownVisibleReviewGate['status'] = hasBlocked ? 'blocked' : blockingWithoutDryRun ? 'holdForMoreEvidence' : 'readyForVisibleReview';

  return {
    status,
    headline:
      status === 'readyForVisibleReview'
        ? 'Drawdown review preview is ready for Details.'
        : status === 'blocked'
          ? 'Drawdown review preview is blocked.'
          : 'Hold the drawdown review preview for more evidence.',
    detail:
      'This gate decides whether a high-level Details preview may appear. It does not create withdrawal instructions or change the plan.',
    rows,
    reviewNote:
      'Visible review gate only. It does not tell the household which account to withdraw from, run annual overrides in the product, or save output.',
    disposition: 'visibleReviewGateOnly'
  };
}

export function selectDrawdownReviewPreview({
  gate,
  comparison,
  spendingStressStatus
}: {
  gate: DrawdownVisibleReviewGate;
  comparison: RealDrawdownComparisonResult | null;
  spendingStressStatus?: string;
}): DrawdownReviewPreview {
  const fragileStress = spendingStressStatus === 'fragile';
  if (gate.status === 'blocked') {
    return blockedPreview('Drawdown review preview is blocked by the final gate.', 'blocked');
  }
  if (gate.status !== 'readyForVisibleReview' || comparison?.status !== 'reviewOnly') {
    return blockedPreview('Drawdown review preview is held back until the review gate has enough evidence.', 'heldBack');
  }
  if (fragileStress) {
    return blockedPreview('Drawdown review preview is held back because nearby spending stress looks fragile.', 'heldBack');
  }

  return {
    status: 'visibleForReview',
    headline: 'Drawdown review preview',
    detail:
      'This preview shows whether a future drawdown review may be worth discussing. It does not tell you which account to withdraw from.',
    rows: comparison.evidenceRows.map((row) => ({
      id: row.id,
      label: row.label,
      value: row.value,
      detail: row.detail
    })),
    reviewNote:
      'Review preview only. It does not change withdrawal order, run annual overrides in the product, save output, or provide account instructions.',
    disposition: 'detailsPreviewOnly'
  };
}

export function selectDrawdownPhaseReview({
  plan,
  gate,
  preview,
  exampleMatrixReady = true
}: {
  plan: V2PlanPayload;
  gate: DrawdownVisibleReviewGate;
  preview: DrawdownReviewPreview;
  exampleMatrixReady?: boolean;
}): DrawdownPhaseReview {
  const savedPlanClean = drawdownExecutionSavedPlanGuard(plan);
  const rows: DrawdownPhaseReviewRow[] = [
    {
      id: 'gate',
      label: 'Final gate',
      status: gate.status === 'readyForVisibleReview' ? 'ready' : gate.status === 'blocked' ? 'blocked' : 'hold',
      detail: gate.headline
    },
    {
      id: 'preview',
      label: 'Details preview',
      status: preview.status === 'visibleForReview' ? 'ready' : preview.status === 'blocked' ? 'blocked' : 'hold',
      detail: preview.headline
    },
    {
      id: 'examples',
      label: 'Example matrix',
      status: exampleMatrixReady ? 'ready' : 'hold',
      detail: exampleMatrixReady ? 'Built-in examples pass the drawdown preview guardrails.' : 'Example coverage needs review.'
    },
    {
      id: 'stress',
      label: 'Stress posture',
      status: preview.status === 'heldBack' ? 'hold' : 'ready',
      detail:
        preview.status === 'heldBack'
          ? 'Nearby stress or missing evidence is holding back the preview.'
          : 'No stress hold is visible in the preview gate.'
    },
    {
      id: 'copy',
      label: 'Copy boundary',
      status: 'ready',
      detail: 'Copy stays review-oriented and avoids account instructions.'
    },
    {
      id: 'savedPlan',
      label: 'Saved plan audit',
      status: savedPlanClean ? 'ready' : 'blocked',
      detail: savedPlanClean ? 'No drawdown phase output is saved.' : 'Saved plan output contains drawdown phase data.'
    }
  ];
  const hasBlocked = rows.some((row) => row.status === 'blocked');
  const hasHold = rows.some((row) => row.status === 'hold');
  const status: DrawdownPhaseReview['status'] = hasBlocked ? 'stopBeforeExecution' : hasHold ? 'holdForMoreGuardrails' : 'readyToContinue';

  return {
    status,
    headline:
      status === 'readyToContinue'
        ? 'Drawdown phase is ready to continue slowly.'
        : status === 'stopBeforeExecution'
          ? 'Stop before drawdown execution.'
          : 'Hold for more guardrails before drawdown execution.',
    detail:
      'This checkpoint summarizes whether the drawdown prototype work should continue, hold, or stop before deeper execution.',
    rows,
    reviewNote:
      'Phase review only. It does not add optimizer execution, change withdrawal order, provide account instructions, or save output.',
    disposition: 'phaseReviewOnly'
  };
}

export function selectDrawdownExecutionBoundaryDecision({
  plan,
  phase,
  preview,
  examplesAllClear = true
}: {
  plan: V2PlanPayload;
  phase: DrawdownPhaseReview;
  preview: DrawdownReviewPreview;
  examplesAllClear?: boolean;
}): DrawdownExecutionBoundaryDecision {
  const savedPlanClean = drawdownExecutionSavedPlanGuard(plan);
  const rows: DrawdownExecutionBoundaryDecisionRow[] = [
    {
      id: 'phase',
      label: 'Phase review',
      status: phase.status === 'readyToContinue' ? 'ready' : phase.status === 'stopBeforeExecution' ? 'blocked' : 'hold',
      detail: phase.headline
    },
    {
      id: 'examples',
      label: 'Example coverage',
      status: examplesAllClear ? 'ready' : 'hold',
      detail: examplesAllClear ? 'Built-in examples are clear enough for the next adapter checkpoint.' : 'An example is held or blocked, so the adapter path should wait.'
    },
    {
      id: 'preview',
      label: 'Visible preview',
      status: preview.status === 'visibleForReview' ? 'ready' : preview.status === 'blocked' ? 'blocked' : 'hold',
      detail: preview.headline
    },
    {
      id: 'savedPlan',
      label: 'Saved plan boundary',
      status: savedPlanClean ? 'ready' : 'blocked',
      detail: savedPlanClean ? 'No execution boundary output is saved.' : 'Saved plan output contains execution boundary data.'
    },
    {
      id: 'productBoundary',
      label: 'Product boundary',
      status: 'ready',
      detail: 'The product remains preview-only; adapter work is runtime-only and not used for product calculations.'
    }
  ];
  const hasBlocked = rows.some((row) => row.status === 'blocked');
  const hasHold = rows.some((row) => row.status === 'hold');
  const status: DrawdownExecutionBoundaryDecision['status'] = hasBlocked ? 'keepPreviewOnly' : hasHold ? 'hardenMore' : 'readyForTinyExecutionPrototype';

  return {
    status,
    headline:
      status === 'readyForTinyExecutionPrototype'
        ? 'Ready for a tiny execution prototype boundary.'
        : status === 'hardenMore'
          ? 'Harden the preview more before adapter work.'
          : 'Keep the drawdown work as preview-only.',
    detail:
      'This checkpoint decides whether to stay with preview-only evidence, harden more guardrails, or allow a tiny runtime-only adapter prototype.',
    rows,
    reviewNote:
      'Boundary decision only. It does not run annual overrides, change withdrawal order, create account instructions, or save output.',
    disposition: 'executionBoundaryDecisionOnly'
  };
}

export function buildDrawdownAnnualOverrideAdapterDraft({
  plan,
  boundary,
  contract
}: {
  plan: V2PlanPayload;
  boundary: DrawdownExecutionBoundaryDecision;
  contract: DrawdownExecutionContract;
}): DrawdownAdapterValidation {
  const payload = contract.payloads[0] || null;
  const adapter: DrawdownAnnualOverrideAdapterDraft | null =
    payload && boundary.status === 'readyForTinyExecutionPrototype'
      ? {
          disposition: 'adapterDraftOnly',
          year: payload.year,
          accountBucket: payload.accountBucket,
          direction: payload.direction,
          amount: amountFromBand(payload.amountBand),
          sourcePayload: payload.disposition
        }
      : null;
  return validateDrawdownAnnualOverrideAdapter({ plan, boundary, adapter });
}

export function validateDrawdownAnnualOverrideAdapter({
  plan,
  boundary,
  adapter
}: {
  plan: V2PlanPayload;
  boundary: DrawdownExecutionBoundaryDecision;
  adapter: DrawdownAnnualOverrideAdapterDraft | null;
}): DrawdownAdapterValidation {
  const projectionStart = n(plan.assumptions?.retireYear) || n(plan.p1?.retireYear) || new Date().getFullYear();
  const projectionEnd = n(plan.assumptions?.planEnd) || projectionStart;
  const savedPlanClean = drawdownExecutionSavedPlanGuard(plan);
  const rows: DrawdownAdapterValidationRow[] = [
    {
      id: 'boundary',
      label: 'Execution boundary',
      status: boundary.status === 'readyForTinyExecutionPrototype' ? 'ok' : 'blocked',
      detail: boundary.headline
    },
    {
      id: 'year',
      label: 'Adapter year',
      status: adapter && adapter.year >= projectionStart && adapter.year <= projectionEnd ? 'ok' : 'blocked',
      detail: adapter ? 'Adapter year must stay inside the projection.' : 'No adapter draft is available.'
    },
    {
      id: 'bucket',
      label: 'Adapter account bucket',
      status: adapter && bucketBalance(plan, adapter.accountBucket) > 0 ? 'ok' : 'blocked',
      detail: adapter ? 'Adapter bucket must match an entered account balance.' : 'No adapter bucket is available.'
    },
    {
      id: 'amount',
      label: 'Adapter amount',
      status: adapter && Number.isFinite(adapter.amount) && adapter.amount > 0 ? 'ok' : 'blocked',
      detail: adapter ? 'Adapter amount must be positive and bounded.' : 'No adapter amount is available.'
    },
    {
      id: 'direction',
      label: 'Adapter direction',
      status: adapter && (adapter.direction === 'increase' || adapter.direction === 'decrease') ? 'ok' : 'blocked',
      detail: adapter ? 'Adapter direction must be one of the supported review directions.' : 'No adapter direction is available.'
    },
    {
      id: 'savedPlan',
      label: 'Saved plan boundary',
      status: savedPlanClean ? 'ok' : 'blocked',
      detail: savedPlanClean ? 'No adapter output is saved into the plan file.' : 'Saved plan output contains adapter data.'
    }
  ];
  const rejected = rows.some((row) => row.status === 'blocked');
  return {
    status: rejected ? 'rejected' : 'acceptedForMockScoring',
    adapter: rejected ? null : adapter,
    rows,
    reason: rejected ? 'The adapter draft is rejected before any scoring path.' : 'The adapter draft is accepted for mocked scorecard review only.',
    reviewNote:
      'Adapter validation only. It does not call the engine with annual overrides, change the current withdrawal order, or save output.',
    disposition: 'adapterValidationOnly'
  };
}

export function scoreMockedDrawdownAdapterResult({
  baseline,
  candidate,
  adapterValidation,
  estateTarget = 0
}: {
  baseline: SimulationResult;
  candidate: SimulationResult;
  adapterValidation: DrawdownAdapterValidation;
  estateTarget?: number;
}): MockedExecutionScorecard {
  if (adapterValidation.status !== 'acceptedForMockScoring') {
    return {
      status: 'notReady',
      rows: [],
      reason: adapterValidation.reason,
      reviewNote: 'Mocked scorecard only. Adapter output must be accepted before scoring.',
      disposition: 'mockedScorecardOnly'
    };
  }
  if (!baseline.years?.length || !candidate.years?.length) {
    return {
      status: 'blocked',
      rows: [],
      reason: 'Mocked scorecard needs complete baseline and candidate rows.',
      reviewNote: 'Mocked scorecard only. No product calculation is run.',
      disposition: 'mockedScorecardOnly'
    };
  }
  const baselineMetrics = metricsFromResult(baseline);
  const candidateMetrics = metricsFromResult(candidate);
  const fundedYearsDelta = candidateMetrics.fundedYears - baselineMetrics.fundedYears;
  const lifetimeTaxDelta = candidateMetrics.lifetimeTax - baselineMetrics.lifetimeTax;
  const oasRecoveryTaxDelta = candidateMetrics.oasRecoveryTax - baselineMetrics.oasRecoveryTax;
  const projectedMoneyLeftDelta = candidateMetrics.projectedMoneyLeft - baselineMetrics.projectedMoneyLeft;
  const fundingHarm = fundedYearsDelta < 0 || shortfallEarlier(candidateMetrics.firstShortfallYear, baselineMetrics.firstShortfallYear);
  const estateHarm = estateTarget > 0 && projectedMoneyLeftDelta < 0;
  const rows: MockedExecutionScorecardRow[] = [
    {
      id: 'funding',
      label: 'Funding movement',
      value: signedWhole(fundedYearsDelta),
      status: fundingHarm ? 'blocked' : 'ok',
      detail: fundingHarm ? 'Funding worsens in the mocked scorecard.' : 'Funding does not worsen in the mocked scorecard.'
    },
    {
      id: 'tax',
      label: 'Lifetime tax movement',
      value: moneyDelta(lifetimeTaxDelta),
      status: 'ok',
      detail: 'Tax movement is scored as evidence only.'
    },
    {
      id: 'oasRecovery',
      label: 'OAS recovery movement',
      value: moneyDelta(oasRecoveryTaxDelta),
      status: 'ok',
      detail: 'OAS recovery movement is scored as evidence only.'
    },
    {
      id: 'estate',
      label: 'Projected money left',
      value: moneyDelta(projectedMoneyLeftDelta),
      status: estateHarm ? 'blocked' : 'ok',
      detail: estateHarm ? 'The entered estate goal could be weakened.' : 'No entered estate-goal harm is visible.'
    }
  ];
  const blocked = rows.some((row) => row.status === 'blocked');
  return {
    status: blocked ? 'blocked' : 'reviewOnly',
    rows,
    reason: blocked ? 'The mocked scorecard is blocked by funding or estate harm.' : 'The mocked scorecard produced review evidence only.',
    reviewNote:
      'Mocked scorecard only. It compares supplied rows, does not run product annual overrides, and does not save output.',
    disposition: 'mockedScorecardOnly'
  };
}

export function emptyMockedExecutionScorecard(reason = 'Mocked scorecard is not run in the product UI.'): MockedExecutionScorecard {
  return {
    status: 'notReady',
    rows: [],
    reason,
    reviewNote: 'Mocked scorecard only. No product calculation is run.',
    disposition: 'mockedScorecardOnly'
  };
}

export function selectDrawdownExecutionPrototypeGoNoGo({
  plan,
  boundary,
  adapterValidation,
  scorecard
}: {
  plan: V2PlanPayload;
  boundary: DrawdownExecutionBoundaryDecision;
  adapterValidation: DrawdownAdapterValidation;
  scorecard: MockedExecutionScorecard;
}): DrawdownExecutionPrototypeGoNoGo {
  const savedPlanClean = drawdownExecutionSavedPlanGuard(plan);
  const rows: DrawdownExecutionPrototypeGoNoGoRow[] = [
    {
      id: 'boundary',
      label: 'Boundary decision',
      status: boundary.status === 'readyForTinyExecutionPrototype' ? 'ready' : boundary.status === 'hardenMore' ? 'hold' : 'blocked',
      detail: boundary.headline
    },
    {
      id: 'adapter',
      label: 'Adapter validation',
      status: adapterValidation.status === 'acceptedForMockScoring' ? 'ready' : 'blocked',
      detail: adapterValidation.reason
    },
    {
      id: 'scorecard',
      label: 'Mocked scorecard',
      status: scorecard.status === 'reviewOnly' ? 'ready' : scorecard.status === 'notReady' ? 'hold' : 'blocked',
      detail: scorecard.reason
    },
    {
      id: 'savedPlan',
      label: 'Saved plan audit',
      status: savedPlanClean ? 'ready' : 'blocked',
      detail: savedPlanClean ? 'No execution prototype output is saved.' : 'Saved plan output contains execution prototype data.'
    },
    {
      id: 'productScope',
      label: 'Product scope',
      status: 'ready',
      detail: 'The product remains review-only until a later sprint explicitly adds one real prototype.'
    }
  ];
  const hasBlocked = rows.some((row) => row.status === 'blocked');
  const hasHold = rows.some((row) => row.status === 'hold');
  const status: DrawdownExecutionPrototypeGoNoGo['status'] = hasBlocked ? 'stopBeforeExecution' : hasHold ? 'holdForAdapterGuardrails' : 'readyForOneRealPrototype';
  return {
    status,
    headline:
      status === 'readyForOneRealPrototype'
        ? 'Ready for one real prototype, with strict limits.'
        : status === 'holdForAdapterGuardrails'
          ? 'Hold for more adapter guardrails.'
          : 'Stop before execution.',
    detail:
      'This checkpoint decides whether adapter work is ready for one future real prototype, or whether it should hold or stop before execution.',
    rows,
    reviewNote:
      'Execution prototype go/no-go only. It does not run product annual overrides, change withdrawal order, create account instructions, or save output.',
    disposition: 'executionPrototypeGoNoGoOnly'
  };
}

export function drawdownExecutionSavedPlanGuard(plan: V2PlanPayload): boolean {
  const saved = createPlanFile(plan).plan as Record<string, unknown>;
  return (
    !('drawdownExecutionContract' in saved) &&
    !('drawdownOverrideExecution' in saved) &&
    !('internalDrawdownDryRun' in saved) &&
    !('runtimeDrawdownOverridePayload' in saved) &&
    !('drawdownVisibleReviewGate' in saved) &&
    !('drawdownReviewPreview' in saved) &&
    !('drawdownPhaseReview' in saved) &&
    !('drawdownExecutionBoundaryDecision' in saved) &&
    !('drawdownAnnualOverrideAdapter' in saved) &&
    !('drawdownAdapterValidation' in saved) &&
    !('mockedExecutionScorecard' in saved) &&
    !('drawdownExecutionPrototypeGoNoGo' in saved) &&
    !('annualOverrides' in saved) &&
    !('withdrawalStrategy' in saved)
  );
}

function blockedPreview(reason: string, status: 'heldBack' | 'blocked'): DrawdownReviewPreview {
  return {
    status,
    headline: status === 'blocked' ? 'Drawdown review preview is blocked.' : 'Drawdown review preview is held back.',
    detail: reason,
    rows: [],
    reviewNote:
      'Review preview only. It does not change withdrawal order, run annual overrides in the product, save output, or provide account instructions.',
    disposition: 'detailsPreviewOnly'
  };
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
