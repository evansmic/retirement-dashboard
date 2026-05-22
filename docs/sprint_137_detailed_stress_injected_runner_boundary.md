# Sprint 137: Detailed Stress Injected Runner Boundary

## Summary

Kept detailed stress execution ownership in the detailed-report engine path. The future adapter may use an injected runner, but React does not directly run Monte Carlo or historical sequence replay.

## Guardrails

- Runner mode is `injectedOnly`.
- Monte Carlo remains outside React execution.
- Historical replay remains outside React execution.
- Progressive stress lifecycle remains undisturbed.

## Result

The adapter contract can be prototyped later without changing the current execution owner.
