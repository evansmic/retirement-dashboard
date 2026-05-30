# S1460 Dry-Run Audit

The dry-run audit checks that preview rows did not mutate plans or generate candidate output.

Audit outputs:
- checked row count,
- mutation count,
- generated output count,
- pass/block status.

Any mutation or generated output would block the dry-run layer.
