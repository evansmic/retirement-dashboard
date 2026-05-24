# Sprint 290: Recommended Plan Copy Closeout

## Summary

Sprint 290 closes the recommended-plan copy discipline batch.

## Outcome

- Visible plan-selection copy is framed as review evidence.
- Advice-like suggested/recommended labels are removed from the active React source.
- Engine math, optimizer behavior, drawdown behavior, saved plan schema, and output schema remain unchanged.

## Verification

Use the standard verification suite:

- `npm test`
- `npm run build`
- `node probes/probe_simulation_engine_parity.js`
- `node probes/probe_engine_bridge_parity.js`
- `./probes/run_all.sh`
- `find . -name '*.plan.json' -print`
