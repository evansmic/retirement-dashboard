# Sprint 39: Optimizer Eligibility Refinement

Sprint 39 tightens the bounded optimizer before widening search. Instead of testing every lever whenever the contract says it can be explored, the optimizer now checks whether the lever makes sense for the current household.

## What Changed

- Added eligibility notes to `runBoundedOptimizer`.
- Skipped spending-reduction tests when planned annual spending is already very low.
- Skipped working-longer tests when a retirement age is already 70 or later.
- Required enough CPP/OAS estimates before benefit-delay testing.
- Required meaningful balances in both registered and flexible account buckets before withdrawal-order testing.
- Flagged two-person plans that need a survivor scenario year before relying on optimizer choices.
- Surfaced included/skipped/review-first notes in Results.

## Boundaries

- No wider candidate set.
- No automatic application of optimizer results.
- No saved optimizer output.
- No personalized financial advice.
- No guaranteed safe-spending language.
- No year-by-year tax-bracket optimization.

## Next Step

Sprint 40 can consider a carefully bounded search expansion. Good candidates are modest: one new candidate family or one richer eligibility rule, not a full tax-aware drawdown optimizer yet.
