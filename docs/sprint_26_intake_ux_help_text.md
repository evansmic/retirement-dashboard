# Sprint 26: Intake UX And Help Text

Completed: 2026-05-15

## Summary

Sprint 26 softened the guided intake language so the form reads more like a retirement planning conversation and less like implementation scaffolding. The slice stays consumer-facing and runtime-safe: no engine math changes, no schema changes, and no new saved fields.

## What Changed

- Reframed intake navigation helpers around household outcomes, spending room, and planning choices.
- Added or tightened contextual help for:
  - CPP/OAS estimates.
  - Defined-benefit bridge pensions before and after age 65.
  - LIRA/LIF locked-in accounts.
  - Non-registered adjusted cost base.
  - Survivor CPP and survivor scenario timing.
  - Home sale/downsize cash.
  - Estate goals.
- Reworded spending phases as early, later, and late-life retirement spending.
- Removed remaining intake-facing schema/prototype language from step guidance.
- Renamed the review action to "Continue to results" and kept technical handoff terms out of the consumer path.
- Added small-field and toggle help styling so explanatory copy fits the existing guided intake layout.

## Non-Scope

- No changes to `SimulationResult`.
- No changes to saved `.plan.json` schema v2.
- No optimizer or new recommendation logic.
- No stable dashboard migration.
- No paid/advisor-only advanced view gating.

## Verification

Sprint 26 should pass the standard local verification suite:

- `npm test`
- `npm run build`
- `node probes/probe_simulation_engine_parity.js && node probes/probe_engine_bridge_parity.js`
- `./probes/run_all.sh`
- `find . -name '*.plan.json' -print`

The final file search should return no private plan files created by the sprint.
