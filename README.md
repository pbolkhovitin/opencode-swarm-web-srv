# opencode-swarm-web-srv

> Веб-панель визуализации для мониторинга многозадачной оркестрации OpenCode Swarm в реальном времени.

> **Статус:** Phase 1 MVP COMPLETE ✅ | Phase 2-4 IN PROGRESS 🔄

## 📋 Концепция

**OpenCode Swarm** — это система многозадачной оркестрации, где специализированные AI-агенты (Architect, Coder, Reviewer, Explorer, Test Engineer, SME и Docs) сотрудничают для выполнения задач разработки ПО. Этот проект предоставляет **веб-панель визуализации** для мониторинга и отображения сессий swarm в реальном времени.

**Что делает эта панель?**
- Визуализирует все 7 типов агентов как отдельные сущности с индикаторами статуса ✅
- Показывает потоки делегирования задач между агентами (анимация ожидает) ⏳
- Потоковая передача событий из `.swarm/telemetry.jsonl` через опрос (интервал 2с) 🔄
- Предоставляет исторические представления временной шкалы прошлых сессий с фильтрацией ✅
- Поддерживает производительность с виртуальной прокруткой (Svelte 4 + requestAnimationFrame) 🚀

## ✨ Функции (Статус MVP)

- **Визуализация 7 типов агентов** - Агенты Architect, Coder, Reviewer, Explorer, Test Engineer, SME и Docs с уникальными аватарами ✅
- **Обновления в реальном времени** - Обновления на основе опроса каждые 2 секунды (WebSocket отложен до пост-MVP) 🔄
- **Анимация потока задач** - Анимированные направленные стрелки, показывающие делегирование задач между агентами (Ожидает: Фаза 3) ⏳
- **Отображение статуса агента** - Визуальные состояния: pending, in_progress, completed, blocked ✅
- **Исторические данные** - Представление временной шкалы с фильтрацией по типу агента, статусу задачи и временному диапазону ✅
- **Отслеживание жизненного цикла задачи** - Полная видимость переходов задач с временными метками и продолжительностью ✅
- **Безопасность только для чтения** - Никогда не изменяет файлы в директории `.swarm/` ✅
- **Оптимизация производительности** - Виртуальная прокрутка с requestAnimationFrame, реактивные выражения Svelte 4 ($:) 🚀

## 🏗️ Обзор архитектуры (MVP)

```
┌─────────────────────────────────────────────────────┐
│                    Browser (Dashboard)              │
│  ┌─────────────────────────────────────────────┐   │
│  │         Svelte 4 Frontend (Vite)           │   │
│  │  - Agent Avatars  - Task Flow Visualization │   │
│  │  - Timeline View  - Polling Mode (2s)      │   │
│  └──────────────────────┬──────────────────────┘   │
│                          │ HTTP Polling (2s)        │
└──────────────────────────┼──────────────────────────┘
                            │
┌──────────────────────────┼──────────────────────────┐
│  Backend (Fastify)       │                          │
│  ┌──────────────────────┴──────────────────────┐   │
│  │  - REST API (historical data + filtering)    │   │
│  │  - Polling Endpoint: GET /api/telemetry     │   │
│  │  - Health Check: GET /health                │   │
│  │  - File Parser (telemetry.jsonl)            │   │
│  └──────────────────────┬──────────────────────┘   │
│                          │ read-only                │
└──────────────────────────┼──────────────────────────┘
                            │
                     ┌──────┴──────┐
                     │  .swarm/     │
                     │  telemetry   │
                     │  .jsonl      │
                     └─────────────┘
```

### Компоненты

| Компонент | Технология | Ответственность |
|-----------|------------|----------------|
| Frontend Dashboard | Svelte 4 + Vite + TypeScript | Визуализация агентов, задач и событий |
| Backend API Server | Node.js + Fastify + TypeScript | Обслуживание REST API (режим опроса) |
| Telemetry Parser | Node.js streams + readline | Парсинг telemetry.jsonl с обработкой ошибок |
| File Watcher | chokidar (готов, не используется в MVP) | Мониторинг `.swarm/telemetry.jsonl` на изменения |

## 🛠️ Технологический стек

### Backend
- **Runtime**: Node.js
- **Language**: TypeScript (strict mode)
- **Framework**: Fastify (с AJV coerceTypes для параметров запроса)
- **WebSocket**: @fastify/websocket (отключен для MVP)
- **Парсинг файлов**: Node.js fs streams + readline

### Frontend
- **Framework**: Svelte 4 (НЕ Svelte 5 - использует $: реактивные выражения)
- **Build Tool**: Vite
- **Language**: TypeScript
- **Производительность**: Виртуальная прокрутка с requestAnimationFrame

### Источник данных
- **Telemetry File**: `.swarm/telemetry.jsonl` (только чтение, формат JSONL)

## 📋 Предварительные требования

- **Node.js** v18 или выше
- **npm** v8 или выше (или эквивалентный пакетный менеджер)
- Запущенная сессия OpenCode Swarm с присутствующим `.swarm/telemetry.jsonl`

## 📦 Установка

```bash
# Clone the repository
git clone https://github.com/your-org/opencode-swarm-web-srv.git
cd opencode-swarm-web-srv

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## 🚀 Разработка

Запустите и backend, и frontend в режиме разработки:

### Терминал 1 - Backend
```bash
cd backend
npm install
npm run dev
# Fastify server starts on http://localhost:3000
# API endpoints:
#   - GET  /health - Health check
#   - POST /telemetry - Receive telemetry events (logs only in MVP)
#   - GET  /api/telemetry?limit=50&eventType=... - Historical data with filtering
```

### Терминал 2 - Frontend
```bash
cd frontend
npm install
npm run dev
# Vite dev server starts on http://localhost:5173
# Dashboard available at http://localhost:5173
```

**Примечание:** MVP использует **режим опроса** (frontend опрашивает `GET /api/telemetry` каждые 2 секунды). Поддержка WebSocket отключена до пост-MVP фаз.

## 🏗️ Сборка для продакшена

```bash
# Install dependencies (if not done yet)
cd backend && npm install
cd ../frontend && npm install

# Build backend (compiles TypeScript to JavaScript)
cd backend
npm run build
# Output: backend/dist/

# Build frontend (creates production bundle)
cd ../frontend
npm run build
# Output: frontend/dist/
```

### Запуск в продакшене

```bash
# Start backend server (from backend directory)
cd backend
npm start
# Server runs on http://localhost:3000

# Serve frontend (using any static file server)
cd ../frontend
npx vite preview
# Or serve the dist/ folder with your preferred web server
```

## 📁 Структура проекта

```
opencode-swarm-web-srv/
├── backend/                    # Fastify + TypeScript backend
│   ├── src/
│   │   ├── index.ts            # Fastify server entry point with CORS/security headers
│   │   ├── routes/
│   │   │   └── telemetry.ts   # GET /api/telemetry with JSON Schema validation
│   │   ├── services/
│   │   │   ├── telemetry-parser.ts  # Parse telemetry.jsonl (streams + readline)
│   │   │   ├── file-watcher.ts      # chokidar watcher (ready, unused in MVP)
│   │   │   └── websocket.ts         # WebSocket service (disabled for MVP)
│   │   └── types/
│   │       ├── telemetry.ts   # TelemetryEvent type definition
│   │       └── ws.d.ts       # WebSocket type declarations
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # Svelte 4 + Vite frontend
│   ├── src/
│   │   ├── main.ts            # Svelte app entry point
│   │   ├── App.svelte        # Root Svelte component
│   │   ├── components/
│   │   │   ├── EventVisualization.svelte  # Main event list with virtual scroll
│   │   │   ├── AgentAvatar.svelte         # Agent avatar display
│   │   │   └── TaskCard.svelte            # Task card component
│   │   ├── lib/
│   │   │   ├── agent-types.ts   # Agent type definitions + AGENTS config
│   │   │   ├── event-types.ts   # Event types + color mapping
│   │   │   ├── task-types.ts    # Task type definitions
│   │   │   └── config.ts        # API_URL, POLL_INTERVAL, TELEMETRY_LIMIT
│   │   └── routes/
│   │       └── +page.svelte     # SvelteKit-style route (if used)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── svelte.config.js
│   └── tsconfig.json
│
├── .swarm/                     # Swarm orchestration files (read-only)
│   ├── telemetry.jsonl         # Telemetry data source (generated by swarm)
│   ├── spec.md                 # Project specification
│   └── plan.md                 # Implementation plan
│
├── tests/                      # Test files
│   ├── backend/
│   │   ├── telemetry-route.test.ts
│   │   └── telemetry-parser.test.ts
│   └── frontend/
│       └── agent-types.test.ts
│
├── AGENTS.md                   # Agent configurations
└── README.md                   # This file
```

## 📄 Спецификация

Полная спецификация проекта документирована в [.swarm/spec.md](.swarm/spec.md) и включает:

### Функциональные требования (FR-001 to FR-012)
- FR-001: Agent Visualization (all 7 agent types) ✅
- FR-002: Agent Status Display (4 visual states) ✅
- FR-003: Task Delegation Flow (animated arrows) ⏳
- FR-004: Real-time Event Streaming (polling mode, 2s) ✅
- FR-005: Event Data Source Integration (telemetry.jsonl) ✅
- FR-006: WebSocket Communication (disabled for MVP) ⏳
- FR-007: Historical Data Access (with filtering) ✅
- FR-008: Task Lifecycle Visualization ✅
- FR-009: Performance (virtual scrolling, 60fps target) 🚀
- FR-010: Read-only Data Access ✅
- FR-011: Local Development Support (CORS) ✅
- FR-012: Multi-session Support (deferred)

### Критерии успеха (SC-001 to SC-006)
- SC-001: Agent Display Verification (2s load time) ✅
- SC-002: Real-time Update Verification (polling: ~2s latency) ✅
- SC-003: Animation Performance Verification (virtual scroll) 🚀
- SC-004: Data Integrity Verification (100% accuracy) ✅
- SC-005: Read-only Compliance Verification ✅
- SC-006: Historical Data Retrieval (<500ms for 10k events) ✅

## 📋 План реализации

План реализации документирован в [.swarm/plan.md](.swarm/plan.md) и состоит из:

| Фаза | Название | Статус | Задачи |
|------|----------|--------|-------|
| 1 | Настройка проекта и скаффолдинг | ✅ **COMPLETE** | 7 tasks (1.1-1.7) |
| 2 | Разработка Backend | 🔄 **IN PROGRESS** | 3 tasks (2.1-2.3) |
| 3 | Визуализация Frontend | 🔄 **IN PROGRESS** | 3 tasks (3.1-3.3) |
| 4 | Интеграция и тестирование | 🔄 **IN PROGRESS** | 3 tasks (4.1-4.3) |

**Всего:** 16 задач в 4 фазах

### Фаза 1 Завершённые задачи (6/7):
- 1.1: Initialize backend package.json with Fastify/TypeScript dependencies ✅
- 1.2: Configure TypeScript for backend with strict mode ✅
- 1.3: Scaffold Svelte+Vite frontend with TypeScript ✅
- 1.4: Create backend entry point with Fastify server and telemetry types ✅
- 1.5: Implement WebSocket service and file watcher for .swarm/telemetry.jsonl ✅
- 1.6: Define frontend agent types and Svelte AgentAvatar component ✅
- 1.7: Fix critical issues: directory confusion, entry point, code duplication ✅
- 1.8: Create telemetry event generator for testing (pending) ⏳

### Фаза 2 В процессе (2/3):
- 2.1: Implement REST API for historical telemetry data with filtering ✅
- 2.2: Add CORS support and security headers for local development ✅
- 2.3: Handle telemetry file rotation and malformed lines (IN PROGRESS) 🔄

### Фаза 3 В процессе (1/3):
- 3.1: Implement task delegation flow visualization with animated arrows (pending) ⏳
- 3.2: Create real-time event visualization with WebSocket client (deferred) ⏳
- 3.3: Add timeline view for historical data with filtering ✅

### Фаза 4 В процессе (2/3):
- 4.1: Connect frontend to backend API (polling mode) ✅
- 4.2: Validate all 7 agent types display correctly ✅
- 4.3: Performance optimization to maintain 60fps (IN PROGRESS) 🔄

## 🚦 Текущий статус (MVP)

> **Phase 1: Project Setup & Scaffolding - COMPLETE ✅**
> **MVP: Basic visualization working with polling mode 🔄**

MVP функционален со следующими реализованными функциями:
- ✅ Backend работает на `:3000` с REST API (GET /api/telemetry, GET /health)
- ✅ Frontend работает на `:5173` с Svelte 4 (виртуальная прокрутка, аватары агентов)
- ✅ Режим опроса работает (2-секундные интервалы через `POLL_INTERVAL`)
- ✅ Исторические данные с фильтрацией (eventType, agentId, from/to, limit)
- ✅ JSON Schema валидация с `coerceTypes: true` для параметров запроса
- ✅ Извлечение типа агента из `sessionId` и `agentName` в данных телеметрии
- ✅ Виртуальная прокрутка с `requestAnimationFrame` для производительности
- ✅ Позиция прокрутки сохранена (больше нет прыжков)

**Последние исправления:**
- 🔧 Fixed scroll jumping (removed `scrollTop = 0` assignment)
- 🔧 Fixed `extractAgentType()` to check `data.sessionId` properly
- 🔧 Replaced Svelte 5 syntax (`$state`/`$derived`) with Svelte 4 (`$:`, reactive statements)
- 🔧 Fixed telemetry.jsonl path (3 levels `../..` for ESM modules)
- 🔧 Fixed CORS configuration for `localhost:5173`

**Прогресс:** 9/16 задач завершено (9 завершено, 3 в процессе, 4 ожидают)

## 🤝 Участие

Этот проект является частью экосистемы OpenCode Swarm. Разработка следует многозадачному рабочему процессу оркестрации:

1. **Architect** декомпозирует задачи и координирует рой
2. **Coder** реализует изменения кода
3. **Reviewer** проверяет код на качество и корректность
4. **Test Engineer** пишет и запускает тесты
5. **Docs** обновляет документацию

См. [AGENTS.md](AGENTS.md) для полной конфигурации агентов.

## 📜 Лицензия

[Информация о лицензии будет добавлена]

---

## 📚 Ссылки

- [OpenCode Swarm Documentation](https://github.com/opencode-ai/opencode)
- [Fastify Documentation](https://www.fastify.io/)
- [Svelte 4 Documentation](https://svelte.dev/docs)
- [Vite Documentation](https://vitejs.dev/)

---

*Последнее обновление: 2026-05-05*
