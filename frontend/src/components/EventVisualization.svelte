<script lang="ts">
  import { onMount, onDestroy, afterUpdate } from 'svelte';
  import type { TelemetryEvent } from '../lib/event-types';
  import { getEventColor } from '../lib/event-types';
  import { API_URL as CONFIG_API_URL, POLL_INTERVAL, TELEMETRY_LIMIT } from '../lib/config';

  /**
   * Пропсы компонента
   */
  export let apiUrl: string = `${CONFIG_API_URL}/api/telemetry?limit=${TELEMETRY_LIMIT}`;

  /**
   * Типы для режимов получения данных
   */
  type ConnectionMode = 'polling' | 'websocket';

  /**
   * Интерфейс отображаемого события
   */
  interface DisplayEvent {
    id: string;
    timestamp: number;
    readableTime: string;
    eventType: string;
    agentId: string | null;
    eventSummary: string;
    color: string;
  }

  // Конфигурация с использованием central config
  const API_URL = apiUrl;

  // Состояние компонента
  let events: DisplayEvent[] = [];
  let isConnected = false;
  let lastError: string | null = null;
  let connectionMode: ConnectionMode = 'polling';
  let pollingInterval: ReturnType<typeof setInterval> | null = null;
  let eventListEl: HTMLDivElement;

  /**
   * Форматирование timestamp в читаемый вид
   */
  function formatTimestamp(ts: number): string {
    const date = new Date(ts);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    const timeStr = date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    if (isToday) {
      return timeStr;
    }

    const dateStr = date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
    });

    return `${dateStr} ${timeStr}`;
  }

  /**
   * Создание краткого описания из данных события
   */
  function createEventSummary(data: unknown): string {
    if (!data) {
      return '';
    }

    if (typeof data === 'string') {
      return data.slice(0, 50);
    }

    if (typeof data === 'object') {
      const obj = data as Record<string, unknown>;
      // Пытаемся найти осмысленное поле
      if (obj.message) {
        return String(obj.message).slice(0, 50);
      }
      if (obj.status) {
        return String(obj.status);
      }
      if (obj.id) {
        return `ID: ${obj.id}`;
      }
      // Выводим первые ключи
      const keys = Object.keys(obj).slice(0, 3);
      if (keys.length > 0) {
        return keys.map(k => `${k}=${obj[k]}`).join(', ').slice(0, 50);
      }
    }

    return '';
  }

  /**
   * Преобразование сырых данных в DisplayEvent
   */
  function transformEvent(raw: TelemetryEvent, index: number): DisplayEvent {
    return {
      id: `${raw.timestamp}-${index}`,
      timestamp: raw.timestamp,
      readableTime: formatTimestamp(raw.timestamp),
      eventType: raw.eventType,
      agentId: raw.agentId || null,
      eventSummary: createEventSummary(raw.data),
      color: getEventColor(raw.eventType),
    };
  }

  /**
   * Загрузка событий через polling
   */
  async function fetchEvents(): Promise<void> {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const rawEvents: TelemetryEvent[] = await response.json();

      // Преобразуем и сортируем по убыванию (новые сверху)
      const transformed = rawEvents
        .map((e, i) => transformEvent(e, i))
        .sort((a, b) => b.timestamp - a.timestamp);

      events = transformed;
      isConnected = true;
      lastError = null;
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Unknown error';
      isConnected = false;
    }
  }

  /**
   * Запуск polling режима
   */
  function startPolling(): void {
    connectionMode = 'polling';
    fetchEvents(); // Первая загрузка сразу
    pollingInterval = setInterval(fetchEvents, POLL_INTERVAL);
  }

  /**
   * Остановка polling
   */
  function stopPolling(): void {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  }

  /**
   * Заглушка для WebSocket режима
   */
  function startWebSocket(): void {
    // WebSocket отключен для MVP
    connectionMode = 'websocket';
    lastError = 'WebSocket mode disabled for MVP';
    isConnected = false;
  }

  /**
   * Переключение режима
   */
  function switchMode(mode: ConnectionMode): void {
    stopPolling();
    if (mode === 'polling') {
      startPolling();
    } else {
      startWebSocket();
    }
  }

  // Автопрокрутка после обновления списка
  afterUpdate(() => {
    if (eventListEl && events.length > 0) {
      eventListEl.scrollTop = 0; // Новые события сверху - не нужно прокручивать
    }
  });

  // Lifecycle
  onMount(() => {
    startPolling();
  });

  onDestroy(() => {
    stopPolling();
  });
</script>

<div class="event-visualization">
  <div class="event-header">
    <h3>Telemetry Events</h3>
    <div class="controls">
      <div class="mode-switch">
        <button
          class:active={connectionMode === 'polling'}
          on:click={() => switchMode('polling')}
        >
          Polling
        </button>
        <button
          class:active={connectionMode === 'websocket'}
          on:click={() => switchMode('websocket')}
          disabled
        >
          WebSocket
        </button>
      </div>
      <div class="status-indicator" class:connected={isConnected}>
        <span class="status-dot"></span>
        <span class="status-text">{isConnected ? 'Connected' : 'Disconnected'}</span>
      </div>
    </div>
  </div>

  {#if lastError}
    <div class="error-message">{lastError}</div>
  {/if}

  <div class="event-list" bind:this={eventListEl}>
    {#if events.length === 0}
      <div class="empty-state">No events yet</div>
    {:else}
      {#each events as event (event.id)}
        <div class="event-item">
          <div class="event-badge" style="background-color: {event.color}">
            {event.eventType}
          </div>
          <div class="event-content">
            <div class="event-meta">
              <span class="event-time">{event.readableTime}</span>
              {#if event.agentId}
                <span class="event-agent">{event.agentId}</span>
              {/if}
            </div>
            {#if event.eventSummary}
              <div class="event-summary">{event.eventSummary}</div>
            {/if}
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  .event-visualization {
    display: flex;
    flex-direction: column;
    height: 400px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    overflow: hidden;
    background: #f8fafc;
  }

  .event-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: #f1f5f9;
    border-bottom: 1px solid #e2e8f0;
  }

  .event-header h3 {
    margin: 0;
    font-size: 1rem;
    color: #1e293b;
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .mode-switch {
    display: flex;
    gap: 0.25rem;
  }

  .mode-switch button {
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    background: #fff;
    color: #64748b;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .mode-switch button:hover:not(:disabled) {
    background: #f1f5f9;
  }

  .mode-switch button.active {
    background: #3b82f6;
    border-color: #3b82f6;
    color: #fff;
  }

  .mode-switch button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .status-indicator {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    background: #fee2e2;
    color: #dc2626;
  }

  .status-indicator.connected {
    background: #dcfce7;
    color: #16a34a;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #dc2626;
  }

  .status-indicator.connected .status-dot {
    background: #16a34a;
  }

  .error-message {
    padding: 0.5rem 1rem;
    background: #fef2f2;
    color: #dc2626;
    font-size: 0.875rem;
  }

  .event-list {
    flex: 1;
    overflow-y: auto;
    padding: 0.5rem;
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #94a3b8;
    font-size: 0.875rem;
  }

  .event-item {
    display: flex;
    gap: 0.75rem;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    background: #fff;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
  }

  .event-badge {
    flex-shrink: 0;
    padding: 0.25rem 0.5rem;
    font-size: 0.625rem;
    font-weight: 600;
    color: #fff;
    border-radius: 4px;
    text-transform: uppercase;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .event-content {
    flex: 1;
    min-width: 0;
  }

  .event-meta {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    font-size: 0.75rem;
  }

  .event-time {
    color: #64748b;
  }

  .event-agent {
    padding: 0.125rem 0.375rem;
    background: #f1f5f9;
    border-radius: 4px;
    color: #475569;
    font-weight: 500;
  }

  .event-summary {
    margin-top: 0.25rem;
    font-size: 0.75rem;
    color: #334155;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>