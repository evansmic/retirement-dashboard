# Sprint 17 React Tax Detail Parity

Sprint 17 deepens the React Taxes tab from summary metrics into a plain-language tax story. It explains why tax changes over time and which tax items deserve review, while keeping the stable dashboard as the complete tax schedule and reporting fallback.

## Goal

Help users understand:

- When taxes peak.
- Whether OAS clawback appears.
- Whether registered withdrawals are driving taxable income.
- Whether lower-tax planning windows exist.
- What to review next before treating the tax path as settled.

## Scope

- Add runtime-only tax story summary selectors.
- Add tax review rows for OAS clawback, registered withdrawals, peak tax, and lower-tax planning windows.
- Render a clearer Taxes tab with story panel, review rows, metrics, and annual table.
- Keep full tax schedules, print/PDF, and legacy audit views in the stable dashboard.

## Non-Scope

- No new tax engine.
- No multi-province support.
- No optimizer.
- No tax advice wording.
- No schema v3.
- No persisted tax output.
- No print/PDF migration.

## Guardrails

- Runtime dashboard schema remains v2.
- Tax story output is derived from existing `SimulationResult.years`.
- No `.plan.json` file includes tax story or UI state.
- Copy stays review-oriented and avoids advice language.
- Stable dashboard remains the full tax audit/report surface.

## Verification

- `npx tsc --noEmit --pretty false`
- `npm test`
- `npm run build`
- `npm run build:vercel-preview`
- `node probes/probe_react_legacy_routes.js`
- `./probes/run_all.sh`
- Confirm no `.plan.json` files were created in the repo.
