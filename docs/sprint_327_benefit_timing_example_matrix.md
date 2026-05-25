# Sprint 327: Benefit Timing Example Matrix

Sprint 327 runs the benefit-timing evidence path across built-in examples.

## What Changed

- Added example-matrix coverage for benefit-timing candidates.
- Requires top-three benefit evidence when benefit timing is eligible.
- Guards benefit evidence against optimal, guaranteed, and do-this wording.
- Keeps assertions eligibility-aware so examples that cannot test timing are not forced into false readiness.

## Boundaries

- No new candidates.
- No saved optimizer output.
- No saved plan schema change.
- No engine output schema change.
- No annual account-level withdrawal instructions.
- No full exhaustive CPP/OAS search.
- No Monte Carlo-in-loop search.

## Verification

- `npm test -- app/src/engine/examplePlanOptimizerReadiness.test.ts`

## Next Step

Sprint 328 should tighten bridge-year and survivor harm checks around benefit timing.
