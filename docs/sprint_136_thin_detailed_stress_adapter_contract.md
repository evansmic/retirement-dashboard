# Sprint 136: Thin Detailed Stress Adapter Contract

## Summary

Added runtime-only contract metadata for a future detailed-stress adapter. The contract describes explicit plan and stress-setting inputs so a later adapter can avoid reading dashboard-global state.

## Boundaries

- No Monte Carlo execution moved.
- No historical replay execution moved.
- No stress calculation changed.
- No adapter output is saved.

## Result

The next detailed-stress step now has a narrow shape: accept explicit inputs, call an injected detailed-report runner later, and return existing detailed stress shapes unchanged.
