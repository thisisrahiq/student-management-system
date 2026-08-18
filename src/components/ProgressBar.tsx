'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProgressBar({
  value,
  max,
  label,
  showPercentage = true,
  size = 'md',
  className,
}: ProgressBarProps) {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  const getColor = () => {
    if (percentage >= 100) return 'from-emerald-400 to-emerald-600';
    if (percentage >= 60) return 'from-sky-400 to-sky-600';
    if (percentage >= 30) return 'from-amber-400 to-amber-500';
    return 'from-red-400 to-red-500';
  };

  const getTrackColor = () => {
    if (percentage >= 100) return 'bg-emerald-100';
    if (percentage >= 60) return 'bg-sky-100';
    if (percentage >= 30) return 'bg-amber-100';
    return 'bg-red-100';
  };

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className={cn(
              'text-xs font-bold tabular-nums',
              percentage >= 100 ? 'text-emerald-600' : percentage >= 60 ? 'text-sky-600' : percentage >= 30 ? 'text-amber-600' : 'text-red-600'
            )}>
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      <div className={cn('w-full rounded-full overflow-hidden', getTrackColor(), heights[size])}>
        <div
          className={cn(
            'h-full rounded-full bg-gradient-to-r progress-fill relative overflow-hidden',
            getColor()
          )}
          style={{ width: `${percentage}%` }}
        >
          {/* Shimmer overlay */}
          <div className="absolute inset-0 progress-shimmer" />
        </div>
      </div>
    </div>
  );
}
