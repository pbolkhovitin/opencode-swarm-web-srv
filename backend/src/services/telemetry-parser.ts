import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import type { TelemetryEvent } from '../types/telemetry.js';

/**
 * Интерфейс для параметров фильтрации телеметрии
 */
export interface TelemetryFilterParams {
  from?: number;
  to?: number;
  eventType?: string;
  agentId?: string;
  limit?: number;
}

/**
 * Результат парсинга телеметрии для MVP
 */
export interface TelemetryParseResult {
  events: TelemetryEvent[];
  totalLines: number;
  parsedLines: number;
  errors: number;
}

/**
 * Читает и парсит данные телеметрии из JSONL файла
 * Минимальная реализация для MVP
 * @param filePath - путь к файлу telemetry.jsonl
 * @param params - параметры фильтрации
 * @returns результат парсинга с событиями и статистикой
 */
export async function parseTelemetryFile(
  filePath: string,
  params: TelemetryFilterParams
): Promise<TelemetryParseResult> {
  const events: TelemetryEvent[] = [];
  let totalLines = 0;
  let parsedLines = 0;
  let errors = 0;
  const limit = params.limit ?? 100;

  return new Promise((resolve) => {
    try {
      const readStream = createReadStream(filePath, { encoding: 'utf-8' });
      const rl = createInterface({ input: readStream });

      rl.on('line', (line: string) => {
        totalLines++;
        const trimmed = line.trim();
        if (!trimmed) return;

        try {
          const record = JSON.parse(trimmed);
          parsedLines++;

          // Базовая валидация
          if (typeof record.timestamp !== 'string' || typeof record.event !== 'string') {
            errors++;
            return;
          }

          const event: TelemetryEvent = {
            timestamp: new Date(record.timestamp).getTime(),
            eventType: record.event,
            agentId: record.agentName || record.sessionId || undefined,
            data: record
          };

          // Простая фильтрация
          if (params.from !== undefined && event.timestamp < params.from) return;
          if (params.to !== undefined && event.timestamp > params.to) return;
          if (params.eventType !== undefined && event.eventType !== params.eventType) return;
          if (params.agentId !== undefined && event.agentId !== params.agentId) return;

          events.push(event);

          if (events.length >= limit) {
            rl.close();
            readStream.destroy();
          }
        } catch (parseError) {
          errors++;
          console.warn(
            `Malformed line ${totalLines}: ${trimmed.substring(0, 80)}... Error: ${parseError}`
          );
        }
      });

      rl.on('close', () => {
        resolve({ events, totalLines, parsedLines, errors });
      });

      rl.on('error', () => {
        resolve({ events, totalLines, parsedLines, errors });
      });
    } catch {
      // Файл не существует или недоступен
      resolve({ events: [], totalLines: 0, parsedLines: 0, errors: 0 });
    }
  });
}
