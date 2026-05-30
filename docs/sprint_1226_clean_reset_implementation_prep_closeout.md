Sprint S1226 closed Clean Schema Reset Implementation Batch 1.

Package result:
- Field contracts are drafted.
- Import adapter contracts are drafted.
- Fixture prep remains in-memory.
- V1 feedback is captured as trust gates.
- Older-file planned block copy is softer.
- Saved plan schema, engine output schema, production import behavior, UI, and current examples remain unchanged.

Final verification:
- Focused future-format and import-policy tests: 95 passed.
- Full `npm test`: 326 passed.
- `npm run build`: passed with the existing large chunk warning.
- `node probes/probe_simulation_engine_parity.js`: 12 passed.
- `node probes/probe_engine_bridge_parity.js`: 10 passed.
- `./probes/run_all.sh`: 595 passed, with the known local route bind failure in `probe_react_legacy_routes.js`.

No `.plan.json` files were created.
