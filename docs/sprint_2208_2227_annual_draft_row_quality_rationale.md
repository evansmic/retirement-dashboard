# S2208-S2227 Annual Draft Row Quality And Rationale

Package
- S2208-S2227: Annual draft row quality and rationale.
- This is one combined package document for the full twenty-sprint implementation block.

Goal
- Improve experimental annual draft row quality before saved sequencing output or CSV sequencing output.
- Make each runtime draft row easier to review by showing source-field evidence, year grouping, and account-order position.
- Keep copy calm, consumer-facing, modelled-source based, and non-directive.

Implemented
- Added source evidence to each experimental annual draft row.
- Added withdrawal source field and source field label.
- Added selected candidate label to row source evidence.
- Added account-order position when available.
- Added year-level grouping with row index, withdrawal count, and single-account or multi-account mode.
- Replaced generic row rationale with account-specific runtime draft rationale.
- Preserved runtime-only boundaries for saved output, CSV output, report output, production UI, and tax-bracket instructions.

S2208-S2212 Source Evidence Batch
- S2208: Add source evidence shape to annual draft rows.
- S2209: Track withdrawal source fields for registered, LIF, TFSA, non-registered, and cash rows.
- S2210: Add source field labels for consumer-facing review.
- S2211: Attach selected candidate label to row source evidence.
- S2212: First batch checkpoint: row source evidence is runtime-only.

S2213-S2217 Grouping Batch
- S2213: Add year-level account index.
- S2214: Add year withdrawal count.
- S2215: Add single-account and multi-account grouping mode.
- S2216: Add account-order position when account order is available.
- S2217: Second batch checkpoint: rows can be reviewed in annual context.

S2218-S2222 Rationale Batch
- S2218: Replace generic row rationale with account-specific rationale.
- S2219: Include modelled source-field evidence in rationale.
- S2220: Include grouping and account-order context in rationale.
- S2221: Include after-tax spending and tax context availability without tax-bracket instructions.
- S2222: Third batch checkpoint: rationale is calm, consumer-facing, and non-directive.

S2223-S2227 Verification And Closeout Batch
- S2223: Run focused optimizer tests.
- S2224: Run example readiness tests.
- S2225: Run plan-file save-boundary tests.
- S2226: Run production build and file guards.
- S2227: Close package and recommend annual account instruction readiness work.

Verification
- `npm test -- app/src/engine/boundedOptimizer.test.ts` passed.
- `npm test -- app/src/engine/examplePlanOptimizerReadiness.test.ts -t "experimental annual instruction draft|scores experimental draft"` passed.
- `npm test -- app/src/data/planFile.test.ts` passed.
- `npm run build` passed.
- Build emitted the existing large-chunk warning only.
- `git diff --check` passed.
- `find . -name '*.plan.json' -o -name '.plan.json'` returned no files.

Boundary
- Annual draft row quality remains runtime-only and synthetic-tester-only.
- No saved instruction output.
- No CSV instruction output.
- No report instruction output.
- No production UI promotion.
- No tax-bracket instructions.
- No saved plan schema changes.
- Runtime-only experimental draft row evidence is the scoped optimizer shape change for this package.
- No persisted or exported engine output changes.
- No `.plan.json` files.

Next Recommended Package
- S2228-S2247: Annual Account Instruction Readiness.
- Prepare the runtime shape for annual account instruction review, including account-order consistency, per-year account totals, and blocked-output guards before saved sequencing output or CSV sequencing output is planned.
