import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  type:
    | 'ENROLLED'
    | 'DEFERRED'
    | 'WITHDRAWN'
    | 'COMPLETED'
    | 'OVERDUE'
    | 'PAID'
    | 'PARTIAL'
    | 'ON_TIME'
    | 'LATE'
    | 'NOT_SUBMITTED'
    | 'DISTINCTION'
    | 'MERIT'
    | 'PASS'
    | 'FAIL'
    | 'PUBLISHED'
    | 'WITHHELD'
    | string;
  className?: string;
}

export function StatusBadge({ type, className }: BadgeProps) {
  const getBadgeStyle = () => {
    switch (type) {
      // Enrolment Statuses
      case 'ENROLLED':
        return 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm shadow-emerald-200';
      case 'DEFERRED':
        return 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 shadow-sm shadow-amber-200';
      case 'WITHDRAWN':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm shadow-red-200';
      case 'COMPLETED':
        return 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-sm shadow-sky-200';

      // Financial Statuses
      case 'OVERDUE':
        return 'bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold glow-pulse-red shadow-sm';
      case 'PAID':
        return 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-200';
      case 'PARTIAL':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm shadow-amber-200';

      // Submission Statuses
      case 'ON_TIME':
        return 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm';
      case 'LATE':
        return 'bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold shadow-sm';
      case 'NOT_SUBMITTED':
        return 'bg-slate-200 text-slate-600 border border-slate-300';

      // Grade Classifications
      case 'DISTINCTION':
        return 'bg-gradient-to-r from-purple-500 to-violet-600 text-white font-bold shadow-sm shadow-purple-200';
      case 'MERIT':
        return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-sm shadow-blue-200';
      case 'PASS':
        return 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm';
      case 'FAIL':
        return 'bg-gradient-to-r from-red-600 to-rose-700 text-white font-bold shadow-sm shadow-red-200';

      // Publication Statuses
      case 'PUBLISHED':
        return 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm';
      case 'WITHHELD':
        return 'bg-gradient-to-r from-slate-400 to-slate-500 text-white italic shadow-sm';

      default:
        return 'bg-slate-200 text-slate-700';
    }
  };

  const hasPulsingDot = ['ENROLLED', 'ON_TIME', 'PAID', 'PUBLISHED'].includes(type);

  const formatText = (t: string) => {
    return t.replace(/_/g, ' ');
  };

  return (
    <span className={cn(
      'badge badge-md py-3 px-3 uppercase text-[10px] tracking-wide font-medium rounded-lg border-0 inline-flex items-center gap-1.5',
      getBadgeStyle(),
      className
    )}>
      {hasPulsingDot && (
        <span className="w-1.5 h-1.5 rounded-full bg-white/80 dot-pulse" />
      )}
      {formatText(type)}
    </span>
  );
}
