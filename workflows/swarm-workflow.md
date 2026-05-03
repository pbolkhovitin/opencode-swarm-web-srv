# Swarm Workflow for opencode-swarm-web-srv

## Main Workflow (Visualization Dashboard)

### Phase 1: Project Setup
- [x] 1.1: Create project structure (skills, rules, workflows) [COMPLETE]
- [ ] 1.2: Setup backend service (Node.js/Python) [PENDING]
- [ ] 1.3: Setup frontend with agent avatars [PENDING]

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

## Agent Task Flow
```
Architect → Coder (implement backend/frontend)
         → Reviewer (code review)
         → Test Engineer (write tests)
         → Docs (update documentation)
```
