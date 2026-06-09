import { describe, expect, it } from 'vitest';
import { createBlankPlan } from '../data/defaultPlan';
import { createExamplePlan, examplePlanCards } from '../data/examplePlans';
import { createPlanFile, extractPlanPayload } from '../data/planFile';
import type { SimulationResult, V2PlanPayload } from '../types/plan';
import {
  buildBoundedOptimizerCandidates,
  runBoundedOptimizer,
  selectOptimizerExperimentalDraftExampleMatrix,
  selectOptimizerAnnualSequencingPrepContract,
  selectOptimizerCapacityObjective,
  selectOptimizerCapacityExportGuard,
  selectOptimizerCapacityReportReadiness,
  selectOptimizerCapacityStatus,
  selectOptimizerMinimumAnnualExpenseFloor,
  type BoundedOptimizerCandidateId
} from './boundedOptimizer';
import type { SimulationConfig } from './runSimulation';

function readyPlan(): V2PlanPayload {
  const plan = createBlankPlan();
  plan.title = 'Bounded optimizer test';
  plan.p1 = {
    ...plan.p1,
    name: 'Alex',
    dob: 1968,
    retireYear: 2032,
    salary: 90000,
    rrsp: 250000,
    tfsa: 90000,
    nonreg: 60000,
    cpp65_monthly: 1200,
    cpp70_monthly: 1700,
    oas_monthly: 742
  };
  plan.spending.gogo = 85000;
  plan.spending.slowgo = 72000;
  plan.spending.nogo = 62000;
  plan.assumptions.retireYear = 2032;
  plan.assumptions.planEnd = 2065;
  plan.assumptions.withdrawalOrder = 'default';
  return plan;
}

function cppSharingPlan(): V2PlanPayload {
  const plan = readyPlan();
  plan.p1.oas_monthly = 0;
  plan.p1.rrsp = 0;
  plan.p1.lira = 0;
  plan.p1.lif = 0;
  plan.p1.tfsa = 160000;
  plan.p1.nonreg = 180000;
  plan.p1.db_after65 = 0;
  plan.p1.db_before65 = 0;
  plan.p2 = {
    ...plan.p2,
    name: 'Morgan',
    dob: 1969,
    retireYear: 2033,
    rrsp: 0,
    lira: 0,
    lif: 0,
    tfsa: 110000,
    nonreg: 90000,
    cpp65_monthly: 900,
    cpp70_monthly: 1250,
    oas_monthly: 742
  };
  plan.assumptions.cppSharing = false;
  plan.assumptions.p1DiesInSurvivor = 2040;
  return plan;
}

function downsizePlan(): V2PlanPayload {
  const plan = readyPlan();
  plan.p1.oas_monthly = 0;
  plan.downsize = { year: 2040, netProceeds: 250000 };
  return plan;
}

function result(
  endPortfolio: number,
  lifetimeTax: number,
  firstShortfallYear: number | null = null,
  options: { oasRecovery?: number; registeredDraw?: number; tfsaDraw?: number; nonregDraw?: number; cashDraw?: number } = {}
): SimulationResult {
  const years = [2032, 2033, 2034].map((year, index) => ({
    year,
    ageF: 64 + index,
    ageM: 0,
    spending: 85000,
    grossIncome: 90000,
    dbPension: 0,
    cpp_f: 0,
    oas_f: 0,
    rrif_draw_f: options.registeredDraw || 0,
    tfsa_draw: options.tfsaDraw || 0,
    nonreg_draw: options.nonregDraw || 0,
    cash_draw: options.cashDraw || 0,
    totalTaxYear: Math.round(lifetimeTax / 3),
    taxableIncome: 90000,
    totalOasClawY: Math.round((options.oasRecovery || 0) / 3),
    totalAftaxYear: 85000,
    cashFlow: 0,
    shortfall: firstShortfallYear === year ? 5000 : 0,
    bal_rrsp: 0,
    bal_tfsa: 0,
    bal_lif: 0,
    bal_nonreg: 0,
    bal_cash: 0,
    bal_total: index === 2 ? endPortfolio : endPortfolio + (2 - index) * 10000
  }));
  return { years, totalTax: lifetimeTax } as SimulationResult;
}

describe('bounded optimizer runner', () => {
  it('normalizes capacity objective status and minimum floor without running optimizer candidates', () => {
    const plan = readyPlan();
    plan.spending.gogo = 90000;
    plan.spending.slowgo = 66000;
    plan.spending.nogo = 54000;

    expect(selectOptimizerMinimumAnnualExpenseFloor(plan)).toBe(54000);
    expect(selectOptimizerCapacityStatus(7000, 4500)).toBe('covered');
    expect(selectOptimizerCapacityStatus(4600, 4500)).toBe('tight');
    expect(selectOptimizerCapacityStatus(4300, 4500)).toBe('gap');
    expect(selectOptimizerCapacityStatus(null, 4500)).toBe('cannotTell');
    expect(selectOptimizerCapacityStatus(7000, null)).toBe('cannotTell');
  });

  it('builds copy-safe runtime capacity objective rows without saved output or account instructions', () => {
    const objective = selectOptimizerCapacityObjective({
      contractReady: true,
      selectedCandidateId: 'benefitGridCpp70Oas70',
      selectedCandidateLabel: 'Test CPP/OAS at 70',
      sustainableAnnualSpend: 78000,
      annualExpenseFloor: 60000,
      estateTarget: 250000,
      projectedEstate: 260000,
      hasSecondPerson: true,
      survivorNeedsReview: true,
      benefitTimingStatus: 'included'
    });

    expect(objective).toMatchObject({
      status: 'covered',
      selectedCandidateId: 'benefitGridCpp70Oas70',
      monthlyAfterTaxCapacity: 6500,
      minimumMonthlyExpenseFloor: 5000,
      optionalMonthlyRoom: 1500,
      survivorConstraint: 'reviewFirst',
      timingComparison: 'included',
      withdrawalSequencing: 'deferred'
    });
    expect(objective.rows.find((row) => row.id === 'estate')).toMatchObject({ status: 'protected' });
    expect(objective.rows.find((row) => row.id === 'survivor')).toMatchObject({
      status: 'review',
      detail: expect.stringContaining('survivor scenario year')
    });
    expect(objective.rows.find((row) => row.id === 'withdrawalSequencing')).toMatchObject({
      status: 'deferred',
      detail: expect.stringContaining('Annual account-level sequencing remains deferred')
    });
    const combinedCopy = [objective.detail, objective.boundary, ...objective.rows.map((row) => row.detail)].join(' ');
    expect(combinedCopy).toContain('runtime-only');
    expect(combinedCopy).not.toContain('withdraw from this account');
    expect(combinedCopy).not.toContain('take CPP at');
    expect(combinedCopy).not.toContain('claim OAS at');
    expect(combinedCopy).not.toContain('save optimizer');
  });

  it('keeps selector-built capacity objective blocked when the optimizer contract is not ready', () => {
    const objective = selectOptimizerCapacityObjective({
      contractReady: false,
      selectedCandidateId: null,
      selectedCandidateLabel: '',
      sustainableAnnualSpend: 80000,
      annualExpenseFloor: 60000,
      estateTarget: null,
      projectedEstate: 100000,
      hasSecondPerson: false,
      survivorNeedsReview: false,
      benefitTimingStatus: 'blocked'
    });

    expect(objective).toMatchObject({
      status: 'blocked',
      selectedCandidateLabel: 'No runtime capacity candidate',
      survivorConstraint: 'notApplicable',
      timingComparison: 'blocked'
    });
    expect(objective.rows.find((row) => row.id === 'minimumFloor')).toMatchObject({ status: 'blocked' });
  });

  it('prepares capacity objective report readiness without changing report output or saved data', () => {
    const objective = selectOptimizerCapacityObjective({
      contractReady: true,
      selectedCandidateId: 'baseline',
      selectedCandidateLabel: 'Current plan',
      sustainableAnnualSpend: 84000,
      annualExpenseFloor: 60000,
      estateTarget: 200000,
      projectedEstate: 240000,
      hasSecondPerson: false,
      survivorNeedsReview: false,
      benefitTimingStatus: 'included'
    });
    const readiness = selectOptimizerCapacityReportReadiness(objective);

    expect(readiness).toMatchObject({
      status: 'readyForLaterReport',
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
      boundary: expect.stringContaining('does not change printable report output')
    });
    expect(readiness.rows.find((row) => row.id === 'capacitySummary')).toMatchObject({ status: 'ready' });
    expect(readiness.rows.find((row) => row.id === 'taxContext')).toMatchObject({
      status: 'deferred',
      detail: expect.stringContaining('annual result rows')
    });
    expect(readiness.rows.find((row) => row.id === 'savedOutput')).toMatchObject({
      status: 'deferred',
      detail: expect.stringContaining('Do not save')
    });
    expect(readiness.rows.find((row) => row.id === 'accountInstructions')).toMatchObject({
      status: 'deferred',
      detail: expect.stringContaining('Do not turn report readiness into account-level withdrawal instructions')
    });
  });

  it('blocks capacity report readiness when capacity objective inputs are incomplete', () => {
    const readiness = selectOptimizerCapacityReportReadiness(
      selectOptimizerCapacityObjective({
        contractReady: false,
        selectedCandidateId: null,
        selectedCandidateLabel: '',
        sustainableAnnualSpend: null,
        annualExpenseFloor: null,
        estateTarget: null,
        projectedEstate: null,
        hasSecondPerson: false,
        survivorNeedsReview: false,
        benefitTimingStatus: null
      })
    );

    expect(readiness.status).toBe('needsInputs');
    expect(readiness.rows.find((row) => row.id === 'capacitySummary')).toMatchObject({ status: 'blocked' });
    expect(readiness.nextStep).toContain('Plan report rendering separately');
  });

  it('keeps capacity objective export guard focused on blocking saved optimizer packets', () => {
    const guard = selectOptimizerCapacityExportGuard();

    expect(guard).toMatchObject({
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
      boundary: expect.stringContaining('runtime-only')
    });
    expect(guard.rows.find((row) => row.id === 'planFile')).toMatchObject({
      status: 'blocked',
      detail: expect.stringContaining('must not be written into saved plan files')
    });
    expect(guard.rows.find((row) => row.id === 'reportOutput')).toMatchObject({ status: 'deferred' });
    expect(guard.rows.find((row) => row.id === 'csvOutput')).toMatchObject({ status: 'deferred' });
    expect(guard.rows.find((row) => row.id === 'schemaBoundary')).toMatchObject({ status: 'blocked' });
  });

  it('defines annual sequencing prep as an input-only runtime contract', () => {
    const objective = selectOptimizerCapacityObjective({
      contractReady: true,
      selectedCandidateId: 'benefitGridCpp70Oas70',
      selectedCandidateLabel: 'Test CPP/OAS at 70',
      sustainableAnnualSpend: 78000,
      annualExpenseFloor: 60000,
      estateTarget: 250000,
      projectedEstate: 260000,
      hasSecondPerson: true,
      survivorNeedsReview: true,
      benefitTimingStatus: 'included'
    });
    const contract = selectOptimizerAnnualSequencingPrepContract(objective);

    expect(contract).toMatchObject({
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
      boundary: expect.stringContaining('does not implement annual account-level sequencing')
    });
    expect(contract.rows.find((row) => row.id === 'capacityObjective')).toMatchObject({ status: 'ready' });
    expect(contract.rows.find((row) => row.id === 'estateSurvivorConstraints')).toMatchObject({ status: 'deferred' });
    expect(contract.rows.find((row) => row.id === 'outputBoundary')).toMatchObject({
      status: 'blocked',
      detail: expect.stringContaining('blocks annual account instructions')
    });
    expect(JSON.stringify(contract).toLowerCase()).not.toContain('withdraw from this account');
    expect(JSON.stringify(contract).toLowerCase()).not.toContain('withdraw $');
  });

  it('scores experimental draft example matrix readiness without creating export output', () => {
    const matrix = selectOptimizerExperimentalDraftExampleMatrix([
      {
        id: 'ready-example',
        label: 'Ready example',
        draft: {
          status: 'draftReady',
          audience: 'syntheticTesterOnly',
          sourceCandidateId: 'baseline',
          sourceCandidateLabel: 'Current plan',
          yearCount: 3,
          rows: [],
          annualAccountTotals: [],
          annualInstructionCandidates: [],
          candidateSelectionSummary: {
            status: 'readyForTesterReview',
            strongestCandidateYears: [],
            qualityCounts: { higher: 0, medium: 0, low: 0, blocked: 0 },
            repairThemes: [],
            summary: 'Annual instruction candidates are ready for synthetic tester review.',
            boundary: 'Runtime-only.',
            nextStep: 'Review.'
          },
          presentationReadiness: {
            status: 'readyForTesterReview',
            displayRows: [],
            rows: [],
            summary: 'Annual candidate summaries are ready for synthetic tester review.',
            boundary: 'Runtime-only.',
            nextStep: 'Review.'
          },
          testerPacketBoundary: {
            status: 'readyForSyntheticTesterPacket',
            visibleSections: ['candidateDisplayRows', 'qualityLabels', 'repairThemes', 'runtimeBoundary'],
            hiddenSections: ['savedSequencingOutput', 'csvSequencingOutput', 'reportOutput', 'productionUi', 'taxBracketInstructions', 'finalAnnualInstructions'],
            rows: [],
            testerCopy: {
              headline: 'Experimental annual candidate review',
              purpose: 'Use this runtime packet to test made-up scenarios.',
              boundary: 'Not a retirement plan.'
            },
            blockedOutputs: ['finalAnnualInstructions', 'savedSequencingOutput', 'csvSequencingOutput', 'reportOutput', 'productionUi', 'taxBracketInstructions'],
            summary: 'Synthetic tester packet boundary is ready for runtime review.',
            nextStep: 'Review.'
          },
          testerPacketExportGuard: {
            status: 'guarded',
            rows: [],
            forbiddenSavedKeys: [
              'testerPacketBoundary',
              'testerPacketExportGuard',
              'annualInstructionCandidates',
              'candidateSelectionSummary',
              'presentationReadiness',
              'experimentalAnnualInstructionDraft',
              'annualAccountInstructions'
            ],
            blockedOutputs: ['savedSequencingOutput', 'csvSequencingOutput', 'reportOutput', 'productionUi', 'taxBracketInstructions', 'finalAnnualInstructions'],
            summary: 'Tester packet export guard keeps synthetic review content runtime-only.',
            boundary: 'Runtime-only.',
            nextStep: 'Review.'
          },
          instructionReadiness: {
            status: 'readyForReview',
            rows: [],
            totalDraftAmount: 0,
            yearCount: 0,
            blockedOutputs: ['annualAccountInstructions', 'savedInstructionOutput', 'csvInstructionOutput', 'reportInstructionOutput', 'taxBracketInstructions', 'productionUi'],
            summary: 'Runtime annual account totals are ready for synthetic tester review.',
            boundary: 'Runtime-only.',
            nextStep: 'Review.'
          },
          taxContextRows: [],
          confidence: {
            level: 'higher',
            score: 12,
            rows: [],
            blockers: [],
            summary: 'Draft confidence is higher for synthetic tester review.'
          },
          harmChecks: [],
          readinessSummary: {
            status: 'readyForTesterReview',
            headline: 'Experimental draft is ready for synthetic tester review.',
            rowCoverage: { draftRows: 4, modelledYears: 3 },
            confidenceLevel: 'higher',
            blockerCount: 0,
            watchCount: 0,
            taxContext: 'available',
            reviewItems: [],
            boundary: 'Runtime-only.',
            nextStep: 'Use synthetic scenarios.'
          },
          blockedOutputs: ['savedInstructionOutput', 'csvInstructionOutput', 'reportInstructionOutput', 'taxBracketInstructions', 'productionUi'],
          summary: 'Draft ready.',
          boundary: 'Runtime-only.',
          nextStep: 'Review.'
        }
      },
      {
        id: 'review-example',
        label: 'Review example',
        draft: {
          status: 'draftReady',
          audience: 'syntheticTesterOnly',
          sourceCandidateId: 'baseline',
          sourceCandidateLabel: 'Current plan',
          yearCount: 2,
          rows: [],
          annualAccountTotals: [],
          annualInstructionCandidates: [],
          candidateSelectionSummary: {
            status: 'reviewFirst',
            strongestCandidateYears: [],
            qualityCounts: { higher: 0, medium: 0, low: 0, blocked: 0 },
            repairThemes: [],
            summary: 'Annual instruction candidates have repair themes to review before tester presentation.',
            boundary: 'Runtime-only.',
            nextStep: 'Review.'
          },
          presentationReadiness: {
            status: 'reviewFirst',
            displayRows: [],
            rows: [],
            summary: 'Annual candidate summaries can be reviewed by testers with repair themes visible.',
            boundary: 'Runtime-only.',
            nextStep: 'Review.'
          },
          testerPacketBoundary: {
            status: 'reviewFirst',
            visibleSections: ['candidateDisplayRows', 'qualityLabels', 'repairThemes', 'runtimeBoundary'],
            hiddenSections: ['savedSequencingOutput', 'csvSequencingOutput', 'reportOutput', 'productionUi', 'taxBracketInstructions', 'finalAnnualInstructions'],
            rows: [],
            testerCopy: {
              headline: 'Experimental annual candidate review',
              purpose: 'Use this runtime packet to test made-up scenarios.',
              boundary: 'Not a retirement plan.'
            },
            blockedOutputs: ['finalAnnualInstructions', 'savedSequencingOutput', 'csvSequencingOutput', 'reportOutput', 'productionUi', 'taxBracketInstructions'],
            summary: 'Synthetic tester packet boundary can be reviewed with visible repair themes.',
            nextStep: 'Review.'
          },
          testerPacketExportGuard: {
            status: 'guarded',
            rows: [],
            forbiddenSavedKeys: [
              'testerPacketBoundary',
              'testerPacketExportGuard',
              'annualInstructionCandidates',
              'candidateSelectionSummary',
              'presentationReadiness',
              'experimentalAnnualInstructionDraft',
              'annualAccountInstructions'
            ],
            blockedOutputs: ['savedSequencingOutput', 'csvSequencingOutput', 'reportOutput', 'productionUi', 'taxBracketInstructions', 'finalAnnualInstructions'],
            summary: 'Tester packet export guard keeps synthetic review content runtime-only.',
            boundary: 'Runtime-only.',
            nextStep: 'Review.'
          },
          instructionReadiness: {
            status: 'reviewFirst',
            rows: [],
            totalDraftAmount: 0,
            yearCount: 0,
            blockedOutputs: ['annualAccountInstructions', 'savedInstructionOutput', 'csvInstructionOutput', 'reportInstructionOutput', 'taxBracketInstructions', 'productionUi'],
            summary: 'Runtime annual account totals need review before tester presentation.',
            boundary: 'Runtime-only.',
            nextStep: 'Review.'
          },
          taxContextRows: [],
          confidence: {
            level: 'medium',
            score: 9,
            rows: [],
            blockers: [],
            summary: 'Draft confidence is medium.'
          },
          harmChecks: [],
          readinessSummary: {
            status: 'reviewFirst',
            headline: 'Experimental draft needs review before tester use.',
            rowCoverage: { draftRows: 1, modelledYears: 2 },
            confidenceLevel: 'medium',
            blockerCount: 0,
            watchCount: 2,
            taxContext: 'available',
            reviewItems: ['Survivor review'],
            boundary: 'Runtime-only.',
            nextStep: 'Review watch items.'
          },
          blockedOutputs: ['savedInstructionOutput', 'csvInstructionOutput', 'reportInstructionOutput', 'taxBracketInstructions', 'productionUi'],
          summary: 'Draft review.',
          boundary: 'Runtime-only.',
          nextStep: 'Review.'
        }
      }
    ]);

    expect(matrix).toMatchObject({
      status: 'reviewFirst',
      exampleCount: 2,
      readyCount: 1,
      reviewFirstCount: 1,
      blockedCount: 0,
      boundary: expect.stringContaining('runtime-only')
    });
    expect(matrix.items.map((item) => item.id)).toEqual(['ready-example', 'review-example']);
    expect(matrix.items[1].reviewItems).toContain('Survivor review');
    expect(matrix.repairTargets.map((target) => target.id)).toEqual(['rowCoverage', 'blockers', 'watchItems', 'taxContext', 'confidence']);
    expect(matrix.repairTargets.find((target) => target.id === 'rowCoverage')).toMatchObject({
      status: 'repair',
      exampleIds: ['review-example'],
      repairAction: expect.stringContaining('Inspect selected-candidate annual rows')
    });
    expect(matrix.repairTargets.find((target) => target.id === 'watchItems')).toMatchObject({
      status: 'repair',
      exampleIds: ['review-example'],
      repairAction: expect.stringContaining('Review the watch-item labels')
    });
    expect(matrix.repairTargets.find((target) => target.id === 'blockers')).toMatchObject({
      status: 'pass',
      repairAction: 'No blocker repair needed.'
    });
    expect(matrix.testerPacketReadiness).toMatchObject({
      status: 'reviewFirst',
      exampleCount: 2,
      readyExampleIds: ['ready-example'],
      reviewExampleIds: ['review-example'],
      blockedExampleIds: [],
      releaseScope: {
        visibleSections: ['candidateDisplayRows', 'qualityLabels', 'repairThemes', 'runtimeBoundary'],
        hiddenOutputs: ['savedSequencingOutput', 'csvSequencingOutput', 'reportOutput', 'productionUi', 'taxBracketInstructions', 'finalAnnualInstructions']
      },
      boundary: expect.stringContaining('runtime-only')
    });
    expect(matrix.testerPacketReadiness.rows.map((row) => row.id)).toEqual([
      'draftReadiness',
      'packetBoundary',
      'exportGuard',
      'testerPurpose',
      'outputBoundary'
    ]);
    expect(matrix.testerPacketReadiness.rows.find((row) => row.id === 'exportGuard')).toMatchObject({
      status: 'pass',
      detail: expect.stringContaining('runtime-only')
    });
    expect(matrix.testerPacketReadiness.packetContract).toMatchObject({
      status: 'reviewFirst',
      allowedFields: [
        'exampleId',
        'exampleLabel',
        'candidateDisplayRows',
        'qualityLabels',
        'repairThemes',
        'runtimeBoundary',
        'reviewPrompts',
        'readinessStatus'
      ],
      excludedFields: [
        'savedSequencingOutput',
        'csvSequencingOutput',
        'reportOutput',
        'productionUi',
        'taxBracketInstructions',
        'finalAnnualInstructions',
        'personalData',
        'savedPlanSchema'
      ],
      boundary: expect.stringContaining('runtime-only')
    });
    expect(matrix.testerPacketReadiness.packetContract.reviewPrompts.map((prompt) => prompt.id)).toEqual([
      'clarity',
      'plausibility',
      'missingContext',
      'boundary'
    ]);
    expect(matrix.testerPacketReadiness.packetContract.rows.map((row) => row.id)).toEqual([
      'allowedFields',
      'excludedFields',
      'copyBoundary',
      'implementationBoundary'
    ]);
    expect(JSON.stringify(matrix.testerPacketReadiness.packetContract).toLowerCase()).not.toContain('you should');
    expect(matrix.boundary).toContain('does not save draft output');
    expect(matrix.boundary).not.toContain('CSV export is ready');
  });

  it('builds a limited candidate set from optimizer contract levers', () => {
    const candidates = buildBoundedOptimizerCandidates(readyPlan());

    expect(candidates.map((candidate) => candidate.id)).toEqual([
      'baseline',
      'spendLess5',
      'spendLess10',
      'retireLater1',
      'retireLater2',
      'benefitGridCpp60Oas65',
      'benefitGridCpp60Oas67',
      'benefitGridCpp60Oas70',
      'benefitGridCpp65Oas67',
      'benefitGridCpp65Oas70',
      'benefitGridCpp67Oas65',
      'benefitGridCpp67Oas67',
      'benefitGridCpp67Oas70',
      'benefitGridCpp70Oas65',
      'benefitGridCpp70Oas67',
      'delayBenefits',
      'withdrawalRegisteredFirst',
      'withdrawalNonRegisteredFirst'
    ]);
    expect(candidates.find((candidate) => candidate.id === 'spendLess10')?.plan.spending.gogo).toBe(76500);
    expect(candidates.find((candidate) => candidate.id === 'delayBenefits')?.config).toMatchObject({
      cppAgeF: 70,
      cppAgeM: 70,
      oasAgeF: 70,
      oasAgeM: 70
    });
    expect(candidates.find((candidate) => candidate.id === 'benefitGridCpp70Oas65')?.config).toMatchObject({
      cppAgeF: 70,
      cppAgeM: 70,
      oasAgeF: 65,
      oasAgeM: 65
    });
  });

  it('preserves non-grid review families when the bounded candidate limit is reached', () => {
    const plan = readyPlan();
    plan.p2 = {
      ...plan.p2,
      name: 'Morgan',
      dob: 1969,
      retireYear: 2033,
      rrsp: 120000,
      tfsa: 70000,
      nonreg: 50000,
      cpp65_monthly: 900,
      cpp70_monthly: 1250,
      oas_monthly: 742
    };
    plan.downsize = { year: 2040, netProceeds: 200000 };
    plan.assumptions.cppSharing = false;
    plan.assumptions.p1DiesInSurvivor = 2045;

    const candidates = buildBoundedOptimizerCandidates(plan);
    const ids = candidates.map((candidate) => candidate.id);

    expect(candidates).toHaveLength(20);
    expect(ids).toContain('delayBenefits');
    expect(ids).toContain('pensionSplit');
    expect(ids).toContain('cppSharing');
    expect(ids).toContain('withoutDownsize');
    expect(ids).toContain('withdrawalRegisteredFirst');
    expect(ids).toContain('withdrawalNonRegisteredFirst');
  });

  it('keeps all example-plan candidate sets bounded before annual sequencing exists', () => {
    examplePlanCards.forEach((card) => {
      const plan = createExamplePlan(card.id);
      const candidates = buildBoundedOptimizerCandidates(plan);
      const ids = candidates.map((candidate) => candidate.id);

      expect(candidates.length).toBeLessThanOrEqual(20);
      expect(ids).toContain('baseline');
      expect(ids).not.toContain('annualOverrides' as BoundedOptimizerCandidateId);
      expect(ids.some((id) => String(id).toLowerCase().includes('annual'))).toBe(false);
    });
  });

  it('runs candidates through the provided runner and does not persist optimizer output', () => {
    const calls: Array<{ title: string | undefined; order: string | undefined; config: SimulationConfig }> = [];
    const byCandidate: Partial<Record<BoundedOptimizerCandidateId, SimulationResult>> = {
      baseline: result(100000, 90000, 2033),
      spendLess5: result(120000, 88000, null),
      spendLess10: result(125000, 87000, null),
      retireLater1: result(130000, 86000, null),
      retireLater2: result(140000, 85000, null),
      benefitGridCpp65Oas70: result(118000, 89000, null),
      benefitGridCpp70Oas65: result(119000, 88000, null),
      delayBenefits: result(155000, 83000, null),
      withdrawalRegisteredFirst: result(170000, 80000, null, { registeredDraw: 26000, tfsaDraw: 5000 }),
      withdrawalNonRegisteredFirst: result(160000, 82000, null, { nonregDraw: 24000, registeredDraw: 4000 })
    };

    const summary = runBoundedOptimizer(readyPlan(), (candidatePlan, config) => {
      calls.push({ title: candidatePlan.title, order: candidatePlan.assumptions.withdrawalOrder, config });
      const id =
        config.withdrawalOrder === 'registered-first'
          ? 'withdrawalRegisteredFirst'
          : config.withdrawalOrder === 'nonreg-first'
            ? 'withdrawalNonRegisteredFirst'
            : config.cppAgeF === 70 && config.oasAgeF === 70
              ? 'delayBenefits'
              : config.cppAgeF && config.oasAgeF && (config.cppAgeF !== 65 || config.oasAgeF !== 65)
                ? (`benefitGridCpp${config.cppAgeF}Oas${config.oasAgeF}` as BoundedOptimizerCandidateId)
                : candidatePlan.p1.retireYear === 2034
                    ? 'retireLater2'
                    : candidatePlan.p1.retireYear === 2033
                      ? 'retireLater1'
                      : candidatePlan.spending.gogo === 76500
                        ? 'spendLess10'
                        : candidatePlan.spending.gogo === 80750
                          ? 'spendLess5'
                          : 'baseline';
      return byCandidate[id] || (String(id).startsWith('benefitGrid') ? result(90000, 91000, 2033) : result(0, 0));
    });

    expect(summary.status).toBe('ready');
    expect(summary.execution).toBe('boundedSearch');
    expect(summary.objective).toMatchObject({
      primaryObjective: 'maximizeSustainableAfterTaxSpend',
      outputTone: 'planToReview',
      riskGuardrail: 'conservativeDeterministicFunding',
      monteCarloRole: 'validationLater',
      savedOutput: 'none'
    });
    expect(summary.suggestedCandidateId).toBe('withdrawalRegisteredFirst');
    expect(summary.candidates).toHaveLength(18);
    expect(summary.candidates.filter((candidate) => candidate.changedLevers.includes('benefitTiming'))).toHaveLength(11);
    expect(summary.candidates.find((candidate) => candidate.id === 'withdrawalRegisteredFirst')?.sustainableAnnualSpend).toBe(85000);
    expect(summary.readinessRows.find((row) => row.id === 'spending')).toMatchObject({ status: 'ready' });
    expect(summary.readinessRows.find((row) => row.id === 'benefitEstimates')).toMatchObject({ status: 'ready' });
    expect(summary.readinessRows.find((row) => row.id === 'accountBuckets')).toMatchObject({ status: 'ready' });
    expect(summary.candidateFamilies.find((family) => family.id === 'benefitTimingGrid')).toMatchObject({ status: 'included' });
    expect(summary.candidateFamilies.find((family) => family.id === 'broadWithdrawalFamilies')).toMatchObject({ status: 'included' });
    expect(summary.candidateFamilies.find((family) => family.id === 'annualOverrides')).toMatchObject({ status: 'deferred' });
    expect(summary.candidateFamilies.find((family) => family.id === 'monteCarloValidation')).toMatchObject({ status: 'deferred' });
    expect(summary.searchPlan).toMatchObject({
      strategy: 'stagedGrid',
      jointCoupleSearch: false,
      annualOverrides: 'deferred'
    });
    expect(summary.searchPlan.benefitSearch[0]).toMatchObject({
      person: 'p1',
      cppAges: expect.arrayContaining([64, 65, 70]),
      oasAges: expect.arrayContaining([65, 70])
    });
    expect(summary.searchPlan.withdrawalFamilies.map((family) => family.id)).toEqual([
      'currentOrder',
      'default',
      'registeredFirst',
      'nonRegisteredFirst'
    ]);
    expect(summary.capacityObjective).toMatchObject({
      status: 'covered',
      selectedCandidateId: 'withdrawalRegisteredFirst',
      monthlyAfterTaxCapacity: 85000 / 12,
      minimumMonthlyExpenseFloor: 62000 / 12,
      survivorConstraint: 'notApplicable',
      timingComparison: 'included',
      withdrawalSequencing: 'deferred'
    });
    expect(summary.capacityObjective.optionalMonthlyRoom).toBeCloseTo((85000 - 62000) / 12, 2);
    expect(summary.capacityObjective.rows.map((row) => row.id)).toEqual([
      'minimumFloor',
      'estate',
      'survivor',
      'benefitTiming',
      'withdrawalSequencing'
    ]);
    expect(summary.capacityObjective.boundary).toContain('runtime-only');
    expect(summary.capacityReportReadiness).toMatchObject({
      status: 'readyForLaterReport',
      boundary: expect.stringContaining('does not change printable report output')
    });
    expect(summary.capacityReportReadiness.rows.find((row) => row.id === 'accountInstructions')).toMatchObject({
      status: 'deferred'
    });
    expect(summary.capacityExportGuard.forbiddenSavedKeys).toContain('capacityObjective');
    expect(summary.capacityExportGuard.forbiddenSavedKeys).toContain('annualSequencingPrepContract');
    expect(summary.capacityExportGuard.rows.find((row) => row.id === 'planFile')).toMatchObject({ status: 'blocked' });
    expect(summary.annualSequencingPrepContract).toMatchObject({
      status: 'contractOnly',
      blockedOutputs: expect.arrayContaining(['annualAccountInstructions', 'accountOrder', 'taxBracketInstructions'])
    });
    expect(summary.annualSequencingPrepContract.rows.find((row) => row.id === 'outputBoundary')).toMatchObject({ status: 'blocked' });
    expect(summary.annualSequencingInputAdapter).toMatchObject({
      status: 'readyForDraftPlanning',
      sourceCandidateId: 'withdrawalRegisteredFirst',
      availableAccountBalanceFields: expect.arrayContaining(['bal_rrsp', 'bal_tfsa', 'bal_total']),
      availableTaxFields: expect.arrayContaining(['totalTaxYear', 'taxableIncome', 'totalAftaxYear'])
    });
    expect(summary.annualSequencingInputAdapter.rows.find((row) => row.id === 'outputBoundary')).toMatchObject({
      status: 'blocked',
      detail: expect.stringContaining('does not produce account order')
    });
    expect(summary.annualSequencingInputAdapter.boundary).toContain('does not produce account order');
    expect(summary.experimentalAccountOrderDraft).toMatchObject({
      status: 'draftReady',
      audience: 'syntheticTesterOnly',
      sourceCandidateId: 'withdrawalRegisteredFirst',
      order: expect.arrayContaining(['registered', 'tfsa'])
    });
    expect(summary.experimentalAccountOrderDraft.rows[0]).toMatchObject({
      bucket: 'registered',
      position: 1,
      status: 'included'
    });
    expect(summary.experimentalAccountOrderDraft.boundary).toContain('runtime-only experimental account-order draft');
    expect(summary.experimentalAnnualInstructionDraft).toMatchObject({
      status: 'draftReady',
      audience: 'syntheticTesterOnly',
      sourceCandidateId: 'withdrawalRegisteredFirst'
    });
    expect(summary.experimentalAnnualInstructionDraft.rows[0]).toMatchObject({
      year: 2032,
      account: 'registered',
      amount: 26000,
      source: {
        candidateLabel: expect.stringContaining('Registered accounts first'),
        withdrawalField: 'rrif_draw_f + rrif_draw_m',
        withdrawalFieldLabel: 'registered withdrawal fields',
        accountOrderPosition: 1,
        yearWithdrawalCount: 2
      },
      grouping: {
        yearAccountIndex: 1,
        yearWithdrawalCount: 2,
        mode: 'multiAccountYear'
      },
      taxContext: {
        totalTaxYear: Math.round(80000 / 3),
        taxableIncome: 90000,
        afterTaxSpending: 85000,
        effectiveTaxRatePct: 29.6,
        oasRecoveryStatus: 'none'
      },
      status: 'experimentalDraft',
      rationale: expect.stringContaining('runtime draft mirrors the selected candidate')
    });
    expect(summary.experimentalAnnualInstructionDraft.rows[0].rationale).toContain('row 1 of 2');
    expect(summary.experimentalAnnualInstructionDraft.rows[0].rationale).toContain('draft account-order position 1');
    expect(summary.experimentalAnnualInstructionDraft.annualAccountTotals[0]).toMatchObject({
      year: 2032,
      totalAmount: 31000,
      accountCount: 2,
      accountOrder: {
        status: 'gapped',
        activePositions: [1, 4],
        skippedPositions: [2, 3],
        detail: expect.stringContaining('skip draft account-order positions')
      },
      accounts: [
        {
          account: 'registered',
          amount: 26000,
          accountOrderPosition: 1
        },
        {
          account: 'tfsa',
          amount: 5000,
          accountOrderPosition: 4
        }
      ],
      taxContext: {
        totalTaxYear: Math.round(80000 / 3),
        afterTaxSpending: 85000,
        oasRecovery: 0
      }
    });
    expect(summary.experimentalAnnualInstructionDraft.instructionReadiness).toMatchObject({
      status: 'reviewFirst',
      totalDraftAmount: 93000,
      yearCount: 3,
      blockedOutputs: expect.arrayContaining(['annualAccountInstructions', 'savedInstructionOutput', 'csvInstructionOutput', 'taxBracketInstructions', 'productionUi']),
      boundary: expect.stringContaining('runtime-only')
    });
    expect(summary.experimentalAnnualInstructionDraft.instructionReadiness.rows.map((row) => row.id)).toEqual([
      'yearTotals',
      'accountOrderConsistency',
      'accountOrderGaps',
      'taxContext',
      'outputBoundary'
    ]);
    expect(summary.experimentalAnnualInstructionDraft.instructionReadiness.rows.find((row) => row.id === 'accountOrderGaps')).toMatchObject({
      status: 'watch',
      detail: expect.stringContaining('skip inactive draft account-order positions')
    });
    expect(summary.experimentalAnnualInstructionDraft.annualInstructionCandidates[0]).toMatchObject({
      year: 2032,
      status: 'reviewFirst',
      totalAmount: 31000,
      accountCount: 2,
      accounts: [
        {
          account: 'registered',
          amount: 26000,
          accountOrderPosition: 1,
          displayOrder: 1
        },
        {
          account: 'tfsa',
          amount: 5000,
          accountOrderPosition: 4,
          displayOrder: 2
        }
      ],
      reviewFlags: ['accountOrderGap'],
      quality: {
        level: 'medium',
        score: 7,
        rows: [
          {
            id: 'annualTotal',
            status: 'pass'
          },
          {
            id: 'accountOrder',
            status: 'watch'
          },
          {
            id: 'taxContext',
            status: 'pass'
          },
          {
            id: 'outputBoundary',
            status: 'pass'
          }
        ],
        repairTargets: expect.arrayContaining([
          expect.objectContaining({
            id: 'accountOrderGap',
            status: 'repair'
          }),
          expect.objectContaining({
            id: 'limitedTaxContext',
            status: 'pass'
          })
        ])
      },
      boundary: expect.stringContaining('runtime-only review context')
    });
    expect(summary.experimentalAnnualInstructionDraft.annualInstructionCandidates[0].summary).toContain('needs review');
    expect(summary.experimentalAnnualInstructionDraft.candidateSelectionSummary).toMatchObject({
      status: 'reviewFirst',
      strongestCandidateYears: [2032, 2033, 2034],
      qualityCounts: {
        higher: 0,
        medium: 3,
        low: 0,
        blocked: 0
      },
      boundary: expect.stringContaining('runtime-only review context'),
      nextStep: expect.stringContaining('saved sequencing output')
    });
    expect(summary.experimentalAnnualInstructionDraft.candidateSelectionSummary.repairThemes.find((theme) => theme.id === 'accountOrderGap')).toMatchObject({
      status: 'repair',
      candidateYears: [2032, 2033, 2034],
      detail: expect.stringContaining('3 annual candidates')
    });
    expect(summary.experimentalAnnualInstructionDraft.candidateSelectionSummary.repairThemes.find((theme) => theme.id === 'limitedTaxContext')).toMatchObject({
      status: 'pass'
    });
    expect(summary.experimentalAnnualInstructionDraft.presentationReadiness).toMatchObject({
      status: 'reviewFirst',
      displayRows: [
        {
          year: 2032,
          label: '2032 annual candidate',
          statusLabel: 'Review first',
          qualityLabel: 'Medium confidence',
          repairPreview: 'Review account order gap.',
          totalAmount: 31000
        },
        {
          year: 2033,
          label: '2033 annual candidate',
          statusLabel: 'Review first',
          qualityLabel: 'Medium confidence',
          repairPreview: 'Review account order gap.',
          totalAmount: 31000
        },
        {
          year: 2034,
          label: '2034 annual candidate',
          statusLabel: 'Review first',
          qualityLabel: 'Medium confidence',
          repairPreview: 'Review account order gap.',
          totalAmount: 31000
        }
      ],
      boundary: expect.stringContaining('runtime-only review context'),
      nextStep: expect.stringContaining('synthetic tester review')
    });
    expect(summary.experimentalAnnualInstructionDraft.presentationReadiness.rows.map((row) => row.id)).toEqual([
      'candidateLabels',
      'qualityLabels',
      'repairPreview',
      'boundary'
    ]);
    expect(summary.experimentalAnnualInstructionDraft.testerPacketBoundary).toMatchObject({
      status: 'reviewFirst',
      visibleSections: ['candidateDisplayRows', 'qualityLabels', 'repairThemes', 'runtimeBoundary'],
      hiddenSections: ['savedSequencingOutput', 'csvSequencingOutput', 'reportOutput', 'productionUi', 'taxBracketInstructions', 'finalAnnualInstructions'],
      blockedOutputs: ['finalAnnualInstructions', 'savedSequencingOutput', 'csvSequencingOutput', 'reportOutput', 'productionUi', 'taxBracketInstructions'],
      testerCopy: {
        headline: 'Experimental annual candidate review',
        purpose: expect.stringContaining('made-up scenarios'),
        boundary: expect.stringContaining('not a retirement plan')
      },
      nextStep: expect.stringContaining('tester packet boundary')
    });
    expect(summary.experimentalAnnualInstructionDraft.testerPacketBoundary.rows.map((row) => row.id)).toEqual([
      'visibleMaterial',
      'hiddenMaterial',
      'testerPurpose',
      'outputBoundary'
    ]);
    expect(summary.experimentalAnnualInstructionDraft.testerPacketExportGuard).toMatchObject({
      status: 'guarded',
      forbiddenSavedKeys: expect.arrayContaining([
        'testerPacketBoundary',
        'testerPacketExportGuard',
        'annualInstructionCandidates',
        'experimentalAnnualInstructionDraft',
        'annualAccountInstructions'
      ]),
      blockedOutputs: ['savedSequencingOutput', 'csvSequencingOutput', 'reportOutput', 'productionUi', 'taxBracketInstructions', 'finalAnnualInstructions'],
      boundary: expect.stringContaining('runtime-only review evidence'),
      nextStep: expect.stringContaining('synthetic tester packet boundary')
    });
    expect(summary.experimentalAnnualInstructionDraft.testerPacketExportGuard.rows.map((row) => row.id)).toEqual([
      'savedPlanFile',
      'csvOutput',
      'reportOutput',
      'productionUi',
      'finalInstructions',
      'taxBracketInstructions'
    ]);
    expect(summary.experimentalAnnualInstructionDraft.testerPacketExportGuard.rows.every((row) => row.status === 'guarded')).toBe(true);
    expect(summary.experimentalAnnualInstructionDraft.taxContextRows.map((row) => row.id)).toEqual([
      'taxRange',
      'oasRecovery',
      'afterTaxSpending',
      'effectiveRate',
      'boundary'
    ]);
    expect(summary.experimentalAnnualInstructionDraft.taxContextRows.find((row) => row.id === 'boundary')).toMatchObject({
      status: 'blocked',
      detail: expect.stringContaining('without creating tax-bracket instructions')
    });
    expect(summary.experimentalAnnualInstructionDraft.confidence).toMatchObject({
      level: 'higher',
      blockers: [],
      summary: expect.stringContaining('synthetic tester review')
    });
    expect(summary.experimentalAnnualInstructionDraft.confidence.score).toBeGreaterThanOrEqual(11);
    expect(summary.experimentalAnnualInstructionDraft.confidence.rows.map((row) => row.id)).toEqual([
      'draftRows',
      'taxContext',
      'accountOrder',
      'constraintCoverage',
      'survivorReview',
      'outputBoundary'
    ]);
    expect(summary.experimentalAnnualInstructionDraft.confidence.rows.find((row) => row.id === 'outputBoundary')).toMatchObject({
      status: 'pass',
      detail: expect.stringContaining('runtime-only')
    });
    expect(summary.experimentalAnnualInstructionDraft.harmChecks.map((row) => row.id)).toEqual([
      'shortfall',
      'estatePressure',
      'survivorReview',
      'oasRecovery',
      'taxContext',
      'outputBoundary'
    ]);
    expect(summary.experimentalAnnualInstructionDraft.harmChecks.find((row) => row.id === 'shortfall')).toMatchObject({
      status: 'pass',
      detail: expect.stringContaining('No projected shortfall')
    });
    expect(summary.experimentalAnnualInstructionDraft.harmChecks.find((row) => row.id === 'outputBoundary')).toMatchObject({
      status: 'pass',
      detail: expect.stringContaining('runtime-only')
    });
    expect(summary.experimentalAnnualInstructionDraft.readinessSummary).toMatchObject({
      status: 'readyForTesterReview',
      confidenceLevel: 'higher',
      blockerCount: 0,
      taxContext: 'available',
      rowCoverage: {
        draftRows: 6,
        modelledYears: 3
      },
      boundary: expect.stringContaining('runtime-only')
    });
    expect(summary.experimentalAnnualInstructionDraft.readinessSummary.watchCount).toBe(0);
    expect(summary.experimentalAnnualInstructionDraft.readinessSummary.nextStep).toContain('synthetic scenarios');
    expect(summary.experimentalAnnualInstructionDraft.boundary).toContain('not saved');
    expect(JSON.stringify(summary.experimentalAnnualInstructionDraft).toLowerCase()).not.toContain('stay under');
    expect(summary.explanation.plainLanguageSummary).toContain('first option to review');
    expect(summary.explanation.whyThisOption.join(' ')).toContain('Projected money left improves');
    expect(summary.explanation.tradeoffs.join(' ')).toContain('drawdown order');
    expect(summary.explanation.verifyBeforeUsing.join(' ')).toContain('Review taxes');
    expect(summary.driverRows.map((row) => row.id)).toEqual(['fundedYears', 'lifetimeTax', 'peakTax', 'oasRecovery', 'portfolio']);
    expect(summary.optionGroups.map((group) => group.id)).toEqual(['currentPlan', 'lifestyle', 'timing', 'drawdownReview']);
    expect(summary.optionGroups.find((group) => group.id === 'lifestyle')).toMatchObject({
      label: 'Lifestyle choices',
      candidateIds: ['spendLess5', 'spendLess10']
    });
    expect(summary.optionGroups.find((group) => group.id === 'drawdownReview')).toMatchObject({
      label: 'Drawdown review',
      canHighlightCount: 2
    });
    expect(summary.driverRows.find((row) => row.id === 'lifetimeTax')).toMatchObject({ value: '-$10,000', tone: 'ok' });
    expect(summary.driverRows.find((row) => row.id === 'portfolio')).toMatchObject({ value: '+$70,000', tone: 'ok' });
    expect(summary.compactEvidenceRows.map((row) => row.id)).toEqual([
      'monthlySpend',
      'fundedYears',
      'moneyLeft',
      'lifetimeTax',
      'oasRecovery'
    ]);
    expect(summary.compactEvidenceRows.find((row) => row.id === 'monthlySpend')).toMatchObject({
      label: 'Monthly spend reviewed',
      value: '$7,083',
      detail: expect.stringContaining("today's dollars")
    });
    expect(summary.compactEvidenceRows.find((row) => row.id === 'lifetimeTax')).toMatchObject({
      value: '-$10,000',
      detail: expect.stringContaining('not a command to change accounts')
    });
    expect(summary.goalReview).toMatchObject({
      summary: expect.stringContaining('re-rank the same bounded candidate set'),
      boundary: expect.stringContaining('No goal toggle is shown in the normal UI')
    });
    expect(summary.goalReview.architecture).toMatchObject({
      headline: 'Goal-mode architecture stays inside the bounded candidate set.',
      boundary: expect.stringContaining('do not add toggles, advice, saved output, or annual account instructions')
    });
    expect(summary.goalReview.architecture.rows).toEqual([
      expect.objectContaining({ id: 'sameCandidateSet', status: 'ready' }),
      expect.objectContaining({ id: 'rerankOnly', status: 'ready' }),
      expect.objectContaining({ id: 'normalUiHidden', status: 'deferred' }),
      expect.objectContaining({ id: 'sequencingDeferred', status: 'deferred' })
    ]);
    expect(summary.goalReview.rows).toEqual([
      expect.objectContaining({ id: 'maxSpend', status: 'current' }),
      expect.objectContaining({ id: 'maxEstate', status: 'deferred' }),
      expect.objectContaining({ id: 'minTax', status: 'deferred' }),
      expect.objectContaining({ id: 'spendingFlexibility', status: 'deferred' })
    ]);
    expect(summary.goalReview.rows.find((row) => row.id === 'spendingFlexibility')?.detail).toContain('cash-wedge rules');
    expect(summary.goalReview.goalModePreview).toMatchObject({
      headline: 'Same candidates, different review lens.',
      boundary: expect.stringContaining('re-ranks existing candidates only')
    });
    expect(summary.goalReview.goalModePreview.rows.map((row) => row.id)).toEqual(['maxSpend', 'maxEstate', 'minTax']);
    expect(summary.goalReview.goalModePreview.rows.find((row) => row.id === 'maxSpend')).toMatchObject({
      status: 'current',
      topCandidateId: 'withdrawalRegisteredFirst',
      basis: expect.stringContaining("today's dollars")
    });
    expect(summary.goalReview.goalModePreview.rows.find((row) => row.id === 'maxEstate')).toMatchObject({
      status: 'deferred',
      topCandidateId: 'withdrawalRegisteredFirst',
      detail: expect.stringContaining('not a recommendation')
    });
    expect(summary.goalReview.goalModePreview.rows.find((row) => row.id === 'minTax')).toMatchObject({
      status: 'deferred',
      topCandidateId: 'withdrawalRegisteredFirst',
      detail: expect.stringContaining('not an account instruction')
    });
    expect(summary.goalReview.spendingFlexibilityReview).toMatchObject({
      headline: 'Spending flexibility needs feedback language first.',
      boundary: expect.stringContaining('not a saved setting or optimizer instruction')
    });
    expect(summary.goalReview.spendingFlexibilityReview.questions.join(' ')).toContain('cash-wedge explanation');
    expect(summary.goalReview.spendingFlexibilityReview.worksheet.map((item) => item.id)).toEqual([
      'rangeClarity',
      'bufferClarity',
      'screenFocus',
      'decision'
    ]);
    expect(summary.goalReview.spendingFlexibilityReview.worksheet.find((item) => item.id === 'bufferClarity')).toMatchObject({
      passSignal: expect.stringContaining('not a refill rule or withdrawal order')
    });
    expect(summary.goalReview.spendingFlexibilityReview.outcomeReview).toMatchObject({
      headline: 'Flexibility feedback has three review outcomes.',
      boundary: expect.stringContaining('do not create spending permission')
    });
    expect(summary.goalReview.spendingFlexibilityReview.outcomeReview.rows).toEqual([
      expect.objectContaining({ id: 'rangeHelpful', status: 'canTest', nextStep: expect.stringContaining('before adding any rule') }),
      expect.objectContaining({ id: 'rangeDistracting', status: 'hold', detail: expect.stringContaining('new recommendation') }),
      expect.objectContaining({ id: 'rangeUnclear', status: 'simplify', nextStep: expect.stringContaining('Simplify copy') })
    ]);
    expect(summary.goalReview.spendingFlexibilityReview.cashWedgeBoundary).toMatchObject({
      headline: 'Cash wedge is a buffer explanation, not a refill rule.',
      boundary: expect.stringContaining('must not create refill instructions')
    });
    expect(summary.goalReview.spendingFlexibilityReview.cashWedgeBoundary.rows).toEqual([
      expect.objectContaining({ id: 'buffer' }),
      expect.objectContaining({ id: 'notRefillRule' }),
      expect.objectContaining({ id: 'notWithdrawalOrder' }),
      expect.objectContaining({ id: 'taxEvidence' })
    ]);
    expect(summary.goalReview.spendingFlexibilityReview.rows).toEqual([
      expect.objectContaining({ id: 'variableSpending', status: 'review' }),
      expect.objectContaining({ id: 'cashWedge', status: 'review' }),
      expect.objectContaining({ id: 'taxImpact', status: 'deferred' }),
      expect.objectContaining({ id: 'implementationBoundary', status: 'deferred' })
    ]);
    expect(summary.goalReview.spendingFlexibilityReview.rows.find((row) => row.id === 'implementationBoundary')?.detail).toContain(
      'No variable-spending rule'
    );
    expect(summary.feedbackPackageIndex).toMatchObject({
      headline: 'Optimizer feedback package is indexed for review.',
      boundary: expect.stringContaining('runtime review support only')
    });
    expect(summary.feedbackPackageIndex.rows).toEqual([
      expect.objectContaining({ id: 'withdrawalFamilyFeedback', status: 'ready' }),
      expect.objectContaining({ id: 'goalModes', status: 'deferred' }),
      expect.objectContaining({ id: 'spendingFlexibility', status: 'review' }),
      expect.objectContaining({ id: 'annualSequencing', status: 'deferred' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness).toMatchObject({
      status: 'maybeLater',
      headline: 'Annual sequencing may be planned later, but is not ready now.',
      boundary: expect.stringContaining('does not implement annual account-level sequencing')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.readinessSectionIndex).toMatchObject({
      headline: 'Readiness sections are indexed for review.',
      boundary: expect.stringContaining('Details-only map')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.readinessSectionIndex.rows).toEqual([
      expect.objectContaining({ id: 'baseReadiness', group: 'prototypeGate' }),
      expect.objectContaining({ id: 'feedbackEvidence', group: 'evidence' }),
      expect.objectContaining({ id: 'evidenceQuality', group: 'quality' }),
      expect.objectContaining({ id: 'decisionBoundary', group: 'decision' }),
      expect.objectContaining({ id: 'prototypeGate', group: 'prototypeGate' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.readinessSectionIndex.rows.find((row) => row.id === 'feedbackEvidence')?.detail).toContain(
      'household coverage'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.copyTighteningGuard).toMatchObject({
      headline: 'Readiness copy should stay short and defer-first.',
      boundary: expect.stringContaining('does not change calculations')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.copyTighteningGuard.rows).toEqual([
      expect.objectContaining({ id: 'preferredTerms', status: 'review' }),
      expect.objectContaining({ id: 'blockedTerms', status: 'blocked' }),
      expect.objectContaining({ id: 'deferFirst', status: 'blocked' }),
      expect.objectContaining({ id: 'consumerTone', status: 'review' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.copyTighteningGuard.rows.find((row) => row.id === 'blockedTerms')?.detail).toContain(
      'approval, start, apply, save, instruction'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.copyTighteningGuard.rows.find((row) => row.id === 'deferFirst')?.detail).toContain(
      'deferred while blockers remain'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackExamplePointers).toMatchObject({
      headline: 'Example feedback snippets are static review aids.',
      boundary: expect.stringContaining('do not collect user data')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackExamplePointers.rows).toEqual([
      expect.objectContaining({ id: 'dbPensionExample', status: 'review' }),
      expect.objectContaining({ id: 'bridgeYearExample', status: 'review' }),
      expect.objectContaining({ id: 'alreadyRetiredExample', status: 'review' }),
      expect.objectContaining({ id: 'staticOnly', status: 'blocked' }),
      expect.objectContaining({ id: 'noPersistence', status: 'blocked' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackExamplePointers.rows.find((row) => row.id === 'staticOnly')?.detail).toContain(
      'cannot count as collected user feedback'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackExamplePointers.rows.find((row) => row.id === 'noPersistence')?.detail).toContain(
      '.plan.json'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.deferralReassessment).toMatchObject({
      headline: 'Annual sequencing is still not ready for a prototype decision.',
      status: 'stillDeferred',
      recommendation: expect.stringContaining('Continue feedback evidence and cleanup work'),
      boundary: expect.stringContaining('does not move to candidate status')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.deferralReassessment.rows).toEqual([
      expect.objectContaining({ id: 'coverage', status: 'review' }),
      expect.objectContaining({ id: 'quality', status: 'review' }),
      expect.objectContaining({ id: 'scope', status: 'blocked' }),
      expect.objectContaining({ id: 'performance', status: 'blocked' }),
      expect.objectContaining({ id: 'schemaUiRollback', status: 'blocked' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.deferralReassessment.status).not.toBe('considerDecisionPacketLater');
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.deferralReassessment.rows.find((row) => row.id === 'performance')?.detail).toContain(
      'No local-device performance budget'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.readinessMaintenancePlan).toMatchObject({
      headline: 'Readiness surface needs maintenance before more widening.',
      boundary: expect.stringContaining('organization guidance only')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.readinessMaintenancePlan.rows).toEqual([
      expect.objectContaining({ id: 'sectionLimit', status: 'review' }),
      expect.objectContaining({ id: 'mergeCandidates', status: 'review' }),
      expect.objectContaining({ id: 'staleDocs', status: 'review' }),
      expect.objectContaining({ id: 'testCoverage', status: 'review' }),
      expect.objectContaining({ id: 'checkpointOnly', status: 'blocked' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.readinessMaintenancePlan.rows.find((row) => row.id === 'checkpointOnly')?.detail).toContain(
      'cannot clear blockers'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackReviewScript).toMatchObject({
      headline: 'Feedback review script stays manual and unsaved.',
      boundary: expect.stringContaining('does not collect responses')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackReviewScript.rows).toEqual([
      expect.objectContaining({ id: 'overviewRead', status: 'review' }),
      expect.objectContaining({ id: 'detailsOpen', status: 'review' }),
      expect.objectContaining({ id: 'evidencePlayback', status: 'review' }),
      expect.objectContaining({ id: 'boundaryCheck', status: 'blocked' }),
      expect.objectContaining({ id: 'closeoutChoice', status: 'review' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackReviewScript.rows.find((row) => row.id === 'boundaryCheck')?.prompt).toContain(
      'saved instruction'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.performancePlanningQuestions).toMatchObject({
      headline: 'Performance planning needs questions before benchmarks.',
      boundary: expect.stringContaining('do not add benchmarks')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.performancePlanningQuestions.rows).toEqual([
      expect.objectContaining({ id: 'deviceTarget', status: 'blocked' }),
      expect.objectContaining({ id: 'candidateCap', status: 'blocked' }),
      expect.objectContaining({ id: 'timeoutRule', status: 'blocked' }),
      expect.objectContaining({ id: 'noWorkerYet', status: 'review' }),
      expect.objectContaining({ id: 'probeImpact', status: 'review' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.performancePlanningQuestions.rows.find((row) => row.id === 'timeoutRule')?.question).toContain(
      'local app feel stuck'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.conservativePostureCheckpoint).toMatchObject({
      headline: 'Conservative posture remains the right path.',
      status: 'continueDeferral',
      recommendation: expect.stringContaining('do not request a prototype decision yet'),
      boundary: expect.stringContaining('does not request approval')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.conservativePostureCheckpoint.rows).toEqual([
      expect.objectContaining({ id: 'doNext', status: 'review' }),
      expect.objectContaining({ id: 'doNotDo', status: 'blocked' }),
      expect.objectContaining({ id: 'decisionTrigger', status: 'blocked' }),
      expect.objectContaining({ id: 'rollbackPosture', status: 'review' }),
      expect.objectContaining({ id: 'chatContinuity', status: 'review' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.conservativePostureCheckpoint.rows.find((row) => row.id === 'doNotDo')?.detail).toContain(
      'background workers'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.readinessConsolidationSummary).toMatchObject({
      headline: 'Readiness review should be summary-first.',
      boundary: expect.stringContaining('organization guidance only')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.readinessConsolidationSummary.rows).toEqual([
      expect.objectContaining({ id: 'summaryFirst', status: 'review' }),
      expect.objectContaining({ id: 'groupBeforeAdding', status: 'review' }),
      expect.objectContaining({ id: 'supersedeDocs', status: 'review' }),
      expect.objectContaining({ id: 'detailsOnly', status: 'blocked' }),
      expect.objectContaining({ id: 'noPrototype', status: 'blocked' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.readinessConsolidationSummary.rows.find((row) => row.id === 'noPrototype')?.detail).toContain(
      'cannot authorize annual sequencing'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.uiRedesignReadinessBridge).toMatchObject({
      headline: 'UI redesign context is noted for later.',
      boundary: expect.stringContaining('does not redesign UI')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.uiRedesignReadinessBridge.rows).toEqual([
      expect.objectContaining({ id: 'briefReference', status: 'review' }),
      expect.objectContaining({ id: 'answerFirst', status: 'review' }),
      expect.objectContaining({ id: 'localFirstTrust', status: 'review' }),
      expect.objectContaining({ id: 'progressiveDisclosure', status: 'review' }),
      expect.objectContaining({ id: 'notYet', status: 'blocked' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.uiRedesignReadinessBridge.rows.find((row) => row.id === 'notYet')?.detail).toContain(
      'Do not start UI overhaul'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.checkpointArchivePolicy).toMatchObject({
      headline: 'Checkpoint docs need a supersession policy.',
      boundary: expect.stringContaining('does not delete docs')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.checkpointArchivePolicy.rows).toEqual([
      expect.objectContaining({ id: 'currentPosture', status: 'review' }),
      expect.objectContaining({ id: 'supersededDocs', status: 'review' }),
      expect.objectContaining({ id: 'decisionDocs', status: 'blocked' }),
      expect.objectContaining({ id: 'verificationNotes', status: 'review' }),
      expect.objectContaining({ id: 'noDeletion', status: 'blocked' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.checkpointArchivePolicy.rows.find((row) => row.id === 'decisionDocs')?.detail).toContain(
      'implies approval'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.consolidationCheckpoint).toMatchObject({
      headline: 'Consolidation is useful, but readiness is still deferred.',
      status: 'continueConsolidation',
      recommendation: expect.stringContaining('do not start annual sequencing or the UI overhaul yet'),
      boundary: expect.stringContaining('does not request approval')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.consolidationCheckpoint.rows).toEqual([
      expect.objectContaining({ id: 'panelHygiene', status: 'review' }),
      expect.objectContaining({ id: 'feedbackReadiness', status: 'review' }),
      expect.objectContaining({ id: 'performanceBoundary', status: 'blocked' }),
      expect.objectContaining({ id: 'uiRedesignTiming', status: 'blocked' }),
      expect.objectContaining({ id: 'nextPackage', status: 'review' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.consolidationCheckpoint.status).not.toBe('readyForUiOverhaul');
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.manualWorksheetPacket).toMatchObject({
      headline: 'Manual feedback worksheets stay outside the app.',
      boundary: expect.stringContaining('does not collect feedback')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.manualWorksheetPacket.rows).toEqual([
      expect.objectContaining({ id: 'printablePrompts', status: 'review' }),
      expect.objectContaining({ id: 'anonymizeOutsideApp', status: 'review' }),
      expect.objectContaining({ id: 'noInAppCapture', status: 'blocked' }),
      expect.objectContaining({ id: 'reviewStorage', status: 'blocked' }),
      expect.objectContaining({ id: 'closeoutSummary', status: 'review' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.manualWorksheetPacket.rows.find((row) => row.id === 'noInAppCapture')?.detail).toContain(
      'submit buttons'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.staticWorksheetExamples).toMatchObject({
      headline: 'Completed worksheet examples are static only.',
      boundary: expect.stringContaining('documentation fixtures only')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.staticWorksheetExamples.rows).toEqual([
      expect.objectContaining({ id: 'dbCompleted', status: 'review' }),
      expect.objectContaining({ id: 'bridgeCompleted', status: 'review' }),
      expect.objectContaining({ id: 'retiredCompleted', status: 'review' }),
      expect.objectContaining({ id: 'notEvidence', status: 'blocked' }),
      expect.objectContaining({ id: 'notSaved', status: 'blocked' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.staticWorksheetExamples.rows.find((row) => row.id === 'notEvidence')?.detail).toContain(
      'cannot count as real household feedback'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.manualScoringRubric).toMatchObject({
      headline: 'Manual scoring rubric stays outside the app.',
      boundary: expect.stringContaining('does not score users')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.manualScoringRubric.rows).toEqual([
      expect.objectContaining({ id: 'clear', status: 'review' }),
      expect.objectContaining({ id: 'watch', status: 'review' }),
      expect.objectContaining({ id: 'blocked', status: 'blocked' }),
      expect.objectContaining({ id: 'repeat', status: 'review' }),
      expect.objectContaining({ id: 'noScoreInApp', status: 'blocked' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.manualScoringRubric.rows.find((row) => row.id === 'noScoreInApp')?.detail).toContain(
      'scoring controls'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.manualFeedbackPrepCheckpoint).toMatchObject({
      headline: 'Manual feedback prep is ready to run outside the app.',
      status: 'readyToRunOutsideApp',
      recommendation: expect.stringContaining('three to five manual outside-app household reviews'),
      boundary: expect.stringContaining('does not collect feedback')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.manualFeedbackPrepCheckpoint.rows).toEqual([
      expect.objectContaining({ id: 'worksheetReady', status: 'review' }),
      expect.objectContaining({ id: 'examplesReady', status: 'review' }),
      expect.objectContaining({ id: 'scoringReady', status: 'review' }),
      expect.objectContaining({ id: 'appBoundary', status: 'blocked' }),
      expect.objectContaining({ id: 'nextDecision', status: 'review' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.manualFeedbackPrepCheckpoint.rows.find((row) => row.id === 'appBoundary')?.detail).toContain(
      'must not collect, save, score'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackResultsPlaceholder).toMatchObject({
      headline: 'No real feedback results are summarized yet.',
      status: 'noRealFeedbackYet',
      boundary: expect.stringContaining('does not create feedback')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackResultsPlaceholder.rows).toEqual([
      expect.objectContaining({ id: 'noRealResults', status: 'blocked' }),
      expect.objectContaining({ id: 'acceptedSources', status: 'review' }),
      expect.objectContaining({ id: 'summaryShape', status: 'review' }),
      expect.objectContaining({ id: 'doNotInfer', status: 'blocked' }),
      expect.objectContaining({ id: 'holdDecisions', status: 'blocked' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackResultsPlaceholder.rows.find((row) => row.id === 'doNotInfer')?.detail).toContain(
      'static examples'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackCopyCleanupTargets).toMatchObject({
      headline: 'Copy cleanup targets wait for real feedback.',
      boundary: expect.stringContaining('do not rewrite copy')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackCopyCleanupTargets.rows).toEqual([
      expect.objectContaining({ id: 'cashWedge', status: 'review' }),
      expect.objectContaining({ id: 'taxOas', status: 'review' }),
      expect.objectContaining({ id: 'recommendedPlan', status: 'review' }),
      expect.objectContaining({ id: 'accountOrder', status: 'blocked' }),
      expect.objectContaining({ id: 'noCleanupWithoutFeedback', status: 'blocked' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackCopyCleanupTargets.rows.find((row) => row.id === 'noCleanupWithoutFeedback')?.detail).toContain(
      'imagined feedback'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackEvidencePosture).toMatchObject({
      headline: 'Feedback evidence posture is still waiting.',
      status: 'waitingForRealFeedback',
      recommendation: expect.stringContaining('Wait for real outside-app feedback'),
      boundary: expect.stringContaining('does not create feedback')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackEvidencePosture.rows).toEqual([
      expect.objectContaining({ id: 'prepared', status: 'review' }),
      expect.objectContaining({ id: 'missing', status: 'blocked' }),
      expect.objectContaining({ id: 'blockedDecision', status: 'blocked' }),
      expect.objectContaining({ id: 'cleanupPosture', status: 'review' }),
      expect.objectContaining({ id: 'nextAction', status: 'review' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackEvidencePosture.rows.find((row) => row.id === 'missing')?.detail).toContain(
      'No anonymized outside-app household review notes'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackResultsCheckpoint).toMatchObject({
      headline: 'Feedback results review is still waiting for real notes.',
      status: 'stillWaiting',
      recommendation: expect.stringContaining('Run three to five outside-app household reviews'),
      boundary: expect.stringContaining('does not create feedback')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackResultsCheckpoint.rows).toEqual([
      expect.objectContaining({ id: 'results', status: 'blocked' }),
      expect.objectContaining({ id: 'cleanup', status: 'blocked' }),
      expect.objectContaining({ id: 'sequencing', status: 'blocked' }),
      expect.objectContaining({ id: 'uiOverhaul', status: 'blocked' }),
      expect.objectContaining({ id: 'nextPackage', status: 'review' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackResultsCheckpoint.status).not.toBe('readyToReviewResults');
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.readinessSlimmingPlan).toMatchObject({
      headline: 'Readiness surface should slim before more expansion.',
      boundary: expect.stringContaining('does not delete docs')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.readinessSlimmingPlan.rows).toEqual([
      expect.objectContaining({ id: 'summaryFirst', status: 'review' }),
      expect.objectContaining({ id: 'mergeOverlaps', status: 'review' }),
      expect.objectContaining({ id: 'docSupersession', status: 'review' }),
      expect.objectContaining({ id: 'detailsOnly', status: 'blocked' }),
      expect.objectContaining({ id: 'stopCondition', status: 'blocked' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.readinessSlimmingPlan.rows.find((row) => row.id === 'stopCondition')?.detail).toContain(
      'does not reduce confusion'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.readinessHandoffCheckpoint).toMatchObject({
      headline: 'Readiness work should pause for feedback or slimming.',
      status: 'pauseExpansion',
      recommendation: expect.stringContaining('Pause readiness expansion'),
      boundary: expect.stringContaining('does not request approval')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.readinessHandoffCheckpoint.rows).toEqual([
      expect.objectContaining({ id: 'outsideFeedback', status: 'review' }),
      expect.objectContaining({ id: 'panelSlimming', status: 'review' }),
      expect.objectContaining({ id: 'performanceBudget', status: 'blocked' }),
      expect.objectContaining({ id: 'prototypeDecision', status: 'blocked' }),
      expect.objectContaining({ id: 'uiOverhaul', status: 'blocked' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.readinessHandoffCheckpoint.status).not.toBe('readyForNextDecision');
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.readinessHandoffCheckpoint.rows.find((row) => row.id === 'uiOverhaul')?.detail).toContain(
      'Do not start UI overhaul'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.rows).toEqual([
      expect.objectContaining({ id: 'userClarity', status: 'review' }),
      expect.objectContaining({ id: 'performance', status: 'review' }),
      expect.objectContaining({ id: 'explainability', status: 'review' }),
      expect.objectContaining({ id: 'provinceEdgeCases', status: 'review' }),
      expect.objectContaining({ id: 'feedbackDepth', status: 'blocked' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.rows.find((row) => row.id === 'feedbackDepth')?.detail).toContain(
      'One successful example-plan review is not enough'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.architectureQuestions.map((row) => row.id)).toEqual([
      'funding',
      'estate',
      'taxOas',
      'cashFlexibility'
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.architectureQuestions.find((row) => row.id === 'funding')).toMatchObject({
      question: expect.stringContaining('improve funded years'),
      boundary: expect.stringContaining('no annual withdrawal path is generated')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.architectureQuestions.find((row) => row.id === 'cashFlexibility')).toMatchObject({
      evidenceSource: expect.stringContaining('Cash-wedge boundary'),
      boundary: expect.stringContaining('no refill rule')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.performanceBudget).toMatchObject({
      headline: 'Performance budget needs a separate architecture pass.',
      boundary: expect.stringContaining('do not run annual sequencing')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.performanceBudget.rows).toEqual([
      expect.objectContaining({ id: 'candidateLimit', status: 'ready' }),
      expect.objectContaining({ id: 'fullSuiteCost', status: 'review' }),
      expect.objectContaining({ id: 'routeProbeCaveat', status: 'review' }),
      expect.objectContaining({ id: 'deviceRisk', status: 'review' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.performanceBudget.rows.find((row) => row.id === 'fullSuiteCost')?.detail).toContain(
      'long pole'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.explainabilityGuide).toMatchObject({
      headline: 'Explainability must pass before annual account detail.',
      boundary: expect.stringContaining('do not create advice')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.explainabilityGuide.rows).toEqual([
      expect.objectContaining({ id: 'familyReason', status: 'review' }),
      expect.objectContaining({ id: 'evidencePriority', status: 'review' }),
      expect.objectContaining({ id: 'tradeoffLanguage', status: 'review' }),
      expect.objectContaining({ id: 'instructionBoundary', status: 'blocked' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.explainabilityGuide.rows.find((row) => row.id === 'familyReason')?.passSignal).toContain(
      'funded years, money left, tax, and OAS evidence'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.explainabilityGuide.rows.find((row) => row.id === 'instructionBoundary')?.detail).toContain(
      'exact withdrawal instructions'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.scopeRegister).toMatchObject({
      headline: 'Province and edge-case scope must stay narrow.',
      boundary: expect.stringContaining('do not add province support')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.scopeRegister.rows).toEqual([
      expect.objectContaining({ id: 'ontarioOnly', status: 'ready' }),
      expect.objectContaining({ id: 'lockedInAccounts', status: 'blocked' }),
      expect.objectContaining({ id: 'survivorSetup', status: 'review' }),
      expect.objectContaining({ id: 'lowIncomeBenefits', status: 'review' }),
      expect.objectContaining({ id: 'edgeCaseDecision', status: 'blocked' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.scopeRegister.rows.find((row) => row.id === 'lockedInAccounts')?.detail).toContain(
      'block annual sequencing architecture'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackDepthPlan).toMatchObject({
      headline: 'Feedback depth needs several household stories.',
      boundary: expect.stringContaining('do not collect personal feedback')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackDepthPlan.rows).toEqual([
      expect.objectContaining({ id: 'dbPensionCouple', status: 'review' }),
      expect.objectContaining({ id: 'earlyRetiredCouple', status: 'review' }),
      expect.objectContaining({ id: 'alreadyRetiredCouple', status: 'review' }),
      expect.objectContaining({ id: 'confusionSignals', status: 'blocked' }),
      expect.objectContaining({ id: 'decisionThreshold', status: 'blocked' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackDepthPlan.rows.find((row) => row.id === 'decisionThreshold')?.detail).toContain(
      'at least three household stories'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.architectureConstraints).toMatchObject({
      headline: 'Future sequencing architecture has hard non-goals.',
      boundary: expect.stringContaining('do not create a prototype')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.architectureConstraints.rows).toEqual([
      expect.objectContaining({ id: 'nonGoals', status: 'ready' }),
      expect.objectContaining({ id: 'candidateExplosion', status: 'blocked' }),
      expect.objectContaining({ id: 'schemaBoundary', status: 'blocked' }),
      expect.objectContaining({ id: 'uiBoundary', status: 'blocked' }),
      expect.objectContaining({ id: 'rollbackBoundary', status: 'ready' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.architectureConstraints.rows.find((row) => row.id === 'schemaBoundary')?.detail).toContain(
      'Do not change saved plan schema or engine output schema'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.prototypeDecisionRegister).toMatchObject({
      headline: 'Prototype decision remains blocked.',
      status: 'blocked',
      nextStep: expect.stringContaining('Keep deferring until every blocker is cleared'),
      boundary: expect.stringContaining('does not create an internal prototype')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.prototypeDecisionRegister.rows).toEqual([
      expect.objectContaining({ id: 'feedbackDepth', status: 'blocked' }),
      expect.objectContaining({ id: 'explainability', status: 'blocked' }),
      expect.objectContaining({ id: 'performance', status: 'review' }),
      expect.objectContaining({ id: 'scope', status: 'blocked' }),
      expect.objectContaining({ id: 'schema', status: 'blocked' }),
      expect.objectContaining({ id: 'ui', status: 'blocked' }),
      expect.objectContaining({ id: 'rollback', status: 'ready' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.prototypeDecisionRegister.rows.some((row) => row.status === 'blocked')).toBe(true);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.prototypeDecisionRegister.status).not.toBe('internal-test-only-candidate');
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.prototypeDecisionRegister.rows.find((row) => row.id === 'schema')?.detail).toContain(
      'Saved plan schema and engine output schema'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.rollbackContainmentPlan).toMatchObject({
      headline: 'Rollback containment must be proven before any prototype.',
      boundary: expect.stringContaining('does not add a sequencing module')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.rollbackContainmentPlan.rows).toEqual([
      expect.objectContaining({ id: 'oneCommitRemoval', status: 'ready' }),
      expect.objectContaining({ id: 'internalBoundaryName', status: 'review' }),
      expect.objectContaining({ id: 'persistenceAudit', status: 'blocked' }),
      expect.objectContaining({ id: 'uiContainment', status: 'blocked' }),
      expect.objectContaining({ id: 'verificationBeforeMerge', status: 'review' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.rollbackContainmentPlan.rows.find((row) => row.id === 'persistenceAudit')?.detail).toContain(
      'No .plan.json files'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.rollbackContainmentPlan.rows.find((row) => row.id === 'uiContainment')?.detail).toContain(
      'Overview, compact Details, apply actions, save actions'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.testOnlyShapePlan).toMatchObject({
      headline: 'Test-only prototype shape remains planning-only.',
      boundary: expect.stringContaining('do not implement sequencing')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.testOnlyShapePlan.rows).toEqual([
      expect.objectContaining({ id: 'existingAnnualRows', status: 'review' }),
      expect.objectContaining({ id: 'accountBuckets', status: 'review' }),
      expect.objectContaining({ id: 'allowedDiagnostics', status: 'review' }),
      expect.objectContaining({ id: 'disallowedOutputs', status: 'blocked' }),
      expect.objectContaining({ id: 'planningOnly', status: 'blocked' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.testOnlyShapePlan.rows.find((row) => row.id === 'allowedDiagnostics')?.detail).toContain(
      'funded years, money left, tax and OAS changes'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.testOnlyShapePlan.rows.find((row) => row.id === 'disallowedOutputs')?.detail).toContain(
      'Disallow account instructions'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.prototypeReadinessSummary).toMatchObject({
      headline: 'Annual sequencing prototype is still blocked.',
      status: 'stillBlocked',
      decision: expect.stringContaining('Keep deferring'),
      boundary: expect.stringContaining('does not start a prototype')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.prototypeReadinessSummary.rows).toEqual([
      expect.objectContaining({ id: 'feedback', status: 'blocked' }),
      expect.objectContaining({ id: 'scope', status: 'blocked' }),
      expect.objectContaining({ id: 'performance', status: 'review' }),
      expect.objectContaining({ id: 'schemaUi', status: 'blocked' }),
      expect.objectContaining({ id: 'rollback', status: 'ready' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.prototypeReadinessSummary.status).not.toBe('maybeInternalLater');
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.prototypeReadinessSummary.rows.find((row) => row.id === 'schemaUi')?.detail).toContain(
      'Overview, compact Details, apply actions, and save actions remain out of scope'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.blockerClearanceEvidence).toMatchObject({
      headline: 'Blockers need evidence before they can move.',
      boundary: expect.stringContaining('does not clear blockers')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.blockerClearanceEvidence.rows).toEqual([
      expect.objectContaining({ id: 'feedbackArtifacts', status: 'needed' }),
      expect.objectContaining({ id: 'explainabilityPlayback', status: 'needed' }),
      expect.objectContaining({ id: 'performanceMeasurement', status: 'needed' }),
      expect.objectContaining({ id: 'scopeDecisionLog', status: 'blocked' }),
      expect.objectContaining({ id: 'schemaUiDiff', status: 'blocked' }),
      expect.objectContaining({ id: 'rollbackRehearsal', status: 'needed' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.blockerClearanceEvidence.rows.find((row) => row.id === 'schemaUiDiff')?.clearanceSignal).toContain(
      'no saved output, no engine output widening'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.blockerClearanceEvidence.rows.find((row) => row.id === 'explainabilityPlayback')?.clearanceSignal).toContain(
      'without asking for exact account draw orders'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackArtifactTemplate).toMatchObject({
      headline: 'Feedback artifacts need consistent review prompts.',
      boundary: expect.stringContaining('do not collect feedback')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackArtifactTemplate.rows).toEqual([
      expect.objectContaining({ id: 'rememberedAnswer' }),
      expect.objectContaining({ id: 'evidenceRanking' }),
      expect.objectContaining({ id: 'instructionBoundary' }),
      expect.objectContaining({ id: 'cashFlexibilityLanguage' }),
      expect.objectContaining({ id: 'decisionOutcome' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackArtifactTemplate.rows.find((row) => row.id === 'rememberedAnswer')?.passSignal).toContain(
      'after-tax monthly spending range'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackArtifactTemplate.rows.find((row) => row.id === 'instructionBoundary')?.blockedSignal).toContain(
      'which account to withdraw from each year'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackCloseoutRubric).toMatchObject({
      headline: 'Feedback closeout needs a conservative rubric.',
      boundary: expect.stringContaining('does not score users')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackCloseoutRubric.rows).toEqual([
      expect.objectContaining({ id: 'pass', status: 'review' }),
      expect.objectContaining({ id: 'watch', status: 'review' }),
      expect.objectContaining({ id: 'blocked', status: 'blocked' }),
      expect.objectContaining({ id: 'defer', status: 'blocked' }),
      expect.objectContaining({ id: 'repeat', status: 'review' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackCloseoutRubric.rows.find((row) => row.id === 'blocked')?.detail).toContain(
      'exact annual account withdrawals'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackCloseoutRubric.rows.find((row) => row.id === 'pass')?.nextStep).toContain(
      'not as prototype approval'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackDecisionLedger).toMatchObject({
      headline: 'Feedback decisions need a lightweight ledger.',
      boundary: expect.stringContaining('does not store feedback')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackDecisionLedger.rows).toEqual([
      expect.objectContaining({ id: 'collectMore', status: 'review' }),
      expect.objectContaining({ id: 'cleanCopy', status: 'review' }),
      expect.objectContaining({ id: 'cleanInputs', status: 'review' }),
      expect.objectContaining({ id: 'holdSequencing', status: 'blocked' }),
      expect.objectContaining({ id: 'reassessLater', status: 'blocked' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackDecisionLedger.rows.find((row) => row.id === 'holdSequencing')?.detail).toContain(
      'exact account withdrawals'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackDecisionLedger.rows.find((row) => row.id === 'reassessLater')?.evidenceNeeded).toContain(
      'every blocker has evidence'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackCoverageMatrix).toMatchObject({
      headline: 'Feedback coverage must span several household stories.',
      boundary: expect.stringContaining('does not collect feedback')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackCoverageMatrix.rows).toEqual([
      expect.objectContaining({ id: 'dbPensionCouple', status: 'review' }),
      expect.objectContaining({ id: 'bridgeYears', status: 'review' }),
      expect.objectContaining({ id: 'alreadyRetired', status: 'review' }),
      expect.objectContaining({ id: 'survivorCase', status: 'blocked' }),
      expect.objectContaining({ id: 'lowIncomeBoundary', status: 'blocked' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackCoverageMatrix.rows.find((row) => row.id === 'survivorCase')?.missingEvidence).toContain(
      'does not turn pension or account detail into advice'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.feedbackCoverageMatrix.rows.find((row) => row.id === 'lowIncomeBoundary')?.detail).toContain(
      'out of scope unless explicitly planned'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.evidenceQualityChecklist).toMatchObject({
      headline: 'Feedback evidence needs quality checks before it counts.',
      boundary: expect.stringContaining('does not save feedback')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.evidenceQualityChecklist.rows).toEqual([
      expect.objectContaining({ id: 'specificQuote', status: 'review' }),
      expect.objectContaining({ id: 'scenarioContext', status: 'review' }),
      expect.objectContaining({ id: 'evidenceOrder', status: 'review' }),
      expect.objectContaining({ id: 'confusionSignal', status: 'blocked' }),
      expect.objectContaining({ id: 'nonPersistence', status: 'blocked' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.evidenceQualityChecklist.rows.find((row) => row.id === 'confusionSignal')?.detail).toContain(
      'account-order'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.evidenceQualityChecklist.rows.find((row) => row.id === 'nonPersistence')?.guardrail).toContain(
      'No .plan.json files'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.prototypeDecisionPacket).toMatchObject({
      headline: 'A prototype decision packet is not ready.',
      boundary: expect.stringContaining('does not ask for approval')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.prototypeDecisionPacket.rows).toEqual([
      expect.objectContaining({ id: 'feedbackSummary', status: 'review' }),
      expect.objectContaining({ id: 'scopeSummary', status: 'blocked' }),
      expect.objectContaining({ id: 'performanceSummary', status: 'blocked' }),
      expect.objectContaining({ id: 'schemaUiSummary', status: 'blocked' }),
      expect.objectContaining({ id: 'rollbackSummary', status: 'review' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.prototypeDecisionPacket.rows.find((row) => row.id === 'schemaUiSummary')?.requiredBeforeAsk).toContain(
      'no saved fields'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.prototypeDecisionPacket.rows.find((row) => row.id === 'performanceSummary')?.requiredBeforeAsk).toContain(
      'without server assumptions'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.readinessRunway).toMatchObject({
      headline: 'Readiness runway still points to deferral.',
      status: 'defer',
      recommendation: expect.stringContaining('Keep annual sequencing deferred'),
      boundary: expect.stringContaining('does not request a decision')
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.readinessRunway.rows).toEqual([
      expect.objectContaining({ id: 'keepDeferring', status: 'blocked' }),
      expect.objectContaining({ id: 'nextEvidence', status: 'review' }),
      expect.objectContaining({ id: 'nextCleanup', status: 'review' }),
      expect.objectContaining({ id: 'nextPerformance', status: 'blocked' }),
      expect.objectContaining({ id: 'explicitDecisionLater', status: 'blocked' })
    ]);
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.readinessRunway.rows.find((row) => row.id === 'explicitDecisionLater')?.detail).toContain(
      'only after the future decision packet is complete'
    );
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.readinessRunway.rows.find((row) => row.id === 'nextPerformance')?.detail).toContain(
      'local-device performance budget'
    );
    expect(summary.feedbackPackageIndex.nextCheckpoint).toContain('Close broad withdrawal-family feedback');
    expect(createPlanFile(readyPlan()).plan).not.toHaveProperty('goalReview');
    expect(createPlanFile(readyPlan()).plan).not.toHaveProperty('feedbackPackageIndex');
    expect(summary.evidenceRows.find((row) => row.id === 'withdrawalFamilyFirst')).toMatchObject({
      label: 'Withdrawal family to compare',
      value: 'Registered first'
    });
    expect(summary.evidenceRows.find((row) => row.id === 'withdrawalFamilyLifetimeTax')).toMatchObject({
      value: '-$10,000',
      tone: 'ok'
    });
    expect(summary.evidenceRows.find((row) => row.id === 'withdrawalFamilyFirstYearTax')).toMatchObject({
      value: '-$3,333',
      tone: 'ok'
    });
    expect(summary.evidenceRows.find((row) => row.id === 'withdrawalFamilyPeakTax')).toMatchObject({
      value: '-$3,333',
      tone: 'ok'
    });
    expect(summary.withdrawalFeedbackReview).toMatchObject({
      status: 'readyForFeedback',
      headline: 'Broad withdrawal-family evidence is ready for feedback.',
      nextDecision: expect.stringContaining('before planning annual account-level sequencing')
    });
    expect(summary.withdrawalFeedbackReview.rows).toEqual([
      expect.objectContaining({ id: 'familyPresence', status: 'ready' }),
      expect.objectContaining({ id: 'evidenceClarity', status: 'ready' }),
      expect.objectContaining({ id: 'annualInstructionBoundary', status: 'ready' }),
      expect.objectContaining({ id: 'guardrails', status: 'ready' }),
      expect.objectContaining({ id: 'savedOutputBoundary', status: 'ready' })
    ]);
    expect(summary.withdrawalFeedbackReview.questions.join(' ')).toContain('current plan versus broad withdrawal-family comparison');
    expect(summary.withdrawalFeedbackReview.questions.join(' ')).toContain(
      'funded years, money left, tax, and OAS recovery are evidence, not instructions'
    );
    expect(summary.withdrawalFeedbackReview.questions.join(' ')).toContain('annual account-level sequencing is still deferred');
    expect(summary.withdrawalFeedbackReview.confusionSignals.join(' ')).toContain('year-by-year withdrawal instruction');
    expect(summary.withdrawalFeedbackReview.confusionSignals.join(' ')).toContain('advice instead of plan-review evidence');
    expect(summary.withdrawalFeedbackReview.worksheet.map((item) => item.id)).toEqual(['understanding', 'evidence', 'boundary', 'decision']);
    expect(summary.withdrawalFeedbackReview.worksheet.find((item) => item.id === 'boundary')).toMatchObject({
      label: 'Instruction boundary',
      passSignal: expect.stringContaining('annual account-level sequencing is deferred')
    });
    expect(summary.withdrawalFeedbackReview.decision).toMatchObject({
      status: 'collectFeedback',
      label: 'Collect feedback before annual sequencing',
      detail: expect.stringContaining('not annual account-level architecture')
    });
    expect(summary.withdrawalFeedbackReview.decision.requiredEvidence.join(' ')).toContain('money-left and tax rows as evidence');
    expect(summary.withdrawalFeedbackReview.decision.requiredEvidence.join(' ')).toContain('do not read the output as account instructions');
    expect(summary.withdrawalFeedbackReview.outcome).toMatchObject({
      status: 'readyToReview',
      label: 'Ready to review with testers',
      detail: expect.stringContaining('before annual sequencing is planned')
    });
    expect(summary.withdrawalFeedbackReview.outcome.nextSteps.join(' ')).toContain('Hold annual sequencing if any confusion signal appears');
    expect(summary.withdrawalFeedbackReview.closeoutSummary).toMatchObject({
      status: 'readyToClose',
      label: 'Feedback loop ready to close',
      evidenceSummary: expect.stringContaining('funded years, money left, tax, and OAS recovery'),
      boundarySummary: expect.stringContaining('does not create annual account instructions or saved output')
    });
    expect(summary.guardrailNotes.find((note) => note.id === 'benefitTiming')).toMatchObject({
      status: 'tested',
      reason: expect.stringContaining('can be reviewed')
    });
    expect(summary.recommendationNotes.find((note) => note.candidateId === 'spendLess10')).toMatchObject({
      status: 'canHighlight',
      reason: expect.stringContaining('materially improves a visible funding shortfall')
    });
    expect(summary.recommendationNotes.find((note) => note.candidateId === 'withdrawalRegisteredFirst')).toMatchObject({
      status: 'canHighlight',
      reason: expect.stringContaining('without changing lifestyle or work timing')
    });
    expect(calls).toHaveLength(18);
    expect(createPlanFile(readyPlan()).plan).not.toHaveProperty('boundedOptimizer');
  });

  it('adds bridge-year evidence for the benefit timing check', () => {
    const summary = runBoundedOptimizer(readyPlan(), (candidatePlan, config) => {
      if (config.cppAgeF === 70) return result(500000, 70000, 2033);
      return candidatePlan.spending.gogo === readyPlan().spending.gogo ? result(100000, 90000, null) : result(90000, 95000, null);
    });

    expect(summary.evidenceRows.map((row) => row.id)).toEqual([
      'benefitGridBestPair',
      'benefitGridTopThree',
      'benefitGridFundedYears',
      'benefitGridLifetimeTax',
      'benefitGridPortfolio',
      'benefitBridgeYears',
      'benefitFirstBridgeShortfall',
      'benefitLifetimeTax',
      'benefitPortfolio'
    ]);
    expect(summary.evidenceRows.find((row) => row.id === 'benefitGridBestPair')).toMatchObject({
      label: 'First milestone pair to review',
      value: expect.stringContaining('CPP')
    });
    expect(summary.evidenceRows.find((row) => row.id === 'benefitGridTopThree')).toMatchObject({
      label: 'Other milestone pairs to compare',
      value: expect.stringContaining('CPP')
    });
    expect(summary.evidenceRows.find((row) => row.id === 'benefitBridgeYears')).toMatchObject({
      label: 'Bridge years before age 70',
      value: '1 shortfall year',
      tone: 'watch'
    });
    expect(summary.recommendationNotes.find((note) => note.candidateId === 'delayBenefits')).toMatchObject({
      status: 'reviewOnly',
      reason: expect.stringContaining('1 bridge year before age 70')
    });
  });

  it('explains why benefit timing is skipped when estimates or age-70 timing are not ready', () => {
    const missingEstimate = readyPlan();
    missingEstimate.p1.oas_monthly = 0;
    const already70 = readyPlan();
    already70.p1.dob = 1960;
    const shortProjection = readyPlan();
    shortProjection.assumptions.planEnd = 2035;

    expect(runBoundedOptimizer(missingEstimate, () => result(100000, 90000)).eligibilityNotes.find((note) => note.lever === 'benefitTiming')).toMatchObject({
      status: 'skipped',
      reason: expect.stringContaining('needs CPP and OAS estimates')
    });
    expect(runBoundedOptimizer(already70, () => result(100000, 90000)).eligibilityNotes.find((note) => note.lever === 'benefitTiming')).toMatchObject({
      status: 'skipped',
      reason: expect.stringContaining('already age 70 or older')
    });
    expect(runBoundedOptimizer(shortProjection, () => result(100000, 90000)).eligibilityNotes.find((note) => note.lever === 'benefitTiming')).toMatchObject({
      status: 'skipped',
      reason: expect.stringContaining('does not reach age 70')
    });
  });

  it('includes DB pension splitting in the current-plan baseline instead of making it a found option', () => {
    const plan = readyPlan();
    plan.p2 = {
      ...plan.p2,
      name: 'Morgan',
      dob: 1969,
      retireYear: 2033,
      rrsp: 120000,
      tfsa: 70000,
      cpp65_monthly: 900,
      cpp70_monthly: 1250,
      oas_monthly: 742
    };
    plan.p1.db_after65 = 30000;
    plan.p1.oas_monthly = 0;
    plan.assumptions.cppSharing = true;
    plan.assumptions.p1DiesInSurvivor = 2040;

    const candidates = buildBoundedOptimizerCandidates(plan);
    const summary = runBoundedOptimizer(plan, (_candidatePlan, config) =>
      config.pensionSplit ? result(180000, 78000, null, { oasRecovery: 3000 }) : result(120000, 90000, null, { oasRecovery: 9000 })
    );

    expect(candidates.find((candidate) => candidate.id === 'baseline')?.config).toMatchObject({ pensionSplit: true });
    expect(candidates.map((candidate) => candidate.id)).not.toContain('pensionSplit');
    expect(summary.eligibilityNotes.find((note) => note.lever === 'pensionSplitting')).toMatchObject({
      status: 'skipped',
      reason: expect.stringContaining('included in the current plan baseline')
    });
    expect(summary.suggestedCandidateId).toBe('baseline');
  });

  it('adds one bounded pension-splitting candidate for registered-income review plans without DB pensions', () => {
    const plan = readyPlan();
    plan.p2 = {
      ...plan.p2,
      name: 'Morgan',
      dob: 1969,
      retireYear: 2033,
      rrsp: 120000,
      tfsa: 70000,
      cpp65_monthly: 900,
      cpp70_monthly: 1250,
      oas_monthly: 742
    };
    plan.p1.oas_monthly = 0;
    plan.assumptions.cppSharing = true;
    plan.assumptions.p1DiesInSurvivor = 2040;

    const candidates = buildBoundedOptimizerCandidates(plan);
    const summary = runBoundedOptimizer(plan, (candidatePlan, config) =>
      config.pensionSplit ? result(180000, 78000, null, { oasRecovery: 3000 }) : result(120000, 90000, null, { oasRecovery: 9000 })
    );

    expect(candidates.find((candidate) => candidate.id === 'baseline')?.config).toMatchObject({ pensionSplit: false });
    expect(candidates.map((candidate) => candidate.id)).toContain('pensionSplit');
    expect(candidates.find((candidate) => candidate.id === 'pensionSplit')).toMatchObject({
      label: 'Test pension splitting',
      config: expect.objectContaining({ pensionSplit: true }),
      changedLevers: ['pensionSplitting']
    });
    expect(summary.eligibilityNotes.find((note) => note.lever === 'pensionSplitting')).toMatchObject({ status: 'eligible' });
    expect(summary.suggestedCandidateId).toBe('pensionSplit');
    expect(summary.explanation.tradeoffs.join(' ')).toContain('Pension-splitting');
    expect(summary.evidenceRows.map((row) => row.id)).toEqual([
      'pensionLifetimeTax',
      'pensionFirstYearTax',
      'pensionPeakTax',
      'pensionOasRecovery',
      'pensionPortfolio'
    ]);
    expect(summary.evidenceRows.find((row) => row.id === 'pensionLifetimeTax')).toMatchObject({
      label: 'Lifetime tax change',
      value: '-$12,000',
      tone: 'ok'
    });
    expect(summary.evidenceRows.find((row) => row.id === 'pensionPortfolio')).toMatchObject({
      label: 'Projected money-left change',
      value: '+$60,000',
      tone: 'ok'
    });
    expect(summary.driverRows.find((row) => row.id === 'oasRecovery')).toMatchObject({
      label: 'OAS recovery tax',
      value: '-$6,000',
      tone: 'ok'
    });
  });

  it('does not carry older diagnostic withdrawal order settings into consumer optimizer candidates', () => {
    const plan = readyPlan();
    plan.assumptions.withdrawalOrder = 'meltdown';

    const candidates = buildBoundedOptimizerCandidates(plan);

    expect(candidates.find((candidate) => candidate.id === 'baseline')?.config).toMatchObject({
      meltdown: false,
      withdrawalOrder: 'default'
    });
  });

  it('requires registered and TFSA/non-registered buckets for withdrawal-family checks', () => {
    const plan = readyPlan();
    plan.p1.tfsa = 0;
    plan.p1.nonreg = 0;
    plan.cashWedge = { balance: 100000 };

    const summary = runBoundedOptimizer(plan, () => result(100000, 90000));

    expect(summary.readinessRows.find((row) => row.id === 'accountBuckets')).toMatchObject({
      status: 'review',
      detail: expect.stringContaining('TFSA/non-registered')
    });
    expect(summary.eligibilityNotes.find((note) => note.lever === 'withdrawalOrder')).toMatchObject({
      status: 'skipped',
      reason: expect.stringContaining('TFSA/non-registered')
    });
    expect(summary.candidates.map((candidate) => candidate.id)).not.toContain('withdrawalRegisteredFirst');
    expect(summary.candidates.map((candidate) => candidate.id)).not.toContain('withdrawalNonRegisteredFirst');
  });

  it('adds one bounded CPP sharing candidate for eligible couples without mutating the source plan', () => {
    const plan = cppSharingPlan();
    const candidates = buildBoundedOptimizerCandidates(plan);
    const cppSharingCandidates = candidates.filter((candidate) => candidate.id === 'cppSharing');
    const summary = runBoundedOptimizer(plan, (candidatePlan) =>
      candidatePlan.assumptions.cppSharing
        ? result(180000, 78000, null, { oasRecovery: 3000 })
        : result(120000, 90000, null, { oasRecovery: 9000 })
    );

    expect(cppSharingCandidates).toHaveLength(1);
    expect(cppSharingCandidates[0]).toMatchObject({
      label: 'Test CPP sharing',
      changedLevers: ['cppSharing'],
      changeSummary: 'Turn on CPP sharing in this test'
    });
    expect(cppSharingCandidates[0].plan.assumptions.cppSharing).toBe(true);
    expect(plan.assumptions.cppSharing).toBe(false);
    expect(summary.eligibilityNotes.find((note) => note.lever === 'cppSharing')).toMatchObject({ status: 'eligible' });
    expect(summary.suggestedCandidateId).toBe('cppSharing');
    expect(summary.explanation.tradeoffs.join(' ')).toContain('CPP sharing');
    expect(summary.recommendationNotes.find((note) => note.candidateId === 'cppSharing')).toMatchObject({
      status: 'canHighlight',
      reason: expect.stringContaining('without changing lifestyle or work timing')
    });
    expect(summary.evidenceRows.map((row) => row.id)).toEqual([
      'cppSharingLifetimeTax',
      'cppSharingFirstYearTax',
      'cppSharingPeakTax',
      'cppSharingOasRecovery',
      'cppSharingPortfolio'
    ]);
    expect(summary.evidenceRows.find((row) => row.id === 'cppSharingLifetimeTax')).toMatchObject({
      label: 'CPP sharing lifetime tax change',
      value: '-$12,000',
      tone: 'ok'
    });
    expect(summary.evidenceRows.find((row) => row.id === 'cppSharingOasRecovery')).toMatchObject({
      value: '-$6,000',
      tone: 'ok'
    });
    expect(summary.evidenceRows.find((row) => row.id === 'cppSharingPortfolio')).toMatchObject({
      value: '+$60,000',
      tone: 'ok'
    });
    expect(summary.optionGroups.find((group) => group.id === 'incomeSharing')).toMatchObject({
      label: 'Income-sharing checks',
      candidateIds: ['cppSharing']
    });
    const savedPlan = createPlanFile(plan).plan;
    const runtimePlan = extractPlanPayload(createPlanFile(plan));
    expect(savedPlan).not.toHaveProperty('boundedOptimizer');
    expect(runtimePlan.assumptions.cppSharing).toBe(false);
  });

  it('skips CPP sharing for single plans, missing CPP estimates, and plans where it is already on', () => {
    const single = readyPlan();
    const missingCpp = cppSharingPlan();
    missingCpp.p2.cpp65_monthly = 0;
    missingCpp.p2.cpp70_monthly = 0;
    const alreadyOn = cppSharingPlan();
    alreadyOn.assumptions.cppSharing = true;

    expect(buildBoundedOptimizerCandidates(single).map((candidate) => candidate.id)).not.toContain('cppSharing');
    expect(runBoundedOptimizer(single, () => result(100000, 90000)).eligibilityNotes.find((note) => note.lever === 'cppSharing')).toMatchObject({
      status: 'skipped',
      reason: expect.stringContaining('two-person plan')
    });
    expect(buildBoundedOptimizerCandidates(missingCpp).map((candidate) => candidate.id)).not.toContain('cppSharing');
    expect(runBoundedOptimizer(missingCpp, () => result(100000, 90000)).eligibilityNotes.find((note) => note.lever === 'cppSharing')).toMatchObject({
      status: 'skipped',
      reason: expect.stringContaining('both people have CPP estimates')
    });
    expect(buildBoundedOptimizerCandidates(alreadyOn).map((candidate) => candidate.id)).not.toContain('cppSharing');
    expect(runBoundedOptimizer(alreadyOn, () => result(100000, 90000)).eligibilityNotes.find((note) => note.lever === 'cppSharing')).toMatchObject({
      status: 'skipped',
      reason: expect.stringContaining('already included')
    });
  });

  it('marks optimizer readiness gaps for missing benefits, weak buckets, partial home sale, and survivor setup', () => {
    const plan = cppSharingPlan();
    plan.p1.cpp65_monthly = 0;
    plan.p1.cpp70_monthly = 0;
    plan.p1.oas_monthly = 0;
    plan.p1.rrsp = 0;
    plan.p1.tfsa = 0;
    plan.p1.nonreg = 0;
    plan.p2.rrsp = 0;
    plan.p2.tfsa = 0;
    plan.p2.nonreg = 0;
    plan.downsize = { year: 2040, netProceeds: 0 };
    plan.assumptions.p1DiesInSurvivor = 0;

    const summary = runBoundedOptimizer(plan, () => result(100000, 90000));

    expect(summary.readinessRows.find((row) => row.id === 'benefitEstimates')).toMatchObject({ status: 'blocked' });
    expect(summary.readinessRows.find((row) => row.id === 'accountBuckets')).toMatchObject({ status: 'review' });
    expect(summary.readinessRows.find((row) => row.id === 'homeSale')).toMatchObject({ status: 'blocked' });
    expect(summary.readinessRows.find((row) => row.id === 'survivor')).toMatchObject({ status: 'review' });
    expect(summary.candidateFamilies.find((family) => family.id === 'benefitTimingGrid')).toMatchObject({ status: 'blocked' });
    expect(summary.candidateFamilies.find((family) => family.id === 'broadWithdrawalFamilies')).toMatchObject({ status: 'blocked' });
    expect(summary.withdrawalFeedbackReview).toMatchObject({
      status: 'needsInputReview',
      headline: 'Broad withdrawal-family feedback needs input cleanup first.'
    });
    expect(summary.withdrawalFeedbackReview.rows.find((row) => row.id === 'familyPresence')).toMatchObject({
      status: 'blocked',
      detail: expect.stringContaining('meaningful registered and flexible account balances')
    });
    expect(summary.withdrawalFeedbackReview.questions.join(' ')).toContain('Which missing input');
    expect(summary.withdrawalFeedbackReview.worksheet.find((item) => item.id === 'understanding')).toMatchObject({
      label: 'Input understanding',
      prompt: expect.stringContaining('missing input')
    });
    expect(summary.withdrawalFeedbackReview.decision).toMatchObject({
      status: 'cleanUpInputs',
      label: 'Clean up inputs before feedback'
    });
    expect(summary.withdrawalFeedbackReview.outcome).toMatchObject({
      status: 'repairInputs',
      label: 'Repair inputs first'
    });
    expect(summary.withdrawalFeedbackReview.outcome.nextSteps.join(' ')).toContain('Do not plan annual sequencing from a blocked comparison');
    expect(summary.withdrawalFeedbackReview.closeoutSummary).toMatchObject({
      status: 'inputCleanupFirst',
      label: 'Closeout blocked by inputs',
      boundarySummary: expect.stringContaining('not a plan change or account instruction')
    });
    expect(summary.feedbackPackageIndex.rows.find((row) => row.id === 'withdrawalFamilyFeedback')).toMatchObject({
      status: 'blocked'
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness).toMatchObject({
      status: 'notReady',
      headline: 'Annual sequencing is not ready to plan.'
    });
    expect(summary.feedbackPackageIndex.annualSequencingReadiness.rows.find((row) => row.id === 'userClarity')).toMatchObject({
      status: 'blocked'
    });
    expect(summary.feedbackPackageIndex.nextCheckpoint).toContain('Resolve blocked or unclear feedback evidence');
    expect(summary.searchPlan.jointCoupleSearch).toBe(true);
    expect(summary.searchPlan.benefitSearch).toHaveLength(2);
    expect(summary.searchPlan.benefitSearch.find((space) => space.person === 'p1')).toMatchObject({ status: 'blocked' });
  });

  it('covers feedback outcome states with example-plan based review cases', () => {
    const readyExample = createExamplePlan('public-comparator-single');
    const holdExample = createExamplePlan('retired-traditional');
    holdExample.assumptions.p1DiesInSurvivor = 0;
    const blockedExample = createExamplePlan('public-comparator-single');
    blockedExample.p1.rrsp = 0;
    blockedExample.p1.tfsa = 0;
    blockedExample.p1.nonreg = 0;
    const broadFamilyLeads = (_candidatePlan: V2PlanPayload, config: SimulationConfig) =>
      config.withdrawalOrder === 'registered-first' ? result(180000, 70000) : result(120000, 80000);

    const cases = [
      runBoundedOptimizer(readyExample, broadFamilyLeads),
      runBoundedOptimizer(holdExample, broadFamilyLeads),
      runBoundedOptimizer(blockedExample, broadFamilyLeads)
    ];

    expect(cases.map((summary) => summary.withdrawalFeedbackReview.outcome.status)).toEqual([
      'readyToReview',
      'deferSequencing',
      'repairInputs'
    ]);
    expect(cases.map((summary) => summary.withdrawalFeedbackReview.closeoutSummary.status)).toEqual([
      'readyToClose',
      'holdAndSimplify',
      'inputCleanupFirst'
    ]);
    cases.forEach((summary) => {
      expect(summary.withdrawalFeedbackReview.closeoutSummary.boundarySummary).not.toMatch(/advice|recommendation|do this/i);
    });
    expect(examplePlanCards.map((card) => card.id)).toContain('public-comparator-single');
    expect(examplePlanCards.map((card) => card.id)).toContain('retired-traditional');
  });

  it('keeps example-plan optimizer outcome matrix within current runtime boundaries', () => {
    const exampleIds = examplePlanCards.map((card) => card.id);
    const broadFamilyLeads = (_candidatePlan: V2PlanPayload, config: SimulationConfig) =>
      config.withdrawalOrder === 'registered-first' ? result(180000, 70000) : result(120000, 80000);
    const summaries = exampleIds.map((id) => runBoundedOptimizer(createExamplePlan(id), broadFamilyLeads));

    expect(summaries).toHaveLength(exampleIds.length);
    summaries.forEach((summary) => {
      expect(summary.candidateCount).toBeLessThanOrEqual(20);
      expect(summary.searchPlan.annualOverrides).toBe('deferred');
      expect(summary.goalReview.architecture.rows.find((row) => row.id === 'sameCandidateSet')).toMatchObject({ status: 'ready' });
      expect(summary.goalReview.architecture.rows.find((row) => row.id === 'sequencingDeferred')).toMatchObject({ status: 'deferred' });
      expect(summary.goalReview.goalModePreview.rows.map((row) => row.topCandidateId).every((id) => !id || summary.candidates.some((candidate) => candidate.id === id))).toBe(true);
      expect(summary.feedbackPackageIndex.rows.find((row) => row.id === 'annualSequencing')).toMatchObject({ status: 'deferred' });
      expect(summary.compactEvidenceRows.map((row) => row.id)).toEqual([
        'monthlySpend',
        'fundedYears',
        'moneyLeft',
        'lifetimeTax',
        'oasRecovery'
      ]);
    });
    expect(summaries.map((summary) => summary.withdrawalFeedbackReview.status)).toEqual(
      summaries.map(() => 'readyForFeedback')
    );
    expect(new Set(summaries.flatMap((summary) => summary.feedbackPackageIndex.rows.map((row) => row.status)))).toEqual(
      new Set(['ready', 'review', 'deferred'])
    );
  });

  it('keeps richer example-plan feedback slices focused on first-review evidence', () => {
    const feedbackExampleIds = ['db-pension-couple', 'fire-couple', 'retired-traditional'] as const;
    const broadFamilyLeads = (_candidatePlan: V2PlanPayload, config: SimulationConfig) =>
      config.withdrawalOrder === 'registered-first'
        ? result(220000, 72000, null, { oasRecovery: 2000 })
        : result(140000, 84000, null, { oasRecovery: 5000 });

    const summaries = feedbackExampleIds.map((id) => runBoundedOptimizer(createExamplePlan(id), broadFamilyLeads));
    const cardCopy = feedbackExampleIds.map((id) => examplePlanCards.find((card) => card.id === id));

    expect(cardCopy.map((card) => card?.focus)).toEqual([
      'Pensions, survivor impact, estate intent',
      'Long horizon, non-registered assets, tax timing',
      'Withdrawal order, taxes, survivor impact'
    ]);
    summaries.forEach((summary) => {
      expect(summary.compactEvidenceRows.map((row) => row.id)).toEqual([
        'monthlySpend',
        'fundedYears',
        'moneyLeft',
        'lifetimeTax',
        'oasRecovery'
      ]);
      expect(summary.compactEvidenceRows.find((row) => row.id === 'monthlySpend')?.detail).toContain("today's dollars");
      expect(summary.withdrawalFeedbackReview.questions.join(' ')).toContain(
        'funded years, money left, tax, and OAS recovery are evidence, not instructions'
      );
      expect(summary.withdrawalFeedbackReview.closeoutSummary.boundarySummary).toContain('review-only');
      expect(summary.feedbackPackageIndex.rows.find((row) => row.id === 'goalModes')).toMatchObject({ status: 'deferred' });
      expect(summary.feedbackPackageIndex.rows.find((row) => row.id === 'annualSequencing')).toMatchObject({ status: 'deferred' });
    });
    feedbackExampleIds.forEach((id) => {
      expect(createPlanFile(createExamplePlan(id)).plan).not.toHaveProperty('withdrawalFeedbackReview');
      expect(createPlanFile(createExamplePlan(id)).plan).not.toHaveProperty('feedbackPackageIndex');
    });
  });

  it('adds one home-sale reliance candidate only when downsize year and proceeds are entered', () => {
    const plan = downsizePlan();
    const missingYear = downsizePlan();
    missingYear.downsize = { year: 0, netProceeds: 250000 };
    const missingProceeds = downsizePlan();
    missingProceeds.downsize = { year: 2040, netProceeds: 0 };

    const candidates = buildBoundedOptimizerCandidates(plan);
    const relianceCandidates = candidates.filter((candidate) => candidate.id === 'withoutDownsize');

    expect(relianceCandidates).toHaveLength(1);
    expect(relianceCandidates[0]).toMatchObject({
      label: 'Check without home-sale cash',
      changedLevers: ['downsizing'],
      changeSummary: 'Remove home-sale cash in this reliance check'
    });
    expect(relianceCandidates[0].plan.downsize).toEqual({ year: 0, netProceeds: 0 });
    expect(plan.downsize).toEqual({ year: 2040, netProceeds: 250000 });
    expect(buildBoundedOptimizerCandidates(missingYear).map((candidate) => candidate.id)).not.toContain('withoutDownsize');
    expect(buildBoundedOptimizerCandidates(missingProceeds).map((candidate) => candidate.id)).not.toContain('withoutDownsize');
  });

  it('keeps the home-sale reliance candidate review-only and adds reliance evidence rows', () => {
    const plan = downsizePlan();
    const summary = runBoundedOptimizer(plan, (candidatePlan) =>
      candidatePlan.downsize?.netProceeds === 0 ? result(900000, 50000, null) : result(120000, 90000, null)
    );

    expect(summary.suggestedCandidateId).not.toBe('withoutDownsize');
    expect(summary.recommendationNotes.find((note) => note.candidateId === 'withoutDownsize')).toMatchObject({
      status: 'reviewOnly',
      reason: expect.stringContaining('reliance check is evidence only')
    });
    expect(summary.evidenceRows.map((row) => row.id)).toEqual([
      'homeRelianceFundedYears',
      'homeRelianceFirstShortfall',
      'homeReliancePortfolio',
      'homeRelianceLifetimeTax'
    ]);
    expect(summary.evidenceRows.find((row) => row.id === 'homeReliancePortfolio')).toMatchObject({
      label: 'Projected money-left change',
      value: '+$780,000',
      tone: 'ok'
    });
    expect(summary.optionGroups.find((group) => group.id === 'homeEstate')).toMatchObject({
      label: 'Home and estate checks',
      candidateIds: ['withoutDownsize'],
      reviewOnlyCount: 1,
      canHighlightCount: 0
    });
    const savedPlan = createPlanFile(plan).plan;
    const runtimePlan = extractPlanPayload(createPlanFile(plan));
    expect(savedPlan).not.toHaveProperty('boundedOptimizer');
    expect(runtimePlan.downsize).toEqual({ year: 2040, netProceeds: 250000 });
  });

  it('reports capacity gaps before optional room when the runtime result falls below the expense floor', () => {
    const summary = runBoundedOptimizer(readyPlan(), () => {
      const lowCapacity = result(100000, 90000, null);
      lowCapacity.years = lowCapacity.years.map((row) => ({ ...row, totalAftaxYear: 50000 }));
      return lowCapacity;
    });

    expect(summary.capacityObjective).toMatchObject({
      status: 'gap',
      monthlyAfterTaxCapacity: 50000 / 12,
      minimumMonthlyExpenseFloor: 62000 / 12,
      optionalMonthlyRoom: 0
    });
    expect(summary.capacityObjective.rows.find((row) => row.id === 'minimumFloor')).toMatchObject({
      status: 'blocked',
      detail: expect.stringContaining('does not cover')
    });
  });

  it('holds back candidates that weaken an entered estate goal', () => {
    const plan = readyPlan();
    plan.inheritance = 300000;

    const summary = runBoundedOptimizer(plan, (candidatePlan, config) => {
      if (config.withdrawalOrder === 'registered-first') return result(250000, 50000, null);
      return candidatePlan.title === plan.title ? result(320000, 90000, null) : result(250000, 50000, null);
    });

    expect(summary.suggestedCandidateId).toBe('baseline');
    expect(summary.recommendationNotes.find((note) => note.candidateId === 'withdrawalRegisteredFirst')).toMatchObject({
      status: 'reviewOnly',
      reason: expect.stringContaining('weakens the entered estate goal')
    });
    expect(summary.capacityObjective.rows.find((row) => row.id === 'estate')).toMatchObject({
      status: 'protected',
      detail: expect.stringContaining('$300,000')
    });
  });

  it('allows a shortfall repair when it does not worsen the estate-goal gap', () => {
    const plan = readyPlan();
    plan.inheritance = 300000;

    const summary = runBoundedOptimizer(plan, (candidatePlan) => {
      if (candidatePlan.spending.gogo === 80750) return result(310000, 88000, null);
      if (candidatePlan.spending.gogo === plan.spending.gogo) return result(250000, 90000, 2033);
      return result(240000, 95000, 2033);
    });

    expect(summary.suggestedCandidateId).toBe('spendLess5');
    expect(summary.recommendationNotes.find((note) => note.candidateId === 'spendLess5')).toMatchObject({
      status: 'canHighlight',
      reason: expect.stringContaining('materially improves a visible funding shortfall')
    });
  });

  it('blocks bounded search when contract blockers remain', () => {
    const plan = createBlankPlan();
    plan.p1.retireYear = 0;
    plan.assumptions.retireYear = 0;
    plan.spending.gogo = 0;

    const summary = runBoundedOptimizer(plan, () => result(0, 0));

    expect(summary.status).toBe('blocked');
    expect(summary.suggestedCandidateId).toBeNull();
    expect(summary.candidates.map((candidate) => candidate.id)).toEqual(['baseline']);
    expect(summary.explanation.plainLanguageSummary).toContain('paused');
    expect(summary.reviewNotes.length).toBeGreaterThan(0);
  });

  it('skips ineligible levers without widening the optimizer search', () => {
    const plan = readyPlan();
    plan.spending.gogo = 25000;
    plan.spending.slowgo = 22000;
    plan.spending.nogo = 20000;
    plan.p1.dob = 1962;
    plan.p1.retireYear = 2032;
    plan.assumptions.retireYear = 2032;
    plan.p1.tfsa = 0;
    plan.p1.nonreg = 0;

    const candidates = buildBoundedOptimizerCandidates(plan);
    const summary = runBoundedOptimizer(plan, () => result(100000, 90000));

    expect(candidates.map((candidate) => candidate.id)).toEqual(['baseline']);
    expect(summary.eligibilityNotes.find((note) => note.lever === 'spending')).toMatchObject({ status: 'skipped' });
    expect(summary.eligibilityNotes.find((note) => note.lever === 'retirementTiming')).toMatchObject({ status: 'skipped' });
    expect(summary.eligibilityNotes.find((note) => note.lever === 'benefitTiming')).toMatchObject({ status: 'skipped' });
    expect(summary.eligibilityNotes.find((note) => note.lever === 'withdrawalOrder')).toMatchObject({ status: 'skipped' });
    expect(summary.guardrailNotes.find((note) => note.id === 'benefitTiming')).toMatchObject({
      status: 'notTested',
      reason: expect.stringContaining('already age 70')
    });
    expect(summary.candidates.map((candidate) => candidate.id)).toEqual(['baseline']);
  });

  it('keeps work-timing candidates inside the age-70 boundary per option', () => {
    const plan = readyPlan();
    plan.p1.dob = 1964;
    plan.p1.retireYear = 2033;
    plan.assumptions.retireYear = 2033;

    const candidates = buildBoundedOptimizerCandidates(plan);

    expect(candidates.map((candidate) => candidate.id)).toContain('retireLater1');
    expect(candidates.map((candidate) => candidate.id)).not.toContain('retireLater2');
  });

  it('keeps disruptive improvements review-only when the current plan has no visible funding problem', () => {
    const summary = runBoundedOptimizer(readyPlan(), (candidatePlan, config) => {
      const id =
        config.cppAgeF === 70
          ? 'delayBenefits'
          : candidatePlan.p1.retireYear === 2034
            ? 'retireLater2'
            : candidatePlan.p1.retireYear === 2033
              ? 'retireLater1'
              : candidatePlan.spending.gogo === 76500
                ? 'spendLess10'
                : candidatePlan.spending.gogo === 80750
                  ? 'spendLess5'
                  : 'baseline';
      return id === 'baseline' ? result(200000, 90000, null) : result(350000, 85000, null);
    });

    expect(summary.suggestedCandidateId).toBe('baseline');
    expect(summary.headline).toContain('first option to review');
    expect(summary.recommendationNotes.find((note) => note.candidateId === 'spendLess10')).toMatchObject({
      status: 'reviewOnly',
      reason: expect.stringContaining('changes lifestyle')
    });
    expect(summary.recommendationNotes.find((note) => note.candidateId === 'retireLater2')).toMatchObject({
      status: 'reviewOnly',
      reason: expect.stringContaining('changes lifestyle')
    });
    expect(summary.recommendationNotes.find((note) => note.candidateId === 'delayBenefits')).toMatchObject({
      status: 'reviewOnly',
      reason: expect.stringContaining('benefit timing')
    });
  });

  it('keeps benefit delay review-only when bridge years show a shortfall', () => {
    const summary = runBoundedOptimizer(readyPlan(), (candidatePlan, config) => {
      if (config.cppAgeF === 70) return result(500000, 70000, 2033);
      return candidatePlan.spending.gogo === 80750 ? result(260000, 88000, null) : result(100000, 90000, 2033);
    });

    expect(summary.suggestedCandidateId).toBe('spendLess5');
    expect(summary.recommendationNotes.find((note) => note.candidateId === 'delayBenefits')).toMatchObject({
      status: 'reviewOnly',
      reason: expect.stringContaining('bridge year before age 70')
    });
  });

  it('flags missing survivor setup for two-person optimizer review', () => {
    const plan = readyPlan();
    plan.p2 = {
      ...plan.p2,
      name: 'Morgan',
      dob: 1969,
      retireYear: 2033,
      rrsp: 150000,
      tfsa: 70000,
      cpp65_monthly: 900,
      cpp70_monthly: 1250,
      oas_monthly: 742
    };
    plan.assumptions.p1DiesInSurvivor = 0;

    const summary = runBoundedOptimizer(plan, () => result(100000, 90000));

    expect(summary.eligibilityNotes.find((note) => note.lever === 'survivor')).toMatchObject({
      status: 'needsReview',
      reason: expect.stringContaining('survivor scenario year')
    });
    expect(summary.status).toBe('ready');
    expect(summary.capacityObjective).toMatchObject({
      survivorConstraint: 'reviewFirst'
    });
    expect(summary.capacityObjective.rows.find((row) => row.id === 'survivor')).toMatchObject({
      status: 'review',
      detail: expect.stringContaining('survivor scenario year')
    });
  });

  it('keeps benefit timing review-only for two-person plans without a survivor year', () => {
    const plan = readyPlan();
    plan.p2 = {
      ...plan.p2,
      name: 'Morgan',
      dob: 1969,
      retireYear: 2033,
      rrsp: 120000,
      tfsa: 70000,
      nonreg: 50000,
      cpp65_monthly: 900,
      cpp70_monthly: 1250,
      oas_monthly: 742
    };
    plan.assumptions.p1DiesInSurvivor = 0;

    const summary = runBoundedOptimizer(plan, (_candidatePlan, config) => {
      if (config.cppAgeF === 70 || config.oasAgeF === 70) return result(500000, 70000, null);
      return result(100000, 90000, 2033);
    });

    expect(summary.eligibilityNotes.find((note) => note.lever === 'survivor')).toMatchObject({
      status: 'needsReview'
    });
    expect(summary.recommendationNotes.find((note) => note.candidateId === 'delayBenefits')).toMatchObject({
      status: 'reviewOnly',
      reason: expect.stringContaining('survivor scenario year')
    });
  });
});
