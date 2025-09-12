
import { useAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { agentAtom } from "@/lib/agent";
import { simulationResetAtom, simulationStepAtom } from "@/lib/atoms";
import { simulationConfigAtom } from "@/lib/simulation";

const ControlPanel = () => {
  const [config, setConfig] = useAtom(simulationConfigAtom);
  const [, runSimulationStep] = useAtom(simulationStepAtom);
  const [, resetSimulation] = useAtom(simulationResetAtom);
  const [agent] = useAtom(agentAtom);

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="step-reward">Step Reward</Label>
          <span className="font-mono text-sm text-primary">{config.stepReward.toFixed(2)}</span>
        </div>
        <Slider
          min={-0.1}
          max={0.1}
          step={0.001}
          value={[config.stepReward]}
          onValueChange={([v]) => setConfig({ ...config, stepReward: v })}
          className="[&_[data-slot=slider-thumb]]:bg-primary [&_[data-slot=slider-track]]:bg-gray-200 [&_[data-slot=slider-range]]:bg-primary"
        />
        <div className="flex items-center gap-2">
          <Label htmlFor="discount">Discount Factor</Label>
          <span className="font-mono text-sm text-primary">{config.discountFactor.toFixed(2)}</span>
        </div>
        <Slider
          min={0.5}
          max={1.0}
          step={0.001}
          value={[config.discountFactor]}
          onValueChange={([v]) => setConfig({ ...config, discountFactor: v })}
          className="[&_[data-slot=slider-thumb]]:bg-primary [&_[data-slot=slider-track]]:bg-gray-200 [&_[data-slot=slider-range]]:bg-primary"
        />
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          onClick={runSimulationStep}
          data-testid="iterate-button"
          variant="default"
          className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
          disabled={agent.isAtTerminal}
        >
          {agent.isAtTerminal ? "Terminal Reached" : "Iterate"}
        </Button>
        <Button variant="destructive" onClick={resetSimulation} data-testid="reset-button" className="bg-red-600 text-white hover:bg-red-700 border border-red-700 cursor-pointer">
          Reset
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ControlPanel;
