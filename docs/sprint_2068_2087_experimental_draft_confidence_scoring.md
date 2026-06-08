# S2068-S2087 Experimental Draft Confidence Scoring

Package
- S2068-S2087: Experimental draft confidence scoring.
- This is one combined package document for the full twenty-sprint implementation block.

Goal
- Improve confidence in runtime-only experimental annual draft rows before UI, CSV, saved output, or report output.
- Score draft quality using row coverage, tax context, account-order source, constraint hooks, survivor review, and output boundaries.
- Keep the work synthetic-tester-only and runtime-only.

Implemented
- Added `OptimizerExperimentalDraftConfidenceLevel`.
- Added `OptimizerExperimentalDraftConfidenceRow`.
- Added `OptimizerExperimentalDraftConfidence`.
- Added confidence scoring to `OptimizerExperimentalAnnualInstructionDraft`.
- Added confidence rows for draft row coverage, tax context coverage, account order source, constraint coverage, survivor review, and output boundary.
- Added blocker collection and a numeric score.
- Added focused optimizer tests and example-matrix coverage for confidence output.

S2068-S2072 Confidence Shape Batch
- S2068: Add confidence level type.
- S2069: Add confidence row type.
- S2070: Add confidence summary type.
- S2071: Add confidence to annual draft output.
- S2072: First batch checkpoint: draft confidence has a stable runtime shape.

S2073-S2077 Quality Signal Batch
- S2073: Score draft row coverage.
- S2074: Score tax context coverage.
- S2075: Score account-order source.
- S2076: Score constraint hooks and survivor review.
- S2077: Second batch checkpoint: draft quality signals are visible without UI changes.

S2078-S2082 Boundary And Blocker Batch
- S2078: Add output-boundary confidence row.
- S2079: Add blocker collection.
- S2080: Add confidence score and level mapping.
- S2081: Keep confidence runtime-only and synthetic-tester-only.
- S2082: Third batch checkpoint: confidence supports draft review, not export.

S2083-S2087 Verification And Closeout Batch
- S2083: Run focused optimizer tests.
- S2084: Run plan-file save-boundary tests.
- S2085: Run example capacity matrix tests.
- S2086: Run production build and file guards.
- S2087: Close package and recommend draft stress/harm checks.

Verification
- `npm test -- app/src/engine/boundedOptimizer.test.ts` passed.
- `npm test -- app/src/data/planFile.test.ts` passed.
- `npm test -- app/src/engine/examplePlanOptimizerReadiness.test.ts -t "capacity objective"` passed.
- `npm run build` passed.
- Build emitted the existing large-chunk warning only.
- `git diff --check` passed.
- `find . -name '*.plan.json' -o -name '.plan.json'` returned no files.

Boundary
- Tester-only synthetic-scenario runtime output.
- Confidence supports draft review only.
- No saved instruction output.
- No CSV instruction output.
- No report instruction output.
- No production UI promotion.
- No tax-bracket instructions.
- No saved plan schema changes.
- No engine output schema changes.
- No `.plan.json` files.

Next Recommended Package
- S2088-S2107: Experimental Draft Stress And Harm Checks.
- Add runtime checks for draft-row shortfall, survivor review, estate floor pressure, OAS recovery watch, and tax context watch items before any UI/export decisions.
