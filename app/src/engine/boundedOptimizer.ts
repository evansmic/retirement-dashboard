import { extractPlanPayload, p2LooksBlank } from '../data/planFile';
import type { SimulationResult, V2PlanPayload } from '../types/plan';
import { buildOptimizerContract, type OptimizerContract, type OptimizerLeverId } from './optimizerContract';
import { hasTwoPersonDbPensionIncome, shouldIncludeBaselinePensionSplitting } from './pensionSplitting';
import { runSimulationSafely, type SimulationConfig } from './runSimulation';

export type BenefitGridCandidateId = `benefitGridCpp${number}Oas${number}`;

export type BoundedOptimizerCandidateId =
  | 'baseline'
  | 'spendLess5'
  | 'spendLess10'
  | 'retireLater1'
  | 'retireLater2'
  | 'delayBenefits'
  | BenefitGridCandidateId
  | 'pensionSplit'
  | 'cppSharing'
  | 'withoutDownsize'
  | 'withdrawalDefault'
  | 'withdrawalRegisteredFirst'
  | 'withdrawalNonRegisteredFirst';

export type BoundedOptimizerLever = OptimizerLeverId | 'pensionSplitting' | 'cppSharing';

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
  suggestionEligible: boolean;
  suggestionReason: string;
  fundedYears: number;
  totalYears: number;
  fundedThroughYear: number | null;
  firstShortfallYear: number | null;
  sustainableAnnualSpend: number;
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

export type BoundedOptimizerGuardrailNote = {
  id: BoundedOptimizerLever | 'survivor';
  label: string;
  status: 'tested' | 'notTested' | 'reviewFirst';
  reason: string;
};

export type BoundedOptimizerRecommendationNote = {
  candidateId: BoundedOptimizerCandidateId;
  label: string;
  status: 'canHighlight' | 'reviewOnly';
  reason: string;
};

export type BoundedOptimizerOptionGroupId = 'currentPlan' | 'lifestyle' | 'timing' | 'incomeSharing' | 'drawdownReview' | 'homeEstate';

export type BoundedOptimizerOptionGroup = {
  id: BoundedOptimizerOptionGroupId;
  label: string;
  summary: string;
  candidateIds: BoundedOptimizerCandidateId[];
  reviewOnlyCount: number;
  canHighlightCount: number;
};

export type BoundedOptimizerEvidenceRow = {
  id:
    | 'pensionLifetimeTax'
    | 'pensionFirstYearTax'
    | 'pensionPeakTax'
    | 'pensionOasRecovery'
    | 'pensionPortfolio'
    | 'cppSharingLifetimeTax'
    | 'cppSharingFirstYearTax'
    | 'cppSharingPeakTax'
    | 'cppSharingOasRecovery'
    | 'cppSharingPortfolio'
    | 'benefitBridgeYears'
    | 'benefitFirstBridgeShortfall'
    | 'benefitLifetimeTax'
    | 'benefitPortfolio'
    | 'benefitGridBestPair'
    | 'benefitGridTopThree'
    | 'benefitGridFundedYears'
    | 'benefitGridLifetimeTax'
    | 'benefitGridPortfolio'
    | 'homeRelianceFundedYears'
    | 'homeRelianceFirstShortfall'
    | 'homeReliancePortfolio'
    | 'homeRelianceLifetimeTax'
    | 'homeRelianceEstateGap'
    | 'withdrawalFamilyFirst'
    | 'withdrawalFamilyFundedYears'
    | 'withdrawalFamilyLifetimeTax'
    | 'withdrawalFamilyFirstYearTax'
    | 'withdrawalFamilyPeakTax'
    | 'withdrawalFamilyOasRecovery'
    | 'withdrawalFamilyPortfolio';
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

export type WithdrawalFeedbackReviewRow = {
  id: 'familyPresence' | 'evidenceClarity' | 'annualInstructionBoundary' | 'guardrails' | 'savedOutputBoundary';
  label: string;
  status: 'ready' | 'review' | 'blocked';
  detail: string;
};

export type WithdrawalFeedbackReview = {
  status: 'readyForFeedback' | 'needsInputReview' | 'holdForCleanup';
  headline: string;
  detail: string;
  rows: WithdrawalFeedbackReviewRow[];
  questions: string[];
  confusionSignals: string[];
  worksheet: Array<{
    id: 'understanding' | 'evidence' | 'boundary' | 'decision';
    label: string;
    prompt: string;
    passSignal: string;
  }>;
  decision: {
    status: 'collectFeedback' | 'cleanUpInputs' | 'holdAnnualSequencing';
    label: string;
    detail: string;
    requiredEvidence: string[];
  };
  outcome: {
    status: 'readyToReview' | 'simplifyEvidence' | 'repairInputs' | 'deferSequencing';
    label: string;
    detail: string;
    nextSteps: string[];
  };
  nextDecision: string;
};

export type OptimizerReadinessRow = {
  id:
    | 'spending'
    | 'benefitEstimates'
    | 'benefitAgeRange'
    | 'accountBuckets'
    | 'estateTarget'
    | 'homeSale'
    | 'survivor'
    | 'taxScope';
  label: string;
  status: 'ready' | 'review' | 'blocked';
  detail: string;
};

export type OptimizerCandidateFamily = {
  id: 'benefitTimingGrid' | 'broadWithdrawalFamilies' | 'annualOverrides' | 'monteCarloValidation';
  label: string;
  status: 'included' | 'deferred' | 'blocked';
  detail: string;
};

export type OptimizerObjectiveContract = {
  primaryObjective: 'maximizeSustainableAfterTaxSpend';
  outputTone: 'planToReview';
  riskGuardrail: 'conservativeDeterministicFunding';
  monteCarloRole: 'validationLater';
  savedOutput: 'none';
  detail: string;
};

export type OptimizerBenefitSearchSpace = {
  person: 'p1' | 'p2';
  label: string;
  cppAges: number[];
  oasAges: number[];
  status: 'ready' | 'blocked';
  reason: string;
};

export type OptimizerWithdrawalFamily = {
  id: 'currentOrder' | 'default' | 'registeredFirst' | 'nonRegisteredFirst';
  label: string;
  status: 'included' | 'current' | 'blocked';
  detail: string;
};

export type OptimizerSearchPlan = {
  strategy: 'stagedGrid';
  jointCoupleSearch: boolean;
  benefitSearch: OptimizerBenefitSearchSpace[];
  withdrawalFamilies: OptimizerWithdrawalFamily[];
  annualOverrides: 'deferred';
  detail: string;
};

export type BoundedOptimizerSummary = {
  status: 'blocked' | 'ready';
  execution: 'boundedSearch';
  contract: OptimizerContract;
  objective: OptimizerObjectiveContract;
  readinessRows: OptimizerReadinessRow[];
  candidateFamilies: OptimizerCandidateFamily[];
  searchPlan: OptimizerSearchPlan;
  headline: string;
  detail: string;
  suggestedCandidateId: BoundedOptimizerCandidateId | null;
  suggestedLabel: string;
  candidateCount: number;
  candidates: BoundedOptimizerCandidateRow[];
  eligibilityNotes: BoundedOptimizerEligibilityNote[];
  guardrailNotes: BoundedOptimizerGuardrailNote[];
  recommendationNotes: BoundedOptimizerRecommendationNote[];
  optionGroups: BoundedOptimizerOptionGroup[];
  evidenceRows: BoundedOptimizerEvidenceRow[];
  driverRows: BoundedOptimizerDriverRow[];
  withdrawalFeedbackReview: WithdrawalFeedbackReview;
  explanation: BoundedOptimizerExplanation;
  reviewNotes: string[];
};

export type BoundedOptimizerRunner = (plan: V2PlanPayload, config: SimulationConfig) => SimulationResult;

const WITHDRAWAL_ORDERS: Array<{ id: BoundedOptimizerCandidateId; value: string; label: string }> = [
  { id: 'withdrawalDefault', value: 'default', label: 'Default withdrawal order' },
  { id: 'withdrawalRegisteredFirst', value: 'registered-first', label: 'Registered accounts first' },
  { id: 'withdrawalNonRegisteredFirst', value: 'nonreg-first', label: 'Non-registered accounts first' }
];

const BOUNDED_OPTIMIZER_CANDIDATE_LIMIT = 20;
const WITHDRAWAL_BUCKET_MINIMUM = 25_000;
const BENEFIT_GRID_CPP_AGES = [60, 65, 67, 70] as const;
const BENEFIT_GRID_OAS_AGES = [65, 67, 70] as const;

function n(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function consumerWithdrawalOrder(value: string | undefined): string {
  return value === 'meltdown' ? 'default' : value || 'default';
}

function baseConfig(plan: V2PlanPayload): SimulationConfig {
  return {
    cppAgeF: 65,
    cppAgeM: 65,
    oasAgeF: 65,
    oasAgeM: 65,
    meltdown: false,
    returnRate: 0.05,
    pensionSplit: shouldIncludeBaselinePensionSplitting(plan),
    p1Dies: null,
    withdrawalOrder: consumerWithdrawalOrder(plan.assumptions.withdrawalOrder)
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

function projectionStartYear(plan: V2PlanPayload): number {
  const p2RetireYear = p2LooksBlank(plan.p2) ? Infinity : n(plan.p2.retireYear);
  return Math.min(
    n(plan.assumptions.planStart) || Infinity,
    n(plan.assumptions.retireYear) || Infinity,
    n(plan.p1.retireYear) || Infinity,
    p2RetireYear || Infinity
  );
}

function projectionEndYear(plan: V2PlanPayload): number {
  return n(plan.assumptions.planEnd) || n(plan.assumptions.horizon) || projectionStartYear(plan);
}

function activePeople(plan: V2PlanPayload): Array<{ key: 'p1' | 'p2'; person: V2PlanPayload['p1'] }> {
  const people: Array<{ key: 'p1' | 'p2'; person: V2PlanPayload['p1'] }> = [{ key: 'p1', person: plan.p1 }];
  if (!p2LooksBlank(plan.p2)) people.push({ key: 'p2', person: plan.p2 });
  return people;
}

function hasCppAndOasEstimate(person: V2PlanPayload['p1']): boolean {
  return (n(person.cpp65_monthly) > 0 || n(person.cpp70_monthly) > 0) && n(person.oas_monthly) > 0;
}

function hasCppEstimate(person: V2PlanPayload['p1']): boolean {
  return n(person.cpp65_monthly) > 0 || n(person.cpp70_monthly) > 0;
}

function personReachesCppStartAge(person: V2PlanPayload['p1'], endYear: number): boolean {
  const birthYear = n(person.dob);
  return birthYear > 0 && endYear >= birthYear + 65;
}

function personCanStillDelayBenefits(person: V2PlanPayload['p1'], startYear: number, endYear: number): boolean {
  const startAge = personAgeInYear(person, startYear);
  const reachesAge70 = n(person.dob) > 0 && endYear >= n(person.dob) + 70;
  return hasCppAndOasEstimate(person) && startAge !== null && startAge < 70 && reachesAge70;
}

function benefitAgeRange(start: number, end: number, minAge: number, maxAge: number): number[] {
  const startAge = Math.max(start, minAge);
  const endAge = Math.min(end, maxAge);
  if (!Number.isFinite(startAge) || !Number.isFinite(endAge) || endAge < startAge) return [];
  return Array.from({ length: endAge - startAge + 1 }, (_item, index) => startAge + index);
}

function personBenefitSearchSpace(
  key: 'p1' | 'p2',
  person: V2PlanPayload['p1'],
  startYear: number,
  endYear: number
): OptimizerBenefitSearchSpace {
  const birthYear = n(person.dob);
  const startAge = personAgeInYear(person, startYear);
  const endAge = birthYear > 0 ? endYear - birthYear : null;
  const cppAges = hasCppEstimate(person) && startAge !== null && endAge !== null ? benefitAgeRange(Math.max(60, startAge), endAge, 60, 70) : [];
  const oasAges = n(person.oas_monthly) > 0 && startAge !== null && endAge !== null ? benefitAgeRange(Math.max(65, startAge), endAge, 65, 70) : [];
  const label = personLabel(key, person);
  const status = cppAges.length > 0 && oasAges.length > 0 ? 'ready' : 'blocked';
  return {
    person: key,
    label,
    cppAges,
    oasAges,
    status,
    reason:
      status === 'ready'
        ? `${label} can be included in a CPP/OAS age grid.`
        : `${label} needs benefit estimates and projection years that include valid CPP/OAS start ages.`
  };
}

function buildReadinessRows(plan: V2PlanPayload, contract: OptimizerContract, eligibilityNotes: BoundedOptimizerEligibilityNote[]): OptimizerReadinessRow[] {
  const startYear = projectionStartYear(plan);
  const endYear = projectionEndYear(plan);
  const people = activePeople(plan);
  const benefitSpaces = people.map(({ key, person }) => personBenefitSearchSpace(key, person, startYear, endYear));
  const estateTarget = n(plan.inheritance);
  const downsizeYear = n(plan.downsize?.year);
  const downsizeProceeds = n(plan.downsize?.netProceeds);
  const hasPartialHomeSale = (downsizeYear > 0 || downsizeProceeds > 0) && !(downsizeYear > 0 && downsizeProceeds > 0);
  const survivorNote = eligibilityNotes.find((note) => note.lever === 'survivor');
  const spendingReady = canExplore(contract, 'spending') && n(plan.spending.gogo) >= 30_000;
  const accountsReady = hasMeaningfulWithdrawalBuckets(plan);
  const benefitEstimateReady = people.every(({ person }) => hasCppAndOasEstimate(person));
  const benefitGridReady = benefitSpaces.every((space) => space.status === 'ready');

  return [
    {
      id: 'spending',
      label: 'Spending target',
      status: spendingReady ? 'ready' : 'blocked',
      detail: spendingReady
        ? 'Early, later, and late-life spending can anchor a max after-tax spending review.'
        : 'Add a realistic spending target before optimizing for sustainable spending.'
    },
    {
      id: 'benefitEstimates',
      label: 'CPP/OAS estimates',
      status: benefitEstimateReady ? 'ready' : 'blocked',
      detail: benefitEstimateReady
        ? 'CPP and OAS estimates are present for each active person.'
        : 'CPP at 65 and monthly OAS estimates are needed before testing benefit timing.'
    },
    {
      id: 'benefitAgeRange',
      label: 'Benefit age range',
      status: benefitGridReady ? 'ready' : 'review',
      detail: benefitGridReady
        ? 'The projection includes valid CPP/OAS start ages for the staged grid.'
        : 'The grid will be limited until each active person has valid CPP/OAS start ages inside the projection.'
    },
    {
      id: 'accountBuckets',
      label: 'Account buckets',
      status: accountsReady ? 'ready' : 'review',
      detail: accountsReady
        ? 'Registered and TFSA/non-registered buckets are meaningful enough for broad withdrawal-family checks.'
        : 'Broad withdrawal-family checks need meaningful balances in registered and TFSA/non-registered buckets.'
    },
    {
      id: 'estateTarget',
      label: 'Estate target',
      status: estateTarget > 0 ? 'ready' : 'review',
      detail: estateTarget > 0
        ? 'The optimizer must preserve the entered estate target unless the household changes it.'
        : 'No estate target is entered, so spending-room output should mention the estate trade-off.'
    },
    {
      id: 'homeSale',
      label: 'Home-sale assumption',
      status: hasPartialHomeSale ? 'blocked' : downsizeYear > 0 && downsizeProceeds > 0 ? 'ready' : 'review',
      detail: hasPartialHomeSale
        ? 'Home-sale assumptions need both a year and net cash amount before reliance checks are useful.'
        : downsizeYear > 0 && downsizeProceeds > 0
          ? 'Home-sale cash is preserved as an entered household assumption and can be tested only as a reliance check.'
          : 'No home-sale cash is entered; the optimizer must not invent one.'
    },
    {
      id: 'survivor',
      label: 'Survivor setup',
      status: survivorNote ? 'review' : 'ready',
      detail: survivorNote?.reason || 'Survivor setup does not block the first optimizer review for this plan.'
    },
    {
      id: 'taxScope',
      label: 'Tax scope',
      status: 'ready',
      detail: 'The optimizer review uses the same Ontario 2026 tax assumptions as Results.'
    }
  ];
}

function buildCandidateFamilies(readinessRows: OptimizerReadinessRow[]): OptimizerCandidateFamily[] {
  const benefitReady = readinessRows.find((row) => row.id === 'benefitEstimates')?.status === 'ready';
  const ageReady = readinessRows.find((row) => row.id === 'benefitAgeRange')?.status === 'ready';
  const accountReady = readinessRows.find((row) => row.id === 'accountBuckets')?.status === 'ready';
  return [
    {
      id: 'benefitTimingGrid',
      label: 'CPP/OAS timing grid',
      status: benefitReady && ageReady ? 'included' : 'blocked',
      detail: benefitReady && ageReady
        ? 'CPP ages 60-70 and OAS ages 65-70 can be described for a staged grid where eligible.'
        : 'Benefit timing grid waits for benefit estimates and valid age ranges.'
    },
    {
      id: 'broadWithdrawalFamilies',
      label: 'Broad withdrawal families',
      status: accountReady ? 'included' : 'blocked',
      detail: accountReady
        ? 'Current, default, registered-first, and non-registered-first families can be compared at a high level.'
        : 'Broad withdrawal families wait for meaningful registered and flexible account balances.'
    },
    {
      id: 'annualOverrides',
      label: 'Year-by-year withdrawal actions',
      status: 'deferred',
      detail: 'Annual account-level overrides are deferred until broad family search is trusted.'
    },
    {
      id: 'monteCarloValidation',
      label: 'Monte Carlo validation',
      status: 'deferred',
      detail: 'Monte Carlo validates later; it is not inside the first local search loop.'
    }
  ];
}

function buildObjectiveContract(): OptimizerObjectiveContract {
  return {
    primaryObjective: 'maximizeSustainableAfterTaxSpend',
    outputTone: 'planToReview',
    riskGuardrail: 'conservativeDeterministicFunding',
    monteCarloRole: 'validationLater',
    savedOutput: 'none',
    detail: 'Maximize sustainable after-tax spending only after deterministic funding, estate, bridge-year, survivor, and local-output guardrails are respected.'
  };
}

function buildSearchPlan(plan: V2PlanPayload): OptimizerSearchPlan {
  const startYear = projectionStartYear(plan);
  const endYear = projectionEndYear(plan);
  const currentOrder = consumerWithdrawalOrder(plan.assumptions.withdrawalOrder);
  const withdrawalFamilies: OptimizerWithdrawalFamily[] = [
    {
      id: 'currentOrder',
      label: 'Current order',
      status: 'current',
      detail: `Current plan withdrawal order: ${currentOrder}.`
    },
    {
      id: 'default',
      label: 'Default family',
      status: currentOrder === 'default' ? 'current' : 'included',
      detail: 'High-level default withdrawal-order family.'
    },
    {
      id: 'registeredFirst',
      label: 'Registered-first family',
      status: 'included',
      detail: 'Broad family check only; not year-by-year account instructions.'
    },
    {
      id: 'nonRegisteredFirst',
      label: 'Non-registered-first family',
      status: 'included',
      detail: 'Broad family check only; not year-by-year account instructions.'
    }
  ];
  return {
    strategy: 'stagedGrid',
    jointCoupleSearch: !p2LooksBlank(plan.p2),
    benefitSearch: activePeople(plan).map(({ key, person }) => personBenefitSearchSpace(key, person, startYear, endYear)),
    withdrawalFamilies,
    annualOverrides: 'deferred',
    detail: 'The first optimizer path uses a staged grid: benefit timing and broad withdrawal families before any annual override execution.'
  };
}

function personLabel(key: 'p1' | 'p2', person: V2PlanPayload['p1']): string {
  return person.name || (key === 'p1' ? 'Person 1' : 'Person 2');
}

function benefitTimingReason(plan: V2PlanPayload, people: ReturnType<typeof activePeople>, startYear: number, endYear: number, ready: boolean): string {
  if (ready) {
    return 'CPP/OAS delay can be reviewed because benefit estimates are entered and each active person can be tested to age 70.';
  }

  const missingEstimate = people.find(({ person }) => !hasCppAndOasEstimate(person));
  if (missingEstimate) {
    return `CPP/OAS delay is skipped because ${personLabel(missingEstimate.key, missingEstimate.person)} needs CPP and OAS estimates first.`;
  }

  const alreadyAge70 = people.find(({ person }) => {
    const startAge = personAgeInYear(person, startYear);
    return startAge !== null && startAge >= 70;
  });
  if (alreadyAge70) {
    return `CPP/OAS delay is skipped because ${personLabel(alreadyAge70.key, alreadyAge70.person)} is already age 70 or older at the projection start.`;
  }

  const doesNotReach70 = people.find(({ person }) => n(person.dob) <= 0 || endYear < n(person.dob) + 70);
  if (doesNotReach70) {
    return `CPP/OAS delay is skipped because ${personLabel(doesNotReach70.key, doesNotReach70.person)} does not reach age 70 within the projection.`;
  }

  return 'CPP/OAS delay is skipped until benefit estimates and age-70 timing are both ready to review.';
}

function canMoveRetirement(plan: V2PlanPayload, years: number): boolean {
  return activePeople(plan).every(({ person }) => {
    const retireYear = n(person.retireYear) || n(plan.assumptions.retireYear);
    const retireAge = personAgeInYear(person, retireYear);
    return retireAge !== null && retireAge + years <= 70;
  });
}

function totalAccountBalance(plan: V2PlanPayload, fields: Array<'rrsp' | 'lira' | 'lif' | 'tfsa' | 'nonreg'>): number {
  return fields.reduce((total, field) => total + n(plan.p1[field]) + n(plan.p2[field]), 0);
}

function hasMeaningfulWithdrawalBuckets(plan: V2PlanPayload): boolean {
  const registered = totalAccountBalance(plan, ['rrsp', 'lira', 'lif']);
  const flexibleInvested = totalAccountBalance(plan, ['tfsa', 'nonreg']);
  return registered >= WITHDRAWAL_BUCKET_MINIMUM && flexibleInvested >= WITHDRAWAL_BUCKET_MINIMUM;
}

function buildEligibilityNotes(plan: V2PlanPayload, contract: OptimizerContract): BoundedOptimizerEligibilityNote[] {
  const spending = n(plan.spending.gogo);
  const retireYear = n(plan.assumptions.retireYear) || n(plan.p1.retireYear);
  const p1RetireAge = personAgeInYear(plan.p1, n(plan.p1.retireYear) || retireYear);
  const p2RetireAge = p2LooksBlank(plan.p2) ? null : personAgeInYear(plan.p2, n(plan.p2.retireYear) || retireYear);
  const startYear = projectionStartYear(plan);
  const endYear = projectionEndYear(plan);
  const activeBenefitPeople = activePeople(plan);
  const benefitPeopleReady = activeBenefitPeople.every(({ person }) => personCanStillDelayBenefits(person, startYear, endYear));
  const registered = totalAccountBalance(plan, ['rrsp', 'lira', 'lif']);
  const hasTwoAccountBuckets = hasMeaningfulWithdrawalBuckets(plan);
  const pensionEligibleIncome = n(plan.p1.db_after65) + n(plan.p1.db_before65) + n(plan.p2.db_after65) + n(plan.p2.db_before65) + registered;
  const reachesPensionSplitAge = activePeople(plan).some(({ person }) => {
    const ageAtEnd = personAgeInYear(person, endYear);
    return ageAtEnd === null || ageAtEnd >= 65;
  });
  const hasDbPension = hasTwoPersonDbPensionIncome(plan);
  const hasPotentialPensionSplit = !p2LooksBlank(plan.p2) && pensionEligibleIncome > 25_000 && !hasDbPension && reachesPensionSplitAge;
  const isTwoPersonPlan = !p2LooksBlank(plan.p2);
  const cppSharingAlreadyOn = Boolean(plan.assumptions.cppSharing);
  const cppSharingReady =
    isTwoPersonPlan && !cppSharingAlreadyOn && activeBenefitPeople.every(({ person }) => hasCppEstimate(person) && personReachesCppStartAge(person, endYear));
  const downsizeYear = n(plan.downsize?.year);
  const downsizeProceeds = n(plan.downsize?.netProceeds);
  const hasCompleteDownsize = downsizeYear > 0 && downsizeProceeds > 0;
  const hasPartialDownsize = (downsizeYear > 0 || downsizeProceeds > 0) && !hasCompleteDownsize;
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
      !canExplore(contract, 'retirementTiming') || !canMoveRetirement(plan, 1)
        ? 'skipped'
        : 'eligible',
    reason:
      !canMoveRetirement(plan, 1)
        ? 'Working-longer tests are skipped when they would move retirement past age 70.'
        : 'Working-longer options can be reviewed because retirement timing is still inside the bounded test range.'
  });
  notes.push({
    lever: 'benefitTiming',
    status: !canExplore(contract, 'benefitTiming') || !benefitPeopleReady ? 'skipped' : 'eligible',
    reason: benefitTimingReason(plan, activeBenefitPeople, startYear, endYear, benefitPeopleReady)
  });
  notes.push({
    lever: 'withdrawalOrder',
    status: !canExplore(contract, 'withdrawalOrder') || !hasTwoAccountBuckets ? 'skipped' : 'eligible',
    reason: hasTwoAccountBuckets
      ? 'Withdrawal-order checks can be reviewed because there are meaningful balances in registered and TFSA/non-registered accounts.'
      : 'Withdrawal-order checks are skipped until there are meaningful balances in registered and TFSA/non-registered buckets.'
  });
  notes.push({
    lever: 'pensionSplitting',
    status: hasPotentialPensionSplit ? 'eligible' : 'skipped',
    reason: hasPotentialPensionSplit
      ? 'Pension-splitting can be reviewed because this two-person plan has pension or registered income to test.'
      : hasDbPension
        ? 'DB pension splitting is included in the current plan baseline for eligible two-person plans.'
        : 'Pension-splitting is skipped until a two-person plan has meaningful pension or registered income.'
  });
  notes.push({
    lever: 'cppSharing',
    status: cppSharingReady ? 'eligible' : 'skipped',
    reason: cppSharingReady
      ? 'CPP sharing can be reviewed because both people have CPP estimates in this two-person plan.'
      : !isTwoPersonPlan
        ? 'CPP sharing is skipped until this is a two-person plan.'
        : cppSharingAlreadyOn
          ? 'CPP sharing is already included in the current plan.'
          : 'CPP sharing is skipped unless both people have CPP estimates and reach CPP start age within the projection.'
  });
  notes.push({
    lever: 'downsizing',
    status: hasCompleteDownsize ? 'eligible' : 'skipped',
    reason: hasCompleteDownsize
      ? 'Home-sale reliance can be checked because a year and net cash amount are already part of the current plan.'
      : hasPartialDownsize
        ? 'Home-sale reliance is skipped until both the year and net cash amount are entered.'
        : 'Home-sale reliance is skipped because no home-sale cash is part of the current plan.'
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

function guardrailStatus(note: BoundedOptimizerEligibilityNote): BoundedOptimizerGuardrailNote['status'] {
  if (note.status === 'eligible') return 'tested';
  if (note.status === 'needsReview') return 'reviewFirst';
  return 'notTested';
}

function guardrailLabel(lever: BoundedOptimizerEligibilityNote['lever']): string {
  const labels: Record<BoundedOptimizerEligibilityNote['lever'], string> = {
    spending: 'Spending changes',
    retirementTiming: 'Work timing',
    benefitTiming: 'CPP/OAS timing',
    withdrawalOrder: 'Withdrawal order',
    estateTarget: 'Estate goal',
    downsizing: 'Downsizing',
    pensionSplitting: 'Pension splitting',
    cppSharing: 'CPP sharing',
    survivor: 'Survivor setup'
  };
  return labels[lever];
}

function buildGuardrailNotes(notes: BoundedOptimizerEligibilityNote[]): BoundedOptimizerGuardrailNote[] {
  return notes.map((note) => ({
    id: note.lever,
    label: guardrailLabel(note.lever),
    status: guardrailStatus(note),
    reason: note.reason
  }));
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

function withCppSharing(plan: V2PlanPayload): V2PlanPayload {
  const next = extractPlanPayload(plan);
  next.assumptions.cppSharing = true;
  return next;
}

function benefitGridCandidate(
  plan: V2PlanPayload,
  config: SimulationConfig,
  cppAge: number,
  oasAge: number
): BoundedOptimizerCandidateDefinition {
  return {
    id: benefitGridCandidateId(cppAge, oasAge),
    label: `Test CPP at ${cppAge} / OAS at ${oasAge}`,
    plan: extractPlanPayload(plan),
    config: { ...config, cppAgeF: cppAge, cppAgeM: cppAge, oasAgeF: oasAge, oasAgeM: oasAge },
    changedLevers: ['benefitTiming'],
    changeSummary: `Start CPP at ${cppAge} and OAS at ${oasAge} in this test`,
    reviewNote: 'Review health, bridge funding, and benefit estimates before choosing timing.',
    disruptionPenalty: Math.abs(cppAge - 65) * 1_500 + Math.abs(oasAge - 65) * 1_500
  };
}

function benefitGridCandidateId(cppAge: number, oasAge: number): BenefitGridCandidateId {
  return `benefitGridCpp${cppAge}Oas${oasAge}` as BenefitGridCandidateId;
}

function buildBenefitGridCandidates(plan: V2PlanPayload, config: SimulationConfig): BoundedOptimizerCandidateDefinition[] {
  return BENEFIT_GRID_CPP_AGES.flatMap((cppAge) =>
    BENEFIT_GRID_OAS_AGES.map((oasAge) => ({ cppAge, oasAge }))
  )
    .filter(({ cppAge, oasAge }) => !(cppAge === 65 && oasAge === 65))
    .filter(({ cppAge, oasAge }) => !(cppAge === 70 && oasAge === 70))
    .map(({ cppAge, oasAge }) => benefitGridCandidate(plan, config, cppAge, oasAge));
}

function limitBoundedOptimizerCandidates(candidates: BoundedOptimizerCandidateDefinition[]): BoundedOptimizerCandidateDefinition[] {
  if (candidates.length <= BOUNDED_OPTIMIZER_CANDIDATE_LIMIT) return candidates;
  const baseline = candidates[0];
  const rest = candidates.slice(1);
  const gridCandidates = rest.filter((candidate) => String(candidate.id).startsWith('benefitGrid'));
  const preservedCandidates = rest.filter((candidate) => !String(candidate.id).startsWith('benefitGrid'));
  const gridRoom = Math.max(0, BOUNDED_OPTIMIZER_CANDIDATE_LIMIT - 1 - preservedCandidates.length);
  return [baseline, ...gridCandidates.slice(0, gridRoom), ...preservedCandidates].slice(0, BOUNDED_OPTIMIZER_CANDIDATE_LIMIT);
}

function withoutDownsize(plan: V2PlanPayload): V2PlanPayload {
  const next = extractPlanPayload(plan);
  next.downsize = { ...(next.downsize || {}), year: 0, netProceeds: 0 };
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
    if (canMoveRetirement(plan, 1)) {
      candidates.push({
        id: 'retireLater1',
        label: 'Work 1 year longer',
        plan: retireLater(plan, 1),
        config,
        changedLevers: ['retirementTiming'],
        changeSummary: 'Move retirement one year later',
        reviewNote: 'Review whether work timing is truly flexible before relying on this option.',
        disruptionPenalty: 10_000
      });
    }
    if (canMoveRetirement(plan, 2)) {
      candidates.push({
        id: 'retireLater2',
        label: 'Work 2 years longer',
        plan: retireLater(plan, 2),
        config,
        changedLevers: ['retirementTiming'],
        changeSummary: 'Move retirement two years later',
        reviewNote: 'This may improve funding, but it changes a major life assumption.',
        disruptionPenalty: 20_000
      });
    }
  }

  if (eligible(eligibilityNotes, 'benefitTiming')) {
    candidates.push(
      ...buildBenefitGridCandidates(plan, config),
      {
        id: 'delayBenefits',
        label: 'Test CPP/OAS at 70',
        plan: extractPlanPayload(plan),
        config: { ...config, cppAgeF: 70, cppAgeM: 70, oasAgeF: 70, oasAgeM: 70 },
        changedLevers: ['benefitTiming'],
        changeSummary: 'Start CPP/OAS at 70 in this test',
        reviewNote: 'Review health, bridge funding, and benefit estimates before choosing timing.',
        disruptionPenalty: 5_000
      }
    );
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

  if (eligible(eligibilityNotes, 'cppSharing')) {
    candidates.push({
      id: 'cppSharing',
      label: 'Test CPP sharing',
      plan: withCppSharing(plan),
      config,
      changedLevers: ['cppSharing'],
      changeSummary: 'Turn on CPP sharing in this test',
      reviewNote: 'Review CPP sharing eligibility and household tax details before relying on this option.',
      disruptionPenalty: 1_500
    });
  }

  if (eligible(eligibilityNotes, 'downsizing')) {
    candidates.push({
      id: 'withoutDownsize',
      label: 'Check without home-sale cash',
      plan: withoutDownsize(plan),
      config,
      changedLevers: ['downsizing'],
      changeSummary: 'Remove home-sale cash in this reliance check',
      reviewNote: 'This checks how much the plan depends on home-sale cash. It is not a suggestion to sell or keep the home.',
      disruptionPenalty: 1_000_000
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

  return limitBoundedOptimizerCandidates(candidates);
}

function summarizeResult(result: SimulationResult | null | undefined) {
  const rows = Array.isArray(result?.years) ? result.years : [];
  const totalTax = n((result as { totalTax?: unknown } | null | undefined)?.totalTax);
  const firstShortfall = rows.find((row) => n(row.shortfall) > 1);
  const fundedYears = rows.filter((row) => n(row.shortfall) <= 1).length;
  const lastRow = rows[rows.length - 1];
  const fundedThroughYear = firstShortfall ? n(firstShortfall.year) - 1 : lastRow ? n(lastRow.year) : null;
  const fundedRows = rows.filter((row) => n(row.shortfall) <= 1);
  const sustainableAnnualSpend = fundedRows.length
    ? Math.min(...fundedRows.map((row) => n(row.totalAftaxYear || row.spending)).filter((value) => value > 0))
    : 0;
  return {
    rows,
    fundedYears,
    totalYears: rows.length,
    fundedThroughYear,
    firstShortfallYear: firstShortfall ? n(firstShortfall.year) : null,
    sustainableAnnualSpend,
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
  const spendingScore = summary.sustainableAnnualSpend * 3;
  const portfolioScore = summary.endPortfolio / 25;
  const taxScore = (baseline.lifetimeTax - summary.lifetimeTax) / 5;
  return fixedShortfallBonus + noShortfallBonus + fundedScore + spendingScore + portfolioScore + taxScore - disruptionPenalty;
}

function isDisruptiveChoice(row: Pick<BoundedOptimizerCandidateRow, 'changedLevers'>): boolean {
  return row.changedLevers.some((lever) => lever === 'spending' || lever === 'retirementTiming' || lever === 'benefitTiming');
}

function isMaterialFundingRepair(
  summary: ReturnType<typeof summarizeResult>,
  baseline: ReturnType<typeof summarizeResult>
): boolean {
  if (baseline.firstShortfallYear && !summary.firstShortfallYear) return true;
  if (baseline.firstShortfallYear && summary.fundedYears >= baseline.fundedYears + 2) return true;
  return false;
}

function hasWeakBenefitBridge(summary: ReturnType<typeof summarizeResult>): boolean {
  return benefitBridgeShortfall(summary).count > 0;
}

function benefitBridgeShortfall(summary: ReturnType<typeof summarizeResult>): { count: number; firstYear: number | null } {
  const bridgeRows = summary.rows.filter((row) => {
    const beforeAge70 = (n(row.ageF) > 0 && n(row.ageF) < 70) || (n(row.ageM) > 0 && n(row.ageM) < 70);
    return beforeAge70 && n(row.shortfall) > 1;
  });
  return { count: bridgeRows.length, firstYear: bridgeRows[0] ? n(bridgeRows[0].year) : null };
}

function hasMeaningfulNonDisruptiveImprovement(
  summary: ReturnType<typeof summarizeResult>,
  baseline: ReturnType<typeof summarizeResult>
): boolean {
  return summary.fundedYears > baseline.fundedYears || summary.endPortfolio - baseline.endPortfolio > 25_000 || baseline.lifetimeTax - summary.lifetimeTax > 5_000;
}

function estateTargetGap(summary: ReturnType<typeof summarizeResult>, estateTarget: number): number {
  return estateTarget > 0 ? Math.max(0, estateTarget - summary.endPortfolio) : 0;
}

function recommendationPermission(
  row: Pick<BoundedOptimizerCandidateRow, 'id' | 'label' | 'changedLevers'>,
  summary: ReturnType<typeof summarizeResult>,
  baseline: ReturnType<typeof summarizeResult>,
  estateTarget: number,
  survivorNeedsReview = false
): { eligible: boolean; reason: string } {
  if (row.id === 'baseline') {
    return { eligible: true, reason: 'The current plan can stay first when other options do not clear the suggestion bar.' };
  }

  if (row.id === 'withoutDownsize') {
    return { eligible: false, reason: 'This home-sale reliance check is evidence only, so it stays review-only and is not highlighted as the first option.' };
  }

  if (summary.totalYears === 0) {
    return { eligible: false, reason: 'This option did not produce a usable projection.' };
  }

  if (estateTarget > 0 && summary.endPortfolio < estateTarget) {
    const baselineGap = estateTargetGap(baseline, estateTarget);
    const candidateGap = estateTargetGap(summary, estateTarget);
    const worsensGap = candidateGap > baselineGap + 1;
    if (!isMaterialFundingRepair(summary, baseline) || worsensGap) {
      return {
        eligible: false,
        reason: 'This option stays review-only because it weakens the entered estate goal. Change the estate goal first if that trade-off is intentional.'
      };
    }
  }

  if (row.changedLevers.includes('benefitTiming') && hasWeakBenefitBridge(summary)) {
    const bridge = benefitBridgeShortfall(summary);
    return {
      eligible: false,
      reason: `Benefit delay remains review-only because ${bridge.count} bridge year${bridge.count === 1 ? '' : 's'} before age 70 ${bridge.count === 1 ? 'shows' : 'show'} a spending shortfall${bridge.firstYear ? `, starting in ${bridge.firstYear}` : ''}.`
    };
  }

  if (row.changedLevers.includes('benefitTiming') && survivorNeedsReview) {
    return {
      eligible: false,
      reason: 'Benefit timing stays review-only until a survivor scenario year is set for this two-person plan.'
    };
  }

  if (isDisruptiveChoice(row)) {
    return isMaterialFundingRepair(summary, baseline)
      ? { eligible: true, reason: 'This disruptive option can be reviewed first because it materially improves a visible funding shortfall.' }
      : { eligible: false, reason: 'This option changes lifestyle, work timing, or benefit timing, so it stays review-only unless it materially repairs a funding problem.' };
  }

  return hasMeaningfulNonDisruptiveImprovement(summary, baseline)
    ? { eligible: true, reason: 'This option can be reviewed first because it improves taxes, funded years, or projected money left without changing lifestyle or work timing.' }
    : { eligible: false, reason: 'This option is close to the current plan, so it stays review-only.' };
}

function compareRows(a: BoundedOptimizerCandidateRow, b: BoundedOptimizerCandidateRow): number {
  if (a.score !== b.score) return b.score - a.score;
  if (a.firstShortfallYear && !b.firstShortfallYear) return 1;
  if (!a.firstShortfallYear && b.firstShortfallYear) return -1;
  if (a.id === 'baseline') return -1;
  if (b.id === 'baseline') return 1;
  return a.label.localeCompare(b.label);
}

function optionGroupForRow(row: Pick<BoundedOptimizerCandidateRow, 'id' | 'changedLevers'>): BoundedOptimizerOptionGroupId {
  if (row.id === 'baseline') return 'currentPlan';
  if (row.changedLevers.includes('spending')) return 'lifestyle';
  if (row.changedLevers.includes('retirementTiming') || row.changedLevers.includes('benefitTiming')) return 'timing';
  if (row.changedLevers.includes('pensionSplitting') || row.changedLevers.includes('cppSharing')) return 'incomeSharing';
  if (row.changedLevers.includes('withdrawalOrder')) return 'drawdownReview';
  if (row.changedLevers.includes('downsizing') || row.changedLevers.includes('estateTarget')) return 'homeEstate';
  return 'currentPlan';
}

function optionGroupLabel(id: BoundedOptimizerOptionGroupId): Pick<BoundedOptimizerOptionGroup, 'label' | 'summary'> {
  const labels: Record<BoundedOptimizerOptionGroupId, Pick<BoundedOptimizerOptionGroup, 'label' | 'summary'>> = {
    currentPlan: {
      label: 'Current plan',
      summary: 'The comparison point for every check.'
    },
    lifestyle: {
      label: 'Lifestyle choices',
      summary: 'Spending changes stay review-only unless they repair a visible funding issue.'
    },
    timing: {
      label: 'Timing choices',
      summary: 'Work and benefit timing can change major life assumptions, so they need stronger support.'
    },
    incomeSharing: {
      label: 'Income-sharing checks',
      summary: 'Pension splitting and CPP sharing are tax and income checks for eligible couples.'
    },
    drawdownReview: {
      label: 'Drawdown review',
      summary: 'Withdrawal-order checks are high-level comparisons, not tax-aware instructions.'
    },
    homeEstate: {
      label: 'Home and estate checks',
      summary: 'Home-sale cash and estate goals are treated as household preferences to review.'
    }
  };
  return labels[id];
}

function buildOptionGroups(rows: BoundedOptimizerCandidateRow[]): BoundedOptimizerOptionGroup[] {
  const order: BoundedOptimizerOptionGroupId[] = ['currentPlan', 'lifestyle', 'timing', 'incomeSharing', 'drawdownReview', 'homeEstate'];
  return order
    .map((id) => {
      const groupRows = rows.filter((row) => optionGroupForRow(row) === id);
      const label = optionGroupLabel(id);
      return {
        id,
        ...label,
        candidateIds: groupRows.map((row) => row.id),
        reviewOnlyCount: groupRows.filter((row) => row.status === 'review' || !row.suggestionEligible).length,
        canHighlightCount: groupRows.filter((row) => row.suggestionEligible).length
      } satisfies BoundedOptimizerOptionGroup;
    })
    .filter((group) => group.candidateIds.length > 0);
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
  if (row.changedLevers.includes('cppSharing')) {
    tradeoffs.push('CPP sharing can shift taxable income between spouses, but eligibility and household tax details need review.');
  }
  if (row.changedLevers.includes('downsizing')) {
    tradeoffs.push('Home-sale cash is a lifestyle-sensitive assumption; this check only shows reliance on that cash.');
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
    whyThisOption.unshift('The current plan stays first because other options do not clear the suggestion bar.');
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
        : `${suggested.label} is the first option to review because it cleared the suggestion checks without widening the search.`
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

function buildCppSharingEvidence(
  summaries: Partial<Record<BoundedOptimizerCandidateId, ReturnType<typeof summarizeResult>>>
): BoundedOptimizerEvidenceRow[] {
  const baseline = summaries.baseline;
  const sharing = summaries.cppSharing;
  if (!baseline || !sharing || sharing.totalYears === 0) return [];

  const lifetimeTaxDelta = sharing.lifetimeTax - baseline.lifetimeTax;
  const firstYearTaxDelta = sharing.firstYearTax - baseline.firstYearTax;
  const peakTaxDelta = sharing.peakTax - baseline.peakTax;
  const oasDelta = sharing.lifetimeOasRecovery - baseline.lifetimeOasRecovery;
  const portfolioDelta = sharing.endPortfolio - baseline.endPortfolio;

  return [
    {
      id: 'cppSharingLifetimeTax',
      label: 'CPP sharing lifetime tax change',
      value: signedMoneyText(lifetimeTaxDelta),
      detail: 'Compares total tax across the projection when CPP sharing is turned on for this review.',
      tone: evidenceTone(lifetimeTaxDelta)
    },
    {
      id: 'cppSharingFirstYearTax',
      label: 'CPP sharing first-year tax change',
      value: signedMoneyText(firstYearTaxDelta),
      detail: 'Shows whether the first projection year changes when CPP sharing is tested.',
      tone: evidenceTone(firstYearTaxDelta)
    },
    {
      id: 'cppSharingPeakTax',
      label: 'CPP sharing peak tax change',
      value: signedMoneyText(peakTaxDelta),
      detail: 'Compares the highest annual tax year with and without CPP sharing in this check.',
      tone: evidenceTone(peakTaxDelta)
    },
    {
      id: 'cppSharingOasRecovery',
      label: 'CPP sharing OAS recovery tax change',
      value: signedMoneyText(oasDelta),
      detail: 'Shows whether OAS recovery tax changes across the projection.',
      tone: evidenceTone(oasDelta)
    },
    {
      id: 'cppSharingPortfolio',
      label: 'CPP sharing projected money-left change',
      value: signedMoneyText(portfolioDelta),
      detail: 'Compares projected money left at the end of the plan.',
      tone: evidenceTone(portfolioDelta, false)
    }
  ];
}

function buildBenefitTimingEvidence(
  summaries: Partial<Record<BoundedOptimizerCandidateId, ReturnType<typeof summarizeResult>>>
): BoundedOptimizerEvidenceRow[] {
  const baseline = summaries.baseline;
  const delay = summaries.delayBenefits;
  if (!baseline || !delay || delay.totalYears === 0) return [];

  const gridEvidence = buildBenefitGridEvidence(summaries, baseline);
  const bridge = benefitBridgeShortfall(delay);
  const lifetimeTaxDelta = delay.lifetimeTax - baseline.lifetimeTax;
  const portfolioDelta = delay.endPortfolio - baseline.endPortfolio;

  return [
    ...gridEvidence,
    {
      id: 'benefitBridgeYears',
      label: 'Bridge years before age 70',
      value: bridge.count ? `${bridge.count} shortfall year${bridge.count === 1 ? '' : 's'}` : 'No visible bridge shortfall',
      detail: 'Checks whether delaying CPP/OAS creates spending gaps before age 70.',
      tone: bridge.count ? 'watch' : 'neutral'
    },
    {
      id: 'benefitFirstBridgeShortfall',
      label: 'First bridge shortfall',
      value: bridge.firstYear ? String(bridge.firstYear) : 'None visible',
      detail: baseline.firstShortfallYear ? `Current plan first shortfall: ${baseline.firstShortfallYear}.` : 'Current plan has no visible shortfall in the projection years checked.',
      tone: bridge.firstYear ? 'watch' : 'neutral'
    },
    {
      id: 'benefitLifetimeTax',
      label: 'Delay lifetime tax change',
      value: signedMoneyText(lifetimeTaxDelta),
      detail: 'Compares total tax when CPP/OAS are delayed to 70 in this review.',
      tone: evidenceTone(lifetimeTaxDelta)
    },
    {
      id: 'benefitPortfolio',
      label: 'Delay projected money-left change',
      value: signedMoneyText(portfolioDelta),
      detail: 'Compares projected money left at the end of the plan.',
      tone: evidenceTone(portfolioDelta, false)
    }
  ];
}

function parseBenefitGridId(id: string): { cppAge: number; oasAge: number } | null {
  const match = /^benefitGridCpp(\d+)Oas(\d+)$/.exec(id);
  if (!match) return null;
  return { cppAge: Number(match[1]), oasAge: Number(match[2]) };
}

function compareBenefitGridSummaries(
  a: { id: BoundedOptimizerCandidateId; summary: ReturnType<typeof summarizeResult> },
  b: { id: BoundedOptimizerCandidateId; summary: ReturnType<typeof summarizeResult> }
): number {
  if (a.summary.totalYears === 0 && b.summary.totalYears > 0) return 1;
  if (a.summary.totalYears > 0 && b.summary.totalYears === 0) return -1;
  if (a.summary.firstShortfallYear && !b.summary.firstShortfallYear) return 1;
  if (!a.summary.firstShortfallYear && b.summary.firstShortfallYear) return -1;
  if (a.summary.fundedYears !== b.summary.fundedYears) return b.summary.fundedYears - a.summary.fundedYears;
  if (a.summary.endPortfolio !== b.summary.endPortfolio) return b.summary.endPortfolio - a.summary.endPortfolio;
  if (a.summary.lifetimeTax !== b.summary.lifetimeTax) return a.summary.lifetimeTax - b.summary.lifetimeTax;
  return String(a.id).localeCompare(String(b.id));
}

function buildBenefitGridEvidence(
  summaries: Partial<Record<BoundedOptimizerCandidateId, ReturnType<typeof summarizeResult>>>,
  baseline: ReturnType<typeof summarizeResult>
): BoundedOptimizerEvidenceRow[] {
  const gridRows = Object.entries(summaries)
    .filter(([id, summary]) => id.startsWith('benefitGrid') && summary && summary.totalYears > 0)
    .map(([id, summary]) => ({ id: id as BoundedOptimizerCandidateId, summary: summary as ReturnType<typeof summarizeResult> }))
    .sort(compareBenefitGridSummaries);
  const best = gridRows[0];
  const ages = best ? parseBenefitGridId(best.id) : null;
  if (!best || !ages) return [];

  const fundedYearsDelta = best.summary.fundedYears - baseline.fundedYears;
  const lifetimeTaxDelta = best.summary.lifetimeTax - baseline.lifetimeTax;
  const portfolioDelta = best.summary.endPortfolio - baseline.endPortfolio;

  return [
    {
      id: 'benefitGridBestPair',
      label: 'First milestone pair to review',
      value: `CPP ${ages.cppAge} / OAS ${ages.oasAge}`,
      detail: 'Highest-ranked result inside the bounded benefit-timing milestone grid, before full exhaustive search.',
      tone: best.summary.firstShortfallYear ? 'watch' : 'neutral'
    },
    {
      id: 'benefitGridTopThree',
      label: 'Other milestone pairs to compare',
      value: topBenefitGridPairText(gridRows.slice(0, 3)),
      detail: 'Shows the leading milestone pairs from the same bounded grid so the first pair is not read in isolation.',
      tone: 'neutral'
    },
    {
      id: 'benefitGridFundedYears',
      label: 'Milestone funded years',
      value: fundedYearsDelta === 0 ? 'No change' : `${fundedYearsDelta > 0 ? '+' : ''}${fundedYearsDelta} year${Math.abs(fundedYearsDelta) === 1 ? '' : 's'}`,
      detail: 'Compares funded projection years for the best milestone pair against the current plan.',
      tone: fundedYearsDelta === 0 ? 'neutral' : fundedYearsDelta > 0 ? 'ok' : 'watch'
    },
    {
      id: 'benefitGridLifetimeTax',
      label: 'Milestone lifetime tax change',
      value: signedMoneyText(lifetimeTaxDelta),
      detail: 'Compares total tax for the best milestone pair against the current plan.',
      tone: evidenceTone(lifetimeTaxDelta)
    },
    {
      id: 'benefitGridPortfolio',
      label: 'Milestone money-left change',
      value: signedMoneyText(portfolioDelta),
      detail: 'Compares projected money left for the best milestone pair against the current plan.',
      tone: evidenceTone(portfolioDelta, false)
    }
  ];
}

function topBenefitGridPairText(rows: Array<{ id: BoundedOptimizerCandidateId; summary: ReturnType<typeof summarizeResult> }>): string {
  return rows
    .map((row) => parseBenefitGridId(row.id))
    .filter((ages): ages is { cppAge: number; oasAge: number } => Boolean(ages))
    .map((ages) => `CPP ${ages.cppAge} / OAS ${ages.oasAge}`)
    .join('; ');
}

function buildHomeSaleRelianceEvidence(
  summaries: Partial<Record<BoundedOptimizerCandidateId, ReturnType<typeof summarizeResult>>>,
  plan: V2PlanPayload
): BoundedOptimizerEvidenceRow[] {
  const baseline = summaries.baseline;
  const withoutHomeCash = summaries.withoutDownsize;
  if (!baseline || !withoutHomeCash || withoutHomeCash.totalYears === 0) return [];

  const fundedYearsDelta = withoutHomeCash.fundedYears - baseline.fundedYears;
  const lifetimeTaxDelta = withoutHomeCash.lifetimeTax - baseline.lifetimeTax;
  const portfolioDelta = withoutHomeCash.endPortfolio - baseline.endPortfolio;
  const estateTarget = n(plan.inheritance);
  const estateGapDelta = estateTargetGap(withoutHomeCash, estateTarget) - estateTargetGap(baseline, estateTarget);

  const rows: BoundedOptimizerEvidenceRow[] = [
    {
      id: 'homeRelianceFundedYears',
      label: 'Home-sale reliance check',
      value: fundedYearsDelta === 0 ? 'No change' : `${fundedYearsDelta > 0 ? '+' : ''}${fundedYearsDelta} year${Math.abs(fundedYearsDelta) === 1 ? '' : 's'}`,
      detail: 'Compares the Current plan with Without home-sale cash to show how many funded years change.',
      tone: fundedYearsDelta === 0 ? 'neutral' : fundedYearsDelta > 0 ? 'ok' : 'watch'
    },
    {
      id: 'homeRelianceFirstShortfall',
      label: 'First shortfall without home-sale cash',
      value: withoutHomeCash.firstShortfallYear ? String(withoutHomeCash.firstShortfallYear) : 'None visible',
      detail: baseline.firstShortfallYear
        ? `Current plan first shortfall: ${baseline.firstShortfallYear}.`
        : 'Current plan has no visible shortfall in the projection years checked.',
      tone: withoutHomeCash.firstShortfallYear && !baseline.firstShortfallYear ? 'watch' : 'neutral'
    },
    {
      id: 'homeReliancePortfolio',
      label: 'Projected money-left change',
      value: signedMoneyText(portfolioDelta),
      detail: 'Compares projected money left at the end of the plan without home-sale cash.',
      tone: evidenceTone(portfolioDelta, false)
    },
    {
      id: 'homeRelianceLifetimeTax',
      label: 'Lifetime tax change',
      value: signedMoneyText(lifetimeTaxDelta),
      detail: 'Compares total tax across the projection without home-sale cash.',
      tone: evidenceTone(lifetimeTaxDelta)
    }
  ];

  if (estateTarget > 0) {
    rows.push({
      id: 'homeRelianceEstateGap',
      label: 'Estate goal gap change',
      value: signedMoneyText(estateGapDelta),
      detail: 'Shows whether removing home-sale cash widens the gap against the entered estate goal.',
      tone: evidenceTone(estateGapDelta)
    });
  }

  return rows;
}

function withdrawalFamilyLabel(id: BoundedOptimizerCandidateId): string {
  if (id === 'withdrawalRegisteredFirst') return 'Registered first';
  if (id === 'withdrawalNonRegisteredFirst') return 'Non-registered first';
  if (id === 'withdrawalDefault') return 'Default order';
  return 'Withdrawal family';
}

function buildWithdrawalFamilyEvidence(
  summaries: Partial<Record<BoundedOptimizerCandidateId, ReturnType<typeof summarizeResult>>>,
  suggested: BoundedOptimizerCandidateRow | null
): BoundedOptimizerEvidenceRow[] {
  const baseline = summaries.baseline;
  const candidate = suggested ? summaries[suggested.id] : null;
  if (!baseline || !candidate || !suggested?.changedLevers.includes('withdrawalOrder') || candidate.totalYears === 0) return [];

  const fundedYearsDelta = candidate.fundedYears - baseline.fundedYears;
  const lifetimeTaxDelta = candidate.lifetimeTax - baseline.lifetimeTax;
  const firstYearTaxDelta = candidate.firstYearTax - baseline.firstYearTax;
  const peakTaxDelta = candidate.peakTax - baseline.peakTax;
  const oasDelta = candidate.lifetimeOasRecovery - baseline.lifetimeOasRecovery;
  const portfolioDelta = candidate.endPortfolio - baseline.endPortfolio;

  return [
    {
      id: 'withdrawalFamilyFirst',
      label: 'Withdrawal family to compare',
      value: withdrawalFamilyLabel(suggested.id),
      detail: 'Compares the leading broad withdrawal-order family with the current plan. This is not an annual account instruction.',
      tone: 'neutral'
    },
    {
      id: 'withdrawalFamilyFundedYears',
      label: 'Withdrawal family funded years',
      value: fundedYearsDelta === 0 ? 'No change' : `${fundedYearsDelta > 0 ? '+' : ''}${fundedYearsDelta} year${Math.abs(fundedYearsDelta) === 1 ? '' : 's'}`,
      detail: 'Compares funded projection years for the leading withdrawal family against the current plan.',
      tone: fundedYearsDelta === 0 ? 'neutral' : fundedYearsDelta > 0 ? 'ok' : 'watch'
    },
    {
      id: 'withdrawalFamilyLifetimeTax',
      label: 'Withdrawal family lifetime tax change',
      value: signedMoneyText(lifetimeTaxDelta),
      detail: 'Compares total tax for the leading broad withdrawal family against the current plan.',
      tone: evidenceTone(lifetimeTaxDelta)
    },
    {
      id: 'withdrawalFamilyFirstYearTax',
      label: 'Withdrawal family first-year tax change',
      value: signedMoneyText(firstYearTaxDelta),
      detail: 'Compares first projection-year tax for the leading broad withdrawal family against the current plan.',
      tone: evidenceTone(firstYearTaxDelta)
    },
    {
      id: 'withdrawalFamilyPeakTax',
      label: 'Withdrawal family peak tax change',
      value: signedMoneyText(peakTaxDelta),
      detail: 'Compares the highest annual tax year for the leading broad withdrawal family against the current plan.',
      tone: evidenceTone(peakTaxDelta)
    },
    {
      id: 'withdrawalFamilyOasRecovery',
      label: 'Withdrawal family OAS recovery change',
      value: signedMoneyText(oasDelta),
      detail: 'Compares OAS recovery tax for the leading broad withdrawal family against the current plan.',
      tone: evidenceTone(oasDelta)
    },
    {
      id: 'withdrawalFamilyPortfolio',
      label: 'Withdrawal family money-left change',
      value: signedMoneyText(portfolioDelta),
      detail: 'Compares projected money left for the leading broad withdrawal family against the current plan.',
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

function buildWithdrawalFeedbackReview({
  candidateFamilies,
  candidates,
  evidenceRows,
  readinessRows,
  searchPlan
}: {
  candidateFamilies: OptimizerCandidateFamily[];
  candidates: BoundedOptimizerCandidateRow[];
  evidenceRows: BoundedOptimizerEvidenceRow[];
  readinessRows: OptimizerReadinessRow[];
  searchPlan: OptimizerSearchPlan;
}): WithdrawalFeedbackReview {
  const familyStatus = candidateFamilies.find((family) => family.id === 'broadWithdrawalFamilies')?.status || 'blocked';
  const withdrawalCandidateCount = candidates.filter((candidate) => candidate.changedLevers.includes('withdrawalOrder')).length;
  const withdrawalEvidenceRows = evidenceRows.filter((row) => row.id.startsWith('withdrawalFamily'));
  const survivorNeedsReview = readinessRows.find((row) => row.id === 'survivor')?.status === 'review';

  const rows: WithdrawalFeedbackReviewRow[] = [
    {
      id: 'familyPresence',
      label: 'Broad families present',
      status: familyStatus === 'included' && withdrawalCandidateCount > 0 ? 'ready' : 'blocked',
      detail:
        familyStatus === 'included' && withdrawalCandidateCount > 0
          ? `${withdrawalCandidateCount} broad withdrawal-family checks are available for feedback.`
          : 'Broad withdrawal-family feedback waits for meaningful registered and flexible account balances.'
    },
    {
      id: 'evidenceClarity',
      label: 'Comparison evidence',
      status: withdrawalEvidenceRows.length >= 4 ? 'ready' : familyStatus === 'included' ? 'review' : 'blocked',
      detail:
        withdrawalEvidenceRows.length >= 4
          ? 'When a withdrawal family leads, Details shows funded years, tax, OAS recovery, and money-left evidence.'
          : familyStatus === 'included'
            ? 'Broad families can be reviewed in the option table even when one does not lead the current run.'
            : 'Withdrawal evidence is held until broad families can be compared.'
    },
    {
      id: 'annualInstructionBoundary',
      label: 'Annual actions deferred',
      status: searchPlan.annualOverrides === 'deferred' ? 'ready' : 'blocked',
      detail: 'The review compares broad families only; it does not create year-by-year account instructions.'
    },
    {
      id: 'guardrails',
      label: 'Household guardrails',
      status: survivorNeedsReview ? 'review' : 'ready',
      detail:
        survivorNeedsReview
          ? 'Feedback should check whether survivor setup is clear before widening drawdown sequencing.'
          : 'Survivor and estate guardrails do not block broad-family feedback for this plan.'
    },
    {
      id: 'savedOutputBoundary',
      label: 'Saved output boundary',
      status: 'ready',
      detail: 'No withdrawal-family result or feedback checkpoint is saved into the plan file.'
    }
  ];

  const hasBlocked = rows.some((row) => row.status === 'blocked');
  const hasReview = rows.some((row) => row.status === 'review');
  const status: WithdrawalFeedbackReview['status'] = hasBlocked ? 'needsInputReview' : hasReview ? 'holdForCleanup' : 'readyForFeedback';

  return {
    status,
    headline:
      status === 'readyForFeedback'
        ? 'Broad withdrawal-family evidence is ready for feedback.'
        : status === 'holdForCleanup'
          ? 'Broad withdrawal-family evidence can be reviewed, with a few assumptions to check first.'
          : 'Broad withdrawal-family feedback needs input cleanup first.',
    detail:
      'This checkpoint decides whether users understand the high-level drawdown comparison before annual withdrawal sequencing is planned.',
    rows,
    questions:
      status === 'needsInputReview'
        ? [
            'Which missing input made the broad withdrawal-family check unavailable?',
            'Does the user understand what account balances are needed before comparing drawdown families?',
            'Is it clear that annual sequencing has not started?'
          ]
        : [
            'Can the user explain current plan versus broad withdrawal-family comparison in their own words?',
            'Can the user identify that funded years, tax, OAS recovery, and money left are evidence, not instructions?',
            'Does the user understand why annual account-level sequencing is still deferred?'
          ],
    confusionSignals: [
      'User reads a broad family as a year-by-year withdrawal instruction.',
      'User looks for exact account amounts before reviewing the high-level trade-off.',
      'User treats lower tax or higher money left as advice instead of plan-review evidence.'
    ],
    worksheet:
      status === 'needsInputReview'
        ? [
            {
              id: 'understanding',
              label: 'Input understanding',
              prompt: 'Ask which missing input stopped the broad withdrawal-family comparison.',
              passSignal: 'User can identify the missing account-bucket or benefit input without reading it as an app error.'
            },
            {
              id: 'evidence',
              label: 'Evidence expectation',
              prompt: 'Ask what evidence they expected to see once inputs are ready.',
              passSignal: 'User expects high-level comparison evidence, not account-by-account instructions.'
            },
            {
              id: 'boundary',
              label: 'Boundary clarity',
              prompt: 'Ask whether it is clear that annual sequencing has not started.',
              passSignal: 'User understands blocked broad-family checks do not create a withdrawal plan.'
            },
            {
              id: 'decision',
              label: 'Next decision',
              prompt: 'Ask what should happen next before annual sequencing is considered.',
              passSignal: 'User points to input cleanup or clearer evidence, not immediate annual account actions.'
            }
          ]
        : [
            {
              id: 'understanding',
              label: 'Comparison understanding',
              prompt: 'Ask the user to explain the current plan versus broad withdrawal-family comparison.',
              passSignal: 'User describes it as a high-level comparison, not a command to change accounts.'
            },
            {
              id: 'evidence',
              label: 'Evidence interpretation',
              prompt: 'Ask which evidence rows changed and why those rows matter.',
              passSignal: 'User names funded years, tax, OAS recovery, or money left as review evidence.'
            },
            {
              id: 'boundary',
              label: 'Instruction boundary',
              prompt: 'Ask whether the screen tells them exactly what to withdraw each year.',
              passSignal: 'User answers no and recognizes annual account-level sequencing is deferred.'
            },
            {
              id: 'decision',
              label: 'Next decision',
              prompt: 'Ask whether the evidence is clear enough to plan annual sequencing later.',
              passSignal: 'User can say proceed, hold, or simplify with a specific reason.'
            }
          ],
    decision:
      status === 'readyForFeedback'
        ? {
            status: 'collectFeedback',
            label: 'Collect feedback before annual sequencing',
            detail: 'The next step is user feedback on broad-family evidence, not annual account-level architecture.',
            requiredEvidence: [
              'Users can explain broad families as comparisons.',
              'Users understand tax and money-left rows as evidence.',
              'Users do not read the output as account instructions.'
            ]
          }
        : status === 'needsInputReview'
          ? {
              status: 'cleanUpInputs',
              label: 'Clean up inputs before feedback',
              detail: 'The broad-family check is not ready for feedback until blocked inputs are repaired.',
              requiredEvidence: [
                'Meaningful registered and flexible account balances are present.',
                'The comparison can produce broad withdrawal-family candidates.',
                'The user understands why the check was unavailable.'
              ]
            }
          : {
              status: 'holdAnnualSequencing',
              label: 'Hold annual sequencing',
              detail: 'Review assumptions and copy before planning annual account-level sequencing.',
              requiredEvidence: [
                'Survivor or household guardrails are clear.',
                'Broad-family evidence is understandable without account instructions.',
                'No confusion signals appear in feedback.'
              ]
            },
    outcome:
      status === 'readyForFeedback'
        ? {
            status: 'readyToReview',
            label: 'Ready to review with testers',
            detail: 'Use the worksheet to decide whether broad-family evidence is understood before annual sequencing is planned.',
            nextSteps: [
              'Run the worksheet against at least one plan where a broad family leads.',
              'Record whether users understand the evidence without account instructions.',
              'Hold annual sequencing if any confusion signal appears.'
            ]
          }
        : status === 'needsInputReview'
          ? {
              status: 'repairInputs',
              label: 'Repair inputs first',
              detail: 'The broad-family review is blocked until input cleanup makes the comparison meaningful.',
              nextSteps: [
                'Repair missing account-bucket readiness.',
                'Run Results again after inputs are corrected.',
                'Do not plan annual sequencing from a blocked comparison.'
              ]
            }
          : {
              status: 'deferSequencing',
              label: 'Defer sequencing and simplify',
              detail: 'Broad-family evidence needs clearer assumptions or copy before annual sequencing planning.',
              nextSteps: [
                'Review survivor or household guardrails.',
                'Simplify broad-family explanation if users confuse it with instructions.',
                'Keep annual sequencing deferred until the worksheet passes.'
              ]
            },
    nextDecision:
      status === 'readyForFeedback'
        ? 'Collect feedback on whether broad families are understandable before planning annual account-level sequencing.'
        : 'Clean up blocked inputs or unclear household assumptions before planning annual account-level sequencing.'
  };
}

export function runBoundedOptimizer(
  plan: V2PlanPayload,
  runner: BoundedOptimizerRunner = runSimulationSafely
): BoundedOptimizerSummary {
  const contract = buildOptimizerContract(plan);
  const estateTarget = n(plan.inheritance);
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
  const survivorNeedsReview = eligibilityNotes.some((note) => note.lever === 'survivor' && note.status === 'needsReview');
  const rows = summarizedResults.map(({ definition, summary }) => {
    const recommendation = recommendationPermission(definition, summary, baselineSummary, estateTarget, survivorNeedsReview);
    return {
      id: definition.id,
      label: definition.label,
      status: summary.totalYears > 0 ? 'review' : 'blocked',
      changedLevers: definition.changedLevers,
      changeSummary: definition.changeSummary,
      reviewNote: definition.reviewNote,
      suggestionEligible: recommendation.eligible,
      suggestionReason: recommendation.reason,
      fundedYears: summary.fundedYears,
      totalYears: summary.totalYears,
      fundedThroughYear: summary.fundedThroughYear,
      firstShortfallYear: summary.firstShortfallYear,
      sustainableAnnualSpend: summary.sustainableAnnualSpend,
      endPortfolio: summary.endPortfolio,
      endPortfolioDelta: summary.endPortfolio - baselineSummary.endPortfolio,
      lifetimeTax: summary.lifetimeTax,
      lifetimeTaxDelta: summary.lifetimeTax - baselineSummary.lifetimeTax,
      score: scoreCandidate(summary, baselineSummary, definition.disruptionPenalty)
    } satisfies BoundedOptimizerCandidateRow;
  });

  const eligibleRows = rows.filter((row) => row.status !== 'blocked');
  const sortedRows = [...eligibleRows].sort(compareRows);
  const baselineCandidate = rows.find((row) => row.id === 'baseline') || null;
  const suggested = contract.status === 'readyForExtraction' ? sortedRows.find((row) => row.suggestionEligible) || baselineCandidate : null;
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
  const evidenceRows = [
    ...buildBenefitTimingEvidence(summaryById),
    ...buildPensionSplittingEvidence(summaryById),
    ...buildCppSharingEvidence(summaryById),
    ...buildHomeSaleRelianceEvidence(summaryById, plan),
    ...buildWithdrawalFamilyEvidence(summaryById, suggestedRow)
  ];
  const driverRows = buildDriverRows(suggestedRow, baselineRow, summaryById);
  const guardrailNotes = buildGuardrailNotes(eligibilityNotes);
  const recommendationNotes: BoundedOptimizerRecommendationNote[] = rows
    .filter((row) => row.id !== 'baseline')
    .map((row) => ({
      candidateId: row.id,
      label: row.label,
      status: row.suggestionEligible ? 'canHighlight' : 'reviewOnly',
      reason: row.suggestionReason
    }));
  const optionGroups = buildOptionGroups(candidates);
  const readinessRows = buildReadinessRows(plan, contract, eligibilityNotes);
  const candidateFamilies = buildCandidateFamilies(readinessRows);
  const searchPlan = buildSearchPlan(plan);
  const withdrawalFeedbackReview = buildWithdrawalFeedbackReview({
    candidateFamilies,
    candidates,
    evidenceRows,
    readinessRows,
    searchPlan
  });

  return {
    status: contract.status === 'readyForExtraction' && Boolean(suggested) ? 'ready' : 'blocked',
    execution: 'boundedSearch',
    contract,
    objective: buildObjectiveContract(),
    readinessRows,
    candidateFamilies,
    searchPlan,
    headline: suggested
      ? `${suggested.label} is the first option to review in this limited set.`
      : 'Plan options can be reviewed after required inputs are cleared.',
    detail:
      'This checks a small set of spending, timing, benefit, and withdrawal-order options. It is a planning review, not financial advice or a full tax optimizer.',
    suggestedCandidateId: suggested?.id ?? null,
    suggestedLabel,
    candidateCount: candidates.length,
    candidates,
    eligibilityNotes,
    guardrailNotes,
    recommendationNotes,
    optionGroups,
    evidenceRows,
    driverRows,
    withdrawalFeedbackReview,
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
