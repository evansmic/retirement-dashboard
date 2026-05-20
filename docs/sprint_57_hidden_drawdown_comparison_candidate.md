# Sprint 57: Hidden Drawdown Comparison Candidate

Sprint 57 adds the first real comparison path after the drawdown readiness sequence. It stays hidden: no UI surface, no account instructions, no saved output, and no annual override schema.

## What Changed

- Added one hidden registered-timing comparison runner.
- The runner uses existing simulation config only.
- The runner is gated by comparison readiness and the sandbox-queued draft.
- The output returns funding, tax, OAS recovery, and projected money-left evidence rows.
- Tests prove the runner blocks when readiness is missing and that saved plan files remain clean.

## Boundaries

- No annual withdrawal override execution was added.
- No account-by-account instructions are created.
- The React UI does not import or render the hidden runner.
- The current withdrawal order remains the source of truth for normal Results.
- No saved plan schema or engine output schema changed.
- No prototype, draft, sandbox, readiness, hidden comparison, mocked payload, optimizer, or strategy output is saved into `.plan.json`.

## Copy Posture

The comparison output uses "hidden", "review evidence", and "does not create account instructions." It avoids recommendation, certainty, automatic execution, and advice-like account language.

## Next Step

Sprint 58 should extend the example matrix around the hidden comparison before exposing any comparison evidence in Details.
