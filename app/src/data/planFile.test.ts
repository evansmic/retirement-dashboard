import { describe, expect, it } from 'vitest';
import { fromV2Payload } from './domainAdapter';
import { createPlanFile, extractPlanPayload, normalizePlanPayload, roundTripPlanFile } from './planFile';
import { PLAN_FILE_TYPE, PLAN_FILE_VERSION, SCHEMA_VERSION, V2PlanPayload } from '../types/plan';

const larryPlan: V2PlanPayload = {
  schemaVersion: 2,
  p1: {
    name: 'Larry',
    dob: 1962,
    dobMonth: 12,
    retireYear: 2028,
    salary: 100000,
    salaryRefYear: 2026,
    salaryRaise: 0.03,
    annualRrspContrib: 18000,
    annualTfsaContrib: 7000,
    annualNonregContrib: 0,
    db_before65: 20000,
    db_after65: 18000,
    db_index: 0.022,
    db_startYear: 2028,
    rrsp: 300000,
    tfsa: 100000,
    tfsaRoom: 22000,
    tfsaAnnual: 4000,
    lif: 0,
    nonreg: 0,
    nonregAcb: 0,
    nonregAnnual: 0,
    cpp70_monthly: 1800,
    cpp65_monthly: 1268,
    oas_monthly: 742
  },
  p2: {
    name: 'Person 2',
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
    cpp70_monthly: 0,
    cpp65_monthly: 0,
    oas_monthly: 0,
    cppSurv_u65_mo: 0,
    cppSurv_o65_mo: 0
  },
  mortgage: { balance: 0, rate: 0, monthly: 0 },
  loc: { balance: 0, rate: 0 },
  spending: { gogo: 70000, gogoEnd: 75, slowgo: 45000, slowgoEnd: 85, nogo: 40000 },
  inheritance: 0,
  downsize: { year: 2036, netProceeds: 100000 },
  oneOffs: [{ year: 2028, amount: 20000, label: 'Vacation' }],
  cashWedge: { balance: 145000, returnRate: 0.03, targetYears: 2.5 },
  assumptions: {
    retireYear: 0,
    planStart: null,
    planEnd: 2060,
    p1DiesInSurvivor: 0,
    returnRate: 0.0436,
    inflation: 0.021,
    returnStdDev: 0.1,
    horizon: 95,
    youngerSpouseRrif: false,
    cppSharing: false,
    withdrawalOrder: 'default',
    spousalRrsp: null
  }
};

describe('plan file adapters', () => {
  it('creates a stable local .plan.json wrapper', () => {
    const file = createPlanFile(larryPlan, '2026-05-01T00:00:00.000Z');

    expect(file.fileType).toBe(PLAN_FILE_TYPE);
    expect(file.fileVersion).toBe(PLAN_FILE_VERSION);
    expect(file.app.schemaVersion).toBe(SCHEMA_VERSION);
    expect(file.title).toBe('Larry retirement plan');
  });

  it('normalizes placeholder Person 2 and repairs retireYear for Larry-style single plans', () => {
    const normalized = normalizePlanPayload(larryPlan);

    expect(normalized.p2.name).toBe('');
    expect(normalized.p2.retireYear).toBe(0);
    expect(normalized.assumptions.retireYear).toBe(2028);
  });

  it('round-trips raw payloads and wrapped plan files without schema changes', () => {
    const roundTripped = roundTripPlanFile(larryPlan);
    const extracted = extractPlanPayload(createPlanFile(larryPlan));

    expect(roundTripped).toEqual(extracted);
    expect(roundTripped.schemaVersion).toBe(2);
  });

  it('builds the internal domain model without persisting schema v3', () => {
    const domain = fromV2Payload(larryPlan);

    expect(domain.schemaVersion).toBe(2);
    expect(domain.household.people.filter((person) => person.active)).toHaveLength(1);
    expect(domain.realEstate.primaryResidence.downsizeYear).toBe(2036);
    expect(domain.realEstate.secondaryResidence).toBeNull();
  });
});
