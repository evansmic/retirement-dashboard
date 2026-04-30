# PROJECT.md — Retirement Plan Dashboard

## Project overview

A self-contained, browser-based retirement planning dashboard for Canadian households (Ontario tax rules, 2026). Users enter their financial picture through an intake form, and the tool produces a year-by-year projection across multiple scenarios (baseline, RRSP meltdown, 0% return, survivor, max-spend), plus Monte Carlo and sequence-of-returns stress tests, with real/nominal toggles and PDF export. Everything runs client-side; no server, no database.

## Core problem being solved

Canadian retirement planning is genuinely complex (RRSP/RRIF minimums, LIF max, CPP actuarial adjustments, OAS clawback, pension splitting, spousal RRSP attribution, Ontario surtax and Health Premium, BPA phase-out) and consumer tools tend to either oversimplify or paywall the precision. This project models the rules in full for a realistic couples-planning context, including staggered retirements, dual DB pensions, and pre-retirement working years.

## Target users

The product direction is **consumer-first**. The primary user profile is a Canadian household, either single or couple, within roughly 5-15 years of retirement or already early-retired, comfortable enough with spreadsheet-level financial detail but looking for clearer guidance than a spreadsheet can provide.

Secondary users include fee-only planners, adult children helping parents, and financially curious users comparing strategies before meeting an advisor. Advisor workflows are downstream of the consumer product, not the starting point.

## Value proposition

- Models Canadian federal + Ontario 2026 tax law with precision competitors typically hide behind a paywall.
- Handles couples fully: pension splitting, CPP sharing, spousal-RRSP attribution, survivor rollover, staggered retirements.
- Stress-tests the plan three ways: Monte Carlo (fan chart + full-spending-funded rate), historical sequence-of-returns (1929 / 1973 / 2000 / 2008), and discrete scenarios.
- Runs entirely in the browser — no data ever leaves the device, and no account is required for core planning.

## Current product vision

A precision-grade "projection engine + scenario explorer" for Canadian households, with the modelling fidelity of a professional planning tool (Snap Projections, RazorPlan) but usable without training. Over time: make the intake form friendlier, extend to non-Ontario provinces, and improve the explanation layer so a non-expert can understand *why* each scenario produces its result.

The longer-term ambition is a local-first Canadian retirement planner similar in ambition to ProjectionLab: scenario-driven, privacy-preserving, consumer-friendly, and deep on Canadian tax, benefits, couples, and survivor planning.

## Current feature set

**Intake (`index.html`)**
- Per-spouse: DOB, retire year, salary + raises + pre-retirement contributions, DB pension, RRSP/TFSA/LIF/non-reg balances and ACB, CPP at 65/70, OAS, TFSA room.
- Household: spending by phase (go-go / slow-go / no-go), mortgage, LOC, inheritance goal, one-off expenses, principal-residence downsize.
- Assumptions: return, inflation, return SD, horizon, withdrawal order, younger-spouse RRIF election, CPP sharing, spousal-RRSP contributions, FP Canada preset selector.

**Dashboard (`retirement_dashboard.html`)**
- Five deterministic scenarios: Baseline, RRSP Meltdown, 0% Return, Survivor, Max Spend.
- Charts: income stack (salary, DB, CPP, OAS, RRIF/LIF, TFSA, non-reg, spending line), balances, tax, estate.
- KPIs: first shortfall year, portfolio depletion year, lifetime after-tax, lifetime tax, OAS clawback, estate.
- Comparison table across scenarios with stress/funding metric row.
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

Consumer-first and local-first.

Preferred path:
- Free public planner for core local planning and validation-visible outputs.
- Optional one-time purchase or local license unlock for advanced consumer features.
- Optional accounts only for encrypted sync, license recovery, sharing, or advisor collaboration.
- Advisor/Pro mode later, gated on consumer workflow quality and real planner demand.

Monetization should not require accounts by default, and plan data should not need to leave the user's device for the product to be valuable or paid.

## Current status

Phase 5 complete, followed by public-release foundation and UX-polish sprints. The current canonical probe suite is documented in `probes/README.md`.

Next planned work is **Sprint 0 — trust and engine readiness**: tax accuracy, Monte Carlo/stress-test language, validation exports, engine extraction boundaries, schema-v3 output contract, and local-first monetization boundaries before a larger UI rebuild.

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

- Which advanced features belong in a paid local-first Plus tier versus the free public planner?
- What is the simplest local license model that does not require accounts or plan-data upload?
- Which tax/benefit validation gates must pass before broader public launch?
- Which province follows Ontario after the engine boundary is clean?
