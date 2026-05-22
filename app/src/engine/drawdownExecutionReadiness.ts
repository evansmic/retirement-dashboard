import { createPlanFile } from '../data/planFile';
import type { SimulationResult, V2PlanPayload } from '../types/plan';
import type { DrawdownComparisonDecisionGate, RealDrawdownComparisonResult } from './drawdownComparison';
import { runSimulationSafely, type SimulationConfig } from './runSimulation';
import type { DetailedStressV1DecisionCloseout } from './stressSelectors';

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

export type ContainedDrawdownDetailsDensityRow = {
  id: 'sectionCount' | 'rowCount' | 'overviewBoundary';
  label: string;
  status: 'ok' | 'hold';
  detail: string;
};

export type ContainedDrawdownDetailsDensity = {
  status: 'compactEnough' | 'tooDense';
  visibleSectionCount: number;
  visibleRowCount: number;
  rows: ContainedDrawdownDetailsDensityRow[];
  reviewNote: string;
  disposition: 'containedPrototypeDensityOnly';
};

export type ContainedDrawdownReviewChecklistRow = {
  id: 'readMainAnswer' | 'checkMateriality' | 'reviewLimits' | 'keepPlanUnchanged';
  label: string;
  status: 'ready' | 'hold' | 'blocked';
  detail: string;
};

export type ContainedDrawdownReviewChecklist = {
  status: 'readyForReview' | 'holdBeforeReview' | 'blocked';
  rows: ContainedDrawdownReviewChecklistRow[];
  reviewNote: string;
  disposition: 'containedPrototypeChecklistOnly';
};

export type ContainedDrawdownExampleGate = {
  status: 'examplesClear' | 'needsExampleReview';
  exampleCount: number;
  blockedCount: number;
  heldCount: number;
  reviewNote: string;
  disposition: 'containedPrototypeExampleGateOnly';
};

export type ContainedDrawdownCopyGuardRow = {
  id: 'recommendation' | 'certainty' | 'instruction' | 'savedPlan';
  label: string;
  status: 'ok' | 'blocked';
  detail: string;
};

export type ContainedDrawdownCopyGuard = {
  status: 'copyClear' | 'blocked';
  rows: ContainedDrawdownCopyGuardRow[];
  reviewNote: string;
  disposition: 'containedPrototypeCopyGuardOnly';
};

export type ContainedDrawdownProductGoNoGoRow = {
  id: 'usefulness' | 'density' | 'checklist' | 'examples' | 'copy' | 'savedPlan';
  label: string;
  status: 'ready' | 'hold' | 'blocked';
  detail: string;
};

export type ContainedDrawdownProductGoNoGo = {
  status: 'keepInDetails' | 'holdForUxPolish' | 'doNotPromote';
  headline: string;
  detail: string;
  rows: ContainedDrawdownProductGoNoGoRow[];
  reviewNote: string;
  disposition: 'containedPrototypeProductGoNoGoOnly';
};

export type ContainedDrawdownPromotionReadinessRow = {
  id: 'productGoNoGo' | 'evidenceClarity' | 'detailsContainment' | 'savedPlan';
  label: string;
  status: 'ready' | 'hold' | 'blocked';
  detail: string;
};

export type ContainedDrawdownPromotionReadiness = {
  status: 'readyForLaterUx' | 'holdInDetails' | 'blocked';
  headline: string;
  detail: string;
  rows: ContainedDrawdownPromotionReadinessRow[];
  reviewNote: string;
  disposition: 'containedPrototypePromotionReadinessOnly';
};

export type ContainedDrawdownNextStepGuideRow = {
  id: 'readAnswer' | 'checkEvidence' | 'reviewInputs' | 'waitForExecution';
  label: string;
  status: 'review' | 'hold';
  detail: string;
};

export type ContainedDrawdownNextStepGuide = {
  status: 'available' | 'held';
  rows: ContainedDrawdownNextStepGuideRow[];
  reviewNote: string;
  disposition: 'containedPrototypeNextStepGuideOnly';
};

export type ContainedDrawdownBlockerRegisterRow = {
  id: 'blockedSignals' | 'heldSignals' | 'savedPlan' | 'executionBoundary';
  label: string;
  status: 'clear' | 'hold' | 'blocked';
  detail: string;
};

export type ContainedDrawdownBlockerRegister = {
  status: 'clear' | 'hasHolds' | 'blocked';
  blockedCount: number;
  holdCount: number;
  rows: ContainedDrawdownBlockerRegisterRow[];
  reviewNote: string;
  disposition: 'containedPrototypeBlockerRegisterOnly';
};

export type ContainedDrawdownExamplePromotionGate = {
  status: 'examplesClear' | 'needsExampleReview';
  exampleCount: number;
  heldOrBlockedCount: number;
  reviewNote: string;
  disposition: 'containedPrototypeExamplePromotionGateOnly';
};

export type ContainedDrawdownPhaseMilestoneCloseoutRow = {
  id: 'promotion' | 'nextSteps' | 'blockers' | 'examples' | 'savedPlan';
  label: string;
  status: 'ready' | 'hold' | 'blocked';
  detail: string;
};

export type ContainedDrawdownPhaseMilestoneCloseout = {
  status: 'readyForNextDesignPhase' | 'holdBeforeNextPhase' | 'stopBeforeNextPhase';
  headline: string;
  detail: string;
  rows: ContainedDrawdownPhaseMilestoneCloseoutRow[];
  reviewNote: string;
  disposition: 'containedPrototypePhaseMilestoneOnly';
};

export type TaxAwareDrawdownV1ExecutionIntentRow = {
  id: 'v1Scope' | 'phaseMilestone' | 'executionBoundary' | 'savedPlan';
  label: string;
  status: 'ready' | 'hold' | 'blocked';
  detail: string;
};

export type TaxAwareDrawdownV1ExecutionIntent = {
  status: 'readyForBoundedExecution' | 'holdForReadiness' | 'blocked';
  headline: string;
  detail: string;
  rows: TaxAwareDrawdownV1ExecutionIntentRow[];
  reviewNote: string;
  disposition: 'v1DrawdownExecutionIntentOnly';
};

export type TaxAwareDrawdownV1ExecutionCandidate = {
  status: 'ready' | 'hold' | 'blocked';
  candidateId: 'boundedRegisteredTimingExecution' | null;
  label: string;
  amount: number;
  config: SimulationConfig | null;
  rows: Array<{
    id: 'intent' | 'adapter' | 'amount' | 'enginePath';
    label: string;
    status: 'ready' | 'hold' | 'blocked';
    detail: string;
  }>;
  reviewNote: string;
  disposition: 'v1DrawdownExecutionCandidateOnly';
};

export type TaxAwareDrawdownV1ExecutionResult = {
  status: 'reviewOnly' | 'blocked' | 'notReady';
  baseline: ReturnType<typeof metricsFromResult> | null;
  candidate: ReturnType<typeof metricsFromResult> | null;
  rows: Array<{
    id: 'funding' | 'tax' | 'oasRecovery' | 'estate';
    label: string;
    value: string;
    status: 'ok' | 'review' | 'blocked';
    detail: string;
  }>;
  reason: string;
  reviewNote: string;
  disposition: 'v1DrawdownExecutionResultOnly';
};

export type TaxAwareDrawdownV1ExecutionReview = {
  status: 'readyForUserReview' | 'holdForReview' | 'blocked';
  headline: string;
  detail: string;
  rows: Array<{
    id: 'intent' | 'candidate' | 'execution' | 'savedPlan';
    label: string;
    status: 'ready' | 'hold' | 'blocked';
    detail: string;
  }>;
  reviewNote: string;
  disposition: 'v1DrawdownExecutionReviewOnly';
};

export type TaxAwareDrawdownV1ExampleGate = {
  status: 'examplesClear' | 'needsExampleReview';
  exampleCount: number;
  heldOrBlockedCount: number;
  reviewNote: string;
  disposition: 'v1DrawdownExecutionExampleGateOnly';
};

export type TaxAwareDrawdownV1PhaseCloseout = {
  status: 'readyForConsumerUx' | 'holdForMoreGuardrails' | 'stopBeforeConsumerUx';
  headline: string;
  detail: string;
  rows: Array<{
    id: 'intent' | 'review' | 'examples' | 'savedPlan';
    label: string;
    status: 'ready' | 'hold' | 'blocked';
    detail: string;
  }>;
  reviewNote: string;
  disposition: 'v1DrawdownExecutionPhaseCloseoutOnly';
};

export type TaxAwareDrawdownV1ConsumerSummary = {
  status: 'clearForReview' | 'needsCare' | 'blocked';
  headline: string;
  detail: string;
  rows: Array<{
    id: 'whatRan' | 'whatChanged' | 'whatDidNotChange';
    label: string;
    status: 'ok' | 'review' | 'blocked';
    detail: string;
  }>;
  reviewNote: string;
  disposition: 'v1DrawdownConsumerSummaryOnly';
};

export type TaxAwareDrawdownV1SafetyChecklist = {
  status: 'ready' | 'hold' | 'blocked';
  rows: Array<{
    id: 'funding' | 'estate' | 'savedPlan' | 'instructions';
    label: string;
    status: 'ready' | 'hold' | 'blocked';
    detail: string;
  }>;
  reviewNote: string;
  disposition: 'v1DrawdownSafetyChecklistOnly';
};

export type TaxAwareDrawdownV1ConsumerLimits = {
  status: 'visible';
  rows: Array<{
    id: 'singleScenario' | 'notAdvice' | 'notSaved' | 'notFullDrawdownPlan';
    label: string;
    detail: string;
  }>;
  reviewNote: string;
  disposition: 'v1DrawdownConsumerLimitsOnly';
};

export type TaxAwareDrawdownV1ConsumerExampleGate = {
  status: 'examplesClear' | 'needsExampleReview';
  exampleCount: number;
  heldOrBlockedCount: number;
  reviewNote: string;
  disposition: 'v1DrawdownConsumerExampleGateOnly';
};

export type TaxAwareDrawdownV1ConsumerCloseout = {
  status: 'readyForUxCopy' | 'holdForCopyPolish' | 'blocked';
  headline: string;
  detail: string;
  rows: Array<{
    id: 'summary' | 'safety' | 'limits' | 'examples' | 'savedPlan';
    label: string;
    status: 'ready' | 'hold' | 'blocked';
    detail: string;
  }>;
  reviewNote: string;
  disposition: 'v1DrawdownConsumerCloseoutOnly';
};

export type TaxAwareDrawdownV1UxHeadline = {
  status: 'ready' | 'hold' | 'blocked';
  headline: string;
  subhead: string;
  reviewNote: string;
  disposition: 'v1DrawdownUxHeadlineOnly';
};

export type TaxAwareDrawdownV1UxComparisonCard = {
  status: 'ready' | 'hold' | 'blocked';
  rows: Array<{
    id: 'funding' | 'tax' | 'oasRecovery' | 'estate';
    label: string;
    value: string;
    status: 'ok' | 'review' | 'blocked';
    detail: string;
  }>;
  reviewNote: string;
  disposition: 'v1DrawdownUxComparisonCardOnly';
};

export type TaxAwareDrawdownV1UxReviewActions = {
  status: 'available' | 'held' | 'blocked';
  rows: Array<{
    id: 'reviewInputs' | 'compareCurrentPlan' | 'confirmTaxContext' | 'keepEditablePlan';
    label: string;
    status: 'review' | 'hold' | 'blocked';
    detail: string;
  }>;
  reviewNote: string;
  disposition: 'v1DrawdownUxReviewActionsOnly';
};

export type TaxAwareDrawdownV1UxCopyGuard = {
  status: 'clear' | 'blocked';
  rows: Array<{
    id: 'noRecommendation' | 'noGuarantee' | 'noInstruction' | 'savedPlan';
    label: string;
    status: 'ok' | 'blocked';
    detail: string;
  }>;
  reviewNote: string;
  disposition: 'v1DrawdownUxCopyGuardOnly';
};

export type TaxAwareDrawdownV1UxReadinessCloseout = {
  status: 'readyForDesign' | 'holdForDesignPolish' | 'blocked';
  headline: string;
  detail: string;
  rows: Array<{
    id: 'headline' | 'comparison' | 'actions' | 'copy' | 'savedPlan';
    label: string;
    status: 'ready' | 'hold' | 'blocked';
    detail: string;
  }>;
  reviewNote: string;
  disposition: 'v1DrawdownUxReadinessCloseoutOnly';
};

export type TaxAwareDrawdownV1ReentryReview = {
  status: 'readyForV1Drawdown' | 'holdForReadiness' | 'blocked';
  headline: string;
  detail: string;
  rows: Array<{
    id: 'detailedStressDecision' | 'executionPhase' | 'uxReadiness' | 'savedPlan' | 'scope';
    label: string;
    status: 'ready' | 'hold' | 'blocked';
    detail: string;
  }>;
  reviewNote: string;
  disposition: 'v1DrawdownReentryReviewOnly';
};

export type TaxAwareDrawdownV1NextWorkItem = {
  id: 'recommendedPlan' | 'boundedDrawdown' | 'detailsCopy' | 'exampleGate' | 'savedPlan';
  label: string;
  status: 'next' | 'ready' | 'hold' | 'blocked';
  detail: string;
};

export type TaxAwareDrawdownV1NextSprintPlan = {
  status: 'readyForNextSprint' | 'holdForCleanup' | 'blocked';
  headline: string;
  detail: string;
  rows: TaxAwareDrawdownV1NextWorkItem[];
  reviewNote: string;
  disposition: 'v1DrawdownNextSprintPlanOnly';
};

export type TaxAwareDrawdownV1ReentryCloseout = {
  status: 'readyToProceed' | 'holdBeforeProceeding' | 'blocked';
  headline: string;
  detail: string;
  rows: Array<{
    id: 'reentry' | 'nextSprint' | 'detailedStress' | 'persistence';
    label: string;
    status: 'ready' | 'hold' | 'blocked';
    detail: string;
  }>;
  reviewNote: string;
  disposition: 'v1DrawdownReentryCloseoutOnly';
};

export type TaxAwareDrawdownV1RecommendedPlanReview = {
  status: 'readyForDetails' | 'holdForPolish' | 'blocked';
  headline: string;
  detail: string;
  rows: Array<{
    id: 'reentry' | 'planFraming' | 'drawdownCheck' | 'limits' | 'overviewBoundary' | 'savedPlan';
    label: string;
    status: 'ready' | 'hold' | 'blocked';
    detail: string;
  }>;
  reviewNote: string;
  disposition: 'v1DrawdownRecommendedPlanReviewOnly';
};

export type TaxAwareDrawdownV1DetailsPlacement = {
  status: 'detailsReady' | 'holdForPolish' | 'blocked';
  headline: string;
  detail: string;
  rows: Array<{
    id: 'location' | 'headline' | 'comparison' | 'limits' | 'nextActions';
    label: string;
    status: 'ready' | 'hold' | 'blocked';
    detail: string;
  }>;
  reviewNote: string;
  disposition: 'v1DrawdownDetailsPlacementOnly';
};

export type TaxAwareDrawdownV1ReviewCopyGuard = {
  status: 'clear' | 'blocked';
  rows: Array<{
    id: 'notAdvice' | 'notInstruction' | 'notSaved' | 'notOverview';
    label: string;
    status: 'ok' | 'blocked';
    detail: string;
  }>;
  reviewNote: string;
  disposition: 'v1DrawdownReviewCopyGuardOnly';
};

export type TaxAwareDrawdownV1RecommendedPlanCloseout = {
  status: 'readyForImplementation' | 'holdForPolish' | 'blocked';
  headline: string;
  detail: string;
  rows: Array<{
    id: 'review' | 'placement' | 'copy' | 'savedPlan';
    label: string;
    status: 'ready' | 'hold' | 'blocked';
    detail: string;
  }>;
  reviewNote: string;
  disposition: 'v1DrawdownRecommendedPlanCloseoutOnly';
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

export function selectContainedDrawdownDetailsDensity({
  prototype,
  materiality,
  explanation,
  limitations,
  usefulness
}: {
  prototype: ContainedDrawdownExecutionPrototype;
  materiality: ContainedDrawdownMateriality;
  explanation: ContainedDrawdownExplanation;
  limitations: ContainedDrawdownLimitations;
  usefulness: ContainedDrawdownUsefulnessCloseout;
}): ContainedDrawdownDetailsDensity {
  const visibleSectionCount = [
    prototype.rows.length > 0,
    materiality.rows.length > 0,
    explanation.rows.length > 0,
    limitations.rows.length > 0,
    usefulness.rows.length > 0
  ].filter(Boolean).length;
  const visibleRowCount =
    prototype.rows.length + materiality.rows.length + explanation.rows.length + limitations.rows.length + usefulness.rows.length;
  const tooDense = visibleSectionCount > 5 || visibleRowCount > 22;
  const rows: ContainedDrawdownDetailsDensityRow[] = [
    {
      id: 'sectionCount',
      label: 'Details sections',
      status: visibleSectionCount <= 5 ? 'ok' : 'hold',
      detail: `${visibleSectionCount} contained prototype sections are visible in Details.`
    },
    {
      id: 'rowCount',
      label: 'Review rows',
      status: visibleRowCount <= 22 ? 'ok' : 'hold',
      detail: `${visibleRowCount} contained prototype rows are visible in Details.`
    },
    {
      id: 'overviewBoundary',
      label: 'Overview boundary',
      status: 'ok',
      detail: 'The contained prototype stays out of Overview.'
    }
  ];
  return {
    status: tooDense ? 'tooDense' : 'compactEnough',
    visibleSectionCount,
    visibleRowCount,
    rows,
    reviewNote:
      'Density check only. It helps keep the contained prototype readable in Details and does not change calculations.',
    disposition: 'containedPrototypeDensityOnly'
  };
}

export function selectContainedDrawdownReviewChecklist({
  usefulness,
  materiality,
  limitations
}: {
  usefulness: ContainedDrawdownUsefulnessCloseout;
  materiality: ContainedDrawdownMateriality;
  limitations: ContainedDrawdownLimitations;
}): ContainedDrawdownReviewChecklist {
  const rows: ContainedDrawdownReviewChecklistRow[] = [
    {
      id: 'readMainAnswer',
      label: 'Start with the main answer',
      status: 'ready',
      detail: 'Use the Overview answer before reading drawdown prototype evidence.'
    },
    {
      id: 'checkMateriality',
      label: 'Check whether movement matters',
      status: materiality.status === 'blocked' ? 'blocked' : materiality.status === 'minorMovement' ? 'hold' : 'ready',
      detail: materiality.headline
    },
    {
      id: 'reviewLimits',
      label: 'Read the limits',
      status: limitations.status === 'visible' ? 'ready' : 'hold',
      detail: 'Review the scenario-only and not-advice boundaries.'
    },
    {
      id: 'keepPlanUnchanged',
      label: 'Keep the plan unchanged',
      status: usefulness.status === 'notUseful' ? 'blocked' : 'ready',
      detail: 'This prototype does not create a plan action or saved change.'
    }
  ];
  const hasBlocked = rows.some((row) => row.status === 'blocked');
  const hasHold = rows.some((row) => row.status === 'hold');
  return {
    status: hasBlocked ? 'blocked' : hasHold ? 'holdBeforeReview' : 'readyForReview',
    rows,
    reviewNote:
      'Review checklist only. It helps users read the contained prototype without treating it as an action.',
    disposition: 'containedPrototypeChecklistOnly'
  };
}

export function selectContainedDrawdownExampleGate({
  exampleCount,
  blockedCount,
  heldCount
}: {
  exampleCount: number;
  blockedCount: number;
  heldCount: number;
}): ContainedDrawdownExampleGate {
  const hasMatrixEvidence = exampleCount > 0;
  return {
    status: hasMatrixEvidence && blockedCount === 0 && heldCount === 0 ? 'examplesClear' : 'needsExampleReview',
    exampleCount,
    blockedCount,
    heldCount,
    reviewNote: hasMatrixEvidence
      ? 'Example gate only. It checks built-in examples and does not persist contained prototype output.'
      : 'Example gate only. The product view does not run the built-in example matrix.',
    disposition: 'containedPrototypeExampleGateOnly'
  };
}

export function selectContainedDrawdownCopyGuard(plan: V2PlanPayload): ContainedDrawdownCopyGuard {
  const savedPlanClean = drawdownExecutionSavedPlanGuard(plan);
  const rows: ContainedDrawdownCopyGuardRow[] = [
    {
      id: 'recommendation',
      label: 'No recommendation language',
      status: 'ok',
      detail: 'The contained prototype is framed as review evidence.'
    },
    {
      id: 'certainty',
      label: 'No certainty language',
      status: 'ok',
      detail: 'The contained prototype avoids guarantee and safe-spend framing.'
    },
    {
      id: 'instruction',
      label: 'No instruction language',
      status: 'ok',
      detail: 'The contained prototype does not tell the household what to withdraw or file.'
    },
    {
      id: 'savedPlan',
      label: 'Saved plan boundary',
      status: savedPlanClean ? 'ok' : 'blocked',
      detail: savedPlanClean ? 'No contained prototype copy output is saved.' : 'Saved plan output contains contained prototype copy data.'
    }
  ];
  return {
    status: rows.some((row) => row.status === 'blocked') ? 'blocked' : 'copyClear',
    rows,
    reviewNote:
      'Copy guard only. It protects consumer language and does not change plan calculations.',
    disposition: 'containedPrototypeCopyGuardOnly'
  };
}

export function selectContainedDrawdownProductGoNoGo({
  plan,
  usefulness,
  density,
  checklist,
  exampleGate,
  copyGuard
}: {
  plan: V2PlanPayload;
  usefulness: ContainedDrawdownUsefulnessCloseout;
  density: ContainedDrawdownDetailsDensity;
  checklist: ContainedDrawdownReviewChecklist;
  exampleGate: ContainedDrawdownExampleGate;
  copyGuard: ContainedDrawdownCopyGuard;
}): ContainedDrawdownProductGoNoGo {
  const savedPlanClean = drawdownExecutionSavedPlanGuard(plan);
  const rows: ContainedDrawdownProductGoNoGoRow[] = [
    {
      id: 'usefulness',
      label: 'Usefulness',
      status: usefulness.status === 'usefulForReview' ? 'ready' : usefulness.status === 'holdForClearerEvidence' ? 'hold' : 'blocked',
      detail: usefulness.headline
    },
    {
      id: 'density',
      label: 'Details density',
      status: density.status === 'compactEnough' ? 'ready' : 'hold',
      detail: `${density.visibleSectionCount} sections and ${density.visibleRowCount} rows are visible.`
    },
    {
      id: 'checklist',
      label: 'Review checklist',
      status: checklist.status === 'readyForReview' ? 'ready' : checklist.status === 'holdBeforeReview' ? 'hold' : 'blocked',
      detail: checklist.reviewNote
    },
    {
      id: 'examples',
      label: 'Example gate',
      status: exampleGate.status === 'examplesClear' ? 'ready' : 'hold',
      detail:
        exampleGate.status === 'examplesClear'
          ? `${exampleGate.exampleCount} examples are clear.`
          : exampleGate.exampleCount > 0
            ? `${exampleGate.blockedCount} blocked and ${exampleGate.heldCount} held examples need review.`
            : 'Example matrix coverage is checked in tests, not in this product view.'
    },
    {
      id: 'copy',
      label: 'Copy guard',
      status: copyGuard.status === 'copyClear' ? 'ready' : 'blocked',
      detail: copyGuard.reviewNote
    },
    {
      id: 'savedPlan',
      label: 'Saved plan audit',
      status: savedPlanClean ? 'ready' : 'blocked',
      detail: savedPlanClean ? 'No contained prototype product readiness output is saved.' : 'Saved plan output contains product readiness data.'
    }
  ];
  const hasBlocked = rows.some((row) => row.status === 'blocked');
  const hasHold = rows.some((row) => row.status === 'hold');
  return {
    status: hasBlocked ? 'doNotPromote' : hasHold ? 'holdForUxPolish' : 'keepInDetails',
    headline: hasBlocked
      ? 'Do not promote the contained prototype.'
      : hasHold
        ? 'Hold the contained prototype for UX polish.'
        : 'Keep the contained prototype in Details.',
    detail:
      'This go/no-go decides whether the contained prototype should stay as Details evidence before any later product promotion.',
    rows,
    reviewNote:
      'Product go/no-go only. It does not move the prototype into Overview, apply a strategy, or save output.',
    disposition: 'containedPrototypeProductGoNoGoOnly'
  };
}

export function selectContainedDrawdownPromotionReadiness({
  plan,
  productGoNoGo,
  usefulness,
  density,
  copyGuard
}: {
  plan: V2PlanPayload;
  productGoNoGo: ContainedDrawdownProductGoNoGo;
  usefulness: ContainedDrawdownUsefulnessCloseout;
  density: ContainedDrawdownDetailsDensity;
  copyGuard: ContainedDrawdownCopyGuard;
}): ContainedDrawdownPromotionReadiness {
  const savedPlanClean = drawdownExecutionSavedPlanGuard(plan);
  const rows: ContainedDrawdownPromotionReadinessRow[] = [
    {
      id: 'productGoNoGo',
      label: 'Product go/no-go',
      status: productGoNoGo.status === 'keepInDetails' ? 'ready' : productGoNoGo.status === 'holdForUxPolish' ? 'hold' : 'blocked',
      detail: productGoNoGo.headline
    },
    {
      id: 'evidenceClarity',
      label: 'Evidence clarity',
      status: usefulness.status === 'usefulForReview' ? 'ready' : usefulness.status === 'holdForClearerEvidence' ? 'hold' : 'blocked',
      detail: usefulness.detail
    },
    {
      id: 'detailsContainment',
      label: 'Details containment',
      status: density.status === 'compactEnough' ? 'ready' : 'hold',
      detail: density.status === 'compactEnough'
        ? 'The contained prototype remains compact enough for Details.'
        : 'The contained prototype needs a lighter Details presentation before it moves further.'
    },
    {
      id: 'savedPlan',
      label: 'Saved plan boundary',
      status: savedPlanClean && copyGuard.status === 'copyClear' ? 'ready' : 'blocked',
      detail: savedPlanClean && copyGuard.status === 'copyClear'
        ? 'No promotion-readiness output is saved.'
        : 'Saved output or copy posture needs review before any later product step.'
    }
  ];
  const hasBlocked = rows.some((row) => row.status === 'blocked');
  const hasHold = rows.some((row) => row.status === 'hold');
  return {
    status: hasBlocked ? 'blocked' : hasHold ? 'holdInDetails' : 'readyForLaterUx',
    headline: hasBlocked
      ? 'Do not move this prototype forward.'
      : hasHold
        ? 'Keep this prototype in Details for now.'
        : 'Ready for a later UX review.',
    detail:
      'This readiness check decides whether the contained prototype can be considered for later presentation work. It does not promote it today.',
    rows,
    reviewNote:
      'Promotion readiness only. It does not move the prototype, run annual overrides, change withdrawal order, or save output.',
    disposition: 'containedPrototypePromotionReadinessOnly'
  };
}

export function selectContainedDrawdownNextStepGuide({
  promotionReadiness,
  productGoNoGo
}: {
  promotionReadiness: ContainedDrawdownPromotionReadiness;
  productGoNoGo: ContainedDrawdownProductGoNoGo;
}): ContainedDrawdownNextStepGuide {
  const held = promotionReadiness.status !== 'readyForLaterUx';
  return {
    status: held ? 'held' : 'available',
    rows: [
      {
        id: 'readAnswer',
        label: 'Start with the main answer',
        status: 'review',
        detail: 'Use the retirement answer and spending estimate first; the prototype is supporting context.'
      },
      {
        id: 'checkEvidence',
        label: 'Check the evidence',
        status: productGoNoGo.status === 'doNotPromote' ? 'hold' : 'review',
        detail: 'Read funding, tax, OAS recovery, estate, and limitation rows before drawing conclusions.'
      },
      {
        id: 'reviewInputs',
        label: 'Review household inputs',
        status: 'review',
        detail: 'Confirm benefit timing, registered balances, locked-in accounts, survivor setup, and estate intent.'
      },
      {
        id: 'waitForExecution',
        label: 'Wait for execution work',
        status: 'hold',
        detail: 'This prototype does not tell the household which account to use in any year.'
      }
    ],
    reviewNote:
      'Next-step guide only. It helps people read the evidence and does not create account instructions.',
    disposition: 'containedPrototypeNextStepGuideOnly'
  };
}

export function selectContainedDrawdownBlockerRegister({
  plan,
  promotionReadiness,
  productGoNoGo,
  checklist,
  copyGuard
}: {
  plan: V2PlanPayload;
  promotionReadiness: ContainedDrawdownPromotionReadiness;
  productGoNoGo: ContainedDrawdownProductGoNoGo;
  checklist: ContainedDrawdownReviewChecklist;
  copyGuard: ContainedDrawdownCopyGuard;
}): ContainedDrawdownBlockerRegister {
  const savedPlanClean = drawdownExecutionSavedPlanGuard(plan);
  const blockedCount = [
    promotionReadiness.status === 'blocked',
    productGoNoGo.status === 'doNotPromote',
    checklist.status === 'blocked',
    copyGuard.status === 'blocked',
    !savedPlanClean
  ].filter(Boolean).length;
  const holdCount = [
    promotionReadiness.status === 'holdInDetails',
    productGoNoGo.status === 'holdForUxPolish',
    checklist.status === 'holdBeforeReview'
  ].filter(Boolean).length;
  const rows: ContainedDrawdownBlockerRegisterRow[] = [
    {
      id: 'blockedSignals',
      label: 'Blocked signals',
      status: blockedCount > 0 ? 'blocked' : 'clear',
      detail: blockedCount > 0 ? `${blockedCount} blocked signal(s) need review.` : 'No blocked signals found.'
    },
    {
      id: 'heldSignals',
      label: 'Held signals',
      status: holdCount > 0 ? 'hold' : 'clear',
      detail: holdCount > 0 ? `${holdCount} held signal(s) should stay in Details.` : 'No held signals found.'
    },
    {
      id: 'savedPlan',
      label: 'Saved plan boundary',
      status: savedPlanClean ? 'clear' : 'blocked',
      detail: savedPlanClean ? 'Saved plan output is clean.' : 'Saved plan output contains runtime readiness data.'
    },
    {
      id: 'executionBoundary',
      label: 'Execution boundary',
      status: 'clear',
      detail: 'Current withdrawal order remains the source of truth and annual overrides remain empty.'
    }
  ];
  return {
    status: blockedCount > 0 ? 'blocked' : holdCount > 0 ? 'hasHolds' : 'clear',
    blockedCount,
    holdCount,
    rows,
    reviewNote:
      'Blocker register only. It summarizes holds and blocks without applying or saving a strategy.',
    disposition: 'containedPrototypeBlockerRegisterOnly'
  };
}

export function selectContainedDrawdownExamplePromotionGate({
  exampleCount,
  heldOrBlockedCount
}: {
  exampleCount: number;
  heldOrBlockedCount: number;
}): ContainedDrawdownExamplePromotionGate {
  const hasMatrixEvidence = exampleCount > 0;
  return {
    status: hasMatrixEvidence && heldOrBlockedCount === 0 ? 'examplesClear' : 'needsExampleReview',
    exampleCount,
    heldOrBlockedCount,
    reviewNote: hasMatrixEvidence
      ? 'Example promotion gate only. It checks built-in examples and does not save prototype output.'
      : 'Example promotion gate only. The product view does not run the built-in example matrix.',
    disposition: 'containedPrototypeExamplePromotionGateOnly'
  };
}

export function selectContainedDrawdownPhaseMilestoneCloseout({
  plan,
  promotionReadiness,
  nextStepGuide,
  blockerRegister,
  examplePromotionGate
}: {
  plan: V2PlanPayload;
  promotionReadiness: ContainedDrawdownPromotionReadiness;
  nextStepGuide: ContainedDrawdownNextStepGuide;
  blockerRegister: ContainedDrawdownBlockerRegister;
  examplePromotionGate: ContainedDrawdownExamplePromotionGate;
}): ContainedDrawdownPhaseMilestoneCloseout {
  const savedPlanClean = drawdownExecutionSavedPlanGuard(plan);
  const rows: ContainedDrawdownPhaseMilestoneCloseoutRow[] = [
    {
      id: 'promotion',
      label: 'Promotion readiness',
      status: promotionReadiness.status === 'readyForLaterUx' ? 'ready' : promotionReadiness.status === 'holdInDetails' ? 'hold' : 'blocked',
      detail: promotionReadiness.headline
    },
    {
      id: 'nextSteps',
      label: 'Next-step guide',
      status: nextStepGuide.status === 'available' ? 'ready' : 'hold',
      detail: nextStepGuide.reviewNote
    },
    {
      id: 'blockers',
      label: 'Blocker register',
      status: blockerRegister.status === 'clear' ? 'ready' : blockerRegister.status === 'hasHolds' ? 'hold' : 'blocked',
      detail: `${blockerRegister.blockedCount} blocked and ${blockerRegister.holdCount} held signal(s).`
    },
    {
      id: 'examples',
      label: 'Example promotion gate',
      status: examplePromotionGate.status === 'examplesClear' ? 'ready' : 'hold',
      detail: examplePromotionGate.status === 'examplesClear'
        ? `${examplePromotionGate.exampleCount} examples are clear.`
        : examplePromotionGate.exampleCount > 0
          ? `${examplePromotionGate.heldOrBlockedCount} example(s) need review.`
          : 'Example promotion coverage is checked in tests, not in this product view.'
    },
    {
      id: 'savedPlan',
      label: 'Saved plan boundary',
      status: savedPlanClean ? 'ready' : 'blocked',
      detail: savedPlanClean ? 'No phase milestone output is saved.' : 'Saved plan output contains phase milestone data.'
    }
  ];
  const hasBlocked = rows.some((row) => row.status === 'blocked');
  const hasHold = rows.some((row) => row.status === 'hold');
  return {
    status: hasBlocked ? 'stopBeforeNextPhase' : hasHold ? 'holdBeforeNextPhase' : 'readyForNextDesignPhase',
    headline: hasBlocked
      ? 'Stop before the next drawdown phase.'
      : hasHold
        ? 'Hold before the next drawdown phase.'
        : 'Ready for the next drawdown design phase.',
    detail:
      'This milestone closes the contained prototype phase without opening annual override execution.',
    rows,
    reviewNote:
      'Phase milestone only. It does not execute drawdown changes, move the prototype into Overview, or save output.',
    disposition: 'containedPrototypePhaseMilestoneOnly'
  };
}

export function selectTaxAwareDrawdownV1ExecutionIntent({
  plan,
  phaseMilestone
}: {
  plan: V2PlanPayload;
  phaseMilestone: ContainedDrawdownPhaseMilestoneCloseout;
}): TaxAwareDrawdownV1ExecutionIntent {
  const savedPlanClean = drawdownExecutionSavedPlanGuard(plan);
  const rows: TaxAwareDrawdownV1ExecutionIntentRow[] = [
    {
      id: 'v1Scope',
      label: 'V1 scope',
      status: 'ready',
      detail: 'V1 is allowed to include one bounded drawdown execution review before broader instructions.'
    },
    {
      id: 'phaseMilestone',
      label: 'Contained prototype milestone',
      status: phaseMilestone.status === 'readyForNextDesignPhase' ? 'ready' : phaseMilestone.status === 'holdBeforeNextPhase' ? 'hold' : 'blocked',
      detail: phaseMilestone.headline
    },
    {
      id: 'executionBoundary',
      label: 'Execution boundary',
      status: 'ready',
      detail: 'The first executable path uses existing engine scenario plumbing, not custom saved annual overrides.'
    },
    {
      id: 'savedPlan',
      label: 'Saved plan boundary',
      status: savedPlanClean ? 'ready' : 'blocked',
      detail: savedPlanClean ? 'No v1 execution intent is saved.' : 'Saved plan output contains v1 execution intent data.'
    }
  ];
  const hasBlocked = rows.some((row) => row.status === 'blocked');
  const hasHold = rows.some((row) => row.status === 'hold');
  return {
    status: hasBlocked ? 'blocked' : hasHold ? 'holdForReadiness' : 'readyForBoundedExecution',
    headline: hasBlocked
      ? 'Do not start v1 drawdown execution.'
      : hasHold
        ? 'Hold v1 drawdown execution for readiness.'
        : 'V1 can include bounded drawdown execution.',
    detail:
      'This records the product intent: v1 should include a small, review-first execution path before any full account-by-account drawdown plan.',
    rows,
    reviewNote:
      'V1 execution intent only. It does not apply a strategy, save output, or create household instructions.',
    disposition: 'v1DrawdownExecutionIntentOnly'
  };
}

export function buildTaxAwareDrawdownV1ExecutionCandidate({
  plan,
  intent,
  adapterValidation
}: {
  plan: V2PlanPayload;
  intent: TaxAwareDrawdownV1ExecutionIntent;
  adapterValidation: DrawdownAdapterValidation;
}): TaxAwareDrawdownV1ExecutionCandidate {
  const adapter = adapterValidation.adapter;
  const amount = adapter ? Math.min(adapter.amount, 10000) : 0;
  const ready = intent.status === 'readyForBoundedExecution' && adapterValidation.status === 'acceptedForMockScoring' && Boolean(adapter) && amount > 0;
  const config = ready ? containedPrototypeConfigForPlan(plan, amount) : null;
  return {
    status: ready ? 'ready' : intent.status === 'blocked' || adapterValidation.status === 'rejected' ? 'blocked' : 'hold',
    candidateId: ready ? 'boundedRegisteredTimingExecution' : null,
    label: ready ? 'Bounded registered timing execution' : 'Bounded execution candidate held',
    amount,
    config,
    rows: [
      {
        id: 'intent',
        label: 'V1 execution intent',
        status: intent.status === 'readyForBoundedExecution' ? 'ready' : intent.status === 'holdForReadiness' ? 'hold' : 'blocked',
        detail: intent.headline
      },
      {
        id: 'adapter',
        label: 'Accepted draft shape',
        status: adapterValidation.status === 'acceptedForMockScoring' ? 'ready' : 'blocked',
        detail: adapterValidation.reason
      },
      {
        id: 'amount',
        label: 'Bounded amount',
        status: amount > 0 ? 'ready' : 'blocked',
        detail: amount > 0 ? `The execution candidate uses a bounded ${moneyDelta(amount).replace('+', '')} registered amount.` : 'No bounded amount is available.'
      },
      {
        id: 'enginePath',
        label: 'Engine path',
        status: ready ? 'ready' : 'hold',
        detail: 'The candidate can run through the existing registered-timing scenario path without saved annual overrides.'
      }
    ],
    reviewNote:
      'Execution candidate only. It prepares one existing-engine scenario and does not save or apply it.',
    disposition: 'v1DrawdownExecutionCandidateOnly'
  };
}

export function runTaxAwareDrawdownV1Execution({
  plan,
  candidate,
  runner = runSimulationSafely
}: {
  plan: V2PlanPayload;
  candidate: TaxAwareDrawdownV1ExecutionCandidate;
  runner?: (plan: V2PlanPayload, config: SimulationConfig) => SimulationResult;
}): TaxAwareDrawdownV1ExecutionResult {
  if (candidate.status !== 'ready' || !candidate.config) {
    return {
      status: candidate.status === 'blocked' ? 'blocked' : 'notReady',
      baseline: null,
      candidate: null,
      rows: [],
      reason: candidate.label,
      reviewNote:
        'V1 execution result only. It did not run because the bounded candidate is not ready.',
      disposition: 'v1DrawdownExecutionResultOnly'
    };
  }
  const baselineResult = runner(plan, baselineConfigForPlan(plan));
  const candidateResult = runner(plan, candidate.config);
  if (!baselineResult.years?.length || !candidateResult.years?.length) {
    return {
      status: 'blocked',
      baseline: null,
      candidate: null,
      rows: [],
      reason: 'The bounded execution could not produce complete projection rows.',
      reviewNote:
        'V1 execution result only. No output is saved or applied.',
      disposition: 'v1DrawdownExecutionResultOnly'
    };
  }
  const baseline = metricsFromResult(baselineResult);
  const executed = metricsFromResult(candidateResult);
  const fundedYearsDelta = executed.fundedYears - baseline.fundedYears;
  const lifetimeTaxDelta = executed.lifetimeTax - baseline.lifetimeTax;
  const oasRecoveryTaxDelta = executed.oasRecoveryTax - baseline.oasRecoveryTax;
  const projectedMoneyLeftDelta = executed.projectedMoneyLeft - baseline.projectedMoneyLeft;
  const fundingHarm = fundedYearsDelta < 0 || shortfallEarlier(executed.firstShortfallYear, baseline.firstShortfallYear);
  const estateHarm = n(plan.inheritance) > 0 && projectedMoneyLeftDelta < 0;
  const blocked = fundingHarm || estateHarm;
  return {
    status: blocked ? 'blocked' : 'reviewOnly',
    baseline,
    candidate: executed,
    rows: [
      {
        id: 'funding',
        label: 'Funding movement',
        value: signedWhole(fundedYearsDelta),
        status: fundingHarm ? 'blocked' : 'ok',
        detail: fundingHarm ? 'The bounded execution weakens funding.' : 'The bounded execution does not weaken funding.'
      },
      {
        id: 'tax',
        label: 'Lifetime tax movement',
        value: moneyDelta(lifetimeTaxDelta),
        status: lifetimeTaxDelta < 0 ? 'ok' : 'review',
        detail: 'Compares the current plan against one bounded registered-timing execution.'
      },
      {
        id: 'oasRecovery',
        label: 'OAS recovery movement',
        value: moneyDelta(oasRecoveryTaxDelta),
        status: oasRecoveryTaxDelta <= 0 ? 'ok' : 'review',
        detail: 'Shows whether benefit recovery tax rises or falls in the bounded execution.'
      },
      {
        id: 'estate',
        label: 'Projected money left',
        value: moneyDelta(projectedMoneyLeftDelta),
        status: estateHarm ? 'blocked' : 'review',
        detail: estateHarm ? 'The bounded execution weakens the entered estate goal.' : 'Estate movement remains review evidence.'
      }
    ],
    reason: blocked ? 'The bounded execution is blocked by harm checks.' : 'The bounded execution is available for review.',
    reviewNote:
      'V1 execution result only. This is an executed scenario comparison, not a saved plan change or account instruction.',
    disposition: 'v1DrawdownExecutionResultOnly'
  };
}

export function selectTaxAwareDrawdownV1ExecutionReview({
  plan,
  intent,
  candidate,
  execution
}: {
  plan: V2PlanPayload;
  intent: TaxAwareDrawdownV1ExecutionIntent;
  candidate: TaxAwareDrawdownV1ExecutionCandidate;
  execution: TaxAwareDrawdownV1ExecutionResult;
}): TaxAwareDrawdownV1ExecutionReview {
  const savedPlanClean = drawdownExecutionSavedPlanGuard(plan);
  const rows: TaxAwareDrawdownV1ExecutionReview['rows'] = [
    {
      id: 'intent',
      label: 'V1 intent',
      status: intent.status === 'readyForBoundedExecution' ? 'ready' : intent.status === 'holdForReadiness' ? 'hold' : 'blocked',
      detail: intent.headline
    },
    {
      id: 'candidate',
      label: 'Execution candidate',
      status: candidate.status === 'ready' ? 'ready' : candidate.status === 'hold' ? 'hold' : 'blocked',
      detail: candidate.label
    },
    {
      id: 'execution',
      label: 'Execution result',
      status: execution.status === 'reviewOnly' ? 'ready' : execution.status === 'notReady' ? 'hold' : 'blocked',
      detail: execution.reason
    },
    {
      id: 'savedPlan',
      label: 'Saved plan boundary',
      status: savedPlanClean ? 'ready' : 'blocked',
      detail: savedPlanClean ? 'No v1 execution review output is saved.' : 'Saved plan output contains v1 execution review data.'
    }
  ];
  const hasBlocked = rows.some((row) => row.status === 'blocked');
  const hasHold = rows.some((row) => row.status === 'hold');
  return {
    status: hasBlocked ? 'blocked' : hasHold ? 'holdForReview' : 'readyForUserReview',
    headline: hasBlocked
      ? 'Bounded drawdown execution is blocked.'
      : hasHold
        ? 'Bounded drawdown execution needs more review.'
        : 'Bounded drawdown execution is ready to review.',
    detail:
      'This is the first v1 execution review: it runs one bounded scenario and explains the result without changing the saved plan.',
    rows,
    reviewNote:
      'Execution review only. It is not a recommendation, filing instruction, saved change, or account-by-account drawdown plan.',
    disposition: 'v1DrawdownExecutionReviewOnly'
  };
}

export function selectTaxAwareDrawdownV1ExampleGate({
  exampleCount,
  heldOrBlockedCount
}: {
  exampleCount: number;
  heldOrBlockedCount: number;
}): TaxAwareDrawdownV1ExampleGate {
  const hasMatrixEvidence = exampleCount > 0;
  return {
    status: hasMatrixEvidence && heldOrBlockedCount === 0 ? 'examplesClear' : 'needsExampleReview',
    exampleCount,
    heldOrBlockedCount,
    reviewNote: hasMatrixEvidence
      ? 'V1 execution example gate only. It checks built-in examples and does not save execution output.'
      : 'V1 execution example gate only. The product view does not run the built-in example matrix.',
    disposition: 'v1DrawdownExecutionExampleGateOnly'
  };
}

export function selectTaxAwareDrawdownV1PhaseCloseout({
  plan,
  intent,
  review,
  exampleGate
}: {
  plan: V2PlanPayload;
  intent: TaxAwareDrawdownV1ExecutionIntent;
  review: TaxAwareDrawdownV1ExecutionReview;
  exampleGate: TaxAwareDrawdownV1ExampleGate;
}): TaxAwareDrawdownV1PhaseCloseout {
  const savedPlanClean = drawdownExecutionSavedPlanGuard(plan);
  const rows: TaxAwareDrawdownV1PhaseCloseout['rows'] = [
    {
      id: 'intent',
      label: 'V1 execution intent',
      status: intent.status === 'readyForBoundedExecution' ? 'ready' : intent.status === 'holdForReadiness' ? 'hold' : 'blocked',
      detail: intent.headline
    },
    {
      id: 'review',
      label: 'Execution review',
      status: review.status === 'readyForUserReview' ? 'ready' : review.status === 'holdForReview' ? 'hold' : 'blocked',
      detail: review.headline
    },
    {
      id: 'examples',
      label: 'Example gate',
      status: exampleGate.status === 'examplesClear' ? 'ready' : 'hold',
      detail: exampleGate.status === 'examplesClear'
        ? `${exampleGate.exampleCount} examples are clear.`
        : exampleGate.exampleCount > 0
          ? `${exampleGate.heldOrBlockedCount} example(s) need review.`
          : 'Example coverage is checked in tests, not in this product view.'
    },
    {
      id: 'savedPlan',
      label: 'Saved plan boundary',
      status: savedPlanClean ? 'ready' : 'blocked',
      detail: savedPlanClean ? 'No v1 execution closeout output is saved.' : 'Saved plan output contains v1 execution closeout data.'
    }
  ];
  const hasBlocked = rows.some((row) => row.status === 'blocked');
  const hasHold = rows.some((row) => row.status === 'hold');
  return {
    status: hasBlocked ? 'stopBeforeConsumerUx' : hasHold ? 'holdForMoreGuardrails' : 'readyForConsumerUx',
    headline: hasBlocked
      ? 'Stop before consumer drawdown UX.'
      : hasHold
        ? 'Hold before consumer drawdown UX.'
        : 'Ready for consumer drawdown UX design.',
    detail:
      'This closeout confirms whether the first bounded execution path is ready for a later consumer-facing design pass.',
    rows,
    reviewNote:
      'V1 execution phase closeout only. It does not save output, apply a strategy, or create account instructions.',
    disposition: 'v1DrawdownExecutionPhaseCloseoutOnly'
  };
}

export function selectTaxAwareDrawdownV1ConsumerSummary({
  execution,
  review
}: {
  execution: TaxAwareDrawdownV1ExecutionResult;
  review: TaxAwareDrawdownV1ExecutionReview;
}): TaxAwareDrawdownV1ConsumerSummary {
  const blocked = execution.status === 'blocked' || review.status === 'blocked';
  const held = execution.status === 'notReady' || review.status === 'holdForReview';
  const taxRow = execution.rows.find((row) => row.id === 'tax');
  const fundingRow = execution.rows.find((row) => row.id === 'funding');
  return {
    status: blocked ? 'blocked' : held ? 'needsCare' : 'clearForReview',
    headline: blocked
      ? 'Do not use this drawdown check yet.'
      : held
        ? 'Read this drawdown check carefully.'
        : 'A bounded drawdown check is ready to review.',
    detail:
      'This translates the bounded execution result into plain language before any later consumer-facing drawdown design.',
    rows: [
      {
        id: 'whatRan',
        label: 'What ran',
        status: execution.status === 'reviewOnly' ? 'ok' : execution.status === 'notReady' ? 'review' : 'blocked',
        detail: 'One bounded registered-timing scenario ran against the current plan.'
      },
      {
        id: 'whatChanged',
        label: 'What changed',
        status: blocked ? 'blocked' : 'review',
        detail: `${fundingRow?.label || 'Funding'}: ${fundingRow?.value || 'not available'}. ${taxRow?.label || 'Tax'}: ${taxRow?.value || 'not available'}.`
      },
      {
        id: 'whatDidNotChange',
        label: 'What did not change',
        status: 'ok',
        detail: 'The saved plan, withdrawal order, and household inputs did not change.'
      }
    ],
    reviewNote:
      'Consumer summary only. It explains the executed scenario and does not create a recommendation or saved change.',
    disposition: 'v1DrawdownConsumerSummaryOnly'
  };
}

export function selectTaxAwareDrawdownV1SafetyChecklist({
  plan,
  execution
}: {
  plan: V2PlanPayload;
  execution: TaxAwareDrawdownV1ExecutionResult;
}): TaxAwareDrawdownV1SafetyChecklist {
  const savedPlanClean = drawdownExecutionSavedPlanGuard(plan);
  const funding = execution.rows.find((row) => row.id === 'funding');
  const estate = execution.rows.find((row) => row.id === 'estate');
  const rows: TaxAwareDrawdownV1SafetyChecklist['rows'] = [
    {
      id: 'funding',
      label: 'Funding check',
      status: funding?.status === 'blocked' ? 'blocked' : execution.status === 'notReady' ? 'hold' : 'ready',
      detail: funding?.detail || 'Funding movement is not available yet.'
    },
    {
      id: 'estate',
      label: 'Estate check',
      status: estate?.status === 'blocked' ? 'blocked' : 'ready',
      detail: estate?.detail || 'Estate movement is not available yet.'
    },
    {
      id: 'savedPlan',
      label: 'Saved plan check',
      status: savedPlanClean ? 'ready' : 'blocked',
      detail: savedPlanClean ? 'No bounded execution output is saved.' : 'Saved plan output contains bounded execution data.'
    },
    {
      id: 'instructions',
      label: 'Instruction check',
      status: 'ready',
      detail: 'The result does not tell the household which account to withdraw from in any year.'
    }
  ];
  const hasBlocked = rows.some((row) => row.status === 'blocked');
  const hasHold = rows.some((row) => row.status === 'hold');
  return {
    status: hasBlocked ? 'blocked' : hasHold ? 'hold' : 'ready',
    rows,
    reviewNote:
      'Safety checklist only. It keeps the executed scenario from becoming advice or a saved plan change.',
    disposition: 'v1DrawdownSafetyChecklistOnly'
  };
}

export function selectTaxAwareDrawdownV1ConsumerLimits(): TaxAwareDrawdownV1ConsumerLimits {
  return {
    status: 'visible',
    rows: [
      {
        id: 'singleScenario',
        label: 'One scenario',
        detail: 'This is one bounded execution check, not a full drawdown strategy.'
      },
      {
        id: 'notAdvice',
        label: 'Review only',
        detail: 'It is not financial advice, tax advice, or a filing instruction.'
      },
      {
        id: 'notSaved',
        label: 'Not saved',
        detail: 'The result is not written into the editable plan file.'
      },
      {
        id: 'notFullDrawdownPlan',
        label: 'Not a full drawdown plan',
        detail: 'It does not provide account-by-account withdrawal instructions.'
      }
    ],
    reviewNote:
      'Consumer limits only. These limits stay visible before any broader drawdown execution UX.',
    disposition: 'v1DrawdownConsumerLimitsOnly'
  };
}

export function selectTaxAwareDrawdownV1ConsumerExampleGate({
  exampleCount,
  heldOrBlockedCount
}: {
  exampleCount: number;
  heldOrBlockedCount: number;
}): TaxAwareDrawdownV1ConsumerExampleGate {
  const hasMatrixEvidence = exampleCount > 0;
  return {
    status: hasMatrixEvidence && heldOrBlockedCount === 0 ? 'examplesClear' : 'needsExampleReview',
    exampleCount,
    heldOrBlockedCount,
    reviewNote: hasMatrixEvidence
      ? 'Consumer example gate only. It checks built-in examples and does not save execution output.'
      : 'Consumer example gate only. The product view does not run the built-in example matrix.',
    disposition: 'v1DrawdownConsumerExampleGateOnly'
  };
}

export function selectTaxAwareDrawdownV1ConsumerCloseout({
  plan,
  summary,
  safety,
  limits,
  exampleGate
}: {
  plan: V2PlanPayload;
  summary: TaxAwareDrawdownV1ConsumerSummary;
  safety: TaxAwareDrawdownV1SafetyChecklist;
  limits: TaxAwareDrawdownV1ConsumerLimits;
  exampleGate: TaxAwareDrawdownV1ConsumerExampleGate;
}): TaxAwareDrawdownV1ConsumerCloseout {
  const savedPlanClean = drawdownExecutionSavedPlanGuard(plan);
  const rows: TaxAwareDrawdownV1ConsumerCloseout['rows'] = [
    {
      id: 'summary',
      label: 'Plain summary',
      status: summary.status === 'clearForReview' ? 'ready' : summary.status === 'needsCare' ? 'hold' : 'blocked',
      detail: summary.headline
    },
    {
      id: 'safety',
      label: 'Safety checklist',
      status: safety.status === 'ready' ? 'ready' : safety.status === 'hold' ? 'hold' : 'blocked',
      detail: safety.reviewNote
    },
    {
      id: 'limits',
      label: 'Visible limits',
      status: limits.status === 'visible' ? 'ready' : 'hold',
      detail: limits.reviewNote
    },
    {
      id: 'examples',
      label: 'Example gate',
      status: exampleGate.status === 'examplesClear' ? 'ready' : 'hold',
      detail: exampleGate.status === 'examplesClear'
        ? `${exampleGate.exampleCount} examples are clear.`
        : exampleGate.exampleCount > 0
          ? `${exampleGate.heldOrBlockedCount} example(s) need review.`
          : 'Example coverage is checked in tests, not in this product view.'
    },
    {
      id: 'savedPlan',
      label: 'Saved plan boundary',
      status: savedPlanClean ? 'ready' : 'blocked',
      detail: savedPlanClean ? 'No consumer closeout output is saved.' : 'Saved plan output contains consumer closeout data.'
    }
  ];
  const hasBlocked = rows.some((row) => row.status === 'blocked');
  const hasHold = rows.some((row) => row.status === 'hold');
  return {
    status: hasBlocked ? 'blocked' : hasHold ? 'holdForCopyPolish' : 'readyForUxCopy',
    headline: hasBlocked
      ? 'Do not move the drawdown check into consumer UX.'
      : hasHold
        ? 'Hold the drawdown check for copy polish.'
        : 'Ready for consumer UX copy.',
    detail:
      'This closeout decides whether the bounded execution result is clear enough for the next consumer-facing design pass.',
    rows,
    reviewNote:
      'Consumer closeout only. It does not save output, apply a strategy, or create account instructions.',
    disposition: 'v1DrawdownConsumerCloseoutOnly'
  };
}

export function selectTaxAwareDrawdownV1UxHeadline({
  consumerCloseout
}: {
  consumerCloseout: TaxAwareDrawdownV1ConsumerCloseout;
}): TaxAwareDrawdownV1UxHeadline {
  return {
    status: consumerCloseout.status === 'readyForUxCopy' ? 'ready' : consumerCloseout.status === 'holdForCopyPolish' ? 'hold' : 'blocked',
    headline:
      consumerCloseout.status === 'readyForUxCopy'
        ? 'Review one bounded drawdown check.'
        : consumerCloseout.status === 'holdForCopyPolish'
          ? 'Drawdown check needs more polish.'
          : 'Drawdown check is blocked.',
    subhead:
      'This compares the current plan with one bounded registered-timing scenario. It does not change the editable plan.',
    reviewNote:
      'UX headline only. It frames the bounded execution result without making a recommendation.',
    disposition: 'v1DrawdownUxHeadlineOnly'
  };
}

export function selectTaxAwareDrawdownV1UxComparisonCard({
  execution
}: {
  execution: TaxAwareDrawdownV1ExecutionResult;
}): TaxAwareDrawdownV1UxComparisonCard {
  return {
    status: execution.status === 'reviewOnly' ? 'ready' : execution.status === 'notReady' ? 'hold' : 'blocked',
    rows: execution.rows.map((row) => ({
      id: row.id,
      label: row.label,
      value: row.value,
      status: row.status,
      detail: row.detail
    })),
    reviewNote:
      'UX comparison card only. It summarizes the executed scenario without saving or applying it.',
    disposition: 'v1DrawdownUxComparisonCardOnly'
  };
}

export function selectTaxAwareDrawdownV1UxReviewActions({
  consumerCloseout
}: {
  consumerCloseout: TaxAwareDrawdownV1ConsumerCloseout;
}): TaxAwareDrawdownV1UxReviewActions {
  const blocked = consumerCloseout.status === 'blocked';
  const held = consumerCloseout.status === 'holdForCopyPolish';
  return {
    status: blocked ? 'blocked' : held ? 'held' : 'available',
    rows: [
      {
        id: 'reviewInputs',
        label: 'Review household inputs',
        status: blocked ? 'blocked' : 'review',
        detail: 'Check registered balances, benefit timing, locked-in accounts, survivor setup, and estate intent.'
      },
      {
        id: 'compareCurrentPlan',
        label: 'Compare with the current plan',
        status: blocked ? 'blocked' : 'review',
        detail: 'Read the movement against the current plan before treating the result as useful.'
      },
      {
        id: 'confirmTaxContext',
        label: 'Confirm tax context',
        status: held ? 'hold' : blocked ? 'blocked' : 'review',
        detail: 'Use the result as tax review evidence, not a filing instruction.'
      },
      {
        id: 'keepEditablePlan',
        label: 'Keep the editable plan unchanged',
        status: 'review',
        detail: 'Save the editable plan only after changing household inputs yourself.'
      }
    ],
    reviewNote:
      'UX review actions only. They guide review and do not create account instructions.',
    disposition: 'v1DrawdownUxReviewActionsOnly'
  };
}

export function selectTaxAwareDrawdownV1UxCopyGuard(plan: V2PlanPayload): TaxAwareDrawdownV1UxCopyGuard {
  const savedPlanClean = drawdownExecutionSavedPlanGuard(plan);
  const rows: TaxAwareDrawdownV1UxCopyGuard['rows'] = [
    {
      id: 'noRecommendation',
      label: 'No recommendation language',
      status: 'ok',
      detail: 'The UX candidate says review, not recommend or apply.'
    },
    {
      id: 'noGuarantee',
      label: 'No guarantee language',
      status: 'ok',
      detail: 'The UX candidate avoids certainty and safe-spend framing.'
    },
    {
      id: 'noInstruction',
      label: 'No instruction language',
      status: 'ok',
      detail: 'The UX candidate does not tell the household which account to withdraw from.'
    },
    {
      id: 'savedPlan',
      label: 'Saved plan boundary',
      status: savedPlanClean ? 'ok' : 'blocked',
      detail: savedPlanClean ? 'No UX candidate output is saved.' : 'Saved plan output contains UX candidate data.'
    }
  ];
  return {
    status: rows.some((row) => row.status === 'blocked') ? 'blocked' : 'clear',
    rows,
    reviewNote:
      'UX copy guard only. It protects the consumer presentation from advice-like language.',
    disposition: 'v1DrawdownUxCopyGuardOnly'
  };
}

export function selectTaxAwareDrawdownV1UxReadinessCloseout({
  plan,
  headline,
  comparison,
  actions,
  copyGuard
}: {
  plan: V2PlanPayload;
  headline: TaxAwareDrawdownV1UxHeadline;
  comparison: TaxAwareDrawdownV1UxComparisonCard;
  actions: TaxAwareDrawdownV1UxReviewActions;
  copyGuard: TaxAwareDrawdownV1UxCopyGuard;
}): TaxAwareDrawdownV1UxReadinessCloseout {
  const savedPlanClean = drawdownExecutionSavedPlanGuard(plan);
  const rows: TaxAwareDrawdownV1UxReadinessCloseout['rows'] = [
    {
      id: 'headline',
      label: 'Headline',
      status: headline.status === 'ready' ? 'ready' : headline.status === 'hold' ? 'hold' : 'blocked',
      detail: headline.headline
    },
    {
      id: 'comparison',
      label: 'Comparison card',
      status: comparison.status === 'ready' ? 'ready' : comparison.status === 'hold' ? 'hold' : 'blocked',
      detail: comparison.reviewNote
    },
    {
      id: 'actions',
      label: 'Review actions',
      status: actions.status === 'available' ? 'ready' : actions.status === 'held' ? 'hold' : 'blocked',
      detail: actions.reviewNote
    },
    {
      id: 'copy',
      label: 'Copy guard',
      status: copyGuard.status === 'clear' ? 'ready' : 'blocked',
      detail: copyGuard.reviewNote
    },
    {
      id: 'savedPlan',
      label: 'Saved plan boundary',
      status: savedPlanClean ? 'ready' : 'blocked',
      detail: savedPlanClean ? 'No UX readiness output is saved.' : 'Saved plan output contains UX readiness data.'
    }
  ];
  const hasBlocked = rows.some((row) => row.status === 'blocked');
  const hasHold = rows.some((row) => row.status === 'hold');
  return {
    status: hasBlocked ? 'blocked' : hasHold ? 'holdForDesignPolish' : 'readyForDesign',
    headline: hasBlocked
      ? 'Do not design the drawdown UX yet.'
      : hasHold
        ? 'Hold the drawdown UX for polish.'
        : 'Ready for drawdown UX design.',
    detail:
      'This closeout checks whether the bounded execution result is ready to be shaped into a consumer-facing Details experience.',
    rows,
    reviewNote:
      'UX readiness closeout only. It does not move the result into Overview, save output, apply a strategy, or create account instructions.',
    disposition: 'v1DrawdownUxReadinessCloseoutOnly'
  };
}

export function selectTaxAwareDrawdownV1ReentryReview({
  plan,
  detailedStressDecision,
  executionPhase,
  uxReadiness
}: {
  plan: V2PlanPayload;
  detailedStressDecision: DetailedStressV1DecisionCloseout;
  executionPhase: TaxAwareDrawdownV1PhaseCloseout;
  uxReadiness: TaxAwareDrawdownV1UxReadinessCloseout;
}): TaxAwareDrawdownV1ReentryReview {
  const savedPlanClean = drawdownExecutionSavedPlanGuard(plan);
  const rows: TaxAwareDrawdownV1ReentryReview['rows'] = [
    {
      id: 'detailedStressDecision',
      label: 'Detailed stress decision',
      status:
        detailedStressDecision.status === 'readyToReturnToV1Drawdown'
          ? 'ready'
          : detailedStressDecision.status === 'blocked'
            ? 'blocked'
            : 'hold',
      detail: detailedStressDecision.headline
    },
    {
      id: 'executionPhase',
      label: 'Bounded execution phase',
      status:
        executionPhase.status === 'readyForConsumerUx'
          ? 'ready'
          : executionPhase.status === 'stopBeforeConsumerUx'
            ? 'blocked'
            : 'hold',
      detail: executionPhase.headline
    },
    {
      id: 'uxReadiness',
      label: 'Consumer UX readiness',
      status:
        uxReadiness.status === 'readyForDesign'
          ? 'ready'
          : uxReadiness.status === 'blocked'
            ? 'blocked'
            : 'hold',
      detail: uxReadiness.headline
    },
    {
      id: 'savedPlan',
      label: 'Saved plan boundary',
      status: savedPlanClean ? 'ready' : 'blocked',
      detail: savedPlanClean ? 'No v1 drawdown re-entry output is saved.' : 'Saved plan output contains v1 drawdown re-entry data.'
    },
    {
      id: 'scope',
      label: 'V1 scope',
      status: 'ready',
      detail: 'Next work stays focused on recommended-plan and bounded drawdown review, not detailed stress migration.'
    }
  ];
  const hasBlocked = rows.some((row) => row.status === 'blocked');
  const hasHold = rows.some((row) => row.status === 'hold');

  return {
    status: hasBlocked ? 'blocked' : hasHold ? 'holdForReadiness' : 'readyForV1Drawdown',
    headline: hasBlocked
      ? 'Hold before returning to v1 drawdown work.'
      : hasHold
        ? 'V1 drawdown re-entry needs one more readiness cleanup.'
        : 'Ready to return to v1 drawdown work.',
    detail:
      'This checkpoint confirms detailed stress has been deferred for v1 and the bounded drawdown path can resume without expanding scope.',
    rows,
    reviewNote:
      'V1 drawdown re-entry review only. It does not apply a strategy, create account instructions, save output, or migrate detailed stress.',
    disposition: 'v1DrawdownReentryReviewOnly'
  };
}

export function selectTaxAwareDrawdownV1NextSprintPlan({
  reentry,
  exampleGateClear = true,
  savedPlanClean = true
}: {
  reentry: TaxAwareDrawdownV1ReentryReview;
  exampleGateClear?: boolean;
  savedPlanClean?: boolean;
}): TaxAwareDrawdownV1NextSprintPlan {
  const rows: TaxAwareDrawdownV1NextWorkItem[] = [
    {
      id: 'recommendedPlan',
      label: 'Recommended-plan framing',
      status: reentry.status === 'readyForV1Drawdown' ? 'next' : reentry.status === 'blocked' ? 'blocked' : 'hold',
      detail: 'Shape the bounded drawdown result as review evidence inside the recommended household plan.'
    },
    {
      id: 'boundedDrawdown',
      label: 'Bounded drawdown review',
      status: reentry.status === 'readyForV1Drawdown' ? 'next' : reentry.status === 'blocked' ? 'blocked' : 'hold',
      detail: 'Keep the next sprint focused on bounded review language, not account-by-account instructions.'
    },
    {
      id: 'detailsCopy',
      label: 'Details copy',
      status: 'ready',
      detail: 'Use calm, review-oriented language and keep Overview light.'
    },
    {
      id: 'exampleGate',
      label: 'Example gate',
      status: exampleGateClear ? 'ready' : 'hold',
      detail: exampleGateClear ? 'Example coverage can support the next sprint.' : 'Example coverage needs review before promotion.'
    },
    {
      id: 'savedPlan',
      label: 'Saved plan boundary',
      status: savedPlanClean ? 'ready' : 'blocked',
      detail: savedPlanClean ? 'Next-sprint planning output remains runtime-only.' : 'Next-sprint planning output must not enter saved plans.'
    }
  ];
  const blocked = rows.some((row) => row.status === 'blocked');
  const held = rows.some((row) => row.status === 'hold');

  return {
    status: blocked ? 'blocked' : held ? 'holdForCleanup' : 'readyForNextSprint',
    headline: blocked
      ? 'Next drawdown sprint is blocked.'
      : held
        ? 'Next drawdown sprint needs cleanup first.'
        : 'Next drawdown sprint is ready.',
    detail:
      'The next sprint should translate bounded drawdown execution into clearer recommended-plan review evidence while preserving all v1 guardrails.',
    rows,
    reviewNote:
      'Next sprint plan only. It does not add optimizer behavior, apply drawdown changes, create account instructions, or save output.',
    disposition: 'v1DrawdownNextSprintPlanOnly'
  };
}

export function selectTaxAwareDrawdownV1ReentryCloseout({
  reentry,
  nextSprint
}: {
  reentry: TaxAwareDrawdownV1ReentryReview;
  nextSprint: TaxAwareDrawdownV1NextSprintPlan;
}): TaxAwareDrawdownV1ReentryCloseout {
  const blocked = reentry.status === 'blocked' || nextSprint.status === 'blocked';
  const ready = reentry.status === 'readyForV1Drawdown' && nextSprint.status === 'readyForNextSprint';

  return {
    status: blocked ? 'blocked' : ready ? 'readyToProceed' : 'holdBeforeProceeding',
    headline: blocked
      ? 'V1 drawdown re-entry is blocked.'
      : ready
        ? 'Ready for the next bounded drawdown sprint.'
        : 'Hold before the next bounded drawdown sprint.',
    detail: blocked
      ? 'Clean up blocked re-entry or next-sprint rows before proceeding.'
      : ready
        ? 'Detailed stress remains deferred for v1, and the next sprint can focus on recommended-plan drawdown review polish.'
        : 'Resolve held re-entry or example coverage items before proceeding.',
    rows: [
      {
        id: 'reentry',
        label: 'Re-entry review',
        status: reentry.status === 'readyForV1Drawdown' ? 'ready' : reentry.status === 'blocked' ? 'blocked' : 'hold',
        detail: reentry.headline
      },
      {
        id: 'nextSprint',
        label: 'Next sprint plan',
        status: nextSprint.status === 'readyForNextSprint' ? 'ready' : nextSprint.status === 'blocked' ? 'blocked' : 'hold',
        detail: nextSprint.headline
      },
      {
        id: 'detailedStress',
        label: 'Detailed stress',
        status: 'ready',
        detail: 'Detailed stress stays in the detailed report for v1.'
      },
      {
        id: 'persistence',
        label: 'Persistence',
        status: 'ready',
        detail: 'Re-entry and next-sprint output remain runtime-only.'
      }
    ],
    reviewNote:
      'V1 drawdown re-entry closeout only. It does not change optimizer behavior, apply a strategy, migrate detailed stress, or save output.',
    disposition: 'v1DrawdownReentryCloseoutOnly'
  };
}

export function selectTaxAwareDrawdownV1RecommendedPlanReview({
  plan,
  reentryCloseout,
  consumerSummary,
  comparison,
  limits
}: {
  plan: V2PlanPayload;
  reentryCloseout: TaxAwareDrawdownV1ReentryCloseout;
  consumerSummary: TaxAwareDrawdownV1ConsumerSummary;
  comparison: TaxAwareDrawdownV1UxComparisonCard;
  limits: TaxAwareDrawdownV1ConsumerLimits;
}): TaxAwareDrawdownV1RecommendedPlanReview {
  const savedPlanClean = drawdownExecutionSavedPlanGuard(plan);
  const rows: TaxAwareDrawdownV1RecommendedPlanReview['rows'] = [
    {
      id: 'reentry',
      label: 'Re-entry checkpoint',
      status: reentryCloseout.status === 'readyToProceed' ? 'ready' : reentryCloseout.status === 'blocked' ? 'blocked' : 'hold',
      detail: reentryCloseout.headline
    },
    {
      id: 'planFraming',
      label: 'Recommended-plan framing',
      status: consumerSummary.status === 'clearForReview' ? 'ready' : consumerSummary.status === 'blocked' ? 'blocked' : 'hold',
      detail: 'Frame the drawdown result as one review check inside the recommended household plan.'
    },
    {
      id: 'drawdownCheck',
      label: 'Drawdown check',
      status: comparison.status === 'ready' ? 'ready' : comparison.status === 'blocked' ? 'blocked' : 'hold',
      detail: 'Use the bounded comparison rows as review evidence, not account-by-account instructions.'
    },
    {
      id: 'limits',
      label: 'Visible limits',
      status: limits.status === 'visible' ? 'ready' : 'hold',
      detail: 'Keep the single-scenario, review-only, not-saved, and not-full-plan limits visible.'
    },
    {
      id: 'overviewBoundary',
      label: 'Overview boundary',
      status: 'ready',
      detail: 'Keep the detailed drawdown review in Details so Overview stays focused on the retirement answer.'
    },
    {
      id: 'savedPlan',
      label: 'Saved plan boundary',
      status: savedPlanClean ? 'ready' : 'blocked',
      detail: savedPlanClean ? 'No recommended-plan drawdown review output is saved.' : 'Saved plan output contains recommended-plan drawdown review data.'
    }
  ];
  const blocked = rows.some((row) => row.status === 'blocked');
  const held = rows.some((row) => row.status === 'hold');

  return {
    status: blocked ? 'blocked' : held ? 'holdForPolish' : 'readyForDetails',
    headline: blocked
      ? 'Recommended-plan drawdown review is blocked.'
      : held
        ? 'Recommended-plan drawdown review needs polish.'
        : 'Recommended-plan drawdown review is ready for Details.',
    detail:
      'This turns the bounded drawdown result into a Details-level review item inside the recommended plan without changing the plan.',
    rows,
    reviewNote:
      'Recommended-plan drawdown review only. It does not apply a strategy, create instructions, move into Overview, or save output.',
    disposition: 'v1DrawdownRecommendedPlanReviewOnly'
  };
}

export function selectTaxAwareDrawdownV1DetailsPlacement({
  review,
  headline,
  comparison,
  actions
}: {
  review: TaxAwareDrawdownV1RecommendedPlanReview;
  headline: TaxAwareDrawdownV1UxHeadline;
  comparison: TaxAwareDrawdownV1UxComparisonCard;
  actions: TaxAwareDrawdownV1UxReviewActions;
}): TaxAwareDrawdownV1DetailsPlacement {
  const rows: TaxAwareDrawdownV1DetailsPlacement['rows'] = [
    {
      id: 'location',
      label: 'Location',
      status: review.status === 'readyForDetails' ? 'ready' : review.status === 'blocked' ? 'blocked' : 'hold',
      detail: 'Place the bounded drawdown review in Details under the recommended plan.'
    },
    {
      id: 'headline',
      label: 'Headline',
      status: headline.status === 'ready' ? 'ready' : headline.status === 'blocked' ? 'blocked' : 'hold',
      detail: headline.headline
    },
    {
      id: 'comparison',
      label: 'Comparison rows',
      status: comparison.status === 'ready' ? 'ready' : comparison.status === 'blocked' ? 'blocked' : 'hold',
      detail: comparison.reviewNote
    },
    {
      id: 'limits',
      label: 'Limits',
      status: 'ready',
      detail: 'Show clear review-only limits beside the comparison.'
    },
    {
      id: 'nextActions',
      label: 'Review actions',
      status: actions.status === 'available' ? 'ready' : actions.status === 'blocked' ? 'blocked' : 'hold',
      detail: actions.reviewNote
    }
  ];
  const blocked = rows.some((row) => row.status === 'blocked');
  const held = rows.some((row) => row.status === 'hold');

  return {
    status: blocked ? 'blocked' : held ? 'holdForPolish' : 'detailsReady',
    headline: blocked ? 'Drawdown Details placement is blocked.' : held ? 'Drawdown Details placement needs polish.' : 'Drawdown Details placement is ready.',
    detail:
      'This placement keeps the drawdown review close to the recommended plan explanation while avoiding Overview density.',
    rows,
    reviewNote:
      'Details placement only. It does not move the bounded drawdown result into Overview, apply it, or save output.',
    disposition: 'v1DrawdownDetailsPlacementOnly'
  };
}

export function selectTaxAwareDrawdownV1ReviewCopyGuard({
  savedPlanClean = true
}: {
  savedPlanClean?: boolean;
} = {}): TaxAwareDrawdownV1ReviewCopyGuard {
  const rows: TaxAwareDrawdownV1ReviewCopyGuard['rows'] = [
    {
      id: 'notAdvice',
      label: 'Review wording',
      status: 'ok',
      detail: 'Copy frames the result as review evidence, not financial or tax advice.'
    },
    {
      id: 'notInstruction',
      label: 'No instructions',
      status: 'ok',
      detail: 'Copy does not tell the household which account to withdraw from in any year.'
    },
    {
      id: 'notSaved',
      label: 'Not saved',
      status: savedPlanClean ? 'ok' : 'blocked',
      detail: savedPlanClean ? 'Copy states the editable plan is unchanged.' : 'Saved-plan boundary needs cleanup.'
    },
    {
      id: 'notOverview',
      label: 'Details only',
      status: 'ok',
      detail: 'Copy keeps detailed drawdown evidence in Details, not Overview.'
    }
  ];
  return {
    status: rows.some((row) => row.status === 'blocked') ? 'blocked' : 'clear',
    rows,
    reviewNote:
      'Drawdown review copy guard only. It blocks advice-like, instructional, saved-output, or Overview-heavy framing.',
    disposition: 'v1DrawdownReviewCopyGuardOnly'
  };
}

export function selectTaxAwareDrawdownV1RecommendedPlanCloseout({
  plan,
  review,
  placement,
  copyGuard
}: {
  plan: V2PlanPayload;
  review: TaxAwareDrawdownV1RecommendedPlanReview;
  placement: TaxAwareDrawdownV1DetailsPlacement;
  copyGuard: TaxAwareDrawdownV1ReviewCopyGuard;
}): TaxAwareDrawdownV1RecommendedPlanCloseout {
  const savedPlanClean = drawdownExecutionSavedPlanGuard(plan);
  const rows: TaxAwareDrawdownV1RecommendedPlanCloseout['rows'] = [
    {
      id: 'review',
      label: 'Recommended-plan review',
      status: review.status === 'readyForDetails' ? 'ready' : review.status === 'blocked' ? 'blocked' : 'hold',
      detail: review.headline
    },
    {
      id: 'placement',
      label: 'Details placement',
      status: placement.status === 'detailsReady' ? 'ready' : placement.status === 'blocked' ? 'blocked' : 'hold',
      detail: placement.headline
    },
    {
      id: 'copy',
      label: 'Copy guard',
      status: copyGuard.status === 'clear' ? 'ready' : 'blocked',
      detail: copyGuard.reviewNote
    },
    {
      id: 'savedPlan',
      label: 'Saved plan boundary',
      status: savedPlanClean ? 'ready' : 'blocked',
      detail: savedPlanClean ? 'No recommended-plan closeout output is saved.' : 'Saved plan output contains recommended-plan closeout data.'
    }
  ];
  const blocked = rows.some((row) => row.status === 'blocked');
  const held = rows.some((row) => row.status === 'hold');
  return {
    status: blocked ? 'blocked' : held ? 'holdForPolish' : 'readyForImplementation',
    headline: blocked
      ? 'Recommended-plan drawdown polish is blocked.'
      : held
        ? 'Recommended-plan drawdown polish needs cleanup.'
        : 'Recommended-plan drawdown polish is ready.',
    detail:
      'The next implementation can show bounded drawdown review evidence in Details with clear limits and no saved plan change.',
    rows,
    reviewNote:
      'Recommended-plan closeout only. It does not apply a drawdown strategy, create account instructions, move evidence into Overview, or save output.',
    disposition: 'v1DrawdownRecommendedPlanCloseoutOnly'
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
    !('containedDrawdownDetailsDensity' in saved) &&
    !('containedDrawdownReviewChecklist' in saved) &&
    !('containedDrawdownExampleGate' in saved) &&
    !('containedDrawdownCopyGuard' in saved) &&
    !('containedDrawdownProductGoNoGo' in saved) &&
    !('containedDrawdownPromotionReadiness' in saved) &&
    !('containedDrawdownNextStepGuide' in saved) &&
    !('containedDrawdownBlockerRegister' in saved) &&
    !('containedDrawdownExamplePromotionGate' in saved) &&
    !('containedDrawdownPhaseMilestoneCloseout' in saved) &&
    !('v1DrawdownExecutionIntent' in saved) &&
    !('v1DrawdownExecutionCandidate' in saved) &&
    !('v1DrawdownExecutionResult' in saved) &&
    !('v1DrawdownExecutionReview' in saved) &&
    !('v1DrawdownExecutionExampleGate' in saved) &&
    !('v1DrawdownExecutionPhaseCloseout' in saved) &&
    !('v1DrawdownConsumerSummary' in saved) &&
    !('v1DrawdownSafetyChecklist' in saved) &&
    !('v1DrawdownConsumerLimits' in saved) &&
    !('v1DrawdownConsumerExampleGate' in saved) &&
    !('v1DrawdownConsumerCloseout' in saved) &&
    !('v1DrawdownUxHeadline' in saved) &&
    !('v1DrawdownUxComparisonCard' in saved) &&
    !('v1DrawdownUxReviewActions' in saved) &&
    !('v1DrawdownUxCopyGuard' in saved) &&
    !('v1DrawdownUxReadinessCloseout' in saved) &&
    !('v1DrawdownReentryReview' in saved) &&
    !('v1DrawdownNextSprintPlan' in saved) &&
    !('v1DrawdownReentryCloseout' in saved) &&
    !('v1DrawdownRecommendedPlanReview' in saved) &&
    !('v1DrawdownDetailsPlacement' in saved) &&
    !('v1DrawdownReviewCopyGuard' in saved) &&
    !('v1DrawdownRecommendedPlanCloseout' in saved) &&
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
