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
*Trade-off accepted*: the existing `calcDBPension` / CPP / OAS helpers had to gate by per-spouse `retireYear`; added `calcDBPension_P2` helper for symmetry (renamed from `calcDBPension_Moon` in Sprint 1 #47–#49).

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
*Superseded 2026-04-26 by Sprint 1 #47–#49.* Once schema versioning was in place (#46), the rename became safe — `MIGRATIONS[1]` lifts legacy `frank`/`moon` hashes forward to `p1`/`p2`. Engine, intake form, and probes all use the generic keys now.

**Blank default + named example presets, instead of an auto-loaded sample household.**
*Why* (resolved 2026-04-27 by Sprint 1 #58; expanded 2026-04-30 by Sprint 0 S0-08): with public release on the horizon, opening the dashboard to a fully-populated "Person 1 / Person 2" stranger's plan was misleading — it implied the tool already knew something about the visitor. The new behaviour: no payload + no `?example=<slug>` → a landing card explaining the tool and offering representative Canadian (non-Quebec) archetypes — `diy-couple`, `db-pension-couple`, `single-late-career`, `public-comparator-single`, `retired-traditional`, `fire-couple`. Each archetype is a function in `PRESETS` returning a fully-populated D; `PRESET_META` carries the user-facing label/sub-label so the engine and UI stay in lock-step. Slugs are stable, so `?example=<slug>` URLs are bookmarkable.
*Source rigour*: every headline figure cites a public Canadian benchmark — Service Canada CPP/OAS Apr–Jun 2026, FP Canada Projection Assumption Guidelines 2026, HOOPP / OTPP plan formulas, StatCan retirement income survey. Inline comments in `PRESETS` link each derivation.
*Trade-off accepted*: the structurally-blank D is a clone of `diy-couple` with names cleared and `_isBlank: true` — the engine still computes scenarios under it (then the UI hides them). A truly empty D would have required defensive guards throughout the engine; the cloned-stub approach is one flag and zero engine changes. `getDefaultD()` now returns the `diy-couple` preset for backward-compat with probes.

### Scope cuts (deferred)

- CPP contribution accrual for users still working — deferred; rely on Service Canada statement.
- RRSP contribution-room enforcement — deferred; trust user inputs.
- Mobile layout — deferred; desktop-first.
- Save/load beyond hash URL — deferred.
- Multi-province — deferred.

### Resolved in 2026-04-25 decision session

**Product direction: hybrid — open-source (MIT) with optional commercialisation later.**
*Why*: solo developer, no appetite to run a software business; the engine is the hard and already-done part; helping more Canadians is the goal. A donate / micro-pay button (Buy Me a Coffee or Stripe Buy Button — no backend) lets users who appreciate the tool contribute. Door left open for B2B white-label if planner interest emerges unprompted.
*Updated 2026-04-30*: superseded by the consumer-first local-first product direction below. Open-source/free-public roots remain compatible with the plan, but the preferred monetization path is now local-first paid capability rather than donate-first.

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

### Resolved in 2026-04-30 product reset

**Consumer-first product direction.**
*Why*: the most differentiated opportunity is a Canadian household planner that feels trustworthy without requiring an advisor relationship. Advisor workflows can come later, but the product should first make sophisticated planning usable by consumers.
*Trade-off accepted*: some advisor-only conveniences, such as multi-client workspaces and white-label reports, stay behind the consumer trust and engine-readiness work.

**Local-first monetization.**
*Why*: privacy is a core differentiator. Monetization should reinforce that promise, not undermine it with mandatory cloud accounts or uploaded plan data.
*Decision*: core planning, recommended-plan-first results, local save/load, import/export, opening existing local plan files, and anonymous trial should not require an account. Paid features can unlock locally through a one-time purchase or local license where feasible. Accounts are optional for encrypted sync, license recovery, purchase history, sharing, adult-child/advisor collaboration, multi-device continuity, or Pro team administration. Free/Plus/Pro boundaries are sketched in `docs/local_monetization_sketch.md`.
*Trade-off accepted*: local licensing and accountless purchase flows are more operationally awkward than SaaS subscriptions, but they align better with the product's trust story.

**Account boundary.**
*Why*: account prompts can quietly turn a local-first product into SaaS by habit. The product needs a clear rule before sync, sharing, license recovery, or advisor workflows are designed.
*Decision*: accounts are optional infrastructure only. They may support encrypted sync, license recovery, purchase history, sharing, advisor/adult-child collaboration, multi-device continuity, and Pro team administration. They must not be required for core planning, recommended results, anonymous trial, local save/load, `.plan.json` import/export, opening existing local plan files, basic validation/methodology visibility, or local paid unlock where feasible. See `docs/account_boundary_decision.md`.
*Trade-off accepted*: some recovery and cross-device conveniences may be less seamless for accountless users, but the default planning path remains private and local.

**License and privacy boundary.**
*Why*: local paid unlocks can still create privacy risk if license checks, analytics, support exports, AI reports, or optional sync collect plan data indirectly.
*Decision*: a local license check may store only minimum unlock metadata such as license key/token, tier, expiry/maintenance date, receipt ID, last successful verification, non-sensitive install/device identifier, optional purchase email, and verification keys/signatures. It must not upload plan files, URL hashes, decoded household payloads, account balances, income, spending, debts, pension/CPP/OAS values, tax/result rows, report contents, or support/debug logs unless the user explicitly exports or shares them. Local `.plan.json` files remain usable without an account and should open even when a paid license is expired, offline, or unrecovered. See `docs/license_privacy_threat_model.md`.
*Trade-off accepted*: anti-fraud controls are intentionally limited. The privacy promise is more important than perfect license enforcement.

**Sprint 0 before UI rebuild.**
*Why*: the next limiting factor is trust, not layout. The free/public validation run found strong accumulation alignment but also a real tax-credit question and inconsistent sustainability comparators.
*Decision*: prioritize tax accuracy, Monte Carlo/stress-test language, validation exports, and engine-readiness before rebuilding the UI or adding launch monetization.
*Trade-off accepted*: the visible app may improve more slowly in the short term, but the foundation becomes safer for a ProjectionLab-scale product.

**Optimized plan first; detailed scenario explorer second.**
*Why*: the prototype exposes five detailed deterministic scenarios side by side, which is useful for engine development but too much cognitive load for a consumer retirement product. Most households want to know what plan the engine recommends, not choose among Baseline, Meltdown, 0% Return, Survivor, and Max Spend tabs as if they are equally actionable plans.
*Decision*: the next product should present one recommended household plan by default: optimized CPP/OAS timing, withdrawal strategy, RRSP/RRIF/LIF/TFSA/non-reg order, pension splitting/CPP sharing where relevant, spending guardrails, and estate trade-offs. Stress cases remain visible as risk evidence, but not as competing plans.
*Monetization implication*: detailed side-by-side scenarios, custom scenario authoring, advanced stress tests, estate variants, early-death cases, and lower-return comparison views are strong Plus/Pro features. The free/core product should still show a basic stress summary so the recommended plan is not presented as certainty.

## Open decisions (still unresolved)

- Exact pricing and purchase model for Plus: one-time purchase, annual maintenance, paid major-version upgrades, or a mix.
- Whether optional sync should be first-party encrypted sync, user-owned storage, or deferred.
- Whether AI-assisted report drafting can be offered locally or only through explicit opt-in upload.
