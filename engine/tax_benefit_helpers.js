var RetirementTaxBenefitHelpers = (function(){
  "use strict";

  const RRIF_RATES = {
    65:0.0400,66:0.0417,67:0.0435,68:0.0453,69:0.0473,70:0.0500,
    71:0.0528,72:0.0540,73:0.0553,74:0.0567,75:0.0582,76:0.0598,
    77:0.0617,78:0.0634,79:0.0655,80:0.0682,81:0.0706,82:0.0733,
    83:0.0771,84:0.0802,85:0.0851,86:0.0899,87:0.0935,88:0.0964,
    89:0.1000,90:0.1099,91:0.1192,92:0.1306,93:0.1449,94:0.1879,
  };

  function rrif_min(age){ if(age<71) return 1/(90-age); return RRIF_RATES[Math.min(age,94)] || 0.20; }
  function lif_max(age){ return Math.min(rrif_min(age)*1.3, 0.40); }

  function calcBracketTax(income, brackets){
    let tax=0, prev=0;
    for(const [lim,rate] of brackets){
      if(income<=prev) break;
      tax += (Math.min(income,lim)-prev)*rate;
      prev=lim;
    }
    return tax;
  }

  function createTaxBenefitHelpers(getPlan){
    function D(){ return getPlan(); }

    function idxRate(which){
      const plan = D();
      const A = plan.assumptions || {};
      const v = A[which];
      if(typeof v === 'number') return v;
      if(typeof A.cpiIndex === 'number') return A.cpiIndex;
      if(typeof A.inflation === 'number') return A.inflation;
      return 0.025;
    }
    function cpiIndex(){    return idxRate('cpiIndex'); }
    function oasIndex(){    return idxRate('oasIndex'); }
    function fedTaxIndex(){ return idxRate('fedTaxIndex'); }
    function onTaxIndex(){  return idxRate('onTaxIndex'); }

    function calcTax(income, age, year, hasPension){
      if(income<=0) return 0;
      const fedIdx = Math.pow(1 + fedTaxIndex(), year-2026);
      const onIdx  = Math.pow(1 + onTaxIndex(),  year-2026);

      const fedBrk = [
        [58523*fedIdx,  0.15],
        [117045*fedIdx, 0.205],
        [161733*fedIdx, 0.26],
        [230451*fedIdx, 0.29],
        [Infinity,      0.33]
      ];
      let fedTax = calcBracketTax(income, fedBrk);
      const bpaHi  = 16129 * fedIdx;
      const bpaLo  = 14156 * fedIdx;
      const phaseStart = 181440 * fedIdx;
      const phaseEnd   = 258482 * fedIdx;
      let bpa = bpaHi;
      if(income > phaseStart){
        const frac = Math.min(1, (income - phaseStart) / Math.max(1, phaseEnd - phaseStart));
        bpa = bpaHi - frac * (bpaHi - bpaLo);
      }
      let fedCred = bpa * 0.15;
      if(hasPension) fedCred += 2000*0.15;
      if(age>=65){
        const aaMax = 8790*fedIdx;
        const aaPhase = Math.max(0,(income-46432*fedIdx)*0.15);
        fedCred += Math.max(0,aaMax-aaPhase)*0.15;
      }
      fedTax = Math.max(0, fedTax-fedCred);

      const ontBrk = [
        [52886*onIdx, 0.0505],
        [105775*onIdx,0.0915],
        [150000,      0.1116],
        [220000,      0.1216],
        [Infinity,    0.1316]
      ];
      let ontTax = calcBracketTax(income, ontBrk);
      let ontCred = 11141*onIdx*0.0505;
      if(hasPension) ontCred += 1641*0.0505;
      if(age>=65){
        const aaON = Math.max(0, 5725*onIdx - Math.max(0,(income-39546*onIdx)*0.15));
        ontCred += aaON*0.0505;
      }
      ontTax = Math.max(0, ontTax-ontCred);
      const s1=5315, s2=6802;
      let surtax=0;
      if(ontTax>s1) surtax += (Math.min(ontTax,s2)-s1)*0.20;
      if(ontTax>s2) surtax += (ontTax-s2)*0.36;
      ontTax += surtax;
      ontTax += ontarioHealthPremium(income);

      return fedTax+ontTax;
    }

    function ontarioHealthPremium(income){
      if(income <= 20000) return 0;
      if(income <= 25000) return Math.min(300, (income - 20000) * 0.06);
      if(income <= 36000) return 300;
      if(income <= 38500) return 300 + Math.min(150, (income - 36000) * 0.06);
      if(income <= 48000) return 450;
      if(income <= 48600) return 450 + Math.min(100, (income - 48000) * (100/600));
      if(income <= 72000) return 600;
      if(income <= 72600) return 600 + Math.min(150, (income - 72000) * (150/600));
      if(income <= 200000) return 750;
      if(income <= 200600) return 750 + Math.min(150, (income - 200000) * (150/600));
      return 900;
    }

    function oasClawback(netIncome, year){
      const thresh = 95323 * Math.pow(1 + cpiIndex(), year-2026);
      return Math.max(0,(netIncome-thresh)*0.15);
    }

    function calcDBPension(year, p1Alive){
      const plan = D();
      if(!p1Alive) return 0;
      if(year < plan.p1.retireYear) return 0;
      const age = year - plan.p1.dob;
      const yrs = year - plan.p1.db_startYear;
      const idx = Math.pow(1+plan.p1.db_index, yrs);
      return (age < 65 ? plan.p1.db_before65 : plan.p1.db_after65) * idx;
    }

    function calcDBPension_P2(year){
      const plan = D();
      if(year < plan.p2.retireYear) return 0;
      const before = plan.p2.db_before65 || 0;
      const after  = plan.p2.db_after65  || 0;
      if(before === 0 && after === 0) return 0;
      const age  = year - plan.p2.dob;
      const startY = plan.p2.db_startYear || plan.p2.retireYear;
      const idx  = Math.pow(1 + (plan.p2.db_index || 0.022), year - startY);
      return (age < 65 ? before : after) * idx;
    }

    function calcDBSurvivor(year, p1DeathYear){
      const plan = D();
      if(year <= p1DeathYear) return 0;
      const yrs = p1DeathYear - plan.p1.db_startYear;
      const idx = Math.pow(1+plan.p1.db_index, yrs);
      return plan.p1.db_after65 * idx * 0.60 * Math.pow(1+plan.p1.db_index, year-p1DeathYear);
    }

    function cppAdjFactor(startAge){
      const months = (Math.max(60, Math.min(70, startAge)) - 65) * 12;
      return months < 0 ? 1 + months*0.006 : 1 + months*0.007;
    }
    function cppIndex(){ return idxRate('cppIndex'); }
    const CPP_MAX65_2026 = 1433.44 * 12;
    function cppMaxAtAge(year, age){
      const adj = cppAdjFactor(age);
      return CPP_MAX65_2026 * adj * Math.pow(1 + cppIndex(), year - 2026);
    }

    function calcCPP_P1(year, startAge){
      const plan = D();
      const age = year - plan.p1.dob;
      if(age < startAge) return 0;
      const startYear = plan.p1.dob + startAge;
      const base = (plan.p1.cpp65 || 0) * cppAdjFactor(startAge);
      return base * Math.pow(1 + cppIndex(), year - startYear);
    }

    function calcCPP_P2(year, startAge, p1Alive, p1DeathYear){
      const plan = D();
      const age = year - plan.p2.dob;
      const startYear = plan.p2.dob + startAge;
      let cpp = 0;
      if(age >= startAge) {
        const base = (plan.p2.cpp65 || 0) * cppAdjFactor(startAge);
        cpp = base * Math.pow(1 + cppIndex(), year - startYear);
      }
      if(!p1Alive && p1DeathYear && year > p1DeathYear){
        const survAge = year - plan.p2.dob;
        const survBase = survAge < 65 ? plan.p2.cppSurvivor_under65 : plan.p2.cppSurvivor_over65;
        const survNow  = (survBase || 0) * Math.pow(1 + cppIndex(), year - p1DeathYear);
        cpp = Math.min(cpp + survNow, cppMaxAtAge(year, Math.max(60, Math.min(70, survAge))));
      }
      return cpp;
    }

    function calcOAS_P1(year, startAge, p1Alive){
      const plan = D();
      if(!p1Alive) return 0;
      const age = year - plan.p1.dob;
      if(age < startAge) return 0;
      const bonus = 1 + (startAge-65)*0.006*12;
      const base = plan.p1.oasBase * bonus;
      const age75bonus = age >= 75 ? 1.10 : 1.0;
      const startYear = plan.p1.dob + startAge;
      return base * age75bonus * Math.pow(1 + oasIndex(), year-startYear);
    }

    function calcOAS_P2(year, startAge){
      const plan = D();
      const age = year - plan.p2.dob;
      if(age < startAge) return 0;
      const bonus = 1 + (startAge-65)*0.006*12;
      const base = plan.p2.oasBase * bonus;
      const age75bonus = age >= 75 ? 1.10 : 1.0;
      const startYear = plan.p2.dob + startAge;
      return base * age75bonus * Math.pow(1 + oasIndex(), year-startYear);
    }

    function calcSpending(year){
      const plan = D();
      const p1Age  = year - plan.p1.dob;
      const a = plan.assumptions;
      const retireYear = (a.retireYear && a.retireYear > 0)
        ? a.retireYear
        : ((plan.p1 && plan.p1.retireYear) || 2027);
      const startYear = Math.min(
        (a.planStart && a.planStart > 0) ? a.planStart : Infinity,
        retireYear
      );
      const inf = a.inflation;
      const idx = Math.pow(1 + inf, year - startYear);
      if(p1Age <= plan.spending.gogoEnd)   return plan.spending.gogo   * idx;
      if(p1Age <= plan.spending.slowgoEnd) return plan.spending.slowgo * idx;
      return plan.spending.nogo * idx;
    }

    function calcMortgage(balance, year){
      const plan = D();
      if(balance<=0) return {payment:0,interest:0,principal:0,newBalance:0};
      const monthlyRate = plan.mortgage.rate/12;
      let bal = balance;
      let annualInterest=0, annualPrincipal=0, annualPayment=0;
      for(let m=0;m<12;m++){
        if(bal <= 0) break;
        const interest = bal*monthlyRate;
        const principal = Math.min(bal, Math.max(0, plan.mortgage.monthly - interest));
        const payment = interest + principal;
        annualInterest  += interest;
        annualPrincipal += principal;
        annualPayment   += payment;
        bal = Math.max(0, bal - principal);
      }
      return {payment: annualPayment, interest: annualInterest, principal: annualPrincipal, newBalance: bal};
    }

    function calcLOC(balance){
      const plan = D();
      if(balance <= 0) return { payment: 0, interest: 0, principal: 0, newBalance: 0 };
      const rate = (plan.loc && plan.loc.rate) || 0.07;
      const interest = balance * rate;
      const principal = Math.min(balance, balance / 5);
      const payment   = interest + principal;
      return {
        payment, interest, principal,
        newBalance: Math.max(0, balance - principal)
      };
    }

    return {
      RRIF_RATES,
      rrif_min,
      lif_max,
      calcBracketTax,
      idxRate,
      cpiIndex,
      oasIndex,
      fedTaxIndex,
      onTaxIndex,
      calcTax,
      ontarioHealthPremium,
      oasClawback,
      calcDBPension,
      calcDBPension_P2,
      calcDBSurvivor,
      cppAdjFactor,
      cppIndex,
      CPP_MAX65_2026,
      cppMaxAtAge,
      calcCPP_P1,
      calcCPP_P2,
      calcOAS_P1,
      calcOAS_P2,
      calcSpending,
      calcMortgage,
      calcLOC,
    };
  }

  return {
    RRIF_RATES,
    rrif_min,
    lif_max,
    calcBracketTax,
    createTaxBenefitHelpers,
  };
})();

if(typeof module !== "undefined" && module.exports){
  module.exports = RetirementTaxBenefitHelpers;
}
