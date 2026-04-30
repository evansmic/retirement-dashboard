# TASKS.md

The original publishable-code plan came out of the 2026-04-25 decision session. The 2026-04-30 product reset moves the next work back to trust and engine readiness before any broader UI rebuild. See `PRODUCT_VISION.md` and `DECISIONS.md` for the reasoning.

## Sprint 0 — Trust and engine readiness

**Status:** Planned next. This sprint supersedes the old "Sprint 3 next" ordering.

Goal: make the planner credible, auditable, and ready for a consumer-first local-first product before investing in a larger app shell.

### Tax accuracy

- [ ] **S0-01 — Pension-income-credit eligibility audit.** Fix or prove the current `hasPension` path so ordinary RRSP withdrawals do not receive pension-income credits before they qualify. Add tests for DB pension, RRIF, LIF, ordinary RRSP, and mixed-income cases.
- [ ] **S0-02 — Tax fixture pack for ages 64-72.** Add focused fixtures around CPP/OAS starts, RRIF conversion, OAS clawback, age credit, pension splitting, Ontario surtax, and Health Premium.
- [ ] **S0-03 — Tax methodology note.** Document the 2026 federal/Ontario constants, known simplifications, and annual update checklist in one place linked from validation/reporting.

### Risk language and stress tests

- [ ] **S0-04 — Rename/qualify success metrics.** Replace bare "probability of success" language with a clearer measure such as "full spending funded in X% of paths" and explain what does not count as failure.
- [ ] **S0-05 — Add stress severity metrics.** Report first shortfall year, max shortfall, total shortfall, depletion year, core-spending coverage, and ending-estate range for Monte Carlo and historical stress tests.
- [ ] **S0-06 — Rewrite risk interpretation copy.** Remove advice-like verdicts and distinguish deterministic projection, random-return simulation, and historical sequence replay.

### Validation exports

- [ ] **S0-07 — Expand baseline export columns.** Include per-year account balances, withdrawals by account type, taxable income, tax, OAS clawback, CPP/OAS/DB income, real/nominal mode, and assumption metadata.
- [ ] **S0-08 — Add public-comparator fixture.** Create a deliberately simple single-person case with flat spending, no non-reg complexity, no tax optimization, and ordinary benefit timing.
- [ ] **S0-09 — Re-run official/public validation.** Retry the Government of Canada calculator manually, refresh the free/public comparison note, and keep paid-tool benchmarks out of the critical path until public baselines are stable.

### Engine readiness

- [ ] **S0-10 — Engine boundary map.** Mark which functions in `retirement_dashboard.html` are pure engine, UI rendering, persistence/hash loading, charting, and copy.
- [ ] **S0-11 — Extract tax/benefit helpers first.** Move the safest pure helpers into an engine module with regression coverage while keeping the current dashboard working.
- [ ] **S0-12 — Draft schema v3 output contract.** Define the minimum plan, scenario, person, account, income, expense, event, assumption, and result shapes the next UI can rely on.

### Local-first commercial readiness

- [ ] **S0-13 — Local monetization sketch.** Define free vs Plus vs Pro/advisor capabilities without requiring accounts by default.
- [ ] **S0-14 — Account boundary decision.** Document that accounts are optional for sync, license recovery, sharing, or advisor collaboration only; core planning, local save/load, and import/export remain accountless.
- [ ] **S0-15 — License/privacy threat model.** Identify what a local license check may store, what it must never upload, and how users can continue using local plan files.

## Sprint 1 — Foundation (publishable code)

The pass that takes the codebase from "private project" to "ready to be public." Order matters: schema versioning lands before the rename so the rename can use the migration system.

**Progress:** 8/8 complete — Sprint 1 done (2026-04-27).

1. ~~**#41** — Add MIT LICENSE~~ ✅ *Done 2026-04-26.* Standard MIT text at `/LICENSE`; copyright Michael Evans 2026.
2. ~~**#42** — Add "not financial advice" disclaimer (README + dashboard footer)~~ ✅ *Done 2026-04-26.* New `Disclaimer` section near the top of the README; `<footer class="disclaimer">` rendered above `</body>` in `retirement_dashboard.html`, with a print-stylesheet rule so it appears on the PDF export.
3. ~~**#46** — Add `D.schemaVersion = 1` + `migrate(D)` scaffold~~ ✅ *Done 2026-04-26.* Stamped on payload at encode; `migrate(D)` + `MIGRATIONS` registry in dashboard; legacy (no-version) hashes lifted to v1; future-version payloads warned and loaded as-is. New `probe_schema_migrate.js` (12 checks) joins the canonical suite (now 67/67).
4. ~~**#47 + #48 + #49** — Rename `frank`/`moon` → `p1`/`p2`, clear placeholders, add v1→v2 migration~~ ✅ *Done 2026-04-26.* Engine, intake form, and probes all use `p1`/`p2`. `assumptions.frankDiesInSurvivor` → `assumptions.p1DiesInSurvivor`; intake form ID `a_frankDies` → `a_p1Dies`. Default placeholder names cleared (`Alex`/`Sam` → blank, with `Person 1`/`Person 2` placeholders on the inputs). `MIGRATIONS[1]` lifts legacy v1 (or pre-versioning) payloads forward — confirmed with a new end-to-end test that loads a real legacy hash and asserts the engine receives `p1`/`p2`. `SCHEMA_VERSION = 2`. Probe count: **74/74** (probe_schema_migrate grew 12→19 to cover the rename).
5. ~~**#58** — Replace auto-populated Alex/Sam data with blank form + example presets~~ ✅ *Done 2026-04-27.* Five Canadian-archetype presets ship in the dashboard's `PRESETS` registry, deep-linked via `?example=<slug>`: `diy-couple`, `db-pension-couple`, `single-late-career`, `retired-traditional`, `fire-couple`. Headline figures sourced from FP Canada PAG 2026, Service Canada CPP/OAS Apr–Jun 2026, HOOPP / OTPP plan formulas, StatCan retirement income data. With no hash and no slug, the dashboard renders a landing card listing every preset (linking to `?example=…`) plus a CTA to `index.html` — the old hard-coded "Person 1 / Person 2" sample plan is gone. **`index.html` is the single intake-form file** — the stale companion `retirement_intake_form.html` was deleted, and `index.html` now carries the same preset chooser as a banner above the form so first-time visitors can preview an example plan before filling in their own numbers. The intake form's bespoke prefill was stripped: 39 personal/financial `value="…"` attributes cleared (dob, balances, CPP/OAS draws, mortgage, spending phases, survivor-trigger year). Structural defaults retained — TFSA annual max $7000, OAS $742.31/mo, db_index 0.02, mortgage rate 5.5%, go-go/slow-go/no-go phase boundaries (75/85), and all macro assumptions. New `probe_presets.js` (44 checks) joins the canonical suite (now **119/119**); `probe_phase5.js` and `probe_phase4_final.js` were rebased onto explicit fixtures so they no longer rely on whatever `getDefaultD()` happens to return.
6. ~~**#56** — Add JSDoc `@typedef` block for `D`~~ ✅ *Done 2026-04-27.* Self-contained `@typedef` block at the top of the CLIENT DATA section in `retirement_dashboard.html` documents the v2 plan payload — `D`, `Person`, `Spending`, `Mortgage`, `Loc`, `CashWedge`, `Downsize`, `OneOff`, `SpousalRrsp`, and `Assumptions`. Money/rate conventions (CAD nominal; rates as decimals) and the p1/p2 spousal convention (p1 is higher-earning + dies in Survivor; `p2.name === ''` flags single-household mode) are spelled out at the top. `loadClientData()`, `migrate()`, `getDefaultD()`, and `getBlankD()` carry `@returns {D}` (and `@param {D}` on migrate); the `const D = loadClientData()` declaration is annotated `@type {D}`. Pure documentation — no runtime change. Canonical probe suite still **128/128**.
7. ~~**#57** — GitHub Actions CI for probes + README status badge~~ ✅ *Done 2026-04-27.* New `.github/workflows/probes.yml` runs `bash probes/run_all.sh` on every push to `main`, every pull request, and on manual `workflow_dispatch`. Single Ubuntu job pinned to Node 20 LTS — no install step needed since the probes have no npm dependencies. The script's existing pass/fail tally + `exit 1` on any failure is what gates the job. README badge added under the H1 pointing at the workflow runs page. Stale counts in `probes/README.md` refreshed (phase4_final 17 → 18, presets 44 → 53, total **119 → 128**) and the README's "Run the regression suite" line bumped to match. Badge will turn green once the workflow file lands on `main` and the first run completes.
8. ~~**#43** — Polish README for public audience (intro pitch, screenshot, live link)~~ ✅ *Done 2026-04-27.* `README.md` rewritten for a public reader: live-demo link to `https://retirement-dashboard-two.vercel.app/` (with deep-links to all five `/example/<slug>` presets) at the very top, customer-tone intro pitch (adapted from PITCH.md's customer version, tightened to two paragraphs), "What it models" feature table, privacy note, badges (probes CI + MIT). Existing repo guide and disclaimer kept but moved below the public-facing material. Screenshot is a placeholder PNG at `docs/screenshot.png` (1600×900, navy/gold palette matching the dashboard) — real shot is the open follow-up below. Custom domain may swap in pre-launch; only spot to edit is the five example links + the live-demo button at the top of `README.md`.

After Sprint 1 the project is technically publishable. Could open-source here.

After Sprint 2 the dashboard has the full UX-polish pass — collapsible sections, tooltips, round-trip Edit-plan, soft RRSP-room guardrail, sharper CPP help text, and default-on stress test with skip-toggle. Sprint 0 is now the next investment before Sprint 3's guided-form work.

## Sprint 2 — UX polish

**Progress:** 6/6 complete — Sprint 2 done (2026-04-28).

9. ~~**#53** — Collapsible sections (P1/P2 expanded, rest collapsed)~~ ✅ *Done 2026-04-27.* The five top-level intake-form cards (`Person 1`, `Person 2`, `Joint Assets & Liabilities`, `Spending Targets`, `Plan Assumptions`) are now native `<details>`/`<summary>` elements with a rotating chevron and hover affordance on the title bar. P1 + P2 ship `open`; the other three collapse by default to shorten the first-impression scroll. New `expandAllCards()` helper auto-expands every section on a submit-validation failure so an invalid value in a collapsed card still surfaces. No engine change — canonical probe suite still **128/128**. Implementation entirely in `index.html` (CSS block + summary/wrapper swaps + 3-line JS helper).
10. ~~**#54** — Tooltips on priority fields (8–12 fields with non-obvious meaning)~~ ✅ *Done 2026-04-27.* New `.tip` component — a small navy `(?)` icon next to a label that reveals an explanation bubble on hover or keyboard focus (`role="button"` + `tabindex="0"` + `aria-label`). Tooltip text is read from `data-tip`, max 280px wide with a 4px navy arrow. `tip-start` / `tip-end` modifiers anchor the bubble left or right so it doesn't clip in edge columns. Twelve distinct fields covered (CPP@70, CPP@65, OAS@65, DB Indexation, Non-Reg ACB, TFSA Room Remaining, Salary Reference Year, CPP Survivor under-65, Plan Start Year, Year P1 Dies, Withdrawal Order, Return Std. Deviation) — 19 icons total since seven of those labels appear once on each spouse. Existing inline `.hint` spans stay untouched: hint = "what to type", tooltip = "what the concept means." Pure UI — canonical probe suite still **128/128**.
11. ~~**#59** — "Back to form" button on dashboard with hash decoder + round-trip probe~~ ✅ *Done 2026-04-27.* Three pieces: (a) **Dashboard button.** New `← Edit plan` button in the dashboard header next to Print/PDF; only renders when `window.location.hash` is non-empty (preset/blank-state has nothing to round-trip). `goBackToForm()` passes the current hash through to `index.html` unchanged. (b) **Form hash decoder.** `index.html` grew `SCHEMA_VERSION` + `MIGRATIONS` + `migrate(D)` (mirroring the dashboard's registry so legacy v1 hashes load cleanly), plus a new `populateFromD(D)` that's the strict inverse of the existing payload construction. The DOMContentLoaded handler now resolves payload sources in priority order: URL hash → `populateFromD` + autosave; otherwise the existing localStorage "Welcome back" prompt. The old monolithic `submitForm` was split into a pure `gatherD()` (returns the payload) and a thin `submitForm()` that validates, calls `gatherD`, encodes, and navigates — same wire format, easier to reuse. (c) **Round-trip probe.** New `probe_intake_roundtrip.js` (22 checks) loads `index.html`'s script body, stubs a DOM with all 80+ field IDs, encodes a fully-populated fixture D, runs `populateFromD` → `gatherD`, and asserts `gatherD(populateFromD(D)) === D` deep-equal. Catches drift if a future field is added to one direction but not the other. Canonical probe suite **128 → 150** (added the 22 round-trip checks). `run_all.sh` updated to include the new probe.
12. ~~**#50** — Soft RRSP contribution-room warning~~ ✅ *Done 2026-04-28.* New `.warn-inline` component (yellow, navy-text, gold left border) renders directly under both spouses' Annual RRSP Contribution fields when the entered amount exceeds either (a) 18% of the stated salary above (the simplified CRA prior-year-earned-income rule), or (b) the $32,490 hard 2026 dollar cap. Soft validation only — never blocks submit. `validateRrspRoom()` is fired from the existing `input` listener (scoped via regex to salary/contrib field changes only) and on every load path that populates fields (`populateFromD` from a hash, restore from localStorage). Inline `(?)` tooltip on the contribution label points users to CRA My Account / their Notice of Assessment for the authoritative number, since the form can't see carry-forward room or pension adjustment. No engine change — canonical probe suite still passes 150/150 unaffected.
13. ~~**#51** — Improve CPP-at-65 help text + Service Canada link~~ ✅ *Done 2026-04-28.* Three field hints rewritten on each spouse: (a) **CPP@70** hint now reads "From your My Service Canada Account → Statement of Contributions" with a live link to canada.ca's MSCA portal, replacing the old generic "Your Statement of Contributions estimate"; (b) **CPP@65** hint kept the auto-calc note but appended "or get the official figure from your My Service Canada Account" with the same link; (c) tooltips on both fields rewritten to spell out the exact MSCA navigation path ("My Service Canada Account → Canada Pension Plan / Old Age Security → Estimated monthly CPP benefits") and the rough delay/early heuristics (~7%/yr deferred after 65, ~7.2%/yr lost if started early). New `.field .hint a` CSS so in-hint links read as navy + bold + non-italic against the muted italic hint base style. Pure UI — canonical probe suite unaffected.
14. ~~**#52** — Default-on Monte Carlo with progressive rendering~~ ✅ *Done 2026-04-28.* Three pieces. (a) **Engine refactor.** `monteCarlo()` is now a thin `mcBegin → mcStep(state, nPaths) → mcFinish(state)` wrapper, and a new `monteCarloProgressive(baseCfg, opts)` runs the same per-path math in batches of 200 separated by `setTimeout(tick, 0)` so the page paints between chunks. Returns `{cancel, isCancelled, state}` so callers can abort. (b) **Auto-run on load.** `DOMContentLoaded` schedules `autoMonteCarlo()` 80ms after the deterministic dashboard renders; runs the baseline scenario in the background. New top-of-page banner (`.mc-banner`) shows progress via a CSS `--mc-pct` custom property and fills with the headline success rate when done. Three states (`running`/`complete`/`skipped`) controlled by `data-state`. The existing MC panel below also populates with the fan chart + KPIs (rendering extracted into `renderMonteCarloResults()` which the manual button now reuses). (c) **Skip toggle + persistence.** "Skip stress test" button cancels the in-flight run, persists `rpd_skip_mc=1` in localStorage so subsequent visits honour the choice, and shows a "Run it now" affordance to opt back in. Tab-switching mid-run cancels the auto-run (otherwise the baseline result would mislabel the new scenario's panel) and shows a "Scenario changed" banner. New `probe_mc_progressive.js` (29 checks) verifies the begin/step/finish decomposition, batch accumulation/clamping, percentile ordering of progressive output, and pre-tick cancellation. Suite is now **150 → 179**.

## Sprint 3 — Guided form

15. **#55** — Sidebar nav with per-section save/advance + status icons. The bigger UX investment.

## Sprint 4 — Launch

16. **#44** — Replace donate-first launch idea with local-first paid/free positioning once Sprint 0 trust gates are green.
17. **#45** — Plan and post launch posts (r/PersonalFinanceCanada, HN)

**Minimum viable launch sequence:** Sprint 0 first, then decide whether launch packaging, guided-form UX, or deeper engine extraction is the next best move.

## Backlog (not yet in a sprint)

### Validation / data hygiene

- **Silent zero-defaults.** If the user submits with a critical field blank (dob, balances), the dashboard receives `0` and produces nonsense. Add validation before encoding the hash.
- **`a_retireYear` fallback cleanup.** Phase 5.2 removed the input but left legacy `n('a_retireYear', 2027)` references as fallbacks. Worth a cleanup pass.
- **Header sentences in Real-mode.** Real toggle recomputes KPIs/charts but not the header text. Low severity.

### Dashboard UX

- **"Working?" column badge** in year-by-year detail table for pre-retirement years.
- **Salary chart series tooltip** explaining it's gross pre-tax.
- **Print PDF improvements.** Works but is dense — two-page layout with KPIs up front.
- **Drilldown modal** on year-click — explain every line item.

### Performance

- **MC perf in meltdown scenario.** ~6× slower than baseline. Acceptable now; profile if path counts increase.

### Future capability

- **Mobile-friendly reflow.** Sprint 3's sidebar nav (#55) is desktop-first; a mobile fallback (top progress bar / hamburger) is its own piece of work.
- **Save/load `.plan.json`.** Beyond the hash URL.
- **Named plans in localStorage.** Multiple plans per household.
- **Plan comparison.** Two saved plans side-by-side.
- **Multi-province.** BC and Alberta first; Quebec is largest scope (QPP, distinct tax structure).
- **French translation** for Quebec market.
- **Withdrawal-order optimiser.** Search over draw permutations for max after-tax.
- **"What if I work N more years?" slider.**
- **RDSP / DTC support** if relevant.
- **Tax-loss-harvesting** in non-reg.
- **Annual 2027 tax-update pass** (recurring, due every year — calendar reminder).
