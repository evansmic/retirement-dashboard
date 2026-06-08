# S1868-S1887 Capacity Objective Evidence Surface And Guardrails

Package
- S1868-S1887: Capacity objective evidence surface and guardrails.
- This is one combined package document for the full twenty-sprint implementation block.

Goal
- Surface the runtime-only `capacityObjective` evidence without promoting production Overview UI.
- Keep the product answer focused on after-tax monthly capacity.
- Keep minimum floor protection visible before optional room.
- Keep full constraint details in the gated Details research path.
- Add copy and structure guards against advice-like timing language, account instructions, saved output, and annual sequencing.

Implemented
- Added compact capacity evidence to the existing Details bounded optimizer card.
- Replaced the compact optimizer metric from monthly spend reviewed to monthly capacity.
- Added expense floor and optional room to the compact optimizer evidence.
- Added a full capacity constraint evidence section inside the existing option-research gate.
- Rendered minimum floor, estate, survivor, CPP/OAS timing, and annual sequencing constraint rows in the gated full optimizer panel.
- Added styles for capacity states and constraint statuses.
- Added structure guards proving:
  - Capacity evidence copy exists.
  - Full capacity constraint evidence stays in the research path.
  - Overview remains free of optimizer capacity constraint evidence.
  - The surface does not create advice, saved optimizer output, annual sequencing, or account instructions.

S1868-S1872 Compact Evidence Batch
- S1868: Add compact capacity-objective rendering to the Details optimizer card.
- S1869: Show monthly after-tax capacity.
- S1870: Show minimum expense floor.
- S1871: Show optional room only after floor comparison.
- S1872: First batch checkpoint: compact evidence is visible but not instructional.

S1873-S1877 Research Surface Batch
- S1873: Add full capacity constraint rows to the gated optimizer research panel.
- S1874: Render minimum floor and estate states.
- S1875: Render survivor and CPP/OAS timing states.
- S1876: Render annual sequencing as deferred.
- S1877: Second batch checkpoint: full capacity evidence remains behind the option research gate.

S1878-S1882 Copy Guard Batch
- S1878: Keep capacity copy consumer-facing and non-advisory.
- S1879: Block spending-instruction wording.
- S1880: Block account-instruction wording.
- S1881: Block production UI promotion.
- S1882: Third batch checkpoint: copy guards preserve review posture.

S1883-S1887 Verification And Closeout Batch
- S1883: Update structure tests for the capacity objective surface.
- S1884: Run UI structure tests.
- S1885: Run bounded optimizer tests.
- S1886: Run production build and file guards.
- S1887: Close package and recommend the next runtime implementation slice.

Verification
- `npm test -- app/src/ui/App.structure.test.js` passed.
- `npm test -- app/src/engine/boundedOptimizer.test.ts` passed.
- `npm run build` passed.
- Build emitted the existing large-chunk warning only.
- `git diff --check` passed.
- `find . -name '*.plan.json' -o -name '.plan.json'` returned no files.

Boundary
- No production Overview UI promotion.
- No saved plan schema changes.
- No engine output schema changes.
- No persisted optimizer output.
- No `.plan.json` files.
- No account-level annual withdrawal instructions.
- No tax-bracket instructions.
- No advice-like CPP/OAS timing language.

Next Recommended Package
- S1888-S1907: Capacity Objective Selector Hardening.
- Normalize capacity-objective selectors for reuse outside the React panel.
- Add focused tests for status mapping and copy-safe row generation.
- Keep output runtime-only.
- Keep production UI promotion deferred.
