import React from 'react';
import { prisma } from '@/lib/prisma';
import { getStudentPublishedResults } from '@/app/actions/results';
import { StatusBadge } from '@/components/Badge';
import { formatDate } from '@/lib/utils';
import { Award, Lock, CheckCircle2, Sparkles, GraduationCap } from 'lucide-react';

export const revalidate = 0;

export default async function StudentResultsPage() {
  const student = await prisma.student.findFirst({
    include: { programme: true },
    orderBy: { createdAt: 'asc' },
  });

  if (!student) {
    return <div className="p-8 text-center text-slate-500 glass-card rounded-2xl">No student profile found.</div>;
  }

  // Fetch strictly published results
  const res = await getStudentPublishedResults(student.id);
  const results = res.results || [];

  // Calculate average score
  const avgScore = results.length > 0
    ? results.reduce((acc, r) => acc + r.numericGrade, 0) / results.length
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up glass-card p-6 rounded-2xl">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Official Academic Marksheet</h1>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
          View official published assessment grades and earned classifications for {student.fullName} ({student.studentId}).
        </p>
      </div>

      {/* Average Score Card (if results exist) */}
      {avgScore !== null && (
        <div className="animate-fade-in-up grid grid-cols-1 md:grid-cols-3 gap-5" style={{ animationDelay: '80ms' }}>
          <div className="glass-card p-5 rounded-xl hover-lift">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Average Score</span>
              <div className="p-1.5 bg-purple-100 rounded-lg">
                <Award className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900">{avgScore.toFixed(1)}</h3>
            <span className="text-xs text-slate-400">out of 100</span>
          </div>
          <div className="glass-card p-5 rounded-xl hover-lift">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Results Published</span>
              <div className="p-1.5 bg-emerald-100 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <h3 className="text-3xl font-extrabold text-emerald-700">{results.length}</h3>
            <span className="text-xs text-slate-400">grade(s) released</span>
          </div>
          <div className="glass-card p-5 rounded-xl hover-lift">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Programme</span>
              <div className="p-1.5 bg-sky-100 rounded-lg">
                <GraduationCap className="w-4 h-4 text-sky-600" />
              </div>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 mt-1">{student.programme.name}</h3>
            <span className="text-xs text-slate-400 font-mono">{student.programme.code}</span>
          </div>
        </div>
      )}

      {/* Marksheet Table */}
      <div className="animate-fade-in-up glass-card rounded-xl p-6 space-y-4" style={{ animationDelay: '160ms' }}>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <div className="p-1.5 bg-purple-100 rounded-lg">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            Published Results & Classifications
          </h2>
          <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2.5 py-1 rounded-lg">
            {student.programme.name}
          </span>
        </div>

        {results.length === 0 ? (
          <div className="py-16 text-center space-y-4 animate-fade-in-up">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <p className="font-bold text-slate-700 text-base">No Official Results Published Yet</p>
              <p className="text-sm text-slate-500 max-w-md mx-auto mt-1.5 leading-relaxed">
                Results remain withheld by Registry Administrators until official grade moderation and publication is completed.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-xs">
              <thead>
                <tr className="bg-gradient-to-r from-slate-100/80 to-slate-50/80 text-slate-700">
                  <th>Module Code & Title</th>
                  <th>Assessment Name</th>
                  <th>Submitted Deliverable</th>
                  <th>Numeric Score</th>
                  <th>Classification</th>
                  <th>Publication Date</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={r.id} className="hover:bg-sky-50/50 transition-colors row-animate" style={{ animationDelay: `${i * 60}ms` }}>
                    <td>
                      <div className="font-bold text-slate-900">{r.submission.assessment.module.code}</div>
                      <div className="text-[11px] text-slate-500">{r.submission.assessment.module.title}</div>
                    </td>
                    <td className="font-semibold text-slate-800">{r.submission.assessment.title}</td>
                    <td className="font-mono text-slate-600">{r.submission.fileName}</td>
                    <td>
                      <span className="font-bold text-sm text-slate-900">{r.numericGrade}</span>
                      <span className="text-slate-400"> / 100</span>
                    </td>
                    <td>
                      <StatusBadge type={r.classification} />
                    </td>
                    <td className="text-slate-500">{formatDate(r.gradedAt)}</td>
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
