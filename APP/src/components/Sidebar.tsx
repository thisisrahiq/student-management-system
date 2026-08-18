'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  FileCheck2,
  Award,
  BookOpen,
  User,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const isStaff = pathname.startsWith('/staff');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const staffLinks = [
    { name: 'Dashboard', href: '/staff', icon: LayoutDashboard },
    { name: 'Student Enrolment', href: '/staff/students', icon: Users },
    { name: 'Fees & Payments', href: '/staff/fees', icon: CreditCard },
    { name: 'Assessments', href: '/staff/assessments', icon: FileCheck2 },
    { name: 'Marksheet & Results', href: '/staff/results', icon: Award },
  ];

  const studentLinks = [
    { name: 'My Dashboard', href: '/student', icon: User },
    { name: 'My Fees', href: '/student/fees', icon: CreditCard },
    { name: 'My Assessments', href: '/student/assessments', icon: BookOpen },
    { name: 'My Results', href: '/student/results', icon: Award },
  ];

  const links = isStaff ? staffLinks : studentLinks;

  const sidebarContent = (
    <>
      {/* Portal Label */}
      <div className="mb-6 px-3 py-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200/80 animate-fade-in-up">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 dot-pulse" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {isStaff ? 'Administration' : 'Self-Service'}
          </span>
        </div>
        <span className="text-sm font-bold text-slate-800 block mt-1 tracking-tight">
          {isStaff ? 'Staff Portal' : 'Student Portal'}
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1">
        {links.map((link, index) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group animate-fade-in-up',
                isActive
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md shadow-sky-200/50 font-semibold sidebar-active-indicator'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
              )}
              style={{ animationDelay: `${(index + 1) * 60}ms` }}
            >
              <div className="flex items-center space-x-3">
                <Icon className={cn(
                  'w-4 h-4 transition-all duration-200',
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 group-hover:text-sky-500'
                )} />
                <span>{link.name}</span>
              </div>
              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 text-white/70" />
              )}
            </Link>
          );
        })}
      </nav>

    </>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed bottom-4 right-4 z-50 p-3 bg-gradient-to-r from-sky-500 to-indigo-500 text-white rounded-xl shadow-xl shadow-sky-300/30 hover:shadow-sky-300/50 transition-all duration-300"
        aria-label="Toggle sidebar"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm modal-overlay"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 min-h-[calc(100vh-4rem)] p-4 shrink-0 shadow-sm flex flex-col transition-transform duration-300 z-40',
        // Mobile: absolute positioned sliding in
        isMobileOpen ? 'fixed top-16 left-0 translate-x-0' : 'fixed top-16 left-0 -translate-x-full',
        // Desktop: always visible
        'md:relative md:top-0 md:translate-x-0 md:block'
      )}>
        {sidebarContent}
      </aside>
    </>
  );
}
