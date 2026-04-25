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

**Phase 5 shipped.** No active phase. Ready for Phase 6 scoping.

## Next 30 days — priorities

**1. Stabilise what exists (High).** Add the `probe_*.js` harness into a short README and commit it. Run regression before any further engine edits.

**2. Intake UX polish (High).** The form works end-to-end but is intimidating. Light touch: collapsible sections, inline tooltips, a "guided defaults" button that fills sensible values for a given age bracket.

**3. Validation + error handling (High).** If the user omits key fields, the hash round-trip silently defaults; the dashboard should surface a "missing input" banner rather than project on zeroes.

**4. Decide product direction (High — blocks downstream work).** Personal tool, open-source, commercial? See Open Decisions in `DECISIONS.md`.

## Medium-term roadmap

**Phase 6 — Intake UX + onboarding (suggested)**
- Guided mode with step-by-step questions.
- Preset "profiles" (pre-retiree, early retiree, survivor).
- Inline explainer cards for each technical term (OAS clawback, BPA, LIF).

**Phase 7 — Provinces (suggested)**
- Abstract Ontario-specific tax calc behind a province selector.
- BC, Alberta, Quebec (Quebec is largest scope — separate pension plan, Solidarity Tax Credit).

**Phase 8 — Save/load (suggested)**
- Export/import a `.plan.json` file.
- Optionally sync to a user-owned cloud drive (privacy-preserving).

**Phase 9 — Advisor mode (suggested, gated on product-direction decision)**
- Multi-household dashboard.
- Compare two households side-by-side.
- White-label branding.

## Nice-to-have future ideas

- CPP contribution accrual for users still working (currently relies on a Service Canada statement).
- RRSP/TFSA contribution-room auto-tracker year over year.
- Tax-loss-harvesting modelling in non-reg.
- Withdrawal-order optimiser (search over N→T→R permutations for max after-tax).
- "What if I work one more year?" slider.
- Estate tax optimisation (deemed disposition at last death).
- RDSP / DTC support if relevant.
- Mobile-friendly layout (current layout is desktop-first).
- Translation to French (Canadian market — especially Quebec).
