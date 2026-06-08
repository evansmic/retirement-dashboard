# S1908-S1927 Capacity Objective Report Readiness

Package
- S1908-S1927: Capacity objective report readiness.
- This is one combined package document for the full twenty-sprint implementation block.

Goal
- Prepare capacity objective evidence for a later printable/report path.
- Do not change current printable report output.
- Keep report readiness runtime-only.
- Keep saved plan schema and engine output schema unchanged.
- Keep account-level annual withdrawal instructions deferred.

Implemented
- Added `OptimizerCapacityReportReadiness` runtime type.
- Added `OptimizerCapacityReportReadinessRow` runtime type.
- Added `selectOptimizerCapacityReportReadiness`.
- Added `capacityReportReadiness` to bounded optimizer runtime summary.
- Added report-readiness rows for:
  - Capacity summary.
  - Floor comparison.
  - Constraint rows.
  - Tax context.
  - Saved output boundary.
  - Account instruction boundary.
- Added tests proving report readiness does not change printable report output, saved output, or account instructions.

S1908-S1912 Report Readiness Shape Batch
- S1908: Add report-readiness runtime type.
- S1909: Add report-readiness row type.
- S1910: Add report field list for later use.
- S1911: Add report-readiness selector.
- S1912: First batch checkpoint: report readiness exists without report rendering.

S1913-S1917 Boundary Batch
- S1913: Mark tax context as deferred to annual result rows.
- S1914: Mark saved output as deferred.
- S1915: Mark account instructions as deferred.
- S1916: Keep annual sequencing deferred.
- S1917: Second batch checkpoint: report readiness cannot become instructions.

S1918-S1922 Test Batch
- S1918: Test ready report-readiness status.
- S1919: Test report field list.
- S1920: Test blocked readiness when capacity inputs are incomplete.
- S1921: Test bounded optimizer summary includes report readiness.
- S1922: Third batch checkpoint: tests protect runtime-only boundaries.

S1923-S1927 Verification And Closeout Batch
- S1923: Run focused optimizer tests.
- S1924: Run production build.
- S1925: Run whitespace and file guards.
- S1926: Confirm no report output, saved schema, or engine output schema change.
- S1927: Close package and recommend the next runtime slice.

Verification
- `npm test -- app/src/engine/boundedOptimizer.test.ts` passed.
- `npm run build` passed.
- Build emitted the existing large-chunk warning only.
- `git diff --check` passed.
- `find . -name '*.plan.json' -o -name '.plan.json'` returned no files.

Boundary
- No printable report output change.
- No production UI promotion.
- No saved plan schema changes.
- No engine output schema changes.
- No persisted optimizer output.
- No `.plan.json` files.
- No account-level annual withdrawal instructions.
- No tax-bracket instructions.
- No advice-like CPP/OAS timing language.

Next Recommended Package
- S1928-S1947: Capacity Objective Export Guardrails.
- Add export/save boundary checks around capacity objective runtime packets.
- Keep all capacity objective data out of saved plan files.
- Keep report/export output unchanged unless separately planned.
