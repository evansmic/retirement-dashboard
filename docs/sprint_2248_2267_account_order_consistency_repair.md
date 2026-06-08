# S2248-S2267 Account Order Consistency Repair

Package
- S2248-S2267: Account order consistency repair.
- This is one combined package document for the full twenty-sprint implementation block.

Goal
- Repair runtime account-order consistency evidence before saved sequencing output or CSV sequencing output.
- Make annual totals show when active annual accounts skip inactive positions in the draft account order.
- Keep account-order gaps as review-first evidence, not final account instructions.

Implemented
- Added account-order evidence to each runtime annual account total.
- Added active account-order positions.
- Added skipped inactive account-order positions.
- Added annual account-order status: contiguous, gapped, or partial.
- Added account-order gap detail text for annual totals.
- Added `accountOrderGaps` to instruction readiness.
- Gapped or partial order evidence now creates review-first readiness rather than silently passing.

S2248-S2252 Order Evidence Batch
- S2248: Add annual account-order evidence shape.
- S2249: Track active draft-order positions for annual totals.
- S2250: Track skipped inactive draft-order positions.
- S2251: Preserve partial-order evidence when an annual account lacks order position.
- S2252: First batch checkpoint: annual totals expose order evidence without final instructions.

S2253-S2257 Gap Detection Batch
- S2253: Add contiguous annual account-order status.
- S2254: Add gapped annual account-order status.
- S2255: Add partial annual account-order status.
- S2256: Add annual account-order detail copy.
- S2257: Second batch checkpoint: annual totals explain order gaps clearly.

S2258-S2262 Readiness Repair Batch
- S2258: Add account-order gap readiness row.
- S2259: Mark gapped annual totals as review-first evidence.
- S2260: Mark partial annual totals as review-first evidence.
- S2261: Preserve blocked-output guards for final instructions.
- S2262: Third batch checkpoint: account-order repair remains runtime-only.

S2263-S2267 Verification And Closeout Batch
- S2263: Run focused optimizer tests.
- S2264: Run example readiness tests.
- S2265: Run plan-file save-boundary tests.
- S2266: Run production build and file guards.
- S2267: Close package and recommend runtime instruction candidate shaping.

Verification
- `npm test -- app/src/engine/boundedOptimizer.test.ts` passed.
- `npm test -- app/src/data/planFile.test.ts` passed.
- `npm test -- app/src/engine/examplePlanOptimizerReadiness.test.ts -t "experimental annual instruction draft|scores experimental draft"` passed.
- `npm run build` passed.
- Build emitted the existing large-chunk warning only.
- `git diff --check` passed.
- `find . -name '*.plan.json' -o -name '.plan.json'` returned no files.

Boundary
- Account-order consistency repair is runtime-only and synthetic-tester-only.
- Annual account totals remain review context, not final instructions.
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
- S2268-S2287: Runtime Annual Instruction Candidate Shape.
- Prepare a runtime-only candidate shape for annual account instruction review, using annual totals and order-gap evidence before saved sequencing output or CSV sequencing output is planned.
