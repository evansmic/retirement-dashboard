S1647 Recommendation Runtime Execution Start

Purpose
- Begin actual runtime recommendation execution.
- Select one modelled candidate from the existing ranked candidate evidence.

Implemented boundary
- The selection is runtime-only.
- It is not saved to the editable plan.
- It does not produce a funding trace, account instruction, annual sequencing, or UI presentation.

Decision
- Use the top-ranked candidate as the first conservative runtime recommendation source.
