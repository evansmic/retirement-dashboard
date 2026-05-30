Sprint S1288 moved saved plan files to the clean wrapper payload.

`createPlanFile` now writes a wrapped clean reset payload with `future-clean-reset-draft` as the saved schema marker. The saved file no longer writes the current editable v2 plan as its plan payload.

The local file wrapper remains explicit and local-first.
