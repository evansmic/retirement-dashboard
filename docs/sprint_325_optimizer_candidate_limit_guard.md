# Sprint 325: Optimizer Candidate Limit Guard

Sprint 325 protects the bounded optimizer candidate set before future expansion.

## What Changed

- Replaced silent `slice(0, 20)` behavior with an explicit candidate-limit helper.
- Kept the bounded optimizer candidate cap at 20.
- Preserved non-grid review families before trimming milestone-grid rows.
- Preserved the explicit CPP/OAS age-70 delay candidate when the cap is reached.
- Added an overflow test covering two-person benefit timing, pension splitting, CPP sharing, home-sale reliance, and withdrawal-family checks.

## Boundaries

- No saved optimizer output.
- No saved plan schema change.
- No engine output schema change.
- No annual account-level withdrawal instructions.
- No full exhaustive CPP/OAS search.
- No new optimizer candidate family.
- No Monte Carlo-in-loop search.

## Verification

- `npm test -- app/src/engine/boundedOptimizer.test.ts`

## Next Step

Pause for a checkpoint before widening another optimizer lever. The next implementation should either improve comparison readability or deliberately choose the next bounded family to expand.
