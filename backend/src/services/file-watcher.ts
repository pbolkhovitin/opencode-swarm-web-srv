import { watch, type FSWatcher } from 'fs';
import { createReadStream, statSync, mkdirSync, existsSync } from 'fs';
import { createInterface } from 'readline';
import { dirname } from 'path';
import type { FastifyInstance } from 'fastify';

const TELEMETRY_FILE_PATH = '.swarm/telemetry.jsonl';
const MAX_INITIAL_EVENTS = 10;

let fileWatcher: FSWatcher | null = null;
let lastFileSize = 0;
let fastifyInstance: FastifyInstance;

/**
 * Настраивает файловый watcher для мониторинга изменений в .swarm/telemetry.jsonl
 * При изменении файла новые события автоматически транслируются через WebSocket
 * @param fastify - Экземпляр Fastify сервера для логирования
 */
export function setupFileWatcher(fastify: FastifyInstance): void {
  fastifyInstance = fastify;

  // Создаём директорию .swarm если её нет (первый запуск)
  ensureTelemetryFileExists();

  // Читаем начальные события из файла
  readInitialEvents();

  // Начинаем следить за изменениями файла
  fileWatcher = watch(TELEMETRY_FILE_PATH, (eventType) => {
    if (eventType === 'change') {
      onFileChanged();
    }
  });

  fastify.log.info({ file: TELEMETRY_FILE_PATH }, 'File watcher started');
}

function ensureTelemetryFileExists(): void {
  try {
    statSync(TELEMETRY_FILE_PATH);
  } catch {
    // Файл не существует - создадим директорию если нужно
    const dir = dirname(TELEMETRY_FILE_PATH);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    fastifyInstance.log.info({ file: TELEMETRY_FILE_PATH }, 'Telemetry file will be created on first event');
  }
}

function readInitialEvents(): void {
  try {
    const stats = statSync(TELEMETRY_FILE_PATH);
    lastFileSize = stats.size;

    const events: unknown[] = [];
    const readStream = createReadStream(TELEMETRY_FILE_PATH, { start: 0 });
    const rl = createInterface({ input: readStream });

    rl.on('line', (line) => {
      if (line.trim()) {
        try {
          events.push(JSON.parse(line));
        } catch {
          fastifyInstance.log.warn({ line }, 'Failed to parse JSONL line');
        }
      }
    });

    rl.on('close', () => {
      // Отправляем последние N событий новым клиентам
      const initialEvents = events.slice(-MAX_INITIAL_EVENTS);
      fastifyInstance.log.info({ count: initialEvents.length }, 'Loaded initial telemetry events');
    });
  } catch {
    // Файл ещё не существует
    fastifyInstance.log.debug('No telemetry file to read initial events from');
  }
}

function onFileChanged(): void {
  try {
    const stats = statSync(TELEMETRY_FILE_PATH);
    const newSize = stats.size;

    // Читаем только новые данные (с того места, где остановились)
    if (newSize > lastFileSize) {
      const readStream = createReadStream(TELEMETRY_FILE_PATH, { start: lastFileSize, end: newSize - 1 });
      const rl = createInterface({ input: readStream });

      rl.on('line', (line) => {
        if (line.trim()) {
          try {
            const event = JSON.parse(line);
            // MVP: пока просто логируем, WebSocket отключен
            fastifyInstance.log.info({ event }, 'New telemetry event (MVP - WebSocket disabled)');
          } catch {
            fastifyInstance.log.warn({ line }, 'Failed to parse new telemetry line');
          }
        }
      });

      lastFileSize = newSize;
    } else if (newSize < lastFileSize) {
      // Файл был усечен или перезаписан
      lastFileSize = 0;
      readInitialEvents();
    }
  } catch (error) {
    fastifyInstance.log.error({ error }, 'Error reading telemetry file changes');
  }
}

/**
 * Останавливает файловый watcher и освобождает ресурсы
 */
export function stopFileWatcher(): void {
  if (fileWatcher) {
    fileWatcher.close();
    fileWatcher = null;
    fastifyInstance?.log.info('File watcher stopped');
  }
}
