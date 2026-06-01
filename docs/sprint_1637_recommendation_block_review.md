S1637 Recommendation Runtime Block Review

Purpose
- Add a runtime-only block review for future recommendation execution prerequisites.
- Keep the review diagnostic only: no recommendation is selected, persisted, traced, sequenced, or shown in UI.

Implemented boundary
- Clear state means the prior planning closeout, top candidate evidence, dry-run, audit, and readiness are clean.
- Blocked state records missing or blocked prerequisites in stable reason ids.
- The selector always returns `recommendationCandidateId: null` and `saved: false`.

Deferred
- Actual recommendation selection.
- Funding trace.
- Account instructions.
- Annual account-level sequencing.
- UI presentation.
