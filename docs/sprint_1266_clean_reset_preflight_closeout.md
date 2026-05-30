Sprint S1266 closed Clean Schema Reset Implementation Batch 3.

Package result:
- Production schema and loader behavior remain unchanged.
- Current v2/raw payload behavior is documented as the before-state.
- Future adapter remains test-only.
- Rollback and old-file block preflight rows pass.
- The next package would be actual schema/import wiring if explicitly approved.

Final verification:
- Focused data tests: 113 passed.
- Full `npm test`: 340 passed.
- `npm run build`: passed with the existing large chunk warning.
- `node probes/probe_simulation_engine_parity.js`: 12 passed.
- `node probes/probe_engine_bridge_parity.js`: 10 passed.
- `./probes/run_all.sh`: 595 passed, with the known local route bind failure in `probe_react_legacy_routes.js`.

No `.plan.json` files were created.
