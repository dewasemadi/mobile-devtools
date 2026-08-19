'use client';

import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone } from 'lucide-react';
import { GithubIcon } from '@/shared/ui/icons/github-icon';
import { Button } from '@/shared/ui/button';
import { ThemeToggle } from '@/features/theme-toggle/ui/theme-toggle';
import { URLS } from '@/shared/constants';
import { VERSION } from 'mobile-devtools';

export const Navbar: React.FC = () => {
  return (
    <header className="border-dev-border bg-dev-bg-100/90 sticky top-0 z-50 w-full border-b pt-[env(safe-area-inset-top)] backdrop-blur-md transition-colors duration-200">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        {/* Logo Group */}
        <Link to="/" className="group flex items-center gap-2.5">
          <div className="border-dev-border bg-dev-bg-300 text-dev-text-bright rounded-lg border p-1.5 transition-colors group-hover:border-neutral-400">
            <Smartphone className="size-5 text-emerald-500 dark:text-emerald-400" />
          </div>
          <span className="text-dev-text-bright text-sm font-extrabold tracking-tight sm:text-base">
            mobile-devtools
          </span>
          <span className="border-dev-border bg-dev-bg-300 text-dev-text-muted hidden rounded-full border px-2 py-0.5 font-mono text-[11px] font-semibold sm:inline-block">
            v{VERSION}
          </span>
        </Link>

        {/* Nav Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* GitHub Button */}
          <a href={URLS.GITHUB} target="_blank" rel="noreferrer">
            <Button variant="primary" size="sm">
              <GithubIcon className="size-4 shrink-0 fill-current" />
              <span>GitHub</span>
            </Button>
          </a>
        </div>
      </nav>
    </header>
  );
};
