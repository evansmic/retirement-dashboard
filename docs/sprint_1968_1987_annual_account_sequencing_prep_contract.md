# S1968-S1987 Annual Account Sequencing Prep Contract

Package
- S1968-S1987: Annual account sequencing prep contract.
- This is one combined package document for the full twenty-sprint implementation block.

Goal
- Define the runtime-only input contract for a future annual account-level withdrawal sequencing adapter.
- Preserve the minimum expense floor, estate constraints, survivor constraints, and bounded CPP/OAS timing boundaries.
- Keep annual account-level sequencing as prep only.
- Block account instructions, account order, tax-bracket instructions, saved sequencing output, CSV sequencing output, report output changes, and production UI changes.

Implemented
- Added `OptimizerAnnualSequencingPrepContract` runtime type.
- Added `OptimizerAnnualSequencingPrepRow` runtime type.
- Added `selectOptimizerAnnualSequencingPrepContract`.
- Added `annualSequencingPrepContract` to bounded optimizer runtime summary.
- Added contract inputs for capacity objective, annual result rows, account balances, tax context, estate/survivor constraints, and bounded benefit timing comparison.
- Added blocked outputs for annual account instructions, account order, tax-bracket instructions, saved sequencing output, and CSV sequencing output.
- Added save-boundary coverage proving sequencing-prep packets are stripped from editable plan files.
- Extended example-matrix capacity coverage so bundled and clean examples keep sequencing prep runtime-only.

S1968-S1972 Contract Shape Batch
- S1968: Add annual sequencing prep contract type.
- S1969: Add annual sequencing prep row type.
- S1970: Add input requirements for future sequencing.
- S1971: Add blocked output list.
- S1972: First batch checkpoint: sequencing prep exists without producing annual rows.

S1973-S1977 Guardrail Batch
- S1973: Block account-level instructions.
- S1974: Block account-order output.
- S1975: Block tax-bracket instructions.
- S1976: Block saved and CSV sequencing output.
- S1977: Second batch checkpoint: prep contract is input-only and runtime-only.

S1978-S1982 Example Matrix Batch
- S1978: Add bundled-example sequencing prep expectations.
- S1979: Add clean-example sequencing prep expectations.
- S1980: Add accidental runtime-enriched save stripping checks.
- S1981: Keep survivor-sensitive plans deferred for survivor review.
- S1982: Third batch checkpoint: examples support sequencing prep without sequencing implementation.

S1983-S1987 Verification And Closeout Batch
- S1983: Run focused optimizer tests.
- S1984: Run plan-file save-boundary tests.
- S1985: Run example capacity matrix tests.
- S1986: Run production build and file guards.
- S1987: Close package and recommend the next adapter-readiness slice.

Verification
- `npm test -- app/src/engine/boundedOptimizer.test.ts` passed.
- `npm test -- app/src/data/planFile.test.ts` passed.
- `npm test -- app/src/engine/examplePlanOptimizerReadiness.test.ts -t "capacity objective"` passed.
- `npm run build` passed.
- Build emitted the existing large-chunk warning only.
- `git diff --check` passed.
- `find . -name '*.plan.json' -o -name '.plan.json'` returned no files.

Boundary
- No saved plan schema changes.
- No engine output schema changes.
- No persisted optimizer output.
- No printable report output change.
- No CSV output change.
- No `.plan.json` files.
- No production UI promotion.
- No annual account-level withdrawal instructions.
- No account-order output.
- No tax-bracket instructions.
- No advice-like CPP/OAS timing language.

Next Recommended Package
- S1988-S2007: Annual Sequencing Adapter Readiness Matrix.
- Check what existing annual result rows and account balance fields can safely support later adapter planning.
- Keep the work runtime-only and do not produce account-level instructions.
