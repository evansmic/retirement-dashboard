export const SCHEMA_VERSION = 2 as const;
export const PLAN_FILE_TYPE = 'canadian-retirement-plan' as const;
export const PLAN_FILE_VERSION = 1 as const;

export type PlanPerson = {
  name?: string;
  dob?: number;
  dobMonth?: number;
  retireYear?: number;
  salary?: number;
  salaryRefYear?: number;
  salaryRaise?: number;
  annualRrspContrib?: number;
  annualTfsaContrib?: number;
  annualNonregContrib?: number;
  db_before65?: number;
  db_after65?: number;
  db_index?: number;
  db_startYear?: number;
  rrsp?: number;
  rrspRoom?: number;
  tfsa?: number;
  tfsaRoom?: number;
  tfsaAnnual?: number;
  lira?: number;
  lif?: number;
  nonreg?: number;
  nonregAcb?: number;
  nonregAnnual?: number;
  cpp70_monthly?: number;
  cpp65_monthly?: number;
  oas_monthly?: number;
  cpp70?: number;
  cpp65?: number;
  oasBase?: number;
  cppSurv_u65_mo?: number;
  cppSurv_o65_mo?: number;
  cppSurvivor_under65?: number;
  cppSurvivor_over65?: number;
};

export type Debt = {
  balance?: number;
  rate?: number;
  monthly?: number;
};

export type SpendingPlan = {
  gogo?: number;
  gogoEnd?: number;
  slowgo?: number;
  slowgoEnd?: number;
  nogo?: number;
};

export type DownsizeEvent = {
  year?: number;
  netProceeds?: number;
};

export type OneOffEvent = {
  year: number;
  amount: number;
  label: string;
};

export type CashWedge = {
  balance?: number;
  returnRate?: number;
  targetYears?: number;
};

export type SpousalRrsp = {
  contributor: string;
  contribs: Record<string, number>;
} | null;

export type PlanAssumptions = {
  retireYear?: number;
  planStart?: number | null;
  planEnd?: number;
  p1DiesInSurvivor?: number;
  returnRate?: number;
  inflation?: number;
  returnStdDev?: number;
  horizon?: number;
  youngerSpouseRrif?: boolean;
  cppSharing?: boolean;
  withdrawalOrder?: string;
  spousalRrsp?: SpousalRrsp;
};

export type V2PlanPayload = {
  schemaVersion: typeof SCHEMA_VERSION;
  title?: string;
  p1: PlanPerson;
  p2: PlanPerson;
  mortgage?: Debt;
  loc?: Debt;
  spending: SpendingPlan;
  inheritance?: number;
  downsize?: DownsizeEvent;
  oneOffs?: OneOffEvent[];
  cashWedge?: CashWedge;
  assumptions: PlanAssumptions;
};

export type PlanFileV1 = {
  fileType: typeof PLAN_FILE_TYPE;
  fileVersion: typeof PLAN_FILE_VERSION;
  exportedAt: string;
  app: {
    name: 'Canadian Retirement Planner';
    schemaVersion: typeof SCHEMA_VERSION;
    storage: 'local-plan-file';
  };
  title: string;
  plan: V2PlanPayload;
};

export type DomainPerson = {
  id: 'p1' | 'p2';
  displayName: string;
  birthYear: number;
  birthMonth: number;
  retirementYear: number;
  active: boolean;
  income: {
    salary: number;
    salaryRefYear: number;
    salaryRaise: number;
    dbBefore65: number;
    dbAfter65: number;
    dbIndex: number;
    dbStartYear: number;
    cpp65Monthly: number;
    cpp70Monthly: number;
    oasMonthly: number;
  };
  accounts: {
    rrsp: number;
    rrspRoom: number;
    tfsa: number;
    tfsaRoom: number;
    tfsaAnnual: number;
    lira: number;
    lif: number;
    nonreg: number;
    nonregAcb: number;
    nonregAnnual: number;
  };
};

export type DomainPlan = {
  schemaVersion: typeof SCHEMA_VERSION;
  title: string;
  household: {
    people: DomainPerson[];
  };
  debts: {
    mortgage: Debt;
    loc: Debt;
  };
  realEstate: {
    primaryResidence: {
      downsizeYear: number;
      downsizeNetProceeds: number;
    };
    secondaryResidence: null;
  };
  spending: Required<SpendingPlan>;
  events: {
    inheritance: number;
    oneOffs: OneOffEvent[];
  };
  cashWedge: Required<CashWedge>;
  assumptions: Required<Omit<PlanAssumptions, 'planStart' | 'spousalRrsp'>> & {
    planStart: number | null;
    spousalRrsp: SpousalRrsp;
  };
};

export type AnnualSimulationRow = {
  year: number;
  ageF: number;
  ageM: number;
  spending: number;
  grossIncome: number;
  tfsa_draw: number;
  nonreg_draw: number;
  cash_draw: number;
  totalTaxYear: number;
  totalAftaxYear: number;
  bal_total: number;
};

export type SimulationResult = {
  years: AnnualSimulationRow[];
};
