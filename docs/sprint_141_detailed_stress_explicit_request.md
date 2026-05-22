# Sprint 141: Detailed Stress Explicit Request

## Summary

Added a copied explicit plan/config request for future detailed-stress adapter work. The request is created only after adapter validation passes.

## Boundaries

- No dashboard-global state is read.
- The source plan is copied before use.
- No Monte Carlo or historical replay execution is added.
- Request output is runtime-only.

## Result

The future bridge now has a safe request shape that can be handed to an injected runner later.
