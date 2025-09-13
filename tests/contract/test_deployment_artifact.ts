/**
 * Contract Test: Deployment Artifact Validation
 *
 * This test validates that the build process creates the correct
 * deployment artifacts with proper structure and content.
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
}

interface Workflow {
  jobs: {
    build: WorkflowJob;
    deploy: WorkflowJob;
  };
}

describe("Deployment Artifact Contract", () => {
  const workflowPath = path.join(process.cwd(), ".github/workflows/deploy.yml");
  const outputPath = path.join(process.cwd(), "out");

  it("should configure artifact upload in workflow", () => {
    // This test MUST FAIL until workflow is implemented
    const workflowContent = fs.readFileSync(workflowPath, "utf8");
    const workflow = yaml.load(workflowContent) as Workflow;

    const buildSteps = workflow.jobs.build.steps;
    const uploadStep = buildSteps.find((step) =>
      step.uses?.includes("upload-pages-artifact"),
    );

    expect(uploadStep).toBeDefined();
    expect(uploadStep?.with?.path).toBe("./out");
  });

  it("should create out directory after build", () => {
    // This test MUST FAIL until build process creates output
    // Note: This will be tested after build implementation
    expect(fs.existsSync(outputPath)).toBe(true);
  });

  it("should have index.html in output directory", () => {
    // This test MUST FAIL until build process creates output
    const indexPath = path.join(outputPath, "index.html");
    expect(fs.existsSync(indexPath)).toBe(true);
  });

  it("should have _next directory with static assets", () => {
    // This test MUST FAIL until build process creates output
    const nextPath = path.join(outputPath, "_next");
    expect(fs.existsSync(nextPath)).toBe(true);
  });

  it("should configure deploy job to use artifact", () => {
    // This test MUST FAIL until workflow is implemented
    const workflowContent = fs.readFileSync(workflowPath, "utf8");
    const workflow = yaml.load(workflowContent) as Workflow;

    const deploySteps = workflow.jobs.deploy.steps;
    const deployStep = deploySteps.find((step) =>
      step.uses?.includes("deploy-pages"),
    );

    expect(deployStep).toBeDefined();
  });
});
