# Sprint 42: Optimizer Tax-Driver Explanations

Sprint 42 explains why the selected bounded optimizer option moved. It does not add a new candidate family or apply optimizer results.

## What Changed

- Added selected-option driver rows to the bounded optimizer summary.
- Compared the selected option against the current plan for:
  - funded years,
  - lifetime tax,
  - peak annual tax,
  - OAS recovery tax,
  - projected money left.
- Added a Details-only "Tax and funding drivers" panel.
- Kept the copy directional and review-oriented.

## Boundaries

- No new candidate family.
- No automatic application of optimizer results.
- No saved optimizer output.
- No personalized financial advice.
- No guaranteed safe-spending language.
- No year-by-year tax-bracket optimization.
- No engine schema or saved plan schema change.

## Next Step

Sprint 43 can consider one narrow next behavior, such as a modest guardrail-spending stress. Full tax-aware drawdown optimization should still wait until the explanation layer has held up across example plans.
