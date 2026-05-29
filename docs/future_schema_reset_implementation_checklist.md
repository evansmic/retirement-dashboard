# Future Schema Reset Implementation Checklist

## Purpose

Define the order of work for the future clean saved-format reset before any schema wiring happens.

## Stages

### 1. Review And Freeze Fields

Required before next stage:

- Minimum expense field name approved.
- Spending-path breakpoint names approved.
- Derived answers stay out of saved inputs.

Rollback: keep schema v2 active and leave the future draft unused.

### 2. Plan Fixtures

Required before next stage:

- Accepted new-format fixture defined.
- Old preview fixture defined.
- Unsupported future fixture defined.

Rollback: delete fixture-only files before wiring import behavior.

### 3. Wire Loader

Required before next stage:

- Current v2 compatibility decision confirmed.
- Block copy verified.
- Raw payload policy decided.

Rollback: restore the current v2 loader and keep reset fixtures for planning.

### 4. Rebuild Examples

Required before next stage:

- Single floor example rebuilt.
- Tight couple example rebuilt.
- Pension survivor example rebuilt.
- Estate-room example rebuilt.

Rollback: revert to existing examples until reset wiring is stable.

### 5. Verify

Required before next stage:

- Full tests pass.
- Full probes pass or the known route bind issue is isolated.
- No `.plan.json` files are created.

Rollback: do not release the reset; keep current v2 behavior.

### 6. Preview Release

Required before release:

- Tester instructions updated.
- Old-file block copy visible.
- Rollback build identified.

Rollback: deploy the prior v2-compatible build.

## Boundary

This checklist is planning only. It does not change current saved plan schema, imports, examples, engine output, or UI.

