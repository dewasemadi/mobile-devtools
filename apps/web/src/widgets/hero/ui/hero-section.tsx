import React from 'react';
import { Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative mx-auto max-w-4xl space-y-6 py-8 text-center sm:space-y-8 sm:pt-16">
      {/* Hero Content Container */}
      <div className="relative z-10 space-y-6 sm:space-y-8">
        {/* Pill Badge */}
        <div>
          <div className="border-dev-border bg-dev-bg-100/90 text-dev-text-bright inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold backdrop-blur-xl">
            <Sparkles className="size-3.5 text-emerald-500 dark:text-emerald-400" />
            <span>Next-Gen In-App Mobile Inspector</span>
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="leading-1.15 text-dev-text-bright text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Framework-Agnostic <br />
          In-App Mobile Debugger.
        </h1>

        {/* Punchy Subtitle */}
        <p className="text-dev-text-muted mx-auto max-w-2xl text-base leading-relaxed font-medium sm:text-lg">
          Inspect console logs, network calls, and storage entries directly on your phone. No USB
          cables or desktop devtools required. Built to be 100% framework-agnostic for any web
          stack.
        </p>
      </div>
    </section>
  );
};
