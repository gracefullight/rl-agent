# Quickstart Guide: Grid World Value Iteration Simulator

**Feature**: Grid World Value Iteration Simulator  
**Date**: September 12, 2025  
**Status**: Ready for Implementation

## Overview

This quickstart guide provides step-by-step instructions for setting up, running, and testing the Grid World Value Iteration Simulator. It covers everything from initial setup to advanced usage scenarios.

## Prerequisites

### System Requirements
- Node.js 18+ (recommended: 20+)
- pnpm (latest version)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Git for version control

### Development Environment
```bash
# Check Node.js version
node --version

# Install pnpm if not already installed
npm install -g pnpm

# Verify pnpm installation
pnpm --version
```

## Quick Setup (5 minutes)

### 1. Project Initialization
```bash
# Create new Next.js 15 project
pnpm create next-app@latest rl-agent --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Navigate to project directory
cd rl-agent

# Install core dependencies
pnpm add jotai react-konva konva es-toolkit axios @tanstack/react-query

# Install shadcn/ui
pnpm add @radix-ui/react-slot class-variance-authority clsx tailwind-merge lucide-react

# Install development dependencies
pnpm add -D @playwright/test @biomejs/biome @types/node

# Initialize Biome for linting
pnpm exec biome init
```

### 2. shadcn/ui Setup
```bash
# Initialize shadcn/ui
npx shadcn@latest init

# Install required UI components
npx shadcn@latest add button input card table badge slider label separator
```

### 3. Next.js Configuration
Create `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: 'canvas' }];
    return config;
  },
};

module.exports = nextConfig;
```

### 4. Project Structure Setup
```bash
# Create directory structure
mkdir -p src/components/grid-world
mkdir -p src/lib
mkdir -p src/hooks
mkdir -p tests/e2e
mkdir -p tests/unit
```

## Running the Application

### Development Server
```bash
# Start development server
pnpm dev

# Application will be available at http://localhost:3000
```

### Production Build
```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Basic Usage Scenarios

### Scenario 1: Initial Application Load

**Expected Behavior**:
1. Navigate to http://localhost:3000
2. See 4x3 grid with agent at position (1,1)
3. Wall visible at position (2,2)
4. Terminal states marked at (4,2) and (4,3)
5. Control panel with Iterate and Reset buttons
6. Utility values display showing initial values
7. Policy display showing initial policy

**Testing**:
```bash
# Run E2E test for initial load
pnpm playwright test initial-load.spec.ts
```

### Scenario 2: Single Iteration

**User Actions**:
1. Click "Iterate" button
2. Observe agent movement (probabilistic)
3. Check utility value updates
4. Verify policy display changes

**Expected Results**:
- Agent moves according to 80/10/10 probability distribution
- Utility values update in real-time
- Policy arrows reflect new optimal actions
- Iteration counter increments

### Scenario 3: Reset Functionality

**User Actions**:
1. Perform several iterations
2. Click "Reset" button
3. Verify return to initial state

**Expected Results**:
- Agent returns to position (1,1)
- Utility values reset to initial state
- Iteration counter resets to 0
- Policy display shows initial policy

### Scenario 4: Configuration Changes

**User Actions**:
1. Modify step reward value (default: -0.04)
2. Change to different value (e.g., -0.1)
3. Perform iterations
4. Observe behavior changes

**Expected Results**:
- New reward value used in calculations
- Different convergence behavior
- Updated optimal policy

## Testing

### Unit Tests
```bash
# Run unit tests with Vitest
pnpm test

# Run with coverage
pnpm test:coverage
```

### End-to-End Tests
```bash
# Install Playwright browsers
pnpm playwright install

# Run E2E tests
pnpm playwright test

# Run tests with UI
pnpm playwright test --ui

# Run specific test file
pnpm playwright test grid-canvas.spec.ts
```

### Performance Testing
```bash
# Run performance tests
pnpm playwright test performance.spec.ts

# Check for memory leaks
pnpm playwright test --debug memory-test.spec.ts
```

## Configuration Options

### Environment Variables
Create `.env.local`:
```bash
# Application configuration
NEXT_PUBLIC_APP_NAME="Grid World Simulator"
NEXT_PUBLIC_DEFAULT_STEP_REWARD=-0.04
NEXT_PUBLIC_DEFAULT_DISCOUNT_FACTOR=1.0
NEXT_PUBLIC_MAX_ITERATIONS=1000

# Performance settings
NEXT_PUBLIC_ANIMATION_SPEED=500
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true

# Development settings
NEXT_PUBLIC_ENABLE_DEBUG_MODE=true
NEXT_PUBLIC_LOG_LEVEL=info
```

### Simulation Parameters
Default configuration in `src/lib/constants.ts`:
```typescript
export const DEFAULT_CONFIG = {
  stepReward: -0.04,
  discountFactor: 1.0,
  convergenceThreshold: 0.001,
  maxIterations: 1000,
  iterationSpeed: 500,
  movementProbabilities: {
    intendedDirection: 0.8,
    leftTurn: 0.1,
    rightTurn: 0.1,
    stayInPlace: 0.0,
  },
};
```

## Troubleshooting

### Common Issues

**Canvas not rendering**:
```bash
# Ensure Next.js config includes canvas externals
# Check browser console for WebGL errors
# Verify react-konva version compatibility
```

**State not updating**:
```bash
# Check Jotai provider setup
# Verify atom dependencies
# Use React DevTools for state inspection
```

**Performance issues**:
```bash
# Enable performance monitoring
# Check for memory leaks in DevTools
# Verify efficient re-rendering patterns
```

### Debug Mode
Enable debug mode for detailed logging:
```typescript
// In components, use debug utilities
import { useDebugValue } from 'react';
import { useAtomValue } from 'jotai';

const debugState = useAtomValue(debugAtom);
useDebugValue(debugState, 'Simulation State');
```

## Advanced Usage

### Custom Grid Configurations
```typescript
// Create custom grid scenarios
const customGrid = {
  dimensions: { width: 4, height: 3 },
  walls: [{ row: 2, col: 2 }],
  terminals: [
    { position: { row: 4, col: 2 }, reward: -1 },
    { position: { row: 4, col: 3 }, reward: 1 },
  ],
};
```

### Algorithm Customization
```typescript
// Implement custom value iteration variants
const customValueIteration = (params: ValueIterationParams) => {
  // Custom algorithm implementation
  // Return ValueIterationResult
};
```

### Export/Import Functionality
```typescript
// Export simulation state
const exportState = () => {
  const state = getSimulationState();
  downloadAsJSON(state, 'simulation-state.json');
};

// Import simulation state
const importState = (file: File) => {
  const state = parseJSONFile(file);
  loadSimulationState(state);
};
```

## Performance Benchmarks

### Target Metrics
- Initial load time: < 2 seconds
- Iteration response: < 100ms
- Canvas render time: < 16ms (60fps)
- Memory usage: < 50MB
- Bundle size: < 2MB

### Monitoring
```typescript
// Performance monitoring hooks
const performanceMetrics = usePerformanceMonitoring();
console.log('Render time:', performanceMetrics.renderTime);
console.log('Memory usage:', performanceMetrics.memoryUsage);
```

## Educational Features

### Learning Scenarios
1. **Basic Value Iteration**: Default 4x3 grid
2. **Different Rewards**: Modify step rewards
3. **Probability Variations**: Change movement probabilities
4. **Convergence Analysis**: Observe convergence patterns

### Classroom Integration
- Export states for homework assignments
- Import pre-configured scenarios
- Performance comparison between students
- Visual learning aids for MDP concepts

## Deployment

### Production Deployment
```bash
# Build optimized production bundle
pnpm build

# Deploy to Vercel (recommended)
vercel deploy

# Alternative: Deploy to Netlify
netlify deploy --prod --dir=.next
```

### Environment Setup
- Production environment variables
- CDN configuration for static assets
- Performance monitoring setup
- Error tracking integration

## Next Steps

After completing this quickstart:

1. **Explore Advanced Features**: Custom algorithms, performance monitoring
2. **Educational Content**: Create learning scenarios and exercises
3. **Algorithm Extensions**: Implement policy iteration, Q-learning
4. **Visualization Enhancements**: 3D rendering, animation improvements
5. **Collaboration Features**: State sharing, real-time collaboration

## Support and Resources

### Documentation
- [Technical Documentation](../README.md)
- [API Reference](./contracts/types.ts)
- [Data Model](./data-model.md)

### Community
- GitHub Issues for bug reports
- Discussions for feature requests
- Educational forum for teaching resources

### Contact
- Technical questions: Create GitHub issue
- Educational partnerships: Contact maintainers
- Commercial licensing: See LICENSE file

This quickstart guide provides everything needed to get the Grid World Value Iteration Simulator up and running quickly, with clear instructions for both development and educational use cases.