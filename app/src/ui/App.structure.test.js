import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const appSource = readFileSync(new URL('./App.tsx', import.meta.url), 'utf8');
const boundedOptimizerSource = readFileSync(new URL('../engine/boundedOptimizer.ts', import.meta.url), 'utf8');
const stylesSource = readFileSync(new URL('./styles.css', import.meta.url), 'utf8');

describe('Results overview structure', () => {
  it('keeps audit-style evidence reachable from Details instead of the Overview flow', () => {
    const overviewStart = appSource.indexOf("activeSection === 'overview'");
    const overviewEnd = appSource.indexOf('<DeferredResultsPanel', overviewStart);
    const overviewBranch = appSource.slice(overviewStart, overviewEnd);
    const detailsStart = appSource.indexOf('function DetailsResultsPanel');
    const detailsEnd = appSource.indexOf('function FirstYearMoneyFlowPanel');
    const detailsPanel = appSource.slice(detailsStart, detailsEnd);

    expect(overviewBranch).toContain('<RetirementAnswerPanel');
    expect(overviewBranch).toContain('<SpendingCapacityPanel');
    expect(overviewBranch).toContain('<ReviewTheseFirstPanel');
    expect(overviewBranch).toContain('<OverviewHighlightsPanel');
    expect(overviewBranch).not.toContain('<EstateIntentPanel');
    expect(overviewBranch).not.toContain('<BoundedOptimizerPanel');
    expect(overviewBranch).not.toContain('<ResultsReadinessPanel');
    expect(overviewBranch).not.toContain('<ScenarioCardsPanel');
    expect(overviewBranch).not.toContain('<ScenarioAssumptionsPanel');
    expect(overviewBranch).not.toContain('<ScenarioComparisonPanel');
    expect(overviewBranch).not.toContain('<ProjectionPathPanel');
    expect(overviewBranch).not.toContain('<ReconciliationDiagnosticsPanel');
    expect(overviewBranch).not.toContain('<TaxPressurePanel');
    expect(overviewBranch).not.toContain('<OptimizerBoundaryPanel');

    expect(detailsPanel).toContain('<EstateIntentPanel');
    expect(detailsPanel).toContain('<SourceStoryPanel');
    expect(detailsPanel).toContain('<FirstYearMoneyFlowPanel');
    expect(detailsPanel).toContain('<DecisionChecklistPanel');
    expect(detailsPanel).toContain('<CompactTaxPressurePanel');
    expect(detailsPanel).toContain('<BoundedOptimizerPanel loading={loading} summary={boundedOptimizer} variant="compact"');
    expect(detailsPanel).toContain('<CompactDrawdownReviewSummaryPanel');
    expect(detailsPanel).not.toContain('<DrawdownReadinessPanel loading={loading} summary={drawdownReadiness} />\n      <CompactDrawdownReviewSummaryPanel');
    expect(detailsPanel).not.toContain('<HiddenDrawdownComparisonPanel comparison={hiddenDrawdownComparison} loading={loading} />\n      <CompactDrawdownReviewSummaryPanel');
    expect(detailsPanel).toContain('<FirstYearMoneyFlowPanel');
  });

  it('keeps normal consumer research gates disabled for the v1 feedback checkpoint', () => {
    const disabledGates = [
      'SHOW_CHECKPOINT_REVIEW_PANELS = false',
      'SHOW_DECISION_RESEARCH_PANELS = false',
      'SHOW_DRAWDOWN_RESEARCH_PANELS = false',
      'SHOW_MONEY_FLOW_RESEARCH_PANELS = false',
      'SHOW_OPTION_RESEARCH_PANELS = false',
      'SHOW_SCENARIO_RESEARCH_PANELS = false',
      'SHOW_TAX_RESEARCH_PANELS = false'
    ];

    disabledGates.forEach((gate) => {
      expect(appSource).toContain(gate);
    });
    expect(appSource).not.toContain('SHOW_CHECKPOINT_REVIEW_PANELS = true');
    expect(appSource).not.toContain('SHOW_DECISION_RESEARCH_PANELS = true');
    expect(appSource).not.toContain('SHOW_DRAWDOWN_RESEARCH_PANELS = true');
    expect(appSource).not.toContain('SHOW_MONEY_FLOW_RESEARCH_PANELS = true');
    expect(appSource).not.toContain('SHOW_OPTION_RESEARCH_PANELS = true');
    expect(appSource).not.toContain('SHOW_SCENARIO_RESEARCH_PANELS = true');
    expect(appSource).not.toContain('SHOW_TAX_RESEARCH_PANELS = true');
  });

  it('keeps normal Details tax evidence compact while preserving the full tax table behind a gate', () => {
    const detailsStart = appSource.indexOf('function DetailsResultsPanel');
    const detailsEnd = appSource.indexOf('function CompactDrawdownReviewSummaryPanel');
    const detailsPanel = appSource.slice(detailsStart, detailsEnd);
    const checkpointGateIndex = detailsPanel.indexOf('SHOW_CHECKPOINT_REVIEW_PANELS');
    const normalBeforeCheckpointGate = detailsPanel.slice(0, checkpointGateIndex);
    const compactTaxIndex = detailsPanel.indexOf('<CompactTaxPressurePanel');
    const taxGateIndex = detailsPanel.indexOf('SHOW_TAX_RESEARCH_PANELS');
    const taxResearchBranch = detailsPanel.slice(taxGateIndex);

    expect(appSource).toContain('SHOW_TAX_RESEARCH_PANELS = false');
    expect(appSource).toContain('Canadian tax pressure at a glance');
    expect(appSource).toContain('Open Taxes for the full taxable income, tax, OAS recovery, and registered-draw timeline.');
    expect(compactTaxIndex).toBeGreaterThan(0);
    expect(taxGateIndex).toBeGreaterThan(compactTaxIndex);
    expect(taxResearchBranch).toContain('<TaxPressurePanel');
    expect(detailsPanel.slice(0, taxGateIndex)).not.toContain('<TaxPressurePanel');
    expect(appSource).toContain('Ontario 2026 tax assumptions');
  });

  it('keeps normal Details decision evidence compact while preserving detail tables behind a gate', () => {
    const detailsStart = appSource.indexOf('function DetailsResultsPanel');
    const detailsEnd = appSource.indexOf('function CompactDrawdownReviewSummaryPanel');
    const detailsPanel = appSource.slice(detailsStart, detailsEnd);
    const checklistIndex = detailsPanel.indexOf('<DecisionChecklistPanel');
    const decisionGateIndex = detailsPanel.indexOf('SHOW_DECISION_RESEARCH_PANELS');
    const decisionResearchBranch = detailsPanel.slice(decisionGateIndex);

    expect(appSource).toContain('SHOW_DECISION_RESEARCH_PANELS = false');
    expect(checklistIndex).toBeGreaterThan(0);
    expect(decisionGateIndex).toBeGreaterThan(checklistIndex);
    expect(decisionResearchBranch).toContain('<DecisionDetailPanel');
    expect(decisionResearchBranch).toContain('<ProjectionPathPanel');
    expect(detailsPanel.slice(0, decisionGateIndex)).not.toContain('<DecisionDetailPanel');
    expect(detailsPanel.slice(0, decisionGateIndex)).not.toContain('<ProjectionPathPanel');
  });

  it('keeps normal Details money-flow evidence readable while preserving diagnostics behind a gate', () => {
    const detailsStart = appSource.indexOf('function DetailsResultsPanel');
    const detailsEnd = appSource.indexOf('function CompactDrawdownReviewSummaryPanel');
    const detailsPanel = appSource.slice(detailsStart, detailsEnd);
    const sourceStoryIndex = detailsPanel.indexOf('<SourceStoryPanel');
    const firstYearIndex = detailsPanel.indexOf('<FirstYearMoneyFlowPanel');
    const moneyFlowGateIndex = detailsPanel.indexOf('SHOW_MONEY_FLOW_RESEARCH_PANELS');
    const moneyFlowResearchBranch = detailsPanel.slice(moneyFlowGateIndex);

    expect(appSource).toContain('SHOW_MONEY_FLOW_RESEARCH_PANELS = false');
    expect(sourceStoryIndex).toBeGreaterThan(0);
    expect(firstYearIndex).toBeGreaterThan(sourceStoryIndex);
    expect(moneyFlowGateIndex).toBeGreaterThan(firstYearIndex);
    expect(moneyFlowResearchBranch).toContain('<ReconciliationDiagnosticsPanel');
    expect(detailsPanel.slice(0, moneyFlowGateIndex)).not.toContain('<ReconciliationDiagnosticsPanel');
  });

  it('keeps the Overview first screen reduced to answer, spending, review actions, and compact highlights', () => {
    const overviewStart = appSource.indexOf("activeSection === 'overview'");
    const overviewEnd = appSource.indexOf('<DeferredResultsPanel', overviewStart);
    const overviewBranch = appSource.slice(overviewStart, overviewEnd);
    const renderedPanels = [...overviewBranch.matchAll(/<([A-Z][A-Za-z0-9]+Panel)\b/g)].map((match) => match[1]);

    expect(renderedPanels).toEqual([
      'RetirementAnswerPanel',
      'SpendingCapacityPanel',
      'ReviewTheseFirstPanel',
      'OverviewHighlightsPanel'
    ]);
    expect(overviewBranch).not.toContain('estate-intent-panel');
    expect(overviewBranch).not.toContain('tax-pressure');
    expect(overviewBranch).not.toContain('diagnostic');
    expect(appSource).toContain('first five-minute read');
    expect(appSource).toContain('In the first five minutes, use this list after the answer and spending number.');
  });

  it('keeps first-results mobile layout guarded without adding Overview density', () => {
    expect(stylesSource).toContain('@media (max-width: 920px)');
    expect(stylesSource).toContain('@media (max-width: 640px)');
    expect(stylesSource).toContain('.retirement-answer-panel');
    expect(stylesSource).toContain('.spending-capacity-panel');
    expect(stylesSource).toContain('.review-first-panel');
    expect(stylesSource).toContain('.overview-highlights-panel');
    expect(stylesSource).toContain('.bounded-optimizer-panel');
    expect(stylesSource).toContain('overflow-wrap: anywhere');
    expect(stylesSource).toContain('.optimizer-driver-grid');
    expect(stylesSource).toContain('grid-template-columns: 1fr');
    expect(appSource).not.toContain('<MobileOptimizerPanel');
    expect(appSource).not.toContain('Mobile-only optimizer');
  });

  it('explains bounded optimizer output without advice or saved-output language', () => {
    expect(appSource).toContain('Plan to review');
    expect(appSource).toContain('Plan options to review');
    expect(appSource).toContain('Local-first plan-to-review optimizer');
    expect(appSource).toContain('Max after-tax spend');
    expect(appSource).toContain('Monthly spend reviewed');
    expect(appSource).toContain('First review evidence');
    expect(boundedOptimizerSource).toContain("sustainable after-tax spending in today's dollars");
    expect(boundedOptimizerSource).toContain('Projected money left is a trade-off to review with spending comfort.');
    expect(boundedOptimizerSource).toContain('funded years, money-left, tax, and OAS recovery evidence');
    expect(boundedOptimizerSource).toContain('funded years, money left, tax, and OAS recovery are evidence, not instructions');
    expect(appSource).toContain('What to check first');
    expect(appSource).toContain("today&apos;s-dollar spending, funded years, projected money");
    expect(appSource).toContain('left, then tax and OAS recovery diagnostics');
    expect(appSource).not.toContain('spending, funding, tax, OAS recovery, and money left');
    expect(appSource).toContain('Optimizer direction');
    expect(appSource).toContain('Input readiness');
    expect(appSource).toContain('What must be ready before optimizer prep');
    expect(appSource).toContain('Staged grid shape');
    expect(appSource).toContain('Benefit timing and broad withdrawal families first');
    expect(appSource).toContain('No annual account instructions in this version.');
    expect(appSource).toContain('Future objective modes');
    expect(appSource).toContain('Goal switching stays a review boundary');
    expect(appSource).toContain('Feedback package index');
    expect(boundedOptimizerSource).toContain('Optimizer feedback package is indexed for review.');
    expect(boundedOptimizerSource).toContain('runtime review support only');
    expect(boundedOptimizerSource).toContain('annual sequencing architecture');
    expect(boundedOptimizerSource).toContain('Goal-mode architecture stays inside the bounded candidate set.');
    expect(boundedOptimizerSource).toContain('do not add toggles, advice, saved output, or annual account instructions');
    expect(boundedOptimizerSource).toContain('re-rank the same bounded candidate set');
    expect(boundedOptimizerSource).toContain('Variable spending and cash-wedge rules need user feedback');
    expect(boundedOptimizerSource).toContain('Spending flexibility needs feedback language first.');
    expect(boundedOptimizerSource).toContain('cash-wedge explanation');
    expect(appSource).toContain('Flexibility worksheet');
    expect(boundedOptimizerSource).toContain('User describes it as a buffer or cushion, not a refill rule or withdrawal order.');
    expect(boundedOptimizerSource).toContain('Cash wedge is a buffer explanation, not a refill rule.');
    expect(boundedOptimizerSource).toContain('Do not tell users when to refill cash or how much cash to refill.');
    expect(boundedOptimizerSource).toContain('No variable-spending rule, cash refill rule, or annual account sequencing is implemented');
    expect(boundedOptimizerSource).toContain('not a saved setting or optimizer instruction');
    expect(boundedOptimizerSource).toContain('No goal toggle is shown in the normal UI');
    expect(appSource).toContain('Why this option');
    expect(appSource).toContain('Trade-offs');
    expect(appSource).toContain('Check before using');
    expect(appSource).toContain('Review first');
    expect(appSource).toContain('Skipped');
    expect(appSource).toContain('Pension splitting');
    expect(appSource).toContain('CPP sharing');
    expect(appSource).toContain('Option evidence');
    expect(appSource).toContain('What changed in this test');
    expect(appSource).toContain('benefit timing, income-sharing, or home-sale reliance checks');
    expect(appSource).toContain('Confirm eligibility before relying on them');
    expect(boundedOptimizerSource).toContain('First milestone pair to review');
    expect(boundedOptimizerSource).toContain('Other milestone pairs to compare');
    expect(boundedOptimizerSource).toContain('Milestone funded years');
    expect(boundedOptimizerSource).toContain('Milestone lifetime tax change');
    expect(boundedOptimizerSource).toContain('Milestone money-left change');
    expect(boundedOptimizerSource).toContain('Benefit timing stays review-only until a survivor scenario year is set');
    expect(boundedOptimizerSource).toContain('Highest-ranked result inside the bounded benefit-timing milestone grid');
    expect(boundedOptimizerSource).toContain('Withdrawal family to compare');
    expect(boundedOptimizerSource).toContain('Withdrawal family first-year tax change');
    expect(boundedOptimizerSource).toContain('Withdrawal family peak tax change');
    expect(boundedOptimizerSource).toContain('not an annual account instruction');
    expect(appSource).toContain('Tax and funding drivers');
    expect(appSource).toContain('Why the option moved');
    expect(appSource).toContain('They explain direction, not a final recommendation');
    expect(appSource).toContain('Withdrawal feedback checkpoint');
    expect(appSource).toContain('Feedback questions');
    expect(appSource).toContain('Confusion signals');
    expect(appSource).toContain('Next decision gate');
    expect(appSource).toContain('Feedback outcome');
    expect(appSource).toContain('Feedback closeout');
    expect(appSource).toContain('Feedback worksheet');
    expect(appSource).toContain('Pass signal');
    expect(boundedOptimizerSource).toContain('Broad withdrawal-family evidence is ready for feedback.');
    expect(boundedOptimizerSource).toContain('before planning annual account-level sequencing');
    expect(boundedOptimizerSource).toContain('current plan versus broad withdrawal-family comparison');
    expect(boundedOptimizerSource).toContain('year-by-year withdrawal instruction');
    expect(boundedOptimizerSource).toContain('Collect feedback before annual sequencing');
    expect(boundedOptimizerSource).toContain('Clean up inputs before feedback');
    expect(boundedOptimizerSource).toContain('Hold annual sequencing');
    expect(boundedOptimizerSource).toContain('Comparison understanding');
    expect(boundedOptimizerSource).toContain('Input understanding');
    expect(boundedOptimizerSource).toContain('Ready to review with testers');
    expect(boundedOptimizerSource).toContain('Repair inputs first');
    expect(boundedOptimizerSource).toContain('Defer sequencing and simplify');
    expect(boundedOptimizerSource).toContain('Feedback loop ready to close');
    expect(boundedOptimizerSource).toContain('Closeout blocked by inputs');
    expect(boundedOptimizerSource).toContain('Closeout should hold');
    expect(boundedOptimizerSource).toContain('does not create annual account instructions or saved output');
    expect(appSource).toContain('Why options were tested');
    expect(appSource).toContain('Guardrails before a plan leads');
    expect(appSource).toContain('These checks keep the review inside the timing and tax rules');
    expect(appSource).toContain('Review discipline');
    expect(appSource).toContain('Why some options stay review-only');
    expect(appSource).toContain('Option map');
    expect(appSource).toContain('What kind of choices were checked');
    expect(appSource).toContain('lifestyle choices, timing choices, tax checks, drawdown review, and home or estate assumptions');
    expect(appSource).toContain('First option to review means it cleared the highlight checks');
    expect(appSource).toContain('first option to review under the current trust checks');
    expect(appSource).toContain('Treat it as a plan-review label, not advice');
    expect(appSource).toContain('Why this plan is first to review');
    expect(appSource).toContain('Review-only means the result is useful evidence');
    expect(appSource).toContain('save optimizer results');
    expect(appSource).toContain('SHOW_OPTION_RESEARCH_PANELS = false');
    expect(appSource).toContain('<BoundedOptimizerPanel loading={loading} summary={boundedOptimizer} variant="compact" />');
    expect(appSource).not.toContain('Apply optimized plan');
    expect(appSource).not.toContain('Year-by-year action plan');
    expect(appSource).not.toContain('Guaranteed');
    expect(appSource).not.toContain('Suggested plan to review');
    expect(appSource).not.toContain('Recommended path');
    expect(appSource).not.toContain('Guardrails before recommendations');
    expect(appSource).not.toContain('Suggestion discipline');
    expect(appSource).not.toContain('strongest preview candidate');
    expect(appSource).not.toContain('No suggested plan');
    expect(boundedOptimizerSource).not.toContain('Best milestone pair');
    expect(appSource).not.toContain('do this');
    expect(boundedOptimizerSource).not.toContain('optimal CPP');
    expect(boundedOptimizerSource).not.toContain('optimal OAS');
    expect(boundedOptimizerSource).not.toContain('recommended CPP');
    expect(boundedOptimizerSource).not.toContain('recommended OAS');
    expect(boundedOptimizerSource).not.toContain('start benefits at');
    expect(boundedOptimizerSource).not.toContain('withdraw from this account');
  });

  it('keeps feedback outcome and worksheet content in Details-only research boundaries', () => {
    const overviewStart = appSource.indexOf("activeSection === 'overview'");
    const overviewEnd = appSource.indexOf('<DeferredResultsPanel', overviewStart);
    const overviewBranch = appSource.slice(overviewStart, overviewEnd);
    const detailsStart = appSource.indexOf('function DetailsResultsPanel');
    const detailsEnd = appSource.indexOf('function FirstYearMoneyFlowPanel');
    const detailsPanel = appSource.slice(detailsStart, detailsEnd);
    const boundedPanelStart = appSource.indexOf('function BoundedOptimizerPanel');
    const boundedPanelEnd = appSource.indexOf('function OptimizerBoundaryPanel');
    const boundedPanel = appSource.slice(boundedPanelStart, boundedPanelEnd);

    expect(overviewBranch).not.toContain('Feedback outcome');
    expect(overviewBranch).not.toContain('Feedback closeout');
    expect(overviewBranch).not.toContain('Feedback worksheet');
    expect(detailsPanel).toContain('<BoundedOptimizerPanel loading={loading} summary={boundedOptimizer} variant="compact"');
    expect(boundedPanel).toContain('!isCompact && summary?.withdrawalFeedbackReview');
    expect(boundedPanel).toContain('Feedback outcome');
    expect(boundedPanel).toContain('Feedback closeout');
    expect(boundedPanel).toContain('Feedback worksheet');
    expect(boundedPanel.indexOf('Feedback outcome')).toBeLessThan(boundedPanel.indexOf('Feedback worksheet'));
    expect(boundedPanel.indexOf('Feedback closeout')).toBeLessThan(boundedPanel.indexOf('Feedback worksheet'));
  });

  it('keeps the normal Details option surface compact while preserving full option research behind a gate', () => {
    const detailsStart = appSource.indexOf('function DetailsResultsPanel');
    const detailsEnd = appSource.indexOf('function CompactDrawdownReviewSummaryPanel');
    const detailsPanel = appSource.slice(detailsStart, detailsEnd);
    const compactOptionIndex = detailsPanel.indexOf('<BoundedOptimizerPanel loading={loading} summary={boundedOptimizer} variant="compact"');
    const optionGateIndex = detailsPanel.indexOf('SHOW_OPTION_RESEARCH_PANELS');
    const optionResearchBranch = detailsPanel.slice(optionGateIndex);
    const boundedPanelStart = appSource.indexOf('function BoundedOptimizerPanel');
    const boundedPanelEnd = appSource.indexOf('function OptimizerBoundaryPanel');
    const boundedPanel = appSource.slice(boundedPanelStart, boundedPanelEnd);

    expect(compactOptionIndex).toBeGreaterThan(0);
    expect(optionGateIndex).toBeGreaterThan(compactOptionIndex);
    expect(optionResearchBranch).toContain('<BoundedOptimizerPanel loading={loading} summary={boundedOptimizer} />');
    expect(optionResearchBranch).toContain('<OptimizerBoundaryPanel');
    expect(optionResearchBranch).toContain('<OptimizerInputReviewPanel');
    expect(boundedPanel).toContain('!isCompact && summary?.goalReview');
    expect(boundedPanel).toContain('Future objective modes');
    expect(boundedPanel).toContain('summary.goalReview.architecture');
    expect(boundedPanel).toContain('spendingFlexibilityReview');
    expect(boundedPanel).toContain('Flexibility worksheet');
    expect(boundedPanel).toContain('cashWedgeBoundary');
    expect(boundedPanel).toContain('Flexibility boundary');
    expect(boundedPanel).toContain('!isCompact && summary?.feedbackPackageIndex');
    expect(boundedPanel).toContain('Feedback package index');
    expect(boundedPanel).toContain('isCompact && summary?.compactEvidenceRows.length');
    expect(boundedPanel).toContain('First review evidence');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('<BoundedOptimizerPanel loading={loading} summary={boundedOptimizer} />');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('<OptimizerBoundaryPanel');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('<OptimizerInputReviewPanel');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('Future objective modes');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('Spending flexibility needs feedback language first.');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('Cash wedge is a buffer explanation');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('Feedback package index');
    expect(appSource).not.toContain('Max estate toggle');
    expect(appSource).not.toContain('Min tax toggle');
    expect(appSource).not.toContain('Goal switcher');
    expect(appSource).not.toContain('Apply flexibility rule');
    expect(appSource).not.toContain('Refill cash wedge');
    expect(appSource).not.toContain('Use cash wedge first');
    expect(appSource).not.toContain('Refill when markets recover');
    expect(appSource).not.toContain('should be refilled');
    expect(appSource).not.toContain('automatically refilled');
    expect(appSource).not.toContain('refill from bonds');
  });

  it('shows spending stress as review evidence without advice language', () => {
    expect(appSource).toContain('Spending stress check');
    expect(appSource).toContain('SHOW_SCENARIO_RESEARCH_PANELS = false');
    expect(appSource).not.toContain('safe spend');
    expect(appSource).not.toContain('you can spend more');
  });

  it('keeps normal Details scenario evidence compact while preserving tables behind a gate', () => {
    const detailsStart = appSource.indexOf('function DetailsResultsPanel');
    const detailsEnd = appSource.indexOf('function CompactDrawdownReviewSummaryPanel');
    const detailsPanel = appSource.slice(detailsStart, detailsEnd);
    const benefitIndex = detailsPanel.indexOf('<BenefitTimingReadinessPanel');
    const stressIndex = detailsPanel.indexOf('<SpendingStressPanel');
    const scenarioGateIndex = detailsPanel.indexOf('SHOW_SCENARIO_RESEARCH_PANELS');
    const scenarioResearchBranch = detailsPanel.slice(scenarioGateIndex);

    expect(benefitIndex).toBeGreaterThan(0);
    expect(stressIndex).toBeGreaterThan(benefitIndex);
    expect(scenarioGateIndex).toBeGreaterThan(stressIndex);
    expect(scenarioResearchBranch).toContain('<ScenarioAssumptionsPanel');
    expect(scenarioResearchBranch).toContain('<ScenarioComparisonPanel');
    expect(detailsPanel.slice(0, scenarioGateIndex)).not.toContain('<ScenarioAssumptionsPanel');
    expect(detailsPanel.slice(0, scenarioGateIndex)).not.toContain('<ScenarioComparisonPanel');
  });

  it('shows drawdown readiness in Details without optimizer execution language', () => {
    const overviewStart = appSource.indexOf("activeSection === 'overview'");
    const overviewEnd = appSource.indexOf('<DeferredResultsPanel', overviewStart);
    const overviewBranch = appSource.slice(overviewStart, overviewEnd);

    expect(appSource).toContain('Drawdown readiness');
    expect(appSource).toContain('Tax-aware prototype evidence');
    expect(appSource).toContain('Review windows for later');
    expect(appSource).toContain('They do not create instructions');
    expect(appSource).toContain('Future drawdown draft checks');
    expect(appSource).toContain('Is this plan ready for future tax-aware drawdown testing?');
    expect(appSource).toContain('Future comparison readiness');
    expect(appSource).toContain('does not run a comparison');
    expect(appSource).toContain('Future sandbox gate');
    expect(appSource).toContain('Hold for later comparison');
    expect(appSource).toContain('They are not run as part of the calculation');
    expect(appSource).toContain('Drawdown comparison evidence');
    expect(appSource).toContain('Review gate');
    expect(appSource).toContain('not a recommendation');
    expect(appSource).toContain('Future drawdown prototype readiness');
    expect(appSource).toContain('Readiness review only');
    expect(appSource).toContain('Drawdown review preview');
    expect(appSource).toContain('Final preview gate');
    expect(appSource).toContain('Drawdown phase review');
    expect(appSource).toContain('does not tell you which account to withdraw from');
    expect(appSource).toContain('Execution boundary checkpoint');
    expect(appSource).toContain('Boundary decision');
    expect(appSource).toContain('Adapter validation');
    expect(appSource).toContain('Execution prototype go/no-go');
    expect(appSource).toContain('Prototype preflight');
    expect(appSource).toContain('Draft audit trail');
    expect(appSource).toContain('Containment guard');
    expect(appSource).toContain('Execution phase closeout');
    expect(appSource).toContain('Contained drawdown prototype');
    expect(appSource).toContain('Contained prototype summary');
    expect(appSource).toContain('Prototype materiality');
    expect(appSource).toContain('Why it moved');
    expect(appSource).toContain('Prototype limits');
    expect(appSource).toContain('Prototype usefulness');
    expect(appSource).toContain('Details density check');
    expect(appSource).toContain('Prototype review checklist');
    expect(appSource).toContain('Prototype copy guard');
    expect(appSource).toContain('Contained prototype go/no-go');
    expect(appSource).toContain('Prototype promotion readiness');
    expect(appSource).toContain('Prototype next steps');
    expect(appSource).toContain('Prototype blocker register');
    expect(appSource).toContain('Example promotion gate');
    expect(appSource).toContain('Contained prototype milestone');
    expect(appSource).toContain('Drawdown review intent');
    expect(appSource).toContain('Drawdown timing check');
    expect(appSource).toContain('Drawdown timing result');
    expect(appSource).toContain('Drawdown timing review');
    expect(appSource).toContain('Drawdown example gate');
    expect(appSource).toContain('Drawdown timing closeout');
    expect(appSource).toContain('Drawdown review summary');
    expect(appSource).toContain('Drawdown review safety checklist');
    expect(appSource).toContain('Drawdown review limits');
    expect(appSource).toContain('Drawdown example check');
    expect(appSource).toContain('Drawdown review readiness');
    expect(appSource).toContain('Drawdown review headline');
    expect(appSource).toContain('Current plan comparison');
    expect(appSource).toContain('Drawdown review actions');
    expect(appSource).toContain('Drawdown wording check');
    expect(appSource).toContain('Drawdown review design readiness');
    expect(appSource).toContain('Drawdown review readiness check');
    expect(appSource).toContain('Drawdown review handoff');
    expect(appSource).toContain('Drawdown review in this plan');
    expect(appSource).toContain('Drawdown Details placement');
    expect(appSource).toContain('Drawdown review copy guard');
    expect(appSource).toContain('Drawdown review closeout');
    expect(appSource).toContain('SHOW_DRAWDOWN_RESEARCH_PANELS = false');
    expect(appSource).toContain('<CompactDrawdownReviewSummaryPanel');
    expect(appSource).toContain('<DrawdownReadinessPanel loading={loading} summary={drawdownReadiness} />');
    expect(appSource).toContain('This is a tax-aware timing check for review');
    expect(appSource).toContain('Plan file');
    expect(appSource).toContain('Unchanged');
    expect(appSource).toContain('Instructions');
    expect(appSource).toContain('None created');
    expect(appSource).toContain('Release readiness checkpoint');
    expect(appSource).toContain('Feedback review package');
    expect(appSource).toContain('Release checkpoint review board');
    expect(appSource).toContain('Fix first');
    expect(appSource).toContain('Review now');
    expect(appSource).toContain('Later UX pass');
    expect(appSource).toContain('SHOW_CHECKPOINT_REVIEW_PANELS');
    expect(appSource).toContain('without turning it into a plan change');
    expect(appSource).toContain('without creating account instructions');
    expect(appSource).toContain('not a saved plan change or account instruction');
    expect(appSource).toContain('does not promote it today');
    expect(appSource).toContain('does not change your plan');
    expect(appSource).toContain('create account instructions');
    expect(appSource).toContain('does not change withdrawal order');
    expect(appSource).toContain('does not change the current withdrawal order');
    expect(overviewBranch).not.toContain('<DrawdownReadinessPanel');
    expect(overviewBranch).not.toContain('<HiddenDrawdownComparisonPanel');
    expect(overviewBranch).not.toContain('<DrawdownReviewPreviewPanel');
    expect(overviewBranch).not.toContain('<DrawdownExecutionBoundaryPanel');
    expect(overviewBranch).not.toContain('Drawdown review in this plan');
    expect(overviewBranch).not.toContain('Drawdown Details placement');
    expect(overviewBranch).not.toContain('Release readiness checkpoint');
    expect(overviewBranch).not.toContain('Feedback review package');
    expect(overviewBranch).not.toContain('Release checkpoint review board');
    expect(appSource).not.toContain('optimal drawdown');
    expect(appSource).not.toContain('recommended withdrawal strategy');
    expect(appSource).not.toContain('safe spend');
    expect(appSource).not.toContain('guaranteed');
  });

  it('keeps the normal Details drawdown surface compact by gating research diagnostics', () => {
    const detailsStart = appSource.indexOf('function DetailsResultsPanel');
    const detailsEnd = appSource.indexOf('function CompactDrawdownReviewSummaryPanel');
    const detailsPanel = appSource.slice(detailsStart, detailsEnd);
    const compactSummaryIndex = detailsPanel.indexOf('<CompactDrawdownReviewSummaryPanel');
    const researchGateIndex = detailsPanel.indexOf('SHOW_DRAWDOWN_RESEARCH_PANELS');
    const researchBranch = detailsPanel.slice(researchGateIndex);

    expect(compactSummaryIndex).toBeGreaterThan(0);
    expect(researchGateIndex).toBeGreaterThan(compactSummaryIndex);
    expect(researchBranch).toContain('<DrawdownReadinessPanel');
    expect(researchBranch).toContain('<HiddenDrawdownComparisonPanel');
    expect(researchBranch).toContain('<DrawdownExecutionBoundaryPanel');
    expect(detailsPanel.slice(0, researchGateIndex)).not.toContain('<DrawdownReadinessPanel');
    expect(detailsPanel.slice(0, researchGateIndex)).not.toContain('<HiddenDrawdownComparisonPanel');
  });

  it('keeps the normal Details evidence bands compact before optimizer work', () => {
    const detailsStart = appSource.indexOf('function DetailsResultsPanel');
    const detailsEnd = appSource.indexOf('function CompactDrawdownReviewSummaryPanel');
    const detailsPanel = appSource.slice(detailsStart, detailsEnd);
    const checkpointGateIndex = detailsPanel.indexOf('SHOW_CHECKPOINT_REVIEW_PANELS');
    const normalBeforeCheckpointGate = detailsPanel.slice(0, checkpointGateIndex);

    expect(detailsPanel).toContain('Planning evidence');
    expect(detailsPanel).toContain('Money Flow');
    expect(detailsPanel).toContain('Decision Checks');
    expect(detailsPanel).toContain('Scenario evidence');
    expect(detailsPanel).toContain('<PlanHealthPanel');
    expect(detailsPanel).toContain('<EstateIntentPanel');
    expect(detailsPanel).toContain('<SourceStoryPanel');
    expect(detailsPanel).toContain('<FirstYearMoneyFlowPanel');
    expect(detailsPanel).toContain('<DecisionChecklistPanel');
    expect(detailsPanel).toContain('<CompactTaxPressurePanel');
    expect(detailsPanel).toContain('<BenefitTimingReadinessPanel');
    expect(detailsPanel).toContain('<SpendingStressPanel');
    expect(detailsPanel).toContain('<BoundedOptimizerPanel loading={loading} summary={boundedOptimizer} variant="compact" />');
    expect(checkpointGateIndex).toBeGreaterThan(0);
    expect(normalBeforeCheckpointGate).not.toContain('<ReleaseReadinessCheckpointPanel');
    expect(normalBeforeCheckpointGate).not.toContain('<FeedbackReviewPackagePanel');
    expect(normalBeforeCheckpointGate).not.toContain('<CheckpointReviewBoardPanel');
  });

  it('keeps save and report actions distinct in the consumer UI', () => {
    expect(appSource).toContain('Save editable plan');
    expect(appSource).toContain('Open printable report');
    expect(appSource).toContain('Download year-by-year CSV');
    expect(appSource).toContain('Choose the file that matches what you need.');
    expect(appSource).toContain('Editable plan backup');
    expect(appSource).toContain('Printable report');
    expect(appSource).toContain('CSV results export');
    expect(appSource).toContain('Only the editable plan backup is meant to be reopened by this planner.');
    expect(appSource).toContain('These local downloads do not create an');
    expect(appSource).toContain('account or upload your plan.');
    expect(appSource).toContain('This is a local results');
    expect(appSource).toContain('Plan file');
    expect(appSource).toContain('Unchanged');
    expect(appSource).toContain('It may look more detailed than this guided Results page');
    expect(appSource).toContain('This saves the household inputs and assumptions');
    expect(appSource).toContain('This downloaded file is your editable backup');
    expect(appSource).toContain('Save an editable copy before opening the printable report?');
    expect(appSource).toContain('It is not the');
    expect(appSource).toContain('printable client report');
    expect(appSource).toContain('Eligible DB pension splitting is included in the current plan baseline');
    expect(appSource).not.toContain('Save .plan.json');
    expect(appSource).not.toContain('Local .plan.json');
    expect(appSource).not.toContain('Open .plan.json');
  });

  it('exports year-by-year CSV from annual detail rows without changing saved plan copy', () => {
    expect(appSource).toContain('annualDetailRowsToCsv');
    expect(appSource).toContain('text/csv;charset=utf-8');
    expect(appSource).toContain('-year-by-year.csv');
    expect(appSource).toContain('AnnualDetailCsvRow');
    expect(appSource).toContain('Registered withdrawals');
    expect(appSource).toContain('Money-flow check');
    expect(appSource).toContain('This is a local results');
    expect(appSource).not.toContain('save annual detail');
    expect(appSource).not.toContain('saved CSV');
  });

  it('keeps visible React copy free of internal engineering phrases', () => {
    expect(appSource).not.toContain('extracted simulation output');
    expect(appSource).not.toContain('runtime-only');
    expect(appSource).not.toContain('stable dashboard');
    expect(appSource).not.toContain('legacy charts');
    expect(appSource).not.toContain('source reconciliation');
    expect(appSource).not.toContain('Meltdown diagnostic');
    expect(appSource).toContain('Ontario 2026 tax assumptions');
    expect(appSource).not.toContain('cash-flow delta');
    expect(appSource).not.toContain('bounded preview');
    expect(appSource).not.toContain('wasted unnecessarily');
  });

  it('keeps examples and high-friction intake labels consumer-facing', () => {
    expect(appSource).toContain('Custom plan based on');
    expect(appSource).toContain('Locked-in account (LIRA)');
    expect(appSource).toContain('Locked-in income account (LIF)');
    expect(appSource).toContain('Canada Pension Plan (CPP) at 65');
    expect(appSource).toContain('CPP at 60 is calculated from the 65 estimate');
    expect(appSource).toContain('Old Age Security (OAS) monthly');
    expect(appSource).toContain('Withdrawal order to test');
    expect(appSource).toContain('Pension plus bridge before 65, today');
    expect(appSource).toContain('Pension from 65 onward, today');
    expect(appSource).toContain('Use the statement value. If unsure, 2%');
    expect(appSource).toContain('Go / slow / no-go spending, today');
    expect(appSource).toContain('Inputs stay here until you save an editable plan file');
    expect(appSource).toContain('Changes update this plan as soon as you type');
    expect(appSource).toContain('Start with:');
    expect(appSource).toContain('Income sources in this version');
    expect(appSource).toContain('For multiple DB pensions, combine amounts only when they share the same start year and indexing');
    expect(appSource).toContain('Rental income');
    expect(appSource).toContain('CPP/OAS timing in this version');
    expect(appSource).toContain('The current plan baseline starts CPP and OAS at 65');
    expect(appSource).toContain('start ages are not saved as editable inputs yet');
    expect(appSource).toContain('CPP/OAS timing review');
    expect(appSource).toContain('Benefit timing is a review check, not a saved setting yet');
    expect(appSource).toContain('Current plan baseline');
    expect(appSource).toContain('Review test');
    expect(appSource).toContain('Start ages unchanged');
    expect(appSource).toContain('This does not recommend when to start benefits');
    expect(appSource).toContain('Current-plan CPP/OAS timing starts at 65');
    expect(appSource).toContain('Delay-to-70 timing is tested only as review evidence');
    expect(appSource).toContain('scrollToWorkspaceTop');
    expect(appSource).toContain('needs-attention');
    expect(appSource).not.toContain('Example: ${action.label}');
    expect(appSource).not.toContain('CPP 65 monthly');
    expect(appSource).not.toContain('OAS monthly</span>');
  });

  it('keeps guided-intake validation copy framed as review items instead of technical warnings', () => {
    expect(appSource).toContain('Ready to run');
    expect(appSource).toContain('No blockers or review items found in the current plan.');
    expect(appSource).toContain('Review items');
    expect(appSource).toContain('review item');
    expect(appSource).toContain('Fix this section before results');
    expect(appSource).toContain('Review this section');
    expect(appSource).not.toContain('Validation clear');
    expect(appSource).not.toContain('No blocking issues or warnings found in the current plan.');
    expect(appSource).not.toContain('<strong>Warnings</strong>');
  });
});
