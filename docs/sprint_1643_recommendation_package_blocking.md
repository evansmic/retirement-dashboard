S1643 Recommendation Package Blocking

Purpose
- Pin package blocking behaviour so future execution cannot proceed from incomplete readiness.

Rules
- A blocked execution closeout blocks the package.
- A blocked prerequisite review blocks the package.
- A blocked example matrix blocks the package.
- Blocked package closeout sends the path back to capacity inputs first.

Boundary
- Blocking is diagnostic only.
- It does not create saved output, recommendation ids, funding traces, account instructions, annual sequencing, or UI presentation.
