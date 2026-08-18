import React from 'react';
import Link from 'next/link';
import { GraduationCap, ShieldCheck, UserCheck, ArrowRight, Sparkles, Database, FileCheck2, CreditCard, Award } from 'lucide-react';

export default function RootLandingPage() {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center space-y-10 py-10 animate-fade-in-up">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-purple-500/10 border border-sky-200/60 text-sky-700 text-xs font-semibold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-sky-500 animate-spin-slow" />
          <span>Academic Registry Governance Platform</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Student Management System
        </h1>

        <p className="text-base text-slate-600 leading-relaxed">
          Production-grade registry module modeling student enrolments, programme tuition fees, module assessments, and official marksheet governance.
        </p>
      </div>

      {/* Portal Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full">
        {/* Staff Portal Card */}
        <Link
          href="/staff"
          className="glass-card p-8 rounded-2xl border border-sky-200/60 hover-lift group relative overflow-hidden flex flex-col justify-between space-y-6 card-gradient-blue"
        >
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-sky-600 block mb-1">
                Administration
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors">
                Staff Portal
              </h2>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Manage student enrolments, record tuition fee payments, audit overdue accounts, create module assessments, and publish marksheet results.
              </p>
            </div>
          </div>

          <div className="flex items-center text-xs font-bold text-sky-600 group-hover:translate-x-1 transition-transform">
            <span>Enter Staff Dashboard</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </div>
        </Link>

        {/* Student Portal Card */}
        <Link
          href="/student"
          className="glass-card p-8 rounded-2xl border border-indigo-200/60 hover-lift group relative overflow-hidden flex flex-col justify-between space-y-6 card-gradient-purple"
        >
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
              <UserCheck className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 block mb-1">
                Self-Service
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Student Portal
              </h2>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                View personal enrolment details, check tuition balance & payment ledger, submit PDF/DOCX assessment deliverables, and view official published grades.
              </p>
            </div>
          </div>

          <div className="flex items-center text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
            <span>Enter Student Portal</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </div>
        </Link>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl w-full pt-4">
        <div className="p-4 rounded-xl bg-white/60 backdrop-blur-md border border-slate-200/60 text-center space-y-1">
          <GraduationCap className="w-5 h-5 text-sky-500 mx-auto" />
          <span className="text-xs font-bold text-slate-800 block">Enrolment Directory</span>
          <span className="text-[10px] text-slate-500 block">Auto-ID Generation</span>
        </div>
        <div className="p-4 rounded-xl bg-white/60 backdrop-blur-md border border-slate-200/60 text-center space-y-1">
          <CreditCard className="w-5 h-5 text-emerald-500 mx-auto" />
          <span className="text-xs font-bold text-slate-800 block">Tuition Ledger</span>
          <span className="text-[10px] text-slate-500 block">Overdue Balance Audit</span>
        </div>
        <div className="p-4 rounded-xl bg-white/60 backdrop-blur-md border border-slate-200/60 text-center space-y-1">
          <FileCheck2 className="w-5 h-5 text-amber-500 mx-auto" />
          <span className="text-xs font-bold text-slate-800 block">Assessments</span>
          <span className="text-[10px] text-slate-500 block">Late Submission Flags</span>
        </div>
        <div className="p-4 rounded-xl bg-white/60 backdrop-blur-md border border-slate-200/60 text-center space-y-1">
          <Award className="w-5 h-5 text-purple-500 mx-auto" />
          <span className="text-xs font-bold text-slate-800 block">Marksheet Control</span>
          <span className="text-[10px] text-slate-500 block">Withheld vs Published</span>
        </div>
      </div>
    </div>
  );
}
