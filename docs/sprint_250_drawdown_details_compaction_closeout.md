# Sprint 250: Drawdown Details Compaction Closeout

## Summary

Sprint 250 closes the drawdown Details compaction batch.

## Outcome

- Normal Details shows one compact drawdown review summary.
- Research-style drawdown readiness diagnostics are gated with the internal research stack.
- Tests protect compact Details placement and Overview exclusion.
- Engine math, optimizer behavior, drawdown behavior, saved plan schema, and output schema remain unchanged.

## Verification

Use the standard verification suite:

- `npm test`
- `npm run build`
- `node probes/probe_simulation_engine_parity.js`
- `node probes/probe_engine_bridge_parity.js`
- `./probes/run_all.sh`
- `find . -name '*.plan.json' -print`
