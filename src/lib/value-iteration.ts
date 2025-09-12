import type { GridCell, GridWorld, UtilityValues } from "@contracts/types";
import { atom } from "jotai";
import { ACTIONS, DEFAULT_MOVEMENT_PROBABILITIES } from "./constants";

/**
 * Computes Q(s, a) for all actions in a given cell.
 * Returns a map: action name -> Q-value
 */
export function computeQValues(
  cell: GridCell,
  utilityValues: UtilityValues,
  gridWorld: GridWorld,
  discountFactor: number,
): Record<string, number> {
  const qValues: Record<string, number> = {};
  for (let a = 0; a < ACTIONS.length; a++) {
    let expected = 0;
    // Intended direction
    const intended = ACTIONS[a];
    let sPrime = {
      row: cell.position.row + intended.dr,
      col: cell.position.col + intended.dc,
    };
    let intendedKey = `${sPrime.row},${sPrime.col}`;
    const intendedCell = gridWorld.cells[sPrime.row - 1]?.[sPrime.col - 1];
    if (!intendedCell || !intendedCell.isAccessible)
      intendedKey = `${cell.position.row},${cell.position.col}`;
    expected +=
      DEFAULT_MOVEMENT_PROBABILITIES.intended *
      (utilityValues.values.get(intendedKey) ?? 0);
    // Left turn
    const leftIdx = (a + ACTIONS.length - 1) % ACTIONS.length;
    const left = ACTIONS[leftIdx];
    sPrime = {
      row: cell.position.row + left.dr,
      col: cell.position.col + left.dc,
    };
    let leftKey = `${sPrime.row},${sPrime.col}`;
    const leftCell = gridWorld.cells[sPrime.row - 1]?.[sPrime.col - 1];
    if (!leftCell || !leftCell.isAccessible)
      leftKey = `${cell.position.row},${cell.position.col}`;
    expected +=
      DEFAULT_MOVEMENT_PROBABILITIES.leftTurn *
      (utilityValues.values.get(leftKey) ?? 0);
    // Right turn
    const rightIdx = (a + 1) % ACTIONS.length;
    const right = ACTIONS[rightIdx];
    sPrime = {
      row: cell.position.row + right.dr,
      col: cell.position.col + right.dc,
    };
    let rightKey = `${sPrime.row},${sPrime.col}`;
    const rightCell = gridWorld.cells[sPrime.row - 1]?.[sPrime.col - 1];
    if (!rightCell || !rightCell.isAccessible)
      rightKey = `${cell.position.row},${cell.position.col}`;
    expected +=
      DEFAULT_MOVEMENT_PROBABILITIES.rightTurn *
      (utilityValues.values.get(rightKey) ?? 0);
    qValues[ACTIONS[a].name] = cell.reward + discountFactor * expected;
  }
  return qValues;
}

/**
 * Creates the initial utility values object for the grid world.
 * @returns {UtilityValues} The initialized utility values
 */
export function createInitialUtilityValues(): UtilityValues {
  return {
    values: new Map(),
    previousValues: new Map(),
    iterationCount: 0,
    hasConverged: false,
    convergenceThreshold: 0.001,
  };
}

/**
 * Jotai atom holding the current utility values state.
 */
export const utilityValuesAtom = atom<UtilityValues>(
  createInitialUtilityValues(),
);

/**
 * Performs a single value iteration step using the Bellman update equation.
 * @param utilityValues The current utility values
 * @param gridWorld The grid world object (should be GridWorld)
 * @param discountFactor The discount factor (gamma)
 * @returns {UtilityValues} The updated utility values after one iteration
 */
export function valueIterationStep(
  utilityValues: UtilityValues,
  gridWorld: GridWorld,
  discountFactor: number,
): UtilityValues {
  // Bellman update: V(s) = R(s) + gamma * max_a Σ P(s'|s,a) * V(s')
  const newValues = new Map<string, number>();
  let deltaMax = 0;
  for (const row of gridWorld.cells) {
    for (const cell of row) {
      const key = `${cell.position.row},${cell.position.col}`;
      if (!cell.isAccessible || cell.type === "wall") {
        newValues.set(key, 0);
        continue;
      }
      if (cell.type === "terminal") {
        newValues.set(key, cell.reward);
        continue;
      }
      // For each action, compute expected utility
      let maxUtility = -Infinity;
      for (let a = 0; a < ACTIONS.length; a++) {
        let expected = 0;
        // Intended direction
        const intended = ACTIONS[a];
        let sPrime = {
          row: cell.position.row + intended.dr,
          col: cell.position.col + intended.dc,
        };
        let intendedKey = `${sPrime.row},${sPrime.col}`;
        const intendedCell = gridWorld.cells[sPrime.row - 1]?.[sPrime.col - 1];
        if (!intendedCell || !intendedCell.isAccessible) intendedKey = key;
        expected +=
          DEFAULT_MOVEMENT_PROBABILITIES.intended *
          (utilityValues.values.get(intendedKey) ?? 0);
        // Left turn
        const leftIdx = (a + ACTIONS.length - 1) % ACTIONS.length;
        const left = ACTIONS[leftIdx];
        sPrime = {
          row: cell.position.row + left.dr,
          col: cell.position.col + left.dc,
        };
        let leftKey = `${sPrime.row},${sPrime.col}`;
        const leftCell = gridWorld.cells[sPrime.row - 1]?.[sPrime.col - 1];
        if (!leftCell || !leftCell.isAccessible) leftKey = key;
        expected +=
          DEFAULT_MOVEMENT_PROBABILITIES.leftTurn *
          (utilityValues.values.get(leftKey) ?? 0);
        // Right turn
        const rightIdx = (a + 1) % ACTIONS.length;
        const right = ACTIONS[rightIdx];
        sPrime = {
          row: cell.position.row + right.dr,
          col: cell.position.col + right.dc,
        };
        let rightKey = `${sPrime.row},${sPrime.col}`;
        const rightCell = gridWorld.cells[sPrime.row - 1]?.[sPrime.col - 1];
        if (!rightCell || !rightCell.isAccessible) rightKey = key;
        expected +=
          DEFAULT_MOVEMENT_PROBABILITIES.rightTurn *
          (utilityValues.values.get(rightKey) ?? 0);
        maxUtility = Math.max(maxUtility, expected);
      }
      const updated = cell.reward + discountFactor * maxUtility;
      newValues.set(key, updated);
      const prev = utilityValues.values.get(key) ?? 0;
      deltaMax = Math.max(deltaMax, Math.abs(updated - prev));
    }
  }
  return {
    ...utilityValues,
    previousValues: utilityValues.values,
    values: newValues,
    iterationCount: (utilityValues.iterationCount ?? 0) + 1,
    hasConverged: deltaMax < (utilityValues.convergenceThreshold ?? 0.001),
  };
}
