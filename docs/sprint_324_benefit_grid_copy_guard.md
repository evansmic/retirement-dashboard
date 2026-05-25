# Sprint 324: Benefit Grid Copy Guard

Sprint 324 protects the benefit-grid evidence added in Sprint 323.

## What Changed

- Updated the Details option-evidence copy so it accurately covers benefit timing, income-sharing, and home-sale reliance checks.
- Reframed the milestone-pair evidence label as "First milestone pair to review."
- Added structure-test coverage for the new benefit-grid evidence labels.
- Added a prohibited-copy guard against "Best milestone pair" and "do this."

## Boundaries

- No saved optimizer output.
- No saved plan schema change.
- No engine output schema change.
- No annual account-level withdrawal instructions.
- No full exhaustive CPP/OAS search.
- No new optimizer candidate family.
- No Monte Carlo-in-loop search.

## Verification

- `npm test -- app/src/engine/boundedOptimizer.test.ts app/src/ui/App.structure.test.js`

## Next Step

Sprint 325 should add a small candidate-count safety guard so future optimizer expansion cannot silently push important review families out of the bounded set.
