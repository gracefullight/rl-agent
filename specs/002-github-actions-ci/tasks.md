# Tasks: GitHub Actions CI/CD for Next.js GitHub Pages Deployment

**Input**: Design documents from `/specs/002-github-actions-ci/`
**Prerequisites**: plan.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

## Execution Flow (main)
```
1. Load plan.md from feature directory ✅
   → Extract: GitHub Actions, Node.js 22 LTS, pnpm@10.15.0, Next.js static export
2. Load optional design documents ✅:
   → data-model.md: WorkflowConfiguration, JobDefinition, DeploymentArtifact
   → contracts/: workflow-contract.md, nextjs-contract.md → contract test tasks
   → research.md: Latest action versions, two-job workflow, test integration
3. Generate tasks by category:
   → Setup: Next.js config, GitHub Actions workflow, dependencies
   → Tests: contract validation, deployment testing
   → Core: workflow implementation, static export config
   → Integration: Pages deployment, environment setup
   → Polish: validation, monitoring, documentation
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness ✅
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: Configuration files at repository root
- **GitHub Actions**: `.github/workflows/` directory
- **Next.js**: `next.config.js` at root, output in `out/` directory

## Phase 3.1: Setup
- [x] T001 Create .github/workflows directory structure per implementation plan
- [x] T002 Backup existing next.config.js if present for rollback capability (no existing config found)
- [x] T003 [P] Validate current Node.js 22 LTS and pnpm@10.15.0 environment

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [x] T004 [P] Contract test workflow trigger validation in tests/contract/test_workflow_trigger.js
- [x] T005 [P] Contract test job dependencies in tests/contract/test_job_dependencies.js
- [x] T006 [P] Contract test Next.js static export in tests/contract/test_nextjs_export.js
- [x] T007 [P] Contract test deployment artifact in tests/contract/test_deployment_artifact.js
- [x] T008 [P] Integration test complete CI/CD pipeline in tests/integration/test_cicd_pipeline.js
- [x] T009 [P] Integration test Pages deployment in tests/integration/test_pages_deployment.js

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [x] T010 [P] Configure Next.js static export in next.config.js
- [x] T011 [P] Create GitHub Actions workflow in .github/workflows/deploy.yml
- [x] T012 [P] Add build script optimization in package.json
- [x] T013 Configure workflow permissions for GitHub Pages deployment
- [x] T014 Implement build job with Node.js 22 LTS and pnpm caching
- [x] T015 Implement deploy job with Pages artifact upload
- [x] T016 Add workflow environment variables and secrets handling

## Phase 3.4: Integration
- [x] T017 Connect build job to test suite execution (pnpm test && pnpm test:e2e)
- [x] T018 Configure GitHub Pages environment in repository settings
- [x] T019 Set up deployment artifact upload/download between jobs
- [x] T020 Configure basePath routing for GitHub Pages subdirectory

## Phase 3.5: Polish
- [x] T021 [P] Add workflow status badges in README.md
- [x] T022 [P] Create deployment validation script in scripts/validate-deployment.js
- [x] T023 [P] Add performance monitoring script in scripts/monitor-performance.js
- [x] T024 [P] Update documentation in docs/deployment.md
- [x] T025 Test manual deployment trigger and error recovery
- [x] T026 Validate complete deployment pipeline end-to-end
- [x] T027 Run deployment validation checklist from quickstart.md

## Dependencies
- Tests (T004-T009) before implementation (T010-T016)
- T010 (Next.js config) blocks T020 (basePath routing)
- T011 (workflow) blocks T013-T016 (workflow details)
- T017 (test integration) requires T014-T015 (build/deploy jobs)
- T018 (Pages settings) blocks T019 (artifact handling)
- Implementation (T010-T020) before polish (T021-T027)

## Parallel Example
```
# Launch T004-T009 together (all different test files):
Task: "Contract test workflow trigger validation in tests/contract/test_workflow_trigger.js"
Task: "Contract test job dependencies in tests/contract/test_job_dependencies.js"
Task: "Contract test Next.js static export in tests/contract/test_nextjs_export.js"
Task: "Contract test deployment artifact in tests/contract/test_deployment_artifact.js"
Task: "Integration test complete CI/CD pipeline in tests/integration/test_cicd_pipeline.js"
Task: "Integration test Pages deployment in tests/integration/test_pages_deployment.js"

# Launch T010-T012 together (different config files):
Task: "Configure Next.js static export in next.config.js"
Task: "Create GitHub Actions workflow in .github/workflows/deploy.yml"
Task: "Add build script optimization in package.json"

# Launch T021-T024 together (different documentation files):
Task: "Add workflow status badges in README.md"
Task: "Create deployment validation script in scripts/validate-deployment.js"
Task: "Add performance monitoring script in scripts/monitor-performance.js"
Task: "Update documentation in docs/deployment.md"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task group for rollback capability
- Monitor GitHub Actions quotas during testing
- Validate deployment URL accessibility after each change

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - workflow-contract.md → workflow trigger, job dependencies, permissions tests (T004-T005)
   - nextjs-contract.md → static export, basePath tests (T006)
   - Both contracts → deployment artifact test (T007)
   
2. **From Data Model**:
   - WorkflowConfiguration → workflow creation task (T011)
   - JobDefinition → build/deploy job tasks (T014-T015)
   - DeploymentArtifact → artifact handling task (T019)
   
3. **From Research Decisions**:
   - Latest action versions → workflow implementation (T011)
   - Node.js 22 LTS + pnpm → build job configuration (T014)
   - Two-job workflow → separate build/deploy tasks (T014-T015)
   - Test integration → CI test execution (T017)

4. **From Quickstart Scenarios**:
   - Implementation steps → core tasks (T010-T020)
   - Validation checklist → polish validation (T025-T027)

## Validation Checklist
*GATE: Checked by main() before returning*

- [x] All contracts have corresponding tests (T004-T007)
- [x] All entities have implementation tasks (T011, T014-T015, T019)
- [x] All tests come before implementation (T004-T009 before T010-T020)
- [x] Parallel tasks truly independent (different files marked [P])
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] TDD workflow enforced (tests must fail before implementation)
- [x] Dependencies properly mapped and sequential tasks identified