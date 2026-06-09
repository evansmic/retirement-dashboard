# S2368-S2387: Tester Packet Export Guard Review

## Status

Complete 2026-06-08.

## Goal

Add a runtime-only tester packet export guard before tester-facing UI, saved sequencing output, CSV sequencing output, report output, or production UI. The guard confirms that synthetic tester packet content stays out of saved plan files, CSV output, reports, production UI, final annual instructions, and tax-bracket instructions.

## Non-Scope

- Saved plan schema changes.
- Unplanned engine output changes outside the runtime-only tester packet export guard.
- Persisted optimizer output.
- Printable report output changes.
- CSV output changes.
- `.plan.json` files.
- Production UI promotion.
- Final advice-like copy.
- Tax-bracket instructions.
- Exportable sequencing output.

## S2368-S2372 — Export Guard Shape Batch

Added `testerPacketExportGuard` to the runtime-only experimental annual instruction draft. The guard includes rows for:

- Saved plan file.
- CSV output.
- Report output.
- Production UI.
- Final annual instructions.
- Tax-bracket instructions.

The guard status is `guarded` only when the required hidden outputs are also listed as blocked by the tester packet boundary.

## S2373-S2377 — Forbidden Saved-Key Batch

Added explicit forbidden saved keys for tester packet and annual-instruction review material:

- `testerPacketBoundary`
- `testerPacketExportGuard`
- `annualInstructionCandidates`
- `candidateSelectionSummary`
- `presentationReadiness`
- `experimentalAnnualInstructionDraft`
- `annualAccountInstructions`

This keeps the boundary visible to tests without changing the saved schema.

## S2378-S2382 — Saved Boundary Batch

Strengthened saved-plan coverage so nested tester packet fields are excluded even if runtime optimizer output is accidentally attached to a plan before saving.

The saved-plan tests now check that serialized saved files do not contain:

- `testerPacketBoundary`
- `testerPacketExportGuard`

## S2383-S2387 — Verification And Closeout

Verification completed for the focused optimizer path, plan-file save boundary, example readiness path, production build, whitespace checks, and `.plan.json` guard.

## Definition Of Done

- Tester packet export guard identifies blocked saved, CSV, report, production UI, final instruction, and tax-bracket outputs.
- Forbidden saved keys include tester packet boundary and tester packet export guard.
- Saved plan serialization excludes nested tester packet guard fields even if runtime output is accidentally attached before save.
- Tester packet copy remains for synthetic feature testing with made-up scenarios, not personal decisions.
- Saved output, CSV output, report output, and production UI remain deferred.
- Saved plan schema remains unchanged.
- Runtime-only tester packet export guard is the scoped optimizer shape change for this package.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests, plan-file tests, example readiness tests, and production build pass.

## Next Recommended Package

S2388-S2407: Synthetic Tester Packet Readiness Matrix.

Recommended goal: add a runtime-only readiness matrix that decides whether the current synthetic examples are ready for a limited tester packet review, still without production UI, saved sequencing output, CSV sequencing output, report output, final annual instructions, or tax-bracket instructions.
