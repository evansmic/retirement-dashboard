Sprint S1264 pinned the stop-if-not-approved rule.

Rule:
- Stop before production wiring unless the next package is explicitly approved.
- Do not infer approval from completed preflight.
- Do not begin schema/import wiring as incidental cleanup.

This protects saved local plan behavior.
