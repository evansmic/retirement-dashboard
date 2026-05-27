# Sprint 659: Evidence Storage Boundary

## Purpose
Clarify how manual feedback evidence should be stored after outside-app review.

## Boundary
- Store only anonymized summary notes in docs or issue notes.
- Do not store local `.plan.json` files.
- Do not store screenshots that show personal inputs unless they are fully anonymized.
- Do not commit raw reviewer transcripts.
- Do not combine reviewer identity with financial details.

## Outcome
- Feedback evidence can inform product work without weakening the local-first promise.
- Repository history stays free of private plan artifacts.

## Boundary
This sprint does not add a feedback database, cloud sync, or persistent app output.
