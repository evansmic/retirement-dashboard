# TASKS.md

The current plan came out of the 2026-04-25 decision session. See `DECISIONS.md` for the reasoning behind each pick. The live TaskList holds tasks #41–#59 (run `TaskList` in any chat to see status); this file is the readable plan view.

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

## Sprint 2 — UX polish

**Progress:** 2/6 complete.

9. ~~**#53** — Collapsible sections (P1/P2 expanded, rest collapsed)~~ ✅ *Done 2026-04-27.* The five top-level intake-form cards (`Person 1`, `Person 2`, `Joint Assets & Liabilities`, `Spending Targets`, `Plan Assumptions`) are now native `<details>`/`<summary>` elements with a rotating chevron and hover affordance on the title bar. P1 + P2 ship `open`; the other three collapse by default to shorten the first-impression scroll. New `expandAllCards()` helper auto-expands every section on a submit-validation failure so an invalid value in a collapsed card still surfaces. No engine change — canonical probe suite still **128/128**. Implementation entirely in `index.html` (CSS block + summary/wrapper swaps + 3-line JS helper).
10. ~~**#54** — Tooltips on priority fields (8–12 fields with non-obvious meaning)~~ ✅ *Done 2026-04-27.* New `.tip` component — a small navy `(?)` icon next to a label that reveals an explanation bubble on hover or keyboard focus (`role="button"` + `tabindex="0"` + `aria-label`). Tooltip text is read from `data-tip`, max 280px wide with a 4px navy arrow. `tip-start` / `tip-end` modifiers anchor the bubble left or right so it doesn't clip in edge columns. Twelve distinct fields covered (CPP@70, CPP@65, OAS@65, DB Indexation, Non-Reg ACB, TFSA Room Remaining, Salary Reference Year, CPP Survivor under-65, Plan Start Year, Year P1 Dies, Withdrawal Order, Return Std. Deviation) — 19 icons total since seven of those labels appear once on each spouse. Existing inline `.hint` spans stay untouched: hint = "what to type", tooltip = "what the concept means." Pure UI — canonical probe suite still **128/128**.
11. **#59** — "Back to form" button on dashboard with hash decoder + round-trip probe
12. **#50** — Soft RRSP contribution-room warning
13. **#51** — Improve CPP-at-65 help text + Service Canada link
14. **#52** — Default-on Monte Carlo with progressive rendering

## Sprint 3 — Guided form

15. **#55** — Sidebar nav with per-section save/advance + status icons. The bigger UX investment.

## Sprint 4 — Launch

16. **#44** — Add donate / micro-pay button (Buy Me a Coffee or Stripe Buy Button)
17. **#45** — Plan and post launch posts (r/PersonalFinanceCanada, HN)

**Minimum viable launch sequence:** Sprint 1 + Sprint 4. Ship public, iterate UX (Sprints 2–3) in public.

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
