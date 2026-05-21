import type { EngineRuntimeBoundary } from './runSimulation';
import { engineRuntimeBoundary } from './runSimulation';
import type { PreviewRunnerBoundary } from './previewScenarios';
import { previewRunnerBoundary } from './previewScenarios';

export type EngineExtractionReadinessStatus = 'readyForNextExtraction' | 'holdForBridgeCleanup' | 'blocked';

export type EngineExtractionReadinessRow = {
  id:
    | 'explicitPlanInput'
    | 'runnerInjection'
    | 'scenarioWorkingCopies'
    | 'stressModule'
    | 'dashboardGlobal'
    | 'savedPlanBoundary';
  label: string;
  status: 'ready' | 'hold' | 'blocked';
  detail: string;
  disposition: 'engineExtractionEvidenceOnly';
};

export type EngineExtractionReadinessSummary = {
  status: EngineExtractionReadinessStatus;
  headline: string;
  detail: string;
  rows: EngineExtractionReadinessRow[];
  reviewNote: string;
  disposition: 'engineExtractionReadinessOnly';
};

export type EngineExtractionNextStepRow = {
  id: 'stressModule' | 'nativeModule' | 'optimizerRunner' | 'parityProbes';
  label: string;
  status: 'next' | 'later' | 'blocked';
  detail: string;
  disposition: 'engineExtractionNextStepOnly';
};

export type EngineExtractionNextSteps = {
  status: 'readyForNextSprint' | 'hold' | 'blocked';
  rows: EngineExtractionNextStepRow[];
  reviewNote: string;
  disposition: 'engineExtractionNextStepsOnly';
};

export type EngineExtractionExampleGate = {
  status: 'examplesClear' | 'needsExampleReview' | 'blocked';
  exampleCount: number;
  heldCount: number;
  failedCount: number;
  reviewNote: string;
  disposition: 'engineExtractionExampleGateOnly';
};

export type EngineExtractionPhaseCloseout = {
  status: 'readyForStressExtraction' | 'holdForBridgeCleanup' | 'blocked';
  headline: string;
  detail: string;
  rows: Array<{
    id: 'readiness' | 'nextSteps' | 'examples' | 'savedPlan';
    label: string;
    status: 'ready' | 'hold' | 'blocked';
    detail: string;
  }>;
  reviewNote: string;
  disposition: 'engineExtractionPhaseCloseoutOnly';
};

export function selectEngineExtractionReadinessSummary({
  engine = engineRuntimeBoundary,
  preview = previewRunnerBoundary
}: {
  engine?: EngineRuntimeBoundary;
  preview?: PreviewRunnerBoundary;
} = {}): EngineExtractionReadinessSummary {
  const rows: EngineExtractionReadinessRow[] = [
    {
      id: 'explicitPlanInput',
      label: 'Plan-object engine boundary',
      status: engine.planInput === 'v2PlanPayload' && engine.resultOutput === 'simulationResult' ? 'ready' : 'blocked',
      detail:
        engine.planInput === 'v2PlanPayload'
          ? 'Simulation calls receive an explicit plan object and return annual result rows.'
          : 'Simulation calls need an explicit plan-object boundary before optimizer work widens.',
      disposition: 'engineExtractionEvidenceOnly'
    },
    {
      id: 'runnerInjection',
      label: 'Scenario runner boundary',
      status: preview.runnerInjection && preview.baselineUsesExplicitPlan ? 'ready' : 'blocked',
      detail: preview.runnerInjection
        ? 'Preview scenarios can receive a runner, so tests and future optimizers can compare plans without UI state.'
        : 'Preview scenarios need an injectable runner before broader optimizer comparisons.',
      disposition: 'engineExtractionEvidenceOnly'
    },
    {
      id: 'scenarioWorkingCopies',
      label: 'Working-copy scenarios',
      status: preview.scenarioWorkingCopies && preview.spendingStressWorkingCopies ? 'ready' : 'blocked',
      detail: preview.scenarioWorkingCopies
        ? 'Scenario and stress plan changes are made on working copies, not the editable plan.'
        : 'Scenario builders must avoid mutating the editable plan.',
      disposition: 'engineExtractionEvidenceOnly'
    },
    {
      id: 'stressModule',
      label: 'Stress module extraction',
      status: engine.stressModuleStatus === 'stillInsideSimulationModule' ? 'hold' : 'ready',
      detail:
        engine.stressModuleStatus === 'stillInsideSimulationModule'
          ? 'Stress work is still owned by the extracted simulation module; this is the next clean extraction target.'
          : 'Stress work has its own module boundary.',
      disposition: 'engineExtractionEvidenceOnly'
    },
    {
      id: 'dashboardGlobal',
      label: 'Dashboard state dependency',
      status: engine.usesDashboardGlobal ? 'blocked' : 'ready',
      detail: engine.usesDashboardGlobal
        ? 'The engine path still depends on dashboard state.'
        : 'The React engine path does not depend on the old dashboard state object.',
      disposition: 'engineExtractionEvidenceOnly'
    },
    {
      id: 'savedPlanBoundary',
      label: 'Saved-plan boundary',
      status: engine.savedPlanOutput === 'none' && preview.persistedOutput === 'none' ? 'ready' : 'blocked',
      detail:
        engine.savedPlanOutput === 'none' && preview.persistedOutput === 'none'
          ? 'Readiness evidence is runtime-only and does not enter saved plan files.'
          : 'Runtime evidence must stay out of saved plan files.',
      disposition: 'engineExtractionEvidenceOnly'
    }
  ];

  const blocked = rows.some((row) => row.status === 'blocked');
  const held = rows.some((row) => row.status === 'hold');

  return {
    status: blocked ? 'blocked' : held ? 'holdForBridgeCleanup' : 'readyForNextExtraction',
    headline: blocked
      ? 'Engine extraction needs cleanup before widening.'
      : held
        ? 'Engine extraction can continue carefully.'
        : 'Engine extraction is ready for the next slice.',
    detail: blocked
      ? 'One or more boundaries need repair before broader optimizer work.'
      : held
        ? 'The app has explicit plan boundaries, with stress extraction and native module cleanup still ahead.'
        : 'The core boundaries are ready for the next extraction slice.',
    rows,
    reviewNote:
      'Extraction readiness only. This does not change simulation math, apply optimizer output, or save runtime evidence.',
    disposition: 'engineExtractionReadinessOnly'
  };
}

export function selectEngineExtractionNextSteps(summary: EngineExtractionReadinessSummary): EngineExtractionNextSteps {
  const blocked = summary.status === 'blocked';
  const rows: EngineExtractionNextStepRow[] = [
    {
      id: 'stressModule',
      label: 'Extract stress helpers next',
      status: blocked ? 'blocked' : 'next',
      detail: blocked
        ? 'Repair the blocked engine boundary before extracting stress helpers.'
        : 'Move stress-facing helpers behind an explicit plan-and-runner boundary before widening optimizer scenarios.',
      disposition: 'engineExtractionNextStepOnly'
    },
    {
      id: 'nativeModule',
      label: 'Reduce bridge ownership',
      status: blocked ? 'blocked' : 'later',
      detail:
        'The browser-source bridge still works, but native TypeScript ownership should continue after the stress boundary is clearer.',
      disposition: 'engineExtractionNextStepOnly'
    },
    {
      id: 'optimizerRunner',
      label: 'Keep optimizer comparisons explicit',
      status: blocked ? 'blocked' : 'later',
      detail:
        'Future optimizer candidates should continue passing explicit plan copies and runner configs rather than reading UI state.',
      disposition: 'engineExtractionNextStepOnly'
    },
    {
      id: 'parityProbes',
      label: 'Keep parity probes',
      status: blocked ? 'blocked' : 'next',
      detail:
        'Simulation and bridge parity probes remain the safety net while ownership moves out of the dashboard-era source.',
      disposition: 'engineExtractionNextStepOnly'
    }
  ];

  return {
    status: blocked ? 'blocked' : summary.status === 'holdForBridgeCleanup' ? 'readyForNextSprint' : 'readyForNextSprint',
    rows,
    reviewNote:
      'Next-step guide only. It does not change engine output, saved plan files, or optimizer behavior.',
    disposition: 'engineExtractionNextStepsOnly'
  };
}

export function selectEngineExtractionExampleGate({
  exampleCount,
  heldCount,
  failedCount
}: {
  exampleCount: number;
  heldCount: number;
  failedCount: number;
}): EngineExtractionExampleGate {
  return {
    status: failedCount > 0 ? 'blocked' : heldCount > 0 ? 'needsExampleReview' : 'examplesClear',
    exampleCount,
    heldCount,
    failedCount,
    reviewNote:
      'Example gate only. Built-in examples must keep producing finite baseline results while extraction boundaries move.',
    disposition: 'engineExtractionExampleGateOnly'
  };
}

export function selectEngineExtractionPhaseCloseout({
  summary,
  nextSteps,
  exampleGate
}: {
  summary: EngineExtractionReadinessSummary;
  nextSteps: EngineExtractionNextSteps;
  exampleGate: EngineExtractionExampleGate;
}): EngineExtractionPhaseCloseout {
  const blocked = summary.status === 'blocked' || nextSteps.status === 'blocked' || exampleGate.status === 'blocked';
  const held = summary.status === 'holdForBridgeCleanup' || exampleGate.status === 'needsExampleReview';

  return {
    status: blocked ? 'blocked' : held ? 'readyForStressExtraction' : 'readyForStressExtraction',
    headline: blocked
      ? 'Hold before the next extraction slice.'
      : 'Ready for the next extraction slice.',
    detail: blocked
      ? 'A boundary or example check needs cleanup before the stress module work continues.'
      : 'The next logical slice is a narrow stress-helper extraction while keeping optimizer behavior unchanged.',
    rows: [
      {
        id: 'readiness',
        label: 'Extraction readiness',
        status: summary.status === 'blocked' ? 'blocked' : summary.status === 'holdForBridgeCleanup' ? 'hold' : 'ready',
        detail: summary.headline
      },
      {
        id: 'nextSteps',
        label: 'Next-step guide',
        status: nextSteps.status === 'blocked' ? 'blocked' : 'ready',
        detail: nextSteps.reviewNote
      },
      {
        id: 'examples',
        label: 'Example coverage',
        status: exampleGate.status === 'blocked' ? 'blocked' : exampleGate.status === 'needsExampleReview' ? 'hold' : 'ready',
        detail: `${exampleGate.exampleCount} example plans checked; ${exampleGate.failedCount} failed and ${exampleGate.heldCount} held.`
      },
      {
        id: 'savedPlan',
        label: 'Saved-plan boundary',
        status: summary.rows.find((row) => row.id === 'savedPlanBoundary')?.status ?? 'blocked',
        detail: 'Extraction readiness output remains runtime-only.'
      }
    ],
    reviewNote:
      'Phase closeout only. It does not change simulation math, save extraction output, or introduce optimizer execution.',
    disposition: 'engineExtractionPhaseCloseoutOnly'
  };
}
