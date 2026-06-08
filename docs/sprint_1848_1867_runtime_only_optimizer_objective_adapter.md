# S1848-S1867 Runtime-Only Optimizer Objective Adapter

Package
- S1848-S1867: Runtime-only optimizer objective adapter.
- This is one combined package document for the full twenty-sprint implementation block.

Goal
- Implement the first bounded runtime layer behind the planner-grade objective.
- Keep the primary answer as sustainable after-tax monthly capacity.
- Protect the minimum expense floor before optional room.
- Preserve estate and survivor constraints.
- Compare bounded CPP/OAS timing as evidence, not advice.
- Keep annual account-level withdrawal sequencing deferred.
- Keep all optimizer output runtime-only.

Implemented
- Added a typed `capacityObjective` packet to the bounded optimizer runtime summary.
- Derived monthly after-tax capacity from the selected bounded optimizer candidate.
- Derived the expense-floor comparison from the current runtime spending path without changing saved schema.
- Added optional monthly room after the floor is covered.
- Added constraint rows for:
  - Minimum expense floor.
  - Estate constraint.
  - Survivor constraint.
  - CPP/OAS timing comparison.
  - Annual withdrawal sequencing.
- Preserved bounded CPP/OAS timing comparison as runtime evidence only.
- Preserved annual account-level withdrawal sequencing as deferred.
- Added focused tests for covered capacity, gap capacity, estate preservation, survivor review, and runtime-only boundaries.

Runtime Shape
- `capacityObjective.status`: `covered`, `tight`, `gap`, `cannotTell`, or `blocked`.
- `capacityObjective.monthlyAfterTaxCapacity`: selected candidate annual sustainable spend divided by 12.
- `capacityObjective.minimumMonthlyExpenseFloor`: lowest positive annual spending phase divided by 12.
- `capacityObjective.optionalMonthlyRoom`: monthly capacity above the expense floor, never below zero.
- `capacityObjective.estateTarget`: entered estate target when present.
- `capacityObjective.projectedEstate`: selected candidate projected ending portfolio.
- `capacityObjective.survivorConstraint`: `protected`, `reviewFirst`, or `notApplicable`.
- `capacityObjective.timingComparison`: bounded CPP/OAS timing state.
- `capacityObjective.withdrawalSequencing`: always `deferred` in this package.
- `capacityObjective.rows`: consumer-facing constraint rows for review surfaces.

S1848-S1852 Capacity Metric Batch
- S1848: Add runtime capacity-objective type.
- S1849: Derive after-tax monthly capacity from selected bounded candidate.
- S1850: Derive minimum expense floor without adding saved fields.
- S1851: Add optional monthly room after floor coverage.
- S1852: First batch checkpoint: capacity output exists and remains runtime-only.

S1853-S1857 Constraint Batch
- S1853: Add minimum-floor constraint state.
- S1854: Add estate constraint state.
- S1855: Add survivor constraint state.
- S1856: Keep missing survivor setup as review-first for two-person plans.
- S1857: Second batch checkpoint: constraint states are visible in runtime output.

S1858-S1862 Timing Batch
- S1858: Connect capacity objective to bounded CPP/OAS timing family state.
- S1859: Keep timing comparison evidence non-advisory.
- S1860: Preserve CPP/OAS timing as bounded evidence, not a saved setting.
- S1861: Keep annual sequencing out of timing output.
- S1862: Third batch checkpoint: timing comparison remains evidence-only.

S1863-S1867 Boundary And Verification Batch
- S1863: Add runtime-only boundary copy to capacity objective.
- S1864: Add tests proving no saved optimizer output is added.
- S1865: Add gap-state test before optional room.
- S1866: Run focused optimizer tests and production build.
- S1867: Close package and recommend the next implementation slice.

Verification
- `npm test -- app/src/engine/boundedOptimizer.test.ts` passed.
- `npm run build` passed.
- Build emitted the existing large-chunk warning only.
- `find . -name '*.plan.json' -o -name '.plan.json'` returned no files.
- No production UI was implemented.
- No saved plan schema changes.
- No engine output schema changes.
- No annual account-level withdrawal sequencing.

Boundary
- The capacity objective is runtime-only.
- The output is not saved into `.plan.json`.
- The output is not a production UI contract.
- The output is not financial advice.
- The output is not an account-by-account withdrawal plan.
- The current V2 runtime interprets the existing spending path as the available expense-floor signal; the future clean schema can provide a more explicit minimum-expense field later.

Next Recommended Package
- S1868-S1887: Capacity Objective Evidence Surface And Guardrails.
- Add a development/research-only rendering path for `capacityObjective`.
- Keep Overview production UI deferred.
- Add copy guards against advice-like timing and account-instruction language.
- Add selector-level tests that verify capacity evidence stays out of saved files and normal UI until explicitly promoted.
