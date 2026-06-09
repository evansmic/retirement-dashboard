# S2328-S2347 Annual Candidate Presentation Readiness

Package
- S2328-S2347: Annual candidate presentation readiness.
- This is one combined package document for the full twenty-sprint implementation block.

Goal
- Prepare runtime-only annual candidate presentation fields for synthetic tester review.
- Make candidate summaries understandable enough for feature testing without treating them as real retirement plans.
- Keep saved sequencing output, CSV output, reports, and production UI out of scope.

Implemented
- Added `presentationReadiness` to the runtime-only experimental annual instruction draft.
- Added candidate display rows with year label, status label, quality label, repair preview, and total amount.
- Added presentation checks for candidate labels, quality labels, repair previews, and output boundary.
- Added review-only summary, boundary, and next-step copy for synthetic tester review.
- Added focused optimizer and example-readiness coverage.

S2328-S2332 Display Row Batch
- S2328: Add presentation readiness shape.
- S2329: Add candidate display rows.
- S2330: Add tester-facing status labels.
- S2331: Add tester-facing quality labels.
- S2332: First batch checkpoint: display rows remain runtime-only.

S2333-S2337 Presentation Check Batch
- S2333: Add candidate label check.
- S2334: Add quality label check.
- S2335: Add repair preview check.
- S2336: Add presentation boundary check.
- S2337: Second batch checkpoint: presentation readiness can flag missing display evidence.

S2338-S2342 Tester Boundary Batch
- S2338: Add review-only summary copy.
- S2339: Add runtime-only boundary copy.
- S2340: Add synthetic tester next-step copy.
- S2341: Preserve non-directive presentation wording.
- S2342: Third batch checkpoint: candidates are presentable for feature testing, not real-plan use.

S2343-S2347 Verification And Closeout Batch
- S2343: Run focused optimizer tests.
- S2344: Run example readiness tests.
- S2345: Run plan-file save-boundary tests.
- S2346: Run production build and file guards.
- S2347: Close package and recommend tester packet boundary review.

Verification
- `npm test -- app/src/engine/boundedOptimizer.test.ts` passed.
- `npm test -- app/src/data/planFile.test.ts` passed.
- `npm test -- app/src/engine/examplePlanOptimizerReadiness.test.ts -t "experimental annual instruction draft|scores experimental draft"` passed.
- `npm run build` passed.
- Build emitted the existing large-chunk warning only.
- `git diff --check` passed.
- `find . -name '*.plan.json' -o -name '.plan.json'` returned no files.

Boundary
- Presentation readiness is runtime-only and synthetic-tester-only.
- Display rows support feature testing and critique, not real retirement-plan use.
- No saved instruction output.
- No CSV instruction output.
- No report instruction output.
- No production UI promotion.
- No tax-bracket instructions.
- No saved plan schema changes.
- Runtime-only experimental draft presentation readiness is the scoped optimizer shape change for this package.
- No persisted or exported engine output changes.
- No `.plan.json` files.

Next Recommended Package
- S2348-S2367: Synthetic Tester Packet Boundary Review.
- Define the runtime-only tester packet boundary for candidate presentation so testers can review the output safely before saved sequencing output or CSV sequencing output is planned.
