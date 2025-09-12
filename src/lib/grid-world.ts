import type {
  GridCell,
  GridWorld,
  Position,
  TerminalState,
} from "@contracts/types";
import { atom } from "jotai";

/**
 * The width of the grid world (number of columns).
 */
export const GRID_WIDTH = 4;

/**
 * The height of the grid world (number of rows).
 */
export const GRID_HEIGHT = 3;

/**
 * The agent's starting position in the grid world.
 */
export const START_POSITION: Position = { row: 1, col: 1 };

/**
 * The position of the wall cell (impassable).
 */
export const WALL_POSITION: Position = { row: 2, col: 2 };

/**
 * The terminal states in the grid world, with their positions and rewards.
 */
export const TERMINAL_STATES: TerminalState[] = [
  { position: { row: 3, col: 4 }, reward: 1, type: "positive" },
  { position: { row: 2, col: 4 }, reward: -1, type: "negative" },
];

/**
 * The default step reward for non-terminal, non-wall cells.
 */
export const STEP_REWARD = -0.04;

/**
 * Helper to create a grid cell for the given row and column.
 * @param row Row index (1-based)
 * @param col Column index (1-based)
 * @returns {GridCell} The created grid cell object
 */
function createCell(row: number, col: number): GridCell {
  const pos: Position = { row, col };
  if (row === WALL_POSITION.row && col === WALL_POSITION.col) {
    return {
      position: pos,
      type: "wall",
      isAccessible: false,
      reward: 0,
      utilityValue: 0,
    };
  }
  const terminal = TERMINAL_STATES.find(
    (t) => t.position.row === row && t.position.col === col,
  );
  if (terminal) {
    return {
      position: pos,
      type: "terminal",
      isAccessible: true,
      reward: terminal.reward,
      utilityValue: 0,
    };
  }
  if (row === START_POSITION.row && col === START_POSITION.col) {
    return {
      position: pos,
      type: "start",
      isAccessible: true,
      reward: STEP_REWARD,
      utilityValue: 0,
    };
  }
  return {
    position: pos,
    type: "normal",
    isAccessible: true,
    reward: STEP_REWARD,
    utilityValue: 0,
  };
}

/**
 * Creates the initial 4x3 grid world for the value iteration simulator.
 * - Wall at (2,2) is impassable
 * - Terminal states: (4,2) = -1, (4,3) = +1
 * - Start position: (1,1)
 * - All other cells are normal with step reward
 * @returns {GridWorld} The initialized grid world object
 */
export function createInitialGridWorld(): GridWorld {
  const cells: GridCell[][] = [];
  for (let row = 1; row <= GRID_HEIGHT; row++) {
    const rowCells: GridCell[] = [];
    for (let col = 1; col <= GRID_WIDTH; col++) {
      rowCells.push(createCell(row, col));
    }
    cells.push(rowCells);
  }
  return {
    dimensions: { width: GRID_WIDTH, height: GRID_HEIGHT },
    cells,
    startPosition: START_POSITION,
    terminalStates: TERMINAL_STATES,
  };
}

/**
 * Jotai atom holding the current grid world state.
 */
export const gridWorldAtom = atom<GridWorld>(createInitialGridWorld());

export type { GridWorld } from "@contracts/types";
