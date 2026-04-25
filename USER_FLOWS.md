# USER_FLOWS.md

## Main user types

Currently a single user type — the **household planner**: one member of a Canadian Ontario couple (or single person) entering their own data.

Suggested future types (labelled as suggestions):
- *Suggestion*: **Fee-only financial planner** running client projections.
- *Suggestion*: **Pre-retiree researcher** who wants to stress-test "can I retire?" scenarios without touching their real data.

## Step-by-step flows

### Flow 1 — First-time household planner

1. Open `index.html` in a browser.
2. (Optional) Click FP Canada preset → fills `returnRate`, `inflation`, `returnStdDev` with the guideline-backed balanced-60 defaults.
3. Enter Person 1 section: name, DOB, retire year, balances (RRSP/TFSA/LIF/non-reg + ACB), CPP at 65/70, OAS, DB pension (optional), pre-retirement salary + raises + annual contributions (optional).
4. Enter Person 2 section (mirror of above; DB pension now supported on Person 2 too).
5. Enter household spending by phase (go-go / slow-go / no-go), mortgage, LOC, inheritance goal.
6. Enter assumptions: plan start (optional, for modelling working years), plan end, return, inflation, horizon, withdrawal order, CPP sharing, spousal RRSP contributions.
7. Click Submit. Form encodes `D` to base64(URI(JSON)) on the hash and redirects to `retirement_dashboard.html`.
8. Dashboard loads, runs five deterministic scenarios, renders charts + KPIs + comparison table + year-by-year detail.

### Flow 2 — Scenario exploration

1. From the rendered dashboard, click a scenario tab (Baseline, Meltdown, 0% Return, Survivor, Max Spend).
2. Charts, KPIs, and detail table update to show the selected scenario.
3. Comparison table remains visible for cross-scenario read.
4. Toggle Real/Nominal to view all dollar figures in today's or then-year terms.

### Flow 3 — Stress testing

1. Click "Run Monte Carlo" → 1,000 paths sampled from `Normal(returnRate, returnStdDev)`. Fan chart (p10/p50/p90) renders; success rate displayed.
2. Click "Run Stress Test" → four historical crashes (1929 / 1973 / 2000 / 2008) overlaid on the baseline. Summary table of end portfolio, Δ vs mean, shortfall years, first shortfall.
3. Click "Probability of Success" in the comparison row → runs 250 paths × 5 scenarios (~2.5 s) and populates a POS row in the comparison table.

### Flow 4 — Export / share

1. Click Print/PDF button → `printReport()` expands the detail table and triggers the browser print dialog; user saves as PDF.
2. Alternatively copy the current URL (hash contains the full payload) to share the plan with a spouse or planner.

### Flow 5 — Edit and re-run

1. Hit back in the browser or re-open `index.html`.
2. Re-enter values (no persistence today — see friction).
3. Re-submit.

## Friction points

- **No save/load.** Closing the tab loses the input unless the user bookmarked the hash URL. Hostile to iteration.
- **Long intake form.** ~60+ fields. First-time users hit decision fatigue on CPP 65 vs 70, TFSA room, ACB basis, DB pension start year.
- **Silent defaults.** Missing required fields (e.g. DOB) silently default to 0, producing nonsense projections rather than a clear "please fill this in".
- **Jargon without inline help.** BPA, OAS clawback, spousal-RRSP attribution, LIF max — all technical terms appear with no tooltips.
- **Single-flow visual.** There's no "intake → review → submit" step. Click submit and you're already in the dashboard; easy to miss a typo.
- **Monte Carlo is opt-in.** A first-time user may not know to click Run MC, and might assume the deterministic projection is the whole plan.
- **No scenario naming.** Saved hash URLs don't carry a user-chosen label.
- **Mobile unusable.** Layout is desktop-first — charts + tables don't reflow.
- **Print output is dense.** PDF is one long page; not reviewer-friendly.

## Missing flows we still need to design

- **Guided intake.** A walk-through that asks one question at a time, with defaults and tooltips. Ideal for first-time users.
- **Comparison of two saved plans.** e.g. "retire at 62 vs 65" side-by-side.
- **Scenario authoring.** Today scenarios are hard-coded in `SCENARIOS`. A user should be able to define "what if we move to BC and sell the house in 2035?" without editing JS.
- **Explanation drilldown.** Click a year in the detail table → modal that explains every line item (e.g. "Why is 2034's tax $28K?").
- **Error surfacing.** Validation bar after submit that lists missing or likely-wrong inputs.
- **Plan persistence.** Save locally (localStorage is fine; no account needed) with a named list. Export/import `.plan.json`.
- **Onboarding.** First-open state should introduce the tool, offer sample data, offer the preset defaults, offer the guided flow.

## Open Questions

- Is the primary user entering their own data, or is someone else (adult child, planner) entering it on their behalf?
- Do we want inline education (teach-while-you-plan) or defer to a "Learn" section?
- Where should scenario authoring live — in the intake form, the dashboard, or a separate builder?
