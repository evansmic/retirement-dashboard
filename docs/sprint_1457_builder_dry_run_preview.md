# S1457 Builder Dry-Run Preview

The dry-run preview lists what a future runtime builder would be allowed to build.

Dry-run rows include:
- blueprint id,
- family id,
- label,
- dry-run status,
- mutation marker,
- generated-output marker,
- reason.

Every dry-run row keeps `mutation: none` and `output: notGenerated`.
