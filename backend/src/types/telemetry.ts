/**
 * Тип данных для событий телеметрии от OpenCode Swarm
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
