import type { Policy, UtilityValues } from "@contracts/types";
import { describe, expect, it } from "vitest";

describe("UtilityValues & Policy Contract", () => {
  it("should have correct structure and default values", () => {
    const utilityValues: UtilityValues = {
      values: new Map(),
      previousValues: new Map(),
      iterationCount: 0,
      hasConverged: false,
      convergenceThreshold: 0.001,
    };
    expect(utilityValues.values).toBeInstanceOf(Map);
    expect(utilityValues.previousValues).toBeInstanceOf(Map);
    expect(utilityValues.iterationCount).toBe(0);
    expect(utilityValues.hasConverged).toBe(false);
    expect(utilityValues.convergenceThreshold).toBeCloseTo(0.001);

    const policy: Policy = {
      actions: new Map(),
      isOptimal: false,
      lastUpdated: Date.now(),
    };
    expect(policy.actions).toBeInstanceOf(Map);
    expect(typeof policy.isOptimal).toBe("boolean");
    expect(typeof policy.lastUpdated).toBe("number");
  });
});
