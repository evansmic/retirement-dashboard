# S3008-S3027: Runtime Annual Draft Row Quality And Tester Readiness

**Status:** Complete 2026-06-13.

## Goal

Add row-level quality and readiness cues directly beside displayed runtime annual draft rows.

Results Details now labels each runtime draft row as ready for review, ready with context, review first, or needs tax review based on existing account-order and tax-context evidence. This helps reviewers understand which rows are straightforward and which need closer review before any tester handoff decision.

## Remaining Sprint Estimate

- Internal tester optimizer prototype: 0-30 sprints remaining.
- Feature-complete app optimizer beta: 70-150 sprints remaining.
- Public-ready optimizer for real planning use: 150-270 sprints remaining.

Material estimate change: no. The estimate tightened by one package because displayed runtime draft rows now include row-level readiness cues.

## Non-Scope

- Saved plan schema changes.
- Engine output schema changes.
- Persisted optimizer output.
- Printable report output changes.
- CSV output changes.
- `.plan.json` files.
- Production UI promotion.
- Final advice-like copy.
- Tax-bracket instructions.
- Exportable sequencing output.
- Final annual instructions.
- In-app feedback collection or scoring.
- Approval or unlock logic for generated rows.
- Issue creation, cleanup task creation, or model repair automation.
- New account-order algorithms.
- Annual withdrawal calculation changes.
- Tax-bracket targets.
- Saved draft row output.
- CSV draft row output.
- Report draft row output.
- Public release.

## Completed Path

### S3008-S3012: Row Cue Batch

Added row-level readiness labels derived from account-order and tax-context evidence.

### S3013-S3017: Display Batch

Rendered readiness labels beside runtime annual draft rows in Results Details.

### S3018-S3022: Boundary Batch

Kept saved sequencing, CSV output, reports, production UI, final instructions, tax-bracket instructions, and schema changes blocked.

### S3023-S3027: Verification And Closeout

Ran UI structure checks, focused optimizer tests, plan-file tests, production build, file guards, and browser verification.

## Definition Of Done

- Runtime annual draft rows include row-level readiness cues.
- Cues are derived from existing runtime row evidence only.
- No saved schema or engine output schema changes.
- Saved sequencing, CSV output, report output, production UI, final instructions, tax-bracket instructions, and `.plan.json` generation remain blocked.
- Remaining sprint estimate is updated after the package.
- Focused optimizer tests, UI structure tests, plan-file tests, browser checks, and production build pass.

## Next Recommended Package

S3028-S3047: Runtime Draft Tester Handoff Decision Gate.

Goal: decide whether the current tester-only runtime annual draft row surface is ready for a small controlled tester handoff, using row visibility, readiness cues, boundary copy, disabled actions, and synthetic scenario coverage while still blocking saved sequencing, CSV output, report output, production UI, final instructions, tax-bracket instructions, schema changes, and `.plan.json` generation.
