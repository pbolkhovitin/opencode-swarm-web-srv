import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import Fastify from 'fastify';
import { telemetryRoutes } from '../src/routes/telemetry.js';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';

// Подготовим telemetry.jsonl в корневом каталоге проекта (.swarm/telemetry.jsonl)
const telemetryDir = join(process.cwd(), '..', '.swarm');
const telemetryPath = join(process.cwd(), '..', '.swarm', 'telemetry.jsonl');

describe('Telemetry routes (backend) - /api/telemetry', () => {
  let fastify: Fastify.FastifyInstance;

  beforeAll(() => {
    // Ensure .swarm директория существует
    try { const fs = require('fs'); if (!fs.existsSync(telemetryDir)) fs.mkdirSync(telemetryDir, { recursive: true }); } catch {}
    // Запишем две валидные строки
    const lines = [
      JSON.stringify({ timestamp: '2026-01-01T00:00:00Z', event: 'task_started', agentName: 'agent-1' }),
      JSON.stringify({ timestamp: '2026-01-01T00:01:00Z', event: 'agent_status_changed', agentName: 'agent-1' }),
    ];
    writeFileSync(telemetryPath, lines.join('\n') + '\n', { encoding: 'utf8' });

    fastify = Fastify({ logger: false });
    telemetryRoutes(fastify);
  });

  afterAll(() => {
    try { if (existsSync(telemetryPath)) unlinkSync(telemetryPath); } catch {}
  });

  test('GET /api/telemetry возвращает список событий', async () => {
    const res = await fastify.inject({ method: 'GET', url: '/api/telemetry' });
    expect(res.statusCode).toBe(200);
    const data = res.json as any[];
    expect(Array.isArray(data)).toBe(true);
    // Должны быть две записи из файла
    expect(data.length).toBeGreaterThanOrEqual(2);
  });

  test('GET /api/telemetry с неверным параметром from возвращает 400', async () => {
    const res = await fastify.inject({ method: 'GET', url: '/api/telemetry?from=abc' });
    expect(res.statusCode).toBe(400);
  });

  test('GET /api/telemetry с limit=0 возвращает 400', async () => {
    const res = await fastify.inject({ method: 'GET', url: '/api/telemetry?limit=0' });
    expect(res.statusCode).toBe(400);
  });
});

// no-op helper
