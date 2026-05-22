import { extractPlanPayload } from '../data/planFile';
import type { SimulationConfig } from './runSimulation';
import type { AnnualSimulationRow, SimulationResult, V2PlanPayload } from '../types/plan';

const RECONCILIATION_TOLERANCE = 1;
const OAS_CLAWBACK_WATCH_THRESHOLD = 1;

export type StressIndicatorRow = {
  id: 'shortfall' | 'depletion' | 'minimumPortfolio' | 'terminalPortfolio' | 'fundedYears';
  label: string;
  value: string;
  severity: 'ok' | 'watch';
};

export type StressSeverity = 'ok' | 'review' | 'watch';

export type StressTestSummary = {
  status: StressSeverity;
  headline: string;
  detail: string;
  totalYears: number;
  fundedYears: number;
  firstStressYear: number | null;
  worstStressLabel: string;
  stableDashboardHandoff: string;
};

export type StressTestRow = {
  id: 'spendingShortfall' | 'portfolioDepletion' | 'portfolioCushion' | 'taxPressure' | 'sourceReconciliation';
  label: string;
  severity: StressSeverity;
  year: number | null;
  value: string;
  evidence: string;
  reviewAction: string;
  detailArea: 'annualDetail' | 'accounts' | 'taxes' | 'cashFlow';
};

export type SpendingStressId = 'current' | 'littleLess' | 'meaningfullyLess' | 'littleMore';

export type SpendingStressResults = Partial<Record<SpendingStressId, SimulationResult>>;

export type SpendingStressStatus = 'cannotTell' | 'fragile' | 'balanced' | 'roomToReview';

export type SpendingStressRow = {
  id: SpendingStressId;
  label: string;
  earlySpending: number;
  fundedYears: number;
  totalYears: number;
  firstShortfallYear: number | null;
  endPortfolio: number;
  endPortfolioDelta: number;
  lifetimeTax: number;
  lifetimeTaxDelta: number;
  note: string;
};

export type SpendingStressSummary = {
  status: SpendingStressStatus;
  label: string;
  headline: string;
  detail: string;
  rows: SpendingStressRow[];
  reviewNote: string;
};

export type SpendingStressRunner = (plan: V2PlanPayload, config: SimulationConfig) => SimulationResult;

export type StressExtractionBoundary = {
  source: 'simulationResultRows';
  ownsBaselineStressRead: true;
  ownsSpendingStressReruns: boolean;
  ownsSpendingStressSummary: boolean;
  ownsMonteCarlo: false;
  ownsHistoricalSequence: false;
  changesSimulationMath: boolean;
  persistedOutput: 'none' | 'runtimeEvidenceLeaked';
  disposition: 'stressExtractionBoundaryOnly';
};

export type StressExtractionReadinessSummary = {
  status: 'readyForReviewStressOwnership' | 'holdForScenarioStress' | 'blocked';
  headline: string;
  detail: string;
  rows: Array<{
    id: 'baselineRows' | 'reviewSelectors' | 'spendingStress' | 'monteCarlo' | 'savedPlan';
    label: string;
    status: 'ready' | 'hold' | 'blocked';
    detail: string;
  }>;
  reviewNote: string;
  disposition: 'stressExtractionReadinessOnly';
};

export type DetailedStressBoundaryStatus = 'readyForLaterExtraction' | 'holdInDetailedReport' | 'blocked';

export type DetailedStressBoundaryRow = {
  id:
    | 'monteCarlo'
    | 'progressiveMonteCarlo'
    | 'historicalSequence'
    | 'fullSpendingFunded'
    | 'dashboardOwnership'
    | 'probeCoverage'
    | 'savedPlan';
  label: string;
  status: 'ready' | 'hold' | 'blocked';
  detail: string;
  disposition: 'detailedStressBoundaryEvidenceOnly';
};

export type DetailedStressBoundaryReview = {
  status: DetailedStressBoundaryStatus;
  headline: string;
  detail: string;
  rows: DetailedStressBoundaryRow[];
  nextStep: string;
  reviewNote: string;
  disposition: 'detailedStressBoundaryReviewOnly';
};

export type DetailedStressMigrationCloseout = {
  status: 'readyForThinAdapter' | 'holdDetailedStress' | 'blocked';
  headline: string;
  detail: string;
  rows: Array<{
    id: 'boundaryReview' | 'baselineStress' | 'spendingStress' | 'savedPlan';
    label: string;
    status: 'ready' | 'hold' | 'blocked';
    detail: string;
  }>;
  reviewNote: string;
  disposition: 'detailedStressMigrationCloseoutOnly';
};

export type DetailedStressAdapterContract = {
  status: 'readyForInjectedRunner' | 'holdDetailedStress' | 'blocked';
  headline: string;
  detail: string;
  inputBoundary: {
    acceptsExplicitPlan: boolean;
    acceptsExplicitConfig: boolean;
    readsGlobalDashboardState: boolean;
  };
  executionBoundary: {
    owner: 'detailedReportEngine';
    reactMayRunMonteCarlo: boolean;
    reactMayRunHistoricalReplay: boolean;
    runnerMode: 'injectedOnly' | 'directReactExecution';
  };
  outputBoundary: {
    returnsExistingShapes: boolean;
    changesStressMath: boolean;
    persistedOutput: 'none' | 'adapterOutputLeaked';
  };
  rows: Array<{
    id: 'inputPlan' | 'inputConfig' | 'runnerOwnership' | 'outputShape' | 'savedPlan';
    label: string;
    status: 'ready' | 'hold' | 'blocked';
    detail: string;
  }>;
  reviewNote: string;
  disposition: 'detailedStressAdapterContractOnly';
};

export type DetailedStressAdapterValidation = {
  status: 'validForPrototype' | 'holdDetailedStress' | 'blocked';
  headline: string;
  detail: string;
  rows: Array<{
    id: 'boundaryReview' | 'migrationCloseout' | 'adapterContract' | 'probeCoverage' | 'savedPlan';
    label: string;
    status: 'ready' | 'hold' | 'blocked';
    detail: string;
  }>;
  nextStep: string;
  reviewNote: string;
  disposition: 'detailedStressAdapterValidationOnly';
};

export type DetailedStressAdapterBatchCloseout = {
  status: 'readyForThinAdapterPrototype' | 'holdDetailedStress' | 'blocked';
  headline: string;
  detail: string;
  rows: Array<{
    id: 'contract' | 'validation' | 'execution' | 'persistence';
    label: string;
    status: 'ready' | 'hold' | 'blocked';
    detail: string;
  }>;
  reviewNote: string;
  disposition: 'detailedStressAdapterBatchCloseoutOnly';
};

export type DetailedStressAdapterRequest = {
  requestId: 'detailedStressExplicitPlanRequest';
  plan: V2PlanPayload;
  config: SimulationConfig;
  source: 'explicitPlanAndConfig';
  readsGlobalDashboardState: false;
  persistedOutput: 'none';
  disposition: 'detailedStressAdapterRequestOnly';
};

export type DetailedStressInjectedRunnerResult = {
  shape: 'existingDetailedStressShape';
  status: 'complete' | 'unavailable';
  fullSpendingFundedRate: number | null;
  monteCarloRunCount: number | null;
  historicalSequenceCount: number | null;
  notes: string[];
};

export type DetailedStressInjectedRunner = (
  request: DetailedStressAdapterRequest
) => DetailedStressInjectedRunnerResult;

export type DetailedStressInjectedRunnerPrototype = {
  status: 'prototypeComplete' | 'notReady' | 'blocked';
  headline: string;
  detail: string;
  request: DetailedStressAdapterRequest | null;
  runnerCalled: boolean;
  result: DetailedStressInjectedRunnerResult | null;
  rows: Array<{
    id: 'validation' | 'request' | 'runner' | 'outputShape' | 'savedPlan';
    label: string;
    status: 'ready' | 'hold' | 'blocked';
    detail: string;
  }>;
  reviewNote: string;
  disposition: 'detailedStressInjectedRunnerPrototypeOnly';
};

export type DetailedStressPrototypeBatchCloseout = {
  status: 'readyForProbeBackedRunner' | 'holdDetailedStress' | 'blocked';
  headline: string;
  detail: string;
  rows: Array<{
    id: 'request' | 'prototype' | 'executionBoundary' | 'persistence';
    label: string;
    status: 'ready' | 'hold' | 'blocked';
    detail: string;
  }>;
  reviewNote: string;
  disposition: 'detailedStressPrototypeBatchCloseoutOnly';
};

export type DetailedStressProbeCoverage = {
  status: 'covered' | 'missingCoverage' | 'blocked';
  headline: string;
  detail: string;
  rows: Array<{
    id: 'monteCarlo' | 'progressiveMonteCarlo' | 'historicalSequence' | 'parity' | 'routeCaveat';
    label: string;
    status: 'covered' | 'caveat' | 'missing' | 'blocked';
    detail: string;
  }>;
  reviewNote: string;
  disposition: 'detailedStressProbeCoverageOnly';
};

export type DetailedStressProbeBackedRunnerBridge = {
  status: 'readyForManualBridge' | 'holdDetailedStress' | 'blocked';
  headline: string;
  detail: string;
  rows: Array<{
    id: 'prototypeCloseout' | 'probeCoverage' | 'runnerInjection' | 'executionBoundary' | 'savedPlan';
    label: string;
    status: 'ready' | 'hold' | 'blocked';
    detail: string;
  }>;
  reviewNote: string;
  disposition: 'detailedStressProbeBackedRunnerBridgeOnly';
};

export type DetailedStressProbeBackedBridgeRun = {
  status: 'bridgeComplete' | 'holdDetailedStress' | 'blocked';
  headline: string;
  detail: string;
  prototype: DetailedStressInjectedRunnerPrototype;
  bridge: DetailedStressProbeBackedRunnerBridge;
  rows: Array<{
    id: 'bridge' | 'request' | 'runner' | 'outputShape' | 'persistence';
    label: string;
    status: 'ready' | 'hold' | 'blocked';
    detail: string;
  }>;
  reviewNote: string;
  disposition: 'detailedStressProbeBackedBridgeRunOnly';
};

export type DetailedStressBridgeBatchCloseout = {
  status: 'readyForManualReportComparison' | 'holdDetailedStress' | 'blocked';
  headline: string;
  detail: string;
  rows: Array<{
    id: 'coverage' | 'bridge' | 'bridgeRun' | 'nextStep';
    label: string;
    status: 'ready' | 'hold' | 'blocked';
    detail: string;
  }>;
  reviewNote: string;
  disposition: 'detailedStressBridgeBatchCloseoutOnly';
};

export type DetailedStressManualReportReference = {
  shape: 'existingDetailedStressShape';
  fullSpendingFundedRate: number | null;
  monteCarloRunCount: number | null;
  historicalSequenceCount: number | null;
  source: 'detailedReportReference';
  persistedOutput: 'none';
  disposition: 'detailedStressManualReportReferenceOnly';
};

export type DetailedStressManualReportComparison = {
  status: 'aligned' | 'needsReview' | 'blocked';
  headline: string;
  detail: string;
  rows: Array<{
    id: 'bridgeRun' | 'shape' | 'fullSpendingFunded' | 'monteCarloRuns' | 'historicalSequences' | 'savedPlan';
    label: string;
    status: 'aligned' | 'review' | 'blocked';
    bridgeValue: string;
    referenceValue: string;
    detail: string;
  }>;
  reviewNote: string;
  disposition: 'detailedStressManualReportComparisonOnly';
};

export type DetailedStressManualComparisonCloseout = {
  status: 'readyForStressMigrationDecision' | 'holdDetailedStress' | 'blocked';
  headline: string;
  detail: string;
  rows: Array<{
    id: 'comparison' | 'executionBoundary' | 'persistence' | 'nextDecision';
    label: string;
    status: 'ready' | 'hold' | 'blocked';
    detail: string;
  }>;
  reviewNote: string;
  disposition: 'detailedStressManualComparisonCloseoutOnly';
};

type TaxPressureRow = {
  year: number;
  tax: number;
  taxableIncome: number;
  oasClawback: number;
  registeredWithdrawals: number;
  pressure: 'low' | 'medium' | 'high';
  reason: string;
};

type ReconciliationDiagnostics = {
  rowsChecked: number;
  warningCount: number;
  firstWarningYear: number | null;
  maxReconciliationGap: number;
  maxCashFlowDelta: number;
  status: 'ok' | 'warning';
};

export const stressExtractionBoundary: StressExtractionBoundary = {
  source: 'simulationResultRows',
  ownsBaselineStressRead: true,
  ownsSpendingStressReruns: true,
  ownsSpendingStressSummary: true,
  ownsMonteCarlo: false,
  ownsHistoricalSequence: false,
  changesSimulationMath: false,
  persistedOutput: 'none',
  disposition: 'stressExtractionBoundaryOnly'
};

export const detailedStressBoundaryReview: DetailedStressBoundaryReview = {
  status: 'holdInDetailedReport',
  headline: 'Detailed stress tools stay in the detailed report for now.',
  detail:
    'Monte Carlo, progressive Monte Carlo, and historical sequence replay are still owned by the detailed-report engine path. The React stress helper can review the boundary before any migration.',
  rows: [
    {
      id: 'monteCarlo',
      label: 'Monte Carlo',
      status: 'hold',
      detail: 'The synchronous Monte Carlo engine remains in the detailed-report path and is protected by existing probes.',
      disposition: 'detailedStressBoundaryEvidenceOnly'
    },
    {
      id: 'progressiveMonteCarlo',
      label: 'Progressive Monte Carlo',
      status: 'hold',
      detail: 'The progressive path remains in the detailed-report path so async lifecycle behavior is not disturbed.',
      disposition: 'detailedStressBoundaryEvidenceOnly'
    },
    {
      id: 'historicalSequence',
      label: 'Historical sequence replay',
      status: 'hold',
      detail: 'Historical sequence replay remains in the detailed-report path until a thin plan-and-runner adapter is designed.',
      disposition: 'detailedStressBoundaryEvidenceOnly'
    },
    {
      id: 'fullSpendingFunded',
      label: 'Full-spending-funded metric',
      status: 'ready',
      detail: 'The detailed stress output already uses the consumer-safe full-spending-funded framing.',
      disposition: 'detailedStressBoundaryEvidenceOnly'
    },
    {
      id: 'dashboardOwnership',
      label: 'Current ownership',
      status: 'hold',
      detail: 'Detailed stress execution is still owned by the extracted detailed-report engine source, not React.',
      disposition: 'detailedStressBoundaryEvidenceOnly'
    },
    {
      id: 'probeCoverage',
      label: 'Probe coverage',
      status: 'ready',
      detail: 'Existing probes cover Monte Carlo, progressive lifecycle, historical sequence stress, and parity outputs.',
      disposition: 'detailedStressBoundaryEvidenceOnly'
    },
    {
      id: 'savedPlan',
      label: 'Saved-plan boundary',
      status: 'ready',
      detail: 'Detailed stress output remains runtime/report evidence and is not written into editable plan files.',
      disposition: 'detailedStressBoundaryEvidenceOnly'
    }
  ],
  nextStep:
    'Before moving detailed stress execution, add a thin adapter contract that accepts an explicit plan and config and returns the existing detailed stress shapes unchanged.',
  reviewNote:
    'Detailed stress boundary review only. It does not run Monte Carlo in React, migrate historical replay, change simulation math, or save stress output.',
  disposition: 'detailedStressBoundaryReviewOnly'
};

function n(value: number | undefined): number {
  return Number.isFinite(value) ? Number(value) : 0;
}

function rowsFrom(result: SimulationResult | null | undefined): AnnualSimulationRow[] {
  return result?.years || [];
}

function firstYearSpending(result: SimulationResult | null | undefined): number {
  const first = rowsFrom(result)[0];
  return n(first?.totalAftaxYear || first?.spending);
}

function hasVisibleShortfall(result: SimulationResult | null | undefined): boolean {
  return rowsFrom(result).some((row) => n(row.shortfall) > RECONCILIATION_TOLERANCE);
}

export function createSpendingStressPlan(plan: V2PlanPayload, multiplier: number): V2PlanPayload {
  const stressPlan = extractPlanPayload(plan);
  stressPlan.spending.gogo = Math.round((stressPlan.spending.gogo || 0) * multiplier);
  return stressPlan;
}

export function runSpendingStressResults({
  plan,
  baseline,
  baselineConfig,
  spendLessResult,
  runner
}: {
  plan: V2PlanPayload;
  baseline: SimulationResult;
  baselineConfig: SimulationConfig;
  spendLessResult?: SimulationResult;
  runner: SpendingStressRunner;
}): SpendingStressResults {
  const results: SpendingStressResults = {
    current: baseline,
    littleLess: runner(createSpendingStressPlan(plan, 0.95), baselineConfig),
    meaningfullyLess: spendLessResult ?? runner(createSpendingStressPlan(plan, 0.9), baselineConfig)
  };

  if (!hasVisibleShortfall(baseline)) {
    results.littleMore = runner(createSpendingStressPlan(plan, 1.05), baselineConfig);
  }

  return results;
}

function selectCashFlowReconciliation(row: AnnualSimulationRow | null | undefined) {
  if (!row) {
    return {
      year: null,
      reconciliationDelta: 0,
      cashFlowDelta: 0,
      status: 'ok' as const
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
    reconciliationDelta,
    cashFlowDelta,
    status: underfundedSpending ? ('warning' as const) : ('ok' as const)
  };
}

function selectReconciliationDiagnostics(result: SimulationResult | null | undefined): ReconciliationDiagnostics {
  const rows = rowsFrom(result).map((row) => selectCashFlowReconciliation(row));
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

function selectOverviewProjectionYears(result: SimulationResult | null | undefined): number {
  return rowsFrom(result).length;
}

function selectTaxPressureRows(result: SimulationResult | null | undefined): TaxPressureRow[] {
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

export function selectStressIndicatorRows(result: SimulationResult | null | undefined): StressIndicatorRow[] {
  const rows = rowsFrom(result);
  const shortfallRows = rows.filter((row) => n(row.shortfall) > RECONCILIATION_TOLERANCE);
  const depletionRow = rows.find((row) => n(row.bal_total) <= RECONCILIATION_TOLERANCE);
  const minimumPortfolioRow = rows.reduce<AnnualSimulationRow | null>((min, row) => {
    if (!min || n(row.bal_total) < n(min.bal_total)) return row;
    return min;
  }, null);
  const terminalPortfolio = n(rows[rows.length - 1]?.bal_total);
  const worstShortfall = shortfallRows.reduce((worst, row) => Math.max(worst, n(row.shortfall)), 0);

  return [
    {
      id: 'shortfall',
      label: 'First shortfall year',
      value: shortfallRows[0] ? `${shortfallRows[0].year} (${Math.round(worstShortfall).toLocaleString()})` : 'None',
      severity: shortfallRows.length > 0 ? 'watch' : 'ok'
    },
    {
      id: 'depletion',
      label: 'Portfolio depletion',
      value: depletionRow ? String(depletionRow.year) : 'Not depleted',
      severity: depletionRow ? 'watch' : 'ok'
    },
    {
      id: 'minimumPortfolio',
      label: 'Lowest portfolio',
      value: minimumPortfolioRow ? `${minimumPortfolioRow.year} (${Math.round(n(minimumPortfolioRow.bal_total)).toLocaleString()})` : '-',
      severity: n(minimumPortfolioRow?.bal_total) <= RECONCILIATION_TOLERANCE ? 'watch' : 'ok'
    },
    {
      id: 'terminalPortfolio',
      label: 'Terminal portfolio',
      value: `$${Math.round(terminalPortfolio).toLocaleString()}`,
      severity: terminalPortfolio <= RECONCILIATION_TOLERANCE ? 'watch' : 'ok'
    },
    {
      id: 'fundedYears',
      label: 'Years with full funding',
      value: `${rows.length - shortfallRows.length}/${rows.length || 0}`,
      severity: shortfallRows.length > 0 ? 'watch' : 'ok'
    }
  ];
}

function stressSeverityRank(severity: StressSeverity): number {
  if (severity === 'watch') return 2;
  if (severity === 'review') return 1;
  return 0;
}

function stressPriority(row: StressTestRow): number {
  if (row.id === 'sourceReconciliation') return 5;
  if (row.id === 'spendingShortfall') return 4;
  if (row.id === 'portfolioDepletion') return 3;
  if (row.id === 'portfolioCushion') return 2;
  if (row.id === 'taxPressure') return 1;
  return 0;
}

export function selectStressTestRows(result: SimulationResult | null | undefined): StressTestRow[] {
  const rows = rowsFrom(result);
  const projectionYears = selectOverviewProjectionYears(result);
  const diagnostics = selectReconciliationDiagnostics(result);
  const taxPressureRows = selectTaxPressureRows(result);
  const firstShortfall = rows.find((row) => n(row.shortfall) > RECONCILIATION_TOLERANCE);
  const worstShortfall = rows.reduce((worst, row) => Math.max(worst, n(row.shortfall)), 0);
  const depletionRow = rows.find((row) => n(row.bal_total) <= RECONCILIATION_TOLERANCE);
  const minimumPortfolioRow = rows.reduce<AnnualSimulationRow | null>((min, row) => {
    if (!min || n(row.bal_total) < n(min.bal_total)) return row;
    return min;
  }, null);
  const lowestPortfolio = n(minimumPortfolioRow?.bal_total);
  const firstYearSpending = Math.max(n(rows[0]?.totalAftaxYear || rows[0]?.spending), 1);
  const cushionYears = lowestPortfolio / firstYearSpending;
  const highTaxPressure = taxPressureRows.find((row) => row.pressure === 'high');
  const firstTaxPressure = highTaxPressure || taxPressureRows[0];

  return [
    {
      id: 'spendingShortfall',
      label: 'Spending shortfall',
      severity: firstShortfall ? 'watch' : 'ok',
      year: firstShortfall?.year ?? null,
      value: firstShortfall ? `$${Math.round(worstShortfall).toLocaleString()}` : 'None',
      evidence: firstShortfall
        ? `The first visible shortfall appears in ${firstShortfall.year}.`
        : `All ${projectionYears || 0} projection years fund planned spending within tolerance.`,
      reviewAction: firstShortfall ? 'Review Annual Detail and test spending or timing changes.' : 'No spending shortfall review is needed from this baseline run.',
      detailArea: 'annualDetail'
    },
    {
      id: 'portfolioDepletion',
      label: 'Portfolio depletion',
      severity: depletionRow ? 'watch' : 'ok',
      year: depletionRow?.year ?? null,
      value: depletionRow ? String(depletionRow.year) : 'Not depleted',
      evidence: depletionRow
        ? `Total portfolio reaches zero or below tolerance in ${depletionRow.year}.`
        : 'The total portfolio remains above zero through the visible projection.',
      reviewAction: depletionRow ? 'Review the depletion year and nearby withdrawal rows.' : 'Use this as a baseline check, then compare richer stress runs in the detailed report.',
      detailArea: 'accounts'
    },
    {
      id: 'portfolioCushion',
      label: 'Lowest portfolio cushion',
      severity: lowestPortfolio <= RECONCILIATION_TOLERANCE ? 'watch' : cushionYears < 2 ? 'review' : 'ok',
      year: minimumPortfolioRow?.year ?? null,
      value: minimumPortfolioRow ? `$${Math.round(lowestPortfolio).toLocaleString()}` : '-',
      evidence: minimumPortfolioRow
        ? `Lowest visible portfolio is about ${cushionYears.toFixed(1)}x first-year after-tax spending.`
        : 'No portfolio rows are available yet.',
      reviewAction:
        lowestPortfolio <= RECONCILIATION_TOLERANCE
          ? 'Review depletion and shortfall rows before relying on the path.'
          : cushionYears < 2
            ? 'Review whether the terminal cushion is comfortable enough for uncertainty.'
            : 'Cushion looks adequate in the baseline projection; stress scenarios may still change that.',
      detailArea: 'accounts'
    },
    {
      id: 'taxPressure',
      label: 'Tax pressure',
      severity: highTaxPressure ? 'watch' : taxPressureRows.length > 0 ? 'review' : 'ok',
      year: firstTaxPressure?.year ?? null,
      value: firstTaxPressure ? `${firstTaxPressure.pressure} pressure` : 'None detected',
      evidence: firstTaxPressure
        ? `${firstTaxPressure.reason} in ${firstTaxPressure.year}.`
        : 'No major OAS clawback or registered-withdrawal tax pressure was detected.',
      reviewAction: firstTaxPressure ? 'Review the Taxes tab and check whether timing or withdrawal order matters.' : 'No tax stress item surfaced from the baseline run.',
      detailArea: 'taxes'
    },
    {
      id: 'sourceReconciliation',
      label: 'Money-in / money-out check',
      severity: diagnostics.status === 'warning' ? 'watch' : 'ok',
      year: diagnostics.firstWarningYear,
      value: diagnostics.status === 'warning' ? `$${Math.round(diagnostics.maxReconciliationGap).toLocaleString()} gap` : 'Clean',
      evidence:
        diagnostics.status === 'warning'
          ? `First reconciliation warning appears in ${diagnostics.firstWarningYear}.`
          : `${diagnostics.rowsChecked} annual rows reconcile within tolerance.`,
      reviewAction:
        diagnostics.status === 'warning'
          ? 'Review Cash Flow before trusting stress conclusions.'
          : 'Reconciliation is clean enough for the baseline stress read.',
      detailArea: 'cashFlow'
    }
  ];
}

export function selectStressTestSummary(result: SimulationResult | null | undefined): StressTestSummary {
  const rows = rowsFrom(result);
  const stressRows = selectStressTestRows(result);
  const sorted = [...stressRows].sort(
    (a, b) => stressSeverityRank(b.severity) - stressSeverityRank(a.severity) || stressPriority(b) - stressPriority(a)
  );
  const worst = sorted[0];
  const watchCount = stressRows.filter((row) => row.severity === 'watch').length;
  const reviewCount = stressRows.filter((row) => row.severity === 'review').length;
  const shortfallRows = rows.filter((row) => n(row.shortfall) > RECONCILIATION_TOLERANCE);
  const firstStressYear = sorted
    .filter((row) => row.severity !== 'ok' && row.year)
    .map((row) => row.year as number)
    .sort((a, b) => a - b)[0] ?? null;
  const status: StressSeverity = watchCount > 0 ? 'watch' : reviewCount > 0 ? 'review' : 'ok';

  return {
    status,
    headline:
      status === 'watch'
        ? 'The baseline projection has stress points to review before relying on it.'
        : status === 'review'
          ? 'The baseline projection is funded, with cushion or tax items worth reviewing.'
          : 'The baseline projection has no major stress flags in the visible years.',
    detail:
      status === 'ok'
        ? 'Use this as the first read, then use the detailed report for Monte Carlo and historical sequence stress.'
        : `Review ${watchCount + reviewCount} stress item${watchCount + reviewCount === 1 ? '' : 's'} before treating the path as durable.`,
    totalYears: rows.length,
    fundedYears: rows.length - shortfallRows.length,
    firstStressYear,
    worstStressLabel: worst?.severity !== 'ok' ? worst.label : 'No major stress item',
    stableDashboardHandoff: 'Complete risk tables, historical sequence stress, and detailed risk charts remain in the detailed report.'
  };
}

function summarizeSpendingStressResult(result: SimulationResult | null | undefined) {
  const rows = rowsFrom(result);
  const firstShortfall = rows.find((row) => n(row.shortfall) > RECONCILIATION_TOLERANCE);
  const lastRow = rows[rows.length - 1];
  return {
    rows,
    fundedYears: rows.filter((row) => n(row.shortfall) <= RECONCILIATION_TOLERANCE).length,
    totalYears: rows.length,
    firstShortfallYear: firstShortfall ? n(firstShortfall.year) : null,
    endPortfolio: n(lastRow?.bal_total),
    lifetimeTax: rows.reduce((sum, row) => sum + n(row.totalTaxYear), 0)
  };
}

function spendingStressNote(row: SpendingStressRow): string {
  if (row.firstShortfallYear) return `First visible shortfall appears in ${row.firstShortfallYear}.`;
  if (row.id === 'littleMore') return 'Higher spending remains funded in this first-pass stress check.';
  if (row.id === 'littleLess' || row.id === 'meaningfullyLess') return 'Lower spending stays funded in this first-pass stress check.';
  return 'Current spending is the comparison point.';
}

export function selectSpendingStressSummary(
  baseline: SimulationResult | null | undefined,
  stressResults: Partial<Record<SpendingStressId, SimulationResult | null | undefined>>,
  plan: V2PlanPayload | null | undefined
): SpendingStressSummary {
  const base = summarizeSpendingStressResult(baseline);
  const earlySpending = n(plan?.spending?.gogo) || firstYearSpending(baseline);
  const estateTarget = n(plan?.inheritance);
  if (!base.totalYears || !earlySpending) {
    return {
      status: 'cannotTell',
      label: 'Cannot check spending stress yet',
      headline: 'Spending stress needs a completed projection first.',
      detail: 'Clear required inputs, then rerun Results to compare nearby spending levels.',
      rows: [],
      reviewNote: 'This check is review evidence only and does not change the saved plan.'
    };
  }

  const labels: Record<SpendingStressId, string> = {
    current: 'Current spending',
    littleLess: 'A little less',
    meaningfullyLess: 'Meaningfully less',
    littleMore: 'A little more'
  };
  const multipliers: Record<SpendingStressId, number> = {
    current: 1,
    littleLess: 0.95,
    meaningfullyLess: 0.9,
    littleMore: 1.05
  };
  const order: SpendingStressId[] = ['current', 'littleLess', 'meaningfullyLess', 'littleMore'];
  const rows = order
    .map((id) => {
      const summary = id === 'current' ? base : summarizeSpendingStressResult(stressResults[id]);
      if (!summary.totalYears) return null;
      const row: SpendingStressRow = {
        id,
        label: labels[id],
        earlySpending: Math.round(earlySpending * multipliers[id]),
        fundedYears: summary.fundedYears,
        totalYears: summary.totalYears,
        firstShortfallYear: summary.firstShortfallYear,
        endPortfolio: summary.endPortfolio,
        endPortfolioDelta: summary.endPortfolio - base.endPortfolio,
        lifetimeTax: summary.lifetimeTax,
        lifetimeTaxDelta: summary.lifetimeTax - base.lifetimeTax,
        note: ''
      };
      return { ...row, note: spendingStressNote(row) };
    })
    .filter((row): row is SpendingStressRow => Boolean(row));

  const littleLess = rows.find((row) => row.id === 'littleLess');
  const meaningfullyLess = rows.find((row) => row.id === 'meaningfullyLess');
  const littleMore = rows.find((row) => row.id === 'littleMore');
  const lowerRepairs =
    Boolean(base.firstShortfallYear) &&
    Boolean((littleLess && !littleLess.firstShortfallYear) || (meaningfullyLess && !meaningfullyLess.firstShortfallYear));
  const higherCreatesShortfall = Boolean(littleMore?.firstShortfallYear);
  const higherTaxDelta = littleMore ? littleMore.lifetimeTaxDelta : 0;
  const higherTaxMaterial = littleMore ? higherTaxDelta > Math.max(5000, Math.abs(base.lifetimeTax) * 0.05) : false;
  const estateStillVisible = !estateTarget || (littleMore ? littleMore.endPortfolio >= estateTarget : true);
  const higherHasRoom = Boolean(littleMore && !littleMore.firstShortfallYear && !higherTaxMaterial && estateStillVisible);

  let status: SpendingStressStatus = 'balanced';
  if (lowerRepairs || higherCreatesShortfall) status = 'fragile';
  else if (higherHasRoom) status = 'roomToReview';

  const labelByStatus: Record<SpendingStressStatus, string> = {
    cannotTell: 'Cannot check spending stress yet',
    fragile: 'Spending looks fragile',
    balanced: 'Spending looks balanced',
    roomToReview: 'Spending has room to review'
  };
  const headlineByStatus: Record<SpendingStressStatus, string> = {
    cannotTell: 'Spending stress needs a completed projection first.',
    fragile: lowerRepairs
      ? 'Small spending reductions materially improve the funding picture.'
      : 'A small spending increase creates a visible shortfall.',
    balanced: 'Nearby spending changes do not materially change readiness in this check.',
    roomToReview: 'A small spending increase remains funded in this first-pass check.'
  };
  const detailByStatus: Record<SpendingStressStatus, string> = {
    cannotTell: 'Clear required inputs, then rerun Results to compare nearby spending levels.',
    fragile: 'Use this as a review prompt for lifestyle, timing, tax, and contingency choices before relying on the plan.',
    balanced: 'This does not prove the spending level is certain; it only shows the nearby stress checks did not change the first-pass answer much.',
    roomToReview: 'This is room to review, not a recommendation to spend more. Taxes, estate wishes, survivor impact, and market risk still matter.'
  };

  return {
    status,
    label: labelByStatus[status],
    headline: headlineByStatus[status],
    detail: detailByStatus[status],
    rows,
    reviewNote: 'Spending stress is review evidence only. It does not change your saved plan or apply an optimized strategy.'
  };
}

export function selectStressExtractionReadinessSummary(
  boundary: StressExtractionBoundary = stressExtractionBoundary
): StressExtractionReadinessSummary {
  const rows: StressExtractionReadinessSummary['rows'] = [
    {
      id: 'baselineRows',
      label: 'Baseline stress rows',
      status: boundary.ownsBaselineStressRead && boundary.source === 'simulationResultRows' ? 'ready' : 'blocked',
      detail: 'The React baseline stress read is now owned by an engine helper that reads simulation result rows.'
    },
    {
      id: 'reviewSelectors',
      label: 'Review selectors',
      status: boundary.changesSimulationMath ? 'blocked' : 'ready',
      detail: 'Stress selectors summarize existing rows and do not alter simulation calculations.'
    },
    {
      id: 'spendingStress',
      label: 'Spending stress',
      status: boundary.ownsSpendingStressReruns && boundary.ownsSpendingStressSummary ? 'ready' : 'hold',
      detail:
        boundary.ownsSpendingStressReruns && boundary.ownsSpendingStressSummary
          ? 'Nearby spending reruns and summary interpretation are owned by the stress helper boundary.'
          : 'Nearby spending stress is not fully owned by the stress helper boundary yet.'
    },
    {
      id: 'monteCarlo',
      label: 'Monte Carlo and sequence stress',
      status: boundary.ownsMonteCarlo && boundary.ownsHistoricalSequence ? 'ready' : 'hold',
      detail: 'Monte Carlo and historical sequence stress remain in the detailed report path for now.'
    },
    {
      id: 'savedPlan',
      label: 'Saved-plan boundary',
      status: boundary.persistedOutput === 'none' ? 'ready' : 'blocked',
      detail: 'Stress extraction evidence is runtime-only and does not enter saved plan files.'
    }
  ];
  const blocked = rows.some((row) => row.status === 'blocked');
  const held = rows.some((row) => row.status === 'hold');

  return {
    status: blocked ? 'blocked' : held ? 'holdForScenarioStress' : 'readyForReviewStressOwnership',
    headline: blocked
      ? 'Stress extraction needs cleanup.'
      : held
        ? 'Baseline and nearby spending stress ownership are extracted; richer stress tools can move later.'
        : 'Stress helper ownership is ready.',
    detail:
      'This covers the review-facing baseline stress read and nearby spending stress. It keeps richer stress tooling on the detailed-report path for now.',
    rows,
    reviewNote:
      'Stress extraction readiness only. It does not change simulation math, optimizer behavior, or saved plan files.',
    disposition: 'stressExtractionReadinessOnly'
  };
}

export function selectDetailedStressBoundaryReview({
  includeProbeCoverage = true,
  savedPlanClean = true
}: {
  includeProbeCoverage?: boolean;
  savedPlanClean?: boolean;
} = {}): DetailedStressBoundaryReview {
  const rows = detailedStressBoundaryReview.rows.map((row) => {
    if (row.id === 'probeCoverage' && !includeProbeCoverage) {
      return {
        ...row,
        status: 'blocked' as const,
        detail: 'Probe coverage must be present before detailed stress execution moves.'
      };
    }
    if (row.id === 'savedPlan' && !savedPlanClean) {
      return {
        ...row,
        status: 'blocked' as const,
        detail: 'Detailed stress output must stay out of editable plan files before migration.'
      };
    }
    return row;
  });
  const blocked = rows.some((row) => row.status === 'blocked');

  return {
    ...detailedStressBoundaryReview,
    status: blocked ? 'blocked' : 'holdInDetailedReport',
    headline: blocked
      ? 'Detailed stress migration is blocked.'
      : detailedStressBoundaryReview.headline,
    detail: blocked
      ? 'Probe coverage and saved-plan boundaries must be clean before detailed stress tools move.'
      : detailedStressBoundaryReview.detail,
    rows
  };
}

export function selectDetailedStressMigrationCloseout({
  boundaryReview,
  stressReadiness
}: {
  boundaryReview: DetailedStressBoundaryReview;
  stressReadiness: StressExtractionReadinessSummary;
}): DetailedStressMigrationCloseout {
  const blocked = boundaryReview.status === 'blocked' || stressReadiness.status === 'blocked';
  const readyForThinAdapter = !blocked && boundaryReview.rows.find((row) => row.id === 'probeCoverage')?.status === 'ready';

  return {
    status: blocked ? 'blocked' : readyForThinAdapter ? 'readyForThinAdapter' : 'holdDetailedStress',
    headline: blocked
      ? 'Hold before detailed stress migration.'
      : 'Ready to design a thin detailed-stress adapter.',
    detail: blocked
      ? 'A boundary or probe check needs cleanup before the richer stress tools move.'
      : 'The next safe step is an adapter contract, not moving Monte Carlo or historical replay into React yet.',
    rows: [
      {
        id: 'boundaryReview',
        label: 'Detailed stress boundary',
        status: boundaryReview.status === 'blocked' ? 'blocked' : 'hold',
        detail: boundaryReview.headline
      },
      {
        id: 'baselineStress',
        label: 'Baseline stress helper',
        status: stressReadiness.rows.find((row) => row.id === 'baselineRows')?.status ?? 'blocked',
        detail: 'Baseline stress read stays owned by the stress helper.'
      },
      {
        id: 'spendingStress',
        label: 'Spending stress helper',
        status: stressReadiness.rows.find((row) => row.id === 'spendingStress')?.status ?? 'blocked',
        detail: 'Nearby spending stress stays owned by the stress helper.'
      },
      {
        id: 'savedPlan',
        label: 'Saved-plan boundary',
        status:
          boundaryReview.rows.find((row) => row.id === 'savedPlan')?.status === 'ready' &&
          stressReadiness.rows.find((row) => row.id === 'savedPlan')?.status === 'ready'
            ? 'ready'
            : 'blocked',
        detail: 'Stress migration evidence remains runtime-only.'
      }
    ],
    reviewNote:
      'Detailed stress migration closeout only. It does not move Monte Carlo, run historical replay in React, change optimizer behavior, or save stress output.',
    disposition: 'detailedStressMigrationCloseoutOnly'
  };
}

export function selectDetailedStressAdapterContract({
  acceptsExplicitPlan = true,
  acceptsExplicitConfig = true,
  readsGlobalDashboardState = false,
  reactMayRunMonteCarlo = false,
  reactMayRunHistoricalReplay = false,
  runnerMode = 'injectedOnly',
  returnsExistingShapes = true,
  changesStressMath = false,
  persistedOutput = 'none'
}: {
  acceptsExplicitPlan?: boolean;
  acceptsExplicitConfig?: boolean;
  readsGlobalDashboardState?: boolean;
  reactMayRunMonteCarlo?: boolean;
  reactMayRunHistoricalReplay?: boolean;
  runnerMode?: DetailedStressAdapterContract['executionBoundary']['runnerMode'];
  returnsExistingShapes?: boolean;
  changesStressMath?: boolean;
  persistedOutput?: DetailedStressAdapterContract['outputBoundary']['persistedOutput'];
} = {}): DetailedStressAdapterContract {
  const inputPlanReady = acceptsExplicitPlan && !readsGlobalDashboardState;
  const inputConfigReady = acceptsExplicitConfig && !readsGlobalDashboardState;
  const runnerReady = runnerMode === 'injectedOnly' && !reactMayRunMonteCarlo && !reactMayRunHistoricalReplay;
  const outputReady = returnsExistingShapes && !changesStressMath;
  const savedPlanReady = persistedOutput === 'none';
  const rows: DetailedStressAdapterContract['rows'] = [
    {
      id: 'inputPlan',
      label: 'Explicit plan input',
      status: inputPlanReady ? 'ready' : 'blocked',
      detail: inputPlanReady
        ? 'The adapter contract accepts an explicit plan object instead of reading dashboard state.'
        : 'The adapter must accept an explicit plan object and avoid dashboard state.'
    },
    {
      id: 'inputConfig',
      label: 'Explicit stress settings',
      status: inputConfigReady ? 'ready' : 'blocked',
      detail: inputConfigReady
        ? 'Stress settings are passed as explicit config for a future runner.'
        : 'Stress settings must be passed explicitly before the adapter can be prototyped.'
    },
    {
      id: 'runnerOwnership',
      label: 'Runner ownership',
      status: runnerReady ? 'hold' : 'blocked',
      detail: runnerReady
        ? 'Monte Carlo and historical replay stay in the detailed-report engine path behind an injected runner.'
        : 'React must not directly run Monte Carlo or historical replay in this contract.'
    },
    {
      id: 'outputShape',
      label: 'Existing output shape',
      status: outputReady ? 'ready' : 'blocked',
      detail: outputReady
        ? 'The adapter must return the existing detailed stress shapes unchanged.'
        : 'The adapter cannot change detailed stress math or output shapes.'
    },
    {
      id: 'savedPlan',
      label: 'Saved-plan boundary',
      status: savedPlanReady ? 'ready' : 'blocked',
      detail: savedPlanReady
        ? 'Adapter output remains runtime/report evidence and does not enter editable plan files.'
        : 'Adapter output must not be written into editable plan files.'
    }
  ];
  const blocked = rows.some((row) => row.status === 'blocked');

  return {
    status: blocked ? 'blocked' : 'readyForInjectedRunner',
    headline: blocked
      ? 'Detailed stress adapter contract needs cleanup.'
      : 'Thin detailed-stress adapter contract is ready to prototype.',
    detail: blocked
      ? 'The adapter must keep explicit inputs, injected execution, existing output shapes, and clean saved-plan boundaries.'
      : 'This contract can connect explicit plan inputs to the existing detailed stress runner later without moving stress execution into React.',
    inputBoundary: {
      acceptsExplicitPlan,
      acceptsExplicitConfig,
      readsGlobalDashboardState
    },
    executionBoundary: {
      owner: 'detailedReportEngine',
      reactMayRunMonteCarlo,
      reactMayRunHistoricalReplay,
      runnerMode
    },
    outputBoundary: {
      returnsExistingShapes,
      changesStressMath,
      persistedOutput
    },
    rows,
    reviewNote:
      'Adapter contract only. It does not run Monte Carlo, run historical replay, change stress calculations, or save detailed stress output.',
    disposition: 'detailedStressAdapterContractOnly'
  };
}

export function selectDetailedStressAdapterValidation({
  boundaryReview,
  migrationCloseout,
  adapterContract
}: {
  boundaryReview: DetailedStressBoundaryReview;
  migrationCloseout: DetailedStressMigrationCloseout;
  adapterContract: DetailedStressAdapterContract;
}): DetailedStressAdapterValidation {
  const probeStatus = boundaryReview.rows.find((row) => row.id === 'probeCoverage')?.status ?? 'blocked';
  const savedPlanStatus =
    boundaryReview.rows.find((row) => row.id === 'savedPlan')?.status === 'ready' &&
    migrationCloseout.rows.find((row) => row.id === 'savedPlan')?.status === 'ready' &&
    adapterContract.rows.find((row) => row.id === 'savedPlan')?.status === 'ready'
      ? 'ready'
      : 'blocked';
  const rows: DetailedStressAdapterValidation['rows'] = [
    {
      id: 'boundaryReview',
      label: 'Boundary review',
      status: boundaryReview.status === 'blocked' ? 'blocked' : 'hold',
      detail: boundaryReview.headline
    },
    {
      id: 'migrationCloseout',
      label: 'Migration closeout',
      status: migrationCloseout.status === 'blocked' ? 'blocked' : 'hold',
      detail: migrationCloseout.headline
    },
    {
      id: 'adapterContract',
      label: 'Adapter contract',
      status: adapterContract.status === 'blocked' ? 'blocked' : 'ready',
      detail: adapterContract.headline
    },
    {
      id: 'probeCoverage',
      label: 'Probe coverage',
      status: probeStatus,
      detail: 'Existing probes must continue to protect detailed stress execution before any adapter prototype.'
    },
    {
      id: 'savedPlan',
      label: 'Saved-plan boundary',
      status: savedPlanStatus,
      detail: 'Detailed stress adapter evidence must remain runtime-only.'
    }
  ];
  const blocked = rows.some((row) => row.status === 'blocked');

  return {
    status: blocked ? 'blocked' : 'validForPrototype',
    headline: blocked
      ? 'Hold the detailed stress adapter.'
      : 'Detailed stress adapter is valid for a narrow prototype.',
    detail: blocked
      ? 'A boundary, probe, or saved-plan check failed.'
      : 'The adapter can be prototyped as an injected runner contract while detailed stress execution stays where it is.',
    rows,
    nextStep: 'Prototype an injected runner wrapper that accepts explicit inputs and returns existing detailed stress shapes unchanged.',
    reviewNote:
      'Adapter validation only. It does not execute stress scenarios, migrate Monte Carlo, migrate historical replay, or save adapter output.',
    disposition: 'detailedStressAdapterValidationOnly'
  };
}

export function selectDetailedStressAdapterBatchCloseout({
  adapterContract,
  adapterValidation
}: {
  adapterContract: DetailedStressAdapterContract;
  adapterValidation: DetailedStressAdapterValidation;
}): DetailedStressAdapterBatchCloseout {
  const blocked = adapterContract.status === 'blocked' || adapterValidation.status === 'blocked';

  return {
    status: blocked ? 'blocked' : 'readyForThinAdapterPrototype',
    headline: blocked
      ? 'Detailed stress adapter batch is blocked.'
      : 'Ready for a contained detailed-stress adapter prototype.',
    detail: blocked
      ? 'Clean up the adapter contract or validation rows before prototyping.'
      : 'The next sprint can add a contained injected-runner prototype without moving Monte Carlo or historical replay into React.',
    rows: [
      {
        id: 'contract',
        label: 'Contract',
        status: adapterContract.status === 'blocked' ? 'blocked' : 'ready',
        detail: adapterContract.headline
      },
      {
        id: 'validation',
        label: 'Validation',
        status: adapterValidation.status === 'blocked' ? 'blocked' : 'ready',
        detail: adapterValidation.headline
      },
      {
        id: 'execution',
        label: 'Execution boundary',
        status:
          adapterContract.executionBoundary.runnerMode === 'injectedOnly' &&
          !adapterContract.executionBoundary.reactMayRunMonteCarlo &&
          !adapterContract.executionBoundary.reactMayRunHistoricalReplay
            ? 'hold'
            : 'blocked',
        detail: 'Detailed stress execution remains in the detailed-report engine path.'
      },
      {
        id: 'persistence',
        label: 'Persistence',
        status: adapterContract.outputBoundary.persistedOutput === 'none' ? 'ready' : 'blocked',
        detail: 'Adapter contract and validation output remain unsaved.'
      }
    ],
    reviewNote:
      'Detailed stress adapter batch closeout only. It does not add optimizer behavior, run detailed stress in React, change stress math, or persist adapter output.',
    disposition: 'detailedStressAdapterBatchCloseoutOnly'
  };
}

export function createDetailedStressAdapterRequest({
  plan,
  config = {},
  adapterValidation
}: {
  plan: V2PlanPayload;
  config?: SimulationConfig;
  adapterValidation: DetailedStressAdapterValidation;
}): DetailedStressAdapterRequest | null {
  if (adapterValidation.status !== 'validForPrototype') return null;

  return {
    requestId: 'detailedStressExplicitPlanRequest',
    plan: extractPlanPayload(plan),
    config: { ...config },
    source: 'explicitPlanAndConfig',
    readsGlobalDashboardState: false,
    persistedOutput: 'none',
    disposition: 'detailedStressAdapterRequestOnly'
  };
}

function injectedRunnerResultIsValid(
  result: DetailedStressInjectedRunnerResult | null | undefined
): result is DetailedStressInjectedRunnerResult {
  return (
    !!result &&
    result.shape === 'existingDetailedStressShape' &&
    (result.status === 'complete' || result.status === 'unavailable') &&
    (result.fullSpendingFundedRate === null ||
      (Number.isFinite(result.fullSpendingFundedRate) &&
        result.fullSpendingFundedRate >= 0 &&
        result.fullSpendingFundedRate <= 1)) &&
    (result.monteCarloRunCount === null ||
      (Number.isFinite(result.monteCarloRunCount) && result.monteCarloRunCount >= 0)) &&
    (result.historicalSequenceCount === null ||
      (Number.isFinite(result.historicalSequenceCount) && result.historicalSequenceCount >= 0)) &&
    Array.isArray(result.notes)
  );
}

export function runDetailedStressInjectedRunnerPrototype({
  plan,
  config = {},
  adapterValidation,
  runner
}: {
  plan: V2PlanPayload;
  config?: SimulationConfig;
  adapterValidation: DetailedStressAdapterValidation;
  runner?: DetailedStressInjectedRunner;
}): DetailedStressInjectedRunnerPrototype {
  const validationReady = adapterValidation.status === 'validForPrototype';
  const request = createDetailedStressAdapterRequest({ plan, config, adapterValidation });
  const rows: DetailedStressInjectedRunnerPrototype['rows'] = [
    {
      id: 'validation',
      label: 'Adapter validation',
      status: validationReady ? 'ready' : 'blocked',
      detail: validationReady
        ? 'Adapter validation is clean enough for a contained injected-runner prototype.'
        : 'Adapter validation must pass before a prototype runner can be called.'
    },
    {
      id: 'request',
      label: 'Explicit request',
      status: request ? 'ready' : 'blocked',
      detail: request
        ? 'The prototype request uses an explicit plan copy and explicit stress settings.'
        : 'No detailed stress request was created.'
    },
    {
      id: 'runner',
      label: 'Injected runner',
      status: runner ? 'hold' : 'blocked',
      detail: runner
        ? 'The prototype can call an injected detailed-report runner supplied by tests or a later bridge.'
        : 'No injected runner was supplied, so no detailed stress execution is attempted.'
    },
    {
      id: 'outputShape',
      label: 'Output shape',
      status: 'hold',
      detail: 'Runner output must match the existing detailed stress shape before it can be shown anywhere.'
    },
    {
      id: 'savedPlan',
      label: 'Saved-plan boundary',
      status: 'ready',
      detail: 'Prototype output remains runtime-only and is not written into editable plan files.'
    }
  ];

  if (!validationReady || !request) {
    return {
      status: 'blocked',
      headline: 'Detailed stress prototype is blocked.',
      detail: 'Adapter validation must pass before an injected runner can be called.',
      request,
      runnerCalled: false,
      result: null,
      rows,
      reviewNote:
        'Injected-runner prototype only. It does not run Monte Carlo in React, migrate historical replay, change stress math, or save output.',
      disposition: 'detailedStressInjectedRunnerPrototypeOnly'
    };
  }

  if (!runner) {
    return {
      status: 'notReady',
      headline: 'Detailed stress prototype is waiting for an injected runner.',
      detail: 'The explicit request is ready, but no runner was provided.',
      request,
      runnerCalled: false,
      result: null,
      rows,
      reviewNote:
        'Injected-runner prototype only. It does not run Monte Carlo in React, migrate historical replay, change stress math, or save output.',
      disposition: 'detailedStressInjectedRunnerPrototypeOnly'
    };
  }

  try {
    const result = runner(request);
    const validResult = injectedRunnerResultIsValid(result);
    const nextRows = rows.map((row) =>
      row.id === 'outputShape'
        ? {
            ...row,
            status: validResult ? ('ready' as const) : ('blocked' as const),
            detail: validResult
              ? 'The injected runner returned the existing detailed stress shape.'
              : 'The injected runner returned an unsupported detailed stress shape.'
          }
        : row
    );

    return {
      status: validResult ? 'prototypeComplete' : 'blocked',
      headline: validResult
        ? 'Contained detailed stress prototype completed.'
        : 'Detailed stress prototype returned an unsupported shape.',
      detail: validResult
        ? 'An injected runner accepted the explicit request and returned existing detailed stress output shape metadata.'
        : 'The prototype runner output must match the existing detailed stress shape before it can be used.',
      request,
      runnerCalled: true,
      result: validResult ? result : null,
      rows: nextRows,
      reviewNote:
        'Injected-runner prototype only. It does not run Monte Carlo in React, migrate historical replay, change stress math, or save output.',
      disposition: 'detailedStressInjectedRunnerPrototypeOnly'
    };
  } catch {
    return {
      status: 'blocked',
      headline: 'Detailed stress prototype runner failed.',
      detail: 'The injected runner must complete cleanly before this bridge can move forward.',
      request,
      runnerCalled: true,
      result: null,
      rows: rows.map((row) => (row.id === 'runner' ? { ...row, status: 'blocked' as const } : row)),
      reviewNote:
        'Injected-runner prototype only. It does not run Monte Carlo in React, migrate historical replay, change stress math, or save output.',
      disposition: 'detailedStressInjectedRunnerPrototypeOnly'
    };
  }
}

export function selectDetailedStressPrototypeBatchCloseout({
  adapterValidation,
  prototype
}: {
  adapterValidation: DetailedStressAdapterValidation;
  prototype: DetailedStressInjectedRunnerPrototype;
}): DetailedStressPrototypeBatchCloseout {
  const blocked = adapterValidation.status === 'blocked' || prototype.status === 'blocked';
  const complete = prototype.status === 'prototypeComplete';

  return {
    status: blocked ? 'blocked' : complete ? 'readyForProbeBackedRunner' : 'holdDetailedStress',
    headline: blocked
      ? 'Detailed stress prototype batch is blocked.'
      : complete
        ? 'Ready to connect a probe-backed detailed stress runner later.'
        : 'Hold detailed stress until a runner is supplied.',
    detail: blocked
      ? 'Clean up validation or injected-runner output before moving forward.'
      : complete
        ? 'The contained prototype can pass explicit inputs through an injected runner without changing detailed stress ownership.'
        : 'The request shape is ready, but detailed stress execution still needs an injected runner.',
    rows: [
      {
        id: 'request',
        label: 'Explicit request',
        status: prototype.request ? 'ready' : 'blocked',
        detail: 'The prototype uses a copied plan and explicit stress settings.'
      },
      {
        id: 'prototype',
        label: 'Prototype run',
        status: prototype.status === 'prototypeComplete' ? 'ready' : prototype.status === 'blocked' ? 'blocked' : 'hold',
        detail: prototype.headline
      },
      {
        id: 'executionBoundary',
        label: 'Execution boundary',
        status: 'hold',
        detail: 'Detailed stress execution remains owned by the detailed-report path.'
      },
      {
        id: 'persistence',
        label: 'Persistence',
        status: 'ready',
        detail: 'Request, prototype, and closeout output remain runtime-only.'
      }
    ],
    reviewNote:
      'Detailed stress prototype closeout only. It does not move Monte Carlo, run historical replay in React, change optimizer behavior, or persist output.',
    disposition: 'detailedStressPrototypeBatchCloseoutOnly'
  };
}

export function selectDetailedStressProbeCoverage({
  monteCarloCovered = true,
  progressiveMonteCarloCovered = true,
  historicalSequenceCovered = true,
  parityCovered = true,
  routeProbeCaveat = true
}: {
  monteCarloCovered?: boolean;
  progressiveMonteCarloCovered?: boolean;
  historicalSequenceCovered?: boolean;
  parityCovered?: boolean;
  routeProbeCaveat?: boolean;
} = {}): DetailedStressProbeCoverage {
  const rows: DetailedStressProbeCoverage['rows'] = [
    {
      id: 'monteCarlo',
      label: 'Monte Carlo probe',
      status: monteCarloCovered ? 'covered' : 'missing',
      detail: monteCarloCovered
        ? 'Existing probes cover the synchronous Monte Carlo shape.'
        : 'Synchronous Monte Carlo probe coverage is required before bridge work continues.'
    },
    {
      id: 'progressiveMonteCarlo',
      label: 'Progressive Monte Carlo probe',
      status: progressiveMonteCarloCovered ? 'covered' : 'missing',
      detail: progressiveMonteCarloCovered
        ? 'Existing probes cover progressive Monte Carlo lifecycle behavior.'
        : 'Progressive Monte Carlo lifecycle coverage is required before bridge work continues.'
    },
    {
      id: 'historicalSequence',
      label: 'Historical replay probe',
      status: historicalSequenceCovered ? 'covered' : 'missing',
      detail: historicalSequenceCovered
        ? 'Existing probes cover historical sequence stress behavior.'
        : 'Historical sequence probe coverage is required before bridge work continues.'
    },
    {
      id: 'parity',
      label: 'Engine parity probes',
      status: parityCovered ? 'covered' : 'missing',
      detail: parityCovered
        ? 'Engine parity probes continue to protect the extracted simulation boundary.'
        : 'Engine parity probes must pass before detailed stress bridge work continues.'
    },
    {
      id: 'routeCaveat',
      label: 'Route probe caveat',
      status: routeProbeCaveat ? 'caveat' : 'covered',
      detail: routeProbeCaveat
        ? 'The local route probe may be blocked by localhost bind permissions; this does not change detailed stress math coverage.'
        : 'No local route-probe caveat was reported.'
    }
  ];
  const missing = rows.some((row) => row.status === 'missing' || row.status === 'blocked');

  return {
    status: missing ? 'missingCoverage' : 'covered',
    headline: missing ? 'Detailed stress probe coverage needs cleanup.' : 'Detailed stress probe coverage is ready.',
    detail: missing
      ? 'Probe-backed bridge work should wait until detailed stress coverage is complete.'
      : 'The bridge can rely on existing detailed stress probes while keeping execution ownership unchanged.',
    rows,
    reviewNote:
      'Probe coverage review only. It does not run detailed stress in React, change stress calculations, or save probe output.',
    disposition: 'detailedStressProbeCoverageOnly'
  };
}

export function selectDetailedStressProbeBackedRunnerBridge({
  prototypeCloseout,
  probeCoverage,
  injectedRunnerAvailable = true,
  savedPlanClean = true
}: {
  prototypeCloseout: DetailedStressPrototypeBatchCloseout;
  probeCoverage: DetailedStressProbeCoverage;
  injectedRunnerAvailable?: boolean;
  savedPlanClean?: boolean;
}): DetailedStressProbeBackedRunnerBridge {
  const rows: DetailedStressProbeBackedRunnerBridge['rows'] = [
    {
      id: 'prototypeCloseout',
      label: 'Prototype closeout',
      status: prototypeCloseout.status === 'readyForProbeBackedRunner' ? 'ready' : prototypeCloseout.status === 'blocked' ? 'blocked' : 'hold',
      detail: prototypeCloseout.headline
    },
    {
      id: 'probeCoverage',
      label: 'Probe coverage',
      status: probeCoverage.status === 'covered' ? 'ready' : 'blocked',
      detail: probeCoverage.headline
    },
    {
      id: 'runnerInjection',
      label: 'Injected runner',
      status: injectedRunnerAvailable ? 'ready' : 'hold',
      detail: injectedRunnerAvailable
        ? 'A supplied runner can be used by the bridge.'
        : 'The bridge waits until a supplied runner is available.'
    },
    {
      id: 'executionBoundary',
      label: 'Execution boundary',
      status: 'hold',
      detail: 'Detailed stress execution remains owned by the detailed-report path.'
    },
    {
      id: 'savedPlan',
      label: 'Saved-plan boundary',
      status: savedPlanClean ? 'ready' : 'blocked',
      detail: savedPlanClean
        ? 'Bridge output remains runtime-only.'
        : 'Bridge output must not enter editable plan files.'
    }
  ];
  const blocked = rows.some((row) => row.status === 'blocked');

  return {
    status: blocked ? 'blocked' : injectedRunnerAvailable ? 'readyForManualBridge' : 'holdDetailedStress',
    headline: blocked
      ? 'Detailed stress bridge is blocked.'
      : injectedRunnerAvailable
        ? 'Detailed stress bridge is ready for a manual injected-runner check.'
        : 'Detailed stress bridge is waiting for a supplied runner.',
    detail: blocked
      ? 'Probe coverage, prototype closeout, and saved-plan boundaries must be clean before bridge checks.'
      : 'The bridge can call an injected detailed-report runner while keeping stress execution ownership unchanged.',
    rows,
    reviewNote:
      'Probe-backed bridge only. It does not move Monte Carlo, run historical replay in React, change stress math, or persist bridge output.',
    disposition: 'detailedStressProbeBackedRunnerBridgeOnly'
  };
}

export function runDetailedStressProbeBackedBridge({
  plan,
  config = {},
  adapterValidation,
  bridge,
  runner
}: {
  plan: V2PlanPayload;
  config?: SimulationConfig;
  adapterValidation: DetailedStressAdapterValidation;
  bridge: DetailedStressProbeBackedRunnerBridge;
  runner?: DetailedStressInjectedRunner;
}): DetailedStressProbeBackedBridgeRun {
  const bridgeReady = bridge.status === 'readyForManualBridge';
  const prototype = runDetailedStressInjectedRunnerPrototype({
    plan,
    config,
    adapterValidation,
    runner: bridgeReady ? runner : undefined
  });
  const complete = bridgeReady && prototype.status === 'prototypeComplete';
  const blocked = bridge.status === 'blocked' || prototype.status === 'blocked';

  return {
    status: blocked ? 'blocked' : complete ? 'bridgeComplete' : 'holdDetailedStress',
    headline: blocked
      ? 'Detailed stress bridge run is blocked.'
      : complete
        ? 'Detailed stress bridge run completed.'
        : 'Detailed stress bridge run is on hold.',
    detail: blocked
      ? 'Bridge readiness and injected-runner output must be clean before this can move forward.'
      : complete
        ? 'The probe-backed bridge accepted explicit inputs and returned existing detailed stress shape metadata.'
        : 'The bridge did not run because readiness or runner injection is not complete.',
    prototype,
    bridge,
    rows: [
      {
        id: 'bridge',
        label: 'Bridge readiness',
        status: bridge.status === 'readyForManualBridge' ? 'ready' : bridge.status === 'blocked' ? 'blocked' : 'hold',
        detail: bridge.headline
      },
      {
        id: 'request',
        label: 'Explicit request',
        status: prototype.request ? 'ready' : 'blocked',
        detail: prototype.request
          ? 'Bridge run used a copied explicit plan/config request.'
          : 'Bridge run could not create an explicit request.'
      },
      {
        id: 'runner',
        label: 'Injected runner',
        status: prototype.runnerCalled ? (prototype.status === 'blocked' ? 'blocked' : 'ready') : 'hold',
        detail: prototype.runnerCalled
          ? 'The supplied runner was called through the bridge.'
          : 'No detailed stress runner was called.'
      },
      {
        id: 'outputShape',
        label: 'Output shape',
        status: prototype.result ? 'ready' : prototype.status === 'blocked' ? 'blocked' : 'hold',
        detail: prototype.result
          ? 'Runner output matched existing detailed stress shape metadata.'
          : 'No accepted detailed stress output shape is available yet.'
      },
      {
        id: 'persistence',
        label: 'Persistence',
        status: 'ready',
        detail: 'Bridge run output remains runtime-only.'
      }
    ],
    reviewNote:
      'Probe-backed bridge run only. It does not move Monte Carlo, run historical replay in React, change optimizer behavior, or save bridge output.',
    disposition: 'detailedStressProbeBackedBridgeRunOnly'
  };
}

export function selectDetailedStressBridgeBatchCloseout({
  probeCoverage,
  bridge,
  bridgeRun
}: {
  probeCoverage: DetailedStressProbeCoverage;
  bridge: DetailedStressProbeBackedRunnerBridge;
  bridgeRun: DetailedStressProbeBackedBridgeRun;
}): DetailedStressBridgeBatchCloseout {
  const blocked = probeCoverage.status !== 'covered' || bridge.status === 'blocked' || bridgeRun.status === 'blocked';
  const complete = bridgeRun.status === 'bridgeComplete';

  return {
    status: blocked ? 'blocked' : complete ? 'readyForManualReportComparison' : 'holdDetailedStress',
    headline: blocked
      ? 'Detailed stress bridge batch is blocked.'
      : complete
        ? 'Ready for manual detailed-report comparison.'
        : 'Hold before detailed-report comparison.',
    detail: blocked
      ? 'Coverage, bridge readiness, and bridge run output must be clean before comparison work.'
      : complete
        ? 'The next safe slice is comparing bridge output against the detailed report without moving execution ownership.'
        : 'The bridge is not complete enough for report comparison yet.',
    rows: [
      {
        id: 'coverage',
        label: 'Probe coverage',
        status: probeCoverage.status === 'covered' ? 'ready' : 'blocked',
        detail: probeCoverage.headline
      },
      {
        id: 'bridge',
        label: 'Bridge readiness',
        status: bridge.status === 'readyForManualBridge' ? 'ready' : bridge.status === 'blocked' ? 'blocked' : 'hold',
        detail: bridge.headline
      },
      {
        id: 'bridgeRun',
        label: 'Bridge run',
        status: bridgeRun.status === 'bridgeComplete' ? 'ready' : bridgeRun.status === 'blocked' ? 'blocked' : 'hold',
        detail: bridgeRun.headline
      },
      {
        id: 'nextStep',
        label: 'Next step',
        status: complete ? 'ready' : 'hold',
        detail: 'Compare bridge output against the detailed report before any migration decision.'
      }
    ],
    reviewNote:
      'Detailed stress bridge closeout only. It does not migrate detailed stress execution, alter stress math, change optimizer behavior, or persist bridge output.',
    disposition: 'detailedStressBridgeBatchCloseoutOnly'
  };
}

function formatStressMetric(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'Not available';
  return Number.isInteger(value) ? String(value) : value.toFixed(3);
}

function metricAligned(
  bridgeValue: number | null | undefined,
  referenceValue: number | null | undefined,
  tolerance = 0
): boolean {
  if (bridgeValue === null || bridgeValue === undefined || referenceValue === null || referenceValue === undefined) {
    return bridgeValue === referenceValue;
  }
  return Math.abs(bridgeValue - referenceValue) <= tolerance;
}

export function createDetailedStressManualReportReference({
  fullSpendingFundedRate,
  monteCarloRunCount,
  historicalSequenceCount
}: {
  fullSpendingFundedRate: number | null;
  monteCarloRunCount: number | null;
  historicalSequenceCount: number | null;
}): DetailedStressManualReportReference {
  return {
    shape: 'existingDetailedStressShape',
    fullSpendingFundedRate,
    monteCarloRunCount,
    historicalSequenceCount,
    source: 'detailedReportReference',
    persistedOutput: 'none',
    disposition: 'detailedStressManualReportReferenceOnly'
  };
}

export function selectDetailedStressManualReportComparison({
  bridgeRun,
  reference,
  savedPlanClean = true,
  fullSpendingFundedTolerance = 0.001
}: {
  bridgeRun: DetailedStressProbeBackedBridgeRun;
  reference: DetailedStressManualReportReference;
  savedPlanClean?: boolean;
  fullSpendingFundedTolerance?: number;
}): DetailedStressManualReportComparison {
  const bridgeResult = bridgeRun.prototype.result;
  const bridgeComplete = bridgeRun.status === 'bridgeComplete' && !!bridgeResult;
  const shapeAligned = bridgeResult?.shape === reference.shape;
  const fundedAligned =
    bridgeComplete &&
    metricAligned(bridgeResult.fullSpendingFundedRate, reference.fullSpendingFundedRate, fullSpendingFundedTolerance);
  const monteCarloAligned =
    bridgeComplete && metricAligned(bridgeResult.monteCarloRunCount, reference.monteCarloRunCount);
  const historicalAligned =
    bridgeComplete && metricAligned(bridgeResult.historicalSequenceCount, reference.historicalSequenceCount);
  const rows: DetailedStressManualReportComparison['rows'] = [
    {
      id: 'bridgeRun',
      label: 'Bridge run',
      status: bridgeComplete ? 'aligned' : bridgeRun.status === 'blocked' ? 'blocked' : 'review',
      bridgeValue: bridgeRun.status,
      referenceValue: 'bridgeComplete',
      detail: bridgeComplete
        ? 'The bridge run completed before manual comparison.'
        : 'Manual comparison needs a completed bridge run.'
    },
    {
      id: 'shape',
      label: 'Output shape',
      status: shapeAligned ? 'aligned' : 'blocked',
      bridgeValue: bridgeResult?.shape ?? 'Not available',
      referenceValue: reference.shape,
      detail: shapeAligned
        ? 'Bridge output uses the existing detailed stress shape.'
        : 'Bridge output shape must match the detailed report reference.'
    },
    {
      id: 'fullSpendingFunded',
      label: 'Full-spending-funded rate',
      status: fundedAligned ? 'aligned' : 'review',
      bridgeValue: formatStressMetric(bridgeResult?.fullSpendingFundedRate),
      referenceValue: formatStressMetric(reference.fullSpendingFundedRate),
      detail: fundedAligned
        ? 'The bridge and detailed report rates align within tolerance.'
        : 'Review the full-spending-funded rate before trusting the bridge.'
    },
    {
      id: 'monteCarloRuns',
      label: 'Monte Carlo runs',
      status: monteCarloAligned ? 'aligned' : 'review',
      bridgeValue: formatStressMetric(bridgeResult?.monteCarloRunCount),
      referenceValue: formatStressMetric(reference.monteCarloRunCount),
      detail: monteCarloAligned
        ? 'Monte Carlo run count matches the detailed report reference.'
        : 'Review Monte Carlo run count before migration decisions.'
    },
    {
      id: 'historicalSequences',
      label: 'Historical sequences',
      status: historicalAligned ? 'aligned' : 'review',
      bridgeValue: formatStressMetric(bridgeResult?.historicalSequenceCount),
      referenceValue: formatStressMetric(reference.historicalSequenceCount),
      detail: historicalAligned
        ? 'Historical sequence count matches the detailed report reference.'
        : 'Review historical sequence count before migration decisions.'
    },
    {
      id: 'savedPlan',
      label: 'Saved-plan boundary',
      status: savedPlanClean ? 'aligned' : 'blocked',
      bridgeValue: savedPlanClean ? 'Runtime only' : 'Needs cleanup',
      referenceValue: 'Runtime only',
      detail: savedPlanClean
        ? 'Manual comparison output remains runtime-only.'
        : 'Manual comparison output must not enter editable plan files.'
    }
  ];
  const blocked = rows.some((row) => row.status === 'blocked');
  const needsReview = rows.some((row) => row.status === 'review');

  return {
    status: blocked ? 'blocked' : needsReview ? 'needsReview' : 'aligned',
    headline: blocked
      ? 'Detailed stress manual comparison is blocked.'
      : needsReview
        ? 'Detailed stress manual comparison needs review.'
        : 'Detailed stress bridge matches the detailed report reference.',
    detail: blocked
      ? 'Shape, bridge completion, and saved-plan boundaries must be clean before comparison can support a decision.'
      : needsReview
        ? 'Some detailed stress metrics differ from the reference and should be reviewed before any migration decision.'
        : 'Bridge output aligns with the detailed report reference metadata and can support the next decision checkpoint.',
    rows,
    reviewNote:
      'Manual detailed-stress comparison only. It does not migrate Monte Carlo, run historical replay in React, change stress math, or save comparison output.',
    disposition: 'detailedStressManualReportComparisonOnly'
  };
}

export function selectDetailedStressManualComparisonCloseout({
  comparison
}: {
  comparison: DetailedStressManualReportComparison;
}): DetailedStressManualComparisonCloseout {
  const blocked = comparison.status === 'blocked';
  const aligned = comparison.status === 'aligned';

  return {
    status: blocked ? 'blocked' : aligned ? 'readyForStressMigrationDecision' : 'holdDetailedStress',
    headline: blocked
      ? 'Detailed stress comparison closeout is blocked.'
      : aligned
        ? 'Ready for the detailed stress migration-or-deferral decision.'
        : 'Hold detailed stress migration decisions for review.',
    detail: blocked
      ? 'Manual comparison must be cleaned up before the detailed stress path can move forward.'
      : aligned
        ? 'The next checkpoint can decide whether detailed stress stays in the detailed report for v1 or moves behind a native adapter later.'
        : 'Metric differences should be reviewed before deciding whether to migrate or defer detailed stress work.',
    rows: [
      {
        id: 'comparison',
        label: 'Manual comparison',
        status: comparison.status === 'aligned' ? 'ready' : comparison.status === 'blocked' ? 'blocked' : 'hold',
        detail: comparison.headline
      },
      {
        id: 'executionBoundary',
        label: 'Execution boundary',
        status: 'hold',
        detail: 'Detailed stress execution remains owned by the detailed-report path.'
      },
      {
        id: 'persistence',
        label: 'Persistence',
        status: comparison.rows.find((row) => row.id === 'savedPlan')?.status === 'blocked' ? 'blocked' : 'ready',
        detail: 'Manual comparison output remains runtime-only.'
      },
      {
        id: 'nextDecision',
        label: 'Next decision',
        status: aligned ? 'ready' : 'hold',
        detail: 'Decide whether detailed stress migration is needed for v1 or should be deferred.'
      }
    ],
    reviewNote:
      'Manual comparison closeout only. It does not alter stress calculations, move detailed stress execution, change optimizer behavior, or persist output.',
    disposition: 'detailedStressManualComparisonCloseoutOnly'
  };
}
