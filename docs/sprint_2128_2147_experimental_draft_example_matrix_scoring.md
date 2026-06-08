# S2128-S2147 Experimental Draft Example Matrix Scoring

Package
- S2128-S2147: Experimental draft example matrix scoring.
- This is one combined package document for the full twenty-sprint implementation block.

Goal
- Aggregate experimental draft readiness across bundled and clean synthetic examples.
- Identify which scenarios are ready for tester review, need review first, or are blocked.
- Keep the matrix runtime-only and out of saved, CSV, report, and production UI output.

Implemented
- Added `OptimizerExperimentalDraftExampleMatrixItem`.
- Added `OptimizerExperimentalDraftExampleMatrix`.
- Added `selectOptimizerExperimentalDraftExampleMatrix`.
- Matrix scoring aggregates readiness status, confidence level, row coverage, blocker count, watch count, and review items.
- Added focused unit coverage for ready plus review-first examples.
- Added bundled and clean example matrix coverage.

S2128-S2132 Matrix Shape Batch
- S2128: Add matrix item type.
- S2129: Add matrix summary type.
- S2130: Add ready, review-first, and blocked counts.
- S2131: Add per-example row coverage and review item fields.
- S2132: First batch checkpoint: matrix has a stable runtime shape.

S2133-S2137 Aggregation Batch
- S2133: Aggregate readiness statuses.
- S2134: Aggregate confidence levels.
- S2135: Aggregate blocker and watch counts.
- S2136: Preserve review items per example.
- S2137: Second batch checkpoint: matrix identifies weak examples.

S2138-S2142 Example Coverage Batch
- S2138: Score bundled examples.
- S2139: Score clean examples.
- S2140: Add focused selector tests.
- S2141: Keep matrix runtime-only.
- S2142: Third batch checkpoint: examples score without persistence or export.

S2143-S2147 Verification And Closeout Batch
- S2143: Run focused optimizer tests.
- S2144: Run plan-file save-boundary tests.
- S2145: Run example capacity and matrix tests.
- S2146: Run production build and file guards.
- S2147: Close package and recommend readiness repair targeting.

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
- Matrix scoring supports readiness repair decisions only.
- No saved instruction output.
- No CSV instruction output.
- No report instruction output.
- No production UI promotion.
- No tax-bracket instructions.
- No saved plan schema changes.
- No engine output schema changes.
- No `.plan.json` files.

Next Recommended Package
- S2148-S2167: Experimental Draft Readiness Repair Targeting.
- Use matrix scores to identify common blockers and watch items, then improve the runtime draft where evidence is weakest.
