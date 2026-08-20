# Changelog

All notable changes to the `mobile-devtools` package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.6.0] - 2026-08-20

### 🎨 Custom Raw CSS Injection & Pluggable `renderBadge` Crafting

#### Added

- **Pluggable `renderBadge` Custom Callback**: Added `renderBadge?: (container: HTMLElement, props: BadgeRenderProps) => void` configuration option. Consumers can now completely craft their own inner HTML/DOM structure for the floating badge.
- **`BadgeRenderProps` Helper API**: Provided `unreadErrors`, `unreadWarnings`, `unreadTotal`, `isOpen`, `toggle()`, `open()`, and `close()` helper methods directly to `renderBadge` callback.
- **Drag-and-Drop & Snapping Preservation**: `renderBadge` custom DOM renders inside `.devtools-badge` container, preserving 100% of pointer drag gestures, viewport bounds clamping, and magnetic edge snapping (`autoSnapBadge`).

#### Fixed & Improved

- **Custom Raw CSS Injection**: Replaced legacy `DevToolsStyles` object with `styles?: string`, allowing consumers to inject raw CSS strings directly into Shadow DOM root targeting `.devtools-badge`, `:hover`, `.devtools-tab-btn.active`, etc.
- **Native Browser Image Drag Prevention**: Applied `pointer-events: none`, `-webkit-user-drag: none`, and `user-select: none` to image elements inside `.devtools-badge` to prevent native browser image drag interference during touch drag gestures.
- **Documentation & Web App API Table**: Synchronized all guides, README files, and live web portal API Reference table with the new `styles?: string` and `renderBadge` specifications.

---

## [1.5.2] - 2026-08-19

### 🎨 Theme Persistence, Input Touch Navigation & Elements UI Polish

#### Fixed & Improved

- **Theme Mode & Badge Position Persistence**: Fixed an issue where saved theme preference (`__mobile_devtools_theme__`) and badge position (`__mobile_devtools_position__`) in `localStorage` were overridden back to initial config defaults when `updateConfig()` ran during framework component mounts (React `useEffect`, Vue watcher, or SPA page reloads).
- **Mobile & Desktop Input Touch Scroll**: Resolved a scroll lock issue where horizontal text panning and caret selection inside input fields (`.devtools-search-input`, `.devtools-attr-input`) were blocked on mobile touch devices and Chrome Desktop.
- **Directional Scroll Lock Guard**: Refined `setupScrollLockGuard` with directional touch detection to prevent scroll jamming across Chrome Desktop emulation and mobile touch viewports while isolating host page bounce.
- **Attributes Input & Add Button UI**: Aligned `.devtools-attr-input` styling to 32px height matching standard search inputs and action buttons, and repositioned the "Add Attribute" (`+`) button to the far right of the attributes toolbar header.

---

## [1.5.1] - 2026-08-19

### 🌐 Live Mobile WebView URL Inspector & Storage Freeze Fix

#### Added

- **Live Mobile WebView URL Inspector**: System Tab support for inspecting and copying the current active page URL (`window.location.href`), designed specifically for Mobile WebViews (iOS `WKWebView`, Android `WebView`, Gojek/Grab/Instagram in-app browsers).
- **Real-time SPA Route Tracking**: `LocationManager` automatically tracks Single-Page Application (SPA) route changes in real time across React Router, Vue Router, and SvelteKit via `popstate`, `hashchange`, and history method interception (`pushState`, `replaceState`).
- **Icon-Only Action Buttons**: Updated Copy URL and Copy Info actions in System Tab to clean icon-only buttons with instant `✓` toast feedback.

#### Fixed & Improved

- **IndexedDB Empty State Recursion Freeze**: Fixed an infinite re-render loop in `StorageTabView` that froze the drawer when switching to `indexedDB` on origins with zero databases.
- **System Tab Scrollability**: Fixed an issue where `SystemTabView` content could not be scrolled by applying `overflowY: 'auto'` and `flex: 1`.
- **NPM Package Footprint**: Simplified `"files": ["dist"]` in `package.json` and set `publicDir: false` in `vite.config.ts`, keeping `node_modules` footprint ultra-lean (~153 kB).

---

## [1.4.0] - 2026-08-19

### 📱 IndexedDB Inspector, Status Breakdown Filters, Automated Screenshots & Svelte Harness

#### Added

- **IndexedDB Database & Object Store Inspector**: Complete Storage Tab support for inspecting and editing IndexedDB databases, object stores, and records alongside LocalStorage, SessionStorage, and Cookies.
- **Unified Network Status Breakdown & Class Filters**: Added HTTP status code class filters (`2xx Success`, `3xx Redirect`, `4xx Client Error`, `5xx Server Error`, `1xx Info`, `Network Error`) and unified sorting (`Newest`, `Oldest`, `Slowest`, `Fastest`) in the Network Tab.
- **Automated Light Mode Mobile Screenshots**: Added Playwright automated screenshot generator script (`pnpm generate:screenshots`) capturing high-res Retina @3x iPhone 14/15 Pro Max Light Mode viewports with simulated iOS Status Bar and Mobile Safari Address Bar.
- **Svelte 4/5 Monorepo Example App**: Added `examples/svelte` test harness app on Port `3003` to test Svelte integration end-to-end alongside React (`3001`), Vue (`3002`), and Vanilla (`3004`).
- **Tailwind CSS ESLint & Prettier Integration**: Configured `eslint-plugin-tailwindcss` and `prettier-plugin-tailwindcss` flat configs across monorepo packages.

#### Fixed & Improved

- **Node & pnpm Requirements**: Standardized Node.js minimum requirement to `>= 24.0.0` (Node 24.4.1+ recommended) and pnpm `9.15.0`.
- **`shakeToToggle` Documentation**: Updated configuration references in `README.md`, `packages/mobile-devtools/README.md`, and web portal landing page API table.
- **Vite Cloudflare Compatibility**: Added environment variable flag (`NO_CLOUDFLARE=true`) to cleanly bypass Cloudflare plugin during local screenshot and dev automation runs.

---

## [1.3.0] - 2026-08-17

### ⚡ Real-time SSE/WebSocket Interception & Shake-to-Toggle Motion Detection

#### Added

- **Svelte 4/5 Framework Adapter**: Added first-class Svelte adapter (`mobile-devtools/svelte`) with reactive store support (`mobileDevTools`), `useMobileDevTools()` action directive, and `peerDependencies` declarations.
- **Real-time EventSource (SSE) Stream Interception**: Intercepts native SSE streams (`text/event-stream`), custom event listeners (`es.addEventListener(...)`), and streams live payload updates directly to the Network tab.
- **WebSocket Real-time Frame Interception**: Captures incoming and outgoing WebSocket frames with live payload inspection and real-time tab frame counter updates.
- **`shakeToToggle` Physical Motion Gesture**: Toggle the DevTools overlay by shaking physical mobile devices. Built with a low-pass gravity filter sensor fusion and seamless iOS Safari permission request handling.
- **Smart Scroll Preserving & Auto-scroll**: Preserves exact list scroll position when inspecting past logs/frames during fast live streaming, and auto-scrolls to bottom when monitoring live activity.
- **Full TSDoc/JSDoc Annotations**: Comprehensive IDE hover tooltips, `@default` values, and `@example` code blocks across all types, `DevToolsConfig`, and utility functions.

#### Fixed & Improved

- **Badge Count Cap**: Standardized all unread count badges and counter labels to cap at `99+`.
- **Crypto-based `generateId(prefix)`**: Created collision-free ID generator using `crypto.randomUUID()` with fallback.
- **Style Source of Truth**: Consolidated badge custom styling to `config.styles?.badge` and removed redundant top-level `badgeStyle` prop.
- **Dead Code Cleanup**: Audited `apps/web/src` and removed unused `DevToolsWrapper` component.

---

## [1.2.0] - 2026-08-17

### 🔒 Scroll Locking, Adapter Test Coverage & E2E Suite

#### Added

- **Background Scroll Locking**: Prevents body scrolling when DevTools drawer overlay is open.
- **Framework Adapter Tests**: Added comprehensive unit test suites for React (`react.test.tsx`) and Vue (`vue.test.ts`) adapters.
- **Web App E2E Test Suite**: Added Playwright E2E coverage for Elements, Network, Storage, and Theme System interactions.

#### Fixed & Improved

- **Vue Adapter Hook**: Resolved TypeScript narrowing issue on `useMobileDevTools()` return type in strict mode.
- **Network & Storage Tab Formatting**: Enhanced HTTP status pills, response time indicators, JSON response headers formatting, and item action buttons.
- **Console & Storage Utilities**: Added clipboard copy and export capabilities with dedicated unit tests.

---

## [1.0.2] - 2026-08-17

### 🚀 Web App & Documentation Enhancements

#### Added

- **UI Showcase**: Added high-resolution screenshots for Console, Network, Elements, Storage, and System Info tabs in `README.md`.
- **Shared URL Constants**: Centralized project URLs (`SITE`, `GITHUB`, `NPM`) in `@/shared/constants` for consistent consumer navigation.
- **`robots.txt`**: Added `robots.txt` with Sitemap reference for web application SEO.

#### Fixed & Improved

- **Cloudflare Deployment**: Resolved asset upload infinite redirect loop by removing redundant `_redirects` file and switching build script to Node 24 support.
- **Dynamic Versioning**: Replaced hardcoded version strings in Web UI footer with dynamic `VERSION` import from `mobile-devtools`.
- **Git & Build Hygiene**: Ignored `.wrangler` state directory in `.gitignore` and untracked build artifacts.

---

## [1.0.1] - 2026-08-17

### 🎨 Theme Support & Documentation Polish

#### Added

- **npm Compatibility**: Replaced Mermaid diagram in package `README.md` with ASCII architecture diagrams for clean rendering on npmjs.com package page.
- **Theme Color Synchronization**: Added mobile status bar meta theme color syncing (`#090d16`) in web portal application.
- **Monorepo Build Pipelines**: Added prebuild script to automatically build `mobile-devtools` package before web app build step.

---

## [1.0.0] - 2026-08-17

### 🎉 Initial Public Release

`mobile-devtools` is a next-generation, framework-agnostic in-app mobile debugger and inspector overlay for web applications.

#### Added

- **Core Engine & Reactive Store**:
  - `DevToolsStore` state management with reactive subscription model, unread error counters, and buffer caps.
  - Native Shadow DOM encapsulation (`<mobile-devtools-root>`) guaranteeing 0% CSS leaks into host applications.
- **Console Inspector (`Console Tab`)**:
  - Real-time interception of `console.log`, `info`, `warn`, `error`, and `debug`.
  - Filter by log severity levels and live text search query filter.
  - Interactive JSON tree viewer (`<json-tree>`) for deep nested objects and arrays.
- **Network Inspector (`Network Tab`)**:
  - Interception of modern `window.fetch` and legacy `XMLHttpRequest` (XHR).
  - HTTP status pills, latency timing (ms), request/response headers, and JSON body preview.
  - Network Throttling Simulator (`Online`, `Fast 3G`, `Slow 3G`, `Offline`).
- **DOM Elements Inspector (`Elements Tab`)**:
  - Real-time HTML DOM tree browser with collapsible nodes and interactive element picker.
  - Box model layout visualizer (`margin`, `border`, `padding`, `content`).
  - Grouped computed CSS styles (Layout, Flexbox, Grid, Typography, Colors).
- **Storage Inspector (`Storage Tab`)**:
  - Real-time inspector and inline editor for `localStorage`, `sessionStorage`, and `document.cookie`.
- **System Diagnostics (`System Tab`)**:
  - Real-time viewport dimensions, device pixel ratio (DPR), User Agent string, JS heap memory diagnostics, and orientation listener.
- **Extension & Customization API**:
  - Pluggable custom consumer tabs via `customTabs` prop with DOM rendering callbacks.
  - Fine-grained UI component styling overrides via `styles` prop (`{ badge, drawer, overlay, handle }`).
  - Sensitive data masking via `privacy.mask` prop.
- **Framework Adapters**:
  - Vanilla JavaScript adapter (`createMobileDevTools`).
  - React 18/19 adapter (`mobile-devtools/react`).
  - Vue 3 adapter (`mobile-devtools/vue`).
- **Quality Assurance & Testing**:
  - 65 Unit Tests (100% Passed) via Vitest with V8 coverage.
  - 21 Playwright E2E Tests (100% Passed) across Chromium, Mobile Chrome, and Mobile Safari.
