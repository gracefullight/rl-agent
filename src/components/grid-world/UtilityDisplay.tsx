import { useAtom } from "jotai";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { gridWorldAtom } from "@/lib/grid-world";
import { policyAtom } from "@/lib/policy";
import { utilityValuesAtom } from "@/lib/value-iteration";

export const UtilityDisplay = () => {
  const [utilityValues] = useAtom(utilityValuesAtom);
  const [gridWorld] = useAtom(gridWorldAtom);
  return (
    <Card className="w-full max-w-lg mx-auto mt-4">
      <CardHeader>
        <CardTitle>Utility Values</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableCell className="w-16"></TableCell>
              {[...Array(gridWorld.dimensions.width)].map((_, colIdx) => {
                const colKey = `col-${colIdx + 1}`;
                return <TableCell key={colKey} className="text-center p-2 w-20">Col {colIdx + 1}</TableCell>;
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...gridWorld.cells]
              .slice()
              .reverse()
              .map((row, rIdx) => (
                <TableRow key={`row-${rIdx + 1}`}>
                  <TableCell className="w-16">
                    Row {gridWorld.dimensions.height - rIdx}
                  </TableCell>
                  {row.map((cell) => (
                    <TableCell
                      key={`cell-${cell.position.row}-${cell.position.col}`}
                      data-testid={`utility-display-${cell.position.row}-${cell.position.col}`}
                      className="text-center p-2 w-20"
                    >
                      <Badge
                        variant={
                          cell.type === "terminal" ? "destructive" : "default"
                        }
                        className="font-mono text-xs w-14 justify-center"
                      >
                        {(() => {
                          const value = utilityValues.values.get(`${cell.position.row},${cell.position.col}`);
                          if (value === undefined) return "0.00";
                          return value.toFixed(2);
                        })()}
                      </Badge>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export const PolicyDisplay = () => {
  const [policy] = useAtom(policyAtom);
  const [gridWorld] = useAtom(gridWorldAtom);

  const getArrowSymbol = (direction: string) => {
    switch (direction) {
      case "up": return "↑";
      case "down": return "↓";
      case "left": return "←";
      case "right": return "→";
      default: return "";
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto mt-4">
      <CardHeader>
        <CardTitle>Policy</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableCell className="w-16"></TableCell>
              {[...Array(gridWorld.dimensions.width)].map((_, colIdx) => {
                const colKey = `col-${colIdx + 1}`;
                return <TableCell key={colKey} className="text-center p-2 w-20">Col {colIdx + 1}</TableCell>;
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...gridWorld.cells]
              .slice()
              .reverse()
              .map((row, rIdx) => (
                <TableRow key={`row-${rIdx + 1}`}>
                  <TableCell className="w-16">
                    Row {gridWorld.dimensions.height - rIdx}
                  </TableCell>
                  {row.map((cell) => (
                    <TableCell
                      key={`cell-${cell.position.row}-${cell.position.col}`}
                      className="text-center p-2 w-20"
                    >
                      <div className="text-lg font-bold w-8 h-8 flex items-center justify-center mx-auto">
                        {getArrowSymbol(policy.actions.get(
                          `${cell.position.row},${cell.position.col}`,
                        ) ?? "")}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
