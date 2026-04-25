# PROJECT.md — Retirement Plan Dashboard

## Project overview

A self-contained, browser-based retirement planning dashboard for Canadian couples (Ontario tax rules, 2026). Users enter their financial picture through an intake form, and the tool produces a year-by-year projection across multiple scenarios (baseline, RRSP meltdown, 0% return, survivor, max-spend), plus Monte Carlo and sequence-of-returns stress tests, with real/nominal toggles and PDF export. Everything runs client-side; no server, no database.

## Core problem being solved

Canadian retirement planning is genuinely complex (RRSP/RRIF minimums, LIF max, CPP actuarial adjustments, OAS clawback, pension splitting, spousal RRSP attribution, Ontario surtax and Health Premium, BPA phase-out) and consumer tools tend to either oversimplify or paywall the precision. This project models the rules in full for a realistic couples-planning context, including staggered retirements, dual DB pensions, and pre-retirement working years.

## Target users

Currently a **single household** (built for personal use — see Open Questions). The primary user profile is a Canadian Ontario couple either in late-career working years or early retirement, comfortable with spreadsheet-level financial detail.

## Value proposition

- Models Canadian federal + Ontario 2026 tax law with precision competitors typically hide behind a paywall.
- Handles couples fully: pension splitting, CPP sharing, spousal-RRSP attribution, survivor rollover, staggered retirements.
- Stress-tests the plan three ways: Monte Carlo (fan chart + success rate), historical sequence-of-returns (1929 / 1973 / 2000 / 2008), and discrete scenarios.
- Runs entirely in the browser — no data ever leaves the device, no subscription, no account.

## Current product vision

A precision-grade "projection engine + scenario explorer" for a Canadian couple, with the modelling fidelity of a professional planning tool (Snap Projections, RazorPlan) but usable without training. Over time: make the intake form friendlier, extend to non-Ontario provinces, and improve the explanation layer so a non-expert can understand *why* each scenario produces its result.

## Current feature set

**Intake (`index.html`)**
- Per-spouse: DOB, retire year, salary + raises + pre-retirement contributions, DB pension, RRSP/TFSA/LIF/non-reg balances and ACB, CPP at 65/70, OAS, TFSA room.
- Household: spending by phase (go-go / slow-go / no-go), mortgage, LOC, inheritance goal, one-off expenses, principal-residence downsize.
- Assumptions: return, inflation, return SD, horizon, withdrawal order, younger-spouse RRIF election, CPP sharing, spousal-RRSP contributions, FP Canada preset selector.

**Dashboard (`retirement_dashboard.html`)**
- Five deterministic scenarios: Baseline, RRSP Meltdown, 0% Return, Survivor, Max Spend.
- Charts: income stack (salary, DB, CPP, OAS, RRIF/LIF, TFSA, non-reg, spending line), balances, tax, estate.
- KPIs: first shortfall year, portfolio depletion year, lifetime after-tax, lifetime tax, OAS clawback, estate.
- Comparison table across scenarios with probability-of-success row.
- Year-by-year detail table with milestone highlighting.
- Monte Carlo fan chart (p10/p50/p90) with success rate.
- Sequence-of-returns stress panel (historical crash overlays).
- Real/nominal toggle, print/PDF one-pager export.

**Engine capabilities**
- Pre-retirement working years with salary growth, RRSP deduction, TFSA/non-reg contribs.
- Staggered retirement (each spouse retires independently).
- Dual DB pensions (Person 1 and Person 2).
- Spousal rollover on first death (registered + non-reg with ACB preserved).
- `cfg.returnRates` array override enables MC and sequence stress with no other engine changes.
- Never-shortfall sustainable-spend solver (calibrates go-go spend down to a feasible level if the target can't be funded).

## Tech stack

- **Runtime**: two static HTML files, no build step. Opened directly from disk or served statically.
- **Languages**: vanilla JavaScript, HTML, CSS.
- **Libraries**: Chart.js (only external dependency).
- **Data passing**: `index.html` encodes the form payload as base64(URI-encoded JSON) into the URL hash; `retirement_dashboard.html` reads `window.location.hash` on load.
- **Persistence**: none — input is re-entered each session, or the hash URL can be bookmarked.
- **Test harness**: Node scripts that execute the dashboard's `<script>` contents in a `new Function()` wrapper with a stubbed DOM/window. Probes named `probe_*.js` live in the session outputs folder.

## Business model

**Not yet defined.** Today the tool is built for a single household. Possible commercial paths (labelled as suggestions):
- *Suggestion*: one-time purchase desktop app (no account, no data transfer — privacy as differentiator).
- *Suggestion*: freemium with white-label for fee-only Canadian financial planners.
- *Suggestion*: keep it free/open-source as a portfolio piece.

## Current status

Phase 5 complete. Engine verified with 38 passing checks across three probe scripts (engine-level, end-to-end integration, intake round-trip). All five deterministic scenarios return zero shortfall years. Monte Carlo and sequence-of-returns regression suite still clean (17/17).

Working files:
- `index.html` — intake form
- `retirement_dashboard.html` — engine + UI

## Known risks / blockers

- **Tax law drift.** 2026 numbers are hard-coded (BPA, OAS thresholds, tax brackets, CPP max). Every tax year will require an update pass.
- **Single-province coverage.** Ontario only — no Quebec, BC, or Alberta tax. Extending means duplicating the provincial tax calc.
- **Intake form ergonomics.** The form is long. A non-expert would stall on CPP at 65 vs 70, TFSA room, ACB. Needs a guided mode / defaults.
- **No test suite in-browser.** The `probe_*.js` harness works but isn't integrated — regressions could slip in during UI edits that don't touch the engine.
- **Client-side only.** No data recovery if the user clears their hash. "Save a scenario" is not a real feature yet.
- **Sustainability solver performance.** Meltdown scenario takes ~3.3 s for 1,000 Monte Carlo paths (vs ~0.5 s for baseline). Acceptable for MVP but would bite if paths increase.

## Open Questions

- Is this a personal tool or a product? (Shapes roadmap dramatically.)
- If product: who's the buyer — consumer, advisor, or both?
- Should we extend beyond Ontario before polishing what exists?
- Is there appetite for an "advisor mode" (multi-household view)?
