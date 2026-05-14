# Sprint 20 React Results Readiness And Save Handoff Polish

Sprint 20 tightens the end-of-results workflow now that the main React Results tabs have deeper preview coverage. It adds a runtime-only readiness layer so users can understand whether a plan is blocked, still needs review, or is ready to save locally and inspect in the stable dashboard.

## Goal

Help users answer:

- What still blocks this preview?
- Which review items remain before relying on it?
- Is the local `.plan.json` save available?
- Where does the stable dashboard still own complete audit, report, and print/PDF review?

## Scope

- Add runtime-only readiness summary and row selectors.
- Render a compact readiness panel in Overview.
- Render the full readiness handoff in Export/Save.
- Make save readiness explicit while keeping stable dashboard inspection visible.
- Reuse the recommended-path checklist, validation state, and existing React detail tabs.

## Non-Scope

- No persisted readiness output.
- No schema v3 migration.
- No optimizer changes.
- No new engine rules.
- No print/PDF migration.
- No account, cloud sync, advisor, or AI scope.

## Guardrails

- Runtime dashboard schema remains v2.
- `.plan.json` files do not include readiness, recommendation, checklist, or React tab state.
- Copy remains review-oriented, not advice.
- Stable dashboard remains the full audit, reporting, legacy chart, print, and PDF fallback.

## Verification

- `npm test`
- `npm run build`
- `node probes/probe_simulation_engine_parity.js && node probes/probe_engine_bridge_parity.js`
- `./probes/run_all.sh`
- Confirm no `.plan.json` files were created in the repo.
