# S2008-S2027 Experimental Account Order Draft

Package
- S2008-S2027: Experimental account order draft.
- This is one combined package document for the full twenty-sprint implementation block.

Goal
- Produce a runtime-only experimental account-order draft for synthetic tester scenarios.
- Use the selected modelled candidate and available account balance fields from the annual sequencing input adapter.
- Keep annual dollar rows, saved output, CSV output, report output, production UI, and tax-bracket instructions deferred.

Implemented
- Added `OptimizerExperimentalAccountOrderDraft` runtime type.
- Added `OptimizerExperimentalAccountOrderDraftRow` runtime type.
- Added `OptimizerExperimentalAccountBucket`.
- Added `selectOptimizerExperimentalAccountOrderDraft`.
- Added `experimentalAccountOrderDraft` to bounded optimizer runtime summary.
- Added account-order draft coverage for focused optimizer tests.
- Added save stripping and example-matrix coverage for the draft packet.

S2008-S2012 Draft Shape Batch
- S2008: Add experimental account bucket type.
- S2009: Add account-order draft row type.
- S2010: Add account-order draft summary type.
- S2011: Add synthetic tester audience marker.
- S2012: First batch checkpoint: account-order draft shape exists without annual dollar rows.

S2013-S2017 Candidate Mapping Batch
- S2013: Map registered-first candidate to registered-led draft order.
- S2014: Map non-registered-first candidate to non-registered-led draft order.
- S2015: Use neutral available-balance order for other selected candidates.
- S2016: Keep unavailable balance fields out of draft rows.
- S2017: Second batch checkpoint: account order derives from modelled candidate context.

S2018-S2022 Boundary Batch
- S2018: Block annual dollar instructions.
- S2019: Block saved account order.
- S2020: Block CSV account order.
- S2021: Block report account order and tax-bracket instructions.
- S2022: Third batch checkpoint: account order is runtime-only and tester-only.

S2023-S2027 Verification And Closeout Batch
- S2023: Run focused optimizer tests.
- S2024: Run plan-file save-boundary tests.
- S2025: Run example capacity matrix tests.
- S2026: Run production build and file guards.
- S2027: Close package and continue to experimental annual instruction draft rows.

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
- No annual dollar instructions in this package.
- No saved account order.
- No CSV account order.
- No report account order.
- No production UI promotion.
- No tax-bracket instructions.
- No saved plan schema changes.
- No engine output schema changes.
- No `.plan.json` files.

Next Recommended Package
- S2028-S2047: Experimental Annual Instruction Draft Rows.
- Add runtime-only experimental annual rows for synthetic tester scenarios.
- Keep saved output, CSV output, report output, production UI, and tax-bracket instructions deferred.
