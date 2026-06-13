# S3168-S3187 Runtime Annual Account Sequencing Quality Scoring

**Status:** Complete 2026-06-13.

## Goal

Add quality scoring to runtime annual account sequence review rows. Results Details now shows a beta-review quality label, 0-6 quality score, and source/account-order/tax/constraint/boundary reasons for each sequence review row.

## Remaining Sprint Estimate

- Internal tester optimizer prototype: 0 sprints remaining.
- Feature-complete app optimizer beta: 0-70 sprints remaining.
- Public-ready optimizer for real planning use: 70-190 sprints remaining.

Material change: no. The estimates tightened by one package because runtime annual account sequence review rows now include quality scoring.

## Scoring Inputs

- Source evidence.
- Annual account total availability.
- Account-order evidence.
- Tax context.
- Constraint context.
- Output-boundary clarity.

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

## Completed Path

- **S3168-S3172 — Quality helper batch.** Added row scoring for source evidence, annual totals, account-order evidence, tax context, constraint context, and output boundary clarity.
- **S3173-S3177 — Display batch.** Rendered quality labels, 0-6 scores, and row-level reasons beside sequence review rows.
- **S3178-S3182 — Output boundary batch.** Kept scoring explanatory only and blocked saved sequencing, CSV output, reports, production UI, final instructions, tax-bracket wording, and schemas.
- **S3183-S3187 — Verification and closeout.** Ran UI structure checks, focused optimizer tests, plan-file tests, production build, file guards, and browser verification.

## Definition Of Done

- Runtime annual account sequence review rows show quality labels.
- Runtime annual account sequence review rows show 0-6 scores.
- Runtime annual account sequence review rows show quality reasons.
- Scoring does not unlock saved sequencing, CSV output, report output, production UI, final instructions, tax-bracket wording, saved schema changes, or engine output schema changes.
- Saved sequencing, CSV output, report output, production UI, final instructions, tax-bracket instructions, and `.plan.json` generation remain blocked.
- Remaining sprint estimate is updated after the package.
- Focused optimizer tests, UI structure tests, plan-file tests, browser checks, and production build pass.

## Next Recommended Package

S3188-S3207: Runtime Annual Account Sequencing Quality Summary.

Purpose: roll row-level quality scoring into a compact summary that identifies ready/review/block counts and the next blocker to repair before saved or exported sequencing outputs.
