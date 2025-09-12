import type { Agent, MovementProbabilities } from "@contracts/types";
import { describe, expect, it } from "vitest";

describe("Agent & MovementProbabilities Contract", () => {
  it("should have valid movement probabilities and agent state", () => {
    const movement: MovementProbabilities = {
      intendedDirection: 0.8,
      leftTurn: 0.1,
      rightTurn: 0.1,
      stayInPlace: 0.0,
    };
    expect(
      movement.intendedDirection +
        movement.leftTurn +
        movement.rightTurn +
        movement.stayInPlace,
    ).toBeCloseTo(1.0);
    expect(movement.intendedDirection).toBeGreaterThan(0);
    expect(movement.leftTurn).toBeGreaterThanOrEqual(0);
    expect(movement.rightTurn).toBeGreaterThanOrEqual(0);
    expect(movement.stayInPlace).toBeGreaterThanOrEqual(0);

    const agent: Agent = {
      currentPosition: { row: 1, col: 1 },
      movementProbabilities: movement,
      isAtTerminal: false,
      episodeSteps: 0,
    };
    expect(agent.currentPosition).toEqual({ row: 1, col: 1 });
    expect(agent.isAtTerminal).toBe(false);
    expect(agent.episodeSteps).toBe(0);
  });
});
