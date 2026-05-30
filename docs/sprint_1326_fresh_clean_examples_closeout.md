Sprint S1326 closes Fresh Clean-Schema Examples.

Package summary:
- Added four fresh clean-schema example cards and payloads.
- Added in-memory wrapped clean example files.
- Added runtime adaptation helpers for current engine flows.
- Preserved no calculated capacity, funding trace, optimizer output, or account sequencing in saved example payloads.
- Preserved the current visible example menu for a separate content/UI decision.
- Preserved local-first behavior and avoided persisted `.plan.json` fixture files.

Verification:
- Focused data tests: 130 passed.
- Full `npm test`: 353 passed.
- `npm run build`: passed with the existing large chunk warning.
- `node probes/probe_simulation_engine_parity.js`: 12 passed.
- `node probes/probe_engine_bridge_parity.js`: 10 passed.
- `./probes/run_all.sh`: 605 passed.
- `.plan.json` absence check: no files found.
