# TASKS.md

The 2026-04-30 product reset made the planner consumer-first, local-first, and recommended-plan-first. Sprint 0 through Sprint 3 are complete; the next sprint should package the local-first planner for a credible public launch without introducing optimizer, account, sync, or advisor-workspace scope.

## Active Sprint — Sprint 4: Launch/Productization Package

**Status:** Final release/PR pass complete as of 2026-05-01.

Goal: make the current local-first planner launch-ready as a public/free product with honest positioning, clear privacy/disclaimer language, reproducible validation, manual smoke tests, screenshot/demo assets, release hygiene, and launch-post materials.

Detailed package: [`docs/sprint_4_launch_package.md`](docs/sprint_4_launch_package.md).

### Positioning And Copy

- [x] **S4-01 — Finalize public/free positioning.** ✅ *Done 2026-05-01.* Launch promise, target user, supported scope, Ontario-only limitation, local-first privacy promise, and not-advice boundary are now explicit in README and launch materials. Recommended-plan language says the current product is recommendation-framed, not a full optimizer.
- [x] **S4-02 — Finalize README and site copy.** ✅ *Done 2026-05-01.* README now has launch-ready opening copy, current limits, privacy, free/paid direction, validation links, local run instructions, and Sprint 4 status.
- [x] **S4-03 — Finalize Free/Plus/Pro packaging notes.** ✅ *Done 2026-05-01.* README and Sprint 4 execution docs translate the Sprint 0 monetization boundary into public-safe local-first wording without implementing payment or licensing.
- [x] **S4-04 — Privacy and disclaimer copy pass.** ✅ *Done 2026-05-01.* README and launch posts consistently cover no account, local plan ownership, URL-hash behaviour, Chart.js CDN, no household-input analytics, educational-only output, and user-controlled sharing/export risks.

### Assets And Demo

- [x] **S4-05 — Capture launch screenshots.** ✅ *Done 2026-05-01.* Replaced `docs/screenshot.png` with a real synthetic dashboard screenshot and added supporting launch screenshots for intake, validation, and stress diagnostics.
- [x] **S4-06 — Prepare demo script.** ✅ *Done 2026-05-01.* Added a repeatable 3-5 minute demo script in `docs/sprint_4_launch_execution.md`.

### QA, Validation, And Release

- [x] **S4-07 — Manual browser smoke-test checklist.** ✅ *Pre-release complete 2026-05-01.* Verified local/static load, file-path load, first-open copy, all bundled presets, blank-field validation, valid dashboard load, recommended-plan framing, charts, stress diagnostics, year-by-year table expansion, real/nominal toggle, print button presence, accountless core flow, and current narrow-viewport content visibility. Local file round-trip, malformed file rejection, unsupported file rejection, single-person handling, couple handling, plan naming, and edit round-trip are covered by probes. Human OS file-picker and dedicated device-size passes are deferred to the final release/PR pass.
- [x] **S4-08 — Validation/comparator checklist.** ✅ *Done 2026-05-01.* Confirmed baseline exports are current/unchanged for docs-only Sprint 4 work, `public-comparator-single` is present in the baseline export, README links methodology/comparator notes, and known validation gaps are visible.
- [x] **S4-09 — GitHub/CI checklist.** ✅ *Final release pass complete 2026-05-01.* Confirmed local canonical suite passes **513/513**, remote GitHub Actions probe workflow is green on pushed `main`, restored README CI badge, added `.github/ISSUE_TEMPLATE/bug_report.md` with private-data warning, updated `.gitignore` for `*.plan.json`, drafted repo description/topics, and scanned for local `.plan.json` files.
- [x] **S4-10 — Release checklist.** ✅ *Final release pass complete 2026-05-01.* Release gate exists in `docs/sprint_4_launch_execution.md`; screenshot, disclaimer, privacy copy, known limits, static local/localhost load, validation status, launch posts, feedback guidance, rollback/fix-forward rule, schema v2 boundary, fresh **513/513** probe result, release tag/date, CI status, and release notes/PR summary are recorded.

### Launch Prep

- [x] **S4-11 — Launch-post drafts.** ✅ *Done 2026-05-01.* Added launch drafts for r/PersonalFinanceCanada, Hacker News, LinkedIn, and a short personal/site post in `docs/launch_posts.md`.
- [x] **S4-12 — Feedback intake and triage loop.** ✅ *Done 2026-05-01.* Added public-feedback guidance, safe bug-report guidance, labels, hotfix criteria, and deferral rules in `docs/launch_posts.md`.
- [x] **S4-13 — Explicit non-shipping list.** ✅ *Done 2026-05-01.* Non-shipping list is explicit in `docs/sprint_4_launch_package.md`, `docs/sprint_4_launch_execution.md`, README limits, roadmap, and launch posts.

### Definition Of Done

- README/site/app copy accurately describes the product as local-first, Ontario-only, 2026-tax-year, educational, and accountless for core use.
- Launch screenshots and demo script use synthetic/preset data only.
- Manual browser smoke-test checklist is complete and any launch-blocking issues are fixed or explicitly deferred.
- Validation/comparator notes are current enough for launch and known limitations are visible.
- Canonical probes pass before release; no runtime schema bump occurs.
- GitHub/CI/release checklist is complete.
- Launch posts and feedback triage instructions are ready.
- Full optimizer, sync, account system, advisor workspace, and schema v3 migration remain deferred.

## Completed Sprints

### Sprint 3 — Local-First Planning Workspace

**Complete 2026-05-01.** Canonical suite: **498/498**. Added local `.plan.json` save/load, plan naming, guided form navigation, critical blank-field validation, recommended-plan framing, and local-file privacy copy without adding accounts or changing runtime schema.

### Sprint 0 — Trust And Engine Readiness

**Complete 2026-05-01.** Canonical suite: **478/478**.

- [x] **S0-01 to S0-03 — Tax accuracy.** Fixed pension-income-credit eligibility, added age 64-72 tax/benefit fixtures, and documented 2026 federal/Ontario methodology.
- [x] **S0-04 to S0-06 — Risk language and stress severity.** Reframed success metrics as full-spending-funded, added shortfall/depletion/core-coverage severity metrics, and removed advice-like risk verdicts.
- [x] **S0-07 to S0-09 — Validation exports and public comparator.** Expanded annual baseline exports, added the `public-comparator-single` fixture, and reran the Government of Canada public calculator comparison.
- [x] **S0-10 to S0-12 — Engine readiness.** Added `docs/engine_boundary_map.md`, extracted tax/benefit helpers into `engine/tax_benefit_helpers.js`, and drafted `docs/schema_v3_output_contract.md`.
- [x] **S0-13 to S0-15 — Local-first commercial readiness.** Added `docs/local_monetization_sketch.md`, `docs/account_boundary_decision.md`, and `docs/license_privacy_threat_model.md`.

### Sprint 1 — Foundation

**Complete 2026-04-27.** Made the repo technically publishable: MIT license, disclaimer, schema migration scaffold, `p1`/`p2` rename, blank form with example presets, inline JSDoc schema notes, probe CI, and public README polish.

### Sprint 2 — UX Polish

**Complete 2026-04-28.** Added collapsible form sections, priority-field tooltips, dashboard-to-form round trip, RRSP contribution-room warning, stronger CPP help text, and default-on progressive Monte Carlo.

## Backlog

### Near-Term Candidates After Sprint 4

- **Engine extraction continuation.** Move pension splitting and `netAfterTaxSplit()` after the strategy boundary is clear, then parameterize `runSimulation(plan, cfg, options)` so it no longer reads global `D`.
- **Recommended-plan optimizer.** Search CPP/OAS timing, withdrawal order, pension split/share settings, RRSP/RRIF/LIF drawdown, guardrails, and estate trade-offs before presenting one recommended household plan.
- **Launch feedback and hotfixes.** Triage public feedback after Sprint 4, fix launch-blocking issues, and avoid broad feature creep while the first public users test the product.

### Product Backlog

- Real-mode header sentence refresh.
- Working-year badge in the year-by-year detail table.
- Salary chart tooltip explaining gross pre-tax salary.
- Print/PDF two-page report polish.
- Drilldown modal on year-click explaining line items.
- Flexible-spending Monte Carlo.
- Guardrail withdrawal mode.
- Implementation package / action plan.
- Plan comparison for two saved local plans.
- Multi-province support: BC and Alberta first; Quebec is larger scope because of QPP and distinct tax.
- French translation for the Quebec market.
- "What if I work N more years?" slider.
- RDSP / DTC support if relevant.
- Tax-loss-harvesting modelling in non-registered accounts.
- Annual 2027 tax-update pass.
