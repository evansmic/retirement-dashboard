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
  | 'withdrawalDefault'
  | 'withdrawalRegisteredFirst'
  | 'withdrawalNonRegisteredFirst';

export type BoundedOptimizerCandidateDefinition = {
  id: BoundedOptimizerCandidateId;
  label: string;
  plan: V2PlanPayload;
  config: SimulationConfig;
  changedLevers: OptimizerLeverId[];
  changeSummary: string;
  reviewNote: string;
  disruptionPenalty: number;
};

export type BoundedOptimizerCandidateRow = {
  id: BoundedOptimizerCandidateId;
  label: string;
  status: 'suggested' | 'review' | 'blocked';
  changedLevers: OptimizerLeverId[];
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

  if (canExplore(contract, 'spending')) {
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

  if (canExplore(contract, 'retirementTiming')) {
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

  if (canExplore(contract, 'benefitTiming')) {
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

  if (canExplore(contract, 'withdrawalOrder')) {
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

  return candidates.slice(0, 8);
}

function summarizeResult(result: SimulationResult | null | undefined) {
  const rows = Array.isArray(result?.years) ? result.years : [];
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
    lifetimeTax: rows.reduce((sum, row) => sum + n(row.totalTaxYear), 0)
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

export function runBoundedOptimizer(
  plan: V2PlanPayload,
  runner: BoundedOptimizerRunner = runSimulationSafely
): BoundedOptimizerSummary {
  const contract = buildOptimizerContract(plan);
  const definitions = buildBoundedOptimizerCandidates(plan, contract);
  const rawResults = definitions.map((definition) => ({
    definition,
    result: runner(definition.plan, definition.config)
  }));
  const baselineSummary = summarizeResult(rawResults[0]?.result);
  const rows = rawResults.map(({ definition, result }) => {
    const summary = summarizeResult(result);
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
