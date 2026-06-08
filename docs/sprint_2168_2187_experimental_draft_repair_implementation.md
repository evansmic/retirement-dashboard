# S2168-S2187 Experimental Draft Repair Implementation

Package
- S2168-S2187: Experimental draft repair implementation.
- This is one combined package document for the full twenty-sprint implementation block.

Goal
- Use repair-target signals to improve experimental draft quality.
- Improve draft row coverage before UI, CSV, saved output, or report output.
- Make repair targets more actionable for the next runtime quality pass.

Implemented
- Expanded the annual draft scan from the first 5 modelled years to the first 10 modelled years.
- Added `repairAction` to each matrix repair target.
- Updated row coverage repair detail to refer to the draft window.
- Added specific repair actions for row coverage, blockers, watch items, tax context, and confidence.
- Updated focused selector coverage for repair actions.
- Updated bundled and clean example matrix coverage for repair action presence.

S2168-S2172 Coverage Repair Batch
- S2168: Expand draft window to ten modelled years.
- S2169: Preserve runtime-only draft row derivation from selected-candidate annual rows.
- S2170: Keep row coverage repair target active for examples still below threshold.
- S2171: Keep saved, CSV, report, and production UI output deferred.
- S2172: First batch checkpoint: row coverage improves without inventing new sequencing logic.

S2173-S2177 Repair Action Batch
- S2173: Add repair action field to matrix repair targets.
- S2174: Add row coverage repair action.
- S2175: Add blocker and watch-item repair actions.
- S2176: Add tax context and confidence repair actions.
- S2177: Second batch checkpoint: repair targets explain what to do next.

S2178-S2182 Example Coverage Batch
- S2178: Update focused selector tests.
- S2179: Update bundled-example matrix tests.
- S2180: Update clean-example matrix tests.
- S2181: Preserve copy guards against directive tax language.
- S2182: Third batch checkpoint: repair implementation is covered across synthetic examples.

S2183-S2187 Verification And Closeout Batch
- S2183: Run focused optimizer tests.
- S2184: Run plan-file save-boundary tests.
- S2185: Run example capacity and matrix tests.
- S2186: Run production build and file guards.
- S2187: Close package and recommend clean-example draft repair.

Verification
- `npm test -- app/src/engine/boundedOptimizer.test.ts` passed.
- `npm test -- app/src/data/planFile.test.ts` passed.
- `npm test -- app/src/engine/examplePlanOptimizerReadiness.test.ts -t "capacity objective|scores experimental draft"` passed.
- `npm run build` passed.
- Build emitted the existing large-chunk warning only.
- `git diff --check` passed.
- `find . -name '*.plan.json' -o -name '.plan.json'` returned no files.

Boundary
- Tester-only synthetic-scenario runtime output.
- Repair implementation improves draft quality only.
- No saved instruction output.
- No CSV instruction output.
- No report instruction output.
- No production UI promotion.
- No tax-bracket instructions.
- No saved plan schema changes.
- No engine output schema changes.
- No `.plan.json` files.

Next Recommended Package
- S2188-S2207: Clean Example Draft Repair.
- Improve clean-example annual draft readiness, especially examples with missing annual rows, low row coverage, or blocked account-order source evidence.
