import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { StatsCard } from '@/components/StatsCard';
import { StatusBadge } from '@/components/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Users,
  CreditCard,
  AlertTriangle,
  Award,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StaffDashboardPage() {
  let totalStudents = 0;
  let enrolledStudents = 0;
  let deferredStudents = 0;
  let feeRecords: any[] = [];
  let totalAssignedFee = 0;
  let totalPaid = 0;
  let totalOutstanding = 0;
  let overdueFeeRecords: any[] = [];
  let totalAssessments = 0;
  let pendingResultsCount = 0;
  let recentPayments: any[] = [];

  try {
    totalStudents = await prisma.student.count();
    enrolledStudents = await prisma.student.count({ where: { status: 'ENROLLED' } });
    deferredStudents = await prisma.student.count({ where: { status: 'DEFERRED' } });
    
    feeRecords = await prisma.fee.findMany({
      include: {
        student: { include: { programme: true } },
      },
    });

    totalAssignedFee = feeRecords.reduce((acc, f) => acc + Number(f.assignedAmount), 0);
    totalPaid = feeRecords.reduce((acc, f) => acc + Number(f.totalPaid), 0);
    totalOutstanding = totalAssignedFee - totalPaid;

    overdueFeeRecords = feeRecords.filter(
      (f) => Number(f.assignedAmount) > Number(f.totalPaid)
    );

    totalAssessments = await prisma.assessment.count();
    pendingResultsCount = await prisma.submission.count({
      where: {
        result: null,
      },
    });

    recentPayments = await prisma.payment.findMany({
      take: 5,
      orderBy: { paymentDate: 'desc' },
      include: { student: true },
    });
  } catch (err) {
    console.error('Database connection error on Staff Dashboard:', err);
  }

  // Get greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="animate-fade-in-up flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{greeting}, Registry Team</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Operational Overview</h1>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            Real-time dashboard for Student Enrolments, Programme Fees, Assessments, and Results.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/staff/students" className="btn btn-primary btn-sm gap-2 shadow-lg shadow-sky-200/50 hover:shadow-sky-200/70 transition-shadow">
            <Plus className="w-4 h-4" /> Enroll Student
          </Link>
          <Link href="/staff/fees" className="btn btn-outline btn-sm gap-2 hover:shadow-md transition-shadow">
            <CreditCard className="w-4 h-4" /> Record Payment
          </Link>
        </div>
      </div>

      {/* Overdue Warning Alert Banner if overdue students exist */}
      {overdueFeeRecords.length > 0 && (
        <div className="animate-fade-in-up p-4 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/80 flex items-center justify-between glow-pulse-red" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center space-x-3 text-red-800">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            </div>
            <div>
              <span className="font-bold text-sm">Action Required: </span>
              <span className="text-sm font-medium">
                {overdueFeeRecords.length} student(s) have an overdue balance totalling{' '}
                <strong>{formatCurrency(totalOutstanding)}</strong>.
              </span>
            </div>
          </div>
          <Link href="/staff/fees" className="btn btn-xs bg-gradient-to-r from-red-500 to-rose-600 border-0 text-white gap-1 shadow-sm">
            View Accounts <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <StatsCard
            title="Total Students"
            value={totalStudents}
            description={`${enrolledStudents} Enrolled, ${deferredStudents} Deferred`}
            icon={Users}
            variant="blue"
          />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
          <StatsCard
            title="Revenue Collected"
            value={formatCurrency(totalPaid)}
            description={`Of ${formatCurrency(totalAssignedFee)} assigned`}
            icon={CreditCard}
            variant="emerald"
          />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <StatsCard
            title="Outstanding Balance"
            value={formatCurrency(totalOutstanding)}
            description={`${overdueFeeRecords.length} overdue account(s)`}
            icon={AlertTriangle}
            variant="amber"
          />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: '250ms' }}>
          <StatsCard
            title="Pending Results"
            value={pendingResultsCount}
            description={`Across ${totalAssessments} total assessment(s)`}
            icon={Award}
            variant="purple"
          />
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overdue Students Table */}
        <div className="animate-fade-in-up glass-card rounded-xl p-5 space-y-4" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <div className="p-1.5 bg-amber-100 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              Overdue Balance Accounts
            </h2>
            <Link href="/staff/fees" className="text-xs text-sky-600 font-semibold hover:underline flex items-center gap-1">
              Manage All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {overdueFeeRecords.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">No overdue balance accounts found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-xs w-full">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-600">
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Assigned Fee</th>
                    <th>Paid</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueFeeRecords.slice(0, 5).map((f, i) => {
                    const balance = Number(f.assignedAmount) - Number(f.totalPaid);
                    return (
                      <tr key={f.id} className="hover row-animate" style={{ animationDelay: `${(i + 1) * 60}ms` }}>
                        <td className="font-mono text-xs font-semibold text-sky-700">{f.student.studentId}</td>
                        <td className="font-medium text-slate-900">{f.student.fullName}</td>
                        <td className="text-slate-600">{formatCurrency(f.assignedAmount)}</td>
                        <td className="text-emerald-700 font-medium">{formatCurrency(f.totalPaid)}</td>
                        <td className="text-red-600 font-bold">{formatCurrency(balance)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="animate-fade-in-up glass-card rounded-xl p-5 space-y-4" style={{ animationDelay: '350ms' }}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <div className="p-1.5 bg-emerald-100 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              Recent Payment Transactions
            </h2>
            <Link href="/staff/fees" className="text-xs text-sky-600 font-semibold hover:underline flex items-center gap-1">
              View Ledger <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentPayments.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">No payments recorded yet.</p>
          ) : (
            <div className="space-y-2.5">
              {recentPayments.map((p, i) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-slate-50/80 to-white border border-slate-100/80 hover-lift row-animate"
                  style={{ animationDelay: `${(i + 1) * 60}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{p.student.fullName}</p>
                      <p className="text-[11px] font-mono text-slate-500">Ref: {p.referenceNumber} • {formatDate(p.paymentDate)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-emerald-700 block">{formatCurrency(p.amount)}</span>
                    <span className="text-[10px] text-slate-400 font-medium flex items-center justify-end gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Confirmed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
