# PITCH.md

> **Framing note.** The business model for this project is not yet decided (see `DECISIONS.md` Open). The pitches below are drafted *as if* productisation is the path. Treat as a thinking aid rather than a committed position.

## One-paragraph pitch

A browser-based Canadian retirement planning tool that models federal and Ontario tax rules for 2026 with professional-grade precision — RRSP/RRIF minimums, LIF maxes, CPP actuarial adjustments, OAS clawback, pension splitting, spousal-RRSP attribution, working couples with staggered retirements — plus Monte Carlo and historical sequence-of-returns stress testing, running entirely client-side so no household data ever leaves the user's device.

## Investor version

Canadian retirement planning tools sit in a gap: consumer calculators oversimplify to the point of being misleading, and professional tools like Snap Projections or RazorPlan cost $1K–$2K/year and require training. Both miss the household that's sophisticated enough to want the math done right but doesn't employ a full-service advisor.

We built an engine that models 2026 Canadian rules at the fidelity of the professional tools — taxable-income-target solver across both spouses, RRSP meltdown, CPP sharing, pre-retirement working years, staggered retirements, dual DB pensions — and wrapped it in a browser-based dashboard with Monte Carlo stress testing and one-click PDF export. Everything runs client-side, so we don't carry privacy liability and hosting costs are near zero.

Go-to-market options include a direct-to-consumer one-time-purchase tool (privacy positioning), a white-label for Canada's ~2,000 fee-only planners, or an open-source community play that drives brand toward a premium offering. The professional market alone is $2–4M ARR if we capture 10%. The consumer segment is larger and less certain.

Risk: tax law changes yearly; scope grows province-by-province; we're solo today. Moat: the engine is the hard part and we've already built and verified it (38 automated regression checks across three probe scripts).

## Customer version

*(Aimed at a Canadian pre-retiree or early retiree couple.)*

Planning your retirement in Canada is more complicated than most tools pretend. If you want to know whether to take CPP at 65 or 70, when to start pulling from RRSPs, how much the OAS clawback will really cost, whether pension splitting helps, what happens to your spouse if one of you passes first — most calculators wave their hands. Professional software does it properly but costs thousands and is built for advisors, not for you.

This tool does the math the same way a good planner would: full 2026 federal + Ontario tax, CPP actuarial adjustments, OAS clawback, spousal-RRSP attribution, pension splitting, survivor rollover. You can model staggered retirements, pre-retirement working years with raises, two DB pensions, and a planned downsize. Then it stress-tests your plan against 1,000 random-return paths and four historical market crashes (1929, 1973, 2000, 2008), so you can see where results are sensitive to market paths and spending assumptions.

Everything runs in your browser. Nothing is uploaded. No accounts. You close the tab and the data is gone.

## Tagline options

- *Canada's retirement math, done properly. In your browser.*
- *Professional-grade Canadian retirement planning without the professional price tag.*
- *Your retirement, stress-tested.*
- *Real Canadian tax rules. Real returns stress-tested. No account required.*
- *The retirement planner that treats you like a grown-up.*
- *Plan for retirement the way your planner would — without the planner's invoice.*
