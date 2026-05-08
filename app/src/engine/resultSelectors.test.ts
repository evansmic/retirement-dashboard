import { describe, expect, it } from 'vitest';
import {
  resultsWorkspaceMap,
  selectAccountBucketChartSeries,
  selectAccountBalanceSeries,
  selectAccountDrawdownReviewRows,
  selectAccountDrawdownStory,
  selectAccountSummaryRows,
  selectAnnualDetailRows,
  selectAnnualDetailSummary,
  selectCashFlowReconciliation,
  selectCashFlowReconciliationRows,
  selectChartReadyData,
  selectDecisionDetailRows,
  selectDecisionChecklist,
  selectFundingSourceRows,
  selectIncomeSourceRows,
  selectOverviewMetrics,
  selectPlanHealthExplainer,
  selectPortfolioChartSeries,
  selectProjectionMilestones,
  selectRecommendedPath,
  selectReconciliationDiagnostics,
  selectScenarioCards,
  selectScenarioComparisonRows,
  selectScenarioAssumptionRows,
  selectSourceReconciliationStory,
  selectSpendingTaxChartSeries,
  selectStressIndicatorRows,
  selectStressTestRows,
  selectStressTestSummary,
  selectSurvivorComparison,
  selectSurvivorViewSummary,
  selectTaxDetailRows,
  selectTaxPressureExplanation,
  selectTaxPressureRows,
  selectTaxReviewRows,
  selectTaxStorySummary,
  selectTaxSummaryMetrics
} from './resultSelectors';
import { SimulationResult, V2PlanPayload } from '../types/plan';

const fixture: SimulationResult = {
  years: [
    {
      year: 2028,
      ageF: 66,
      ageM: 0,
      spending: 70000,
      grossIncome: 55126.52,
      dbPension: 18000,
      cpp_f: 15535.535999999998,
      oas_f: 9090.983999999999,
      rrif_draw_f: 12500,
      tfsa_draw: 0,
      nonreg_draw: 0,
      cash_draw: 21615.703779098054,
      downsize_proceeds: 0,
      oneOff_outflow: 20000,
      totalTaxYear: 6742.223779098051,
      taxableIncome: 55126.52,
      totalOasClawY: 0,
      totalAftaxYear: 70000,
      cashFlow: 0,
      shortfall: 0,
      bal_rrsp: 301875,
      bal_tfsa: 84000,
      bal_lif: 0,
      bal_nonreg: 0,
      bal_cash: 127085.825107529,
      bal_total: 512960.825107529
    },
    {
      year: 2029,
      ageF: 67,
      ageM: 0,
      spending: 71470,
      grossIncome: 56284.18,
      dbPension: 18396,
      cpp_f: 15861.78,
      oas_f: 9281.89,
      rrif_draw_f: 12744.51,
      tfsa_draw: 0,
      nonreg_draw: 0,
      cash_draw: 21971.5,
      totalTaxYear: 6785.68,
      taxableIncome: 56284.18,
      totalOasClawY: 0,
      totalAftaxYear: 71470,
      cashFlow: 0,
      shortfall: 0,
      bal_rrsp: 304000,
      bal_tfsa: 88000,
      bal_lif: 0,
      bal_nonreg: 0,
      bal_cash: 108000,
      bal_total: 500000
    }
  ]
};

const planFixture: V2PlanPayload = {
  schemaVersion: 2,
  title: 'Selector plan',
  p1: {
    name: 'Larry',
    dob: 1962,
    retireYear: 2028,
    cpp65_monthly: 1268,
    cpp70_monthly: 1800,
    oas_monthly: 742
  },
  p2: {
    name: '',
    dob: 0,
    retireYear: 0,
    salary: 0,
    rrsp: 0,
    tfsa: 0,
    lif: 0,
    nonreg: 0,
    cpp65_monthly: 0,
    oas_monthly: 0
  },
  spending: { gogo: 70000, gogoEnd: 75, slowgo: 45000, slowgoEnd: 85, nogo: 40000 },
  inheritance: 50000,
  cashWedge: { balance: 145000, returnRate: 0.03, targetYears: 2.5 },
  assumptions: { retireYear: 2028, planEnd: 2060, returnRate: 0.0436, inflation: 0.021 }
};

function withRows(rows: Array<Partial<SimulationResult['years'][number]>>): SimulationResult {
  return {
    years: rows.map((row, index) => ({
      ...fixture.years[Math.min(index, fixture.years.length - 1)],
      ...row
    }))
  };
}

describe('result selectors', () => {
  it('records the first Sprint 6 results workspace map', () => {
    expect(resultsWorkspaceMap.map((item) => item.label)).toEqual([
      'Overview',
      'Annual Detail',
      'Cash Flow',
      'Income Sources',
      'Accounts',
      'Taxes',
      'Stress Tests',
      'Assumptions',
      'Export/Save'
    ]);
  });

  it('selects overview metrics without changing engine output', () => {
    const metrics = selectOverviewMetrics(fixture);

    expect(metrics.firstYear).toBe(2028);
    expect(metrics.lastYear).toBe(2029);
    expect(metrics.projectionYears).toBe(2);
    expect(metrics.endPortfolio).toBe(500000);
    expect(metrics.firstYearFundingGap).toBeCloseTo(0, 6);
    expect(metrics.hasShortfall).toBe(false);
  });

  it('reconciles first-year after-tax spending to sources minus tax', () => {
    const reconciliation = selectCashFlowReconciliation(fixture.years[0]);

    expect(reconciliation.reconciledAfterTaxSpending).toBeCloseTo(70000, 6);
    expect(reconciliation.reconciliationDelta).toBeCloseTo(0, 6);
    expect(reconciliation.status).toBe('ok');
  });

  it('builds funding rows, account series, and chart-ready rows', () => {
    expect(selectFundingSourceRows(fixture.years[0])).toHaveLength(4);
    expect(selectIncomeSourceRows(fixture).find((row) => row.id === 'pension')).toMatchObject({
      firstYearAmount: 18000,
      lifetimeAmount: 36396,
      taxable: true
    });
    expect(selectIncomeSourceRows(fixture).find((row) => row.id === 'cashWedge')?.firstYearAmount).toBeCloseTo(
      21615.703779098054,
      6
    );
    expect(selectAccountBalanceSeries(fixture)[0]).toMatchObject({ year: 2028, rrsp: 301875, cash: 127085.825107529 });
    expect(selectAccountSummaryRows(fixture).find((row) => row.id === 'total')).toMatchObject({
      firstYearBalance: 512960.825107529,
      endBalance: 500000,
      peakBalance: 512960.825107529,
      netChange: -12960.825107529003
    });
    expect(selectAccountDrawdownStory(fixture)).toMatchObject({
      status: 'review',
      firstYear: 2028,
      finalYear: 2029,
      startPortfolio: 512960.825107529,
      endPortfolio: 500000,
      firstDepletionYear: null
    });
    expect(selectAccountDrawdownReviewRows(fixture).map((row) => row.id)).toEqual([
      'registeredDrawdown',
      'tfsaDrawdown',
      'nonRegisteredDrawdown',
      'cashWedge',
      'terminalPortfolio'
    ]);
    expect(selectAccountDrawdownReviewRows(fixture).find((row) => row.id === 'registeredDrawdown')).toMatchObject({
      severity: 'review',
      year: 2028,
      detailArea: 'annualDetail'
    });
    const taxSummary = selectTaxSummaryMetrics(fixture);
    expect(taxSummary).toMatchObject({
      firstYearTax: 6742.223779098051,
      peakTaxYear: 2029,
      peakTax: 6785.68
    });
    expect(taxSummary.lifetimeTax).toBeCloseTo(13527.903779098052, 6);
    expect(selectTaxDetailRows(fixture)[0].effectiveRate).toBeCloseTo(0.1223, 4);
    expect(selectTaxStorySummary(fixture)).toMatchObject({
      status: 'review',
      peakTaxYear: 2029,
      registeredWithdrawalYears: 2,
      planningWindowYears: 'None detected'
    });
    expect(selectTaxReviewRows(fixture).map((row) => row.id)).toEqual([
      'oasClawback',
      'registeredWithdrawals',
      'peakTax',
      'planningWindow'
    ]);
    expect(selectTaxReviewRows(fixture).find((row) => row.id === 'registeredWithdrawals')).toMatchObject({
      severity: 'review',
      year: 2029
    });
    expect(selectStressIndicatorRows(fixture).find((row) => row.id === 'depletion')).toMatchObject({
      value: 'Not depleted',
      severity: 'ok'
    });
    expect(selectStressTestSummary(fixture)).toMatchObject({
      status: 'watch',
      fundedYears: 2,
      totalYears: 2,
      firstStressYear: 2028
    });
    expect(selectStressTestRows(fixture).map((row) => row.id)).toEqual([
      'spendingShortfall',
      'portfolioDepletion',
      'portfolioCushion',
      'taxPressure',
      'sourceReconciliation'
    ]);
    expect(selectStressTestRows(fixture).find((row) => row.id === 'sourceReconciliation')).toMatchObject({
      severity: 'ok',
      detailArea: 'cashFlow'
    });
    expect(selectProjectionMilestones(fixture).map((row) => row.label)).toEqual(['First year', 'Final year']);
    expect(selectProjectionMilestones(fixture)[0]).toMatchObject({ year: 2028, portfolio: 512960.825107529 });
    expect(selectChartReadyData(fixture)[1]).toMatchObject({ year: 2029, portfolio: 500000, funding: 71470 });
    expect(selectPortfolioChartSeries(fixture)).toEqual([
      { year: 2028, portfolio: 512960.825107529 },
      { year: 2029, portfolio: 500000 }
    ]);
    expect(selectSpendingTaxChartSeries(fixture)[0]).toMatchObject({
      year: 2028,
      afterTaxSpending: 70000,
      tax: 6742.223779098051,
      shortfall: 0
    });
    expect(selectAccountBucketChartSeries(fixture)[0]).toMatchObject({
      year: 2028,
      rrsp: 301875,
      total: 512960.825107529
    });
    expect(selectCashFlowReconciliationRows(fixture)[0]).toMatchObject({
      year: 2028,
      fundingBeforeTax: 76742.22377909805,
      portfolio: 512960.825107529,
      status: 'ok'
    });
    expect(selectAnnualDetailRows(fixture)[0]).toMatchObject({
      year: 2028,
      ages: '66',
      fundingBeforeTax: 76742.22377909805,
      tax: 6742.223779098051,
      afterTaxSpending: 70000,
      portfolio: 512960.825107529,
      reconciliationStatus: 'ok'
    });
    expect(selectAnnualDetailRows(fixture)[0].fundingBeforeTax - selectAnnualDetailRows(fixture)[0].tax).toBeCloseTo(
      selectCashFlowReconciliationRows(fixture)[0].reconciledAfterTaxSpending,
      6
    );
    expect(selectAnnualDetailSummary(fixture)).toMatchObject({
      firstYear: 2028,
      finalYear: 2029,
      totalYears: 2,
      fundedYears: 2,
      firstShortfallYear: null,
      endPortfolio: 500000
    });
    expect(selectReconciliationDiagnostics(fixture)).toMatchObject({
      rowsChecked: 2,
      warningCount: 0,
      firstWarningYear: null,
      status: 'ok'
    });
  });

  it('flags impossible source reconciliation rows', () => {
    const reconciliation = selectCashFlowReconciliation({
      ...fixture.years[0],
      cash_draw: 0
    });

    expect(reconciliation.status).toBe('warning');
    expect(reconciliation.reconciliationDelta).toBeLessThan(-20000);
    expect(selectReconciliationDiagnostics({ years: [{ ...fixture.years[0], cash_draw: 0 }] })).toMatchObject({
      rowsChecked: 1,
      warningCount: 1,
      firstWarningYear: 2028,
      status: 'warning'
    });
    expect(selectStressTestSummary({ years: [{ ...fixture.years[0], cash_draw: 0 }] })).toMatchObject({
      status: 'watch',
      firstStressYear: 2028,
      worstStressLabel: 'Source reconciliation'
    });
  });

  it('normalizes annual detail tax and balance fields safely', () => {
    const zeroTaxable = withRows([
      {
        taxableIncome: 0,
        totalTaxYear: 0,
        bal_rrsp: 123,
        bal_tfsa: 456,
        bal_lif: 789,
        bal_nonreg: 321,
        bal_cash: 654,
        bal_total: 2343
      }
    ]);
    const annualRows = selectAnnualDetailRows(zeroTaxable);
    const accountRows = selectAccountBalanceSeries(zeroTaxable);

    expect(annualRows).toHaveLength(1);
    expect(annualRows[0].effectiveRate).toBe(0);
    expect(annualRows[0]).toMatchObject({
      rrsp: accountRows[0].rrsp,
      tfsa: accountRows[0].tfsa,
      lif: accountRows[0].lif,
      nonRegistered: accountRows[0].nonRegistered,
      cash: accountRows[0].cash,
      total: accountRows[0].total
    });
  });

  it('builds Sprint 7 decision readiness selectors', () => {
    const health = selectPlanHealthExplainer(fixture);
    const sourceStory = selectSourceReconciliationStory(fixture.years[0]);
    const checklist = selectDecisionChecklist(fixture, planFixture);
    const decisionDetails = selectDecisionDetailRows(fixture, planFixture);
    const taxPressure = selectTaxPressureRows(fixture);
    const taxExplanation = selectTaxPressureExplanation(fixture);
    const scenarios = selectScenarioCards(fixture, planFixture, {
      spendLessGogo: {
        years: [{ ...fixture.years[0], bal_total: 520000 }, { ...fixture.years[1], bal_total: 540000 }]
      }
    });
    const scenarioAssumptions = selectScenarioAssumptionRows(planFixture);
    const scenarioComparison = selectScenarioComparisonRows(fixture, {
      spendLessGogo: {
        years: [{ ...fixture.years[0], totalTaxYear: 6000, bal_total: 520000 }, { ...fixture.years[1], totalTaxYear: 6200, bal_total: 540000 }]
      }
    });
    const survivor = selectSurvivorViewSummary(fixture, planFixture);
    const survivorComparison = selectSurvivorComparison(fixture, fixture, planFixture);
    const recommended = selectRecommendedPath(fixture, { spendLessGogo: scenarioComparison.find((row) => row.id === 'spendLessGogo') ? {
      years: [{ ...fixture.years[0], totalTaxYear: 6000, bal_total: 520000 }, { ...fixture.years[1], totalTaxYear: 6200, bal_total: 540000 }]
    } : null }, null, planFixture);

    expect(health).toMatchObject({
      status: 'watch',
      fundedThroughYear: 2029
    });
    expect(sourceStory.steps.map((step) => step.id)).toEqual(['income', 'taxFree', 'cash', 'other', 'tax', 'funded', 'gap']);
    expect(sourceStory.gap).toBeCloseTo(0, 6);
    expect(checklist.find((item) => item.id === 'sourceReconciliation')).toMatchObject({ status: 'ok' });
    expect(checklist.find((item) => item.id === 'cppOasTiming')).toMatchObject({ status: 'review' });
    expect(decisionDetails.find((item) => item.id === 'sourceReconciliation')?.fallbackArea).toBe('cashFlow');
    expect(taxPressure.length).toBeGreaterThan(0);
    expect(taxExplanation.rows[0].explanation.length).toBeGreaterThan(10);
    expect(scenarios.map((card) => card.id)).toEqual(['retireLater', 'spendLessGogo', 'delayBenefits']);
    expect(scenarios.every((card) => card.status === 'ready')).toBe(true);
    expect(scenarios.find((card) => card.id === 'spendLessGogo')?.endPortfolioDelta).toBe(40000);
    expect(scenarioAssumptions.find((row) => row.id === 'retireLater')).toMatchObject({
      baseline: '2028',
      scenario: '2030'
    });
    expect(scenarioComparison.find((row) => row.id === 'spendLessGogo')).toMatchObject({
      endPortfolioDelta: 40000,
      status: 'improves'
    });
    expect(survivor.status).toBe('single');
    expect(survivorComparison.status).toBe('single');
    expect(recommended.candidateRows.find((row) => row.id === 'baseline')?.reviewStatus).toBeTruthy();
    expect(recommended.confidence.label).toBeTruthy();
    expect(recommended.stressContext.candidateId).toBeTruthy();
    expect(recommended.breakRisks.find((risk) => risk.id === 'sourceReconciliation')).toMatchObject({ severity: 'ok' });
    expect(recommended.defaultRiskDetailId).toBeTruthy();
    expect(recommended.riskDetails.length).toBe(recommended.breakRisks.length);
    expect(recommended.riskDetails.find((detail) => detail.id === 'sourceReconciliation')?.metrics.length).toBeGreaterThan(0);
  });

  it('selects a no-shortfall candidate over a higher-portfolio candidate with a shortfall', () => {
    const highPortfolioShortfall = withRows([
      { year: 2028, shortfall: 0, bal_total: 900000 },
      { year: 2029, shortfall: 5000, bal_total: 850000 }
    ]);
    const lowerPortfolioNoShortfall = withRows([
      { year: 2028, shortfall: 0, bal_total: 500000 },
      { year: 2029, shortfall: 0, bal_total: 450000 }
    ]);

    const recommended = selectRecommendedPath(
      highPortfolioShortfall,
      { spendLessGogo: lowerPortfolioNoShortfall },
      null,
      planFixture
    );

    expect(recommended.recommendedCandidateId).toBe('spendLessGogo');
    expect(recommended.reasons).toContain('No shortfall appears in the preview horizon.');
    expect(recommended.confidence.level).not.toBe('low');
    expect(recommended.stressContext.candidateId).toBe('spendLessGogo');
  });

  it('prefers later funded-through year over higher terminal portfolio when all candidates have shortfalls', () => {
    const baseline = withRows([
      { year: 2028, shortfall: 0, bal_total: 500000 },
      { year: 2029, shortfall: 1000, bal_total: 490000 },
      { year: 2030, shortfall: 2000, bal_total: 480000 }
    ]);
    const earlierShortfallHigherPortfolio = withRows([
      { year: 2028, shortfall: 0, bal_total: 900000 },
      { year: 2029, shortfall: 1000, bal_total: 890000 },
      { year: 2030, shortfall: 2000, bal_total: 880000 }
    ]);
    const laterShortfallLowerPortfolio = withRows([
      { year: 2028, shortfall: 0, bal_total: 450000 },
      { year: 2029, shortfall: 0, bal_total: 430000 },
      { year: 2030, shortfall: 1000, bal_total: 400000 }
    ]);

    const recommended = selectRecommendedPath(
      baseline,
      { retireLater: laterShortfallLowerPortfolio, spendLessGogo: earlierShortfallHigherPortfolio },
      null,
      planFixture
    );

    expect(recommended.recommendedCandidateId).toBe('retireLater');
    expect(recommended.candidateRows.find((row) => row.id === 'retireLater')?.fundedThroughYear).toBe(2029);
    expect(recommended.confidence.level).toBe('low');
    expect(recommended.defaultRiskDetailId).toBe('spendingSensitivity');
    expect(recommended.breakRisks.find((risk) => risk.id === 'shortfall')).toMatchObject({
      severity: 'watch',
      detail: 'The selected path first reports a shortfall in 2030.'
    });
    expect(recommended.riskDetails.find((detail) => detail.id === 'shortfall')).toMatchObject({
      label: 'Projection shortfall',
      severity: 'watch'
    });
  });

  it('blocks candidates with source reconciliation warnings', () => {
    const warningScenario = withRows([{ ...fixture.years[0], cash_draw: 0 }, fixture.years[1]]);
    const recommended = selectRecommendedPath(fixture, { spendLessGogo: warningScenario }, null, planFixture);
    const warningRow = recommended.candidateRows.find((row) => row.id === 'spendLessGogo');

    expect(recommended.recommendedCandidateId).toBe('baseline');
    expect(warningRow).toMatchObject({ blocked: true, reviewStatus: 'blocked' });
    expect(recommended.breakRisks.find((risk) => risk.id === 'sourceReconciliation')).toMatchObject({ severity: 'ok' });
  });

  it('keeps baseline when scenarios do not improve trust metrics', () => {
    const lowerPortfolioSameFunding = withRows([
      { year: 2028, shortfall: 0, bal_total: 400000 },
      { year: 2029, shortfall: 0, bal_total: 390000 }
    ]);

    const recommended = selectRecommendedPath(fixture, { retireLater: lowerPortfolioSameFunding }, null, planFixture);

    expect(recommended.recommendedCandidateId).toBe('baseline');
    expect(recommended.reasons).toContain('The current plan remains strongest when scenarios do not improve the trust metrics.');
  });

  it('builds Sprint 9 confidence and break-plan risks for the selected path', () => {
    const selected = withRows([
      { year: 2028, shortfall: 0, bal_total: 520000, totalTaxYear: 6500, taxableIncome: 60000 },
      { year: 2029, shortfall: 0, bal_total: 540000, totalTaxYear: 6600, taxableIncome: 61000 }
    ]);
    const spendingSensitive = withRows([
      { year: 2028, shortfall: 0, bal_total: 620000 },
      { year: 2029, shortfall: 0, bal_total: 680000 }
    ]);

    const recommended = selectRecommendedPath(
      fixture,
      { delayBenefits: selected, spendLessGogo: spendingSensitive },
      null,
      planFixture
    );

    expect(recommended.recommendedCandidateId).toBe('spendLessGogo');
    expect(recommended.confidence.level).toBe('low');
    expect(recommended.stressContext).toMatchObject({
      candidateId: 'spendLessGogo',
      sourceStatus: 'ok',
      firstShortfallYear: null,
      fundedYears: 2,
      totalYears: 2
    });
    expect(recommended.breakRisks.find((risk) => risk.id === 'spendingSensitivity')).toMatchObject({
      severity: 'watch'
    });
    expect(recommended.defaultRiskDetailId).toBe('spendingSensitivity');
    expect(recommended.riskDetails.find((detail) => detail.id === 'spendingSensitivity')?.evidenceRows[0]).toMatchObject({
      label: 'Spend 10% less in go-go',
      value: 'Ready'
    });
    expect(recommended.checklistItems.find((item) => item.id === 'reviewStress')).toMatchObject({
      status: 'review',
      priority: 'now'
    });
    expect(recommended.checklistItems.find((item) => item.id === 'savePlan')).toMatchObject({
      status: 'ready'
    });
    expect(recommended.breakRisks.find((risk) => risk.id === 'survivor')).toBeTruthy();
  });

  it('builds risk detail fallback rows when scenario output is missing', () => {
    const recommended = selectRecommendedPath(fixture, {}, null, planFixture);
    const spendingDetail = recommended.riskDetails.find((detail) => detail.id === 'spendingSensitivity');

    expect(spendingDetail).toBeTruthy();
    expect(spendingDetail?.evidenceRows[0]).toMatchObject({
      label: 'Spend 10% less in go-go',
      value: 'Not available'
    });
  });

  it('builds Sprint 11 implementation checklist blockers without persisting output', () => {
    const recommended = selectRecommendedPath(fixture, {}, null, planFixture, {
      canGenerate: false,
      blockers: [{ field: 'p1.name' }]
    });

    expect(recommended.recommendedCandidateId).toBeNull();
    expect(recommended.checklistItems.find((item) => item.id === 'clearBlockers')).toMatchObject({
      status: 'blocked',
      priority: 'now'
    });
    expect(recommended.checklistItems.find((item) => item.id === 'savePlan')).toMatchObject({
      status: 'blocked'
    });
    expect(Object.keys(planFixture)).not.toContain('checklistItems');
  });

  it('shows lower tax as a reason without letting tax alone beat shortfall safety', () => {
    const lowerTaxWithShortfall = withRows([
      { year: 2028, totalTaxYear: 1000, shortfall: 0, bal_total: 520000 },
      { year: 2029, totalTaxYear: 1000, shortfall: 1000, bal_total: 530000 }
    ]);

    const recommended = selectRecommendedPath(fixture, { delayBenefits: lowerTaxWithShortfall }, null, planFixture);
    const taxRow = recommended.candidateRows.find((row) => row.id === 'delayBenefits');

    expect(recommended.recommendedCandidateId).toBe('baseline');
    expect(taxRow?.reasons).toContain('lowerLifetimeTax');
    expect(taxRow?.firstShortfallYear).toBe(2029);
  });
});
