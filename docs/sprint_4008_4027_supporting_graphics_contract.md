# Sprint 4008-4027 - Supporting Graphics Contract

## Goal

Define the supporting-graphics contract for risk, funding, tax, and net-worth modules while following `docs/ui-redesign-brief.md` and the local mockup assets.

## Brief And Asset Review

- Use the brief's calm premium SaaS direction, restrained glass surfaces, strong numeric hierarchy, and progressive disclosure.
- Use the brief color language: slate/navy foundation, blue for primary information, green for success/trust, amber for review/warning, red only for risk.
- Prefer icon-led navigation and actions in the later redesign. This sprint records icon intent only; it does not add an icon library.
- The dashboard/tablet mockups emphasize:
  - verdict/confidence first,
  - metric cards with sparklines,
  - stacked cash-flow and income timelines,
  - Sankey-style income-source flows,
  - risk severity cards,
  - recommendation/next-step cards,
  - local-first save/export status.
- The mobile mockups emphasize stacked cards, progressive disclosure, scenario comparison tables, recommendation cards, risk cards, and export options.

## Completed

- Added a typed `RetirementSupportingGraphic` contract.
- Added supporting graphic modules for:
  - risk review,
  - funding path,
  - tax drag,
  - net worth and estate.
- Each supporting graphic now carries:
  - chart intent,
  - icon intent,
  - palette token,
  - primary question,
  - comparison label and delta,
  - evidence toggle label,
  - caveat,
  - and visual-language guidance.
- Surfaced the supporting graphics contract in the presentation-planning band.
- Added focused selector and UI structure coverage.

## Boundaries

This sprint does not redesign the UI, add an icon package, create production charts, save scenarios, open public optimizer output, create account-level annual instructions, change saved schema, or create advice language.

## Estimate Update

- Graphical UI redesign: 16-52 sprints remaining.
- Account-level annual instructions: still blocked pending pilot evidence, performance proof, and output-contract decisions.
- Public-ready optimizer: still blocked pending private pilot evidence and release decision.

## Next Package

Define the detail/data-sheet toggle contract for account path and goals/outflows, including printable/downloadable master-detail alignment.
