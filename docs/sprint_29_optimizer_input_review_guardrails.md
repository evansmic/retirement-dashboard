# Sprint 29: Optimizer Input Review And Guardrails

Completed: 2026-05-15

## Summary

Sprint 29 turns the optimizer boundary map into a deliberate review step before any automatic search is introduced. It keeps the optimizer future-facing and runtime-only: the app can now explain which household choices a future optimizer may explore, which wishes must be preserved, and which inputs still need a household decision.

## What Changed

- Added `selectOptimizerInputReview` to translate Sprint 28 boundaries into optimizer permission rows.
- Added runtime-only permission categories:
  - `canExplore`
  - `mustPreserve`
  - `needsDecision`
- Added guardrail copy for spending, retirement timing, CPP/OAS timing, withdrawal order, estate target, and downsizing.
- Added an Overview review panel that separates:
  - choices the future optimizer can explore,
  - wishes the future optimizer should protect,
  - choices the household must clarify first.
- Added selector and smoke coverage confirming optimizer review output remains runtime-only and is not saved into `.plan.json`.

## Non-Scope

- No optimizer execution.
- No optimizer permission persistence.
- No saved plan schema changes.
- No new scenario reruns.
- No simulation math changes.
- No changes to `SimulationResult`.

## Verification

Sprint 29 should pass:

- `npm test`
- `npm run build`
- `node probes/probe_simulation_engine_parity.js && node probes/probe_engine_bridge_parity.js`
- `./probes/run_all.sh`
- `find . -name '*.plan.json' -print`

The final file search should return no private plan files created by the sprint.
