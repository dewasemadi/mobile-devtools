import React from 'react';

export interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'info' | 'purple';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, className = '' }) => {
  const variantStyles = {
    default: 'bg-dev-bg-300 border-dev-border text-dev-text-main',
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400',
    info: 'bg-sky-500/10 border-sky-500/30 text-sky-600 dark:text-sky-400',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-300',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-semibold ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
