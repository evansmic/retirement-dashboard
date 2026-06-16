# Sprint 4028-4047 - Detail Toggle Contract

## Goal

Define how deeper account-path and goals/outflows detail should be exposed as data-sheet toggles, aligned with the printable/downloadable master-detail ledger.

## Completed

- Added a typed `RetirementDetailToggle` contract.
- Added detail toggles for:
  - account path,
  - goals and outflows.
- Each toggle now carries:
  - summary/default mode,
  - expanded data-sheet mode,
  - source sheet,
  - printable/export target,
  - master-detail alignment rule,
  - key fields,
  - evidence label,
  - caveat,
  - and visual-language guidance.
- Surfaced the detail-toggle contract in the presentation-planning band.
- Added focused selector and UI structure coverage.

## Master-Detail Alignment

- Account path detail must reconcile to annual detail and master-detail account columns before any withdrawal-order wording is shown.
- Goals/outflows detail must match the downloadable master-detail CSV for base spending, additional expenses, total spending, debt payments, vacations, and one-time goals.

## Boundaries

This sprint does not redesign the UI, create production charts, save scenarios, open public optimizer output, create account-level annual withdrawal instructions, change saved schema, or create advice language.

## Estimate Update

- Graphical UI redesign: 15-50 sprints remaining.
- Account-level annual instructions: still blocked pending pilot evidence, performance proof, and output-contract decisions.
- Public-ready optimizer: still blocked pending private pilot evidence and release decision.

## Next Package

Define the presentation-mode switch contract so each answer module can toggle between answer card, graphic, and data sheet without changing saved plan data.
