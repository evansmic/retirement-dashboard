# Sprint 63: Drawdown Execution Contract v1

## Summary

Sprint 63 adds a runtime-only contract for future drawdown execution testing. It defines the shape of a future payload and validates it without passing annual overrides into the product calculation.

## What Changed

- Added a runtime-only drawdown payload shape.
- Validated gate status, projection year, account bucket, amount band, and saved-plan boundary.
- Preserved `withdrawalStrategy.mode` as `currentOrder`.
- Preserved `annualOverrides` as an empty array.
- Added tests proving contract output stays out of saved plan files.

## Boundaries

- No product execution of annual overrides.
- No engine output schema change.
- No saved plan schema change.
- No UI instructions for account withdrawals.
