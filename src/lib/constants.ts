import type { Direction } from "../../specs/001-4x3-1-1/contracts/types";

/**
 * Available directions for agent movement in the grid world.
 * Full 4-action model: up, right, down, left (clockwise from up)
 */
export const DIRECTIONS: Direction[] = ["up", "right", "down", "left"] as const;

/**
 * Movement deltas for each direction.
 * row delta: positive = up (towards higher row numbers), negative = down
 * col delta: negative = left, positive = right
 */
export const MOVEMENT_DELTAS: Record<
  "up" | "right" | "down" | "left",
  { dr: number; dc: number }
> = {
  up: { dr: 1, dc: 0 },
  right: { dr: 0, dc: 1 },
  down: { dr: -1, dc: 0 },
  left: { dr: 0, dc: -1 },
} as const;

/**
 * Actions with movement deltas for value iteration.
 */
export const ACTIONS = DIRECTIONS.map((direction) => ({
  name: direction,
  ...MOVEMENT_DELTAS[direction as keyof typeof MOVEMENT_DELTAS],
}));

/**
 * Default movement probabilities for stochastic movement model.
 */
export const DEFAULT_MOVEMENT_PROBABILITIES = {
  intended: 0.8,
  leftTurn: 0.1,
  rightTurn: 0.1,
} as const;
