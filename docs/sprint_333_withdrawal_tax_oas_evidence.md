# Sprint 333: Withdrawal Tax/OAS Evidence

Sprint 333 deepens broad withdrawal-family tax evidence.

## What Changed

- Added first-year tax movement for the leading broad withdrawal family.
- Added peak annual tax movement for the leading broad withdrawal family.
- Kept lifetime tax, OAS recovery, and projected money-left movement visible.
- Evidence appears only when a withdrawal family is the first option to review.

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

Sprint 334 should add example and copy guards for broad withdrawal-family evidence.
