/**
 * TypeScript Interface Contracts for Grid World Value Iteration Simulator
 * 
 * These interfaces define the contract between components and ensure type safety
 * across the entire application. Each interface represents a specific domain entity
 * or component contract.
 */

// Core Position and Direction Types
export interface Position {
  row: number;    // 1-based indexing (1-3)
  col: number;    // 1-based indexing (1-4)
}

export type Direction = 'up' | 'down' | 'left' | 'right';
export type CellType = 'normal' | 'wall' | 'terminal' | 'start';

// Grid World Domain Entities
export interface GridCell {
  position: Position;
  type: CellType;
  isAccessible: boolean;
  reward: number;
  utilityValue: number;
}

export interface TerminalState {
  position: Position;
  reward: number;
  type: 'positive' | 'negative';
}

export interface GridWorld {
  dimensions: { width: number; height: number };
  cells: GridCell[][];
  startPosition: Position;
  terminalStates: TerminalState[];
}

// Agent and Movement
export interface MovementProbabilities {
  intendedDirection: number;  // 0.8
  leftTurn: number;          // 0.1
  rightTurn: number;         // 0.1
  stayInPlace: number;       // 0.0
}

export interface Agent {
  currentPosition: Position;
  movementProbabilities: MovementProbabilities;
  isAtTerminal: boolean;
  episodeSteps: number;
}

// Value Iteration and Policy
export interface UtilityValues {
  values: Map<string, number>;
  previousValues: Map<string, number>;
  iterationCount: number;
  hasConverged: boolean;
  convergenceThreshold: number;
}

export interface Policy {
  actions: Map<string, Direction>;
  isOptimal: boolean;
  lastUpdated: number;
}

// Simulation State and Configuration
export interface SimulationState {
  isRunning: boolean;
  isPaused: boolean;
  currentIteration: number;
  maxIterations: number;
  iterationSpeed: number;
  autoRun: boolean;
}

export interface RewardConfiguration {
  stepReward: number;
  terminalRewards: TerminalReward[];
  wallPenalty: number;
}

export interface TerminalReward {
  position: Position;
  reward: number;
}

export interface SimulationConfiguration {
  stepReward: number;
  discountFactor: number;
  algorithm: 'value-iteration' | 'policy-iteration';
  maxIterations: number;
  convergenceThreshold: number;
}

// Component Props Contracts
export interface GridCanvasProps {
  gridWorld: GridWorld;
  agent: Agent;
  utilityValues: UtilityValues;
  onCellClick: (position: Position) => void;
  onCellHover: (position: Position | null) => void;
  width: number;
  height: number;
}

export interface ControlPanelProps {
  simulationState: SimulationState;
  configuration: SimulationConfiguration;
  onIterate: () => void;
  onReset: () => void;
  onConfigChange: (config: Partial<SimulationConfiguration>) => void;
  onPause: () => void;
  onResume: () => void;
}

export interface UtilityDisplayProps {
  utilityValues: UtilityValues;
  gridDimensions: { width: number; height: number };
  format: 'decimal' | 'scientific';
  precision: number;
}

export interface PolicyDisplayProps {
  policy: Policy;
  gridDimensions: { width: number; height: number };
  showArrows: boolean;
  showText: boolean;
}

// State Management Contracts (Jotai Atoms)
export interface GridWorldAtomValue {
  grid: GridWorld;
  lastModified: number;
}

export interface AgentAtomValue {
  agent: Agent;
  movementHistory: Position[];
  lastAction: Direction | null;
}

export interface SimulationAtomValue extends SimulationState {
  startTime: number | null;
  totalIterations: number;
  averageIterationTime: number;
}

// Algorithm Contracts
export interface ValueIterationParams {
  gridWorld: GridWorld;
  utilityValues: UtilityValues;
  discountFactor: number;
  convergenceThreshold: number;
}

export interface ValueIterationResult {
  newUtilityValues: UtilityValues;
  deltaMax: number;
  converged: boolean;
  iterationTime: number;
}

export interface PolicyExtractionParams {
  gridWorld: GridWorld;
  utilityValues: UtilityValues;
  movementProbabilities: MovementProbabilities;
  discountFactor: number;
}

export interface PolicyExtractionResult {
  policy: Policy;
  isOptimal: boolean;
  extractionTime: number;
}

// Event Contracts
export interface GridClickEvent {
  position: Position;
  cell: GridCell;
  timestamp: number;
}

export interface IterationCompleteEvent {
  iteration: number;
  utilityValues: UtilityValues;
  policy: Policy;
  deltaMax: number;
  converged: boolean;
  duration: number;
}

export interface SimulationResetEvent {
  previousState: SimulationState;
  newState: SimulationState;
  timestamp: number;
}

// Canvas Rendering Contracts
export interface CanvasRenderingContext {
  stage: any; // Konva Stage reference
  layer: any; // Konva Layer reference
  gridLayer: any; // Grid background layer
  agentLayer: any; // Agent rendering layer
  uiLayer: any; // UI overlay layer
}

export interface CellRenderProps {
  cell: GridCell;
  utilityValue: number;
  isAgentPosition: boolean;
  isHovered: boolean;
  showUtilityValue: boolean;
  cellSize: number;
}

export interface AgentRenderProps {
  position: Position;
  isAnimating: boolean;
  animationProgress: number;
  cellSize: number;
}

// Validation Contracts
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface GridValidationParams {
  gridWorld: GridWorld;
  agent: Agent;
  configuration: SimulationConfiguration;
}

export interface MovementValidationParams {
  from: Position;
  to: Position;
  gridWorld: GridWorld;
  movementProbabilities: MovementProbabilities;
}

// Performance Monitoring Contracts
export interface PerformanceMetrics {
  renderTime: number;
  iterationTime: number;
  memoryUsage: number;
  frameRate: number;
  lastUpdated: number;
}

export interface PerformanceThresholds {
  maxRenderTime: number;
  maxIterationTime: number;
  maxMemoryUsage: number;
  minFrameRate: number;
}

// Export/Import Contracts
export interface SerializableState {
  gridWorld: GridWorld;
  agent: Agent;
  utilityValues: UtilityValues;
  policy: Policy;
  configuration: SimulationConfiguration;
  version: string;
  timestamp: number;
}

export interface ExportOptions {
  includeHistory: boolean;
  includeMetrics: boolean;
  format: 'json' | 'csv' | 'xlsx';
  precision: number;
}

export interface ImportResult {
  success: boolean;
  state: SerializableState | null;
  errors: string[];
  warnings: string[];
}

// Testing Contracts
export interface TestScenario {
  name: string;
  description: string;
  initialState: SerializableState;
  expectedOutcome: Partial<SerializableState>;
  validationRules: ValidationResult;
}

export interface E2ETestContext {
  page: any; // Playwright Page
  canvas: any; // Canvas element
  utilityDisplay: any; // Utility display element
  controlPanel: any; // Control panel element
}

// Error Handling Contracts
export interface SimulationError {
  code: string;
  message: string;
  context: Record<string, any>;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ErrorRecoveryStrategy {
  canRecover: boolean;
  recoveryAction: () => Promise<boolean>;
  fallbackState: Partial<SerializableState>;
}