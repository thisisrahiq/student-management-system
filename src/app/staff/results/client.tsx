'use client';

import React, { useState, useTransition } from 'react';
import { submitGrade, togglePublishResult, getStaffResults } from '@/app/actions/results';
import { StatusBadge } from '@/components/Badge';
import { formatDateTime, calculateClassification } from '@/lib/utils';
import { Award, Eye, EyeOff, CheckCircle, AlertCircle, RefreshCw, FileText, X, Sparkles } from 'lucide-react';

interface Props {
  initialSubmissions: any[];
}

export function StaffResultsClient({ initialSubmissions }: Props) {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [gradingSubmission, setGradingSubmission] = useState<any | null>(null);
  const [gradeInput, setGradeInput] = useState('');
  const [isPublishedInput, setIsPublishedInput] = useState(false);

  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const refreshResults = () => {
    startTransition(async () => {
      const res = await getStaffResults();
      if (res.success && res.results) {
        setSubmissions(res.results);
      }
    });
  };

  const handleOpenGradeModal = (sub: any) => {
    setGradingSubmission(sub);
    setGradeInput(sub.result ? String(sub.result.numericGrade) : '');
    setIsPublishedInput(sub.result ? sub.result.isPublished : false);
    setFormError('');
    setFormSuccess('');
  };

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const numeric = parseInt(gradeInput, 10);
    if (isNaN(numeric) || numeric < 0 || numeric > 100) {
      setFormError('Grade must be a numeric integer between 0 and 100.');
      return;
    }

    startTransition(async () => {
      const res = await submitGrade({
        submissionId: gradingSubmission.id,
        numericGrade: numeric,
        isPublished: isPublishedInput,
      });

      if (!res.success) {
        setFormError(res.error || 'Failed to submit grade.');
      } else {
        setFormSuccess('Grade and classification updated successfully!');
        setTimeout(() => {
          setGradingSubmission(null);
          setFormSuccess('');
          refreshResults();
        }, 1000);
      }
    });
  };

  const handleTogglePublish = (resultId: string, currentPublishedState: boolean) => {
    startTransition(async () => {
      await togglePublishResult(resultId, !currentPublishedState);
      refreshResults();
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Marksheet & Results Governance</h1>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            Enter numeric grades (0–100), view auto-calculated classifications, and control result publication states.
          </p>
        </div>
      </div>

      {/* Results Table */}
      <div className="animate-fade-in-up glass-card rounded-xl overflow-hidden" style={{ animationDelay: '100ms' }}>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-gradient-to-r from-slate-100/80 to-slate-50/80 text-slate-700 font-semibold text-xs">
                <th>Student ID & Name</th>
                <th>Assessment & Module</th>
                <th>Submitted File</th>
                <th>Submission Status</th>
                <th>Numeric Grade</th>
                <th>Classification</th>
                <th>Publication State</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                        <Award className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="font-semibold text-slate-600">No submissions received yet</p>
                    </div>
                  </td>
                </tr>
              ) : (
                submissions.map((sub, i) => {
                  const res = sub.result;
                  return (
                    <tr key={sub.id} className="hover:bg-sky-50/50 transition-colors text-xs row-animate" style={{ animationDelay: `${i * 40}ms` }}>
                      <td>
                        <div className="font-semibold text-slate-900">{sub.student.fullName}</div>
                        <div className="font-mono text-[11px] text-sky-700 font-bold">{sub.student.studentId}</div>
                      </td>
                      <td>
                        <div className="font-semibold text-slate-800">{sub.assessment.title}</div>
                        <div className="text-[11px] text-slate-500">{sub.assessment.module.code}</div>
                      </td>
                      <td>
                        <a
                          href={sub.filePath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1.5 text-sky-600 font-medium hover:text-sky-700 hover:underline transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[120px]">{sub.fileName}</span>
                        </a>
                      </td>
                      <td>
                        {sub.isLate ? (
                          <StatusBadge type="LATE" />
                        ) : (
                          <StatusBadge type="ON_TIME" />
                        )}
                        <span className="text-[10px] text-slate-400 block mt-0.5">{formatDateTime(sub.submittedAt)}</span>
                      </td>
                      <td>
                        {res ? (
                          <span className="font-bold text-sm text-slate-900">{res.numericGrade} / 100</span>
                        ) : (
                          <span className="text-slate-400 italic">Not Graded</span>
                        )}
                      </td>
                      <td>
                        {res ? (
                          <StatusBadge type={res.classification} />
                        ) : (
                          <span className="text-slate-400 text-[11px]">Pending</span>
                        )}
                      </td>
                      <td>
                        {res ? (
                          <div className="flex items-center space-x-2">
                            <StatusBadge type={res.isPublished ? 'PUBLISHED' : 'WITHHELD'} />
                            <button
                              onClick={() => handleTogglePublish(res.id, res.isPublished)}
                              className={`btn btn-xs btn-ghost btn-circle transition-all ${res.isPublished ? 'hover:bg-emerald-50' : 'hover:bg-slate-100'}`}
                              title={res.isPublished ? 'Withhold Result' : 'Publish Result'}
                            >
                              {res.isPublished ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => handleOpenGradeModal(sub)}
                          className="btn btn-xs btn-primary gap-1 shadow-sm"
                        >
                          <Award className="w-3 h-3" /> {res ? 'Edit' : 'Grade'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grade Entry Modal */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 modal-overlay">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 modal-content">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <div className="p-1.5 bg-purple-100 rounded-lg">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                Grade Entry & Publishing
              </h3>
              <button
                onClick={() => setGradingSubmission(null)}
                className="btn btn-sm btn-circle btn-ghost hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-gradient-to-r from-slate-50 to-purple-50/30 p-4 rounded-xl border border-slate-200/80 text-xs space-y-1">
              <p><span className="font-semibold text-slate-700">Student:</span> {gradingSubmission.student.fullName} ({gradingSubmission.student.studentId})</p>
              <p><span className="font-semibold text-slate-700">Assessment:</span> {gradingSubmission.assessment.title}</p>
              <p><span className="font-semibold text-slate-700">Deliverable:</span> {gradingSubmission.fileName}</p>
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

            <form onSubmit={handleGradeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="label font-semibold text-slate-700">Numeric Grade (0 – 100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  placeholder="e.g. 78"
                  value={gradeInput}
                  onChange={(e) => setGradeInput(e.target.value)}
                  className="input input-sm input-bordered w-full font-bold text-slate-900 text-base focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              {/* Real-time preview of automatic classification */}
              {gradeInput !== '' && !isNaN(parseInt(gradeInput, 10)) && (
                <div className="animate-fade-in-up p-4 bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200/60 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span className="font-semibold text-purple-900 text-sm">Classification:</span>
                  </div>
                  <StatusBadge type={calculateClassification(parseInt(gradeInput, 10))} />
                </div>
              )}

              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={isPublishedInput}
                    onChange={(e) => setIsPublishedInput(e.target.checked)}
                    className="checkbox checkbox-sm checkbox-primary"
                  />
                  <span className="label-text font-semibold text-slate-800">
                    Publish Result to Student
                  </span>
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="btn btn-sm btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn btn-sm bg-gradient-to-r from-purple-500 to-violet-600 border-0 text-white gap-1 shadow-md shadow-purple-200/50"
                >
                  {isPending && <RefreshCw className="w-3 h-3 animate-spin" />}
                  Save Mark & Classification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
