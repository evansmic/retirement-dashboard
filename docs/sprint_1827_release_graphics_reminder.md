S1827 Release Graphics Reminder

Scope
- Capture a release-stage reminder for the Results graphics system.

Reminder
- Revisit the Sankey diagram design tool before release.
- The current static Sankey mockup is a direction marker, not the final production design.
- Production Sankey work should evaluate a real Sankey layout tool, with D3 Sankey as the leading candidate because it can compute proportional node and link geometry from runtime data.

Broader Graphics Direction
- The Sankey view should not be the only graphical element in Results.
- Results should include calm, modern visuals for:
  - Net worth over time.
  - Account drawdowns over time.
  - Total estate value over time.
  - Annual income, tax, spending, and ending portfolio.
  - Funding flow by selected year.
  - CPP/OAS timing scenario comparisons.
  - Account withdrawal/order comparison once optimizer output is ready.

Tables Plus Graphics
- Every major graph should be backed by a data table.
- Users should be able to toggle between visual and table views where appropriate.
- Graphical views should help visual thinkers understand the plan quickly.
- Table views should preserve trust for users who want to inspect the numbers.

Printable Report Direction
- The printable report should include:
  - Overview.
  - Details.
  - Relevant graphics.
  - Relevant data tables.
  - Underlying assumptions.
  - Income sources by year.
  - Account withdrawals and proposed order when optimizer work is ready.
  - CPP/OAS scenario comparisons.
  - Tax, debt, mortgage servicing, spending, investing, and estate values across the life of the plan.

Design Guidance
- Follow docs/ui-redesign-brief.md:
  - Calm premium SaaS.
  - Strong first-answer hierarchy.
  - Progressive disclosure.
  - Graphs that clarify decisions instead of adding chart clutter.
  - Local-first trust and exportability.

Boundary
- This is a release reminder and design planning note only.
- No production UI changes.
- No saved schema or engine output schema changes.
- No account-level withdrawal instructions until optimizer output is explicitly ready.
