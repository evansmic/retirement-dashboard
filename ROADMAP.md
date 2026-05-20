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

Sprint 58 is complete. Tax-aware drawdown work now has all-example guardrail coverage for the hidden comparison, without product-facing execution or saved output.

Completed Sprint 58 slices:

- Added hidden-comparison guardrail rows for hidden-only, review-only, funding, and saved-plan boundaries.
- Ran every built-in example through the hidden comparison path.
- Confirmed hidden comparison output stays review-only, unsaved, and free of account-instruction language.
- Kept the hidden runner out of UI and Overview.
- Preserved current withdrawal order and empty annual overrides.
- Confirmed prototype, draft, sandbox, readiness, hidden comparison, mocked payload, and comparison output remain runtime-only and unsaved.
- Kept Sprint 58 as matrix guardrail work, not account-by-account drawdown instructions.

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
12. **Sprint 35 — Results trust and readiness.** Tighten the first Results answer, spending estimate language, top actions, examples, save/print copy, and Overview density before optimizer extraction.
13. **Sprint 35.5 — Feedback gate cleanup.** Address tester feedback: internal copy nits, neutral tax wording, report handoff expectations, example parity, and spending-estimate humility.
14. **Sprint 36 — Optimizer contract and engine safety.** Add the non-executing optimizer contract, edge-case safety, example working-copy trust, and label drift cleanup before optimizer execution.
15. **Sprint 37 — Bounded optimizer execution.** Run a limited local candidate search using existing engine output and review-oriented copy.
16. **Sprint 38 — Optimizer explanation depth.** Deepen "why this option" explanations before widening the search space.
17. **Sprint 39 — Optimizer eligibility refinement.** Tighten when each lever is allowed before adding more optimizer behavior.
18. **Sprint 40 — Bounded optimizer search expansion.** Add pension-splitting as the first narrow new optimizer candidate family.
19. **Sprint 41 — Pension-splitting evidence rows.** Explain what changed when pension splitting is tested before adding more optimizer behavior.
20. **Sprint 42 — Optimizer tax-driver explanations.** Explain why the selected optimizer option moved before adding more optimizer behavior.
21. **Sprint 43 — Optimizer guardrails and timing integrity.** Harden candidate eligibility before adding broader optimizer behavior.
22. **Sprint 44 — Optimizer recommendation discipline.** Prevent disruptive options from being highlighted solely because they improve the projection.
23. **Sprint 45 — Spending guardrail stress.** Add review-only nearby spending stress checks before tax-aware drawdown work.
24. **Sprint 46 — Tax-aware drawdown contract readiness.** Add review-only drawdown evidence before tax-aware drawdown execution.
25. **Sprint 47 — Example-plan optimizer readiness matrix.** Test all bundled examples before adding another optimizer behavior.
26. **Sprint 48 — CPP sharing review candidate.** Add CPP sharing as one narrow review-only bounded optimizer behavior for eligible couples.
27. **Sprint 49 — Home equity reliance and estate guardrails.** Check reliance on entered home-sale cash and protect explicit estate goals before broader optimizer work.
28. **Sprint 50 — Plan options clarity and candidate discipline.** Group and explain the growing bounded optimizer set before adding another behavior.
29. **Sprint 51 — Benefit timing bridge-year clarity.** Refine CPP/OAS delay eligibility and bridge-year explanation before adding another behavior.
30. **Sprint 52 — Tax-aware drawdown prototype evidence.** Add evidence-only review windows before executing annual drawdown overrides.
31. **Sprint 53 — Bounded drawdown execution readiness.** Add runtime-only draft checks, validation, and test-only comparison scaffolding before real annual override execution.
32. **Sprint 54 — Drawdown sandbox gate.** Queue one future drawdown draft check for later comparison without running annual overrides.
33. **Sprint 55 — Mocked drawdown sandbox comparison.** Score the queued sandbox draft against mocked output only, behind test-only guardrails.
34. **Sprint 56 — Drawdown comparison readiness review.** Summarize whether the current plan is ready for a later comparison without running one.
35. **Sprint 57 — Hidden drawdown comparison candidate.** Run one hidden registered-timing comparison as review-only evidence.
36. **Sprint 58 — Hidden drawdown example matrix.** Run all examples through the hidden comparison and lock guardrails before UI exposure.
37. **Sprint 59+ — Drawdown comparison evidence surface.** Consider exposing hidden comparison evidence in Details only after example-matrix guardrails hold.

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
- **Sprint 32 — Overview simplification.** Complete 2026-05-16. Moved audit-style diagnostics from Overview into Details so the first Results page stays calm and decision-oriented.
- **Sprint 33 — Save & print polish.** Complete 2026-05-16. Split editable plan save from printable report actions in the consumer UI while preserving local file and report behavior.
- **Sprint 34 — DB survivor pension inputs and survivor cash-flow accuracy.** Complete 2026-05-16. Added per-person DB survivor continuation assumptions and used them in survivor reruns while preserving old-plan fallback behavior.
- **Sprint 35 — Results trust and readiness.** Complete 2026-05-16. Strengthened the first Results answer, reframed spending estimates, added prioritized top actions, and kept dense diagnostics in Details/Risks before optimizer execution.
- **Sprint 35.5 — Feedback gate cleanup.** Complete 2026-05-17. Neutralized visible copy, clarified printable-report expectations, added example parity coverage, and guarded spending estimate humility before optimizer extraction.
- **Sprint 36 — Optimizer contract and engine safety.** Complete 2026-05-17. Added a non-executing optimizer contract, future annual withdrawal override shape, defensive safe-run behavior, example working-copy clarity, and label drift cleanup.
- **Sprint 37 — Bounded optimizer execution.** Complete 2026-05-17. Added limited local candidate search, review scoring, and consumer-facing plan options without persisting optimizer output.
- **Sprint 38 — Optimizer explanation depth.** Complete 2026-05-17. Added why/trade-off/verify explanations for bounded optimizer output while keeping candidate generation unchanged.
- **Sprint 39 — Optimizer eligibility refinement.** Complete 2026-05-17. Added included/skipped/review-first eligibility notes and gates for spending, work timing, benefit timing, withdrawal order, and survivor setup.
- **Sprint 40 — Bounded optimizer search expansion.** Complete 2026-05-18. Added one pension-splitting candidate family with eligibility gates and review copy.
- **Sprint 41 — Pension-splitting evidence rows.** Complete 2026-05-18. Added evidence rows for tax, OAS recovery tax, and projected money-left movement against the current plan.
- **Sprint 42 — Optimizer tax-driver explanations.** Complete 2026-05-18. Added driver rows for funded years, tax, OAS recovery tax, and projected money left.
- **Sprint 43 — Optimizer guardrails and timing integrity.** Complete 2026-05-18. Tightened candidate eligibility for CPP/OAS delay, work timing, pension splitting, and withdrawal-order checks before broader optimizer behavior.
- **Sprint 44 — Optimizer recommendation discipline.** Complete 2026-05-18. Added a suggestion gate so disruptive options stay review-only unless they materially repair a visible funding problem.
- **Sprint 45 — Spending guardrail stress.** Complete 2026-05-18. Added runtime-only nearby spending stress checks and Details evidence without adding a spending optimizer.
- **Sprint 46 — Tax-aware drawdown contract readiness.** Complete 2026-05-18. Added Details-only drawdown readiness evidence and contract tests while keeping withdrawal order unchanged and annual overrides empty.
- **Sprint 47 — Example-plan optimizer readiness matrix.** Complete 2026-05-18. Added all-example readiness coverage for Results preview, spending stress, drawdown readiness, bounded optimizer suggestion discipline, copy posture, and persistence guardrails.
- **Sprint 48 — CPP sharing review candidate.** Complete 2026-05-18. Added one review-only CPP sharing candidate for eligible couples, with eligibility notes and evidence rows while preserving saved plan and engine schemas.
- **Sprint 49 — Home equity reliance and estate guardrails.** Complete 2026-05-18. Added evidence-only home-sale reliance checks and estate-goal suggestion guardrails while preserving saved plan and engine schemas.
- **Sprint 50 — Plan options clarity and candidate discipline.** Complete 2026-05-19. Added option groups and Details explanation copy so the bounded optimizer remains readable without adding new behavior.
- **Sprint 51 — Benefit timing bridge-year clarity.** Complete 2026-05-19. Refined CPP/OAS delay eligibility notes and added bridge-year evidence while preserving the existing bounded candidate set.
- **Sprint 52 — Tax-aware drawdown prototype evidence.** Complete 2026-05-19. Added Details-only review-window evidence for future tax-aware drawdown work while keeping current withdrawal order and annual overrides unchanged.
- **Sprint 53 — Bounded drawdown execution readiness.** Complete 2026-05-19. Added runtime-only future drawdown draft checks, validation statuses, readiness blockers, and a test-only synthetic comparison harness without changing saved plans or engine output.
- **Sprint 54 — Drawdown sandbox gate.** Complete 2026-05-19. Added a Details-only future sandbox gate that queues one validated drawdown draft check for later comparison while keeping annual overrides unexecuted and unsaved.
- **Sprint 55 — Mocked drawdown sandbox comparison.** Complete 2026-05-19. Added a test-only gate-aware comparison runner for queued sandbox drafts, with mocked payload validation and persistence guardrails.
- **Sprint 56 — Drawdown comparison readiness review.** Complete 2026-05-19. Added a Details-only readiness review for later drawdown comparison using draft, sandbox, account, and household guardrail evidence.
- **Sprint 57 — Hidden drawdown comparison candidate.** Complete 2026-05-19. Added one hidden registered-timing comparison candidate that returns review-only evidence while staying out of UI and saved plan files.
- **Sprint 58 — Hidden drawdown example matrix.** Complete 2026-05-19. Added all-example guardrail coverage for the hidden drawdown comparison before any Details evidence surface.
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
