import { describe, expect, it } from 'vitest';
import { fromV2Payload } from './domainAdapter';
import { createPlanFile, extractPlanPayload, normalizePlanPayload, roundTripPlanFile, validatePlanFile } from './planFile';
import { CLEAN_SCHEMA_VERSION, PLAN_FILE_TYPE, PLAN_FILE_VERSION, SCHEMA_VERSION, V2PlanPayload } from '../types/plan';
import {
  futureCleanSchemaResetGoNoGoRows,
  futureCleanSchemaResetProductionPreflightCloseoutRows,
  futureCleanSchemaResetProductionPreflightRows,
  summarizeFutureCleanSchemaResetTestAdapter
} from './futurePlanFormat';

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
    expect(file.app.schemaVersion).toBe(CLEAN_SCHEMA_VERSION);
    expect(file.title).toBe('Larry retirement plan');
    expect(file.plan.schemaVersion).toBe(CLEAN_SCHEMA_VERSION);
    expect(file.plan.minimumMonthlyExpensesExMortgage).toBeCloseTo(5833.333333333333);
    expect(file.plan.downsizeYear).toBe(2036);
    expect(file.plan.downsizeNetProceeds).toBe(100000);
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

  it('keeps clean plan files accepted through the production validator', () => {
    const result = validatePlanFile(createPlanFile(larryPlan, '2026-05-01T00:00:00.000Z'));

    expect(result).toMatchObject({ ok: true });
    if (result.ok) {
      expect(result.plan.schemaVersion).toBe(2);
      expect(result.plan.title).toBe('Larry retirement plan');
      expect(result.plan.spending.gogo).toBeCloseTo(70000);
    }
  });

  it('strips runtime capacity objective packets from editable plan files', () => {
    const runtimePlan = {
      ...larryPlan,
      capacityObjective: {
        monthlyAfterTaxCapacity: 6500,
        minimumMonthlyExpenseFloor: 5000,
        optionalMonthlyRoom: 1500
      },
      capacityReportReadiness: {
        reportFields: ['monthlyAfterTaxCapacity']
      },
      capacityExportGuard: {
        forbiddenSavedKeys: ['capacityObjective']
      },
      annualSequencingPrepContract: {
        status: 'contractOnly',
        blockedOutputs: ['annualAccountInstructions', 'accountOrder']
      },
      annualSequencingInputAdapter: {
        status: 'readyForDraftPlanning',
        availableAccountBalanceFields: ['bal_rrsp', 'bal_total']
      },
      boundedOptimizer: {
        status: 'ready'
      },
      optimizerOutput: {
        selectedCandidateId: 'baseline'
      },
      annualAccountInstructions: [{ year: 2030, account: 'rrsp', amount: 10000 }]
    };

    const saved = createPlanFile(runtimePlan, '2026-05-03T00:00:00.000Z');
    const serialized = JSON.stringify(saved);

    expect(saved.plan).not.toHaveProperty('capacityObjective');
    expect(saved.plan).not.toHaveProperty('capacityReportReadiness');
    expect(saved.plan).not.toHaveProperty('capacityExportGuard');
    expect(saved.plan).not.toHaveProperty('annualSequencingPrepContract');
    expect(saved.plan).not.toHaveProperty('annualSequencingInputAdapter');
    expect(saved.plan).not.toHaveProperty('boundedOptimizer');
    expect(saved.plan).not.toHaveProperty('optimizerOutput');
    expect(saved.plan).not.toHaveProperty('annualAccountInstructions');
    expect(serialized).not.toContain('monthlyAfterTaxCapacity');
    expect(serialized).not.toContain('annualSequencingPrepContract');
    expect(serialized).not.toContain('annualSequencingInputAdapter');
    expect(serialized).not.toContain('accountOrder');
    expect(serialized).not.toContain('selectedCandidateId');
    expect(serialized).not.toContain('annualAccountInstructions');
    expect(saved.plan.schemaVersion).toBe(CLEAN_SCHEMA_VERSION);
  });

  it('accepts wrapped clean reset plan files and maps the floor into the current runtime plan shape', () => {
    const result = validatePlanFile({
      fileType: PLAN_FILE_TYPE,
      fileVersion: PLAN_FILE_VERSION,
      exportedAt: '2026-05-01T00:00:00.000Z',
      app: {
        name: 'Canadian Retirement Planner',
        schemaVersion: CLEAN_SCHEMA_VERSION,
        storage: 'local-plan-file'
      },
      title: 'Clean floor plan',
      plan: {
        schemaVersion: CLEAN_SCHEMA_VERSION,
        title: 'Clean floor plan',
        minimumMonthlyExpensesExMortgage: 3600,
        mortgageMonthlyPayment: 400,
        earlySpendingChangeAge: 76,
        laterSpendingChangeAge: 86,
        province: 'ON',
        taxYear: 2026,
        household: {
          p1BirthYear: 1966,
          p2BirthYear: null
        }
      }
    });

    expect(result).toMatchObject({ ok: true });
    if (result.ok) {
      expect(result.plan.schemaVersion).toBe(2);
      expect(result.plan.title).toBe('Clean floor plan');
      expect(result.plan.spending).toEqual({ gogo: 48000, gogoEnd: 76, slowgo: 48000, slowgoEnd: 86, nogo: 48000 });
      expect(result.plan.mortgage?.monthly).toBe(400);
      expect(result.plan).not.toHaveProperty('confidentMonthlyAfterTaxSpend');
      expect(result.plan).not.toHaveProperty('fundingTrace');
    }
  });

  it('saves a clean reset import back as a clean schema plan file', () => {
    const imported = validatePlanFile({
      fileType: PLAN_FILE_TYPE,
      fileVersion: PLAN_FILE_VERSION,
      exportedAt: '2026-05-01T00:00:00.000Z',
      app: {
        name: 'Canadian Retirement Planner',
        schemaVersion: CLEAN_SCHEMA_VERSION,
        storage: 'local-plan-file'
      },
      title: 'Clean save bridge',
      plan: {
        schemaVersion: CLEAN_SCHEMA_VERSION,
        title: 'Clean save bridge',
        minimumMonthlyExpensesExMortgage: 3000,
        mortgageMonthlyPayment: 500,
        province: 'ON',
        taxYear: 2026,
        household: {
          p1BirthYear: 1964
        }
      }
    });

    expect(imported).toMatchObject({ ok: true });
    if (imported.ok) {
      const saved = createPlanFile(imported.plan, '2026-05-02T00:00:00.000Z');
      const reopened = validatePlanFile(saved);

      expect(saved.app.schemaVersion).toBe(CLEAN_SCHEMA_VERSION);
      expect(saved.plan.schemaVersion).toBe(CLEAN_SCHEMA_VERSION);
      expect(saved.plan.minimumMonthlyExpensesExMortgage).toBe(3000);
      expect(saved.plan.mortgageMonthlyPayment).toBe(500);
      expect(reopened).toMatchObject({ ok: true });
    }
  });

  it('blocks incomplete clean reset imports without returning a partially mapped plan', () => {
    const result = validatePlanFile({
      fileType: PLAN_FILE_TYPE,
      fileVersion: PLAN_FILE_VERSION,
      exportedAt: '2026-05-01T00:00:00.000Z',
      app: {
        name: 'Canadian Retirement Planner',
        schemaVersion: CLEAN_SCHEMA_VERSION,
        storage: 'local-plan-file'
      },
      title: 'Incomplete clean file',
      plan: {
        schemaVersion: CLEAN_SCHEMA_VERSION,
        title: 'Incomplete clean file',
        province: 'ON',
        taxYear: 2026
      }
    });

    expect(result).toEqual({
      ok: false,
      message: 'This plan is missing required current-format details. Start a fresh plan to use the current features.'
    });
  });

  it('keeps clean reset imports as runtime inputs rather than engine output files', () => {
    const result = validatePlanFile({
      fileType: PLAN_FILE_TYPE,
      fileVersion: PLAN_FILE_VERSION,
      exportedAt: '2026-05-01T00:00:00.000Z',
      app: {
        name: 'Canadian Retirement Planner',
        schemaVersion: CLEAN_SCHEMA_VERSION,
        storage: 'local-plan-file'
      },
      title: 'Runtime only bridge',
      plan: {
        schemaVersion: CLEAN_SCHEMA_VERSION,
        title: 'Runtime only bridge',
        minimumMonthlyExpensesExMortgage: 2800,
        mortgageMonthlyPayment: 0,
        province: 'ON',
        taxYear: 2026
      }
    });

    expect(result).toMatchObject({ ok: true });
    if (result.ok) {
      const domain = fromV2Payload(result.plan);

      expect(domain.schemaVersion).toBe(2);
      expect(domain.spending.gogo).toBe(33600);
      expect(result.plan).not.toHaveProperty('optimizer');
      expect(result.plan).not.toHaveProperty('annualAccountSequencing');
      expect(result.plan).not.toHaveProperty('engineOutput');
    }
  });

  it('blocks raw unwrapped imports while leaving internal raw-payload cloning available', () => {
    const result = validatePlanFile(larryPlan);

    expect(result).toEqual({
      ok: false,
      message: 'This file is not a supported plan file. Please start a new plan or open a saved plan from this preview.'
    });
    expect(extractPlanPayload(larryPlan).schemaVersion).toBe(2);
  });

  it('requires clean reset imports to use the local plan-file wrapper', () => {
    expect(
      validatePlanFile({
        schemaVersion: CLEAN_SCHEMA_VERSION,
        title: 'Raw clean file',
        minimumMonthlyExpensesExMortgage: 3000,
        province: 'ON',
        taxYear: 2026
      })
    ).toEqual({
      ok: false,
      message: 'This file is not a supported plan file. Please start a new plan or open a saved plan from this preview.'
    });
  });

  it('blocks current editable v2 plan files now that tester legacy plans are retired', () => {
    expect(
      validatePlanFile({
        fileType: PLAN_FILE_TYPE,
        fileVersion: PLAN_FILE_VERSION,
        exportedAt: '2026-05-01T00:00:00.000Z',
        app: {
          name: 'Canadian Retirement Planner',
          schemaVersion: SCHEMA_VERSION,
          storage: 'local-plan-file'
        },
        title: 'Larry retirement plan',
        plan: larryPlan
      })
    ).toEqual({
      ok: false,
      message: 'This plan was created with an earlier version. Start a fresh plan to use the current features.'
    });
  });

  it('blocks older preview and unsupported future wrapped files with calm messages', () => {
    expect(
      validatePlanFile({
        fileType: PLAN_FILE_TYPE,
        fileVersion: PLAN_FILE_VERSION,
        plan: {
          schemaVersion: 2,
          spending: {
            gogo: 85000,
            slowgo: 72000,
            nogo: 62000
          },
          assumptions: {
            retireYear: 2032
          }
        }
      })
    ).toEqual({
      ok: false,
      message: 'This plan was created with an earlier version. Start a fresh plan to use the current features.'
    });

    expect(
      validatePlanFile({
        fileType: PLAN_FILE_TYPE,
        fileVersion: PLAN_FILE_VERSION,
        plan: {
          schemaVersion: 'future-clean-reset-draft-plus-one',
          futureOnlyField: true
        }
      })
    ).toEqual({
      ok: false,
      message: 'This plan was created with a newer format this preview cannot open. Please use the newer planner version.'
    });
  });

  it('builds the internal domain model without persisting schema v3', () => {
    const domain = fromV2Payload(larryPlan);

    expect(domain.schemaVersion).toBe(2);
    expect(domain.household.people.filter((person) => person.active)).toHaveLength(1);
    expect(domain.realEstate.primaryResidence.downsizeYear).toBe(2036);
    expect(domain.realEstate.secondaryResidence).toBeNull();
  });

  it('preflights clean reset boundaries while keeping production plan-file behavior unchanged', () => {
    const roundTripped = roundTripPlanFile(larryPlan);

    expect(
      futureCleanSchemaResetProductionPreflightRows({
        schemaVersion: SCHEMA_VERSION,
        planFileVersion: PLAN_FILE_VERSION,
        rawPayloadRoundTrips: roundTripped.schemaVersion === SCHEMA_VERSION,
        testAdapterSummary: summarizeFutureCleanSchemaResetTestAdapter()
      })
    ).toEqual([
      { id: 'currentSchemaV2', status: 'pass', detail: 'Production saved plan schema is still v2.' },
      { id: 'wrappedPlanFileV1', status: 'pass', detail: 'Production wrapper format is still plan-file v1.' },
      { id: 'rawPayloadStillAcceptedNow', status: 'pass', detail: 'Current raw payload round-trip behavior remains unchanged.' },
      { id: 'futureAdapterTestOnly', status: 'pass', detail: 'Future clean reset adapter remains test-only.' },
      { id: 'explicitSwitchRequired', status: 'pass', detail: 'Production schema/import switch still requires explicit approval.' }
    ]);
  });

  it('summarizes clean reset readiness as a go/no-go decision before production wiring', () => {
    const preflightRows = futureCleanSchemaResetProductionPreflightRows({
      schemaVersion: SCHEMA_VERSION,
      planFileVersion: PLAN_FILE_VERSION,
      rawPayloadRoundTrips: roundTripPlanFile(larryPlan).schemaVersion === SCHEMA_VERSION,
      testAdapterSummary: summarizeFutureCleanSchemaResetTestAdapter()
    });

    expect(futureCleanSchemaResetGoNoGoRows({ productionPreflightRows: preflightRows })).toEqual([
      {
        id: 'preflightComplete',
        status: 'pass',
        recommendation: 'approve-next-wiring-package',
        detail: 'Production, rollback, and adapter preflight rows are complete.'
      },
      {
        id: 'wiringScopeKnown',
        status: 'pass',
        recommendation: 'approve-next-wiring-package',
        detail: 'Next wiring scope is limited to wrapped future accept and old-preview/raw block behavior.'
      },
      {
        id: 'v1TrustKnown',
        status: 'pass',
        recommendation: 'approve-next-wiring-package',
        detail: 'V1 trust gates are documented before schema/import wiring.'
      },
      {
        id: 'schemaSwitchStillManual',
        status: 'pass',
        recommendation: 'approve-next-wiring-package',
        detail: 'Schema/import switch remains manual and explicit.'
      },
      {
        id: 'readyForGoNoGoDecision',
        status: 'pass',
        recommendation: 'approve-next-wiring-package',
        detail: 'The next package can be a real go/no-go decision for production wiring.'
      }
    ]);
  });

  it('closes clean reset production preflight at the actual wiring decision point', () => {
    const preflightRows = futureCleanSchemaResetProductionPreflightRows({
      schemaVersion: SCHEMA_VERSION,
      planFileVersion: PLAN_FILE_VERSION,
      rawPayloadRoundTrips: roundTripPlanFile(larryPlan).schemaVersion === SCHEMA_VERSION,
      testAdapterSummary: summarizeFutureCleanSchemaResetTestAdapter()
    });

    expect(futureCleanSchemaResetProductionPreflightCloseoutRows({ productionPreflightRows: preflightRows })).toEqual([
      { id: 'productionUnchanged', status: 'pass', detail: 'Current production schema and loader behavior remain unchanged.' },
      { id: 'preflightPassed', status: 'pass', detail: 'Production and rollback preflight rows pass.' },
      { id: 'goNoGoReady', status: 'pass', detail: 'The reset is ready for an explicit go/no-go wiring decision.' },
      { id: 'nextPackageIsActualWiring', status: 'pass', detail: 'The next package would be actual schema/import wiring if approved.' },
      { id: 'stopIfNotApproved', status: 'pass', detail: 'Stop before production wiring unless the next package is explicitly approved.' }
    ]);
  });
});
