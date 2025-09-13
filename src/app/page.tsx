"use client";
import ControlPanel from "@/components/grid-world/ControlPanel";
import CycleCount from "@/components/grid-world/CycleCount";
import GridCanvas from "@/components/grid-world/GridCanvas";
import {
  PolicyDisplay,
  UtilityDisplay,
} from "@/components/grid-world/UtilityDisplay";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mt-8 mb-4 px-4 sm:px-6">
        Grid World Value Iteration Simulator
      </h1>
      <ControlPanel />
      <CycleCount />
      <div className="mt-6">
        <GridCanvas />
      </div>
      <div className="flex flex-col gap-6 mt-8 w-full max-w-4xl mx-auto px-4 md:flex-row md:gap-8 md:px-6">
        <UtilityDisplay />
        <PolicyDisplay />
      </div>
    </main>
  );
}
