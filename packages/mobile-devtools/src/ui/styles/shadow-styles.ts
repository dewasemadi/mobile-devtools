export const SHADOW_STYLES = `
:host {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  box-sizing: border-box;
}

.mobile-devtools-container {
  pointer-events: none !important;
}

.mobile-devtools-container.theme-dark {
  /* DevTools Palette (Dark Mode) */
  --dev-bg: #0c0c0e;
  --dev-bg-200: #141417;
  --dev-bg-300: #1c1c21;
  --dev-card-bg: #141417;
  --dev-card-border: #292932;
  --dev-border: #22222a;
  --dev-text: #e2e8f0;
  --dev-text-bright: #f8fafc;
  --dev-text-muted: #94a3b8;
  --dev-accent: #38bdf8;
  --dev-error: #f87171;
  --dev-error-bg: #2d1517;
  --dev-error-border: #7f1d1d;
  --dev-btn-danger-bg: #2d1416;
  --dev-btn-danger-border: #6b1d22;
  --dev-btn-danger-text: #fca5a5;
  --dev-btn-danger-hover: #451a1d;
  --dev-warn: #fbbf24;
  --dev-warn-bg: #2e1d08;
  --dev-success: #4ade80;
  --dev-success-bg: #0e2e1b;
  --dev-font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --dev-font-mono: "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  
  /* Method Pill GET Colors */
  --dev-method-get-bg: #0c2a4a;
  --dev-method-get-text: #38bdf8;
  --dev-method-get-border: #0284c7;

  /* Select Dropdown Arrow Icon (Dark Mode) */
  --dev-select-arrow-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2394a3b8' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");

  /* Syntax Highlighting (Dark Mode) */
  --json-key: #f472b6;
  --json-string: #2dd4bf;
  --json-number: #fbbf24;
  --json-boolean: #c084fc;
  --json-null: #60a5fa;
  --json-tree-arrow: #94a3b8;
  
  color: var(--dev-text);
}

.mobile-devtools-container.theme-light {
  /* Premium DevTools Palette (Light Mode) */
  --dev-bg: #ffffff;
  --dev-bg-200: #f8fafc;
  --dev-bg-300: #f1f5f9;
  --dev-card-bg: #f8fafc;
  --dev-card-border: #e2e8f0;
  --dev-border: #e2e8f0;
  --dev-text: #334155;
  --dev-text-bright: #0f172a;
  --dev-text-muted: #64748b;
  --dev-accent: #0284c7;
  --dev-error: #dc2626;
  --dev-error-bg: #fef2f2;
  --dev-error-border: #fca5a5;
  --dev-btn-danger-bg: #fef2f2;
  --dev-btn-danger-border: #fca5a5;
  --dev-btn-danger-text: #dc2626;
  --dev-btn-danger-hover: #fee2e2;
  --dev-warn: #d97706;
  --dev-warn-bg: #fffbeb;
  --dev-success: #16a34a;
  --dev-success-bg: #f0fdf4;
  --dev-font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --dev-font-mono: "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;

  /* Method Pill GET Colors (Light Mode) */
  --dev-method-get-bg: #f0f9ff;
  --dev-method-get-text: #0284c7;
  --dev-method-get-border: #bae6fd;

  /* Select Dropdown Arrow Icon (Light Mode) */
  --dev-select-arrow-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2364748b' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");

  /* Syntax Highlighting (Light Mode) */
  --json-key: #db2777;
  --json-string: #0d9488;
  --json-number: #d97706;
  --json-boolean: #9333ea;
  --json-null: #2563eb;
  --json-tree-arrow: #64748b;

  color: var(--dev-text);
}

*, *:before, *:after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  scrollbar-width: thin;
  scrollbar-color: var(--dev-card-border) transparent;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--dev-card-border);
  border-radius: 9999px;
  transition: background 0.2s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--dev-text-muted);
}

/* JSON Tree Syntax Colors */
.devtools-json-container {
  font-family: var(--dev-font-mono);
  font-size: 12px;
  line-height: 1.6;
}

.devtools-json-key {
  color: var(--json-key);
  font-weight: 600;
  font-family: var(--dev-font-mono);
  white-space: nowrap;
  flex-shrink: 0;
}

.devtools-json-string {
  color: var(--json-string);
  font-family: var(--dev-font-mono);
  word-break: break-all;
}

.devtools-json-number {
  color: var(--json-number);
  font-weight: 600;
  font-family: var(--dev-font-mono);
}

.devtools-json-boolean {
  color: var(--json-boolean);
  font-weight: 700;
  font-family: var(--dev-font-mono);
}

.devtools-json-null {
  color: var(--json-null);
  font-style: italic;
  font-family: var(--dev-font-mono);
}

.devtools-json-toggle {
  color: var(--json-tree-arrow);
  cursor: pointer;
  user-select: none;
  font-size: 12px;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  transition: opacity 0.15s ease;
}

.devtools-json-toggle:hover {
  opacity: 0.8;
}

/* Floating Badge */
.devtools-badge {
  position: fixed;
  pointer-events: auto !important;
  height: 38px;
  max-width: calc(100vw - 24px);
  box-sizing: border-box;
  padding: 0 12px;
  border-radius: 20px;
  background: var(--dev-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--dev-card-border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: grab;
  user-select: none;
  touch-action: none;
  z-index: 2147483647;
  transition: border-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
  font-family: var(--dev-font-mono);
  font-size: 12px;
  font-weight: 600;
  color: var(--dev-text-bright);
}

.devtools-badge:active {
  cursor: grabbing;
  transform: scale(1.05);
}

.devtools-badge * {
  pointer-events: none;
  -webkit-user-drag: none;
  user-select: none;
}

.devtools-badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--dev-accent);
  box-shadow: 0 0 8px var(--dev-accent);
  flex-shrink: 0;
}

.devtools-badge-dot.error {
  background: var(--dev-error);
  box-shadow: 0 0 10px var(--dev-error);
}

.devtools-badge-dot.warn {
  background: var(--dev-warn);
  box-shadow: 0 0 8px var(--dev-warn);
}

.devtools-badge-label {
  color: var(--dev-text-bright);
  letter-spacing: -0.01em;
}

.devtools-badge-tag {
  background: var(--dev-card-border);
  color: var(--dev-text-muted);
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 700;
}

.devtools-badge-count {
  background: var(--dev-error);
  color: #ffffff;
  font-size: 10px;
  font-weight: 800;
  padding: 1px 6px;
  border-radius: 10px;
  margin-left: 2px;
}

/* Drawer Overlay & Panel */
.devtools-drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 2147483646;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  overscroll-behavior: contain;
  touch-action: none;
}

.devtools-drawer-overlay.open {
  opacity: 1;
  pointer-events: auto;
}

.devtools-drawer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 88vh;
  max-height: 840px;
  background: var(--dev-bg);
  border-top: 1px solid var(--dev-card-border);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  display: flex;
  flex-direction: column;
  z-index: 2147483647;
  transform: translateY(100%);
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.28s;
  overflow: hidden;
  will-change: transform;
  visibility: hidden;
  pointer-events: none;
  overscroll-behavior: contain;
  touch-action: pan-x pan-y;
  -webkit-overflow-scrolling: touch;
}

.devtools-drawer.open {
  transform: translateY(0);
  visibility: visible;
  pointer-events: auto !important;
  box-shadow: 0 -16px 48px rgba(0, 0, 0, 0.2);
}

/* Handle Area */
.devtools-handle-area {
  width: 100%;
  padding: 10px 0 6px 0;
  background: var(--dev-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  touch-action: none;
  user-select: none;
}
.devtools-handle-area:active {
  cursor: grabbing;
}

.devtools-handle-bar {
  width: 40px;
  height: 5px;
  background: var(--dev-card-border);
  border-radius: 3px;
  transition: background 0.15s ease;
}

.devtools-handle-area:hover .devtools-handle-bar {
  background: var(--dev-text-muted);
}

/* Header Bar */
.devtools-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  background: var(--dev-bg);
  border-bottom: 1px solid var(--dev-border);
  cursor: grab;
  touch-action: none;
  user-select: none;
}

.devtools-header:active {
  cursor: grabbing;
}

.devtools-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  cursor: grab;
}

.devtools-header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: default;
}

.devtools-logo-icon {
  width: 18px;
  height: 18px;
  min-width: 18px;
  min-height: 18px;
  display: inline-block;
  color: var(--dev-accent);
  stroke: var(--dev-accent);
  fill: none;
  flex-shrink: 0;
}

.devtools-pill-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 14px;
  font-size: 11px;
  font-weight: 700;
  font-family: var(--dev-font-mono);
  background: var(--dev-card-bg);
  border: 1px solid var(--dev-accent);
  color: var(--dev-accent);
  white-space: nowrap;
}

.devtools-pill-badge.error {
  background: var(--dev-error-bg);
  border-color: var(--dev-error-border);
  color: var(--dev-error);
}

.devtools-header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.devtools-icon-btn {
  background: transparent;
  border: none;
  color: var(--dev-text-muted);
  width: 32px;
  height: 32px;
  min-width: 32px;
  min-height: 32px;
  max-width: 32px;
  max-height: 32px;
  padding: 0;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.devtools-icon-btn:hover {
  background: var(--dev-card-bg);
  color: var(--dev-text-bright);
}

.devtools-icon-btn.active {
  color: var(--dev-accent);
  background: rgba(56, 189, 248, 0.15);
  border: 1px solid var(--dev-accent);
}

.devtools-btn.devtools-btn-icon-only {
  background: var(--dev-card-bg);
  border: 1px solid var(--dev-card-border);
  color: var(--dev-text-bright);
  width: 32px;
  height: 32px;
  min-width: 32px;
  min-height: 32px;
  max-width: 32px;
  max-height: 32px;
  padding: 0;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.devtools-icon-btn svg,
.devtools-btn svg {
  width: 16px;
  height: 16px;
  min-width: 16px;
  min-height: 16px;
  max-width: 16px;
  max-height: 16px;
  flex-shrink: 0;
  display: block;
  aspect-ratio: 1 / 1;
}

.devtools-icon-btn:hover {
  background: var(--dev-border);
  color: var(--dev-text-bright);
}

/* Segmented Tabs Bar */
.devtools-tabs-bar {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: var(--dev-bg);
  padding: 6px 12px;
  border-bottom: 1px solid var(--dev-border);
  gap: 6px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-x pan-y;
}

.devtools-tab-btn {
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 600;
  font-family: var(--dev-font-mono);
  color: var(--dev-text-muted);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  height: 30px;
}

.devtools-tab-btn:hover {
  color: var(--dev-text-bright);
  background: var(--dev-border);
}

.devtools-tab-btn.active {
  color: var(--dev-accent);
  background: var(--dev-card-bg);
  border-color: var(--dev-accent);
}

/* Segmented Control (Parsed / Raw) */
.devtools-segmented-control {
  display: inline-flex;
  align-items: center;
  padding: 2px;
  background: var(--dev-bg-300);
  border: 1px solid var(--dev-card-border);
  border-radius: 6px;
  gap: 2px;
}

.devtools-segmented-btn {
  background: transparent;
  border: none;
  color: var(--dev-text-muted);
  font-size: 11px;
  font-weight: 600;
  font-family: var(--dev-font-mono);
  padding: 2px 10px;
  height: 22px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.devtools-segmented-btn:hover {
  color: var(--dev-text-bright);
}

.devtools-segmented-btn.active {
  background: var(--dev-card-bg);
  color: var(--dev-accent);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--dev-accent);
}

.devtools-tab-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--dev-bg);
  overflow: hidden;
  position: relative;
}

/* Mobile Toolbar */
.devtools-toolbar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: var(--dev-bg);
  border-bottom: 1px solid var(--dev-border);
  flex-wrap: nowrap;
}

.devtools-search-input {
  flex: 1;
  min-width: 80px;
  height: 32px;
  background: var(--dev-card-bg);
  border: 1px solid var(--dev-card-border);
  color: var(--dev-text-bright);
  padding: 0 10px;
  border-radius: 6px;
  font-size: 12px;
  font-family: var(--dev-font-mono);
  outline: none;
  touch-action: pan-x pan-y;
  -webkit-user-select: text;
  user-select: text;
  transition: border-color 0.15s ease;
}

.devtools-search-input:focus {
  border-color: var(--dev-accent);
}

/* Buttons */
.devtools-btn {
  background: var(--dev-card-bg);
  border: 1px solid var(--dev-card-border);
  color: var(--dev-text-bright);
  height: 32px;
  min-width: 32px;
  padding: 0 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  font-family: var(--dev-font-mono);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.15s ease;
}

.devtools-btn.sm {
  height: 26px;
  font-size: 11px;
  padding: 0 8px;
  border-radius: 5px;
}

.devtools-btn:hover:not(:disabled) {
  background: var(--dev-border);
}

.devtools-btn.active {
  background: var(--dev-accent);
  color: #ffffff;
  border-color: var(--dev-accent);
}

.devtools-btn-danger,
.devtools-btn.devtools-btn-danger {
  color: var(--dev-btn-danger-text);
  border: 1px solid var(--dev-btn-danger-border);
  background-color: var(--dev-btn-danger-bg);
}
.devtools-btn:disabled,
.devtools-icon-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

/* Select Dropdown */
.devtools-select {
  appearance: none;
  -webkit-appearance: none;
  height: 32px;
  background-color: var(--dev-card-bg);
  background-image: var(--dev-select-arrow-icon);
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding: 0 24px 0 10px;
  border: 1px solid var(--dev-card-border);
  border-radius: 6px;
  color: var(--dev-text-bright);
  font-size: 12px;
  font-family: var(--dev-font-mono);
  font-weight: 600;
  cursor: pointer;
  outline: none;
  flex-shrink: 0;
}

.devtools-select option {
  background-color: var(--dev-bg);
  color: var(--dev-text-bright);
  font-size: 12px;
  font-family: var(--dev-font-mono);
  padding: 8px;
}

/* List Scroll */
.devtools-list-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  padding: 10px;
  font-family: var(--dev-font-mono);
  font-size: 12px;
  line-height: 1.5;
}

/* Code & Log Cards */
.devtools-code-card {
  background: var(--dev-card-bg);
  border: 1px solid var(--dev-card-border);
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 8px;
  font-size: 12px;
  line-height: 1.5;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  max-width: 100%;
}

.devtools-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--dev-border);
  font-size: 11px;
}

.devtools-file-path {
  color: var(--dev-text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
}

.devtools-log-content {
  color: var(--dev-text-bright);
  word-break: break-word;
}

/* Network Row */
.devtools-network-row {
  background: var(--dev-card-bg);
  border: 1px solid var(--dev-card-border);
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.devtools-network-row:hover {
  border-color: var(--dev-accent);
}

.devtools-network-title {
  font-weight: 600;
  font-size: 12px;
  color: var(--dev-text-bright);
}

.devtools-network-url {
  font-size: 11px;
  color: var(--dev-text-muted);
  text-overflow: ellipsis;
  overflow: hidden;
}

.devtools-method-pill {
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 10px;
  font-family: var(--dev-font-mono);
}
.devtools-method-pill.GET {
  background: var(--dev-method-get-bg);
  color: var(--dev-method-get-text);
  border: 1px solid var(--dev-method-get-border);
}
.devtools-method-pill.POST {
  background: var(--dev-success-bg);
  color: var(--dev-success);
  border: 1px solid rgba(74, 222, 128, 0.3);
}
.devtools-method-pill.PUT {
  background: var(--dev-warn-bg);
  color: var(--dev-warn);
  border: 1px solid rgba(251, 191, 36, 0.3);
}
.devtools-method-pill.DELETE {
  background: var(--dev-error-bg);
  color: var(--dev-error);
  border: 1px solid var(--dev-error-border);
}

.devtools-status-pill {
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 11px;
}
.devtools-status-pill.success {
  background: var(--dev-success-bg);
  color: var(--dev-success);
}
.devtools-status-pill.error {
  background: var(--dev-error-bg);
  color: var(--dev-error);
}
.devtools-status-pill.pending {
  background: var(--dev-warn-bg);
  color: var(--dev-warn);
}

.devtools-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  font-family: var(--dev-font-mono);
}

.devtools-table th, .devtools-table td {
  padding: 8px 10px;
  border-bottom: 1px solid var(--dev-card-border);
  text-align: left;
}

.devtools-table th {
  background: var(--dev-card-bg);
  color: var(--dev-text-muted);
  font-weight: 600;
  font-size: 11px;
}

.devtools-user-agent-box {
  padding: 10px;
  background: var(--dev-card-bg);
  border-radius: 6px;
  font-size: 11px;
  border: 1px solid var(--dev-card-border);
  word-break: break-all;
  font-family: var(--dev-font-mono);
  color: var(--dev-text-bright);
}

.devtools-detail-modal {
  position: absolute;
  inset: 0;
  background: var(--dev-bg);
  z-index: 10;
  display: flex;
  flex-direction: column;
}

/* Elements Tab Styles */
.devtools-elements-breadcrumbs {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: var(--dev-card-bg);
  border-bottom: 1px solid var(--dev-border);
  overflow-x: auto;
  white-space: nowrap;
  font-family: var(--dev-font-mono);
  font-size: 11px;
}

.devtools-breadcrumb-item {
  border: none;
  background: transparent;
  color: var(--dev-text-muted);
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  font-family: var(--dev-font-mono);
  font-size: 11px;
}

.devtools-breadcrumb-item:hover,
.devtools-breadcrumb-item.active {
  color: var(--dev-accent);
  background: rgba(56, 189, 248, 0.1);
}

.devtools-breadcrumb-sep {
  color: var(--dev-text-muted);
  font-size: 10px;
}

.devtools-elements-view {
  padding: 8px 12px;
  overflow-x: auto !important;
  -webkit-overflow-scrolling: touch;
}

.devtools-dom-tree {
  font-family: var(--dev-font-mono);
  font-size: 12px;
  line-height: 1.5;
  min-width: max-content;
}

.devtools-dom-node {
  display: flex;
  align-items: center;
  padding: 3px 6px;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
}

.devtools-dom-node:hover {
  background: var(--dev-card-bg);
}

.devtools-dom-node.selected {
  background: rgba(56, 189, 248, 0.15);
  border-left: 2px solid var(--dev-accent);
}

.devtools-dom-expander {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-right: 4px;
  cursor: pointer;
  color: var(--dev-text-muted);
}

.devtools-dom-tag-line {
  color: var(--dev-text-bright);
}

.devtools-dom-tag-line .tag-name {
  color: #f472b6;
  font-weight: 600;
}

.devtools-dom-tag-line .attr-name {
  color: #38bdf8;
}

.devtools-dom-tag-line .attr-val {
  color: #2dd4bf;
}

.devtools-dom-tag-line .text-node {
  color: var(--dev-text);
  margin: 0 4px;
}

/* Box Model Visual (Chrome DevTools Theme & Interactivity) */
.devtools-box-model {
  font-family: var(--dev-font-mono);
  font-size: 10px;
  text-align: center;
  margin-bottom: 16px;
  user-select: none;
}

.box-model-margin {
  background: rgba(248, 148, 6, 0.2);
  border: 1px dashed rgba(248, 148, 6, 0.6);
  padding: 18px 24px;
  position: relative;
  border-radius: 6px;
  transition: all 0.15s ease;
  cursor: default;
}
.box-model-margin:hover {
  background: rgba(248, 148, 6, 0.35);
  border-color: rgba(248, 148, 6, 0.9);
}

.box-model-border {
  background: rgba(255, 228, 125, 0.2);
  border: 1px solid rgba(255, 228, 125, 0.6);
  padding: 18px 24px;
  position: relative;
  border-radius: 4px;
  transition: all 0.15s ease;
}
.box-model-border:hover {
  background: rgba(255, 228, 125, 0.35);
  border-color: rgba(255, 228, 125, 0.9);
}

.box-model-padding {
  background: rgba(195, 226, 172, 0.25);
  border: 1px dashed rgba(195, 226, 172, 0.7);
  padding: 18px 24px;
  position: relative;
  border-radius: 4px;
  transition: all 0.15s ease;
}
.box-model-padding:hover {
  background: rgba(195, 226, 172, 0.45);
  border-color: rgba(195, 226, 172, 1);
}

.box-model-content {
  background: rgba(143, 186, 233, 0.3);
  border: 1px solid rgba(143, 186, 233, 0.7);
  padding: 10px 16px;
  border-radius: 2px;
  font-weight: 600;
  color: var(--dev-text-bright);
  transition: all 0.15s ease;
}
.box-model-content:hover {
  background: rgba(143, 186, 233, 0.5);
  border-color: rgba(143, 186, 233, 1);
}

.box-label {
  position: absolute;
  top: 2px;
  left: 4px;
  color: var(--dev-text-muted);
  font-size: 9px;
  font-weight: 600;
}

.box-val {
  position: absolute;
  color: var(--dev-text-bright);
  font-size: 10px;
  font-weight: 600;
}
.box-val.top { top: 2px; left: 50%; transform: translateX(-50%); }
.box-val.bottom { bottom: 2px; left: 50%; transform: translateX(-50%); }
.box-val.left { left: 4px; top: 50%; transform: translateY(-50%); }
.box-val.right { right: 4px; top: 50%; transform: translateY(-50%); }

/* Grouped Style Category Accordion */
.devtools-styles-groups {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 6px;
}

.devtools-style-category-header {
  display: flex;
  align-items: center;
  padding: 6px 10px;
  background: var(--dev-card-bg);
  border: 1px solid var(--dev-card-border);
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
  transition: background 0.15s ease;
}

.devtools-style-category-header:hover {
  background: var(--dev-border);
}

.category-expander {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  color: var(--dev-text-muted);
  margin-right: 6px;
}

.category-title {
  font-weight: 600;
  color: var(--dev-text-bright);
  font-size: 11px;
  font-family: var(--dev-font-mono);
  flex: 1;
}

.category-count {
  background: var(--dev-bg-300);
  color: var(--dev-text-muted);
  font-size: 10px;
  font-family: var(--dev-font-mono);
  padding: 1px 6px;
  border-radius: 10px;
  font-weight: 600;
}

/* Styles & Attributes List */
.devtools-styles-list, .devtools-attrs-list {
  font-family: var(--dev-font-mono);
  font-size: 11px;
}

.devtools-style-row, .devtools-attr-row {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--dev-card-border);
}

.style-prop {
  color: var(--dev-accent);
  font-weight: 500;
}

.style-val {
  color: var(--dev-text-bright);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  word-break: break-all;
}

.color-swatch {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  border: 1px solid rgba(255,255,255,0.3);
  display: inline-block;
  flex-shrink: 0;
}

.attr-key {
  color: #f472b6;
  font-weight: 600;
  min-width: 70px;
}

.devtools-attr-input {
  flex: 1;
  min-width: 0;
  height: 32px;
  background: var(--dev-card-bg);
  border: 1px solid var(--dev-card-border);
  color: var(--dev-text-bright);
  padding: 0 10px;
  border-radius: 6px;
  font-size: 12px;
  font-family: var(--dev-font-mono);
  margin: 0 6px;
  outline: none;
  touch-action: pan-x pan-y;
  -webkit-user-select: text;
  user-select: text;
  transition: border-color 0.15s ease;
}

.devtools-attr-input:focus {
  border-color: var(--dev-accent);
}
`;
