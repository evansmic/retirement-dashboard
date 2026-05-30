Sprint S1215 pinned the no-persisted-fixture-file rule.

Rule:
- Fixture prep stays in memory.
- Planning docs may describe fixtures.
- This package must not create or save `.plan.json` files.

This keeps local tester data boundaries simple while implementation is still scoped.
