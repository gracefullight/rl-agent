import type {
  SimulationConfiguration,
  SimulationState,
} from "@contracts/types";
import { describe, expect, it } from "vitest";

describe("SimulationState & Configuration Contract", () => {
  it("should have correct structure and default values", () => {
    const state: SimulationState = {
      isRunning: false,
      isPaused: false,
      currentIteration: 0,
      maxIterations: 1000,
      iterationSpeed: 1,
      autoRun: false,
    };
    expect(state.isRunning).toBe(false);
    expect(state.isPaused).toBe(false);
    expect(state.currentIteration).toBe(0);
    expect(state.maxIterations).toBe(1000);
    expect(state.iterationSpeed).toBe(1);
    expect(state.autoRun).toBe(false);

    const config: SimulationConfiguration = {
      stepReward: -0.04,
      discountFactor: 1.0,
      algorithm: "value-iteration",
      maxIterations: 1000,
      convergenceThreshold: 0.001,
    };
    expect(config.stepReward).toBeCloseTo(-0.04);
    expect(config.discountFactor).toBeCloseTo(1.0);
    expect(config.algorithm).toBe("value-iteration");
    expect(config.maxIterations).toBe(1000);
    expect(config.convergenceThreshold).toBeCloseTo(0.001);
  });
});
