# S2188-S2207 Clean Example Draft Repair

Package
- S2188-S2207: Clean example draft repair.
- This is one combined package document for the full twenty-sprint implementation block.

Goal
- Improve clean-example annual draft readiness.
- Keep clean reset files clean while giving synthetic runtime examples enough planning evidence for optimizer testing.
- Repair missing annual rows, blocked account-order source evidence, and low draft confidence caused by sparse clean-example runtime data.

Implemented
- Added runtime-only planning seeds for clean synthetic examples.
- Preserved clean example plan files and clean reset payloads.
- Added account balances, CPP/OAS estimates, mortgage balance, survivor-sensitive pension evidence, and estate target evidence where scenario-appropriate.
- Added clean-example tests proving clean files stay clean while runtime plans include planning evidence.
- Added matrix readiness assertions proving each clean example produces at least three experimental annual draft rows and non-blocked draft confidence.

S2188-S2192 Clean Runtime Seed Batch
- S2188: Identify sparse clean runtime examples as the repair target.
- S2189: Add synthetic runtime planning seeds after clean reset adaptation.
- S2190: Preserve clean file payloads and approved clean reset values.
- S2191: Add account and benefit evidence for the single covered-floor example.
- S2192: First batch checkpoint: clean file output remains unchanged.

S2193-S2197 Scenario Constraint Batch
- S2193: Add mortgage and account evidence for the tight-floor couple.
- S2194: Add survivor-sensitive DB pension evidence for the pension couple.
- S2195: Add estate target and taxable-account evidence for the estate-focused household.
- S2196: Preserve household shape for clean single and couple examples.
- S2197: Second batch checkpoint: clean runtime examples carry scenario-relevant planning evidence.

S2198-S2202 Matrix Readiness Batch
- S2198: Add clean-example runtime seed tests.
- S2199: Add clean-example annual draft row coverage assertions.
- S2200: Add clean-example non-blocked confidence assertions.
- S2201: Preserve runtime-only boundary and no tax-bracket instruction copy guards.
- S2202: Third batch checkpoint: clean examples are ready for matrix-based draft repair work.

S2203-S2207 Verification And Closeout Batch
- S2203: Run clean example tests.
- S2204: Run focused optimizer tests.
- S2205: Run plan-file save-boundary tests.
- S2206: Run production build and file guards.
- S2207: Close package and recommend annual draft row quality work.

Verification
- `npm test -- app/src/data/examplePlans.test.ts` passed.
- `npm test -- app/src/engine/examplePlanOptimizerReadiness.test.ts -t "scores experimental draft"` passed.
- `npm test -- app/src/data/planFile.test.ts` passed.
- `npm test -- app/src/engine/boundedOptimizer.test.ts` passed.
- `npm run build` passed.
- Build emitted the existing large-chunk warning only.
- `git diff --check` passed.
- `find . -name '*.plan.json' -o -name '.plan.json'` returned no files.

Boundary
- Clean example planning seeds are runtime-only synthetic testing evidence.
- Clean reset files and approved clean reset payload values remain unchanged.
- No saved instruction output.
- No CSV instruction output.
- No report instruction output.
- No production UI promotion.
- No tax-bracket instructions.
- No saved plan schema changes.
- No engine output schema changes.
- No `.plan.json` files.

Next Recommended Package
- S2208-S2227: Annual Draft Row Quality And Rationale.
- Improve annual instruction draft row grouping, source explanations, and account-level rationale before saved sequencing output or CSV sequencing output is planned.
