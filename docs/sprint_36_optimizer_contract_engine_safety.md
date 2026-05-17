# Sprint 36: Optimizer Contract & Engine Safety

Sprint 36 prepares the planner for optimizer execution without running an optimizer. The work keeps the current engine output and saved plan schema unchanged while making the future optimizer boundary explicit and safer.

## What Changed

- Added `app/src/engine/optimizerContract.ts`, a non-executing optimizer contract that describes:
  - household levers the optimizer may explore,
  - household wishes it must preserve,
  - missing decisions that block future search,
  - the current withdrawal order,
  - a future annual withdrawal override shape for year-by-year draw instructions.
- Added defensive simulation behavior: validation blockers, engine errors, or non-finite rows return a safe empty result instead of throwing into the React preview path.
- Added validation for negative account and cash balances before the engine runs.
- Made example plans clearer as editable working copies: `Custom plan based on ...`.
- Tightened visible labels for locked-in accounts, CPP/OAS estimates, and withdrawal order.
- Added tests proving no optimizer contract is persisted into `.plan.json`.

## Boundaries

- No optimizer execution.
- No strategy application.
- No saved optimizer output.
- No engine schema or output contract change.
- No report route migration.

## Next Step

Sprint 37 can start bounded optimizer execution planning. It should plug into the contract created here, keep explanations review-oriented, and avoid presenting optimized results as advice.
