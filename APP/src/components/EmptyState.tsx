import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('py-16 flex flex-col items-center justify-center text-center animate-fade-in-up', className)}>
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-5 shadow-sm">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="font-bold text-slate-700 text-base mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm leading-relaxed">{description}</p>
      {actionLabel && (actionHref || onAction) && (
        <div className="mt-5">
          {actionHref ? (
            <Link href={actionHref} className="btn btn-sm btn-primary gap-2 shadow-sm">
              {actionLabel}
            </Link>
          ) : (
            <button onClick={onAction} className="btn btn-sm btn-primary gap-2 shadow-sm">
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
