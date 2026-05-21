# Sprint 82: Prototype Harm Checks

## Summary

Sprint 82 adds harm checks around the contained drawdown prototype.

## What Changed

- Blocked the contained prototype when funded years worsen or the first shortfall appears earlier.
- Blocked the contained prototype when an entered estate goal could be weakened.
- Kept tax and OAS recovery movement as review evidence.

## Boundary

Harm checks do not recommend a strategy. They only decide whether the contained prototype can be reviewed safely.

## Verification Focus

- Funding harm blocks the prototype.
- Estate-goal harm blocks the prototype.
- Blocked rows are visible in tests.
