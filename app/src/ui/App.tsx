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
  selectFundingSourceRows,
  selectIncomeSourceRows,
  selectOverviewMetrics,
  selectPlanHealthExplainer,
  selectPortfolioChartSeries,
  selectProjectionMilestones,
  selectRecommendedPath,
  selectReconciliationDiagnostics,
  selectResultsReadinessRows,
  selectResultsReadinessSummary,
  selectScenarioCards,
  selectScenarioComparisonRows,
  selectScenarioAssumptionRows,
  selectSourceReconciliationStory,
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
} from '../engine/resultSelectors';
import { PlanPerson, SimulationResult, V2PlanPayload } from '../types/plan';

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
  lastExportedAt: string;
};

type WorkspaceAction =
  | { type: 'newPlan' }
  | { type: 'openPlan'; plan: V2PlanPayload; label: string }
  | { type: 'updatePlan'; plan: V2PlanPayload }
  | { type: 'setHouseholdMode'; mode: 'single' | 'couple'; plan?: V2PlanPayload }
  | { type: 'setView'; view: WorkspaceView }
  | { type: 'setStep'; step: IntakeStepId }
  | { type: 'setResultsSection'; section: ResultsWorkspaceSection }
  | { type: 'setError'; error: string }
  | { type: 'markExported'; exportedAt: string };

type BridgePreview = {
  result: SimulationResult | null;
  scenarios: Partial<Record<'retireLater' | 'spendLessGogo' | 'delayBenefits', SimulationResult>>;
  survivor: SimulationResult | null;
  error: string;
  loading: boolean;
};

const intakeSteps: Array<{ id: IntakeStepId; label: string; helper: string }> = [
  { id: 'household', label: 'Household', helper: 'People, ages, retirement timing' },
  { id: 'income', label: 'Income', helper: 'Salary, DB pensions, CPP, OAS' },
  { id: 'accounts', label: 'Accounts', helper: 'RRSP, TFSA, LIF, non-registered, cash' },
  { id: 'realEstate', label: 'Real Estate', helper: 'Primary home and downsize' },
  { id: 'debts', label: 'Debts', helper: 'Mortgage and LOC cash-flow impact' },
  { id: 'spending', label: 'Spending', helper: 'Lifestyle phases, one-offs, estate target' },
  { id: 'assumptions', label: 'Assumptions', helper: 'Return, inflation, tax strategy choices' },
  { id: 'review', label: 'Review', helper: 'Validate, save, generate results' }
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
  lastExportedAt: ''
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
        lastExportedAt: ''
      };
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
        lastExportedAt: ''
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
    case 'markExported':
      return { ...state, dirty: false, lastExportedAt: action.exportedAt };
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

function resultsSectionTitle(section: ResultsWorkspaceSection): string {
  return resultsWorkspaceMap.find((item) => item.id === section)?.label || 'Overview';
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
    survivor: null,
    error: '',
    loading: false
  });
  const { plan } = state;

  const domainPlan = useMemo(() => (plan ? fromV2Payload(plan) : null), [plan]);
  const validation = useMemo(() => (plan ? validatePlanForGuidedIntake(plan) : null), [plan]);
  useEffect(() => {
    let cancelled = false;
    if (!plan || (state.view !== 'review' && state.view !== 'results')) {
      setBridgePreview({ result: null, scenarios: {}, survivor: null, error: '', loading: false });
      return;
    }

    setBridgePreview((current) => ({ ...current, loading: true, error: '' }));
    import('../engine/runSimulation')
      .then(({ runSimulation }) => {
        const baselineConfig = {
          cppAgeF: 65,
          cppAgeM: 65,
          oasAgeF: 65,
          oasAgeM: 65,
          meltdown: false,
          returnRate: 0.05,
          pensionSplit: false,
          p1Dies: null,
          withdrawalOrder: plan.assumptions.withdrawalOrder || 'default'
        } as const;
        const result = runSimulation(plan, baselineConfig);
        const retireLaterPlan = extractPlanPayload(plan);
        const retireLaterYear = (retireLaterPlan.assumptions.retireYear || retireLaterPlan.p1.retireYear || 0) + 2;
        if (retireLaterYear > 2) retireLaterPlan.assumptions.retireYear = retireLaterYear;
        if (retireLaterPlan.p1.retireYear) retireLaterPlan.p1.retireYear += 2;
        if (!p2LooksBlank(retireLaterPlan.p2) && retireLaterPlan.p2.retireYear) retireLaterPlan.p2.retireYear += 2;

        const spendLessPlan = extractPlanPayload(plan);
        spendLessPlan.spending.gogo = Math.round((spendLessPlan.spending.gogo || 0) * 0.9);

        const scenarios = {
          retireLater: runSimulation(retireLaterPlan, baselineConfig),
          spendLessGogo: runSimulation(spendLessPlan, baselineConfig),
          delayBenefits: runSimulation(plan, { ...baselineConfig, cppAgeF: 70, cppAgeM: 70, oasAgeF: 70, oasAgeM: 70 })
        };
        const survivor =
          !p2LooksBlank(plan.p2) && plan.assumptions.p1DiesInSurvivor
            ? runSimulation(plan, { ...baselineConfig, p1Dies: plan.assumptions.p1DiesInSurvivor })
            : null;
        if (!cancelled) setBridgePreview({ result, scenarios, survivor, error: '', loading: false });
      })
      .catch((err) => {
        if (!cancelled) {
          setBridgePreview({
            result: null,
            scenarios: {},
            survivor: null,
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

  function downloadNormalizedPlan() {
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
    dispatch({ type: 'markExported', exportedAt: new Date().toLocaleString() });
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Sprint 5 React preview</p>
          <h1>Canadian Retirement Planner</h1>
        </div>
        <nav className="top-actions" aria-label="Stable app links">
          <a className="button secondary" href={stableIntakeUrl()}>
            Open stable intake
          </a>
          <a className="button secondary" href={stableDashboardUrl()}>
            Open stable dashboard
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
          <span>Save state</span>
          <strong>{state.dirty ? 'Unsaved local changes' : state.lastExportedAt ? `Exported ${state.lastExportedAt}` : 'No changes'}</strong>
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
            <span>Results handoff</span>
            <small>Preview and stable dashboard</small>
          </button>
        </aside>

        <section className="workspace-main">
          {state.view === 'start' ? (
            <StartPanel error={state.error} onFileChange={onFileChange} onNewPlan={() => dispatch({ type: 'newPlan' })} />
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
              onDownload={downloadNormalizedPlan}
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
              onDownload={downloadNormalizedPlan}
              onSection={(section) => dispatch({ type: 'setResultsSection', section })}
              plan={plan}
              result={bridgePreview.result}
              scenarios={bridgePreview.scenarios}
              survivor={bridgePreview.survivor}
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
  onFileChange,
  onNewPlan
}: {
  error: string;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onNewPlan: () => void;
}) {
  return (
    <section className="page-grid">
      <div className="intro-panel">
        <p className="eyebrow">Home / Start</p>
        <h2>Build a local retirement plan</h2>
        <p>
          Start a new plan or open a `.plan.json` file from your device. This preview uses the hybrid model:
          guided setup first, then a workspace for review and results handoff.
        </p>
        <div className="actions">
          <button type="button" onClick={onNewPlan}>
            New local plan
          </button>
          <label className="button file-picker">
            <input type="file" accept=".plan.json,.json,application/json" onChange={onFileChange} />
            Open .plan.json
          </label>
        </div>
        {error ? <p className="error">{error}</p> : null}
      </div>

      <div className="panel">
        <p className="eyebrow">Local-first boundary</p>
        <h3>No account. No upload. No cloud sync.</h3>
        <p>
          Durable save remains a user-controlled `.plan.json` file. The stable static app stays available while the
          guided intake reaches parity.
        </p>
        <ul className="clean-list">
          <li>Ontario 2026 tax assumptions</li>
          <li>Runtime dashboard schema stays at v2</li>
          <li>ProjectionLab-inspired workflow, not account infrastructure</li>
        </ul>
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
            <span>LIRA balance</span>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(person.lira, blankZero)}
              onChange={(event) => onChange('lira', event.target.value)}
              placeholder="0"
            />
          </label>
          <label className="field">
            <span>LIF balance</span>
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
        <legend>Primary residence / downsize</legend>
        <p>
          Schema v2 safely supports only the net proceeds and year for a future primary-residence sale or downsize.
          Current home value and second/vacation property records wait for a scoped schema update.
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
            <span>Net proceeds</span>
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
        <strong>Deferred property detail</strong>
        <span>
          Primary residence value, second/vacation property, ownership, and sale-cost detail are intentionally not
          collected here because they do not fit the current v2 plan-file schema.
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
        <legend>Spending phases</legend>
        <div className="field-row three">
          <label className="field">
            <span>Go-go annual</span>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(plan.spending.gogo)}
              onChange={(event) => updateSpending('gogo', event.target.value)}
              placeholder="80000"
            />
          </label>
          <label className="field">
            <span>Go-go ends age</span>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(plan.spending.gogoEnd)}
              onChange={(event) => updateSpending('gogoEnd', event.target.value)}
              placeholder="75"
            />
          </label>
          <label className="field">
            <span>Slow-go annual</span>
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
            <span>Slow-go ends age</span>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(plan.spending.slowgoEnd)}
              onChange={(event) => updateSpending('slowgoEnd', event.target.value)}
              placeholder="85"
            />
          </label>
          <label className="field">
            <span>No-go annual</span>
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
        <label className="field full">
          <span>Inheritance / bequest target</span>
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
        <label className="field full">
          <span>Withdrawal order</span>
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
          </label>
          <label className={`toggle-row ${!coupleMode ? 'disabled' : ''}`}>
            <input
              checked={Boolean(plan.assumptions.youngerSpouseRrif)}
              disabled={!coupleMode}
              type="checkbox"
              onChange={(event) => updateAssumption('youngerSpouseRrif', event.target.checked, 'boolean')}
            />
            <span>Use younger spouse age for RRIF minimum</span>
          </label>
          <label className={`toggle-row ${!coupleMode ? 'disabled' : ''}`}>
            <input checked={spousalRrspOn} disabled={!coupleMode} type="checkbox" onChange={(event) => toggleSpousalRrsp(event.target.checked)} />
            <span>Spousal RRSP attribution</span>
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
        <label className="field full">
          <span>Person 1 dies in year</span>
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
          Optional monthly survivor CPP estimates for the survivor scenario. These stay inactive for single-person
          plans.
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
  helper = 'Salary, pension, CPP, and OAS inputs for this person.',
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
      </div>

      <div className="field-section">
        <strong>CPP and OAS estimates</strong>
        <div className="field-row three">
          <label className="field">
            <span>CPP 65 monthly</span>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(person.cpp65_monthly, blankZero)}
              onChange={(event) => onChange('cpp65_monthly', event.target.value)}
              placeholder="1268"
            />
          </label>
          <label className="field">
            <span>CPP 70 monthly</span>
            <input
              inputMode="numeric"
              type="number"
              value={displayNumber(person.cpp70_monthly, blankZero)}
              onChange={(event) => onChange('cpp70_monthly', event.target.value)}
              placeholder="1800"
            />
          </label>
          <label className="field">
            <span>OAS monthly</span>
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
          helper="Primary person for retirement timing and dashboard handoff."
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
          Continue to results handoff
        </button>
        <button className="ghost" type="button" onClick={onDownload}>
          Save .plan.json
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
          ['CPP 65 monthly', formatMoney(sumPeople(plan, 'cpp65_monthly'))],
          ['OAS monthly', formatMoney(sumPeople(plan, 'oas_monthly'))]
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
          ['Go-go / slow-go / no-go', `${formatMoney(plan.spending.gogo)} / ${formatMoney(plan.spending.slowgo)} / ${formatMoney(plan.spending.nogo)}`],
          ['One-time expenses', String((plan.oneOffs || []).length)],
          ['Bequest target', formatMoney(plan.inheritance)]
        ]}
      />
      <ReviewSummaryCard
        title="Assumptions"
        rows={[
          ['Plan end', String(plan.assumptions.planEnd || '-')],
          ['Return / inflation', `${formatPercent(plan.assumptions.returnRate)} / ${formatPercent(plan.assumptions.inflation)}`],
          ['Withdrawal order', plan.assumptions.withdrawalOrder || 'default']
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
  survivor,
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
  survivor: BridgePreview['survivor'];
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
  const scenarioCards = selectScenarioCards(result, plan, scenarios);
  const scenarioComparisonRows = selectScenarioComparisonRows(result, scenarios);
  const scenarioAssumptionRows = selectScenarioAssumptionRows(plan);
  const survivorSummary = selectSurvivorViewSummary(result, plan);
  const survivorComparison = selectSurvivorComparison(result, survivor, plan);
  const survivorStory = selectSurvivorStorySummary(result, survivor, plan);
  const survivorReviewRows = selectSurvivorReviewRows(result, survivor, plan);
  const recommendedPath = selectRecommendedPath(result, scenarios, survivor, plan, validation);
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
    'exportSave'
  ];
  const sectionTitle = resultsSectionTitle(activeSection);
  const intro = resultsSectionIntro(activeSection);
  return (
    <section className="results-workspace">
      <div className="results-nav" aria-label="Results workspace sections">
        {resultsWorkspaceMap.map((item) => {
          const implemented = implementedSections.includes(item.id);
          return (
            <button
              className={item.id === activeSection ? 'active' : ''}
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
            <div className="summary-grid">
              <Metric
                label="Projection"
                value={
                  overview.firstYear && overview.lastYear
                    ? `${overview.firstYear}-${overview.lastYear} (${overview.projectionYears} years)`
                    : loading
                      ? 'Calculating'
                      : '-'
                }
              />
              <Metric label="End portfolio" value={formatMoney(overview.endPortfolio)} />
              <Metric label="Dashboard schema" value="v2" />
            </div>

            <RecommendedPathPanel loading={loading} summary={recommendedPath} />
            <div className="result-section-label">Plan Health</div>
            <PlanHealthPanel health={planHealth} loading={loading} />
            <div className="result-section-label">Money Flow</div>
            <SourceStoryPanel story={sourceStory} />
            <div className="result-section-label">Decision Checks</div>
            <DecisionChecklistPanel items={decisionChecklist} />
            <DecisionDetailPanel rows={decisionDetailRows} />

            <div className="result-overview-grid">
              <section className="result-card">
                <h3>First-year reconciliation</h3>
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
                    <dt>Cash-flow delta</dt>
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

            <ProjectionPathPanel loading={loading} rows={projectionMilestones} />
            <ReconciliationDiagnosticsPanel diagnostics={reconciliationDiagnostics} loading={loading} />
            <TaxPressurePanel explanation={taxPressureExplanation} loading={loading} rows={taxPressureRows} />
            <div className="result-section-label">Scenario Tests</div>
            <ScenarioCardsPanel cards={scenarioCards} />
            <ScenarioAssumptionsPanel rows={scenarioAssumptionRows} />
            <ScenarioComparisonPanel loading={loading} rows={scenarioComparisonRows} />
            <div className="result-section-label">Household Resilience</div>
            <SurvivorSummaryPanel comparison={survivorComparison} summary={survivorSummary} />
            <ResultsReadinessPanel compact rows={readinessRows} summary={readinessSummary} />
          </>
        ) : (
          <DeferredResultsPanel section={sectionTitle} />
        )}

        {reconciliationWarning ? (
          <div className="validation-panel">
            <strong>Source reconciliation warning</strong>
            <span>
              First-year funding does not reconcile cleanly to after-tax spending. Use the stable dashboard before
              relying on this preview.
            </span>
          </div>
        ) : null}
        {overview.hasShortfall ? (
          <div className="validation-panel">
            <strong>Projection shortfall</strong>
            <span>At least one projection year reports a shortfall in the extracted simulation output.</span>
          </div>
        ) : null}
        {validation ? <ValidationPanel validation={validation} /> : null}
        {bridgeError ? <p className="error">{bridgeError}</p> : null}
        <div className="actions">
          <a
            className={`button ${hasBlockers ? 'disabled-link' : ''}`}
            href={hasBlockers ? undefined : stableDashboardUrlForPlan(extractPlanPayload(plan))}
            aria-disabled={hasBlockers}
          >
            Open stable dashboard
          </a>
          <button className="ghost" type="button" onClick={onDownload}>
            Save .plan.json
          </button>
        </div>
      </div>
    </section>
  );
}

function resultsSectionIntro(section: ResultsWorkspaceSection): { summary: string; handoff: string } {
  const stableHandoff = 'Use the stable dashboard for print/PDF, legacy audit views, and any detail not yet migrated to React.';
  switch (section) {
    case 'overview':
      return {
        summary:
          'Overview explains the current plan, recommended preview path, confidence checks, scenario comparisons, and household resilience in React.',
        handoff: stableHandoff
      };
    case 'annualDetail':
      return {
        summary: 'Annual Detail shows the full year-by-year projection with runtime charts and view controls.',
        handoff: 'Use the stable dashboard for print/PDF and legacy audit surfaces that still sit outside the React table.'
      };
    case 'cashFlow':
      return {
        summary: 'Cash Flow reconciles annual after-tax spending to income, withdrawals, cash wedge funding, other inflows, and tax.',
        handoff: 'Use the stable dashboard when you need the older complete cash-flow audit surface beside the React checks.'
      };
    case 'incomeSources':
      return {
        summary:
          'Income Sources groups taxable income, benefits, registered withdrawals, flexible withdrawals, cash wedge funding, and other inflows.',
        handoff: 'Use the stable dashboard for legacy source schedules or report-style inspection.'
      };
    case 'accounts':
      return {
        summary: 'Accounts shows projected account bucket balances, start/end summaries, and a runtime balance chart.',
        handoff: 'Use the stable dashboard for legacy account schedules, print/PDF, and any richer chart surfaces.'
      };
    case 'taxes':
      return {
        summary: 'Taxes summarizes taxable income, annual tax, effective rates, and OAS clawback from the engine rows.',
        handoff: 'Use the stable dashboard for full tax schedules, reporting, and legacy audit views.'
      };
    case 'stressTests':
      return {
        summary: 'Stress Tests combines baseline risk indicators, bounded scenario reruns, and household resilience detail in React.',
        handoff: 'Use the stable dashboard for full Monte Carlo, historical sequence, legacy charts, audit schedules, and print/PDF stress surfaces.'
      };
    case 'householdResilience':
      return {
        summary: 'Household Resilience compares the baseline projection with the survivor preview for two-person plans.',
        handoff: 'Use the stable dashboard for full survivor audit schedules, legacy charts, print/PDF, and report-style review.'
      };
    case 'assumptions':
      return {
        summary: 'Assumptions summarizes the v2 plan settings used by the preview run. Edits still happen in Guided Intake.',
        handoff: stableHandoff
      };
    case 'exportSave':
      return {
        summary: 'Export/Save keeps the local-first workflow explicit with a normalized v2 plan file and dashboard handoff.',
        handoff: 'No account, cloud sync, or persisted React result state is added here.'
      };
    default:
      return {
        summary: 'This React results tab is reserved for a bounded migrated result surface.',
        handoff: stableHandoff
      };
  }
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
        <p className="eyebrow">Recommended path</p>
        <h3>{loading ? 'Calculating strongest preview candidate' : summary.recommendedLabel}</h3>
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
          <p className="eyebrow">Selected-path stress context</p>
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
        <h3>What could break this plan?</h3>
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
        This is a bounded preview ranking with a runtime-only confidence layer, not a full optimizer or financial advice.
        Open the stable dashboard for complete annual detail before acting on a path.
      </p>
    </section>
  );
}

function RecommendedChecklistPanel({
  items
}: {
  items: ReturnType<typeof selectRecommendedPath>['checklistItems'];
}) {
  return (
    <section className="result-card recommended-checklist-panel">
      <div>
        <p className="eyebrow">Implementation checklist</p>
        <h3>Before you rely on this path</h3>
        <p>Runtime-only review steps from the selected-path evidence. This is not saved to the plan file.</p>
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
      <h3>Source reconciliation story{story.year ? ` (${story.year})` : ''}</h3>
      <p>{story.headline}</p>
      <div className="source-story-flow" aria-label="First-year source reconciliation flow">
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

function ScenarioCardsPanel({ cards }: { cards: ReturnType<typeof selectScenarioCards> }) {
  return (
    <section className="decision-panel">
      <h3>First scenario cards</h3>
      <div className="scenario-card-grid">
        {cards.map((card) => (
          <article className={`scenario-card scenario-${card.status}`} key={card.id}>
            <strong>{card.label}</strong>
            <span>{card.lever}</span>
            <small>{card.baseline}</small>
            {typeof card.endPortfolioDelta === 'number' ? (
              <small className={card.endPortfolioDelta >= 0 ? 'ok-value' : 'bad-value'}>
                End portfolio delta {formatSignedMoney(card.endPortfolioDelta)}
              </small>
            ) : null}
            {card.fundedThroughYear ? <small>Scenario funded through {card.fundedThroughYear}</small> : null}
            <p>{card.detail}</p>
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
      <p className="table-note">{summary.detail} Use Household Resilience for the fuller React review.</p>
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
        <h3>Stable dashboard fallback</h3>
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
      <h3>Source reconciliation diagnostics</h3>
      <div className="summary-grid">
        <Metric label="Rows checked" value={loading ? 'Calculating' : String(diagnostics.rowsChecked || '-')} />
        <Metric label="Warnings" value={String(diagnostics.warningCount)} />
        <Metric label="First warning year" value={diagnostics.firstWarningYear ? String(diagnostics.firstWarningYear) : '-'} />
        <Metric label="Max funding gap" value={formatSignedMoney(diagnostics.maxReconciliationGap)} />
        <Metric label="Max cash-flow delta" value={formatSignedMoney(diagnostics.maxCashFlowDelta)} />
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
      <strong>{section} stays in the stable dashboard for now.</strong>
      <span>
        This React tab is reserved in the Sprint 6 navigation shell, but detailed results remain in the stable dashboard
        until this panel is migrated and parity-tested.
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
        <p className="table-note">Showing the first {visibleRows.length} years. Full tax detail remains in the stable dashboard.</p>
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
          <p className="eyebrow">Bounded scenario tests</p>
          <h3>Compare the main fragility levers</h3>
          <p>
            These local reruns keep the stress read close to the baseline without changing the saved plan or replacing the
            stable dashboard stress tools.
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
    ['Withdrawal order', plan.assumptions.withdrawalOrder || 'default'],
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
          <h3>Local plan file</h3>
          <dl className="result-ledger">
            <div>
              <dt>Schema</dt>
              <dd>v{plan.schemaVersion}</dd>
            </div>
            <div>
              <dt>Plan title</dt>
              <dd>{plan.title || 'Not named yet'}</dd>
            </div>
            <div>
              <dt>Save readiness</dt>
              <dd>{readinessSummary.saveStatus}</dd>
            </div>
            <div>
              <dt>Storage</dt>
              <dd>Local .plan.json</dd>
            </div>
          </dl>
          <p>{readinessSummary.detail}</p>
          <button className="ghost" type="button" onClick={onDownload} disabled={readinessSummary.saveStatus === 'blocked'}>
            Save .plan.json
          </button>
        </section>

        <section className="result-card">
          <h3>Dashboard fallback</h3>
          <p>
            {readinessSummary.stableDashboardHandoff} Use it to inspect any confidence, readiness, or break-plan item
            before relying on the React preview.
          </p>
          <a
            className={`button ${hasBlockers ? 'disabled-link' : ''}`}
            href={hasBlockers ? undefined : stableDashboardUrlForPlan(extractPlanPayload(plan))}
            aria-disabled={hasBlockers}
          >
            Open stable dashboard
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
        <p className="table-note">No review or blocker rows are visible in the bounded React readiness checks.</p>
      )}
      {compact ? <p className="table-note">Use Export/Save for the full readiness handoff.</p> : null}
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
        Showing all {rows.length} projection years in React. Charts, print/PDF, and legacy audit surfaces remain in the
        stable dashboard.
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
        <Metric label="Max cash-flow delta" value={formatSignedMoney(diagnostics.maxCashFlowDelta)} />
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
              <th>Cash-flow delta</th>
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
        <p className="table-note">Showing the first {visibleRows.length} years. Full annual detail remains in the stable dashboard.</p>
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
      return `Set household shape, names, ages, and retirement timing. Current primary person: ${p1Name}.`;
    case 'income':
      return 'Capture salary, pensions, CPP, OAS, and survivor income without overwhelming the first-time flow.';
    case 'accounts':
      return 'Separate investment accounts from real estate and debts so balances, ownership, and tax treatment stay clear.';
    case 'realEstate':
      return 'Primary residence and downsizing map to v2 fields. Second/vacation property is deferred until a scoped schema update.';
    case 'debts':
      return 'Mortgage and LOC fields affect annual cash flow and should be visibly tied to the plan.';
    case 'spending':
      return 'Lifestyle phases, one-time events, and inheritance goals are reviewed separately from account balances.';
    case 'assumptions':
      return 'Return, inflation, withdrawal order, CPP sharing, RRIF election, and spousal RRSP settings live here.';
    case 'review':
      return 'Review key inputs, save locally, and generate the results handoff.';
    default:
      return '';
  }
}

function stepStatusCopy(step: IntakeStepId): string {
  if (step === 'realEstate') {
    return 'Sprint 5 scope: primary residence/downsize only. Second/vacation property waits for a scoped schema update.';
  }
  return 'Field implementation follows this route shell; this step currently defines structure and expected scope.';
}
