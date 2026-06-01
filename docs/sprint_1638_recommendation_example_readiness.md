S1638 Recommendation Runtime Example Readiness

Purpose
- Add example-readiness coverage for future recommendation runtime execution planning.
- Confirm examples can reach the future execution gate without turning the gate into output.

Implemented boundary
- Counts ready and blocked closeouts across example paths.
- Treats any blocked example as a blocked readiness matrix.
- Keeps recommendation output absent with `recommendationCandidateId: null` and `saved: false`.

Consumer-facing principle
- The eventual product answer can be derived from modelled capacity, but this package still only prepares the runtime guardrails.
