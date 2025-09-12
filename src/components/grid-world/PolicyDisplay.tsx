import type { GridWorld, Policy } from "@contracts/types";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PolicyDisplayProps {
  policy: Policy;
  gridWorld: GridWorld;
}

export const PolicyDisplay: React.FC<PolicyDisplayProps> = ({
  policy,
  gridWorld,
}) => {
  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-2">Policy</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Row</TableHead>
            <TableHead>Col</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gridWorld.cells.flat().map((cell) => {
            const action = policy.actions.get(
              `${cell.position.row},${cell.position.col}`,
            );
            return (
              <TableRow key={`${cell.position.row}-${cell.position.col}`}>
                <TableCell>{cell.position.row}</TableCell>
                <TableCell>{cell.position.col}</TableCell>
                <TableCell>
                  {action ? (
                    <Badge>{action}</Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
