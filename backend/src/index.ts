import Fastify from 'fastify';
import { createServer } from 'http';
import type { TelemetryEvent } from './types/telemetry.ts';
import { setupFileWatcher, stopFileWatcher } from './services/file-watcher.ts';
import { telemetryRoutes } from './routes/telemetry.ts';

const fastify = Fastify({
  logger: true,
  ajv: {
    customOptions: {
      coerceTypes: true
    }
  }
});

// CORS настройка - разрешаем запросы с frontend (localhost:5173)
const corsOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

// Hook для добавления CORS и security headers ко всем ответам
fastify.addHook('onRequest', async (request, reply) => {
  const origin = request.headers.origin;
  
  // Проверяем, если origin в списке разрешённых
  if (origin && corsOrigins.includes(origin)) {
    reply.header('Access-Control-Allow-Origin', origin);
    reply.header('Access-Control-Allow-Credentials', 'true');
    reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  }
  
  // Security заголовки
  reply.header('X-Content-Type-Options', 'nosniff');
  reply.header('X-Frame-Options', 'DENY');
  reply.header('X-XSS-Protection', '1; mode=block');
  reply.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  reply.header('Permissions-Policy', 'geolocation=(), microphone=()');
});

// Handle preflight CORS запросов
fastify.options('/', async (_request, reply) => {
  reply.header('Access-Control-Max-Age', '86400');
  return reply.send();
});

const httpServer = createServer((req, res) => {
  // Делегируем запросы в Fastify
  fastify.server.emit('request', req, res);
});

// Маршрут GET /health для проверки здоровья сервера
/**
 * Health check endpoint
 * @returns Объект с статусом и временной меткой
 */
fastify.get('/health', async (_request, _reply) => {
  return { status: 'ok', timestamp: Date.now() };
});

// Маршрут POST /telemetry для приёма событий телеметрии
/**
 * Приём событий телеметрии от OpenCode Swarm
 * @param request - HTTP запрос с телом типа TelemetryEvent
 * @returns Объект с подтверждением получения
 */
fastify.post<{ Body: TelemetryEvent }>('/telemetry', async (request, _reply) => {
  const event = request.body;
  // Логируем полученное событие
  fastify.log.info({ event }, 'Received telemetry event');
  
  // MVP: WebSocket отключен, телеметрия только логируется
  return { received: true, eventType: event.eventType };
});

// Регистрация маршрутов телеметрии
await fastify.register(telemetryRoutes);

const start = async () => {
  try {
    // Запускаем Fastify на HTTP сервере
    await fastify.listen({ port: 3000, host: '0.0.0.0' });

    console.log('Server listening on http://localhost:3000');

    // Запускаем file watcher для telemetry.jsonl
    setupFileWatcher(fastify);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Обработка завершения процесса
process.on('SIGINT', async () => {
  stopFileWatcher();
  await fastify.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  stopFileWatcher();
  await fastify.close();
  process.exit(0);
});

start();
