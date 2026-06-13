# S3228-S3247 Runtime Annual Account Sequencing Repair Application Gate

**Status:** Complete 2026-06-13.

## Goal

Add a review-only application gate for runtime annual account sequence repair targets. Results Details now shows whether each repair bucket can be applied from current visible evidence, needs review before applying, or is waiting for rows.

## Remaining Sprint Estimate

- Internal tester optimizer prototype: 0 sprints remaining.
- Feature-complete app optimizer beta: 0-40 sprints remaining.
- Public-ready optimizer for real planning use: 40-160 sprints remaining.

Material change: no. The estimates tightened by one package because repair targets now have an application gate that separates current-evidence repairs from review-needed repairs.

## Application Gate Statuses

- Apply from current evidence.
- Review before applying.
- Waiting for rows.

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

- **S3228-S3232 — Application status batch.** Added apply-from-current-evidence, review-before-applying, and waiting-for-rows statuses.
- **S3233-S3237 — Evidence-use batch.** Added evidence-use copy for each repair bucket.
- **S3238-S3242 — Blocked-output batch.** Added blocked-output copy that keeps application inside the review surface.
- **S3243-S3247 — Verification and closeout.** Ran UI structure checks, focused optimizer tests, plan-file tests, production build, file guards, and browser verification.

## Definition Of Done

- Runtime annual account sequence repair targets roll up into a visible application gate.
- The gate shows apply-from-current-evidence, review-before-applying, or waiting-for-rows status.
- The gate explains evidence use and blocked outputs for each target.
- The gate does not unlock saved sequencing, CSV output, report output, production UI, final instructions, tax-bracket wording, saved schema changes, or engine output schema changes.
- Saved sequencing, CSV output, report output, production UI, final instructions, tax-bracket instructions, and `.plan.json` generation remain blocked.
- Remaining sprint estimate is updated after the package.
- Focused optimizer tests, UI structure tests, plan-file tests, browser checks, and production build pass.

## Next Recommended Package

S3248-S3267: Runtime Annual Account Sequencing Beta Output Readiness Gate.

Purpose: decide the minimum conditions required before saved sequencing output, CSV sequencing output, report rows, production UI, tax-bracket wording, or final annual instructions can begin implementation.
