# Launch Post Drafts

Drafts for Sprint 4 public launch. Keep them transparent and modest. Do not invite people to post private financial details publicly.

## r/PersonalFinanceCanada

Title options:

- I built a free local-first Ontario retirement planner, looking for feedback
- Free browser-based Ontario retirement planner with CPP/OAS/RRSP stress testing

Post draft:

Hi PFC,

I built a free local-first retirement planning tool for Ontario households and would love feedback from people who enjoy picking apart calculators.

It runs in the browser with no account required. The planner does not upload your plan data; you can save or reopen a local `.plan.json` file on your own device. Please do not post real personal financial details in the comments. If you want to report a bug, a synthetic example is much safer.

Current scope:

- Ontario 2026 federal/provincial tax
- CPP and OAS inputs/timing fields
- RRSP/RRIF, LIRA/LIF, TFSA, non-registered accounts, DB pensions, mortgage, one-offs, downsizing, survivor scenario
- staggered retirement and working years with salary/contributions
- recommended-plan-framed dashboard with supporting stress diagnostics
- Monte Carlo and historical sequence stress tests
- local `.plan.json` save/load and print/PDF export
- methodology and public comparator notes

Important limits:

- educational only, not financial advice
- Ontario only for now
- no Quebec/QPP, GIS, RDSP/DTC, or full estate module yet
- no full optimizer yet; the dashboard is recommendation-framed, but it is not searching every CPP/OAS age and withdrawal strategy
- no account system, cloud sync, paid license flow, or advisor workspace

I am especially looking for feedback on confusing wording, missing Canadian edge cases, wrong assumptions, browser issues, and places where the output feels too confident. If you spot a tax/benefit modelling issue, please describe it with a synthetic household rather than your real numbers.

## Hacker News

Title options:

- Show HN: Local-first Canadian retirement planner in static HTML
- Show HN: A browser-only Ontario retirement planner with tax/benefit modelling

Post draft:

I built a local-first Canadian retirement planner focused on Ontario 2026 tax and benefit rules. It is static HTML/CSS/vanilla JS: no backend for the core planner, no account required, and local `.plan.json` save/load for plan files.

The domain complexity is the interesting part. The current engine models federal/Ontario tax, OAS clawback, CPP/OAS inputs, RRSP/RRIF minimums, LIF maximums, TFSA, taxable account ACB/capital gains, pension splitting, CPP sharing, DB pensions, staggered working years, survivor rollover, downsizing, one-offs, Monte Carlo, and historical sequence stress.

The product direction is local-first and consumer-first: useful free public planning, optional paid capability later, and accounts only for things that truly need them such as sync, recovery, sharing, or advisor collaboration.

What is intentionally not built yet:

- full optimizer for CPP/OAS timing and withdrawal strategy
- cloud sync
- account system
- payment/licensing
- advisor workspace
- multi-province tax
- schema v3 runtime migration

The repo includes a Node-based regression suite currently documented at 498 checks, 2026 federal/Ontario tax methodology notes, and a free/public comparator run. I would love feedback on modelling assumptions, validation approach, local-first UX, and any places where the product copy overclaims.

## LinkedIn

Post draft:

Canadian retirement planning gets complicated quickly: CPP/OAS timing, RRSP/RRIF withdrawals, TFSA use, taxable investments, OAS clawback, pension splitting, survivor rules, working years, and housing decisions all interact.

I have been building a free, local-first Ontario retirement planner that runs in the browser and does not require an account. You can save a local `.plan.json` file, reopen it later, and inspect year-by-year taxes, benefits, withdrawals, balances, and stress diagnostics.

The launch version uses Ontario 2026 tax assumptions and is educational only, not financial advice. It is also honest about what is not there yet: no full optimizer, no cloud sync, no account system, no advisor workspace, and no multi-province support yet.

What I am looking for now: critique from DIY planners, Canadian tax/benefit people, fee-only planners, and anyone who has been frustrated by opaque retirement calculators. I am especially interested in assumptions that look wrong, copy that sounds too confident, and edge cases the current model does not handle.

## Short Personal/Site Post

Title: Launching a local-first Canadian retirement planner

Draft:

I am launching a free local-first retirement planner for Ontario households.

It runs in the browser, needs no account, and can save or reopen a local `.plan.json` file on your own device. The current version models Ontario 2026 federal/provincial tax, CPP/OAS inputs, RRSP/RRIF/LIF/TFSA/non-registered accounts, pensions, staggered working years, survivor scenarios, downsizing, one-offs, Monte Carlo, and historical stress tests.

The important caveat: this is educational planning software, not financial advice. It is Ontario-only, uses 2026 assumptions, and does not yet include a full optimizer, cloud sync, accounts, advisor workspace, or multi-province support.

I am publishing it now because the local-first workflow is finally real: a household can create a plan, save it locally, reopen it later, revise it, and inspect the results without uploading private financial details.

Feedback welcome, especially on modelling assumptions, confusing UX, missing Canadian edge cases, and validation.

## Feedback Guidance

Public feedback should use synthetic or redacted examples. Users should not paste real balances, names, birth dates, pension details, `.plan.json` contents, screenshots, or URL hashes into public issues or launch threads.

Good issue reports include:

- browser and operating system
- whether the plan was a bundled preset or synthetic custom plan
- steps to reproduce
- expected result
- actual result
- screenshot only if it contains no private data

Suggested labels:

- `launch-feedback`
- `bug`
- `validation`
- `tax-benefit`
- `privacy-copy`
- `ux-copy`
- `browser-smoke`
- `docs`
- `defer-optimizer`
- `defer-sync-account`

Hotfix quickly:

- wrong tax/benefit result in a supported Ontario 2026 case
- broken plan generation
- broken local save/load
- privacy/disclaimer overclaim
- CI/probe failure
- launch screenshot/copy exposing private data

Defer:

- optimizer requests
- additional provinces
- mobile redesign
- cloud sync
- account/license recovery
- advisor collaboration
- AI report drafting
