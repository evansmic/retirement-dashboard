Sprint S1206 closed the schema reset decision gate package.

Package result:
- Decision evidence is testable.
- Implementation gates are explicit.
- Import decisions are pinned for review.
- The reset is not marked ready to wire.
- Saved plan schema, engine output schema, import behavior, UI, and current examples remain unchanged.

Final verification:
- Focused future-format tests: 85 passed.
- Full `npm test`: 318 passed.
- `npm run build`: passed with the existing large chunk warning.
- `node probes/probe_simulation_engine_parity.js`: 12 passed.
- `node probes/probe_engine_bridge_parity.js`: 10 passed.
- `./probes/run_all.sh`: 595 passed, with the known local route bind failure in `probe_react_legacy_routes.js`.

No `.plan.json` files were created.
