# Sprint 255: Option Details Compaction Closeout

## Summary

Sprint 255 closes the option Details compaction batch.

## Outcome

- Normal Details uses the compact plan-options panel.
- Full option research stays behind a disabled internal gate.
- Tests protect compact placement and full-panel gating.
- Engine math, optimizer behavior, drawdown behavior, saved plan schema, and output schema remain unchanged.

## Verification

Use the standard verification suite:

- `npm test`
- `npm run build`
- `node probes/probe_simulation_engine_parity.js`
- `node probes/probe_engine_bridge_parity.js`
- `./probes/run_all.sh`
- `find . -name '*.plan.json' -print`
