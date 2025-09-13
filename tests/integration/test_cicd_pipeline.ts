/**
 * Integration Test: Complete CI/CD Pipeline
 *
 * This test validates the end-to-end CI/CD pipeline functionality
 * including build, test, and deployment processes.
 */

import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { describe, expect, it } from "vitest";

interface WorkflowStep {
  name?: string;
  uses?: string;
  with?: Record<string, unknown>;
  run?: string;
  id?: string;
}

interface WorkflowJob {
  steps: WorkflowStep[];
  environment?: {
    name: string;
    url?: string;
  };
  outputs?: Record<string, string>;
}

interface Workflow {
  jobs: {
    build: WorkflowJob;
    deploy: WorkflowJob;
  };
}

describe("Complete CI/CD Pipeline Integration", () => {
  const workflowPath = path.join(process.cwd(), ".github/workflows/deploy.yml");

  it("should have complete workflow with all required steps", () => {
    // This test MUST FAIL until workflow is implemented
    const workflowContent = fs.readFileSync(workflowPath, "utf8");
    const workflow = yaml.load(workflowContent) as Workflow;

    // Build job should have all required steps
    const buildSteps = workflow.jobs.build.steps;
    expect(buildSteps.some((step) => step.uses?.includes("checkout"))).toBe(
      true,
    );
    expect(buildSteps.some((step) => step.uses?.includes("setup-node"))).toBe(
      true,
    );
    expect(buildSteps.some((step) => step.run?.includes("pnpm install"))).toBe(
      true,
    );
    expect(buildSteps.some((step) => step.run?.includes("pnpm test"))).toBe(
      true,
    );
    expect(buildSteps.some((step) => step.run?.includes("pnpm build"))).toBe(
      true,
    );
    expect(
      buildSteps.some((step) => step.uses?.includes("upload-pages-artifact")),
    ).toBe(true);
  });

  it("should configure Node.js 22 and pnpm caching", () => {
    // This test MUST FAIL until workflow is implemented
    const workflowContent = fs.readFileSync(workflowPath, "utf8");
    const workflow = yaml.load(workflowContent) as Workflow;

    const setupNodeStep = workflow.jobs.build.steps.find((step) =>
      step.uses?.includes("setup-node"),
    );

    expect(setupNodeStep?.with?.["node-version"]).toBe("22");
    expect(setupNodeStep?.with?.cache).toBe("pnpm");
  });

  it("should run tests before build", () => {
    // This test MUST FAIL until workflow is implemented
    const workflowContent = fs.readFileSync(workflowPath, "utf8");
    const workflow = yaml.load(workflowContent) as Workflow;

    const buildSteps = workflow.jobs.build.steps;
    const testStepIndex = buildSteps.findIndex((step) =>
      step.run?.includes("pnpm test"),
    );
    const buildStepIndex = buildSteps.findIndex((step) =>
      step.run?.includes("pnpm build"),
    );

    expect(testStepIndex).toBeLessThan(buildStepIndex);
    expect(testStepIndex).toBeGreaterThan(-1);
    expect(buildStepIndex).toBeGreaterThan(-1);
  });

  it("should have deploy job with Pages deployment", () => {
    // This test MUST FAIL until workflow is implemented
    const workflowContent = fs.readFileSync(workflowPath, "utf8");
    const workflow = yaml.load(workflowContent) as Workflow;

    const deployJob = workflow.jobs.deploy;
    expect(deployJob.environment?.name).toBe("github-pages");

    const deploySteps = deployJob.steps;
    expect(
      deploySteps.some((step) => step.uses?.includes("deploy-pages")),
    ).toBe(true);
  });
});
