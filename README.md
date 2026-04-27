# Retirement Plan Dashboard

[![probes](https://github.com/evansmic/retirement-dashboard/actions/workflows/probes.yml/badge.svg?branch=main)](https://github.com/evansmic/retirement-dashboard/actions/workflows/probes.yml)

Browser-based Canadian retirement planning tool (Ontario tax rules, 2026). Self-contained: two static HTML files, no server, no database, no build step.

## Disclaimer

**This is not financial advice.** It is an educational planning tool, not a substitute for advice from a qualified financial planner, accountant, or tax professional. Projections depend on the inputs you supply and on simplifying assumptions about taxes, returns, inflation, and government benefits — actual outcomes will differ. The author makes no warranty as to the accuracy or completeness of the calculations and accepts no liability for decisions made on the basis of them. Tax rules and benefit thresholds change; verify current figures with the CRA, Service Canada, and your province before acting. Consult a licensed advisor for decisions involving real money.

## Quick start

1. Open `index.html` in a browser. Fill in the intake form.
2. Submit → redirects to `retirement_dashboard.html` with the encoded payload in the URL hash.
3. Explore scenarios, run Monte Carlo, run sequence-of-returns stress, export PDF.

## Files

| File | Purpose |
|---|---|
| `index.html` | Intake form. Encodes `D` (household payload) into the URL hash. |
| `retirement_dashboard.html` | Engine + dashboard. Reads the hash and renders scenarios + charts. |
| `probes/` | Node-based regression suite. See `probes/README.md`. |
| `PROJECT.md` | Project overview, problem, value proposition, tech stack. |
| `ROADMAP.md` | Completed milestones, current phase, future ideas. |
| `DB_SCHEMA.md` | The `D` payload contract (schema). |
| `USER_FLOWS.md` | Main user flows + friction points + missing flows. |
| `TASKS.md` | Immediate, strategic, and backlog tasks with priorities. |
| `DECISIONS.md` | Architecture decisions made + open questions. |
| `PITCH.md` | Investor / customer / tagline drafts (productisation). |

## Run the regression suite

```bash
cd probes
./run_all.sh
```

128 checks across six canonical probes (Phase 4 final + three Phase 5 probes + schema-migrate + presets). All must pass before any merge — enforced in CI by `.github/workflows/probes.yml`.

## Data flow

```
index.html  ──[base64(URI(JSON.stringify(D)))]──>  URL hash  ──>  retirement_dashboard.html
                                                                       │
                                                                       ▼
                                                           runSimulation(SCENARIOS[k].cfg)
                                                                       │
                                              ┌────────────────────────┼────────────────────────┐
                                              ▼                        ▼                        ▼
                                       deterministic                Monte Carlo            sequence stress
                                          (5 scenarios)           (1000 paths)          (1929/73/2000/08)
```

The engine is pure (DOM-free once `window` and `document` are stubbed), which is what makes the Node probes possible.

## Tech

- HTML / CSS / vanilla JavaScript.
- Chart.js (only external dependency, loaded from CDN).
- Node 18+ to run probes.

## Status

**Phase 5 complete.** Working couples + staggered retirement + dual DB pensions all modelled and verified. See `ROADMAP.md` for what's next.
