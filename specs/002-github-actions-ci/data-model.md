# Data Model: GitHub Actions CI/CD Pipeline

## Entity Overview

This feature is purely infrastructure automation and does not introduce new business entities. However, it involves several deployment and configuration entities that define the CI/CD pipeline behavior.

## Configuration Entities

### WorkflowConfiguration
**Purpose**: Defines the GitHub Actions workflow structure and behavior

**Attributes**:
- `name`: Workflow display name
- `triggers`: Events that start the workflow (push to main)
- `permissions`: Required GitHub token permissions
- `jobs`: Array of job definitions
- `environment`: Target deployment environment name

**Relationships**:
- Contains multiple `JobDefinition` entities
- References `PermissionSet` for security scope

### JobDefinition  
**Purpose**: Represents individual jobs within the workflow

**Attributes**:
- `id`: Unique job identifier (build, deploy)
- `runsOn`: Runner environment specification
- `needs`: Job dependencies
- `steps`: Array of action steps
- `outputs`: Job output definitions

**Relationships**:
- Contains multiple `ActionStep` entities
- May depend on other `JobDefinition` entities

### ActionStep
**Purpose**: Individual actions or commands within a job

**Attributes**:
- `name`: Human-readable step name  
- `uses`: GitHub Action reference (e.g., actions/checkout@v5)
- `with`: Input parameters for the action
- `run`: Shell command to execute
- `env`: Environment variables

### BuildConfiguration
**Purpose**: Next.js build and export settings

**Attributes**:
- `output`: Export mode (static)
- `basePath`: GitHub Pages subdirectory path
- `trailingSlash`: URL format preference
- `images`: Image optimization settings
- `distDir`: Output directory location

**Relationships**:
- Referenced by build job steps
- Affects deployment artifact structure

## Deployment Entities

### DeploymentArtifact
**Purpose**: Built static files ready for deployment

**Attributes**:
- `path`: File system location (./out)
- `size`: Artifact size in bytes
- `contentHash`: Integrity verification hash
- `createdAt`: Build timestamp
- `sourceCommit`: Git commit SHA

**Relationships**:
- Created by build job
- Consumed by deploy job

### DeploymentEnvironment
**Purpose**: GitHub Pages hosting environment

**Attributes**:
- `name`: Environment name (github-pages)
- `url`: Live website URL
- `branch`: Deployment branch (gh-pages)
- `status`: Current deployment status
- `lastDeployed`: Most recent deployment time

**Relationships**:
- Hosts `DeploymentArtifact` content
- Maintains deployment history

## State Transitions

### Build Process States
```
Source Code → Dependency Installation → Test Execution → 
Build Generation → Artifact Creation → Artifact Upload
```

**Valid Transitions**:
- `source` → `installing` (dependency installation starts)
- `installing` → `testing` (tests begin after install)
- `testing` → `building` (build starts after tests pass)
- `building` → `created` (artifact generated successfully)
- `created` → `uploaded` (artifact uploaded to GitHub)

**Terminal States**:
- `uploaded` (success)
- `failed` (failure at any stage)

### Deployment Process States
```
Artifact Download → Environment Preparation → 
Content Deployment → DNS Update → Live
```

**Valid Transitions**:
- `downloading` → `preparing` (artifact retrieved)
- `preparing` → `deploying` (environment ready)
- `deploying` → `updating` (content deployed)
- `updating` → `live` (DNS propagated)

**Terminal States**:
- `live` (successful deployment)
- `failed` (deployment failure)

## Validation Rules

### Workflow Validation
- Workflow MUST trigger only on push to main branch
- Build job MUST complete successfully before deploy job starts
- Test suite MUST pass before build generation
- Artifact upload MUST succeed before deployment

### Configuration Validation  
- `basePath` MUST match repository name for GitHub Pages
- `output` MUST be set to 'export' for static hosting
- Node.js version MUST be 22 LTS
- Package manager MUST be pnpm with locked version

### Security Validation
- Workflow MUST use minimal required permissions
- Deployment MUST use official GitHub Actions only
- Bot user MUST be github-actions[bot] for consistency
- Secrets MUST NOT be exposed in logs or artifacts

## Integration Points

### GitHub Integration
- **Repository**: Source code and workflow files
- **Actions**: Execution environment and runners  
- **Pages**: Static hosting and deployment target
- **Environments**: Deployment tracking and protection

### External Dependencies
- **Node.js Ecosystem**: Runtime and package management
- **Next.js Framework**: Build system and static export
- **Testing Tools**: Validation before deployment