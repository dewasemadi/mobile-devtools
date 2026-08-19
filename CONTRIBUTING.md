# Contributing to Mobile DevTools

Thank you for your interest in contributing to **`mobile-devtools`**! We welcome bug reports, feature proposals, documentation improvements, and code contributions.

---

## 📌 Code of Conduct

Please note that this project is governed by the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

---

## 🛠️ Monorepo Setup

`mobile-devtools` is managed as a monorepo using **pnpm workspaces** and **Turborepo**.

### Prerequisites

- Node.js `>= 24.0.0` (v24.4.1+ recommended)
- pnpm `>= 9.15.0` (`npm install -g pnpm@9.15.0`)

### Setup Instructions

1. **Fork & Clone Repository**:

   ```bash
   git clone https://github.com/dewasemadi/mobile-devtools.git
   cd mobile-devtools
   ```

2. **Install Workspace Dependencies**:

   ```bash
   pnpm install
   ```

3. **Start Development Watchers**:
   ```bash
   pnpm dev
   ```
   This launches:
   - Web Documentation Portal on `http://localhost:3000`
   - React Example App on `http://localhost:3001`
   - Vue Example App on `http://localhost:3002`
   - Vanilla JS Example App on `http://localhost:3003`

---

## 🧪 Testing Guidelines

All submitted pull requests must pass type checks, unit tests, and Playwright E2E tests.

### Type Checks

```bash
pnpm check-types
```

### Unit Testing (`Vitest`)

Write unit tests for new features in `src/**/__tests__/*.test.ts`:

```bash
# Run unit test suite
pnpm test

# Run unit tests with V8 coverage
pnpm test:coverage
```

### End-to-End Testing (`Playwright`)

Write E2E tests in `apps/web/e2e/*.spec.ts`:

```bash
# Run Playwright E2E suite
pnpm test:e2e
```

---

## 📝 Commit Message Guidelines

We follow **Conventional Commits** for clean git history:

- `feat(mobile-devtools)`: New core feature or adapter enhancement.
- `feat(web)`: Feature addition to web documentation app.
- `feat(examples)`: Enhancement to example test apps.
- `fix(core)`: Bug fix in core engine, DOM host, or interceptors.
- `docs`: Documentation updates in `README.md` or `docs/`.
- `chore`: Monorepo maintenance, package updates, or tooling configuration.

---

## 📥 Pull Request Workflow

1. Create a descriptive branch (`git checkout -b feat/custom-tab-icon`).
2. Make your changes and write/update unit or E2E tests.
3. Verify that `pnpm check-types`, `pnpm test`, and `pnpm build` pass locally.
4. Push your branch and open a Pull Request against the `master` branch.
5. Provide a clear summary of your changes and link any related issues.
