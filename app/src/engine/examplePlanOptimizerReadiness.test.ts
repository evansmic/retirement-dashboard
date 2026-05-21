import { describe, expect, it } from 'vitest';
import { createExamplePlan, examplePlanCards } from '../data/examplePlans';
import { createPlanFile } from '../data/planFile';
import { selectDrawdownReadinessSummary, selectSpendingStressSummary } from './resultSelectors';
import { runBoundedOptimizer, type BoundedOptimizerCandidateRow } from './boundedOptimizer';
import { runResultsPreviewBundle } from './previewScenarios';
import { runSingleDrawdownComparison, selectHiddenDrawdownComparisonGuardrails } from './drawdownComparison';
import {
  buildDrawdownAnnualOverrideAdapterDraft,
  buildDrawdownExecutionContract,
  emptyMockedExecutionScorecard,
  runContainedDrawdownExecutionPrototype,
  selectContainedDrawdownBlockerRegister,
  selectContainedDrawdownCopyGuard,
  selectContainedDrawdownDetailsDensity,
  selectContainedDrawdownExplanation,
  selectContainedDrawdownExampleGate,
  selectContainedDrawdownExamplePromotionGate,
  selectContainedDrawdownLimitations,
  selectContainedDrawdownMateriality,
  selectContainedDrawdownNextStepGuide,
  selectContainedDrawdownPhaseMilestoneCloseout,
  selectContainedDrawdownProductGoNoGo,
  selectContainedDrawdownPromotionReadiness,
  selectContainedDrawdownPrototypeSummary,
  selectContainedDrawdownReviewChecklist,
  selectContainedDrawdownUsefulnessCloseout,
  selectDrawdownAdapterAuditTrail,
  selectDrawdownExecutionBoundaryDecision,
  selectDrawdownExecutionContainmentGuard,
  selectDrawdownExecutionExampleMatrixCheckpoint,
  selectDrawdownExecutionPhaseCloseout,
  selectDrawdownExecutionPreflight,
  selectDrawdownExecutionPrototypeGoNoGo,
  selectDrawdownPhaseReview,
  selectDrawdownPrototypeReadinessReview,
  selectDrawdownReviewPreview,
  selectDrawdownVisibleReviewGate
} from './drawdownExecutionReadiness';

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
      expect(['readyForLaterComparison', 'needsInput', 'blocked', 'notReady']).toContain(
        item.drawdownReadiness.drawdownOverrideDrafts.comparisonReadiness.status
      );
      expect(item.drawdownReadiness.drawdownOverrideDrafts.comparisonReadiness.reviewNote).toContain('review-only');
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
      expect(item.saved.plan).not.toHaveProperty('drawdownSandboxComparison');
      expect(item.saved.plan).not.toHaveProperty('drawdownComparisonReadiness');
      expect(item.saved.plan).not.toHaveProperty('drawdownComparison');
      expect(item.saved.plan).not.toHaveProperty('singleRegisteredTimingCheck');
      expect(item.saved.plan).not.toHaveProperty('drawdownExecutionContract');
      expect(item.saved.plan).not.toHaveProperty('runtimeDrawdownOverridePayload');
      expect(item.saved.plan).not.toHaveProperty('internalDrawdownDryRun');
      expect(item.saved.plan).not.toHaveProperty('syntheticDrawdownPayload');
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

  it('runs hidden drawdown comparisons across examples without surfacing instructions or saved output', () => {
    const forbidden = [
      'safe spend',
      'guaranteed',
      'optimal drawdown',
      'recommended withdrawal strategy',
      'account-by-account instruction',
      'apply optimized plan'
    ];

    for (const card of examplePlanCards) {
      const plan = createExamplePlan(card.id);
      const comparison = runSingleDrawdownComparison(plan);
      const contract = buildDrawdownExecutionContract({ plan, comparison });
      const readinessReview = selectDrawdownPrototypeReadinessReview({ plan, comparison, contract });
      const visibleGate = selectDrawdownVisibleReviewGate({ plan, comparison, contract });
      const preview = runResultsPreviewBundle(plan);
      const spendingStress = selectSpendingStressSummary(preview.result, preview.spendingStress, plan);
      const reviewPreview = selectDrawdownReviewPreview({
        gate: visibleGate,
        comparison,
        spendingStressStatus: spendingStress.status
      });
      const phaseReview = selectDrawdownPhaseReview({ plan, gate: visibleGate, preview: reviewPreview });
      const boundary = selectDrawdownExecutionBoundaryDecision({ plan, phase: phaseReview, preview: reviewPreview });
      const adapterValidation = buildDrawdownAnnualOverrideAdapterDraft({ plan, boundary, contract });
      const goNoGo = selectDrawdownExecutionPrototypeGoNoGo({
        plan,
        boundary,
        adapterValidation,
        scorecard: emptyMockedExecutionScorecard()
      });
      const preflight = selectDrawdownExecutionPreflight({ plan, adapterValidation, goNoGo });
      const auditTrail = selectDrawdownAdapterAuditTrail(adapterValidation);
      const containment = selectDrawdownExecutionContainmentGuard({ plan, adapterValidation });
      const exampleCheckpoint = selectDrawdownExecutionExampleMatrixCheckpoint({ exampleCount: examplePlanCards.length, heldOrBlockedCount: 0 });
      const phaseCloseout = selectDrawdownExecutionPhaseCloseout({
        plan,
        preflight,
        auditTrail,
        containment,
        exampleCheckpoint
      });
      const containedPrototype = runContainedDrawdownExecutionPrototype({ plan, adapterValidation, containment });
      const containedPrototypeSummary = selectContainedDrawdownPrototypeSummary({ plan, prototype: containedPrototype });
      const containedMateriality = selectContainedDrawdownMateriality(containedPrototype);
      const containedExplanation = selectContainedDrawdownExplanation({ prototype: containedPrototype, materiality: containedMateriality });
      const containedLimitations = selectContainedDrawdownLimitations();
      const containedUsefulness = selectContainedDrawdownUsefulnessCloseout({
        plan,
        summary: containedPrototypeSummary,
        materiality: containedMateriality,
        explanation: containedExplanation,
        limitations: containedLimitations
      });
      const containedDetailsDensity = selectContainedDrawdownDetailsDensity({
        prototype: containedPrototype,
        materiality: containedMateriality,
        explanation: containedExplanation,
        limitations: containedLimitations,
        usefulness: containedUsefulness
      });
      const containedReviewChecklist = selectContainedDrawdownReviewChecklist({
        usefulness: containedUsefulness,
        materiality: containedMateriality,
        limitations: containedLimitations
      });
      const containedExampleGate = selectContainedDrawdownExampleGate({
        exampleCount: examplePlanCards.length,
        blockedCount: 0,
        heldCount: 0
      });
      const containedCopyGuard = selectContainedDrawdownCopyGuard(plan);
      const containedProductGoNoGo = selectContainedDrawdownProductGoNoGo({
        plan,
        usefulness: containedUsefulness,
        density: containedDetailsDensity,
        checklist: containedReviewChecklist,
        exampleGate: containedExampleGate,
        copyGuard: containedCopyGuard
      });
      const containedPromotionReadiness = selectContainedDrawdownPromotionReadiness({
        plan,
        productGoNoGo: containedProductGoNoGo,
        usefulness: containedUsefulness,
        density: containedDetailsDensity,
        copyGuard: containedCopyGuard
      });
      const containedNextStepGuide = selectContainedDrawdownNextStepGuide({
        promotionReadiness: containedPromotionReadiness,
        productGoNoGo: containedProductGoNoGo
      });
      const containedBlockerRegister = selectContainedDrawdownBlockerRegister({
        plan,
        promotionReadiness: containedPromotionReadiness,
        productGoNoGo: containedProductGoNoGo,
        checklist: containedReviewChecklist,
        copyGuard: containedCopyGuard
      });
      const containedExamplePromotionGate = selectContainedDrawdownExamplePromotionGate({
        exampleCount: examplePlanCards.length,
        heldOrBlockedCount: 0
      });
      const containedPhaseMilestone = selectContainedDrawdownPhaseMilestoneCloseout({
        plan,
        promotionReadiness: containedPromotionReadiness,
        nextStepGuide: containedNextStepGuide,
        blockerRegister: containedBlockerRegister,
        examplePromotionGate: containedExamplePromotionGate
      });
      const guardrails = selectHiddenDrawdownComparisonGuardrails(comparison, plan);
      const saved = createPlanFile(plan);
      const copy = JSON.stringify({
        comparison,
        guardrails,
        contract,
        readinessReview,
        visibleGate,
        reviewPreview,
        phaseReview,
        boundary,
        adapterValidation,
        goNoGo,
        preflight,
        auditTrail,
        containment,
        exampleCheckpoint,
        phaseCloseout,
        containedPrototype,
        containedPrototypeSummary,
        containedMateriality,
        containedExplanation,
        containedLimitations,
        containedUsefulness,
        containedDetailsDensity,
        containedReviewChecklist,
        containedExampleGate,
        containedCopyGuard,
        containedProductGoNoGo,
        containedPromotionReadiness,
        containedNextStepGuide,
        containedBlockerRegister,
        containedExamplePromotionGate,
        containedPhaseMilestone
      }).toLowerCase();

      expect(['reviewOnly', 'blocked', 'notReady']).toContain(comparison.status);
      expect(comparison.disposition, `${card.id} hidden disposition`).toBe('hiddenComparisonOnly');
      expect(['eligibleForReview', 'holdBack', 'blocked', 'notReady']).toContain(comparison.decisionGate.status);
      expect(comparison.decisionGate.reviewNote, `${card.id} decision gate note`).toContain('review-only');
      expect(guardrails.every((row) => ['ok', 'review', 'blocked'].includes(row.status))).toBe(true);
      expect(guardrails.find((row) => row.id === 'hiddenOnly'), `${card.id} hidden guardrail`).toMatchObject({ status: 'ok' });
      expect(guardrails.find((row) => row.id === 'reviewOnly'), `${card.id} review guardrail`).toMatchObject({ status: 'ok' });
      expect(guardrails.find((row) => row.id === 'savedPlan'), `${card.id} saved-plan guardrail`).toMatchObject({ status: 'ok' });
      expect(['readyForInternalDryRun', 'needsInput', 'blocked', 'notReady']).toContain(contract.status);
      expect(contract.withdrawalStrategy).toEqual({ mode: 'currentOrder', annualOverrides: [] });
      expect(contract.disposition).toBe('runtimeContractOnly');
      expect(['readyForNarrowPrototype', 'holdForGuardrails', 'notReady']).toContain(readinessReview.status);
      expect(readinessReview.disposition).toBe('readinessReviewOnly');
      expect(['readyForVisibleReview', 'holdForMoreEvidence', 'blocked']).toContain(visibleGate.status);
      expect(visibleGate.disposition).toBe('visibleReviewGateOnly');
      expect(['visibleForReview', 'heldBack', 'blocked']).toContain(reviewPreview.status);
      expect(reviewPreview.disposition).toBe('detailsPreviewOnly');
      expect(['readyToContinue', 'holdForMoreGuardrails', 'stopBeforeExecution']).toContain(phaseReview.status);
      expect(phaseReview.disposition).toBe('phaseReviewOnly');
      expect(['keepPreviewOnly', 'hardenMore', 'readyForTinyExecutionPrototype']).toContain(boundary.status);
      expect(boundary.disposition).toBe('executionBoundaryDecisionOnly');
      expect(['acceptedForMockScoring', 'rejected']).toContain(adapterValidation.status);
      expect(adapterValidation.disposition).toBe('adapterValidationOnly');
      expect(['readyForOneRealPrototype', 'holdForAdapterGuardrails', 'stopBeforeExecution']).toContain(goNoGo.status);
      expect(goNoGo.disposition).toBe('executionPrototypeGoNoGoOnly');
      expect(['readyForContainedPrototype', 'holdForMissingEvidence', 'blocked']).toContain(preflight.status);
      expect(preflight.disposition).toBe('executionPreflightOnly');
      expect(['availableForReview', 'missingDraft']).toContain(auditTrail.status);
      expect(auditTrail.disposition).toBe('adapterAuditTrailOnly');
      expect(['containedForReview', 'blocked']).toContain(containment.status);
      expect(containment.disposition).toBe('executionContainmentGuardOnly');
      expect(exampleCheckpoint).toMatchObject({
        status: 'allClear',
        disposition: 'executionExampleMatrixCheckpointOnly'
      });
      expect(['readyForNextPhase', 'holdBeforeNextPhase', 'stopBeforeNextPhase']).toContain(phaseCloseout.status);
      expect(phaseCloseout.disposition).toBe('executionPhaseCloseoutOnly');
      expect(['reviewOnly', 'heldBack', 'blocked']).toContain(containedPrototype.status);
      expect(containedPrototype.disposition).toBe('containedExecutionPrototypeOnly');
      expect(['readyForReview', 'holdForReview', 'blocked']).toContain(containedPrototypeSummary.status);
      expect(containedPrototypeSummary.disposition).toBe('containedPrototypeSummaryOnly');
      expect(['materialForReview', 'minorMovement', 'blocked']).toContain(containedMateriality.status);
      expect(containedMateriality.disposition).toBe('containedPrototypeMaterialityOnly');
      expect(['available', 'heldBack', 'blocked']).toContain(containedExplanation.status);
      expect(containedExplanation.disposition).toBe('containedPrototypeExplanationOnly');
      expect(containedLimitations).toMatchObject({
        status: 'visible',
        disposition: 'containedPrototypeLimitationsOnly'
      });
      expect(['usefulForReview', 'holdForClearerEvidence', 'notUseful']).toContain(containedUsefulness.status);
      expect(containedUsefulness.disposition).toBe('containedPrototypeUsefulnessOnly');
      expect(['compactEnough', 'tooDense']).toContain(containedDetailsDensity.status);
      expect(containedDetailsDensity.disposition).toBe('containedPrototypeDensityOnly');
      expect(['readyForReview', 'holdBeforeReview', 'blocked']).toContain(containedReviewChecklist.status);
      expect(containedReviewChecklist.disposition).toBe('containedPrototypeChecklistOnly');
      expect(containedExampleGate).toMatchObject({
        status: 'examplesClear',
        disposition: 'containedPrototypeExampleGateOnly'
      });
      expect(['copyClear', 'blocked']).toContain(containedCopyGuard.status);
      expect(containedCopyGuard.disposition).toBe('containedPrototypeCopyGuardOnly');
      expect(['keepInDetails', 'holdForUxPolish', 'doNotPromote']).toContain(containedProductGoNoGo.status);
      expect(containedProductGoNoGo.disposition).toBe('containedPrototypeProductGoNoGoOnly');
      expect(containedProductGoNoGo.reviewNote).toContain('does not move the prototype into Overview');
      expect(['readyForLaterUx', 'holdInDetails', 'blocked']).toContain(containedPromotionReadiness.status);
      expect(containedPromotionReadiness.disposition).toBe('containedPrototypePromotionReadinessOnly');
      expect(['available', 'held']).toContain(containedNextStepGuide.status);
      expect(containedNextStepGuide.disposition).toBe('containedPrototypeNextStepGuideOnly');
      expect(['clear', 'hasHolds', 'blocked']).toContain(containedBlockerRegister.status);
      expect(containedBlockerRegister.disposition).toBe('containedPrototypeBlockerRegisterOnly');
      expect(containedExamplePromotionGate).toMatchObject({
        status: 'examplesClear',
        disposition: 'containedPrototypeExamplePromotionGateOnly'
      });
      expect(['readyForNextDesignPhase', 'holdBeforeNextPhase', 'stopBeforeNextPhase']).toContain(containedPhaseMilestone.status);
      expect(containedPhaseMilestone.disposition).toBe('containedPrototypePhaseMilestoneOnly');
      if (comparison.status === 'reviewOnly') {
        expect(comparison.evidenceRows.map((row) => row.id)).toEqual(['funding', 'tax', 'oasRecovery', 'estate']);
        expect(comparison.decisionGate.rows.map((row) => row.id)).toEqual(['materiality', 'funding', 'estate', 'survivor', 'lockedIn', 'savedPlan']);
        expect(comparison.reviewNote).toContain('does not create account instructions');
        const fundingRow = comparison.decisionGate.rows.find((row) => row.id === 'funding');
        const materialityRow = comparison.decisionGate.rows.find((row) => row.id === 'materiality');
        expect(fundingRow, `${card.id} funding gate row`).toBeTruthy();
        expect(materialityRow, `${card.id} materiality gate row`).toBeTruthy();
        if (comparison.decisionGate.status === 'eligibleForReview') {
          expect(fundingRow?.status, `${card.id} eligible funding row`).toBe('ok');
          expect(materialityRow?.status, `${card.id} eligible materiality row`).toBe('ok');
          expect(comparison.decisionGate.headline).toContain('not a recommendation');
        }
        if (comparison.decisionGate.status === 'blocked') {
          expect(comparison.decisionGate.rows.some((row) => row.status === 'blocked'), `${card.id} blocked gate row`).toBe(true);
        }
      } else {
        expect(comparison.evidenceRows).toEqual([]);
        expect(comparison.reviewNote).toContain('Hidden comparison only');
      }

      expect(saved.plan).not.toHaveProperty('drawdownComparison');
      expect(saved.plan).not.toHaveProperty('hiddenDrawdownComparison');
      expect(saved.plan).not.toHaveProperty('singleRegisteredTimingCheck');
      expect(saved.plan).not.toHaveProperty('drawdownExecutionContract');
      expect(saved.plan).not.toHaveProperty('runtimeDrawdownOverridePayload');
      expect(saved.plan).not.toHaveProperty('internalDrawdownDryRun');
      expect(saved.plan).not.toHaveProperty('drawdownVisibleReviewGate');
      expect(saved.plan).not.toHaveProperty('drawdownReviewPreview');
      expect(saved.plan).not.toHaveProperty('drawdownPhaseReview');
      expect(saved.plan).not.toHaveProperty('drawdownExecutionBoundaryDecision');
      expect(saved.plan).not.toHaveProperty('drawdownAnnualOverrideAdapter');
      expect(saved.plan).not.toHaveProperty('drawdownAdapterValidation');
      expect(saved.plan).not.toHaveProperty('mockedExecutionScorecard');
      expect(saved.plan).not.toHaveProperty('drawdownExecutionPrototypeGoNoGo');
      expect(saved.plan).not.toHaveProperty('drawdownExecutionPreflight');
      expect(saved.plan).not.toHaveProperty('drawdownAdapterAuditTrail');
      expect(saved.plan).not.toHaveProperty('drawdownExecutionContainmentGuard');
      expect(saved.plan).not.toHaveProperty('drawdownExecutionExampleMatrixCheckpoint');
      expect(saved.plan).not.toHaveProperty('drawdownExecutionPhaseCloseout');
      expect(saved.plan).not.toHaveProperty('containedDrawdownExecutionPrototype');
      expect(saved.plan).not.toHaveProperty('containedDrawdownPrototypeSummary');
      expect(saved.plan).not.toHaveProperty('containedDrawdownMateriality');
      expect(saved.plan).not.toHaveProperty('containedDrawdownExplanation');
      expect(saved.plan).not.toHaveProperty('containedDrawdownLimitations');
      expect(saved.plan).not.toHaveProperty('containedDrawdownUsefulnessCloseout');
      expect(saved.plan).not.toHaveProperty('containedDrawdownDetailsDensity');
      expect(saved.plan).not.toHaveProperty('containedDrawdownReviewChecklist');
      expect(saved.plan).not.toHaveProperty('containedDrawdownExampleGate');
      expect(saved.plan).not.toHaveProperty('containedDrawdownCopyGuard');
      expect(saved.plan).not.toHaveProperty('containedDrawdownProductGoNoGo');
      expect(saved.plan).not.toHaveProperty('containedDrawdownPromotionReadiness');
      expect(saved.plan).not.toHaveProperty('containedDrawdownNextStepGuide');
      expect(saved.plan).not.toHaveProperty('containedDrawdownBlockerRegister');
      expect(saved.plan).not.toHaveProperty('containedDrawdownExamplePromotionGate');
      expect(saved.plan).not.toHaveProperty('containedDrawdownPhaseMilestoneCloseout');
      expect(saved.plan).not.toHaveProperty('annualOverrides');
      for (const phrase of forbidden) {
        expect(copy, `${card.id} hidden comparison forbidden phrase: ${phrase}`).not.toContain(phrase);
      }
    }
  });
});
