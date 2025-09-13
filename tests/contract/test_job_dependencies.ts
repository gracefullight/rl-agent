/**
 * Contract Test: GitHub Actions Job Dependencies
 *
 * This test validates that the workflow jobs are properly structured
 * with correct dependencies and execution order.
 */

import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { describe, expect, it } from "vitest";

interface WorkflowJob {
  "runs-on": string;
  needs?: string;
  steps: Array<{
    name?: string;
    uses?: string;
    with?: Record<string, unknown>;
    run?: string;
  }>;
}

interface WorkflowPermissions {
  contents: string;
  pages: string;
  "id-token": string;
}

interface Workflow {
  jobs: {
    build: WorkflowJob;
    deploy: WorkflowJob;
  };
  permissions: WorkflowPermissions;
}

describe("GitHub Actions Job Dependencies Contract", () => {
  const workflowPath = path.join(process.cwd(), ".github/workflows/deploy.yml");

  it("should have build and deploy jobs", () => {
    // This test MUST FAIL until workflow is implemented
    const workflowContent = fs.readFileSync(workflowPath, "utf8");
    const workflow = yaml.load(workflowContent) as Workflow;

    expect(workflow.jobs.build).toBeDefined();
    expect(workflow.jobs.deploy).toBeDefined();
  });

  it("should have deploy job depend on build job", () => {
    // This test MUST FAIL until workflow is implemented
    const workflowContent = fs.readFileSync(workflowPath, "utf8");
    const workflow = yaml.load(workflowContent) as Workflow;

    expect(workflow.jobs.deploy.needs).toBe("build");
  });

  it("should use ubuntu-latest runner for both jobs", () => {
    // This test MUST FAIL until workflow is implemented
    const workflowContent = fs.readFileSync(workflowPath, "utf8");
    const workflow = yaml.load(workflowContent) as Workflow;

    expect(workflow.jobs.build["runs-on"]).toBe("ubuntu-latest");
    expect(workflow.jobs.deploy["runs-on"]).toBe("ubuntu-latest");
  });

  it("should have correct permissions for Pages deployment", () => {
    // This test MUST FAIL until workflow is implemented
    const workflowContent = fs.readFileSync(workflowPath, "utf8");
    const workflow = yaml.load(workflowContent) as Workflow;

    expect(workflow.permissions.contents).toBe("read");
    expect(workflow.permissions.pages).toBe("write");
    expect(workflow.permissions["id-token"]).toBe("write");
  });
});
