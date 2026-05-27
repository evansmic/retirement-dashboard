## Sprint 386

Sprint 386 adds a cash-wedge explanation boundary.

What changed:
- Added runtime-only cash-wedge boundary rows.
- Framed cash wedge as a buffer explanation.
- Guarded against refill rules and account-level withdrawal ordering.

Boundary:
- No cash-wedge refill instruction is created.
- No withdrawal order or annual sequencing behavior is added.
