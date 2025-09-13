# Quickstart Guide: GitHub Actions CI/CD for Next.js

This guide provides step-by-step instructions for implementing and validating the GitHub Actions CI/CD pipeline for deploying the RL Agent Grid World simulator to GitHub Pages.

## Prerequisites

Before starting, ensure you have:
- Repository with admin permissions
- GitHub Pages enabled in repository settings
- Local development environment with Node.js 22 and pnpm
- Existing Next.js application (RL Agent project)

## Implementation Steps

### Step 1: Configure Next.js for Static Export

1. **Create or modify `next.config.js`:**
   ```bash
   cd /path/to/rl-agent
   # Edit next.config.js with static export configuration
   ```

2. **Verify configuration:**
   ```bash
   pnpm build
   # Should create 'out/' directory with static files
   ls -la out/
   ```

3. **Test locally:**
   ```bash
   cd out
   python -m http.server 8000
   # Visit http://localhost:8000/rl-agent/
   ```

### Step 2: Create GitHub Actions Workflow

1. **Create workflow directory:**
   ```bash
   mkdir -p .github/workflows
   ```

2. **Create deployment workflow:**
   ```bash
   touch .github/workflows/deploy.yml
   # Add workflow configuration (see contracts/workflow-contract.md)
   ```

3. **Validate workflow syntax:**
   ```bash
   # Use GitHub CLI or online YAML validator
   gh workflow list  # Should show new workflow after push
   ```

### Step 3: Configure Repository Settings

1. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: "GitHub Actions"
   - Custom domain: Optional

2. **Set up environment protection (optional):**
   - Go to Settings → Environments
   - Create "github-pages" environment
   - Add protection rules if needed

### Step 4: Initial Deployment

1. **Commit and push changes:**
   ```bash
   git add .
   git commit -m "feat: add GitHub Actions deployment workflow"
   git push origin main
   ```

2. **Monitor workflow execution:**
   - Visit Actions tab in GitHub repository
   - Watch workflow progress in real-time
   - Check for any errors or warnings

3. **Verify deployment:**
   - Check Pages environment in repository
   - Visit deployed site URL
   - Test application functionality

## Validation Checklist

### Pre-deployment Validation
- [ ] Next.js builds successfully with static export
- [ ] Local testing shows no broken links or assets
- [ ] All tests pass in local environment
- [ ] Workflow file syntax is valid YAML
- [ ] Repository has required permissions enabled

### Post-deployment Validation
- [ ] GitHub Actions workflow completes successfully
- [ ] Build job passes all tests
- [ ] Deploy job uploads artifacts correctly
- [ ] GitHub Pages environment shows "Active" status
- [ ] Deployed site loads without errors
- [ ] Application functionality works as expected
- [ ] Navigation and routing work correctly
- [ ] Static assets load from correct paths

### Performance Validation
- [ ] Page load time under 3 seconds
- [ ] Core Web Vitals meet recommendations
- [ ] Image optimization working correctly
- [ ] JavaScript bundles properly split
- [ ] Browser caching headers present

## Troubleshooting

### Common Issues

**Build Failures:**
```bash
# Check Node.js version
node --version  # Should be 22.x

# Clear dependencies and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Run tests locally
pnpm test
pnpm test:e2e
```

**Deployment Failures:**
```bash
# Check GitHub Pages settings
# Verify repository permissions
# Review workflow logs in Actions tab
```

**Asset Loading Issues:**
```bash
# Verify basePath configuration
# Check browser network tab for 404s
# Ensure relative paths in components
```

### Debug Commands

**Check build output:**
```bash
pnpm build
ls -la out/
find out/ -name "*.html" | head -5
```

**Test static export locally:**
```bash
cd out
python -m http.server 8000
# or
npx serve .
```

**Validate workflow:**
```bash
gh workflow list
gh run list --workflow=deploy.yml
gh run view [RUN_ID] --log
```

## Monitoring and Maintenance

### Regular Checks
- Monitor workflow runs for failures
- Review deployment logs weekly
- Update action versions quarterly
- Test deployed site functionality monthly

### Performance Monitoring
- Track Core Web Vitals with Google PageSpeed Insights
- Monitor bundle sizes with Next.js analyzer
- Check for broken links with external tools
- Validate accessibility compliance

### Security Updates
- Update GitHub Actions to latest versions
- Review permissions regularly
- Monitor dependency vulnerabilities
- Audit workflow logs for sensitive data exposure

## Success Criteria

The implementation is considered successful when:

1. **Automated Deployment Works:**
   - Push to main triggers deployment
   - Tests pass before deployment
   - Site updates within 5 minutes of push

2. **Site Functions Correctly:**
   - All application features work
   - Navigation and routing functional
   - Assets load without errors
   - Mobile responsiveness maintained

3. **Performance Meets Standards:**
   - Page load under 3 seconds
   - Core Web Vitals in green
   - Lighthouse score above 90

4. **Reliability Maintained:**
   - No deployment failures in normal operation
   - Rollback capability available
   - Monitoring shows 99%+ uptime