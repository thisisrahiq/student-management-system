'use client';

import React, { useState, useTransition } from 'react';
import { createAssessment, getAssessments } from '@/app/actions/assessments';
import { formatDateTime } from '@/lib/utils';
import { FileCheck2, Plus, Calendar, Clock, AlertCircle, CheckCircle, RefreshCw, X, Users, FileText } from 'lucide-react';

interface Props {
  initialAssessments: any[];
  modules: any[];
}

export function StaffAssessmentsClient({ initialAssessments, modules }: Props) {
  const [assessments, setAssessments] = useState(initialAssessments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Form Fields
  const [title, setTitle] = useState('');
  const [moduleId, setModuleId] = useState(modules[0]?.id || '');
  const [deadline, setDeadline] = useState('');

  const refreshAssessments = () => {
    startTransition(async () => {
      const res = await getAssessments();
      if (res.success && res.assessments) {
        setAssessments(res.assessments);
      }
    });
  };

  const handleCreateAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!title || !moduleId || !deadline) {
      setFormError('Please fill out all required fields.');
      return;
    }

    startTransition(async () => {
      const res = await createAssessment({
        title,
        moduleId,
        deadline,
      });

      if (!res.success) {
        setFormError(res.error || 'Failed to create assessment.');
      } else {
        setFormSuccess('Assessment created successfully!');
        setTitle('');
        setTimeout(() => {
          setIsModalOpen(false);
          setFormSuccess('');
          refreshAssessments();
        }, 1200);
      }
    });
  };

  const isClosed = (d: string) => new Date().getTime() > new Date(d).getTime();

  // Calculate time remaining for open assessments
  const getTimeRemaining = (deadline: string) => {
    const diff = new Date(deadline).getTime() - new Date().getTime();
    if (diff <= 0) return null;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Assessment Management</h1>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            Create module assessments, set submission deadlines, and view student submission counts.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary gap-2 shadow-lg shadow-sky-200/50 hover:shadow-sky-200/70 font-semibold transition-all"
        >
          <Plus className="w-4 h-4" /> Create Assessment
        </button>
      </div>

      {/* Assessment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {assessments.map((a, i) => {
          const closed = isClosed(a.deadline);
          const submissionCount = a.submissions?.length || 0;
          const lateCount = a.submissions?.filter((s: any) => s.isLate).length || 0;
          const timeRemaining = getTimeRemaining(a.deadline);

          return (
            <div
              key={a.id}
              className="glass-card rounded-xl p-5 space-y-4 hover-lift group animate-fade-in-up"
              style={{ animationDelay: `${(i + 1) * 80}ms` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="badge badge-sm badge-outline font-mono text-[10px] uppercase font-bold text-slate-600 mb-2 border-slate-300">
                    {a.module?.code}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-sky-700 transition-colors">{a.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{a.module?.title}</p>
                </div>
                <span className={`badge badge-sm font-bold text-[10px] uppercase py-2.5 px-2.5 border-0 ${closed
                  ? 'bg-slate-200 text-slate-700'
                  : 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full mr-1 ${closed ? 'bg-slate-400' : 'bg-emerald-500 dot-pulse'}`} />
                  {closed ? 'Closed' : 'Open'}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100/80 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Deadline: <strong>{formatDateTime(a.deadline)}</strong></span>
                  </div>
                </div>
                {!closed && timeRemaining && (
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg w-fit border border-amber-200/50">
                    <Clock className="w-3 h-3" />
                    {timeRemaining}
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-r from-slate-50/80 to-white p-3 rounded-xl border border-slate-100/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center">
                    <Users className="w-3.5 h-3.5 text-sky-600" />
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Submissions</span>
                    <span className="font-bold text-slate-900 text-sm">{submissionCount}</span>
                  </div>
                </div>
                <div className="text-right flex items-center gap-2">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Late</span>
                    <span className={`font-bold text-sm ${lateCount > 0 ? 'text-amber-600' : 'text-slate-700'}`}>
                      {lateCount}
                    </span>
                  </div>
                  {lateCount > 0 && (
                    <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Assessment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 modal-overlay">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 modal-content">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <div className="p-1.5 bg-sky-100 rounded-lg">
                  <FileCheck2 className="w-5 h-5 text-sky-600" />
                </div>
                Create Assessment
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-sm btn-circle btn-ghost hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="animate-fade-in-up alert alert-error text-xs p-3 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="animate-fade-in-up alert alert-success text-xs p-3 text-white rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateAssessment} className="space-y-4 text-xs">
              <div>
                <label className="label font-semibold text-slate-700">Assessment Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Web Application Registry Architecture Project"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input input-sm input-bordered w-full focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div>
                <label className="label font-semibold text-slate-700">Module</label>
                <select
                  value={moduleId}
                  onChange={(e) => setModuleId(e.target.value)}
                  className="select select-sm select-bordered w-full focus:border-sky-400"
                >
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>{m.code} - {m.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label font-semibold text-slate-700">Submission Deadline</label>
                <input
                  type="datetime-local"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="input input-sm input-bordered w-full focus:border-sky-400"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-sm btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn btn-sm btn-primary gap-1 shadow-md shadow-sky-200/50"
                >
                  {isPending && <RefreshCw className="w-3 h-3 animate-spin" />}
                  Save Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
