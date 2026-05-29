Sprint S1119 adds raw-payload fixture file rollback guidance.

If later fixture files cause confusion or drift, rollback should remove the fixture files and related tests while keeping current v2 import behavior unchanged. Rollback should not touch current examples or user-facing plan save/load behavior.

