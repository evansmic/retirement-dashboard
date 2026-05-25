# Sprint 322: Benefit Timing Milestone Grid

Sprint 322 widens runtime CPP/OAS timing execution beyond the initial 65/70 seed candidates.

## What Changed

- `SimulationConfig` now accepts numeric CPP/OAS start ages at runtime.
- The bounded optimizer now creates a milestone benefit grid:
  - CPP: 60, 65, 67, 70
  - OAS: 65, 67, 70
- The current age-65 baseline remains the comparison point.
- The all-age-70 candidate remains the explicit delay-benefits review candidate.
- The expanded grid stays below the existing 20-candidate cap.

## Boundaries

- Runtime-only optimizer candidates.
- No saved optimizer output.
- No saved plan schema change.
- No engine output schema change.
- No annual account-level withdrawal instructions.
- No full exhaustive CPP/OAS search yet.
- No Monte Carlo-in-loop search.

## Verification

- `npm test -- app/src/engine/boundedOptimizer.test.ts`

## Next Step

Sprint 323 should improve benefit-grid comparison evidence in Details before adding more candidate families or full age-by-age exhaustive search.
