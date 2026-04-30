# Canadian Retirement Planner Product Docs

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

<!--
  Sprint 1 #43: this is a placeholder screenshot. Replace with a real shot of
  the dashboard once captured. Highest-impact frame is the income-stack chart
  at full width on the `db-pension-couple` or `diy-couple` preset, ~1600×900,
  saved to docs/screenshot.png. No README change needed — the path is stable.
-->
![Retirement Plan Dashboard — screenshot](docs/screenshot.png)

Planning your retirement in Canada is more complicated than most tools pretend. If you want to know whether to take CPP at 65 or 70, when to start drawing from RRSPs, how badly the OAS clawback will really bite, whether pension splitting helps, what happens to your spouse if one of you dies first — most calculators wave their hands. Professional software does it properly but costs thousands and is built for advisors, not for you.

This tool does the math the way a good Canadian planner would. It models full 2026 federal + Ontario tax (with BPA phase-out, Ontario surtax, Health Premium), RRSP/RRIF minimums, LIF maximums, CPP actuarial adjustments, OAS clawback, pension splitting, spousal-RRSP attribution, CPP sharing, and survivor rollover. You can model staggered retirements, pre-retirement working years with raises and contributions, two DB pensions, a planned downsize, and one-off expenses. Then it stress-tests your plan against 1,000 random-return paths and four historical market crashes (1929, 1973, 2000, 2008), so you see how fragile or robust the plan really is.

Everything runs in your browser. Nothing is uploaded. No accounts. Close the tab and the data is gone.

> **Not financial advice.** This is an educational planning tool, not a substitute for advice from a qualified financial planner, accountant, or tax professional. Tax rules change; verify current figures with the CRA, Service Canada, and your province before acting. Full disclaimer at the bottom.

## What it models

| Area | What's modelled |
|---|---|
| **Tax** | Federal + Ontario brackets, BPA phase-out, Ontario surtax + Health Premium, pension splitting, capital-gains inclusion, OAS clawback. |
| **Registered accounts** | RRSP/RRIF (with minimums), LIRA/LIF (with 1.3× RRIF max), TFSA, spousal-RRSP 3-year attribution. |
| **CPP / OAS** | Actuarial adjustment from 60–70, CPP sharing, OAS at 65 with 0.6%/mo deferral up to 70. |
| **Couples** | Staggered retirement, dual DB pensions, survivor rollover (registered + non-reg with ACB preserved), CPP survivor benefit. |
| **Working years** | Pre-retirement salary growth, RRSP/TFSA/non-reg contributions, dual DB accruals. |
| **Stress testing** | Five deterministic scenarios (Baseline, RRSP Meltdown, 0% Return, Survivor, Max Spend) + Monte Carlo (1,000 paths) + sequence-of-returns stress (1929/1973/2000/2008). |
| **Output** | Income-stack, balances, tax, and estate charts; year-by-year detail table; comparison table with stress/funding metrics; PDF print export. |

Ontario only for now — Quebec, BC, and Alberta tax aren't yet supported. See [`ROADMAP.md`](ROADMAP.md) for what's next.

## About this repo

This repository holds the product, architecture, validation, roadmap, and decision-making materials for evolving the retirement dashboard into a consumer-first, local-first Canadian retirement planner. The runnable HTML dashboard lives in its own project repository.

## Privacy

All computation happens client-side. Your inputs are encoded into the URL hash (the part after `#`), which by design is **never sent to a server** — it stays on your machine. There are no accounts, no cookies for logged-in state, no analytics on the form data. The only outbound request is to a CDN to load Chart.js.

## Tested

179 checks across the canonical Node-based regression probes cover the tax math, scenario behaviour, Monte Carlo + sequence-of-returns stress, schema migration, example-preset registry, intake round-trip, and progressive Monte Carlo lifecycle. Run the suite locally with:

```bash
cd probes
./run_all.sh
```

See [`probes/README.md`](probes/README.md) for what each probe covers and how to add new ones.

## Tech

- HTML / CSS / vanilla JavaScript — no framework, no build step.
- [Chart.js](https://www.chartjs.org/) is the only external runtime dependency, loaded from a CDN.
- Node 18+ to run the probe suite locally; CI runs on Node 20.

## Repo guide

| File | Purpose |
|---|---|
| `index.html` | Intake form. Encodes `D` (the household payload) into the URL hash. |
| `retirement_dashboard.html` | Engine + dashboard. Reads the hash and renders scenarios + charts. |
| `probes/` | Node-based regression suite. See [`probes/README.md`](probes/README.md). |
| `PROJECT.md` | Project overview, problem, value proposition, tech stack. |
| `ROADMAP.md` | Completed milestones, current phase, future ideas. |
| `DB_SCHEMA.md` | The `D` payload contract (schema). |
| `USER_FLOWS.md` | Main user flows + friction points + missing flows. |
| `TASKS.md` | Sprint plan — current and backlog. |
| `DECISIONS.md` | Architecture decisions made + open questions. |
| `PITCH.md` | Investor / customer / tagline drafts (productisation thinking). |

## Status

Engine models federal + Ontario 2026 tax law with what we believe is professional-grade precision; the 179-check regression suite covers the rules end-to-end. Sprint 1 and Sprint 2 are complete. The next planned work is Sprint 0: tax accuracy, risk-language clarity, validation exports, engine readiness, and local-first monetization boundaries before a broader UI rebuild. See [`ROADMAP.md`](ROADMAP.md).

## License

[MIT](LICENSE) — © 2026 Michael Evans.

## Disclaimer

**This dashboard is not financial advice.** It is an educational planning tool, not a substitute for advice from a qualified financial planner, accountant, or tax professional. Projections rely on the inputs you supply and on simplifying assumptions about taxes, returns, inflation, and government benefits — actual outcomes will differ. The author makes no warranty as to the accuracy or completeness of the calculations and accepts no liability for decisions made on the basis of them. Tax rules and benefit thresholds change; verify current figures with the CRA, Service Canada, and your province before acting. Consult a licensed advisor for decisions involving real money.
