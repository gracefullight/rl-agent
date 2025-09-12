# Data Model: Grid World Value Iteration Simulator

**Feature**: Grid World Value Iteration Simulator  
**Date**: September 12, 2025  
**Status**: Draft

## Core Entities

### GridWorld
**Purpose**: Represents the 4x3 grid environment with cell types and properties

**Properties**:
- `dimensions`: `{ width: 4, height: 3 }` - Fixed grid dimensions
- `cells`: `GridCell[][]` - 2D array of grid cells indexed as [row][column]
- `startPosition`: `Position` - Agent starting position (1,1)
- `terminalStates`: `TerminalState[]` - List of terminal states with rewards

**State Management**:
- Immutable structure for mathematical correctness
- Cell-level updates trigger re-calculation of dependent values
- Validation ensures position coordinates are within bounds

### GridCell
**Purpose**: Individual cell within the grid with type and properties

**Properties**:
- `position`: `Position` - Cell coordinates (row, col)
- `type`: `CellType` - Enumeration: 'normal' | 'wall' | 'terminal' | 'start'
- `isAccessible`: `boolean` - Whether agent can move to this cell
- `reward`: `number` - Immediate reward for entering this cell
- `utilityValue`: `number` - Current utility value from value iteration

**Relationships**:
- Belongs to exactly one `GridWorld`
- Referenced by `Agent` for current position
- Used in `Policy` for action recommendations

### Agent
**Purpose**: Represents the learning agent with movement capabilities and current state

**Properties**:
- `currentPosition`: `Position` - Current location in the grid
- `movementProbabilities`: `MovementProbabilities` - Stochastic movement rules
- `isAtTerminal`: `boolean` - Whether agent has reached a terminal state
- `episodeSteps`: `number` - Steps taken in current episode

**Behavior**:
- Moves according to probabilistic action model
- Cannot move into walls or outside grid boundaries
- Episodes terminate when reaching terminal states

### MovementProbabilities
**Purpose**: Defines stochastic movement model for agent actions

**Properties**:
- `intendedDirection`: `number` - Probability of moving in chosen direction (0.8)
- `leftTurn`: `number` - Probability of turning left from intended direction (0.1)
- `rightTurn`: `number` - Probability of turning right from intended direction (0.1)
- `stayInPlace`: `number` - Probability of not moving (0.0 by default)

**Validation**:
- All probabilities must sum to 1.0
- Each probability must be between 0.0 and 1.0

### UtilityValues
**Purpose**: Stores and manages utility values for each grid cell during value iteration

**Properties**:
- `values`: `Map<string, number>` - Utility values keyed by position string
- `previousValues`: `Map<string, number>` - Previous iteration values for convergence checking
- `iterationCount`: `number` - Current iteration number
- `hasConverged`: `boolean` - Whether algorithm has converged
- `convergenceThreshold`: `number` - Threshold for convergence detection (default: 0.001)

**Operations**:
- `updateValue(position: Position, value: number)` - Update single cell utility
- `calculateDelta()` - Compute maximum change between iterations
- `checkConvergence()` - Determine if algorithm has converged

### Policy
**Purpose**: Represents optimal policy (action recommendations) for each grid cell

**Properties**:
- `actions`: `Map<string, Direction>` - Optimal action for each non-terminal cell
- `isOptimal`: `boolean` - Whether policy represents optimal solution
- `lastUpdated`: `number` - Timestamp of last policy update

**Derived From**:
- Current utility values
- Grid structure and movement model
- Terminal state locations

### SimulationState
**Purpose**: Manages overall simulation state and configuration

**Properties**:
- `isRunning`: `boolean` - Whether simulation is actively running
- `isPaused`: `boolean` - Whether simulation is paused
- `currentIteration`: `number` - Current value iteration count
- `maxIterations`: `number` - Maximum allowed iterations (default: 1000)
- `iterationSpeed`: `number` - Milliseconds between iterations (default: 500)
- `autoRun`: `boolean` - Whether to automatically continue iterations

**Configuration**:
- `stepReward`: `number` - Default reward for non-terminal cells (-0.04)
- `discountFactor`: `number` - Gamma parameter for future rewards (1.0)
- `algorithm`: `'value-iteration' | 'policy-iteration'` - Algorithm type

### RewardConfiguration
**Purpose**: Defines reward structure for the grid world

**Properties**:
- `stepReward`: `number` - Default reward for each step (-0.04)
- `terminalRewards`: `TerminalReward[]` - Rewards for terminal states
- `wallPenalty`: `number` - Penalty for attempting to move into walls (0.0)

**Terminal Rewards**:
- Position (4,2): -1.0 (negative terminal)
- Position (4,3): +1.0 (positive terminal)

## Supporting Types

### Position
```typescript
interface Position {
  row: number;    // 1-based indexing (1-3)
  col: number;    // 1-based indexing (1-4)
}
```

### Direction
```typescript
type Direction = 'up' | 'down' | 'left' | 'right';
```

### CellType
```typescript
type CellType = 'normal' | 'wall' | 'terminal' | 'start';
```

### TerminalState
```typescript
interface TerminalState {
  position: Position;
  reward: number;
  type: 'positive' | 'negative';
}
```

### TerminalReward
```typescript
interface TerminalReward {
  position: Position;
  reward: number;
}
```

## State Management Architecture

### Jotai Atom Structure

**Base Atoms** (primitive state):
- `gridWorldAtom`: Stores immutable grid structure
- `agentPositionAtom`: Current agent location
- `utilityValuesAtom`: Current utility values for all cells
- `simulationConfigAtom`: User-configurable simulation parameters
- `simulationStateAtom`: Runtime simulation state

**Derived Atoms** (computed state):
- `policyAtom`: Derived from utility values and grid structure
- `convergenceStatusAtom`: Derived from utility value changes
- `currentEpisodeAtom`: Derived from agent position and terminal states
- `visualizationDataAtom`: Derived data optimized for canvas rendering

**Action Atoms** (state modifiers):
- `performIterationAtom`: Executes single value iteration step
- `resetSimulationAtom`: Returns to initial state
- `updateConfigurationAtom`: Modifies simulation parameters
- `moveAgentAtom`: Handles probabilistic agent movement

### Data Flow

1. **Initialization**: Base atoms populated with default grid configuration
2. **User Interaction**: Action atoms triggered by UI components
3. **State Updates**: Base atoms updated through immutable operations
4. **Derived Computation**: Computed atoms automatically recalculate
5. **UI Rendering**: React components subscribe to relevant atoms

### Persistence Strategy

**Session Storage**:
- Current simulation state for page refresh recovery
- User configuration preferences

**Export/Import**:
- Complete simulation state serialization
- Educational scenario sharing capabilities

## Validation Rules

### Grid Constraints
- Grid must be exactly 4x3 dimensions
- Position (2,2) must be wall type
- Position (4,2) must be terminal with -1 reward
- Position (4,3) must be terminal with +1 reward
- Agent starts at position (1,1)

### Movement Validation
- Agent cannot move outside grid boundaries
- Agent cannot move into wall cells
- Movement probabilities must sum to 1.0
- All probability values must be non-negative

### Algorithm Constraints
- Utility values must be finite numbers
- Convergence threshold must be positive
- Iteration count must be non-negative
- Discount factor must be between 0 and 1

### User Input Validation
- Step reward must be a valid number
- Iteration speed must be positive integer
- Maximum iterations must be positive integer

## Performance Considerations

### Memory Optimization
- Use Maps for sparse data structures
- Implement object pooling for frequent allocations
- Lazy evaluation for expensive computed properties

### Update Efficiency
- Atomic updates minimize re-rendering scope
- Immutable operations enable efficient comparison
- Memoization prevents redundant calculations

### Rendering Optimization
- Separate visual data atoms from business logic
- Batch updates during rapid iterations
- Use React.memo for expensive components

## Integration Points

### Canvas Rendering
- Position coordinates map directly to canvas pixel coordinates
- Cell types determine visual styling and interaction behavior
- Utility values drive color coding and numeric displays

### User Interface
- Configuration atoms bound to form inputs
- Simulation state controls button enabled/disabled states
- Real-time data drives dashboard displays

### Algorithm Implementation
- Pure functions operate on immutable data structures
- Functional composition enables algorithm modularity
- Type safety prevents runtime errors in calculations

This data model provides the foundation for implementing the Grid World Value Iteration Simulator with proper separation of concerns, efficient state management, and robust validation.