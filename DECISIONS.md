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

### Resolved in 2026-04-25 decision session

**Product direction: hybrid — open-source (MIT) with optional commercialisation later.**
*Why*: solo developer, no appetite to run a software business; the engine is the hard and already-done part; helping more Canadians is the goal. A donate / micro-pay button (Buy Me a Coffee or Stripe Buy Button — no backend) lets users who appreciate the tool contribute. Door left open for B2B white-label if planner interest emerges unprompted.

**Add `D.schemaVersion = 1` now, with migration scaffold.**
*Why*: with public release on the horizon, saved hashes become an ABI. A version field plus a `migrate(D)` function is the escape hatch for future breaking changes. ~15 minutes of work.

**Rename `frank`/`moon` → `p1`/`p2` and clear placeholder names.**
*Why*: vestigial bespoke names look weird in a public repo; the cost of renaming only grows. Schema versioning makes the migration safe — pair the rename with a v1→v2 migration step so any existing local hashes still work.

**RRSP contribution room: soft validation, not hard enforcement.**
*Why*: faithfully modelling the real CRA rule (18% of prior earned income minus pension adjustment minus carry-forward) is days of work and still won't match a user's actual NOA. A yellow inline warning when contributions exceed 18% of salary gives non-experts a guard rail without forcing every user to dig out their NOA.

**CPP contribution accrual: defer indefinitely; rely on Service Canada.**
*Why*: Service Canada is authoritative. A parallel estimator would silently disagree with their number. Add clear instructions on the form pointing users to their Service Canada account, plus a tooltip with rough delay/early heuristics (~7%/yr) for users modelling staggered CPP timing.

**Default-on Monte Carlo with progressive rendering.**
*Why*: hiding MC behind a button nudges users toward the rosy deterministic plan — exactly the framing the consumer calculators use. Show deterministic instantly, run MC in the background, replace banner with success rate when complete. "Skip stress test" toggle for the impatient.

**Long form with collapsible sections, sidebar nav, and per-section save/advance.**
*Why*: full wizard is overkill for the sophisticated-DIY audience. Long form + sidebar tree showing per-section status (empty/partial/complete) + "Save & continue" button per section gives the guidance benefit of a wizard without a navigation layer. Half-day of vanilla JS, no framework.

**Section initial state: P1/P2 expanded; Assumptions, Tax, Inheritance, Survivor, Events collapsed.**
*Why*: a first-time user should see the obvious "tell us about you and your spouse" sections and the rest as labelled drawers. Native `<details>` element is enough.

**Inline tooltips on priority fields.**
*Why*: a public tool can't assume the user knows the rules. 8–12 tooltips on fields like spousal-RRSP attribution, CPP-at-65 sourcing, DB bridge benefit, RRIF election, plan start vs retire year, real-vs-nominal toggle, and RRSP room. Highest UX-per-hour return.

**`D` typed via inline JSDoc `@typedef` block.**
*Why*: gives IDE autocomplete and refactor safety with zero build step. Preserves the "two static HTML files, click to open" pitch. Full TypeScript with a compile step is a Phase 8+ decision.

**GitHub Actions CI for probes.**
*Why*: free for public repos, ~20 lines of YAML, automatic green/red on every PR. README status badge is real signal to anyone evaluating the project. Pre-commit hook deferred unless we start pushing broken probes.

## Open decisions (still unresolved)

None as of 2026-04-25. Future decisions will be appended here.
