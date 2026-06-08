import { CLEAN_SCHEMA_VERSION, CleanResetPlanPayload, PLAN_FILE_TYPE, PLAN_FILE_VERSION, PlanFileV1, PlanPerson, V2PlanPayload } from '../types/plan';
import { createBlankPlan } from './defaultPlan';
import { cleanResetPayloadToV2Plan, extractPlanPayload, normalizePlanPayload } from './planFile';

export type ExamplePlanId =
  | 'diy-couple'
  | 'db-pension-couple'
  | 'single-late-career'
  | 'public-comparator-single'
  | 'retired-traditional'
  | 'fire-couple';

export type ExamplePlanCard = {
  id: ExamplePlanId;
  label: string;
  shortLabel: string;
  summary: string;
  bestFor: string;
  focus: string;
};

export type CleanExamplePlanId = 'singleMinimumFloor' | 'coupleTightFloor' | 'pensionCoupleSurvivor' | 'estateHeavyRoom';

export type CleanExamplePlanCard = {
  id: CleanExamplePlanId;
  label: string;
  summary: string;
  focus: string;
};

type PersonInput = PlanPerson & {
  cpp65Mo?: number;
  cpp70Mo?: number;
  oasMo?: number;
  cppSurvUnder65Mo?: number;
  cppSurvOver65Mo?: number;
};

const OAS_2026_MONTHLY = 742;

export const cleanExamplePlanCards: CleanExamplePlanCard[] = [
  {
    id: 'singleMinimumFloor',
    label: 'Single covered floor',
    summary: 'Single person with minimum monthly expenses covered under the modelled floor.',
    focus: 'Monthly floor coverage'
  },
  {
    id: 'coupleTightFloor',
    label: 'Couple with a tight floor',
    summary: 'Couple with a remaining mortgage and a minimum floor that needs careful review.',
    focus: 'Gap options and mortgage pressure'
  },
  {
    id: 'pensionCoupleSurvivor',
    label: 'Pension couple with survivor sensitivity',
    summary: 'Couple with DB pension income where survivor resilience needs to stay visible.',
    focus: 'Pension and survivor review'
  },
  {
    id: 'estateHeavyRoom',
    label: 'Estate-focused household',
    summary: 'Household with apparent room above the floor and an estate trade-off to review.',
    focus: 'Room above floor and estate intent'
  }
];

const cleanExamplePayloads: Record<CleanExamplePlanId, CleanResetPlanPayload> = {
  singleMinimumFloor: {
    schemaVersion: CLEAN_SCHEMA_VERSION,
    title: 'Single covered floor',
    minimumMonthlyExpensesExMortgage: 3600,
    mortgageMonthlyPayment: 0,
    earlySpendingChangeAge: 75,
    laterSpendingChangeAge: 85,
    province: 'ON',
    taxYear: 2026,
    household: {
      p1Name: 'Morgan',
      p1BirthYear: 1965,
      p1RetirementYear: 2030
    }
  },
  coupleTightFloor: {
    schemaVersion: CLEAN_SCHEMA_VERSION,
    title: 'Couple tight floor',
    minimumMonthlyExpensesExMortgage: 6200,
    mortgageMonthlyPayment: 1800,
    earlySpendingChangeAge: 74,
    laterSpendingChangeAge: 84,
    province: 'ON',
    taxYear: 2026,
    household: {
      p1Name: 'Amrita',
      p1BirthYear: 1964,
      p1RetirementYear: 2029,
      p2Name: 'Noah',
      p2BirthYear: 1966,
      p2RetirementYear: 2031
    }
  },
  pensionCoupleSurvivor: {
    schemaVersion: CLEAN_SCHEMA_VERSION,
    title: 'Pension couple survivor review',
    minimumMonthlyExpensesExMortgage: 5400,
    mortgageMonthlyPayment: 0,
    earlySpendingChangeAge: 76,
    laterSpendingChangeAge: 86,
    province: 'ON',
    taxYear: 2026,
    household: {
      p1Name: 'Evelyn',
      p1BirthYear: 1962,
      p1RetirementYear: 2027,
      p2Name: 'Marc',
      p2BirthYear: 1961,
      p2RetirementYear: 2027
    }
  },
  estateHeavyRoom: {
    schemaVersion: CLEAN_SCHEMA_VERSION,
    title: 'Estate-focused room above floor',
    minimumMonthlyExpensesExMortgage: 7000,
    mortgageMonthlyPayment: 0,
    earlySpendingChangeAge: 77,
    laterSpendingChangeAge: 87,
    province: 'ON',
    taxYear: 2026,
    downsizeYear: 2040,
    downsizeNetProceeds: 250000,
    household: {
      p1Name: 'Rina',
      p1BirthYear: 1960,
      p1RetirementYear: 2026,
      p2Name: 'Cal',
      p2BirthYear: 1959,
      p2RetirementYear: 2026
    }
  }
};

export const examplePlanCards: ExamplePlanCard[] = [
  {
    id: 'diy-couple',
    label: 'DIY couple, both working',
    shortLabel: 'DIY couple',
    summary: 'Mid-50s household with no DB pension, a mortgage, and staggered retirement dates.',
    bestFor: 'Seeing how salaries, savings, mortgage payments, and survivor review work together.',
    focus: 'Work income, retirement timing, spending fit'
  },
  {
    id: 'db-pension-couple',
    label: 'Public-sector couple with DB pensions',
    shortLabel: 'DB pension couple',
    summary: 'Late-50s teacher and nurse with strong pension income and estate/tax questions to review.',
    bestFor: 'Understanding a strongly funded plan where the question is how to use resources well.',
    focus: 'Pensions, survivor impact, estate intent'
  },
  {
    id: 'single-late-career',
    label: 'Single, late-career',
    shortLabel: 'Late-career single',
    summary: 'Solo late starter still working, with a thinner cushion and a mortgage balance.',
    bestFor: 'Seeing how the planner frames a workable but tighter retirement picture.',
    focus: 'Spending room, timing, resilience'
  },
  {
    id: 'public-comparator-single',
    label: 'Public comparator single',
    shortLabel: 'Simple single',
    summary: 'Plain age-65 single plan with flat spending, CPP/OAS, RRSP, and TFSA only.',
    bestFor: 'Comparing a simple retirement case against public calculator expectations.',
    focus: 'Baseline income, withdrawals, taxes'
  },
  {
    id: 'retired-traditional',
    label: 'Already retired couple',
    shortLabel: 'Already retired',
    summary: 'Retired couple drawing CPP/OAS and managing registered, TFSA, and taxable assets.',
    bestFor: 'Reviewing a household that has already moved from saving to drawing income.',
    focus: 'Withdrawal order, taxes, survivor impact'
  },
  {
    id: 'fire-couple',
    label: 'Early-retired couple',
    shortLabel: 'Early retired',
    summary: 'Younger retired couple with a long runway before CPP/OAS and a large taxable account.',
    bestFor: 'Stress-testing a long retirement where bridge years and tax timing matter.',
    focus: 'Long horizon, non-registered assets, tax timing'
  }
];

function person(input: PersonInput): PlanPerson {
  const { cpp65Mo, cpp70Mo, oasMo, cppSurvUnder65Mo, cppSurvOver65Mo, ...personFields } = input;
  const cpp65 = cpp65Mo || personFields.cpp65_monthly || 0;
  const cpp70 = cpp70Mo || personFields.cpp70_monthly || 0;
  const oas = oasMo || personFields.oas_monthly || OAS_2026_MONTHLY;
  const cppSurvUnder65 = cppSurvUnder65Mo || personFields.cppSurv_u65_mo || 0;
  const cppSurvOver65 = cppSurvOver65Mo || personFields.cppSurv_o65_mo || 0;
  const result: PlanPerson = {
    ...personFields,
    cpp65_monthly: cpp65,
    cpp70_monthly: cpp70,
    oas_monthly: oas,
    cpp65: Math.round(cpp65 * 12),
    cpp70: Math.round(cpp70 * 12),
    oasBase: Math.round(oas * 12)
  };

  if (cppSurvUnder65) {
    result.cppSurv_u65_mo = cppSurvUnder65;
    result.cppSurvivor_under65 = Math.round(cppSurvUnder65 * 12);
  }
  if (cppSurvOver65) {
    result.cppSurv_o65_mo = cppSurvOver65;
    result.cppSurvivor_over65 = Math.round(cppSurvOver65 * 12);
  }
  return result;
}

function emptyPerson2(): PlanPerson {
  return {
    name: '',
    dob: 0,
    dobMonth: 0,
    retireYear: 0,
    salary: 0,
    salaryRefYear: 0,
    salaryRaise: 0,
    annualRrspContrib: 0,
    annualTfsaContrib: 0,
    annualNonregContrib: 0,
    db_before65: 0,
    db_after65: 0,
    db_index: 0,
    db_startYear: 0,
    db_survivor_pct: 0,
    db_survivor_annual: 0,
    rrsp: 0,
    rrspRoom: 0,
    tfsa: 0,
    tfsaRoom: 0,
    tfsaAnnual: 0,
    lira: 0,
    lif: 0,
    nonreg: 0,
    nonregAcb: 0,
    nonregAnnual: 0,
    cpp65_monthly: 0,
    cpp70_monthly: 0,
    oas_monthly: 0,
    cppSurv_u65_mo: 0,
    cppSurv_o65_mo: 0
  };
}

function basePlan(title: string, retireYear: number, p1DiesInSurvivor = 0): V2PlanPayload {
  const plan = createBlankPlan();
  plan.title = title;
  plan.assumptions = {
    ...plan.assumptions,
    retireYear,
    planStart: null,
    planEnd: 2065,
    p1DiesInSurvivor,
    withdrawalOrder: 'default'
  };
  return plan;
}

function diyCouple(): V2PlanPayload {
  const plan = basePlan('Sarah and David DIY couple', 2031, 2028);
  plan.p1 = person({
    name: 'Sarah',
    dob: 1969,
    dobMonth: 6,
    retireYear: 2031,
    salary: 95000,
    salaryRefYear: 2026,
    salaryRaise: 0.03,
    annualRrspContrib: 14000,
    annualTfsaContrib: 7000,
    annualNonregContrib: 0,
    db_before65: 0,
    db_after65: 0,
    db_index: 0.022,
    db_startYear: 2031,
    rrsp: 250000,
    rrspRoom: 0,
    tfsa: 80000,
    tfsaRoom: 7000,
    tfsaAnnual: 7000,
    lif: 0,
    nonreg: 40000,
    nonregAcb: 35000,
    nonregAnnual: 0,
    cpp65Mo: 986,
    cpp70Mo: 1400
  });
  plan.p2 = person({
    name: 'David',
    dob: 1971,
    dobMonth: 9,
    retireYear: 2034,
    salary: 75000,
    salaryRefYear: 2026,
    salaryRaise: 0.03,
    annualRrspContrib: 11000,
    annualTfsaContrib: 7000,
    annualNonregContrib: 0,
    db_before65: 0,
    db_after65: 0,
    db_index: 0.022,
    db_startYear: 2034,
    rrsp: 180000,
    rrspRoom: 30000,
    tfsa: 65000,
    tfsaRoom: 7000,
    tfsaAnnual: 0,
    lira: 0,
    lif: 0,
    nonreg: 0,
    nonregAcb: 0,
    nonregAnnual: 0,
    cpp65Mo: 845,
    cpp70Mo: 1200,
    cppSurvUnder65Mo: 480,
    cppSurvOver65Mo: 540
  });
  plan.mortgage = { balance: 150000, rate: 0.055, monthly: 1750 };
  plan.spending = { gogo: 80000, gogoEnd: 75, slowgo: 65000, slowgoEnd: 85, nogo: 50000 };
  return plan;
}

function dbPensionCouple(): V2PlanPayload {
  const plan = basePlan('Robert and Margaret DB pension couple', 2028, 2028);
  plan.p1 = person({
    name: 'Robert',
    dob: 1968,
    dobMonth: 8,
    retireYear: 2028,
    salary: 115000,
    salaryRefYear: 2026,
    salaryRaise: 0.03,
    annualRrspContrib: 0,
    annualTfsaContrib: 7000,
    annualNonregContrib: 0,
    db_before65: 67200,
    db_after65: 52940,
    db_index: 0.022,
    db_startYear: 2028,
    db_survivor_pct: 0.6,
    db_survivor_annual: 0,
    rrsp: 140000,
    rrspRoom: 0,
    tfsa: 90000,
    tfsaRoom: 7000,
    tfsaAnnual: 7000,
    lif: 0,
    nonreg: 0,
    nonregAcb: 0,
    nonregAnnual: 0,
    cpp65Mo: 1250,
    cpp70Mo: 1775
  });
  plan.p2 = person({
    name: 'Margaret',
    dob: 1967,
    dobMonth: 5,
    retireYear: 2027,
    salary: 110000,
    salaryRefYear: 2026,
    salaryRaise: 0.03,
    annualRrspContrib: 0,
    annualTfsaContrib: 7000,
    annualNonregContrib: 0,
    db_before65: 60000,
    db_after65: 49300,
    db_index: 0.022,
    db_startYear: 2027,
    db_survivor_pct: 0.6,
    db_survivor_annual: 0,
    rrsp: 150000,
    rrspRoom: 0,
    tfsa: 85000,
    tfsaRoom: 7000,
    tfsaAnnual: 7000,
    lira: 0,
    lif: 0,
    nonreg: 20000,
    nonregAcb: 18000,
    nonregAnnual: 0,
    cpp65Mo: 1200,
    cpp70Mo: 1700,
    cppSurvUnder65Mo: 530,
    cppSurvOver65Mo: 600
  });
  plan.spending = { gogo: 90000, gogoEnd: 75, slowgo: 75000, slowgoEnd: 85, nogo: 55000 };
  return plan;
}

function singleLateCareer(): V2PlanPayload {
  const plan = basePlan('Lisa late-career single', 2038);
  plan.p1 = person({
    name: 'Lisa',
    dob: 1971,
    dobMonth: 4,
    retireYear: 2038,
    salary: 70000,
    salaryRefYear: 2026,
    salaryRaise: 0.025,
    annualRrspContrib: 7000,
    annualTfsaContrib: 7000,
    annualNonregContrib: 0,
    db_before65: 0,
    db_after65: 0,
    db_index: 0.022,
    db_startYear: 2038,
    rrsp: 120000,
    rrspRoom: 0,
    tfsa: 35000,
    tfsaRoom: 7000,
    tfsaAnnual: 7000,
    lif: 0,
    nonreg: 10000,
    nonregAcb: 9000,
    nonregAnnual: 0,
    cpp65Mo: 850,
    cpp70Mo: 1207
  });
  plan.p2 = emptyPerson2();
  plan.mortgage = { balance: 80000, rate: 0.055, monthly: 900 };
  plan.spending = { gogo: 50000, gogoEnd: 75, slowgo: 42000, slowgoEnd: 85, nogo: 35000 };
  return plan;
}

function publicComparatorSingle(): V2PlanPayload {
  const plan = basePlan('Pat public comparator single', 2026);
  plan.p1 = person({
    name: 'Pat',
    dob: 1961,
    dobMonth: 6,
    retireYear: 2026,
    salary: 0,
    salaryRefYear: 2026,
    salaryRaise: 0,
    annualRrspContrib: 0,
    annualTfsaContrib: 0,
    annualNonregContrib: 0,
    db_before65: 0,
    db_after65: 0,
    db_index: 0.022,
    db_startYear: 2026,
    rrsp: 350000,
    rrspRoom: 0,
    tfsa: 80000,
    tfsaRoom: 0,
    tfsaAnnual: 0,
    lif: 0,
    nonreg: 0,
    nonregAcb: 0,
    nonregAnnual: 0,
    cpp65Mo: 1000,
    cpp70Mo: 1420
  });
  plan.p2 = emptyPerson2();
  plan.spending = { gogo: 33000, gogoEnd: 75, slowgo: 33000, slowgoEnd: 85, nogo: 33000 };
  plan.assumptions.planEnd = 2056;
  return plan;
}

function retiredTraditional(): V2PlanPayload {
  const plan = basePlan('Bill and Linda already retired couple', 2026, 2028);
  plan.p1 = person({
    name: 'Bill',
    dob: 1958,
    dobMonth: 2,
    retireYear: 2026,
    salary: 0,
    salaryRefYear: 2026,
    salaryRaise: 0,
    annualRrspContrib: 0,
    annualTfsaContrib: 7000,
    annualNonregContrib: 0,
    db_before65: 0,
    db_after65: 0,
    db_index: 0.022,
    db_startYear: 2026,
    rrsp: 400000,
    rrspRoom: 0,
    tfsa: 130000,
    tfsaRoom: 7000,
    tfsaAnnual: 7000,
    lif: 50000,
    nonreg: 200000,
    nonregAcb: 130000,
    nonregAnnual: 0,
    cpp65Mo: 1250,
    cpp70Mo: 1775
  });
  plan.p2 = person({
    name: 'Linda',
    dob: 1961,
    dobMonth: 11,
    retireYear: 2026,
    salary: 0,
    salaryRefYear: 2026,
    salaryRaise: 0,
    annualRrspContrib: 0,
    annualTfsaContrib: 7000,
    annualNonregContrib: 0,
    db_before65: 0,
    db_after65: 0,
    db_index: 0.022,
    db_startYear: 2026,
    rrsp: 250000,
    rrspRoom: 0,
    tfsa: 95000,
    tfsaRoom: 7000,
    tfsaAnnual: 7000,
    lira: 30000,
    lif: 0,
    nonreg: 40000,
    nonregAcb: 35000,
    nonregAnnual: 0,
    cpp65Mo: 1050,
    cpp70Mo: 1490,
    cppSurvUnder65Mo: 530,
    cppSurvOver65Mo: 600
  });
  plan.spending = { gogo: 75000, gogoEnd: 75, slowgo: 65000, slowgoEnd: 85, nogo: 50000 };
  return plan;
}

function fireCouple(): V2PlanPayload {
  const plan = basePlan('Alex and Jordan early-retired couple', 2026, 2028);
  plan.p1 = person({
    name: 'Alex',
    dob: 1981,
    dobMonth: 7,
    retireYear: 2026,
    salary: 0,
    salaryRefYear: 2026,
    salaryRaise: 0,
    annualRrspContrib: 0,
    annualTfsaContrib: 7000,
    annualNonregContrib: 0,
    db_before65: 0,
    db_after65: 0,
    db_index: 0.022,
    db_startYear: 2026,
    rrsp: 400000,
    rrspRoom: 0,
    tfsa: 130000,
    tfsaRoom: 7000,
    tfsaAnnual: 7000,
    lif: 0,
    nonreg: 600000,
    nonregAcb: 400000,
    nonregAnnual: 0,
    cpp65Mo: 635,
    cpp70Mo: 900
  });
  plan.p2 = person({
    name: 'Jordan',
    dob: 1983,
    dobMonth: 3,
    retireYear: 2026,
    salary: 0,
    salaryRefYear: 2026,
    salaryRaise: 0,
    annualRrspContrib: 0,
    annualTfsaContrib: 7000,
    annualNonregContrib: 0,
    db_before65: 0,
    db_after65: 0,
    db_index: 0.022,
    db_startYear: 2026,
    rrsp: 350000,
    rrspRoom: 0,
    tfsa: 115000,
    tfsaRoom: 7000,
    tfsaAnnual: 7000,
    lira: 0,
    lif: 0,
    nonreg: 50000,
    nonregAcb: 40000,
    nonregAnnual: 0,
    cpp65Mo: 600,
    cpp70Mo: 850,
    cppSurvUnder65Mo: 380,
    cppSurvOver65Mo: 425
  });
  plan.spending = { gogo: 60000, gogoEnd: 75, slowgo: 55000, slowgoEnd: 85, nogo: 45000 };
  plan.assumptions.planEnd = 2076;
  return plan;
}

const exampleFactories: Record<ExamplePlanId, () => V2PlanPayload> = {
  'diy-couple': diyCouple,
  'db-pension-couple': dbPensionCouple,
  'single-late-career': singleLateCareer,
  'public-comparator-single': publicComparatorSingle,
  'retired-traditional': retiredTraditional,
  'fire-couple': fireCouple
};

export function createCleanExamplePayload(id: CleanExamplePlanId): CleanResetPlanPayload {
  return JSON.parse(JSON.stringify(cleanExamplePayloads[id])) as CleanResetPlanPayload;
}

export function createCleanExamplePlanFile(id: CleanExamplePlanId, now = '2026-05-01T00:00:00.000Z'): PlanFileV1 {
  const plan = createCleanExamplePayload(id);
  return {
    fileType: PLAN_FILE_TYPE,
    fileVersion: PLAN_FILE_VERSION,
    exportedAt: now,
    app: {
      name: 'Canadian Retirement Planner',
      schemaVersion: CLEAN_SCHEMA_VERSION,
      storage: 'local-plan-file'
    },
    title: plan.title || 'Retirement plan',
    plan
  };
}

function applyCleanExampleRuntimePlanningSeeds(plan: V2PlanPayload, id: CleanExamplePlanId): V2PlanPayload {
  const seeded = structuredClone(plan);

  if (id === 'singleMinimumFloor') {
    seeded.p1 = person({
      ...seeded.p1,
      salary: 76000,
      salaryRefYear: 2026,
      salaryRaise: 0.025,
      annualRrspContrib: 9000,
      annualTfsaContrib: 5000,
      rrsp: 260000,
      tfsa: 95000,
      tfsaRoom: 7000,
      tfsaAnnual: 5000,
      nonreg: 35000,
      nonregAcb: 32000,
      cpp65Mo: 980,
      cpp70Mo: 1390,
      oasMo: OAS_2026_MONTHLY
    });
  }

  if (id === 'coupleTightFloor') {
    seeded.p1 = person({
      ...seeded.p1,
      salary: 102000,
      salaryRefYear: 2026,
      salaryRaise: 0.025,
      annualRrspContrib: 11000,
      annualTfsaContrib: 4000,
      rrsp: 210000,
      tfsa: 52000,
      tfsaRoom: 7000,
      tfsaAnnual: 4000,
      nonreg: 15000,
      nonregAcb: 14000,
      cpp65Mo: 1050,
      cpp70Mo: 1490,
      oasMo: OAS_2026_MONTHLY,
      cppSurvUnder65Mo: 420,
      cppSurvOver65Mo: 510
    });
    seeded.p2 = person({
      ...seeded.p2,
      salary: 78000,
      salaryRefYear: 2026,
      salaryRaise: 0.025,
      annualRrspContrib: 8000,
      annualTfsaContrib: 3000,
      rrsp: 145000,
      tfsa: 41000,
      tfsaRoom: 7000,
      tfsaAnnual: 3000,
      cpp65Mo: 840,
      cpp70Mo: 1190,
      oasMo: OAS_2026_MONTHLY,
      cppSurvUnder65Mo: 360,
      cppSurvOver65Mo: 450
    });
    seeded.mortgage = { ...seeded.mortgage, balance: 260000, rate: 0.052, monthly: seeded.mortgage?.monthly || 1800 };
  }

  if (id === 'pensionCoupleSurvivor') {
    seeded.assumptions = { ...seeded.assumptions, p1DiesInSurvivor: 2037 };
    seeded.p1 = person({
      ...seeded.p1,
      salary: 112000,
      salaryRefYear: 2026,
      salaryRaise: 0.02,
      db_before65: 52000,
      db_after65: 44000,
      db_index: 0.02,
      db_startYear: seeded.p1.retireYear,
      db_survivor_pct: 0.6,
      rrsp: 180000,
      tfsa: 115000,
      tfsaRoom: 7000,
      tfsaAnnual: 7000,
      cpp65Mo: 1120,
      cpp70Mo: 1590,
      oasMo: OAS_2026_MONTHLY,
      cppSurvUnder65Mo: 460,
      cppSurvOver65Mo: 560
    });
    seeded.p2 = person({
      ...seeded.p2,
      salary: 96000,
      salaryRefYear: 2026,
      salaryRaise: 0.02,
      db_before65: 41000,
      db_after65: 35000,
      db_index: 0.02,
      db_startYear: seeded.p2.retireYear,
      db_survivor_pct: 0.6,
      rrsp: 140000,
      tfsa: 98000,
      tfsaRoom: 7000,
      tfsaAnnual: 7000,
      cpp65Mo: 990,
      cpp70Mo: 1400,
      oasMo: OAS_2026_MONTHLY,
      cppSurvUnder65Mo: 410,
      cppSurvOver65Mo: 500
    });
  }

  if (id === 'estateHeavyRoom') {
    seeded.inheritance = 350000;
    seeded.p1 = person({
      ...seeded.p1,
      salary: 0,
      salaryRefYear: 2026,
      rrsp: 420000,
      tfsa: 125000,
      tfsaRoom: 7000,
      tfsaAnnual: 0,
      nonreg: 360000,
      nonregAcb: 250000,
      cpp65Mo: 1160,
      cpp70Mo: 1640,
      oasMo: OAS_2026_MONTHLY,
      cppSurvUnder65Mo: 500,
      cppSurvOver65Mo: 600
    });
    seeded.p2 = person({
      ...seeded.p2,
      salary: 0,
      salaryRefYear: 2026,
      rrsp: 360000,
      tfsa: 118000,
      tfsaRoom: 7000,
      tfsaAnnual: 0,
      nonreg: 240000,
      nonregAcb: 175000,
      cpp65Mo: 1040,
      cpp70Mo: 1470,
      oasMo: OAS_2026_MONTHLY,
      cppSurvUnder65Mo: 430,
      cppSurvOver65Mo: 520
    });
  }

  return normalizePlanPayload(seeded);
}

export function createCleanExampleRuntimePlan(id: CleanExamplePlanId): V2PlanPayload {
  return applyCleanExampleRuntimePlanningSeeds(cleanResetPayloadToV2Plan(createCleanExamplePayload(id)), id);
}

export function createExamplePlan(id: ExamplePlanId): V2PlanPayload {
  return extractPlanPayload(exampleFactories[id]());
}
