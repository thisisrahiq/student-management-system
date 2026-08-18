'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function PageTransition({ children, className, delay = 0 }: PageTransitionProps) {
  return (
    <div
      className={cn('animate-fade-in-up', className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

interface StaggeredListProps {
  children: React.ReactNode[];
  className?: string;
  baseDelay?: number;
  staggerMs?: number;
}

export function StaggeredList({ children, className, baseDelay = 0, staggerMs = 60 }: StaggeredListProps) {
  return (
    <>
      {React.Children.map(children, (child, index) => (
        <div
          className={cn('animate-fade-in-up', className)}
          style={{ animationDelay: `${baseDelay + index * staggerMs}ms` }}
        >
          {child}
        </div>
      ))}
    </>
  );
}
