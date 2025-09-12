import type { GridCell, GridWorld, TerminalState } from "@contracts/types";
import { describe, expect, it } from "vitest";

describe("GridWorld Contract", () => {
  it("should have correct dimensions and cell structure", () => {
    const grid: GridWorld = {
      dimensions: { width: 4, height: 3 },
      cells: [
        [
          {
            position: { row: 1, col: 1 },
            type: "start",
            isAccessible: true,
            reward: -0.04,
            utilityValue: 0,
          },
          {
            position: { row: 1, col: 2 },
            type: "normal",
            isAccessible: true,
            reward: -0.04,
            utilityValue: 0,
          },
          {
            position: { row: 1, col: 3 },
            type: "normal",
            isAccessible: true,
            reward: -0.04,
            utilityValue: 0,
          },
          {
            position: { row: 1, col: 4 },
            type: "normal",
            isAccessible: true,
            reward: -0.04,
            utilityValue: 0,
          },
        ],
        [
          {
            position: { row: 2, col: 1 },
            type: "normal",
            isAccessible: true,
            reward: -0.04,
            utilityValue: 0,
          },
          {
            position: { row: 2, col: 2 },
            type: "wall",
            isAccessible: false,
            reward: 0,
            utilityValue: 0,
          },
          {
            position: { row: 2, col: 3 },
            type: "normal",
            isAccessible: true,
            reward: -0.04,
            utilityValue: 0,
          },
          {
            position: { row: 2, col: 4 },
            type: "normal",
            isAccessible: true,
            reward: -0.04,
            utilityValue: 0,
          },
        ],
        [
          {
            position: { row: 3, col: 1 },
            type: "normal",
            isAccessible: true,
            reward: -0.04,
            utilityValue: 0,
          },
          {
            position: { row: 3, col: 2 },
            type: "normal",
            isAccessible: true,
            reward: -0.04,
            utilityValue: 0,
          },
          {
            position: { row: 3, col: 3 },
            type: "normal",
            isAccessible: true,
            reward: -0.04,
            utilityValue: 0,
          },
          {
            position: { row: 3, col: 4 },
            type: "terminal",
            isAccessible: true,
            reward: 1,
            utilityValue: 0,
          },
        ],
      ],
      startPosition: { row: 1, col: 1 },
      terminalStates: [
        { position: { row: 3, col: 4 }, reward: 1, type: "positive" },
        { position: { row: 2, col: 4 }, reward: -1, type: "negative" },
      ],
    };
    expect(grid.dimensions.width).toBe(4);
    expect(grid.dimensions.height).toBe(3);
    expect(grid.cells.length).toBe(3);
    expect(grid.cells[0].length).toBe(4);
    expect(grid.startPosition).toEqual({ row: 1, col: 1 });
    expect(grid.terminalStates.length).toBeGreaterThan(0);
  });
});
