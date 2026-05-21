# Sprint 114: Bounded Drawdown UX Copy Guard

Completed 2026-05-21.

## Summary

Added copy guard rows for the bounded drawdown UX candidate so recommendation, guarantee, instruction, and saved-plan boundaries remain explicit.

## Boundaries

- The guard does not run or apply strategy output.
- It does not make the bounded check a recommendation.
- It keeps saved-plan checks runtime-only.

## Verification Focus

- Guard rows remain clear unless saved-plan boundaries fail.
- Forbidden copy such as guarantee, safe spend, and recommended withdrawal strategy stays absent.
- Saved `.plan.json` files do not include copy-guard output.
