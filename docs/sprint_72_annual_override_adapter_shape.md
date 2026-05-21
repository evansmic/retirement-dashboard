# Sprint 72: Annual Override Adapter Shape

## Summary

Sprint 72 adds a draft adapter shape for one eligible drawdown payload. The adapter is a narrow contract check only; it is not passed into the simulation engine.

## What Changed

- Added a draft adapter row with year, account bucket, direction, amount, source payload, and draft-only disposition.
- Built the adapter only when the boundary decision allows a tiny future prototype.
- Kept `withdrawalStrategy.mode` as `currentOrder`.
- Kept `annualOverrides` empty.

## Boundary

The adapter shape is not product execution. It does not change the plan, does not change the calculation, and is not saved.

## Verification Focus

- Eligible payloads can be converted into a draft shape.
- Ineligible boundary states reject adapter work.
- Saved plan files remain clean.
