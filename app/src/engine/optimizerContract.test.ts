import { describe, expect, it } from 'vitest';
import { createBlankPlan } from '../data/defaultPlan';
import { createPlanFile } from '../data/planFile';
import { buildOptimizerContract } from './optimizerContract';

describe('optimizer contract boundary', () => {
  it('describes future optimizer inputs without running or persisting optimizer output', () => {
    const plan = createBlankPlan();
    plan.title = 'Optimizer contract test';
    plan.p1 = {
      ...plan.p1,
      name: 'Alex',
      dob: 1968,
      retireYear: 2032,
      rrsp: 250000,
      tfsa: 90000,
      cpp65_monthly: 1200,
      oas_monthly: 742
    };
    plan.spending.gogo = 85000;
    plan.assumptions.retireYear = 2032;
    plan.assumptions.planEnd = 2065;
    plan.assumptions.withdrawalOrder = 'default';

    const contract = buildOptimizerContract(plan);

    expect(contract).toMatchObject({
      status: 'readyForExtraction',
      execution: 'notRun',
      withdrawalStrategy: {
        mode: 'currentOrder',
        order: 'default',
        annualOverrides: []
      }
    });
    expect(contract.levers.map((lever) => lever.id)).toEqual([
      'spending',
      'retirementTiming',
      'benefitTiming',
      'withdrawalOrder',
      'estateTarget',
      'downsizing'
    ]);
    expect(contract.levers.find((lever) => lever.id === 'withdrawalOrder')?.guardrail).toContain('year-by-year');
    expect(createPlanFile(plan).plan).not.toHaveProperty('optimizerContract');
  });

  it('marks missing or blocked optimizer inputs without executing a search', () => {
    const plan = createBlankPlan();
    plan.p1.retireYear = 0;
    plan.spending.gogo = 0;
    plan.assumptions.retireYear = 0;

    const contract = buildOptimizerContract(plan);

    expect(contract.status).toBe('notReady');
    expect(contract.execution).toBe('notRun');
    expect(contract.blockers.length).toBeGreaterThan(0);
    expect(contract.levers.find((lever) => lever.id === 'spending')).toMatchObject({ permission: 'needsDecision' });
    expect(contract.levers.find((lever) => lever.id === 'retirementTiming')).toMatchObject({ permission: 'needsDecision' });
  });
});
