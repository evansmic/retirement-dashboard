Sprint S1112 adds a raw-payload fixture file review checklist.

Before actual raw-payload fixture files are added later, reviewers should confirm:
- The file name does not end in `.plan.json`.
- The file is clearly test-only.
- The expected import result is `block`.
- The block message matches the planned raw-payload copy.
- Current plan state preservation is part of the test expectation.

