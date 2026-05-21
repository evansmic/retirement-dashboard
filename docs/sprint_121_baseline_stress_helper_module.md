# Sprint 121: Baseline Stress Helper Module

Completed 2026-05-21.

## Summary

Moved the review-facing baseline stress indicator, stress row, and stress summary logic into an engine-owned `stressSelectors` module.

## Boundaries

- No simulation math changed.
- No Monte Carlo or historical sequence stress moved.
- No saved plan schema changed.

## Verification Focus

- Baseline stress rows still derive from `SimulationResult.years`.
- Existing result selector tests continue to pass.
- React callers can keep using the current selector names.
