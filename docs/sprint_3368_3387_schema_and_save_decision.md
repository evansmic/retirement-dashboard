# Sprint S3368-S3387: Schema And Save Decision

Status: Complete 2026-06-13.

## Goal

Make the optimizer beta sequencing save boundary explicit before continuing toward public-ready optimizer output. The decision is conservative: beta sequencing remains runtime-only, and `.plan.json` files stay limited to clean editable planning inputs.

## Completed

- Added `schemaSaveDecision` to bounded optimizer summaries.
- Set the explicit decision to `doNotSaveBetaSequencingYet`.
- Kept allowed saved optimizer sequencing keys empty.
- Listed runtime optimizer packets that must not be written into saved plan files.
- Surfaced the decision in Results Details beside the continuation contract.
- Extended plan-file tests so beta sequencing packets, continuation state, and schema/save decisions are stripped from `.plan.json` output.

## Runtime-Only Decision

The current beta saved sequencing adapter is ready for internal runtime review, but it is not a saved file shape. Runtime review rows, candidate evidence, final-style annual instructions, and tax-bracket wording are recomputed inside the app and are not persisted into local plan files.

Blocked outputs remain:

- Saved plan schema changes
- Engine output schema changes
- `.plan.json` sequencing output
- CSV sequencing output
- Report sequencing output
- Production UI
- Final annual instructions
- Tax-bracket wording

## Verification

- `npm run test:focused`
- `npm test -- app/src/data/planFile.test.ts`
- `npm run build`

The full `npm test` command is still deferred because the current machine has limited free disk space and the full suite previously hung after early passing suites.

## Next Package

CSV and report gate. Plan export/report sequencing rows only after the no-write saved-file boundary remains verified and public wording stays blocked.
