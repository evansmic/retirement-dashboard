// Extracted simulation engine module.
//
// This file is mechanically lifted from retirement_dashboard.html's engine
// block so the React migration can depend on a module boundary while parity
// probes guard against behaviour drift. Edit the dashboard source first, then
// refresh this extraction until the dashboard no longer owns the engine.
(function(root, factory){
  if(typeof module !== "undefined" && module.exports){
    module.exports = factory(require("./tax_benefit_helpers.js"));
  } else {
    root.RetirementSimulationEngine = factory(root.RetirementTaxBenefitHelpers);
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function(RetirementTaxBenefitHelpers){
  "use strict";
  if(!RetirementTaxBenefitHelpers){
    throw new Error("RetirementTaxBenefitHelpers is required before the simulation engine.");
  }

  function cloneJson(obj){ return JSON.parse(JSON.stringify(obj)); }
  function finiteNumber(v){ const n = Number(v); return Number.isFinite(n) ? n : 0; }
  function p2LooksBlank(p2){
    if(!p2 || typeof p2 !== 'object') return true;
    const name = String(p2.name || '').trim();
    const placeholderName = !name || name === '—' || name.toLowerCase() === 'person 2';
    const fields = [
      'dob','dobMonth','retireYear','salary','annualRrspContrib','annualTfsaContrib','annualNonregContrib',
      'db_before65','db_after65','rrsp','rrspRoom','tfsa','tfsaRoom','tfsaAnnual','lira','lif',
      'nonreg','nonregAcb','nonregAnnual','cpp70_monthly','cpp65_monthly','oas_monthly','cpp70','cpp65',
      'oasBase','cppSurv_u65_mo','cppSurv_o65_mo','cppSurvivor_under65','cppSurvivor_over65'
    ];
    return placeholderName && !fields.some(k => finiteNumber(p2[k]) > 0);
  }
  function prepareEnginePlan(input){
    const parsed = cloneJson(input || {});
    parsed.p1 = parsed.p1 || {};
    parsed.p2 = parsed.p2 || {};
    parsed.assumptions = parsed.assumptions || {};
    parsed.spending = parsed.spending || {};
    parsed.mortgage = parsed.mortgage || {};
    parsed.loc = parsed.loc || {};
    parsed.cashWedge = parsed.cashWedge || {};
    parsed.downsize = parsed.downsize || {};
    parsed.oneOffs = Array.isArray(parsed.oneOffs) ? parsed.oneOffs : [];
    if(!Number.isFinite(Number(parsed.assumptions.retireYear)) || Number(parsed.assumptions.retireYear) <= 0){
      parsed.assumptions.retireYear = finiteNumber(parsed.p1.retireYear) || (p2LooksBlank(parsed.p2) ? 0 : finiteNumber(parsed.p2.retireYear)) || 2027;
    }
    if(!Number.isFinite(Number(parsed.assumptions.planStart)) || Number(parsed.assumptions.planStart) <= 0){
      parsed.assumptions.planStart = null;
    }
    if(parsed.p1.cpp70_monthly){ parsed.p1.cpp70 = parsed.p1.cpp70_monthly * 12; delete parsed.p1.cpp70_monthly; }
    if(parsed.p1.cpp65_monthly){ parsed.p1.cpp65 = parsed.p1.cpp65_monthly * 12; delete parsed.p1.cpp65_monthly; }
    if(parsed.p1.oas_monthly){ parsed.p1.oasBase = parsed.p1.oas_monthly * 12; delete parsed.p1.oas_monthly; }
    if(parsed.p2.cpp70_monthly){ parsed.p2.cpp70 = parsed.p2.cpp70_monthly * 12; delete parsed.p2.cpp70_monthly; }
    if(parsed.p2.cpp65_monthly){ parsed.p2.cpp65 = parsed.p2.cpp65_monthly * 12; delete parsed.p2.cpp65_monthly; }
    if(parsed.p2.oas_monthly){ parsed.p2.oasBase = parsed.p2.oas_monthly * 12; delete parsed.p2.oas_monthly; }
    if(parsed.p2.cppSurv_u65_mo){ parsed.p2.cppSurvivor_under65 = parsed.p2.cppSurv_u65_mo * 12; delete parsed.p2.cppSurv_u65_mo; }
    if(parsed.p2.cppSurv_o65_mo){ parsed.p2.cppSurvivor_over65 = parsed.p2.cppSurv_o65_mo * 12; delete parsed.p2.cppSurv_o65_mo; }
    if(parsed.inheritance == null) parsed.inheritance = 0;
    if(p2LooksBlank(parsed.p2)){
      const m = parsed.p2;
      m.name = '—';
      m.dob = parsed.p1 && parsed.p1.dob ? parsed.p1.dob : 0;
      m.dobMonth = parsed.p1 && parsed.p1.dobMonth ? parsed.p1.dobMonth : 0;
      m.retireYear = parsed.p1 && parsed.p1.retireYear ? parsed.p1.retireYear : 0;
      m.rrsp = m.tfsa = m.lira = m.lif = m.nonreg = 0;
      m.cpp70 = m.cpp65 = m.oasBase = 0;
      m.cppSurvivor_under65 = m.cppSurvivor_over65 = 0;
    }
    return parsed;
  }

  function createSimulationEngine(plan){
    const D = prepareEnginePlan(plan);
    //  TAX AND BENEFIT HELPERS (S0-11 extraction)
    // ════════════════════════════════════════════════════════
    const TAX_BENEFIT = RetirementTaxBenefitHelpers.createTaxBenefitHelpers(() => D);
    const {
      RRIF_RATES, rrif_min, lif_max, calcBracketTax, idxRate, cpiIndex, oasIndex,
      fedTaxIndex, onTaxIndex, calcTax, ontarioHealthPremium, oasClawback,
      calcDBPension, calcDBPension_P2, calcDBSurvivor, cppAdjFactor, cppIndex,
      CPP_MAX65_2026, cppMaxAtAge, calcCPP_P1, calcCPP_P2, calcOAS_P1, calcOAS_P2,
      calcSpending, calcMortgage, calcLOC
    } = TAX_BENEFIT;
    
    // ════════════════════════════════════════════════════════
    //  PENSION INCOME SPLITTING OPTIMIZER
    //  Returns optimal split fraction (0–0.5) for P1's eligible pension
    // ════════════════════════════════════════════════════════
    function optimalSplit(p1Eligible, p1Other, p2Income, p1Age, p2Age, year, p2Eligible){
      // DB pension splittable at any age; RRIF/LIF only from 65+ (caller already handles eligibility)
      // Objective MINIMISES combined tax + OAS clawback (not tax alone) so the optimizer
      // does not accidentally push the receiving spouse into clawback territory.
      p2Eligible = Math.max(0, p2Eligible || 0);
      if(p1Eligible <= 0) return 0;
      let best=0, bestSplit=0;
      for(let f=0;f<=50;f+=2){               // tighter 2% grid for more precision
        const frac = f/100;
        const split = p1Eligible*frac;
        const fInc = p1Eligible*(1-frac)+p1Other;
        const mInc = p2Income+split;
        const fTax = calcTax(fInc, p1Age, year, p1Eligible*(1-frac)>0);
        const mTax = calcTax(mInc, p2Age, year, p2Eligible+split>0);
        const clawF = oasClawback(fInc, year);
        const clawM = oasClawback(mInc, year);
        const combined = fTax + mTax + clawF + clawM;
        if(f===0 || combined<best){ best=combined; bestSplit=frac; }
      }
      return bestSplit;
    }
    
    // ════════════════════════════════════════════════════════
    //  NET-AFTER-TAX HELPER
    //    Given pre-split taxable incomes and the pension-splitting config,
    //    returns post-split tax, clawback and combined net.
    //    Single source of truth used by drawForGap solver AND the main loop.
    // ════════════════════════════════════════════════════════
    function netAfterTaxSplit(taxableF, taxableM, eligF, ageF, ageM, year, p1Alive, cfg, eligM){
      let fInc = taxableF, mInc = taxableM, splitAmt = 0;
      eligF = Math.max(0, eligF || 0);
      eligM = Math.max(0, eligM || 0);
      if(cfg.pensionSplit && p1Alive && eligF > 0){
        const frac = optimalSplit(eligF, Math.max(0, taxableF - eligF), taxableM, ageF, ageM, year, eligM);
        splitAmt = eligF * frac;
        fInc = Math.max(0, taxableF - splitAmt);
        mInc = taxableM + splitAmt;
      }
      // Clawback and tax computed on POST-SPLIT income — fixes the reference-document §1.4 bug.
      const clawF = p1Alive ? oasClawback(fInc, year) : 0;
      const clawM = oasClawback(mInc, year);
      const p1EligibleAfterSplit = Math.max(0, eligF - splitAmt);
      const p2EligibleAfterSplit = eligM + splitAmt;
      const taxF  = p1Alive ? calcTax(Math.max(0,fInc), ageF, year, p1EligibleAfterSplit>0) : 0;
      const taxM  = calcTax(Math.max(0,mInc), ageM, year, p2EligibleAfterSplit>0);
      const total = taxF + taxM + clawF + clawM;
      return { fInc, mInc, splitAmt, clawF, clawM, taxF, taxM, totalTax: total,
               net: (taxableF + taxableM) - total };
    }
    
    // ════════════════════════════════════════════════════════
    //  DRAW-FOR-GAP SOLVER (Phase 1.1 + 1.2)
    //    Binary-search a supplemental RRSP/RRIF draw across BOTH spouses
    //    such that post-tax, post-clawback combined income meets `targetNet`.
    //    Takes `baseF`/`baseM` (scenario-mandated draws such as RRIF mins or
    //    the flat meltdown target) and adds the minimum supplemental draw
    //    needed to fund spending. Supplemental draw is allocated to P2's
    //    RRSP first (she typically has lower fixed income → lower marginal
    //    rate), then P1's. Applies in every scenario, fixing the prior
    //    pre-65 income gap in Baseline and insufficiency in Meltdown.
    // ════════════════════════════════════════════════════════
    function drawForGap({targetNet, fixedF, fixedM, baseF, baseM, lifMinF, lifMinM,
                         eligFnF, eligM, ageF, ageM, year, p1Alive, cfg, balanceF, balanceM}){
      const availF = p1Alive ? Math.max(0, balanceF*0.98 - baseF) : 0;
      const availM = Math.max(0, balanceM*0.98 - baseM);
      // Equalize-taxable-income allocator: choose extraF and extraM so that
      //   (fixedF + baseF + extraF + lifMinF) == (fixedM + baseM + extraM + lifMinM)
      // subject to extraF + extraM == extra and spouse-level caps.
      // Rationale: identical marginal tax structure means equal taxable income is
      // tax-minimising pre-65 (both in lowest bracket). Post-65, pension splitting
      // on RRIF draws will fine-tune any residual imbalance. Better than naive
      // "P2 first" or "P1 first" allocators that drive one spouse into the
      // 26–29% federal bracket while the other sits at 0.
      function allocate(extra){
        const lhsF = fixedF + baseF + lifMinF;     // P1's taxable before supplement
        const lhsM = fixedM + baseM + lifMinM;     // P2's
        let eF = (extra + lhsM - lhsF) / 2;
        let eM = (extra + lhsF - lhsM) / 2;
        if(eF < 0){ eM = extra; eF = 0; }
        if(eM < 0){ eF = extra; eM = 0; }
        // Cap by availability, redirecting overflow to the other spouse.
        if(eF > availF){ eM += eF - availF; eF = availF; }
        if(eM > availM){ eF += eM - availM; eM = availM; }
        eF = Math.min(eF, availF); eM = Math.min(eM, availM);
        return { dF: baseF + Math.max(0,eF), dM: baseM + Math.max(0,eM) };
      }
      function netAt(extra){
        const { dF, dM } = allocate(extra);
        const tF = fixedF + dF + lifMinF;
        const tM = fixedM + dM + lifMinM;
        return netAfterTaxSplit(tF, tM, eligFnF(dF), ageF, ageM, year, p1Alive, cfg, eligM).net;
      }
      if(netAt(0) >= targetNet) return allocate(0);
      const maxExtra = availF + availM;
      if(maxExtra <= 0 || netAt(maxExtra) < targetNet) return allocate(maxExtra);
      let lo = 0, hi = maxExtra;
      for(let i=0; i<35; i++){
        const mid = (lo+hi)/2;
        if(netAt(mid) < targetNet) lo = mid; else hi = mid;
      }
      return allocate((lo+hi)/2);
    }
    
    // ════════════════════════════════════════════════════════
    //  CORE SIMULATION ENGINE
    // ════════════════════════════════════════════════════════
    function runSimulation(cfg){
      /*  cfg = {
            cppAgeF: 65|70, cppAgeM: 65|70,
            oasAgeF: 65|70, oasAgeM: 65|70,
            meltdown: bool,   meltdownTarget: number (target annual taxable income for P1),
            returnRate: 0.05|0,
            pensionSplit: bool,
            p1Dies: null | year (e.g. 2028)
          }
      */
      // Phase 4.1: `cfg.returnRates` (array keyed by year-index) overrides the scalar
      // `cfg.returnRate`, enabling Monte Carlo and sequence-of-returns stress tests without
      // changing the rest of the engine. `R` is recomputed at the top of each year's loop.
      const RArr = Array.isArray(cfg.returnRates) ? cfg.returnRates : null;
      const R_default = cfg.returnRate;
      let R = R_default;
      const years = [];
      // Phase 5.3: plan START = earliest of (assumptions.planStart, p1.retireYear, p2.retireYear).
      // `planStart` lets users model pre-retirement working years (salary income + contributions);
      // null => start from the earlier retirement.
      const PLAN_START_OVERRIDE = (D.assumptions.planStart != null && D.assumptions.planStart > 0)
        ? D.assumptions.planStart : Infinity;
      const START = Math.min(
        PLAN_START_OVERRIDE,
        D.p1.retireYear || D.assumptions.retireYear || 2027,
        D.p2.retireYear  || D.assumptions.retireYear || 2027
      );
      const END = D.assumptions.planEnd;
    
      // Mutable state (end-of-prior-year balances, so beginning-of-year for projection)
      // Phase 2.2: Person 2 now has her own non-reg account (`nonreg_m`/`nonreg_acb_m`).
      // Survivor rollover (Phase 2.1) moves P1's LIF into `lif_m`, the non-reg into
      // `nonreg_m` (ACB preserved — spousal rollover, no deemed disposition).
      let st = {
        rrsp_f: D.p1.rrsp||0,
        rrsp_m: D.p2.rrsp||0,
        tfsa_f: D.p1.tfsa||0,
        tfsa_m: D.p2.tfsa||0,
        // TFSA contribution room (annual accrual happens in the loop)
        tfsa_room_f: Math.max(0, (D.p1.tfsaRoom||0) - 7000),  // loop adds +7k at start of year
        tfsa_room_m: Math.max(0, (D.p2.tfsaRoom||0) - 7000),
        lif_f:  D.p1.lif||0,
        lif_m:  D.p2.lif||0,
        lira_m: D.p2.lira||0,
        nonreg_f:     D.p1.nonreg||0,
        nonreg_acb_f: D.p1.nonregAcb || D.p1.nonreg || 0,
        nonreg_m:     D.p2.nonreg||0,
        nonreg_acb_m: D.p2.nonregAcb || D.p2.nonreg || 0,
        mortgage: (D.mortgage && D.mortgage.balance)||0,
        loc: (D.loc && D.loc.balance)||0,
        // Phase 3.2: Cash wedge balance (post-tax, no ACB — already-taxed dollars).
        cash: (D.cashWedge && D.cashWedge.balance) || 0,
      };
    
      // Phase 3.9: split lifestyle failure from portfolio depletion.
      // `shortfallYear` = first year spending cannot be met (lifestyle failure).
      // `depletionYear` = first year total invested portfolio falls below $10K (informational only —
      // a plan that depletes at 90 while CPP/OAS still cover spending is NOT unsustainable).
      let totalTax=0, totalAftax=0, totalOasClawback=0;
      let planSustainable=true, sustainYear='Never'; // legacy field — retained for back-compat
      let shortfallYear='Never', depletionYear='Never';
    
      for(let year=START; year<=END; year++){
        const ageF = year - D.p1.dob;
        const ageM = year - D.p2.dob;
        const p1Alive = cfg.p1Dies ? year <= cfg.p1Dies : true;
        const isFirstDeathYear = cfg.p1Dies && year === cfg.p1Dies + 1;
    
        // Phase 4.1: per-year return applies only to equity/balanced accounts (RRSP, TFSA, LIF,
        // LIRA, non-reg). Cash wedge always uses its own `cashWedge.returnRate`. Missing array
        // entries fall back to the scalar `cfg.returnRate` so short override arrays still work.
        R = (RArr && RArr[year - START] != null) ? RArr[year - START] : R_default;
    
        // ── Annual TFSA room accrual ($7,000/person/year) ──
        st.tfsa_room_f += 7000;
        st.tfsa_room_m += 7000;
    
        // ── If Person 1 just died: spousal rollover to Person 2 (Phase 2.1) ──
        // Canadian spousal rollover: all registered and non-registered assets transfer to
        // the surviving spouse with NO deemed disposition, preserving ACB and tax-deferred
        // status. DB survivor pension is handled independently (calcDBSurvivor), so it
        // must NOT be double-counted here.
        if(isFirstDeathYear && cfg.p1Dies){
          st.rrsp_m += st.rrsp_f;           // RRSP → Person 2 RRSP (tax-deferred rollover)
          st.rrsp_f = 0;
          st.tfsa_m += st.tfsa_f;           // TFSA → Person 2 (successor-holder designation)
          st.tfsa_f = 0;
          st.lif_m  += st.lif_f;            // LIF → Person 2 LIF (pension legislation automatic)
          st.lif_f   = 0;
          // Non-reg: preserve ACB on rollover (spousal election in). No cap-gains tax at death.
          st.nonreg_m     += st.nonreg_f;
          st.nonreg_acb_m += st.nonreg_acb_f;
          st.nonreg_f      = 0;
          st.nonreg_acb_f  = 0;
        }
    
        // ── LIRA → LIF conversion at P2 age 55 ──
        if(ageM === 55 && st.lira_m > 0){
          st.rrsp_m += st.lira_m * 0.50;  // 50% Ontario unlocking
          st.lif_m   = st.lira_m * 0.50;
          st.lira_m  = 0;
        }
    
        // ── PHASE 3.6: PRINCIPAL RESIDENCE / DOWNSIZE EVENT ──
        // Year-specific tax-free cash injection (principal-residence exemption). Proceeds are
        // routed to Person 1's non-registered account with matching ACB (no embedded cap gain).
        // Amount entered in today's dollars is inflated at CPI to the event year.
        let downsize_proceeds = 0;
        if(D.downsize && D.downsize.year === year && D.downsize.netProceeds > 0){
          const infl = Math.pow(1 + idxRate('cpiIndex'), year - START);
          downsize_proceeds = D.downsize.netProceeds * infl;
          st.nonreg_f     += downsize_proceeds;
          st.nonreg_acb_f += downsize_proceeds;   // basis = proceeds (tax-free PRE)
        }
    
        // ── PHASE 3.7: ONE-OFF EXPENSES / BEQUESTS ──
        // Planned cash outflows for the year: wedding, renovation, RV, family gift, charitable
        // bequest. Amount in today's dollars is inflated at CPI to the event year. Drawn from
        // non-reg first (lowest tax drag), then TFSA, then RRSP last-resort.
        let oneOff_outflow = 0;
        if(Array.isArray(D.oneOffs)){
          const infl = Math.pow(1 + idxRate('cpiIndex'), year - START);
          for(const ev of D.oneOffs){
            if(ev && ev.year === year && ev.amount > 0){
              oneOff_outflow += ev.amount * infl;
            }
          }
        }
        if(oneOff_outflow > 0){
          // Source priority: non-reg (F then M) → TFSA (F then M) → RRSP (F then M, taxable).
          // RRSP taps are added to the year's RRIF minimum so they flow through the normal tax
          // path instead of creating an untaxed outflow.
          let needed = oneOff_outflow;
          const dip = (bal, take) => Math.min(bal, take);
          const drawNR_f = dip(st.nonreg_f, needed); st.nonreg_f -= drawNR_f; st.nonreg_acb_f = Math.max(0, st.nonreg_acb_f - drawNR_f); needed -= drawNR_f;
          const drawNR_m = dip(st.nonreg_m, needed); st.nonreg_m -= drawNR_m; st.nonreg_acb_m = Math.max(0, st.nonreg_acb_m - drawNR_m); needed -= drawNR_m;
          const drawTF_f = dip(st.tfsa_f,   needed); st.tfsa_f   -= drawTF_f; needed -= drawTF_f;
          const drawTF_m = dip(st.tfsa_m,   needed); st.tfsa_m   -= drawTF_m; needed -= drawTF_m;
          // Any remainder is effectively unfunded — the year will register a shortfall downstream.
        }
    
        // ── Phase 5.3: PRE-RETIREMENT EMPLOYMENT INCOME ──
        // Each spouse may still be working at `year` (i.e. year < person.retireYear). During working
        // years we credit salary (grown from `salaryRefYear` by `salaryRaise`) to that spouse's
        // fixed income, apply the RRSP-contribution tax DEDUCTION (reduces taxable salary), and
        // add TFSA/non-reg contributions to `totalNeeded` (they're funded from after-tax dollars).
        // End-of-year contribution posting happens after the tax calc, alongside return accretion.
        //
        // Retirement streams (CPP/OAS) are NOT force-disabled during working years — many Canadians
        // take CPP at 65 while still employed; the user controls the start age. DB pensions ARE
        // gated by retireYear inside calcDBPension/_P2 (the typical case: pension vests at
        // retirement from that employer).
        const working_f = year < D.p1.retireYear;
        const working_m = year < D.p2.retireYear;
        function _grownSalary(p, working){
          if(!working || !p.salary) return 0;
          const refY = p.salaryRefYear || 2026;
          return p.salary * Math.pow(1 + (p.salaryRaise || 0), year - refY);
        }
        const salary_f = p1Alive ? _grownSalary(D.p1, working_f) : 0;
        const salary_m = _grownSalary(D.p2, working_m);
        // RRSP contribution is capped at salary (cannot deduct more than you earn as a first-order
        // check; real CRA limit is 18% of prior-year earned income up to the yearly max, but MVP
        // trusts the user-supplied figure).
        const rrspContrib_f_pre = working_f ? Math.min(D.p1.annualRrspContrib || 0, salary_f) : 0;
        const rrspContrib_m_pre = working_m ? Math.min(D.p2.annualRrspContrib  || 0, salary_m) : 0;
        const tfsaContrib_f_pre = working_f ? (D.p1.annualTfsaContrib || 0) : 0;
        const tfsaContrib_m_pre = working_m ? (D.p2.annualTfsaContrib  || 0) : 0;
        const nregContrib_f_pre = working_f ? (D.p1.annualNonregContrib || 0) : 0;
        const nregContrib_m_pre = working_m ? (D.p2.annualNonregContrib  || 0) : 0;
        const postTaxContribs   = tfsaContrib_f_pre + tfsaContrib_m_pre + nregContrib_f_pre + nregContrib_m_pre;
        // Taxable salary after RRSP deduction; feeds into fixedF/fixedM alongside CPP/OAS/DB.
        const taxSalary_f = Math.max(0, salary_f - rrspContrib_f_pre);
        const taxSalary_m = Math.max(0, salary_m - rrspContrib_m_pre);
    
        // ── FIXED INCOME ──
        const dbPension = calcDBPension(year, p1Alive);
        const dbPension_m = calcDBPension_P2(year);
        const dbSurvivor = cfg.p1Dies ? calcDBSurvivor(year, cfg.p1Dies) : 0;
        let cpp_f = p1Alive ? calcCPP_P1(year, cfg.cppAgeF) : 0;
        let cpp_m = calcCPP_P2(year, cfg.cppAgeM, p1Alive, cfg.p1Dies||0);
        // ── PHASE 3.5: CPP PENSION SHARING ──
        // Distinct from pension income splitting (a tax-return election): CPP sharing is a
        // one-time Service Canada application where spouses apply to share their CPP retirement
        // pensions. The shared portion is the combined CPP adjusted by (years cohabiting during
        // the contributory period / total contributory years); for couples who were together
        // throughout their working years this approaches an exact 50/50 split. Helpful when one
        // spouse has a much higher CPP and the other is in a lower bracket or would benefit from
        // the credit without triggering clawback. Sharing stops on death of a spouse.
        if((D.assumptions && D.assumptions.cppSharing) && p1Alive && cpp_f > 0 && cpp_m > 0){
          const combined = cpp_f + cpp_m;
          cpp_f = cpp_m = combined / 2;
        }
        const oas_f = calcOAS_P1(year, cfg.oasAgeF, p1Alive);
        const oas_m = calcOAS_P2(year, cfg.oasAgeM);
    
        // Total fixed taxable income per person (before RRSP/RRIF withdrawals).
        // Phase 5.3: includes pre-retirement salary (net of RRSP deduction) and P2's DB pension.
        const fixedF = dbPension + dbSurvivor + cpp_f + oas_f + taxSalary_f;
        const fixedM = cpp_m + oas_m + taxSalary_m + dbPension_m;
    
        // ── REGISTERED MINIMUMS ──
        // Phase 3.3: RRIF factor can be based on the younger spouse's age when both spouses are
        // alive and the election is on. The factor age floors at 60 (the lowest RRIF table age).
        const younger = Math.min(ageF, ageM);
        const useYounger = (D.assumptions && D.assumptions.youngerSpouseRrif) && p1Alive && ageM >= 60;
        const factorAge = useYounger ? Math.max(60, Math.min(younger, 94)) : null;
        let rrif_min_f = 0, rrif_min_m = 0;
        if(ageF >= 65 && p1Alive)
          rrif_min_f = Math.max(0, st.rrsp_f * rrif_min(factorAge!=null ? factorAge : Math.min(ageF,94)));
        if(ageM >= 65)
          rrif_min_m = Math.max(0, st.rrsp_m * rrif_min(factorAge!=null ? factorAge : Math.min(ageM,94)));
        let lif_min_f = 0, lif_min_m = 0;
        if(ageF >= 60 && p1Alive) lif_min_f = Math.max(0, st.lif_f * rrif_min(Math.min(ageF,94)));
        if(ageM >= 55 && st.lif_m>0) lif_min_m = Math.max(0, st.lif_m * rrif_min(Math.min(ageM,94)));
        // Phase 2.7: Ontario LIF maximum draw = 1.3× RRIF min (capped per regulation).
        // In meltdown scenarios we draw up to the LIF max to parallel RRSP decumulation; in
        // other scenarios the LIF tracks its statutory minimum. Using Math.min with the balance
        // guards against over-drawing a nearly-depleted LIF.
        let lif_max_f = 0, lif_max_m = 0;
        if(ageF >= 60 && p1Alive) lif_max_f = Math.min(st.lif_f, st.lif_f * lif_max(Math.min(ageF,94)));
        if(ageM >= 55 && st.lif_m>0) lif_max_m = Math.min(st.lif_m, st.lif_m * lif_max(Math.min(ageM,94)));
        if(cfg.meltdown){
          // Enforce LIF max in meltdown (Ontario rule — regulator permits up to ~8–10% typical).
          if(lif_max_f > lif_min_f) lif_min_f = lif_max_f;
          if(lif_max_m > lif_min_m) lif_min_m = lif_max_m;
        }
    
        // ── SPENDING & MORTGAGE (needed up front for the gap-fill solver) ──
        const spending = calcSpending(year) * (cfg.spendMultiplier || 1);
        const mtg = calcMortgage(st.mortgage, year);
        const loc = calcLOC(st.loc);
        // Phase 5.3: during working years, TFSA + non-reg contributions are funded from
        // after-tax dollars, so they add to the cash target the draw/solver must hit.
        const totalNeeded = spending + mtg.payment + loc.payment + postTaxContribs;
    
        // ── STRATEGY: RRSP/RRIF WITHDRAWAL ──
        let rrif_draw_f = rrif_min_f;
        let rrif_draw_m = rrif_min_m;
    
        // Pension-credit / pension-splitting eligibility.
        // DB pension is eligible at any age. RRIF/LIF income is treated as eligible
        // from 65+. Ordinary supplemental RRSP withdrawals used to fill a cash-flow
        // gap are deliberately excluded, so "has pension income" is never inferred
        // from taxable income alone.
        const eligFnF = (_d) => dbPension + dbSurvivor + (ageF>=65 ? rrif_min_f + lif_min_f : 0);
        const eligM = dbPension_m + (ageM>=65 ? rrif_min_m + lif_min_m : 0);
    
        if(cfg.meltdown && p1Alive && st.rrsp_f > 0){
          // Draw-based meltdown: nominal flat amounts (e.g. $20K pre-65, $40K 65+).
          // This is a FLOOR — the gap-fill solver below may add more if the meltdown target
          // is insufficient (e.g., pre-65 before CPP/OAS start).
          const drawTarget = ageF < 65 ? cfg.meltdownDraw60_64 : cfg.meltdownDraw65plus;
          rrif_draw_f = Math.min(st.rrsp_f * 0.98, Math.max(rrif_min_f, drawTarget));
        }
        // ── Phase 1.1 / 1.2 / 3.1: Gap-fill RRSP draws across BOTH spouses ──
        // Runs in every scenario. Sizes supplemental RRSP/RRIF draws so that post-split,
        // post-clawback combined net income meets `totalNeeded`. Delivers the "consistent
        // real net income" objective (roadmap §1.1–1.2) and generalises Snap Projections'
        // taxable-income-target feature across both spouses. P2's RRSP is drawn first
        // (lower fixed income = lower marginal rate); P1's RRSP is drawn only after
        // P2's is exhausted or to respect the meltdown floor.
        //
        // Phase 3.1: When `cfg.withdrawalOrder === 'default'` (CFM textbook N→T→R),
        // we reduce the net target drawForGap must hit by the amount non-reg + TFSA can
        // safely cover, so the RRSP stays near the mandated minimum (+ any meltdown floor)
        // and the downstream non-reg/TFSA fallback code fills the gap. For 'meltdown' the
        // full `totalNeeded` flows through, preserving the aggressive drawdown behavior.
        let gapAdjustedTarget = totalNeeded;
        const _wo = cfg.withdrawalOrder || 'meltdown';
        if(_wo === 'default' && !cfg.meltdown){
          // Net from just fixed income + mandated minimums (no extra RRSP top-up).
          const netAtMin = netAfterTaxSplit(
            fixedF + rrif_draw_f + lif_min_f,
            fixedM + rrif_draw_m + lif_min_m,
            eligFnF(rrif_draw_f), ageF, ageM, year, p1Alive, cfg, eligM
          ).net;
          const gapAtMin = Math.max(0, totalNeeded - netAtMin);
          // Non-reg principal is ~100% available post-tax (only the embedded gain gets
          // cap-gain inclusion; conservatively assume ~90% realisation after tax drag).
          // TFSA is fully post-tax. Use sum as a ceiling for preferred pre-RRSP draws.
          const altAvail = 0.9 * (st.nonreg_f + st.nonreg_m) + (st.tfsa_f + st.tfsa_m);
          const preferredAlt = Math.min(gapAtMin, altAvail);
          gapAdjustedTarget = Math.max(netAtMin, totalNeeded - preferredAlt);
        }
        const gf = drawForGap({
          targetNet: gapAdjustedTarget,
          fixedF, fixedM,
          baseF: rrif_draw_f, baseM: rrif_draw_m,
          lifMinF: lif_min_f, lifMinM: lif_min_m,
          eligFnF, ageF, ageM, year, p1Alive, cfg,
          eligM,
          balanceF: st.rrsp_f, balanceM: st.rrsp_m
        });
        rrif_draw_f = gf.dF;
        rrif_draw_m = gf.dM;
    
        // ── NON-REG DRAW (forward estimate so cap-gains inclusion is priced into tax) ──
        // We need to know whether a non-reg draw is likely, BEFORE tax, so the 50% cap gain
        // gets added to taxable income (Phase 1.4). Estimate the gap at current draw; if RRSP was
        // capped at balance, top-up comes from non-reg (each spouse's ACB/gain tracked separately).
        function estNet(dF){
          const tF = fixedF + dF + lif_min_f;
          const tM = fixedM + rrif_draw_m + lif_min_m;
          return netAfterTaxSplit(tF, tM, eligFnF(dF), ageF, ageM, year, p1Alive, cfg, eligM).net;
        }
        const provisionalNet = estNet(rrif_draw_f);
        let gapAfterRRSP = Math.max(0, totalNeeded - provisionalNet);
    
        // ── PHASE 3.2: CASH-WEDGE DRAW ──
        // Cash wedge is already post-tax and generates no capital gains, so it is the cheapest
        // source of cash flow. Drawn before non-reg in every scenario (its whole purpose is to
        // shield equity accounts from forced sales), and its growth uses its own `returnRate`
        // so the rest of the portfolio can keep compounding at the equity rate. In down-return
        // years (Phase 4 Monte Carlo) the wedge absorbs the draw while equities recover.
        let cash_draw = 0;
        if(gapAfterRRSP > 0 && st.cash > 0){
          cash_draw = Math.min(st.cash, gapAfterRRSP);
          gapAfterRRSP -= cash_draw;
        }
    
        // Gap-fill from non-reg: Person 1 first, then Person 2.
        let nonreg_draw_f = 0, nonreg_draw_m = 0;
        if(gapAfterRRSP > 0 && st.nonreg_f > 0){
          nonreg_draw_f = Math.min(st.nonreg_f, gapAfterRRSP);
          gapAfterRRSP -= nonreg_draw_f;
        }
        if(gapAfterRRSP > 0 && st.nonreg_m > 0){
          nonreg_draw_m = Math.min(st.nonreg_m, gapAfterRRSP);
        }
        // Embedded capital gain realised on the draw (ACB-proportional, per spouse).
        const gainDrawnF = nonreg_draw_f > 0
          ? (nonreg_draw_f/st.nonreg_f) * Math.max(0, st.nonreg_f - st.nonreg_acb_f)
          : 0;
        const gainDrawnM = nonreg_draw_m > 0
          ? (nonreg_draw_m/st.nonreg_m) * Math.max(0, st.nonreg_m - st.nonreg_acb_m)
          : 0;
        // Canadian 2026 rule: 50% inclusion ≤ $250K/yr, 66.67% above (per spouse).
        function cgIncl(g){ return g <= 250000 ? g*0.50 : 125000 + (g-250000)*0.6667; }
        const cgInclusionF = cgIncl(gainDrawnF);
        const cgInclusionM = cgIncl(gainDrawnM);
    
        // ── PHASE 2.3: ANNUAL NON-REG TAXABLE DISTRIBUTIONS ──
        // Model the portion of each spouse's non-reg return that is distributed each year as
        // ordinary taxable income (interest / dividends / realised CG distributions). The
        // distribution is assumed to be reinvested — balance still grows at full R, but ACB
        // rises by the distribution amount (since that growth has been taxed and becomes basis).
        const _distShare = (D.assumptions && D.assumptions.nonRegDistShare != null)
          ? D.assumptions.nonRegDistShare : 0.5;
        const nonRegDistF = st.nonreg_f * R * _distShare;
        const nonRegDistM = st.nonreg_m * R * _distShare;
    
        // ── PHASE 3.4: SPOUSAL RRSP ATTRIBUTION ──
        // If the contributor made any contribution to a spousal RRSP in the current year or the
        // two preceding calendar years, the LESSER of (annuitant's withdrawal) and (sum of those
        // contributions) is attributed back to the contributor — it becomes HIS/HER taxable
        // income instead of the annuitant's. Prevents naive income-splitting. Once the 3-year
        // window elapses with no new contributions, attribution falls to zero and the annuitant
        // owns the full withdrawal as planned.
        const spRrsp = D.assumptions && D.assumptions.spousalRrsp;
        let attrF_toM = 0;  // P1's draw re-attributed to P2's taxable (P2 contributed)
        let attrM_toF = 0;  // P2's draw re-attributed to P1's taxable (P1 contributed)
        if(spRrsp && spRrsp.contribs){
          let winSum = 0;
          for(const [yStr, amt] of Object.entries(spRrsp.contribs)){
            const dy = year - parseInt(yStr, 10);
            if(dy >= 0 && dy <= 2) winSum += (+amt || 0);
          }
          if(winSum > 0){
            if(spRrsp.contributor === 'm'){
              // P2 contributed → P1 is annuitant → P1's withdrawal attributed to P2.
              attrF_toM = Math.min(rrif_draw_f, winSum);
            } else if(spRrsp.contributor === 'f'){
              // P1 contributed → P2 is annuitant → P2's withdrawal attributed to P1.
              attrM_toF = Math.min(rrif_draw_m, winSum);
            }
          }
        }
    
        // ── TAXABLE INCOME (post cap-gain inclusion + annual distributions + spousal attribution) ──
        let taxableF = fixedF + (rrif_draw_f - attrF_toM) + attrM_toF + lif_min_f + cgInclusionF + nonRegDistF;
        let taxableM = fixedM + (rrif_draw_m - attrM_toF) + attrF_toM + lif_min_m + cgInclusionM + nonRegDistM;
    
        // ── PENSION INCOME SPLITTING, TAX & POST-SPLIT CLAWBACK ──
        // Single helper call computes split fraction, post-split clawF/clawM and taxes together.
        // This fixes the Phase 1.5 bug where clawback was calculated pre-split and never updated.
        const eligF = eligFnF(rrif_draw_f);
        const tx = netAfterTaxSplit(taxableF, taxableM, eligF, ageF, ageM, year, p1Alive, cfg, eligM);
        const splitAmt = tx.splitAmt;
        taxableF = tx.fInc;
        taxableM = tx.mInc;
        const clawF = tx.clawF;
        const clawM = tx.clawM;
        let taxF = tx.taxF + clawF;
        const taxM = tx.taxM + clawM;
        let totalTaxYear = taxF + taxM;
    
        // Net OAS actually received this year (for display — reflects post-split clawback).
        const netOasF = Math.max(0, oas_f - clawF);
        const netOasM = Math.max(0, oas_m - clawM);
    
        let grossIncomeF = fixedF + rrif_draw_f + lif_min_f;
        const grossIncomeM = fixedM + rrif_draw_m + lif_min_m;
        let grossIncome  = grossIncomeF + grossIncomeM;
        let afterTaxReg  = grossIncome - totalTaxYear;
    
        // ── TFSA DRAWS / CONTRIBUTIONS ──
        let tfsa_draw_f=0, tfsa_draw_m=0;
        let tfsa_contrib_f=0, tfsa_contrib_m=0;
        // Remaining gap after RRSP draw + non-reg principal + cash wedge already counted below.
        const totalNonregDraw = nonreg_draw_f + nonreg_draw_m;
        let gap = totalNeeded - Math.max(0, afterTaxReg) - totalNonregDraw - cash_draw;
        if(gap > 0){
          tfsa_draw_f = Math.min(st.tfsa_f, gap*0.7);
          tfsa_draw_m = Math.min(st.tfsa_m, Math.max(0, gap - tfsa_draw_f));
        }
        // Secondary non-reg top-up (if TFSA insufficient — rare, keeps invariant).
        let remaining = Math.max(0, gap - tfsa_draw_f - tfsa_draw_m);
        if(remaining > 0 && st.nonreg_f - nonreg_draw_f > 0){
          const add = Math.min(st.nonreg_f - nonreg_draw_f, remaining);
          nonreg_draw_f += add;
          remaining -= add;
        }
        if(remaining > 0 && st.nonreg_m - nonreg_draw_m > 0){
          nonreg_draw_m += Math.min(st.nonreg_m - nonreg_draw_m, remaining);
        }
    
        // If surplus after spending: route into TFSA using available room
        // Priority: Person 2's larger accumulated room first, then Person 1's
        let surplus = Math.max(0, afterTaxReg - totalNeeded);
        let surplusLeft = surplus;
        tfsa_contrib_m = Math.min(surplusLeft, st.tfsa_room_m);
        surplusLeft -= tfsa_contrib_m;
        st.tfsa_room_m = Math.max(0, st.tfsa_room_m - tfsa_contrib_m);
        tfsa_contrib_f = Math.min(surplusLeft, st.tfsa_room_f);
        surplusLeft -= tfsa_contrib_f;
        st.tfsa_room_f = Math.max(0, st.tfsa_room_f - tfsa_contrib_f);
        // Phase 3.2: after TFSA room is full, route surplus to the cash wedge up to its target
        // balance (in nominal dollars, inflated by CPI). Only the remainder spills into non-reg.
        const _wedgeTargetNow = (D.cashWedge && D.cashWedge.targetYears || 0)
                              * ((D.spending && D.spending.gogo) || 0)
                              * Math.pow(1 + idxRate('cpiIndex'), year - START);
        if(surplusLeft > 0 && _wedgeTargetNow > st.cash){
          const wedgeRefill = Math.min(surplusLeft, _wedgeTargetNow - st.cash);
          st.cash += wedgeRefill;
          surplusLeft -= wedgeRefill;
        }
        // Route remaining surplus beyond TFSA room + wedge target to Person 1's non-reg.
        if(surplusLeft > 0){
          st.nonreg_f += surplusLeft;
          st.nonreg_acb_f += surplusLeft;
        }
    
        // Total actually available this year (never negative)
        // Subtract TFSA contributions to avoid double-counting future TFSA draws.
        // Phase 3.2: add cash wedge draw (already post-tax, no future tax implication).
        const totalAvailable = Math.max(0, afterTaxReg) - tfsa_contrib_f - tfsa_contrib_m
                             + tfsa_draw_f + tfsa_draw_m + nonreg_draw_f + nonreg_draw_m
                             + cash_draw;
    
        // Cap actual spending to what's available — never show negative cash flow
        const actualSpend    = Math.min(totalNeeded, Math.max(0, totalAvailable));
        const shortfall      = Math.max(0, totalNeeded - actualSpend);   // unmet spending
        const cashFlow       = Math.max(0, totalAvailable - actualSpend); // surplus (if any)
        const totalAftaxYear = actualSpend;
    
        // ── UPDATE BALANCES ──
        // RRSP/RRIF
        st.rrsp_f = Math.max(0, (st.rrsp_f - rrif_draw_f) * (1+R));
        st.rrsp_m = Math.max(0, (st.rrsp_m - rrif_draw_m) * (1+R));
        // LIF
        st.lif_f  = Math.max(0, (st.lif_f - lif_min_f) * (1+R));
        st.lif_m  = Math.max(0, (st.lif_m - lif_min_m) * (1+R));
        // TFSA
        st.tfsa_f = Math.max(0, (st.tfsa_f - tfsa_draw_f + tfsa_contrib_f) * (1+R));
        st.tfsa_m = Math.max(0, (st.tfsa_m - tfsa_draw_m + tfsa_contrib_m) * (1+R));
        // Non-reg — gains computed earlier (so cap-gain inclusion hit the tax line);
        // recompute here against current balances in case secondary top-up increased draws.
        const gainFinalF = nonreg_draw_f > 0
          ? (nonreg_draw_f/Math.max(1,st.nonreg_f)) * Math.max(0, st.nonreg_f - st.nonreg_acb_f)
          : 0;
        const gainFinalM = nonreg_draw_m > 0
          ? (nonreg_draw_m/Math.max(1,st.nonreg_m)) * Math.max(0, st.nonreg_m - st.nonreg_acb_m)
          : 0;
        st.nonreg_acb_f = Math.max(0, st.nonreg_acb_f - (nonreg_draw_f - gainFinalF));
        st.nonreg_f     = Math.max(0, (st.nonreg_f - nonreg_draw_f) * (1+R));
        st.nonreg_acb_m = Math.max(0, st.nonreg_acb_m - (nonreg_draw_m - gainFinalM));
        st.nonreg_m     = Math.max(0, (st.nonreg_m - nonreg_draw_m) * (1+R));
        // Phase 2.3: annual distributions were already taxed above → bump ACB by the reinvested
        // amount so it isn't re-taxed as an unrealised gain on a future draw.
        st.nonreg_acb_f = Math.min(st.nonreg_f, st.nonreg_acb_f + nonRegDistF);
        st.nonreg_acb_m = Math.min(st.nonreg_m, st.nonreg_acb_m + nonRegDistM);
        // LIRA (if still exists)
        st.lira_m = Math.max(0, st.lira_m * (1+R));
        // Mortgage
        st.mortgage = mtg.newBalance;
        // LOC (assume paid off in first couple years)
        st.loc = loc.newBalance;
    
        // ── Phase 3.2: CASH WEDGE GROWTH ──
        // Wedge grows at its own (lower) return rate — preserves the principal's purchasing
        // power during equity drawdowns. The draw was already subtracted above, and the surplus
        // refill is handled in the TFSA-surplus routing block (so TFSA room fills first).
        const _cashRet = (D.cashWedge && D.cashWedge.returnRate != null) ? D.cashWedge.returnRate : 0.03;
        st.cash = Math.max(0, (st.cash - cash_draw) * (1 + _cashRet));
    
        // ── Phase 5.3: END-OF-YEAR PRE-RETIREMENT CONTRIBUTIONS ──
        // Post accretion, apply any working-year contributions to account balances.
        // RRSP: already applied as a tax deduction above → just grow the balance.
        // TFSA: cap at remaining room; decrement room by what was actually contributed.
        // Non-reg: ACB rises $-for-$ with contribution (new ACB basis on fresh dollars).
        if(working_f){
          st.rrsp_f += rrspContrib_f_pre;
          const tfsaAdd = Math.min(tfsaContrib_f_pre, st.tfsa_room_f);
          st.tfsa_f += tfsaAdd;
          st.tfsa_room_f = Math.max(0, st.tfsa_room_f - tfsaAdd);
          st.nonreg_f += nregContrib_f_pre;
          st.nonreg_acb_f += nregContrib_f_pre;
        }
        if(working_m){
          st.rrsp_m += rrspContrib_m_pre;
          const tfsaAdd = Math.min(tfsaContrib_m_pre, st.tfsa_room_m);
          st.tfsa_m += tfsaAdd;
          st.tfsa_room_m = Math.max(0, st.tfsa_room_m - tfsaAdd);
          st.nonreg_m += nregContrib_m_pre;
          st.nonreg_acb_m += nregContrib_m_pre;
        }
    
        const totalPortfolio = st.rrsp_f+st.rrsp_m+st.tfsa_f+st.tfsa_m+st.lif_f+st.lif_m+st.nonreg_f+st.nonreg_m+st.lira_m+st.cash;
    
        // Phase 3.9: track the two KPIs separately. Legacy `sustainYear` keeps firing for the
        // first "bad" year (either) so older UI code still works; the new KPIs only light up
        // when their specific event actually occurs.
        if(shortfall > 500 && shortfallYear === 'Never') shortfallYear = year;
        if(totalPortfolio < 10000 && depletionYear === 'Never') depletionYear = year;
        if((shortfall > 500 || totalPortfolio < 10000) && planSustainable){
          planSustainable=false; sustainYear=year;
        }
    
        // Accumulate summary stats
        totalTax    += totalTaxYear;
        totalAftax  += totalAftaxYear;
        totalOasClawback += clawF + clawM;
    
        years.push({
          year, ageF, ageM, p1Alive,
          // Phase 5.3: pre-retirement fields (zero in fully retired years).
          salary_f, salary_m, working_f, working_m,
          rrspContrib_f: rrspContrib_f_pre, rrspContrib_m: rrspContrib_m_pre,
          tfsaContrib_f: tfsaContrib_f_pre, tfsaContrib_m: tfsaContrib_m_pre,
          nregContrib_f: nregContrib_f_pre, nregContrib_m: nregContrib_m_pre,
          dbPension, dbPension_m, dbSurvivor, cpp_f, cpp_m, oas_f:netOasF, oas_m:netOasM,
          rrif_draw_f, rrif_draw_m, lif_min_f, lif_min_m, lif_draw: lif_min_f+lif_min_m,
          tfsa_draw_f, tfsa_draw_m, tfsa_draw:tfsa_draw_f+tfsa_draw_m,
          nonreg_draw_f, nonreg_draw_m, nonreg_draw: nonreg_draw_f + nonreg_draw_m, splitAmt,
          cash_draw, bal_cash: st.cash,
          downsize_proceeds, oneOff_outflow,
          grossIncome, totalTaxYear, clawF, clawM, totalOasClawY: clawF+clawM,
          taxableIncomeF: taxableF, taxableIncomeM: taxableM, taxableIncome: taxableF + taxableM,
          afterTaxReg, totalAftaxYear, spending, mortgage:mtg.payment,
          cashFlow, surplus, shortfall,
          bal_rrsp_f:st.rrsp_f, bal_rrsp_m:st.rrsp_m,
          bal_rrsp: st.rrsp_f+st.rrsp_m,
          bal_tfsa: st.tfsa_f+st.tfsa_m,
          bal_lif: st.lif_f+st.lif_m,
          bal_nonreg: st.nonreg_f + st.nonreg_m,
          bal_total: totalPortfolio
        });
      }
    
      return { years, totalTax, totalAftax, totalOasClawback, sustainYear, shortfallYear, depletionYear };
    }
    
    // Shared stress-severity summary used by Monte Carlo, sequence replay, and
    // comparison output. "Full spending funded" means no annual shortfall above
    // the dashboard's existing $500 materiality threshold; portfolio depletion is
    // reported separately because fixed CPP/OAS/DB income can still cover spending
    // after financial assets are mostly gone.
    function summarizeStressRun(r){
      const years = (r && r.years) || [];
      let firstShortfallYear = 'Never';
      let shortfallYears = 0;
      let maxShortfall = 0;
      let totalShortfall = 0;
      let coreNeed = 0;
      let coreCovered = 0;
      for(const y of years){
        const short = Math.max(0, y.shortfall || 0);
        if(short > 500){
          shortfallYears++;
          if(firstShortfallYear === 'Never') firstShortfallYear = y.year;
        }
        maxShortfall = Math.max(maxShortfall, short);
        totalShortfall += short;
        const core = Math.max(0, (y.spending || 0) + (y.mortgage || 0));
        coreNeed += core;
        coreCovered += Math.min(core, Math.max(0, y.totalAftaxYear || 0));
      }
      const last = years[years.length - 1] || {};
      return {
        firstShortfallYear,
        shortfallYears,
        maxShortfall,
        totalShortfall,
        depletionYear: (r && r.depletionYear) || 'Never',
        coreCoverage: coreNeed > 0 ? coreCovered / coreNeed : 1,
        endPortfolio: last.bal_total || 0
      };
    }
    
    // ════════════════════════════════════════════════════════
    //  MONTE CARLO ENGINE (Phase 4.1)
    // ════════════════════════════════════════════════════════
    // Runs `nPaths` simulations of `baseCfg`, each with its own per-year return
    // array sampled independently from Normal(meanReturn, stdDev). Leverages the
    // `cfg.returnRates` hook added earlier in Phase 4.1. Used directly by the fan
    // chart (10/50/90 percentile bands) and the full-spending-funded metric
    // (Sprint 0 S0-04). Returns both aggregate statistics and per-year percentiles.
    //
    // Why Normal rather than lognormal? For a ~40-year plan with mean 5% / SD 10%
    // the two are numerically close, and Normal keeps the math transparent when
    // reasoning about fan-chart behaviour. Switch to lognormal if tails matter
    // (fat-tailed equity crashes); flag for Phase 4.2 if the distributional
    // assumption gets contested.
    //
    // Cost: ~1000 × 38-year sim. Each sim reuses all the existing Phase 2/3 logic
    // (tax, OAS clawback, splitting, spousal attribution, one-offs). The per-path
    // overhead is dominated by the simulation itself, not the Normal draw.
    // Sprint 2 #52: split the run into three phases (begin/step/finish) so the
    // synchronous wrapper below AND the chunked progressive runner used by the
    // dashboard's auto-MC both share the same per-path math. Calling `mcBegin`
    // followed by a single `mcStep(state, state.nPaths)` and `mcFinish(state)`
    // returns identical-shape output to the original single-pass implementation.
    function _mcNormalSampler(){
      // Box-Muller transform — converts two U(0,1) samples into one N(0,1) sample.
      // No seed control here by design; results will differ each click. If reproducibility
      // is required, replace Math.random with a seeded PRNG (mulberry32 etc.).
      return function(){
        let u = 0, v = 0;
        while(u === 0) u = Math.random();
        while(v === 0) v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
      };
    }
    
    function mcBegin(baseCfg, nPaths, meanReturn, stdDev){
      nPaths     = nPaths     || (D.assumptions && D.assumptions.monteCarloPaths) || 1000;
      meanReturn = (meanReturn != null) ? meanReturn
                                        : (baseCfg.returnRate != null ? baseCfg.returnRate : 0.05);
      stdDev     = (stdDev != null) ? stdDev
                                    : ((D.assumptions && D.assumptions.returnStdDev) || 0.10);
      // Run one deterministic reference path to learn plan length. Using the scalar
      // `returnRate` on its own matches what the baseline scenario would produce,
      // which also serves as the MC "deterministic comparator" in the probe.
      const refRun = runSimulation(baseCfg);
      const nYears = refRun.years.length;
      // Column-major: balances[y] is a typed array of per-path balances at year y.
      // Typed arrays keep GC pressure low across 1,000 × 38 = 38,000 writes.
      const balances = Array.from({length:nYears}, () => new Float64Array(nPaths));
      const endPort  = new Float64Array(nPaths);
      const firstShortfall = new Float64Array(nPaths);
      const maxShortfall = new Float64Array(nPaths);
      const totalShortfall = new Float64Array(nPaths);
      const depletionYear = new Float64Array(nPaths);
      const coreCoverage = new Float64Array(nPaths);
      return {
        baseCfg, nPaths, meanReturn, stdDev,
        refRun, nYears, balances, endPort,
        firstShortfall, maxShortfall, totalShortfall, depletionYear, coreCoverage,
        nSuccess: 0, pathsRun: 0,
        normal: _mcNormalSampler()
      };
    }
    
    function mcStep(state, batch){
      const { baseCfg, nPaths, meanReturn, stdDev, nYears, balances, endPort, normal } = state;
      const end = Math.min(state.pathsRun + Math.max(1, batch|0), nPaths);
      for(let p = state.pathsRun; p < end; p++){
        const rates = new Array(nYears);
        for(let i = 0; i < nYears; i++){
          rates[i] = meanReturn + stdDev * normal();
        }
        const r = runSimulation(Object.assign({}, baseCfg, { returnRates: rates }));
        for(let i = 0; i < r.years.length; i++){
          balances[i][p] = r.years[i].bal_total;
        }
        const severity = summarizeStressRun(r);
        endPort[p] = r.years[r.years.length - 1].bal_total;
        state.firstShortfall[p] = severity.firstShortfallYear === 'Never' ? 9999 : severity.firstShortfallYear;
        state.maxShortfall[p] = severity.maxShortfall;
        state.totalShortfall[p] = severity.totalShortfall;
        state.depletionYear[p] = severity.depletionYear === 'Never' ? 9999 : severity.depletionYear;
        state.coreCoverage[p] = severity.coreCoverage;
        if(severity.shortfallYears === 0) state.nSuccess++;
      }
      state.pathsRun = end;
    }
    
    function mcFinish(state){
      const { nPaths, meanReturn, stdDev, refRun, nYears, balances, endPort, nSuccess,
              firstShortfall, maxShortfall, totalShortfall, depletionYear, coreCoverage } = state;
      function percentile(arr, q){
        const a = Array.from(arr).sort((x, y) => x - y);
        const idx = q * (a.length - 1);
        const lo  = Math.floor(idx), hi = Math.ceil(idx), t = idx - lo;
        return a[lo] + (a[hi] - a[lo]) * t;
      }
      function mean(arr){
        let s = 0;
        for(let i = 0; i < arr.length; i++) s += arr[i];
        return s / arr.length;
      }
      function earliestYear(arr){
        let y = 9999;
        for(let i = 0; i < arr.length; i++) y = Math.min(y, arr[i]);
        return y;
      }
      const perYear = [];
      for(let i = 0; i < nYears; i++){
        perYear.push({
          year: refRun.years[i].year,
          ageF: refRun.years[i].ageF,
          ageM: refRun.years[i].ageM,
          p10:  percentile(balances[i], 0.10),
          p50:  percentile(balances[i], 0.50),
          p90:  percentile(balances[i], 0.90)
        });
      }
      return {
        nPaths, meanReturn, stdDev,
        successRate: nSuccess / nPaths,
        fullSpendingFundedRate: nSuccess / nPaths,
        endPortfolio: {
          p10:  percentile(endPort, 0.10),
          p50:  percentile(endPort, 0.50),
          p90:  percentile(endPort, 0.90),
          mean: mean(endPort)
        },
        severity: {
          firstShortfallYear: {
            earliest: earliestYear(firstShortfall),
            p10: percentile(firstShortfall, 0.10),
            p50: percentile(firstShortfall, 0.50),
            p90: percentile(firstShortfall, 0.90)
          },
          maxShortfall: {
            p10: percentile(maxShortfall, 0.10),
            p50: percentile(maxShortfall, 0.50),
            p90: percentile(maxShortfall, 0.90)
          },
          totalShortfall: {
            p10: percentile(totalShortfall, 0.10),
            p50: percentile(totalShortfall, 0.50),
            p90: percentile(totalShortfall, 0.90)
          },
          depletionYear: {
            earliest: earliestYear(depletionYear),
            p10: percentile(depletionYear, 0.10),
            p50: percentile(depletionYear, 0.50),
            p90: percentile(depletionYear, 0.90)
          },
          coreCoverage: {
            p10: percentile(coreCoverage, 0.10),
            p50: percentile(coreCoverage, 0.50),
            p90: percentile(coreCoverage, 0.90)
          }
        },
        perYear,
        refRun
      };
    }
    
    function monteCarlo(baseCfg, nPaths, meanReturn, stdDev){
      const state = mcBegin(baseCfg, nPaths, meanReturn, stdDev);
      mcStep(state, state.nPaths);
      return mcFinish(state);
    }
    
    // Sprint 2 #52: progressive Monte Carlo runner — kicks off after the
    // deterministic plan has rendered so the user sees their dashboard instantly.
    // Processes paths in batches of `batchSize` separated by `setTimeout(0)` so the
    // browser can paint between chunks and the page stays responsive. Returns a
    // handle with `.cancel()` so the caller can abort if the user clicks "Skip" or
    // switches scenarios mid-run. `onProgress(done, total)` fires after each batch;
    // `onComplete(mc)` fires once with the same shape as `monteCarlo()` returns.
    function monteCarloProgressive(baseCfg, opts){
      opts = opts || {};
      const nPaths     = opts.nPaths || (D.assumptions && D.assumptions.monteCarloPaths) || 1000;
      const batchSize  = Math.max(10, opts.batchSize || 200);
      const meanReturn = (opts.meanReturn != null) ? opts.meanReturn
                                                   : (baseCfg.returnRate != null ? baseCfg.returnRate : 0.05);
      const stdDev     = (opts.stdDev != null) ? opts.stdDev
                                               : ((D.assumptions && D.assumptions.returnStdDev) || 0.10);
      const onProgress = typeof opts.onProgress === 'function' ? opts.onProgress : function(){};
      const onComplete = typeof opts.onComplete === 'function' ? opts.onComplete : function(){};
      const state = mcBegin(baseCfg, nPaths, meanReturn, stdDev);
      let cancelled = false;
      function tick(){
        if(cancelled) return;
        if(state.pathsRun >= state.nPaths){
          onComplete(mcFinish(state));
          return;
        }
        mcStep(state, batchSize);
        onProgress(state.pathsRun, state.nPaths);
        setTimeout(tick, 0);
      }
      // Kick off after a microtask so callers can finish setup (e.g. wire onProgress
      // listeners) before the first batch fires.
      setTimeout(tick, 0);
      return {
        cancel: function(){ cancelled = true; },
        isCancelled: function(){ return cancelled; },
        state: state,
      };
    }
    
    // ════════════════════════════════════════════════════════
    //  SEQUENCE-OF-RETURNS STRESS TEST (Phase 4.2)
    // ════════════════════════════════════════════════════════
    // Sequence-of-returns risk: two plans with the *same* arithmetic mean return
    // can end with wildly different balances if the bad years cluster near
    // retirement (the portfolio is largest, so withdrawals lock in losses). This
    // matters enormously for plans that lean on aggressive RRSP meltdowns early
    // in retirement.
    //
    // Rather than simulate arbitrary crashes, we replay four historical sequences
    // of real US-equity total returns, each starting at the plan's first retirement
    // year. Years past the sequence length revert to `cfg.returnRate` (the scalar
    // mean) so later returns are neutral. A "recovery" is therefore baked in by
    // default — we are specifically stressing the *early* years.
    //
    // Sources: Robert Shiller's S&P 500 dataset + CPI (annual real total returns,
    // reinvested dividends). Slightly rounded; absolute calibration is less
    // important than the relative shock shape.
    //   1929 — Great Depression. -34, -12, -31, -6 then recovery.
    //   1973 — Stagflation.       -18, -30, +31, +18, -15, +1.
    //   2000 — Dot-com bust.      -10, -13, -23, +26, +9.
    //   2008 — GFC.               -38, +23, +13.
    const HISTORICAL_SEQUENCES = {
      '1929': { label: 'Great Depression (1929)',
                returns: [-0.34, -0.12, -0.31, -0.06, 0.49, 0.03, 0.40, 0.30] },
      '1973': { label: 'Stagflation (1973)',
                returns: [-0.18, -0.30, 0.31, 0.18, -0.15, 0.01, 0.12, 0.22] },
      '2000': { label: 'Dot-com bust (2000)',
                returns: [-0.10, -0.13, -0.23, 0.26, 0.09, 0.03, 0.14, 0.05] },
      '2008': { label: 'Global Financial Crisis (2008)',
                returns: [-0.38, 0.23, 0.13, 0.00, 0.14, 0.30, 0.11, -0.01] }
    };
    
    // Runs the scenario once per historical sequence AND once at the plain scalar
    // return for comparison ("Normal"). Returns a dict keyed by sequence name, each
    // entry holding the full simulation result so the caller can diff end-portfolios
    // or replot balance curves.
    function sequenceOfReturnsStress(baseCfg){
      const results = {};
      // Baseline (no shock).
      results['_baseline'] = Object.assign(
        { label: 'Baseline (mean return)' },
        runSimulation(baseCfg)
      );
      for(const key of Object.keys(HISTORICAL_SEQUENCES)){
        const seq = HISTORICAL_SEQUENCES[key];
        // Tile: first N years use the historical sequence; remainder stays at mean.
        const rates = seq.returns.slice();
        const sim = runSimulation(Object.assign({}, baseCfg, { returnRates: rates }));
        results[key] = Object.assign({ label: seq.label, sequence: seq.returns }, sim);
      }
      return results;
    }
    
    // ════════════════════════════════════════════════════════
    //  SCENARIO CONFIGURATIONS
    // ════════════════════════════════════════════════════════
    // Meltdown draw amounts scaled to Person 1's RRSP size
    // (~8% pre-65, ~16% from 65, rounded to nearest $5K, min $20K/$40K)
    const _meltDraw60 = Math.max(20000, Math.round(D.p1.rrsp * 0.08 / 5000) * 5000);
    const _meltDraw65 = Math.max(40000, Math.round(D.p1.rrsp * 0.16 / 5000) * 5000);
    const _survYear   = D.assumptions.p1DiesInSurvivor;
    const _survAge    = _survYear - D.p1.dob;
    
    // Base configurations for the four user-facing scenarios. The `maxs` (Max Spend)
    // scenario is always derived from the meltdown cfg by the solver below.
    // Phase 3.1: `withdrawalOrder` controls which account is drawn first when a gap
    // between fixed income and spending emerges. Values:
    //   'default'  — CFM textbook order: Non-Reg → TFSA → RRSP.
    //                Preserves registered tax shelters for later; better for modest
    //                plans where top-marginal-rate RRSP drains aren't tax-optimal.
    //   'meltdown' — Snap-style meltdown: RRSP/RRIF first (pre-65 emphasis), then
    //                Non-Reg, then TFSA. Lowers future mandatory RRIF minimums +
    //                estate tax on remaining RRSP, at the cost of today's taxes.
    //   'hybrid'   — Reserved for a future bracket-capped meltdown (draw RRSP up to
    //                the 20.5% federal bracket top, then switch to non-reg/TFSA).
    // The user picks per-plan via the intake selector; scenarios inherit but can
    // override (e.g., the Meltdown scenario always uses 'meltdown' regardless of the
    // base selection so the comparison remains meaningful).
    const _woUser = (D.assumptions && D.assumptions.withdrawalOrder) || 'default';
    const _cfgBase = { cppAgeF:65, cppAgeM:65, oasAgeF:65, oasAgeM:65,
                       meltdown:false,
                       returnRate:0.05, pensionSplit:false, p1Dies:null,
                       withdrawalOrder: _woUser };
    const _cfgMelt = { cppAgeF:70, cppAgeM:70, oasAgeF:70, oasAgeM:70,
                       meltdown:true, meltdownDraw60_64:_meltDraw60, meltdownDraw65plus:_meltDraw65,
                       returnRate:0.05, pensionSplit:true, p1Dies:null,
                       withdrawalOrder: 'meltdown' };
    const _cfgZero = Object.assign({}, _cfgMelt, { returnRate:0.0 });
    const _cfgSurv = Object.assign({}, _cfgMelt, { p1Dies:_survYear });
    
    // ════════════════════════════════════════════════════════
    //  SUSTAINABLE-SPEND SOLVER (never-shortfall guarantee)
    //  Binary-searches for the HIGHEST spending multiplier where:
    //    (a) no year has a shortfall > $500, AND
    //    (b) end-of-plan portfolio ≥ inheritance goal (today's dollars inflated to
    //        plan-end year).
    //  Clamped at `cap` (default 1.0) so a well-funded plan still reports spending
    //  at the user's target rather than inflating past it. `maxs` passes cap=4.0
    //  to find the true ceiling.
    // ════════════════════════════════════════════════════════
    function solveSustainable(baseCfg, goalRealDollars, cap){
      cap = cap == null ? 1.0 : cap;
      const infl = (D.assumptions && D.assumptions.inflation) || 0.025;
      const planLen = (D.assumptions.planEnd - D.assumptions.retireYear);
      const goalNominalAtEnd = Math.max(0, goalRealDollars||0) * Math.pow(1+infl, planLen);
      const feasible = (mult) => {
        const r = runSimulation(Object.assign({}, baseCfg, {spendMultiplier: mult}));
        if(r.years.some(y => y.shortfall > 500)) return false;
        const last = r.years[r.years.length-1];
        if((last.bal_total||0) < goalNominalAtEnd - 1) return false;
        return true;
      };
      // Fast path — desired spend (mult=1 capped) is feasible.
      if(feasible(cap)) return cap;
      let lo = 0.05, hi = cap;
      if(!feasible(lo)) return lo;   // even frugal plan can't meet goal; return floor
      for(let i=0; i<45; i++){
        const mid = (lo+hi)/2;
        if(feasible(mid)) lo = mid; else hi = mid;
      }
      return lo;
    }
    
    // Find the first year the portfolio would run short at the user's DESIRED spend
    // (mult = 1.0). Used for the warning banner when the sustainable multiplier < 1.
    function firstShortfallYearAt(baseCfg, mult){
      const r = runSimulation(Object.assign({}, baseCfg, {spendMultiplier: mult}));
      const s = r.years.find(y => y.shortfall > 500);
      return s ? s.year : null;
    }
    
    // ── PER-SCENARIO FEASIBILITY ──
    // For each scenario, compute the sustainable multiplier respecting the inheritance
    // goal. If desired spend (×1.0) is feasible, use it. Otherwise fall back to the
    // sustainable level and record depletion-year info for the warning banner.
    const _inheritGoal = Math.max(0, (D.inheritance || 0));
    function prepareScenario(baseCfg){
      const sustMult = solveSustainable(baseCfg, _inheritGoal, 1.0);
      const feasible = sustMult >= 0.9995;
      const depletion = feasible ? null : firstShortfallYearAt(baseCfg, 1.0);
      return { cfg: Object.assign({}, baseCfg, {spendMultiplier: sustMult}),
               sustMult, feasible, depletionYearAtDesired: depletion };
    }
    const _prepBase = prepareScenario(_cfgBase);
    const _prepMelt = prepareScenario(_cfgMelt);
    const _prepZero = prepareScenario(_cfgZero);
    const _prepSurv = prepareScenario(_cfgSurv);
    
    // Max Spend: use meltdown cfg and find the absolute ceiling (cap = 4.0, ignoring
    // inheritance goal — this is the "spend it all" scenario).
    const _maxsMult = solveSustainable(_cfgMelt, 0, 4.0);
    
    const SCENARIOS = {
      base: { label:'Recommended plan (CPP/OAS at 65)', color:'#7ab8e0',
              cfg:_prepBase.cfg, info:_prepBase },
      melt: { label:'RRSP Meltdown (CPP/OAS at 70)', color:'#2db560',
              cfg:_prepMelt.cfg, info:_prepMelt },
      zero: { label:'Net 0% Return', color:'#f5a623',
              cfg:_prepZero.cfg, info:_prepZero },
      surv: { label:`Survivor (${D.p1.name} dies age ${_survAge})`, color:'#e74c3c',
              cfg:_prepSurv.cfg, info:_prepSurv },
      maxs: { label:'Max Spend (Estate → 0)', color:'#9b59b6',
              cfg: Object.assign({}, _cfgMelt, {spendMultiplier: _maxsMult}),
              info: { sustMult:_maxsMult, feasible:true, depletionYearAtDesired:null } }
    };
    
    // ════════════════════════════════════════════════════════
    //  RUN ALL SCENARIOS
    // ════════════════════════════════════════════════════════
    const RESULTS = {};
    for(const [key, scn] of Object.entries(SCENARIOS)){
      RESULTS[key] = runSimulation(scn.cfg);
      RESULTS[key].sustMult = scn.info.sustMult;
      RESULTS[key].feasible = scn.info.feasible;
      RESULTS[key].depletionYearAtDesired = scn.info.depletionYearAtDesired;
    }
    
    // ════════════════════════════════════════════════════════
    return {
      D,
      runSimulation,
      summarizeStressRun,
      monteCarlo,
      sequenceOfReturnsStress,
      SCENARIOS,
      RESULTS
    };
  }

  function runSimulation(plan, cfg){
    return createSimulationEngine(plan).runSimulation(Object.assign({}, cfg));
  }

  return { createSimulationEngine, runSimulation, prepareEnginePlan };
});
