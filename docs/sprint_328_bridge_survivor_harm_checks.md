# Sprint 328: Bridge And Survivor Harm Checks

Sprint 328 tightens benefit-timing guardrails for survivor-sensitive plans.

## What Changed

- Benefit-timing candidates stay review-only when a two-person plan is missing a survivor scenario year.
- The existing bridge-year shortfall guard remains in place.
- Added focused test coverage for the survivor-review guard.

## Boundaries

- No new candidates.
- No saved optimizer output.
- No saved plan schema change.
- No engine output schema change.
- No annual account-level withdrawal instructions.
- No full exhaustive CPP/OAS search.
- No Monte Carlo-in-loop search.

## Verification

- `npm test -- app/src/engine/boundedOptimizer.test.ts`

## Next Step

Sprint 329 should guard benefit-timing copy and readability before the checkpoint.
