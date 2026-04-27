# TASKS.md

The current plan came out of the 2026-04-25 decision session. See `DECISIONS.md` for the reasoning behind each pick. The live TaskList holds tasks #41–#59 (run `TaskList` in any chat to see status); this file is the readable plan view.

## Sprint 1 — Foundation (publishable code)

The pass that takes the codebase from "private project" to "ready to be public." Order matters: schema versioning lands before the rename so the rename can use the migration system.

**Progress:** 4/8 complete (as of 2026-04-26).

1. ~~**#41** — Add MIT LICENSE~~ ✅ *Done 2026-04-26.* Standard MIT text at `/LICENSE`; copyright Michael Evans 2026.
2. ~~**#42** — Add "not financial advice" disclaimer (README + dashboard footer)~~ ✅ *Done 2026-04-26.* New `Disclaimer` section near the top of the README; `<footer class="disclaimer">` rendered above `</body>` in `retirement_dashboard.html`, with a print-stylesheet rule so it appears on the PDF export.
3. ~~**#46** — Add `D.schemaVersion = 1` + `migrate(D)` scaffold~~ ✅ *Done 2026-04-26.* Stamped on payload at encode; `migrate(D)` + `MIGRATIONS` registry in dashboard; legacy (no-version) hashes lifted to v1; future-version payloads warned and loaded as-is. New `probe_schema_migrate.js` (12 checks) joins the canonical suite (now 67/67).
4. ~~**#47 + #48 + #49** — Rename `frank`/`moon` → `p1`/`p2`, clear placeholders, add v1→v2 migration~~ ✅ *Done 2026-04-26.* Engine, intake form, and probes all use `p1`/`p2`. `assumptions.frankDiesInSurvivor` → `assumptions.p1DiesInSurvivor`; intake form ID `a_frankDies` → `a_p1Dies`. Default placeholder names cleared (`Alex`/`Sam` → blank, with `Person 1`/`Person 2` placeholders on the inputs). `MIGRATIONS[1]` lifts legacy v1 (or pre-versioning) payloads forward — confirmed with a new end-to-end test that loads a real legacy hash and asserts the engine receives `p1`/`p2`. `SCHEMA_VERSION = 2`. Probe count: **74/74** (probe_schema_migrate grew 12→19 to cover the rename).
5. **#58** — Replace auto-populated Alex/Sam data with blank form + 3–4 example presets (deep-linked via `?example=slug`)
6. **#56** — Add JSDoc `@typedef` block for `D`
7. **#57** — GitHub Actions CI for probes + README status badge
8. **#43** — Polish README for public audience (intro pitch, screenshot, live link)

After Sprint 1 the project is technically publishable. Could open-source here.

## Sprint 2 — UX polish

9. **#53** — Collapsible sections (P1/P2 expanded, rest collapsed)
10. **#54** — Tooltips on priority fields (8–12 fields with non-obvious meaning)
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
