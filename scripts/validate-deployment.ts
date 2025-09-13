#!/usr/bin/env tsx

/**
 * Deployment Validation Script
 *
 * Validates that the GitHub Pages deployment is working correctly
 * by checking URL accessibility, content integrity, and performance.
 */

import type { IncomingMessage } from "node:http";
import https from "node:https";
import { performance } from "node:perf_hooks";

const DEPLOYMENT_URL = "https://gracefullight.github.io/rl-agent/";
const TIMEOUT = 10000; // 10 seconds

interface HttpResponse {
  statusCode: number | undefined;
  headers: IncomingMessage["headers"];
  body: string;
}

interface ValidationResult {
  success: boolean;
  responseTime?: number;
  error?: string;
  issues?: string[];
}

interface PerformanceMetrics {
  responseTime: number;
  contentSize: number;
  hasGzip: boolean;
  hasCaching: boolean;
}

interface PerformanceResult extends ValidationResult {
  score?: number;
  metrics?: PerformanceMetrics;
}

/**
 * Make HTTP request with timeout
 */
function makeRequest(
  url: string,
  timeout: number = TIMEOUT,
): Promise<HttpResponse> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout }, (res) => {
      let data = "";
      res.on("data", (chunk: Buffer) => {
        data += chunk.toString();
      });
      res.on("end", () =>
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        }),
      );
    });

    req.on("timeout", () => {
      req.destroy();
      reject(new Error(`Request timeout after ${timeout}ms`));
    });

    req.on("error", reject);
  });
}

/**
 * Validate deployment URL accessibility
 */
async function validateUrlAccessibility(): Promise<ValidationResult> {
  console.log("🔍 Checking URL accessibility...");

  try {
    const startTime = performance.now();
    const response = await makeRequest(DEPLOYMENT_URL);
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    if (response.statusCode === 200) {
      console.log(`✅ URL accessible (${Math.round(responseTime)}ms)`);
      return { success: true, responseTime };
    } else {
      console.log(`❌ Unexpected status code: ${response.statusCode}`);
      return { success: false, error: `Status ${response.statusCode}` };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`❌ URL not accessible: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

/**
 * Validate HTML content integrity
 */
async function validateContentIntegrity(): Promise<ValidationResult> {
  console.log("🔍 Checking content integrity...");

  try {
    const response = await makeRequest(DEPLOYMENT_URL);
    const html = response.body;

    // Check for essential elements
    const checks = [
      { name: "HTML structure", test: html.includes("<!DOCTYPE html>") },
      { name: "Title tag", test: html.includes("<title>") },
      {
        name: "React root",
        test: html.includes('id="__next"') || html.includes('id="root"'),
      },
      { name: "Next.js scripts", test: html.includes("_next/static") },
      { name: "Base path assets", test: html.includes("/rl-agent/") },
    ];

    const failed = checks.filter((check) => !check.test);

    if (failed.length === 0) {
      console.log("✅ Content integrity verified");
      return { success: true };
    } else {
      console.log(
        `❌ Content integrity issues: ${failed.map((f) => f.name).join(", ")}`,
      );
      return { success: false, issues: failed.map((f) => f.name) };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`❌ Content validation failed: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

/**
 * Validate performance metrics
 */
async function validatePerformance(): Promise<PerformanceResult> {
  console.log("🔍 Checking performance metrics...");

  try {
    const startTime = performance.now();
    const response = await makeRequest(DEPLOYMENT_URL);
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    const metrics: PerformanceMetrics = {
      responseTime: Math.round(responseTime),
      contentSize: response.body.length,
      hasGzip: response.headers["content-encoding"] === "gzip",
      hasCaching: response.headers["cache-control"] !== undefined,
    };

    console.log(`📊 Performance metrics:`);
    console.log(`   Response time: ${metrics.responseTime}ms`);
    console.log(
      `   Content size: ${(metrics.contentSize / 1024).toFixed(1)}KB`,
    );
    console.log(`   Compression: ${metrics.hasGzip ? "Yes" : "No"}`);
    console.log(`   Caching headers: ${metrics.hasCaching ? "Yes" : "No"}`);

    const performanceScore = calculatePerformanceScore(metrics);

    if (performanceScore >= 80) {
      console.log(`✅ Performance acceptable (${performanceScore}/100)`);
      return { success: true, score: performanceScore, metrics };
    } else {
      console.log(`⚠️ Performance needs improvement (${performanceScore}/100)`);
      return { success: false, score: performanceScore, metrics };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`❌ Performance validation failed: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

/**
 * Calculate performance score
 */
function calculatePerformanceScore(metrics: PerformanceMetrics): number {
  let score = 100;

  // Response time penalty
  if (metrics.responseTime > 3000) score -= 30;
  else if (metrics.responseTime > 2000) score -= 20;
  else if (metrics.responseTime > 1000) score -= 10;

  // Content size penalty
  if (metrics.contentSize > 500000)
    score -= 20; // >500KB
  else if (metrics.contentSize > 200000) score -= 10; // >200KB

  // Bonus for optimizations
  if (metrics.hasGzip) score += 10;
  if (metrics.hasCaching) score += 10;

  return Math.max(0, Math.min(100, score));
}

/**
 * Main validation function
 */
async function validateDeployment(): Promise<void> {
  console.log("🚀 Starting deployment validation...\n");

  const results = {
    accessibility: await validateUrlAccessibility(),
    integrity: await validateContentIntegrity(),
    performance: await validatePerformance(),
  };

  console.log("\n📋 Validation Summary:");
  console.log(
    `   URL Accessibility: ${results.accessibility.success ? "✅" : "❌"}`,
  );
  console.log(
    `   Content Integrity: ${results.integrity.success ? "✅" : "❌"}`,
  );
  console.log(`   Performance: ${results.performance.success ? "✅" : "⚠️"}`);

  const overallSuccess =
    results.accessibility.success &&
    results.integrity.success &&
    results.performance.success;

  if (overallSuccess) {
    console.log("\n🎉 Deployment validation PASSED!");
    process.exit(0);
  } else {
    console.log("\n💥 Deployment validation FAILED!");
    console.log("Please check the issues above and redeploy.");
    process.exit(1);
  }
}

// Run validation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  validateDeployment().catch((error) => {
    console.error("💥 Validation script error:", error);
    process.exit(1);
  });
}

export { validateDeployment };
