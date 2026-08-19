'use client';

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { Button } from '@/shared/ui/button';

export const PrivacyPage: React.FC = () => {
  return (
    <main className="bg-dev-bg-200 text-dev-text-main min-h-screen px-4 py-12 font-sans transition-colors sm:py-20">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Header */}
        <header className="border-dev-border border-b pb-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Lock className="size-3.5" />
            <span>Zero Telemetry & Zero Cookies Policy</span>
          </div>
          <h1 className="text-dev-text-bright text-3xl font-extrabold tracking-tight sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="text-dev-text-muted mt-2 text-xs sm:text-sm">
            Last updated: August 16, 2026 • mobile-devtools Documentation & Live Demo
          </p>
        </header>

        {/* Body content */}
        <article className="text-dev-text-main space-y-6 text-sm leading-relaxed sm:text-base">
          <div className="border-dev-border bg-dev-bg-100 space-y-3 rounded-2xl border p-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-emerald-500 dark:text-emerald-400" />
              <h2 className="text-dev-text-bright text-base font-bold">Key Privacy Commitments</h2>
            </div>
            <ul className="text-dev-text-main grid grid-cols-1 gap-2.5 text-xs font-medium sm:grid-cols-2 sm:text-sm">
              <li className="border-dev-border bg-dev-bg-300 flex items-center gap-2 rounded-lg border p-2">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
                <span>No Personal Data Collection</span>
              </li>
              <li className="border-dev-border bg-dev-bg-300 flex items-center gap-2 rounded-lg border p-2">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
                <span>No Analytics or Trackers</span>
              </li>
              <li className="border-dev-border bg-dev-bg-300 flex items-center gap-2 rounded-lg border p-2">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
                <span>100% In-Browser Execution</span>
              </li>
              <li className="border-dev-border bg-dev-bg-300 flex items-center gap-2 rounded-lg border p-2">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
                <span>Open Source MIT License</span>
              </li>
            </ul>
          </div>

          <section className="space-y-2">
            <h2 className="text-dev-text-bright text-xl font-bold">1. Overview</h2>
            <p className="text-dev-text-main">
              <code className="border-dev-border bg-dev-bg-300 text-dev-text-bright rounded border px-1.5 py-0.5 font-mono text-xs">
                mobile-devtools
              </code>{' '}
              is a lightweight, zero-dependency mobile browser debugging library. This web
              application functions exclusively as interactive documentation and a live test harness
              demo for developers to evaluate the package.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-dev-text-bright text-xl font-bold">2. Data Collection Policy</h2>
            <p className="text-dev-text-main">
              We believe in complete privacy for developers. We do not collect, capture, store, or
              transmit any data from visitors to this site or users of the library.
            </p>
            <ul className="text-dev-text-main space-y-2 pt-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-1 size-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
                <div>
                  <strong className="text-dev-text-bright">No Personal Information:</strong> We do
                  not ask for names, emails, user credentials, or payment information.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-1 size-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
                <div>
                  <strong className="text-dev-text-bright">No Telemetry or Analytics:</strong> We do
                  not run Google Analytics, Mixpanel, Hotjar, or any user tracking services.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-1 size-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
                <div>
                  <strong className="text-dev-text-bright">No Tracking Cookies:</strong> This web
                  application uses zero non-essential cookies.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-1 size-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
                <div>
                  <strong className="text-dev-text-bright">No Server-Side Storage:</strong> Debug
                  logs, simulated network API calls, and local storage entries tested in the demo
                  remain isolated inside your browser memory.
                </div>
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-dev-text-bright text-xl font-bold">3. How mobile-devtools Works</h2>
            <p className="text-dev-text-main">
              When you use{' '}
              <code className="border-dev-border bg-dev-bg-300 text-dev-text-bright rounded border px-1.5 py-0.5 font-mono text-xs">
                mobile-devtools
              </code>{' '}
              inside your application:
            </p>
            <ul className="text-dev-text-main space-y-2 pt-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-1 size-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
                <span>
                  It operates entirely inside the client-side DOM using Shadow DOM isolation.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-1 size-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
                <span>
                  Captured logs (Console, Network, Storage, Elements) are stored locally in
                  application memory (`window` object / React state) and are never uploaded
                  anywhere.
                </span>
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-dev-text-bright text-xl font-bold">4. Open Source Transparency</h2>
            <p className="text-dev-text-main">
              Because{' '}
              <code className="border-dev-border bg-dev-bg-300 text-dev-text-bright rounded border px-1.5 py-0.5 font-mono text-xs">
                mobile-devtools
              </code>{' '}
              is open-source software distributed under the MIT License, you can inspect every line
              of code yourself on GitHub to verify our security and zero-data practices.
            </p>
          </section>

          {/* Bottom navigation */}
          <section className="border-dev-border space-y-3 border-t pt-6">
            <h2 className="text-dev-text-bright text-xl font-bold">5. Return to Documentation</h2>
            <p className="text-dev-text-muted">
              Ready to integrate mobile-devtools into your web projects?
            </p>
            <div className="pt-2">
              <Link to="/">
                <Button variant="primary" size="md">
                  <ArrowLeft className="size-4 text-black dark:text-black" />
                  <span>Return to Home & Documentation</span>
                </Button>
              </Link>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
};
