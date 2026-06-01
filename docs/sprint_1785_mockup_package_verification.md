S1785 Mockup Package Verification

Scope
- Define final verification for the mockup package.

Expected
- Focused tests pass.
- Full tests pass.
- Build passes with existing large chunk warning if present.
- Parity probes pass.
- Probe suite passes except the known local route bind exception when present.
- No .plan.json files are created.

Boundary
- Mockups do not alter runtime behavior.
