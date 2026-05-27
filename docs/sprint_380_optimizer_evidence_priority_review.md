## Sprint 380

Sprint 380 prioritizes optimizer evidence for tight surfaces.

What changed:
- Added compact evidence rows ordered as monthly spend, funded years, lifetime tax, OAS recovery, and money left.
- Kept detailed evidence rows available in the full research surface.
- Added tests for compact evidence row order.

Boundary:
- The compact rows are derived from existing runtime optimizer output.
- They do not change ranking, search, or persisted plan data.
