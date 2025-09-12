import { atom } from "jotai";
import type {
  Direction,
  GridWorld,
  MovementProbabilities,
  Policy,
  UtilityValues,
} from "../../specs/001-4x3-1-1/contracts/types";
import { DIRECTIONS, MOVEMENT_DELTAS } from "./constants";

/**
 * Creates the initial policy object for the grid world.
 * @returns {Policy} The initialized policy object
 */
export function createInitialPolicy(): Policy {
  return {
    actions: new Map(),
    isOptimal: false,
    lastUpdated: Date.now(),
  };
}

/**
 * Jotai atom holding the current policy state.
 */
export const policyAtom = atom<Policy>(createInitialPolicy());

/**
 * Extracts the optimal policy from the current utility values and grid world.
 * @param utilityValues The current utility values
 * @param gridWorld The grid world object
 * @param movementProbabilities The agent's movement probabilities
 * @param discountFactor The discount factor (gamma)
 * @returns {Policy} The extracted policy object
 */
export function extractPolicy(
  utilityValues: UtilityValues,
  gridWorld: GridWorld,
  movementProbabilities: MovementProbabilities,
): Policy {
  // For each cell, pick the action with the highest expected utility
  const actions = new Map<string, Direction>();
  for (const row of gridWorld.cells) {
    for (const cell of row) {
      if (
        !cell.isAccessible ||
        cell.type === "wall" ||
        cell.type === "terminal"
      ) {
        continue;
      }

      let bestAction: Direction | null = null;
      let bestValue = -Infinity;
      const expectedByDir: Record<string, number> = {};
      for (let a = 0; a < DIRECTIONS.length; a++) {
        let expected = 0;
        // Intended direction
        const intended = DIRECTIONS[a];
        const delta = MOVEMENT_DELTAS[intended as keyof typeof MOVEMENT_DELTAS];
        let sPrime = {
          row: cell.position.row + delta.dr,
          col: cell.position.col + delta.dc,
        };
        // 이동 불가(벽/경계/장애물)면 제자리에 머뭄
        const intendedCell = gridWorld.cells[sPrime.row - 1]?.[sPrime.col - 1];
        let intendedKey = `${sPrime.row},${sPrime.col}`;
        if (!intendedCell || !intendedCell.isAccessible) {
          intendedKey = `${cell.position.row},${cell.position.col}`;
        }
        expected +=
          movementProbabilities.intendedDirection *
          (utilityValues.values.get(intendedKey) ?? 0);
        // Left turn
        const leftIdx = (a + DIRECTIONS.length - 1) % DIRECTIONS.length;
        const left = DIRECTIONS[leftIdx];
        const leftDelta = MOVEMENT_DELTAS[left as keyof typeof MOVEMENT_DELTAS];
        sPrime = {
          row: cell.position.row + leftDelta.dr,
          col: cell.position.col + leftDelta.dc,
        };
        const leftCell = gridWorld.cells[sPrime.row - 1]?.[sPrime.col - 1];
        let leftKey = `${sPrime.row},${sPrime.col}`;
        if (!leftCell || !leftCell.isAccessible)
          leftKey = `${cell.position.row},${cell.position.col}`;
        expected +=
          movementProbabilities.leftTurn *
          (utilityValues.values.get(leftKey) ?? 0);
        // Right turn
        const rightIdx = (a + 1) % DIRECTIONS.length;
        const right = DIRECTIONS[rightIdx];
        const rightDelta =
          MOVEMENT_DELTAS[right as keyof typeof MOVEMENT_DELTAS];
        sPrime = {
          row: cell.position.row + rightDelta.dr,
          col: cell.position.col + rightDelta.dc,
        };
        const rightCell = gridWorld.cells[sPrime.row - 1]?.[sPrime.col - 1];
        let rightKey = `${sPrime.row},${sPrime.col}`;
        if (!rightCell || !rightCell.isAccessible)
          rightKey = `${cell.position.row},${cell.position.col}`;
        expected +=
          movementProbabilities.rightTurn *
          (utilityValues.values.get(rightKey) ?? 0);
        expectedByDir[intended] = expected;
        if (expected > bestValue) {
          bestValue = expected;
          bestAction = intended;
        }
      }

      if (bestAction) {
        actions.set(`${cell.position.row},${cell.position.col}`, bestAction);
      }
    }
  }
  return {
    actions,
    isOptimal: false,
    lastUpdated: Date.now(),
  };
}
