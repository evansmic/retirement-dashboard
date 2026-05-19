import { describe, expect, it } from 'vitest';
import { createExamplePlan, examplePlanCards } from '../data/examplePlans';
import { createPlanFile } from '../data/planFile';
import { selectDrawdownReadinessSummary, selectSpendingStressSummary } from './resultSelectors';
import { runBoundedOptimizer, type BoundedOptimizerCandidateRow } from './boundedOptimizer';
import { runResultsPreviewBundle } from './previewScenarios';

const DISRUPTIVE_LEVERS = new Set(['spending', 'retirementTiming', 'benefitTiming']);

function isFiniteNumber(value: unknown): boolean {
  return typeof value === 'number' && Number.isFinite(value);
}

function isDisruptive(row: BoundedOptimizerCandidateRow): boolean {
  return row.changedLevers.some((lever) => DISRUPTIVE_LEVERS.has(lever));
}

function materiallyRepairsFunding(candidate: BoundedOptimizerCandidateRow, baseline: BoundedOptimizerCandidateRow): boolean {
  if (baseline.firstShortfallYear && !candidate.firstShortfallYear) return true;
  if (baseline.firstShortfallYear && candidate.fundedYears >= baseline.fundedYears + 2) return true;
  return false;
}

describe('example-plan optimizer readiness matrix', () => {
  it('runs every built-in example through Results, stress, drawdown readiness, and bounded optimizer without persisted output', () => {
    const matrix = examplePlanCards.map((card) => {
      const plan = createExamplePlan(card.id);
      const preview = runResultsPreviewBundle(plan);
      const spendingStress = selectSpendingStressSummary(preview.result, preview.spendingStress, plan);
      const drawdownReadiness = selectDrawdownReadinessSummary(preview.result, plan);
      const optimizer = runBoundedOptimizer(plan);
      const saved = createPlanFile(plan);

      return { card, plan, preview, spendingStress, drawdownReadiness, optimizer, saved };
    });

    expect(matrix).toHaveLength(examplePlanCards.length);

    for (const item of matrix) {
      expect(item.preview.result.years.length, `${item.card.id} projection rows`).toBeGreaterThan(0);
      expect(item.preview.result.years.every((row) => isFiniteNumber(row.bal_total))).toBe(true);
      expect(item.preview.result.years.every((row) => isFiniteNumber(row.totalTaxYear))).toBe(true);

      expect(['cannotTell', 'fragile', 'balanced', 'roomToReview']).toContain(item.spendingStress.status);
      expect(['cannotTell', 'ready', 'review']).toContain(item.drawdownReadiness.status);
      expect(item.drawdownReadiness.prototypeRows.every((row) => row.disposition === 'evidenceOnly')).toBe(true);
      expect(['cannotTell', 'readyForFutureReview', 'needsInput', 'blocked']).toContain(item.drawdownReadiness.drawdownOverrideDrafts.status);
      expect(item.drawdownReadiness.drawdownOverrideDrafts.rows.every((row) => row.disposition === 'draftOnly')).toBe(true);
      expect(
        item.drawdownReadiness.drawdownOverrideDrafts.rows.every((row) =>
          ['usableForFutureReview', 'needsInput', 'blocked'].includes(row.status)
        )
      ).toBe(true);
      expect(['notReady', 'readyToCompareLater', 'needsInput', 'blocked']).toContain(item.drawdownReadiness.drawdownOverrideDrafts.sandbox.status);
      expect(item.drawdownReadiness.drawdownOverrideDrafts.sandbox.rows.every((row) => row.disposition === 'sandboxPlanningOnly')).toBe(true);
      expect(['blocked', 'ready']).toContain(item.optimizer.status);
      expect(item.optimizer.execution).toBe('boundedSearch');
      expect(item.optimizer.candidates.length).toBeGreaterThan(0);
      expect(item.optimizer.candidates.find((row) => row.id === 'baseline')).toBeTruthy();
      expect(item.optimizer.optionGroups.length).toBeGreaterThan(0);
      expect(item.optimizer.optionGroups.flatMap((group) => group.candidateIds)).toEqual(
        expect.arrayContaining(item.optimizer.candidates.map((row) => row.id))
      );

      expect(item.saved.plan).not.toHaveProperty('boundedOptimizer');
      expect(item.saved.plan).not.toHaveProperty('optimizerContract');
      expect(item.saved.plan).not.toHaveProperty('spendingStress');
      expect(item.saved.plan).not.toHaveProperty('drawdownReadiness');
      expect(item.saved.plan).not.toHaveProperty('taxAwareDrawdownPrototype');
      expect(item.saved.plan).not.toHaveProperty('taxAwareDrawdownDrafts');
      expect(item.saved.plan).not.toHaveProperty('drawdownOverrideDrafts');
      expect(item.saved.plan).not.toHaveProperty('drawdownDraftComparison');
      expect(item.saved.plan).not.toHaveProperty('drawdownSandbox');
      expect(item.saved.plan).not.toHaveProperty('withdrawalStrategy');
      expect(item.saved.plan).not.toHaveProperty('annualOverrides');
      expect(item.saved.plan).not.toHaveProperty('optionGroups');
    }
  });

  it('keeps disruptive example-plan suggestions behind the material-repair gate', () => {
    for (const card of examplePlanCards) {
      const summary = runBoundedOptimizer(createExamplePlan(card.id));
      const baseline = summary.candidates.find((row) => row.id === 'baseline');
      const suggested = summary.candidates.find((row) => row.id === summary.suggestedCandidateId);

      expect(baseline, `${card.id} baseline candidate`).toBeTruthy();
      if (!baseline || !suggested || !isDisruptive(suggested)) continue;

      expect(materiallyRepairsFunding(suggested, baseline), `${card.id} disruptive suggestion needs material repair`).toBe(true);
      expect(summary.recommendationNotes.find((note) => note.candidateId === suggested.id)?.reason).toContain(
        'materially improves a visible funding shortfall'
      );
    }
  });

  it('keeps withdrawal-order examples as high-level review checks, not tax-aware drawdown instructions', () => {
    for (const card of examplePlanCards) {
      const summary = runBoundedOptimizer(createExamplePlan(card.id));
      const withdrawalRows = summary.candidates.filter((row) => row.changedLevers.includes('withdrawalOrder'));

      for (const row of withdrawalRows) {
        expect(row.reviewNote, `${card.id} ${row.id} review note`).toContain('high-level drawdown-order check');
        expect(row.reviewNote).toContain('not tax-bracket optimization');
        expect(row.changeSummary).not.toContain('annual override');
        expect(row.changeSummary).not.toContain('year-by-year');
      }
    }
  });

  it('keeps CPP sharing examples as review checks, not filing instructions', () => {
    for (const card of examplePlanCards) {
      const summary = runBoundedOptimizer(createExamplePlan(card.id));
      const cppSharingRows = summary.candidates.filter((row) => row.changedLevers.includes('cppSharing'));

      for (const row of cppSharingRows) {
        expect(row.label, `${card.id} ${row.id} label`).toBe('Test CPP sharing');
        expect(row.reviewNote, `${card.id} ${row.id} review note`).toContain('Review CPP sharing eligibility');
        expect(row.reviewNote).toContain('household tax details');
        expect(row.reviewNote.toLowerCase()).not.toContain('automatic filing');
        expect(row.changeSummary).toContain('in this test');
      }
    }
  });

  it('keeps home-equity examples as reliance checks, not home-sale suggestions', () => {
    for (const card of examplePlanCards) {
      const summary = runBoundedOptimizer(createExamplePlan(card.id));
      const homeRows = summary.candidates.filter((row) => row.id === 'withoutDownsize');

      for (const row of homeRows) {
        expect(row.label, `${card.id} ${row.id} label`).toBe('Check without home-sale cash');
        expect(row.reviewNote, `${card.id} ${row.id} review note`).toContain('depends on home-sale cash');
        expect(row.reviewNote).toContain('not a suggestion');
        expect(row.suggestionEligible).toBe(false);
        expect(row.changeSummary).not.toContain('estimate');
      }
    }
  });

  it('keeps readiness and optimizer copy review-oriented across the example matrix', () => {
    const forbidden = [
      'safe spend',
      'guaranteed',
      'optimal drawdown',
      'recommended withdrawal strategy',
      'apply optimized plan',
      'automatic filing instruction',
      'sell your home',
      'recommended home sale'
    ];

    for (const card of examplePlanCards) {
      const plan = createExamplePlan(card.id);
      const preview = runResultsPreviewBundle(plan);
      const spendingStress = selectSpendingStressSummary(preview.result, preview.spendingStress, plan);
      const drawdownReadiness = selectDrawdownReadinessSummary(preview.result, plan);
      const optimizer = runBoundedOptimizer(plan);
      const copy = JSON.stringify({
        spendingStress,
        drawdownReadiness,
      optimizerHeadline: optimizer.headline,
      optimizerDetail: optimizer.detail,
      optimizerReviewNotes: optimizer.reviewNotes,
      optimizerOptionGroups: optimizer.optionGroups,
      optimizerRecommendationNotes: optimizer.recommendationNotes
      }).toLowerCase();

      expect(copy, `${card.id} copy includes review posture`).toContain('review');
      expect(copy, `${card.id} copy includes saved-plan boundary`).toContain('saved plan');
      expect(copy, `${card.id} copy includes evidence or current-plan framing`).toMatch(/evidence|current plan/);
      for (const phrase of forbidden) {
        expect(copy, `${card.id} forbidden phrase: ${phrase}`).not.toContain(phrase);
      }
    }
  });
});
