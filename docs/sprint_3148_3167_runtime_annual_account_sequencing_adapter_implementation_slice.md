# S3148-S3167 Runtime Annual Account Sequencing Adapter Implementation Slice

**Status:** Complete 2026-06-13.

## Goal

Implement the first runtime annual account sequence adapter from existing experimental annual draft rows. The tester-only Results Details surface now renders sequence review rows with year, account label, review amount, source evidence, readiness cue, tax context, constraint context, and boundary status.

## Remaining Sprint Estimate

- Internal tester optimizer prototype: 0 sprints remaining.
- Feature-complete app optimizer beta: 0-80 sprints remaining.
- Public-ready optimizer for real planning use: 80-200 sprints remaining.

Material change: yes. The first runtime annual account sequencing adapter is now implemented in the tester-only surface, while saved and exported outputs remain blocked.

## Implementation Notes

- The adapter is UI-local and reads existing `experimentalAnnualInstructionDraft.rows`.
- It does not change engine output schema.
- It does not change saved schema.
- It does not create CSV columns, report rows, production UI, final instructions, or tax-bracket wording.
- Missing evidence is preserved as review wording rather than inferred.
- Boundary status stays visible beside each review row.

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
- Saved sequence adapters.
- Exported sequence adapters.
- Report sequence adapters.

## Completed Path

- **S3148-S3152 — Adapter helper batch.** Added a UI-local adapter that maps existing experimental annual draft rows into sequence review rows.
- **S3153-S3157 — Review row display batch.** Rendered year, account label, review amount, source evidence, readiness cue, tax context, constraint context, and boundary status.
- **S3158-S3162 — Output boundary batch.** Kept engine output schema, saved schema, CSV columns, report rows, production UI, final instructions, tax-bracket wording, and `.plan.json` generation blocked.
- **S3163-S3167 — Verification and closeout.** Ran UI structure checks, focused optimizer tests, plan-file tests, production build, file guards, and browser verification.

## Definition Of Done

- Results Details renders runtime annual account sequence review rows.
- Review rows are adapted from existing experimental annual draft rows.
- Review rows preserve source evidence, readiness cue, tax context, constraint context, and boundary status.
- No saved row shape, CSV columns, report rows, production UI, final instructions, tax-bracket wording, saved schema changes, or engine output schema changes are added.
- Saved sequencing, CSV output, report output, production UI, final instructions, tax-bracket instructions, and `.plan.json` generation remain blocked.
- Remaining sprint estimate is updated after the package.
- Focused optimizer tests, UI structure tests, plan-file tests, browser checks, and production build pass.

## Next Recommended Package

S3168-S3187: Runtime Annual Account Sequencing Quality Scoring.

Purpose: score the new sequence review rows for source completeness, account-order evidence, tax-context availability, constraint context, and output-boundary clarity before considering saved or exported sequencing outputs.
