# Sprint 308-321: Optimizer V1 Direction

## Summary

Sprint 308-321 implements the first Optiml-inspired optimizer direction as a local-first, Canadian, plan-to-review optimizer layer.

## Outcome

- Added runtime-only optimizer readiness rows for spending, CPP/OAS estimates, benefit age range, account buckets, estate target, home-sale assumptions, survivor setup, and Ontario 2026 tax scope.
- Added explicit v1 candidate-family boundaries:
  - CPP/OAS timing grid included when estimates and age ranges are ready.
  - Broad withdrawal families included when registered and flexible account buckets are meaningful.
  - Annual account-level overrides are deferred.
  - Monte Carlo validation is deferred until after deterministic guardrails are clean.
- Added a max sustainable after-tax spending objective contract with conservative deterministic funding guardrails.
- Added staged search-shape metadata for valid CPP/OAS ages and broad withdrawal families.
- Added bounded engine-supported CPP/OAS timing seed candidates for the current 65/70 simulation config.
- Added sustainable monthly spend evidence to the Details optimizer panel.
- Preserved the existing bounded optimizer runner path instead of creating a parallel optimizer system.

## Boundary

No saved optimizer output, saved plan schema change, engine output schema change, account-level withdrawal instructions, cloud accounts, advisor tooling, or broad UI redesign were added.

## Decision

The optimizer v1 direction is ready for the next narrow implementation batch: widening the benefit-timing runner beyond the current engine-supported 65/70 seed candidates while preserving runtime-only output and Details-first placement.
