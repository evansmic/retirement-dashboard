import { DomainPerson, DomainPlan, PlanPerson, V2PlanPayload } from '../types/plan';
import { normalizePlanPayload, p2LooksBlank, planTitleFromD } from './planFile';

function n(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function personToDomain(id: 'p1' | 'p2', person: PlanPerson, active: boolean): DomainPerson {
  return {
    id,
    displayName: active ? person.name || (id === 'p1' ? 'Person 1' : 'Person 2') : '',
    birthYear: n(person.dob),
    birthMonth: n(person.dobMonth),
    retirementYear: n(person.retireYear),
    active,
    income: {
      salary: n(person.salary),
      salaryRefYear: n(person.salaryRefYear, 2026),
      salaryRaise: n(person.salaryRaise),
      dbBefore65: n(person.db_before65),
      dbAfter65: n(person.db_after65),
      dbIndex: n(person.db_index),
      dbStartYear: n(person.db_startYear),
      cpp65Monthly: n(person.cpp65_monthly, n(person.cpp65) / 12),
      cpp70Monthly: n(person.cpp70_monthly, n(person.cpp70) / 12),
      oasMonthly: n(person.oas_monthly, n(person.oasBase) / 12)
    },
    accounts: {
      rrsp: n(person.rrsp),
      rrspRoom: n(person.rrspRoom),
      tfsa: n(person.tfsa),
      tfsaRoom: n(person.tfsaRoom),
      tfsaAnnual: n(person.tfsaAnnual),
      lira: n(person.lira),
      lif: n(person.lif),
      nonreg: n(person.nonreg),
      nonregAcb: n(person.nonregAcb),
      nonregAnnual: n(person.nonregAnnual)
    }
  };
}

export function fromV2Payload(payload: unknown): DomainPlan {
  const plan = normalizePlanPayload(payload);
  const p2Active = !p2LooksBlank(plan.p2);

  return {
    schemaVersion: plan.schemaVersion,
    title: planTitleFromD(plan),
    household: {
      people: [
        personToDomain('p1', plan.p1, true),
        personToDomain('p2', plan.p2, p2Active)
      ]
    },
    debts: {
      mortgage: plan.mortgage || {},
      loc: plan.loc || {}
    },
    realEstate: {
      primaryResidence: {
        downsizeYear: n(plan.downsize?.year),
        downsizeNetProceeds: n(plan.downsize?.netProceeds)
      },
      secondaryResidence: null
    },
    spending: {
      gogo: n(plan.spending.gogo),
      gogoEnd: n(plan.spending.gogoEnd),
      slowgo: n(plan.spending.slowgo),
      slowgoEnd: n(plan.spending.slowgoEnd),
      nogo: n(plan.spending.nogo)
    },
    events: {
      inheritance: n(plan.inheritance),
      oneOffs: plan.oneOffs || []
    },
    cashWedge: {
      balance: n(plan.cashWedge?.balance),
      returnRate: n(plan.cashWedge?.returnRate),
      targetYears: n(plan.cashWedge?.targetYears)
    },
    assumptions: {
      retireYear: n(plan.assumptions.retireYear),
      planStart: plan.assumptions.planStart == null ? null : n(plan.assumptions.planStart),
      planEnd: n(plan.assumptions.planEnd),
      p1DiesInSurvivor: n(plan.assumptions.p1DiesInSurvivor),
      returnRate: n(plan.assumptions.returnRate),
      inflation: n(plan.assumptions.inflation),
      returnStdDev: n(plan.assumptions.returnStdDev),
      horizon: n(plan.assumptions.horizon),
      youngerSpouseRrif: Boolean(plan.assumptions.youngerSpouseRrif),
      cppSharing: Boolean(plan.assumptions.cppSharing),
      withdrawalOrder: plan.assumptions.withdrawalOrder || 'default',
      spousalRrsp: plan.assumptions.spousalRrsp || null
    }
  };
}

export function toV2Payload(domainPlan: DomainPlan, sourcePayload?: V2PlanPayload): V2PlanPayload {
  const base = sourcePayload ? normalizePlanPayload(sourcePayload) : undefined;
  if (!base) {
    throw new Error('A source v2 payload is required until schema v3 persistence is explicitly scoped.');
  }
  base.title = domainPlan.title;
  base.downsize = {
    year: domainPlan.realEstate.primaryResidence.downsizeYear,
    netProceeds: domainPlan.realEstate.primaryResidence.downsizeNetProceeds
  };
  return normalizePlanPayload(base);
}
