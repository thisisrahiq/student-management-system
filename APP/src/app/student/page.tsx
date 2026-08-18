import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { StatusBadge } from '@/components/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { User, CreditCard, BookOpen, Award, ArrowRight, FileText, Sparkles, TrendingUp } from 'lucide-react';

export const revalidate = 0;

export default async function StudentDashboardPage() {
  // Fetch active student for demo (Alice Walker)
  const student = await prisma.student.findFirst({
    include: {
      programme: true,
      fee: {
        include: { payments: { orderBy: { paymentDate: 'desc' } } },
      },
      submissions: {
        include: {
          assessment: { include: { module: true } },
          result: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  if (!student) {
    return (
      <div className="p-8 text-center glass-card rounded-2xl">
        <p className="text-slate-500">No student profiles found. Please seed the database.</p>
      </div>
    );
  }

  const assignedFee = Number(student.fee?.assignedAmount || 0);
  const totalPaid = Number(student.fee?.totalPaid || 0);
  const balance = assignedFee - totalPaid > 0 ? assignedFee - totalPaid : 0;
  const paymentPercentage = assignedFee > 0 ? Math.min((totalPaid / assignedFee) * 100, 100) : 0;

  // Published results only
  const publishedSubmissions = student.submissions.filter(
    (s) => s.result && s.result.isPublished
  );

  return (
    <div className="space-y-6">
      {/* Student Profile Card */}
      <div className="animate-fade-in-up gradient-header text-white p-6 rounded-2xl shadow-xl border border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-400/30 to-indigo-500/30 border border-white/20 flex items-center justify-center text-xl font-extrabold text-sky-300 shrink-0 shadow-lg shadow-sky-500/10">
            {student.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2 flex-wrap">
              <h1 className="text-2xl font-extrabold tracking-tight">{student.fullName}</h1>
              <StatusBadge type={student.status} />
            </div>
            <p className="text-xs text-sky-200/80 font-mono mt-1">Student ID: <strong className="text-white">{student.studentId}</strong> • {student.email}</p>
            <p className="text-xs text-sky-200/60 mt-0.5">{student.programme.name} ({student.academicYear})</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 text-right shrink-0">
          <span className="text-[10px] text-sky-200/80 uppercase font-bold tracking-widest block">Outstanding Tuition</span>
          <span className="text-2xl font-extrabold text-white block mt-0.5">{formatCurrency(balance)}</span>
          {assignedFee > 0 && (
            <div className="mt-2 w-32">
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400 progress-fill"
                  style={{ width: `${paymentPercentage}%` }}
                />
              </div>
              <span className="text-[10px] text-sky-200/60 mt-1 block">{paymentPercentage.toFixed(0)}% paid</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="animate-fade-in-up glass-card p-5 rounded-xl space-y-3 hover-lift group" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Tuition Fee Account</span>
            <div className="p-2 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-lg group-hover:scale-110 transition-transform">
              <CreditCard className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 block">{formatCurrency(totalPaid)}</span>
            <span className="text-xs text-slate-500">Total Paid of {formatCurrency(assignedFee)}</span>
          </div>
          <Link href="/student/fees" className="btn btn-xs btn-outline btn-block mt-2 gap-1 hover:shadow-md transition-all">
            View Fee Statement <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="animate-fade-in-up glass-card p-5 rounded-xl space-y-3 hover-lift group" style={{ animationDelay: '150ms' }}>
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active Submissions</span>
            <div className="p-2 bg-gradient-to-br from-sky-100 to-sky-50 rounded-lg group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5 text-sky-600" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 block">{student.submissions.length}</span>
            <span className="text-xs text-slate-500">Assessments Submitted</span>
          </div>
          <Link href="/student/assessments" className="btn btn-xs btn-outline btn-block mt-2 gap-1 hover:shadow-md transition-all">
            Submit Deliverables <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="animate-fade-in-up glass-card p-5 rounded-xl space-y-3 hover-lift group" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Published Marksheet</span>
            <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 block">{publishedSubmissions.length}</span>
            <span className="text-xs text-slate-500">Published Academic Grades</span>
          </div>
          <Link href="/student/results" className="btn btn-xs btn-outline btn-block mt-2 gap-1 hover:shadow-md transition-all">
            View Official Results <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Published Academic Results Table */}
      <div className="animate-fade-in-up glass-card rounded-xl p-5 space-y-4" style={{ animationDelay: '250ms' }}>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <div className="p-1.5 bg-purple-100 rounded-lg">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            Official Published Marksheet
          </h2>
          <Link href="/student/results" className="text-xs text-sky-600 font-semibold hover:underline flex items-center gap-1">
            Full Marksheet <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {publishedSubmissions.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto shadow-sm">
              <Sparkles className="w-7 h-7 text-slate-400" />
            </div>
            <div>
              <p className="font-semibold text-slate-700">No Results Published Yet</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                Results remain withheld by Registry until official grade moderation and publication is completed.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-sm w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50/80 to-slate-100/50 text-slate-700 text-xs">
                  <th>Module</th>
                  <th>Assessment Title</th>
                  <th>Numeric Grade</th>
                  <th>Classification</th>
                  <th>Graded Date</th>
                </tr>
              </thead>
              <tbody>
                {publishedSubmissions.map((sub, i) => (
                  <tr key={sub.id} className="hover:bg-sky-50/50 transition-colors row-animate" style={{ animationDelay: `${i * 60}ms` }}>
                    <td className="font-mono text-xs font-bold text-slate-700">{sub.assessment.module.code}</td>
                    <td className="font-semibold text-slate-900">{sub.assessment.title}</td>
                    <td className="font-bold text-slate-900">{sub.result?.numericGrade} / 100</td>
                    <td>
                      {sub.result && <StatusBadge type={sub.result.classification} />}
                    </td>
                    <td className="text-xs text-slate-500">{sub.result?.gradedAt ? formatDate(sub.result.gradedAt) : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
