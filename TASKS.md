# TASKS.md

The 2026-04-30 product reset made the planner consumer-first, local-first, and recommended-plan-first. Sprint 0 through Sprint 6 established the local-first app, React guided intake, and first React results workspace. The product direction is now the **Canadian retirement decision engine**: more Canada-specific, more explainable, and more decision-oriented than broad modelling labs like ProjectionLab.

Product direction doc: [`docs/canadian_retirement_decision_engine.md`](docs/canadian_retirement_decision_engine.md).

## Latest Sprint — Sprint 165: V1 Drawdown Re-Entry Closeout

**Status:** Complete 2026-05-22.

Goal: re-enter the v1 drawdown path after deferring detailed stress migration, confirming the next sprint can focus on recommended-plan and bounded drawdown review polish.

Non-scope: simulation math changes, Monte Carlo migration, historical sequence migration, direct React stress execution, stress-model redesign, optimizer expansion, account-by-account instructions, persisted re-entry output, new saved plan schema, cloud accounts, advisor tooling, or report migration.

Sprint 165 checkpoint doc: [`docs/sprint_165_v1_drawdown_reentry_closeout.md`](docs/sprint_165_v1_drawdown_reentry_closeout.md).

### Sprint 161-165 Candidate Implementation Tickets

- [x] **S161-01 — V1 drawdown re-entry review.** Confirm detailed stress deferral, execution phase, UX readiness, saved-plan boundary, and scope.
- [x] **S162-01 — Next sprint plan.** Mark recommended-plan framing and bounded drawdown review as the next work.
- [x] **S163-01 — Re-entry hold/block paths.** Hold on detailed-stress or example review; block dirty saved-plan or stopped phase paths.
- [x] **S164-01 — Re-entry persistence guardrails.** Keep re-entry, next-sprint, and closeout output runtime-only.
- [x] **S165-01 — Re-entry closeout tests/docs.** Close the session as ready for the next bounded drawdown sprint.

### Sprint 165 Definition Of Done

- Baseline stress indicators, stress rows, and stress summary are owned by `stressSelectors`.
- Nearby spending-stress reruns and spending-stress summary interpretation are owned by `stressSelectors`.
- Monte Carlo, progressive Monte Carlo, and historical sequence stress remain in the detailed-report path.
- Boundary review identifies probe coverage and saved-plan guardrails before any later migration.
- Thin adapter contract accepts explicit plan/config inputs only.
- Thin adapter contract allows injected runner ownership only; React does not directly run Monte Carlo or historical replay.
- Adapter validation requires existing detailed stress output shapes and clean saved-plan boundaries.
- Contained prototype creates copied explicit requests only after validation passes.
- Contained prototype calls only a supplied injected runner.
- Contained prototype blocks missing runners, failed validation, and malformed output shapes.
- Probe coverage summary records Monte Carlo, progressive Monte Carlo, historical replay, engine parity, and route-probe caveat state.
- Probe-backed bridge runs only when prototype closeout, probe coverage, runner injection, and saved-plan guardrails are clean.
- Bridge run calls only the supplied injected runner and accepts only existing detailed stress shape metadata.
- Manual comparison uses runtime-only detailed-report reference metadata.
- Manual comparison checks bridge completion, output shape, full-spending-funded rate, Monte Carlo run count, historical sequence count, and saved-plan boundary.
- Manual comparison marks metric drift for review and blocked bridge/persistence paths as blocked.
- V1 decision defaults to keeping detailed stress in the detailed report when comparison is clean and v1 consumer value is low.
- V1 decision marks review paths when product value or migration risk argues against default deferral.
- Decision closeout returns next work to recommended-plan and bounded drawdown execution.
- V1 drawdown re-entry checks detailed stress deferral, execution phase, UX readiness, saved-plan boundary, and v1 scope.
- Next sprint plan prioritizes recommended-plan framing and bounded drawdown review polish.
- Re-entry closeout marks the path ready for the next bounded drawdown sprint.
- No detailed stress boundary, migration closeout, stress readiness, row, summary, or spending-stress output is persisted.
- No custom annual override payload is saved.
- No drawdown draft, sandbox, comparison readiness, hidden comparison, decision gate, runtime payload, internal dry-run, readiness review, visible gate, preview, phase review, boundary decision, adapter validation, mocked scorecard, go/no-go, preflight, audit trail, containment guard, example checkpoint, closeout, contained prototype, contained prototype summary, materiality, explanation, limitations, usefulness closeout, density, checklist, example gate, copy guard, product go/no-go, promotion readiness, next-step guide, blocker register, example promotion gate, phase milestone, v1 execution intent, v1 execution candidate, v1 execution result, v1 execution review, v1 execution example gate, v1 execution phase closeout, v1 consumer summary, v1 safety checklist, v1 consumer limits, v1 consumer example gate, v1 consumer closeout, v1 UX headline, v1 UX comparison card, v1 UX review actions, v1 UX copy guard, v1 UX readiness closeout, v1 drawdown re-entry review, v1 drawdown next sprint plan, v1 drawdown re-entry closeout, engine extraction readiness, engine extraction next steps, engine extraction example gate, engine extraction phase closeout, stress extraction readiness, stress extraction boundary, detailed stress boundary review, detailed stress migration closeout, detailed stress adapter contract, detailed stress adapter validation, detailed stress adapter batch closeout, detailed stress adapter request, detailed stress injected runner prototype, detailed stress prototype batch closeout, detailed stress probe coverage, detailed stress probe-backed runner bridge, detailed stress probe-backed bridge run, detailed stress bridge batch closeout, detailed stress manual report reference, detailed stress manual report comparison, detailed stress manual comparison closeout, detailed stress v1 migration decision, detailed stress v1 decision closeout, stress test summary, stress test rows, mocked payload, or prototype output is persisted.
- No optimizer output is persisted.
- No engine output or saved plan schema change is introduced.
- Verification passes and no private `.plan.json` files are created.

## Completed Sprints

### Sprint 165: V1 Drawdown Re-Entry Closeout

**Complete 2026-05-22.** Closed the session as ready for the next bounded drawdown sprint after detailed stress deferral.

Sprint 165 checkpoint doc: [`docs/sprint_165_v1_drawdown_reentry_closeout.md`](docs/sprint_165_v1_drawdown_reentry_closeout.md).

### Sprint 164: V1 Drawdown Re-Entry Persistence Guardrails

**Complete 2026-05-22.** Kept v1 drawdown re-entry, next-sprint, and closeout output runtime-only.

Sprint 164 checkpoint doc: [`docs/sprint_164_v1_drawdown_reentry_persistence.md`](docs/sprint_164_v1_drawdown_reentry_persistence.md).

### Sprint 163: V1 Drawdown Re-Entry Hold And Block Paths

**Complete 2026-05-22.** Added hold and blocked paths for detailed-stress review, examples, phase, and saved-plan boundaries.

Sprint 163 checkpoint doc: [`docs/sprint_163_v1_drawdown_reentry_guardrails.md`](docs/sprint_163_v1_drawdown_reentry_guardrails.md).

### Sprint 162: V1 Drawdown Next Sprint Plan

**Complete 2026-05-22.** Marked recommended-plan framing and bounded drawdown review polish as the next sprint focus.

Sprint 162 checkpoint doc: [`docs/sprint_162_v1_drawdown_next_sprint_plan.md`](docs/sprint_162_v1_drawdown_next_sprint_plan.md).

### Sprint 161: V1 Drawdown Re-Entry Review

**Complete 2026-05-22.** Added runtime-only re-entry review after detailed stress deferral.

Sprint 161 checkpoint doc: [`docs/sprint_161_v1_drawdown_reentry_review.md`](docs/sprint_161_v1_drawdown_reentry_review.md).

### Sprint 160: Detailed Stress V1 Decision Closeout

**Complete 2026-05-22.** Closed the detailed-stress decision batch by deferring migration for v1 and returning focus to recommended-plan and bounded drawdown execution.

Sprint 160 checkpoint doc: [`docs/sprint_160_detailed_stress_v1_decision_closeout.md`](docs/sprint_160_detailed_stress_v1_decision_closeout.md).

### Sprint 159: Detailed Stress Decision Persistence Guardrails

**Complete 2026-05-22.** Kept detailed-stress v1 decision and closeout output runtime-only.

Sprint 159 checkpoint doc: [`docs/sprint_159_detailed_stress_decision_persistence.md`](docs/sprint_159_detailed_stress_decision_persistence.md).

### Sprint 158: Detailed Stress Decision Review Paths

**Complete 2026-05-22.** Added review and blocked paths for product value, migration risk, comparison, and saved-plan boundaries.

Sprint 158 checkpoint doc: [`docs/sprint_158_detailed_stress_decision_review_paths.md`](docs/sprint_158_detailed_stress_decision_review_paths.md).

### Sprint 157: Detailed Stress V1 Deferral Decision

**Complete 2026-05-22.** Defaulted clean detailed-stress comparison to keeping detailed stress in the detailed report for v1.

Sprint 157 checkpoint doc: [`docs/sprint_157_detailed_stress_v1_deferral.md`](docs/sprint_157_detailed_stress_v1_deferral.md).

### Sprint 156: Detailed Stress V1 Decision Selector

**Complete 2026-05-22.** Added runtime-only decision rows for the detailed-stress v1 migrate-or-defer checkpoint.

Sprint 156 checkpoint doc: [`docs/sprint_156_detailed_stress_v1_decision_selector.md`](docs/sprint_156_detailed_stress_v1_decision_selector.md).

### Sprint 155: Detailed Stress Manual Comparison Closeout

**Complete 2026-05-22.** Closed the manual comparison batch as ready for a migrate-or-defer decision checkpoint while keeping detailed stress execution in the detailed-report path.

Sprint 155 checkpoint doc: [`docs/sprint_155_detailed_stress_manual_comparison_closeout.md`](docs/sprint_155_detailed_stress_manual_comparison_closeout.md).

### Sprint 154: Detailed Stress Comparison Persistence Guardrails

**Complete 2026-05-22.** Kept detailed-report reference, manual comparison, and closeout output runtime-only.

Sprint 154 checkpoint doc: [`docs/sprint_154_detailed_stress_comparison_persistence.md`](docs/sprint_154_detailed_stress_comparison_persistence.md).

### Sprint 153: Detailed Stress Review And Block Thresholds

**Complete 2026-05-22.** Marked metric differences for review and blocked incomplete bridge or saved-plan failures.

Sprint 153 checkpoint doc: [`docs/sprint_153_detailed_stress_review_block_thresholds.md`](docs/sprint_153_detailed_stress_review_block_thresholds.md).

### Sprint 152: Detailed Stress Manual Comparison Rows

**Complete 2026-05-22.** Compared bridge output to detailed-report reference metadata across shape, funded rate, Monte Carlo runs, and historical sequences.

Sprint 152 checkpoint doc: [`docs/sprint_152_detailed_stress_manual_comparison_rows.md`](docs/sprint_152_detailed_stress_manual_comparison_rows.md).

### Sprint 151: Detailed Stress Report Reference Metadata

**Complete 2026-05-22.** Added runtime-only detailed-report reference metadata for manual comparison.

Sprint 151 checkpoint doc: [`docs/sprint_151_detailed_stress_report_reference.md`](docs/sprint_151_detailed_stress_report_reference.md).

### Sprint 150: Detailed Stress Probe-Backed Bridge Closeout

**Complete 2026-05-22.** Closed the bridge batch as ready for manual detailed-report comparison while keeping detailed stress execution in the detailed-report path.

Sprint 150 checkpoint doc: [`docs/sprint_150_detailed_stress_bridge_closeout.md`](docs/sprint_150_detailed_stress_bridge_closeout.md).

### Sprint 149: Detailed Stress Bridge Persistence Guardrails

**Complete 2026-05-22.** Kept detailed-stress coverage, bridge, bridge run, and closeout output runtime-only.

Sprint 149 checkpoint doc: [`docs/sprint_149_detailed_stress_bridge_persistence.md`](docs/sprint_149_detailed_stress_bridge_persistence.md).

### Sprint 148: Detailed Stress Guarded Bridge Run

**Complete 2026-05-22.** Added a bridge runner that calls the injected runner only when bridge readiness is clean.

Sprint 148 checkpoint doc: [`docs/sprint_148_detailed_stress_guarded_bridge_run.md`](docs/sprint_148_detailed_stress_guarded_bridge_run.md).

### Sprint 147: Detailed Stress Probe-Backed Bridge Readiness

**Complete 2026-05-22.** Required prototype closeout, probe coverage, runner injection, and saved-plan guardrails before bridge checks.

Sprint 147 checkpoint doc: [`docs/sprint_147_detailed_stress_probe_backed_bridge.md`](docs/sprint_147_detailed_stress_probe_backed_bridge.md).

### Sprint 146: Detailed Stress Probe Coverage Summary

**Complete 2026-05-22.** Added runtime-only probe coverage summary for detailed stress bridge work.

Sprint 146 checkpoint doc: [`docs/sprint_146_detailed_stress_probe_coverage.md`](docs/sprint_146_detailed_stress_probe_coverage.md).

### Sprint 145: Detailed Stress Injected Runner Prototype Closeout

**Complete 2026-05-22.** Closed the prototype batch as ready for a future probe-backed runner bridge while keeping detailed stress execution in the detailed-report path.

Sprint 145 checkpoint doc: [`docs/sprint_145_detailed_stress_prototype_closeout.md`](docs/sprint_145_detailed_stress_prototype_closeout.md).

### Sprint 144: Detailed Stress Prototype Persistence Guardrails

**Complete 2026-05-22.** Kept detailed-stress prototype request, result, and closeout output runtime-only.

Sprint 144 checkpoint doc: [`docs/sprint_144_detailed_stress_prototype_persistence.md`](docs/sprint_144_detailed_stress_prototype_persistence.md).

### Sprint 143: Detailed Stress Prototype Output Validation

**Complete 2026-05-22.** Blocked injected-runner results that do not match existing detailed stress shape metadata.

Sprint 143 checkpoint doc: [`docs/sprint_143_detailed_stress_prototype_output_validation.md`](docs/sprint_143_detailed_stress_prototype_output_validation.md).

### Sprint 142: Detailed Stress Injected Runner Harness

**Complete 2026-05-22.** Added a contained prototype harness that calls only a supplied injected runner.

Sprint 142 checkpoint doc: [`docs/sprint_142_detailed_stress_injected_runner_harness.md`](docs/sprint_142_detailed_stress_injected_runner_harness.md).

### Sprint 141: Detailed Stress Explicit Request

**Complete 2026-05-22.** Added a copied explicit plan/config request for future detailed-stress adapter work.

Sprint 141 checkpoint doc: [`docs/sprint_141_detailed_stress_explicit_request.md`](docs/sprint_141_detailed_stress_explicit_request.md).

### Sprint 140: Detailed Stress Adapter Contract Closeout

**Complete 2026-05-21.** Closed the adapter-contract batch as ready for a contained injected-runner prototype while keeping detailed stress execution in the detailed-report path.

Sprint 140 checkpoint doc: [`docs/sprint_140_detailed_stress_adapter_closeout.md`](docs/sprint_140_detailed_stress_adapter_closeout.md).

### Sprint 139: Detailed Stress Adapter Validation

**Complete 2026-05-21.** Added validation that combines boundary review, migration closeout, adapter contract, probe coverage, and saved-plan boundaries.

Sprint 139 checkpoint doc: [`docs/sprint_139_detailed_stress_adapter_validation.md`](docs/sprint_139_detailed_stress_adapter_validation.md).

### Sprint 138: Detailed Stress Output Guardrails

**Complete 2026-05-21.** Required future adapter work to return existing detailed stress shapes and keep adapter output runtime-only.

Sprint 138 checkpoint doc: [`docs/sprint_138_detailed_stress_output_guardrails.md`](docs/sprint_138_detailed_stress_output_guardrails.md).

### Sprint 137: Detailed Stress Injected Runner Boundary

**Complete 2026-05-21.** Kept Monte Carlo and historical replay behind detailed-report runner ownership instead of allowing direct React execution.

Sprint 137 checkpoint doc: [`docs/sprint_137_detailed_stress_injected_runner_boundary.md`](docs/sprint_137_detailed_stress_injected_runner_boundary.md).

### Sprint 136: Thin Detailed Stress Adapter Contract

**Complete 2026-05-21.** Added runtime-only contract metadata for explicit plan/config inputs and a future injected detailed-stress runner.

Sprint 136 checkpoint doc: [`docs/sprint_136_thin_detailed_stress_adapter_contract.md`](docs/sprint_136_thin_detailed_stress_adapter_contract.md).

### Sprint 135: Detailed Stress Boundary Closeout

**Complete 2026-05-21.** Marked a future thin detailed-stress adapter as the next safe step while leaving Monte Carlo and historical sequence execution in the detailed-report path.

Sprint 135 checkpoint doc: [`docs/sprint_135_detailed_stress_boundary_closeout.md`](docs/sprint_135_detailed_stress_boundary_closeout.md).

### Sprint 134: Detailed Stress Adapter Next Step

**Complete 2026-05-21.** Recorded the next safe migration slice as adapter-contract design, not execution migration.

Sprint 134 checkpoint doc: [`docs/sprint_134_detailed_stress_adapter_next_step.md`](docs/sprint_134_detailed_stress_adapter_next_step.md).

### Sprint 133: Detailed Stress No-Migration Closeout

**Complete 2026-05-21.** Kept Monte Carlo, progressive Monte Carlo, and historical sequence execution in the detailed-report path.

Sprint 133 checkpoint doc: [`docs/sprint_133_detailed_stress_no_migration.md`](docs/sprint_133_detailed_stress_no_migration.md).

### Sprint 132: Detailed Stress Probe And Persistence Guardrails

**Complete 2026-05-21.** Added runtime-only rows for detailed stress probe coverage and saved-plan boundaries.

Sprint 132 checkpoint doc: [`docs/sprint_132_detailed_stress_probe_persistence.md`](docs/sprint_132_detailed_stress_probe_persistence.md).

### Sprint 131: Detailed Stress Boundary Map

**Complete 2026-05-21.** Recorded detailed-report ownership for Monte Carlo, progressive Monte Carlo, historical sequence replay, and full-spending-funded metrics.

Sprint 131 checkpoint doc: [`docs/sprint_131_detailed_stress_boundary_map.md`](docs/sprint_131_detailed_stress_boundary_map.md).

### Sprint 130: Spending Stress Ownership Closeout

**Complete 2026-05-21.** Marked nearby spending stress as owned by the stress helper boundary while keeping Monte Carlo and historical sequence migration for later.

Sprint 130 checkpoint doc: [`docs/sprint_130_spending_stress_ownership_closeout.md`](docs/sprint_130_spending_stress_ownership_closeout.md).

### Sprint 129: Spending Stress Guardrail Tests

**Complete 2026-05-21.** Added working-copy, higher-spending skip, example, and saved-plan tests for spending stress helper ownership.

Sprint 129 checkpoint doc: [`docs/sprint_129_spending_stress_guardrail_tests.md`](docs/sprint_129_spending_stress_guardrail_tests.md).

### Sprint 128: Preview Spending Stress Compatibility

**Complete 2026-05-21.** Kept the preview bundle and compatibility exports stable while delegating nearby spending stress work.

Sprint 128 checkpoint doc: [`docs/sprint_128_preview_spending_stress_compatibility.md`](docs/sprint_128_preview_spending_stress_compatibility.md).

### Sprint 127: Spending Stress Summary Helper

**Complete 2026-05-21.** Moved spending stress interpretation into the stress helper module.

Sprint 127 checkpoint doc: [`docs/sprint_127_spending_stress_summary_helper.md`](docs/sprint_127_spending_stress_summary_helper.md).

### Sprint 126: Spending Stress Rerun Helper

**Complete 2026-05-21.** Moved nearby spending stress working-copy rerun orchestration into the stress helper module.

Sprint 126 checkpoint doc: [`docs/sprint_126_spending_stress_rerun_helper.md`](docs/sprint_126_spending_stress_rerun_helper.md).

### Sprint 125: Stress Helper Extraction Closeout

**Complete 2026-05-21.** Added a closeout that keeps scenario stress, Monte Carlo, and historical sequence migration as later slices after baseline stress helper extraction.

Sprint 125 checkpoint doc: [`docs/sprint_125_stress_helper_closeout.md`](docs/sprint_125_stress_helper_closeout.md).

### Sprint 124: Stress Helper Example And Persistence Coverage

**Complete 2026-05-21.** Added bundled-example and saved-plan coverage for the extracted baseline stress helpers.

Sprint 124 checkpoint doc: [`docs/sprint_124_stress_helper_example_coverage.md`](docs/sprint_124_stress_helper_example_coverage.md).

### Sprint 123: Stress Extraction Boundary

**Complete 2026-05-21.** Added runtime-only metadata for baseline stress helper ownership and held/later stress surfaces.

Sprint 123 checkpoint doc: [`docs/sprint_123_stress_extraction_boundary.md`](docs/sprint_123_stress_extraction_boundary.md).

### Sprint 122: Stress Selector Compatibility Exports

**Complete 2026-05-21.** Kept existing `resultSelectors` stress exports stable while moving implementation ownership.

Sprint 122 checkpoint doc: [`docs/sprint_122_stress_selector_compatibility.md`](docs/sprint_122_stress_selector_compatibility.md).

### Sprint 121: Baseline Stress Helper Module

**Complete 2026-05-21.** Moved baseline stress indicator, stress row, and summary logic into an engine-owned stress helper module.

Sprint 121 checkpoint doc: [`docs/sprint_121_baseline_stress_helper_module.md`](docs/sprint_121_baseline_stress_helper_module.md).

### Sprint 120: Engine Extraction Readiness Closeout

**Complete 2026-05-21.** Added a closeout that marks narrow stress-helper extraction as the next logical slice while preserving simulation math and optimizer behavior.

Sprint 120 checkpoint doc: [`docs/sprint_120_engine_extraction_closeout.md`](docs/sprint_120_engine_extraction_closeout.md).

### Sprint 119: Engine Extraction Example And Persistence Gate

**Complete 2026-05-21.** Added example-plan coverage and saved-plan guardrails for extraction readiness output.

Sprint 119 checkpoint doc: [`docs/sprint_119_engine_extraction_example_gate.md`](docs/sprint_119_engine_extraction_example_gate.md).

### Sprint 118: Engine Extraction Readiness Selector

**Complete 2026-05-21.** Added a runtime-only readiness selector for extraction boundaries and remaining held items.

Sprint 118 checkpoint doc: [`docs/sprint_118_engine_extraction_readiness_selector.md`](docs/sprint_118_engine_extraction_readiness_selector.md).

### Sprint 117: Preview Runner Boundary

**Complete 2026-05-21.** Recorded preview runner injection, working-copy scenario, survivor config, and non-persistence boundaries.

Sprint 117 checkpoint doc: [`docs/sprint_117_preview_runner_boundary.md`](docs/sprint_117_preview_runner_boundary.md).

### Sprint 116: Runtime Boundary Metadata

**Complete 2026-05-21.** Recorded the current plan-object simulation boundary and remaining browser-source bridge ownership.

Sprint 116 checkpoint doc: [`docs/sprint_116_runtime_boundary_metadata.md`](docs/sprint_116_runtime_boundary_metadata.md).

### Sprint 115: Bounded Drawdown UX Readiness Closeout

**Complete 2026-05-21.** Added a Details-only closeout for whether the bounded drawdown UX candidate is ready for later design polish.

Sprint 115 checkpoint doc: [`docs/sprint_115_bounded_drawdown_ux_readiness.md`](docs/sprint_115_bounded_drawdown_ux_readiness.md).

### Sprint 114: Bounded Drawdown UX Copy Guard

**Complete 2026-05-21.** Added copy guard checks that keep the UX candidate review-oriented and protect the saved-plan boundary.

Sprint 114 checkpoint doc: [`docs/sprint_114_bounded_drawdown_ux_copy_guard.md`](docs/sprint_114_bounded_drawdown_ux_copy_guard.md).

### Sprint 113: Bounded Drawdown Review Actions

**Complete 2026-05-21.** Added short review actions for reading the bounded drawdown check without creating account instructions.

Sprint 113 checkpoint doc: [`docs/sprint_113_bounded_drawdown_review_actions.md`](docs/sprint_113_bounded_drawdown_review_actions.md).

### Sprint 112: Bounded Drawdown Comparison Card

**Complete 2026-05-21.** Added a compact current-plan comparison card for funding, tax, OAS recovery, and estate evidence.

Sprint 112 checkpoint doc: [`docs/sprint_112_bounded_drawdown_comparison_card.md`](docs/sprint_112_bounded_drawdown_comparison_card.md).

### Sprint 111: Bounded Drawdown UX Headline

**Complete 2026-05-21.** Added a plain Details-only headline for the bounded drawdown check.

Sprint 111 checkpoint doc: [`docs/sprint_111_bounded_drawdown_ux_headline.md`](docs/sprint_111_bounded_drawdown_ux_headline.md).

### Sprint 110: V1 Drawdown Consumer Closeout

**Complete 2026-05-21.** Added a Details-only closeout for whether bounded execution output is clear enough for later consumer UX copy.

Sprint 110 checkpoint doc: [`docs/sprint_110_v1_drawdown_consumer_closeout.md`](docs/sprint_110_v1_drawdown_consumer_closeout.md).

### Sprint 109: V1 Drawdown Consumer Example Gate

**Complete 2026-05-21.** Extended all-example coverage to the consumer-readable bounded execution layer.

Sprint 109 checkpoint doc: [`docs/sprint_109_v1_drawdown_consumer_example_gate.md`](docs/sprint_109_v1_drawdown_consumer_example_gate.md).

### Sprint 108: V1 Drawdown Consumer Limits

**Complete 2026-05-21.** Added visible limits explaining that the bounded execution result is one scenario, not advice, not saved, and not a full drawdown plan.

Sprint 108 checkpoint doc: [`docs/sprint_108_v1_drawdown_consumer_limits.md`](docs/sprint_108_v1_drawdown_consumer_limits.md).

### Sprint 107: V1 Drawdown Safety Checklist

**Complete 2026-05-21.** Added funding, estate, saved-plan, and instruction checks for the bounded execution result.

Sprint 107 checkpoint doc: [`docs/sprint_107_v1_drawdown_safety_checklist.md`](docs/sprint_107_v1_drawdown_safety_checklist.md).

### Sprint 106: V1 Drawdown Plain Summary

**Complete 2026-05-21.** Added a plain summary that explains what ran, what changed, and what did not change in the bounded execution result.

Sprint 106 checkpoint doc: [`docs/sprint_106_v1_drawdown_plain_summary.md`](docs/sprint_106_v1_drawdown_plain_summary.md).

### Sprint 105: V1 Drawdown Execution Phase Closeout

**Complete 2026-05-21.** Added a Details-only closeout for whether the first bounded execution path is ready for later consumer UX.

Sprint 105 checkpoint doc: [`docs/sprint_105_v1_drawdown_execution_phase_closeout.md`](docs/sprint_105_v1_drawdown_execution_phase_closeout.md).

### Sprint 104: V1 Drawdown Execution Review And Example Gate

**Complete 2026-05-21.** Added review and example-gate coverage for the first bounded execution result while keeping it unsaved and non-advisory.

Sprint 104 checkpoint doc: [`docs/sprint_104_v1_drawdown_execution_review.md`](docs/sprint_104_v1_drawdown_execution_review.md).

### Sprint 103: V1 Bounded Execution Result

**Complete 2026-05-21.** Ran one bounded registered-timing scenario through existing engine plumbing and compared funding, tax, OAS recovery, and estate movement.

Sprint 103 checkpoint doc: [`docs/sprint_103_v1_bounded_execution_result.md`](docs/sprint_103_v1_bounded_execution_result.md).

### Sprint 102: V1 Bounded Execution Candidate

**Complete 2026-05-21.** Converted one accepted draft shape into one existing-engine execution candidate without saving annual overrides.

Sprint 102 checkpoint doc: [`docs/sprint_102_v1_bounded_execution_candidate.md`](docs/sprint_102_v1_bounded_execution_candidate.md).

### Sprint 101: V1 Drawdown Execution Intent

**Complete 2026-05-21.** Recorded the product decision that v1 should include bounded drawdown execution, while keeping the first execution path small and review-first.

Sprint 101 checkpoint doc: [`docs/sprint_101_v1_drawdown_execution_intent.md`](docs/sprint_101_v1_drawdown_execution_intent.md).

### Sprint 100: Contained Prototype Phase Milestone

**Complete 2026-05-21.** Added a Details-only phase milestone that combines promotion readiness, next steps, blockers, example promotion coverage, and saved-plan checks before any broader drawdown work.

Sprint 100 checkpoint doc: [`docs/sprint_100_contained_prototype_phase_milestone.md`](docs/sprint_100_contained_prototype_phase_milestone.md).

### Sprint 99: Contained Prototype Example Promotion Gate

**Complete 2026-05-21.** Added an example promotion gate so the new promotion-readiness layer remains covered by built-in example checks without overclaiming in the live product view.

Sprint 99 checkpoint doc: [`docs/sprint_99_contained_prototype_example_promotion_gate.md`](docs/sprint_99_contained_prototype_example_promotion_gate.md).

### Sprint 98: Contained Prototype Blocker Register

**Complete 2026-05-21.** Added a compact register of held and blocked signals before any later drawdown phase.

Sprint 98 checkpoint doc: [`docs/sprint_98_contained_prototype_blocker_register.md`](docs/sprint_98_contained_prototype_blocker_register.md).

### Sprint 97: Contained Prototype Next-Step Guide

**Complete 2026-05-21.** Added a Details-only guide for how to read the contained prototype without treating it as account instructions.

Sprint 97 checkpoint doc: [`docs/sprint_97_contained_prototype_next_step_guide.md`](docs/sprint_97_contained_prototype_next_step_guide.md).

### Sprint 96: Contained Prototype Promotion Readiness

**Complete 2026-05-21.** Added a conservative promotion-readiness selector that can ready, hold, or block later UX consideration without promoting the prototype today.

Sprint 96 checkpoint doc: [`docs/sprint_96_contained_prototype_promotion_readiness.md`](docs/sprint_96_contained_prototype_promotion_readiness.md).

### Sprint 95: Contained Prototype Product Go/No-Go

**Complete 2026-05-21.** Added a Details-only product go/no-go that combines usefulness, density, checklist, example, copy, and saved-plan checks before any broader drawdown work.

Sprint 95 checkpoint doc: [`docs/sprint_95_contained_prototype_product_go_no_go.md`](docs/sprint_95_contained_prototype_product_go_no_go.md).

### Sprint 94: Contained Prototype Copy Guard

**Complete 2026-05-21.** Added copy guard rows that keep the contained prototype review-oriented and protect the saved-plan boundary.

Sprint 94 checkpoint doc: [`docs/sprint_94_contained_prototype_copy_guard.md`](docs/sprint_94_contained_prototype_copy_guard.md).

### Sprint 93: Contained Prototype Example Gate

**Complete 2026-05-21.** Added an example gate for contained prototype readiness while keeping the live product clear that the full matrix is checked in tests.

Sprint 93 checkpoint doc: [`docs/sprint_93_contained_prototype_example_gate.md`](docs/sprint_93_contained_prototype_example_gate.md).

### Sprint 92: Contained Prototype Review Checklist

**Complete 2026-05-21.** Added a Details-only checklist so users read the main answer, materiality, limits, and unchanged-plan boundary before interpreting the prototype.

Sprint 92 checkpoint doc: [`docs/sprint_92_contained_prototype_review_checklist.md`](docs/sprint_92_contained_prototype_review_checklist.md).

### Sprint 91: Contained Prototype Details Density

**Complete 2026-05-21.** Added a density selector that holds the contained prototype if the Details surface becomes too crowded.

Sprint 91 checkpoint doc: [`docs/sprint_91_contained_prototype_density.md`](docs/sprint_91_contained_prototype_density.md).

### Sprint 90: Contained Prototype Usefulness Closeout

**Complete 2026-05-21.** Added a Details-only usefulness closeout that says whether the contained prototype is useful for review, needs clearer evidence, or should not be used.

Sprint 90 checkpoint doc: [`docs/sprint_90_contained_prototype_usefulness_closeout.md`](docs/sprint_90_contained_prototype_usefulness_closeout.md).

### Sprint 89: Contained Prototype Example And Copy Guard

**Complete 2026-05-21.** Extended all-example coverage across contained prototype materiality, explanation, limitations, usefulness, copy posture, and saved-plan boundaries.

Sprint 89 checkpoint doc: [`docs/sprint_89_contained_prototype_example_copy_guard.md`](docs/sprint_89_contained_prototype_example_copy_guard.md).

### Sprint 88: Contained Prototype Limitations

**Complete 2026-05-21.** Added visible limitations explaining that the contained prototype is a scenario, not custom annual override execution, advice, or a filing instruction.

Sprint 88 checkpoint doc: [`docs/sprint_88_contained_prototype_limitations.md`](docs/sprint_88_contained_prototype_limitations.md).

### Sprint 87: Contained Prototype Explanation

**Complete 2026-05-21.** Added plain why-it-moved explanation rows for contained prototype movement and caution.

Sprint 87 checkpoint doc: [`docs/sprint_87_contained_prototype_explanation.md`](docs/sprint_87_contained_prototype_explanation.md).

### Sprint 86: Contained Prototype Materiality

**Complete 2026-05-21.** Added a materiality selector so small contained prototype movement is held rather than overemphasized.

Sprint 86 checkpoint doc: [`docs/sprint_86_contained_prototype_materiality.md`](docs/sprint_86_contained_prototype_materiality.md).

### Sprint 85: Contained Drawdown Prototype Review

**Complete 2026-05-20.** Added a Details-only contained prototype summary that turns one scenario comparison into ready, hold, or blocked review evidence without creating a plan action.

Sprint 85 checkpoint doc: [`docs/sprint_85_contained_drawdown_prototype_review.md`](docs/sprint_85_contained_drawdown_prototype_review.md).

### Sprint 84: Contained Prototype Example Matrix

**Complete 2026-05-20.** Extended all-example coverage across contained prototype status, summary status, copy posture, and persistence boundaries.

Sprint 84 checkpoint doc: [`docs/sprint_84_contained_prototype_example_matrix.md`](docs/sprint_84_contained_prototype_example_matrix.md).

### Sprint 83: Details-Only Prototype Evidence

**Complete 2026-05-20.** Surfaced contained prototype evidence in Details only, with funding, tax, OAS recovery, estate, and calculation-boundary rows.

Sprint 83 checkpoint doc: [`docs/sprint_83_details_only_prototype_evidence.md`](docs/sprint_83_details_only_prototype_evidence.md).

### Sprint 82: Prototype Harm Checks

**Complete 2026-05-20.** Blocked the contained prototype when funding worsens or an entered estate goal may be weakened.

Sprint 82 checkpoint doc: [`docs/sprint_82_prototype_harm_checks.md`](docs/sprint_82_prototype_harm_checks.md).

### Sprint 81: One Contained Real Scenario

**Complete 2026-05-20.** Added one contained scenario comparison using existing engine plumbing while keeping current withdrawal order, empty annual overrides, and saved plans unchanged.

Sprint 81 checkpoint doc: [`docs/sprint_81_one_contained_real_scenario.md`](docs/sprint_81_one_contained_real_scenario.md).

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
