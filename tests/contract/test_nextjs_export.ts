/**
 * Contract Test: Next.js Static Export Configuration
 *
 * This test validates that Next.js is properly configured for
 * static export with GitHub Pages compatibility.
 */

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

interface NextConfig {
  output: string;
  basePath: string;
  trailingSlash: boolean;
  images: {
    unoptimized: boolean;
  };
  assetPrefix: string;
}

describe("Next.js Static Export Contract", () => {
  const configPath = path.join(process.cwd(), "next.config.ts");
  const jsConfigPath = path.join(process.cwd(), "next.config.js");

  it("should have next.config.ts or next.config.js file", () => {
    // This test MUST FAIL until Next.js config is implemented
    expect(fs.existsSync(configPath) || fs.existsSync(jsConfigPath)).toBe(true);
  });

  it("should be configured for static export", async () => {
    // This test MUST FAIL until Next.js config is implemented
    const actualConfigPath = fs.existsSync(configPath)
      ? configPath
      : jsConfigPath;
    const configModule = await import(actualConfigPath);
    const config: NextConfig = configModule.default || configModule;

    expect(config.output).toBe("export");
  });

  it("should have correct basePath for GitHub Pages", async () => {
    // This test MUST FAIL until Next.js config is implemented
    const actualConfigPath = fs.existsSync(configPath)
      ? configPath
      : jsConfigPath;
    const configModule = await import(actualConfigPath);
    const config: NextConfig = configModule.default || configModule;

    expect(config.basePath).toBe("/rl-agent");
  });

  it("should have trailingSlash enabled", async () => {
    // This test MUST FAIL until Next.js config is implemented
    const actualConfigPath = fs.existsSync(configPath)
      ? configPath
      : jsConfigPath;
    const configModule = await import(actualConfigPath);
    const config: NextConfig = configModule.default || configModule;

    expect(config.trailingSlash).toBe(true);
  });

  it("should have unoptimized images for static hosting", async () => {
    // This test MUST FAIL until Next.js config is implemented
    const actualConfigPath = fs.existsSync(configPath)
      ? configPath
      : jsConfigPath;
    const configModule = await import(actualConfigPath);
    const config: NextConfig = configModule.default || configModule;

    expect(config.images.unoptimized).toBe(true);
  });

  it("should have assetPrefix matching basePath", async () => {
    // This test MUST FAIL until Next.js config is implemented
    const actualConfigPath = fs.existsSync(configPath)
      ? configPath
      : jsConfigPath;
    const configModule = await import(actualConfigPath);
    const config: NextConfig = configModule.default || configModule;

    expect(config.assetPrefix).toBe("/rl-agent");
  });
});
