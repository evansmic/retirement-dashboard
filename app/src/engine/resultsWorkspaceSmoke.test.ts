import { describe, expect, it } from 'vitest';
import { createBlankPlan } from '../data/defaultPlan';
import { createPlanFile } from '../data/planFile';
import { runSimulation } from './runSimulation';
import {
  resultsWorkspaceMap,
  selectAccountBucketChartSeries,
  selectAccountSummaryRows,
  selectAnnualDetailRows,
  selectAnnualDetailSummary,
  selectCashFlowReconciliationRows,
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
  selectTaxPressureRows,
  selectTaxPressureExplanation,
  selectTaxSummaryMetrics
} from './resultSelectors';
import { V2PlanPayload } from '../types/plan';

const larryPlan: V2PlanPayload = {
  schemaVersion: 2,
  title: 'Larry smoke test',
  p1: {
    name: 'Larry',
    dob: 1962,
    dobMonth: 12,
    retireYear: 2028,
    salary: 100000,
    salaryRefYear: 2026,
    salaryRaise: 0.03,
    annualRrspContrib: 18000,
    annualTfsaContrib: 7000,
    annualNonregContrib: 0,
    db_before65: 20000,
    db_after65: 18000,
    db_index: 0.022,
    db_startYear: 2028,
    rrsp: 300000,
    tfsa: 100000,
    tfsaRoom: 22000,
    tfsaAnnual: 4000,
    lif: 0,
    nonreg: 0,
    nonregAcb: 0,
    nonregAnnual: 0,
    cpp70_monthly: 1800,
    cpp65_monthly: 1268,
    oas_monthly: 742
  },
  p2: {
    name: '',
    dob: 0,
    dobMonth: 0,
    retireYear: 0,
    salary: 0,
    salaryRefYear: 0,
    salaryRaise: 0,
    annualRrspContrib: 0,
    annualTfsaContrib: 0,
    annualNonregContrib: 0,
    db_before65: 0,
    db_after65: 0,
    db_index: 0,
    db_startYear: 0,
    rrsp: 0,
    rrspRoom: 0,
    tfsa: 0,
    tfsaRoom: 0,
    tfsaAnnual: 0,
    lira: 0,
    lif: 0,
    nonreg: 0,
    nonregAcb: 0,
    nonregAnnual: 0,
    cpp70_monthly: 0,
    cpp65_monthly: 0,
    oas_monthly: 0,
    cppSurv_u65_mo: 0,
    cppSurv_o65_mo: 0
  },
  mortgage: { balance: 0, rate: 0, monthly: 0 },
  loc: { balance: 0, rate: 0 },
  spending: { gogo: 70000, gogoEnd: 75, slowgo: 45000, slowgoEnd: 85, nogo: 40000 },
  inheritance: 0,
  downsize: { year: 2036, netProceeds: 100000 },
  oneOffs: [{ year: 2028, amount: 20000, label: 'Vacation' }],
  cashWedge: { balance: 145000, returnRate: 0.03, targetYears: 2.5 },
  assumptions: {
    retireYear: 0,
    planStart: null,
    planEnd: 2060,
    p1DiesInSurvivor: 0,
    returnRate: 0.0436,
    inflation: 0.021,
    returnStdDev: 0.1,
    horizon: 95,
    youngerSpouseRrif: false,
    cppSharing: false,
    withdrawalOrder: 'default',
    spousalRrsp: null
  }
};

function couplePlan(): V2PlanPayload {
  const plan = createBlankPlan();
  plan.title = 'Couple smoke test';
  plan.p1 = {
    ...plan.p1,
    name: 'Alex',
    dob: 1968,
    retireYear: 2030,
    salary: 95000,
    rrsp: 240000,
    tfsa: 90000,
    cpp65_monthly: 1200,
    oas_monthly: 742
  };
  plan.p2 = {
    ...plan.p2,
    name: 'Morgan',
    dob: 1970,
    dobMonth: 7,
    retireYear: 2032,
    salary: 72000,
    salaryRefYear: 2026,
    salaryRaise: 0.03,
    rrsp: 180000,
    tfsa: 80000,
    cpp65_monthly: 950,
    oas_monthly: 742
  };
  plan.cashWedge = { balance: 60000, returnRate: 0.03, targetYears: 2 };
  plan.assumptions.retireYear = 2030;
  return plan;
}

function blankSinglePlan(): V2PlanPayload {
  const plan = createBlankPlan();
  plan.title = 'Blank single smoke test';
  plan.p1 = {
    ...plan.p1,
    name: 'Blank Solo',
    rrsp: 100000,
    tfsa: 50000,
    cpp65_monthly: 1000
  };
  return plan;
}

function runPreview(plan: V2PlanPayload) {
  return runSimulation(plan, {
    cppAgeF: 65,
    cppAgeM: 65,
    oasAgeF: 65,
    oasAgeM: 65,
    meltdown: false,
    returnRate: 0.05,
    pensionSplit: false,
    p1Dies: null,
    withdrawalOrder: plan.assumptions.withdrawalOrder || 'default'
  });
}

describe('Sprint 6 results workspace smoke', () => {
  it.each([
    ['Larry-style single plan', larryPlan],
    ['couple plan', couplePlan()],
    ['single-person blank Person 2 plan', blankSinglePlan()]
  ])('runs %s through result selectors and dashboard handoff packaging', (_label, plan) => {
    const result = runPreview(plan);
    const overview = selectOverviewMetrics(result);
    const annualRows = selectAnnualDetailRows(result);
    const annualSummary = selectAnnualDetailSummary(result);
    const portfolioChartRows = selectPortfolioChartSeries(result);
    const spendingTaxChartRows = selectSpendingTaxChartSeries(result);
    const cashFlowRows = selectCashFlowReconciliationRows(result);
    const accountRows = selectAccountSummaryRows(result);
    const accountChartRows = selectAccountBucketChartSeries(result);
    const taxSummary = selectTaxSummaryMetrics(result);
    const stressRows = selectStressIndicatorRows(result);
    const stressTestRows = selectStressTestRows(result);
    const stressTestSummary = selectStressTestSummary(result);
    const milestones = selectProjectionMilestones(result);
    const diagnostics = selectReconciliationDiagnostics(result);
    const firstFundingRows = selectFundingSourceRows(result.years[0]);
    const incomeSourceRows = selectIncomeSourceRows(result);
    const health = selectPlanHealthExplainer(result);
    const sourceStory = selectSourceReconciliationStory(result.years[0]);
    const checklist = selectDecisionChecklist(result, plan);
    const decisionDetails = selectDecisionDetailRows(result, plan);
    const taxPressureRows = selectTaxPressureRows(result);
    const taxPressureExplanation = selectTaxPressureExplanation(result);
    const scenarioCards = selectScenarioCards(result, plan);
    const scenarioComparisonRows = selectScenarioComparisonRows(result, {});
    const scenarioAssumptions = selectScenarioAssumptionRows(plan);
    const survivorSummary = selectSurvivorViewSummary(result, plan);
    const survivorComparison = selectSurvivorComparison(result, null, plan);
    const recommendedPath = selectRecommendedPath(result, {}, null, plan);
    const planFile = createPlanFile(plan);

    expect(overview.projectionYears).toBeGreaterThan(10);
    expect(overview.endPortfolio).toBeGreaterThanOrEqual(0);
    expect(Math.abs(overview.firstYearFundingGap)).toBeLessThanOrEqual(1);
    expect(annualRows).toHaveLength(result.years.length);
    expect(annualSummary.totalYears).toBe(result.years.length);
    expect(portfolioChartRows).toHaveLength(result.years.length);
    expect(spendingTaxChartRows).toHaveLength(result.years.length);
    expect(annualRows[0].fundingBeforeTax - annualRows[0].tax).toBeCloseTo(cashFlowRows[0].reconciledAfterTaxSpending, 6);
    expect(cashFlowRows.length).toBe(result.years.length);
    expect(cashFlowRows[0].status).toBe('ok');
    expect(accountRows.find((row) => row.id === 'total')?.endBalance).toBeGreaterThanOrEqual(0);
    expect(accountChartRows).toHaveLength(result.years.length);
    expect(taxSummary.lifetimeTax).toBeGreaterThanOrEqual(0);
    expect(stressRows.find((row) => row.id === 'fundedYears')?.value).toContain('/');
    expect(stressTestRows).toHaveLength(5);
    expect(['ok', 'review', 'watch']).toContain(stressTestSummary.status);
    expect(stressTestSummary.stableDashboardHandoff).toContain('stable dashboard');
    expect(milestones.length).toBeGreaterThanOrEqual(2);
    expect(diagnostics.rowsChecked).toBe(result.years.length);
    expect(firstFundingRows.some((row) => row.id === 'cash-wedge')).toBe(true);
    expect(incomeSourceRows.reduce((total, row) => total + row.lifetimeAmount, 0)).toBeGreaterThan(0);
    expect(health.headline.length).toBeGreaterThan(10);
    expect(sourceStory.steps.find((step) => step.id === 'funded')?.amount).toBeGreaterThanOrEqual(0);
    expect(['ok', 'watch']).toContain(checklist.find((item) => item.id === 'sourceReconciliation')?.status);
    expect(decisionDetails).toHaveLength(checklist.length);
    expect(taxPressureRows.length).toBeGreaterThanOrEqual(0);
    expect(taxPressureExplanation.headline.length).toBeGreaterThan(10);
    expect(scenarioCards).toHaveLength(3);
    expect(scenarioComparisonRows).toHaveLength(3);
    expect(scenarioAssumptions).toHaveLength(3);
    expect(['single', 'ready', 'needsInput']).toContain(survivorSummary.status);
    expect(['single', 'needsInput', 'ready', 'notAvailable']).toContain(survivorComparison.status);
    expect(recommendedPath.candidateRows.find((row) => row.id === 'baseline')).toBeTruthy();
    expect(recommendedPath.recommendedCandidateId === null || typeof recommendedPath.recommendedCandidateId === 'string').toBe(true);
    expect(planFile.plan.schemaVersion).toBe(2);
  });

  it('keeps the Sprint 6 navigation shell mapped while only first previews are implemented', () => {
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
});
