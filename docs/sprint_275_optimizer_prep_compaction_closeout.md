# Sprint 275: Optimizer Prep Compaction Closeout

## Summary

Sprint 275 closes the optimizer-prep compaction batch.

## Outcome

- Normal Details shows compact plan options only.
- Future optimizer prep and permissions review are gated behind `SHOW_OPTION_RESEARCH_PANELS`.
- Tests protect compact option placement and optimizer-prep gating.
- Engine math, optimizer behavior, drawdown behavior, saved plan schema, and output schema remain unchanged.

## Verification

Use the standard verification suite:

- `npm test`
- `npm run build`
- `node probes/probe_simulation_engine_parity.js`
- `node probes/probe_engine_bridge_parity.js`
- `./probes/run_all.sh`
- `find . -name '*.plan.json' -print`
