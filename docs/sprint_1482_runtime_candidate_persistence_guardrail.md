# S1482 Runtime Candidate Persistence Guardrail

Runtime candidate variants remain in memory only.

They are not:
- added to saved `.plan.json` files,
- added to the engine output schema,
- attached to reports,
- exposed through UI.

The saved editable plan remains the clean input plan.
