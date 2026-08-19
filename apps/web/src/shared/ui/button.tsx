import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

export const buttonVariants = cva(
  'active:scale-[0.98] inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'border border-neutral-800 bg-neutral-900 font-extrabold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200',
        secondary:
          'border border-dev-border bg-dev-bg-100 font-semibold text-dev-text-bright hover:bg-dev-bg-300',
        outline: 'border border-dev-border bg-transparent text-dev-text-bright hover:bg-dev-bg-300',
        ghost: 'bg-transparent text-dev-text-muted hover:bg-dev-bg-300 hover:text-dev-text-bright',
        contrast:
          'border-2 border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800 dark:border-neutral-600 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-900',
        danger:
          'border border-rose-500/30 bg-rose-500/10 font-semibold text-rose-600 hover:bg-rose-500/20 dark:text-rose-400',
      },
      size: {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-xs sm:text-sm',
        lg: 'px-5 py-2.5 text-sm sm:text-base',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ className, variant, size, children, ...props }) => {
  return (
    <button className={cn(buttonVariants({ variant, size, className }))} {...props}>
      {children}
    </button>
  );
};
