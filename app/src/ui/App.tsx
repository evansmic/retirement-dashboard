import { useMemo, useReducer } from 'react';
import { createBlankPlan } from '../data/defaultPlan';
import { createPlanFile, extractPlanPayload, safeFilenamePart, validatePlanFile } from '../data/planFile';
import { PlanValidationResult, validatePlanForGuidedIntake } from '../data/planValidation';
import { fromV2Payload } from '../data/domainAdapter';
import { engineExtractionGate, runSimulation } from '../engine/runSimulation';
import { V2PlanPayload } from '../types/plan';

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
  plan: V2PlanPayload | null;
  error: string;
  importLabel: string;
  dirty: boolean;
  lastExportedAt: string;
};

type WorkspaceAction =
  | { type: 'newPlan' }
  | { type: 'openPlan'; plan: V2PlanPayload; label: string }
  | { type: 'setView'; view: WorkspaceView }
  | { type: 'setStep'; step: IntakeStepId }
  | { type: 'setError'; error: string }
  | { type: 'markExported'; exportedAt: string };

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
        plan: action.plan,
        importLabel: action.label,
        error: '',
        dirty: false,
        lastExportedAt: ''
      };
    case 'setView':
      return { ...state, view: action.view };
    case 'setStep':
      return { ...state, activeStep: action.step, view: action.step === 'review' ? 'review' : 'intake' };
    case 'setError':
      return { ...state, error: action.error };
    case 'markExported':
      return { ...state, dirty: false, lastExportedAt: action.exportedAt };
    default:
      return state;
  }
}

function dashboardUrlForPlan(plan: V2PlanPayload): string {
  const encoded = btoa(encodeURIComponent(JSON.stringify(plan)));
  return `../retirement_dashboard.html#${encoded}`;
}

function formatMoney(value: number | undefined): string {
  return `$${Math.round(value || 0).toLocaleString()}`;
}

export function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { plan } = state;

  const domainPlan = useMemo(() => (plan ? fromV2Payload(plan) : null), [plan]);
  const validation = useMemo(() => (plan ? validatePlanForGuidedIntake(plan) : null), [plan]);
  const bridgePreview = useMemo(() => {
    if (!plan) return { result: null, error: '' };
    try {
      const result = runSimulation(plan, {
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
      return { result, error: '' };
    } catch (err) {
      return {
        result: null,
        error: err instanceof Error ? err.message : 'Could not run preview calculation.'
      };
    }
  }, [plan]);
  const bridgeFirstYear = bridgePreview.result?.years[0];
  const bridgeLastYear = bridgePreview.result?.years[bridgePreview.result.years.length - 1];

  const currentStep = intakeSteps.find((step) => step.id === state.activeStep) || intakeSteps[0];
  const completedStepCount = plan ? Math.max(1, intakeSteps.findIndex((step) => step.id === state.activeStep) + 1) : 0;

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
          <a className="button secondary" href="../index.html">
            Stable intake
          </a>
          <a className="button secondary" href="../retirement_dashboard.html">
            Stable dashboard
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
              plan={plan}
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
              bridgeError={bridgePreview.error}
              endPortfolio={bridgeLastYear?.bal_total}
              firstYear={bridgeFirstYear?.year}
              lastYear={bridgeLastYear?.year}
              onDownload={downloadNormalizedPlan}
              plan={plan}
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
            <input type="file" accept=".plan.json,application/json" onChange={onFileChange} />
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
  onNext,
  onReview,
  onStep,
  plan
}: {
  currentStep: { id: IntakeStepId; label: string; helper: string };
  onNext: () => void;
  onReview: () => void;
  onStep: (step: IntakeStepId) => void;
  plan: V2PlanPayload;
}) {
  return (
    <section className="intake-shell">
      <div className="step-rail" aria-label="Guided intake steps">
        {intakeSteps.map((step) => (
          <button
            className={`step-button ${step.id === currentStep.id ? 'active' : ''}`}
            key={step.id}
            type="button"
            onClick={() => onStep(step.id)}
          >
            <span>{step.label}</span>
            <small>{step.helper}</small>
          </button>
        ))}
      </div>

      <div className="panel intake-panel">
        <p className="eyebrow">Guided intake</p>
        <h2>{currentStep.label}</h2>
        <p>{stepCopy(currentStep.id, plan)}</p>
        <div className="placeholder-box">
          <strong>{currentStep.helper}</strong>
          <span>{stepStatusCopy(currentStep.id)}</span>
        </div>
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
        <Metric label="Household" value={plan.p2.name ? 'Couple plan' : 'Single-person plan'} />
        <Metric label="Retirement year" value={String(plan.assumptions.retireYear || plan.p1.retireYear || '-')} />
        <Metric label="Spending target" value={formatMoney(plan.spending.gogo)} />
        <Metric label="Preview years" value={firstYear && lastYear ? `${firstYear}-${lastYear}` : '-'} />
        <Metric label="End portfolio" value={formatMoney(endPortfolio)} />
      </div>
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

function ResultsHandoffPanel({
  bridgeError,
  endPortfolio,
  firstYear,
  lastYear,
  onDownload,
  plan,
  title,
  validation
}: {
  bridgeError: string;
  endPortfolio: number | undefined;
  firstYear: number | undefined;
  lastYear: number | undefined;
  onDownload: () => void;
  plan: V2PlanPayload;
  title: string;
  validation: PlanValidationResult | null;
}) {
  const hasBlockers = Boolean(validation && !validation.canGenerate);
  return (
    <section className="panel">
      <p className="eyebrow">Results handoff</p>
      <h2>{title}</h2>
      <p>
        The React preview can run the extracted engine, but the stable dashboard remains the full result surface for
        charts, tables, stress tests, and print/PDF.
      </p>
      <div className="summary-grid">
        <Metric label="Projection" value={firstYear && lastYear ? `${firstYear}-${lastYear}` : '-'} />
        <Metric label="End portfolio" value={formatMoney(endPortfolio)} />
        <Metric label="Dashboard schema" value="v2" />
      </div>
      {validation ? <ValidationPanel validation={validation} /> : null}
      {bridgeError ? <p className="error">{bridgeError}</p> : null}
      <div className="actions">
        <a
          className={`button ${hasBlockers ? 'disabled-link' : ''}`}
          href={hasBlockers ? undefined : dashboardUrlForPlan(extractPlanPayload(plan))}
          aria-disabled={hasBlockers}
        >
          Open stable dashboard
        </a>
        <button className="ghost" type="button" onClick={onDownload}>
          Save .plan.json
        </button>
      </div>
    </section>
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
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
