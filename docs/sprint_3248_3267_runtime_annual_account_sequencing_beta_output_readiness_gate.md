# S3248-S3267 Runtime Annual Account Sequencing Beta Output Readiness Gate

**Status:** Complete 2026-06-13.

## Goal

Add a review-only readiness gate for annual account sequencing beta outputs. Results Details now shows saved sequencing output, CSV sequencing output, report sequencing rows, production UI, final annual instructions, and tax-bracket wording as gated output paths with status, required evidence, and blocked-until copy.

## Remaining Sprint Estimate

- Internal tester optimizer prototype: 0 sprints remaining.
- Feature-complete app optimizer beta: 0-30 sprints remaining.
- Public-ready optimizer for real planning use: 30-150 sprints remaining.

Material change: no. The estimates tightened by one package because beta output paths now have explicit readiness gates before saved sequencing, CSV, report, production UI, final instructions, and tax-bracket wording.

## Output Paths

- Saved sequencing output.
- CSV sequencing output.
- Report sequencing rows.
- Production UI.
- Final annual instructions.
- Tax-bracket wording.

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

## Completed Path

- **S3248-S3252 — Output path batch.** Added saved sequencing, CSV sequencing, report sequencing, production UI, final instruction, and tax-bracket wording output paths.
- **S3253-S3257 — Readiness status batch.** Added ready-to-plan, needs-repair-first, and blocked statuses.
- **S3258-S3262 — Required evidence batch.** Added required evidence and blocked-until copy for each output path.
- **S3263-S3267 — Verification and closeout.** Ran UI structure checks, focused optimizer tests, plan-file tests, production build, file guards, and browser verification.

## Definition Of Done

- Results Details shows a beta output readiness gate for annual account sequencing.
- The gate includes saved sequencing output, CSV sequencing output, report sequencing rows, production UI, final annual instructions, and tax-bracket wording.
- Each output path shows status, required evidence, and blocked-until copy.
- The gate does not unlock saved sequencing, CSV output, report output, production UI, final instructions, tax-bracket wording, saved schema changes, or engine output schema changes.
- Saved sequencing, CSV output, report output, production UI, final instructions, tax-bracket instructions, and `.plan.json` generation remain blocked.
- Remaining sprint estimate is updated after the package.
- Focused optimizer tests, UI structure tests, plan-file tests, browser checks, and production build pass.

## Next Recommended Package

S3268-S3287: Saved Sequencing Output Shape Decision Gate.

Purpose: decide whether saved sequencing output can begin with an explicitly versioned, local-only, beta-only shape, or whether one more runtime repair pass is required first.
