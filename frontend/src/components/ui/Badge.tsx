import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'brand' | 'gray' | 'success' | 'indigo' | 'warning' | 'purple';
}

export function Badge({ className, variant = 'gray', ...props }: BadgeProps) {
  const variantStyles = {
    brand: 'bg-brand/10 text-brand border border-brand/20',
    gray: 'bg-gray-100 text-gray-700 border border-gray-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200',
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
