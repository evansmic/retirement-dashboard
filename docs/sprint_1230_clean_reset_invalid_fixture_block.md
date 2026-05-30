Sprint S1230 pinned invalid fixture adapter behavior.

Expectation:
- If fixture validation fails, the test adapter blocks.
- Failed validation does not create a plan file.
- Failed validation does not wire production import.

This keeps accepted fixture handling strict before production behavior is touched.
