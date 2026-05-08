# Sprint 9 Recommended Path Stress & Confidence

Sprint 9 adds a bounded confidence and stress layer around the Sprint 8 recommended path. It remains runtime-only and does not persist recommendation output.

## Scope

- Confidence selector for the selected recommended candidate.
- Stress context summary based on the selected candidate, not only the current plan.
- Overview panel for “What could break this plan?”
- Stable dashboard handoff copy for detailed annual schedules, stress tests, charts, tax rows, account rows, and print/PDF.

## Confidence Rules

The confidence selector uses only available preview evidence:

- Low confidence when the selected candidate is blocked, has source reconciliation warnings, shows a shortfall, or has any watch-level break risk.
- Moderate confidence when no shortfall appears but multiple review items remain, including tax pressure.
- Higher confidence when the selected path clears the bounded preview stress checks.

This is not a full optimizer, Monte Carlo confidence interval, or financial advice.

## Break Risks

The Overview highlights bounded break risks:

- Source reconciliation
- Go-go spending sensitivity
- Retirement date sensitivity
- CPP/OAS timing sensitivity
- Projection shortfall
- Terminal cushion
- Tax pressure
- Survivor resilience

Each item includes stable dashboard handoff copy so users know where to inspect the detailed rows.

## Guardrails

- Runtime dashboard schema remains v2.
- Recommendation, confidence, stress context, and break-risk output are not written to `.plan.json`.
- Stable dashboard remains the complete fallback/detail surface.
- No cloud sync, accounts, advisor workspace, AI reports, multi-province support, full optimizer, or schema v3 persistence.

## Checkpoint

Sprint 9 is checkpoint-ready when selector tests, build, parity probes, canonical probes, and the no-private-plan-file check pass.
