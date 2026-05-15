# Sprint 21: Engine Extraction Scenario And Survivor Runner

## Summary

Sprint 21 moves the React Results preview rerun orchestration into an engine-owned helper. React still renders the same result panels, selectors still receive the same baseline/scenario/survivor bundle, and the stable dashboard remains the complete audit and print/PDF fallback.

This is extraction only: no simulation math changes, no schema changes, no optimizer work, and no persisted recommendation or readiness output.

## What Changed

- Added `app/src/engine/previewScenarios.ts` as the runtime boundary for Results preview reruns.
- Centralized the baseline preview config, three bounded scenario reruns, and survivor rerun gating.
- Kept the React bridge preview shape as `{ result, scenarios, survivor }`.
- Updated `App.tsx` so Results preview loading calls `runResultsPreviewBundle(plan)` instead of constructing reruns inline.
- Added focused tests for scenario transforms, survivor gating, and the preview bundle contract.
- Added a probe to keep React from drifting back into direct scenario orchestration.

## Runtime Contract

- Scenario ids remain `retireLater`, `spendLessGogo`, and `delayBenefits`.
- Survivor preview still runs only when Person 2 is active and `p1DiesInSurvivor` is set.
- Baseline preview defaults remain CPP/OAS at 65, no meltdown, 5% return, no pension split, and the plan withdrawal order.
- The helper output is runtime-only and is not written to `.plan.json`.

## Verification

Sprint 21 should pass:

- `npm test`
- `npm run build`
- `node probes/probe_preview_scenario_runner.js`
- `node probes/probe_simulation_engine_parity.js && node probes/probe_engine_bridge_parity.js`
- `./probes/run_all.sh`
- `find . -name '*.plan.json' -print`

The final check should return no private plan files.
