import { describe, expect, it } from 'vitest';
import { createBlankPlan } from '../data/defaultPlan';
import { createPlanFile } from '../data/planFile';
import { runResultsPreviewBundle } from './previewScenarios';
import {
  resultsWorkspaceMap,
  selectAccountBucketChartSeries,
  selectAccountDrawdownReviewRows,
  selectAccountDrawdownStory,
  selectAccountSummaryRows,
  selectAnnualDetailRows,
  selectAnnualDetailSummary,
  selectCashFlowReconciliationRows,
  selectDecisionDetailRows,
  selectDecisionChecklist,
  selectEstateIntentSummary,
  selectFundingSourceRows,
  selectIncomeSourceRows,
  selectOptimizerDecisionBoundaries,
  selectOptimizerInputReview,
  selectOverviewMetrics,
  selectPlanHealthExplainer,
  selectPortfolioChartSeries,
  selectProjectionMilestones,
  selectRecommendedPath,
  selectReconciliationDiagnostics,
  selectResultsReadinessRows,
  selectResultsReadinessSummary,
  selectRetirementAnswerSummary,
  selectScenarioCards,
  selectScenarioChoiceCards,
  selectScenarioComparisonRows,
  selectScenarioAssumptionRows,
  selectSourceReconciliationStory,
  selectSpendingCapacitySummary,
  selectSpendingStressSummary,
  selectSpendingTaxChartSeries,
  selectStressIndicatorRows,
  selectStressTestRows,
  selectStressTestSummary,
  selectSurvivorComparison,
  selectSurvivorReviewRows,
  selectSurvivorStorySummary,
  selectSurvivorViewSummary,
  selectTaxPressureRows,
  selectTaxPressureExplanation,
  selectTaxReviewRows,
  selectTaxStorySummary,
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

describe('Sprint 6 results workspace smoke', () => {
  it.each([
    ['Larry-style single plan', larryPlan],
    ['couple plan', couplePlan()],
    ['single-person blank Person 2 plan', blankSinglePlan()]
  ])('runs %s through result selectors and dashboard handoff packaging', (_label, plan) => {
    const preview = runResultsPreviewBundle(plan);
    const result = preview.result;
    const overview = selectOverviewMetrics(result);
    const annualRows = selectAnnualDetailRows(result);
    const annualSummary = selectAnnualDetailSummary(result);
    const portfolioChartRows = selectPortfolioChartSeries(result);
    const spendingTaxChartRows = selectSpendingTaxChartSeries(result);
    const cashFlowRows = selectCashFlowReconciliationRows(result);
    const accountRows = selectAccountSummaryRows(result);
    const accountChartRows = selectAccountBucketChartSeries(result);
    const accountDrawdownRows = selectAccountDrawdownReviewRows(result);
    const accountDrawdownStory = selectAccountDrawdownStory(result);
    const taxSummary = selectTaxSummaryMetrics(result);
    const taxReviewRows = selectTaxReviewRows(result);
    const taxStorySummary = selectTaxStorySummary(result);
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
    const scenarioCards = selectScenarioCards(result, plan, preview.scenarios);
    const scenarioChoiceCards = selectScenarioChoiceCards(result, plan, preview.scenarios);
    const scenarioComparisonRows = selectScenarioComparisonRows(result, preview.scenarios);
    const scenarioAssumptions = selectScenarioAssumptionRows(plan);
    const survivorSummary = selectSurvivorViewSummary(result, plan);
    const survivorComparison = selectSurvivorComparison(result, preview.survivor, plan);
    const survivorStory = selectSurvivorStorySummary(result, preview.survivor, plan);
    const survivorReviewRows = selectSurvivorReviewRows(result, preview.survivor, plan);
    const recommendedPath = selectRecommendedPath(result, preview.scenarios, preview.survivor, plan);
    const retirementAnswer = selectRetirementAnswerSummary(result, plan, null, preview.survivor);
    const spendingCapacity = selectSpendingCapacitySummary(result, preview.scenarios, plan, retirementAnswer);
    const spendingStress = selectSpendingStressSummary(result, preview.spendingStress, plan);
    const estateIntent = selectEstateIntentSummary(result, plan, preview.survivor, retirementAnswer);
    const optimizerBoundaries = selectOptimizerDecisionBoundaries(result, plan, retirementAnswer);
    const optimizerInputReview = selectOptimizerInputReview(optimizerBoundaries);
    const readinessSummary = selectResultsReadinessSummary(recommendedPath);
    const readinessRows = selectResultsReadinessRows(recommendedPath);
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
    expect(accountDrawdownRows).toHaveLength(5);
    expect(['ok', 'review', 'watch']).toContain(accountDrawdownStory.status);
    expect(accountDrawdownStory.stableDashboardHandoff).toContain('detailed report');
    expect(taxSummary.lifetimeTax).toBeGreaterThanOrEqual(0);
    expect(taxReviewRows).toHaveLength(4);
    expect(['ok', 'review', 'watch']).toContain(taxStorySummary.status);
    expect(taxStorySummary.stableDashboardHandoff).toContain('detailed report');
    expect(stressRows.find((row) => row.id === 'fundedYears')?.value).toContain('/');
    expect(stressTestRows).toHaveLength(5);
    expect(['ok', 'review', 'watch']).toContain(stressTestSummary.status);
    expect(stressTestSummary.stableDashboardHandoff).toContain('detailed report');
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
    expect(scenarioChoiceCards).toHaveLength(4);
    expect(scenarioChoiceCards.map((card) => card.id)).toEqual(['currentPlan', 'spendLessGogo', 'retireLater', 'delayBenefits']);
    expect(scenarioChoiceCards.find((card) => card.id === 'currentPlan')?.householdChoice).toContain('Retire');
    expect(scenarioComparisonRows).toHaveLength(3);
    expect(Object.keys(preview.scenarios).sort()).toEqual(['delayBenefits', 'retireLater', 'spendLessGogo']);
    expect(Object.keys(preview.spendingStress).sort()).toContain('current');
    expect(scenarioAssumptions).toHaveLength(3);
    expect(['single', 'ready', 'needsInput']).toContain(survivorSummary.status);
    expect(['single', 'needsInput', 'ready', 'notAvailable']).toContain(survivorComparison.status);
    expect(['single', 'needsInput', 'notAvailable', 'ok', 'review', 'watch']).toContain(survivorStory.status);
    expect(survivorStory.stableDashboardHandoff).toContain('detailed report');
    expect(survivorReviewRows).toHaveLength(6);
    expect(survivorReviewRows.find((row) => row.id === 'setup')?.detailArea).toBe('assumptions');
    expect(recommendedPath.candidateRows.find((row) => row.id === 'baseline')).toBeTruthy();
    expect(recommendedPath.recommendedCandidateId === null || typeof recommendedPath.recommendedCandidateId === 'string').toBe(true);
    expect(['cannotTell', 'notReady', 'tight', 'onTrackReview', 'onTrack', 'estateHeavy']).toContain(retirementAnswer.status);
    expect(retirementAnswer.headline.length).toBeGreaterThan(10);
    expect(retirementAnswer.actions.length).toBeGreaterThanOrEqual(3);
    expect(['cannotTell', 'needsReduction', 'tight', 'balanced', 'flexible']).toContain(spendingCapacity.status);
    expect(spendingCapacity.headline.length).toBeGreaterThan(10);
    expect(spendingCapacity.reviewActions.length).toBeGreaterThanOrEqual(2);
    expect(['cannotTell', 'fragile', 'balanced', 'roomToReview']).toContain(spendingStress.status);
    expect(spendingStress.headline.length).toBeGreaterThan(10);
    expect(Object.keys(planFile.plan)).not.toContain('spendingStress');
    expect(['cannotTell', 'needsIntent', 'taxReview', 'survivorReview', 'aligned']).toContain(estateIntent.status);
    expect(estateIntent.headline.length).toBeGreaterThan(10);
    expect(estateIntent.reviewActions.length).toBeGreaterThanOrEqual(1);
    expect(['ready', 'needsInput', 'review']).toContain(optimizerBoundaries.status);
    expect(optimizerBoundaries.rows).toHaveLength(6);
    expect(optimizerBoundaries.rows.find((row) => row.id === 'spending')?.currentSetting).toContain('early');
    expect(['ready', 'needsDecision', 'review']).toContain(optimizerInputReview.status);
    expect(optimizerInputReview.rows).toHaveLength(6);
    expect(optimizerInputReview.rows.some((row) => row.permission === 'canExplore')).toBe(true);
    expect(Object.keys(planFile.plan)).not.toContain('optimizerBoundaries');
    expect(Object.keys(planFile.plan)).not.toContain('optimizerInputReview');
    expect(['ready', 'review', 'blocked']).toContain(readinessSummary.status);
    expect(readinessSummary.stableDashboardHandoff).toContain('printable report');
    expect(readinessRows).toHaveLength(6);
    expect(readinessRows.find((row) => row.id === 'savePlan')?.detailArea).toBe('exportSave');
    expect(planFile.plan.schemaVersion).toBe(2);
    expect(Object.keys(planFile.plan)).not.toContain('resultsReadiness');
  });

  it('keeps the Sprint 6 navigation shell mapped while only first previews are implemented', () => {
    expect(resultsWorkspaceMap.map((item) => item.label)).toEqual([
      'Overview',
      'Risks',
      'Taxes',
      'Survivor Impact',
      'Details',
      'Save & print'
    ]);
  });
});
