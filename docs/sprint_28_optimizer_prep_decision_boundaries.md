# Sprint 28: Optimizer Prep And Decision Boundaries

Completed: 2026-05-15

## Summary

Sprint 28 prepares for a future consumer-facing optimizer without adding optimizer execution. It adds a runtime-only decision-boundary layer that tells the user which household choices are defined well enough to become future optimizer inputs, which need clearer intent, and which should remain review-only until the corresponding modelling slice exists.

## What Changed

- Added `selectOptimizerDecisionBoundaries` to the result selector layer.
- Defined bounded future optimizer levers for:
  - retirement spending,
  - retirement timing,
  - CPP/OAS timing,
  - withdrawal order and tax timing,
  - estate goal,
  - home sale or downsizing.
- Added an Overview panel for future optimizer prep with:
  - ready input count,
  - needs-clearer-intent count,
  - review-only count,
  - current setting,
  - future search space,
  - why the lever matters,
  - what must be confirmed before optimization.
- Added selector and smoke coverage to confirm the boundary output is runtime-only and does not enter saved plan files.
- Kept the Sprint 27 retirement choice cards as the current comparison layer.

## Non-Scope

- No optimizer execution.
- No new scenario reruns.
- No simulation math changes.
- No changes to `SimulationResult`.
- No changes to saved `.plan.json` schema v2.
- No persisted recommendation, boundary, or optimizer output.

## Verification

Sprint 28 should pass:

- `npm test`
- `npm run build`
- `node probes/probe_simulation_engine_parity.js && node probes/probe_engine_bridge_parity.js`
- `./probes/run_all.sh`
- `find . -name '*.plan.json' -print`

The final file search should return no private plan files created by the sprint.
