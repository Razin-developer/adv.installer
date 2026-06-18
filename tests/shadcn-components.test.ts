import { describe, expect, it } from 'vitest';
import { ALL_COMPONENTS, ESSENTIAL_COMPONENTS } from '../src/config/shadcn-components.js';

describe('shadcn component defaults', () => {
  it('keeps the essential preset curated instead of installing every component', () => {
    expect(ESSENTIAL_COMPONENTS.length).toBeLessThan(ALL_COMPONENTS.length);

    for (const component of ESSENTIAL_COMPONENTS) {
      expect(ALL_COMPONENTS).toContain(component);
    }
  });
});
