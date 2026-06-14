# Sprint S3728-S3747: Public Optimizer Output Contract

Status: Complete 2026-06-14.

## Goal

Decide what public optimizer language and output shapes are allowed before real household pilot review, while keeping public release closed.

## Completed

- Added `OptimizerPublicOutputContractDecision`.
- Added `selectOptimizerPublicOutputContractDecision`.
- Added `publicOptimizerOutputContract` to the bounded optimizer summary.
- Kept `publicOptimizerOutputContract` forbidden from saved plan files.
- Rendered the public optimizer contract in Results Details.
- Updated release narrowing so private pilot requirements and full-suite recovery are ready, with the public output decision as the active gate.

## Allowed Runtime Contract

The planner may show review-direction runtime evidence for private pilot review:

- Retirement answer rows.
- Optimizer option groups.
- Candidate comparison deltas.
- Assumption-lab comparison slots.
- Review-only evidence rows.

Allowed copy may say first option to review, review direction, or trade-off to compare. It may explain retirement timing, spending capacity, benefit timing, tax pressure, risk-review evidence, and comparison deltas including monthly or annual after-tax capacity.

## Blocked Outputs

The contract keeps these closed:

- Saved optimizer output.
- CSV sequencing output.
- Report sequencing output.
- Production UI promotion.
- Final annual instructions.
- Tax-bracket wording.
- Account-level withdrawal instructions.
- Saved schema changes.
- Engine output schema changes.
- `.plan.json` sequencing output.

Blocked copy includes final plan, guaranteed, optimal drawdown, do this, tax-bracket target, withdrawal instruction, and apply optimized plan.

## Boundary

This package defines a runtime output contract only. It does not open public optimizer release, production UI promotion, saved optimizer output, CSV sequencing, report sequencing, final annual instructions, tax-bracket wording, account-level withdrawal instructions, saved schema changes, engine output schema changes, or `.plan.json` sequencing output.

## Estimate Update

- Retirement answer layer: 0-10 sprints remaining, unchanged.
- Live assumption lab: 0 sprints remaining, unchanged.
- Public-ready optimizer: 0-2 sprints remaining, tightened from 0-3 because copy and output-contract decisions are now explicit.
- Graphical UI redesign: 20-60 sprints remaining, unchanged and still deferred.
- Launch hardening: 5-15 sprints remaining, unchanged.

## Verification

- `npm run test:focused`
- `npm run build`

## Next Package

Define the private pilot copy review and release/no-release decision path: what opt-in household evidence is enough, what confusion stops release, and whether the public optimizer remains closed or can move to a limited public beta surface.
