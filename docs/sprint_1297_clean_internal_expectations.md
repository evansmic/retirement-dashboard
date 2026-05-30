Sprint S1297 updated internal saved-file expectations.

Tests that previously inspected the saved plan as current runtime v2 now inspect the clean saved payload. Tests that need runtime fields use the clean-to-runtime adapter explicitly.

This keeps the file boundary and engine boundary separate.
