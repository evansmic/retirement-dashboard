Sprint S1282 pinned the clean reset wrapper boundary.

Clean reset payloads are accepted only when they arrive inside the local plan-file wrapper. Raw clean reset JSON remains blocked by the production validator.

This keeps import wiring explicit and local-first.
