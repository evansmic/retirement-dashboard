# Sprint 981: Instruction Guardrail Batch Checkpoint

Status: complete.

Batch S977-S981 added instruction guardrails for account order, annual rows, personalized withdrawals, saved trace outputs, and review-only language.

Verification target after this batch:

- Future format unit tests.
- Existing plan import/file tests.
- Full probe suite, with the known route bind issue treated separately if it is the only failure.

The trace remains a review aid, not a withdrawal plan.
