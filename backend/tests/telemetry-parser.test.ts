import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { parseTelemetryFile } from '../src/services/telemetry-parser.js';
import { TelemetryParseResult, TelemetryFilterParams } from '../src/services/telemetry-parser.js';
import { join } from 'path';
import { writeFileSync, unlinkSync, existsSync, mkdirSync } from 'fs';

// Тесты для парсера телеметрии
describe('Telemetry parser (backend) - parseTelemetryFile', () => {
  const tmpPath = '/tmp/opencode-telemetry-test.jsonl';

  beforeAll(() => {
    // Очистка файла если он существует
    try { if (existsSync(tmpPath)) unlinkSync(tmpPath); } catch {}
  });

  afterAll(() => {
    try { if (existsSync(tmpPath)) unlinkSync(tmpPath); } catch {}
  });

  test('парсит валидные строки и применяет фильтры', async () => {
    const lines = [
      JSON.stringify({ timestamp: '2026-01-01T00:00:00Z', event: 'task_started', agentName: 'agent-1', some: 1 }),
      JSON.stringify({ timestamp: '2026-01-01T00:01:00Z', event: 'agent_status_changed', agentName: 'agent-1' }),
      'not-json',
    ];

    require('fs').writeFileSync(tmpPath, lines.join('\n') + '\n', { encoding: 'utf8' });

    const params: TelemetryFilterParams = {
      limit: 5,
      eventType: 'task_started',
      agentId: 'agent-1',
    };

    const result: TelemetryParseResult = await parseTelemetryFile(tmpPath, params);

    // Одна валидная строка удовлетворяет фильтрам
    expect(result.events.length).toBe(1);
    expect(result.events[0].eventType).toBe('task_started');
    expect(result.events[0].agentId).toBe('agent-1');
    expect(typeof result.events[0].timestamp).toBe('number');
  });

  test('обрабатывает несуществующий файл gracefully', async () => {
    const fakePath = '/tmp/does-not-exist-telemetry.jsonl';
    const result = await parseTelemetryFile(fakePath, {} as TelemetryFilterParams);
    expect(result.events).toBeInstanceOf(Array);
    expect(result.events.length).toBe(0);
    expect(result.totalLines).toBe(0);
  });
});
