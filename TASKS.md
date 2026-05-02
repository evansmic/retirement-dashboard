# TASKS.md

The 2026-04-30 product reset made the planner consumer-first, local-first, and recommended-plan-first. Sprint 0 through Sprint 4 are complete. Sprint 5 starts the React UI/navigation migration while preserving the stable local-first static app as the fallback.

## Active Sprint — Sprint 5: UI / Navigation Redesign Discovery

**Status:** Hybrid navigation selected and route/state shell started 2026-05-01. UI gate is open because the React preview has v2 `.plan.json` adapters and an extracted simulation module behind parity probes.

Goal: design and then implement the first guided-intake/navigation slice for the React app without changing persisted runtime schema, breaking the static release fallback, or adding accounts/cloud/full optimizer scope.

Discovery doc: [`docs/sprint_5_ui_navigation_discovery.md`](docs/sprint_5_ui_navigation_discovery.md).

### Discovery And Scope

- [x] **S5-01 — Discovery doc and screen map.** ✅ *Seeded 2026-05-01.* Created the Sprint 5 UI/navigation discovery doc with user jobs, workspace split, candidate navigation models, screen map, file model, real estate/assets model, result hierarchy, mobile/desktop stance, non-shipping list, candidate tickets, and open decisions.
- [x] **S5-02 — Choose initial navigation model.** ✅ *Done 2026-05-01.* Selected the hybrid model: guided setup first, then a persistent workspace shell with Start, Guided Intake, Review, and Results Handoff.
- [x] **S5-03 — Resolve Sprint 5 real estate scope.** ✅ *Done 2026-05-01.* Sprint 5 will capture primary residence/downsize only where it maps to existing v2 fields. Second/vacation property and richer asset records are deferred until a scoped schema update so future asset/property needs can be handled together.
- [x] **S5-04 — Define guided-intake validation rules.** ✅ *Done 2026-05-01.* Blocking issues are limited to incoherent or unsafe-to-run values; advisory completeness issues appear as warnings and do not block result generation.
- [ ] **S5-05 — Define local file state UX.** Current plan name, import errors, dirty state, last exported time, and local `.plan.json` save/load behavior.

### Candidate Implementation Tickets

- [x] **S5-06 — Guided intake route shell.** ✅ *Initial shell done 2026-05-01.* Added Start, Intake, Review, and Results Handoff views inside the React preview with a persistent workspace sidebar and guided step rail.
- [x] **S5-07 — Intake state model.** ✅ *Initial model done 2026-05-01.* Added reducer-backed local plan state, import label, dirty state, export timestamp, active view, and active intake step.
- [ ] **S5-08 — Household step.** Build single/couple handling with true inactive Person 2 behavior.
- [ ] **S5-09 — Income step.** Capture salary, DB, CPP, OAS, and survivor fields from v2.
- [ ] **S5-10 — Accounts step.** Capture RRSP/LIRA/LIF/TFSA/non-reg/cash wedge fields from v2.
- [ ] **S5-11 — Real estate and debts step.** Add primary residence/downsize mapping and debt entry; do not collect second/vacation property until scoped schema support exists.
- [ ] **S5-12 — Spending and events step.** Capture spending phases, one-offs, and inheritance goal.
- [ ] **S5-13 — Assumptions step.** Capture plan years, rates, withdrawal order, CPP sharing, RRIF election, and spousal RRSP fields.
- [ ] **S5-14 — Review and handoff.** Show summary, validation issues, save `.plan.json`, run extracted engine preview, and open stable dashboard.
- [ ] **S5-15 — Browser smoke pass.** Test new guided intake with Larry, a couple preset, malformed file import, and single-person blank Person 2 behavior.

### Definition Of Done

- Sprint 5 navigation model is chosen and documented.
- Guided intake route/state architecture is implemented in React preview.
- `.plan.json` v2 import/export remains compatible.
- Runtime dashboard schema remains `SCHEMA_VERSION = 2`.
- Static `index.html` and `retirement_dashboard.html` remain available as fallback.
- Real estate fields do not silently persist unsupported second-property data.
- Single-person plans keep Person 2 truly inactive/blank.
- Canonical probes pass and no private `.plan.json` files are committed.

## Completed Sprints

### Sprint 4: Launch/Productization Package

**Complete 2026-05-01.** Final release/PR pass complete. Release package: [`docs/sprint_4_launch_package.md`](docs/sprint_4_launch_package.md). Execution record: [`docs/sprint_4_launch_execution.md`](docs/sprint_4_launch_execution.md).

- [x] Public/free positioning, README/site copy, privacy/disclaimer copy, Free/Plus/Pro local-first packaging notes.
- [x] Launch screenshots and demo script.
- [x] Manual smoke-test checklist, validation/comparator checklist, GitHub/CI/release checklist.
- [x] Launch-post drafts, feedback triage loop, explicit non-shipping list.
- [x] Runtime dashboard `SCHEMA_VERSION = 2`; no optimizer, sync, account system, advisor workspace, or schema v3 migration shipped.

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

- **Engine extraction continuation.** Continue moving extracted simulation code toward native TypeScript/ESM and remove the remaining dashboard-source ownership.
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
