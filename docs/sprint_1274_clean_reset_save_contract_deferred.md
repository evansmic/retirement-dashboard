Sprint S1274 documented that the save contract is deferred.

Current behavior:
- Save still writes the current editable v2 plan file.
- Import can accept wrapped clean reset files.
- Import can still accept current wrapped v2 files.

Deferred:
- Switching Save editable plan to emit the clean reset format.
