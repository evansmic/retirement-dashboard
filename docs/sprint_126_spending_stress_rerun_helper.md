# Sprint 126: Spending Stress Rerun Helper

Completed 2026-05-21.

## Summary

Moved nearby spending-stress working-copy rerun orchestration into the engine-owned stress helper module.

## Boundaries

- No simulation math changed.
- Higher-spending stress still runs only when the current plan has no visible shortfall.
- The editable plan is not mutated.

## Verification Focus

- Reruns use 5% lower, 10% lower, and optional 5% higher early spending.
- Working copies preserve the source plan.
- Preview bundle output remains stable.
