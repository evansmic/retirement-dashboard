import { AnnualSimulationRow, SimulationResult, V2PlanPayload } from '../types/plan';
import {
  selectStressIndicatorRows as selectStressIndicatorRowsFromStressModule,
  selectSpendingStressSummary as selectSpendingStressSummaryFromStressModule,
  selectStressTestRows as selectStressTestRowsFromStressModule,
  selectStressTestSummary as selectStressTestSummaryFromStressModule
} from './stressSelectors';
import type { StressSeverity } from './stressSelectors';
export type {
  SpendingStressId,
  SpendingStressRow,
  SpendingStressStatus,
  SpendingStressSummary,
  StressIndicatorRow,
  StressSeverity,
  StressTestRow,
  StressTestSummary
} from './stressSelectors';

export type ResultsWorkspaceSection =
  | 'overview'
  | 'annualDetail'
  | 'cashFlow'
  | 'incomeSources'
  | 'accounts'
  | 'taxes'
  | 'stressTests'
  | 'householdResilience'
  | 'assumptions'
  | 'details'
  | 'exportSave';

export type ResultsNavItem = {
  id: ResultsWorkspaceSection;
  label: string;
  helper?: string;
};

export const resultsWorkspaceMap: ResultsNavItem[] = [
  { id: 'overview', label: 'Overview', helper: 'Your answer' },
  { id: 'stressTests', label: 'Risks', helper: 'What could change' },
  { id: 'taxes', label: 'Taxes', helper: 'Tax picture' },
  { id: 'householdResilience', label: 'Survivor Impact', helper: 'Couple plans' },
  { id: 'details', label: 'Details', helper: 'Advanced views' },
  { id: 'exportSave', label: 'Save & print', helper: 'Editable plan and report' }
];

export type OverviewMetrics = {
  firstYear: number | null;
  lastYear: number | null;
  projectionYears: number;
  endPortfolio: number;
  firstYearSpending: number;
  firstYearTax: number;
  firstYearFunding: number;
  firstYearFundingGap: number;
  hasShortfall: boolean;
};

export type FundingSourceRow = {
  id: string;
  label: string;
  amount: number;
  taxTreatment: 'taxable' | 'tax-free' | 'cash' | 'other';
};

export type IncomeSourceCategory =
  | 'salary'
  | 'pension'
  | 'cpp'
  | 'oas'
  | 'registeredWithdrawals'
  | 'taxFreeWithdrawals'
  | 'cashWedge'
  | 'other';

export type IncomeSourceRow = {
  id: IncomeSourceCategory;
  label: string;
  firstYearAmount: number;
  lifetimeAmount: number;
  taxable: boolean;
};

export type AccountBalancePoint = {
  year: number;
  rrsp: number;
  tfsa: number;
  lif: number;
  nonRegistered: number;
  cash: number;
  total: number;
};

export type AccountSummaryRow = {
  id: 'rrsp' | 'tfsa' | 'lif' | 'nonRegistered' | 'cash' | 'total';
  label: string;
  firstYearBalance: number;
  endBalance: number;
  peakBalance: number;
  netChange: number;
};

export type AccountDrawdownStorySummary = {
  status: StressSeverity;
  headline: string;
  detail: string;
  firstYear: number | null;
  finalYear: number | null;
  startPortfolio: number;
  endPortfolio: number;
  peakPortfolio: number;
  lowestPortfolioYear: number | null;
  lowestPortfolio: number;
  firstDepletionYear: number | null;
  stableDashboardHandoff: string;
};

export type AccountDrawdownReviewRow = {
  id: 'registeredDrawdown' | 'tfsaDrawdown' | 'nonRegisteredDrawdown' | 'cashWedge' | 'terminalPortfolio';
  label: string;
  severity: StressSeverity;
  year: number | null;
  value: string;
  explanation: string;
  reviewAction: string;
  detailArea: ResultsWorkspaceSection;
};

export type TaxSummaryMetrics = {
  firstYearTax: number;
  lifetimeTax: number;
  peakTaxYear: number | null;
  peakTax: number;
  lifetimeOasClawback: number;
  firstYearTaxableIncome: number;
};

export type TaxDetailRow = {
  year: number;
  taxableIncome: number;
  tax: number;
  oasClawback: number;
  effectiveRate: number;
};

export type ChartReadyYear = {
  year: number;
  spending: number;
  afterTaxSpending: number;
  tax: number;
  portfolio: number;
  funding: number;
  shortfall: number;
};

export type ProjectionMilestoneRow = ChartReadyYear & {
  label: 'First year' | 'Midpoint' | 'Final year';
};

export type CashFlowReconciliation = {
  year: number | null;
  incomeAndWithdrawals: number;
  taxFreeWithdrawals: number;
  cashWedgeFunding: number;
  otherInflows: number;
  tax: number;
  afterTaxSpending: number;
  oneOffOutflows: number;
  reconciledAfterTaxSpending: number;
  reconciliationDelta: number;
  cashFlowDelta: number;
  status: 'ok' | 'warning';
};

export type CashFlowReconciliationRow = CashFlowReconciliation & {
  spending: number;
  fundingBeforeTax: number;
  portfolio: number;
  shortfall: number;
};

export type AnnualDetailView = 'summary' | 'income' | 'withdrawals' | 'tax' | 'balances';

export type AnnualDetailRow = {
  year: number;
  ages: string;
  spending: number;
  afterTaxSpending: number;
  fundingBeforeTax: number;
  tax: number;
  shortfall: number;
  portfolio: number;
  salary: number;
  dbPension: number;
  cpp: number;
  oas: number;
  registeredWithdrawals: number;
  tfsaWithdrawals: number;
  nonRegisteredWithdrawals: number;
  cashWedgeWithdrawals: number;
  otherInflows: number;
  taxableIncome: number;
  effectiveRate: number;
  oasClawback: number;
  rrsp: number;
  tfsa: number;
  lif: number;
  nonRegistered: number;
  cash: number;
  total: number;
  reconciliationGap: number;
  cashFlowDelta: number;
  reconciliationStatus: CashFlowReconciliation['status'];
};

export type AnnualDetailSummary = {
  firstYear: number | null;
  finalYear: number | null;
  totalYears: number;
  fundedYears: number;
  firstShortfallYear: number | null;
  endPortfolio: number;
};

export type PortfolioChartPoint = {
  year: number;
  portfolio: number;
};

export type SpendingTaxChartPoint = {
  year: number;
  afterTaxSpending: number;
  tax: number;
  shortfall: number;
};

export type AccountBucketChartPoint = AccountBalancePoint;

export type ReconciliationDiagnostics = {
  rowsChecked: number;
  warningCount: number;
  firstWarningYear: number | null;
  maxReconciliationGap: number;
  maxCashFlowDelta: number;
  status: 'ok' | 'warning';
};

export type PlanHealthExplainer = {
  status: 'ready' | 'watch' | 'blocked';
  headline: string;
  fundedThroughYear: number | null;
  firstPressurePoint: string;
  largestReviewItem: string;
  detailFallback: string;
};

export type SourceReconciliationStory = {
  year: number | null;
  headline: string;
  sourcesBeforeTax: number;
  tax: number;
  fundedSpending: number;
  gap: number;
  steps: Array<{
    id: string;
    label: string;
    amount: number;
    tone: 'inflow' | 'outflow' | 'result' | 'watch';
  }>;
};

export type DecisionChecklistItem = {
  id:
    | 'sourceReconciliation'
    | 'cppOasTiming'
    | 'cashWedge'
    | 'oasClawback'
    | 'registeredTaxSpike'
    | 'survivorRisk'
    | 'estateTarget';
  label: string;
  status: 'ok' | 'review' | 'watch';
  reason: string;
  detail: string;
};

export type DecisionDetailRow = DecisionChecklistItem & {
  evidence: string;
  years: string;
  fallbackArea: ResultsWorkspaceSection;
};

export type TaxPressureRow = {
  year: number;
  taxableIncome: number;
  tax: number;
  oasClawback: number;
  registeredWithdrawals: number;
  pressure: 'low' | 'medium' | 'high';
  reason: string;
};

export type TaxPressureExplanation = {
  headline: string;
  rows: Array<TaxPressureRow & { explanation: string }>;
};

export type TaxStorySummary = {
  status: 'ok' | 'review' | 'watch';
  headline: string;
  detail: string;
  firstYearTax: number;
  peakTaxYear: number | null;
  peakTax: number;
  lifetimeTax: number;
  lifetimeOasClawback: number;
  registeredWithdrawalYears: number;
  planningWindowYears: string;
  stableDashboardHandoff: string;
};

export type TaxReviewRow = {
  id: 'oasClawback' | 'registeredWithdrawals' | 'peakTax' | 'planningWindow';
  label: string;
  severity: 'ok' | 'review' | 'watch';
  year: number | null;
  value: string;
  explanation: string;
  reviewAction: string;
};

export type ScenarioCard = {
  id: 'retireLater' | 'spendLessGogo' | 'delayBenefits';
  label: string;
  status: 'ready' | 'needsInput' | 'fallback';
  lever: string;
  baseline: string;
  detail: string;
  endPortfolioDelta?: number;
  fundedThroughYear?: number | null;
};

export type ScenarioChoiceCard = {
  id: 'currentPlan' | ScenarioCard['id'];
  label: string;
  status: 'ready' | 'needsInput' | 'calculating';
  tone: 'current' | 'improves' | 'tradeoff' | 'needsInput';
  householdChoice: string;
  bestFor: string;
  tradeoff: string;
  primaryMetricLabel: string;
  primaryMetric: string;
  secondaryMetricLabel: string;
  secondaryMetric: string;
  detail: string;
};

export type ScenarioAssumptionRow = {
  id: ScenarioCard['id'];
  label: string;
  baseline: string;
  scenario: string;
  changed: boolean;
};

export type ScenarioComparisonRow = {
  id: ScenarioCard['id'];
  label: string;
  endPortfolioDelta: number;
  firstYearSpendingDelta: number;
  lifetimeTaxDelta: number;
  firstShortfallYear: number | null;
  fundedThroughYear: number | null;
  status: 'improves' | 'mixed' | 'worse' | 'notAvailable';
};

export type SurvivorViewSummary = {
  status: 'single' | 'ready' | 'needsInput';
  headline: string;
  survivorYear: number | null;
  incomeAtRisk: number;
  detail: string;
};

export type SurvivorComparison = {
  status: 'single' | 'needsInput' | 'ready' | 'notAvailable';
  survivorYear: number | null;
  baselineEndPortfolio: number;
  survivorEndPortfolio: number;
  endPortfolioDelta: number;
  baselineLifetimeTax: number;
  survivorLifetimeTax: number;
  lifetimeTaxDelta: number;
  firstShortfallYear: number | null;
  fundedThroughYear: number | null;
  spendingFundedYears: string;
};

export type SurvivorStorySummary = {
  status: 'single' | 'needsInput' | 'notAvailable' | StressSeverity;
  headline: string;
  detail: string;
  survivorYear: number | null;
  readiness: string;
  incomeAtRisk: number;
  firstShortfallYear: number | null;
  fundedThroughYear: number | null;
  baselineEndPortfolio: number;
  survivorEndPortfolio: number;
  endPortfolioDelta: number;
  lifetimeTaxDelta: number;
  spendingFundedYears: string;
  stableDashboardHandoff: string;
};

export type SurvivorReviewRow = {
  id: 'setup' | 'incomeChange' | 'spendingFunding' | 'portfolioCushion' | 'lifetimeTax' | 'stressFollowup';
  label: string;
  severity: StressSeverity;
  value: string;
  explanation: string;
  reviewAction: string;
  detailArea: ResultsWorkspaceSection;
};

export type RecommendedCandidateId = 'baseline' | ScenarioCard['id'];

export type RecommendationReason =
  | 'sourceReconciliationBlocked'
  | 'validationBlocked'
  | 'noShortfall'
  | 'laterFundedThrough'
  | 'higherEndPortfolio'
  | 'lowerLifetimeTax'
  | 'survivorNeedsReview'
  | 'baselineTie';

export type RecommendedCandidateRow = {
  id: RecommendedCandidateId;
  label: string;
  score: number;
  recommended: boolean;
  blocked: boolean;
  reviewStatus: 'recommended' | 'review' | 'blocked';
  fundedThroughYear: number | null;
  firstShortfallYear: number | null;
  endPortfolio: number;
  endPortfolioDelta: number;
  lifetimeTax: number;
  lifetimeTaxDelta: number;
  spendingFundedYears: string;
  reasons: RecommendationReason[];
  tradeoffs: string[];
};

export type RecommendedConfidence = {
  level: 'higher' | 'moderate' | 'low';
  label: string;
  detail: string;
  drivers: string[];
};

export type RecommendedStressContext = {
  candidateId: RecommendedCandidateId | null;
  candidateLabel: string;
  sourceStatus: 'ok' | 'warning' | 'notAvailable';
  fundedThroughYear: number | null;
  firstShortfallYear: number | null;
  firstYearSpending: number;
  terminalPortfolio: number;
  lowestPortfolioYear: number | null;
  lowestPortfolio: number;
  fundedYears: number;
  totalYears: number;
  taxPressureCount: number;
  survivorStatus: SurvivorComparison['status'];
  summary: string;
};

export type RecommendedBreakRisk = {
  id:
    | 'sourceReconciliation'
    | 'spendingSensitivity'
    | 'retirementTiming'
    | 'benefitTiming'
    | 'shortfall'
    | 'terminalCushion'
    | 'taxPressure'
    | 'survivor';
  label: string;
  severity: 'ok' | 'review' | 'watch' | 'blocked';
  detail: string;
  handoff: string;
};

export type RecommendedRiskDetail = {
  id: RecommendedBreakRisk['id'];
  label: string;
  severity: RecommendedBreakRisk['severity'];
  candidateLabel: string;
  headline: string;
  detail: string;
  metrics: Array<{
    id: string;
    label: string;
    value: string;
    tone: 'neutral' | 'ok' | 'watch';
  }>;
  evidenceRows: Array<{
    id: string;
    label: string;
    value: string;
    detail: string;
  }>;
  handoff: string;
};

export type RecommendedChecklistItem = {
  id:
    | 'clearBlockers'
    | 'reviewStress'
    | 'confirmSpending'
    | 'confirmTiming'
    | 'inspectTaxes'
    | 'testSurvivor'
    | 'openStableDashboard'
    | 'savePlan';
  label: string;
  status: 'ready' | 'review' | 'blocked';
  priority: 'now' | 'next' | 'later';
  detail: string;
  handoff: string;
};

export type RecommendedPathSummary = {
  recommendedCandidateId: RecommendedCandidateId | null;
  recommendedLabel: string;
  headline: string;
  confidence: RecommendedConfidence;
  stressContext: RecommendedStressContext;
  breakRisks: RecommendedBreakRisk[];
  defaultRiskDetailId: RecommendedBreakRisk['id'] | null;
  riskDetails: RecommendedRiskDetail[];
  checklistItems: RecommendedChecklistItem[];
  reasons: string[];
  tradeoffs: string[];
  trustChecks: Array<{
    id: 'sourceReconciliation' | 'shortfall' | 'taxPressure' | 'survivor';
    label: string;
    status: 'ok' | 'review' | 'blocked';
    detail: string;
  }>;
  candidateRows: RecommendedCandidateRow[];
  whyNotRows: Array<{
    id: RecommendedCandidateId;
    label: string;
    reason: string;
  }>;
};

export type RecommendationValidation = {
  canGenerate?: boolean;
  blockers?: unknown[];
} | null | undefined;

export type ResultsReadinessStatus = 'ready' | 'review' | 'blocked';

export type ResultsReadinessSummary = {
  status: ResultsReadinessStatus;
  headline: string;
  detail: string;
  saveStatus: ResultsReadinessStatus;
  stableDashboardStatus: 'ready' | 'blocked';
  readyCount: number;
  reviewCount: number;
  blockedCount: number;
  recommendedLabel: string;
  stableDashboardHandoff: string;
};

export type ResultsReadinessRow = {
  id: 'blockers' | 'watchRisks' | 'taxes' | 'householdResilience' | 'stableDashboard' | 'savePlan';
  label: string;
  status: ResultsReadinessStatus;
  priority: 'now' | 'next' | 'later';
  detail: string;
  action: string;
  detailArea: ResultsWorkspaceSection;
};

export type ReleaseReadinessStatus = 'ready' | 'review' | 'blocked';

export type ReleaseReadinessCheckpoint = {
  status: ReleaseReadinessStatus;
  headline: string;
  detail: string;
  rows: Array<{
    id: 'inputs' | 'firstAnswer' | 'spending' | 'drawdownReview' | 'examples' | 'localSave' | 'verification' | 'feedbackScope';
    label: string;
    status: ReleaseReadinessStatus;
    detail: string;
    action: string;
    detailArea: ResultsWorkspaceSection;
  }>;
  reviewNote: string;
};

export type FeedbackReviewPackage = {
  status: 'ready' | 'review' | 'blocked';
  headline: string;
  detail: string;
  rows: Array<{
    id: 'exampleRun' | 'firstScreen' | 'spendingLanguage' | 'drawdownDetails' | 'localTrust' | 'verification' | 'uxReviewScope';
    label: string;
    status: 'ready' | 'review' | 'blocked';
    detail: string;
    reviewPrompt: string;
    detailArea: ResultsWorkspaceSection;
  }>;
  reviewScript: string[];
  reviewNote: string;
};

export type CheckpointReviewBoardStatus = 'ready' | 'review' | 'blocked';

export type CheckpointReviewBoard = {
  status: CheckpointReviewBoardStatus;
  headline: string;
  detail: string;
  rows: Array<{
    id: 'examples' | 'firstAnswer' | 'spending' | 'drawdown' | 'saveReport' | 'verification' | 'visualUx';
    label: string;
    status: CheckpointReviewBoardStatus;
    bucket: 'fixBeforeFeedback' | 'reviewDuringCheckpoint' | 'deferToUxPass';
    detail: string;
    checkpointQuestion: string;
    detailArea: ResultsWorkspaceSection;
  }>;
  fixBeforeFeedbackCount: number;
  reviewDuringCheckpointCount: number;
  deferToUxPassCount: number;
  reviewNote: string;
};

export type ReleaseReadinessCheckpointInput = {
  validation?: RecommendationValidation;
  resultsReadiness: ResultsReadinessSummary;
  retirementAnswer: RetirementAnswerSummary;
  spendingCapacity: SpendingCapacitySummary;
  drawdownReviewStatus?: 'ready' | 'review' | 'blocked' | null;
  drawdownCopyStatus?: 'ready' | 'review' | 'blocked' | null;
  examplesReady?: boolean;
  savedPlanClean?: boolean;
  verificationReady?: boolean;
};

export type FeedbackReviewPackageInput = {
  releaseReadiness: ReleaseReadinessCheckpoint;
  recommendedLabel: string;
  examplesReady?: boolean;
  verificationReady?: boolean;
  broadUxReviewDeferred?: boolean;
};

export type CheckpointReviewBoardInput = {
  releaseReadiness: ReleaseReadinessCheckpoint;
  feedbackPackage: FeedbackReviewPackage;
  broadUxReviewDeferred?: boolean;
};

export type RetirementAnswerStatus =
  | 'cannotTell'
  | 'notReady'
  | 'tight'
  | 'onTrackReview'
  | 'onTrack'
  | 'estateHeavy';

export type RetirementAnswerAction = {
  id: 'fixInputs' | 'spending' | 'estate' | 'tax' | 'survivor' | 'realEstate' | 'report';
  label: string;
  detail: string;
  detailArea: ResultsWorkspaceSection;
};

export type RetirementAnswerSummary = {
  status: RetirementAnswerStatus;
  label: string;
  headline: string;
  detail: string;
  fundedThroughYear: number | null;
  plannedEarlySpending: number;
  projectedMoneyLeft: number;
  lowestPortfolio: number;
  estateTarget: number;
  spendingHeadline: string;
  spendingDetail: string;
  estateHeadline: string;
  estateDetail: string;
  actions: RetirementAnswerAction[];
};

export type SpendingCapacityStatus = 'cannotTell' | 'needsReduction' | 'tight' | 'balanced' | 'flexible';

export type SpendingCapacitySummary = {
  status: SpendingCapacityStatus;
  label: string;
  headline: string;
  detail: string;
  planningEstimateLabel: string;
  planningEstimateDetail: string;
  estimatedSustainableAnnualSpending: number;
  earlySpending: number;
  laterSpending: number;
  lateLifeSpending: number;
  stressTestedEarlySpending: number;
  estimatedAnnualRoom: number;
  repairEarlySpending: number;
  projectedMoneyLeft: number;
  estateTarget: number;
  estateTradeoff: string;
  reviewActions: Array<{
    id: 'spendMore' | 'spendLess' | 'estate' | 'tax' | 'scenario';
    label: string;
    detail: string;
    detailArea: ResultsWorkspaceSection;
  }>;
};

export type MonthlyCapacityStatus = 'cannotTell' | 'gap' | 'tight' | 'covered';

export type MonthlyCapacityOption = {
  id: 'reduceSpending' | 'workLonger' | 'downsize' | 'saveMore' | 'taxReview' | 'estateReview';
  label: string;
  detail: string;
  detailArea: ResultsWorkspaceSection;
};

export type MonthlyCapacityFoundationSummary = {
  status: MonthlyCapacityStatus;
  label: string;
  headline: string;
  detail: string;
  monthlyMinimumExpensesExMortgage: number;
  monthlyMortgagePayment: number;
  monthlyFloor: number;
  monthlyAfterTaxCapacity: number;
  monthlyRoom: number;
  firstShortfallYear: number | null;
  optionIds: MonthlyCapacityOption['id'][];
  options: MonthlyCapacityOption[];
  boundary: string;
};

export type MonthlyCapacityReviewRow = {
  id: 'floor' | 'capacity' | 'room' | 'options';
  label: string;
  status: 'ok' | 'review' | 'gap' | 'unknown';
  value: string;
  detail: string;
  detailArea: ResultsWorkspaceSection;
};

export type MonthlyCapacityDecisionRow = {
  id: 'floorCoverage' | 'shortfallTiming' | 'survivorEstate' | 'optionGate';
  label: string;
  status: 'pass' | 'review' | 'block' | 'unknown';
  detail: string;
  detailArea: ResultsWorkspaceSection;
};

export type MonthlyCapacityDecisionLayer = {
  status: MonthlyCapacityStatus;
  headline: string;
  decision: 'readyForPresentation' | 'needsReview' | 'needsAction' | 'cannotDecide';
  rows: MonthlyCapacityDecisionRow[];
  primaryOptionIds: MonthlyCapacityOption['id'][];
  caveats: string[];
  boundary: string;
};

export type MonthlyCapacityFloorInputs = {
  status: 'ready' | 'missing';
  source: 'runtimePlan';
  monthlyMinimumExpensesExMortgage: number;
  monthlyMortgagePayment: number;
  monthlyFloor: number;
  detail: string;
  boundary: string;
};

export type MonthlyCapacityCaveatSignal = {
  id: 'tax' | 'survivor' | 'estate' | 'homeEquity' | 'spendingPath';
  label: string;
  status: 'clear' | 'review' | 'notApplicable';
  detail: string;
  detailArea: ResultsWorkspaceSection;
};

export type MonthlyCapacityOptimizerObjective = {
  status: 'readyForFutureOptimizer' | 'needsInputs';
  objective: 'coverMonthlyFloorFirst';
  floorMonthly: number;
  capacityMonthly: number;
  gapOrRoomMonthly: number;
  allowedLeverIds: Array<'reduceSpending' | 'workLonger' | 'downsize' | 'saveMore' | 'taxReview' | 'estateReview'>;
  forbiddenOutputs: Array<'savedCapacity' | 'accountLevelSequencing' | 'accountInstructions' | 'fundingTrace'>;
  detail: string;
  boundary: string;
};

export type MonthlyCapacityRuntimePacket = {
  status: MonthlyCapacityStatus;
  floorInputs: MonthlyCapacityFloorInputs;
  foundation: MonthlyCapacityFoundationSummary;
  reviewRows: MonthlyCapacityReviewRow[];
  decisionLayer: MonthlyCapacityDecisionLayer;
  caveatSignals: MonthlyCapacityCaveatSignal[];
  optimizerObjective: MonthlyCapacityOptimizerObjective;
  boundary: string;
};

export type MonthlyCapacityLeverGate = {
  id: 'reduceSpending' | 'workLonger' | 'downsize' | 'saveMore' | 'taxReview' | 'estateReview';
  status: 'allowed' | 'reviewOnly' | 'suppressed';
  reason: string;
};

export type MonthlyCapacityReadinessCloseout = {
  status: 'ready' | 'needsReview' | 'needsAction' | 'needsInputs';
  headline: string;
  nextStep: string;
  openGateIds: MonthlyCapacityLeverGate['id'][];
  boundary: string;
};

export type MonthlyCapacityOptimizerHandoffRow = {
  id: 'floorFirstObjective' | 'floorCoverage' | 'leverGate' | 'caveatCoverage' | 'outputBoundary';
  label: string;
  status: 'pass' | 'review' | 'block';
  detail: string;
};

export type MonthlyCapacityOptimizerHandoff = {
  status: 'ready' | 'review' | 'blocked';
  objective: 'coverMonthlyFloorFirst';
  packetStatus: MonthlyCapacityStatus;
  allowedPracticalLeverIds: MonthlyCapacityLeverGate['id'][];
  reviewOnlyLeverIds: MonthlyCapacityLeverGate['id'][];
  blockedOutputIds: MonthlyCapacityOptimizerObjective['forbiddenOutputs'];
  rows: MonthlyCapacityOptimizerHandoffRow[];
  boundary: string;
};

export type MonthlyCapacityOptimizerInputContract = {
  status: 'ready' | 'review' | 'blocked';
  capacityStatus: MonthlyCapacityOptimizerHandoff['status'];
  optimizerInputStatus: OptimizerInputReviewSummary['status'];
  canExploreLeverIds: OptimizerInputReviewRow['id'][];
  mustPreserveLeverIds: OptimizerInputReviewRow['id'][];
  needsDecisionLeverIds: OptimizerInputReviewRow['id'][];
  blockedReasons: string[];
  boundary: string;
};

export type MonthlyCapacityOptimizerGuardrail = {
  id: 'floorFirst' | 'neutralGapOptions' | 'noSavedOutput' | 'noFundingTrace' | 'noAccountInstructions' | 'noAnnualSequencing';
  status: 'pass' | 'review' | 'block';
  detail: string;
};

export type MonthlyCapacityOptimizerExampleHandoff = {
  id: string;
  capacityStatus: MonthlyCapacityStatus;
  handoffStatus: MonthlyCapacityOptimizerHandoff['status'];
  objective: 'coverMonthlyFloorFirst';
  openLeverIds: MonthlyCapacityLeverGate['id'][];
  guardrailStatuses: Record<MonthlyCapacityOptimizerGuardrail['id'], MonthlyCapacityOptimizerGuardrail['status']>;
  boundary: string;
};

export type MonthlyCapacityOptimizerExecutionGate = {
  status: 'blocked' | 'reviewOnly' | 'readyForFutureImplementation';
  headline: string;
  requiredBeforeExecution: Array<
    'completeCapacityInputs' | 'resolveOptimizerInputDecisions' | 'keepOutputRuntimeOnly' | 'defineCandidateScoring' | 'preserveNoAnnualSequencing'
  >;
  allowedNow: Array<'runtimeEvidence' | 'tests' | 'docs' | 'boundedReviewOnly'>;
  notAllowedYet: Array<'optimizerSearch' | 'savedOptimizerOutput' | 'fundingTrace' | 'accountInstructions' | 'annualAccountSequencing'>;
  boundary: string;
};

export type MonthlyCapacityOptimizerHandoffCloseout = {
  status: 'blocked' | 'readyForPlanning' | 'readyForFutureImplementation';
  headline: string;
  packageSummary: string;
  nextBroadStep: 'candidateScoringPlan' | 'capacityInputsFirst' | 'futureImplementationPackage';
  preservedBoundaries: MonthlyCapacityOptimizerExecutionGate['notAllowedYet'];
  boundary: string;
};

export type MonthlyCapacityScoringFactor = {
  id: 'floorCoverage' | 'gapRepair' | 'taxImpact' | 'survivorEstate' | 'disruptionPenalty' | 'outputBoundary';
  label: string;
  weight: 'primary' | 'secondary' | 'guardrail';
  direction: 'preferHigher' | 'preferLower' | 'preserve' | 'block';
  detail: string;
};

export type MonthlyCapacityScoringRubric = {
  status: 'blocked' | 'readyForPlanning';
  objective: 'coverMonthlyFloorFirst';
  factors: MonthlyCapacityScoringFactor[];
  primaryFactorIds: MonthlyCapacityScoringFactor['id'][];
  guardrailFactorIds: MonthlyCapacityScoringFactor['id'][];
  boundary: string;
};

export type MonthlyCapacityCandidateScoreInputs = {
  status: 'blocked' | 'ready';
  floorMonthly: number;
  capacityMonthly: number;
  gapOrRoomMonthly: number;
  hasGap: boolean;
  hasReviewCaveats: boolean;
  openLeverIds: MonthlyCapacityLeverGate['id'][];
  forbiddenOutputIds: MonthlyCapacityOptimizerHandoff['blockedOutputIds'];
  boundary: string;
};

export type MonthlyCapacityCandidateScorePolicyRow = {
  factorId: MonthlyCapacityScoringFactor['id'];
  status: 'active' | 'reviewOnly' | 'blocked';
  threshold: string;
  application: string;
};

export type MonthlyCapacityCandidateScorePolicy = {
  status: 'blocked' | 'readyForPlanning';
  rows: MonthlyCapacityCandidateScorePolicyRow[];
  tieBreakers: Array<'fewerDisruptiveChanges' | 'lowerTaxPressure' | 'strongerSurvivorEstateFit' | 'currentPlanIfEquivalent'>;
  boundary: string;
};

export type MonthlyCapacityScoringExampleReadiness = {
  id: string;
  status: 'blocked' | 'readyForPlanning';
  hasGap: boolean;
  activePolicyFactorIds: MonthlyCapacityScoringFactor['id'][];
  reviewOnlyPolicyFactorIds: MonthlyCapacityScoringFactor['id'][];
  boundary: string;
};

export type MonthlyCapacityScoringPlanCloseout = {
  status: 'blocked' | 'readyForImplementationPlanning';
  headline: string;
  nextBroadStep: 'candidateSetImplementationPlan' | 'capacityInputsFirst';
  completedPieces: Array<'rubric' | 'scoreInputs' | 'scorePolicy' | 'exampleMatrix' | 'persistenceGuardrails'>;
  stillDeferred: Array<'candidateScoringExecution' | 'optimizerSearch' | 'savedScores' | 'fundingTrace' | 'accountInstructions' | 'annualSequencing' | 'uiPresentation'>;
  boundary: string;
};

export type MinimumExpenseCoverageStatus = 'cannotTell' | 'gap' | 'tight' | 'covered';

export type MinimumExpenseCoverageSummary = {
  status: MinimumExpenseCoverageStatus;
  label: string;
  headline: string;
  detail: string;
  minimumAnnualExpense: number;
  minimumMonthlyExpense: number;
  estimatedAnnualCapacity: number;
  estimatedMonthlyCapacity: number;
  annualGapOrRoom: number;
  reviewOptions: Array<{
    id: 'expenses' | 'workLonger' | 'downsize' | 'saveMore' | 'benefits' | 'tax' | 'estate';
    label: string;
    detail: string;
    detailArea: ResultsWorkspaceSection;
  }>;
  boundary: string;
};

export type SpendingPathBridgePhase = {
  id: 'early' | 'later' | 'lateLife';
  label: string;
  annualSpending: number;
  monthlySpending: number;
  startsAtAge: number | null;
  endsAtAge: number | null;
  note: string;
};

export type SpendingPathBridgeSummary = {
  status: 'cannotTell' | 'ready';
  label: string;
  headline: string;
  detail: string;
  phases: SpendingPathBridgePhase[];
  breakpointAges: {
    earlyToLater: number | null;
    laterToLateLife: number | null;
  };
  boundary: string;
};

export type DiscretionaryRoomBridgeStatus = 'cannotTell' | 'none' | 'limited' | 'review';

export type DiscretionaryRoomBridgeSummary = {
  status: DiscretionaryRoomBridgeStatus;
  label: string;
  headline: string;
  detail: string;
  annualRoom: number;
  monthlyRoom: number;
  floorMonthly: number;
  capacityMonthly: number;
  reviewRows: Array<{
    id: 'floor' | 'tax' | 'estate' | 'survivor' | 'spendingPath';
    label: string;
    detail: string;
    detailArea: ResultsWorkspaceSection;
  }>;
  boundary: string;
};

export type EstateIntentStatus = 'cannotTell' | 'needsIntent' | 'taxReview' | 'survivorReview' | 'aligned';

export type EstateIntentSummary = {
  status: EstateIntentStatus;
  label: string;
  headline: string;
  detail: string;
  projectedEstate: number;
  estateTarget: number;
  estateGap: number;
  lifetimeTax: number;
  lifetimeOasClawback: number;
  finalRegisteredAssets: number;
  taxEfficiencyHeadline: string;
  taxEfficiencyDetail: string;
  reviewActions: Array<{
    id: 'estateGoal' | 'taxTiming' | 'registeredAssets' | 'survivor' | 'giving';
    label: string;
    detail: string;
    detailArea: ResultsWorkspaceSection;
  }>;
};

export type OptimizerBoundaryStatus = 'available' | 'needsInput' | 'reviewOnly';

export type OptimizerBoundaryRow = {
  id: 'spending' | 'retirementTiming' | 'benefitTiming' | 'withdrawalOrder' | 'estateTarget' | 'downsizing';
  label: string;
  status: OptimizerBoundaryStatus;
  currentSetting: string;
  futureSearchSpace: string;
  whyItMatters: string;
  beforeOptimizing: string;
  detailArea: ResultsWorkspaceSection;
};

export type OptimizerBoundarySummary = {
  status: 'ready' | 'needsInput' | 'review';
  headline: string;
  detail: string;
  availableCount: number;
  needsInputCount: number;
  reviewOnlyCount: number;
  nextStep: string;
  rows: OptimizerBoundaryRow[];
};

export type OptimizerInputPermission = 'canExplore' | 'mustPreserve' | 'needsDecision';

export type OptimizerInputReviewRow = {
  id: OptimizerBoundaryRow['id'];
  label: string;
  permission: OptimizerInputPermission;
  currentSetting: string;
  guardrail: string;
  reviewQuestion: string;
  suggestedNextStep: string;
  detailArea: ResultsWorkspaceSection;
};

export type OptimizerInputReviewSummary = {
  status: 'ready' | 'needsDecision' | 'review';
  headline: string;
  detail: string;
  canExploreCount: number;
  mustPreserveCount: number;
  needsDecisionCount: number;
  rows: OptimizerInputReviewRow[];
};

export type DrawdownReadinessStatus = 'cannotTell' | 'ready' | 'review';

export type DrawdownReadinessRow = {
  id: 'registeredPressure' | 'oasRecovery' | 'peakTax' | 'lowTaxWindow' | 'accountMix';
  label: string;
  tone: 'ok' | 'review' | 'watch';
  year: number | null;
  value: string;
  detail: string;
  reviewFocus: string;
  disposition: 'reviewOnly';
};

export type TaxAwareDrawdownPrototypeRow = {
  id: 'lowTaxWindow' | 'registeredPressure' | 'oasRecovery' | 'peakTax' | 'estatePressure';
  label: string;
  tone: 'ok' | 'review' | 'watch';
  year: number | null;
  value: string;
  evidence: string;
  futureQuestion: string;
  disposition: 'evidenceOnly';
};

export type TaxAwareDrawdownDraftStatus = 'usableForFutureReview' | 'needsInput' | 'blocked';

export type TaxAwareDrawdownDraftRow = {
  id: 'lowTaxRegisteredDraft' | 'registeredSmoothingDraft' | 'oasRecoveryDraft' | 'peakTaxDraft' | 'estatePressureDraft';
  label: string;
  status: TaxAwareDrawdownDraftStatus;
  year: number | null;
  accountBucket: 'registered' | 'flexible' | 'mixed' | 'none';
  direction: 'testEarlier' | 'smooth' | 'reducePressure' | 'preserveChoice' | 'none';
  amountBand: string;
  evidenceSource: TaxAwareDrawdownPrototypeRow['id'];
  detail: string;
  safetyNotes: string[];
  disposition: 'draftOnly';
};

export type TaxAwareDrawdownReadinessCheck = {
  id: 'accountBalances' | 'accountMix' | 'oasRecoveryExposure' | 'estateIntent' | 'lockedInAccounts' | 'survivorScenario';
  label: string;
  status: 'ready' | 'review' | 'needsInput' | 'blocked';
  detail: string;
};

export type TaxAwareDrawdownSandboxStatus = 'readyToCompareLater' | 'needsInput' | 'blocked' | 'notReady';

export type TaxAwareDrawdownSandboxRow = {
  id: 'firstFutureSandboxCheck';
  label: string;
  status: 'queuedForFutureReview' | 'heldForInput' | 'blocked';
  draftId: TaxAwareDrawdownDraftRow['id'] | null;
  baselineSignal: string;
  compareWouldNeed: string;
  holdReason: string;
  disposition: 'sandboxPlanningOnly';
};

export type TaxAwareDrawdownSandboxSummary = {
  status: TaxAwareDrawdownSandboxStatus;
  headline: string;
  detail: string;
  rows: TaxAwareDrawdownSandboxRow[];
  reviewNote: string;
};

export type TaxAwareDrawdownComparisonReadinessRow = {
  id: 'draftCheck' | 'sandboxGate' | 'accountEvidence' | 'householdGuardrails';
  label: string;
  status: 'ready' | 'review' | 'needsInput' | 'blocked';
  detail: string;
};

export type TaxAwareDrawdownComparisonReadinessSummary = {
  status: 'readyForLaterComparison' | 'needsInput' | 'blocked' | 'notReady';
  headline: string;
  detail: string;
  rows: TaxAwareDrawdownComparisonReadinessRow[];
  reviewNote: string;
};

export type TaxAwareDrawdownDraftSummary = {
  status: 'cannotTell' | 'readyForFutureReview' | 'needsInput' | 'blocked';
  headline: string;
  detail: string;
  rows: TaxAwareDrawdownDraftRow[];
  readinessRows: TaxAwareDrawdownReadinessCheck[];
  sandbox: TaxAwareDrawdownSandboxSummary;
  comparisonReadiness: TaxAwareDrawdownComparisonReadinessSummary;
  reviewNote: string;
};

export type DrawdownReadinessSummary = {
  status: DrawdownReadinessStatus;
  headline: string;
  detail: string;
  rows: DrawdownReadinessRow[];
  prototypeRows: TaxAwareDrawdownPrototypeRow[];
  drawdownOverrideDrafts: TaxAwareDrawdownDraftSummary;
  reviewNote: string;
};

const RECONCILIATION_TOLERANCE = 1;
const OAS_CLAWBACK_WATCH_THRESHOLD = 1;

function n(value: number | undefined): number {
  return Number.isFinite(value) ? Number(value) : 0;
}

function rowsFrom(result: SimulationResult | null | undefined): AnnualSimulationRow[] {
  return result?.years || [];
}

function planAssetTotal(plan: V2PlanPayload | null | undefined): number {
  if (!plan) return 0;
  const people = [plan.p1, plan.p2];
  return (
    people.reduce(
      (total, person) =>
        total +
        n(person?.rrsp) +
        n(person?.tfsa) +
        n(person?.lif) +
        n(person?.lira) +
        n(person?.nonreg),
      0
    ) + n(plan.cashWedge?.balance)
  );
}

function personLooksBlank(person: V2PlanPayload['p2'] | null | undefined): boolean {
  if (!person) return true;
  return (
    !person.name &&
    !n(person.dob) &&
    !n(person.retireYear) &&
    !n(person.salary) &&
    !n(person.rrsp) &&
    !n(person.tfsa) &&
    !n(person.lif) &&
    !n(person.nonreg) &&
    !n(person.cpp65_monthly) &&
    !n(person.oas_monthly)
  );
}

export function selectOverviewMetrics(result: SimulationResult | null | undefined): OverviewMetrics {
  const rows = rowsFrom(result);
  const first = rows[0];
  const last = rows[rows.length - 1];
  const reconciliation = selectCashFlowReconciliation(first);

  return {
    firstYear: first?.year ?? null,
    lastYear: last?.year ?? null,
    projectionYears: rows.length,
    endPortfolio: n(last?.bal_total),
    firstYearSpending: n(first?.totalAftaxYear || first?.spending),
    firstYearTax: n(first?.totalTaxYear),
    firstYearFunding: reconciliation.reconciledAfterTaxSpending,
    firstYearFundingGap: reconciliation.reconciliationDelta,
    hasShortfall: rows.some((row) => n(row.shortfall) > RECONCILIATION_TOLERANCE)
  };
}

export function selectRetirementAnswerSummary(
  result: SimulationResult | null | undefined,
  plan: V2PlanPayload | null | undefined,
  validation: RecommendationValidation = null,
  survivor: SimulationResult | null | undefined = null
): RetirementAnswerSummary {
  const rows = rowsFrom(result);
  const overview = selectOverviewMetrics(result);
  const diagnostics = selectReconciliationDiagnostics(result);
  const survivorComparison = selectSurvivorComparison(result, survivor, plan);
  const firstShortfall = rows.find((row) => n(row.shortfall) > RECONCILIATION_TOLERANCE);
  const fundedThroughYear = firstShortfall ? firstShortfall.year - 1 : overview.lastYear;
  const lowestPortfolio = rows.reduce((lowest, row) => Math.min(lowest, n(row.bal_total)), Number.POSITIVE_INFINITY);
  const safeLowestPortfolio = Number.isFinite(lowestPortfolio) ? lowestPortfolio : 0;
  const plannedEarlySpending = n(plan?.spending?.gogo) || overview.firstYearSpending;
  const estateTarget = n(plan?.inheritance);
  const yearsOfSpendingLeft =
    overview.firstYearSpending > 0 ? overview.endPortfolio / Math.max(overview.firstYearSpending, 1) : 0;
  const validationBlocked = validation?.canGenerate === false || Boolean(validation?.blockers && validation.blockers.length > 0);
  const sourceNeedsReview = diagnostics.status === 'warning';
  const hasEstateTarget = estateTarget > 0;
  const estateHeavy =
    !firstShortfall &&
    !hasEstateTarget &&
    overview.endPortfolio >= 1_000_000 &&
    yearsOfSpendingLeft >= 20;
  const tight =
    !firstShortfall &&
    !estateHeavy &&
    overview.firstYearSpending > 0 &&
    (safeLowestPortfolio < overview.firstYearSpending * 2 || overview.endPortfolio < overview.firstYearSpending * 5);
  const hasRealEstateDecision = Boolean(
    n(plan?.downsize?.year) || n(plan?.downsize?.netProceeds) || n(plan?.mortgage?.balance)
  );

  let status: RetirementAnswerStatus = 'onTrack';
  if (!rows.length || validationBlocked) status = 'cannotTell';
  else if (firstShortfall) status = 'notReady';
  else if (estateHeavy) status = 'estateHeavy';
  else if (tight) status = 'tight';
  else if (sourceNeedsReview || survivorComparison.status === 'needsInput' || survivorComparison.status === 'notAvailable') {
    status = 'onTrackReview';
  }

  const labelByStatus: Record<RetirementAnswerStatus, string> = {
    cannotTell: 'Cannot tell yet',
    notReady: 'Plan needs changes',
    tight: 'Retirement looks tight',
    onTrackReview: 'On track, with review items',
    onTrack: 'On track',
    estateHeavy: 'Strongly funded'
  };
  const headlineByStatus: Record<RetirementAnswerStatus, string> = {
    cannotTell: 'A retirement answer needs the remaining input blockers cleared first.',
    notReady: `This plan does not fully fund spending through the full projection; the first shortfall appears in ${firstShortfall?.year ?? 'a future year'}.`,
    tight: 'The plan appears to reach the projection end, but the cushion is limited.',
    onTrackReview: 'The plan appears funded through the projection, with a few assumptions worth reviewing.',
    onTrack: 'The plan appears funded through the full projection under the current assumptions.',
    estateHeavy: 'The plan appears strongly funded; the bigger question is how intentionally you want to use or preserve the surplus.'
  };

  const spendingHeadline =
    status === 'estateHeavy'
      ? 'You may have room to spend more, not less.'
      : status === 'notReady'
        ? 'Spending needs a repair plan.'
        : status === 'tight'
          ? 'Current spending looks possible, but with limited margin.'
          : 'Current spending appears supportable under the base assumptions.';
  const spendingDetail =
    status === 'estateHeavy'
      ? 'Because the plan leaves a large projected balance and no estate target is entered, review whether higher early-retirement spending, giving, or an earlier retirement date better matches the household goal.'
      : status === 'notReady'
        ? 'Use the scenario cards to compare lower early spending, working longer, or timing changes before treating the plan as ready.'
        : status === 'tight'
          ? 'Small changes in spending, markets, or timing may matter. Review the risk section before relying on this plan.'
          : 'Confirm the entered early, later, and late-life spending assumptions reflect regular expenses and the life the household wants.';
  const estateHeadline =
    estateTarget > 0
      ? 'An estate goal is part of this plan.'
      : estateHeavy
        ? 'No estate target is entered, but the plan leaves a large projected estate.'
        : 'No specific estate target is entered.';
  const estateDetail =
    estateTarget > 0
      ? 'Compare the projected money left with the intended estate goal and review whether spending, tax timing, or gifts should be adjusted.'
      : estateHeavy
        ? 'That may be exactly right, but it should be intentional. A large ending balance is not automatically better if the household would rather enjoy more of the money during retirement.'
        : 'If leaving money is important, add a target. If not, the next review is whether spending and tax timing fit the desired lifestyle.';

  const actions: RetirementAnswerAction[] = [];
  if (status === 'cannotTell') {
    actions.push({
      id: 'fixInputs',
      label: 'Clear input blockers',
      detail: 'Finish the required inputs so the plan can produce a reliable retirement answer.',
      detailArea: 'assumptions'
    });
  }
  actions.push({
    id: 'spending',
    label: status === 'estateHeavy' ? 'Review spending capacity' : 'Confirm spending comfort',
    detail: spendingDetail,
    detailArea: 'stressTests'
  });
  actions.push({
    id: 'estate',
    label: estateHeavy || estateTarget > 0 ? 'Clarify estate wishes' : 'Decide whether an estate target matters',
    detail: estateDetail,
    detailArea: 'accounts'
  });
  if (hasRealEstateDecision) {
    actions.push({
      id: 'realEstate',
      label: 'Review real estate choices',
      detail: 'Mortgage, downsize timing, or home equity may change how much the household can enjoy earlier in retirement.',
      detailArea: 'assumptions'
    });
  }
  actions.push({
    id: 'tax',
    label: 'Look for tax efficiency',
    detail: 'Review registered withdrawals, OAS recovery tax, and later-life tax pressure so the household can understand trade-offs between taxes, spending, flexibility, and estate goals.',
    detailArea: 'taxes'
  });
  if (!personLooksBlank(plan?.p2)) {
    actions.push({
      id: 'survivor',
      label: 'Check survivor security',
      detail: 'For a couple, confirm the surviving spouse still has enough income and flexibility.',
      detailArea: 'householdResilience'
    });
  }
  actions.push({
    id: 'report',
    label: 'Open printable report',
    detail: 'Use the printable report for readable charts, annual tables, account rows, and tax detail.',
    detailArea: 'exportSave'
  });

  return {
    status,
    label: labelByStatus[status],
    headline: headlineByStatus[status],
    detail:
      status === 'estateHeavy'
        ? 'The model is no longer treating a larger ending balance as automatically better. Use this as a lifestyle and estate-intent conversation.'
        : 'Use this answer as a first planning read, then review the items below before relying on the plan.',
    fundedThroughYear,
    plannedEarlySpending,
    projectedMoneyLeft: overview.endPortfolio,
    lowestPortfolio: safeLowestPortfolio,
    estateTarget,
    spendingHeadline,
    spendingDetail,
    estateHeadline,
    estateDetail,
    actions: actions.slice(0, 6)
  };
}

export function selectSpendingCapacitySummary(
  baseline: SimulationResult | null | undefined,
  comparisons: Partial<Record<ScenarioCard['id'], SimulationResult | null | undefined>>,
  plan: V2PlanPayload | null | undefined,
  retirementAnswer: RetirementAnswerSummary = selectRetirementAnswerSummary(baseline, plan)
): SpendingCapacitySummary {
  const overview = selectOverviewMetrics(baseline);
  const rows = rowsFrom(baseline);
  const firstShortfall = rows.find((row) => n(row.shortfall) > RECONCILIATION_TOLERANCE);
  const spendLessOverview = selectOverviewMetrics(comparisons.spendLessGogo);
  const spendLessRows = rowsFrom(comparisons.spendLessGogo);
  const spendLessShortfall = spendLessRows.find((row) => n(row.shortfall) > RECONCILIATION_TOLERANCE);
  const earlySpending = n(plan?.spending?.gogo) || overview.firstYearSpending;
  const laterSpending = n(plan?.spending?.slowgo);
  const lateLifeSpending = n(plan?.spending?.nogo);
  const stressTestedEarlySpending = earlySpending > 0 ? Math.round(earlySpending * 0.9) : 0;
  const estateTarget = n(plan?.inheritance);
  const minimumCushion = Math.max(overview.firstYearSpending * 5, estateTarget);
  const spendableSurplus = Math.max(0, overview.endPortfolio - minimumCushion);
  const estimatedAnnualRoom =
    rows.length > 0 && retirementAnswer.status === 'estateHeavy'
      ? Math.round(Math.min(earlySpending * 0.25, spendableSurplus / rows.length))
      : 0;

  let status: SpendingCapacityStatus = 'balanced';
  if (!rows.length || retirementAnswer.status === 'cannotTell') status = 'cannotTell';
  else if (firstShortfall) status = 'needsReduction';
  else if (retirementAnswer.status === 'tight') status = 'tight';
  else if (retirementAnswer.status === 'estateHeavy' || estimatedAnnualRoom > earlySpending * 0.05) status = 'flexible';

  const labelByStatus: Record<SpendingCapacityStatus, string> = {
    cannotTell: 'Cannot estimate yet',
    needsReduction: 'Minimum spending needs review',
    tight: 'Spending looks tight',
    balanced: 'Spending looks supportable',
    flexible: 'Spending may have room'
  };
  const headlineByStatus: Record<SpendingCapacityStatus, string> = {
    cannotTell: 'Spending capacity needs the retirement answer to calculate first.',
    needsReduction: spendLessRows.length && !spendLessShortfall
      ? 'A lower early-retirement spending test removes the visible shortfall.'
      : 'The current spending assumption is higher than the plan can comfortably support in the visible projection.',
    tight: 'Current spending appears possible, but the cushion is limited.',
    balanced: 'Current spending appears reasonable under the base assumptions.',
    flexible: 'This plan may support more lifestyle spending, especially if the large projected estate is not intentional.'
  };
  const detailByStatus: Record<SpendingCapacityStatus, string> = {
    cannotTell: 'Clear blockers first, then revisit this planning estimate.',
    needsReduction: spendLessRows.length && !spendLessShortfall
      ? `The built-in lower-spending test uses about ${moneyText(stressTestedEarlySpending)} in early retirement and remains funded through ${spendLessOverview.lastYear ?? 'the projection end'}.`
      : 'Review spending, work timing, real estate choices, and benefit timing together rather than relying on one spending cut.',
    tight: 'Treat this as a planning estimate for review: small changes in spending, taxes, markets, or timing could matter.',
    balanced: 'The next review is whether the entered spending assumption reflects regular expenses and the life the household wants.',
    flexible: estimatedAnnualRoom > 0
      ? `A first-pass planning estimate suggests roughly ${moneyText(estimatedAnnualRoom)} of possible extra annual lifestyle room, subject to tax, market, estate, and survivor review.`
      : 'There may be flexibility, but the exact amount should be tested with a dedicated spending scenario.'
  };
  const repairEarlySpending = status === 'needsReduction' && spendLessRows.length && !spendLessShortfall ? stressTestedEarlySpending : 0;
  const estimatedSustainableAnnualSpending =
    status === 'needsReduction' && repairEarlySpending > 0
      ? repairEarlySpending
      : status === 'flexible' && estimatedAnnualRoom > 0
        ? earlySpending + estimatedAnnualRoom
        : earlySpending;
  const planningEstimateLabel =
    status === 'needsReduction'
      ? 'Lower early-spending estimate for review'
      : status === 'flexible' && estimatedAnnualRoom > 0
        ? 'Spending estimate for review'
        : 'Current spending estimate';
  const planningEstimateDetail =
    status === 'cannotTell'
      ? "Today's-dollar spending estimate will appear after required inputs are complete."
      : status === 'needsReduction' && repairEarlySpending > 0
        ? "This is the lower early-retirement spending test in today's dollars, not a guarantee or personal financial advice."
        : status === 'flexible' && estimatedAnnualRoom > 0
          ? "This is a first-pass annual lifestyle estimate in today's dollars for review, not a guarantee."
          : "This keeps the current annual spending assumption visible in today's dollars for review.";
  const estateTradeoff =
    status === 'flexible'
      ? estateTarget > 0
        ? 'Spending more should be tested against the estate target already entered.'
        : 'Spending more may reduce a large projected estate, which may be desirable if the household wants more retirement enjoyment and does not have a firm estate target.'
      : estateTarget > 0
        ? 'Keep the estate target visible while reviewing spending changes.'
        : 'If preserving money is important, add an estate target before increasing spending.';
  const reviewActions: SpendingCapacitySummary['reviewActions'] = [];

  if (status === 'flexible') {
    reviewActions.push({
      id: 'spendMore',
      label: 'Test more early-retirement spending',
      detail: 'Consider whether travel, home projects, gifts, or earlier enjoyment would better match the household goal.',
      detailArea: 'stressTests'
    });
  }
  if (status === 'needsReduction' || status === 'tight') {
    reviewActions.push({
      id: 'spendLess',
      label: status === 'needsReduction' ? 'Compare ways to cover the gap' : 'Protect the cushion',
      detail:
        repairEarlySpending > 0
          ? `The lower-spending test uses ${moneyText(repairEarlySpending)} in early retirement.`
          : 'Review lower expenses, working longer, downsizing, saving more, benefit timing, and tax together.',
      detailArea: 'stressTests'
    });
  }
  reviewActions.push({
    id: 'estate',
    label: 'Make the estate goal explicit',
    detail: estateTradeoff,
    detailArea: 'details'
  });
  reviewActions.push({
    id: 'tax',
    label: 'Check tax impact',
    detail: 'More or less spending can change registered withdrawals, OAS recovery tax, and later-life tax pressure.',
    detailArea: 'taxes'
  });
  reviewActions.push({
    id: 'scenario',
    label: 'Use scenarios as a first test',
    detail: 'The current scenarios are directional checks, not a full spending optimizer.',
    detailArea: 'stressTests'
  });

  return {
    status,
    label: labelByStatus[status],
    headline: headlineByStatus[status],
    detail: detailByStatus[status],
    planningEstimateLabel,
    planningEstimateDetail,
    estimatedSustainableAnnualSpending,
    earlySpending,
    laterSpending,
    lateLifeSpending,
    stressTestedEarlySpending,
    estimatedAnnualRoom,
    repairEarlySpending,
    projectedMoneyLeft: overview.endPortfolio,
    estateTarget,
    estateTradeoff,
    reviewActions: reviewActions.slice(0, 4)
  };
}

export function selectMonthlyCapacityFoundation(
  baseline: SimulationResult | null | undefined,
  plan: V2PlanPayload | null | undefined,
  spendingCapacity: SpendingCapacitySummary = selectSpendingCapacitySummary(baseline, {}, plan)
): MonthlyCapacityFoundationSummary {
  const rows = rowsFrom(baseline);
  const firstShortfall = rows.find((row) => n(row.shortfall) > RECONCILIATION_TOLERANCE);
  const monthlyMortgagePayment = Math.max(0, n(plan?.mortgage?.monthly));
  const monthlyFloor = Math.max(0, n(plan?.spending?.gogo) / 12);
  const monthlyMinimumExpensesExMortgage = Math.max(0, monthlyFloor - monthlyMortgagePayment);
  const monthlyAfterTaxCapacity = Math.max(0, n(spendingCapacity.estimatedSustainableAnnualSpending) / 12);
  const monthlyRoom = monthlyAfterTaxCapacity - monthlyFloor;
  const tightThreshold = Math.max(100, monthlyFloor * 0.05);

  let status: MonthlyCapacityStatus = 'covered';
  if (!rows.length || monthlyFloor <= 0 || monthlyAfterTaxCapacity <= 0 || spendingCapacity.status === 'cannotTell') {
    status = 'cannotTell';
  } else if (firstShortfall || monthlyRoom < 0 || spendingCapacity.status === 'needsReduction') {
    status = 'gap';
  } else if (monthlyRoom <= tightThreshold || spendingCapacity.status === 'tight') {
    status = 'tight';
  }

  const labelByStatus: Record<MonthlyCapacityStatus, string> = {
    cannotTell: 'Monthly capacity needs more inputs',
    gap: 'Minimum monthly expenses need review',
    tight: 'Minimum monthly expenses look tight',
    covered: 'Minimum monthly expenses appear covered'
  };
  const headlineByStatus: Record<MonthlyCapacityStatus, string> = {
    cannotTell: 'The model needs complete inputs before estimating monthly capacity.',
    gap: 'The modelled monthly capacity does not cover the minimum floor under the current assumptions.',
    tight: 'The modelled monthly capacity covers the minimum floor, but with limited room.',
    covered: 'The modelled monthly capacity covers the minimum floor under the current assumptions.'
  };
  const detailByStatus: Record<MonthlyCapacityStatus, string> = {
    cannotTell: 'Complete the required plan inputs, then compare minimum monthly expenses with modelled after-tax capacity.',
    gap: 'Compare practical options neutrally: reduce spending, work longer, downsize if realistic, or save more before retirement.',
    tight: 'Review taxes, benefit timing, survivor needs, estate intent, and the spending path before relying on the extra room.',
    covered: 'Use this as a planning estimate in today’s dollars, not a guarantee or personal financial advice.'
  };

  const options: MonthlyCapacityOption[] =
    status === 'gap'
      ? [
          {
            id: 'reduceSpending',
            label: 'Reduce spending',
            detail: 'Review whether the minimum monthly floor is complete and whether any regular expenses can reasonably change.',
            detailArea: 'stressTests'
          },
          {
            id: 'workLonger',
            label: 'Work longer',
            detail: 'Compare whether working longer improves savings, benefits, and the number of years the plan must fund.',
            detailArea: 'stressTests'
          },
          {
            id: 'downsize',
            label: 'Downsize if realistic',
            detail: 'Treat home equity as an option to compare only if the household would truly consider it.',
            detailArea: 'details'
          },
          {
            id: 'saveMore',
            label: 'Save more',
            detail: 'Compare whether additional saving before retirement changes the floor coverage picture.',
            detailArea: 'details'
          }
        ]
      : [
          {
            id: 'taxReview',
            label: 'Review tax impact',
            detail: 'Taxes and OAS recovery can change how much after-tax spending is available each month.',
            detailArea: 'taxes'
          },
          {
            id: 'estateReview',
            label: 'Review estate intent',
            detail: 'Room above the floor should be reviewed against survivor needs and estate goals.',
            detailArea: 'details'
          }
        ];

  return {
    status,
    label: labelByStatus[status],
    headline: headlineByStatus[status],
    detail: detailByStatus[status],
    monthlyMinimumExpensesExMortgage,
    monthlyMortgagePayment,
    monthlyFloor,
    monthlyAfterTaxCapacity,
    monthlyRoom,
    firstShortfallYear: firstShortfall?.year ?? null,
    optionIds: options.map((option) => option.id),
    options,
    boundary:
      'Runtime-only capacity foundation: compares the minimum monthly floor with modelled after-tax monthly capacity. No saved field, optimizer output, funding trace, or engine output schema change is added.'
  };
}

export function selectMonthlyCapacityReviewRows(summary: MonthlyCapacityFoundationSummary): MonthlyCapacityReviewRow[] {
  const status =
    summary.status === 'cannotTell'
      ? 'unknown'
      : summary.status === 'gap'
        ? 'gap'
        : summary.status === 'tight'
          ? 'review'
          : 'ok';
  return [
    {
      id: 'floor',
      label: 'Minimum monthly floor',
      status: summary.monthlyFloor > 0 ? 'ok' : 'unknown',
      value: moneyText(Math.round(summary.monthlyFloor)),
      detail: 'Includes minimum monthly expenses and any mortgage payment already entered in debts.',
      detailArea: 'details'
    },
    {
      id: 'capacity',
      label: 'Modelled monthly after-tax capacity',
      status,
      value: moneyText(Math.round(summary.monthlyAfterTaxCapacity)),
      detail: 'Derived at runtime from the current projection. This is not saved in the plan file.',
      detailArea: 'overview'
    },
    {
      id: 'room',
      label: summary.monthlyRoom >= 0 ? 'Modelled room above floor' : 'Modelled gap below floor',
      status,
      value: moneyText(Math.round(summary.monthlyRoom)),
      detail:
        summary.monthlyRoom >= 0
          ? 'Shows modelled room above the minimum floor before tax, survivor, estate, and spending-path review.'
          : 'Shows the modelled monthly gap to review before treating discretionary spending as available.',
      detailArea: summary.monthlyRoom >= 0 ? 'details' : 'stressTests'
    },
    {
      id: 'options',
      label: summary.status === 'gap' ? 'Practical options to compare' : 'Review items',
      status,
      value: String(summary.options.length),
      detail: summary.options.map((option) => option.label).join(', '),
      detailArea: summary.status === 'gap' ? 'stressTests' : 'details'
    }
  ];
}

export function selectMonthlyCapacityDecisionLayer(
  summary: MonthlyCapacityFoundationSummary,
  plan: V2PlanPayload | null | undefined
): MonthlyCapacityDecisionLayer {
  const hasCouple = !personLooksBlank(plan?.p2);
  const hasEstateInput = n(plan?.inheritance) > 0 || n(plan?.downsize?.year) > 0 || n(plan?.downsize?.netProceeds) > 0;
  const mortgageIncluded = summary.monthlyMortgagePayment > 0;
  const caveats = [
    'Modelled monthly capacity is a runtime estimate in today’s dollars.',
    'Taxes, benefit timing, market returns, survivor needs, estate intent, and spending path assumptions can change the result.'
  ];
  if (hasCouple) caveats.push('Couple plans should review survivor resilience before relying on room above the floor.');
  if (hasEstateInput) caveats.push('Estate and home-equity choices should stay visible when comparing room or gaps.');

  const rows: MonthlyCapacityDecisionRow[] = [
    {
      id: 'floorCoverage',
      label: 'Floor coverage',
      status: summary.status === 'cannotTell' ? 'unknown' : summary.status === 'gap' ? 'block' : summary.status === 'tight' ? 'review' : 'pass',
      detail:
        summary.status === 'gap'
          ? 'Modelled after-tax monthly capacity is below the minimum monthly floor.'
          : mortgageIncluded
            ? 'The minimum monthly floor includes expenses excluding mortgage plus the mortgage payment already entered in debts.'
            : 'The minimum monthly floor uses expenses excluding mortgage; no mortgage payment is currently included.',
      detailArea: 'overview'
    },
    {
      id: 'shortfallTiming',
      label: 'Shortfall timing',
      status: summary.status === 'cannotTell' ? 'unknown' : summary.firstShortfallYear ? 'block' : 'pass',
      detail: summary.firstShortfallYear
        ? `The first visible shortfall appears in ${summary.firstShortfallYear}.`
        : 'No visible projection shortfall is present in the runtime rows used for this capacity estimate.',
      detailArea: 'stressTests'
    },
    {
      id: 'survivorEstate',
      label: 'Survivor and estate caveats',
      status: summary.status === 'cannotTell' ? 'unknown' : hasCouple || hasEstateInput ? 'review' : 'pass',
      detail:
        hasCouple || hasEstateInput
          ? 'Review survivor resilience, estate intent, and home-equity assumptions before relying on room above the floor.'
          : 'No active second person, estate target, or downsize input is present in this runtime plan.',
      detailArea: hasCouple ? 'householdResilience' : 'details'
    },
    {
      id: 'optionGate',
      label: 'Option gate',
      status: summary.status === 'cannotTell' ? 'unknown' : summary.status === 'gap' ? 'block' : 'pass',
      detail:
        summary.status === 'gap'
          ? 'Show practical options to compare because the minimum floor is not covered.'
          : 'Do not show lifestyle-reduction options unless the runtime status is gap.',
      detailArea: summary.status === 'gap' ? 'stressTests' : 'details'
    }
  ];

  const decision: MonthlyCapacityDecisionLayer['decision'] =
    summary.status === 'cannotTell'
      ? 'cannotDecide'
      : summary.status === 'gap'
        ? 'needsAction'
        : rows.some((row) => row.status === 'review')
          ? 'needsReview'
          : 'readyForPresentation';

  return {
    status: summary.status,
    headline:
      summary.status === 'gap'
        ? 'Minimum monthly expenses are not covered under the current runtime estimate.'
        : summary.status === 'cannotTell'
          ? 'Monthly capacity cannot be decided yet.'
          : summary.status === 'tight'
            ? 'Minimum monthly expenses appear covered, with limited room.'
            : 'Minimum monthly expenses appear covered under the current runtime estimate.',
    decision,
    rows,
    primaryOptionIds: summary.status === 'gap' ? ['reduceSpending', 'workLonger', 'downsize', 'saveMore'] : summary.optionIds,
    caveats,
    boundary:
      'Runtime-only decision layer: this summarizes capacity decisions for later presentation. It does not save capacity output, prescribe actions, or change engine output schema.'
  };
}

export function selectMonthlyCapacityFloorInputs(plan: V2PlanPayload | null | undefined): MonthlyCapacityFloorInputs {
  const monthlyMortgagePayment = Math.max(0, n(plan?.mortgage?.monthly));
  const monthlyFloor = Math.max(0, n(plan?.spending?.gogo) / 12);
  const monthlyMinimumExpensesExMortgage = Math.max(0, monthlyFloor - monthlyMortgagePayment);
  const status: MonthlyCapacityFloorInputs['status'] = monthlyFloor > 0 ? 'ready' : 'missing';

  return {
    status,
    source: 'runtimePlan',
    monthlyMinimumExpensesExMortgage,
    monthlyMortgagePayment,
    monthlyFloor,
    detail:
      status === 'ready'
        ? 'Runtime floor inputs separate minimum monthly expenses from any mortgage payment already entered in debts.'
        : 'Minimum monthly floor inputs are missing, so monthly capacity should not be estimated yet.',
    boundary:
      'Runtime-only floor inputs: these values are read from the current runtime plan and do not add saved calculated capacity, optimizer output, or engine output fields.'
  };
}

export function selectMonthlyCapacityCaveatSignals(
  baseline: SimulationResult | null | undefined,
  plan: V2PlanPayload | null | undefined,
  summary: MonthlyCapacityFoundationSummary
): MonthlyCapacityCaveatSignal[] {
  const tax = selectTaxSummaryMetrics(baseline);
  const hasCouple = !personLooksBlank(plan?.p2);
  const hasEstateTarget = n(plan?.inheritance) > 0;
  const hasHomeEquityInput = n(plan?.downsize?.year) > 0 || n(plan?.downsize?.netProceeds) > 0 || n(plan?.mortgage?.monthly) > 0;
  const path = selectSpendingPathBridgeSummary(plan);

  return [
    {
      id: 'tax',
      label: 'Tax and benefit timing',
      status: tax.lifetimeTax > 0 || tax.lifetimeOasClawback > 0 ? 'review' : 'clear',
      detail:
        tax.lifetimeTax > 0 || tax.lifetimeOasClawback > 0
          ? 'Tax, OAS recovery, and registered withdrawals can change modelled after-tax monthly capacity.'
          : 'No visible tax pressure appears in the runtime rows used for this caveat check.',
      detailArea: 'taxes'
    },
    {
      id: 'survivor',
      label: 'Survivor resilience',
      status: hasCouple ? 'review' : 'notApplicable',
      detail: hasCouple
        ? 'Two-person plans should review survivor resilience before relying on room above the floor.'
        : 'No active second person is present in this runtime plan.',
      detailArea: 'householdResilience'
    },
    {
      id: 'estate',
      label: 'Estate intent',
      status: hasEstateTarget || summary.monthlyRoom > 0 ? 'review' : 'clear',
      detail:
        hasEstateTarget || summary.monthlyRoom > 0
          ? 'Room above the floor should stay visible against estate intent and money-left trade-offs.'
          : 'No estate target or modelled room above the floor is visible in this runtime check.',
      detailArea: 'details'
    },
    {
      id: 'homeEquity',
      label: 'Home equity and mortgage',
      status: hasHomeEquityInput ? 'review' : 'notApplicable',
      detail: hasHomeEquityInput
        ? 'Mortgage payments and any downsizing assumption should be reviewed before comparing capacity options.'
        : 'No mortgage payment or downsizing input is present in this runtime plan.',
      detailArea: 'details'
    },
    {
      id: 'spendingPath',
      label: 'Spending path',
      status: path.status === 'ready' ? 'review' : 'clear',
      detail:
        path.status === 'ready'
          ? 'Age-based spending changes are modelled underneath the monthly answer and can change the room or gap.'
          : 'Spending path breakpoints are not ready, so the monthly answer should stay conservative.',
      detailArea: 'details'
    }
  ];
}

export function selectMonthlyCapacityOptimizerObjective(summary: MonthlyCapacityFoundationSummary): MonthlyCapacityOptimizerObjective {
  const needsInputs = summary.status === 'cannotTell';

  return {
    status: needsInputs ? 'needsInputs' : 'readyForFutureOptimizer',
    objective: 'coverMonthlyFloorFirst',
    floorMonthly: summary.monthlyFloor,
    capacityMonthly: summary.monthlyAfterTaxCapacity,
    gapOrRoomMonthly: summary.monthlyRoom,
    allowedLeverIds: summary.optionIds,
    forbiddenOutputs: ['savedCapacity', 'accountLevelSequencing', 'accountInstructions', 'fundingTrace'],
    detail: needsInputs
      ? 'Complete runtime floor and capacity inputs before a future optimizer compares options.'
      : summary.status === 'gap'
        ? 'A future optimizer should compare practical ways to cover the monthly floor before considering discretionary room.'
        : 'A future optimizer should preserve floor coverage first, then compare review items such as tax and estate trade-offs.',
    boundary:
      'Runtime-only optimizer objective: floor coverage is the first future objective. This does not run an optimizer, save calculated capacity, create account instructions, or add a funding trace.'
  };
}

export function selectMonthlyCapacityRuntimePacket(
  baseline: SimulationResult | null | undefined,
  plan: V2PlanPayload | null | undefined,
  spendingCapacity: SpendingCapacitySummary = selectSpendingCapacitySummary(baseline, {}, plan)
): MonthlyCapacityRuntimePacket {
  const floorInputs = selectMonthlyCapacityFloorInputs(plan);
  const foundation = selectMonthlyCapacityFoundation(baseline, plan, spendingCapacity);
  const reviewRows = selectMonthlyCapacityReviewRows(foundation);
  const decisionLayer = selectMonthlyCapacityDecisionLayer(foundation, plan);
  const caveatSignals = selectMonthlyCapacityCaveatSignals(baseline, plan, foundation);
  const optimizerObjective = selectMonthlyCapacityOptimizerObjective(foundation);

  return {
    status: foundation.status,
    floorInputs,
    foundation,
    reviewRows,
    decisionLayer,
    caveatSignals,
    optimizerObjective,
    boundary:
      'Runtime-only capacity packet: bundles floor inputs, capacity decision evidence, caveats, and the future floor-first objective. It is not saved and does not change engine output schema.'
  };
}

export function selectMonthlyCapacityLeverGates(packet: MonthlyCapacityRuntimePacket): MonthlyCapacityLeverGate[] {
  const practicalLevers: MonthlyCapacityLeverGate['id'][] = ['reduceSpending', 'workLonger', 'downsize', 'saveMore'];
  const reviewLevers: MonthlyCapacityLeverGate['id'][] = ['taxReview', 'estateReview'];
  const hasGap = packet.status === 'gap';
  const cannotTell = packet.status === 'cannotTell';
  const practicalStatus: MonthlyCapacityLeverGate['status'] = cannotTell ? 'suppressed' : hasGap ? 'allowed' : 'suppressed';
  const reviewStatus: MonthlyCapacityLeverGate['status'] = cannotTell ? 'suppressed' : 'reviewOnly';

  return [
    ...practicalLevers.map((id) => ({
      id,
      status: practicalStatus,
      reason: cannotTell
        ? 'Complete runtime inputs before comparing practical options.'
        : hasGap
          ? 'Allowed because the monthly floor is not covered under the runtime estimate.'
          : 'Suppressed unless the runtime capacity status is gap.'
    })),
    ...reviewLevers.map((id) => ({
      id,
      status: reviewStatus,
      reason: cannotTell
        ? 'Complete runtime inputs before reviewing capacity caveats.'
        : 'Review-only because tax, survivor, estate, and timing can change the monthly capacity estimate.'
    }))
  ];
}

export function selectMonthlyCapacityReadinessCloseout(
  packet: MonthlyCapacityRuntimePacket,
  leverGates: MonthlyCapacityLeverGate[] = selectMonthlyCapacityLeverGates(packet)
): MonthlyCapacityReadinessCloseout {
  const openGateIds = leverGates.filter((gate) => gate.status === 'allowed' || gate.status === 'reviewOnly').map((gate) => gate.id);
  const status: MonthlyCapacityReadinessCloseout['status'] =
    packet.status === 'cannotTell'
      ? 'needsInputs'
      : packet.status === 'gap'
        ? 'needsAction'
        : packet.decisionLayer.decision === 'needsReview'
          ? 'needsReview'
          : 'ready';

  const headlineByStatus: Record<MonthlyCapacityReadinessCloseout['status'], string> = {
    ready: 'Monthly capacity runtime evidence is ready for later presentation.',
    needsReview: 'Monthly capacity runtime evidence is ready, with review caveats still visible.',
    needsAction: 'Monthly capacity runtime evidence shows the floor is not covered.',
    needsInputs: 'Monthly capacity runtime evidence needs complete inputs.'
  };
  const nextStepByStatus: Record<MonthlyCapacityReadinessCloseout['status'], string> = {
    ready: 'Later work can connect this packet to presentation or bounded optimizer review.',
    needsReview: 'Keep tax, survivor, estate, home-equity, and spending-path caveats attached to the capacity answer.',
    needsAction: 'Compare only practical gap options before showing any discretionary room.',
    needsInputs: 'Complete runtime floor and projection inputs before estimating monthly capacity.'
  };

  return {
    status,
    headline: headlineByStatus[status],
    nextStep: nextStepByStatus[status],
    openGateIds,
    boundary:
      'Runtime-only closeout: summarizes capacity readiness for future work. It does not change UI, saved schema, engine output schema, optimizer execution, or funding trace output.'
  };
}

export function selectMonthlyCapacityOptimizerHandoff(
  packet: MonthlyCapacityRuntimePacket,
  leverGates: MonthlyCapacityLeverGate[] = selectMonthlyCapacityLeverGates(packet)
): MonthlyCapacityOptimizerHandoff {
  const allowedPracticalLeverIds = leverGates.filter((gate) => gate.status === 'allowed').map((gate) => gate.id);
  const reviewOnlyLeverIds = leverGates.filter((gate) => gate.status === 'reviewOnly').map((gate) => gate.id);
  const blocked = packet.status === 'cannotTell';
  const rows: MonthlyCapacityOptimizerHandoffRow[] = [
    {
      id: 'floorFirstObjective',
      label: 'Floor-first objective',
      status: packet.optimizerObjective.status === 'needsInputs' ? 'block' : 'pass',
      detail: 'Future optimizer work should cover the monthly floor before testing discretionary room.'
    },
    {
      id: 'floorCoverage',
      label: 'Floor coverage decision',
      status: packet.status === 'cannotTell' ? 'block' : packet.status === 'gap' || packet.status === 'tight' ? 'review' : 'pass',
      detail:
        packet.status === 'gap'
          ? 'The handoff should compare practical gap options before any room-above-floor logic.'
          : packet.status === 'cannotTell'
            ? 'The handoff is blocked until runtime floor and capacity inputs are complete.'
            : 'The handoff can preserve floor coverage while reviewing caveats.'
    },
    {
      id: 'leverGate',
      label: 'Lever gate',
      status: blocked ? 'block' : allowedPracticalLeverIds.length > 0 ? 'review' : 'pass',
      detail:
        allowedPracticalLeverIds.length > 0
          ? 'Practical levers are open only because the monthly floor has a gap.'
          : 'Practical levers stay suppressed unless the monthly floor has a gap.'
    },
    {
      id: 'caveatCoverage',
      label: 'Caveat coverage',
      status: blocked ? 'block' : packet.caveatSignals.some((signal) => signal.status === 'review') ? 'review' : 'pass',
      detail: 'Tax, survivor, estate, home-equity, and spending-path caveats stay attached to the handoff.'
    },
    {
      id: 'outputBoundary',
      label: 'Output boundary',
      status: 'pass',
      detail: 'The handoff forbids saved capacity, funding trace output, account instructions, and annual account-level sequencing.'
    }
  ];
  const status: MonthlyCapacityOptimizerHandoff['status'] = rows.some((row) => row.status === 'block')
    ? 'blocked'
    : rows.some((row) => row.status === 'review')
      ? 'review'
      : 'ready';

  return {
    status,
    objective: 'coverMonthlyFloorFirst',
    packetStatus: packet.status,
    allowedPracticalLeverIds,
    reviewOnlyLeverIds,
    blockedOutputIds: packet.optimizerObjective.forbiddenOutputs,
    rows,
    boundary:
      'Runtime-only optimizer handoff: describes how monthly capacity evidence can feed later optimizer work. It does not run optimizer search, save output, change UI, or change engine output schema.'
  };
}

export function selectMonthlyCapacityOptimizerInputContract(
  handoff: MonthlyCapacityOptimizerHandoff,
  optimizerInputReview: OptimizerInputReviewSummary
): MonthlyCapacityOptimizerInputContract {
  const canExploreLeverIds = optimizerInputReview.rows.filter((row) => row.permission === 'canExplore').map((row) => row.id);
  const mustPreserveLeverIds = optimizerInputReview.rows.filter((row) => row.permission === 'mustPreserve').map((row) => row.id);
  const needsDecisionLeverIds = optimizerInputReview.rows.filter((row) => row.permission === 'needsDecision').map((row) => row.id);
  const blockedReasons = [
    ...(handoff.status === 'blocked' ? ['Monthly capacity handoff is blocked until runtime floor and capacity inputs are complete.'] : []),
    ...(needsDecisionLeverIds.length > 0 ? ['Some optimizer inputs need household decisions before search would be responsible.'] : [])
  ];
  const status: MonthlyCapacityOptimizerInputContract['status'] =
    blockedReasons.length > 0 ? 'blocked' : handoff.status === 'review' || optimizerInputReview.status === 'review' ? 'review' : 'ready';

  return {
    status,
    capacityStatus: handoff.status,
    optimizerInputStatus: optimizerInputReview.status,
    canExploreLeverIds,
    mustPreserveLeverIds,
    needsDecisionLeverIds,
    blockedReasons,
    boundary:
      'Runtime-only input contract: combines floor-first capacity evidence with existing optimizer input permissions. It does not persist optimizer permissions or execute optimizer candidates.'
  };
}

export function selectMonthlyCapacityOptimizerGuardrails(handoff: MonthlyCapacityOptimizerHandoff): MonthlyCapacityOptimizerGuardrail[] {
  const hasGap = handoff.packetStatus === 'gap';
  return [
    {
      id: 'floorFirst',
      status: handoff.status === 'blocked' ? 'block' : 'pass',
      detail: 'The first objective is covering minimum monthly expenses before comparing room above the floor.'
    },
    {
      id: 'neutralGapOptions',
      status: hasGap ? 'review' : 'pass',
      detail: hasGap
        ? 'Gap options should stay practical and neutral: reduce spending, work longer, downsize if realistic, or save more.'
        : 'Gap options remain suppressed when the monthly floor is not visibly strained.'
    },
    {
      id: 'noSavedOutput',
      status: 'pass',
      detail: 'Calculated capacity and optimizer results must stay out of saved plan files.'
    },
    {
      id: 'noFundingTrace',
      status: 'pass',
      detail: 'Funding trace output remains deferred and should not be generated by this handoff.'
    },
    {
      id: 'noAccountInstructions',
      status: 'pass',
      detail: 'The handoff must not tell the household which account to withdraw from.'
    },
    {
      id: 'noAnnualSequencing',
      status: 'pass',
      detail: 'Annual account-level sequencing remains deferred until explicitly planned.'
    }
  ];
}

export function selectMonthlyCapacityOptimizerExampleHandoff(
  id: string,
  packet: MonthlyCapacityRuntimePacket
): MonthlyCapacityOptimizerExampleHandoff {
  const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
  const guardrails = selectMonthlyCapacityOptimizerGuardrails(handoff);
  const guardrailStatuses = guardrails.reduce<MonthlyCapacityOptimizerExampleHandoff['guardrailStatuses']>((acc, row) => {
    acc[row.id] = row.status;
    return acc;
  }, {
    floorFirst: 'pass',
    neutralGapOptions: 'pass',
    noSavedOutput: 'pass',
    noFundingTrace: 'pass',
    noAccountInstructions: 'pass',
    noAnnualSequencing: 'pass'
  });

  return {
    id,
    capacityStatus: packet.status,
    handoffStatus: handoff.status,
    objective: 'coverMonthlyFloorFirst',
    openLeverIds: [...handoff.allowedPracticalLeverIds, ...handoff.reviewOnlyLeverIds],
    guardrailStatuses,
    boundary:
      'Runtime-only example handoff: summarizes capacity optimizer readiness for an example fixture. It does not run optimizer search or persist calculated output.'
  };
}

export function selectMonthlyCapacityOptimizerExecutionGate(
  contract: MonthlyCapacityOptimizerInputContract,
  guardrails: MonthlyCapacityOptimizerGuardrail[]
): MonthlyCapacityOptimizerExecutionGate {
  const blockedGuardrails = guardrails.filter((row) => row.status === 'block');
  const requiredBeforeExecution: MonthlyCapacityOptimizerExecutionGate['requiredBeforeExecution'] = [
    ...(contract.status === 'blocked' ? (['completeCapacityInputs', 'resolveOptimizerInputDecisions'] as const) : []),
    'keepOutputRuntimeOnly',
    'defineCandidateScoring',
    'preserveNoAnnualSequencing'
  ];
  const status: MonthlyCapacityOptimizerExecutionGate['status'] =
    contract.status === 'blocked' || blockedGuardrails.length > 0
      ? 'blocked'
      : contract.status === 'review'
        ? 'reviewOnly'
        : 'readyForFutureImplementation';

  return {
    status,
    headline:
      status === 'blocked'
        ? 'Optimizer execution is blocked until capacity and input decisions are complete.'
        : status === 'reviewOnly'
          ? 'Optimizer execution should remain review-only until scoring and output rules are explicitly implemented.'
          : 'Optimizer execution can be planned as a future implementation package.',
    requiredBeforeExecution,
    allowedNow: ['runtimeEvidence', 'tests', 'docs', 'boundedReviewOnly'],
    notAllowedYet: ['optimizerSearch', 'savedOptimizerOutput', 'fundingTrace', 'accountInstructions', 'annualAccountSequencing'],
    boundary:
      'Runtime-only execution gate: this does not start optimizer search. It records what must be true before a future implementation package can execute candidates.'
  };
}

export function selectMonthlyCapacityOptimizerHandoffCloseout(
  gate: MonthlyCapacityOptimizerExecutionGate
): MonthlyCapacityOptimizerHandoffCloseout {
  const status: MonthlyCapacityOptimizerHandoffCloseout['status'] =
    gate.status === 'blocked'
      ? 'blocked'
      : gate.status === 'reviewOnly'
        ? 'readyForPlanning'
        : 'readyForFutureImplementation';

  return {
    status,
    headline:
      status === 'blocked'
        ? 'Floor-first optimizer handoff still needs inputs before planning can advance.'
        : status === 'readyForPlanning'
          ? 'Floor-first optimizer handoff is ready for candidate scoring planning.'
          : 'Floor-first optimizer handoff is ready for a future implementation package.',
    packageSummary:
      'The runtime handoff now connects monthly capacity evidence, floor-first objective, lever gates, optimizer input permissions, example readiness, and execution guardrails.',
    nextBroadStep:
      status === 'blocked'
        ? 'capacityInputsFirst'
        : status === 'readyForPlanning'
          ? 'candidateScoringPlan'
          : 'futureImplementationPackage',
    preservedBoundaries: gate.notAllowedYet,
    boundary:
      'Runtime-only package closeout: no UI change, saved schema change, engine output schema change, optimizer execution, funding trace, account instructions, or annual sequencing was added.'
  };
}

export function selectMonthlyCapacityScoringRubric(gate: MonthlyCapacityOptimizerExecutionGate): MonthlyCapacityScoringRubric {
  const factors: MonthlyCapacityScoringFactor[] = [
    {
      id: 'floorCoverage',
      label: 'Monthly floor coverage',
      weight: 'primary',
      direction: 'preferHigher',
      detail: 'Prefer candidates that keep modelled after-tax monthly capacity at or above the minimum monthly floor.'
    },
    {
      id: 'gapRepair',
      label: 'Gap repair',
      weight: 'primary',
      direction: 'preferLower',
      detail: 'When the floor is not covered, prefer candidates that reduce or remove the modelled monthly gap.'
    },
    {
      id: 'taxImpact',
      label: 'Tax impact',
      weight: 'secondary',
      direction: 'preferLower',
      detail: 'Review lifetime tax, OAS recovery, and registered-tax pressure after floor coverage is considered.'
    },
    {
      id: 'survivorEstate',
      label: 'Survivor and estate intent',
      weight: 'secondary',
      direction: 'preserve',
      detail: 'Preserve survivor resilience and explicit estate intent before treating room above the floor as available.'
    },
    {
      id: 'disruptionPenalty',
      label: 'Household disruption',
      weight: 'secondary',
      direction: 'preferLower',
      detail: 'Penalize disruptive choices such as spending cuts, later retirement, or downsizing unless the floor has a gap or the household opts in.'
    },
    {
      id: 'outputBoundary',
      label: 'Output boundary',
      weight: 'guardrail',
      direction: 'block',
      detail: 'Block saved optimizer output, funding trace output, account instructions, and annual account-level sequencing.'
    }
  ];

  return {
    status: gate.status === 'blocked' ? 'blocked' : 'readyForPlanning',
    objective: 'coverMonthlyFloorFirst',
    factors,
    primaryFactorIds: factors.filter((factor) => factor.weight === 'primary').map((factor) => factor.id),
    guardrailFactorIds: factors.filter((factor) => factor.weight === 'guardrail').map((factor) => factor.id),
    boundary:
      'Runtime-only scoring rubric: defines future optimizer scoring factors without running candidates, saving scores, changing UI, or changing engine output schema.'
  };
}

export function selectMonthlyCapacityCandidateScoreInputs(
  packet: MonthlyCapacityRuntimePacket,
  handoff: MonthlyCapacityOptimizerHandoff = selectMonthlyCapacityOptimizerHandoff(packet)
): MonthlyCapacityCandidateScoreInputs {
  return {
    status: handoff.status === 'blocked' ? 'blocked' : 'ready',
    floorMonthly: packet.foundation.monthlyFloor,
    capacityMonthly: packet.foundation.monthlyAfterTaxCapacity,
    gapOrRoomMonthly: packet.foundation.monthlyRoom,
    hasGap: packet.status === 'gap',
    hasReviewCaveats: packet.caveatSignals.some((signal) => signal.status === 'review'),
    openLeverIds: [...handoff.allowedPracticalLeverIds, ...handoff.reviewOnlyLeverIds],
    forbiddenOutputIds: handoff.blockedOutputIds,
    boundary:
      'Runtime-only score inputs: normalizes capacity evidence for future scoring. It does not calculate candidate scores, save results, or run optimizer search.'
  };
}

export function selectMonthlyCapacityCandidateScorePolicy(
  rubric: MonthlyCapacityScoringRubric,
  inputs: MonthlyCapacityCandidateScoreInputs
): MonthlyCapacityCandidateScorePolicy {
  const blocked = rubric.status === 'blocked' || inputs.status === 'blocked';
  const rows: MonthlyCapacityCandidateScorePolicyRow[] = [
    {
      factorId: 'floorCoverage',
      status: blocked ? 'blocked' : 'active',
      threshold: 'Capacity should meet or exceed the monthly floor.',
      application: 'Rank floor coverage before tax, estate, or discretionary room improvements.'
    },
    {
      factorId: 'gapRepair',
      status: blocked ? 'blocked' : inputs.hasGap ? 'active' : 'reviewOnly',
      threshold: 'Gap repair matters only when modelled capacity is below the monthly floor.',
      application: inputs.hasGap ? 'Prefer candidates that reduce the monthly gap.' : 'Keep gap repair visible but do not open practical levers without a gap.'
    },
    {
      factorId: 'taxImpact',
      status: blocked ? 'blocked' : 'reviewOnly',
      threshold: 'Tax impact is secondary after floor coverage.',
      application: 'Use tax as a tie-breaker or caveat, not as the first objective.'
    },
    {
      factorId: 'survivorEstate',
      status: blocked ? 'blocked' : inputs.hasReviewCaveats ? 'reviewOnly' : 'active',
      threshold: 'Preserve survivor resilience and explicit estate intent.',
      application: 'Avoid treating room above floor as available when survivor or estate caveats need review.'
    },
    {
      factorId: 'disruptionPenalty',
      status: blocked ? 'blocked' : 'active',
      threshold: 'Disruptive changes need a clear reason.',
      application: 'Penalize spending cuts, later retirement, and downsizing unless they repair a gap or reflect household intent.'
    },
    {
      factorId: 'outputBoundary',
      status: 'active',
      threshold: 'Unsupported outputs are always blocked.',
      application: 'Do not score toward saved outputs, funding traces, account instructions, or annual sequencing.'
    }
  ];

  return {
    status: blocked ? 'blocked' : 'readyForPlanning',
    rows,
    tieBreakers: ['fewerDisruptiveChanges', 'lowerTaxPressure', 'strongerSurvivorEstateFit', 'currentPlanIfEquivalent'],
    boundary:
      'Runtime-only score policy: defines how future scoring should apply rubric factors. It does not rank candidates, persist scores, or alter optimizer execution.'
  };
}

export function selectMonthlyCapacityScoringExampleReadiness(
  id: string,
  inputs: MonthlyCapacityCandidateScoreInputs,
  policy: MonthlyCapacityCandidateScorePolicy
): MonthlyCapacityScoringExampleReadiness {
  return {
    id,
    status: policy.status,
    hasGap: inputs.hasGap,
    activePolicyFactorIds: policy.rows.filter((row) => row.status === 'active').map((row) => row.factorId),
    reviewOnlyPolicyFactorIds: policy.rows.filter((row) => row.status === 'reviewOnly').map((row) => row.factorId),
    boundary:
      'Runtime-only scoring example readiness: records policy coverage for an example fixture without scoring candidates or saving output.'
  };
}

export function selectMonthlyCapacityScoringPlanCloseout(
  rubric: MonthlyCapacityScoringRubric,
  policy: MonthlyCapacityCandidateScorePolicy
): MonthlyCapacityScoringPlanCloseout {
  const blocked = rubric.status === 'blocked' || policy.status === 'blocked';

  return {
    status: blocked ? 'blocked' : 'readyForImplementationPlanning',
    headline: blocked
      ? 'Candidate scoring planning is blocked until capacity inputs are complete.'
      : 'Candidate scoring planning is ready for a future candidate-set implementation plan.',
    nextBroadStep: blocked ? 'capacityInputsFirst' : 'candidateSetImplementationPlan',
    completedPieces: ['rubric', 'scoreInputs', 'scorePolicy', 'exampleMatrix', 'persistenceGuardrails'],
    stillDeferred: [
      'candidateScoringExecution',
      'optimizerSearch',
      'savedScores',
      'fundingTrace',
      'accountInstructions',
      'annualSequencing',
      'uiPresentation'
    ],
    boundary:
      'Runtime-only scoring plan closeout: no candidate scoring execution, optimizer search, saved scores, funding trace, account instructions, annual sequencing, or UI presentation was added.'
  };
}

export const selectSpendingStressSummary = selectSpendingStressSummaryFromStressModule;

export function selectMinimumExpenseCoverageSummary(
  baseline: SimulationResult | null | undefined,
  plan: V2PlanPayload | null | undefined,
  spendingCapacity: SpendingCapacitySummary = selectSpendingCapacitySummary(baseline, {}, plan)
): MinimumExpenseCoverageSummary {
  const overview = selectOverviewMetrics(baseline);
  const rows = rowsFrom(baseline);
  const firstShortfall = rows.find((row) => n(row.shortfall) > RECONCILIATION_TOLERANCE);
  const minimumAnnualExpense = n(plan?.spending?.gogo) || overview.firstYearSpending;
  const estimatedAnnualCapacity = n(spendingCapacity.estimatedSustainableAnnualSpending);
  const annualGapOrRoom = estimatedAnnualCapacity - minimumAnnualExpense;

  let status: MinimumExpenseCoverageStatus = 'covered';
  if (!rows.length || !minimumAnnualExpense || !estimatedAnnualCapacity || spendingCapacity.status === 'cannotTell') status = 'cannotTell';
  else if (firstShortfall || annualGapOrRoom < 0) status = 'gap';
  else if (annualGapOrRoom <= Math.max(1200, minimumAnnualExpense * 0.05) || spendingCapacity.status === 'tight') status = 'tight';

  const labelByStatus: Record<MinimumExpenseCoverageStatus, string> = {
    cannotTell: 'Minimum-expense coverage needs more inputs',
    gap: 'Minimum expenses need review',
    tight: 'Minimum expenses appear covered, with limited room',
    covered: 'Minimum expenses appear covered'
  };
  const headlineByStatus: Record<MinimumExpenseCoverageStatus, string> = {
    cannotTell: 'The minimum-expense check will be useful after required inputs are complete.',
    gap: 'The current bridge estimate does not fully cover the spending floor in the visible projection.',
    tight: 'The current bridge estimate covers the spending floor, but there is not much extra room.',
    covered: 'The current bridge estimate covers the spending floor under the base assumptions.'
  };
  const detailByStatus: Record<MinimumExpenseCoverageStatus, string> = {
    cannotTell: 'Complete required inputs, then compare minimum expenses with estimated monthly after-tax capacity.',
    gap: 'Compare lower expenses, working longer, downsizing, saving more, benefit timing, tax, and estate intent together.',
    tight: 'Keep the floor visible while reviewing tax, timing, and market sensitivity.',
    covered: 'The next review is whether the floor reflects regular expenses and whether any extra room matches the household goal.'
  };

  const reviewOptions: MinimumExpenseCoverageSummary['reviewOptions'] =
    status === 'gap'
      ? [
          {
            id: 'expenses',
            label: 'Review regular expenses',
            detail: 'Check whether the minimum floor is complete and whether any expenses can reasonably change.',
            detailArea: 'stressTests'
          },
          {
            id: 'workLonger',
            label: 'Compare working longer',
            detail: 'Working longer can add savings and reduce the number of funded years needed.',
            detailArea: 'stressTests'
          },
          {
            id: 'downsize',
            label: 'Review home equity only if realistic',
            detail: 'Downsizing should stay out of the plan unless the household would truly consider it.',
            detailArea: 'details'
          },
          {
            id: 'saveMore',
            label: 'Compare saving more before retirement',
            detail: 'Additional savings may improve the floor coverage check before retirement starts.',
            detailArea: 'details'
          }
        ]
      : [
          {
            id: 'tax',
            label: 'Review tax pressure',
            detail: 'Tax and OAS recovery can affect how much after-tax spending is available.',
            detailArea: 'taxes'
          },
          {
            id: 'benefits',
            label: 'Review benefit timing',
            detail: 'Benefit timing changes income, withdrawals, and survivor resilience.',
            detailArea: 'stressTests'
          },
          {
            id: 'estate',
            label: 'Review estate intent',
            detail: 'Estate intent helps explain whether extra room should be preserved, spent, or tested.',
            detailArea: 'details'
          }
        ];

  return {
    status,
    label: labelByStatus[status],
    headline: headlineByStatus[status],
    detail: detailByStatus[status],
    minimumAnnualExpense,
    minimumMonthlyExpense: minimumAnnualExpense / 12,
    estimatedAnnualCapacity,
    estimatedMonthlyCapacity: estimatedAnnualCapacity / 12,
    annualGapOrRoom,
    reviewOptions,
    boundary:
      'Bridge-only summary: current phased spending is used as a temporary minimum-expense fixture. No saved field or engine output is added.'
  };
}

export function selectSpendingPathBridgeSummary(plan: V2PlanPayload | null | undefined): SpendingPathBridgeSummary {
  const earlyAnnual = n(plan?.spending?.gogo);
  const laterAnnual = n(plan?.spending?.slowgo);
  const lateLifeAnnual = n(plan?.spending?.nogo);
  const earlyToLater = n(plan?.spending?.gogoEnd) || null;
  const laterToLateLife = n(plan?.spending?.slowgoEnd) || null;
  const hasAnySpending = earlyAnnual > 0 || laterAnnual > 0 || lateLifeAnnual > 0;
  const hasBreakpoints = Boolean(earlyToLater && laterToLateLife && laterToLateLife > earlyToLater);

  const phases: SpendingPathBridgePhase[] = [
    {
      id: 'early',
      label: 'Early retirement',
      annualSpending: earlyAnnual,
      monthlySpending: earlyAnnual / 12,
      startsAtAge: null,
      endsAtAge: earlyToLater,
      note: 'Current bridge uses this as the first spending level and temporary floor fixture.'
    },
    {
      id: 'later',
      label: 'Later retirement',
      annualSpending: laterAnnual,
      monthlySpending: laterAnnual / 12,
      startsAtAge: earlyToLater,
      endsAtAge: laterToLateLife,
      note: 'This lets the model reflect regular spending changing with age.'
    },
    {
      id: 'lateLife',
      label: 'Late-life',
      annualSpending: lateLifeAnnual,
      monthlySpending: lateLifeAnnual / 12,
      startsAtAge: laterToLateLife,
      endsAtAge: null,
      note: 'Large care costs should stay separate from the normal spending path until explicitly modelled.'
    }
  ];

  const status = hasAnySpending && hasBreakpoints ? 'ready' : 'cannotTell';

  return {
    status,
    label: status === 'ready' ? 'Spending path bridge is ready' : 'Spending path bridge needs assumptions',
    headline:
      status === 'ready'
        ? 'The current plan can explain the monthly answer with spending changing by age.'
        : 'Add spending assumptions and realistic breakpoint ages before relying on the spending path.',
    detail:
      status === 'ready'
        ? 'This is a bridge summary of the current phased spending assumptions. Future defaults should make this mostly automatic for users.'
        : 'The future product should provide defaults, then let users adjust breakpoint ages and rerun.',
    phases,
    breakpointAges: {
      earlyToLater,
      laterToLateLife
    },
    boundary:
      'Bridge-only summary: current phased spending fields are interpreted as a spending path for review. No saved field, default reduction rate, or engine output is added.'
  };
}

export function selectDiscretionaryRoomBridgeSummary(
  coverage: MinimumExpenseCoverageSummary,
  spendingCapacity: SpendingCapacitySummary
): DiscretionaryRoomBridgeSummary {
  const annualRoom = Math.max(0, n(coverage.annualGapOrRoom));
  const monthlyRoom = annualRoom / 12;
  const hasRoom = annualRoom > Math.max(1200, n(coverage.minimumAnnualExpense) * 0.05);

  let status: DiscretionaryRoomBridgeStatus = 'review';
  if (coverage.status === 'cannotTell' || spendingCapacity.status === 'cannotTell') status = 'cannotTell';
  else if (coverage.status === 'gap' || annualRoom <= 0) status = 'none';
  else if (!hasRoom || coverage.status === 'tight' || spendingCapacity.status === 'tight') status = 'limited';

  const labelByStatus: Record<DiscretionaryRoomBridgeStatus, string> = {
    cannotTell: 'Discretionary room needs more inputs',
    none: 'No discretionary room appears available',
    limited: 'Discretionary room appears limited',
    review: 'Discretionary room may be available'
  };
  const headlineByStatus: Record<DiscretionaryRoomBridgeStatus, string> = {
    cannotTell: 'Complete required inputs before estimating room above the spending floor.',
    none: 'The current bridge does not show spending room above the temporary floor.',
    limited: 'The current bridge shows only modest room above the temporary floor.',
    review: 'The current bridge shows room above the temporary floor for review.'
  };
  const detailByStatus: Record<DiscretionaryRoomBridgeStatus, string> = {
    cannotTell: 'The future model should estimate discretionary room after minimum expenses are covered.',
    none: 'Review the floor and gap options before treating discretionary spending as available.',
    limited: 'Review tax, benefit timing, spending path, and market sensitivity before relying on the room.',
    review: 'Treat this as review evidence only; taxes, survivor needs, estate intent, and the spending path can change the final answer.'
  };

  return {
    status,
    label: labelByStatus[status],
    headline: headlineByStatus[status],
    detail: detailByStatus[status],
    annualRoom,
    monthlyRoom,
    floorMonthly: coverage.minimumMonthlyExpense,
    capacityMonthly: coverage.estimatedMonthlyCapacity,
    reviewRows: [
      {
        id: 'floor',
        label: 'Confirm the floor',
        detail: 'The temporary floor still comes from current early spending until a real minimum-expense field exists.',
        detailArea: 'details'
      },
      {
        id: 'tax',
        label: 'Review tax impact',
        detail: 'Extra spending can change registered withdrawals, OAS recovery tax, and taxable income.',
        detailArea: 'taxes'
      },
      {
        id: 'estate',
        label: 'Review estate intent',
        detail: 'Extra room may reduce projected money left, which may or may not match household goals.',
        detailArea: 'details'
      },
      {
        id: 'spendingPath',
        label: 'Review spending path',
        detail: 'Age-based spending assumptions can change how much room appears early or later.',
        detailArea: 'details'
      }
    ],
    boundary:
      'Bridge-only summary: discretionary room is derived from temporary floor coverage and spending capacity. No saved field, optimizer action, or engine output is added.'
  };
}

export function selectDrawdownReadinessSummary(
  result: SimulationResult | null | undefined,
  plan: V2PlanPayload | null | undefined
): DrawdownReadinessSummary {
  const rows = rowsFrom(result);
  if (!rows.length) {
    const drawdownOverrideDrafts = buildTaxAwareDrawdownDraftSummary({
      prototypeRows: [],
      annualRows: [],
      plan,
      finalRegisteredAssets: 0,
      estateTarget: n(plan?.inheritance)
    });
    return {
      status: 'cannotTell',
      headline: 'Drawdown readiness needs a completed projection first.',
      detail: 'Clear required inputs, then rerun Results before reviewing future drawdown evidence.',
      rows: [],
      prototypeRows: [],
      drawdownOverrideDrafts,
      reviewNote: 'This is review evidence only. It does not change withdrawal order, create annual overrides, or save optimizer output.'
    };
  }

  const annualRows = rows.map((row) => ({
    row,
    year: n(row.year),
    registeredWithdrawals: n(row.rrif_draw_f) + n(row.rrif_draw_m) + n(row.lif_draw),
    tfsaWithdrawals: n(row.tfsa_draw),
    nonRegisteredWithdrawals: n(row.nonreg_draw),
    cashWithdrawals: n(row.cash_draw),
    tax: n(row.totalTaxYear),
    taxableIncome: n(row.taxableIncome),
    oasRecovery: n(row.totalOasClawY)
  }));
  const registeredRows = annualRows.filter((item) => item.registeredWithdrawals > RECONCILIATION_TOLERANCE);
  const largestRegistered = registeredRows.reduce<typeof annualRows[number] | null>((largest, item) => {
    if (!largest || item.registeredWithdrawals > largest.registeredWithdrawals) return item;
    return largest;
  }, null);
  const oasRows = annualRows.filter((item) => item.oasRecovery > OAS_CLAWBACK_WATCH_THRESHOLD);
  const largestOasRecovery = oasRows.reduce<typeof annualRows[number] | null>((largest, item) => {
    if (!largest || item.oasRecovery > largest.oasRecovery) return item;
    return largest;
  }, null);
  const peakTax = annualRows.reduce<typeof annualRows[number] | null>((peak, item) => {
    if (!peak || item.tax > peak.tax) return item;
    return peak;
  }, null);
  const firstRegisteredYear = registeredRows[0]?.year || null;
  const peakTaxAmount = peakTax?.tax || 0;
  const lowTaxRows = annualRows.filter((item) => {
    if (item.taxableIncome <= 0) return false;
    if (item.registeredWithdrawals > RECONCILIATION_TOLERANCE) return false;
    if (firstRegisteredYear && item.year >= firstRegisteredYear) return false;
    return peakTaxAmount <= 0 || item.tax <= Math.max(5000, peakTaxAmount * 0.55);
  });
  const firstLowTax = lowTaxRows[0] || null;
  const lastLowTax = lowTaxRows[lowTaxRows.length - 1] || null;
  const planRegisteredAssets = n(plan?.p1?.rrsp) + n(plan?.p1?.lif) + n(plan?.p1?.lira) + n(plan?.p2?.rrsp) + n(plan?.p2?.lif) + n(plan?.p2?.lira);
  const planFlexibleAssets = n(plan?.p1?.tfsa) + n(plan?.p2?.tfsa) + n(plan?.p1?.nonreg) + n(plan?.p2?.nonreg) + n(plan?.cashWedge?.balance);
  const finalRow = rows[rows.length - 1];
  const finalRegisteredAssets = n(finalRow?.bal_rrsp) + n(finalRow?.bal_lif);
  const estateTarget = n(plan?.inheritance);

  const readinessRows: DrawdownReadinessRow[] = [
    {
      id: 'registeredPressure',
      label: 'Registered withdrawal pressure',
      tone: largestRegistered ? (largestRegistered.registeredWithdrawals > 50000 || registeredRows.length >= Math.max(4, rows.length * 0.35) ? 'watch' : 'review') : 'ok',
      year: largestRegistered?.year || null,
      value: largestRegistered ? `${largestRegistered.year}: ${moneyText(largestRegistered.registeredWithdrawals)}` : 'No clear pressure',
      detail: largestRegistered
        ? 'Registered withdrawals are visible in the projection and may shape taxable income later.'
        : 'No major registered withdrawal pressure appears in the current projection.',
      reviewFocus: largestRegistered
        ? 'A future drawdown review would test timing against taxes, benefits, and estate goals.'
        : 'Keep the current withdrawal order unless a later review shows a reason to test it.',
      disposition: 'reviewOnly'
    },
    {
      id: 'oasRecovery',
      label: 'OAS recovery exposure',
      tone: largestOasRecovery ? (largestOasRecovery.oasRecovery > 3000 ? 'watch' : 'review') : 'ok',
      year: largestOasRecovery?.year || null,
      value: largestOasRecovery ? `${largestOasRecovery.year}: ${moneyText(largestOasRecovery.oasRecovery)}` : 'None visible',
      detail: largestOasRecovery
        ? 'OAS recovery tax appears in the projection, so taxable income timing deserves review.'
        : 'No OAS recovery tax appears in the current projection.',
      reviewFocus: largestOasRecovery
        ? 'A future drawdown review would compare whether taxable withdrawals can be timed more deliberately.'
        : 'No OAS recovery evidence is available for a future drawdown check right now.',
      disposition: 'reviewOnly'
    },
    {
      id: 'peakTax',
      label: 'Peak tax year',
      tone: peakTaxAmount > 0 ? (largestRegistered || largestOasRecovery ? 'review' : 'ok') : 'ok',
      year: peakTax?.year || null,
      value: peakTaxAmount > 0 && peakTax ? `${peakTax.year}: ${moneyText(peakTaxAmount)}` : 'No tax shown',
      detail: peakTaxAmount > 0
        ? 'This is the highest annual tax year in the current projection.'
        : 'The projection does not show annual tax pressure yet.',
      reviewFocus: peakTaxAmount > 0
        ? 'Use this as evidence for a later year-by-year drawdown review, not as an instruction to change accounts.'
        : 'Confirm taxable income inputs before using tax timing evidence.',
      disposition: 'reviewOnly'
    },
    {
      id: 'lowTaxWindow',
      label: 'Possible low-tax review window',
      tone: firstLowTax ? 'review' : 'ok',
      year: firstLowTax?.year || null,
      value: firstLowTax && lastLowTax
        ? firstLowTax.year === lastLowTax.year
          ? String(firstLowTax.year)
          : `${firstLowTax.year}-${lastLowTax.year}`
        : 'No clear window',
      detail: firstLowTax
        ? 'One or more years before registered withdrawals show lower taxable income in the current projection.'
        : 'No clear low-tax window appears before registered withdrawals begin.',
      reviewFocus: firstLowTax
        ? 'A future drawdown review may test whether those years are useful for planned taxable withdrawals.'
        : 'Keep this as context until the drawdown optimizer can test annual withdrawal amounts.',
      disposition: 'reviewOnly'
    },
    {
      id: 'accountMix',
      label: 'Account mix for future testing',
      tone: planRegisteredAssets > 0 && planFlexibleAssets > 0 ? 'review' : 'ok',
      year: null,
      value:
        planRegisteredAssets > 0 || planFlexibleAssets > 0
          ? `${moneyText(planRegisteredAssets)} registered / ${moneyText(planFlexibleAssets)} flexible`
          : 'No account mix entered',
      detail:
        planRegisteredAssets > 0 && planFlexibleAssets > 0
          ? 'The plan has both taxable registered assets and more flexible account buckets for a future review.'
          : 'The current account mix gives a future drawdown review fewer account choices to compare.',
      reviewFocus:
        finalRegisteredAssets > 0
          ? 'Registered assets remain visible late in the projection, so estate and survivor impact should be checked later.'
          : 'Current account balances should still be confirmed before testing future drawdown paths.',
      disposition: 'reviewOnly'
    }
  ];

  const hasWatch = readinessRows.some((row) => row.tone === 'watch');
  const hasReview = readinessRows.some((row) => row.tone === 'review');
  const status: DrawdownReadinessStatus = hasWatch || hasReview ? 'review' : 'ready';
  const prototypeRows = buildTaxAwareDrawdownPrototypeRows({
    firstLowTax,
    lastLowTax,
    largestRegistered,
    largestOasRecovery,
    peakTax,
    finalRegisteredAssets,
    estateTarget
  });
  const drawdownOverrideDrafts = buildTaxAwareDrawdownDraftSummary({
    prototypeRows,
    annualRows,
    plan,
    finalRegisteredAssets,
    estateTarget
  });

  return {
    status,
    headline:
      status === 'review'
        ? 'The plan has drawdown evidence worth preserving for a future review.'
        : 'No major drawdown timing pressure appears in this first-pass review.',
    detail:
      'These rows explain where a future tax-aware drawdown review would look. This does not change the current withdrawal order.',
    rows: readinessRows,
    prototypeRows,
    drawdownOverrideDrafts,
    reviewNote: 'Drawdown readiness is review evidence only. It does not change withdrawal order, create annual overrides, or save optimizer output.'
  };
}

function buildTaxAwareDrawdownPrototypeRows({
  firstLowTax,
  lastLowTax,
  largestRegistered,
  largestOasRecovery,
  peakTax,
  finalRegisteredAssets,
  estateTarget
}: {
  firstLowTax: { year: number; taxableIncome: number; tax: number } | null;
  lastLowTax: { year: number; taxableIncome: number; tax: number } | null;
  largestRegistered: { year: number; registeredWithdrawals: number; taxableIncome: number } | null;
  largestOasRecovery: { year: number; oasRecovery: number; taxableIncome: number } | null;
  peakTax: { year: number; tax: number; taxableIncome: number } | null;
  finalRegisteredAssets: number;
  estateTarget: number;
}): TaxAwareDrawdownPrototypeRow[] {
  const rows: TaxAwareDrawdownPrototypeRow[] = [];

  if (firstLowTax && lastLowTax) {
    rows.push({
      id: 'lowTaxWindow',
      label: 'Low-tax review window',
      tone: 'review',
      year: firstLowTax.year,
      value: firstLowTax.year === lastLowTax.year ? String(firstLowTax.year) : `${firstLowTax.year}-${lastLowTax.year}`,
      evidence: `Taxable income is ${moneyText(firstLowTax.taxableIncome)} before registered withdrawals begin.`,
      futureQuestion: 'Could a future review test modest registered withdrawals in this window without hurting spending, benefits, or estate goals?',
      disposition: 'evidenceOnly'
    });
  }

  if (largestRegistered) {
    rows.push({
      id: 'registeredPressure',
      label: 'Registered withdrawal pressure',
      tone: largestRegistered.registeredWithdrawals > 50000 ? 'watch' : 'review',
      year: largestRegistered.year,
      value: `${largestRegistered.year}: ${moneyText(largestRegistered.registeredWithdrawals)}`,
      evidence: `Registered withdrawals and taxable income are both visible in ${largestRegistered.year}.`,
      futureQuestion: 'Could a future year-by-year review smooth registered withdrawals without creating new shortfalls?',
      disposition: 'evidenceOnly'
    });
  }

  if (largestOasRecovery) {
    rows.push({
      id: 'oasRecovery',
      label: 'OAS recovery review year',
      tone: largestOasRecovery.oasRecovery > 3000 ? 'watch' : 'review',
      year: largestOasRecovery.year,
      value: `${largestOasRecovery.year}: ${moneyText(largestOasRecovery.oasRecovery)}`,
      evidence: `OAS recovery tax appears alongside taxable income of ${moneyText(largestOasRecovery.taxableIncome)}.`,
      futureQuestion: 'Could a future review reduce taxable-income pressure around OAS recovery years?',
      disposition: 'evidenceOnly'
    });
  }

  if (peakTax && peakTax.tax > 0) {
    rows.push({
      id: 'peakTax',
      label: 'Peak tax review year',
      tone: largestRegistered || largestOasRecovery ? 'review' : 'ok',
      year: peakTax.year,
      value: `${peakTax.year}: ${moneyText(peakTax.tax)}`,
      evidence: `This is the highest annual tax year in the current projection.`,
      futureQuestion: 'Could a future review compare nearby years before changing any account withdrawal amounts?',
      disposition: 'evidenceOnly'
    });
  }

  if (finalRegisteredAssets > 0 || estateTarget > 0) {
    rows.push({
      id: 'estatePressure',
      label: 'Later-life estate pressure',
      tone: finalRegisteredAssets > 100000 || estateTarget > 0 ? 'review' : 'ok',
      year: null,
      value: finalRegisteredAssets > 0 ? `${moneyText(finalRegisteredAssets)} registered left` : 'Estate goal visible',
      evidence:
        estateTarget > 0
          ? `The entered estate goal is ${moneyText(estateTarget)}, so drawdown timing should preserve that preference.`
          : 'Registered assets remain visible late in the projection.',
      futureQuestion: 'Could a future review balance taxes, survivor resilience, flexibility, and estate intent?',
      disposition: 'evidenceOnly'
    });
  }

  return rows.slice(0, 5);
}

function buildTaxAwareDrawdownDraftSummary({
  prototypeRows,
  annualRows,
  plan,
  finalRegisteredAssets,
  estateTarget
}: {
  prototypeRows: TaxAwareDrawdownPrototypeRow[];
  annualRows: Array<{
    year: number;
    registeredWithdrawals: number;
    tfsaWithdrawals: number;
    nonRegisteredWithdrawals: number;
    cashWithdrawals: number;
    tax: number;
    taxableIncome: number;
    oasRecovery: number;
  }>;
  plan: V2PlanPayload | null | undefined;
  finalRegisteredAssets: number;
  estateTarget: number;
}): TaxAwareDrawdownDraftSummary {
  const planRegisteredAssets = n(plan?.p1?.rrsp) + n(plan?.p1?.lif) + n(plan?.p1?.lira) + n(plan?.p2?.rrsp) + n(plan?.p2?.lif) + n(plan?.p2?.lira);
  const planFlexibleAssets = n(plan?.p1?.tfsa) + n(plan?.p2?.tfsa) + n(plan?.p1?.nonreg) + n(plan?.p2?.nonreg) + n(plan?.cashWedge?.balance);
  const lockedInAssets = n(plan?.p1?.lif) + n(plan?.p1?.lira) + n(plan?.p2?.lif) + n(plan?.p2?.lira);
  const hasSurvivorScenario = n(plan?.assumptions?.p1DiesInSurvivor) > 0;
  const projectionYears = new Set(annualRows.map((row) => row.year));
  const bucketBand = planRegisteredAssets > 250000 ? '$10k-$25k review band' : '$5k-$10k review band';
  const mixedBand = planFlexibleAssets > 0 ? '$5k-$25k review band' : 'Needs flexible-account evidence';

  const validateDraft = (
    row: Omit<TaxAwareDrawdownDraftRow, 'status' | 'safetyNotes' | 'disposition'>,
    requiresRegistered: boolean,
    requiresFlexible: boolean,
    extraNotes: string[] = []
  ): TaxAwareDrawdownDraftRow => {
    const safetyNotes: string[] = [...extraNotes];
    let status: TaxAwareDrawdownDraftStatus = 'usableForFutureReview';

    if (row.year !== null && !projectionYears.has(row.year)) {
      status = 'blocked';
      safetyNotes.push('The year is outside the current projection.');
    }
    if (requiresRegistered && planRegisteredAssets <= RECONCILIATION_TOLERANCE) {
      status = 'blocked';
      safetyNotes.push('Registered account balances are missing for this check.');
    }
    if (requiresFlexible && planFlexibleAssets <= RECONCILIATION_TOLERANCE && status !== 'blocked') {
      status = 'needsInput';
      safetyNotes.push('Flexible account balances are needed before this can be reviewed.');
    }
    if (lockedInAssets > RECONCILIATION_TOLERANCE) {
      safetyNotes.push('Locked-in account limits would need a later check before any future execution.');
      if (status === 'usableForFutureReview' && row.accountBucket === 'registered') status = 'needsInput';
    }
    if (!safetyNotes.length) {
      safetyNotes.push('This is a review draft only. It does not change account withdrawals.');
    }

    return {
      ...row,
      status,
      safetyNotes,
      disposition: 'draftOnly'
    };
  };

  const drafts = prototypeRows.flatMap((row): TaxAwareDrawdownDraftRow[] => {
    switch (row.id) {
      case 'lowTaxWindow':
        return [
          validateDraft(
            {
              id: 'lowTaxRegisteredDraft',
              label: 'Low-tax registered check',
              year: row.year,
              accountBucket: 'registered',
              direction: 'testEarlier',
              amountBand: bucketBand,
              evidenceSource: row.id,
              detail: 'A later review could test a modest registered withdrawal band in this lower-tax window.'
            },
            true,
            false,
            ['The amount stays as a band until a later engine run can test exact values.']
          )
        ];
      case 'registeredPressure':
        return [
          validateDraft(
            {
              id: 'registeredSmoothingDraft',
              label: 'Registered smoothing check',
              year: row.year,
              accountBucket: 'registered',
              direction: 'smooth',
              amountBand: bucketBand,
              evidenceSource: row.id,
              detail: 'A later review could compare whether registered withdrawals are too concentrated in this year.'
            },
            true,
            false,
            ['This does not replace the current withdrawal order.']
          )
        ];
      case 'oasRecovery':
        return [
          validateDraft(
            {
              id: 'oasRecoveryDraft',
              label: 'OAS recovery pressure check',
              year: row.year,
              accountBucket: 'mixed',
              direction: 'reducePressure',
              amountBand: mixedBand,
              evidenceSource: row.id,
              detail: 'A later review could compare nearby years and account buckets around OAS recovery exposure.'
            },
            true,
            true,
            ['This is only a tax-timing question for future review.']
          )
        ];
      case 'peakTax':
        return [
          validateDraft(
            {
              id: 'peakTaxDraft',
              label: 'Peak tax year check',
              year: row.year,
              accountBucket: 'mixed',
              direction: 'reducePressure',
              amountBand: mixedBand,
              evidenceSource: row.id,
              detail: 'A later review could test whether tax pressure is concentrated in this year.'
            },
            false,
            true,
            ['The current plan remains the baseline until a later execution phase exists.']
          )
        ];
      case 'estatePressure':
        return [
          validateDraft(
            {
              id: 'estatePressureDraft',
              label: 'Estate preference check',
              year: row.year,
              accountBucket: finalRegisteredAssets > RECONCILIATION_TOLERANCE ? 'registered' : 'none',
              direction: 'preserveChoice',
              amountBand: finalRegisteredAssets > RECONCILIATION_TOLERANCE ? '$10k-$25k review band' : 'No registered balance band',
              evidenceSource: row.id,
              detail: 'A later review could check whether drawdown timing respects estate, survivor, tax, and flexibility preferences.'
            },
            true,
            false,
            estateTarget > 0 ? ['The entered estate goal should remain a guardrail in any later comparison.'] : []
          )
        ];
    }
  });

  const readinessRows: TaxAwareDrawdownReadinessCheck[] = [
    {
      id: 'accountBalances',
      label: 'Account balances',
      status: planRegisteredAssets > 0 || planFlexibleAssets > 0 ? 'ready' : 'blocked',
      detail:
        planRegisteredAssets > 0 || planFlexibleAssets > 0
          ? 'Entered account balances give a later review something to compare.'
          : 'Enter account balances before future drawdown testing.'
    },
    {
      id: 'accountMix',
      label: 'Account mix',
      status: planRegisteredAssets > 0 && planFlexibleAssets > 0 ? 'ready' : 'needsInput',
      detail:
        planRegisteredAssets > 0 && planFlexibleAssets > 0
          ? 'Registered and flexible account buckets are both visible.'
          : 'A thin account mix limits what a later review can compare.'
    },
    {
      id: 'oasRecoveryExposure',
      label: 'OAS recovery exposure',
      status: prototypeRows.some((row) => row.id === 'oasRecovery') ? 'review' : 'ready',
      detail: prototypeRows.some((row) => row.id === 'oasRecovery')
        ? 'OAS recovery evidence should stay visible in later testing.'
        : 'No OAS recovery pressure appears in the current projection.'
    },
    {
      id: 'estateIntent',
      label: 'Estate goal',
      status: estateTarget > 0 ? 'review' : 'ready',
      detail: estateTarget > 0 ? 'The entered estate goal should remain visible in later comparisons.' : 'No entered estate goal is constraining this review.'
    },
    {
      id: 'lockedInAccounts',
      label: 'Locked-in accounts',
      status: lockedInAssets > 0 ? 'needsInput' : 'ready',
      detail: lockedInAssets > 0 ? 'Locked-in account limits need a later rule check before execution.' : 'No locked-in balance is entered for this household.'
    },
    {
      id: 'survivorScenario',
      label: 'Survivor scenario',
      status: hasSurvivorScenario ? 'review' : 'needsInput',
      detail: hasSurvivorScenario
        ? 'A survivor scenario is visible and should be preserved in later testing.'
        : 'A survivor scenario would make later drawdown testing more complete.'
    }
  ];

  if (!annualRows.length) {
    const sandbox = buildTaxAwareDrawdownSandboxSummary([], []);
    return {
      status: 'cannotTell',
      headline: 'Future drawdown draft checks need a completed projection.',
      detail: 'Run Results before reviewing draft checks for future tax-aware drawdown testing.',
      rows: [],
      readinessRows: [],
      sandbox,
      comparisonReadiness: buildTaxAwareDrawdownComparisonReadinessSummary([], [], sandbox),
      reviewNote: 'Draft checks are review-only. They do not change withdrawal order, create annual overrides, or save optimizer output.'
    };
  }

  if (!drafts.length) {
    const sandbox = buildTaxAwareDrawdownSandboxSummary([], readinessRows);
    return {
      status: 'cannotTell',
      headline: 'No future drawdown draft checks stand out yet.',
      detail: 'The current projection does not show enough drawdown timing evidence for draft checks.',
      rows: [],
      readinessRows,
      sandbox,
      comparisonReadiness: buildTaxAwareDrawdownComparisonReadinessSummary([], readinessRows, sandbox),
      reviewNote: 'Draft checks are review-only. They do not change withdrawal order, create annual overrides, or save optimizer output.'
    };
  }

  const hasUsable = drafts.some((row) => row.status === 'usableForFutureReview');
  const hasBlocked = drafts.some((row) => row.status === 'blocked') || readinessRows.some((row) => row.status === 'blocked');
  const hasNeedsInput = drafts.some((row) => row.status === 'needsInput') || readinessRows.some((row) => row.status === 'needsInput');
  const accountBalancesBlocked = readinessRows.some((row) => row.id === 'accountBalances' && row.status === 'blocked');
  const status: TaxAwareDrawdownDraftSummary['status'] =
    accountBalancesBlocked || (hasBlocked && !hasUsable) ? 'blocked' : hasNeedsInput || hasBlocked ? 'needsInput' : 'readyForFutureReview';
  const sandbox = buildTaxAwareDrawdownSandboxSummary(drafts, readinessRows);

  return {
    status,
    headline:
      status === 'readyForFutureReview'
        ? 'This plan is ready for future tax-aware drawdown testing.'
        : status === 'blocked'
          ? 'Future drawdown testing needs missing inputs first.'
          : 'Future drawdown testing has useful draft checks, with inputs to confirm.',
    detail:
      'These draft checks describe what a later test might compare. They are not run as part of the calculation and do not change the current plan.',
    rows: drafts,
    readinessRows,
    sandbox,
    comparisonReadiness: buildTaxAwareDrawdownComparisonReadinessSummary(drafts, readinessRows, sandbox),
    reviewNote: 'Future drawdown draft checks are review evidence only. They do not change withdrawal order, create annual overrides, or save optimizer output.'
  };
}

function buildTaxAwareDrawdownSandboxSummary(
  drafts: TaxAwareDrawdownDraftRow[],
  readinessRows: TaxAwareDrawdownReadinessCheck[]
): TaxAwareDrawdownSandboxSummary {
  const accountBlocked = readinessRows.some((row) => row.id === 'accountBalances' && row.status === 'blocked');
  const missingInputRows = readinessRows.filter((row) => row.status === 'needsInput' || row.status === 'blocked');
  const priority: TaxAwareDrawdownDraftRow['id'][] = [
    'oasRecoveryDraft',
    'peakTaxDraft',
    'registeredSmoothingDraft',
    'lowTaxRegisteredDraft',
    'estatePressureDraft'
  ];
  const usableDrafts = drafts.filter((row) => row.status === 'usableForFutureReview');
  const firstUsable = priority.map((id) => usableDrafts.find((row) => row.id === id)).find(Boolean) || null;

  if (!drafts.length) {
    return {
      status: 'notReady',
      headline: 'No future sandbox check is queued yet.',
      detail: 'The plan needs drawdown evidence before a later sandbox comparison can be framed.',
      rows: [],
      reviewNote: 'No sandbox comparison is run here. Nothing changes in the current calculation or saved plan.'
    };
  }

  if (accountBlocked || !firstUsable) {
    return {
      status: 'blocked',
      headline: 'Future sandbox comparison is blocked for now.',
      detail: 'The plan needs usable account evidence before a later comparison can be framed.',
      rows: [
        {
          id: 'firstFutureSandboxCheck',
          label: 'First future sandbox check',
          status: 'blocked',
          draftId: null,
          baselineSignal: 'No usable draft check is available.',
          compareWouldNeed: 'A completed projection with entered account balances and a future calculation that can test annual overrides.',
          holdReason: accountBlocked ? 'Account balances are missing.' : 'All draft checks are blocked or need more input.',
          disposition: 'sandboxPlanningOnly'
        }
      ],
      reviewNote: 'No sandbox comparison is run here. Nothing changes in the current calculation or saved plan.'
    };
  }

  if (missingInputRows.length) {
    return {
      status: 'needsInput',
      headline: 'A future sandbox check is visible, with inputs to confirm first.',
      detail: 'One draft check can be held for later comparison after the missing inputs are reviewed.',
      rows: [
        {
          id: 'firstFutureSandboxCheck',
          label: 'First future sandbox check',
          status: 'heldForInput',
          draftId: firstUsable.id,
          baselineSignal: `${firstUsable.label}: ${firstUsable.amountBand}`,
          compareWouldNeed: 'A later calculation that can compare taxes, OAS recovery, funding, estate intent, and survivor impact together.',
          holdReason: missingInputRows.map((row) => row.label).join(', '),
          disposition: 'sandboxPlanningOnly'
        }
      ],
      reviewNote: 'No sandbox comparison is run here. Nothing changes in the current calculation or saved plan.'
    };
  }

  return {
    status: 'readyToCompareLater',
    headline: 'One future sandbox check is ready to hold for later comparison.',
    detail: 'This identifies the first draft shape to compare when a later calculation can safely test annual overrides.',
    rows: [
      {
        id: 'firstFutureSandboxCheck',
        label: 'First future sandbox check',
        status: 'queuedForFutureReview',
        draftId: firstUsable.id,
        baselineSignal: `${firstUsable.label}: ${firstUsable.amountBand}`,
        compareWouldNeed: 'A later calculation that can compare taxes, OAS recovery, funding, estate intent, and survivor impact together.',
        holdReason: 'Ready for a later sandbox comparison; no comparison is run in this sprint.',
        disposition: 'sandboxPlanningOnly'
      }
    ],
    reviewNote: 'No sandbox comparison is run here. Nothing changes in the current calculation or saved plan.'
  };
}

function buildTaxAwareDrawdownComparisonReadinessSummary(
  drafts: TaxAwareDrawdownDraftRow[],
  readinessRows: TaxAwareDrawdownReadinessCheck[],
  sandbox: TaxAwareDrawdownSandboxSummary
): TaxAwareDrawdownComparisonReadinessSummary {
  const usableDraftCount = drafts.filter((row) => row.status === 'usableForFutureReview').length;
  const blockedDraftCount = drafts.filter((row) => row.status === 'blocked').length;
  const needsInputCount = drafts.filter((row) => row.status === 'needsInput').length;
  const accountEvidence = readinessRows.find((row) => row.id === 'accountBalances');
  const accountMix = readinessRows.find((row) => row.id === 'accountMix');
  const lockedIn = readinessRows.find((row) => row.id === 'lockedInAccounts');
  const survivor = readinessRows.find((row) => row.id === 'survivorScenario');
  const estate = readinessRows.find((row) => row.id === 'estateIntent');
  const householdGuardrailRows = [lockedIn, survivor, estate].filter(Boolean) as TaxAwareDrawdownReadinessCheck[];
  const householdNeedsInput = householdGuardrailRows.some((row) => row.status === 'needsInput' || row.status === 'blocked');
  const householdReview = householdGuardrailRows.some((row) => row.status === 'review');

  const rows: TaxAwareDrawdownComparisonReadinessRow[] = [
    {
      id: 'draftCheck',
      label: 'Draft check',
      status: usableDraftCount > 0 ? (needsInputCount || blockedDraftCount ? 'review' : 'ready') : blockedDraftCount ? 'blocked' : 'needsInput',
      detail:
        usableDraftCount > 0
          ? `${usableDraftCount} future draft check${usableDraftCount === 1 ? '' : 's'} can be held for later comparison.`
          : 'No usable future draft check is available yet.'
    },
    {
      id: 'sandboxGate',
      label: 'Sandbox gate',
      status:
        sandbox.status === 'readyToCompareLater'
          ? 'ready'
          : sandbox.status === 'needsInput'
            ? 'needsInput'
            : sandbox.status === 'blocked'
              ? 'blocked'
              : 'needsInput',
      detail: sandbox.rows[0]?.holdReason || sandbox.detail
    },
    {
      id: 'accountEvidence',
      label: 'Account evidence',
      status:
        accountEvidence?.status === 'blocked'
          ? 'blocked'
          : accountMix?.status === 'needsInput'
            ? 'needsInput'
            : accountEvidence?.status === 'ready'
              ? 'ready'
              : 'needsInput',
      detail:
        accountMix?.status === 'ready'
          ? 'Registered and flexible account buckets are visible for later comparison.'
          : accountMix?.detail || accountEvidence?.detail || 'Account evidence needs review before later comparison.'
    },
    {
      id: 'householdGuardrails',
      label: 'Household guardrails',
      status: householdNeedsInput ? 'needsInput' : householdReview ? 'review' : 'ready',
      detail:
        householdNeedsInput || householdReview
          ? householdGuardrailRows
              .filter((row) => row.status === 'needsInput' || row.status === 'blocked' || row.status === 'review')
              .map((row) => row.label)
              .join(', ')
          : 'Estate, survivor, and locked-in account guardrails do not block later comparison.'
    }
  ];

  const hasBlocked = rows.some((row) => row.status === 'blocked');
  const hasNeedsInput = rows.some((row) => row.status === 'needsInput');
  const hasReadySandbox = sandbox.status === 'readyToCompareLater';
  const status: TaxAwareDrawdownComparisonReadinessSummary['status'] = hasBlocked
    ? 'blocked'
    : hasNeedsInput
      ? 'needsInput'
      : hasReadySandbox
        ? 'readyForLaterComparison'
        : 'notReady';

  return {
    status,
    headline:
      status === 'readyForLaterComparison'
        ? 'Ready for a later drawdown comparison check.'
        : status === 'blocked'
          ? 'Later drawdown comparison is blocked for now.'
          : status === 'needsInput'
            ? 'Later drawdown comparison needs inputs confirmed first.'
            : 'Later drawdown comparison is not ready yet.',
    detail:
      'This review summarizes whether the current plan has enough evidence for a later comparison. It does not run a comparison or change the plan.',
    rows,
    reviewNote: 'Comparison readiness is review-only. It does not run annual withdrawal changes, change withdrawal order, or save optimizer output.'
  };
}

export function selectEstateIntentSummary(
  baseline: SimulationResult | null | undefined,
  plan: V2PlanPayload | null | undefined,
  survivor: SimulationResult | null | undefined = null,
  retirementAnswer: RetirementAnswerSummary = selectRetirementAnswerSummary(baseline, plan, null, survivor)
): EstateIntentSummary {
  const rows = rowsFrom(baseline);
  const overview = selectOverviewMetrics(baseline);
  const tax = selectTaxSummaryMetrics(baseline);
  const taxPressureRows = selectTaxPressureRows(baseline);
  const survivorComparison = selectSurvivorComparison(baseline, survivor, plan);
  const last = rows[rows.length - 1];
  const estateTarget = n(plan?.inheritance);
  const projectedEstate = overview.endPortfolio;
  const estateGap = projectedEstate - estateTarget;
  const finalRegisteredAssets = n(last?.bal_rrsp) + n(last?.bal_lif);
  const hasLargeEstateWithoutTarget = retirementAnswer.status === 'estateHeavy' && estateTarget <= 0;
  const hasEstateTargetGap = estateTarget > 0 && Math.abs(estateGap) > Math.max(estateTarget * 0.2, overview.firstYearSpending * 2);
  const hasTaxPressure = tax.lifetimeOasClawback > 0 || taxPressureRows.length > 0 || finalRegisteredAssets > Math.max(projectedEstate * 0.35, overview.firstYearSpending * 8);
  const survivorNeedsReview = survivorComparison.status === 'needsInput' || survivorComparison.status === 'notAvailable';

  let status: EstateIntentStatus = 'aligned';
  if (!rows.length || retirementAnswer.status === 'cannotTell') status = 'cannotTell';
  else if (hasLargeEstateWithoutTarget || hasEstateTargetGap) status = 'needsIntent';
  else if (survivorNeedsReview) status = 'survivorReview';
  else if (hasTaxPressure) status = 'taxReview';

  const labelByStatus: Record<EstateIntentStatus, string> = {
    cannotTell: 'Cannot review yet',
    needsIntent: 'Estate wishes need clarity',
    taxReview: 'Tax efficiency deserves review',
    survivorReview: 'Survivor estate picture needs review',
    aligned: 'Estate picture looks intentional'
  };
  const headlineByStatus: Record<EstateIntentStatus, string> = {
    cannotTell: 'Estate intent needs the retirement answer to calculate first.',
    needsIntent: hasLargeEstateWithoutTarget
      ? 'The plan leaves a large projected estate, but no estate goal is entered.'
      : 'The projected estate is meaningfully different from the estate goal entered.',
    taxReview: 'The estate picture may be shaped by tax timing and registered assets.',
    survivorReview: 'For a couple, estate and tax choices should be checked against the survivor result.',
    aligned: 'The projected estate does not raise a major intent or tax-efficiency flag in this first-pass review.'
  };
  const taxEfficiencyHeadline =
    hasTaxPressure
      ? 'Tax timing may affect how much wealth supports the household versus tax.'
      : 'No major estate-tax efficiency flag appears in this first-pass review.';
  const taxEfficiencyDetail =
    hasTaxPressure
      ? 'Review registered withdrawals, OAS recovery tax, and later-life registered balances before assuming the estate outcome is the best use of resources.'
      : 'Still confirm whether preserving, spending, or giving assets best matches the household goal.';
  const reviewActions: EstateIntentSummary['reviewActions'] = [];

  if (status === 'needsIntent') {
    reviewActions.push({
      id: 'estateGoal',
      label: estateTarget > 0 ? 'Compare estate goal to projection' : 'Set an estate intention',
      detail:
        estateTarget > 0
          ? 'Decide whether the gap means spending, giving, tax timing, or preservation should change.'
          : 'Decide whether the household wants to preserve this much wealth or enjoy more of it during retirement.',
      detailArea: 'details'
    });
  }
  if (hasTaxPressure) {
    reviewActions.push({
      id: 'taxTiming',
      label: 'Review tax timing',
      detail: 'Later-life taxable income, OAS recovery tax, or registered withdrawals may reduce estate efficiency.',
      detailArea: 'taxes'
    });
  }
  if (finalRegisteredAssets > 0) {
    reviewActions.push({
      id: 'registeredAssets',
      label: 'Check registered assets at plan end',
      detail: 'Large RRSP/RRIF/LIF balances late in life can affect taxes, estate flexibility, and survivor planning.',
      detailArea: 'details'
    });
  }
  if (!personLooksBlank(plan?.p2)) {
    reviewActions.push({
      id: 'survivor',
      label: 'Confirm survivor estate impact',
      detail: 'Estate wishes should still work after the first death, when income, tax, and accounts may change.',
      detailArea: 'householdResilience'
    });
  }
  reviewActions.push({
    id: 'giving',
    label: 'Consider lifetime giving or spending',
    detail: 'If the projected estate is larger than intended, review whether gifting, family support, travel, or home projects fit the household values.',
    detailArea: 'stressTests'
  });

  return {
    status,
    label: labelByStatus[status],
    headline: headlineByStatus[status],
    detail:
      status === 'needsIntent'
        ? 'The planner should not assume a larger estate is automatically better. Make the intent explicit before optimizing.'
        : 'Use this as a first-pass estate and tax-efficiency review, not a legal estate plan.',
    projectedEstate,
    estateTarget,
    estateGap,
    lifetimeTax: tax.lifetimeTax,
    lifetimeOasClawback: tax.lifetimeOasClawback,
    finalRegisteredAssets,
    taxEfficiencyHeadline,
    taxEfficiencyDetail,
    reviewActions: reviewActions.slice(0, 4)
  };
}

export function selectOptimizerDecisionBoundaries(
  baseline: SimulationResult | null | undefined,
  plan: V2PlanPayload | null | undefined,
  retirementAnswer: RetirementAnswerSummary = selectRetirementAnswerSummary(baseline, plan)
): OptimizerBoundarySummary {
  const overview = selectOverviewMetrics(baseline);
  const rows = rowsFrom(baseline);
  const diagnostics = selectReconciliationDiagnostics(baseline);
  const earlySpending = n(plan?.spending?.gogo);
  const laterSpending = n(plan?.spending?.slowgo);
  const lateLifeSpending = n(plan?.spending?.nogo);
  const retireYear = n(plan?.assumptions?.retireYear) || n(plan?.p1?.retireYear);
  const hasBenefitEstimates = Boolean(
    plan &&
      (n(plan.p1.cpp65_monthly) ||
        n(plan.p1.cpp70_monthly) ||
        n(plan.p1.oas_monthly) ||
        n(plan.p2.cpp65_monthly) ||
        n(plan.p2.cpp70_monthly) ||
        n(plan.p2.oas_monthly))
  );
  const assets = planAssetTotal(plan);
  const estateTarget = n(plan?.inheritance);
  const downsizeYear = n(plan?.downsize?.year);
  const downsizeProceeds = n(plan?.downsize?.netProceeds);
  const cannotUseResults = !rows.length || retirementAnswer.status === 'cannotTell' || diagnostics.status === 'warning';

  const boundaryRows: OptimizerBoundaryRow[] = [
    {
      id: 'spending',
      label: 'Retirement spending',
      status: earlySpending > 0 && laterSpending > 0 && lateLifeSpending > 0 ? 'available' : 'needsInput',
      currentSetting:
        earlySpending || laterSpending || lateLifeSpending
          ? `${moneyText(earlySpending)} early / ${moneyText(laterSpending)} later / ${moneyText(lateLifeSpending)} late-life`
          : 'Not set',
      futureSearchSpace: 'Test higher or lower early, later, and late-life spending assumptions while preserving safety and estate intent.',
      whyItMatters: 'Spending is the main way the household turns savings into retirement life.',
      beforeOptimizing:
        earlySpending > 0
          ? 'Confirm the spending assumptions reflect regular expenses and the life the household wants.'
          : 'Enter spending assumptions before searching for a better plan.',
      detailArea: 'details'
    },
    {
      id: 'retirementTiming',
      label: 'Retirement timing',
      status: retireYear ? 'available' : 'needsInput',
      currentSetting: retireYear ? String(retireYear) : 'Not set',
      futureSearchSpace: 'Test retiring earlier or later around the entered retirement year.',
      whyItMatters: 'Working longer can add savings, reduce withdrawal years, and change CPP/OAS and pension timing.',
      beforeOptimizing: retireYear ? 'Confirm whether the household is actually willing to move the retirement date.' : 'Enter a retirement year before timing can be compared.',
      detailArea: 'details'
    },
    {
      id: 'benefitTiming',
      label: 'CPP/OAS timing',
      status: hasBenefitEstimates ? 'available' : 'needsInput',
      currentSetting: hasBenefitEstimates ? 'CPP/OAS estimates entered' : 'Needs CPP/OAS estimates',
      futureSearchSpace: 'Compare current timing with delayed government benefits where estimates are available.',
      whyItMatters: 'Government benefit timing changes guaranteed income, withdrawals, tax, and survivor resilience.',
      beforeOptimizing: hasBenefitEstimates ? 'Confirm the monthly CPP and OAS estimates are reasonable.' : 'Add CPP/OAS estimates before benefit timing can be tested.',
      detailArea: 'incomeSources'
    },
    {
      id: 'withdrawalOrder',
      label: 'Withdrawal order and tax timing',
      status: assets > 0 ? 'reviewOnly' : 'needsInput',
      currentSetting: plan?.assumptions?.withdrawalOrder || 'default',
      futureSearchSpace: 'Later optimizer work can compare registered, non-registered, TFSA, cash wedge, and tax-aware drawdown paths.',
      whyItMatters: 'Drawdown order can affect OAS recovery tax, registered balances left late in life, and estate tax pressure.',
      beforeOptimizing:
        assets > 0
          ? 'Keep this as a review boundary until the drawdown optimizer is explicitly implemented.'
          : 'Enter investment account balances before withdrawal timing can be reviewed.',
      detailArea: 'taxes'
    },
    {
      id: 'estateTarget',
      label: 'Estate goal',
      status: estateTarget > 0 ? 'available' : retirementAnswer.status === 'estateHeavy' ? 'needsInput' : 'reviewOnly',
      currentSetting: estateTarget > 0 ? moneyText(estateTarget) : 'Not set',
      futureSearchSpace: 'Balance more retirement spending against money intentionally left for heirs, gifts, or charity.',
      whyItMatters: 'Without an estate goal, the tool cannot know whether a large ending portfolio is success or unused lifestyle.',
      beforeOptimizing:
        estateTarget > 0
          ? 'Confirm the estate goal is intentional.'
          : retirementAnswer.status === 'estateHeavy'
            ? 'Add an estate goal or confirm that spending more is acceptable before optimizing.'
            : 'Review whether leaving money is important before using estate trade-offs.',
      detailArea: 'details'
    },
    {
      id: 'downsizing',
      label: 'Home sale or downsizing',
      status: downsizeYear && downsizeProceeds ? 'available' : 'reviewOnly',
      currentSetting: downsizeYear && downsizeProceeds ? `${downsizeYear}, ${moneyText(downsizeProceeds)}` : 'Not part of current plan',
      futureSearchSpace: 'Test whether unlocking home equity changes spending room, taxes, or estate outcomes.',
      whyItMatters: 'Real estate can be a major retirement resource, but it is also a lifestyle decision.',
      beforeOptimizing:
        downsizeYear && downsizeProceeds
          ? 'Confirm the year and net cash estimate after selling, moving, debt, and replacement housing costs.'
          : 'Only optimize downsizing if the household would realistically consider it.',
      detailArea: 'details'
    }
  ];

  const availableCount = boundaryRows.filter((row) => row.status === 'available').length;
  const needsInputCount = boundaryRows.filter((row) => row.status === 'needsInput').length;
  const reviewOnlyCount = boundaryRows.filter((row) => row.status === 'reviewOnly').length;
  const status: OptimizerBoundarySummary['status'] = cannotUseResults || needsInputCount > 0 ? 'needsInput' : reviewOnlyCount > 0 ? 'review' : 'ready';

  return {
    status,
    headline:
      status === 'ready'
        ? 'The main planning levers are ready to become optimizer inputs later.'
        : status === 'review'
          ? 'Some optimizer levers are available, while others should stay as review choices.'
          : 'Optimizer prep needs clearer inputs before automatic search would be responsible.',
    detail:
      overview.projectionYears > 0
        ? 'This does not optimize the plan yet. It marks which household choices are defined well enough for a future search and which still need human intent.'
        : 'Results need to calculate before optimizer boundaries can be reviewed.',
    availableCount,
    needsInputCount,
    reviewOnlyCount,
    nextStep:
      status === 'needsInput'
        ? 'Clear missing inputs and source-review items first.'
        : 'Keep using the retirement choice cards while optimizer execution remains out of scope.',
    rows: boundaryRows
  };
}

export function selectOptimizerInputReview(
  boundaries: OptimizerBoundarySummary
): OptimizerInputReviewSummary {
  const rows: OptimizerInputReviewRow[] = boundaries.rows.map((row) => {
    const permission = optimizerPermissionForBoundary(row);
    const copy = optimizerReviewCopy(row, permission);
    return {
      id: row.id,
      label: row.label,
      permission,
      currentSetting: row.currentSetting,
      guardrail: copy.guardrail,
      reviewQuestion: copy.reviewQuestion,
      suggestedNextStep: copy.suggestedNextStep,
      detailArea: row.detailArea
    };
  });
  const canExploreCount = rows.filter((row) => row.permission === 'canExplore').length;
  const mustPreserveCount = rows.filter((row) => row.permission === 'mustPreserve').length;
  const needsDecisionCount = rows.filter((row) => row.permission === 'needsDecision').length;
  const status: OptimizerInputReviewSummary['status'] =
    needsDecisionCount > 0 || boundaries.status === 'needsInput' ? 'needsDecision' : mustPreserveCount > 0 ? 'review' : 'ready';

  return {
    status,
    headline:
      status === 'ready'
        ? 'The future optimizer has clear permission boundaries.'
        : status === 'review'
          ? 'Some wishes should be preserved before any future optimizer searches.'
          : 'Some choices need clearer household permission before optimization would be responsible.',
    detail:
      'This is a review checklist only. It does not save optimizer permissions and does not run an optimizer.',
    canExploreCount,
    mustPreserveCount,
    needsDecisionCount,
    rows
  };
}

function optimizerPermissionForBoundary(row: OptimizerBoundaryRow): OptimizerInputPermission {
  if (row.status === 'needsInput') return 'needsDecision';
  if (row.id === 'estateTarget') return row.status === 'available' ? 'mustPreserve' : 'needsDecision';
  if (row.id === 'withdrawalOrder') return 'mustPreserve';
  if (row.id === 'downsizing' && row.status === 'reviewOnly') return 'mustPreserve';
  if (row.status === 'reviewOnly') return 'mustPreserve';
  return 'canExplore';
}

function optimizerReviewCopy(
  row: OptimizerBoundaryRow,
  permission: OptimizerInputPermission
): Pick<OptimizerInputReviewRow, 'guardrail' | 'reviewQuestion' | 'suggestedNextStep'> {
  const byId: Record<OptimizerBoundaryRow['id'], Pick<OptimizerInputReviewRow, 'guardrail' | 'reviewQuestion' | 'suggestedNextStep'>> = {
    spending: {
      guardrail: 'Explore spending only within a lifestyle range the household would actually enjoy.',
      reviewQuestion: 'Could the household comfortably spend more or less than the current targets?',
      suggestedNextStep: permission === 'needsDecision' ? 'Set early, later, and late-life spending first.' : 'Use Spending Capacity and Retirement Choices as the first review.'
    },
    retirementTiming: {
      guardrail: 'Do not move retirement timing unless the household is genuinely willing to work longer or retire earlier.',
      reviewQuestion: 'Is the retirement date flexible, or should it be preserved?',
      suggestedNextStep: permission === 'needsDecision' ? 'Enter a retirement year first.' : 'Review Work two years longer as the first timing test.'
    },
    benefitTiming: {
      guardrail: 'Explore CPP/OAS timing only after the monthly estimates are credible.',
      reviewQuestion: 'Would the household consider delaying benefits if it improves later-life security?',
      suggestedNextStep: permission === 'needsDecision' ? 'Add CPP/OAS estimates first.' : 'Review the age-70 CPP/OAS timing test before changing assumptions.'
    },
    withdrawalOrder: {
      guardrail: 'Preserve the current withdrawal-order setting until a tax-aware drawdown optimizer exists.',
      reviewQuestion: 'Should drawdown order stay as a reviewed tax strategy rather than an automatic lever?',
      suggestedNextStep: 'Use Taxes and Details before allowing future tax-aware drawdown search.'
    },
    estateTarget: {
      guardrail: 'Preserve an entered estate goal; if no goal exists, do not assume a larger estate is always better.',
      reviewQuestion: 'Is leaving this amount of money intentional, or can the plan trade estate for more retirement enjoyment?',
      suggestedNextStep: permission === 'needsDecision' ? 'Set or confirm estate intent first.' : 'Use Estate Wishes and Tax Efficiency to confirm the target.'
    },
    downsizing: {
      guardrail: 'Never assume a home sale unless the household would realistically consider it.',
      reviewQuestion: 'Is downsizing an acceptable planning lever or should the home be preserved?',
      suggestedNextStep: permission === 'canExplore' ? 'Confirm year and net proceeds before comparing home-equity choices.' : 'Keep downsizing out of optimizer search unless the household opts in.'
    }
  };

  return byId[row.id];
}

export function selectFundingSourceRows(row: AnnualSimulationRow | null | undefined): FundingSourceRow[] {
  if (!row) return [];

  const taxableIncome = n(row.grossIncome);
  const taxFreeWithdrawals = n(row.tfsa_draw) + n(row.nonreg_draw);
  const cashFunding = n(row.cash_draw);
  const otherInflows = n(row.downsize_proceeds);

  return [
    { id: 'taxable-income', label: 'Taxable income and registered withdrawals', amount: taxableIncome, taxTreatment: 'taxable' },
    { id: 'tax-free', label: 'TFSA and non-registered withdrawals', amount: taxFreeWithdrawals, taxTreatment: 'tax-free' },
    { id: 'cash-wedge', label: 'Cash wedge funding', amount: cashFunding, taxTreatment: 'cash' },
    { id: 'other-inflows', label: 'Other inflows', amount: otherInflows, taxTreatment: 'other' }
  ];
}

export function selectIncomeSourceRows(result: SimulationResult | null | undefined): IncomeSourceRow[] {
  const rows = rowsFrom(result);
  const first = rows[0];

  function annual(row: AnnualSimulationRow | undefined, category: IncomeSourceCategory): number {
    if (!row) return 0;
    switch (category) {
      case 'salary':
        return n(row.salary_f) + n(row.salary_m);
      case 'pension':
        return n(row.dbPension) + n(row.dbPension_m) + n(row.dbSurvivor);
      case 'cpp':
        return n(row.cpp_f) + n(row.cpp_m);
      case 'oas':
        return n(row.oas_f) + n(row.oas_m);
      case 'registeredWithdrawals':
        return n(row.rrif_draw_f) + n(row.rrif_draw_m) + n(row.lif_draw);
      case 'taxFreeWithdrawals':
        return n(row.tfsa_draw) + n(row.nonreg_draw);
      case 'cashWedge':
        return n(row.cash_draw);
      case 'other':
        return n(row.downsize_proceeds);
      default:
        return 0;
    }
  }

  const definitions: Array<{ id: IncomeSourceCategory; label: string; taxable: boolean }> = [
    { id: 'salary', label: 'Employment income', taxable: true },
    { id: 'pension', label: 'DB pension income', taxable: true },
    { id: 'cpp', label: 'CPP benefits', taxable: true },
    { id: 'oas', label: 'OAS benefits', taxable: true },
    { id: 'registeredWithdrawals', label: 'Registered withdrawals', taxable: true },
    { id: 'taxFreeWithdrawals', label: 'TFSA and non-registered withdrawals', taxable: false },
    { id: 'cashWedge', label: 'Cash wedge funding', taxable: false },
    { id: 'other', label: 'Other inflows', taxable: false }
  ];

  return definitions.map((definition) => ({
    ...definition,
    firstYearAmount: annual(first, definition.id),
    lifetimeAmount: rows.reduce((total, row) => total + annual(row, definition.id), 0)
  }));
}

export function selectAccountBalanceSeries(result: SimulationResult | null | undefined): AccountBalancePoint[] {
  return rowsFrom(result).map((row) => ({
    year: row.year,
    rrsp: n(row.bal_rrsp),
    tfsa: n(row.bal_tfsa),
    lif: n(row.bal_lif),
    nonRegistered: n(row.bal_nonreg),
    cash: n(row.bal_cash),
    total: n(row.bal_total)
  }));
}

export function selectAccountSummaryRows(result: SimulationResult | null | undefined): AccountSummaryRow[] {
  const series = selectAccountBalanceSeries(result);
  const first = series[0];
  const last = series[series.length - 1];
  const definitions: Array<{ id: AccountSummaryRow['id']; label: string }> = [
    { id: 'rrsp', label: 'RRSP / RRIF' },
    { id: 'tfsa', label: 'TFSA' },
    { id: 'lif', label: 'LIF' },
    { id: 'nonRegistered', label: 'Non-registered' },
    { id: 'cash', label: 'Cash wedge' },
    { id: 'total', label: 'Total portfolio' }
  ];

  return definitions.map(({ id, label }) => ({
    id,
    label,
    firstYearBalance: first ? first[id] : 0,
    endBalance: last ? last[id] : 0,
    peakBalance: series.reduce((peak, point) => Math.max(peak, point[id]), 0),
    netChange: (last ? last[id] : 0) - (first ? first[id] : 0)
  }));
}

function compactMoney(value: number): string {
  return `$${Math.round(value).toLocaleString()}`;
}

function yearLabel(year: number | null): string {
  return year ? String(year) : 'Not shown';
}

function lifetimeWithdrawals(rows: AnnualDetailRow[], field: keyof Pick<AnnualDetailRow, 'registeredWithdrawals' | 'tfsaWithdrawals' | 'nonRegisteredWithdrawals' | 'cashWedgeWithdrawals'>): number {
  return rows.reduce((total, row) => total + row[field], 0);
}

export function selectAccountDrawdownReviewRows(result: SimulationResult | null | undefined): AccountDrawdownReviewRow[] {
  const rows = selectAnnualDetailRows(result);
  const balances = selectAccountBalanceSeries(result);
  const summaryRows = selectAccountSummaryRows(result);
  const firstBalance = balances[0];
  const lastBalance = balances[balances.length - 1];
  const registeredSummary = summaryRows.find((row) => row.id === 'rrsp');
  const lifSummary = summaryRows.find((row) => row.id === 'lif');
  const tfsaSummary = summaryRows.find((row) => row.id === 'tfsa');
  const nonRegisteredSummary = summaryRows.find((row) => row.id === 'nonRegistered');
  const cashSummary = summaryRows.find((row) => row.id === 'cash');
  const totalSummary = summaryRows.find((row) => row.id === 'total');

  const registeredWithdrawalTotal = lifetimeWithdrawals(rows, 'registeredWithdrawals');
  const tfsaWithdrawalTotal = lifetimeWithdrawals(rows, 'tfsaWithdrawals');
  const nonRegisteredWithdrawalTotal = lifetimeWithdrawals(rows, 'nonRegisteredWithdrawals');
  const cashWithdrawalTotal = lifetimeWithdrawals(rows, 'cashWedgeWithdrawals');
  const registeredEndBalance = (registeredSummary?.endBalance || 0) + (lifSummary?.endBalance || 0);
  const registeredStartBalance = (registeredSummary?.firstYearBalance || 0) + (lifSummary?.firstYearBalance || 0);

  const firstRegistered = rows.find((row) => row.registeredWithdrawals > RECONCILIATION_TOLERANCE);
  const firstTfsa = rows.find((row) => row.tfsaWithdrawals > RECONCILIATION_TOLERANCE);
  const firstNonRegistered = rows.find((row) => row.nonRegisteredWithdrawals > RECONCILIATION_TOLERANCE);
  const firstCash = rows.find((row) => row.cashWedgeWithdrawals > RECONCILIATION_TOLERANCE);
  const firstDepletion = balances.find((row) => row.total <= RECONCILIATION_TOLERANCE);

  return [
    {
      id: 'registeredDrawdown',
      label: 'Registered drawdown',
      severity:
        registeredWithdrawalTotal <= RECONCILIATION_TOLERANCE
          ? 'ok'
          : registeredStartBalance > RECONCILIATION_TOLERANCE && registeredEndBalance <= RECONCILIATION_TOLERANCE
            ? 'watch'
            : 'review',
      year: firstRegistered?.year ?? null,
      value: registeredWithdrawalTotal > RECONCILIATION_TOLERANCE ? compactMoney(registeredWithdrawalTotal) : 'None shown',
      explanation:
        registeredWithdrawalTotal > RECONCILIATION_TOLERANCE
          ? `Registered withdrawals begin in ${yearLabel(firstRegistered?.year ?? null)} and total ${compactMoney(registeredWithdrawalTotal)} across the projection.`
          : 'The projection does not show material RRSP/RRIF/LIF withdrawals.',
      reviewAction: 'Review Annual Detail and Taxes when registered withdrawals begin because they usually affect taxable income.',
      detailArea: 'annualDetail'
    },
    {
      id: 'tfsaDrawdown',
      label: 'TFSA drawdown',
      severity:
        tfsaWithdrawalTotal <= RECONCILIATION_TOLERANCE
          ? 'ok'
          : (tfsaSummary?.firstYearBalance || 0) > RECONCILIATION_TOLERANCE && (tfsaSummary?.endBalance || 0) <= RECONCILIATION_TOLERANCE
            ? 'review'
            : 'ok',
      year: firstTfsa?.year ?? null,
      value: tfsaWithdrawalTotal > RECONCILIATION_TOLERANCE ? compactMoney(tfsaWithdrawalTotal) : 'None shown',
      explanation:
        tfsaWithdrawalTotal > RECONCILIATION_TOLERANCE
          ? `TFSA withdrawals begin in ${yearLabel(firstTfsa?.year ?? null)} and total ${compactMoney(tfsaWithdrawalTotal)}.`
          : 'The TFSA bucket is not materially drawn in this projection.',
      reviewAction: 'Use this as a tax-free funding check, then confirm the detailed annual pattern in the detailed report if needed.',
      detailArea: 'annualDetail'
    },
    {
      id: 'nonRegisteredDrawdown',
      label: 'Non-registered drawdown',
      severity:
        nonRegisteredWithdrawalTotal <= RECONCILIATION_TOLERANCE
          ? 'ok'
          : (nonRegisteredSummary?.firstYearBalance || 0) > RECONCILIATION_TOLERANCE && (nonRegisteredSummary?.endBalance || 0) <= RECONCILIATION_TOLERANCE
            ? 'review'
            : 'ok',
      year: firstNonRegistered?.year ?? null,
      value: nonRegisteredWithdrawalTotal > RECONCILIATION_TOLERANCE ? compactMoney(nonRegisteredWithdrawalTotal) : 'None shown',
      explanation:
        nonRegisteredWithdrawalTotal > RECONCILIATION_TOLERANCE
          ? `Non-registered withdrawals begin in ${yearLabel(firstNonRegistered?.year ?? null)} and total ${compactMoney(nonRegisteredWithdrawalTotal)}.`
          : 'The non-registered bucket is not materially drawn in this projection.',
      reviewAction: 'Review Cash Flow and Taxes together when non-registered withdrawals are active.',
      detailArea: 'cashFlow'
    },
    {
      id: 'cashWedge',
      label: 'Cash wedge use',
      severity:
        cashWithdrawalTotal <= RECONCILIATION_TOLERANCE
          ? 'ok'
          : (cashSummary?.firstYearBalance || 0) > RECONCILIATION_TOLERANCE && (cashSummary?.endBalance || 0) <= RECONCILIATION_TOLERANCE
            ? 'review'
            : 'ok',
      year: firstCash?.year ?? null,
      value: cashWithdrawalTotal > RECONCILIATION_TOLERANCE ? compactMoney(cashWithdrawalTotal) : 'None shown',
      explanation:
        cashWithdrawalTotal > RECONCILIATION_TOLERANCE
          ? `Cash wedge funding starts in ${yearLabel(firstCash?.year ?? null)} and totals ${compactMoney(cashWithdrawalTotal)}.`
          : 'The projection does not rely on material cash wedge funding.',
      reviewAction: 'Compare this with the first retirement years in Cash Flow to see whether cash is bridging early spending.',
      detailArea: 'cashFlow'
    },
    {
      id: 'terminalPortfolio',
      label: 'End portfolio',
      severity:
        firstDepletion || (lastBalance?.total || 0) <= RECONCILIATION_TOLERANCE
          ? 'watch'
          : totalSummary && totalSummary.endBalance < totalSummary.firstYearBalance * 0.5
            ? 'review'
            : 'ok',
      year: firstDepletion?.year ?? lastBalance?.year ?? null,
      value: lastBalance ? compactMoney(lastBalance.total) : 'Not shown',
      explanation:
        firstBalance && lastBalance
          ? `Portfolio changes from ${compactMoney(firstBalance.total)} to ${compactMoney(lastBalance.total)} by ${lastBalance.year}.`
          : 'No portfolio balance path is available yet.',
      reviewAction: 'Use Stress Tests for fragility and the detailed report for the complete account audit trail.',
      detailArea: 'stressTests'
    }
  ];
}

export function selectAccountDrawdownStory(result: SimulationResult | null | undefined): AccountDrawdownStorySummary {
  const balances = selectAccountBalanceSeries(result);
  const reviewRows = selectAccountDrawdownReviewRows(result);
  const first = balances[0];
  const last = balances[balances.length - 1];
  const peak = balances.reduce<AccountBalancePoint | null>((currentPeak, row) => {
    if (!currentPeak || row.total > currentPeak.total) return row;
    return currentPeak;
  }, null);
  const lowest = balances.reduce<AccountBalancePoint | null>((currentLowest, row) => {
    if (!currentLowest || row.total < currentLowest.total) return row;
    return currentLowest;
  }, null);
  const firstDepletion = balances.find((row) => row.total <= RECONCILIATION_TOLERANCE);
  const status: StressSeverity = reviewRows.some((row) => row.severity === 'watch')
    ? 'watch'
    : reviewRows.some((row) => row.severity === 'review')
      ? 'review'
      : 'ok';

  return {
    status,
    headline:
      status === 'watch'
        ? 'Account path needs a closer look.'
        : status === 'review'
          ? 'Account drawdowns are active and worth reviewing.'
          : 'Account balances look orderly in this projection.',
    detail:
      first && last
        ? `The portfolio starts at ${compactMoney(first.total)} and ends at ${compactMoney(last.total)} across ${balances.length} projection years.`
        : 'Run the projection to see account balance movement.',
    firstYear: first?.year ?? null,
    finalYear: last?.year ?? null,
    startPortfolio: first?.total ?? 0,
    endPortfolio: last?.total ?? 0,
    peakPortfolio: peak?.total ?? 0,
    lowestPortfolioYear: lowest?.year ?? null,
    lowestPortfolio: lowest?.total ?? 0,
    firstDepletionYear: firstDepletion?.year ?? null,
    stableDashboardHandoff: 'Complete account schedules, printable charts, and deeper review views remain in the detailed report.'
  };
}

export function selectTaxDetailRows(result: SimulationResult | null | undefined): TaxDetailRow[] {
  return rowsFrom(result).map((row) => {
    const taxableIncome = n(row.taxableIncome);
    const tax = n(row.totalTaxYear);
    const oasClawback = n(row.totalOasClawY);
    return {
      year: row.year,
      taxableIncome,
      tax,
      oasClawback,
      effectiveRate: taxableIncome > 0 ? tax / taxableIncome : 0
    };
  });
}

export function selectTaxSummaryMetrics(result: SimulationResult | null | undefined): TaxSummaryMetrics {
  const rows = selectTaxDetailRows(result);
  const peak = rows.reduce<TaxDetailRow | null>((currentPeak, row) => {
    if (!currentPeak || row.tax > currentPeak.tax) return row;
    return currentPeak;
  }, null);

  return {
    firstYearTax: rows[0]?.tax || 0,
    lifetimeTax: rows.reduce((total, row) => total + row.tax, 0),
    peakTaxYear: peak?.year ?? null,
    peakTax: peak?.tax || 0,
    lifetimeOasClawback: rows.reduce((total, row) => total + row.oasClawback, 0),
    firstYearTaxableIncome: rows[0]?.taxableIncome || 0
  };
}

export const selectStressIndicatorRows = selectStressIndicatorRowsFromStressModule;
export const selectStressTestRows = selectStressTestRowsFromStressModule;
export const selectStressTestSummary = selectStressTestSummaryFromStressModule;

export function selectChartReadyData(result: SimulationResult | null | undefined): ChartReadyYear[] {
  return rowsFrom(result).map((row) => {
    const reconciliation = selectCashFlowReconciliation(row);
    return {
      year: row.year,
      spending: n(row.spending),
      afterTaxSpending: n(row.totalAftaxYear),
      tax: n(row.totalTaxYear),
      portfolio: n(row.bal_total),
      funding: reconciliation.reconciledAfterTaxSpending,
      shortfall: n(row.shortfall)
    };
  });
}

export function selectProjectionMilestones(result: SimulationResult | null | undefined): ProjectionMilestoneRow[] {
  const rows = selectChartReadyData(result);
  if (rows.length === 0) return [];

  const indexes = Array.from(new Set([0, Math.floor((rows.length - 1) / 2), rows.length - 1]));
  const labels: ProjectionMilestoneRow['label'][] =
    indexes.length === 1 ? ['First year'] : indexes.length === 2 ? ['First year', 'Final year'] : ['First year', 'Midpoint', 'Final year'];

  return indexes.map((index, labelIndex) => ({
    ...rows[index],
    label: labels[labelIndex]
  }));
}

export function selectCashFlowReconciliationRows(
  result: SimulationResult | null | undefined
): CashFlowReconciliationRow[] {
  return rowsFrom(result).map((row) => {
    const reconciliation = selectCashFlowReconciliation(row);
    return {
      ...reconciliation,
      spending: n(row.spending),
      fundingBeforeTax:
        reconciliation.incomeAndWithdrawals +
        reconciliation.taxFreeWithdrawals +
        reconciliation.cashWedgeFunding +
        reconciliation.otherInflows,
      portfolio: n(row.bal_total),
      shortfall: n(row.shortfall)
    };
  });
}

export function selectAnnualDetailRows(result: SimulationResult | null | undefined): AnnualDetailRow[] {
  return rowsFrom(result).map((row) => {
    const reconciliation = selectCashFlowReconciliation(row);
    const salary = n(row.salary_f) + n(row.salary_m);
    const dbPension = n(row.dbPension) + n(row.dbPension_m) + n(row.dbSurvivor);
    const cpp = n(row.cpp_f) + n(row.cpp_m);
    const oas = n(row.oas_f) + n(row.oas_m);
    const registeredWithdrawals = n(row.rrif_draw_f) + n(row.rrif_draw_m) + n(row.lif_draw);
    const taxableIncome = n(row.taxableIncome);
    const tax = n(row.totalTaxYear);

    return {
      year: row.year,
      ages: n(row.ageM) > 0 ? `${row.ageF} / ${row.ageM}` : String(row.ageF),
      spending: n(row.spending),
      afterTaxSpending: n(row.totalAftaxYear),
      fundingBeforeTax:
        reconciliation.incomeAndWithdrawals +
        reconciliation.taxFreeWithdrawals +
        reconciliation.cashWedgeFunding +
        reconciliation.otherInflows,
      tax,
      shortfall: n(row.shortfall),
      portfolio: n(row.bal_total),
      salary,
      dbPension,
      cpp,
      oas,
      registeredWithdrawals,
      tfsaWithdrawals: n(row.tfsa_draw),
      nonRegisteredWithdrawals: n(row.nonreg_draw),
      cashWedgeWithdrawals: n(row.cash_draw),
      otherInflows: n(row.downsize_proceeds),
      taxableIncome,
      effectiveRate: taxableIncome > 0 ? tax / taxableIncome : 0,
      oasClawback: n(row.totalOasClawY),
      rrsp: n(row.bal_rrsp),
      tfsa: n(row.bal_tfsa),
      lif: n(row.bal_lif),
      nonRegistered: n(row.bal_nonreg),
      cash: n(row.bal_cash),
      total: n(row.bal_total),
      reconciliationGap: reconciliation.reconciliationDelta,
      cashFlowDelta: reconciliation.cashFlowDelta,
      reconciliationStatus: reconciliation.status
    };
  });
}

export function selectAnnualDetailSummary(result: SimulationResult | null | undefined): AnnualDetailSummary {
  const rows = selectAnnualDetailRows(result);
  const first = rows[0];
  const last = rows[rows.length - 1];
  const firstShortfall = rows.find((row) => row.shortfall > RECONCILIATION_TOLERANCE);

  return {
    firstYear: first?.year ?? null,
    finalYear: last?.year ?? null,
    totalYears: rows.length,
    fundedYears: rows.filter((row) => row.shortfall <= RECONCILIATION_TOLERANCE).length,
    firstShortfallYear: firstShortfall?.year ?? null,
    endPortfolio: last?.portfolio ?? 0
  };
}

export function selectPortfolioChartSeries(result: SimulationResult | null | undefined): PortfolioChartPoint[] {
  return selectAnnualDetailRows(result).map((row) => ({
    year: row.year,
    portfolio: row.portfolio
  }));
}

export function selectSpendingTaxChartSeries(result: SimulationResult | null | undefined): SpendingTaxChartPoint[] {
  return selectAnnualDetailRows(result).map((row) => ({
    year: row.year,
    afterTaxSpending: row.afterTaxSpending,
    tax: row.tax,
    shortfall: row.shortfall
  }));
}

export function selectAccountBucketChartSeries(result: SimulationResult | null | undefined): AccountBucketChartPoint[] {
  return selectAccountBalanceSeries(result);
}

export function selectReconciliationDiagnostics(result: SimulationResult | null | undefined): ReconciliationDiagnostics {
  const rows = selectCashFlowReconciliationRows(result);
  const warningRows = rows.filter((row) => row.status === 'warning');
  const maxReconciliationGap = rows.reduce((max, row) => Math.max(max, Math.abs(row.reconciliationDelta)), 0);
  const maxCashFlowDelta = rows.reduce((max, row) => Math.max(max, Math.abs(row.cashFlowDelta)), 0);

  return {
    rowsChecked: rows.length,
    warningCount: warningRows.length,
    firstWarningYear: warningRows[0]?.year ?? null,
    maxReconciliationGap,
    maxCashFlowDelta,
    status: warningRows.length > 0 ? 'warning' : 'ok'
  };
}

export function selectPlanHealthExplainer(result: SimulationResult | null | undefined): PlanHealthExplainer {
  const rows = rowsFrom(result);
  const overview = selectOverviewMetrics(result);
  const diagnostics = selectReconciliationDiagnostics(result);
  const shortfallRow = rows.find((row) => n(row.shortfall) > RECONCILIATION_TOLERANCE);
  const depletionRow = rows.find((row) => n(row.bal_total) <= RECONCILIATION_TOLERANCE);
  const taxSummary = selectTaxSummaryMetrics(result);
  const taxPressureRows = selectTaxPressureRows(result);
  const firstPressureRow = shortfallRow || depletionRow || taxPressureRows[0];
  const fundedThroughYear = shortfallRow ? shortfallRow.year - 1 : overview.lastYear;

  const reviewCandidates = [
    {
      label: diagnostics.status === 'warning' ? 'money-in / money-out check' : '',
      amount: diagnostics.maxReconciliationGap
    },
    { label: shortfallRow ? 'first projection shortfall' : '', amount: n(shortfallRow?.shortfall) },
    { label: taxSummary.peakTaxYear ? 'peak annual tax' : '', amount: taxSummary.peakTax },
    { label: taxSummary.lifetimeOasClawback > 0 ? 'OAS clawback' : '', amount: taxSummary.lifetimeOasClawback }
  ]
    .filter((item) => item.label)
    .sort((a, b) => b.amount - a.amount);

  const status: PlanHealthExplainer['status'] =
    diagnostics.status === 'warning' ? 'blocked' : shortfallRow || depletionRow || taxPressureRows.length > 0 ? 'watch' : 'ready';

  return {
    status,
    headline:
      status === 'blocked'
        ? 'The projection needs reconciliation review before relying on this preview.'
        : status === 'watch'
          ? 'The plan runs, with review points worth testing before deciding.'
          : 'The plan funds the visible projection without reconciliation warnings.',
    fundedThroughYear,
    firstPressurePoint: firstPressureRow
      ? `${firstPressureRow.year}: ${
          shortfallRow
            ? 'spending shortfall'
            : depletionRow
              ? 'portfolio depletion'
              : (firstPressureRow as TaxPressureRow).reason
        }`
      : 'No pressure point in the preview horizon',
    largestReviewItem: reviewCandidates[0]
      ? `${reviewCandidates[0].label} (${Math.round(reviewCandidates[0].amount).toLocaleString()})`
      : 'No major review item surfaced',
    detailFallback: 'Open the detailed report for full schedules, charts, stress tests, and print/PDF.'
  };
}

export function selectSourceReconciliationStory(
  row: AnnualSimulationRow | null | undefined
): SourceReconciliationStory {
  const reconciliation = selectCashFlowReconciliation(row);
  const sourcesBeforeTax =
    reconciliation.incomeAndWithdrawals +
    reconciliation.taxFreeWithdrawals +
    reconciliation.cashWedgeFunding +
    reconciliation.otherInflows;

  return {
    year: reconciliation.year,
    headline:
      reconciliation.status === 'ok'
        ? 'First-year spending is traced from sources to taxes to funded spending.'
        : 'First-year spending does not fully reconcile to extracted sources.',
    sourcesBeforeTax,
    tax: reconciliation.tax,
    fundedSpending: reconciliation.reconciledAfterTaxSpending,
    gap: reconciliation.reconciliationDelta,
    steps: [
      { id: 'income', label: 'Taxable income and registered withdrawals', amount: reconciliation.incomeAndWithdrawals, tone: 'inflow' },
      { id: 'taxFree', label: 'TFSA and non-registered withdrawals', amount: reconciliation.taxFreeWithdrawals, tone: 'inflow' },
      { id: 'cash', label: 'Cash wedge funding', amount: reconciliation.cashWedgeFunding, tone: 'inflow' },
      { id: 'other', label: 'Other inflows', amount: reconciliation.otherInflows, tone: 'inflow' },
      { id: 'tax', label: 'Tax', amount: -reconciliation.tax, tone: 'outflow' },
      { id: 'funded', label: 'After-tax spending funded', amount: reconciliation.reconciledAfterTaxSpending, tone: 'result' },
      { id: 'gap', label: 'Reconciliation gap', amount: reconciliation.reconciliationDelta, tone: reconciliation.status === 'ok' ? 'result' : 'watch' }
    ]
  };
}

export function selectDecisionChecklist(
  result: SimulationResult | null | undefined,
  plan: V2PlanPayload | null | undefined
): DecisionChecklistItem[] {
  const diagnostics = selectReconciliationDiagnostics(result);
  const taxSummary = selectTaxSummaryMetrics(result);
  const taxPressureRows = selectTaxPressureRows(result);
  const rows = rowsFrom(result);
  const firstShortfall = rows.find((row) => n(row.shortfall) > RECONCILIATION_TOLERANCE);
  const firstCashDraw = rows.find((row) => n(row.cash_draw) > 0);
  const couple = Boolean(plan && !personLooksBlank(plan.p2));
  const estateTarget = n(plan?.inheritance);
  const hasCppOrOas = Boolean(
    plan && (n(plan.p1.cpp65_monthly) || n(plan.p1.cpp70_monthly) || n(plan.p1.oas_monthly) || n(plan.p2.cpp65_monthly) || n(plan.p2.oas_monthly))
  );

  return [
    {
      id: 'sourceReconciliation',
      label: 'Money-in / money-out check',
      status: diagnostics.status === 'ok' ? 'ok' : 'watch',
      reason: diagnostics.status === 'ok' ? 'All extracted annual rows reconcile within tolerance.' : 'At least one annual row has a funding gap.',
      detail: diagnostics.firstWarningYear ? `First warning year: ${diagnostics.firstWarningYear}.` : 'Use this as the first trust check.'
    },
    {
      id: 'cppOasTiming',
      label: 'CPP/OAS timing',
      status: hasCppOrOas ? 'review' : 'watch',
      reason: hasCppOrOas ? 'Benefits are present and timing should be tested as a decision lever.' : 'CPP/OAS estimates are missing or zero.',
      detail: 'Compare 65 versus 70 before treating the baseline as final.'
    },
    {
      id: 'cashWedge',
      label: 'Cash wedge',
      status: firstCashDraw ? 'review' : 'ok',
      reason: firstCashDraw ? `Cash wedge starts funding spending in ${firstCashDraw.year}.` : 'No cash wedge draw appears in the extracted rows.',
      detail: plan?.cashWedge?.targetYears ? `Target: ${plan.cashWedge.targetYears} years.` : 'Target years are not set.'
    },
    {
      id: 'oasClawback',
      label: 'OAS clawback',
      status: taxSummary.lifetimeOasClawback > OAS_CLAWBACK_WATCH_THRESHOLD ? 'review' : 'ok',
      reason:
        taxSummary.lifetimeOasClawback > OAS_CLAWBACK_WATCH_THRESHOLD
          ? 'The projection contains OAS recovery tax.'
          : 'No material OAS clawback is visible in this preview.',
      detail: `Lifetime clawback: ${Math.round(taxSummary.lifetimeOasClawback).toLocaleString()}.`
    },
    {
      id: 'registeredTaxSpike',
      label: 'Registered tax spike',
      status: taxPressureRows.some((row) => row.registeredWithdrawals > 0) ? 'review' : 'ok',
      reason: taxPressureRows[0] ? `Tax pressure first appears in ${taxPressureRows[0].year}.` : 'No major tax pressure year was detected.',
      detail: taxSummary.peakTaxYear ? `Peak tax year: ${taxSummary.peakTaxYear}.` : 'No peak tax year available.'
    },
    {
      id: 'survivorRisk',
      label: 'Survivor risk',
      status: couple ? 'review' : 'ok',
      reason: couple ? 'Two-person plans should test income and tax after the first death.' : 'Single-person plan; survivor view is not applicable.',
      detail: plan?.assumptions?.p1DiesInSurvivor ? `Survivor year set to ${plan.assumptions.p1DiesInSurvivor}.` : 'No survivor year is set.'
    },
    {
      id: 'estateTarget',
      label: 'Estate target',
      status: firstShortfall ? 'watch' : estateTarget > 0 ? 'review' : 'ok',
      reason: firstShortfall ? 'Shortfalls should be reviewed before preserving estate targets.' : estateTarget > 0 ? 'An estate target is part of the plan.' : 'No estate target entered.',
      detail: estateTarget > 0 ? `Target: ${Math.round(estateTarget).toLocaleString()}.` : 'Estate target is optional.'
    }
  ];
}

export function selectDecisionDetailRows(
  result: SimulationResult | null | undefined,
  plan: V2PlanPayload | null | undefined
): DecisionDetailRow[] {
  const checklist = selectDecisionChecklist(result, plan);
  const diagnostics = selectReconciliationDiagnostics(result);
  const taxSummary = selectTaxSummaryMetrics(result);
  const taxPressureRows = selectTaxPressureRows(result);
  const rows = rowsFrom(result);
  const firstCashDraw = rows.find((row) => n(row.cash_draw) > 0);
  const firstShortfall = rows.find((row) => n(row.shortfall) > RECONCILIATION_TOLERANCE);
  const firstTaxPressure = taxPressureRows[0];
  const couple = Boolean(plan && !personLooksBlank(plan.p2));

  return checklist.map((item) => {
    switch (item.id) {
      case 'sourceReconciliation':
        return {
          ...item,
          evidence:
            diagnostics.status === 'ok'
              ? `${diagnostics.rowsChecked} rows checked with no funding gaps.`
              : `${diagnostics.warningCount} warnings; max gap ${Math.round(diagnostics.maxReconciliationGap).toLocaleString()}.`,
          years: diagnostics.firstWarningYear ? String(diagnostics.firstWarningYear) : 'All preview years',
          fallbackArea: 'cashFlow'
        };
      case 'cppOasTiming':
        return {
          ...item,
          evidence: 'The scenario cards compare current timing against age 70 benefits where estimates exist.',
          years: 'Benefit start years',
          fallbackArea: 'incomeSources'
        };
      case 'cashWedge':
        return {
          ...item,
          evidence: firstCashDraw
            ? `First cash wedge draw is ${Math.round(n(firstCashDraw.cash_draw)).toLocaleString()} in ${firstCashDraw.year}.`
            : 'No cash wedge draw appears in the extracted projection.',
          years: firstCashDraw ? String(firstCashDraw.year) : '-',
          fallbackArea: 'cashFlow'
        };
      case 'oasClawback':
        return {
          ...item,
          evidence: `Lifetime OAS clawback is ${Math.round(taxSummary.lifetimeOasClawback).toLocaleString()}.`,
          years: taxPressureRows.filter((row) => row.oasClawback > OAS_CLAWBACK_WATCH_THRESHOLD).map((row) => row.year).join(', ') || '-',
          fallbackArea: 'taxes'
        };
      case 'registeredTaxSpike':
        return {
          ...item,
          evidence: firstTaxPressure
            ? `${firstTaxPressure.reason} in ${firstTaxPressure.year}; tax ${Math.round(firstTaxPressure.tax).toLocaleString()}.`
            : 'No major tax pressure year was detected.',
          years: taxPressureRows.map((row) => row.year).join(', ') || '-',
          fallbackArea: 'taxes'
        };
      case 'survivorRisk':
        return {
          ...item,
          evidence: couple ? 'Two-person household; survivor resilience should be compared against baseline.' : 'Single-person plan.',
          years: plan?.assumptions?.p1DiesInSurvivor ? String(plan.assumptions.p1DiesInSurvivor) : '-',
          fallbackArea: 'stressTests'
        };
      case 'estateTarget':
        return {
          ...item,
          evidence: firstShortfall
            ? `First shortfall appears in ${firstShortfall.year}.`
            : `Estate target ${Math.round(n(plan?.inheritance)).toLocaleString()}.`,
          years: firstShortfall ? String(firstShortfall.year) : 'Final projection year',
          fallbackArea: 'accounts'
        };
      default:
        return { ...item, evidence: item.reason, years: '-', fallbackArea: 'overview' };
    }
  });
}

export function selectTaxPressureRows(result: SimulationResult | null | undefined): TaxPressureRow[] {
  const rows = rowsFrom(result);
  if (rows.length === 0) return [];
  const taxRows = rows.map((row) => ({
    row,
    tax: n(row.totalTaxYear),
    taxableIncome: n(row.taxableIncome),
    oasClawback: n(row.totalOasClawY),
    registeredWithdrawals: n(row.rrif_draw_f) + n(row.rrif_draw_m) + n(row.lif_draw)
  }));
  const peakTax = taxRows.reduce((max, row) => Math.max(max, row.tax), 0);
  const peakTaxableIncome = taxRows.reduce((max, row) => Math.max(max, row.taxableIncome), 0);

  return taxRows
    .filter((item) => {
      if (item.oasClawback > OAS_CLAWBACK_WATCH_THRESHOLD) return true;
      if (peakTax > 0 && item.tax >= peakTax * 0.9 && item.tax > 1000) return true;
      if (peakTaxableIncome > 0 && item.taxableIncome >= peakTaxableIncome * 0.9 && item.taxableIncome > 10000) return true;
      return item.registeredWithdrawals > 0 && item.tax > 0 && item.tax >= peakTax * 0.75;
    })
    .slice(0, 8)
    .map((item) => {
      const pressure: TaxPressureRow['pressure'] =
        item.oasClawback > OAS_CLAWBACK_WATCH_THRESHOLD || (peakTax > 0 && item.tax >= peakTax * 0.95)
          ? 'high'
          : item.tax >= peakTax * 0.8
            ? 'medium'
            : 'low';
      return {
        year: item.row.year,
        taxableIncome: item.taxableIncome,
        tax: item.tax,
        oasClawback: item.oasClawback,
        registeredWithdrawals: item.registeredWithdrawals,
        pressure,
        reason:
          item.oasClawback > OAS_CLAWBACK_WATCH_THRESHOLD
            ? 'OAS clawback'
            : item.registeredWithdrawals > 0
              ? 'registered withdrawals and tax'
              : 'peak taxable income'
      };
    });
}

export function selectTaxPressureExplanation(result: SimulationResult | null | undefined): TaxPressureExplanation {
  const rows = selectTaxPressureRows(result);
  return {
    headline:
      rows.length > 0
        ? 'Tax pressure is driven by peak taxable income, registered withdrawals, or OAS clawback.'
        : 'No major tax pressure years were detected in the preview.',
    rows: rows.map((row) => ({
      ...row,
      explanation:
        row.oasClawback > OAS_CLAWBACK_WATCH_THRESHOLD
          ? 'OAS recovery tax is active in this year, so taxable income is high enough to reduce benefits.'
          : row.registeredWithdrawals > 0
            ? 'Registered withdrawals are contributing to taxable income and annual tax.'
            : 'This year is near the projection peak for taxable income or tax.'
    }))
  };
}

export function selectTaxReviewRows(result: SimulationResult | null | undefined): TaxReviewRow[] {
  const rows = rowsFrom(result);
  const taxSummary = selectTaxSummaryMetrics(result);
  const detailRows = selectTaxDetailRows(result);
  const oasRows = detailRows.filter((row) => row.oasClawback > OAS_CLAWBACK_WATCH_THRESHOLD);
  const registeredRows = rows
    .map((row) => ({
      year: row.year,
      registeredWithdrawals: n(row.rrif_draw_f) + n(row.rrif_draw_m) + n(row.lif_draw),
      tax: n(row.totalTaxYear)
    }))
    .filter((row) => row.registeredWithdrawals > 0);
  const largestRegistered = registeredRows.reduce<(typeof registeredRows)[number] | null>((largest, row) => {
    if (!largest || row.registeredWithdrawals > largest.registeredWithdrawals) return row;
    return largest;
  }, null);
  const lowTaxRows = detailRows.filter((row) => row.tax <= Math.max(taxSummary.peakTax * 0.35, 1000));
  const firstLowTax = lowTaxRows[0];

  return [
    {
      id: 'oasClawback',
      label: 'OAS clawback',
      severity: oasRows.length > 0 ? 'watch' : 'ok',
      year: oasRows[0]?.year ?? null,
      value: oasRows.length > 0 ? `$${Math.round(taxSummary.lifetimeOasClawback).toLocaleString()}` : 'None',
      explanation:
        oasRows.length > 0
          ? `OAS recovery tax appears in ${oasRows.length} year${oasRows.length === 1 ? '' : 's'}.`
          : 'No OAS clawback is visible in the baseline projection.',
      reviewAction: oasRows.length > 0 ? 'Review benefit timing, taxable income, and registered withdrawals around these years.' : 'No OAS clawback review item surfaced.'
    },
    {
      id: 'registeredWithdrawals',
      label: 'Registered withdrawal pressure',
      severity: largestRegistered && largestRegistered.tax > 0 ? 'review' : 'ok',
      year: largestRegistered?.year ?? null,
      value: largestRegistered ? `$${Math.round(largestRegistered.registeredWithdrawals).toLocaleString()}` : 'None',
      explanation: largestRegistered
        ? `Largest registered withdrawal appears in ${largestRegistered.year}.`
        : 'No registered withdrawals are visible in the baseline projection.',
      reviewAction: largestRegistered ? 'Review RRSP/RRIF/LIF draw timing and taxable-income spikes.' : 'No registered-withdrawal tax item surfaced.'
    },
    {
      id: 'peakTax',
      label: 'Peak tax year',
      severity: taxSummary.peakTax > taxSummary.firstYearTax * 1.25 && taxSummary.peakTax > 1000 ? 'review' : 'ok',
      year: taxSummary.peakTaxYear,
      value: `$${Math.round(taxSummary.peakTax).toLocaleString()}`,
      explanation: taxSummary.peakTaxYear
        ? `The highest annual tax in the visible projection is in ${taxSummary.peakTaxYear}.`
        : 'No peak tax year is available yet.',
      reviewAction: 'Compare this year against Annual Detail, income sources, and registered withdrawals.'
    },
    {
      id: 'planningWindow',
      label: 'Lower-tax planning window',
      severity: firstLowTax ? 'review' : 'ok',
      year: firstLowTax?.year ?? null,
      value: firstLowTax ? `$${Math.round(firstLowTax.tax).toLocaleString()}` : 'None',
      explanation: firstLowTax
        ? `Lower-tax years may be useful to review before larger taxable withdrawals begin.`
        : 'No clear lower-tax window was detected in the visible projection.',
      reviewAction: firstLowTax ? 'Review whether income timing or registered draws should be tested in this window.' : 'No lower-tax window review item surfaced.'
    }
  ];
}

export function selectTaxStorySummary(result: SimulationResult | null | undefined): TaxStorySummary {
  const tax = selectTaxSummaryMetrics(result);
  const reviewRows = selectTaxReviewRows(result);
  const rows = rowsFrom(result);
  const registeredWithdrawalYears = rows.filter((row) => n(row.rrif_draw_f) + n(row.rrif_draw_m) + n(row.lif_draw) > 0).length;
  const watchCount = reviewRows.filter((row) => row.severity === 'watch').length;
  const reviewCount = reviewRows.filter((row) => row.severity === 'review').length;
  const status: TaxStorySummary['status'] = watchCount > 0 ? 'watch' : reviewCount > 0 ? 'review' : 'ok';
  const planningWindowYears = reviewRows.find((row) => row.id === 'planningWindow')?.year;

  return {
    status,
    headline:
      status === 'watch'
        ? 'The projection has tax pressure that should be reviewed before relying on the plan.'
        : status === 'review'
          ? 'The projection has tax timing items worth reviewing.'
          : 'No major tax pressure item appears in the baseline projection.',
    detail:
      status === 'ok'
        ? 'Use this as the first tax read, then open the detailed report for complete schedules.'
        : `Review ${watchCount + reviewCount} tax item${watchCount + reviewCount === 1 ? '' : 's'} before treating the tax path as settled.`,
    firstYearTax: tax.firstYearTax,
    peakTaxYear: tax.peakTaxYear,
    peakTax: tax.peakTax,
    lifetimeTax: tax.lifetimeTax,
    lifetimeOasClawback: tax.lifetimeOasClawback,
    registeredWithdrawalYears,
    planningWindowYears: planningWindowYears ? String(planningWindowYears) : 'None detected',
    stableDashboardHandoff: 'Complete tax schedules and deeper review views remain in the detailed report.'
  };
}

export function selectScenarioCards(
  result: SimulationResult | null | undefined,
  plan: V2PlanPayload | null | undefined,
  comparisons: Partial<Record<ScenarioCard['id'], SimulationResult | null | undefined>> = {}
): ScenarioCard[] {
  const overview = selectOverviewMetrics(result);
  const retireYear = n(plan?.assumptions?.retireYear) || n(plan?.p1?.retireYear);
  const gogoSpending = n(plan?.spending?.gogo);
  const hasBenefitTiming = Boolean(
    plan && (n(plan.p1.cpp65_monthly) || n(plan.p1.cpp70_monthly) || n(plan.p1.oas_monthly) || n(plan.p2.cpp65_monthly) || n(plan.p2.oas_monthly))
  );

  return [
    {
      id: 'retireLater',
      label: 'Retire two years later',
      status: retireYear ? 'ready' : 'needsInput',
      lever: retireYear ? `${retireYear} to ${retireYear + 2}` : 'Set a retirement year',
      baseline: overview.lastYear ? `Baseline funded through ${overview.lastYear}` : 'Baseline not available',
      detail: scenarioDetail(result, comparisons.retireLater),
      ...scenarioComparison(result, comparisons.retireLater)
    },
    {
      id: 'spendLessGogo',
      label: 'Spend a little less early',
      status: gogoSpending ? 'ready' : 'needsInput',
      lever: gogoSpending ? `${Math.round(gogoSpending).toLocaleString()} to ${Math.round(gogoSpending * 0.9).toLocaleString()}` : 'Set early retirement spending',
      baseline: `End portfolio ${Math.round(overview.endPortfolio).toLocaleString()}`,
      detail: scenarioDetail(result, comparisons.spendLessGogo),
      ...scenarioComparison(result, comparisons.spendLessGogo)
    },
    {
      id: 'delayBenefits',
      label: 'Review delaying CPP/OAS to 70',
      status: hasBenefitTiming ? 'ready' : 'needsInput',
      lever: hasBenefitTiming ? 'Compare age 65 to age 70' : 'Enter CPP/OAS estimates',
      baseline: 'Current plan baseline starts CPP/OAS at 65',
      detail: scenarioDetail(result, comparisons.delayBenefits),
      ...scenarioComparison(result, comparisons.delayBenefits)
    }
  ];
}

export function selectScenarioChoiceCards(
  result: SimulationResult | null | undefined,
  plan: V2PlanPayload | null | undefined,
  comparisons: Partial<Record<ScenarioCard['id'], SimulationResult | null | undefined>> = {}
): ScenarioChoiceCard[] {
  const overview = selectOverviewMetrics(result);
  const baselineRows = rowsFrom(result);
  const baselineFirstShortfall = baselineRows.find((row) => n(row.shortfall) > RECONCILIATION_TOLERANCE);
  const baselineFundedThrough = baselineFirstShortfall ? baselineFirstShortfall.year - 1 : overview.lastYear;
  const plannedSpending = n(plan?.spending?.gogo) || overview.firstYearSpending;
  const estateTarget = n(plan?.inheritance);
  const estateHeavy =
    !baselineFirstShortfall &&
    !estateTarget &&
    overview.firstYearSpending > 0 &&
    overview.endPortfolio >= 1_000_000 &&
    overview.endPortfolio / overview.firstYearSpending >= 20;
  const technicalCards = selectScenarioCards(result, plan, comparisons);
  const comparisonRows = selectScenarioComparisonRows(result, comparisons);
  const comparisonById = new Map(comparisonRows.map((row) => [row.id, row]));
  const cardById = new Map(technicalCards.map((card) => [card.id, card]));

  const choiceForScenario = (
    id: ScenarioCard['id'],
    label: string,
    householdChoice: string,
    bestFor: string,
    tradeoff: string,
    primaryMetricLabel: string,
    primaryMetric: (row: ScenarioComparisonRow | undefined) => string
  ): ScenarioChoiceCard => {
    const card = cardById.get(id);
    const row = comparisonById.get(id);
    const status: ScenarioChoiceCard['status'] = card?.status === 'needsInput' ? 'needsInput' : row?.status === 'notAvailable' ? 'calculating' : 'ready';
    const tone: ScenarioChoiceCard['tone'] =
      status === 'needsInput'
        ? 'needsInput'
        : row?.status === 'improves'
          ? 'improves'
          : row?.status === 'worse'
            ? 'tradeoff'
            : 'current';
    return {
      id,
      label,
      status,
      tone,
      householdChoice,
      bestFor,
      tradeoff,
      primaryMetricLabel,
      primaryMetric: status === 'needsInput' ? card?.lever || 'Needs input' : primaryMetric(row),
      secondaryMetricLabel: 'Spending funded through',
      secondaryMetric: row?.fundedThroughYear ? String(row.fundedThroughYear) : status === 'calculating' ? 'Calculating' : '-',
      detail:
        status === 'needsInput'
          ? card?.lever || 'Add the missing input to test this choice.'
          : row
            ? scenarioChoiceDetail(row)
            : 'Scenario output will appear after the preview finishes calculating.'
    };
  };

  return [
    {
      id: 'currentPlan',
      label: 'Keep current plan',
      status: overview.projectionYears ? 'ready' : 'calculating',
      tone: 'current',
      householdChoice: 'Retire with the spending and timing you entered.',
      bestFor: estateHeavy
        ? 'Seeing whether the plan is already strong enough to support more lifestyle or clearer estate wishes.'
        : 'Confirming whether the plan you entered already supports the retirement you want.',
      tradeoff: estateHeavy
        ? 'This may leave more money unused than intended unless that estate outcome is deliberate.'
        : 'This depends on the current spending, tax, survivor, and market assumptions being realistic.',
      primaryMetricLabel: 'Spending funded through',
      primaryMetric: baselineFundedThrough ? String(baselineFundedThrough) : overview.projectionYears ? '-' : 'Calculating',
      secondaryMetricLabel: 'Projected money left',
      secondaryMetric: moneyText(overview.endPortfolio),
      detail: baselineFirstShortfall
        ? `First shortfall appears in ${baselineFirstShortfall.year}; compare the choices below before relying on the plan.`
        : `Early spending assumption is ${moneyText(plannedSpending)} and the baseline reaches ${baselineFundedThrough || '-'}.`
    },
    choiceForScenario(
      'spendLessGogo',
      'Spend a little less early',
      'Reduce early retirement lifestyle spending by 10%.',
      'Testing whether a modest lifestyle adjustment repairs a tight plan or preserves more cushion.',
      'This means less travel, projects, gifting, or discretionary spending in the most active years.',
      'Early spending change',
      (row) => signedMoneyText(row?.firstYearSpendingDelta)
    ),
    choiceForScenario(
      'retireLater',
      'Work two years longer',
      'Start retirement two years later where retirement years are entered.',
      'Adding cushion without lowering the retirement lifestyle target.',
      'The trade-off is time: retirement starts later even if the finances look stronger.',
      'Money left change',
      (row) => signedMoneyText(row?.endPortfolioDelta)
    ),
    choiceForScenario(
      'delayBenefits',
      'Review delaying CPP/OAS to 70',
      'Compare the current benefit timing with age-70 government benefits.',
      'Understanding whether higher later-life guaranteed income improves the household plan.',
      'The household may need to fund more spending from savings before benefits start.',
      'Money left change',
      (row) => signedMoneyText(row?.endPortfolioDelta)
    )
  ];
}

export function selectScenarioComparisonRows(
  baseline: SimulationResult | null | undefined,
  comparisons: Partial<Record<ScenarioCard['id'], SimulationResult | null | undefined>>
): ScenarioComparisonRow[] {
  const baselineOverview = selectOverviewMetrics(baseline);
  const baselineTax = selectTaxSummaryMetrics(baseline);
  const definitions: Array<{ id: ScenarioCard['id']; label: string }> = [
    { id: 'retireLater', label: 'Retire two years later' },
    { id: 'spendLessGogo', label: 'Spend a little less early' },
    { id: 'delayBenefits', label: 'Review delaying CPP/OAS to 70' }
  ];

  return definitions.map(({ id, label }) => {
    const scenario = comparisons[id];
    if (!baseline || !scenario) {
      return {
        id,
        label,
        endPortfolioDelta: 0,
        firstYearSpendingDelta: 0,
        lifetimeTaxDelta: 0,
        firstShortfallYear: null,
        fundedThroughYear: null,
        status: 'notAvailable'
      };
    }

    const scenarioOverview = selectOverviewMetrics(scenario);
    const scenarioTax = selectTaxSummaryMetrics(scenario);
    const firstShortfall = rowsFrom(scenario).find((row) => n(row.shortfall) > RECONCILIATION_TOLERANCE);
    const endPortfolioDelta = scenarioOverview.endPortfolio - baselineOverview.endPortfolio;
    const firstYearSpendingDelta = scenarioOverview.firstYearSpending - baselineOverview.firstYearSpending;
    const lifetimeTaxDelta = scenarioTax.lifetimeTax - baselineTax.lifetimeTax;
    const status: ScenarioComparisonRow['status'] =
      endPortfolioDelta > RECONCILIATION_TOLERANCE && !firstShortfall
        ? 'improves'
        : endPortfolioDelta < -RECONCILIATION_TOLERANCE || Boolean(firstShortfall)
          ? 'worse'
          : 'mixed';

    return {
      id,
      label,
      endPortfolioDelta,
      firstYearSpendingDelta,
      lifetimeTaxDelta,
      firstShortfallYear: firstShortfall?.year ?? null,
      fundedThroughYear: firstShortfall ? firstShortfall.year - 1 : scenarioOverview.lastYear,
      status
    };
  });
}

export function selectScenarioAssumptionRows(plan: V2PlanPayload | null | undefined): ScenarioAssumptionRow[] {
  const retireYear = n(plan?.assumptions?.retireYear) || n(plan?.p1?.retireYear);
  const gogoSpending = n(plan?.spending?.gogo);
  const benefitBaseline = 'CPP/OAS age 65';

  return [
    {
      id: 'retireLater',
      label: 'Retire two years later',
      baseline: retireYear ? String(retireYear) : 'Not set',
      scenario: retireYear ? String(retireYear + 2) : 'Needs retirement year',
      changed: Boolean(retireYear)
    },
    {
      id: 'spendLessGogo',
      label: 'Spend a little less early',
      baseline: gogoSpending ? `${Math.round(gogoSpending).toLocaleString()}` : 'Not set',
      scenario: gogoSpending ? `${Math.round(gogoSpending * 0.9).toLocaleString()}` : 'Needs early spending',
      changed: Boolean(gogoSpending)
    },
    {
      id: 'delayBenefits',
      label: 'Review delaying CPP/OAS to 70',
      baseline: benefitBaseline,
      scenario: 'CPP/OAS age 70',
      changed: true
    }
  ];
}

function scenarioComparison(
  baseline: SimulationResult | null | undefined,
  scenario: SimulationResult | null | undefined
): Pick<ScenarioCard, 'endPortfolioDelta' | 'fundedThroughYear'> {
  if (!baseline || !scenario) return {};
  const baselineEnd = n(baseline.years[baseline.years.length - 1]?.bal_total);
  const scenarioOverview = selectOverviewMetrics(scenario);
  const firstShortfall = rowsFrom(scenario).find((row) => n(row.shortfall) > RECONCILIATION_TOLERANCE);
  return {
    endPortfolioDelta: scenarioOverview.endPortfolio - baselineEnd,
    fundedThroughYear: firstShortfall ? firstShortfall.year - 1 : scenarioOverview.lastYear
  };
}

function scenarioDetail(
  baseline: SimulationResult | null | undefined,
  scenario: SimulationResult | null | undefined
): string {
  if (!baseline || !scenario) return 'Computed scenario preview will appear when the baseline preview is available.';
  const comparison = scenarioComparison(baseline, scenario);
  return `Computed preview: end portfolio ${comparison.endPortfolioDelta && comparison.endPortfolioDelta >= 0 ? '+' : ''}${Math.round(
    comparison.endPortfolioDelta || 0
  ).toLocaleString()}, funded through ${comparison.fundedThroughYear || '-'}.`;
}

function scenarioChoiceDetail(row: ScenarioComparisonRow): string {
  if (row.status === 'notAvailable') return 'Scenario output has not been calculated yet.';
  const funding = row.firstShortfallYear ? `first shortfall in ${row.firstShortfallYear}` : `funded through ${row.fundedThroughYear || '-'}`;
  const estate = `money left changes by ${signedMoneyText(row.endPortfolioDelta)}`;
  const tax = row.lifetimeTaxDelta ? `lifetime tax changes by ${signedMoneyText(row.lifetimeTaxDelta)}` : 'lifetime tax is roughly unchanged';
  return `${funding}; ${estate}; ${tax}.`;
}

export function selectSurvivorViewSummary(
  result: SimulationResult | null | undefined,
  plan: V2PlanPayload | null | undefined
): SurvivorViewSummary {
  if (!plan || personLooksBlank(plan.p2)) {
    return {
      status: 'single',
      headline: 'Survivor view is not needed for this single-person plan.',
      survivorYear: null,
      incomeAtRisk: 0,
      detail: 'Single plans still use the detailed report for full result detail.'
    };
  }

  const survivorYear = n(plan.assumptions.p1DiesInSurvivor) || null;
  const rows = rowsFrom(result);
  const referenceRow = rows.find((row) => row.year === survivorYear) || rows[0];
  const p1Income = n(referenceRow?.salary_f) + n(referenceRow?.dbPension) + n(referenceRow?.cpp_f) + n(referenceRow?.oas_f);

  return {
    status: survivorYear ? 'ready' : 'needsInput',
    headline: survivorYear
      ? 'Survivor view has a starting year and should be compared against baseline funding.'
      : 'Set a survivor year to test household resilience after first death.',
    survivorYear,
    incomeAtRisk: p1Income,
    detail: survivorYear
      ? `Approximate Person 1 income visible in ${survivorYear}: ${Math.round(p1Income).toLocaleString()}.`
      : 'Future slice should compare survivor income, taxes, portfolio path, and spending funded.'
  };
}

export function selectSurvivorComparison(
  baseline: SimulationResult | null | undefined,
  survivor: SimulationResult | null | undefined,
  plan: V2PlanPayload | null | undefined
): SurvivorComparison {
  if (!plan || personLooksBlank(plan.p2)) {
    return {
      status: 'single',
      survivorYear: null,
      baselineEndPortfolio: 0,
      survivorEndPortfolio: 0,
      endPortfolioDelta: 0,
      baselineLifetimeTax: 0,
      survivorLifetimeTax: 0,
      lifetimeTaxDelta: 0,
      firstShortfallYear: null,
      fundedThroughYear: null,
      spendingFundedYears: '-'
    };
  }

  const survivorYear = n(plan.assumptions.p1DiesInSurvivor) || null;
  if (!survivorYear) {
    return {
      status: 'needsInput',
      survivorYear: null,
      baselineEndPortfolio: n(baseline?.years[baseline.years.length - 1]?.bal_total),
      survivorEndPortfolio: 0,
      endPortfolioDelta: 0,
      baselineLifetimeTax: selectTaxSummaryMetrics(baseline).lifetimeTax,
      survivorLifetimeTax: 0,
      lifetimeTaxDelta: 0,
      firstShortfallYear: null,
      fundedThroughYear: null,
      spendingFundedYears: '-'
    };
  }

  if (!baseline || !survivor) {
    return {
      status: 'notAvailable',
      survivorYear,
      baselineEndPortfolio: 0,
      survivorEndPortfolio: 0,
      endPortfolioDelta: 0,
      baselineLifetimeTax: 0,
      survivorLifetimeTax: 0,
      lifetimeTaxDelta: 0,
      firstShortfallYear: null,
      fundedThroughYear: null,
      spendingFundedYears: '-'
    };
  }

  const baselineTax = selectTaxSummaryMetrics(baseline);
  const survivorTax = selectTaxSummaryMetrics(survivor);
  const baselineEndPortfolio = n(baseline.years[baseline.years.length - 1]?.bal_total);
  const survivorEndPortfolio = n(survivor.years[survivor.years.length - 1]?.bal_total);
  const survivorRows = rowsFrom(survivor);
  const firstShortfall = survivorRows.find((row) => n(row.shortfall) > RECONCILIATION_TOLERANCE);
  const fundedYears = survivorRows.filter((row) => n(row.shortfall) <= RECONCILIATION_TOLERANCE).length;

  return {
    status: 'ready',
    survivorYear,
    baselineEndPortfolio,
    survivorEndPortfolio,
    endPortfolioDelta: survivorEndPortfolio - baselineEndPortfolio,
    baselineLifetimeTax: baselineTax.lifetimeTax,
    survivorLifetimeTax: survivorTax.lifetimeTax,
    lifetimeTaxDelta: survivorTax.lifetimeTax - baselineTax.lifetimeTax,
    firstShortfallYear: firstShortfall?.year ?? null,
    fundedThroughYear: firstShortfall ? firstShortfall.year - 1 : survivorRows[survivorRows.length - 1]?.year ?? null,
    spendingFundedYears: `${fundedYears}/${survivorRows.length || 0}`
  };
}

export function selectSurvivorStorySummary(
  baseline: SimulationResult | null | undefined,
  survivor: SimulationResult | null | undefined,
  plan: V2PlanPayload | null | undefined
): SurvivorStorySummary {
  const summary = selectSurvivorViewSummary(baseline, plan);
  const comparison = selectSurvivorComparison(baseline, survivor, plan);
  const stableDashboardHandoff =
    'Full survivor audit schedules, printable charts, print/PDF, and report-style review remain in the detailed report.';

  if (comparison.status === 'single') {
    return {
      status: 'single',
      headline: 'Household resilience is not needed for this single-person plan.',
      detail: 'The planner preview keeps this tab calm for single plans while the detailed report remains available for full result review.',
      survivorYear: null,
      readiness: 'Not applicable',
      incomeAtRisk: 0,
      firstShortfallYear: null,
      fundedThroughYear: null,
      baselineEndPortfolio: 0,
      survivorEndPortfolio: 0,
      endPortfolioDelta: 0,
      lifetimeTaxDelta: 0,
      spendingFundedYears: '-',
      stableDashboardHandoff
    };
  }

  if (comparison.status === 'needsInput') {
    return {
      status: 'needsInput',
      headline: 'Set a survivor year to compare household resilience.',
      detail: 'A two-person plan needs a first-death year before the survivor preview can compare income, tax, funding, and portfolio outcomes.',
      survivorYear: null,
      readiness: 'Needs survivor year',
      incomeAtRisk: summary.incomeAtRisk,
      firstShortfallYear: null,
      fundedThroughYear: null,
      baselineEndPortfolio: comparison.baselineEndPortfolio,
      survivorEndPortfolio: 0,
      endPortfolioDelta: 0,
      lifetimeTaxDelta: 0,
      spendingFundedYears: '-',
      stableDashboardHandoff
    };
  }

  if (comparison.status === 'notAvailable') {
    return {
      status: 'notAvailable',
      headline: 'Survivor comparison is waiting for the preview rerun.',
      detail: 'The survivor year is set, but the survivor result is not available yet. Keep the detailed report as the complete fallback.',
      survivorYear: comparison.survivorYear,
      readiness: 'Calculating',
      incomeAtRisk: summary.incomeAtRisk,
      firstShortfallYear: null,
      fundedThroughYear: null,
      baselineEndPortfolio: 0,
      survivorEndPortfolio: 0,
      endPortfolioDelta: 0,
      lifetimeTaxDelta: 0,
      spendingFundedYears: '-',
      stableDashboardHandoff
    };
  }

  const status: StressSeverity = comparison.firstShortfallYear
    ? 'watch'
    : comparison.endPortfolioDelta < -RECONCILIATION_TOLERANCE
      ? 'review'
      : 'ok';

  return {
    status,
    headline:
      status === 'watch'
        ? 'The survivor preview has funding pressure to review.'
        : status === 'review'
          ? 'The survivor preview is funded, with portfolio trade-offs to review.'
          : 'The survivor preview stays funded in the visible years.',
    detail:
      status === 'ok'
        ? 'Use this as a first-pass household-resilience read before opening full survivor detail in the detailed report.'
        : 'Review the rows below before treating the two-person plan as durable.',
    survivorYear: comparison.survivorYear,
    readiness: 'Ready',
    incomeAtRisk: summary.incomeAtRisk,
    firstShortfallYear: comparison.firstShortfallYear,
    fundedThroughYear: comparison.fundedThroughYear,
    baselineEndPortfolio: comparison.baselineEndPortfolio,
    survivorEndPortfolio: comparison.survivorEndPortfolio,
    endPortfolioDelta: comparison.endPortfolioDelta,
    lifetimeTaxDelta: comparison.lifetimeTaxDelta,
    spendingFundedYears: comparison.spendingFundedYears,
    stableDashboardHandoff
  };
}

export function selectSurvivorReviewRows(
  baseline: SimulationResult | null | undefined,
  survivor: SimulationResult | null | undefined,
  plan: V2PlanPayload | null | undefined
): SurvivorReviewRow[] {
  const summary = selectSurvivorStorySummary(baseline, survivor, plan);
  const comparison = selectSurvivorComparison(baseline, survivor, plan);
  const baselineRows = rowsFrom(baseline);
  const survivorRows = rowsFrom(survivor);
  const survivorYear = comparison.survivorYear || summary.survivorYear;
  const baselineReference = baselineRows.find((row) => row.year === survivorYear) || baselineRows[0];
  const survivorReference = survivorRows.find((row) => row.year === survivorYear) || survivorRows[0];
  const baselineFunding = selectCashFlowReconciliation(baselineReference).reconciledAfterTaxSpending;
  const survivorFunding = selectCashFlowReconciliation(survivorReference).reconciledAfterTaxSpending;
  const fundingDelta = survivorFunding - baselineFunding;
  const firstSurvivorShortfall = survivorRows.find((row) => n(row.shortfall) > RECONCILIATION_TOLERANCE);
  const survivorLowestPortfolio = survivorRows.reduce<AnnualSimulationRow | null>((lowest, row) => {
    if (!lowest || n(row.bal_total) < n(lowest.bal_total)) return row;
    return lowest;
  }, null);
  const survivorTerminalPortfolio = comparison.survivorEndPortfolio;
  const taxSeverity: StressSeverity =
    comparison.status === 'ready' && comparison.lifetimeTaxDelta > RECONCILIATION_TOLERANCE ? 'review' : 'ok';
  const portfolioSeverity: StressSeverity =
    comparison.status === 'ready' && (survivorTerminalPortfolio <= RECONCILIATION_TOLERANCE || firstSurvivorShortfall)
      ? 'watch'
      : comparison.status === 'ready' && comparison.endPortfolioDelta < -RECONCILIATION_TOLERANCE
        ? 'review'
        : 'ok';

  return [
    {
      id: 'setup',
      label: 'Survivor setup',
      severity: comparison.status === 'needsInput' || comparison.status === 'notAvailable' ? 'watch' : 'ok',
      value: summary.readiness,
      explanation:
        comparison.status === 'single'
          ? 'Single-person plan; no survivor year is needed.'
          : comparison.status === 'needsInput'
            ? 'A survivor year is required before the survivor impact rerun can be compared.'
            : comparison.status === 'notAvailable'
              ? 'The survivor year is set, but the survivor rerun is not available yet.'
              : `Survivor comparison uses ${comparison.survivorYear}.`,
      reviewAction: comparison.status === 'needsInput' ? 'Set the survivor year in Assumptions.' : 'Confirm the scenario setup and pension statement details before relying on the comparison.',
      detailArea: 'assumptions'
    },
    {
      id: 'incomeChange',
      label: 'Income at risk',
      severity: summary.incomeAtRisk > RECONCILIATION_TOLERANCE && comparison.status !== 'single' ? 'review' : 'ok',
      value: moneyText(summary.incomeAtRisk),
      explanation:
        summary.incomeAtRisk > RECONCILIATION_TOLERANCE
          ? `Approximate Person 1 income visible around the survivor year is ${moneyText(summary.incomeAtRisk)}. DB pensions may continue at 50%, 60%, 100%, or a statement-specific spouse amount.`
          : 'No Person 1 income-at-risk estimate is visible from the current preview rows.',
      reviewAction: 'Review income sources and confirm DB survivor continuation against the pension statement.',
      detailArea: 'incomeSources'
    },
    {
      id: 'spendingFunding',
      label: 'Survivor funding',
      severity: firstSurvivorShortfall ? 'watch' : comparison.status === 'ready' ? 'ok' : 'review',
      value: comparison.status === 'ready' ? comparison.spendingFundedYears : '-',
      explanation:
        comparison.status === 'ready'
          ? firstSurvivorShortfall
            ? `First survivor shortfall appears in ${firstSurvivorShortfall.year}.`
            : `Survivor spending remains funded through ${comparison.fundedThroughYear || '-'}.`
          : 'Funding comparison appears after the survivor preview is ready.',
      reviewAction: firstSurvivorShortfall ? 'Review Annual Detail around the first shortfall year.' : 'Use Annual Detail to inspect the survivor-year neighborhood.',
      detailArea: 'annualDetail'
    },
    {
      id: 'portfolioCushion',
      label: 'Portfolio cushion',
      severity: portfolioSeverity,
      value: comparison.status === 'ready' ? signedMoneyText(comparison.endPortfolioDelta) : '-',
      explanation:
        comparison.status === 'ready'
          ? `Survivor ending portfolio is ${moneyText(comparison.survivorEndPortfolio)}; lowest visible survivor portfolio is ${moneyText(n(survivorLowestPortfolio?.bal_total))}.`
          : 'Portfolio comparison appears after the survivor preview is ready.',
      reviewAction: portfolioSeverity === 'ok' ? 'Review Accounts for the balance path.' : 'Review Accounts and Stress Tests before relying on the survivor path.',
      detailArea: 'accounts'
    },
    {
      id: 'lifetimeTax',
      label: 'Lifetime tax change',
      severity: taxSeverity,
      value: comparison.status === 'ready' ? signedMoneyText(comparison.lifetimeTaxDelta) : '-',
      explanation:
        comparison.status === 'ready'
          ? `Baseline lifetime tax ${moneyText(comparison.baselineLifetimeTax)}, survivor lifetime tax ${moneyText(comparison.survivorLifetimeTax)}.`
          : 'Tax comparison appears after the survivor preview is ready.',
      reviewAction: taxSeverity === 'review' ? 'Review Taxes for survivor-year and later tax pressure.' : 'Use Taxes for year-by-year survivor context if needed.',
      detailArea: 'taxes'
    },
    {
      id: 'stressFollowup',
      label: 'Stress follow-up',
      severity: firstSurvivorShortfall || portfolioSeverity === 'watch' ? 'watch' : comparison.status === 'ready' ? 'ok' : 'review',
      value: comparison.firstShortfallYear ? String(comparison.firstShortfallYear) : comparison.status === 'ready' ? 'No shortfall' : summary.readiness,
      explanation:
        comparison.status === 'ready'
          ? `Survivor funding delta near the scenario year is ${signedMoneyText(fundingDelta)} after tax.`
          : 'Use the detailed report if the planner cannot calculate the survivor rerun.',
      reviewAction: 'Use Stress Tests for first-pass fragility context and the detailed report for full survivor stress surfaces.',
      detailArea: 'stressTests'
    }
  ];
}

export function selectRecommendedPath(
  baseline: SimulationResult | null | undefined,
  comparisons: Partial<Record<ScenarioCard['id'], SimulationResult | null | undefined>>,
  survivor: SimulationResult | null | undefined,
  plan: V2PlanPayload | null | undefined,
  validation: RecommendationValidation = null
): RecommendedPathSummary {
  const baselineOverview = selectOverviewMetrics(baseline);
  const baselineTax = selectTaxSummaryMetrics(baseline);
  const survivorComparison = selectSurvivorComparison(baseline, survivor, plan);
  const scenarioDefinitions: Array<{ id: RecommendedCandidateId; label: string; result: SimulationResult | null | undefined }> = [
    { id: 'baseline', label: 'Current plan', result: baseline },
    { id: 'retireLater', label: 'Work two years longer', result: comparisons.retireLater },
    { id: 'spendLessGogo', label: 'Spend a little less early', result: comparisons.spendLessGogo },
    { id: 'delayBenefits', label: 'Review delaying CPP/OAS to 70', result: comparisons.delayBenefits }
  ];

  const validationBlocked = validation?.canGenerate === false || Boolean(validation?.blockers && validation.blockers.length > 0);
  const candidateRows = scenarioDefinitions.map(({ id, label, result }) =>
    selectRecommendedCandidateRow(id, label, result, baselineOverview, baselineTax, validationBlocked, survivorComparison)
  );
  const eligibleRows = candidateRows.filter((row) => !row.blocked);
  const baselineRow = eligibleRows.find((row) => row.id === 'baseline') || null;
  const baselineEstateHeavy =
    baselineRow &&
    !baselineRow.firstShortfallYear &&
    !n(plan?.inheritance) &&
    baselineOverview.firstYearSpending > 0 &&
    baselineOverview.endPortfolio >= 1_000_000 &&
    baselineOverview.endPortfolio / baselineOverview.firstYearSpending >= 20;
  const recommended =
    baselineEstateHeavy && baselineRow ? baselineRow : eligibleRows.length > 0 ? [...eligibleRows].sort(compareRecommendedCandidates)[0] : null;
  const rowsWithRecommendation: RecommendedCandidateRow[] = candidateRows.map((row) => {
    const reviewStatus: RecommendedCandidateRow['reviewStatus'] = row.blocked
      ? 'blocked'
      : recommended && row.id === recommended.id
        ? 'recommended'
        : 'review';
    return {
      ...row,
      recommended: Boolean(recommended && row.id === recommended.id),
      reviewStatus
    };
  });

  const recommendedRow = rowsWithRecommendation.find((row) => row.recommended) || null;
  const recommendedResult = scenarioDefinitions.find((definition) => definition.id === recommendedRow?.id)?.result || null;
  const stressContext = selectRecommendedStressContext(recommendedRow, recommendedResult, survivorComparison);
  const breakRisks = selectRecommendedBreakRisks(recommendedRow, stressContext, rowsWithRecommendation, survivorComparison);
  const confidence = selectRecommendedConfidence(recommendedRow, stressContext, breakRisks);
  const riskDetails = selectRecommendedRiskDetails(
    baseline,
    comparisons,
    survivor,
    plan,
    recommendedRow,
    recommendedResult,
    breakRisks,
    confidence,
    survivorComparison
  );
  const checklistItems = selectRecommendedChecklistItems(
    recommendedRow,
    breakRisks,
    confidence,
    stressContext,
    survivorComparison,
    validationBlocked
  );
  const recommendationReasons = recommendedRow ? recommendedReasonCopy(recommendedRow) : [];
  const whyNotRows = rowsWithRecommendation
    .filter((row) => !row.recommended)
    .map((row) => ({
      id: row.id,
      label: row.label,
      reason: whyNotReason(row, recommendedRow)
    }));

  return {
    recommendedCandidateId: recommendedRow?.id ?? null,
    recommendedLabel: recommendedRow?.label ?? 'No plan to review yet',
    headline: recommendedRow
      ? baselineEstateHeavy
        ? 'The current plan is strongly funded; review lifestyle and estate intent before cutting spending.'
        : `${recommendedRow.label} is the first option to review under the current trust checks.`
      : 'No plan can be reviewed until blockers are cleared.',
    confidence,
    stressContext,
    breakRisks,
    defaultRiskDetailId: selectDefaultRecommendedRiskDetailId(breakRisks),
    riskDetails,
    checklistItems,
    reasons: recommendationReasons,
    tradeoffs: recommendedRow?.tradeoffs.length ? recommendedRow.tradeoffs : ['Review the detailed report before relying on this preview.'],
    trustChecks: selectRecommendationTrustChecks(baseline, survivorComparison),
    candidateRows: rowsWithRecommendation,
    whyNotRows
  };
}

export function selectResultsReadinessSummary(
  recommended: RecommendedPathSummary,
  validation: RecommendationValidation = null
): ResultsReadinessSummary {
  const rows = selectResultsReadinessRows(recommended, validation);
  const blockedCount = rows.filter((row) => row.status === 'blocked').length;
  const reviewCount = rows.filter((row) => row.status === 'review').length;
  const readyCount = rows.filter((row) => row.status === 'ready').length;
  const saveRow = rows.find((row) => row.id === 'savePlan');
  const stableDashboardRow = rows.find((row) => row.id === 'stableDashboard');
  const validationBlocked = validation?.canGenerate === false || Boolean(validation?.blockers && validation.blockers.length > 0);
  const blockingRows = rows.filter((row) => row.status === 'blocked' && row.id !== 'stableDashboard');
  const reviewRows = rows.filter((row) => row.status === 'review' && row.id !== 'stableDashboard');
  const status: ResultsReadinessStatus = validationBlocked || blockingRows.length > 0 ? 'blocked' : reviewRows.length > 0 ? 'review' : 'ready';

  return {
    status,
    headline:
      status === 'blocked'
        ? 'Clear blockers before saving this plan as reviewed.'
        : status === 'review'
          ? 'The plan can be saved, with review items still visible.'
          : 'The plan is ready for local save and detailed-report inspection.',
    detail:
      status === 'blocked'
        ? 'Use the rows below to clear validation or source blockers first.'
        : status === 'review'
          ? 'Save can remain available, but the preview still has review items to inspect before relying on it.'
          : 'No blocker or review item is currently visible in the first-pass readiness checks.',
    saveStatus: saveRow?.status ?? 'blocked',
    stableDashboardStatus: stableDashboardRow?.status === 'blocked' ? 'blocked' : 'ready',
    readyCount,
    reviewCount,
    blockedCount,
    recommendedLabel: recommended.recommendedLabel,
    stableDashboardHandoff: 'Open the printable report for complete schedules, printable charts, annual rows, and tax/account detail.'
  };
}

export function selectResultsReadinessRows(
  recommended: RecommendedPathSummary,
  validation: RecommendationValidation = null
): ResultsReadinessRow[] {
  const validationBlocked = validation?.canGenerate === false || Boolean(validation?.blockers && validation.blockers.length > 0);
  const item = (id: RecommendedChecklistItem['id']) => recommended.checklistItems.find((check) => check.id === id);
  const blockers = item('clearBlockers');
  const stress = item('reviewStress');
  const taxes = item('inspectTaxes');
  const survivor = item('testSurvivor');
  const dashboard = item('openStableDashboard');
  const save = item('savePlan');

  return [
    {
      id: 'blockers',
      label: 'Blockers',
      status: validationBlocked ? 'blocked' : blockers?.status ?? 'blocked',
      priority: 'now',
      detail: blockers?.detail ?? 'Validation and money-in / money-out check must be available before final review.',
      action: blockers?.handoff ?? 'Review Guided Intake warnings and Cash Flow.',
      detailArea: 'cashFlow'
    },
    {
      id: 'watchRisks',
      label: 'Watch risks',
      status: stress?.status ?? 'review',
      priority: stress?.priority ?? 'next',
      detail: stress?.detail ?? 'Review stress items before relying on the preview.',
      action: stress?.handoff ?? 'Use Stress Tests and Overview risk details.',
      detailArea: 'stressTests'
    },
    {
      id: 'taxes',
      label: 'Tax review',
      status: taxes?.status ?? 'review',
      priority: taxes?.priority ?? 'next',
      detail: taxes?.detail ?? 'Inspect tax pressure before final save.',
      action: taxes?.handoff ?? 'Use the Taxes tab and detailed report tax schedules.',
      detailArea: 'taxes'
    },
    {
      id: 'householdResilience',
      label: 'Household resilience',
      status: survivor?.status ?? 'review',
      priority: survivor?.priority ?? 'next',
      detail: survivor?.detail ?? 'Review household resilience for two-person plans.',
      action: survivor?.handoff ?? 'Use Survivor Impact and the detailed report survivor detail.',
      detailArea: 'householdResilience'
    },
    {
      id: 'stableDashboard',
      label: 'Printable report review',
      status: validationBlocked ? 'blocked' : 'review',
      priority: dashboard?.priority ?? 'next',
      detail: dashboard?.detail ?? 'The printable report remains available for complete schedules and readable review.',
      action: dashboard?.handoff ?? 'Open the printable report before acting on the selected path.',
      detailArea: 'exportSave'
    },
    {
      id: 'savePlan',
      label: 'Save editable plan',
      status: validationBlocked ? 'blocked' : save?.status ?? 'blocked',
      priority: save?.priority ?? 'later',
      detail: save?.detail ?? 'Save the editable plan locally after review.',
      action: save?.handoff ?? 'Save the editable plan file after review.',
      detailArea: 'exportSave'
    }
  ];
}

export function selectReleaseReadinessCheckpoint({
  validation = null,
  resultsReadiness,
  retirementAnswer,
  spendingCapacity,
  drawdownReviewStatus = null,
  drawdownCopyStatus = null,
  examplesReady = true,
  savedPlanClean = true,
  verificationReady = true
}: ReleaseReadinessCheckpointInput): ReleaseReadinessCheckpoint {
  const validationBlocked = validation?.canGenerate === false || Boolean(validation?.blockers && validation.blockers.length > 0);
  const firstAnswerStatus: ReleaseReadinessStatus =
    retirementAnswer.status === 'cannotTell' || retirementAnswer.status === 'notReady'
      ? 'blocked'
      : retirementAnswer.status === 'tight' || retirementAnswer.status === 'onTrackReview' || retirementAnswer.status === 'estateHeavy'
        ? 'review'
        : 'ready';
  const spendingStatus: ReleaseReadinessStatus =
    spendingCapacity.status === 'cannotTell' || spendingCapacity.status === 'needsReduction'
      ? spendingCapacity.status === 'cannotTell'
        ? 'blocked'
        : 'review'
      : spendingCapacity.status === 'tight'
        ? 'review'
        : 'ready';
  const drawdownStatus: ReleaseReadinessStatus =
    drawdownReviewStatus === 'blocked' || drawdownCopyStatus === 'blocked'
      ? 'blocked'
      : drawdownReviewStatus === 'ready' && (drawdownCopyStatus === 'ready' || drawdownCopyStatus === null)
        ? 'ready'
        : 'review';

  const rows: ReleaseReadinessCheckpoint['rows'] = [
    {
      id: 'inputs',
      label: 'Inputs and blockers',
      status: validationBlocked || resultsReadiness.status === 'blocked' ? 'blocked' : resultsReadiness.status === 'review' ? 'review' : 'ready',
      detail: validationBlocked
        ? 'Clear guided intake blockers before the plan is ready for release review.'
        : resultsReadiness.status === 'review'
          ? 'The plan can be reviewed, with a few visible readiness items still open.'
          : 'No blocking input issues are visible in the readiness checks.',
      action: 'Review Guided Intake and the Money-in / money-out check.',
      detailArea: 'details'
    },
    {
      id: 'firstAnswer',
      label: 'First retirement answer',
      status: firstAnswerStatus,
      detail:
        firstAnswerStatus === 'blocked'
          ? 'The first answer cannot be trusted until the plan can generate a clear retirement result.'
          : firstAnswerStatus === 'review'
            ? 'The first answer is visible, but it should be tested in review with a few plan types.'
            : 'The first answer is clear enough to include in release review.',
      action: 'Open Overview and confirm the retirement answer is understandable in under a minute.',
      detailArea: 'overview'
    },
    {
      id: 'spending',
      label: 'Spending estimate',
      status: spendingStatus,
      detail:
        spendingStatus === 'blocked'
          ? 'The spending estimate is not available yet.'
          : spendingStatus === 'review'
            ? 'The spending estimate needs careful review language before users rely on it.'
            : 'The spending estimate is present and framed as a planning estimate.',
      action: 'Check that today’s dollars and planning-estimate language remain visible.',
      detailArea: 'overview'
    },
    {
      id: 'drawdownReview',
      label: 'Drawdown review',
      status: drawdownStatus,
      detail:
        drawdownStatus === 'blocked'
          ? 'The drawdown review has a blocked readiness or wording signal.'
          : drawdownStatus === 'review'
            ? 'The drawdown review is available but should stay in Details for checkpoint review.'
            : 'The drawdown review is ready to be included as Details evidence.',
      action: 'Review Details for clear no-plan-change and no-instruction boundaries.',
      detailArea: 'details'
    },
    {
      id: 'examples',
      label: 'Example coverage',
      status: examplesReady ? 'ready' : 'review',
      detail: examplesReady ? 'Built-in example coverage is available for the checkpoint.' : 'Run the example matrix before the release review.',
      action: 'Use the built-in examples as the first review set.',
      detailArea: 'details'
    },
    {
      id: 'localSave',
      label: 'Local save boundary',
      status: savedPlanClean && resultsReadiness.saveStatus !== 'blocked' ? 'ready' : 'blocked',
      detail:
        savedPlanClean && resultsReadiness.saveStatus !== 'blocked'
          ? 'Save remains local-first and does not include review output.'
          : 'Local save or persistence guardrails need cleanup before release review.',
      action: 'Save an editable plan and confirm review output is not persisted.',
      detailArea: 'exportSave'
    },
    {
      id: 'verification',
      label: 'Verification',
      status: verificationReady ? 'ready' : 'review',
      detail: verificationReady ? 'Tests, build, and probes can support the checkpoint.' : 'Run the full verification set before checkpoint review.',
      action: 'Run tests, build, parity probes, route probes, and the no-plan-file check.',
      detailArea: 'details'
    },
    {
      id: 'feedbackScope',
      label: 'Feedback scope',
      status: 'ready',
      detail: 'The checkpoint can invite model and user feedback without starting the full visual redesign yet.',
      action: 'Hold broad UI/UX redesign until the full release checkpoint review.',
      detailArea: 'details'
    }
  ];
  const blocked = rows.some((row) => row.status === 'blocked');
  const review = rows.some((row) => row.status === 'review');

  return {
    status: blocked ? 'blocked' : review ? 'review' : 'ready',
    headline: blocked
      ? 'Release review is blocked for now.'
      : review
        ? 'Release review is close, with a few items to inspect.'
        : 'Release review is ready to prepare.',
    detail:
      'This checkpoint gathers the main readiness signals before the broader user and model feedback pass.',
    rows,
    reviewNote:
      'Release readiness checkpoint only. It does not change calculations, save review output, or start the full visual redesign.'
  };
}

export function selectFeedbackReviewPackage({
  releaseReadiness,
  recommendedLabel,
  examplesReady = true,
  verificationReady = true,
  broadUxReviewDeferred = true
}: FeedbackReviewPackageInput): FeedbackReviewPackage {
  const releaseBlocked = releaseReadiness.status === 'blocked';
  const releaseNeedsReview = releaseReadiness.status === 'review';
  const rowStatus = (ready: boolean): 'ready' | 'review' => (ready ? 'ready' : 'review');
  const rows: FeedbackReviewPackage['rows'] = [
    {
      id: 'exampleRun',
      label: 'Example review set',
      status: rowStatus(examplesReady),
      detail: examplesReady
        ? 'Use the built-in examples as the first feedback set.'
        : 'Run the built-in examples before starting the feedback pass.',
      reviewPrompt: 'Can a reviewer load diverse examples and understand the result without extra explanation?',
      detailArea: 'details'
    },
    {
      id: 'firstScreen',
      label: 'First Results screen',
      status: releaseBlocked ? 'blocked' : releaseNeedsReview ? 'review' : 'ready',
      detail:
        releaseReadiness.status === 'ready'
          ? 'The first screen is ready to be reviewed for clarity.'
          : 'The first screen should be reviewed carefully because readiness items remain open.',
      reviewPrompt: 'Can a non-expert answer “Can I retire?” and “What should I review first?” within 60 to 90 seconds?',
      detailArea: 'overview'
    },
    {
      id: 'spendingLanguage',
      label: 'Spending language',
      status: releaseBlocked ? 'blocked' : 'ready',
      detail: 'Spending should remain framed as a planning estimate in today’s dollars.',
      reviewPrompt: 'Does any spending copy sound guaranteed, advice-like, or overly precise?',
      detailArea: 'overview'
    },
    {
      id: 'drawdownDetails',
      label: 'Drawdown review',
      status: releaseBlocked ? 'blocked' : releaseNeedsReview ? 'review' : 'ready',
      detail: 'Drawdown review stays in Details and should read as evidence, not instructions.',
      reviewPrompt: 'Does the drawdown section explain what changed without telling the household what to withdraw?',
      detailArea: 'details'
    },
    {
      id: 'localTrust',
      label: 'Local save and report trust',
      status: releaseReadiness.rows.find((row) => row.id === 'localSave')?.status ?? 'review',
      detail: 'Save and report handoff should stay clear, local-first, and separate.',
      reviewPrompt: 'Does the user understand the difference between saving an editable plan and opening a printable report?',
      detailArea: 'exportSave'
    },
    {
      id: 'verification',
      label: 'Verification evidence',
      status: rowStatus(verificationReady),
      detail: verificationReady ? 'Tests, build, and probes are available as review evidence.' : 'Run verification before feedback review.',
      reviewPrompt: 'Are test, build, probe, and no-plan-file results captured for the review?',
      detailArea: 'details'
    },
    {
      id: 'uxReviewScope',
      label: 'UI/UX review scope',
      status: broadUxReviewDeferred ? 'ready' : 'review',
      detail: broadUxReviewDeferred
        ? 'Full visual review is intentionally held for the checkpoint.'
        : 'Clarify whether visual redesign is starting now or still held.',
      reviewPrompt: 'List visual, layout, chart, color, icon, and information-presentation feedback separately from engine readiness.',
      detailArea: 'details'
    }
  ];
  const blocked = rows.some((row) => row.status === 'blocked');
  const review = rows.some((row) => row.status === 'review');

  return {
    status: blocked ? 'blocked' : review ? 'review' : 'ready',
    headline: blocked
      ? 'Feedback review package is blocked.'
      : review
        ? 'Feedback review package needs a quick check.'
        : 'Feedback review package is ready.',
    detail:
      `Use this package to review ${recommendedLabel || 'the current plan'} across examples, first-screen clarity, spending language, drawdown review, local trust, and verification. Treat it as a plan-review label, not advice.`,
    rows,
    reviewScript: [
      'Load three to five built-in examples that cover single, couple, tight, comfortable, DB pension, estate, and home-equity cases.',
      'Start in Overview and check whether the retirement answer, spending estimate, and top review actions are clear within 60 to 90 seconds.',
      'Open Details and inspect drawdown review, release readiness, and verification evidence without treating them as instructions.',
      'Save an editable plan and open the printable report to confirm the local-first handoff still feels trustworthy.',
      'Capture UI/UX feedback separately for the checkpoint so visual polish does not blur engine readiness.'
    ],
    reviewNote:
      'Feedback review package only. It does not change calculations, save review output, start visual redesign, or apply plan changes.'
  };
}

export function selectCheckpointReviewBoard({
  releaseReadiness,
  feedbackPackage,
  broadUxReviewDeferred = true
}: CheckpointReviewBoardInput): CheckpointReviewBoard {
  const releaseRow = (id: ReleaseReadinessCheckpoint['rows'][number]['id']) =>
    releaseReadiness.rows.find((row) => row.id === id);
  const feedbackRow = (id: FeedbackReviewPackage['rows'][number]['id']) =>
    feedbackPackage.rows.find((row) => row.id === id);
  const bucketFor = (
    status: CheckpointReviewBoardStatus,
    fallback: CheckpointReviewBoard['rows'][number]['bucket'] = 'reviewDuringCheckpoint'
  ): CheckpointReviewBoard['rows'][number]['bucket'] => (status === 'blocked' ? 'fixBeforeFeedback' : fallback);
  const visualStatus: CheckpointReviewBoardStatus = broadUxReviewDeferred ? 'ready' : 'review';
  const rows: CheckpointReviewBoard['rows'] = [
    {
      id: 'examples',
      label: 'Built-in example run',
      status: feedbackRow('exampleRun')?.status ?? releaseRow('examples')?.status ?? 'review',
      bucket: bucketFor(feedbackRow('exampleRun')?.status ?? releaseRow('examples')?.status ?? 'review'),
      detail: 'Use diverse built-in examples as the first checkpoint pass before adding more features.',
      checkpointQuestion: 'Do the example plans still produce understandable, finite Results without saved review output?',
      detailArea: 'details'
    },
    {
      id: 'firstAnswer',
      label: 'First answer clarity',
      status: feedbackRow('firstScreen')?.status ?? releaseRow('firstAnswer')?.status ?? 'review',
      bucket: bucketFor(feedbackRow('firstScreen')?.status ?? releaseRow('firstAnswer')?.status ?? 'review'),
      detail: 'Check whether the first Results screen answers the household question calmly and quickly.',
      checkpointQuestion: 'Can a reviewer understand the retirement answer and top review actions in 60 to 90 seconds?',
      detailArea: 'overview'
    },
    {
      id: 'spending',
      label: 'Spending estimate language',
      status: feedbackRow('spendingLanguage')?.status ?? releaseRow('spending')?.status ?? 'review',
      bucket: bucketFor(feedbackRow('spendingLanguage')?.status ?? releaseRow('spending')?.status ?? 'review'),
      detail: 'Keep spending framed as a planning estimate in today’s dollars.',
      checkpointQuestion: 'Does any spending language sound guaranteed, overly precise, or advice-like?',
      detailArea: 'overview'
    },
    {
      id: 'drawdown',
      label: 'Drawdown review boundaries',
      status: feedbackRow('drawdownDetails')?.status ?? releaseRow('drawdownReview')?.status ?? 'review',
      bucket: bucketFor(feedbackRow('drawdownDetails')?.status ?? releaseRow('drawdownReview')?.status ?? 'review'),
      detail: 'Drawdown review should remain evidence in Details, not account instructions.',
      checkpointQuestion: 'Does the drawdown section explain what changed without telling the household what to withdraw?',
      detailArea: 'details'
    },
    {
      id: 'saveReport',
      label: 'Save and report trust',
      status: feedbackRow('localTrust')?.status ?? releaseRow('localSave')?.status ?? 'review',
      bucket: bucketFor(feedbackRow('localTrust')?.status ?? releaseRow('localSave')?.status ?? 'review'),
      detail: 'Confirm editable save and printable report feel distinct and local-first.',
      checkpointQuestion: 'Does the user understand what is saved locally and what opens as a report?',
      detailArea: 'exportSave'
    },
    {
      id: 'verification',
      label: 'Verification evidence',
      status: feedbackRow('verification')?.status ?? releaseRow('verification')?.status ?? 'review',
      bucket: bucketFor(feedbackRow('verification')?.status ?? releaseRow('verification')?.status ?? 'review'),
      detail: 'Use tests, build, probes, and the no-plan-file check as the checkpoint baseline.',
      checkpointQuestion: 'Are verification results current enough to support model and user review?',
      detailArea: 'details'
    },
    {
      id: 'visualUx',
      label: 'Visual and layout review',
      status: visualStatus,
      bucket: 'deferToUxPass',
      detail: broadUxReviewDeferred
        ? 'Collect visual, chart, color, icon, spacing, and layout feedback for the checkpoint without redesigning now.'
        : 'Clarify whether broad visual polish is starting now or still held for the checkpoint pass.',
      checkpointQuestion: 'Which UI/UX issues affect trust before release, and which belong in the later polish pass?',
      detailArea: 'details'
    }
  ];
  const blocked = rows.some((row) => row.status === 'blocked');
  const review = rows.some((row) => row.status === 'review');

  return {
    status: blocked ? 'blocked' : review ? 'review' : 'ready',
    headline: blocked
      ? 'Checkpoint review has items to fix first.'
      : review
        ? 'Checkpoint review is ready, with a few items to inspect.'
        : 'Checkpoint review is ready to run.',
    detail:
      'Use this board to separate must-fix items, checkpoint review questions, and later visual polish.',
    rows,
    fixBeforeFeedbackCount: rows.filter((row) => row.bucket === 'fixBeforeFeedback').length,
    reviewDuringCheckpointCount: rows.filter((row) => row.bucket === 'reviewDuringCheckpoint').length,
    deferToUxPassCount: rows.filter((row) => row.bucket === 'deferToUxPass').length,
    reviewNote:
      'Checkpoint review board only. It does not change calculations, save review output, start visual redesign, or apply plan changes.'
  };
}

function selectRecommendedStressContext(
  recommended: RecommendedCandidateRow | null,
  result: SimulationResult | null | undefined,
  survivorComparison: SurvivorComparison
): RecommendedStressContext {
  const rows = rowsFrom(result);
  const diagnostics = selectReconciliationDiagnostics(result);
  const taxPressure = selectTaxPressureRows(result);
  const lowestPortfolioRow = rows.reduce<AnnualSimulationRow | null>((lowest, row) => {
    if (!lowest || n(row.bal_total) < n(lowest.bal_total)) return row;
    return lowest;
  }, null);

  if (!recommended || rows.length === 0) {
    return {
      candidateId: null,
      candidateLabel: 'No recommended path',
      sourceStatus: result ? diagnostics.status : 'notAvailable',
      fundedThroughYear: null,
      firstShortfallYear: null,
      firstYearSpending: 0,
      terminalPortfolio: 0,
      lowestPortfolioYear: null,
      lowestPortfolio: 0,
      fundedYears: 0,
      totalYears: 0,
      taxPressureCount: 0,
      survivorStatus: survivorComparison.status,
      summary: 'Stress context is unavailable until a recommended preview candidate can be calculated.'
    };
  }

  const fundedYears = rows.filter((row) => n(row.shortfall) <= RECONCILIATION_TOLERANCE).length;
  const terminalPortfolio = n(rows[rows.length - 1]?.bal_total);
  const firstYearSpending = n(rows[0]?.totalAftaxYear || rows[0]?.spending);
  const sourceStatus = diagnostics.status;
  const shortfallCopy = recommended.firstShortfallYear
    ? `first shortfall in ${recommended.firstShortfallYear}`
    : 'no shortfall in the preview horizon';

  return {
    candidateId: recommended.id,
    candidateLabel: recommended.label,
    sourceStatus,
    fundedThroughYear: recommended.fundedThroughYear,
    firstShortfallYear: recommended.firstShortfallYear,
    firstYearSpending,
    terminalPortfolio,
    lowestPortfolioYear: lowestPortfolioRow?.year ?? null,
    lowestPortfolio: n(lowestPortfolioRow?.bal_total),
    fundedYears,
    totalYears: rows.length,
    taxPressureCount: taxPressure.length,
    survivorStatus: survivorComparison.status,
    summary: `${recommended.label} shows ${shortfallCopy}, funds ${fundedYears}/${rows.length} years, and ends with ${Math.round(terminalPortfolio).toLocaleString()} in portfolio value.`
  };
}

function selectRecommendedBreakRisks(
  recommended: RecommendedCandidateRow | null,
  context: RecommendedStressContext,
  rows: RecommendedCandidateRow[],
  survivorComparison: SurvivorComparison
): RecommendedBreakRisk[] {
  if (!recommended) {
    return [
      {
        id: 'sourceReconciliation',
        label: 'Recommendation blockers',
        severity: 'blocked',
        detail: 'A recommended path is not available until validation and money-in / money-out check blockers are cleared.',
        handoff: 'Fix intake blockers, then use the detailed report for full schedules.'
      }
    ];
  }

  const byId = (id: RecommendedCandidateId) => rows.find((row) => row.id === id);
  const spendingCandidate = byId('spendLessGogo');
  const retireLaterCandidate = byId('retireLater');
  const delayBenefitsCandidate = byId('delayBenefits');
  const terminalCushionYears = context.firstYearSpending > 0 ? context.terminalPortfolio / context.firstYearSpending : 0;
  const risks: RecommendedBreakRisk[] = [];

  risks.push({
    id: 'sourceReconciliation',
    label: 'Money-in / money-out check',
    severity: context.sourceStatus === 'ok' ? 'ok' : 'blocked',
    detail:
      context.sourceStatus === 'ok'
        ? 'The selected candidate reconciles income, withdrawals, tax, and spending in the preview rows.'
        : 'The selected candidate has reconciliation warnings, so the recommendation should not be relied on yet.',
    handoff: 'Detailed report: review annual cash-flow rows.'
  });

  risks.push({
    id: 'spendingSensitivity',
    label: 'Early retirement spending',
    severity:
      spendingCandidate && !spendingCandidate.blocked && spendingCandidate.endPortfolioDelta > Math.max(25000, Math.abs(recommended.endPortfolio) * 0.05)
        ? 'watch'
        : 'review',
    detail:
      spendingCandidate && !spendingCandidate.blocked && spendingCandidate.endPortfolioDelta > 0
        ? `A 10% early-spending reduction improves projected money left by ${Math.round(spendingCandidate.endPortfolioDelta).toLocaleString()} versus the current plan.`
        : 'The spending reduction preview does not materially improve the selected trust metrics.',
    handoff: 'Detailed report: compare detailed spending and withdrawal schedules.'
  });

  risks.push({
    id: 'retirementTiming',
    label: 'Retirement date',
    severity: retireLaterCandidate?.recommended ? 'watch' : retireLaterCandidate && retireLaterCandidate.endPortfolioDelta > 0 ? 'review' : 'ok',
    detail: retireLaterCandidate?.recommended
      ? 'The recommendation depends on working two years longer than the current plan.'
      : retireLaterCandidate && retireLaterCandidate.endPortfolioDelta > 0
        ? `Retiring two years later improves terminal portfolio by ${Math.round(retireLaterCandidate.endPortfolioDelta).toLocaleString()}.`
        : 'Retiring later does not overtake the selected path in this first-pass review.',
    handoff: 'Detailed report: inspect year-by-year employment, tax, and withdrawal timing.'
  });

  risks.push({
    id: 'benefitTiming',
    label: 'CPP/OAS timing',
    severity: delayBenefitsCandidate?.recommended ? 'watch' : delayBenefitsCandidate && delayBenefitsCandidate.endPortfolioDelta > 0 ? 'review' : 'ok',
    detail: delayBenefitsCandidate?.recommended
      ? 'The selected path depends on the age-70 CPP/OAS review test.'
      : delayBenefitsCandidate && delayBenefitsCandidate.endPortfolioDelta > 0
        ? `Delaying CPP/OAS improves terminal portfolio by ${Math.round(delayBenefitsCandidate.endPortfolioDelta).toLocaleString()}.`
        : 'Delayed public benefits do not overtake the selected path in this first-pass review.',
    handoff: 'Detailed report: review benefit timing and taxable income by year.'
  });

  if (context.firstShortfallYear) {
    risks.push({
      id: 'shortfall',
      label: 'Projection shortfall',
      severity: 'watch',
      detail: `The selected path first reports a shortfall in ${context.firstShortfallYear}.`,
      handoff: 'Detailed report: inspect stress tests and annual shortfall rows.'
    });
  }

  risks.push({
    id: 'terminalCushion',
    label: 'Terminal cushion',
    severity: context.terminalPortfolio <= RECONCILIATION_TOLERANCE ? 'watch' : terminalCushionYears < 0.5 ? 'review' : 'ok',
    detail:
      context.terminalPortfolio <= RECONCILIATION_TOLERANCE
        ? 'The selected path ends with little or no portfolio cushion.'
        : `Lowest portfolio is ${Math.round(context.lowestPortfolio).toLocaleString()} in ${context.lowestPortfolioYear || '-'}.`,
    handoff: 'Detailed report: review balance charts and ending estate trade-offs.'
  });

  if (context.taxPressureCount > 0) {
    risks.push({
      id: 'taxPressure',
      label: 'Tax pressure',
      severity: 'review',
      detail: `${context.taxPressureCount} selected-path year${context.taxPressureCount === 1 ? '' : 's'} show elevated tax or OAS clawback pressure.`,
      handoff: 'Detailed report: inspect tax schedules and OAS clawback rows.'
    });
  }

  risks.push({
    id: 'survivor',
    label: 'Survivor resilience',
    severity:
      survivorComparison.status === 'needsInput' || survivorComparison.status === 'notAvailable'
        ? 'review'
        : survivorComparison.firstShortfallYear
          ? 'watch'
          : 'ok',
    detail:
      survivorComparison.status === 'single'
        ? 'Single-person plan; survivor stress is not applicable.'
        : survivorComparison.status === 'ready'
          ? survivorComparison.firstShortfallYear
            ? `Survivor comparison first reports a shortfall in ${survivorComparison.firstShortfallYear}.`
            : `Survivor comparison remains funded through ${survivorComparison.fundedThroughYear || '-'}.`
          : 'Set a survivor year to test household resilience.',
    handoff: 'Detailed report: review survivor and household resilience detail.'
  });

  return risks;
}

function selectRecommendedConfidence(
  recommended: RecommendedCandidateRow | null,
  context: RecommendedStressContext,
  breakRisks: RecommendedBreakRisk[]
): RecommendedConfidence {
  if (!recommended || recommended.blocked || context.sourceStatus !== 'ok') {
    return {
      level: 'low',
      label: 'Low confidence',
      detail: 'The recommendation has blockers or missing stress context.',
      drivers: ['Clear validation and money-in / money-out check blockers before using the selected path.']
    };
  }

  const watchCount = breakRisks.filter((risk) => risk.severity === 'watch' || risk.severity === 'blocked').length;
  const reviewCount = breakRisks.filter((risk) => risk.severity === 'review').length;
  const drivers: string[] = [];
  if (!context.firstShortfallYear) drivers.push('No shortfall appears in the selected-path preview horizon.');
  if (context.fundedYears === context.totalYears) drivers.push(`All ${context.totalYears} preview years are funded.`);
  if (context.taxPressureCount > 0) drivers.push('Tax pressure still needs review.');
  if (breakRisks.some((risk) => risk.id === 'survivor' && risk.severity !== 'ok')) drivers.push('Survivor resilience remains a review item.');

  if (context.firstShortfallYear || watchCount > 0) {
    return {
      level: 'low',
      label: 'Low confidence',
      detail: 'The selected path is fragile under at least one visible stress check.',
      drivers: drivers.length ? drivers : ['At least one selected-path stress check is in watch status.']
    };
  }

  if (reviewCount > 1 || context.taxPressureCount > 0) {
    return {
      level: 'moderate',
      label: 'Moderate confidence',
      detail: 'The selected path is usable as a preview, with review items before acting on it.',
      drivers: drivers.length ? drivers : ['The selected path has review items but no shortfall in the preview horizon.']
    };
  }

  return {
    level: 'higher',
    label: 'Higher confidence',
    detail: 'The selected path clears the first-pass stress checks available in the planner preview.',
    drivers: drivers.length ? drivers : ['No major fragility appears in the first-pass confidence check.']
  };
}

function selectDefaultRecommendedRiskDetailId(
  breakRisks: RecommendedBreakRisk[]
): RecommendedBreakRisk['id'] | null {
  const severityRank: Record<RecommendedBreakRisk['severity'], number> = {
    blocked: 0,
    watch: 1,
    review: 2,
    ok: 3
  };
  return [...breakRisks].sort((a, b) => severityRank[a.severity] - severityRank[b.severity])[0]?.id ?? null;
}

function selectRecommendedRiskDetails(
  baseline: SimulationResult | null | undefined,
  comparisons: Partial<Record<ScenarioCard['id'], SimulationResult | null | undefined>>,
  survivor: SimulationResult | null | undefined,
  plan: V2PlanPayload | null | undefined,
  recommended: RecommendedCandidateRow | null,
  selectedResult: SimulationResult | null | undefined,
  breakRisks: RecommendedBreakRisk[],
  confidence: RecommendedConfidence,
  survivorComparison: SurvivorComparison
): RecommendedRiskDetail[] {
  return breakRisks.map((risk) => {
    const candidateLabel = recommended?.label || 'No recommended path';
    const selectedRows = rowsFrom(selectedResult);
    const diagnostics = selectReconciliationDiagnostics(selectedResult);
    const selectedTax = selectTaxSummaryMetrics(selectedResult);
    const selectedTaxPressure = selectTaxPressureRows(selectedResult);
    const selectedOverview = selectOverviewMetrics(selectedResult);
    const firstShortfall = selectedRows.find((row) => n(row.shortfall) > RECONCILIATION_TOLERANCE);
    const worstShortfall = selectedRows.reduce<AnnualSimulationRow | null>((worst, row) => {
      if (n(row.shortfall) <= RECONCILIATION_TOLERANCE) return worst;
      if (!worst || n(row.shortfall) > n(worst.shortfall)) return row;
      return worst;
    }, null);
    const lowestPortfolio = selectedRows.reduce<AnnualSimulationRow | null>((lowest, row) => {
      if (!lowest || n(row.bal_total) < n(lowest.bal_total)) return row;
      return lowest;
    }, null);
    const terminalPortfolio = n(selectedRows[selectedRows.length - 1]?.bal_total);
    const firstYearSpending = n(selectedRows[0]?.totalAftaxYear || selectedRows[0]?.spending);
    const terminalCushionYears = firstYearSpending > 0 ? terminalPortfolio / firstYearSpending : 0;
    const spendingComparison = scenarioComparison(baseline, comparisons.spendLessGogo);
    const retireComparison = scenarioComparison(baseline, comparisons.retireLater);
    const delayComparison = scenarioComparison(baseline, comparisons.delayBenefits);
    const selectedSourceStory = selectSourceReconciliationStory(selectedRows[0]);

    switch (risk.id) {
      case 'sourceReconciliation':
        return {
          id: risk.id,
          label: risk.label,
          severity: risk.severity,
          candidateLabel,
          headline:
            diagnostics.status === 'ok'
              ? 'Selected-path rows reconcile within tolerance.'
              : 'Selected-path source rows need reconciliation review.',
          detail: 'This checks whether spending can be traced from income, withdrawals, cash funding, other inflows, and tax.',
          metrics: [
            detailMetric('rowsChecked', 'Rows checked', String(diagnostics.rowsChecked), 'neutral'),
            detailMetric('firstWarning', 'First warning', diagnostics.firstWarningYear ? String(diagnostics.firstWarningYear) : 'None', diagnostics.status === 'ok' ? 'ok' : 'watch'),
            detailMetric('maxGap', 'Max reconciliation gap', moneyText(diagnostics.maxReconciliationGap), diagnostics.status === 'ok' ? 'ok' : 'watch')
          ],
          evidenceRows: selectedSourceStory.steps.slice(0, 7).map((step) => ({
            id: step.id,
            label: step.label,
            value: signedMoneyText(step.amount),
            detail: step.tone === 'watch' ? 'Review this source line.' : 'Included in first-year money-in / money-out check.'
          })),
          handoff: risk.handoff
        };
      case 'spendingSensitivity':
        return {
          id: risk.id,
          label: risk.label,
          severity: risk.severity,
          candidateLabel,
          headline: 'This shows whether the recommendation is sensitive to early retirement spending.',
          detail: 'This first-pass test lowers early retirement spending by 10% and compares the result with the current plan.',
          metrics: [
            detailMetric('currentSpend', 'Current early spending', moneyText(plan?.spending?.gogo), 'neutral'),
            detailMetric('scenarioSpend', '10% lower early spending', moneyText(Math.round(n(plan?.spending?.gogo) * 0.9)), 'neutral'),
            detailMetric('endPortfolioDelta', 'End portfolio delta', signedMoneyText(spendingComparison.endPortfolioDelta), n(spendingComparison.endPortfolioDelta) > 0 ? 'ok' : 'neutral'),
            detailMetric('fundedThrough', 'Funded through', spendingComparison.fundedThroughYear ? String(spendingComparison.fundedThroughYear) : '-', 'neutral')
          ],
          evidenceRows: scenarioEvidenceRows('spending', 'Spend a little less early', comparisons.spendLessGogo, spendingComparison),
          handoff: risk.handoff
        };
      case 'retirementTiming':
        return {
          id: risk.id,
          label: risk.label,
          severity: risk.severity,
          candidateLabel,
          headline: 'This shows whether the path depends on working longer.',
          detail: 'This first-pass test moves the household retirement year two years later where retirement years are set.',
          metrics: [
            detailMetric('currentYear', 'Current retirement year', String(plan?.assumptions.retireYear || plan?.p1.retireYear || '-'), 'neutral'),
            detailMetric('laterYear', 'Retire-later year', n(plan?.assumptions.retireYear || plan?.p1.retireYear) ? String(n(plan?.assumptions.retireYear || plan?.p1.retireYear) + 2) : '-', 'neutral'),
            detailMetric('endPortfolioDelta', 'End portfolio delta', signedMoneyText(retireComparison.endPortfolioDelta), n(retireComparison.endPortfolioDelta) > 0 ? 'ok' : 'neutral'),
            detailMetric('fundedThrough', 'Funded through', retireComparison.fundedThroughYear ? String(retireComparison.fundedThroughYear) : '-', 'neutral')
          ],
          evidenceRows: scenarioEvidenceRows('retire', 'Retire two years later', comparisons.retireLater, retireComparison),
          handoff: risk.handoff
        };
      case 'benefitTiming':
        return {
          id: risk.id,
          label: risk.label,
          severity: risk.severity,
          candidateLabel,
          headline: 'This shows whether delayed public benefits materially change the result.',
          detail: 'This first-pass test delays CPP and OAS claiming to age 70 for comparison.',
          metrics: [
            detailMetric('baselineTiming', 'Current plan baseline', 'CPP/OAS at 65', 'neutral'),
            detailMetric('scenarioTiming', 'Review test', 'CPP/OAS at 70', 'neutral'),
            detailMetric('endPortfolioDelta', 'End portfolio delta', signedMoneyText(delayComparison.endPortfolioDelta), n(delayComparison.endPortfolioDelta) > 0 ? 'ok' : 'neutral'),
            detailMetric('taxDelta', 'Lifetime tax delta', signedMoneyText(selectTaxSummaryMetrics(comparisons.delayBenefits).lifetimeTax - selectTaxSummaryMetrics(baseline).lifetimeTax), 'neutral')
          ],
          evidenceRows: scenarioEvidenceRows('benefit', 'Review delaying CPP/OAS to 70', comparisons.delayBenefits, delayComparison),
          handoff: risk.handoff
        };
      case 'shortfall':
        return {
          id: risk.id,
          label: risk.label,
          severity: risk.severity,
          candidateLabel,
          headline: firstShortfall ? `First selected-path shortfall appears in ${firstShortfall.year}.` : 'No selected-path shortfall appears in the preview horizon.',
          detail: 'This isolates the first and worst annual funding pressure in the selected path.',
          metrics: [
            detailMetric('firstShortfall', 'First shortfall', firstShortfall ? String(firstShortfall.year) : 'None', firstShortfall ? 'watch' : 'ok'),
            detailMetric('worstShortfall', 'Worst shortfall', worstShortfall ? moneyText(worstShortfall.shortfall) : '$0', worstShortfall ? 'watch' : 'ok'),
            detailMetric('fundedYears', 'Funded years', `${selectedRows.filter((row) => n(row.shortfall) <= RECONCILIATION_TOLERANCE).length}/${selectedRows.length || 0}`, firstShortfall ? 'watch' : 'ok')
          ],
          evidenceRows: shortfallEvidenceRows(firstShortfall ?? null, worstShortfall),
          handoff: risk.handoff
        };
      case 'terminalCushion':
        return {
          id: risk.id,
          label: risk.label,
          severity: risk.severity,
          candidateLabel,
          headline: 'This shows the selected path’s ending and low-point portfolio cushion.',
          detail: 'The cushion is a simple preview indicator, not an estate plan or probability result.',
          metrics: [
            detailMetric('terminalPortfolio', 'Terminal portfolio', moneyText(terminalPortfolio), terminalPortfolio > 0 ? 'ok' : 'watch'),
            detailMetric('lowestPortfolio', 'Lowest portfolio', lowestPortfolio ? moneyText(lowestPortfolio.bal_total) : '-', n(lowestPortfolio?.bal_total) > 0 ? 'ok' : 'watch'),
            detailMetric('cushionYears', 'Approx. cushion', `${terminalCushionYears.toFixed(1)}x first-year spending`, terminalCushionYears >= 0.5 ? 'ok' : 'watch'),
            detailMetric('estateTarget', 'Estate target', moneyText(plan?.inheritance), 'neutral')
          ],
          evidenceRows: [
            {
              id: 'lowest',
              label: lowestPortfolio ? `Lowest portfolio year ${lowestPortfolio.year}` : 'Lowest portfolio',
              value: lowestPortfolio ? moneyText(lowestPortfolio.bal_total) : '-',
              detail: 'Lowest selected-path balance in the preview horizon.'
            },
            {
              id: 'final',
              label: selectedOverview.lastYear ? `Final year ${selectedOverview.lastYear}` : 'Final year',
              value: moneyText(terminalPortfolio),
              detail: 'Ending selected-path portfolio value.'
            }
          ],
          handoff: risk.handoff
        };
      case 'taxPressure':
        return {
          id: risk.id,
          label: risk.label,
          severity: risk.severity,
          candidateLabel,
          headline: selectedTaxPressure[0] ? `First selected-path tax pressure appears in ${selectedTaxPressure[0].year}.` : 'No major selected-path tax pressure was detected.',
          detail: 'This summarizes taxable-income, tax, OAS clawback, and registered-withdrawal pressure.',
          metrics: [
            detailMetric('firstPressure', 'First pressure', selectedTaxPressure[0] ? String(selectedTaxPressure[0].year) : 'None', selectedTaxPressure.length ? 'watch' : 'ok'),
            detailMetric('peakTax', 'Peak tax', moneyText(selectedTax.peakTax), selectedTax.peakTax > 0 ? 'neutral' : 'ok'),
            detailMetric('oasClawback', 'Lifetime OAS clawback', moneyText(selectedTax.lifetimeOasClawback), selectedTax.lifetimeOasClawback > OAS_CLAWBACK_WATCH_THRESHOLD ? 'watch' : 'ok')
          ],
          evidenceRows: selectedTaxPressure.slice(0, 4).map((row) => ({
            id: String(row.year),
            label: `${row.year}: ${row.reason}`,
            value: moneyText(row.tax),
            detail: `Taxable income ${moneyText(row.taxableIncome)}, OAS clawback ${moneyText(row.oasClawback)}, registered withdrawals ${moneyText(row.registeredWithdrawals)}.`
          })),
          handoff: risk.handoff
        };
      case 'survivor':
        return {
          id: risk.id,
          label: risk.label,
          severity: risk.severity,
          candidateLabel,
          headline:
            survivorComparison.status === 'ready'
              ? 'Survivor comparison is available for this household.'
              : survivorComparison.status === 'single'
                ? 'Survivor stress is not applicable for this single-person plan.'
                : 'Survivor resilience needs more input before comparison.',
          detail: 'This uses the existing survivor preview boundary when a couple plan has a survivor year.',
          metrics: [
            detailMetric('status', 'Survivor status', survivorComparison.status, survivorComparison.status === 'ready' || survivorComparison.status === 'single' ? 'ok' : 'watch'),
            detailMetric('survivorYear', 'Survivor year', survivorComparison.survivorYear ? String(survivorComparison.survivorYear) : '-', 'neutral'),
            detailMetric('endPortfolioDelta', 'End portfolio delta', signedMoneyText(survivorComparison.endPortfolioDelta), survivorComparison.endPortfolioDelta >= 0 ? 'ok' : 'watch'),
            detailMetric('fundedThrough', 'Funded through', survivorComparison.fundedThroughYear ? String(survivorComparison.fundedThroughYear) : '-', survivorComparison.firstShortfallYear ? 'watch' : 'neutral')
          ],
          evidenceRows: survivorEvidenceRows(survivorComparison, survivor),
          handoff: risk.handoff
        };
      default:
        return {
          id: risk.id,
          label: risk.label,
          severity: risk.severity,
          candidateLabel,
          headline: `${risk.label} detail is available for the selected path.`,
          detail: confidence.detail,
          metrics: [detailMetric('confidence', 'Confidence', confidence.label, confidence.level === 'low' ? 'watch' : 'ok')],
          evidenceRows: [{ id: 'summary', label: risk.label, value: risk.severity, detail: risk.detail }],
          handoff: risk.handoff
        };
    }
  });
}

function selectRecommendedChecklistItems(
  recommended: RecommendedCandidateRow | null,
  breakRisks: RecommendedBreakRisk[],
  confidence: RecommendedConfidence,
  context: RecommendedStressContext,
  survivorComparison: SurvivorComparison,
  validationBlocked: boolean
): RecommendedChecklistItem[] {
  const blockedRisks = breakRisks.filter((risk) => risk.severity === 'blocked');
  const watchRisks = breakRisks.filter((risk) => risk.severity === 'watch');
  const taxRisk = breakRisks.find((risk) => risk.id === 'taxPressure');
  const spendingRisk = breakRisks.find((risk) => risk.id === 'spendingSensitivity');
  const timingRisk = breakRisks.find((risk) => risk.id === 'retirementTiming' || risk.id === 'benefitTiming');

  const items: RecommendedChecklistItem[] = [
    {
      id: 'clearBlockers',
      label: 'Clear blockers',
      status: validationBlocked || blockedRisks.length > 0 || !recommended ? 'blocked' : 'ready',
      priority: 'now',
      detail:
        validationBlocked || blockedRisks.length > 0 || !recommended
          ? 'Resolve validation and money-in / money-out check blockers before relying on the selected path.'
          : 'No validation or money-in / money-out check blocker is currently stopping the preview.',
      handoff: 'Start with Guided Intake warnings and detailed report cash-flow rows.'
    },
    {
      id: 'reviewStress',
      label: 'Review watch risks',
      status: watchRisks.length > 0 || confidence.level === 'low' ? 'review' : 'ready',
      priority: watchRisks.length > 0 || confidence.level === 'low' ? 'now' : 'next',
      detail:
        watchRisks.length > 0
          ? `${watchRisks.length} selected-path risk${watchRisks.length === 1 ? '' : 's'} need review before acting.`
          : 'No watch-level selected-path risk is visible in the first-pass review.',
      handoff: 'Use the break-risk drilldowns above, then inspect complete annual rows in the detailed report.'
    },
    {
      id: 'confirmSpending',
      label: 'Confirm spending comfort',
      status: spendingRisk?.severity === 'watch' ? 'review' : 'ready',
      priority: spendingRisk?.severity === 'watch' ? 'now' : 'next',
      detail:
        spendingRisk?.severity === 'watch'
          ? 'The selected path is sensitive to early retirement spending; confirm the lifestyle target before saving.'
          : 'The 10% early-spending rerun does not currently create a watch-level item.',
      handoff: 'Review the spending sensitivity drilldown and detailed report withdrawal schedule.'
    },
    {
      id: 'confirmTiming',
      label: 'Confirm timing levers',
      status: timingRisk?.severity === 'watch' || timingRisk?.severity === 'review' ? 'review' : 'ready',
      priority: timingRisk?.severity === 'watch' ? 'now' : 'next',
      detail: 'Retirement date and CPP/OAS timing are decision levers, not automatic instructions.',
      handoff: 'Review retirement-date and CPP/OAS timing drilldowns before treating the preview as a plan.'
    },
    {
      id: 'inspectTaxes',
      label: 'Inspect tax pressure',
      status: taxRisk ? 'review' : 'ready',
      priority: taxRisk ? 'next' : 'later',
      detail:
        context.taxPressureCount > 0
          ? `${context.taxPressureCount} selected-path year${context.taxPressureCount === 1 ? '' : 's'} show tax or OAS pressure.`
          : 'No major selected-path tax pressure was detected in the first-pass review.',
      handoff: 'Use the Taxes tab and detailed report tax schedules for year-by-year detail.'
    },
    {
      id: 'testSurvivor',
      label: 'Check household resilience',
      status:
        survivorComparison.status === 'needsInput' || survivorComparison.status === 'notAvailable' || survivorComparison.firstShortfallYear
          ? 'review'
          : 'ready',
      priority: survivorComparison.status === 'single' ? 'later' : 'next',
      detail:
        survivorComparison.status === 'single'
          ? 'Single-person plan; survivor comparison is not applicable.'
          : survivorComparison.status === 'ready'
            ? 'Survivor comparison is available; review it before relying on a two-person plan.'
            : 'Set a survivor year to test household resilience.',
      handoff: 'Use Household Resilience and the detailed report survivor detail.'
    },
    {
      id: 'openStableDashboard',
      label: 'Inspect complete detail',
      status: 'review',
      priority: 'next',
      detail: 'The Results page is still a preview. Complete schedules, charts, and print/PDF remain in the printable report.',
      handoff: 'Open printable report before acting on the selected path.'
    },
    {
      id: 'savePlan',
      label: 'Save editable plan',
      status: validationBlocked || blockedRisks.length > 0 ? 'blocked' : 'ready',
      priority: 'later',
      detail:
        validationBlocked || blockedRisks.length > 0
          ? 'Save after blockers are clear so the local plan file reflects reviewed inputs.'
          : 'Save the reviewed editable plan file when you are ready to keep this version.',
      handoff: 'Use Save editable plan. Results notes stay separate from the saved plan file.'
    }
  ];

  return items;
}

function detailMetric(
  id: string,
  label: string,
  value: string,
  tone: RecommendedRiskDetail['metrics'][number]['tone']
): RecommendedRiskDetail['metrics'][number] {
  return { id, label, value, tone };
}

function moneyText(value: number | undefined): string {
  return `$${Math.round(n(value)).toLocaleString()}`;
}

function signedMoneyText(value: number | undefined): string {
  const rounded = Math.round(n(value));
  if (rounded === 0) return '$0';
  return `${rounded > 0 ? '+' : '-'}$${Math.abs(rounded).toLocaleString()}`;
}

function scenarioEvidenceRows(
  prefix: string,
  label: string,
  result: SimulationResult | null | undefined,
  comparison: { endPortfolioDelta?: number; fundedThroughYear?: number | null }
): RecommendedRiskDetail['evidenceRows'] {
  const rows = rowsFrom(result);
  const firstShortfall = rows.find((row) => n(row.shortfall) > RECONCILIATION_TOLERANCE);
  const tax = selectTaxSummaryMetrics(result);
  return [
    {
      id: `${prefix}-availability`,
      label,
      value: rows.length ? 'Ready' : 'Not available',
      detail: rows.length ? 'Scenario output is available for this first-pass test.' : 'Scenario output has not been calculated.'
    },
    {
      id: `${prefix}-end-portfolio`,
      label: 'End portfolio delta',
      value: signedMoneyText(comparison.endPortfolioDelta),
      detail: `Funded through ${comparison.fundedThroughYear || '-'}; first shortfall ${firstShortfall?.year || 'none'}.`
    },
    {
      id: `${prefix}-tax`,
      label: 'Lifetime tax',
      value: moneyText(tax.lifetimeTax),
      detail: 'Use the detailed report to inspect annual tax rows.'
    }
  ];
}

function shortfallEvidenceRows(
  firstShortfall: AnnualSimulationRow | null,
  worstShortfall: AnnualSimulationRow | null
): RecommendedRiskDetail['evidenceRows'] {
  if (!firstShortfall && !worstShortfall) {
    return [{ id: 'none', label: 'Shortfall', value: 'None', detail: 'No selected-path shortfall appears in the preview horizon.' }];
  }
  return [
    firstShortfall
      ? {
          id: 'first',
          label: `First shortfall year ${firstShortfall.year}`,
          value: moneyText(firstShortfall.shortfall),
          detail: `Portfolio balance ${moneyText(firstShortfall.bal_total)}.`
        }
      : null,
    worstShortfall
      ? {
          id: 'worst',
          label: `Worst shortfall year ${worstShortfall.year}`,
          value: moneyText(worstShortfall.shortfall),
          detail: `Portfolio balance ${moneyText(worstShortfall.bal_total)}.`
        }
      : null
  ].filter((row): row is RecommendedRiskDetail['evidenceRows'][number] => Boolean(row));
}

function survivorEvidenceRows(
  comparison: SurvivorComparison,
  survivor: SimulationResult | null | undefined
): RecommendedRiskDetail['evidenceRows'] {
  if (comparison.status === 'single') {
    return [{ id: 'single', label: 'Single-person plan', value: 'Not applicable', detail: 'Survivor stress is not needed for this household mode.' }];
  }
  if (comparison.status === 'needsInput') {
    return [{ id: 'needs-input', label: 'Survivor year', value: 'Missing', detail: 'Set a survivor year in assumptions to run the household resilience comparison.' }];
  }
  if (comparison.status === 'notAvailable') {
    return [{ id: 'not-available', label: 'Survivor result', value: 'Not available', detail: 'The survivor preview has not been calculated yet.' }];
  }
  const rows = rowsFrom(survivor);
  const firstShortfall = rows.find((row) => n(row.shortfall) > RECONCILIATION_TOLERANCE);
  return [
    {
      id: 'end-portfolio',
      label: 'Survivor end portfolio delta',
      value: signedMoneyText(comparison.endPortfolioDelta),
      detail: `Baseline ${moneyText(comparison.baselineEndPortfolio)}, survivor ${moneyText(comparison.survivorEndPortfolio)}.`
    },
    {
      id: 'tax',
      label: 'Survivor lifetime tax delta',
      value: signedMoneyText(comparison.lifetimeTaxDelta),
      detail: `Baseline ${moneyText(comparison.baselineLifetimeTax)}, survivor ${moneyText(comparison.survivorLifetimeTax)}.`
    },
    {
      id: 'shortfall',
      label: 'Survivor shortfall',
      value: firstShortfall ? String(firstShortfall.year) : 'None',
      detail: `Spending funded ${comparison.spendingFundedYears}.`
    }
  ];
}

function selectRecommendedCandidateRow(
  id: RecommendedCandidateId,
  label: string,
  result: SimulationResult | null | undefined,
  baselineOverview: OverviewMetrics,
  baselineTax: TaxSummaryMetrics,
  validationBlocked: boolean,
  survivorComparison: SurvivorComparison
): RecommendedCandidateRow {
  if (!result) {
    return {
      id,
      label,
      score: Number.NEGATIVE_INFINITY,
      recommended: false,
      blocked: true,
      reviewStatus: 'blocked',
      fundedThroughYear: null,
      firstShortfallYear: null,
      endPortfolio: 0,
      endPortfolioDelta: 0,
      lifetimeTax: 0,
      lifetimeTaxDelta: 0,
      spendingFundedYears: '-',
      reasons: ['sourceReconciliationBlocked'],
      tradeoffs: ['Scenario result is not available yet.']
    };
  }

  const diagnostics = selectReconciliationDiagnostics(result);
  const rows = rowsFrom(result);
  const overview = selectOverviewMetrics(result);
  const tax = selectTaxSummaryMetrics(result);
  const firstShortfall = rows.find((row) => n(row.shortfall) > RECONCILIATION_TOLERANCE);
  const fundedYears = rows.filter((row) => n(row.shortfall) <= RECONCILIATION_TOLERANCE).length;
  const fundedThroughYear = firstShortfall ? firstShortfall.year - 1 : overview.lastYear;
  const endPortfolioDelta = overview.endPortfolio - baselineOverview.endPortfolio;
  const lifetimeTaxDelta = tax.lifetimeTax - baselineTax.lifetimeTax;
  const blocked = validationBlocked || diagnostics.status === 'warning';
  const reasons: RecommendationReason[] = [];
  const tradeoffs: string[] = [];

  if (validationBlocked) reasons.push('validationBlocked');
  if (diagnostics.status === 'warning') reasons.push('sourceReconciliationBlocked');
  if (!firstShortfall) reasons.push('noShortfall');
  if ((fundedThroughYear || 0) > (baselineOverview.lastYear || 0)) reasons.push('laterFundedThrough');
  if (endPortfolioDelta > RECONCILIATION_TOLERANCE) reasons.push('higherEndPortfolio');
  if (lifetimeTaxDelta < -RECONCILIATION_TOLERANCE) reasons.push('lowerLifetimeTax');
  if (survivorComparison.status === 'needsInput' || survivorComparison.status === 'notAvailable') reasons.push('survivorNeedsReview');
  if (id === 'baseline') reasons.push('baselineTie');

  if (firstShortfall) tradeoffs.push(`First shortfall appears in ${firstShortfall.year}.`);
  if (lifetimeTaxDelta > RECONCILIATION_TOLERANCE) tradeoffs.push(`Lifetime tax is ${Math.round(lifetimeTaxDelta).toLocaleString()} higher than current plan.`);
  if (endPortfolioDelta < -RECONCILIATION_TOLERANCE) tradeoffs.push(`End portfolio is ${Math.round(Math.abs(endPortfolioDelta)).toLocaleString()} lower than current plan.`);
  if (survivorComparison.status === 'needsInput') tradeoffs.push('Survivor year is not set for this household.');

  const noShortfallScore = firstShortfall ? 0 : 1_000_000;
  const fundedScore = (fundedThroughYear || 0) * 1_000;
  const endPortfolioScore = overview.endPortfolio / 10_000;
  const taxScore = -tax.lifetimeTax / 100_000;
  const baselineTieScore = id === 'baseline' ? 0.1 : 0;

  return {
    id,
    label,
    score: blocked ? Number.NEGATIVE_INFINITY : noShortfallScore + fundedScore + endPortfolioScore + taxScore + baselineTieScore,
    recommended: false,
    blocked,
    reviewStatus: blocked ? 'blocked' : 'review',
    fundedThroughYear,
    firstShortfallYear: firstShortfall?.year ?? null,
    endPortfolio: overview.endPortfolio,
    endPortfolioDelta,
    lifetimeTax: tax.lifetimeTax,
    lifetimeTaxDelta,
    spendingFundedYears: `${fundedYears}/${rows.length || 0}`,
    reasons,
    tradeoffs
  };
}

function compareRecommendedCandidates(a: RecommendedCandidateRow, b: RecommendedCandidateRow): number {
  if (a.firstShortfallYear && !b.firstShortfallYear) return 1;
  if (!a.firstShortfallYear && b.firstShortfallYear) return -1;
  if ((b.fundedThroughYear || 0) !== (a.fundedThroughYear || 0)) return (b.fundedThroughYear || 0) - (a.fundedThroughYear || 0);
  if (b.endPortfolio !== a.endPortfolio) return b.endPortfolio - a.endPortfolio;
  if (a.lifetimeTax !== b.lifetimeTax) return a.lifetimeTax - b.lifetimeTax;
  return b.score - a.score;
}

function recommendedReasonCopy(row: RecommendedCandidateRow): string[] {
  const reasons: string[] = [];
  if (row.reasons.includes('noShortfall')) reasons.push('No shortfall appears in the preview horizon.');
  if (row.reasons.includes('laterFundedThrough')) reasons.push('It keeps spending funded later than the current plan.');
  if (row.reasons.includes('higherEndPortfolio')) reasons.push('It improves the ending portfolio versus the current plan.');
  if (row.reasons.includes('lowerLifetimeTax')) reasons.push('It lowers lifetime tax versus the current plan.');
  if (row.reasons.includes('baselineTie')) reasons.push('The current plan remains strongest when scenarios do not improve the trust metrics.');
  if (reasons.length === 0) reasons.push('It has the strongest combination of funded years, ending portfolio, and tax among available candidates.');
  return reasons;
}

function whyNotReason(row: RecommendedCandidateRow, recommended: RecommendedCandidateRow | null): string {
  if (row.blocked) return 'Blocked by missing scenario output or money-in / money-out check warnings.';
  if (!recommended) return 'No recommended candidate is available for comparison.';
  if (row.firstShortfallYear && !recommended.firstShortfallYear) return `It has a shortfall in ${row.firstShortfallYear}.`;
  if ((row.fundedThroughYear || 0) < (recommended.fundedThroughYear || 0)) return 'It funds fewer projection years.';
  if (row.endPortfolio < recommended.endPortfolio) return 'It leaves a lower ending portfolio.';
  if (row.lifetimeTax > recommended.lifetimeTax) return 'It has higher lifetime tax.';
  return 'It did not improve the selected trust metrics enough to overtake the recommended path.';
}

function selectRecommendationTrustChecks(
  baseline: SimulationResult | null | undefined,
  survivorComparison: SurvivorComparison
): RecommendedPathSummary['trustChecks'] {
  const diagnostics = selectReconciliationDiagnostics(baseline);
  const overview = selectOverviewMetrics(baseline);
  const taxPressure = selectTaxPressureRows(baseline);
  return [
    {
      id: 'sourceReconciliation',
      label: 'Money-in / money-out check',
      status: diagnostics.status === 'ok' ? 'ok' : 'blocked',
      detail: diagnostics.status === 'ok' ? `${diagnostics.rowsChecked} rows reconcile.` : `First warning year ${diagnostics.firstWarningYear || '-'}.`
    },
    {
      id: 'shortfall',
      label: 'Shortfall',
      status: overview.hasShortfall ? 'review' : 'ok',
      detail: overview.hasShortfall ? 'At least one projection year has a shortfall.' : 'No shortfall appears in the current preview.'
    },
    {
      id: 'taxPressure',
      label: 'Tax pressure',
      status: taxPressure.length > 0 ? 'review' : 'ok',
      detail: taxPressure[0] ? `First pressure year ${taxPressure[0].year}: ${taxPressure[0].reason}.` : 'No major tax pressure years detected.'
    },
    {
      id: 'survivor',
      label: 'Survivor',
      status: survivorComparison.status === 'needsInput' || survivorComparison.status === 'notAvailable' ? 'review' : 'ok',
      detail:
        survivorComparison.status === 'single'
          ? 'Single-person plan.'
          : survivorComparison.status === 'ready'
            ? `Survivor comparison funded through ${survivorComparison.fundedThroughYear || '-'}.`
            : 'Survivor review needs a survivor year.'
    }
  ];
}

export function selectCashFlowReconciliation(row: AnnualSimulationRow | null | undefined): CashFlowReconciliation {
  if (!row) {
    return {
      year: null,
      incomeAndWithdrawals: 0,
      taxFreeWithdrawals: 0,
      cashWedgeFunding: 0,
      otherInflows: 0,
      tax: 0,
      afterTaxSpending: 0,
      oneOffOutflows: 0,
      reconciledAfterTaxSpending: 0,
      reconciliationDelta: 0,
      cashFlowDelta: 0,
      status: 'ok'
    };
  }

  const incomeAndWithdrawals = n(row.grossIncome);
  const taxFreeWithdrawals = n(row.tfsa_draw) + n(row.nonreg_draw);
  const cashWedgeFunding = n(row.cash_draw);
  const otherInflows = n(row.downsize_proceeds);
  const tax = n(row.totalTaxYear);
  const afterTaxSpending = n(row.totalAftaxYear);
  const reconciledAfterTaxSpending = incomeAndWithdrawals + taxFreeWithdrawals + cashWedgeFunding + otherInflows - tax;
  const reconciliationDelta = reconciledAfterTaxSpending - afterTaxSpending;
  const cashFlowDelta = n(row.cashFlow);
  const underfundedSpending = reconciliationDelta < -RECONCILIATION_TOLERANCE;

  return {
    year: row.year,
    incomeAndWithdrawals,
    taxFreeWithdrawals,
    cashWedgeFunding,
    otherInflows,
    tax,
    afterTaxSpending,
    oneOffOutflows: n(row.oneOff_outflow),
    reconciledAfterTaxSpending,
    reconciliationDelta,
    cashFlowDelta,
    status: underfundedSpending ? 'warning' : 'ok'
  };
}
