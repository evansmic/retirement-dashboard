# Future Funding Trace Deepening

Status: planning-only.

This note extends the future funding trace readiness work without changing saved plan schema, engine output schema, current examples, or UI.

The funding trace should eventually help answer: after the monthly capacity answer is calculated, where does the first-year money appear to come from, and what should the household review before relying on it?

## Added Readiness Areas

- Survivor and estate caveats: make income changes, DB pension continuation, couple-to-survivor tax context, and estate intent visible without giving survivor, pension, estate, or tax advice.
- Cash and one-off handling: keep cash wedge, downsizing proceeds, inheritance, and one-time events separate from recurring monthly capacity.
- Instruction guardrails: prevent the trace from becoming account ordering, annual account-by-account sequencing, personalized withdrawal advice, or saved plan output.
- Decision gate: keep runtime trace work deferred until the contract is reviewed, the clean schema reset is approved, fresh examples are rebuilt, and runtime-only boundaries remain explicit.

## Boundary

This package does not implement account-level sequencing. It only makes the future trace contract safer to prototype later.
