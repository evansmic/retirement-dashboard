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
    expect(detailsPanel).toContain('<FirstYearMoneyFlowPanel');
  });

  it('explains bounded optimizer output without advice or saved-output language', () => {
    expect(appSource).toContain('Plan options to review');
    expect(appSource).toContain('Why this option');
    expect(appSource).toContain('Trade-offs');
    expect(appSource).toContain('Check before using');
    expect(appSource).toContain('save optimizer results');
    expect(appSource).not.toContain('Apply optimized plan');
    expect(appSource).not.toContain('Guaranteed');
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
