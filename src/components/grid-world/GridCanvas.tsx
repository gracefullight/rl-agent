"use client";
import type { GridCell, Position } from "@contracts/types";
import { useAtom } from "jotai";
import { memo, useCallback } from "react";
import { Group, Layer, Rect, Stage, Text } from "react-konva";
import { agentAtom } from "@/lib/agent";
import { gridWorldAtom } from "@/lib/grid-world";
import { policyAtom } from "@/lib/policy";
import { utilityValuesAtom } from "@/lib/value-iteration";

// Canvas size constants
const CELL_SIZE = 110;
const GRID_WIDTH = 4;
const GRID_HEIGHT = 3;
const STAGE_WIDTH = GRID_WIDTH * CELL_SIZE;
const STAGE_HEIGHT = GRID_HEIGHT * CELL_SIZE;

interface GridCellRectProps {
  cell: GridCell;
  onClick: (position: Position) => void;
}
const GridCellRect = memo(({ cell, onClick }: GridCellRectProps) => (
  <Rect
    x={(cell.position.col - 1) * CELL_SIZE}
    y={(GRID_HEIGHT - cell.position.row) * CELL_SIZE}
    width={CELL_SIZE}
    height={CELL_SIZE}
    fill={
      cell.type === "wall"
        ? "#888"
        : cell.type === "terminal"
          ? "#ffe066"
          : cell.type === "start"
            ? "#b2f2ff"
            : "#fff"
    }
    stroke="#222"
    strokeWidth={2}
    onClick={() => onClick(cell.position)}
    data-testid={`grid-cell-${cell.position.row}-${cell.position.col}`}
  />
));

interface AgentCircleProps {
  position: Position;
}
const AgentCircle = memo(({ position }: AgentCircleProps) => (
  <Group>
    <Rect
      x={(position.col - 1) * CELL_SIZE + 30}
      y={(GRID_HEIGHT - position.row) * CELL_SIZE + 30}
      width={CELL_SIZE - 60}
      height={CELL_SIZE - 60}
      fill="#228be6"
      cornerRadius={CELL_SIZE / 4}
      shadowBlur={8}
    />
  </Group>
));

const GridCanvasImpl = () => {
  const [gridWorld] = useAtom(gridWorldAtom);
  const [agent] = useAtom(agentAtom);
  const [utilityValues] = useAtom(utilityValuesAtom);
  const [policy] = useAtom(policyAtom);

  // Disable agent move on cell click (no-op)
  const handleCellClick = useCallback((_position: Position) => {
    // No action
  }, []);

  // Reverse the row order so (1,1) is bottom-left
  const reversedCells = [...gridWorld.cells].slice().reverse();
  return (
    <Stage
      width={STAGE_WIDTH}
      height={STAGE_HEIGHT}
      aria-label="Grid World Simulation"
      role="application"
    >
      <Layer>
        {/* Render grid cells + overlays */}
        {reversedCells.flat().map((cell) => {
          const key = `${cell.position.row},${cell.position.col}`;
          const policyDir = policy.actions.get(key);
          return (
            <Group key={key}>
              <GridCellRect cell={cell} onClick={handleCellClick} />
              {/* Utility value (center) */}
              <Text
                x={(cell.position.col - 1) * CELL_SIZE + 8}
                y={(GRID_HEIGHT - cell.position.row) * CELL_SIZE + 8}
                text={utilityValues.values.get(key)?.toFixed(2) ?? ""}
                fontSize={16}
                fill="#495057"
                fontStyle="bold"
                data-testid={`utility-display-${cell.position.row}-${cell.position.col}`}
              />
              {/* Reward (bottom left) */}
              <Text
                x={(cell.position.col - 1) * CELL_SIZE + 4}
                y={(GRID_HEIGHT - cell.position.row + 1) * CELL_SIZE - 18}
                text={`R: ${cell.reward}`}
                fontSize={12}
                fill="#888"
              />
              {/* Policy direction (top right) */}
              {policyDir && (
                <Text
                  x={cell.position.col * CELL_SIZE - 28}
                  y={(GRID_HEIGHT - cell.position.row) * CELL_SIZE + 4}
                  text={
                    policyDir === "up"
                      ? "↑"
                      : policyDir === "down"
                        ? "↓"
                        : policyDir === "left"
                          ? "←"
                          : policyDir === "right"
                            ? "→"
                            : ""
                  }
                  fontSize={18}
                  fill="#e8590c"
                  fontStyle="bold"
                />
              )}
            </Group>
          );
        })}
        {/* Render agent */}
        <AgentCircle position={agent.currentPosition} />
      </Layer>
    </Stage>
  );

  // (CycleCount component removed; should be defined in its own file)
};

export default GridCanvasImpl;
