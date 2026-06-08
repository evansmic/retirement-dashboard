# S1928-S1947 Capacity Objective Export Guardrails

Package
- S1928-S1947: Capacity objective export guardrails.
- This is one combined package document for the full twenty-sprint implementation block.

Goal
- Add export/save boundary checks around capacity objective runtime packets.
- Keep all capacity objective data out of saved plan files.
- Keep report and CSV output unchanged unless separately planned.
- Keep saved schema and engine output schema unchanged.
- Keep account-level annual withdrawal instructions deferred.

Implemented
- Added `OptimizerCapacityExportGuard` runtime type.
- Added `OptimizerCapacityExportGuardRow` runtime type.
- Added `selectOptimizerCapacityExportGuard`.
- Added `capacityExportGuard` to bounded optimizer runtime summary.
- Added forbidden saved keys:
  - `capacityObjective`
  - `capacityReportReadiness`
  - `boundedOptimizer`
  - `optimizerOutput`
  - `annualAccountInstructions`
- Added tests proving export guard metadata blocks saved optimizer packets.
- Added plan-file adapter test proving runtime capacity packets are stripped from editable saved plan files.

S1928-S1932 Export Guard Shape Batch
- S1928: Add export guard runtime type.
- S1929: Add export guard row type.
- S1930: Add forbidden saved key list.
- S1931: Add export guard selector.
- S1932: First batch checkpoint: export guard exists without changing save behavior.

S1933-S1937 Save Boundary Batch
- S1933: Test capacity objective is not saved.
- S1934: Test capacity report readiness is not saved.
- S1935: Test bounded optimizer output is not saved.
- S1936: Test annual account instructions are not saved.
- S1937: Second batch checkpoint: accidental runtime-enriched payloads are stripped by clean save conversion.

S1938-S1942 Export Boundary Batch
- S1938: Keep printable report output deferred.
- S1939: Keep CSV output deferred.
- S1940: Keep saved schema unchanged.
- S1941: Keep engine output schema unchanged.
- S1942: Third batch checkpoint: report and CSV exports remain unchanged.

S1943-S1947 Verification And Closeout Batch
- S1943: Run focused optimizer tests.
- S1944: Run plan-file adapter tests.
- S1945: Run production build.
- S1946: Run whitespace and private file guards.
- S1947: Close package and recommend the next runtime slice.

Verification
- `npm test -- app/src/engine/boundedOptimizer.test.ts` passed.
- `npm test -- app/src/data/planFile.test.ts` passed.
- `npm run build` passed.
- Build emitted the existing large-chunk warning only.
- `git diff --check` passed.
- `find . -name '*.plan.json' -o -name '.plan.json'` returned no files.

Boundary
- No saved plan schema changes.
- No engine output schema changes.
- No persisted optimizer output.
- No printable report output change.
- No CSV output change.
- No `.plan.json` files.
- No account-level annual withdrawal instructions.
- No tax-bracket instructions.
- No advice-like CPP/OAS timing language.

Next Recommended Package
- S1948-S1967: Capacity Objective Example Matrix Hardening.
- Run built-in examples through capacity objective, report readiness, and export guard expectations.
- Keep all output runtime-only and unsaved.
