# S3268-S3287 Saved Sequencing Output Shape Decision Gate

**Status:** Complete 2026-06-13.

## Goal

Define the field-level decision gate for a future beta saved sequencing output shape without changing saved schema. Results Details now shows which fields may be allowed in a future beta shape, which need review before shape work, and which stay excluded.

## Remaining Sprint Estimate

- Internal tester optimizer prototype: 0 sprints remaining.
- Feature-complete app optimizer beta: 0-20 sprints remaining.
- Public-ready optimizer for real planning use: 20-140 sprints remaining.

Material change: no. The estimates tightened by one package because the saved sequencing beta shape now has a field-level decision gate while the saved schema remains unchanged.

## Shape Decisions

- Allow in beta shape.
- Review before shape.
- Exclude from beta shape.

## Candidate Fields

- year.
- accountLabel.
- reviewAmount.
- sourceEvidence.
- taxContext.
- constraintContext.
- qualityStatus.

## Excluded Fields

- finalInstruction.
- taxBracketTarget.

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
- Approval or unlock logic for generated rows.
- New account-order algorithms.
- Annual withdrawal calculation changes.
- Tax-bracket targets.
- Public release.
- Broad tester distribution.
- Real-data tester scenarios.
- Saved sequence adapters.
- Exported sequence adapters.
- Report sequence adapters.
- Automatic cleanup tasks.
- Automatic issue creation.
- Model repair automation.
- Saved schema migration.
- Saved file writes.

## Completed Path

- **S3268-S3272 — Shape field batch.** Added candidate saved-shape fields for year, account label, review amount, source evidence, tax context, constraint context, and quality status.
- **S3273-S3277 — Exclusion batch.** Excluded final instruction and tax-bracket target fields from the beta saved shape.
- **S3278-S3282 — Boundary batch.** Added field source and boundary copy that keeps saved schema changes blocked.
- **S3283-S3287 — Verification and closeout.** Ran UI structure checks, focused optimizer tests, plan-file tests, production build, file guards, and browser verification.

## Definition Of Done

- Results Details shows a saved sequencing output shape decision gate.
- The gate identifies fields that may be allowed in a future beta shape.
- The gate identifies fields that need review before shape work.
- The gate excludes final instruction and tax-bracket target fields.
- The gate does not change saved schema, engine output schema, saved files, CSV output, report output, production UI, final instructions, tax-bracket wording, or `.plan.json` generation.
- Remaining sprint estimate is updated after the package.
- Focused optimizer tests, UI structure tests, plan-file tests, browser checks, and production build pass.

## Next Recommended Package

S3288-S3307: Beta Saved Sequencing Output Implementation Decision.

Purpose: decide whether to implement a beta saved sequencing output adapter now, or require one final runtime repair package before writing any local saved sequencing shape.
