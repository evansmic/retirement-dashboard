# Sprint 54: Drawdown Sandbox Gate

Sprint 54 adds one more cautious step toward future tax-aware drawdown execution. It chooses one validated draft check to hold for later comparison, or explains why that future check is blocked.

## What Changed

- Added a sandbox planning summary inside the drawdown draft summary.
- Prioritized one future check when multiple draft rows are available.
- Added statuses for the future sandbox gate: ready to compare later, needs input, blocked, and not ready.
- Surfaced the sandbox gate in Details under Drawdown readiness.
- Extended example and selector tests so sandbox planning output remains safe and unsaved.

## Boundaries

- No sandbox comparison is run in this sprint.
- No annual withdrawal overrides are simulated.
- The current withdrawal order remains the calculation path.
- No account-by-account instructions are created.
- No saved plan schema or engine output schema changed.
- No prototype, draft, sandbox, comparison, optimizer, or strategy output is saved into `.plan.json`.

## Copy Posture

The UI says "Future sandbox gate" and "Hold for later comparison." It frames the row as a future comparison shape, not a recommendation, instruction, or account strategy.

## Next Step

The next sprint can decide whether to introduce one narrow, guarded comparison runner for a single draft shape. That should happen only if the sandbox gate remains stable across examples and still preserves the current withdrawal-order contract.
