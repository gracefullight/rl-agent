import { useAtom } from "jotai";
import { utilityValuesAtom } from "@/lib/value-iteration";

const CycleCount = () => {
  const [utilityValues] = useAtom(utilityValuesAtom);
  return (
    <div className="text-center mt-2 text-sm text-gray-700">
      Cycle Count: <span className="font-mono font-bold">{utilityValues.iterationCount}</span>
    </div>
  );
};

export default CycleCount;
