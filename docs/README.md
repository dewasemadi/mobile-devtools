# Mobile DevTools Documentation

Welcome to the comprehensive technical documentation for **`mobile-devtools`** — a next-generation, framework-agnostic in-app mobile debugger and inspector overlay for web applications.

---

## 📚 Documentation Guides

1. [**01. Technical Architecture & Design**](./01-architecture.md)
   - High-level architecture & data flow diagrams.
   - Native Shadow DOM encapsulation (`<mobile-devtools-root>`).
   - Reactive Store & Event Emitter state management (`DevToolsStore`).
   - Interceptor mechanics (`ConsoleInterceptor`, `NetworkInterceptor`).

2. [**02. Getting Started & Framework Integrations**](./02-getting-started.md)
   - Installation & package exports (`mobile-devtools`, `mobile-devtools/react`, `mobile-devtools/vue`).
   - Integration guides for **React 18/19**, **Vue 3**, **Vanilla JS**, **Next.js App/Pages Router**, and **Vite**.

3. [**03. Core Features Breakdown**](./03-core-features.md)
   - **Console Tab**: Interception, log levels, search filtering, JSON tree inspector.
   - **Network Tab**: Fetch/XHR interception, headers, timing, JSON previews, network throttling simulator (`Slow 3G`, `Fast 3G`, `Offline`).
   - **Elements Tab**: Real-time HTML DOM tree browser, element picker, box model visualization, computed styles, grouped style categories.
   - **Storage Tab**: Real-time `localStorage`, `sessionStorage`, and `document.cookie` manager.
   - **System Tab**: Real-time viewport, DPR, memory diagnostics, orientation listener.
   - **Bug Exporter**: 1-click Web Share API (`navigator.share`) report generator.

4. [**04. Full Configuration & API Reference**](./04-configuration-api.md)
   - Exhaustive TypeScript interfaces (`DevToolsConfig`, `DevToolsTheme`, `BadgeRenderProps`, `CustomTabDefinition`, `PrivacyConfig`).
   - Complete props and option descriptions with defaults.

5. [**05. Custom Tabs & Fine-Grained Styling**](./05-custom-tabs-and-styles.md)
   - Building pluggable consumer tabs with custom DOM rendering callbacks (`render(container)`).
   - Custom raw CSS injection into Shadow DOM (`styles`) and Custom Badge crafting (`renderBadge`).

6. [**06. Production Safety & Security**](./06-production-and-security.md)
   - Zero-bundle-leak tree-shaking dynamic import patterns.
   - Data privacy and automatic sensitive header/body masking (`privacy.mask`).
   - Non-secure HTTP context fallback handling.

7. [**07. Testing, Monorepo & Contributing Guide**](./07-testing-and-contributing.md)
   - Turborepo & pnpm workspace structure.
   - Running Vitest unit test suite (65 tests) with V8 coverage.
   - Running Playwright E2E tests (21 tests) across Desktop Chrome, Mobile Chrome, and Mobile Safari.
   - Contribution workflow & Semantic Commit standards.
