# Sprint 8 Recommended Plan Pathway v0

Sprint 8 adds the first bounded recommended-path layer on top of the Sprint 7 decision surface. It does not persist recommendation output, change schema, or build a full optimizer.

## Scope

The runtime selector compares four candidates:

1. Current plan
2. Retire two years later
3. Spend 10% less in go-go
4. Delay CPP/OAS to 70

The recommendation is a strongest preview candidate, not financial advice.

## Recommendation Rules

- Source reconciliation warnings block a candidate.
- Validation blockers block recommendation output.
- No shortfall beats a higher ending portfolio with a shortfall.
- Later funded-through year beats higher terminal portfolio when shortfalls differ.
- Ending portfolio is considered after shortfall and funded-through year.
- Lower lifetime tax is a supporting reason, not the primary decision rule.
- Survivor issues are surfaced as review warnings, not automatic disqualifiers.

## React Overview Additions

- Recommended path panel.
- Trust checks for source reconciliation, shortfall, tax pressure, and survivor status.
- Candidate ranking table.
- Why-this and tradeoff copy.
- Why-not-the-others explanations.

## Guardrails

- Keep `.plan.json` schema at v2.
- Do not write recommendation output to local plan files.
- Do not add full optimizer, cloud sync, accounts, advisor workspace, AI reports, multi-province support, or schema v3 persistence.
- Keep the stable dashboard as full fallback.

## Checkpoint

Sprint 8 is checkpoint-ready when selector tests, smoke tests, build, parity probes, and canonical probes pass with no private `.plan.json` files created in the repo.
