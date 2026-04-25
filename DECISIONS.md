# DECISIONS.md

## Decisions already made

### Architecture

**Client-side only, two static HTML files.**
*Why*: privacy as a differentiator (no data ever leaves the device), zero hosting cost, no account infrastructure, instant iteration.
*Trade-off accepted*: no persistence across sessions without the user bookmarking the hash URL.

**Pass the intake payload via URL hash (base64 of URI-encoded JSON).**
*Why*: lets the dashboard render from any payload, makes plans shareable via link, avoids any server round-trip.
*Trade-off accepted*: long URLs; saved hashes break if schema changes (flagged as a future "schema version" task).

**Chart.js as the only external dependency.**
*Why*: mature, good-looking defaults, covers every chart type we need (stacked bar, line, fan).
*Trade-off accepted*: adds ~200KB to dashboard page weight. Fine for desktop use.

**Verification via Node probes that execute the dashboard `<script>` in a `new Function()` sandbox.**
*Why*: lets us regression-test the engine without a browser, and the engine is pure (DOM-free once we stub `window`/`document`).
*Trade-off accepted*: probes live outside the main HTML file; they're not auto-run on save.

### Engine design

**`cfg.returnRates` array override takes precedence over scalar `cfg.returnRate`.**
*Why*: this single hook enables Monte Carlo and sequence-of-returns stress tests without touching the rest of the engine. Pays for itself many times over.

**Never-shortfall sustainable-spend solver.**
*Why*: the original engine could show a user "your plan fails in year N" with no alternative. The solver always calibrates `gogo` down to a feasible level if the target can't be funded, so the dashboard always displays a sustainable plan with a banner explaining the shortfall.
*Trade-off accepted*: adds complexity; Monte Carlo success rates land at 37–45% for baseline because half of MC draws breach the calibrated mean. This is the *correct* finding, not a bug.

**Phase 5 per-spouse retirement years, not a single `retireYear`.**
*Why*: working couples commonly have staggered retirements. `D.assumptions.retireYear` remains as advisory (min of per-spouse years); `D.assumptions.planStart` (nullable) lets users model pre-retirement.
*Trade-off accepted*: the existing `calcDBPension` / CPP / OAS helpers had to gate by per-spouse `retireYear`; added `calcDBPension_Moon` helper for symmetry.

**RRSP contribution during working years treated as a tax deduction (reduces taxable salary).**
*Why*: matches real CRA treatment. TFSA/non-reg contributions are post-tax so they add to `totalNeeded` instead.
*Trade-off accepted*: MVP does not enforce CRA RRSP contribution-room limits (18% of prior-year earned income). User is trusted to supply a compliant figure.

**Spending indexed from plan start (min of `planStart` and `retireYear`), not retireYear.**
*Why*: a user quoting "$80K/yr" in today's dollars means 2026 purchasing power, not 2035 (a plan starting 2026 and retiring 2035 would have produced spending $0.84 × $80K = $67K in 2026 under the old indexing).

### UX / framing

**Hard-code 2026 tax year, document the dependency.**
*Why*: annual tax-update pass is unavoidable. Abstracting ahead of time adds complexity without obvious payoff.

**Ontario only for now.**
*Why*: scope containment. Expanding to BC/AB/QC is a separate effort; QC is the biggest lift (QPP, different tax table).

**FP Canada preset defaults over hand-picked assumptions.**
*Why*: FP Canada's Projection Assumption Guidelines are the Canadian professional standard. Using them gives users an authoritative baseline and avoids indirect editorialising.

**Genericise names (Person 1 / Person 2) in UI, keep `frank` / `moon` as engine-internal keys.**
*Why*: the tool was initially built for one couple; generalising the UI is cheap; renaming engine internals would break saved hashes and is not yet worth it.

### Scope cuts (deferred)

- CPP contribution accrual for users still working — deferred; rely on Service Canada statement.
- RRSP contribution-room enforcement — deferred; trust user inputs.
- Mobile layout — deferred; desktop-first.
- Save/load beyond hash URL — deferred.
- Multi-province — deferred.

## Open decisions (not yet resolved)

### Product direction

- **Personal tool, open-source, or commercial?** The biggest unresolved question. Until this is answered, every other roadmap decision is speculative. Options:
  - *Personal*: keep private, evolve for one household's needs. Smallest scope.
  - *Open-source*: publish as MIT-licensed, accept contributions. Low cost, builds portfolio, no revenue.
  - *Commercial consumer*: one-time purchase app or freemium web. Requires marketing, support, privacy marketing.
  - *Commercial B2B*: white-label for fee-only Canadian planners. Smaller market but higher willingness to pay.

### Schema and naming

- **Rename `frank`/`moon` → `p1`/`p2`?** Breaks saved hashes. Opinion pending.
- **Add `D.schemaVersion` now or later?** Later is cheaper; sooner enables migrations.

### Modelling

- **Enforce RRSP contribution room?** Currently trust-user.
- **Add CPP contribution accrual estimator?** Or keep relying on Service Canada statements?
- **Should Monte Carlo be on by default** (automatic "Run MC" alongside deterministic) rather than opt-in? Would make the default UX more honest about uncertainty.

### UX

- **Guided intake vs current long-form?** Adds code, improves first-time UX. Worth the effort only if non-experts will use the tool.
- **Collapsible sections as default?** Low effort, meaningful UX improvement.
- **Inline help/tooltips: worth building?**

### Technical

- **Formalise `D` as a TypeScript/JSDoc interface?** Adds tooling; makes refactors safer.
- **Integrate probes into a pre-commit hook or CI?** Would catch regressions during UI edits.
