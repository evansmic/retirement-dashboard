# Sprint 301: Validation Review Copy

## Summary

Sprint 301 keeps the next batch in bounded trust-cleanup mode before engine/optimizer checkpoint work.

## Outcome

- Guided-intake validation now labels non-blocking completeness items as review items instead of warnings.
- The clear state says the plan is ready to run when no blockers or review items are present.
- Step badges continue to count blockers and non-blocking review items without changing validation behavior.
- Engine math, optimizer behavior, drawdown behavior, saved plan schema, and output schema remain unchanged.

## Verification

- `npm test`
- `npm run build`
- `node probes/probe_simulation_engine_parity.js`
- `node probes/probe_engine_bridge_parity.js`
- `./probes/run_all.sh`
- `find . -name '*.plan.json' -print`
