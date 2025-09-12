# GitHub Copilot Instructions: Grid World Value Iteration Simulator

## Project Context

This project implements an interactive web-based reinforcement learning simulator for visualizing value iteration algorithms in a 4x3 grid world environment. The application is built for educational purposes, helping students understand Markov Decision Processes (MDPs) through visual interaction.

## Technology Stack

### Core Framework

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **React 19** with modern hooks and patterns

### State Management

- **Jotai** for atomic state management
- Atomic pattern for grid cells, agent state, and simulation configuration
- Derived atoms for computed values (policy, convergence status)

### UI & Styling

- **shadcn/ui** components with **Tailwind CSS**
- **React Konva** for high-performance canvas rendering
- Responsive design patterns for educational tools

### Utilities & Data

- **es-toolkit** for utility functions (modern lodash alternative)
- **axios** + **TanStack Query** for any remote state management
- Immutable data patterns for mathematical correctness

### Development Tools

- **@biomejs/biome** for linting and formatting
- **Playwright** for E2E testing
- **pnpm** for package management
- **Conventional Commits** for commit messages

## Architecture Patterns

### Component Structure

```
src/
├── app/                    # Next.js App Router
├── components/
│   ├── grid-world/        # Core simulation components
│   ├── ui/                # shadcn/ui components
│   └── forms/             # Form components
├── lib/
│   ├── value-iteration.ts # Core algorithm
│   ├── grid-world.ts      # Grid state management
│   └── utils.ts           # Utility functions
└── hooks/                 # Custom React hooks
```

### State Management Pattern

- Use Jotai atoms for granular state updates
- Separate atoms for grid, agent, utilities, and config
- Derived atoms for computed values
- Immutable updates for mathematical consistency

### Canvas Rendering Pattern

- React Konva for declarative canvas components
- Layer-based architecture (grid, agent, UI overlays)
- Dynamic imports to handle SSR compatibility
- Event handling for user interactions

## Domain-Specific Knowledge

### Value Iteration Algorithm

- Bellman equation implementation: V(s) = R(s) + γ _ max_a Σ P(s'|s,a) _ V(s')
- Convergence detection based on utility value changes
- Policy extraction from converged utility values
- Discount factor (γ) typically 1.0

### Grid World Specifications

- 4x3 grid with 1-based indexing
- Agent starts at (1,1)
- Wall at (2,2) - impassable
- Terminal states: (4,2) = -1 reward, (4,3) = +1 reward
- Step reward: -0.04 (configurable)

### Movement Model

- Stochastic movement: 80% intended, 10% left turn, 10% right turn
- Boundary and wall collision handling
- Episode termination at terminal states

## Coding Guidelines

### React Component Patterns

```typescript
// Use functional components with hooks
const GridCanvas = ({ gridWorld, agent, onCellClick }: GridCanvasProps) => {
  const [stage, setStage] = useState<Konva.Stage | null>(null);

  // Use Jotai for state management
  const [utilityValues] = useAtom(utilityValuesAtom);

  // Memoize expensive calculations
  const policyData = useMemo(
    () => extractPolicy(utilityValues),
    [utilityValues]
  );

  return (
    <Stage ref={setStage} width={width} height={height}>
      <Layer>{/* Render grid cells */}</Layer>
    </Stage>
  );
};
```

### State Management Patterns

```typescript
// Define atoms for different concerns
export const gridWorldAtom = atom<GridWorld>(initialGridWorld);
export const agentAtom = atom<Agent>(initialAgent);
export const utilityValuesAtom = atom<UtilityValues>(initialUtilities);

// Derived atoms for computed values
export const policyAtom = atom((get) => {
  const utilities = get(utilityValuesAtom);
  const grid = get(gridWorldAtom);
  return extractPolicy(utilities, grid);
});

// Action atoms for state updates
export const performIterationAtom = atom(null, (get, set) => {
  const currentUtilities = get(utilityValuesAtom);
  const grid = get(gridWorldAtom);
  const newUtilities = valueIteration(currentUtilities, grid);
  set(utilityValuesAtom, newUtilities);
});
```

### Algorithm Implementation

```typescript
// Pure functions for mathematical operations
export const valueIteration = (
  params: ValueIterationParams
): ValueIterationResult => {
  const { gridWorld, utilityValues, discountFactor } = params;

  // Implement Bellman equation
  const newValues = new Map<string, number>();

  // Calculate expected utility for each action
  // Return immutable result

  return {
    newUtilityValues: { ...utilityValues, values: newValues },
    deltaMax,
    converged: deltaMax < convergenceThreshold,
    iterationTime: performance.now() - startTime,
  };
};
```

### Canvas Component Patterns

```typescript
// Use dynamic imports for Konva components
const GridCanvas = dynamic(() => import("./GridCanvasImpl"), {
  ssr: false, // Disable SSR for canvas components
});

// Handle canvas interactions
const handleCellClick = useCallback(
  (position: Position) => {
    // Validate position
    if (isValidPosition(position, gridWorld)) {
      onCellClick(position);
    }
  },
  [gridWorld, onCellClick]
);
```

## Testing Patterns

### Component Testing

```typescript
// Test React components with state
describe("GridCanvas", () => {
  it("should render grid cells correctly", () => {
    const { getByTestId } = render(
      <Provider>
        <GridCanvas {...defaultProps} />
      </Provider>
    );

    expect(getByTestId("grid-cell-1-1")).toBeInTheDocument();
  });
});
```

### E2E Testing with Playwright

```typescript
// Test canvas interactions
test("should update utility values after iteration", async ({ page }) => {
  await page.goto("/");

  // Click iterate button
  await page.click('[data-testid="iterate-button"]');

  // Verify utility values updated
  const utilityDisplay = page.locator('[data-testid="utility-display"]');
  await expect(utilityDisplay).toContainText("0."); // Non-zero utility
});
```

## Performance Considerations

### Canvas Optimization

- Use React.memo for expensive canvas components
- Implement efficient re-rendering strategies
- Batch updates during rapid iterations
- Monitor frame rate and memory usage

### State Update Efficiency

- Atomic updates minimize re-render scope
- Use immutable patterns for predictable updates
- Implement proper dependency arrays in hooks
- Avoid unnecessary effect triggers

### Bundle Size Management

- Use dynamic imports for heavy dependencies
- Tree-shake unused utilities
- Optimize asset loading and caching
- Monitor bundle size impact

## Common Patterns & Solutions

### Next.js + Konva Integration

```typescript
// next.config.js
module.exports = {
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: "canvas" }];
    return config;
  },
};
```

### Error Handling

```typescript
// Graceful error boundaries for canvas components
const CanvasErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary
      fallback={<div>Canvas failed to load. Please refresh.</div>}
      onError={(error) => console.error("Canvas error:", error)}
    >
      {children}
    </ErrorBoundary>
  );
};
```

### Accessibility

```typescript
// Ensure canvas components are accessible
<Stage aria-label="Grid World Simulation" role="application">
  <Layer>
    {cells.map((cell) => (
      <Rect
        key={`${cell.position.row}-${cell.position.col}`}
        onClick={() => handleCellClick(cell.position)}
        onTap={() => handleCellClick(cell.position)} // Touch support
        aria-label={`Cell ${cell.position.row}-${cell.position.col}, utility: ${cell.utilityValue}`}
      />
    ))}
  </Layer>
</Stage>
```

## Recent Changes & Context

### Implemented Features

- Feature specification completed with 15 functional requirements
- Technology research completed with React Konva, Jotai, es-toolkit choices
- Data model designed with proper entity relationships
- TypeScript contracts defined for all components and algorithms
- Quickstart guide created for development setup

### Current Implementation Status

- Phase 0 (Research) ✅ Complete
- Phase 1 (Design) ✅ Complete
- Phase 2 (Tasks) ⏳ Pending /tasks command
- Ready for task generation and implementation

### Next Implementation Priorities

1. Set up Next.js project with dependencies
2. Implement core data structures and atoms
3. Create grid canvas component with React Konva
4. Implement value iteration algorithm
5. Build control panel and utility displays
6. Add E2E tests with Playwright

This project emphasizes educational value, mathematical correctness, and smooth user experience for learning reinforcement learning concepts.
