# Agents Configuration for opencode-swarm-web-srv

## Agent Definitions

### Architect (Lead)
- **Role**: Orchestrator of multi-agent swarm
- **Model**: big-pickle
- **Tools**: Task (delegation), planning tools, read-only analysis
- **Responsibilities**: Task decomposition, delegation, QA gates

### Coder
- **Role**: Implementation specialist
- **Tools**: write, edit, patch, apply_patch, create_file
- **Responsibilities**: Write production code, fix issues

### Reviewer
- **Role**: Code reviewer
- **Tools**: Read-only analysis, suggest_patch
- **Responsibilities**: Review code for correctness, security, quality

### Explorer
- **Role**: Codebase analysis
- **Tools**: Read-only exploration, search, symbols
- **Responsibilities**: Map codebase, identify patterns

### Test Engineer
- **Role**: Testing specialist
- **Tools**: test_runner, test generation
- **Responsibilities**: Write and run tests

### SME (Subject Matter Expert)
- **Role**: Domain expert
- **Tools**: Research, knowledge query
- **Responsibilities**: Provide domain-specific guidance

### Docs
- **Role**: Documentation specialist
- **Tools**: Documentation updates
- **Responsibilities**: Update README, API docs, guides

## Agent Interaction Flow
1. Architect receives task → decomposes into subtasks
2. Architect delegates to Coder (implementation)
3. Coder completes → Architect delegates to Reviewer
4. Reviewer approves → Architect delegates to Test Engineer
5. Tests pass → Task marked complete
