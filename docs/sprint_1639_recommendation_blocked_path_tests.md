S1639 Recommendation Runtime Blocked Path Tests

Purpose
- Pin blocked-path behaviour before actual recommendation execution exists.
- Ensure missing prerequisites cannot pass quietly into future execution.

Test coverage
- Clean execution planning returns a clear block review.
- Missing planning/top-candidate prerequisites return blocked reason ids.
- Blocked dry runs and readiness stay diagnostic only.
- Saved plan output remains unchanged.

Boundary
- No recommendation id is selected.
- No optimizer output is saved.
- No UI path is changed.
