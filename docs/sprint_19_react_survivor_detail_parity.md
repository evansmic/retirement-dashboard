# Sprint 19 React Survivor Detail Parity

Sprint 19 makes household resilience a first-class React Results tab. It turns the survivor preview from a compact Overview slice into a bounded review surface for two-person plans while keeping the stable dashboard as the complete survivor audit and reporting fallback.

## Goal

Help users understand:

- Whether a survivor scenario is applicable and ready to review.
- Which survivor year is being compared.
- How baseline and survivor outcomes differ for funding, portfolio, and tax.
- Where to inspect the next detail area before relying on a two-person plan.

## Scope

- Add `Household Resilience` as a dedicated React Results tab.
- Add runtime-only survivor story and review-row selectors.
- Reuse the existing survivor rerun boundary: `runSimulation(plan, { p1Dies })`.
- Render story metrics, review rows, and stable-dashboard fallback copy in React.
- Keep compact survivor snapshots in Overview and Stress Tests.

## Non-Scope

- No new survivor modelling rules.
- No optimizer changes.
- No persisted survivor output or UI state.
- No schema v3 output migration.
- No print/PDF or legacy survivor audit migration.
- No account, cloud sync, advisor, or AI scope.

## Guardrails

- Runtime dashboard schema remains v2.
- Survivor story output is derived from existing baseline and survivor simulation rows.
- `.plan.json` files do not include survivor story, review rows, or React tab state.
- Copy remains review-oriented, not advice.
- Stable dashboard remains the full survivor audit, legacy chart, print, and PDF fallback.

## Verification

- `npm test`
- `npm run build`
- `node probes/probe_simulation_engine_parity.js && node probes/probe_engine_bridge_parity.js`
- `./probes/run_all.sh`
- Confirm no `.plan.json` files were created in the repo.
