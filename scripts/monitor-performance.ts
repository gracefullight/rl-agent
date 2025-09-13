#!/usr/bin/env tsx

/**
 * Performance Monitoring Script
 *
 * Monitors the performance of the deployed RL Agent application
 * including Core Web Vitals, loading times, and resource metrics.
 */

import type { IncomingMessage } from "node:http";
import https from "node:https";
import { performance } from "node:perf_hooks";

const DEPLOYMENT_URL = "https://gracefullight.github.io/rl-agent/";
const MONITORING_INTERVAL = 60000; // 1 minute
const SAMPLE_COUNT = 5;

interface Threshold {
  good: number;
  needsImprovement: number;
}

interface Thresholds {
  loadTime: Threshold;
  contentSize: Threshold;
  responseTime: Threshold;
}

/**
 * Performance thresholds based on Core Web Vitals
 */
const THRESHOLDS: Thresholds = {
  loadTime: {
    good: 2500, // 2.5s
    needsImprovement: 4000, // 4s
  },
  contentSize: {
    good: 200000, // 200KB
    needsImprovement: 500000, // 500KB
  },
  responseTime: {
    good: 1000, // 1s
    needsImprovement: 2000, // 2s
  },
};

interface PageLoadMetrics {
  totalTime: number;
  firstByteTime: number;
  contentSize: number;
  statusCode: number | undefined;
  headers: IncomingMessage["headers"];
}

type PerformanceCategory = "good" | "needsImprovement" | "poor";

interface PerformanceAnalysis {
  loadTime: PerformanceCategory;
  responseTime: PerformanceCategory;
  contentSize: PerformanceCategory;
  overall: PerformanceCategory;
}

interface FormattedMetrics {
  timestamp: string;
  loadTime: string;
  firstByte: string;
  contentSize: string;
  overall: string;
  statusCode: number | undefined;
}

interface MonitoringSample {
  raw?: PageLoadMetrics;
  analysis?: PerformanceAnalysis;
  formatted?: FormattedMetrics;
  error?: string;
}

interface AverageMetrics {
  totalTime: number;
  firstByteTime: number;
  contentSize: number;
  successRate: number;
}

interface MonitoringReport {
  status: PerformanceCategory | "failed";
  timestamp: string;
  averages?: AverageMetrics;
  samples: number;
  successRate: number;
}

/**
 * Make performance-focused HTTP request
 */
function measurePageLoad(): Promise<PageLoadMetrics> {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    let firstByteTime: number | null = null;
    let totalSize = 0;

    const req = https.get(DEPLOYMENT_URL, (res) => {
      firstByteTime = performance.now();

      res.on("data", (chunk: Buffer) => {
        totalSize += chunk.length;
      });

      res.on("end", () => {
        const endTime = performance.now();
        resolve({
          totalTime: endTime - startTime,
          firstByteTime: (firstByteTime ?? startTime) - startTime,
          contentSize: totalSize,
          statusCode: res.statusCode,
          headers: res.headers,
        });
      });
    });

    req.on("error", reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });
  });
}

/**
 * Analyze performance metrics
 */
function analyzeMetrics(metrics: PageLoadMetrics): PerformanceAnalysis {
  const analysis: PerformanceAnalysis = {
    loadTime: categorizeMetric(metrics.totalTime, THRESHOLDS.loadTime),
    responseTime: categorizeMetric(
      metrics.firstByteTime,
      THRESHOLDS.responseTime,
    ),
    contentSize: categorizeMetric(metrics.contentSize, THRESHOLDS.contentSize),
    overall: "good",
  };

  // Determine overall performance
  const categories = [
    analysis.loadTime,
    analysis.responseTime,
    analysis.contentSize,
  ];
  if (categories.some((a) => a === "poor")) {
    analysis.overall = "poor";
  } else if (categories.some((a) => a === "needsImprovement")) {
    analysis.overall = "needsImprovement";
  }

  return analysis;
}

/**
 * Categorize metric based on thresholds
 */
function categorizeMetric(
  value: number,
  threshold: Threshold,
): PerformanceCategory {
  if (value <= threshold.good) return "good";
  if (value <= threshold.needsImprovement) return "needsImprovement";
  return "poor";
}

/**
 * Format metrics for display
 */
function formatMetrics(
  metrics: PageLoadMetrics,
  analysis: PerformanceAnalysis,
): FormattedMetrics {
  const formatSize = (bytes: number): string =>
    `${(bytes / 1024).toFixed(1)}KB`;
  const formatTime = (ms: number): string => `${Math.round(ms)}ms`;
  const getIcon = (category: PerformanceCategory): string => {
    switch (category) {
      case "good":
        return "🟢";
      case "needsImprovement":
        return "🟡";
      case "poor":
        return "🔴";
      default:
        return "⚪";
    }
  };

  return {
    timestamp: new Date().toISOString(),
    loadTime: `${getIcon(analysis.loadTime)} ${formatTime(metrics.totalTime)}`,
    firstByte: `${getIcon(analysis.responseTime)} ${formatTime(metrics.firstByteTime)}`,
    contentSize: `${getIcon(analysis.contentSize)} ${formatSize(metrics.contentSize)}`,
    overall: `${getIcon(analysis.overall)} ${analysis.overall.toUpperCase()}`,
    statusCode: metrics.statusCode,
  };
}

/**
 * Run performance monitoring sample
 */
async function runMonitoringSample(): Promise<MonitoringSample[]> {
  console.log("📊 Running performance monitoring...");

  const samples: MonitoringSample[] = [];

  for (let i = 0; i < SAMPLE_COUNT; i++) {
    try {
      console.log(`   Sample ${i + 1}/${SAMPLE_COUNT}...`);
      const metrics = await measurePageLoad();
      const analysis = analyzeMetrics(metrics);
      const formatted = formatMetrics(metrics, analysis);

      samples.push({
        raw: metrics,
        analysis: analysis,
        formatted: formatted,
      });

      // Wait between samples
      if (i < SAMPLE_COUNT - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.log(`   ❌ Sample ${i + 1} failed: ${errorMessage}`);
      samples.push({ error: errorMessage });
    }
  }

  return samples;
}

/**
 * Calculate average metrics
 */
function calculateAverages(samples: MonitoringSample[]): AverageMetrics | null {
  const validSamples = samples.filter((s) => !s.error && s.raw);

  if (validSamples.length === 0) {
    return null;
  }

  const totals = validSamples.reduce(
    (acc, sample) => {
      if (sample.raw) {
        acc.totalTime += sample.raw.totalTime;
        acc.firstByteTime += sample.raw.firstByteTime;
        acc.contentSize += sample.raw.contentSize;
      }
      return acc;
    },
    { totalTime: 0, firstByteTime: 0, contentSize: 0 },
  );

  const count = validSamples.length;

  return {
    totalTime: totals.totalTime / count,
    firstByteTime: totals.firstByteTime / count,
    contentSize: totals.contentSize / count,
    successRate: (count / samples.length) * 100,
  };
}

/**
 * Generate monitoring report
 */
function generateReport(samples: MonitoringSample[]): MonitoringReport {
  const averages = calculateAverages(samples);
  const timestamp = new Date().toISOString();

  console.log("\n📋 Performance Monitoring Report");
  console.log(`   Timestamp: ${timestamp}`);
  console.log(`   Samples: ${samples.length}`);

  if (!averages) {
    console.log("❌ All samples failed - service may be down");
    return {
      status: "failed",
      timestamp,
      samples: samples.length,
      successRate: 0,
    };
  }

  console.log(`   Success Rate: ${averages.successRate.toFixed(1)}%`);
  console.log(`   Average Load Time: ${Math.round(averages.totalTime)}ms`);
  console.log(`   Average First Byte: ${Math.round(averages.firstByteTime)}ms`);
  console.log(
    `   Average Content Size: ${(averages.contentSize / 1024).toFixed(1)}KB`,
  );

  const avgAnalysis = analyzeMetrics({
    totalTime: averages.totalTime,
    firstByteTime: averages.firstByteTime,
    contentSize: averages.contentSize,
    statusCode: 200,
    headers: {},
  });

  console.log(`   Overall Performance: ${avgAnalysis.overall.toUpperCase()}`);

  // Show individual samples
  console.log("\n📊 Individual Samples:");
  samples.forEach((sample, index) => {
    if (sample.error) {
      console.log(`   ${index + 1}. ❌ ${sample.error}`);
    } else if (sample.formatted) {
      const f = sample.formatted;
      console.log(
        `   ${index + 1}. Load: ${f.loadTime} | TTFB: ${f.firstByte} | Size: ${f.contentSize}`,
      );
    }
  });

  return {
    status: avgAnalysis.overall,
    timestamp,
    averages,
    samples: samples.length,
    successRate: averages.successRate,
  };
}

/**
 * Main monitoring function
 */
async function monitorPerformance(): Promise<void> {
  console.log("🚀 Starting performance monitoring...\n");

  try {
    const samples = await runMonitoringSample();
    const report = generateReport(samples);

    if (report.status === "failed" || report.successRate < 80) {
      console.log("\n💥 Performance monitoring detected issues!");
      process.exit(1);
    } else if (report.status === "poor") {
      console.log("\n⚠️ Performance needs improvement!");
      process.exit(1);
    } else {
      console.log("\n✅ Performance monitoring completed successfully!");
      process.exit(0);
    }
  } catch (error) {
    console.error("💥 Monitoring error:", error);
    process.exit(1);
  }
}

/**
 * Continuous monitoring mode
 */
async function continuousMonitoring(): Promise<void> {
  console.log("🔄 Starting continuous performance monitoring...");
  console.log(`   Interval: ${MONITORING_INTERVAL / 1000}s`);
  console.log("   Press Ctrl+C to stop\n");

  while (true) {
    await monitorPerformance();
    await new Promise((resolve) => setTimeout(resolve, MONITORING_INTERVAL));
  }
}

// Command line interface
const args = process.argv.slice(2);
const isContinuous = args.includes("--continuous") || args.includes("-c");

if (import.meta.url === `file://${process.argv[1]}`) {
  if (isContinuous) {
    continuousMonitoring().catch((error) => {
      console.error("💥 Continuous monitoring error:", error);
      process.exit(1);
    });
  } else {
    monitorPerformance();
  }
}

export { monitorPerformance, continuousMonitoring };
