# Sprint 336: Legacy Scenario CSV Export Correction

Sprint 336 corrects the year-by-year CSV export placement for tester feedback on the legacy dashboard screen.

## Change

- Added a `Download CSV` control to the Year-by-Year Detail card below the Sequence-of-Returns Stress Test.
- Export uses `RESULTS[activeScenario].years`, so it follows the scenario selected in the dashboard tabs.
- Export respects the current display-dollar mode by using inflated rows when the dashboard is showing real dollars.
- The CSV includes scenario, display-dollar mode, annual ages, benefit income, account draws, taxes, OAS recovery, spending, shortfall, and ending balances.
- The download is browser-local only through a Blob URL.

## Boundaries

- No saved plan schema change.
- No engine output schema change.
- No persisted optimizer output.
- No `.plan.json` file creation.
- No React Results Overview redesign.
- No advisor or account-level instruction language.

## Verification Focus

- The CSV button does not toggle the detail card when clicked.
- The export filename includes the plan title, active scenario key, and display-dollar mode.
- Print output hides the CSV button with the other interactive controls.
- Focused legacy dashboard probes pass.
