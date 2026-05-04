/**
 * Конфигурация приложения
 * Настройки для подключения к backend API
 */

/**
 * URL backend API
 * Используется для polling запросов к /api/telemetry
 */
export const API_URL = 'http://localhost:3000';

/**
 * WebSocket URL (заглушка для MVP)
 * WebSocket отключен до реализации полного функционала
 */
export const WS_URL = null;

/**
 * Интервал опроса в миллисекундах
 */
export const POLL_INTERVAL = 2000;

/**
 * Количество событий для загрузки за один запрос
 */
export const TELEMETRY_LIMIT = 50;