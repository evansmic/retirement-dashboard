# S2348-S2367 Synthetic Tester Packet Boundary Review

Package
- S2348-S2367: Synthetic tester packet boundary review.
- This is one combined package document for the full twenty-sprint implementation block.

Goal
- Define the runtime-only packet boundary for synthetic tester review.
- Identify what annual candidate material can be visible to testers.
- Keep final instructions, saved output, CSV output, reports, production UI, and tax-bracket instructions hidden.

Implemented
- Added `testerPacketBoundary` to the runtime-only experimental annual instruction draft.
- Added visible sections: candidate display rows, quality labels, repair themes, and runtime boundary.
- Added hidden sections: final annual instructions, saved sequencing output, CSV sequencing output, report output, production UI, and tax-bracket instructions.
- Added tester purpose and boundary copy that says the packet is for made-up scenario feature testing and not personal decisions.
- Added blocked outputs for final annual instructions and all persisted/exported/final channels.
- Added focused optimizer and example-readiness coverage.

S2348-S2352 Packet Boundary Shape Batch
- S2348: Add synthetic tester packet boundary type.
- S2349: Add visible section list.
- S2350: Add hidden section list.
- S2351: Add packet boundary rows.
- S2352: First batch checkpoint: packet boundary remains runtime-only.

S2353-S2357 Visibility Batch
- S2353: Mark candidate display rows visible.
- S2354: Mark quality labels visible.
- S2355: Mark repair themes visible.
- S2356: Mark runtime boundary visible.
- S2357: Second batch checkpoint: visible material is limited to review context.

S2358-S2362 Hidden-Output Batch
- S2358: Hide final annual instructions.
- S2359: Hide saved sequencing output.
- S2360: Hide CSV sequencing output.
- S2361: Hide report output and production UI.
- S2362: Hide tax-bracket instructions.

S2363-S2367 Verification And Closeout Batch
- S2363: Run focused optimizer tests.
- S2364: Run example readiness tests.
- S2365: Run plan-file save-boundary tests.
- S2366: Run production build and file guards.
- S2367: Close package and recommend tester packet export guard review.

Verification
- `npm test -- app/src/engine/boundedOptimizer.test.ts` passed.
- `npm test -- app/src/data/planFile.test.ts` passed.
- `npm test -- app/src/engine/examplePlanOptimizerReadiness.test.ts -t "experimental annual instruction draft|scores experimental draft"` passed.
- `npm run build` passed.
- Build emitted the existing large-chunk warning only.
- `git diff --check` passed.
- `find . -name '*.plan.json' -o -name '.plan.json'` returned no files.

Boundary
- Tester packet boundary is runtime-only and synthetic-tester-only.
- Tester packet material supports feature testing with made-up scenarios, not personal decisions.
- No final annual instruction output.
- No saved instruction output.
- No CSV instruction output.
- No report instruction output.
- No production UI promotion.
- No tax-bracket instructions.
- No saved plan schema changes.
- Runtime-only tester packet boundary is the scoped optimizer shape change for this package.
- No persisted or exported engine output changes.
- No `.plan.json` files.

Next Recommended Package
- S2368-S2387: Tester Packet Export Guard Review.
- Add runtime guard checks proving tester packet material cannot leak into saved files, CSV output, reports, or production UI before any tester-facing implementation is planned.
