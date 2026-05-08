# Sprint 13 React Results Chart Parity

Sprint 13 adds a bounded chart layer to the React Results workspace. It reduces another stable-dashboard dependency by showing the most useful projection visuals beside the Annual Detail and Accounts tables while preserving local-first, runtime-only, schema v2 boundaries.

## Goal

Show chart-ready result context in React without turning the workspace into a reporting/export tool:

- Portfolio over time.
- Spending, tax, and shortfall over time.
- Account bucket balances over time.

Charts are derived from existing simulation rows and existing account bucket selectors. They do not rerun the simulation, write UI state, or change the persisted `.plan.json` contract.

## Scope

- Add runtime-only chart series selectors for portfolio, spending/tax/shortfall, and account bucket balances.
- Render Annual Detail charts above the full year-by-year table.
- Render an Accounts balance chart above the account summary and balance tables.
- Keep stable-dashboard handoff copy for print/PDF, legacy audit views, and any richer chart surfaces.
- Add selector and smoke coverage for chart series length and bucket consistency.

## Non-Scope

- Chart export or download.
- PDF/report generation.
- Custom chart builder or data-grid tooling.
- Persisted chart state.
- Optimizer changes.
- Schema v3 output migration.
- Cloud sync, accounts, advisor workspace, AI reports, or multi-province support.

## Guardrails

- Runtime dashboard schema remains v2.
- Chart output is runtime-only and never written into `.plan.json`.
- Chart selectors derive from existing `SimulationResult.years`; engine output is unchanged.
- Stable dashboard remains available for complete reporting, print/PDF, and legacy audit surfaces.
- React charts stay simple and readable beside the parity tables.

## Verification

- `npm test`
- `npm run build`
- `node probes/probe_simulation_engine_parity.js && node probes/probe_engine_bridge_parity.js`
- `./probes/run_all.sh`
- Confirm no `.plan.json` files were created in the repo.
