import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, ShieldCheck, ExternalLink } from 'lucide-react';
import { GithubIcon } from '@/shared/ui/icons/github-icon';
import { URLS } from '@/shared/constants';
import { VERSION } from 'mobile-devtools';

export const Footer: React.FC = () => {
  return (
    <footer className="border-dev-border text-dev-text-muted mt-20 w-full border-t bg-transparent font-sans transition-colors">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Col 1 & 2: Brand & Tagline */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="border-dev-border bg-dev-bg-300 text-dev-text-bright rounded-lg border p-1.5">
                <Smartphone className="size-5 text-emerald-500 dark:text-emerald-400" />
              </div>
              <span className="text-dev-text-bright text-lg font-extrabold tracking-tight">
                mobile-devtools
              </span>
              <span className="border-dev-border bg-dev-bg-300 text-dev-text-muted rounded-full border px-2 py-0.5 font-mono text-xs">
                v{VERSION}
              </span>
            </div>
            <p className="text-dev-text-muted max-w-md text-xs leading-relaxed sm:text-sm">
              Framework-agnostic in-app Chrome DevTools power for mobile web browsers. Inspect
              console logs, network traffic, and local storage directly on device in React, Vue 3,
              or Vanilla JS.
            </p>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h3 className="text-dev-text-bright mb-3 text-xs font-bold tracking-wider uppercase">
              Navigation
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a
                  href="#demo"
                  className="hover:text-dev-text-bright font-medium transition-colors"
                >
                  Interactive Demo
                </a>
              </li>
              <li>
                <a
                  href="#quickstart"
                  className="hover:text-dev-text-bright font-medium transition-colors"
                >
                  Quickstart Guide
                </a>
              </li>
              <li>
                <a href="#api" className="hover:text-dev-text-bright font-medium transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="hover:text-dev-text-bright font-medium transition-colors"
                >
                  Key Features
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Resources & Legal */}
          <div>
            <h3 className="text-dev-text-bright mb-3 text-xs font-bold tracking-wider uppercase">
              Resources
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a
                  href={URLS.GITHUB}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-dev-text-bright inline-flex items-center gap-1.5 font-medium transition-colors"
                >
                  <GithubIcon className="size-3.5 shrink-0 fill-current" />
                  <span>GitHub Repository</span>
                  <ExternalLink className="text-dev-text-subtle size-3 shrink-0" />
                </a>
              </li>
              <li>
                <a
                  href={URLS.NPM}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-dev-text-bright inline-flex items-center gap-1.5 font-medium transition-colors"
                >
                  <span>NPM Package</span>
                  <ExternalLink className="text-dev-text-subtle size-3 shrink-0" />
                </a>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-dev-text-bright inline-flex items-center gap-1.5 font-medium transition-colors"
                >
                  <ShieldCheck className="size-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-dev-border text-dev-text-subtle flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} mobile-devtools. Released under the MIT License.</p>
        </div>
      </div>
    </footer>
  );
};
