Sprint S1115 adds raw-payload state-preservation checks.

Raw-payload fixture review should prove a blocked file leaves the current plan state unchanged. It should not partially load nested values or create wrapped-file metadata on the user's behalf.

