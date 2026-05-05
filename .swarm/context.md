# Context
Swarm: default

## Project Overview
- **Name**: opencode-swarm-web-srv
- **Description**: Web visualization dashboard for monitoring OpenCode Swarm multi-agent orchestration
- **Purpose**: Real-time visualization of agent interactions, task flows, and swarm session data
- **Language**: TypeScript (implemented)
- **Frontend**: Svelte 4+ with Vite and TypeScript
- **Backend**: Fastify with TypeScript

## Architecture Decisions
- Backend reads from `.swarm/telemetry.jsonl` (read-only access)
- Frontend uses WebSocket for real-time updates
- No direct modification of `.swarm/` files by the web service
- Visualize all 7 agent types: architect, coder, reviewer, explorer, test_engineer, sme, docs
- Performance target: 60fps for animations
- CORS enabled for local development
- WebSocket library: ws (instead of @fastify/websocket)
- File watcher: Node.js fs.watch (instead of chokidar)

## Workflow Phases (from workflows/swarm-workflow.md)
### Phase 1: Project Setup & Scaffolding [COMPLETE]
- [x] 1.1: Initialize backend package.json with Fastify/TypeScript dependencies [COMPLETE]
- [x] 1.2: Configure TypeScript for backend with strict mode [COMPLETE]
- [x] 1.3: Scaffold Svelte+Vite frontend with TypeScript [COMPLETE]
- [x] 1.4: Create backend entry point with Fastify server and telemetry types [COMPLETE]
- [x] 1.5: Implement WebSocket service and file watcher for .swarm/telemetry.jsonl [COMPLETE]
- [x] 1.6: Define frontend agent types and Svelte AgentAvatar component [COMPLETE]

### Phase 2: Backend Development
- [ ] 2.1: Create WebSocket server for events.jsonl streaming
- [ ] 2.2: Implement file watcher for .swarm/events.jsonl
- [ ] 2.3: Create REST API for historical data

### Phase 3: Frontend Development
- [ ] 3.1: Design agent avatar components (7 agent types)
- [ ] 3.2: Implement task card animations
- [ ] 3.3: Create real-time event visualization
- [ ] 3.4: Add timeline view for historical data

### Phase 4: Integration & Testing
- [ ] 4.1: Connect frontend to backend WebSocket
- [ ] 4.2: Test with real swarm session data
- [ ] 4.3: Performance optimization (60fps animations)

## Dependencies (from .opencode/package.json)
- @opencode-ai/plugin: 1.14.33

## Dependencies (implemented)
- Backend: Fastify, ws, TypeScript, tsx
- Frontend: Svelte 4+, Vite, TypeScript
- Shared: TypeScript with strict mode

## SME Cache
### typescript
- TypeScript configured with strict mode for both frontend and backend
- Svelte 4+ with TypeScript support via @sveltejs/vite-plugin-svelte

### nodejs
- Backend uses Node.js with Fastify framework
- tsx used for running TypeScript directly in development

### websocket
- Using ws library for WebSocket server (instead of socket.io)
- WebSocket endpoint: ws://localhost:3000/ws

### realtime-visualization
- Svelte for reactive UI updates
- Vite for fast development and hot module replacement

### swarm-orchestration
- Read-only access to .swarm/telemetry.jsonl
- TelemetryEvent type: { timestamp, eventType, agentId?, data? }

## Patterns
- Event-driven architecture: Backend watches file changes → pushes to WebSocket → Frontend updates
- Component-based UI: Reusable agent avatar components with different states (Svelte)
- File watcher: Uses fs.watch to monitor .swarm/telemetry.jsonl for changes
- WebSocket broadcast: Real-time telemetry events sent to all connected clients

## Agent Activity

| Tool | Calls | Success | Failed | Avg Duration |
|------|-------|---------|--------|--------------|
| read | 315 | 315 | 0 | 63ms |
| bash | 232 | 232 | 0 | 2545ms |
| glob | 105 | 105 | 0 | 33ms |
| edit | 81 | 81 | 0 | 20ms |
| declare_scope | 80 | 80 | 0 | 6ms |
| task | 64 | 64 | 0 | 106853ms |
| write | 54 | 54 | 0 | 16ms |
| update_task_status | 34 | 34 | 0 | 28ms |
| grep | 34 | 34 | 0 | 24ms |
| placeholder_scan | 22 | 22 | 0 | 28ms |
| syntax_check | 19 | 19 | 0 | 31ms |
| build_check | 19 | 19 | 0 | 1814ms |
| diff | 12 | 12 | 0 | 18ms |
| imports | 10 | 10 | 0 | 6ms |
| test_runner | 10 | 10 | 0 | 7ms |
| search | 9 | 9 | 0 | 36ms |
| save_plan | 7 | 7 | 0 | 24ms |
| pre_check_batch | 5 | 5 | 0 | 26ms |
| todo_extract | 4 | 4 | 0 | 5ms |
| phase_complete | 4 | 4 | 0 | 5560ms |
| apply_patch | 4 | 4 | 0 | 16ms |
| get_approved_plan | 3 | 3 | 0 | 16ms |
| knowledge_recall | 3 | 3 | 0 | 6ms |
| lint | 3 | 3 | 0 | 11ms |
| check_gate_status | 3 | 3 | 0 | 10ms |
| write_retro | 3 | 3 | 0 | 12ms |
| webfetch | 3 | 3 | 0 | 463ms |
| opencode_sync | 3 | 3 | 0 | 1148ms |
| set_qa_gates | 2 | 2 | 0 | 24ms |
| get_qa_gate_profile | 2 | 2 | 0 | 13ms |
| evidence_check | 2 | 2 | 0 | 14ms |
| sbom_generate | 2 | 2 | 0 | 18ms |
| sast_scan | 1 | 1 | 0 | 6ms |
| diff_summary | 1 | 1 | 0 | 119ms |
| req_coverage | 1 | 1 | 0 | 8ms |
| write_drift_evidence | 1 | 1 | 0 | 26ms |
| completion_verify | 1 | 1 | 0 | 11ms |
| suggest_patch | 1 | 1 | 0 | 7ms |
## Phase Metrics
- total_tool_calls: 150
- coder_revisions: 3
- reviewer_rejections: 0
- test_failures: 0
- security_findings: 0
- integration_issues: 0
- task_count: 5
- task_complexity: moderate
- top_rejection_reasons: []
- lessons_learned: ["Turbo Mode ускоряет MVP", "Scope enforcement блокирует package.json", "Исправление типов ws требует @types/ws"]

## Pending QA Gate Selection
- reviewer: true
- test_engineer: true
- sme_enabled: true
- critic_pre_plan: true
- sast_enabled: true
- council_mode: false
- hallucination_guard: false
- mutation_test: false
- council_general_review: false
- drift_check: true
- recorded_at: 2026-05-03T13:45:00.000Z
