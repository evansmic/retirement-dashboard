Sprint S1064 adds fixture rollback guidance.

If fixture implementation later causes drift, rollback should remove the test fixture additions and keep current v2 import behavior unchanged. Rollback should not delete unrelated planning docs or change current examples.

