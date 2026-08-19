'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Check, Code2, Copy, Sliders, Terminal } from 'lucide-react';

type FrameworkTab = 'react' | 'vue' | 'svelte' | 'vanilla';

export const CodeDocs: React.FC = () => {
  const [activeFramework, setActiveFramework] = useState<FrameworkTab>('react');
  const [copiedInstall, setCopiedInstall] = useState<boolean>(false);
  const [copiedUsage, setCopiedUsage] = useState<boolean>(false);
  const [copiedCustom, setCopiedCustom] = useState<boolean>(false);

  const installTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const usageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const customTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (installTimerRef.current) clearTimeout(installTimerRef.current);
      if (usageTimerRef.current) clearTimeout(usageTimerRef.current);
      if (customTimerRef.current) clearTimeout(customTimerRef.current);
    };
  }, []);

  const getInstallCmd = () => {
    return 'npm install mobile-devtools';
  };

  const handleCopyInstall = () => {
    navigator.clipboard.writeText(getInstallCmd());
    setCopiedInstall(true);
    if (installTimerRef.current) clearTimeout(installTimerRef.current);
    installTimerRef.current = setTimeout(() => {
      setCopiedInstall(false);
      installTimerRef.current = null;
    }, 2000);
  };

  const handleCopyUsage = () => {
    let code = '';
    if (activeFramework === 'react') {
      code = `import { MobileDevTools } from 'mobile-devtools/react';\n\nexport default function App() {\n  return (\n    <>\n      <YourAppComponents />\n      <MobileDevTools />\n    </>\n  );\n}`;
    } else if (activeFramework === 'vue') {
      code = `<script setup>\nimport { MobileDevTools } from 'mobile-devtools/vue';\n</script>\n\n<template>\n  <MobileDevTools />\n</template>`;
    } else if (activeFramework === 'svelte') {
      code = `<script>\n  import { MobileDevTools } from 'mobile-devtools/svelte';\n</script>\n\n<MobileDevTools />`;
    } else {
      code = `import { createMobileDevTools } from 'mobile-devtools';\n\n// Initialize in any JS file\nconst devtools = createMobileDevTools({\n  theme: { mode: 'dark' },\n  position: 'bottom-right',\n});`;
    }

    navigator.clipboard.writeText(code);
    setCopiedUsage(true);
    if (usageTimerRef.current) clearTimeout(usageTimerRef.current);
    usageTimerRef.current = setTimeout(() => {
      setCopiedUsage(false);
      usageTimerRef.current = null;
    }, 2000);
  };

  const handleCopyCustom = () => {
    let code = '';
    if (activeFramework === 'react') {
      code = `<MobileDevTools\n  title="My App Debugger"\n  position="bottom-right"\n  theme={{\n    mode: 'dark',\n    accentColor: '#ffffff',\n    backgroundColor: '#0a0a0a',\n  }}\n  customTabs={[\n    {\n      id: 'analytics',\n      title: 'Analytics',\n      render: (container) => {\n        container.innerHTML = '<h3>📊 Analytics Events</h3>';\n      }\n    }\n  ]}\n/>`;
    } else if (activeFramework === 'vue') {
      code = `<MobileDevTools\n  title="My App Debugger"\n  position="bottom-right"\n  :theme="{\n    mode: 'dark',\n    accentColor: '#ffffff',\n    backgroundColor: '#0a0a0a'\n  }"\n  :custom-tabs="[\n    {\n      id: 'analytics',\n      title: 'Analytics',\n      render: (container) => {\n        container.innerHTML = '<h3>📊 Analytics Events</h3>';\n      }\n    }\n  ]"\n/>`;
    } else if (activeFramework === 'svelte') {
      code = `<script>\n  import { MobileDevTools } from 'mobile-devtools/svelte';\n</script>\n\n<MobileDevTools\n  title="My App Debugger"\n  position="bottom-right"\n/>`;
    } else {
      code = `createMobileDevTools({\n  title: 'My App Debugger',\n  position: 'bottom-right',\n  theme: {\n    mode: 'dark',\n    accentColor: '#ffffff',\n    backgroundColor: '#0a0a0a',\n  },\n  customTabs: [\n    {\n      id: 'analytics',\n      title: 'Analytics',\n      render: (container) => {\n        container.innerHTML = '<h3>📊 Analytics Events</h3>';\n      }\n    }\n  ]\n});`;
    }

    navigator.clipboard.writeText(code);
    setCopiedCustom(true);
    if (customTimerRef.current) clearTimeout(customTimerRef.current);
    customTimerRef.current = setTimeout(() => {
      setCopiedCustom(false);
      customTimerRef.current = null;
    }, 2000);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-dev-text-bright text-xl font-bold tracking-tight sm:text-2xl">
            Quick Installation & Setup
          </h2>
          <p className="text-dev-text-muted text-xs">
            Integrate in under 30 seconds into React, Vue 3, Svelte 4/5, or Vanilla JS applications.
          </p>
        </div>

        {/* Framework Selector Tabs */}
        <div className="border-dev-border bg-dev-bg-100 inline-flex self-start rounded-xl border p-1 sm:self-auto">
          <button
            onClick={() => setActiveFramework('react')}
            className={`cursor-pointer rounded-lg px-3 py-1.5 font-mono text-xs font-semibold transition-colors ${
              activeFramework === 'react'
                ? 'border-dev-border bg-dev-bg-300 text-dev-text-bright border'
                : 'text-dev-text-muted hover:text-dev-text-bright'
            }`}
          >
            React
          </button>
          <button
            onClick={() => setActiveFramework('vue')}
            className={`cursor-pointer rounded-lg px-3 py-1.5 font-mono text-xs font-semibold transition-colors ${
              activeFramework === 'vue'
                ? 'border-dev-border bg-dev-bg-300 text-dev-text-bright border'
                : 'text-dev-text-muted hover:text-dev-text-bright'
            }`}
          >
            Vue 3
          </button>
          <button
            onClick={() => setActiveFramework('svelte')}
            className={`cursor-pointer rounded-lg px-3 py-1.5 font-mono text-xs font-semibold transition-colors ${
              activeFramework === 'svelte'
                ? 'border-dev-border bg-dev-bg-300 text-dev-text-bright border'
                : 'text-dev-text-muted hover:text-dev-text-bright'
            }`}
          >
            Svelte
          </button>
          <button
            onClick={() => setActiveFramework('vanilla')}
            className={`cursor-pointer rounded-lg px-3 py-1.5 font-mono text-xs font-semibold transition-colors ${
              activeFramework === 'vanilla'
                ? 'border-dev-border bg-dev-bg-300 text-dev-text-bright border'
                : 'text-dev-text-muted hover:text-dev-text-bright'
            }`}
          >
            Vanilla JS
          </button>
        </div>
      </div>

      {/* Card 1: Installation */}
      <div className="border-dev-border bg-dev-bg-100 overflow-hidden rounded-2xl border">
        <div className="border-dev-border bg-dev-bg-300 flex items-center justify-between border-b px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Terminal className="text-status-success-text size-4" />
            <span className="text-dev-text-muted font-mono text-xs">terminal</span>
          </div>
          <button
            onClick={handleCopyInstall}
            className="border-dev-border bg-dev-bg-200 text-dev-text-muted hover:text-dev-text-bright inline-flex cursor-pointer items-center gap-1 rounded-md border px-2.5 py-1 font-mono text-xs transition-colors"
          >
            {copiedInstall ? (
              <>
                <Check className="text-status-success-text size-3" />
                <span className="text-status-success-text font-bold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="text-dev-text-muted size-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <pre className="bg-dev-bg-100 text-dev-text-main overflow-x-auto p-4 font-mono text-xs leading-relaxed sm:p-5">
          <code>
            <span className="text-syntax-keyword">npm</span>{' '}
            <span className="text-syntax-string">install</span>{' '}
            <span className="text-dev-text-bright font-semibold">mobile-devtools</span>
          </code>
        </pre>
      </div>

      {/* Card 2: Basic Framework Usage */}
      <div className="border-dev-border bg-dev-bg-100 overflow-hidden rounded-2xl border">
        <div className="border-dev-border bg-dev-bg-300 flex items-center justify-between border-b px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Code2 className="text-syntax-function size-4" />
            <span className="text-dev-text-muted font-mono text-xs">
              {activeFramework === 'react'
                ? 'App.tsx'
                : activeFramework === 'vue'
                  ? 'App.vue'
                  : activeFramework === 'svelte'
                    ? 'App.svelte'
                    : 'main.js'}
            </span>
          </div>
          <button
            onClick={handleCopyUsage}
            className="border-dev-border bg-dev-bg-200 text-dev-text-muted hover:text-dev-text-bright inline-flex cursor-pointer items-center gap-1 rounded-md border px-2.5 py-1 font-mono text-xs transition-colors"
          >
            {copiedUsage ? (
              <>
                <Check className="text-status-success-text size-3" />
                <span className="text-status-success-text font-bold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="text-dev-text-muted size-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <pre className="bg-dev-bg-100 text-dev-text-main overflow-x-auto p-4 font-mono text-xs leading-relaxed sm:p-5">
          {activeFramework === 'react' && (
            <code>
              <span className="text-syntax-keyword">import</span> {'{'}{' '}
              <span className="text-syntax-function">MobileDevTools</span> {'}'}{' '}
              <span className="text-syntax-keyword">from</span>{' '}
              <span className="text-syntax-string">&apos;mobile-devtools/react&apos;</span>;<br />
              <br />
              <span className="text-syntax-keyword">export default function</span>{' '}
              <span className="text-dev-text-bright">App</span>() {'{'}
              <br />
              {'  '}
              <span className="text-syntax-keyword">return</span> (<br />
              {'    '}&lt;&gt;
              <br />
              {'      '}&lt;<span className="text-syntax-function">YourAppComponents</span> /&gt;
              <br />
              {'      '}&lt;<span className="text-syntax-function">MobileDevTools</span> /&gt;
              <br />
              {'    '}&lt;/&gt;
              <br />
              {'  '});
              <br />
              {'}'}
            </code>
          )}

          {activeFramework === 'vue' && (
            <code>
              &lt;<span className="text-syntax-keyword">script</span>{' '}
              <span className="text-syntax-parameter">setup</span>&gt;
              <br />
              <span className="text-syntax-keyword">import</span> {'{'}{' '}
              <span className="text-syntax-function">MobileDevTools</span> {'}'}{' '}
              <span className="text-syntax-keyword">from</span>{' '}
              <span className="text-syntax-string">&apos;mobile-devtools/vue&apos;</span>;<br />
              &lt;/<span className="text-syntax-keyword">script</span>&gt;
              <br />
              <br />
              &lt;<span className="text-syntax-keyword">template</span>&gt;
              <br />
              {'  '}&lt;<span className="text-syntax-function">MobileDevTools</span> /&gt;
              <br />
              &lt;/<span className="text-syntax-keyword">template</span>&gt;
            </code>
          )}

          {activeFramework === 'svelte' && (
            <code>
              &lt;<span className="text-syntax-keyword">script</span>&gt;
              <br />
              {'  '}
              <span className="text-syntax-keyword">import</span> {'{'}{' '}
              <span className="text-syntax-function">MobileDevTools</span> {'}'}{' '}
              <span className="text-syntax-keyword">from</span>{' '}
              <span className="text-syntax-string">&apos;mobile-devtools/svelte&apos;</span>;
              <br />
              &lt;/<span className="text-syntax-keyword">script</span>&gt;
              <br />
              <br />
              &lt;<span className="text-syntax-function">MobileDevTools</span> /&gt;
            </code>
          )}

          {activeFramework === 'vanilla' && (
            <code>
              <span className="text-syntax-comment italic">
                {'// Option A: ESM Import (npm install mobile-devtools)'}
              </span>
              <br />
              <span className="text-syntax-keyword">import</span> {'{'}{' '}
              <span className="text-syntax-function">createMobileDevTools</span> {'}'}{' '}
              <span className="text-syntax-keyword">from</span>{' '}
              <span className="text-syntax-string">&apos;mobile-devtools&apos;</span>;
              <br />
              <span className="text-syntax-function">createMobileDevTools</span>();
              <br />
              <br />
              <span className="text-syntax-comment italic">
                {'// Option B: Direct CDN / UNPKG script (No build step required)'}
              </span>
              <br />
              &lt;<span className="text-syntax-keyword">script</span>{' '}
              <span className="text-syntax-parameter">type</span>=
              <span className="text-syntax-string">&quot;module&quot;</span>&gt;
              <br />
              {'  '}
              <span className="text-syntax-keyword">import</span> {'{'}{' '}
              <span className="text-syntax-function">createMobileDevTools</span> {'}'}{' '}
              <span className="text-syntax-keyword">from</span>{' '}
              <span className="text-syntax-string">
                &apos;https://unpkg.com/mobile-devtools&apos;
              </span>
              ;
              <br />
              {'  '}
              <span className="text-syntax-function">createMobileDevTools</span>();
              <br />
              &lt;/<span className="text-syntax-keyword">script</span>&gt;
            </code>
          )}
        </pre>
      </div>

      {/* Card 3: Advanced Customization Example */}
      <div className="border-dev-border bg-dev-bg-100 overflow-hidden rounded-2xl border">
        <div className="border-dev-border bg-dev-bg-300 flex items-center justify-between border-b px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Sliders className="size-4 text-purple-400" />
            <span className="text-dev-text-muted font-mono text-xs">Customization</span>
          </div>
          <button
            onClick={handleCopyCustom}
            className="border-dev-border bg-dev-bg-200 text-dev-text-muted hover:text-dev-text-bright inline-flex cursor-pointer items-center gap-1 rounded-md border px-2.5 py-1 font-mono text-xs transition-colors"
          >
            {copiedCustom ? (
              <>
                <Check className="text-status-success-text size-3" />
                <span className="text-status-success-text font-bold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="text-dev-text-muted size-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <pre className="bg-dev-bg-100 text-dev-text-main overflow-x-auto p-4 font-mono text-xs leading-relaxed sm:p-5">
          <code>
            {activeFramework === 'react' && (
              <>
                &lt;<span className="text-syntax-function">MobileDevTools</span>
                <br />
                {'  '}
                <span className="text-syntax-parameter">title</span>=
                <span className="text-syntax-string">&quot;My App Debugger&quot;</span>
                <br />
                {'  '}
                <span className="text-syntax-parameter">position</span>=
                <span className="text-syntax-string">&quot;bottom-right&quot;</span>
                <br />
                {'  '}
                <span className="text-syntax-parameter">theme</span>={'{'}
                {'{'} mode: <span className="text-syntax-string">&apos;dark&apos;</span>,
                accentColor: <span className="text-syntax-string">&apos;#0070f3&apos;</span> {'}'}
                {'}'}
                <br />
                {'  '}
                <span className="text-syntax-parameter">customTabs</span>={'{'}[{'{'}
                <br />
                {'    '}id: <span className="text-syntax-string">&apos;analytics&apos;</span>,
                title: <span className="text-syntax-string">&apos;Analytics&apos;</span>,
                <br />
                {'    '}
                <span className="text-syntax-function">render</span>: (container) =&gt; {'{'}
                <br />
                {'      '}container.innerHTML ={' '}
                <span className="text-syntax-string">
                  &apos;&lt;div style=&quot;padding:16px&quot;&gt;📊 Analytics
                  Events&lt;/div&gt;&apos;
                </span>
                ;
                <br />
                {'    '}
                {'}'}
                <br />
                {'  '}
                {'}'}]{'}'}
                <br />
                /&gt;
              </>
            )}

            {activeFramework === 'vue' && (
              <>
                &lt;<span className="text-syntax-function">MobileDevTools</span>
                <br />
                {'  '}
                <span className="text-syntax-parameter">title</span>=
                <span className="text-syntax-string">&quot;My App Debugger&quot;</span>
                <br />
                {'  '}
                <span className="text-syntax-parameter">position</span>=
                <span className="text-syntax-string">&quot;bottom-right&quot;</span>
                <br />
                {'  '}
                <span className="text-syntax-parameter">:theme</span>=
                <span className="text-syntax-string">
                  &quot;{'{'} mode: &apos;dark&apos;, accentColor: &apos;#0070f3&apos; {'}'}&quot;
                </span>
                <br />
                {'  '}
                <span className="text-syntax-parameter">:custom-tabs</span>=
                <span className="text-syntax-string">
                  &quot;[{'{'} id: &apos;analytics&apos;, title: &apos;Analytics&apos;, render:
                  customRender {'}'}]&quot;
                </span>
                <br />
                /&gt;
              </>
            )}

            {activeFramework === 'svelte' && (
              <>
                &lt;<span className="text-syntax-keyword">script</span>&gt;
                <br />
                {'  '}
                <span className="text-syntax-keyword">import</span> {'{'}{' '}
                <span className="text-syntax-function">MobileDevTools</span> {'}'}{' '}
                <span className="text-syntax-keyword">from</span>{' '}
                <span className="text-syntax-string">&apos;mobile-devtools/svelte&apos;</span>;
                <br />
                &lt;/<span className="text-syntax-keyword">script</span>&gt;
                <br />
                <br />
                &lt;<span className="text-syntax-function">MobileDevTools</span>
                <br />
                {'  '}
                <span className="text-syntax-parameter">title</span>=
                <span className="text-syntax-string">&quot;My App Debugger&quot;</span>
                <br />
                {'  '}
                <span className="text-syntax-parameter">position</span>=
                <span className="text-syntax-string">&quot;bottom-right&quot;</span>
                <br />
                /&gt;
              </>
            )}

            {activeFramework === 'vanilla' && (
              <>
                <span className="text-syntax-function">createMobileDevTools</span>({'{'}
                <br />
                {'  '}
                <span className="text-syntax-parameter">title</span>:{' '}
                <span className="text-syntax-string">&apos;My App Debugger&apos;</span>,<br />
                {'  '}
                <span className="text-syntax-parameter">position</span>:{' '}
                <span className="text-syntax-string">&apos;bottom-right&apos;</span>,<br />
                {'  '}
                <span className="text-syntax-parameter">theme</span>: {'{'} mode:{' '}
                <span className="text-syntax-string">&apos;dark&apos;</span>, accentColor:{' '}
                <span className="text-syntax-string">&apos;#0070f3&apos;</span> {'}'},<br />
                {'  '}
                <span className="text-syntax-parameter">customTabs</span>: [{'{'}
                <br />
                {'    '}id: <span className="text-syntax-string">&apos;analytics&apos;</span>,
                title: <span className="text-syntax-string">&apos;Analytics&apos;</span>,<br />
                {'    '}
                <span className="text-syntax-function">render</span>: (container) =&gt; {'{'}
                <br />
                {'      '}container.innerHTML ={' '}
                <span className="text-syntax-string">
                  &apos;&lt;div style=&quot;padding:16px&quot;&gt;📊 Analytics
                  Events&lt;/div&gt;&apos;
                </span>
                ;<br />
                {'    '}
                {'}'}
                <br />
                {'  '}
                {'}'}],
                <br />
                {'}'});
              </>
            )}
          </code>
        </pre>
      </div>
    </div>
  );
};
