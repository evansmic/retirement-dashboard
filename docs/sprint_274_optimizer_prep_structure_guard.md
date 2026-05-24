# Sprint 274: Optimizer Prep Structure Guard

## Summary

Sprint 274 adds structure coverage for optimizer-prep gating.

## Outcome

- Tests confirm compact plan options appear before the option research gate.
- Tests confirm full option panel, optimizer boundary, and optimizer input review are only inside the disabled research branch.
- Existing copy guards continue to block advice-like and saved-output wording.

## Boundary

The guard is source-structure coverage only. It does not change calculations or persistence.
