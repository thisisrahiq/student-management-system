import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  variant?: 'blue' | 'emerald' | 'amber' | 'purple' | 'red';
}

export function StatsCard({ title, value, description, icon: Icon, variant = 'blue' }: StatsCardProps) {
  const getColors = () => {
    switch (variant) {
      case 'emerald':
        return {
          card: 'card-gradient-emerald border-emerald-200/60 hover:shadow-glow-emerald',
          text: 'text-emerald-700',
          iconBg: 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-200',
          iconRing: 'ring-4 ring-emerald-100',
        };
      case 'amber':
        return {
          card: 'card-gradient-amber border-amber-200/60 hover:shadow-glow-amber',
          text: 'text-amber-700',
          iconBg: 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-200',
          iconRing: 'ring-4 ring-amber-100',
        };
      case 'purple':
        return {
          card: 'card-gradient-purple border-purple-200/60 hover:shadow-glow-purple',
          text: 'text-purple-700',
          iconBg: 'bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow-lg shadow-purple-200',
          iconRing: 'ring-4 ring-purple-100',
        };
      case 'red':
        return {
          card: 'card-gradient-red border-red-200/60 hover:shadow-glow-red',
          text: 'text-red-700',
          iconBg: 'bg-gradient-to-br from-red-400 to-red-600 text-white shadow-lg shadow-red-200',
          iconRing: 'ring-4 ring-red-100',
        };
      case 'blue':
      default:
        return {
          card: 'card-gradient-blue border-sky-200/60 hover:shadow-glow-blue',
          text: 'text-sky-700',
          iconBg: 'bg-gradient-to-br from-sky-400 to-sky-600 text-white shadow-lg shadow-sky-200',
          iconRing: 'ring-4 ring-sky-100',
        };
    }
  };

  const colors = getColors();

  return (
    <div className={cn(
      'p-5 rounded-xl border glass-card hover-lift group',
      colors.card
    )}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{title}</p>
          <h3 className={cn('text-2xl font-extrabold tracking-tight', colors.text)}>
            {value}
          </h3>
          {description && (
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{description}</p>
          )}
        </div>
        <div className={cn(
          'p-3 rounded-xl transition-transform duration-300 group-hover:scale-110',
          colors.iconBg,
          colors.iconRing
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
