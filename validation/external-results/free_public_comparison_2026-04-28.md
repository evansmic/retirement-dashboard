# Free/Public Comparator Run — 2026-04-28

Methodology reference: [`../tax_methodology_2026.md`](../tax_methodology_2026.md).

## Scenario Used

Primary benchmark: `single-late-career` preset.

Reason: it is the cleanest apples-to-apples public case: single Ontario resident, no DB pension, no spouse, no corporate assets, no survivor planning.

Dashboard baseline:

| Metric | Dashboard |
|---|---:|
| Current age / retirement age / terminal age | 55 / 67 / 93 |
| Salary | $70,000 |
| Current RRSP / TFSA / non-reg | $120,000 / $35,000 / $10,000 |
| Annual RRSP / TFSA / non-reg contributions | $7,000 / $7,000 / $0 |
| Return / inflation | 5.0% / 2.5% |
| CPP at 65 / OAS at 65 | $10,200/yr / $8,908/yr |
| Retirement spending target | $50,000/yr go-go, then $42,000, then $35,000, indexed |
| Baseline first shortfall year | Never |
| Baseline ending portfolio, age 93 | $173,423 nominal |
| Baseline lifetime tax | $200,356 nominal |
| Baseline lifetime OAS clawback | $0 |

Dashboard retirement-year row, age 67:

| Metric | Nominal 2038 | Approx. 2026 dollars |
|---|---:|---:|
| Portfolio at retirement | $546,277 | $406,188 |
| Spending / after-tax spend | $51,563 | $38,340 |
| Taxable gross income | $33,189 | $24,678 |
| Tax | $748 | $556 |
| CPP | $10,716 | $7,968 |
| OAS | $9,359 | $6,959 |
| RRSP/RRIF draw | $13,114 | $9,751 |
| TFSA draw | $19,122 | $14,218 |

## Tools Actually Run

### 1. Wealth Wizard Canada — Retirement Savings Calculator

URL: https://wealthwizard.ca/retirement-calculator/

Inputs mapped:

- Current age 55
- Retirement age 67
- 26 retirement years
- RRSP $120,000, TFSA $35,000, other $10,000
- RRSP monthly contribution $583, TFSA monthly contribution $583, other $0
- Return 5.0%, inflation 2.5%
- CPP $850/mo, OAS $742.31/mo

Results:

| Metric | Wealth Wizard | Dashboard Comparable | Difference |
|---|---:|---:|---:|
| RRSP at retirement | $333,095 | not exported separately at retirement | n/a |
| TFSA at retirement | $178,408 | not exported separately at retirement | n/a |
| Other savings at retirement | $18,198 | not exported separately at retirement | n/a |
| Total savings at retirement, future dollars | $529,702 | $546,277 | -3.0% |
| Total savings at retirement, today's dollars | $393,863 | $406,188 | -3.0% |
| Approx. yearly income from savings, today's dollars | $15,755 | n/a, dashboard solves year-by-year spending | n/a |
| CPP + OAS monthly estimate | $1,592 | $1,244/mo in dashboard's age-67 2026-dollar row | +28.0% |
| Total annual income, today's dollars, before tax | $34,862 | $38,897 gross incl. TFSA in dashboard age-67 2026-dollar row | -10.4% |

Interpretation:

This is the cleanest positive validation. Accumulation to retirement is within about 3%, which is excellent given independent calculators and rounding. The income result is lower because Wealth Wizard uses a 4% rule snapshot, while the dashboard does a year-by-year drawdown with changing account order, indexed spending, tax, and terminal-age targeting.

### 2. calculator-calculatrice.ca — Retirement Calculator Canada

URL: https://calculator-calculatrice.ca/en/calculator/retirement

Inputs mapped:

- Age 55, retire 67, life expectancy 93
- Other/non-reg current savings $10,000
- General monthly contribution $0
- Expected monthly expenses $4,167
- RRSP $120,000, RRSP monthly contribution $583
- TFSA $35,000, TFSA monthly contribution $583
- Return 5.0%, expense inflation 2.5%, employer match 0%
- CPP start 65, CPP $850/mo, OAS $742/mo

Results:

| Metric | calculator-calculatrice.ca | Dashboard Comparable | Difference |
|---|---:|---:|---:|
| RRSP at retirement | $333,095 | not exported separately at retirement | n/a |
| TFSA at retirement | $178,408 | not exported separately at retirement | n/a |
| Other savings at retirement | $18,198 | not exported separately at retirement | n/a |
| Total savings at retirement | $529,702 | $546,277 | -3.0% |
| Monthly retirement income | $5,285 | $4,297 nominal spending at age 67 | +23.0% |
| Savings withdrawal | $3,693/mo | dashboard uses $2,686/mo from RRSP + TFSA at age 67 | +37.5% |
| Depletion / status | Runs out at age 81 | Never shortfalls; $173,423 left at age 93 | major divergence |

Interpretation:

Accumulation again matches within 3%, because the compound-growth inputs align. Sustainability diverges sharply. This calculator appears to use a simpler retirement drawdown / expense model; it reports depletion at age 81 despite a similar starting portfolio. The dashboard does much more detailed annual tax and account sequencing, but the gap is large enough to keep on the validation watchlist.

### 3. RetireMinute

URL: https://www.retireminute.ca/

Inputs mapped:

- Current age 55, target retirement age 67, Ontario
- Current annual income $70,000
- Current savings $165,000
- Tax-deferred share 73%
- Future monthly savings $1,167
- Other fixed income $0
- Estimated career average income $70,000
- Years living in Canada 40
- Years working in Canada 37
- Children/caregiver years 0
- Workplace pension none

Results:

| Metric | RetireMinute | Dashboard Comparable | Difference |
|---|---:|---:|---:|
| Selected retirement target | $3,267/mo after tax | $4,167/mo starting go-go target, today's dollars | -21.6% target |
| Projected net retirement income | $3,520/mo | $3,195/mo at dashboard age-67 row, 2026 dollars | +10.2% |
| Coverage | 108% | dashboard has no shortfall | directionally aligned |
| Monthly surplus | $253 | dashboard no shortfall | directionally aligned |
| CPP/QPP | $1,248/mo | dashboard preset CPP65 input $850/mo | +46.8% |
| OAS | $849/mo | dashboard preset OAS65 input $742/mo | +14.4% |
| Savings withdrawal | $1,991/mo | dashboard age-67 RRSP + TFSA draw, 2026 dollars: $1,998/mo | -0.4% |

Interpretation:

This is a useful directional comparator, but not an exact one. RetireMinute derives CPP/OAS from career/residency inputs and chose a lower target lifestyle than the dashboard preset. The most interesting check is savings withdrawal: $1,991/mo vs dashboard $1,998/mo in 2026 dollars at age 67, essentially identical. Benefit amounts are much higher in RetireMinute, which explains why it can show the plan as secured despite a lower target.

### 4. CA Tax Tools — Canadian Retirement Income Calculator

URL: https://catax.tools/retirement-income-calculator/

This was used as a component-level retirement-income/tax check, not a lifetime projection.

Inputs mapped from the dashboard age-67 row, converted to approximate 2026 dollars:

- Age 67, Ontario, tax year 2026
- CPP $664/mo
- OAS $580/mo
- RRSP/RRIF withdrawal $9,751/yr
- TFSA withdrawal $14,218/yr
- Other income $0

Results:

| Metric | CA Tax Tools | Dashboard Comparable | Difference |
|---|---:|---:|---:|
| Taxable income excluding TFSA | $24,679 | $24,678 | effectively equal |
| Total gross incl. TFSA | $38,897 | $38,896 | effectively equal |
| Total tax + clawback | $1,742 | $556 | +$1,186 |
| Net retirement income | $37,155 | $38,340 | -$1,185 |
| Monthly take-home | $3,096 | $3,195 | -$99/mo |

Interpretation:

This exposed a real modelling question. The dashboard tax helper gives a much lower tax bill on the same taxable income. Independent manual reasoning suggests the dashboard is close if the income qualifies for age and pension credits, but the current implementation appears to pass `hasPension = true` whenever taxable income is positive. That means ordinary RRSP withdrawals before RRIF conversion may receive pension-income credits incorrectly.

Relevant code area:

- `retirement_dashboard.html`: `netAfterTaxSplit()` calls `calcTax(..., fInc > 0)` and `calcTax(..., mInc > 0)`.
- `calcTax()` applies federal and Ontario pension-income credits when `hasPension` is true.

This should be treated as a high-priority tax accuracy follow-up.

## Tools Attempted But Not Counted Numerically

| Tool | Status | Reason |
|---|---|---|
| Government of Canada Canadian Retirement Income Calculator | Attempted | Public and official, but the embedded browser session became unstable after entering general profile fields. It also threw repeated page script errors (`$.plot is not a function`) in the runtime logs. |
| Canada Retire Calc | Attempted | Public form accepted inputs, but Calculate did not produce a result in the browser session. |
| ProjectionLab Canada | Not run | Public marketing says free ad-hoc planning, but the app requires sign-up before plan creation. |
| Loonie Nest Scenario Lab+ | Not run | Full planner is payment/free-trial gated. Public demo is not editable enough for this benchmark. |
| NowCapital | Not run | Public landing page requires accepting Terms of Use before use. Since accepting third-party terms was not pre-approved, it was not continued. |
| SimpleKit Canadian Retirement Planner | Attempted | Public/no-account and promising, but the in-app browser could not reliably fill some editable numeric fields. |

## Summary

The free/public comparison is mixed but useful:

1. **Accumulation to retirement is validated well.** Two independent public calculators produced $529,702 at retirement vs the dashboard's $546,277, a 3.0% difference.
2. **Savings-withdrawal magnitude is directionally validated.** RetireMinute's savings withdrawal of $1,991/mo was almost identical to the dashboard's age-67 RRSP + TFSA draw of about $1,998/mo in 2026 dollars.
3. **Lifetime sustainability diverges by tool.** calculator-calculatrice.ca says funds deplete at age 81, while the dashboard shows no shortfall through age 93 and ends with $173,423 nominal. This likely reflects simpler drawdown logic in the public calculator, but the gap is large.
4. **Tax treatment needs review.** CA Tax Tools calculates $1,742 of tax on the same real-dollar retirement income where the dashboard calculates about $556. The dashboard may be too generous because it appears to apply pension-income credits too broadly.
5. **Most sophisticated free/public tools are not truly anonymous/free for full custom plans.** ProjectionLab, Loonie Nest full planner, and RetireZest require sign-up, payment, or email verification for deeper modelling.

## Sprint 0 Follow-up — 2026-04-30

S0-01 addressed the tax-treatment question exposed by the CA Tax Tools comparison.

What changed:

- `netAfterTaxSplit()` no longer passes `hasPension = income > 0` into `calcTax()`.
- Pension-credit eligibility is now passed explicitly through the split optimiser, draw-for-gap helper, and main simulation loop.
- Ordinary supplemental RRSP withdrawals used to fill spending gaps do not unlock pension-income credits.
- DB pension remains eligible; RRIF/LIF-style minimum income is treated as eligible from 65+; P2's own eligible income and received split pension are handled separately.
- `probe_pension_credit.js` adds 8 focused checks for ordinary taxable income, DB pension, RRIF/LIF-style income, P2 eligibility, and split pension.
- `validation/preset_baselines.json` and `.csv` were regenerated after the fix.

S0-03 added the 2026 tax methodology note linked above so future comparator runs have a single audit reference for federal/Ontario constants, indexed vs non-indexed values, pension-credit treatment, OAS clawback, CPP/OAS assumptions, RRIF/LIF treatment, known simplifications, and annual update steps.

Effect on the `single-late-career` baseline:

| Metric | Before S0-01 | After S0-01 |
|---|---:|---:|
| Ending portfolio, age 93 | $173,423 | $207,770 |
| Lifetime tax | $200,356 | $204,182 |
| Lifetime after-tax spend | $2,337,769 | $2,318,286 |
| Sustainable spend multiplier | 0.7668 | 0.7599 |

The higher lifetime tax is expected: ordinary RRSP-style gap withdrawals no longer receive pension-income credits. The higher ending portfolio occurs because the sustainable-spend solver slightly reduces spending to preserve the no-shortfall constraint under the corrected tax treatment.

## Recommended Next Steps

1. Retry the official Government of Canada calculator manually in a normal browser, because it remains the most important public source even though it failed in this automation run.
2. Use `public-comparator-single` / Baseline first: single age-65 retiree, flat $33K spending, no spouse, no non-reg, no DB pension, no tax optimization, CPP/OAS at 65.
3. Add paid-tool benchmarks only after the free/public baseline is stable.

## Sprint 0 Follow-up — S0-08

S0-08 added `public-comparator-single` to the dashboard `PRESETS` registry and regenerated `preset_baselines.json`, `preset_baselines.csv`, and `preset_baselines_yearly.csv`.

The fixture is intentionally simpler than `single-late-career`: one person, retired at 65 in 2026, flat $33,000 spending in every phase, $350,000 RRSP/RRIF-style registered savings, $80,000 TFSA, no spouse, no DB pension, no mortgage, no non-registered account, no special events, and ordinary CPP/OAS at 65 in the Baseline scenario.

## Sprint 0 Follow-up — S0-09 Official Public Calculator Rerun

Run date: 2026-05-01. The Government of Canada calculator session report labelled itself "Summary of the information provided on April 30, 2026", likely because the Canada.ca service timestamp was still on April 30 during the run.

Tool: Government of Canada Canadian Retirement Income Calculator.

URL: https://www.canada.ca/en/services/benefits/publicpensions/cpp/retirement-income-calculator.html

Fixture used: `public-comparator-single` / Baseline.

Inputs mapped:

- Date of birth: January 1961.
- Sex assigned at birth: male. This is only used by the calculator for default life expectancy; the run overrode life expectancy manually.
- Current annual income: $0.
- Annual retirement income goal: $33,000 before tax / in today's dollars.
- Retirement income stop age: 95.
- CPP: Canada Pension Plan, Statement of Contributions available, 2026 statement, $1,000/month at age 65, CPP start age 65, no work after CPP starts.
- Employer pension: none.
- RRSP: yes, current value $350,000, no future contributions, income from age 65 to 95, 5% return.
- Other retirement savings: yes, current value $80,000, no future contributions, income from age 65 to 95, 5% return.
- Other income: none.
- OAS: living in Canada at 65, at least 40 years in Canada between age 18 and 65, OAS start age 65.

Input mismatch notes:

- The dashboard fixture has `dobMonth: 6`, but the dashboard engine uses annual ages (`year - birthYear`). January 1961 was used in the Government of Canada calculator so the official tool treats the person as age 65 in 2026.
- The Government of Canada calculator asks for a before-tax retirement income goal and does not expose a year-by-year tax calculation. The dashboard's spending target is interpreted through the engine's after-tax spending/drawdown mechanics.
- The Government of Canada calculator amortizes RRSP/other savings into a level annual retirement-savings income. The dashboard draws only what is needed each year after CPP/OAS, tax, account ordering, and indexed spending.

Government of Canada results:

| Metric | Government of Canada calculator |
|---|---:|
| CPP | $12,005/yr from age 65 |
| OAS | $8,916/yr from age 65 to 74 |
| OAS age-75 amount | $9,808/yr from age 75 to 95 |
| Retirement savings income | $19,079/yr from age 65 |
| Total estimated income, ages 65-74 | $40,000/yr |
| Total estimated income, ages 75-95 | $40,892/yr |
| Difference vs $33,000 goal, ages 65-74 | +$7,000/yr |
| Difference vs $33,000 goal, ages 75-95 | +$7,892/yr |

Dashboard comparable, nominal Baseline:

| Metric | Dashboard |
|---|---:|
| CPP at age 65 / 2026 | $12,000 |
| OAS at age 65 / 2026 | $8,908 |
| Registered + TFSA draw at age 65 / 2026 | $14,293 |
| Gross income incl. TFSA draw at age 65 / 2026 | $35,201 |
| Total tax at age 65 / 2026 | $2,327 |
| Actual spending funded at age 65 / 2026 | $32,874 |
| First material shortfall year | Never |
| Max annual shortfall | $126 |
| Ending portfolio at age 95 / 2056 | $516,892 |

Interpretation:

This is a useful official public benchmark, but not an exact engine validation. CPP and OAS line up closely: CPP differs by $5/year and OAS differs by $8/year at age 65. That is excellent.

The retirement-savings comparison diverges by design. The Government of Canada calculator turns the $350,000 RRSP plus $80,000 other savings into a level $19,079/year income from age 65 to 95. The dashboard draws less at age 65 because it funds a $33,000 spending target after tax and preserves the portfolio for later indexed spending, ending with $516,892 nominal at age 95. This should not be treated as a bug without a separate comparator that exposes tax, inflation, and account-draw sequencing.

S0-09 conclusion:

- The official public calculator now runs numerically for the S0-08 fixture.
- CPP/OAS are validated tightly for the simple age-65 case.
- Savings drawdown is directionally comparable but not apples-to-apples because the official calculator levelizes savings income and does not expose tax/account sequencing.
- Paid/account-gated tools remain secondary until public baselines are stable.
