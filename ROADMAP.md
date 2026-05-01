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
- 4.3 Full-spending-funded Monte Carlo metric
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

**Phase 5 shipped (2026-04-25).** Decision session held same day resolved the initial public-release questions. A later product reset on 2026-04-30 set the next direction: consumer-first, local-first monetization, optional accounts only, and trust/engine readiness before a broader UI rebuild.

**Sprint 1 — Foundation: complete (2026-04-27). 8/8 done.** The project is now technically publishable.
- ✅ #41 — MIT LICENSE at project root.
- ✅ #42 — "Not financial advice" disclaimer in README + dashboard footer (with print-stylesheet rule so it carries to PDF export).
- ✅ #46 — `D.schemaVersion = 1` + `migrate(D)` scaffold landed. Probe coverage 67/67 (added `probe_schema_migrate.js`). Unblocked the v1→v2 migration that shipped with #47–#49.
- ✅ #47–#49 — `frank`/`moon` → `p1`/`p2` rename across engine, intake form, and probes. Default placeholder names cleared. `MIGRATIONS[1]` lifts legacy hashes forward; `SCHEMA_VERSION = 2`. Probe coverage now **74/74** (probe_schema_migrate grew 12 → 19 to cover the rename and end-to-end legacy-hash load).
- ✅ #58 — Five Canadian-archetype presets shipped in the dashboard's `PRESETS` registry, deep-linked via `?example=<slug>`. Blank fallback + landing card; intake form prefill stripped to structural defaults only. Probe count now **119/119** (added `probe_presets.js`).
- ✅ #56 — JSDoc `@typedef` block for `D` and its sub-shapes (`Person`, `Spending`, `Mortgage`, `Loc`, `CashWedge`, `Downsize`, `OneOff`, `SpousalRrsp`, `Assumptions`) at the top of the CLIENT DATA section in `retirement_dashboard.html`. `loadClientData()` / `migrate()` / `getBlankD()` / `getDefaultD()` annotated; `const D` carries `@type {D}`. Pure documentation — no runtime change.
- ✅ #57 — GitHub Actions CI workflow at `.github/workflows/probes.yml` runs the canonical regression suite on every push to `main`, every pull request, and on manual dispatch. Ubuntu + Node 20 LTS; the existing `probes/run_all.sh` tally + `exit 1` is what gates the job. README badge added; stale per-probe counts in `probes/README.md` refreshed (total **119 → 128**, picking up the drift from phase4_final and presets).
- ✅ #43 — `README.md` rewritten for a public reader: live-demo button to `retirement-dashboard-two.vercel.app` with `/example/<slug>` deep-links for all five presets, customer-tone intro pitch (adapted from PITCH.md), "What it models" feature table, privacy note, CI + MIT badges. Repo guide and full disclaimer retained but moved below the public-facing material. Screenshot is a placeholder at `docs/screenshot.png`; real shot is in the backlog.

**Sprint 2 — UX polish: complete (2026-04-28). 6/6 done.** See `TASKS.md` items #53, #54, #59, #50, #51, #52.
- ✅ #53 — Top-level intake-form cards are now native `<details>`/`<summary>` elements with a rotating chevron. Person 1 + Person 2 ship `open`; Joint, Spending, and Assumptions collapse by default to shorten the first-impression scroll. Submit-validation failures auto-expand every card via a new `expandAllCards()` helper so a hidden invalid field is brought into view. Pure UI change — canonical probe suite still 128/128.
- ✅ #54 — Inline tooltips on twelve priority fields with non-obvious meaning (CPP@70/@65, OAS, DB indexation, Non-Reg ACB, TFSA Room Remaining, Salary Reference Year, CPP Survivor benefit, Plan Start Year, Year P1 Dies, Withdrawal Order, Return Std. Deviation). New `.tip` component is a navy `(?)` icon + hover/focus bubble; existing `.hint` spans stay (hint = what to type, tooltip = what the concept means). 19 icons total since most field types appear on both spouses. Keyboard-accessible (tabindex + aria-label + focus-visible ring). Canonical probe suite still 128/128.
- ✅ #59 — Round-trip from dashboard to intake form. New `← Edit plan` button in the dashboard header passes `window.location.hash` straight through to `index.html`; only renders when a hash drove the load (preset/blank-state has nothing to round-trip). `index.html` gained `SCHEMA_VERSION` + `migrate(D)` mirroring the dashboard's, plus `populateFromD(D)` as the strict inverse of the existing payload construction (which was extracted into a pure `gatherD()`). The form's DOMContentLoaded handler now decodes a hash first, falls back to the localStorage "Welcome back" prompt otherwise. New `probe_intake_roundtrip.js` (22 checks) asserts `gatherD(populateFromD(D)) === D` deep-equal across a fully-populated fixture, catching drift if a future field gets added to one direction but not the other. Canonical probe suite **128 → 150**.
- ✅ #50 — Soft RRSP contribution-room warning. Yellow inline banner (`.warn-inline`) renders under both spouses' Annual RRSP Contribution fields when the entered amount exceeds 18% of the stated salary OR the 2026 $32,490 dollar cap. Soft validation only — never blocks submit, since the form can't see carry-forward room or pension adjustment. Wired into the existing `input` listener (scoped to salary/contrib changes) and into `populateFromD` for hash-loaded plans. Tooltip on each contribution label points users to CRA My Account / NOA for the authoritative number. Pure UI — canonical probe suite unaffected.
- ✅ #51 — CPP-at-65 help text upgraded. Both spouses' CPP@70 and CPP@65 hints now carry a live link to canada.ca's My Service Canada Account portal, plus precise navigation guidance ("MSCA → Canada Pension Plan / Old Age Security → Estimated monthly CPP benefits"). Tooltips spell out the rough delay/early heuristics (~7%/yr deferred, ~7.2%/yr early). New `.field .hint a` styling — navy + bold + non-italic — so the link reads as clickable inside the muted italic hint baseline. Canonical probe suite unaffected.
- ✅ #52 — Default-on Monte Carlo with progressive rendering. `monteCarlo()` refactored into `mcBegin → mcStep(state, nPaths) → mcFinish(state)`, and a new `monteCarloProgressive(baseCfg, opts)` runs the same per-path math in 200-path batches separated by `setTimeout(0)` so the page paints between chunks. Auto-runs the baseline scenario 80ms after `DOMContentLoaded`; new top-of-page banner shows progress (`--mc-pct` CSS variable) and fills with the headline funded-path rate when done. "Skip stress test" cancels the in-flight run and persists `rpd_skip_mc=1` in localStorage; tab-switching mid-run cancels too (otherwise the baseline result would mislabel the new scenario's panel). The existing MC panel rendering was extracted into `renderMonteCarloResults()` so the manual button reuses the same sink. New `probe_mc_progressive.js` (29 checks originally, now 35 after Sprint 0 stress-severity coverage) covers the begin/step/finish decomposition, batch accumulation/clamping, percentile ordering of progressive output, stress-severity shape, and pre-tick cancellation.

## Sprint plan

**Sprint 0 — Trust and engine readiness.** Underway. S0-01 fixed pension-income-credit eligibility, S0-02 added focused age 64-72 tax/benefit fixtures, S0-03 added the 2026 federal/Ontario tax methodology note, S0-04/S0-06 clarified stress-test metrics and interpretation language, and S0-07 expanded annual validation exports. Remaining work: public-comparator fixture/rerun, engine boundary mapping, schema v3 draft, and local-first monetization boundaries. This supersedes the old "Sprint 3 next" ordering.

**Sprint 1 — Foundation.** Internal-cleanup pass that takes the codebase from "private project" to "ready to be public." Adds LICENSE, disclaimer, schema versioning + migration scaffold, `frank`/`moon` → `p1`/`p2` rename, blank form with example presets, JSDoc types on `D`, GitHub Actions CI, polished public README. *Estimated: one focused weekend.*

**Sprint 2 — UX polish.** Collapsible sections, inline tooltips on key fields, back-to-form button + hash decoder, soft RRSP-room warning, improved CPP help text, default-on Monte Carlo with progressive rendering. *Estimated: one weekend.*

**Sprint 3 — Guided form.** Deferred until Sprint 0 trust work is done. Sidebar nav with per-section save/advance and status icons. Turns the long form into something genuinely guided without going full wizard. *Estimated: half-day to a full day.*

**Sprint 4 — Launch.** Deferred until tax validation, risk language, and export baselines are in better shape. Launch may include local-first paid positioning rather than only donate/micro-pay. *Estimated: one evening once trust gates are green.*

**Minimum viable productization sequence:** Sprint 0 first, then decide whether to continue with guided-form UX, engine extraction, or launch packaging. Trust beats polish for the next decision point.

## Medium-term roadmap (post-launch, beyond the four sprints)

**Phase 7 — Provinces.** Abstract Ontario-specific tax calc behind a province selector. BC and Alberta first; Quebec is largest scope due to QPP and distinct tax structure.

**Phase 8 — Local-first persistence and paid unlocks.** Export/import `.plan.json`, named local plans, and optional local license unlocks. Accounts remain optional for sync, license recovery, sharing, or advisor collaboration.

**Phase 8b — Implementation guidance package.** Turn a completed plan into a practical drawdown playbook: account-by-account withdrawal order, annual tax/benefit checkpoints, RRIF/LIF notes, CPP/OAS timing, and guardrail thresholds/actions. This is a strong Plus/Pro candidate, especially if AI-assisted explanations can be offered with explicit consent and a local-first privacy boundary.

**Phase 9 — Advisor mode (gated on B2B interest).** Multi-household dashboard, side-by-side comparison, white-label branding, client-ready reports, and optional encrypted collaboration. Build only after the consumer workflow is stable.

## Nice-to-have future ideas

- CPP contribution accrual estimator (deferred per Decision 4b — rely on Service Canada).
- RRSP/TFSA contribution-room auto-tracker year over year.
- Tax-loss-harvesting modelling in non-reg.
- Flexible-spending Monte Carlo: protect core spending while allowing discretionary spending to adjust in bad markets.
- Guardrail withdrawal mode with spending cuts/restores based on portfolio bands.
- Withdrawal-order optimiser (search over N→T→R permutations for max after-tax).
- "What if I work one more year?" slider.
- Estate tax optimisation (deemed disposition at last death).
- RDSP / DTC support if relevant.
- Mobile-friendly layout (Sprint 3's #55 is desktop-first; mobile is its own task).
- French translation (Canadian market — especially Quebec).
