import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const appSource = readFileSync(new URL('./App.tsx', import.meta.url), 'utf8');

describe('Results overview structure', () => {
  it('keeps audit-style evidence reachable from Details instead of the Overview flow', () => {
    const overviewStart = appSource.indexOf("activeSection === 'overview'");
    const overviewEnd = appSource.indexOf('<ResultsReadinessPanel compact', overviewStart);
    const overviewBranch = appSource.slice(overviewStart, overviewEnd);
    const detailsStart = appSource.indexOf('function DetailsResultsPanel');
    const detailsEnd = appSource.indexOf('function FirstYearMoneyFlowPanel');
    const detailsPanel = appSource.slice(detailsStart, detailsEnd);

    expect(overviewBranch).toContain('<RetirementAnswerPanel');
    expect(overviewBranch).toContain('<SpendingCapacityPanel');
    expect(overviewBranch).toContain('<ReviewTheseFirstPanel');
    expect(overviewBranch).toContain('<BoundedOptimizerPanel');
    expect(overviewBranch).toContain('<OverviewHighlightsPanel');
    expect(overviewBranch).toContain('<EstateIntentPanel');
    expect(overviewBranch).not.toContain('<ScenarioCardsPanel');
    expect(overviewBranch).not.toContain('<ProjectionPathPanel');
    expect(overviewBranch).not.toContain('<ReconciliationDiagnosticsPanel');
    expect(overviewBranch).not.toContain('<TaxPressurePanel');
    expect(overviewBranch).not.toContain('<OptimizerBoundaryPanel');

    expect(detailsPanel).toContain('<ProjectionPathPanel');
    expect(detailsPanel).toContain('<ReconciliationDiagnosticsPanel');
    expect(detailsPanel).toContain('<TaxPressurePanel');
    expect(detailsPanel).toContain('<OptimizerBoundaryPanel');
    expect(detailsPanel).toContain('<BoundedOptimizerPanel');
    expect(detailsPanel).toContain('<DrawdownReadinessPanel');
    expect(detailsPanel).toContain('<FirstYearMoneyFlowPanel');
  });

  it('explains bounded optimizer output without advice or saved-output language', () => {
    expect(appSource).toContain('Plan options to review');
    expect(appSource).toContain('Why this option');
    expect(appSource).toContain('Trade-offs');
    expect(appSource).toContain('Check before using');
    expect(appSource).toContain('Review first');
    expect(appSource).toContain('Skipped');
    expect(appSource).toContain('Pension splitting');
    expect(appSource).toContain('CPP sharing');
    expect(appSource).toContain('Option evidence');
    expect(appSource).toContain('What changed in this test');
    expect(appSource).toContain('income-sharing or home-sale reliance checks');
    expect(appSource).toContain('Confirm eligibility before relying on them');
    expect(appSource).toContain('Tax and funding drivers');
    expect(appSource).toContain('Why the option moved');
    expect(appSource).toContain('They explain direction, not a final recommendation');
    expect(appSource).toContain('Why options were tested');
    expect(appSource).toContain('Guardrails before recommendations');
    expect(appSource).toContain('These checks keep the review inside the timing and tax rules');
    expect(appSource).toContain('Suggestion discipline');
    expect(appSource).toContain('Why some options stay review-only');
    expect(appSource).toContain('Option map');
    expect(appSource).toContain('What kind of choices were checked');
    expect(appSource).toContain('lifestyle choices, timing choices, tax checks, drawdown review, and home or estate assumptions');
    expect(appSource).toContain('First option to review means it cleared the highlight checks');
    expect(appSource).toContain('Review-only means the result is useful evidence');
    expect(appSource).toContain('save optimizer results');
    expect(appSource).not.toContain('Apply optimized plan');
    expect(appSource).not.toContain('Guaranteed');
  });

  it('shows spending stress as review evidence without advice language', () => {
    expect(appSource).toContain('Spending stress check');
    expect(appSource).not.toContain('safe spend');
    expect(appSource).not.toContain('you can spend more');
  });

  it('shows drawdown readiness in Details without optimizer execution language', () => {
    const overviewStart = appSource.indexOf("activeSection === 'overview'");
    const overviewEnd = appSource.indexOf('<ResultsReadinessPanel compact', overviewStart);
    const overviewBranch = appSource.slice(overviewStart, overviewEnd);

    expect(appSource).toContain('Drawdown readiness');
    expect(appSource).toContain('Tax-aware prototype evidence');
    expect(appSource).toContain('Review windows for later');
    expect(appSource).toContain('They do not create instructions');
    expect(appSource).toContain('Future drawdown draft checks');
    expect(appSource).toContain('Is this plan ready for future tax-aware drawdown testing?');
    expect(appSource).toContain('Future sandbox gate');
    expect(appSource).toContain('Hold for later comparison');
    expect(appSource).toContain('They are not run as part of the calculation');
    expect(appSource).toContain('does not change withdrawal order');
    expect(appSource).toContain('does not change the current withdrawal order');
    expect(overviewBranch).not.toContain('<DrawdownReadinessPanel');
    expect(appSource).not.toContain('optimal drawdown');
    expect(appSource).not.toContain('recommended withdrawal strategy');
    expect(appSource).not.toContain('safe spend');
    expect(appSource).not.toContain('guaranteed');
  });

  it('keeps save and report actions distinct in the consumer UI', () => {
    expect(appSource).toContain('Save editable plan');
    expect(appSource).toContain('Open printable report');
    expect(appSource).toContain('It may look more detailed than this guided Results page');
    expect(appSource).toContain('This saves the household inputs and assumptions');
    expect(appSource).toContain('It is not the');
    expect(appSource).toContain('printable client report');
    expect(appSource).not.toContain('Save .plan.json');
    expect(appSource).not.toContain('Local .plan.json');
    expect(appSource).not.toContain('Open .plan.json');
  });

  it('keeps visible React copy free of internal engineering phrases', () => {
    expect(appSource).not.toContain('extracted simulation output');
    expect(appSource).not.toContain('runtime-only');
    expect(appSource).not.toContain('stable dashboard');
    expect(appSource).not.toContain('legacy charts');
    expect(appSource).not.toContain('source reconciliation');
    expect(appSource).not.toContain('cash-flow delta');
    expect(appSource).not.toContain('bounded preview');
    expect(appSource).not.toContain('wasted unnecessarily');
  });

  it('keeps examples and high-friction intake labels consumer-facing', () => {
    expect(appSource).toContain('Custom plan based on');
    expect(appSource).toContain('Locked-in account (LIRA)');
    expect(appSource).toContain('Locked-in income account (LIF)');
    expect(appSource).toContain('Canada Pension Plan (CPP) at 65');
    expect(appSource).toContain('Old Age Security (OAS) monthly');
    expect(appSource).toContain('Withdrawal order to test');
    expect(appSource).not.toContain('Example: ${action.label}');
    expect(appSource).not.toContain('CPP 65 monthly');
    expect(appSource).not.toContain('OAS monthly</span>');
  });
});
