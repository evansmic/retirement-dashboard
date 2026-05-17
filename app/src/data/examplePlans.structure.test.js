import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const stableDashboardSource = readFileSync(new URL('../../../retirement_dashboard.html', import.meta.url), 'utf8');
const examplePlansSource = readFileSync(new URL('./examplePlans.ts', import.meta.url), 'utf8');

describe('Example plan registry structure', () => {
  it('keeps React examples aligned with the stable dashboard example slugs', () => {
    const metaStart = stableDashboardSource.indexOf('const PRESET_META');
    const metaEnd = stableDashboardSource.indexOf('];', metaStart);
    const stableExampleIds = Array.from(stableDashboardSource.slice(metaStart, metaEnd).matchAll(/slug:'([^']+)'/g)).map(
      (match) => match[1]
    );
    const cardStart = examplePlansSource.indexOf('export const examplePlanCards');
    const cardEnd = examplePlansSource.indexOf('];', cardStart);
    const reactExampleIds = Array.from(examplePlansSource.slice(cardStart, cardEnd).matchAll(/id: '([^']+)'/g)).map(
      (match) => match[1]
    );

    expect(reactExampleIds).toEqual(stableExampleIds);
  });
});
