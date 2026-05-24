# Sprint 280: Decision Details Compaction Closeout

## Summary

Sprint 280 closes the decision Details compaction batch.

## Outcome

- Normal Details shows the decision checklist as the visible decision surface.
- Decision detail and projection path diagnostics are gated behind `SHOW_DECISION_RESEARCH_PANELS`.
- Tests protect compact decision placement and diagnostic gating.
- Engine math, optimizer behavior, drawdown behavior, saved plan schema, and output schema remain unchanged.

## Verification

Use the standard verification suite:

- `npm test`
- `npm run build`
- `node probes/probe_simulation_engine_parity.js`
- `node probes/probe_engine_bridge_parity.js`
- `./probes/run_all.sh`
- `find . -name '*.plan.json' -print`
