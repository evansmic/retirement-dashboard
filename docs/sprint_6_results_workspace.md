# Sprint 6 Results Workspace

Started 2026-05-06 after Sprint 5 guided intake smoke passed locally.

## S6-01 Screen Map

The first React results workspace slice uses this navigation map:

1. Overview
2. Cash Flow
3. Income Sources
4. Accounts
5. Taxes
6. Stress Tests
7. Assumptions
8. Export/Save

Decision:

- Ship Overview first inside the React shell.
- Keep the stable dashboard as the complete results fallback until the React panels reach parity.
- Use typed selectors over extracted simulation rows; do not alter engine output or persisted v2 plan files.
- Keep source reconciliation visible from the beginning because prior Larry-plan defects came from incomplete funding-source accounting.

## First Slice

S6-02 adds selectors for overview metrics, funding-source rows, account balance series, chart-ready rows, and cash-flow reconciliation.

S6-03 adds the Overview panel with projection years, end portfolio, first-year spending/funding reconciliation, validation warnings/blockers, and stable dashboard fallback actions.

S6-04 adds a Cash Flow tab that checks annual source reconciliation. The first pass shows rows checked, warning count, first warning year, and the first 12 annual rows with funding before tax, tax, after-tax spending, reconciliation gap, cash-flow delta, and end portfolio.

S6-05 promotes the results tab state into the React workspace reducer. Overview and Cash Flow render migrated previews. Income Sources, Accounts, Taxes, Stress Tests, Assumptions, and Export/Save are selectable placeholders that keep the mapped shell visible while directing complete detail to the stable dashboard.

S6-06 adds automated smoke coverage for Larry-style single, a couple plan, and a single-person plan with blank Person 2. The smoke runs the same preview simulation boundary, checks Overview selectors, Cash Flow reconciliation rows, the navigation map, and v2 dashboard handoff packaging.

S6-07 adds the Income Sources preview tab. It groups salary, DB pension, CPP, OAS, registered withdrawals, TFSA/non-registered withdrawals, cash wedge funding, and other inflows into first-year and lifetime totals without changing engine output.

S6-08 adds the Accounts preview tab. It summarizes RRSP/RRIF, TFSA, LIF, non-registered, cash wedge, and total portfolio balances, then shows the first 12 annual balance rows while leaving full account detail in the stable dashboard.

S6-09 adds the Taxes preview tab. It summarizes first-year tax, lifetime tax, peak tax year, first-year taxable income, lifetime OAS clawback, and the first 12 annual tax rows without replacing the stable tax schedules.

S6-10 adds the Stress Tests preview tab. It reports baseline indicators from the current projection: first shortfall year, depletion, minimum portfolio, terminal portfolio, and funded years. Full scenario and Monte Carlo surfaces remain in the stable dashboard.

S6-11 adds the Assumptions preview tab. It summarizes plan years, return/inflation/volatility, withdrawal order, sharing/RRIF/spousal settings, survivor year, and cash wedge assumptions as read-only results context.

S6-12 adds the Export/Save preview tab. It keeps the local v2 `.plan.json` workflow explicit and preserves the stable dashboard as the complete results fallback.

S6-13 deepens Overview with a projection path table. It reuses chart-ready selector data to show first/mid/final year after-tax spending, tax, portfolio, and shortfall.

S6-14 deepens Export/Save by placing the local `.plan.json` save action directly inside the tab, while keeping the shared footer action and stable dashboard fallback.

S6-15 adds all-years source reconciliation diagnostics. Overview and Cash Flow now show rows checked, warning count, first warning year, maximum funding gap, and maximum cash-flow delta.

S6-16 deepens Accounts with account net-change values and a summary table showing start, end, peak, and drawdown/growth by account bucket.

Deferred Sprint 6 panels:

- None in the initial screen map. Further work should deepen panel parity rather than expand scope.
