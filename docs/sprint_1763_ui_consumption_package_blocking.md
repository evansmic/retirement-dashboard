S1763 UI Consumption Package Blocking

Scope
- Pin blocked behavior for UI consumption package closeout.

Blocking Rules
- Block if the UI consumption closeout is not complete.
- Block if example readiness is not ready.
- Route blocked packages back to capacity-input work instead of UI planning.

Purpose
- Prevent the future UI pass from consuming partial selector contracts or planning internals.
