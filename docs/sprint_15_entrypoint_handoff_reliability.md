# Sprint 15 Entry Point And Handoff Reliability

Sprint 15 makes the local-first multi-surface workflow explicit and testable. The planner currently has a stable static intake, a stable dashboard, and a React migration preview. This sprint prevents those entry points from silently routing to the wrong surface.

## Entry Point Contract

| Surface | File / Route | Purpose |
|---|---|---|
| React preview | `/` from Vite or Vercel preview | Guided intake and migrated React Results workspace |
| Stable intake | `index.html`, `/stable-intake.html`, or `/stable-intake` | Legacy static intake and file-mode fallback |
| Stable dashboard | `retirement_dashboard.html`, `/retirement_dashboard.html`, `/retirement_dashboard`, or `/dashboard` | Legacy full dashboard, charts, report-style views, and audit fallback |
| Engine helpers | `/engine/...` | Stable dashboard helper scripts |

## Scope

- Centralize React stable-surface URL helpers.
- Keep stable dashboard handoff URLs extension-explicit.
- Serve stable dashboard, stable intake, and engine helpers from the Vite dev/preview server.
- Add a route probe that fails if the stable dashboard route returns the React shell.
- Stage React preview builds for Vercel while preserving stable dashboard and stable intake handoffs.

## Vercel Preview Shape

Vercel preview deployments now build the React app into `dist/react-app` and then copy:

- `retirement_dashboard.html`
- root `index.html` as `stable-intake.html`
- `engine/`

This lets a Vercel preview open the React app at `/` while still supporting `/retirement_dashboard.html`, `/dashboard`, `/stable-intake.html`, and `/engine/...`.

## Non-Scope

- No schema v3.
- No cloud sync.
- No accounts.
- No advisor workspace.
- No optimizer.
- No report/PDF migration.
- No full stable-dashboard rewrite.
- No persisted React result state.

## Verification

- `npx tsc --noEmit --pretty false`
- `npm test`
- `npm run build`
- `npm run build:vercel-preview`
- `node probes/probe_react_legacy_routes.js`
- `node probes/probe_simulation_engine_parity.js && node probes/probe_engine_bridge_parity.js`
- `./probes/run_all.sh`
- Confirm no `.plan.json` files were created in the repo.
