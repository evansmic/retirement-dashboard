# S1988-S2007 Annual Sequencing Runtime Input Adapter

Package
- S1988-S2007: Annual sequencing runtime input adapter.
- This is one combined package document for the full twenty-sprint implementation block.

Goal
- Move faster toward tester-only modelled plan drafts while staying runtime-only.
- Gather annual result rows, account balance fields, tax context fields, capacity objective context, and constraint hooks for later experimental account-order drafts.
- Keep outputs clearly blocked: no account order, annual account instructions, tax-bracket instructions, saved sequencing output, CSV sequencing output, report output, or production UI.

Implemented
- Added `OptimizerAnnualSequencingInputAdapter` runtime type.
- Added `OptimizerAnnualSequencingInputAdapterRow` runtime type.
- Added `selectOptimizerAnnualSequencingInputAdapter`.
- Added `annualSequencingInputAdapter` to bounded optimizer runtime summary.
- Adapter captures selected modelled candidate, modelled year range, available account balance fields, available tax fields, and constraint inputs.
- Adapter keeps survivor review, estate target, minimum floor, and CPP/OAS timing as context hooks only.
- Added save-boundary coverage proving the adapter packet is stripped from editable plan files.
- Extended example-matrix capacity coverage so bundled and clean examples keep the adapter runtime-only.

S1988-S1992 Adapter Shape Batch
- S1988: Add annual sequencing input adapter type.
- S1989: Add adapter row type.
- S1990: Add selected-candidate and year-range fields.
- S1991: Add available account balance and tax field lists.
- S1992: First batch checkpoint: adapter shape exists without draft instructions.

S1993-S1997 Constraint Hook Batch
- S1993: Add capacity objective as adapter context.
- S1994: Add minimum expense floor as a constraint input.
- S1995: Add estate target as a constraint input when present.
- S1996: Add survivor review and benefit timing comparison hooks.
- S1997: Second batch checkpoint: adapter gathers constraints without creating account order.

S1998-S2002 Save And Example Boundary Batch
- S1998: Add adapter to export guard forbidden saved keys.
- S1999: Add plan-file save stripping coverage.
- S2000: Add bundled-example adapter expectations.
- S2001: Add clean-example adapter expectations.
- S2002: Third batch checkpoint: examples can reach adapter readiness without saved output.

S2003-S2007 Verification And Closeout Batch
- S2003: Run focused optimizer tests.
- S2004: Run plan-file save-boundary tests.
- S2005: Run example capacity matrix tests.
- S2006: Run production build and file guards.
- S2007: Close package and recommend the experimental account-order draft slice.

Verification
- `npm test -- app/src/engine/boundedOptimizer.test.ts` passed.
- `npm test -- app/src/data/planFile.test.ts` passed.
- `npm test -- app/src/engine/examplePlanOptimizerReadiness.test.ts -t "capacity objective"` passed.
- `npm run build` passed.
- Build emitted the existing large-chunk warning only.
- `git diff --check` passed.
- `find . -name '*.plan.json' -o -name '.plan.json'` returned no files.

Boundary
- Tester-only synthetic-scenario direction is acknowledged.
- Runtime-only adapter output only.
- No account-order output.
- No annual account-level withdrawal instructions.
- No tax-bracket instructions.
- No saved sequencing output.
- No CSV sequencing output.
- No printable report output change.
- No production UI promotion.
- No saved plan schema changes.
- No engine output schema changes.
- No `.plan.json` files.

Next Recommended Package
- S2008-S2027: Experimental Account Order Draft.
- Produce a runtime-only, clearly experimental account-order draft for synthetic tester scenarios.
- Keep annual account dollar rows, saved output, CSV output, report output, and production UI deferred.
