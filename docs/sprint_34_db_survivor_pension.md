# Sprint 34: DB Survivor Pension Inputs And Survivor Cash-Flow Accuracy

Status: complete on 2026-05-16.

## Summary

Sprint 34 adds explicit defined-benefit pension survivor continuation inputs before optimizer work begins. The survivor preview already reruns the plan with Person 1 dying first; this sprint makes that rerun use a household's pension-statement spouse continuation instead of relying only on the historical 60% default.

## What Changed

- Added optional per-person DB survivor fields:
  - `db_survivor_pct`
  - `db_survivor_annual`
- Updated the survivor DB pension calculation so:
  - custom annual survivor amount wins when present;
  - otherwise the entered survivor percentage is used;
  - otherwise old plans keep the previous 60% continuation behavior.
- Added intake copy telling households to use the spouse continuation from the pension statement.
- Added explicit 60% survivor continuation to the public-sector DB couple example.
- Updated Survivor Impact review language so DB continuation is treated as an income-source review item.

## Compatibility

- No schema-version change.
- No optimizer execution.
- No broad survivor-model redesign.
- No printable-report routing changes.
- Existing plans without the new fields retain the previous 60% fallback for Person 1 DB survivor testing.

## Verification

Run before completion:

- `npm test`
- `npm run build`
- `node probes/probe_simulation_engine_parity.js && node probes/probe_engine_bridge_parity.js`
- `./probes/run_all.sh`
- `find . -name '*.plan.json' -print`
