# Sprint 334: Withdrawal Copy And Example Guard

Sprint 334 adds example-matrix guardrails for broad withdrawal-family evidence.

## What Changed

- Checks built-in examples for withdrawal-family evidence when withdrawal order leads.
- Requires broad-family and current-plan framing.
- Blocks account-instruction and tax-bracket-optimization wording.

## Boundaries

- No new candidates.
- No saved optimizer output.
- No saved plan schema change.
- No engine output schema change.
- No annual account-level withdrawal instructions.
- No tax-bracket optimization.
- No Monte Carlo-in-loop search.

## Verification

- `npm test -- app/src/engine/examplePlanOptimizerReadiness.test.ts`

## Next Step

Sprint 335 should stop for a withdrawal sequencing prep checkpoint.
