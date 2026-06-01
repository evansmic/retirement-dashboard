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
  selectMonthlyCapacityCandidateSetCloseout,
  selectMonthlyCapacityCandidateSetExampleReadiness,
  selectMonthlyCapacityCandidateSetLimits,
  selectMonthlyCapacityCandidateSetPlan,
  selectMonthlyCapacityCandidateBuilderCloseout,
  selectMonthlyCapacityCandidateBuilderDryRun,
  selectMonthlyCapacityCandidateBuilderDryRunAudit,
  selectMonthlyCapacityCandidateBuilderExampleReadiness,
  selectMonthlyCapacityCandidateBuilderGuardrails,
  selectMonthlyCapacityCandidateBuilderInputContract,
  selectMonthlyCapacityCandidateBuilderOrder,
  selectMonthlyCapacityCandidateBuilderPackageCloseout,
  selectMonthlyCapacityCandidateBuilderPlan,
  selectMonthlyCapacityCandidateBuilderRuntimeGate,
  selectMonthlyCapacityCandidateScoreInputs,
  selectMonthlyCapacityCaveatSignals,
  selectMonthlyCapacityFoundation,
  selectMonthlyCapacityDecisionLayer,
  selectMonthlyCapacityFloorInputs,
  selectMonthlyCapacityLeverGates,
  selectMonthlyCapacityOptimizerExampleHandoff,
  selectMonthlyCapacityOptimizerExecutionGate,
  selectMonthlyCapacityOptimizerGuardrails,
  selectMonthlyCapacityOptimizerHandoffCloseout,
  selectMonthlyCapacityOptimizerHandoff,
  selectMonthlyCapacityOptimizerInputContract,
  selectMonthlyCapacityOptimizerObjective,
  selectMonthlyCapacityReadinessCloseout,
  selectMonthlyCapacityReviewRows,
  selectMonthlyCapacityRuntimeCandidateAudit,
  selectMonthlyCapacityRuntimeCandidateCloseout,
  selectMonthlyCapacityRuntimeCandidateExampleReadiness,
  selectMonthlyCapacityRuntimeCandidateSimulationAudit,
  selectMonthlyCapacityRuntimeCandidateSimulationCloseout,
  selectMonthlyCapacityRuntimeCandidateSimulationExampleReadiness,
  selectMonthlyCapacityRuntimeCandidateSimulationHandoff,
  selectMonthlyCapacityRuntimeCandidateSimulationSummary,
  selectMonthlyCapacityRuntimeCandidateSimulations,
  selectMonthlyCapacityRuntimeCandidateSummary,
  selectMonthlyCapacityRuntimeCandidateVariants,
  selectMonthlyCapacityRuntimePacket,
  selectMonthlyCapacityScoringExecutionExampleReadiness,
  selectMonthlyCapacityScoringExecutionGuardrails,
  selectMonthlyCapacityScoringExecutionPlan,
  selectMonthlyCapacityScoringExecutionPlanningCloseout,
  selectMonthlyCapacityScoringExecutionReadiness,
  selectMonthlyCapacityRuntimeScoreAudit,
  selectMonthlyCapacityRuntimeScoreCloseout,
  selectMonthlyCapacityRuntimeScoreExampleReadiness,
  selectMonthlyCapacityRuntimeScorePackageCloseout,
  selectMonthlyCapacityRuntimeScoreSummary,
  selectMonthlyCapacityRuntimeScores,
  selectMonthlyCapacityCandidateRankingExampleReadiness,
  selectMonthlyCapacityCandidateRankingGuardrails,
  selectMonthlyCapacityCandidateRankingPlan,
  selectMonthlyCapacityCandidateRankingPlanningAudit,
  selectMonthlyCapacityCandidateRankingPlanningCloseout,
  selectMonthlyCapacityCandidateRankingPlanningPackageCloseout,
  selectMonthlyCapacityCandidateRankingPlanningSummary,
  selectMonthlyCapacityCandidateRankingReadiness,
  selectMonthlyCapacityCandidateRankingTieBreakPlan,
  selectMonthlyCapacityCandidateRankingImplementationContract,
  selectMonthlyCapacityCandidateRankingImplementationExampleReadiness,
  selectMonthlyCapacityCandidateRankingImplementationGuardrails,
  selectMonthlyCapacityCandidateRankingImplementationDryRun,
  selectMonthlyCapacityCandidateRankingImplementationDryRunAudit,
  selectMonthlyCapacityCandidateRankingImplementationPlan,
  selectMonthlyCapacityCandidateRankingImplementationReadiness,
  selectMonthlyCapacityCandidateRankingImplementationCloseout,
  selectMonthlyCapacityCandidateRankingImplementationPackageCloseout,
  selectMonthlyCapacityCandidateRankingImplementationSummary,
  selectMonthlyCapacityCandidateRuntimeRanking,
  selectMonthlyCapacityCandidateRuntimeRankingAudit,
  selectMonthlyCapacityCandidateRuntimeRankingCloseout,
  selectMonthlyCapacityCandidateRuntimeRankingExampleReadiness,
  selectMonthlyCapacityCandidateRuntimeRankingPackageCloseout,
  selectMonthlyCapacityCandidateRuntimeRankingSummary,
  selectMonthlyCapacityCandidateScorePolicy,
  selectMonthlyCapacityScoringExampleReadiness,
  selectMonthlyCapacityScoringPlanCloseout,
  selectMonthlyCapacityScoringRubric,
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

function buildMonthlyCandidateRuntime(result: SimulationResult, plan: V2PlanPayload, comparisons: Record<string, SimulationResult> = {}) {
  const answer = selectRetirementAnswerSummary(result, plan);
  const spending = selectSpendingCapacitySummary(result, comparisons, plan, answer);
  const packet = selectMonthlyCapacityRuntimePacket(result, plan, spending);
  const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
  const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(result, plan, answer));
  const executionGate = selectMonthlyCapacityOptimizerExecutionGate(
    selectMonthlyCapacityOptimizerInputContract(handoff, review),
    selectMonthlyCapacityOptimizerGuardrails(handoff)
  );
  const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
  const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(executionGate), inputs);
  const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);
  const limits = selectMonthlyCapacityCandidateSetLimits(candidateSet);
  const builderPlan = selectMonthlyCapacityCandidateBuilderPlan(candidateSet, limits);
  const contract = selectMonthlyCapacityCandidateBuilderInputContract(packet, builderPlan, limits);
  const order = selectMonthlyCapacityCandidateBuilderOrder(builderPlan, contract);
  const dryRun = selectMonthlyCapacityCandidateBuilderDryRun(builderPlan, order);
  const runtimeGate = selectMonthlyCapacityCandidateBuilderRuntimeGate(
    contract,
    order,
    selectMonthlyCapacityCandidateBuilderDryRunAudit(dryRun)
  );
  const variants = selectMonthlyCapacityRuntimeCandidateVariants(plan, builderPlan, order, runtimeGate);

  return { packet, builderPlan, order, runtimeGate, variants };
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

  it('hardens monthly capacity decisions for covered and tight statuses without reduction prompts', () => {
    const answer = selectRetirementAnswerSummary(fixture, planFixture);
    const spending = selectSpendingCapacitySummary(fixture, {}, planFixture, answer);
    const capacity = selectMonthlyCapacityFoundation(fixture, planFixture, spending);
    const decision = selectMonthlyCapacityDecisionLayer(capacity, planFixture);

    expect(decision.status).toBe('tight');
    expect(decision.decision).toBe('needsReview');
    expect(decision.rows.map((row) => row.id)).toEqual(['floorCoverage', 'shortfallTiming', 'survivorEstate', 'optionGate']);
    expect(decision.rows.find((row) => row.id === 'optionGate')).toMatchObject({
      status: 'pass',
      detail: expect.stringContaining('unless the runtime status is gap')
    });
    expect(decision.primaryOptionIds).toEqual(['taxReview', 'estateReview']);
    expect(decision.boundary).toContain('does not save capacity output');
  });

  it('hardens monthly capacity gap decisions with practical options only', () => {
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
    const decision = selectMonthlyCapacityDecisionLayer(capacity, planFixture);

    expect(decision.decision).toBe('needsAction');
    expect(decision.rows.find((row) => row.id === 'floorCoverage')).toMatchObject({ status: 'block' });
    expect(decision.rows.find((row) => row.id === 'shortfallTiming')?.detail).toContain('2029');
    expect(decision.primaryOptionIds).toEqual(['reduceSpending', 'workLonger', 'downsize', 'saveMore']);
    expect(decision.caveats.join(' ')).toContain('runtime estimate');
  });

  it('keeps mortgage treatment and survivor estate caveats visible in capacity decisions', () => {
    const plan = createCleanExampleRuntimePlan('coupleTightFloor');
    const result = withRows([
      { ...fixture.years[0], shortfall: 0, totalAftaxYear: plan.spending.gogo || 0, spending: plan.spending.gogo || 0, bal_total: 500000 },
      { ...fixture.years[1], shortfall: 0, totalAftaxYear: plan.spending.gogo || 0, spending: plan.spending.gogo || 0, bal_total: 450000 }
    ]);
    const capacity = selectMonthlyCapacityFoundation(result, plan);
    const decision = selectMonthlyCapacityDecisionLayer(capacity, plan);

    expect(capacity.monthlyMortgagePayment).toBe(1800);
    expect(decision.rows.find((row) => row.id === 'floorCoverage')?.detail).toContain('mortgage payment');
    expect(decision.rows.find((row) => row.id === 'survivorEstate')).toMatchObject({
      status: 'review',
      detailArea: 'householdResilience'
    });
    expect(decision.caveats.join(' ')).toContain('survivor resilience');
  });

  it('uses fresh clean examples as an expected monthly capacity decision matrix', () => {
    const expected: Record<string, { status: string; decision: string }> = {
      singleMinimumFloor: { status: 'tight', decision: 'needsReview' },
      coupleTightFloor: { status: 'gap', decision: 'needsAction' },
      pensionCoupleSurvivor: { status: 'tight', decision: 'needsReview' },
      estateHeavyRoom: { status: 'covered', decision: 'needsReview' }
    };
    const runtimeRowsByExample: Record<string, SimulationResult> = {
      singleMinimumFloor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 43200, spending: 43200, bal_total: 500000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 43200, spending: 43200, bal_total: 450000 }
      ]),
      coupleTightFloor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 96000, spending: 96000, bal_total: 200000 },
        { ...fixture.years[1], shortfall: 12000, totalAftaxYear: 96000, spending: 96000, bal_total: 0 }
      ]),
      pensionCoupleSurvivor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 64800, spending: 64800, bal_total: 600000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 64800, spending: 64800, bal_total: 500000 }
      ]),
      estateHeavyRoom: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 84000, spending: 84000, bal_total: 6000000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 84000, spending: 84000, bal_total: 7000000 }
      ])
    };

    for (const card of cleanExamplePlanCards) {
      const plan = createCleanExampleRuntimePlan(card.id);
      const result = runtimeRowsByExample[card.id];
      const answer = selectRetirementAnswerSummary(result, { ...plan, inheritance: 0 });
      const spending = selectSpendingCapacitySummary(result, {}, { ...plan, inheritance: 0 }, answer);
      const capacity = selectMonthlyCapacityFoundation(result, { ...plan, inheritance: 0 }, spending);
      const decision = selectMonthlyCapacityDecisionLayer(capacity, { ...plan, inheritance: 0 });

      expect({ status: capacity.status, decision: decision.decision }, card.id).toEqual(expected[card.id]);
    }
  });

  it('separates runtime floor inputs from mortgage and saved capacity output', () => {
    const plan = createCleanExampleRuntimePlan('coupleTightFloor');
    const floorInputs = selectMonthlyCapacityFloorInputs(plan);
    const saved = createPlanFile(plan);

    expect(floorInputs).toMatchObject({
      status: 'ready',
      source: 'runtimePlan',
      monthlyMinimumExpensesExMortgage: 6200,
      monthlyMortgagePayment: 1800,
      monthlyFloor: 8000
    });
    expect(floorInputs.detail).toContain('separate minimum monthly expenses');
    expect(floorInputs.boundary).toContain('Runtime-only floor inputs');
    expect(saved.plan).not.toHaveProperty('monthlyCapacityFloorInputs');
    expect(saved.plan).not.toHaveProperty('monthlyAfterTaxCapacity');
  });

  it('keeps runtime caveat signals visible without account instructions', () => {
    const plan = createCleanExampleRuntimePlan('estateHeavyRoom');
    const result = withRows([
      {
        ...fixture.years[0],
        shortfall: 0,
        totalAftaxYear: 84000,
        spending: 84000,
        totalTaxYear: 18000,
        taxableIncome: 120000,
        totalOasClawY: 1200,
        bal_total: 6000000
      },
      {
        ...fixture.years[1],
        shortfall: 0,
        totalAftaxYear: 84000,
        spending: 84000,
        totalTaxYear: 21000,
        taxableIncome: 130000,
        totalOasClawY: 2000,
        bal_total: 7000000
      }
    ]);
    const answer = selectRetirementAnswerSummary(result, { ...plan, inheritance: 0 });
    const spending = selectSpendingCapacitySummary(result, {}, { ...plan, inheritance: 0 }, answer);
    const capacity = selectMonthlyCapacityFoundation(result, { ...plan, inheritance: 0 }, spending);
    const caveats = selectMonthlyCapacityCaveatSignals(result, { ...plan, inheritance: 0 }, capacity);

    expect(caveats.map((row) => row.id)).toEqual(['tax', 'survivor', 'estate', 'homeEquity', 'spendingPath']);
    expect(caveats.find((row) => row.id === 'tax')).toMatchObject({ status: 'review', detailArea: 'taxes' });
    expect(caveats.find((row) => row.id === 'survivor')).toMatchObject({ status: 'review', detailArea: 'householdResilience' });
    expect(caveats.find((row) => row.id === 'homeEquity')).toMatchObject({ status: 'review' });
    expect(caveats.map((row) => row.detail).join(' ')).not.toContain('withdraw from');
    expect(createPlanFile(plan).plan).not.toHaveProperty('monthlyCapacityCaveatSignals');
  });

  it('defines a floor-first future optimizer objective without running or saving optimizer output', () => {
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
    const objective = selectMonthlyCapacityOptimizerObjective(capacity);
    const saved = createPlanFile(planFixture);

    expect(objective).toMatchObject({
      status: 'readyForFutureOptimizer',
      objective: 'coverMonthlyFloorFirst',
      floorMonthly: 70000 / 12,
      capacityMonthly: 63000 / 12,
      allowedLeverIds: ['reduceSpending', 'workLonger', 'downsize', 'saveMore'],
      forbiddenOutputs: ['savedCapacity', 'accountLevelSequencing', 'accountInstructions', 'fundingTrace']
    });
    expect(objective.gapOrRoomMonthly).toBeCloseTo(-7000 / 12);
    expect(objective.detail).toContain('cover the monthly floor');
    expect(objective.boundary).toContain('does not run an optimizer');
    expect(saved.plan).not.toHaveProperty('monthlyCapacityOptimizerObjective');
    expect(saved.plan).not.toHaveProperty('optimizerOutput');
  });

  it('marks the future optimizer objective as needing inputs when capacity cannot be decided', () => {
    const capacity = selectMonthlyCapacityFoundation({ years: [] }, { ...planFixture, spending: { ...planFixture.spending, gogo: 0 } });
    const objective = selectMonthlyCapacityOptimizerObjective(capacity);

    expect(objective.status).toBe('needsInputs');
    expect(objective.objective).toBe('coverMonthlyFloorFirst');
    expect(objective.allowedLeverIds).toEqual(['taxReview', 'estateReview']);
    expect(objective.detail).toContain('Complete runtime floor');
  });

  it('builds a runtime capacity packet for future optimizer handoff without persisting it', () => {
    const plan = createCleanExampleRuntimePlan('pensionCoupleSurvivor');
    const result = withRows([
      { ...fixture.years[0], shortfall: 0, totalAftaxYear: 64800, spending: 64800, bal_total: 600000 },
      { ...fixture.years[1], shortfall: 0, totalAftaxYear: 64800, spending: 64800, bal_total: 500000 }
    ]);
    const answer = selectRetirementAnswerSummary(result, { ...plan, inheritance: 0 });
    const spending = selectSpendingCapacitySummary(result, {}, { ...plan, inheritance: 0 }, answer);
    const packet = selectMonthlyCapacityRuntimePacket(result, { ...plan, inheritance: 0 }, spending);
    const saved = createPlanFile(plan);

    expect(packet.status).toBe(packet.foundation.status);
    expect(packet.floorInputs.monthlyFloor).toBe(5400);
    expect(packet.reviewRows.map((row) => row.id)).toEqual(['floor', 'capacity', 'room', 'options']);
    expect(packet.decisionLayer.decision).toBe('needsReview');
    expect(packet.caveatSignals.find((row) => row.id === 'survivor')).toMatchObject({ status: 'review' });
    expect(packet.optimizerObjective.objective).toBe('coverMonthlyFloorFirst');
    expect(packet.boundary).toContain('Runtime-only capacity packet');
    expect(saved.plan).not.toHaveProperty('monthlyCapacityRuntimePacket');
  });

  it('runs fresh clean examples through the capacity runtime packet matrix', () => {
    const runtimeRowsByExample: Record<string, SimulationResult> = {
      singleMinimumFloor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 43200, spending: 43200, bal_total: 500000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 43200, spending: 43200, bal_total: 450000 }
      ]),
      coupleTightFloor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 96000, spending: 96000, bal_total: 200000 },
        { ...fixture.years[1], shortfall: 12000, totalAftaxYear: 96000, spending: 96000, bal_total: 0 }
      ]),
      pensionCoupleSurvivor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 64800, spending: 64800, bal_total: 600000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 64800, spending: 64800, bal_total: 500000 }
      ]),
      estateHeavyRoom: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 84000, spending: 84000, bal_total: 6000000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 84000, spending: 84000, bal_total: 7000000 }
      ])
    };

    for (const card of cleanExamplePlanCards) {
      const plan = createCleanExampleRuntimePlan(card.id);
      const result = runtimeRowsByExample[card.id];
      const answer = selectRetirementAnswerSummary(result, { ...plan, inheritance: 0 });
      const spending = selectSpendingCapacitySummary(result, {}, { ...plan, inheritance: 0 }, answer);
      const packet = selectMonthlyCapacityRuntimePacket(result, { ...plan, inheritance: 0 }, spending);

      expect(packet.floorInputs.status, card.id).toBe('ready');
      expect(packet.optimizerObjective.status, card.id).toBe('readyForFutureOptimizer');
      expect(packet.optimizerObjective.forbiddenOutputs, card.id).toContain('accountLevelSequencing');
      expect(packet.caveatSignals.length, card.id).toBe(5);
    }
  });

  it('allows practical levers only when the runtime floor has a gap', () => {
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
    const packet = selectMonthlyCapacityRuntimePacket(shortfallResult, planFixture, spending);
    const gates = selectMonthlyCapacityLeverGates(packet);

    expect(gates.filter((gate) => gate.status === 'allowed').map((gate) => gate.id)).toEqual([
      'reduceSpending',
      'workLonger',
      'downsize',
      'saveMore'
    ]);
    expect(gates.filter((gate) => gate.status === 'reviewOnly').map((gate) => gate.id)).toEqual(['taxReview', 'estateReview']);
    expect(gates.map((gate) => gate.reason).join(' ')).not.toContain('recommend');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityLeverGates');
  });

  it('suppresses practical levers when floor coverage is tight or covered', () => {
    const answer = selectRetirementAnswerSummary(fixture, planFixture);
    const spending = selectSpendingCapacitySummary(fixture, {}, planFixture, answer);
    const packet = selectMonthlyCapacityRuntimePacket(fixture, planFixture, spending);
    const gates = selectMonthlyCapacityLeverGates(packet);

    expect(packet.status).toBe('tight');
    expect(gates.filter((gate) => gate.id === 'reduceSpending' || gate.id === 'workLonger').map((gate) => gate.status)).toEqual([
      'suppressed',
      'suppressed'
    ]);
    expect(gates.find((gate) => gate.id === 'taxReview')).toMatchObject({ status: 'reviewOnly' });
    expect(gates.find((gate) => gate.id === 'reduceSpending')?.reason).toContain('unless the runtime capacity status is gap');
  });

  it('closes out monthly capacity readiness with review caveats attached', () => {
    const answer = selectRetirementAnswerSummary(fixture, planFixture);
    const spending = selectSpendingCapacitySummary(fixture, {}, planFixture, answer);
    const packet = selectMonthlyCapacityRuntimePacket(fixture, planFixture, spending);
    const closeout = selectMonthlyCapacityReadinessCloseout(packet);

    expect(closeout).toMatchObject({
      status: 'needsReview',
      openGateIds: ['taxReview', 'estateReview']
    });
    expect(closeout.headline).toContain('review caveats');
    expect(closeout.nextStep).toContain('survivor');
    expect(closeout.boundary).toContain('does not change UI');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityReadinessCloseout');
  });

  it('closes out monthly capacity readiness as action-needed only for gaps', () => {
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
    const packet = selectMonthlyCapacityRuntimePacket(shortfallResult, planFixture, spending);
    const closeout = selectMonthlyCapacityReadinessCloseout(packet);

    expect(closeout.status).toBe('needsAction');
    expect(closeout.openGateIds).toEqual(['reduceSpending', 'workLonger', 'downsize', 'saveMore', 'taxReview', 'estateReview']);
    expect(closeout.nextStep).toContain('practical gap options');
    expect(closeout.nextStep).not.toContain('account');
  });

  it('closes out monthly capacity readiness as input-needed without inventing precision', () => {
    const packet = selectMonthlyCapacityRuntimePacket({ years: [] }, { ...planFixture, spending: { ...planFixture.spending, gogo: 0 } });
    const closeout = selectMonthlyCapacityReadinessCloseout(packet);

    expect(packet.status).toBe('cannotTell');
    expect(closeout.status).toBe('needsInputs');
    expect(closeout.openGateIds).toEqual([]);
    expect(closeout.nextStep).toContain('Complete runtime floor');
  });

  it('builds a floor-first optimizer handoff from the runtime capacity packet', () => {
    const answer = selectRetirementAnswerSummary(fixture, planFixture);
    const spending = selectSpendingCapacitySummary(fixture, {}, planFixture, answer);
    const packet = selectMonthlyCapacityRuntimePacket(fixture, planFixture, spending);
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);

    expect(handoff).toMatchObject({
      status: 'review',
      objective: 'coverMonthlyFloorFirst',
      packetStatus: 'tight',
      allowedPracticalLeverIds: [],
      reviewOnlyLeverIds: ['taxReview', 'estateReview'],
      blockedOutputIds: ['savedCapacity', 'accountLevelSequencing', 'accountInstructions', 'fundingTrace']
    });
    expect(handoff.rows.map((row) => row.id)).toEqual([
      'floorFirstObjective',
      'floorCoverage',
      'leverGate',
      'caveatCoverage',
      'outputBoundary'
    ]);
    expect(handoff.boundary).toContain('does not run optimizer search');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityOptimizerHandoff');
  });

  it('blocks optimizer handoff when monthly capacity inputs are missing', () => {
    const packet = selectMonthlyCapacityRuntimePacket({ years: [] }, { ...planFixture, spending: { ...planFixture.spending, gogo: 0 } });
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);

    expect(handoff.status).toBe('blocked');
    expect(handoff.rows.find((row) => row.id === 'floorFirstObjective')).toMatchObject({ status: 'block' });
    expect(handoff.rows.find((row) => row.id === 'floorCoverage')?.detail).toContain('blocked');
    expect(handoff.allowedPracticalLeverIds).toEqual([]);
    expect(handoff.reviewOnlyLeverIds).toEqual([]);
  });

  it('opens only practical handoff levers when floor coverage has a gap', () => {
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
    const packet = selectMonthlyCapacityRuntimePacket(shortfallResult, planFixture, spending);
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);

    expect(handoff.status).toBe('review');
    expect(handoff.allowedPracticalLeverIds).toEqual(['reduceSpending', 'workLonger', 'downsize', 'saveMore']);
    expect(handoff.reviewOnlyLeverIds).toEqual(['taxReview', 'estateReview']);
    expect(handoff.rows.find((row) => row.id === 'leverGate')?.detail).toContain('monthly floor has a gap');
  });

  it('combines capacity handoff with existing optimizer input permissions', () => {
    const answer = selectRetirementAnswerSummary(fixture, planFixture);
    const spending = selectSpendingCapacitySummary(fixture, {}, planFixture, answer);
    const packet = selectMonthlyCapacityRuntimePacket(fixture, planFixture, spending);
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const boundaries = selectOptimizerDecisionBoundaries(fixture, planFixture, answer);
    const review = selectOptimizerInputReview(boundaries);
    const contract = selectMonthlyCapacityOptimizerInputContract(handoff, review);

    expect(contract.status).toBe('review');
    expect(contract.capacityStatus).toBe('review');
    expect(contract.optimizerInputStatus).toBe('review');
    expect(contract.canExploreLeverIds).toContain('spending');
    expect(contract.mustPreserveLeverIds).toEqual(expect.arrayContaining(['withdrawalOrder', 'estateTarget', 'downsizing']));
    expect(contract.needsDecisionLeverIds).toEqual([]);
    expect(contract.boundary).toContain('does not persist optimizer permissions');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityOptimizerInputContract');
  });

  it('blocks the optimizer input contract when existing permissions need decisions', () => {
    const plan = {
      ...planFixture,
      spending: { gogo: 0, gogoEnd: 75, slowgo: 0, slowgoEnd: 85, nogo: 0 },
      p1: { ...planFixture.p1, retireYear: 0, cpp65_monthly: 0, cpp70_monthly: 0, oas_monthly: 0 },
      assumptions: { ...planFixture.assumptions, retireYear: 0 }
    };
    const packet = selectMonthlyCapacityRuntimePacket({ years: [] }, plan);
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const boundaries = selectOptimizerDecisionBoundaries(fixture, plan, selectRetirementAnswerSummary(fixture, plan));
    const review = selectOptimizerInputReview(boundaries);
    const contract = selectMonthlyCapacityOptimizerInputContract(handoff, review);

    expect(contract.status).toBe('blocked');
    expect(contract.needsDecisionLeverIds).toEqual(expect.arrayContaining(['spending', 'retirementTiming', 'benefitTiming']));
    expect(contract.blockedReasons.join(' ')).toContain('Monthly capacity handoff is blocked');
    expect(contract.blockedReasons.join(' ')).toContain('household decisions');
  });

  it('keeps optimizer handoff guardrails explicit and non-instructional', () => {
    const answer = selectRetirementAnswerSummary(fixture, planFixture);
    const spending = selectSpendingCapacitySummary(fixture, {}, planFixture, answer);
    const packet = selectMonthlyCapacityRuntimePacket(fixture, planFixture, spending);
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const guardrails = selectMonthlyCapacityOptimizerGuardrails(handoff);

    expect(guardrails.map((row) => row.id)).toEqual([
      'floorFirst',
      'neutralGapOptions',
      'noSavedOutput',
      'noFundingTrace',
      'noAccountInstructions',
      'noAnnualSequencing'
    ]);
    expect(guardrails.find((row) => row.id === 'noAccountInstructions')?.detail).not.toContain('withdraw from RRSP');
    expect(guardrails.find((row) => row.id === 'noAnnualSequencing')?.detail).toContain('deferred');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityOptimizerGuardrails');
  });

  it('summarizes clean example optimizer handoff readiness without running optimizer search', () => {
    const runtimeRowsByExample: Record<string, SimulationResult> = {
      singleMinimumFloor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 43200, spending: 43200, bal_total: 500000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 43200, spending: 43200, bal_total: 450000 }
      ]),
      coupleTightFloor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 96000, spending: 96000, bal_total: 200000 },
        { ...fixture.years[1], shortfall: 12000, totalAftaxYear: 96000, spending: 96000, bal_total: 0 }
      ]),
      pensionCoupleSurvivor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 64800, spending: 64800, bal_total: 600000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 64800, spending: 64800, bal_total: 500000 }
      ]),
      estateHeavyRoom: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 84000, spending: 84000, bal_total: 6000000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 84000, spending: 84000, bal_total: 7000000 }
      ])
    };
    const expected: Record<string, { capacityStatus: string; handoffStatus: string; openLeverIds: string[] }> = {
      singleMinimumFloor: { capacityStatus: 'tight', handoffStatus: 'review', openLeverIds: ['taxReview', 'estateReview'] },
      coupleTightFloor: {
        capacityStatus: 'gap',
        handoffStatus: 'review',
        openLeverIds: ['reduceSpending', 'workLonger', 'downsize', 'saveMore', 'taxReview', 'estateReview']
      },
      pensionCoupleSurvivor: { capacityStatus: 'tight', handoffStatus: 'review', openLeverIds: ['taxReview', 'estateReview'] },
      estateHeavyRoom: { capacityStatus: 'covered', handoffStatus: 'review', openLeverIds: ['taxReview', 'estateReview'] }
    };

    for (const card of cleanExamplePlanCards) {
      const plan = createCleanExampleRuntimePlan(card.id);
      const result = runtimeRowsByExample[card.id];
      const answer = selectRetirementAnswerSummary(result, { ...plan, inheritance: 0 });
      const spending = selectSpendingCapacitySummary(result, {}, { ...plan, inheritance: 0 }, answer);
      const packet = selectMonthlyCapacityRuntimePacket(result, { ...plan, inheritance: 0 }, spending);
      const exampleHandoff = selectMonthlyCapacityOptimizerExampleHandoff(card.id, packet);

      expect(exampleHandoff, card.id).toMatchObject(expected[card.id]);
      expect(exampleHandoff.objective, card.id).toBe('coverMonthlyFloorFirst');
      expect(exampleHandoff.guardrailStatuses.noSavedOutput, card.id).toBe('pass');
      expect(exampleHandoff.guardrailStatuses.noAnnualSequencing, card.id).toBe('pass');
      expect(exampleHandoff.boundary, card.id).toContain('does not run optimizer search');
      expect(createPlanFile(plan).plan).not.toHaveProperty('monthlyCapacityOptimizerExampleHandoff');
    }
  });

  it('keeps optimizer execution gated as review-only when capacity is ready but implementation rules are not', () => {
    const answer = selectRetirementAnswerSummary(fixture, planFixture);
    const spending = selectSpendingCapacitySummary(fixture, {}, planFixture, answer);
    const packet = selectMonthlyCapacityRuntimePacket(fixture, planFixture, spending);
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(fixture, planFixture, answer));
    const contract = selectMonthlyCapacityOptimizerInputContract(handoff, review);
    const gate = selectMonthlyCapacityOptimizerExecutionGate(contract, selectMonthlyCapacityOptimizerGuardrails(handoff));

    expect(gate.status).toBe('reviewOnly');
    expect(gate.requiredBeforeExecution).toEqual(['keepOutputRuntimeOnly', 'defineCandidateScoring', 'preserveNoAnnualSequencing']);
    expect(gate.allowedNow).toEqual(['runtimeEvidence', 'tests', 'docs', 'boundedReviewOnly']);
    expect(gate.notAllowedYet).toEqual(['optimizerSearch', 'savedOptimizerOutput', 'fundingTrace', 'accountInstructions', 'annualAccountSequencing']);
    expect(gate.boundary).toContain('does not start optimizer search');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityOptimizerExecutionGate');
  });

  it('blocks optimizer execution gate when capacity handoff or input decisions are blocked', () => {
    const plan = {
      ...planFixture,
      spending: { gogo: 0, gogoEnd: 75, slowgo: 0, slowgoEnd: 85, nogo: 0 },
      p1: { ...planFixture.p1, retireYear: 0, cpp65_monthly: 0, cpp70_monthly: 0, oas_monthly: 0 },
      assumptions: { ...planFixture.assumptions, retireYear: 0 }
    };
    const packet = selectMonthlyCapacityRuntimePacket({ years: [] }, plan);
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(fixture, plan, selectRetirementAnswerSummary(fixture, plan)));
    const contract = selectMonthlyCapacityOptimizerInputContract(handoff, review);
    const gate = selectMonthlyCapacityOptimizerExecutionGate(contract, selectMonthlyCapacityOptimizerGuardrails(handoff));

    expect(gate.status).toBe('blocked');
    expect(gate.requiredBeforeExecution).toEqual(
      expect.arrayContaining(['completeCapacityInputs', 'resolveOptimizerInputDecisions', 'keepOutputRuntimeOnly', 'defineCandidateScoring'])
    );
    expect(gate.headline).toContain('blocked');
  });

  it('closes out floor-first optimizer handoff as ready for candidate scoring planning', () => {
    const answer = selectRetirementAnswerSummary(fixture, planFixture);
    const spending = selectSpendingCapacitySummary(fixture, {}, planFixture, answer);
    const packet = selectMonthlyCapacityRuntimePacket(fixture, planFixture, spending);
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(fixture, planFixture, answer));
    const contract = selectMonthlyCapacityOptimizerInputContract(handoff, review);
    const gate = selectMonthlyCapacityOptimizerExecutionGate(contract, selectMonthlyCapacityOptimizerGuardrails(handoff));
    const closeout = selectMonthlyCapacityOptimizerHandoffCloseout(gate);

    expect(closeout).toMatchObject({
      status: 'readyForPlanning',
      nextBroadStep: 'candidateScoringPlan',
      preservedBoundaries: ['optimizerSearch', 'savedOptimizerOutput', 'fundingTrace', 'accountInstructions', 'annualAccountSequencing']
    });
    expect(closeout.packageSummary).toContain('monthly capacity evidence');
    expect(closeout.boundary).toContain('no UI change');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityOptimizerHandoffCloseout');
  });

  it('closes out floor-first optimizer handoff as blocked when inputs are incomplete', () => {
    const plan = { ...planFixture, spending: { ...planFixture.spending, gogo: 0 } };
    const packet = selectMonthlyCapacityRuntimePacket({ years: [] }, plan);
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(fixture, plan, selectRetirementAnswerSummary(fixture, plan)));
    const contract = selectMonthlyCapacityOptimizerInputContract(handoff, review);
    const gate = selectMonthlyCapacityOptimizerExecutionGate(contract, selectMonthlyCapacityOptimizerGuardrails(handoff));
    const closeout = selectMonthlyCapacityOptimizerHandoffCloseout(gate);

    expect(closeout.status).toBe('blocked');
    expect(closeout.nextBroadStep).toBe('capacityInputsFirst');
    expect(closeout.headline).toContain('needs inputs');
  });

  it('defines a runtime-only candidate scoring rubric after optimizer handoff readiness', () => {
    const answer = selectRetirementAnswerSummary(fixture, planFixture);
    const spending = selectSpendingCapacitySummary(fixture, {}, planFixture, answer);
    const packet = selectMonthlyCapacityRuntimePacket(fixture, planFixture, spending);
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(fixture, planFixture, answer));
    const contract = selectMonthlyCapacityOptimizerInputContract(handoff, review);
    const gate = selectMonthlyCapacityOptimizerExecutionGate(contract, selectMonthlyCapacityOptimizerGuardrails(handoff));
    const rubric = selectMonthlyCapacityScoringRubric(gate);

    expect(rubric.status).toBe('readyForPlanning');
    expect(rubric.objective).toBe('coverMonthlyFloorFirst');
    expect(rubric.primaryFactorIds).toEqual(['floorCoverage', 'gapRepair']);
    expect(rubric.guardrailFactorIds).toEqual(['outputBoundary']);
    expect(rubric.factors.map((factor) => factor.id)).toEqual([
      'floorCoverage',
      'gapRepair',
      'taxImpact',
      'survivorEstate',
      'disruptionPenalty',
      'outputBoundary'
    ]);
    expect(rubric.factors.find((factor) => factor.id === 'outputBoundary')?.detail).toContain('funding trace');
    expect(rubric.boundary).toContain('without running candidates');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityScoringRubric');
  });

  it('keeps the scoring rubric blocked when execution prerequisites are blocked', () => {
    const packet = selectMonthlyCapacityRuntimePacket({ years: [] }, { ...planFixture, spending: { ...planFixture.spending, gogo: 0 } });
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(fixture, planFixture));
    const contract = selectMonthlyCapacityOptimizerInputContract(handoff, review);
    const gate = selectMonthlyCapacityOptimizerExecutionGate(contract, selectMonthlyCapacityOptimizerGuardrails(handoff));
    const rubric = selectMonthlyCapacityScoringRubric(gate);

    expect(gate.status).toBe('blocked');
    expect(rubric.status).toBe('blocked');
    expect(rubric.factors.find((factor) => factor.id === 'floorCoverage')?.weight).toBe('primary');
  });

  it('normalizes runtime score inputs for future candidate scoring without scoring candidates', () => {
    const answer = selectRetirementAnswerSummary(fixture, planFixture);
    const spending = selectSpendingCapacitySummary(fixture, {}, planFixture, answer);
    const packet = selectMonthlyCapacityRuntimePacket(fixture, planFixture, spending);
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);

    expect(inputs).toMatchObject({
      status: 'ready',
      floorMonthly: 70000 / 12,
      capacityMonthly: 70000 / 12,
      gapOrRoomMonthly: 0,
      hasGap: false,
      hasReviewCaveats: true,
      openLeverIds: ['taxReview', 'estateReview'],
      forbiddenOutputIds: ['savedCapacity', 'accountLevelSequencing', 'accountInstructions', 'fundingTrace']
    });
    expect(inputs.boundary).toContain('does not calculate candidate scores');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityCandidateScoreInputs');
  });

  it('normalizes gap score inputs with practical levers open', () => {
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
    const packet = selectMonthlyCapacityRuntimePacket(shortfallResult, planFixture, spending);
    const inputs = selectMonthlyCapacityCandidateScoreInputs(packet);

    expect(inputs.status).toBe('ready');
    expect(inputs.hasGap).toBe(true);
    expect(inputs.gapOrRoomMonthly).toBeLessThan(0);
    expect(inputs.openLeverIds).toEqual(['reduceSpending', 'workLonger', 'downsize', 'saveMore', 'taxReview', 'estateReview']);
  });

  it('blocks score inputs when capacity handoff is blocked', () => {
    const packet = selectMonthlyCapacityRuntimePacket({ years: [] }, { ...planFixture, spending: { ...planFixture.spending, gogo: 0 } });
    const inputs = selectMonthlyCapacityCandidateScoreInputs(packet);

    expect(inputs.status).toBe('blocked');
    expect(inputs.floorMonthly).toBe(0);
    expect(inputs.openLeverIds).toEqual([]);
  });

  it('defines candidate score policy rows without ranking candidates', () => {
    const answer = selectRetirementAnswerSummary(fixture, planFixture);
    const spending = selectSpendingCapacitySummary(fixture, {}, planFixture, answer);
    const packet = selectMonthlyCapacityRuntimePacket(fixture, planFixture, spending);
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(fixture, planFixture, answer));
    const contract = selectMonthlyCapacityOptimizerInputContract(handoff, review);
    const gate = selectMonthlyCapacityOptimizerExecutionGate(contract, selectMonthlyCapacityOptimizerGuardrails(handoff));
    const rubric = selectMonthlyCapacityScoringRubric(gate);
    const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
    const policy = selectMonthlyCapacityCandidateScorePolicy(rubric, inputs);

    expect(policy.status).toBe('readyForPlanning');
    expect(policy.rows.map((row) => row.factorId)).toEqual([
      'floorCoverage',
      'gapRepair',
      'taxImpact',
      'survivorEstate',
      'disruptionPenalty',
      'outputBoundary'
    ]);
    expect(policy.rows.find((row) => row.factorId === 'floorCoverage')).toMatchObject({ status: 'active' });
    expect(policy.rows.find((row) => row.factorId === 'gapRepair')).toMatchObject({ status: 'reviewOnly' });
    expect(policy.rows.find((row) => row.factorId === 'taxImpact')?.application).toContain('tie-breaker');
    expect(policy.tieBreakers).toEqual(['fewerDisruptiveChanges', 'lowerTaxPressure', 'strongerSurvivorEstateFit', 'currentPlanIfEquivalent']);
    expect(policy.boundary).toContain('does not rank candidates');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityCandidateScorePolicy');
  });

  it('activates gap repair in candidate score policy only for visible gaps', () => {
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
    const packet = selectMonthlyCapacityRuntimePacket(shortfallResult, planFixture, spending);
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(shortfallResult, planFixture, answer));
    const contract = selectMonthlyCapacityOptimizerInputContract(handoff, review);
    const gate = selectMonthlyCapacityOptimizerExecutionGate(contract, selectMonthlyCapacityOptimizerGuardrails(handoff));
    const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(gate), selectMonthlyCapacityCandidateScoreInputs(packet, handoff));

    expect(policy.rows.find((row) => row.factorId === 'gapRepair')).toMatchObject({
      status: 'active',
      application: expect.stringContaining('reduce the monthly gap')
    });
  });

  it('blocks candidate score policy when rubric or inputs are blocked', () => {
    const packet = selectMonthlyCapacityRuntimePacket({ years: [] }, { ...planFixture, spending: { ...planFixture.spending, gogo: 0 } });
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(fixture, planFixture));
    const contract = selectMonthlyCapacityOptimizerInputContract(handoff, review);
    const gate = selectMonthlyCapacityOptimizerExecutionGate(contract, selectMonthlyCapacityOptimizerGuardrails(handoff));
    const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(gate), selectMonthlyCapacityCandidateScoreInputs(packet, handoff));

    expect(policy.status).toBe('blocked');
    expect(policy.rows.filter((row) => row.status === 'blocked').map((row) => row.factorId)).toEqual([
      'floorCoverage',
      'gapRepair',
      'taxImpact',
      'survivorEstate',
      'disruptionPenalty'
    ]);
    expect(policy.rows.find((row) => row.factorId === 'outputBoundary')).toMatchObject({ status: 'active' });
  });

  it('runs fresh clean examples through the candidate scoring readiness matrix', () => {
    const runtimeRowsByExample: Record<string, SimulationResult> = {
      singleMinimumFloor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 43200, spending: 43200, bal_total: 500000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 43200, spending: 43200, bal_total: 450000 }
      ]),
      coupleTightFloor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 96000, spending: 96000, bal_total: 200000 },
        { ...fixture.years[1], shortfall: 12000, totalAftaxYear: 96000, spending: 96000, bal_total: 0 }
      ]),
      pensionCoupleSurvivor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 64800, spending: 64800, bal_total: 600000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 64800, spending: 64800, bal_total: 500000 }
      ]),
      estateHeavyRoom: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 84000, spending: 84000, bal_total: 6000000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 84000, spending: 84000, bal_total: 7000000 }
      ])
    };

    for (const card of cleanExamplePlanCards) {
      const plan = createCleanExampleRuntimePlan(card.id);
      const result = runtimeRowsByExample[card.id];
      const answer = selectRetirementAnswerSummary(result, { ...plan, inheritance: 0 });
      const spending = selectSpendingCapacitySummary(result, {}, { ...plan, inheritance: 0 }, answer);
      const packet = selectMonthlyCapacityRuntimePacket(result, { ...plan, inheritance: 0 }, spending);
      const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
      const gateStatus: 'blocked' | 'reviewOnly' = handoff.status === 'blocked' ? 'blocked' : 'reviewOnly';
      const gate = {
        status: gateStatus,
        headline: 'Example scoring readiness gate',
        requiredBeforeExecution: ['keepOutputRuntimeOnly', 'defineCandidateScoring', 'preserveNoAnnualSequencing'] as Array<
          'keepOutputRuntimeOnly' | 'defineCandidateScoring' | 'preserveNoAnnualSequencing'
        >,
        allowedNow: ['runtimeEvidence', 'tests', 'docs', 'boundedReviewOnly'] as Array<'runtimeEvidence' | 'tests' | 'docs' | 'boundedReviewOnly'>,
        notAllowedYet: ['optimizerSearch', 'savedOptimizerOutput', 'fundingTrace', 'accountInstructions', 'annualAccountSequencing'] as Array<
          'optimizerSearch' | 'savedOptimizerOutput' | 'fundingTrace' | 'accountInstructions' | 'annualAccountSequencing'
        >,
        boundary: 'Test-only scoring readiness gate for example matrix coverage.'
      };
      const rubric = selectMonthlyCapacityScoringRubric(gate);
      const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
      const policy = selectMonthlyCapacityCandidateScorePolicy(rubric, inputs);
      const readiness = selectMonthlyCapacityScoringExampleReadiness(card.id, inputs, policy);

      expect(readiness.status, card.id).toBe('readyForPlanning');
      expect(readiness.activePolicyFactorIds, card.id).toContain('floorCoverage');
      expect(readiness.activePolicyFactorIds, card.id).toContain('outputBoundary');
      if (card.id === 'coupleTightFloor') expect(readiness.activePolicyFactorIds, card.id).toContain('gapRepair');
      else expect(readiness.reviewOnlyPolicyFactorIds, card.id).toContain('gapRepair');
      expect(readiness.boundary, card.id).toContain('without scoring candidates');
      expect(createPlanFile(plan).plan).not.toHaveProperty('monthlyCapacityScoringExampleReadiness');
    }
  });

  it('closes out candidate scoring planning without executing scoring', () => {
    const answer = selectRetirementAnswerSummary(fixture, planFixture);
    const spending = selectSpendingCapacitySummary(fixture, {}, planFixture, answer);
    const packet = selectMonthlyCapacityRuntimePacket(fixture, planFixture, spending);
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(fixture, planFixture, answer));
    const gate = selectMonthlyCapacityOptimizerExecutionGate(
      selectMonthlyCapacityOptimizerInputContract(handoff, review),
      selectMonthlyCapacityOptimizerGuardrails(handoff)
    );
    const rubric = selectMonthlyCapacityScoringRubric(gate);
    const policy = selectMonthlyCapacityCandidateScorePolicy(rubric, selectMonthlyCapacityCandidateScoreInputs(packet, handoff));
    const closeout = selectMonthlyCapacityScoringPlanCloseout(rubric, policy);

    expect(closeout).toMatchObject({
      status: 'readyForImplementationPlanning',
      nextBroadStep: 'candidateSetImplementationPlan',
      completedPieces: ['rubric', 'scoreInputs', 'scorePolicy', 'exampleMatrix', 'persistenceGuardrails']
    });
    expect(closeout.stillDeferred).toEqual([
      'candidateScoringExecution',
      'optimizerSearch',
      'savedScores',
      'fundingTrace',
      'accountInstructions',
      'annualSequencing',
      'uiPresentation'
    ]);
    expect(closeout.boundary).toContain('no candidate scoring execution');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityScoringPlanCloseout');
  });

  it('closes out candidate scoring planning as blocked when inputs are blocked', () => {
    const packet = selectMonthlyCapacityRuntimePacket({ years: [] }, { ...planFixture, spending: { ...planFixture.spending, gogo: 0 } });
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(fixture, planFixture));
    const gate = selectMonthlyCapacityOptimizerExecutionGate(
      selectMonthlyCapacityOptimizerInputContract(handoff, review),
      selectMonthlyCapacityOptimizerGuardrails(handoff)
    );
    const rubric = selectMonthlyCapacityScoringRubric(gate);
    const policy = selectMonthlyCapacityCandidateScorePolicy(rubric, selectMonthlyCapacityCandidateScoreInputs(packet, handoff));
    const closeout = selectMonthlyCapacityScoringPlanCloseout(rubric, policy);

    expect(closeout.status).toBe('blocked');
    expect(closeout.nextBroadStep).toBe('capacityInputsFirst');
  });

  it('plans floor-first candidate families without building candidates', () => {
    const answer = selectRetirementAnswerSummary(fixture, planFixture);
    const spending = selectSpendingCapacitySummary(fixture, {}, planFixture, answer);
    const packet = selectMonthlyCapacityRuntimePacket(fixture, planFixture, spending);
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(fixture, planFixture, answer));
    const gate = selectMonthlyCapacityOptimizerExecutionGate(
      selectMonthlyCapacityOptimizerInputContract(handoff, review),
      selectMonthlyCapacityOptimizerGuardrails(handoff)
    );
    const rubric = selectMonthlyCapacityScoringRubric(gate);
    const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
    const policy = selectMonthlyCapacityCandidateScorePolicy(rubric, inputs);
    const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);

    expect(candidateSet.status).toBe('readyForPlanning');
    expect(candidateSet.objective).toBe('coverMonthlyFloorFirst');
    expect(candidateSet.rows.map((row) => row.id)).toEqual([
      'currentPlan',
      'spendingRepair',
      'workTiming',
      'benefitTiming',
      'taxEstateReview',
      'broadWithdrawalFamily',
      'homeEquityReliance',
      'annualSequencing'
    ]);
    expect(candidateSet.includedFamilyIds).toEqual(['currentPlan']);
    expect(candidateSet.reviewOnlyFamilyIds).toEqual([
      'spendingRepair',
      'workTiming',
      'benefitTiming',
      'taxEstateReview',
      'broadWithdrawalFamily'
    ]);
    expect(candidateSet.deferredFamilyIds).toEqual(['homeEquityReliance', 'annualSequencing']);
    expect(candidateSet.boundary).toContain('without building candidates');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityCandidateSetPlan');
  });

  it('includes practical gap-repair candidate families only when the floor has a gap', () => {
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
    const packet = selectMonthlyCapacityRuntimePacket(shortfallResult, planFixture, spending);
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(shortfallResult, planFixture, answer));
    const gate = selectMonthlyCapacityOptimizerExecutionGate(
      selectMonthlyCapacityOptimizerInputContract(handoff, review),
      selectMonthlyCapacityOptimizerGuardrails(handoff)
    );
    const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
    const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(gate), inputs);
    const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);

    expect(candidateSet.includedFamilyIds).toEqual(['currentPlan', 'spendingRepair', 'workTiming']);
    expect(candidateSet.reviewOnlyFamilyIds).toEqual(['benefitTiming', 'taxEstateReview', 'broadWithdrawalFamily', 'homeEquityReliance']);
    expect(candidateSet.rows.find((row) => row.id === 'homeEquityReliance')).toMatchObject({
      status: 'reviewOnly',
      scoringRole: 'secondaryReview'
    });
    expect(candidateSet.rows.find((row) => row.id === 'annualSequencing')).toMatchObject({ status: 'deferred' });
  });

  it('blocks candidate family planning when score inputs are blocked', () => {
    const packet = selectMonthlyCapacityRuntimePacket({ years: [] }, { ...planFixture, spending: { ...planFixture.spending, gogo: 0 } });
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(fixture, planFixture));
    const gate = selectMonthlyCapacityOptimizerExecutionGate(
      selectMonthlyCapacityOptimizerInputContract(handoff, review),
      selectMonthlyCapacityOptimizerGuardrails(handoff)
    );
    const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
    const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(gate), inputs);
    const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);

    expect(candidateSet.status).toBe('blocked');
    expect(candidateSet.rows.find((row) => row.id === 'currentPlan')).toMatchObject({ status: 'blocked' });
    expect(candidateSet.deferredFamilyIds).toEqual(['annualSequencing']);
  });

  it('caps future candidate families without generating candidates', () => {
    const answer = selectRetirementAnswerSummary(fixture, planFixture);
    const spending = selectSpendingCapacitySummary(fixture, {}, planFixture, answer);
    const packet = selectMonthlyCapacityRuntimePacket(fixture, planFixture, spending);
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(fixture, planFixture, answer));
    const gate = selectMonthlyCapacityOptimizerExecutionGate(
      selectMonthlyCapacityOptimizerInputContract(handoff, review),
      selectMonthlyCapacityOptimizerGuardrails(handoff)
    );
    const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
    const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(gate), inputs);
    const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);
    const limits = selectMonthlyCapacityCandidateSetLimits(candidateSet);

    expect(limits.status).toBe('readyForPlanning');
    expect(limits.totalCandidateCap).toBe(1);
    expect(limits.familyLimits.map((row) => row.familyId)).toEqual([
      'currentPlan',
      'spendingRepair',
      'workTiming',
      'benefitTiming',
      'taxEstateReview',
      'broadWithdrawalFamily',
      'homeEquityReliance',
      'annualSequencing'
    ]);
    expect(limits.familyLimits.find((row) => row.familyId === 'currentPlan')).toMatchObject({ maxCandidates: 1, status: 'active' });
    expect(limits.familyLimits.find((row) => row.familyId === 'annualSequencing')).toMatchObject({ maxCandidates: 0, status: 'deferred' });
    expect(limits.boundary).toContain('without generating candidates');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityCandidateSetLimits');
  });

  it('raises the active candidate cap only for included gap-repair families', () => {
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
    const packet = selectMonthlyCapacityRuntimePacket(shortfallResult, planFixture, spending);
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(shortfallResult, planFixture, answer));
    const gate = selectMonthlyCapacityOptimizerExecutionGate(
      selectMonthlyCapacityOptimizerInputContract(handoff, review),
      selectMonthlyCapacityOptimizerGuardrails(handoff)
    );
    const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
    const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(gate), inputs);
    const limits = selectMonthlyCapacityCandidateSetLimits(selectMonthlyCapacityCandidateSetPlan(inputs, policy));

    expect(limits.totalCandidateCap).toBe(5);
    expect(limits.familyLimits.find((row) => row.familyId === 'spendingRepair')).toMatchObject({ status: 'active', maxCandidates: 2 });
    expect(limits.familyLimits.find((row) => row.familyId === 'workTiming')).toMatchObject({ status: 'active', maxCandidates: 2 });
    expect(limits.familyLimits.find((row) => row.familyId === 'homeEquityReliance')).toMatchObject({ status: 'reviewOnly', maxCandidates: 1 });
  });

  it('runs fresh clean examples through the candidate set readiness matrix', () => {
    const runtimeRowsByExample: Record<string, SimulationResult> = {
      singleMinimumFloor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 43200, spending: 43200, bal_total: 500000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 43200, spending: 43200, bal_total: 450000 }
      ]),
      coupleTightFloor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 96000, spending: 96000, bal_total: 200000 },
        { ...fixture.years[1], shortfall: 12000, totalAftaxYear: 96000, spending: 96000, bal_total: 0 }
      ]),
      pensionCoupleSurvivor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 64800, spending: 64800, bal_total: 600000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 64800, spending: 64800, bal_total: 500000 }
      ]),
      estateHeavyRoom: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 84000, spending: 84000, bal_total: 6000000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 84000, spending: 84000, bal_total: 7000000 }
      ])
    };
    const expectedCaps: Record<string, number> = {
      singleMinimumFloor: 1,
      coupleTightFloor: 5,
      pensionCoupleSurvivor: 1,
      estateHeavyRoom: 1
    };

    for (const card of cleanExamplePlanCards) {
      const plan = createCleanExampleRuntimePlan(card.id);
      const result = runtimeRowsByExample[card.id];
      const answer = selectRetirementAnswerSummary(result, { ...plan, inheritance: 0 });
      const spending = selectSpendingCapacitySummary(result, {}, { ...plan, inheritance: 0 }, answer);
      const packet = selectMonthlyCapacityRuntimePacket(result, { ...plan, inheritance: 0 }, spending);
      const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
      const gateStatus: 'blocked' | 'reviewOnly' = handoff.status === 'blocked' ? 'blocked' : 'reviewOnly';
      const gate = {
        status: gateStatus,
        headline: 'Example candidate set readiness gate',
        requiredBeforeExecution: ['keepOutputRuntimeOnly', 'defineCandidateScoring', 'preserveNoAnnualSequencing'] as Array<
          'keepOutputRuntimeOnly' | 'defineCandidateScoring' | 'preserveNoAnnualSequencing'
        >,
        allowedNow: ['runtimeEvidence', 'tests', 'docs', 'boundedReviewOnly'] as Array<'runtimeEvidence' | 'tests' | 'docs' | 'boundedReviewOnly'>,
        notAllowedYet: ['optimizerSearch', 'savedOptimizerOutput', 'fundingTrace', 'accountInstructions', 'annualAccountSequencing'] as Array<
          'optimizerSearch' | 'savedOptimizerOutput' | 'fundingTrace' | 'accountInstructions' | 'annualAccountSequencing'
        >,
        boundary: 'Test-only candidate set readiness gate for example matrix coverage.'
      };
      const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
      const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(gate), inputs);
      const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);
      const readiness = selectMonthlyCapacityCandidateSetExampleReadiness(card.id, candidateSet);

      expect(readiness.status, card.id).toBe('readyForPlanning');
      expect(readiness.includedFamilyIds, card.id).toContain('currentPlan');
      expect(readiness.deferredFamilyIds, card.id).toContain('annualSequencing');
      expect(readiness.totalCandidateCap, card.id).toBe(expectedCaps[card.id]);
      if (card.id === 'coupleTightFloor') expect(readiness.includedFamilyIds, card.id).toEqual(['currentPlan', 'spendingRepair', 'workTiming']);
      else expect(readiness.reviewOnlyFamilyIds, card.id).toEqual(expect.arrayContaining(['spendingRepair', 'workTiming']));
      expect(readiness.boundary, card.id).toContain('without generating candidates');
      expect(createPlanFile(plan).plan).not.toHaveProperty('monthlyCapacityCandidateSetExampleReadiness');
    }
  });

  it('closes out candidate set planning without generating candidates', () => {
    const answer = selectRetirementAnswerSummary(fixture, planFixture);
    const spending = selectSpendingCapacitySummary(fixture, {}, planFixture, answer);
    const packet = selectMonthlyCapacityRuntimePacket(fixture, planFixture, spending);
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(fixture, planFixture, answer));
    const gate = selectMonthlyCapacityOptimizerExecutionGate(
      selectMonthlyCapacityOptimizerInputContract(handoff, review),
      selectMonthlyCapacityOptimizerGuardrails(handoff)
    );
    const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
    const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(gate), inputs);
    const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);
    const limits = selectMonthlyCapacityCandidateSetLimits(candidateSet);
    const closeout = selectMonthlyCapacityCandidateSetCloseout(candidateSet, limits);

    expect(closeout).toMatchObject({
      status: 'readyForImplementationPlanning',
      nextBroadStep: 'candidateBuilderImplementationPlan',
      completedPieces: ['familyPlan', 'familyLimits', 'exampleMatrix', 'deferredBoundaries', 'persistenceGuardrails']
    });
    expect(closeout.stillDeferred).toEqual([
      'candidateGeneration',
      'candidateScoringExecution',
      'optimizerSearch',
      'savedCandidateOutput',
      'fundingTrace',
      'accountInstructions',
      'annualSequencing',
      'uiPresentation'
    ]);
    expect(closeout.boundary).toContain('no candidate generation');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityCandidateSetCloseout');
  });

  it('closes out candidate set planning as blocked when inputs are blocked', () => {
    const packet = selectMonthlyCapacityRuntimePacket({ years: [] }, { ...planFixture, spending: { ...planFixture.spending, gogo: 0 } });
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(fixture, planFixture));
    const gate = selectMonthlyCapacityOptimizerExecutionGate(
      selectMonthlyCapacityOptimizerInputContract(handoff, review),
      selectMonthlyCapacityOptimizerGuardrails(handoff)
    );
    const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
    const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(gate), inputs);
    const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);
    const closeout = selectMonthlyCapacityCandidateSetCloseout(candidateSet, selectMonthlyCapacityCandidateSetLimits(candidateSet));

    expect(closeout.status).toBe('blocked');
    expect(closeout.nextBroadStep).toBe('capacityInputsFirst');
  });

  it('maps candidate families to runtime-only builder blueprints without mutating plans', () => {
    const answer = selectRetirementAnswerSummary(fixture, planFixture);
    const spending = selectSpendingCapacitySummary(fixture, {}, planFixture, answer);
    const packet = selectMonthlyCapacityRuntimePacket(fixture, planFixture, spending);
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(fixture, planFixture, answer));
    const gate = selectMonthlyCapacityOptimizerExecutionGate(
      selectMonthlyCapacityOptimizerInputContract(handoff, review),
      selectMonthlyCapacityOptimizerGuardrails(handoff)
    );
    const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
    const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(gate), inputs);
    const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);
    const builderPlan = selectMonthlyCapacityCandidateBuilderPlan(candidateSet, selectMonthlyCapacityCandidateSetLimits(candidateSet));

    expect(builderPlan.status).toBe('readyForPlanning');
    expect(builderPlan.objective).toBe('coverMonthlyFloorFirst');
    expect(builderPlan.blueprints.map((row) => row.id)).toEqual([
      'baseline',
      'spendingRepairSmall',
      'spendingRepairLarge',
      'workLaterOneYear',
      'workLaterTwoYears',
      'benefitTimingReview',
      'taxEstateReview',
      'withdrawalFamilyReview',
      'homeEquityRelianceReview',
      'annualSequencingDeferred'
    ]);
    expect(builderPlan.buildableBlueprintIds).toEqual(['baseline']);
    expect(builderPlan.reviewOnlyBlueprintIds).toEqual([
      'spendingRepairSmall',
      'spendingRepairLarge',
      'workLaterOneYear',
      'workLaterTwoYears',
      'benefitTimingReview',
      'taxEstateReview',
      'withdrawalFamilyReview'
    ]);
    expect(builderPlan.deferredBlueprintIds).toEqual(['homeEquityRelianceReview', 'annualSequencingDeferred']);
    expect(builderPlan.blueprints.every((row) => row.doesBuildPlan === false)).toBe(true);
    expect(builderPlan.boundary).toContain('without mutating plans');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityCandidateBuilderPlan');
  });

  it('opens only practical gap-repair builder blueprints when the floor has a gap', () => {
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
    const packet = selectMonthlyCapacityRuntimePacket(shortfallResult, planFixture, spending);
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(shortfallResult, planFixture, answer));
    const gate = selectMonthlyCapacityOptimizerExecutionGate(
      selectMonthlyCapacityOptimizerInputContract(handoff, review),
      selectMonthlyCapacityOptimizerGuardrails(handoff)
    );
    const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
    const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(gate), inputs);
    const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);
    const builderPlan = selectMonthlyCapacityCandidateBuilderPlan(candidateSet, selectMonthlyCapacityCandidateSetLimits(candidateSet));

    expect(builderPlan.buildableBlueprintIds).toEqual([
      'baseline',
      'spendingRepairSmall',
      'spendingRepairLarge',
      'workLaterOneYear',
      'workLaterTwoYears'
    ]);
    expect(builderPlan.reviewOnlyBlueprintIds).toEqual([
      'benefitTimingReview',
      'taxEstateReview',
      'withdrawalFamilyReview',
      'homeEquityRelianceReview'
    ]);
    expect(builderPlan.deferredBlueprintIds).toEqual(['annualSequencingDeferred']);
    expect(builderPlan.blueprints.find((row) => row.id === 'homeEquityRelianceReview')).toMatchObject({
      status: 'reviewOnly',
      doesBuildPlan: false
    });
  });

  it('blocks candidate builder planning when candidate family planning is blocked', () => {
    const packet = selectMonthlyCapacityRuntimePacket({ years: [] }, { ...planFixture, spending: { ...planFixture.spending, gogo: 0 } });
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(fixture, planFixture));
    const gate = selectMonthlyCapacityOptimizerExecutionGate(
      selectMonthlyCapacityOptimizerInputContract(handoff, review),
      selectMonthlyCapacityOptimizerGuardrails(handoff)
    );
    const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
    const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(gate), inputs);
    const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);
    const builderPlan = selectMonthlyCapacityCandidateBuilderPlan(candidateSet, selectMonthlyCapacityCandidateSetLimits(candidateSet));

    expect(builderPlan.status).toBe('blocked');
    expect(builderPlan.buildableBlueprintIds).toEqual([]);
    expect(builderPlan.blueprints.find((row) => row.id === 'baseline')).toMatchObject({ status: 'blocked' });
    expect(builderPlan.deferredBlueprintIds).toEqual(['annualSequencingDeferred']);
  });

  it('keeps candidate builder guardrails focused on runtime-only output', () => {
    const answer = selectRetirementAnswerSummary(fixture, planFixture);
    const spending = selectSpendingCapacitySummary(fixture, {}, planFixture, answer);
    const packet = selectMonthlyCapacityRuntimePacket(fixture, planFixture, spending);
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(fixture, planFixture, answer));
    const gate = selectMonthlyCapacityOptimizerExecutionGate(
      selectMonthlyCapacityOptimizerInputContract(handoff, review),
      selectMonthlyCapacityOptimizerGuardrails(handoff)
    );
    const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
    const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(gate), inputs);
    const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);
    const builderPlan = selectMonthlyCapacityCandidateBuilderPlan(candidateSet, selectMonthlyCapacityCandidateSetLimits(candidateSet));
    const guardrails = selectMonthlyCapacityCandidateBuilderGuardrails(builderPlan);

    expect(guardrails.map((row) => row.id)).toEqual([
      'noPlanMutation',
      'noSavedOutput',
      'noFundingTrace',
      'noAccountInstructions',
      'noAnnualSequencing',
      'noUiPresentation'
    ]);
    expect(guardrails.every((row) => row.status === 'pass')).toBe(true);
    expect(guardrails.find((row) => row.id === 'noPlanMutation')?.detail).toContain('must not copy');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityCandidateBuilderGuardrails');
  });

  it('runs fresh clean examples through the candidate builder readiness matrix', () => {
    const runtimeRowsByExample: Record<string, SimulationResult> = {
      singleMinimumFloor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 43200, spending: 43200, bal_total: 500000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 43200, spending: 43200, bal_total: 450000 }
      ]),
      coupleTightFloor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 96000, spending: 96000, bal_total: 200000 },
        { ...fixture.years[1], shortfall: 12000, totalAftaxYear: 96000, spending: 96000, bal_total: 0 }
      ]),
      pensionCoupleSurvivor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 64800, spending: 64800, bal_total: 600000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 64800, spending: 64800, bal_total: 500000 }
      ]),
      estateHeavyRoom: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 84000, spending: 84000, bal_total: 6000000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 84000, spending: 84000, bal_total: 7000000 }
      ])
    };
    const expectedBuildable: Record<string, string[]> = {
      singleMinimumFloor: ['baseline'],
      coupleTightFloor: ['baseline', 'spendingRepairSmall', 'spendingRepairLarge', 'workLaterOneYear', 'workLaterTwoYears'],
      pensionCoupleSurvivor: ['baseline'],
      estateHeavyRoom: ['baseline']
    };

    for (const card of cleanExamplePlanCards) {
      const plan = createCleanExampleRuntimePlan(card.id);
      const result = runtimeRowsByExample[card.id];
      const answer = selectRetirementAnswerSummary(result, { ...plan, inheritance: 0 });
      const spending = selectSpendingCapacitySummary(result, {}, { ...plan, inheritance: 0 }, answer);
      const packet = selectMonthlyCapacityRuntimePacket(result, { ...plan, inheritance: 0 }, spending);
      const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
      const gateStatus: 'blocked' | 'reviewOnly' = handoff.status === 'blocked' ? 'blocked' : 'reviewOnly';
      const gate = {
        status: gateStatus,
        headline: 'Example candidate builder readiness gate',
        requiredBeforeExecution: ['keepOutputRuntimeOnly', 'defineCandidateScoring', 'preserveNoAnnualSequencing'] as Array<
          'keepOutputRuntimeOnly' | 'defineCandidateScoring' | 'preserveNoAnnualSequencing'
        >,
        allowedNow: ['runtimeEvidence', 'tests', 'docs', 'boundedReviewOnly'] as Array<'runtimeEvidence' | 'tests' | 'docs' | 'boundedReviewOnly'>,
        notAllowedYet: ['optimizerSearch', 'savedOptimizerOutput', 'fundingTrace', 'accountInstructions', 'annualAccountSequencing'] as Array<
          'optimizerSearch' | 'savedOptimizerOutput' | 'fundingTrace' | 'accountInstructions' | 'annualAccountSequencing'
        >,
        boundary: 'Test-only candidate builder readiness gate for example matrix coverage.'
      };
      const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
      const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(gate), inputs);
      const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);
      const builderPlan = selectMonthlyCapacityCandidateBuilderPlan(candidateSet, selectMonthlyCapacityCandidateSetLimits(candidateSet));
      const readiness = selectMonthlyCapacityCandidateBuilderExampleReadiness(card.id, builderPlan);

      expect(readiness.status, card.id).toBe('readyForPlanning');
      expect(readiness.buildableBlueprintIds, card.id).toEqual(expectedBuildable[card.id]);
      expect(readiness.deferredBlueprintIds, card.id).toContain('annualSequencingDeferred');
      expect(readiness.boundary, card.id).toContain('without mutating plans');
      expect(createPlanFile(plan).plan).not.toHaveProperty('monthlyCapacityCandidateBuilderExampleReadiness');
    }
  });

  it('closes out candidate builder planning without starting candidate generation', () => {
    const answer = selectRetirementAnswerSummary(fixture, planFixture);
    const spending = selectSpendingCapacitySummary(fixture, {}, planFixture, answer);
    const packet = selectMonthlyCapacityRuntimePacket(fixture, planFixture, spending);
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(fixture, planFixture, answer));
    const gate = selectMonthlyCapacityOptimizerExecutionGate(
      selectMonthlyCapacityOptimizerInputContract(handoff, review),
      selectMonthlyCapacityOptimizerGuardrails(handoff)
    );
    const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
    const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(gate), inputs);
    const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);
    const builderPlan = selectMonthlyCapacityCandidateBuilderPlan(candidateSet, selectMonthlyCapacityCandidateSetLimits(candidateSet));
    const closeout = selectMonthlyCapacityCandidateBuilderCloseout(builderPlan);

    expect(closeout).toMatchObject({
      status: 'readyForRuntimeImplementation',
      nextBroadStep: 'runtimeCandidateBuilderImplementation',
      completedPieces: ['blueprintMap', 'builderGuardrails', 'exampleMatrix', 'noPlanMutationBoundary']
    });
    expect(closeout.stillDeferred).toEqual([
      'candidatePlanMutation',
      'candidateScoringExecution',
      'optimizerSearch',
      'savedCandidateOutput',
      'fundingTrace',
      'accountInstructions',
      'annualSequencing',
      'uiPresentation'
    ]);
    expect(closeout.boundary).toContain('no candidate plan mutation');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityCandidateBuilderCloseout');
  });

  it('closes out candidate builder planning as blocked when inputs are blocked', () => {
    const packet = selectMonthlyCapacityRuntimePacket({ years: [] }, { ...planFixture, spending: { ...planFixture.spending, gogo: 0 } });
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(fixture, planFixture));
    const gate = selectMonthlyCapacityOptimizerExecutionGate(
      selectMonthlyCapacityOptimizerInputContract(handoff, review),
      selectMonthlyCapacityOptimizerGuardrails(handoff)
    );
    const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
    const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(gate), inputs);
    const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);
    const builderPlan = selectMonthlyCapacityCandidateBuilderPlan(candidateSet, selectMonthlyCapacityCandidateSetLimits(candidateSet));
    const closeout = selectMonthlyCapacityCandidateBuilderCloseout(builderPlan);

    expect(closeout.status).toBe('blocked');
    expect(closeout.nextBroadStep).toBe('capacityInputsFirst');
  });

  it('checks candidate builder input readiness before any runtime variant can be built', () => {
    const answer = selectRetirementAnswerSummary(fixture, planFixture);
    const spending = selectSpendingCapacitySummary(fixture, {}, planFixture, answer);
    const packet = selectMonthlyCapacityRuntimePacket(fixture, planFixture, spending);
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(fixture, planFixture, answer));
    const gate = selectMonthlyCapacityOptimizerExecutionGate(
      selectMonthlyCapacityOptimizerInputContract(handoff, review),
      selectMonthlyCapacityOptimizerGuardrails(handoff)
    );
    const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
    const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(gate), inputs);
    const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);
    const limits = selectMonthlyCapacityCandidateSetLimits(candidateSet);
    const builderPlan = selectMonthlyCapacityCandidateBuilderPlan(candidateSet, limits);
    const contract = selectMonthlyCapacityCandidateBuilderInputContract(packet, builderPlan, limits);

    expect(contract.status).toBe('ready');
    expect(contract.requiredInputIds).toEqual([
      'runtimePlan',
      'baselineResult',
      'monthlyFloor',
      'capacitySummary',
      'candidateSetLimits',
      'blueprintStatuses',
      'outputBoundary'
    ]);
    expect(contract.missingInputIds).toEqual([]);
    expect(contract.readyBlueprintIds).toEqual(['baseline']);
    expect(contract.boundary).toContain('does not mutate plans');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityCandidateBuilderInputContract');
  });

  it('blocks candidate builder input contract when floor and capacity evidence are missing', () => {
    const packet = selectMonthlyCapacityRuntimePacket({ years: [] }, { ...planFixture, spending: { ...planFixture.spending, gogo: 0 } });
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(fixture, planFixture));
    const gate = selectMonthlyCapacityOptimizerExecutionGate(
      selectMonthlyCapacityOptimizerInputContract(handoff, review),
      selectMonthlyCapacityOptimizerGuardrails(handoff)
    );
    const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
    const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(gate), inputs);
    const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);
    const limits = selectMonthlyCapacityCandidateSetLimits(candidateSet);
    const builderPlan = selectMonthlyCapacityCandidateBuilderPlan(candidateSet, limits);
    const contract = selectMonthlyCapacityCandidateBuilderInputContract(packet, builderPlan, limits);

    expect(contract.status).toBe('blocked');
    expect(contract.missingInputIds).toEqual(
      expect.arrayContaining(['runtimePlan', 'monthlyFloor', 'baselineResult', 'capacitySummary', 'candidateSetLimits', 'blueprintStatuses'])
    );
    expect(contract.readyBlueprintIds).toEqual([]);
  });

  it('orders buildable candidate blueprints without creating runtime candidates', () => {
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
    const packet = selectMonthlyCapacityRuntimePacket(shortfallResult, planFixture, spending);
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(shortfallResult, planFixture, answer));
    const gate = selectMonthlyCapacityOptimizerExecutionGate(
      selectMonthlyCapacityOptimizerInputContract(handoff, review),
      selectMonthlyCapacityOptimizerGuardrails(handoff)
    );
    const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
    const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(gate), inputs);
    const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);
    const limits = selectMonthlyCapacityCandidateSetLimits(candidateSet);
    const builderPlan = selectMonthlyCapacityCandidateBuilderPlan(candidateSet, limits);
    const contract = selectMonthlyCapacityCandidateBuilderInputContract(packet, builderPlan, limits);
    const order = selectMonthlyCapacityCandidateBuilderOrder(builderPlan, contract);

    expect(order.status).toBe('ready');
    expect(order.orderedBlueprintIds).toEqual([
      'baseline',
      'spendingRepairSmall',
      'spendingRepairLarge',
      'workLaterOneYear',
      'workLaterTwoYears'
    ]);
    expect(order.reviewOnlyBlueprintIds).toEqual([
      'benefitTimingReview',
      'taxEstateReview',
      'withdrawalFamilyReview',
      'homeEquityRelianceReview'
    ]);
    expect(order.deferredBlueprintIds).toEqual(['annualSequencingDeferred']);
    expect(order.boundary).toContain('without creating plan variants');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityCandidateBuilderOrder');
  });

  it('blocks builder order when builder inputs are incomplete', () => {
    const packet = selectMonthlyCapacityRuntimePacket({ years: [] }, { ...planFixture, spending: { ...planFixture.spending, gogo: 0 } });
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(fixture, planFixture));
    const gate = selectMonthlyCapacityOptimizerExecutionGate(
      selectMonthlyCapacityOptimizerInputContract(handoff, review),
      selectMonthlyCapacityOptimizerGuardrails(handoff)
    );
    const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
    const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(gate), inputs);
    const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);
    const limits = selectMonthlyCapacityCandidateSetLimits(candidateSet);
    const builderPlan = selectMonthlyCapacityCandidateBuilderPlan(candidateSet, limits);
    const contract = selectMonthlyCapacityCandidateBuilderInputContract(packet, builderPlan, limits);
    const order = selectMonthlyCapacityCandidateBuilderOrder(builderPlan, contract);

    expect(order.status).toBe('blocked');
    expect(order.orderedBlueprintIds).toEqual([]);
    expect(order.blockedBlueprintIds).toContain('baseline');
  });

  it('previews candidate builder dry-run rows without generating candidate output', () => {
    const answer = selectRetirementAnswerSummary(fixture, planFixture);
    const spending = selectSpendingCapacitySummary(fixture, {}, planFixture, answer);
    const packet = selectMonthlyCapacityRuntimePacket(fixture, planFixture, spending);
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(fixture, planFixture, answer));
    const gate = selectMonthlyCapacityOptimizerExecutionGate(
      selectMonthlyCapacityOptimizerInputContract(handoff, review),
      selectMonthlyCapacityOptimizerGuardrails(handoff)
    );
    const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
    const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(gate), inputs);
    const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);
    const limits = selectMonthlyCapacityCandidateSetLimits(candidateSet);
    const builderPlan = selectMonthlyCapacityCandidateBuilderPlan(candidateSet, limits);
    const contract = selectMonthlyCapacityCandidateBuilderInputContract(packet, builderPlan, limits);
    const order = selectMonthlyCapacityCandidateBuilderOrder(builderPlan, contract);
    const dryRun = selectMonthlyCapacityCandidateBuilderDryRun(builderPlan, order);

    expect(dryRun.status).toBe('ready');
    expect(dryRun.wouldBuildBlueprintIds).toEqual(['baseline']);
    expect(dryRun.rows.find((row) => row.blueprintId === 'baseline')).toMatchObject({
      status: 'wouldBuild',
      mutation: 'none',
      output: 'notGenerated'
    });
    expect(dryRun.rows.find((row) => row.blueprintId === 'spendingRepairSmall')).toMatchObject({ status: 'reviewOnly' });
    expect(dryRun.rows.find((row) => row.blueprintId === 'annualSequencingDeferred')).toMatchObject({ status: 'deferred' });
    expect(dryRun.boundary).toContain('without mutating plans');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityCandidateBuilderDryRun');
  });

  it('previews gap repair dry-run rows while keeping every row non-mutating', () => {
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
    const packet = selectMonthlyCapacityRuntimePacket(shortfallResult, planFixture, spending);
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(shortfallResult, planFixture, answer));
    const gate = selectMonthlyCapacityOptimizerExecutionGate(
      selectMonthlyCapacityOptimizerInputContract(handoff, review),
      selectMonthlyCapacityOptimizerGuardrails(handoff)
    );
    const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
    const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(gate), inputs);
    const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);
    const limits = selectMonthlyCapacityCandidateSetLimits(candidateSet);
    const builderPlan = selectMonthlyCapacityCandidateBuilderPlan(candidateSet, limits);
    const contract = selectMonthlyCapacityCandidateBuilderInputContract(packet, builderPlan, limits);
    const order = selectMonthlyCapacityCandidateBuilderOrder(builderPlan, contract);
    const dryRun = selectMonthlyCapacityCandidateBuilderDryRun(builderPlan, order);

    expect(dryRun.wouldBuildBlueprintIds).toEqual([
      'baseline',
      'spendingRepairSmall',
      'spendingRepairLarge',
      'workLaterOneYear',
      'workLaterTwoYears'
    ]);
    expect(dryRun.rows.every((row) => row.mutation === 'none')).toBe(true);
    expect(dryRun.rows.every((row) => row.output === 'notGenerated')).toBe(true);
    expect(dryRun.rows.find((row) => row.blueprintId === 'homeEquityRelianceReview')).toMatchObject({ status: 'reviewOnly' });
  });

  it('audits the candidate builder dry run for no plan mutation or generated output', () => {
    const answer = selectRetirementAnswerSummary(fixture, planFixture);
    const spending = selectSpendingCapacitySummary(fixture, {}, planFixture, answer);
    const packet = selectMonthlyCapacityRuntimePacket(fixture, planFixture, spending);
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(fixture, planFixture, answer));
    const gate = selectMonthlyCapacityOptimizerExecutionGate(
      selectMonthlyCapacityOptimizerInputContract(handoff, review),
      selectMonthlyCapacityOptimizerGuardrails(handoff)
    );
    const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
    const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(gate), inputs);
    const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);
    const limits = selectMonthlyCapacityCandidateSetLimits(candidateSet);
    const builderPlan = selectMonthlyCapacityCandidateBuilderPlan(candidateSet, limits);
    const contract = selectMonthlyCapacityCandidateBuilderInputContract(packet, builderPlan, limits);
    const order = selectMonthlyCapacityCandidateBuilderOrder(builderPlan, contract);
    const dryRun = selectMonthlyCapacityCandidateBuilderDryRun(builderPlan, order);
    const audit = selectMonthlyCapacityCandidateBuilderDryRunAudit(dryRun);

    expect(audit).toMatchObject({
      status: 'pass',
      checkedRows: 10,
      mutationCount: 0,
      generatedOutputCount: 0
    });
    expect(audit.boundary).toContain('did not mutate plans');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityCandidateBuilderDryRunAudit');
  });

  it('opens the runtime candidate builder gate only after inputs and dry-run audit pass', () => {
    const answer = selectRetirementAnswerSummary(fixture, planFixture);
    const spending = selectSpendingCapacitySummary(fixture, {}, planFixture, answer);
    const packet = selectMonthlyCapacityRuntimePacket(fixture, planFixture, spending);
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(fixture, planFixture, answer));
    const gate = selectMonthlyCapacityOptimizerExecutionGate(
      selectMonthlyCapacityOptimizerInputContract(handoff, review),
      selectMonthlyCapacityOptimizerGuardrails(handoff)
    );
    const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
    const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(gate), inputs);
    const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);
    const limits = selectMonthlyCapacityCandidateSetLimits(candidateSet);
    const builderPlan = selectMonthlyCapacityCandidateBuilderPlan(candidateSet, limits);
    const contract = selectMonthlyCapacityCandidateBuilderInputContract(packet, builderPlan, limits);
    const order = selectMonthlyCapacityCandidateBuilderOrder(builderPlan, contract);
    const dryRun = selectMonthlyCapacityCandidateBuilderDryRun(builderPlan, order);
    const runtimeGate = selectMonthlyCapacityCandidateBuilderRuntimeGate(
      contract,
      order,
      selectMonthlyCapacityCandidateBuilderDryRunAudit(dryRun)
    );

    expect(runtimeGate.status).toBe('readyForRuntimeImplementation');
    expect(runtimeGate.requiredBeforeRuntime).toEqual(['keepRuntimeOnly', 'preserveSavedSchema', 'preserveNoAnnualSequencing']);
    expect(runtimeGate.allowedNext).toEqual(['runtimePlanVariantBuilder', 'tests', 'docs']);
    expect(runtimeGate.notAllowedYet).toEqual([
      'candidateScoringExecution',
      'optimizerSearch',
      'savedCandidateOutput',
      'fundingTrace',
      'accountInstructions',
      'annualSequencing',
      'uiPresentation'
    ]);
    expect(runtimeGate.boundary).toContain('future package');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityCandidateBuilderRuntimeGate');
  });

  it('blocks the runtime candidate builder gate when builder inputs are incomplete', () => {
    const packet = selectMonthlyCapacityRuntimePacket({ years: [] }, { ...planFixture, spending: { ...planFixture.spending, gogo: 0 } });
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(fixture, planFixture));
    const gate = selectMonthlyCapacityOptimizerExecutionGate(
      selectMonthlyCapacityOptimizerInputContract(handoff, review),
      selectMonthlyCapacityOptimizerGuardrails(handoff)
    );
    const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
    const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(gate), inputs);
    const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);
    const limits = selectMonthlyCapacityCandidateSetLimits(candidateSet);
    const builderPlan = selectMonthlyCapacityCandidateBuilderPlan(candidateSet, limits);
    const contract = selectMonthlyCapacityCandidateBuilderInputContract(packet, builderPlan, limits);
    const order = selectMonthlyCapacityCandidateBuilderOrder(builderPlan, contract);
    const dryRun = selectMonthlyCapacityCandidateBuilderDryRun(builderPlan, order);
    const runtimeGate = selectMonthlyCapacityCandidateBuilderRuntimeGate(
      contract,
      order,
      selectMonthlyCapacityCandidateBuilderDryRunAudit(dryRun)
    );

    expect(runtimeGate.status).toBe('blocked');
    expect(runtimeGate.requiredBeforeRuntime).toEqual(
      expect.arrayContaining(['completeBuilderInputs', 'keepRuntimeOnly', 'preserveSavedSchema', 'preserveNoAnnualSequencing'])
    );
    expect(runtimeGate.allowedNext).toEqual(['tests', 'docs']);
  });

  it('closes out candidate builder implementation planning for the next runtime-only package', () => {
    const answer = selectRetirementAnswerSummary(fixture, planFixture);
    const spending = selectSpendingCapacitySummary(fixture, {}, planFixture, answer);
    const packet = selectMonthlyCapacityRuntimePacket(fixture, planFixture, spending);
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(fixture, planFixture, answer));
    const gate = selectMonthlyCapacityOptimizerExecutionGate(
      selectMonthlyCapacityOptimizerInputContract(handoff, review),
      selectMonthlyCapacityOptimizerGuardrails(handoff)
    );
    const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
    const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(gate), inputs);
    const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);
    const limits = selectMonthlyCapacityCandidateSetLimits(candidateSet);
    const builderPlan = selectMonthlyCapacityCandidateBuilderPlan(candidateSet, limits);
    const contract = selectMonthlyCapacityCandidateBuilderInputContract(packet, builderPlan, limits);
    const order = selectMonthlyCapacityCandidateBuilderOrder(builderPlan, contract);
    const dryRun = selectMonthlyCapacityCandidateBuilderDryRun(builderPlan, order);
    const runtimeGate = selectMonthlyCapacityCandidateBuilderRuntimeGate(
      contract,
      order,
      selectMonthlyCapacityCandidateBuilderDryRunAudit(dryRun)
    );
    const closeout = selectMonthlyCapacityCandidateBuilderPackageCloseout(runtimeGate);

    expect(closeout).toMatchObject({
      status: 'readyForNextPackage',
      nextBroadStep: 'runtimeCandidateBuilderImplementation',
      preservedBoundaries: [
        'candidateScoringExecution',
        'optimizerSearch',
        'savedCandidateOutput',
        'fundingTrace',
        'accountInstructions',
        'annualSequencing',
        'uiPresentation'
      ]
    });
    expect(closeout.packageSummary).toContain('dry-run audit');
    expect(closeout.boundary).toContain('no candidate scoring execution');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityCandidateBuilderPackageCloseout');
  });

  it('builds only the baseline runtime candidate variant when the floor is covered', () => {
    const answer = selectRetirementAnswerSummary(fixture, planFixture);
    const spending = selectSpendingCapacitySummary(fixture, {}, planFixture, answer);
    const packet = selectMonthlyCapacityRuntimePacket(fixture, planFixture, spending);
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(fixture, planFixture, answer));
    const executionGate = selectMonthlyCapacityOptimizerExecutionGate(
      selectMonthlyCapacityOptimizerInputContract(handoff, review),
      selectMonthlyCapacityOptimizerGuardrails(handoff)
    );
    const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
    const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(executionGate), inputs);
    const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);
    const limits = selectMonthlyCapacityCandidateSetLimits(candidateSet);
    const builderPlan = selectMonthlyCapacityCandidateBuilderPlan(candidateSet, limits);
    const contract = selectMonthlyCapacityCandidateBuilderInputContract(packet, builderPlan, limits);
    const order = selectMonthlyCapacityCandidateBuilderOrder(builderPlan, contract);
    const dryRun = selectMonthlyCapacityCandidateBuilderDryRun(builderPlan, order);
    const runtimeGate = selectMonthlyCapacityCandidateBuilderRuntimeGate(
      contract,
      order,
      selectMonthlyCapacityCandidateBuilderDryRunAudit(dryRun)
    );
    const variants = selectMonthlyCapacityRuntimeCandidateVariants(planFixture, builderPlan, order, runtimeGate);

    expect(variants.status).toBe('ready');
    expect(variants.builtVariantIds).toEqual(['baseline']);
    expect(variants.variants[0]).toMatchObject({
      id: 'baseline',
      runtimeOnly: true,
      output: 'notRun',
      saved: false,
      changedLevers: ['baseline']
    });
    expect(variants.variants[0].plan).not.toBe(planFixture);
    expect(variants.variants[0].plan.spending.gogo).toBe(planFixture.spending.gogo);
    expect(variants.skippedBlueprints.find((row) => row.id === 'spendingRepairSmall')).toMatchObject({ status: 'reviewOnly' });
    expect(variants.boundary).toContain('does not run simulations');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityRuntimeCandidateVariants');
  });

  it('builds gap-repair spending and work-timing runtime variants in memory only', () => {
    const shortfallResult = withRows([
      { ...fixture.years[0], shortfall: 0, totalAftaxYear: 70000, bal_total: 200000 },
      { ...fixture.years[1], shortfall: 10000, totalAftaxYear: 71470, bal_total: 0 }
    ]);
    const repairedResult = withRows([
      { ...fixture.years[0], shortfall: 0, totalAftaxYear: 63000, bal_total: 220000 },
      { ...fixture.years[1], shortfall: 0, totalAftaxYear: 64000, bal_total: 100000 }
    ]);
    const couplePlan: V2PlanPayload = {
      ...planFixture,
      p2: { ...planFixture.p2, name: 'Morgan', dob: 1964, retireYear: 2029 }
    };
    const answer = selectRetirementAnswerSummary(shortfallResult, couplePlan);
    const spending = selectSpendingCapacitySummary(shortfallResult, { spendLessGogo: repairedResult }, couplePlan, answer);
    const packet = selectMonthlyCapacityRuntimePacket(shortfallResult, couplePlan, spending);
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(shortfallResult, couplePlan, answer));
    const executionGate = selectMonthlyCapacityOptimizerExecutionGate(
      selectMonthlyCapacityOptimizerInputContract(handoff, review),
      selectMonthlyCapacityOptimizerGuardrails(handoff)
    );
    const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
    const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(executionGate), inputs);
    const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);
    const limits = selectMonthlyCapacityCandidateSetLimits(candidateSet);
    const builderPlan = selectMonthlyCapacityCandidateBuilderPlan(candidateSet, limits);
    const contract = selectMonthlyCapacityCandidateBuilderInputContract(packet, builderPlan, limits);
    const order = selectMonthlyCapacityCandidateBuilderOrder(builderPlan, contract);
    const dryRun = selectMonthlyCapacityCandidateBuilderDryRun(builderPlan, order);
    const runtimeGate = selectMonthlyCapacityCandidateBuilderRuntimeGate(
      contract,
      order,
      selectMonthlyCapacityCandidateBuilderDryRunAudit(dryRun)
    );
    const variants = selectMonthlyCapacityRuntimeCandidateVariants(couplePlan, builderPlan, order, runtimeGate);

    expect(variants.builtVariantIds).toEqual([
      'baseline',
      'spendingRepairSmall',
      'spendingRepairLarge',
      'workLaterOneYear',
      'workLaterTwoYears'
    ]);
    expect(variants.variants.find((row) => row.id === 'spendingRepairSmall')?.plan.spending).toMatchObject({
      gogo: 66500,
      slowgo: 42750,
      nogo: 38000
    });
    expect(variants.variants.find((row) => row.id === 'spendingRepairLarge')?.plan.spending).toMatchObject({
      gogo: 63000,
      slowgo: 40500,
      nogo: 36000
    });
    expect(variants.variants.find((row) => row.id === 'workLaterOneYear')?.plan.p1.retireYear).toBe(2029);
    expect(variants.variants.find((row) => row.id === 'workLaterOneYear')?.plan.p2.retireYear).toBe(2030);
    expect(variants.variants.find((row) => row.id === 'workLaterTwoYears')?.plan.assumptions.retireYear).toBe(2030);
    expect(variants.variants.every((row) => row.runtimeOnly && row.output === 'notRun' && row.saved === false)).toBe(true);
    expect(variants.skippedBlueprints.find((row) => row.id === 'homeEquityRelianceReview')).toMatchObject({ status: 'reviewOnly' });
    expect(createPlanFile(couplePlan).plan).not.toHaveProperty('monthlyCapacityRuntimeCandidateVariants');
  });

  it('blocks runtime candidate variants when the implementation gate is blocked', () => {
    const packet = selectMonthlyCapacityRuntimePacket({ years: [] }, { ...planFixture, spending: { ...planFixture.spending, gogo: 0 } });
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(fixture, planFixture));
    const executionGate = selectMonthlyCapacityOptimizerExecutionGate(
      selectMonthlyCapacityOptimizerInputContract(handoff, review),
      selectMonthlyCapacityOptimizerGuardrails(handoff)
    );
    const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
    const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(executionGate), inputs);
    const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);
    const limits = selectMonthlyCapacityCandidateSetLimits(candidateSet);
    const builderPlan = selectMonthlyCapacityCandidateBuilderPlan(candidateSet, limits);
    const contract = selectMonthlyCapacityCandidateBuilderInputContract(packet, builderPlan, limits);
    const order = selectMonthlyCapacityCandidateBuilderOrder(builderPlan, contract);
    const dryRun = selectMonthlyCapacityCandidateBuilderDryRun(builderPlan, order);
    const runtimeGate = selectMonthlyCapacityCandidateBuilderRuntimeGate(
      contract,
      order,
      selectMonthlyCapacityCandidateBuilderDryRunAudit(dryRun)
    );
    const variants = selectMonthlyCapacityRuntimeCandidateVariants(planFixture, builderPlan, order, runtimeGate);

    expect(runtimeGate.status).toBe('blocked');
    expect(variants.status).toBe('blocked');
    expect(variants.variants).toEqual([]);
    expect(variants.skippedBlueprints.find((row) => row.id === 'baseline')).toMatchObject({ status: 'blocked' });
  });

  it('audits runtime candidate variants to confirm they are not scored, saved, or traced', () => {
    const answer = selectRetirementAnswerSummary(fixture, planFixture);
    const spending = selectSpendingCapacitySummary(fixture, {}, planFixture, answer);
    const packet = selectMonthlyCapacityRuntimePacket(fixture, planFixture, spending);
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(fixture, planFixture, answer));
    const executionGate = selectMonthlyCapacityOptimizerExecutionGate(
      selectMonthlyCapacityOptimizerInputContract(handoff, review),
      selectMonthlyCapacityOptimizerGuardrails(handoff)
    );
    const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
    const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(executionGate), inputs);
    const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);
    const limits = selectMonthlyCapacityCandidateSetLimits(candidateSet);
    const builderPlan = selectMonthlyCapacityCandidateBuilderPlan(candidateSet, limits);
    const contract = selectMonthlyCapacityCandidateBuilderInputContract(packet, builderPlan, limits);
    const order = selectMonthlyCapacityCandidateBuilderOrder(builderPlan, contract);
    const dryRun = selectMonthlyCapacityCandidateBuilderDryRun(builderPlan, order);
    const runtimeGate = selectMonthlyCapacityCandidateBuilderRuntimeGate(
      contract,
      order,
      selectMonthlyCapacityCandidateBuilderDryRunAudit(dryRun)
    );
    const variants = selectMonthlyCapacityRuntimeCandidateVariants(planFixture, builderPlan, order, runtimeGate);
    const audit = selectMonthlyCapacityRuntimeCandidateAudit(variants);

    expect(audit).toMatchObject({
      status: 'pass',
      builtCount: 1,
      scoredCount: 0,
      savedCount: 0,
      traceCount: 0
    });
    expect(audit.boundary).toContain('not been scored');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityRuntimeCandidateAudit');
  });

  it('summarizes runtime candidate variants without ranking them', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const summary = selectMonthlyCapacityRuntimeCandidateSummary(runtime.variants);

    expect(summary).toMatchObject({
      status: 'ready',
      builtVariantIds: ['baseline'],
      practicalRepairVariantIds: [],
      baselineIncluded: true
    });
    expect(summary.reviewOnlyBlueprintIds).toEqual([
      'spendingRepairSmall',
      'spendingRepairLarge',
      'workLaterOneYear',
      'workLaterTwoYears',
      'benefitTimingReview',
      'taxEstateReview',
      'withdrawalFamilyReview'
    ]);
    expect(summary.deferredBlueprintIds).toEqual(['homeEquityRelianceReview', 'annualSequencingDeferred']);
    expect(summary.boundary).toContain('without running simulations');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityRuntimeCandidateSummary');
  });

  it('summarizes practical repair variants only for visible floor gaps', () => {
    const shortfallResult = withRows([
      { ...fixture.years[0], shortfall: 0, totalAftaxYear: 70000, bal_total: 200000 },
      { ...fixture.years[1], shortfall: 10000, totalAftaxYear: 71470, bal_total: 0 }
    ]);
    const repairedResult = withRows([
      { ...fixture.years[0], shortfall: 0, totalAftaxYear: 63000, bal_total: 220000 },
      { ...fixture.years[1], shortfall: 0, totalAftaxYear: 64000, bal_total: 100000 }
    ]);
    const runtime = buildMonthlyCandidateRuntime(shortfallResult, planFixture, { spendLessGogo: repairedResult });
    const summary = selectMonthlyCapacityRuntimeCandidateSummary(runtime.variants);

    expect(summary.builtVariantIds).toEqual([
      'baseline',
      'spendingRepairSmall',
      'spendingRepairLarge',
      'workLaterOneYear',
      'workLaterTwoYears'
    ]);
    expect(summary.practicalRepairVariantIds).toEqual([
      'spendingRepairSmall',
      'spendingRepairLarge',
      'workLaterOneYear',
      'workLaterTwoYears'
    ]);
    expect(summary.reviewOnlyBlueprintIds).toEqual([
      'benefitTimingReview',
      'taxEstateReview',
      'withdrawalFamilyReview',
      'homeEquityRelianceReview'
    ]);
    expect(summary.deferredBlueprintIds).toEqual(['annualSequencingDeferred']);
  });

  it('runs fresh clean examples through runtime candidate variant readiness', () => {
    const runtimeRowsByExample: Record<string, SimulationResult> = {
      singleMinimumFloor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 43200, spending: 43200, bal_total: 500000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 43200, spending: 43200, bal_total: 450000 }
      ]),
      coupleTightFloor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 96000, spending: 96000, bal_total: 200000 },
        { ...fixture.years[1], shortfall: 12000, totalAftaxYear: 96000, spending: 96000, bal_total: 0 }
      ]),
      pensionCoupleSurvivor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 64800, spending: 64800, bal_total: 600000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 64800, spending: 64800, bal_total: 500000 }
      ]),
      estateHeavyRoom: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 84000, spending: 84000, bal_total: 6000000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 84000, spending: 84000, bal_total: 7000000 }
      ])
    };
    const expectedBuilt: Record<string, string[]> = {
      singleMinimumFloor: ['baseline'],
      coupleTightFloor: ['baseline', 'spendingRepairSmall', 'spendingRepairLarge', 'workLaterOneYear', 'workLaterTwoYears'],
      pensionCoupleSurvivor: ['baseline'],
      estateHeavyRoom: ['baseline']
    };

    for (const card of cleanExamplePlanCards) {
      const plan = { ...createCleanExampleRuntimePlan(card.id), inheritance: 0 };
      const result = runtimeRowsByExample[card.id];
      const answer = selectRetirementAnswerSummary(result, plan);
      const spending = selectSpendingCapacitySummary(result, {}, plan, answer);
      const packet = selectMonthlyCapacityRuntimePacket(result, plan, spending);
      const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
      const gateStatus: 'blocked' | 'reviewOnly' = handoff.status === 'blocked' ? 'blocked' : 'reviewOnly';
      const gate = {
        status: gateStatus,
        headline: 'Example runtime candidate readiness gate',
        requiredBeforeExecution: ['keepOutputRuntimeOnly', 'defineCandidateScoring', 'preserveNoAnnualSequencing'] as Array<
          'keepOutputRuntimeOnly' | 'defineCandidateScoring' | 'preserveNoAnnualSequencing'
        >,
        allowedNow: ['runtimeEvidence', 'tests', 'docs', 'boundedReviewOnly'] as Array<'runtimeEvidence' | 'tests' | 'docs' | 'boundedReviewOnly'>,
        notAllowedYet: ['optimizerSearch', 'savedOptimizerOutput', 'fundingTrace', 'accountInstructions', 'annualAccountSequencing'] as Array<
          'optimizerSearch' | 'savedOptimizerOutput' | 'fundingTrace' | 'accountInstructions' | 'annualAccountSequencing'
        >,
        boundary: 'Test-only runtime candidate readiness gate for example matrix coverage.'
      };
      const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
      const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(gate), inputs);
      const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);
      const limits = selectMonthlyCapacityCandidateSetLimits(candidateSet);
      const builderPlan = selectMonthlyCapacityCandidateBuilderPlan(candidateSet, limits);
      const contract = selectMonthlyCapacityCandidateBuilderInputContract(packet, builderPlan, limits);
      const order = selectMonthlyCapacityCandidateBuilderOrder(builderPlan, contract);
      const dryRun = selectMonthlyCapacityCandidateBuilderDryRun(builderPlan, order);
      const runtimeGate = selectMonthlyCapacityCandidateBuilderRuntimeGate(
        contract,
        order,
        selectMonthlyCapacityCandidateBuilderDryRunAudit(dryRun)
      );
      const variants = selectMonthlyCapacityRuntimeCandidateVariants(plan, builderPlan, order, runtimeGate);
      const readiness = selectMonthlyCapacityRuntimeCandidateExampleReadiness(card.id, variants);

      expect(readiness.status, card.id).toBe('ready');
      expect(readiness.builtVariantIds, card.id).toEqual(expectedBuilt[card.id]);
      if (card.id === 'coupleTightFloor') expect(readiness.practicalRepairVariantIds, card.id).toHaveLength(4);
      else expect(readiness.practicalRepairVariantIds, card.id).toEqual([]);
      expect(readiness.skippedCount, card.id).toBe(10 - expectedBuilt[card.id].length);
      expect(readiness.boundary, card.id).toContain('without running simulations');
      expect(createPlanFile(plan).plan).not.toHaveProperty('monthlyCapacityRuntimeCandidateExampleReadiness');
    }
  });

  it('hands runtime candidate variants to a future simulation package without scoring them', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);

    expect(handoff).toMatchObject({
      status: 'readyForSimulation',
      variantIds: ['baseline'],
      allowedNext: ['runRuntimeSimulations', 'tests', 'docs']
    });
    expect(handoff.notAllowedYet).toEqual([
      'candidateScoringExecution',
      'optimizerSearch',
      'savedCandidateOutput',
      'fundingTrace',
      'accountInstructions',
      'annualSequencing',
      'uiPresentation'
    ]);
    expect(handoff.boundary).toContain('later package');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityRuntimeCandidateSimulationHandoff');
  });

  it('blocks the simulation handoff when runtime candidate variants are blocked', () => {
    const packet = selectMonthlyCapacityRuntimePacket({ years: [] }, { ...planFixture, spending: { ...planFixture.spending, gogo: 0 } });
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(fixture, planFixture));
    const executionGate = selectMonthlyCapacityOptimizerExecutionGate(
      selectMonthlyCapacityOptimizerInputContract(handoff, review),
      selectMonthlyCapacityOptimizerGuardrails(handoff)
    );
    const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
    const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(executionGate), inputs);
    const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);
    const limits = selectMonthlyCapacityCandidateSetLimits(candidateSet);
    const builderPlan = selectMonthlyCapacityCandidateBuilderPlan(candidateSet, limits);
    const contract = selectMonthlyCapacityCandidateBuilderInputContract(packet, builderPlan, limits);
    const order = selectMonthlyCapacityCandidateBuilderOrder(builderPlan, contract);
    const dryRun = selectMonthlyCapacityCandidateBuilderDryRun(builderPlan, order);
    const runtimeGate = selectMonthlyCapacityCandidateBuilderRuntimeGate(
      contract,
      order,
      selectMonthlyCapacityCandidateBuilderDryRunAudit(dryRun)
    );
    const variants = selectMonthlyCapacityRuntimeCandidateVariants(planFixture, builderPlan, order, runtimeGate);
    const simulationHandoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(variants);

    expect(simulationHandoff.status).toBe('blocked');
    expect(simulationHandoff.variantIds).toEqual([]);
    expect(simulationHandoff.allowedNext).toEqual(['tests', 'docs']);
  });

  it('closes out runtime candidate building for the next simulation package', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const closeout = selectMonthlyCapacityRuntimeCandidateCloseout(handoff);

    expect(closeout).toMatchObject({
      status: 'readyForNextPackage',
      nextBroadStep: 'runtimeCandidateSimulation',
      completedPieces: ['runtimeVariants', 'variantSummary', 'variantAudit', 'exampleMatrix', 'simulationHandoff']
    });
    expect(closeout.stillDeferred).toEqual([
      'candidateScoringExecution',
      'optimizerSearch',
      'savedCandidateOutput',
      'fundingTrace',
      'accountInstructions',
      'annualSequencing',
      'uiPresentation'
    ]);
    expect(closeout.boundary).toContain('no simulations');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityRuntimeCandidateCloseout');
  });

  it('runs runtime candidate simulations without scoring or saving output', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const calls: Array<{ title: string; spend: number }> = [];
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, (plan) => {
      calls.push({ title: plan.title || '', spend: plan.spending.gogo || 0 });
      return withRows([
        { year: 2028, shortfall: 0, totalTaxYear: 1000, bal_total: 300000 },
        { year: 2029, shortfall: 0, totalTaxYear: 2000, bal_total: 250000 }
      ]);
    });

    expect(calls).toEqual([{ title: 'Selector plan', spend: 70000 }]);
    expect(simulationSet.status).toBe('ready');
    expect(simulationSet.simulatedVariantIds).toEqual(['baseline']);
    expect(simulationSet.rows[0]).toMatchObject({
      id: 'baseline',
      status: 'simulated',
      resultYears: 2,
      firstShortfallYear: null,
      endPortfolio: 250000,
      totalTax: 3000,
      score: null,
      runtimeOnly: true,
      saved: false,
      fundingTrace: null
    });
    expect(simulationSet.boundary).toContain('without scoring candidates');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityRuntimeCandidateSimulations');
  });

  it('runs all practical gap-repair runtime simulations when variants are built', () => {
    const shortfallResult = withRows([
      { ...fixture.years[0], shortfall: 0, totalAftaxYear: 70000, bal_total: 200000 },
      { ...fixture.years[1], shortfall: 10000, totalAftaxYear: 71470, bal_total: 0 }
    ]);
    const repairedResult = withRows([
      { ...fixture.years[0], shortfall: 0, totalAftaxYear: 63000, bal_total: 220000 },
      { ...fixture.years[1], shortfall: 0, totalAftaxYear: 64000, bal_total: 100000 }
    ]);
    const runtime = buildMonthlyCandidateRuntime(shortfallResult, planFixture, { spendLessGogo: repairedResult });
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, (plan) =>
      withRows([
        { year: 2028, shortfall: (plan.spending.gogo || 0) < 70000 ? 0 : 5000, totalTaxYear: 1000, bal_total: plan.spending.gogo || 0 },
        { year: 2029, shortfall: 0, totalTaxYear: 2000, bal_total: plan.assumptions.retireYear || 0 }
      ])
    );

    expect(simulationSet.simulatedVariantIds).toEqual([
      'baseline',
      'spendingRepairSmall',
      'spendingRepairLarge',
      'workLaterOneYear',
      'workLaterTwoYears'
    ]);
    expect(simulationSet.rows.find((row) => row.id === 'baseline')).toMatchObject({ firstShortfallYear: 2028 });
    expect(simulationSet.rows.find((row) => row.id === 'spendingRepairSmall')).toMatchObject({ firstShortfallYear: null });
    expect(simulationSet.rows.every((row) => row.score === null && row.saved === false && row.fundingTrace === null)).toBe(true);
  });

  it('blocks runtime candidate simulations when the simulation handoff is blocked', () => {
    const packet = selectMonthlyCapacityRuntimePacket({ years: [] }, { ...planFixture, spending: { ...planFixture.spending, gogo: 0 } });
    const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
    const review = selectOptimizerInputReview(selectOptimizerDecisionBoundaries(fixture, planFixture));
    const executionGate = selectMonthlyCapacityOptimizerExecutionGate(
      selectMonthlyCapacityOptimizerInputContract(handoff, review),
      selectMonthlyCapacityOptimizerGuardrails(handoff)
    );
    const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
    const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(executionGate), inputs);
    const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);
    const limits = selectMonthlyCapacityCandidateSetLimits(candidateSet);
    const builderPlan = selectMonthlyCapacityCandidateBuilderPlan(candidateSet, limits);
    const contract = selectMonthlyCapacityCandidateBuilderInputContract(packet, builderPlan, limits);
    const order = selectMonthlyCapacityCandidateBuilderOrder(builderPlan, contract);
    const dryRun = selectMonthlyCapacityCandidateBuilderDryRun(builderPlan, order);
    const runtimeGate = selectMonthlyCapacityCandidateBuilderRuntimeGate(
      contract,
      order,
      selectMonthlyCapacityCandidateBuilderDryRunAudit(dryRun)
    );
    const variants = selectMonthlyCapacityRuntimeCandidateVariants(planFixture, builderPlan, order, runtimeGate);
    const simulationHandoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(variants, simulationHandoff);

    expect(simulationSet.status).toBe('blocked');
    expect(simulationSet.rows).toEqual([]);
    expect(simulationSet.simulatedVariantIds).toEqual([]);
  });

  it('audits runtime candidate simulations for no score, save, or trace output', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, () => fixture);
    const audit = selectMonthlyCapacityRuntimeCandidateSimulationAudit(simulationSet);

    expect(audit).toMatchObject({
      status: 'pass',
      simulatedCount: 1,
      scoredCount: 0,
      savedCount: 0,
      traceCount: 0
    });
    expect(audit.boundary).toContain('not scored');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityRuntimeCandidateSimulationAudit');
  });

  it('summarizes runtime candidate simulation coverage without ranking candidates', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, () =>
      withRows([
        { year: 2028, shortfall: 0, totalTaxYear: 1000, bal_total: 300000 },
        { year: 2029, shortfall: 0, totalTaxYear: 2000, bal_total: 250000 }
      ])
    );
    const summary = selectMonthlyCapacityRuntimeCandidateSimulationSummary(simulationSet);

    expect(summary).toMatchObject({
      status: 'ready',
      coveredVariantIds: ['baseline'],
      gapVariantIds: [],
      baselineStatus: 'covered'
    });
    expect(summary.rows[0]).toMatchObject({
      id: 'baseline',
      status: 'covered',
      resultYears: 2,
      firstShortfallYear: null,
      endPortfolio: 250000,
      totalTax: 3000
    });
    expect(summary.boundary).toContain('without scoring candidates');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityRuntimeCandidateSimulationSummary');
  });

  it('keeps simulation summary descriptive when baseline has a gap and repairs cover it', () => {
    const shortfallResult = withRows([
      { ...fixture.years[0], shortfall: 0, totalAftaxYear: 70000, bal_total: 200000 },
      { ...fixture.years[1], shortfall: 10000, totalAftaxYear: 71470, bal_total: 0 }
    ]);
    const repairedResult = withRows([
      { ...fixture.years[0], shortfall: 0, totalAftaxYear: 63000, bal_total: 220000 },
      { ...fixture.years[1], shortfall: 0, totalAftaxYear: 64000, bal_total: 100000 }
    ]);
    const runtime = buildMonthlyCandidateRuntime(shortfallResult, planFixture, { spendLessGogo: repairedResult });
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, (plan) =>
      withRows([
        {
          year: 2028,
          shortfall: plan.spending.gogo === 70000 && plan.assumptions.retireYear === 2028 ? 5000 : 0,
          totalTaxYear: 1000,
          bal_total: 300000
        },
        { year: 2029, shortfall: 0, totalTaxYear: 2000, bal_total: 250000 }
      ])
    );
    const summary = selectMonthlyCapacityRuntimeCandidateSimulationSummary(simulationSet);

    expect(summary.baselineStatus).toBe('gap');
    expect(summary.gapVariantIds).toEqual(['baseline']);
    expect(summary.coveredVariantIds).toEqual([
      'spendingRepairSmall',
      'spendingRepairLarge',
      'workLaterOneYear',
      'workLaterTwoYears'
    ]);
    expect(summary.rows.find((row) => row.id === 'baseline')).toMatchObject({ firstShortfallYear: 2028 });
  });

  it('runs clean examples through runtime candidate simulation readiness', () => {
    const runtimeRowsByExample: Record<string, SimulationResult> = {
      singleMinimumFloor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 43200, spending: 43200, bal_total: 500000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 43200, spending: 43200, bal_total: 450000 }
      ]),
      coupleTightFloor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 96000, spending: 96000, bal_total: 200000 },
        { ...fixture.years[1], shortfall: 12000, totalAftaxYear: 96000, spending: 96000, bal_total: 0 }
      ]),
      pensionCoupleSurvivor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 64800, spending: 64800, bal_total: 600000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 64800, spending: 64800, bal_total: 500000 }
      ]),
      estateHeavyRoom: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 84000, spending: 84000, bal_total: 6000000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 84000, spending: 84000, bal_total: 7000000 }
      ])
    };
    const expectedSimulated: Record<string, string[]> = {
      singleMinimumFloor: ['baseline'],
      coupleTightFloor: ['baseline', 'spendingRepairSmall', 'spendingRepairLarge', 'workLaterOneYear', 'workLaterTwoYears'],
      pensionCoupleSurvivor: ['baseline'],
      estateHeavyRoom: ['baseline']
    };

    for (const card of cleanExamplePlanCards) {
      const plan = { ...createCleanExampleRuntimePlan(card.id), inheritance: 0 };
      const result = runtimeRowsByExample[card.id];
      const answer = selectRetirementAnswerSummary(result, plan);
      const spending = selectSpendingCapacitySummary(result, {}, plan, answer);
      const packet = selectMonthlyCapacityRuntimePacket(result, plan, spending);
      const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
      const gateStatus: 'blocked' | 'reviewOnly' = handoff.status === 'blocked' ? 'blocked' : 'reviewOnly';
      const gate = {
        status: gateStatus,
        headline: 'Example runtime candidate simulation readiness gate',
        requiredBeforeExecution: ['keepOutputRuntimeOnly', 'defineCandidateScoring', 'preserveNoAnnualSequencing'] as Array<
          'keepOutputRuntimeOnly' | 'defineCandidateScoring' | 'preserveNoAnnualSequencing'
        >,
        allowedNow: ['runtimeEvidence', 'tests', 'docs', 'boundedReviewOnly'] as Array<'runtimeEvidence' | 'tests' | 'docs' | 'boundedReviewOnly'>,
        notAllowedYet: ['optimizerSearch', 'savedOptimizerOutput', 'fundingTrace', 'accountInstructions', 'annualAccountSequencing'] as Array<
          'optimizerSearch' | 'savedOptimizerOutput' | 'fundingTrace' | 'accountInstructions' | 'annualAccountSequencing'
        >,
        boundary: 'Test-only runtime candidate simulation readiness gate for example matrix coverage.'
      };
      const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
      const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(gate), inputs);
      const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);
      const limits = selectMonthlyCapacityCandidateSetLimits(candidateSet);
      const builderPlan = selectMonthlyCapacityCandidateBuilderPlan(candidateSet, limits);
      const contract = selectMonthlyCapacityCandidateBuilderInputContract(packet, builderPlan, limits);
      const order = selectMonthlyCapacityCandidateBuilderOrder(builderPlan, contract);
      const dryRun = selectMonthlyCapacityCandidateBuilderDryRun(builderPlan, order);
      const runtimeGate = selectMonthlyCapacityCandidateBuilderRuntimeGate(
        contract,
        order,
        selectMonthlyCapacityCandidateBuilderDryRunAudit(dryRun)
      );
      const variants = selectMonthlyCapacityRuntimeCandidateVariants(plan, builderPlan, order, runtimeGate);
      const simulationHandoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(variants);
      const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(variants, simulationHandoff, () => runtimeRowsByExample[card.id]);
      const readiness = selectMonthlyCapacityRuntimeCandidateSimulationExampleReadiness(card.id, simulationSet);

      expect(readiness.status, card.id).toBe('ready');
      expect(readiness.simulatedVariantIds, card.id).toEqual(expectedSimulated[card.id]);
      expect(readiness.boundary, card.id).toContain('without scoring');
      expect(createPlanFile(plan).plan).not.toHaveProperty('monthlyCapacityRuntimeCandidateSimulationExampleReadiness');
    }
  });

  it('closes out runtime candidate simulations before scoring execution', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, () => fixture);
    const closeout = selectMonthlyCapacityRuntimeCandidateSimulationCloseout(simulationSet);

    expect(closeout).toMatchObject({
      status: 'readyForScoringPlanning',
      nextBroadStep: 'candidateScoringExecutionPlanning',
      completedPieces: ['runtimeSimulations', 'simulationSummary', 'simulationAudit', 'exampleMatrix', 'noPersistenceBoundary']
    });
    expect(closeout.stillDeferred).toEqual([
      'candidateScoringExecution',
      'optimizerSearch',
      'savedCandidateOutput',
      'fundingTrace',
      'accountInstructions',
      'annualSequencing',
      'uiPresentation'
    ]);
    expect(closeout.boundary).toContain('no candidate scoring execution');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityRuntimeCandidateSimulationCloseout');
  });

  it('plans scoring execution from simulation evidence without calculating scores', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, () => fixture);
    const summary = selectMonthlyCapacityRuntimeCandidateSimulationSummary(simulationSet);
    const plan = selectMonthlyCapacityScoringExecutionPlan(simulationSet, summary);

    expect(plan.status).toBe('readyForPlanning');
    expect(plan.primaryObjective).toBe('coverMonthlyFloorFirst');
    expect(plan.simulatedVariantIds).toEqual(['baseline']);
    expect(plan.rows.map((row) => row.id)).toEqual([
      'floorCoverage',
      'gapRepair',
      'taxReview',
      'disruptionPenalty',
      'survivorEstate',
      'outputBoundary'
    ]);
    expect(plan.rows.find((row) => row.id === 'floorCoverage')).toMatchObject({ status: 'ready' });
    expect(plan.rows.find((row) => row.id === 'gapRepair')).toMatchObject({ status: 'review' });
    expect(plan.notAllowedYet).toEqual([
      'candidateScoringExecution',
      'optimizerSearch',
      'savedCandidateOutput',
      'fundingTrace',
      'accountInstructions',
      'annualSequencing',
      'uiPresentation'
    ]);
    expect(plan.boundary).toContain('without calculating scores');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityScoringExecutionPlan');
  });

  it('marks gap repair scoring as ready when simulated repair evidence is present', () => {
    const shortfallResult = withRows([
      { ...fixture.years[0], shortfall: 0, totalAftaxYear: 70000, bal_total: 200000 },
      { ...fixture.years[1], shortfall: 10000, totalAftaxYear: 71470, bal_total: 0 }
    ]);
    const repairedResult = withRows([
      { ...fixture.years[0], shortfall: 0, totalAftaxYear: 63000, bal_total: 220000 },
      { ...fixture.years[1], shortfall: 0, totalAftaxYear: 64000, bal_total: 100000 }
    ]);
    const runtime = buildMonthlyCandidateRuntime(shortfallResult, planFixture, { spendLessGogo: repairedResult });
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, (plan) =>
      withRows([
        {
          year: 2028,
          shortfall: plan.spending.gogo === 70000 && plan.assumptions.retireYear === 2028 ? 5000 : 0,
          totalTaxYear: 1000,
          bal_total: 300000
        },
        { year: 2029, shortfall: 0, totalTaxYear: 2000, bal_total: 250000 }
      ])
    );
    const plan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);

    expect(plan.rows.find((row) => row.id === 'gapRepair')).toMatchObject({
      status: 'ready',
      detail: expect.stringContaining('Gap repair evidence')
    });
    expect(plan.simulatedVariantIds).toEqual([
      'baseline',
      'spendingRepairSmall',
      'spendingRepairLarge',
      'workLaterOneYear',
      'workLaterTwoYears'
    ]);
  });

  it('blocks scoring execution planning when simulation evidence is blocked', () => {
    const simulationSet = {
      status: 'blocked' as const,
      rows: [],
      simulatedVariantIds: [],
      blockedVariantIds: [],
      boundary: 'Test blocked simulation set.'
    };
    const plan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);

    expect(plan.status).toBe('blocked');
    expect(plan.rows.filter((row) => row.status === 'blocked').map((row) => row.id)).toEqual([
      'floorCoverage',
      'gapRepair',
      'taxReview',
      'disruptionPenalty',
      'survivorEstate'
    ]);
    expect(plan.rows.find((row) => row.id === 'outputBoundary')).toMatchObject({ status: 'ready' });
  });

  it('keeps scoring execution guardrails closed before implementation', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, () => fixture);
    const plan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
    const guardrails = selectMonthlyCapacityScoringExecutionGuardrails(plan);

    expect(guardrails.map((row) => row.id)).toEqual([
      'noScoresYet',
      'noRankingYet',
      'noSavedOutput',
      'noFundingTrace',
      'noAccountInstructions',
      'noAnnualSequencing',
      'noUiPresentation'
    ]);
    expect(guardrails.every((row) => row.status === 'pass')).toBe(true);
    expect(guardrails.find((row) => row.id === 'noRankingYet')?.detail).toContain('No candidate is ranked');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityScoringExecutionGuardrails');
  });

  it('summarizes scoring execution readiness without executing scoring', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, () => fixture);
    const plan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
    const readiness = selectMonthlyCapacityScoringExecutionReadiness(plan);

    expect(readiness.status).toBe('readyForFutureExecution');
    expect(readiness.readyRowIds).toEqual(['floorCoverage', 'disruptionPenalty', 'outputBoundary']);
    expect(readiness.reviewRowIds).toEqual(['gapRepair', 'taxReview', 'survivorEstate']);
    expect(readiness.blockedRowIds).toEqual([]);
    expect(readiness.boundary).toContain('without scoring');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityScoringExecutionReadiness');
  });

  it('keeps scoring execution readiness blocked when simulation evidence is incomplete', () => {
    const simulationSet = {
      status: 'blocked' as const,
      rows: [],
      simulatedVariantIds: [],
      blockedVariantIds: [],
      boundary: 'Test blocked simulation set.'
    };
    const plan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
    const readiness = selectMonthlyCapacityScoringExecutionReadiness(plan);

    expect(readiness.status).toBe('blocked');
    expect(readiness.blockedRowIds).toEqual(['floorCoverage', 'gapRepair', 'taxReview', 'disruptionPenalty', 'survivorEstate']);
  });

  it('runs clean examples through scoring execution planning readiness', () => {
    const runtimeRowsByExample: Record<string, SimulationResult> = {
      singleMinimumFloor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 43200, spending: 43200, bal_total: 500000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 43200, spending: 43200, bal_total: 450000 }
      ]),
      coupleTightFloor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 96000, spending: 96000, bal_total: 200000 },
        { ...fixture.years[1], shortfall: 12000, totalAftaxYear: 96000, spending: 96000, bal_total: 0 }
      ]),
      pensionCoupleSurvivor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 64800, spending: 64800, bal_total: 600000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 64800, spending: 64800, bal_total: 500000 }
      ]),
      estateHeavyRoom: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 84000, spending: 84000, bal_total: 6000000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 84000, spending: 84000, bal_total: 7000000 }
      ])
    };

    for (const card of cleanExamplePlanCards) {
      const plan = { ...createCleanExampleRuntimePlan(card.id), inheritance: 0 };
      const result = runtimeRowsByExample[card.id];
      const answer = selectRetirementAnswerSummary(result, plan);
      const spending = selectSpendingCapacitySummary(result, {}, plan, answer);
      const packet = selectMonthlyCapacityRuntimePacket(result, plan, spending);
      const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
      const gateStatus: 'blocked' | 'reviewOnly' = handoff.status === 'blocked' ? 'blocked' : 'reviewOnly';
      const gate = {
        status: gateStatus,
        headline: 'Example scoring execution planning readiness gate',
        requiredBeforeExecution: ['keepOutputRuntimeOnly', 'defineCandidateScoring', 'preserveNoAnnualSequencing'] as Array<
          'keepOutputRuntimeOnly' | 'defineCandidateScoring' | 'preserveNoAnnualSequencing'
        >,
        allowedNow: ['runtimeEvidence', 'tests', 'docs', 'boundedReviewOnly'] as Array<'runtimeEvidence' | 'tests' | 'docs' | 'boundedReviewOnly'>,
        notAllowedYet: ['optimizerSearch', 'savedOptimizerOutput', 'fundingTrace', 'accountInstructions', 'annualAccountSequencing'] as Array<
          'optimizerSearch' | 'savedOptimizerOutput' | 'fundingTrace' | 'accountInstructions' | 'annualAccountSequencing'
        >,
        boundary: 'Test-only scoring execution planning readiness gate for example matrix coverage.'
      };
      const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
      const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(gate), inputs);
      const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);
      const limits = selectMonthlyCapacityCandidateSetLimits(candidateSet);
      const builderPlan = selectMonthlyCapacityCandidateBuilderPlan(candidateSet, limits);
      const contract = selectMonthlyCapacityCandidateBuilderInputContract(packet, builderPlan, limits);
      const order = selectMonthlyCapacityCandidateBuilderOrder(builderPlan, contract);
      const dryRun = selectMonthlyCapacityCandidateBuilderDryRun(builderPlan, order);
      const runtimeGate = selectMonthlyCapacityCandidateBuilderRuntimeGate(
        contract,
        order,
        selectMonthlyCapacityCandidateBuilderDryRunAudit(dryRun)
      );
      const variants = selectMonthlyCapacityRuntimeCandidateVariants(plan, builderPlan, order, runtimeGate);
      const simulationHandoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(variants);
      const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(variants, simulationHandoff, () => result);
      const scoringPlan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
      const readiness = selectMonthlyCapacityScoringExecutionReadiness(scoringPlan);
      const example = selectMonthlyCapacityScoringExecutionExampleReadiness(card.id, scoringPlan, readiness);

      expect(example.status, card.id).toBe('readyForFutureExecution');
      expect(example.simulatedVariantIds, card.id).toContain('baseline');
      expect(example.readyRowIds, card.id).toContain('floorCoverage');
      expect(example.readyRowIds, card.id).toContain('outputBoundary');
      expect(example.boundary, card.id).toContain('without scoring');
      expect(createPlanFile(plan).plan).not.toHaveProperty('monthlyCapacityScoringExecutionExampleReadiness');
    }
  });

  it('closes out scoring execution planning without executing scores', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, () => fixture);
    const plan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
    const closeout = selectMonthlyCapacityScoringExecutionPlanningCloseout(plan);

    expect(closeout).toMatchObject({
      status: 'readyForImplementationPlanning',
      nextBroadStep: 'candidateScoringExecutionImplementation',
      completedPieces: ['scoringRows', 'guardrails', 'readiness', 'exampleMatrix', 'noOutputBoundary']
    });
    expect(closeout.stillDeferred).toEqual([
      'candidateScoringExecution',
      'optimizerSearch',
      'savedCandidateOutput',
      'fundingTrace',
      'accountInstructions',
      'annualSequencing',
      'uiPresentation'
    ]);
    expect(closeout.boundary).toContain('no candidate scoring execution');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityScoringExecutionPlanningCloseout');
  });

  it('closes out scoring execution planning as blocked when evidence is blocked', () => {
    const simulationSet = {
      status: 'blocked' as const,
      rows: [],
      simulatedVariantIds: [],
      blockedVariantIds: [],
      boundary: 'Test blocked simulation set.'
    };
    const plan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
    const closeout = selectMonthlyCapacityScoringExecutionPlanningCloseout(plan);

    expect(closeout.status).toBe('blocked');
    expect(closeout.nextBroadStep).toBe('capacityInputsFirst');
  });

  it('calculates runtime-only score evidence without ranking or recommending candidates', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, () => fixture);
    const plan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
    const scoreSet = selectMonthlyCapacityRuntimeScores(simulationSet, plan);

    expect(scoreSet.status).toBe('ready');
    expect(scoreSet.scoredVariantIds).toEqual(['baseline']);
    expect(scoreSet.rows[0]).toMatchObject({
      id: 'baseline',
      status: 'scored',
      totalScore: 100,
      suggestionEligible: false,
      saved: false,
      fundingTrace: null,
      accountInstruction: null,
      annualSequencing: null
    });
    expect(scoreSet.rows[0].factors.map((factor) => factor.id)).toEqual(['floorCoverage', 'gapRepair', 'taxReview', 'disruptionPenalty']);
    expect(scoreSet.boundary).toContain('without optimizer search');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityRuntimeScores');
  });

  it('scores gap repair evidence while preserving disruption penalties', () => {
    const shortfallResult = withRows([
      { ...fixture.years[0], shortfall: 0, totalAftaxYear: 70000, bal_total: 200000 },
      { ...fixture.years[1], shortfall: 10000, totalAftaxYear: 71470, bal_total: 0 }
    ]);
    const repairedResult = withRows([
      { ...fixture.years[0], shortfall: 0, totalAftaxYear: 63000, bal_total: 220000 },
      { ...fixture.years[1], shortfall: 0, totalAftaxYear: 64000, bal_total: 100000 }
    ]);
    const runtime = buildMonthlyCandidateRuntime(shortfallResult, planFixture, { spendLessGogo: repairedResult });
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, (plan) =>
      withRows([
        {
          year: 2028,
          shortfall: plan.spending.gogo === 70000 && plan.assumptions.retireYear === 2028 ? 5000 : 0,
          totalTaxYear: 1000,
          bal_total: 300000
        },
        { year: 2029, shortfall: 0, totalTaxYear: 2000, bal_total: 250000 }
      ])
    );
    const plan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
    const scoreSet = selectMonthlyCapacityRuntimeScores(simulationSet, plan);
    const baseline = scoreSet.rows.find((row) => row.id === 'baseline');
    const spendingRepairSmall = scoreSet.rows.find((row) => row.id === 'spendingRepairSmall');
    const workLaterTwoYears = scoreSet.rows.find((row) => row.id === 'workLaterTwoYears');

    expect(baseline?.factors.find((factor) => factor.id === 'floorCoverage')).toMatchObject({ points: 0 });
    expect(spendingRepairSmall?.factors.find((factor) => factor.id === 'gapRepair')).toMatchObject({ points: 35 });
    expect(spendingRepairSmall?.factors.find((factor) => factor.id === 'disruptionPenalty')).toMatchObject({ points: -8 });
    expect(workLaterTwoYears?.factors.find((factor) => factor.id === 'disruptionPenalty')).toMatchObject({ points: -20 });
    expect(scoreSet.rows.every((row) => row.suggestionEligible === false)).toBe(true);
  });

  it('blocks runtime scores when scoring readiness is blocked', () => {
    const simulationSet = {
      status: 'blocked' as const,
      rows: [],
      simulatedVariantIds: [],
      blockedVariantIds: [],
      boundary: 'Test blocked simulation set.'
    };
    const plan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
    const scoreSet = selectMonthlyCapacityRuntimeScores(simulationSet, plan);

    expect(scoreSet.status).toBe('blocked');
    expect(scoreSet.rows).toEqual([]);
    expect(scoreSet.scoredVariantIds).toEqual([]);
  });

  it('audits runtime scores so they cannot become saved recommendations', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, () => fixture);
    const plan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
    const scoreSet = selectMonthlyCapacityRuntimeScores(simulationSet, plan);
    const audit = selectMonthlyCapacityRuntimeScoreAudit(scoreSet);

    expect(audit).toMatchObject({
      status: 'pass',
      scoredCount: 1,
      suggestionEligibleCount: 0,
      savedCount: 0,
      traceCount: 0,
      instructionCount: 0,
      annualSequencingCount: 0
    });
    expect(audit.boundary).toContain('did not become recommendations');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityRuntimeScoreAudit');
  });

  it('summarizes runtime score evidence without selecting a winner', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, () => fixture);
    const plan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
    const scoreSet = selectMonthlyCapacityRuntimeScores(simulationSet, plan);
    const summary = selectMonthlyCapacityRuntimeScoreSummary(scoreSet);

    expect(summary).toMatchObject({
      status: 'ready',
      scoredVariantIds: ['baseline'],
      highestScore: 100,
      lowestScore: 100,
      baselineScore: 100,
      practicalRepairScoreIds: []
    });
    expect(summary.boundary).toContain('without ranking candidates');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityRuntimeScoreSummary');
  });

  it('runs clean examples through runtime score readiness', () => {
    const runtimeRowsByExample: Record<string, SimulationResult> = {
      singleMinimumFloor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 43200, spending: 43200, bal_total: 500000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 43200, spending: 43200, bal_total: 450000 }
      ]),
      coupleTightFloor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 96000, spending: 96000, bal_total: 200000 },
        { ...fixture.years[1], shortfall: 12000, totalAftaxYear: 96000, spending: 96000, bal_total: 0 }
      ]),
      pensionCoupleSurvivor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 64800, spending: 64800, bal_total: 600000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 64800, spending: 64800, bal_total: 500000 }
      ]),
      estateHeavyRoom: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 84000, spending: 84000, bal_total: 6000000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 84000, spending: 84000, bal_total: 7000000 }
      ])
    };
    const expectedScored: Record<string, string[]> = {
      singleMinimumFloor: ['baseline'],
      coupleTightFloor: ['baseline', 'spendingRepairSmall', 'spendingRepairLarge', 'workLaterOneYear', 'workLaterTwoYears'],
      pensionCoupleSurvivor: ['baseline'],
      estateHeavyRoom: ['baseline']
    };

    for (const card of cleanExamplePlanCards) {
      const plan = { ...createCleanExampleRuntimePlan(card.id), inheritance: 0 };
      const result = runtimeRowsByExample[card.id];
      const answer = selectRetirementAnswerSummary(result, plan);
      const spending = selectSpendingCapacitySummary(result, {}, plan, answer);
      const packet = selectMonthlyCapacityRuntimePacket(result, plan, spending);
      const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
      const gateStatus: 'blocked' | 'reviewOnly' = handoff.status === 'blocked' ? 'blocked' : 'reviewOnly';
      const gate = {
        status: gateStatus,
        headline: 'Example runtime score readiness gate',
        requiredBeforeExecution: ['keepOutputRuntimeOnly', 'defineCandidateScoring', 'preserveNoAnnualSequencing'] as Array<
          'keepOutputRuntimeOnly' | 'defineCandidateScoring' | 'preserveNoAnnualSequencing'
        >,
        allowedNow: ['runtimeEvidence', 'tests', 'docs', 'boundedReviewOnly'] as Array<'runtimeEvidence' | 'tests' | 'docs' | 'boundedReviewOnly'>,
        notAllowedYet: ['optimizerSearch', 'savedOptimizerOutput', 'fundingTrace', 'accountInstructions', 'annualAccountSequencing'] as Array<
          'optimizerSearch' | 'savedOptimizerOutput' | 'fundingTrace' | 'accountInstructions' | 'annualAccountSequencing'
        >,
        boundary: 'Test-only runtime score readiness gate for example matrix coverage.'
      };
      const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
      const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(gate), inputs);
      const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);
      const limits = selectMonthlyCapacityCandidateSetLimits(candidateSet);
      const builderPlan = selectMonthlyCapacityCandidateBuilderPlan(candidateSet, limits);
      const contract = selectMonthlyCapacityCandidateBuilderInputContract(packet, builderPlan, limits);
      const order = selectMonthlyCapacityCandidateBuilderOrder(builderPlan, contract);
      const dryRun = selectMonthlyCapacityCandidateBuilderDryRun(builderPlan, order);
      const runtimeGate = selectMonthlyCapacityCandidateBuilderRuntimeGate(
        contract,
        order,
        selectMonthlyCapacityCandidateBuilderDryRunAudit(dryRun)
      );
      const variants = selectMonthlyCapacityRuntimeCandidateVariants(plan, builderPlan, order, runtimeGate);
      const simulationHandoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(variants);
      const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(variants, simulationHandoff, () => result);
      const scoringPlan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
      const scoreSet = selectMonthlyCapacityRuntimeScores(simulationSet, scoringPlan);
      const readiness = selectMonthlyCapacityRuntimeScoreExampleReadiness(card.id, scoreSet);

      expect(readiness.status, card.id).toBe('ready');
      expect(readiness.scoredVariantIds, card.id).toEqual(expectedScored[card.id]);
      expect(readiness.baselineScore, card.id).toBeTypeOf('number');
      expect(readiness.boundary, card.id).toContain('without ranking');
      expect(createPlanFile(plan).plan).not.toHaveProperty('monthlyCapacityRuntimeScoreExampleReadiness');
    }
  });

  it('closes out runtime score evidence for future ranking planning only', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, () => fixture);
    const plan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
    const scoreSet = selectMonthlyCapacityRuntimeScores(simulationSet, plan);
    const audit = selectMonthlyCapacityRuntimeScoreAudit(scoreSet);
    const summary = selectMonthlyCapacityRuntimeScoreSummary(scoreSet);
    const closeout = selectMonthlyCapacityRuntimeScoreCloseout(scoreSet, audit, summary);

    expect(closeout).toMatchObject({
      status: 'readyForRankingPlanning',
      nextBroadStep: 'candidateRankingPlanning',
      completedPieces: ['scoreRows', 'scoreAudit', 'scoreSummary', 'exampleMatrix', 'noRecommendationBoundary']
    });
    expect(closeout.stillDeferred).toEqual([
      'candidateRanking',
      'recommendations',
      'optimizerSearch',
      'savedOptimizerOutput',
      'fundingTrace',
      'accountInstructions',
      'annualAccountSequencing',
      'uiPresentation'
    ]);
    expect(closeout.boundary).toContain('no ranking');
    expect(closeout.boundary).toContain('no ranking, recommendations');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityRuntimeScoreCloseout');
  });

  it('blocks runtime score closeout when score evidence is blocked', () => {
    const scoreSet = selectMonthlyCapacityRuntimeScores(
      {
        status: 'blocked',
        rows: [],
        simulatedVariantIds: [],
        blockedVariantIds: ['baseline'],
        boundary: 'Blocked test simulation set.'
      },
      {
        status: 'blocked',
        rows: [{ id: 'floorCoverage', status: 'blocked', detail: 'Blocked test score input.' }],
        primaryObjective: 'coverMonthlyFloorFirst',
        simulatedVariantIds: [],
        notAllowedYet: ['candidateScoringExecution', 'optimizerSearch', 'savedCandidateOutput', 'fundingTrace', 'accountInstructions', 'annualSequencing', 'uiPresentation'],
        boundary: 'Blocked test scoring plan.'
      }
    );
    const closeout = selectMonthlyCapacityRuntimeScoreCloseout(scoreSet);

    expect(closeout.status).toBe('blocked');
    expect(closeout.nextBroadStep).toBe('capacityInputsFirst');
    expect(closeout.headline).toContain('needs clean guardrails');
    expect(closeout.stillDeferred).toContain('candidateRanking');
    expect(closeout.boundary).toContain('no ranking');
  });

  it('closes out the candidate scoring execution implementation package', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, () => fixture);
    const plan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
    const scoreSet = selectMonthlyCapacityRuntimeScores(simulationSet, plan);
    const closeout = selectMonthlyCapacityRuntimeScoreCloseout(scoreSet);
    const packageCloseout = selectMonthlyCapacityRuntimeScorePackageCloseout(closeout);

    expect(packageCloseout).toMatchObject({
      status: 'complete',
      package: 'candidateScoringExecutionImplementation',
      completedSprints: 'S1527-S1546',
      nextBroadStep: 'candidateRankingPlanning'
    });
    expect(packageCloseout.stillDeferred).toContain('recommendations');
    expect(packageCloseout.stillDeferred).toContain('uiPresentation');
    expect(packageCloseout.boundary).toContain('without ranking');
    expect(packageCloseout.boundary).toContain('score rows, audit, summary, examples, and closeout are complete');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityRuntimeScorePackageCloseout');
  });

  it('plans candidate ranking inputs without ordering candidates', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, () => fixture);
    const scoringPlan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
    const scoreSet = selectMonthlyCapacityRuntimeScores(simulationSet, scoringPlan);
    const closeout = selectMonthlyCapacityRuntimeScoreCloseout(scoreSet);
    const rankingPlan = selectMonthlyCapacityCandidateRankingPlan(scoreSet, closeout);

    expect(rankingPlan).toMatchObject({
      status: 'readyForPlanning',
      scoredVariantIds: ['baseline'],
      scoreCount: 1,
      highestScore: 100,
      lowestScore: 100,
      baselineScore: 100
    });
    expect(rankingPlan.rows.map((row) => row.id)).toEqual([
      'scoreEvidence',
      'auditPass',
      'tieBreakPolicy',
      'recommendationBoundary',
      'persistenceBoundary',
      'uiBoundary'
    ]);
    expect(rankingPlan.boundary).toContain('without ordering candidates');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityCandidateRankingPlan');
  });

  it('blocks candidate ranking planning when score closeout is blocked', () => {
    const scoreSet = {
      status: 'blocked' as const,
      rows: [],
      scoredVariantIds: [],
      boundary: 'Blocked test score set.'
    };
    const closeout = selectMonthlyCapacityRuntimeScoreCloseout(scoreSet);
    const rankingPlan = selectMonthlyCapacityCandidateRankingPlan(scoreSet, closeout);

    expect(rankingPlan.status).toBe('blocked');
    expect(rankingPlan.rows.some((row) => row.status === 'blocked')).toBe(true);
    expect(rankingPlan.scoredVariantIds).toEqual([]);
    expect(rankingPlan.notAllowedYet).toContain('candidateRanking');
  });

  it('keeps ranking guardrails closed before ranking implementation', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, () => fixture);
    const scoringPlan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
    const scoreSet = selectMonthlyCapacityRuntimeScores(simulationSet, scoringPlan);
    const closeout = selectMonthlyCapacityRuntimeScoreCloseout(scoreSet);
    const rankingPlan = selectMonthlyCapacityCandidateRankingPlan(scoreSet, closeout);
    const guardrails = selectMonthlyCapacityCandidateRankingGuardrails(rankingPlan);

    expect(guardrails.map((guardrail) => guardrail.status)).toEqual(['pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass']);
    expect(guardrails.map((guardrail) => guardrail.id)).toEqual([
      'noRankingYet',
      'noRecommendations',
      'noSavedOutput',
      'noFundingTrace',
      'noAccountInstructions',
      'noAnnualSequencing',
      'noUiPresentation'
    ]);
  });

  it('summarizes ranking planning readiness without ranking candidates', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, () => fixture);
    const scoringPlan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
    const scoreSet = selectMonthlyCapacityRuntimeScores(simulationSet, scoringPlan);
    const closeout = selectMonthlyCapacityRuntimeScoreCloseout(scoreSet);
    const rankingPlan = selectMonthlyCapacityCandidateRankingPlan(scoreSet, closeout);
    const readiness = selectMonthlyCapacityCandidateRankingReadiness(rankingPlan);

    expect(readiness).toMatchObject({
      status: 'readyForFutureRankingPlanning',
      blockedRowIds: [],
      reviewRowIds: []
    });
    expect(readiness.readyRowIds).toEqual([
      'scoreEvidence',
      'auditPass',
      'tieBreakPolicy',
      'recommendationBoundary',
      'persistenceBoundary',
      'uiBoundary'
    ]);
    expect(readiness.boundary).toContain('without ranking candidates');
  });

  it('runs clean examples through candidate ranking planning readiness', () => {
    const runtimeRowsByExample: Record<string, SimulationResult> = {
      singleMinimumFloor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 43200, spending: 43200, bal_total: 500000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 43200, spending: 43200, bal_total: 450000 }
      ]),
      coupleTightFloor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 96000, spending: 96000, bal_total: 200000 },
        { ...fixture.years[1], shortfall: 12000, totalAftaxYear: 96000, spending: 96000, bal_total: 0 }
      ]),
      pensionCoupleSurvivor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 64800, spending: 64800, bal_total: 600000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 64800, spending: 64800, bal_total: 500000 }
      ]),
      estateHeavyRoom: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 84000, spending: 84000, bal_total: 6000000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 84000, spending: 84000, bal_total: 7000000 }
      ])
    };

    for (const card of cleanExamplePlanCards) {
      const plan = { ...createCleanExampleRuntimePlan(card.id), inheritance: 0 };
      const result = runtimeRowsByExample[card.id];
      const answer = selectRetirementAnswerSummary(result, plan);
      const spending = selectSpendingCapacitySummary(result, {}, plan, answer);
      const packet = selectMonthlyCapacityRuntimePacket(result, plan, spending);
      const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
      const gateStatus: 'blocked' | 'reviewOnly' = handoff.status === 'blocked' ? 'blocked' : 'reviewOnly';
      const gate = {
        status: gateStatus,
        headline: 'Example ranking planning readiness gate',
        requiredBeforeExecution: ['keepOutputRuntimeOnly', 'defineCandidateScoring', 'preserveNoAnnualSequencing'] as Array<
          'keepOutputRuntimeOnly' | 'defineCandidateScoring' | 'preserveNoAnnualSequencing'
        >,
        allowedNow: ['runtimeEvidence', 'tests', 'docs', 'boundedReviewOnly'] as Array<'runtimeEvidence' | 'tests' | 'docs' | 'boundedReviewOnly'>,
        notAllowedYet: ['optimizerSearch', 'savedOptimizerOutput', 'fundingTrace', 'accountInstructions', 'annualAccountSequencing'] as Array<
          'optimizerSearch' | 'savedOptimizerOutput' | 'fundingTrace' | 'accountInstructions' | 'annualAccountSequencing'
        >,
        boundary: 'Test-only ranking planning readiness gate for example matrix coverage.'
      };
      const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
      const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(gate), inputs);
      const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);
      const limits = selectMonthlyCapacityCandidateSetLimits(candidateSet);
      const builderPlan = selectMonthlyCapacityCandidateBuilderPlan(candidateSet, limits);
      const contract = selectMonthlyCapacityCandidateBuilderInputContract(packet, builderPlan, limits);
      const order = selectMonthlyCapacityCandidateBuilderOrder(builderPlan, contract);
      const dryRun = selectMonthlyCapacityCandidateBuilderDryRun(builderPlan, order);
      const runtimeGate = selectMonthlyCapacityCandidateBuilderRuntimeGate(
        contract,
        order,
        selectMonthlyCapacityCandidateBuilderDryRunAudit(dryRun)
      );
      const variants = selectMonthlyCapacityRuntimeCandidateVariants(plan, builderPlan, order, runtimeGate);
      const simulationHandoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(variants);
      const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(variants, simulationHandoff, () => result);
      const scoringPlan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
      const scoreSet = selectMonthlyCapacityRuntimeScores(simulationSet, scoringPlan);
      const closeout = selectMonthlyCapacityRuntimeScoreCloseout(scoreSet);
      const rankingPlan = selectMonthlyCapacityCandidateRankingPlan(scoreSet, closeout);
      const readiness = selectMonthlyCapacityCandidateRankingExampleReadiness(card.id, rankingPlan);

      expect(readiness.status, card.id).toBe('readyForFutureRankingPlanning');
      expect(readiness.scoredVariantIds.length, card.id).toBeGreaterThan(0);
      expect(readiness.boundary, card.id).toContain('without ranking');
      expect(createPlanFile(plan).plan).not.toHaveProperty('monthlyCapacityCandidateRankingExampleReadiness');
    }
  });

  it('plans ranking tie-break policy without sorting candidates', () => {
    const shortfallResult = withRows([
      { ...fixture.years[0], shortfall: 0, totalAftaxYear: 70000, bal_total: 200000 },
      { ...fixture.years[1], shortfall: 10000, totalAftaxYear: 71470, bal_total: 0 }
    ]);
    const runtime = buildMonthlyCandidateRuntime(shortfallResult, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, (plan) =>
      withRows([
        {
          year: 2028,
          shortfall: plan.spending.gogo === 70000 && plan.assumptions.retireYear === 2028 ? 5000 : 0,
          totalTaxYear: 1000,
          bal_total: 300000
        },
        { year: 2029, shortfall: 0, totalTaxYear: 2000, bal_total: 250000 }
      ])
    );
    const scoringPlan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
    const scoreSet = selectMonthlyCapacityRuntimeScores(simulationSet, scoringPlan);
    const closeout = selectMonthlyCapacityRuntimeScoreCloseout(scoreSet);
    const rankingPlan = selectMonthlyCapacityCandidateRankingPlan(scoreSet, closeout);
    const tieBreakPlan = selectMonthlyCapacityCandidateRankingTieBreakPlan(rankingPlan);

    expect(tieBreakPlan).toMatchObject({
      status: 'readyForPlanning',
      scoreCount: 5,
      ruleIds: ['floorCoverageFirst', 'lowerDisruption', 'taxSecondary', 'baselineAsReference', 'plainLanguageReview']
    });
    expect(tieBreakPlan.rules.map((rule) => rule.status)).toEqual(['planned', 'planned', 'planned', 'planned', 'planned']);
    expect(tieBreakPlan.stillDeferred).toContain('candidateRanking');
    expect(tieBreakPlan.boundary).toContain('without sorting candidates');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityCandidateRankingTieBreakPlan');
  });

  it('blocks ranking tie-break planning when ranking readiness is blocked', () => {
    const scoreSet = {
      status: 'blocked' as const,
      rows: [],
      scoredVariantIds: [],
      boundary: 'Blocked test score set.'
    };
    const closeout = selectMonthlyCapacityRuntimeScoreCloseout(scoreSet);
    const rankingPlan = selectMonthlyCapacityCandidateRankingPlan(scoreSet, closeout);
    const tieBreakPlan = selectMonthlyCapacityCandidateRankingTieBreakPlan(rankingPlan);

    expect(tieBreakPlan.status).toBe('blocked');
    expect(tieBreakPlan.rules.every((rule) => rule.status === 'blocked')).toBe(true);
    expect(tieBreakPlan.ruleIds).toEqual(['floorCoverageFirst', 'lowerDisruption', 'taxSecondary', 'baselineAsReference', 'plainLanguageReview']);
    expect(tieBreakPlan.boundary).toContain('without sorting candidates');
  });

  it('audits ranking planning so it cannot create ranked output', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, () => fixture);
    const scoringPlan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
    const scoreSet = selectMonthlyCapacityRuntimeScores(simulationSet, scoringPlan);
    const closeout = selectMonthlyCapacityRuntimeScoreCloseout(scoreSet);
    const rankingPlan = selectMonthlyCapacityCandidateRankingPlan(scoreSet, closeout);
    const audit = selectMonthlyCapacityCandidateRankingPlanningAudit(rankingPlan);

    expect(audit).toMatchObject({
      status: 'pass',
      guardrailBlockCount: 0,
      rankedOutputCount: 0,
      recommendationCount: 0,
      savedOutputCount: 0,
      fundingTraceCount: 0,
      accountInstructionCount: 0,
      annualSequencingCount: 0
    });
    expect(audit.boundary).toContain('did not create ranked output');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityCandidateRankingPlanningAudit');
  });

  it('summarizes ranking planning without selecting a path', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, () => fixture);
    const scoringPlan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
    const scoreSet = selectMonthlyCapacityRuntimeScores(simulationSet, scoringPlan);
    const closeout = selectMonthlyCapacityRuntimeScoreCloseout(scoreSet);
    const rankingPlan = selectMonthlyCapacityCandidateRankingPlan(scoreSet, closeout);
    const tieBreakPlan = selectMonthlyCapacityCandidateRankingTieBreakPlan(rankingPlan);
    const summary = selectMonthlyCapacityCandidateRankingPlanningSummary(rankingPlan, tieBreakPlan);

    expect(summary).toMatchObject({
      status: 'readyForPlanning',
      scoreCount: 1,
      plannedRuleIds: ['floorCoverageFirst', 'lowerDisruption', 'taxSecondary', 'baselineAsReference', 'plainLanguageReview'],
      reviewRowIds: [],
      nextBroadStep: 'candidateRankingImplementationPlanning'
    });
    expect(summary.boundary).toContain('without ranking candidates');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityCandidateRankingPlanningSummary');
  });

  it('closes out candidate ranking planning for implementation planning only', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, () => fixture);
    const scoringPlan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
    const scoreSet = selectMonthlyCapacityRuntimeScores(simulationSet, scoringPlan);
    const scoreCloseout = selectMonthlyCapacityRuntimeScoreCloseout(scoreSet);
    const rankingPlan = selectMonthlyCapacityCandidateRankingPlan(scoreSet, scoreCloseout);
    const tieBreakPlan = selectMonthlyCapacityCandidateRankingTieBreakPlan(rankingPlan);
    const closeout = selectMonthlyCapacityCandidateRankingPlanningCloseout(rankingPlan, tieBreakPlan);

    expect(closeout).toMatchObject({
      status: 'readyForImplementationPlanning',
      nextBroadStep: 'candidateRankingImplementationPlanning',
      completedPieces: ['rankingInputs', 'guardrails', 'readiness', 'tieBreakPolicy', 'audit', 'summary', 'exampleMatrix']
    });
    expect(closeout.stillDeferred).toContain('candidateRanking');
    expect(closeout.stillDeferred).toContain('recommendations');
    expect(closeout.boundary).toContain('no ranking');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityCandidateRankingPlanningCloseout');
  });

  it('blocks candidate ranking planning closeout when guardrails fail', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, () => fixture);
    const scoringPlan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
    const scoreSet = selectMonthlyCapacityRuntimeScores(simulationSet, scoringPlan);
    const scoreCloseout = selectMonthlyCapacityRuntimeScoreCloseout(scoreSet);
    const rankingPlan = {
      ...selectMonthlyCapacityCandidateRankingPlan(scoreSet, scoreCloseout),
      notAllowedYet: ['recommendations', 'optimizerSearch', 'savedOptimizerOutput', 'fundingTrace', 'accountInstructions', 'annualAccountSequencing', 'uiPresentation'] as Array<
        'candidateRanking' | 'recommendations' | 'optimizerSearch' | 'savedOptimizerOutput' | 'fundingTrace' | 'accountInstructions' | 'annualAccountSequencing' | 'uiPresentation'
      >
    };
    const tieBreakPlan = selectMonthlyCapacityCandidateRankingTieBreakPlan(rankingPlan);
    const audit = selectMonthlyCapacityCandidateRankingPlanningAudit(rankingPlan);
    const closeout = selectMonthlyCapacityCandidateRankingPlanningCloseout(rankingPlan, tieBreakPlan, audit);

    expect(audit.status).toBe('block');
    expect(closeout.status).toBe('blocked');
    expect(closeout.nextBroadStep).toBe('capacityInputsFirst');
    expect(closeout.headline).toContain('needs clean score evidence');
  });

  it('closes out the candidate ranking planning package', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, () => fixture);
    const scoringPlan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
    const scoreSet = selectMonthlyCapacityRuntimeScores(simulationSet, scoringPlan);
    const scoreCloseout = selectMonthlyCapacityRuntimeScoreCloseout(scoreSet);
    const rankingPlan = selectMonthlyCapacityCandidateRankingPlan(scoreSet, scoreCloseout);
    const tieBreakPlan = selectMonthlyCapacityCandidateRankingTieBreakPlan(rankingPlan);
    const closeout = selectMonthlyCapacityCandidateRankingPlanningCloseout(rankingPlan, tieBreakPlan);
    const packageCloseout = selectMonthlyCapacityCandidateRankingPlanningPackageCloseout(closeout);

    expect(packageCloseout).toMatchObject({
      status: 'complete',
      package: 'candidateRankingPlanning',
      completedSprints: 'S1547-S1566',
      nextBroadStep: 'candidateRankingImplementationPlanning'
    });
    expect(packageCloseout.stillDeferred).toContain('candidateRanking');
    expect(packageCloseout.stillDeferred).toContain('recommendations');
    expect(packageCloseout.boundary).toContain('without ranking');
    expect(packageCloseout.boundary).toContain('ranking inputs, guardrails, readiness, tie-break policy, audit, summary, examples, and closeout are complete');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityCandidateRankingPlanningPackageCloseout');
  });

  it('plans ranking implementation prerequisites without ordering candidates', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, () => fixture);
    const scoringPlan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
    const scoreSet = selectMonthlyCapacityRuntimeScores(simulationSet, scoringPlan);
    const scoreCloseout = selectMonthlyCapacityRuntimeScoreCloseout(scoreSet);
    const rankingPlan = selectMonthlyCapacityCandidateRankingPlan(scoreSet, scoreCloseout);
    const tieBreakPlan = selectMonthlyCapacityCandidateRankingTieBreakPlan(rankingPlan);
    const closeout = selectMonthlyCapacityCandidateRankingPlanningCloseout(rankingPlan, tieBreakPlan);
    const implementationPlan = selectMonthlyCapacityCandidateRankingImplementationPlan(closeout, tieBreakPlan);

    expect(implementationPlan).toMatchObject({
      status: 'readyForPlanning',
      scoreCount: 1,
      tieBreakRuleIds: ['floorCoverageFirst', 'lowerDisruption', 'taxSecondary', 'baselineAsReference', 'plainLanguageReview']
    });
    expect(implementationPlan.rows.map((row) => row.id)).toEqual([
      'planningCloseout',
      'scoreRows',
      'tieBreakRules',
      'runtimeOnlyBoundary',
      'recommendationBoundary',
      'persistenceBoundary',
      'uiBoundary'
    ]);
    expect(implementationPlan.boundary).toContain('without ordering candidates');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityCandidateRankingImplementationPlan');
  });

  it('defines a runtime-only ranking implementation contract without saved output', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, () => fixture);
    const scoringPlan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
    const scoreSet = selectMonthlyCapacityRuntimeScores(simulationSet, scoringPlan);
    const scoreCloseout = selectMonthlyCapacityRuntimeScoreCloseout(scoreSet);
    const rankingPlan = selectMonthlyCapacityCandidateRankingPlan(scoreSet, scoreCloseout);
    const tieBreakPlan = selectMonthlyCapacityCandidateRankingTieBreakPlan(rankingPlan);
    const closeout = selectMonthlyCapacityCandidateRankingPlanningCloseout(rankingPlan, tieBreakPlan);
    const implementationPlan = selectMonthlyCapacityCandidateRankingImplementationPlan(closeout, tieBreakPlan);
    const contract = selectMonthlyCapacityCandidateRankingImplementationContract(implementationPlan);

    expect(contract).toMatchObject({
      status: 'ready',
      requiredInputs: ['runtimeScores', 'rankingPlanningCloseout', 'tieBreakRules', 'guardrails'],
      outputShape: 'runtimeOrderingOnly',
      saved: false,
      recommendation: false,
      fundingTrace: null,
      accountInstruction: null,
      annualSequencing: null,
      uiPresentation: null
    });
    expect(contract.boundary).toContain('does not save output');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityCandidateRankingImplementationContract');
  });

  it('keeps ranking implementation guardrails closed before execution', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, () => fixture);
    const scoringPlan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
    const scoreSet = selectMonthlyCapacityRuntimeScores(simulationSet, scoringPlan);
    const scoreCloseout = selectMonthlyCapacityRuntimeScoreCloseout(scoreSet);
    const rankingPlan = selectMonthlyCapacityCandidateRankingPlan(scoreSet, scoreCloseout);
    const tieBreakPlan = selectMonthlyCapacityCandidateRankingTieBreakPlan(rankingPlan);
    const closeout = selectMonthlyCapacityCandidateRankingPlanningCloseout(rankingPlan, tieBreakPlan);
    const implementationPlan = selectMonthlyCapacityCandidateRankingImplementationPlan(closeout, tieBreakPlan);
    const guardrails = selectMonthlyCapacityCandidateRankingImplementationGuardrails(implementationPlan);

    expect(guardrails.map((guardrail) => guardrail.status)).toEqual(['pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass']);
    expect(guardrails.map((guardrail) => guardrail.id)).toEqual([
      'noRuntimeOrderingYet',
      'noRecommendation',
      'noSavedOutput',
      'noFundingTrace',
      'noAccountInstruction',
      'noAnnualSequencing',
      'noUiPresentation'
    ]);
  });

  it('summarizes ranking implementation readiness without execution', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, () => fixture);
    const scoringPlan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
    const scoreSet = selectMonthlyCapacityRuntimeScores(simulationSet, scoringPlan);
    const scoreCloseout = selectMonthlyCapacityRuntimeScoreCloseout(scoreSet);
    const rankingPlan = selectMonthlyCapacityCandidateRankingPlan(scoreSet, scoreCloseout);
    const tieBreakPlan = selectMonthlyCapacityCandidateRankingTieBreakPlan(rankingPlan);
    const closeout = selectMonthlyCapacityCandidateRankingPlanningCloseout(rankingPlan, tieBreakPlan);
    const implementationPlan = selectMonthlyCapacityCandidateRankingImplementationPlan(closeout, tieBreakPlan);
    const readiness = selectMonthlyCapacityCandidateRankingImplementationReadiness(implementationPlan);

    expect(readiness).toMatchObject({
      status: 'readyForFutureImplementation',
      blockedRowIds: [],
      reviewRowIds: []
    });
    expect(readiness.readyRowIds).toEqual([
      'planningCloseout',
      'scoreRows',
      'tieBreakRules',
      'runtimeOnlyBoundary',
      'recommendationBoundary',
      'persistenceBoundary',
      'uiBoundary'
    ]);
    expect(readiness.boundary).toContain('without ordering candidates');
  });

  it('runs clean examples through ranking implementation planning readiness', () => {
    const runtimeRowsByExample: Record<string, SimulationResult> = {
      singleMinimumFloor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 43200, spending: 43200, bal_total: 500000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 43200, spending: 43200, bal_total: 450000 }
      ]),
      coupleTightFloor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 96000, spending: 96000, bal_total: 200000 },
        { ...fixture.years[1], shortfall: 12000, totalAftaxYear: 96000, spending: 96000, bal_total: 0 }
      ]),
      pensionCoupleSurvivor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 64800, spending: 64800, bal_total: 600000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 64800, spending: 64800, bal_total: 500000 }
      ]),
      estateHeavyRoom: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 84000, spending: 84000, bal_total: 6000000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 84000, spending: 84000, bal_total: 7000000 }
      ])
    };

    for (const card of cleanExamplePlanCards) {
      const plan = { ...createCleanExampleRuntimePlan(card.id), inheritance: 0 };
      const result = runtimeRowsByExample[card.id];
      const answer = selectRetirementAnswerSummary(result, plan);
      const spending = selectSpendingCapacitySummary(result, {}, plan, answer);
      const packet = selectMonthlyCapacityRuntimePacket(result, plan, spending);
      const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
      const gateStatus: 'blocked' | 'reviewOnly' = handoff.status === 'blocked' ? 'blocked' : 'reviewOnly';
      const gate = {
        status: gateStatus,
        headline: 'Example ranking implementation planning readiness gate',
        requiredBeforeExecution: ['keepOutputRuntimeOnly', 'defineCandidateScoring', 'preserveNoAnnualSequencing'] as Array<
          'keepOutputRuntimeOnly' | 'defineCandidateScoring' | 'preserveNoAnnualSequencing'
        >,
        allowedNow: ['runtimeEvidence', 'tests', 'docs', 'boundedReviewOnly'] as Array<'runtimeEvidence' | 'tests' | 'docs' | 'boundedReviewOnly'>,
        notAllowedYet: ['optimizerSearch', 'savedOptimizerOutput', 'fundingTrace', 'accountInstructions', 'annualAccountSequencing'] as Array<
          'optimizerSearch' | 'savedOptimizerOutput' | 'fundingTrace' | 'accountInstructions' | 'annualAccountSequencing'
        >,
        boundary: 'Test-only ranking implementation planning readiness gate for example matrix coverage.'
      };
      const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
      const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(gate), inputs);
      const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);
      const limits = selectMonthlyCapacityCandidateSetLimits(candidateSet);
      const builderPlan = selectMonthlyCapacityCandidateBuilderPlan(candidateSet, limits);
      const contract = selectMonthlyCapacityCandidateBuilderInputContract(packet, builderPlan, limits);
      const order = selectMonthlyCapacityCandidateBuilderOrder(builderPlan, contract);
      const dryRun = selectMonthlyCapacityCandidateBuilderDryRun(builderPlan, order);
      const runtimeGate = selectMonthlyCapacityCandidateBuilderRuntimeGate(
        contract,
        order,
        selectMonthlyCapacityCandidateBuilderDryRunAudit(dryRun)
      );
      const variants = selectMonthlyCapacityRuntimeCandidateVariants(plan, builderPlan, order, runtimeGate);
      const simulationHandoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(variants);
      const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(variants, simulationHandoff, () => result);
      const scoringPlan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
      const scoreSet = selectMonthlyCapacityRuntimeScores(simulationSet, scoringPlan);
      const scoreCloseout = selectMonthlyCapacityRuntimeScoreCloseout(scoreSet);
      const rankingPlan = selectMonthlyCapacityCandidateRankingPlan(scoreSet, scoreCloseout);
      const tieBreakPlan = selectMonthlyCapacityCandidateRankingTieBreakPlan(rankingPlan);
      const closeout = selectMonthlyCapacityCandidateRankingPlanningCloseout(rankingPlan, tieBreakPlan);
      const implementationPlan = selectMonthlyCapacityCandidateRankingImplementationPlan(closeout, tieBreakPlan);
      const readiness = selectMonthlyCapacityCandidateRankingImplementationExampleReadiness(card.id, implementationPlan);

      expect(readiness.status, card.id).toBe('readyForFutureImplementation');
      expect(readiness.scoreCount, card.id).toBeGreaterThan(0);
      expect(readiness.tieBreakRuleIds, card.id).toEqual(['floorCoverageFirst', 'lowerDisruption', 'taxSecondary', 'baselineAsReference', 'plainLanguageReview']);
      expect(readiness.boundary, card.id).toContain('without ordering candidates');
      expect(createPlanFile(plan).plan).not.toHaveProperty('monthlyCapacityCandidateRankingImplementationExampleReadiness');
    }
  });

  it('plans ranking implementation dry-run steps without ordered output', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, () => fixture);
    const scoringPlan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
    const scoreSet = selectMonthlyCapacityRuntimeScores(simulationSet, scoringPlan);
    const scoreCloseout = selectMonthlyCapacityRuntimeScoreCloseout(scoreSet);
    const rankingPlan = selectMonthlyCapacityCandidateRankingPlan(scoreSet, scoreCloseout);
    const tieBreakPlan = selectMonthlyCapacityCandidateRankingTieBreakPlan(rankingPlan);
    const closeout = selectMonthlyCapacityCandidateRankingPlanningCloseout(rankingPlan, tieBreakPlan);
    const implementationPlan = selectMonthlyCapacityCandidateRankingImplementationPlan(closeout, tieBreakPlan);
    const dryRun = selectMonthlyCapacityCandidateRankingImplementationDryRun(implementationPlan);

    expect(dryRun).toMatchObject({
      status: 'readyForFutureDryRun',
      scoreCount: 1,
      orderedCandidateIds: null,
      recommendationCandidateId: null,
      saved: false
    });
    expect(dryRun.steps.map((step) => step.id)).toEqual([
      'readRuntimeScores',
      'applyFloorFirstRule',
      'applyDisruptionRule',
      'applyTaxSecondaryRule',
      'keepBaselineReference',
      'returnRuntimeOnlyOrdering'
    ]);
    expect(dryRun.steps.every((step) => step.status === 'planned')).toBe(true);
    expect(dryRun.boundary).toContain('without producing ordered candidates');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityCandidateRankingImplementationDryRun');
  });

  it('blocks ranking implementation dry-run planning when readiness is blocked', () => {
    const scoreSet = {
      status: 'blocked' as const,
      rows: [],
      scoredVariantIds: [],
      boundary: 'Blocked test score set.'
    };
    const scoreCloseout = selectMonthlyCapacityRuntimeScoreCloseout(scoreSet);
    const rankingPlan = selectMonthlyCapacityCandidateRankingPlan(scoreSet, scoreCloseout);
    const tieBreakPlan = selectMonthlyCapacityCandidateRankingTieBreakPlan(rankingPlan);
    const closeout = selectMonthlyCapacityCandidateRankingPlanningCloseout(rankingPlan, tieBreakPlan);
    const implementationPlan = selectMonthlyCapacityCandidateRankingImplementationPlan(closeout, tieBreakPlan);
    const dryRun = selectMonthlyCapacityCandidateRankingImplementationDryRun(implementationPlan);

    expect(dryRun.status).toBe('blocked');
    expect(dryRun.steps.every((step) => step.status === 'blocked')).toBe(true);
    expect(dryRun.orderedCandidateIds).toBeNull();
    expect(dryRun.recommendationCandidateId).toBeNull();
  });

  it('audits ranking implementation dry-run planning so it cannot become output', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, () => fixture);
    const scoringPlan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
    const scoreSet = selectMonthlyCapacityRuntimeScores(simulationSet, scoringPlan);
    const scoreCloseout = selectMonthlyCapacityRuntimeScoreCloseout(scoreSet);
    const rankingPlan = selectMonthlyCapacityCandidateRankingPlan(scoreSet, scoreCloseout);
    const tieBreakPlan = selectMonthlyCapacityCandidateRankingTieBreakPlan(rankingPlan);
    const closeout = selectMonthlyCapacityCandidateRankingPlanningCloseout(rankingPlan, tieBreakPlan);
    const implementationPlan = selectMonthlyCapacityCandidateRankingImplementationPlan(closeout, tieBreakPlan);
    const dryRun = selectMonthlyCapacityCandidateRankingImplementationDryRun(implementationPlan);
    const audit = selectMonthlyCapacityCandidateRankingImplementationDryRunAudit(dryRun);

    expect(audit).toMatchObject({
      status: 'pass',
      plannedStepCount: 6,
      orderedCandidateCount: 0,
      recommendationCount: 0,
      savedOutputCount: 0
    });
    expect(audit.boundary).toContain('did not produce ordered candidates');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityCandidateRankingImplementationDryRunAudit');
  });

  it('summarizes ranking implementation planning without executing ordering', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, () => fixture);
    const scoringPlan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
    const scoreSet = selectMonthlyCapacityRuntimeScores(simulationSet, scoringPlan);
    const scoreCloseout = selectMonthlyCapacityRuntimeScoreCloseout(scoreSet);
    const rankingPlan = selectMonthlyCapacityCandidateRankingPlan(scoreSet, scoreCloseout);
    const tieBreakPlan = selectMonthlyCapacityCandidateRankingTieBreakPlan(rankingPlan);
    const planningCloseout = selectMonthlyCapacityCandidateRankingPlanningCloseout(rankingPlan, tieBreakPlan);
    const implementationPlan = selectMonthlyCapacityCandidateRankingImplementationPlan(planningCloseout, tieBreakPlan);
    const dryRun = selectMonthlyCapacityCandidateRankingImplementationDryRun(implementationPlan);
    const summary = selectMonthlyCapacityCandidateRankingImplementationSummary(implementationPlan, dryRun);

    expect(summary).toMatchObject({
      status: 'readyForPlanning',
      scoreCount: 1,
      plannedStepCount: 6,
      tieBreakRuleIds: ['floorCoverageFirst', 'lowerDisruption', 'taxSecondary', 'baselineAsReference', 'plainLanguageReview'],
      nextBroadStep: 'candidateRankingRuntimeExecution'
    });
    expect(summary.boundary).toContain('without ordering candidates');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityCandidateRankingImplementationSummary');
  });

  it('closes out ranking implementation planning for future runtime execution only', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, () => fixture);
    const scoringPlan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
    const scoreSet = selectMonthlyCapacityRuntimeScores(simulationSet, scoringPlan);
    const scoreCloseout = selectMonthlyCapacityRuntimeScoreCloseout(scoreSet);
    const rankingPlan = selectMonthlyCapacityCandidateRankingPlan(scoreSet, scoreCloseout);
    const tieBreakPlan = selectMonthlyCapacityCandidateRankingTieBreakPlan(rankingPlan);
    const planningCloseout = selectMonthlyCapacityCandidateRankingPlanningCloseout(rankingPlan, tieBreakPlan);
    const implementationPlan = selectMonthlyCapacityCandidateRankingImplementationPlan(planningCloseout, tieBreakPlan);
    const contract = selectMonthlyCapacityCandidateRankingImplementationContract(implementationPlan);
    const readiness = selectMonthlyCapacityCandidateRankingImplementationReadiness(implementationPlan);
    const dryRun = selectMonthlyCapacityCandidateRankingImplementationDryRun(implementationPlan, readiness);
    const closeout = selectMonthlyCapacityCandidateRankingImplementationCloseout(implementationPlan, contract, readiness, dryRun);

    expect(closeout).toMatchObject({
      status: 'readyForRuntimeExecution',
      nextBroadStep: 'candidateRankingRuntimeExecution',
      completedPieces: ['implementationPlan', 'contract', 'guardrails', 'readiness', 'dryRunPlan', 'dryRunAudit', 'exampleMatrix', 'summary']
    });
    expect(closeout.stillDeferred).toContain('candidateRanking');
    expect(closeout.stillDeferred).toContain('recommendations');
    expect(closeout.boundary).toContain('no candidate ordering');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityCandidateRankingImplementationCloseout');
  });

  it('blocks ranking implementation closeout when dry-run audit blocks', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, () => fixture);
    const scoringPlan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
    const scoreSet = selectMonthlyCapacityRuntimeScores(simulationSet, scoringPlan);
    const scoreCloseout = selectMonthlyCapacityRuntimeScoreCloseout(scoreSet);
    const rankingPlan = selectMonthlyCapacityCandidateRankingPlan(scoreSet, scoreCloseout);
    const tieBreakPlan = selectMonthlyCapacityCandidateRankingTieBreakPlan(rankingPlan);
    const planningCloseout = selectMonthlyCapacityCandidateRankingPlanningCloseout(rankingPlan, tieBreakPlan);
    const implementationPlan = selectMonthlyCapacityCandidateRankingImplementationPlan(planningCloseout, tieBreakPlan);
    const contract = selectMonthlyCapacityCandidateRankingImplementationContract(implementationPlan);
    const readiness = selectMonthlyCapacityCandidateRankingImplementationReadiness(implementationPlan);
    const dryRun = {
      ...selectMonthlyCapacityCandidateRankingImplementationDryRun(implementationPlan, readiness),
      orderedCandidateIds: [] as unknown as null
    };
    const audit = selectMonthlyCapacityCandidateRankingImplementationDryRunAudit(dryRun);
    const closeout = selectMonthlyCapacityCandidateRankingImplementationCloseout(implementationPlan, contract, readiness, dryRun, audit);

    expect(audit.status).toBe('block');
    expect(closeout.status).toBe('blocked');
    expect(closeout.nextBroadStep).toBe('capacityInputsFirst');
    expect(closeout.headline).toContain('needs clean runtime-only prerequisites');
  });

  it('closes out the candidate ranking implementation planning package', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, () => fixture);
    const scoringPlan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
    const scoreSet = selectMonthlyCapacityRuntimeScores(simulationSet, scoringPlan);
    const scoreCloseout = selectMonthlyCapacityRuntimeScoreCloseout(scoreSet);
    const rankingPlan = selectMonthlyCapacityCandidateRankingPlan(scoreSet, scoreCloseout);
    const tieBreakPlan = selectMonthlyCapacityCandidateRankingTieBreakPlan(rankingPlan);
    const planningCloseout = selectMonthlyCapacityCandidateRankingPlanningCloseout(rankingPlan, tieBreakPlan);
    const implementationPlan = selectMonthlyCapacityCandidateRankingImplementationPlan(planningCloseout, tieBreakPlan);
    const contract = selectMonthlyCapacityCandidateRankingImplementationContract(implementationPlan);
    const readiness = selectMonthlyCapacityCandidateRankingImplementationReadiness(implementationPlan);
    const dryRun = selectMonthlyCapacityCandidateRankingImplementationDryRun(implementationPlan, readiness);
    const closeout = selectMonthlyCapacityCandidateRankingImplementationCloseout(implementationPlan, contract, readiness, dryRun);
    const packageCloseout = selectMonthlyCapacityCandidateRankingImplementationPackageCloseout(closeout);

    expect(packageCloseout).toMatchObject({
      status: 'complete',
      package: 'candidateRankingImplementationPlanning',
      completedSprints: 'S1567-S1586',
      nextBroadStep: 'candidateRankingRuntimeExecution'
    });
    expect(packageCloseout.stillDeferred).toContain('candidateRanking');
    expect(packageCloseout.stillDeferred).toContain('recommendations');
    expect(packageCloseout.boundary).toContain('without candidate ordering');
    expect(packageCloseout.boundary).toContain('implementation plan, contract, guardrails, readiness, dry-run plan, dry-run audit, examples, summary, and closeout are complete');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityCandidateRankingImplementationPackageCloseout');
  });

  it('orders runtime candidate score evidence without recommending a candidate', () => {
    const shortfallResult = withRows([
      { ...fixture.years[0], shortfall: 0, totalAftaxYear: 70000, bal_total: 200000 },
      { ...fixture.years[1], shortfall: 10000, totalAftaxYear: 71470, bal_total: 0 }
    ]);
    const runtime = buildMonthlyCandidateRuntime(shortfallResult, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, (plan) =>
      withRows([
        {
          year: 2028,
          shortfall: plan.spending.gogo === 70000 && plan.assumptions.retireYear === 2028 ? 5000 : 0,
          totalTaxYear: 1000,
          bal_total: 300000
        },
        { year: 2029, shortfall: 0, totalTaxYear: 2000, bal_total: 250000 }
      ])
    );
    const scoringPlan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
    const scoreSet = selectMonthlyCapacityRuntimeScores(simulationSet, scoringPlan);
    const scoreCloseout = selectMonthlyCapacityRuntimeScoreCloseout(scoreSet);
    const rankingPlan = selectMonthlyCapacityCandidateRankingPlan(scoreSet, scoreCloseout);
    const tieBreakPlan = selectMonthlyCapacityCandidateRankingTieBreakPlan(rankingPlan);
    const planningCloseout = selectMonthlyCapacityCandidateRankingPlanningCloseout(rankingPlan, tieBreakPlan);
    const implementationPlan = selectMonthlyCapacityCandidateRankingImplementationPlan(planningCloseout, tieBreakPlan);
    const contract = selectMonthlyCapacityCandidateRankingImplementationContract(implementationPlan);
    const readiness = selectMonthlyCapacityCandidateRankingImplementationReadiness(implementationPlan);
    const dryRun = selectMonthlyCapacityCandidateRankingImplementationDryRun(implementationPlan, readiness);
    const implementationCloseout = selectMonthlyCapacityCandidateRankingImplementationCloseout(implementationPlan, contract, readiness, dryRun);
    const ranking = selectMonthlyCapacityCandidateRuntimeRanking(scoreSet, implementationCloseout);

    expect(ranking).toMatchObject({
      status: 'ready',
      orderedCandidateIds: ['spendingRepairSmall', 'workLaterOneYear', 'spendingRepairLarge', 'workLaterTwoYears', 'baseline'],
      recommendationCandidateId: null,
      saved: false,
      fundingTrace: null,
      accountInstruction: null,
      annualSequencing: null,
      uiPresentation: null
    });
    expect(ranking.orderedRows.map((row) => row.ordinal)).toEqual([1, 2, 3, 4, 5]);
    expect(ranking.orderedRows.every((row) => row.recommendationEligible === false && row.saved === false)).toBe(true);
    expect(ranking.boundary).toContain('without recommendations');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityCandidateRuntimeRanking');
  });

  it('blocks runtime candidate ranking when implementation closeout is blocked', () => {
    const scoreSet = {
      status: 'blocked' as const,
      rows: [],
      scoredVariantIds: [],
      boundary: 'Blocked test score set.'
    };
    const scoreCloseout = selectMonthlyCapacityRuntimeScoreCloseout(scoreSet);
    const rankingPlan = selectMonthlyCapacityCandidateRankingPlan(scoreSet, scoreCloseout);
    const tieBreakPlan = selectMonthlyCapacityCandidateRankingTieBreakPlan(rankingPlan);
    const planningCloseout = selectMonthlyCapacityCandidateRankingPlanningCloseout(rankingPlan, tieBreakPlan);
    const implementationPlan = selectMonthlyCapacityCandidateRankingImplementationPlan(planningCloseout, tieBreakPlan);
    const contract = selectMonthlyCapacityCandidateRankingImplementationContract(implementationPlan);
    const readiness = selectMonthlyCapacityCandidateRankingImplementationReadiness(implementationPlan);
    const dryRun = selectMonthlyCapacityCandidateRankingImplementationDryRun(implementationPlan, readiness);
    const implementationCloseout = selectMonthlyCapacityCandidateRankingImplementationCloseout(implementationPlan, contract, readiness, dryRun);
    const ranking = selectMonthlyCapacityCandidateRuntimeRanking(scoreSet, implementationCloseout);

    expect(ranking.status).toBe('blocked');
    expect(ranking.orderedRows).toEqual([]);
    expect(ranking.orderedCandidateIds).toEqual([]);
    expect(ranking.recommendationCandidateId).toBeNull();
  });

  it('audits runtime candidate ranking so ordered evidence stays non-advisory', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, () => fixture);
    const scoringPlan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
    const scoreSet = selectMonthlyCapacityRuntimeScores(simulationSet, scoringPlan);
    const scoreCloseout = selectMonthlyCapacityRuntimeScoreCloseout(scoreSet);
    const rankingPlan = selectMonthlyCapacityCandidateRankingPlan(scoreSet, scoreCloseout);
    const tieBreakPlan = selectMonthlyCapacityCandidateRankingTieBreakPlan(rankingPlan);
    const planningCloseout = selectMonthlyCapacityCandidateRankingPlanningCloseout(rankingPlan, tieBreakPlan);
    const implementationPlan = selectMonthlyCapacityCandidateRankingImplementationPlan(planningCloseout, tieBreakPlan);
    const contract = selectMonthlyCapacityCandidateRankingImplementationContract(implementationPlan);
    const readiness = selectMonthlyCapacityCandidateRankingImplementationReadiness(implementationPlan);
    const dryRun = selectMonthlyCapacityCandidateRankingImplementationDryRun(implementationPlan, readiness);
    const implementationCloseout = selectMonthlyCapacityCandidateRankingImplementationCloseout(implementationPlan, contract, readiness, dryRun);
    const ranking = selectMonthlyCapacityCandidateRuntimeRanking(scoreSet, implementationCloseout);
    const audit = selectMonthlyCapacityCandidateRuntimeRankingAudit(ranking);

    expect(audit).toMatchObject({
      status: 'pass',
      orderedCandidateCount: 1,
      recommendationCount: 0,
      savedOutputCount: 0,
      traceCount: 0,
      instructionCount: 0,
      annualSequencingCount: 0,
      uiPresentationCount: 0
    });
    expect(audit.boundary).toContain('did not become a recommendation');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityCandidateRuntimeRankingAudit');
  });

  it('summarizes runtime candidate ranking without selecting a recommendation', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, () => fixture);
    const scoringPlan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
    const scoreSet = selectMonthlyCapacityRuntimeScores(simulationSet, scoringPlan);
    const scoreCloseout = selectMonthlyCapacityRuntimeScoreCloseout(scoreSet);
    const rankingPlan = selectMonthlyCapacityCandidateRankingPlan(scoreSet, scoreCloseout);
    const tieBreakPlan = selectMonthlyCapacityCandidateRankingTieBreakPlan(rankingPlan);
    const planningCloseout = selectMonthlyCapacityCandidateRankingPlanningCloseout(rankingPlan, tieBreakPlan);
    const implementationPlan = selectMonthlyCapacityCandidateRankingImplementationPlan(planningCloseout, tieBreakPlan);
    const contract = selectMonthlyCapacityCandidateRankingImplementationContract(implementationPlan);
    const readiness = selectMonthlyCapacityCandidateRankingImplementationReadiness(implementationPlan);
    const dryRun = selectMonthlyCapacityCandidateRankingImplementationDryRun(implementationPlan, readiness);
    const implementationCloseout = selectMonthlyCapacityCandidateRankingImplementationCloseout(implementationPlan, contract, readiness, dryRun);
    const ranking = selectMonthlyCapacityCandidateRuntimeRanking(scoreSet, implementationCloseout);
    const summary = selectMonthlyCapacityCandidateRuntimeRankingSummary(ranking);

    expect(summary).toMatchObject({
      status: 'ready',
      orderedCandidateIds: ['baseline'],
      topCandidateId: 'baseline',
      baselineOrdinal: 1,
      orderedCandidateCount: 1,
      recommendationCandidateId: null
    });
    expect(summary.boundary).toContain('without selecting a recommendation');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityCandidateRuntimeRankingSummary');
  });

  it('runs clean examples through runtime candidate ranking readiness', () => {
    const runtimeRowsByExample: Record<string, SimulationResult> = {
      singleMinimumFloor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 43200, spending: 43200, bal_total: 500000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 43200, spending: 43200, bal_total: 450000 }
      ]),
      coupleTightFloor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 96000, spending: 96000, bal_total: 200000 },
        { ...fixture.years[1], shortfall: 12000, totalAftaxYear: 96000, spending: 96000, bal_total: 0 }
      ]),
      pensionCoupleSurvivor: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 64800, spending: 64800, bal_total: 600000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 64800, spending: 64800, bal_total: 500000 }
      ]),
      estateHeavyRoom: withRows([
        { ...fixture.years[0], shortfall: 0, totalAftaxYear: 84000, spending: 84000, bal_total: 6000000 },
        { ...fixture.years[1], shortfall: 0, totalAftaxYear: 84000, spending: 84000, bal_total: 7000000 }
      ])
    };

    for (const card of cleanExamplePlanCards) {
      const plan = { ...createCleanExampleRuntimePlan(card.id), inheritance: 0 };
      const result = runtimeRowsByExample[card.id];
      const answer = selectRetirementAnswerSummary(result, plan);
      const spending = selectSpendingCapacitySummary(result, {}, plan, answer);
      const packet = selectMonthlyCapacityRuntimePacket(result, plan, spending);
      const handoff = selectMonthlyCapacityOptimizerHandoff(packet);
      const gateStatus: 'blocked' | 'reviewOnly' = handoff.status === 'blocked' ? 'blocked' : 'reviewOnly';
      const gate = {
        status: gateStatus,
        headline: 'Example runtime ranking readiness gate',
        requiredBeforeExecution: ['keepOutputRuntimeOnly', 'defineCandidateScoring', 'preserveNoAnnualSequencing'] as Array<
          'keepOutputRuntimeOnly' | 'defineCandidateScoring' | 'preserveNoAnnualSequencing'
        >,
        allowedNow: ['runtimeEvidence', 'tests', 'docs', 'boundedReviewOnly'] as Array<'runtimeEvidence' | 'tests' | 'docs' | 'boundedReviewOnly'>,
        notAllowedYet: ['optimizerSearch', 'savedOptimizerOutput', 'fundingTrace', 'accountInstructions', 'annualAccountSequencing'] as Array<
          'optimizerSearch' | 'savedOptimizerOutput' | 'fundingTrace' | 'accountInstructions' | 'annualAccountSequencing'
        >,
        boundary: 'Test-only runtime ranking readiness gate for example matrix coverage.'
      };
      const inputs = selectMonthlyCapacityCandidateScoreInputs(packet, handoff);
      const policy = selectMonthlyCapacityCandidateScorePolicy(selectMonthlyCapacityScoringRubric(gate), inputs);
      const candidateSet = selectMonthlyCapacityCandidateSetPlan(inputs, policy);
      const limits = selectMonthlyCapacityCandidateSetLimits(candidateSet);
      const builderPlan = selectMonthlyCapacityCandidateBuilderPlan(candidateSet, limits);
      const contract = selectMonthlyCapacityCandidateBuilderInputContract(packet, builderPlan, limits);
      const order = selectMonthlyCapacityCandidateBuilderOrder(builderPlan, contract);
      const dryRun = selectMonthlyCapacityCandidateBuilderDryRun(builderPlan, order);
      const runtimeGate = selectMonthlyCapacityCandidateBuilderRuntimeGate(
        contract,
        order,
        selectMonthlyCapacityCandidateBuilderDryRunAudit(dryRun)
      );
      const variants = selectMonthlyCapacityRuntimeCandidateVariants(plan, builderPlan, order, runtimeGate);
      const simulationHandoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(variants);
      const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(variants, simulationHandoff, () => result);
      const scoringPlan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
      const scoreSet = selectMonthlyCapacityRuntimeScores(simulationSet, scoringPlan);
      const scoreCloseout = selectMonthlyCapacityRuntimeScoreCloseout(scoreSet);
      const rankingPlan = selectMonthlyCapacityCandidateRankingPlan(scoreSet, scoreCloseout);
      const tieBreakPlan = selectMonthlyCapacityCandidateRankingTieBreakPlan(rankingPlan);
      const planningCloseout = selectMonthlyCapacityCandidateRankingPlanningCloseout(rankingPlan, tieBreakPlan);
      const implementationPlan = selectMonthlyCapacityCandidateRankingImplementationPlan(planningCloseout, tieBreakPlan);
      const contractPlan = selectMonthlyCapacityCandidateRankingImplementationContract(implementationPlan);
      const readiness = selectMonthlyCapacityCandidateRankingImplementationReadiness(implementationPlan);
      const implementationDryRun = selectMonthlyCapacityCandidateRankingImplementationDryRun(implementationPlan, readiness);
      const implementationCloseout = selectMonthlyCapacityCandidateRankingImplementationCloseout(
        implementationPlan,
        contractPlan,
        readiness,
        implementationDryRun
      );
      const ranking = selectMonthlyCapacityCandidateRuntimeRanking(scoreSet, implementationCloseout);
      const exampleReadiness = selectMonthlyCapacityCandidateRuntimeRankingExampleReadiness(card.id, ranking);

      expect(exampleReadiness.status, card.id).toBe('ready');
      expect(exampleReadiness.orderedCandidateIds.length, card.id).toBeGreaterThan(0);
      expect(exampleReadiness.recommendationCandidateId, card.id).toBeNull();
      expect(exampleReadiness.boundary, card.id).toContain('without recommendations');
      expect(createPlanFile(plan).plan).not.toHaveProperty('monthlyCapacityCandidateRuntimeRankingExampleReadiness');
    }
  });

  it('closes out runtime candidate ranking while deferring recommendations', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, () => fixture);
    const scoringPlan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
    const scoreSet = selectMonthlyCapacityRuntimeScores(simulationSet, scoringPlan);
    const scoreCloseout = selectMonthlyCapacityRuntimeScoreCloseout(scoreSet);
    const rankingPlan = selectMonthlyCapacityCandidateRankingPlan(scoreSet, scoreCloseout);
    const tieBreakPlan = selectMonthlyCapacityCandidateRankingTieBreakPlan(rankingPlan);
    const planningCloseout = selectMonthlyCapacityCandidateRankingPlanningCloseout(rankingPlan, tieBreakPlan);
    const implementationPlan = selectMonthlyCapacityCandidateRankingImplementationPlan(planningCloseout, tieBreakPlan);
    const contract = selectMonthlyCapacityCandidateRankingImplementationContract(implementationPlan);
    const readiness = selectMonthlyCapacityCandidateRankingImplementationReadiness(implementationPlan);
    const dryRun = selectMonthlyCapacityCandidateRankingImplementationDryRun(implementationPlan, readiness);
    const implementationCloseout = selectMonthlyCapacityCandidateRankingImplementationCloseout(implementationPlan, contract, readiness, dryRun);
    const ranking = selectMonthlyCapacityCandidateRuntimeRanking(scoreSet, implementationCloseout);
    const closeout = selectMonthlyCapacityCandidateRuntimeRankingCloseout(ranking);

    expect(closeout).toMatchObject({
      status: 'complete',
      nextBroadStep: 'recommendationPlanning',
      completedPieces: ['runtimeOrdering', 'rankingAudit', 'rankingSummary', 'exampleMatrix', 'noRecommendationBoundary', 'noPersistenceBoundary']
    });
    expect(closeout.stillDeferred).toEqual([
      'recommendations',
      'optimizerSearch',
      'savedOptimizerOutput',
      'fundingTrace',
      'accountInstructions',
      'annualAccountSequencing',
      'uiPresentation'
    ]);
    expect(closeout.boundary).toContain('recommendations');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityCandidateRuntimeRankingCloseout');
  });

  it('closes out the candidate ranking runtime execution package', () => {
    const runtime = buildMonthlyCandidateRuntime(fixture, planFixture);
    const handoff = selectMonthlyCapacityRuntimeCandidateSimulationHandoff(runtime.variants);
    const simulationSet = selectMonthlyCapacityRuntimeCandidateSimulations(runtime.variants, handoff, () => fixture);
    const scoringPlan = selectMonthlyCapacityScoringExecutionPlan(simulationSet);
    const scoreSet = selectMonthlyCapacityRuntimeScores(simulationSet, scoringPlan);
    const scoreCloseout = selectMonthlyCapacityRuntimeScoreCloseout(scoreSet);
    const rankingPlan = selectMonthlyCapacityCandidateRankingPlan(scoreSet, scoreCloseout);
    const tieBreakPlan = selectMonthlyCapacityCandidateRankingTieBreakPlan(rankingPlan);
    const planningCloseout = selectMonthlyCapacityCandidateRankingPlanningCloseout(rankingPlan, tieBreakPlan);
    const implementationPlan = selectMonthlyCapacityCandidateRankingImplementationPlan(planningCloseout, tieBreakPlan);
    const contract = selectMonthlyCapacityCandidateRankingImplementationContract(implementationPlan);
    const readiness = selectMonthlyCapacityCandidateRankingImplementationReadiness(implementationPlan);
    const dryRun = selectMonthlyCapacityCandidateRankingImplementationDryRun(implementationPlan, readiness);
    const implementationCloseout = selectMonthlyCapacityCandidateRankingImplementationCloseout(implementationPlan, contract, readiness, dryRun);
    const ranking = selectMonthlyCapacityCandidateRuntimeRanking(scoreSet, implementationCloseout);
    const closeout = selectMonthlyCapacityCandidateRuntimeRankingCloseout(ranking);
    const packageCloseout = selectMonthlyCapacityCandidateRuntimeRankingPackageCloseout(closeout);

    expect(packageCloseout).toMatchObject({
      status: 'complete',
      package: 'candidateRankingRuntimeExecution',
      completedSprints: 'S1587-S1606',
      nextBroadStep: 'recommendationPlanning'
    });
    expect(packageCloseout.stillDeferred).toContain('recommendations');
    expect(packageCloseout.boundary).toContain('without recommendations');
    expect(createPlanFile(planFixture).plan).not.toHaveProperty('monthlyCapacityCandidateRuntimeRankingPackageCloseout');
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
