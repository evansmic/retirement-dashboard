# ROADMAP.md

## Completed milestones

**Phase 1 — Core engine correctness**
- 1.1 Allow pre-65 RRSP draws
- 1.2 Taxable-income target solver
- 1.4 Capital gains tax on non-reg draws
- 1.5 OAS clawback after pension split
- 1-verify: zero-shortfall sweep
- "Never shortfall": sustainable-spend solver always displays a feasible plan

**Phase 2 — Realistic Canadian household rules**
- 2.1 Survivor asset rollover (RRSP/TFSA/LIF/non-reg with ACB preserved)
- 2.2 `nonreg_m` and joint-ownership support
- 2.3 Non-reg annual taxable distributions
- 2.4 Unified indexation inputs
- 2.5 Federal BPA phase-out
- 2.6 Ontario Health Premium
- 2.7 LIF max draws (1.3× RRIF min)
- 2.8 Mortgage payoff + LOC amortisation
- 2-verify

**Phase 3 — Strategy + UX**
- 3.1 Per-year withdrawal-order override (CFM preset)
- 3.2 Cash-wedge account
- 3.3 Younger-spouse RRIF election
- 3.4 Spousal-RRSP 3-year attribution
- 3.5 CPP sharing (distinct from splitting)
- 3.6 Principal residence + downsize event
- 3.7 One-off expenses + bequest lines
- 3.8 Real/nominal toggle
- 3.9 Split shortfall vs depletion KPIs
- 3-verify

**Phase 4 — Stress testing + reporting**
- 4.1 Monte Carlo engine with `cfg.returnRates` hook
- 4.2 Sequence-of-returns stress (1929, 1973, 2000, 2008)
- 4.3 Probability-of-success metric
- 4.4 PDF/print one-pager export
- 4.5 FP Canada guideline defaults
- 4-verify

**Phase 5 — Working couples + staggered retirement**
- 5.1 Pre-retirement employment income data model
- 5.2 Intake form per-spouse retirement + employment
- 5.3 Engine pre-retirement logic (salary, raises, contribs, dual DB)
- 5.4 UI updates for working years (Salary chart series + detail column + header sentences)
- 5.5 Verify (38 total checks passing across three probes)

## Current phase

**Phase 5 shipped (2026-04-25).** Decision session held same day resolved every open question (see `DECISIONS.md` — Open decisions section is now empty). Forward path is broken into four sprints (`TASKS.md`, tasks #41–#59).

**Sprint 1 — Foundation: complete (2026-04-27). 8/8 done.** The project is now technically publishable.
- ✅ #41 — MIT LICENSE at project root.
- ✅ #42 — "Not financial advice" disclaimer in README + dashboard footer (with print-stylesheet rule so it carries to PDF export).
- ✅ #46 — `D.schemaVersion = 1` + `migrate(D)` scaffold landed. Probe coverage 67/67 (added `probe_schema_migrate.js`). Unblocked the v1→v2 migration that shipped with #47–#49.
- ✅ #47–#49 — `frank`/`moon` → `p1`/`p2` rename across engine, intake form, and probes. Default placeholder names cleared. `MIGRATIONS[1]` lifts legacy hashes forward; `SCHEMA_VERSION = 2`. Probe coverage now **74/74** (probe_schema_migrate grew 12 → 19 to cover the rename and end-to-end legacy-hash load).
- ✅ #58 — Five Canadian-archetype presets shipped in the dashboard's `PRESETS` registry, deep-linked via `?example=<slug>`. Blank fallback + landing card; intake form prefill stripped to structural defaults only. Probe count now **119/119** (added `probe_presets.js`).
- ✅ #56 — JSDoc `@typedef` block for `D` and its sub-shapes (`Person`, `Spending`, `Mortgage`, `Loc`, `CashWedge`, `Downsize`, `OneOff`, `SpousalRrsp`, `Assumptions`) at the top of the CLIENT DATA section in `retirement_dashboard.html`. `loadClientData()` / `migrate()` / `getBlankD()` / `getDefaultD()` annotated; `const D` carries `@type {D}`. Pure documentation — no runtime change.
- ✅ #57 — GitHub Actions CI workflow at `.github/workflows/probes.yml` runs the canonical regression suite on every push to `main`, every pull request, and on manual dispatch. Ubuntu + Node 20 LTS; the existing `probes/run_all.sh` tally + `exit 1` is what gates the job. README badge added; stale per-probe counts in `probes/README.md` refreshed (total **119 → 128**, picking up the drift from phase4_final and presets).
- ✅ #43 — `README.md` rewritten for a public reader: live-demo button to `retirement-dashboard-two.vercel.app` with `/example/<slug>` deep-links for all five presets, customer-tone intro pitch (adapted from PITCH.md), "What it models" feature table, privacy note, CI + MIT badges. Repo guide and full disclaimer retained but moved below the public-facing material. Screenshot is a placeholder at `docs/screenshot.png`; real shot is in the backlog.

**Active sprint: Sprint 2 — UX polish.** See `TASKS.md` items #53, #54, #59, #50, #51, #52. **Progress: 3/6.**
- ✅ #53 — Top-level intake-form cards are now native `<details>`/`<summary>` elements with a rotating chevron. Person 1 + Person 2 ship `open`; Joint, Spending, and Assumptions collapse by default to shorten the first-impression scroll. Submit-validation failures auto-expand every card via a new `expandAllCards()` helper so a hidden invalid field is brought into view. Pure UI change — canonical probe suite still 128/128.
- ✅ #54 — Inline tooltips on twelve priority fields with non-obvious meaning (CPP@70/@65, OAS, DB indexation, Non-Reg ACB, TFSA Room Remaining, Salary Reference Year, CPP Survivor benefit, Plan Start Year, Year P1 Dies, Withdrawal Order, Return Std. Deviation). New `.tip` component is a navy `(?)` icon + hover/focus bubble; existing `.hint` spans stay (hint = what to type, tooltip = what the concept means). 19 icons total since most field types appear on both spouses. Keyboard-accessible (tabindex + aria-label + focus-visible ring). Canonical probe suite still 128/128.
- ✅ #59 — Round-trip from dashboard to intake form. New `← Edit plan` button in the dashboard header passes `window.location.hash` straight through to `index.html`; only renders when a hash drove the load (preset/blank-state has nothing to round-trip). `index.html` gained `SCHEMA_VERSION` + `migrate(D)` mirroring the dashboard's, plus `populateFromD(D)` as the strict inverse of the existing payload construction (which was extracted into a pure `gatherD()`). The form's DOMContentLoaded handler now decodes a hash first, falls back to the localStorage "Welcome back" prompt otherwise. New `probe_intake_roundtrip.js` (22 checks) asserts `gatherD(populateFromD(D)) === D` deep-equal across a fully-populated fixture, catching drift if a future field gets added to one direction but not the other. Canonical probe suite **128 → 150**.

## Sprint plan (post-decision)

**Sprint 1 — Foundation.** Internal-cleanup pass that takes the codebase from "private project" to "ready to be public." Adds LICENSE, disclaimer, schema versioning + migration scaffold, `frank`/`moon` → `p1`/`p2` rename, blank form with example presets, JSDoc types on `D`, GitHub Actions CI, polished public README. *Estimated: one focused weekend.*

**Sprint 2 — UX polish.** Collapsible sections, inline tooltips on key fields, back-to-form button + hash decoder, soft RRSP-room warning, improved CPP help text, default-on Monte Carlo with progressive rendering. *Estimated: one weekend.*

**Sprint 3 — Guided form.** Sidebar nav with per-section save/advance and status icons. Turns the long form into something genuinely guided without going full wizard. *Estimated: half-day to a full day.*

**Sprint 4 — Launch.** Donate / micro-pay button + launch posts (r/PersonalFinanceCanada, HN). *Estimated: one evening.*

**Minimum viable launch sequence:** Sprint 1 + Sprint 4. Ship public, iterate UX (Sprints 2–3) in public. Choice between this and the full Sprint 1→2→3→4 sequence depends on whether you'd rather optimise for learning (ship sooner) or first-impression polish (ship later).

## Medium-term roadmap (post-launch, beyond the four sprints)

**Phase 7 — Provinces.** Abstract Ontario-specific tax calc behind a province selector. BC and Alberta first; Quebec is largest scope due to QPP and distinct tax structure.

**Phase 8 — Save/load.** Export/import `.plan.json` file. Optionally sync to user-owned cloud drive (privacy-preserving).

**Phase 9 — Advisor mode (gated on B2B interest).** Multi-household dashboard, side-by-side comparison, white-label branding. Per Decision 1's hybrid framing, only build if planner interest emerges unprompted.

## Nice-to-have future ideas

- CPP contribution accrual estimator (deferred per Decision 4b — rely on Service Canada).
- RRSP/TFSA contribution-room auto-tracker year over year.
- Tax-loss-harvesting modelling in non-reg.
- Withdrawal-order optimiser (search over N→T→R permutations for max after-tax).
- "What if I work one more year?" slider.
- Estate tax optimisation (deemed disposition at last death).
- RDSP / DTC support if relevant.
- Mobile-friendly layout (Sprint 3's #55 is desktop-first; mobile is its own task).
- French translation (Canadian market — especially Quebec).
