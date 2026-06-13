import { extractPlanPayload, p2LooksBlank } from '../data/planFile';
import type { SimulationResult, V2PlanPayload } from '../types/plan';
import { buildOptimizerContract, type OptimizerContract, type OptimizerLeverId } from './optimizerContract';
import { hasTwoPersonDbPensionIncome, shouldIncludeBaselinePensionSplitting } from './pensionSplitting';
import { runSimulationSafely, type SimulationConfig } from './runSimulation';

export type BenefitGridCandidateId = `benefitGridCpp${number}Oas${number}`;

export type BoundedOptimizerCandidateId =
  | 'baseline'
  | 'spendLess5'
  | 'spendLess10'
  | 'retireLater1'
  | 'retireLater2'
  | 'delayBenefits'
  | BenefitGridCandidateId
  | 'pensionSplit'
  | 'cppSharing'
  | 'withoutDownsize'
  | 'withdrawalDefault'
  | 'withdrawalRegisteredFirst'
  | 'withdrawalNonRegisteredFirst';

export type BoundedOptimizerLever = OptimizerLeverId | 'pensionSplitting' | 'cppSharing';

export type BoundedOptimizerCandidateDefinition = {
  id: BoundedOptimizerCandidateId;
  label: string;
  plan: V2PlanPayload;
  config: SimulationConfig;
  changedLevers: BoundedOptimizerLever[];
  changeSummary: string;
  reviewNote: string;
  disruptionPenalty: number;
};

export type BoundedOptimizerCandidateRow = {
  id: BoundedOptimizerCandidateId;
  label: string;
  status: 'suggested' | 'review' | 'blocked';
  changedLevers: BoundedOptimizerLever[];
  changeSummary: string;
  reviewNote: string;
  suggestionEligible: boolean;
  suggestionReason: string;
  fundedYears: number;
  totalYears: number;
  fundedThroughYear: number | null;
  firstShortfallYear: number | null;
  sustainableAnnualSpend: number;
  endPortfolio: number;
  endPortfolioDelta: number;
  lifetimeTax: number;
  lifetimeTaxDelta: number;
  score: number;
};

export type BoundedOptimizerExplanation = {
  whyThisOption: string[];
  tradeoffs: string[];
  verifyBeforeUsing: string[];
  plainLanguageSummary: string;
};

export type BoundedOptimizerEligibilityNote = {
  lever: BoundedOptimizerLever | 'survivor';
  status: 'eligible' | 'skipped' | 'needsReview';
  reason: string;
};

export type BoundedOptimizerGuardrailNote = {
  id: BoundedOptimizerLever | 'survivor';
  label: string;
  status: 'tested' | 'notTested' | 'reviewFirst';
  reason: string;
};

export type BoundedOptimizerRecommendationNote = {
  candidateId: BoundedOptimizerCandidateId;
  label: string;
  status: 'canHighlight' | 'reviewOnly';
  reason: string;
};

export type BoundedOptimizerOptionGroupId = 'currentPlan' | 'lifestyle' | 'timing' | 'incomeSharing' | 'drawdownReview' | 'homeEstate';

export type BoundedOptimizerOptionGroup = {
  id: BoundedOptimizerOptionGroupId;
  label: string;
  summary: string;
  candidateIds: BoundedOptimizerCandidateId[];
  reviewOnlyCount: number;
  canHighlightCount: number;
};

export type BoundedOptimizerEvidenceRow = {
  id:
    | 'pensionLifetimeTax'
    | 'pensionFirstYearTax'
    | 'pensionPeakTax'
    | 'pensionOasRecovery'
    | 'pensionPortfolio'
    | 'cppSharingLifetimeTax'
    | 'cppSharingFirstYearTax'
    | 'cppSharingPeakTax'
    | 'cppSharingOasRecovery'
    | 'cppSharingPortfolio'
    | 'benefitBridgeYears'
    | 'benefitFirstBridgeShortfall'
    | 'benefitLifetimeTax'
    | 'benefitPortfolio'
    | 'benefitGridBestPair'
    | 'benefitGridTopThree'
    | 'benefitGridFundedYears'
    | 'benefitGridLifetimeTax'
    | 'benefitGridPortfolio'
    | 'homeRelianceFundedYears'
    | 'homeRelianceFirstShortfall'
    | 'homeReliancePortfolio'
    | 'homeRelianceLifetimeTax'
    | 'homeRelianceEstateGap'
    | 'withdrawalFamilyFirst'
    | 'withdrawalFamilyFundedYears'
    | 'withdrawalFamilyLifetimeTax'
    | 'withdrawalFamilyFirstYearTax'
    | 'withdrawalFamilyPeakTax'
    | 'withdrawalFamilyOasRecovery'
    | 'withdrawalFamilyPortfolio';
  label: string;
  value: string;
  detail: string;
  tone: 'neutral' | 'ok' | 'watch';
};

export type BoundedOptimizerDriverRow = {
  id: 'fundedYears' | 'lifetimeTax' | 'peakTax' | 'oasRecovery' | 'portfolio';
  label: string;
  value: string;
  detail: string;
  tone: 'neutral' | 'ok' | 'watch';
};

export type BoundedOptimizerCompactEvidenceRow = {
  id: 'monthlySpend' | 'fundedYears' | 'lifetimeTax' | 'oasRecovery' | 'moneyLeft';
  label: string;
  value: string;
  detail: string;
  tone: 'neutral' | 'ok' | 'watch';
};

export type OptimizerCapacityConstraintRow = {
  id: 'minimumFloor' | 'estate' | 'survivor' | 'benefitTiming' | 'withdrawalSequencing';
  label: string;
  status: 'protected' | 'review' | 'blocked' | 'deferred';
  detail: string;
};

export type OptimizerCapacityStatus = 'covered' | 'tight' | 'gap' | 'cannotTell' | 'blocked';

export type OptimizerCapacityObjective = {
  status: OptimizerCapacityStatus;
  selectedCandidateId: BoundedOptimizerCandidateId | null;
  selectedCandidateLabel: string;
  monthlyAfterTaxCapacity: number | null;
  minimumMonthlyExpenseFloor: number | null;
  optionalMonthlyRoom: number | null;
  estateTarget: number | null;
  projectedEstate: number | null;
  survivorConstraint: 'protected' | 'reviewFirst' | 'notApplicable';
  timingComparison: 'included' | 'blocked' | 'deferred';
  withdrawalSequencing: 'deferred';
  rows: OptimizerCapacityConstraintRow[];
  detail: string;
  boundary: string;
};

export type OptimizerCapacityObjectiveInput = {
  contractReady: boolean;
  selectedCandidateId: BoundedOptimizerCandidateId | null;
  selectedCandidateLabel: string;
  sustainableAnnualSpend: number | null;
  annualExpenseFloor: number | null;
  estateTarget: number | null;
  projectedEstate: number | null;
  hasSecondPerson: boolean;
  survivorNeedsReview: boolean;
  benefitTimingStatus: OptimizerCandidateFamily['status'] | null;
};

export type OptimizerCapacityReportReadinessRow = {
  id: 'capacitySummary' | 'floorComparison' | 'constraintRows' | 'taxContext' | 'savedOutput' | 'accountInstructions';
  label: string;
  status: 'ready' | 'deferred' | 'blocked';
  detail: string;
};

export type OptimizerCapacityReportReadiness = {
  status: 'readyForLaterReport' | 'needsInputs' | 'deferred';
  reportFields: Array<
    | 'monthlyAfterTaxCapacity'
    | 'minimumMonthlyExpenseFloor'
    | 'optionalMonthlyRoom'
    | 'estateTarget'
    | 'projectedEstate'
    | 'survivorConstraint'
    | 'timingComparison'
    | 'withdrawalSequencingDeferred'
  >;
  rows: OptimizerCapacityReportReadinessRow[];
  summary: string;
  boundary: string;
  nextStep: string;
};

export type OptimizerCapacityExportGuardRow = {
  id: 'planFile' | 'reportOutput' | 'csvOutput' | 'schemaBoundary' | 'privateFiles';
  label: string;
  status: 'blocked' | 'deferred' | 'verify';
  detail: string;
};

export type OptimizerCapacityExportGuard = {
  status: 'guarded';
  rows: OptimizerCapacityExportGuardRow[];
  forbiddenSavedKeys: Array<
    | 'capacityObjective'
    | 'capacityReportReadiness'
    | 'capacityExportGuard'
    | 'annualSequencingPrepContract'
    | 'annualSequencingInputAdapter'
    | 'experimentalAccountOrderDraft'
    | 'experimentalAnnualInstructionDraft'
    | 'boundedOptimizer'
    | 'optimizerOutput'
    | 'annualAccountInstructions'
  >;
  summary: string;
  boundary: string;
};

export type OptimizerAnnualSequencingPrepRow = {
  id:
    | 'capacityObjective'
    | 'annualResults'
    | 'accountBalances'
    | 'taxContext'
    | 'estateSurvivorConstraints'
    | 'benefitTimingComparison'
    | 'outputBoundary';
  label: string;
  status: 'ready' | 'deferred' | 'blocked';
  detail: string;
};

export type OptimizerAnnualSequencingPrepContract = {
  status: 'contractOnly';
  inputs: {
    capacityObjective: 'required';
    annualResultRows: 'required';
    accountBalances: 'required';
    taxContext: 'annualRowsOnly';
    estateAndSurvivorConstraints: 'required';
    benefitTimingComparison: 'boundedReviewOnly';
  };
  blockedOutputs: Array<'annualAccountInstructions' | 'accountOrder' | 'taxBracketInstructions' | 'savedSequencingOutput' | 'csvSequencingOutput'>;
  rows: OptimizerAnnualSequencingPrepRow[];
  summary: string;
  boundary: string;
  nextStep: string;
};

export type OptimizerAnnualSequencingInputAdapterRow = {
  id: 'annualRows' | 'accountBalances' | 'taxContext' | 'capacityObjective' | 'constraints' | 'outputBoundary';
  label: string;
  status: 'ready' | 'partial' | 'blocked';
  detail: string;
};

export type OptimizerAnnualSequencingInputAdapter = {
  status: 'readyForDraftPlanning' | 'needsInputs' | 'blocked';
  sourceCandidateId: BoundedOptimizerCandidateId | null;
  sourceCandidateLabel: string;
  yearRange: {
    firstYear: number | null;
    lastYear: number | null;
    yearCount: number;
  };
  availableAccountBalanceFields: Array<'bal_rrsp' | 'bal_rrsp_f' | 'bal_rrsp_m' | 'bal_tfsa' | 'bal_lif' | 'bal_nonreg' | 'bal_cash' | 'bal_total'>;
  availableTaxFields: Array<'totalTaxYear' | 'taxableIncome' | 'totalOasClawY' | 'totalAftaxYear'>;
  constraintInputs: Array<'minimumExpenseFloor' | 'estateTarget' | 'survivorReview' | 'benefitTimingComparison'>;
  rows: OptimizerAnnualSequencingInputAdapterRow[];
  summary: string;
  boundary: string;
  nextStep: string;
};

export type OptimizerExperimentalAccountBucket = 'registered' | 'lif' | 'nonRegistered' | 'tfsa' | 'cash';

export type OptimizerExperimentalAccountOrderDraftRow = {
  bucket: OptimizerExperimentalAccountBucket;
  label: string;
  position: number;
  status: 'included' | 'contextOnly' | 'unavailable';
  rationale: string;
};

export type OptimizerExperimentalAccountOrderDraft = {
  status: 'draftReady' | 'needsInputs' | 'blocked';
  audience: 'syntheticTesterOnly';
  sourceCandidateId: BoundedOptimizerCandidateId | null;
  sourceCandidateLabel: string;
  order: OptimizerExperimentalAccountBucket[];
  rows: OptimizerExperimentalAccountOrderDraftRow[];
  blockedOutputs: Array<'annualDollarInstructions' | 'savedAccountOrder' | 'csvAccountOrder' | 'reportAccountOrder' | 'taxBracketInstructions'>;
  summary: string;
  boundary: string;
  nextStep: string;
};

export type OptimizerExperimentalAnnualInstructionDraftRow = {
  year: number;
  account: OptimizerExperimentalAccountBucket;
  label: string;
  amount: number;
  source: {
    candidateLabel: string;
    withdrawalField: string;
    withdrawalFieldLabel: string;
    accountOrderPosition: number | null;
    yearWithdrawalCount: number;
  };
  grouping: {
    yearAccountIndex: number;
    yearWithdrawalCount: number;
    mode: 'singleAccountYear' | 'multiAccountYear';
  };
  taxContext: {
    totalTaxYear: number;
    taxableIncome: number;
    oasRecovery: number;
    afterTaxSpending: number;
    effectiveTaxRatePct: number | null;
    oasRecoveryStatus: 'none' | 'present';
  };
  status: 'experimentalDraft';
  rationale: string;
};

export type OptimizerExperimentalAnnualAccountTotal = {
  year: number;
  totalAmount: number;
  accountCount: number;
  accountOrder: {
    status: 'contiguous' | 'gapped' | 'partial';
    activePositions: number[];
    skippedPositions: number[];
    detail: string;
  };
  accounts: Array<{
    account: OptimizerExperimentalAccountBucket;
    label: string;
    amount: number;
    accountOrderPosition: number | null;
  }>;
  taxContext: {
    totalTaxYear: number;
    afterTaxSpending: number;
    oasRecovery: number;
  };
};

export type OptimizerExperimentalAnnualInstructionReadiness = {
  status: 'readyForReview' | 'reviewFirst' | 'blocked';
  rows: Array<{
    id: 'yearTotals' | 'accountOrderConsistency' | 'accountOrderGaps' | 'taxContext' | 'outputBoundary';
    label: string;
    status: 'pass' | 'watch' | 'block';
    detail: string;
  }>;
  totalDraftAmount: number;
  yearCount: number;
  blockedOutputs: Array<'annualAccountInstructions' | 'savedInstructionOutput' | 'csvInstructionOutput' | 'reportInstructionOutput' | 'taxBracketInstructions' | 'productionUi'>;
  summary: string;
  boundary: string;
  nextStep: string;
};

export type OptimizerExperimentalAnnualInstructionCandidate = {
  year: number;
  status: 'readyForReview' | 'reviewFirst' | 'blocked';
  totalAmount: number;
  accountCount: number;
  accounts: Array<{
    account: OptimizerExperimentalAccountBucket;
    label: string;
    amount: number;
    accountOrderPosition: number | null;
    displayOrder: number;
  }>;
  reviewFlags: Array<'accountOrderGap' | 'partialAccountOrder' | 'limitedTaxContext'>;
  quality: {
    level: 'higher' | 'medium' | 'low' | 'blocked';
    score: number;
    rows: Array<{
      id: 'annualTotal' | 'accountOrder' | 'taxContext' | 'outputBoundary';
      label: string;
      status: 'pass' | 'watch' | 'block';
      detail: string;
    }>;
    repairTargets: Array<{
      id: 'accountOrderGap' | 'partialAccountOrder' | 'limitedTaxContext' | 'missingAnnualTotal';
      label: string;
      status: 'pass' | 'repair';
      detail: string;
    }>;
  };
  summary: string;
  boundary: string;
};

export type OptimizerExperimentalAnnualCandidateSelectionSummary = {
  status: 'readyForTesterReview' | 'reviewFirst' | 'blocked';
  strongestCandidateYears: number[];
  qualityCounts: Record<'higher' | 'medium' | 'low' | 'blocked', number>;
  repairThemes: Array<{
    id: 'accountOrderGap' | 'partialAccountOrder' | 'limitedTaxContext' | 'missingAnnualTotal';
    label: string;
    candidateYears: number[];
    status: 'pass' | 'repair';
    detail: string;
  }>;
  summary: string;
  boundary: string;
  nextStep: string;
};

export type OptimizerExperimentalAnnualCandidatePresentationReadiness = {
  status: 'readyForTesterReview' | 'reviewFirst' | 'blocked';
  displayRows: Array<{
    year: number;
    label: string;
    statusLabel: string;
    qualityLabel: string;
    repairPreview: string;
    totalAmount: number;
  }>;
  rows: Array<{
    id: 'candidateLabels' | 'qualityLabels' | 'repairPreview' | 'boundary';
    label: string;
    status: 'pass' | 'watch' | 'block';
    detail: string;
  }>;
  summary: string;
  boundary: string;
  nextStep: string;
};

export type OptimizerExperimentalTesterPacketBoundary = {
  status: 'readyForSyntheticTesterPacket' | 'reviewFirst' | 'blocked';
  visibleSections: Array<'candidateDisplayRows' | 'qualityLabels' | 'repairThemes' | 'runtimeBoundary'>;
  hiddenSections: Array<'savedSequencingOutput' | 'csvSequencingOutput' | 'reportOutput' | 'productionUi' | 'taxBracketInstructions' | 'finalAnnualInstructions'>;
  rows: Array<{
    id: 'visibleMaterial' | 'hiddenMaterial' | 'testerPurpose' | 'outputBoundary';
    label: string;
    status: 'pass' | 'watch' | 'block';
    detail: string;
  }>;
  testerCopy: {
    headline: string;
    purpose: string;
    boundary: string;
  };
  blockedOutputs: Array<'finalAnnualInstructions' | 'savedSequencingOutput' | 'csvSequencingOutput' | 'reportOutput' | 'productionUi' | 'taxBracketInstructions'>;
  summary: string;
  nextStep: string;
};

export type OptimizerExperimentalTesterPacketExportGuard = {
  status: 'guarded' | 'blocked';
  rows: Array<{
    id: 'savedPlanFile' | 'csvOutput' | 'reportOutput' | 'productionUi' | 'finalInstructions' | 'taxBracketInstructions';
    label: string;
    status: 'guarded' | 'blocked';
    detail: string;
  }>;
  forbiddenSavedKeys: Array<
    | 'testerPacketBoundary'
    | 'testerPacketExportGuard'
    | 'annualInstructionCandidates'
    | 'candidateSelectionSummary'
    | 'presentationReadiness'
    | 'experimentalAnnualInstructionDraft'
    | 'annualAccountInstructions'
  >;
  blockedOutputs: Array<'savedSequencingOutput' | 'csvSequencingOutput' | 'reportOutput' | 'productionUi' | 'taxBracketInstructions' | 'finalAnnualInstructions'>;
  summary: string;
  boundary: string;
  nextStep: string;
};

export type OptimizerExperimentalDraftTaxContextRow = {
  id: 'taxRange' | 'oasRecovery' | 'afterTaxSpending' | 'effectiveRate' | 'boundary';
  label: string;
  status: 'context' | 'watch' | 'blocked';
  detail: string;
};

export type OptimizerExperimentalDraftConfidenceLevel = 'higher' | 'medium' | 'low' | 'blocked';

export type OptimizerExperimentalDraftConfidenceRow = {
  id: 'draftRows' | 'taxContext' | 'accountOrder' | 'constraintCoverage' | 'survivorReview' | 'outputBoundary';
  label: string;
  status: 'pass' | 'watch' | 'block';
  detail: string;
};

export type OptimizerExperimentalDraftConfidence = {
  level: OptimizerExperimentalDraftConfidenceLevel;
  score: number;
  rows: OptimizerExperimentalDraftConfidenceRow[];
  blockers: string[];
  summary: string;
};

export type OptimizerExperimentalDraftHarmCheckRow = {
  id: 'shortfall' | 'estatePressure' | 'survivorReview' | 'oasRecovery' | 'taxContext' | 'outputBoundary';
  label: string;
  status: 'pass' | 'watch' | 'block';
  detail: string;
};

export type OptimizerExperimentalDraftReadinessSummary = {
  status: 'readyForTesterReview' | 'reviewFirst' | 'blocked';
  headline: string;
  rowCoverage: {
    draftRows: number;
    modelledYears: number;
  };
  confidenceLevel: OptimizerExperimentalDraftConfidenceLevel;
  blockerCount: number;
  watchCount: number;
  taxContext: 'available' | 'partial';
  reviewItems: string[];
  boundary: string;
  nextStep: string;
};

export type OptimizerRuntimeAnnualInstructionDraftGeneratorScope = {
  status: 'readyForRuntimeDraft' | 'reviewFirst' | 'blocked';
  allowedSources: Array<'selectedCandidateAnnualRows' | 'annualAccountTotals' | 'accountOrderDraft' | 'taxContextRows' | 'readinessSummary'>;
  rows: Array<{
    id: 'sourceRows' | 'annualTotals' | 'accountOrder' | 'taxContext' | 'outputBoundary';
    label: string;
    status: 'ready' | 'review' | 'blocked';
    detail: string;
  }>;
  blockedOutputs: Array<'savedSequencingOutput' | 'csvSequencingOutput' | 'reportOutput' | 'productionUi' | 'taxBracketInstructions' | 'finalAnnualInstructions' | 'schemaChanges'>;
  summary: string;
  boundary: string;
  nextStep: string;
};

export type OptimizerExperimentalAnnualInstructionDraft = {
  status: 'draftReady' | 'needsInputs' | 'blocked';
  audience: 'syntheticTesterOnly';
  sourceCandidateId: BoundedOptimizerCandidateId | null;
  sourceCandidateLabel: string;
  yearCount: number;
  rows: OptimizerExperimentalAnnualInstructionDraftRow[];
  annualAccountTotals: OptimizerExperimentalAnnualAccountTotal[];
  instructionReadiness: OptimizerExperimentalAnnualInstructionReadiness;
  annualInstructionCandidates: OptimizerExperimentalAnnualInstructionCandidate[];
  candidateSelectionSummary: OptimizerExperimentalAnnualCandidateSelectionSummary;
  presentationReadiness: OptimizerExperimentalAnnualCandidatePresentationReadiness;
  testerPacketBoundary: OptimizerExperimentalTesterPacketBoundary;
  testerPacketExportGuard: OptimizerExperimentalTesterPacketExportGuard;
  taxContextRows: OptimizerExperimentalDraftTaxContextRow[];
  confidence: OptimizerExperimentalDraftConfidence;
  harmChecks: OptimizerExperimentalDraftHarmCheckRow[];
  readinessSummary: OptimizerExperimentalDraftReadinessSummary;
  runtimeDraftGeneratorScope: OptimizerRuntimeAnnualInstructionDraftGeneratorScope;
  blockedOutputs: Array<'savedInstructionOutput' | 'csvInstructionOutput' | 'reportInstructionOutput' | 'taxBracketInstructions' | 'productionUi'>;
  summary: string;
  boundary: string;
  nextStep: string;
};

export type OptimizerBetaSavedSequencingRow = {
  year: number;
  accountLabel: string;
  reviewAmount: number;
  sourceEvidence: string;
  taxContext: string;
  constraintContext: string;
  qualityStatus: 'readyForBetaReview' | 'readyWithContext' | 'reviewBeforeSave';
  qualityScore: number;
  qualityReasons: string[];
  boundaryStatus: string;
};

export type OptimizerBetaSavedSequencingAdapter = {
  status: 'readyForBetaReview' | 'reviewFirst' | 'blocked';
  audience: 'internalBetaOnly';
  sourceDraftStatus: OptimizerExperimentalAnnualInstructionDraft['status'];
  sourceCandidateId: BoundedOptimizerCandidateId | null;
  sourceCandidateLabel: string;
  rows: OptimizerBetaSavedSequencingRow[];
  allowedFields: Array<
    | 'year'
    | 'accountLabel'
    | 'reviewAmount'
    | 'sourceEvidence'
    | 'taxContext'
    | 'constraintContext'
    | 'qualityStatus'
  >;
  excludedFields: Array<'finalInstruction' | 'taxBracketTarget' | 'csvColumn' | 'reportRow' | 'productionUiAction'>;
  blockedOutputs: Array<
    | 'savedPlanSchemaChanges'
    | 'engineOutputSchemaChanges'
    | 'planJsonGeneration'
    | 'csvOutput'
    | 'reportOutput'
    | 'productionUi'
    | 'finalAnnualInstructions'
    | 'taxBracketWording'
  >;
  summary: string;
  boundary: string;
  nextStep: string;
};

export type OptimizerContinuationContract = {
  status: 'featureCompleteBeta' | 'publicReadinessBlocked';
  betaReadySurfaces: Array<
    | 'boundedCandidateSearch'
    | 'runtimeAnnualDraftRows'
    | 'betaSavedSequencingAdapter'
    | 'testerOnlyDetailsSurface'
  >;
  blockedPublicOutputs: Array<
    | 'savedPlanSchemaChanges'
    | 'engineOutputSchemaChanges'
    | 'planJsonSequencingOutput'
    | 'csvSequencingOutput'
    | 'reportSequencingOutput'
    | 'productionUi'
    | 'finalAnnualInstructions'
    | 'taxBracketWording'
    | 'realDataTesterDistribution'
  >;
  nextPackages: Array<{
    id: 'contractConsolidation' | 'schemaDecision' | 'exportReportGate' | 'publicSafetyValidation';
    label: string;
    purpose: string;
    status: 'current' | 'next' | 'later';
  }>;
  verificationPlan: {
    focusedCommands: string[];
    fullSuiteStatus: 'useFocusedUntilHangResolved';
    storageNote: string;
  };
  summary: string;
  boundary: string;
};

export type OptimizerSchemaSaveDecision = {
  status: 'runtimeOnly' | 'blocked';
  decision: 'doNotSaveBetaSequencingYet';
  reason: string;
  allowedSavedKeys: [];
  forbiddenSavedKeys: Array<
    | 'capacityObjective'
    | 'capacityReportReadiness'
    | 'capacityExportGuard'
    | 'annualSequencingPrepContract'
    | 'annualSequencingInputAdapter'
    | 'experimentalAccountOrderDraft'
    | 'experimentalAnnualInstructionDraft'
    | 'betaSavedSequencingAdapter'
    | 'continuationContract'
    | 'schemaSaveDecision'
    | 'csvReportGate'
    | 'publicSafetyValidation'
    | 'boundedOptimizer'
    | 'optimizerOutput'
    | 'annualAccountInstructions'
    | 'annualSequencingOutput'
    | 'finalAnnualInstructions'
    | 'taxBracketTargets'
  >;
  blockedOutputs: Array<
    | 'savedPlanSchemaChanges'
    | 'engineOutputSchemaChanges'
    | 'planJsonSequencingOutput'
    | 'csvSequencingOutput'
    | 'reportSequencingOutput'
    | 'productionUi'
    | 'finalAnnualInstructions'
    | 'taxBracketWording'
  >;
  localFirstRule: string;
  privacyRule: string;
  summary: string;
  boundary: string;
  nextStep: string;
};

export type OptimizerCsvReportGate = {
  status: 'readyForGateReview' | 'blocked';
  decision: 'keepCsvAndReportSequencingBlocked';
  sourceAdapterStatus: OptimizerBetaSavedSequencingAdapter['status'];
  sourceSaveDecisionStatus: OptimizerSchemaSaveDecision['status'];
  requiredEvidence: Array<{
    id:
      | 'savedBoundaryVerified'
      | 'rowEvidenceReady'
      | 'csvColumnContract'
      | 'reportRowContract'
      | 'wordingSafety'
      | 'publicScenarioCoverage';
    label: string;
    status: 'ready' | 'blocked';
    detail: string;
  }>;
  allowedFutureFields: OptimizerBetaSavedSequencingAdapter['allowedFields'];
  excludedFields: Array<
    | 'finalInstruction'
    | 'taxBracketTarget'
    | 'taxBracketWording'
    | 'productionUiAction'
    | 'savedPlanField'
    | 'adviceLikeCommand'
  >;
  blockedOutputs: Array<
    | 'csvSequencingOutput'
    | 'reportSequencingOutput'
    | 'finalAnnualInstructions'
    | 'taxBracketWording'
    | 'productionUi'
    | 'savedPlanSchemaChanges'
    | 'engineOutputSchemaChanges'
    | 'planJsonSequencingOutput'
  >;
  summary: string;
  boundary: string;
  nextStep: string;
};

export type OptimizerPublicSafetyValidation = {
  status: 'notPublicReady' | 'blocked';
  decision: 'keepPublicOptimizerClosed';
  sourceCsvReportGateStatus: OptimizerCsvReportGate['status'];
  safetyRows: Array<{
    id:
      | 'reviewOnlyWording'
      | 'stopConditions'
      | 'unsupportedCaseHandling'
      | 'scenarioCoverage'
      | 'realDataTesterDistribution'
      | 'publicReleaseControls';
    label: string;
    status: 'ready' | 'blocked';
    detail: string;
  }>;
  stopConditions: Array<
    | 'missingTaxContext'
    | 'missingConstraintContext'
    | 'ambiguousAccountEvidence'
    | 'unsupportedHouseholdShape'
    | 'testerMistakesReviewForInstruction'
    | 'exportOrReportExpectation'
  >;
  blockedOutputs: Array<
    | 'publicOptimizerRelease'
    | 'realDataTesterDistribution'
    | 'productionUi'
    | 'csvSequencingOutput'
    | 'reportSequencingOutput'
    | 'finalAnnualInstructions'
    | 'taxBracketWording'
    | 'savedPlanSchemaChanges'
    | 'engineOutputSchemaChanges'
    | 'planJsonSequencingOutput'
  >;
  summary: string;
  boundary: string;
  nextStep: string;
};

export type OptimizerExperimentalDraftExampleMatrixItem = {
  id: string;
  label: string;
  status: OptimizerExperimentalDraftReadinessSummary['status'];
  confidenceLevel: OptimizerExperimentalDraftConfidenceLevel;
  draftRows: number;
  modelledYears: number;
  blockerCount: number;
  watchCount: number;
  reviewItems: string[];
};

export type OptimizerSyntheticTesterPacketReadinessMatrix = {
  status: 'readyForLimitedTesterReview' | 'reviewFirst' | 'blocked';
  exampleCount: number;
  readyExampleIds: string[];
  reviewExampleIds: string[];
  blockedExampleIds: string[];
  rows: Array<{
    id: 'draftReadiness' | 'packetBoundary' | 'exportGuard' | 'testerPurpose' | 'outputBoundary';
    label: string;
    status: 'pass' | 'watch' | 'block';
    detail: string;
  }>;
  releaseScope: {
    visibleSections: Array<'candidateDisplayRows' | 'qualityLabels' | 'repairThemes' | 'runtimeBoundary'>;
    hiddenOutputs: Array<'savedSequencingOutput' | 'csvSequencingOutput' | 'reportOutput' | 'productionUi' | 'taxBracketInstructions' | 'finalAnnualInstructions'>;
  };
  packetContract: {
    status: 'readyForContractReview' | 'reviewFirst' | 'blocked';
    allowedFields: Array<
      | 'exampleId'
      | 'exampleLabel'
      | 'candidateDisplayRows'
      | 'qualityLabels'
      | 'repairThemes'
      | 'runtimeBoundary'
      | 'reviewPrompts'
      | 'readinessStatus'
    >;
    excludedFields: Array<
      | 'savedSequencingOutput'
      | 'csvSequencingOutput'
      | 'reportOutput'
      | 'productionUi'
      | 'taxBracketInstructions'
      | 'finalAnnualInstructions'
      | 'personalData'
      | 'savedPlanSchema'
    >;
    reviewPrompts: Array<{
      id: 'clarity' | 'plausibility' | 'missingContext' | 'boundary';
      prompt: string;
    }>;
    rows: Array<{
      id: 'allowedFields' | 'excludedFields' | 'copyBoundary' | 'implementationBoundary';
      label: string;
      status: 'pass' | 'watch' | 'block';
      detail: string;
    }>;
    summary: string;
    boundary: string;
  };
  dryRunPayload: {
    status: 'readyForDryRunReview' | 'reviewFirst' | 'blocked';
    items: Array<{
      exampleId: string;
      exampleLabel: string;
      readinessStatus: OptimizerExperimentalDraftReadinessSummary['status'];
      candidateDisplayRows: OptimizerExperimentalAnnualCandidatePresentationReadiness['displayRows'];
      reviewPromptIds: Array<'clarity' | 'plausibility' | 'missingContext' | 'boundary'>;
      runtimeBoundary: string;
    }>;
    qualityGate: {
      status: 'readyForSurfacePlanning' | 'reviewFirst' | 'blocked';
      score: number;
      rows: Array<{
        id: 'rowCoverage' | 'promptCoverage' | 'boundaryClarity' | 'readinessMix' | 'outputBoundary';
        label: string;
        status: 'pass' | 'watch' | 'block';
        detail: string;
      }>;
      repairExampleIds: string[];
      summary: string;
      boundary: string;
      nextStep: string;
    };
    surfacePlanningGate: {
      status: 'readyForSurfacePlan' | 'reviewFirst' | 'blocked';
      surfaceScope: Array<'exampleList' | 'candidateRows' | 'qualityRows' | 'reviewPrompts' | 'runtimeBoundary'>;
      disabledActions: Array<'saveSequencing' | 'exportCsv' | 'printReport' | 'useInProduction' | 'finalizeInstructions' | 'taxBracketInstructions'>;
      reviewCopy: {
        headline: string;
        purpose: string;
        boundary: string;
      };
      copyAndActionBoundary: {
        status: 'readyForCopyReview' | 'reviewFirst' | 'blocked';
        surfaceLabels: Array<{
          id: 'exampleList' | 'candidateRows' | 'qualityRows' | 'reviewPrompts' | 'runtimeBoundary';
          label: string;
        }>;
        disabledActionLabels: Array<{
          id: 'saveSequencing' | 'exportCsv' | 'printReport' | 'useInProduction' | 'finalizeInstructions' | 'taxBracketInstructions';
          label: string;
          reason: string;
        }>;
        rows: Array<{
          id: 'surfaceLabels' | 'disabledActionLabels' | 'reviewOnlyCopy' | 'nonAdvisoryBoundary';
          label: string;
          status: 'pass' | 'watch' | 'block';
          detail: string;
        }>;
        summary: string;
        boundary: string;
      };
      implementationDecisionGate: {
        status: 'readyForTinyTesterSurface' | 'reviewFirst' | 'blocked';
        decision: 'planTinyTesterSurface' | 'reviewFirst' | 'doNotImplementYet';
        allowedImplementationScope: Array<'testerOnlyRoute' | 'runtimePayloadReader' | 'readOnlyCandidateRows' | 'reviewPrompts' | 'disabledActionButtons' | 'boundaryCopy'>;
        blockedImplementationScope: Array<'savedSequencingOutput' | 'csvSequencingOutput' | 'reportOutput' | 'productionUiPromotion' | 'finalAnnualInstructions' | 'taxBracketInstructions' | 'savedSchemaChanges'>;
        rows: Array<{
          id: 'qualityReady' | 'copyReady' | 'actionsDisabled' | 'scopeLimited' | 'implementationBoundary';
          label: string;
          status: 'pass' | 'watch' | 'block';
          detail: string;
        }>;
        summary: string;
        boundary: string;
        nextStep: string;
      };
      preflightChecklist: {
        status: 'readyForImplementationPackage' | 'reviewFirst' | 'blocked';
        rows: Array<{
          id: 'route' | 'dataSource' | 'readOnlyRendering' | 'disabledActions' | 'copyPlacement' | 'verification';
          label: string;
          status: 'pass' | 'watch' | 'block';
          detail: string;
        }>;
        route: {
          path: '/tester/annual-candidates';
          audience: 'syntheticTesterOnly';
        };
        dataSource: 'runtimeDryRunPayloadOnly';
        verificationSteps: Array<'payloadItemsRender' | 'disabledActionsRender' | 'copyBoundaryVisible' | 'noSavedOutput' | 'noCsvOutput' | 'noReportOutput'>;
        summary: string;
        boundary: string;
        nextStep: string;
      };
      implementationApprovalGate: {
        status: 'approvedForNextPackage' | 'reviewFirst' | 'notApproved';
        approval: 'approveTinyTesterSurface' | 'reviewBeforeApproval' | 'holdImplementation';
        requiredConditions: Array<'preflightReady' | 'runtimeOnlyData' | 'readOnlySurface' | 'disabledOutputActions' | 'copyBoundaryVisible' | 'verificationPlanned'>;
        blockedOutputs: Array<'savedSequencingOutput' | 'csvSequencingOutput' | 'reportOutput' | 'productionUiPromotion' | 'finalAnnualInstructions' | 'taxBracketInstructions' | 'savedSchemaChanges'>;
        rows: Array<{
          id: 'preflightReady' | 'testerValue' | 'implementationScope' | 'blockedOutputs' | 'approvalBoundary';
          label: string;
          status: 'pass' | 'watch' | 'block';
          detail: string;
        }>;
        summary: string;
        boundary: string;
        nextStep: string;
      };
      rows: Array<{
        id: 'qualityGate' | 'surfaceScope' | 'disabledActions' | 'reviewCopy' | 'implementationBoundary';
        label: string;
        status: 'pass' | 'watch' | 'block';
        detail: string;
      }>;
      summary: string;
      boundary: string;
      nextStep: string;
    };
    rows: Array<{
      id: 'payloadItems' | 'contractFields' | 'reviewMetadata' | 'outputBoundary';
      label: string;
      status: 'pass' | 'watch' | 'block';
      detail: string;
    }>;
    summary: string;
    boundary: string;
  };
  summary: string;
  boundary: string;
  nextStep: string;
};

export type OptimizerExperimentalDraftExampleMatrix = {
  status: 'readyForTesterReview' | 'reviewFirst' | 'blocked';
  exampleCount: number;
  readyCount: number;
  reviewFirstCount: number;
  blockedCount: number;
  items: OptimizerExperimentalDraftExampleMatrixItem[];
  repairTargets: Array<{
    id: 'rowCoverage' | 'blockers' | 'watchItems' | 'taxContext' | 'confidence';
    label: string;
    status: 'pass' | 'repair';
    exampleIds: string[];
    detail: string;
    repairAction: string;
  }>;
  testerPacketReadiness: OptimizerSyntheticTesterPacketReadinessMatrix;
  summary: string;
  boundary: string;
  nextStep: string;
};

export type OptimizerGoalReview = {
  summary: string;
  architecture: {
    headline: string;
    rows: Array<{
      id: 'sameCandidateSet' | 'rerankOnly' | 'normalUiHidden' | 'sequencingDeferred';
      label: string;
      status: 'ready' | 'deferred';
      detail: string;
    }>;
    boundary: string;
  };
  rows: Array<{
    id: 'maxSpend' | 'maxEstate' | 'minTax' | 'spendingFlexibility';
    label: string;
    status: 'current' | 'deferred';
    detail: string;
  }>;
  goalModePreview: {
    headline: string;
    rows: Array<{
      id: 'maxSpend' | 'maxEstate' | 'minTax';
      label: string;
      status: 'current' | 'deferred';
      topCandidateId: BoundedOptimizerCandidateId | null;
      topCandidateLabel: string;
      basis: string;
      detail: string;
    }>;
    boundary: string;
  };
  spendingFlexibilityReview: {
    headline: string;
    detail: string;
    questions: string[];
    worksheet: Array<{
      id: 'rangeClarity' | 'bufferClarity' | 'screenFocus' | 'decision';
      label: string;
      prompt: string;
      passSignal: string;
    }>;
    outcomeReview: {
      headline: string;
      rows: Array<{
        id: 'rangeHelpful' | 'rangeDistracting' | 'rangeUnclear';
        label: string;
        status: 'canTest' | 'hold' | 'simplify';
        detail: string;
        nextStep: string;
      }>;
      boundary: string;
    };
    cashWedgeBoundary: {
      headline: string;
      rows: Array<{
        id: 'buffer' | 'notRefillRule' | 'notWithdrawalOrder' | 'taxEvidence';
        label: string;
        detail: string;
      }>;
      boundary: string;
    };
    rows: Array<{
      id: 'variableSpending' | 'cashWedge' | 'taxImpact' | 'implementationBoundary';
      label: string;
      status: 'review' | 'deferred';
      detail: string;
    }>;
    boundary: string;
  };
  boundary: string;
};

export type OptimizerFeedbackPackageIndex = {
  headline: string;
  rows: Array<{
    id: 'withdrawalFamilyFeedback' | 'goalModes' | 'spendingFlexibility' | 'annualSequencing';
    label: string;
    status: 'ready' | 'review' | 'deferred' | 'blocked';
    detail: string;
  }>;
  annualSequencingReadiness: {
    headline: string;
    status: 'notReady' | 'maybeLater';
    rows: Array<{
      id: 'userClarity' | 'performance' | 'explainability' | 'provinceEdgeCases' | 'feedbackDepth';
      label: string;
      status: 'ready' | 'review' | 'blocked';
      detail: string;
    }>;
    architectureQuestions: Array<{
      id: 'funding' | 'estate' | 'taxOas' | 'cashFlexibility';
      label: string;
      question: string;
      evidenceSource: string;
      boundary: string;
    }>;
    performanceBudget: {
      headline: string;
      rows: Array<{
        id: 'candidateLimit' | 'fullSuiteCost' | 'routeProbeCaveat' | 'deviceRisk';
        label: string;
        status: 'ready' | 'review' | 'blocked';
        detail: string;
      }>;
      boundary: string;
    };
    explainabilityGuide: {
      headline: string;
      rows: Array<{
        id: 'familyReason' | 'evidencePriority' | 'tradeoffLanguage' | 'instructionBoundary';
        label: string;
        status: 'review' | 'blocked';
        detail: string;
        passSignal: string;
      }>;
      boundary: string;
    };
    scopeRegister: {
      headline: string;
      rows: Array<{
        id: 'ontarioOnly' | 'lockedInAccounts' | 'survivorSetup' | 'lowIncomeBenefits' | 'edgeCaseDecision';
        label: string;
        status: 'ready' | 'review' | 'blocked';
        detail: string;
      }>;
      boundary: string;
    };
    feedbackDepthPlan: {
      headline: string;
      rows: Array<{
        id: 'dbPensionCouple' | 'earlyRetiredCouple' | 'alreadyRetiredCouple' | 'confusionSignals' | 'decisionThreshold';
        label: string;
        status: 'review' | 'blocked';
        detail: string;
      }>;
      boundary: string;
    };
    architectureConstraints: {
      headline: string;
      rows: Array<{
        id: 'nonGoals' | 'candidateExplosion' | 'schemaBoundary' | 'uiBoundary' | 'rollbackBoundary';
        label: string;
        status: 'ready' | 'blocked';
        detail: string;
      }>;
      boundary: string;
    };
    prototypeDecisionRegister: {
      headline: string;
      status: 'defer' | 'internal-test-only-candidate' | 'blocked';
      rows: Array<{
        id: 'feedbackDepth' | 'explainability' | 'performance' | 'scope' | 'schema' | 'ui' | 'rollback';
        label: string;
        status: 'ready' | 'review' | 'blocked';
        detail: string;
      }>;
      nextStep: string;
      boundary: string;
    };
    rollbackContainmentPlan: {
      headline: string;
      rows: Array<{
        id: 'oneCommitRemoval' | 'internalBoundaryName' | 'persistenceAudit' | 'uiContainment' | 'verificationBeforeMerge';
        label: string;
        status: 'ready' | 'review' | 'blocked';
        detail: string;
      }>;
      boundary: string;
    };
    testOnlyShapePlan: {
      headline: string;
      rows: Array<{
        id: 'existingAnnualRows' | 'accountBuckets' | 'allowedDiagnostics' | 'disallowedOutputs' | 'planningOnly';
        label: string;
        status: 'review' | 'blocked';
        detail: string;
      }>;
      boundary: string;
    };
    prototypeReadinessSummary: {
      headline: string;
      status: 'stillBlocked' | 'maybeInternalLater';
      rows: Array<{
        id: 'feedback' | 'scope' | 'performance' | 'schemaUi' | 'rollback';
        label: string;
        status: 'ready' | 'review' | 'blocked';
        detail: string;
      }>;
      decision: string;
      boundary: string;
    };
    blockerClearanceEvidence: {
      headline: string;
      rows: Array<{
        id: 'feedbackArtifacts' | 'explainabilityPlayback' | 'performanceMeasurement' | 'scopeDecisionLog' | 'schemaUiDiff' | 'rollbackRehearsal';
        label: string;
        status: 'needed' | 'blocked';
        detail: string;
        clearanceSignal: string;
      }>;
      boundary: string;
    };
    feedbackArtifactTemplate: {
      headline: string;
      rows: Array<{
        id: 'rememberedAnswer' | 'evidenceRanking' | 'instructionBoundary' | 'cashFlexibilityLanguage' | 'decisionOutcome';
        label: string;
        prompt: string;
        passSignal: string;
        blockedSignal: string;
      }>;
      boundary: string;
    };
    feedbackCloseoutRubric: {
      headline: string;
      rows: Array<{
        id: 'pass' | 'watch' | 'blocked' | 'defer' | 'repeat';
        label: string;
        status: 'ready' | 'review' | 'blocked';
        detail: string;
        nextStep: string;
      }>;
      boundary: string;
    };
    feedbackDecisionLedger: {
      headline: string;
      rows: Array<{
        id: 'collectMore' | 'cleanCopy' | 'cleanInputs' | 'holdSequencing' | 'reassessLater';
        label: string;
        status: 'review' | 'blocked';
        detail: string;
        evidenceNeeded: string;
      }>;
      boundary: string;
    };
    feedbackCoverageMatrix: {
      headline: string;
      rows: Array<{
        id: 'dbPensionCouple' | 'bridgeYears' | 'alreadyRetired' | 'survivorCase' | 'lowIncomeBoundary';
        label: string;
        status: 'review' | 'blocked';
        detail: string;
        missingEvidence: string;
      }>;
      boundary: string;
    };
    evidenceQualityChecklist: {
      headline: string;
      rows: Array<{
        id: 'specificQuote' | 'scenarioContext' | 'evidenceOrder' | 'confusionSignal' | 'nonPersistence';
        label: string;
        status: 'review' | 'blocked';
        detail: string;
        guardrail: string;
      }>;
      boundary: string;
    };
    prototypeDecisionPacket: {
      headline: string;
      rows: Array<{
        id: 'feedbackSummary' | 'scopeSummary' | 'performanceSummary' | 'schemaUiSummary' | 'rollbackSummary';
        label: string;
        status: 'review' | 'blocked';
        detail: string;
        requiredBeforeAsk: string;
      }>;
      boundary: string;
    };
    readinessRunway: {
      headline: string;
      status: 'defer' | 'askLater';
      rows: Array<{
        id: 'keepDeferring' | 'nextEvidence' | 'nextCleanup' | 'nextPerformance' | 'explicitDecisionLater';
        label: string;
        status: 'review' | 'blocked';
        detail: string;
      }>;
      recommendation: string;
      boundary: string;
    };
    readinessSectionIndex: {
      headline: string;
      rows: Array<{
        id: 'baseReadiness' | 'feedbackEvidence' | 'evidenceQuality' | 'decisionBoundary' | 'prototypeGate';
        label: string;
        group: 'evidence' | 'quality' | 'decision' | 'prototypeGate';
        detail: string;
      }>;
      boundary: string;
    };
    copyTighteningGuard: {
      headline: string;
      rows: Array<{
        id: 'preferredTerms' | 'blockedTerms' | 'deferFirst' | 'consumerTone';
        label: string;
        status: 'review' | 'blocked';
        detail: string;
      }>;
      boundary: string;
    };
    feedbackExamplePointers: {
      headline: string;
      rows: Array<{
        id: 'dbPensionExample' | 'bridgeYearExample' | 'alreadyRetiredExample' | 'staticOnly' | 'noPersistence';
        label: string;
        status: 'review' | 'blocked';
        detail: string;
      }>;
      boundary: string;
    };
    deferralReassessment: {
      headline: string;
      status: 'stillDeferred' | 'considerDecisionPacketLater';
      rows: Array<{
        id: 'coverage' | 'quality' | 'scope' | 'performance' | 'schemaUiRollback';
        label: string;
        status: 'review' | 'blocked';
        detail: string;
      }>;
      recommendation: string;
      boundary: string;
    };
    readinessMaintenancePlan: {
      headline: string;
      rows: Array<{
        id: 'sectionLimit' | 'mergeCandidates' | 'staleDocs' | 'testCoverage' | 'checkpointOnly';
        label: string;
        status: 'review' | 'blocked';
        detail: string;
      }>;
      boundary: string;
    };
    feedbackReviewScript: {
      headline: string;
      rows: Array<{
        id: 'overviewRead' | 'detailsOpen' | 'evidencePlayback' | 'boundaryCheck' | 'closeoutChoice';
        label: string;
        status: 'review' | 'blocked';
        prompt: string;
      }>;
      boundary: string;
    };
    performancePlanningQuestions: {
      headline: string;
      rows: Array<{
        id: 'deviceTarget' | 'candidateCap' | 'timeoutRule' | 'noWorkerYet' | 'probeImpact';
        label: string;
        status: 'review' | 'blocked';
        question: string;
      }>;
      boundary: string;
    };
    conservativePostureCheckpoint: {
      headline: string;
      status: 'continueDeferral' | 'pauseForDecision';
      rows: Array<{
        id: 'doNext' | 'doNotDo' | 'decisionTrigger' | 'rollbackPosture' | 'chatContinuity';
        label: string;
        status: 'review' | 'blocked';
        detail: string;
      }>;
      recommendation: string;
      boundary: string;
    };
    readinessConsolidationSummary: {
      headline: string;
      rows: Array<{
        id: 'summaryFirst' | 'groupBeforeAdding' | 'supersedeDocs' | 'detailsOnly' | 'noPrototype';
        label: string;
        status: 'review' | 'blocked';
        detail: string;
      }>;
      boundary: string;
    };
    uiRedesignReadinessBridge: {
      headline: string;
      rows: Array<{
        id: 'briefReference' | 'answerFirst' | 'localFirstTrust' | 'progressiveDisclosure' | 'notYet';
        label: string;
        status: 'review' | 'blocked';
        detail: string;
      }>;
      boundary: string;
    };
    checkpointArchivePolicy: {
      headline: string;
      rows: Array<{
        id: 'currentPosture' | 'supersededDocs' | 'decisionDocs' | 'verificationNotes' | 'noDeletion';
        label: string;
        status: 'review' | 'blocked';
        detail: string;
      }>;
      boundary: string;
    };
    consolidationCheckpoint: {
      headline: string;
      status: 'continueConsolidation' | 'readyForUiOverhaul';
      rows: Array<{
        id: 'panelHygiene' | 'feedbackReadiness' | 'performanceBoundary' | 'uiRedesignTiming' | 'nextPackage';
        label: string;
        status: 'review' | 'blocked';
        detail: string;
      }>;
      recommendation: string;
      boundary: string;
    };
    manualWorksheetPacket: {
      headline: string;
      rows: Array<{
        id: 'printablePrompts' | 'anonymizeOutsideApp' | 'noInAppCapture' | 'reviewStorage' | 'closeoutSummary';
        label: string;
        status: 'review' | 'blocked';
        detail: string;
      }>;
      boundary: string;
    };
    staticWorksheetExamples: {
      headline: string;
      rows: Array<{
        id: 'dbCompleted' | 'bridgeCompleted' | 'retiredCompleted' | 'notEvidence' | 'notSaved';
        label: string;
        status: 'review' | 'blocked';
        detail: string;
      }>;
      boundary: string;
    };
    manualScoringRubric: {
      headline: string;
      rows: Array<{
        id: 'clear' | 'watch' | 'blocked' | 'repeat' | 'noScoreInApp';
        label: string;
        status: 'review' | 'blocked';
        detail: string;
      }>;
      boundary: string;
    };
    manualFeedbackPrepCheckpoint: {
      headline: string;
      status: 'readyToRunOutsideApp' | 'notReady';
      rows: Array<{
        id: 'worksheetReady' | 'examplesReady' | 'scoringReady' | 'appBoundary' | 'nextDecision';
        label: string;
        status: 'review' | 'blocked';
        detail: string;
      }>;
      recommendation: string;
      boundary: string;
    };
    feedbackResultsPlaceholder: {
      headline: string;
      status: 'noRealFeedbackYet' | 'readyToSummarize';
      rows: Array<{
        id: 'noRealResults' | 'acceptedSources' | 'summaryShape' | 'doNotInfer' | 'holdDecisions';
        label: string;
        status: 'review' | 'blocked';
        detail: string;
      }>;
      boundary: string;
    };
    feedbackCopyCleanupTargets: {
      headline: string;
      rows: Array<{
        id: 'cashWedge' | 'taxOas' | 'recommendedPlan' | 'accountOrder' | 'noCleanupWithoutFeedback';
        label: string;
        status: 'review' | 'blocked';
        detail: string;
      }>;
      boundary: string;
    };
    feedbackEvidencePosture: {
      headline: string;
      status: 'waitingForRealFeedback' | 'readyForCleanup';
      rows: Array<{
        id: 'prepared' | 'missing' | 'blockedDecision' | 'cleanupPosture' | 'nextAction';
        label: string;
        status: 'review' | 'blocked';
        detail: string;
      }>;
      recommendation: string;
      boundary: string;
    };
    feedbackResultsCheckpoint: {
      headline: string;
      status: 'stillWaiting' | 'readyToReviewResults';
      rows: Array<{
        id: 'results' | 'cleanup' | 'sequencing' | 'uiOverhaul' | 'nextPackage';
        label: string;
        status: 'review' | 'blocked';
        detail: string;
      }>;
      recommendation: string;
      boundary: string;
    };
    readinessSlimmingPlan: {
      headline: string;
      rows: Array<{
        id: 'summaryFirst' | 'mergeOverlaps' | 'docSupersession' | 'detailsOnly' | 'stopCondition';
        label: string;
        status: 'review' | 'blocked';
        detail: string;
      }>;
      boundary: string;
    };
    readinessHandoffCheckpoint: {
      headline: string;
      status: 'pauseExpansion' | 'readyForNextDecision';
      rows: Array<{
        id: 'outsideFeedback' | 'panelSlimming' | 'performanceBudget' | 'prototypeDecision' | 'uiOverhaul';
        label: string;
        status: 'review' | 'blocked';
        detail: string;
      }>;
      recommendation: string;
      boundary: string;
    };
    nextStep: string;
    boundary: string;
  };
  nextCheckpoint: string;
  boundary: string;
};

export type WithdrawalFeedbackReviewRow = {
  id: 'familyPresence' | 'evidenceClarity' | 'annualInstructionBoundary' | 'guardrails' | 'savedOutputBoundary';
  label: string;
  status: 'ready' | 'review' | 'blocked';
  detail: string;
};

export type WithdrawalFeedbackReview = {
  status: 'readyForFeedback' | 'needsInputReview' | 'holdForCleanup';
  headline: string;
  detail: string;
  rows: WithdrawalFeedbackReviewRow[];
  questions: string[];
  confusionSignals: string[];
  worksheet: Array<{
    id: 'understanding' | 'evidence' | 'boundary' | 'decision';
    label: string;
    prompt: string;
    passSignal: string;
  }>;
  decision: {
    status: 'collectFeedback' | 'cleanUpInputs' | 'holdAnnualSequencing';
    label: string;
    detail: string;
    requiredEvidence: string[];
  };
  outcome: {
    status: 'readyToReview' | 'simplifyEvidence' | 'repairInputs' | 'deferSequencing';
    label: string;
    detail: string;
    nextSteps: string[];
  };
  closeoutSummary: {
    status: 'readyToClose' | 'inputCleanupFirst' | 'holdAndSimplify';
    label: string;
    detail: string;
    evidenceSummary: string;
    boundarySummary: string;
    nextReview: string;
  };
  nextDecision: string;
};

export type OptimizerReadinessRow = {
  id:
    | 'spending'
    | 'benefitEstimates'
    | 'benefitAgeRange'
    | 'accountBuckets'
    | 'estateTarget'
    | 'homeSale'
    | 'survivor'
    | 'taxScope';
  label: string;
  status: 'ready' | 'review' | 'blocked';
  detail: string;
};

export type OptimizerCandidateFamily = {
  id: 'benefitTimingGrid' | 'broadWithdrawalFamilies' | 'annualOverrides' | 'monteCarloValidation';
  label: string;
  status: 'included' | 'deferred' | 'blocked';
  detail: string;
};

export type OptimizerObjectiveContract = {
  primaryObjective: 'maximizeSustainableAfterTaxSpend';
  outputTone: 'planToReview';
  riskGuardrail: 'conservativeDeterministicFunding';
  monteCarloRole: 'validationLater';
  savedOutput: 'none';
  detail: string;
};

export type OptimizerBenefitSearchSpace = {
  person: 'p1' | 'p2';
  label: string;
  cppAges: number[];
  oasAges: number[];
  status: 'ready' | 'blocked';
  reason: string;
};

export type OptimizerWithdrawalFamily = {
  id: 'currentOrder' | 'default' | 'registeredFirst' | 'nonRegisteredFirst';
  label: string;
  status: 'included' | 'current' | 'blocked';
  detail: string;
};

export type OptimizerSearchPlan = {
  strategy: 'stagedGrid';
  jointCoupleSearch: boolean;
  benefitSearch: OptimizerBenefitSearchSpace[];
  withdrawalFamilies: OptimizerWithdrawalFamily[];
  annualOverrides: 'deferred';
  detail: string;
};

export type BoundedOptimizerSummary = {
  status: 'blocked' | 'ready';
  execution: 'boundedSearch';
  contract: OptimizerContract;
  objective: OptimizerObjectiveContract;
  readinessRows: OptimizerReadinessRow[];
  candidateFamilies: OptimizerCandidateFamily[];
  searchPlan: OptimizerSearchPlan;
  capacityObjective: OptimizerCapacityObjective;
  capacityReportReadiness: OptimizerCapacityReportReadiness;
  capacityExportGuard: OptimizerCapacityExportGuard;
  annualSequencingPrepContract: OptimizerAnnualSequencingPrepContract;
  annualSequencingInputAdapter: OptimizerAnnualSequencingInputAdapter;
  experimentalAccountOrderDraft: OptimizerExperimentalAccountOrderDraft;
  experimentalAnnualInstructionDraft: OptimizerExperimentalAnnualInstructionDraft;
  betaSavedSequencingAdapter: OptimizerBetaSavedSequencingAdapter;
  continuationContract: OptimizerContinuationContract;
  schemaSaveDecision: OptimizerSchemaSaveDecision;
  csvReportGate: OptimizerCsvReportGate;
  publicSafetyValidation: OptimizerPublicSafetyValidation;
  testerSurfaceMatrix: OptimizerExperimentalDraftExampleMatrix;
  headline: string;
  detail: string;
  suggestedCandidateId: BoundedOptimizerCandidateId | null;
  suggestedLabel: string;
  candidateCount: number;
  candidates: BoundedOptimizerCandidateRow[];
  eligibilityNotes: BoundedOptimizerEligibilityNote[];
  guardrailNotes: BoundedOptimizerGuardrailNote[];
  recommendationNotes: BoundedOptimizerRecommendationNote[];
  optionGroups: BoundedOptimizerOptionGroup[];
  evidenceRows: BoundedOptimizerEvidenceRow[];
  driverRows: BoundedOptimizerDriverRow[];
  compactEvidenceRows: BoundedOptimizerCompactEvidenceRow[];
  goalReview: OptimizerGoalReview;
  feedbackPackageIndex: OptimizerFeedbackPackageIndex;
  withdrawalFeedbackReview: WithdrawalFeedbackReview;
  explanation: BoundedOptimizerExplanation;
  reviewNotes: string[];
};

export type BoundedOptimizerRunner = (plan: V2PlanPayload, config: SimulationConfig) => SimulationResult;

const WITHDRAWAL_ORDERS: Array<{ id: BoundedOptimizerCandidateId; value: string; label: string }> = [
  { id: 'withdrawalDefault', value: 'default', label: 'Default withdrawal order' },
  { id: 'withdrawalRegisteredFirst', value: 'registered-first', label: 'Registered accounts first' },
  { id: 'withdrawalNonRegisteredFirst', value: 'nonreg-first', label: 'Non-registered accounts first' }
];

const BOUNDED_OPTIMIZER_CANDIDATE_LIMIT = 20;
const WITHDRAWAL_BUCKET_MINIMUM = 25_000;
const BENEFIT_GRID_CPP_AGES = [60, 65, 67, 70] as const;
const BENEFIT_GRID_OAS_AGES = [65, 67, 70] as const;

function n(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function consumerWithdrawalOrder(value: string | undefined): string {
  return value === 'meltdown' ? 'default' : value || 'default';
}

function baseConfig(plan: V2PlanPayload): SimulationConfig {
  return {
    cppAgeF: 65,
    cppAgeM: 65,
    oasAgeF: 65,
    oasAgeM: 65,
    meltdown: false,
    returnRate: 0.05,
    pensionSplit: shouldIncludeBaselinePensionSplitting(plan),
    p1Dies: null,
    withdrawalOrder: consumerWithdrawalOrder(plan.assumptions.withdrawalOrder)
  };
}

function leverPermission(contract: OptimizerContract, id: OptimizerLeverId): string {
  return contract.levers.find((lever) => lever.id === id)?.permission || 'needsDecision';
}

function canExplore(contract: OptimizerContract, id: OptimizerLeverId): boolean {
  return leverPermission(contract, id) === 'canExplore';
}

function personAgeInYear(person: { dob?: number }, year: number): number | null {
  const birthYear = n(person.dob);
  return birthYear > 0 && year > 0 ? year - birthYear : null;
}

function projectionStartYear(plan: V2PlanPayload): number {
  const p2RetireYear = p2LooksBlank(plan.p2) ? Infinity : n(plan.p2.retireYear);
  return Math.min(
    n(plan.assumptions.planStart) || Infinity,
    n(plan.assumptions.retireYear) || Infinity,
    n(plan.p1.retireYear) || Infinity,
    p2RetireYear || Infinity
  );
}

function projectionEndYear(plan: V2PlanPayload): number {
  return n(plan.assumptions.planEnd) || n(plan.assumptions.horizon) || projectionStartYear(plan);
}

function activePeople(plan: V2PlanPayload): Array<{ key: 'p1' | 'p2'; person: V2PlanPayload['p1'] }> {
  const people: Array<{ key: 'p1' | 'p2'; person: V2PlanPayload['p1'] }> = [{ key: 'p1', person: plan.p1 }];
  if (!p2LooksBlank(plan.p2)) people.push({ key: 'p2', person: plan.p2 });
  return people;
}

function hasCppAndOasEstimate(person: V2PlanPayload['p1']): boolean {
  return (n(person.cpp65_monthly) > 0 || n(person.cpp70_monthly) > 0) && n(person.oas_monthly) > 0;
}

function hasCppEstimate(person: V2PlanPayload['p1']): boolean {
  return n(person.cpp65_monthly) > 0 || n(person.cpp70_monthly) > 0;
}

function personReachesCppStartAge(person: V2PlanPayload['p1'], endYear: number): boolean {
  const birthYear = n(person.dob);
  return birthYear > 0 && endYear >= birthYear + 65;
}

function personCanStillDelayBenefits(person: V2PlanPayload['p1'], startYear: number, endYear: number): boolean {
  const startAge = personAgeInYear(person, startYear);
  const reachesAge70 = n(person.dob) > 0 && endYear >= n(person.dob) + 70;
  return hasCppAndOasEstimate(person) && startAge !== null && startAge < 70 && reachesAge70;
}

function benefitAgeRange(start: number, end: number, minAge: number, maxAge: number): number[] {
  const startAge = Math.max(start, minAge);
  const endAge = Math.min(end, maxAge);
  if (!Number.isFinite(startAge) || !Number.isFinite(endAge) || endAge < startAge) return [];
  return Array.from({ length: endAge - startAge + 1 }, (_item, index) => startAge + index);
}

function personBenefitSearchSpace(
  key: 'p1' | 'p2',
  person: V2PlanPayload['p1'],
  startYear: number,
  endYear: number
): OptimizerBenefitSearchSpace {
  const birthYear = n(person.dob);
  const startAge = personAgeInYear(person, startYear);
  const endAge = birthYear > 0 ? endYear - birthYear : null;
  const cppAges = hasCppEstimate(person) && startAge !== null && endAge !== null ? benefitAgeRange(Math.max(60, startAge), endAge, 60, 70) : [];
  const oasAges = n(person.oas_monthly) > 0 && startAge !== null && endAge !== null ? benefitAgeRange(Math.max(65, startAge), endAge, 65, 70) : [];
  const label = personLabel(key, person);
  const status = cppAges.length > 0 && oasAges.length > 0 ? 'ready' : 'blocked';
  return {
    person: key,
    label,
    cppAges,
    oasAges,
    status,
    reason:
      status === 'ready'
        ? `${label} can be included in a CPP/OAS age grid.`
        : `${label} needs benefit estimates and projection years that include valid CPP/OAS start ages.`
  };
}

function buildReadinessRows(plan: V2PlanPayload, contract: OptimizerContract, eligibilityNotes: BoundedOptimizerEligibilityNote[]): OptimizerReadinessRow[] {
  const startYear = projectionStartYear(plan);
  const endYear = projectionEndYear(plan);
  const people = activePeople(plan);
  const benefitSpaces = people.map(({ key, person }) => personBenefitSearchSpace(key, person, startYear, endYear));
  const estateTarget = n(plan.inheritance);
  const downsizeYear = n(plan.downsize?.year);
  const downsizeProceeds = n(plan.downsize?.netProceeds);
  const hasPartialHomeSale = (downsizeYear > 0 || downsizeProceeds > 0) && !(downsizeYear > 0 && downsizeProceeds > 0);
  const survivorNote = eligibilityNotes.find((note) => note.lever === 'survivor');
  const spendingReady = canExplore(contract, 'spending') && n(plan.spending.gogo) >= 30_000;
  const accountsReady = hasMeaningfulWithdrawalBuckets(plan);
  const benefitEstimateReady = people.every(({ person }) => hasCppAndOasEstimate(person));
  const benefitGridReady = benefitSpaces.every((space) => space.status === 'ready');

  return [
    {
      id: 'spending',
      label: 'Spending assumption',
      status: spendingReady ? 'ready' : 'blocked',
      detail: spendingReady
        ? 'Early, later, and late-life spending can anchor a max after-tax spending review.'
        : 'Add a realistic spending assumption before optimizing for sustainable spending.'
    },
    {
      id: 'benefitEstimates',
      label: 'CPP/OAS estimates',
      status: benefitEstimateReady ? 'ready' : 'blocked',
      detail: benefitEstimateReady
        ? 'CPP and OAS estimates are present for each active person.'
        : 'CPP at 65 and monthly OAS estimates are needed before testing benefit timing.'
    },
    {
      id: 'benefitAgeRange',
      label: 'Benefit age range',
      status: benefitGridReady ? 'ready' : 'review',
      detail: benefitGridReady
        ? 'The projection includes valid CPP/OAS start ages for the staged grid.'
        : 'The grid will be limited until each active person has valid CPP/OAS start ages inside the projection.'
    },
    {
      id: 'accountBuckets',
      label: 'Account buckets',
      status: accountsReady ? 'ready' : 'review',
      detail: accountsReady
        ? 'Registered and TFSA/non-registered buckets are meaningful enough for broad withdrawal-family checks.'
        : 'Broad withdrawal-family checks need meaningful balances in registered and TFSA/non-registered buckets.'
    },
    {
      id: 'estateTarget',
      label: 'Estate target',
      status: estateTarget > 0 ? 'ready' : 'review',
      detail: estateTarget > 0
        ? 'The optimizer must preserve the entered estate target unless the household changes it.'
        : 'No estate target is entered, so spending-room output should mention the estate trade-off.'
    },
    {
      id: 'homeSale',
      label: 'Home-sale assumption',
      status: hasPartialHomeSale ? 'blocked' : downsizeYear > 0 && downsizeProceeds > 0 ? 'ready' : 'review',
      detail: hasPartialHomeSale
        ? 'Home-sale assumptions need both a year and net cash amount before reliance checks are useful.'
        : downsizeYear > 0 && downsizeProceeds > 0
          ? 'Home-sale cash is preserved as an entered household assumption and can be tested only as a reliance check.'
          : 'No home-sale cash is entered; the optimizer must not invent one.'
    },
    {
      id: 'survivor',
      label: 'Survivor setup',
      status: survivorNote ? 'review' : 'ready',
      detail: survivorNote?.reason || 'Survivor setup does not block the first optimizer review for this plan.'
    },
    {
      id: 'taxScope',
      label: 'Tax scope',
      status: 'ready',
      detail: 'The optimizer review uses the same Ontario 2026 tax assumptions as Results.'
    }
  ];
}

function buildCandidateFamilies(readinessRows: OptimizerReadinessRow[]): OptimizerCandidateFamily[] {
  const benefitReady = readinessRows.find((row) => row.id === 'benefitEstimates')?.status === 'ready';
  const ageReady = readinessRows.find((row) => row.id === 'benefitAgeRange')?.status === 'ready';
  const accountReady = readinessRows.find((row) => row.id === 'accountBuckets')?.status === 'ready';
  return [
    {
      id: 'benefitTimingGrid',
      label: 'CPP/OAS timing grid',
      status: benefitReady && ageReady ? 'included' : 'blocked',
      detail: benefitReady && ageReady
        ? 'CPP ages 60-70 and OAS ages 65-70 can be described for a staged grid where eligible.'
        : 'Benefit timing grid waits for benefit estimates and valid age ranges.'
    },
    {
      id: 'broadWithdrawalFamilies',
      label: 'Broad withdrawal families',
      status: accountReady ? 'included' : 'blocked',
      detail: accountReady
        ? 'Current, default, registered-first, and non-registered-first families can be compared at a high level.'
        : 'Broad withdrawal families wait for meaningful registered and flexible account balances.'
    },
    {
      id: 'annualOverrides',
      label: 'Year-by-year withdrawal actions',
      status: 'deferred',
      detail: 'Annual account-level overrides are deferred until broad family search is trusted.'
    },
    {
      id: 'monteCarloValidation',
      label: 'Monte Carlo validation',
      status: 'deferred',
      detail: 'Monte Carlo validates later; it is not inside the first local search loop.'
    }
  ];
}

function buildObjectiveContract(): OptimizerObjectiveContract {
  return {
    primaryObjective: 'maximizeSustainableAfterTaxSpend',
    outputTone: 'planToReview',
    riskGuardrail: 'conservativeDeterministicFunding',
    monteCarloRole: 'validationLater',
    savedOutput: 'none',
    detail: 'Maximize sustainable after-tax spending only after deterministic funding, estate, bridge-year, survivor, and local-output guardrails are respected.'
  };
}

function buildSearchPlan(plan: V2PlanPayload): OptimizerSearchPlan {
  const startYear = projectionStartYear(plan);
  const endYear = projectionEndYear(plan);
  const currentOrder = consumerWithdrawalOrder(plan.assumptions.withdrawalOrder);
  const withdrawalFamilies: OptimizerWithdrawalFamily[] = [
    {
      id: 'currentOrder',
      label: 'Current order',
      status: 'current',
      detail: `Current plan withdrawal order: ${currentOrder}.`
    },
    {
      id: 'default',
      label: 'Default family',
      status: currentOrder === 'default' ? 'current' : 'included',
      detail: 'High-level default withdrawal-order family.'
    },
    {
      id: 'registeredFirst',
      label: 'Registered-first family',
      status: 'included',
      detail: 'Broad family check only; not year-by-year account instructions.'
    },
    {
      id: 'nonRegisteredFirst',
      label: 'Non-registered-first family',
      status: 'included',
      detail: 'Broad family check only; not year-by-year account instructions.'
    }
  ];
  return {
    strategy: 'stagedGrid',
    jointCoupleSearch: !p2LooksBlank(plan.p2),
    benefitSearch: activePeople(plan).map(({ key, person }) => personBenefitSearchSpace(key, person, startYear, endYear)),
    withdrawalFamilies,
    annualOverrides: 'deferred',
    detail: 'The first optimizer path uses a staged grid: benefit timing and broad withdrawal families before any annual override execution.'
  };
}

function buildGoalModePreview(candidates: BoundedOptimizerCandidateRow[]): OptimizerGoalReview['goalModePreview'] {
  const eligible = candidates.filter((candidate) => candidate.status !== 'blocked');
  const bySpend = eligible.slice().sort((a, b) => {
    if (a.sustainableAnnualSpend !== b.sustainableAnnualSpend) return b.sustainableAnnualSpend - a.sustainableAnnualSpend;
    return compareRows(a, b);
  })[0];
  const byEstate = eligible.slice().sort((a, b) => {
    if (a.endPortfolio !== b.endPortfolio) return b.endPortfolio - a.endPortfolio;
    return compareRows(a, b);
  })[0];
  const byTax = eligible.slice().sort((a, b) => {
    if (a.lifetimeTax !== b.lifetimeTax) return a.lifetimeTax - b.lifetimeTax;
    return compareRows(a, b);
  })[0];
  const row = (
    id: 'maxSpend' | 'maxEstate' | 'minTax',
    label: string,
    status: 'current' | 'deferred',
    candidate: BoundedOptimizerCandidateRow | undefined,
    basis: string,
    detail: string
  ) => ({
    id,
    label,
    status,
    topCandidateId: candidate?.id || null,
    topCandidateLabel: candidate?.label || 'No eligible candidate',
    basis,
    detail
  });

  return {
    headline: 'Same candidates, different review lens.',
    rows: [
      row(
        'maxSpend',
        'Max sustainable spend',
        'current',
        bySpend,
        'Ranks by sustainable after-tax spending in today\'s dollars.',
        'This is the current objective and does not add a new control.'
      ),
      row(
        'maxEstate',
        'Max estate',
        'deferred',
        byEstate,
        'Would rank the same candidates by projected money left.',
        'This is a future review lens, not a recommendation or saved preference.'
      ),
      row(
        'minTax',
        'Lower lifetime tax',
        'deferred',
        byTax,
        'Would rank the same candidates by lower lifetime tax.',
        'This is supporting evidence only, not an account instruction.'
      )
    ],
    boundary: 'Goal-mode preview re-ranks existing candidates only; it does not add search paths, toggles, advice, saved output, or annual account sequencing.'
  };
}

function buildOptimizerGoalReview(candidates: BoundedOptimizerCandidateRow[]): OptimizerGoalReview {
  return {
    summary:
      'Future goal modes should re-rank the same bounded candidate set before any wider optimizer search is considered.',
    architecture: {
      headline: 'Goal-mode architecture stays inside the bounded candidate set.',
      rows: [
        {
          id: 'sameCandidateSet',
          label: 'Same candidate set',
          status: 'ready',
          detail: 'Max estate, min tax, and flexibility modes should first reuse the current bounded candidates.'
        },
        {
          id: 'rerankOnly',
          label: 'Re-rank only',
          status: 'ready',
          detail: 'Future modes should change ranking and explanation before adding new calculations.'
        },
        {
          id: 'normalUiHidden',
          label: 'Normal UI hidden',
          status: 'deferred',
          detail: 'Goal switching stays out of the normal UI until feedback shows the current plan-to-review flow is clear.'
        },
        {
          id: 'sequencingDeferred',
          label: 'Sequencing deferred',
          status: 'deferred',
          detail: 'Annual account-level sequencing remains outside this architecture note.'
        }
      ],
      boundary: 'Goal modes are architecture notes only; they do not add toggles, advice, saved output, or annual account instructions.'
    },
    rows: [
      {
        id: 'maxSpend',
        label: 'Max sustainable spend',
        status: 'current',
        detail: 'Current objective ranks candidates by sustainable after-tax spending while preserving trust guardrails.'
      },
      {
        id: 'maxEstate',
        label: 'Max estate',
        status: 'deferred',
        detail: 'Later review can rank the same candidates by projected money left before adding new search paths.'
      },
      {
        id: 'minTax',
        label: 'Min lifetime tax',
        status: 'deferred',
        detail: 'Later review can compare tax outcomes as evidence, not as account instructions.'
      },
      {
        id: 'spendingFlexibility',
        label: 'Spending flexibility',
        status: 'deferred',
        detail: 'Variable spending and cash-wedge rules need user feedback before becoming optimizer goals.'
      }
    ],
    goalModePreview: buildGoalModePreview(candidates),
    spendingFlexibilityReview: {
      headline: 'Spending flexibility needs feedback language first.',
      detail:
        'Before adding variable spending or cash-wedge rules, review whether households understand the trade-off between steadier spending, lower stress, and money left.',
      questions: [
        'Is variable spending clearer as a range, a guardrail, or a review note?',
        'Does the cash-wedge explanation feel like a safety buffer rather than a withdrawal rule?',
        'Would a flexibility goal make the first-results screen clearer or more distracting?'
      ],
      worksheet: [
        {
          id: 'rangeClarity',
          label: 'Range clarity',
          prompt: 'Ask whether a spending range is easier to understand than a single revised number.',
          passSignal: 'User describes the range as a review aid, not permission to spend a specific amount.'
        },
        {
          id: 'bufferClarity',
          label: 'Buffer clarity',
          prompt: 'Ask what the cash wedge is doing in plain language.',
          passSignal: 'User describes it as a buffer or cushion, not a refill rule or withdrawal order.'
        },
        {
          id: 'screenFocus',
          label: 'First-screen focus',
          prompt: 'Ask whether flexibility language helps or distracts from the first retirement answer.',
          passSignal: 'User can still name the answer, spending estimate, and top review item.'
        },
        {
          id: 'decision',
          label: 'Next decision',
          prompt: 'Ask whether flexibility should be tested with users now or parked for goal-mode architecture.',
          passSignal: 'Decision is tied to user clarity, not to implementing rules immediately.'
        }
      ],
      outcomeReview: {
        headline: 'Flexibility feedback has three review outcomes.',
        rows: [
          {
            id: 'rangeHelpful',
            label: 'Range helps',
            status: 'canTest',
            detail: 'User still remembers the main spending answer and says the range helps explain uncertainty.',
            nextStep: 'Keep testing range language in Details research before adding any rule.'
          },
          {
            id: 'rangeDistracting',
            label: 'Range distracts',
            status: 'hold',
            detail: 'User loses the main spending answer or treats the range as the new recommendation.',
            nextStep: 'Hold flexibility work and keep the first screen focused on one reviewed spending number.'
          },
          {
            id: 'rangeUnclear',
            label: 'Range unclear',
            status: 'simplify',
            detail: 'User cannot explain whether the range is evidence, stress context, or a rule.',
            nextStep: 'Simplify copy before testing cash-wedge or variable-spending rules.'
          }
        ],
        boundary: 'Flexibility outcomes are feedback notes only; they do not create spending permission, cash-refill actions, saved settings, or annual account sequencing.'
      },
      cashWedgeBoundary: {
        headline: 'Cash wedge is a buffer explanation, not a refill rule.',
        rows: [
          {
            id: 'buffer',
            label: 'Buffer language',
            detail: 'Describe cash as a cushion that may reduce stress around spending changes.'
          },
          {
            id: 'notRefillRule',
            label: 'No refill rule',
            detail: 'Do not tell users when to refill cash or how much cash to refill.'
          },
          {
            id: 'notWithdrawalOrder',
            label: 'No withdrawal order',
            detail: 'Do not turn cash-wedge language into account-level sequencing.'
          },
          {
            id: 'taxEvidence',
            label: 'Tax evidence later',
            detail: 'Keep tax effects as review evidence until a specific flexibility rule is planned.'
          }
        ],
        boundary: 'Cash-wedge review copy must not create refill instructions, withdrawal instructions, or saved settings.'
      },
      rows: [
        {
          id: 'variableSpending',
          label: 'Variable spending language',
          status: 'review',
          detail: 'Test wording for spending ranges before adding rules that change projected spending.'
        },
        {
          id: 'cashWedge',
          label: 'Cash-wedge buffer language',
          status: 'review',
          detail: 'Test whether users understand cash as a buffer without reading it as an account instruction.'
        },
        {
          id: 'taxImpact',
          label: 'Tax impact evidence',
          status: 'deferred',
          detail: 'Tax effects should stay evidence-only until a specific flexibility rule is planned.'
        },
        {
          id: 'implementationBoundary',
          label: 'Implementation boundary',
          status: 'deferred',
          detail: 'No variable-spending rule, cash refill rule, or annual account sequencing is implemented in this checkpoint.'
        }
      ],
      boundary: 'Spending flexibility remains feedback language, not a saved setting or optimizer instruction.'
    },
    boundary: 'No goal toggle is shown in the normal UI, and annual account-level sequencing remains deferred.'
  };
}

function personLabel(key: 'p1' | 'p2', person: V2PlanPayload['p1']): string {
  return person.name || (key === 'p1' ? 'Person 1' : 'Person 2');
}

function benefitTimingReason(plan: V2PlanPayload, people: ReturnType<typeof activePeople>, startYear: number, endYear: number, ready: boolean): string {
  if (ready) {
    return 'CPP/OAS delay can be reviewed because benefit estimates are entered and each active person can be tested to age 70.';
  }

  const missingEstimate = people.find(({ person }) => !hasCppAndOasEstimate(person));
  if (missingEstimate) {
    return `CPP/OAS delay is skipped because ${personLabel(missingEstimate.key, missingEstimate.person)} needs CPP and OAS estimates first.`;
  }

  const alreadyAge70 = people.find(({ person }) => {
    const startAge = personAgeInYear(person, startYear);
    return startAge !== null && startAge >= 70;
  });
  if (alreadyAge70) {
    return `CPP/OAS delay is skipped because ${personLabel(alreadyAge70.key, alreadyAge70.person)} is already age 70 or older at the projection start.`;
  }

  const doesNotReach70 = people.find(({ person }) => n(person.dob) <= 0 || endYear < n(person.dob) + 70);
  if (doesNotReach70) {
    return `CPP/OAS delay is skipped because ${personLabel(doesNotReach70.key, doesNotReach70.person)} does not reach age 70 within the projection.`;
  }

  return 'CPP/OAS delay is skipped until benefit estimates and age-70 timing are both ready to review.';
}

function canMoveRetirement(plan: V2PlanPayload, years: number): boolean {
  return activePeople(plan).every(({ person }) => {
    const retireYear = n(person.retireYear) || n(plan.assumptions.retireYear);
    const retireAge = personAgeInYear(person, retireYear);
    return retireAge !== null && retireAge + years <= 70;
  });
}

function totalAccountBalance(plan: V2PlanPayload, fields: Array<'rrsp' | 'lira' | 'lif' | 'tfsa' | 'nonreg'>): number {
  return fields.reduce((total, field) => total + n(plan.p1[field]) + n(plan.p2[field]), 0);
}

function hasMeaningfulWithdrawalBuckets(plan: V2PlanPayload): boolean {
  const registered = totalAccountBalance(plan, ['rrsp', 'lira', 'lif']);
  const flexibleInvested = totalAccountBalance(plan, ['tfsa', 'nonreg']);
  return registered >= WITHDRAWAL_BUCKET_MINIMUM && flexibleInvested >= WITHDRAWAL_BUCKET_MINIMUM;
}

function buildEligibilityNotes(plan: V2PlanPayload, contract: OptimizerContract): BoundedOptimizerEligibilityNote[] {
  const spending = n(plan.spending.gogo);
  const retireYear = n(plan.assumptions.retireYear) || n(plan.p1.retireYear);
  const p1RetireAge = personAgeInYear(plan.p1, n(plan.p1.retireYear) || retireYear);
  const p2RetireAge = p2LooksBlank(plan.p2) ? null : personAgeInYear(plan.p2, n(plan.p2.retireYear) || retireYear);
  const startYear = projectionStartYear(plan);
  const endYear = projectionEndYear(plan);
  const activeBenefitPeople = activePeople(plan);
  const benefitPeopleReady = activeBenefitPeople.every(({ person }) => personCanStillDelayBenefits(person, startYear, endYear));
  const registered = totalAccountBalance(plan, ['rrsp', 'lira', 'lif']);
  const hasTwoAccountBuckets = hasMeaningfulWithdrawalBuckets(plan);
  const pensionEligibleIncome = n(plan.p1.db_after65) + n(plan.p1.db_before65) + n(plan.p2.db_after65) + n(plan.p2.db_before65) + registered;
  const reachesPensionSplitAge = activePeople(plan).some(({ person }) => {
    const ageAtEnd = personAgeInYear(person, endYear);
    return ageAtEnd === null || ageAtEnd >= 65;
  });
  const hasDbPension = hasTwoPersonDbPensionIncome(plan);
  const hasPotentialPensionSplit = !p2LooksBlank(plan.p2) && pensionEligibleIncome > 25_000 && !hasDbPension && reachesPensionSplitAge;
  const isTwoPersonPlan = !p2LooksBlank(plan.p2);
  const cppSharingAlreadyOn = Boolean(plan.assumptions.cppSharing);
  const cppSharingReady =
    isTwoPersonPlan && !cppSharingAlreadyOn && activeBenefitPeople.every(({ person }) => hasCppEstimate(person) && personReachesCppStartAge(person, endYear));
  const downsizeYear = n(plan.downsize?.year);
  const downsizeProceeds = n(plan.downsize?.netProceeds);
  const hasCompleteDownsize = downsizeYear > 0 && downsizeProceeds > 0;
  const hasPartialDownsize = (downsizeYear > 0 || downsizeProceeds > 0) && !hasCompleteDownsize;
  const coupleNeedsSurvivorReview = !p2LooksBlank(plan.p2) && !n(plan.assumptions.p1DiesInSurvivor);
  const notes: BoundedOptimizerEligibilityNote[] = [];

  notes.push({
    lever: 'spending',
    status: !canExplore(contract, 'spending') || spending < 30_000 ? 'skipped' : 'eligible',
    reason:
      spending < 30_000
        ? 'Spending cuts are skipped when planned annual spending is already very low.'
        : 'Spending options can be reviewed because a household spending assumption is entered.'
  });
  notes.push({
    lever: 'retirementTiming',
    status:
      !canExplore(contract, 'retirementTiming') || !canMoveRetirement(plan, 1)
        ? 'skipped'
        : 'eligible',
    reason:
      !canMoveRetirement(plan, 1)
        ? 'Working-longer tests are skipped when they would move retirement past age 70.'
        : 'Working-longer options can be reviewed because retirement timing is still inside the bounded test range.'
  });
  notes.push({
    lever: 'benefitTiming',
    status: !canExplore(contract, 'benefitTiming') || !benefitPeopleReady ? 'skipped' : 'eligible',
    reason: benefitTimingReason(plan, activeBenefitPeople, startYear, endYear, benefitPeopleReady)
  });
  notes.push({
    lever: 'withdrawalOrder',
    status: !canExplore(contract, 'withdrawalOrder') || !hasTwoAccountBuckets ? 'skipped' : 'eligible',
    reason: hasTwoAccountBuckets
      ? 'Withdrawal-order checks can be reviewed because there are meaningful balances in registered and TFSA/non-registered accounts.'
      : 'Withdrawal-order checks are skipped until there are meaningful balances in registered and TFSA/non-registered buckets.'
  });
  notes.push({
    lever: 'pensionSplitting',
    status: hasPotentialPensionSplit ? 'eligible' : 'skipped',
    reason: hasPotentialPensionSplit
      ? 'Pension-splitting can be reviewed because this two-person plan has pension or registered income to test.'
      : hasDbPension
        ? 'DB pension splitting is included in the current plan baseline for eligible two-person plans.'
        : 'Pension-splitting is skipped until a two-person plan has meaningful pension or registered income.'
  });
  notes.push({
    lever: 'cppSharing',
    status: cppSharingReady ? 'eligible' : 'skipped',
    reason: cppSharingReady
      ? 'CPP sharing can be reviewed because both people have CPP estimates in this two-person plan.'
      : !isTwoPersonPlan
        ? 'CPP sharing is skipped until this is a two-person plan.'
        : cppSharingAlreadyOn
          ? 'CPP sharing is already included in the current plan.'
          : 'CPP sharing is skipped unless both people have CPP estimates and reach CPP start age within the projection.'
  });
  notes.push({
    lever: 'downsizing',
    status: hasCompleteDownsize ? 'eligible' : 'skipped',
    reason: hasCompleteDownsize
      ? 'Home-sale reliance can be checked because a year and net cash amount are already part of the current plan.'
      : hasPartialDownsize
        ? 'Home-sale reliance is skipped until both the year and net cash amount are entered.'
        : 'Home-sale reliance is skipped because no home-sale cash is part of the current plan.'
  });
  if (coupleNeedsSurvivorReview) {
    notes.push({
      lever: 'survivor',
      status: 'needsReview',
      reason: 'Set a survivor scenario year before relying on optimizer choices for a two-person plan.'
    });
  }

  return notes;
}

function eligibilityFor(notes: BoundedOptimizerEligibilityNote[], lever: BoundedOptimizerLever): BoundedOptimizerEligibilityNote | undefined {
  return notes.find((note) => note.lever === lever);
}

function eligible(notes: BoundedOptimizerEligibilityNote[], lever: BoundedOptimizerLever): boolean {
  return eligibilityFor(notes, lever)?.status === 'eligible';
}

function guardrailStatus(note: BoundedOptimizerEligibilityNote): BoundedOptimizerGuardrailNote['status'] {
  if (note.status === 'eligible') return 'tested';
  if (note.status === 'needsReview') return 'reviewFirst';
  return 'notTested';
}

function guardrailLabel(lever: BoundedOptimizerEligibilityNote['lever']): string {
  const labels: Record<BoundedOptimizerEligibilityNote['lever'], string> = {
    spending: 'Spending changes',
    retirementTiming: 'Work timing',
    benefitTiming: 'CPP/OAS timing',
    withdrawalOrder: 'Withdrawal order',
    estateTarget: 'Estate goal',
    downsizing: 'Downsizing',
    pensionSplitting: 'Pension splitting',
    cppSharing: 'CPP sharing',
    survivor: 'Survivor setup'
  };
  return labels[lever];
}

function buildGuardrailNotes(notes: BoundedOptimizerEligibilityNote[]): BoundedOptimizerGuardrailNote[] {
  return notes.map((note) => ({
    id: note.lever,
    label: guardrailLabel(note.lever),
    status: guardrailStatus(note),
    reason: note.reason
  }));
}

function scaleSpending(plan: V2PlanPayload, multiplier: number): V2PlanPayload {
  const next = extractPlanPayload(plan);
  next.spending.gogo = Math.round(n(next.spending.gogo) * multiplier);
  if (n(next.spending.slowgo) > 0) next.spending.slowgo = Math.round(n(next.spending.slowgo) * multiplier);
  if (n(next.spending.nogo) > 0) next.spending.nogo = Math.round(n(next.spending.nogo) * multiplier);
  return next;
}

function retireLater(plan: V2PlanPayload, years: number): V2PlanPayload {
  const next = extractPlanPayload(plan);
  if (n(next.assumptions.retireYear) > 0) next.assumptions.retireYear = n(next.assumptions.retireYear) + years;
  if (n(next.p1.retireYear) > 0) next.p1.retireYear = n(next.p1.retireYear) + years;
  if (!p2LooksBlank(next.p2) && n(next.p2.retireYear) > 0) next.p2.retireYear = n(next.p2.retireYear) + years;
  return next;
}

function withWithdrawalOrder(plan: V2PlanPayload, order: string): V2PlanPayload {
  const next = extractPlanPayload(plan);
  next.assumptions.withdrawalOrder = order;
  return next;
}

function withCppSharing(plan: V2PlanPayload): V2PlanPayload {
  const next = extractPlanPayload(plan);
  next.assumptions.cppSharing = true;
  return next;
}

function benefitGridCandidate(
  plan: V2PlanPayload,
  config: SimulationConfig,
  cppAge: number,
  oasAge: number
): BoundedOptimizerCandidateDefinition {
  return {
    id: benefitGridCandidateId(cppAge, oasAge),
    label: `Test CPP at ${cppAge} / OAS at ${oasAge}`,
    plan: extractPlanPayload(plan),
    config: { ...config, cppAgeF: cppAge, cppAgeM: cppAge, oasAgeF: oasAge, oasAgeM: oasAge },
    changedLevers: ['benefitTiming'],
    changeSummary: `Start CPP at ${cppAge} and OAS at ${oasAge} in this test`,
    reviewNote: 'Review health, bridge funding, and benefit estimates before choosing timing.',
    disruptionPenalty: Math.abs(cppAge - 65) * 1_500 + Math.abs(oasAge - 65) * 1_500
  };
}

function benefitGridCandidateId(cppAge: number, oasAge: number): BenefitGridCandidateId {
  return `benefitGridCpp${cppAge}Oas${oasAge}` as BenefitGridCandidateId;
}

function buildBenefitGridCandidates(plan: V2PlanPayload, config: SimulationConfig): BoundedOptimizerCandidateDefinition[] {
  return BENEFIT_GRID_CPP_AGES.flatMap((cppAge) =>
    BENEFIT_GRID_OAS_AGES.map((oasAge) => ({ cppAge, oasAge }))
  )
    .filter(({ cppAge, oasAge }) => !(cppAge === 65 && oasAge === 65))
    .filter(({ cppAge, oasAge }) => !(cppAge === 70 && oasAge === 70))
    .map(({ cppAge, oasAge }) => benefitGridCandidate(plan, config, cppAge, oasAge));
}

function limitBoundedOptimizerCandidates(candidates: BoundedOptimizerCandidateDefinition[]): BoundedOptimizerCandidateDefinition[] {
  if (candidates.length <= BOUNDED_OPTIMIZER_CANDIDATE_LIMIT) return candidates;
  const baseline = candidates[0];
  const rest = candidates.slice(1);
  const gridCandidates = rest.filter((candidate) => String(candidate.id).startsWith('benefitGrid'));
  const preservedCandidates = rest.filter((candidate) => !String(candidate.id).startsWith('benefitGrid'));
  const gridRoom = Math.max(0, BOUNDED_OPTIMIZER_CANDIDATE_LIMIT - 1 - preservedCandidates.length);
  return [baseline, ...gridCandidates.slice(0, gridRoom), ...preservedCandidates].slice(0, BOUNDED_OPTIMIZER_CANDIDATE_LIMIT);
}

function withoutDownsize(plan: V2PlanPayload): V2PlanPayload {
  const next = extractPlanPayload(plan);
  next.downsize = { ...(next.downsize || {}), year: 0, netProceeds: 0 };
  return next;
}

export function buildBoundedOptimizerCandidates(
  plan: V2PlanPayload,
  contract: OptimizerContract = buildOptimizerContract(plan)
): BoundedOptimizerCandidateDefinition[] {
  const config = baseConfig(plan);
  const eligibilityNotes = buildEligibilityNotes(plan, contract);
  const candidates: BoundedOptimizerCandidateDefinition[] = [
    {
      id: 'baseline',
      label: 'Current plan',
      plan: extractPlanPayload(plan),
      config,
      changedLevers: [],
      changeSummary: 'No changes',
      reviewNote: 'Use this as the comparison point for other plan options.',
      disruptionPenalty: 0
    }
  ];

  if (contract.status !== 'readyForExtraction') return candidates;

  if (eligible(eligibilityNotes, 'spending')) {
    candidates.push(
      {
        id: 'spendLess5',
        label: 'Spend 5% less',
        plan: scaleSpending(plan, 0.95),
        config,
        changedLevers: ['spending'],
        changeSummary: 'Reduce planned spending by 5%',
        reviewNote: 'Review whether this spending level still fits the household lifestyle.',
        disruptionPenalty: 7_500
      },
      {
        id: 'spendLess10',
        label: 'Spend 10% less',
        plan: scaleSpending(plan, 0.9),
        config,
        changedLevers: ['spending'],
        changeSummary: 'Reduce planned spending by 10%',
        reviewNote: 'Treat this as a repair option, not an automatic recommendation.',
        disruptionPenalty: 15_000
      }
    );
  }

  if (eligible(eligibilityNotes, 'retirementTiming')) {
    if (canMoveRetirement(plan, 1)) {
      candidates.push({
        id: 'retireLater1',
        label: 'Work 1 year longer',
        plan: retireLater(plan, 1),
        config,
        changedLevers: ['retirementTiming'],
        changeSummary: 'Move retirement one year later',
        reviewNote: 'Review whether work timing is truly flexible before relying on this option.',
        disruptionPenalty: 10_000
      });
    }
    if (canMoveRetirement(plan, 2)) {
      candidates.push({
        id: 'retireLater2',
        label: 'Work 2 years longer',
        plan: retireLater(plan, 2),
        config,
        changedLevers: ['retirementTiming'],
        changeSummary: 'Move retirement two years later',
        reviewNote: 'This may improve funding, but it changes a major life assumption.',
        disruptionPenalty: 20_000
      });
    }
  }

  if (eligible(eligibilityNotes, 'benefitTiming')) {
    candidates.push(
      ...buildBenefitGridCandidates(plan, config),
      {
        id: 'delayBenefits',
        label: 'Test CPP/OAS at 70',
        plan: extractPlanPayload(plan),
        config: { ...config, cppAgeF: 70, cppAgeM: 70, oasAgeF: 70, oasAgeM: 70 },
        changedLevers: ['benefitTiming'],
        changeSummary: 'Start CPP/OAS at 70 in this test',
        reviewNote: 'Review health, bridge funding, and benefit estimates before choosing timing.',
        disruptionPenalty: 5_000
      }
    );
  }

  if (eligible(eligibilityNotes, 'pensionSplitting')) {
    candidates.push({
      id: 'pensionSplit',
      label: 'Test pension splitting',
      plan: extractPlanPayload(plan),
      config: { ...config, pensionSplit: true },
      changedLevers: ['pensionSplitting'],
      changeSummary: 'Turn on pension-splitting in this test',
      reviewNote: 'Review eligible pension income and spouse tax details before using this option.',
      disruptionPenalty: 1_500
    });
  }

  if (eligible(eligibilityNotes, 'cppSharing')) {
    candidates.push({
      id: 'cppSharing',
      label: 'Test CPP sharing',
      plan: withCppSharing(plan),
      config,
      changedLevers: ['cppSharing'],
      changeSummary: 'Turn on CPP sharing in this test',
      reviewNote: 'Review CPP sharing eligibility and household tax details before relying on this option.',
      disruptionPenalty: 1_500
    });
  }

  if (eligible(eligibilityNotes, 'downsizing')) {
    candidates.push({
      id: 'withoutDownsize',
      label: 'Check without home-sale cash',
      plan: withoutDownsize(plan),
      config,
      changedLevers: ['downsizing'],
      changeSummary: 'Remove home-sale cash in this reliance check',
      reviewNote: 'This checks how much the plan depends on home-sale cash. It is not a suggestion to sell or keep the home.',
      disruptionPenalty: 1_000_000
    });
  }

  if (eligible(eligibilityNotes, 'withdrawalOrder')) {
    const currentOrder = plan.assumptions.withdrawalOrder || 'default';
    WITHDRAWAL_ORDERS.filter((order) => order.value !== currentOrder).forEach((order) => {
      candidates.push({
        id: order.id,
        label: order.label,
        plan: withWithdrawalOrder(plan, order.value),
        config: { ...config, withdrawalOrder: order.value },
        changedLevers: ['withdrawalOrder'],
        changeSummary: `Test ${order.label.toLowerCase()}`,
        reviewNote: 'Use this as a high-level drawdown-order check, not tax-bracket optimization.',
        disruptionPenalty: 2_500
      });
    });
  }

  return limitBoundedOptimizerCandidates(candidates);
}

function summarizeResult(result: SimulationResult | null | undefined) {
  const rows = Array.isArray(result?.years) ? result.years : [];
  const totalTax = n((result as { totalTax?: unknown } | null | undefined)?.totalTax);
  const firstShortfall = rows.find((row) => n(row.shortfall) > 1);
  const fundedYears = rows.filter((row) => n(row.shortfall) <= 1).length;
  const lastRow = rows[rows.length - 1];
  const fundedThroughYear = firstShortfall ? n(firstShortfall.year) - 1 : lastRow ? n(lastRow.year) : null;
  const fundedRows = rows.filter((row) => n(row.shortfall) <= 1);
  const sustainableAnnualSpend = fundedRows.length
    ? Math.min(...fundedRows.map((row) => n(row.totalAftaxYear || row.spending)).filter((value) => value > 0))
    : 0;
  return {
    rows,
    fundedYears,
    totalYears: rows.length,
    fundedThroughYear,
    firstShortfallYear: firstShortfall ? n(firstShortfall.year) : null,
    sustainableAnnualSpend,
    endPortfolio: n(lastRow?.bal_total),
    lifetimeTax: totalTax || rows.reduce((sum, row) => sum + n(row.totalTaxYear), 0),
    firstYearTax: n(rows[0]?.totalTaxYear),
    peakTax: rows.reduce((peak, row) => Math.max(peak, n(row.totalTaxYear)), 0),
    lifetimeOasRecovery: rows.reduce((sum, row) => sum + n(row.totalOasClawY), 0)
  };
}

function scoreCandidate(
  summary: ReturnType<typeof summarizeResult>,
  baseline: ReturnType<typeof summarizeResult>,
  disruptionPenalty: number
): number {
  if (summary.totalYears === 0) return Number.NEGATIVE_INFINITY;
  const fixedShortfallBonus = baseline.firstShortfallYear && !summary.firstShortfallYear ? 500_000 : 0;
  const noShortfallBonus = summary.firstShortfallYear ? 0 : 100_000;
  const fundedScore = summary.fundedYears * 25_000;
  const spendingScore = summary.sustainableAnnualSpend * 3;
  const portfolioScore = summary.endPortfolio / 25;
  const taxScore = (baseline.lifetimeTax - summary.lifetimeTax) / 5;
  return fixedShortfallBonus + noShortfallBonus + fundedScore + spendingScore + portfolioScore + taxScore - disruptionPenalty;
}

function isDisruptiveChoice(row: Pick<BoundedOptimizerCandidateRow, 'changedLevers'>): boolean {
  return row.changedLevers.some((lever) => lever === 'spending' || lever === 'retirementTiming' || lever === 'benefitTiming');
}

function isMaterialFundingRepair(
  summary: ReturnType<typeof summarizeResult>,
  baseline: ReturnType<typeof summarizeResult>
): boolean {
  if (baseline.firstShortfallYear && !summary.firstShortfallYear) return true;
  if (baseline.firstShortfallYear && summary.fundedYears >= baseline.fundedYears + 2) return true;
  return false;
}

function hasWeakBenefitBridge(summary: ReturnType<typeof summarizeResult>): boolean {
  return benefitBridgeShortfall(summary).count > 0;
}

function benefitBridgeShortfall(summary: ReturnType<typeof summarizeResult>): { count: number; firstYear: number | null } {
  const bridgeRows = summary.rows.filter((row) => {
    const beforeAge70 = (n(row.ageF) > 0 && n(row.ageF) < 70) || (n(row.ageM) > 0 && n(row.ageM) < 70);
    return beforeAge70 && n(row.shortfall) > 1;
  });
  return { count: bridgeRows.length, firstYear: bridgeRows[0] ? n(bridgeRows[0].year) : null };
}

function hasMeaningfulNonDisruptiveImprovement(
  summary: ReturnType<typeof summarizeResult>,
  baseline: ReturnType<typeof summarizeResult>
): boolean {
  return summary.fundedYears > baseline.fundedYears || summary.endPortfolio - baseline.endPortfolio > 25_000 || baseline.lifetimeTax - summary.lifetimeTax > 5_000;
}

function estateTargetGap(summary: ReturnType<typeof summarizeResult>, estateTarget: number): number {
  return estateTarget > 0 ? Math.max(0, estateTarget - summary.endPortfolio) : 0;
}

function recommendationPermission(
  row: Pick<BoundedOptimizerCandidateRow, 'id' | 'label' | 'changedLevers'>,
  summary: ReturnType<typeof summarizeResult>,
  baseline: ReturnType<typeof summarizeResult>,
  estateTarget: number,
  survivorNeedsReview = false
): { eligible: boolean; reason: string } {
  if (row.id === 'baseline') {
    return { eligible: true, reason: 'The current plan can stay first when other options do not clear the suggestion bar.' };
  }

  if (row.id === 'withoutDownsize') {
    return { eligible: false, reason: 'This home-sale reliance check is evidence only, so it stays review-only and is not highlighted as the first option.' };
  }

  if (summary.totalYears === 0) {
    return { eligible: false, reason: 'This option did not produce a usable projection.' };
  }

  if (estateTarget > 0 && summary.endPortfolio < estateTarget) {
    const baselineGap = estateTargetGap(baseline, estateTarget);
    const candidateGap = estateTargetGap(summary, estateTarget);
    const worsensGap = candidateGap > baselineGap + 1;
    if (!isMaterialFundingRepair(summary, baseline) || worsensGap) {
      return {
        eligible: false,
        reason: 'This option stays review-only because it weakens the entered estate goal. Change the estate goal first if that trade-off is intentional.'
      };
    }
  }

  if (row.changedLevers.includes('benefitTiming') && hasWeakBenefitBridge(summary)) {
    const bridge = benefitBridgeShortfall(summary);
    return {
      eligible: false,
      reason: `Benefit delay remains review-only because ${bridge.count} bridge year${bridge.count === 1 ? '' : 's'} before age 70 ${bridge.count === 1 ? 'shows' : 'show'} a spending shortfall${bridge.firstYear ? `, starting in ${bridge.firstYear}` : ''}.`
    };
  }

  if (row.changedLevers.includes('benefitTiming') && survivorNeedsReview) {
    return {
      eligible: false,
      reason: 'Benefit timing stays review-only until a survivor scenario year is set for this two-person plan.'
    };
  }

  if (isDisruptiveChoice(row)) {
    return isMaterialFundingRepair(summary, baseline)
      ? { eligible: true, reason: 'This disruptive option can be reviewed first because it materially improves a visible funding shortfall.' }
      : { eligible: false, reason: 'This option changes lifestyle, work timing, or benefit timing, so it stays review-only unless it materially repairs a funding problem.' };
  }

  return hasMeaningfulNonDisruptiveImprovement(summary, baseline)
    ? { eligible: true, reason: 'This option can be reviewed first because it improves taxes, funded years, or projected money left without changing lifestyle or work timing.' }
    : { eligible: false, reason: 'This option is close to the current plan, so it stays review-only.' };
}

function compareRows(a: BoundedOptimizerCandidateRow, b: BoundedOptimizerCandidateRow): number {
  if (a.score !== b.score) return b.score - a.score;
  if (a.firstShortfallYear && !b.firstShortfallYear) return 1;
  if (!a.firstShortfallYear && b.firstShortfallYear) return -1;
  if (a.id === 'baseline') return -1;
  if (b.id === 'baseline') return 1;
  return a.label.localeCompare(b.label);
}

function optionGroupForRow(row: Pick<BoundedOptimizerCandidateRow, 'id' | 'changedLevers'>): BoundedOptimizerOptionGroupId {
  if (row.id === 'baseline') return 'currentPlan';
  if (row.changedLevers.includes('spending')) return 'lifestyle';
  if (row.changedLevers.includes('retirementTiming') || row.changedLevers.includes('benefitTiming')) return 'timing';
  if (row.changedLevers.includes('pensionSplitting') || row.changedLevers.includes('cppSharing')) return 'incomeSharing';
  if (row.changedLevers.includes('withdrawalOrder')) return 'drawdownReview';
  if (row.changedLevers.includes('downsizing') || row.changedLevers.includes('estateTarget')) return 'homeEstate';
  return 'currentPlan';
}

function optionGroupLabel(id: BoundedOptimizerOptionGroupId): Pick<BoundedOptimizerOptionGroup, 'label' | 'summary'> {
  const labels: Record<BoundedOptimizerOptionGroupId, Pick<BoundedOptimizerOptionGroup, 'label' | 'summary'>> = {
    currentPlan: {
      label: 'Current plan',
      summary: 'The comparison point for every check.'
    },
    lifestyle: {
      label: 'Lifestyle choices',
      summary: 'Spending changes stay review-only unless they repair a visible funding issue.'
    },
    timing: {
      label: 'Timing choices',
      summary: 'Work and benefit timing can change major life assumptions, so they need stronger support.'
    },
    incomeSharing: {
      label: 'Income-sharing checks',
      summary: 'Pension splitting and CPP sharing are tax and income checks for eligible couples.'
    },
    drawdownReview: {
      label: 'Drawdown review',
      summary: 'Withdrawal-order checks are high-level comparisons, not tax-aware instructions.'
    },
    homeEstate: {
      label: 'Home and estate checks',
      summary: 'Home-sale cash and estate goals are treated as household preferences to review.'
    }
  };
  return labels[id];
}

function buildOptionGroups(rows: BoundedOptimizerCandidateRow[]): BoundedOptimizerOptionGroup[] {
  const order: BoundedOptimizerOptionGroupId[] = ['currentPlan', 'lifestyle', 'timing', 'incomeSharing', 'drawdownReview', 'homeEstate'];
  return order
    .map((id) => {
      const groupRows = rows.filter((row) => optionGroupForRow(row) === id);
      const label = optionGroupLabel(id);
      return {
        id,
        ...label,
        candidateIds: groupRows.map((row) => row.id),
        reviewOnlyCount: groupRows.filter((row) => row.status === 'review' || !row.suggestionEligible).length,
        canHighlightCount: groupRows.filter((row) => row.suggestionEligible).length
      } satisfies BoundedOptimizerOptionGroup;
    })
    .filter((group) => group.candidateIds.length > 0);
}

function moneyText(value: number): string {
  const rounded = Math.round(Math.abs(value));
  return `${value < 0 ? '-' : ''}$${rounded.toLocaleString()}`;
}

function signedMoneyText(value: number): string {
  if (Math.abs(value) <= 1) return '$0';
  return `${value > 0 ? '+' : '-'}$${Math.round(Math.abs(value)).toLocaleString()}`;
}

function deltaText(value: number, improvementWord: string, declineWord: string): string {
  if (Math.abs(value) <= 1) return 'About the same as the current plan.';
  return value > 0 ? `${improvementWord} by about ${moneyText(value)}.` : `${declineWord} by about ${moneyText(value)}.`;
}

function leverTradeoffCopy(row: BoundedOptimizerCandidateRow): string[] {
  const tradeoffs: string[] = [];
  if (row.changedLevers.includes('spending')) {
    tradeoffs.push('Lower spending can improve the projection, but it must still feel realistic for the household.');
  }
  if (row.changedLevers.includes('retirementTiming')) {
    tradeoffs.push('Working longer can improve the numbers, but it changes a major life and health assumption.');
  }
  if (row.changedLevers.includes('benefitTiming')) {
    tradeoffs.push('Delaying CPP/OAS can help later income, but bridge funding and health assumptions matter.');
  }
  if (row.changedLevers.includes('withdrawalOrder')) {
    tradeoffs.push('Changing drawdown order is only a high-level check here; it is not year-by-year tax planning.');
  }
  if (row.changedLevers.includes('pensionSplitting')) {
    tradeoffs.push('Pension-splitting can lower household tax, but eligibility and spouse tax details need review.');
  }
  if (row.changedLevers.includes('cppSharing')) {
    tradeoffs.push('CPP sharing can shift taxable income between spouses, but eligibility and household tax details need review.');
  }
  if (row.changedLevers.includes('downsizing')) {
    tradeoffs.push('Home-sale cash is a lifestyle-sensitive assumption; this check only shows reliance on that cash.');
  }
  return tradeoffs;
}

function buildOptimizerExplanation(
  suggested: BoundedOptimizerCandidateRow | null,
  baseline: BoundedOptimizerCandidateRow | null,
  contract: OptimizerContract
): BoundedOptimizerExplanation {
  if (!suggested || !baseline || contract.status !== 'readyForExtraction') {
    return {
      whyThisOption: ['Required inputs need review before plan options can be compared.'],
      tradeoffs: contract.blockers.length ? contract.blockers.slice(0, 3) : ['Run Results after clearing missing or invalid inputs.'],
      verifyBeforeUsing: ['Clear input blockers.', 'Run Results again.', 'Save an editable plan copy after reviewing the inputs.'],
      plainLanguageSummary: 'Plan options are paused until required inputs are ready.'
    };
  }

  const whyThisOption = [
    suggested.firstShortfallYear
      ? `It funds spending through ${suggested.fundedThroughYear || '-'} before a first shortfall in ${suggested.firstShortfallYear}.`
      : 'It avoids a visible spending shortfall in the projection years checked.',
    deltaText(suggested.endPortfolioDelta, 'Projected money left improves', 'Projected money left falls'),
    deltaText(-suggested.lifetimeTaxDelta, 'Lifetime tax falls', 'Lifetime tax rises')
  ];

  if (baseline.firstShortfallYear && !suggested.firstShortfallYear) {
    whyThisOption.unshift(`It removes the current plan's first visible shortfall in ${baseline.firstShortfallYear}.`);
  }
  if (suggested.id === 'baseline') {
    whyThisOption.unshift('The current plan stays first because other options do not clear the suggestion bar.');
  }

  const tradeoffs = leverTradeoffCopy(suggested);
  if (suggested.endPortfolioDelta < -1) tradeoffs.push('This option leaves less projected money at the end of the plan.');
  if (suggested.lifetimeTaxDelta > 1) tradeoffs.push('This option shows higher lifetime tax in the current model.');
  if (!tradeoffs.length) tradeoffs.push('No major input change is being proposed by this limited check.');

  return {
    whyThisOption,
    tradeoffs,
    verifyBeforeUsing: [
      suggested.reviewNote,
      'Review taxes, survivor impact, and account balances before acting.',
      'Confirm the option still fits household comfort and priorities.'
    ],
    plainLanguageSummary:
      suggested.id === 'baseline'
        ? 'The limited check did not find a better plan option than the current inputs.'
        : `${suggested.label} is the first option to review because it cleared the suggestion checks without widening the search.`
  };
}

function evidenceTone(delta: number, lowerIsBetter = true): BoundedOptimizerEvidenceRow['tone'] {
  if (Math.abs(delta) <= 1) return 'neutral';
  return lowerIsBetter ? (delta < 0 ? 'ok' : 'watch') : delta > 0 ? 'ok' : 'watch';
}

function buildPensionSplittingEvidence(
  summaries: Partial<Record<BoundedOptimizerCandidateId, ReturnType<typeof summarizeResult>>>
): BoundedOptimizerEvidenceRow[] {
  const baseline = summaries.baseline;
  const pension = summaries.pensionSplit;
  if (!baseline || !pension || pension.totalYears === 0) return [];

  const lifetimeTaxDelta = pension.lifetimeTax - baseline.lifetimeTax;
  const firstYearTaxDelta = pension.firstYearTax - baseline.firstYearTax;
  const peakTaxDelta = pension.peakTax - baseline.peakTax;
  const oasDelta = pension.lifetimeOasRecovery - baseline.lifetimeOasRecovery;
  const portfolioDelta = pension.endPortfolio - baseline.endPortfolio;

  return [
    {
      id: 'pensionLifetimeTax',
      label: 'Lifetime tax change',
      value: signedMoneyText(lifetimeTaxDelta),
      detail: 'Compares total tax across the projection when pension-splitting is turned on for this review.',
      tone: evidenceTone(lifetimeTaxDelta)
    },
    {
      id: 'pensionFirstYearTax',
      label: 'First-year tax change',
      value: signedMoneyText(firstYearTaxDelta),
      detail: 'Shows whether the first projection year changes when eligible pension income is split.',
      tone: evidenceTone(firstYearTaxDelta)
    },
    {
      id: 'pensionPeakTax',
      label: 'Peak annual tax change',
      value: signedMoneyText(peakTaxDelta),
      detail: 'Compares the highest annual tax year in each projection.',
      tone: evidenceTone(peakTaxDelta)
    },
    {
      id: 'pensionOasRecovery',
      label: 'OAS recovery tax change',
      value: signedMoneyText(oasDelta),
      detail: 'Shows whether OAS recovery tax changes across the projection.',
      tone: evidenceTone(oasDelta)
    },
    {
      id: 'pensionPortfolio',
      label: 'Projected money-left change',
      value: signedMoneyText(portfolioDelta),
      detail: 'Compares projected money left at the end of the plan.',
      tone: evidenceTone(portfolioDelta, false)
    }
  ];
}

function buildCppSharingEvidence(
  summaries: Partial<Record<BoundedOptimizerCandidateId, ReturnType<typeof summarizeResult>>>
): BoundedOptimizerEvidenceRow[] {
  const baseline = summaries.baseline;
  const sharing = summaries.cppSharing;
  if (!baseline || !sharing || sharing.totalYears === 0) return [];

  const lifetimeTaxDelta = sharing.lifetimeTax - baseline.lifetimeTax;
  const firstYearTaxDelta = sharing.firstYearTax - baseline.firstYearTax;
  const peakTaxDelta = sharing.peakTax - baseline.peakTax;
  const oasDelta = sharing.lifetimeOasRecovery - baseline.lifetimeOasRecovery;
  const portfolioDelta = sharing.endPortfolio - baseline.endPortfolio;

  return [
    {
      id: 'cppSharingLifetimeTax',
      label: 'CPP sharing lifetime tax change',
      value: signedMoneyText(lifetimeTaxDelta),
      detail: 'Compares total tax across the projection when CPP sharing is turned on for this review.',
      tone: evidenceTone(lifetimeTaxDelta)
    },
    {
      id: 'cppSharingFirstYearTax',
      label: 'CPP sharing first-year tax change',
      value: signedMoneyText(firstYearTaxDelta),
      detail: 'Shows whether the first projection year changes when CPP sharing is tested.',
      tone: evidenceTone(firstYearTaxDelta)
    },
    {
      id: 'cppSharingPeakTax',
      label: 'CPP sharing peak tax change',
      value: signedMoneyText(peakTaxDelta),
      detail: 'Compares the highest annual tax year with and without CPP sharing in this check.',
      tone: evidenceTone(peakTaxDelta)
    },
    {
      id: 'cppSharingOasRecovery',
      label: 'CPP sharing OAS recovery tax change',
      value: signedMoneyText(oasDelta),
      detail: 'Shows whether OAS recovery tax changes across the projection.',
      tone: evidenceTone(oasDelta)
    },
    {
      id: 'cppSharingPortfolio',
      label: 'CPP sharing projected money-left change',
      value: signedMoneyText(portfolioDelta),
      detail: 'Compares projected money left at the end of the plan.',
      tone: evidenceTone(portfolioDelta, false)
    }
  ];
}

function buildBenefitTimingEvidence(
  summaries: Partial<Record<BoundedOptimizerCandidateId, ReturnType<typeof summarizeResult>>>
): BoundedOptimizerEvidenceRow[] {
  const baseline = summaries.baseline;
  const delay = summaries.delayBenefits;
  if (!baseline || !delay || delay.totalYears === 0) return [];

  const gridEvidence = buildBenefitGridEvidence(summaries, baseline);
  const bridge = benefitBridgeShortfall(delay);
  const lifetimeTaxDelta = delay.lifetimeTax - baseline.lifetimeTax;
  const portfolioDelta = delay.endPortfolio - baseline.endPortfolio;

  return [
    ...gridEvidence,
    {
      id: 'benefitBridgeYears',
      label: 'Bridge years before age 70',
      value: bridge.count ? `${bridge.count} shortfall year${bridge.count === 1 ? '' : 's'}` : 'No visible bridge shortfall',
      detail: 'Checks whether delaying CPP/OAS creates spending gaps before age 70.',
      tone: bridge.count ? 'watch' : 'neutral'
    },
    {
      id: 'benefitFirstBridgeShortfall',
      label: 'First bridge shortfall',
      value: bridge.firstYear ? String(bridge.firstYear) : 'None visible',
      detail: baseline.firstShortfallYear ? `Current plan first shortfall: ${baseline.firstShortfallYear}.` : 'Current plan has no visible shortfall in the projection years checked.',
      tone: bridge.firstYear ? 'watch' : 'neutral'
    },
    {
      id: 'benefitLifetimeTax',
      label: 'Delay lifetime tax change',
      value: signedMoneyText(lifetimeTaxDelta),
      detail: 'Compares total tax when CPP/OAS are delayed to 70 in this review.',
      tone: evidenceTone(lifetimeTaxDelta)
    },
    {
      id: 'benefitPortfolio',
      label: 'Delay projected money-left change',
      value: signedMoneyText(portfolioDelta),
      detail: 'Compares projected money left at the end of the plan.',
      tone: evidenceTone(portfolioDelta, false)
    }
  ];
}

function parseBenefitGridId(id: string): { cppAge: number; oasAge: number } | null {
  const match = /^benefitGridCpp(\d+)Oas(\d+)$/.exec(id);
  if (!match) return null;
  return { cppAge: Number(match[1]), oasAge: Number(match[2]) };
}

function compareBenefitGridSummaries(
  a: { id: BoundedOptimizerCandidateId; summary: ReturnType<typeof summarizeResult> },
  b: { id: BoundedOptimizerCandidateId; summary: ReturnType<typeof summarizeResult> }
): number {
  if (a.summary.totalYears === 0 && b.summary.totalYears > 0) return 1;
  if (a.summary.totalYears > 0 && b.summary.totalYears === 0) return -1;
  if (a.summary.firstShortfallYear && !b.summary.firstShortfallYear) return 1;
  if (!a.summary.firstShortfallYear && b.summary.firstShortfallYear) return -1;
  if (a.summary.fundedYears !== b.summary.fundedYears) return b.summary.fundedYears - a.summary.fundedYears;
  if (a.summary.endPortfolio !== b.summary.endPortfolio) return b.summary.endPortfolio - a.summary.endPortfolio;
  if (a.summary.lifetimeTax !== b.summary.lifetimeTax) return a.summary.lifetimeTax - b.summary.lifetimeTax;
  return String(a.id).localeCompare(String(b.id));
}

function buildBenefitGridEvidence(
  summaries: Partial<Record<BoundedOptimizerCandidateId, ReturnType<typeof summarizeResult>>>,
  baseline: ReturnType<typeof summarizeResult>
): BoundedOptimizerEvidenceRow[] {
  const gridRows = Object.entries(summaries)
    .filter(([id, summary]) => id.startsWith('benefitGrid') && summary && summary.totalYears > 0)
    .map(([id, summary]) => ({ id: id as BoundedOptimizerCandidateId, summary: summary as ReturnType<typeof summarizeResult> }))
    .sort(compareBenefitGridSummaries);
  const best = gridRows[0];
  const ages = best ? parseBenefitGridId(best.id) : null;
  if (!best || !ages) return [];

  const fundedYearsDelta = best.summary.fundedYears - baseline.fundedYears;
  const lifetimeTaxDelta = best.summary.lifetimeTax - baseline.lifetimeTax;
  const portfolioDelta = best.summary.endPortfolio - baseline.endPortfolio;

  return [
    {
      id: 'benefitGridBestPair',
      label: 'First milestone pair to review',
      value: `CPP ${ages.cppAge} / OAS ${ages.oasAge}`,
      detail: 'Highest-ranked result inside the bounded benefit-timing milestone grid, before full exhaustive search.',
      tone: best.summary.firstShortfallYear ? 'watch' : 'neutral'
    },
    {
      id: 'benefitGridTopThree',
      label: 'Other milestone pairs to compare',
      value: topBenefitGridPairText(gridRows.slice(0, 3)),
      detail: 'Shows the leading milestone pairs from the same bounded grid so the first pair is not read in isolation.',
      tone: 'neutral'
    },
    {
      id: 'benefitGridFundedYears',
      label: 'Milestone funded years',
      value: fundedYearsDelta === 0 ? 'No change' : `${fundedYearsDelta > 0 ? '+' : ''}${fundedYearsDelta} year${Math.abs(fundedYearsDelta) === 1 ? '' : 's'}`,
      detail: 'Compares funded projection years for the best milestone pair against the current plan.',
      tone: fundedYearsDelta === 0 ? 'neutral' : fundedYearsDelta > 0 ? 'ok' : 'watch'
    },
    {
      id: 'benefitGridLifetimeTax',
      label: 'Milestone lifetime tax change',
      value: signedMoneyText(lifetimeTaxDelta),
      detail: 'Compares total tax for the best milestone pair against the current plan.',
      tone: evidenceTone(lifetimeTaxDelta)
    },
    {
      id: 'benefitGridPortfolio',
      label: 'Milestone money-left change',
      value: signedMoneyText(portfolioDelta),
      detail: 'Compares projected money left for the best milestone pair against the current plan.',
      tone: evidenceTone(portfolioDelta, false)
    }
  ];
}

function topBenefitGridPairText(rows: Array<{ id: BoundedOptimizerCandidateId; summary: ReturnType<typeof summarizeResult> }>): string {
  return rows
    .map((row) => parseBenefitGridId(row.id))
    .filter((ages): ages is { cppAge: number; oasAge: number } => Boolean(ages))
    .map((ages) => `CPP ${ages.cppAge} / OAS ${ages.oasAge}`)
    .join('; ');
}

function buildHomeSaleRelianceEvidence(
  summaries: Partial<Record<BoundedOptimizerCandidateId, ReturnType<typeof summarizeResult>>>,
  plan: V2PlanPayload
): BoundedOptimizerEvidenceRow[] {
  const baseline = summaries.baseline;
  const withoutHomeCash = summaries.withoutDownsize;
  if (!baseline || !withoutHomeCash || withoutHomeCash.totalYears === 0) return [];

  const fundedYearsDelta = withoutHomeCash.fundedYears - baseline.fundedYears;
  const lifetimeTaxDelta = withoutHomeCash.lifetimeTax - baseline.lifetimeTax;
  const portfolioDelta = withoutHomeCash.endPortfolio - baseline.endPortfolio;
  const estateTarget = n(plan.inheritance);
  const estateGapDelta = estateTargetGap(withoutHomeCash, estateTarget) - estateTargetGap(baseline, estateTarget);

  const rows: BoundedOptimizerEvidenceRow[] = [
    {
      id: 'homeRelianceFundedYears',
      label: 'Home-sale reliance check',
      value: fundedYearsDelta === 0 ? 'No change' : `${fundedYearsDelta > 0 ? '+' : ''}${fundedYearsDelta} year${Math.abs(fundedYearsDelta) === 1 ? '' : 's'}`,
      detail: 'Compares the Current plan with Without home-sale cash to show how many funded years change.',
      tone: fundedYearsDelta === 0 ? 'neutral' : fundedYearsDelta > 0 ? 'ok' : 'watch'
    },
    {
      id: 'homeRelianceFirstShortfall',
      label: 'First shortfall without home-sale cash',
      value: withoutHomeCash.firstShortfallYear ? String(withoutHomeCash.firstShortfallYear) : 'None visible',
      detail: baseline.firstShortfallYear
        ? `Current plan first shortfall: ${baseline.firstShortfallYear}.`
        : 'Current plan has no visible shortfall in the projection years checked.',
      tone: withoutHomeCash.firstShortfallYear && !baseline.firstShortfallYear ? 'watch' : 'neutral'
    },
    {
      id: 'homeReliancePortfolio',
      label: 'Projected money-left change',
      value: signedMoneyText(portfolioDelta),
      detail: 'Compares projected money left at the end of the plan without home-sale cash.',
      tone: evidenceTone(portfolioDelta, false)
    },
    {
      id: 'homeRelianceLifetimeTax',
      label: 'Lifetime tax change',
      value: signedMoneyText(lifetimeTaxDelta),
      detail: 'Compares total tax across the projection without home-sale cash.',
      tone: evidenceTone(lifetimeTaxDelta)
    }
  ];

  if (estateTarget > 0) {
    rows.push({
      id: 'homeRelianceEstateGap',
      label: 'Estate goal gap change',
      value: signedMoneyText(estateGapDelta),
      detail: 'Shows whether removing home-sale cash widens the gap against the entered estate goal.',
      tone: evidenceTone(estateGapDelta)
    });
  }

  return rows;
}

function withdrawalFamilyLabel(id: BoundedOptimizerCandidateId): string {
  if (id === 'withdrawalRegisteredFirst') return 'Registered first';
  if (id === 'withdrawalNonRegisteredFirst') return 'Non-registered first';
  if (id === 'withdrawalDefault') return 'Default order';
  return 'Withdrawal family';
}

function buildWithdrawalFamilyEvidence(
  summaries: Partial<Record<BoundedOptimizerCandidateId, ReturnType<typeof summarizeResult>>>,
  suggested: BoundedOptimizerCandidateRow | null
): BoundedOptimizerEvidenceRow[] {
  const baseline = summaries.baseline;
  const candidate = suggested ? summaries[suggested.id] : null;
  if (!baseline || !candidate || !suggested?.changedLevers.includes('withdrawalOrder') || candidate.totalYears === 0) return [];

  const fundedYearsDelta = candidate.fundedYears - baseline.fundedYears;
  const lifetimeTaxDelta = candidate.lifetimeTax - baseline.lifetimeTax;
  const firstYearTaxDelta = candidate.firstYearTax - baseline.firstYearTax;
  const peakTaxDelta = candidate.peakTax - baseline.peakTax;
  const oasDelta = candidate.lifetimeOasRecovery - baseline.lifetimeOasRecovery;
  const portfolioDelta = candidate.endPortfolio - baseline.endPortfolio;

  return [
    {
      id: 'withdrawalFamilyFirst',
      label: 'Withdrawal family to compare',
      value: withdrawalFamilyLabel(suggested.id),
      detail: 'Compares the leading broad withdrawal-order family with the current plan. This is not an annual account instruction.',
      tone: 'neutral'
    },
    {
      id: 'withdrawalFamilyFundedYears',
      label: 'Withdrawal family funded years',
      value: fundedYearsDelta === 0 ? 'No change' : `${fundedYearsDelta > 0 ? '+' : ''}${fundedYearsDelta} year${Math.abs(fundedYearsDelta) === 1 ? '' : 's'}`,
      detail: 'Compares funded projection years for the leading withdrawal family against the current plan.',
      tone: fundedYearsDelta === 0 ? 'neutral' : fundedYearsDelta > 0 ? 'ok' : 'watch'
    },
    {
      id: 'withdrawalFamilyLifetimeTax',
      label: 'Withdrawal family lifetime tax change',
      value: signedMoneyText(lifetimeTaxDelta),
      detail: 'Compares total tax for the leading broad withdrawal family against the current plan.',
      tone: evidenceTone(lifetimeTaxDelta)
    },
    {
      id: 'withdrawalFamilyFirstYearTax',
      label: 'Withdrawal family first-year tax change',
      value: signedMoneyText(firstYearTaxDelta),
      detail: 'Compares first projection-year tax for the leading broad withdrawal family against the current plan.',
      tone: evidenceTone(firstYearTaxDelta)
    },
    {
      id: 'withdrawalFamilyPeakTax',
      label: 'Withdrawal family peak tax change',
      value: signedMoneyText(peakTaxDelta),
      detail: 'Compares the highest annual tax year for the leading broad withdrawal family against the current plan.',
      tone: evidenceTone(peakTaxDelta)
    },
    {
      id: 'withdrawalFamilyOasRecovery',
      label: 'Withdrawal family OAS recovery change',
      value: signedMoneyText(oasDelta),
      detail: 'Compares OAS recovery tax for the leading broad withdrawal family against the current plan.',
      tone: evidenceTone(oasDelta)
    },
    {
      id: 'withdrawalFamilyPortfolio',
      label: 'Withdrawal family money-left change',
      value: signedMoneyText(portfolioDelta),
      detail: 'Compares projected money left for the leading broad withdrawal family against the current plan.',
      tone: evidenceTone(portfolioDelta, false)
    }
  ];
}

function buildDriverRows(
  suggested: BoundedOptimizerCandidateRow | null,
  baseline: BoundedOptimizerCandidateRow | null,
  summaries: Partial<Record<BoundedOptimizerCandidateId, ReturnType<typeof summarizeResult>>>
): BoundedOptimizerDriverRow[] {
  if (!suggested || !baseline) return [];
  const suggestedSummary = summaries[suggested.id];
  const baselineSummary = summaries.baseline;
  if (!suggestedSummary || !baselineSummary || suggestedSummary.totalYears === 0) return [];

  const fundedYearsDelta = suggestedSummary.fundedYears - baselineSummary.fundedYears;
  const lifetimeTaxDelta = suggestedSummary.lifetimeTax - baselineSummary.lifetimeTax;
  const peakTaxDelta = suggestedSummary.peakTax - baselineSummary.peakTax;
  const oasRecoveryDelta = suggestedSummary.lifetimeOasRecovery - baselineSummary.lifetimeOasRecovery;
  const portfolioDelta = suggestedSummary.endPortfolio - baselineSummary.endPortfolio;

  return [
    {
      id: 'fundedYears',
      label: 'Funded years',
      value: fundedYearsDelta === 0 ? 'No change' : `${fundedYearsDelta > 0 ? '+' : ''}${fundedYearsDelta} year${Math.abs(fundedYearsDelta) === 1 ? '' : 's'}`,
      detail: 'Compares how many projection years have spending covered.',
      tone: fundedYearsDelta === 0 ? 'neutral' : fundedYearsDelta > 0 ? 'ok' : 'watch'
    },
    {
      id: 'lifetimeTax',
      label: 'Lifetime tax',
      value: signedMoneyText(lifetimeTaxDelta),
      detail: 'Compares total tax across the projection.',
      tone: evidenceTone(lifetimeTaxDelta)
    },
    {
      id: 'peakTax',
      label: 'Peak annual tax',
      value: signedMoneyText(peakTaxDelta),
      detail: 'Compares the highest annual tax year.',
      tone: evidenceTone(peakTaxDelta)
    },
    {
      id: 'oasRecovery',
      label: 'OAS recovery tax',
      value: signedMoneyText(oasRecoveryDelta),
      detail: 'Compares OAS recovery tax across the projection.',
      tone: evidenceTone(oasRecoveryDelta)
    },
    {
      id: 'portfolio',
      label: 'Projected money left',
      value: signedMoneyText(portfolioDelta),
      detail: 'Compares projected money left at the end of the plan.',
      tone: evidenceTone(portfolioDelta, false)
    }
  ];
}

function buildCompactEvidenceRows(
  suggested: BoundedOptimizerCandidateRow | null,
  driverRows: BoundedOptimizerDriverRow[]
): BoundedOptimizerCompactEvidenceRow[] {
  if (!suggested) return [];
  const driver = (id: BoundedOptimizerDriverRow['id']) => driverRows.find((row) => row.id === id);
  const lifetimeTax = driver('lifetimeTax');
  const oasRecovery = driver('oasRecovery');
  const portfolio = driver('portfolio');

  return [
    {
      id: 'monthlySpend',
      label: 'Monthly spend reviewed',
      value: moneyText(suggested.sustainableAnnualSpend / 12),
      detail: "The first option is ranked by sustainable after-tax spending in today's dollars.",
      tone: 'neutral'
    },
    {
      id: 'fundedYears',
      label: 'Funded years',
      value: `${suggested.fundedYears}/${suggested.totalYears}`,
      detail: suggested.firstShortfallYear
        ? `First projected shortfall appears in ${suggested.firstShortfallYear}.`
        : 'No projected shortfall appears in this option.',
      tone: suggested.firstShortfallYear ? 'watch' : 'ok'
    },
    {
      id: 'moneyLeft',
      label: 'Money left change',
      value: portfolio?.value || '$0',
      detail: 'Projected money left is a trade-off to review with spending comfort.',
      tone: portfolio?.tone || 'neutral'
    },
    {
      id: 'lifetimeTax',
      label: 'Lifetime tax change',
      value: lifetimeTax?.value || '$0',
      detail: 'Tax is evidence for review, not a command to change accounts.',
      tone: lifetimeTax?.tone || 'neutral'
    },
    {
      id: 'oasRecovery',
      label: 'OAS recovery change',
      value: oasRecovery?.value || '$0',
      detail: 'OAS recovery helps explain tax pressure in the comparison.',
      tone: oasRecovery?.tone || 'neutral'
    }
  ];
}

export function selectOptimizerMinimumAnnualExpenseFloor(plan: V2PlanPayload): number {
  const phases = [plan.spending.gogo, plan.spending.slowgo, plan.spending.nogo]
    .map(n)
    .filter((value) => value > 0);
  return phases.length ? Math.min(...phases) : 0;
}

export function selectOptimizerCapacityStatus(monthlyCapacity: number | null, monthlyFloor: number | null): OptimizerCapacityStatus {
  if (monthlyCapacity === null) return 'cannotTell';
  if (monthlyFloor === null || monthlyFloor <= 0) return 'cannotTell';
  const room = monthlyCapacity - monthlyFloor;
  if (room < -1) return 'gap';
  if (room < 250) return 'tight';
  return 'covered';
}

export function selectOptimizerCapacityObjective(input: OptimizerCapacityObjectiveInput): OptimizerCapacityObjective {
  const annualFloor = input.annualExpenseFloor || 0;
  const monthlyFloor = annualFloor > 0 ? annualFloor / 12 : null;
  const monthlyCapacity = input.sustainableAnnualSpend && input.sustainableAnnualSpend > 0 ? input.sustainableAnnualSpend / 12 : null;
  const optionalRoom = monthlyCapacity !== null && monthlyFloor !== null ? Math.max(0, monthlyCapacity - monthlyFloor) : null;
  const estateTarget = input.estateTarget && input.estateTarget > 0 ? input.estateTarget : null;
  const projectedEstate = input.projectedEstate;
  const status =
    !input.contractReady
      ? 'blocked'
      : selectOptimizerCapacityStatus(monthlyCapacity, monthlyFloor);
  const estateProtected = estateTarget === null || (projectedEstate !== null && projectedEstate >= estateTarget);
  const rows: OptimizerCapacityConstraintRow[] = [
    {
      id: 'minimumFloor',
      label: 'Minimum expense floor',
      status: status === 'blocked' || status === 'cannotTell' ? 'blocked' : status === 'gap' ? 'blocked' : 'protected',
      detail:
        monthlyFloor === null
          ? 'A usable expense floor is needed before monthly capacity can be trusted.'
          : status === 'gap'
            ? 'The selected runtime result does not cover the entered expense floor.'
            : `The selected runtime result covers about ${moneyText(monthlyFloor)} per month before optional room is counted.`
    },
    {
      id: 'estate',
      label: 'Estate constraint',
      status: estateTarget === null ? 'review' : estateProtected ? 'protected' : 'blocked',
      detail:
        estateTarget === null
          ? 'No estate floor is entered, so projected money left remains a review trade-off.'
          : estateProtected
            ? `The selected runtime result preserves the entered estate target of ${moneyText(estateTarget)}.`
            : `The selected runtime result falls below the entered estate target of ${moneyText(estateTarget)}.`
    },
    {
      id: 'survivor',
      label: 'Survivor constraint',
      status: input.survivorNeedsReview ? 'review' : 'protected',
      detail: input.survivorNeedsReview
        ? 'Set a survivor scenario year before relying on optimizer choices for a two-person plan.'
        : input.hasSecondPerson
          ? 'The current survivor setup does not block this runtime capacity review.'
          : 'No second person is active in this plan.'
    },
    {
      id: 'benefitTiming',
      label: 'CPP/OAS timing comparison',
      status: input.benefitTimingStatus === 'included' ? 'protected' : 'review',
      detail:
        input.benefitTimingStatus === 'included'
          ? 'Bounded CPP/OAS timing evidence is included as a comparison, not advice.'
          : 'CPP/OAS timing comparison waits for eligible estimates and age ranges.'
    },
    {
      id: 'withdrawalSequencing',
      label: 'Annual withdrawal sequencing',
      status: 'deferred',
      detail: 'Annual account-level sequencing remains deferred; broad withdrawal-family evidence is review-only.'
    }
  ];

  return {
    status,
    selectedCandidateId: input.selectedCandidateId,
    selectedCandidateLabel: input.selectedCandidateLabel || 'No runtime capacity candidate',
    monthlyAfterTaxCapacity: monthlyCapacity,
    minimumMonthlyExpenseFloor: monthlyFloor,
    optionalMonthlyRoom: optionalRoom,
    estateTarget,
    projectedEstate,
    survivorConstraint: input.survivorNeedsReview ? 'reviewFirst' : input.hasSecondPerson ? 'protected' : 'notApplicable',
    timingComparison: input.benefitTimingStatus === 'included' ? 'included' : input.benefitTimingStatus === 'blocked' ? 'blocked' : 'deferred',
    withdrawalSequencing: 'deferred',
    rows,
    detail:
      status === 'covered'
        ? 'Runtime evidence can show after-tax monthly capacity above the protected expense floor.'
        : status === 'tight'
          ? 'Runtime evidence covers the expense floor, but optional room is narrow.'
          : status === 'gap'
            ? 'Runtime evidence shows a gap against the expense floor before optional spending is considered.'
            : status === 'blocked'
              ? 'Required inputs need review before a runtime capacity answer is available.'
              : 'Runtime evidence is not complete enough to state monthly capacity.',
    boundary: 'Capacity objective output is runtime-only; it is not saved, not a production UI contract, and not an annual account-level withdrawal instruction.'
  };
}

export function selectOptimizerCapacityReportReadiness(
  objective: OptimizerCapacityObjective
): OptimizerCapacityReportReadiness {
  const hasCapacity = objective.monthlyAfterTaxCapacity !== null && objective.minimumMonthlyExpenseFloor !== null;
  const hasConstraintRows = objective.rows.length > 0;
  const blocked = objective.status === 'blocked' || objective.status === 'cannotTell';
  const rows: OptimizerCapacityReportReadinessRow[] = [
    {
      id: 'capacitySummary',
      label: 'Capacity summary',
      status: hasCapacity && !blocked ? 'ready' : 'blocked',
      detail: hasCapacity
        ? 'Monthly capacity, expense floor, and optional room can be reused later in a printable report.'
        : 'Capacity report fields wait for a usable runtime capacity estimate and expense floor.'
    },
    {
      id: 'floorComparison',
      label: 'Floor comparison',
      status: objective.minimumMonthlyExpenseFloor !== null ? 'ready' : 'blocked',
      detail: 'The report can show floor-first capacity framing without asking for a desired-spend target.'
    },
    {
      id: 'constraintRows',
      label: 'Constraint rows',
      status: hasConstraintRows ? 'ready' : 'blocked',
      detail: 'Minimum floor, estate, survivor, CPP/OAS timing, and sequencing boundary rows are ready for later report review.'
    },
    {
      id: 'taxContext',
      label: 'Tax context',
      status: 'deferred',
      detail: 'Detailed tax schedules should come from annual result rows, not from the capacity objective packet.'
    },
    {
      id: 'savedOutput',
      label: 'Saved output',
      status: 'deferred',
      detail: 'Do not save capacity objective fields into plan files or engine output schema.'
    },
    {
      id: 'accountInstructions',
      label: 'Account instructions',
      status: 'deferred',
      detail: 'Do not turn report readiness into account-level withdrawal instructions or annual sequencing.'
    }
  ];

  return {
    status: blocked ? 'needsInputs' : 'readyForLaterReport',
    reportFields: [
      'monthlyAfterTaxCapacity',
      'minimumMonthlyExpenseFloor',
      'optionalMonthlyRoom',
      'estateTarget',
      'projectedEstate',
      'survivorConstraint',
      'timingComparison',
      'withdrawalSequencingDeferred'
    ],
    rows,
    summary: blocked
      ? 'Capacity objective report readiness waits for complete runtime capacity evidence.'
      : 'Capacity objective evidence is ready for a later printable/report path once report implementation is explicitly planned.',
    boundary:
      'Report readiness is runtime-only planning metadata. It does not change printable report output, saved plan files, engine output schema, or annual account sequencing.',
    nextStep: 'Plan report rendering separately before adding capacity objective fields to printable output.'
  };
}

export function selectOptimizerCapacityExportGuard(): OptimizerCapacityExportGuard {
  return {
    status: 'guarded',
    forbiddenSavedKeys: [
      'capacityObjective',
      'capacityReportReadiness',
      'capacityExportGuard',
      'annualSequencingPrepContract',
      'annualSequencingInputAdapter',
      'experimentalAccountOrderDraft',
      'experimentalAnnualInstructionDraft',
      'boundedOptimizer',
      'optimizerOutput',
      'annualAccountInstructions'
    ],
    rows: [
      {
        id: 'planFile',
        label: 'Editable plan file',
        status: 'blocked',
        detail: 'Capacity objective and optimizer output must not be written into saved plan files.'
      },
      {
        id: 'reportOutput',
        label: 'Printable report output',
        status: 'deferred',
        detail: 'Printable report output stays unchanged until a separate report implementation package is planned.'
      },
      {
        id: 'csvOutput',
        label: 'CSV output',
        status: 'deferred',
        detail: 'CSV exports remain annual result exports and do not add optimizer capacity packets.'
      },
      {
        id: 'schemaBoundary',
        label: 'Schema boundary',
        status: 'blocked',
        detail: 'Saved schema and engine output schema must not change for capacity objective export guards.'
      },
      {
        id: 'privateFiles',
        label: 'Private files',
        status: 'verify',
        detail: 'Verification should continue checking that no `.plan.json` files are generated by optimizer work.'
      }
    ],
    summary: 'Capacity objective export guards keep runtime optimizer packets out of saved files and export outputs.',
    boundary:
      'Export guard metadata is runtime-only. It does not write plan files, change report output, change CSV output, or create account-level instructions.'
  };
}

export function selectOptimizerAnnualSequencingPrepContract(
  capacityObjective: OptimizerCapacityObjective
): OptimizerAnnualSequencingPrepContract {
  const capacityReady = !['blocked', 'cannotTell'].includes(capacityObjective.status);
  const survivorReady = capacityObjective.survivorConstraint === 'reviewFirst' ? 'deferred' : 'ready';

  return {
    status: 'contractOnly',
    inputs: {
      capacityObjective: 'required',
      annualResultRows: 'required',
      accountBalances: 'required',
      taxContext: 'annualRowsOnly',
      estateAndSurvivorConstraints: 'required',
      benefitTimingComparison: 'boundedReviewOnly'
    },
    blockedOutputs: [
      'annualAccountInstructions',
      'accountOrder',
      'taxBracketInstructions',
      'savedSequencingOutput',
      'csvSequencingOutput'
    ],
    rows: [
      {
        id: 'capacityObjective',
        label: 'Monthly capacity objective',
        status: capacityReady ? 'ready' : 'blocked',
        detail: capacityReady
          ? 'Use the runtime capacity objective as an input to a later sequencing design.'
          : 'Do not plan annual sequencing until runtime capacity can be calculated.'
      },
      {
        id: 'annualResults',
        label: 'Annual result rows',
        status: 'ready',
        detail: 'Use existing annual result rows for tax, OAS recovery, income, spending, and balance context later.'
      },
      {
        id: 'accountBalances',
        label: 'Account balance context',
        status: 'deferred',
        detail: 'Account-level sequencing still needs a separate runtime adapter before any account-by-account review exists.'
      },
      {
        id: 'taxContext',
        label: 'Tax context',
        status: 'deferred',
        detail: 'Tax context may be read from annual result rows later, but this contract does not create tax-bracket instructions.'
      },
      {
        id: 'estateSurvivorConstraints',
        label: 'Estate and survivor constraints',
        status: survivorReady,
        detail:
          survivorReady === 'deferred'
            ? 'Survivor-sensitive plans must keep survivor review visible before any annual sequencing work is planned.'
            : 'Estate and survivor constraints remain inputs, not account-level instructions.'
      },
      {
        id: 'benefitTimingComparison',
        label: 'CPP/OAS timing comparison',
        status: capacityObjective.timingComparison === 'included' ? 'ready' : 'deferred',
        detail: 'CPP/OAS timing stays a bounded comparison input and is not converted into filing instructions.'
      },
      {
        id: 'outputBoundary',
        label: 'Output boundary',
        status: 'blocked',
        detail: 'This contract blocks annual account instructions, account order, tax-bracket instructions, saved sequencing output, and CSV sequencing output.'
      }
    ],
    summary: 'Annual sequencing prep is limited to a runtime-only input contract for a later implementation decision.',
    boundary:
      'This prep contract does not implement annual account-level sequencing, produce account instructions, change saved output, change CSV output, or change report output.',
    nextStep: 'Plan a separate annual sequencing adapter only after inputs, constraints, and consumer-facing boundaries are reviewed.'
  };
}

function availableFields<T extends string>(rows: Array<Record<string, unknown>>, fields: T[]): T[] {
  return fields.filter((field) => rows.some((row) => Number.isFinite(Number(row[field]))));
}

export function selectOptimizerAnnualSequencingInputAdapter({
  sourceCandidateId,
  sourceCandidateLabel,
  summary,
  capacityObjective,
  prepContract
}: {
  sourceCandidateId: BoundedOptimizerCandidateId | null;
  sourceCandidateLabel: string;
  summary: ReturnType<typeof summarizeResult> | null | undefined;
  capacityObjective: OptimizerCapacityObjective;
  prepContract: OptimizerAnnualSequencingPrepContract;
}): OptimizerAnnualSequencingInputAdapter {
  const rows = Array.isArray(summary?.rows) ? summary.rows : [];
  const firstYear = rows.length ? n(rows[0]?.year) : null;
  const lastYear = rows.length ? n(rows[rows.length - 1]?.year) : null;
  const accountFields = availableFields(rows as Array<Record<string, unknown>>, [
    'bal_rrsp',
    'bal_rrsp_f',
    'bal_rrsp_m',
    'bal_tfsa',
    'bal_lif',
    'bal_nonreg',
    'bal_cash',
    'bal_total'
  ]);
  const taxFields = availableFields(rows as Array<Record<string, unknown>>, ['totalTaxYear', 'taxableIncome', 'totalOasClawY', 'totalAftaxYear']);
  const constraintInputs: OptimizerAnnualSequencingInputAdapter['constraintInputs'] = ['minimumExpenseFloor'];
  if (capacityObjective.estateTarget !== null) constraintInputs.push('estateTarget');
  if (capacityObjective.survivorConstraint === 'reviewFirst') constraintInputs.push('survivorReview');
  if (capacityObjective.timingComparison === 'included') constraintInputs.push('benefitTimingComparison');

  const hasAnnualRows = rows.length > 0;
  const hasAccountContext = accountFields.includes('bal_total') && accountFields.length >= 2;
  const hasTaxContext = taxFields.includes('totalTaxYear') && taxFields.includes('totalAftaxYear');
  const prepBlocked = prepContract.rows.some((row) => row.id === 'outputBoundary' && row.status === 'blocked');
  const status: OptimizerAnnualSequencingInputAdapter['status'] =
    hasAnnualRows && hasAccountContext && hasTaxContext && !['blocked', 'cannotTell'].includes(capacityObjective.status)
      ? 'readyForDraftPlanning'
      : prepBlocked && hasAnnualRows
        ? 'needsInputs'
        : 'blocked';

  return {
    status,
    sourceCandidateId,
    sourceCandidateLabel: sourceCandidateLabel || 'No modelled candidate selected',
    yearRange: {
      firstYear,
      lastYear,
      yearCount: rows.length
    },
    availableAccountBalanceFields: accountFields,
    availableTaxFields: taxFields,
    constraintInputs,
    rows: [
      {
        id: 'annualRows',
        label: 'Annual result rows',
        status: hasAnnualRows ? 'ready' : 'blocked',
        detail: hasAnnualRows
          ? `Annual context is available from ${firstYear ?? 'the first modelled year'} to ${lastYear ?? 'the last modelled year'}.`
          : 'No annual result rows are available for sequencing draft planning.'
      },
      {
        id: 'accountBalances',
        label: 'Account balance fields',
        status: hasAccountContext ? 'ready' : accountFields.length ? 'partial' : 'blocked',
        detail: hasAccountContext
          ? 'Annual balance fields are available for draft planning context, including total balance and at least one account balance field.'
          : 'More account balance context is needed before draft account-order planning.'
      },
      {
        id: 'taxContext',
        label: 'Tax context fields',
        status: hasTaxContext ? 'ready' : taxFields.length ? 'partial' : 'blocked',
        detail: hasTaxContext
          ? 'Annual tax and after-tax fields are available as context, not as tax-bracket instructions.'
          : 'Tax context is incomplete for draft sequencing planning.'
      },
      {
        id: 'capacityObjective',
        label: 'Capacity objective',
        status: ['blocked', 'cannotTell'].includes(capacityObjective.status) ? 'blocked' : 'ready',
        detail: 'The adapter uses the runtime monthly capacity objective as context for later draft planning.'
      },
      {
        id: 'constraints',
        label: 'Constraint hooks',
        status: constraintInputs.includes('survivorReview') ? 'partial' : 'ready',
        detail: constraintInputs.includes('survivorReview')
          ? 'Survivor review remains visible and must be handled before draft instructions are trusted.'
          : 'Minimum expense floor, estate, and benefit timing constraints remain context inputs.'
      },
      {
        id: 'outputBoundary',
        label: 'Output boundary',
        status: 'blocked',
        detail: 'This adapter does not produce account order, annual account instructions, tax-bracket instructions, saved sequencing output, or CSV sequencing output.'
      }
    ],
    summary:
      status === 'readyForDraftPlanning'
        ? 'Annual sequencing inputs are available for a later experimental modelled plan draft.'
        : 'Annual sequencing inputs need more review before a modelled plan draft can be produced.',
    boundary:
      'This runtime input adapter gathers annual context only. It does not produce account order, annual account instructions, tax-bracket instructions, saved output, CSV output, or report output.',
    nextStep: 'Plan an experimental account-order draft for synthetic tester scenarios only.'
  };
}

function buildDraftOrderFromCandidate(
  sourceCandidateId: BoundedOptimizerCandidateId | null,
  availableFields: OptimizerAnnualSequencingInputAdapter['availableAccountBalanceFields']
): OptimizerExperimentalAccountBucket[] {
  const has = (field: OptimizerAnnualSequencingInputAdapter['availableAccountBalanceFields'][number]) => availableFields.includes(field);
  const registered: OptimizerExperimentalAccountBucket[] = has('bal_rrsp') || has('bal_rrsp_f') || has('bal_rrsp_m') ? ['registered'] : [];
  const lif: OptimizerExperimentalAccountBucket[] = has('bal_lif') ? ['lif'] : [];
  const nonRegistered: OptimizerExperimentalAccountBucket[] = has('bal_nonreg') ? ['nonRegistered'] : [];
  const tfsa: OptimizerExperimentalAccountBucket[] = has('bal_tfsa') ? ['tfsa'] : [];
  const cash: OptimizerExperimentalAccountBucket[] = has('bal_cash') ? ['cash'] : [];

  if (sourceCandidateId === 'withdrawalNonRegisteredFirst') {
    return [...nonRegistered, ...registered, ...lif, ...tfsa, ...cash];
  }
  if (sourceCandidateId === 'withdrawalRegisteredFirst') {
    return [...registered, ...lif, ...nonRegistered, ...tfsa, ...cash];
  }
  return [...registered, ...lif, ...nonRegistered, ...tfsa, ...cash];
}

function accountBucketLabel(bucket: OptimizerExperimentalAccountBucket): string {
  switch (bucket) {
    case 'registered':
      return 'Registered accounts';
    case 'lif':
      return 'LIF accounts';
    case 'nonRegistered':
      return 'Non-registered accounts';
    case 'tfsa':
      return 'TFSA accounts';
    case 'cash':
      return 'Cash reserve';
  }
}

export function selectOptimizerExperimentalAccountOrderDraft(
  adapter: OptimizerAnnualSequencingInputAdapter
): OptimizerExperimentalAccountOrderDraft {
  const order = adapter.status === 'readyForDraftPlanning' ? buildDraftOrderFromCandidate(adapter.sourceCandidateId, adapter.availableAccountBalanceFields) : [];
  const hasOrder = order.length > 0;
  const status: OptimizerExperimentalAccountOrderDraft['status'] =
    adapter.status === 'readyForDraftPlanning' && hasOrder ? 'draftReady' : adapter.status === 'blocked' ? 'blocked' : 'needsInputs';

  return {
    status,
    audience: 'syntheticTesterOnly',
    sourceCandidateId: adapter.sourceCandidateId,
    sourceCandidateLabel: adapter.sourceCandidateLabel,
    order,
    rows: order.map((bucket, index) => ({
      bucket,
      label: accountBucketLabel(bucket),
      position: index + 1,
      status: 'included',
      rationale:
        adapter.sourceCandidateId === 'withdrawalNonRegisteredFirst'
          ? 'Included because the selected modelled candidate tested non-registered withdrawals earlier.'
          : adapter.sourceCandidateId === 'withdrawalRegisteredFirst'
            ? 'Included because the selected modelled candidate tested registered withdrawals earlier.'
            : 'Included as a neutral draft order based on available account balance context.'
    })),
    blockedOutputs: ['annualDollarInstructions', 'savedAccountOrder', 'csvAccountOrder', 'reportAccountOrder', 'taxBracketInstructions'],
    summary:
      status === 'draftReady'
        ? 'Experimental account-order draft is available for synthetic tester review.'
        : 'Experimental account-order draft needs more runtime inputs before tester review.',
    boundary:
      'This is a runtime-only experimental account-order draft for synthetic tester scenarios. It does not produce annual dollar instructions, saved output, CSV output, report output, or tax-bracket instructions.',
    nextStep: 'Use this order as context for a later experimental annual instruction draft.'
  };
}

function withdrawalFieldLabel(field: string): string {
  switch (field) {
    case 'rrif_draw_f + rrif_draw_m':
      return 'registered withdrawal fields';
    case 'lif_draw':
      return 'LIF withdrawal field';
    case 'tfsa_draw':
      return 'TFSA withdrawal field';
    case 'nonreg_draw':
      return 'non-registered withdrawal field';
    case 'cash_draw':
      return 'cash withdrawal field';
    default:
      return 'modelled withdrawal field';
  }
}

function buildAnnualDraftRowRationale({
  year,
  label,
  amount,
  sourceField,
  accountOrderPosition,
  yearAccountIndex,
  yearWithdrawalCount,
  taxContextAvailable
}: {
  year: number;
  label: string;
  amount: number;
  sourceField: string;
  accountOrderPosition: number | null;
  yearAccountIndex: number;
  yearWithdrawalCount: number;
  taxContextAvailable: boolean;
}): string {
  const orderDetail = accountOrderPosition === null ? 'outside the current draft account order' : `draft account-order position ${accountOrderPosition}`;
  const groupDetail =
    accountOrderPosition === null
      ? `row ${yearAccountIndex} of ${yearWithdrawalCount} for that year`
      : `row ${yearAccountIndex} of ${yearWithdrawalCount} for that year`;
  const taxDetail = taxContextAvailable
    ? 'with after-tax spending and tax context attached for review'
    : 'with limited tax context attached for review';
  return `For ${year}, this runtime draft mirrors the selected candidate ${withdrawalFieldLabel(sourceField)} for ${label}: $${Math.round(amount).toLocaleString()}, shown as ${groupDetail} at ${orderDetail}, ${taxDetail}.`;
}

function rowDraftWithdrawals(row: Record<string, unknown>): Array<{ account: OptimizerExperimentalAccountBucket; amount: number; sourceField: string }> {
  const registeredAmount = n(row.rrif_draw_f) + n(row.rrif_draw_m);
  const draftRows: Array<{ account: OptimizerExperimentalAccountBucket; amount: number; sourceField: string }> = [
    { account: 'registered', amount: registeredAmount, sourceField: 'rrif_draw_f + rrif_draw_m' },
    { account: 'lif', amount: n(row.lif_draw), sourceField: 'lif_draw' },
    { account: 'tfsa', amount: n(row.tfsa_draw), sourceField: 'tfsa_draw' },
    { account: 'nonRegistered', amount: n(row.nonreg_draw), sourceField: 'nonreg_draw' },
    { account: 'cash', amount: n(row.cash_draw), sourceField: 'cash_draw' }
  ];
  return draftRows.filter((item) => item.amount > 1);
}

function effectiveTaxRatePct(row: Record<string, unknown>): number | null {
  const taxableIncome = n(row.taxableIncome);
  if (taxableIncome <= 0) return null;
  return Math.round((n(row.totalTaxYear) / taxableIncome) * 1000) / 10;
}

function buildExperimentalDraftTaxContextRows(
  annualRows: Array<Record<string, unknown>>,
  draftRows: OptimizerExperimentalAnnualInstructionDraftRow[]
): OptimizerExperimentalDraftTaxContextRow[] {
  const taxes = annualRows.map((row) => n(row.totalTaxYear)).filter((value) => value > 0);
  const afterTax = annualRows.map((row) => n(row.totalAftaxYear)).filter((value) => value > 0);
  const effectiveRates = annualRows.map(effectiveTaxRatePct).filter((value): value is number => value !== null);
  const oasRecoveryYears = annualRows.filter((row) => n(row.totalOasClawY) > 1).map((row) => n(row.year));
  return [
    {
      id: 'taxRange',
      label: 'Tax range',
      status: 'context',
      detail: taxes.length
        ? `Modelled annual tax in the draft window ranges from $${Math.min(...taxes).toLocaleString()} to $${Math.max(...taxes).toLocaleString()}.`
        : 'Modelled annual tax is not available in the draft window.'
    },
    {
      id: 'oasRecovery',
      label: 'OAS recovery',
      status: oasRecoveryYears.length ? 'watch' : 'context',
      detail: oasRecoveryYears.length
        ? `OAS recovery appears in ${oasRecoveryYears.length} draft-window year${oasRecoveryYears.length === 1 ? '' : 's'}; review those years as context.`
        : 'No OAS recovery appears in the draft window.'
    },
    {
      id: 'afterTaxSpending',
      label: 'After-tax spending',
      status: 'context',
      detail: afterTax.length
        ? `Modelled after-tax spending in the draft window ranges from $${Math.min(...afterTax).toLocaleString()} to $${Math.max(...afterTax).toLocaleString()}.`
        : 'Modelled after-tax spending is not available in the draft window.'
    },
    {
      id: 'effectiveRate',
      label: 'Effective tax rate',
      status: 'context',
      detail: effectiveRates.length
        ? `Approximate effective tax rates in the draft window range from ${Math.min(...effectiveRates).toFixed(1)}% to ${Math.max(...effectiveRates).toFixed(1)}%.`
        : 'Effective tax rate context is unavailable because taxable income is missing.'
    },
    {
      id: 'boundary',
      label: 'Tax boundary',
      status: 'blocked',
      detail: `Tax context explains ${draftRows.length} experimental draft row${draftRows.length === 1 ? '' : 's'} without creating tax-bracket instructions.`
    }
  ];
}

function buildExperimentalDraftConfidence({
  adapter,
  accountOrderDraft,
  draftRows,
  taxContextRows
}: {
  adapter: OptimizerAnnualSequencingInputAdapter;
  accountOrderDraft: OptimizerExperimentalAccountOrderDraft;
  draftRows: OptimizerExperimentalAnnualInstructionDraftRow[];
  taxContextRows: OptimizerExperimentalDraftTaxContextRow[];
}): OptimizerExperimentalDraftConfidence {
  const rows: OptimizerExperimentalDraftConfidenceRow[] = [
    {
      id: 'draftRows',
      label: 'Draft row coverage',
      status: draftRows.length >= 3 ? 'pass' : draftRows.length > 0 ? 'watch' : 'block',
      detail:
        draftRows.length >= 3
          ? `${draftRows.length} experimental draft rows are available in the first modelled window.`
          : draftRows.length > 0
            ? 'Only a small number of experimental draft rows are available.'
            : 'No experimental draft rows are available.'
    },
    {
      id: 'taxContext',
      label: 'Tax context coverage',
      status: taxContextRows.some((row) => row.id === 'effectiveRate') && taxContextRows.some((row) => row.id === 'afterTaxSpending') ? 'pass' : 'watch',
      detail: 'Draft includes tax range, effective rate, OAS recovery, and after-tax spending context when annual fields are present.'
    },
    {
      id: 'accountOrder',
      label: 'Account order source',
      status: accountOrderDraft.status === 'draftReady' ? 'pass' : accountOrderDraft.status === 'needsInputs' ? 'watch' : 'block',
      detail:
        accountOrderDraft.status === 'draftReady'
          ? 'Account order is tied to the selected modelled candidate and available balance fields.'
          : 'Account order draft needs more runtime inputs.'
    },
    {
      id: 'constraintCoverage',
      label: 'Constraint hooks',
      status: adapter.constraintInputs.includes('minimumExpenseFloor') ? 'pass' : 'block',
      detail: `Constraint inputs available: ${adapter.constraintInputs.join(', ') || 'none'}.`
    },
    {
      id: 'survivorReview',
      label: 'Survivor review',
      status: adapter.constraintInputs.includes('survivorReview') ? 'watch' : 'pass',
      detail: adapter.constraintInputs.includes('survivorReview')
        ? 'Survivor-sensitive scenario should be reviewed before relying on draft rows.'
        : 'No survivor-specific review flag is attached to this draft.'
    },
    {
      id: 'outputBoundary',
      label: 'Output boundary',
      status: 'pass',
      detail: 'Draft remains runtime-only and is not saved, exported, printed, or promoted to production UI.'
    }
  ];
  const blockers = rows.filter((row) => row.status === 'block').map((row) => row.label);
  const watchCount = rows.filter((row) => row.status === 'watch').length;
  const score = Math.max(0, rows.reduce((sum, row) => sum + (row.status === 'pass' ? 2 : row.status === 'watch' ? 1 : 0), 0));
  const level: OptimizerExperimentalDraftConfidenceLevel = blockers.length
    ? 'blocked'
    : score >= 11
      ? 'higher'
      : watchCount <= 2
        ? 'medium'
        : 'low';

  return {
    level,
    score,
    rows,
    blockers,
    summary:
      level === 'higher'
        ? 'Draft confidence is higher for synthetic tester review, with runtime-only boundaries still in place.'
        : level === 'medium'
          ? 'Draft confidence is medium; review watch items before relying on the modelled draft.'
          : level === 'low'
            ? 'Draft confidence is low; more runtime evidence is needed before tester review.'
            : 'Draft confidence is blocked until required runtime evidence is available.'
  };
}

function buildExperimentalDraftHarmChecks({
  adapter,
  summary,
  taxContextRows,
  confidence
}: {
  adapter: OptimizerAnnualSequencingInputAdapter;
  summary: ReturnType<typeof summarizeResult> | null | undefined;
  taxContextRows: OptimizerExperimentalDraftTaxContextRow[];
  confidence: OptimizerExperimentalDraftConfidence;
}): OptimizerExperimentalDraftHarmCheckRow[] {
  const oasWatch = taxContextRows.find((row) => row.id === 'oasRecovery')?.status === 'watch';
  const taxContextUnavailable = taxContextRows.some((row) => row.detail.toLowerCase().includes('unavailable'));
  return [
    {
      id: 'shortfall',
      label: 'Projected shortfall',
      status: summary?.firstShortfallYear ? 'block' : 'pass',
      detail: summary?.firstShortfallYear
        ? `First projected shortfall appears in ${summary.firstShortfallYear}; do not rely on draft rows without repair.`
        : 'No projected shortfall appears in the selected modelled candidate.'
    },
    {
      id: 'estatePressure',
      label: 'Estate pressure',
      status: adapter.constraintInputs.includes('estateTarget') && summary && summary.endPortfolio <= 0 ? 'watch' : 'pass',
      detail: adapter.constraintInputs.includes('estateTarget')
        ? 'Estate target is present as a constraint hook; review end portfolio before relying on draft rows.'
        : 'No entered estate target is attached to this draft.'
    },
    {
      id: 'survivorReview',
      label: 'Survivor review',
      status: adapter.constraintInputs.includes('survivorReview') ? 'watch' : 'pass',
      detail: adapter.constraintInputs.includes('survivorReview')
        ? 'Survivor-sensitive scenario should be reviewed before draft rows are treated as usable.'
        : 'No survivor review flag is attached to this draft.'
    },
    {
      id: 'oasRecovery',
      label: 'OAS recovery watch',
      status: oasWatch ? 'watch' : 'pass',
      detail: oasWatch ? 'OAS recovery appears in the draft window and should be reviewed as a trade-off.' : 'No OAS recovery appears in the draft window.'
    },
    {
      id: 'taxContext',
      label: 'Tax context availability',
      status: taxContextUnavailable ? 'watch' : 'pass',
      detail: taxContextUnavailable
        ? 'Some tax context is unavailable in the draft window.'
        : 'Tax context is available for draft-window review without bracket instructions.'
    },
    {
      id: 'outputBoundary',
      label: 'Output boundary',
      status: confidence.level === 'blocked' ? 'block' : 'pass',
      detail: 'Draft remains runtime-only and is not saved, exported, printed, or promoted to production UI.'
    }
  ];
}

function buildExperimentalDraftReadinessSummary({
  yearCount,
  draftRows,
  taxContextRows,
  confidence,
  harmChecks
}: {
  yearCount: number;
  draftRows: OptimizerExperimentalAnnualInstructionDraftRow[];
  taxContextRows: OptimizerExperimentalDraftTaxContextRow[];
  confidence: OptimizerExperimentalDraftConfidence;
  harmChecks: OptimizerExperimentalDraftHarmCheckRow[];
}): OptimizerExperimentalDraftReadinessSummary {
  const blockers = [...confidence.blockers, ...harmChecks.filter((row) => row.status === 'block').map((row) => row.label)];
  const watchItems = [
    ...confidence.rows.filter((row) => row.status === 'watch').map((row) => row.label),
    ...harmChecks.filter((row) => row.status === 'watch').map((row) => row.label)
  ];
  const taxContext = taxContextRows.some((row) => row.detail.toLowerCase().includes('unavailable')) ? 'partial' : 'available';
  const status: OptimizerExperimentalDraftReadinessSummary['status'] = blockers.length
    ? 'blocked'
    : confidence.level === 'higher' && watchItems.length <= 1
      ? 'readyForTesterReview'
      : 'reviewFirst';

  return {
    status,
    headline:
      status === 'readyForTesterReview'
        ? 'Experimental draft is ready for synthetic tester review.'
        : status === 'reviewFirst'
          ? 'Experimental draft needs review before tester use.'
          : 'Experimental draft is blocked until required evidence is repaired.',
    rowCoverage: {
      draftRows: draftRows.length,
      modelledYears: yearCount
    },
    confidenceLevel: confidence.level,
    blockerCount: blockers.length,
    watchCount: watchItems.length,
    taxContext,
    reviewItems: [...new Set([...blockers, ...watchItems])],
    boundary:
      'Readiness summary is runtime-only for synthetic tester scenarios. It does not save, export, print, or promote draft rows to production UI.',
    nextStep:
      status === 'readyForTesterReview'
        ? 'Use synthetic scenarios to review whether the draft rows feel understandable and useful.'
        : 'Repair blockers and review watch items before considering tester-facing presentation.'
  };
}

function buildRuntimeAnnualInstructionDraftGeneratorScope({
  status,
  rows,
  annualAccountTotals,
  accountOrderDraft,
  taxContextRows,
  readinessSummary
}: {
  status: OptimizerExperimentalAnnualInstructionDraft['status'];
  rows: OptimizerExperimentalAnnualInstructionDraftRow[];
  annualAccountTotals: OptimizerExperimentalAnnualAccountTotal[];
  accountOrderDraft: OptimizerExperimentalAccountOrderDraft;
  taxContextRows: OptimizerExperimentalDraftTaxContextRow[];
  readinessSummary: OptimizerExperimentalDraftReadinessSummary;
}): OptimizerRuntimeAnnualInstructionDraftGeneratorScope {
  const hasDraftRows = rows.length > 0;
  const hasAnnualTotals = annualAccountTotals.length > 0;
  const orderReady = accountOrderDraft.status === 'draftReady' && accountOrderDraft.rows.some((row) => row.status === 'included');
  const taxContextReady = taxContextRows.some((row) => row.id === 'afterTaxSpending' && row.status !== 'blocked');
  const blocked = status === 'blocked' || !hasDraftRows;
  const review = !blocked && (readinessSummary.status !== 'readyForTesterReview' || !hasAnnualTotals || !orderReady || !taxContextReady);
  const scopeStatus: OptimizerRuntimeAnnualInstructionDraftGeneratorScope['status'] = blocked
    ? 'blocked'
    : review
      ? 'reviewFirst'
      : 'readyForRuntimeDraft';
  const scopeRows: OptimizerRuntimeAnnualInstructionDraftGeneratorScope['rows'] = [
    {
      id: 'sourceRows',
      label: 'Selected-candidate annual rows',
      status: hasDraftRows ? 'ready' : 'blocked',
      detail: hasDraftRows
        ? `${rows.length} runtime draft row${rows.length === 1 ? '' : 's'} are available from the selected candidate.`
        : 'Runtime draft generator waits for selected-candidate annual withdrawal rows.'
    },
    {
      id: 'annualTotals',
      label: 'Annual account totals',
      status: hasAnnualTotals ? 'ready' : 'blocked',
      detail: hasAnnualTotals
        ? `${annualAccountTotals.length} annual total${annualAccountTotals.length === 1 ? '' : 's'} can group account-level review rows.`
        : 'Annual totals are required before a runtime annual draft can be shown.'
    },
    {
      id: 'accountOrder',
      label: 'Account-order evidence',
      status: orderReady ? 'ready' : 'review',
      detail: orderReady
        ? 'Runtime draft rows can cite draft account-order positions from the selected candidate.'
        : 'Account-order evidence needs review before draft rows can be treated as ready.'
    },
    {
      id: 'taxContext',
      label: 'Tax context',
      status: taxContextReady ? 'ready' : 'review',
      detail: taxContextReady
        ? 'Runtime draft rows can show compact tax context without issuing tax-bracket instructions.'
        : 'Tax context remains partial and needs review before widening tester presentation.'
    },
    {
      id: 'outputBoundary',
      label: 'Output boundary',
      status: 'blocked',
      detail: 'Runtime draft generation does not save sequencing, export CSV, change reports, promote production UI, change schemas, or create final instructions.'
    }
  ];

  return {
    status: scopeStatus,
    allowedSources: ['selectedCandidateAnnualRows', 'annualAccountTotals', 'accountOrderDraft', 'taxContextRows', 'readinessSummary'],
    rows: scopeRows,
    blockedOutputs: [
      'savedSequencingOutput',
      'csvSequencingOutput',
      'reportOutput',
      'productionUi',
      'taxBracketInstructions',
      'finalAnnualInstructions',
      'schemaChanges'
    ],
    summary:
      scopeStatus === 'readyForRuntimeDraft'
        ? 'Runtime annual draft generation is ready for synthetic scenario review.'
        : scopeStatus === 'reviewFirst'
          ? 'Runtime annual draft generation needs review before broader tester presentation.'
          : 'Runtime annual draft generation is blocked until source rows are available.',
    boundary:
      'Runtime draft generator scope is not saved, exported, printed, promoted to production UI, framed as tax-bracket instructions, or added to saved schemas.',
    nextStep: 'Use this scope to move from static mock rows toward runtime-only annual draft rows for synthetic scenarios.'
  };
}

function buildExperimentalAnnualAccountTotals(
  rows: OptimizerExperimentalAnnualInstructionDraftRow[]
): OptimizerExperimentalAnnualAccountTotal[] {
  const grouped = new Map<number, OptimizerExperimentalAnnualInstructionDraftRow[]>();
  for (const row of rows) {
    grouped.set(row.year, [...(grouped.get(row.year) || []), row]);
  }

  return [...grouped.entries()]
    .sort(([yearA], [yearB]) => yearA - yearB)
    .map(([year, yearRows]) => {
      const orderedRows = [...yearRows].sort((a, b) => a.grouping.yearAccountIndex - b.grouping.yearAccountIndex);
      const activePositions = orderedRows
        .map((row) => row.source.accountOrderPosition)
        .filter((position): position is number => position !== null)
        .sort((a, b) => a - b);
      const highestPosition = activePositions.length ? Math.max(...activePositions) : 0;
      const skippedPositions = activePositions.length
        ? Array.from({ length: highestPosition }, (_, index) => index + 1).filter((position) => !activePositions.includes(position))
        : [];
      const orderStatus: OptimizerExperimentalAnnualAccountTotal['accountOrder']['status'] = orderedRows.some((row) => row.source.accountOrderPosition === null)
        ? 'partial'
        : skippedPositions.length
          ? 'gapped'
          : 'contiguous';
      return {
        year,
        totalAmount: orderedRows.reduce((sum, row) => sum + row.amount, 0),
        accountCount: orderedRows.length,
        accountOrder: {
          status: orderStatus,
          activePositions,
          skippedPositions,
          detail:
            orderStatus === 'contiguous'
              ? 'Active annual accounts are contiguous in the draft account order.'
              : orderStatus === 'gapped'
                ? `Active annual accounts skip draft account-order position${skippedPositions.length === 1 ? '' : 's'} ${skippedPositions.join(', ')} because those account buckets have no modelled withdrawal in this year.`
                : 'Some active annual accounts do not have draft account-order position evidence.'
        },
        accounts: orderedRows.map((row) => ({
          account: row.account,
          label: row.label,
          amount: row.amount,
          accountOrderPosition: row.source.accountOrderPosition
        })),
        taxContext: {
          totalTaxYear: orderedRows[0]?.taxContext.totalTaxYear || 0,
          afterTaxSpending: orderedRows[0]?.taxContext.afterTaxSpending || 0,
          oasRecovery: orderedRows[0]?.taxContext.oasRecovery || 0
        }
      };
    });
}

function buildExperimentalAnnualInstructionReadiness({
  rows,
  annualAccountTotals
}: {
  rows: OptimizerExperimentalAnnualInstructionDraftRow[];
  annualAccountTotals: OptimizerExperimentalAnnualAccountTotal[];
}): OptimizerExperimentalAnnualInstructionReadiness {
  const missingOrderRows = rows.filter((row) => row.source.accountOrderPosition === null);
  const gappedAnnualTotals = annualAccountTotals.filter((total) => total.accountOrder.status === 'gapped');
  const partialAnnualTotals = annualAccountTotals.filter((total) => total.accountOrder.status === 'partial');
  const yearsWithoutTotals = annualAccountTotals.filter((total) => total.totalAmount <= 0).map((total) => total.year);
  const yearsWithoutTaxContext = annualAccountTotals
    .filter((total) => total.taxContext.afterTaxSpending <= 0 && total.taxContext.totalTaxYear <= 0)
    .map((total) => total.year);
  const rowsForQuality: OptimizerExperimentalAnnualInstructionReadiness['rows'] = [
    {
      id: 'yearTotals',
      label: 'Annual account totals',
      status: annualAccountTotals.length && yearsWithoutTotals.length === 0 ? 'pass' : annualAccountTotals.length ? 'watch' : 'block',
      detail: annualAccountTotals.length
        ? `${annualAccountTotals.length} modelled year${annualAccountTotals.length === 1 ? '' : 's'} have runtime annual account totals for review.`
        : 'No runtime annual account totals are available for review.'
    },
    {
      id: 'accountOrderConsistency',
      label: 'Account order consistency',
      status: missingOrderRows.length ? 'watch' : rows.length ? 'pass' : 'block',
      detail: missingOrderRows.length
        ? `${missingOrderRows.length} draft row${missingOrderRows.length === 1 ? '' : 's'} do not have an account-order position.`
        : 'Draft rows retain account-order position evidence where annual account totals are available.'
    },
    {
      id: 'accountOrderGaps',
      label: 'Account order gaps',
      status: partialAnnualTotals.length ? 'watch' : gappedAnnualTotals.length ? 'watch' : annualAccountTotals.length ? 'pass' : 'block',
      detail: partialAnnualTotals.length
        ? `${partialAnnualTotals.length} annual total${partialAnnualTotals.length === 1 ? '' : 's'} have partial account-order evidence.`
        : gappedAnnualTotals.length
          ? `${gappedAnnualTotals.length} annual total${gappedAnnualTotals.length === 1 ? '' : 's'} skip inactive draft account-order positions.`
          : 'Active annual accounts are contiguous within the draft account order for reviewed years.'
    },
    {
      id: 'taxContext',
      label: 'Annual tax context',
      status: yearsWithoutTaxContext.length ? 'watch' : annualAccountTotals.length ? 'pass' : 'block',
      detail: yearsWithoutTaxContext.length
        ? `Tax context is limited for ${yearsWithoutTaxContext.length} annual total${yearsWithoutTaxContext.length === 1 ? '' : 's'}.`
        : 'Annual account totals carry after-tax spending, annual tax, and OAS recovery context for review.'
    },
    {
      id: 'outputBoundary',
      label: 'Output boundary',
      status: 'pass',
      detail: 'Readiness supports runtime review only and does not create saved, CSV, report, production UI, or tax-bracket instruction output.'
    }
  ];
  const blocked = rowsForQuality.some((row) => row.status === 'block');
  const watch = rowsForQuality.some((row) => row.status === 'watch');
  const status: OptimizerExperimentalAnnualInstructionReadiness['status'] = blocked ? 'blocked' : watch ? 'reviewFirst' : 'readyForReview';

  return {
    status,
    rows: rowsForQuality,
    totalDraftAmount: annualAccountTotals.reduce((sum, total) => sum + total.totalAmount, 0),
    yearCount: annualAccountTotals.length,
    blockedOutputs: ['annualAccountInstructions', 'savedInstructionOutput', 'csvInstructionOutput', 'reportInstructionOutput', 'taxBracketInstructions', 'productionUi'],
    summary:
      status === 'readyForReview'
        ? 'Runtime annual account totals are ready for synthetic tester review.'
        : status === 'reviewFirst'
          ? 'Runtime annual account totals need review before tester presentation.'
          : 'Runtime annual account totals are blocked until draft rows are available.',
    boundary:
      'Instruction readiness is runtime-only. It does not save annual account instructions, export CSV sequencing output, change reports, change production UI, or create tax-bracket instructions.',
    nextStep: 'Review annual account totals and account-order consistency before planning saved sequencing output or CSV sequencing output.'
  };
}

function buildExperimentalAnnualInstructionCandidates(
  annualAccountTotals: OptimizerExperimentalAnnualAccountTotal[]
): OptimizerExperimentalAnnualInstructionCandidate[] {
  return annualAccountTotals.map((total) => {
    const reviewFlags: OptimizerExperimentalAnnualInstructionCandidate['reviewFlags'] = [];
    if (total.accountOrder.status === 'gapped') reviewFlags.push('accountOrderGap');
    if (total.accountOrder.status === 'partial') reviewFlags.push('partialAccountOrder');
    if (total.taxContext.afterTaxSpending <= 0 && total.taxContext.totalTaxYear <= 0) reviewFlags.push('limitedTaxContext');
    const status: OptimizerExperimentalAnnualInstructionCandidate['status'] =
      total.totalAmount <= 0 ? 'blocked' : reviewFlags.length ? 'reviewFirst' : 'readyForReview';
    const qualityRows: OptimizerExperimentalAnnualInstructionCandidate['quality']['rows'] = [
      {
        id: 'annualTotal',
        label: 'Annual total',
        status: total.totalAmount > 0 ? 'pass' : 'block',
        detail: total.totalAmount > 0 ? 'Annual account total is available for review.' : 'Annual account total is missing.'
      },
      {
        id: 'accountOrder',
        label: 'Account order',
        status: total.accountOrder.status === 'contiguous' ? 'pass' : 'watch',
        detail: total.accountOrder.detail
      },
      {
        id: 'taxContext',
        label: 'Tax context',
        status: reviewFlags.includes('limitedTaxContext') ? 'watch' : 'pass',
        detail: reviewFlags.includes('limitedTaxContext')
          ? 'Tax context is limited for this annual candidate.'
          : 'Annual tax and after-tax spending context are available for review.'
      },
      {
        id: 'outputBoundary',
        label: 'Output boundary',
        status: 'pass',
        detail: 'Candidate quality is runtime-only and does not create saved, CSV, report, production UI, or tax-bracket instruction output.'
      }
    ];
    const qualityScore = qualityRows.reduce((sum, row) => sum + (row.status === 'pass' ? 2 : row.status === 'watch' ? 1 : 0), 0);
    const qualityLevel: OptimizerExperimentalAnnualInstructionCandidate['quality']['level'] = qualityRows.some((row) => row.status === 'block')
      ? 'blocked'
      : qualityScore >= 8
        ? 'higher'
        : qualityScore >= 6
          ? 'medium'
          : 'low';
    const repairTargets: OptimizerExperimentalAnnualInstructionCandidate['quality']['repairTargets'] = [
      {
        id: 'missingAnnualTotal',
        label: 'Missing annual total',
        status: total.totalAmount > 0 ? 'pass' : 'repair',
        detail: total.totalAmount > 0 ? 'Annual total repair is not needed.' : 'Repair annual account total evidence before tester review.'
      },
      {
        id: 'accountOrderGap',
        label: 'Account order gap',
        status: reviewFlags.includes('accountOrderGap') ? 'repair' : 'pass',
        detail: reviewFlags.includes('accountOrderGap')
          ? 'Review skipped inactive account-order positions before treating this candidate as ready.'
          : 'No account-order gap repair is needed.'
      },
      {
        id: 'partialAccountOrder',
        label: 'Partial account order',
        status: reviewFlags.includes('partialAccountOrder') ? 'repair' : 'pass',
        detail: reviewFlags.includes('partialAccountOrder')
          ? 'Repair missing account-order position evidence before tester review.'
          : 'No partial account-order repair is needed.'
      },
      {
        id: 'limitedTaxContext',
        label: 'Limited tax context',
        status: reviewFlags.includes('limitedTaxContext') ? 'repair' : 'pass',
        detail: reviewFlags.includes('limitedTaxContext')
          ? 'Improve annual tax and after-tax context before tester review.'
          : 'No limited tax-context repair is needed.'
      }
    ];

    return {
      year: total.year,
      status,
      totalAmount: total.totalAmount,
      accountCount: total.accountCount,
      accounts: total.accounts.map((account, index) => ({
        ...account,
        displayOrder: index + 1
      })),
      reviewFlags,
      quality: {
        level: qualityLevel,
        score: qualityScore,
        rows: qualityRows,
        repairTargets
      },
      summary:
        status === 'readyForReview'
          ? `Runtime annual instruction candidate for ${total.year} is ready for synthetic tester review.`
          : status === 'reviewFirst'
            ? `Runtime annual instruction candidate for ${total.year} needs review before tester presentation.`
            : `Runtime annual instruction candidate for ${total.year} is blocked until annual account totals are available.`,
      boundary:
        'This candidate is runtime-only review context. It is not saved, exported to CSV, printed in reports, shown in production UI, or framed as tax-bracket instructions.'
    };
  });
}

function buildExperimentalAnnualCandidateSelectionSummary(
  candidates: OptimizerExperimentalAnnualInstructionCandidate[]
): OptimizerExperimentalAnnualCandidateSelectionSummary {
  const qualityCounts: OptimizerExperimentalAnnualCandidateSelectionSummary['qualityCounts'] = {
    higher: 0,
    medium: 0,
    low: 0,
    blocked: 0
  };
  for (const candidate of candidates) {
    qualityCounts[candidate.quality.level] += 1;
  }
  const sortedCandidates = [...candidates].sort((a, b) => b.quality.score - a.quality.score || a.year - b.year);
  const topScore = sortedCandidates[0]?.quality.score ?? 0;
  const strongestCandidateYears = sortedCandidates.filter((candidate) => candidate.quality.score === topScore && candidate.status !== 'blocked').map((candidate) => candidate.year);
  const repairThemeLabels: Record<OptimizerExperimentalAnnualCandidateSelectionSummary['repairThemes'][number]['id'], string> = {
    accountOrderGap: 'Account order gap',
    partialAccountOrder: 'Partial account order',
    limitedTaxContext: 'Limited tax context',
    missingAnnualTotal: 'Missing annual total'
  };
  const repairThemes: OptimizerExperimentalAnnualCandidateSelectionSummary['repairThemes'] = (
    ['accountOrderGap', 'partialAccountOrder', 'limitedTaxContext', 'missingAnnualTotal'] as const
  ).map((id) => {
    const candidateYears = candidates
      .filter((candidate) => candidate.quality.repairTargets.some((target) => target.id === id && target.status === 'repair'))
      .map((candidate) => candidate.year);
    return {
      id,
      label: repairThemeLabels[id],
      candidateYears,
      status: candidateYears.length ? 'repair' : 'pass',
      detail: candidateYears.length
        ? `${repairThemeLabels[id]} appears in ${candidateYears.length} annual candidate${candidateYears.length === 1 ? '' : 's'}.`
        : `${repairThemeLabels[id]} does not appear as a candidate repair theme.`
    };
  });
  const hasBlocked = qualityCounts.blocked > 0 || candidates.length === 0;
  const hasRepairThemes = repairThemes.some((theme) => theme.status === 'repair');
  const status: OptimizerExperimentalAnnualCandidateSelectionSummary['status'] = hasBlocked
    ? 'blocked'
    : hasRepairThemes
      ? 'reviewFirst'
      : 'readyForTesterReview';

  return {
    status,
    strongestCandidateYears,
    qualityCounts,
    repairThemes,
    summary:
      status === 'readyForTesterReview'
        ? 'Annual instruction candidates are ready for synthetic tester review.'
        : status === 'reviewFirst'
          ? 'Annual instruction candidates have repair themes to review before tester presentation.'
          : 'Annual instruction candidates are blocked until runtime candidate evidence is available.',
    boundary:
      'Candidate selection summary is runtime-only review context. It does not save sequencing output, export CSV, change reports, change production UI, or create tax-bracket instructions.',
    nextStep: 'Review strongest candidate years and repair themes before planning saved sequencing output or CSV sequencing output.'
  };
}

function candidateStatusLabel(status: OptimizerExperimentalAnnualInstructionCandidate['status']): string {
  if (status === 'readyForReview') return 'Ready for review';
  if (status === 'reviewFirst') return 'Review first';
  return 'Blocked';
}

function candidateQualityLabel(level: OptimizerExperimentalAnnualInstructionCandidate['quality']['level']): string {
  if (level === 'higher') return 'Higher confidence';
  if (level === 'medium') return 'Medium confidence';
  if (level === 'low') return 'Low confidence';
  return 'Blocked confidence';
}

function candidateRepairPreview(candidate: OptimizerExperimentalAnnualInstructionCandidate): string {
  const repairLabels = candidate.quality.repairTargets.filter((target) => target.status === 'repair').map((target) => target.label);
  if (!repairLabels.length) return 'No repair themes flagged.';
  return `Review ${repairLabels.join(', ').toLowerCase()}.`;
}

function buildExperimentalAnnualCandidatePresentationReadiness({
  candidates,
  selectionSummary
}: {
  candidates: OptimizerExperimentalAnnualInstructionCandidate[];
  selectionSummary: OptimizerExperimentalAnnualCandidateSelectionSummary;
}): OptimizerExperimentalAnnualCandidatePresentationReadiness {
  const displayRows = candidates.map((candidate) => ({
    year: candidate.year,
    label: `${candidate.year} annual candidate`,
    statusLabel: candidateStatusLabel(candidate.status),
    qualityLabel: candidateQualityLabel(candidate.quality.level),
    repairPreview: candidateRepairPreview(candidate),
    totalAmount: candidate.totalAmount
  }));
  const missingLabels = displayRows.filter((row) => !row.label || !row.statusLabel || !row.qualityLabel);
  const missingRepairPreview = displayRows.filter((row) => !row.repairPreview);
  const rows: OptimizerExperimentalAnnualCandidatePresentationReadiness['rows'] = [
    {
      id: 'candidateLabels',
      label: 'Candidate labels',
      status: displayRows.length && !missingLabels.length ? 'pass' : displayRows.length ? 'watch' : 'block',
      detail: displayRows.length ? `${displayRows.length} candidate display row${displayRows.length === 1 ? '' : 's'} have tester-facing labels.` : 'No candidate display rows are available.'
    },
    {
      id: 'qualityLabels',
      label: 'Quality labels',
      status: displayRows.every((row) => row.qualityLabel.includes('confidence')) && displayRows.length ? 'pass' : displayRows.length ? 'watch' : 'block',
      detail: 'Display rows use confidence labels for quality instead of directive instruction language.'
    },
    {
      id: 'repairPreview',
      label: 'Repair preview',
      status: missingRepairPreview.length ? 'watch' : displayRows.length ? 'pass' : 'block',
      detail: missingRepairPreview.length
        ? `${missingRepairPreview.length} display row${missingRepairPreview.length === 1 ? '' : 's'} need repair preview copy.`
        : 'Display rows include repair preview copy for tester review.'
    },
    {
      id: 'boundary',
      label: 'Presentation boundary',
      status: 'pass',
      detail: 'Presentation readiness is runtime-only and does not create saved, CSV, report, production UI, or tax-bracket instruction output.'
    }
  ];
  const blocked = rows.some((row) => row.status === 'block') || selectionSummary.status === 'blocked';
  const watch = rows.some((row) => row.status === 'watch') || selectionSummary.status === 'reviewFirst';
  const status: OptimizerExperimentalAnnualCandidatePresentationReadiness['status'] = blocked ? 'blocked' : watch ? 'reviewFirst' : 'readyForTesterReview';

  return {
    status,
    displayRows,
    rows,
    summary:
      status === 'readyForTesterReview'
        ? 'Annual candidate summaries are ready for synthetic tester review.'
        : status === 'reviewFirst'
          ? 'Annual candidate summaries can be reviewed by testers with repair themes visible.'
          : 'Annual candidate summaries are blocked until candidate evidence is available.',
    boundary:
      'Presentation readiness is runtime-only review context. It does not save sequencing output, export CSV, change reports, change production UI, or create tax-bracket instructions.',
    nextStep: 'Use these display rows for synthetic tester review before planning saved sequencing output, CSV output, or production UI.'
  };
}

function buildExperimentalTesterPacketBoundary(
  presentationReadiness: OptimizerExperimentalAnnualCandidatePresentationReadiness
): OptimizerExperimentalTesterPacketBoundary {
  const visibleSections: OptimizerExperimentalTesterPacketBoundary['visibleSections'] = [
    'candidateDisplayRows',
    'qualityLabels',
    'repairThemes',
    'runtimeBoundary'
  ];
  const hiddenSections: OptimizerExperimentalTesterPacketBoundary['hiddenSections'] = [
    'savedSequencingOutput',
    'csvSequencingOutput',
    'reportOutput',
    'productionUi',
    'taxBracketInstructions',
    'finalAnnualInstructions'
  ];
  const hasDisplayRows = presentationReadiness.displayRows.length > 0;
  const rows: OptimizerExperimentalTesterPacketBoundary['rows'] = [
    {
      id: 'visibleMaterial',
      label: 'Visible tester material',
      status: hasDisplayRows ? 'pass' : 'block',
      detail: hasDisplayRows
        ? 'Tester packet can show candidate display rows, quality labels, repair themes, and runtime boundary copy.'
        : 'Tester packet cannot be shown until candidate display rows exist.'
    },
    {
      id: 'hiddenMaterial',
      label: 'Hidden material',
      status: 'pass',
      detail: 'Saved sequencing output, CSV sequencing output, reports, production UI, tax-bracket instructions, and final annual instructions remain hidden.'
    },
    {
      id: 'testerPurpose',
      label: 'Tester purpose',
      status: presentationReadiness.status === 'blocked' ? 'block' : presentationReadiness.status === 'reviewFirst' ? 'watch' : 'pass',
      detail: 'Tester packet is for feature testing with made-up scenarios and is not for personal retirement decisions.'
    },
    {
      id: 'outputBoundary',
      label: 'Output boundary',
      status: 'pass',
      detail: 'Tester packet boundary is runtime-only and does not create saved, CSV, report, production UI, or tax-bracket instruction output.'
    }
  ];
  const blocked = rows.some((row) => row.status === 'block');
  const watch = rows.some((row) => row.status === 'watch');
  const status: OptimizerExperimentalTesterPacketBoundary['status'] = blocked ? 'blocked' : watch ? 'reviewFirst' : 'readyForSyntheticTesterPacket';

  return {
    status,
    visibleSections,
    hiddenSections,
    rows,
    testerCopy: {
      headline: 'Experimental annual candidate review',
      purpose: 'Use this runtime packet to test whether candidate summaries are understandable in made-up scenarios.',
      boundary:
        'This packet is not a retirement plan, is not saved, is not exported, and should not be used for personal decisions.'
    },
    blockedOutputs: ['finalAnnualInstructions', 'savedSequencingOutput', 'csvSequencingOutput', 'reportOutput', 'productionUi', 'taxBracketInstructions'],
    summary:
      status === 'readyForSyntheticTesterPacket'
        ? 'Synthetic tester packet boundary is ready for runtime review.'
        : status === 'reviewFirst'
          ? 'Synthetic tester packet boundary can be reviewed with visible repair themes.'
          : 'Synthetic tester packet boundary is blocked until display rows are available.',
    nextStep: 'Review the runtime tester packet boundary before planning tester-facing UI, saved sequencing output, or CSV sequencing output.'
  };
}

function buildExperimentalTesterPacketExportGuard(
  testerPacketBoundary: OptimizerExperimentalTesterPacketBoundary
): OptimizerExperimentalTesterPacketExportGuard {
  const requiredHiddenOutputs: OptimizerExperimentalTesterPacketExportGuard['blockedOutputs'] = [
    'savedSequencingOutput',
    'csvSequencingOutput',
    'reportOutput',
    'productionUi',
    'taxBracketInstructions',
    'finalAnnualInstructions'
  ];
  const hiddenOutputs = new Set(testerPacketBoundary.hiddenSections);
  const blockedOutputs = new Set(testerPacketBoundary.blockedOutputs);
  const outputBoundaryGuarded = requiredHiddenOutputs.every((output) => hiddenOutputs.has(output) && blockedOutputs.has(output));
  const rows: OptimizerExperimentalTesterPacketExportGuard['rows'] = [
    {
      id: 'savedPlanFile',
      label: 'Saved plan file',
      status: outputBoundaryGuarded ? 'guarded' : 'blocked',
      detail: 'Tester packet fields remain runtime-only and are excluded from saved plan files.'
    },
    {
      id: 'csvOutput',
      label: 'CSV output',
      status: outputBoundaryGuarded ? 'guarded' : 'blocked',
      detail: 'CSV sequencing output stays unavailable until a separate export package is planned.'
    },
    {
      id: 'reportOutput',
      label: 'Report output',
      status: outputBoundaryGuarded ? 'guarded' : 'blocked',
      detail: 'Printable reports do not include synthetic tester packet content.'
    },
    {
      id: 'productionUi',
      label: 'Production UI',
      status: outputBoundaryGuarded ? 'guarded' : 'blocked',
      detail: 'Production UI remains unchanged; tester packet content can only be reviewed as runtime evidence.'
    },
    {
      id: 'finalInstructions',
      label: 'Final annual instructions',
      status: outputBoundaryGuarded ? 'guarded' : 'blocked',
      detail: 'Final annual account instructions are not created by the tester packet.'
    },
    {
      id: 'taxBracketInstructions',
      label: 'Tax-bracket instructions',
      status: outputBoundaryGuarded ? 'guarded' : 'blocked',
      detail: 'Tester packet content does not create tax-bracket instructions or bracket-targeting copy.'
    }
  ];
  const status: OptimizerExperimentalTesterPacketExportGuard['status'] =
    outputBoundaryGuarded && rows.every((row) => row.status === 'guarded') ? 'guarded' : 'blocked';

  return {
    status,
    rows,
    forbiddenSavedKeys: [
      'testerPacketBoundary',
      'testerPacketExportGuard',
      'annualInstructionCandidates',
      'candidateSelectionSummary',
      'presentationReadiness',
      'experimentalAnnualInstructionDraft',
      'annualAccountInstructions'
    ],
    blockedOutputs: requiredHiddenOutputs,
    summary:
      status === 'guarded'
        ? 'Tester packet export guard keeps synthetic review content runtime-only.'
        : 'Tester packet export guard is blocked until all hidden outputs are confirmed.',
    boundary:
      'Tester packet export guard is runtime-only review evidence. It does not save sequencing output, export CSV, change reports, change production UI, create final annual instructions, or create tax-bracket instructions.',
    nextStep: 'Use this guard to verify the synthetic tester packet boundary before planning any tester-facing implementation.'
  };
}

export function selectOptimizerExperimentalAnnualInstructionDraft({
  adapter,
  accountOrderDraft,
  summary
}: {
  adapter: OptimizerAnnualSequencingInputAdapter;
  accountOrderDraft: OptimizerExperimentalAccountOrderDraft;
  summary: ReturnType<typeof summarizeResult> | null | undefined;
}): OptimizerExperimentalAnnualInstructionDraft {
  const annualRows = Array.isArray(summary?.rows) ? summary.rows.slice(0, 10) : [];
  const orderIndex = new Map(accountOrderDraft.order.map((bucket, index) => [bucket, index]));
  const rows = annualRows.flatMap((annualRow) => {
    const withdrawals = rowDraftWithdrawals(annualRow as Record<string, unknown>).sort(
      (a, b) => (orderIndex.get(a.account) ?? 99) - (orderIndex.get(b.account) ?? 99)
    );
    return withdrawals.map((withdrawal, index) => {
      const year = n(annualRow.year);
      const label = accountBucketLabel(withdrawal.account);
      const amount = Math.round(withdrawal.amount);
      const accountOrderPosition = orderIndex.has(withdrawal.account) ? (orderIndex.get(withdrawal.account) ?? 0) + 1 : null;
      const taxContext = {
        totalTaxYear: Math.round(n(annualRow.totalTaxYear)),
        taxableIncome: Math.round(n(annualRow.taxableIncome)),
        oasRecovery: Math.round(n(annualRow.totalOasClawY)),
        afterTaxSpending: Math.round(n(annualRow.totalAftaxYear)),
        effectiveTaxRatePct: effectiveTaxRatePct(annualRow as Record<string, unknown>),
        oasRecoveryStatus: n(annualRow.totalOasClawY) > 1 ? ('present' as const) : ('none' as const)
      };
      return {
        year,
        account: withdrawal.account,
        label,
        amount,
        source: {
          candidateLabel: adapter.sourceCandidateLabel,
          withdrawalField: withdrawal.sourceField,
          withdrawalFieldLabel: withdrawalFieldLabel(withdrawal.sourceField),
          accountOrderPosition,
          yearWithdrawalCount: withdrawals.length
        },
        grouping: {
          yearAccountIndex: index + 1,
          yearWithdrawalCount: withdrawals.length,
          mode: withdrawals.length === 1 ? ('singleAccountYear' as const) : ('multiAccountYear' as const)
        },
        taxContext,
        status: 'experimentalDraft' as const,
        rationale: buildAnnualDraftRowRationale({
          year,
          label,
          amount,
          sourceField: withdrawal.sourceField,
          accountOrderPosition,
          yearAccountIndex: index + 1,
          yearWithdrawalCount: withdrawals.length,
          taxContextAvailable: taxContext.afterTaxSpending > 0 && taxContext.taxableIncome >= 0
        })
      };
    });
  });
  const status: OptimizerExperimentalAnnualInstructionDraft['status'] =
    accountOrderDraft.status === 'draftReady' && rows.length ? 'draftReady' : accountOrderDraft.status === 'blocked' ? 'blocked' : 'needsInputs';
  const taxContextRows = buildExperimentalDraftTaxContextRows(annualRows as Array<Record<string, unknown>>, rows);
  const confidence = buildExperimentalDraftConfidence({
    adapter,
    accountOrderDraft,
    draftRows: rows,
    taxContextRows
  });
  const harmChecks = buildExperimentalDraftHarmChecks({
    adapter,
    summary,
    taxContextRows,
    confidence
  });
  const readinessSummary = buildExperimentalDraftReadinessSummary({
    yearCount: annualRows.length,
    draftRows: rows,
    taxContextRows,
    confidence,
    harmChecks
  });
  const annualAccountTotals = buildExperimentalAnnualAccountTotals(rows);
  const instructionReadiness = buildExperimentalAnnualInstructionReadiness({
    rows,
    annualAccountTotals
  });
  const annualInstructionCandidates = buildExperimentalAnnualInstructionCandidates(annualAccountTotals);
  const candidateSelectionSummary = buildExperimentalAnnualCandidateSelectionSummary(annualInstructionCandidates);
  const presentationReadiness = buildExperimentalAnnualCandidatePresentationReadiness({
    candidates: annualInstructionCandidates,
    selectionSummary: candidateSelectionSummary
  });
  const testerPacketBoundary = buildExperimentalTesterPacketBoundary(presentationReadiness);
  const testerPacketExportGuard = buildExperimentalTesterPacketExportGuard(testerPacketBoundary);
  const runtimeDraftGeneratorScope = buildRuntimeAnnualInstructionDraftGeneratorScope({
    status,
    rows,
    annualAccountTotals,
    accountOrderDraft,
    taxContextRows,
    readinessSummary
  });

  return {
    status,
    audience: 'syntheticTesterOnly',
    sourceCandidateId: adapter.sourceCandidateId,
    sourceCandidateLabel: adapter.sourceCandidateLabel,
    yearCount: annualRows.length,
    rows,
    annualAccountTotals,
    instructionReadiness,
    annualInstructionCandidates,
    candidateSelectionSummary,
    presentationReadiness,
    testerPacketBoundary,
    testerPacketExportGuard,
    taxContextRows,
    confidence,
    harmChecks,
    readinessSummary,
    runtimeDraftGeneratorScope,
    blockedOutputs: ['savedInstructionOutput', 'csvInstructionOutput', 'reportInstructionOutput', 'taxBracketInstructions', 'productionUi'],
    summary:
      status === 'draftReady'
        ? 'Experimental annual instruction draft rows include compact tax context for synthetic tester review.'
        : 'Experimental annual instruction draft rows need selected-candidate withdrawal rows before tester review.',
    boundary:
      'These rows are runtime-only experimental draft rows for synthetic tester scenarios. They are not saved, exported to CSV, printed in reports, shown in production UI, or framed as tax-bracket instructions.',
    nextStep: 'Review the experimental rows with synthetic scenarios before considering CSV, saved output, or production UI.'
  };
}

function buildBetaSavedSequencingQuality({
  row,
  annualTotal,
  constraintContext
}: {
  row: OptimizerExperimentalAnnualInstructionDraftRow;
  annualTotal: OptimizerExperimentalAnnualAccountTotal | undefined;
  constraintContext: string;
}): Pick<OptimizerBetaSavedSequencingRow, 'qualityStatus' | 'qualityScore' | 'qualityReasons'> {
  const qualityReasons = [
    row.source.withdrawalFieldLabel ? 'Source evidence present' : 'Source evidence review needed',
    annualTotal ? 'Annual account total present' : 'Annual account total review needed',
    row.source.accountOrderPosition === null ? 'Account-order evidence review needed' : 'Account-order evidence present',
    row.taxContext.effectiveTaxRatePct === null ? 'Tax context review needed' : 'Tax context present',
    constraintContext ? 'Constraint context preserved' : 'Constraint context review needed',
    'Output boundary visible'
  ];
  const qualityScore = qualityReasons.filter((reason) =>
    reason.includes('present') || reason.includes('preserved') || reason.includes('visible')
  ).length;
  const qualityStatus: OptimizerBetaSavedSequencingRow['qualityStatus'] =
    qualityScore >= 5 ? 'readyForBetaReview' : qualityScore >= 4 ? 'readyWithContext' : 'reviewBeforeSave';
  return { qualityStatus, qualityScore, qualityReasons };
}

export function selectOptimizerBetaSavedSequencingAdapter(
  draft: OptimizerExperimentalAnnualInstructionDraft
): OptimizerBetaSavedSequencingAdapter {
  const rows = draft.rows.slice(0, 12).map((row) => {
    const annualTotal = draft.annualAccountTotals.find((total) =>
      total.year === row.year && total.accounts.some((account) => account.account === row.account)
    );
    const constraintContext =
      draft.harmChecks.find((check) => check.status === 'block' || check.status === 'watch')?.detail ||
      draft.readinessSummary.reviewItems[0] ||
      'Constraint context preserved for beta review.';
    const quality = buildBetaSavedSequencingQuality({ row, annualTotal, constraintContext });
    const taxContext =
      row.taxContext.effectiveTaxRatePct === null
        ? 'Tax context review needed; do not create tax-bracket wording.'
        : `${row.taxContext.effectiveTaxRatePct}% effective tax context; OAS recovery ${row.taxContext.oasRecoveryStatus}.`;

    return {
      year: row.year,
      accountLabel: row.label || 'Account review needed',
      reviewAmount: Math.round(row.amount),
      sourceEvidence: `${row.source.withdrawalFieldLabel}; ${
        annualTotal ? `annual account total ${Math.round(annualTotal.totalAmount)}` : 'annual total review needed'
      }`,
      taxContext,
      constraintContext,
      ...quality,
      boundaryStatus: 'Internal beta review row only; not saved to plan files, exported, reported, public, final, or tax-bracket wording.'
    };
  });
  const needsRepair = rows.some((row) => row.qualityStatus === 'reviewBeforeSave');
  const hasRows = rows.length > 0;
  const status: OptimizerBetaSavedSequencingAdapter['status'] =
    draft.status === 'draftReady' && hasRows && !needsRepair
      ? 'readyForBetaReview'
      : hasRows
        ? 'reviewFirst'
        : 'blocked';

  return {
    status,
    audience: 'internalBetaOnly',
    sourceDraftStatus: draft.status,
    sourceCandidateId: draft.sourceCandidateId,
    sourceCandidateLabel: draft.sourceCandidateLabel,
    rows,
    allowedFields: ['year', 'accountLabel', 'reviewAmount', 'sourceEvidence', 'taxContext', 'constraintContext', 'qualityStatus'],
    excludedFields: ['finalInstruction', 'taxBracketTarget', 'csvColumn', 'reportRow', 'productionUiAction'],
    blockedOutputs: [
      'savedPlanSchemaChanges',
      'engineOutputSchemaChanges',
      'planJsonGeneration',
      'csvOutput',
      'reportOutput',
      'productionUi',
      'finalAnnualInstructions',
      'taxBracketWording'
    ],
    summary:
      status === 'readyForBetaReview'
        ? 'Beta saved sequencing adapter rows are ready for internal beta review from current runtime evidence.'
        : status === 'reviewFirst'
          ? 'Beta saved sequencing adapter rows exist, but review-before-save evidence remains.'
          : 'Beta saved sequencing adapter is blocked until runtime annual draft rows exist.',
    boundary:
      'This adapter creates an internal beta review payload only. It does not change saved schema, engine output schema, .plan.json generation, CSV output, reports, production UI, final annual instructions, or tax-bracket wording.',
    nextStep:
      status === 'readyForBetaReview'
        ? 'Use the adapter in internal beta review, then plan CSV/report/schema work as separate public-readiness gates.'
        : 'Repair row quality and source evidence before treating beta saved sequencing as feature-complete.'
  };
}

export function selectOptimizerContinuationContract({
  betaSavedSequencingAdapter
}: {
  betaSavedSequencingAdapter: OptimizerBetaSavedSequencingAdapter;
}): OptimizerContinuationContract {
  const betaReady = betaSavedSequencingAdapter.status === 'readyForBetaReview';
  return {
    status: betaReady ? 'featureCompleteBeta' : 'publicReadinessBlocked',
    betaReadySurfaces: [
      'boundedCandidateSearch',
      'runtimeAnnualDraftRows',
      'betaSavedSequencingAdapter',
      'testerOnlyDetailsSurface'
    ],
    blockedPublicOutputs: [
      'savedPlanSchemaChanges',
      'engineOutputSchemaChanges',
      'planJsonSequencingOutput',
      'csvSequencingOutput',
      'reportSequencingOutput',
      'productionUi',
      'finalAnnualInstructions',
      'taxBracketWording',
      'realDataTesterDistribution'
    ],
    nextPackages: [
      {
        id: 'contractConsolidation',
        label: 'Optimizer contract consolidation',
        purpose: 'Keep one compact source of truth for beta-ready surfaces, blocked public outputs, and next public-readiness gates.',
        status: 'later'
      },
      {
        id: 'schemaDecision',
        label: 'Schema and save decision',
        purpose: 'Decide whether beta sequencing belongs in saved files, engine output, both, or neither before writing plan files.',
        status: 'later'
      },
      {
        id: 'exportReportGate',
        label: 'CSV and report gate',
        purpose: 'Plan export/report rows only after saved-shape and wording boundaries are stable.',
        status: 'later'
      },
      {
        id: 'publicSafetyValidation',
        label: 'Public safety validation',
        purpose: 'Validate real-planning wording, stop conditions, public fixtures, and unsupported-case behavior before release.',
        status: 'current'
      }
    ],
    verificationPlan: {
      focusedCommands: [
        'npm run test:focused',
        'npm run build'
      ],
      fullSuiteStatus: 'useFocusedUntilHangResolved',
      storageNote:
        'The current machine has limited free disk space, and full npm test has hung after early passing suites; use focused tests plus build until the hang is isolated.'
    },
    summary: betaReady
      ? 'Feature-complete optimizer beta is present for internal review; public-ready output remains gated.'
      : 'Optimizer beta still needs review before public-readiness work can begin.',
    boundary:
      'This contract consolidates continuation state only. It does not unlock saved schema changes, engine output schema changes, .plan.json sequencing output, CSV output, report output, production UI, final annual instructions, tax-bracket wording, or real-data tester distribution.'
  };
}

export function selectOptimizerPublicSafetyValidation({
  csvReportGate
}: {
  csvReportGate: OptimizerCsvReportGate;
}): OptimizerPublicSafetyValidation {
  const gateReadyForReview = csvReportGate.status === 'readyForGateReview';
  return {
    status: gateReadyForReview ? 'notPublicReady' : 'blocked',
    decision: 'keepPublicOptimizerClosed',
    sourceCsvReportGateStatus: csvReportGate.status,
    safetyRows: [
      {
        id: 'reviewOnlyWording',
        label: 'Review-only wording',
        status: gateReadyForReview ? 'ready' : 'blocked',
        detail: gateReadyForReview
          ? 'Current optimizer language frames beta sequencing as review evidence, not final instructions or tax advice.'
          : 'Review-only wording waits for upstream beta and export/report gates.'
      },
      {
        id: 'stopConditions',
        label: 'Stop conditions',
        status: gateReadyForReview ? 'ready' : 'blocked',
        detail: gateReadyForReview
          ? 'Missing context, unsupported household shapes, and tester confusion remain explicit stop conditions.'
          : 'Stop conditions wait for upstream gate evidence.'
      },
      {
        id: 'unsupportedCaseHandling',
        label: 'Unsupported-case handling',
        status: 'blocked',
        detail: 'Public use still needs clear behavior for unsupported account, household, tax, survivor, and estate cases.'
      },
      {
        id: 'scenarioCoverage',
        label: 'Scenario coverage',
        status: 'blocked',
        detail: 'Public readiness needs broader fixtures and real-planning edge-case coverage beyond synthetic beta scenarios.'
      },
      {
        id: 'realDataTesterDistribution',
        label: 'Real-data tester distribution',
        status: 'blocked',
        detail: 'Real financial data should not be used until wording, stop conditions, and unsupported-case behavior are validated.'
      },
      {
        id: 'publicReleaseControls',
        label: 'Public release controls',
        status: 'blocked',
        detail: 'Production UI, exports, reports, final instructions, and tax-bracket wording require explicit release controls.'
      }
    ],
    stopConditions: [
      'missingTaxContext',
      'missingConstraintContext',
      'ambiguousAccountEvidence',
      'unsupportedHouseholdShape',
      'testerMistakesReviewForInstruction',
      'exportOrReportExpectation'
    ],
    blockedOutputs: [
      'publicOptimizerRelease',
      'realDataTesterDistribution',
      'productionUi',
      'csvSequencingOutput',
      'reportSequencingOutput',
      'finalAnnualInstructions',
      'taxBracketWording',
      'savedPlanSchemaChanges',
      'engineOutputSchemaChanges',
      'planJsonSequencingOutput'
    ],
    summary:
      gateReadyForReview
        ? 'Public safety validation is framed, but the optimizer is not public-ready.'
        : 'Public safety validation is blocked until upstream gates are ready for review.',
    boundary:
      'This validation keeps the optimizer closed for public use. It does not open real-data tester distribution, production UI, CSV sequencing output, report sequencing output, final annual instructions, tax-bracket wording, saved schema changes, engine output schema changes, or .plan.json sequencing output.',
    nextStep:
      'Use these safety rows to plan unsupported-case handling and broader scenario coverage before any public optimizer release decision.'
  };
}

export function selectOptimizerCsvReportGate({
  betaSavedSequencingAdapter,
  schemaSaveDecision
}: {
  betaSavedSequencingAdapter: OptimizerBetaSavedSequencingAdapter;
  schemaSaveDecision: OptimizerSchemaSaveDecision;
}): OptimizerCsvReportGate {
  const savedBoundaryReady =
    schemaSaveDecision.status === 'runtimeOnly' &&
    schemaSaveDecision.decision === 'doNotSaveBetaSequencingYet' &&
    schemaSaveDecision.allowedSavedKeys.length === 0;
  const rowEvidenceReady = betaSavedSequencingAdapter.status === 'readyForBetaReview' && betaSavedSequencingAdapter.rows.length > 0;
  const status: OptimizerCsvReportGate['status'] = savedBoundaryReady && rowEvidenceReady ? 'readyForGateReview' : 'blocked';
  return {
    status,
    decision: 'keepCsvAndReportSequencingBlocked',
    sourceAdapterStatus: betaSavedSequencingAdapter.status,
    sourceSaveDecisionStatus: schemaSaveDecision.status,
    requiredEvidence: [
      {
        id: 'savedBoundaryVerified',
        label: 'Saved boundary verified',
        status: savedBoundaryReady ? 'ready' : 'blocked',
        detail: savedBoundaryReady
          ? 'Plan-file behavior keeps beta sequencing packets out of editable saved files.'
          : 'CSV/report planning waits until saved-file behavior is explicitly no-write.'
      },
      {
        id: 'rowEvidenceReady',
        label: 'Row evidence ready',
        status: rowEvidenceReady ? 'ready' : 'blocked',
        detail: rowEvidenceReady
          ? 'Beta sequencing review rows have source evidence, tax context, constraint context, and quality status.'
          : 'CSV/report planning waits for beta sequencing rows with complete review evidence.'
      },
      {
        id: 'csvColumnContract',
        label: 'CSV column contract',
        status: 'blocked',
        detail: 'CSV column names, ordering, null handling, and non-advisory wording still need a separate contract.'
      },
      {
        id: 'reportRowContract',
        label: 'Report row contract',
        status: 'blocked',
        detail: 'Printable report placement, labels, summaries, and explanatory copy still need a separate contract.'
      },
      {
        id: 'wordingSafety',
        label: 'Wording safety',
        status: 'blocked',
        detail: 'Final-style instructions, tax-bracket wording, and advice-like commands remain blocked.'
      },
      {
        id: 'publicScenarioCoverage',
        label: 'Public scenario coverage',
        status: 'blocked',
        detail: 'Real-planning release needs unsupported-case handling and broader scenario validation before exports open.'
      }
    ],
    allowedFutureFields: betaSavedSequencingAdapter.allowedFields,
    excludedFields: [
      'finalInstruction',
      'taxBracketTarget',
      'taxBracketWording',
      'productionUiAction',
      'savedPlanField',
      'adviceLikeCommand'
    ],
    blockedOutputs: [
      'csvSequencingOutput',
      'reportSequencingOutput',
      'finalAnnualInstructions',
      'taxBracketWording',
      'productionUi',
      'savedPlanSchemaChanges',
      'engineOutputSchemaChanges',
      'planJsonSequencingOutput'
    ],
    summary:
      status === 'readyForGateReview'
        ? 'CSV/report gate is ready for review, but sequencing export and printable rows remain closed.'
        : 'CSV/report gate is blocked until saved-boundary and row evidence are ready.',
    boundary:
      'This gate plans export/report readiness only. It does not add CSV sequencing columns, report sequencing rows, saved plan fields, production UI, final annual instructions, tax-bracket wording, or advice-like commands.',
    nextStep:
      'Use this gate to define CSV column and report row contracts before any export or printable sequencing implementation.'
  };
}

export function selectOptimizerSchemaSaveDecision({
  betaSavedSequencingAdapter,
  continuationContract
}: {
  betaSavedSequencingAdapter: OptimizerBetaSavedSequencingAdapter;
  continuationContract: OptimizerContinuationContract;
}): OptimizerSchemaSaveDecision {
  const readyForRuntimeReview =
    betaSavedSequencingAdapter.status === 'readyForBetaReview' && continuationContract.status === 'featureCompleteBeta';
  return {
    status: readyForRuntimeReview ? 'runtimeOnly' : 'blocked',
    decision: 'doNotSaveBetaSequencingYet',
    reason: readyForRuntimeReview
      ? 'Beta sequencing is ready for internal runtime review, but saved plan files should remain clean until the public schema and wording gates pass.'
      : 'Beta sequencing does not have enough runtime review evidence to consider saved-file shape work.',
    allowedSavedKeys: [],
    forbiddenSavedKeys: [
      'capacityObjective',
      'capacityReportReadiness',
      'capacityExportGuard',
      'annualSequencingPrepContract',
      'annualSequencingInputAdapter',
      'experimentalAccountOrderDraft',
      'experimentalAnnualInstructionDraft',
      'betaSavedSequencingAdapter',
      'continuationContract',
      'schemaSaveDecision',
      'csvReportGate',
      'publicSafetyValidation',
      'boundedOptimizer',
      'optimizerOutput',
      'annualAccountInstructions',
      'annualSequencingOutput',
      'finalAnnualInstructions',
      'taxBracketTargets'
    ],
    blockedOutputs: [
      'savedPlanSchemaChanges',
      'engineOutputSchemaChanges',
      'planJsonSequencingOutput',
      'csvSequencingOutput',
      'reportSequencingOutput',
      'productionUi',
      'finalAnnualInstructions',
      'taxBracketWording'
    ],
    localFirstRule:
      'Local .plan.json save/load remains limited to clean editable planning inputs; optimizer sequencing review packets are recomputed at runtime.',
    privacyRule:
      'Do not persist beta review rows, candidate evidence, final-style annual instructions, or tax-bracket wording into user plan files.',
    summary: readyForRuntimeReview
      ? 'Schema/save decision is runtime-only: beta sequencing can be reviewed internally, but plan files stay unchanged.'
      : 'Schema/save decision remains blocked until beta sequencing runtime evidence is ready.',
    boundary:
      'This decision keeps beta sequencing out of saved .plan.json files, saved schema migrations, engine output schema changes, CSV output, reports, production UI, final annual instructions, and tax-bracket wording.',
    nextStep:
      'Implement the CSV/report gate only after the no-write saved-file boundary is verified by plan-file tests and public wording remains blocked.'
  };
}

function selectOptimizerSyntheticTesterPacketReadinessMatrix(
  examples: Array<{
    id: string;
    label: string;
    draft: OptimizerExperimentalAnnualInstructionDraft;
  }>
): OptimizerSyntheticTesterPacketReadinessMatrix {
  const readyExampleIds = examples
    .filter(
      (example) =>
        example.draft.readinessSummary.status === 'readyForTesterReview' &&
        example.draft.testerPacketBoundary.status === 'readyForSyntheticTesterPacket' &&
        example.draft.testerPacketExportGuard.status === 'guarded'
    )
    .map((example) => example.id);
  const blockedExampleIds = examples
    .filter(
      (example) =>
        example.draft.readinessSummary.status === 'blocked' ||
        example.draft.testerPacketBoundary.status === 'blocked' ||
        example.draft.testerPacketExportGuard.status === 'blocked'
    )
    .map((example) => example.id);
  const reviewExampleIds = examples
    .filter((example) => !readyExampleIds.includes(example.id) && !blockedExampleIds.includes(example.id))
    .map((example) => example.id);
  const allGuarded = examples.every((example) => example.draft.testerPacketExportGuard.status === 'guarded');
  const allBoundariesReady = examples.every((example) => example.draft.testerPacketBoundary.status === 'readyForSyntheticTesterPacket');
  const allDraftsReady = examples.every((example) => example.draft.readinessSummary.status === 'readyForTesterReview');
  const status: OptimizerSyntheticTesterPacketReadinessMatrix['status'] = blockedExampleIds.length
    ? 'blocked'
    : reviewExampleIds.length
      ? 'reviewFirst'
      : 'readyForLimitedTesterReview';
  const rows: OptimizerSyntheticTesterPacketReadinessMatrix['rows'] = [
    {
      id: 'draftReadiness',
      label: 'Draft readiness',
      status: allDraftsReady ? 'pass' : blockedExampleIds.length ? 'block' : 'watch',
      detail: allDraftsReady
        ? 'All examples have draft readiness for limited synthetic tester review.'
        : blockedExampleIds.length
          ? 'At least one example is blocked before synthetic tester review.'
          : 'Some examples need review-first handling before limited synthetic tester review.'
    },
    {
      id: 'packetBoundary',
      label: 'Tester packet boundary',
      status: allBoundariesReady ? 'pass' : blockedExampleIds.length ? 'block' : 'watch',
      detail: allBoundariesReady
        ? 'Tester packet boundaries are ready across examples.'
        : 'Some tester packet boundaries need review before widening tester access.'
    },
    {
      id: 'exportGuard',
      label: 'Export guard',
      status: allGuarded ? 'pass' : 'block',
      detail: allGuarded
        ? 'Tester packet export guards keep synthetic review content runtime-only across examples.'
        : 'At least one tester packet export guard is blocked.'
    },
    {
      id: 'testerPurpose',
      label: 'Tester purpose',
      status: examples.length ? 'pass' : 'block',
      detail: examples.length
        ? 'Limited tester review is scoped to made-up scenarios for feature testing, not personal decisions.'
        : 'No examples are available for tester packet review.'
    },
    {
      id: 'outputBoundary',
      label: 'Output boundary',
      status: allGuarded ? 'pass' : 'block',
      detail:
        'Readiness matrix remains runtime-only and does not create saved sequencing output, CSV output, report output, production UI, final annual instructions, or tax-bracket instructions.'
    }
  ];
  const contractStatus: OptimizerSyntheticTesterPacketReadinessMatrix['packetContract']['status'] =
    status === 'readyForLimitedTesterReview' ? 'readyForContractReview' : status;
  const allowedFields: OptimizerSyntheticTesterPacketReadinessMatrix['packetContract']['allowedFields'] = [
    'exampleId',
    'exampleLabel',
    'candidateDisplayRows',
    'qualityLabels',
    'repairThemes',
    'runtimeBoundary',
    'reviewPrompts',
    'readinessStatus'
  ];
  const excludedFields: OptimizerSyntheticTesterPacketReadinessMatrix['packetContract']['excludedFields'] = [
    'savedSequencingOutput',
    'csvSequencingOutput',
    'reportOutput',
    'productionUi',
    'taxBracketInstructions',
    'finalAnnualInstructions',
    'personalData',
    'savedPlanSchema'
  ];
  const packetContract: OptimizerSyntheticTesterPacketReadinessMatrix['packetContract'] = {
    status: contractStatus,
    allowedFields,
    excludedFields,
    reviewPrompts: [
      {
        id: 'clarity',
        prompt: 'Does the annual candidate summary make sense for this made-up scenario?'
      },
      {
        id: 'plausibility',
        prompt: 'Do the annual amounts, labels, and review flags look plausible for the scenario?'
      },
      {
        id: 'missingContext',
        prompt: 'What context would help you understand the candidate without turning it into final instructions?'
      },
      {
        id: 'boundary',
        prompt: 'Is it clear that this packet is for feature testing and not for personal decisions?'
      }
    ],
    rows: [
      {
        id: 'allowedFields',
        label: 'Allowed fields',
        status: examples.length ? 'pass' : 'block',
        detail: 'Future tester packet work may consume example labels, candidate display rows, quality labels, repair themes, runtime boundaries, review prompts, and readiness status.'
      },
      {
        id: 'excludedFields',
        label: 'Excluded fields',
        status: 'pass',
        detail: 'Saved sequencing output, CSV output, reports, production UI, tax-bracket instructions, final annual instructions, personal data, and saved schema fields are excluded.'
      },
      {
        id: 'copyBoundary',
        label: 'Copy boundary',
        status: 'pass',
        detail: 'Tester prompts ask about clarity and plausibility in made-up scenarios without telling a person what to do.'
      },
      {
        id: 'implementationBoundary',
        label: 'Implementation boundary',
        status: allGuarded ? 'pass' : 'block',
        detail: 'Contract review is runtime-only and does not implement tester UI, saved output, CSV output, reports, or production UI.'
      }
    ],
    summary:
      contractStatus === 'readyForContractReview'
        ? 'Limited synthetic tester packet contract is ready for review.'
        : contractStatus === 'reviewFirst'
          ? 'Limited synthetic tester packet contract can be reviewed after readiness watch items are checked.'
          : 'Limited synthetic tester packet contract is blocked until readiness or export guard issues are repaired.',
    boundary:
      'Contract is runtime-only. It defines what a future tester packet may consume without changing saved files, CSV output, reports, production UI, final annual instructions, or tax-bracket instructions.'
  };
  const reviewPromptIds = packetContract.reviewPrompts.map((prompt) => prompt.id);
  const dryRunItems: OptimizerSyntheticTesterPacketReadinessMatrix['dryRunPayload']['items'] = examples.map((example) => ({
    exampleId: example.id,
    exampleLabel: example.label,
    readinessStatus: example.draft.readinessSummary.status,
    candidateDisplayRows: example.draft.presentationReadiness.displayRows,
    reviewPromptIds,
    runtimeBoundary: example.draft.testerPacketBoundary.testerCopy.boundary
  }));
  const missingPayloadRows = dryRunItems.filter((item) => item.candidateDisplayRows.length === 0).map((item) => item.exampleId);
  const dryRunStatus: OptimizerSyntheticTesterPacketReadinessMatrix['dryRunPayload']['status'] =
    contractStatus === 'blocked'
      ? 'blocked'
      : missingPayloadRows.length
        ? 'reviewFirst'
        : contractStatus === 'readyForContractReview'
          ? 'readyForDryRunReview'
          : 'reviewFirst';
  const promptCoverageReady = dryRunItems.every((item) => item.reviewPromptIds.length === packetContract.reviewPrompts.length);
  const boundaryGaps = dryRunItems
    .filter((item) => !item.runtimeBoundary.toLowerCase().includes('not a retirement plan') || !item.runtimeBoundary.toLowerCase().includes('not saved'))
    .map((item) => item.exampleId);
  const reviewOrBlockedExamples = [...reviewExampleIds, ...blockedExampleIds];
  const qualityRows: OptimizerSyntheticTesterPacketReadinessMatrix['dryRunPayload']['qualityGate']['rows'] = [
    {
      id: 'rowCoverage',
      label: 'Payload row coverage',
      status: dryRunItems.length && !missingPayloadRows.length ? 'pass' : dryRunItems.length ? 'watch' : 'block',
      detail: missingPayloadRows.length
        ? `Candidate display rows need review for: ${missingPayloadRows.join(', ')}.`
        : 'All dry-run payload items include candidate display rows.'
    },
    {
      id: 'promptCoverage',
      label: 'Prompt coverage',
      status: promptCoverageReady ? 'pass' : 'block',
      detail: promptCoverageReady
        ? 'All payload items include the full review prompt set.'
        : 'At least one payload item is missing review prompt ids.'
    },
    {
      id: 'boundaryClarity',
      label: 'Boundary clarity',
      status: boundaryGaps.length ? 'watch' : 'pass',
      detail: boundaryGaps.length
        ? `Runtime boundary copy needs review for: ${boundaryGaps.join(', ')}.`
        : 'Runtime boundary copy states the packet is not a retirement plan and is not saved.'
    },
    {
      id: 'readinessMix',
      label: 'Readiness mix',
      status: blockedExampleIds.length ? 'block' : reviewExampleIds.length ? 'watch' : 'pass',
      detail: blockedExampleIds.length
        ? `Blocked examples remain before surface planning: ${blockedExampleIds.join(', ')}.`
        : reviewExampleIds.length
          ? `Review-first examples remain before surface planning: ${reviewExampleIds.join(', ')}.`
          : 'All examples are ready for limited tester review.'
    },
    {
      id: 'outputBoundary',
      label: 'Output boundary',
      status: allGuarded ? 'pass' : 'block',
      detail: 'Quality gate is runtime-only and does not create UI, saved output, CSV output, reports, final instructions, or tax-bracket instructions.'
    }
  ];
  const qualityScore = qualityRows.reduce((sum, row) => sum + (row.status === 'pass' ? 2 : row.status === 'watch' ? 1 : 0), 0);
  const qualityStatus: OptimizerSyntheticTesterPacketReadinessMatrix['dryRunPayload']['qualityGate']['status'] = qualityRows.some((row) => row.status === 'block')
    ? 'blocked'
    : qualityRows.some((row) => row.status === 'watch')
      ? 'reviewFirst'
      : 'readyForSurfacePlanning';
  const qualityGate: OptimizerSyntheticTesterPacketReadinessMatrix['dryRunPayload']['qualityGate'] = {
    status: qualityStatus,
    score: qualityScore,
    rows: qualityRows,
    repairExampleIds: Array.from(new Set([...missingPayloadRows, ...boundaryGaps, ...reviewOrBlockedExamples])),
    summary:
      qualityStatus === 'readyForSurfacePlanning'
        ? 'Dry-run payload quality is ready for limited tester surface planning.'
        : qualityStatus === 'reviewFirst'
          ? 'Dry-run payload quality needs review before limited tester surface planning.'
          : 'Dry-run payload quality is blocked until payload or readiness issues are repaired.',
    boundary:
      'Payload quality gate is runtime-only review evidence. It does not implement tester UI, save sequencing output, export CSV, change reports, create final instructions, or create tax-bracket instructions.',
    nextStep: 'Repair watch or blocked quality rows before planning a very small tester-facing surface.'
  };
  const surfaceScope: OptimizerSyntheticTesterPacketReadinessMatrix['dryRunPayload']['surfacePlanningGate']['surfaceScope'] = [
    'exampleList',
    'candidateRows',
    'qualityRows',
    'reviewPrompts',
    'runtimeBoundary'
  ];
  const disabledActions: OptimizerSyntheticTesterPacketReadinessMatrix['dryRunPayload']['surfacePlanningGate']['disabledActions'] = [
    'saveSequencing',
    'exportCsv',
    'printReport',
    'useInProduction',
    'finalizeInstructions',
    'taxBracketInstructions'
  ];
  const surfaceStatus: OptimizerSyntheticTesterPacketReadinessMatrix['dryRunPayload']['surfacePlanningGate']['status'] =
    qualityStatus === 'readyForSurfacePlanning' ? 'readyForSurfacePlan' : qualityStatus;
  const surfaceLabels: OptimizerSyntheticTesterPacketReadinessMatrix['dryRunPayload']['surfacePlanningGate']['copyAndActionBoundary']['surfaceLabels'] = [
    { id: 'exampleList', label: 'Synthetic examples' },
    { id: 'candidateRows', label: 'Annual candidate rows' },
    { id: 'qualityRows', label: 'Quality checks' },
    { id: 'reviewPrompts', label: 'Tester questions' },
    { id: 'runtimeBoundary', label: 'Review boundary' }
  ];
  const disabledActionLabels: OptimizerSyntheticTesterPacketReadinessMatrix['dryRunPayload']['surfacePlanningGate']['copyAndActionBoundary']['disabledActionLabels'] = [
    {
      id: 'saveSequencing',
      label: 'Save sequencing',
      reason: 'Saving annual sequencing is not available in this tester review.'
    },
    {
      id: 'exportCsv',
      label: 'Export CSV',
      reason: 'CSV sequencing export is not available in this tester review.'
    },
    {
      id: 'printReport',
      label: 'Print report',
      reason: 'Reports do not include tester packet material.'
    },
    {
      id: 'useInProduction',
      label: 'Use in planner',
      reason: 'This review material is not part of the production planner.'
    },
    {
      id: 'finalizeInstructions',
      label: 'Finalize instructions',
      reason: 'Final annual instructions are not created by this tester review.'
    },
    {
      id: 'taxBracketInstructions',
      label: 'Tax-bracket instructions',
      reason: 'Tax-bracket instructions are not created by this tester review.'
    }
  ];
  const copyText = [
    'Experimental tester packet review',
    'Use this small runtime surface to test whether made-up annual candidate summaries are clear.',
    'This is feature-testing material only. It is not a retirement plan, not saved, and not for personal decisions.',
    ...disabledActionLabels.map((action) => `${action.label}. ${action.reason}`)
  ].join(' ');
  const hasAdvisoryLanguage = /\byou should\b|\brecommend\b|\bstay under\b|\buse this bracket\b/i.test(copyText);
  const copyAndActionStatus: OptimizerSyntheticTesterPacketReadinessMatrix['dryRunPayload']['surfacePlanningGate']['copyAndActionBoundary']['status'] =
    surfaceStatus === 'blocked' || hasAdvisoryLanguage ? 'blocked' : surfaceStatus === 'reviewFirst' ? 'reviewFirst' : 'readyForCopyReview';
  const copyAndActionBoundary: OptimizerSyntheticTesterPacketReadinessMatrix['dryRunPayload']['surfacePlanningGate']['copyAndActionBoundary'] = {
    status: copyAndActionStatus,
    surfaceLabels,
    disabledActionLabels,
    rows: [
      {
        id: 'surfaceLabels',
        label: 'Surface labels',
        status: surfaceLabels.length === surfaceScope.length ? 'pass' : 'block',
        detail: 'Surface labels cover examples, candidate rows, quality checks, tester questions, and review boundary.'
      },
      {
        id: 'disabledActionLabels',
        label: 'Disabled action labels',
        status: disabledActionLabels.length === disabledActions.length ? 'pass' : 'block',
        detail: 'Disabled action labels explain why save, export, report, production, final instruction, and tax-bracket actions are unavailable.'
      },
      {
        id: 'reviewOnlyCopy',
        label: 'Review-only copy',
        status: 'pass',
        detail: 'Copy frames the surface as runtime feature testing with made-up scenarios.'
      },
      {
        id: 'nonAdvisoryBoundary',
        label: 'Boundary wording',
        status: hasAdvisoryLanguage ? 'block' : 'pass',
        detail: hasAdvisoryLanguage
          ? 'Copy includes wording that must be revised before tester surface planning.'
          : 'Copy avoids directive retirement or tax-bracket wording.'
      }
    ],
    summary:
      copyAndActionStatus === 'readyForCopyReview'
        ? 'Tester surface copy and disabled action labels are ready for copy review.'
        : copyAndActionStatus === 'reviewFirst'
          ? 'Tester surface copy can be reviewed after payload watch items are checked.'
          : 'Tester surface copy is blocked until boundary wording is repaired.',
    boundary:
      'Copy and action boundary is runtime-only. It prepares labels for a future tester surface without implementing UI, saving sequencing output, exporting CSV, printing reports, finalizing instructions, or creating tax-bracket instructions.'
  };
  const allowedImplementationScope: OptimizerSyntheticTesterPacketReadinessMatrix['dryRunPayload']['surfacePlanningGate']['implementationDecisionGate']['allowedImplementationScope'] = [
    'testerOnlyRoute',
    'runtimePayloadReader',
    'readOnlyCandidateRows',
    'reviewPrompts',
    'disabledActionButtons',
    'boundaryCopy'
  ];
  const blockedImplementationScope: OptimizerSyntheticTesterPacketReadinessMatrix['dryRunPayload']['surfacePlanningGate']['implementationDecisionGate']['blockedImplementationScope'] = [
    'savedSequencingOutput',
    'csvSequencingOutput',
    'reportOutput',
    'productionUiPromotion',
    'finalAnnualInstructions',
    'taxBracketInstructions',
    'savedSchemaChanges'
  ];
  const implementationRows: OptimizerSyntheticTesterPacketReadinessMatrix['dryRunPayload']['surfacePlanningGate']['implementationDecisionGate']['rows'] = [
    {
      id: 'qualityReady',
      label: 'Quality ready',
      status: qualityStatus === 'readyForSurfacePlanning' ? 'pass' : qualityStatus === 'reviewFirst' ? 'watch' : 'block',
      detail:
        qualityStatus === 'readyForSurfacePlanning'
          ? 'Payload quality is ready for tiny tester surface implementation planning.'
          : qualityStatus === 'reviewFirst'
            ? 'Payload quality has watch items before tiny tester surface implementation planning.'
            : 'Payload quality is blocked before implementation planning.'
    },
    {
      id: 'copyReady',
      label: 'Copy ready',
      status: copyAndActionStatus === 'readyForCopyReview' ? 'pass' : copyAndActionStatus === 'reviewFirst' ? 'watch' : 'block',
      detail:
        copyAndActionStatus === 'readyForCopyReview'
          ? 'Copy and disabled action labels are ready for implementation planning.'
          : copyAndActionStatus === 'reviewFirst'
            ? 'Copy and disabled action labels need review before implementation planning.'
            : 'Copy and disabled action labels are blocked before implementation planning.'
    },
    {
      id: 'actionsDisabled',
      label: 'Actions disabled',
      status: disabledActionLabels.length === disabledActions.length ? 'pass' : 'block',
      detail: 'Implementation planning must keep save, export, report, production, final instruction, and tax-bracket actions disabled.'
    },
    {
      id: 'scopeLimited',
      label: 'Scope limited',
      status: allowedImplementationScope.length === 6 && blockedImplementationScope.length === 7 ? 'pass' : 'block',
      detail: 'Allowed scope is limited to a tester-only read-only surface backed by runtime payload data.'
    },
    {
      id: 'implementationBoundary',
      label: 'Implementation boundary',
      status: 'pass',
      detail: 'Decision gate does not implement UI, save output, export CSV, change reports, promote production UI, create final instructions, or change saved schema.'
    }
  ];
  const implementationStatus: OptimizerSyntheticTesterPacketReadinessMatrix['dryRunPayload']['surfacePlanningGate']['implementationDecisionGate']['status'] =
    implementationRows.some((row) => row.status === 'block')
      ? 'blocked'
      : implementationRows.some((row) => row.status === 'watch')
        ? 'reviewFirst'
        : 'readyForTinyTesterSurface';
  const implementationDecisionGate: OptimizerSyntheticTesterPacketReadinessMatrix['dryRunPayload']['surfacePlanningGate']['implementationDecisionGate'] = {
    status: implementationStatus,
    decision:
      implementationStatus === 'readyForTinyTesterSurface'
        ? 'planTinyTesterSurface'
        : implementationStatus === 'reviewFirst'
          ? 'reviewFirst'
          : 'doNotImplementYet',
    allowedImplementationScope,
    blockedImplementationScope,
    rows: implementationRows,
    summary:
      implementationStatus === 'readyForTinyTesterSurface'
        ? 'Tiny tester-only surface implementation can be planned in a later package.'
        : implementationStatus === 'reviewFirst'
          ? 'Tiny tester-only surface implementation needs review before planning.'
          : 'Tiny tester-only surface implementation should not be planned yet.',
    boundary:
      'Implementation decision gate is runtime-only planning evidence. It does not implement UI, save sequencing output, export CSV, change reports, promote production UI, create final annual instructions, create tax-bracket instructions, or change saved schema.',
    nextStep: 'Review this decision gate before deciding whether the next package may implement a tiny tester-only surface.'
  };
  const preflightStatus: OptimizerSyntheticTesterPacketReadinessMatrix['dryRunPayload']['surfacePlanningGate']['preflightChecklist']['status'] =
    implementationStatus === 'readyForTinyTesterSurface' ? 'readyForImplementationPackage' : implementationStatus;
  const verificationSteps: OptimizerSyntheticTesterPacketReadinessMatrix['dryRunPayload']['surfacePlanningGate']['preflightChecklist']['verificationSteps'] = [
    'payloadItemsRender',
    'disabledActionsRender',
    'copyBoundaryVisible',
    'noSavedOutput',
    'noCsvOutput',
    'noReportOutput'
  ];
  const preflightChecklist: OptimizerSyntheticTesterPacketReadinessMatrix['dryRunPayload']['surfacePlanningGate']['preflightChecklist'] = {
    status: preflightStatus,
    route: {
      path: '/tester/annual-candidates',
      audience: 'syntheticTesterOnly'
    },
    dataSource: 'runtimeDryRunPayloadOnly',
    verificationSteps,
    rows: [
      {
        id: 'route',
        label: 'Tester route',
        status: implementationStatus === 'blocked' ? 'block' : 'pass',
        detail: 'Future implementation may use a tester-only annual candidate route that is not production navigation.'
      },
      {
        id: 'dataSource',
        label: 'Data source',
        status: 'pass',
        detail: 'Future implementation may read only the runtime dry-run payload.'
      },
      {
        id: 'readOnlyRendering',
        label: 'Read-only rendering',
        status: implementationStatus === 'readyForTinyTesterSurface' ? 'pass' : 'watch',
        detail: 'Candidate rows, quality checks, prompts, and boundary copy must render read-only.'
      },
      {
        id: 'disabledActions',
        label: 'Disabled actions',
        status: disabledActionLabels.length === disabledActions.length ? 'pass' : 'block',
        detail: 'Save, export, report, production, final instruction, and tax-bracket actions must render disabled if shown.'
      },
      {
        id: 'copyPlacement',
        label: 'Copy placement',
        status: copyAndActionStatus === 'blocked' ? 'block' : copyAndActionStatus === 'reviewFirst' ? 'watch' : 'pass',
        detail: 'Review-only boundary copy must be visible before payload rows.'
      },
      {
        id: 'verification',
        label: 'Verification steps',
        status: verificationSteps.length === 6 ? 'pass' : 'block',
        detail: 'Future implementation must verify payload rendering, disabled actions, visible boundary copy, and no saved, CSV, or report output.'
      }
    ],
    summary:
      preflightStatus === 'readyForImplementationPackage'
        ? 'Tiny tester surface preflight is ready for an implementation package.'
        : preflightStatus === 'reviewFirst'
          ? 'Tiny tester surface preflight needs review before implementation.'
          : 'Tiny tester surface preflight is blocked until decision-gate issues are repaired.',
    boundary:
      'Preflight checklist is runtime-only planning evidence. It does not implement UI, save sequencing output, export CSV, change reports, promote production UI, create final annual instructions, create tax-bracket instructions, or change saved schema.',
    nextStep: 'Use this checklist before approving any tiny tester-only surface implementation package.'
  };
  const requiredConditions: OptimizerSyntheticTesterPacketReadinessMatrix['dryRunPayload']['surfacePlanningGate']['implementationApprovalGate']['requiredConditions'] = [
    'preflightReady',
    'runtimeOnlyData',
    'readOnlySurface',
    'disabledOutputActions',
    'copyBoundaryVisible',
    'verificationPlanned'
  ];
  const approvalRows: OptimizerSyntheticTesterPacketReadinessMatrix['dryRunPayload']['surfacePlanningGate']['implementationApprovalGate']['rows'] = [
    {
      id: 'preflightReady',
      label: 'Preflight ready',
      status: preflightStatus === 'readyForImplementationPackage' ? 'pass' : preflightStatus === 'reviewFirst' ? 'watch' : 'block',
      detail:
        preflightStatus === 'readyForImplementationPackage'
          ? 'Preflight checklist is ready for a next implementation package.'
          : preflightStatus === 'reviewFirst'
            ? 'Preflight checklist has review items before approval.'
            : 'Preflight checklist is blocked before approval.'
    },
    {
      id: 'testerValue',
      label: 'Tester value',
      status: dryRunItems.length > 0 ? 'pass' : 'block',
      detail: dryRunItems.length > 0 ? 'Dry-run payload gives testers concrete annual candidate material to review.' : 'No tester payload items are available.'
    },
    {
      id: 'implementationScope',
      label: 'Implementation scope',
      status: allowedImplementationScope.length === 6 ? 'pass' : 'block',
      detail: 'Implementation scope remains tiny, tester-only, read-only, and backed by runtime payload data.'
    },
    {
      id: 'blockedOutputs',
      label: 'Blocked outputs',
      status: blockedImplementationScope.length === 7 ? 'pass' : 'block',
      detail: 'Saved sequencing, CSV, reports, production UI promotion, final instructions, tax-bracket instructions, and saved schema changes remain blocked.'
    },
    {
      id: 'approvalBoundary',
      label: 'Approval boundary',
      status: 'pass',
      detail: 'Approval gate can approve only the next implementation package; it does not implement the surface.'
    }
  ];
  const approvalStatus: OptimizerSyntheticTesterPacketReadinessMatrix['dryRunPayload']['surfacePlanningGate']['implementationApprovalGate']['status'] = approvalRows.some((row) => row.status === 'block')
    ? 'notApproved'
    : approvalRows.some((row) => row.status === 'watch')
      ? 'reviewFirst'
      : 'approvedForNextPackage';
  const implementationApprovalGate: OptimizerSyntheticTesterPacketReadinessMatrix['dryRunPayload']['surfacePlanningGate']['implementationApprovalGate'] = {
    status: approvalStatus,
    approval:
      approvalStatus === 'approvedForNextPackage'
        ? 'approveTinyTesterSurface'
        : approvalStatus === 'reviewFirst'
          ? 'reviewBeforeApproval'
          : 'holdImplementation',
    requiredConditions,
    blockedOutputs: blockedImplementationScope,
    rows: approvalRows,
    summary:
      approvalStatus === 'approvedForNextPackage'
        ? 'Tiny tester-only surface is approved for the next implementation package.'
        : approvalStatus === 'reviewFirst'
          ? 'Tiny tester-only surface needs review before implementation approval.'
          : 'Tiny tester-only surface implementation is not approved yet.',
    boundary:
      'Implementation approval gate is runtime-only planning evidence. It does not implement UI, save sequencing output, export CSV, change reports, promote production UI, create final annual instructions, create tax-bracket instructions, or change saved schema.',
    nextStep: 'Use this approval gate to decide whether the next package should implement the tiny tester-only surface.'
  };
  const surfacePlanningGate: OptimizerSyntheticTesterPacketReadinessMatrix['dryRunPayload']['surfacePlanningGate'] = {
    status: surfaceStatus,
    surfaceScope,
    disabledActions,
    reviewCopy: {
      headline: 'Experimental tester packet review',
      purpose: 'Use this small runtime surface to test whether made-up annual candidate summaries are clear.',
      boundary: 'This is feature-testing material only. It is not a retirement plan, not saved, and not for personal decisions.'
    },
    copyAndActionBoundary,
    implementationDecisionGate,
    preflightChecklist,
    implementationApprovalGate,
    rows: [
      {
        id: 'qualityGate',
        label: 'Quality gate',
        status: qualityStatus === 'readyForSurfacePlanning' ? 'pass' : qualityStatus === 'reviewFirst' ? 'watch' : 'block',
        detail:
          qualityStatus === 'readyForSurfacePlanning'
            ? 'Dry-run payload quality is ready for small surface planning.'
            : qualityStatus === 'reviewFirst'
              ? 'Dry-run payload quality has watch items to review before small surface planning.'
              : 'Dry-run payload quality is blocked before small surface planning.'
      },
      {
        id: 'surfaceScope',
        label: 'Surface scope',
        status: surfaceScope.length === 5 ? 'pass' : 'block',
        detail: 'Small tester surface planning is limited to example list, candidate rows, quality rows, review prompts, and runtime boundary copy.'
      },
      {
        id: 'disabledActions',
        label: 'Disabled actions',
        status: disabledActions.length === 6 ? 'pass' : 'block',
        detail: 'Save sequencing, CSV export, report printing, production use, final instructions, and tax-bracket instructions remain disabled.'
      },
      {
        id: 'reviewCopy',
        label: 'Review-only copy',
        status: 'pass',
        detail: 'Surface copy is framed as feature testing with made-up scenarios, not personal retirement decisions.'
      },
      {
        id: 'implementationBoundary',
        label: 'Implementation boundary',
        status: 'pass',
        detail: 'This gate plans a possible tester surface but does not implement UI, saved output, CSV output, reports, final instructions, or tax-bracket instructions.'
      }
    ],
    summary:
      surfaceStatus === 'readyForSurfacePlan'
        ? 'A very small limited tester packet surface can be planned from the runtime payload.'
        : surfaceStatus === 'reviewFirst'
          ? 'A very small limited tester packet surface needs review-first payload quality checks before planning.'
          : 'A very small limited tester packet surface is blocked until payload quality issues are repaired.',
    boundary:
      'Surface planning gate is runtime-only. It does not implement production UI, save sequencing output, export CSV, change reports, create final annual instructions, or create tax-bracket instructions.',
    nextStep: 'Use this gate to decide whether to plan a tiny tester-only surface in a later package.'
  };
  const dryRunPayload: OptimizerSyntheticTesterPacketReadinessMatrix['dryRunPayload'] = {
    status: dryRunStatus,
    items: dryRunItems,
    qualityGate,
    surfacePlanningGate,
    rows: [
      {
        id: 'payloadItems',
        label: 'Payload items',
        status: examples.length ? (missingPayloadRows.length ? 'watch' : 'pass') : 'block',
        detail: missingPayloadRows.length
          ? `Some examples need candidate display rows before payload review: ${missingPayloadRows.join(', ')}.`
          : `${dryRunItems.length} synthetic example payload item${dryRunItems.length === 1 ? '' : 's'} can be reviewed at runtime.`
      },
      {
        id: 'contractFields',
        label: 'Contract fields',
        status: packetContract.allowedFields.length && packetContract.excludedFields.length ? 'pass' : 'block',
        detail: 'Dry-run payload uses contract-approved fields and keeps excluded fields out.'
      },
      {
        id: 'reviewMetadata',
        label: 'Review metadata',
        status: reviewPromptIds.length ? 'pass' : 'block',
        detail: 'Each payload item carries review prompt ids for clarity, plausibility, missing context, and boundary checks.'
      },
      {
        id: 'outputBoundary',
        label: 'Output boundary',
        status: allGuarded ? 'pass' : 'block',
        detail: 'Dry-run payload is runtime-only and does not create UI, saved output, CSV output, reports, final instructions, or tax-bracket instructions.'
      }
    ],
    summary:
      dryRunStatus === 'readyForDryRunReview'
        ? 'Limited synthetic tester packet dry-run payload is ready for runtime review.'
        : dryRunStatus === 'reviewFirst'
          ? 'Limited synthetic tester packet dry-run payload needs review before tester use.'
          : 'Limited synthetic tester packet dry-run payload is blocked until contract or export guard issues are repaired.',
    boundary:
      'Dry-run payload is runtime-only review metadata. It is not saved, exported, printed, shown in production UI, or treated as final annual instructions.'
  };

  return {
    status,
    exampleCount: examples.length,
    readyExampleIds,
    reviewExampleIds,
    blockedExampleIds,
    rows,
    releaseScope: {
      visibleSections: ['candidateDisplayRows', 'qualityLabels', 'repairThemes', 'runtimeBoundary'],
      hiddenOutputs: ['savedSequencingOutput', 'csvSequencingOutput', 'reportOutput', 'productionUi', 'taxBracketInstructions', 'finalAnnualInstructions']
    },
    packetContract,
    dryRunPayload,
    summary:
      status === 'readyForLimitedTesterReview'
        ? 'Synthetic tester packet is ready for limited review with made-up scenarios.'
        : status === 'reviewFirst'
          ? 'Synthetic tester packet needs review-first handling before limited tester use.'
          : 'Synthetic tester packet is blocked until example readiness or export guards are repaired.',
    boundary:
      'Synthetic tester packet readiness is runtime-only. It does not save sequencing output, export CSV, change reports, change production UI, create final annual instructions, or create tax-bracket instructions.',
    nextStep: 'Use this matrix to decide whether a limited synthetic tester packet can be planned next.'
  };
}

export function selectOptimizerExperimentalDraftExampleMatrix(
  examples: Array<{
    id: string;
    label: string;
    draft: OptimizerExperimentalAnnualInstructionDraft;
  }>
): OptimizerExperimentalDraftExampleMatrix {
  const items = examples.map((example) => ({
    id: example.id,
    label: example.label,
    status: example.draft.readinessSummary.status,
    confidenceLevel: example.draft.readinessSummary.confidenceLevel,
    draftRows: example.draft.readinessSummary.rowCoverage.draftRows,
    modelledYears: example.draft.readinessSummary.rowCoverage.modelledYears,
    blockerCount: example.draft.readinessSummary.blockerCount,
    watchCount: example.draft.readinessSummary.watchCount,
    reviewItems: example.draft.readinessSummary.reviewItems
  }));
  const readyCount = items.filter((item) => item.status === 'readyForTesterReview').length;
  const reviewFirstCount = items.filter((item) => item.status === 'reviewFirst').length;
  const blockedCount = items.filter((item) => item.status === 'blocked').length;
  const status: OptimizerExperimentalDraftExampleMatrix['status'] = blockedCount
    ? 'blocked'
    : reviewFirstCount
      ? 'reviewFirst'
      : 'readyForTesterReview';
  const lowCoverage = items.filter((item) => item.draftRows < 3).map((item) => item.id);
  const blockedExamples = items.filter((item) => item.blockerCount > 0 || item.status === 'blocked').map((item) => item.id);
  const watchExamples = items.filter((item) => item.watchCount > 0).map((item) => item.id);
  const taxContextExamples = items.filter((item) => item.reviewItems.some((reviewItem) => reviewItem.toLowerCase().includes('tax'))).map((item) => item.id);
  const lowConfidence = items.filter((item) => item.confidenceLevel === 'low' || item.confidenceLevel === 'blocked').map((item) => item.id);
  const repairTargets: OptimizerExperimentalDraftExampleMatrix['repairTargets'] = [
    {
      id: 'rowCoverage',
      label: 'Draft row coverage',
      status: lowCoverage.length ? 'repair' : 'pass',
      exampleIds: lowCoverage,
      detail: lowCoverage.length ? 'Some examples have fewer than three draft rows in the draft window.' : 'All examples have enough draft-row coverage for matrix scoring.',
      repairAction: lowCoverage.length
        ? 'Inspect selected-candidate annual rows and account balance fields for these examples before widening tester presentation.'
        : 'No row coverage repair needed.'
    },
    {
      id: 'blockers',
      label: 'Blocked examples',
      status: blockedExamples.length ? 'repair' : 'pass',
      exampleIds: blockedExamples,
      detail: blockedExamples.length ? 'Some examples are blocked or have blocker evidence to repair.' : 'No examples are blocked in the matrix.',
      repairAction: blockedExamples.length
        ? 'Repair blocking evidence before treating these examples as tester-ready.'
        : 'No blocker repair needed.'
    },
    {
      id: 'watchItems',
      label: 'Watch items',
      status: watchExamples.length ? 'repair' : 'pass',
      exampleIds: watchExamples,
      detail: watchExamples.length ? 'Some examples need review-first handling before tester presentation.' : 'No examples carry watch items.',
      repairAction: watchExamples.length
        ? 'Review the watch-item labels for these examples and decide whether better runtime evidence can clear them.'
        : 'No watch-item repair needed.'
    },
    {
      id: 'taxContext',
      label: 'Tax context repair',
      status: taxContextExamples.length ? 'repair' : 'pass',
      exampleIds: taxContextExamples,
      detail: taxContextExamples.length ? 'Some examples need clearer tax context before tester review.' : 'Tax context does not appear as a repair theme in the matrix.',
      repairAction: taxContextExamples.length
        ? 'Improve annual tax, OAS recovery, and after-tax spending context for these examples without adding tax-bracket instructions.'
        : 'No tax context repair needed.'
    },
    {
      id: 'confidence',
      label: 'Confidence repair',
      status: lowConfidence.length ? 'repair' : 'pass',
      exampleIds: lowConfidence,
      detail: lowConfidence.length ? 'Some examples have low or blocked draft confidence.' : 'No examples have low or blocked draft confidence.',
      repairAction: lowConfidence.length
        ? 'Improve row coverage, account-order source evidence, or constraint evidence before tester presentation.'
        : 'No confidence repair needed.'
    }
  ];
  const testerPacketReadiness = selectOptimizerSyntheticTesterPacketReadinessMatrix(examples);

  return {
    status,
    exampleCount: items.length,
    readyCount,
    reviewFirstCount,
    blockedCount,
    items,
    repairTargets,
    testerPacketReadiness,
    summary:
      status === 'readyForTesterReview'
        ? 'All experimental draft examples are ready for synthetic tester review.'
        : status === 'reviewFirst'
          ? 'Some experimental draft examples need review before synthetic tester use.'
          : 'At least one experimental draft example is blocked and needs repair before tester review.',
    boundary:
      'Example matrix scoring is runtime-only. It does not save draft output, export CSV, change reports, change production UI, or change schemas.',
    nextStep: 'Use matrix results to repair weak examples before considering tester-facing presentation.'
  };
}

function buildCapacityObjective({
  plan,
  suggested,
  summaryById,
  candidateFamilies,
  eligibilityNotes,
  contract
}: {
  plan: V2PlanPayload;
  suggested: BoundedOptimizerCandidateRow | null;
  summaryById: Partial<Record<BoundedOptimizerCandidateId, ReturnType<typeof summarizeResult>>>;
  candidateFamilies: OptimizerCandidateFamily[];
  eligibilityNotes: BoundedOptimizerEligibilityNote[];
  contract: OptimizerContract;
}): OptimizerCapacityObjective {
  const selectedSummary = suggested ? summaryById[suggested.id] : null;
  const survivorNeedsReview = eligibilityNotes.some((note) => note.lever === 'survivor' && note.status === 'needsReview');
  const timingFamily = candidateFamilies.find((family) => family.id === 'benefitTimingGrid');
  return selectOptimizerCapacityObjective({
    contractReady: contract.status === 'readyForExtraction',
    selectedCandidateId: suggested?.id || null,
    selectedCandidateLabel: suggested?.label || 'No runtime capacity candidate',
    sustainableAnnualSpend: selectedSummary && selectedSummary.sustainableAnnualSpend > 0 ? selectedSummary.sustainableAnnualSpend : null,
    annualExpenseFloor: selectOptimizerMinimumAnnualExpenseFloor(plan),
    estateTarget: n(plan.inheritance) > 0 ? n(plan.inheritance) : null,
    projectedEstate: selectedSummary && selectedSummary.totalYears > 0 ? selectedSummary.endPortfolio : null,
    hasSecondPerson: !p2LooksBlank(plan.p2),
    survivorNeedsReview,
    benefitTimingStatus: timingFamily?.status || null
  });
}

function buildWithdrawalFeedbackReview({
  candidateFamilies,
  candidates,
  evidenceRows,
  readinessRows,
  searchPlan
}: {
  candidateFamilies: OptimizerCandidateFamily[];
  candidates: BoundedOptimizerCandidateRow[];
  evidenceRows: BoundedOptimizerEvidenceRow[];
  readinessRows: OptimizerReadinessRow[];
  searchPlan: OptimizerSearchPlan;
}): WithdrawalFeedbackReview {
  const familyStatus = candidateFamilies.find((family) => family.id === 'broadWithdrawalFamilies')?.status || 'blocked';
  const withdrawalCandidateCount = candidates.filter((candidate) => candidate.changedLevers.includes('withdrawalOrder')).length;
  const withdrawalEvidenceRows = evidenceRows.filter((row) => row.id.startsWith('withdrawalFamily'));
  const survivorNeedsReview = readinessRows.find((row) => row.id === 'survivor')?.status === 'review';

  const rows: WithdrawalFeedbackReviewRow[] = [
    {
      id: 'familyPresence',
      label: 'Broad families present',
      status: familyStatus === 'included' && withdrawalCandidateCount > 0 ? 'ready' : 'blocked',
      detail:
        familyStatus === 'included' && withdrawalCandidateCount > 0
          ? `${withdrawalCandidateCount} broad withdrawal-family checks are available for feedback.`
          : 'Broad withdrawal-family feedback waits for meaningful registered and flexible account balances.'
    },
    {
      id: 'evidenceClarity',
      label: 'Comparison evidence',
      status: withdrawalEvidenceRows.length >= 4 ? 'ready' : familyStatus === 'included' ? 'review' : 'blocked',
      detail:
        withdrawalEvidenceRows.length >= 4
          ? 'When a withdrawal family leads, Details shows funded years, money-left, tax, and OAS recovery evidence.'
          : familyStatus === 'included'
            ? 'Broad families can be reviewed in the option table even when one does not lead the current run.'
            : 'Withdrawal evidence is held until broad families can be compared.'
    },
    {
      id: 'annualInstructionBoundary',
      label: 'Annual actions deferred',
      status: searchPlan.annualOverrides === 'deferred' ? 'ready' : 'blocked',
      detail: 'The review compares broad families only; it does not create year-by-year account instructions.'
    },
    {
      id: 'guardrails',
      label: 'Household guardrails',
      status: survivorNeedsReview ? 'review' : 'ready',
      detail:
        survivorNeedsReview
          ? 'Feedback should check whether survivor setup is clear before widening drawdown sequencing.'
          : 'Survivor and estate guardrails do not block broad-family feedback for this plan.'
    },
    {
      id: 'savedOutputBoundary',
      label: 'Saved output boundary',
      status: 'ready',
      detail: 'No withdrawal-family result or feedback checkpoint is saved into the plan file.'
    }
  ];

  const hasBlocked = rows.some((row) => row.status === 'blocked');
  const hasReview = rows.some((row) => row.status === 'review');
  const status: WithdrawalFeedbackReview['status'] = hasBlocked ? 'needsInputReview' : hasReview ? 'holdForCleanup' : 'readyForFeedback';

  return {
    status,
    headline:
      status === 'readyForFeedback'
        ? 'Broad withdrawal-family evidence is ready for feedback.'
        : status === 'holdForCleanup'
          ? 'Broad withdrawal-family evidence can be reviewed, with a few assumptions to check first.'
          : 'Broad withdrawal-family feedback needs input cleanup first.',
    detail:
      'This checkpoint decides whether users understand the high-level drawdown comparison before annual withdrawal sequencing is planned.',
    rows,
    questions:
      status === 'needsInputReview'
        ? [
            'Which missing input made the broad withdrawal-family check unavailable?',
            'Does the user understand what account balances are needed before comparing drawdown families?',
            'Is it clear that annual sequencing has not started?'
          ]
        : [
            'Can the user explain current plan versus broad withdrawal-family comparison in their own words?',
            'Can the user identify that funded years, money left, tax, and OAS recovery are evidence, not instructions?',
            'Does the user understand why annual account-level sequencing is still deferred?'
          ],
    confusionSignals: [
      'User reads a broad family as a year-by-year withdrawal instruction.',
      'User looks for exact account amounts before reviewing the high-level trade-off.',
      'User treats lower tax or higher money left as advice instead of plan-review evidence.'
    ],
    worksheet:
      status === 'needsInputReview'
        ? [
            {
              id: 'understanding',
              label: 'Input understanding',
              prompt: 'Ask which missing input stopped the broad withdrawal-family comparison.',
              passSignal: 'User can identify the missing account-bucket or benefit input without reading it as an app error.'
            },
            {
              id: 'evidence',
              label: 'Evidence expectation',
              prompt: 'Ask what evidence they expected to see once inputs are ready.',
              passSignal: 'User expects high-level comparison evidence, not account-by-account instructions.'
            },
            {
              id: 'boundary',
              label: 'Boundary clarity',
              prompt: 'Ask whether it is clear that annual sequencing has not started.',
              passSignal: 'User understands blocked broad-family checks do not create a withdrawal plan.'
            },
            {
              id: 'decision',
              label: 'Next decision',
              prompt: 'Ask what should happen next before annual sequencing is considered.',
              passSignal: 'User points to input cleanup or clearer evidence, not immediate annual account actions.'
            }
          ]
        : [
            {
              id: 'understanding',
              label: 'Comparison understanding',
              prompt: 'Ask the user to explain the current plan versus broad withdrawal-family comparison.',
              passSignal: 'User describes it as a high-level comparison, not a command to change accounts.'
            },
            {
              id: 'evidence',
              label: 'Evidence interpretation',
              prompt: 'Ask which evidence rows changed and why those rows matter.',
              passSignal: 'User names funded years, money left, tax, or OAS recovery as review evidence.'
            },
            {
              id: 'boundary',
              label: 'Instruction boundary',
              prompt: 'Ask whether the screen tells them exactly what to withdraw each year.',
              passSignal: 'User answers no and recognizes annual account-level sequencing is deferred.'
            },
            {
              id: 'decision',
              label: 'Next decision',
              prompt: 'Ask whether the evidence is clear enough to plan annual sequencing later.',
              passSignal: 'User can say proceed, hold, or simplify with a specific reason.'
            }
          ],
    decision:
      status === 'readyForFeedback'
        ? {
            status: 'collectFeedback',
            label: 'Collect feedback before annual sequencing',
            detail: 'The next step is user feedback on broad-family evidence, not annual account-level architecture.',
            requiredEvidence: [
              'Users can explain broad families as comparisons.',
              'Users understand money-left and tax rows as evidence.',
              'Users do not read the output as account instructions.'
            ]
          }
        : status === 'needsInputReview'
          ? {
              status: 'cleanUpInputs',
              label: 'Clean up inputs before feedback',
              detail: 'The broad-family check is not ready for feedback until blocked inputs are repaired.',
              requiredEvidence: [
                'Meaningful registered and flexible account balances are present.',
                'The comparison can produce broad withdrawal-family candidates.',
                'The user understands why the check was unavailable.'
              ]
            }
          : {
              status: 'holdAnnualSequencing',
              label: 'Hold annual sequencing',
              detail: 'Review assumptions and copy before planning annual account-level sequencing.',
              requiredEvidence: [
                'Survivor or household guardrails are clear.',
                'Broad-family evidence is understandable without account instructions.',
                'No confusion signals appear in feedback.'
              ]
            },
    outcome:
      status === 'readyForFeedback'
        ? {
            status: 'readyToReview',
            label: 'Ready to review with testers',
            detail: 'Use the worksheet to decide whether broad-family evidence is understood before annual sequencing is planned.',
            nextSteps: [
              'Run the worksheet against at least one plan where a broad family leads.',
              'Record whether users understand the evidence without account instructions.',
              'Hold annual sequencing if any confusion signal appears.'
            ]
          }
        : status === 'needsInputReview'
          ? {
              status: 'repairInputs',
              label: 'Repair inputs first',
              detail: 'The broad-family review is blocked until input cleanup makes the comparison meaningful.',
              nextSteps: [
                'Repair missing account-bucket readiness.',
                'Run Results again after inputs are corrected.',
                'Do not plan annual sequencing from a blocked comparison.'
              ]
            }
          : {
              status: 'deferSequencing',
              label: 'Defer sequencing and simplify',
              detail: 'Broad-family evidence needs clearer assumptions or copy before annual sequencing planning.',
              nextSteps: [
                'Review survivor or household guardrails.',
                'Simplify broad-family explanation if users confuse it with instructions.',
                'Keep annual sequencing deferred until the worksheet passes.'
              ]
            },
    closeoutSummary:
      status === 'readyForFeedback'
        ? {
            status: 'readyToClose',
            label: 'Feedback loop ready to close',
            detail: 'The review is ready to close when the worksheet passes without confusion signals.',
            evidenceSummary: 'Broad-family evidence is present for funded years, money left, tax, and OAS recovery.',
            boundarySummary: 'The result stays review-only and does not create annual account instructions or saved output.',
            nextReview: 'Feedback notes can support a later decision on whether annual sequencing architecture is ready to plan.'
          }
        : status === 'needsInputReview'
          ? {
              status: 'inputCleanupFirst',
              label: 'Closeout blocked by inputs',
              detail: 'The feedback loop stays open until missing account or benefit inputs are repaired.',
              evidenceSummary: 'Broad-family evidence is incomplete because the comparison could not run cleanly.',
              boundarySummary: 'The blocked state is a readiness signal, not a plan change or account instruction.',
              nextReview: 'Input cleanup, a fresh Results run, and a repeated worksheet come before sequencing architecture is considered.'
            }
          : {
              status: 'holdAndSimplify',
              label: 'Closeout should hold',
              detail: 'The feedback loop stays on hold while household assumptions or copy are clarified.',
              evidenceSummary: 'Broad-family evidence can be reviewed, but assumptions need a clearer pass signal.',
              boundarySummary: 'Annual sequencing remains deferred and no saved output is created.',
              nextReview: 'A simpler evidence surface and another worksheet pass come before any architecture planning decision.'
            },
    nextDecision:
      status === 'readyForFeedback'
        ? 'Collect feedback on whether broad families are understandable before planning annual account-level sequencing.'
        : 'Clean up blocked inputs or unclear household assumptions before planning annual account-level sequencing.'
  };
}

function buildFeedbackPackageIndex({
  goalReview,
  withdrawalFeedbackReview
}: {
  goalReview: OptimizerGoalReview;
  withdrawalFeedbackReview: WithdrawalFeedbackReview;
}): OptimizerFeedbackPackageIndex {
  const withdrawalStatus =
    withdrawalFeedbackReview.status === 'readyForFeedback'
      ? 'ready'
      : withdrawalFeedbackReview.status === 'holdForCleanup'
        ? 'review'
        : 'blocked';

  const annualSequencingStatus: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['status'] =
    withdrawalFeedbackReview.status === 'readyForFeedback' ? 'maybeLater' : 'notReady';
  const annualSequencingRows: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['rows'] = [
    {
      id: 'userClarity',
      label: 'User clarity',
      status: withdrawalFeedbackReview.status === 'readyForFeedback' ? 'review' : 'blocked',
      detail:
        withdrawalFeedbackReview.status === 'readyForFeedback'
          ? 'Broad-family evidence can be tested for clarity, but annual sequencing still needs repeated feedback.'
          : 'Blocked or unclear broad-family feedback cannot support annual sequencing planning.'
    },
    {
      id: 'performance',
      label: 'Performance budget',
      status: 'review',
      detail: 'Annual sequencing would add heavier search work and needs a separate performance budget before architecture.'
    },
    {
      id: 'explainability',
      label: 'Explainability',
      status: 'review',
      detail: 'Users must understand why a broad family was selected before seeing annual account-level detail.'
    },
    {
      id: 'provinceEdgeCases',
      label: 'Province and edge cases',
      status: 'review',
      detail: 'Ontario 2026 assumptions, locked-in accounts, survivor setup, and low-income benefit cases need explicit scope decisions.'
    },
    {
      id: 'feedbackDepth',
      label: 'Feedback depth',
      status: 'blocked',
      detail: 'One successful example-plan review is not enough to mark annual sequencing ready.'
    }
  ];
  const annualSequencingQuestions: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['architectureQuestions'] = [
    {
      id: 'funding',
      label: 'Funding question',
      question: 'Would annual sequencing improve funded years without hiding a projected shortfall?',
      evidenceSource: 'Funded years and first-shortfall evidence from broad-family review.',
      boundary: 'Question only; no annual withdrawal path is generated.'
    },
    {
      id: 'estate',
      label: 'Estate question',
      question: 'Would annual sequencing improve projected money left without weakening the spending answer?',
      evidenceSource: 'Projected money-left evidence and estate guardrails.',
      boundary: 'Question only; no estate-maximizing instruction is created.'
    },
    {
      id: 'taxOas',
      label: 'Tax and OAS question',
      question: 'Can tax and OAS recovery changes be explained before showing account-level annual detail?',
      evidenceSource: 'Lifetime tax and OAS recovery diagnostics.',
      boundary: 'Question only; no tax-minimizing account order is applied.'
    },
    {
      id: 'cashFlexibility',
      label: 'Cash and flexibility question',
      question: 'Can cash-wedge and flexibility language stay descriptive if annual account detail is later added?',
      evidenceSource: 'Cash-wedge boundary and flexibility outcome feedback.',
      boundary: 'Question only; no refill rule, spending rule, or account instruction is created.'
    }
  ];
  const annualSequencingPerformanceBudget: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['performanceBudget'] = {
    headline: 'Performance budget needs a separate architecture pass.',
    rows: [
      {
        id: 'candidateLimit',
        label: 'Candidate limit',
        status: 'ready',
        detail: 'The current bounded optimizer keeps the runtime candidate set capped before any annual sequencing exists.'
      },
      {
        id: 'fullSuiteCost',
        label: 'Full-suite cost',
        status: 'review',
        detail: 'The existing example-plan optimizer readiness test is the long pole, so deeper sequencing needs measured budgets before implementation.'
      },
      {
        id: 'routeProbeCaveat',
        label: 'Route-probe caveat',
        status: 'review',
        detail: 'The known sandbox route-probe EPERM failure is non-blocking, but future sequencing work should not add new server assumptions.'
      },
      {
        id: 'deviceRisk',
        label: 'Device risk',
        status: 'review',
        detail: 'Lower-end local devices need responsive re-optimization before annual sequencing becomes a normal feature.'
      }
    ],
    boundary: 'Performance budget rows are planning evidence only; they do not run annual sequencing, add workers, add servers, or change optimizer search.'
  };
  const annualSequencingExplainabilityGuide: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['explainabilityGuide'] = {
    headline: 'Explainability must pass before annual account detail.',
    rows: [
      {
        id: 'familyReason',
        label: 'Why this family',
        status: 'review',
        detail: 'Users should be able to say why the broad withdrawal family appeared without treating it as an instruction.',
        passSignal: 'User describes the family as a comparison based on funded years, money left, tax, and OAS evidence.'
      },
      {
        id: 'evidencePriority',
        label: 'Evidence priority',
        status: 'review',
        detail: 'Users should start with spending, funded years, and projected money left before tax and OAS diagnostics.',
        passSignal: 'User names viability and estate trade-offs before tax optimization.'
      },
      {
        id: 'tradeoffLanguage',
        label: 'Trade-off language',
        status: 'review',
        detail: 'The explanation should make benefits and drawbacks visible without calling one path the right action.',
        passSignal: 'User can name at least one trade-off and still says the result is for review.'
      },
      {
        id: 'instructionBoundary',
        label: 'Instruction boundary',
        status: 'blocked',
        detail: 'Annual account detail cannot be designed until users stop expecting exact withdrawal instructions from broad-family evidence.',
        passSignal: 'User understands annual account-level sequencing is deferred and no account action is being provided.'
      }
    ],
    boundary: 'Explainability rows are review criteria only; they do not create advice, account instructions, saved output, or annual sequencing.'
  };
  const annualSequencingScopeRegister: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['scopeRegister'] = {
    headline: 'Province and edge-case scope must stay narrow.',
    rows: [
      {
        id: 'ontarioOnly',
        label: 'Ontario 2026 scope',
        status: 'ready',
        detail: 'Any future internal prototype should keep Ontario 2026 tax assumptions and avoid province expansion.'
      },
      {
        id: 'lockedInAccounts',
        label: 'Locked-in accounts',
        status: 'blocked',
        detail: 'LIRA/LIF cases should block annual sequencing architecture until locked-in rules are explicitly scoped.'
      },
      {
        id: 'survivorSetup',
        label: 'Survivor setup',
        status: 'review',
        detail: 'Two-person plans need survivor setup review before account-level annual detail can be trusted.'
      },
      {
        id: 'lowIncomeBenefits',
        label: 'Low-income benefits',
        status: 'review',
        detail: 'GIS and low-income benefit interactions remain out of scope unless explicitly planned.'
      },
      {
        id: 'edgeCaseDecision',
        label: 'Edge-case decision',
        status: 'blocked',
        detail: 'Annual sequencing cannot move to prototype until edge cases are named as included, blocked, or deferred.'
      }
    ],
    boundary: 'Scope rows constrain future architecture only; they do not add province support, locked-in account rules, GIS modelling, saved output, or annual sequencing.'
  };
  const annualSequencingFeedbackDepthPlan: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['feedbackDepthPlan'] = {
    headline: 'Feedback depth needs several household stories.',
    rows: [
      {
        id: 'dbPensionCouple',
        label: 'DB pension couple',
        status: 'review',
        detail: 'Feedback should confirm pension-heavy households understand broad-family evidence as review context.'
      },
      {
        id: 'earlyRetiredCouple',
        label: 'Early-retired couple',
        status: 'review',
        detail: 'Feedback should confirm taxable-heavy bridge-year households understand the spending and funding trade-off.'
      },
      {
        id: 'alreadyRetiredCouple',
        label: 'Already-retired couple',
        status: 'review',
        detail: 'Feedback should confirm drawdown households understand tax and OAS diagnostics without expecting account instructions.'
      },
      {
        id: 'confusionSignals',
        label: 'Confusion signals',
        status: 'blocked',
        detail: 'Any advice, instruction, or exact-account expectation keeps annual sequencing readiness blocked.'
      },
      {
        id: 'decisionThreshold',
        label: 'Decision threshold',
        status: 'blocked',
        detail: 'Do not move toward prototype until at least three household stories pass without confusion signals.'
      }
    ],
    boundary: 'Feedback-depth rows are readiness criteria only; they do not collect personal feedback, save feedback, or start annual sequencing.'
  };
  const annualSequencingArchitectureConstraints: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['architectureConstraints'] = {
    headline: 'Future sequencing architecture has hard non-goals.',
    rows: [
      {
        id: 'nonGoals',
        label: 'Non-goals',
        status: 'ready',
        detail: 'Do not add advice, cloud accounts, advisor tooling, broad UI redesign, or normal UI execution.'
      },
      {
        id: 'candidateExplosion',
        label: 'Candidate explosion',
        status: 'blocked',
        detail: 'Do not create year-by-year path explosions until a bounded search shape and cutoff rules are documented.'
      },
      {
        id: 'schemaBoundary',
        label: 'Schema boundary',
        status: 'blocked',
        detail: 'Do not change saved plan schema or engine output schema without a separate planned decision.'
      },
      {
        id: 'uiBoundary',
        label: 'UI boundary',
        status: 'blocked',
        detail: 'Do not expose annual sequencing in normal Overview or compact Details before an internal prototype passes.'
      },
      {
        id: 'rollbackBoundary',
        label: 'Rollback boundary',
        status: 'ready',
        detail: 'Future prototype work should land behind a clear internal boundary and be removable in one commit if it misbehaves.'
      }
    ],
    boundary: 'Architecture constraints are guardrails only; they do not create a prototype, schema migration, UI action, or annual sequencing result.'
  };
  const annualSequencingPrototypeDecisionRegister: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['prototypeDecisionRegister'] = {
    headline: 'Prototype decision remains blocked.',
    status: 'blocked',
    rows: [
      {
        id: 'feedbackDepth',
        label: 'Feedback depth',
        status: 'blocked',
        detail: 'Feedback depth remains blocked until at least three household stories pass without confusion signals.'
      },
      {
        id: 'explainability',
        label: 'Explainability',
        status: 'blocked',
        detail: 'Instruction-boundary feedback remains blocked until users stop expecting exact withdrawal instructions.'
      },
      {
        id: 'performance',
        label: 'Performance',
        status: 'review',
        detail: 'Performance budget needs measured targets before any internal-test-only prototype candidacy.'
      },
      {
        id: 'scope',
        label: 'Scope',
        status: 'blocked',
        detail: 'Locked-in accounts, survivor setup, and edge-case decisions still block prototype candidacy.'
      },
      {
        id: 'schema',
        label: 'Schema',
        status: 'blocked',
        detail: 'Saved plan schema and engine output schema cannot change without a separate planned decision.'
      },
      {
        id: 'ui',
        label: 'UI boundary',
        status: 'blocked',
        detail: 'Normal Overview and compact Details cannot expose annual sequencing prototype content.'
      },
      {
        id: 'rollback',
        label: 'Rollback',
        status: 'ready',
        detail: 'A future internal prototype must be removable in one commit before it can be considered.'
      }
    ],
    nextStep: 'Keep deferring until every blocker is cleared; then ask for an explicit internal-test-only prototype decision.',
    boundary:
      'Prototype decision register is readiness evidence only; it does not create an internal prototype, annual sequencing result, schema change, UI action, or saved output.'
  };
  const annualSequencingRollbackContainmentPlan: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['rollbackContainmentPlan'] = {
    headline: 'Rollback containment must be proven before any prototype.',
    rows: [
      {
        id: 'oneCommitRemoval',
        label: 'One-commit removal',
        status: 'ready',
        detail: 'A future prototype must be isolated enough to remove in one commit without touching saved plans or normal results.'
      },
      {
        id: 'internalBoundaryName',
        label: 'Internal boundary name',
        status: 'review',
        detail: 'Any future module should use internal-test-only naming so it cannot be mistaken for a user-facing feature.'
      },
      {
        id: 'persistenceAudit',
        label: 'Persistence audit',
        status: 'blocked',
        detail: 'No .plan.json files, saved plan schema changes, or engine output schema changes are allowed in prototype planning.'
      },
      {
        id: 'uiContainment',
        label: 'UI containment',
        status: 'blocked',
        detail: 'Do not expose annual sequencing in Overview, compact Details, apply actions, save actions, or normal plan controls.'
      },
      {
        id: 'verificationBeforeMerge',
        label: 'Verification before merge',
        status: 'review',
        detail: 'Focused optimizer/UI tests and the full probe suite must stay clean except for the known route-probe sandbox caveat.'
      }
    ],
    boundary:
      'Rollback containment is planning evidence only; it does not add a sequencing module, prototype path, saved field, engine output, or user action.'
  };
  const annualSequencingTestOnlyShapePlan: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['testOnlyShapePlan'] = {
    headline: 'Test-only prototype shape remains planning-only.',
    rows: [
      {
        id: 'existingAnnualRows',
        label: 'Existing annual rows',
        status: 'review',
        detail: 'Any future test-only shape should reuse existing annual projection rows instead of creating a new saved result.'
      },
      {
        id: 'accountBuckets',
        label: 'Account buckets',
        status: 'review',
        detail: 'Account-bucket labels may describe broad registered, TFSA, non-registered, and cash evidence without ordering exact withdrawals.'
      },
      {
        id: 'allowedDiagnostics',
        label: 'Allowed diagnostics',
        status: 'review',
        detail: 'Allowed runtime diagnostics are funded years, money left, tax and OAS changes, and instruction-boundary checks.'
      },
      {
        id: 'disallowedOutputs',
        label: 'Disallowed outputs',
        status: 'blocked',
        detail: 'Disallow account instructions, saved sequencing results, normal UI actions, apply controls, and save controls.'
      },
      {
        id: 'planningOnly',
        label: 'Planning only',
        status: 'blocked',
        detail: 'Shape planning does not imply implementation, prototype start, schema change, or user-facing annual sequencing.'
      }
    ],
    boundary:
      'Test-only shape notes are planning evidence only; they do not implement sequencing, produce account instructions, save sequencing results, or expose normal UI actions.'
  };
  const annualSequencingPrototypeReadinessSummary: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['prototypeReadinessSummary'] = {
    headline: 'Annual sequencing prototype is still blocked.',
    status: 'stillBlocked',
    rows: [
      {
        id: 'feedback',
        label: 'Feedback',
        status: 'blocked',
        detail: 'Feedback depth and instruction-boundary signals are not strong enough for prototype candidacy.'
      },
      {
        id: 'scope',
        label: 'Scope',
        status: 'blocked',
        detail: 'Locked-in accounts, survivor setup, and edge cases still need explicit include, block, or defer decisions.'
      },
      {
        id: 'performance',
        label: 'Performance',
        status: 'review',
        detail: 'Performance budgets need measured local-device targets before any internal test can be considered.'
      },
      {
        id: 'schemaUi',
        label: 'Schema and UI',
        status: 'blocked',
        detail: 'Saved schemas, engine output schemas, Overview, compact Details, apply actions, and save actions remain out of scope.'
      },
      {
        id: 'rollback',
        label: 'Rollback',
        status: 'ready',
        detail: 'Rollback expectations are clear: any future prototype must be removable in one commit.'
      }
    ],
    decision: 'Keep deferring and ask for an explicit prototype decision only after blocked rows clear.',
    boundary:
      'Readiness reassessment is a checkpoint only; it does not start a prototype, clear blockers, change schemas, expose UI actions, or produce annual sequencing.'
  };
  const annualSequencingBlockerClearanceEvidence: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['blockerClearanceEvidence'] = {
    headline: 'Blockers need evidence before they can move.',
    rows: [
      {
        id: 'feedbackArtifacts',
        label: 'Feedback artifacts',
        status: 'needed',
        detail: 'Collect at least three household reviews that describe broad withdrawal-family evidence as something to review.',
        clearanceSignal: 'Each review names the spending answer, funded years, money left, and the no-instruction boundary without confusion.'
      },
      {
        id: 'explainabilityPlayback',
        label: 'Explainability playback',
        status: 'needed',
        detail: 'Users should be able to explain why the recommended family appeared before any account-level detail is considered.',
        clearanceSignal: 'Users repeat the rationale in their own words without asking for exact account draw orders.'
      },
      {
        id: 'performanceMeasurement',
        label: 'Performance measurement',
        status: 'needed',
        detail: 'Measure local-device optimizer timing before considering any heavier annual sequencing test path.',
        clearanceSignal: 'A documented budget shows responsive re-optimization on lower-end devices without server assumptions.'
      },
      {
        id: 'scopeDecisionLog',
        label: 'Scope decision log',
        status: 'blocked',
        detail: 'Locked-in accounts, survivor setup, and edge cases still need explicit include, block, or defer decisions.',
        clearanceSignal: 'Every edge case has a documented decision and no hidden expansion beyond Ontario 2026 scope.'
      },
      {
        id: 'schemaUiDiff',
        label: 'Schema and UI diff',
        status: 'blocked',
        detail: 'A future clearance review must prove saved schema, engine output schema, Overview, compact Details, and normal actions stay unchanged.',
        clearanceSignal: 'Diff review shows no saved output, no engine output widening, and no normal UI sequencing action.'
      },
      {
        id: 'rollbackRehearsal',
        label: 'Rollback rehearsal',
        status: 'needed',
        detail: 'Before any internal candidate, rehearse removal boundaries using docs and tests rather than prototype code.',
        clearanceSignal: 'A rollback note explains the files that would be removed and the verification that would prove removal.'
      }
    ],
    boundary:
      'Clearance evidence is a future checklist only; it does not clear blockers, authorize a prototype, add annual sequencing, change schemas, save results, or expose UI actions.'
  };
  const annualSequencingFeedbackArtifactTemplate: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['feedbackArtifactTemplate'] = {
    headline: 'Feedback artifacts need consistent review prompts.',
    rows: [
      {
        id: 'rememberedAnswer',
        label: 'Remembered answer',
        prompt: 'What retirement answer and monthly spending number did the reviewer remember after leaving Overview?',
        passSignal: 'Reviewer names the after-tax monthly spending range and understands it is in today’s dollars.',
        blockedSignal: 'Reviewer cannot find the answer or treats it as a guaranteed amount.'
      },
      {
        id: 'evidenceRanking',
        label: 'Evidence ranking',
        prompt: 'Which evidence mattered most: funded years, money left, tax, OAS, cash wedge, or flexibility?',
        passSignal: 'Reviewer starts with funded years or money left before tax and OAS diagnostics.',
        blockedSignal: 'Reviewer treats tax or OAS savings as the main reason to follow a path.'
      },
      {
        id: 'instructionBoundary',
        label: 'Instruction boundary',
        prompt: 'Did the reviewer describe the plan as advice, a command, or something to review?',
        passSignal: 'Reviewer says the plan is something to review and does not expect exact account instructions.',
        blockedSignal: 'Reviewer expects the tool to tell them which account to withdraw from each year.'
      },
      {
        id: 'cashFlexibilityLanguage',
        label: 'Cash and flexibility language',
        prompt: 'Did cash-wedge or flexibility language help, distract, or sound like an instruction?',
        passSignal: 'Reviewer describes the language as a buffer explanation, not a required action.',
        blockedSignal: 'Reviewer reads cash-wedge refill language as an instruction.'
      },
      {
        id: 'decisionOutcome',
        label: 'Decision outcome',
        prompt: 'Should the next step be collect more feedback, clean up inputs, defer sequencing, or simplify evidence?',
        passSignal: 'Reviewer can choose a review outcome without asking for annual sequencing to be added.',
        blockedSignal: 'Reviewer asks to move straight to annual account-level sequencing.'
      }
    ],
    boundary:
      'Feedback artifact prompts are review scaffolding only; they do not collect feedback, save feedback, clear blockers, create advice, or start annual sequencing.'
  };
  const annualSequencingFeedbackCloseoutRubric: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['feedbackCloseoutRubric'] = {
    headline: 'Feedback closeout needs a conservative rubric.',
    rows: [
      {
        id: 'pass',
        label: 'Pass signal',
        status: 'review',
        detail: 'Reviewer remembers the spending answer, understands the evidence order, and describes the result as something to review.',
        nextStep: 'Record as evidence for continued readiness review, not as prototype approval.'
      },
      {
        id: 'watch',
        label: 'Watch signal',
        status: 'review',
        detail: 'Reviewer understands the plan but needs help with cash wedge, flexibility, tax, or OAS wording.',
        nextStep: 'Simplify copy or evidence labels before collecting more readiness evidence.'
      },
      {
        id: 'blocked',
        label: 'Blocked signal',
        status: 'blocked',
        detail: 'Reviewer expects advice, a command, exact annual account withdrawals, or saved sequencing output.',
        nextStep: 'Keep annual sequencing blocked and improve instruction-boundary language.'
      },
      {
        id: 'defer',
        label: 'Defer signal',
        status: 'blocked',
        detail: 'Reviewer cannot explain the broad withdrawal family or the evidence trade-off.',
        nextStep: 'Do not widen optimizer scope; improve broad-family explainability first.'
      },
      {
        id: 'repeat',
        label: 'Repeat signal',
        status: 'review',
        detail: 'Evidence is promising but comes from too few household stories or one narrow persona.',
        nextStep: 'Repeat with more household types before revisiting prototype readiness.'
      }
    ],
    boundary:
      'Feedback closeout rubric is review guidance only; it does not score users, save responses, clear blockers, approve a prototype, or add annual sequencing.'
  };
  const annualSequencingFeedbackDecisionLedger: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['feedbackDecisionLedger'] = {
    headline: 'Feedback decisions need a lightweight ledger.',
    rows: [
      {
        id: 'collectMore',
        label: 'Collect more feedback',
        status: 'review',
        detail: 'Use when feedback is understandable but coverage is too narrow across household stories.',
        evidenceNeeded: 'More household reviews using the same prompts and closeout rubric.'
      },
      {
        id: 'cleanCopy',
        label: 'Clean up copy',
        status: 'review',
        detail: 'Use when reviewers understand the plan but stumble over cash wedge, flexibility, tax, or OAS wording.',
        evidenceNeeded: 'Specific copy confusion notes and a follow-up readability pass.'
      },
      {
        id: 'cleanInputs',
        label: 'Clean up inputs',
        status: 'review',
        detail: 'Use when blocked or missing inputs make feedback unreliable before sequencing is reconsidered.',
        evidenceNeeded: 'Input readiness notes showing the household story can be reviewed without blocked data.'
      },
      {
        id: 'holdSequencing',
        label: 'Hold annual sequencing',
        status: 'blocked',
        detail: 'Use when reviewers expect advice, exact account withdrawals, saved sequencing output, or a command.',
        evidenceNeeded: 'Instruction-boundary cleanup and repeated feedback without account-order expectations.'
      },
      {
        id: 'reassessLater',
        label: 'Reassess later',
        status: 'blocked',
        detail: 'Use when feedback is promising but still lacks scope, performance, schema, UI, or rollback evidence.',
        evidenceNeeded: 'A future checkpoint showing every blocker has evidence, not just favorable feedback.'
      }
    ],
    boundary:
      'Feedback decision ledger is a review summary only; it is not saved, does not store feedback, does not clear blockers, and does not authorize annual sequencing.'
  };
  const annualSequencingFeedbackCoverageMatrix: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['feedbackCoverageMatrix'] = {
    headline: 'Feedback coverage must span several household stories.',
    rows: [
      {
        id: 'dbPensionCouple',
        label: 'DB pension couple',
        status: 'review',
        detail: 'Pension-heavy couples should understand the recommended spending answer and survivor-sensitive evidence.',
        missingEvidence: 'Need repeated feedback beyond the first DB pension example before any blocker can move.'
      },
      {
        id: 'bridgeYears',
        label: 'Bridge-year household',
        status: 'review',
        detail: 'Early-retirement households should understand taxable, registered, TFSA, and cash bridge evidence without account-order instructions.',
        missingEvidence: 'Need a review where bridge-year funding is clear without annual sequencing detail.'
      },
      {
        id: 'alreadyRetired',
        label: 'Already-retired household',
        status: 'review',
        detail: 'Drawdown households should understand funded years, money left, tax, and OAS diagnostics as review evidence.',
        missingEvidence: 'Need feedback from a household already taking withdrawals.'
      },
      {
        id: 'survivorCase',
        label: 'Survivor case',
        status: 'blocked',
        detail: 'Two-person plans with survivor-sensitive pensions or benefits need clearer review before account-level sequencing is reconsidered.',
        missingEvidence: 'Need survivor-case feedback that does not turn pension or account detail into advice.'
      },
      {
        id: 'lowIncomeBoundary',
        label: 'Low-income boundary',
        status: 'blocked',
        detail: 'GIS and low-income benefit interactions remain out of scope unless explicitly planned.',
        missingEvidence: 'Need a scope decision before low-income benefit cases can count toward sequencing readiness.'
      }
    ],
    boundary:
      'Feedback coverage matrix is review planning only; it does not collect feedback, save feedback, expand scope, clear blockers, or start annual sequencing.'
  };
  const annualSequencingEvidenceQualityChecklist: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['evidenceQualityChecklist'] = {
    headline: 'Feedback evidence needs quality checks before it counts.',
    rows: [
      {
        id: 'specificQuote',
        label: 'Specific reviewer wording',
        status: 'review',
        detail: 'Future review notes should capture the reviewer’s own wording about the spending answer and evidence order.',
        guardrail: 'Do not store personal identifiers or raw personal financial details.'
      },
      {
        id: 'scenarioContext',
        label: 'Scenario context',
        status: 'review',
        detail: 'Each note should identify the household story type, such as DB pension, bridge-year, drawdown, survivor, or boundary case.',
        guardrail: 'Use example-plan context only; do not persist user-submitted plan data.'
      },
      {
        id: 'evidenceOrder',
        label: 'Evidence order',
        status: 'review',
        detail: 'Count feedback only when the reviewer starts from spending, funded years, and money left before tax and OAS.',
        guardrail: 'Do not treat tax savings alone as readiness evidence.'
      },
      {
        id: 'confusionSignal',
        label: 'Confusion signal',
        status: 'blocked',
        detail: 'Advice, command, guaranteed-spend, account-order, or saved-output expectations keep the evidence blocked.',
        guardrail: 'Do not reclassify confusion as a pass signal without another review.'
      },
      {
        id: 'nonPersistence',
        label: 'Non-persistence',
        status: 'blocked',
        detail: 'Feedback evidence must remain outside saved plan files and engine output.',
        guardrail: 'No .plan.json files, saved feedback fields, or engine output fields are allowed.'
      }
    ],
    boundary:
      'Evidence quality checklist is review guidance only; it does not save feedback, score reviewers, clear blockers, change schemas, or add annual sequencing.'
  };
  const annualSequencingPrototypeDecisionPacket: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['prototypeDecisionPacket'] = {
    headline: 'A prototype decision packet is not ready.',
    rows: [
      {
        id: 'feedbackSummary',
        label: 'Feedback summary',
        status: 'review',
        detail: 'Summarize repeated household feedback using the artifact template, closeout rubric, decision ledger, coverage matrix, and quality checklist.',
        requiredBeforeAsk: 'At least three clean household stories with no advice, command, account-order, or saved-output confusion.'
      },
      {
        id: 'scopeSummary',
        label: 'Scope summary',
        status: 'blocked',
        detail: 'Name included, blocked, and deferred cases before asking whether an internal prototype is appropriate.',
        requiredBeforeAsk: 'Explicit decisions for locked-in accounts, survivor cases, low-income benefits, and Ontario-only boundaries.'
      },
      {
        id: 'performanceSummary',
        label: 'Performance summary',
        status: 'blocked',
        detail: 'Document a local-device performance budget before any heavier annual sequencing test path is discussed.',
        requiredBeforeAsk: 'Measured timing target and cutoff rule for lower-end devices without server assumptions.'
      },
      {
        id: 'schemaUiSummary',
        label: 'Schema and UI summary',
        status: 'blocked',
        detail: 'Prove saved schemas, engine output schemas, Overview, compact Details, apply actions, and save actions stay unchanged.',
        requiredBeforeAsk: 'Diff review showing no saved fields, no engine output fields, and no normal UI sequencing action.'
      },
      {
        id: 'rollbackSummary',
        label: 'Rollback summary',
        status: 'review',
        detail: 'Summarize how a future internal-only prototype would be removed if it misbehaved.',
        requiredBeforeAsk: 'One-commit removal plan and verification list before prototype code exists.'
      }
    ],
    boundary:
      'Prototype decision packet is a future ask checklist only; it does not ask for approval, clear blockers, add prototype code, change schemas, or expose annual sequencing.'
  };
  const annualSequencingReadinessRunway: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['readinessRunway'] = {
    headline: 'Readiness runway still points to deferral.',
    status: 'defer',
    rows: [
      {
        id: 'keepDeferring',
        label: 'Keep deferring',
        status: 'blocked',
        detail: 'Annual account-level sequencing should remain deferred because feedback, scope, performance, schema/UI, and rollback evidence are not complete.'
      },
      {
        id: 'nextEvidence',
        label: 'Next evidence',
        status: 'review',
        detail: 'Continue collecting comparable household feedback using the artifact template, closeout rubric, decision ledger, coverage matrix, and quality checklist.'
      },
      {
        id: 'nextCleanup',
        label: 'Next cleanup',
        status: 'review',
        detail: 'Clean up any copy or input friction before interpreting feedback as readiness evidence.'
      },
      {
        id: 'nextPerformance',
        label: 'Next performance',
        status: 'blocked',
        detail: 'Do not start prototype work until a local-device performance budget and cutoff rule are documented.'
      },
      {
        id: 'explicitDecisionLater',
        label: 'Explicit decision later',
        status: 'blocked',
        detail: 'Ask for a prototype decision only after the future decision packet is complete and every blocker has evidence.'
      }
    ],
    recommendation: 'Keep annual sequencing deferred; continue feedback readiness and cleanup work before any prototype decision is requested.',
    boundary:
      'Readiness runway is a checkpoint only; it does not request a decision, start a prototype, change schemas, save results, or expose annual sequencing.'
  };
  const annualSequencingReadinessSectionIndex: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['readinessSectionIndex'] = {
    headline: 'Readiness sections are indexed for review.',
    rows: [
      {
        id: 'baseReadiness',
        label: 'Base readiness and architecture gates',
        group: 'prototypeGate',
        detail: 'Covers the existing readiness rows, architecture questions, performance, explainability, scope, and hard non-goals.'
      },
      {
        id: 'feedbackEvidence',
        label: 'Feedback evidence package',
        group: 'evidence',
        detail: 'Covers blocker clearance evidence, feedback artifact prompts, closeout rubric, decision ledger, and household coverage.'
      },
      {
        id: 'evidenceQuality',
        label: 'Evidence quality checks',
        group: 'quality',
        detail: 'Covers reviewer wording, scenario context, evidence order, confusion signals, and non-persistence.'
      },
      {
        id: 'decisionBoundary',
        label: 'Decision boundary',
        group: 'decision',
        detail: 'Covers cleanup paths, hold/defer outcomes, and the future decision-packet checklist.'
      },
      {
        id: 'prototypeGate',
        label: 'Prototype gate',
        group: 'prototypeGate',
        detail: 'Covers the blocked prototype register, rollback containment, test-only shape notes, reassessment, and runway.'
      }
    ],
    boundary:
      'Readiness section index is a Details-only map; it does not change results, save output, clear blockers, or start annual sequencing.'
  };
  const annualSequencingCopyTighteningGuard: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['copyTighteningGuard'] = {
    headline: 'Readiness copy should stay short and defer-first.',
    rows: [
      {
        id: 'preferredTerms',
        label: 'Preferred terms',
        status: 'review',
        detail: 'Use review evidence, future decision, blocked, deferred, planning-only, and Details-only.'
      },
      {
        id: 'blockedTerms',
        label: 'Blocked terms',
        status: 'blocked',
        detail: 'Avoid approval, start, apply, save, instruction, command, exact account order, and guaranteed spend.'
      },
      {
        id: 'deferFirst',
        label: 'Defer-first framing',
        status: 'blocked',
        detail: 'Decision-packet and runway copy must keep annual sequencing deferred while blockers remain.'
      },
      {
        id: 'consumerTone',
        label: 'Consumer tone',
        status: 'review',
        detail: 'Keep language plain, calm, and non-advisory even inside the research panel.'
      }
    ],
    boundary:
      'Copy tightening guard is wording guidance only; it does not change calculations, save output, clear blockers, request approval, or start annual sequencing.'
  };
  const annualSequencingFeedbackExamplePointers: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['feedbackExamplePointers'] = {
    headline: 'Example feedback snippets are static review aids.',
    rows: [
      {
        id: 'dbPensionExample',
        label: 'DB pension example',
        status: 'review',
        detail: 'Static example should show a reviewer remembering the spending answer and treating survivor-sensitive evidence as review context.'
      },
      {
        id: 'bridgeYearExample',
        label: 'Bridge-year example',
        status: 'review',
        detail: 'Static example should show a reviewer understanding bridge funding without asking for annual account draw orders.'
      },
      {
        id: 'alreadyRetiredExample',
        label: 'Already-retired example',
        status: 'review',
        detail: 'Static example should show a reviewer starting with funded years and money left before tax and OAS diagnostics.'
      },
      {
        id: 'staticOnly',
        label: 'Static docs only',
        status: 'blocked',
        detail: 'Examples are documentation fixtures only and cannot count as collected user feedback.'
      },
      {
        id: 'noPersistence',
        label: 'No persistence',
        status: 'blocked',
        detail: 'Examples must not add saved feedback fields, .plan.json files, engine output, or normal UI actions.'
      }
    ],
    boundary:
      'Feedback example pointers are static documentation aids only; they do not collect user data, save feedback, clear blockers, or start annual sequencing.'
  };
  const annualSequencingDeferralReassessment: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['deferralReassessment'] = {
    headline: 'Annual sequencing is still not ready for a prototype decision.',
    status: 'stillDeferred',
    rows: [
      {
        id: 'coverage',
        label: 'Coverage',
        status: 'review',
        detail: 'Coverage is better organized, but static examples and one-off reviews are not enough to clear feedback depth.'
      },
      {
        id: 'quality',
        label: 'Quality',
        status: 'review',
        detail: 'Evidence quality criteria now exist, but future real feedback still needs to meet them.'
      },
      {
        id: 'scope',
        label: 'Scope',
        status: 'blocked',
        detail: 'Locked-in accounts, survivor cases, low-income benefits, and Ontario-only boundaries still need decisions.'
      },
      {
        id: 'performance',
        label: 'Performance',
        status: 'blocked',
        detail: 'No local-device performance budget or cutoff rule exists for heavier annual sequencing work.'
      },
      {
        id: 'schemaUiRollback',
        label: 'Schema, UI, and rollback',
        status: 'blocked',
        detail: 'Saved schema, engine output, normal UI containment, and one-commit rollback evidence remain blockers.'
      }
    ],
    recommendation:
      'Continue feedback evidence and cleanup work; consider a prototype decision packet later only if real feedback and blocker evidence become strong enough.',
    boundary:
      'Deferral reassessment is a checkpoint only; it does not move to candidate status, request approval, start a prototype, change schemas, or expose annual sequencing.'
  };
  const annualSequencingReadinessMaintenancePlan: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['readinessMaintenancePlan'] = {
    headline: 'Readiness surface needs maintenance before more widening.',
    rows: [
      {
        id: 'sectionLimit',
        label: 'Section limit',
        status: 'review',
        detail: 'Keep new readiness material grouped under existing evidence, quality, decision, and prototype-gate headings where possible.'
      },
      {
        id: 'mergeCandidates',
        label: 'Merge candidates',
        status: 'review',
        detail: 'Future cleanup may merge overlapping feedback, copy, and decision rows if they repeat the same blocker.'
      },
      {
        id: 'staleDocs',
        label: 'Stale docs',
        status: 'review',
        detail: 'Checkpoint docs should be updated or superseded when future evidence changes the review posture.'
      },
      {
        id: 'testCoverage',
        label: 'Structure coverage',
        status: 'review',
        detail: 'Keep Details-only and no-action guards close to every new readiness section.'
      },
      {
        id: 'checkpointOnly',
        label: 'Checkpoint only',
        status: 'blocked',
        detail: 'Maintenance planning cannot clear blockers, request a prototype decision, or add annual sequencing.'
      }
    ],
    boundary:
      'Readiness maintenance plan is organization guidance only; it does not change calculations, save output, clear blockers, request approval, or start annual sequencing.'
  };
  const annualSequencingFeedbackReviewScript: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['feedbackReviewScript'] = {
    headline: 'Feedback review script stays manual and unsaved.',
    rows: [
      {
        id: 'overviewRead',
        label: 'Overview read',
        status: 'review',
        prompt: 'Ask what retirement answer and spending number the reviewer remembers from Overview.'
      },
      {
        id: 'detailsOpen',
        label: 'Details open',
        status: 'review',
        prompt: 'Ask what the first plan option means and whether it feels like review evidence.'
      },
      {
        id: 'evidencePlayback',
        label: 'Evidence playback',
        status: 'review',
        prompt: 'Ask the reviewer to rank funded years, money left, tax, OAS, cash wedge, and flexibility evidence.'
      },
      {
        id: 'boundaryCheck',
        label: 'Boundary check',
        status: 'blocked',
        prompt: 'Ask whether any wording sounded like advice, a command, exact account order, or saved instruction.'
      },
      {
        id: 'closeoutChoice',
        label: 'Closeout choice',
        status: 'review',
        prompt: 'Choose collect more feedback, clean up copy, clean up inputs, hold sequencing, or reassess later.'
      }
    ],
    boundary:
      'Feedback review script is a manual checklist only; it does not collect responses, save feedback, score reviewers, clear blockers, or start annual sequencing.'
  };
  const annualSequencingPerformancePlanningQuestions: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['performancePlanningQuestions'] = {
    headline: 'Performance planning needs questions before benchmarks.',
    rows: [
      {
        id: 'deviceTarget',
        label: 'Device target',
        status: 'blocked',
        question: 'What lower-end local device target must remain responsive before any annual sequencing candidate exists?'
      },
      {
        id: 'candidateCap',
        label: 'Candidate cap',
        status: 'blocked',
        question: 'What candidate limit would keep future annual sequencing bounded and explainable?'
      },
      {
        id: 'timeoutRule',
        label: 'Timeout rule',
        status: 'blocked',
        question: 'What cutoff should stop future test-only sequencing work before it makes the local app feel stuck?'
      },
      {
        id: 'noWorkerYet',
        label: 'No worker yet',
        status: 'review',
        question: 'Can planning continue without adding workers, servers, or background execution?'
      },
      {
        id: 'probeImpact',
        label: 'Probe impact',
        status: 'review',
        question: 'How would future performance checks preserve the existing probe suite and known sandbox caveat?'
      }
    ],
    boundary:
      'Performance planning questions are planning-only; they do not add benchmarks, workers, servers, prototype code, or annual sequencing.'
  };
  const annualSequencingConservativePostureCheckpoint: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['conservativePostureCheckpoint'] = {
    headline: 'Conservative posture remains the right path.',
    status: 'continueDeferral',
    rows: [
      {
        id: 'doNext',
        label: 'Do next',
        status: 'review',
        detail: 'Continue feedback readiness, cleanup, organization, and performance planning without adding annual sequencing logic.'
      },
      {
        id: 'doNotDo',
        label: 'Do not do yet',
        status: 'blocked',
        detail: 'Do not add annual account-level sequencing, schema fields, saved feedback, background workers, cloud services, or normal UI actions.'
      },
      {
        id: 'decisionTrigger',
        label: 'Decision trigger',
        status: 'blocked',
        detail: 'Only ask for a prototype decision after real feedback, scope, performance, schema/UI, and rollback evidence are complete.'
      },
      {
        id: 'rollbackPosture',
        label: 'Rollback posture',
        status: 'review',
        detail: 'Keep future changes narrow enough to remove in one commit if readiness work starts to create confusion.'
      },
      {
        id: 'chatContinuity',
        label: 'Chat continuity',
        status: 'review',
        detail: 'Continue in this chat for now, but start a new chat if project state begins to compress or lose continuity.'
      }
    ],
    recommendation:
      'Continue conservative readiness work and do not request a prototype decision yet.',
    boundary:
      'Conservative posture checkpoint is a review checkpoint only; it does not request approval, start a prototype, change schemas, save output, or expose annual sequencing.'
  };
  const annualSequencingReadinessConsolidationSummary: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['readinessConsolidationSummary'] = {
    headline: 'Readiness review should be summary-first.',
    rows: [
      {
        id: 'summaryFirst',
        label: 'Summary first',
        status: 'review',
        detail: 'Lead with the deferral state, top blockers, and next conservative action before showing deeper evidence.'
      },
      {
        id: 'groupBeforeAdding',
        label: 'Group before adding',
        status: 'review',
        detail: 'Attach future rows to existing evidence, quality, decision, performance, or prototype-gate groups before adding sections.'
      },
      {
        id: 'supersedeDocs',
        label: 'Supersede old docs',
        status: 'review',
        detail: 'When future evidence changes posture, mark older checkpoint docs as superseded rather than leaving conflicting guidance.'
      },
      {
        id: 'detailsOnly',
        label: 'Details only',
        status: 'blocked',
        detail: 'Consolidation must stay inside the research panel and never become Overview or compact Details content.'
      },
      {
        id: 'noPrototype',
        label: 'No prototype',
        status: 'blocked',
        detail: 'Consolidation cannot authorize annual sequencing, clear blockers, change schemas, or save output.'
      }
    ],
    boundary:
      'Readiness consolidation summary is organization guidance only; it does not change calculations, save output, clear blockers, or start annual sequencing.'
  };
  const annualSequencingUiRedesignReadinessBridge: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['uiRedesignReadinessBridge'] = {
    headline: 'UI redesign context is noted for later.',
    rows: [
      {
        id: 'briefReference',
        label: 'Brief reference',
        status: 'review',
        detail: 'Use docs/ui-redesign-brief.md and docs/assets as future design context after development is secure enough.'
      },
      {
        id: 'answerFirst',
        label: 'Answer first',
        status: 'review',
        detail: 'Future UI work should preserve the first answer: am I okay, spending capacity, confidence, and top review actions.'
      },
      {
        id: 'localFirstTrust',
        label: 'Local-first trust',
        status: 'review',
        detail: 'Future UI work should keep local save status, privacy, backup, and exportability visible.'
      },
      {
        id: 'progressiveDisclosure',
        label: 'Progressive disclosure',
        status: 'review',
        detail: 'Future UI work should reduce density and keep advanced readiness evidence behind explicit Details/research boundaries.'
      },
      {
        id: 'notYet',
        label: 'Not yet',
        status: 'blocked',
        detail: 'Do not start UI overhaul while annual sequencing readiness, feedback evidence, and performance boundaries are still unsettled.'
      }
    ],
    boundary:
      'UI redesign readiness bridge is future context only; it does not redesign UI, change calculations, save output, clear blockers, or start annual sequencing.'
  };
  const annualSequencingCheckpointArchivePolicy: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['checkpointArchivePolicy'] = {
    headline: 'Checkpoint docs need a supersession policy.',
    rows: [
      {
        id: 'currentPosture',
        label: 'Current posture',
        status: 'review',
        detail: 'Keep the latest checkpoint as the source of truth for whether sequencing is deferred, blocked, or ready for a future decision.'
      },
      {
        id: 'supersededDocs',
        label: 'Superseded docs',
        status: 'review',
        detail: 'When posture changes, mark older docs as superseded instead of editing history into ambiguity.'
      },
      {
        id: 'decisionDocs',
        label: 'Decision docs',
        status: 'blocked',
        detail: 'Do not create a decision doc that implies approval before every blocker has evidence.'
      },
      {
        id: 'verificationNotes',
        label: 'Verification notes',
        status: 'review',
        detail: 'Keep known probe caveats explicit so future failures are compared against the right baseline.'
      },
      {
        id: 'noDeletion',
        label: 'No deletion',
        status: 'blocked',
        detail: 'Do not delete old checkpoint docs as part of readiness cleanup unless a separate doc-retention decision is made.'
      }
    ],
    boundary:
      'Checkpoint archive policy is documentation guidance only; it does not delete docs, clear blockers, request approval, change schemas, or start annual sequencing.'
  };
  const annualSequencingConsolidationCheckpoint: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['consolidationCheckpoint'] = {
    headline: 'Consolidation is useful, but readiness is still deferred.',
    status: 'continueConsolidation',
    rows: [
      {
        id: 'panelHygiene',
        label: 'Panel hygiene',
        status: 'review',
        detail: 'The readiness surface now has summary, grouping, maintenance, and archive guidance, but future work should avoid adding more sections unless needed.'
      },
      {
        id: 'feedbackReadiness',
        label: 'Feedback readiness',
        status: 'review',
        detail: 'Manual feedback review is better prepared, but real feedback evidence still needs to be gathered outside the app.'
      },
      {
        id: 'performanceBoundary',
        label: 'Performance boundary',
        status: 'blocked',
        detail: 'Performance targets, candidate caps, and timeout rules remain questions, not measured budgets.'
      },
      {
        id: 'uiRedesignTiming',
        label: 'UI redesign timing',
        status: 'blocked',
        detail: 'The redesign brief is recorded for later, but overhaul work should wait until development and readiness are secure enough.'
      },
      {
        id: 'nextPackage',
        label: 'Next package',
        status: 'review',
        detail: 'Next work should either simplify existing readiness sections or prepare manual feedback sessions, not start sequencing or redesign.'
      }
    ],
    recommendation:
      'Continue consolidation or manual feedback prep next; do not start annual sequencing or the UI overhaul yet.',
    boundary:
      'Consolidation checkpoint is review guidance only; it does not request approval, redesign UI, start a prototype, change schemas, or save output.'
  };
  const annualSequencingManualWorksheetPacket: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['manualWorksheetPacket'] = {
    headline: 'Manual feedback worksheets stay outside the app.',
    rows: [
      {
        id: 'printablePrompts',
        label: 'Printable prompts',
        status: 'review',
        detail: 'Use static worksheet docs for Overview, Details, evidence ranking, boundary checks, and closeout choice.'
      },
      {
        id: 'anonymizeOutsideApp',
        label: 'Anonymize outside app',
        status: 'review',
        detail: 'Remove names, account numbers, addresses, and personally identifying notes before feedback is summarized.'
      },
      {
        id: 'noInAppCapture',
        label: 'No in-app capture',
        status: 'blocked',
        detail: 'Do not add forms, submit buttons, local feedback records, or saved feedback fields.'
      },
      {
        id: 'reviewStorage',
        label: 'Review storage',
        status: 'blocked',
        detail: 'Any feedback notes stay outside saved plan files and outside engine output.'
      },
      {
        id: 'closeoutSummary',
        label: 'Closeout summary',
        status: 'review',
        detail: 'Summaries should choose collect more feedback, clean up copy, clean up inputs, hold sequencing, or reassess later.'
      }
    ],
    boundary:
      'Manual worksheet packet is documentation guidance only; it does not collect feedback, save feedback, change schemas, clear blockers, or start annual sequencing.'
  };
  const annualSequencingStaticWorksheetExamples: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['staticWorksheetExamples'] = {
    headline: 'Completed worksheet examples are static only.',
    rows: [
      {
        id: 'dbCompleted',
        label: 'DB pension worksheet',
        status: 'review',
        detail: 'Static example shows a reviewer remembering the spending answer and treating pension/survivor evidence as review context.'
      },
      {
        id: 'bridgeCompleted',
        label: 'Bridge-year worksheet',
        status: 'review',
        detail: 'Static example shows broad bridge-year evidence understood without exact account-order expectations.'
      },
      {
        id: 'retiredCompleted',
        label: 'Already-retired worksheet',
        status: 'review',
        detail: 'Static example shows funded years and money left reviewed before tax and OAS diagnostics.'
      },
      {
        id: 'notEvidence',
        label: 'Not evidence',
        status: 'blocked',
        detail: 'Static examples cannot count as real household feedback or clear feedback-depth blockers.'
      },
      {
        id: 'notSaved',
        label: 'Not saved',
        status: 'blocked',
        detail: 'Static examples must not create saved responses, saved schema fields, or engine output.'
      }
    ],
    boundary:
      'Static worksheet examples are documentation fixtures only; they do not collect feedback, save responses, count as evidence, clear blockers, or start annual sequencing.'
  };
  const annualSequencingManualScoringRubric: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['manualScoringRubric'] = {
    headline: 'Manual scoring rubric stays outside the app.',
    rows: [
      {
        id: 'clear',
        label: 'Clear',
        status: 'review',
        detail: 'Reviewer remembers the answer, orders evidence sensibly, and describes the result as something to review.'
      },
      {
        id: 'watch',
        label: 'Watch',
        status: 'review',
        detail: 'Reviewer mostly understands the plan but wording or evidence order needs cleanup.'
      },
      {
        id: 'blocked',
        label: 'Blocked',
        status: 'blocked',
        detail: 'Reviewer expects advice, exact account order, guaranteed spend, saved sequencing output, or a command.'
      },
      {
        id: 'repeat',
        label: 'Repeat',
        status: 'review',
        detail: 'Feedback is promising but too narrow to support readiness conclusions.'
      },
      {
        id: 'noScoreInApp',
        label: 'No in-app score',
        status: 'blocked',
        detail: 'Do not add scoring controls, saved score fields, analytics, or feedback state.'
      }
    ],
    boundary:
      'Manual scoring rubric is outside-app guidance only; it does not score users, save responses, collect analytics, clear blockers, or start annual sequencing.'
  };
  const annualSequencingManualFeedbackPrepCheckpoint: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['manualFeedbackPrepCheckpoint'] = {
    headline: 'Manual feedback prep is ready to run outside the app.',
    status: 'readyToRunOutsideApp',
    rows: [
      {
        id: 'worksheetReady',
        label: 'Worksheet ready',
        status: 'review',
        detail: 'Manual prompts now cover Overview, Details, evidence ranking, boundary checks, and closeout choice.'
      },
      {
        id: 'examplesReady',
        label: 'Examples ready',
        status: 'review',
        detail: 'Static completed examples exist for DB pension, bridge-year, and already-retired household reviews.'
      },
      {
        id: 'scoringReady',
        label: 'Rubric ready',
        status: 'review',
        detail: 'Manual clear, watch, blocked, and repeat rubric guidance exists outside the app.'
      },
      {
        id: 'appBoundary',
        label: 'App boundary',
        status: 'blocked',
        detail: 'The app still must not collect, save, score, analyze, or persist feedback.'
      },
      {
        id: 'nextDecision',
        label: 'Next decision',
        status: 'review',
        detail: 'Next package can either run manual outside-app reviews or continue panel consolidation.'
      }
    ],
    recommendation:
      'Consider running three to five manual outside-app household reviews before adding more readiness surface.',
    boundary:
      'Manual feedback prep checkpoint does not collect feedback, save responses, clear blockers, request approval, or start annual sequencing.'
  };
  const annualSequencingFeedbackResultsPlaceholder: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['feedbackResultsPlaceholder'] = {
    headline: 'No real feedback results are summarized yet.',
    status: 'noRealFeedbackYet',
    rows: [
      {
        id: 'noRealResults',
        label: 'No real results yet',
        status: 'blocked',
        detail: 'Manual worksheets and static examples are ready, but no outside-app household feedback has been provided for summary.'
      },
      {
        id: 'acceptedSources',
        label: 'Accepted sources',
        status: 'review',
        detail: 'Only anonymized outside-app review notes should be summarized as feedback results.'
      },
      {
        id: 'summaryShape',
        label: 'Summary shape',
        status: 'review',
        detail: 'Future summaries should report household type, remembered answer, evidence order, confusion signals, and closeout choice.'
      },
      {
        id: 'doNotInfer',
        label: 'Do not infer',
        status: 'blocked',
        detail: 'Do not treat static examples, assumptions, or internal expectations as real feedback results.'
      },
      {
        id: 'holdDecisions',
        label: 'Hold decisions',
        status: 'blocked',
        detail: 'Do not move prototype, UI overhaul, or sequencing decisions until real feedback exists and is reviewed.'
      }
    ],
    boundary:
      'Feedback results placeholder is a review marker only; it does not create feedback, save responses, summarize real users, clear blockers, or start annual sequencing.'
  };
  const annualSequencingFeedbackCopyCleanupTargets: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['feedbackCopyCleanupTargets'] = {
    headline: 'Copy cleanup targets wait for real feedback.',
    rows: [
      {
        id: 'cashWedge',
        label: 'Cash wedge wording',
        status: 'review',
        detail: 'Watch for feedback that reads buffer or refill language as a required action.'
      },
      {
        id: 'taxOas',
        label: 'Tax and OAS emphasis',
        status: 'review',
        detail: 'Watch for feedback that over-weights tax or OAS diagnostics ahead of funded years and money left.'
      },
      {
        id: 'recommendedPlan',
        label: 'Recommended plan framing',
        status: 'review',
        detail: 'Watch for feedback that treats the recommended plan as advice, a command, or a guarantee.'
      },
      {
        id: 'accountOrder',
        label: 'Account order confusion',
        status: 'blocked',
        detail: 'Any expectation of exact annual account withdrawals keeps sequencing readiness blocked.'
      },
      {
        id: 'noCleanupWithoutFeedback',
        label: 'No cleanup without feedback',
        status: 'blocked',
        detail: 'Do not rewrite consumer copy based on imagined feedback when no real notes exist.'
      }
    ],
    boundary:
      'Feedback copy cleanup targets are watch areas only; they do not rewrite copy, summarize feedback, clear blockers, or start annual sequencing.'
  };
  const annualSequencingFeedbackEvidencePosture: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['feedbackEvidencePosture'] = {
    headline: 'Feedback evidence posture is still waiting.',
    status: 'waitingForRealFeedback',
    rows: [
      {
        id: 'prepared',
        label: 'Prepared',
        status: 'review',
        detail: 'Manual worksheets, examples, scoring rubric, result shape, and cleanup targets are ready.'
      },
      {
        id: 'missing',
        label: 'Missing',
        status: 'blocked',
        detail: 'No anonymized outside-app household review notes have been provided for summary.'
      },
      {
        id: 'blockedDecision',
        label: 'Blocked decision',
        status: 'blocked',
        detail: 'Prototype, UI overhaul, and sequencing decisions stay blocked without real feedback evidence.'
      },
      {
        id: 'cleanupPosture',
        label: 'Cleanup posture',
        status: 'review',
        detail: 'Copy cleanup can be planned, but should not be applied until real notes identify actual confusion.'
      },
      {
        id: 'nextAction',
        label: 'Next action',
        status: 'review',
        detail: 'Run outside-app reviews or continue reducing readiness-panel sprawl.'
      }
    ],
    recommendation:
      'Wait for real outside-app feedback before applying copy cleanup or moving any readiness decision.',
    boundary:
      'Feedback evidence posture is a checkpoint only; it does not create feedback, apply cleanup, clear blockers, request approval, or start annual sequencing.'
  };
  const annualSequencingFeedbackResultsCheckpoint: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['feedbackResultsCheckpoint'] = {
    headline: 'Feedback results review is still waiting for real notes.',
    status: 'stillWaiting',
    rows: [
      {
        id: 'results',
        label: 'Results',
        status: 'blocked',
        detail: 'No real feedback results are available to summarize.'
      },
      {
        id: 'cleanup',
        label: 'Cleanup',
        status: 'blocked',
        detail: 'Do not apply copy cleanup until real feedback identifies actual confusion.'
      },
      {
        id: 'sequencing',
        label: 'Sequencing',
        status: 'blocked',
        detail: 'Annual account-level sequencing remains deferred.'
      },
      {
        id: 'uiOverhaul',
        label: 'UI overhaul',
        status: 'blocked',
        detail: 'UI overhaul remains a later phase after development and readiness are secure enough.'
      },
      {
        id: 'nextPackage',
        label: 'Next package',
        status: 'review',
        detail: 'Next work should either run outside-app reviews or continue reducing readiness surface complexity.'
      }
    ],
    recommendation:
      'Run three to five outside-app household reviews before more readiness expansion.',
    boundary:
      'Feedback results checkpoint is a planning checkpoint only; it does not create feedback, save responses, clear blockers, redesign UI, or start annual sequencing.'
  };
  const annualSequencingReadinessSlimmingPlan: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['readinessSlimmingPlan'] = {
    headline: 'Readiness surface should slim before more expansion.',
    rows: [
      {
        id: 'summaryFirst',
        label: 'Summary first',
        status: 'review',
        detail: 'Keep the deferral answer, top blockers, and next action above detailed evidence.'
      },
      {
        id: 'mergeOverlaps',
        label: 'Merge overlaps',
        status: 'review',
        detail: 'Future cleanup should merge repeated feedback, copy, and decision rows before adding new sections.'
      },
      {
        id: 'docSupersession',
        label: 'Doc supersession',
        status: 'review',
        detail: 'Use supersession notes when checkpoint docs are replaced by newer guidance.'
      },
      {
        id: 'detailsOnly',
        label: 'Details only',
        status: 'blocked',
        detail: 'Slimming work must remain inside the research panel and not appear in Overview or compact Details.'
      },
      {
        id: 'stopCondition',
        label: 'Stop condition',
        status: 'blocked',
        detail: 'Stop adding readiness surface if it does not reduce confusion or prepare real feedback.'
      }
    ],
    boundary:
      'Readiness slimming plan is organization guidance only; it does not delete docs, change calculations, save output, clear blockers, or start annual sequencing.'
  };
  const annualSequencingReadinessHandoffCheckpoint: OptimizerFeedbackPackageIndex['annualSequencingReadiness']['readinessHandoffCheckpoint'] = {
    headline: 'Readiness work should pause for feedback or slimming.',
    status: 'pauseExpansion',
    rows: [
      {
        id: 'outsideFeedback',
        label: 'Outside feedback',
        status: 'review',
        detail: 'The strongest next move is three to five anonymized outside-app household reviews.'
      },
      {
        id: 'panelSlimming',
        label: 'Panel slimming',
        status: 'review',
        detail: 'If reviews cannot run yet, reduce overlap in the Details readiness surface.'
      },
      {
        id: 'performanceBudget',
        label: 'Performance budget',
        status: 'blocked',
        detail: 'Performance remains unmeasured and cannot support a prototype decision yet.'
      },
      {
        id: 'prototypeDecision',
        label: 'Prototype decision',
        status: 'blocked',
        detail: 'Do not request a prototype decision without real feedback, scope, performance, schema/UI, and rollback evidence.'
      },
      {
        id: 'uiOverhaul',
        label: 'UI overhaul',
        status: 'blocked',
        detail: 'Do not start UI overhaul until development/readiness are secure enough and the redesign can preserve product boundaries.'
      }
    ],
    recommendation: 'Pause readiness expansion; either run outside-app reviews or slim the readiness panel next.',
    boundary:
      'Readiness handoff checkpoint is review guidance only; it does not request approval, redesign UI, start a prototype, change schemas, or save output.'
  };

  return {
    headline: 'Optimizer feedback package is indexed for review.',
    rows: [
      {
        id: 'withdrawalFamilyFeedback',
        label: 'Broad withdrawal-family feedback',
        status: withdrawalStatus,
        detail: withdrawalFeedbackReview.outcome.detail
      },
      {
        id: 'goalModes',
        label: 'Future goal modes',
        status: 'deferred',
        detail: goalReview.summary
      },
      {
        id: 'spendingFlexibility',
        label: 'Spending flexibility language',
        status: 'review',
        detail: goalReview.spendingFlexibilityReview.detail
      },
      {
        id: 'annualSequencing',
        label: 'Annual account-level sequencing',
        status: 'deferred',
        detail: 'Sequencing architecture waits until feedback evidence is strong enough to plan it.'
      }
    ],
    annualSequencingReadiness: {
      headline:
        annualSequencingStatus === 'maybeLater'
          ? 'Annual sequencing may be planned later, but is not ready now.'
          : 'Annual sequencing is not ready to plan.',
      status: annualSequencingStatus,
      rows: annualSequencingRows,
      architectureQuestions: annualSequencingQuestions,
      performanceBudget: annualSequencingPerformanceBudget,
      explainabilityGuide: annualSequencingExplainabilityGuide,
      scopeRegister: annualSequencingScopeRegister,
      feedbackDepthPlan: annualSequencingFeedbackDepthPlan,
      architectureConstraints: annualSequencingArchitectureConstraints,
      prototypeDecisionRegister: annualSequencingPrototypeDecisionRegister,
      rollbackContainmentPlan: annualSequencingRollbackContainmentPlan,
      testOnlyShapePlan: annualSequencingTestOnlyShapePlan,
      prototypeReadinessSummary: annualSequencingPrototypeReadinessSummary,
      blockerClearanceEvidence: annualSequencingBlockerClearanceEvidence,
      feedbackArtifactTemplate: annualSequencingFeedbackArtifactTemplate,
      feedbackCloseoutRubric: annualSequencingFeedbackCloseoutRubric,
      feedbackDecisionLedger: annualSequencingFeedbackDecisionLedger,
      feedbackCoverageMatrix: annualSequencingFeedbackCoverageMatrix,
      evidenceQualityChecklist: annualSequencingEvidenceQualityChecklist,
      prototypeDecisionPacket: annualSequencingPrototypeDecisionPacket,
      readinessRunway: annualSequencingReadinessRunway,
      readinessSectionIndex: annualSequencingReadinessSectionIndex,
      copyTighteningGuard: annualSequencingCopyTighteningGuard,
      feedbackExamplePointers: annualSequencingFeedbackExamplePointers,
      deferralReassessment: annualSequencingDeferralReassessment,
      readinessMaintenancePlan: annualSequencingReadinessMaintenancePlan,
      feedbackReviewScript: annualSequencingFeedbackReviewScript,
      performancePlanningQuestions: annualSequencingPerformancePlanningQuestions,
      conservativePostureCheckpoint: annualSequencingConservativePostureCheckpoint,
      readinessConsolidationSummary: annualSequencingReadinessConsolidationSummary,
      uiRedesignReadinessBridge: annualSequencingUiRedesignReadinessBridge,
      checkpointArchivePolicy: annualSequencingCheckpointArchivePolicy,
      consolidationCheckpoint: annualSequencingConsolidationCheckpoint,
      manualWorksheetPacket: annualSequencingManualWorksheetPacket,
      staticWorksheetExamples: annualSequencingStaticWorksheetExamples,
      manualScoringRubric: annualSequencingManualScoringRubric,
      manualFeedbackPrepCheckpoint: annualSequencingManualFeedbackPrepCheckpoint,
      feedbackResultsPlaceholder: annualSequencingFeedbackResultsPlaceholder,
      feedbackCopyCleanupTargets: annualSequencingFeedbackCopyCleanupTargets,
      feedbackEvidencePosture: annualSequencingFeedbackEvidencePosture,
      feedbackResultsCheckpoint: annualSequencingFeedbackResultsCheckpoint,
      readinessSlimmingPlan: annualSequencingReadinessSlimmingPlan,
      readinessHandoffCheckpoint: annualSequencingReadinessHandoffCheckpoint,
      nextStep:
        annualSequencingStatus === 'maybeLater'
          ? 'Collect repeated feedback and define performance, explainability, province, and edge-case scope before architecture.'
          : 'Resolve broad-family feedback blockers before annual sequencing is reconsidered.',
      boundary: 'This readiness gate does not implement annual account-level sequencing, account instructions, saved output, or a new optimizer search.'
    },
    nextCheckpoint:
      withdrawalFeedbackReview.status === 'readyForFeedback'
        ? 'Close broad withdrawal-family feedback before planning wider optimizer architecture.'
        : 'Resolve blocked or unclear feedback evidence before planning annual sequencing architecture.',
    boundary: 'This package index is runtime review support only; it is not saved output and does not widen the optimizer.'
  };
}

export function runBoundedOptimizer(
  plan: V2PlanPayload,
  runner: BoundedOptimizerRunner = runSimulationSafely
): BoundedOptimizerSummary {
  const contract = buildOptimizerContract(plan);
  const estateTarget = n(plan.inheritance);
  const eligibilityNotes = buildEligibilityNotes(plan, contract);
  const definitions = buildBoundedOptimizerCandidates(plan, contract);
  const rawResults = definitions.map((definition) => ({
    definition,
    result: runner(definition.plan, definition.config)
  }));
  const summarizedResults = rawResults.map(({ definition, result }) => ({
    definition,
    summary: summarizeResult(result)
  }));
  const baselineSummary = summarizedResults[0]?.summary;
  const survivorNeedsReview = eligibilityNotes.some((note) => note.lever === 'survivor' && note.status === 'needsReview');
  const rows = summarizedResults.map(({ definition, summary }) => {
    const recommendation = recommendationPermission(definition, summary, baselineSummary, estateTarget, survivorNeedsReview);
    return {
      id: definition.id,
      label: definition.label,
      status: summary.totalYears > 0 ? 'review' : 'blocked',
      changedLevers: definition.changedLevers,
      changeSummary: definition.changeSummary,
      reviewNote: definition.reviewNote,
      suggestionEligible: recommendation.eligible,
      suggestionReason: recommendation.reason,
      fundedYears: summary.fundedYears,
      totalYears: summary.totalYears,
      fundedThroughYear: summary.fundedThroughYear,
      firstShortfallYear: summary.firstShortfallYear,
      sustainableAnnualSpend: summary.sustainableAnnualSpend,
      endPortfolio: summary.endPortfolio,
      endPortfolioDelta: summary.endPortfolio - baselineSummary.endPortfolio,
      lifetimeTax: summary.lifetimeTax,
      lifetimeTaxDelta: summary.lifetimeTax - baselineSummary.lifetimeTax,
      score: scoreCandidate(summary, baselineSummary, definition.disruptionPenalty)
    } satisfies BoundedOptimizerCandidateRow;
  });

  const eligibleRows = rows.filter((row) => row.status !== 'blocked');
  const sortedRows = [...eligibleRows].sort(compareRows);
  const baselineCandidate = rows.find((row) => row.id === 'baseline') || null;
  const suggested = contract.status === 'readyForExtraction' ? sortedRows.find((row) => row.suggestionEligible) || baselineCandidate : null;
  const candidates: BoundedOptimizerCandidateRow[] = rows.map((row) => {
    const status: BoundedOptimizerCandidateRow['status'] = suggested && row.id === suggested.id ? 'suggested' : row.status;
    return { ...row, status };
  });
  const suggestedLabel = suggested?.label || 'No plan option ready';
  const baselineRow = candidates.find((row) => row.id === 'baseline') || null;
  const suggestedRow = candidates.find((row) => row.id === suggested?.id) || null;
  const explanation = buildOptimizerExplanation(suggestedRow, baselineRow, contract);
  const summaryById = summarizedResults.reduce<Partial<Record<BoundedOptimizerCandidateId, ReturnType<typeof summarizeResult>>>>((acc, item) => {
    acc[item.definition.id] = item.summary;
    return acc;
  }, {});
  const evidenceRows = [
    ...buildBenefitTimingEvidence(summaryById),
    ...buildPensionSplittingEvidence(summaryById),
    ...buildCppSharingEvidence(summaryById),
    ...buildHomeSaleRelianceEvidence(summaryById, plan),
    ...buildWithdrawalFamilyEvidence(summaryById, suggestedRow)
  ];
  const driverRows = buildDriverRows(suggestedRow, baselineRow, summaryById);
  const compactEvidenceRows = buildCompactEvidenceRows(suggestedRow, driverRows);
  const guardrailNotes = buildGuardrailNotes(eligibilityNotes);
  const recommendationNotes: BoundedOptimizerRecommendationNote[] = rows
    .filter((row) => row.id !== 'baseline')
    .map((row) => ({
      candidateId: row.id,
      label: row.label,
      status: row.suggestionEligible ? 'canHighlight' : 'reviewOnly',
      reason: row.suggestionReason
    }));
  const optionGroups = buildOptionGroups(candidates);
  const readinessRows = buildReadinessRows(plan, contract, eligibilityNotes);
  const candidateFamilies = buildCandidateFamilies(readinessRows);
  const searchPlan = buildSearchPlan(plan);
  const capacityObjective = buildCapacityObjective({
    plan,
    suggested: suggestedRow,
    summaryById,
    candidateFamilies,
    eligibilityNotes,
    contract
  });
  const capacityReportReadiness = selectOptimizerCapacityReportReadiness(capacityObjective);
  const capacityExportGuard = selectOptimizerCapacityExportGuard();
  const annualSequencingPrepContract = selectOptimizerAnnualSequencingPrepContract(capacityObjective);
  const annualSequencingInputAdapter = selectOptimizerAnnualSequencingInputAdapter({
    sourceCandidateId: suggestedRow?.id ?? null,
    sourceCandidateLabel: suggestedRow?.label ?? suggestedLabel,
    summary: suggestedRow ? summaryById[suggestedRow.id] : null,
    capacityObjective,
    prepContract: annualSequencingPrepContract
  });
  const experimentalAccountOrderDraft = selectOptimizerExperimentalAccountOrderDraft(annualSequencingInputAdapter);
  const experimentalAnnualInstructionDraft = selectOptimizerExperimentalAnnualInstructionDraft({
    adapter: annualSequencingInputAdapter,
    accountOrderDraft: experimentalAccountOrderDraft,
    summary: suggestedRow ? summaryById[suggestedRow.id] : null
  });
  const betaSavedSequencingAdapter = selectOptimizerBetaSavedSequencingAdapter(experimentalAnnualInstructionDraft);
  const continuationContract = selectOptimizerContinuationContract({ betaSavedSequencingAdapter });
  const schemaSaveDecision = selectOptimizerSchemaSaveDecision({ betaSavedSequencingAdapter, continuationContract });
  const csvReportGate = selectOptimizerCsvReportGate({ betaSavedSequencingAdapter, schemaSaveDecision });
  const publicSafetyValidation = selectOptimizerPublicSafetyValidation({ csvReportGate });
  const testerSurfaceMatrix = selectOptimizerExperimentalDraftExampleMatrix([
    {
      id: 'current-runtime-scenario',
      label: 'Current runtime scenario',
      draft: experimentalAnnualInstructionDraft
    }
  ]);
  const goalReview = buildOptimizerGoalReview(candidates);
  const withdrawalFeedbackReview = buildWithdrawalFeedbackReview({
    candidateFamilies,
    candidates,
    evidenceRows,
    readinessRows,
    searchPlan
  });
  const feedbackPackageIndex = buildFeedbackPackageIndex({ goalReview, withdrawalFeedbackReview });

  return {
    status: contract.status === 'readyForExtraction' && Boolean(suggested) ? 'ready' : 'blocked',
    execution: 'boundedSearch',
    contract,
    objective: buildObjectiveContract(),
    readinessRows,
    candidateFamilies,
    searchPlan,
    capacityObjective,
    capacityReportReadiness,
    capacityExportGuard,
    annualSequencingPrepContract,
    annualSequencingInputAdapter,
    experimentalAccountOrderDraft,
    experimentalAnnualInstructionDraft,
    betaSavedSequencingAdapter,
    continuationContract,
    schemaSaveDecision,
    csvReportGate,
    publicSafetyValidation,
    testerSurfaceMatrix,
    headline: suggested
      ? `${suggested.label} is the first option to review in this limited set.`
      : 'Plan options can be reviewed after required inputs are cleared.',
    detail:
      'This checks a small set of spending, timing, benefit, and withdrawal-order options. It is a planning review, not financial advice or a full tax optimizer.',
    suggestedCandidateId: suggested?.id ?? null,
    suggestedLabel,
    candidateCount: candidates.length,
    candidates,
    eligibilityNotes,
    guardrailNotes,
    recommendationNotes,
    optionGroups,
    evidenceRows,
    driverRows,
    compactEvidenceRows,
    goalReview,
    feedbackPackageIndex,
    withdrawalFeedbackReview,
    explanation,
    reviewNotes: suggested
      ? [
          suggested.reviewNote,
          'Compare the result against taxes, survivor impact, and household comfort before acting.',
          'The saved plan file is unchanged unless you edit inputs yourself.'
        ]
      : contract.blockers.length
        ? contract.blockers.slice(0, 3)
        : ['Run Results after clearing missing or invalid inputs.']
  };
}
