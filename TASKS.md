# TASKS.md

Priority: **High** = do before anything else. **Medium** = next natural batch. **Low** = eventually / nice-to-have.

## Immediate action items

### Stabilise

- **[High]** Commit current working tree and tag it as `phase-5-complete`. The three verification probes (`probe_phase5.js`, `probe_phase5_e2e.js`, `probe_phase5_intake.js`) plus `probe_phase4_final.js` are the regression suite — keep them runnable.
- **[High]** Write a short `README.md` that documents how to open the app (double-click `index.html` or serve the folder), how to run the probes (`node probe_*.js` from the outputs folder), and the data-flow diagram.
- **[High]** Move `probe_*.js` files out of the ephemeral session outputs folder into the project directory (e.g. `./probes/`) so they survive session boundaries.
- **[High]** Decide product direction (see `DECISIONS.md` Open). Blocks everything downstream.

### Gaps / bugs

- **[Medium]** **Silent zero-defaults.** If the user submits with `frank.dob = ""`, the dashboard receives `0` and produces a nonsense projection. Add validation before encoding the hash in `index.html`.
- **[Medium]** **`a_retireYear` fallback cleanup.** Phase 5.2 removed the `a_retireYear` input from the UI but left legacy `n('a_retireYear', 2027)` references in place (now just fallback to 2027). Fine as a safety net, but worth a cleanup pass to remove dead references.
- **[Medium]** **Header `retireYear` in Real-mode deflation.** Per-spouse retire year is now shown in the header, but the "Real" toggle recomputes only KPIs/charts, not header sentences. Low-severity — just confirm nothing breaks.
- **[Medium]** **CPP contribution accrual for working users.** Today the engine relies on the user supplying `cpp65_monthly` from a Service Canada statement. A user still 10 years from retirement doesn't have that number. Either document this clearly or add a CPP-accrual estimator.
- **[Low]** **Monte Carlo in meltdown scenario is ~6× slower.** Acceptable for MVP but worth profiling if path count increases.
- **[Low]** **Print PDF one-pager.** Works but is dense. Consider a two-page layout with key KPIs up front.

### Intake UX (if staying in MVP shape)

- **[Medium]** Add inline tooltips to every field with a `?` icon (BPA, OAS clawback, LIF max, ACB, spousal-RRSP attribution, CPP sharing).
- **[Medium]** Collapsible sections — working years, DB pension, mortgage, LOC, one-off expenses should collapse by default.
- **[Medium]** "Guided defaults" button — fills reasonable values for a pre-retiree couple.
- **[Low]** Field validation with red underline + inline error message.

### Dashboard UX

- **[Medium]** Year-by-year detail table: add a "Working?" column badge so readers can see pre-retirement years at a glance.
- **[Medium]** Income chart: Salary series (added Phase 5.4) needs a legend-hover tooltip explaining it's gross pre-tax.
- **[Low]** Mobile-friendly reflow.
- **[Low]** Drilldown modal on year-click — explain every line item.

## Strategic tasks

- **[High]** Decide: personal tool / open source / commercial? (See `DECISIONS.md`.)
- **[Medium]** Decide: rename `frank`/`moon` to neutral `p1`/`p2` in engine internals? Breaking change to saved hash URLs but cleaner going forward.
- **[Medium]** Plan for schema versioning so we can migrate saved hashes.
- **[Medium]** Evaluate whether a "Run All" button (deterministic + MC + stress in one go) makes sense as the default flow.
- **[Low]** Quebec / BC / Alberta tax support. Largest scope: Quebec has its own pension plan (QPP) and a distinct tax structure.
- **[Low]** Translation to French for Quebec.

## Backlog (future phases)

- **[Medium]** Save/load `.plan.json`.
- **[Medium]** Named plans in localStorage.
- **[Medium]** Plan comparison: two saved plans side-by-side.
- **[Low]** Scenario authoring UI.
- **[Low]** Withdrawal-order optimiser.
- **[Low]** "What if I work N more years?" slider.
- **[Low]** RDSP / DTC support if relevant.
- **[Low]** Tax-loss-harvesting modelling.
- **[Low]** Annual 2027 tax-update pass (recurring, due every year).
