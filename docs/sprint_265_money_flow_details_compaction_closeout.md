# Sprint 265: Money Flow Details Compaction Closeout

## Summary

Sprint 265 closes the Money Flow Details compaction batch.

## Outcome

- Normal Details keeps consumer-readable money-flow story and first-year ledger evidence.
- Reconciliation diagnostics are gated behind a disabled internal research flag.
- Tests protect compact money-flow placement and diagnostics gating.
- Engine math, optimizer behavior, drawdown behavior, saved plan schema, and output schema remain unchanged.

## Verification

Use the standard verification suite:

- `npm test`
- `npm run build`
- `node probes/probe_simulation_engine_parity.js`
- `node probes/probe_engine_bridge_parity.js`
- `./probes/run_all.sh`
- `find . -name '*.plan.json' -print`
