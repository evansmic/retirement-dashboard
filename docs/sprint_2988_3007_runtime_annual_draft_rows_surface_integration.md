# S2988-S3007: Runtime Annual Draft Rows Surface Integration

**Status:** Complete 2026-06-13.

## Goal

Replace the hand-written static annual review rows with runtime-only annual draft row display for synthetic scenarios.

Results Details now renders up to six rows from `experimentalAnnualInstructionDraft.rows`, including year, account label, review amount, source field label, and compact tax context. The surface remains tester-only and read-only.

## Remaining Sprint Estimate

- Internal tester optimizer prototype: 0-40 sprints remaining.
- Feature-complete app optimizer beta: 80-160 sprints remaining.
- Public-ready optimizer for real planning use: 160-280 sprints remaining.

Material estimate change: no. The estimate tightened by one package because runtime draft rows now render in the tester-only surface.

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

### S2988-S2992: Runtime Row Source Batch

Replaced hand-written static rows with rows from the existing runtime-only experimental annual instruction draft.

### S2993-S2997: Row Display Batch

Rendered year, account label, amount, source field label, and compact tax context in the tester-only Details surface.

### S2998-S3002: Output Boundary Batch

Kept saved sequencing, CSV output, reports, production UI, final instructions, tax-bracket instructions, and schema changes blocked.

### S3003-S3007: Verification And Closeout

Ran UI structure checks, focused optimizer tests, plan-file tests, production build, file guards, and browser verification.

## Definition Of Done

- Runtime annual draft rows are visible in Results Details tester-only surface.
- Static hand-written example rows are no longer the primary row surface.
- Row display uses existing runtime-only draft rows and does not create new saved schema or engine output schema.
- Saved sequencing, CSV output, report output, production UI, final instructions, tax-bracket instructions, and `.plan.json` generation remain blocked.
- Remaining sprint estimate is updated after the package.
- Focused optimizer tests, UI structure tests, plan-file tests, browser checks, and production build pass.

## Next Recommended Package

S3008-S3027: Runtime Annual Draft Row Quality And Tester Readiness.

Goal: add runtime row quality/status cues directly beside the displayed draft rows, so the tester-only surface can distinguish ready, review-first, and blocked rows before any saved sequencing, CSV output, report output, production UI, final instructions, tax-bracket instructions, schema changes, or `.plan.json` generation.
