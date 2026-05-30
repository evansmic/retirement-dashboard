# S1500 Simulation Persistence Guardrail

Runtime candidate simulation output stays out of saved editable plans.

The saved plan remains input-only. Simulation rows are runtime evidence and should not be written into `.plan.json`.
