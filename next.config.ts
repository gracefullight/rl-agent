import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for GitHub Pages
  output: "export",

  // Enable trailing slashes for better GitHub Pages compatibility
  trailingSlash: true,

  // Configure base path for GitHub Pages subdirectory hosting
  basePath: "/rl-agent",

  // Set asset prefix to match base path
  assetPrefix: "/rl-agent",

  // Configure images for static hosting (disable optimization)
  images: {
    unoptimized: true,
  },

  // Ensure static generation compatibility
  reactStrictMode: true,
};

export default nextConfig;
