import { atom } from "jotai";
import { agentAtom, moveAgent } from "./agent";
import { DIRECTIONS } from "./constants";
import { gridWorldAtom } from "./grid-world";
import { policyAtom } from "./policy";
import { simulationConfigAtom, simulationStateAtom } from "./simulation";
import { utilityValuesAtom, valueIterationStep } from "./value-iteration";

// Atom to perform a single simulation step (value iteration + agent update)
export const simulationStepAtom = atom(null, (get, set) => {
  const gridWorld = get(gridWorldAtom);
  const utilityValues = get(utilityValuesAtom);
  const config = get(simulationConfigAtom);
  const agent = get(agentAtom);
  if (agent.isAtTerminal) {
    // Do nothing if agent is at terminal state
    return;
  }
  // Perform value iteration step
  const newUtilityValues = valueIterationStep(
    utilityValues,
    gridWorld,
    config.discountFactor,
  );
  set(utilityValuesAtom, newUtilityValues);

  // Extract and update policy atom so PolicyDisplay is always up to date
  const { extractPolicy } = require("./policy");
  const newPolicy = extractPolicy(
    newUtilityValues,
    gridWorld,
    agent.movementProbabilities,
    config.discountFactor,
  );
  set(policyAtom, newPolicy);

  // Get current state key
  const posKey = `${agent.currentPosition.row},${agent.currentPosition.col}`;
  const action = newPolicy.actions.get(posKey);
  if (!action) return;
  // Sample movement according to stochastic model
  const rand = Math.random();
  let chosenDir = action;
  const dirs = DIRECTIONS;
  const idx = dirs.indexOf(action);
  const left = dirs[(idx + 3) % 4];
  const right = dirs[(idx + 1) % 4];
  const { intendedDirection, leftTurn } = agent.movementProbabilities;
  if (rand < intendedDirection) {
    chosenDir = action;
  } else if (rand < intendedDirection + leftTurn) {
    chosenDir = left;
  } else {
    chosenDir = right;
  }
  // Move agent
  const isAccessible = (pos: { row: number; col: number }) => {
    const cell = gridWorld.cells[pos.row - 1]?.[pos.col - 1];
    return !!cell && cell.isAccessible;
  };
  const newAgent = moveAgent(agent, chosenDir, isAccessible);
  // Check if at terminal
  const cell =
    gridWorld.cells[newAgent.currentPosition.row - 1][
      newAgent.currentPosition.col - 1
    ];
  newAgent.isAtTerminal = cell.type === "terminal";
  set(agentAtom, newAgent);
});

// Atom to reset the simulation state
export const simulationResetAtom = atom(null, (get, set) => {
  set(utilityValuesAtom, {
    ...get(utilityValuesAtom),
    values: new Map(),
    previousValues: new Map(),
    iterationCount: 0,
    hasConverged: false,
  });
  set(agentAtom, {
    ...get(agentAtom),
    currentPosition: { row: 1, col: 1 },
    isAtTerminal: false,
    episodeSteps: 0,
  });
  set(simulationStateAtom, {
    ...get(simulationStateAtom),
    isRunning: false,
    isPaused: false,
    currentIteration: 0,
  });
  // Policy도 초기화
  const { createInitialPolicy } = require("./policy");
  set(policyAtom, createInitialPolicy());
});

/**
 * Collection of all Jotai atoms used for state management in the simulator.
 */
export const atoms = {
  gridWorldAtom,
  agentAtom,
  utilityValuesAtom,
  policyAtom,
  simulationStateAtom,
  simulationConfigAtom,
  simulationStepAtom,
  simulationResetAtom,
};
