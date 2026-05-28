# Sprint 689: Generic Error Boundary

## Purpose
Keep generic preview errors separate from stale-deploy recovery.

## Outcome
- Generic preview errors still show the existing non-refresh message path.
- The refresh button remains limited to the known stale dynamic module case.
- This avoids encouraging reloads for data or calculation problems.

## Boundary
This sprint does not change engine error handling, validation rules, or calculation behavior.
