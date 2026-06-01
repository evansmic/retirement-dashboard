S1640 Recommendation Runtime Example Guardrail

Purpose
- Keep example readiness separate from actual recommendation execution.
- Prevent a readiness matrix from being mistaken for a selected recommendation.

Pinned expectations
- Ready examples count as readiness only.
- Blocked examples keep the matrix blocked.
- Recommendation output remains null.
- Saved output remains false.

Deferred
- Selecting a recommended candidate from the ranked candidates.
- Translating recommendation copy into UI.
- Tracing where spending appears to come from.
