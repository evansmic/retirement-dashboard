# S2048-S2067 Experimental Draft Tax Context Hardening

Package
- S2048-S2067: Experimental draft tax context hardening.
- This is one combined package document for the full twenty-sprint implementation block.

Goal
- Improve the runtime-only experimental annual draft rows so testers can understand tax context.
- Add useful context without creating tax-bracket instructions.
- Keep improving output quality and confidence before UI, CSV, saved output, or report output.

Implemented
- Added after-tax spending context to experimental annual instruction draft rows.
- Added approximate effective tax rate context to draft rows.
- Added OAS recovery status to draft rows.
- Added draft-level tax context rows for tax range, OAS recovery, after-tax spending, effective tax rate, and boundary.
- Updated draft rationale to explain that rows mirror selected modelled candidate withdrawal fields with tax context.
- Added focused tests for effective tax rate, OAS status, after-tax spending, and no tax-bracket instruction wording.
- Added example-matrix coverage for tax context rows.

S2048-S2052 Row Tax Context Batch
- S2048: Add after-tax spending to draft row context.
- S2049: Add approximate effective tax rate to draft row context.
- S2050: Add OAS recovery status to draft row context.
- S2051: Update draft row rationale.
- S2052: First batch checkpoint: draft rows carry useful tax context.

S2053-S2057 Draft Summary Tax Context Batch
- S2053: Add draft-level tax range row.
- S2054: Add draft-level OAS recovery row.
- S2055: Add draft-level after-tax spending row.
- S2056: Add draft-level effective tax rate row.
- S2057: Second batch checkpoint: draft has summary tax context without bracket guidance.

S2058-S2062 Boundary Batch
- S2058: Add tax boundary row.
- S2059: Guard against stay-under style copy.
- S2060: Keep saved output deferred.
- S2061: Keep CSV, report, and production UI deferred.
- S2062: Third batch checkpoint: tax context remains explanatory only.

S2063-S2067 Verification And Closeout Batch
- S2063: Run focused optimizer tests.
- S2064: Run plan-file save-boundary tests.
- S2065: Run example capacity matrix tests.
- S2066: Run production build and file guards.
- S2067: Close package and recommend draft confidence scoring.

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
- Tax context explains draft rows.
- No tax-bracket instructions.
- No saved instruction output.
- No CSV instruction output.
- No report instruction output.
- No production UI promotion.
- No saved plan schema changes.
- No engine output schema changes.
- No `.plan.json` files.

Next Recommended Package
- S2068-S2087: Experimental Draft Confidence Scoring.
- Add runtime confidence/quality signals for experimental draft rows before considering UI, CSV, or saved output.
