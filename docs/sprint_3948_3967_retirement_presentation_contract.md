# Sprint 3948-3967 - Retirement Presentation Contract

## Goal

Create the bridge between the stable retirement answer layer and the later graphical UI redesign, without starting the redesign itself.

## Completed

- Added a typed `RetirementPresentationPlan` selector that maps each retirement answer row to a presentation module.
- Each module now records:
  - the primary answer-card mode,
  - the future graph pattern,
  - the matching downloadable/detail data sheet,
  - the relevant adjustable assumptions,
  - evidence labels,
  - comparison focus,
  - and the purpose of the visual.
- Added default presentation modes: answer card, graph, and data sheet.
- Added side-by-side comparison slots for current plan, optimal plan, and two comparison scenarios.
- Added explicit progress behaviour for reruns when retirement age, CPP/OAS timing, returns, spending, residence sale date, or survivor timing changes.
- Surfaced the contract inside the existing retirement answer layer panel as planning context only.
- Added focused selector and UI structure coverage.

## Boundaries

This sprint does not redesign the UI, add charts, save scenarios, create advice language, open public optimizer output, create account-level annual instructions, change plan schema, or write optimizer output to `.plan.json`.

## Estimate Update

- Graphical UI redesign: 19-58 sprints remaining.
- Account-level annual instructions: still blocked pending pilot evidence, performance proof, and final output-contract decisions.
- Public-ready optimizer: still blocked pending pilot evidence and release decision.

## Next Package

Use the presentation contract to refine the answer-card copy order and decide which modules belong above the fold versus behind a data-sheet toggle. Keep optimizer account-level annual instructions on hold unless the owner explicitly switches back.
