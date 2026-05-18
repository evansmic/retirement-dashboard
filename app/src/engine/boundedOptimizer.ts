import { extractPlanPayload, p2LooksBlank } from '../data/planFile';
import type { SimulationResult, V2PlanPayload } from '../types/plan';
import { buildOptimizerContract, type OptimizerContract, type OptimizerLeverId } from './optimizerContract';
import { runSimulationSafely, type SimulationConfig } from './runSimulation';

export type BoundedOptimizerCandidateId =
  | 'baseline'
  | 'spendLess5'
  | 'spendLess10'
  | 'retireLater1'
  | 'retireLater2'
  | 'delayBenefits'
  | 'pensionSplit'
  | 'withdrawalDefault'
  | 'withdrawalRegisteredFirst'
  | 'withdrawalNonRegisteredFirst';

export type BoundedOptimizerLever = OptimizerLeverId | 'pensionSplitting';

export type BoundedOptimizerCandidateDefinition = {
  id: BoundedOptimizerCandidateId;
  label: string;
  plan: V2PlanPayload;
  config: SimulationConfig;
  changedLevers: BoundedOptimizerLever[];
  changeSummary: string;
  reviewNote: string;
  disruptionPenalty: number;
};

export type BoundedOptimizerCandidateRow = {
  id: BoundedOptimizerCandidateId;
  label: string;
  status: 'suggested' | 'review' | 'blocked';
  changedLevers: BoundedOptimizerLever[];
  changeSummary: string;
  reviewNote: string;
  fundedYears: number;
  totalYears: number;
  fundedThroughYear: number | null;
  firstShortfallYear: number | null;
  endPortfolio: number;
  endPortfolioDelta: number;
  lifetimeTax: number;
  lifetimeTaxDelta: number;
  score: number;
};

export type BoundedOptimizerExplanation = {
  whyThisOption: string[];
  tradeoffs: string[];
  verifyBeforeUsing: string[];
  plainLanguageSummary: string;
};

export type BoundedOptimizerEligibilityNote = {
  lever: BoundedOptimizerLever | 'survivor';
  status: 'eligible' | 'skipped' | 'needsReview';
  reason: string;
};

export type BoundedOptimizerEvidenceRow = {
  id: 'pensionLifetimeTax' | 'pensionFirstYearTax' | 'pensionPeakTax' | 'pensionOasRecovery' | 'pensionPortfolio';
  label: string;
  value: string;
  detail: string;
  tone: 'neutral' | 'ok' | 'watch';
};

export type BoundedOptimizerDriverRow = {
  id: 'fundedYears' | 'lifetimeTax' | 'peakTax' | 'oasRecovery' | 'portfolio';
  label: string;
  value: string;
  detail: string;
  tone: 'neutral' | 'ok' | 'watch';
};

export type BoundedOptimizerSummary = {
  status: 'blocked' | 'ready';
  execution: 'boundedSearch';
  contract: OptimizerContract;
  headline: string;
  detail: string;
  suggestedCandidateId: BoundedOptimizerCandidateId | null;
  suggestedLabel: string;
  candidateCount: number;
  candidates: BoundedOptimizerCandidateRow[];
  eligibilityNotes: BoundedOptimizerEligibilityNote[];
  evidenceRows: BoundedOptimizerEvidenceRow[];
  driverRows: BoundedOptimizerDriverRow[];
  explanation: BoundedOptimizerExplanation;
  reviewNotes: string[];
};

export type BoundedOptimizerRunner = (plan: V2PlanPayload, config: SimulationConfig) => SimulationResult;

const WITHDRAWAL_ORDERS: Array<{ id: BoundedOptimizerCandidateId; value: string; label: string }> = [
  { id: 'withdrawalDefault', value: 'default', label: 'Default withdrawal order' },
  { id: 'withdrawalRegisteredFirst', value: 'registered-first', label: 'Registered accounts first' },
  { id: 'withdrawalNonRegisteredFirst', value: 'nonreg-first', label: 'Non-registered accounts first' }
];

function n(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function baseConfig(plan: V2PlanPayload): SimulationConfig {
  return {
    cppAgeF: 65,
    cppAgeM: 65,
    oasAgeF: 65,
    oasAgeM: 65,
    meltdown: false,
    returnRate: 0.05,
    pensionSplit: false,
    p1Dies: null,
    withdrawalOrder: plan.assumptions.withdrawalOrder || 'default'
  };
}

function leverPermission(contract: OptimizerContract, id: OptimizerLeverId): string {
  return contract.levers.find((lever) => lever.id === id)?.permission || 'needsDecision';
}

function canExplore(contract: OptimizerContract, id: OptimizerLeverId): boolean {
  return leverPermission(contract, id) === 'canExplore';
}

function personAgeInYear(person: { dob?: number }, year: number): number | null {
  const birthYear = n(person.dob);
  return birthYear > 0 && year > 0 ? year - birthYear : null;
}

function totalAccountBalance(plan: V2PlanPayload, fields: Array<'rrsp' | 'lira' | 'lif' | 'tfsa' | 'nonreg'>): number {
  return fields.reduce((total, field) => total + n(plan.p1[field]) + n(plan.p2[field]), 0);
}

function buildEligibilityNotes(plan: V2PlanPayload, contract: OptimizerContract): BoundedOptimizerEligibilityNote[] {
  const spending = n(plan.spending.gogo);
  const retireYear = n(plan.assumptions.retireYear) || n(plan.p1.retireYear);
  const p1RetireAge = personAgeInYear(plan.p1, n(plan.p1.retireYear) || retireYear);
  const p2RetireAge = p2LooksBlank(plan.p2) ? null : personAgeInYear(plan.p2, n(plan.p2.retireYear) || retireYear);
  const benefitEstimateCount = [plan.p1.cpp65_monthly, plan.p1.cpp70_monthly, plan.p1.oas_monthly, plan.p2.cpp65_monthly, plan.p2.cpp70_monthly, plan.p2.oas_monthly].filter(
    (value) => n(value) > 0
  ).length;
  const registered = totalAccountBalance(plan, ['rrsp', 'lira', 'lif']);
  const flexible = totalAccountBalance(plan, ['tfsa', 'nonreg']) + n(plan.cashWedge?.balance);
  const hasTwoAccountBuckets = registered > 10_000 && flexible > 10_000;
  const pensionEligibleIncome = n(plan.p1.db_after65) + n(plan.p1.db_before65) + n(plan.p2.db_after65) + n(plan.p2.db_before65) + registered;
  const hasPotentialPensionSplit = !p2LooksBlank(plan.p2) && pensionEligibleIncome > 25_000 && (p1RetireAge === null || p1RetireAge >= 60);
  const coupleNeedsSurvivorReview = !p2LooksBlank(plan.p2) && !n(plan.assumptions.p1DiesInSurvivor);
  const notes: BoundedOptimizerEligibilityNote[] = [];

  notes.push({
    lever: 'spending',
    status: !canExplore(contract, 'spending') || spending < 30_000 ? 'skipped' : 'eligible',
    reason:
      spending < 30_000
        ? 'Spending cuts are skipped when planned annual spending is already very low.'
        : 'Spending options can be reviewed because a household spending target is entered.'
  });
  notes.push({
    lever: 'retirementTiming',
    status:
      !canExplore(contract, 'retirementTiming') || (p1RetireAge !== null && p1RetireAge >= 70) || (p2RetireAge !== null && p2RetireAge >= 70)
        ? 'skipped'
        : 'eligible',
    reason:
      (p1RetireAge !== null && p1RetireAge >= 70) || (p2RetireAge !== null && p2RetireAge >= 70)
        ? 'Working-longer tests are skipped when a retirement age is already 70 or later.'
        : 'Working-longer options can be reviewed because retirement timing is still inside the bounded test range.'
  });
  notes.push({
    lever: 'benefitTiming',
    status: !canExplore(contract, 'benefitTiming') || benefitEstimateCount < (p2LooksBlank(plan.p2) ? 2 : 4) ? 'skipped' : 'eligible',
    reason:
      benefitEstimateCount < (p2LooksBlank(plan.p2) ? 2 : 4)
        ? 'CPP/OAS delay is skipped until enough monthly benefit estimates are entered.'
        : 'CPP/OAS delay can be reviewed because benefit estimates are present.'
  });
  notes.push({
    lever: 'withdrawalOrder',
    status: !canExplore(contract, 'withdrawalOrder') || !hasTwoAccountBuckets ? 'skipped' : 'eligible',
    reason: hasTwoAccountBuckets
      ? 'Withdrawal-order checks can be reviewed because there are meaningful balances in registered and flexible accounts.'
      : 'Withdrawal-order checks are skipped until there are meaningful balances in more than one account bucket.'
  });
  notes.push({
    lever: 'pensionSplitting',
    status: hasPotentialPensionSplit ? 'eligible' : 'skipped',
    reason: hasPotentialPensionSplit
      ? 'Pension-splitting can be reviewed because this two-person plan has pension or registered income to test.'
      : 'Pension-splitting is skipped until a two-person plan has meaningful pension or registered income.'
  });
  if (coupleNeedsSurvivorReview) {
    notes.push({
      lever: 'survivor',
      status: 'needsReview',
      reason: 'Set a survivor scenario year before relying on optimizer choices for a two-person plan.'
    });
  }

  return notes;
}

function eligibilityFor(notes: BoundedOptimizerEligibilityNote[], lever: BoundedOptimizerLever): BoundedOptimizerEligibilityNote | undefined {
  return notes.find((note) => note.lever === lever);
}

function eligible(notes: BoundedOptimizerEligibilityNote[], lever: BoundedOptimizerLever): boolean {
  return eligibilityFor(notes, lever)?.status === 'eligible';
}

function scaleSpending(plan: V2PlanPayload, multiplier: number): V2PlanPayload {
  const next = extractPlanPayload(plan);
  next.spending.gogo = Math.round(n(next.spending.gogo) * multiplier);
  if (n(next.spending.slowgo) > 0) next.spending.slowgo = Math.round(n(next.spending.slowgo) * multiplier);
  if (n(next.spending.nogo) > 0) next.spending.nogo = Math.round(n(next.spending.nogo) * multiplier);
  return next;
}

function retireLater(plan: V2PlanPayload, years: number): V2PlanPayload {
  const next = extractPlanPayload(plan);
  if (n(next.assumptions.retireYear) > 0) next.assumptions.retireYear = n(next.assumptions.retireYear) + years;
  if (n(next.p1.retireYear) > 0) next.p1.retireYear = n(next.p1.retireYear) + years;
  if (!p2LooksBlank(next.p2) && n(next.p2.retireYear) > 0) next.p2.retireYear = n(next.p2.retireYear) + years;
  return next;
}

function withWithdrawalOrder(plan: V2PlanPayload, order: string): V2PlanPayload {
  const next = extractPlanPayload(plan);
  next.assumptions.withdrawalOrder = order;
  return next;
}

export function buildBoundedOptimizerCandidates(
  plan: V2PlanPayload,
  contract: OptimizerContract = buildOptimizerContract(plan)
): BoundedOptimizerCandidateDefinition[] {
  const config = baseConfig(plan);
  const eligibilityNotes = buildEligibilityNotes(plan, contract);
  const candidates: BoundedOptimizerCandidateDefinition[] = [
    {
      id: 'baseline',
      label: 'Current plan',
      plan: extractPlanPayload(plan),
      config,
      changedLevers: [],
      changeSummary: 'No changes',
      reviewNote: 'Use this as the comparison point for other plan options.',
      disruptionPenalty: 0
    }
  ];

  if (contract.status !== 'readyForExtraction') return candidates;

  if (eligible(eligibilityNotes, 'spending')) {
    candidates.push(
      {
        id: 'spendLess5',
        label: 'Spend 5% less',
        plan: scaleSpending(plan, 0.95),
        config,
        changedLevers: ['spending'],
        changeSummary: 'Reduce planned spending by 5%',
        reviewNote: 'Review whether this spending level still fits the household lifestyle.',
        disruptionPenalty: 7_500
      },
      {
        id: 'spendLess10',
        label: 'Spend 10% less',
        plan: scaleSpending(plan, 0.9),
        config,
        changedLevers: ['spending'],
        changeSummary: 'Reduce planned spending by 10%',
        reviewNote: 'Treat this as a repair option, not an automatic recommendation.',
        disruptionPenalty: 15_000
      }
    );
  }

  if (eligible(eligibilityNotes, 'retirementTiming')) {
    candidates.push(
      {
        id: 'retireLater1',
        label: 'Work 1 year longer',
        plan: retireLater(plan, 1),
        config,
        changedLevers: ['retirementTiming'],
        changeSummary: 'Move retirement one year later',
        reviewNote: 'Review whether work timing is truly flexible before relying on this option.',
        disruptionPenalty: 10_000
      },
      {
        id: 'retireLater2',
        label: 'Work 2 years longer',
        plan: retireLater(plan, 2),
        config,
        changedLevers: ['retirementTiming'],
        changeSummary: 'Move retirement two years later',
        reviewNote: 'This may improve funding, but it changes a major life assumption.',
        disruptionPenalty: 20_000
      }
    );
  }

  if (eligible(eligibilityNotes, 'benefitTiming')) {
    candidates.push({
      id: 'delayBenefits',
      label: 'Delay CPP/OAS to 70',
      plan: extractPlanPayload(plan),
      config: { ...config, cppAgeF: 70, cppAgeM: 70, oasAgeF: 70, oasAgeM: 70 },
      changedLevers: ['benefitTiming'],
      changeSummary: 'Start CPP/OAS at 70 in this test',
      reviewNote: 'Review health, bridge funding, and benefit estimates before choosing timing.',
      disruptionPenalty: 5_000
    });
  }

  if (eligible(eligibilityNotes, 'pensionSplitting')) {
    candidates.push({
      id: 'pensionSplit',
      label: 'Test pension splitting',
      plan: extractPlanPayload(plan),
      config: { ...config, pensionSplit: true },
      changedLevers: ['pensionSplitting'],
      changeSummary: 'Turn on pension-splitting in this test',
      reviewNote: 'Review eligible pension income and spouse tax details before using this option.',
      disruptionPenalty: 1_500
    });
  }

  if (eligible(eligibilityNotes, 'withdrawalOrder')) {
    const currentOrder = plan.assumptions.withdrawalOrder || 'default';
    WITHDRAWAL_ORDERS.filter((order) => order.value !== currentOrder).forEach((order) => {
      candidates.push({
        id: order.id,
        label: order.label,
        plan: withWithdrawalOrder(plan, order.value),
        config: { ...config, withdrawalOrder: order.value },
        changedLevers: ['withdrawalOrder'],
        changeSummary: `Test ${order.label.toLowerCase()}`,
        reviewNote: 'Use this as a high-level drawdown-order check, not tax-bracket optimization.',
        disruptionPenalty: 2_500
      });
    });
  }

  return candidates.slice(0, 9);
}

function summarizeResult(result: SimulationResult | null | undefined) {
  const rows = Array.isArray(result?.years) ? result.years : [];
  const totalTax = n((result as { totalTax?: unknown } | null | undefined)?.totalTax);
  const firstShortfall = rows.find((row) => n(row.shortfall) > 1);
  const fundedYears = rows.filter((row) => n(row.shortfall) <= 1).length;
  const lastRow = rows[rows.length - 1];
  const fundedThroughYear = firstShortfall ? n(firstShortfall.year) - 1 : lastRow ? n(lastRow.year) : null;
  return {
    rows,
    fundedYears,
    totalYears: rows.length,
    fundedThroughYear,
    firstShortfallYear: firstShortfall ? n(firstShortfall.year) : null,
    endPortfolio: n(lastRow?.bal_total),
    lifetimeTax: totalTax || rows.reduce((sum, row) => sum + n(row.totalTaxYear), 0),
    firstYearTax: n(rows[0]?.totalTaxYear),
    peakTax: rows.reduce((peak, row) => Math.max(peak, n(row.totalTaxYear)), 0),
    lifetimeOasRecovery: rows.reduce((sum, row) => sum + n(row.totalOasClawY), 0)
  };
}

function scoreCandidate(
  summary: ReturnType<typeof summarizeResult>,
  baseline: ReturnType<typeof summarizeResult>,
  disruptionPenalty: number
): number {
  if (summary.totalYears === 0) return Number.NEGATIVE_INFINITY;
  const fixedShortfallBonus = baseline.firstShortfallYear && !summary.firstShortfallYear ? 500_000 : 0;
  const noShortfallBonus = summary.firstShortfallYear ? 0 : 100_000;
  const fundedScore = summary.fundedYears * 25_000;
  const portfolioScore = summary.endPortfolio / 25;
  const taxScore = (baseline.lifetimeTax - summary.lifetimeTax) / 5;
  return fixedShortfallBonus + noShortfallBonus + fundedScore + portfolioScore + taxScore - disruptionPenalty;
}

function compareRows(a: BoundedOptimizerCandidateRow, b: BoundedOptimizerCandidateRow): number {
  if (a.score !== b.score) return b.score - a.score;
  if (a.firstShortfallYear && !b.firstShortfallYear) return 1;
  if (!a.firstShortfallYear && b.firstShortfallYear) return -1;
  if (a.id === 'baseline') return -1;
  if (b.id === 'baseline') return 1;
  return a.label.localeCompare(b.label);
}

function moneyText(value: number): string {
  const rounded = Math.round(Math.abs(value));
  return `${value < 0 ? '-' : ''}$${rounded.toLocaleString()}`;
}

function signedMoneyText(value: number): string {
  if (Math.abs(value) <= 1) return '$0';
  return `${value > 0 ? '+' : '-'}$${Math.round(Math.abs(value)).toLocaleString()}`;
}

function deltaText(value: number, improvementWord: string, declineWord: string): string {
  if (Math.abs(value) <= 1) return 'About the same as the current plan.';
  return value > 0 ? `${improvementWord} by about ${moneyText(value)}.` : `${declineWord} by about ${moneyText(value)}.`;
}

function leverTradeoffCopy(row: BoundedOptimizerCandidateRow): string[] {
  const tradeoffs: string[] = [];
  if (row.changedLevers.includes('spending')) {
    tradeoffs.push('Lower spending can improve the projection, but it must still feel realistic for the household.');
  }
  if (row.changedLevers.includes('retirementTiming')) {
    tradeoffs.push('Working longer can improve the numbers, but it changes a major life and health assumption.');
  }
  if (row.changedLevers.includes('benefitTiming')) {
    tradeoffs.push('Delaying CPP/OAS can help later income, but bridge funding and health assumptions matter.');
  }
  if (row.changedLevers.includes('withdrawalOrder')) {
    tradeoffs.push('Changing drawdown order is only a high-level check here; it is not year-by-year tax planning.');
  }
  if (row.changedLevers.includes('pensionSplitting')) {
    tradeoffs.push('Pension-splitting can lower household tax, but eligibility and spouse tax details need review.');
  }
  return tradeoffs;
}

function buildOptimizerExplanation(
  suggested: BoundedOptimizerCandidateRow | null,
  baseline: BoundedOptimizerCandidateRow | null,
  contract: OptimizerContract
): BoundedOptimizerExplanation {
  if (!suggested || !baseline || contract.status !== 'readyForExtraction') {
    return {
      whyThisOption: ['Required inputs need review before plan options can be compared.'],
      tradeoffs: contract.blockers.length ? contract.blockers.slice(0, 3) : ['Run Results after clearing missing or invalid inputs.'],
      verifyBeforeUsing: ['Clear input blockers.', 'Run Results again.', 'Save an editable plan copy after reviewing the inputs.'],
      plainLanguageSummary: 'Plan options are paused until required inputs are ready.'
    };
  }

  const whyThisOption = [
    suggested.firstShortfallYear
      ? `It funds spending through ${suggested.fundedThroughYear || '-'} before a first shortfall in ${suggested.firstShortfallYear}.`
      : 'It avoids a visible spending shortfall in the projection years checked.',
    deltaText(suggested.endPortfolioDelta, 'Projected money left improves', 'Projected money left falls'),
    deltaText(-suggested.lifetimeTaxDelta, 'Lifetime tax falls', 'Lifetime tax rises')
  ];

  if (baseline.firstShortfallYear && !suggested.firstShortfallYear) {
    whyThisOption.unshift(`It removes the current plan's first visible shortfall in ${baseline.firstShortfallYear}.`);
  }
  if (suggested.id === 'baseline') {
    whyThisOption.unshift('The current plan remains strongest after the limited checks.');
  }

  const tradeoffs = leverTradeoffCopy(suggested);
  if (suggested.endPortfolioDelta < -1) tradeoffs.push('This option leaves less projected money at the end of the plan.');
  if (suggested.lifetimeTaxDelta > 1) tradeoffs.push('This option shows higher lifetime tax in the current model.');
  if (!tradeoffs.length) tradeoffs.push('No major input change is being proposed by this limited check.');

  return {
    whyThisOption,
    tradeoffs,
    verifyBeforeUsing: [
      suggested.reviewNote,
      'Review taxes, survivor impact, and account balances before acting.',
      'Confirm the option still fits household comfort and priorities.'
    ],
    plainLanguageSummary:
      suggested.id === 'baseline'
        ? 'The limited check did not find a better plan option than the current inputs.'
        : `${suggested.label} ranked highest in this limited planning review because it improved the strongest trust checks without widening the search.`
  };
}

function evidenceTone(delta: number, lowerIsBetter = true): BoundedOptimizerEvidenceRow['tone'] {
  if (Math.abs(delta) <= 1) return 'neutral';
  return lowerIsBetter ? (delta < 0 ? 'ok' : 'watch') : delta > 0 ? 'ok' : 'watch';
}

function buildPensionSplittingEvidence(
  summaries: Partial<Record<BoundedOptimizerCandidateId, ReturnType<typeof summarizeResult>>>
): BoundedOptimizerEvidenceRow[] {
  const baseline = summaries.baseline;
  const pension = summaries.pensionSplit;
  if (!baseline || !pension || pension.totalYears === 0) return [];

  const lifetimeTaxDelta = pension.lifetimeTax - baseline.lifetimeTax;
  const firstYearTaxDelta = pension.firstYearTax - baseline.firstYearTax;
  const peakTaxDelta = pension.peakTax - baseline.peakTax;
  const oasDelta = pension.lifetimeOasRecovery - baseline.lifetimeOasRecovery;
  const portfolioDelta = pension.endPortfolio - baseline.endPortfolio;

  return [
    {
      id: 'pensionLifetimeTax',
      label: 'Lifetime tax change',
      value: signedMoneyText(lifetimeTaxDelta),
      detail: 'Compares total tax across the projection when pension-splitting is turned on for this review.',
      tone: evidenceTone(lifetimeTaxDelta)
    },
    {
      id: 'pensionFirstYearTax',
      label: 'First-year tax change',
      value: signedMoneyText(firstYearTaxDelta),
      detail: 'Shows whether the first projection year changes when eligible pension income is split.',
      tone: evidenceTone(firstYearTaxDelta)
    },
    {
      id: 'pensionPeakTax',
      label: 'Peak annual tax change',
      value: signedMoneyText(peakTaxDelta),
      detail: 'Compares the highest annual tax year in each projection.',
      tone: evidenceTone(peakTaxDelta)
    },
    {
      id: 'pensionOasRecovery',
      label: 'OAS recovery tax change',
      value: signedMoneyText(oasDelta),
      detail: 'Shows whether OAS recovery tax changes across the projection.',
      tone: evidenceTone(oasDelta)
    },
    {
      id: 'pensionPortfolio',
      label: 'Projected money-left change',
      value: signedMoneyText(portfolioDelta),
      detail: 'Compares projected money left at the end of the plan.',
      tone: evidenceTone(portfolioDelta, false)
    }
  ];
}

function buildDriverRows(
  suggested: BoundedOptimizerCandidateRow | null,
  baseline: BoundedOptimizerCandidateRow | null,
  summaries: Partial<Record<BoundedOptimizerCandidateId, ReturnType<typeof summarizeResult>>>
): BoundedOptimizerDriverRow[] {
  if (!suggested || !baseline) return [];
  const suggestedSummary = summaries[suggested.id];
  const baselineSummary = summaries.baseline;
  if (!suggestedSummary || !baselineSummary || suggestedSummary.totalYears === 0) return [];

  const fundedYearsDelta = suggestedSummary.fundedYears - baselineSummary.fundedYears;
  const lifetimeTaxDelta = suggestedSummary.lifetimeTax - baselineSummary.lifetimeTax;
  const peakTaxDelta = suggestedSummary.peakTax - baselineSummary.peakTax;
  const oasRecoveryDelta = suggestedSummary.lifetimeOasRecovery - baselineSummary.lifetimeOasRecovery;
  const portfolioDelta = suggestedSummary.endPortfolio - baselineSummary.endPortfolio;

  return [
    {
      id: 'fundedYears',
      label: 'Funded years',
      value: fundedYearsDelta === 0 ? 'No change' : `${fundedYearsDelta > 0 ? '+' : ''}${fundedYearsDelta} year${Math.abs(fundedYearsDelta) === 1 ? '' : 's'}`,
      detail: 'Compares how many projection years have spending covered.',
      tone: fundedYearsDelta === 0 ? 'neutral' : fundedYearsDelta > 0 ? 'ok' : 'watch'
    },
    {
      id: 'lifetimeTax',
      label: 'Lifetime tax',
      value: signedMoneyText(lifetimeTaxDelta),
      detail: 'Compares total tax across the projection.',
      tone: evidenceTone(lifetimeTaxDelta)
    },
    {
      id: 'peakTax',
      label: 'Peak annual tax',
      value: signedMoneyText(peakTaxDelta),
      detail: 'Compares the highest annual tax year.',
      tone: evidenceTone(peakTaxDelta)
    },
    {
      id: 'oasRecovery',
      label: 'OAS recovery tax',
      value: signedMoneyText(oasRecoveryDelta),
      detail: 'Compares OAS recovery tax across the projection.',
      tone: evidenceTone(oasRecoveryDelta)
    },
    {
      id: 'portfolio',
      label: 'Projected money left',
      value: signedMoneyText(portfolioDelta),
      detail: 'Compares projected money left at the end of the plan.',
      tone: evidenceTone(portfolioDelta, false)
    }
  ];
}

export function runBoundedOptimizer(
  plan: V2PlanPayload,
  runner: BoundedOptimizerRunner = runSimulationSafely
): BoundedOptimizerSummary {
  const contract = buildOptimizerContract(plan);
  const eligibilityNotes = buildEligibilityNotes(plan, contract);
  const definitions = buildBoundedOptimizerCandidates(plan, contract);
  const rawResults = definitions.map((definition) => ({
    definition,
    result: runner(definition.plan, definition.config)
  }));
  const summarizedResults = rawResults.map(({ definition, result }) => ({
    definition,
    summary: summarizeResult(result)
  }));
  const baselineSummary = summarizedResults[0]?.summary;
  const rows = summarizedResults.map(({ definition, summary }) => {
    return {
      id: definition.id,
      label: definition.label,
      status: summary.totalYears > 0 ? 'review' : 'blocked',
      changedLevers: definition.changedLevers,
      changeSummary: definition.changeSummary,
      reviewNote: definition.reviewNote,
      fundedYears: summary.fundedYears,
      totalYears: summary.totalYears,
      fundedThroughYear: summary.fundedThroughYear,
      firstShortfallYear: summary.firstShortfallYear,
      endPortfolio: summary.endPortfolio,
      endPortfolioDelta: summary.endPortfolio - baselineSummary.endPortfolio,
      lifetimeTax: summary.lifetimeTax,
      lifetimeTaxDelta: summary.lifetimeTax - baselineSummary.lifetimeTax,
      score: scoreCandidate(summary, baselineSummary, definition.disruptionPenalty)
    } satisfies BoundedOptimizerCandidateRow;
  });

  const eligibleRows = rows.filter((row) => row.status !== 'blocked');
  const sortedRows = [...eligibleRows].sort(compareRows);
  const suggested = contract.status === 'readyForExtraction' ? sortedRows[0] || null : null;
  const candidates: BoundedOptimizerCandidateRow[] = rows.map((row) => {
    const status: BoundedOptimizerCandidateRow['status'] = suggested && row.id === suggested.id ? 'suggested' : row.status;
    return { ...row, status };
  });
  const suggestedLabel = suggested?.label || 'No plan option ready';
  const baselineRow = candidates.find((row) => row.id === 'baseline') || null;
  const suggestedRow = candidates.find((row) => row.id === suggested?.id) || null;
  const explanation = buildOptimizerExplanation(suggestedRow, baselineRow, contract);
  const summaryById = summarizedResults.reduce<Partial<Record<BoundedOptimizerCandidateId, ReturnType<typeof summarizeResult>>>>((acc, item) => {
    acc[item.definition.id] = item.summary;
    return acc;
  }, {});
  const evidenceRows = buildPensionSplittingEvidence(summaryById);
  const driverRows = buildDriverRows(suggestedRow, baselineRow, summaryById);

  return {
    status: contract.status === 'readyForExtraction' && Boolean(suggested) ? 'ready' : 'blocked',
    execution: 'boundedSearch',
    contract,
    headline: suggested
      ? `${suggested.label} is the strongest option in this limited review set.`
      : 'Plan options can be reviewed after required inputs are cleared.',
    detail:
      'This checks a small set of spending, timing, benefit, and withdrawal-order options. It is a planning review, not financial advice or a full tax optimizer.',
    suggestedCandidateId: suggested?.id ?? null,
    suggestedLabel,
    candidateCount: candidates.length,
    candidates,
    eligibilityNotes,
    evidenceRows,
    driverRows,
    explanation,
    reviewNotes: suggested
      ? [
          suggested.reviewNote,
          'Compare the result against taxes, survivor impact, and household comfort before acting.',
          'The saved plan file is unchanged unless you edit inputs yourself.'
        ]
      : contract.blockers.length
        ? contract.blockers.slice(0, 3)
        : ['Run Results after clearing missing or invalid inputs.']
  };
}
