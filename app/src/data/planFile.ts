import {
  CLEAN_SCHEMA_VERSION,
  PLAN_FILE_TYPE,
  PLAN_FILE_VERSION,
  CleanResetPlanPayload,
  PlanFileV1,
  SCHEMA_VERSION,
  V2PlanPayload
} from '../types/plan';
import { createBlankPlan } from './defaultPlan';

type UnknownRecord = Record<string, unknown>;

export const OLD_PREVIEW_BLOCK_MESSAGE = 'This plan was created with an earlier version. Start a fresh plan to use the current features.';
export const UNSUPPORTED_FUTURE_BLOCK_MESSAGE =
  'This plan was created with a newer format this preview cannot open. Please use the newer planner version.';
export const RAW_PAYLOAD_BLOCK_MESSAGE = 'This file is not a supported plan file. Please start a new plan or open a saved plan from this preview.';
export const CLEAN_RESET_INVALID_MESSAGE = 'This plan is missing required current-format details. Start a fresh plan to use the current features.';

const p2BlankNumericFields = [
  'dob',
  'dobMonth',
  'retireYear',
  'salary',
  'annualRrspContrib',
  'annualTfsaContrib',
  'annualNonregContrib',
  'db_before65',
  'db_after65',
  'db_survivor_pct',
  'db_survivor_annual',
  'rrsp',
  'rrspRoom',
  'tfsa',
  'tfsaRoom',
  'tfsaAnnual',
  'lira',
  'lif',
  'nonreg',
  'nonregAcb',
  'nonregAnnual',
  'cpp70_monthly',
  'cpp65_monthly',
  'oas_monthly',
  'cpp70',
  'cpp65',
  'oasBase',
  'cppSurv_u65_mo',
  'cppSurv_o65_mo',
  'cppSurvivor_under65',
  'cppSurvivor_over65'
] as const;

function cloneJson<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

function finiteNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function hasFiniteNonNegativeNumber(value: unknown): boolean {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0;
}

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function hasOldPreviewSpendingShape(value: UnknownRecord): boolean {
  const spending = value.spending;
  return isRecord(spending) && ('gogo' in spending || 'slowgo' in spending || 'nogo' in spending) && !isRecord(value.p1);
}

function isWrappedPlanFile(value: UnknownRecord): boolean {
  return value.fileType === PLAN_FILE_TYPE;
}

function isCleanResetPayload(value: UnknownRecord): value is CleanResetPlanPayload & UnknownRecord {
  return value.schemaVersion === CLEAN_SCHEMA_VERSION;
}

function isUnsupportedFuturePayload(value: UnknownRecord): boolean {
  return typeof value.schemaVersion === 'string' && value.schemaVersion.startsWith('future-clean-reset-draft') && value.schemaVersion !== CLEAN_SCHEMA_VERSION;
}

export function p2LooksBlank(p2: unknown): boolean {
  if (!isRecord(p2)) return true;
  const name = String(p2.name || '').trim();
  const placeholderName = !name || name === '—' || name.toLowerCase() === 'person 2';
  const meaningfulFields = p2BlankNumericFields.some((key) => finiteNumber(p2[key]) > 0);
  return placeholderName && !meaningfulFields;
}

export function migrate(payload: unknown): V2PlanPayload {
  if (!isRecord(payload)) {
    throw new Error('This does not look like a retirement plan file.');
  }

  const d = cloneJson(payload) as UnknownRecord;
  let version = Number(d.schemaVersion || 1);

  if (version > SCHEMA_VERSION) {
    return d as V2PlanPayload;
  }

  while (version < SCHEMA_VERSION) {
    if (version === 1) {
      if (d.frank !== undefined) {
        d.p1 = d.frank;
        delete d.frank;
      }
      if (d.moon !== undefined) {
        d.p2 = d.moon;
        delete d.moon;
      }
      const assumptions = isRecord(d.assumptions) ? d.assumptions : undefined;
      if (assumptions && assumptions.frankDiesInSurvivor !== undefined) {
        assumptions.p1DiesInSurvivor = assumptions.frankDiesInSurvivor;
        delete assumptions.frankDiesInSurvivor;
      }
      d.schemaVersion = 2;
      version = 2;
    } else {
      break;
    }
  }

  d.schemaVersion = SCHEMA_VERSION;
  return d as V2PlanPayload;
}

export function normalizePlanPayload(payload: unknown): V2PlanPayload {
  const d = migrate(payload) as V2PlanPayload & UnknownRecord;
  if (!isRecord(d.p1) || !isRecord(d.assumptions)) {
    throw new Error('The plan file is missing required household fields.');
  }

  if (!isRecord(d.p2)) d.p2 = {};

  if (p2LooksBlank(d.p2)) {
    d.p2.name = '';
    p2BlankNumericFields.forEach((key) => {
      d.p2[key] = 0;
    });
  }

  const assumptions = d.assumptions as UnknownRecord;
  if (!Number.isFinite(Number(assumptions.retireYear)) || Number(assumptions.retireYear) <= 0) {
    const p1Retire = finiteNumber((d.p1 as UnknownRecord).retireYear);
    const p2Retire = p2LooksBlank(d.p2) ? 0 : finiteNumber((d.p2 as UnknownRecord).retireYear);
    assumptions.retireYear = p1Retire || p2Retire || 2027;
  }

  if (!Number.isFinite(Number(assumptions.planStart)) || Number(assumptions.planStart) <= 0) {
    assumptions.planStart = null;
  }

  d.spending ||= {};
  d.mortgage ||= {};
  d.loc ||= {};
  d.downsize ||= {};
  d.oneOffs ||= [];
  d.cashWedge ||= {};

  return d as V2PlanPayload;
}

export function cleanResetPayloadToV2Plan(payload: CleanResetPlanPayload): V2PlanPayload {
  if (!hasFiniteNonNegativeNumber(payload.minimumMonthlyExpensesExMortgage)) {
    throw new Error(CLEAN_RESET_INVALID_MESSAGE);
  }

  const plan = createBlankPlan();
  const annualFloor =
    Math.max(0, finiteNumber(payload.minimumMonthlyExpensesExMortgage) + finiteNumber(payload.mortgageMonthlyPayment)) * 12;
  const earlyAge = finiteNumber(payload.earlySpendingChangeAge) || 75;
  const laterAge = finiteNumber(payload.laterSpendingChangeAge) || 85;
  const p1BirthYear = payload.household?.p1BirthYear ? finiteNumber(payload.household.p1BirthYear) : 1965;
  const p2BirthYear = payload.household?.p2BirthYear ? finiteNumber(payload.household.p2BirthYear) : 0;

  plan.title = payload.title || 'Retirement plan';
  plan.p1.dob = p1BirthYear;
  plan.p1.retireYear = plan.assumptions.retireYear || 2030;
  plan.p1.db_startYear = plan.p1.retireYear;
  plan.p2.dob = p2BirthYear;
  plan.mortgage = { ...plan.mortgage, monthly: finiteNumber(payload.mortgageMonthlyPayment) };
  plan.spending = {
    gogo: annualFloor,
    gogoEnd: earlyAge,
    slowgo: annualFloor,
    slowgoEnd: laterAge,
    nogo: annualFloor
  };

  return normalizePlanPayload(plan);
}

export function planTitleFromD(plan: V2PlanPayload): string {
  if (plan.title && String(plan.title).trim()) return String(plan.title).trim();
  const p1 = plan.p1.name && plan.p1.name !== '—' ? plan.p1.name.trim() : '';
  const p2 = !p2LooksBlank(plan.p2) && plan.p2.name && plan.p2.name !== '—' ? plan.p2.name.trim() : '';
  if (p1 && p2) return `${p1} and ${p2} retirement plan`;
  if (p1) return `${p1} retirement plan`;
  return 'Retirement plan';
}

export function safeFilenamePart(value: string): string {
  return (
    String(value || 'retirement-plan')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'retirement-plan'
  );
}

export function createPlanFile(planPayload: unknown, now = new Date().toISOString()): PlanFileV1 {
  const plan = normalizePlanPayload(planPayload);
  const title = planTitleFromD(plan);
  return {
    fileType: PLAN_FILE_TYPE,
    fileVersion: PLAN_FILE_VERSION,
    exportedAt: now,
    app: {
      name: 'Canadian Retirement Planner',
      schemaVersion: SCHEMA_VERSION,
      storage: 'local-plan-file'
    },
    title,
    plan
  };
}

export function extractPlanPayload(fileObj: unknown): V2PlanPayload {
  if (!isRecord(fileObj)) {
    throw new Error('This does not look like a retirement plan file.');
  }
  const rawPlan = fileObj.fileType === PLAN_FILE_TYPE ? fileObj.plan : fileObj;
  if (!isRecord(rawPlan)) {
    throw new Error('The plan file is missing its plan payload.');
  }
  return normalizePlanPayload(rawPlan);
}

export function extractSupportedPlanFilePayload(fileObj: unknown): V2PlanPayload {
  if (!isRecord(fileObj)) {
    throw new Error('This does not look like a retirement plan file.');
  }

  if (!isWrappedPlanFile(fileObj)) {
    throw new Error(RAW_PAYLOAD_BLOCK_MESSAGE);
  }

  const rawPlan = fileObj.plan;
  if (!isRecord(rawPlan)) {
    throw new Error('The plan file is missing its plan payload.');
  }

  if (isCleanResetPayload(rawPlan)) {
    return cleanResetPayloadToV2Plan(rawPlan);
  }

  if (isUnsupportedFuturePayload(rawPlan)) {
    throw new Error(UNSUPPORTED_FUTURE_BLOCK_MESSAGE);
  }

  if (hasOldPreviewSpendingShape(rawPlan)) {
    throw new Error(OLD_PREVIEW_BLOCK_MESSAGE);
  }

  return normalizePlanPayload(rawPlan);
}

export function validatePlanFile(fileObj: unknown): { ok: true; plan: V2PlanPayload } | { ok: false; message: string } {
  try {
    return { ok: true, plan: extractSupportedPlanFilePayload(fileObj) };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Could not load plan file.'
    };
  }
}

export function roundTripPlanFile(planPayload: unknown): V2PlanPayload {
  return extractPlanPayload(createPlanFile(planPayload, '2026-05-01T00:00:00.000Z'));
}
