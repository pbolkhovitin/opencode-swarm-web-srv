# API Documentation

> **Статус:** MVP Phase 1 COMPLETE
> **Режим работы:** Polling mode (2s interval)
> **WebSocket:** Отключён (отложено до пост-MVP фаз)

## Base URL

- **Development:** `http://localhost:3000`
- **Production:** `http://your-server:3000`

## Endpoints

### GET /health

Проверка состояния сервера.

**Response:**
```json
{
  "status": "ok",
  "timestamp": 1714900000123
}
```

**Status Codes:**
- `200 OK` - Сервер работает нормально

---

### GET /api/telemetry

Получение исторических событий телеметрии с возможностью фильтрации.

**Query Parameters:**

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `from` | number | Нет | Начальная временная метка (Unix ms) |
| `to` | number | Нет | Конечная временная метка (Unix ms) |
| `eventType` | string | Нет | Фильтр по типу события |
| `agentId` | string | Нет | Фильтр по ID агента |
| `limit` | number | Нет | Максимальное количество событий (1-1000, по умолчанию: 100) |

**Response:** Массив объектов `TelemetryEvent`

**Status Codes:**
- `200 OK` - Успешный запрос
- `400 Bad Request` - Некорректные параметры запроса

**Примеры:**

```bash
# Получить последние 5 событий
curl "http://localhost:3000/api/telemetry?limit=5"

# Фильтр по типу события
curl "http://localhost:3000/api/telemetry?limit=5&eventType=task_state_changed"

# Фильтр по временному диапазону
curl "http://localhost:3000/api/telemetry?from=1714899600000&to=1714900000000"

# Фильтр по ID агента
curl "http://localhost:3000/api/telemetry?agentId=architect&limit=10"
```

---

### POST /telemetry

Приём событий телеметрии от OpenCode Swarm.

> **Примечание:** В MVP режиме события только логируются, WebSocket рассылка отключена.

**Request Body:** Объект `TelemetryEvent`

**Response:**
```json
{
  "received": true,
  "eventType": "session_started"
}
```

**Status Codes:**
- `200 OK` - Событие принято
- `400 Bad Request` - Некорректное тело запроса

**Пример:**
```bash
curl -X POST http://localhost:3000/telemetry \
  -H "Content-Type: application/json" \
  -d '{
    "timestamp": "2026-05-03T11:31:56.258Z",
    "event": "session_started",
    "sessionId": "ses_21264035cffednT5G6MbsulJ0L",
    "agentName": "architect",
    "data": {}
  }'
```

---

## Data Format

### TelemetryEvent

```typescript
interface TelemetryEvent {
  timestamp: string;      // ISO 8601 формат
  event: string;         // Тип события (например: "session_started", "task_state_changed")
  sessionId: string;     // ID сессии (например: "ses_21264035cffednT5G6MbsulJ0L")
  agentName: string;      // Имя агента (architect, coder, reviewer, explorer, test_engineer, sme, docs)
  data: {
    // Дополнительные данные события
    [key: string]: unknown;
  };
}
```

**Пример:**
```json
{
  "timestamp": "2026-05-03T11:31:56.258Z",
  "event": "session_started",
  "sessionId": "ses_21264035cffednT5G6MbsulJ0L",
  "agentName": "architect",
  "data": {
    "taskId": "task_123",
    "status": "in_progress"
  }
}
```

### Типы событий (event)

- `session_started` - Начало сессии
- `session_ended` - Завершение сессии
- `task_delegated` - Делегирование задачи
- `task_state_changed` - Изменение состояния задачи
- `agent_invoked` - Вызов агента
- `tool_executed` - Выполнение инструмента
- `message_sent` - Отправка сообщения

### Типы агентов (agentName)

- `architect` - Архитектор
- `coder` - Разработчик
- `reviewer` - Рецензент
- `explorer` - Исследователь
- `test_engineer` - Инженер по тестированию
- `sme` - Эксперт предметной области
- `docs` - Специалист по документации

---

## Notes

- **MVP использует polling mode** - frontend опрашивает `/api/telemetry` каждые 2 секунды
- **WebSocket support отложен** - будет реализован в пост-MVP фазах
- **Все эндпоинты read-only** - не модифицируют файлы в директории `.swarm/`
- **CORS настроен** - разрешены запросы с `localhost:5173` (frontend dev server)
- **Security headers** - добавлены X-Content-Type-Options, X-Frame-Options, X-XSS-Protection и др.

---

## Error Responses

### 400 Bad Request

```json
{
  "error": "Invalid \"limit\" parameter: must be a number between 1 and 1000"
}
```

---

*Last Updated: 2026-05-05*