# Sprint 1016: Block Message Batch Checkpoint

Status: complete.

Batch S1012-S1016 added unsupported-future, raw-payload, old-preview, and newer-format block expectations.

Verification target after this batch:

- Future format unit tests.
- Existing plan import/file tests.
- Full probe suite, with the known route bind issue treated separately if it is the only failure.

No loader wiring changed.
