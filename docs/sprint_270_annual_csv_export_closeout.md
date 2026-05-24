# Sprint 270: Annual CSV Export Closeout

## Summary

Sprint 270 closes the annual CSV export batch.

## Outcome

- Users can download year-by-year projection detail as a CSV file.
- The export is available from Year-by-year and Save & print.
- The CSV is derived from existing annual detail selector rows.
- Engine math, optimizer behavior, drawdown behavior, saved plan schema, and output schema remain unchanged.

## Verification

Use the standard verification suite:

- `npm test`
- `npm run build`
- `node probes/probe_simulation_engine_parity.js`
- `node probes/probe_engine_bridge_parity.js`
- `./probes/run_all.sh`
- `find . -name '*.plan.json' -print`
