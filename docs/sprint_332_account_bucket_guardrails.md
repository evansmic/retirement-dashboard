# Sprint 332: Account Bucket Guardrails

Sprint 332 tightens broad withdrawal-family eligibility.

## What Changed

- Added a shared account-bucket readiness helper.
- Requires meaningful registered balances and meaningful TFSA/non-registered balances.
- Cash wedge alone no longer makes broad withdrawal-family comparison eligible.
- Updated readiness and eligibility copy to name registered and TFSA/non-registered buckets.

## Boundaries

- No new candidates.
- No saved optimizer output.
- No saved plan schema change.
- No engine output schema change.
- No annual account-level withdrawal instructions.
- No tax-bracket optimization.
- No Monte Carlo-in-loop search.

## Verification

- `npm test -- app/src/engine/boundedOptimizer.test.ts`

## Next Step

Sprint 333 should deepen tax and OAS recovery evidence for broad withdrawal families.
