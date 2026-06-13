# S3348-S3367 Optimizer Contract Consolidation

**Status:** Complete 2026-06-13.

## Goal

Create one compact continuation contract for the optimizer so future work does not depend on reading hundreds of checkpoint notes. The contract records what is beta-ready, what is still blocked for public use, which packages should come next, and how to verify work on the current low-storage development machine.

## What Changed

- Added an engine-owned `continuationContract` to bounded optimizer summaries.
- Marked feature-complete beta surfaces: bounded candidate search, runtime annual draft rows, beta saved sequencing adapter, and tester-only Details surface.
- Kept public outputs explicitly blocked: saved schema changes, public engine output schema changes, `.plan.json` sequencing output, CSV output, reports, production UI, final annual instructions, tax-bracket wording, and real-data tester distribution.
- Added a compact continuation panel to Results Details.
- Added `npm run test:focused` for the known full-suite hang / low-storage workflow.

## Process Note

The current Mac reports about 14 GiB free on a 228 GiB data volume, roughly 93% full. The repo itself is small, but system-level storage pressure can make test and build processes slower or less reliable. The full `npm test` run has also hung after early passing suites. Until that is isolated, use focused optimizer/UI tests plus production build as the sprint verification baseline.

## Boundaries

This package does **not**:

- Expand optimizer behavior.
- Change saved plan schema.
- Change public engine output schema.
- Generate `.plan.json` sequencing output.
- Add CSV or report output.
- Promote production UI.
- Create final annual instructions.
- Add tax-bracket wording.

## Next Recommended Package

Schema and save decision.

Purpose: decide whether beta sequencing should remain runtime-only, be stored in a saved beta packet, be exposed through engine output, or wait until public-ready validation is stronger.
