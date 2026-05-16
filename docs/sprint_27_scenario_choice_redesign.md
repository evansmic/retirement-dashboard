# Sprint 27: Scenario Choice Redesign

Completed: 2026-05-15

## Summary

Sprint 27 reframed the Results scenario area as household choices instead of technical reruns. The existing baseline, retire-later, spend-less, and delay-benefits previews remain unchanged; this sprint adds a runtime-only interpretation layer that helps consumers understand what each choice is best for and what trade-off it creates.

## What Changed

- Added `selectScenarioChoiceCards` in the result selector layer.
- Added a first choice card for keeping the current plan, so the user can compare alternatives against the plan they actually entered.
- Reframed the three existing reruns as:
  - Spend a little less early.
  - Work two years longer.
  - Delay CPP/OAS to 70.
- Added plain-language "best for" and "trade-off" copy for each choice.
- Reduced first-read card emphasis on technical deltas while preserving the detailed scenario assumption and comparison tables underneath.
- Replaced remaining scenario-facing "go-go" wording in the selector and tests with early-retirement spending language.
- Updated Overview copy from "Scenario Tests" to "Retirement Choices."

## Non-Scope

- No new scenario reruns.
- No custom scenario builder.
- No optimizer behaviour.
- No simulation math changes.
- No changes to saved `.plan.json` schema v2.
- No persisted recommendation or scenario output.

## Verification

Sprint 27 should pass:

- `npm test`
- `npm run build`
- `node probes/probe_simulation_engine_parity.js && node probes/probe_engine_bridge_parity.js`
- `./probes/run_all.sh`
- `find . -name '*.plan.json' -print`

The final file search should return no private plan files created by the sprint.
