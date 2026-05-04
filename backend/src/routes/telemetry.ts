import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import * as path from 'path';
import { parseTelemetryFile, type TelemetryFilterParams } from '../services/telemetry-parser.js';

/**
 * Регистрирует маршруты телеметрии в Fastify приложении
 * @param fastify - экземпляр Fastify
 */
export async function telemetryRoutes(fastify: FastifyInstance): Promise<void> {
  // Маршрут GET /api/telemetry для получения исторических данных
  fastify.get<{ Querystring: TelemetryQueryParams }>(
    '/api/telemetry',
    async (request: FastifyRequest<{ Querystring: TelemetryQueryParams }>, _reply: FastifyReply) => {
      const { from, to, eventType, agentId, limit } = request.query;

      // Базовая валидация параметров
      const params: TelemetryFilterParams = {};

      if (from !== undefined) {
        if (typeof from !== 'number' || from < 0) {
          return _reply.status(400).send({ error: 'Invalid "from" parameter: must be a positive number' });
        }
        params.from = from;
      }

      if (to !== undefined) {
        if (typeof to !== 'number' || to < 0) {
          return _reply.status(400).send({ error: 'Invalid "to" parameter: must be a positive number' });
        }
        params.to = to;
      }

      if (from !== undefined && to !== undefined && from > to) {
        return _reply.status(400).send({ error: 'Invalid range: "from" must be less than "to"' });
      }

      if (eventType !== undefined) {
        if (typeof eventType !== 'string' || eventType.length === 0) {
          return _reply.status(400).send({ error: 'Invalid "eventType" parameter: must be a non-empty string' });
        }
        params.eventType = eventType;
      }

      if (agentId !== undefined) {
        if (typeof agentId !== 'string' || agentId.length === 0) {
          return _reply.status(400).send({ error: 'Invalid "agentId" parameter: must be a non-empty string' });
        }
        params.agentId = agentId;
      }

      if (limit !== undefined) {
        if (typeof limit !== 'number' || limit < 1 || limit > 1000) {
          return _reply.status(400).send({ error: 'Invalid "limit" parameter: must be a number between 1 and 1000' });
        }
        params.limit = limit;
      }

      // Путь к файлу telemetry.jsonl (в корне проекта, на уровень выше backend)
      const telemetryFilePath = path.resolve(process.cwd(), '..', '.swarm', 'telemetry.jsonl');

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
