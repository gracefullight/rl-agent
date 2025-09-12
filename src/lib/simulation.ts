import type {
  SimulationConfiguration,
  SimulationState,
} from "@contracts/types";
import { atom } from "jotai";

/**
 * Creates the initial simulation state for the simulator UI.
 * @returns {SimulationState} The initialized simulation state
 */
export function createInitialSimulationState(): SimulationState {
  return {
    isRunning: false,
    isPaused: false,
    currentIteration: 0,
    maxIterations: 1000,
    iterationSpeed: 1,
    autoRun: false,
  };
}

/**
 * Creates the initial simulation configuration for the simulator UI.
 * @returns {SimulationConfiguration} The initialized simulation configuration
 */
export function createInitialSimulationConfig(): SimulationConfiguration {
  return {
    stepReward: -0.04,
    discountFactor: 1.0,
    algorithm: "value-iteration",
    maxIterations: 1000,
    convergenceThreshold: 0.001,
  };
}

/**
 * Jotai atom holding the current simulation state (running, paused, etc).
 */
export const simulationStateAtom = atom<SimulationState>(
  createInitialSimulationState(),
);

/**
 * Jotai atom holding the current simulation configuration (step reward, discount, etc).
 */
export const simulationConfigAtom = atom<SimulationConfiguration>(
  createInitialSimulationConfig(),
);
