# Tax Methodology Note - 2026 Federal/Ontario

Last updated: 2026-04-30 for Sprint 0 S0-03.

This note documents the tax and benefit assumptions currently used by `retirement_dashboard.html`. It is an audit aid for validation runs, not a substitute for CRA, Service Canada, or Ontario source material.

## Scope

- Tax year anchor: 2026.
- Province: Ontario only.
- Currency: nominal CAD in engine output unless a report explicitly converts to today's dollars.
- Household model: single person or two spouses/common-law partners.
- Main tax helper: `calcTax(income, age, year, hasPension)`.
- Main tax/splitting/clawback helper: `netAfterTaxSplit(...)`.

## 2026 Constants

Federal:

| Item | 2026 value | Indexed after 2026? |
|---|---:|---|
| Brackets | $58,523 / $117,045 / $161,733 / $230,451 | Yes, via `fedTaxIndex()` |
| Rates | 15% / 20.5% / 26% / 29% / 33% | No |
| Basic personal amount, high | $16,129 | Yes |
| Basic personal amount, low | $14,156 | Yes |
| BPA phase-out range | $181,440 to $258,482 | Yes |
| Age amount | $8,790 | Yes |
| Age amount phase-out threshold | $46,432 | Yes |
| Pension income credit base | $2,000 | No current indexation |

Ontario:

| Item | 2026 value | Indexed after 2026? |
|---|---:|---|
| First two brackets | $52,886 / $105,775 | Yes, via `onTaxIndex()` |
| Top bracket breakpoints | $150,000 / $220,000 | No |
| Rates | 5.05% / 9.15% / 11.16% / 12.16% / 13.16% | No |
| Basic personal amount | $11,141 | Yes |
| Age amount | $5,725 | Yes |
| Age amount phase-out threshold | $39,546 | Yes |
| Pension income credit base | $1,641 | No current indexation |
| Surtax thresholds | $5,315 and $6,802 of Ontario tax | No |
| Surtax rates | 20% then 36% | No |

Ontario Health Premium:

| Taxable income band | Premium treatment |
|---|---|
| Up to $20,000 | $0 |
| $20,000 to $25,000 | 6% of income over $20,000, capped at $300 |
| $25,000 to $36,000 | $300 |
| $36,000 to $38,500 | $300 plus 6% of income over $36,000, capped at $450 total |
| $38,500 to $48,000 | $450 |
| $48,000 to $48,600 | Ramps from $450 to $550 |
| $48,600 to $72,000 | $600 |
| $72,000 to $72,600 | Ramps from $600 to $750 |
| $72,600 to $200,000 | $750 |
| $200,000 to $200,600 | Ramps from $750 to $900 |
| Over $200,600 | $900 |

OAS recovery tax:

- 2026 threshold: $95,323.
- Recovery rate: 15% of net income above the threshold.
- The threshold indexes after 2026 using the same CPI cascade as `cpiIndex()`.
- Clawback is calculated on post-pension-split income inside `netAfterTaxSplit(...)`.

## Indexation Model

The dashboard uses a configurable cascade for inflation-linked values:

1. Specific override, such as `fedTaxIndex`, `onTaxIndex`, `cppIndex`, or `oasIndex`.
2. `cpiIndex`.
3. General `inflation`.
4. Hard default of 2.5%.

Indexed tax constants are grown from the 2026 anchor by `(1 + indexRate) ^ (year - 2026)`.

Values intentionally not indexed in the current engine include Ontario's $150,000 and $220,000 bracket breakpoints, Ontario surtax thresholds, Ontario Health Premium thresholds, tax rates, and the current pension-credit base amounts.

## Pension Income Credit And Splitting

S0-01 changed pension-credit eligibility from "taxable income is positive" to explicit eligible pension income.

Current treatment:

- DB pension is eligible for the federal and Ontario pension income credits.
- RRIF/LIF-style eligible income is treated as pension-credit eligible from age 65.
- Ordinary supplemental RRSP withdrawals used to fill a spending gap do not unlock the pension income credit.
- P2's own eligible pension income is tracked separately.
- Pension amounts split from P1 to P2 make the receiving spouse eligible for the pension credit on the received amount.
- Pension splitting can split up to 50% of P1 eligible pension income. The optimizer searches a 2% grid and minimizes combined income tax plus OAS clawback.

Known limitation: the splitting optimizer currently models P1-to-P2 splitting only. It does not search bidirectionally for cases where P2 should split pension income to P1.

## CPP And OAS

CPP:

- The intake form collects monthly CPP at age 65; the engine stores it as annualized CPP at age 65.
- Start ages 60 to 70 use the standard actuarial adjustment pattern: -0.6% per month before 65 and +0.7% per month after 65.
- CPP indexes after the selected start year using `cppIndex()`.
- CPP sharing is modelled separately from pension splitting.
- CPP survivor benefits are modelled with user-supplied under-65 and over-65 amounts.
- Combined retirement plus survivor CPP is capped against an approximate 2026 maximum retirement pension at 65 of `$1,433.44/month`, adjusted for age and indexation.

OAS:

- The intake form collects monthly OAS at age 65; the engine stores it as annualized OAS at age 65.
- Start ages 65 to 70 use +0.6% per deferred month.
- OAS indexes after the selected start year using `oasIndex()`.
- The 10% age-75 OAS boost applies once the recipient is 75 or older.
- OAS is not treated as pension-credit eligible income.
- OAS clawback is applied after pension splitting, as noted above.

## RRSP, RRIF, LIRA, And LIF

- RRIF minimum factors use the statutory table from age 65 onward, with the pre-71 formula `1 / (90 - age)`.
- The simulation currently starts RRIF-style minimum income at age 65 for eligible registered draw treatment.
- LIF minimums use the same minimum-factor approach.
- Ontario LIF maximum draws are simplified as `min(RRIF minimum * 1.3, 40%)`.
- RRIF/LIF minimum income can be pension-credit eligible from 65; ordinary gap-filling RRSP withdrawals are not.
- The engine has a younger-spouse RRIF election option, but the methodology note should be rechecked before relying on it in public comparator cases.

## Non-Registered Tax Treatment

- Realized capital gains on non-registered withdrawals are based on each spouse's balance-to-ACB ratio.
- Capital gains inclusion is 50% up to $250,000 of annual gains per spouse, then 66.67% above that.
- A configurable share of annual non-registered return is treated as taxable distributions and reinvested into ACB.
- Dividend gross-up/credit mechanics, interest-vs-dividend-vs-capital-gain asset mix, AMT, foreign withholding tax, tax-loss harvesting, and superficial-loss rules are not modelled.

## Known Simplifications

- Ontario only; no other provincial tax systems are implemented yet.
- Federal and Ontario credits covered here are limited to the credits used by the planner. Medical, disability, caregiver, spouse/common-law amount, charitable donations, tuition, political donations, and many other personal credits are not modelled.
- Payroll taxes and in-working-year CPP/EI contributions are not modelled as a full paycheque calculation.
- RRSP contribution room is checked only by a soft intake warning; the engine does not enforce carry-forward room, pension adjustment, or past service pension adjustment.
- TFSA contribution room is user-supplied and not automatically rebuilt from residency/history.
- GIS, Allowance, OAS residence proration, QPP, and Quebec-specific rules are not modelled.
- Estate tax, probate, final-return deemed dispositions, and RRSP/RRIF tax at last death are not fully modelled.
- Public-comparator results should be treated as directional unless the external tool exposes enough assumptions to align tax year, province, indexation, benefit timing, account types, and withdrawal order.

## Regression Coverage

The canonical probes most directly tied to this note are:

- `probe_pension_credit.js` - explicit pension-credit eligibility and split-pension treatment.
- `probe_tax_ages_64_72.js` - age 64-72 fixtures for tax, age credit, OAS clawback, CPP/OAS starts, RRIF/LIF minimums, and pension splitting.
- `probe_clawback.js` - legacy targeted OAS clawback-after-splitting check.

Run the canonical suite with:

```bash
cd probes
./run_all.sh
```

## Annual Update Checklist

For each new tax year:

1. Update federal bracket thresholds, BPA high/low values, BPA phase-out thresholds, age amount, age amount phase-out threshold, and any pension-credit changes.
2. Update Ontario indexed bracket thresholds, Ontario BPA, Ontario age amount, and age amount phase-out threshold.
3. Confirm which Ontario values remain non-indexed: $150,000/$220,000 breakpoints, surtax thresholds, Health Premium thresholds, and pension-credit base.
4. Update the OAS clawback threshold and verify the recovery rate.
5. Update Service Canada CPP maximum and OAS reference amounts used in presets, help text, and survivor caps.
6. Confirm CPP/OAS actuarial adjustment rules and the age-75 OAS boost.
7. Confirm RRIF minimum table and Ontario LIF maximum/minimum assumptions.
8. Confirm capital-gains inclusion rules, especially the $250,000 threshold and higher inclusion rate.
9. Regenerate validation baselines with `node validation/export_preset_baselines.js`.
10. Run `probes/run_all.sh` and update fixture expected values only after independently checking the new constants.
11. Refresh `validation/external-results/` notes for any public comparator whose tax year or assumptions changed.
12. Record the source URLs and effective dates in the update PR or decision note.
