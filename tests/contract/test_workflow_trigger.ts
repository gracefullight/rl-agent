/**
 * Contract Test: GitHub Actions Workflow Trigger Validation
 *
 * This test validates that the GitHub Actions workflow is configured
 * to trigger only on push events to the main branch and ignores
 * documentation-only changes.
 */

import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { describe, expect, it } from "vitest";

interface WorkflowTrigger {
  push: {
    branches: string[];
    "paths-ignore": string[];
  };
  pull_request?: unknown;
}

interface Workflow {
  on: WorkflowTrigger;
}

describe("GitHub Actions Workflow Trigger Contract", () => {
  const workflowPath = path.join(process.cwd(), ".github/workflows/deploy.yml");

  it("should have deploy.yml workflow file", () => {
    // This test MUST FAIL until workflow is implemented
    expect(fs.existsSync(workflowPath)).toBe(true);
  });

  it("should trigger only on push to main branch", () => {
    // This test MUST FAIL until workflow is implemented
    const workflowContent = fs.readFileSync(workflowPath, "utf8");
    const workflow = yaml.load(workflowContent) as Workflow;

    expect(workflow.on.push.branches).toEqual(["main"]);
  });

  it("should ignore documentation changes", () => {
    // This test MUST FAIL until workflow is implemented
    const workflowContent = fs.readFileSync(workflowPath, "utf8");
    const workflow = yaml.load(workflowContent) as Workflow;

    expect(workflow.on.push["paths-ignore"]).toContain("**.md");
    expect(workflow.on.push["paths-ignore"]).toContain("docs/**");
  });

  it("should not trigger on pull requests", () => {
    // This test MUST FAIL until workflow is implemented
    const workflowContent = fs.readFileSync(workflowPath, "utf8");
    const workflow = yaml.load(workflowContent) as Workflow;

    expect(workflow.on.pull_request).toBeUndefined();
  });
});
