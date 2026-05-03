# Project Rules for opencode-swarm-web-srv

## Code Style
- Use TypeScript for frontend (if React) or Python for backend
- Follow existing patterns in the codebase
- All animations must be performant (60fps target)

## Architecture Rules
- Backend MUST read from `.swarm/events.jsonl` (read-only)
- Frontend MUST use WebSocket for real-time updates
- No direct modification of `.swarm/` files by the web service

## Agent Interaction Rules
- Visualize all 7 agent types: architect, coder, reviewer, explorer, test_engineer, sme, docs
- Show task delegation flow with animated arrows/lines
- Display task status: pending → in_progress → completed/blocked

## Data Flow
```
.swarm/events.jsonl → Backend API → WebSocket → Frontend Dashboard
```

## Security
- Backend should only read from project directory
- No authentication required for local development
- CORS enabled for local development
