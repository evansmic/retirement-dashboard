Sprint S1270 wired production blocking for unsupported imports.

Behavior:
- Raw unwrapped file imports block with supported-file copy.
- Older preview wrapped payloads block with soft fresh-start copy.
- Unsupported future wrapped files block with newer-version copy.

Internal raw-payload cloning remains available for runtime helpers.
