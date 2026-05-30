Sprint S1306 closes Clean Schema Reset Implementation Batch 5.

Package summary:
- Saved plan files now write wrapped clean schema payloads.
- Production import accepts wrapped clean schema files only.
- Current editable v2 files, older preview files, raw payloads, incomplete clean files, and unsupported future files are blocked with plain copy.
- Clean files adapt into the current runtime engine shape internally.
- Downsize inputs are preserved in the clean saved payload.
- Engine output schema, optimizer output, UI overhaul, cloud/account features, and account-level sequencing remain unchanged.

Verification:
- Focused data and affected engine tests: 187 passed.
- Full `npm test`: 349 passed.
- `npm run build`: passed with the existing large chunk warning.
- `node probes/probe_simulation_engine_parity.js`: 12 passed.
- `node probes/probe_engine_bridge_parity.js`: 10 passed.
- `./probes/run_all.sh`: 605 passed.
- `.plan.json` absence check: no files found.
