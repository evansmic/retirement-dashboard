Sprint S1346 closes Capacity Runtime Foundation.

Package summary:
- Added a runtime-only monthly capacity foundation selector.
- Added covered, tight, gap, and cannot-tell statuses.
- Added neutral gap options: reduce spending, work longer, downsize if realistic, and save more.
- Added review rows for later UI handoff.
- Proved fresh clean examples can use the runtime capacity selector after adaptation.
- Preserved saved clean schema, engine output schema, optimizer output boundary, funding trace boundary, and UI.

Verification:
- Focused selector and data tests: 77 passed.
- Full `npm test`: 360 passed.
- `npm run build`: passed with the existing large chunk warning.
- `node probes/probe_simulation_engine_parity.js`: 12 passed.
- `node probes/probe_engine_bridge_parity.js`: 10 passed.
- `./probes/run_all.sh`: 605 passed.
- `.plan.json` absence check: no files found.
