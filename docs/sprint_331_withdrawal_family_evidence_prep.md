# Sprint 331: Withdrawal Family Evidence Prep

Sprint 331 adds compact evidence for broad withdrawal families.

## What Changed

- Added evidence rows when a broad withdrawal-order family is the first option to review.
- Evidence covers:
  - withdrawal family to compare
  - funded-year movement
  - lifetime-tax movement
  - OAS recovery movement
  - projected money-left movement
- Evidence is explicitly broad-family comparison only, not annual account instructions.

## Boundaries

- No new candidates.
- No saved optimizer output.
- No saved plan schema change.
- No engine output schema change.
- No annual account-level withdrawal instructions.
- No tax-bracket optimization.
- No Monte Carlo-in-loop search.

## Verification

- `npm test -- app/src/engine/boundedOptimizer.test.ts app/src/ui/App.structure.test.js`

## Next Step

Sprint 332 should tighten account-bucket guardrails for broad withdrawal-family comparison.
