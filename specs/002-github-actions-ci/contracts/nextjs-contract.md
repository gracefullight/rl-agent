# Next.js Configuration Contract

This contract defines the required Next.js configuration changes for GitHub Pages deployment.

## Static Export Configuration Contract

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/rl-agent',
  assetPrefix: '/rl-agent',
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig;
```

**Contract Requirements:**
- `output` MUST be set to 'export' for static file generation
- `basePath` MUST match repository name for GitHub Pages subdirectory
- `assetPrefix` MUST match basePath for correct asset loading
- `trailingSlash` MUST be true for GitHub Pages compatibility
- `images.unoptimized` MUST be true for static hosting

## Build Script Contract

```json
// package.json scripts section
{
  "scripts": {
    "build": "next build",
    "export": "next export",
    "build:static": "next build && next export"
  }
}
```

**Contract Requirements:**
- Build command MUST generate static files in `out/` directory
- Export process MUST complete without errors
- Generated files MUST be optimized for production
- Asset paths MUST be relative or absolute with correct basePath

## Directory Structure Contract

```
Project Root/
├── out/                    # Generated static files (created by build)
│   ├── index.html         # Main application entry point
│   ├── _next/             # Next.js runtime and chunks
│   │   ├── static/        # Static assets with hashes
│   │   └── ...
│   └── ...                # Additional pages and assets
├── src/                   # Source code (unchanged)
├── public/                # Static assets (copied to out/)
└── next.config.js         # Modified configuration
```

**Contract Requirements:**
- `out/` directory MUST be created by build process
- All necessary files MUST be included in output
- File paths MUST be correctly resolved with basePath
- Static assets MUST be copied from `public/` directory

## Environment Compatibility Contract

**Development Environment:**
- Local development MUST work with and without basePath
- Hot reload MUST function normally during development
- Local testing MUST pass with static export configuration

**Production Environment:**
- Static files MUST load correctly from GitHub Pages subdirectory
- Internal navigation MUST work with client-side routing
- External links and assets MUST resolve correctly
- SEO meta tags MUST include correct canonical URLs

## Performance Contract

**Build Performance:**
- Build process MUST complete within 10 minutes
- Output size MUST be optimized for web delivery
- Image assets MUST be appropriately compressed
- JavaScript bundles MUST be split and optimized

**Runtime Performance:**
- Page load times MUST be under 3 seconds on 3G
- Core Web Vitals MUST meet Google recommendations
- Client-side navigation MUST be instantaneous
- Static assets MUST leverage browser caching