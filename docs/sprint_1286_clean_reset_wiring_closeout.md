Sprint S1286 closes Clean Schema Reset Implementation Batch 4.

Package summary:
- Wrapped clean reset files can be opened by the production validator.
- Current wrapped v2 plan files remain accepted.
- Raw, older preview, incomplete clean reset, and unsupported future files are blocked with plain copy.
- Clean imports map into ordinary current runtime v2 plans.
- Save/export still writes the current editable v2 plan file.
- Engine output schema, UI, current examples, and optimizer outputs remain unchanged.

Verification:
- Focused data tests: 121 passed.
- Full `npm test`: 348 passed.
- `npm run build`: passed with the existing large chunk warning.
- `node probes/probe_simulation_engine_parity.js`: 12 passed.
- `node probes/probe_engine_bridge_parity.js`: 10 passed.
- `./probes/run_all.sh`: 595 passed, with the known local route bind failure in `probe_react_legacy_routes.js`.
- `.plan.json` absence check: no files found.
