Sprint S1246 closed Clean Schema Reset Implementation Batch 2.

Package result:
- Test-only adapter helpers are available.
- Validation is wired into adapter decisions.
- Blocked outcomes stay graceful and local-first.
- No `.plan.json` files are created.
- Saved plan schema, engine output schema, production import behavior, UI, and current examples remain unchanged.

Final verification:
- Focused future-format and import-policy tests: 103 passed.
- Full `npm test`: 334 passed.
- `npm run build`: passed with the existing large chunk warning.
- `node probes/probe_simulation_engine_parity.js`: 12 passed.
- `node probes/probe_engine_bridge_parity.js`: 10 passed.
- `./probes/run_all.sh`: 595 passed, with the known local route bind failure in `probe_react_legacy_routes.js`.

No `.plan.json` files were created.
