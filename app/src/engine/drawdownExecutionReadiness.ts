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

export type DrawdownExecutionPreflightRow = {
  id: 'goNoGo' | 'adapter' | 'accountMix' | 'lockedIn' | 'savedPlan' | 'productPath';
  label: string;
  status: 'ready' | 'hold' | 'blocked';
  detail: string;
};

export type DrawdownExecutionPreflight = {
  status: 'readyForContainedPrototype' | 'holdForMissingEvidence' | 'blocked';
  headline: string;
  detail: string;
  rows: DrawdownExecutionPreflightRow[];
  reviewNote: string;
  disposition: 'executionPreflightOnly';
};

export type DrawdownAdapterAuditTrailRow = {
  id: 'source' | 'year' | 'bucket' | 'amount' | 'direction' | 'guardrails';
  label: string;
  value: string;
  detail: string;
};

export type DrawdownAdapterAuditTrail = {
  status: 'availableForReview' | 'missingDraft';
  rows: DrawdownAdapterAuditTrailRow[];
  reviewNote: string;
  disposition: 'adapterAuditTrailOnly';
};

export type DrawdownExecutionContainmentGuardRow = {
  id: 'detailsOnly' | 'noApply' | 'noEngineOverride' | 'noSave' | 'singleDraft';
  label: string;
  status: 'contained' | 'blocked';
  detail: string;
};

export type DrawdownExecutionContainmentGuard = {
  status: 'containedForReview' | 'blocked';
  rows: DrawdownExecutionContainmentGuardRow[];
  reviewNote: string;
  disposition: 'executionContainmentGuardOnly';
};

export type DrawdownExecutionExampleMatrixCheckpoint = {
  status: 'allClear' | 'needsReview';
  exampleCount: number;
  heldOrBlockedCount: number;
  reviewNote: string;
  disposition: 'executionExampleMatrixCheckpointOnly';
};

export type DrawdownExecutionPhaseCloseoutRow = {
  id: 'preflight' | 'auditTrail' | 'containment' | 'examples' | 'savedPlan';
  label: string;
  status: 'ready' | 'hold' | 'blocked';
  detail: string;
};

export type DrawdownExecutionPhaseCloseout = {
  status: 'readyForNextPhase' | 'holdBeforeNextPhase' | 'stopBeforeNextPhase';
  headline: string;
  detail: string;
  rows: DrawdownExecutionPhaseCloseoutRow[];
  reviewNote: string;
  disposition: 'executionPhaseCloseoutOnly';
};

export type ContainedDrawdownPrototypeEvidenceRow = {
  id: 'funding' | 'tax' | 'oasRecovery' | 'estate' | 'engineBoundary';
  label: string;
  value: string;
  status: 'ok' | 'review' | 'blocked';
  detail: string;
};

export type ContainedDrawdownExecutionPrototype = {
  status: 'reviewOnly' | 'heldBack' | 'blocked';
  headline: string;
  detail: string;
  rows: ContainedDrawdownPrototypeEvidenceRow[];
  reviewNote: string;
  disposition: 'containedExecutionPrototypeOnly';
};

export type ContainedDrawdownPrototypeSummaryRow = {
  id: 'prototype' | 'harm' | 'copy' | 'savedPlan';
  label: string;
  status: 'ready' | 'hold' | 'blocked';
  detail: string;
};

export type ContainedDrawdownPrototypeSummary = {
  status: 'readyForReview' | 'holdForReview' | 'blocked';
  headline: string;
  detail: string;
  rows: ContainedDrawdownPrototypeSummaryRow[];
  reviewNote: string;
  disposition: 'containedPrototypeSummaryOnly';
};

export type ContainedDrawdownMaterialityRow = {
  id: 'funding' | 'tax' | 'oasRecovery' | 'estate';
  label: string;
  status: 'material' | 'immaterial' | 'review' | 'blocked';
  detail: string;
};

export type ContainedDrawdownMateriality = {
  status: 'materialForReview' | 'minorMovement' | 'blocked';
  headline: string;
  rows: ContainedDrawdownMaterialityRow[];
  reviewNote: string;
  disposition: 'containedPrototypeMaterialityOnly';
};

export type ContainedDrawdownExplanationRow = {
  id: 'whyMoved' | 'whyCautious' | 'whatItDoesNotMean';
  label: string;
  detail: string;
};

export type ContainedDrawdownExplanation = {
  status: 'available' | 'heldBack' | 'blocked';
  headline: string;
  rows: ContainedDrawdownExplanationRow[];
  reviewNote: string;
  disposition: 'containedPrototypeExplanationOnly';
};

export type ContainedDrawdownLimitationRow = {
  id: 'scenarioOnly' | 'noAnnualOverride' | 'notAdvice' | 'needsReview';
  label: string;
  detail: string;
};

export type ContainedDrawdownLimitations = {
  status: 'visible';
  rows: ContainedDrawdownLimitationRow[];
  reviewNote: string;
  disposition: 'containedPrototypeLimitationsOnly';
};

export type ContainedDrawdownUsefulnessCloseoutRow = {
  id: 'summary' | 'materiality' | 'explanation' | 'limitations' | 'savedPlan';
  label: string;
  status: 'ready' | 'hold' | 'blocked';
  detail: string;
};

export type ContainedDrawdownUsefulnessCloseout = {
  status: 'usefulForReview' | 'holdForClearerEvidence' | 'notUseful';
  headline: string;
  detail: string;
  rows: ContainedDrawdownUsefulnessCloseoutRow[];
  reviewNote: string;
  disposition: 'containedPrototypeUsefulnessOnly';
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

export function selectDrawdownExecutionPreflight({
  plan,
  adapterValidation,
  goNoGo
}: {
  plan: V2PlanPayload;
  adapterValidation: DrawdownAdapterValidation;
  goNoGo: DrawdownExecutionPrototypeGoNoGo;
}): DrawdownExecutionPreflight {
  const savedPlanClean = drawdownExecutionSavedPlanGuard(plan);
  const hasLockedIn = n(plan.p1?.lira) + n(plan.p1?.lif) + n(plan.p2?.lira) + n(plan.p2?.lif) > 0;
  const accountMixCount = (bucketBalance(plan, 'registered') > 0 ? 1 : 0) + (bucketBalance(plan, 'tfsa') > 0 ? 1 : 0) + (bucketBalance(plan, 'nonRegistered') > 0 ? 1 : 0) + (bucketBalance(plan, 'cash') > 0 ? 1 : 0);
  const rows: DrawdownExecutionPreflightRow[] = [
    {
      id: 'goNoGo',
      label: 'Prototype checkpoint',
      status: goNoGo.status === 'readyForOneRealPrototype' ? 'ready' : goNoGo.status === 'holdForAdapterGuardrails' ? 'hold' : 'blocked',
      detail: goNoGo.headline
    },
    {
      id: 'adapter',
      label: 'Draft adapter',
      status: adapterValidation.status === 'acceptedForMockScoring' ? 'ready' : 'blocked',
      detail: adapterValidation.reason
    },
    {
      id: 'accountMix',
      label: 'Account mix',
      status: accountMixCount >= 2 ? 'ready' : 'hold',
      detail:
        accountMixCount >= 2
          ? 'More than one account bucket is available for comparison evidence.'
          : 'A thin account mix means the next prototype needs extra caution.'
    },
    {
      id: 'lockedIn',
      label: 'Locked-in accounts',
      status: hasLockedIn ? 'hold' : 'ready',
      detail:
        hasLockedIn
          ? 'Locked-in accounts are present, so any later prototype must keep LIF/LIRA limits visible.'
          : 'No locked-in account balance is entered for this plan.'
    },
    {
      id: 'savedPlan',
      label: 'Saved plan boundary',
      status: savedPlanClean ? 'ready' : 'blocked',
      detail: savedPlanClean ? 'No execution preflight output is saved.' : 'Saved plan output contains execution preflight data.'
    },
    {
      id: 'productPath',
      label: 'Product path',
      status: 'hold',
      detail: 'The product path is still intentionally closed until a later sprint adds one explicit prototype.'
    }
  ];
  const hasBlocked = rows.some((row) => row.status === 'blocked');
  const hasHold = rows.some((row) => row.status === 'hold');
  const status: DrawdownExecutionPreflight['status'] = hasBlocked ? 'blocked' : hasHold ? 'holdForMissingEvidence' : 'readyForContainedPrototype';
  return {
    status,
    headline:
      status === 'readyForContainedPrototype'
        ? 'Preflight is ready for a contained prototype.'
        : status === 'blocked'
          ? 'Preflight is blocked.'
          : 'Preflight should hold before a real prototype.',
    detail:
      'This preflight checks whether the next drawdown work has enough evidence and boundaries before any product execution path is opened.',
    rows,
    reviewNote:
      'Preflight only. It does not run annual overrides, change withdrawal order, create account instructions, or save output.',
    disposition: 'executionPreflightOnly'
  };
}

export function selectDrawdownAdapterAuditTrail(adapterValidation: DrawdownAdapterValidation): DrawdownAdapterAuditTrail {
  const adapter = adapterValidation.adapter;
  if (!adapter) {
    return {
      status: 'missingDraft',
      rows: [],
      reviewNote: 'Adapter audit trail only. No draft adapter is available for review.',
      disposition: 'adapterAuditTrailOnly'
    };
  }
  return {
    status: 'availableForReview',
    rows: [
      {
        id: 'source',
        label: 'Evidence source',
        value: 'Review draft',
        detail: 'The adapter comes from the existing drawdown evidence, not from a user-facing action.'
      },
      {
        id: 'year',
        label: 'Year',
        value: String(adapter.year),
        detail: 'The draft points to one projection year for later review.'
      },
      {
        id: 'bucket',
        label: 'Account area',
        value: accountBucketLabel(adapter.accountBucket),
        detail: 'The draft uses broad account areas only.'
      },
      {
        id: 'amount',
        label: 'Amount band',
        value: moneyDelta(adapter.amount).replace('+', ''),
        detail: 'The amount remains a bounded review band, not an instruction.'
      },
      {
        id: 'direction',
        label: 'Direction',
        value: adapter.direction === 'increase' ? 'Test more from this area' : 'Test less from this area',
        detail: 'Direction describes a future test shape only.'
      },
      {
        id: 'guardrails',
        label: 'Guardrails',
        value: adapterValidation.status === 'acceptedForMockScoring' ? 'Passed draft checks' : 'Blocked',
        detail: adapterValidation.reviewNote
      }
    ],
    reviewNote:
      'Adapter audit trail only. It explains the draft shape without creating detailed account instructions or saving output.',
    disposition: 'adapterAuditTrailOnly'
  };
}

export function selectDrawdownExecutionContainmentGuard({
  plan,
  adapterValidation
}: {
  plan: V2PlanPayload;
  adapterValidation: DrawdownAdapterValidation;
}): DrawdownExecutionContainmentGuard {
  const savedPlanClean = drawdownExecutionSavedPlanGuard(plan);
  const rows: DrawdownExecutionContainmentGuardRow[] = [
    {
      id: 'detailsOnly',
      label: 'Details only',
      status: 'contained',
      detail: 'The execution checkpoint stays in Details and does not add Overview density.'
    },
    {
      id: 'noApply',
      label: 'No plan action',
      status: 'contained',
      detail: 'There is no action to change the plan from this checkpoint.'
    },
    {
      id: 'noEngineOverride',
      label: 'No override calculation',
      status: 'contained',
      detail: 'The product calculation keeps the current withdrawal order and empty annual overrides.'
    },
    {
      id: 'noSave',
      label: 'No saved output',
      status: savedPlanClean ? 'contained' : 'blocked',
      detail: savedPlanClean ? 'No execution checkpoint output is saved.' : 'Saved plan output contains execution checkpoint data.'
    },
    {
      id: 'singleDraft',
      label: 'One draft shape',
      status: adapterValidation.adapter ? 'contained' : 'blocked',
      detail: adapterValidation.adapter ? 'Only one draft shape is available for review.' : 'No accepted draft shape is available.'
    }
  ];
  const blocked = rows.some((row) => row.status === 'blocked');
  return {
    status: blocked ? 'blocked' : 'containedForReview',
    rows,
    reviewNote:
      'Containment guard only. It keeps this work as review evidence and does not open a product execution path.',
    disposition: 'executionContainmentGuardOnly'
  };
}

export function selectDrawdownExecutionExampleMatrixCheckpoint({
  exampleCount,
  heldOrBlockedCount
}: {
  exampleCount: number;
  heldOrBlockedCount: number;
}): DrawdownExecutionExampleMatrixCheckpoint {
  return {
    status: heldOrBlockedCount === 0 ? 'allClear' : 'needsReview',
    exampleCount,
    heldOrBlockedCount,
    reviewNote:
      'Example matrix checkpoint only. It checks the built-in examples and does not persist optimizer or drawdown execution output.',
    disposition: 'executionExampleMatrixCheckpointOnly'
  };
}

export function selectDrawdownExecutionPhaseCloseout({
  plan,
  preflight,
  auditTrail,
  containment,
  exampleCheckpoint = selectDrawdownExecutionExampleMatrixCheckpoint({ exampleCount: 0, heldOrBlockedCount: 0 })
}: {
  plan: V2PlanPayload;
  preflight: DrawdownExecutionPreflight;
  auditTrail: DrawdownAdapterAuditTrail;
  containment: DrawdownExecutionContainmentGuard;
  exampleCheckpoint?: DrawdownExecutionExampleMatrixCheckpoint;
}): DrawdownExecutionPhaseCloseout {
  const savedPlanClean = drawdownExecutionSavedPlanGuard(plan);
  const rows: DrawdownExecutionPhaseCloseoutRow[] = [
    {
      id: 'preflight',
      label: 'Preflight',
      status: preflight.status === 'readyForContainedPrototype' ? 'ready' : preflight.status === 'blocked' ? 'blocked' : 'hold',
      detail: preflight.headline
    },
    {
      id: 'auditTrail',
      label: 'Audit trail',
      status: auditTrail.status === 'availableForReview' ? 'ready' : 'hold',
      detail: auditTrail.status === 'availableForReview' ? 'Draft adapter evidence is explainable.' : 'No draft adapter audit trail is ready.'
    },
    {
      id: 'containment',
      label: 'Containment',
      status: containment.status === 'containedForReview' ? 'ready' : 'blocked',
      detail: containment.reviewNote
    },
    {
      id: 'examples',
      label: 'Example matrix',
      status: exampleCheckpoint.status === 'allClear' ? 'ready' : 'hold',
      detail:
        exampleCheckpoint.status === 'allClear'
          ? `${exampleCheckpoint.exampleCount} built-in examples passed the execution checkpoint.`
          : `${exampleCheckpoint.heldOrBlockedCount} built-in examples need review before the next phase.`
    },
    {
      id: 'savedPlan',
      label: 'Saved plan audit',
      status: savedPlanClean ? 'ready' : 'blocked',
      detail: savedPlanClean ? 'No execution phase output is saved.' : 'Saved plan output contains execution phase data.'
    }
  ];
  const hasBlocked = rows.some((row) => row.status === 'blocked');
  const hasHold = rows.some((row) => row.status === 'hold');
  const status: DrawdownExecutionPhaseCloseout['status'] = hasBlocked ? 'stopBeforeNextPhase' : hasHold ? 'holdBeforeNextPhase' : 'readyForNextPhase';
  return {
    status,
    headline:
      status === 'readyForNextPhase'
        ? 'Ready for the next drawdown phase.'
        : status === 'holdBeforeNextPhase'
          ? 'Hold before the next drawdown phase.'
          : 'Stop before the next drawdown phase.',
    detail:
      'This closeout summarizes whether preflight, audit trail, containment, examples, and saved-plan boundaries are ready for the next phase.',
    rows,
    reviewNote:
      'Phase closeout only. It does not run annual overrides, change withdrawal order, create account instructions, or save output.',
    disposition: 'executionPhaseCloseoutOnly'
  };
}

export function runContainedDrawdownExecutionPrototype({
  plan,
  adapterValidation,
  containment,
  runner = runSimulationSafely
}: {
  plan: V2PlanPayload;
  adapterValidation: DrawdownAdapterValidation;
  containment: DrawdownExecutionContainmentGuard;
  runner?: (plan: V2PlanPayload, config: SimulationConfig) => SimulationResult;
}): ContainedDrawdownExecutionPrototype {
  if (adapterValidation.status !== 'acceptedForMockScoring' || !adapterValidation.adapter) {
    return heldContainedPrototype('The contained prototype is held because no accepted draft adapter is available.');
  }
  if (containment.status !== 'containedForReview') {
    return blockedContainedPrototype('The contained prototype is blocked by the containment guard.');
  }
  if (!drawdownExecutionSavedPlanGuard(plan)) {
    return blockedContainedPrototype('The contained prototype is blocked because drawdown execution output appears in the saved plan boundary.');
  }

  const amount = Math.min(adapterValidation.adapter.amount, 10000);
  const baseline = runner(plan, baselineConfigForPlan(plan));
  const candidate = runner(plan, containedPrototypeConfigForPlan(plan, amount));
  if (!baseline.years?.length || !candidate.years?.length) {
    return blockedContainedPrototype('The contained prototype could not produce complete projection rows.');
  }

  const baselineMetrics = metricsFromResult(baseline);
  const candidateMetrics = metricsFromResult(candidate);
  const fundedYearsDelta = candidateMetrics.fundedYears - baselineMetrics.fundedYears;
  const lifetimeTaxDelta = candidateMetrics.lifetimeTax - baselineMetrics.lifetimeTax;
  const oasRecoveryTaxDelta = candidateMetrics.oasRecoveryTax - baselineMetrics.oasRecoveryTax;
  const projectedMoneyLeftDelta = candidateMetrics.projectedMoneyLeft - baselineMetrics.projectedMoneyLeft;
  const fundingHarm = fundedYearsDelta < 0 || shortfallEarlier(candidateMetrics.firstShortfallYear, baselineMetrics.firstShortfallYear);
  const estateHarm = n(plan.inheritance) > 0 && projectedMoneyLeftDelta < 0;
  const blocked = fundingHarm || estateHarm;

  return {
    status: blocked ? 'blocked' : 'reviewOnly',
    headline: blocked ? 'Contained drawdown prototype is blocked.' : 'Contained drawdown prototype is ready for review.',
    detail:
      'This uses existing engine scenario plumbing to compare one bounded draft shape. It does not execute annual overrides or change the plan.',
    rows: [
      {
        id: 'funding',
        label: 'Funding movement',
        value: signedWhole(fundedYearsDelta),
        status: fundingHarm ? 'blocked' : 'ok',
        detail: fundingHarm ? 'Funding worsens in the contained prototype.' : 'Funding does not worsen in the contained prototype.'
      },
      {
        id: 'tax',
        label: 'Lifetime tax movement',
        value: moneyDelta(lifetimeTaxDelta),
        status: lifetimeTaxDelta > 0 ? 'review' : 'ok',
        detail: 'Compares the current plan with one bounded contained scenario.'
      },
      {
        id: 'oasRecovery',
        label: 'OAS recovery movement',
        value: moneyDelta(oasRecoveryTaxDelta),
        status: oasRecoveryTaxDelta > 0 ? 'review' : 'ok',
        detail: 'Keeps benefit recovery movement visible without creating a household action.'
      },
      {
        id: 'estate',
        label: 'Projected money left',
        value: moneyDelta(projectedMoneyLeftDelta),
        status: estateHarm ? 'blocked' : 'ok',
        detail: estateHarm ? 'The entered estate goal could be weakened.' : 'No entered estate-goal harm is visible.'
      },
      {
        id: 'engineBoundary',
        label: 'Calculation boundary',
        value: 'Scenario only',
        status: 'review',
        detail: 'This uses the existing scenario engine path, not custom year-by-year withdrawal overrides.'
      }
    ],
    reviewNote:
      'Contained prototype only. It does not apply a strategy, does not run custom annual overrides, does not create detailed account instructions, and does not save output.',
    disposition: 'containedExecutionPrototypeOnly'
  };
}

export function selectContainedDrawdownPrototypeSummary({
  plan,
  prototype
}: {
  plan: V2PlanPayload;
  prototype: ContainedDrawdownExecutionPrototype;
}): ContainedDrawdownPrototypeSummary {
  const savedPlanClean = drawdownExecutionSavedPlanGuard(plan);
  const blockedEvidence = prototype.rows.some((row) => row.status === 'blocked');
  const rows: ContainedDrawdownPrototypeSummaryRow[] = [
    {
      id: 'prototype',
      label: 'Contained prototype',
      status: prototype.status === 'reviewOnly' ? 'ready' : prototype.status === 'heldBack' ? 'hold' : 'blocked',
      detail: prototype.headline
    },
    {
      id: 'harm',
      label: 'Harm check',
      status: blockedEvidence || prototype.status === 'blocked' ? 'blocked' : 'ready',
      detail: blockedEvidence ? 'Funding or estate harm is visible.' : 'No funding or entered estate-goal harm is visible.'
    },
    {
      id: 'copy',
      label: 'Copy boundary',
      status: 'ready',
      detail: 'Copy stays framed as review evidence, not instructions or advice.'
    },
    {
      id: 'savedPlan',
      label: 'Saved plan audit',
      status: savedPlanClean ? 'ready' : 'blocked',
      detail: savedPlanClean ? 'No contained prototype output is saved.' : 'Saved plan output contains contained prototype data.'
    }
  ];
  const hasBlocked = rows.some((row) => row.status === 'blocked');
  const hasHold = rows.some((row) => row.status === 'hold');
  return {
    status: hasBlocked ? 'blocked' : hasHold ? 'holdForReview' : 'readyForReview',
    headline: hasBlocked
      ? 'Contained prototype is blocked.'
      : hasHold
        ? 'Contained prototype is held for review.'
        : 'Contained prototype is ready for review.',
    detail:
      'This summary decides whether the one contained scenario can be read as review evidence before any broader execution work.',
    rows,
    reviewNote:
      'Contained prototype summary only. It does not change withdrawal order, apply a strategy, or save output.',
    disposition: 'containedPrototypeSummaryOnly'
  };
}

export function selectContainedDrawdownMateriality(prototype: ContainedDrawdownExecutionPrototype): ContainedDrawdownMateriality {
  if (prototype.status === 'blocked') {
    return {
      status: 'blocked',
      headline: 'Materiality is blocked by harm checks.',
      rows: prototype.rows
        .filter((row): row is ContainedDrawdownPrototypeEvidenceRow & { id: 'funding' | 'tax' | 'oasRecovery' | 'estate' } =>
          ['funding', 'tax', 'oasRecovery', 'estate'].includes(row.id)
        )
        .map((row) => ({
          id: row.id,
          label: row.label,
          status: row.status === 'blocked' ? 'blocked' : 'review',
          detail: row.detail
        })),
      reviewNote: 'Materiality check only. Blocked evidence is not treated as useful household guidance.',
      disposition: 'containedPrototypeMaterialityOnly'
    };
  }

  const rows: ContainedDrawdownMaterialityRow[] = prototype.rows
    .filter((row): row is ContainedDrawdownPrototypeEvidenceRow & { id: 'funding' | 'tax' | 'oasRecovery' | 'estate' } =>
      ['funding', 'tax', 'oasRecovery', 'estate'].includes(row.id)
    )
    .map((row) => {
      const movement = Math.abs(numberFromDisplay(row.value));
      const material = row.id === 'funding' ? movement >= 1 : movement >= 500;
      return {
        id: row.id,
        label: row.label,
        status: row.status === 'review' ? 'review' : material ? 'material' : 'immaterial',
        detail: material
          ? `${row.label} moved enough to keep in review.`
          : `${row.label} did not move enough to treat as a strong signal.`
      };
    });
  const hasMaterial = rows.some((row) => row.status === 'material' || row.status === 'review');
  return {
    status: hasMaterial ? 'materialForReview' : 'minorMovement',
    headline: hasMaterial ? 'Contained prototype has reviewable movement.' : 'Contained prototype movement is small.',
    rows,
    reviewNote:
      'Materiality check only. It helps decide whether the contained prototype is worth reading, not whether to change the plan.',
    disposition: 'containedPrototypeMaterialityOnly'
  };
}

export function selectContainedDrawdownExplanation({
  prototype,
  materiality
}: {
  prototype: ContainedDrawdownExecutionPrototype;
  materiality: ContainedDrawdownMateriality;
}): ContainedDrawdownExplanation {
  const taxRow = prototype.rows.find((row) => row.id === 'tax');
  const oasRow = prototype.rows.find((row) => row.id === 'oasRecovery');
  const estateRow = prototype.rows.find((row) => row.id === 'estate');
  const status: ContainedDrawdownExplanation['status'] =
    prototype.status === 'blocked' ? 'blocked' : prototype.status === 'heldBack' || materiality.status === 'minorMovement' ? 'heldBack' : 'available';

  return {
    status,
    headline:
      status === 'available'
        ? 'Why the contained prototype moved'
        : status === 'blocked'
          ? 'Why the contained prototype is blocked'
          : 'Why the contained prototype is only a light signal',
    rows: [
      {
        id: 'whyMoved',
        label: 'What moved',
        detail:
          status === 'blocked'
            ? 'The contained scenario showed a funding or estate concern, so it is not useful as a next-step signal.'
            : `The main movements are lifetime tax ${taxRow?.value || '$0'}, OAS recovery ${oasRow?.value || '$0'}, and projected money left ${estateRow?.value || '$0'}.`
      },
      {
        id: 'whyCautious',
        label: 'Why to be cautious',
        detail:
          materiality.status === 'minorMovement'
            ? 'The movement is small, so this should not distract from the main retirement answer.'
            : 'This is one bounded scenario, not a full tax-aware drawdown plan.'
      },
      {
        id: 'whatItDoesNotMean',
        label: 'What it does not mean',
        detail: 'It does not mean the household should change withdrawals or use this as filing guidance.'
      }
    ],
    reviewNote:
      'Explanation only. It translates the contained prototype into review language without creating a recommendation.',
    disposition: 'containedPrototypeExplanationOnly'
  };
}

export function selectContainedDrawdownLimitations(): ContainedDrawdownLimitations {
  return {
    status: 'visible',
    rows: [
      {
        id: 'scenarioOnly',
        label: 'Scenario only',
        detail: 'This compares one bounded scenario against the current plan.'
      },
      {
        id: 'noAnnualOverride',
        label: 'No custom annual override',
        detail: 'The calculation does not run custom year-by-year withdrawal instructions.'
      },
      {
        id: 'notAdvice',
        label: 'Not advice',
        detail: 'The output is for review and does not tell the household what to file or withdraw.'
      },
      {
        id: 'needsReview',
        label: 'Needs review',
        detail: 'Tax, locked-in account, survivor, estate, and cash-flow details still need household review.'
      }
    ],
    reviewNote:
      'Limitations only. These notes keep the contained prototype from sounding more certain than it is.',
    disposition: 'containedPrototypeLimitationsOnly'
  };
}

export function selectContainedDrawdownUsefulnessCloseout({
  plan,
  summary,
  materiality,
  explanation,
  limitations
}: {
  plan: V2PlanPayload;
  summary: ContainedDrawdownPrototypeSummary;
  materiality: ContainedDrawdownMateriality;
  explanation: ContainedDrawdownExplanation;
  limitations: ContainedDrawdownLimitations;
}): ContainedDrawdownUsefulnessCloseout {
  const savedPlanClean = drawdownExecutionSavedPlanGuard(plan);
  const rows: ContainedDrawdownUsefulnessCloseoutRow[] = [
    {
      id: 'summary',
      label: 'Prototype summary',
      status: summary.status === 'readyForReview' ? 'ready' : summary.status === 'holdForReview' ? 'hold' : 'blocked',
      detail: summary.headline
    },
    {
      id: 'materiality',
      label: 'Materiality',
      status: materiality.status === 'materialForReview' ? 'ready' : materiality.status === 'minorMovement' ? 'hold' : 'blocked',
      detail: materiality.headline
    },
    {
      id: 'explanation',
      label: 'Explanation',
      status: explanation.status === 'available' ? 'ready' : explanation.status === 'heldBack' ? 'hold' : 'blocked',
      detail: explanation.headline
    },
    {
      id: 'limitations',
      label: 'Limitations',
      status: limitations.status === 'visible' ? 'ready' : 'hold',
      detail: limitations.reviewNote
    },
    {
      id: 'savedPlan',
      label: 'Saved plan audit',
      status: savedPlanClean ? 'ready' : 'blocked',
      detail: savedPlanClean ? 'No contained prototype usefulness output is saved.' : 'Saved plan output contains contained prototype usefulness data.'
    }
  ];
  const hasBlocked = rows.some((row) => row.status === 'blocked');
  const hasHold = rows.some((row) => row.status === 'hold');
  return {
    status: hasBlocked ? 'notUseful' : hasHold ? 'holdForClearerEvidence' : 'usefulForReview',
    headline: hasBlocked
      ? 'Contained prototype is not useful yet.'
      : hasHold
        ? 'Contained prototype needs clearer evidence.'
        : 'Contained prototype is useful for review.',
    detail:
      'This closeout checks whether the contained prototype is clear enough to keep in Details before broader drawdown work.',
    rows,
    reviewNote:
      'Usefulness closeout only. It does not change withdrawal order, apply a strategy, or save output.',
    disposition: 'containedPrototypeUsefulnessOnly'
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
    !('drawdownExecutionPreflight' in saved) &&
    !('drawdownAdapterAuditTrail' in saved) &&
    !('drawdownExecutionContainmentGuard' in saved) &&
    !('drawdownExecutionExampleMatrixCheckpoint' in saved) &&
    !('drawdownExecutionPhaseCloseout' in saved) &&
    !('containedDrawdownExecutionPrototype' in saved) &&
    !('containedDrawdownPrototypeSummary' in saved) &&
    !('containedDrawdownMateriality' in saved) &&
    !('containedDrawdownExplanation' in saved) &&
    !('containedDrawdownLimitations' in saved) &&
    !('containedDrawdownUsefulnessCloseout' in saved) &&
    !('annualOverrides' in saved) &&
    !('withdrawalStrategy' in saved)
  );
}

function containedPrototypeConfigForPlan(plan: V2PlanPayload, amount: number): SimulationConfig {
  return {
    ...baselineConfigForPlan(plan),
    meltdown: true,
    withdrawalOrder: 'meltdown',
    meltdownDraw60_64: amount,
    meltdownDraw65plus: amount
  };
}

function heldContainedPrototype(reason: string): ContainedDrawdownExecutionPrototype {
  return {
    status: 'heldBack',
    headline: 'Contained drawdown prototype is held back.',
    detail: reason,
    rows: [],
    reviewNote:
      'Contained prototype only. It does not apply a strategy, does not run custom annual overrides, and does not save output.',
    disposition: 'containedExecutionPrototypeOnly'
  };
}

function blockedContainedPrototype(reason: string): ContainedDrawdownExecutionPrototype {
  return {
    status: 'blocked',
    headline: 'Contained drawdown prototype is blocked.',
    detail: reason,
    rows: [],
    reviewNote:
      'Contained prototype only. It does not apply a strategy, does not run custom annual overrides, and does not save output.',
    disposition: 'containedExecutionPrototypeOnly'
  };
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

function accountBucketLabel(bucket: DrawdownExecutionAccountBucket): string {
  if (bucket === 'registered') return 'Registered accounts';
  if (bucket === 'tfsa') return 'TFSA';
  if (bucket === 'nonRegistered') return 'Non-registered accounts';
  return 'Cash reserve';
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

function numberFromDisplay(value: string): number {
  const normalized = value.replace(/[$,+\s]/g, '');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}
