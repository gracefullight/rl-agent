# Tasks: Grid World Value Iteration Simulator

**Input**: Design documents from `/specs/001-4x3-1-1/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

---

## Phase 3.1: Setup
- [x] T001 Create Next.js 15 project structure and directories per plan in `/src/` and `/tests/`
- [x] T002 Initialize project with dependencies: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Jotai, React Konva, es-toolkit, axios, @tanstack/react-query, Playwright, @biomejs/biome, pnpm
- [x] T003 [P] Configure @biomejs/biome v2 linting and formatting
- [x] T004 [P] Initialize shadcn/ui and install required UI components (button, input, card, table, badge, slider, label, separator)

## Phase 3.2: Tests First (TDD)
- [x] T005 [P] Write contract test for GridWorld types in `tests/unit/grid-world-contract.test.ts`
- [x] T006 [P] Write contract test for Agent and MovementProbabilities in `tests/unit/agent-contract.test.ts`
- [x] T007 [P] Write contract test for UtilityValues and Policy in `tests/unit/utility-policy-contract.test.ts`
- [x] T008 [P] Write contract test for SimulationState and Configuration in `tests/unit/simulation-contract.test.ts`
- [x] T009 [P] Write E2E test for grid rendering and cell interaction in `tests/e2e/grid-canvas.e2e.ts`
- [x] T010 [P] Write E2E test for value iteration controls and convergence in `tests/e2e/value-iteration.e2e.ts`

## Phase 3.3: Core Implementation
- [x] T011 [P] Implement GridWorld data model and atoms in `src/lib/grid-world.ts`
- [x] T012 [P] Implement Agent and movement logic in `src/lib/agent.ts`
- [x] T013 [P] Implement UtilityValues and value iteration algorithm in `src/lib/value-iteration.ts`
- [x] T014 [P] Implement Policy extraction logic in `src/lib/policy.ts`
- [x] T015 [P] Implement SimulationState and configuration atoms in `src/lib/simulation.ts`
- [x] T016 [P] Implement GridCanvas component with React Konva in `src/components/grid-world/GridCanvas.tsx`
- [x] T017 [P] Implement ControlPanel component in `src/components/grid-world/ControlPanel.tsx`
- [x] T018 [P] Implement UtilityDisplay and PolicyDisplay components in `src/components/grid-world/UtilityDisplay.tsx` and `src/components/grid-world/PolicyDisplay.tsx`
- [x] T019 [P] Implement Jotai atoms for state management in `src/lib/atoms.ts`
- [x] T020 [P] Integrate all components in Next.js app entry in `src/app/page.tsx`

## Phase 3.4: Integration & Polish
- [x] T021 [P] Add accessibility features and ARIA labels to canvas and controls in all relevant components
- [x] T022 [P] Add error boundaries and validation feedback in `src/components/grid-world/`
- [x] T023 [P] Add performance monitoring utilities in `src/lib/performance.ts`
- [x] T024 [P] Add export/import state functionality in `src/lib/export-import.ts`
- [x] T025 [P] Add documentation for all public APIs and components in `src/lib/` and `src/components/`
- [x] T026 [P] Add unit tests for all core logic in `tests/unit/`
- [x] T027 [P] Add E2E tests for accessibility and error handling in `tests/e2e/`

## Dependencies
- T001 → T002
- T002 → T003, T004
- T003, T004 → T005-T010 (tests)
- T005-T010 (tests) → T011-T020 (core impl)
- T011-T015 (models/logic) → T016-T020 (components/integration)
- T016-T020 → T021-T027 (integration/polish)

## Parallel Example
```
# Launch T005-T010 together:
- Contract test for GridWorld types in `tests/unit/grid-world-contract.test.ts`
- Contract test for Agent and MovementProbabilities in `tests/unit/agent-contract.test.ts`
- Contract test for UtilityValues and Policy in `tests/unit/utility-policy-contract.test.ts`
- Contract test for SimulationState and Configuration in `tests/unit/simulation-contract.test.ts`
- E2E test for grid rendering and cell interaction in `tests/e2e/grid-canvas.e2e.ts`
- E2E test for value iteration controls and convergence in `tests/e2e/value-iteration.e2e.ts`
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts
