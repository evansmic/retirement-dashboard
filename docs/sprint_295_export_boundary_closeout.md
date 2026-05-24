# Sprint 295: Export Boundary Closeout

## Summary

Sprint 295 closes the export-boundary trust batch.

## Outcome

- Save & print has a clearer file-choice explanation.
- Tests protect local backup, printable report, and CSV results export boundaries.
- Engine math, optimizer behavior, drawdown behavior, saved plan schema, and output schema remain unchanged.

## Verification

Use the standard verification suite:

- `npm test`
- `npm run build`
- `node probes/probe_simulation_engine_parity.js`
- `node probes/probe_engine_bridge_parity.js`
- `./probes/run_all.sh`
- `find . -name '*.plan.json' -print`
