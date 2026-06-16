# Sprint 3988-4007 - First-Read Card Contract

## Goal

Make the first-read retirement cards stable before graphical UI design begins.

## Completed

- Added a typed `RetirementFirstReadCard` contract for the first-read modules.
- Each first-read card now has:
  - role,
  - headline,
  - supporting number label,
  - supporting number/evidence text,
  - comparison label,
  - comparison delta,
  - evidence toggle label,
  - and caveat.
- Derived the cards from the existing answer layer so copy stays tied to evidence and comparison deltas.
- Surfaced the first-read card contract in the presentation-planning band.
- Added focused selector and UI structure coverage.

## Boundaries

This sprint does not redesign the UI, create production charts, save scenarios, open public optimizer output, create account-level annual instructions, change saved schema, or create advice language.

## Estimate Update

- Graphical UI redesign: 17-54 sprints remaining.
- Account-level annual instructions: still blocked pending pilot evidence, performance proof, and output-contract decisions.
- Public-ready optimizer: still blocked pending private pilot evidence and release decision.

## Next Package

Define the supporting-graphics contract for risk, funding, tax, and net-worth modules, including chart intent, comparison delta, evidence sheet, and caveat.
