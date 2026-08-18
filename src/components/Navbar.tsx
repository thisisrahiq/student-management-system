'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { GraduationCap, ShieldCheck, UserCheck, ArrowLeftRight } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isToggling, setIsToggling] = useState(false);

  const isStaffView = pathname.startsWith('/staff');

  const toggleRole = () => {
    setIsToggling(true);
    setTimeout(() => {
      if (isStaffView) {
        router.push('/student');
      } else {
        router.push('/staff');
      }
      setTimeout(() => setIsToggling(false), 300);
    }, 150);
  };

  return (
    <header className="sticky top-0 z-50 gradient-header text-white shadow-xl gradient-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href={isStaffView ? '/staff' : '/student'} className="flex items-center space-x-3 group">
          <div className="p-2 bg-white/10 rounded-xl group-hover:bg-white/20 transition-all duration-300 border border-white/10 group-hover:border-white/20 group-hover:shadow-lg group-hover:shadow-sky-500/20">
            <GraduationCap className="w-6 h-6 text-sky-300 group-hover:text-sky-200 transition-colors" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-white block leading-none">
              Registry Module
            </span>
            <span className="text-[10px] text-sky-200/80 font-medium tracking-wide uppercase">
              Student Management System
            </span>
          </div>
        </Link>

        {/* Right Navigation & Role Toggle */}
        <div className="flex items-center space-x-3">
          {/* Role Toggle */}
          <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm p-1.5 rounded-xl border border-white/10">
            <span className="text-[11px] font-semibold text-slate-300 px-2.5 flex items-center gap-1.5">
              {isStaffView ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 dot-pulse" />
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Staff Portal</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-sky-400 dot-pulse" />
                  <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden sm:inline">Student Portal</span>
                </>
              )}
            </span>

            <button
              onClick={toggleRole}
              disabled={isToggling}
              className="btn btn-xs bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 border-0 text-white gap-1.5 shadow-lg shadow-sky-500/20 font-semibold transition-all duration-300 hover:shadow-sky-500/40 disabled:opacity-70"
              title="Toggle between Registry Staff view and Student portal"
            >
              <ArrowLeftRight className={`w-3 h-3 transition-transform duration-300 ${isToggling ? 'rotate-180' : ''}`} />
              <span className="hidden sm:inline">
                Switch to {isStaffView ? 'Student' : 'Staff'}
              </span>
            </button>
          </div>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-indigo-500/20 border border-white/10 cursor-pointer hover:shadow-indigo-500/40 transition-shadow duration-300">
            {isStaffView ? 'RS' : 'AW'}
          </div>
        </div>
      </div>
    </header>
  );
}
