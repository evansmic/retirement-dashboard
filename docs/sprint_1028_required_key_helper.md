Sprint S1028 adds a test-only required-key helper for future fixture shapes.

The helper checks in-memory fixture-like objects, including dotted paths such as `spending.gogo`. It reports missing keys and does not normalize, load, or save plan data.

