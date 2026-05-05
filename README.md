# opencode-swarm-web-srv

> Real-time web visualization dashboard for monitoring OpenCode Swarm multi-agent orchestration.

> **Status:** Phase 1 MVP COMPLETE ✅ | Phase 2-4 IN PROGRESS 🔄

## 📋 Concept

**OpenCode Swarm** is a multi-agent orchestration system where specialized AI agents (Architect, Coder, Reviewer, etc.) collaborate to complete software development tasks. This project provides a **web-based visualization dashboard** that monitors and displays swarm sessions in real-time.

**What does this dashboard do?**
- Visualizes all 7 agent types as distinct entities with status indicators ✅
- Shows task delegation flows between agents (animation pending) ⏳
- Streams events from `.swarm/telemetry.jsonl` via polling (2s interval) 🔄
- Provides historical timeline views of past sessions with filtering ✅
- Maintains performance with virtual scrolling (Svelte 4 + requestAnimationFrame) 🚀

## ✨ Features (MVP Status)

- **7 Agent Types Visualization** - Architect, Coder, Reviewer, Explorer, Test Engineer, SME, and Docs agents with unique avatars ✅
- **Real-time Updates** - Polling-based updates every 2 seconds (WebSocket deferred to post-MVP) 🔄
- **Task Flow Animation** - Animated directional arrows showing task delegation between agents (Pending: Phase 3) ⏳
- **Agent Status Display** - Visual states: pending, in_progress, completed, blocked ✅
- **Historical Data** - Timeline view with filtering by agent type, task status, and time range ✅
- **Task Lifecycle Tracking** - Full visibility into task transitions with timestamps and duration ✅
- **Read-only Safety** - Never modifies `.swarm/` directory files ✅
- **Performance Optimized** - Virtual scrolling with requestAnimationFrame, Svelte 4 reactive statements ($:) 🚀

## 🏗️ Architecture Overview (MVP)

```
┌─────────────────────────────────────────────────────┐
│                    Browser (Dashboard)              │
│  ┌─────────────────────────────────────────────┐   │
│  │         Svelte 4 Frontend (Vite)           │   │
│  │  - Agent Avatars  - Task Flow Visualization │   │
│  │  - Timeline View  - Polling Mode (2s)      │   │
│  └──────────────────────┬──────────────────────┘   │
│                          │ HTTP Polling (2s)        │
└──────────────────────────┼──────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────┐
│  Backend (Fastify)       │                          │
│  ┌──────────────────────┴──────────────────────┐   │
│  │  - REST API (historical data + filtering)    │   │
│  │  - Polling Endpoint: GET /api/telemetry     │   │
│  │  - Health Check: GET /health                │   │
│  │  - File Parser (telemetry.jsonl)            │   │
│  └──────────────────────┬──────────────────────┘   │
│                          │ read-only                │
└──────────────────────────┼──────────────────────────┘
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
| Frontend Dashboard | Svelte 4 + Vite + TypeScript | Visualize agents, tasks, and events |
| Backend API Server | Node.js + Fastify + TypeScript | Serve REST API (polling mode) |
| Telemetry Parser | Node.js streams + readline | Parse telemetry.jsonl with error handling |
| File Watcher | chokidar (ready, unused in MVP) | Monitor `.swarm/telemetry.jsonl` for changes |

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Language**: TypeScript (strict mode)
- **Framework**: Fastify (with AJV coerceTypes for query params)
- **WebSocket**: @fastify/websocket (disabled for MVP)
- **File Parsing**: Node.js fs streams + readline

### Frontend
- **Framework**: Svelte 4 (NOT Svelte 5 - uses $: reactive statements)
- **Build Tool**: Vite
- **Language**: TypeScript
- **Performance**: Virtual scrolling with requestAnimationFrame

### Data Source
- **Telemetry File**: `.swarm/telemetry.jsonl` (read-only, JSONL format)

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
# API endpoints:
#   - GET  /health - Health check
#   - POST /telemetry - Receive telemetry events (logs only in MVP)
#   - GET  /api/telemetry?limit=50&eventType=... - Historical data with filtering
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
# Vite dev server starts on http://localhost:5173
# Dashboard available at http://localhost:5173
```

**Note:** MVP uses **polling mode** (frontend polls `GET /api/telemetry` every 2 seconds). WebSocket support is disabled until post-MVP phases.

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
│   │   ├── index.ts            # Fastify server entry point with CORS/security headers
│   │   ├── routes/
│   │   │   └── telemetry.ts   # GET /api/telemetry with JSON Schema validation
│   │   ├── services/
│   │   │   ├── telemetry-parser.ts  # Parse telemetry.jsonl (streams + readline)
│   │   │   ├── file-watcher.ts      # chokidar watcher (ready, unused in MVP)
│   │   │   └── websocket.ts         # WebSocket service (disabled for MVP)
│   │   └── types/
│   │       ├── telemetry.ts   # TelemetryEvent type definition
│   │       └── ws.d.ts       # WebSocket type declarations
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # Svelte 4 + Vite frontend
│   ├── src/
│   │   ├── main.ts            # Svelte app entry point
│   │   ├── App.svelte        # Root Svelte component
│   │   ├── components/
│   │   │   ├── EventVisualization.svelte  # Main event list with virtual scroll
│   │   │   ├── AgentAvatar.svelte         # Agent avatar display
│   │   │   └── TaskCard.svelte            # Task card component
│   │   ├── lib/
│   │   │   ├── agent-types.ts   # Agent type definitions + AGENTS config
│   │   │   ├── event-types.ts   # Event types + color mapping
│   │   │   ├── task-types.ts    # Task type definitions
│   │   │   └── config.ts        # API_URL, POLL_INTERVAL, TELEMETRY_LIMIT
│   │   └── routes/
│   │       └── +page.svelte     # SvelteKit-style route (if used)
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
├── tests/                      # Test files
│   ├── backend/
│   │   ├── telemetry-route.test.ts
│   │   └── telemetry-parser.test.ts
│   └── frontend/
│       └── agent-types.test.ts
│
├── AGENTS.md                   # Agent configurations
└── README.md                   # This file
```

## 📄 Specification

The full project specification is documented in [.swarm/spec.md](.swarm/spec.md) and includes:

### Functional Requirements (FR-001 to FR-012)
- FR-001: Agent Visualization (all 7 agent types) ✅
- FR-002: Agent Status Display (4 visual states) ✅
- FR-003: Task Delegation Flow (animated arrows) ⏳
- FR-004: Real-time Event Streaming (polling mode, 2s) ✅
- FR-005: Event Data Source Integration (telemetry.jsonl) ✅
- FR-006: WebSocket Communication (disabled for MVP) ⏳
- FR-007: Historical Data Access (with filtering) ✅
- FR-008: Task Lifecycle Visualization ✅
- FR-009: Performance (virtual scrolling, 60fps target) 🚀
- FR-010: Read-only Data Access ✅
- FR-011: Local Development Support (CORS) ✅
- FR-012: Multi-session Support (deferred)

### Success Criteria (SC-001 to SC-006)
- SC-001: Agent Display Verification (2s load time) ✅
- SC-002: Real-time Update Verification (polling: ~2s latency) ✅
- SC-003: Animation Performance Verification (virtual scroll) 🚀
- SC-004: Data Integrity Verification (100% accuracy) ✅
- SC-005: Read-only Compliance Verification ✅
- SC-006: Historical Data Retrieval (<500ms for 10k events) ✅

## 📋 Implementation Plan

The implementation plan is documented in [.swarm/plan.md](.swarm/plan.md) and consists of:

| Phase | Name | Status | Tasks |
|-------|------|--------|-------|
| 1 | Project Setup & Scaffolding | ✅ **COMPLETE** | 7 tasks (1.1-1.7) |
| 2 | Backend Development | 🔄 **IN PROGRESS** | 3 tasks (2.1-2.3) |
| 3 | Frontend Visualization | 🔄 **IN PROGRESS** | 3 tasks (3.1-3.3) |
| 4 | Integration & Testing | 🔄 **IN PROGRESS** | 3 tasks (4.1-4.3) |

**Total:** 16 tasks across 4 phases

### Phase 1 Completed Tasks (6/7):
- 1.1: Initialize backend package.json with Fastify/TypeScript dependencies ✅
- 1.2: Configure TypeScript for backend with strict mode ✅
- 1.3: Scaffold Svelte+Vite frontend with TypeScript ✅
- 1.4: Create backend entry point with Fastify server and telemetry types ✅
- 1.5: Implement WebSocket service and file watcher for .swarm/telemetry.jsonl ✅
- 1.6: Define frontend agent types and Svelte AgentAvatar component ✅
- 1.7: Fix critical issues: directory confusion, entry point, code duplication ✅
- 1.8: Create telemetry event generator for testing (pending) ⏳

### Phase 2 In Progress (2/3):
- 2.1: Implement REST API for historical telemetry data with filtering ✅
- 2.2: Add CORS support and security headers for local development ✅
- 2.3: Handle telemetry file rotation and malformed lines (IN PROGRESS) 🔄

### Phase 3 In Progress (1/3):
- 3.1: Implement task delegation flow visualization with animated arrows (pending) ⏳
- 3.2: Create real-time event visualization with WebSocket client (deferred) ⏳
- 3.3: Add timeline view for historical data with filtering ✅

### Phase 4 In Progress (2/3):
- 4.1: Connect frontend to backend API (polling mode) ✅
- 4.2: Validate all 7 agent types display correctly ✅
- 4.3: Performance optimization to maintain 60fps (IN PROGRESS) 🔄

## 🚦 Current Status (MVP)

> **Phase 1: Project Setup & Scaffolding - COMPLETE ✅**
> **MVP: Basic visualization working with polling mode 🔄**

The MVP is functional with the following features implemented:
- ✅ Backend running on `:3000` with REST API (GET /api/telemetry, GET /health)
- ✅ Frontend running on `:5173` with Svelte 4 (virtual scrolling, agent avatars)
- ✅ Polling mode working (2-second intervals via `POLL_INTERVAL`)
- ✅ Historical data with filtering (eventType, agentId, from/to, limit)
- ✅ JSON Schema validation with `coerceTypes: true` for query params
- ✅ Agent type extraction from `sessionId` and `agentName` in telemetry data
- ✅ Virtual scrolling with `requestAnimationFrame` for performance
- ✅ Scroll position preserved (no more jumping to top)

**Recent Fixes:**
- 🔧 Fixed scroll jumping (removed `scrollTop = 0` assignment)
- 🔧 Fixed `extractAgentType()` to check `data.sessionId` properly
- 🔧 Replaced Svelte 5 syntax (`$state`/`$derived`) with Svelte 4 (`$:`, reactive statements)
- 🔧 Fixed telemetry.jsonl path (3 levels `../..` for ESM modules)
- 🔧 Fixed CORS configuration for `localhost:5173`

**Progress:** 9/16 tasks completed (9 completed, 3 in progress, 4 pending)

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
- [Svelte 4 Documentation](https://svelte.dev/docs)
- [Vite Documentation](https://vitejs.dev/)

---

*Last Updated: 2026-05-05*
