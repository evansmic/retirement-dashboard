# S2228-S2247 Annual Account Instruction Readiness

Package
- S2228-S2247: Annual account instruction readiness.
- This is one combined package document for the full twenty-sprint implementation block.

Goal
- Prepare runtime annual account instruction readiness before saved sequencing output or CSV sequencing output.
- Add per-year account totals so experimental draft rows can be reviewed as annual account groups.
- Keep annual account instructions blocked as final saved/exported output until explicitly planned.

Implemented
- Added `annualAccountTotals` to the runtime-only experimental annual instruction draft.
- Added per-year total amount, account count, account rows, account-order positions, annual tax, after-tax spending, and OAS recovery context.
- Added `instructionReadiness` with annual totals, account-order consistency, tax-context, and output-boundary checks.
- Added blocked-output guards for annual account instructions, saved output, CSV output, report output, production UI, and tax-bracket instructions.
- Added focused optimizer and example-readiness coverage for annual totals and instruction readiness.

S2228-S2232 Annual Totals Batch
- S2228: Add runtime annual account total shape.
- S2229: Group draft rows by modelled year.
- S2230: Add per-year total amount and account count.
- S2231: Preserve account-order position evidence inside annual totals.
- S2232: First batch checkpoint: annual totals are review context only.

S2233-S2237 Consistency Batch
- S2233: Add instruction-readiness shape.
- S2234: Add annual total coverage row.
- S2235: Add account-order consistency row.
- S2236: Add annual tax-context row.
- S2237: Second batch checkpoint: readiness can identify watch/block conditions.

S2238-S2242 Guard Batch
- S2238: Add annual account instruction blocked-output guard.
- S2239: Preserve saved instruction output guard.
- S2240: Preserve CSV and report output guards.
- S2241: Preserve production UI and tax-bracket instruction guards.
- S2242: Third batch checkpoint: runtime readiness does not create final instructions.

S2243-S2247 Verification And Closeout Batch
- S2243: Run focused optimizer tests.
- S2244: Run example readiness tests.
- S2245: Run plan-file save-boundary tests.
- S2246: Run production build and file guards.
- S2247: Close package and recommend account-order consistency repair work.

Verification
- `npm test -- app/src/engine/boundedOptimizer.test.ts` passed.
- `npm test -- app/src/engine/examplePlanOptimizerReadiness.test.ts -t "experimental annual instruction draft|scores experimental draft"` passed.
- `npm test -- app/src/data/planFile.test.ts` passed.
- `npm run build` passed.
- Build emitted the existing large-chunk warning only.
- `git diff --check` passed.
- `find . -name '*.plan.json' -o -name '.plan.json'` returned no files.

Boundary
- Annual account instruction readiness is runtime-only and synthetic-tester-only.
- Annual account totals are review context, not final instructions.
- No saved instruction output.
- No CSV instruction output.
- No report instruction output.
- No production UI promotion.
- No tax-bracket instructions.
- No saved plan schema changes.
- Runtime-only experimental draft readiness is the scoped optimizer shape change for this package.
- No persisted or exported engine output changes.
- No `.plan.json` files.

Next Recommended Package
- S2248-S2267: Account Order Consistency Repair.
- Improve how annual totals represent account-order gaps and per-year ordering before saved sequencing output or CSV sequencing output is planned.
