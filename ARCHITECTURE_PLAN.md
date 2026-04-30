# Architecture Plan

## Goal

Evolve the current two-file static prototype into a maintainable retirement planning application without losing the advantages that made the prototype useful: privacy, transparency, fast iteration, and a well-tested calculation engine.

The immediate architectural goal is not to rebuild everything. It is to separate the planning engine from the UI so each can grow safely.

## Current State

The project currently works as:

- `index.html` — intake form.
- `retirement_dashboard.html` — dashboard, calculation engine, presets, charts, Monte Carlo, stress tests, and rendering.
- `probes/` — Node-based regression tests that execute the dashboard script.
- `validation/` — benchmark exports and external comparison notes.

This is excellent for a prototype but will become hard to extend into a ProjectionLab-like product.

## Architecture Principles

1. **Engine and UI must be separate**
   Calculations should not depend on DOM, Chart.js, route state, or form IDs.

2. **Schema first**
   Plans, scenarios, people, accounts, income sources, expenses, and assumptions should have explicit data contracts.

3. **Tests protect financial logic**
   Any change to tax, drawdown, CPP/OAS, Monte Carlo, stress tests, or scenario calculations should have regression coverage.

4. **Local-first by default**
   The app should work without accounts. Save/load should start with local files or browser storage.

5. **Progressive complexity**
   Guided users should see a simple flow. Advanced users should be able to inspect and tune everything.

6. **Accounts are optional infrastructure**
   Authentication, if added, should support sync, license recovery, sharing, and advisor collaboration. It should not sit on the critical path for ordinary planning, local persistence, import/export, or paid local unlocks.

7. **Trust gates before UI expansion**
   Tax accuracy, risk-language clarity, validation exports, and engine boundaries should be strengthened before the next app shell is designed around unstable contracts.

## Suggested Future Structure

```text
apps/
  web/
    src/
      app/
      components/
      routes/
      charts/
      forms/
      views/

packages/
  engine/
    src/
      simulation/
      tax/
      benefits/
      accounts/
      drawdown/
      monte-carlo/
      stress-tests/
      scenarios/
      explain/
    tests/

  schema/
    src/
      plan.ts
      scenario.ts
      migrations.ts
      fixtures.ts

  validation/
    src/
      exporters/
      comparators/

docs/
  methodology/
  product/
  decisions/

validation/
  fixtures/
  external-results/
```

This can be a monorepo later. The first step can be much smaller: create `src/engine/` inside the current repo and move code there gradually.

## Recommended Stack

Near-term:

- TypeScript for engine and schema.
- Vitest or Node test runner for unit/regression tests.
- React or Next.js for the future app UI.
- Chart.js, Recharts, or ECharts for charts.
- LocalStorage / IndexedDB for early local save.
- JSON import/export for plan portability.

Default recommendation:

- Use TypeScript.
- Use React with Vite for a local-first app, or Next.js if you expect hosted app routes, auth, and sharing.
- Avoid adding a backend until there is a clear reason.

## Target Data Model

Move away from hard-coded `p1` / `p2` as the primary design. A future plan should look conceptually like:

```text
Plan
  household
    people[]
  accounts[]
  incomeSources[]
  expenses[]
  assets[]
  debts[]
  events[]
  assumptions
  scenarios[]
```

Examples:

- `people[]`: birth date, retirement date, province, benefit assumptions.
- `accounts[]`: RRSP, RRIF, LIRA, LIF, TFSA, non-registered, cash, taxable ACB.
- `incomeSources[]`: CPP, OAS, DB pension, employment, rental, annuity.
- `expenses[]`: core, discretionary, healthcare, housing, travel, gifts.
- `events[]`: downsize, inheritance, one-time expense, first death, move province.
- `scenarios[]`: overrides to the base plan.

## Migration Path

### Phase 0 — Trust And Engine Readiness

- Fix or prove pension-income-credit eligibility and other tax-credit edge cases.
- Add focused tax fixtures for the age 64-72 transition window.
- Rename or qualify Monte Carlo "success" language so it describes full-spending funding, not binary life-plan success.
- Add stress-test severity metrics: max shortfall, total shortfall, first shortfall year, depletion year, and core-spending coverage.
- Expand validation exports so external comparisons can inspect per-year balances, withdrawals, taxable income, tax, benefits, and assumptions.
- Map current dashboard code into engine, UI, charting, copy, and persistence/hash boundaries.
- Draft the schema-v3 input and output contracts before rebuilding UI surfaces.

### Phase 1 — Stabilize Current Prototype

- Fix known accuracy issues, especially pension-income-credit eligibility.
- Rename Monte Carlo success metrics to distinguish full-lifestyle funding from true failure.
- Add stress-test severity metrics: max shortfall, total shortfall, depletion year.
- Keep current probes passing.

### Phase 2 — Extract Engine

- Move pure calculation functions into engine modules.
- Keep the existing UI calling the extracted engine.
- Preserve outputs against current fixture baselines.
- Add module-level tests for tax, benefits, drawdown, Monte Carlo, and stress tests.

### Phase 3 — Define Schema v3

- Design the next-generation plan schema.
- Write migrations from current `D` payload to schema v3.
- Add fixture plans for single, couple, DB pension, retired, FIRE, and low-income cases.

### Phase 4 — Build New App Shell

- Create a modern frontend.
- Implement guided intake.
- Implement dashboard views using the extracted engine.
- Add local save/load and scenario management.

### Phase 5 — Scenario and Risk System

- Build user-authored scenarios.
- Add flexible spending and guardrail simulations.
- Add risk severity outputs.
- Add plain-language explanations.

### Phase 6 — Validation and Expansion

- Expand public and paid-tool validation.
- Add more provinces.
- Add Quebec only after the tax/benefit abstraction is solid.
- Consider advisor mode only after consumer workflow is stable.

## Testing Strategy

Keep three layers of tests:

1. **Unit tests**
   Tax brackets, OAS clawback, RRIF minimums, CPP adjustments, account withdrawals.

2. **Scenario regression tests**
   Frozen plans with expected yearly outputs and summary metrics.

3. **Validation benchmarks**
   Public calculator comparisons and, later, paid-tool comparisons.

The current `probes/` are valuable. Do not throw them away. Gradually convert them into cleaner engine tests.

## Persistence Strategy

Start local-first:

- Browser local save.
- Named plans.
- Named scenarios.
- Export/import `.plan.json`.
- Paid feature unlocks that do not require plan-data upload.

Later options:

- Optional encrypted cloud sync.
- User-owned cloud storage.
- Advisor workspace.
- Shareable read-only reports.
- License recovery through an optional account.

Do not start with authentication. If authentication is added later, it should be optional and should never become the only way to use the core planner.

## Reporting Strategy

Reports should be explainable and exportable:

- One-page summary.
- Scenario comparison.
- Year-by-year appendix.
- Assumptions appendix.
- Tax and benefit methodology notes.
- Clear disclaimer.

Future advisor mode could add branding, notes, and client-ready PDFs.

## Immediate Next Technical Decisions

- Vite React app or Next.js app?
- Keep current repo and incrementally migrate, or create a new app beside the prototype?
- TypeScript strictness level.
- Charting library.
- Test runner.
- Local persistence format.
- Schema v3 shape.

## Recommended Next Step

Do not start with the full UI rebuild.

Start with an engine extraction sprint:

1. Create a small TypeScript engine module.
2. Move tax and benefit helpers first.
3. Add tests for known public calculator comparisons.
4. Move simulation after tax tests are stable.
5. Keep the current HTML dashboard working until the new app can replace it.

This keeps the project grounded: the math gets safer before the interface gets bigger.
