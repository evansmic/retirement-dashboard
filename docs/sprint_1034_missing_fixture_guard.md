Sprint S1034 guards missing future fixture objects.

If a planned fixture shape has no supplied object, validation fails with the missing required keys. This keeps future fixture readiness explicit without silently treating missing fixtures as acceptable.

