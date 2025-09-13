import type { NextConfig } from "next";

const isGhPages =
  process.env.NODE_ENV === "production" ||
  process.env.USE_GH_PAGES_PATH === "true";

const nextConfig: NextConfig = {
  // Enable static export for GitHub Pages
  output: "export",

  // Enable trailing slashes for better GitHub Pages compatibility
  trailingSlash: true,

  // Conditionally set basePath and assetPrefix for GitHub Pages
  basePath: isGhPages ? "/rl-agent" : "",
  assetPrefix: isGhPages ? "/rl-agent" : "",

  // Configure images for static hosting (disable optimization)
  images: {
    unoptimized: true,
  },

  // Ensure static generation compatibility
  reactStrictMode: true,
};

export default nextConfig;
