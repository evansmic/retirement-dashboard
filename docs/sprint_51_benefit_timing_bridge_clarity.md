# Sprint 51: Benefit Timing Bridge-Year Clarity

Sprint 51 refines the existing CPP/OAS delay check. It does not add a new optimizer candidate or apply benefit timing changes.

## What Changed

- Added more specific benefit timing skip notes for missing CPP/OAS estimates, already-age-70 cases, and projections that do not reach age 70.
- Added benefit timing evidence rows for bridge years before age 70, first bridge shortfall, lifetime tax change, and projected money-left change.
- Refined the review-only reason when delayed benefits create bridge-year shortfalls.

## Boundaries

- No new optimizer candidate family was added.
- No benefit timing choice is applied to the saved plan.
- No tax-aware drawdown execution was added.
- No annual withdrawal overrides are applied.
- No optimizer output is saved into `.plan.json`.
- No saved plan schema or engine output schema changed.

## Copy Posture

CPP/OAS delay remains a review check. Bridge-year wording highlights the practical cash-flow risk before age 70 without presenting delay as advice.

## Verification Intent

Sprint 51 adds tests for benefit timing eligibility reasons, bridge-year evidence rows, review-only bridge shortfalls, and persistence guardrails.
