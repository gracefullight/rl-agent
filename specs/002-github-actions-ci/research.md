# Research: GitHub Actions CI/CD for Next.js GitHub Pages Deployment

## GitHub Actions Version Research

### Decision: Use Latest Stable Actions
- **actions/checkout@v5**: Latest stable version
- **pnpm/action-setup@v4**: New action for pnpm setup and caching
- **actions/setup-node@v4**: Current version with Node.js 22 support
- **actions/upload-pages-artifact@v3**: Current GitHub Pages artifact handler  
- **actions/deploy-pages@v4**: Latest GitHub Pages deployment action

### Rationale
- v5 of checkout provides Node.js 20+ support and improved performance
- pnpm/action-setup@v4 is specifically designed for pnpm with caching
- setup-node@v4 has native pnpm caching and Node.js 22 LTS support
- Pages actions v3/v4 are current stable versions for GitHub Pages deployment
- All versions are actively maintained and secure

### Alternatives Considered
- Older action versions: Rejected due to lack of Node.js 22 support
- Third-party deployment actions: Rejected in favor of official GitHub actions
- Manual deployment scripts: Rejected for maintainability concerns

## Node.js and Package Manager Research

### Decision: Node.js 22 LTS with pnpm@10.15.0
- Node.js 22 LTS for long-term stability
- pnpm@10.15.0 from package.json packageManager field
- Use setup-node caching: `cache: 'pnpm'`

### Rationale
- Node.js 22 is current LTS with excellent Next.js 15 compatibility
- pnpm provides faster installs and better dependency management
- Existing project already configured for pnpm@10.15.0
- setup-node@v4 has built-in pnpm caching support

### Alternatives Considered
- npm: Slower than pnpm, not used in current project
- yarn: Not configured in current project
- Older Node.js versions: Would miss Next.js 15 optimizations

## Next.js Static Export Research

### Decision: Configure output: 'export' with GitHub Pages basePath
- Add `output: 'export'` to next.config.js
- Configure `basePath: '/rl-agent'` for GitHub Pages subdirectory
- Use `trailingSlash: true` for better GitHub Pages compatibility
- Configure image optimization for static export

### Rationale
- Next.js 15 has excellent static export capabilities
- GitHub Pages requires static files, not server-side rendering
- basePath ensures assets load correctly from subdirectory
- Static export is faster and more reliable for educational demos

### Alternatives Considered
- Server-side rendering: Not supported by GitHub Pages
- Client-side routing only: Would break on page refresh
- Third-party hosting: Unnecessary complexity for educational tool

## GitHub Pages Deployment Research

### Decision: Use GitHub Actions Pages Environment
- Use official actions/upload-pages-artifact and actions/deploy-pages
- Configure pages environment with proper permissions
- Enable automatic HTTPS and custom domain support
- Use github-actions[bot] for commits

### Rationale
- Official GitHub actions provide best integration
- Pages environment provides deployment history and rollbacks
- HTTPS is enabled automatically for security
- Bot user ensures clean commit history

### Alternatives Considered
- Manual gh-pages branch: More complex, no deployment history
- Third-party deployment services: Unnecessary external dependency
- FTP/rsync deployment: Not applicable to GitHub Pages

## CI/CD Pipeline Architecture Research

### Decision: Two-job workflow (build → deploy)
- Job 1: Build (checkout, setup, test, build, upload artifact)
- Job 2: Deploy (download artifact, deploy to pages)
- Use job dependencies: deploy needs build
- Fail fast: stop deployment if tests fail

### Rationale
- Separation of concerns: build vs deploy responsibilities
- Artifact-based approach enables rollbacks and debugging
- Test validation prevents broken deployments
- Follows GitHub Actions best practices

### Alternatives Considered
- Single job: Less resilient to failures, harder to debug
- Three+ jobs: Over-engineered for this use case
- Matrix builds: Not needed for single deployment target

## Testing Integration Research

### Decision: Run existing test suite in CI
- Execute `pnpm test` (Vitest unit tests)
- Execute `pnpm test:e2e` (Playwright E2E tests)
- Fail deployment if tests fail
- Cache test dependencies for speed

### Rationale
- Existing test suite provides good coverage
- E2E tests validate full application functionality
- Test failures should block broken deployments
- Test caching improves CI performance

### Alternatives Considered
- Skip tests in CI: Unsafe, could deploy broken code
- Tests in separate workflow: Delays feedback, more complex
- Only unit tests: Would miss integration issues