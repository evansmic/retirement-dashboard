# ROADMAP.md

## Direction

The product is a consumer-first, local-first Canadian retirement planner. The default experience should become recommended-plan-first: one clear household plan, with stress tests and alternatives as supporting diagnostics rather than equal competing tabs.

The strategic direction is now sharper: build the **Canadian retirement decision engine**. Compared with broad tools like ProjectionLab, this product should win by being narrower, more Canada-specific, more explainable, and more decision-oriented.

Reference direction doc: [`docs/canadian_retirement_decision_engine.md`](docs/canadian_retirement_decision_engine.md).

Accounts remain optional infrastructure for sync, license recovery, sharing, advisor collaboration, or multi-device continuity. Core planning, local save/load, import/export, anonymous trial, and local paid unlock where feasible should remain accountless.

## Completed Milestones

### Engine And Modelling

- **Phase 1 — Core engine correctness.** Pre-65 RRSP draws, taxable-income target solver, capital gains on non-registered draws, OAS clawback after pension split, and zero-shortfall verification.
- **Phase 2 — Canadian household rules.** Survivor rollover, joint non-registered ownership, annual taxable distributions, unified indexation, BPA phase-out, Ontario Health Premium, LIF max draws, mortgage payoff, and LOC amortisation.
- **Phase 3 — Strategy and UX.** Per-year withdrawal-order overrides, cash wedge, younger-spouse RRIF election, spousal-RRSP attribution, CPP sharing, principal residence/downsize events, one-offs, bequest lines, real/nominal toggle, and shortfall/depletion KPIs.
- **Phase 4 — Stress testing and reporting.** Monte Carlo, historical sequence stress, full-spending-funded metric, PDF/print export, and FP Canada guideline defaults.
- **Phase 5 — Working couples.** Per-spouse retirement years, salary/raises/contributions, dual DB pensions, and working-year UI output.

### Productization Sprints

- **Sprint 1 — Foundation, complete 2026-04-27.** MIT license, disclaimer, schema migrations, `p1`/`p2` rename, blank form with example presets, JSDoc payload notes, probe CI, and public README polish.
- **Sprint 2 — UX polish, complete 2026-04-28.** Collapsible sections, tooltips, edit-plan round trip, RRSP room warning, CPP help text, and default-on progressive Monte Carlo.
- **Sprint 0 — Trust and engine readiness, complete 2026-05-01.** Tax accuracy fixes, age 64-72 fixtures, methodology docs, stress severity metrics, validation exports, public-comparator rerun, engine boundary map, extracted tax/benefit helpers, schema v3 output contract, and local-first monetization/account/privacy boundaries. Canonical suite: **478/478**.
- **Sprint 3 — Local-first planning workspace, complete 2026-05-01.** Local `.plan.json` save/load, plan naming, guided section navigation, critical blank-field validation, recommended-plan framing, local-file privacy copy, and two new probes. Canonical suite: **498/498**.
- **Sprint 4 — Launch/productization package, pre-release complete 2026-05-01.** Public/free positioning, README/site copy, local-first paid/free boundaries, privacy/disclaimer language, screenshot/demo assets, manual smoke-test checklist, validation/comparator review, GitHub/CI/release checklist, launch-post drafts, and feedback triage guidance. Current canonical suite: **515/515**.
- **Sprint 5 — React guided intake migration, complete 2026-05-06.** React/Vite preview shell, local `.plan.json` open/save, guided intake steps, review, lazy-loaded extracted simulation, and stable dashboard handoff.
- **Sprint 6 — Results workspace migration, complete initial map 2026-05-07.** React results tabs for Overview, Cash Flow, Income Sources, Accounts, Taxes, Stress Tests, Assumptions, Export/Save; selector layer; smoke coverage; reconciliation diagnostics; projection path; account drawdown summary. Stable dashboard remains fallback.

Key Sprint 0 docs:

- `docs/engine_boundary_map.md`
- `docs/schema_v3_output_contract.md`
- `docs/local_monetization_sketch.md`
- `docs/account_boundary_decision.md`
- `docs/license_privacy_threat_model.md`

## Active Next Step

Sprint 31 is complete. Suggested Sprint 32 should focus on **Overview Simplification**.

Goal: keep the Overview calm after the retirement answer by moving audit-style diagnostic panels into Details/Risks, while preserving all existing evidence for users who want to inspect it.

Candidate Sprint 32 slices:

- Keep Can I retire, spending capacity, estate intent, suggested plan, top risks, scenarios, survivor impact, and next steps visible.
- Move detailed money-flow diagnostics, projection path, tax pressure timeline, and optimizer-prep panels out of the main Overview flow where possible.
- Use Details/Risks as the home for audit-style tables and deep review rows.
- Preserve selector output, saved plan format, detailed-report route, and engine behavior.
- Add focused smoke coverage so moved panels remain reachable.

## Consumer Roadmap Sequence

Near-term product work should prioritize interpretation and journey simplification before adding more modelling surface:

1. **Sprint 23 — Consumer results simplification.** Hide advanced diagnostics behind a Details path while keeping them available for deeper review.
2. **Sprint 24 — Spending capacity layer.** Answer "How much can I spend?" and identify underspending, balanced spending, tight plans, and repair amounts.
3. **Sprint 25 — Estate intent and tax efficiency.** Make estate wishes explicit and connect projected estate, registered assets, OAS clawback, giving, and later-life tax to household choices.
4. **Sprint 26 — Intake UX and help text.** Add plain guidance for CPP/OAS, DB bridge pensions, LIRA/LIF, ACB, real estate, survivor assumptions, and estate goals.
5. **Sprint 27 — Scenario choice redesign.** Reframe scenario cards as household choices with "best for" language and fewer technical deltas.
6. **Sprint 28-29 — Optimizer prep and guardrails.** Define future optimizer inputs and permissions without running optimization.
7. **Sprint 30 — React start examples and light visual alignment.** Make examples available in the modern entry and reduce the visual split between intake and Results.
8. **Sprint 31 — Consumer copy scrub.** Remove remaining runtime, legacy, stable-dashboard, schema, and bounded-preview wording from user-facing UI.
9. **Sprint 32 — Overview simplification.** Move audit-style diagnostics out of Overview and into Details/Risks so the first answer stays calm.
10. **Sprint 33 — Save & print polish.** Split Save editable plan from Open printable report and make report language fully consumer-facing.
11. **Sprint 34 — DB survivor pension modelling.** Add survivor-continuation inputs for defined-benefit pensions before optimizer execution.
12. **Sprint 35+ — Optimizer extraction and execution.** Resume optimizer contract extraction, then build bounded optimizer behavior after consumer readiness and survivor modelling are cleaner.

## Medium-Term Roadmap

- **Sprint 7 — Results clarity and decision readiness.** Turn migrated result panels into a decision layer: plan health, source reconciliation story, review checklist, tax pressure, first scenario cards, and survivor view.
- **Sprint 8 — Recommended plan pathway v0.** Select the strongest preview candidate from the current plan and three local reruns, explain why it was selected, show why alternatives did not overtake it, and keep the result runtime-only.
- **Sprint 9 — Recommended path stress and confidence.** Add a bounded confidence selector, selected-path stress context, break-risk panel, and stable dashboard detail handoff while staying runtime-only.
- **Sprint 10 — Recommended path detail drilldowns.** Make break risks selectable and show focused selected-path evidence while preserving stable dashboard detail ownership.
- **Sprint 11 — Recommended path implementation checklist.** Convert confidence, stress, and drilldown evidence into a runtime-only review checklist before users rely on the preview path.
- **Sprint 12 — React annual detail parity.** Add a first-class Annual Detail tab with full year-by-year React rows and simple view controls.
- **Sprint 13 — React results chart parity.** Add bounded chart-ready visuals for portfolio, spending/tax/shortfall, and account bucket balances without adding export/reporting scope.
- **Sprint 14 — React results polish and handoff audit.** Tighten Results workspace spacing, chart/table readability, and stable-dashboard handoff copy before adding more feature surface.
- **Sprint 15 — Entry point and handoff reliability.** Make React preview, stable intake, stable dashboard, and Vercel preview routes explicit and regression-tested.
- **Sprint 16 — React stress tests parity.** Deepen the Stress Tests tab with runtime-only baseline stress summary, evidence rows, review actions, and stable-dashboard handoff.
- **Sprint 17 — React tax detail parity.** Complete 2026-05-08. Deepened the Taxes tab with runtime-only tax story, review rows, and stable-dashboard audit handoff.
- **Sprint 18 — React account detail / drawdown parity.** Complete 2026-05-08. Made account balance and withdrawal movement easier to review in React without adding export/reporting or persisted UI state.
- **Sprint 19 — React survivor detail parity.** Complete 2026-05-14. Deepened Household Resilience with survivor story, comparison rows, and review handoffs while keeping full audit views in the stable dashboard.
- **Sprint 20 — React results readiness and save handoff polish.** Complete 2026-05-14. Added runtime-only final readiness rows and clearer Export/Save handoff without persisting result state.
- **Sprint 21 — Engine extraction scenario and survivor runner.** Complete 2026-05-14. Moved Results preview baseline, scenario, and survivor reruns behind an engine-owned runtime helper.
- **Sprint 22 — Consumer retirement answer layer.** Complete 2026-05-14. Added a first Results answer for retirement readiness, spending fit, estate intent, and next review actions while softening estate-heavy recommendations.
- **Sprint 23 — Consumer results simplification.** Complete 2026-05-14. Consolidated advanced diagnostic result pages behind a Details hub so the top-level Results journey stays consumer-focused.
- **Sprint 24 — Spending capacity layer.** Complete 2026-05-15. Added a first-pass spending capacity answer for flexible, balanced, tight, and repair-needed plans using existing scenario output.
- **Sprint 25 — Estate intent and tax efficiency.** Complete 2026-05-15. Added a first-pass estate/tax-efficiency review connecting projected estate, estate goals, OAS recovery tax, final registered assets, and survivor review prompts.
- **Sprint 26 — Intake UX and help text.** Complete 2026-05-15. Reframed guided intake language around household planning choices and added plain help for CPP/OAS, DB bridges, locked-in accounts, ACB, real estate/downsize, survivor assumptions, and estate goals.
- **Sprint 27 — Scenario choice redesign.** Complete 2026-05-15. Reframed scenario cards as household choices with best-for and trade-off copy while keeping detailed comparison tables as supporting evidence.
- **Sprint 28 — Optimizer prep and decision boundaries.** Complete 2026-05-15. Added runtime-only optimizer boundary rows for spending, retirement timing, CPP/OAS timing, withdrawal order, estate target, and downsizing without adding optimizer execution.
- **Sprint 29 — Optimizer input review and guardrails.** Complete 2026-05-15. Added runtime-only optimizer permission rows that separate can-explore levers, must-preserve wishes, and missing household decisions.
- **Sprint 30 — React start examples and light visual alignment.** Complete 2026-05-16. Added the bundled synthetic examples to the modern React start screen and lightly aligned start styling with the Results dashboard without doing a full redesign.
- **Sprint 31 — Consumer copy scrub.** Complete 2026-05-16. Replaced remaining internal implementation language in live React Results copy with consumer-facing detailed-report, money-flow, and review-step language.
- **Sprint 32 — Overview simplification.** Planned. Move diagnostic/audit panels out of Overview and into Details/Risks.
- **Sprint 33 — Save & print polish.** Planned. Split editable plan save from printable/detailed report actions.
- **Sprint 34 — DB survivor pension inputs and survivor cash-flow accuracy.** Planned before optimizer execution. Add per-person DB survivor continuation assumptions and use them in survivor reruns.
- **Sprint 35 — Optimizer contract extraction.** Planned after consumer-readiness and DB survivor modelling. Move optimizer-prep contracts toward engine-owned modules before optimizer execution.
- **Engine extraction continuation.** Continue extracting simulation and stress modules so future scenario cards and the optimizer can run against explicit plan objects instead of global `D`.
- **Recommended-plan optimizer.** Build only after the decision-readiness layer is clear. First optimizer pass should cover CPP/OAS timing, withdrawal order, pension split/share settings, meltdown/guardrail strategy, and estate trade-offs.
- **Phase 7 — Provinces.** Abstract Ontario-specific tax behind a province selector. BC and Alberta first; Quebec is larger scope due to QPP and distinct tax rules.
- **Phase 8 — Paid local-first capabilities.** Local license unlocks, Plus reports, implementation packages, richer diagnostics, and extra provinces while keeping accounts optional.
- **Phase 8b — Optimized plan and implementation guidance.** Present one recommended household plan, then generate account-by-account drawdown instructions, tax/benefit checkpoints, RRIF/LIF notes, CPP/OAS timing, and guardrail thresholds.
- **Phase 9 — Advisor mode.** Multi-household workspace, client-ready reports, white-label branding, collaboration, and optional encrypted sync. Build only after the consumer workflow is stable.

## Future Ideas

- Flexible-spending Monte Carlo.
- Guardrail withdrawal mode.
- Plan comparison for saved local plans.
- Tax-aware withdrawal-order optimizer.
- "What if I work one more year?" slider.
- Estate tax optimization at last death.
- RDSP / DTC support if relevant.
- Tax-loss-harvesting modelling in non-registered accounts.
- French translation.
- Annual tax update process for 2027 and later.
