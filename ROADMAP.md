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

**Active sprint: Sprint 1 — Foundation.**

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
