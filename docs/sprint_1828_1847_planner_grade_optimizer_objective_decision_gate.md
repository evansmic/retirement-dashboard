# S1828-S1847 Planner-Grade Optimizer Objective Decision Gate

Package
- S1828-S1847: Planner-grade optimizer objective decision gate.
- This is one combined package document for the full twenty-sprint planning block.
- Note: `docs/sprint_1828_intake_mockup_layout_refinement.md` already exists from the static mockup track. This package keeps the requested S1828-S1847 range as a planning label without replacing that file.

Goal
- Define the optimizer objective and boundaries before implementation.
- Keep the product answer focused on sustainable after-tax monthly capacity.
- Protect minimum living expenses before optional spending.
- Preserve estate and survivor constraints.
- Compare CPP/OAS timing without turning timing evidence into advice.
- Prepare for future annual account-level withdrawal sequencing.
- Keep all optimizer output runtime-only for now.

Decision
- The planner-grade optimizer objective is: maximize sustainable after-tax monthly spending capacity, subject to minimum expense, survivor, estate, tax, benefit-timing, and account-balance constraints.
- Sustainable capacity is the after-tax monthly amount the household can support under the configured projection assumptions, not a user-entered desired-spend target.
- The optimizer should identify a capacity answer and supporting evidence, not account-by-account instructions yet.
- The first implementation path should be deterministic and bounded. Monte Carlo-in-loop optimization remains deferred.

Primary Objective
- Maximize sustainable after-tax monthly capacity in today's dollars.
- Capacity should be expressed as a monthly household figure.
- The answer should be net of federal and Ontario tax, OAS recovery tax, debt payments, and modelled required cash flows.
- Capacity should be based on available income and withdrawals after preserving hard constraints.
- If capacity cannot be estimated cleanly, the product should say what is missing or limiting the result in calm consumer language.

Minimum Expense Floor
- Minimum expense floor is a hard protection boundary.
- The optimizer must first test whether essential monthly expenses can be covered.
- Optional spending room is only meaningful after the minimum floor is protected.
- If the minimum floor is not covered, the result should emphasize the gap and the drivers instead of ranking optional spending strategies.
- The optimizer should avoid implying a household can spend more when essential costs are unfunded in any material period.

Estate Constraint
- Estate protection is a constraint, not the primary objective.
- The user may preserve a target estate or minimum final value.
- The optimizer should not maximize spending by silently exhausting assets below the estate floor.
- If the estate target conflicts with spending capacity, the output should show the trade-off as a review item.
- Estate evidence should remain consumer-facing: "projected money left" or "estate target pressure" rather than technical optimization terms.

Survivor Constraint
- Survivor protection is a constraint, not an optional diagnostic.
- Two-person plans must preserve survivor feasibility before presenting higher capacity.
- The optimizer should test the configured survivor scenario when one exists.
- If survivor inputs are missing, the output should identify survivor review as a blocker or caution before widening optimization.
- CPP survivor treatment, pension continuation, estate rollover, and household expense changes should remain aligned with existing engine behavior.

CPP/OAS Timing Boundary
- CPP/OAS timing is an optimizer lever to compare, not a recommendation by itself.
- CPP timing may be compared across bounded milestones, with the future implementation path still allowed to use existing seed ages first.
- OAS timing may be compared across bounded milestones from 65 to 70.
- Timing evidence should include after-tax monthly capacity, floor coverage, survivor effect, estate effect, lifetime tax, and OAS recovery tax where available.
- Copy must avoid "take CPP at", "claim OAS at", "optimal", "guaranteed", or "best" phrasing.
- Acceptable phrasing: "first timing option to review", "higher capacity in this model", "needs survivor review", "sensitive to tax and longevity assumptions".

Withdrawal Sequencing Boundary
- Annual account-level withdrawal sequencing remains deferred.
- The current package prepares for future sequencing by defining objective and constraints only.
- Broad withdrawal-family evidence may remain useful as comparison evidence, but it is not an annual instruction.
- Future sequencing should operate year by year and account by account only after this objective gate is accepted.
- Future sequencing should respect RRIF/LIF minimums and LIF maximums, taxable income effects, capital gains, OAS recovery, pension splitting, CPP sharing, survivor changes, and estate constraints.
- No annual account-level output should be saved or surfaced as production UI from this package.

Runtime-Only Boundary
- Optimizer objective metadata is runtime-only for now.
- No saved plan schema changes.
- No engine output schema changes.
- No `.plan.json` files.
- No persisted optimizer result.
- No production UI implementation.
- No account-level annual withdrawal instructions.
- No tax-bracket target instructions.
- No advice-like copy.

Consumer Copy Boundary
- The product should answer, "What monthly after-tax spending capacity does this plan appear to support?"
- It should not ask the user to enter desired spend as the primary answer.
- It should use calm, non-advisory review language.
- It should explain limits plainly when capacity is blocked or constrained.
- It should keep tax and timing details as supporting evidence rather than the headline.

Candidate Evaluation Shape
- Start with the current plan as baseline.
- Generate bounded candidate families that vary benefit timing and high-level withdrawal posture within existing engine-supported inputs.
- For each candidate, estimate after-tax monthly capacity while enforcing minimum floor, survivor, and estate constraints.
- Reject candidates that fail hard constraints.
- Rank feasible candidates by sustainable after-tax monthly capacity.
- Use tie-breakers only after capacity is effectively equal.

Tie-Breaker Order
- Prefer stronger minimum-floor coverage.
- Prefer stronger survivor coverage.
- Prefer meeting the estate target with more margin.
- Prefer lower lifetime tax and OAS recovery only after household capacity and constraints are comparable.
- Prefer simpler, more explainable candidate families when the financial difference is small.
- Keep all tie-breaker evidence review-oriented.

Evidence Required Before Implementation
- A written objective contract.
- A list of hard constraints and soft tie-breakers.
- A bounded CPP/OAS comparison shape.
- A future annual sequencing readiness map.
- A runtime-only output boundary.
- A copy guard that blocks advice-like language.
- A verification checklist that confirms schemas and saved files remain untouched.

S1828-S1832 Objective Batch
- S1828: Record the planner-grade optimizer objective as sustainable after-tax monthly capacity.
- S1829: Define the capacity metric as household monthly after-tax dollars in today's-dollar framing.
- S1830: Separate user-entered expense floor from computed optional spending room.
- S1831: Confirm estate and survivor constraints as hard boundaries.
- S1832: First batch checkpoint: objective is clear, bounded, and not advice-like.

S1833-S1837 Constraint Batch
- S1833: Define minimum expense floor failure states.
- S1834: Define estate-target pressure states.
- S1835: Define survivor feasibility states.
- S1836: Define blocked and caution states for missing survivor or estate inputs.
- S1837: Second batch checkpoint: constraints are sufficient before candidate ranking.

S1838-S1842 Timing And Sequencing Prep Batch
- S1838: Define CPP timing comparison boundaries.
- S1839: Define OAS timing comparison boundaries.
- S1840: Define evidence rows for timing comparisons.
- S1841: Map future annual account-level sequencing prerequisites.
- S1842: Third batch checkpoint: timing comparison can proceed without annual instructions.

S1843-S1847 Runtime Boundary And Closeout Batch
- S1843: Reconfirm runtime-only output treatment.
- S1844: Reconfirm no saved schema or engine output schema changes.
- S1845: Add consumer-copy guardrails for optimizer evidence.
- S1846: Add verification expectations for the eventual implementation package.
- S1847: Close the decision gate and recommend implementation only after the objective contract is accepted.

Verification Expectations For This Planning Package
- Documentation only.
- No production UI changes.
- No engine changes.
- No saved schema changes.
- No engine output schema changes.
- No generated `.plan.json` files.
- No tests required beyond reviewing the documentation diff.

Next Recommended Package
- Implement a runtime-only optimizer objective adapter behind existing research or development surfaces.
- Keep the first implementation bounded and deterministic.
- Start with capacity calculation and constraint filtering before expanding candidate search.
- Do not build production UI until the runtime evidence is stable and understandable.
