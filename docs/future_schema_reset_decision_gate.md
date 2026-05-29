# Future Schema Reset Decision Gate

Status: planning-only.

This package defines what must be true before the clean schema reset can move from planning to wiring.

The reset direction remains:

- Start fresh rather than importing old preview plans.
- Block old preview files with plain copy.
- Use minimum monthly expenses instead of desired spending.
- Keep calculated answers and funding trace outputs out of saved plan files.
- Rebuild examples directly in the new format before runtime work.

## Stop Conditions

Do not wire the reset unless:

- The field list is frozen.
- The old-file block posture is accepted.
- Fresh example plans are ready to rebuild.
- Rollback and smoke-test evidence is defined.

This file does not implement import behavior.
