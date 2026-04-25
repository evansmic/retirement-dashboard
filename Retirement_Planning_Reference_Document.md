# Comprehensive Retirement Planning Reference Document
## Ontario, Canada Couple — Dashboard Project Master Reference

**Prepared:** April 18, 2026  
**Purpose:** Master reference for building an interactive retirement planning dashboard  
**Scope:** Ontario-resident couple, Canadian tax/benefit rules, Snap Projections methodology, Parallel Wealth approach  
**Dashboard Format:** Interactive HTML (front-end) + Excel (data source / backend)  
**Use Case:** Personal use and generic enough for any Canadian couple to populate their own data

---

## PART 1: CANADIAN RETIREMENT INCOME FRAMEWORK

### 1.1 Government Benefits

#### Canada Pension Plan (CPP)

| Parameter | Value |
|---|---|
| Claimable ages | 60 to 70 |
| Maximum monthly at 65 (2026, base CPP) | ~$1,364.60 |
| Maximum monthly at 65 (2026, with enhanced CPP) | ~$1,410–$1,507 (depends on post-2019 contribution history) |
| Average monthly at 65 (Q1 2026) | ~$803.76 |
| Year's Maximum Pensionable Earnings (YMPE 2026) | $74,600 |
| CPP2 second ceiling (2026) | $74,600–$85,000 range |
| Early claim penalty (before 65) | 0.6% reduction per month |
| Deferral bonus (after 65) | 0.7% increase per month |
| Age 60 benefit (vs. age 65) | 64% of age-65 amount |
| Age 70 benefit (vs. age 65) | 142% of age-65 amount |

**CPP Calculation Details:**
- **Early claim:** Monthly benefit × (1 − 0.006 × months before 65)
- **Late claim:** Monthly benefit × (1 + 0.007 × months after 65)
- **Enhancement:** Post-2019 contributions build toward higher benefits (~33% of earnings instead of 25% after 40 years)
- **Child-Rearing Provision:** Periods of low/no earnings while raising children under 7 can be excluded from CPP calculation
- **General Dropout:** Worst 8 years excluded from the 47-year contributory period
- **CPP Sharing between spouses:** CRA determines eligible portion based on cohabitation period during working years
- **CPP Survivor Benefit:** Under-65 spouses ~$740/month; 65+ spouses ~$809/month; combined retirement-survivor cap ~$1,294

**Planning Insight (Parallel Wealth):** Delaying CPP from age 65 to 70 delivers 42% more income, indexed to inflation for life. For most Canadians with RRSP savings, the "RRSP meltdown + delayed CPP" combination produces the highest lifetime after-tax income.

---

#### Old Age Security (OAS)

| Parameter | 2026 Value |
|---|---|
| Maximum monthly (ages 65–74, Q1 2026) | ~$742.31 |
| Maximum monthly (ages 75+, Q1 2026) | ~$816.54 |
| Deferral rate | 0.6% per month (max 36% at age 70) |
| OAS clawback threshold (2026 income) | $95,323 |
| Full clawback income (ages 65–74) | ~$154,708 |
| Full clawback income (ages 75+) | ~$157,923 |
| Clawback rate | 15 cents per dollar above threshold |
| Quarterly indexation | Tied to CPI |

**OAS Clawback Formula:**
```
Recovery Tax = (Net income − $95,323) × 15%
```

**Planning Insight (Parallel Wealth):** OAS clawback avoidance is one of the primary reasons to draw down RRSPs early (pre-70) and transition to TFSA-sourced income. Income below $95,323 protects full OAS. TFSA withdrawals do NOT count as income for clawback purposes.

> **Note on figures:** OAS clawback threshold is indexed annually; the Q1 2026 threshold is $95,323. The reference document value of $93,454 was the prior period; always verify current quarter on Canada.ca.

---

#### Guaranteed Income Supplement (GIS)

- For seniors with income below ~$22,488 (single) or ~$29,712 (couple, depending on OAS pension status)
- Income-tested benefit for low-income retirees
- Dual-income retirees can coordinate OAS deferrals to maximize survivor GIS
- GIS is not applicable for most middle-income retirees but relevant for survivor planning

---

#### Ontario Guaranteed Annual Income System (GAINS)

- Provincial supplement for low-income Ontario seniors
- Targets singles under ~$20,416 net annual income
- Additional layer of provincial support; rarely applicable to dual-income retirees

---

### 1.2 Registered Accounts

#### RRSP (Registered Retirement Savings Plan)

| Parameter | 2026 Value |
|---|---|
| Annual contribution limit | $33,810 |
| Limit calculation | Lesser of 18% of prior year earned income or dollar limit |
| 2025 contribution limit | $32,490 |
| Mandatory conversion age | 71 (by Dec 31 of the year you turn 71) |
| Tax treatment | Contributions deductible; withdrawals fully taxable |
| Unused room | Carries forward indefinitely; tracked on Notice of Assessment |

**Spousal RRSP:**
- Higher-income spouse contributes; lower-income spouse is the annuitant
- Income attribution back to contributor applies if withdrawn within 3 calendar years of contribution
- Strategic use: equalize retirement incomes; both spouses use lower brackets

**Key Planning Lever:** Contributing to a spousal RRSP when income gap exists between spouses reduces combined lifetime taxes. Particularly effective when one spouse has a DB pension and the other has limited retirement income.

---

#### RRIF (Registered Retirement Income Fund)

- Converted from RRSP no later than December 31 of the year turning 71
- No minimum withdrawal in conversion year; first mandatory withdrawal year following
- RRIF income is fully eligible for the $2,000 pension income credit (at age 65+)
- Up to 50% of RRIF income can be split with spouse via pension income splitting (T1032)

**RRIF Minimum Withdrawal Schedule:**

| Age | Minimum % | Age | Minimum % |
|---|---|---|---|
| 65 | 4.00% | 80 | 6.82% |
| 71 | 5.28% | 82 | 7.38% |
| 72 | 5.40% | 85 | 8.51% |
| 73 | 5.53% | 88 | 9.58% |
| 74 | 5.67% | 90 | 11.92% |
| 75 | 5.82% | 94 | 18.79% |
| 77 | 6.05% | 95+ | 20.00% |
| 78 | 6.17% | | |

**Formula for under 71:**  `1 ÷ (90 − age)` expressed as a percentage

**Key Planning Features:**
- Withholding tax on excess above minimum: 10% (≤$5,000), 20% ($5,001–$15,000), 30% (>$15,000)
- Younger spouse election: Can use younger spouse's age to reduce minimums (must be elected at RRIF setup; cannot be changed)
- RRIF balance at death is fully included in the deceased's income in the year of death (major estate tax risk if large balance remains)

**Parallel Wealth Insight:** The RRIF estate tax trap is one of the most common planning errors. A $500,000 RRIF triggers a potential $200,000+ tax bill at death. The RRSP meltdown strategy is designed specifically to eliminate this risk.

---

#### TFSA (Tax-Free Savings Account)

| Parameter | 2026 Value |
|---|---|
| Annual contribution limit | $7,000 |
| Cumulative room (eligible since 2009, never contributed) | $109,000 |
| Withdrawals | Added back to contribution room January 1 of following year |
| Tax on withdrawals | None |
| Impact on OAS/GIS | Zero — not counted as income |
| Mandatory conversion | None — account can remain open for life |

**Strategic Role in Retirement:**
- Primary buffer against OAS clawback (draw from TFSA instead of RRIF when income approaches $95,323)
- Tax-free supplement in high-income years (one-time expenses, market gains)
- Ideal for final phase of retirement when RRIF is depleted (Parallel Wealth strategy)
- Passes to beneficiary or successor holder tax-free on death if properly designated

**Dashboard Note:** TFSA balance should be modeled as available for withdrawal at zero marginal tax cost. Each $1 from TFSA vs. RRIF saves 15 cents of OAS clawback.

---

#### LIRA / LIF (Locked-In Retirement Account / Life Income Fund)

- **LIRA:** Locked-in RRSP from former employer pension; cannot be withdrawn until retirement
- **LIF:** Converted from LIRA at retirement; has both minimum AND maximum annual withdrawal limits
- **Ontario jurisdiction rules:** Ontario has specific provisions for partial unlocking after age 55
- **One-time 50% unlocking:** At LIF setup, Ontario residents can transfer up to 50% to a regular RRSP/RRIF
- **Small balance unlocking:** May be available depending on age and account size
- **LIF maximum withdrawal rates:** Vary by age; generally much lower than RRIF maximums

---

#### FHSA (First Home Savings Account)

| Parameter | Value |
|---|---|
| Annual contribution limit | $8,000 |
| Lifetime maximum | $40,000 |
| Unused room carryforward | Up to $8,000 per year |
| Account must close | Within 15 years of opening or by Dec 31 of year turning 71 |
| Qualifying withdrawal | Tax-free for first home purchase |
| Non-qualifying transfer | Can transfer to RRSP/RRIF without affecting contribution room |

*Typically relevant for younger clients or children; less common in retirement planning for couples already in retirement*

---

### 1.3 Non-Registered / Taxable Accounts

| Income Type | Tax Treatment |
|---|---|
| Interest income | 100% included in income at marginal rate |
| Canadian dividends (eligible) | Grossed-up by 38%; dividend tax credit of 15.02% (federal); effective rate well below marginal |
| Canadian dividends (non-eligible) | Lower gross-up (15%) and credit |
| Capital gains (up to $250,000) | 50% inclusion rate — only half is taxable |
| Capital gains (above $250,000) | 66.67% inclusion rate (effective January 1, 2026) |
| Return of Capital (ROC) | Reduces ACB; not immediately taxable; increases future capital gain |

**Key Tracking Requirement:** Adjusted Cost Base (ACB) must be tracked for every non-registered investment. This is critical for accurate capital gains calculations at withdrawal or death.

**Principal Residence Exemption:** Gain on qualifying principal residence is 100% tax-free.

---

### 1.4 Employer Pensions

#### Defined Benefit (DB) Pension

| Feature | Detail |
|---|---|
| Benefit type | Fixed guaranteed payments based on years of service and salary formula |
| Indexation | May be partial or full CPI indexation depending on plan |
| Bridge benefit | Some plans provide supplemental income until age 65 (when CPP/OAS begin) |
| Survivor benefit | Typically 60% to 100% of pension continues to surviving spouse |
| Pension income splitting | At 65+, up to 50% of pension income can be split with spouse |
| Commuted value option | Lump sum option in lieu of annuity; must be elected at retirement |

**Commuted Value Planning:** If taking a commuted value, the YMPE-based portion can transfer directly to an LIRA; excess is taxable. Often not advantageous for older or ill members.

---

## PART 2: ONTARIO TAX FRAMEWORK (2026)

### 2.1 Federal Tax Brackets (2026)

| Taxable Income | Federal Marginal Rate |
|---|---|
| $0 – $58,523 | 15.0% |
| $58,523 – $117,045 | 20.5% |
| $117,045 – $161,733 | 26.0% |
| $161,733 – $230,451 | 29.0% |
| Over $230,451 | 33.0% |

- **Basic Personal Amount (2026):** $16,129 (base); phases out for income above $181,440, eliminated at $258,482
- **Age Amount (Federal):** ~$8,790 maximum; begins to phase out at ~$46,432 net income; eliminated at ~$107,819
- **Pension Income Amount:** $2,000 credit available at age 65+ for RRIF/annuity/pension income

---

### 2.2 Ontario Provincial Tax Brackets (2026)

| Taxable Income | Ontario Marginal Rate |
|---|---|
| $0 – $52,886 | 5.05% |
| $52,886 – $105,775 | 9.15% |
| $105,775 – $150,000 | 11.16% |
| $150,000 – $220,000 | 12.16% |
| Over $220,000 | 13.16% |

- **Ontario indexation factor (2026):** 1.9% increase applied to most brackets
- **$150,000 and $220,000 brackets are NOT indexed** (politically set; drag more income into higher brackets over time)
- **Ontario Surtax:** 20% on provincial tax above ~$5,315 + 36% on provincial tax above ~$6,802
- **Ontario Health Premium:** $0–$900 on taxable income over $20,000
- **Ontario Low-Income Tax Reduction:** No provincial tax for taxable income up to ~$18,930

---

### 2.3 Combined Marginal Tax Rates (Ontario, 2026)

| Approximate Income Range | Combined Federal + Ontario Rate |
|---|---|
| $0 – $52,886 | ~20.05% |
| $52,886 – $58,523 | ~24.15% |
| $58,523 – $105,775 | ~29.65% |
| $105,775 – $117,045 | ~31.48% |
| $117,045 – $150,000 | ~33.89% → 43.41% (surtax creates layers) |
| $150,000 – $220,000 | ~46.41% |
| Over $220,000 | ~53.53% (highest) |

**Dashboard Insight:** The "sweet spots" for tax-efficient RRSP/RRIF withdrawals in Ontario are keeping income under $58,523 (below second federal bracket), under $93,454 (protect full OAS), or the $105,775 provincial threshold.

---

### 2.4 Key Tax Credits & Deductions for Retirees

| Credit/Deduction | 2026 Amount/Notes |
|---|---|
| Basic Personal Amount (federal) | ~$16,129 |
| Age Amount (federal, max) | ~$8,790 (phases out at $46,432 net income) |
| Pension Income Amount (federal) | $2,000 |
| Basic Personal Amount (Ontario) | ~$11,141 |
| Age Amount (Ontario, max) | ~$5,725 |
| Ontario Senior Homeowners' Property Tax Grant | Up to $500 |
| Medical Expense Credit | Amounts exceeding 3% of net income |
| Disability Tax Credit | If applicable |
| Charitable Donation Credit | 14% federal on first $200; 29%/33% on amounts over $200 |

**Pension Income Splitting (Form T1032):**
- Up to 50% of eligible pension income at 65+ can be allocated to lower-income spouse
- Eligible income: RRIF, LIF, annuity, employer DB pension
- CPP is NOT eligible for pension income splitting (CPP sharing is separate and uses different CRA formula)
- Both spouses file the election annually; it's reversible

---

### 2.5 Capital Gains Rules (2026)

```
Gains up to $250,000 (individual, annual):
    Taxable amount = Gain × 50%

Gains above $250,000 (effective Jan 1, 2026):
    Taxable amount = $125,000 + (Excess gain × 66.67%)

Tax owing = Taxable amount × applicable marginal rate
```

- **Principal Residence Exemption:** Tax-free gain on qualifying principal residence
- **Deemed disposition at death:** All capital property deemed sold at FMV; registered accounts fully included in income
- **Spousal rollover:** Assets can transfer to surviving spouse on a tax-deferred basis (automatic unless opted out)
- **Lifetime Capital Gains Exemption:** $1,250,000 for QSBC shares and qualifying farm/fishing property

---

## PART 3: SNAP PROJECTIONS SOFTWARE — COMPREHENSIVE GUIDE

### 3.1 Company Overview

| Attribute | Detail |
|---|---|
| Software type | Cloud-based financial planning software (Canadian-specific) |
| Primary users | Financial advisors, planners, investment managers |
| Ownership | Acquired by CI Financial / WealthBar (October 2019) |
| Plans built | 50,000+ financial plans on the platform |
| Overall rating | 4.9/5.0 (Capterra, 23 verified reviews) |
| Support | 1-888-758-7977 Opt. 1 (9am–6pm ET weekdays) |
| FP Canada integration | Incorporates FP Canada Projection Assumption Guidelines (as of May 1, 2025) |
| Language | English and French (French dashboard officially in progress as of 2025) |

**Core Philosophy:** Transparency in calculations — advisors can see and audit exactly how every number is generated. Unlike black-box tools, Snap exposes its logic so advisors can verify and explain any number to a client.

---

### 3.2 Key Features & Capabilities

**1. Comprehensive Cash-Flow Planning**
Year-by-year projection of income, expenses, taxes, and account balances for every year of retirement. Handles complex multi-account, multi-income scenarios with full tax modeling.

**2. Goals-Based Planning**
Set retirement spending targets and track whether the plan funds them. Immediate visual feedback on whether goals are achievable and at what probability.

**3. Scenario Comparison**
Compare up to 5 scenarios side-by-side with customizable tables and charts. Key comparison metrics: estate value, total taxes paid, total after-tax income, sustainability age.

**4. Stress Testing (Paid Add-On)**
- Apply historical market return sequences to model sequence-of-returns risk
- Monte Carlo simulation with randomly generated returns
- Range of potential outcomes (best/worst/median percentile bands)
- Stress test add-on: $9/month ($8/month billed annually)

**5. Taxable Income Targeting (Key Tax Planning Feature)**
- Define a target taxable income for specific years
- Software automatically adjusts withdrawals from registered, non-registered, or TFSA to hit target
- Saves significant advisor time on manual adjustments
- Common use cases: cap income below OAS clawback threshold ($95,323); stay in lower marginal bracket; model early RRSP drawdown windows

**6. AI Data Assist (2025 Feature)**
- Import client documents to eliminate manual data entry
- AI reads existing plan data or client-provided documents and populates fields
- Reduces setup time and data entry errors
- Additional tokens available for purchase

**7. Insurance Modelling**
Life, Critical Illness, and Disability insurance illustrations within financial projections. Supports insurance needs analysis reports.

**8. Corporate Planning Module**
Separate add-on for incorporated clients. Not bundled with base plan.

**9. SnapShot Report**
One-page executive summary for client presentations. Branded with advisor logo/colors.

**10. Interactive Charts & Presentations**
Full-screen charts; selectable/deselectable data series; real-time adjustments during client meetings.

**11. Expenses Module (2025 Enhancement)**
Transparent and highly customizable expense input. Both base expenses and additional expenses with full visibility into year-by-year cash flow.

---

### 3.3 Snap Projections Pricing (2025–2026)

| Plan Tier | Target User | Key Inclusions |
|---|---|---|
| Individual advisor | Single advisors | Full planning, scenario comparison, reports |
| Team / Enterprise | Multi-advisor firms | Shared client access, team management |
| Paraplanning Service | Advisors who outsource plan building | $499/month subscription; 3 credits/month |
| Corporate Add-On | Clients with corporations | Separate fee; corporate projections and integration |
| Stress Testing Add-On | Any plan | $9/month ($8/month annual) |

**Paraplanning Service Details:**
- Standard plan (individual/couple): $499 (1 credit)
- Complex plan (with corporations, multiple rentals, less common registered assets): $998 (2 credits)
- Plan Review: 1.5 credits
- Includes up to 3 scenarios per plan
- Additional credits at $499 for 3 credits
- Ideal for solo advisors or fee-for-service planners who need occasional plan creation support

---

### 3.4 Data Input Structure (Step-by-Step Setup)

Snap uses a logical 8-page setup flow before entering the Planning Page:

#### Page 1 — Client Information
- Full names, dates of birth, province of residence
- Add spouse for couple planning (couples have individual and combined views)

#### Page 2 — General Settings & Assumptions
- Retirement age for each spouse (triggers income cutoff)
- Inflation rate assumption
- Default rates of return by asset class (cash, fixed income, equities)
- Option to import FP Canada Projection Assumption Guidelines
- Projection start year (current or following year)

#### Page 3 — Income Sources
- Employment income with start/end dates
- DB pension (amount, start age, indexation type, bridge benefit, survivor benefit)
- DC pension details
- Rental income
- CPP settings: start age, estimated amount (% of maximum or dollar amount)
- OAS settings: start age, estimated amount

#### Page 4 — Expenses
- Base expenses (essential monthly/annual living costs)
- Additional expenses (one-time costs: travel budget, home renovations, car purchases, gifts to children)
- For couples: combined expenses or allocation per spouse
- Expenses Module: highly granular line-item budgeting available

#### Page 5 — Financial Assets (Six Tabs)

| Tab | What's Entered |
|---|---|
| Assets | All accounts: RRSP, TFSA, Non-Registered, joint or individual |
| TFSA | Contribution room, cumulative unused room |
| RRSP/RRIF | Contribution room, Pension Adjustments, RRIF conversion age, younger-spouse election |
| DCPP/LIRA/LIF | Conversion ages, jurisdiction (Ontario rules), unlocking preferences |
| FHSA | Opening age, carryforward room, lifetime contributions to date |
| Employer Matching | Employer and employee contribution percentages, matching limits |

**For each financial asset:**
- Current balance (as of beginning of projection year)
- Asset allocation (% cash, fixed income, equities)
- Adjusted Cost Base (for non-registered accounts)
- Rate of return by asset class
- Account ownership (individual or joint)

#### Page 6 — Real Assets
- Principal residence (current market value, mortgage balance, expected sale)
- Rental/investment properties (value, mortgage, rental income, expenses)
- Other real property
- Downsizing plans with year and net proceeds

#### Page 7 — Debts
- Balance, interest rate, remaining amortization
- Monthly payment amount
- Tax-deductibility of interest
- Payoff dates

#### Page 8 — Insurance (Optional)
- Life insurance (term/permanent, face value, premiums, beneficiary designation)
- Critical illness insurance
- Disability insurance

---

### 3.5 The Planning Page — Central Workspace

The Planning Page is where year-by-year projections are viewed and managed.

**Layout:**
- Rows: Individual income sources, accounts, taxes, expenses, cash balance
- Columns: Each projection year (e.g., 2026, 2027, ... 2060)
- Individual view per spouse + Combined view
- Financial Assets section expandable to show contributions/withdrawals per account

**Key Rows on Planning Page:**
- All income sources (Employment, DB Pension, CPP, OAS, RRIF withdrawal, TFSA withdrawal, Non-Registered income)
- Cash Expenses row (total outflow)
- Tax row (total income taxes paid each year — federal + provincial)
- Cash Balance row (surplus or shortfall each year)
- Estate Value row (total projected net worth)

**Override System:**
- Manual entries highlighted in yellow for easy identification
- "Copy Down" function: apply a single year's override to all subsequent years
- Keyboard shortcuts for efficient data entry
- Hover functionality: see contribution/withdrawal limits for registered accounts each year

---

### 3.6 Cash Flow Management (CFM) — Decumulation Strategy

**Default CFM Withdrawal Order (Decumulation):**
`Non-Registered → TFSA → Registered (RRSP/RRIF)`

Displayed in Snap as: **N → T → R**

**Rationale for Default Order:**
1. Non-registered first: income types like capital gains and dividends already have lower effective tax rates; drawing these first preserves registered shelters
2. TFSA second: tax-free; protecting TFSA until later reduces OAS clawback risk
3. Registered last: RRIF minimums always enforced regardless of order

**When to Override the Default:**
- RRSP Meltdown strategy: intentionally accelerate RRIF withdrawals early (reverse order in some years)
- Tax bracket management: fill up lower brackets with RRIF income before government benefits begin
- OAS clawback avoidance: switch to TFSA when RRIF income would push income above $95,323

**Default CFM Contribution Order (Accumulation/Surplus):**
`RRSP (maximize) → TFSA (maximize) → Non-Registered`

**Customization:**
- Advisors set CFM order per year using the CFM Order column (blue gear icon in Financial Assets column header)
- Full flexibility to set different strategies in different years

---

### 3.7 Taxable Income Targeting — Automated Tax Planning

This is Snap's signature automation feature for tax-efficient retirement planning.

**How It Works:**
1. Advisor sets a target taxable income for a specific year (e.g., $58,000 to stay under the 20.5% federal bracket)
2. Snap automatically adjusts cash flows — managing withdrawals from registered, non-registered, and TFSA accounts — to keep income as close to that target as possible
3. Surplus income is automatically reinvested per the CFM order
4. The logic is fully transparent and auditable

**Common Target Levels for Ontario Couples:**
| Target | Purpose |
|---|---|
| < $52,886 | Stay below Ontario second bracket (9.15%) |
| < $58,523 | Stay below federal second bracket (20.5%) |
| < $93,454–$95,323 | Avoid OAS clawback |
| ~$105,775 | Stay below Ontario third bracket |

**Parallel Wealth Application:** Adam Bornn sets taxable income targets in the RRSP meltdown window (ages 60–69) to aggressively draw down registered accounts while CPP/OAS are deferred, filling the lower brackets every year until the RRIF is at a manageable level.

---

### 3.8 Scenario Comparison & Reporting

- Up to **5 scenarios** compared side-by-side
- Comparison metrics: Estate value, total lifetime taxes paid, total after-tax income, plan sustainability age
- **Report types:**
  - SnapShot: One-page executive summary
  - Full customized branded report (logo, colors, charts, assumption tables)
  - Excel export of the plan
  - Charts: Full-screen interactive; select/deselect data series
- Reports designed for non-technical client audiences

---

### 3.9 Snap Projections Tax Calculations

Snap calculates taxable income each year including:
- Employment income, pension income (DB, RRIF, LIF, CPP, OAS)
- Withdrawals from registered assets (RRSP, non-qualifying FHSA)
- Non-registered investment income (interest, eligible and non-eligible dividends, capital gains)
- OAS clawback (displayed as a deduction from OAS)
- All applicable federal and Ontario credits

The software automatically applies:
- Age amounts (federal and provincial)
- Pension income credits
- Basic personal amounts
- Pension income splitting (if configured)
- OAS clawback calculation

---

## PART 4: PARALLEL WEALTH — METHODOLOGY & APPROACH

### 4.1 Company Overview

| Attribute | Detail |
|---|---|
| Founded | 2006 by Adam Bornn, CFP® CLU® |
| Focus | Exclusively retirement planning (pre-retirement and retirement) |
| Locations | Greater Vancouver, Calgary, Greater Toronto (coast to coast) |
| Credentials | All CFP®; many also hold CLU® and CIM® |
| Planning software | Snap Projections for all plans |
| YouTube | @ParallelWealth (138,000+ subscribers) |
| Podcast | "Retirement Unpacked" (weekly, Spotify and Apple Podcasts) |
| Service model | Fee-for-service (one-time) AND Retirement Income Program™ (ongoing) |

---

### 4.2 Service Offerings

#### Fee-For-Service Retirement Planning (One-Time)
- **Household / Individual Plan:** ~$4,000; designed for couples/individuals within 2 years of retirement or already retired
- **Corporate / Rental Plan:** For those 2+ years from retirement OR with multiple properties/corporations
- **Plan Update:** $750 for a full recalculation after major life event or plan delivery
- **Target client:** Any Canadian couple wanting a comprehensive one-time retirement roadmap

#### Retirement Income Program™ (RIP) — Ongoing Service
- Ongoing investment management + financial planning
- Annual plan review and updates
- Managed portfolio (likely model portfolios using ETFs)
- Integration of all accounts into a unified retirement strategy
- Designed for clients who want professional ongoing management post-retirement

---

### 4.3 The Parallel Wealth Planning Process

#### Phase 1 — Data Gathering
- Client completes a comprehensive Financial Planning Questionnaire
- Documents collected: tax returns (last 2 years), all account statements, pension documents, insurance policies, property info, debt summaries
- No templates or preconceived assumptions — every plan is built from scratch

#### Phase 2 — Plan Construction in Snap Projections
- Data entered into Snap Projections
- Primary focus: optimize income streams AND minimize lifetime tax liability
- Plans are both data-driven and goal-oriented
- Year-by-year cash flow projections for both spouses
- Default scenario (baseline / no tax planning) built first, then optimization scenarios

#### Phase 3 — Plan Preview
- A "Plan Preview" video is sent to clients approximately 1 week before the main meeting
- Allows clients to review high-level findings before the live walkthrough
- Reduces meeting time on orientation; more time for questions and refinements

#### Phase 4 — Plan Presentation (1-Hour Zoom)
- Walk through plan in detail with the assigned CFP®
- Real-time adjustments based on questions
- Scenario comparisons presented

#### Phase 5 — Plan Delivery (Within 1 Week of Meeting)
- Retirement Guide document (PDF, branded)
- Finalized Retirement Plan in PDF format (full Snap Projections report)
- Finalized Retirement Plan in Excel format (simplified account balances, returns, deposits/withdrawals)
- Video walkthrough of the plan PDF
- 11 implementation videos showing exactly how to execute each step

---

### 4.4 Core Planning Strategies

#### Strategy 1: The RRSP Meltdown (Signature Strategy)

This is the central strategy Parallel Wealth recommends for most Canadian retirees with meaningful RRSP/RRIF balances.

**The Problem It Solves:**
- RRIF balances at death are 100% included in the deceased's income in the final year — at the highest marginal rate
- Mandatory RRIF minimum withdrawals accelerate from 5.28% at 71 to 20% at 95+
- Without planning, a $600,000 RRIF becomes a $200,000+ tax bill at death

**How It Works:**
1. Convert RRSP to RRIF early (before mandatory age 71 — even in the 60s)
2. Aggressively draw down registered accounts while income is low (before CPP/OAS at 70)
3. Fill lower tax brackets with RRIF withdrawals each year (e.g., $58,000–$70,000/year)
4. Pair with delayed CPP (to age 70) and delayed OAS — creates a multi-year window of lower income
5. Reinvest surplus withdrawals into TFSA (maximizing contribution room)
6. Reinvest additional surplus into non-registered accounts
7. Target: Registered account balance reduced to ~$0 by approximately age 83–84

**Results by Life Expectancy (86–87):**
- Registered accounts depleted → no estate tax hit
- Income primarily from CPP + OAS (42% more CPP, indexed for life) + TFSA (tax-free)
- Hundreds of thousands more in CPP/OAS benefits collected vs. early CPP start
- Massive reduction in lifetime taxes paid
- Higher surviving spouse income due to CPP deferral

**Why It Works Mathematically:**
| Without Strategy | With RRSP Meltdown |
|---|---|
| CPP at 65, OAS at 65 | CPP at 70, OAS at 70 |
| RRSP largely intact at 71; RRIF mandatory minimums begin | RRSP drawn down systematically; smaller RRIF at 71 |
| Large RRIF at death → estate pays 40%–53% marginal rate | Small or zero RRIF at death → estate saves $100,000–$300,000 |
| Lower CPP/OAS (lifetime) | 42% more CPP, 36% more OAS for life |
| Higher OAS clawback risk | Lower OAS clawback (TFSA-sourced income) |

---

#### Strategy 2: Laddered Income (Three Phases of Retirement)

Based on the well-documented behavioral reality that spending naturally declines with age:

| Phase | Typical Ages | Label | Spending Level |
|---|---|---|---|
| Phase 1 | Retirement to ~75 | **Go-Go** | Highest — travel, hobbies, bucket list |
| Phase 2 | ~76 to ~85 | **Slow-Go** | Moderate — some travel, scaled back activities |
| Phase 3 | ~86+ | **No-Go** | Lowest — basic living expenses; potential care costs |

**Implementation in a Plan:**
- Go-Go: e.g., $80,000–$90,000/year after-tax
- Slow-Go: e.g., $65,000–$70,000/year
- No-Go: e.g., $55,000–$60,000/year (with care facility buffer from home equity)
- Real estate equity (home) serves as emergency backstop for care facility or home care costs
- The plan is stress-tested to ensure sufficient income at every phase

---

#### Strategy 3: The Cash Flow Wedge

**Purpose:** Protect against sequence-of-returns risk in early retirement.

**How It Works:**
1. Maintain 2–3 years of living expenses in cash/GICs ("the wedge")
2. Remainder of portfolio invested in growth-oriented assets
3. During market downturns: draw from the cash wedge instead of selling investments at depressed prices
4. Refill the wedge during market recovery or from natural income (dividends, interest, CPP, OAS)

**Why It Matters:**
- A 30% market decline in year 2 of retirement can permanently impair a plan that doesn't have cash reserves
- The cash wedge prevents forced selling — the single most damaging event in retirement investing
- Snap Projections stress testing validates whether the wedge strategy is sufficient under historical worst-case scenarios

---

#### Strategy 4: Income Splitting Optimization

**Goal:** Keep both spouses in the same (lower) tax bracket; both below OAS clawback threshold ($95,323).

**Tools Available:**
| Tool | Mechanism | Eligible Age |
|---|---|---|
| Pension Income Splitting | T1032: allocate up to 50% of eligible pension income to spouse | 65+ |
| CPP Sharing | CRA formula: redistribute CPP based on cohabitation period | 60+ |
| Spousal RRSP | High-income spouse contributes; low-income spouse withdraws | Any age |
| Spousal RRIF | Income splitting via spousal RRSP converted to RRIF | 65+ (for splitting) |
| LIF Income Splitting | LIF income qualifies for pension income splitting | 65+ |

**Ontario Couple Example Benefit:**
If Spouse A has $90,000 taxable income and Spouse B has $40,000:
- Without splitting: A pays ~26%+ marginal rate; combined tax ~$25,000
- With splitting (transfer $25,000): A pays $65,000 (~20.5%), B pays $65,000 (~20.5%)
- Annual tax saving: potentially $4,000–$8,000; lifetime saving: $100,000+

---

#### Strategy 5: Estate Planning Through Tax Efficiency

- Strategic RRIF drawdown reduces estate tax liability at death
- TFSA preservation (no tax on death; passes to beneficiary or successor holder tax-free)
- Life insurance to equalize estate (particularly if one spouse has a large LIRA/non-registered balance)
- Spousal rollovers (defer tax on registered accounts to surviving spouse)
- Power of Attorney and Trusted Contact designations
- Beneficiary designations on RRSP/RRIF/TFSA override the will — keep updated

---

### 4.5 Standard Scenario Structure (Every Parallel Wealth Plan)

Every Parallel Wealth plan includes the default scenario plus two custom scenarios:

| Scenario | Description |
|---|---|
| 1. Default (Baseline) | No active tax planning; serves as comparison baseline |
| 2. Net 0% Rate of Return | Tests plan sustainability if all investments earn nothing — "worst case floor" |
| 3. Custom What-If | Tailored to client's primary concern (e.g., early death of spouse, market crash, helping children financially) |

---

### 4.6 Key YouTube Content Themes (@ParallelWealth — 138,000+ subscribers)

**RRSP / RRIF Strategies:**
- "Copy This RRSP Meltdown Strategy, It Will Save You Thousands" (March 2026)
- "The RRSP Meltdown Strategy 99% Of Canadians Should Use (Save Thousands)" (March 2025)
- "Was I Wrong About The RRSP Meltdown?"
- "When Is The Best Time To Start An RRSP Meltdown?" (Retirement Unpacked Ep. 030)
- "Too Much RRSP? RRIF Withdrawals, CPP Rumours, & Retirement Tax Strategies" (Retirement Unpacked Ep. 3)

**CPP / OAS Timing:**
- "If You're Retiring Early, What Happens To Your CPP?" (Retirement Unpacked Ep. 031)
- CPP timing optimization (when to start for maximum lifetime benefit)
- Deferred OAS strategies

**Tax Planning:**
- "The OAS Surprise That Can Cost Canadians Thousands" (Retirement Unpacked Ep. 025)
- "Big RRSP Problems, OAS Clawback, & Drawdown Tips" (Retirement Unpacked Ep. 012)
- Pension income splitting mechanics

**Comprehensive Planning:**
- "Master Canadian Retirement Planning In 36 Minutes"
- "This Tool Will Save You THOUSANDS In Retirement"
- Decumulation 101, LIRA Unlocking, & Reverse Mortgage (Retirement Unpacked Ep. 5)

**Podcast "Retirement Unpacked" — Weekly Episodes (Adam Bornn + Brett):**
- CPP and OAS Security, RRIF Taxes, Estate Planning (Ep. 011)
- TFSA Timing Tips, RRSP Drawdowns, & CPP Survivor Rules (Ep. 004)
- Retirement Spending, RRSP Deductions & TFSA Strategy (Ep. 002)

**Other Resources:**
- Sample plans: parallelwealth.com/sample-plans
- Masterclass: parallelwealth.com/masterclass (10+ modules, 100+ videos)
- Free tools: parallelwealth.com/tools
- Retirement Ready Assessment: parallelwealth.com/retirementready

---

## PART 5: DATA REQUIRED FOR A COMPREHENSIVE RETIREMENT PLAN

### 5.1 Complete Client Information Checklist (Per Spouse)

#### Personal Information
- [ ] Full legal name
- [ ] Date of birth
- [ ] Province of residence (Ontario)
- [ ] Expected retirement age (or current retirement status)
- [ ] Planning life expectancy assumption
- [ ] Any health conditions that would affect longevity assumption

#### Current Income Sources
- [ ] Employment income (gross annual)
- [ ] Self-employment income
- [ ] Rental income (gross; net after expenses)
- [ ] DB pension details (annual amount, start age, indexation %, bridge benefit, survivor benefit %)
- [ ] DC pension current balance and employer matching details
- [ ] Other income sources (e.g., alimony, royalties, side business)

#### Government Benefits
- [ ] CPP Statement of Contributions (download from My Service Canada Account)
- [ ] Estimated CPP at age 65 (% of maximum or dollar amount; use cppcalculator.com for accuracy)
- [ ] Preferred CPP start age (60–70)
- [ ] Years of Canadian residency after age 18 (for OAS eligibility)
- [ ] Preferred OAS start age (65–70)

#### Registered Accounts
- [ ] RRSP balance (each account separately if multiple)
- [ ] RRSP unused contribution room (from current year Notice of Assessment)
- [ ] Spousal RRSP balance (if any; who is the annuitant?)
- [ ] TFSA balance
- [ ] TFSA unused contribution room
- [ ] LIRA balance and jurisdiction (Ontario rules apply)
- [ ] FHSA balance and room (if applicable)
- [ ] RESP balance (if still applicable)
- [ ] DCPP balance and employer matching rate

#### Non-Registered / Taxable Accounts
- [ ] Investment account balances (by account and institution)
- [ ] Asset allocation (% stocks / bonds / cash / GICs / real estate)
- [ ] Adjusted Cost Base (ACB) for each investment account
- [ ] Savings account and GIC balances

#### Real Assets
- [ ] Principal residence (current market value, remaining mortgage balance)
- [ ] Rental/investment properties (value, mortgage, rental income, operating expenses)
- [ ] Other real property (cottage, land, etc.)
- [ ] Plans to downsize or sell property (approximate year + net proceeds estimate)

#### Debts
- [ ] Mortgage balance, rate, amortization remaining, monthly payment
- [ ] Home Equity Line of Credit (HELOC) balance and rate
- [ ] Car loans (balance, rate, monthly payment, payoff date)
- [ ] Other debts

#### Insurance Policies
- [ ] Life insurance: type (term/permanent/UL), face value, annual premium, beneficiary
- [ ] Critical illness insurance: coverage amount, premium
- [ ] Disability insurance: benefit amount, elimination period, definition (own-occ vs. any-occ)
- [ ] Long-term care insurance (if any)

#### Expenses
- [ ] Current annual living expenses (total household)
- [ ] Breakdown: essential (housing, food, utilities) vs. discretionary (travel, dining, entertainment)
- [ ] Expected retirement spending by phase:
  - Go-Go (current age to ~75): $______/year
  - Slow-Go (~76–85): $______/year
  - No-Go (~86+): $______/year
- [ ] One-time anticipated expenses with year and amount (home renovation, vehicle, gifts to children, travel bucket list)
- [ ] Extended healthcare costs not covered by OHIP (dental, vision, paramedical, private insurance premium)

#### Goals & Preferences
- [ ] Desired retirement lifestyle description
- [ ] Legacy / estate goals (leave a specific dollar amount? Just "don't run out"?)
- [ ] Charitable giving intentions (annual amount? Endowment? Foundation?)
- [ ] Risk tolerance (conservative / balanced / growth)
- [ ] Comfort level with portfolio volatility
- [ ] Primary concern (running out of money? Taxes? Helping children? Leaving estate?)

---

### 5.2 Key Projection Assumptions

| Assumption | Conservative | Moderate | Aggressive | FP Canada Guideline |
|---|---|---|---|---|
| Inflation rate | 2.0% | 2.5% | 3.0% | ~2.0–2.5% |
| Rate of return — equities | 4.5% | 6.0% | 7.5% | After fees; varies by mandate |
| Rate of return — fixed income | 2.0% | 3.0% | 4.0% | After fees |
| Rate of return — cash/GICs | 1.5% | 2.5% | 3.5% | Current rates |
| Life expectancy | 90 | 93 | 95 | Plan to 90 minimum; 95 recommended |
| Real estate appreciation | 1.5% | 2.5% | 4.0% | Varies by market |
| CPP / OAS indexation | CPI-linked | CPI-linked | CPI-linked | Automatic |

**Dashboard Note:** Build sliders/inputs for inflation rate (1.5%–4.0%), rate of return (2.0%–9.0%), and life expectancy (85–100) as key interactive controls.

---

## PART 6: KEY CALCULATIONS & FORMULAS

### 6.1 CPP Benefit Adjustment

```
Early claim (before 65):   Age 65 benefit × (1 − 0.006 × months_before_65)
Late claim (after 65):     Age 65 benefit × (1 + 0.007 × months_after_65)

Benefit at age 60:  64% of age-65 amount
Benefit at age 65:  100% of calculated amount
Benefit at age 70:  142% of age-65 amount
```

### 6.2 RRIF Minimum Withdrawal

```
Age ≤ 71:         1 ÷ (90 − age), expressed as decimal
Age 72 and above: Prescribed rate from schedule (see Part 1.2 table)
Age 95+:          20.00% fixed

Annual minimum = RRIF FMV on January 1 × prescribed rate
```

### 6.3 OAS Clawback (Recovery Tax)

```
Recovery Tax = (Net income − $95,323) × 0.15   [2026 threshold]
Full clawback at ~$154,708 (ages 65–74)
Full clawback at ~$157,923 (ages 75+)

Monthly OAS reduction = Recovery Tax ÷ 12
```

### 6.4 Pension Income Splitting (Form T1032)

```
Eligible pension income (at 65+):  RRIF, LIF, annuity, DB pension
Maximum amount transferable:       50% of eligible pension income
Tax outcome:  Each spouse includes their allocated share on their tax return
```

### 6.5 Capital Gains Tax (2026)

```
Gains ≤ $250,000 (individual, annual):
    Taxable amount = Gain × 50%

Gains > $250,000 (effective Jan 1, 2026):
    Taxable amount = $125,000 + (Excess × 66.67%)

Tax = Taxable amount × applicable marginal tax rate
```

### 6.6 TFSA Contribution Room Tracking

```
Available room = (Sum of annual limits since 18 or 2009, whichever is later)
                 − (Total contributions ever made)
                 + (Total withdrawals from prior years)

Room does NOT reset at calendar year-end for new contributions — it accumulates
Withdrawals re-added to room on January 1 of following year
Over-contribution penalty: 1% per month on excess
```

### 6.7 Marginal Tax Rate Tiers (Ontario, 2026)

```
Function marginalRate(income):
    if income <= 52,886:   rate = 20.05%
    elif income <= 58,523: rate = 24.15%
    elif income <= 105,775: rate = 29.65%
    elif income <= 117,045: rate = 31.48%
    elif income <= 150,000: rate = ~33.89%–43.41% (surtax zone)
    elif income <= 220,000: rate = ~46.41%
    else:                   rate = ~53.53%
```

---

## PART 7: DASHBOARD DESIGN REFERENCE

### 7.1 Format & Architecture

| Layer | Technology | Purpose |
|---|---|---|
| Data Input / Database | Excel (.xlsx) | All client inputs, assumptions, account balances, year-by-year projections |
| Presentation / Visualization | Interactive HTML + JavaScript | Charts, sliders, scenario views, user controls |
| Interactivity | JavaScript (Chart.js, D3, or Recharts) | Real-time chart updates when inputs change |
| Calculation Engine | Excel formulas (or JavaScript mirroring Excel) | Tax calculations, account projections, income modeling |

---

### 7.2 Required Visualizations (Priority Order)

**1. Year-by-Year Cash Flow Timeline (Primary Chart)**
- Stacked bar: CPP, OAS, DB Pension, RRIF/RRSP, TFSA, Non-Registered, Employment
- Overlay line: Annual Expenses
- Color-coded by income source
- Show surplus/deficit below chart

**2. Account Balance Projections**
- Line chart per account: RRSP/RRIF, TFSA, Non-Registered, Total Portfolio
- Shows depletion of RRIF (RRSP meltdown effect) while TFSA grows
- Estate value line (includes real estate)

**3. Tax Paid Per Year**
- Bar chart: Annual taxes paid (federal + Ontario)
- Overlay: Effective tax rate % (right axis)
- Show marginal rate for each year as tooltip

**4. Income Composition Over Time**
- Stacked area chart showing proportion of income from each source year-by-year
- Highlights the transition: Employment → Registered → CPP/OAS/TFSA

**5. Scenario Comparison Table**
- Side-by-side: Scenario A vs. B vs. C
- Metrics: Total lifetime taxes, estate value at 90, sustainability age, CPP/OAS total collected, RRIF balance at death

**6. OAS Clawback Tracker**
- Income line vs. $95,323 clawback threshold
- Shade area above threshold to show clawback impact
- Toggle: Show what happens with different CPP start ages

**7. RRSP Meltdown Visualization**
- Two lines: RRIF balance with meltdown vs. without meltdown
- Area showing cumulative tax saved
- Highlights depletion target (~age 83–84)

**8. Estate Value Over Time**
- Net estate: total assets − liabilities − estimated tax on death
- Shows RRIF estate tax liability as distinct component

**9. Laddered Income Chart**
- Three-phase shading: Go-Go / Slow-Go / No-Go
- Spending lines per phase vs. income available
- Visual confirmation that income covers spending in each phase

**10. CPP/OAS Timing Comparison**
- Bar chart: Total CPP/OAS collected from age 60/65/70 to life expectancy
- Break-even analysis: What age do you break even on deferral?

**11. Stress Test / Monte Carlo Results (if included)**
- Fan chart showing range of outcomes (10th/50th/90th percentile portfolio value)
- "Probability of not running out of money" metric
- Historical sequence-of-returns overlay

**12. Pension Income Splitting Impact**
- Before/after table: Tax paid by each spouse without splitting vs. with 50% split
- Annual saving + lifetime saving

---

### 7.3 Interactive Dashboard Controls

| Control | Type | Range / Options |
|---|---|---|
| Retirement age — Person 1 | Slider | 55–70 |
| Retirement age — Person 2 | Slider | 55–70 |
| CPP start age — Person 1 | Dropdown/Slider | 60, 61, 62 ... 70 |
| CPP start age — Person 2 | Dropdown/Slider | 60, 61, 62 ... 70 |
| OAS start age — Person 1 | Dropdown/Slider | 65, 66 ... 70 |
| OAS start age — Person 2 | Dropdown/Slider | 65, 66 ... 70 |
| Annual spending (Go-Go) | Number input / slider | $40,000–$150,000 |
| Annual spending (Slow-Go) | Number input / slider | $30,000–$120,000 |
| Annual spending (No-Go) | Number input / slider | $25,000–$100,000 |
| Rate of return | Slider | 1.0%–10.0% |
| Inflation rate | Slider | 1.0%–5.0% |
| Life expectancy (planning to) | Slider | 85–100 |
| RRSP meltdown toggle | On/Off toggle | On = accelerate; Off = minimum only |
| Pension income splitting | On/Off toggle | On = split 50%; Off = no split |
| One-off expense | Year + Amount input | Any year; $0–$500,000 |
| Scenario selector | Tab or dropdown | Scenario A / B / C |
| Downsize home | Toggle + Year + Net Proceeds | Optional event |

---

### 7.4 Excel Database (Backend) — Sheet Structure

| Sheet Name | Contents |
|---|---|
| **Inputs** | All client data, dates of birth, account balances, ACB, income sources |
| **Assumptions** | Rates of return, inflation, life expectancy, CPP/OAS amounts |
| **CPP_OAS_Calc** | Year-by-year CPP and OAS calculation with timing adjustment |
| **Tax_Calc** | Annual taxable income, marginal rate, taxes payable, credits |
| **RRSP_RRIF** | Year-by-year balance, contributions, withdrawals, minimums |
| **TFSA** | Year-by-year balance, contributions, withdrawals, room tracking |
| **NonReg** | Year-by-year balance, ACB, capital gains, withdrawals |
| **Pension_DB** | DB pension amounts, bridge benefit, survivor benefit |
| **Expenses** | Laddered expenses by phase (Go-Go / Slow-Go / No-Go) + one-offs |
| **CashFlow** | Master year-by-year: all income, expenses, taxes, surplus/shortfall |
| **Estate** | Net estate value per year: all accounts + real estate − debt − tax |
| **Scenarios** | 3–5 named scenarios pulling from Inputs with different assumption sets |
| **Summary** | Lifetime metrics: total taxes, total income, estate at death, sustainability |
| **Charts_Data** | Clean tables feeding HTML charts (export-ready format) |

---

### 7.5 Key Performance Metrics to Display on Dashboard

| Metric | Description |
|---|---|
| Plan Sustainability Age | Age at which portfolio reaches $0 (the most important single number) |
| Total Lifetime After-Tax Income | Sum of all after-tax income from retirement to life expectancy |
| Total Lifetime Taxes Paid | Sum of all taxes paid from retirement to life expectancy |
| Net Estate Value at 90 | What's left after all accounts, real estate, minus deferred taxes |
| RRIF Balance at Life Expectancy | Remaining registered balance (estate tax implication) |
| OAS Clawback Total | Total OAS lost to recovery tax across all years |
| Effective Tax Rate (Annual + Average) | Taxes / Total income |
| CPP + OAS Total Collected | Total government benefits received over lifetime |
| Annual Cash Surplus / Deficit | Year-by-year cash balance after expenses and taxes |
| Income Replacement Ratio | Retirement income as % of pre-retirement income |

---

## PART 8: IMPORTANT NOTES FOR DASHBOARD DEVELOPMENT

### 8.1 Data Validation Requirements

- RRIF minimum withdrawal must always be enforced (cannot go below minimum)
- TFSA over-contribution must be flagged (1% penalty per month on excess)
- OAS deferral: cannot start before 65; maximum deferral to 70
- CPP deferral: can start at 60; maximum deferral to 70
- Spousal RRSP attribution: withdrawals within 3 calendar years of last contribution are attributed to contributor
- RRSP conversion to RRIF by December 31 of year turning 71 (must enforce this timeline)
- Pension income splitting only available at 65+ (not before)

### 8.2 Compound Interactions to Model

- TFSA contribution room increases each January 1 by $7,000 (or current year limit)
- TFSA withdrawals restore room the following January 1 (not same year)
- OAS clawback reduces net OAS; the reduction itself reduces taxable income (complex feedback loop)
- RRIF withdrawals increase income → may trigger OAS clawback → must model iteratively
- Pension income splitting reduces one spouse's taxable income AND increases the other's → two-step tax calculation

### 8.3 Critical Edge Cases

- Year of RRSP-to-RRIF conversion: no minimum in conversion year; first minimum in following year
- Younger spouse RRIF election: if elected at setup, must use younger spouse's age for all subsequent minimums
- Year of death: 100% of RRIF balance included in final income (unless rolled to spouse)
- CPP dropout provisions: if using CPP estimator, verify whether child-rearing and low-income dropout years are accounted for
- Bridge benefit: ends at age 65 regardless of pension start age; model the income drop
- DB pension indexation gap: between termination date and pension start, benefit may receive partial indexation

### 8.4 Assumptions Best Practices (Parallel Wealth / Snap Approach)

- Always build the **no-tax-planning baseline** scenario first (default CFM order, no meltdown, CPP/OAS at 65)
- Build the **optimized scenario** second (RRSP meltdown + CPP/OAS at 70 + income splitting)
- Build a **stress test scenario** third (0% real return, high inflation)
- Life expectancy: plan to at least 90; use 95 for conservative presentation
- Rate of return: use after-fee, after-tax blended return based on actual asset allocation
- Inflation: 2.0%–2.5% is standard; show sensitivity to 3.0%

---

## APPENDIX A: KEY RESOURCES

### Snap Projections
- **Website:** snapprojections.com
- **Help Center:** help.snapprojections.com
- **YouTube:** "Financial Planning with Snap" channel
- **Support:** 1-888-758-7977 Opt. 1 (9am–6pm ET weekdays)
- **Free Trial:** 14-day trial available for Canadian advisors
- **Pricing:** snapprojections.com/pricing/
- **Key blog posts:**
  - Taxable income targeting: snapprojections.com/blog/taxable-income-targeting/
  - Decumulation strategies: snapprojections.com/blog/decumulation-strategies/
  - Retirement planning guide: snapprojections.com/blog/retirement-planning/
  - AI Data Assist: snapprojections.com/blog/ai-data-assist/

### Parallel Wealth
- **Website:** parallelwealth.com
- **YouTube:** youtube.com/@ParallelWealth (138,000+ subscribers)
- **Podcast:** "Retirement Unpacked" — Spotify and Apple Podcasts
- **Clips Channel:** youtube.com/@ParallelWealthClips
- **Masterclass:** parallelwealth.com/masterclass
- **Sample Plans:** parallelwealth.com/sample-plans
- **Free Tools:** parallelwealth.com/tools
- **Retirement Ready Assessment:** parallelwealth.com/retirementready
- **Founder:** Adam Bornn, CFP® CLU® — BC-based; also appeared on The Wealthy Barber Podcast (July 1, 2025) and various finance podcasts

### Government Resources
- **My Service Canada Account:** CPP/OAS estimates, contribution history
- **CRA My Account:** RRSP/TFSA room, Notice of Assessment, tax returns
- **Canadian Retirement Income Calculator:** canada.ca (~30-minute tool for rough estimates)
- **CPP Calculator (third-party):** cppcalculator.com (referenced by Parallel Wealth as more accurate than CRA basic tool)
- **FP Canada Projection Assumption Guidelines:** fpcanada.ca (standard assumptions used by professional planners)
- **Government CPP/OAS benefit tables:** canada.ca/en/employment-social-development/programs/pensions/pension/statistics

---

## APPENDIX B: 2026 QUICK REFERENCE CARD

| Parameter | 2026 Value |
|---|---|
| RRSP Contribution Limit | $33,810 |
| TFSA Annual Limit | $7,000 |
| TFSA Cumulative Room (since 2009) | $109,000 |
| CPP Maximum Monthly (Age 65, base) | ~$1,364.60 |
| CPP Maximum Monthly (Age 65, with enhancement) | ~$1,410–$1,507 |
| CPP YMPE | $74,600 |
| CPP2 Upper Limit | $85,000 |
| OAS Maximum Monthly (65–74) | ~$742.31 |
| OAS Maximum Monthly (75+) | ~$816.54 |
| OAS Clawback Threshold | $95,323 |
| OAS Full Clawback (65–74) | ~$154,708 |
| OAS Full Clawback (75+) | ~$157,923 |
| Federal Basic Personal Amount | ~$16,129 |
| Ontario Basic Personal Amount | ~$11,141 |
| Pension Income Credit (Federal) | $2,000 |
| Federal Age Amount (max) | ~$8,790 |
| Ontario Age Amount (max) | ~$5,725 |
| Ontario Top Combined Marginal Rate | ~53.53% |
| Capital Gains Inclusion Rate (≤$250K) | 50% |
| Capital Gains Inclusion Rate (>$250K) | 66.67% |
| RRIF Minimum at Age 72 | 5.40% |
| RRIF Minimum at Age 80 | 6.82% |
| RRIF Minimum at Age 90 | 11.92% |

---

*Last updated: April 18, 2026. All 2026 tax brackets and benefit amounts are based on published CRA and Government of Canada sources. Figures are indexed annually; verify current rates before finalizing any plan. This document is a planning reference only and does not constitute financial advice.*
