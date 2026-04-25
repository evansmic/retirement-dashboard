# Retirement Plan Dashboard

Browser-based Canadian retirement planning tool (Ontario tax rules, 2026). Self-contained: two static HTML files, no server, no database, no build step.

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

55 checks across four canonical probes (Phase 4 final + three Phase 5 probes). All must pass before any merge.

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
