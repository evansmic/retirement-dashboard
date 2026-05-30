Sprint S1189 pinned stop-gate behavior for the schema reset decision.

Expectation:
- Every decision area must stop implementation if required evidence is missing.
- The reset should not proceed with partial migration, silent import, reused old examples, or missing rollback.

This keeps implementation blocked until the decision gate is explicitly reviewed.
