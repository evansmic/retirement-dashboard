# Sprint 55: Mocked Drawdown Sandbox Comparison

Sprint 55 adds a test-only comparison runner for the queued drawdown sandbox draft. It proves the app can validate a future annual-withdrawal shape and score mocked output before any real execution path exists.

## What Changed

- Added a gate-aware synthetic comparison function.
- The comparison runs only when the sandbox gate has queued a draft.
- Mocked payloads must be positive, match the draft year, and use an account bucket that fits the draft.
- The output reports deltas for funded years, lifetime tax, peak tax, OAS recovery tax, and projected money left.
- Tests cover queued, unqueued, blocked, and invalid-payload paths.

## Boundaries

- This is test harness work only.
- The runner is not imported by the React UI.
- No product calculation is run.
- No annual withdrawal changes are executed.
- The current withdrawal order remains unchanged.
- No saved plan schema or engine output schema changed.
- No prototype, draft, sandbox, mocked payload, comparison, optimizer, or strategy output is saved into `.plan.json`.

## Copy Posture

The harness copy says "mocked", "synthetic", and "test harness only." It avoids recommendation, certainty, automatic execution, or account-instruction language.

## Next Step

Sprint 56 can decide whether to expose a compact readiness review of this harness in Details or keep it fully behind tests while preparing one real, carefully gated execution candidate.
