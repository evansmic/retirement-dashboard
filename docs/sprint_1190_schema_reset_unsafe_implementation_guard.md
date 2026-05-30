Sprint S1190 added an unsafe implementation guard to the decision evidence.

The gate checks for explicit avoidance of:
- Best-effort old file migration.
- Silent partial import.
- Reusing old desired-spending examples.
- Release without rollback path.

These remain planning checks only.
