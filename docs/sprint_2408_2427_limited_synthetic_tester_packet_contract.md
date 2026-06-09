# S2408-S2427: Limited Synthetic Tester Packet Contract

## Status

Complete 2026-06-08.

## Goal

Define the exact runtime contract a future limited synthetic tester packet may consume before any tester-facing implementation. The contract lists allowed fields, excluded fields, calm tester prompts, contract rows, and runtime-only boundaries.

## Non-Scope

- Saved plan schema changes.
- Unplanned engine output changes outside the runtime-only limited synthetic tester packet contract.
- Persisted optimizer output.
- Printable report output changes.
- CSV output changes.
- `.plan.json` files.
- Production UI promotion.
- Final advice-like copy.
- Tax-bracket instructions.
- Exportable sequencing output.
- Tester-facing UI implementation.

## S2408-S2412 — Contract Field Batch

Added a `packetContract` to the synthetic tester packet readiness matrix. The contract allows a future tester packet to consume only runtime review fields:

- Example id.
- Example label.
- Candidate display rows.
- Quality labels.
- Repair themes.
- Runtime boundary.
- Review prompts.
- Readiness status.

## S2413-S2417 — Exclusion Batch

The contract excludes:

- Saved sequencing output.
- CSV sequencing output.
- Report output.
- Production UI.
- Tax-bracket instructions.
- Final annual instructions.
- Personal data.
- Saved plan schema fields.

This keeps the future tester packet contract separate from persisted, exported, or production-facing output.

## S2418-S2422 — Review Prompt Batch

Added calm tester prompts for:

- Clarity.
- Plausibility.
- Missing context.
- Boundary understanding.

The prompts ask testers whether the runtime material makes sense in made-up scenarios without telling a person what to do.

## S2423-S2427 — Verification And Closeout

Verification completed for the focused optimizer path, plan-file save boundary, example readiness path, production build, whitespace checks, and `.plan.json` guard.

## Definition Of Done

- Contract lists allowed runtime fields for a future limited tester packet.
- Contract lists excluded fields and outputs.
- Review prompts stay scoped to made-up scenarios and feature testing.
- Contract rows cover allowed fields, excluded fields, copy boundary, and implementation boundary.
- Saved output, CSV output, report output, and production UI remain deferred.
- Saved plan schema remains unchanged.
- Runtime-only limited tester packet contract is the scoped optimizer shape change for this package.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests, plan-file tests, example readiness tests, and production build pass.

## Next Recommended Package

S2428-S2447: Limited Tester Packet Payload Dry Run.

Recommended goal: build a runtime-only dry-run payload from the contract for synthetic examples, with payload rows and review metadata only. Keep production UI, saved sequencing output, CSV output, reports, final annual instructions, tax-bracket instructions, and saved schema changes out of scope.
