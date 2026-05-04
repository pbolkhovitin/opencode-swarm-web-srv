<script lang="ts">
  import { fade, slide, fly } from 'svelte/transition';
  import { TASK_STATUS_STYLES, type TaskStatus } from '../lib/task-types';

  export let taskId: string;
  export let title: string;
  export let status: TaskStatus;
  export let description: string = '';

  $: style = TASK_STATUS_STYLES[status];
</script>

<div
  class="task-card"
  style="
    --bg-color: {style.bg};
    --border-color: {style.border};
    --text-color: {style.text};
  "
  in:fly={{ y: 20, duration: 300, delay: 100 }}
  out:fade={{ duration: 200 }}
>
  <div class="task-header">
    <span class="task-id">#{taskId}</span>
    <span class="task-status" in:slide={{ duration: 200 }}>{style.label}</span>
  </div>
  
  <h3 class="task-title">{title}</h3>
  
  {#if description}
    <p class="task-description" in:fade={{ duration: 200, delay: 150 }}>{description}</p>
  {/if}
</div>

<style>
  .task-card {
    background-color: var(--bg-color);
    border: 2px solid var(--border-color);
    border-radius: 12px;
    padding: 1rem 1.25rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    min-width: 240px;
    max-width: 320px;
  }

  .task-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }

  .task-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .task-id {
    font-size: 0.75rem;
    color: #94a3b8;
    font-weight: 500;
  }

  .task-status {
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-color);
    background-color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    border: 1px solid var(--border-color);
  }

  .task-title {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.5rem 0;
    line-height: 1.4;
  }

  .task-description {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0;
    line-height: 1.5;
  }
</style>