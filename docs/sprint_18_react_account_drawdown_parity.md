# Sprint 18 React Account Detail / Drawdown Parity

Sprint 18 deepens the React Accounts tab from balance summaries into a plain-language account drawdown story. It explains which buckets are being used, when drawdowns begin, and whether the ending portfolio deserves review, while keeping the stable dashboard as the complete account audit and reporting fallback.

## Goal

Help users understand:

- How the portfolio changes from the first projection year to the final year.
- Which account buckets are funding the plan.
- When registered, TFSA, non-registered, and cash wedge withdrawals begin.
- Whether the portfolio depletes or the end balance deserves review.
- Where to look next before treating the drawdown path as settled.

## Scope

- Add runtime-only account drawdown story selectors.
- Add account review rows for registered drawdown, TFSA drawdown, non-registered drawdown, cash wedge use, and terminal portfolio.
- Render a clearer Accounts tab with story panel, review rows, chart, summary tables, and full-year balance rows.
- Keep full account schedules, legacy charts, print/PDF, and audit views in the stable dashboard.

## Non-Scope

- No new drawdown engine.
- No optimizer.
- No account rebalancing model.
- No CSV/PDF export.
- No persisted table state.
- No schema v3.
- No account, cloud sync, advisor, or AI scope.

## Guardrails

- Runtime dashboard schema remains v2.
- Account story output is derived from existing `SimulationResult.years`.
- No `.plan.json` file includes account story or UI state.
- Copy stays review-oriented and avoids advice language.
- Stable dashboard remains the full account audit/report surface.

## Verification

- `npx tsc --noEmit --pretty false`
- `npm test`
- `npm run build`
- `npm run build:vercel-preview`
- `node probes/probe_react_legacy_routes.js`
- `./probes/run_all.sh`
- Confirm no `.plan.json` files were created in the repo.
