# S1948-S1967 Capacity Objective Example Matrix Hardening

Package
- S1948-S1967: Capacity objective example matrix hardening.
- This is one combined package document for the full twenty-sprint implementation block.

Goal
- Run built-in examples through capacity objective runtime expectations.
- Run fresh clean-example runtime adapters through the same capacity objective boundary.
- Prove capacity objective, report readiness, and export guard packets remain runtime-only.
- Prove accidental runtime-enriched example payloads are stripped before editable save output.
- Keep report output, CSV output, saved schema, engine output schema, and `.plan.json` behavior unchanged.

Implemented
- Extended the all-example optimizer readiness matrix with capacity objective checks.
- Added matrix assertions for capacity objective status, minimum floor rows, runtime-only boundary copy, and deferred withdrawal sequencing.
- Added matrix assertions for capacity report readiness fields and printable-report deferral.
- Added matrix assertions for capacity export guard forbidden saved keys and report/CSV deferral.
- Added accidental runtime-enriched save checks for every bundled example.
- Added fresh clean-example runtime coverage for capacity objective, report readiness, export guard, and save stripping.

S1948-S1952 Example Matrix Shape Batch
- S1948: Identify the existing all-example optimizer matrix as the hardening surface.
- S1949: Add shared capacity runtime key expectations.
- S1950: Add bundled-example capacity objective assertions.
- S1951: Add bundled-example report readiness assertions.
- S1952: First batch checkpoint: built-in examples expose runtime capacity metadata without product UI changes.

S1953-S1957 Save Boundary Batch
- S1953: Enrich each bundled example with runtime capacity objective output before save.
- S1954: Prove capacity objective packets are stripped.
- S1955: Prove report readiness and export guard packets are stripped.
- S1956: Prove optimizer output and annual account instructions are stripped.
- S1957: Second batch checkpoint: accidental runtime-enriched examples do not become saved optimizer files.

S1958-S1962 Clean Example Runtime Batch
- S1958: Run fresh clean examples through runtime plan adaptation.
- S1959: Run clean examples through bounded optimizer capacity objective output.
- S1960: Assert clean-example report readiness remains report-planning only.
- S1961: Assert clean-example export guards keep schema boundary blocked.
- S1962: Third batch checkpoint: clean examples support runtime capacity review without saved output.

S1963-S1967 Verification And Closeout Batch
- S1963: Run focused capacity example matrix tests.
- S1964: Run full example optimizer readiness matrix.
- S1965: Run production build.
- S1966: Run whitespace and private file guards.
- S1967: Close package and recommend the next runtime sequencing-prep slice.

Verification
- `npm test -- app/src/engine/examplePlanOptimizerReadiness.test.ts -t "capacity objective"` passed.
- `npm test -- app/src/engine/examplePlanOptimizerReadiness.test.ts` passed.
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
- No production UI promotion.
- No account-level annual withdrawal instructions.
- No tax-bracket instructions.
- No advice-like CPP/OAS timing language.

Next Recommended Package
- S1968-S1987: Annual Account Sequencing Prep Contract.
- Define the runtime-only input contract for future annual account-level withdrawal sequencing.
- Keep implementation limited to contract, guardrails, and tests; do not generate account-level instructions yet.
