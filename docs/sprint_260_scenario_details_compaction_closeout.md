# Sprint 260: Scenario Details Compaction Closeout

## Summary

Sprint 260 closes the scenario Details compaction batch.

## Outcome

- Normal Details keeps consumer-readable benefit timing and spending stress summaries.
- Raw scenario assumption and comparison tables are gated behind a disabled internal research flag.
- Tests protect compact scenario placement and table gating.
- Engine math, optimizer behavior, drawdown behavior, saved plan schema, and output schema remain unchanged.

## Verification

Use the standard verification suite:

- `npm test`
- `npm run build`
- `node probes/probe_simulation_engine_parity.js`
- `node probes/probe_engine_bridge_parity.js`
- `./probes/run_all.sh`
- `find . -name '*.plan.json' -print`
