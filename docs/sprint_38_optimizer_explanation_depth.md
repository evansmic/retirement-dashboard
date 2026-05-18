# Sprint 38: Optimizer Explanation Depth

Sprint 38 deepens the first bounded optimizer without expanding the search. The goal is to make the selected plan option easier to understand before adding more optimizer power.

## What Changed

- Added structured explanation output to `runBoundedOptimizer`.
- Explained why the selected option ranked highest:
  - funded years,
  - first shortfall,
  - projected money left,
  - lifetime tax movement.
- Added trade-off language for:
  - lower spending,
  - working longer,
  - delayed CPP/OAS,
  - withdrawal-order checks.
- Added "check before using" steps so optimizer output stays review-oriented.
- Added compact Overview explanation and fuller Details explanation blocks.

## Boundaries

- No wider candidate set.
- No automatic application of optimizer results.
- No saved optimizer output.
- No personalized financial advice.
- No guaranteed safe-spending language.
- No year-by-year tax-bracket optimization.

## Next Step

Sprint 39 should refine optimizer eligibility rules before widening the search. The app should become clearer about when each lever is appropriate to test, especially for spending reductions, work-timing changes, benefit delay, survivor-sensitive plans, and drawdown-order checks.
