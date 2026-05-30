# S1448 Candidate Blueprint Contract

Candidate blueprints are planning records that describe what a later runtime builder may construct.

Each blueprint records:
- the candidate family it belongs to,
- whether it is buildable, review-only, blocked, or deferred,
- the scoring role inherited from the family plan,
- a plain reason for the status,
- `doesBuildPlan: false`.

The explicit false build flag keeps this layer from quietly becoming candidate generation.
