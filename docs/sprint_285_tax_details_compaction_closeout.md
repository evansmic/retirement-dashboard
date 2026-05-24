# Sprint 285: Tax Details Compaction Closeout

## Summary

Sprint 285 closes the tax Details compaction batch.

## Outcome

- Normal Details shows a compact tax-pressure summary.
- Full tax-pressure table detail is gated behind `SHOW_TAX_RESEARCH_PANELS`.
- Taxes remains the main full tax-review section.
- Engine math, optimizer behavior, drawdown behavior, saved plan schema, and output schema remain unchanged.

## Verification

Use the standard verification suite:

- `npm test`
- `npm run build`
- `node probes/probe_simulation_engine_parity.js`
- `node probes/probe_engine_bridge_parity.js`
- `./probes/run_all.sh`
- `find . -name '*.plan.json' -print`
