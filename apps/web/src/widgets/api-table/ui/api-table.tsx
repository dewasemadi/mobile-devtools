'use client';

import React from 'react';

export const ApiTable: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div>
        <h2 className="text-dev-text-bright text-xl font-bold tracking-tight sm:text-2xl">
          API Reference & Configuration Props
        </h2>
        <p className="text-dev-text-muted text-sm">
          Complete specification of supported configuration options for{' '}
          <code className="border-dev-border bg-dev-bg-300 text-dev-text-bright rounded border px-1.5 py-0.5 font-mono">
            &lt;MobileDevTools /&gt;
          </code>
          .
        </p>
      </div>

      <div className="border-dev-border bg-dev-bg-100 w-full overflow-x-auto rounded-2xl border">
        <table className="w-full min-w-160 table-fixed border-collapse text-left text-xs">
          <thead>
            <tr className="border-dev-border bg-dev-bg-300 text-dev-text-muted border-b text-xs font-bold tracking-wider uppercase">
              <th className="w-[25%] p-2.5 sm:w-[18%] sm:p-4">Prop</th>
              <th className="w-[25%] p-2.5 sm:w-[22%] sm:p-4">Type</th>
              <th className="w-[20%] p-2.5 sm:w-[16%] sm:p-4">Default</th>
              <th className="w-[30%] p-2.5 sm:w-[44%] sm:p-4">Description</th>
            </tr>
          </thead>
          <tbody className="divide-dev-border-subtle divide-y">
            <tr className="hover:bg-dev-bg-300/40 transition-colors">
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-dev-text-bright inline-block max-w-full rounded-md border px-2 py-0.5 font-mono text-[11px] font-bold break-all sm:px-2.5 sm:py-1 sm:text-xs">
                  enabled
                </span>
              </td>
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-status-warn-text inline-block max-w-full rounded border px-1.5 py-0.5 font-mono text-[11px] break-all sm:px-2 sm:text-xs">
                  boolean
                </span>
              </td>
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-status-success-border bg-status-success-bg text-status-success-text inline-block rounded border px-1.5 py-0.5 font-mono text-[11px] font-bold sm:px-2 sm:text-xs">
                  true
                </span>
              </td>
              <td className="text-dev-text-main p-2.5 align-top leading-relaxed wrap-break-word sm:p-4">
                Enable or disable the DevTools overlay. Automatically set to{' '}
                <code className="text-dev-text-bright">false</code> in production builds.
              </td>
            </tr>

            <tr className="hover:bg-dev-bg-300/40 transition-colors">
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-dev-text-bright inline-block max-w-full rounded-md border px-2 py-0.5 font-mono text-[11px] font-bold break-all sm:px-2.5 sm:py-1 sm:text-xs">
                  forceEnable
                </span>
              </td>
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-status-warn-text inline-block max-w-full rounded border px-1.5 py-0.5 font-mono text-[11px] break-all sm:px-2 sm:text-xs">
                  boolean
                </span>
              </td>
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-dev-text-muted inline-block rounded border px-1.5 py-0.5 font-mono text-[11px] sm:px-2 sm:text-xs">
                  false
                </span>
              </td>
              <td className="text-dev-text-main p-2.5 align-top leading-relaxed wrap-break-word sm:p-4">
                Force enable DevTools overlay in production builds for QA testing &amp; staging
                previews.
              </td>
            </tr>

            <tr className="hover:bg-dev-bg-300/40 transition-colors">
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-dev-text-bright inline-block max-w-full rounded-md border px-2 py-0.5 font-mono text-[11px] font-bold break-all sm:px-2.5 sm:py-1 sm:text-xs">
                  defaultOpen
                </span>
              </td>
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-status-warn-text inline-block max-w-full rounded border px-1.5 py-0.5 font-mono text-[11px] break-all sm:px-2 sm:text-xs">
                  boolean
                </span>
              </td>
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-dev-text-muted inline-block rounded border px-1.5 py-0.5 font-mono text-[11px] sm:px-2 sm:text-xs">
                  false
                </span>
              </td>
              <td className="text-dev-text-main p-2.5 align-top leading-relaxed wrap-break-word sm:p-4">
                Automatically open the DevTools drawer on initial page mount.
              </td>
            </tr>

            <tr className="hover:bg-dev-bg-300/40 transition-colors">
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-dev-text-bright inline-block max-w-full rounded-md border px-2 py-0.5 font-mono text-[11px] font-bold break-all sm:px-2.5 sm:py-1 sm:text-xs">
                  title
                </span>
              </td>
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-status-warn-text inline-block max-w-full rounded border px-1.5 py-0.5 font-mono text-[11px] break-all sm:px-2 sm:text-xs">
                  string
                </span>
              </td>
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-status-info-border bg-status-info-bg text-status-info-text inline-block rounded border px-1.5 py-0.5 font-mono text-[11px] font-bold break-all sm:px-2 sm:text-xs">
                  &apos;DevTools&apos;
                </span>
              </td>
              <td className="text-dev-text-main p-2.5 align-top leading-relaxed wrap-break-word sm:p-4">
                Custom brand title text displayed inside both the floating badge and header drawer
                badge.
              </td>
            </tr>

            <tr className="hover:bg-dev-bg-300/40 transition-colors">
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-dev-text-bright inline-block max-w-full rounded-md border px-2 py-0.5 font-mono text-[11px] font-bold break-all sm:px-2.5 sm:py-1 sm:text-xs">
                  icon
                </span>
              </td>
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-status-warn-text inline-block max-w-full rounded border px-1.5 py-0.5 font-mono text-[11px] break-all sm:px-2 sm:text-xs">
                  ReactNode | string
                </span>
              </td>
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-dev-text-muted inline-block rounded border px-1.5 py-0.5 font-mono text-[11px] sm:px-2 sm:text-xs">
                  undefined
                </span>
              </td>
              <td className="text-dev-text-main p-2.5 align-top leading-relaxed wrap-break-word sm:p-4">
                Custom brand logo SVG element or emoji to display in the floating badge &amp; drawer
                header.
              </td>
            </tr>

            <tr className="hover:bg-dev-bg-300/40 transition-colors">
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-dev-text-bright inline-block max-w-full rounded-md border px-2 py-0.5 font-mono text-[11px] font-bold break-all sm:px-2.5 sm:py-1 sm:text-xs">
                  position
                </span>
              </td>
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-status-warn-text inline-block max-w-full rounded border px-1.5 py-0.5 font-mono text-[11px] break-all sm:px-2 sm:text-xs">
                  BadgePositionPreset | BadgePosition
                </span>
              </td>
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-status-info-border bg-status-info-bg text-status-info-text inline-block rounded border px-1.5 py-0.5 font-mono text-[11px] font-bold break-all sm:px-2 sm:text-xs">
                  &apos;bottom-right&apos;
                </span>
              </td>
              <td className="text-dev-text-main p-2.5 align-top leading-relaxed wrap-break-word sm:p-4">
                Screen placement preset (
                <code className="text-dev-text-bright">&apos;top-left&apos;</code>,{' '}
                <code className="text-dev-text-bright">&apos;top-right&apos;</code>,{' '}
                <code className="text-dev-text-bright">&apos;bottom-left&apos;</code>,{' '}
                <code className="text-dev-text-bright">&apos;bottom-right&apos;</code>,{' '}
                <code className="text-dev-text-bright">&apos;top&apos;</code>,{' '}
                <code className="text-dev-text-bright">&apos;bottom&apos;</code>,{' '}
                <code className="text-dev-text-bright">&apos;left&apos;</code>,{' '}
                <code className="text-dev-text-bright">&apos;right&apos;</code>) or custom{' '}
                <code className="text-dev-text-bright">{`{ x, y }`}</code> object.
              </td>
            </tr>

            <tr className="hover:bg-dev-bg-300/40 transition-colors">
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-dev-text-bright inline-block max-w-full rounded-md border px-2 py-0.5 font-mono text-[11px] font-bold break-all sm:px-2.5 sm:py-1 sm:text-xs">
                  autoSnapBadge
                </span>
              </td>
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-status-warn-text inline-block max-w-full rounded border px-1.5 py-0.5 font-mono text-[11px] break-all sm:px-2 sm:text-xs">
                  boolean
                </span>
              </td>
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-dev-text-muted inline-block rounded border px-1.5 py-0.5 font-mono text-[11px] sm:px-2 sm:text-xs">
                  false
                </span>
              </td>
              <td className="text-dev-text-main p-2.5 align-top leading-relaxed wrap-break-word sm:p-4">
                Automatically snaps floating badge to the nearest screen edge on drag release.
              </td>
            </tr>

            <tr className="hover:bg-dev-bg-300/40 transition-colors">
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-dev-text-bright inline-block max-w-full rounded-md border px-2 py-0.5 font-mono text-[11px] font-bold break-all sm:px-2.5 sm:py-1 sm:text-xs">
                  renderBadge
                </span>
              </td>
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-status-warn-text inline-block max-w-full rounded border px-1.5 py-0.5 font-mono text-[11px] break-all sm:px-2 sm:text-xs">
                  (container, props) =&gt; void
                </span>
              </td>
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-dev-text-muted inline-block rounded border px-1.5 py-0.5 font-mono text-[11px] sm:px-2 sm:text-xs">
                  undefined
                </span>
              </td>
              <td className="text-dev-text-main p-2.5 align-top leading-relaxed wrap-break-word sm:p-4">
                Custom render callback function to craft inner floating badge DOM structure while retaining drag &amp; drop gesture handling.
                <div className="text-dev-text-bright mt-2 text-xs font-semibold">Example:</div>
                <pre className="border-dev-border bg-dev-bg-300 text-dev-text-bright mt-1 rounded-md border p-2 font-mono text-[10px] break-all whitespace-pre-wrap sm:p-2.5 sm:text-[11px]">
                  {`renderBadge: (container, { unreadErrors }) => {
  container.innerHTML = \`<img src="/logo.png" />\`;
}`}
                </pre>
              </td>
            </tr>

            <tr className="hover:bg-dev-bg-300/40 transition-colors">
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-dev-text-bright inline-block max-w-full rounded-md border px-2 py-0.5 font-mono text-[11px] font-bold break-all sm:px-2.5 sm:py-1 sm:text-xs">
                  shakeToToggle
                </span>
              </td>
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-status-warn-text inline-block max-w-full rounded border px-1.5 py-0.5 font-mono text-[11px] break-all sm:px-2 sm:text-xs">
                  boolean
                </span>
              </td>
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-status-success-border bg-status-success-bg text-status-success-text inline-block rounded border px-1.5 py-0.5 font-mono text-[11px] font-bold sm:px-2 sm:text-xs">
                  true
                </span>
              </td>
              <td className="text-dev-text-main p-2.5 align-top leading-relaxed wrap-break-word sm:p-4">
                Enable physical device shake motion gesture sensor fusion to toggle DevTools drawer.
              </td>
            </tr>

            <tr className="hover:bg-dev-bg-300/40 transition-colors">
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-dev-text-bright inline-block max-w-full rounded-md border px-2 py-0.5 font-mono text-[11px] font-bold break-all sm:px-2.5 sm:py-1 sm:text-xs">
                  styles
                </span>
              </td>
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-status-warn-text inline-block max-w-full rounded border px-1.5 py-0.5 font-mono text-[11px] break-all sm:px-2 sm:text-xs">
                  string
                </span>
              </td>
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-dev-text-muted inline-block rounded border px-1.5 py-0.5 font-mono text-[11px] sm:px-2 sm:text-xs">
                  undefined
                </span>
              </td>
              <td className="text-dev-text-main p-2.5 align-top leading-relaxed wrap-break-word sm:p-4">
                Custom raw CSS string injected directly into the DevTools Shadow DOM container.
                <div className="text-dev-text-bright mt-2 text-xs font-semibold">Example:</div>
                <pre className="border-dev-border bg-dev-bg-300 text-dev-text-bright mt-1 rounded-md border p-2 font-mono text-[10px] break-all whitespace-pre-wrap sm:p-2.5 sm:text-[11px]">
                  {`styles=".devtools-badge { border-radius: 4px; }"`}
                </pre>
              </td>
            </tr>

            <tr className="hover:bg-dev-bg-300/40 transition-colors">
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-dev-text-bright inline-block max-w-full rounded-md border px-2 py-0.5 font-mono text-[11px] font-bold break-all sm:px-2.5 sm:py-1 sm:text-xs">
                  initialTab
                </span>
              </td>
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-status-warn-text inline-block max-w-full rounded border px-1.5 py-0.5 font-mono text-[11px] break-all sm:px-2 sm:text-xs">
                  DevToolsTabId
                </span>
              </td>
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-status-info-border bg-status-info-bg text-status-info-text inline-block rounded border px-1.5 py-0.5 font-mono text-[11px] font-bold break-all sm:px-2 sm:text-xs">
                  &apos;console&apos;
                </span>
              </td>
              <td className="text-dev-text-main p-2.5 align-top leading-relaxed wrap-break-word sm:p-4">
                Active tab on open (
                <code className="text-dev-text-bright">&apos;console&apos;</code>,{' '}
                <code className="text-dev-text-bright">&apos;elements&apos;</code>,{' '}
                <code className="text-dev-text-bright">&apos;network&apos;</code>,{' '}
                <code className="text-dev-text-bright">&apos;storage&apos;</code>,{' '}
                <code className="text-dev-text-bright">&apos;system&apos;</code>, or custom tab id).
              </td>
            </tr>

            <tr className="hover:bg-dev-bg-300/40 transition-colors">
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-dev-text-bright inline-block max-w-full rounded-md border px-2 py-0.5 font-mono text-[11px] font-bold break-all sm:px-2.5 sm:py-1 sm:text-xs">
                  enabledTabs
                </span>
              </td>
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-status-warn-text inline-block max-w-full rounded border px-1.5 py-0.5 font-mono text-[11px] break-all sm:px-2 sm:text-xs">
                  DevToolsTabId[]
                </span>
              </td>
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-dev-text-muted inline-block rounded border px-1.5 py-0.5 font-mono text-[11px] sm:px-2 sm:text-xs">
                  All 5 tabs
                </span>
              </td>
              <td className="text-dev-text-main p-2.5 align-top leading-relaxed wrap-break-word sm:p-4">
                List of built-in tabs to render. Allows hiding specific tabs (e.g. only enable
                console &amp; network).
              </td>
            </tr>

            <tr className="hover:bg-dev-bg-300/40 transition-colors">
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-dev-text-bright inline-block max-w-full rounded-md border px-2 py-0.5 font-mono text-[11px] font-bold break-all sm:px-2.5 sm:py-1 sm:text-xs">
                  theme
                </span>
              </td>
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-status-warn-text inline-block max-w-full rounded border px-1.5 py-0.5 font-mono text-[11px] break-all sm:px-2 sm:text-xs">
                  DevToolsTheme
                </span>
              </td>
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-dev-text-muted inline-block rounded border px-1.5 py-0.5 font-mono text-[11px] sm:px-2 sm:text-xs">
                  {`{ mode: 'dark' }`}
                </span>
              </td>
              <td className="text-dev-text-main p-2.5 align-top leading-relaxed wrap-break-word sm:p-4">
                Theme configuration (
                <code className="text-dev-text-bright">
                  mode: &apos;dark&apos; | &apos;light&apos; | &apos;auto&apos;
                </code>
                ) and custom CSS variable overrides (
                <code className="text-dev-text-bright">backgroundColor</code>,{' '}
                <code className="text-dev-text-bright">accentColor</code>,{' '}
                <code className="text-dev-text-bright">errorColor</code>).
              </td>
            </tr>

            <tr className="hover:bg-dev-bg-300/40 transition-colors">
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-dev-text-bright inline-block max-w-full rounded-md border px-2 py-0.5 font-mono text-[11px] font-bold break-all sm:px-2.5 sm:py-1 sm:text-xs">
                  interceptors
                </span>
              </td>
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-status-warn-text inline-block max-w-full rounded border px-1.5 py-0.5 font-mono text-[11px] break-all sm:px-2 sm:text-xs">
                  InterceptorConfig
                </span>
              </td>
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-dev-text-muted inline-block rounded border px-1.5 py-0.5 font-mono text-[11px] sm:px-2 sm:text-xs">
                  Object
                </span>
              </td>
              <td className="text-dev-text-main p-2.5 align-top leading-relaxed wrap-break-word sm:p-4">
                <div>Configure console log and network request interception:</div>
                <pre className="border-dev-border bg-dev-bg-300 text-dev-text-bright mt-2 rounded-md border p-2 font-mono text-[10px] break-all whitespace-pre-wrap sm:p-2.5 sm:text-[11px]">
                  {`{
  maxLogLimit?: number;
  maxNetworkLimit?: number;
  ignoreNetworkUrls?: (string | RegExp)[];
  enableConsoleInterceptor?: boolean;
  enableFetchInterceptor?: boolean;
  enableXhrInterceptor?: boolean;
}`}
                </pre>
              </td>
            </tr>

            <tr className="hover:bg-dev-bg-300/40 transition-colors">
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-dev-text-bright inline-block max-w-full rounded-md border px-2 py-0.5 font-mono text-[11px] font-bold break-all sm:px-2.5 sm:py-1 sm:text-xs">
                  privacy
                </span>
              </td>
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-status-warn-text inline-block max-w-full rounded border px-1.5 py-0.5 font-mono text-[11px] break-all sm:px-2 sm:text-xs">
                  PrivacyConfig
                </span>
              </td>
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-dev-text-muted inline-block rounded border px-1.5 py-0.5 font-mono text-[11px] sm:px-2 sm:text-xs">
                  undefined
                </span>
              </td>
              <td className="text-dev-text-main p-2.5 align-top leading-relaxed wrap-break-word sm:p-4">
                <div>
                  Recursively masks matching sensitive keys (e.g.{' '}
                  <code className="text-dev-text-bright">password</code>,{' '}
                  <code className="text-dev-text-bright">token</code>,{' '}
                  <code className="text-dev-text-bright">authorization</code>) across HTTP request
                  &amp; response headers, request/response JSON payload bodies, and Storage tab data
                  into <code className="text-dev-text-bright">&apos;****** (Masked)&apos;</code>.
                </div>
                <pre className="border-dev-border bg-dev-bg-300 text-dev-text-bright mt-2 rounded-md border p-2 font-mono text-[10px] break-all whitespace-pre-wrap sm:p-2.5 sm:text-[11px]">
                  {`{
  mask?: string[];
}`}
                </pre>
              </td>
            </tr>

            <tr className="hover:bg-dev-bg-300/40 transition-colors">
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-dev-text-bright inline-block max-w-full rounded-md border px-2 py-0.5 font-mono text-[11px] font-bold break-all sm:px-2.5 sm:py-1 sm:text-xs">
                  customTabs
                </span>
              </td>
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-status-warn-text inline-block max-w-full rounded border px-1.5 py-0.5 font-mono text-[11px] break-all sm:px-2 sm:text-xs">
                  CustomTabDefinition[]
                </span>
              </td>
              <td className="p-2.5 align-top wrap-break-word sm:p-4">
                <span className="border-dev-border bg-dev-bg-300 text-dev-text-muted inline-block rounded border px-1.5 py-0.5 font-mono text-[11px] sm:px-2 sm:text-xs">
                  []
                </span>
              </td>
              <td className="text-dev-text-main p-2.5 align-top leading-relaxed wrap-break-word sm:p-4">
                Pluggable consumer tabs with custom DOM rendering callback (
                <code className="text-dev-text-bright">render(container)</code>).
                <div className="text-dev-text-bright mt-2 text-xs font-semibold">Example:</div>
                <pre className="border-dev-border bg-dev-bg-300 text-dev-text-bright mt-1 rounded-md border p-2 font-mono text-[10px] break-all whitespace-pre-wrap sm:p-2.5 sm:text-[11px]">
                  {`customTabs: [
  {
    id: 'analytics',
    title: 'Analytics',
    render: (container) => {
      container.innerHTML = '<div>Analytics</div>';
    }
  }
]`}
                </pre>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
