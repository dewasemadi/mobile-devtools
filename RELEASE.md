# Release Guide (`RELEASE.md`)

This guide outlines the step-by-step release process for maintainers releasing new versions of **`mobile-devtools`** to npm and GitHub.

---

## 📋 Release Check-List

Before releasing a new version, ensure all Quality Assurance checks pass cleanly.

### 1. Run Type Checks & Linter

```bash
pnpm check-types
pnpm lint
```

### 2. Run Unit Test Suite

Ensure all 65 unit tests pass and check coverage:

```bash
pnpm test
pnpm test:coverage
```

### 3. Run Playwright E2E Tests

Ensure all 21 E2E tests pass across Chromium, Mobile Chrome, and Mobile Safari:

```bash
pnpm test:e2e
```

### 4. Build Production Bundles

Verify clean compilation of production dist artifacts:

```bash
pnpm build
```

---

## 🏷️ Version Bumping (Semantic Versioning)

From the package directory (`packages/mobile-devtools`):

- **Patch Release** (`1.0.0` $\rightarrow$ `1.0.1`): Bug fixes and non-breaking minor tweaks.

  ```bash
  cd packages/mobile-devtools
  npm version patch
  ```

- **Minor Release** (`1.0.0` $\rightarrow$ `1.1.0`): New features added in a backward-compatible manner.

  ```bash
  cd packages/mobile-devtools
  npm version minor
  ```

- **Major Release** (`1.0.0` $\rightarrow$ `2.0.0`): Incompatible API changes or breaking updates.
  ```bash
  cd packages/mobile-devtools
  npm version major
  ```

Update `packages/mobile-devtools/CHANGELOG.md` with the new version details under `## [X.Y.Z] - YYYY-MM-DD`.

---

## 🚀 Publishing to npm

### Option A: Monorepo Root Script (Recommended)

From the monorepo root directory:

```bash
pnpm publish-packages
```

### Option B: Package Directory (Manual)

```bash
cd packages/mobile-devtools
pnpm build
npm publish --access public
```

---

## 📌 Post-Release Steps

1. **Commit Release & Changelog**:

   ```bash
   git add .
   git commit -m "chore(release): publish vX.Y.Z"
   ```

2. **Create Git Tag & Push**:

   ```bash
   git tag vX.Y.Z
   git push origin master --tags
   ```

3. **GitHub Release**:
   Create a new release on GitHub targeting `vX.Y.Z` and copy the changelog entries for the release notes.
