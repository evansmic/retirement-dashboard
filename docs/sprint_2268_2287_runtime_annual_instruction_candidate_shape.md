# S2268-S2287 Runtime Annual Instruction Candidate Shape

Package
- S2268-S2287: Runtime annual instruction candidate shape.
- This is one combined package document for the full twenty-sprint implementation block.

Goal
- Prepare runtime-only annual instruction candidates before saved sequencing output or CSV sequencing output.
- Package annual account totals into per-year review candidates.
- Keep candidates clearly blocked from saved, exported, report, production UI, and tax-bracket instruction output.

Implemented
- Added `annualInstructionCandidates` to the runtime-only experimental annual instruction draft.
- Built candidates from annual account totals.
- Added candidate status: ready for review, review first, or blocked.
- Added candidate account display order while preserving draft account-order position.
- Added review flags for account-order gaps, partial account-order evidence, and limited tax context.
- Added candidate summaries and runtime-only boundaries.
- Added focused optimizer and example-readiness coverage.

S2268-S2272 Candidate Shape Batch
- S2268: Add runtime annual instruction candidate type.
- S2269: Build candidates from annual account totals.
- S2270: Add candidate status.
- S2271: Add candidate total amount and account count.
- S2272: First batch checkpoint: candidates are review context only.

S2273-S2277 Candidate Account Batch
- S2273: Add candidate accounts.
- S2274: Add candidate display order.
- S2275: Preserve account-order position evidence.
- S2276: Keep candidate account rows aligned with annual totals.
- S2277: Second batch checkpoint: per-year candidates can be inspected without final instructions.

S2278-S2282 Review Flag Batch
- S2278: Add account-order gap review flag.
- S2279: Add partial account-order review flag.
- S2280: Add limited tax-context review flag.
- S2281: Add candidate summary copy.
- S2282: Third batch checkpoint: candidates explain why review is needed.

S2283-S2287 Verification And Closeout Batch
- S2283: Run focused optimizer tests.
- S2284: Run example readiness tests.
- S2285: Run plan-file save-boundary tests.
- S2286: Run production build and file guards.
- S2287: Close package and recommend candidate quality scoring.

Verification
- `npm test -- app/src/engine/boundedOptimizer.test.ts` passed.
- `npm test -- app/src/data/planFile.test.ts` passed.
- `npm test -- app/src/engine/examplePlanOptimizerReadiness.test.ts -t "experimental annual instruction draft|scores experimental draft"` passed.
- `npm run build` passed.
- Build emitted the existing large-chunk warning only.
- `git diff --check` passed.
- `find . -name '*.plan.json' -o -name '.plan.json'` returned no files.

Boundary
- Annual instruction candidates are runtime-only and synthetic-tester-only.
- Candidates are review context, not final instructions.
- No saved instruction output.
- No CSV instruction output.
- No report instruction output.
- No production UI promotion.
- No tax-bracket instructions.
- No saved plan schema changes.
- Runtime-only experimental draft candidate shape is the scoped optimizer shape change for this package.
- No persisted or exported engine output changes.
- No `.plan.json` files.

Next Recommended Package
- S2288-S2307: Runtime Annual Candidate Quality Scoring.
- Add candidate quality scores and repair targets so annual instruction candidates can be compared before saved sequencing output or CSV sequencing output is planned.
