import { describe, expect, it } from 'vitest';
import { cleanExamplePlanCards, createCleanExampleRuntimePlan, createExamplePlan, examplePlanCards } from '../data/examplePlans';
import { createPlanFile } from '../data/planFile';
import { selectDrawdownReadinessSummary, selectSpendingStressSummary } from './resultSelectors';
import { runBoundedOptimizer, selectOptimizerExperimentalDraftExampleMatrix, type BoundedOptimizerCandidateRow } from './boundedOptimizer';
import { runResultsPreviewBundle } from './previewScenarios';
import { runSingleDrawdownComparison, selectHiddenDrawdownComparisonGuardrails } from './drawdownComparison';
import {
  buildDrawdownAnnualOverrideAdapterDraft,
  buildDrawdownExecutionContract,
  buildTaxAwareDrawdownV1ExecutionCandidate,
  emptyMockedExecutionScorecard,
  runContainedDrawdownExecutionPrototype,
  runTaxAwareDrawdownV1Execution,
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
  selectDrawdownVisibleReviewGate,
  selectTaxAwareDrawdownV1ExampleGate,
  selectTaxAwareDrawdownV1ConsumerCloseout,
  selectTaxAwareDrawdownV1ConsumerExampleGate,
  selectTaxAwareDrawdownV1ConsumerLimits,
  selectTaxAwareDrawdownV1ConsumerSummary,
  selectTaxAwareDrawdownV1CheckpointReview,
  selectTaxAwareDrawdownV1DetailsPlacement,
  selectTaxAwareDrawdownV1ExecutionIntent,
  selectTaxAwareDrawdownV1ExecutionReview,
  selectTaxAwareDrawdownV1PhaseCloseout,
  selectTaxAwareDrawdownV1ImplementationCloseout,
  selectTaxAwareDrawdownV1ImplementationGate,
  selectTaxAwareDrawdownV1NextSprintPlan,
  selectTaxAwareDrawdownV1RecommendedPlanCloseout,
  selectTaxAwareDrawdownV1RecommendedPlanExampleGate,
  selectTaxAwareDrawdownV1RecommendedPlanNarrative,
  selectTaxAwareDrawdownV1RecommendedPlanReview,
  selectTaxAwareDrawdownV1ReentryCloseout,
  selectTaxAwareDrawdownV1ReentryReview,
  selectTaxAwareDrawdownV1ReviewCopyGuard,
  selectTaxAwareDrawdownV1SafetyChecklist,
  selectTaxAwareDrawdownV1UxComparisonCard,
  selectTaxAwareDrawdownV1UxCopyGuard,
  selectTaxAwareDrawdownV1UxHeadline,
  selectTaxAwareDrawdownV1UxReadinessCloseout,
  selectTaxAwareDrawdownV1UxReviewActions
} from './drawdownExecutionReadiness';

const DISRUPTIVE_LEVERS = new Set(['spending', 'retirementTiming', 'benefitTiming']);
const CAPACITY_RUNTIME_KEYS = [
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
];

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
      expect(['covered', 'tight', 'gap', 'cannotTell', 'blocked']).toContain(item.optimizer.capacityObjective.status);
      expect(item.optimizer.capacityObjective.boundary).toContain('runtime-only');
      expect(item.optimizer.capacityObjective.withdrawalSequencing).toBe('deferred');
      expect(item.optimizer.capacityObjective.rows.find((row) => row.id === 'minimumFloor'), `${item.card.id} capacity floor row`).toBeTruthy();
      expect(item.optimizer.capacityReportReadiness.boundary).toContain('does not change printable report output');
      expect(item.optimizer.capacityReportReadiness.reportFields).toEqual(
        expect.arrayContaining(['monthlyAfterTaxCapacity', 'minimumMonthlyExpenseFloor', 'withdrawalSequencingDeferred'])
      );
      expect(item.optimizer.capacityExportGuard.forbiddenSavedKeys).toEqual(
        expect.arrayContaining([
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
        ])
      );
      expect(item.optimizer.capacityExportGuard.rows.find((row) => row.id === 'planFile')).toMatchObject({ status: 'blocked' });
      expect(item.optimizer.capacityExportGuard.rows.find((row) => row.id === 'reportOutput')).toMatchObject({ status: 'deferred' });
      expect(item.optimizer.capacityExportGuard.rows.find((row) => row.id === 'csvOutput')).toMatchObject({ status: 'deferred' });
      expect(item.optimizer.annualSequencingPrepContract).toMatchObject({
        status: 'contractOnly',
        blockedOutputs: expect.arrayContaining(['annualAccountInstructions', 'accountOrder', 'taxBracketInstructions'])
      });
      expect(item.optimizer.annualSequencingPrepContract.rows.find((row) => row.id === 'outputBoundary')).toMatchObject({ status: 'blocked' });
      expect(['readyForDraftPlanning', 'needsInputs', 'blocked']).toContain(item.optimizer.annualSequencingInputAdapter.status);
      expect(item.optimizer.annualSequencingInputAdapter.boundary).toContain('does not produce account order');
      expect(item.optimizer.annualSequencingInputAdapter.rows.find((row) => row.id === 'outputBoundary')).toMatchObject({ status: 'blocked' });
      expect(['draftReady', 'needsInputs', 'blocked']).toContain(item.optimizer.experimentalAccountOrderDraft.status);
      expect(item.optimizer.experimentalAccountOrderDraft.audience).toBe('syntheticTesterOnly');
      expect(item.optimizer.experimentalAccountOrderDraft.boundary).toContain('runtime-only experimental account-order draft');
      expect(['draftReady', 'needsInputs', 'blocked']).toContain(item.optimizer.experimentalAnnualInstructionDraft.status);
      expect(item.optimizer.experimentalAnnualInstructionDraft.audience).toBe('syntheticTesterOnly');
      expect(item.optimizer.experimentalAnnualInstructionDraft.boundary).toContain('runtime-only experimental draft rows');
      expect(item.optimizer.experimentalAnnualInstructionDraft.taxContextRows.find((row) => row.id === 'boundary')).toMatchObject({ status: 'blocked' });
      expect(['higher', 'medium', 'low', 'blocked']).toContain(item.optimizer.experimentalAnnualInstructionDraft.confidence.level);
      expect(item.optimizer.experimentalAnnualInstructionDraft.confidence.rows.find((row) => row.id === 'outputBoundary')).toMatchObject({ status: 'pass' });
      expect(item.optimizer.experimentalAnnualInstructionDraft.harmChecks.find((row) => row.id === 'outputBoundary')).toMatchObject({ status: 'pass' });
      expect(item.optimizer.experimentalAnnualInstructionDraft.harmChecks.map((row) => row.id)).toEqual(
        expect.arrayContaining(['shortfall', 'survivorReview', 'oasRecovery', 'taxContext'])
      );
      expect(['readyForTesterReview', 'reviewFirst', 'blocked']).toContain(item.optimizer.experimentalAnnualInstructionDraft.readinessSummary.status);
      expect(item.optimizer.experimentalAnnualInstructionDraft.readinessSummary.boundary).toContain('runtime-only');
      expect(JSON.stringify(item.optimizer.experimentalAnnualInstructionDraft).toLowerCase()).not.toContain('stay under');

      expect(item.saved.plan).not.toHaveProperty('boundedOptimizer');
      expect(item.saved.plan).not.toHaveProperty('optimizerContract');
      for (const key of CAPACITY_RUNTIME_KEYS) {
        expect(item.saved.plan, `${item.card.id} saved plan excludes ${key}`).not.toHaveProperty(key);
      }
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

  it('keeps capacity objective packets runtime-only when example plans are accidentally enriched before save', () => {
    for (const card of examplePlanCards) {
      const plan = createExamplePlan(card.id);
      const optimizer = runBoundedOptimizer(plan);
      const runtimeEnrichedPlan = {
        ...plan,
        capacityObjective: optimizer.capacityObjective,
        capacityReportReadiness: optimizer.capacityReportReadiness,
        capacityExportGuard: optimizer.capacityExportGuard,
        annualSequencingPrepContract: optimizer.annualSequencingPrepContract,
        annualSequencingInputAdapter: optimizer.annualSequencingInputAdapter,
        experimentalAccountOrderDraft: optimizer.experimentalAccountOrderDraft,
        experimentalAnnualInstructionDraft: optimizer.experimentalAnnualInstructionDraft,
        boundedOptimizer: optimizer,
        optimizerOutput: { selectedCandidateId: optimizer.suggestedCandidateId },
        annualAccountInstructions: [{ year: plan.assumptions.retireYear, account: 'rrsp', amount: 1 }]
      };
      const saved = createPlanFile(runtimeEnrichedPlan);
      const serialized = JSON.stringify(saved);

      for (const key of CAPACITY_RUNTIME_KEYS) {
        expect(saved.plan, `${card.id} saved enriched plan excludes ${key}`).not.toHaveProperty(key);
      }
      expect(serialized, `${card.id} serialized saved plan excludes monthly capacity`).not.toContain('monthlyAfterTaxCapacity');
      expect(serialized, `${card.id} serialized saved plan excludes sequencing prep`).not.toContain('annualSequencingPrepContract');
      expect(serialized, `${card.id} serialized saved plan excludes sequencing adapter`).not.toContain('annualSequencingInputAdapter');
      expect(serialized, `${card.id} serialized saved plan excludes account order draft`).not.toContain('experimentalAccountOrderDraft');
      expect(serialized, `${card.id} serialized saved plan excludes annual instruction draft`).not.toContain('experimentalAnnualInstructionDraft');
      expect(serialized, `${card.id} serialized saved plan excludes account order`).not.toContain('accountOrder');
      expect(serialized, `${card.id} serialized saved plan excludes selected candidate`).not.toContain('selectedCandidateId');
      expect(serialized, `${card.id} serialized saved plan excludes account instructions`).not.toContain('annualAccountInstructions');
    }
  });

  it('runs fresh clean examples through capacity objective runtime expectations without saved optimizer output', () => {
    for (const card of cleanExamplePlanCards) {
      const plan = createCleanExampleRuntimePlan(card.id);
      const optimizer = runBoundedOptimizer(plan);
      const saved = createPlanFile({
        ...plan,
        capacityObjective: optimizer.capacityObjective,
        capacityReportReadiness: optimizer.capacityReportReadiness,
        capacityExportGuard: optimizer.capacityExportGuard,
        annualSequencingPrepContract: optimizer.annualSequencingPrepContract,
        annualSequencingInputAdapter: optimizer.annualSequencingInputAdapter,
        experimentalAccountOrderDraft: optimizer.experimentalAccountOrderDraft,
        experimentalAnnualInstructionDraft: optimizer.experimentalAnnualInstructionDraft
      });

      expect(['covered', 'tight', 'gap', 'cannotTell', 'blocked']).toContain(optimizer.capacityObjective.status);
      expect(optimizer.capacityObjective.boundary, `${card.id} capacity boundary`).toContain('runtime-only');
      expect(optimizer.capacityObjective.rows.find((row) => row.id === 'withdrawalSequencing')).toMatchObject({ status: 'deferred' });
      expect(optimizer.capacityReportReadiness.nextStep).toContain('Plan report rendering separately');
      expect(optimizer.capacityExportGuard.rows.find((row) => row.id === 'schemaBoundary')).toMatchObject({ status: 'blocked' });
      expect(optimizer.annualSequencingPrepContract.boundary).toContain('does not implement annual account-level sequencing');
      expect(optimizer.annualSequencingPrepContract.blockedOutputs).toContain('savedSequencingOutput');
      expect(optimizer.annualSequencingInputAdapter.nextStep).toContain('experimental account-order draft');
      expect(optimizer.experimentalAccountOrderDraft.blockedOutputs).toContain('savedAccountOrder');
      expect(optimizer.experimentalAnnualInstructionDraft.blockedOutputs).toContain('savedInstructionOutput');
      expect(optimizer.experimentalAnnualInstructionDraft.rows.every((row) => row.source.withdrawalField.length > 0)).toBe(true);
      expect(optimizer.experimentalAnnualInstructionDraft.rows.every((row) => row.grouping.yearAccountIndex >= 1)).toBe(true);
      expect(optimizer.experimentalAnnualInstructionDraft.rows.every((row) => row.rationale.includes('runtime draft mirrors'))).toBe(true);
      expect(optimizer.experimentalAnnualInstructionDraft.annualAccountTotals.every((total) => total.totalAmount > 0)).toBe(true);
      expect(optimizer.experimentalAnnualInstructionDraft.annualAccountTotals.every((total) => ['contiguous', 'gapped', 'partial'].includes(total.accountOrder.status))).toBe(true);
      expect(optimizer.experimentalAnnualInstructionDraft.annualInstructionCandidates.every((candidate) => ['readyForReview', 'reviewFirst', 'blocked'].includes(candidate.status))).toBe(true);
      expect(optimizer.experimentalAnnualInstructionDraft.annualInstructionCandidates.every((candidate) => candidate.boundary.includes('runtime-only'))).toBe(true);
      expect(optimizer.experimentalAnnualInstructionDraft.annualInstructionCandidates.every((candidate) => ['higher', 'medium', 'low', 'blocked'].includes(candidate.quality.level))).toBe(true);
      expect(optimizer.experimentalAnnualInstructionDraft.annualInstructionCandidates.every((candidate) => candidate.quality.rows.map((row) => row.id).includes('outputBoundary'))).toBe(true);
      expect(optimizer.experimentalAnnualInstructionDraft.annualInstructionCandidates.every((candidate) => candidate.quality.repairTargets.length > 0)).toBe(true);
      expect(['readyForTesterReview', 'reviewFirst', 'blocked']).toContain(optimizer.experimentalAnnualInstructionDraft.candidateSelectionSummary.status);
      expect(
        Object.values(optimizer.experimentalAnnualInstructionDraft.candidateSelectionSummary.qualityCounts).reduce((sum, count) => sum + count, 0)
      ).toBe(optimizer.experimentalAnnualInstructionDraft.annualInstructionCandidates.length);
      expect(optimizer.experimentalAnnualInstructionDraft.candidateSelectionSummary.repairThemes.every((theme) => ['pass', 'repair'].includes(theme.status))).toBe(true);
      expect(optimizer.experimentalAnnualInstructionDraft.candidateSelectionSummary.boundary).toContain('runtime-only');
      expect(['readyForTesterReview', 'reviewFirst', 'blocked']).toContain(optimizer.experimentalAnnualInstructionDraft.presentationReadiness.status);
      expect(optimizer.experimentalAnnualInstructionDraft.presentationReadiness.displayRows.length).toBe(optimizer.experimentalAnnualInstructionDraft.annualInstructionCandidates.length);
      expect(optimizer.experimentalAnnualInstructionDraft.presentationReadiness.rows.map((row) => row.id)).toContain('boundary');
      expect(optimizer.experimentalAnnualInstructionDraft.presentationReadiness.boundary).toContain('runtime-only');
      expect(['readyForSyntheticTesterPacket', 'reviewFirst', 'blocked']).toContain(optimizer.experimentalAnnualInstructionDraft.testerPacketBoundary.status);
      expect(optimizer.experimentalAnnualInstructionDraft.testerPacketBoundary.visibleSections).toContain('candidateDisplayRows');
      expect(optimizer.experimentalAnnualInstructionDraft.testerPacketBoundary.hiddenSections).toContain('finalAnnualInstructions');
      expect(optimizer.experimentalAnnualInstructionDraft.testerPacketBoundary.testerCopy.boundary).toContain('not a retirement plan');
      expect(optimizer.experimentalAnnualInstructionDraft.testerPacketBoundary.blockedOutputs).toContain('csvSequencingOutput');
      expect(optimizer.experimentalAnnualInstructionDraft.instructionReadiness.rows.map((row) => row.id)).toContain('accountOrderGaps');
      expect(optimizer.experimentalAnnualInstructionDraft.instructionReadiness.blockedOutputs).toContain('annualAccountInstructions');
      expect(optimizer.experimentalAnnualInstructionDraft.instructionReadiness.boundary).toContain('runtime-only');
      expect(optimizer.experimentalAnnualInstructionDraft.taxContextRows.map((row) => row.id)).toContain('effectiveRate');
      expect(optimizer.experimentalAnnualInstructionDraft.confidence.summary).toContain('Draft confidence');
      expect(optimizer.experimentalAnnualInstructionDraft.harmChecks.map((row) => row.id)).toContain('shortfall');
      expect(optimizer.experimentalAnnualInstructionDraft.readinessSummary.nextStep).toBeTruthy();
      for (const key of CAPACITY_RUNTIME_KEYS) {
        expect(saved.plan, `${card.id} saved clean runtime excludes ${key}`).not.toHaveProperty(key);
      }
    }
  });

  it('scores experimental draft readiness across bundled and clean examples without export output', () => {
    const bundledExamples = examplePlanCards.map((card) => {
      const optimizer = runBoundedOptimizer(createExamplePlan(card.id));
      return {
        id: card.id,
        label: card.label,
        draft: optimizer.experimentalAnnualInstructionDraft
      };
    });
    const cleanExamples = cleanExamplePlanCards.map((card) => {
      const optimizer = runBoundedOptimizer(createCleanExampleRuntimePlan(card.id));
      return {
        id: card.id,
        label: card.label,
        draft: optimizer.experimentalAnnualInstructionDraft
      };
    });
    const matrix = selectOptimizerExperimentalDraftExampleMatrix([...bundledExamples, ...cleanExamples]);

    for (const example of cleanExamples) {
      expect(example.draft.rows.length, `${example.id} clean example draft rows`).toBeGreaterThanOrEqual(3);
      expect(example.draft.readinessSummary.rowCoverage.modelledYears, `${example.id} clean example modelled years`).toBeGreaterThan(0);
      expect(example.draft.confidence.level, `${example.id} clean example confidence`).not.toBe('blocked');
    }
    expect(matrix.exampleCount).toBe(examplePlanCards.length + cleanExamplePlanCards.length);
    expect(matrix.items).toHaveLength(matrix.exampleCount);
    expect(['readyForTesterReview', 'reviewFirst', 'blocked']).toContain(matrix.status);
    expect(matrix.readyCount + matrix.reviewFirstCount + matrix.blockedCount).toBe(matrix.exampleCount);
    expect(matrix.items.every((item) => ['readyForTesterReview', 'reviewFirst', 'blocked'].includes(item.status))).toBe(true);
    expect(matrix.items.every((item) => item.draftRows >= 0 && item.modelledYears >= 0)).toBe(true);
    expect(matrix.repairTargets.map((target) => target.id)).toEqual(['rowCoverage', 'blockers', 'watchItems', 'taxContext', 'confidence']);
    expect(matrix.repairTargets.every((target) => ['pass', 'repair'].includes(target.status))).toBe(true);
    expect(matrix.repairTargets.every((target) => Array.isArray(target.exampleIds))).toBe(true);
    expect(matrix.repairTargets.every((target) => target.repairAction.length > 0)).toBe(true);
    expect(matrix.boundary).toContain('runtime-only');
    expect(matrix.boundary).not.toContain('CSV export is ready');
    expect(JSON.stringify(matrix).toLowerCase()).not.toContain('stay under');
    expect(JSON.stringify(matrix).toLowerCase()).not.toContain('use this bracket');
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

      const withdrawalEvidence = summary.evidenceRows.filter((row) => row.id.startsWith('withdrawalFamily'));
      const evidenceCopy = JSON.stringify(withdrawalEvidence).toLowerCase();
      if (summary.candidates.find((row) => row.id === summary.suggestedCandidateId)?.changedLevers.includes('withdrawalOrder')) {
        expect(withdrawalEvidence.length, `${card.id} withdrawal evidence`).toBeGreaterThan(0);
        expect(evidenceCopy, `${card.id} withdrawal evidence`).toContain('broad withdrawal');
        expect(evidenceCopy, `${card.id} withdrawal evidence`).toContain('current plan');
      }
      expect(evidenceCopy, `${card.id} withdrawal evidence`).not.toContain('withdraw from this account');
      expect(evidenceCopy, `${card.id} withdrawal evidence`).not.toContain('withdraw $');
      expect(evidenceCopy, `${card.id} withdrawal evidence`).not.toContain('tax-bracket optimization');
    }
  });

  it('keeps benefit-timing evidence review-oriented across the example matrix', () => {
    for (const card of examplePlanCards) {
      const summary = runBoundedOptimizer(createExamplePlan(card.id));
      const benefitRows = summary.candidates.filter((row) => row.changedLevers.includes('benefitTiming'));
      const evidenceCopy = summary.evidenceRows
        .filter((row) => row.id.startsWith('benefit'))
        .map((row) => `${row.label} ${row.value} ${row.detail}`)
        .join(' ')
        .toLowerCase();

      if (summary.eligibilityNotes.find((note) => note.lever === 'benefitTiming')?.status === 'eligible') {
        expect(benefitRows.length, `${card.id} benefit timing candidates`).toBeGreaterThan(0);
        expect(summary.evidenceRows.find((row) => row.id === 'benefitGridTopThree'), `${card.id} top-three evidence`).toBeTruthy();
        expect(evidenceCopy, `${card.id} benefit evidence`).toContain('review');
        expect(evidenceCopy, `${card.id} benefit evidence`).toContain('compare');
      }

      expect(evidenceCopy, `${card.id} benefit evidence`).not.toContain('optimal');
      expect(evidenceCopy, `${card.id} benefit evidence`).not.toContain('guaranteed');
      expect(evidenceCopy, `${card.id} benefit evidence`).not.toContain('do this');
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
      const v1Intent = selectTaxAwareDrawdownV1ExecutionIntent({ plan, phaseMilestone: containedPhaseMilestone });
      const v1Candidate = buildTaxAwareDrawdownV1ExecutionCandidate({
        plan,
        intent: v1Intent,
        adapterValidation
      });
      const v1Execution = runTaxAwareDrawdownV1Execution({ plan, candidate: v1Candidate });
      const v1Review = selectTaxAwareDrawdownV1ExecutionReview({
        plan,
        intent: v1Intent,
        candidate: v1Candidate,
        execution: v1Execution
      });
      const v1ExampleGate = selectTaxAwareDrawdownV1ExampleGate({
        exampleCount: examplePlanCards.length,
        heldOrBlockedCount: 0
      });
      const v1Closeout = selectTaxAwareDrawdownV1PhaseCloseout({
        plan,
        intent: v1Intent,
        review: v1Review,
        exampleGate: v1ExampleGate
      });
      const v1ConsumerSummary = selectTaxAwareDrawdownV1ConsumerSummary({ execution: v1Execution, review: v1Review });
      const v1SafetyChecklist = selectTaxAwareDrawdownV1SafetyChecklist({ plan, execution: v1Execution });
      const v1ConsumerLimits = selectTaxAwareDrawdownV1ConsumerLimits();
      const v1ConsumerExampleGate = selectTaxAwareDrawdownV1ConsumerExampleGate({
        exampleCount: examplePlanCards.length,
        heldOrBlockedCount: 0
      });
      const v1ConsumerCloseout = selectTaxAwareDrawdownV1ConsumerCloseout({
        plan,
        summary: v1ConsumerSummary,
        safety: v1SafetyChecklist,
        limits: v1ConsumerLimits,
        exampleGate: v1ConsumerExampleGate
      });
      const v1UxHeadline = selectTaxAwareDrawdownV1UxHeadline({ consumerCloseout: v1ConsumerCloseout });
      const v1UxComparison = selectTaxAwareDrawdownV1UxComparisonCard({ execution: v1Execution });
      const v1UxActions = selectTaxAwareDrawdownV1UxReviewActions({ consumerCloseout: v1ConsumerCloseout });
      const v1UxCopyGuard = selectTaxAwareDrawdownV1UxCopyGuard(plan);
      const v1UxReadiness = selectTaxAwareDrawdownV1UxReadinessCloseout({
        plan,
        headline: v1UxHeadline,
        comparison: v1UxComparison,
        actions: v1UxActions,
        copyGuard: v1UxCopyGuard
      });
      const v1Reentry = selectTaxAwareDrawdownV1ReentryReview({
        plan,
        detailedStressDecision: {
          status: 'readyToReturnToV1Drawdown',
          headline: 'Detailed stress stays in the detailed report for v1.',
          detail: 'Detailed stress stays in the detailed report while bounded drawdown review remains in Details.',
          rows: [],
          reviewNote: 'Detailed stress decision closeout only.',
          disposition: 'detailedStressV1DecisionCloseoutOnly'
        },
        executionPhase: v1Closeout,
        uxReadiness: v1UxReadiness
      });
      const v1ReentryCloseout = selectTaxAwareDrawdownV1ReentryCloseout({
        reentry: v1Reentry,
        nextSprint: selectTaxAwareDrawdownV1NextSprintPlan({ reentry: v1Reentry })
      });
      const v1RecommendedPlanReview = selectTaxAwareDrawdownV1RecommendedPlanReview({
        plan,
        reentryCloseout: v1ReentryCloseout,
        consumerSummary: v1ConsumerSummary,
        comparison: v1UxComparison,
        limits: v1ConsumerLimits
      });
      const v1DetailsPlacement = selectTaxAwareDrawdownV1DetailsPlacement({
        review: v1RecommendedPlanReview,
        headline: v1UxHeadline,
        comparison: v1UxComparison,
        actions: v1UxActions
      });
      const v1ReviewCopyGuard = selectTaxAwareDrawdownV1ReviewCopyGuard();
      const v1RecommendedPlanCloseout = selectTaxAwareDrawdownV1RecommendedPlanCloseout({
        plan,
        review: v1RecommendedPlanReview,
        placement: v1DetailsPlacement,
        copyGuard: v1ReviewCopyGuard
      });
      const v1ImplementationGate = selectTaxAwareDrawdownV1ImplementationGate({
        plan,
        closeout: v1RecommendedPlanCloseout,
        consumerSummary: v1ConsumerSummary,
        safety: v1SafetyChecklist,
        limits: v1ConsumerLimits,
        copyGuard: v1ReviewCopyGuard
      });
      const v1RecommendedPlanNarrative = selectTaxAwareDrawdownV1RecommendedPlanNarrative({
        gate: v1ImplementationGate,
        headline: v1UxHeadline,
        comparison: v1UxComparison,
        actions: v1UxActions,
        limits: v1ConsumerLimits
      });
      const v1RecommendedPlanExampleGate = selectTaxAwareDrawdownV1RecommendedPlanExampleGate({
        exampleCount: examplePlanCards.length,
        heldOrBlockedCount: 0
      });
      const v1ImplementationCloseout = selectTaxAwareDrawdownV1ImplementationCloseout({
        plan,
        gate: v1ImplementationGate,
        narrative: v1RecommendedPlanNarrative,
        exampleGate: v1RecommendedPlanExampleGate
      });
      const v1CheckpointReview = selectTaxAwareDrawdownV1CheckpointReview({
        plan,
        implementationCloseout: v1ImplementationCloseout,
        narrative: v1RecommendedPlanNarrative,
        exampleGate: v1RecommendedPlanExampleGate
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
        containedPhaseMilestone,
        v1Intent,
        v1Candidate,
        v1Execution,
        v1Review,
        v1ExampleGate,
        v1Closeout,
        v1ConsumerSummary,
        v1SafetyChecklist,
        v1ConsumerLimits,
        v1ConsumerExampleGate,
        v1ConsumerCloseout,
        v1UxHeadline,
        v1UxComparison,
        v1UxActions,
        v1UxCopyGuard,
        v1UxReadiness,
        v1Reentry,
        v1ReentryCloseout,
        v1RecommendedPlanReview,
        v1DetailsPlacement,
        v1ReviewCopyGuard,
        v1RecommendedPlanCloseout,
        v1ImplementationGate,
        v1RecommendedPlanNarrative,
        v1RecommendedPlanExampleGate,
        v1ImplementationCloseout,
        v1CheckpointReview
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
      expect(['readyForBoundedExecution', 'holdForReadiness', 'blocked']).toContain(v1Intent.status);
      expect(v1Intent.disposition).toBe('v1DrawdownExecutionIntentOnly');
      expect(['ready', 'hold', 'blocked']).toContain(v1Candidate.status);
      expect(v1Candidate.disposition).toBe('v1DrawdownExecutionCandidateOnly');
      expect(['reviewOnly', 'blocked', 'notReady']).toContain(v1Execution.status);
      expect(v1Execution.disposition).toBe('v1DrawdownExecutionResultOnly');
      expect(['readyForUserReview', 'holdForReview', 'blocked']).toContain(v1Review.status);
      expect(v1Review.disposition).toBe('v1DrawdownExecutionReviewOnly');
      expect(v1ExampleGate).toMatchObject({
        status: 'examplesClear',
        disposition: 'v1DrawdownExecutionExampleGateOnly'
      });
      expect(['readyForConsumerUx', 'holdForMoreGuardrails', 'stopBeforeConsumerUx']).toContain(v1Closeout.status);
      expect(v1Closeout.disposition).toBe('v1DrawdownExecutionPhaseCloseoutOnly');
      expect(['clearForReview', 'needsCare', 'blocked']).toContain(v1ConsumerSummary.status);
      expect(v1ConsumerSummary.disposition).toBe('v1DrawdownConsumerSummaryOnly');
      expect(['ready', 'hold', 'blocked']).toContain(v1SafetyChecklist.status);
      expect(v1SafetyChecklist.disposition).toBe('v1DrawdownSafetyChecklistOnly');
      expect(v1ConsumerLimits).toMatchObject({
        status: 'visible',
        disposition: 'v1DrawdownConsumerLimitsOnly'
      });
      expect(v1ConsumerExampleGate).toMatchObject({
        status: 'examplesClear',
        disposition: 'v1DrawdownConsumerExampleGateOnly'
      });
      expect(['readyForUxCopy', 'holdForCopyPolish', 'blocked']).toContain(v1ConsumerCloseout.status);
      expect(v1ConsumerCloseout.disposition).toBe('v1DrawdownConsumerCloseoutOnly');
      expect(['ready', 'hold', 'blocked']).toContain(v1UxHeadline.status);
      expect(v1UxHeadline.disposition).toBe('v1DrawdownUxHeadlineOnly');
      expect(['ready', 'hold', 'blocked']).toContain(v1UxComparison.status);
      expect(v1UxComparison.disposition).toBe('v1DrawdownUxComparisonCardOnly');
      expect(['available', 'held', 'blocked']).toContain(v1UxActions.status);
      expect(v1UxActions.disposition).toBe('v1DrawdownUxReviewActionsOnly');
      expect(['clear', 'blocked']).toContain(v1UxCopyGuard.status);
      expect(v1UxCopyGuard.disposition).toBe('v1DrawdownUxCopyGuardOnly');
      expect(['readyForDesign', 'holdForDesignPolish', 'blocked']).toContain(v1UxReadiness.status);
      expect(v1UxReadiness.disposition).toBe('v1DrawdownUxReadinessCloseoutOnly');
      expect(['readyForV1Drawdown', 'holdForReadiness', 'blocked']).toContain(v1Reentry.status);
      expect(v1Reentry.disposition).toBe('v1DrawdownReentryReviewOnly');
      expect(['readyToProceed', 'holdBeforeProceeding', 'blocked']).toContain(v1ReentryCloseout.status);
      expect(v1ReentryCloseout.disposition).toBe('v1DrawdownReentryCloseoutOnly');
      expect(['readyForDetails', 'holdForPolish', 'blocked']).toContain(v1RecommendedPlanReview.status);
      expect(v1RecommendedPlanReview.disposition).toBe('v1DrawdownRecommendedPlanReviewOnly');
      expect(['detailsReady', 'holdForPolish', 'blocked']).toContain(v1DetailsPlacement.status);
      expect(v1DetailsPlacement.disposition).toBe('v1DrawdownDetailsPlacementOnly');
      expect(['clear', 'blocked']).toContain(v1ReviewCopyGuard.status);
      expect(v1ReviewCopyGuard.disposition).toBe('v1DrawdownReviewCopyGuardOnly');
      expect(['readyForImplementation', 'holdForPolish', 'blocked']).toContain(v1RecommendedPlanCloseout.status);
      expect(v1RecommendedPlanCloseout.disposition).toBe('v1DrawdownRecommendedPlanCloseoutOnly');
      expect(['readyForRecommendedPlan', 'holdForMoreReview', 'blocked']).toContain(v1ImplementationGate.status);
      expect(v1ImplementationGate.disposition).toBe('v1DrawdownImplementationGateOnly');
      expect(['ready', 'held', 'blocked']).toContain(v1RecommendedPlanNarrative.status);
      expect(v1RecommendedPlanNarrative.disposition).toBe('v1DrawdownRecommendedPlanNarrativeOnly');
      expect(v1RecommendedPlanExampleGate).toMatchObject({
        status: 'examplesClear',
        disposition: 'v1DrawdownRecommendedPlanExampleGateOnly'
      });
      expect(['readyForV1Checkpoint', 'holdForReview', 'blocked']).toContain(v1ImplementationCloseout.status);
      expect(v1ImplementationCloseout.disposition).toBe('v1DrawdownImplementationCloseoutOnly');
      expect(['readyForFeedback', 'holdForCleanup', 'simplifyBeforeV1']).toContain(v1CheckpointReview.status);
      expect(v1CheckpointReview.disposition).toBe('v1DrawdownCheckpointReviewOnly');
      expect(v1CheckpointReview.reviewNote).toContain('does not apply a strategy');
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
      expect(saved.plan).not.toHaveProperty('v1DrawdownExecutionIntent');
      expect(saved.plan).not.toHaveProperty('v1DrawdownExecutionCandidate');
      expect(saved.plan).not.toHaveProperty('v1DrawdownExecutionResult');
      expect(saved.plan).not.toHaveProperty('v1DrawdownExecutionReview');
      expect(saved.plan).not.toHaveProperty('v1DrawdownExecutionExampleGate');
      expect(saved.plan).not.toHaveProperty('v1DrawdownExecutionPhaseCloseout');
      expect(saved.plan).not.toHaveProperty('v1DrawdownConsumerSummary');
      expect(saved.plan).not.toHaveProperty('v1DrawdownSafetyChecklist');
      expect(saved.plan).not.toHaveProperty('v1DrawdownConsumerLimits');
      expect(saved.plan).not.toHaveProperty('v1DrawdownConsumerExampleGate');
      expect(saved.plan).not.toHaveProperty('v1DrawdownConsumerCloseout');
      expect(saved.plan).not.toHaveProperty('v1DrawdownUxHeadline');
      expect(saved.plan).not.toHaveProperty('v1DrawdownUxComparisonCard');
      expect(saved.plan).not.toHaveProperty('v1DrawdownUxReviewActions');
      expect(saved.plan).not.toHaveProperty('v1DrawdownUxCopyGuard');
      expect(saved.plan).not.toHaveProperty('v1DrawdownUxReadinessCloseout');
      expect(saved.plan).not.toHaveProperty('v1DrawdownReentryReview');
      expect(saved.plan).not.toHaveProperty('v1DrawdownNextSprintPlan');
      expect(saved.plan).not.toHaveProperty('v1DrawdownReentryCloseout');
      expect(saved.plan).not.toHaveProperty('v1DrawdownRecommendedPlanReview');
      expect(saved.plan).not.toHaveProperty('v1DrawdownDetailsPlacement');
      expect(saved.plan).not.toHaveProperty('v1DrawdownReviewCopyGuard');
      expect(saved.plan).not.toHaveProperty('v1DrawdownRecommendedPlanCloseout');
      expect(saved.plan).not.toHaveProperty('v1DrawdownImplementationGate');
      expect(saved.plan).not.toHaveProperty('v1DrawdownRecommendedPlanNarrative');
      expect(saved.plan).not.toHaveProperty('v1DrawdownRecommendedPlanExampleGate');
      expect(saved.plan).not.toHaveProperty('v1DrawdownImplementationCloseout');
      expect(saved.plan).not.toHaveProperty('v1DrawdownCheckpointReview');
      expect(saved.plan).not.toHaveProperty('annualOverrides');
      for (const phrase of forbidden) {
        expect(copy, `${card.id} hidden comparison forbidden phrase: ${phrase}`).not.toContain(phrase);
      }
    }
  });
});
