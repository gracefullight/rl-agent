# Implementation Plan: GitHub Actions CI/CD Pipeline for Next.js Deployment

**Branch**: `002-github-actions-ci` | **Date**: September 13, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/Users/gracefullight/workspace/rl-agent/specs/002-github-actions-ci/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path ✅
   → Loaded successfully - GitHub Actions CI/CD for Next.js gh-pages deployment
2. Fill Technical Context (scan for NEEDS CLARIFICATION) ✅
   → Project Type: Web application (Next.js frontend)
   → Structure Decision: Single project (frontend only)
3. Evaluate Constitution Check section below ✅
   → No constitutional violations - infrastructure automation
   → Update Progress Tracking: Initial Constitution Check ✅
4. Execute Phase 0 → research.md ✅
   → No NEEDS CLARIFICATION remaining
5. Execute Phase 1 → contracts, data-model.md, quickstart.md ✅
6. Re-evaluate Constitution Check section ✅
   → No new violations
   → Update Progress Tracking: Post-Design Constitution Check ✅
7. Plan Phase 2 → Task generation approach described ✅
8. STOP - Ready for /tasks command ✅
```

## Summary
Create a GitHub Actions workflow that automatically builds and deploys the Next.js Grid World Value Iteration Simulator to GitHub Pages whenever changes are pushed to the main branch. The workflow will use Node.js 22 LTS, pnpm (version from package.json), latest GitHub Actions, and deploy with GitHub bot user credentials.

## Technical Context
**Language/Version**: Node.js 22 LTS  
**Primary Dependencies**: Next.js 15.5.3, React 19.1.1, TypeScript 5.9.2  
**Storage**: Static files only (GitHub Pages)  
**Testing**: Vitest (unit), Playwright (E2E) - run in CI  
**Target Platform**: GitHub Pages (static hosting)  
**Project Type**: Single project (Next.js frontend)  
**Performance Goals**: Build completion under 10 minutes  
**Constraints**: Static export compatible, GitHub Pages subdirectory hosting  
**Scale/Scope**: Educational tool, single-page application  
**Package Manager**: pnpm@10.15.0 (from package.json)  
**CI Actions**: actions/checkout@v5, pnpm/action-setup@v4, actions/setup-node@v4, actions/upload-pages-artifact@v3, actions/deploy-pages@v4  
**Bot User**: github-actions[bot] (41898282+github-actions[bot]@users.noreply.github.com)

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Simplicity**:
- Projects: 1 (GitHub Actions workflow only)
- Using framework directly? (✅ Direct GitHub Actions, no wrapper)
- Single workflow file? (✅ One .github/workflows/deploy.yml)
- Avoiding patterns? (✅ Standard CI/CD, no over-engineering)

**Architecture**:
- Infrastructure as Code? (✅ GitHub Actions workflow file)
- Single responsibility: Build and deploy only
- No custom libraries needed for CI/CD workflow

**Testing (NON-NEGOTIABLE)**:
- CI tests before deployment? (✅ Will run existing test suite)
- Build verification? (✅ Build must succeed before deploy)
- E2E validation planned in tasks

**Observability**:
- Workflow logs included? (✅ GitHub Actions native logging)
- Build status visible? (✅ GitHub UI + status badges)
- Error reporting sufficient? (✅ Native GitHub Actions error reporting)

**Versioning**:
- Deployment tracking? (✅ GitHub Pages deployment history)
- Git-based versioning? (✅ Tied to commit SHAs)

## Project Structure

### Documentation (this feature)
```
specs/002-github-actions-ci/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
# Single project (Next.js app) - NO CHANGES TO EXISTING STRUCTURE
.github/
└── workflows/
    └── deploy.yml       # NEW: Main deployment workflow

# Existing structure preserved:
src/
tests/
package.json
next.config.js           # MODIFY: Add static export config
```

**Structure Decision**: Single project - adding only GitHub Actions workflow, minimal changes to existing Next.js app

## Phase 0: Outline & Research

### Research Findings Consolidated

**GitHub Actions Versions Research**:
- **actions/checkout@v5**: Latest stable, supports Node.js 20+, improved performance
- **actions/setup-node@v4**: Latest, supports Node.js 22 LTS, integrated caching for pnpm
- **actions/upload-pages-artifact@v3**: Current stable for GitHub Pages artifact uploads
- **actions/deploy-pages@v4**: Latest GitHub Pages deployment action

**Next.js Static Export Research**:
- Next.js 15 supports static export via `output: 'export'` in next.config.js
- Static export creates optimized HTML/CSS/JS files suitable for GitHub Pages
- Image optimization must be configured for static hosting
- Asset paths need `basePath` configuration for GitHub Pages subdirectory

**GitHub Pages Configuration Research**:
- Requires `pages: write` and `id-token: write` permissions
- Uses GitHub bot user: github-actions[bot]
- Deployment creates new environment automatically
- Supports custom domain and HTTPS enforcement

**pnpm Integration Research**:
- pnpm@10.15.0 from package.json packageManager field
- actions/setup-node@v4 has native pnpm caching support
- Use `pnpm install --frozen-lockfile` for CI consistency
- Build command: `pnpm build` (will create `out/` directory)

## Phase 1: Design & Contracts

**Workflow Contract** (GitHub Actions YAML):
- Trigger: `push` to `main` branch only
- Environment: `ubuntu-latest` with Node.js 22 LTS
- Jobs: `build` (test + build) → `deploy` (upload + deploy to Pages)
- Permissions: `contents: read`, `pages: write`, `id-token: write`
- Artifacts: Built static files in `out/` directory

**Build Process Contract**:
- Input: Source code from main branch
- Process: Install deps → Run tests → Build static export
- Output: Deployable static files
- Validation: Test suite must pass, build must succeed

**Deployment Contract**:
- Input: Static build artifacts
- Process: Upload to GitHub Pages artifact → Deploy to Pages environment
- Output: Live website at `https://{username}.github.io/{repo-name}`
- Rollback: Previous deployment preserved on failure

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `/templates/tasks-template.md` as base
- Create workflow file creation task
- Create Next.js configuration update task
- Create package.json build script update task
- Create workflow testing and validation tasks
- Create documentation update tasks

**Ordering Strategy**:
- Configuration updates first (Next.js, package.json)
- Workflow file creation
- Local testing and validation
- Push and CI testing
- Documentation updates

**Estimated Output**: 8-10 numbered, ordered tasks in tasks.md

## Complexity Tracking
*No constitutional violations requiring justification*

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)  
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none)

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*