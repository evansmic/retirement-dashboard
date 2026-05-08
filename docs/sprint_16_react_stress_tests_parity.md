# Sprint 16 React Stress Tests Parity

Sprint 16 deepens the React Stress Tests tab from basic baseline indicators into an explainable stress review surface. It supports the recommended-path story without replacing the stable dashboard's full Monte Carlo, historical sequence stress, print/PDF, or legacy chart surfaces.

## Goal

Help users answer:

- What can go wrong?
- When does it first show up?
- How severe is it?
- Which React detail area should I review next?

## Scope

- Add runtime-only stress summary selectors.
- Add stress rows for spending shortfall, portfolio depletion, portfolio cushion, tax pressure, and source reconciliation.
- Render a clearer React Stress Tests panel with summary, evidence rows, review actions, and existing baseline indicators.
- Keep stable dashboard handoff explicit for full stress tooling and reporting.

## Non-Scope

- No Monte Carlo migration.
- No historical sequence stress migration.
- No optimizer.
- No schema v3.
- No persisted stress output.
- No account/cloud/advisor/AI/multi-province scope.
- No print/PDF migration.

## Guardrails

- Runtime dashboard schema remains v2.
- Stress output is derived from existing `SimulationResult.years`.
- No `.plan.json` file includes stress summary or UI state.
- The language remains review-oriented, not advice.
- Stable dashboard remains the full stress-test fallback.

## Verification

- `npx tsc --noEmit --pretty false`
- `npm test`
- `npm run build`
- `npm run build:vercel-preview`
- `node probes/probe_react_legacy_routes.js`
- `./probes/run_all.sh`
- Confirm no `.plan.json` files were created in the repo.
