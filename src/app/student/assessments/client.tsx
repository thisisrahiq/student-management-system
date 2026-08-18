'use client';

import React, { useState, useTransition } from 'react';
import { submitAssessment } from '@/app/actions/submissions';
import { StatusBadge } from '@/components/Badge';
import { formatDateTime } from '@/lib/utils';
import { BookOpen, UploadCloud, FileText, CheckCircle, AlertCircle, RefreshCw, Calendar, Clock, X, File } from 'lucide-react';

interface Props {
  student: any;
  assessments: any[];
}

export function StudentAssessmentsClient({ student, assessments }: Props) {
  const [selectedAssessment, setSelectedAssessment] = useState<any | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const [dragOver, setDragOver] = useState(false);

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const handleOpenUploadModal = (a: any) => {
    setSelectedAssessment(a);
    setFile(null);
    setDragOver(false);
    setFormError('');
    setFormSuccess('');
  };

  const handleSubmitFile = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!selectedAssessment || !student || !file) {
      setFormError('Please select a valid PDF or DOCX deliverable file.');
      return;
    }

    const formData = new FormData();
    formData.append('assessmentId', selectedAssessment.id);
    formData.append('studentId', student.id);
    formData.append('file', file);

    startTransition(async () => {
      const res = await submitAssessment(formData);

      if (!res.success) {
        setFormError(res.error || 'Failed to submit file.');
      } else {
        setFormSuccess('Assessment deliverable uploaded successfully!');
        setTimeout(() => {
          setSelectedAssessment(null);
          setFormSuccess('');
          window.location.reload();
        }, 1200);
      }
    });
  };

  const isClosed = (deadline: string) => new Date().getTime() > new Date(deadline).getTime();

  const getTimeRemaining = (deadline: string) => {
    const diff = new Date(deadline).getTime() - new Date().getTime();
    if (diff <= 0) return null;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && (droppedFile.name.endsWith('.pdf') || droppedFile.name.endsWith('.docx'))) {
      setFile(droppedFile);
    } else {
      setFormError('Only .pdf and .docx files are accepted.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up glass-card p-6 rounded-2xl">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Assessment Deliverables Portal</h1>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
          Upload PDF or DOCX assessment work. Resubmission is permitted prior to deadline expiration.
        </p>
      </div>

      {/* Assessment List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {assessments.map((a, i) => {
          const closed = isClosed(a.deadline);
          const submission = a.submissions?.[0];
          const timeRemaining = getTimeRemaining(a.deadline);

          return (
            <div
              key={a.id}
              className="glass-card rounded-xl p-6 space-y-4 flex flex-col justify-between hover-lift group animate-fade-in-up"
              style={{ animationDelay: `${(i + 1) * 80}ms` }}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="badge badge-sm badge-outline font-mono text-[10px] font-bold text-slate-600 uppercase border-slate-300">
                    {a.module?.code}
                  </span>
                  <span className={`badge badge-sm font-bold text-[10px] uppercase py-2.5 px-2.5 border-0 ${closed
                    ? 'bg-slate-200 text-slate-700'
                    : 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1 ${closed ? 'bg-slate-400' : 'bg-emerald-500 dot-pulse'}`} />
                    {closed ? 'Closed' : 'Open'}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-lg leading-snug group-hover:text-sky-700 transition-colors">{a.title}</h3>
                <p className="text-xs text-slate-500">{a.module?.title}</p>

                <div className="flex items-center space-x-2 text-xs text-slate-600 pt-1">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Deadline: <strong>{formatDateTime(a.deadline)}</strong></span>
                </div>

                {!closed && timeRemaining && (
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg w-fit border border-amber-200/50">
                    <Clock className="w-3 h-3" />
                    {timeRemaining}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100/80 space-y-3">
                {submission ? (
                  <div className="p-3 bg-gradient-to-r from-slate-50/80 to-white rounded-xl border border-slate-200/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700">Active Submission:</span>
                      {submission.isLate ? (
                        <StatusBadge type="LATE" />
                      ) : (
                        <StatusBadge type="ON_TIME" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-sky-700 font-mono font-medium">
                      <FileText className="w-4 h-4 shrink-0" />
                      <span className="truncate">{submission.fileName}</span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Submitted at: {formatDateTime(submission.submittedAt)}
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-gradient-to-r from-amber-50/80 to-amber-50/30 rounded-xl border border-amber-200/50 text-xs text-amber-800 font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    No submission uploaded yet.
                  </div>
                )}

                <button
                  onClick={() => handleOpenUploadModal(a)}
                  className="btn btn-sm btn-primary w-full gap-2 shadow-md shadow-sky-200/40 hover:shadow-sky-200/60 transition-all"
                >
                  <UploadCloud className="w-4 h-4" />
                  {submission ? 'Resubmit Deliverable' : 'Upload Submission'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload File Modal */}
      {selectedAssessment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 modal-overlay">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 modal-content">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <div className="p-1.5 bg-sky-100 rounded-lg">
                  <UploadCloud className="w-5 h-5 text-sky-600" />
                </div>
                Upload Deliverable
              </h3>
              <button
                onClick={() => setSelectedAssessment(null)}
                className="btn btn-sm btn-circle btn-ghost hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-gradient-to-r from-slate-50 to-sky-50/30 p-3 rounded-xl border border-slate-200/80 text-xs space-y-1">
              <p><span className="font-semibold text-slate-700">Assessment:</span> {selectedAssessment.title}</p>
              <p><span className="font-semibold text-slate-700">Deadline:</span> {formatDateTime(selectedAssessment.deadline)}</p>
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

            <form onSubmit={handleSubmitFile} className="space-y-4 text-xs">
              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                  dragOver
                    ? 'border-sky-400 bg-sky-50/50'
                    : file
                    ? 'border-emerald-300 bg-emerald-50/30'
                    : 'border-slate-300 bg-slate-50/50 hover:border-sky-300 hover:bg-sky-50/30'
                }`}
              >
                <input
                  type="file"
                  accept=".pdf,.docx"
                  required={!file}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-emerald-600" />
                    </div>
                    <p className="font-semibold text-slate-700">{file.name}</p>
                    <p className="text-[11px] text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                      <UploadCloud className="w-5 h-5 text-slate-400" />
                    </div>
                    <p className="font-semibold text-slate-600">Drop file here or click to browse</p>
                    <p className="text-[11px] text-slate-400">PDF or DOCX up to 10MB</p>
                  </div>
                )}
              </div>

              <div className="p-3 bg-gradient-to-r from-sky-50/80 to-indigo-50/30 rounded-xl border border-sky-100/80 text-[11px] text-sky-900">
                <strong>Note:</strong> Submissions past the deadline are accepted but flagged as <strong className="text-amber-700">LATE</strong> for staff review.
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAssessment(null)}
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
                  Submit Deliverable
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
