# Context
Swarm: web-viz

## Project: opencode-swarm-web-srv
Web visualization dashboard for opencode-swarm multi-agent system.
Real-time monitoring with game-like animated interface.

## Decisions
- Backend: Node.js with WebSocket support (to be confirmed)
- Frontend: React with Framer Motion or similar animation library
- Data source: .swarm/events.jsonl file watching
- Deployment: Local development server

## SME Cache
### Web Visualization
- Use WebSocket for real-time updates (not polling)
- Animation libraries: Framer Motion (React), GSAP, or CSS animations
- Performance target: 60fps for smooth animations

### Game-like UI
- Agent avatars: Use simple emoji or SVG icons
- Task cards: Animate with sliding/flowing transitions
- Status indicators: Color-coded (green=active, gray=idle, red=error)

## Patterns
- Event-driven architecture: Backend watches events.jsonl → pushes to WebSocket
- Component pattern: Each agent = separate visual component
- State management: React state or Redux for complex state

## Phase Metrics
- total_tool_calls: 0
- coder_revisions: 0
- reviewer_rejections: 0
- test_failures: 0
- security_findings: 0
- integration_issues: 0
- task_count: 0
- task_complexity: trivial
- top_rejection_reasons: []
- lessons_learned: []
