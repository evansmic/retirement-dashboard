# S1888-S1907 Capacity Objective Selector Hardening

Package
- S1888-S1907: Capacity objective selector hardening.
- This is one combined package document for the full twenty-sprint implementation block.

Goal
- Normalize capacity-objective selector logic for reuse outside the React panel.
- Keep capacity objective output runtime-only.
- Preserve the floor-first objective before optional room.
- Add focused tests for status mapping and copy-safe row generation.
- Keep production UI promotion deferred.

Implemented
- Exported capacity-objective selector types from the bounded optimizer module.
- Exported `selectOptimizerMinimumAnnualExpenseFloor`.
- Exported `selectOptimizerCapacityStatus`.
- Exported `selectOptimizerCapacityObjective`.
- Rewired the bounded optimizer summary builder through the exported selector.
- Added direct selector tests for:
  - Minimum floor normalization.
  - Covered, tight, gap, and cannot-tell status mapping.
  - Copy-safe runtime objective rows.
  - Survivor review state.
  - Annual sequencing deferral.
  - Blocked contract state.

S1888-S1892 Selector Extraction Batch
- S1888: Export selector status and input types.
- S1889: Export minimum-floor selector.
- S1890: Export capacity-status selector.
- S1891: Export full capacity-objective selector.
- S1892: First batch checkpoint: bounded optimizer uses the selector path.

S1893-S1897 Status Mapping Batch
- S1893: Test covered status.
- S1894: Test tight status.
- S1895: Test gap status.
- S1896: Test cannot-tell status.
- S1897: Second batch checkpoint: status mapping is deterministic and reusable.

S1898-S1902 Copy Safety Batch
- S1898: Test runtime-only boundary copy.
- S1899: Test survivor review copy.
- S1900: Test annual sequencing deferral copy.
- S1901: Test blocked account-instruction and CPP/OAS advice phrasing.
- S1902: Third batch checkpoint: selector output remains review-oriented.

S1903-S1907 Verification And Closeout Batch
- S1903: Run focused optimizer tests.
- S1904: Run production build.
- S1905: Run whitespace and file guards.
- S1906: Confirm no saved schema or engine output schema change.
- S1907: Close package and recommend the next runtime slice.

Verification
- `npm test -- app/src/engine/boundedOptimizer.test.ts` passed.
- `npm run build` passed.
- Build emitted the existing large-chunk warning only.
- `git diff --check` passed.
- `find . -name '*.plan.json' -o -name '.plan.json'` returned no files.

Boundary
- No production UI promotion.
- No saved plan schema changes.
- No engine output schema changes.
- No persisted optimizer output.
- No `.plan.json` files.
- No account-level annual withdrawal instructions.
- No tax-bracket instructions.
- No advice-like CPP/OAS timing language.

Next Recommended Package
- S1908-S1927: Capacity Objective Report Readiness.
- Prepare capacity objective evidence for a later printable/report path without changing production report output yet.
- Keep all output runtime-only and gated.
