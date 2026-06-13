# S3108-S3127 Runtime Annual Account Sequencing Shape Contract

**Status:** Complete 2026-06-13.

## Goal

Define the exact runtime-only row shape for annual account sequencing before implementation. The tester-only Results Details surface now includes a shape contract with fields, rules, and exclusions.

## Remaining Sprint Estimate

- Internal tester optimizer prototype: 0 sprints remaining.
- Feature-complete app optimizer beta: 20-100 sprints remaining.
- Public-ready optimizer for real planning use: 100-220 sprints remaining.

Material change: no. The estimates tightened by one package because the runtime annual account sequence row shape is now explicit.

## Shape Fields

- `year`: planning year for the runtime sequence row.
- `accountLabel`: account being reviewed without turning the row into an instruction.
- `reviewAmount`: annual amount under review for that account and year.
- `sourceEvidence`: runtime field evidence that produced the row.
- `readinessCue`: whether the row is ready for review or needs evidence repair.
- `taxContext`: compact tax context without tax-bracket instructions.
- `constraintContext`: estate, survivor, floor, or shortfall context when those constraints affect review.
- `boundaryStatus`: runtime-only, blocked-output, or future beta-review status.

## Non-Scope

- Saved plan schema changes.
- Engine output schema changes.
- Persisted optimizer output.
- Printable report output changes.
- CSV output changes.
- `.plan.json` files or `.plan.json` generation.
- Production UI promotion.
- Final annual instructions.
- Tax-bracket instructions.
- Exportable sequencing output.
- In-app feedback collection.
- Feedback scoring.
- Approval or unlock logic for generated rows.
- Issue creation or cleanup task automation.
- New account-order algorithms.
- Annual withdrawal calculation changes.
- Tax-bracket targets.
- Public release.
- Broad tester distribution.
- Real-data tester scenarios.
- Annual account sequencing implementation.

## Completed Path

- **S3108-S3112 — Shape field batch.** Defined runtime-only sequence fields for year, account label, review amount, source evidence, readiness cue, tax context, constraint context, and boundary status.
- **S3113-S3117 — Shape rule batch.** Added rules for account-year row scope, evidence traceability, explanatory tax context, non-advisory constraint context, and visible boundary status.
- **S3118-S3122 — Exclusion batch.** Excluded saved sequencing rows, CSV columns, report rows, production UI, final instruction wording, tax-bracket wording, schema changes, and `.plan.json` generation.
- **S3123-S3127 — Verification and closeout.** Ran UI structure checks, focused optimizer tests, plan-file tests, production build, file guards, and browser verification.

## Definition Of Done

- Results Details shows the runtime annual account sequence shape contract.
- The contract defines row fields, row rules, and exclusions.
- No annual account sequencing implementation is added.
- No saved row shape, CSV columns, report rows, production UI, final instructions, tax-bracket wording, saved schema changes, or engine output schema changes are added.
- Saved sequencing, CSV output, report output, production UI, final instructions, tax-bracket instructions, and `.plan.json` generation remain blocked.
- Remaining sprint estimate is updated after the package.
- Focused optimizer tests, UI structure tests, plan-file tests, browser checks, and production build pass.

## Next Recommended Package

S3128-S3147: Runtime Annual Account Sequencing Source Adapter Planning.

Purpose: map the row shape fields to the existing runtime draft data sources before adding implementation code, so the first adapter can stay runtime-only and schema-neutral.
