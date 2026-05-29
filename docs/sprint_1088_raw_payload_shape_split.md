Sprint S1088 gives raw payloads their own test-only fixture shape.

The raw-payload shape is separate from old-preview desired-spending payloads. This keeps raw unwrapped JSON behavior explicit instead of borrowing legacy-preview expectations.

