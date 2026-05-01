# USER_FLOWS.md

## Main user types

Currently a single user type — the **household planner**: one member of a Canadian Ontario couple (or single person) entering their own data.

Suggested future types (labelled as suggestions):
- *Suggestion*: **Fee-only financial planner** running client projections.
- *Suggestion*: **Pre-retiree researcher** who wants to stress-test "can I retire?" scenarios without touching their real data.

## Step-by-step flows

### Flow 1 — First-time household planner

1. Open `index.html` in a browser.
2. Name the local plan and optionally load an existing `.plan.json`.
3. Use the section navigation to move through Person 1, Person 2, joint assets, spending, and assumptions.
4. Enter Person 1 section: name, DOB, retire year, balances (RRSP/TFSA/LIF/non-reg + ACB), CPP at 65/70, OAS, DB pension (optional), pre-retirement salary + raises + annual contributions (optional).
5. Enter Person 2 section if applicable. Leave it blank for a single-person plan.
6. Enter household spending by phase (go-go / slow-go / no-go), mortgage, LOC, inheritance goal.
7. Enter assumptions: plan start (optional, for modelling working years), plan end, return, inflation, horizon, withdrawal order, CPP sharing, spousal RRSP contributions.
8. Save a local `.plan.json` if desired.
9. Click Generate Dashboard. Form validates critical blanks, encodes `D` to base64(URI(JSON)) on the hash, and redirects to `retirement_dashboard.html`.
10. Dashboard loads, computes the recommended household plan, renders the plan summary, key charts, risk summary, and year-by-year detail.

### Flow 2 — Recommended Plan Review

1. Review the recommended CPP/OAS timing, withdrawal order, spending level, and estate trade-off.
2. Read the short "why this plan" explanation.
3. Open year-by-year detail only when needed to audit tax, benefits, withdrawals, and balances.
4. Toggle Real/Nominal to view all dollar figures in today's or then-year terms.

### Flow 3 — Stress Testing

1. The app runs a basic stress summary against the recommended plan.
2. Monte Carlo reports full-spending-funded rate and severity metrics, not a binary success/failure verdict.
3. Historical crash replays show whether lower-return paths create temporary shortfalls, permanent shortfalls, or mostly estate reduction.

### Flow 4 — Advanced Scenario Exploration

1. Plus/Pro user opens scenario explorer.
2. Compare lower-than-expected returns, early death of one spouse, estate targets, different retirement dates, CPP/OAS timing alternatives, or withdrawal strategies.
3. Charts, KPIs, and detail table update to show the selected alternative.
4. Comparison table remains available for cross-scenario read, but as an advanced diagnostic view rather than the default consumer result.

### Flow 5 — Export / share

1. Click Print/PDF button → `printReport()` expands the detail table and triggers the browser print dialog; user saves as PDF.
2. Alternatively copy the current URL (hash contains the full payload) to share the plan with a spouse or planner.

### Flow 6 — Edit and re-run

1. Click Edit plan from a hash-loaded dashboard, or reopen `index.html` and load a local `.plan.json`.
2. Revise the form. Section status pills highlight empty or needs-review areas.
3. Save a new local file if desired.
4. Re-submit.

## Friction points

- **Long intake form.** ~60+ fields. First-time users hit decision fatigue on CPP 65 vs 70, TFSA room, ACB basis, DB pension start year.
- **Jargon without inline help.** BPA, OAS clawback, spousal-RRSP attribution, LIF max — all technical terms appear with no tooltips.
- **Single-flow visual.** There's no "intake → review → submit" step. Click submit and you're already in the dashboard; easy to miss a typo.
- **No full optimizer yet.** The first dashboard view is now framed as the recommended plan, but the engine is not yet searching CPP/OAS timing, withdrawal order, guardrails, and estate trade-offs.
- **Only one named browser draft.** Local `.plan.json` files are durable, but there is not yet a multi-plan local library.
- **Mobile unusable.** Layout is desktop-first — charts + tables don't reflow.
- **Print output is dense.** PDF is one long page; not reviewer-friendly.

## Missing flows we still need to design

- **Guided intake v2.** A deeper walk-through that asks one question at a time, with defaults and tooltips. Ideal for first-time users.
- **Comparison of two saved plans.** e.g. "retire at 62 vs 65" side-by-side.
- **Optimization-first result.** Engine chooses CPP/OAS timing and withdrawal strategy, then presents one recommended plan instead of five equal scenario tabs.
- **Scenario authoring.** Advanced/paid users should be able to define "what if we move to BC and sell the house in 2035?" without editing JS.
- **Explanation drilldown.** Click a year in the detail table → modal that explains every line item (e.g. "Why is 2034's tax $28K?").
- **Local plan library.** Multiple named plans in browser storage, with local files remaining the durable source of truth.
- **Onboarding.** First-open state should introduce the tool, offer sample data, offer the preset defaults, offer the guided flow.

## Open Questions

- Is the primary user entering their own data, or is someone else (adult child, planner) entering it on their behalf?
- Do we want inline education (teach-while-you-plan) or defer to a "Learn" section?
- Which scenario controls belong in free/core versus Plus/Pro?
