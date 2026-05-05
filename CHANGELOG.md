# Changelog

All notable changes to the **opencode-swarm-web-srv** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Базовая структура проекта с монорепозиторием (backend + frontend)
- Backend на Fastify с TypeScript (строгий режим)
- Frontend на Svelte 4+ с Vite и TypeScript
- Тип `TelemetryEvent` для событий телеметрии
- File watcher на базе `chokidar` для мониторинга `.swarm/telemetry.jsonl`
- Маршруты API:
  - `GET /health` - проверка состояния сервера
  - `POST /telemetry` - прием событий телеметрии (логирование в MVP)
  - `GET /api/telemetry` - получение исторических данных с фильтрацией
- Скрипты сборки и разработки для обоих пакетов
- Типы агентов во frontend (`agent-types.ts`): 7 типов агентов, статусы, размеры
- Svelte компонент `AgentAvatar.svelte` для отображения аватаров агентов с анимацией статусов
- **MVP Phase 1 COMPLETE** (6/6 tasks)
- **Polling mode** (2s interval) - основной режим получения данных для MVP
- **JSON Schema валидация** для `/api/telemetry` с coerceTypes для корректной обработки query параметров
- Virtual scrolling с `requestAnimationFrame` для оптимизации производительности

### Changed
- **WebSocket отключен для MVP** - отложено до пост-MVP фаз
- **Svelte 5 syntax заменен на Svelte 4** - используются `$:` reactive statements вместо `$state`/`$derived`
- File watcher использует `chokidar` вместо нативного `fs.watch` для надежного отслеживания файлов

### Fixed
- Исправлен путь к telemetry.jsonl для ESM модулей
- Исправлена ошибка `__dirname is not defined` в ESM
- Исправлена обработка параметров запроса
- Исправлен скролл при обновлении данных
- Исправлено определение типа агента

## [0.1.0] - 2026-05-03

### Added
- Первоначальная спецификация проекта (.swarm/spec.md)
- План реализации (.swarm/plan.md) с 4 фазами и 15 задачами
- Конфигурация агентов (AGENTS.md)
- Настройка рабочих процессов (workflows/)
- Правила проекта (rules/)

[Unreleased]: https://github.com/your-org/opencode-swarm-web-srv/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/your-org/opencode-swarm-web-srv/releases/tag/v0.1.0
