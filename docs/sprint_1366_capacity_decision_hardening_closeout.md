Sprint S1366 closes Capacity Decision Layer Hardening.

Package summary:
- Added a runtime-only monthly capacity decision layer.
- Added decision rows for floor coverage, shortfall timing, survivor/estate caveats, and option gating.
- Hardened gap options so practical lifestyle/work/downsize/save comparisons appear only when the floor is not covered.
- Proved fresh clean examples produce expected capacity decision statuses.
- Left UI unchanged.
- Preserved saved schema, engine output schema, optimizer output, funding trace, and annual account sequencing boundaries.

Verification:
- Focused selector and data tests: 81 passed.
- Full `npm test`: 364 passed.
- `npm run build`: passed with the existing large chunk warning.
- `node probes/probe_simulation_engine_parity.js`: 12 passed.
- `node probes/probe_engine_bridge_parity.js`: 10 passed.
- `./probes/run_all.sh`: 605 passed.
- `.plan.json` absence check: no files found.
