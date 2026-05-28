# Sprint 673: Chunk Error Guard

## Purpose
Guard stale chunk handling without broad error-system work.

## Outcome
- Added a focused structure assertion for stale chunk copy.
- Kept the fallback limited to known dynamic module import failures.
- Preserved the existing generic preview-calculation error for other failures.

## Boundary
This sprint does not add telemetry, analytics, service workers, or cloud error reporting.
