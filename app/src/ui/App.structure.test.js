import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const appSource = readFileSync(new URL('./App.tsx', import.meta.url), 'utf8');
const boundedOptimizerSource = readFileSync(new URL('../engine/boundedOptimizer.ts', import.meta.url), 'utf8');
const resultSelectorsSource = readFileSync(new URL('../engine/resultSelectors.ts', import.meta.url), 'utf8');
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
    expect(overviewBranch).not.toContain('<MinimumExpenseCoveragePanel');
    expect(overviewBranch).not.toContain('<DiscretionaryRoomBridgePanel');
    expect(overviewBranch).not.toContain('<SpendingPathBridgePanel');
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
    expect(detailsPanel).toContain('<MinimumExpenseCoveragePanel');
    expect(detailsPanel).toContain('<DiscretionaryRoomBridgePanel');
    expect(detailsPanel).toContain('<SpendingPathBridgePanel');
    expect(detailsPanel).toContain('<SourceStoryPanel');
    expect(detailsPanel).toContain('<FirstYearMoneyFlowPanel');
    expect(detailsPanel).toContain('<DecisionChecklistPanel');
    expect(detailsPanel).toContain('<CompactTaxPressurePanel');
    expect(detailsPanel).toContain('<BoundedOptimizerPanel loading={loading} summary={boundedOptimizer} variant="compact"');
    expect(detailsPanel).toContain('<TinyTesterSurfacePanel loading={loading} summary={boundedOptimizer} />');
    expect(detailsPanel).toContain('<CompactDrawdownReviewSummaryPanel');
    expect(detailsPanel).not.toContain('<DrawdownReadinessPanel loading={loading} summary={drawdownReadiness} />\n      <CompactDrawdownReviewSummaryPanel');
    expect(detailsPanel).not.toContain('<HiddenDrawdownComparisonPanel comparison={hiddenDrawdownComparison} loading={loading} />\n      <CompactDrawdownReviewSummaryPanel');
    expect(detailsPanel).toContain('<FirstYearMoneyFlowPanel');
  });

  it('keeps the tiny tester surface read-only and inside Details', () => {
    const overviewStart = appSource.indexOf("activeSection === 'overview'");
    const overviewEnd = appSource.indexOf('<DeferredResultsPanel', overviewStart);
    const overviewBranch = appSource.slice(overviewStart, overviewEnd);
    const detailsStart = appSource.indexOf('function DetailsResultsPanel');
    const detailsEnd = appSource.indexOf('function TinyTesterSurfacePanel');
    const detailsPanel = appSource.slice(detailsStart, detailsEnd);
    const testerSurfaceStart = appSource.indexOf('function TinyTesterSurfacePanel');
    const testerSurfaceEnd = appSource.indexOf('function BoundedOptimizerPanel');
    const testerSurface = appSource.slice(testerSurfaceStart, testerSurfaceEnd);

    expect(appSource).toContain('SHOW_TINY_TESTER_SURFACE = true');
    expect(overviewBranch).not.toContain('<TinyTesterSurfacePanel');
    expect(detailsPanel).toContain('<TinyTesterSurfacePanel loading={loading} summary={boundedOptimizer} />');
    expect(testerSurface).toContain('testerSurfaceMatrix.testerPacketReadiness.dryRunPayload');
    expect(testerSurface).toContain('Experimental tester packet review');
    expect(testerSurface).toContain('Disabled tester actions');
    expect(testerSurface).toContain('aria-label="Tester-only annual candidate review"');
    expect(testerSurface).toContain('aria-live="polite"');
    expect(testerSurface).toContain('<button disabled');
    expect(testerSurface).toContain('not a retirement plan');
    expect(testerSurface).not.toContain('onClick=');
    expect(testerSurface).not.toContain('savePlan');
    expect(testerSurface).not.toContain('downloadCsv');
  });

  it('keeps the limited tester handoff static and non-persistent', () => {
    const testerSurfaceStart = appSource.indexOf('function TinyTesterSurfacePanel');
    const testerSurfaceEnd = appSource.indexOf('function BoundedOptimizerPanel');
    const testerSurface = appSource.slice(testerSurfaceStart, testerSurfaceEnd);

    expect(appSource).toContain('TESTER_HANDOFF_STEPS');
    expect(appSource).toContain('TESTER_HANDOFF_SCENARIOS');
    expect(testerSurface).toContain('Tester handoff');
    expect(testerSurface).toContain('Suggested synthetic scenarios');
    expect(appSource).toContain('Use made-up scenarios only; do not enter personal financial information.');
    expect(appSource).toContain('Leave saved output, CSV output, reports, and final instructions out of scope.');
    expect(appSource).toContain('DIY couple');
    expect(appSource).toContain('DB pension couple');
    expect(appSource).toContain('Already retired');
    expect(testerSurface).not.toContain('<textarea');
    expect(testerSurface).not.toContain('<input');
    expect(testerSurface).not.toContain('<form');
    expect(testerSurface).not.toContain('submit');
    expect(testerSurface).not.toContain('localStorage');
    expect(testerSurface).not.toContain('download');
    expect(testerSurface).not.toContain('clipboard');
    expect(stylesSource).toContain('.tester-handoff-panel');
  });

  it('keeps tester feedback interpretation read-only and non-authorizing', () => {
    const testerSurfaceStart = appSource.indexOf('function TinyTesterSurfacePanel');
    const testerSurfaceEnd = appSource.indexOf('function BoundedOptimizerPanel');
    const testerSurface = appSource.slice(testerSurfaceStart, testerSurfaceEnd);

    expect(appSource).toContain('TESTER_FEEDBACK_INTERPRETATION_ROWS');
    expect(testerSurface).toContain('How feedback will be read');
    expect(appSource).toContain('Useful feedback');
    expect(appSource).toContain('Copy cleanup');
    expect(appSource).toContain('Input or model cleanup');
    expect(appSource).toContain('Blocker');
    expect(appSource).toContain('Not approval');
    expect(appSource).toContain('Positive tester feedback does not approve saved sequencing, CSV output, reports, final instructions, or production use.');
    expect(testerSurface).not.toContain('approveSequencing');
    expect(testerSurface).not.toContain('unlockSequencing');
    expect(testerSurface).not.toContain('clearBlocker');
    expect(testerSurface).not.toContain('scoreFeedback');
    expect(testerSurface).not.toContain('saveFeedback');
    expect(testerSurface).not.toContain('feedbackStatus =');
    expect(testerSurface).not.toContain('onChange=');
    expect(testerSurface).not.toContain('onSubmit=');
    expect(stylesSource).toContain('.tester-feedback-interpretation-panel');
  });

  it('keeps the tiny tester surface hardened for copy, actions, and narrow screens', () => {
    const testerSurfaceStart = appSource.indexOf('function TinyTesterSurfacePanel');
    const testerSurfaceEnd = appSource.indexOf('function BoundedOptimizerPanel');
    const testerSurface = appSource.slice(testerSurfaceStart, testerSurfaceEnd);

    expect(testerSurface).toContain("approval?.approval === 'approveTinyTesterSurface'");
    expect(testerSurface).toContain('Ready for test review');
    expect(testerSurface).toContain('Needs review');
    expect(testerSurface).toContain('Hold for review');
    expect(testerSurface).toContain('Current tester packet');
    expect(testerSurface).toContain('Saved sequencing output');
    expect(testerSurface).toContain('CSV sequencing output');
    expect(testerSurface).toContain('Report output');
    expect(testerSurface).toContain('Production UI promotion');
    expect(testerSurface).toContain('Final annual instructions');
    expect(testerSurface).toContain('Tax-bracket instructions');
    expect(testerSurface).toContain('Saved schema changes');
    expect(testerSurface).toContain('This review surface is for made-up scenario testing only.');
    expect(testerSurface).toContain('Preparing tester rows.');
    expect(testerSurface).not.toContain('Preparing runtime tester rows.');
    expect(testerSurface).not.toContain('approval?.boundary');
    expect(testerSurface).not.toContain('reviewCopy.purpose');

    expect(stylesSource).toContain('.tiny-tester-surface');
    expect(stylesSource).toContain('overflow-wrap: anywhere');
    expect(stylesSource).toContain('min-width: 680px');
    expect(stylesSource).toContain('min-height: 44px');
    expect(stylesSource).toContain('.tester-surface-actions {\n    grid-template-columns: 1fr;');
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

  it('shows a plain reload message for stale deployed chunks', () => {
    expect(appSource).toContain('previewErrorMessage');
    expect(appSource).toContain('BridgeErrorNotice');
    expect(appSource).toContain('role="alert"');
    expect(appSource).toContain('A new version of the planner is available. Refresh this page, then open Results again.');
    expect(appSource).toContain('Refresh page');
    expect(appSource).toContain('Failed to fetch dynamically imported module');
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
    expect(appSource).toContain('spending-hero-metric');
    expect(appSource).toContain('Estimated after-tax monthly spending');
    expect(appSource).toContain('per year, today&apos;s dollars');
  });

  it('keeps first-results mobile layout guarded without adding Overview density', () => {
    expect(stylesSource).toContain('@media (max-width: 920px)');
    expect(stylesSource).toContain('@media (max-width: 640px)');
    expect(stylesSource).toContain('.retirement-answer-panel');
    expect(stylesSource).toContain('.retirement-answer-hero');
    expect(stylesSource).toContain('.spending-hero-metric');
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
    expect(appSource).toContain('Capacity objective');
    expect(appSource).toContain('Floor first, then optional room');
    expect(appSource).toContain('Monthly capacity');
    expect(appSource).toContain('Expense floor');
    expect(appSource).toContain('Optional room');
    expect(appSource).toContain('not a spending instruction');
    expect(appSource).toContain('Capacity constraint evidence');
    expect(appSource).toContain('What the runtime capacity answer protects');
    expect(appSource).toContain('summary.capacityObjective.boundary');
    expect(boundedOptimizerSource).toContain('Monthly spend reviewed');
    expect(appSource).toContain('First review evidence');
    expect(boundedOptimizerSource).toContain("sustainable after-tax spending in today's dollars");
    expect(boundedOptimizerSource).toContain('Runtime evidence can show after-tax monthly capacity above the protected expense floor.');
    expect(boundedOptimizerSource).toContain('Capacity objective output is runtime-only');
    expect(boundedOptimizerSource).toContain('not a production UI contract');
    expect(boundedOptimizerSource).toContain('not an annual account-level withdrawal instruction');
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
    expect(appSource).toContain('summary.goalReview.goalModePreview');
    expect(boundedOptimizerSource).toContain('Same candidates, different review lens.');
    expect(appSource).toContain('Feedback package index');
    expect(boundedOptimizerSource).toContain('Optimizer feedback package is indexed for review.');
    expect(boundedOptimizerSource).toContain('runtime review support only');
    expect(boundedOptimizerSource).toContain('annual sequencing architecture');
    expect(boundedOptimizerSource).toContain('Annual sequencing may be planned later, but is not ready now.');
    expect(boundedOptimizerSource).toContain('One successful example-plan review is not enough to mark annual sequencing ready.');
    expect(boundedOptimizerSource).toContain('Would annual sequencing improve funded years without hiding a projected shortfall?');
    expect(boundedOptimizerSource).toContain('Question only; no annual withdrawal path is generated.');
    expect(boundedOptimizerSource).toContain('Question only; no refill rule, spending rule, or account instruction is created.');
    expect(boundedOptimizerSource).toContain('Performance budget needs a separate architecture pass.');
    expect(boundedOptimizerSource).toContain('The existing example-plan optimizer readiness test is the long pole');
    expect(boundedOptimizerSource).toContain('do not run annual sequencing, add workers, add servers, or change optimizer search');
    expect(boundedOptimizerSource).toContain('Explainability must pass before annual account detail.');
    expect(boundedOptimizerSource).toContain('User describes the family as a comparison based on funded years, money left, tax, and OAS evidence.');
    expect(boundedOptimizerSource).toContain('do not create advice, account instructions, saved output, or annual sequencing');
    expect(boundedOptimizerSource).toContain('Province and edge-case scope must stay narrow.');
    expect(boundedOptimizerSource).toContain('LIRA/LIF cases should block annual sequencing architecture');
    expect(boundedOptimizerSource).toContain('GIS and low-income benefit interactions remain out of scope unless explicitly planned.');
    expect(boundedOptimizerSource).toContain('do not add province support, locked-in account rules, GIS modelling, saved output, or annual sequencing');
    expect(boundedOptimizerSource).toContain('Feedback depth needs several household stories.');
    expect(boundedOptimizerSource).toContain('Do not move toward prototype until at least three household stories pass without confusion signals.');
    expect(boundedOptimizerSource).toContain('do not collect personal feedback, save feedback, or start annual sequencing');
    expect(boundedOptimizerSource).toContain('Future sequencing architecture has hard non-goals.');
    expect(boundedOptimizerSource).toContain('Do not change saved plan schema or engine output schema without a separate planned decision.');
    expect(boundedOptimizerSource).toContain('be removable in one commit if it misbehaves');
    expect(boundedOptimizerSource).toContain('do not create a prototype, schema migration, UI action, or annual sequencing result');
    expect(boundedOptimizerSource).toContain('does not implement annual account-level sequencing, account instructions, saved output, or a new optimizer search');
    expect(boundedOptimizerSource).toContain('Goal-mode architecture stays inside the bounded candidate set.');
    expect(boundedOptimizerSource).toContain('Goal-mode preview re-ranks existing candidates only');
    expect(boundedOptimizerSource).toContain('do not add toggles, advice, saved output, or annual account instructions');
    expect(boundedOptimizerSource).toContain('re-rank the same bounded candidate set');
    expect(boundedOptimizerSource).toContain('Variable spending and cash-wedge rules need user feedback');
    expect(boundedOptimizerSource).toContain('Spending flexibility needs feedback language first.');
    expect(boundedOptimizerSource).toContain('Flexibility feedback has three review outcomes.');
    expect(boundedOptimizerSource).toContain('do not create spending permission, cash-refill actions, saved settings, or annual account sequencing');
    expect(boundedOptimizerSource).toContain('cash-wedge explanation');
    expect(appSource).toContain('Flexibility worksheet');
    expect(appSource).toContain('summary.goalReview.spendingFlexibilityReview.outcomeReview');
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
    const overviewStart = appSource.indexOf("activeSection === 'overview'");
    const overviewEnd = appSource.indexOf('<DeferredResultsPanel', overviewStart);
    const overviewBranch = appSource.slice(overviewStart, overviewEnd);
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
    expect(boundedPanel).toContain('outcomeReview');
    expect(boundedPanel).toContain('cashWedgeBoundary');
    expect(boundedPanel).toContain('Flexibility boundary');
    expect(boundedPanel).toContain('!isCompact && summary?.feedbackPackageIndex');
    expect(boundedPanel).toContain('Feedback package index');
    expect(boundedPanel).toContain('annualSequencingReadiness');
    expect(boundedPanel).toContain('sequencing-readiness-');
    expect(boundedPanel).toContain('Current readiness summary');
    expect(boundedPanel).toContain('feedbackEvidencePosture');
    expect(boundedPanel).toContain('feedbackEvidencePosture.headline');
    expect(boundedPanel).toContain('feedbackEvidencePosture.recommendation');
    expect(boundedPanel).toContain('feedbackEvidencePosture.boundary');
    expect(boundedPanel).toContain('Top blocked items');
    expect(boundedPanel).toContain('performanceBudget');
    expect(boundedPanel).toContain('scopeRegister');
    expect(boundedPanel).toContain('prototypeReadinessSummary');
    expect(boundedPanel).toContain('readinessSlimmingPlan');
    expect(boundedPanel).toContain('readinessSlimmingPlan.headline');
    expect(boundedPanel).toContain('readinessSlimmingPlan.boundary');
    expect(boundedPanel).toContain('readinessHandoffCheckpoint');
    expect(boundedPanel).toContain('readinessHandoffCheckpoint.headline');
    expect(boundedPanel).toContain('readinessHandoffCheckpoint.recommendation');
    expect(boundedPanel).toContain('readinessHandoffCheckpoint.boundary');
    expect(boundedPanel).toContain('visible surface summary-first');
    expect(boundedPanel).not.toContain('readinessSectionIndex');
    expect(boundedPanel).not.toContain('copyTighteningGuard');
    expect(boundedPanel).not.toContain('feedbackExamplePointers');
    expect(boundedPanel).not.toContain('feedbackResultsPlaceholder');
    expect(boundedPanel).not.toContain('feedbackCopyCleanupTargets');
    expect(boundedPanel).not.toContain('feedbackResultsCheckpoint');
    expect(boundedPanel).not.toContain('Architecture questions');
    expect(boundedPanel).not.toContain('feedbackArtifactTemplate');
    expect(boundedPanel).not.toContain('feedbackCoverageMatrix');
    expect(boundedPanel).not.toContain('readinessRunway');
    expect(boundedPanel).toContain('summary?.capacityObjective');
    expect(boundedPanel).toContain('!isCompact && summary?.capacityObjective');
    expect(boundedPanel).toContain('Capacity constraint evidence');
    expect(boundedPanel).toContain('This evidence stays in the Details research path');
    expect(boundedPanel).toContain('isCompact && summary?.compactEvidenceRows.length');
    expect(boundedPanel).toContain('First review evidence');
    expect(overviewBranch).not.toContain('Capacity constraint evidence');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('<BoundedOptimizerPanel loading={loading} summary={boundedOptimizer} />');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('<OptimizerBoundaryPanel');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('<OptimizerInputReviewPanel');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('Future objective modes');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('Spending flexibility needs feedback language first.');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('Cash wedge is a buffer explanation');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('Feedback package index');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('annualSequencingReadiness');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('readinessSectionIndex');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('copyTighteningGuard');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('feedbackExamplePointers');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('deferralReassessment');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('readinessMaintenancePlan');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('feedbackReviewScript');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('performancePlanningQuestions');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('conservativePostureCheckpoint');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('readinessConsolidationSummary');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('uiRedesignReadinessBridge');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('checkpointArchivePolicy');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('consolidationCheckpoint');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('manualWorksheetPacket');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('staticWorksheetExamples');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('manualScoringRubric');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('manualFeedbackPrepCheckpoint');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('feedbackResultsPlaceholder');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('feedbackCopyCleanupTargets');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('feedbackEvidencePosture');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('feedbackResultsCheckpoint');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('readinessSlimmingPlan');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('readinessHandoffCheckpoint');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('Architecture questions');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('Prototype decision remains blocked.');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('rollbackContainmentPlan');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('testOnlyShapePlan');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('prototypeReadinessSummary');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('blockerClearanceEvidence');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('feedbackArtifactTemplate');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('feedbackCloseoutRubric');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('feedbackDecisionLedger');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('feedbackCoverageMatrix');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('evidenceQualityChecklist');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('prototypeDecisionPacket');
    expect(detailsPanel.slice(0, optionGateIndex)).not.toContain('readinessRunway');
    expect(appSource).not.toContain('Max estate toggle');
    expect(appSource).not.toContain('Min tax toggle');
    expect(appSource).not.toContain('Goal switcher');
    expect(appSource).not.toContain('Apply flexibility rule');
    expect(appSource).not.toContain('Spend this range');
    expect(appSource).not.toContain('Use this range');
    expect(appSource).not.toContain('Follow this guardrail');
    expect(appSource).not.toContain('Annual sequencing ready');
    expect(appSource).not.toContain('Start annual sequencing');
    expect(appSource).not.toContain('Start internal prototype');
    expect(appSource).not.toContain('Create sequencing result');
    expect(appSource).not.toContain('Apply annual sequencing');
    expect(appSource).not.toContain('Save annual sequencing');
    expect(appSource).not.toContain('Account withdrawal instruction');
    expect(appSource).not.toContain('Run sequencing prototype');
    expect(appSource).not.toContain('Prototype ready');
    expect(appSource).not.toContain('Prototype started');
    expect(appSource).not.toContain('Clear annual sequencing blockers');
    expect(appSource).not.toContain('Authorize annual sequencing prototype');
    expect(appSource).not.toContain('Save feedback artifact');
    expect(appSource).not.toContain('Submit sequencing feedback');
    expect(appSource).not.toContain('Approve annual sequencing prototype');
    expect(appSource).not.toContain('Score feedback response');
    expect(appSource).not.toContain('Store feedback decision');
    expect(appSource).not.toContain('Clear blocker from feedback');
    expect(appSource).not.toContain('Save feedback coverage');
    expect(appSource).not.toContain('Expand low-income benefits');
    expect(appSource).not.toContain('Save evidence quality');
    expect(appSource).not.toContain('Score reviewer evidence');
    expect(appSource).not.toContain('Ask for prototype approval');
    expect(appSource).not.toContain('Create prototype decision packet');
    expect(appSource).not.toContain('Request prototype decision');
    expect(appSource).not.toContain('Start sequencing runway');
    expect(appSource).not.toContain('Approve sequencing');
    expect(appSource).not.toContain('Apply account order');
    expect(appSource).not.toContain('Collect example feedback');
    expect(appSource).not.toContain('Save feedback example');
    expect(appSource).not.toContain('Move to candidate status');
    expect(appSource).not.toContain('Start annual prototype');
    expect(appSource).not.toContain('Clear readiness maintenance blockers');
    expect(appSource).not.toContain('Request sequencing approval');
    expect(appSource).not.toContain('Submit review script');
    expect(appSource).not.toContain('Save reviewer response');
    expect(appSource).not.toContain('Run performance benchmark');
    expect(appSource).not.toContain('Start background worker');
    expect(appSource).not.toContain('Request prototype now');
    expect(appSource).not.toContain('Enable annual sequencing');
    expect(appSource).not.toContain('Save consolidated readiness');
    expect(appSource).not.toContain('Authorize sequencing from summary');
    expect(appSource).not.toContain('Start UI overhaul');
    expect(appSource).not.toContain('Apply redesign now');
    expect(appSource).not.toContain('Approve from decision doc');
    expect(appSource).not.toContain('Delete checkpoint docs');
    expect(appSource).not.toContain('Begin UI overhaul');
    expect(appSource).not.toContain('Start sequencing from checkpoint');
    expect(appSource).not.toContain('Submit feedback worksheet');
    expect(appSource).not.toContain('Save manual feedback');
    expect(appSource).not.toContain('Save completed worksheet');
    expect(appSource).not.toContain('Count static worksheet as evidence');
    expect(appSource).not.toContain('Score feedback in app');
    expect(appSource).not.toContain('Save feedback score');
    expect(appSource).not.toContain('Run feedback review in app');
    expect(appSource).not.toContain('Analyze feedback response');
    expect(appSource).not.toContain('Summarize real feedback automatically');
    expect(appSource).not.toContain('Infer feedback result');
    expect(appSource).not.toContain('Rewrite from imagined feedback');
    expect(appSource).not.toContain('Apply feedback cleanup');
    expect(appSource).not.toContain('Apply cleanup without feedback');
    expect(appSource).not.toContain('Move decision from feedback posture');
    expect(appSource).not.toContain('Review feedback results now');
    expect(appSource).not.toContain('Unlock sequencing from feedback');
    expect(appSource).not.toContain('Delete readiness docs automatically');
    expect(appSource).not.toContain('Request prototype from handoff');
    expect(appSource).not.toContain('Start UI overhaul from handoff');
    expect(appSource).not.toContain('Save readiness slimming');
    expect(appSource).not.toContain('Run annual account sequencing');
    expect(appSource).not.toContain('Use this withdrawal family');
    expect(appSource).not.toContain('Follow this account detail');
    expect(appSource).not.toContain('Start worker');
    expect(appSource).not.toContain('Use server sequencing');
    expect(appSource).not.toContain('Select province for sequencing');
    expect(appSource).not.toContain('Apply locked-in account rules');
    expect(appSource).not.toContain('Model GIS in sequencing');
    expect(appSource).not.toContain('Collect personal feedback');
    expect(appSource).not.toContain('Save feedback');
    expect(appSource).not.toContain('Apply annual sequencing');
    expect(appSource).not.toContain('Save sequencing result');
    expect(appSource).not.toContain('Migrate sequencing schema');
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
    expect(appSource).toContain('Regular spending assumptions');
    expect(appSource).toContain('Exclude mortgage payments already entered in Debts');
    expect(appSource).toContain('The planner can model spending changing with age.');
    expect(appSource).toContain('Early spending changes at age');
    expect(appSource).toContain('Later spending changes at age');
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

  it('keeps active spending copy oriented around assumptions and monthly capacity', () => {
    const activeCopySources = [appSource, boundedOptimizerSource, resultSelectorsSource].join('\n');
    const retiredPhrases = [
      'spending target',
      'spending targets',
      'desired spending',
      'desired spend',
      'Go / slow / no-go',
      'Retirement lifestyle spending',
      'Go phase spending',
      'Go phase ends at age',
      'Slow phase spending',
      'Slow phase ends at age',
      'No-go phase spending'
    ];

    expect(appSource).toContain('Estimated after-tax monthly spending');
    expect(appSource).toContain('Regular spending assumptions');
    expect(appSource).toContain('Early spending assumption');
    expect(resultSelectorsSource).toContain('Minimum spending needs review');
    expect(appSource).toContain('The monthly answer can still reflect spending changing with age.');
    expect(appSource).toContain('Adjust the spending breakpoints in Guided Intake and');
    retiredPhrases.forEach((phrase) => {
      expect(activeCopySources).not.toContain(phrase);
    });
  });

  it('frames funding sources as a trace instead of account instructions', () => {
    expect(appSource).toContain('Where the first-year spending comes from');
    expect(appSource).toContain('First-year spending funding trace');
    expect(appSource).toContain('This is a first-year funding trace for review, not annual account-by-account withdrawal instructions.');
    expect(appSource).toContain('It does not tell you which account to withdraw from');
  });

  it('keeps the minimum-expense bridge in Details without adding saved output', () => {
    const overviewStart = appSource.indexOf("activeSection === 'overview'");
    const overviewEnd = appSource.indexOf('<DeferredResultsPanel', overviewStart);
    const overviewBranch = appSource.slice(overviewStart, overviewEnd);

    expect(appSource).toContain('Minimum expense bridge');
    expect(appSource).toContain('Temporary monthly floor');
    expect(appSource).toContain('Estimated monthly capacity');
    expect(resultSelectorsSource).toContain('Bridge-only summary: current phased spending is used as a temporary minimum-expense fixture.');
    expect(overviewBranch).not.toContain('Minimum expense bridge');
    expect(appSource).toContain('minimumExpenseCoverage={minimumExpenseCoverage}');
    expect(resultSelectorsSource).toContain('No saved field or engine output is added');
  });

  it('keeps the spending-path bridge in Details without adding saved output', () => {
    const overviewStart = appSource.indexOf("activeSection === 'overview'");
    const overviewEnd = appSource.indexOf('<DeferredResultsPanel', overviewStart);
    const overviewBranch = appSource.slice(overviewStart, overviewEnd);

    expect(appSource).toContain('Spending path bridge');
    expect(appSource).toContain('Checking spending path');
    expect(appSource).toContain('spendingPathAgeRange');
    expect(resultSelectorsSource).toContain('No saved field, default reduction rate, or engine output is added');
    expect(overviewBranch).not.toContain('Spending path bridge');
    expect(appSource).toContain('spendingPathBridge={spendingPathBridge}');
  });

  it('keeps the discretionary-room bridge in Details without adding saved output', () => {
    const overviewStart = appSource.indexOf("activeSection === 'overview'");
    const overviewEnd = appSource.indexOf('<DeferredResultsPanel', overviewStart);
    const overviewBranch = appSource.slice(overviewStart, overviewEnd);

    expect(appSource).toContain('Discretionary room bridge');
    expect(appSource).toContain('Monthly room for review');
    expect(appSource).toContain('Checking room above the floor');
    expect(resultSelectorsSource).toContain('No saved field, optimizer action, or engine output is added');
    expect(overviewBranch).not.toContain('Discretionary room bridge');
    expect(appSource).toContain('discretionaryRoomBridge={discretionaryRoomBridge}');
  });
});
