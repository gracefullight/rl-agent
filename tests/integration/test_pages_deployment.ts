/**
 * Integration Test: GitHub Pages Deployment
 *
 * This test validates that the deployment process correctly
 * configures and deploys to GitHub Pages environment.
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

interface PackageJson {
  scripts: Record<string, string>;
}

interface Workflow {
  name: string;
  jobs: {
    deploy: WorkflowJob;
  };
}

describe("GitHub Pages Deployment Integration", () => {
  const workflowPath = path.join(process.cwd(), ".github/workflows/deploy.yml");
  const packagePath = path.join(process.cwd(), "package.json");

  it("should configure Pages environment correctly", () => {
    // This test MUST FAIL until workflow is implemented
    const workflowContent = fs.readFileSync(workflowPath, "utf8");
    const workflow = yaml.load(workflowContent) as Workflow;

    const deployJob = workflow.jobs.deploy;
    expect(deployJob.environment?.name).toBe("github-pages");
    const expectedUrl = "$" + "{{ steps.deployment.outputs.page_url }}";
    expect(deployJob.environment?.url).toBe(expectedUrl);
  });

  it("should have build script for static export", () => {
    // This test MUST FAIL until package.json is updated
    const packageContent = fs.readFileSync(packagePath, "utf8");
    const packageJson: PackageJson = JSON.parse(packageContent);

    expect(packageJson.scripts.build).toBeDefined();
    expect(packageJson.scripts.build).toContain("next build");
  });

  it("should setup Pages deployment with correct steps", () => {
    // This test MUST FAIL until workflow is implemented
    const workflowContent = fs.readFileSync(workflowPath, "utf8");
    const workflow = yaml.load(workflowContent) as Workflow;

    const deploySteps = workflow.jobs.deploy.steps;

    // Should have deployment step with correct ID
    const deploymentStep = deploySteps.find(
      (step) => step.uses?.includes("deploy-pages") && step.id === "deployment",
    );
    expect(deploymentStep).toBeDefined();
  });

  it("should output deployment URL", () => {
    // This test MUST FAIL until workflow is implemented
    const workflowContent = fs.readFileSync(workflowPath, "utf8");
    const workflow = yaml.load(workflowContent) as Workflow;

    const deployJob = workflow.jobs.deploy;
    const expectedOutput = "$" + "{{ steps.deployment.outputs.page_url }}";
    expect(deployJob.outputs?.page_url).toBe(expectedOutput);
  });

  it("should have correct workflow name and description", () => {
    // This test MUST FAIL until workflow is implemented
    const workflowContent = fs.readFileSync(workflowPath, "utf8");
    const workflow = yaml.load(workflowContent) as Workflow;

    expect(workflow.name).toBeDefined();
    expect(workflow.name).toContain("Deploy");
  });

  it("should run in github-pages environment only", () => {
    // This test MUST FAIL until workflow is implemented
    const workflowContent = fs.readFileSync(workflowPath, "utf8");
    const workflow = yaml.load(workflowContent) as Workflow;

    const deployJob = workflow.jobs.deploy;
    expect(deployJob.environment?.name).toBe("github-pages");
  });
});
