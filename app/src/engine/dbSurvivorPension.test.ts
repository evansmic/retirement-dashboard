import { describe, expect, it } from 'vitest';
import { runSimulation } from './runSimulation';
import { V2PlanPayload } from '../types/plan';

function survivorDbPlan(overrides: Partial<V2PlanPayload['p1']> = {}): V2PlanPayload {
  return {
    schemaVersion: 2,
    title: 'DB survivor pension test',
    p1: {
      name: 'Pension holder',
      dob: 1960,
      dobMonth: 1,
      retireYear: 2026,
      salary: 0,
      salaryRefYear: 2026,
      salaryRaise: 0,
      annualRrspContrib: 0,
      annualTfsaContrib: 0,
      annualNonregContrib: 0,
      db_before65: 0,
      db_after65: 40000,
      db_index: 0,
      db_startYear: 2026,
      rrsp: 200000,
      tfsa: 0,
      tfsaRoom: 0,
      tfsaAnnual: 0,
      lif: 0,
      nonreg: 0,
      nonregAcb: 0,
      nonregAnnual: 0,
      cpp65_monthly: 0,
      cpp70_monthly: 0,
      oas_monthly: 0,
      ...overrides
    },
    p2: {
      name: 'Surviving spouse',
      dob: 1962,
      dobMonth: 1,
      retireYear: 2026,
      salary: 0,
      salaryRefYear: 2026,
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
      rrsp: 100000,
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
    },
    mortgage: { balance: 0, rate: 0, monthly: 0 },
    loc: { balance: 0, rate: 0 },
    spending: { gogo: 30000, gogoEnd: 75, slowgo: 30000, slowgoEnd: 85, nogo: 30000 },
    inheritance: 0,
    downsize: { year: 0, netProceeds: 0 },
    oneOffs: [],
    cashWedge: { balance: 0, returnRate: 0, targetYears: 2 },
    assumptions: {
      retireYear: 2026,
      planStart: 2026,
      planEnd: 2030,
      p1DiesInSurvivor: 2027,
      returnRate: 0,
      inflation: 0,
      returnStdDev: 0,
      horizon: 95,
      youngerSpouseRrif: false,
      cppSharing: false,
      withdrawalOrder: 'default',
      spousalRrsp: null
    }
  };
}

function dbSurvivorInFirstFullSurvivorYear(overrides: Partial<V2PlanPayload['p1']> = {}): number {
  const result = runSimulation(survivorDbPlan(overrides), {
    cppAgeF: 65,
    cppAgeM: 65,
    oasAgeF: 65,
    oasAgeM: 65,
    meltdown: false,
    returnRate: 0,
    pensionSplit: false,
    p1Dies: 2027,
    withdrawalOrder: 'default'
  });
  return result.years.find((row) => row.year === 2028)?.dbSurvivor || 0;
}

describe('DB survivor pension modelling', () => {
  it('keeps the legacy 60% continuation when no explicit DB survivor input exists', () => {
    expect(dbSurvivorInFirstFullSurvivorYear()).toBeCloseTo(24000, 2);
  });

  it('uses a 50% DB survivor continuation when entered', () => {
    expect(dbSurvivorInFirstFullSurvivorYear({ db_survivor_pct: 0.5 })).toBeCloseTo(20000, 2);
  });

  it('uses a 60% DB survivor continuation when entered', () => {
    expect(dbSurvivorInFirstFullSurvivorYear({ db_survivor_pct: 0.6 })).toBeCloseTo(24000, 2);
  });

  it('uses a 100% DB survivor continuation when entered', () => {
    expect(dbSurvivorInFirstFullSurvivorYear({ db_survivor_pct: 1 })).toBeCloseTo(40000, 2);
  });

  it('lets a statement-specific annual amount override the percentage', () => {
    expect(dbSurvivorInFirstFullSurvivorYear({ db_survivor_pct: 0.5, db_survivor_annual: 31000 })).toBeCloseTo(31000, 2);
  });
});
