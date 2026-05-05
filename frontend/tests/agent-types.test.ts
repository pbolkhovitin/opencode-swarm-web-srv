import { describe, test, expect } from 'bun:test';
import { AGENTS, AGENT_SIZES } from '../src/lib/agent-types.ts';

describe('Frontend agent types', () => {
  test('CODER тип имеет корректный цвет и иконку', () => {
    const coder = AGENTS.coder;
    expect(coder.id).toBe('coder');
    expect(coder.name).toBe('Coder');
    expect(coder.color).toBe('#22c55e');
    expect(coder.icon).toBe('💻');
  });

  test('SIZES и статус стили доступны', () => {
    expect(AGENT_SIZES.small).toBe(32);
    expect(AGENTS.reviewer.color).toBe('#f59e0b');
  });
});
