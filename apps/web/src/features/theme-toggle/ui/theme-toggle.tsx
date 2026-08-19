import React from 'react';
import { useTheme } from '@/shared/providers/theme-provider';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="group border-dev-border bg-dev-bg-100 text-dev-text-bright hover:bg-dev-bg-300 flex size-9 cursor-pointer items-center justify-center rounded-lg border p-0 transition-colors"
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun className="size-4 text-amber-400 transition-transform duration-300 group-hover:rotate-45" />
      ) : (
        <Moon className="size-4 text-indigo-600 transition-transform duration-300 group-hover:-rotate-12 dark:text-indigo-400" />
      )}
    </button>
  );
};
