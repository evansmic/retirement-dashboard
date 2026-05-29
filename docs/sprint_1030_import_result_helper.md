Sprint S1030 adds a test-only planned-import-result check.

The helper compares an in-memory fixture expectation with the planned accept or block outcome. It does not call the current production loader or change current import behavior.

