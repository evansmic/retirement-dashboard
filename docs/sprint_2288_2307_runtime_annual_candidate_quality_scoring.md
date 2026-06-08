# S2288-S2307 Runtime Annual Candidate Quality Scoring

Package
- S2288-S2307: Runtime annual candidate quality scoring.
- This is one combined package document for the full twenty-sprint implementation block.

Goal
- Add runtime-only quality scoring to annual instruction candidates.
- Add repair targets so candidate weaknesses can be compared and improved.
- Keep scoring as review and repair context, not saved sequencing output or CSV sequencing output.

Implemented
- Added candidate quality level and score.
- Added quality rows for annual total, account order, tax context, and output boundary.
- Added repair targets for missing annual totals, account-order gaps, partial account order, and limited tax context.
- Added focused optimizer test coverage for a medium-quality account-order-gap candidate.
- Added example readiness coverage for candidate quality levels, output-boundary rows, and repair targets.

S2288-S2292 Quality Score Batch
- S2288: Add candidate quality shape.
- S2289: Score annual total availability.
- S2290: Score account-order evidence.
- S2291: Score tax-context evidence.
- S2292: First batch checkpoint: quality scoring stays runtime-only.

S2293-S2297 Repair Target Batch
- S2293: Add missing annual total repair target.
- S2294: Add account-order gap repair target.
- S2295: Add partial account-order repair target.
- S2296: Add limited tax-context repair target.
- S2297: Second batch checkpoint: repair targets explain candidate weaknesses.

S2298-S2302 Example Coverage Batch
- S2298: Add focused optimizer assertions.
- S2299: Add example readiness assertions.
- S2300: Preserve output-boundary quality row.
- S2301: Preserve non-directive copy guard coverage.
- S2302: Third batch checkpoint: quality scoring is covered across synthetic examples.

S2303-S2307 Verification And Closeout Batch
- S2303: Run focused optimizer tests.
- S2304: Run example readiness tests.
- S2305: Run plan-file save-boundary tests.
- S2306: Run production build and file guards.
- S2307: Close package and recommend annual candidate selection summary.

Verification
- `npm test -- app/src/engine/boundedOptimizer.test.ts` passed.
- `npm test -- app/src/data/planFile.test.ts` passed.
- `npm test -- app/src/engine/examplePlanOptimizerReadiness.test.ts -t "experimental annual instruction draft|scores experimental draft"` passed.
- `npm run build` passed.
- Build emitted the existing large-chunk warning only.
- `git diff --check` passed.
- `find . -name '*.plan.json' -o -name '.plan.json'` returned no files.

Boundary
- Candidate quality scoring is runtime-only and synthetic-tester-only.
- Scores are repair/comparison context, not final instructions.
- No saved instruction output.
- No CSV instruction output.
- No report instruction output.
- No production UI promotion.
- No tax-bracket instructions.
- No saved plan schema changes.
- Runtime-only experimental draft candidate quality is the scoped optimizer shape change for this package.
- No persisted or exported engine output changes.
- No `.plan.json` files.

Next Recommended Package
- S2308-S2327: Annual Candidate Selection Summary.
- Add a runtime summary that identifies the strongest annual instruction candidates, common repair themes, and readiness for synthetic tester review before saved sequencing output or CSV sequencing output is planned.
