# S2028-S2047 Experimental Annual Instruction Draft Rows

Package
- S2028-S2047: Experimental annual instruction draft rows.
- This is one combined package document for the full twenty-sprint implementation block.

Goal
- Produce runtime-only experimental annual account draft rows for synthetic tester scenarios.
- Mirror observed selected-candidate annual withdrawal fields rather than create a new withdrawal engine.
- Include compact tax context beside draft rows.
- Keep saved output, CSV output, report output, production UI, and tax-bracket instructions deferred.

Implemented
- Added `OptimizerExperimentalAnnualInstructionDraft` runtime type.
- Added `OptimizerExperimentalAnnualInstructionDraftRow` runtime type.
- Added `selectOptimizerExperimentalAnnualInstructionDraft`.
- Added `experimentalAnnualInstructionDraft` to bounded optimizer runtime summary.
- Draft rows use the first modelled annual window from the selected candidate.
- Draft rows include year, account bucket, amount, total tax, taxable income, and OAS recovery context.
- Added focused optimizer coverage proving synthetic registered-first rows are produced.
- Added save stripping and example-matrix coverage for the annual draft packet.

S2028-S2032 Draft Row Shape Batch
- S2028: Add annual instruction draft type.
- S2029: Add annual instruction row type.
- S2030: Add synthetic tester audience marker.
- S2031: Add compact tax context fields.
- S2032: First batch checkpoint: annual draft rows exist only as runtime metadata.

S2033-S2037 Selected Candidate Mapping Batch
- S2033: Read selected-candidate annual rows.
- S2034: Map registered withdrawal fields into registered draft rows.
- S2035: Map TFSA, non-registered, cash, and LIF withdrawal fields when present.
- S2036: Sort rows by experimental account-order draft.
- S2037: Second batch checkpoint: draft rows mirror modelled output, not a new sequencing engine.

S2038-S2042 Boundary Batch
- S2038: Block saved instruction output.
- S2039: Block CSV instruction output.
- S2040: Block report instruction output.
- S2041: Block production UI and tax-bracket instructions.
- S2042: Third batch checkpoint: annual draft rows remain tester-only and runtime-only.

S2043-S2047 Verification And Closeout Batch
- S2043: Run focused optimizer tests.
- S2044: Run plan-file save-boundary tests.
- S2045: Run example capacity matrix tests.
- S2046: Run production build and file guards.
- S2047: Close package and recommend tax-context hardening before export decisions.

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
- Draft rows are experimental and not final advice.
- No saved instruction output.
- No CSV instruction output.
- No report instruction output.
- No production UI promotion.
- No tax-bracket instructions.
- No saved plan schema changes.
- No engine output schema changes.
- No `.plan.json` files.

Next Recommended Package
- S2048-S2067: Experimental Draft Tax Context Hardening.
- Improve tax context around experimental rows without turning it into tax-bracket instructions.
- Keep saved output, CSV output, report output, and production UI deferred.
