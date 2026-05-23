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

Sprint 200 is complete. Tax-aware drawdown work has a conservative v1 bounded execution path, baseline plus nearby spending stress live behind the engine-owned stress helper module, detailed Monte Carlo/historical stress has an explicit v1 deferral decision, and checkpoint feedback has now produced a narrow trust-cleanup batch. The next logical slice is explicit pension-splitting baseline investigation before returning to bounded optimizer/drawdown execution.

Completed Sprint 196-200 slices:

- Added local backup reminders and save-before-results/report prompts.
- Trimmed compact optimizer options and compact readiness diagnostics out of Overview.
- Made Ontario 2026 tax-assumption scope visible in Results, Taxes, and Assumptions.
- Removed consumer-facing diagnostic withdrawal wording and mapped older diagnostic values back to Default in consumer preview paths.
- Gated checkpoint-only review panels out of the normal consumer Details path.
- Kept the visual mockups as later UI/UX references, not current implementation scope.
- Preserved current withdrawal order and empty annual overrides.
- Confirmed v1 recommended-plan drawdown review, details placement, review copy guard, recommended-plan closeout, re-entry review, next sprint plan, re-entry closeout, detailed stress v1 migration decision, v1 decision closeout, manual report reference, manual comparison, comparison closeout, probe coverage, probe-backed runner bridge, bridge run, bridge closeout, adapter request, injected runner prototype, prototype closeout, adapter contract, adapter validation, adapter batch closeout, boundary review, migration closeout, stress extraction readiness, stress boundary output, stress rows, spending stress output, v1 execution output, contained prototype output, draft output, comparison output, runtime payloads, mocked payloads, and optimizer output remain unsaved.
- Kept Sprints 196-200 as checkpoint trust cleanup, not optimizer expansion, stress migration, report migration, broad visual redesign, or simulation math changes.

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
