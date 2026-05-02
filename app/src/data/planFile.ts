import {
  PLAN_FILE_TYPE,
  PLAN_FILE_VERSION,
  PlanFileV1,
  SCHEMA_VERSION,
  V2PlanPayload
} from '../types/plan';

type UnknownRecord = Record<string, unknown>;

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

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
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

export function validatePlanFile(fileObj: unknown): { ok: true; plan: V2PlanPayload } | { ok: false; message: string } {
  try {
    return { ok: true, plan: extractPlanPayload(fileObj) };
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
