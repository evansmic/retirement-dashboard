# S3288-S3307 Beta Saved Sequencing Output Implementation Decision

**Status:** Complete 2026-06-13.

## Goal

Decide whether beta saved sequencing output implementation can start from the saved-shape decision gate. Results Details now shows a saved implementation decision gate with implementation decision, allowed beta fields, fields needing repair, and excluded fields.

## Remaining Sprint Estimate

- Internal tester optimizer prototype: 0 sprints remaining.
- Feature-complete app optimizer beta: 0-10 sprints remaining.
- Public-ready optimizer for real planning use: 10-130 sprints remaining.

Material change: no. The estimates tightened by one package because the beta saved sequencing adapter now has an implementation decision gate, while saved writes and schema changes remain blocked.

## Decision Rows

- Implementation decision.
- Allowed beta fields.
- Fields needing repair.
- Excluded fields.

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

- **S3288-S3292 — Decision status batch.** Added ready-to-implement, hold-for-repair, and blocked statuses for saved sequencing implementation.
- **S3293-S3297 — Field count batch.** Added allowed beta field, review-before-shape field, and excluded field counts.
- **S3298-S3302 — Boundary batch.** Added boundary copy that keeps saved writes, migrations, CSV, reports, production UI, final instructions, and tax-bracket wording blocked.
- **S3303-S3307 — Verification and closeout.** Ran UI structure checks, focused optimizer tests, plan-file tests, production build, file guards, and browser verification.

## Definition Of Done

- Results Details shows a beta saved sequencing implementation decision gate.
- The gate identifies whether implementation is ready, held for repair, or blocked.
- The gate shows allowed beta fields, fields needing repair, and excluded fields.
- The gate does not change saved schema, engine output schema, saved files, CSV output, report output, production UI, final instructions, tax-bracket wording, or `.plan.json` generation.
- Remaining sprint estimate is updated after the package.
- Focused optimizer tests, UI structure tests, plan-file tests, browser checks, and production build pass.

## Next Recommended Package

S3308-S3327: Beta Saved Sequencing Adapter Implementation Or Repair.

Purpose: either implement the first beta saved sequencing adapter if the decision gate is ready, or repair the remaining review-before-shape fields before writing any local saved sequencing output.
