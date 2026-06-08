# S2148-S2167 Experimental Draft Readiness Repair Targeting

Package
- S2148-S2167: Experimental draft readiness repair targeting.
- This is one combined package document for the full twenty-sprint implementation block.

Goal
- Use experimental draft example matrix scoring to identify common repair themes.
- Highlight examples with low row coverage, blockers, watch items, tax context repair needs, and low confidence.
- Keep repair targeting runtime-only and focused on improving draft quality before UI, CSV, saved output, or report output.

Implemented
- Added repair targets to `OptimizerExperimentalDraftExampleMatrix`.
- Added row coverage repair targeting.
- Added blocker repair targeting.
- Added watch-item repair targeting.
- Added tax-context repair targeting.
- Added low-confidence repair targeting.
- Added focused selector coverage for repair targets.
- Added all-example matrix coverage for repair target shape.

S2148-S2152 Repair Target Shape Batch
- S2148: Add repair target rows to the example matrix.
- S2149: Add row coverage repair target.
- S2150: Add blocker repair target.
- S2151: Add watch-item repair target.
- S2152: First batch checkpoint: matrix exposes repair targets.

S2153-S2157 Repair Theme Batch
- S2153: Add tax context repair target.
- S2154: Add confidence repair target.
- S2155: Preserve example ids for each repair target.
- S2156: Keep target detail consumer-readable and non-exportable.
- S2157: Second batch checkpoint: repair targets explain what to fix next.

S2158-S2162 Example Coverage Batch
- S2158: Add focused selector tests for repair targets.
- S2159: Add bundled-example repair target assertions.
- S2160: Add clean-example repair target assertions.
- S2161: Preserve runtime-only matrix boundary.
- S2162: Third batch checkpoint: repair targeting works across synthetic examples.

S2163-S2167 Verification And Closeout Batch
- S2163: Run focused optimizer tests.
- S2164: Run plan-file save-boundary tests.
- S2165: Run example capacity and matrix tests.
- S2166: Run production build and file guards.
- S2167: Close package and recommend targeted repair implementation.

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
- Repair targets support draft quality improvement only.
- No saved instruction output.
- No CSV instruction output.
- No report instruction output.
- No production UI promotion.
- No tax-bracket instructions.
- No saved plan schema changes.
- No engine output schema changes.
- No `.plan.json` files.

Next Recommended Package
- S2168-S2187: Experimental Draft Repair Implementation.
- Use repair targets to improve low-coverage, watch-heavy, or blocked draft examples while keeping output runtime-only.
