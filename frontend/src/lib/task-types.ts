/**
 * Типы данных для задач (Task Cards)
 */

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'blocked';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  description?: string;
}

export const TASK_STATUS_STYLES: Record<TaskStatus, { bg: string; border: string; text: string; label: string }> = {
  pending: {
    bg: '#f1f5f9',
    border: '#94a3b8',
    text: '#64748b',
    label: 'Ожидает',
  },
  in_progress: {
    bg: '#eff6ff',
    border: '#3b82f6',
    text: '#1d4ed8',
    label: 'В процессе',
  },
  completed: {
    bg: '#f0fdf4',
    border: '#22c55e',
    text: '#15803d',
    label: 'Выполнено',
  },
  blocked: {
    bg: '#fef2f2',
    border: '#ef4444',
    text: '#b91c1c',
    label: 'Заблокировано',
  },
};