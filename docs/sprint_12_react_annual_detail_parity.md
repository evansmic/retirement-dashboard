# Sprint 12 React Annual Detail Parity

Sprint 12 adds a first-class Annual Detail tab to the React Results workspace. It reduces stable-dashboard dependency for year-by-year audit rows while preserving local-first, runtime-only, schema v2 boundaries.

## Goal

Show the full annual projection in React with simple controls:

- Summary
- Income
- Withdrawals
- Tax
- Balances

The panel shows all available years and keeps charts, print/PDF, and legacy audit surfaces in the stable dashboard.

## Scope

- Add `Annual Detail` to the Results navigation after Overview.
- Add runtime-only annual detail selectors derived from existing simulation rows.
- Use the same reconciliation helpers as Cash Flow so funding/tax/spending values agree.
- Render all years in a scrollable table with sticky headers and simple view controls.

## Non-Scope

- Full optimizer
- Schema v3
- Persisted annual detail output
- CSV/PDF export
- Custom column chooser
- Cloud sync
- Accounts
- Advisor workspace
- AI reports
- Multi-province support

## Guardrails

- Runtime dashboard schema remains v2.
- `.plan.json` files do not include annual detail output or UI state.
- Stable dashboard remains available for charts, print/PDF, and legacy audit views.
- The table is a readable parity slice, not a full spreadsheet tool.

## Verification

- `npm test`
- `npm run build`
- `node probes/probe_simulation_engine_parity.js && node probes/probe_engine_bridge_parity.js`
- `./probes/run_all.sh`
- Confirm no `.plan.json` files were created in the repo.
