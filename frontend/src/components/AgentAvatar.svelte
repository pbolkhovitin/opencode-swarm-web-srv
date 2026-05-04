<script lang="ts">
  import { AGENTS, AGENT_STATUS_STYLES, AGENT_SIZES, type AgentType, type AgentStatus, type AgentSize } from '../lib/agent-types';
  import { fade, scale } from 'svelte/transition';

  export let agentId: AgentType;
  export let size: AgentSize = 'md';
  export let status: AgentStatus = 'pending';

  $: agent = AGENTS[agentId];
  $: statusStyle = AGENT_STATUS_STYLES[status];
  $: pixelSize = AGENT_SIZES[size];
  $: fontSize = Math.round(pixelSize * 0.5);
</script>

<div
  class="agent-avatar"
  style="
    --size: {pixelSize}px;
    --font-size: {fontSize}px;
    --bg-color: {agent.color};
    --border: {statusStyle.border};
    --shadow: {statusStyle.shadow};
  "
  title="{agent.name} - {status}"
  in:scale={{ duration: 200, start: 0.8 }}
  out:fade={{ duration: 150 }}
>
  <span class="agent-icon">{agent.icon}</span>
  {#if status === 'in_progress'}
    <span class="status-indicator" in:fade={{ duration: 150 }}></span>
  {/if}
</div>

<style>
  .agent-avatar {
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    background-color: var(--bg-color);
    border: var(--border);
    box-shadow: var(--shadow);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: all 0.2s ease-in-out;
    cursor: default;
  }

  .agent-avatar:hover {
    transform: scale(1.05);
  }

  .agent-icon {
    font-size: var(--font-size);
    line-height: 1;
    user-select: none;
  }

  .status-indicator {
    position: absolute;
    top: -2px;
    right: -2px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #3b82f6;
    border: 2px solid white;
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.1);
    }
  }
</style>