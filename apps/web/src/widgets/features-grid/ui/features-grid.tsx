import React from 'react';
import {
  Shield,
  Zap,
  Terminal,
  Smartphone,
  Database,
  Sliders,
  Share2,
  WifiOff,
} from 'lucide-react';

export const FeaturesGrid: React.FC = () => {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-dev-text-bright text-2xl font-extrabold tracking-tight sm:text-3xl">
          Built for Production Applications
        </h2>
        <p className="text-dev-text-muted mx-auto max-w-xl text-sm leading-relaxed sm:text-base">
          Zero CSS leaks, zero performance overhead, and 100% Shadow DOM style isolation.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Bug Exporter (Web Share API) */}
        <div className="border-dev-border bg-dev-bg-100 space-y-2.5 rounded-xl border p-5 transition-all hover:border-sky-500/40">
          <div className="flex size-9 items-center justify-center rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <Share2 className="size-5" />
          </div>
          <h3 className="text-dev-text-bright text-sm font-bold tracking-tight">
            Export Bug Report
          </h3>
          <p className="text-dev-text-muted text-xs leading-relaxed">
            Instant 1-click bug export via Web Share API (
            <code className="text-sky-400">navigator.share</code>) to WhatsApp, Slack, or Email.
          </p>
        </div>

        {/* Card 2: Network Throttling & Offline */}
        <div className="border-dev-border bg-dev-bg-100 space-y-2.5 rounded-xl border p-5 transition-all hover:border-amber-500/40">
          <div className="flex size-9 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <WifiOff className="size-5" />
          </div>
          <h3 className="text-dev-text-bright text-sm font-bold tracking-tight">
            Network Throttling
          </h3>
          <p className="text-dev-text-muted text-xs leading-relaxed">
            Simulate Slow 3G, Fast 3G, or Offline mode directly on mobile devices with synthetic
            latency.
          </p>
        </div>

        {/* Card 3: Shadow DOM */}
        <div className="border-dev-border bg-dev-bg-100 space-y-2.5 rounded-xl border p-5 transition-all hover:border-indigo-500/40">
          <div className="flex size-9 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Shield className="size-5" />
          </div>
          <h3 className="text-dev-text-bright text-sm font-bold tracking-tight">
            Shadow DOM Isolation
          </h3>
          <p className="text-dev-text-muted text-xs leading-relaxed">
            Zero CSS leakage or style contamination with host application styles.
          </p>
        </div>

        {/* Card 4: Network Interceptor */}
        <div className="border-dev-border bg-dev-bg-100 space-y-2.5 rounded-xl border p-5 transition-all hover:border-emerald-500/40">
          <div className="flex size-9 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Zap className="size-5" />
          </div>
          <h3 className="text-dev-text-bright text-sm font-bold tracking-tight">
            Network Interceptor
          </h3>
          <p className="text-dev-text-muted text-xs leading-relaxed">
            Intercepts native <code className="text-emerald-600 dark:text-emerald-400">fetch</code>{' '}
            & <code className="text-emerald-600 dark:text-emerald-400">XHR</code> calls with timing
            & payload inspection.
          </p>
        </div>

        {/* Card 5: Console Log Engine */}
        <div className="border-dev-border bg-dev-bg-100 space-y-2.5 rounded-xl border p-5 transition-all hover:border-rose-500/40">
          <div className="flex size-9 items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <Terminal className="size-5" />
          </div>
          <h3 className="text-dev-text-bright text-sm font-bold tracking-tight">
            Console Log Engine
          </h3>
          <p className="text-dev-text-muted text-xs leading-relaxed">
            Captures log, warn, error, and exceptions with intact stack traces.
          </p>
        </div>

        {/* Card 6: Mobile Touch Engine */}
        <div className="border-dev-border bg-dev-bg-100 space-y-2.5 rounded-xl border p-5 transition-all hover:border-purple-500/40">
          <div className="flex size-9 items-center justify-center rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Smartphone className="size-5" />
          </div>
          <h3 className="text-dev-text-bright text-sm font-bold tracking-tight">
            Mobile Touch & Drag
          </h3>
          <p className="text-dev-text-muted text-xs leading-relaxed">
            Pointer-captured badge drag, viewport snapping, and swipe-to-dismiss gesture.
          </p>
        </div>

        {/* Card 7: Storage & Cookie Inspector */}
        <div className="border-dev-border bg-dev-bg-100 space-y-2.5 rounded-xl border p-5 transition-all hover:border-cyan-500/40">
          <div className="flex size-9 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <Database className="size-5" />
          </div>
          <h3 className="text-dev-text-bright text-sm font-bold tracking-tight">
            Storage Inspector
          </h3>
          <p className="text-dev-text-muted text-xs leading-relaxed">
            Live inspection & management for LocalStorage, SessionStorage, Cookies, and IndexedDB.
          </p>
        </div>

        {/* Card 8: Pluggable Custom Tabs */}
        <div className="border-dev-border bg-dev-bg-100 space-y-2.5 rounded-xl border p-5 transition-all hover:border-fuchsia-500/40">
          <div className="flex size-9 items-center justify-center rounded-lg border border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400">
            <Sliders className="size-5" />
          </div>
          <h3 className="text-dev-text-bright text-sm font-bold tracking-tight">
            Pluggable Custom Tabs
          </h3>
          <p className="text-dev-text-muted text-xs leading-relaxed">
            Extend DevTools with custom diagnostic tabs using custom DOM renderers.
          </p>
        </div>
      </div>
    </div>
  );
};
