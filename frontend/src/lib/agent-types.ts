/**
 * Типы данных для агентов Swarm системы
 */

export type AgentType = 'architect' | 'coder' | 'reviewer' | 'explorer' | 'test_engineer' | 'sme' | 'docs';

export type AgentStatus = 'pending' | 'in_progress' | 'completed' | 'blocked';

export type AgentSize = 'small' | 'medium' | 'large';

export interface Agent {
  id: AgentType;
  name: string;
  color: string;
  icon: string;
  description: string;
}

export const AGENTS: Record<AgentType, Agent> = {
  architect: {
    id: 'architect',
    name: 'Architect',
    color: '#6366f1',
    icon: '🏗️',
    description: 'Architect - Lead orchestrator of multi-agent swarm',
  },
  coder: {
    id: 'coder',
    name: 'Coder',
    color: '#22c55e',
    icon: '💻',
    description: 'Coder - Implementation specialist',
  },
  reviewer: {
    id: 'reviewer',
    name: 'Reviewer',
    color: '#f59e0b',
    icon: '🔍',
    description: 'Reviewer - Code reviewer',
  },
  explorer: {
    id: 'explorer',
    name: 'Explorer',
    color: '#3b82f6',
    icon: '📊',
    description: 'Explorer - Codebase analysis',
  },
  test_engineer: {
    id: 'test_engineer',
    name: 'Test Engineer',
    color: '#ec4899',
    icon: '🧪',
    description: 'Test Engineer - Testing specialist',
  },
  sme: {
    id: 'sme',
    name: 'SME',
    color: '#8b5cf6',
    icon: '🎓',
    description: 'SME - Subject Matter Expert',
  },
  docs: {
    id: 'docs',
    name: 'Docs',
    color: '#14b8a6',
    icon: '📝',
    description: 'Docs - Documentation specialist',
  },
};

export const AGENT_STATUS_STYLES: Record<AgentStatus, { border: string; shadow: string }> = {
  pending: {
    border: '2px solid #94a3b8',
    shadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  in_progress: {
    border: '2px solid #3b82f6',
    shadow: '0 4px 8px rgba(59, 130, 246, 0.3)',
  },
  completed: {
    border: '2px solid #22c55e',
    shadow: '0 4px 8px rgba(34, 197, 94, 0.3)',
  },
  blocked: {
    border: '2px solid #ef4444',
    shadow: '0 4px 8px rgba(239, 68, 68, 0.3)',
  },
};

export const AGENT_SIZES: Record<AgentSize, number> = {
  small: 32,
  medium: 48,
  large: 64,
};