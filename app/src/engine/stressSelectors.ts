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
