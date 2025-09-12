# Implementation Plan: Grid World Value Iteration Simulator

**Branch**: `001-4x3-1-1` | **Date**: September 12, 2025 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-4x3-1-1/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path ✓
   → Feature spec loaded successfully
2. Fill Technical Context (scan for NEEDS CLARIFICATION) ✓
   → Project Type: web (Next.js 15 frontend application)
   → Structure Decision: Single project with Next.js app structure
3. Evaluate Constitution Check section below
   → Constitution is template-based, proceeding with established patterns
   → Update Progress Tracking: Initial Constitution Check
4. Execute Phase 0 → research.md
   → Research technology stack and integration patterns
5. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file
6. Re-evaluate Constitution Check section
   → Update Progress Tracking: Post-Design Constitution Check
7. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
8. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Interactive web-based reinforcement learning simulator implementing value iteration algorithm in a 4x3 grid world. Features probabilistic agent movement, real-time utility value visualization, policy display, and user controls for iteration and reset. Built with Next.js 15, shadcn/ui components, canvas rendering, and state management via Jotai.

## Technical Context
**Language/Version**: TypeScript with Next.js 15
**Primary Dependencies**: 
- UI Framework: shadcn/ui with Tailwind CSS
- State Management: Jotai for local state
- Remote State: axios + TanStack Query (if needed)
- Utilities: es-toolkit
- Canvas Rendering: HTML5 Canvas or Konva.js
- Linting: Biome v2 latest
- Package Manager: pnpm
- Testing: Playwright for E2E testing

**Storage**: Local state only (no persistent storage required)
**Testing**: Playwright for automated functional testing of canvas interactions
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: single (Next.js application)
**Performance Goals**: 60 fps canvas rendering, <100ms iteration response time
**Constraints**: Responsive design, accessibility support, mathematical accuracy
**Scale/Scope**: Single-page application, ~10-15 React components, educational tool scope

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Simplicity**:
- Projects: 1 (Next.js app with integrated components)
- Using framework directly? Yes (Next.js, React, shadcn/ui without wrappers)
- Single data model? Yes (grid state, agent state, simulation state)
- Avoiding patterns? Yes (direct state management, no unnecessary abstractions)

**Architecture**:
- EVERY feature as library? N/A (single app scope)
- Libraries listed: N/A (using external libraries directly)
- CLI per library: N/A (web application)
- Library docs: N/A (web application)

**Testing (NON-NEGOTIABLE)**:
- RED-GREEN-Refactor cycle enforced? Yes (Playwright tests first)
- Git commits show tests before implementation? Yes (test-driven approach)
- Order: Contract→Integration→E2E→Unit strictly followed? Yes
- Real dependencies used? Yes (actual browser testing with Playwright)
- Integration tests for: Canvas interactions, value iteration algorithm, state transitions
- FORBIDDEN: Implementation before test, skipping RED phase

**Observability**:
- Structured logging included? Yes (console logging for debugging)
- Frontend logs → backend? N/A (frontend-only application)
- Error context sufficient? Yes (error boundaries, validation feedback)

**Versioning**:
- Version number assigned? 0.1.0 (initial version)
- BUILD increments on every change? Yes (via package.json)
- Breaking changes handled? N/A (initial development)

## Project Structure

### Documentation (this feature)
```
specs/001-4x3-1-1/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
# Next.js application structure
app/
├── globals.css
├── layout.tsx
├── page.tsx
└── components/
    ├── grid-world/
    │   ├── grid-canvas.tsx
    │   ├── control-panel.tsx
    │   ├── utility-display.tsx
    │   └── policy-display.tsx
    ├── ui/              # shadcn/ui components
    └── forms/

lib/
├── value-iteration.ts   # Core algorithm
├── grid-world.ts        # Grid state management
├── probability.ts       # Movement probability logic
└── utils.ts            # Utility functions

hooks/
├── use-grid-world.ts    # Main state hook
├── use-value-iteration.ts
└── use-canvas.ts

tests/
├── e2e/                # Playwright tests
├── unit/               # Jest tests
└── integration/        # Component integration tests
```

**Structure Decision**: Single Next.js project with component-based architecture

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - Canvas library choice (HTML5 Canvas vs Konva.js vs Fabric.js)
   - Value iteration algorithm implementation details
   - Optimal state management patterns with Jotai
   - shadcn/ui component integration patterns
   - Playwright testing strategies for canvas elements

2. **Generate and dispatch research agents**:
   ```
   Research Tasks:
   - "Research canvas libraries for interactive grid visualization in React"
   - "Find best practices for implementing value iteration algorithm in TypeScript"
   - "Research Jotai patterns for complex state management in React applications"
   - "Find shadcn/ui component composition patterns for data visualization"
   - "Research Playwright testing strategies for canvas-based applications"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all technology choices and implementation approaches defined

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - GridWorld (4x3 matrix with cell types)
   - Agent (position, movement probabilities)
   - UtilityValues (numerical values per cell)
   - Policy (optimal actions per cell)
   - SimulationState (iteration count, convergence status)
   - RewardConfiguration (step reward, terminal rewards)

2. **Generate API contracts** from functional requirements:
   - Canvas interaction contracts (click handlers, rendering methods)
   - State management contracts (Jotai atoms and actions)
   - Algorithm contracts (value iteration functions)
   - Component prop interfaces
   - Output TypeScript interfaces to `/contracts/`

3. **Generate contract tests** from contracts:
   - Canvas rendering tests (Playwright)
   - State management tests (Jest)
   - Algorithm correctness tests (Jest)
   - Component integration tests (React Testing Library)
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Initial grid display scenario
   - Agent movement scenario  
   - Utility value update scenario
   - Reset functionality scenario
   - Reward input validation scenario

5. **Update agent file incrementally** (O(1) operation):
   - Run `/scripts/update-agent-context.sh copilot` for GitHub Copilot
   - Add Next.js 15, shadcn/ui, Jotai, canvas, value iteration context
   - Include recent technical decisions
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, .github/copilot-instructions.md

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:

**Ordering Strategy**:

**Estimated Output**: 25-30 numbered, ordered tasks in tasks.md
**Task Generation Strategy**:
- Load Phase 1 artifacts: data-model.md, contracts/types.ts, quickstart.md
- Create test-first implementation tasks following TDD principles
- Generate parallel tasks [P] for independent components
- Create sequential dependency chains where needed
- Map each functional requirement (FR-001 to FR-015) to specific tasks
- Include setup, core implementation, integration, and validation phases

**Task Categories**:
1. **Setup Tasks (1-5)**: Project initialization, dependency installation, configuration
2. **Core Model Tasks (6-12)**: Data structures, atoms, validation [P]
3. **Algorithm Tasks (13-16)**: Value iteration, policy extraction [P] 
4. **UI Component Tasks (17-25)**: Canvas, controls, displays with tests
5. **Integration Tasks (26-28)**: E2E tests, performance validation
6. **Documentation Tasks (29-30)**: README, deployment guide

**Ordering Strategy**:
- TDD order: Contract tests → Implementation → Integration tests
- Dependency order: Core atoms → Algorithm → UI components → Integration
- Parallel execution: Independent components marked [P]
- Sequential chains: Canvas depends on atoms, controls depend on canvas

**Test Strategy Integration**:
- Playwright E2E tests for user acceptance scenarios
- Vitest unit tests for algorithm correctness
- React Testing Library for component behavior
- Performance tests for canvas rendering and iteration speed

**Estimated Output**: 30 numbered, ordered tasks in tasks.md with clear dependencies

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:

**Gate Status**:
**Phase Status**:
**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed
---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*