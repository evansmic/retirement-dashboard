# Sprint 52: Tax-Aware Drawdown Prototype Evidence

Sprint 52 starts tax-aware drawdown work slowly. It adds evidence rows that show where a future year-by-year drawdown review would look, without changing withdrawal order or creating annual override instructions.

## What Changed

- Added tax-aware drawdown prototype rows inside Drawdown readiness.
- Prototype rows can surface low-tax review windows, registered withdrawal pressure, OAS recovery years, peak tax years, and later-life estate pressure.
- Added UI copy that frames these rows as review windows for later, not instructions.
- Extended tests so prototype evidence remains runtime-only and unsaved.

## Boundaries

- `withdrawalStrategy.mode` remains `currentOrder`.
- `annualOverrides` remains `[]`.
- No custom annual withdrawal overrides are simulated.
- No account-by-account drawdown instructions are created.
- No optimizer output is saved into `.plan.json`.
- No saved plan schema or engine output schema changed.

## Copy Posture

The prototype uses evidence-only language: "future review", "review window", "could a future review", and "does not create instructions." It avoids safe-spending, guaranteed, optimal-drawdown, recommendation, and tax-advice phrasing.

## Verification Intent

Sprint 52 adds selector, UI structure, example-matrix, and persistence coverage around the prototype evidence layer.
