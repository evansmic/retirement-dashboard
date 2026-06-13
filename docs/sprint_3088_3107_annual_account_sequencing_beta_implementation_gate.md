# S3088-S3107 Annual Account Sequencing Beta Implementation Gate

**Status:** Complete 2026-06-13.

## Goal

Define the first feature-complete beta implementation gate after the controlled tester handoff. The tester-only Results Details surface now includes an annual account sequencing beta gate with implementation decision rows, source requirements, and output gates.

## Remaining Sprint Estimate

- Internal tester optimizer prototype: 0 sprints remaining.
- Feature-complete app optimizer beta: 30-110 sprints remaining.
- Public-ready optimizer for real planning use: 110-230 sprints remaining.

Material change: no. The estimates tightened by one package because the first beta implementation gate is now explicit.

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
- Downloadable tester packets.
- Feedback forms.
- Automatic triage.
- Beta unlock controls.
- Annual account sequencing implementation.

## Completed Path

- **S3088-S3092 — Beta decision batch.** Added the annual account sequencing implementation decision and primary beta objective.
- **S3093-S3097 — Source requirement batch.** Added source requirements for selected-candidate rows, annual account totals, account-order positions, tax context, readiness evidence, and estate/survivor hooks.
- **S3098-S3102 — Output gate batch.** Added gates for runtime sequencing first, then saved sequencing, CSV output, report output, production UI, final instructions, and tax-bracket instructions.
- **S3103-S3107 — Verification and closeout.** Ran UI structure checks, focused optimizer tests, plan-file tests, production build, file guards, and browser verification.

## Definition Of Done

- Results Details shows the annual account sequencing beta gate.
- The gate defines source requirements.
- The gate defines output gates.
- No annual account sequencing implementation is added.
- No in-app feedback form, automatic triage, issue creation, beta unlock, save, CSV, report, or production promotion path is added.
- No saved schema or engine output schema changes.
- Saved sequencing, CSV output, report output, production UI, final instructions, tax-bracket instructions, and `.plan.json` generation remain blocked.
- Remaining sprint estimate is updated after the package.
- Focused optimizer tests, UI structure tests, plan-file tests, browser checks, and production build pass.

## Next Recommended Package

S3108-S3127: Runtime Annual Account Sequencing Shape Contract.

Purpose: define the exact runtime-only row shape for annual account sequencing before implementation, including year, account, amount, source evidence, readiness cue, tax context, constraint context, and output boundary fields.
