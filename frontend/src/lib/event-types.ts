/**
 * Типы данных для визуализации событий телеметрии
 */

/**
 * Событие телеметрии (локальная копия определения из backend)
 */
export interface TelemetryEvent {
  /** Временная метка события (Unix timestamp в миллисекундах) */
  timestamp: number;
  /** Тип события (например, 'task_started', 'agent_status_changed') */
  eventType: string;
  /** Идентификатор агента, сгенерировавшего событие (опционально) */
  agentId?: string;
  /** Дополнительные данные события (опционально, произвольной структуры) */
  data?: unknown;
}

/**
 * Отображаемое событие телеметрии с форматированными данными
 */
export interface EventDisplay extends TelemetryEvent {
  /** Читаемый формат времени */
  readableTime: string;
  /** Сокращенный ID агента */
  shortAgentId: string | null;
  /** Краткое описание данных события */
  eventSummary: string;
}

/**
 * Типы событий по категориям для цветовой индикации
 */
export type EventCategory = 'task' | 'agent' | 'system' | 'unknown';

/**
 * Конфигурация цветов по типу события
 */
export const EVENT_COLORS: Record<string, string> = {
  // Task события - синий
  task_started: '#3b82f6',
  task_completed: '#22c55e',
  task_blocked: '#ef4444',
  task_failed: '#dc2626',
  // Agent события - фиолетовый
  agent_status_changed: '#8b5cf6',
  agent_active: '#a855f7',
  agent_idle: '#94a3b8',
  // System события - серый
  system_start: '#64748b',
  system_stop: '#475569',
  // Default
  default: '#6b7280',
};

/**
 * Определение категории события по его типу
 */
export function getEventCategory(eventType: string): EventCategory {
  if (eventType.startsWith('task_')) {
    return 'task';
  }
  if (eventType.startsWith('agent_')) {
    return 'agent';
  }
  if (eventType.startsWith('system_')) {
    return 'system';
  }
  return 'unknown';
}

/**
 * Получение цвета по типу события
 */
export function getEventColor(eventType: string): string {
  return EVENT_COLORS[eventType] || EVENT_COLORS.default;
}