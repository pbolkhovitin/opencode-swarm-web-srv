<script lang="ts">
  import AgentAvatar from './components/AgentAvatar.svelte';
  import TaskCard from './components/TaskCard.svelte';
  import EventVisualization from './components/EventVisualization.svelte';
  import { AGENTS, type AgentType, type AgentStatus, type AgentSize } from './lib/agent-types';
  import type { Task } from './lib/task-types';
  import { API_URL, TELEMETRY_LIMIT } from './lib/config';

  const agentTypes: AgentType[] = ['architect', 'coder', 'reviewer', 'explorer', 'test_engineer', 'sme', 'docs'];
  const statuses: AgentStatus[] = ['pending', 'in_progress', 'completed', 'blocked'];
  const sizes: AgentSize[] = ['small', 'medium', 'large'];

  // Примеры задач для каждого статуса
  const tasks: Task[] = [
    { id: '101', title: 'Настроить CI/CD pipeline', status: 'pending', description: 'Настроить автоматическую сборку и деплой' },
    { id: '102', title: 'Реализовать API авторизации', status: 'in_progress', description: 'Добавить JWT токены и refresh механизм' },
    { id: '103', title: 'Написать документацию', status: 'completed', description: 'Создать README и API docs' },
    { id: '104', title: 'Исправить баг с БД', status: 'blocked', description: 'Зависит от обновления PostgreSQL' },
  ];

  // Формируем URL для telemetry API
  const telemetryApiUrl = `${API_URL}/api/telemetry?limit=${TELEMETRY_LIMIT}`;
</script>

<h1>Swarm Telemetry Dashboard</h1>
<p>MVP Version</p>

<section>
  <h2>Agent Avatars</h2>
  <div class="agent-grid">
    {#each agentTypes as agentType}
      <div class="agent-item">
        <AgentAvatar {agentType} size="medium" status="pending" />
        <span class="agent-name">{AGENTS[agentType].name}</span>
      </div>
    {/each}
  </div>
</section>

<section>
  <h2>Status Variations</h2>
  <div class="status-grid">
    {#each statuses as status}
      <div class="status-item">
        <AgentAvatar agentType="coder" size="medium" {status} />
        <span class="status-name">{status}</span>
      </div>
    {/each}
  </div>
</section>

<section>
  <h2>Size Variations</h2>
  <div class="size-grid">
    {#each sizes as size}
      <div class="size-item">
        <AgentAvatar agentType="architect" {size} status="completed" />
        <span class="size-name">{size}</span>
      </div>
    {/each}
  </div>
</section>

<section>
  <h2>Task Cards</h2>
  <div class="task-grid">
    {#each tasks as task (task.id)}
      <TaskCard
        taskId={task.id}
        title={task.title}
        status={task.status}
        description={task.description}
      />
    {/each}
  </div>
</section>

<section>
  <h2>Telemetry Feed</h2>
  <EventVisualization apiUrl={telemetryApiUrl} />
</section>

<style>
  h1 {
    color: #1e293b;
    margin-bottom: 0.5rem;
  }

  h2 {
    color: #334155;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  section {
    margin-bottom: 2rem;
  }

  .agent-grid,
  .status-grid,
  .size-grid {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .agent-item,
  .status-item,
  .size-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

.agent-name,
.status-name,
.size-name {
    font-size: 0.875rem;
    color: #64748b;
  }

  .task-grid {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: flex-start;
  }
</style>