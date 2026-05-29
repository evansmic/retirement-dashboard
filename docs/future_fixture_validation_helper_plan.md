# Future Fixture Validation Helper Plan

## Purpose

Plan future test-only helpers for schema reset fixtures without wiring production imports.

## Helpers

### `assertRequiredKeys`

Checks:

- all required keys are present,
- nested keys can be checked by path.

Must not:

- normalize missing fields,
- load the fixture into app state.

### `assertForbiddenKeys`

Checks:

- calculated answers are absent,
- old phased-spending keys are absent from new-format fixtures.

Must not:

- delete forbidden keys automatically,
- treat forbidden keys as warnings only.

### `assertExpectedImportResult`

Checks:

- accepted fixtures map to accept,
- blocked fixtures map to block,
- block messages remain plain.

Must not:

- wire the production loader,
- change current import behavior.

## Boundary

These helpers are planning-only. They are not implemented as production import validators in this package.

