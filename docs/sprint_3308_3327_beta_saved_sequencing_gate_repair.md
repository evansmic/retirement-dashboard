# S3308-S3327 Beta Saved Sequencing Gate Repair

**Status:** Complete 2026-06-13.

## Goal

Repair the saved sequencing implementation gate so preserved constraint context travels with beta review rows instead of automatically blocking saved-shape planning. Constraint context is now treated as preserved review evidence when present, while missing constraint context still remains a repair target.

## Remaining Sprint Estimate

- Internal tester optimizer prototype: 0 sprints remaining.
- Feature-complete app optimizer beta: 0-10 sprints remaining.
- Public-ready optimizer for real planning use: 10-120 sprints remaining.

Material change: no. Feature-complete beta remains one implementation package away; public-ready range tightened by one package because the saved implementation gate now treats preserved constraint context as usable beta review evidence.

## Repair Decision

- Present constraint context: preserve as beta review evidence.
- Missing constraint context: keep as a repair target.
- Saved sequencing adapter: viable for the next implementation package when all other row evidence is ready.

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

- **S3308-S3312 — Constraint evidence batch.** Changed present constraint context from blocking evidence to preserved beta review evidence.
- **S3313-S3317 — Repair-target batch.** Kept missing constraint context as a repair target.
- **S3318-S3322 — Saved gate batch.** Allowed preserved constraint context to support beta saved-shape planning without creating saved output.
- **S3323-S3327 — Verification and closeout.** Ran UI structure checks, focused optimizer tests, plan-file tests, production build, file guards, and browser verification.

## Definition Of Done

- Present constraint context is preserved as review evidence.
- Missing constraint context remains a repair target.
- The saved sequencing implementation gate can become ready to implement when other row evidence is ready.
- The package does not change saved schema, engine output schema, saved files, CSV output, report output, production UI, final instructions, tax-bracket wording, or `.plan.json` generation.
- Remaining sprint estimate is updated after the package.
- Focused optimizer tests, UI structure tests, plan-file tests, browser checks, and production build pass.

## Next Recommended Package

S3328-S3347: Beta Saved Sequencing Adapter Implementation.

Purpose: implement the first beta saved sequencing adapter using the allowed beta fields, still keeping CSV output, reports, production UI, final instructions, tax-bracket wording, and public release blocked until their own verification packages pass.
