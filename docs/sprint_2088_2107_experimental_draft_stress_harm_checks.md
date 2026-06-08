# S2088-S2107 Experimental Draft Stress And Harm Checks

Package
- S2088-S2107: Experimental draft stress and harm checks.
- This is one combined package document for the full twenty-sprint implementation block.

Goal
- Add runtime stress and harm checks around experimental annual draft rows before UI, CSV, saved output, or report output.
- Flag projected shortfall, estate pressure, survivor review, OAS recovery, tax context availability, and output boundary posture.
- Keep the draft synthetic-tester-only and runtime-only.

Implemented
- Added `OptimizerExperimentalDraftHarmCheckRow`.
- Added `harmChecks` to `OptimizerExperimentalAnnualInstructionDraft`.
- Added shortfall harm check from selected-candidate summary.
- Added estate pressure, survivor review, OAS recovery, tax context availability, and output boundary harm checks.
- Added focused optimizer coverage for harm check rows.
- Added example-matrix coverage for harm check shape and output boundary.

S2088-S2092 Harm Check Shape Batch
- S2088: Add harm check row type.
- S2089: Add harm checks to experimental annual draft output.
- S2090: Add shortfall check.
- S2091: Add output boundary check.
- S2092: First batch checkpoint: harm checks have a stable runtime shape.

S2093-S2097 Constraint And Tax Watch Batch
- S2093: Add estate pressure check.
- S2094: Add survivor review check.
- S2095: Add OAS recovery watch check.
- S2096: Add tax context availability check.
- S2097: Second batch checkpoint: draft rows carry review flags before UI/export.

S2098-S2102 Example Matrix Batch
- S2098: Add focused optimizer assertions.
- S2099: Add bundled-example harm check assertions.
- S2100: Add clean-example harm check assertions.
- S2101: Preserve runtime-only output boundary.
- S2102: Third batch checkpoint: examples carry harm checks without persistence.

S2103-S2107 Verification And Closeout Batch
- S2103: Run focused optimizer tests.
- S2104: Run plan-file save-boundary tests.
- S2105: Run example capacity matrix tests.
- S2106: Run production build and file guards.
- S2107: Close package and recommend draft summary/readiness hardening.

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
- Harm checks support draft review only.
- No saved instruction output.
- No CSV instruction output.
- No report instruction output.
- No production UI promotion.
- No tax-bracket instructions.
- No saved plan schema changes.
- No engine output schema changes.
- No `.plan.json` files.

Next Recommended Package
- S2108-S2127: Experimental Draft Readiness Summary.
- Summarize confidence, harm checks, tax context, and draft-row coverage into one runtime readiness packet before UI/export decisions.
