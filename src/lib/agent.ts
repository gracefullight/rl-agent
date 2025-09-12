import type { Agent, MovementProbabilities, Position } from "@contracts/types";
import { atom } from "jotai";

/**
 * Default movement probabilities for the agent's stochastic movement model.
 */
export const DEFAULT_MOVEMENT_PROBABILITIES: MovementProbabilities = {
  intendedDirection: 0.8,
  leftTurn: 0.1,
  rightTurn: 0.1,
  stayInPlace: 0.0,
};

/**
 * Creates the initial agent state for the grid world.
 * @returns {Agent} The initialized agent object
 */
export function createInitialAgent(): Agent {
  return {
    currentPosition: { row: 1, col: 1 },
    movementProbabilities: DEFAULT_MOVEMENT_PROBABILITIES,
    isAtTerminal: false,
    episodeSteps: 0,
  };
}

/**
 * Jotai atom holding the current agent state.
 */
export const agentAtom = atom<Agent>(createInitialAgent());

/**
 * Moves the agent in the specified direction, respecting grid boundaries and accessibility.
 * @param agent The current agent state
 * @param direction The direction to move ('up', 'down', 'left', 'right')
 * @param isAccessible Function to check if a position is accessible
 * @returns {Agent} The updated agent state after movement
 */
export function moveAgent(
  agent: Agent,
  direction: "up" | "left" | "right",
  isAccessible: (pos: Position) => boolean,
): Agent {
  const { row, col } = agent.currentPosition;
  let newPos: Position = { row, col };
  if (direction === "up") newPos = { row: row + 1, col };
  if (direction === "left") newPos = { row, col: col - 1 };
  if (direction === "right") newPos = { row, col: col + 1 };
  // Check bounds and accessibility
  if (
    newPos.row < 1 ||
    newPos.row > 3 ||
    newPos.col < 1 ||
    newPos.col > 4 ||
    !isAccessible(newPos)
  ) {
    newPos = { row, col }; // Stay in place
  }
  return {
    ...agent,
    currentPosition: newPos,
    episodeSteps: agent.episodeSteps + 1,
  };
}
