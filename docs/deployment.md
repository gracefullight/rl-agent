# Deployment Guide

This document provides comprehensive information about the deployment process for the RL Agent Grid World simulator to GitHub Pages.

## Deployment Architecture

The application uses GitHub Actions CI/CD pipeline for automatic deployment to GitHub Pages with the following architecture:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Source Code   │───▶│ GitHub Actions   │───▶│ GitHub Pages    │
│   (main branch) │    │ CI/CD Pipeline   │    │ (Static Hosting)│
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │ Build & Test     │
                       │ - Next.js Build  │
                       │ - Unit Tests     │
                       │ - E2E Tests      │
                       └──────────────────┘
```

## Workflow Configuration

### Trigger Conditions

The deployment workflow triggers automatically on:
- Push events to the `main` branch
- Excludes documentation-only changes (`**.md`, `docs/**`)

### Build Process

1. **Environment Setup**
   - Ubuntu latest runner
   - Node.js 22 LTS
   - pnpm 10.15.0 with caching

2. **Dependency Installation**
   - Frozen lockfile installation
   - Dependency caching for faster builds

3. **Quality Assurance**
   - Unit tests (Vitest)
   - End-to-end tests (Playwright)
   - Build must pass all tests

4. **Static Export**
   - Next.js static export to `out/` directory
   - GitHub Pages compatible HTML/CSS/JS

5. **Artifact Management**
   - Upload build artifacts
   - Transfer to deployment job

6. **Deployment**
   - Deploy to GitHub Pages environment
   - Automatic DNS updates
   - HTTPS enabled by default

## Next.js Configuration

### Static Export Settings

```javascript
// next.config.js
const nextConfig = {
  output: 'export',           // Enable static export
  trailingSlash: true,        // GitHub Pages compatibility
  basePath: '/rl-agent',      // Repository subdirectory
  assetPrefix: '/rl-agent',   // Asset path prefix
  images: {
    unoptimized: true         // Disable image optimization for static hosting
  }
}
```

### Key Configuration Decisions

- **Static Export**: Required for GitHub Pages hosting
- **Base Path**: Ensures proper asset loading from subdirectory
- **Trailing Slash**: Improves GitHub Pages routing compatibility
- **Unoptimized Images**: Necessary for static hosting environment

## Environment Variables

### Build Environment

```yaml
env:
  NODE_VERSION: '22'
  PNPM_VERSION: '10.15.0'
  CI: true
```

### Workflow Permissions

```yaml
permissions:
  contents: read      # Repository access
  pages: write        # Deploy to Pages
  id-token: write     # OIDC authentication
```

## Deployment URLs

- **Production**: https://gracefullight.github.io/rl-agent/
- **Repository**: https://github.com/gracefullight/rl-agent
- **Actions**: https://github.com/gracefullight/rl-agent/actions

## Monitoring and Validation

### Automated Checks

The deployment includes several validation layers:

1. **Build Validation**
   - Successful Next.js build
   - All tests passing
   - Artifact creation

2. **Deployment Validation**
   - GitHub Pages environment setup
   - URL accessibility
   - Content integrity

3. **Performance Monitoring**
   - Load time measurement
   - Content size optimization
   - Core Web Vitals compliance

### Manual Validation Scripts

```bash
# Validate deployment
node scripts/validate-deployment.js

# Monitor performance
node scripts/monitor-performance.js

# Continuous monitoring
node scripts/monitor-performance.js --continuous
```

## Troubleshooting

### Common Issues

#### Build Failures

**Symptom**: Workflow fails during build step
**Solutions**:
- Check Node.js/pnpm version compatibility
- Verify dependency installation
- Review test failures in Actions logs

#### Deployment Failures

**Symptom**: Build succeeds but deployment fails
**Solutions**:
- Verify GitHub Pages is enabled in repository settings
- Check repository permissions
- Review workflow permissions configuration

#### Asset Loading Issues

**Symptom**: Site loads but assets (CSS/JS) don't work
**Solutions**:
- Verify `basePath` and `assetPrefix` configuration
- Check browser network tab for 404 errors
- Ensure relative paths in components

#### Performance Issues

**Symptom**: Site loads slowly or poorly
**Solutions**:
- Run performance monitoring script
- Check bundle size analysis
- Optimize images and assets
- Review Core Web Vitals

### Debug Commands

```bash
# Local build testing
pnpm build
ls -la out/
python -m http.server 8000 -d out

# Workflow debugging
gh workflow list
gh run list --workflow=deploy.yml
gh run view [RUN_ID] --log

# Repository status
gh repo view
gh auth status
```

## Security Considerations

### Permissions

- Minimal required permissions only
- OIDC authentication for secure deployment
- No sensitive data in workflow logs

### Dependencies

- Dependabot enabled for security updates
- Regular dependency audits
- Locked package versions

## Performance Optimization

### Build Optimization

- Next.js automatic code splitting
- Static asset optimization
- Tree shaking for smaller bundles

### Runtime Optimization

- Static file serving from CDN
- Browser caching headers
- Compression (gzip/brotli)

### Monitoring

- Core Web Vitals tracking
- Performance budget enforcement
- Regular performance audits

## Maintenance

### Regular Tasks

- **Weekly**: Monitor deployment status and performance
- **Monthly**: Update dependencies and security patches
- **Quarterly**: Review and update workflow actions

### Updates

When updating the deployment configuration:

1. Test changes in feature branch
2. Validate build process locally
3. Monitor first deployment carefully
4. Rollback if issues detected

## Support

For deployment issues or questions:

1. Check GitHub Actions logs
2. Review this documentation
3. Run validation scripts
4. Create issue in repository

## Changelog

### Version 1.0.0
- Initial GitHub Actions deployment setup
- Next.js static export configuration
- Performance monitoring implementation
- Comprehensive documentation

---

*Last updated: September 2025*