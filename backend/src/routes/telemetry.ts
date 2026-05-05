import Fastify from 'fastify';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { parseTelemetryFile, type TelemetryFilterParams } from '../services/telemetry-parser.ts';

// ESM эквивалент __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Регистрирует маршруты телеметрии в Fastify приложении
 * @param fastify - экземпляр Fastify
 */
export async function telemetryRoutes(fastify: Fastify.FastifyInstance): Promise<void> {
  // Маршрут GET /api/telemetry для получения исторических данных
  fastify.get<{ Querystring: TelemetryQueryParams }>(
    '/api/telemetry',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            from: { type: 'number', minimum: 0 },
            to: { type: 'number', minimum: 0 },
            eventType: { type: 'string', minLength: 1 },
            agentId: { type: 'string', minLength: 1 },
            limit: { type: 'number', minimum: 1, maximum: 1000 }
          },
          additionalProperties: false
        }
      }
    },
    async (request: Fastify.FastifyRequest<{ Querystring: TelemetryQueryParams }>, _reply: Fastify.FastifyReply) => {
      const { from, to, eventType, agentId, limit } = request.query;

      // Параметры уже валидированы схемой Fastify с автоматическим преобразованием типов
      const params: TelemetryFilterParams = {};

      if (from !== undefined) {
        if (from < 0) {
          return _reply.status(400).send({ error: 'Invalid "from" parameter: must be a positive number' });
        }
        params.from = from;
      }

      if (to !== undefined) {
        if (to < 0) {
          return _reply.status(400).send({ error: 'Invalid "to" parameter: must be a positive number' });
        }
        params.to = to;
      }

      if (from !== undefined && to !== undefined && from > to) {
        return _reply.status(400).send({ error: 'Invalid range: "from" must be less than "to"' });
      }

      if (eventType !== undefined) {
        if (eventType.length === 0) {
          return _reply.status(400).send({ error: 'Invalid "eventType" parameter: must be a non-empty string' });
        }
        params.eventType = eventType;
      }

      if (agentId !== undefined) {
        if (agentId.length === 0) {
          return _reply.status(400).send({ error: 'Invalid "agentId" parameter: must be a non-empty string' });
        }
        params.agentId = agentId;
      }

      if (limit !== undefined) {
        if (limit < 1 || limit > 1000) {
          return _reply.status(400).send({ error: 'Invalid "limit" parameter: must be a number between 1 and 1000' });
        }
        params.limit = limit;
      }

      // Путь к файлу telemetry.jsonl (в корне проекта)
      const telemetryFilePath = path.resolve(__dirname, '..', '..', '..', '.swarm', 'telemetry.jsonl');

      // Читаем и фильтруем данные (функция сама обработает отсутствие файла)
      const result = await parseTelemetryFile(telemetryFilePath, params);

      return result.events;
    }
  );
}

/**
 * Интерфейс для параметров запроса GET /api/telemetry
 */
interface TelemetryQueryParams {
  from?: number;
  to?: number;
  eventType?: string;
  agentId?: string;
  limit?: number;
}
