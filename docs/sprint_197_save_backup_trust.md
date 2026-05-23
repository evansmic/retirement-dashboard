# Sprint 197: Save Backup Trust

Status: Complete 2026-05-23.

## Goal

Make local-first backup expectations clearer at the moment users save or open the printable report.

## Scope

- Added a plain backup reminder to the Save editable plan card.
- Added a save-before-report prompt when the plan has unsaved local changes.
- Added a save-before-results prompt from the review step.

## Boundary

The planner still saves only the editable local plan file. No report, optimizer, stress, checkpoint, or review output is persisted.
