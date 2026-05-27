# Sprint 399 - Cash Wedge Language Guard

## Purpose

Prevent cash-wedge review copy from sounding like an instruction.

## Completed

- Preserved cash wedge as a buffer explanation.
- Guarded against copy that says cash should be refilled.
- Guarded against copy that describes automatic refill behaviour as if it is an implemented rule.
- Kept refill timing, refill amounts, and account-level withdrawal order out of the normal UI.

## Boundary

Cash-wedge language may describe the concept as review context. It must not tell users when to refill cash, how much cash to refill, or which account to use.
