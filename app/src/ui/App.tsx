import { useEffect, useMemo, useReducer, useState } from 'react';
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type TooltipItem
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { createBlankPlan } from '../data/defaultPlan';
import { createExamplePlan, examplePlanCards, ExamplePlanId } from '../data/examplePlans';
import { createPlanFile, extractPlanPayload, p2LooksBlank, safeFilenamePart, validatePlanFile } from '../data/planFile';
import { PlanValidationResult, validatePlanForGuidedIntake } from '../data/planValidation';
import { fromV2Payload } from '../data/domainAdapter';
import {
  AnnualDetailView,
  ResultsWorkspaceSection,
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
  selectDecisionDetailRows,
  selectDecisionChecklist,
  selectDrawdownReadinessSummary,
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
  selectScenarioChoiceCards,
  selectScenarioComparisonRows,
  selectScenarioAssumptionRows,
  selectSourceReconciliationStory,
  selectSpendingTaxChartSeries,
  selectSpendingCapacitySummary,
  selectSpendingStressSummary,
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
} from '../engine/resultSelectors';
import { PlanPerson, SimulationResult, V2PlanPayload } from '../types/plan';
import type { BoundedOptimizerSummary } from '../engine/boundedOptimizer';
import type { RealDrawdownComparisonResult } from '../engine/drawdownComparison';
import type {
  ContainedDrawdownCopyGuard,
  ContainedDrawdownDetailsDensity,
  ContainedDrawdownExecutionPrototype,
  ContainedDrawdownExampleGate,
  ContainedDrawdownExplanation,
  ContainedDrawdownLimitations,
  ContainedDrawdownMateriality,
  ContainedDrawdownProductGoNoGo,
  ContainedDrawdownPrototypeSummary,
  ContainedDrawdownReviewChecklist,
  ContainedDrawdownUsefulnessCloseout,
  DrawdownAdapterValidation,
  DrawdownAdapterAuditTrail,
  DrawdownExecutionBoundaryDecision,
  DrawdownExecutionContainmentGuard,
  DrawdownExecutionPhaseCloseout,
  DrawdownExecutionPreflight,
  DrawdownExecutionPrototypeGoNoGo,
  DrawdownPhaseReview,
  DrawdownPrototypeReadinessReview,
  DrawdownReviewPreview,
  DrawdownVisibleReviewGate
} from '../engine/drawdownExecutionReadiness';
import type { PreviewScenarioResults, SpendingStressResults } from '../engine/previewScenarios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

type WorkspaceView = 'start' | 'intake' | 'review' | 'results';

type IntakeStepId =
  | 'household'
  | 'income'
  | 'accounts'
  | 'realEstate'
  | 'debts'
  | 'spending'
  | 'assumptions'
  | 'review';

type WorkspaceState = {
  view: WorkspaceView;
  activeStep: IntakeStepId;
  activeResultsSection: ResultsWorkspaceSection;
  householdMode: 'single' | 'couple';
  plan: V2PlanPayload | null;
  error: string;
  importLabel: string;
  dirty: boolean;
  lastSavedAt: string;
};

type WorkspaceAction =
  | { type: 'newPlan' }
  | { type: 'loadExample'; id: ExamplePlanId; label: string }
  | { type: 'openPlan'; plan: V2PlanPayload; label: string }
  | { type: 'updatePlan'; plan: V2PlanPayload }
  | { type: 'setHouseholdMode'; mode: 'single' | 'couple'; plan?: V2PlanPayload }
  | { type: 'setView'; view: WorkspaceView }
  | { type: 'setStep'; step: IntakeStepId }
  | { type: 'setResultsSection'; section: ResultsWorkspaceSection }
  | { type: 'setError'; error: string }
  | { type: 'markSaved'; savedAt: string };

type BridgePreview = {
  result: SimulationResult | null;
  scenarios: PreviewScenarioResults;
  spendingStress: SpendingStressResults;
  survivor: SimulationResult | null;
  optimizer: BoundedOptimizerSummary | null;
  hiddenDrawdownComparison: RealDrawdownComparisonResult | null;
  drawdownPrototypeReadiness: DrawdownPrototypeReadinessReview | null;
  drawdownVisibleReviewGate: DrawdownVisibleReviewGate | null;
  drawdownReviewPreview: DrawdownReviewPreview | null;
  drawdownPhaseReview: DrawdownPhaseReview | null;
  drawdownExecutionBoundary: DrawdownExecutionBoundaryDecision | null;
  drawdownAdapterValidation: DrawdownAdapterValidation | null;
  drawdownExecutionGoNoGo: DrawdownExecutionPrototypeGoNoGo | null;
  drawdownExecutionPreflight: DrawdownExecutionPreflight | null;
  drawdownAdapterAuditTrail: DrawdownAdapterAuditTrail | null;
  drawdownExecutionContainmentGuard: DrawdownExecutionContainmentGuard | null;
  drawdownExecutionPhaseCloseout: DrawdownExecutionPhaseCloseout | null;
  containedDrawdownPrototype: ContainedDrawdownExecutionPrototype | null;
  containedDrawdownPrototypeSummary: ContainedDrawdownPrototypeSummary | null;
  containedDrawdownMateriality: ContainedDrawdownMateriality | null;
  containedDrawdownExplanation: ContainedDrawdownExplanation | null;
  containedDrawdownLimitations: ContainedDrawdownLimitations | null;
  containedDrawdownUsefulnessCloseout: ContainedDrawdownUsefulnessCloseout | null;
  containedDrawdownDetailsDensity: ContainedDrawdownDetailsDensity | null;
  containedDrawdownReviewChecklist: ContainedDrawdownReviewChecklist | null;
  containedDrawdownExampleGate: ContainedDrawdownExampleGate | null;
  containedDrawdownCopyGuard: ContainedDrawdownCopyGuard | null;
  containedDrawdownProductGoNoGo: ContainedDrawdownProductGoNoGo | null;
  error: string;
  loading: boolean;
};

const intakeSteps: Array<{ id: IntakeStepId; label: string; helper: string }> = [
  { id: 'household', label: 'Household', helper: 'Who this plan supports' },
  { id: 'income', label: 'Income', helper: 'Work, pensions, CPP, OAS' },
  { id: 'accounts', label: 'Accounts', helper: 'Savings and investments' },
  { id: 'realEstate', label: 'Real Estate', helper: 'Home sale or downsize cash' },
  { id: 'debts', label: 'Debts', helper: 'Payments that affect spending room' },
  { id: 'spending', label: 'Spending', helper: 'Lifestyle, one-offs, estate wishes' },
  { id: 'assumptions', label: 'Assumptions', helper: 'Planning horizon and strategy choices' },
  { id: 'review', label: 'Review', helper: 'Check, save, generate results' }
];

const initialState: WorkspaceState = {
  view: 'start',
  activeStep: 'household',
  activeResultsSection: 'overview',
  householdMode: 'single',
  plan: null,
  error: '',
  importLabel: '',
  dirty: false,
  lastSavedAt: ''
};

function reducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  switch (action.type) {
    case 'newPlan':
      return {
        ...state,
        view: 'intake',
        activeStep: 'household',
        activeResultsSection: 'overview',
        householdMode: 'single',
        plan: createBlankPlan(),
        importLabel: 'New local plan',
        error: '',
        dirty: true,
        lastSavedAt: ''
      };
    case 'loadExample': {
      const plan = createExamplePlan(action.id);
      return {
        ...state,
        view: 'intake',
        activeStep: 'household',
        activeResultsSection: 'overview',
        householdMode: p2LooksBlank(plan.p2) ? 'single' : 'couple',
        plan,
        importLabel: `Custom plan based on ${action.label}`,
        error: '',
        dirty: true,
        lastSavedAt: ''
      };
    }
    case 'openPlan':
      return {
        ...state,
        view: 'intake',
        activeStep: 'household',
        activeResultsSection: 'overview',
        householdMode: p2LooksBlank(action.plan.p2) ? 'single' : 'couple',
        plan: action.plan,
        importLabel: action.label,
        error: '',
        dirty: false,
        lastSavedAt: ''
      };
    case 'updatePlan':
      return { ...state, plan: action.plan, dirty: true, error: '' };
    case 'setHouseholdMode':
      return {
        ...state,
        householdMode: action.mode,
        plan: action.plan || state.plan,
        dirty: true,
        error: ''
      };
    case 'setView':
      return { ...state, view: action.view };
    case 'setStep':
      return { ...state, activeStep: action.step, view: action.step === 'review' ? 'review' : 'intake' };
    case 'setResultsSection':
      return { ...state, activeResultsSection: action.section, view: 'results' };
    case 'setError':
      return { ...state, error: action.error };
    case 'markSaved':
      return { ...state, dirty: false, lastSavedAt: action.savedAt };
    default:
      return state;
  }
}

function stableIntakeUrl(): string {
  return '/stable-intake.html';
}

function stableDashboardUrl(): string {
  return '/retirement_dashboard.html';
}

function stableDashboardUrlForPlan(plan: V2PlanPayload): string {
  const encoded = btoa(encodeURIComponent(JSON.stringify(plan)));
  return `${stableDashboardUrl()}#${encoded}`;
}

function printableReportUrlForPlan(plan: V2PlanPayload): string {
  return stableDashboardUrlForPlan(plan);
}

function formatMoney(value: number | undefined): string {
  return `$${Math.round(value || 0).toLocaleString()}`;
}

function formatSignedMoney(value: number | undefined): string {
  const rounded = Math.round(value || 0);
  if (rounded === 0) return '$0';
  return `${rounded > 0 ? '+' : '-'}$${Math.abs(rounded).toLocaleString()}`;
}

function formatPercent(value: number | undefined): string {
  return `${Number(((value || 0) * 100).toFixed(2))}%`;
}

function planThroughAgeLabel(plan: V2PlanPayload, fundedThroughYear: number | null): string {
  if (!fundedThroughYear) return '-';
  const p1Age = plan.p1?.dob ? fundedThroughYear - Number(plan.p1.dob) : null;
  const p2Age = !p2LooksBlank(plan.p2) && plan.p2?.dob ? fundedThroughYear - Number(plan.p2.dob) : null;
  const p1Label = plan.p1?.name || 'Person 1';
  const p2Label = plan.p2?.name || 'Person 2';
  if (p1Age && p2Age) return `${p1Label} ${p1Age} / ${p2Label} ${p2Age}`;
  if (p1Age) return `${p1Label} ${p1Age}`;
  return String(fundedThroughYear);
}

function resultsSectionTitle(section: ResultsWorkspaceSection): string {
  const titles: Record<ResultsWorkspaceSection, string> = {
    overview: 'Overview',
    annualDetail: 'Year-by-year',
    cashFlow: 'Money Flow',
    incomeSources: 'Income',
    accounts: 'Accounts',
    taxes: 'Taxes',
    stressTests: 'Risks',
    householdResilience: 'Survivor Impact',
    assumptions: 'Assumptions',
    details: 'Details',
    exportSave: 'Save & print'
  };
  return titles[section] || 'Overview';
}

function sumPeople(plan: V2PlanPayload, field: keyof PlanPerson): number {
  return numberFromInput(String(plan.p1[field] || 0)) + (p2LooksBlank(plan.p2) ? 0 : numberFromInput(String(plan.p2[field] || 0)));
}

function totalInvestableAssets(plan: V2PlanPayload): number {
  const fields: Array<keyof PlanPerson> = ['rrsp', 'lira', 'lif', 'tfsa', 'nonreg'];
  return fields.reduce((total, field) => total + sumPeople(plan, field), 0) + (plan.cashWedge?.balance || 0);
}

function totalDebt(plan: V2PlanPayload): number {
  return (plan.mortgage?.balance || 0) + (plan.loc?.balance || 0);
}

function dbSurvivorSetupText(plan: V2PlanPayload): string {
  const people: PlanPerson[] = p2LooksBlank(plan.p2) ? [plan.p1] : [plan.p1, plan.p2];
  const labels = people
    .filter((person) => (person.db_after65 || 0) > 0 || (person.db_survivor_annual || 0) > 0)
    .map((person) => {
      const name = person.name || 'Person';
      if ((person.db_survivor_annual || 0) > 0) return `${name}: ${formatMoney(person.db_survivor_annual || 0)}/yr`;
      if ((person.db_survivor_pct || 0) > 0) return `${name}: ${displayPercent(person.db_survivor_pct)}%`;
      return `${name}: 60% assumed`;
    });
  return labels.length ? labels.join(' / ') : 'None entered';
}

function blankPerson2(): PlanPerson {
  return {
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
    db_survivor_pct: 0,
    db_survivor_annual: 0,
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
  };
}

function numberFromInput(value: string): number {
  if (value.trim() === '') return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function displayNumber(value: number | undefined, blankZero = false): string {
  if (blankZero && !value) return '';
  return String(value ?? '');
}

function displayPercent(value: number | undefined, blankZero = false): string {
  if (blankZero && !value) return '';
  const percent = (value ?? 0) * 100;
  return String(Number(percent.toFixed(3)));
}

function decimalFromPercentInput(value: string): number {
  return numberFromInput(value) / 100;
}

function survivorMonthlyValue(person: PlanPerson, monthlyField: 'cppSurv_u65_mo' | 'cppSurv_o65_mo'): number {
  if (monthlyField === 'cppSurv_u65_mo') {
    return person.cppSurv_u65_mo || (person.cppSurvivor_under65 ? Math.round(person.cppSurvivor_under65 / 12) : 0);
  }
  return person.cppSurv_o65_mo || (person.cppSurvivor_over65 ? Math.round(person.cppSurvivor_over65 / 12) : 0);
}

export function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [bridgePreview, setBridgePreview] = useState<BridgePreview>({
    result: null,
    scenarios: {},
    spendingStress: {},
    survivor: null,
    optimizer: null,
    hiddenDrawdownComparison: null,
    drawdownPrototypeReadiness: null,
    drawdownVisibleReviewGate: null,
    drawdownReviewPreview: null,
    drawdownPhaseReview: null,
    drawdownExecutionBoundary: null,
    drawdownAdapterValidation: null,
    drawdownExecutionGoNoGo: null,
    drawdownExecutionPreflight: null,
    drawdownAdapterAuditTrail: null,
    drawdownExecutionContainmentGuard: null,
    drawdownExecutionPhaseCloseout: null,
    containedDrawdownPrototype: null,
    containedDrawdownPrototypeSummary: null,
    containedDrawdownMateriality: null,
    containedDrawdownExplanation: null,
    containedDrawdownLimitations: null,
    containedDrawdownUsefulnessCloseout: null,
    containedDrawdownDetailsDensity: null,
    containedDrawdownReviewChecklist: null,
    containedDrawdownExampleGate: null,
    containedDrawdownCopyGuard: null,
    containedDrawdownProductGoNoGo: null,
    error: '',
    loading: false
  });
  const { plan } = state;

  const domainPlan = useMemo(() => (plan ? fromV2Payload(plan) : null), [plan]);
  const validation = useMemo(() => (plan ? validatePlanForGuidedIntake(plan) : null), [plan]);
  useEffect(() => {
    let cancelled = false;
    if (!plan || (state.view !== 'review' && state.view !== 'results')) {
      setBridgePreview({
        result: null,
        scenarios: {},
        spendingStress: {},
        survivor: null,
        optimizer: null,
        hiddenDrawdownComparison: null,
        drawdownPrototypeReadiness: null,
        drawdownVisibleReviewGate: null,
        drawdownReviewPreview: null,
        drawdownPhaseReview: null,
        drawdownExecutionBoundary: null,
        drawdownAdapterValidation: null,
        drawdownExecutionGoNoGo: null,
        drawdownExecutionPreflight: null,
        drawdownAdapterAuditTrail: null,
        drawdownExecutionContainmentGuard: null,
        drawdownExecutionPhaseCloseout: null,
        containedDrawdownPrototype: null,
        containedDrawdownPrototypeSummary: null,
        containedDrawdownMateriality: null,
        containedDrawdownExplanation: null,
        containedDrawdownLimitations: null,
        containedDrawdownUsefulnessCloseout: null,
        containedDrawdownDetailsDensity: null,
        containedDrawdownReviewChecklist: null,
        containedDrawdownExampleGate: null,
        containedDrawdownCopyGuard: null,
        containedDrawdownProductGoNoGo: null,
        error: '',
        loading: false
      });
      return;
    }

    setBridgePreview((current) => ({ ...current, loading: true, error: '' }));
    Promise.all([
      import('../engine/previewScenarios'),
      import('../engine/boundedOptimizer'),
      import('../engine/drawdownComparison'),
      import('../engine/drawdownExecutionReadiness')
    ])
      .then(
        ([
          { runResultsPreviewBundle },
          { runBoundedOptimizer },
          { runSingleDrawdownComparison },
          {
             buildDrawdownAnnualOverrideAdapterDraft,
             buildDrawdownExecutionContract,
             emptyMockedExecutionScorecard,
             runContainedDrawdownExecutionPrototype,
             selectContainedDrawdownCopyGuard,
             selectContainedDrawdownDetailsDensity,
             selectContainedDrawdownExplanation,
             selectContainedDrawdownExampleGate,
             selectContainedDrawdownLimitations,
             selectContainedDrawdownMateriality,
             selectContainedDrawdownProductGoNoGo,
             selectContainedDrawdownPrototypeSummary,
             selectContainedDrawdownReviewChecklist,
             selectContainedDrawdownUsefulnessCloseout,
             selectDrawdownAdapterAuditTrail,
             selectDrawdownExecutionBoundaryDecision,
             selectDrawdownExecutionContainmentGuard,
             selectDrawdownExecutionPhaseCloseout,
             selectDrawdownExecutionPreflight,
             selectDrawdownExecutionPrototypeGoNoGo,
             selectDrawdownPhaseReview,
            selectDrawdownPrototypeReadinessReview,
            selectDrawdownReviewPreview,
            selectDrawdownVisibleReviewGate
          }
        ]) => {
        const preview = runResultsPreviewBundle(plan);
        const optimizer = runBoundedOptimizer(plan);
        const hiddenDrawdownComparison = runSingleDrawdownComparison(plan);
        const drawdownExecutionContract = buildDrawdownExecutionContract({ plan, comparison: hiddenDrawdownComparison });
        const drawdownPrototypeReadiness = selectDrawdownPrototypeReadinessReview({
          plan,
          comparison: hiddenDrawdownComparison,
          contract: drawdownExecutionContract
        });
        const spendingStressSummary = selectSpendingStressSummary(preview.result, preview.spendingStress, plan);
        const drawdownVisibleReviewGate = selectDrawdownVisibleReviewGate({
          plan,
          comparison: hiddenDrawdownComparison,
          contract: drawdownExecutionContract
        });
        const drawdownReviewPreview = selectDrawdownReviewPreview({
          gate: drawdownVisibleReviewGate,
          comparison: hiddenDrawdownComparison,
          spendingStressStatus: spendingStressSummary.status
        });
        const drawdownPhaseReview = selectDrawdownPhaseReview({
          plan,
          gate: drawdownVisibleReviewGate,
          preview: drawdownReviewPreview
        });
        const drawdownExecutionBoundary = selectDrawdownExecutionBoundaryDecision({
          plan,
          phase: drawdownPhaseReview,
          preview: drawdownReviewPreview
        });
        const drawdownAdapterValidation = buildDrawdownAnnualOverrideAdapterDraft({
          plan,
          boundary: drawdownExecutionBoundary,
          contract: drawdownExecutionContract
        });
        const drawdownExecutionGoNoGo = selectDrawdownExecutionPrototypeGoNoGo({
          plan,
         boundary: drawdownExecutionBoundary,
         adapterValidation: drawdownAdapterValidation,
         scorecard: emptyMockedExecutionScorecard()
        });
        const drawdownExecutionPreflight = selectDrawdownExecutionPreflight({
          plan,
          adapterValidation: drawdownAdapterValidation,
          goNoGo: drawdownExecutionGoNoGo
        });
        const drawdownAdapterAuditTrail = selectDrawdownAdapterAuditTrail(drawdownAdapterValidation);
        const drawdownExecutionContainmentGuard = selectDrawdownExecutionContainmentGuard({
          plan,
          adapterValidation: drawdownAdapterValidation
        });
        const drawdownExecutionPhaseCloseout = selectDrawdownExecutionPhaseCloseout({
          plan,
          preflight: drawdownExecutionPreflight,
          auditTrail: drawdownAdapterAuditTrail,
          containment: drawdownExecutionContainmentGuard
        });
        const containedDrawdownPrototype = runContainedDrawdownExecutionPrototype({
          plan,
          adapterValidation: drawdownAdapterValidation,
          containment: drawdownExecutionContainmentGuard
        });
        const containedDrawdownPrototypeSummary = selectContainedDrawdownPrototypeSummary({
          plan,
          prototype: containedDrawdownPrototype
        });
        const containedDrawdownMateriality = selectContainedDrawdownMateriality(containedDrawdownPrototype);
        const containedDrawdownExplanation = selectContainedDrawdownExplanation({
          prototype: containedDrawdownPrototype,
          materiality: containedDrawdownMateriality
        });
        const containedDrawdownLimitations = selectContainedDrawdownLimitations();
        const containedDrawdownUsefulnessCloseout = selectContainedDrawdownUsefulnessCloseout({
          plan,
          summary: containedDrawdownPrototypeSummary,
          materiality: containedDrawdownMateriality,
          explanation: containedDrawdownExplanation,
          limitations: containedDrawdownLimitations
        });
        const containedDrawdownDetailsDensity = selectContainedDrawdownDetailsDensity({
          prototype: containedDrawdownPrototype,
          materiality: containedDrawdownMateriality,
          explanation: containedDrawdownExplanation,
          limitations: containedDrawdownLimitations,
          usefulness: containedDrawdownUsefulnessCloseout
        });
        const containedDrawdownReviewChecklist = selectContainedDrawdownReviewChecklist({
          usefulness: containedDrawdownUsefulnessCloseout,
          materiality: containedDrawdownMateriality,
          limitations: containedDrawdownLimitations
        });
        const containedDrawdownExampleGate = selectContainedDrawdownExampleGate({
          exampleCount: 0,
          blockedCount: 0,
          heldCount: 0
        });
        const containedDrawdownCopyGuard = selectContainedDrawdownCopyGuard(plan);
        const containedDrawdownProductGoNoGo = selectContainedDrawdownProductGoNoGo({
          plan,
          usefulness: containedDrawdownUsefulnessCloseout,
          density: containedDrawdownDetailsDensity,
          checklist: containedDrawdownReviewChecklist,
          exampleGate: containedDrawdownExampleGate,
          copyGuard: containedDrawdownCopyGuard
        });
        if (!cancelled) {
          setBridgePreview({
            ...preview,
            optimizer,
            hiddenDrawdownComparison,
            drawdownPrototypeReadiness,
            drawdownVisibleReviewGate,
            drawdownReviewPreview,
            drawdownPhaseReview,
            drawdownExecutionBoundary,
            drawdownAdapterValidation,
            drawdownExecutionGoNoGo,
            drawdownExecutionPreflight,
            drawdownAdapterAuditTrail,
            drawdownExecutionContainmentGuard,
            drawdownExecutionPhaseCloseout,
            containedDrawdownPrototype,
            containedDrawdownPrototypeSummary,
            containedDrawdownMateriality,
            containedDrawdownExplanation,
            containedDrawdownLimitations,
            containedDrawdownUsefulnessCloseout,
            containedDrawdownDetailsDensity,
            containedDrawdownReviewChecklist,
            containedDrawdownExampleGate,
            containedDrawdownCopyGuard,
            containedDrawdownProductGoNoGo,
            error: '',
            loading: false
          });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setBridgePreview({
            result: null,
            scenarios: {},
            spendingStress: {},
             survivor: null,
             optimizer: null,
             hiddenDrawdownComparison: null,
             drawdownPrototypeReadiness: null,
             drawdownVisibleReviewGate: null,
             drawdownReviewPreview: null,
             drawdownPhaseReview: null,
              drawdownExecutionBoundary: null,
              drawdownAdapterValidation: null,
              drawdownExecutionGoNoGo: null,
              drawdownExecutionPreflight: null,
              drawdownAdapterAuditTrail: null,
              drawdownExecutionContainmentGuard: null,
              drawdownExecutionPhaseCloseout: null,
              containedDrawdownPrototype: null,
              containedDrawdownPrototypeSummary: null,
              containedDrawdownMateriality: null,
              containedDrawdownExplanation: null,
              containedDrawdownLimitations: null,
              containedDrawdownUsefulnessCloseout: null,
              containedDrawdownDetailsDensity: null,
              containedDrawdownReviewChecklist: null,
              containedDrawdownExampleGate: null,
              containedDrawdownCopyGuard: null,
              containedDrawdownProductGoNoGo: null,
              error: err instanceof Error ? err.message : 'Could not run preview calculation.',
              loading: false
            });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [plan, state.view]);
  const bridgeFirstYear = bridgePreview.result?.years[0];
  const bridgeLastYear = bridgePreview.result?.years[bridgePreview.result.years.length - 1];

  const currentStep = intakeSteps.find((step) => step.id === state.activeStep) || intakeSteps[0];
  const completedStepCount = plan ? Math.max(1, intakeSteps.findIndex((step) => step.id === state.activeStep) + 1) : 0;

  function updatePlan(mutator: (draft: V2PlanPayload) => void) {
    if (!plan) return;
    const draft = extractPlanPayload(plan);
    mutator(draft);
    dispatch({ type: 'updatePlan', plan: draft });
  }

  function setHouseholdMode(mode: 'single' | 'couple') {
    if (!plan) return;
    if (mode === 'single') {
      const draft = extractPlanPayload(plan);
      draft.p2 = blankPerson2();
      dispatch({ type: 'setHouseholdMode', mode, plan: draft });
      return;
    }
    dispatch({ type: 'setHouseholdMode', mode });
  }

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const result = validatePlanFile(parsed);
      if (!result.ok) {
        dispatch({ type: 'setError', error: result.message });
        return;
      }
      dispatch({ type: 'openPlan', plan: result.plan, label: file.name });
    } catch (err) {
      dispatch({
        type: 'setError',
        error: err instanceof Error ? err.message : 'Could not read the selected plan file.'
      });
    } finally {
      event.target.value = '';
    }
  }

  function saveEditablePlan() {
    if (!plan) return;
    const file = createPlanFile(plan);
    const blob = new Blob([JSON.stringify(file, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeFilenamePart(file.title)}.plan.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    dispatch({ type: 'markSaved', savedAt: new Date().toLocaleString() });
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Local retirement planning</p>
          <h1>Canadian Retirement Planner</h1>
        </div>
        <nav className="top-actions" aria-label="Stable app links">
          <a className="button secondary" href={stableIntakeUrl()}>
            Open classic intake
          </a>
          <a className="button secondary" href={stableDashboardUrl()}>
            Open printable report
          </a>
        </nav>
      </header>

      <section className="status-strip" aria-label="Local file status">
        <div>
          <span>Plan</span>
          <strong>{domainPlan?.title || 'No plan loaded'}</strong>
        </div>
        <div>
          <span>Source</span>
          <strong>{state.importLabel || 'Local only'}</strong>
        </div>
        <div>
          <span>Editable plan</span>
          <strong>{state.dirty ? 'Unsaved local changes' : state.lastSavedAt ? `Saved ${state.lastSavedAt}` : 'No changes'}</strong>
        </div>
      </section>

      <div className="workspace-layout">
        <aside className="sidebar" aria-label="Plan workspace navigation">
          <button
            className={`nav-item ${state.view === 'start' ? 'active' : ''}`}
            type="button"
            onClick={() => dispatch({ type: 'setView', view: 'start' })}
          >
            <span>Start</span>
            <small>Open, create, privacy</small>
          </button>
          <button
            className={`nav-item ${state.view === 'intake' || state.view === 'review' ? 'active' : ''}`}
            type="button"
            onClick={() => dispatch({ type: 'setView', view: plan ? 'intake' : 'start' })}
          >
            <span>Guided intake</span>
            <small>{completedStepCount}/{intakeSteps.length} sections</small>
          </button>
          <button
            className={`nav-item ${state.view === 'results' ? 'active' : ''}`}
            type="button"
            onClick={() => dispatch({ type: 'setView', view: plan ? 'results' : 'start' })}
          >
            <span>Results</span>
            <small>Answer and report</small>
          </button>
        </aside>

        <section className="workspace-main">
          {state.view === 'start' ? (
            <StartPanel
              error={state.error}
              onExample={(id, label) => dispatch({ type: 'loadExample', id, label })}
              onFileChange={onFileChange}
              onNewPlan={() => dispatch({ type: 'newPlan' })}
            />
          ) : null}

          {state.view === 'intake' && plan ? (
            <IntakePanel
              currentStep={currentStep}
              onNext={() => {
                const currentIndex = intakeSteps.findIndex((step) => step.id === state.activeStep);
                const nextStep = intakeSteps[Math.min(currentIndex + 1, intakeSteps.length - 1)];
                dispatch({ type: 'setStep', step: nextStep.id });
              }}
              onReview={() => dispatch({ type: 'setStep', step: 'review' })}
              onStep={(step) => dispatch({ type: 'setStep', step })}
              onHouseholdMode={setHouseholdMode}
              onUpdatePlan={updatePlan}
              householdMode={state.householdMode}
              plan={plan}
              validation={validation}
            />
          ) : null}

          {state.view === 'review' && domainPlan && plan ? (
            <ReviewPanel
              bridgeError={bridgePreview.error}
              endPortfolio={bridgeLastYear?.bal_total}
              firstYear={bridgeFirstYear?.year}
              lastYear={bridgeLastYear?.year}
              onDownload={saveEditablePlan}
              onResults={() => dispatch({ type: 'setView', view: 'results' })}
              onStep={(step) => dispatch({ type: 'setStep', step })}
              plan={plan}
              title={domainPlan.title}
              validation={validation}
            />
          ) : null}

          {state.view === 'results' && domainPlan && plan ? (
            <ResultsHandoffPanel
              activeSection={state.activeResultsSection}
              bridgeError={bridgePreview.error}
              loading={bridgePreview.loading}
              onDownload={saveEditablePlan}
              onSection={(section) => dispatch({ type: 'setResultsSection', section })}
              plan={plan}
              result={bridgePreview.result}
              scenarios={bridgePreview.scenarios}
              spendingStress={bridgePreview.spendingStress}
              survivor={bridgePreview.survivor}
              optimizer={bridgePreview.optimizer}
              hiddenDrawdownComparison={bridgePreview.hiddenDrawdownComparison}
              drawdownPrototypeReadiness={bridgePreview.drawdownPrototypeReadiness}
              drawdownVisibleReviewGate={bridgePreview.drawdownVisibleReviewGate}
              drawdownReviewPreview={bridgePreview.drawdownReviewPreview}
              drawdownPhaseReview={bridgePreview.drawdownPhaseReview}
              drawdownExecutionBoundary={bridgePreview.drawdownExecutionBoundary}
              drawdownAdapterValidation={bridgePreview.drawdownAdapterValidation}
              drawdownExecutionGoNoGo={bridgePreview.drawdownExecutionGoNoGo}
              drawdownExecutionPreflight={bridgePreview.drawdownExecutionPreflight}
              drawdownAdapterAuditTrail={bridgePreview.drawdownAdapterAuditTrail}
              drawdownExecutionContainmentGuard={bridgePreview.drawdownExecutionContainmentGuard}
              drawdownExecutionPhaseCloseout={bridgePreview.drawdownExecutionPhaseCloseout}
              containedDrawdownPrototype={bridgePreview.containedDrawdownPrototype}
              containedDrawdownPrototypeSummary={bridgePreview.containedDrawdownPrototypeSummary}
              containedDrawdownMateriality={bridgePreview.containedDrawdownMateriality}
              containedDrawdownExplanation={bridgePreview.containedDrawdownExplanation}
              containedDrawdownLimitations={bridgePreview.containedDrawdownLimitations}
              containedDrawdownUsefulnessCloseout={bridgePreview.containedDrawdownUsefulnessCloseout}
              containedDrawdownDetailsDensity={bridgePreview.containedDrawdownDetailsDensity}
              containedDrawdownReviewChecklist={bridgePreview.containedDrawdownReviewChecklist}
              containedDrawdownExampleGate={bridgePreview.containedDrawdownExampleGate}
              containedDrawdownCopyGuard={bridgePreview.containedDrawdownCopyGuard}
              containedDrawdownProductGoNoGo={bridgePreview.containedDrawdownProductGoNoGo}
              title={domainPlan.title}
              validation={validation}
            />
          ) : null}
        </section>
      </div>
    </main>
  );
}

function StartPanel({
  error,
  onExample,
  onFileChange,
  onNewPlan
}: {
  error: string;
  onExample: (id: ExamplePlanId, label: string) => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onNewPlan: () => void;
}) {
  return (
    <section className="page-grid">
      <div className="intro-panel">
        <p className="eyebrow">Home / Start</p>
        <h2>Build a local retirement plan</h2>
        <p>
          Start a new plan or open an editable plan file from your device. Your information stays local while the planner
          helps you review retirement readiness, spending fit, taxes, and estate intent.
        </p>
        <div className="actions">
          <button type="button" onClick={onNewPlan}>
            New local plan
          </button>
          <label className="button file-picker">
            <input type="file" accept=".plan.json,.json,application/json" onChange={onFileChange} />
            Open editable plan
          </label>
        </div>
        {error ? <p className="error">{error}</p> : null}
      </div>

      <div className="panel">
        <p className="eyebrow">Local-first boundary</p>
        <h3>No account. No upload. No cloud sync.</h3>
        <p>
          Saving creates an editable local plan file. The printable report is separate and stays available for readable
          charts and complete annual tables.
        </p>
        <ul className="clean-list">
          <li>Ontario 2026 tax assumptions</li>
          <li>Editable local plan file</li>
          <li>No account infrastructure required</li>
        </ul>
      </div>

      <div className="panel example-panel">
        <p className="eyebrow">Try an example</p>
        <h3>See how Results answers different retirement stories.</h3>
        <p>
          Use a synthetic household to explore the planner before entering your own numbers. Each example opens as an
          editable local working copy.
        </p>
        <div className="example-plan-grid">
          {examplePlanCards.map((example) => (
            <button
              className="example-plan-card"
              key={example.id}
              type="button"
              onClick={() => onExample(example.id, example.label)}
            >
              <span>{example.shortLabel}</span>
              <strong>{example.summary}</strong>
              <small>{example.bestFor}</small>
              <em>{example.focus}</em>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function IntakePanel({
  currentStep,
  householdMode,
  onHouseholdMode,
  onNext,
  onReview,
  onStep,
  onUpdatePlan,
  plan,
  validation
}: {
  currentStep: { id: IntakeStepId; label: string; helper: string };
  householdMode: 'single' | 'couple';
  onHouseholdMode: (mode: 'single' | 'couple') => void;
  onNext: () => void;
  onReview: () => void;
  onStep: (step: IntakeStepId) => void;
  onUpdatePlan: (mutator: (draft: V2PlanPayload) => void) => void;
  plan: V2PlanPayload;
  validation: PlanValidationResult | null;
}) {
  const isHouseholdStep = currentStep.id === 'household';
  const isIncomeStep = currentStep.id === 'income';
  const isAccountsStep = currentStep.id === 'accounts';
  const isRealEstateStep = currentStep.id === 'realEstate';
  const isDebtsStep = currentStep.id === 'debts';
  const isSpendingStep = currentStep.id === 'spending';
  const isAssumptionsStep = currentStep.id === 'assumptions';
  const currentStepIssues = validationIssuesForStep(validation, currentStep.id);
  return (
    <section className="intake-shell">
      <div className="step-rail" aria-label="Guided intake steps">
        {intakeSteps.map((step) => {
          const issueCount = validationIssueCountForStep(validation, step.id);
          const hasBlockers = issueCount.blockers > 0;
          const hasWarnings = issueCount.warnings > 0;
          const statusLabel = hasBlockers ? `${issueCount.blockers} blocker${issueCount.blockers === 1 ? '' : 's'}` : hasWarnings ? `${issueCount.warnings} warning${issueCount.warnings === 1 ? '' : 's'}` : '';
          return (
            <button
              className={`step-button ${step.id === currentStep.id ? 'active' : ''} ${hasBlockers ? 'has-blockers' : hasWarnings ? 'has-warnings' : ''}`}
              key={step.id}
              type="button"
              onClick={() => onStep(step.id)}
            >
              <span>{step.label}</span>
              <small>{step.helper}</small>
              {statusLabel ? <em>{statusLabel}</em> : null}
            </button>
          );
        })}
      </div>

      <div className="panel intake-panel">
        <p className="eyebrow">Guided intake</p>
        <h2>{currentStep.label}</h2>
        <p>{stepCopy(currentStep.id, plan)}</p>
        {currentStepIssues.length > 0 ? <SectionValidationSummary issues={currentStepIssues} /> : null}
        {isHouseholdStep ? (
          <HouseholdStep
            householdMode={householdMode}
            onHouseholdMode={onHouseholdMode}
            onUpdatePlan={onUpdatePlan}
            plan={plan}
          />
        ) : isIncomeStep ? (
          <IncomeStep householdMode={householdMode} onUpdatePlan={onUpdatePlan} plan={plan} />
        ) : isAccountsStep ? (
          <AccountsStep householdMode={householdMode} onUpdatePlan={onUpdatePlan} plan={plan} />
        ) : isRealEstateStep ? (
          <RealEstateStep onUpdatePlan={onUpdatePlan} plan={plan} />
        ) : isDebtsStep ? (
          <DebtsStep onUpdatePlan={onUpdatePlan} plan={plan} />
        ) : isSpendingStep ? (
          <SpendingEventsStep onUpdatePlan={onUpdatePlan} plan={plan} />
        ) : isAssumptionsStep ? (
          <AssumptionsStep householdMode={householdMode} onUpdatePlan={onUpdatePlan} plan={plan} />
        ) : (
          <div className="placeholder-box">
            <strong>{currentStep.helper}</strong>
            <span>{stepStatusCopy(currentStep.id)}</span>
          </div>
        )}
        <div className="actions">
          <button type="button" onClick={onNext}>
            Continue
          </button>
          <button className="ghost" type="button" onClick={onReview}>
            Review plan
          </button>
        </div>
      </div>
    </section>
  );
}

function AccountsStep({
  householdMode,
  onUpdatePlan,
  plan
}: {
  householdMode: 'single' | 'couple';
  onUpdatePlan: (mutator: (draft: V2PlanPayload) => void) => void;
  plan: V2PlanPayload;
}) {
  const person2Enabled = householdMode === 'couple';

  function updatePerson(person: 'p1' | 'p2', field: keyof PlanPerson, value: string) {
    onUpdatePlan((draft) => {
      draft[person] = {
        ...draft[person],
        [field]: numberFromInput(value)
      };
    });
  }

  function updateCashWedge(field: 'balance' | 'returnRate' | 'targetYears', value: string, mode: 'number' | 'percent' = 'number') {
    onUpdatePlan((draft) => {
      draft.cashWedge = {
        ...(draft.cashWedge || {}),
        [field]: mode === 'percent' ? decimalFromPercentInput(value) : numberFromInput(value)
      };
    });
  }

  return (
    <div className="accounts-form">
      <div className="person-grid">
        <AccountsPersonCard
          heading="Person 1 accounts"
          person={plan.p1}
          onChange={(field, value) => updatePerson('p1', field, value)}
        />
        <AccountsPersonCard
          blankZero
          disabled={!person2Enabled}
          heading="Person 2 accounts"
          helper={person2Enabled ? 'Owned accounts for Person 2.' : 'Inactive while the household is set to single.'}
          person={plan.p2}
          onChange={(field, value) => updatePerson('p2', field, value)}
        />
      </div>

      <fieldset className="field-group cash-wedge-fields">
        <legend>Cash wedge</legend>
        <p>
          Cash reserves are separate from investment accounts and can fund early retirement spending before taxable
          withdrawals are needed.
        </p>
        <div className="field-row three">
          <label className="field">
            <span>Cash balance</span>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(plan.cashWedge?.balance)}
              onChange={(event) => updateCashWedge('balance', event.target.value)}
              placeholder="145000"
            />
          </label>
          <label className="field">
            <span>Return %</span>
            <input
              inputMode="decimal"
              type="number"
              value={displayPercent(plan.cashWedge?.returnRate)}
              onChange={(event) => updateCashWedge('returnRate', event.target.value, 'percent')}
              placeholder="3"
            />
          </label>
          <label className="field">
            <span>Target years</span>
            <input
              inputMode="decimal"
              type="number"
              value={displayNumber(plan.cashWedge?.targetYears)}
              onChange={(event) => updateCashWedge('targetYears', event.target.value)}
              placeholder="2"
            />
          </label>
        </div>
      </fieldset>
    </div>
  );
}

function AccountsPersonCard({
  blankZero = false,
  disabled = false,
  heading,
  helper = 'Registered, TFSA, and taxable account balances owned by this person.',
  onChange,
  person
}: {
  blankZero?: boolean;
  disabled?: boolean;
  heading: string;
  helper?: string;
  onChange: (field: keyof PlanPerson, value: string) => void;
  person: PlanPerson;
}) {
  return (
    <fieldset className={`person-card accounts-card ${disabled ? 'disabled' : ''}`} disabled={disabled}>
      <legend>{heading}</legend>
      <p>{helper}</p>

      <div className="field-section">
        <strong>Registered accounts</strong>
        <p className="field-hint">Use current balances. RRSP/RRIF are taxable when withdrawn; locked-in accounts follow pension rules.</p>
        <div className="field-row">
          <label className="field">
            <span>RRSP/RRIF balance</span>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(person.rrsp, blankZero)}
              onChange={(event) => onChange('rrsp', event.target.value)}
              placeholder="300000"
            />
          </label>
          <label className="field">
            <span>RRSP room</span>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(person.rrspRoom, blankZero)}
              onChange={(event) => onChange('rrspRoom', event.target.value)}
              placeholder="30000"
            />
          </label>
        </div>
        <div className="field-row">
          <label className="field">
            <span>Locked-in account (LIRA)</span>
            <small>Locked-in money from a former pension that has not started LIF withdrawals.</small>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(person.lira, blankZero)}
              onChange={(event) => onChange('lira', event.target.value)}
              placeholder="0"
            />
          </label>
          <label className="field">
            <span>Locked-in income account (LIF)</span>
            <small>Locked-in retirement income account after withdrawals have started.</small>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(person.lif, blankZero)}
              onChange={(event) => onChange('lif', event.target.value)}
              placeholder="0"
            />
          </label>
        </div>
        <label className="field full">
          <span>Annual RRSP contribution while working</span>
          <input
            inputMode="numeric"
            type="number"
            value={displayNumber(person.annualRrspContrib, blankZero)}
            onChange={(event) => onChange('annualRrspContrib', event.target.value)}
            placeholder="18000"
          />
        </label>
      </div>

      <div className="field-section">
        <strong>TFSA</strong>
        <p className="field-hint">TFSA withdrawals are tax-free in this plan and can help fund spending without increasing taxable income.</p>
        <div className="field-row">
          <label className="field">
            <span>TFSA balance</span>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(person.tfsa, blankZero)}
              onChange={(event) => onChange('tfsa', event.target.value)}
              placeholder="100000"
            />
          </label>
          <label className="field">
            <span>TFSA room</span>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(person.tfsaRoom, blankZero)}
              onChange={(event) => onChange('tfsaRoom', event.target.value)}
              placeholder="22000"
            />
          </label>
        </div>
        <div className="field-row">
          <label className="field">
            <span>Annual TFSA contribution</span>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(person.annualTfsaContrib, blankZero)}
              onChange={(event) => onChange('annualTfsaContrib', event.target.value)}
              placeholder="7000"
            />
          </label>
          <label className="field">
            <span>TFSA planned annual</span>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(person.tfsaAnnual, blankZero)}
              onChange={(event) => onChange('tfsaAnnual', event.target.value)}
              placeholder="4000"
            />
          </label>
        </div>
      </div>

      <div className="field-section">
        <strong>Non-registered</strong>
        <p className="field-hint">Taxable investment accounts need an adjusted cost base so future capital gains are not overstated.</p>
        <div className="field-row">
          <label className="field">
            <span>Balance</span>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(person.nonreg, blankZero)}
              onChange={(event) => onChange('nonreg', event.target.value)}
              placeholder="40000"
            />
          </label>
          <label className="field">
            <span>Adjusted cost base</span>
            <small>Usually the original cost of taxable investments, adjusted for purchases, sales, and reinvested distributions.</small>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(person.nonregAcb, blankZero)}
              onChange={(event) => onChange('nonregAcb', event.target.value)}
              placeholder="35000"
            />
          </label>
        </div>
        <label className="field full">
          <span>Annual non-registered contribution while working</span>
          <input
            inputMode="numeric"
            type="number"
            value={displayNumber(person.annualNonregContrib ?? person.nonregAnnual, blankZero)}
            onChange={(event) => {
              onChange('annualNonregContrib', event.target.value);
              onChange('nonregAnnual', event.target.value);
            }}
            placeholder="0"
          />
        </label>
      </div>
    </fieldset>
  );
}

function RealEstateStep({
  onUpdatePlan,
  plan
}: {
  onUpdatePlan: (mutator: (draft: V2PlanPayload) => void) => void;
  plan: V2PlanPayload;
}) {
  function updateDownsize(field: 'year' | 'netProceeds', value: string) {
    onUpdatePlan((draft) => {
      draft.downsize = {
        ...(draft.downsize || {}),
        [field]: numberFromInput(value)
      };
    });
  }

  return (
    <div className="real-estate-form">
      <fieldset className="field-group single-column">
        <legend>Home sale or downsizing</legend>
        <p>
          If selling or downsizing is part of the plan, enter the year and estimated cash left after selling costs,
          moving costs, and buying the next home. Leave blank if the home is not expected to fund retirement spending.
        </p>
        <div className="field-row">
          <label className="field">
            <span>Sale or downsize year</span>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(plan.downsize?.year, true)}
              onChange={(event) => updateDownsize('year', event.target.value)}
              placeholder="2036"
            />
          </label>
          <label className="field">
            <span>Cash added to retirement</span>
            <small>Cash available to the plan after the sale and replacement-home decision.</small>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(plan.downsize?.netProceeds, true)}
              onChange={(event) => updateDownsize('netProceeds', event.target.value)}
              placeholder="100000"
            />
          </label>
        </div>
      </fieldset>

      <div className="validation-panel ok">
        <strong>Real estate note</strong>
        <span>
          This planner currently uses the net cash from a future sale or downsize. Keep separate property appraisals,
          ownership details, and sale-cost estimates with your detailed records.
        </span>
      </div>
    </div>
  );
}

function DebtsStep({
  onUpdatePlan,
  plan
}: {
  onUpdatePlan: (mutator: (draft: V2PlanPayload) => void) => void;
  plan: V2PlanPayload;
}) {
  function updateMortgage(field: 'balance' | 'rate' | 'monthly', value: string, mode: 'number' | 'percent' = 'number') {
    onUpdatePlan((draft) => {
      draft.mortgage = {
        ...(draft.mortgage || {}),
        [field]: mode === 'percent' ? decimalFromPercentInput(value) : numberFromInput(value)
      };
    });
  }

  function updateLoc(field: 'balance' | 'rate', value: string, mode: 'number' | 'percent' = 'number') {
    onUpdatePlan((draft) => {
      draft.loc = {
        ...(draft.loc || {}),
        [field]: mode === 'percent' ? decimalFromPercentInput(value) : numberFromInput(value)
      };
    });
  }

  return (
    <div className="debts-form">
      <fieldset className="field-group single-column">
        <legend>Mortgage</legend>
        <div className="field-row three">
          <label className="field">
            <span>Balance</span>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(plan.mortgage?.balance)}
              onChange={(event) => updateMortgage('balance', event.target.value)}
              placeholder="150000"
            />
          </label>
          <label className="field">
            <span>Rate %</span>
            <input
              inputMode="decimal"
              type="number"
              value={displayPercent(plan.mortgage?.rate)}
              onChange={(event) => updateMortgage('rate', event.target.value, 'percent')}
              placeholder="5.5"
            />
          </label>
          <label className="field">
            <span>Monthly payment</span>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(plan.mortgage?.monthly)}
              onChange={(event) => updateMortgage('monthly', event.target.value)}
              placeholder="1750"
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="field-group single-column">
        <legend>Line of credit</legend>
        <div className="field-row">
          <label className="field">
            <span>Balance</span>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(plan.loc?.balance)}
              onChange={(event) => updateLoc('balance', event.target.value)}
              placeholder="0"
            />
          </label>
          <label className="field">
            <span>Rate %</span>
            <input
              inputMode="decimal"
              type="number"
              value={displayPercent(plan.loc?.rate)}
              onChange={(event) => updateLoc('rate', event.target.value, 'percent')}
              placeholder="7"
            />
          </label>
        </div>
      </fieldset>
    </div>
  );
}

function SpendingEventsStep({
  onUpdatePlan,
  plan
}: {
  onUpdatePlan: (mutator: (draft: V2PlanPayload) => void) => void;
  plan: V2PlanPayload;
}) {
  function updateSpending(field: 'gogo' | 'gogoEnd' | 'slowgo' | 'slowgoEnd' | 'nogo', value: string) {
    onUpdatePlan((draft) => {
      draft.spending = {
        ...(draft.spending || {}),
        [field]: numberFromInput(value)
      };
    });
  }

  function updateInheritance(value: string) {
    onUpdatePlan((draft) => {
      draft.inheritance = numberFromInput(value);
    });
  }

  function updateOneOff(index: number, field: 'year' | 'amount' | 'label', value: string) {
    onUpdatePlan((draft) => {
      const events = [...(draft.oneOffs || [])];
      const current = events[index] || { year: 0, amount: 0, label: '' };
      events[index] = {
        ...current,
        [field]: field === 'label' ? value : numberFromInput(value)
      };
      draft.oneOffs = events;
    });
  }

  function addOneOff() {
    onUpdatePlan((draft) => {
      draft.oneOffs = [...(draft.oneOffs || []), { year: draft.assumptions.retireYear || draft.p1.retireYear || 2030, amount: 0, label: '' }];
    });
  }

  function removeOneOff(index: number) {
    onUpdatePlan((draft) => {
      draft.oneOffs = (draft.oneOffs || []).filter((_, eventIndex) => eventIndex !== index);
    });
  }

  return (
    <div className="spending-form">
      <fieldset className="field-group single-column">
        <legend>Retirement lifestyle spending</legend>
        <p>
          Enter annual after-tax lifestyle spending for each phase. These are the numbers the Results page uses to
          judge comfort, flexibility, and whether the plan is preserving more estate than intended.
        </p>
        <div className="field-row three">
          <label className="field">
            <span>Early retirement spending</span>
            <small>Travel, projects, hobbies, and active years after work stops.</small>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(plan.spending.gogo)}
              onChange={(event) => updateSpending('gogo', event.target.value)}
              placeholder="80000"
            />
          </label>
          <label className="field">
            <span>Early spending ends at age</span>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(plan.spending.gogoEnd)}
              onChange={(event) => updateSpending('gogoEnd', event.target.value)}
              placeholder="75"
            />
          </label>
          <label className="field">
            <span>Later retirement spending</span>
            <small>A steadier phase when travel or large discretionary spending may slow.</small>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(plan.spending.slowgo)}
              onChange={(event) => updateSpending('slowgo', event.target.value)}
              placeholder="65000"
            />
          </label>
        </div>
        <div className="field-row">
          <label className="field">
            <span>Later spending ends at age</span>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(plan.spending.slowgoEnd)}
              onChange={(event) => updateSpending('slowgoEnd', event.target.value)}
              placeholder="85"
            />
          </label>
          <label className="field">
            <span>Late-life spending</span>
            <small>Ongoing lifestyle spending in later years; care costs should be added as one-time or separate estimates if needed.</small>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(plan.spending.nogo)}
              onChange={(event) => updateSpending('nogo', event.target.value)}
              placeholder="55000"
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="field-group single-column">
        <legend>Estate goal</legend>
        <p>
          Optional: enter the money you intentionally want left at the end of the plan. Leave this at zero if you want
          Results to flag a large projected estate as a choice to review.
        </p>
        <label className="field full">
          <span>Money you want to leave</span>
          <input
            inputMode="numeric"
            type="number"
            value={displayNumber(plan.inheritance)}
            onChange={(event) => updateInheritance(event.target.value)}
            placeholder="0"
          />
        </label>
      </fieldset>

      <fieldset className="field-group single-column">
        <legend>One-time expenses</legend>
        <p>
          Add large goals or costs that do not repeat every year, such as travel, a vehicle, renovations, gifts, or
          family support.
        </p>
        <div className="event-list">
          {(plan.oneOffs || []).map((event, index) => (
            <div className="event-row" key={`${index}-${event.label || 'event'}`}>
              <label className="field">
                <span>Year</span>
                <input
                  inputMode="numeric"
                  type="number"
                  value={displayNumber(event.year, true)}
                  onChange={(inputEvent) => updateOneOff(index, 'year', inputEvent.target.value)}
                  placeholder="2028"
                />
              </label>
              <label className="field">
                <span>Amount</span>
                <input
                  inputMode="numeric"
                  type="number"
                  value={displayNumber(event.amount, true)}
                  onChange={(inputEvent) => updateOneOff(index, 'amount', inputEvent.target.value)}
                  placeholder="20000"
                />
              </label>
              <label className="field">
                <span>Label</span>
                <input
                  value={event.label || ''}
                  onChange={(inputEvent) => updateOneOff(index, 'label', inputEvent.target.value)}
                  placeholder="Vacation"
                />
              </label>
              <button className="ghost compact-button" type="button" onClick={() => removeOneOff(index)}>
                Remove
              </button>
            </div>
          ))}
          {(plan.oneOffs || []).length === 0 ? <p>No one-time expenses added.</p> : null}
        </div>
        <button className="ghost" type="button" onClick={addOneOff}>
          Add one-time expense
        </button>
      </fieldset>
    </div>
  );
}

function AssumptionsStep({
  householdMode,
  onUpdatePlan,
  plan
}: {
  householdMode: 'single' | 'couple';
  onUpdatePlan: (mutator: (draft: V2PlanPayload) => void) => void;
  plan: V2PlanPayload;
}) {
  const coupleMode = householdMode === 'couple';
  const spousalRrspOn = Boolean(plan.assumptions.spousalRrsp);

  function updateAssumption(
    field: keyof V2PlanPayload['assumptions'],
    value: string | boolean | null,
    mode: 'number' | 'percent' | 'boolean' | 'text' | 'nullableNumber' = 'number'
  ) {
    onUpdatePlan((draft) => {
      let next: string | number | boolean | null = value;
      if (mode === 'percent' && typeof value === 'string') next = decimalFromPercentInput(value);
      if (mode === 'number' && typeof value === 'string') next = numberFromInput(value);
      if (mode === 'nullableNumber' && typeof value === 'string') next = value.trim() === '' ? null : numberFromInput(value);
      draft.assumptions = {
        ...(draft.assumptions || {}),
        [field]: next
      };
    });
  }

  function toggleSpousalRrsp(checked: boolean) {
    onUpdatePlan((draft) => {
      draft.assumptions.spousalRrsp = checked ? { contributor: 'p1', contribs: {} } : null;
    });
  }

  return (
    <div className="assumptions-form">
      <fieldset className="field-group single-column">
        <legend>Plan years</legend>
        <p>
          Choose the first year to model, the retirement year to test, and the year the plan should support spending
          through.
        </p>
        <div className="field-row three">
          <label className="field">
            <span>Plan start</span>
            <input
              inputMode="numeric"
              type="number"
              value={plan.assumptions.planStart == null ? '' : displayNumber(plan.assumptions.planStart)}
              onChange={(event) => updateAssumption('planStart', event.target.value, 'nullableNumber')}
              placeholder="Auto"
            />
          </label>
          <label className="field">
            <span>Retirement year</span>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(plan.assumptions.retireYear)}
              onChange={(event) => updateAssumption('retireYear', event.target.value)}
              placeholder="2030"
            />
          </label>
          <label className="field">
            <span>Plan end</span>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(plan.assumptions.planEnd)}
              onChange={(event) => updateAssumption('planEnd', event.target.value)}
              placeholder="2065"
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="field-group single-column">
        <legend>Returns and inflation</legend>
        <p>
          These assumptions shape every projection. Use conservative long-term estimates rather than a best-case market
          guess.
        </p>
        <div className="field-row three">
          <label className="field">
            <span>Return %</span>
            <input
              inputMode="decimal"
              type="number"
              value={displayPercent(plan.assumptions.returnRate)}
              onChange={(event) => updateAssumption('returnRate', event.target.value, 'percent')}
              placeholder="5"
            />
          </label>
          <label className="field">
            <span>Inflation %</span>
            <input
              inputMode="decimal"
              type="number"
              value={displayPercent(plan.assumptions.inflation)}
              onChange={(event) => updateAssumption('inflation', event.target.value, 'percent')}
              placeholder="2.5"
            />
          </label>
          <label className="field">
            <span>Return volatility %</span>
            <input
              inputMode="decimal"
              type="number"
              value={displayPercent(plan.assumptions.returnStdDev)}
              onChange={(event) => updateAssumption('returnStdDev', event.target.value, 'percent')}
              placeholder="10"
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="field-group single-column">
        <legend>Strategy options</legend>
        <p>
          These are planning switches for tax and withdrawal timing. If unsure, leave the defaults and review the Results
          tax and estate sections first.
        </p>
        <label className="field full">
          <span>Withdrawal order to test</span>
          <small>Controls which account type is drawn first in this planning run.</small>
          <select
            value={plan.assumptions.withdrawalOrder || 'default'}
            onChange={(event) => updateAssumption('withdrawalOrder', event.target.value, 'text')}
          >
            <option value="default">Default</option>
            <option value="registered-first">Registered first</option>
            <option value="nonreg-first">Non-registered first</option>
            <option value="tfsa-first">TFSA first</option>
            <option value="meltdown">Meltdown diagnostic</option>
          </select>
        </label>
        <div className="toggle-grid">
          <label className={`toggle-row ${!coupleMode ? 'disabled' : ''}`}>
            <input
              checked={Boolean(plan.assumptions.cppSharing)}
              disabled={!coupleMode}
              type="checkbox"
              onChange={(event) => updateAssumption('cppSharing', event.target.checked, 'boolean')}
            />
            <span>CPP sharing</span>
            <small>For eligible couples, CPP sharing can shift taxable income between spouses.</small>
          </label>
          <label className={`toggle-row ${!coupleMode ? 'disabled' : ''}`}>
            <input
              checked={Boolean(plan.assumptions.youngerSpouseRrif)}
              disabled={!coupleMode}
              type="checkbox"
              onChange={(event) => updateAssumption('youngerSpouseRrif', event.target.checked, 'boolean')}
            />
            <span>Use younger spouse age for RRIF minimum</span>
            <small>Can lower required registered withdrawals when one spouse is younger.</small>
          </label>
          <label className={`toggle-row ${!coupleMode ? 'disabled' : ''}`}>
            <input checked={spousalRrspOn} disabled={!coupleMode} type="checkbox" onChange={(event) => toggleSpousalRrsp(event.target.checked)} />
            <span>Spousal RRSP attribution</span>
            <small>Use only if spousal RRSP contributions affect withdrawal tax attribution.</small>
          </label>
        </div>
        {spousalRrspOn ? (
          <label className="field full">
            <span>Spousal RRSP contributor</span>
            <select
              value={plan.assumptions.spousalRrsp?.contributor || 'p1'}
              onChange={(event) =>
                onUpdatePlan((draft) => {
                  draft.assumptions.spousalRrsp = {
                    contributor: event.target.value,
                    contribs: draft.assumptions.spousalRrsp?.contribs || {}
                  };
                })
              }
            >
              <option value="p1">Person 1</option>
              <option value="p2">Person 2</option>
            </select>
          </label>
        ) : null}
      </fieldset>

      <fieldset className={`field-group single-column ${!coupleMode ? 'disabled' : ''}`} disabled={!coupleMode}>
        <legend>Survivor scenario</legend>
        <p>
          Optional for couples: choose a year to test whether the surviving spouse still has enough income and assets.
          Use a year that would feel important to understand before relying on the plan.
        </p>
        <label className="field full">
          <span>Person 1 death year to test</span>
          <input
            inputMode="numeric"
            type="number"
            value={displayNumber(plan.assumptions.p1DiesInSurvivor, true)}
            onChange={(event) => updateAssumption('p1DiesInSurvivor', event.target.value)}
            placeholder="2099"
          />
        </label>
      </fieldset>
    </div>
  );
}

function IncomeStep({
  householdMode,
  onUpdatePlan,
  plan
}: {
  householdMode: 'single' | 'couple';
  onUpdatePlan: (mutator: (draft: V2PlanPayload) => void) => void;
  plan: V2PlanPayload;
}) {
  const person2Enabled = householdMode === 'couple';

  function updatePerson(person: 'p1' | 'p2', field: keyof PlanPerson, value: string, mode: 'number' | 'percent' = 'number') {
    onUpdatePlan((draft) => {
      draft[person] = {
        ...draft[person],
        [field]: mode === 'percent' ? decimalFromPercentInput(value) : numberFromInput(value)
      };
    });
  }

  function updateSurvivor(field: 'cppSurv_u65_mo' | 'cppSurv_o65_mo', annualField: 'cppSurvivor_under65' | 'cppSurvivor_over65', value: string) {
    onUpdatePlan((draft) => {
      const monthly = numberFromInput(value);
      draft.p2 = {
        ...draft.p2,
        [field]: monthly,
        [annualField]: monthly * 12
      };
    });
  }

  return (
    <div className="income-form">
      <div className="person-grid">
        <IncomePersonCard
          heading="Person 1 income"
          person={plan.p1}
          onChange={(field, value, mode) => updatePerson('p1', field, value, mode)}
        />
        <IncomePersonCard
          blankZero
          disabled={!person2Enabled}
          heading="Person 2 income"
          helper={
            person2Enabled
              ? 'Used for couple projections and retirement-year income timing.'
              : 'Inactive while the household is set to single.'
          }
          person={plan.p2}
          onChange={(field, value, mode) => updatePerson('p2', field, value, mode)}
        />
      </div>

      <fieldset className={`field-group survivor-fields ${!person2Enabled ? 'disabled' : ''}`} disabled={!person2Enabled}>
        <legend>Person 2 survivor CPP</legend>
        <p>
          Optional monthly survivor CPP estimates for the survivor scenario. Use Service Canada or CPP survivor
          estimates if available; otherwise leave blank and review survivor impact as an assumption.
        </p>
        <div className="field-row">
          <label className="field">
            <span>Under 65 monthly</span>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(survivorMonthlyValue(plan.p2, 'cppSurv_u65_mo'), true)}
              onChange={(event) => updateSurvivor('cppSurv_u65_mo', 'cppSurvivor_under65', event.target.value)}
              placeholder="480"
            />
          </label>
          <label className="field">
            <span>65+ monthly</span>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(survivorMonthlyValue(plan.p2, 'cppSurv_o65_mo'), true)}
              onChange={(event) => updateSurvivor('cppSurv_o65_mo', 'cppSurvivor_over65', event.target.value)}
              placeholder="540"
            />
          </label>
        </div>
      </fieldset>
    </div>
  );
}

function IncomePersonCard({
  blankZero = false,
  disabled = false,
  heading,
  helper = 'Use annual employment and pension amounts plus monthly government benefit estimates. Leave items blank if they do not apply.',
  onChange,
  person
}: {
  blankZero?: boolean;
  disabled?: boolean;
  heading: string;
  helper?: string;
  onChange: (field: keyof PlanPerson, value: string, mode?: 'number' | 'percent') => void;
  person: PlanPerson;
}) {
  return (
    <fieldset className={`person-card income-card ${disabled ? 'disabled' : ''}`} disabled={disabled}>
      <legend>{heading}</legend>
      <p>{helper}</p>

      <div className="field-section">
        <strong>Employment</strong>
        <p className="field-hint">Use current employment income if this person is still working. Leave salary at zero if already retired.</p>
        <label className="field full">
          <span>Annual salary</span>
          <input
            inputMode="numeric"
            type="number"
            value={displayNumber(person.salary, blankZero)}
            onChange={(event) => onChange('salary', event.target.value)}
            placeholder="100000"
          />
        </label>
        <div className="field-row">
          <label className="field">
            <span>Salary year</span>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(person.salaryRefYear, blankZero)}
              onChange={(event) => onChange('salaryRefYear', event.target.value)}
              placeholder="2026"
            />
          </label>
          <label className="field">
            <span>Annual raise %</span>
            <input
              inputMode="decimal"
              type="number"
              value={displayPercent(person.salaryRaise, blankZero)}
              onChange={(event) => onChange('salaryRaise', event.target.value, 'percent')}
              placeholder="3"
            />
          </label>
        </div>
      </div>

      <div className="field-section">
        <strong>Defined benefit pension</strong>
        <p className="field-hint">
          Some pensions include a temporary bridge before 65. Enter the before-65 and 65+ annual amounts from the pension estimate, then add the spouse continuation from the pension statement.
        </p>
        <div className="field-row">
          <label className="field">
            <span>Before 65 annual</span>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(person.db_before65, blankZero)}
              onChange={(event) => onChange('db_before65', event.target.value)}
              placeholder="20000"
            />
          </label>
          <label className="field">
            <span>65+ annual</span>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(person.db_after65, blankZero)}
              onChange={(event) => onChange('db_after65', event.target.value)}
              placeholder="18000"
            />
          </label>
        </div>
        <div className="field-row">
          <label className="field">
            <span>Start year</span>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(person.db_startYear, blankZero)}
              onChange={(event) => onChange('db_startYear', event.target.value)}
              placeholder="2030"
            />
          </label>
          <label className="field">
            <span>Indexing %</span>
            <input
              inputMode="decimal"
              type="number"
              value={displayPercent(person.db_index, blankZero)}
              onChange={(event) => onChange('db_index', event.target.value, 'percent')}
              placeholder="2.2"
            />
          </label>
        </div>
        <div className="field-row">
          <label className="field">
            <span>Survivor continuation %</span>
            <small>Use the spouse amount from the DB pension statement. If left blank or 0, survivor testing assumes 60% of the 65+ pension.</small>
            <input
              inputMode="decimal"
              type="number"
              value={displayPercent(person.db_survivor_pct, blankZero)}
              onChange={(event) => onChange('db_survivor_pct', event.target.value, 'percent')}
              placeholder="60"
            />
          </label>
          <label className="field">
            <span>Custom survivor annual</span>
            <small>Optional annual spouse amount if the statement gives a dollar value instead of a percentage.</small>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(person.db_survivor_annual, blankZero)}
              onChange={(event) => onChange('db_survivor_annual', event.target.value)}
              placeholder="0"
            />
          </label>
        </div>
      </div>

      <div className="field-section">
        <strong>CPP and OAS estimates</strong>
        <p className="field-hint">Use Service Canada estimates where possible. CPP fields are monthly amounts before tax; OAS is the estimated monthly benefit before any clawback.</p>
        <div className="field-row three">
          <label className="field">
            <span>Canada Pension Plan (CPP) at 65</span>
            <small>Your estimated monthly CPP if started at 65.</small>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(person.cpp65_monthly, blankZero)}
              onChange={(event) => onChange('cpp65_monthly', event.target.value)}
              placeholder="1268"
            />
          </label>
          <label className="field">
            <span>Canada Pension Plan (CPP) at 70</span>
            <small>Your estimated monthly CPP if delayed to 70.</small>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(person.cpp70_monthly, blankZero)}
              onChange={(event) => onChange('cpp70_monthly', event.target.value)}
              placeholder="1800"
            />
          </label>
          <label className="field">
            <span>Old Age Security (OAS) monthly</span>
            <small>Use today's monthly OAS estimate before income-tested recovery tax.</small>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(person.oas_monthly, blankZero)}
              onChange={(event) => onChange('oas_monthly', event.target.value)}
              placeholder="742"
            />
          </label>
        </div>
      </div>
    </fieldset>
  );
}

function HouseholdStep({
  householdMode,
  onHouseholdMode,
  onUpdatePlan,
  plan
}: {
  householdMode: 'single' | 'couple';
  onHouseholdMode: (mode: 'single' | 'couple') => void;
  onUpdatePlan: (mutator: (draft: V2PlanPayload) => void) => void;
  plan: V2PlanPayload;
}) {
  const person2Enabled = householdMode === 'couple';
  const p2Inactive = p2LooksBlank(plan.p2);

  function updatePerson(person: 'p1' | 'p2', field: keyof PlanPerson, value: string, numeric = false) {
    onUpdatePlan((draft) => {
      draft[person] = {
        ...draft[person],
        [field]: numeric ? numberFromInput(value) : value
      };
      if (person === 'p1' && field === 'retireYear') {
        draft.assumptions.retireYear = numberFromInput(value);
      }
    });
  }

  return (
    <div className="household-form">
      <fieldset className="field-group">
        <legend>Plan setup</legend>
        <label className="field full">
          <span>Plan name</span>
          <input
            value={plan.title || ''}
            onChange={(event) =>
              onUpdatePlan((draft) => {
                draft.title = event.target.value;
              })
            }
            placeholder="Name your plan"
          />
        </label>
        <div className="segmented-control" role="group" aria-label="Household type">
          <button
            className={householdMode === 'single' ? 'selected' : ''}
            type="button"
            onClick={() => onHouseholdMode('single')}
          >
            Single
          </button>
          <button
            className={householdMode === 'couple' ? 'selected' : ''}
            type="button"
            onClick={() => onHouseholdMode('couple')}
          >
            Couple
          </button>
        </div>
      </fieldset>

      <div className="person-grid">
        <PersonCard
          heading="Person 1"
          helper="Primary person for retirement timing and household planning."
          person={plan.p1}
          onChange={(field, value, numeric) => updatePerson('p1', field, value, numeric)}
        />
        <PersonCard
          disabled={!person2Enabled}
          heading="Person 2"
          helper={
            person2Enabled
              ? 'Only saved as active once real Person 2 details are entered.'
              : 'Inactive for single-person plans. No placeholder values will be saved.'
          }
          person={plan.p2}
          blankZero
          onChange={(field, value, numeric) => updatePerson('p2', field, value, numeric)}
        />
      </div>

      <div className={`validation-panel ${p2Inactive ? 'ok' : ''}`}>
        <strong>{person2Enabled ? 'Person 2 status' : 'Single-person mode'}</strong>
        <span>
          {person2Enabled && p2Inactive
            ? 'Person 2 fields are visible but still blank. Enter a birth year and retirement year to make this a couple plan.'
            : person2Enabled
              ? 'Person 2 has active details and will be included in validation and saved plan files.'
              : 'Person 2 is kept inactive and exported as blank v2 fields.'}
        </span>
      </div>
    </div>
  );
}

function PersonCard({
  blankZero = false,
  disabled = false,
  heading,
  helper,
  onChange,
  person
}: {
  blankZero?: boolean;
  disabled?: boolean;
  heading: string;
  helper: string;
  onChange: (field: keyof PlanPerson, value: string, numeric?: boolean) => void;
  person: PlanPerson;
}) {
  return (
    <fieldset className={`person-card ${disabled ? 'disabled' : ''}`} disabled={disabled}>
      <legend>{heading}</legend>
      <p>{helper}</p>
      <label className="field full">
        <span>Name</span>
        <input
          value={person.name || ''}
          onChange={(event) => onChange('name', event.target.value)}
          placeholder={heading}
        />
      </label>
      <div className="field-row">
        <label className="field">
          <span>Birth year</span>
          <input
            inputMode="numeric"
            type="number"
            value={displayNumber(person.dob, blankZero)}
            onChange={(event) => onChange('dob', event.target.value, true)}
            placeholder="1965"
          />
        </label>
        <label className="field">
          <span>Birth month</span>
          <input
            inputMode="numeric"
            max={12}
            min={1}
            type="number"
            value={displayNumber(person.dobMonth, blankZero)}
            onChange={(event) => onChange('dobMonth', event.target.value, true)}
            placeholder="6"
          />
        </label>
      </div>
      <label className="field full">
        <span>Retirement year</span>
        <input
          inputMode="numeric"
          type="number"
          value={displayNumber(person.retireYear, blankZero)}
          onChange={(event) => onChange('retireYear', event.target.value, true)}
          placeholder="2030"
        />
      </label>
    </fieldset>
  );
}

function ReviewPanel({
  bridgeError,
  endPortfolio,
  firstYear,
  lastYear,
  onDownload,
  onResults,
  onStep,
  plan,
  title,
  validation
}: {
  bridgeError: string;
  endPortfolio: number | undefined;
  firstYear: number | undefined;
  lastYear: number | undefined;
  onDownload: () => void;
  onResults: () => void;
  onStep: (step: IntakeStepId) => void;
  plan: V2PlanPayload;
  title: string;
  validation: PlanValidationResult | null;
}) {
  const hasBlockers = Boolean(validation && !validation.canGenerate);
  return (
    <section className="panel">
      <p className="eyebrow">Review</p>
      <h2>{title}</h2>
      <div className="summary-grid">
        <Metric label="Household" value={p2LooksBlank(plan.p2) ? 'Single-person plan' : 'Couple plan'} />
        <Metric label="Retirement year" value={String(plan.assumptions.retireYear || plan.p1.retireYear || '-')} />
        <Metric label="Spending target" value={formatMoney(plan.spending.gogo)} />
        <Metric label="Preview years" value={firstYear && lastYear ? `${firstYear}-${lastYear}` : '-'} />
        <Metric label="End portfolio" value={formatMoney(endPortfolio)} />
      </div>
      <ReviewSummary plan={plan} />
      {validation ? <ValidationPanel validation={validation} /> : null}
      {bridgeError ? <p className="error">{bridgeError}</p> : null}
      <div className="review-links">
        {intakeSteps.slice(0, -1).map((step) => (
          <button className="text-button" key={step.id} type="button" onClick={() => onStep(step.id)}>
            Edit {step.label}
          </button>
        ))}
      </div>
      <div className="actions">
        <button type="button" onClick={onResults} disabled={hasBlockers}>
          Continue to results
        </button>
        <button className="ghost" type="button" onClick={onDownload}>
          Save editable plan
        </button>
      </div>
    </section>
  );
}

function ReviewSummary({ plan }: { plan: V2PlanPayload }) {
  const p2Active = !p2LooksBlank(plan.p2);
  return (
    <div className="review-summary" aria-label="Plan input summary">
      <ReviewSummaryCard
        title="Household"
        rows={[
          ['Person 1', plan.p1.name || 'Person 1'],
          ['Person 2', p2Active ? plan.p2.name || 'Person 2' : 'Inactive'],
          ['Birth years', p2Active ? `${plan.p1.dob || '-'} / ${plan.p2.dob || '-'}` : String(plan.p1.dob || '-')]
        ]}
      />
      <ReviewSummaryCard
        title="Income"
        rows={[
          ['Salary', formatMoney(sumPeople(plan, 'salary'))],
          ['DB pension before 65', formatMoney(sumPeople(plan, 'db_before65'))],
          ['DB survivor continuation', dbSurvivorSetupText(plan)],
          ['CPP at 65 monthly', formatMoney(sumPeople(plan, 'cpp65_monthly'))],
          ['Old Age Security monthly', formatMoney(sumPeople(plan, 'oas_monthly'))]
        ]}
      />
      <ReviewSummaryCard
        title="Accounts"
        rows={[
          ['Investable assets', formatMoney(totalInvestableAssets(plan))],
          ['RRSP/RRIF', formatMoney(sumPeople(plan, 'rrsp'))],
          ['TFSA', formatMoney(sumPeople(plan, 'tfsa'))],
          ['Cash wedge', formatMoney(plan.cashWedge?.balance)]
        ]}
      />
      <ReviewSummaryCard
        title="Real estate & debt"
        rows={[
          ['Downsize year', plan.downsize?.year ? String(plan.downsize.year) : 'None'],
          ['Downsize proceeds', formatMoney(plan.downsize?.netProceeds)],
          ['Debt balance', formatMoney(totalDebt(plan))]
        ]}
      />
      <ReviewSummaryCard
        title="Spending & events"
        rows={[
          ['Early / later / late-life spending', `${formatMoney(plan.spending.gogo)} / ${formatMoney(plan.spending.slowgo)} / ${formatMoney(plan.spending.nogo)}`],
          ['One-time expenses', String((plan.oneOffs || []).length)],
          ['Bequest target', formatMoney(plan.inheritance)]
        ]}
      />
      <ReviewSummaryCard
        title="Assumptions"
        rows={[
          ['Plan end', String(plan.assumptions.planEnd || '-')],
          ['Return / inflation', `${formatPercent(plan.assumptions.returnRate)} / ${formatPercent(plan.assumptions.inflation)}`],
          ['Withdrawal order to test', plan.assumptions.withdrawalOrder || 'default']
        ]}
      />
    </div>
  );
}

function ReviewSummaryCard({ rows, title }: { rows: Array<[string, string]>; title: string }) {
  return (
    <section className="review-summary-card">
      <h3>{title}</h3>
      <dl>
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function ResultsHandoffPanel({
  activeSection,
  bridgeError,
  loading,
  onDownload,
  onSection,
  plan,
  result,
  scenarios,
  spendingStress,
  survivor,
  optimizer,
  hiddenDrawdownComparison,
  drawdownPrototypeReadiness,
  drawdownVisibleReviewGate,
  drawdownReviewPreview,
  drawdownPhaseReview,
  drawdownExecutionBoundary,
  drawdownAdapterValidation,
  drawdownExecutionGoNoGo,
  drawdownExecutionPreflight,
  drawdownAdapterAuditTrail,
  drawdownExecutionContainmentGuard,
  drawdownExecutionPhaseCloseout,
  containedDrawdownPrototype,
  containedDrawdownPrototypeSummary,
  containedDrawdownMateriality,
  containedDrawdownExplanation,
  containedDrawdownLimitations,
  containedDrawdownUsefulnessCloseout,
  containedDrawdownDetailsDensity,
  containedDrawdownReviewChecklist,
  containedDrawdownExampleGate,
  containedDrawdownCopyGuard,
  containedDrawdownProductGoNoGo,
  title,
  validation
}: {
  activeSection: ResultsWorkspaceSection;
  bridgeError: string;
  loading: boolean;
  onDownload: () => void;
  onSection: (section: ResultsWorkspaceSection) => void;
  plan: V2PlanPayload;
  result: SimulationResult | null;
  scenarios: BridgePreview['scenarios'];
  spendingStress: BridgePreview['spendingStress'];
  survivor: BridgePreview['survivor'];
  optimizer: BridgePreview['optimizer'];
  hiddenDrawdownComparison: BridgePreview['hiddenDrawdownComparison'];
  drawdownPrototypeReadiness: BridgePreview['drawdownPrototypeReadiness'];
  drawdownVisibleReviewGate: BridgePreview['drawdownVisibleReviewGate'];
  drawdownReviewPreview: BridgePreview['drawdownReviewPreview'];
  drawdownPhaseReview: BridgePreview['drawdownPhaseReview'];
  drawdownExecutionBoundary: BridgePreview['drawdownExecutionBoundary'];
  drawdownAdapterValidation: BridgePreview['drawdownAdapterValidation'];
  drawdownExecutionGoNoGo: BridgePreview['drawdownExecutionGoNoGo'];
  drawdownExecutionPreflight: BridgePreview['drawdownExecutionPreflight'];
  drawdownAdapterAuditTrail: BridgePreview['drawdownAdapterAuditTrail'];
  drawdownExecutionContainmentGuard: BridgePreview['drawdownExecutionContainmentGuard'];
  drawdownExecutionPhaseCloseout: BridgePreview['drawdownExecutionPhaseCloseout'];
  containedDrawdownPrototype: BridgePreview['containedDrawdownPrototype'];
  containedDrawdownPrototypeSummary: BridgePreview['containedDrawdownPrototypeSummary'];
  containedDrawdownMateriality: BridgePreview['containedDrawdownMateriality'];
  containedDrawdownExplanation: BridgePreview['containedDrawdownExplanation'];
  containedDrawdownLimitations: BridgePreview['containedDrawdownLimitations'];
  containedDrawdownUsefulnessCloseout: BridgePreview['containedDrawdownUsefulnessCloseout'];
  containedDrawdownDetailsDensity: BridgePreview['containedDrawdownDetailsDensity'];
  containedDrawdownReviewChecklist: BridgePreview['containedDrawdownReviewChecklist'];
  containedDrawdownExampleGate: BridgePreview['containedDrawdownExampleGate'];
  containedDrawdownCopyGuard: BridgePreview['containedDrawdownCopyGuard'];
  containedDrawdownProductGoNoGo: BridgePreview['containedDrawdownProductGoNoGo'];
  title: string;
  validation: PlanValidationResult | null;
}) {
  const hasBlockers = Boolean(validation && !validation.canGenerate);
  const overview = selectOverviewMetrics(result);
  const projectionMilestones = selectProjectionMilestones(result);
  const reconciliationDiagnostics = selectReconciliationDiagnostics(result);
  const firstRow = result?.years[0];
  const reconciliation = selectCashFlowReconciliation(firstRow);
  const fundingRows = selectFundingSourceRows(firstRow).filter((row) => Math.round(row.amount) !== 0);
  const annualDetailRows = selectAnnualDetailRows(result);
  const annualDetailSummary = selectAnnualDetailSummary(result);
  const portfolioChartSeries = selectPortfolioChartSeries(result);
  const spendingTaxChartSeries = selectSpendingTaxChartSeries(result);
  const cashFlowRows = selectCashFlowReconciliationRows(result);
  const incomeSourceRows = selectIncomeSourceRows(result);
  const accountSummaryRows = selectAccountSummaryRows(result);
  const accountBalanceSeries = selectAccountBalanceSeries(result);
  const accountBucketChartSeries = selectAccountBucketChartSeries(result);
  const accountDrawdownRows = selectAccountDrawdownReviewRows(result);
  const accountDrawdownStory = selectAccountDrawdownStory(result);
  const taxSummary = selectTaxSummaryMetrics(result);
  const taxDetailRows = selectTaxDetailRows(result);
  const taxReviewRows = selectTaxReviewRows(result);
  const taxStorySummary = selectTaxStorySummary(result);
  const taxPressureRows = selectTaxPressureRows(result);
  const taxPressureExplanation = selectTaxPressureExplanation(result);
  const stressIndicatorRows = selectStressIndicatorRows(result);
  const stressTestRows = selectStressTestRows(result);
  const stressTestSummary = selectStressTestSummary(result);
  const planHealth = selectPlanHealthExplainer(result);
  const sourceStory = selectSourceReconciliationStory(firstRow);
  const decisionChecklist = selectDecisionChecklist(result, plan);
  const decisionDetailRows = selectDecisionDetailRows(result, plan);
  const scenarioComparisonRows = selectScenarioComparisonRows(result, scenarios);
  const scenarioAssumptionRows = selectScenarioAssumptionRows(plan);
  const survivorSummary = selectSurvivorViewSummary(result, plan);
  const survivorComparison = selectSurvivorComparison(result, survivor, plan);
  const survivorStory = selectSurvivorStorySummary(result, survivor, plan);
  const survivorReviewRows = selectSurvivorReviewRows(result, survivor, plan);
  const recommendedPath = selectRecommendedPath(result, scenarios, survivor, plan, validation);
  const retirementAnswer = selectRetirementAnswerSummary(result, plan, validation, survivor);
  const spendingCapacity = selectSpendingCapacitySummary(result, scenarios, plan, retirementAnswer);
  const spendingStressSummary = selectSpendingStressSummary(result, spendingStress, plan);
  const drawdownReadiness = selectDrawdownReadinessSummary(result, plan);
  const estateIntent = selectEstateIntentSummary(result, plan, survivor, retirementAnswer);
  const optimizerBoundaries = selectOptimizerDecisionBoundaries(result, plan, retirementAnswer);
  const optimizerInputReview = selectOptimizerInputReview(optimizerBoundaries);
  const readinessSummary = selectResultsReadinessSummary(recommendedPath, validation);
  const readinessRows = selectResultsReadinessRows(recommendedPath, validation);
  const reconciliationWarning = result && reconciliation.status === 'warning';
  const implementedSections: ResultsWorkspaceSection[] = [
    'overview',
    'annualDetail',
    'cashFlow',
    'incomeSources',
    'accounts',
    'taxes',
    'stressTests',
    'householdResilience',
    'assumptions',
    'details',
    'exportSave'
  ];
  const advancedSections: ResultsWorkspaceSection[] = ['annualDetail', 'cashFlow', 'incomeSources', 'accounts', 'assumptions'];
  const sectionTitle = resultsSectionTitle(activeSection);
  const intro = resultsSectionIntro(activeSection);
  return (
    <section className="results-workspace">
      <div className="results-nav" aria-label="Results workspace sections">
        {resultsWorkspaceMap.map((item) => {
          const implemented = implementedSections.includes(item.id);
          const active = item.id === activeSection || (item.id === 'details' && advancedSections.includes(activeSection));
          return (
            <button
              className={active ? 'active' : ''}
              key={item.id}
              type="button"
              onClick={() => onSection(item.id)}
            >
              <span>{item.label}</span>
              <small>{item.helper || (implemented ? 'Preview' : 'Stable fallback')}</small>
            </button>
          );
        })}
      </div>

      <div className="panel">
        <p className="eyebrow">Results / {sectionTitle}</p>
        <h2>{title}</h2>
        <div className="result-intro">
          <p>{intro.summary}</p>
          <p>{intro.handoff}</p>
        </div>

        {activeSection === 'cashFlow' ? (
          <CashFlowResultsPanel diagnostics={reconciliationDiagnostics} loading={loading} rows={cashFlowRows} />
        ) : activeSection === 'details' ? (
          <DetailsResultsPanel
            decisionChecklist={decisionChecklist}
            decisionDetailRows={decisionDetailRows}
            fundingRows={fundingRows}
            optimizerBoundaries={optimizerBoundaries}
            optimizerInputReview={optimizerInputReview}
            boundedOptimizer={optimizer}
            drawdownReadiness={drawdownReadiness}
            hiddenDrawdownComparison={hiddenDrawdownComparison}
            drawdownPrototypeReadiness={drawdownPrototypeReadiness}
            drawdownVisibleReviewGate={drawdownVisibleReviewGate}
            drawdownReviewPreview={drawdownReviewPreview}
            drawdownPhaseReview={drawdownPhaseReview}
            drawdownExecutionBoundary={drawdownExecutionBoundary}
            drawdownAdapterValidation={drawdownAdapterValidation}
            drawdownExecutionGoNoGo={drawdownExecutionGoNoGo}
            drawdownExecutionPreflight={drawdownExecutionPreflight}
            drawdownAdapterAuditTrail={drawdownAdapterAuditTrail}
            drawdownExecutionContainmentGuard={drawdownExecutionContainmentGuard}
            drawdownExecutionPhaseCloseout={drawdownExecutionPhaseCloseout}
            containedDrawdownPrototype={containedDrawdownPrototype}
            containedDrawdownPrototypeSummary={containedDrawdownPrototypeSummary}
            containedDrawdownMateriality={containedDrawdownMateriality}
            containedDrawdownExplanation={containedDrawdownExplanation}
            containedDrawdownLimitations={containedDrawdownLimitations}
            containedDrawdownUsefulnessCloseout={containedDrawdownUsefulnessCloseout}
            containedDrawdownDetailsDensity={containedDrawdownDetailsDensity}
            containedDrawdownReviewChecklist={containedDrawdownReviewChecklist}
            containedDrawdownExampleGate={containedDrawdownExampleGate}
            containedDrawdownCopyGuard={containedDrawdownCopyGuard}
            containedDrawdownProductGoNoGo={containedDrawdownProductGoNoGo}
            loading={loading}
            onSection={onSection}
            overview={overview}
            planHealth={planHealth}
            projectionMilestones={projectionMilestones}
            reconciliation={reconciliation}
            reconciliationDiagnostics={reconciliationDiagnostics}
            readinessSummary={readinessSummary}
            scenarioAssumptionRows={scenarioAssumptionRows}
            scenarioComparisonRows={scenarioComparisonRows}
            spendingStress={spendingStressSummary}
            sourceStory={sourceStory}
            taxPressureExplanation={taxPressureExplanation}
            taxPressureRows={taxPressureRows}
            validation={validation}
          />
        ) : activeSection === 'annualDetail' ? (
          <AnnualDetailPanel
            loading={loading}
            portfolioSeries={portfolioChartSeries}
            rows={annualDetailRows}
            spendingTaxSeries={spendingTaxChartSeries}
            summary={annualDetailSummary}
          />
        ) : activeSection === 'exportSave' ? (
          <ExportSavePanel onDownload={onDownload} plan={plan} readinessRows={readinessRows} readinessSummary={readinessSummary} validation={validation} />
        ) : activeSection === 'assumptions' ? (
          <AssumptionsResultsPanel plan={plan} />
        ) : activeSection === 'stressTests' ? (
          <StressTestsPanel
            indicatorRows={stressIndicatorRows}
            loading={loading}
            rows={stressTestRows}
            scenarioRows={scenarioComparisonRows}
            summary={stressTestSummary}
            survivorComparison={survivorComparison}
            survivorSummary={survivorSummary}
          />
        ) : activeSection === 'householdResilience' ? (
          <HouseholdResiliencePanel
            comparison={survivorComparison}
            loading={loading}
            rows={survivorReviewRows}
            story={survivorStory}
            summary={survivorSummary}
          />
        ) : activeSection === 'taxes' ? (
          <TaxesResultsPanel detailRows={taxDetailRows} loading={loading} reviewRows={taxReviewRows} story={taxStorySummary} summary={taxSummary} />
        ) : activeSection === 'accounts' ? (
          <AccountsResultsPanel
            balanceRows={accountBalanceSeries}
            chartRows={accountBucketChartSeries}
            drawdownRows={accountDrawdownRows}
            loading={loading}
            story={accountDrawdownStory}
            summaryRows={accountSummaryRows}
          />
        ) : activeSection === 'incomeSources' ? (
          <IncomeSourcesPanel loading={loading} rows={incomeSourceRows} />
        ) : activeSection === 'overview' ? (
          <>
            <RetirementAnswerPanel
              answer={retirementAnswer}
              confidenceLabel={recommendedPath.confidence.label}
              loading={loading}
              planThroughAge={planThroughAgeLabel(plan, retirementAnswer.fundedThroughYear)}
              spendingCapacity={spendingCapacity}
            />
            <SpendingCapacityPanel loading={loading} summary={spendingCapacity} />
            <ReviewTheseFirstPanel
              actions={retirementAnswer.actions}
              loading={loading}
              readinessRows={readinessRows}
            />
            <BoundedOptimizerPanel loading={loading} summary={optimizer} variant="compact" />
            <OverviewHighlightsPanel
              estateIntent={estateIntent}
              loading={loading}
              survivorComparison={survivorComparison}
              survivorSummary={survivorSummary}
              taxStory={taxStorySummary}
            />
            <EstateIntentPanel loading={loading} summary={estateIntent} />
            <ResultsReadinessPanel compact rows={readinessRows} summary={readinessSummary} />
          </>
        ) : (
          <DeferredResultsPanel section={sectionTitle} />
        )}

        {reconciliationWarning ? (
          <div className="validation-panel">
            <strong>Money-in / money-out check</strong>
            <span>
              First-year funding does not reconcile cleanly to after-tax spending. Open the printable report before
              relying on this plan.
            </span>
          </div>
        ) : null}
        {overview.hasShortfall ? (
          <div className="validation-panel">
            <strong>Projection shortfall</strong>
            <span>At least one projection year shows spending that is not fully covered. Review Risks before relying on this plan.</span>
          </div>
        ) : null}
        {validation ? <ValidationPanel validation={validation} /> : null}
        {bridgeError ? <p className="error">{bridgeError}</p> : null}
        <div className="actions">
          <a
            className={`button ${hasBlockers ? 'disabled-link' : ''}`}
            href={hasBlockers ? undefined : printableReportUrlForPlan(extractPlanPayload(plan))}
            aria-disabled={hasBlockers}
          >
            Open printable report
          </a>
          <button className="ghost" type="button" onClick={onDownload}>
            Save editable plan
          </button>
        </div>
      </div>
    </section>
  );
}

function resultsSectionIntro(section: ResultsWorkspaceSection): { summary: string; handoff: string } {
  const stableHandoff = 'Use the detailed report for printable charts, annual tables, and deeper tax or account detail.';
  switch (section) {
    case 'overview':
      return {
        summary:
          'Overview starts with the retirement answer: whether the plan appears supportable, how spending fits, what estate choices may matter, and what to review next.',
        handoff: stableHandoff
      };
    case 'annualDetail':
      return {
        summary: 'Year-by-year detail shows the projection rows behind the retirement answer.',
        handoff: 'Use the detailed report when you want printable charts and complete annual schedules.'
      };
    case 'cashFlow':
      return {
        summary: 'Money Flow checks whether spending can be traced to income, withdrawals, cash funding, other inflows, and tax.',
        handoff: 'Use the detailed report when you need complete money-flow rows.'
      };
    case 'incomeSources':
      return {
        summary:
          'Income groups salary, pensions, benefits, registered withdrawals, flexible withdrawals, cash funding, and other inflows.',
        handoff: 'Use the detailed report for complete income schedules.'
      };
    case 'accounts':
      return {
        summary: 'Accounts shows projected account bucket balances, start/end summaries, and a balance chart.',
        handoff: 'Use the detailed report for complete account schedules, printable rows, and richer chart surfaces.'
      };
    case 'taxes':
      return {
        summary: 'Taxes shows where tax pressure appears and where timing choices may preserve more flexibility.',
        handoff: 'Use the detailed report for full tax schedules and printable rows.'
      };
    case 'stressTests':
      return {
        summary: 'Risks shows what could change the retirement answer: spending, timing, taxes, markets, and survivor impact.',
        handoff: 'Use the detailed report for full stress tables and printable charts.'
      };
    case 'householdResilience':
      return {
        summary: 'Survivor Impact compares the household plan with the survivor preview for two-person plans.',
        handoff: 'Use the detailed report for full survivor schedules and printable detail.'
      };
    case 'details':
      return {
        summary: 'Details keeps the advanced tables and assumptions available without making them the first thing a household has to understand.',
        handoff: 'Use these views when a review action asks for deeper annual, money-flow, income, account, or assumption detail.'
      };
    case 'assumptions':
      return {
        summary: 'Assumptions summarizes the plan settings used for the calculation. Edits still happen in Guided Intake.',
        handoff: stableHandoff
      };
    case 'exportSave':
      return {
        summary: 'Save & print separates the editable plan file from the printable report.',
        handoff: 'Save editable plan keeps your inputs local. Open printable report gives you readable charts and tables.'
      };
    default:
      return {
        summary: 'This Results tab is reserved for future detailed review.',
        handoff: stableHandoff
      };
  }
}

function RetirementAnswerPanel({
  answer,
  confidenceLabel,
  planThroughAge,
  spendingCapacity,
  loading
}: {
  answer: ReturnType<typeof selectRetirementAnswerSummary>;
  confidenceLabel: string;
  planThroughAge: string;
  spendingCapacity: ReturnType<typeof selectSpendingCapacitySummary>;
  loading: boolean;
}) {
  const calmInsight =
    answer.status === 'notReady'
      ? 'The useful next step is to adjust one or two inputs, then compare the plan again.'
      : answer.status === 'tight'
        ? 'This is close enough to deserve careful review, not panic.'
        : answer.status === 'estateHeavy'
          ? 'The opportunity is deciding how much to enjoy, preserve, or give with intention.'
          : answer.status === 'cannotTell'
            ? 'Once the missing inputs are cleared, the answer will become much more useful.'
            : 'The plan looks workable under the current assumptions, with a few checks to keep it honest.';

  return (
    <section className={`retirement-answer-panel retirement-answer-${answer.status}`}>
      <div className="retirement-answer-lede">
        <p className="eyebrow">Can I retire?</p>
        <h3>{loading ? 'Calculating retirement answer' : answer.label}</h3>
        <p>{answer.headline}</p>
        <p>{calmInsight}</p>
      </div>

      <div className="summary-grid">
        <Metric label="Confidence" value={loading ? 'Calculating' : confidenceLabel} />
        <Metric
          label="Plan-through year"
          value={answer.fundedThroughYear ? String(answer.fundedThroughYear) : loading ? 'Calculating' : '-'}
        />
        <Metric label="Plan-through age" value={loading ? 'Calculating' : planThroughAge} />
        <Metric
          label="Annual spending estimate, today's dollars"
          value={
            spendingCapacity.estimatedSustainableAnnualSpending
              ? formatMoney(spendingCapacity.estimatedSustainableAnnualSpending)
              : loading
                ? 'Calculating'
                : '-'
          }
        />
      </div>

      <div className="retirement-answer-grid">
        <section>
          <h4>Spending fit</h4>
          <strong>{answer.spendingHeadline}</strong>
          <p>{answer.spendingDetail}</p>
        </section>
        <section>
          <h4>Estate intent</h4>
          <strong>{answer.estateHeadline}</strong>
          <p>{answer.estateDetail}</p>
        </section>
      </div>
    </section>
  );
}

function SpendingCapacityPanel({
  loading,
  summary
}: {
  loading: boolean;
  summary: ReturnType<typeof selectSpendingCapacitySummary>;
}) {
  return (
    <section className={`spending-capacity-panel spending-capacity-${summary.status}`}>
      <div className="spending-capacity-lede">
        <p className="eyebrow">How much can I spend?</p>
        <h3>{loading ? 'Calculating spending capacity' : summary.label}</h3>
        <p>{summary.headline}</p>
        <p>{summary.detail}</p>
      </div>

      <div className="summary-grid">
        <Metric
          label={`${summary.planningEstimateLabel}, today's dollars`}
          value={
            summary.estimatedSustainableAnnualSpending
              ? formatMoney(summary.estimatedSustainableAnnualSpending)
              : loading
                ? 'Calculating'
                : '-'
          }
        />
        <Metric label="Early retirement spending" value={formatMoney(summary.earlySpending)} />
        <Metric label="Later retirement spending" value={formatMoney(summary.laterSpending)} />
        <Metric label="Late-life spending" value={formatMoney(summary.lateLifeSpending)} />
        <Metric
          label={summary.status === 'needsReduction' ? 'Repair test' : 'Possible extra room'}
          value={
            summary.status === 'needsReduction'
              ? summary.repairEarlySpending
                ? formatMoney(summary.repairEarlySpending)
                : 'Review'
              : summary.estimatedAnnualRoom
                ? formatMoney(summary.estimatedAnnualRoom)
                : '-'
          }
        />
        <Metric label="Projected money left" value={formatMoney(summary.projectedMoneyLeft)} />
        <Metric label="Estate target" value={summary.estateTarget ? formatMoney(summary.estateTarget) : 'Not set'} />
      </div>
      <p className="table-note">{summary.planningEstimateDetail}</p>

      <div className="spending-capacity-grid">
        <section>
          <h4>Estate trade-off</h4>
          <p>{summary.estateTradeoff}</p>
        </section>
        <section>
          <h4>Review next</h4>
          <div>
            {summary.reviewActions.map((action) => (
              <article key={action.id}>
                <strong>{action.label}</strong>
                <span>{action.detail}</span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

function ReviewTheseFirstPanel({
  actions,
  loading,
  readinessRows
}: {
  actions: ReturnType<typeof selectRetirementAnswerSummary>['actions'];
  loading: boolean;
  readinessRows: ReturnType<typeof selectResultsReadinessRows>;
}) {
  const reviewRows = readinessRows
    .filter((row) => row.status !== 'ready')
    .sort((a, b) => {
      const priority = { now: 0, next: 1, later: 2 };
      return priority[a.priority] - priority[b.priority];
    });
  const fallbackRows = actions
    .filter((action) => action.id !== 'report')
    .map((action) => ({
      id: action.id,
      label: action.label,
      detail: action.detail,
      action: `Review in ${resultsSectionTitle(action.detailArea)}.`,
      detailArea: action.detailArea
    }));
  const topRows = [
    ...reviewRows.map((row) => ({
      id: row.id,
      label: row.label,
      detail: row.detail,
      action: row.action,
      detailArea: row.detailArea
    })),
    ...fallbackRows
  ].filter((row, index, all) => all.findIndex((candidate) => candidate.label === row.label) === index).slice(0, 5);

  return (
    <section className="review-first-panel">
      <div>
        <p className="eyebrow">Review these first</p>
        <h3>{loading ? 'Finding the first review items' : 'Start with the few checks that matter most.'}</h3>
        <p>Detailed diagnostics stay in Details and Risks; this list keeps the first review focused.</p>
      </div>
      <div className="review-first-list">
        {topRows.slice(0, 5).map((row, index) => (
          <article key={row.id}>
            <small>{index + 1}</small>
            <div>
              <strong>{row.label}</strong>
              <span>{row.detail}</span>
              <em>{row.action}</em>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function OverviewHighlightsPanel({
  estateIntent,
  loading,
  survivorComparison,
  survivorSummary,
  taxStory
}: {
  estateIntent: ReturnType<typeof selectEstateIntentSummary>;
  loading: boolean;
  survivorComparison: ReturnType<typeof selectSurvivorComparison>;
  survivorSummary: ReturnType<typeof selectSurvivorViewSummary>;
  taxStory: ReturnType<typeof selectTaxStorySummary>;
}) {
  return (
    <section className="overview-highlights-panel">
      <div>
        <p className="eyebrow">Highlights</p>
        <h3>Estate, tax, and survivor items at a glance.</h3>
      </div>
      <div className="overview-highlight-grid">
        <article>
          <strong>Estate</strong>
          <span>{loading ? 'Calculating estate picture.' : estateIntent.headline}</span>
          <em>{estateIntent.estateTarget ? `Goal ${formatMoney(estateIntent.estateTarget)}` : 'No estate goal entered'}</em>
        </article>
        <article>
          <strong>Taxes</strong>
          <span>{loading ? 'Calculating tax picture.' : taxStory.headline}</span>
          <em>{taxStory.peakTaxYear ? `Peak tax year ${taxStory.peakTaxYear}` : 'No peak tax year yet'}</em>
        </article>
        <article>
          <strong>Survivor</strong>
          <span>{survivorSummary.detail}</span>
          <em>
            {survivorComparison.status === 'ready' && survivorComparison.fundedThroughYear
              ? `Survivor funded through ${survivorComparison.fundedThroughYear}`
              : resultsSectionTitle('householdResilience')}
          </em>
        </article>
      </div>
    </section>
  );
}

function EstateIntentPanel({
  loading,
  summary
}: {
  loading: boolean;
  summary: ReturnType<typeof selectEstateIntentSummary>;
}) {
  return (
    <section className={`estate-intent-panel estate-intent-${summary.status}`}>
      <div className="estate-intent-lede">
        <p className="eyebrow">Estate wishes and tax efficiency</p>
        <h3>{loading ? 'Calculating estate picture' : summary.label}</h3>
        <p>{summary.headline}</p>
        <p>{summary.detail}</p>
      </div>

      <div className="summary-grid">
        <Metric label="Projected estate" value={formatMoney(summary.projectedEstate)} />
        <Metric label="Estate goal" value={summary.estateTarget ? formatMoney(summary.estateTarget) : 'Not set'} />
        <Metric label="Estate gap" value={formatSignedMoney(summary.estateGap)} />
        <Metric label="Lifetime tax" value={formatMoney(summary.lifetimeTax)} />
        <Metric label="OAS recovery tax" value={formatMoney(summary.lifetimeOasClawback)} />
        <Metric label="Registered assets at end" value={formatMoney(summary.finalRegisteredAssets)} />
      </div>

      <div className="estate-intent-grid">
        <section>
          <h4>Tax-efficiency read</h4>
          <strong>{summary.taxEfficiencyHeadline}</strong>
          <p>{summary.taxEfficiencyDetail}</p>
        </section>
        <section>
          <h4>Review next</h4>
          <div>
            {summary.reviewActions.map((action) => (
              <article key={action.id}>
                <strong>{action.label}</strong>
                <span>{action.detail}</span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

function DetailsResultsPanel({
  decisionChecklist,
  decisionDetailRows,
  fundingRows,
  loading,
  onSection,
  optimizerBoundaries,
  optimizerInputReview,
  boundedOptimizer,
  drawdownReadiness,
  hiddenDrawdownComparison,
  drawdownPrototypeReadiness,
  drawdownVisibleReviewGate,
  drawdownReviewPreview,
  drawdownPhaseReview,
  drawdownExecutionBoundary,
  drawdownAdapterValidation,
  drawdownExecutionGoNoGo,
  drawdownExecutionPreflight,
  drawdownAdapterAuditTrail,
  drawdownExecutionContainmentGuard,
  drawdownExecutionPhaseCloseout,
  containedDrawdownPrototype,
  containedDrawdownPrototypeSummary,
  containedDrawdownMateriality,
  containedDrawdownExplanation,
  containedDrawdownLimitations,
  containedDrawdownUsefulnessCloseout,
  containedDrawdownDetailsDensity,
  containedDrawdownReviewChecklist,
  containedDrawdownExampleGate,
  containedDrawdownCopyGuard,
  containedDrawdownProductGoNoGo,
  overview,
  planHealth,
  projectionMilestones,
  reconciliation,
  reconciliationDiagnostics,
  readinessSummary,
  scenarioAssumptionRows,
  scenarioComparisonRows,
  spendingStress,
  sourceStory,
  taxPressureExplanation,
  taxPressureRows,
  validation
}: {
  decisionChecklist: ReturnType<typeof selectDecisionChecklist>;
  decisionDetailRows: ReturnType<typeof selectDecisionDetailRows>;
  fundingRows: ReturnType<typeof selectFundingSourceRows>;
  loading: boolean;
  onSection: (section: ResultsWorkspaceSection) => void;
  optimizerBoundaries: ReturnType<typeof selectOptimizerDecisionBoundaries>;
  optimizerInputReview: ReturnType<typeof selectOptimizerInputReview>;
  boundedOptimizer: BoundedOptimizerSummary | null;
  drawdownReadiness: ReturnType<typeof selectDrawdownReadinessSummary>;
  hiddenDrawdownComparison: RealDrawdownComparisonResult | null;
  drawdownPrototypeReadiness: DrawdownPrototypeReadinessReview | null;
  drawdownVisibleReviewGate: DrawdownVisibleReviewGate | null;
  drawdownReviewPreview: DrawdownReviewPreview | null;
  drawdownPhaseReview: DrawdownPhaseReview | null;
  drawdownExecutionBoundary: DrawdownExecutionBoundaryDecision | null;
  drawdownAdapterValidation: DrawdownAdapterValidation | null;
  drawdownExecutionGoNoGo: DrawdownExecutionPrototypeGoNoGo | null;
  drawdownExecutionPreflight: DrawdownExecutionPreflight | null;
  drawdownAdapterAuditTrail: DrawdownAdapterAuditTrail | null;
  drawdownExecutionContainmentGuard: DrawdownExecutionContainmentGuard | null;
  drawdownExecutionPhaseCloseout: DrawdownExecutionPhaseCloseout | null;
  containedDrawdownPrototype: ContainedDrawdownExecutionPrototype | null;
  containedDrawdownPrototypeSummary: ContainedDrawdownPrototypeSummary | null;
  containedDrawdownMateriality: ContainedDrawdownMateriality | null;
  containedDrawdownExplanation: ContainedDrawdownExplanation | null;
  containedDrawdownLimitations: ContainedDrawdownLimitations | null;
  containedDrawdownUsefulnessCloseout: ContainedDrawdownUsefulnessCloseout | null;
  containedDrawdownDetailsDensity: ContainedDrawdownDetailsDensity | null;
  containedDrawdownReviewChecklist: ContainedDrawdownReviewChecklist | null;
  containedDrawdownExampleGate: ContainedDrawdownExampleGate | null;
  containedDrawdownCopyGuard: ContainedDrawdownCopyGuard | null;
  containedDrawdownProductGoNoGo: ContainedDrawdownProductGoNoGo | null;
  overview: ReturnType<typeof selectOverviewMetrics>;
  planHealth: ReturnType<typeof selectPlanHealthExplainer>;
  projectionMilestones: ReturnType<typeof selectProjectionMilestones>;
  reconciliation: ReturnType<typeof selectCashFlowReconciliation>;
  reconciliationDiagnostics: ReturnType<typeof selectReconciliationDiagnostics>;
  readinessSummary: ReturnType<typeof selectResultsReadinessSummary>;
  scenarioAssumptionRows: ReturnType<typeof selectScenarioAssumptionRows>;
  scenarioComparisonRows: ReturnType<typeof selectScenarioComparisonRows>;
  spendingStress: ReturnType<typeof selectSpendingStressSummary>;
  sourceStory: ReturnType<typeof selectSourceReconciliationStory>;
  taxPressureExplanation: ReturnType<typeof selectTaxPressureExplanation>;
  taxPressureRows: ReturnType<typeof selectTaxPressureRows>;
  validation: PlanValidationResult | null;
}) {
  const detailCards: Array<{
    id: ResultsWorkspaceSection;
    title: string;
    eyebrow: string;
    detail: string;
    metric: string;
  }> = [
    {
      id: 'annualDetail',
      title: 'Year-by-year projection',
      eyebrow: 'Annual table',
      detail: 'Inspect spending, tax, withdrawals, shortfalls, and balances for each projection year.',
      metric:
        overview.firstYear && overview.lastYear
          ? `${overview.firstYear}-${overview.lastYear}`
          : loading
            ? 'Calculating'
            : '-'
    },
    {
      id: 'cashFlow',
      title: 'Money-in / money-out check',
      eyebrow: 'Money Flow',
      detail: 'Trace whether spending can be explained by income, withdrawals, cash funding, other inflows, and tax.',
      metric: overview.firstYearFundingGap ? formatSignedMoney(overview.firstYearFundingGap) : '$0'
    },
    {
      id: 'incomeSources',
      title: 'Income sources',
      eyebrow: 'Income',
      detail: 'Review salary, pensions, CPP/OAS, registered withdrawals, flexible withdrawals, and cash funding.',
      metric: formatMoney(overview.firstYearFunding)
    },
    {
      id: 'accounts',
      title: 'Account balances',
      eyebrow: 'Accounts',
      detail: 'Review account buckets, drawdown movement, projected money left, and estate-related balance questions.',
      metric: formatMoney(overview.endPortfolio)
    },
    {
      id: 'assumptions',
      title: 'Plan assumptions',
      eyebrow: 'Inputs',
      detail: 'Review retirement timing, spending phases, return assumptions, survivor year, and local plan settings.',
      metric: validation?.canGenerate === false ? 'Needs input' : 'Ready'
    }
  ];

  return (
    <div className="details-results-panel">
      <section className="result-card details-lede">
        <p className="eyebrow">Advanced detail</p>
        <h3>Keep the answer simple, then open detail when needed.</h3>
        <p>
          The main Results pages are meant to help a household understand retirement readiness, risks, taxes, survivor
          impact, and next actions. These detail views stay available for deeper review without crowding the first
          answer.
        </p>
        <div className="summary-grid">
          <Metric label="Projection" value={overview.firstYear && overview.lastYear ? `${overview.firstYear}-${overview.lastYear}` : loading ? 'Calculating' : '-'} />
          <Metric label="Projected money left" value={formatMoney(overview.endPortfolio)} />
          <Metric label="Save readiness" value={readinessSummary.saveStatus} />
        </div>
      </section>

      <div className="details-card-grid">
        {detailCards.map((card) => (
          <article className="details-card" key={card.id}>
            <p className="eyebrow">{card.eyebrow}</p>
            <h3>{card.title}</h3>
            <p>{card.detail}</p>
            <strong>{card.metric}</strong>
            <button className="ghost" type="button" onClick={() => onSection(card.id)}>
              Open {card.title}
            </button>
          </article>
        ))}
      </div>

      <div className="result-section-label">Planning evidence</div>
      <PlanHealthPanel health={planHealth} loading={loading} />
      <div className="result-section-label">Money Flow</div>
      <SourceStoryPanel story={sourceStory} />
      <FirstYearMoneyFlowPanel fundingRows={fundingRows} loading={loading} reconciliation={reconciliation} />
      <ReconciliationDiagnosticsPanel diagnostics={reconciliationDiagnostics} loading={loading} />
      <div className="result-section-label">Decision Checks</div>
      <DecisionChecklistPanel items={decisionChecklist} />
      <DecisionDetailPanel rows={decisionDetailRows} />
      <ProjectionPathPanel loading={loading} rows={projectionMilestones} />
      <TaxPressurePanel explanation={taxPressureExplanation} loading={loading} rows={taxPressureRows} />
      <div className="result-section-label">Scenario evidence</div>
      <SpendingStressPanel loading={loading} summary={spendingStress} />
      <ScenarioAssumptionsPanel rows={scenarioAssumptionRows} />
      <ScenarioComparisonPanel loading={loading} rows={scenarioComparisonRows} />
      <BoundedOptimizerPanel loading={loading} summary={boundedOptimizer} />
      <DrawdownReadinessPanel loading={loading} summary={drawdownReadiness} />
      <HiddenDrawdownComparisonPanel comparison={hiddenDrawdownComparison} loading={loading} />
      <DrawdownPrototypeReadinessPanel loading={loading} review={drawdownPrototypeReadiness} />
      <DrawdownReviewPreviewPanel gate={drawdownVisibleReviewGate} loading={loading} phase={drawdownPhaseReview} preview={drawdownReviewPreview} />
      <DrawdownExecutionBoundaryPanel
        adapterValidation={drawdownAdapterValidation}
        auditTrail={drawdownAdapterAuditTrail}
        boundary={drawdownExecutionBoundary}
        containmentGuard={drawdownExecutionContainmentGuard}
        phaseCloseout={drawdownExecutionPhaseCloseout}
        preflight={drawdownExecutionPreflight}
        containedPrototype={containedDrawdownPrototype}
        containedPrototypeSummary={containedDrawdownPrototypeSummary}
        containedMateriality={containedDrawdownMateriality}
        containedExplanation={containedDrawdownExplanation}
        containedLimitations={containedDrawdownLimitations}
        containedUsefulnessCloseout={containedDrawdownUsefulnessCloseout}
        containedDetailsDensity={containedDrawdownDetailsDensity}
        containedReviewChecklist={containedDrawdownReviewChecklist}
        containedExampleGate={containedDrawdownExampleGate}
        containedCopyGuard={containedDrawdownCopyGuard}
        containedProductGoNoGo={containedDrawdownProductGoNoGo}
        goNoGo={drawdownExecutionGoNoGo}
        loading={loading}
      />
      <OptimizerBoundaryPanel loading={loading} summary={optimizerBoundaries} />
      <OptimizerInputReviewPanel summary={optimizerInputReview} />
    </div>
  );
}

function FirstYearMoneyFlowPanel({
  fundingRows,
  loading,
  reconciliation
}: {
  fundingRows: ReturnType<typeof selectFundingSourceRows>;
  loading: boolean;
  reconciliation: ReturnType<typeof selectCashFlowReconciliation>;
}) {
  return (
    <div className="result-overview-grid">
      <section className="result-card">
        <h3>First-year money flow</h3>
        <dl className="result-ledger">
          <div>
            <dt>After-tax spending</dt>
            <dd>{formatMoney(reconciliation.afterTaxSpending)}</dd>
          </div>
          <div>
            <dt>Funding minus tax</dt>
            <dd>{formatMoney(reconciliation.reconciledAfterTaxSpending)}</dd>
          </div>
          <div>
            <dt>One-off outflows</dt>
            <dd>{formatMoney(reconciliation.oneOffOutflows)}</dd>
          </div>
          <div>
            <dt>Reconciliation gap</dt>
            <dd className={Math.abs(reconciliation.reconciliationDelta) > 1 ? 'bad-value' : 'ok-value'}>
              {formatSignedMoney(reconciliation.reconciliationDelta)}
            </dd>
          </div>
          <div>
            <dt>Unexplained gap</dt>
            <dd className={Math.abs(reconciliation.cashFlowDelta) > 1 ? 'bad-value' : 'ok-value'}>
              {formatSignedMoney(reconciliation.cashFlowDelta)}
            </dd>
          </div>
        </dl>
      </section>

      <section className="result-card">
        <h3>Funding sources</h3>
        <dl className="result-ledger">
          {fundingRows.length > 0 ? (
            fundingRows.map((row) => (
              <div key={row.id}>
                <dt>{row.label}</dt>
                <dd>{formatMoney(row.amount)}</dd>
              </div>
            ))
          ) : (
            <div>
              <dt>Preview</dt>
              <dd>{loading ? 'Calculating' : '-'}</dd>
            </div>
          )}
          <div>
            <dt>Tax</dt>
            <dd>-{formatMoney(reconciliation.tax)}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

function RecommendedPathPanel({
  loading,
  summary
}: {
  loading: boolean;
  summary: ReturnType<typeof selectRecommendedPath>;
}) {
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(summary.defaultRiskDetailId);
  const activeRiskId =
    summary.riskDetails.some((detail) => detail.id === selectedRiskId) ? selectedRiskId : summary.defaultRiskDetailId;
  const selectedRiskDetail = summary.riskDetails.find((detail) => detail.id === activeRiskId) || summary.riskDetails[0];

  return (
    <section className={`recommended-path-panel ${summary.recommendedCandidateId ? '' : 'watch-card'}`}>
      <div>
        <p className="eyebrow">Suggested plan to review</p>
        <h3>{loading ? 'Calculating plan choices' : summary.recommendedLabel}</h3>
        <p>{summary.headline}</p>
      </div>

      <div className={`confidence-strip confidence-${summary.confidence.level}`}>
        <div>
          <span>Confidence</span>
          <strong>{loading ? 'Calculating' : summary.confidence.label}</strong>
        </div>
        <p>{summary.confidence.detail}</p>
      </div>

      <div className="stress-context-panel">
        <div>
          <p className="eyebrow">What this choice is tested against</p>
          <h3>{summary.stressContext.candidateLabel}</h3>
          <p>{summary.stressContext.summary}</p>
        </div>
        <div className="summary-grid">
          <Metric
            label="Funded years"
            value={`${summary.stressContext.fundedYears}/${summary.stressContext.totalYears || 0}`}
          />
          <Metric label="First shortfall" value={summary.stressContext.firstShortfallYear ? String(summary.stressContext.firstShortfallYear) : 'None'} />
          <Metric label="Lowest portfolio" value={`${summary.stressContext.lowestPortfolioYear || '-'}: ${formatMoney(summary.stressContext.lowestPortfolio)}`} />
          <Metric label="Tax pressure years" value={String(summary.stressContext.taxPressureCount)} />
        </div>
      </div>

      <div className="summary-grid">
        {summary.trustChecks.map((check) => (
          <Metric key={check.id} label={check.label} value={`${check.status}: ${check.detail}`} />
        ))}
      </div>

      <div className="result-overview-grid">
        <section className="result-card">
          <h3>Why this path</h3>
          <ul className="compact-list">
            {summary.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </section>
        <section className="result-card">
          <h3>Tradeoffs to review</h3>
          <ul className="compact-list">
            {summary.tradeoffs.map((tradeoff) => (
              <li key={tradeoff}>{tradeoff}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="result-card break-plan-panel">
        <h3>What could change this answer?</h3>
        <div className="break-risk-layout">
          <div className="break-risk-list" role="list">
            {summary.breakRisks.map((risk) => (
              <button
                className={`break-risk break-risk-${risk.severity} ${risk.id === activeRiskId ? 'selected' : ''}`}
                key={risk.id}
                type="button"
                onClick={() => setSelectedRiskId(risk.id)}
              >
                <div>
                  <strong>{risk.label}</strong>
                  <span>{risk.detail}</span>
                </div>
                <small>{risk.handoff}</small>
              </button>
            ))}
          </div>
          {selectedRiskDetail ? <RiskDetailPanel detail={selectedRiskDetail} /> : null}
        </div>
      </section>

      <RecommendedChecklistPanel items={summary.checklistItems} />

      <div className="result-table-wrap">
        <table className="result-table">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Status</th>
              <th>Funded through</th>
              <th>First shortfall</th>
              <th>End portfolio delta</th>
              <th>Lifetime tax delta</th>
              <th>Spending funded</th>
            </tr>
          </thead>
          <tbody>
            {summary.candidateRows.map((row) => (
              <tr className={row.blocked ? 'warning-row' : row.recommended ? 'selected-row' : ''} key={row.id}>
                <td>{row.label}</td>
                <td>{row.reviewStatus}</td>
                <td>{row.fundedThroughYear || '-'}</td>
                <td>{row.firstShortfallYear || '-'}</td>
                <td className={row.endPortfolioDelta >= 0 ? 'ok-value' : 'bad-value'}>
                  {formatSignedMoney(row.endPortfolioDelta)}
                </td>
                <td className={row.lifetimeTaxDelta <= 0 ? 'ok-value' : 'bad-value'}>
                  {formatSignedMoney(row.lifetimeTaxDelta)}
                </td>
                <td>{row.spendingFundedYears}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="why-not-list">
        <h3>Why not the others</h3>
        {summary.whyNotRows.map((row) => (
          <div key={row.id}>
            <strong>{row.label}</strong>
            <span>{row.reason}</span>
          </div>
        ))}
      </div>
      <p className="table-note">
        This is a first-pass planning comparison, not financial advice or a full optimizer. Open the printable report for
        complete annual detail before acting on a path.
      </p>
    </section>
  );
}

function BoundedOptimizerPanel({
  loading,
  summary,
  variant = 'full'
}: {
  loading: boolean;
  summary: BoundedOptimizerSummary | null;
  variant?: 'compact' | 'full';
}) {
  const suggested = summary?.candidates.find((candidate) => candidate.id === summary.suggestedCandidateId) || null;
  const topRows = summary?.candidates.slice().sort((a, b) => b.score - a.score).slice(0, variant === 'compact' ? 3 : summary.candidates.length) || [];
  const isCompact = variant === 'compact';

  return (
    <section className={`result-card bounded-optimizer-panel optimizer-${summary?.status || 'loading'}`}>
      <div>
        <p className="eyebrow">Plan options to review</p>
        <h3>{loading ? 'Checking plan options' : summary?.suggestedLabel || 'Plan options need inputs'}</h3>
        <p>
          {loading
            ? 'Running a limited set of planning checks.'
            : summary?.headline || 'Clear required inputs before plan options can be compared.'}
        </p>
      </div>

      <div className="summary-grid">
        <Metric label="Options checked" value={loading ? 'Calculating' : String(summary?.candidateCount || 0)} />
        <Metric label="Funded years" value={suggested ? `${suggested.fundedYears}/${suggested.totalYears}` : '-'} />
        <Metric label="First shortfall" value={suggested?.firstShortfallYear ? String(suggested.firstShortfallYear) : suggested ? 'None' : '-'} />
        <Metric label="Projected money left" value={suggested ? formatMoney(suggested.endPortfolio) : '-'} />
      </div>

      <ul className="compact-list">
        {(summary?.reviewNotes || ['This is a planning review only. It does not change your saved plan.']).slice(0, 3).map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>

      {summary?.eligibilityNotes.length ? (
        <div className="optimizer-eligibility-list">
          {(isCompact ? summary.eligibilityNotes.filter((note) => note.status !== 'eligible').slice(0, 3) : summary.eligibilityNotes).map((note) => (
            <div className={`optimizer-eligibility-note eligibility-${note.status}`} key={`${note.lever}-${note.status}`}>
              <strong>{optimizerLeverLabel(note.lever)}</strong>
              <span>{note.status === 'eligible' ? 'Included' : note.status === 'skipped' ? 'Skipped' : 'Review first'}</span>
              <p>{note.reason}</p>
            </div>
          ))}
        </div>
      ) : null}

      {summary?.explanation ? (
        <div className="result-overview-grid">
          <section className="optimizer-explanation-card">
            <h3>Why this option</h3>
            <p>{summary.explanation.plainLanguageSummary}</p>
            <ul className="compact-list">
              {summary.explanation.whyThisOption.slice(0, isCompact ? 2 : 4).map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </section>
          {!isCompact ? (
            <>
              <section className="optimizer-explanation-card">
                <h3>Trade-offs</h3>
                <ul className="compact-list">
                  {summary.explanation.tradeoffs.map((tradeoff) => (
                    <li key={tradeoff}>{tradeoff}</li>
                  ))}
                </ul>
              </section>
              <section className="optimizer-explanation-card">
                <h3>Check before using</h3>
                <ul className="compact-list">
                  {summary.explanation.verifyBeforeUsing.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            </>
          ) : null}
        </div>
      ) : null}

      {!isCompact && summary?.optionGroups.length ? (
        <section className="optimizer-option-group-panel">
          <div>
            <p className="eyebrow">Option map</p>
            <h3>What kind of choices were checked</h3>
            <p>Groups help separate lifestyle choices, timing choices, tax checks, drawdown review, and home or estate assumptions.</p>
          </div>
          <div className="optimizer-option-group-grid">
            {summary.optionGroups.map((group) => (
              <article className="optimizer-option-group-row" key={group.id}>
                <span>{group.candidateIds.length} option{group.candidateIds.length === 1 ? '' : 's'}</span>
                <strong>{group.label}</strong>
                <p>{group.summary}</p>
                <small>
                  {group.canHighlightCount} can be first / {group.reviewOnlyCount} review-only
                </small>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {!isCompact && summary?.guardrailNotes.length ? (
        <section className="optimizer-guardrail-panel">
          <div>
            <p className="eyebrow">Why options were tested</p>
            <h3>Guardrails before recommendations</h3>
            <p>These checks keep the review inside the timing and tax rules the model can support today.</p>
          </div>
          <div className="optimizer-guardrail-grid">
            {summary.guardrailNotes.map((note) => (
              <article className={`optimizer-guardrail-row guardrail-${note.status}`} key={note.id}>
                <span>{note.status === 'tested' ? 'Tested' : note.status === 'reviewFirst' ? 'Review first' : 'Not tested'}</span>
                <strong>{note.label}</strong>
                <p>{note.reason}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {!isCompact && summary?.recommendationNotes.length ? (
        <section className="optimizer-recommendation-panel">
          <div>
            <p className="eyebrow">Suggestion discipline</p>
            <h3>Why some options stay review-only</h3>
            <p>First option to review means it cleared the highlight checks. Review-only means the result is useful evidence, but it should not lead the plan.</p>
          </div>
          <div className="optimizer-recommendation-list">
            {summary.recommendationNotes.map((note) => (
              <article className={`optimizer-recommendation-row recommendation-${note.status}`} key={note.candidateId}>
                <span>{note.status === 'canHighlight' ? 'Can be first' : 'Review-only'}</span>
                <strong>{note.label}</strong>
                <p>{note.reason}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {!isCompact && summary?.driverRows.length ? (
        <section className="optimizer-driver-panel">
          <div>
            <p className="eyebrow">Tax and funding drivers</p>
            <h3>Why the option moved</h3>
            <p>These rows compare the selected plan option with the current plan. They explain direction, not a final recommendation.</p>
          </div>
          <div className="optimizer-driver-grid">
            {summary.driverRows.map((row) => (
              <article className={`optimizer-driver-row driver-${row.tone}`} key={row.id}>
                <span>{row.label}</span>
                <strong>{row.value}</strong>
                <p>{row.detail}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {!isCompact && summary?.evidenceRows.length ? (
        <section className="optimizer-evidence-panel">
          <div>
            <p className="eyebrow">Option evidence</p>
            <h3>What changed in this test</h3>
            <p>These rows compare income-sharing or home-sale reliance checks with the current plan. Confirm eligibility before relying on them.</p>
          </div>
          <div className="optimizer-evidence-grid">
            {summary.evidenceRows.map((row) => (
              <article className={`optimizer-evidence-row evidence-${row.tone}`} key={row.id}>
                <span>{row.label}</span>
                <strong>{row.value}</strong>
                <p>{row.detail}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {!isCompact && topRows.length ? (
        <div className="result-table-wrap">
          <table className="result-table">
            <thead>
              <tr>
                <th>Option</th>
                <th>Status</th>
                <th>Change tested</th>
                <th>Funded years</th>
                <th>First shortfall</th>
                <th>Projected money left</th>
                <th>Lifetime tax change</th>
              </tr>
            </thead>
            <tbody>
              {topRows.map((row) => (
                <tr className={row.status === 'blocked' ? 'warning-row' : row.status === 'suggested' ? 'selected-row' : ''} key={row.id}>
                  <td>{row.label}</td>
                  <td>{row.status === 'suggested' ? 'review first' : row.status}</td>
                  <td>{row.changeSummary}</td>
                  <td>{`${row.fundedYears}/${row.totalYears}`}</td>
                  <td>{row.firstShortfallYear || 'None'}</td>
                  <td>{formatMoney(row.endPortfolio)}</td>
                  <td className={row.lifetimeTaxDelta <= 0 ? 'ok-value' : 'bad-value'}>{formatSignedMoney(row.lifetimeTaxDelta)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <p className="table-note">
        This limited check does not provide financial advice, does not optimize year-by-year tax brackets, and does not
        save optimizer results.
      </p>
    </section>
  );
}

function SpendingStressPanel({
  loading,
  summary
}: {
  loading: boolean;
  summary: ReturnType<typeof selectSpendingStressSummary>;
}) {
  return (
    <section className={`result-card spending-stress-panel spending-stress-${summary.status}`}>
      <div>
        <p className="eyebrow">Spending stress check</p>
        <h3>{loading ? 'Checking nearby spending levels' : summary.label}</h3>
        <p>{summary.headline}</p>
        <p>{summary.detail}</p>
      </div>
      {summary.rows.length ? (
        <div className="result-table-wrap">
          <table className="result-table">
            <thead>
              <tr>
                <th>Spending level</th>
                <th>Early spending</th>
                <th>Funded years</th>
                <th>First shortfall</th>
                <th>Projected money left</th>
                <th>Lifetime tax change</th>
                <th>Read</th>
              </tr>
            </thead>
            <tbody>
              {summary.rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.label}</td>
                  <td>{formatMoney(row.earlySpending)}</td>
                  <td>{`${row.fundedYears}/${row.totalYears}`}</td>
                  <td>{row.firstShortfallYear || 'None'}</td>
                  <td>{formatMoney(row.endPortfolio)}</td>
                  <td className={row.lifetimeTaxDelta <= 0 ? 'ok-value' : 'bad-value'}>{formatSignedMoney(row.lifetimeTaxDelta)}</td>
                  <td>{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      <p className="table-note">{summary.reviewNote}</p>
    </section>
  );
}

function DrawdownReadinessPanel({
  loading,
  summary
}: {
  loading: boolean;
  summary: ReturnType<typeof selectDrawdownReadinessSummary>;
}) {
  return (
    <section className={`result-card optimizer-evidence-panel drawdown-readiness-panel drawdown-readiness-${summary.status}`}>
      <div>
        <p className="eyebrow">Drawdown readiness</p>
        <h3>{loading ? 'Checking drawdown evidence' : summary.headline}</h3>
        <p>{summary.detail}</p>
      </div>
      {summary.rows.length ? (
        <div className="optimizer-evidence-grid">
          {summary.rows.map((row) => (
            <article className={`optimizer-evidence-row evidence-${row.tone}`} key={row.id}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
              <p>{row.detail}</p>
              <p>{row.reviewFocus}</p>
            </article>
          ))}
        </div>
      ) : null}
      {summary.prototypeRows.length ? (
        <section className="drawdown-prototype-panel">
          <div>
            <p className="eyebrow">Tax-aware prototype evidence</p>
            <h3>Review windows for later</h3>
            <p>These rows show where a future year-by-year drawdown review would look. They do not create instructions.</p>
          </div>
          <div className="optimizer-evidence-grid">
            {summary.prototypeRows.map((row) => (
              <article className={`optimizer-evidence-row evidence-${row.tone}`} key={row.id}>
                <span>{row.label}</span>
                <strong>{row.value}</strong>
                <p>{row.evidence}</p>
                <p>{row.futureQuestion}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
      {summary.drawdownOverrideDrafts.rows.length || summary.drawdownOverrideDrafts.readinessRows.length ? (
        <section className={`drawdown-prototype-panel drawdown-draft-panel draft-${summary.drawdownOverrideDrafts.status}`}>
          <div>
            <p className="eyebrow">Future drawdown draft checks</p>
            <h3>{summary.drawdownOverrideDrafts.headline}</h3>
            <p>{summary.drawdownOverrideDrafts.detail}</p>
            <p>They are not run as part of the calculation and do not change this plan.</p>
          </div>
          {summary.drawdownOverrideDrafts.rows.length ? (
            <div className="optimizer-evidence-grid">
              {summary.drawdownOverrideDrafts.rows.map((row) => (
                <article className={`optimizer-evidence-row draft-status-${row.status}`} key={row.id}>
                  <span>{row.label}</span>
                  <strong>
                    {row.status === 'usableForFutureReview'
                      ? 'Future review'
                      : row.status === 'needsInput'
                        ? 'Needs input'
                        : 'Blocked'}
                  </strong>
                  <p>
                    {row.year ? `${row.year} / ${row.accountBucket} / ${row.amountBand}` : `${row.accountBucket} / ${row.amountBand}`}
                  </p>
                  <p>{row.detail}</p>
                  <p>{row.safetyNotes.join(' ')}</p>
                </article>
              ))}
            </div>
          ) : null}
          {summary.drawdownOverrideDrafts.readinessRows.length ? (
            <div className="drawdown-readiness-checks" aria-label="Future drawdown testing readiness">
              <h4>Is this plan ready for future tax-aware drawdown testing?</h4>
              <div className="optimizer-eligibility-list">
                {summary.drawdownOverrideDrafts.readinessRows.map((row) => (
                  <article className={`optimizer-eligibility-note eligibility-${row.status}`} key={row.id}>
                    <strong>{row.label}</strong>
                    <span>{row.status === 'ready' ? 'Ready' : row.status === 'review' ? 'Review' : row.status === 'needsInput' ? 'Needs input' : 'Blocked'}</span>
                    <p>{row.detail}</p>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
          {summary.drawdownOverrideDrafts.comparisonReadiness.rows.length ? (
            <div className={`drawdown-comparison-readiness readiness-${summary.drawdownOverrideDrafts.comparisonReadiness.status}`}>
              <div>
                <p className="eyebrow">Future comparison readiness</p>
                <h4>{summary.drawdownOverrideDrafts.comparisonReadiness.headline}</h4>
                <p>{summary.drawdownOverrideDrafts.comparisonReadiness.detail}</p>
                <p>This does not run a comparison or change this plan.</p>
              </div>
              <div className="optimizer-eligibility-list">
                {summary.drawdownOverrideDrafts.comparisonReadiness.rows.map((row) => (
                  <article className={`optimizer-eligibility-note eligibility-${row.status}`} key={row.id}>
                    <strong>{row.label}</strong>
                    <span>{row.status === 'ready' ? 'Ready' : row.status === 'review' ? 'Review' : row.status === 'needsInput' ? 'Needs input' : 'Blocked'}</span>
                    <p>{row.detail}</p>
                  </article>
                ))}
              </div>
              <p className="table-note">{summary.drawdownOverrideDrafts.comparisonReadiness.reviewNote}</p>
            </div>
          ) : null}
          {summary.drawdownOverrideDrafts.sandbox.rows.length ? (
            <div className={`drawdown-sandbox-panel sandbox-${summary.drawdownOverrideDrafts.sandbox.status}`}>
              <div>
                <p className="eyebrow">Future sandbox gate</p>
                <h4>{summary.drawdownOverrideDrafts.sandbox.headline}</h4>
                <p>{summary.drawdownOverrideDrafts.sandbox.detail}</p>
              </div>
              {summary.drawdownOverrideDrafts.sandbox.rows.map((row) => (
                <article className={`optimizer-evidence-row sandbox-row-${row.status}`} key={row.id}>
                  <span>{row.label}</span>
                  <strong>
                    {row.status === 'queuedForFutureReview'
                      ? 'Hold for later comparison'
                      : row.status === 'heldForInput'
                        ? 'Confirm inputs first'
                        : 'Blocked'}
                  </strong>
                  <p>{row.baselineSignal}</p>
                  <p>{row.compareWouldNeed}</p>
                  <p>{row.holdReason}</p>
                </article>
              ))}
              <p className="table-note">{summary.drawdownOverrideDrafts.sandbox.reviewNote}</p>
            </div>
          ) : null}
          <p className="table-note">{summary.drawdownOverrideDrafts.reviewNote}</p>
        </section>
      ) : null}
      <p className="table-note">
        This does not change withdrawal order or create detailed annual account instructions. It does not change the current withdrawal order used in Results.
      </p>
      <p className="table-note">{summary.reviewNote}</p>
    </section>
  );
}

function HiddenDrawdownComparisonPanel({
  comparison,
  loading
}: {
  comparison: RealDrawdownComparisonResult | null;
  loading: boolean;
}) {
  const hasEvidence = comparison?.status === 'reviewOnly' && comparison.evidenceRows.length > 0;
  return (
    <section className={`result-card optimizer-evidence-panel hidden-drawdown-panel hidden-drawdown-${comparison?.status || 'notReady'}`}>
      <div>
        <p className="eyebrow">Drawdown comparison evidence</p>
        <h3>{loading ? 'Checking drawdown comparison' : hasEvidence ? 'A hidden drawdown comparison has review evidence.' : 'No drawdown comparison evidence is ready yet.'}</h3>
        <p>
          This is a small review check from the current plan. It is not a recommendation and does not change your plan, create account instructions, or save comparison output.
        </p>
      </div>
      {hasEvidence ? (
        <div className="optimizer-evidence-grid">
          {comparison.evidenceRows.map((row) => (
            <article className="optimizer-evidence-row evidence-review" key={row.id}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
              <p>{row.detail}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className="table-note">{comparison?.reason || 'A comparison will appear here only after readiness checks are available.'}</p>
      )}
      {comparison?.decisionGate.rows.length ? (
        <div className={`drawdown-decision-gate gate-${comparison.decisionGate.status}`}>
          <div>
            <p className="eyebrow">Review gate</p>
            <h4>{comparison.decisionGate.headline}</h4>
            <p>{comparison.decisionGate.summary}</p>
            <p>{comparison.decisionGate.detail}</p>
          </div>
          <div className="optimizer-eligibility-list">
            {comparison.decisionGate.rows.map((row) => (
              <article className={`optimizer-eligibility-note eligibility-${row.status}`} key={row.id}>
                <strong>{row.label}</strong>
                <span>{row.status === 'ok' ? 'OK' : row.status === 'review' ? 'Review' : 'Blocked'}</span>
                <p>{row.detail}</p>
              </article>
            ))}
          </div>
          <p className="table-note">{comparison.decisionGate.nextStep}</p>
          <p className="table-note">{comparison.decisionGate.reviewNote}</p>
        </div>
      ) : null}
      <p className="table-note">
        {comparison?.reviewNote ||
          'Drawdown comparison evidence is review-only. It does not change withdrawal order, create annual overrides, or save optimizer output.'}
      </p>
    </section>
  );
}

function DrawdownPrototypeReadinessPanel({
  loading,
  review
}: {
  loading: boolean;
  review: DrawdownPrototypeReadinessReview | null;
}) {
  return (
    <section className={`result-card optimizer-evidence-panel drawdown-prototype-readiness readiness-${review?.status || 'notReady'}`}>
      <div>
        <p className="eyebrow">Future drawdown prototype readiness</p>
        <h3>{loading ? 'Checking prototype readiness' : review?.headline || 'Drawdown prototype is not ready yet.'}</h3>
        <p>
          This stays in Details as a readiness review. It does not create account instructions, change withdrawal order, run annual overrides in the product, or save output.
        </p>
      </div>
      {review?.rows.length ? (
        <div className="optimizer-eligibility-list">
          {review.rows.map((row) => (
            <article className={`optimizer-eligibility-note eligibility-${row.status === 'ready' ? 'ok' : row.status}`} key={row.id}>
              <strong>{row.label}</strong>
              <span>{row.status === 'ready' ? 'Ready' : row.status === 'review' ? 'Review' : 'Blocked'}</span>
              <p>{row.detail}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className="table-note">Prototype readiness appears after the drawdown comparison checks run.</p>
      )}
      <p className="table-note">{review?.reviewNote || 'Readiness review only. Nothing changes in the current plan.'}</p>
    </section>
  );
}

function DrawdownReviewPreviewPanel({
  gate,
  loading,
  phase,
  preview
}: {
  gate: DrawdownVisibleReviewGate | null;
  loading: boolean;
  phase: DrawdownPhaseReview | null;
  preview: DrawdownReviewPreview | null;
}) {
  return (
    <section className={`result-card optimizer-evidence-panel drawdown-review-preview preview-${preview?.status || 'heldBack'}`}>
      <div>
        <p className="eyebrow">Drawdown review preview</p>
        <h3>{loading ? 'Checking drawdown review preview' : preview?.headline || 'Drawdown review preview is held back.'}</h3>
        <p>
          This is a high-level Details preview only. It does not tell you which account to withdraw from, change withdrawal order, run annual overrides in the product, or save output.
        </p>
      </div>
      {preview?.rows.length ? (
        <div className="optimizer-evidence-grid">
          {preview.rows.map((row) => (
            <article className="optimizer-evidence-row evidence-review" key={row.id}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
              <p>{row.detail}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className="table-note">{preview?.detail || 'The preview appears only after final guardrails are clear.'}</p>
      )}
      {gate?.rows.length ? (
        <div className={`drawdown-decision-gate gate-${gate.status}`}>
          <div>
            <p className="eyebrow">Final preview gate</p>
            <h4>{gate.headline}</h4>
            <p>{gate.detail}</p>
          </div>
          <div className="optimizer-eligibility-list">
            {gate.rows.map((row) => (
              <article className={`optimizer-eligibility-note eligibility-${row.status}`} key={row.id}>
                <strong>{row.label}</strong>
                <span>{row.status === 'ok' ? 'OK' : row.status === 'review' ? 'Review' : 'Blocked'}</span>
                <p>{row.detail}</p>
              </article>
            ))}
          </div>
          <p className="table-note">{gate.reviewNote}</p>
        </div>
      ) : null}
      {phase?.rows.length ? (
        <div className={`drawdown-decision-gate phase-${phase.status}`}>
          <div>
            <p className="eyebrow">Drawdown phase review</p>
            <h4>{phase.headline}</h4>
            <p>{phase.detail}</p>
          </div>
          <div className="optimizer-eligibility-list">
            {phase.rows.map((row) => (
              <article className={`optimizer-eligibility-note eligibility-${row.status === 'ready' ? 'ok' : row.status === 'hold' ? 'review' : 'blocked'}`} key={row.id}>
                <strong>{row.label}</strong>
                <span>{row.status === 'ready' ? 'Ready' : row.status === 'hold' ? 'Hold' : 'Blocked'}</span>
                <p>{row.detail}</p>
              </article>
            ))}
          </div>
          <p className="table-note">{phase.reviewNote}</p>
        </div>
      ) : null}
      <p className="table-note">{preview?.reviewNote || 'Review preview only. Nothing changes in the current plan.'}</p>
    </section>
  );
}

function DrawdownExecutionBoundaryPanel({
  adapterValidation,
  auditTrail,
  boundary,
  containedExplanation,
  containedExampleGate,
  containedCopyGuard,
  containedDetailsDensity,
  containedLimitations,
  containedMateriality,
  containedProductGoNoGo,
  containedPrototype,
  containedPrototypeSummary,
  containedReviewChecklist,
  containedUsefulnessCloseout,
  containmentGuard,
  phaseCloseout,
  preflight,
  goNoGo,
  loading
}: {
  adapterValidation: DrawdownAdapterValidation | null;
  auditTrail: DrawdownAdapterAuditTrail | null;
  boundary: DrawdownExecutionBoundaryDecision | null;
  containedCopyGuard: ContainedDrawdownCopyGuard | null;
  containedDetailsDensity: ContainedDrawdownDetailsDensity | null;
  containedExampleGate: ContainedDrawdownExampleGate | null;
  containedExplanation: ContainedDrawdownExplanation | null;
  containedLimitations: ContainedDrawdownLimitations | null;
  containedMateriality: ContainedDrawdownMateriality | null;
  containedProductGoNoGo: ContainedDrawdownProductGoNoGo | null;
  containedPrototype: ContainedDrawdownExecutionPrototype | null;
  containedPrototypeSummary: ContainedDrawdownPrototypeSummary | null;
  containedReviewChecklist: ContainedDrawdownReviewChecklist | null;
  containedUsefulnessCloseout: ContainedDrawdownUsefulnessCloseout | null;
  containmentGuard: DrawdownExecutionContainmentGuard | null;
  phaseCloseout: DrawdownExecutionPhaseCloseout | null;
  preflight: DrawdownExecutionPreflight | null;
  goNoGo: DrawdownExecutionPrototypeGoNoGo | null;
  loading: boolean;
}) {
  return (
    <section className={`result-card optimizer-evidence-panel drawdown-execution-boundary boundary-${goNoGo?.status || 'holdForAdapterGuardrails'}`}>
      <div>
        <p className="eyebrow">Execution boundary checkpoint</p>
        <h3>{loading ? 'Checking execution boundary' : goNoGo?.headline || boundary?.headline || 'Hold before execution.'}</h3>
        <p>
          This checkpoint decides whether to keep the preview as-is, harden more guardrails, or prepare one future prototype. It does not run annual overrides, change withdrawal order, create account instructions, or save output.
        </p>
      </div>
      {boundary?.rows.length ? (
        <div className="drawdown-decision-gate">
          <div>
            <p className="eyebrow">Boundary decision</p>
            <h4>{boundary.headline}</h4>
            <p>{boundary.detail}</p>
          </div>
          <div className="optimizer-eligibility-list">
            {boundary.rows.map((row) => (
              <article className={`optimizer-eligibility-note eligibility-${row.status === 'ready' ? 'ok' : row.status === 'hold' ? 'review' : 'blocked'}`} key={row.id}>
                <strong>{row.label}</strong>
                <span>{row.status === 'ready' ? 'Ready' : row.status === 'hold' ? 'Hold' : 'Blocked'}</span>
                <p>{row.detail}</p>
              </article>
            ))}
          </div>
          <p className="table-note">{boundary.reviewNote}</p>
        </div>
      ) : null}
      {adapterValidation?.rows.length ? (
        <div className="drawdown-decision-gate">
          <div>
            <p className="eyebrow">Adapter validation</p>
            <h4>{adapterValidation.reason}</h4>
            <p>The adapter shape is only a draft check and is not used by the product calculation.</p>
          </div>
          <div className="optimizer-eligibility-list">
            {adapterValidation.rows.map((row) => (
              <article className={`optimizer-eligibility-note eligibility-${row.status === 'ok' ? 'ok' : 'blocked'}`} key={row.id}>
                <strong>{row.label}</strong>
                <span>{row.status === 'ok' ? 'OK' : 'Blocked'}</span>
                <p>{row.detail}</p>
              </article>
            ))}
          </div>
          <p className="table-note">{adapterValidation.reviewNote}</p>
        </div>
      ) : null}
      {preflight?.rows.length ? (
        <div className="drawdown-decision-gate">
          <div>
            <p className="eyebrow">Prototype preflight</p>
            <h4>{preflight.headline}</h4>
            <p>{preflight.detail}</p>
          </div>
          <div className="optimizer-eligibility-list">
            {preflight.rows.map((row) => (
              <article className={`optimizer-eligibility-note eligibility-${row.status === 'ready' ? 'ok' : row.status === 'hold' ? 'review' : 'blocked'}`} key={row.id}>
                <strong>{row.label}</strong>
                <span>{row.status === 'ready' ? 'Ready' : row.status === 'hold' ? 'Hold' : 'Blocked'}</span>
                <p>{row.detail}</p>
              </article>
            ))}
          </div>
          <p className="table-note">{preflight.reviewNote}</p>
        </div>
      ) : null}
      {auditTrail?.rows.length ? (
        <div className="drawdown-decision-gate">
          <div>
            <p className="eyebrow">Draft audit trail</p>
            <h4>Draft shape for review</h4>
            <p>This explains where the draft came from without turning it into an instruction.</p>
          </div>
          <div className="result-table-wrap">
            <table className="result-table">
              <thead>
                <tr>
                  <th>Check</th>
                  <th>Value</th>
                  <th>Why it matters</th>
                </tr>
              </thead>
              <tbody>
                {auditTrail.rows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.label}</td>
                    <td>{row.value}</td>
                    <td>{row.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="table-note">{auditTrail.reviewNote}</p>
        </div>
      ) : null}
      {containmentGuard?.rows.length ? (
        <div className="drawdown-decision-gate">
          <div>
            <p className="eyebrow">Containment guard</p>
            <h4>{containmentGuard.status === 'containedForReview' ? 'Contained for review' : 'Containment blocked'}</h4>
            <p>These checks keep the work inside review evidence until a later sprint opens a small prototype.</p>
          </div>
          <div className="optimizer-eligibility-list">
            {containmentGuard.rows.map((row) => (
              <article className={`optimizer-eligibility-note eligibility-${row.status === 'contained' ? 'ok' : 'blocked'}`} key={row.id}>
                <strong>{row.label}</strong>
                <span>{row.status === 'contained' ? 'Contained' : 'Blocked'}</span>
                <p>{row.detail}</p>
              </article>
            ))}
          </div>
          <p className="table-note">{containmentGuard.reviewNote}</p>
        </div>
      ) : null}
      {goNoGo?.rows.length ? (
        <div className="drawdown-decision-gate">
          <div>
            <p className="eyebrow">Execution prototype go/no-go</p>
            <h4>{goNoGo.headline}</h4>
            <p>{goNoGo.detail}</p>
          </div>
          <div className="optimizer-eligibility-list">
            {goNoGo.rows.map((row) => (
              <article className={`optimizer-eligibility-note eligibility-${row.status === 'ready' ? 'ok' : row.status === 'hold' ? 'review' : 'blocked'}`} key={row.id}>
                <strong>{row.label}</strong>
                <span>{row.status === 'ready' ? 'Ready' : row.status === 'hold' ? 'Hold' : 'Blocked'}</span>
                <p>{row.detail}</p>
              </article>
            ))}
          </div>
          <p className="table-note">{goNoGo.reviewNote}</p>
        </div>
      ) : (
        <p className="table-note">Execution boundary details appear after the drawdown preview checks run.</p>
      )}
      {containedPrototype?.rows.length ? (
        <div className="drawdown-decision-gate">
          <div>
            <p className="eyebrow">Contained drawdown prototype</p>
            <h4>{containedPrototype.headline}</h4>
            <p>{containedPrototype.detail}</p>
          </div>
          <div className="optimizer-eligibility-list">
            {containedPrototype.rows.map((row) => (
              <article className={`optimizer-eligibility-note eligibility-${row.status === 'ok' ? 'ok' : row.status === 'review' ? 'review' : 'blocked'}`} key={row.id}>
                <strong>{row.label}</strong>
                <span>{row.value}</span>
                <p>{row.detail}</p>
              </article>
            ))}
          </div>
          <p className="table-note">{containedPrototype.reviewNote}</p>
        </div>
      ) : null}
      {containedPrototypeSummary?.rows.length ? (
        <div className="drawdown-decision-gate">
          <div>
            <p className="eyebrow">Contained prototype summary</p>
            <h4>{containedPrototypeSummary.headline}</h4>
            <p>{containedPrototypeSummary.detail}</p>
          </div>
          <div className="optimizer-eligibility-list">
            {containedPrototypeSummary.rows.map((row) => (
              <article className={`optimizer-eligibility-note eligibility-${row.status === 'ready' ? 'ok' : row.status === 'hold' ? 'review' : 'blocked'}`} key={row.id}>
                <strong>{row.label}</strong>
                <span>{row.status === 'ready' ? 'Ready' : row.status === 'hold' ? 'Hold' : 'Blocked'}</span>
                <p>{row.detail}</p>
              </article>
            ))}
          </div>
          <p className="table-note">{containedPrototypeSummary.reviewNote}</p>
        </div>
      ) : null}
      {containedMateriality?.rows.length ? (
        <div className="drawdown-decision-gate">
          <div>
            <p className="eyebrow">Prototype materiality</p>
            <h4>{containedMateriality.headline}</h4>
            <p>This checks whether the contained scenario moved enough to be worth reading.</p>
          </div>
          <div className="optimizer-eligibility-list">
            {containedMateriality.rows.map((row) => (
              <article className={`optimizer-eligibility-note eligibility-${row.status === 'material' ? 'ok' : row.status === 'blocked' ? 'blocked' : 'review'}`} key={row.id}>
                <strong>{row.label}</strong>
                <span>{row.status === 'material' ? 'Material' : row.status === 'immaterial' ? 'Small' : row.status === 'blocked' ? 'Blocked' : 'Review'}</span>
                <p>{row.detail}</p>
              </article>
            ))}
          </div>
          <p className="table-note">{containedMateriality.reviewNote}</p>
        </div>
      ) : null}
      {containedExplanation?.rows.length ? (
        <div className="drawdown-decision-gate">
          <div>
            <p className="eyebrow">Why it moved</p>
            <h4>{containedExplanation.headline}</h4>
            <p>This translates the scenario movement into plain review language.</p>
          </div>
          <div className="optimizer-eligibility-list">
            {containedExplanation.rows.map((row) => (
              <article className="optimizer-eligibility-note eligibility-review" key={row.id}>
                <strong>{row.label}</strong>
                <span>Review</span>
                <p>{row.detail}</p>
              </article>
            ))}
          </div>
          <p className="table-note">{containedExplanation.reviewNote}</p>
        </div>
      ) : null}
      {containedLimitations?.rows.length ? (
        <div className="drawdown-decision-gate">
          <div>
            <p className="eyebrow">Prototype limits</p>
            <h4>What this does not do</h4>
            <p>These limits keep the contained prototype from sounding more certain than it is.</p>
          </div>
          <div className="optimizer-eligibility-list">
            {containedLimitations.rows.map((row) => (
              <article className="optimizer-eligibility-note eligibility-review" key={row.id}>
                <strong>{row.label}</strong>
                <span>Limit</span>
                <p>{row.detail}</p>
              </article>
            ))}
          </div>
          <p className="table-note">{containedLimitations.reviewNote}</p>
        </div>
      ) : null}
      {containedUsefulnessCloseout?.rows.length ? (
        <div className="drawdown-decision-gate">
          <div>
            <p className="eyebrow">Prototype usefulness</p>
            <h4>{containedUsefulnessCloseout.headline}</h4>
            <p>{containedUsefulnessCloseout.detail}</p>
          </div>
          <div className="optimizer-eligibility-list">
            {containedUsefulnessCloseout.rows.map((row) => (
              <article className={`optimizer-eligibility-note eligibility-${row.status === 'ready' ? 'ok' : row.status === 'hold' ? 'review' : 'blocked'}`} key={row.id}>
                <strong>{row.label}</strong>
                <span>{row.status === 'ready' ? 'Ready' : row.status === 'hold' ? 'Hold' : 'Blocked'}</span>
                <p>{row.detail}</p>
              </article>
            ))}
          </div>
          <p className="table-note">{containedUsefulnessCloseout.reviewNote}</p>
        </div>
      ) : null}
      {containedDetailsDensity?.rows.length ? (
        <div className="drawdown-decision-gate">
          <div>
            <p className="eyebrow">Details density check</p>
            <h4>{containedDetailsDensity.status === 'compactEnough' ? 'Compact enough for Details' : 'Too dense for Details'}</h4>
            <p>This keeps the contained prototype from crowding the Results experience.</p>
          </div>
          <div className="optimizer-eligibility-list">
            {containedDetailsDensity.rows.map((row) => (
              <article className={`optimizer-eligibility-note eligibility-${row.status === 'ok' ? 'ok' : 'review'}`} key={row.id}>
                <strong>{row.label}</strong>
                <span>{row.status === 'ok' ? 'OK' : 'Hold'}</span>
                <p>{row.detail}</p>
              </article>
            ))}
          </div>
          <p className="table-note">{containedDetailsDensity.reviewNote}</p>
        </div>
      ) : null}
      {containedReviewChecklist?.rows.length ? (
        <div className="drawdown-decision-gate">
          <div>
            <p className="eyebrow">Prototype review checklist</p>
            <h4>{containedReviewChecklist.status === 'readyForReview' ? 'Ready to read carefully' : containedReviewChecklist.status === 'holdBeforeReview' ? 'Read with caution' : 'Do not use this prototype'}</h4>
            <p>This checklist keeps the contained prototype behind the main retirement answer.</p>
          </div>
          <div className="optimizer-eligibility-list">
            {containedReviewChecklist.rows.map((row) => (
              <article className={`optimizer-eligibility-note eligibility-${row.status === 'ready' ? 'ok' : row.status === 'hold' ? 'review' : 'blocked'}`} key={row.id}>
                <strong>{row.label}</strong>
                <span>{row.status === 'ready' ? 'Ready' : row.status === 'hold' ? 'Hold' : 'Blocked'}</span>
                <p>{row.detail}</p>
              </article>
            ))}
          </div>
          <p className="table-note">{containedReviewChecklist.reviewNote}</p>
        </div>
      ) : null}
      {containedCopyGuard?.rows.length ? (
        <div className="drawdown-decision-gate">
          <div>
            <p className="eyebrow">Prototype copy guard</p>
            <h4>{containedCopyGuard.status === 'copyClear' ? 'Copy stays review-oriented' : 'Copy guard blocked'}</h4>
            <p>These checks keep the contained prototype from sounding like a household action.</p>
          </div>
          <div className="optimizer-eligibility-list">
            {containedCopyGuard.rows.map((row) => (
              <article className={`optimizer-eligibility-note eligibility-${row.status === 'ok' ? 'ok' : 'blocked'}`} key={row.id}>
                <strong>{row.label}</strong>
                <span>{row.status === 'ok' ? 'OK' : 'Blocked'}</span>
                <p>{row.detail}</p>
              </article>
            ))}
          </div>
          <p className="table-note">{containedCopyGuard.reviewNote}</p>
        </div>
      ) : null}
      {containedProductGoNoGo?.rows.length ? (
        <div className="drawdown-decision-gate">
          <div>
            <p className="eyebrow">Contained prototype go/no-go</p>
            <h4>{containedProductGoNoGo.headline}</h4>
            <p>{containedProductGoNoGo.detail}</p>
          </div>
          <div className="optimizer-eligibility-list">
            {containedProductGoNoGo.rows.map((row) => (
              <article className={`optimizer-eligibility-note eligibility-${row.status === 'ready' ? 'ok' : row.status === 'hold' ? 'review' : 'blocked'}`} key={row.id}>
                <strong>{row.label}</strong>
                <span>{row.status === 'ready' ? 'Ready' : row.status === 'hold' ? 'Hold' : 'Blocked'}</span>
                <p>{row.detail}</p>
              </article>
            ))}
          </div>
          <p className="table-note">{containedProductGoNoGo.reviewNote}</p>
        </div>
      ) : null}
      {phaseCloseout?.rows.length ? (
        <div className="drawdown-decision-gate">
          <div>
            <p className="eyebrow">Execution phase closeout</p>
            <h4>{phaseCloseout.headline}</h4>
            <p>{phaseCloseout.detail}</p>
          </div>
          <div className="optimizer-eligibility-list">
            {phaseCloseout.rows.map((row) => (
              <article className={`optimizer-eligibility-note eligibility-${row.status === 'ready' ? 'ok' : row.status === 'hold' ? 'review' : 'blocked'}`} key={row.id}>
                <strong>{row.label}</strong>
                <span>{row.status === 'ready' ? 'Ready' : row.status === 'hold' ? 'Hold' : 'Blocked'}</span>
                <p>{row.detail}</p>
              </article>
            ))}
          </div>
          <p className="table-note">{phaseCloseout.reviewNote}</p>
        </div>
      ) : null}
    </section>
  );
}

function optimizerLeverLabel(lever: BoundedOptimizerSummary['eligibilityNotes'][number]['lever']): string {
  const labels: Record<BoundedOptimizerSummary['eligibilityNotes'][number]['lever'], string> = {
    spending: 'Spending',
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

function RecommendedChecklistPanel({
  items
}: {
  items: ReturnType<typeof selectRecommendedPath>['checklistItems'];
}) {
  return (
    <section className="result-card recommended-checklist-panel">
      <div>
        <p className="eyebrow">Before relying on this plan</p>
        <h3>Before you rely on this path</h3>
        <p>Review steps based on the selected path. These notes stay separate from your saved plan file.</p>
      </div>
      <div className="recommended-checklist-list">
        {items.map((item) => (
          <div className={`recommended-checklist-item checklist-${item.status}`} key={item.id}>
            <div>
              <strong>{item.label}</strong>
              <span>{item.detail}</span>
            </div>
            <div>
              <small>{item.priority}</small>
              <small>{item.handoff}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RiskDetailPanel({ detail }: { detail: ReturnType<typeof selectRecommendedPath>['riskDetails'][number] }) {
  return (
    <section className={`risk-detail-panel risk-detail-${detail.severity}`}>
      <div>
        <p className="eyebrow">Selected path detail</p>
        <h3>{detail.label}</h3>
        <p>{detail.headline}</p>
      </div>
      <div className="summary-grid risk-metric-grid">
        {detail.metrics.map((metric) => (
          <Metric
            key={metric.id}
            label={metric.label}
            value={metric.value}
            valueClass={metric.tone === 'ok' ? 'ok-value' : metric.tone === 'watch' ? 'bad-value' : ''}
          />
        ))}
      </div>
      <p>{detail.detail}</p>
      <div className="risk-evidence-list">
        {detail.evidenceRows.map((row) => (
          <div key={row.id}>
            <strong>{row.label}</strong>
            <span>{row.value}</span>
            <small>{row.detail}</small>
          </div>
        ))}
      </div>
      <p className="table-note">{detail.handoff}</p>
    </section>
  );
}

function PlanHealthPanel({
  health,
  loading
}: {
  health: ReturnType<typeof selectPlanHealthExplainer>;
  loading: boolean;
}) {
  return (
    <section className={`decision-panel decision-panel-${health.status}`}>
      <div>
        <h3>Plan health</h3>
        <p>{loading ? 'Calculating plan health from the extracted results.' : health.headline}</p>
      </div>
      <div className="summary-grid">
        <Metric label="Funded through" value={health.fundedThroughYear ? String(health.fundedThroughYear) : '-'} />
        <Metric label="First pressure point" value={health.firstPressurePoint} />
        <Metric label="Largest review item" value={health.largestReviewItem} />
      </div>
      <p className="table-note">{health.detailFallback}</p>
    </section>
  );
}

function SourceStoryPanel({ story }: { story: ReturnType<typeof selectSourceReconciliationStory> }) {
  return (
    <section className="decision-panel">
      <h3>Money-in / money-out check story{story.year ? ` (${story.year})` : ''}</h3>
      <p>{story.headline}</p>
      <div className="source-story-flow" aria-label="First-year money-in / money-out check flow">
        {story.steps.map((step) => (
          <div className={`source-story-step source-story-${step.tone}`} key={step.id}>
            <span>{step.label}</span>
            <strong>{formatSignedMoney(step.amount)}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function DecisionChecklistPanel({ items }: { items: ReturnType<typeof selectDecisionChecklist> }) {
  return (
    <section className="decision-panel">
      <h3>Decision checklist</h3>
      <div className="decision-checklist">
        {items.map((item) => (
          <div className={`decision-checklist-item checklist-${item.status}`} key={item.id}>
            <div>
              <strong>{item.label}</strong>
              <span>{item.reason}</span>
            </div>
            <small>{item.detail}</small>
          </div>
        ))}
      </div>
    </section>
  );
}

function DecisionDetailPanel({ rows }: { rows: ReturnType<typeof selectDecisionDetailRows> }) {
  return (
    <section className="decision-panel">
      <h3>Decision detail</h3>
      <div className="decision-detail-grid">
        {rows.map((row) => (
          <article className={`decision-detail-card checklist-${row.status}`} key={row.id}>
            <div>
              <strong>{row.label}</strong>
              <span>{row.evidence}</span>
            </div>
            <dl className="mini-ledger">
              <div>
                <dt>Years</dt>
                <dd>{row.years}</dd>
              </div>
              <div>
                <dt>Detail area</dt>
                <dd>{resultsSectionTitle(row.fallbackArea)}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

function TaxPressurePanel({
  explanation,
  loading,
  rows
}: {
  explanation: ReturnType<typeof selectTaxPressureExplanation>;
  loading: boolean;
  rows: ReturnType<typeof selectTaxPressureRows>;
}) {
  return (
    <section className="decision-panel">
      <h3>Canadian tax pressure timeline</h3>
      <p>{explanation.headline}</p>
      <div className="result-table-wrap">
        <table className="result-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Pressure</th>
              <th>Reason</th>
              <th>Taxable income</th>
              <th>Tax</th>
              <th>OAS clawback</th>
              <th>Registered draws</th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <tr className={row.pressure === 'high' ? 'warning-row' : ''} key={row.year}>
                  <td>{row.year}</td>
                  <td>{row.pressure}</td>
                  <td>{row.reason}</td>
                  <td>{formatMoney(row.taxableIncome)}</td>
                  <td>{formatMoney(row.tax)}</td>
                  <td>{formatMoney(row.oasClawback)}</td>
                  <td>{formatMoney(row.registeredWithdrawals)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7}>{loading ? 'Calculating' : 'No major tax pressure years detected'}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {explanation.rows.length > 0 ? (
        <div className="tax-explanation-list">
          {explanation.rows.slice(0, 4).map((row) => (
            <div key={`${row.year}-${row.reason}`}>
              <strong>{row.year}</strong>
              <span>{row.explanation}</span>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function ScenarioCardsPanel({ cards }: { cards: ReturnType<typeof selectScenarioChoiceCards> }) {
  return (
    <section className="decision-panel">
      <h3>Retirement choices to compare</h3>
      <p>
        These cards translate the preview reruns into household decisions. Use them to decide which path deserves a
        closer look, then use the table below for the numbers behind each choice.
      </p>
      <div className="scenario-card-grid">
        {cards.map((card) => (
          <article className={`scenario-card scenario-${card.status} scenario-tone-${card.tone}`} key={card.id}>
            <div>
              <strong>{card.label}</strong>
              <span>{card.householdChoice}</span>
            </div>
            <dl className="mini-ledger">
              <div>
                <dt>{card.primaryMetricLabel}</dt>
                <dd>{card.primaryMetric}</dd>
              </div>
              <div>
                <dt>{card.secondaryMetricLabel}</dt>
                <dd>{card.secondaryMetric}</dd>
              </div>
            </dl>
            <div className="scenario-copy-grid">
              <div>
                <small>Best for</small>
                <p>{card.bestFor}</p>
              </div>
              <div>
                <small>Trade-off</small>
                <p>{card.tradeoff}</p>
              </div>
            </div>
            <p className="table-note">{card.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ScenarioAssumptionsPanel({ rows }: { rows: ReturnType<typeof selectScenarioAssumptionRows> }) {
  return (
    <section className="decision-panel">
      <h3>Scenario assumptions</h3>
      <div className="result-table-wrap">
        <table className="result-table compact-table">
          <thead>
            <tr>
              <th>Scenario</th>
              <th>Baseline</th>
              <th>Scenario</th>
              <th>Changed</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.label}</td>
                <td>{row.baseline}</td>
                <td>{row.scenario}</td>
                <td>{row.changed ? 'Yes' : 'Needs input'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ScenarioComparisonPanel({
  loading,
  rows
}: {
  loading: boolean;
  rows: ReturnType<typeof selectScenarioComparisonRows>;
}) {
  return (
    <section className="decision-panel">
      <h3>Scenario comparison</h3>
      <div className="result-table-wrap">
        <table className="result-table">
          <thead>
            <tr>
              <th>Scenario</th>
              <th>Status</th>
              <th>End portfolio delta</th>
              <th>First-year spending delta</th>
              <th>Lifetime tax delta</th>
              <th>Funded through</th>
              <th>First shortfall</th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <tr className={row.status === 'worse' ? 'warning-row' : ''} key={row.id}>
                  <td>{row.label}</td>
                  <td>{loading || row.status === 'notAvailable' ? 'Calculating' : row.status}</td>
                  <td className={row.endPortfolioDelta >= 0 ? 'ok-value' : 'bad-value'}>
                    {formatSignedMoney(row.endPortfolioDelta)}
                  </td>
                  <td>{formatSignedMoney(row.firstYearSpendingDelta)}</td>
                  <td className={row.lifetimeTaxDelta <= 0 ? 'ok-value' : 'bad-value'}>
                    {formatSignedMoney(row.lifetimeTaxDelta)}
                  </td>
                  <td>{row.fundedThroughYear || '-'}</td>
                  <td>{row.firstShortfallYear || '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7}>{loading ? 'Calculating' : 'No scenario comparisons available'}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="table-note">These are simple local reruns for comparison only. Full optimization remains out of scope.</p>
    </section>
  );
}

function OptimizerBoundaryPanel({
  loading,
  summary
}: {
  loading: boolean;
  summary: ReturnType<typeof selectOptimizerDecisionBoundaries>;
}) {
  return (
    <section className={`optimizer-boundary-panel optimizer-boundary-${summary.status}`}>
      <div>
        <p className="eyebrow">Future optimizer prep</p>
        <h3>{loading ? 'Checking decision boundaries' : summary.headline}</h3>
        <p>{summary.detail}</p>
      </div>
      <div className="summary-grid">
        <Metric label="Ready as inputs" value={String(summary.availableCount)} />
        <Metric label="Needs clearer intent" value={String(summary.needsInputCount)} />
        <Metric label="Review-only for now" value={String(summary.reviewOnlyCount)} />
      </div>
      <div className="optimizer-boundary-list">
        {summary.rows.map((row) => (
          <article className={`optimizer-boundary-row optimizer-row-${row.status}`} key={row.id}>
            <div>
              <small>{row.status === 'available' ? 'available' : row.status === 'needsInput' ? 'needs input' : 'review only'}</small>
              <h4>{row.label}</h4>
              <p>{row.whyItMatters}</p>
            </div>
            <dl className="mini-ledger">
              <div>
                <dt>Current</dt>
                <dd>{row.currentSetting}</dd>
              </div>
              <div>
                <dt>Future search space</dt>
                <dd>{row.futureSearchSpace}</dd>
              </div>
              <div>
                <dt>Before optimizing</dt>
                <dd>{row.beforeOptimizing}</dd>
              </div>
              <div>
                <dt>Review area</dt>
                <dd>{resultsSectionTitle(row.detailArea)}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
      <p className="table-note">{summary.nextStep}</p>
    </section>
  );
}

function OptimizerInputReviewPanel({ summary }: { summary: ReturnType<typeof selectOptimizerInputReview> }) {
  return (
    <section className={`optimizer-input-review optimizer-input-${summary.status}`}>
      <div>
        <p className="eyebrow">Optimizer permissions review</p>
        <h3>{summary.headline}</h3>
        <p>{summary.detail}</p>
      </div>
      <div className="summary-grid">
        <Metric label="Can explore" value={String(summary.canExploreCount)} />
        <Metric label="Must preserve" value={String(summary.mustPreserveCount)} />
        <Metric label="Needs decision" value={String(summary.needsDecisionCount)} />
      </div>
      <div className="optimizer-permission-grid">
        {summary.rows.map((row) => (
          <article className={`optimizer-permission-card permission-${row.permission}`} key={row.id}>
            <div>
              <small>
                {row.permission === 'canExplore'
                  ? 'can explore'
                  : row.permission === 'mustPreserve'
                    ? 'must preserve'
                    : 'needs decision'}
              </small>
              <h4>{row.label}</h4>
              <p>{row.reviewQuestion}</p>
            </div>
            <dl className="mini-ledger">
              <div>
                <dt>Current</dt>
                <dd>{row.currentSetting}</dd>
              </div>
              <div>
                <dt>Guardrail</dt>
                <dd>{row.guardrail}</dd>
              </div>
              <div>
                <dt>Next review</dt>
                <dd>{row.suggestedNextStep}</dd>
              </div>
              <div>
                <dt>Review area</dt>
                <dd>{resultsSectionTitle(row.detailArea)}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

function SurvivorSummaryPanel({
  comparison,
  summary
}: {
  comparison: ReturnType<typeof selectSurvivorComparison>;
  summary: ReturnType<typeof selectSurvivorViewSummary>;
}) {
  return (
    <section className={`decision-panel survivor-panel survivor-${summary.status}`}>
      <h3>Survivor view snapshot</h3>
      <p>{summary.headline}</p>
      <div className="summary-grid">
        <Metric label="Survivor year" value={summary.survivorYear ? String(summary.survivorYear) : '-'} />
        <Metric label="Income at risk" value={formatMoney(summary.incomeAtRisk)} />
        <Metric label="Status" value={summary.status} />
      </div>
      {comparison.status === 'ready' ? (
        <div className="summary-grid">
          <Metric label="End portfolio delta" value={formatSignedMoney(comparison.endPortfolioDelta)} />
          <Metric label="Lifetime tax delta" value={formatSignedMoney(comparison.lifetimeTaxDelta)} />
          <Metric label="Spending funded" value={comparison.spendingFundedYears} />
          <Metric label="Funded through" value={comparison.fundedThroughYear ? String(comparison.fundedThroughYear) : '-'} />
          <Metric label="First survivor shortfall" value={comparison.firstShortfallYear ? String(comparison.firstShortfallYear) : '-'} />
        </div>
      ) : null}
      <p className="table-note">{summary.detail} Use Survivor Impact for the fuller household review.</p>
    </section>
  );
}

function HouseholdResiliencePanel({
  comparison,
  loading,
  rows,
  story,
  summary
}: {
  comparison: ReturnType<typeof selectSurvivorComparison>;
  loading: boolean;
  rows: ReturnType<typeof selectSurvivorReviewRows>;
  story: ReturnType<typeof selectSurvivorStorySummary>;
  summary: ReturnType<typeof selectSurvivorViewSummary>;
}) {
  type SurvivorReviewPanelRow = ReturnType<typeof selectSurvivorReviewRows>[number];

  return (
    <div className="household-resilience-panel">
      <section className={`survivor-story-panel survivor-story-${story.status}`}>
        <div>
          <p className="eyebrow">Household resilience</p>
          <h3>{loading ? 'Calculating household resilience' : story.headline}</h3>
          <p>{story.detail}</p>
        </div>
        <div className="summary-grid">
          <Metric label="Readiness" value={loading && story.status === 'notAvailable' ? 'Calculating' : story.readiness} />
          <Metric label="Survivor year" value={story.survivorYear ? String(story.survivorYear) : '-'} />
          <Metric label="Income at risk" value={formatMoney(story.incomeAtRisk)} />
          <Metric label="First shortfall" value={story.firstShortfallYear ? String(story.firstShortfallYear) : 'None'} />
        </div>
        <div className="summary-grid">
          <Metric label="End portfolio delta" value={formatSignedMoney(story.endPortfolioDelta)} />
          <Metric label="Survivor end portfolio" value={formatMoney(story.survivorEndPortfolio)} />
          <Metric label="Lifetime tax delta" value={formatSignedMoney(story.lifetimeTaxDelta)} />
          <Metric label="Spending funded" value={story.spendingFundedYears} />
          <Metric label="Funded through" value={story.fundedThroughYear ? String(story.fundedThroughYear) : '-'} />
        </div>
      </section>

      <div className="survivor-review-list">
        {rows.map((row: SurvivorReviewPanelRow) => (
          <section className={`survivor-review-row survivor-review-${row.severity}`} key={row.id}>
            <div>
              <small>{row.severity}</small>
              <h3>{row.label}</h3>
              <p>{row.explanation}</p>
              <p className="table-note">{row.reviewAction}</p>
            </div>
            <dl className="mini-ledger">
              <div>
                <dt>Value</dt>
                <dd>{loading && comparison.status === 'notAvailable' ? 'Calculating' : row.value}</dd>
              </div>
              <div>
                <dt>Review</dt>
                <dd>{resultsSectionTitle(row.detailArea)}</dd>
              </div>
            </dl>
          </section>
        ))}
      </div>

      <section className="decision-panel">
        <h3>Detailed report fallback</h3>
        <p>{story.stableDashboardHandoff}</p>
        <p className="table-note">{summary.detail}</p>
      </section>
    </div>
  );
}

function ReconciliationDiagnosticsPanel({
  diagnostics,
  loading
}: {
  diagnostics: ReturnType<typeof selectReconciliationDiagnostics>;
  loading: boolean;
}) {
  return (
    <section className={`reconciliation-diagnostics ${diagnostics.status === 'warning' ? 'watch-card' : ''}`}>
      <h3>Money-in / money-out check diagnostics</h3>
      <div className="summary-grid">
        <Metric label="Rows checked" value={loading ? 'Calculating' : String(diagnostics.rowsChecked || '-')} />
        <Metric label="Warnings" value={String(diagnostics.warningCount)} />
        <Metric label="First warning year" value={diagnostics.firstWarningYear ? String(diagnostics.firstWarningYear) : '-'} />
        <Metric label="Max funding gap" value={formatSignedMoney(diagnostics.maxReconciliationGap)} />
        <Metric label="Max unexplained gap" value={formatSignedMoney(diagnostics.maxCashFlowDelta)} />
      </div>
    </section>
  );
}

function ProjectionPathPanel({
  loading,
  rows
}: {
  loading: boolean;
  rows: ReturnType<typeof selectProjectionMilestones>;
}) {
  return (
    <section className="projection-path-panel">
      <h3>Projection path</h3>
      <div className="result-table-wrap">
        <table className="result-table">
          <thead>
            <tr>
              <th>Point</th>
              <th>Year</th>
              <th>After-tax spending</th>
              <th>Tax</th>
              <th>Portfolio</th>
              <th>Shortfall</th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <tr key={`${row.label}-${row.year}`}>
                  <td>{row.label}</td>
                  <td>{row.year}</td>
                  <td>{formatMoney(row.afterTaxSpending)}</td>
                  <td>{formatMoney(row.tax)}</td>
                  <td>{formatMoney(row.portfolio)}</td>
                  <td className={row.shortfall > 1 ? 'bad-value' : 'ok-value'}>{formatMoney(row.shortfall)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>{loading ? 'Calculating' : 'No projection rows available'}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DeferredResultsPanel({ section }: { section: string }) {
  return (
    <div className="deferred-results-panel">
      <strong>{section} stays in the detailed report for now.</strong>
      <span>
        Detailed results remain available in the printable report while this part of the guided Results page is being
        simplified.
      </span>
    </div>
  );
}

function AccountsResultsPanel({
  balanceRows,
  chartRows,
  drawdownRows,
  loading,
  story,
  summaryRows
}: {
  balanceRows: ReturnType<typeof selectAccountBalanceSeries>;
  chartRows: ReturnType<typeof selectAccountBucketChartSeries>;
  drawdownRows: ReturnType<typeof selectAccountDrawdownReviewRows>;
  loading: boolean;
  story: ReturnType<typeof selectAccountDrawdownStory>;
  summaryRows: ReturnType<typeof selectAccountSummaryRows>;
}) {
  type AccountBalancePanelRow = ReturnType<typeof selectAccountBalanceSeries>[number];
  type AccountDrawdownPanelRow = ReturnType<typeof selectAccountDrawdownReviewRows>[number];
  const activeSummaryRows = summaryRows.filter((row) => Math.round(row.firstYearBalance) !== 0 || Math.round(row.endBalance) !== 0);
  const totalRow = summaryRows.find((row) => row.id === 'total');
  const firstYear = balanceRows[0]?.year;
  const lastYear = balanceRows[balanceRows.length - 1]?.year;
  const visibleRows = balanceRows;

  return (
    <div className="accounts-results-panel">
      <section className={`account-story-panel account-story-${story.status}`}>
        <span className="eyebrow">Account story</span>
        <h3>{loading ? 'Calculating account path' : story.headline}</h3>
        <p>{loading ? 'Account movement will appear after the projection runs.' : story.detail}</p>
        <div className="summary-grid">
          <Metric label="Peak portfolio" value={formatMoney(story.peakPortfolio)} />
          <Metric
            label="Lowest year"
            value={story.lowestPortfolioYear ? `${story.lowestPortfolioYear} (${formatMoney(story.lowestPortfolio)})` : '-'}
          />
          <Metric label="First depletion" value={story.firstDepletionYear ? String(story.firstDepletionYear) : 'Not shown'} />
        </div>
      </section>

      <div className="summary-grid">
        <Metric label="Balance years" value={firstYear && lastYear ? `${firstYear}-${lastYear}` : loading ? 'Calculating' : '-'} />
        <Metric label="End portfolio" value={formatMoney(totalRow?.endBalance)} />
        <Metric label="Peak portfolio" value={formatMoney(totalRow?.peakBalance)} />
      </div>

      <ChartPanel
        chartData={accountBucketChartData(chartRows)}
        emptyText={loading ? 'Calculating account chart' : 'No account chart rows available'}
        title="Account bucket balances"
      />

      <div className="result-overview-grid">
        <section className="result-card">
          <h3>Account summary</h3>
          <dl className="result-ledger">
            {activeSummaryRows.length > 0 ? (
              activeSummaryRows.map((row) => (
                <div key={row.id}>
                  <dt>{row.label}</dt>
                  <dd>{formatMoney(row.endBalance)}</dd>
                </div>
              ))
            ) : (
              <div>
                <dt>Preview</dt>
                <dd>{loading ? 'Calculating' : '-'}</dd>
              </div>
            )}
          </dl>
        </section>

        <section className="result-card">
          <h3>Start to end</h3>
          <dl className="result-ledger">
            {activeSummaryRows.slice(0, 5).map((row) => (
              <div key={row.id}>
                <dt>{row.label}</dt>
                <dd>
                  {formatMoney(row.firstYearBalance)} to {formatMoney(row.endBalance)}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <div className="account-review-list" aria-label="Account review checks">
        {drawdownRows.map((row: AccountDrawdownPanelRow) => (
          <section className={`account-review-row account-review-${row.severity}`} key={row.id}>
            <span className="status-pill">{row.severity}</span>
            <div>
              <h3>{row.label}</h3>
              <p>{row.explanation}</p>
              <dl className="mini-ledger">
                <div>
                  <dt>Year</dt>
                  <dd>{row.year ?? '-'}</dd>
                </div>
                <div>
                  <dt>Value</dt>
                  <dd>{row.value}</dd>
                </div>
              </dl>
              <p className="table-note">{row.reviewAction}</p>
            </div>
          </section>
        ))}
      </div>

      <div className="result-table-wrap">
        <table className="result-table">
          <thead>
            <tr>
              <th>Account</th>
              <th>Start</th>
              <th>End</th>
              <th>Peak</th>
              <th>Net change</th>
            </tr>
          </thead>
          <tbody>
            {activeSummaryRows.length > 0 ? (
              activeSummaryRows.map((row) => (
                <tr key={row.id}>
                  <td>{row.label}</td>
                  <td>{formatMoney(row.firstYearBalance)}</td>
                  <td>{formatMoney(row.endBalance)}</td>
                  <td>{formatMoney(row.peakBalance)}</td>
                  <td className={row.netChange < -1 ? 'bad-value' : 'ok-value'}>{formatSignedMoney(row.netChange)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>{loading ? 'Calculating' : 'No account summary available'}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="result-table-wrap">
        <table className="result-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>RRSP/RRIF</th>
              <th>TFSA</th>
              <th>LIF</th>
              <th>Non-reg</th>
              <th>Cash</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.length > 0 ? (
              visibleRows.map((row: AccountBalancePanelRow) => (
                <tr key={row.year}>
                  <td>{row.year}</td>
                  <td>{formatMoney(row.rrsp)}</td>
                  <td>{formatMoney(row.tfsa)}</td>
                  <td>{formatMoney(row.lif)}</td>
                  <td>{formatMoney(row.nonRegistered)}</td>
                  <td>{formatMoney(row.cash)}</td>
                  <td>{formatMoney(row.total)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7}>{loading ? 'Calculating' : 'No account balances available'}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="table-note">{story.stableDashboardHandoff}</p>
    </div>
  );
}

function TaxesResultsPanel({
  detailRows,
  loading,
  reviewRows,
  story,
  summary
}: {
  detailRows: ReturnType<typeof selectTaxDetailRows>;
  loading: boolean;
  reviewRows: ReturnType<typeof selectTaxReviewRows>;
  story: ReturnType<typeof selectTaxStorySummary>;
  summary: ReturnType<typeof selectTaxSummaryMetrics>;
}) {
  type TaxReviewPanelRow = ReturnType<typeof selectTaxReviewRows>[number];
  type TaxDetailPanelRow = ReturnType<typeof selectTaxDetailRows>[number];
  const visibleRows = detailRows.slice(0, 12);

  return (
    <div className="taxes-results-panel">
      <section className={`tax-story-panel tax-story-${story.status}`}>
        <div>
          <p className="eyebrow">Tax story</p>
          <h3>{loading ? 'Calculating tax story' : story.headline}</h3>
          <p>{story.detail}</p>
        </div>
        <div className="summary-grid">
          <Metric label="Peak tax year" value={story.peakTaxYear ? `${story.peakTaxYear} (${formatMoney(story.peakTax)})` : '-'} />
          <Metric label="Registered withdrawal years" value={String(story.registeredWithdrawalYears)} />
          <Metric label="Lower-tax window" value={story.planningWindowYears} />
        </div>
      </section>

      <div className="summary-grid">
        <Metric label="First-year tax" value={loading ? 'Calculating' : formatMoney(summary.firstYearTax)} />
        <Metric label="Lifetime tax" value={formatMoney(summary.lifetimeTax)} />
        <Metric label="Peak tax year" value={summary.peakTaxYear ? `${summary.peakTaxYear} (${formatMoney(summary.peakTax)})` : '-'} />
        <Metric label="First-year taxable income" value={formatMoney(summary.firstYearTaxableIncome)} />
        <Metric label="Lifetime OAS clawback" value={formatMoney(summary.lifetimeOasClawback)} />
      </div>

      <div className="tax-review-list">
        {reviewRows.map((row: TaxReviewPanelRow) => (
          <section className={`tax-review-row tax-review-${row.severity}`} key={row.id}>
            <div>
              <small>{row.severity}</small>
              <h3>{row.label}</h3>
              <p>{row.explanation}</p>
            </div>
            <dl className="mini-ledger">
              <div>
                <dt>Year</dt>
                <dd>{row.year || '-'}</dd>
              </div>
              <div>
                <dt>Value</dt>
                <dd>{row.value}</dd>
              </div>
            </dl>
            <p className="table-note">{row.reviewAction}</p>
          </section>
        ))}
      </div>

      <div className="result-table-wrap">
        <table className="result-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Taxable income</th>
              <th>Tax</th>
              <th>Effective rate</th>
              <th>OAS clawback</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.length > 0 ? (
              visibleRows.map((row: TaxDetailPanelRow) => (
                <tr key={row.year}>
                  <td>{row.year}</td>
                  <td>{formatMoney(row.taxableIncome)}</td>
                  <td>{formatMoney(row.tax)}</td>
                  <td>{formatPercent(row.effectiveRate)}</td>
                  <td>{formatMoney(row.oasClawback)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>{loading ? 'Calculating' : 'No tax rows available'}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {detailRows.length > visibleRows.length ? (
        <p className="table-note">Showing the first {visibleRows.length} years. Full tax detail remains in the detailed report.</p>
      ) : null}
      <p className="table-note">{story.stableDashboardHandoff}</p>
    </div>
  );
}

function StressTestsPanel({
  indicatorRows,
  loading,
  rows,
  scenarioRows,
  summary,
  survivorComparison,
  survivorSummary
}: {
  indicatorRows: ReturnType<typeof selectStressIndicatorRows>;
  loading: boolean;
  rows: ReturnType<typeof selectStressTestRows>;
  scenarioRows: ReturnType<typeof selectScenarioComparisonRows>;
  summary: ReturnType<typeof selectStressTestSummary>;
  survivorComparison: ReturnType<typeof selectSurvivorComparison>;
  survivorSummary: ReturnType<typeof selectSurvivorViewSummary>;
}) {
  type StressTestPanelRow = ReturnType<typeof selectStressTestRows>[number];
  type StressIndicatorPanelRow = ReturnType<typeof selectStressIndicatorRows>[number];

  return (
    <div className="stress-tests-panel">
      <section className={`stress-summary-panel stress-${summary.status}`}>
        <div>
          <p className="eyebrow">Baseline stress read</p>
          <h3>{loading ? 'Calculating stress read' : summary.headline}</h3>
          <p>{summary.detail}</p>
        </div>
        <div className="summary-grid">
          <Metric label="Funded years" value={`${summary.fundedYears}/${summary.totalYears || 0}`} />
          <Metric label="First stress year" value={summary.firstStressYear ? String(summary.firstStressYear) : 'None'} />
          <Metric label="Main item" value={summary.worstStressLabel} />
        </div>
      </section>

      <div className="stress-row-list">
        {rows.map((row: StressTestPanelRow) => (
          <section className={`stress-row stress-row-${row.severity}`} key={row.id}>
            <div>
              <small>{row.severity}</small>
              <h3>{row.label}</h3>
              <p>{row.evidence}</p>
            </div>
            <dl className="mini-ledger">
              <div>
                <dt>Year</dt>
                <dd>{row.year || '-'}</dd>
              </div>
              <div>
                <dt>Value</dt>
                <dd>{row.value}</dd>
              </div>
              <div>
                <dt>Review</dt>
                <dd>{resultsSectionTitle(row.detailArea)}</dd>
              </div>
            </dl>
            <p className="table-note">{row.reviewAction}</p>
          </section>
        ))}
      </div>

      <div className="result-overview-grid">
        {indicatorRows.map((row: StressIndicatorPanelRow) => (
          <section className={`result-card ${row.severity === 'watch' ? 'watch-card' : ''}`} key={row.id}>
            <h3>{row.label}</h3>
            <p className={row.severity === 'watch' ? 'bad-value' : 'ok-value'}>{loading ? 'Calculating' : row.value}</p>
          </section>
        ))}
      </div>
      <section className="stress-scenario-panel">
        <div>
          <p className="eyebrow">Scenario tests</p>
          <h3>Compare the main fragility levers</h3>
          <p>
            These local reruns keep the stress read close to the baseline without changing the saved plan. Use the
            detailed report for deeper stress tables and printable charts.
          </p>
        </div>
        <ScenarioComparisonPanel loading={loading} rows={scenarioRows} />
      </section>
      <section className="stress-household-panel">
        <div>
          <p className="eyebrow">Household resilience</p>
          <h3>Survivor stress check</h3>
          <p>
            This keeps the survivor comparison visible beside baseline stress indicators so a couple plan can be reviewed
            before relying on the preview path.
          </p>
        </div>
        <SurvivorSummaryPanel comparison={survivorComparison} summary={survivorSummary} />
      </section>
      <p className="table-note">{summary.stableDashboardHandoff}</p>
    </div>
  );
}

function AssumptionsResultsPanel({ plan }: { plan: V2PlanPayload }) {
  const rows: Array<[string, string]> = [
    ['Retirement year', String(plan.assumptions.retireYear || plan.p1.retireYear || '-')],
    ['Plan start', plan.assumptions.planStart ? String(plan.assumptions.planStart) : 'Retirement year'],
    ['Plan end', String(plan.assumptions.planEnd || '-')],
    ['Return assumption', formatPercent(plan.assumptions.returnRate)],
    ['Inflation', formatPercent(plan.assumptions.inflation)],
    ['Volatility', formatPercent(plan.assumptions.returnStdDev)],
    ['Withdrawal order to test', plan.assumptions.withdrawalOrder || 'default'],
    ['CPP sharing', plan.assumptions.cppSharing ? 'Enabled' : 'Disabled'],
    ['Younger-spouse RRIF age', plan.assumptions.youngerSpouseRrif ? 'Enabled' : 'Disabled'],
    ['Spousal RRSP attribution', plan.assumptions.spousalRrsp ? 'Enabled' : 'Disabled'],
    ['Survivor year', plan.assumptions.p1DiesInSurvivor ? String(plan.assumptions.p1DiesInSurvivor) : 'None'],
    ['Cash wedge target', `${plan.cashWedge?.targetYears || 0} years at ${formatPercent(plan.cashWedge?.returnRate)}`]
  ];

  return (
    <div className="assumptions-results-panel">
      <div className="review-summary">
        <ReviewSummaryCard title="Run assumptions" rows={rows.slice(0, 6)} />
        <ReviewSummaryCard title="Strategy settings" rows={rows.slice(6)} />
      </div>
    </div>
  );
}

function ExportSavePanel({
  onDownload,
  plan,
  readinessRows,
  readinessSummary,
  validation
}: {
  onDownload: () => void;
  plan: V2PlanPayload;
  readinessRows: ReturnType<typeof selectResultsReadinessRows>;
  readinessSummary: ReturnType<typeof selectResultsReadinessSummary>;
  validation: PlanValidationResult | null;
}) {
  const hasBlockers = Boolean(validation && !validation.canGenerate);
  return (
    <div className="export-save-panel">
      <ResultsReadinessPanel rows={readinessRows} summary={readinessSummary} />

      <div className="result-overview-grid">
        <section className="result-card">
          <p className="eyebrow">Save your inputs</p>
          <h3>Save editable plan</h3>
          <p>
            This saves the household inputs and assumptions so you can reopen and revise the plan later. It is not the
            printable client report.
          </p>
          <dl className="result-ledger">
            <div>
              <dt>Plan title</dt>
              <dd>{plan.title || 'Not named yet'}</dd>
            </div>
            <div>
              <dt>Save readiness</dt>
              <dd>{readinessSummary.saveStatus}</dd>
            </div>
            <div>
              <dt>File type</dt>
              <dd>Editable local plan</dd>
            </div>
          </dl>
          <p>{readinessSummary.detail}</p>
          <button className="ghost" type="button" onClick={onDownload} disabled={readinessSummary.saveStatus === 'blocked'}>
            Save editable plan
          </button>
        </section>

        <section className="result-card">
          <p className="eyebrow">Read and print</p>
          <h3>Open printable report</h3>
          <p>
            Open the detailed report view when you want complete schedules, printable charts, and tax/account detail.
            It may look more detailed than this guided Results page while the report experience is being polished.
          </p>
          <a
            className={`button ${hasBlockers ? 'disabled-link' : ''}`}
            href={hasBlockers ? undefined : printableReportUrlForPlan(extractPlanPayload(plan))}
            aria-disabled={hasBlockers}
          >
            Open printable report
          </a>
        </section>
      </div>
    </div>
  );
}

function ResultsReadinessPanel({
  compact = false,
  rows,
  summary
}: {
  compact?: boolean;
  rows: ReturnType<typeof selectResultsReadinessRows>;
  summary: ReturnType<typeof selectResultsReadinessSummary>;
}) {
  const visibleRows = compact ? rows.filter((row) => row.status !== 'ready').slice(0, 4) : rows;

  return (
    <section className={`results-readiness-panel readiness-${summary.status}`}>
      <div>
        <p className="eyebrow">Final readiness</p>
        <h3>{summary.headline}</h3>
        <p>{summary.detail}</p>
      </div>
      <div className="summary-grid">
        <Metric label="Recommended path" value={summary.recommendedLabel} />
        <Metric label="Ready" value={String(summary.readyCount)} />
        <Metric label="Review" value={String(summary.reviewCount)} />
        <Metric label="Blocked" value={String(summary.blockedCount)} />
        <Metric label="Save" value={summary.saveStatus} />
      </div>
      {visibleRows.length > 0 ? (
        <div className="readiness-row-list">
          {visibleRows.map((row) => (
            <section className={`readiness-row readiness-row-${row.status}`} key={row.id}>
              <div>
                <small>{row.status}</small>
                <h3>{row.label}</h3>
                <p>{row.detail}</p>
                <p className="table-note">{row.action}</p>
              </div>
              <dl className="mini-ledger">
                <div>
                  <dt>Priority</dt>
                  <dd>{row.priority}</dd>
                </div>
                <div>
                  <dt>Review</dt>
                  <dd>{resultsSectionTitle(row.detailArea)}</dd>
                </div>
              </dl>
            </section>
          ))}
        </div>
      ) : (
        <p className="table-note">No review or blocker rows are visible in the first-pass readiness checks.</p>
      )}
      {compact ? <p className="table-note">Use Save & print for the full readiness handoff.</p> : null}
    </section>
  );
}

function AnnualDetailPanel({
  loading,
  portfolioSeries,
  rows,
  spendingTaxSeries,
  summary
}: {
  loading: boolean;
  portfolioSeries: ReturnType<typeof selectPortfolioChartSeries>;
  rows: ReturnType<typeof selectAnnualDetailRows>;
  spendingTaxSeries: ReturnType<typeof selectSpendingTaxChartSeries>;
  summary: ReturnType<typeof selectAnnualDetailSummary>;
}) {
  const [view, setView] = useState<AnnualDetailView>('summary');
  const viewOptions: Array<{ id: AnnualDetailView; label: string }> = [
    { id: 'summary', label: 'Summary' },
    { id: 'income', label: 'Income' },
    { id: 'withdrawals', label: 'Withdrawals' },
    { id: 'tax', label: 'Tax' },
    { id: 'balances', label: 'Balances' }
  ];
  const columns = annualDetailColumns(view);

  return (
    <div className="annual-detail-panel">
      <div className="summary-grid">
        <Metric
          label="Projection years"
          value={
            summary.firstYear && summary.finalYear
              ? `${summary.firstYear}-${summary.finalYear} (${summary.totalYears})`
              : loading
                ? 'Calculating'
                : '-'
          }
        />
        <Metric label="Funded years" value={`${summary.fundedYears}/${summary.totalYears || 0}`} />
        <Metric label="First shortfall" value={summary.firstShortfallYear ? String(summary.firstShortfallYear) : 'None'} />
        <Metric label="End portfolio" value={formatMoney(summary.endPortfolio)} />
      </div>

      <div className="chart-grid">
        <ChartPanel
          chartData={portfolioChartData(portfolioSeries)}
          emptyText={loading ? 'Calculating portfolio chart' : 'No portfolio chart rows available'}
          title="Portfolio over time"
        />
        <ChartPanel
          chartData={spendingTaxChartData(spendingTaxSeries)}
          emptyText={loading ? 'Calculating spending chart' : 'No spending chart rows available'}
          title="Spending, tax, and shortfall"
        />
      </div>

      <div className="annual-detail-toolbar">
        <div className="segmented-control" role="group" aria-label="Annual detail table view">
          {viewOptions.map((option) => (
            <button
              className={view === option.id ? 'selected' : ''}
              key={option.id}
              type="button"
              onClick={() => setView(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="result-table-wrap annual-detail-table-wrap">
        <table className="result-table annual-detail-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.id}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <tr className={row.reconciliationStatus === 'warning' ? 'warning-row' : ''} key={row.year}>
                  {columns.map((column) => (
                    <td className={annualDetailCellClass(column.id, row)} key={column.id}>
                      {annualDetailCellValue(column.id, row)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length}>{loading ? 'Calculating annual detail' : 'No annual projection rows available'}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="table-note">
        Showing all {rows.length} projection years. Printable charts and deeper audit tables remain in the detailed
        report.
      </p>
    </div>
  );
}

type LineChartData = {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    borderDash?: number[];
    borderWidth?: number;
    fill?: boolean;
    pointRadius?: number;
    tension?: number;
  }>;
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index' as const,
    intersect: false
  },
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        boxWidth: 12,
        boxHeight: 12,
        usePointStyle: true
      }
    },
    tooltip: {
      callbacks: {
        label: (context: TooltipItem<'line'>) => {
          const label = context.dataset.label || 'Value';
          return `${label}: ${formatMoney(context.parsed.y ?? 0)}`;
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: '#edf1eb'
      }
    },
    y: {
      ticks: {
        callback: (value: string | number) => formatMoney(Number(value))
      },
      grid: {
        color: '#edf1eb'
      }
    }
  }
};

function ChartPanel({ chartData, emptyText, title }: { chartData: LineChartData; emptyText: string; title: string }) {
  return (
    <section className="chart-panel">
      <h3>{title}</h3>
      {chartData.labels.length > 0 ? (
        <div className="chart-frame">
          <Line data={chartData} options={chartOptions} />
        </div>
      ) : (
        <p className="table-note">{emptyText}</p>
      )}
    </section>
  );
}

function portfolioChartData(rows: ReturnType<typeof selectPortfolioChartSeries>): LineChartData {
  return {
    labels: rows.map((row) => String(row.year)),
    datasets: [
      {
        label: 'Portfolio',
        data: rows.map((row) => row.portfolio),
        borderColor: '#2f6f55',
        backgroundColor: 'rgba(47, 111, 85, 0.16)',
        fill: true,
        pointRadius: 1,
        tension: 0.25
      }
    ]
  };
}

function spendingTaxChartData(rows: ReturnType<typeof selectSpendingTaxChartSeries>): LineChartData {
  return {
    labels: rows.map((row) => String(row.year)),
    datasets: [
      {
        label: 'After-tax spending',
        data: rows.map((row) => row.afterTaxSpending),
        borderColor: '#243b53',
        backgroundColor: 'rgba(36, 59, 83, 0.14)',
        pointRadius: 1,
        tension: 0.25
      },
      {
        label: 'Tax',
        data: rows.map((row) => row.tax),
        borderColor: '#b77a22',
        backgroundColor: 'rgba(183, 122, 34, 0.14)',
        pointRadius: 1,
        tension: 0.25
      },
      {
        label: 'Shortfall',
        data: rows.map((row) => row.shortfall),
        borderColor: '#a43b2f',
        backgroundColor: 'rgba(164, 59, 47, 0.14)',
        borderDash: [5, 5],
        pointRadius: 1,
        tension: 0.2
      }
    ]
  };
}

function accountBucketChartData(rows: ReturnType<typeof selectAccountBucketChartSeries>): LineChartData {
  type AccountBucketChartRow = ReturnType<typeof selectAccountBucketChartSeries>[number];
  return {
    labels: rows.map((row: AccountBucketChartRow) => String(row.year)),
    datasets: [
      {
        label: 'RRSP/RRIF',
        data: rows.map((row: AccountBucketChartRow) => row.rrsp),
        borderColor: '#243b53',
        backgroundColor: 'rgba(36, 59, 83, 0.12)',
        pointRadius: 1,
        tension: 0.25
      },
      {
        label: 'TFSA',
        data: rows.map((row: AccountBucketChartRow) => row.tfsa),
        borderColor: '#2f6f55',
        backgroundColor: 'rgba(47, 111, 85, 0.12)',
        pointRadius: 1,
        tension: 0.25
      },
      {
        label: 'LIF',
        data: rows.map((row: AccountBucketChartRow) => row.lif),
        borderColor: '#6d5fb8',
        backgroundColor: 'rgba(109, 95, 184, 0.12)',
        pointRadius: 1,
        tension: 0.25
      },
      {
        label: 'Non-registered',
        data: rows.map((row: AccountBucketChartRow) => row.nonRegistered),
        borderColor: '#b77a22',
        backgroundColor: 'rgba(183, 122, 34, 0.12)',
        pointRadius: 1,
        tension: 0.25
      },
      {
        label: 'Cash',
        data: rows.map((row: AccountBucketChartRow) => row.cash),
        borderColor: '#64736d',
        backgroundColor: 'rgba(100, 115, 109, 0.12)',
        pointRadius: 1,
        tension: 0.25
      },
      {
        label: 'Total',
        data: rows.map((row: AccountBucketChartRow) => row.total),
        borderColor: '#17211f',
        backgroundColor: 'rgba(23, 33, 31, 0.12)',
        borderWidth: 3,
        pointRadius: 1,
        tension: 0.25
      }
    ]
  };
}

function annualDetailColumns(view: AnnualDetailView): Array<{ id: keyof ReturnType<typeof selectAnnualDetailRows>[number]; label: string }> {
  const base: Array<{ id: keyof ReturnType<typeof selectAnnualDetailRows>[number]; label: string }> = [
    { id: 'year', label: 'Year' },
    { id: 'ages', label: 'Age(s)' }
  ];
  const columnsByView: Record<AnnualDetailView, Array<{ id: keyof ReturnType<typeof selectAnnualDetailRows>[number]; label: string }>> = {
    summary: [
      { id: 'spending', label: 'Spending' },
      { id: 'afterTaxSpending', label: 'After-tax spending' },
      { id: 'fundingBeforeTax', label: 'Funding before tax' },
      { id: 'tax', label: 'Tax' },
      { id: 'shortfall', label: 'Shortfall' },
      { id: 'portfolio', label: 'Portfolio' }
    ],
    income: [
      { id: 'salary', label: 'Salary' },
      { id: 'dbPension', label: 'DB pension' },
      { id: 'cpp', label: 'CPP' },
      { id: 'oas', label: 'OAS' },
      { id: 'fundingBeforeTax', label: 'Funding before tax' }
    ],
    withdrawals: [
      { id: 'registeredWithdrawals', label: 'Registered' },
      { id: 'tfsaWithdrawals', label: 'TFSA' },
      { id: 'nonRegisteredWithdrawals', label: 'Non-reg' },
      { id: 'cashWedgeWithdrawals', label: 'Cash wedge' },
      { id: 'otherInflows', label: 'Other inflows' }
    ],
    tax: [
      { id: 'taxableIncome', label: 'Taxable income' },
      { id: 'tax', label: 'Tax' },
      { id: 'effectiveRate', label: 'Effective rate' },
      { id: 'oasClawback', label: 'OAS clawback' },
      { id: 'reconciliationGap', label: 'Reconciliation gap' }
    ],
    balances: [
      { id: 'rrsp', label: 'RRSP/RRIF' },
      { id: 'tfsa', label: 'TFSA' },
      { id: 'lif', label: 'LIF' },
      { id: 'nonRegistered', label: 'Non-reg' },
      { id: 'cash', label: 'Cash' },
      { id: 'total', label: 'Total' }
    ]
  };
  return [...base, ...columnsByView[view]];
}

function annualDetailCellValue(
  columnId: keyof ReturnType<typeof selectAnnualDetailRows>[number],
  row: ReturnType<typeof selectAnnualDetailRows>[number]
): string {
  if (columnId === 'year') return String(row.year);
  if (columnId === 'ages') return row.ages;
  if (columnId === 'effectiveRate') return formatPercent(row.effectiveRate);
  const value = row[columnId];
  return typeof value === 'number' ? formatMoney(value) : String(value);
}

function annualDetailCellClass(
  columnId: keyof ReturnType<typeof selectAnnualDetailRows>[number],
  row: ReturnType<typeof selectAnnualDetailRows>[number]
): string {
  if (columnId === 'shortfall') return row.shortfall > 1 ? 'bad-value' : 'ok-value';
  if (columnId === 'reconciliationGap') return Math.abs(row.reconciliationGap) > 1 ? 'bad-value' : 'ok-value';
  return '';
}

function IncomeSourcesPanel({
  loading,
  rows
}: {
  loading: boolean;
  rows: ReturnType<typeof selectIncomeSourceRows>;
}) {
  type IncomeSourceResultRow = ReturnType<typeof selectIncomeSourceRows>[number];
  const activeRows = rows.filter(
    (row: IncomeSourceResultRow) => Math.round(row.firstYearAmount) !== 0 || Math.round(row.lifetimeAmount) !== 0
  );
  const taxableLifetime = rows
    .filter((row: IncomeSourceResultRow) => row.taxable)
    .reduce((total: number, row: IncomeSourceResultRow) => total + row.lifetimeAmount, 0);
  const flexibleLifetime = rows
    .filter((row: IncomeSourceResultRow) => !row.taxable)
    .reduce((total: number, row: IncomeSourceResultRow) => total + row.lifetimeAmount, 0);
  const firstYearTotal = rows.reduce((total: number, row: IncomeSourceResultRow) => total + row.firstYearAmount, 0);

  return (
    <div className="income-sources-panel">
      <div className="summary-grid">
        <Metric label="First-year sources" value={loading ? 'Calculating' : formatMoney(firstYearTotal)} />
        <Metric label="Lifetime taxable" value={formatMoney(taxableLifetime)} />
        <Metric label="Lifetime flexible" value={formatMoney(flexibleLifetime)} />
      </div>

      <div className="result-table-wrap">
        <table className="result-table">
          <thead>
            <tr>
              <th>Source</th>
              <th>First year</th>
              <th>Lifetime</th>
              <th>Tax treatment</th>
            </tr>
          </thead>
          <tbody>
            {activeRows.length > 0 ? (
              activeRows.map((row: IncomeSourceResultRow) => (
                <tr key={row.id}>
                  <td>{row.label}</td>
                  <td>{formatMoney(row.firstYearAmount)}</td>
                  <td>{formatMoney(row.lifetimeAmount)}</td>
                  <td>{row.taxable ? 'Taxable' : 'Flexible / after-tax'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>{loading ? 'Calculating' : 'No income sources available'}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CashFlowResultsPanel({
  diagnostics,
  loading,
  rows
}: {
  diagnostics: ReturnType<typeof selectReconciliationDiagnostics>;
  loading: boolean;
  rows: ReturnType<typeof selectCashFlowReconciliationRows>;
}) {
  type CashFlowResultRow = ReturnType<typeof selectCashFlowReconciliationRows>[number];
  const visibleRows = rows.slice(0, 12);

  return (
    <div className="cash-flow-panel">
      <div className="summary-grid">
        <Metric label="Rows checked" value={loading ? 'Calculating' : String(diagnostics.rowsChecked || '-')} />
        <Metric label="Reconciliation warnings" value={String(diagnostics.warningCount)} />
        <Metric label="First warning year" value={diagnostics.firstWarningYear ? String(diagnostics.firstWarningYear) : '-'} />
        <Metric label="Max funding gap" value={formatSignedMoney(diagnostics.maxReconciliationGap)} />
        <Metric label="Max unexplained gap" value={formatSignedMoney(diagnostics.maxCashFlowDelta)} />
      </div>

      <div className="result-table-wrap">
        <table className="result-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Funding before tax</th>
              <th>Tax</th>
              <th>After-tax spending</th>
              <th>Gap</th>
              <th>Unexplained gap</th>
              <th>Portfolio</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.length > 0 ? (
              visibleRows.map((row: CashFlowResultRow) => (
                <tr className={row.status === 'warning' ? 'warning-row' : ''} key={row.year || 'empty'}>
                  <td>{row.year}</td>
                  <td>{formatMoney(row.fundingBeforeTax)}</td>
                  <td>-{formatMoney(row.tax)}</td>
                  <td>{formatMoney(row.afterTaxSpending)}</td>
                  <td className={Math.abs(row.reconciliationDelta) > 1 ? 'bad-value' : 'ok-value'}>
                    {formatSignedMoney(row.reconciliationDelta)}
                  </td>
                  <td className={Math.abs(row.cashFlowDelta) > 1 ? 'bad-value' : 'ok-value'}>
                    {formatSignedMoney(row.cashFlowDelta)}
                  </td>
                  <td>{formatMoney(row.portfolio)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7}>{loading ? 'Calculating' : 'No simulation rows available'}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {rows.length > visibleRows.length ? (
        <p className="table-note">Showing the first {visibleRows.length} years. Full annual detail remains in the detailed report.</p>
      ) : null}
    </div>
  );
}

function ValidationPanel({ validation }: { validation: PlanValidationResult }) {
  if (validation.blockers.length === 0 && validation.warnings.length === 0) {
    return (
      <div className="validation-panel ok">
        <strong>Validation clear</strong>
        <span>No blocking issues or warnings found in the current plan.</span>
      </div>
    );
  }

  return (
    <div className="validation-panel">
      {validation.blockers.length > 0 ? (
        <div>
          <strong>Blocking issues</strong>
          <ul>
            {validation.blockers.map((issue) => (
              <li key={issue.code}>
                <span>{issue.field}</span>
                {issue.message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {validation.warnings.length > 0 ? (
        <div>
          <strong>Warnings</strong>
          <ul>
            {validation.warnings.map((issue) => (
              <li key={issue.code}>
                <span>{issue.field}</span>
                {issue.message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function validationStepForField(field: string): IntakeStepId {
  const normalized = field.toLowerCase();
  if (normalized === 'household') return 'household';
  if (normalized === 'income') return 'income';
  if (normalized === 'accounts') return 'accounts';
  if (normalized === 'real estate') return 'realEstate';
  if (normalized === 'debts') return 'debts';
  if (normalized === 'spending') return 'spending';
  if (normalized === 'assumptions') return 'assumptions';
  return 'review';
}

type IntakeValidationIssue = PlanValidationResult['blockers'][number] & { severity: 'blocker' | 'warning' };

function validationIssuesForStep(validation: PlanValidationResult | null, step: IntakeStepId): IntakeValidationIssue[] {
  if (!validation || step === 'review') return [];
  const blockers = validation.blockers
    .filter((issue) => validationStepForField(issue.field) === step)
    .map((issue) => ({ ...issue, severity: 'blocker' as const }));
  const warnings = validation.warnings
    .filter((issue) => validationStepForField(issue.field) === step)
    .map((issue) => ({ ...issue, severity: 'warning' as const }));
  return [...blockers, ...warnings];
}

function validationIssueCountForStep(validation: PlanValidationResult | null, step: IntakeStepId): { blockers: number; warnings: number } {
  if (!validation) return { blockers: 0, warnings: 0 };
  if (step === 'review') {
    return { blockers: validation.blockers.length, warnings: validation.warnings.length };
  }
  return {
    blockers: validation.blockers.filter((issue) => validationStepForField(issue.field) === step).length,
    warnings: validation.warnings.filter((issue) => validationStepForField(issue.field) === step).length
  };
}

function SectionValidationSummary({ issues }: { issues: IntakeValidationIssue[] }) {
  const blockerCount = issues.filter((issue) => issue.severity === 'blocker').length;
  return (
    <div className={`section-validation-summary ${blockerCount > 0 ? 'has-blockers' : 'has-warnings'}`}>
      <strong>{blockerCount > 0 ? 'Fix this section before results' : 'Review this section'}</strong>
      <ul>
        {issues.map((issue) => (
          <li key={issue.code}>
            <span>{issue.severity}</span>
            {issue.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Metric({ label, value, valueClass = '' }: { label: string; value: string; valueClass?: string }) {
  return (
    <div>
      <span>{label}</span>
      <strong className={valueClass}>{value}</strong>
    </div>
  );
}

function stepCopy(step: IntakeStepId, plan: V2PlanPayload): string {
  const p1Name = plan.p1.name || 'Person 1';
  switch (step) {
    case 'household':
      return `Tell the planner who this retirement plan supports. Current primary person: ${p1Name}.`;
    case 'income':
      return 'Add work income, pensions, CPP, OAS, and survivor estimates so Results can show how much spending is supported.';
    case 'accounts':
      return 'Add savings and investment balances by owner so withdrawals, taxes, and future estate values can be reviewed clearly.';
    case 'realEstate':
      return 'Enter expected cash from a future home sale or downsize only if it is part of the retirement plan.';
    case 'debts':
      return 'Add mortgage or line-of-credit payments that may reduce retirement spending room.';
    case 'spending':
      return 'Tell the planner what lifestyle you want to fund, which large one-time goals matter, and whether leaving money is intentional.';
    case 'assumptions':
      return 'Set the planning horizon, return and inflation assumptions, and optional tax or withdrawal strategy choices.';
    case 'review':
      return 'Check the plan inputs, save your local plan file, and generate Results.';
    default:
      return '';
  }
}

function stepStatusCopy(step: IntakeStepId): string {
  if (step === 'realEstate') {
    return 'Enter only the net cash you expect a future home sale or downsize to add to retirement spending.';
  }
  return 'This step is ready for review.';
}
