import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export function Card({ className, children, hoverEffect = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-gray-200/80 rounded-card shadow-sm overflow-hidden transition-all duration-200",
        hoverEffect && "hover:shadow-md hover:border-gray-300/80 hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
