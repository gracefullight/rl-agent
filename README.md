# RL Agent: Grid World Value Iteration Simulator

[![Deploy to GitHub Pages](https://github.com/gracefullight/rl-agent/actions/workflows/deploy.yml/badge.svg)](https://github.com/gracefullight/rl-agent/actions/workflows/deploy.yml)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Active-green)](https://gracefullight.github.io/rl-agent/)

An interactive web-based reinforcement learning simulator for visualizing value iteration algorithms in a 4x3 grid world environment. Built for educational purposes to help students understand Markov Decision Processes (MDPs) through visual interaction.

## 🚀 Live Demo

Visit the live application: [https://gracefullight.github.io/rl-agent/](https://gracefullight.github.io/rl-agent/)

## ✨ Features

- **Interactive Grid World**: 4x3 grid with visual representation of states, rewards, and policies
- **Value Iteration Algorithm**: Real-time visualization of Bellman equation iterations
- **Stochastic Movement**: Configurable transition probabilities (80% intended, 10% left/right)
- **Policy Visualization**: Arrow indicators showing optimal policy directions
- **Educational Interface**: Step-by-step algorithm execution with convergence tracking

## 🛠 Technology Stack

- **Framework**: Next.js 15 with App Router
- **UI**: React 19, shadcn/ui, Tailwind CSS
- **Canvas**: React Konva for high-performance rendering
- **State Management**: Jotai for atomic state management
- **Development**: TypeScript, Biome, Playwright E2E testing
- **Deployment**: GitHub Actions CI/CD to GitHub Pages

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 22 LTS
- pnpm 10.15.0

### Local Development

```bash
# Clone the repository
git clone https://github.com/gracefullight/rl-agent.git
cd rl-agent

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open browser to http://localhost:3000
```

### Testing

```bash
# Run unit tests
pnpm test

# Run E2E tests
pnpm test:e2e
```

### Building

```bash
# Build for production (static export)
pnpm build

# Serve locally for testing
cd out && python -m http.server 8000
```

## 📚 Educational Use

This simulator is designed for:
- Computer Science courses on Artificial Intelligence
- Reinforcement Learning workshops and tutorials
- Interactive demonstrations of MDP concepts
- Visual understanding of value iteration convergence

## 🔧 Configuration

The grid world environment includes:
- **Grid Size**: 4x3 with 1-based indexing
- **Start Position**: (1,1)
- **Wall**: (2,2) - impassable state
- **Terminal States**: 
  - (4,2) = -1 reward (negative terminal)
  - (4,3) = +1 reward (positive terminal)
- **Step Reward**: -0.04 (configurable)
- **Discount Factor**: 1.0 (configurable)

## 🚀 Deployment

The application is automatically deployed to GitHub Pages using GitHub Actions:

1. **Trigger**: Push to `main` branch
2. **Build**: Next.js static export with optimization
3. **Test**: Unit tests and E2E tests must pass
4. **Deploy**: Automatic deployment to GitHub Pages

## 📖 Algorithm Details

### Value Iteration

Implements the Bellman equation:
```
V(s) = R(s) + γ * max_a Σ P(s'|s,a) * V(s')
```

Where:
- `V(s)` = Value of state s
- `R(s)` = Reward for state s
- `γ` = Discount factor
- `P(s'|s,a)` = Transition probability from state s to s' given action a

### Movement Model

- **Intended Action**: 80% probability
- **Perpendicular Actions**: 10% each (left/right turn)
- **Boundary Handling**: Stay in place if action would lead out of bounds
- **Wall Collision**: Remain in current state

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

Built for educational purposes to enhance understanding of reinforcement learning concepts through interactive visualization.