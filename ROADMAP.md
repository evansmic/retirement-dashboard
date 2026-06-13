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

S3368-S3387 is complete. The optimizer now has an explicit schema/save decision: beta sequencing remains runtime-only, allowed saved sequencing keys are empty, and `.plan.json` files stay limited to clean editable planning inputs. Results Details shows the decision beside the continuation contract, and plan-file tests prove beta sequencing packets, continuation state, and schema/save decisions are stripped from saved files. Current remaining estimate: internal tester optimizer prototype 0 sprints, feature-complete app optimizer beta 0 sprints, and public-ready optimizer for real planning use 10-100 sprints.

Current package doc: [`docs/sprint_3368_3387_schema_and_save_decision.md`](docs/sprint_3368_3387_schema_and_save_decision.md).

S3348-S3367 is complete. The optimizer now has a compact engine-owned continuation contract that identifies beta-ready surfaces, blocked public outputs, next public-readiness packages, and the focused verification path for the current low-storage machine. Results Details shows the continuation contract so future work can continue from a manageable summary rather than the full checkpoint archive. Current remaining estimate: internal tester optimizer prototype 0 sprints, feature-complete app optimizer beta 0 sprints, and public-ready optimizer for real planning use 10-110 sprints.

Current package doc: [`docs/sprint_3348_3367_optimizer_contract_consolidation.md`](docs/sprint_3348_3367_optimizer_contract_consolidation.md).

S3328-S3347 is complete. The bounded optimizer now emits an engine-owned beta saved sequencing adapter from runtime annual account sequence review evidence, and Results Details shows the internal beta rows with allowed fields, excluded fields, quality status, and boundary copy. Feature-complete app optimizer beta is functionally present for internal saved-sequencing review, while saved schema changes, engine output schema changes for public consumers, `.plan.json` sequencing output, CSV output, report output, production UI, final annual instructions, tax-bracket wording, broad tester distribution, and public release remain blocked. Current remaining estimate: internal tester optimizer prototype 0 sprints, feature-complete app optimizer beta 0 sprints, and public-ready optimizer for real planning use 10-110 sprints.

Current package doc: [`docs/sprint_3328_3347_beta_saved_sequencing_adapter_implementation.md`](docs/sprint_3328_3347_beta_saved_sequencing_adapter_implementation.md).

S3308-S3327 is complete. The beta saved sequencing gate now treats present constraint context as preserved beta review evidence instead of an automatic blocker, while missing constraint context remains a repair target. This makes the saved sequencing implementation gate viable for the next adapter package while saved sequencing writes, CSV output, reports, production UI, final instructions, tax-bracket wording, saved schema changes, engine output schema changes, and `.plan.json` generation remain blocked. Current remaining estimate: internal tester optimizer prototype 0 sprints, feature-complete app optimizer beta 0-10 sprints, and public-ready optimizer for real planning use 10-120 sprints.

Current package doc: [`docs/sprint_3308_3327_beta_saved_sequencing_gate_repair.md`](docs/sprint_3308_3327_beta_saved_sequencing_gate_repair.md).

S3288-S3307 is complete. Results Details now includes a beta saved sequencing implementation decision gate. The gate shows implementation decision, allowed beta fields, fields needing repair, and excluded fields while saved sequencing writes, CSV output, reports, production UI, final instructions, tax-bracket wording, saved schema changes, engine output schema changes, and `.plan.json` generation remain blocked. Current remaining estimate: internal tester optimizer prototype 0 sprints, feature-complete app optimizer beta 0-10 sprints, and public-ready optimizer for real planning use 10-130 sprints.

Current package doc: [`docs/sprint_3288_3307_beta_saved_sequencing_output_implementation_decision.md`](docs/sprint_3288_3307_beta_saved_sequencing_output_implementation_decision.md).

S3268-S3287 is complete. Results Details now includes a saved sequencing output shape decision gate. The gate identifies future beta saved-shape fields, fields needing review, and excluded final instruction and tax-bracket target fields while saved sequencing, CSV output, reports, production UI, final instructions, tax-bracket wording, saved schema changes, engine output schema changes, and `.plan.json` generation remain blocked. Current remaining estimate: internal tester optimizer prototype 0 sprints, feature-complete app optimizer beta 0-20 sprints, and public-ready optimizer for real planning use 20-140 sprints.

Current package doc: [`docs/sprint_3268_3287_saved_sequencing_output_shape_decision_gate.md`](docs/sprint_3268_3287_saved_sequencing_output_shape_decision_gate.md).

S3248-S3267 is complete. Results Details now includes an annual account sequencing beta output readiness gate. The gate shows saved sequencing output, CSV sequencing output, report sequencing rows, production UI, final annual instructions, and tax-bracket wording with status, required evidence, and blocked-until copy while saved sequencing, CSV output, reports, production UI, final instructions, tax-bracket wording, saved schema changes, engine output schema changes, and `.plan.json` generation remain blocked. Current remaining estimate: internal tester optimizer prototype 0 sprints, feature-complete app optimizer beta 0-30 sprints, and public-ready optimizer for real planning use 30-150 sprints.

Current package doc: [`docs/sprint_3248_3267_runtime_annual_account_sequencing_beta_output_readiness_gate.md`](docs/sprint_3248_3267_runtime_annual_account_sequencing_beta_output_readiness_gate.md).

S3228-S3247 is complete. Runtime annual account sequence repair targets now roll up into a review-only application gate in Results Details. The gate shows whether each target can be applied from current visible evidence, needs review before applying, or is waiting for rows, with evidence-use and blocked-output copy while saved sequencing, CSV output, reports, production UI, final instructions, tax-bracket wording, saved schema changes, engine output schema changes, and `.plan.json` generation remain blocked. Current remaining estimate: internal tester optimizer prototype 0 sprints, feature-complete app optimizer beta 0-40 sprints, and public-ready optimizer for real planning use 40-160 sprints.

Current package doc: [`docs/sprint_3228_3247_runtime_annual_account_sequencing_repair_application_gate.md`](docs/sprint_3228_3247_runtime_annual_account_sequencing_repair_application_gate.md).

S3208-S3227 is complete. Runtime annual account sequence review rows now roll up into visible repair target buckets in Results Details. The repair targeting shows source evidence, account-order evidence, tax context, constraint context, and output-boundary buckets with row counts, priority labels, and next-step copy while saved sequencing, CSV output, reports, production UI, final instructions, tax-bracket wording, saved schema changes, engine output schema changes, and `.plan.json` generation remain blocked. Current remaining estimate: internal tester optimizer prototype 0 sprints, feature-complete app optimizer beta 0-50 sprints, and public-ready optimizer for real planning use 50-170 sprints.

Current package doc: [`docs/sprint_3208_3227_runtime_annual_account_sequencing_repair_targeting.md`](docs/sprint_3208_3227_runtime_annual_account_sequencing_repair_targeting.md).

S3188-S3207 is complete. Runtime annual account sequence review rows now roll up into a quality summary in Results Details. The summary shows ready/review/blocked row counts, average score, next repair target, and blocked-output status while saved sequencing, CSV output, reports, production UI, final instructions, tax-bracket wording, saved schema changes, engine output schema changes, and `.plan.json` generation remain blocked. Current remaining estimate: internal tester optimizer prototype 0 sprints, feature-complete app optimizer beta 0-60 sprints, and public-ready optimizer for real planning use 60-180 sprints.

Current package doc: [`docs/sprint_3188_3207_runtime_annual_account_sequencing_quality_summary.md`](docs/sprint_3188_3207_runtime_annual_account_sequencing_quality_summary.md).

S3168-S3187 is complete. Runtime annual account sequence review rows now include quality scoring in Results Details. Each row shows a beta-review quality label, a 0-6 quality score, and source/account-order/tax/constraint/boundary reasons, while saved sequencing, CSV output, reports, production UI, final instructions, tax-bracket wording, saved schema changes, engine output schema changes, and `.plan.json` generation remain blocked. Current remaining estimate: internal tester optimizer prototype 0 sprints, feature-complete app optimizer beta 0-70 sprints, and public-ready optimizer for real planning use 70-190 sprints.

Current package doc: [`docs/sprint_3168_3187_runtime_annual_account_sequencing_quality_scoring.md`](docs/sprint_3168_3187_runtime_annual_account_sequencing_quality_scoring.md).

S3148-S3167 is complete. Results Details now renders runtime annual account sequence review rows adapted from existing experimental annual draft rows. The adapter maps year, account label, review amount, source evidence, readiness cue, tax context, constraint context, and boundary status without changing engine output schema, saved schema, CSV columns, reports, production UI, final instructions, tax-bracket wording, or `.plan.json` generation. Current remaining estimate: internal tester optimizer prototype 0 sprints, feature-complete app optimizer beta 0-80 sprints, and public-ready optimizer for real planning use 80-200 sprints.

Current package doc: [`docs/sprint_3148_3167_runtime_annual_account_sequencing_adapter_implementation_slice.md`](docs/sprint_3148_3167_runtime_annual_account_sequencing_adapter_implementation_slice.md).

S3128-S3147 is complete. Results Details now includes the runtime annual account sequence source adapter plan. The plan maps each shape field to existing runtime draft sources, defines missing-source fallback wording, and keeps the adapter read-only against existing runtime draft data. Current remaining estimate: internal tester optimizer prototype 0 sprints, feature-complete app optimizer beta 10-90 sprints, and public-ready optimizer for real planning use 90-210 sprints. Adapter implementation, saved schema changes, engine output schema changes, saved sequencing, CSV columns, report rows, production UI, final instructions, tax-bracket wording, and `.plan.json` generation remain blocked.

Current package doc: [`docs/sprint_3128_3147_runtime_annual_account_sequencing_source_adapter_planning.md`](docs/sprint_3128_3147_runtime_annual_account_sequencing_source_adapter_planning.md).

S3108-S3127 is complete. Results Details now includes the runtime annual account sequence shape contract. The contract defines the runtime-only row fields for year, account label, review amount, source evidence, readiness cue, tax context, constraint context, and boundary status, plus shape rules and explicit exclusions for saved rows, CSV columns, report rows, production UI, final instructions, tax-bracket wording, schema changes, and `.plan.json` generation. Current remaining estimate: internal tester optimizer prototype 0 sprints, feature-complete app optimizer beta 20-100 sprints, and public-ready optimizer for real planning use 100-220 sprints.

Current package doc: [`docs/sprint_3108_3127_runtime_annual_account_sequencing_shape_contract.md`](docs/sprint_3108_3127_runtime_annual_account_sequencing_shape_contract.md).

S3088-S3107 is complete. Results Details now includes an annual account sequencing beta gate. The gate allows gated beta work on runtime annual account sequencing only, with source requirements for selected-candidate rows, annual account totals, draft account-order positions, tax context, readiness evidence, and estate/survivor hooks. Output gates keep saved sequencing, CSV output, reports, production UI, final instructions, and tax-bracket instructions blocked until runtime sequencing quality is stable. Current remaining estimate: internal tester optimizer prototype 0 sprints, feature-complete app optimizer beta 30-110 sprints, and public-ready optimizer for real planning use 110-230 sprints. Schema changes and `.plan.json` generation remain blocked.

Current package doc: [`docs/sprint_3088_3107_annual_account_sequencing_beta_implementation_gate.md`](docs/sprint_3088_3107_annual_account_sequencing_beta_implementation_gate.md).

S3068-S3087 is complete. Results Details now includes post-handoff feedback triage and beta path reset rows. Tester feedback can be categorized as copy clarification, context improvement, model-evidence repair, or beta-blocking feedback, while the next beta path is framed around annual account sequencing, saved/CSV output after quality gates, and continued tester-only release posture. Current remaining estimate: internal tester optimizer prototype 0 sprints, feature-complete app optimizer beta 40-120 sprints, and public-ready optimizer for real planning use 120-240 sprints. Saved sequencing, CSV output, reports, production UI, final instructions, tax-bracket instructions, schema changes, and `.plan.json` generation remain blocked.

Current package doc: [`docs/sprint_3068_3087_post_handoff_feedback_triage_and_beta_path_reset.md`](docs/sprint_3068_3087_post_handoff_feedback_triage_and_beta_path_reset.md).

S3048-S3067 is complete. Results Details now includes a controlled tester handoff packet beside the runtime draft handoff decision. The packet tells testers who should test, what to open, what to review, what to ignore, what feedback is useful, and when to stop the test. The internal tester optimizer prototype is ready for a very small synthetic-scenario tester group. Current remaining estimate: internal tester optimizer prototype 0 sprints, feature-complete app optimizer beta 50-130 sprints, and public-ready optimizer for real planning use 130-250 sprints. Saved sequencing, CSV output, reports, production UI, final instructions, tax-bracket instructions, schema changes, and `.plan.json` generation remain blocked.

Current package doc: [`docs/sprint_3048_3067_controlled_tester_handoff_packet_and_review_checklist.md`](docs/sprint_3048_3067_controlled_tester_handoff_packet_and_review_checklist.md).

S3028-S3047 is complete. Results Details now includes a runtime draft tester handoff decision gate. The gate says the current runtime annual draft row surface is ready for a very small controlled handoff using made-up scenarios only, with tester review limited to clarity, plausibility, missing context, and whether anything sounds too final. Current remaining estimate: internal tester optimizer prototype 0-20 sprints, feature-complete app optimizer beta 60-140 sprints, and public-ready optimizer for real planning use 140-260 sprints. Saved sequencing, CSV output, reports, production UI, final instructions, tax-bracket instructions, schema changes, and `.plan.json` generation remain blocked.

Current package doc: [`docs/sprint_3028_3047_runtime_draft_tester_handoff_decision_gate.md`](docs/sprint_3028_3047_runtime_draft_tester_handoff_decision_gate.md).

S3008-S3027 is complete. Runtime annual draft rows in Results Details now include row-level readiness cues derived from existing account-order and tax-context evidence: ready for review, ready with context, review first, or needs tax review. Current remaining estimate: internal tester optimizer prototype 0-30 sprints, feature-complete app optimizer beta 70-150 sprints, and public-ready optimizer for real planning use 150-270 sprints. Saved sequencing, CSV output, reports, production UI, final instructions, tax-bracket instructions, schema changes, and `.plan.json` generation remain blocked.

Current package doc: [`docs/sprint_3008_3027_runtime_annual_draft_row_quality_and_tester_readiness.md`](docs/sprint_3008_3027_runtime_annual_draft_row_quality_and_tester_readiness.md).

S2988-S3007 is complete. Results Details now renders runtime-only annual draft rows from the existing experimental annual instruction draft instead of relying on hand-written static example rows. The tester-only surface shows year, account label, review amount, source field label, and compact tax context while keeping saved sequencing, CSV output, reports, production UI, final instructions, tax-bracket instructions, schema changes, and `.plan.json` generation blocked. Current remaining estimate: internal tester optimizer prototype 0-40 sprints, feature-complete app optimizer beta 80-160 sprints, and public-ready optimizer for real planning use 160-280 sprints.

Current package doc: [`docs/sprint_2988_3007_runtime_annual_draft_rows_surface_integration.md`](docs/sprint_2988_3007_runtime_annual_draft_rows_surface_integration.md).

S2968-S2987 is complete. The existing runtime-only experimental annual instruction draft now includes a runtime draft generator scope with allowed sources, readiness rows, blocked outputs, boundary copy, and next step. Results Details shows this scope inside the tester-only panel so the app is moving from hand-written static mock rows toward runtime annual draft generation without changing saved schema or engine output schema. Current remaining estimate: internal tester optimizer prototype 10-50 sprints, feature-complete app optimizer beta 90-170 sprints, and public-ready optimizer for real planning use 170-290 sprints. Saved sequencing, CSV output, reports, production UI, final instructions, tax-bracket instructions, schema changes, and `.plan.json` generation remain blocked.

Current package doc: [`docs/sprint_2968_2987_runtime_annual_instruction_draft_generator_scope.md`](docs/sprint_2968_2987_runtime_annual_instruction_draft_generator_scope.md).

S2948-S2967 is complete. The stale "from S2628" optimizer timeline has been corrected to remaining-work estimates and will now be updated after every 20-sprint package. Current remaining estimate: internal tester optimizer prototype 20-60 sprints, feature-complete app optimizer beta 100-180 sprints, and public-ready optimizer for real planning use 180-300 sprints. The tester-only Details surface now also includes three hand-written synthetic static annual review rows for made-up scenario comprehension testing only, while calculations, generated account order, tax-bracket targets, saved sequencing, CSV output, reports, production UI, final instructions, tax-bracket instructions, saved schema changes, and `.plan.json` generation remain blocked.

Current package doc: [`docs/sprint_2948_2967_tester_only_static_mock_surface_implementation_slice.md`](docs/sprint_2948_2967_tester_only_static_mock_surface_implementation_slice.md).

S2928-S2947 is complete, but its no-material-change timeline language was superseded by the S2948-S2967 correction. The tester-only surface includes a static mock implementation decision gate that allows a future tester-only hand-written static mock surface implementation package only, while implementation in that package, calculated values, generated account order, tax-bracket targets, saved sequencing, CSV output, reports, production UI, final instructions, tax-bracket instructions, saved schema changes, and `.plan.json` generation remained blocked.

Current package doc: [`docs/sprint_2928_2947_optimizer_timeline_reassessment_and_static_mock_implementation_decision_gate.md`](docs/sprint_2928_2947_optimizer_timeline_reassessment_and_static_mock_implementation_decision_gate.md).

S2908-S2927 is complete. The tester-only surface now includes a final preflight gate for future static mock surface implementation planning. Placement, layout, and removal contracts are clear enough to plan a later implementation package only, while implementation in this package, rendered mock rows, calculated values, generated account order, saved sequencing, CSV output, report output, production UI, final instructions, tax-bracket instructions, saved schema changes, and `.plan.json` generation remain blocked.

Current package doc: [`docs/sprint_2908_2927_annual_instruction_static_mock_surface_final_preflight_gate.md`](docs/sprint_2908_2927_annual_instruction_static_mock_surface_final_preflight_gate.md).

S2888-S2907 is complete. The tester-only surface now includes a static mock surface removal contract for future annual instruction row mock work. The contract requires future mock surface code to stay grouped for removal in one scoped change and keeps future mock content out of shared selectors, saved schema, engine output, reports, CSV, production routes, release controls, rendered rows, calculated values, generated account order, final instructions, tax-bracket instructions, saved schema changes, and `.plan.json` generation.

Current package doc: [`docs/sprint_2888_2907_annual_instruction_static_mock_surface_removal_contract.md`](docs/sprint_2888_2907_annual_instruction_static_mock_surface_removal_contract.md).

S2868-S2887 is complete. The tester-only surface now includes a static mock surface layout contract for future annual instruction row mock work. The contract defines header, fixture-list, review-prompt, and removal-note areas, while row tables, mock-row cards, calculated values, generated account order, save/CSV/print/report/production actions, schema changes, rendered rows, final instructions, tax-bracket instructions, and `.plan.json` generation remain blocked.

Current package doc: [`docs/sprint_2868_2887_annual_instruction_static_mock_surface_layout_contract.md`](docs/sprint_2868_2887_annual_instruction_static_mock_surface_layout_contract.md).

S2848-S2867 is complete. The tester-only surface now includes a static mock surface placement boundary for future annual instruction row mock work. Future placement is limited to the existing tester-only Details surface, near boundary evidence. Placement in Overview, Save and print, printable reports, CSV output, saved plan files, production UI, rendered rows, calculated values, generated account order, final instructions, tax-bracket instructions, saved schema changes, and `.plan.json` generation remain blocked.

Current package doc: [`docs/sprint_2848_2867_annual_instruction_static_mock_surface_placement_boundary.md`](docs/sprint_2848_2867_annual_instruction_static_mock_surface_placement_boundary.md).

S2828-S2847 is complete. The second 100-sprint optimizer timeline checkpoint found no material change to the S2628 baseline: internal tester prototype remains 80-120 sprints from S2628, feature-complete beta remains 180-260 sprints from S2628, and public-ready optimizer remains 300-450 sprints from S2628. The next material estimate checkpoint is S2928-S2947. The tester-only surface now also records that the static mock boundary, copy contract, fixture boundary, and approval gate are ready for future static surface planning only, while rendered mock rows, calculated values, generated account order, saved sequencing, CSV output, reports, production UI, final instructions, tax-bracket instructions, saved schema changes, and `.plan.json` generation remain blocked.

Current package doc: [`docs/sprint_2828_2847_optimizer_timeline_reassessment_and_static_mock_surface_planning_checkpoint.md`](docs/sprint_2828_2847_optimizer_timeline_reassessment_and_static_mock_surface_planning_checkpoint.md).

S2808-S2827 is complete. The tester-only surface now includes a static mock fixture approval gate for future annual instruction row mock work. The gate says the boundary, copy contract, and fixture contract are clear enough for future static surface planning only. It does not approve rendered static mock rows, calculated values, generated account order, tax-bracket targets, saved sequencing, CSV output, reports, production UI, final instructions, tax-bracket instructions, saved schema changes, or `.plan.json` generation.

Current package doc: [`docs/sprint_2808_2827_annual_instruction_static_mock_fixture_approval_gate.md`](docs/sprint_2808_2827_annual_instruction_static_mock_fixture_approval_gate.md).

S2788-S2807 is complete. The tester-only surface now includes a static mock fixture boundary for future annual instruction row mock work. The boundary defines fixture fields and rules for hand-written, synthetic, removable, non-saved, non-exported, non-printed, schema-neutral fixture data. It keeps rendered fixture rows, calculated amounts, generated account order, tax-bracket targets, saved sequencing, CSV output, reports, production UI, final instructions, tax-bracket instructions, saved schema changes, and `.plan.json` generation blocked.

Current package doc: [`docs/sprint_2788_2807_annual_instruction_static_mock_row_fixture_boundary.md`](docs/sprint_2788_2807_annual_instruction_static_mock_row_fixture_boundary.md).

S2768-S2787 is complete. The tester-only surface now includes a static mock copy contract for future annual instruction row mock work. The contract defines required wording, wording to avoid, and allowed copy phrases for labels, amounts, review reasons, and boundary notes. It keeps static mock rows, calculated amounts, generated account order, tax-bracket targets, saved sequencing, CSV output, reports, production UI, final instructions, tax-bracket instructions, saved schema changes, and `.plan.json` generation blocked.

Current package doc: [`docs/sprint_2768_2787_annual_instruction_static_mock_copy_contract.md`](docs/sprint_2768_2787_annual_instruction_static_mock_copy_contract.md).

S2748-S2767 is complete. The tester-only surface now includes a static mock boundary for future annual instruction row mock work. The boundary allows only fixed-label, hand-written, non-generative comprehension testing for made-up scenarios. Calculated annual withdrawal amounts, generated account order, tax-bracket targets, saved sequencing, CSV output, reports, production UI, final instructions, tax-bracket instructions, saved schema changes, and `.plan.json` generation remain blocked.

Current package doc: [`docs/sprint_2748_2767_annual_instruction_non_generative_row_mock_boundary.md`](docs/sprint_2748_2767_annual_instruction_non_generative_row_mock_boundary.md).

S2728-S2747 is complete. The first 100-sprint optimizer timeline checkpoint found no material change to the S2628 baseline: internal tester prototype remains 80-120 sprints from S2628, feature-complete beta remains 180-260 sprints from S2628, and public-ready optimizer remains 300-450 sprints from S2628. The next material estimate checkpoint is S2828-S2847. The tester-only surface now also records that prototype shape and source mapping are ready only for a future non-generative static mock, while generated rows, saved sequencing, CSV output, reports, production UI, final instructions, tax-bracket instructions, schema changes, and `.plan.json` generation remain blocked.

Current package doc: [`docs/sprint_2728_2747_optimizer_timeline_reassessment_and_prototype_shape_checkpoint.md`](docs/sprint_2728_2747_optimizer_timeline_reassessment_and_prototype_shape_checkpoint.md).

S2708-S2727 is complete. The tester-only surface now maps the internal-only prototype row fields to existing runtime candidate data sources, with missing-source behavior and blocked inferences. Year, account label, amount label, review reason, quality flag, and boundary note each have a declared source, while exact account order, tax-bracket targets, final withdrawal instructions, saved sequencing fields, CSV columns, and report rows must not be inferred. This remains static source mapping only and does not generate annual instruction rows.

Current package doc: [`docs/sprint_2708_2727_annual_instruction_prototype_row_source_mapping.md`](docs/sprint_2708_2727_annual_instruction_prototype_row_source_mapping.md).

S2688-S2707 is complete. The tester-only surface now includes an internal-only annual instruction prototype shape boundary with allowed row fields for year, account label, amount label, review reason, quality flag, and boundary note. The same section excludes exact tax-bracket commands, final annual instructions, saved sequencing, CSV output, report output, production UI, and saved schema changes. This is a static contract only; it does not calculate, generate, persist, download, print, publish, or promote annual instruction rows.

Current package doc: [`docs/sprint_2688_2707_annual_instruction_prototype_shape_boundary.md`](docs/sprint_2688_2707_annual_instruction_prototype_shape_boundary.md).

S2668-S2687 is complete. The tester-only surface now includes an annual instruction prototype decision gate. The gate says boundary and cleanup evidence are ready enough to define a future internal-only prototype shape, while real tester observations, scenario coverage, and performance notes are still missing before implementation. Saved sequencing, CSV output, reports, production UI, final instructions, tax-bracket instructions, schema changes, prototype implementation, and `.plan.json` generation remain blocked.

Current package doc: [`docs/sprint_2668_2687_annual_instruction_prototype_decision_gate.md`](docs/sprint_2668_2687_annual_instruction_prototype_decision_gate.md).

S2648-S2667 is complete. The tester-only surface now includes cleanup target buckets for copy cleanup, input/context cleanup, model/plausibility cleanup, scenario coverage gaps, blocked-output confusion, and no-action holds. These buckets are static, read-only interpretation targets and do not create issues, assign tasks, trigger model repair, collect feedback, score feedback, approve sequencing, change schemas, save output, export CSV, create reports, promote production UI, create final instructions, create tax-bracket instructions, or generate `.plan.json` files.

Current package doc: [`docs/sprint_2648_2667_tester_feedback_cleanup_target_buckets.md`](docs/sprint_2648_2667_tester_feedback_cleanup_target_buckets.md).

S2628-S2647 is complete. The tester-only surface now includes a feedback interpretation guard that separates useful feedback, copy cleanup, input/model cleanup, blockers, and not-approval boundaries. Positive tester feedback is explicitly not approval for saved sequencing, CSV output, reports, final instructions, production use, tax-bracket instructions, saved schema changes, engine output schema changes, or `.plan.json` generation. The optimizer timeline baseline is recorded in TASKS with the next material reassessment at S2728-S2747.

Current package doc: [`docs/sprint_2628_2647_tester_handoff_feedback_interpretation_guard.md`](docs/sprint_2628_2647_tester_handoff_feedback_interpretation_guard.md).

S2608-S2627 is complete. The tiny tester-only surface now includes a limited handoff packet with static tester steps, suggested synthetic scenarios, and non-persistence guards. The handoff tells testers what to open and what to review without collecting notes, saving feedback, exporting output, promoting production UI, changing schemas, creating final annual instructions, creating tax-bracket instructions, or generating `.plan.json` files.

Current package doc: [`docs/sprint_2608_2627_limited_tester_handoff_packet.md`](docs/sprint_2608_2627_limited_tester_handoff_packet.md).

S2588-S2607 is complete. The tiny tester-only surface is now hardened with a stable accessible label, safer fallback copy, explicit translation of internal output ids before display, stronger disabled-action checks, compact-screen styling guards, and browser verification. Saved output, CSV output, report output, production UI promotion, tax-bracket instructions, saved schema changes, engine output schema changes, final annual instructions, and `.plan.json` generation remain out of scope.

Current package doc: [`docs/sprint_2588_2607_tiny_tester_surface_verification_hardening.md`](docs/sprint_2588_2607_tiny_tester_surface_verification_hardening.md).

S2568-S2587 is complete. The app now includes a tiny tester-only read-only surface inside Results Details, backed by the runtime dry-run payload with visible boundary copy and disabled action rendering. Saved output, CSV output, report output, production UI promotion, tax-bracket instructions, saved schema changes, unplanned engine output changes outside the runtime-only tester surface payload exposure, final annual instructions, and `.plan.json` generation remain out of scope.

Current package doc: [`docs/sprint_2568_2587_tiny_tester_surface_implementation_slice.md`](docs/sprint_2568_2587_tiny_tester_surface_implementation_slice.md).

S2548-S2567 is complete. The tester surface planning gate now includes a runtime implementation approval gate with approval status, approval decision, required conditions, blocked outputs, rows, summary, boundary, and next step. This explicitly decides whether a tiny tester-only surface may be implemented in a later package while saved output, CSV output, report output, production UI promotion, tax-bracket instructions, saved schema changes, unplanned engine output changes outside the runtime-only approval gate, final annual instructions, tester-facing UI implementation, and `.plan.json` generation remain out of scope.

Current package doc: [`docs/sprint_2548_2567_tiny_tester_surface_implementation_approval_gate.md`](docs/sprint_2548_2567_tiny_tester_surface_implementation_approval_gate.md).

S2528-S2547 is complete. The tester surface planning gate now includes a runtime preflight checklist with route, runtime data source, read-only rendering, disabled action, copy placement, and verification checks. This prepares implementation preflight while saved output, CSV output, report output, production UI promotion, tax-bracket instructions, saved schema changes, unplanned engine output changes outside the runtime-only preflight checklist, final annual instructions, tester-facing UI implementation, and `.plan.json` generation remain out of scope.

Current package doc: [`docs/sprint_2528_2547_tiny_tester_surface_preflight_checklist.md`](docs/sprint_2528_2547_tiny_tester_surface_preflight_checklist.md).

S2508-S2527 is complete. The tester surface planning gate now includes a runtime implementation decision gate with allowed implementation scope, blocked implementation scope, decision rows, decision value, boundary, and next step. This decides whether a tiny tester-only surface may be implemented later while saved output, CSV output, report output, production UI promotion, tax-bracket instructions, saved schema changes, unplanned engine output changes outside the runtime-only decision gate, final annual instructions, tester-facing UI implementation, and `.plan.json` generation remain out of scope.

Current package doc: [`docs/sprint_2508_2527_tester_surface_implementation_decision_gate.md`](docs/sprint_2508_2527_tester_surface_implementation_decision_gate.md).

S2488-S2507 is complete. The limited tester packet surface planning gate now includes review-only surface labels, disabled action labels with reasons, copy/action boundary rows, and non-advisory wording checks. This prepares copy and action boundaries for a future tiny tester surface while saved output, CSV output, report output, production UI, tax-bracket instructions, saved schema changes, unplanned engine output changes outside the runtime-only copy/action boundary, final annual instructions, tester-facing UI implementation, and `.plan.json` generation remain out of scope.

Current package doc: [`docs/sprint_2488_2507_tester_surface_copy_action_boundary_review.md`](docs/sprint_2488_2507_tester_surface_copy_action_boundary_review.md).

S2468-S2487 is complete. The limited tester packet dry-run payload now includes a runtime surface planning gate with surface scope, disabled output actions, review-only copy, planning rows, and boundary checks. This decides whether a very small tester-facing surface can be planned later while saved output, CSV output, report output, production UI, tax-bracket instructions, saved schema changes, unplanned engine output changes outside the runtime-only surface planning gate, final annual instructions, tester-facing UI implementation, and `.plan.json` generation remain out of scope.

Current package doc: [`docs/sprint_2468_2487_limited_tester_packet_surface_planning_gate.md`](docs/sprint_2468_2487_limited_tester_packet_surface_planning_gate.md).

S2448-S2467 is complete. The limited tester packet dry-run payload now includes a runtime quality gate with status, score, repair example ids, row coverage, prompt coverage, boundary clarity, readiness mix, and output-boundary checks. This prepares payload quality review before any tester-facing surface planning while saved output, CSV output, report output, production UI, tax-bracket instructions, saved schema changes, unplanned engine output changes outside the runtime-only quality gate, final annual instructions, and `.plan.json` generation remain out of scope.

Current package doc: [`docs/sprint_2448_2467_limited_tester_packet_payload_quality_gate.md`](docs/sprint_2448_2467_limited_tester_packet_payload_quality_gate.md).

S2428-S2447 is complete. The synthetic tester packet readiness matrix now includes a runtime dry-run payload with one item per synthetic example, candidate display rows, review prompt ids, readiness status, and runtime boundary metadata. This prepares payload inspection before any tester-facing implementation while saved output, CSV output, report output, production UI, tax-bracket instructions, saved schema changes, unplanned engine output changes outside the runtime-only dry-run payload, final annual instructions, and `.plan.json` generation remain out of scope.

Current package doc: [`docs/sprint_2428_2447_limited_tester_packet_payload_dry_run.md`](docs/sprint_2428_2447_limited_tester_packet_payload_dry_run.md).

S2408-S2427 is complete. The synthetic tester packet readiness matrix now includes a runtime contract with allowed fields, excluded fields, calm tester prompts, and contract boundary checks. This defines what a future limited tester packet may consume while saved output, CSV output, report output, production UI, tax-bracket instructions, saved schema changes, unplanned engine output changes outside the runtime-only contract, tester-facing UI implementation, and `.plan.json` generation remain out of scope.

Current package doc: [`docs/sprint_2408_2427_limited_synthetic_tester_packet_contract.md`](docs/sprint_2408_2427_limited_synthetic_tester_packet_contract.md).

S2388-S2407 is complete. Experimental draft example matrix output now includes a runtime synthetic tester packet readiness matrix with ready, review-first, and blocked example buckets, gate evidence rows, and visible/hidden release scope. This prepares a limited tester packet decision while saved output, CSV output, report output, production UI, tax-bracket instructions, saved schema changes, unplanned engine output changes outside the runtime-only readiness matrix, and `.plan.json` generation remain out of scope.

Current package doc: [`docs/sprint_2388_2407_synthetic_tester_packet_readiness_matrix.md`](docs/sprint_2388_2407_synthetic_tester_packet_readiness_matrix.md).

S2368-S2387 is complete. Experimental annual draft output now includes a runtime tester packet export guard with saved plan, CSV, report, production UI, final instruction, and tax-bracket instruction checks. This makes the synthetic tester packet boundary explicit before tester-facing implementation while saved output, CSV output, report output, production UI, tax-bracket instructions, saved schema changes, unplanned engine output changes outside the runtime-only export guard, and `.plan.json` generation remain out of scope.

Current package doc: [`docs/sprint_2368_2387_tester_packet_export_guard_review.md`](docs/sprint_2368_2387_tester_packet_export_guard_review.md).

S2348-S2367 is complete. Experimental annual draft output now includes a runtime synthetic tester packet boundary with visible sections, hidden sections, tester-purpose copy, blocked outputs, and packet-boundary checks. This makes it clearer what testers can critique while saved output, CSV output, report output, production UI, tax-bracket instructions, saved schema changes, unplanned engine output changes outside the runtime-only tester packet boundary, and `.plan.json` generation remain out of scope.

Current package doc: [`docs/sprint_2348_2367_synthetic_tester_packet_boundary_review.md`](docs/sprint_2348_2367_synthetic_tester_packet_boundary_review.md).

S2328-S2347 is complete. Experimental annual draft output now includes runtime candidate presentation readiness with display rows, status labels, quality labels, repair previews, presentation checks, and tester-boundary copy. This supports earlier synthetic tester review while saved output, CSV output, report output, production UI, tax-bracket instructions, saved schema changes, unplanned engine output changes outside the runtime-only experimental draft presentation readiness packet, and `.plan.json` generation remain out of scope.

Current package doc: [`docs/sprint_2328_2347_annual_candidate_presentation_readiness.md`](docs/sprint_2328_2347_annual_candidate_presentation_readiness.md).

S2308-S2327 is complete. Experimental annual draft output now includes a runtime candidate selection summary with strongest candidate years, quality-count rollups, repair-theme rollups, and review-only next-step copy. This supports synthetic tester comparison and repair before saved output, CSV output, report output, production UI, tax-bracket instructions, saved schema changes, unplanned engine output changes outside the runtime-only experimental draft candidate selection summary, and `.plan.json` generation remain out of scope.

Current package doc: [`docs/sprint_2308_2327_annual_candidate_selection_summary.md`](docs/sprint_2308_2327_annual_candidate_selection_summary.md).

S2288-S2307 is complete. Runtime annual instruction candidates now include quality levels, scores, quality rows, and repair targets for annual totals, account order, tax context, and output boundaries. This supports candidate comparison and repair before saved output, CSV output, report output, production UI, tax-bracket instructions, saved schema changes, unplanned engine output changes outside the runtime-only experimental draft candidate quality packet, and `.plan.json` generation remain out of scope.

Current package doc: [`docs/sprint_2288_2307_runtime_annual_candidate_quality_scoring.md`](docs/sprint_2288_2307_runtime_annual_candidate_quality_scoring.md).

S2268-S2287 is complete. Experimental annual draft output now packages annual account totals into runtime annual instruction candidates with status, display order, review flags, summaries, and runtime-only boundaries. This prepares reviewable per-year candidate shape while saved output, CSV output, report output, production UI, tax-bracket instructions, saved schema changes, unplanned engine output changes outside the runtime-only experimental draft candidate shape, and `.plan.json` generation remain out of scope.

Current package doc: [`docs/sprint_2268_2287_runtime_annual_instruction_candidate_shape.md`](docs/sprint_2268_2287_runtime_annual_instruction_candidate_shape.md).

S2248-S2267 is complete. Annual account totals now distinguish active draft-order positions from skipped inactive draft-order positions, and instruction readiness now includes a dedicated account-order gap review row. This repairs runtime ordering evidence before final annual account instructions while saved output, CSV output, report output, production UI, tax-bracket instructions, saved schema changes, unplanned engine output changes outside the runtime-only experimental draft readiness packet, and `.plan.json` generation remain out of scope.

Current package doc: [`docs/sprint_2248_2267_account_order_consistency_repair.md`](docs/sprint_2248_2267_account_order_consistency_repair.md).

S2228-S2247 is complete. Experimental annual draft output now includes runtime annual account totals and an instruction-readiness packet with annual totals, account-order consistency, tax-context, and output-boundary checks. This prepares annual account instruction review while saved output, CSV output, report output, production UI, tax-bracket instructions, saved schema changes, unplanned engine output changes outside the runtime-only experimental draft readiness packet, and `.plan.json` generation remain out of scope.

Current package doc: [`docs/sprint_2228_2247_annual_account_instruction_readiness.md`](docs/sprint_2228_2247_annual_account_instruction_readiness.md).

S2208-S2227 is complete. Experimental annual draft rows now include runtime source-field evidence, year-level grouping, account-order position, and clearer account-level rationale. This improves synthetic tester review of annual draft rows while saved output, CSV output, report output, production UI, tax-bracket instructions, saved schema changes, unplanned engine output changes outside the runtime-only experimental draft rows, and `.plan.json` generation remain out of scope.

Current package doc: [`docs/sprint_2208_2227_annual_draft_row_quality_rationale.md`](docs/sprint_2208_2227_annual_draft_row_quality_rationale.md).

S2188-S2207 is complete. Clean synthetic examples now get runtime-only planning seeds after clean reset adaptation, so the experimental optimizer can test annual draft rows against plausible account, CPP/OAS, mortgage, survivor, and estate evidence while clean files remain clean. Saved output, CSV output, report output, production UI, tax-bracket instructions, saved schema changes, engine output schema changes, and `.plan.json` generation remain out of scope.

Current package doc: [`docs/sprint_2188_2207_clean_example_draft_repair.md`](docs/sprint_2188_2207_clean_example_draft_repair.md).

S2168-S2187 is complete. Experimental draft repair implementation now scans a wider ten-year modelled window and adds concrete repair actions to row coverage, blocker, watch-item, tax-context, and confidence repair targets. This improves runtime draft quality while saved output, CSV output, report output, production UI, tax-bracket instructions, saved schema changes, engine output schema changes, and `.plan.json` generation remain out of scope.

Current package doc: [`docs/sprint_2168_2187_experimental_draft_repair_implementation.md`](docs/sprint_2168_2187_experimental_draft_repair_implementation.md).

S2148-S2167 is complete. Experimental draft example matrix scoring now includes repair targets for low row coverage, blockers, watch items, tax context, and low confidence, with affected example ids preserved for targeted improvement. This keeps the work focused on runtime draft quality while saved output, CSV output, report output, production UI, tax-bracket instructions, saved schema changes, engine output schema changes, and `.plan.json` generation remain out of scope.

Current package doc: [`docs/sprint_2148_2167_experimental_draft_readiness_repair_targeting.md`](docs/sprint_2148_2167_experimental_draft_readiness_repair_targeting.md).

S2128-S2147 is complete. Experimental draft readiness can now be scored across bundled and clean synthetic examples, with ready, review-first, and blocked counts plus per-example confidence, row coverage, blocker, watch, and review-item detail. This supports runtime repair targeting while keeping saved output, CSV output, report output, production UI, tax-bracket instructions, saved schema changes, engine output schema changes, and `.plan.json` generation out of scope.

Current package doc: [`docs/sprint_2128_2147_experimental_draft_example_matrix_scoring.md`](docs/sprint_2128_2147_experimental_draft_example_matrix_scoring.md).

S2108-S2127 is complete. Experimental annual draft rows now include a runtime readiness summary that rolls up confidence, blockers, harm checks, watch items, tax context, and row coverage into a ready/review/blocked status. This supports synthetic tester review decisions while keeping saved output, CSV output, report output, production UI, tax-bracket instructions, saved schema changes, engine output schema changes, and `.plan.json` generation out of scope.

Current package doc: [`docs/sprint_2108_2127_experimental_draft_readiness_summary.md`](docs/sprint_2108_2127_experimental_draft_readiness_summary.md).

S2088-S2107 is complete. Experimental annual draft rows now include runtime harm checks for projected shortfall, estate pressure, survivor review, OAS recovery, tax context availability, and output boundary posture. This improves draft confidence for synthetic tester scenarios while keeping saved output, CSV output, report output, production UI, tax-bracket instructions, saved schema changes, engine output schema changes, and `.plan.json` generation out of scope.

Current package doc: [`docs/sprint_2088_2107_experimental_draft_stress_harm_checks.md`](docs/sprint_2088_2107_experimental_draft_stress_harm_checks.md).

S2068-S2087 is complete. Experimental annual draft rows now include runtime confidence scoring with quality rows for draft coverage, tax context, account-order source, constraints, survivor review, and output boundaries. This improves confidence in synthetic tester draft output while keeping saved output, CSV output, report output, production UI, tax-bracket instructions, saved schema changes, engine output schema changes, and `.plan.json` generation out of scope.

Current package doc: [`docs/sprint_2068_2087_experimental_draft_confidence_scoring.md`](docs/sprint_2068_2087_experimental_draft_confidence_scoring.md).

S2048-S2067 is complete. Experimental annual draft rows now carry clearer runtime tax context: after-tax spending, approximate effective tax rate, OAS recovery status, and draft-level tax context rows. This improves tester confidence in the modelled draft while keeping tax-bracket instructions, saved output, CSV output, report output, production UI, saved schema changes, engine output schema changes, and `.plan.json` generation out of scope.

Current package doc: [`docs/sprint_2048_2067_experimental_draft_tax_context_hardening.md`](docs/sprint_2048_2067_experimental_draft_tax_context_hardening.md).

S2028-S2047 is complete. The bounded optimizer now emits runtime-only experimental annual instruction draft rows for synthetic tester scenarios. Draft rows mirror selected-candidate annual withdrawal fields and include compact tax context, while saved output, CSV output, report output, production UI, tax-bracket instructions, saved schema changes, engine output schema changes, and `.plan.json` generation remain out of scope.

Current package doc: [`docs/sprint_2028_2047_experimental_annual_instruction_draft_rows.md`](docs/sprint_2028_2047_experimental_annual_instruction_draft_rows.md).

S2008-S2027 is complete. The bounded optimizer now emits a runtime-only experimental account-order draft for synthetic tester scenarios, derived from selected modelled candidate context and available account balance fields. Annual dollar rows, saved output, CSV output, report output, production UI, tax-bracket instructions, saved schema changes, engine output schema changes, and `.plan.json` generation remained out of scope for that package.

Current package doc: [`docs/sprint_2008_2027_experimental_account_order_draft.md`](docs/sprint_2008_2027_experimental_account_order_draft.md).

S1988-S2007 is complete. The bounded optimizer now emits a runtime-only annual sequencing input adapter for tester-only synthetic scenario planning. It captures selected-candidate context, modelled year range, available account balance fields, available tax fields, and constraint hooks while still blocking account order, annual account instructions, tax-bracket instructions, saved sequencing output, CSV sequencing output, report output, production UI, saved schema changes, engine output schema changes, and `.plan.json` generation.

Current package doc: [`docs/sprint_1988_2007_annual_sequencing_runtime_input_adapter.md`](docs/sprint_1988_2007_annual_sequencing_runtime_input_adapter.md).

S1968-S1987 is complete. The bounded optimizer now emits a runtime-only annual sequencing prep contract with required future inputs and blocked outputs. Account-level instructions, account order, tax-bracket instructions, saved sequencing output, CSV sequencing output, report output changes, production UI, saved schema changes, engine output schema changes, and `.plan.json` generation remain out of scope.

Current package doc: [`docs/sprint_1968_1987_annual_account_sequencing_prep_contract.md`](docs/sprint_1968_1987_annual_account_sequencing_prep_contract.md).

S1948-S1967 is complete. Capacity objective expectations are now hardened across bundled examples and fresh clean-example runtime adapters. The matrix proves runtime capacity objective metadata, report readiness, and export guards are present for examples, while accidental runtime-enriched example payloads are stripped before editable save output. This did not change report output, CSV output, saved schema, engine output schema, production UI, or `.plan.json` generation.

Current package doc: [`docs/sprint_1948_1967_capacity_objective_example_matrix_hardening.md`](docs/sprint_1948_1967_capacity_objective_example_matrix_hardening.md).

S1928-S1947 is complete. Capacity objective export guardrails are now runtime-visible, with forbidden saved keys and plan-file adapter coverage proving capacity objective packets, report readiness, optimizer output, and annual account instructions stay out of editable saved plan files. This did not change report output, CSV output, saved schema, engine output schema, or `.plan.json` generation.

Current package doc: [`docs/sprint_1928_1947_capacity_objective_export_guardrails.md`](docs/sprint_1928_1947_capacity_objective_export_guardrails.md).

S1908-S1927 is complete. Capacity objective report readiness is now available as runtime-only metadata in the bounded optimizer summary, identifying later report fields while explicitly deferring tax context, saved output, account instructions, and annual sequencing. This did not change printable report output, production UI, saved schema, engine output schema, saved optimizer output, or `.plan.json` generation.

Current package doc: [`docs/sprint_1908_1927_capacity_objective_report_readiness.md`](docs/sprint_1908_1927_capacity_objective_report_readiness.md).

S1888-S1907 is complete. Capacity objective logic is now selector-hardened for reuse: minimum-floor normalization, status mapping, and capacity objective row generation are exported and tested directly, while bounded optimizer output still remains runtime-only. This did not promote production UI, save optimizer output, change saved schema, change engine output schema, create account instructions, or generate `.plan.json` files.

Current package doc: [`docs/sprint_1888_1907_capacity_objective_selector_hardening.md`](docs/sprint_1888_1907_capacity_objective_selector_hardening.md).

S1868-S1887 is complete. The runtime-only capacity objective now has a guarded Details evidence surface: compact monthly capacity, expense floor, and optional room in the normal Details optimizer card, with full constraint evidence kept behind the option research gate. Overview remains unpromoted, and there are still no saved optimizer outputs, saved schema changes, engine output schema changes, annual account instructions, or `.plan.json` generation.

Current package doc: [`docs/sprint_1868_1887_capacity_objective_evidence_surface_and_guardrails.md`](docs/sprint_1868_1887_capacity_objective_evidence_surface_and_guardrails.md).

S1848-S1867 is complete. The bounded optimizer runtime summary now includes a runtime-only `capacityObjective` packet with sustainable after-tax monthly capacity, minimum expense floor comparison, optional room, estate and survivor constraint states, bounded CPP/OAS timing state, and explicit annual sequencing deferral. This did not add production UI, saved optimizer output, saved plan schema changes, engine output schema changes, or `.plan.json` generation.

Current package doc: [`docs/sprint_1848_1867_runtime_only_optimizer_objective_adapter.md`](docs/sprint_1848_1867_runtime_only_optimizer_objective_adapter.md).

S1828-S1847 documented the planner-grade optimizer objective decision gate. The package defines the objective as maximizing sustainable after-tax monthly household capacity while protecting the minimum expense floor, survivor feasibility, estate constraints, and bounded CPP/OAS timing review. It keeps annual account-level withdrawal sequencing, production UI, saved optimizer output, saved plan schema changes, engine output schema changes, and `.plan.json` generation out of scope.

Current package doc: [`docs/sprint_1828_1847_planner_grade_optimizer_objective_decision_gate.md`](docs/sprint_1828_1847_planner_grade_optimizer_objective_decision_gate.md).

Sprint 701 is complete. Tax-aware drawdown work has a conservative v1 bounded execution path, baseline plus nearby spending stress live behind the engine-owned stress helper module, detailed Monte Carlo/historical stress has an explicit v1 deferral decision, checkpoint feedback produced a narrow trust-cleanup batch, DB pension splitting is now included in the current-plan baseline for eligible two-person plans, the broken legacy Canadian-rule probes have been repaired and promoted into the canonical runner, the bounded drawdown check now has a final checkpoint review, the first human-tester intake friction items have been addressed without broad UI redesign, the normal consumer Details path now shows one compact drawdown review summary instead of the full internal research stack, the older drawdown readiness diagnostic is gated with the hidden research panels, normal Details uses compact plan-options review while full option research and optimizer-prep diagnostics are gated, normal Details keeps benefit timing and spending stress while raw scenario tables are gated, normal Details keeps Money Flow story and first-year ledger while reconciliation diagnostics are gated, normal Details keeps the decision checklist while decision detail and projection path are gated, normal Details keeps a compact tax-pressure summary while the full tax table is gated, visible plan-selection copy is now framed as plan-review evidence rather than advice, Save & print now explains editable backup, printable report, and CSV results export boundaries, the tester-feedback slice now adds local year-by-year CSV export coverage for both React annual projection detail and the legacy dashboard Year-by-Year Detail scenario table, research gates are protected as disabled for the normal consumer path, guided-intake validation now describes non-blocking completeness issues as review items rather than warnings, results option copy now uses review-first labels instead of suggestion/recommendation-adjacent wording, local downloads are explicitly described as accountless and not uploaded, the normal Details evidence set is guarded as compact, the feedback-ready/deferred boundary is documented, CPP/OAS timing is explained as an age-65 current baseline with an age-70 review test rather than a saved editable input, the optimizer now records runtime-only readiness rows, v1 candidate-family boundaries, a max-after-tax-spend objective contract, staged CPP/OAS search shape, a bounded CPP/OAS milestone execution grid with compact first-to-review and top-three evidence, example-matrix coverage for benefit evidence, survivor and bridge-year guards for benefit timing, benefit-timing copy guards, broad withdrawal-family shape, withdrawal-family evidence including first-year tax, peak tax, lifetime tax, and OAS recovery when a broad family leads, example guardrails for withdrawal-family copy, account-bucket guardrails requiring registered plus TFSA/non-registered balances, a candidate-limit guard that preserves non-grid review families, sustainable monthly spend evidence, a runtime-only withdrawal feedback checkpoint with tester questions, confusion signals, a decision gate, a feedback worksheet, and outcome guidance that keeps annual account-level sequencing deferred until broad-family evidence is tested with users, outside-app feedback materials are ready for manual anonymized review, hidden annual-sequencing readiness rendering is now slimmer and summary-first, and stale dynamic chunk failures now show calm reload copy with a refresh button. The broad withdrawal-family surface is ready for feedback as high-level comparison evidence; annual withdrawal sequencing remains deferred.

Completed Sprint 682-701 slices:

- Added a Refresh page button for stale deployed chunk errors.
- Added alert semantics and restrained error-panel styling for bridge preview errors.
- Kept generic preview errors separate from stale-version recovery.
- Documented reviewer refresh guidance, manual QA, copy boundaries, no-persistence posture, and next-package recommendation.

Completed Sprint 662-681 slices:

- Slimmed the hidden annual sequencing readiness research panel to current summary, feedback posture, top blockers, slimming guidance, and handoff.
- Preserved deeper readiness packet data in runtime output and docs.
- Added stale dynamic chunk reload copy and structure guard coverage.
- Confirmed no real feedback was summarized and annual account-level sequencing remains deferred.

Completed Sprint 642-661 slices:

- Prepared outside-app feedback collection materials without adding in-app capture.
- Added reviewer boundaries, anonymization checklist, session script, manual worksheet, triage categories, and moderator guardrails.
- Added synthesis rubric, annual sequencing reconsideration criteria, no-capture guard, prototype deferral guard, fallback readiness-slimming guidance, scheduling packet, and evidence storage boundary.
- Confirmed no real feedback was collected in this package and annual account-level sequencing remains deferred.

Completed Sprint 296-300 slices:

- Reviewed v1 feedback readiness across Overview, Details, Save & print, CSV, and review-label copy.
- Added research-gate checkpoint coverage for the normal consumer path.
- Recorded the current trust-cleanup posture and verification package.
- Closed the run before the next engine/optimizer checkpoint decision.
- Preserved engine math, optimizer behavior, drawdown behavior, saved plan schema, and engine output schema.

Completed Sprint 301 slice:

- Reframed non-blocking guided-intake validation items as review items instead of warnings.

Completed Sprint 302-307 slices:

- Planned the cleanup runway through the optimizer checkpoint stop rule.
- Closed guided-intake review-item wording across intake and Review.
- Tightened Results option copy around review-first interpretation and guardrails.
- Reconfirmed local output boundaries for editable backup, printable report, and CSV export.
- Guarded the compact normal Details evidence set.
- Recorded feedback readiness, deferred scope, and the decision to proceed to optimizer prep next.

Completed Sprint 308-321 slices:

- Added optimizer input readiness rows and candidate-family boundaries.
- Added the max sustainable after-tax spend objective contract with conservative deterministic guardrails.
- Added staged CPP/OAS search-shape metadata, engine-supported 65/70 timing seed candidates, and broad withdrawal-family metadata.
- Added sustainable monthly spend evidence to the Details optimizer surface.
- Kept annual overrides, Monte Carlo-in-loop search, saved optimizer output, and schema changes deferred.

Completed Sprint 322 slice:

- Expanded benefit timing execution from 65/70 seed candidates to a bounded CPP 60/65/67/70 and OAS 65/67/70 milestone grid.
- Preserved the age-65 current-plan baseline and explicit age-70 delay candidate.
- Kept optimizer candidates runtime-only and under the existing 20-candidate cap.

Completed Sprint 323 slice:

- Added compact Details evidence for the best bounded benefit-grid milestone pair.
- Added funded-year, lifetime-tax, and projected money-left deltas for that pair.
- Preserved the age-70 delay bridge-year evidence.

Completed Sprint 324 slice:

- Updated Details evidence copy to include benefit timing as part of option evidence.
- Reframed benefit-grid labels around the first milestone pair to review.
- Added UI structure guards for benefit-grid evidence and prohibited copy.

Completed Sprint 325 slice:

- Replaced silent candidate slicing with an explicit bounded-candidate limit helper.
- Preserved non-grid review families and age-70 delay when the cap is reached.
- Added an overflow test for two-person plans with benefit timing, income sharing, home-sale reliance, and withdrawal-family checks.

Planned Sprint 326-330 benefit-timing hardening path:

- S326: Add top-three benefit timing evidence in Details research output.
- S327: Run and document a benefit timing example matrix.
- S328: Tighten bridge-year and survivor harm checks.
- S329: Guard benefit timing copy and readability.
- S330: Stop for a checkpoint before widening another optimizer lever.

Completed Sprint 326 slice:

- Added compact top-three CPP/OAS milestone-pair evidence.
- Preserved first-pair, funded-year, tax, money-left, and bridge-year evidence.
- Kept the change runtime-only and Details-research oriented.

Completed Sprint 327 slice:

- Added example-matrix coverage for benefit-timing candidates and top-three evidence.
- Guarded example benefit evidence against optimal, guaranteed, and do-this wording.
- Kept evidence assertions eligibility-aware.

Completed Sprint 328 slice:

- Kept benefit timing review-only when a two-person plan lacks a survivor scenario year.
- Preserved existing bridge-year shortfall review-only behavior.
- Added focused coverage for the survivor guard.

Completed Sprint 329 slice:

- Added structure guards for benefit-timing evidence labels and survivor-review language.
- Blocked optimal/recommended/start-benefits-at wording for CPP/OAS evidence.
- Kept the guard aligned with engine evidence rendered in Details.

Completed Sprint 330 slice:

- Closed the benefit-timing hardening batch.
- Documented bounded milestone-grid benefit timing as feedback-ready.
- Recommended withdrawal sequencing prep as the next optimizer batch while deferring full exhaustive CPP/OAS search and Monte Carlo validation.

Planned Sprint 331-335 withdrawal sequencing prep path:

- S331: Add compact broad-family evidence when withdrawal order leads.
- S332: Tighten account-bucket guardrails for broad withdrawal family comparison.
- S333: Deepen tax and OAS recovery evidence for broad families.
- S334: Guard examples and copy against annual account instructions.
- S335: Stop for a withdrawal sequencing prep checkpoint.

Completed Sprint 331 slice:

- Added compact evidence rows for the leading broad withdrawal family.
- Compared funded years, lifetime tax, OAS recovery, and projected money left against the current plan.
- Kept evidence runtime-only and explicitly not an annual account instruction.

Completed Sprint 332 slice:

- Centralized account-bucket readiness for broad withdrawal-family checks.
- Required meaningful registered and TFSA/non-registered balances.
- Kept cash wedge from making withdrawal-family comparison eligible by itself.

Completed Sprint 333 slice:

- Added first-year and peak-tax evidence for leading broad withdrawal-family comparisons.
- Kept lifetime tax, OAS recovery, and money-left evidence in the same broad-family group.
- Preserved the no-instructions boundary.

Completed Sprint 334 slice:

- Added example-matrix guardrails for withdrawal-family evidence.
- Required broad-family and current-plan framing when withdrawal order leads.
- Blocked account-instruction and tax-bracket-optimization wording.

Completed Sprint 335 slice:

- Closed the withdrawal sequencing prep batch.
- Documented broad withdrawal-family evidence as feedback-ready high-level comparison.
- Kept annual override planning, exact sequencing, and tax-bracket optimization deferred.

Completed Sprint 336 slice:

- Added the year-by-year CSV download to the legacy dashboard table under Sequence-of-Returns.
- Bound the export to the selected dashboard scenario and display-dollar mode.
- Kept the export local-only and out of saved plan data.

Planned Sprint 337-341 withdrawal feedback path:

- S337: Add runtime-only feedback readiness rows for broad withdrawal-family evidence.
- S338: Keep annual account-level instructions explicitly deferred.
- S339: Mark whether comparison evidence is clear enough when a broad family leads.
- S340: Surface the checkpoint in Details research only.
- S341: Stop at a decision point before annual sequencing architecture.

Completed Sprint 337-341 slices:

- Added withdrawal feedback readiness to the bounded optimizer summary.
- Rendered the checkpoint in the full Details optimizer research path.
- Documented that annual withdrawal sequencing remains deferred until broad-family feedback is reviewed.

Planned Sprint 342-346 withdrawal feedback hardening path:

- S342: Add concrete feedback questions for broad withdrawal-family evidence.
- S343: Add confusion signals that block annual sequencing planning.
- S344: Add a blocked-input question path.
- S345: Keep feedback questions in Details research only.
- S346: Stop before annual sequencing planning.

Completed Sprint 342-346 slices:

- Added runtime-only tester questions and confusion signals to the withdrawal feedback checkpoint.
- Kept blocked broad-family states focused on input cleanup.
- Confirmed annual account-level sequencing remains deferred until feedback is reviewed.

Planned Sprint 347-351 annual sequencing decision-gate path:

- S347: Convert feedback readiness into a decision contract.
- S348: Add required evidence before annual sequencing planning.
- S349: Route blocked states to input cleanup.
- S350: Render the next decision gate in Details research only.
- S351: Stop before annual sequencing architecture.

Completed Sprint 347-351 slices:

- Added collect-feedback, clean-up-inputs, and hold-annual-sequencing decision states.
- Added required evidence rows for a later annual sequencing decision.
- Kept annual sequencing architecture deferred.

Planned Sprint 352-356 withdrawal feedback worksheet path:

- S352: Add understanding, evidence, boundary, and decision worksheet sections.
- S353: Add pass signals for each worksheet section.
- S354: Add blocked-state worksheet prompts.
- S355: Render the worksheet in Details research only.
- S356: Close the worksheet batch before annual sequencing planning.

Completed Sprint 352-356 slices:

- Added a runtime-only worksheet to the withdrawal feedback checkpoint.
- Added pass signals for comparison understanding, evidence interpretation, instruction boundary, and next decision.
- Kept annual sequencing deferred pending worksheet feedback.

Planned Sprint 357-361 feedback outcome path:

- S357: Add feedback outcome states.
- S358: Add outcome-specific next steps.
- S359: Route blocked outcomes to input repair.
- S360: Render the outcome in Details research only.
- S361: Close the outcome batch with annual sequencing deferred.

Completed Sprint 357-361 slices:

- Added ready-to-review, repair-inputs, and defer-sequencing outcomes.
- Added runtime-only next steps for each outcome.
- Kept annual sequencing deferred until feedback review is complete.

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
37. **Sprint 59 — Drawdown comparison evidence surface.** Expose hidden comparison evidence in Details only, with review-only boundaries.
38. **Sprint 60 — Drawdown comparison decision gate.** Add materiality and harm checks before any comparison could become a highlighted option.
39. **Sprint 61 — Drawdown gate example hardening.** Stress the decision gate across examples and edge cases before any broader drawdown execution work.
40. **Sprint 62 — Drawdown comparison explainer polish.** Make the gate easier to understand in plain language.
41. **Sprint 63 — Drawdown execution contract v1.** Define runtime-only annual override payload validation without product execution.
42. **Sprint 64 — Internal drawdown dry-run harness.** Compare one guarded payload shape behind a test-only path.
43. **Sprint 65 — Drawdown prototype readiness review.** Summarize whether the narrow prototype is ready for future product review.
44. **Sprint 66 — Drawdown prototype decision gate.** Decide whether the narrow drawdown prototype may become a Details-only review surface.
45. **Sprint 67 — Visible drawdown review preview.** Expose high-level drawdown review evidence in Details only when the final gate allows it.
46. **Sprint 68 — Drawdown preview example matrix.** Run the visible preview guardrails across all examples.
47. **Sprint 69 — Drawdown preview stress and harm checks.** Hold or block preview exposure when stress or harm checks fail.
48. **Sprint 70 — Drawdown phase review and go/no-go.** Summarize whether to continue, hold, or stop before deeper drawdown execution.
49. **Sprint 71 — Drawdown execution boundary decision.** Decide whether to keep the preview as-is, deepen guardrails, or begin a tightly scoped execution prototype.
50. **Sprint 72 — Annual override adapter shape.** Create a draft adapter shape from one eligible payload without passing it to the engine.
51. **Sprint 73 — Test-only adapter rejection harness.** Reject unsafe draft adapter shapes before any execution work can proceed.
52. **Sprint 74 — One mocked execution scorecard.** Score supplied baseline and candidate rows in tests only, not product UI.
53. **Sprint 75 — Execution prototype go/no-go.** Decide whether one future real prototype may begin, should hold, or must stop.
54. **Sprint 76 — Prototype preflight.** Check whether the next drawdown phase has enough evidence and boundaries before any product path opens.
55. **Sprint 77 — Adapter audit trail.** Explain the draft adapter shape in plain review terms.
56. **Sprint 78 — Execution containment guard.** Prove the work remains Details-only with no plan action, override calculation, or saved output.
57. **Sprint 79 — Execution example matrix checkpoint.** Run the new execution-readiness layer across all built-in examples.
58. **Sprint 80 — Drawdown execution phase closeout.** Summarize whether the next phase is ready, should hold, or must stop.
59. **Sprint 81 — One contained real scenario.** Run one bounded draft shape through existing scenario plumbing without custom annual overrides.
60. **Sprint 82 — Prototype harm checks.** Block the contained prototype when funding or entered estate goals weaken.
61. **Sprint 83 — Details-only prototype evidence.** Surface contained prototype evidence in Details only.
62. **Sprint 84 — Contained prototype example matrix.** Run all built-in examples through the contained prototype layer.
63. **Sprint 85 — Contained drawdown prototype review.** Summarize whether the contained prototype is ready, held, or blocked.
64. **Sprint 86 — Contained prototype materiality.** Hold small movements rather than overemphasizing them.
65. **Sprint 87 — Contained prototype explanation.** Explain why the contained scenario moved in plain review language.
66. **Sprint 88 — Contained prototype limitations.** Make scenario-only and not-advice boundaries visible.
67. **Sprint 89 — Contained prototype example and copy guard.** Run all examples through the explanation layer.
68. **Sprint 90 — Contained prototype usefulness closeout.** Summarize whether the contained prototype is useful enough to keep reviewing.
69. **Sprint 91 — Contained prototype Details density.** Hold the contained prototype if its Details surface becomes too crowded.
70. **Sprint 92 — Contained prototype review checklist.** Add a short checklist before users interpret the contained prototype.
71. **Sprint 93 — Contained prototype example gate.** Keep example readiness as test/runtime evidence without product-view overclaiming.
72. **Sprint 94 — Contained prototype copy guard.** Protect review-only language and saved-plan boundaries.
73. **Sprint 95 — Contained prototype product go/no-go.** Combine readiness signals into one Details-only decision before broader drawdown work.
74. **Sprint 96 — Contained prototype promotion readiness.** Decide whether later UX consideration is possible without promoting the prototype now.
75. **Sprint 97 — Contained prototype next-step guide.** Add review steps that do not become account instructions.
76. **Sprint 98 — Contained prototype blocker register.** Summarize held and blocked signals.
77. **Sprint 99 — Contained prototype example promotion gate.** Extend example coverage to the promotion-readiness layer.
78. **Sprint 100 — Contained prototype phase milestone.** Close the contained prototype phase before broader drawdown work.
79. **Sprint 101 — V1 drawdown execution intent.** Commit v1 to a bounded execution path, not only review scenarios.
80. **Sprint 102 — V1 bounded execution candidate.** Convert one accepted draft shape into one executable existing-engine scenario.
81. **Sprint 103 — V1 bounded execution result.** Run the bounded scenario and compare funding, tax, OAS recovery, and estate.
82. **Sprint 104 — V1 execution review and example gate.** Keep executed results review-only and covered across examples.
83. **Sprint 105 — V1 execution phase closeout.** Decide whether bounded execution is ready for later consumer UX.
84. **Sprint 106 — V1 drawdown plain summary.** Explain what ran, what changed, and what did not change.
85. **Sprint 107 — V1 drawdown safety checklist.** Add funding, estate, saved-plan, and instruction checks.
86. **Sprint 108 — V1 drawdown consumer limits.** Keep single-scenario and not-advice limits visible.
87. **Sprint 109 — V1 drawdown consumer example gate.** Extend example coverage to the consumer-readable layer.
88. **Sprint 110 — V1 drawdown consumer closeout.** Decide whether bounded execution output is ready for UX copy.
89. **Sprint 111 — Bounded drawdown UX headline.** Add a plain Details-only headline for the bounded drawdown check.
90. **Sprint 112 — Bounded drawdown comparison card.** Translate bounded execution evidence into a compact current-plan comparison.
91. **Sprint 113 — Bounded drawdown review actions.** Add short review actions without creating account instructions.
92. **Sprint 114 — Bounded drawdown UX copy guard.** Keep recommendation, guarantee, instruction, and saved-plan boundaries explicit.
93. **Sprint 115 — Bounded drawdown UX readiness closeout.** Decide whether the bounded drawdown UX candidate is ready for later design polish.
94. **Sprint 116 — Runtime boundary metadata.** Record explicit plan-object simulation boundaries and remaining bridge ownership.
95. **Sprint 117 — Preview runner boundary.** Record runner injection, working-copy scenarios, survivor config, and non-persistence boundaries.
96. **Sprint 118 — Engine extraction readiness selector.** Summarize ready, held, and blocked extraction signals without changing engine math.
97. **Sprint 119 — Engine extraction example and persistence gate.** Check built-in examples and saved-plan boundaries for extraction readiness output.
98. **Sprint 120 — Engine extraction readiness closeout.** Mark narrow stress-helper extraction as the next logical slice.
99. **Sprint 121 — Baseline stress helper module.** Move baseline stress read logic behind an engine-owned helper.
100. **Sprint 122 — Stress selector compatibility exports.** Keep existing React-facing stress selectors stable.
101. **Sprint 123 — Stress extraction boundary.** Record what moved and what remains held for later stress migration.
102. **Sprint 124 — Stress helper example coverage.** Run built-in examples through extracted baseline stress helpers.
103. **Sprint 125 — Stress helper extraction closeout.** Mark scenario stress, Monte Carlo, and historical sequence migration as later slices.
104. **Sprint 126 — Spending stress rerun helper.** Move nearby spending stress working-copy reruns into the stress helper.
105. **Sprint 127 — Spending stress summary helper.** Move fragile, balanced, and room-to-review interpretation into the stress helper.
106. **Sprint 128 — Preview spending stress compatibility.** Keep preview bundle output stable while delegating spending stress work.
107. **Sprint 129 — Spending stress guardrail tests.** Cover working copies, skip logic, examples, and saved-plan boundaries.
108. **Sprint 130 — Spending stress ownership closeout.** Mark spending stress as stress-helper-owned while Monte Carlo and historical sequence remain later.
109. **Sprint 131 — Detailed stress boundary map.** Record detailed-report ownership for Monte Carlo, progressive Monte Carlo, historical sequence, and full-spending-funded metrics.
110. **Sprint 132 — Detailed stress probe and persistence guardrails.** Add runtime-only rows for probe coverage and saved-plan boundaries.
111. **Sprint 133 — Detailed stress no-migration closeout.** Keep detailed stress execution in the detailed-report path.
112. **Sprint 134 — Detailed stress adapter next step.** Mark adapter-contract design as the next safe migration slice.
113. **Sprint 135 — Detailed stress boundary closeout.** Cover blocked and adapter-ready states without moving detailed stress execution.
114. **Sprint 136 — Thin detailed stress adapter contract.** Add runtime-only explicit plan/config adapter metadata.
115. **Sprint 137 — Detailed stress injected runner boundary.** Keep Monte Carlo and historical replay behind detailed-report runner ownership.
116. **Sprint 138 — Detailed stress output guardrails.** Require existing detailed stress output shapes and unsaved adapter output.
117. **Sprint 139 — Detailed stress adapter validation.** Validate boundary review, migration closeout, probes, and saved-plan guardrails together.
118. **Sprint 140 — Detailed stress adapter contract closeout.** Mark the next safe slice as a contained injected-runner prototype.
119. **Sprint 141 — Detailed stress explicit request.** Build a copied explicit plan/config request after adapter validation passes.
120. **Sprint 142 — Detailed stress injected runner harness.** Call only a supplied runner and avoid React-owned detailed stress execution.
121. **Sprint 143 — Detailed stress prototype output validation.** Accept only existing detailed stress shape metadata.
122. **Sprint 144 — Detailed stress prototype persistence guardrails.** Keep request, result, and closeout output runtime-only.
123. **Sprint 145 — Detailed stress prototype closeout.** Mark the next safe slice as a probe-backed runner bridge.
124. **Sprint 146 — Detailed stress probe coverage summary.** Record probe coverage and known route-probe caveat for bridge work.
125. **Sprint 147 — Detailed stress probe-backed bridge readiness.** Require prototype, coverage, runner injection, and saved-plan guardrails.
126. **Sprint 148 — Detailed stress guarded bridge run.** Call the injected runner only when bridge readiness is clean.
127. **Sprint 149 — Detailed stress bridge persistence guardrails.** Keep coverage, bridge, bridge run, and closeout output runtime-only.
128. **Sprint 150 — Detailed stress bridge closeout.** Mark the next safe slice as manual detailed-report comparison.
129. **Sprint 151 — Detailed stress report reference metadata.** Add runtime-only detailed-report reference metadata for manual comparison.
130. **Sprint 152 — Detailed stress manual comparison rows.** Compare bridge output to reference metadata.
131. **Sprint 153 — Detailed stress review and block thresholds.** Mark metric drift for review and blocked paths as blocked.
132. **Sprint 154 — Detailed stress comparison persistence guardrails.** Keep reference, comparison, and closeout output runtime-only.
133. **Sprint 155 — Detailed stress manual comparison closeout.** Mark the next checkpoint as migrate-or-defer decision.
134. **Sprint 156 — Detailed stress v1 decision selector.** Add runtime-only decision rows for the migrate-or-defer checkpoint.
135. **Sprint 157 — Detailed stress v1 deferral decision.** Keep detailed stress in the detailed report for v1 when comparison is clean.
136. **Sprint 158 — Detailed stress decision review paths.** Mark product-value and migration-risk exceptions for review.
137. **Sprint 159 — Detailed stress decision persistence guardrails.** Keep decision and closeout output runtime-only.
138. **Sprint 160 — Detailed stress v1 decision closeout.** Return focus to recommended-plan and bounded drawdown execution work.
139. **Sprint 161 — V1 drawdown re-entry review.** Confirm detailed stress deferral and drawdown readiness after the decision checkpoint.
140. **Sprint 162 — V1 drawdown next sprint plan.** Mark recommended-plan framing and bounded drawdown review polish as next.
141. **Sprint 163 — V1 drawdown re-entry guardrails.** Add hold and block paths for examples, phase, and saved-plan boundaries.
142. **Sprint 164 — V1 drawdown re-entry persistence.** Keep re-entry and next-sprint output runtime-only.
143. **Sprint 165 — V1 drawdown re-entry closeout.** Close the session as ready for the next bounded drawdown sprint.
144. **Sprint 166 — Recommended-plan drawdown review.** Frame bounded drawdown execution as Details review evidence.
145. **Sprint 167 — V1 drawdown Details placement.** Keep comparison, limits, and review actions out of Overview.
146. **Sprint 168 — V1 drawdown review copy guard.** Block advice-like, instruction-like, saved-output, and Overview-heavy framing.
147. **Sprint 169 — Recommended-plan drawdown persistence.** Keep review, placement, copy, and closeout output runtime-only.
148. **Sprint 170 — Recommended-plan drawdown closeout.** Mark the drawdown review polish ready for implementation.
149. **Sprint 171 — Details drawdown review wiring.** Thread recommended-plan drawdown review selectors into React preview state.
150. **Sprint 172 — Recommended-plan drawdown Details UI.** Surface recommended-plan drawdown review, placement, and closeout evidence in Details.
151. **Sprint 173 — Drawdown review copy guard UI.** Make the review copy guard visible in Details.
152. **Sprint 174 — Drawdown review Overview and persistence guardrails.** Keep drawdown review implementation out of Overview and saved plans.
153. **Sprint 175 — Details drawdown review closeout.** Close the Details-facing implementation batch before v1 copy polish.
154. **Sprint 176 — Drawdown review visible label scrub.** Replace implementation-style visible labels with consumer-facing review language.
155. **Sprint 177 — Drawdown review selector copy polish.** Reword drawdown selector copy that flows into the page.
156. **Sprint 178 — Drawdown review plain-language guardrail.** Add tests that block implementation labels from recommended-plan drawdown copy.
157. **Sprint 179 — Drawdown review Overview boundary retest.** Keep polished drawdown review copy out of Overview.
158. **Sprint 180 — Drawdown review copy polish closeout.** Close copy polish and prepare for the v1 checkpoint batch.
159. **Sprint 181 — Release readiness selector.** Add a runtime-only checkpoint for the v1 feedback pass.
160. **Sprint 182 — Release readiness Details surface.** Show readiness rows in Details only.
161. **Sprint 183 — Release readiness guardrail tests.** Cover ready and blocked checkpoint states without persisted output.
162. **Sprint 184 — Release readiness Overview boundary.** Keep the checkpoint out of Overview.
163. **Sprint 185 — Release readiness checkpoint closeout.** Close checkpoint preparation before the broader v1 feedback package.
164. **Sprint 186 — Feedback review package selector.** Add a runtime-only package for the upcoming v1 feedback pass.
165. **Sprint 187 — Feedback review Details surface.** Show feedback rows and review script in Details only.
166. **Sprint 188 — Feedback review package guardrails.** Cover ready and blocked package states without persisted output.
167. **Sprint 189 — Feedback review Overview boundary.** Keep the feedback package out of Overview.
168. **Sprint 190 — Feedback review package closeout.** Close package preparation before the broader feedback checkpoint.
169. **Sprint 191 — Checkpoint review board selector.** Combine readiness and feedback package signals into a runtime-only checkpoint board.
170. **Sprint 192 — Checkpoint feedback buckets.** Separate fix-first, review-now, and later-UX-pass items.
171. **Sprint 193 — Checkpoint review Details surface.** Show the checkpoint board in Details only.
172. **Sprint 194 — Checkpoint review guardrails.** Cover blocked board states, unsaved output, and Overview boundaries.
173. **Sprint 195 — Checkpoint review board closeout.** Close the checkpoint board batch before broader user/model review.
174. **Sprint 196 — Checkpoint trust response.** Keep feedback response focused on trust fixes, not visual redesign.
175. **Sprint 197 — Save backup trust.** Add local backup reminders and save-before-results/report prompts.
176. **Sprint 198 — Overview density trim.** Remove compact optimizer/readiness diagnostics from Overview.
177. **Sprint 199 — Scope and diagnostic copy.** Make Ontario scope visible and remove diagnostic withdrawal wording from consumer intake.
178. **Sprint 200 — Checkpoint panels gate.** Hide checkpoint-only panels from the normal consumer Details path.
179. **Sprint 201 — Pension-splitting baseline investigation.** Decide whether DB pension splitting belongs in the current-plan baseline.
180. **Sprint 202 — Baseline DB pension splitting.** Include DB pension splitting in eligible two-person baseline configs.
181. **Sprint 203 — Pension candidate discipline.** Keep DB pension splitting from appearing as a found optimizer option.
182. **Sprint 204 — Pension baseline copy.** Explain baseline inclusion in Results.
183. **Sprint 205 — Pension baseline guardrails.** Lock the behavior with selector, optimizer, and UI tests.
184. **Sprint 206 — Legacy probe repair.** Move broken legacy probes off brittle dashboard inline-script extraction.
185. **Sprint 207 — Canadian rule probe coverage.** Restore spousal RRSP, CPP sharing, and OAS recovery coverage.
186. **Sprint 208 — Account and sustain probe coverage.** Restore account-balance, withdrawal-order, and sustainable-spending coverage.
187. **Sprint 209 — Probe suite promotion.** Add repaired probes to the canonical runner.
188. **Sprint 210 — Probe repair closeout.** Close the verification repair batch before returning to optimizer/drawdown work.
189. **Sprint 211 — Drawdown implementation gate.** Gate recommended-plan placement around closeout, safety, limits, copy, and saved-plan boundaries.
190. **Sprint 212 — Drawdown recommended-plan narrative.** Translate the bounded drawdown check into plain review evidence.
191. **Sprint 213 — Drawdown recommended-plan example gate.** Keep built-in example coverage as a readiness gate.
192. **Sprint 214 — Drawdown implementation copy and persistence.** Protect non-advisory copy and unsaved output.
193. **Sprint 215 — Drawdown implementation closeout.** Combine gate, narrative, examples, and persistence into a v1 checkpoint closeout.
194. **Sprint 216 — Drawdown v1 checkpoint review.** Decide ready, hold, or simplify before v1 feedback.
195. **Sprint 217 — Drawdown checkpoint example matrix.** Extend built-in example coverage through the checkpoint layer.
196. **Sprint 218 — Drawdown checkpoint copy guard.** Protect recommendation, certainty, and instruction boundaries.
197. **Sprint 219 — Drawdown checkpoint persistence.** Keep checkpoint output out of saved plan files.
198. **Sprint 220 — Drawdown checkpoint closeout.** Mark the next path as feedback/checkpoint assessment, not broader execution.
199. **Sprint 221 — Intake navigation and save clarity.** Scroll to top on step changes and clarify local save behavior.
200. **Sprint 222 — Required field guidance.** Highlight missing or review-needed intake fields.
201. **Sprint 223 — Today’s dollars label audit.** Clarify DB pension, bridge pension, and spending labels.
202. **Sprint 224 — CPP/OAS input clarity.** Explain CPP at 65 input and timing tests.
203. **Sprint 225 — Future income expansion notes.** Capture multiple pensions, rental income, and one-time additions as future schema work.

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
- **Sprint 59 — Drawdown comparison evidence surface.** Complete 2026-05-20. Added compact Details-only drawdown comparison evidence with explicit review-only and no-plan-change boundaries.
- **Sprint 60 — Drawdown comparison decision gate.** Complete 2026-05-20. Added a Details-only decision gate with materiality, funding harm, estate, survivor, locked-in account, and saved-plan checks before any later highlight path.
- **Sprint 61 — Drawdown gate example hardening.** Complete 2026-05-20. Added focused edge and all-example coverage for the decision gate before execution-contract work.
- **Sprint 62 — Drawdown comparison explainer polish.** Complete 2026-05-20. Added plain summary and next-step copy to drawdown gate states.
- **Sprint 63 — Drawdown execution contract v1.** Complete 2026-05-20. Added runtime-only payload validation while preserving current withdrawal order and empty annual overrides.
- **Sprint 64 — Internal drawdown dry-run harness.** Complete 2026-05-20. Added a test-only internal dry-run comparison path for one guarded payload shape.
- **Sprint 65 — Drawdown prototype readiness review.** Complete 2026-05-20. Added a Details-only readiness review that keeps prototype status review-only and unsaved.
- **Sprint 66 — Drawdown prototype decision gate.** Complete 2026-05-20. Added a final visible-review gate for the drawdown prototype before any Details preview appears.
- **Sprint 67 — Visible drawdown review preview.** Complete 2026-05-20. Added high-level Details-only preview evidence without account instructions.
- **Sprint 68 — Drawdown preview example matrix.** Complete 2026-05-20. Extended all-example guardrails for preview, phase review, copy posture, and saved-plan boundaries.
- **Sprint 69 — Drawdown preview stress and harm checks.** Complete 2026-05-20. Added fragile-spending holdback and funding/estate harm blocking.
- **Sprint 70 — Drawdown phase review and go/no-go.** Complete 2026-05-20. Added a Details-only checkpoint for continue, hold, or stop before deeper drawdown execution.
- **Sprint 71 — Drawdown execution boundary decision.** Complete 2026-05-20. Added a Details-only decision for staying preview-only, hardening more, or preparing one tiny future prototype.
- **Sprint 72 — Annual override adapter shape.** Complete 2026-05-20. Added a draft adapter shape for one eligible payload without running or saving annual overrides.
- **Sprint 73 — Test-only adapter rejection harness.** Complete 2026-05-20. Added validation that rejects unsafe draft adapter shapes before any execution work can proceed.
- **Sprint 74 — One mocked execution scorecard.** Complete 2026-05-20. Added test-only mocked scoring for supplied baseline and candidate rows.
- **Sprint 75 — Execution prototype go/no-go.** Complete 2026-05-20. Added a Details-only checkpoint for whether one later real prototype can begin.
- **Sprint 76 — Prototype preflight.** Complete 2026-05-20. Added a Details-only preflight check before any real prototype path opens.
- **Sprint 77 — Adapter audit trail.** Complete 2026-05-20. Added plain draft-shape audit rows for review.
- **Sprint 78 — Execution containment guard.** Complete 2026-05-20. Added containment rows for Details-only, no plan action, no override calculation, no saved output, and one draft shape.
- **Sprint 79 — Execution example matrix checkpoint.** Complete 2026-05-20. Extended all-example coverage for the execution-readiness layer.
- **Sprint 80 — Drawdown execution phase closeout.** Complete 2026-05-20. Added a Details-only phase closeout before the next drawdown phase.
- **Sprint 81 — One contained real scenario.** Complete 2026-05-20. Added one contained scenario comparison using existing engine plumbing without custom annual overrides.
- **Sprint 82 — Prototype harm checks.** Complete 2026-05-20. Blocked contained prototype evidence when funding or entered estate goals weaken.
- **Sprint 83 — Details-only prototype evidence.** Complete 2026-05-20. Surfaced contained prototype evidence in Details only.
- **Sprint 84 — Contained prototype example matrix.** Complete 2026-05-20. Extended all-example coverage for contained prototype status, summary, copy posture, and persistence.
- **Sprint 85 — Contained drawdown prototype review.** Complete 2026-05-20. Added a contained prototype summary before broader drawdown execution work.
- **Sprint 86 — Contained prototype materiality.** Complete 2026-05-21. Added materiality checks for contained prototype movement.
- **Sprint 87 — Contained prototype explanation.** Complete 2026-05-21. Added plain explanation rows for contained prototype movement and caution.
- **Sprint 88 — Contained prototype limitations.** Complete 2026-05-21. Added visible limitations to keep the prototype humble.
- **Sprint 89 — Contained prototype example and copy guard.** Complete 2026-05-21. Extended all-example coverage for materiality, explanation, limitations, and usefulness.
- **Sprint 90 — Contained prototype usefulness closeout.** Complete 2026-05-21. Added a usefulness closeout before broader drawdown work.
- **Sprint 91 — Contained prototype Details density.** Complete 2026-05-21. Added Details density checks for the contained prototype.
- **Sprint 92 — Contained prototype review checklist.** Complete 2026-05-21. Added a short review checklist before interpreting prototype evidence.
- **Sprint 93 — Contained prototype example gate.** Complete 2026-05-21. Added example readiness gating while keeping product UI honest about test-only matrix coverage.
- **Sprint 94 — Contained prototype copy guard.** Complete 2026-05-21. Added copy and saved-plan boundary checks.
- **Sprint 95 — Contained prototype product go/no-go.** Complete 2026-05-21. Added a combined Details-only go/no-go for broader drawdown readiness.
- **Sprint 96 — Contained prototype promotion readiness.** Complete 2026-05-21. Added conservative promotion-readiness checks without moving the prototype.
- **Sprint 97 — Contained prototype next-step guide.** Complete 2026-05-21. Added review steps that avoid account instructions.
- **Sprint 98 — Contained prototype blocker register.** Complete 2026-05-21. Added held and blocked signal tracking for the contained prototype.
- **Sprint 99 — Contained prototype example promotion gate.** Complete 2026-05-21. Added example promotion gate coverage.
- **Sprint 100 — Contained prototype phase milestone.** Complete 2026-05-21. Added a combined milestone closeout before broader drawdown work.
- **Sprint 101 — V1 drawdown execution intent.** Complete 2026-05-21. Recorded that v1 includes bounded execution.
- **Sprint 102 — V1 bounded execution candidate.** Complete 2026-05-21. Added one existing-engine execution candidate from an accepted draft shape.
- **Sprint 103 — V1 bounded execution result.** Complete 2026-05-21. Ran one bounded scenario comparison with harm checks.
- **Sprint 104 — V1 execution review and example gate.** Complete 2026-05-21. Added review and example coverage for the executed scenario.
- **Sprint 105 — V1 execution phase closeout.** Complete 2026-05-21. Added a closeout before later consumer execution UX.
- **Sprint 106 — V1 drawdown plain summary.** Complete 2026-05-21. Added what-ran, what-changed, and unchanged-plan summary.
- **Sprint 107 — V1 drawdown safety checklist.** Complete 2026-05-21. Added funding, estate, saved-plan, and instruction checks.
- **Sprint 108 — V1 drawdown consumer limits.** Complete 2026-05-21. Added visible limits for the bounded execution result.
- **Sprint 109 — V1 drawdown consumer example gate.** Complete 2026-05-21. Added example coverage for the consumer-readable layer.
- **Sprint 110 — V1 drawdown consumer closeout.** Complete 2026-05-21. Added closeout before UX copy work.
- **Sprint 111 — Bounded drawdown UX headline.** Complete 2026-05-21. Added a plain Details-only headline for the bounded drawdown check.
- **Sprint 112 — Bounded drawdown comparison card.** Complete 2026-05-21. Added a compact current-plan comparison card for bounded execution evidence.
- **Sprint 113 — Bounded drawdown review actions.** Complete 2026-05-21. Added short review actions without creating account instructions.
- **Sprint 114 — Bounded drawdown UX copy guard.** Complete 2026-05-21. Added copy guardrails for recommendation, guarantee, instruction, and saved-plan boundaries.
- **Sprint 115 — Bounded drawdown UX readiness closeout.** Complete 2026-05-21. Added a closeout for whether the UX candidate is ready for later design polish.
- **Sprint 116 — Runtime boundary metadata.** Complete 2026-05-21. Recorded explicit plan-object simulation boundaries and remaining bridge ownership.
- **Sprint 117 — Preview runner boundary.** Complete 2026-05-21. Recorded runner injection, working-copy scenarios, survivor config, and non-persistence boundaries.
- **Sprint 118 — Engine extraction readiness selector.** Complete 2026-05-21. Added runtime-only extraction readiness rows.
- **Sprint 119 — Engine extraction example and persistence gate.** Complete 2026-05-21. Added built-in example and saved-plan coverage.
- **Sprint 120 — Engine extraction readiness closeout.** Complete 2026-05-21. Marked narrow stress-helper extraction as the next logical slice.
- **Sprint 121 — Baseline stress helper module.** Complete 2026-05-21. Moved baseline stress read logic into an engine-owned helper.
- **Sprint 122 — Stress selector compatibility exports.** Complete 2026-05-21. Kept React-facing stress selectors stable.
- **Sprint 123 — Stress extraction boundary.** Complete 2026-05-21. Added runtime-only metadata for extracted and held stress surfaces.
- **Sprint 124 — Stress helper example coverage.** Complete 2026-05-21. Added built-in example and saved-plan coverage.
- **Sprint 125 — Stress helper extraction closeout.** Complete 2026-05-21. Kept scenario stress, Monte Carlo, and historical sequence migration as later slices.
- **Sprint 126 — Spending stress rerun helper.** Complete 2026-05-21. Moved nearby spending stress working-copy reruns into the stress helper.
- **Sprint 127 — Spending stress summary helper.** Complete 2026-05-21. Moved spending stress interpretation into the stress helper.
- **Sprint 128 — Preview spending stress compatibility.** Complete 2026-05-21. Kept preview bundle output stable while delegating spending stress work.
- **Sprint 129 — Spending stress guardrail tests.** Complete 2026-05-21. Added working-copy, skip-logic, example, and saved-plan coverage.
- **Sprint 130 — Spending stress ownership closeout.** Complete 2026-05-21. Marked spending stress as stress-helper-owned while richer stress migrations remain later.
- **Sprint 131 — Detailed stress boundary map.** Complete 2026-05-21. Recorded detailed-report ownership for Monte Carlo and historical stress tools.
- **Sprint 132 — Detailed stress probe and persistence guardrails.** Complete 2026-05-21. Added probe coverage and saved-plan boundary rows.
- **Sprint 133 — Detailed stress no-migration closeout.** Complete 2026-05-21. Kept detailed stress execution in the detailed-report path.
- **Sprint 134 — Detailed stress adapter next step.** Complete 2026-05-21. Marked adapter-contract design as the next safe migration slice.
- **Sprint 135 — Detailed stress boundary closeout.** Complete 2026-05-21. Covered blocked and adapter-ready states without moving detailed stress execution.
- **Sprint 136 — Thin detailed stress adapter contract.** Complete 2026-05-21. Added runtime-only explicit plan/config adapter metadata.
- **Sprint 137 — Detailed stress injected runner boundary.** Complete 2026-05-21. Kept detailed stress execution behind detailed-report runner ownership.
- **Sprint 138 — Detailed stress output guardrails.** Complete 2026-05-21. Required existing output shapes and unsaved adapter output.
- **Sprint 139 — Detailed stress adapter validation.** Complete 2026-05-21. Validated boundary review, migration closeout, probes, and saved-plan guardrails together.
- **Sprint 140 — Detailed stress adapter contract closeout.** Complete 2026-05-21. Closed the batch as ready for a contained injected-runner prototype.
- **Sprint 141 — Detailed stress explicit request.** Complete 2026-05-22. Added a copied explicit plan/config request after adapter validation passes.
- **Sprint 142 — Detailed stress injected runner harness.** Complete 2026-05-22. Added a contained harness that calls only a supplied injected runner.
- **Sprint 143 — Detailed stress prototype output validation.** Complete 2026-05-22. Blocked malformed detailed stress output shape metadata.
- **Sprint 144 — Detailed stress prototype persistence guardrails.** Complete 2026-05-22. Kept request, result, and closeout output runtime-only.
- **Sprint 145 — Detailed stress prototype closeout.** Complete 2026-05-22. Closed the batch as ready for a future probe-backed runner bridge.
- **Sprint 146 — Detailed stress probe coverage summary.** Complete 2026-05-22. Added runtime-only probe coverage summary for bridge work.
- **Sprint 147 — Detailed stress probe-backed bridge readiness.** Complete 2026-05-22. Required prototype, coverage, runner injection, and saved-plan guardrails.
- **Sprint 148 — Detailed stress guarded bridge run.** Complete 2026-05-22. Added a bridge run that calls only when readiness is clean.
- **Sprint 149 — Detailed stress bridge persistence guardrails.** Complete 2026-05-22. Kept bridge evidence runtime-only.
- **Sprint 150 — Detailed stress bridge closeout.** Complete 2026-05-22. Closed the batch as ready for manual detailed-report comparison.
- **Sprint 151 — Detailed stress report reference metadata.** Complete 2026-05-22. Added runtime-only detailed-report reference metadata.
- **Sprint 152 — Detailed stress manual comparison rows.** Complete 2026-05-22. Compared bridge output to detailed-report reference metadata.
- **Sprint 153 — Detailed stress review and block thresholds.** Complete 2026-05-22. Marked metric differences for review and blocked bad paths.
- **Sprint 154 — Detailed stress comparison persistence guardrails.** Complete 2026-05-22. Kept comparison evidence runtime-only.
- **Sprint 155 — Detailed stress manual comparison closeout.** Complete 2026-05-22. Closed the batch as ready for a migrate-or-defer checkpoint.
- **Sprint 156 — Detailed stress v1 decision selector.** Complete 2026-05-22. Added runtime-only detailed-stress v1 decision rows.
- **Sprint 157 — Detailed stress v1 deferral decision.** Complete 2026-05-22. Defaulted clean comparison to keeping detailed stress in the detailed report for v1.
- **Sprint 158 — Detailed stress decision review paths.** Complete 2026-05-22. Added review and blocked paths for the v1 decision.
- **Sprint 159 — Detailed stress decision persistence guardrails.** Complete 2026-05-22. Kept decision evidence runtime-only.
- **Sprint 160 — Detailed stress v1 decision closeout.** Complete 2026-05-22. Returned focus to recommended-plan and bounded drawdown execution work.
- **Sprint 161 — V1 drawdown re-entry review.** Complete 2026-05-22. Added runtime-only re-entry review after detailed stress deferral.
- **Sprint 162 — V1 drawdown next sprint plan.** Complete 2026-05-22. Marked recommended-plan framing and bounded drawdown review polish as next.
- **Sprint 163 — V1 drawdown re-entry guardrails.** Complete 2026-05-22. Added hold and block paths for re-entry.
- **Sprint 164 — V1 drawdown re-entry persistence.** Complete 2026-05-22. Kept re-entry evidence runtime-only.
- **Sprint 165 — V1 drawdown re-entry closeout.** Complete 2026-05-22. Closed the session ready for the next bounded drawdown sprint.
- **Sprint 166 — Recommended-plan drawdown review.** Complete 2026-05-22. Framed bounded drawdown execution as Details review evidence.
- **Sprint 167 — V1 drawdown Details placement.** Complete 2026-05-22. Kept comparison rows, limits, and review actions in Details.
- **Sprint 168 — V1 drawdown review copy guard.** Complete 2026-05-22. Added copy guardrails for review-only framing.
- **Sprint 169 — Recommended-plan drawdown persistence.** Complete 2026-05-22. Kept recommended-plan drawdown polish evidence runtime-only.
- **Sprint 170 — Recommended-plan drawdown closeout.** Complete 2026-05-22. Marked Details-facing drawdown review polish ready for implementation.
- **Sprint 171 — Details drawdown review wiring.** Complete 2026-05-22. Threaded recommended-plan drawdown review selectors into React preview state.
- **Sprint 172 — Recommended-plan drawdown Details UI.** Complete 2026-05-22. Surfaced recommended-plan drawdown review, placement, and closeout evidence in Details.
- **Sprint 173 — Drawdown review copy guard UI.** Complete 2026-05-22. Made review copy guard checks visible in Details.
- **Sprint 174 — Drawdown review Overview and persistence guardrails.** Complete 2026-05-22. Added structure coverage for Details-only placement.
- **Sprint 175 — Details drawdown review closeout.** Complete 2026-05-22. Closed the Details-facing implementation batch before v1 copy polish.
- **Sprint 176 — Drawdown review visible label scrub.** Complete 2026-05-22. Replaced implementation-style visible labels with consumer-facing review language.
- **Sprint 177 — Drawdown review selector copy polish.** Complete 2026-05-22. Reworded selector copy that flows into the page.
- **Sprint 178 — Drawdown review plain-language guardrail.** Complete 2026-05-22. Added tests that block implementation labels from recommended-plan drawdown copy.
- **Sprint 179 — Drawdown review Overview boundary retest.** Complete 2026-05-22. Kept the polished drawdown review out of Overview.
- **Sprint 180 — Drawdown review copy polish closeout.** Complete 2026-05-22. Closed copy polish and prepared the next path for v1 checkpoint work.
- **Sprint 181 — Release readiness selector.** Complete 2026-05-22. Added a runtime-only checkpoint for the v1 feedback pass.
- **Sprint 182 — Release readiness Details surface.** Complete 2026-05-22. Surfaced release-readiness rows in Details.
- **Sprint 183 — Release readiness guardrail tests.** Complete 2026-05-22. Added ready and blocked checkpoint tests without persisted output.
- **Sprint 184 — Release readiness Overview boundary.** Complete 2026-05-22. Kept the release-readiness checkpoint out of Overview.
- **Sprint 185 — Release readiness checkpoint closeout.** Complete 2026-05-22. Closed checkpoint preparation before the broader v1 feedback package.
- **Sprint 186 — Feedback review package selector.** Complete 2026-05-22. Added a runtime-only package for the upcoming v1 feedback pass.
- **Sprint 187 — Feedback review Details surface.** Complete 2026-05-22. Surfaced feedback rows and review script in Details.
- **Sprint 188 — Feedback review package guardrails.** Complete 2026-05-22. Added ready and blocked package tests without persisted output.
- **Sprint 189 — Feedback review Overview boundary.** Complete 2026-05-22. Kept the feedback package out of Overview.
- **Sprint 190 — Feedback review package closeout.** Complete 2026-05-22. Closed package preparation before the broader feedback checkpoint.
- **Sprint 191 — Checkpoint review board selector.** Complete 2026-05-22. Added a runtime-only checkpoint review board selector.
- **Sprint 192 — Checkpoint feedback buckets.** Complete 2026-05-22. Grouped checkpoint items into fix-first, review-now, and later-UX-pass lanes.
- **Sprint 193 — Checkpoint review Details surface.** Complete 2026-05-22. Surfaced the checkpoint review board in Details.
- **Sprint 194 — Checkpoint review guardrails.** Complete 2026-05-22. Added selector and structure tests for board state, placement, and persistence boundaries.
- **Sprint 195 — Checkpoint review board closeout.** Complete 2026-05-22. Closed the checkpoint board batch before broader user/model review.
- **Sprint 196 — Checkpoint trust response.** Complete 2026-05-23. Started the checkpoint response batch with narrow trust fixes.
- **Sprint 197 — Save backup trust.** Complete 2026-05-23. Added backup reminders and save-before-results/report prompts.
- **Sprint 198 — Overview density trim.** Complete 2026-05-23. Removed compact optimizer and readiness diagnostics from Overview.
- **Sprint 199 — Scope and diagnostic copy.** Complete 2026-05-23. Made Ontario scope visible and removed diagnostic withdrawal wording from consumer intake.
- **Sprint 200 — Checkpoint panels gate.** Complete 2026-05-23. Gated checkpoint-only panels out of the normal consumer Details path.
- **Sprint 201 — Pension-splitting baseline investigation.** Complete 2026-05-23. Decided DB pension splitting belongs in the eligible two-person current-plan baseline.
- **Sprint 202 — Baseline DB pension splitting.** Complete 2026-05-23. Included DB pension splitting in current-plan baseline configs.
- **Sprint 203 — Pension candidate discipline.** Complete 2026-05-23. Prevented DB pension splitting from appearing as a found optimizer improvement when already included.
- **Sprint 204 — Pension baseline copy.** Complete 2026-05-23. Added plain Results copy for DB pension baseline inclusion.
- **Sprint 205 — Pension baseline guardrails.** Complete 2026-05-23. Added tests for baseline, candidate, and UI copy behavior.
- **Sprint 206 — Legacy probe repair.** Complete 2026-05-23. Moved broken legacy probes off brittle dashboard inline-script extraction.
- **Sprint 207 — Canadian rule probe coverage.** Complete 2026-05-23. Repaired spousal RRSP, CPP sharing, and OAS recovery probes.
- **Sprint 208 — Account and sustain probe coverage.** Complete 2026-05-23. Repaired account-balance, withdrawal-order, and sustainable-spending probes.
- **Sprint 209 — Probe suite promotion.** Complete 2026-05-23. Added the repaired probes to the canonical runner.
- **Sprint 210 — Probe repair closeout.** Complete 2026-05-23. Closed the verification repair batch and returned the path to optimizer/drawdown work.
- **Sprint 211 — Drawdown implementation gate.** Complete 2026-05-23. Added a final runtime-only gate before bounded drawdown evidence can be treated as recommended-plan evidence.
- **Sprint 212 — Drawdown recommended-plan narrative.** Complete 2026-05-23. Added a plain narrative around the bounded drawdown check.
- **Sprint 213 — Drawdown recommended-plan example gate.** Complete 2026-05-23. Added a built-in example coverage gate for recommended-plan drawdown readiness.
- **Sprint 214 — Drawdown implementation copy and persistence.** Complete 2026-05-23. Added copy and persistence guardrails for the new implementation layer.
- **Sprint 215 — Drawdown implementation closeout.** Complete 2026-05-23. Closed the implementation gate batch before the next v1 checkpoint.
- **Sprint 216 — Drawdown v1 checkpoint review.** Complete 2026-05-23. Added a runtime-only checkpoint review for the bounded drawdown implementation layer.
- **Sprint 217 — Drawdown checkpoint example matrix.** Complete 2026-05-23. Extended built-in example coverage through the checkpoint review layer.
- **Sprint 218 — Drawdown checkpoint copy guard.** Complete 2026-05-23. Protected checkpoint copy from recommendation, certainty, and instruction language.
- **Sprint 219 — Drawdown checkpoint persistence.** Complete 2026-05-23. Locked checkpoint review output out of saved plan files.
- **Sprint 220 — Drawdown checkpoint closeout.** Complete 2026-05-23. Closed the checkpoint batch before the next development pass.
- **Sprint 221 — Intake navigation and save clarity.** Complete 2026-05-23. Added top-of-step navigation behavior and clearer local-save copy.
- **Sprint 222 — Required field guidance.** Complete 2026-05-23. Added field-level attention styling and validation warnings for income/spending friction points.
- **Sprint 223 — Today’s dollars label audit.** Complete 2026-05-23. Clarified today's-dollar framing for DB pension, bridge pension, and spending labels.
- **Sprint 224 — CPP/OAS input clarity.** Complete 2026-05-23. Clarified CPP at 65 input, CPP timing tests, and OAS estimate copy.
- **Sprint 225 — Future income expansion notes.** Complete 2026-05-23. Captured multiple pensions, rental income, and one-time additions as future modelling work.
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
