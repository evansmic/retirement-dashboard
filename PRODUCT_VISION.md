# Product Vision

## North Star

Build a Canadian-first retirement planning product with the modelling depth of advisor-grade software and the usability of a modern consumer planning app.

The product should help households answer:

- Can I retire, and when?
- How much can I safely spend?
- What happens if markets, inflation, taxes, health, housing, or family circumstances change?
- Which decisions matter most: CPP timing, RRSP/RRIF drawdown, TFSA use, pension choices, downsizing, working longer, or spending flexibility?
- What trade-offs am I making between lifestyle, risk, tax, and estate value?

The current dashboard is the modelling prototype. The long-term product should become a scenario-driven planning workspace similar in ambition to ProjectionLab, but focused deeply on Canadian retirement rules and plain-language interpretation.

The product direction is **consumer-first and local-first**. It should feel like software a Canadian household can trust with sensitive financial questions without first creating an account, uploading private details, or accepting that cloud storage is the default business model.

## Target Users

Primary:

- Canadian DIY retirement planners.
- Late-career individuals and couples within 5-15 years of retirement.
- Early retirees testing drawdown and benefit timing decisions.

Secondary:

- Fee-only planners who want a transparent client-discussion tool.
- Adult children helping parents understand retirement readiness.
- Financially curious users comparing strategies before meeting an advisor.

## Product Principles

1. **Trust before flash**
   Every important number should be explainable. Users should be able to click into a year and understand income, taxes, withdrawals, shortfalls, and balance changes.

2. **Canadian rules first**
   CPP, OAS, GIS where relevant, RRSP/RRIF, LIRA/LIF, TFSA, non-registered ACB, pension splitting, CPP sharing, OAS clawback, provincial taxes, survivor rules, and DB pensions are core, not afterthoughts.

3. **Scenario thinking over single answers**
   The product should make it easy to compare decisions: retire earlier, delay CPP, downsize, sell a cottage, work part-time, reduce spending, change provinces, or plan for survivor outcomes.

4. **Risk is not binary**
   Avoid blunt "success/failure" framing. Distinguish full-lifestyle funding, core-spending funding, portfolio depletion, estate reduction, and temporary shortfalls.

5. **Local-first privacy**
   Default to private, local planning with no required account. Plans should be usable through browser storage, local files, and portable exports before any cloud feature exists.

6. **Beginner-friendly, expert-capable**
   Offer guided setup for new users and advanced controls for people who want to tune assumptions, taxes, account order, and scenarios.

7. **Monetization must respect privacy**
   The paid path should not require accounts by default. Accounts are optional infrastructure for sync, license recovery, collaboration, or advisor sharing, not a prerequisite for ordinary household planning.

8. **Evidence over confidence theatre**
   The product should show validation status, methodology notes, known limitations, and benchmark exports plainly. Trust is earned through inspectable calculations, not through overly certain verdicts.

## Product Model

The preferred business model is local-first commercial software with a generous public/free path:

- Free public planner for basic Canadian retirement exploration.
- Optional one-time purchase or local license unlock for advanced planning features.
- Optional paid add-ons for deeper validation exports, expanded scenario tooling, more provinces, advanced tax strategy comparisons, polished reports, or implementation playbooks.
- Optional account only for cloud sync, license recovery, sharing, advisor collaboration, or multi-device continuity.
- No account required for the core planner, local save/load, import/export, or anonymous trial.

This keeps privacy as a product advantage rather than a marketing claim. The product can still make money, but the default user journey should be: open the planner, model locally, export locally, pay locally if the value is clear.

Potential paid tiers should be designed around capability, not data capture:

- **Free**: local planning, core Ontario engine, examples, basic scenario comparison, validation-visible outputs.
- **Plus**: named local plans, richer scenario builder, advanced stress tests, flexible-spending / guardrail modes, polished PDF/report exports, expanded validation exports, and practical implementation packages.
- **Pro / advisor**: client-ready reports, multi-household workspace, white-labeling, collaboration, and optional encrypted sync.

Accounts may be useful later, but they should remain optional and explainable. If a user never wants cloud sync or sharing, the product should still be worth using and worth paying for.

## Core Product Capabilities

### Planning Workspace

- Guided intake and editable plan summary.
- Household planning for singles and couples.
- Named plans and named scenarios.
- Local save/load.
- Export/import `.plan.json`.
- Shareable read-only plan links or reports, if privacy model permits.

### Scenario Builder

Users should be able to create scenarios without editing code:

- Retire earlier/later.
- Work part-time for a period.
- Delay CPP/OAS.
- Change spending by phase.
- Add one-time expenses.
- Downsize or sell property.
- Add inheritance or gifts.
- Move provinces.
- Change return/inflation assumptions.
- Model first death and survivor income.
- Model major health or care costs.

### Results and Interpretation

- Income stack by year.
- Account balances by account type.
- Taxes and OAS clawback.
- Spending funded vs desired spending.
- Estate value.
- First shortfall year and magnitude.
- Portfolio depletion year.
- Monte Carlo fan chart.
- Historical stress tests.
- Plain-language interpretation with "why this happened."
- Validation/export status for the active plan and engine version.
- Known limitations surfaced near affected outputs.

### Advanced Features To Consider

- Flexible spending / guardrail Monte Carlo.
- Core vs discretionary spending categories.
- Implementation package: account-by-account withdrawal instructions, tax/benefit checkpoints, and guardrail thresholds/actions.
- Tax-aware withdrawal optimiser.
- CPP/OAS timing optimiser.
- RRSP meltdown comparison.
- Asset allocation and glide path modelling.
- Inflation shock scenarios.
- Long-term care / health spending module.
- GIS and low-income retiree support.
- Province-by-province tax engine.
- Quebec support with QPP and Quebec tax.
- Estate/deemed-disposition modelling.
- Charitable giving and bequest goals.
- Tax-loss harvesting and capital gains realization strategy.
- Pension commuted value comparison, if data is available.
- DB pension survivor option comparison.
- Home equity, HELOC, reverse mortgage, and downsizing options.
- Advisor/client mode with white-label reports.

## Differentiation

Compared with broad tools like ProjectionLab, this product should win by being:

- Canadian by default.
- Strong on tax and benefits.
- Transparent about calculations.
- Better at couples and survivor planning.
- Better at explaining risk severity, not just success probability.
- Privacy-preserving and local-first.
- Useful without an account.
- Monetizable without turning user data into the product.

Compared with advisor tools like Snap Projections, Adviice, RazorPlan, or NaviPlan, this product should win by being:

- Easier for consumers.
- More transparent.
- Cheaper for households, with a free public path.
- Better for self-serve scenario exploration.
- Available without handing personal data to an advisor platform.

## Near-Term Product Goal

Before building a large app, make the current prototype trustworthy:

1. Fix known tax accuracy issues.
2. Clarify Monte Carlo and stress-test language.
3. Add better validation baselines.
4. Extract the engine from the HTML.
5. Define the next-generation plan schema.

## Sprint 0 — Trust And Engine Readiness

Before rebuilding the UI, run a trust-focused Sprint 0. The outcome should be a planner that is easier to audit, easier to benchmark, and less likely to overstate confidence.

### Tax Accuracy

- Fix or prove pension-income-credit eligibility logic for RRSP/RRIF/LIF/DB income.
- Add focused tests for federal and Ontario age, pension, BPA, surtax, Health Premium, OAS clawback, and pension splitting behaviour.
- Add fixtures around ages 64-72, because CPP/OAS starts, RRIF conversion, pension credits, and OAS clawback all collide there.
- Record tax-year assumptions and hard-coded 2026 values in a single visible methodology note.

### Risk Language

- Rename or qualify "probability of success" so users understand what it measures.
- Distinguish full-lifestyle funding, core-spending funding, temporary shortfall, portfolio depletion, and estate reduction.
- Add severity outputs to Monte Carlo and historical stress tests: worst shortfall, total shortfall, first shortfall year, depletion year, and recovery behaviour where applicable.
- Avoid deterministic verdicts that sound like advice.

### Validation Exports

- Expand exported baselines to include per-year account balances, withdrawals, taxable income, tax, benefits, and real/nominal flags.
- Add a simple public-comparator fixture with flat assumptions and minimal tax optimization.
- Re-run the Government of Canada calculator manually where automation failed.
- Keep paid-tool benchmarks secondary until free/public baselines are clean and reproducible.

### Engine Readiness

- Identify pure engine boundaries inside `retirement_dashboard.html`.
- Extract tax and benefit helpers before broader simulation code.
- Preserve current outputs with regression fixtures during extraction.
- Define a schema-v3 draft for plans, scenarios, people, accounts, income sources, expenses, assets, debts, events, and assumptions.
- Decide what belongs in the engine output contract before the next UI is designed around it.

### Local-First Commercial Readiness

- Define what features can be unlocked locally without accounts.
- Sketch a license model that works without uploading plan data.
- Keep `.plan.json` import/export and local named plans in the free/core product path.
- Reserve accounts for optional sync, license recovery, sharing, or advisor workflows only.

## Open Product Questions

- Which advanced capabilities belong in a paid local-first Plus tier versus the free public planner?
- What is the simplest local license mechanism that does not require user accounts or plan-data upload?
- Should optional encrypted sync be built by this product, delegated to user-owned storage, or deferred indefinitely?
- Which provinces come first after Ontario?
- How much user education belongs inside the app versus separate articles?
- Should the product optimize recommendations automatically, or mainly help users compare scenarios?
- Can an AI-assisted implementation package be offered in a way that preserves local-first privacy, makes consent explicit, and avoids crossing into regulated advice?
