# S3208-S3227 Runtime Annual Account Sequencing Repair Targeting

**Status:** Complete 2026-06-13.

## Goal

Turn runtime annual account sequence quality evidence into concrete repair target buckets. Results Details now shows source evidence, account-order evidence, tax context, constraint context, and output-boundary targets with row counts, priority labels, and next-step copy.

## Remaining Sprint Estimate

- Internal tester optimizer prototype: 0 sprints remaining.
- Feature-complete app optimizer beta: 0-50 sprints remaining.
- Public-ready optimizer for real planning use: 50-170 sprints remaining.

Material change: no. The estimates tightened by one package because sequence quality now produces visible repair target buckets for the next beta cleanup pass.

## Repair Target Buckets

- Source evidence.
- Account-order evidence.
- Tax context.
- Constraint context.
- Output boundary.

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

- **S3208-S3212 — Repair bucket batch.** Added source evidence, account-order evidence, tax context, constraint context, and output-boundary repair target buckets.
- **S3213-S3217 — Priority batch.** Added per-bucket row counts and priority labels so the next cleanup target is visible.
- **S3218-S3222 — Display batch.** Rendered repair targets beside the sequence quality summary in Results Details.
- **S3223-S3227 — Verification and closeout.** Ran UI structure checks, focused optimizer tests, plan-file tests, production build, file guards, and browser verification.

## Definition Of Done

- Runtime annual account sequence review rows roll up into visible repair target buckets.
- Repair targets show source evidence, account-order evidence, tax context, constraint context, and output boundary categories.
- Repair targets show row counts, priority labels, and next-step copy.
- Repair targets do not unlock saved sequencing, CSV output, report output, production UI, final instructions, tax-bracket wording, saved schema changes, or engine output schema changes.
- Saved sequencing, CSV output, report output, production UI, final instructions, tax-bracket instructions, and `.plan.json` generation remain blocked.
- Remaining sprint estimate is updated after the package.
- Focused optimizer tests, UI structure tests, plan-file tests, browser checks, and production build pass.

## Next Recommended Package

S3228-S3247: Runtime Annual Account Sequencing Repair Application Gate.

Purpose: decide which repair targets can be corrected using existing runtime evidence before any saved sequencing, CSV output, report output, tax-bracket wording, production UI, or final instruction path is opened.
