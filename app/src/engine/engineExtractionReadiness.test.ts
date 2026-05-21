import { describe, expect, it } from 'vitest';
import { createExamplePlan, examplePlanCards } from '../data/examplePlans';
import { createPlanFile } from '../data/planFile';
import { runResultsPreviewBundle } from './previewScenarios';
import {
  selectEngineExtractionExampleGate,
  selectEngineExtractionNextSteps,
  selectEngineExtractionPhaseCloseout,
  selectEngineExtractionReadinessSummary
} from './engineExtractionReadiness';
import { engineRuntimeBoundary } from './runSimulation';
import { previewRunnerBoundary } from './previewScenarios';

function finiteBaselineForAllExamples(): { failedCount: number; heldCount: number } {
  let failedCount = 0;
  let heldCount = 0;

  for (const card of examplePlanCards) {
    const preview = runResultsPreviewBundle(createExamplePlan(card.id));
    if (!preview.result.years.length) {
      failedCount += 1;
      continue;
    }
    const finite = preview.result.years.every(
      (row) =>
        Number.isFinite(row.year) &&
        Number.isFinite(row.bal_total) &&
        Number.isFinite(row.totalTaxYear) &&
        Number.isFinite(row.totalAftaxYear)
    );
    if (!finite) heldCount += 1;
  }

  return { failedCount, heldCount };
}

describe('engine extraction readiness', () => {
  it('summarizes the current explicit plan-object boundary and remaining stress extraction gap', () => {
    const summary = selectEngineExtractionReadinessSummary();

    expect(summary).toMatchObject({
      status: 'holdForBridgeCleanup',
      disposition: 'engineExtractionReadinessOnly'
    });
    expect(summary.rows.map((row) => row.id)).toEqual([
      'explicitPlanInput',
      'runnerInjection',
      'scenarioWorkingCopies',
      'stressModule',
      'dashboardGlobal',
      'savedPlanBoundary'
    ]);
    expect(summary.rows.find((row) => row.id === 'explicitPlanInput')).toMatchObject({ status: 'ready' });
    expect(summary.rows.find((row) => row.id === 'stressModule')).toMatchObject({ status: 'hold' });
    expect(summary.rows.find((row) => row.id === 'dashboardGlobal')).toMatchObject({ status: 'ready' });
    expect(summary.reviewNote).toContain('does not change simulation math');
  });

  it('blocks readiness if a future boundary regresses to dashboard state', () => {
    const summary = selectEngineExtractionReadinessSummary({
      engine: {
        ...engineRuntimeBoundary,
        usesDashboardGlobal: true
      },
      preview: previewRunnerBoundary
    });

    expect(summary.status).toBe('blocked');
    expect(summary.rows.find((row) => row.id === 'dashboardGlobal')).toMatchObject({ status: 'blocked' });
  });

  it('keeps next steps narrow and avoids optimizer behavior changes', () => {
    const summary = selectEngineExtractionReadinessSummary();
    const nextSteps = selectEngineExtractionNextSteps(summary);

    expect(nextSteps).toMatchObject({
      status: 'readyForNextSprint',
      disposition: 'engineExtractionNextStepsOnly'
    });
    expect(nextSteps.rows.map((row) => row.id)).toEqual(['stressModule', 'nativeModule', 'optimizerRunner', 'parityProbes']);
    expect(nextSteps.rows.find((row) => row.id === 'stressModule')).toMatchObject({ status: 'next' });
    expect(JSON.stringify(nextSteps).toLowerCase()).not.toContain('recommended withdrawal strategy');
    expect(JSON.stringify(nextSteps).toLowerCase()).not.toContain('apply optimized plan');
  });

  it('keeps example-plan extraction readiness clear and unsaved', () => {
    const { failedCount, heldCount } = finiteBaselineForAllExamples();
    const exampleGate = selectEngineExtractionExampleGate({
      exampleCount: examplePlanCards.length,
      failedCount,
      heldCount
    });

    expect(exampleGate).toMatchObject({
      status: 'examplesClear',
      exampleCount: examplePlanCards.length,
      failedCount: 0,
      heldCount: 0,
      disposition: 'engineExtractionExampleGateOnly'
    });

    for (const card of examplePlanCards) {
      const saved = createPlanFile(createExamplePlan(card.id));
      expect(saved.plan).not.toHaveProperty('engineExtractionReadiness');
      expect(saved.plan).not.toHaveProperty('engineExtractionNextSteps');
      expect(saved.plan).not.toHaveProperty('engineExtractionExampleGate');
      expect(saved.plan).not.toHaveProperty('engineExtractionPhaseCloseout');
    }
  });

  it('closes the batch as ready for a narrow stress extraction slice', () => {
    const summary = selectEngineExtractionReadinessSummary();
    const nextSteps = selectEngineExtractionNextSteps(summary);
    const exampleGate = selectEngineExtractionExampleGate({
      exampleCount: examplePlanCards.length,
      failedCount: 0,
      heldCount: 0
    });
    const closeout = selectEngineExtractionPhaseCloseout({ summary, nextSteps, exampleGate });

    expect(closeout).toMatchObject({
      status: 'readyForStressExtraction',
      disposition: 'engineExtractionPhaseCloseoutOnly'
    });
    expect(closeout.rows.map((row) => row.id)).toEqual(['readiness', 'nextSteps', 'examples', 'savedPlan']);
    expect(closeout.detail).toContain('stress-helper extraction');
    expect(closeout.reviewNote).toContain('does not change simulation math');
  });
});
