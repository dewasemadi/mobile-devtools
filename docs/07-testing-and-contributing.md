# 07. Testing, Monorepo & Contributing Guide

Guide for developers contributing to `mobile-devtools`.

---

## 📂 Monorepo Setup & Architecture

`mobile-devtools` is managed as a high-performance monorepo using **pnpm workspaces** and **Turborepo**.

```
mobile-devtools/
├── apps/
│   └── web/                    # React documentation portal & live playground app (Port 3000)
├── examples/
│   ├── react/                  # React 19 test harness app (Port 3001)
│   ├── vue/                    # Vue 3 test harness app (Port 3002)
│   ├── svelte/                 # Svelte 5 test harness app (Port 3003)
│   └── vanilla/                # Vanilla JS test harness app (Port 3004)
├── packages/
│   ├── mobile-devtools/        # Core unified published npm package
│   └── config/
│       ├── eslint/             # Shared ESLint configuration (@mobile-devtools/eslint-config)
│       ├── typescript/         # Shared TypeScript configuration (@mobile-devtools/tsconfig)
│       └── vite/               # Shared Vite build configuration (@mobile-devtools/vite-config)
└── docs/                       # Comprehensive technical documentation suite
```

---

## 🛠️ Development Setup

### Prerequisites

- **Node.js**: `>= 24.0.0` (v24.4.1+ recommended)
- **pnpm**: `>= 9.15.0`

```bash
# 1. Clone repository
git clone https://github.com/dewasemadi/mobile-devtools.git
cd mobile-devtools

# 2. Install workspace dependencies
pnpm install

# 3. Start development mode across all apps & packages
pnpm dev

# 4. Type check TypeScript across all 8 workspace packages
pnpm check-types

# 5. Build production distribution artifacts
pnpm build
```

---

## 🧪 Testing Suite

`mobile-devtools` enforces a 100% pass rate across unit tests and end-to-end browser tests before releasing.

### A. Unit Testing (`Vitest`)

Runs **65 unit tests** testing DOM managers, store events, interceptors, adapters, and theme helpers.

```bash
# Run unit tests
pnpm test

# Run unit tests with V8 coverage report
pnpm test:coverage
```

Current coverage status: **~75.5% statement coverage** across core modules (100% pass rate across 21 test files).

### B. End-to-End Testing (`Playwright`)

Runs **21 E2E tests** simulating actual user interactions (badge dragging, drawer toggling, tab switching, console logging, and network interception) across 3 browser viewports:

- Desktop Chromium
- Mobile Chrome (Pixel 5 viewport)
- Mobile Safari (iPhone 12 viewport)

```bash
# Run Playwright E2E tests
pnpm test:e2e

# Open Playwright HTML test report
pnpm exec playwright show-report apps/web/playwright-report
```

---

## 📝 Semantic Commit Standards

Contributions must follow the **Conventional Commits** standard:

- `feat(mobile-devtools)`: New feature additions to core library or adapters.
- `feat(web)`: Improvements to web documentation portal.
- `feat(examples)`: Updates to example test harness apps.
- `fix(core)`: Bug fixes in core interceptors or managers.
- `docs`: Documentation updates or additions in `docs/` or `README.md`.
- `chore`: Tooling, dependency updates, or monorepo config changes.
