# TASKS.md

The 2026-04-30 product reset made the planner consumer-first, local-first, and recommended-plan-first. Sprint 0 through Sprint 6 established the local-first app, React guided intake, and first React results workspace. The product direction is now the **Canadian retirement decision engine**: more Canada-specific, more explainable, and more decision-oriented than broad modelling labs like ProjectionLab.

Product direction doc: [`docs/canadian_retirement_decision_engine.md`](docs/canadian_retirement_decision_engine.md).

## Latest Sprint — Sprint 80: Drawdown Execution Phase Closeout

**Status:** Complete 2026-05-20.

Goal: add the last readiness layer before any real drawdown execution prototype by checking preflight, audit trail, containment, examples, and saved-plan boundaries.

Non-scope: product annual override execution, detailed account instructions, automatic strategy application, highlighted drawdown recommendations, persisted optimizer output, new engine schema/output, cloud accounts, advisor tooling, or report migration.

Sprint 80 checkpoint doc: [`docs/sprint_80_drawdown_execution_phase_closeout.md`](docs/sprint_80_drawdown_execution_phase_closeout.md).

### Sprint 76-80 Candidate Implementation Tickets

- [x] **S76-01 — Prototype preflight.** Check go/no-go, adapter, account mix, locked-in accounts, saved-plan boundary, and product path before any real prototype.
- [x] **S77-01 — Adapter audit trail.** Explain the draft adapter source, year, account area, amount band, direction, and guardrails without creating instructions.
- [x] **S78-01 — Execution containment guard.** Prove the work remains Details-only, has no plan action, does not run override calculations, does not save output, and uses only one draft shape.
- [x] **S79-01 — Example matrix checkpoint.** Extend all-example coverage across preflight, audit trail, containment, closeout, copy posture, and saved-plan boundaries.
- [x] **S80-01 — Phase closeout.** Summarize whether the next phase is ready, should hold, or must stop before real execution work.

### Sprint 80 Definition Of Done

- Prototype preflight, draft audit trail, containment guard, and phase closeout appear only in Details.
- Preflight intentionally holds while the product path remains closed.
- Adapter audit trail explains the draft shape without turning it into household instructions.
- Containment guard confirms there is no product action, override calculation, saved output, or multi-draft expansion.
- Example matrix covers the new execution-readiness layer.
- Overview remains unchanged.
- Optimizer contract remains current-order with no annual overrides.
- No drawdown draft, sandbox, comparison readiness, hidden comparison, decision gate, runtime payload, internal dry-run, readiness review, visible gate, preview, phase review, boundary decision, adapter validation, mocked scorecard, go/no-go, preflight, audit trail, containment guard, example checkpoint, closeout, mocked payload, or prototype output is persisted.
- No optimizer output is persisted.
- No engine output or saved plan schema change is introduced.
- Verification passes and no private `.plan.json` files are created.

## Completed Sprints

### Sprint 80: Drawdown Execution Phase Closeout

**Complete 2026-05-20.** Added a Details-only closeout that summarizes preflight, adapter audit trail, containment, example coverage, and saved-plan boundaries before the next phase.

Sprint 80 checkpoint doc: [`docs/sprint_80_drawdown_execution_phase_closeout.md`](docs/sprint_80_drawdown_execution_phase_closeout.md).

### Sprint 79: Execution Example Matrix Checkpoint

**Complete 2026-05-20.** Extended all-example coverage across execution preflight, adapter audit trail, containment guard, phase closeout, copy posture, and persistence boundaries.

Sprint 79 checkpoint doc: [`docs/sprint_79_execution_example_matrix_checkpoint.md`](docs/sprint_79_execution_example_matrix_checkpoint.md).

### Sprint 78: Execution Containment Guard

**Complete 2026-05-20.** Added a Details-only containment guard proving the drawdown execution work has no plan action, no override calculation, no saved output, and only one draft shape.

Sprint 78 checkpoint doc: [`docs/sprint_78_execution_containment_guard.md`](docs/sprint_78_execution_containment_guard.md).

### Sprint 77: Adapter Audit Trail

**Complete 2026-05-20.** Added a draft adapter audit trail that explains source, year, account area, amount band, direction, and guardrails without creating household instructions.

Sprint 77 checkpoint doc: [`docs/sprint_77_adapter_audit_trail.md`](docs/sprint_77_adapter_audit_trail.md).

### Sprint 76: Prototype Preflight

**Complete 2026-05-20.** Added a Details-only preflight check for go/no-go, adapter, account mix, locked-in accounts, saved-plan boundary, and closed product path.

Sprint 76 checkpoint doc: [`docs/sprint_76_prototype_preflight.md`](docs/sprint_76_prototype_preflight.md).

### Sprint 75: Execution Prototype Go/No-Go

**Complete 2026-05-20.** Added a Details-only checkpoint that summarizes boundary, adapter, mocked-scorecard, saved-plan, and product-scope posture before any real drawdown execution prototype is attempted.

Sprint 75 checkpoint doc: [`docs/sprint_75_execution_prototype_go_no_go.md`](docs/sprint_75_execution_prototype_go_no_go.md).

### Sprint 74: One Mocked Execution Scorecard

**Complete 2026-05-20.** Added a test-only mocked scorecard that can compare supplied baseline and candidate rows for funding, tax, OAS recovery, and estate posture without product execution.

Sprint 74 checkpoint doc: [`docs/sprint_74_mocked_execution_scorecard.md`](docs/sprint_74_mocked_execution_scorecard.md).

### Sprint 73: Test-Only Adapter Rejection Harness

**Complete 2026-05-20.** Added adapter validation that rejects unsafe annual-override draft shapes while preserving current withdrawal order and empty annual overrides.

Sprint 73 checkpoint doc: [`docs/sprint_73_test_only_adapter_rejection_harness.md`](docs/sprint_73_test_only_adapter_rejection_harness.md).

### Sprint 72: Annual Override Adapter Shape

**Complete 2026-05-20.** Added a draft adapter shape for one eligible runtime contract payload without passing it to the simulation engine or saving it.

Sprint 72 checkpoint doc: [`docs/sprint_72_annual_override_adapter_shape.md`](docs/sprint_72_annual_override_adapter_shape.md).

### Sprint 71: Drawdown Execution Boundary Decision

**Complete 2026-05-20.** Added a Details-only boundary decision that decides whether to keep preview-only evidence, harden guardrails, or prepare a tiny future prototype.

Sprint 71 checkpoint doc: [`docs/sprint_71_drawdown_execution_boundary_decision.md`](docs/sprint_71_drawdown_execution_boundary_decision.md).

### Sprint 70: Drawdown Phase Review & Go/No-Go

**Complete 2026-05-20.** Added a Details-only phase review that summarizes gate, preview, example, stress, copy, and saved-plan posture before any deeper drawdown execution.

Sprint 70 checkpoint doc: [`docs/sprint_70_drawdown_phase_review_go_no_go.md`](docs/sprint_70_drawdown_phase_review_go_no_go.md).

### Sprint 69: Drawdown Preview Stress & Harm Checks

**Complete 2026-05-20.** Added stress and harm checks so the visible preview is held back under fragile spending stress and blocked when funding or entered estate-goal harm appears.

Sprint 69 checkpoint doc: [`docs/sprint_69_drawdown_preview_stress_harm_checks.md`](docs/sprint_69_drawdown_preview_stress_harm_checks.md).

### Sprint 68: Drawdown Preview Example Matrix

**Complete 2026-05-20.** Extended the built-in example matrix to cover final preview gate status, Details preview status, phase review status, copy boundaries, and saved-plan persistence.

Sprint 68 checkpoint doc: [`docs/sprint_68_drawdown_preview_example_matrix.md`](docs/sprint_68_drawdown_preview_example_matrix.md).

### Sprint 67: Visible Drawdown Review Preview

**Complete 2026-05-20.** Added a narrow Details-only drawdown review preview that shows high-level funding, tax, OAS recovery, and projected-money-left evidence when final guardrails allow it.

Sprint 67 checkpoint doc: [`docs/sprint_67_visible_drawdown_review_preview.md`](docs/sprint_67_visible_drawdown_review_preview.md).

### Sprint 66: Drawdown Prototype Decision Gate

**Complete 2026-05-20.** Added a final visible-review gate for the drawdown prototype that requires eligible comparison evidence, a ready runtime contract, a clean saved-plan boundary, and no visible harm.

Sprint 66 checkpoint doc: [`docs/sprint_66_drawdown_prototype_decision_gate.md`](docs/sprint_66_drawdown_prototype_decision_gate.md).

### Sprint 65: Drawdown Prototype Readiness Review

**Complete 2026-05-20.** Added a Details-only readiness review that summarizes the decision gate, runtime contract, saved-plan boundary, and internal dry-run posture before any user-facing drawdown prototype exists.

Sprint 65 checkpoint doc: [`docs/sprint_65_drawdown_prototype_readiness_review.md`](docs/sprint_65_drawdown_prototype_readiness_review.md).

### Sprint 64: Internal Drawdown Dry-Run Harness

**Complete 2026-05-20.** Added a test-only internal dry-run path for one bounded drawdown payload shape. It returns review evidence only and is not reachable from product UI.

Sprint 64 checkpoint doc: [`docs/sprint_64_internal_drawdown_dry_run_harness.md`](docs/sprint_64_internal_drawdown_dry_run_harness.md).

### Sprint 63: Drawdown Execution Contract v1

**Complete 2026-05-20.** Added a runtime-only drawdown execution contract and payload validation layer while preserving current withdrawal order, empty annual overrides, saved plan shape, and engine output.

Sprint 63 checkpoint doc: [`docs/sprint_63_drawdown_execution_contract_v1.md`](docs/sprint_63_drawdown_execution_contract_v1.md).

### Sprint 62: Drawdown Comparison Explainer Polish

**Complete 2026-05-20.** Added plain summary and next-step copy to the drawdown comparison decision gate so held-back, blocked, and eligible states are easier to understand.

Sprint 62 checkpoint doc: [`docs/sprint_62_drawdown_comparison_explainer_polish.md`](docs/sprint_62_drawdown_comparison_explainer_polish.md).

### Sprint 61: Drawdown Gate Example Hardening

**Complete 2026-05-20.** Hardened drawdown decision gate tests across materiality, funding harm, locked-in upstream readiness, and built-in examples before adding execution-contract work.

Sprint 61 checkpoint doc: [`docs/sprint_61_drawdown_gate_example_hardening.md`](docs/sprint_61_drawdown_gate_example_hardening.md).

### Sprint 60: Drawdown Comparison Decision Gate

**Complete 2026-05-20.** Added a Details-only decision gate for hidden drawdown comparisons, with materiality, funding harm, estate, survivor, locked-in account, and saved-plan guardrails before any later highlight path.

Sprint 60 checkpoint doc: [`docs/sprint_60_drawdown_comparison_decision_gate.md`](docs/sprint_60_drawdown_comparison_decision_gate.md).

### Sprint 59: Drawdown Comparison Evidence Surface

**Complete 2026-05-20.** Added a compact Details-only drawdown comparison evidence panel that shows review evidence when available and a plain blocked reason when not ready, without changing the plan or creating account instructions.

Sprint 59 checkpoint doc: [`docs/sprint_59_drawdown_comparison_evidence_surface.md`](docs/sprint_59_drawdown_comparison_evidence_surface.md).

### Sprint 58: Hidden Drawdown Example Matrix

**Complete 2026-05-19.** Added all-example guardrail coverage for the hidden drawdown comparison, confirming it remains hidden, review-only, unsaved, and free of account-instruction language before any Details evidence surface.

Sprint 58 checkpoint doc: [`docs/sprint_58_hidden_drawdown_example_matrix.md`](docs/sprint_58_hidden_drawdown_example_matrix.md).

### Sprint 57: Hidden Drawdown Comparison Candidate

**Complete 2026-05-19.** Added one hidden registered-timing comparison candidate using existing simulation plumbing and gated by comparison readiness. It returns review-only evidence and remains out of UI and saved plans.

Sprint 57 checkpoint doc: [`docs/sprint_57_hidden_drawdown_comparison_candidate.md`](docs/sprint_57_hidden_drawdown_comparison_candidate.md).

### Sprint 56: Drawdown Comparison Readiness Review

**Complete 2026-05-19.** Added a Details-only comparison-readiness review that summarizes draft checks, sandbox gate, account evidence, and household guardrails before any real drawdown comparison exists.

Sprint 56 checkpoint doc: [`docs/sprint_56_drawdown_comparison_readiness_review.md`](docs/sprint_56_drawdown_comparison_readiness_review.md).

### Sprint 55: Mocked Drawdown Sandbox Comparison

**Complete 2026-05-19.** Added a test-only, gate-aware synthetic comparison runner that scores a queued drawdown sandbox draft against mocked output and rejects invalid payloads before scoring. No product execution, UI surface, saved output, or engine schema change was added.

Sprint 55 checkpoint doc: [`docs/sprint_55_mocked_drawdown_sandbox_comparison.md`](docs/sprint_55_mocked_drawdown_sandbox_comparison.md).

### Sprint 54: Drawdown Sandbox Gate

**Complete 2026-05-19.** Added a Details-only future sandbox gate that chooses one validated drawdown draft check to hold for later comparison, or explains what blocks it, without running annual overrides or saving output.

Sprint 54 checkpoint doc: [`docs/sprint_54_drawdown_sandbox_gate.md`](docs/sprint_54_drawdown_sandbox_gate.md).

### Sprint 53: Bounded Drawdown Execution Readiness

**Complete 2026-05-19.** Added Details-only future drawdown draft checks, validation statuses, readiness blockers, and a test-only synthetic comparison harness while keeping current withdrawal order, annual overrides, saved plans, and engine output unchanged.

Sprint 53 checkpoint doc: [`docs/sprint_53_bounded_drawdown_execution_readiness.md`](docs/sprint_53_bounded_drawdown_execution_readiness.md).

### Sprint 52: Tax-Aware Drawdown Prototype Evidence

**Complete 2026-05-19.** Added Details-only tax-aware drawdown prototype evidence rows while keeping current withdrawal order, annual overrides, saved plans, and engine output unchanged.

Sprint 52 checkpoint doc: [`docs/sprint_52_tax_aware_drawdown_prototype_evidence.md`](docs/sprint_52_tax_aware_drawdown_prototype_evidence.md).

### Sprint 51: Benefit Timing Bridge-Year Clarity

**Complete 2026-05-19.** Refined CPP/OAS delay eligibility notes and added bridge-year evidence so benefit timing remains review-oriented before broader optimizer work.

Sprint 51 checkpoint doc: [`docs/sprint_51_benefit_timing_bridge_clarity.md`](docs/sprint_51_benefit_timing_bridge_clarity.md).

### Sprint 50: Plan Options Clarity & Candidate Discipline

**Complete 2026-05-19.** Added option grouping and Details copy that separates lifestyle, timing, income-sharing, drawdown, and home/estate checks while keeping bounded optimizer output review-only and unsaved.

Sprint 50 checkpoint doc: [`docs/sprint_50_plan_options_clarity.md`](docs/sprint_50_plan_options_clarity.md).

### Sprint 49: Home Equity Reliance & Estate Guardrails

**Complete 2026-05-18.** Added a review-only home-sale reliance check and estate-goal suggestion guardrails without adding home-sale recommendations, optimizer strategy application, or saved output.

Sprint 49 checkpoint doc: [`docs/sprint_49_home_equity_estate_guardrails.md`](docs/sprint_49_home_equity_estate_guardrails.md).

### Sprint 48: CPP Sharing Review Candidate

**Complete 2026-05-18.** Added a narrow CPP sharing review candidate for eligible couples, with eligibility notes, tax/evidence rows, and persistence guardrails while keeping saved plans and engine output unchanged.

Sprint 48 checkpoint doc: [`docs/sprint_48_cpp_sharing_review_candidate.md`](docs/sprint_48_cpp_sharing_review_candidate.md).

### Sprint 47: Example-Plan Optimizer Readiness Matrix

**Complete 2026-05-18.** Added an example-plan readiness matrix that runs all bundled examples through Results preview, spending stress, drawdown readiness, and bounded optimizer guardrails without adding new optimizer behavior or saved output.

Sprint 47 checkpoint doc: [`docs/sprint_47_example_plan_optimizer_readiness_matrix.md`](docs/sprint_47_example_plan_optimizer_readiness_matrix.md).

### Sprint 46: Tax-Aware Drawdown Contract Readiness

**Complete 2026-05-18.** Added Details-only drawdown readiness evidence and reinforced the current-order withdrawal strategy contract without adding tax-aware drawdown execution or saved optimizer output.

Sprint 46 checkpoint doc: [`docs/sprint_46_tax_aware_drawdown_contract_readiness.md`](docs/sprint_46_tax_aware_drawdown_contract_readiness.md).

### Sprint 45: Spending Guardrail Stress

**Complete 2026-05-18.** Added runtime-only spending stress checks for nearby early-retirement spending levels, with Details evidence and review-only copy.

Sprint 45 checkpoint doc: [`docs/sprint_45_spending_guardrail_stress.md`](docs/sprint_45_spending_guardrail_stress.md).

### Sprint 44: Optimizer Recommendation Discipline

**Complete 2026-05-18.** Added a suggestion gate so disruptive options stay review-only unless they materially repair a visible funding problem, and added Details copy explaining why some options are not highlighted first.

Sprint 44 checkpoint doc: [`docs/sprint_44_optimizer_recommendation_discipline.md`](docs/sprint_44_optimizer_recommendation_discipline.md).

### Sprint 43: Optimizer Guardrails & Timing Integrity

**Complete 2026-05-18.** Tightened bounded optimizer eligibility for CPP/OAS delay, work timing, pension splitting, and withdrawal-order checks; added Details guardrail notes explaining why option families were tested or skipped.

Sprint 43 checkpoint doc: [`docs/sprint_43_optimizer_guardrails_timing_integrity.md`](docs/sprint_43_optimizer_guardrails_timing_integrity.md).

### Sprint 42: Optimizer Tax-Driver Explanations

**Complete 2026-05-18.** Added selected-option tax and funding driver rows for lifetime tax, peak tax, OAS recovery tax, funded years, and projected money left while keeping optimizer output review-only.

Sprint 42 checkpoint doc: [`docs/sprint_42_optimizer_tax_driver_explanations.md`](docs/sprint_42_optimizer_tax_driver_explanations.md).

### Sprint 41: Pension-Splitting Evidence Rows

**Complete 2026-05-18.** Added pension-splitting evidence rows for tax, OAS recovery tax, and projected money-left movement while keeping the optimizer review-only.

Sprint 41 checkpoint doc: [`docs/sprint_41_pension_splitting_evidence_rows.md`](docs/sprint_41_pension_splitting_evidence_rows.md).

### Sprint 40: Bounded Optimizer Search Expansion

**Complete 2026-05-18.** Added one narrow pension-splitting optimizer candidate with eligibility gating and review-oriented explanation while avoiding broad search expansion.

Sprint 40 checkpoint doc: [`docs/sprint_40_bounded_optimizer_search_expansion.md`](docs/sprint_40_bounded_optimizer_search_expansion.md).

### Sprint 39: Optimizer Eligibility Refinement

**Complete 2026-05-17.** Added eligibility gates and visible included/skipped/review-first notes for bounded optimizer levers before widening optimizer search.

Sprint 39 checkpoint doc: [`docs/sprint_39_optimizer_eligibility_refinement.md`](docs/sprint_39_optimizer_eligibility_refinement.md).

### Sprint 38: Optimizer Explanation Depth

**Complete 2026-05-17.** Added structured bounded-optimizer explanations, Overview and Details explanation surfaces, and tests that keep the first optimizer output review-oriented before widening search.

Sprint 38 checkpoint doc: [`docs/sprint_38_optimizer_explanation_depth.md`](docs/sprint_38_optimizer_explanation_depth.md).

### Sprint 37: Bounded Optimizer Execution

**Complete 2026-05-17.** Added the first limited optimizer runner, candidate scoring, consumer Results surfaces, and persistence guardrails while keeping optimizer output review-only and unsaved.

Sprint 37 checkpoint doc: [`docs/sprint_37_bounded_optimizer_execution.md`](docs/sprint_37_bounded_optimizer_execution.md).

### Sprint 36: Optimizer Contract & Engine Safety

**Complete 2026-05-17.** Added a non-executing optimizer contract, safe simulation wrapper, edge-case validation coverage, clearer example working-copy status, and consumer-facing intake label polish before optimizer extraction.

Sprint 36 checkpoint doc: [`docs/sprint_36_optimizer_contract_engine_safety.md`](docs/sprint_36_optimizer_contract_engine_safety.md).

### Sprint 35.5: Feedback Gate Cleanup

**Complete 2026-05-17.** Addressed tester feedback before optimizer extraction by neutralizing tax copy, replacing internal shortfall wording, clarifying the printable-report bridge, adding example parity coverage, and guarding spending estimate humility.

Sprint 35.5 checkpoint doc: [`docs/sprint_35_5_feedback_gate_cleanup.md`](docs/sprint_35_5_feedback_gate_cleanup.md).

### Sprint 35: Results Trust & Readiness

**Complete 2026-05-16.** Strengthened the React Results Overview hero, reframed spending capacity as a today's-dollar planning estimate, added prioritized review actions, demoted dense scenario/recommendation panels, and scrubbed remaining internal copy from live Results UI.

Sprint 35 checkpoint doc: [`docs/sprint_35_results_trust_readiness.md`](docs/sprint_35_results_trust_readiness.md).

### Sprint 34: DB Survivor Pension Inputs And Survivor Cash-Flow Accuracy

**Complete 2026-05-16.** Added per-person DB survivor continuation assumptions and used them in survivor reruns while preserving the historical 60% fallback for old plans.

Sprint 34 checkpoint doc: [`docs/sprint_34_db_survivor_pension.md`](docs/sprint_34_db_survivor_pension.md).

### Sprint 33: Save & Print Polish

**Complete 2026-05-16.** Split the end-of-results actions into consumer-facing Save editable plan and Open printable report paths while preserving the local plan file and detailed-report route.

Sprint 33 checkpoint doc: [`docs/sprint_33_save_print_polish.md`](docs/sprint_33_save_print_polish.md).

### Sprint 32: Overview Simplification

**Complete 2026-05-16.** Moved audit-style diagnostic panels from Overview into Details so the first Results page stays focused on the retirement answer, spending, estate intent, choices, survivor snapshot, and readiness.

Sprint 32 checkpoint doc: [`docs/sprint_32_overview_simplification.md`](docs/sprint_32_overview_simplification.md).

### Sprint 31: Consumer Copy Scrub

**Complete 2026-05-16.** Replaced remaining internal implementation language in the live React Results copy with consumer-facing detailed-report, money-flow, and review-step language.

Sprint 31 checkpoint doc: [`docs/sprint_31_consumer_copy_scrub.md`](docs/sprint_31_consumer_copy_scrub.md).

### Sprint 30: React Start Examples And Light Visual Alignment

**Complete 2026-05-16.** Added the bundled synthetic example plans to the modern React Start screen and lightly aligned the entry experience with the Results dashboard visual language.

Sprint 30 checkpoint doc: [`docs/sprint_30_react_start_examples_visual_alignment.md`](docs/sprint_30_react_start_examples_visual_alignment.md).

### Sprint 29: Optimizer Input Review And Guardrails

**Complete 2026-05-15.** Added runtime-only optimizer permission rows that separate can-explore levers, must-preserve wishes, and missing household decisions.

Sprint 29 checkpoint doc: [`docs/sprint_29_optimizer_input_review_guardrails.md`](docs/sprint_29_optimizer_input_review_guardrails.md).

### Sprint 28: Optimizer Prep And Decision Boundaries

**Complete 2026-05-15.** Added runtime-only optimizer boundary rows for spending, retirement timing, CPP/OAS timing, withdrawal order, estate target, and downsizing without adding optimizer execution.

Sprint 28 checkpoint doc: [`docs/sprint_28_optimizer_prep_decision_boundaries.md`](docs/sprint_28_optimizer_prep_decision_boundaries.md).

### Sprint 27: Scenario Choice Redesign

**Complete 2026-05-15.** Reframed scenario cards as household choices with best-for and trade-off copy while keeping detailed comparison tables as supporting evidence.

Sprint 27 checkpoint doc: [`docs/sprint_27_scenario_choice_redesign.md`](docs/sprint_27_scenario_choice_redesign.md).

### Sprint 26: Intake UX And Help Text

**Complete 2026-05-15.** Made the guided intake easier for non-expert households by explaining complex Canadian retirement inputs in plain language.

Sprint 26 checkpoint doc: [`docs/sprint_26_intake_ux_help_text.md`](docs/sprint_26_intake_ux_help_text.md).

### Sprint 25: Estate Intent And Tax Efficiency

**Complete 2026-05-15.** Made estate wishes and tax-efficiency review visible in the consumer Results story without adding legal estate planning, new tax rules, or optimizer behaviour.

Sprint 25 checkpoint doc: [`docs/sprint_25_estate_intent_tax_efficiency.md`](docs/sprint_25_estate_intent_tax_efficiency.md).

### Sprint 24: Spending Capacity Layer

**Complete 2026-05-15.** Answered "How much can I spend?" with a bounded consumer-facing spending posture derived from existing projections and scenario output.

Sprint 24 checkpoint doc: [`docs/sprint_24_spending_capacity_layer.md`](docs/sprint_24_spending_capacity_layer.md).

### Sprint 23: Consumer Results Simplification

**Complete 2026-05-14.** Simplified the top-level Results journey so consumers see the retirement answer, risks, taxes, survivor impact, details, and save/print paths without being forced through every advanced diagnostic table.

Sprint 23 checkpoint doc: [`docs/sprint_23_consumer_results_simplification.md`](docs/sprint_23_consumer_results_simplification.md).

### Sprint 22: Consumer Retirement Answer Layer

**Complete 2026-05-14.** Made the Results Overview answer the consumer's real retirement question first: whether the plan appears supportable, how spending fits, whether the estate outcome is intentional, and what to review next.

Sprint 22 checkpoint doc: [`docs/sprint_22_consumer_retirement_answer_layer.md`](docs/sprint_22_consumer_retirement_answer_layer.md).

### Sprint 21: Engine Extraction Scenario And Survivor Runner

**Complete 2026-05-14.** Extracted Results preview baseline, scenario, and survivor rerun orchestration from React into an engine-owned runtime helper so future optimizer work can use explicit plan-object boundaries.

Sprint 21 checkpoint doc: [`docs/sprint_21_engine_extraction_scenario_survivor_runner.md`](docs/sprint_21_engine_extraction_scenario_survivor_runner.md).

### Sprint 20: React Results Readiness And Save Handoff Polish

**Complete 2026-05-14.** Tightened the end-of-results workflow so users can understand blockers, remaining review items, save readiness, and stable-dashboard handoff before keeping a local plan file.

Sprint 20 checkpoint doc: [`docs/sprint_20_react_results_readiness_save_handoff.md`](docs/sprint_20_react_results_readiness_save_handoff.md).

### Sprint 19: React Survivor Detail Parity

**Complete 2026-05-14.** Deepened Household Resilience so two-person plans can understand survivor scenario readiness, funding, tax, and portfolio outcomes without using the stable dashboard for first-pass review.

Sprint 19 checkpoint doc: [`docs/sprint_19_react_survivor_detail_parity.md`](docs/sprint_19_react_survivor_detail_parity.md).

### Sprint 18: React Account Detail / Drawdown Parity

**Complete 2026-05-08.** Deepened the React Accounts tab so users can understand account balance movement, drawdown sources, and terminal portfolio risk without using the stable dashboard for first-pass review.

Sprint 18 checkpoint doc: [`docs/sprint_18_react_account_drawdown_parity.md`](docs/sprint_18_react_account_drawdown_parity.md).

### Sprint 17: React Tax Detail Parity

**Complete 2026-05-08.** Deepened the React Taxes tab so users can understand why tax changes over time, which tax items deserve review, and where the stable dashboard remains the full audit surface.

Sprint 17 checkpoint doc: [`docs/sprint_17_react_tax_detail_parity.md`](docs/sprint_17_react_tax_detail_parity.md).

### Sprint 17 Candidate Implementation Tickets

- [x] **S17-01 — Tax story summary selector.** ✅ *Done 2026-05-08.* Added runtime-only summary for status, peak tax, lifetime tax, OAS clawback, registered-withdrawal years, and planning windows.
- [x] **S17-02 — Tax review rows.** ✅ *Done 2026-05-08.* Added OAS clawback, registered withdrawal pressure, peak tax, and lower-tax planning-window rows.
- [x] **S17-03 — React Taxes panel.** ✅ *Done 2026-05-08.* Added story panel, review rows, metrics, and annual table.
- [x] **S17-04 — Stable dashboard handoff.** ✅ *Done 2026-05-08.* Kept full tax schedules, print/PDF, and legacy audit views in stable dashboard copy.
- [x] **S17-05 — Tests and docs.** ✅ *Done 2026-05-08.* Added selector/smoke coverage and Sprint 17 documentation.

### Sprint 17 Definition Of Done

- Taxes tab explains why tax changes over time and which items deserve review.
- Tax story output is runtime-only and derived from existing simulation rows.
- Copy remains review-oriented, not advice.
- Stable dashboard remains the full tax audit/report fallback.
- Runtime dashboard schema remains v2.
- Verification passes and no private `.plan.json` files are created.

### Sprint 16: React Stress Tests Parity

**Complete 2026-05-08.** Deepened the React Stress Tests tab so users can see what can go wrong, when it first appears, how severe it is, and which React detail area to review next.

Sprint 16 checkpoint doc: [`docs/sprint_16_react_stress_tests_parity.md`](docs/sprint_16_react_stress_tests_parity.md).

### Sprint 16 Candidate Implementation Tickets

- [x] **S16-01 — Stress summary selector.** ✅ *Done 2026-05-08.* Added runtime-only summary for status, funded years, first stress year, and main item.
- [x] **S16-02 — Stress evidence rows.** ✅ *Done 2026-05-08.* Added spending shortfall, depletion, cushion, tax pressure, and source reconciliation stress rows.
- [x] **S16-03 — React Stress Tests panel.** ✅ *Done 2026-05-08.* Added summary, evidence rows, review actions, and existing baseline indicators.
- [x] **S16-04 — Stable dashboard handoff.** ✅ *Done 2026-05-08.* Kept full Monte Carlo, sequence stress, print/PDF, and legacy charts in stable dashboard copy.
- [x] **S16-05 — Tests and docs.** ✅ *Done 2026-05-08.* Added selector/smoke coverage and Sprint 16 documentation.

### Sprint 16 Definition Of Done

- Stress Tests explains what can go wrong, when it first appears, and where to review.
- Stress output is runtime-only and derived from existing simulation rows.
- Language remains review-oriented, not advice.
- Stable dashboard remains the full stress-test fallback.
- Runtime dashboard schema remains v2.
- Verification passes and no private `.plan.json` files are created.

### Sprint 15: Entry Point And Handoff Reliability

**Complete 2026-05-07.** Made the stable intake, stable dashboard, and React preview entry points explicit, reliable, and regression-tested across local dev and Vercel preview deployment.

Sprint 15 checkpoint doc: [`docs/sprint_15_entrypoint_handoff_reliability.md`](docs/sprint_15_entrypoint_handoff_reliability.md).

### Sprint 15 Candidate Implementation Tickets

- [x] **S15-01 — Entry point contract.** ✅ *Done 2026-05-07.* Documented React preview, stable intake, stable dashboard, and engine helper routes.
- [x] **S15-02 — React stable URL helpers.** ✅ *Done 2026-05-07.* Centralized stable intake and stable dashboard links in React.
- [x] **S15-03 — Stable intake link audit.** ✅ *Done 2026-05-07.* Confirmed dashboard hash handoff uses `retirement_dashboard.html#`.
- [x] **S15-04 — Legacy route probe.** ✅ *Done 2026-05-07.* Added Vite route coverage for stable dashboard, stable intake, aliases, and engine helpers.
- [x] **S15-05 — Vercel preview staging.** ✅ *Done 2026-05-07.* Added React preview build staging so stable handoffs work on Vercel preview URLs.
- [x] **S15-06 — Docs and verification.** ✅ *Done 2026-05-07.* Added Sprint 15 docs, README notes, and canonical probe coverage.

### Sprint 15 Definition Of Done

- React preview links open the real stable dashboard and stable intake.
- Vite dev/preview serves stable dashboard, stable intake, and engine helper routes.
- Vercel preview build stages React plus stable fallback files.
- A route probe prevents stable-dashboard links from falling back to React.
- Runtime dashboard schema remains v2.
- Verification passes and no private `.plan.json` files are created.

### Sprint 14: React Results Polish And Handoff Audit

**Complete 2026-05-07.** Tightened the migrated React Results workspace so navigation, charts, tables, and stable-dashboard handoff copy feel consistent before adding more feature surface.

Sprint 14 checkpoint doc: [`docs/sprint_14_react_results_polish_handoff_audit.md`](docs/sprint_14_react_results_polish_handoff_audit.md).

### Sprint 14 Candidate Implementation Tickets

- [x] **S14-01 — Results navigation spacing.** ✅ *Done 2026-05-07.* Increased tab button height, spacing, and responsive wrapping so helper text sits clearly below titles.
- [x] **S14-02 — Handoff copy audit.** ✅ *Done 2026-05-07.* Centralized React tab intro and stable-dashboard handoff copy.
- [x] **S14-03 — Chart readability pass.** ✅ *Done 2026-05-07.* Improved chart panel spacing and responsive chart heights.
- [x] **S14-04 — Table readability pass.** ✅ *Done 2026-05-07.* Tightened table framing, row spacing, and first-column emphasis.
- [x] **S14-05 — Tests and docs.** ✅ *Done 2026-05-07.* Added Sprint 14 documentation and ran the standard verification suite.

### Sprint 14 Definition Of Done

- React Results navigation spacing is consistent across tab title/helper text.
- Handoff copy clearly distinguishes React coverage from stable-dashboard fallback.
- Charts and tables are more readable on desktop and narrow widths.
- No new result output or UI state is persisted.
- Runtime dashboard schema remains v2.
- Verification passes and no private `.plan.json` files are created.

### Sprint 13: React Results Chart Parity

**Complete 2026-05-07.** Added a bounded React chart layer around the migrated results panels so users can inspect the main projection visuals without jumping immediately to the stable dashboard.

Sprint 13 checkpoint doc: [`docs/sprint_13_react_results_chart_parity.md`](docs/sprint_13_react_results_chart_parity.md).

### Sprint 13 Candidate Implementation Tickets

- [x] **S13-01 — Chart selector contract.** ✅ *Done 2026-05-07.* Added runtime-only portfolio, spending/tax/shortfall, and account bucket chart series selectors.
- [x] **S13-02 — Annual Detail charts.** ✅ *Done 2026-05-07.* Added portfolio and spending/tax/shortfall charts above the annual table.
- [x] **S13-03 — Accounts chart.** ✅ *Done 2026-05-07.* Added an account bucket balance chart above the Accounts result tables.
- [x] **S13-04 — Stable dashboard handoff.** ✅ *Done 2026-05-07.* Kept print/PDF, reporting, and legacy audit surfaces anchored in the stable dashboard.
- [x] **S13-05 — Tests and docs.** ✅ *Done 2026-05-07.* Added selector/smoke coverage and Sprint 13 documentation.

### Sprint 13 Definition Of Done

- React renders key chart parity surfaces for annual projection and account buckets.
- Chart series are derived from existing simulation output and selectors.
- Chart output and view state are runtime-only and not persisted.
- Stable dashboard remains available for print/PDF, richer charting, and legacy audit surfaces.
- Runtime dashboard schema remains v2.
- Verification passes and no private `.plan.json` files are created.

### Sprint 12: React Annual Detail Parity

**Complete 2026-05-07.** Added a first-class React Annual Detail tab so users can inspect full year-by-year projection rows without jumping immediately to the stable dashboard.

Sprint 12 checkpoint doc: [`docs/sprint_12_react_annual_detail_parity.md`](docs/sprint_12_react_annual_detail_parity.md).

### Sprint 12 Candidate Implementation Tickets

- [x] **S12-01 — Annual detail navigation.** ✅ *Done 2026-05-07.* Added `Annual Detail` as a first-class Results tab after Overview.
- [x] **S12-02 — Annual detail selectors.** ✅ *Done 2026-05-07.* Added runtime-only annual detail rows and summary metrics derived from existing simulation output.
- [x] **S12-03 — Simple view controls.** ✅ *Done 2026-05-07.* Added Summary, Income, Withdrawals, Tax, and Balances table views without persisted UI state.
- [x] **S12-04 — Full-year React table.** ✅ *Done 2026-05-07.* Rendered all projection years in a scrollable table while preserving stable dashboard handoff for charts and print/PDF.
- [x] **S12-05 — Tests and docs.** ✅ *Done 2026-05-07.* Added selector/smoke coverage and Sprint 12 documentation.

### Sprint 12 Definition Of Done

- Annual Detail shows all available projection years in React.
- Annual Detail values reconcile with existing Cash Flow selectors.
- Annual Detail output and view state are runtime-only and not persisted.
- Stable dashboard remains available for charts, print/PDF, and legacy audit surfaces.
- Runtime dashboard schema remains v2.
- Verification passes and no private `.plan.json` files are created.

### Sprint 11: Recommended Path Implementation Checklist

**Complete 2026-05-07.** Turned selected-path confidence, stress, and drilldown evidence into a runtime-only implementation checklist users can review before relying on a preview path.

Sprint 11 checkpoint doc: [`docs/sprint_11_recommended_path_implementation_checklist.md`](docs/sprint_11_recommended_path_implementation_checklist.md).

### Sprint 11 Candidate Implementation Tickets

- [x] **S11-01 — Checklist selector contract.** ✅ *Done 2026-05-07.* Added typed runtime-only checklist items to the recommended-path summary.
- [x] **S11-02 — Evidence-grounded checklist rules.** ✅ *Done 2026-05-07.* Checklist status uses validation blockers, break risks, confidence, stress context, and survivor comparison.
- [x] **S11-03 — React checklist panel.** ✅ *Done 2026-05-07.* Added an Overview checklist below the break-risk drilldowns.
- [x] **S11-04 — Tests and docs.** ✅ *Done 2026-05-07.* Added selector coverage and Sprint 11 documentation.

### Sprint 11 Definition Of Done

- Checklist output is runtime-only and not persisted.
- Checklist items remain review-oriented and avoid financial-advice language.
- Stable dashboard handoff remains explicit.
- Runtime dashboard schema remains v2.
- Verification passes and no private `.plan.json` files are created.

### Sprint 10: Recommended Path Detail Drilldowns

**Complete 2026-05-07.** Users can drill from high-level recommended-path break risks into focused selected-path evidence without persisting recommendation output or replacing the stable dashboard detail surface.

Sprint 10 checkpoint doc: [`docs/sprint_10_recommended_path_detail_drilldowns_proposal.md`](docs/sprint_10_recommended_path_detail_drilldowns_proposal.md).

### Sprint 10 Candidate Implementation Tickets

- [x] **S10-01 — Risk detail selector contract.** ✅ *Done 2026-05-07.* Added runtime-only risk detail rows, default risk selection, metric rows, and evidence rows to the recommended-path summary.
- [x] **S10-02 — Source, shortfall, and terminal cushion details.** ✅ *Done 2026-05-07.* Added focused selected-path evidence for reconciliation, funding pressure, and portfolio cushion.
- [x] **S10-03 — Spending, retirement date, and benefit timing details.** ✅ *Done 2026-05-07.* Added bounded scenario comparison evidence for the three local reruns.
- [x] **S10-04 — Tax and survivor details.** ✅ *Done 2026-05-07.* Added tax pressure and household resilience detail rows.
- [x] **S10-05 — Overview interaction.** ✅ *Done 2026-05-07.* Made break risks selectable and rendered the selected detail panel.
- [x] **S10-06 — Tests and documentation.** ✅ *Done 2026-05-07.* Added selector coverage and Sprint 10 documentation.

### Sprint 10 Definition Of Done

- Users can select a break risk and see focused selected-path evidence.
- Selected-path details are runtime-only and not persisted.
- Detail copy clearly points users to the stable dashboard for complete schedules.
- The React Overview remains readable and does not turn into a dense spreadsheet.
- Stable dashboard remains the full fallback.
- Runtime dashboard schema remains v2.
- Verification passes and no private `.plan.json` files are created.

### Sprint 9: Recommended Path Stress & Confidence

**Complete 2026-05-07.** Added a bounded confidence and stress layer around the selected recommended path so users can see how robust or fragile the preview choice is.

Sprint 9 checkpoint doc: [`docs/sprint_9_recommended_path_stress_confidence.md`](docs/sprint_9_recommended_path_stress_confidence.md).

### Sprint 9 Candidate Implementation Tickets

- [x] **S9-01 — Recommended path confidence selector.** ✅ *Done 2026-05-07.* Added runtime-only confidence levels based on selected-path blockers, shortfalls, watch risks, tax pressure, and review items.
- [x] **S9-02 — Selected-path stress context.** ✅ *Done 2026-05-07.* Added selected candidate stress context for funded years, first shortfall, lowest portfolio, terminal portfolio, tax pressure, and survivor status.
- [x] **S9-03 — What could break this plan panel.** ✅ *Done 2026-05-07.* Added Overview risks for source reconciliation, spending sensitivity, retirement timing, CPP/OAS timing, shortfall, terminal cushion, tax pressure, and survivor resilience.
- [x] **S9-04 — Stable dashboard detail handoff copy.** ✅ *Done 2026-05-07.* Updated Overview, Stress Tests, and Export/Save copy so detailed inspection stays anchored in the stable dashboard.
- [x] **S9-05 — Stress/confidence tests and docs.** ✅ *Done 2026-05-07.* Added selector tests and Sprint 9 documentation.

### Sprint 9 Definition Of Done

- Confidence and stress output are computed at runtime only and are not persisted into `.plan.json`.
- Selected-path stress context is visible in React Overview.
- Overview shows bounded break risks and stable dashboard handoff copy.
- Stable dashboard remains the full fallback.
- Runtime dashboard schema remains `SCHEMA_VERSION = 2`.
- Canonical probes pass and no private `.plan.json` files are committed.

### Sprint 8: Recommended Plan Pathway v0

**Complete 2026-05-07.** The React Overview selects the strongest preview candidate from the current plan, retire two years later, spend 10% less in go-go, and delay CPP/OAS to 70. The recommendation remains runtime-only and is not persisted.

Sprint 8 checkpoint doc: [`docs/sprint_8_recommended_pathway.md`](docs/sprint_8_recommended_pathway.md).

### Sprint 8 Candidate Implementation Tickets

- [x] **S8-01 — Recommendation selector layer.** ✅ *Done 2026-05-07.* Added typed runtime-only recommended-path selectors for baseline, retire-later, lower-spending, and delayed-benefit candidates.
- [x] **S8-02 — Recommended Path Overview panel.** ✅ *Done 2026-05-07.* Added a React Overview panel showing the strongest preview candidate, reasons, tradeoffs, and trust checks.
- [x] **S8-03 — Candidate ranking table.** ✅ *Done 2026-05-07.* Added candidate rows with funded-through year, first shortfall, end-portfolio delta, lifetime tax delta, spending-funded years, and review status.
- [x] **S8-04 — Why not the others.** ✅ *Done 2026-05-07.* Added transparent explanations for why non-selected candidates did not overtake the recommended path.
- [x] **S8-05 — Recommended pathway tests and docs.** ✅ *Done 2026-05-07.* Added selector/smoke coverage and Sprint 8 continuity documentation.

### Sprint 8 Definition Of Done

- Recommended path is computed at runtime only and is not persisted into `.plan.json`.
- Source reconciliation warnings block a candidate from recommendation.
- Recommendation rules prefer no shortfall, then later funded-through year, then ending portfolio, then lower lifetime tax.
- Survivor issues are review warnings, not automatic disqualifiers.
- Stable dashboard remains the full fallback.
- Runtime dashboard schema remains `SCHEMA_VERSION = 2`.
- Canonical probes pass and no private `.plan.json` files are committed.

### Sprint 7: Results Clarity And Decision Readiness

**Complete 2026-05-07.** The React Overview explains plan health, traces money flow, surfaces decision review candidates, compares simple local scenarios, explains Canadian tax pressure, and starts household survivor resilience while preserving stable dashboard fallback and schema v2.

Sprint 7 checkpoint doc: [`docs/sprint_7_results_clarity.md`](docs/sprint_7_results_clarity.md).

### Sprint 7 Candidate Implementation Tickets

- [x] **S7-01 — Plan Health Explainer.** ✅ *First slice done 2026-05-07.* Added typed plan-health selector and React Overview panel for funded-through year, first pressure point, largest review item, and stable dashboard fallback.
- [x] **S7-02 — Source Reconciliation Story.** ✅ *First slice done 2026-05-07.* Turned first-year reconciliation into a user-facing source-to-tax-to-spending flow while preserving the all-years diagnostics.
- [x] **S7-03 — Decision Checklist.** ✅ *First slice done 2026-05-07.* Added review-candidate checklist for source reconciliation, CPP/OAS timing, cash wedge, OAS clawback, registered tax spikes, survivor risk, and estate target.
- [x] **S7-04 — Tax Pressure Timeline.** ✅ *First slice done 2026-05-07.* Added selector and Overview table for high-signal tax pressure years, including taxable income, tax, OAS clawback, and registered withdrawals.
- [x] **S7-05 — First Scenario Cards.** ✅ *First slice done 2026-05-07.* Added computed local decision cards for retire two years later, spend 10% less in go-go, and delay CPP/OAS to 70. Cards show end-portfolio delta and funded-through year without becoming a full optimizer.
- [x] **S7-06 — Survivor View Discovery/First Slice.** ✅ *First slice done 2026-05-07.* Added typed survivor summary that distinguishes single plans, two-person plans needing a survivor year, and plans ready for survivor comparison.
- [x] **S7-07 — Decision Readiness Smoke.** ✅ *Done 2026-05-07.* Extended results smoke coverage for Larry-style single, couple, blank Person 2, source reconciliation, decision checklist, scenario cards, survivor summary, and dashboard handoff.
- [x] **S7-08 — Scenario Comparison Detail.** ✅ *Done 2026-05-07.* Added a selector and Overview table comparing the three simple local reruns by end portfolio delta, first-year spending delta, lifetime tax delta, funded-through year, and first shortfall.
- [x] **S7-09 — Decision Detail Panel.** ✅ *Done 2026-05-07.* Added evidence, affected years, and fallback result area for each decision checklist item so review candidates are explainable without becoming advice.
- [x] **S7-10 — Scenario Assumption Summary.** ✅ *Done 2026-05-07.* Added a scenario assumptions table showing exactly what changes from baseline for each local rerun.
- [x] **S7-11 — Tax Pressure Explanation.** ✅ *Done 2026-05-07.* Added plain-language tax pressure explanations for OAS clawback, registered withdrawals, and peak taxable-income years.
- [x] **S7-12 — Survivor View Deepening.** ✅ *Done 2026-05-07.* Added baseline-versus-survivor comparison using the existing survivor simulation boundary when a couple plan has a survivor year.
- [x] **S7-13 — Results UX Checkpoint.** ✅ *Done 2026-05-07.* Grouped the Overview into Plan Health, Money Flow, Decision Checks, Scenario Tests, and Household Resilience sections.

### Sprint 7 Definition Of Done

- React results tell a coherent plan story before asking users to inspect charts.
- Source reconciliation remains visible and catches impossible rows.
- Decision checklist is framed as review candidates, not regulated advice.
- Stable dashboard remains the complete fallback.
- Runtime dashboard schema remains `SCHEMA_VERSION = 2`.
- No cloud sync/accounts/advisor/AI/multi-province/schema-v3 persistence creep.
- Canonical probes pass and no private `.plan.json` files are committed.

### Sprint 7 Checkpoint

Sprint 7 is ready for checkpoint review once verification is green: the React Overview now explains plan health, traces money flow, surfaces decision review candidates, compares simple local scenarios, explains Canadian tax pressure, and starts household survivor resilience while preserving stable dashboard fallback and schema v2.

### Sprint 6: Results Workspace Migration

**Complete initial map 2026-05-07.** Started after Sprint 5 guided intake smoke passed locally. The React preview can now open/create v2 `.plan.json` files, edit guided intake, lazy-load the extracted simulation engine, review inputs, hand off to the stable dashboard, and render the initial results workspace map.

Sprint 5 discovery doc: [`docs/sprint_5_ui_navigation_discovery.md`](docs/sprint_5_ui_navigation_discovery.md). Sprint 6 workspace decision: [`docs/sprint_6_results_workspace.md`](docs/sprint_6_results_workspace.md).

### Sprint 6 Candidate Implementation Tickets

- [x] **S6-01 — Results workspace screen map.** ✅ *First slice done 2026-05-06.* Recorded the React results navigation map: Overview, Cash Flow, Income Sources, Accounts, Taxes, Stress Tests, Assumptions, and Export/Save.
- [x] **S6-02 — Result data selectors.** ✅ *First slice done 2026-05-06.* Added typed selectors for overview metrics, funding-source rows, account balance series, chart-ready data, and cash-flow reconciliation without changing engine output or persisted schema.
- [x] **S6-03 — Overview results panel.** ✅ *First slice done 2026-05-06.* React Results now opens on Overview with projection years, end portfolio, first-year source reconciliation, warnings/blockers, and stable dashboard fallback.
- [x] **S6-04 — Cash-flow/source reconciliation panel.** ✅ *First slice done 2026-05-06.* Added a Cash Flow results tab that checks annual source reconciliation and flags gap/cash-flow deltas while keeping full detail in the stable dashboard.
- [x] **S6-05 — Results navigation shell.** ✅ *First slice done 2026-05-06.* Results tab state now lives in the workspace reducer. Overview and Cash Flow render React previews; all remaining mapped tabs are selectable placeholders that point users back to the stable dashboard until parity work is done.
- [x] **S6-06 — Results smoke pass.** ✅ *Done 2026-05-06.* Added automated results smoke coverage for Larry-style single, couple, single-person blank Person 2, Overview selectors, Cash Flow reconciliation rows, navigation map, and v2 dashboard handoff packaging.
- [x] **S6-07 — Income Sources preview panel.** ✅ *Done 2026-05-06.* Added typed income-source selectors and a React Income Sources tab with first-year, lifetime taxable, lifetime flexible, source rows, and stable dashboard fallback preserved.
- [x] **S6-08 — Accounts preview panel.** ✅ *Done 2026-05-07.* Added account summary selectors and a React Accounts tab with start/end balances, peak portfolio, account bucket rows, and stable dashboard fallback preserved.
- [x] **S6-09 — Taxes preview panel.** ✅ *Done 2026-05-07.* Added tax summary/detail selectors and a React Taxes tab with first-year tax, lifetime tax, peak tax year, OAS clawback, effective rates, and stable dashboard fallback preserved.
- [x] **S6-10 — Stress Tests preview panel.** ✅ *Done 2026-05-07.* Added baseline stress indicator selectors and a React Stress Tests tab for shortfall, depletion, minimum portfolio, terminal portfolio, and funded-year indicators while leaving full scenario tests in the stable dashboard.
- [x] **S6-11 — Assumptions preview panel.** ✅ *Done 2026-05-07.* Added a read-only React Assumptions tab summarizing run assumptions and strategy settings from the v2 plan without adding a new persistence surface.
- [x] **S6-12 — Export/Save preview panel.** ✅ *Done 2026-05-07.* Added a local-first Export/Save tab summarizing v2 plan-file context and stable dashboard fallback without adding sync, accounts, or schema changes.
- [x] **S6-13 — Overview projection path.** ✅ *Done 2026-05-07.* Added projection milestone selectors and a React Overview projection path table for first/mid/final year spending, tax, portfolio, and shortfall.
- [x] **S6-14 — Export/Save action parity.** ✅ *Done 2026-05-07.* Added the local `.plan.json` save action directly inside the Export/Save tab while preserving the shared stable dashboard fallback.
- [x] **S6-15 — Reconciliation diagnostics.** ✅ *Done 2026-05-07.* Added all-years source reconciliation diagnostics with rows checked, warning count, first warning year, max funding gap, and max cash-flow delta surfaced in Overview and Cash Flow.
- [x] **S6-16 — Account drawdown summary.** ✅ *Done 2026-05-07.* Added account net-change values and an Accounts tab summary table for start, end, peak, and drawdown/growth by bucket.

### Definition Of Done

- React results workspace has a scoped first slice without replacing the stable dashboard.
- Result selectors are deterministic and covered by tests.
- Source reconciliation is visible and catches impossible cash-flow rows.
- `.plan.json` v2 import/export remains compatible.
- Runtime dashboard schema remains `SCHEMA_VERSION = 2`.
- Static `index.html` and `retirement_dashboard.html` remain available as fallback.
- Canonical probes pass and no private `.plan.json` files are committed.

### Sprint 5: UI / Navigation Redesign Discovery

**Complete 2026-05-06.** Hybrid guided intake implemented and browser smoke passed locally after the simulation engine was moved off the first page load.

Goal: design and then implement the first guided-intake/navigation slice for the React app without changing persisted runtime schema, breaking the static release fallback, or adding accounts/cloud/full optimizer scope.

Discovery doc: [`docs/sprint_5_ui_navigation_discovery.md`](docs/sprint_5_ui_navigation_discovery.md).

#### Discovery And Scope

- [x] **S5-01 — Discovery doc and screen map.** ✅ *Seeded 2026-05-01.* Created the Sprint 5 UI/navigation discovery doc with user jobs, workspace split, candidate navigation models, screen map, file model, real estate/assets model, result hierarchy, mobile/desktop stance, non-shipping list, candidate tickets, and open decisions.
- [x] **S5-02 — Choose initial navigation model.** ✅ *Done 2026-05-01.* Selected the hybrid model: guided setup first, then a persistent workspace shell with Start, Guided Intake, Review, and Results Handoff.
- [x] **S5-03 — Resolve Sprint 5 real estate scope.** ✅ *Done 2026-05-01.* Sprint 5 will capture primary residence/downsize only where it maps to existing v2 fields. Second/vacation property and richer asset records are deferred until a scoped schema update so future asset/property needs can be handled together.
- [x] **S5-04 — Define guided-intake validation rules.** ✅ *Done 2026-05-01.* Blocking issues are limited to incoherent or unsafe-to-run values; advisory completeness issues appear as warnings and do not block result generation.
- [x] **S5-05 — Define local file state UX.** ✅ *Done 2026-05-02.* `.plan.json` is the durable source of truth; browser state is a temporary working copy. Defined current plan title, loaded filename, import success/errors, dirty state, last export timestamp, save/export, and stable-dashboard handoff behavior.

#### Candidate Implementation Tickets

- [x] **S5-06 — Guided intake route shell.** ✅ *Initial shell done 2026-05-01.* Added Start, Intake, Review, and Results Handoff views inside the React preview with a persistent workspace sidebar and guided step rail.
- [x] **S5-07 — Intake state model.** ✅ *Initial model done 2026-05-01.* Added reducer-backed local plan state, import label, dirty state, export timestamp, active view, and active intake step.
- [x] **S5-08 — Household step.** ✅ *Done 2026-05-02.* Added editable plan name, single/couple mode, Person 1 birth/retirement fields, and Person 2 fields that remain disabled/blank for single-person plans without writing placeholder values.
- [x] **S5-09 — Income step.** ✅ *Done 2026-05-02.* Added editable salary, salary year, raise rate, DB pension, CPP, OAS, and Person 2 survivor CPP fields from v2, with Person 2 income disabled while the household is single.
- [x] **S5-10 — Accounts step.** ✅ *Done 2026-05-02.* Added editable RRSP/RRIF, RRSP room, LIRA, LIF, TFSA, TFSA room, annual contributions, non-registered balance/ACB/contributions, and cash wedge fields from v2.
- [x] **S5-11 — Real estate and debts step.** ✅ *Done 2026-05-02.* Added v2 primary-residence downsize year/net proceeds plus mortgage and LOC entry. Second/vacation property remains deferred until scoped schema support exists.
- [x] **S5-12 — Spending and events step.** ✅ *Done 2026-05-02.* Added spending phases, phase ages, one-time expenses, and inheritance/bequest target fields from v2.
- [x] **S5-13 — Assumptions step.** ✅ *Done 2026-05-02.* Added plan years, return/inflation/volatility, withdrawal order, CPP sharing, younger-spouse RRIF election, spousal RRSP attribution toggle/contributor, and survivor year fields.
- [x] **S5-14 — Review and handoff.** ✅ *Done 2026-05-05.* Review now shows a broader input summary across household, income, accounts, real estate/debt, spending/events, and assumptions, keeps validation visible, runs the extracted engine preview, saves normalized `.plan.json`, and hands off to the stable dashboard.
- [x] **S5-15 — Browser smoke pass.** ✅ *Done 2026-05-06.* Local browser run now loads cleanly after lazy-loading the simulation engine. Confirmed the guided intake runs smoothly enough to continue; `.json` plan-file selection accepts Larry-style filenames.

#### Definition Of Done

- Sprint 5 navigation model is chosen and documented.
- Guided intake route/state architecture is implemented in React preview.
- `.plan.json` v2 import/export remains compatible.
- Runtime dashboard schema remains `SCHEMA_VERSION = 2`.
- Static `index.html` and `retirement_dashboard.html` remain available as fallback.
- Real estate fields do not silently persist unsupported second-property data.
- Single-person plans keep Person 2 truly inactive/blank.
- Canonical probes pass and no private `.plan.json` files are committed.

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
