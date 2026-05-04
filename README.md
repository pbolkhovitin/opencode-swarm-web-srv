# opencode-swarm-web-srv

> Real-time web visualization dashboard for monitoring OpenCode Swarm multi-agent orchestration.

## 📋 Concept

**OpenCode Swarm** is a multi-agent orchestration system where specialized AI agents (Architect, Coder, Reviewer, etc.) collaborate to complete software development tasks. This project provides a **web-based visualization dashboard** that monitors and displays swarm sessions in real-time.

**What does this dashboard do?**
- Visualizes all 7 agent types as distinct entities with status indicators
- Shows animated task delegation flows between agents
- Streams real-time events from `.swarm/telemetry.jsonl`
- Provides historical timeline views of past sessions
- Maintains 60fps performance with up to 20 concurrent visual elements

## ✨ Features

- **7 Agent Types Visualization** - Architect, Coder, Reviewer, Explorer, Test Engineer, SME, and Docs agents with unique avatars
- **Real-time Updates** - WebSocket-based streaming with <100ms latency from event to visualization
- **Task Flow Animation** - Animated directional arrows showing task delegation between agents
- **Agent Status Display** - Visual states: pending, in_progress, completed, blocked
- **Historical Data** - Timeline view with filtering by agent type, task status, and time range
- **Task Lifecycle Tracking** - Full visibility into task transitions with timestamps and duration
- **Read-only Safety** - Never modifies `.swarm/` directory files
- **Performance Optimized** - 60fps animations using Svelte's built-in animation system

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    Browser (Dashboard)                      │
│  ┌─────────────────────────────────────────────┐   │
│  │         Svelte 4+ Frontend (Vite)                   │   │
│  │  - Agent Avatars  - Task Flow Visualization         │   │
│  │  - Timeline View  - Real-time Event Stream          │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                          │ WebSocket                        │
└──────────────────────────┼──────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────┐
│  Backend (Fastify)       │                                  │
│  ┌──────────────────────┴──────────────────────────────┐   │
│  │  - REST API (historical data)                       │   │
│  │  - WebSocket Server (real-time streaming)           │   │
│  │  - File Watcher (telemetry.jsonl)                  │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                          │ read-only                        │
└──────────────────────────┼──────────────────────────────────┘
                           │
                    ┌──────┴──────┐
                    │  .swarm/     │
                    │  telemetry   │
                    │  .jsonl      │
                    └─────────────┘
```

### Components

| Component | Technology | Responsibility |
|-----------|------------|----------------|
| Frontend Dashboard | Svelte 4+ + Vite + TypeScript | Visualize agents, tasks, and events |
| Backend API Server | Node.js + Fastify + TypeScript | Serve API and WebSocket connections |
| WebSocket Service | ws (WebSocket library) | Stream real-time events to dashboard |
| File Watcher | Node.js fs.watch | Monitor `.swarm/telemetry.jsonl` for changes |

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Language**: TypeScript (strict mode)
- **Framework**: Fastify
- **WebSocket**: @fastify/websocket
- **File Watching**: Node.js fs.watch

### Frontend
- **Framework**: Svelte 4+
- **Build Tool**: Vite
- **Language**: TypeScript
- **Animations**: Svelte built-in transitions/animations

### Data Source
- **Telemetry File**: `.swarm/telemetry.jsonl` (read-only)

## 📋 Prerequisites

- **Node.js** v18 or higher
- **npm** v8 or higher (or equivalent package manager)
- A running OpenCode Swarm session with `.swarm/telemetry.jsonl` present

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-org/opencode-swarm-web-srv.git
cd opencode-swarm-web-srv

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## 🚀 Development

Run both backend and frontend in development mode:

### Terminal 1 - Backend
```bash
cd backend
npm install
npm run dev
# Fastify server starts on http://localhost:3000
# WebSocket available at ws://localhost:3000/ws
# API endpoints:
#   - GET  /health - Health check
#   - POST /telemetry - Receive telemetry events
#   - GET  /ws-info - WebSocket clients info
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
# Vite dev server starts on http://localhost:5173
# Dashboard available at http://localhost:5173
```

The frontend will automatically connect to the backend via WebSocket for real-time updates.

## 🏗️ Building for Production

```bash
# Install dependencies (if not done yet)
cd backend && npm install
cd ../frontend && npm install

# Build backend (compiles TypeScript to JavaScript)
cd backend
npm run build
# Output: backend/dist/

# Build frontend (creates production bundle)
cd ../frontend
npm run build
# Output: frontend/dist/
```

### Running in Production

```bash
# Start backend server (from backend directory)
cd backend
npm start
# Server runs on http://localhost:3000

# Serve frontend (using any static file server)
cd ../frontend
npx vite preview
# Or serve the dist/ folder with your preferred web server
```

## 📁 Project Structure

```
opencode-swarm-web-srv/
├── backend/                    # Fastify + TypeScript backend
│   ├── src/
│   │   ├── index.ts            # Fastify server entry point
│   │   ├── types/
│   │   │   └── telemetry.ts   # TelemetryEvent type definition
│   │   └── services/
│   │       ├── websocket.ts    # WebSocket service for real-time streaming
│   │       └── file-watcher.ts # File watcher for telemetry.jsonl
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # Svelte 4+ + Vite frontend
│   ├── src/
│   │   ├── main.ts            # Svelte app entry point
│   │   └── App.svelte        # Root Svelte component
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── svelte.config.js
│   └── tsconfig.json
│
├── .swarm/                     # Swarm orchestration files (read-only)
│   ├── telemetry.jsonl         # Telemetry data source (generated by swarm)
│   ├── spec.md                 # Project specification
│   └── plan.md                 # Implementation plan
│
├── AGENTS.md                   # Agent configurations
└── README.md                   # This file
```

## 📄 Specification

The full project specification is documented in [.swarm/spec.md](.swarm/spec.md) and includes:

### Functional Requirements (FR-001 to FR-012)
- FR-001: Agent Visualization (all 7 agent types)
- FR-002: Agent Status Display (4 visual states)
- FR-003: Task Delegation Flow (animated arrows)
- FR-004: Real-time Event Streaming (<100ms latency)
- FR-005: Event Data Source Integration (telemetry.jsonl)
- FR-006: WebSocket Communication
- FR-007: Historical Data Access (with filtering)
- FR-008: Task Lifecycle Visualization
- FR-009: Performance (60fps with 20+ elements)
- FR-010: Read-only Data Access
- FR-011: Local Development Support (CORS)
- FR-012: Multi-session Support (deferred)

### Success Criteria (SC-001 to SC-006)
- SC-001: Agent Display Verification (2s load time)
- SC-002: Real-time Update Verification (<100ms latency)
- SC-003: Animation Performance Verification (60fps)
- SC-004: Data Integrity Verification (100% accuracy)
- SC-005: Read-only Compliance Verification
- SC-006: Historical Data Retrieval (<500ms for 10k events)

## 📋 Implementation Plan

The implementation plan is documented in [.swarm/plan.md](.swarm/plan.md) and consists of:

| Phase | Name | Status | Tasks |
|-------|------|--------|-------|
| 1 | Project Setup & Scaffolding | ✅ **COMPLETE** | 5 tasks (1.1-1.5) |
| 2 | Backend Development | 🔄 **IN PROGRESS** | 3 tasks (2.1-2.3) |
| 3 | Frontend Visualization | PENDING | 4 tasks (3.1-3.4) |
| 4 | Integration & Testing | PENDING | 3 tasks (4.1-4.3) |

**Total:** 15 tasks across 4 phases

**Phase 1 Completed Tasks:**
- 1.1: Initialize backend package.json with Fastify/TypeScript dependencies ✅
- 1.2: Configure TypeScript for backend with strict mode ✅
- 1.3: Scaffold Svelte+Vite frontend with TypeScript ✅
- 1.4: Create backend entry point with Fastify server and telemetry types ✅
- 1.5: Implement WebSocket service and file watcher for .swarm/telemetry.jsonl ✅

For detailed task descriptions and dependencies, see [TODO.md](TODO.md).

## 🚦 Current Status

> **Phase 1: Project Setup & Scaffolding - COMPLETE**

The project scaffolding is complete. Backend (Fastify + TypeScript) and frontend (Svelte + Vite + TypeScript) have been initialized with working build systems.

**Progress:** 5/15 tasks completed (5 completed, 10 pending)

## 🤝 Contributing

This project is part of the OpenCode Swarm ecosystem. The development follows a multi-agent orchestration workflow:

1. **Architect** decomposes tasks and coordinates the swarm
2. **Coder** implements the code changes
3. **Reviewer** reviews code for quality and correctness
4. **Test Engineer** writes and runs tests
5. **Docs** updates documentation

See [AGENTS.md](AGENTS.md) for the full agent configuration.

## 📜 License

[License information to be added]

---

## 📚 References

- [OpenCode Swarm Documentation](https://github.com/opencode-ai/opencode)
- [Fastify Documentation](https://www.fastify.io/)
- [Svelte Documentation](https://svelte.dev/docs)
- [Vite Documentation](https://vitejs.dev/)

---

*Last Updated: 2026-05-03*
