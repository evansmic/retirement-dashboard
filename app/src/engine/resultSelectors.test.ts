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
  selectCheckpointReviewBoard,
  selectDecisionDetailRows,
  selectDecisionChecklist,
  selectDiscretionaryRoomBridgeSummary,
  selectDrawdownReadinessSummary,
  selectEstateIntentSummary,
  selectFundingSourceRows,
  selectIncomeSourceRows,
  selectMinimumExpenseCoverageSummary,
  selectMonthlyCapacityFoundation,
  selectMonthlyCapacityReviewRows,
  selectOptimizerDecisionBoundaries,
  selectOptimizerInputReview,
  selectOverviewMetrics,
  selectPlanHealthExplainer,
  selectPortfolioChartSeries,
  selectProjectionMilestones,
  selectRecommendedPath,
  selectReconciliationDiagnostics,
  selectFeedbackReviewPackage,
  selectReleaseReadinessCheckpoint,
  selectResultsReadinessRows,
  selectResultsReadinessSummary,
  selectRetirementAnswerSummary,
  selectScenarioCards,
  selectScenarioChoiceCards,
  selectScenarioComparisonRows,
  selectScenarioAssumptionRows,
  selectSourceReconciliationStory,
  selectSpendingCapacitySummary,
  selectSpendingPathBridgeSummary,
  selectSpendingStressSummary,
  selectSpendingTaxChartSeries,
  selectStressIndicatorRows,
  selectStressTestRows,
  selectStressTestSummary,
  selectSurvivorComparison,
  selectSurvivorReviewRows,
  selectSurvivorStorySummary,
  selectSurvivorViewSummary,
  selectTaxDetailRows,
  selectTaxPressureExplanation,
  selectTaxPressureRows,
  selectTaxReviewRows,
  selectTaxStorySummary,
  selectTaxSummaryMetrics
} from './resultSelectors';
import { SimulationResult, V2PlanPayload } from '../types/plan';
import { createPlanFile } from '../data/planFile';
import { cleanExamplePlanCards, createCleanExampleRuntimePlan } from '../data/examplePlans';

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
      'Risks',
      'Taxes',
      'Survivor Impact',
      'Details',
      'Save & print'
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
    const stressScenarioRows = selectScenarioComparisonRows(fixture, {
      retireLater: withRows([{ bal_total: 492000 }, { bal_total: 480000 }]),
      spendLessGogo: withRows([{ spending: 63000, totalAftaxYear: 63000, bal_total: 520000 }, { bal_total: 540000 }]),
      delayBenefits: withRows([{ cpp_f: 0, oas_f: 0 }, { bal_total: 500000 }])
    });
    const couplePlan: V2PlanPayload = {
      ...planFixture,
      p2: {
        ...planFixture.p2,
        name: 'Morgan',
        dob: 1964,
        retireYear: 2028,
        cpp65_monthly: 900,
        oas_monthly: 742
      },
      assumptions: { ...planFixture.assumptions, p1DiesInSurvivor: 2035 }
    };
    const survivorStress = selectSurvivorComparison(
      fixture,
      withRows([{ bal_total: 490000 }, { bal_total: 470000, totalTaxYear: 5200 }]),
      couplePlan
    );
    expect(stressScenarioRows).toHaveLength(3);
    expect(stressScenarioRows.find((row) => row.id === 'spendLessGogo')).toMatchObject({
      status: 'improves',
      fundedThroughYear: 2029
    });
    expect(survivorStress).toMatchObject({
      status: 'ready',
      survivorYear: 2035,
      spendingFundedYears: '2/2'
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

  it('flags impossible money-in / money-out check rows', () => {
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
      worstStressLabel: 'Money-in / money-out check'
    });
  });

  it('does not block recommendation when source rows produce an after-tax surplus', () => {
    const surplusResult = withRows([
      {
        grossIncome: 200000,
        totalTaxYear: 40000,
        totalAftaxYear: 70000,
        cashFlow: 90000,
        shortfall: 0
      },
      fixture.years[1]
    ]);
    const reconciliation = selectCashFlowReconciliation(surplusResult.years[0]);
    const recommended = selectRecommendedPath(surplusResult, {}, null, planFixture);

    expect(reconciliation.reconciliationDelta).toBeGreaterThan(0);
    expect(reconciliation.cashFlowDelta).toBeGreaterThan(0);
    expect(reconciliation.status).toBe('ok');
    expect(selectReconciliationDiagnostics(surplusResult)).toMatchObject({
      warningCount: 0,
      status: 'ok'
    });
    expect(recommended.candidateRows.find((row) => row.id === 'baseline')).toMatchObject({
      blocked: false
    });
  });

  it('frames estate-heavy plans around lifestyle fit instead of recommending lower spending', () => {
    const estateHeavyResult = withRows([
      {
        ...fixture.years[0],
        shortfall: 0,
        bal_total: 6000000
      },
      {
        ...fixture.years[1],
        shortfall: 0,
        bal_total: 7000000
      }
    ]);
    const spendLessResult = withRows([
      {
        ...fixture.years[0],
        shortfall: 0,
        bal_total: 6500000
      },
      {
        ...fixture.years[1],
        shortfall: 0,
        bal_total: 7600000
      }
    ]);
    const answer = selectRetirementAnswerSummary(estateHeavyResult, { ...planFixture, inheritance: 0 });
    const recommended = selectRecommendedPath(estateHeavyResult, { spendLessGogo: spendLessResult }, null, {
      ...planFixture,
      inheritance: 0
    });

    expect(answer.status).toBe('estateHeavy');
    expect(answer.spendingHeadline).toContain('room to spend more');
    expect(answer.estateHeadline).toContain('No estate target');
    expect(recommended.recommendedCandidateId).toBe('baseline');
    expect(recommended.headline).toContain('lifestyle and estate intent');
  });

  it('uses a tight retirement answer when the plan reaches the end with limited cushion', () => {
    const tightResult = withRows([
      { ...fixture.years[0], shortfall: 0, bal_total: 100000 },
      { ...fixture.years[1], shortfall: 0, bal_total: 150000 }
    ]);
    const answer = selectRetirementAnswerSummary(tightResult, planFixture);

    expect(answer.status).toBe('tight');
    expect(answer.headline).toContain('limited');
    expect(answer.actions.find((action) => action.id === 'spending')).toBeTruthy();
    expect(answer.actions.find((action) => action.id === 'tax')?.detail).toContain('trade-offs between taxes, spending');
    expect(answer.actions.find((action) => action.id === 'tax')?.detail).not.toContain('wasted');
  });

  it('summarizes flexible spending capacity for estate-heavy plans', () => {
    const estateHeavyResult = withRows([
      { ...fixture.years[0], shortfall: 0, totalAftaxYear: 70000, bal_total: 6000000 },
      { ...fixture.years[1], shortfall: 0, totalAftaxYear: 71470, bal_total: 7000000 }
    ]);
    const answer = selectRetirementAnswerSummary(estateHeavyResult, { ...planFixture, inheritance: 0 });
    const spending = selectSpendingCapacitySummary(estateHeavyResult, {}, { ...planFixture, inheritance: 0 }, answer);

    expect(spending.status).toBe('flexible');
    expect(spending.estimatedAnnualRoom).toBeGreaterThan(0);
    expect(spending.headline).toContain('support more lifestyle spending');
    expect(spending.planningEstimateDetail).toContain("today's dollars");
    expect(spending.planningEstimateDetail).toContain('not a guarantee');
    expect(spending.reviewActions.find((action) => action.id === 'spendMore')).toBeTruthy();
  });

  it('derives covered monthly capacity from the runtime floor without saving the answer', () => {
    const answer = selectRetirementAnswerSummary(fixture, planFixture);
    const spending = selectSpendingCapacitySummary(fixture, {}, planFixture, answer);
    const capacity = selectMonthlyCapacityFoundation(fixture, planFixture, spending);
    const saved = createPlanFile(planFixture);

    expect(capacity).toMatchObject({
      status: 'tight',
      monthlyMinimumExpensesExMortgage: 70000 / 12,
      monthlyMortgagePayment: 0,
      monthlyFloor: 70000 / 12,
      monthlyAfterTaxCapacity: 70000 / 12,
      monthlyRoom: 0,
      firstShortfallYear: null
    });
    expect(capacity.boundary).toContain('Runtime-only capacity foundation');
    expect(saved.plan).not.toHaveProperty('monthlyAfterTaxCapacity');
    expect(saved.plan).not.toHaveProperty('monthlyCapacityFoundation');
  });

  it('uses neutral practical options when monthly capacity does not cover the floor', () => {
    const shortfallResult = withRows([
      { ...fixture.years[0], shortfall: 0, totalAftaxYear: 70000, bal_total: 200000 },
      { ...fixture.years[1], shortfall: 10000, totalAftaxYear: 71470, bal_total: 0 }
    ]);
    const repairedResult = withRows([
      { ...fixture.years[0], shortfall: 0, totalAftaxYear: 63000, bal_total: 220000 },
      { ...fixture.years[1], shortfall: 0, totalAftaxYear: 64000, bal_total: 100000 }
    ]);
    const answer = selectRetirementAnswerSummary(shortfallResult, planFixture);
    const spending = selectSpendingCapacitySummary(shortfallResult, { spendLessGogo: repairedResult }, planFixture, answer);
    const capacity = selectMonthlyCapacityFoundation(shortfallResult, planFixture, spending);

    expect(capacity.status).toBe('gap');
    expect(capacity.monthlyAfterTaxCapacity).toBe(63000 / 12);
    expect(capacity.monthlyRoom).toBeLessThan(0);
    expect(capacity.firstShortfallYear).toBe(2029);
    expect(capacity.optionIds).toEqual(['reduceSpending', 'workLonger', 'downsize', 'saveMore']);
    expect(capacity.detail).toContain('reduce spending');
    expect(capacity.options.find((option) => option.id === 'downsize')?.detail).toContain('only if');
  });

  it('marks monthly capacity covered when modelled room is clearly above the floor', () => {
    const estateHeavyResult = withRows([
      { ...fixture.years[0], shortfall: 0, totalAftaxYear: 70000, bal_total: 6000000 },
      { ...fixture.years[1], shortfall: 0, totalAftaxYear: 71470, bal_total: 7000000 }
    ]);
    const answer = selectRetirementAnswerSummary(estateHeavyResult, { ...planFixture, inheritance: 0 });
    const spending = selectSpendingCapacitySummary(estateHeavyResult, {}, { ...planFixture, inheritance: 0 }, answer);
    const capacity = selectMonthlyCapacityFoundation(estateHeavyResult, { ...planFixture, inheritance: 0 }, spending);

    expect(capacity.status).toBe('covered');
    expect(capacity.monthlyAfterTaxCapacity).toBeGreaterThan(capacity.monthlyFloor);
    expect(capacity.optionIds).toEqual(['taxReview', 'estateReview']);
    expect(capacity.detail).toContain('today’s dollars');
  });

  it('returns cannot-tell monthly capacity when runtime rows or floor inputs are missing', () => {
    const capacity = selectMonthlyCapacityFoundation({ years: [] }, { ...planFixture, spending: { ...planFixture.spending, gogo: 0 } });

    expect(capacity.status).toBe('cannotTell');
    expect(capacity.monthlyFloor).toBe(0);
    expect(capacity.monthlyAfterTaxCapacity).toBe(0);
    expect(capacity.options.map((option) => option.id)).toEqual(['taxReview', 'estateReview']);
  });

  it('runs fresh clean examples through the monthly capacity foundation at runtime only', () => {
    for (const card of cleanExamplePlanCards) {
      const plan = createCleanExampleRuntimePlan(card.id);
      const result = withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: plan.spending.gogo || 0, spending: plan.spending.gogo || 0, bal_total: 500000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: plan.spending.gogo || 0, spending: plan.spending.gogo || 0, bal_total: 450000 }
      ]);
      const capacity = selectMonthlyCapacityFoundation(result, plan);
      const saved = createPlanFile(plan);

      expect(capacity.status, card.id).toBe('tight');
      expect(capacity.monthlyFloor, card.id).toBe((plan.spending.gogo || 0) / 12);
      expect(capacity.monthlyMinimumExpensesExMortgage, card.id).toBeGreaterThan(0);
      expect(saved.plan).not.toHaveProperty('monthlyAfterTaxCapacity');
      expect(saved.plan).not.toHaveProperty('monthlyCapacityFoundation');
    }
  });

  it('marks estate-heavy clean example capacity as covered when runtime room is visible', () => {
    const plan = createCleanExampleRuntimePlan('estateHeavyRoom');
    const result = withRows([
      { ...fixture.years[0], shortfall: 0, totalAftaxYear: plan.spending.gogo || 0, spending: plan.spending.gogo || 0, bal_total: 6000000 },
      { ...fixture.years[1], shortfall: 0, totalAftaxYear: plan.spending.gogo || 0, spending: plan.spending.gogo || 0, bal_total: 7000000 }
    ]);
    const answer = selectRetirementAnswerSummary(result, { ...plan, inheritance: 0 });
    const spending = selectSpendingCapacitySummary(result, {}, { ...plan, inheritance: 0 }, answer);
    const capacity = selectMonthlyCapacityFoundation(result, { ...plan, inheritance: 0 }, spending);

    expect(capacity.status).toBe('covered');
    expect(capacity.monthlyRoom).toBeGreaterThan(0);
    expect(capacity.optionIds).toEqual(['taxReview', 'estateReview']);
  });

  it('builds monthly capacity review rows for later UI handoff without changing saved output', () => {
    const answer = selectRetirementAnswerSummary(fixture, planFixture);
    const spending = selectSpendingCapacitySummary(fixture, {}, planFixture, answer);
    const capacity = selectMonthlyCapacityFoundation(fixture, planFixture, spending);
    const rows = selectMonthlyCapacityReviewRows(capacity);

    expect(rows.map((row) => row.id)).toEqual(['floor', 'capacity', 'room', 'options']);
    expect(rows.find((row) => row.id === 'capacity')).toMatchObject({
      status: 'review',
      detailArea: 'overview'
    });
    expect(rows.find((row) => row.id === 'capacity')?.detail).toContain('not saved');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityReviewRows');
  });

  it('summarizes discretionary room above the temporary floor for review', () => {
    const estateHeavyResult = withRows([
      { ...fixture.years[0], shortfall: 0, totalAftaxYear: 70000, bal_total: 6000000 },
      { ...fixture.years[1], shortfall: 0, totalAftaxYear: 71470, bal_total: 7000000 }
    ]);
    const answer = selectRetirementAnswerSummary(estateHeavyResult, { ...planFixture, inheritance: 0 });
    const spending = selectSpendingCapacitySummary(estateHeavyResult, {}, { ...planFixture, inheritance: 0 }, answer);
    const coverage = selectMinimumExpenseCoverageSummary(estateHeavyResult, planFixture, spending);
    const room = selectDiscretionaryRoomBridgeSummary(coverage, spending);

    expect(room.status).toBe('review');
    expect(room.annualRoom).toBeGreaterThan(0);
    expect(room.monthlyRoom).toBe(room.annualRoom / 12);
    expect(room.reviewRows.map((row) => row.id)).toEqual(['floor', 'tax', 'estate', 'spendingPath']);
    expect(room.boundary).toContain('No saved field');
    expect(room.boundary).toContain('optimizer action');
    expect(Object.keys(planFixture)).not.toContain('discretionaryRoomBridge');
  });

  it('holds discretionary room when minimum expenses have a gap', () => {
    const shortfallResult = withRows([
      { ...fixture.years[0], shortfall: 0, totalAftaxYear: 70000, bal_total: 200000 },
      { ...fixture.years[1], shortfall: 10000, totalAftaxYear: 71470, bal_total: 0 }
    ]);
    const repairedResult = withRows([
      { ...fixture.years[0], shortfall: 0, totalAftaxYear: 63000, bal_total: 220000 },
      { ...fixture.years[1], shortfall: 0, totalAftaxYear: 64000, bal_total: 100000 }
    ]);
    const answer = selectRetirementAnswerSummary(shortfallResult, planFixture);
    const spending = selectSpendingCapacitySummary(shortfallResult, { spendLessGogo: repairedResult }, planFixture, answer);
    const coverage = selectMinimumExpenseCoverageSummary(shortfallResult, planFixture, spending);
    const room = selectDiscretionaryRoomBridgeSummary(coverage, spending);

    expect(room.status).toBe('none');
    expect(room.annualRoom).toBe(0);
    expect(room.headline).toContain('does not show spending room');
  });

  it('summarizes a spending repair amount when the lower-spending scenario fixes a shortfall', () => {
    const shortfallResult = withRows([
      { ...fixture.years[0], shortfall: 0, totalAftaxYear: 70000, bal_total: 200000 },
      { ...fixture.years[1], shortfall: 10000, totalAftaxYear: 71470, bal_total: 0 }
    ]);
    const repairedResult = withRows([
      { ...fixture.years[0], shortfall: 0, totalAftaxYear: 63000, bal_total: 220000 },
      { ...fixture.years[1], shortfall: 0, totalAftaxYear: 64000, bal_total: 100000 }
    ]);
    const answer = selectRetirementAnswerSummary(shortfallResult, planFixture);
    const spending = selectSpendingCapacitySummary(shortfallResult, { spendLessGogo: repairedResult }, planFixture, answer);

    expect(spending.status).toBe('needsReduction');
    expect(spending.repairEarlySpending).toBe(Math.round((planFixture.spending.gogo || 0) * 0.9));
    expect(spending.detail).toContain('lower-spending test');
    expect(spending.reviewActions.find((action) => action.id === 'spendLess')).toBeTruthy();
  });

  it('checks minimum-expense coverage as a runtime-only bridge summary', () => {
    const answer = selectRetirementAnswerSummary(fixture, planFixture);
    const spending = selectSpendingCapacitySummary(fixture, {}, planFixture, answer);
    const coverage = selectMinimumExpenseCoverageSummary(fixture, planFixture, spending);

    expect(coverage).toMatchObject({
      status: 'tight',
      minimumAnnualExpense: 70000,
      minimumMonthlyExpense: 70000 / 12,
      estimatedAnnualCapacity: 70000,
      estimatedMonthlyCapacity: 70000 / 12,
      annualGapOrRoom: 0
    });
    expect(coverage.boundary).toContain('Bridge-only summary');
    expect(coverage.boundary).toContain('No saved field or engine output is added');
    expect(Object.keys(planFixture)).not.toContain('minimumExpenseCoverage');
  });

  it('shows gap-review options when the temporary minimum floor is not covered', () => {
    const shortfallResult = withRows([
      { ...fixture.years[0], shortfall: 0, totalAftaxYear: 70000, bal_total: 200000 },
      { ...fixture.years[1], shortfall: 10000, totalAftaxYear: 71470, bal_total: 0 }
    ]);
    const repairedResult = withRows([
      { ...fixture.years[0], shortfall: 0, totalAftaxYear: 63000, bal_total: 220000 },
      { ...fixture.years[1], shortfall: 0, totalAftaxYear: 64000, bal_total: 100000 }
    ]);
    const answer = selectRetirementAnswerSummary(shortfallResult, planFixture);
    const spending = selectSpendingCapacitySummary(shortfallResult, { spendLessGogo: repairedResult }, planFixture, answer);
    const coverage = selectMinimumExpenseCoverageSummary(shortfallResult, planFixture, spending);

    expect(coverage.status).toBe('gap');
    expect(coverage.annualGapOrRoom).toBeLessThan(0);
    expect(coverage.reviewOptions.map((option) => option.id)).toEqual(['expenses', 'workLonger', 'downsize', 'saveMore']);
    expect(coverage.detail).toContain('working longer');
    expect(coverage.detail).toContain('downsizing');
    expect(coverage.detail).toContain('saving more');
  });

  it('summarizes the current spending path as runtime-only bridge evidence', () => {
    const path = selectSpendingPathBridgeSummary(planFixture);

    expect(path).toMatchObject({
      status: 'ready',
      breakpointAges: {
        earlyToLater: 75,
        laterToLateLife: 85
      }
    });
    expect(path.phases.map((phase) => phase.id)).toEqual(['early', 'later', 'lateLife']);
    expect(path.phases.find((phase) => phase.id === 'early')).toMatchObject({
      annualSpending: 70000,
      monthlySpending: 70000 / 12,
      endsAtAge: 75
    });
    expect(path.phases.find((phase) => phase.id === 'later')).toMatchObject({
      startsAtAge: 75,
      endsAtAge: 85
    });
    expect(path.boundary).toContain('No saved field');
    expect(path.boundary).toContain('default reduction rate');
    expect(Object.keys(planFixture)).not.toContain('spendingPathBridge');
  });

  it('holds the spending path bridge when breakpoint ages are missing or out of order', () => {
    const path = selectSpendingPathBridgeSummary({
      ...planFixture,
      spending: { ...planFixture.spending, gogoEnd: 85, slowgoEnd: 75 }
    });

    expect(path.status).toBe('cannotTell');
    expect(path.headline).toContain('breakpoint ages');
    expect(path.detail).toContain('provide defaults');
  });

  it('summarizes fragile spending stress when lower spending repairs a shortfall', () => {
    const shortfallResult = withRows([
      { ...fixture.years[0], shortfall: 0, totalAftaxYear: 70000, bal_total: 200000 },
      { ...fixture.years[1], shortfall: 10000, totalAftaxYear: 71470, bal_total: 0 }
    ]);
    const repairedResult = withRows([
      { ...fixture.years[0], shortfall: 0, totalAftaxYear: 66500, bal_total: 220000 },
      { ...fixture.years[1], shortfall: 0, totalAftaxYear: 68000, bal_total: 100000 }
    ]);

    const stress = selectSpendingStressSummary(
      shortfallResult,
      { current: shortfallResult, littleLess: repairedResult, meaningfullyLess: repairedResult },
      planFixture
    );

    expect(stress.status).toBe('fragile');
    expect(stress.headline).toContain('spending reductions');
    expect(stress.rows.map((row) => row.label)).toEqual(['Current spending', 'A little less', 'Meaningfully less']);
    expect(stress.rows.find((row) => row.id === 'littleLess')).toMatchObject({
      earlySpending: Math.round((planFixture.spending.gogo || 0) * 0.95),
      firstShortfallYear: null
    });
  });

  it('summarizes room to review when a small spending increase remains funded', () => {
    const baseline = withRows([
      { ...fixture.years[0], shortfall: 0, totalTaxYear: 10000, bal_total: 600000 },
      { ...fixture.years[1], shortfall: 0, totalTaxYear: 11000, bal_total: 650000 }
    ]);
    const higher = withRows([
      { ...fixture.years[0], shortfall: 0, totalTaxYear: 10200, bal_total: 590000 },
      { ...fixture.years[1], shortfall: 0, totalTaxYear: 11200, bal_total: 620000 }
    ]);

    const stress = selectSpendingStressSummary(baseline, { current: baseline, littleMore: higher }, { ...planFixture, inheritance: 500000 });

    expect(stress.status).toBe('roomToReview');
    expect(stress.detail).toContain('room to review');
    expect(stress.detail).toContain('not a recommendation');
    expect(stress.detail).not.toContain('you can spend more');
    expect(stress.rows.find((row) => row.id === 'littleMore')).toMatchObject({
      label: 'A little more',
      firstShortfallYear: null
    });
  });

  it('summarizes fragile spending stress when a small increase creates a shortfall', () => {
    const baseline = withRows([
      { ...fixture.years[0], shortfall: 0, totalTaxYear: 10000, bal_total: 300000 },
      { ...fixture.years[1], shortfall: 0, totalTaxYear: 11000, bal_total: 280000 }
    ]);
    const higher = withRows([
      { ...fixture.years[0], shortfall: 0, totalTaxYear: 10200, bal_total: 240000 },
      { ...fixture.years[1], shortfall: 5000, totalTaxYear: 11200, bal_total: 0 }
    ]);

    const stress = selectSpendingStressSummary(baseline, { current: baseline, littleMore: higher }, planFixture);

    expect(stress.status).toBe('fragile');
    expect(stress.headline).toContain('small spending increase');
    expect(stress.rows.find((row) => row.id === 'littleMore')).toMatchObject({ firstShortfallYear: 2029 });
  });

  it('returns a safe empty spending stress summary without projection rows', () => {
    const stress = selectSpendingStressSummary({ years: [] }, {}, planFixture);

    expect(stress.status).toBe('cannotTell');
    expect(stress.rows).toEqual([]);
    expect(stress.reviewNote).toContain('does not change the saved plan');
  });

  it('returns a safe empty drawdown readiness summary without projection rows', () => {
    const readiness = selectDrawdownReadinessSummary({ years: [] }, planFixture);

    expect(readiness.status).toBe('cannotTell');
    expect(readiness.rows).toEqual([]);
    expect(readiness.prototypeRows).toEqual([]);
    expect(readiness.drawdownOverrideDrafts).toMatchObject({
      status: 'cannotTell',
      rows: [],
      readinessRows: [],
      sandbox: { status: 'notReady', rows: [] },
      comparisonReadiness: { status: 'needsInput' }
    });
    expect(readiness.reviewNote).toContain('does not change withdrawal order');
    expect(readiness.reviewNote).toContain('save optimizer output');
  });

  it('summarizes registered withdrawal, OAS recovery, and peak tax evidence as review-only', () => {
    const result = withRows([
      {
        year: 2028,
        rrif_draw_f: 0,
        lif_draw: 0,
        taxableIncome: 42000,
        totalTaxYear: 3500,
        totalOasClawY: 0,
        bal_total: 600000
      },
      {
        year: 2029,
        rrif_draw_f: 65000,
        lif_draw: 5000,
        taxableIncome: 125000,
        totalTaxYear: 31000,
        totalOasClawY: 4200,
        bal_rrsp: 260000,
        bal_lif: 40000,
        bal_total: 500000
      }
    ]);

    const readiness = selectDrawdownReadinessSummary(result, {
      ...planFixture,
      p1: { ...planFixture.p1, rrsp: 300000, tfsa: 90000, nonreg: 50000 },
      cashWedge: { ...planFixture.cashWedge, balance: 40000 }
    });

    expect(readiness.status).toBe('review');
    expect(readiness.detail).toContain('does not change the current withdrawal order');
    expect(readiness.rows.find((row) => row.id === 'registeredPressure')).toMatchObject({
      tone: 'watch',
      year: 2029,
      disposition: 'reviewOnly'
    });
    expect(readiness.rows.find((row) => row.id === 'oasRecovery')).toMatchObject({
      tone: 'watch',
      year: 2029,
      disposition: 'reviewOnly'
    });
    expect(readiness.rows.find((row) => row.id === 'peakTax')).toMatchObject({
      year: 2029,
      disposition: 'reviewOnly'
    });
    expect(readiness.rows.find((row) => row.id === 'lowTaxWindow')).toMatchObject({
      value: '2028',
      disposition: 'reviewOnly'
    });
    expect(readiness.rows.every((row) => row.disposition === 'reviewOnly')).toBe(true);
    expect(readiness.prototypeRows.map((row) => row.id)).toEqual(['lowTaxWindow', 'registeredPressure', 'oasRecovery', 'peakTax', 'estatePressure']);
    expect(readiness.prototypeRows.find((row) => row.id === 'lowTaxWindow')).toMatchObject({
      label: 'Low-tax review window',
      value: '2028',
      disposition: 'evidenceOnly'
    });
    expect(readiness.prototypeRows.find((row) => row.id === 'registeredPressure')).toMatchObject({
      year: 2029,
      tone: 'watch',
      disposition: 'evidenceOnly'
    });
    expect(readiness.drawdownOverrideDrafts.rows.map((row) => row.evidenceSource)).toEqual([
      'lowTaxWindow',
      'registeredPressure',
      'oasRecovery',
      'peakTax',
      'estatePressure'
    ]);
    expect(readiness.drawdownOverrideDrafts.rows.find((row) => row.id === 'lowTaxRegisteredDraft')).toMatchObject({
      year: 2028,
      accountBucket: 'registered',
      direction: 'testEarlier',
      disposition: 'draftOnly'
    });
    expect(readiness.drawdownOverrideDrafts.rows.find((row) => row.id === 'oasRecoveryDraft')).toMatchObject({
      accountBucket: 'mixed',
      status: 'usableForFutureReview'
    });
    expect(readiness.drawdownOverrideDrafts.readinessRows.find((row) => row.id === 'accountBalances')).toMatchObject({
      status: 'ready'
    });
    expect(readiness.drawdownOverrideDrafts.sandbox).toMatchObject({
      status: 'needsInput',
      rows: [
        {
          id: 'firstFutureSandboxCheck',
          status: 'heldForInput',
          draftId: 'oasRecoveryDraft',
          disposition: 'sandboxPlanningOnly'
        }
      ]
    });
    expect(readiness.drawdownOverrideDrafts.sandbox.reviewNote).toContain('No sandbox comparison is run here');
    expect(readiness.drawdownOverrideDrafts.comparisonReadiness).toMatchObject({
      status: 'needsInput',
      rows: expect.arrayContaining([
        expect.objectContaining({ id: 'sandboxGate', status: 'needsInput' }),
        expect.objectContaining({ id: 'accountEvidence', status: 'ready' })
      ])
    });
    expect(readiness.drawdownOverrideDrafts.comparisonReadiness.reviewNote).toContain('does not run annual withdrawal changes');
    expect(JSON.stringify(readiness)).not.toContain('recommendation');
    expect(JSON.stringify(readiness)).not.toContain('account-by-account');
  });

  it('blocks future drawdown draft checks when account bucket evidence is missing', () => {
    const result = withRows([
      { year: 2028, rrif_draw_f: 0, lif_draw: 0, taxableIncome: 42000, totalTaxYear: 3500, totalOasClawY: 0, bal_total: 600000 },
      {
        year: 2029,
        rrif_draw_f: 65000,
        taxableIncome: 125000,
        totalTaxYear: 31000,
        totalOasClawY: 4200,
        bal_rrsp: 0,
        bal_lif: 0,
        bal_total: 500000
      }
    ]);

    const readiness = selectDrawdownReadinessSummary(result, {
      ...planFixture,
      p1: { ...planFixture.p1, rrsp: 0, tfsa: 0, nonreg: 0 },
      cashWedge: { ...planFixture.cashWedge, balance: 0 }
    });

    expect(readiness.drawdownOverrideDrafts.status).toBe('blocked');
    expect(readiness.drawdownOverrideDrafts.rows.find((row) => row.id === 'lowTaxRegisteredDraft')).toMatchObject({
      status: 'blocked',
      accountBucket: 'registered'
    });
    expect(readiness.drawdownOverrideDrafts.readinessRows.find((row) => row.id === 'accountBalances')).toMatchObject({
      status: 'blocked'
    });
    expect(readiness.drawdownOverrideDrafts.sandbox).toMatchObject({
      status: 'blocked',
      rows: [{ status: 'blocked', draftId: null, disposition: 'sandboxPlanningOnly' }]
    });
    expect(readiness.drawdownOverrideDrafts.comparisonReadiness).toMatchObject({
      status: 'blocked',
      rows: expect.arrayContaining([expect.objectContaining({ id: 'accountEvidence', status: 'blocked' })])
    });
    expect(readiness.drawdownOverrideDrafts.reviewNote).toContain('do not change withdrawal order');
  });

  it('queues one future sandbox check when draft inputs are ready', () => {
    const result = withRows([
      {
        year: 2028,
        rrif_draw_f: 0,
        lif_draw: 0,
        taxableIncome: 42000,
        totalTaxYear: 3500,
        totalOasClawY: 0,
        bal_total: 600000
      },
      {
        year: 2029,
        rrif_draw_f: 65000,
        lif_draw: 0,
        taxableIncome: 125000,
        totalTaxYear: 31000,
        totalOasClawY: 4200,
        bal_rrsp: 260000,
        bal_lif: 0,
        bal_total: 500000
      }
    ]);

    const readiness = selectDrawdownReadinessSummary(result, {
      ...planFixture,
      inheritance: 0,
      p1: { ...planFixture.p1, rrsp: 300000, tfsa: 90000, nonreg: 50000 },
      p2: { ...planFixture.p2, rrsp: 0, lif: 0, lira: 0, tfsa: 0, nonreg: 0 },
      cashWedge: { ...planFixture.cashWedge, balance: 40000 },
      assumptions: { ...planFixture.assumptions, p1DiesInSurvivor: 2035 }
    });

    expect(readiness.drawdownOverrideDrafts.sandbox).toMatchObject({
      status: 'readyToCompareLater',
      rows: [
        {
          status: 'queuedForFutureReview',
          draftId: 'oasRecoveryDraft',
          disposition: 'sandboxPlanningOnly'
        }
      ]
    });
    expect(readiness.drawdownOverrideDrafts.sandbox.detail).toContain('later calculation');
    expect(readiness.drawdownOverrideDrafts.comparisonReadiness).toMatchObject({
      status: 'readyForLaterComparison',
      rows: expect.arrayContaining([
        expect.objectContaining({ id: 'draftCheck', status: 'ready' }),
        expect.objectContaining({ id: 'sandboxGate', status: 'ready' }),
        expect.objectContaining({ id: 'accountEvidence', status: 'ready' })
      ])
    });
    expect(readiness.drawdownOverrideDrafts.comparisonReadiness.detail).toContain('does not run a comparison');
    expect(JSON.stringify(readiness.drawdownOverrideDrafts.sandbox)).not.toContain('annualOverrides');
  });

  it('keeps drawdown readiness out of saved plan files', () => {
    const readiness = selectDrawdownReadinessSummary(fixture, planFixture);
    const file = createPlanFile(planFixture);

    expect(readiness.rows.length).toBeGreaterThan(0);
    expect(readiness.prototypeRows.length).toBeGreaterThan(0);
    expect(readiness.drawdownOverrideDrafts.rows.length).toBeGreaterThan(0);
    expect(file.plan).not.toHaveProperty('drawdownReadiness');
    expect(file.plan).not.toHaveProperty('optimizerContract');
    expect(file.plan).not.toHaveProperty('withdrawalStrategy');
    expect(file.plan).not.toHaveProperty('annualOverrides');
    expect(file.plan).not.toHaveProperty('taxAwareDrawdownPrototype');
    expect(file.plan).not.toHaveProperty('taxAwareDrawdownDrafts');
    expect(file.plan).not.toHaveProperty('drawdownOverrideDrafts');
    expect(file.plan).not.toHaveProperty('drawdownDraftComparison');
    expect(file.plan).not.toHaveProperty('drawdownSandbox');
    expect(file.plan).not.toHaveProperty('drawdownSandboxComparison');
    expect(file.plan).not.toHaveProperty('drawdownComparisonReadiness');
    expect(file.plan).not.toHaveProperty('syntheticDrawdownPayload');
  });

  it('flags estate intent when a large projected estate has no target', () => {
    const estateHeavyResult = withRows([
      { ...fixture.years[0], shortfall: 0, totalAftaxYear: 70000, bal_rrsp: 3000000, bal_lif: 0, bal_total: 6000000 },
      { ...fixture.years[1], shortfall: 0, totalAftaxYear: 71470, bal_rrsp: 3500000, bal_lif: 0, bal_total: 7000000 }
    ]);
    const plan = { ...planFixture, inheritance: 0 };
    const answer = selectRetirementAnswerSummary(estateHeavyResult, plan);
    const estate = selectEstateIntentSummary(estateHeavyResult, plan, null, answer);

    expect(estate.status).toBe('needsIntent');
    expect(estate.headline).toContain('no estate goal');
    expect(estate.finalRegisteredAssets).toBeGreaterThan(0);
    expect(estate.reviewActions.find((action) => action.id === 'estateGoal')).toBeTruthy();
  });

  it('flags tax efficiency when registered assets and OAS clawback shape the estate picture', () => {
    const taxHeavyResult = withRows([
      {
        ...fixture.years[0],
        shortfall: 0,
        totalTaxYear: 45000,
        totalOasClawY: 5000,
        rrif_draw_f: 80000,
        bal_rrsp: 400000,
        bal_lif: 0,
        bal_total: 800000
      },
      {
        ...fixture.years[1],
        shortfall: 0,
        totalTaxYear: 52000,
        totalOasClawY: 7000,
        rrif_draw_f: 90000,
        bal_rrsp: 500000,
        bal_lif: 0,
        bal_total: 900000
      }
    ]);
    const plan = { ...planFixture, inheritance: 900000 };
    const answer = selectRetirementAnswerSummary(taxHeavyResult, plan);
    const estate = selectEstateIntentSummary(taxHeavyResult, plan, null, answer);

    expect(estate.status).toBe('taxReview');
    expect(estate.lifetimeOasClawback).toBeGreaterThan(0);
    expect(estate.taxEfficiencyHeadline).toContain('Tax timing');
    expect(estate.reviewActions.find((action) => action.id === 'taxTiming')).toBeTruthy();
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
    const scenarioChoices = selectScenarioChoiceCards(fixture, planFixture, {
      spendLessGogo: {
        years: [{ ...fixture.years[0], totalTaxYear: 6000, bal_total: 520000 }, { ...fixture.years[1], totalTaxYear: 6200, bal_total: 540000 }]
      }
    });
    const scenarioAssumptions = selectScenarioAssumptionRows(planFixture);
    const scenarioComparison = selectScenarioComparisonRows(fixture, {
      spendLessGogo: {
        years: [{ ...fixture.years[0], totalTaxYear: 6000, bal_total: 520000 }, { ...fixture.years[1], totalTaxYear: 6200, bal_total: 540000 }]
      }
    });
    const optimizerBoundaries = selectOptimizerDecisionBoundaries(fixture, planFixture);
    const optimizerInputReview = selectOptimizerInputReview(optimizerBoundaries);
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
    expect(scenarioChoices.map((card) => card.id)).toEqual(['currentPlan', 'spendLessGogo', 'retireLater', 'delayBenefits']);
    expect(scenarioChoices.find((card) => card.id === 'spendLessGogo')).toMatchObject({
      label: 'Spend a little less early',
      householdChoice: 'Reduce early retirement lifestyle spending by 10%.',
      primaryMetricLabel: 'Early spending change',
      primaryMetric: '$0'
    });
    expect(scenarioChoices.find((card) => card.id === 'currentPlan')?.bestFor).toContain('supports the retirement');
    expect(scenarioAssumptions.find((row) => row.id === 'retireLater')).toMatchObject({
      baseline: '2028',
      scenario: '2030'
    });
    expect(scenarioComparison.find((row) => row.id === 'spendLessGogo')).toMatchObject({
      endPortfolioDelta: 40000,
      status: 'improves'
    });
    expect(optimizerBoundaries.rows).toHaveLength(6);
    expect(optimizerBoundaries.rows.find((row) => row.id === 'spending')).toMatchObject({
      status: 'available',
      detailArea: 'details'
    });
    expect(optimizerBoundaries.rows.find((row) => row.id === 'withdrawalOrder')).toMatchObject({
      status: 'reviewOnly',
      detailArea: 'taxes'
    });
    expect(optimizerBoundaries.availableCount).toBeGreaterThanOrEqual(4);
    expect(optimizerInputReview.rows).toHaveLength(6);
    expect(optimizerInputReview.rows.find((row) => row.id === 'spending')).toMatchObject({
      permission: 'canExplore'
    });
    expect(optimizerInputReview.rows.find((row) => row.id === 'estateTarget')).toMatchObject({
      permission: 'mustPreserve'
    });
    expect(optimizerInputReview.rows.find((row) => row.id === 'downsizing')).toMatchObject({
      permission: 'mustPreserve'
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

  it('marks missing optimizer boundary inputs before future automatic search', () => {
    const plan = {
      ...planFixture,
      spending: { gogo: 0, gogoEnd: 75, slowgo: 0, slowgoEnd: 85, nogo: 0 },
      inheritance: 0,
      p1: { ...planFixture.p1, retireYear: 0, cpp65_monthly: 0, cpp70_monthly: 0, oas_monthly: 0 },
      assumptions: { ...planFixture.assumptions, retireYear: 0 }
    };
    const answer = selectRetirementAnswerSummary(fixture, plan);
    const boundaries = selectOptimizerDecisionBoundaries(fixture, plan, answer);
    const review = selectOptimizerInputReview(boundaries);

    expect(boundaries.status).toBe('needsInput');
    expect(boundaries.rows.find((row) => row.id === 'spending')).toMatchObject({ status: 'needsInput' });
    expect(boundaries.rows.find((row) => row.id === 'retirementTiming')).toMatchObject({ status: 'needsInput' });
    expect(boundaries.rows.find((row) => row.id === 'benefitTiming')).toMatchObject({ status: 'needsInput' });
    expect(boundaries.nextStep).toContain('Clear missing inputs');
    expect(review.status).toBe('needsDecision');
    expect(review.needsDecisionCount).toBeGreaterThanOrEqual(3);
    expect(review.rows.find((row) => row.id === 'benefitTiming')).toMatchObject({
      permission: 'needsDecision',
      suggestedNextStep: 'Add CPP/OAS estimates first.'
    });
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

  it('blocks candidates with money-in / money-out check warnings', () => {
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
      label: 'Spend a little less early',
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
      label: 'Spend a little less early',
      value: 'Not available'
    });
  });

  it('builds Sprint 11 implementation checklist blockers without persisting output', () => {
    const recommended = selectRecommendedPath(fixture, {}, null, planFixture, {
      canGenerate: false,
      blockers: [{ field: 'p1.name' }]
    });
    const readinessSummary = selectResultsReadinessSummary(recommended, {
      canGenerate: false,
      blockers: [{ field: 'p1.name' }]
    });
    const readinessRows = selectResultsReadinessRows(recommended, {
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
    expect(readinessSummary).toMatchObject({
      status: 'blocked',
      saveStatus: 'blocked',
      stableDashboardStatus: 'blocked'
    });
    expect(readinessRows.find((row) => row.id === 'savePlan')).toMatchObject({
      status: 'blocked',
      detailArea: 'exportSave'
    });
    expect(Object.keys(planFixture)).not.toContain('checklistItems');
    expect(Object.keys(planFixture)).not.toContain('readinessSummary');
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

  it('builds Sprint 19 survivor story and review states without changing plan output', () => {
    const couplePlan: V2PlanPayload = {
      ...planFixture,
      p2: {
        ...planFixture.p2,
        name: 'Morgan',
        dob: 1964,
        retireYear: 2028,
        cpp65_monthly: 900,
        oas_monthly: 742
      },
      assumptions: { ...planFixture.assumptions, p1DiesInSurvivor: 2029 }
    };
    const couplePlanMissingYear: V2PlanPayload = {
      ...couplePlan,
      assumptions: { ...couplePlan.assumptions, p1DiesInSurvivor: 0 }
    };
    const survivorWithShortfall = withRows([
      { year: 2028, bal_total: 470000, totalTaxYear: 8000, shortfall: 0, grossIncome: 42000, cash_draw: 26000 },
      { year: 2029, bal_total: 420000, totalTaxYear: 12000, shortfall: 5000, grossIncome: 38000, cash_draw: 20000 }
    ]);

    expect(selectSurvivorStorySummary(fixture, null, planFixture)).toMatchObject({
      status: 'single',
      readiness: 'Not applicable'
    });
    expect(selectSurvivorReviewRows(fixture, null, planFixture).find((row) => row.id === 'setup')).toMatchObject({
      severity: 'ok',
      detailArea: 'assumptions'
    });
    expect(selectSurvivorStorySummary(fixture, null, couplePlanMissingYear)).toMatchObject({
      status: 'needsInput',
      readiness: 'Needs survivor year'
    });
    expect(selectSurvivorReviewRows(fixture, null, couplePlanMissingYear).find((row) => row.id === 'setup')).toMatchObject({
      severity: 'watch',
      detailArea: 'assumptions'
    });

    const readyStory = selectSurvivorStorySummary(fixture, survivorWithShortfall, couplePlan);
    const readyRows = selectSurvivorReviewRows(fixture, survivorWithShortfall, couplePlan);

    expect(readyStory).toMatchObject({
      status: 'watch',
      survivorYear: 2029,
      firstShortfallYear: 2029,
      fundedThroughYear: 2028,
      spendingFundedYears: '1/2'
    });
    expect(readyStory.endPortfolioDelta).toBeLessThan(0);
    expect(readyStory.lifetimeTaxDelta).toBeGreaterThan(0);
    expect(readyRows).toHaveLength(6);
    expect(readyRows.find((row) => row.id === 'incomeChange')?.explanation).toContain('DB pensions may continue');
    expect(readyRows.find((row) => row.id === 'spendingFunding')).toMatchObject({
      severity: 'watch',
      detailArea: 'annualDetail'
    });
    expect(readyRows.find((row) => row.id === 'portfolioCushion')).toMatchObject({
      severity: 'watch',
      value: '-$80,000',
      detailArea: 'accounts'
    });
    expect(readyRows.find((row) => row.id === 'lifetimeTax')).toMatchObject({
      severity: 'review',
      detailArea: 'taxes'
    });
    expect(readyRows.find((row) => row.id === 'lifetimeTax')?.value.startsWith('+$')).toBe(true);
    expect(readyRows.find((row) => row.id === 'stressFollowup')).toMatchObject({
      detailArea: 'stressTests'
    });
    expect(Object.keys(couplePlan)).not.toContain('survivorStory');
  });

  it('builds Sprint 20 readiness handoff rows without persisting output', () => {
    const recommended = selectRecommendedPath(fixture, {}, null, planFixture);
    const summary = selectResultsReadinessSummary(recommended);
    const rows = selectResultsReadinessRows(recommended);

    expect(['ready', 'review', 'blocked']).toContain(summary.status);
    expect(['ready', 'review', 'blocked']).toContain(summary.saveStatus);
    expect(summary.stableDashboardHandoff).toContain('printable report');
    expect(rows.map((row) => row.id)).toEqual([
      'blockers',
      'watchRisks',
      'taxes',
      'householdResilience',
      'stableDashboard',
      'savePlan'
    ]);
    expect(rows.find((row) => row.id === 'stableDashboard')).toMatchObject({
      status: 'review',
      detailArea: 'exportSave'
    });
    expect(rows.find((row) => row.id === 'taxes')?.detailArea).toBe('taxes');
    expect(rows.find((row) => row.id === 'householdResilience')?.detailArea).toBe('householdResilience');
    expect(Object.keys(planFixture)).not.toContain('resultsReadiness');
  });

  it('builds a release readiness checkpoint without persisting output', () => {
    const recommended = selectRecommendedPath(fixture, {}, null, planFixture);
    const resultsReadiness = selectResultsReadinessSummary(recommended);
    const retirementAnswer = selectRetirementAnswerSummary(fixture, planFixture);
    const spendingCapacity = selectSpendingCapacitySummary(fixture, {}, planFixture, retirementAnswer);
    const checkpoint = selectReleaseReadinessCheckpoint({
      resultsReadiness,
      retirementAnswer,
      spendingCapacity,
      drawdownReviewStatus: 'ready',
      drawdownCopyStatus: 'ready',
      examplesReady: true,
      savedPlanClean: true,
      verificationReady: true
    });

    expect(['ready', 'review', 'blocked']).toContain(checkpoint.status);
    expect(checkpoint.headline).toContain('Release review');
    expect(checkpoint.rows.map((row) => row.id)).toEqual([
      'inputs',
      'firstAnswer',
      'spending',
      'drawdownReview',
      'examples',
      'localSave',
      'verification',
      'feedbackScope'
    ]);
    expect(checkpoint.rows.find((row) => row.id === 'drawdownReview')).toMatchObject({
      status: 'ready',
      detailArea: 'details'
    });
    expect(checkpoint.reviewNote).toContain('does not change calculations');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('releaseReadinessCheckpoint');
  });

  it('blocks the release readiness checkpoint when validation or save boundaries fail', () => {
    const recommended = selectRecommendedPath(fixture, {}, null, planFixture, {
      canGenerate: false,
      blockers: [{ field: 'p1.name' }]
    });
    const resultsReadiness = selectResultsReadinessSummary(recommended, {
      canGenerate: false,
      blockers: [{ field: 'p1.name' }]
    });
    const retirementAnswer = selectRetirementAnswerSummary(fixture, planFixture, {
      canGenerate: false,
      blockers: [{ field: 'p1.name' }]
    });
    const spendingCapacity = selectSpendingCapacitySummary(fixture, {}, planFixture, retirementAnswer);
    const checkpoint = selectReleaseReadinessCheckpoint({
      validation: { canGenerate: false, blockers: [{ field: 'p1.name' }] },
      resultsReadiness,
      retirementAnswer,
      spendingCapacity,
      drawdownReviewStatus: 'review',
      drawdownCopyStatus: 'ready',
      savedPlanClean: false,
      verificationReady: false
    });

    expect(checkpoint.status).toBe('blocked');
    expect(checkpoint.rows.find((row) => row.id === 'inputs')).toMatchObject({ status: 'blocked' });
    expect(checkpoint.rows.find((row) => row.id === 'localSave')).toMatchObject({ status: 'blocked' });
    expect(checkpoint.rows.find((row) => row.id === 'verification')).toMatchObject({ status: 'review' });
  });

  it('builds a feedback review package from release readiness without persisting output', () => {
    const recommended = selectRecommendedPath(fixture, {}, null, planFixture);
    const resultsReadiness = selectResultsReadinessSummary(recommended);
    const retirementAnswer = selectRetirementAnswerSummary(fixture, planFixture);
    const spendingCapacity = selectSpendingCapacitySummary(fixture, {}, planFixture, retirementAnswer);
    const releaseReadiness = selectReleaseReadinessCheckpoint({
      resultsReadiness,
      retirementAnswer,
      spendingCapacity,
      drawdownReviewStatus: 'ready',
      drawdownCopyStatus: 'ready'
    });
    const feedbackPackage = selectFeedbackReviewPackage({
      releaseReadiness,
      recommendedLabel: recommended.recommendedLabel
    });

    expect(['ready', 'review', 'blocked']).toContain(feedbackPackage.status);
    expect(feedbackPackage.rows.map((row) => row.id)).toEqual([
      'exampleRun',
      'firstScreen',
      'spendingLanguage',
      'drawdownDetails',
      'localTrust',
      'verification',
      'uxReviewScope'
    ]);
    expect(feedbackPackage.reviewScript).toHaveLength(5);
    expect(feedbackPackage.reviewScript[0]).toContain('built-in examples');
    expect(feedbackPackage.reviewNote).toContain('does not change calculations');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('feedbackReviewPackage');
  });

  it('blocks the feedback review package when release readiness is blocked', () => {
    const recommended = selectRecommendedPath(fixture, {}, null, planFixture);
    const resultsReadiness = selectResultsReadinessSummary(recommended);
    const retirementAnswer = selectRetirementAnswerSummary(fixture, planFixture);
    const spendingCapacity = selectSpendingCapacitySummary(fixture, {}, planFixture, retirementAnswer);
    const releaseReadiness = selectReleaseReadinessCheckpoint({
      resultsReadiness,
      retirementAnswer,
      spendingCapacity,
      drawdownReviewStatus: 'blocked',
      drawdownCopyStatus: 'ready',
      savedPlanClean: false,
      verificationReady: false
    });
    const feedbackPackage = selectFeedbackReviewPackage({
      releaseReadiness,
      recommendedLabel: recommended.recommendedLabel,
      examplesReady: false,
      verificationReady: false,
      broadUxReviewDeferred: true
    });

    expect(feedbackPackage.status).toBe('blocked');
    expect(feedbackPackage.rows.find((row) => row.id === 'firstScreen')).toMatchObject({ status: 'blocked' });
    expect(feedbackPackage.rows.find((row) => row.id === 'drawdownDetails')).toMatchObject({ status: 'blocked' });
    expect(feedbackPackage.rows.find((row) => row.id === 'exampleRun')).toMatchObject({ status: 'review' });
  });

  it('builds a checkpoint review board without persisting output', () => {
    const recommended = selectRecommendedPath(fixture, {}, null, planFixture);
    const resultsReadiness = selectResultsReadinessSummary(recommended);
    const retirementAnswer = selectRetirementAnswerSummary(fixture, planFixture);
    const spendingCapacity = selectSpendingCapacitySummary(fixture, {}, planFixture, retirementAnswer);
    const releaseReadiness = selectReleaseReadinessCheckpoint({
      resultsReadiness,
      retirementAnswer,
      spendingCapacity,
      drawdownReviewStatus: 'ready',
      drawdownCopyStatus: 'ready'
    });
    const feedbackPackage = selectFeedbackReviewPackage({
      releaseReadiness,
      recommendedLabel: recommended.recommendedLabel
    });
    const board = selectCheckpointReviewBoard({
      releaseReadiness,
      feedbackPackage,
      broadUxReviewDeferred: true
    });

    expect(['ready', 'review', 'blocked']).toContain(board.status);
    expect(board.rows.map((row) => row.id)).toEqual([
      'examples',
      'firstAnswer',
      'spending',
      'drawdown',
      'saveReport',
      'verification',
      'visualUx'
    ]);
    expect(board.rows.find((row) => row.id === 'visualUx')).toMatchObject({
      bucket: 'deferToUxPass',
      detailArea: 'details'
    });
    expect(board.fixBeforeFeedbackCount + board.reviewDuringCheckpointCount + board.deferToUxPassCount).toBe(
      board.rows.length
    );
    expect(board.reviewNote).toContain('does not change calculations');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('checkpointReviewBoard');
  });

  it('groups blocked checkpoint items as fixes before feedback', () => {
    const recommended = selectRecommendedPath(fixture, {}, null, planFixture);
    const resultsReadiness = selectResultsReadinessSummary(recommended);
    const retirementAnswer = selectRetirementAnswerSummary(fixture, planFixture);
    const spendingCapacity = selectSpendingCapacitySummary(fixture, {}, planFixture, retirementAnswer);
    const releaseReadiness = selectReleaseReadinessCheckpoint({
      resultsReadiness,
      retirementAnswer,
      spendingCapacity,
      drawdownReviewStatus: 'blocked',
      drawdownCopyStatus: 'ready',
      savedPlanClean: false,
      verificationReady: false
    });
    const feedbackPackage = selectFeedbackReviewPackage({
      releaseReadiness,
      recommendedLabel: recommended.recommendedLabel,
      examplesReady: false,
      verificationReady: false,
      broadUxReviewDeferred: false
    });
    const board = selectCheckpointReviewBoard({
      releaseReadiness,
      feedbackPackage,
      broadUxReviewDeferred: false
    });

    expect(board.status).toBe('blocked');
    expect(board.rows.find((row) => row.id === 'drawdown')).toMatchObject({
      status: 'blocked',
      bucket: 'fixBeforeFeedback'
    });
    expect(board.rows.find((row) => row.id === 'saveReport')).toMatchObject({
      status: 'blocked',
      bucket: 'fixBeforeFeedback'
    });
    expect(board.rows.find((row) => row.id === 'visualUx')).toMatchObject({
      status: 'review',
      bucket: 'deferToUxPass'
    });
  });
});
