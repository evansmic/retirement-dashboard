import { p2LooksBlank } from './planFile';
import { V2PlanPayload } from '../types/plan';

export type PlanValidationIssue = {
  code: string;
  field: string;
  message: string;
};

export type PlanValidationResult = {
  blockers: PlanValidationIssue[];
  warnings: PlanValidationIssue[];
  canGenerate: boolean;
};

function n(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function inRange(value: unknown, min: number, max: number): boolean {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= min && parsed <= max;
}

export function validatePlanForGuidedIntake(plan: V2PlanPayload): PlanValidationResult {
  const blockers: PlanValidationIssue[] = [];
  const warnings: PlanValidationIssue[] = [];
  const p2Active = !p2LooksBlank(plan.p2);
  const planStart = n(plan.assumptions.planStart) || n(plan.assumptions.retireYear) || n(plan.p1.retireYear);
  const planEnd = n(plan.assumptions.planEnd);

  const block = (code: string, field: string, message: string) => blockers.push({ code, field, message });
  const warn = (code: string, field: string, message: string) => warnings.push({ code, field, message });

  if (!inRange(plan.p1.dob, 1900, 2026)) {
    block('p1_birth_year', 'Household', 'Person 1 needs a realistic birth year.');
  }
  if (!inRange(plan.p1.retireYear, 2026, 2100)) {
    block('p1_retirement_year', 'Household', 'Person 1 needs a retirement year between 2026 and 2100.');
  }
  if (p2Active) {
    if (!inRange(plan.p2.dob, 1900, 2026)) {
      block('p2_birth_year', 'Household', 'Person 2 is active and needs a realistic birth year.');
    }
    if (!inRange(plan.p2.retireYear, 2026, 2100)) {
      block('p2_retirement_year', 'Household', 'Person 2 is active and needs a retirement year between 2026 and 2100.');
    }
  }

  if (!inRange(planEnd, 2026, 2150) || planEnd <= planStart) {
    block('plan_end', 'Assumptions', 'Plan end must be after the plan start or retirement year.');
  }
  if (!inRange(plan.spending.gogo, 1, 1000000)) {
    block('gogo_spending', 'Spending', 'Go-go spending must be greater than zero and below $1,000,000.');
  }
  if (!inRange(plan.spending.gogoEnd, 50, 110) || !inRange(plan.spending.slowgoEnd, 50, 115)) {
    block('spending_phase_ages', 'Spending', 'Spending phase ending ages must be realistic.');
  }
  if (n(plan.spending.slowgoEnd) < n(plan.spending.gogoEnd)) {
    block('spending_phase_order', 'Spending', 'Slow-go age must be after the go-go age.');
  }
  if (!inRange(plan.assumptions.returnRate, -0.05, 0.15)) {
    block('return_rate', 'Assumptions', 'Return assumption must be between -5% and 15%.');
  }
  if (!inRange(plan.assumptions.inflation, 0, 0.1)) {
    block('inflation', 'Assumptions', 'Inflation assumption must be between 0% and 10%.');
  }
  if (n(plan.mortgage?.balance) < 0 || n(plan.loc?.balance) < 0) {
    block('negative_debt', 'Debts', 'Debt balances cannot be negative.');
  }

  if (!String(plan.p1.name || '').trim()) {
    warn('p1_name', 'Household', 'Person 1 has no display name.');
  }
  if (n(plan.p1.cpp65_monthly) <= 0 && n(plan.p1.cpp70_monthly) <= 0) {
    warn('p1_cpp', 'Income', 'Person 1 has no CPP estimate entered.');
  }
  if (n(plan.p1.oas_monthly) <= 0) {
    warn('p1_oas', 'Income', 'Person 1 has no OAS estimate entered.');
  }
  if (p2Active && n(plan.p2.cpp65_monthly) <= 0 && n(plan.p2.cpp70_monthly) <= 0) {
    warn('p2_cpp', 'Income', 'Person 2 has no CPP estimate entered.');
  }
  if (n(plan.p1.nonreg) > 0 && n(plan.p1.nonregAcb) <= 0) {
    warn('p1_nonreg_acb', 'Accounts', 'Person 1 has non-registered assets but no ACB entered.');
  }
  if (p2Active && n(plan.p2.nonreg) > 0 && n(plan.p2.nonregAcb) <= 0) {
    warn('p2_nonreg_acb', 'Accounts', 'Person 2 has non-registered assets but no ACB entered.');
  }
  if (n(plan.downsize?.year) > 0 && n(plan.downsize?.netProceeds) <= 0) {
    warn('downsize_proceeds', 'Real Estate', 'A downsize year is entered without net proceeds.');
  }
  if (n(plan.downsize?.netProceeds) > 0 && n(plan.downsize?.year) <= 0) {
    warn('downsize_year', 'Real Estate', 'Downsize proceeds are entered without a sale/downsize year.');
  }
  if (n(plan.p1.rrsp) + n(plan.p1.tfsa) + n(plan.p1.lif) + n(plan.p1.nonreg) + n(plan.cashWedge?.balance) <= 0) {
    warn('low_assets', 'Accounts', 'No investment or cash balances are entered for Person 1.');
  }

  return {
    blockers,
    warnings,
    canGenerate: blockers.length === 0
  };
}
