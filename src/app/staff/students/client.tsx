'use client';

import React, { useState, useTransition } from 'react';
import { createStudent, getStudents } from '@/app/actions/students';
import { StatusBadge } from '@/components/Badge';
import { formatDate } from '@/lib/utils';
import { Plus, Search, Filter, RefreshCw, UserPlus, CheckCircle, AlertCircle, Users, X } from 'lucide-react';

interface Props {
  initialStudents: any[];
  programmes: any[];
}

export function StudentDirectoryClient({ initialStudents, programmes }: Props) {
  const [students, setStudents] = useState(initialStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgramme, setSelectedProgramme] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('2002-05-15');
  const [academicYear, setAcademicYear] = useState('2025/2026');
  const [status, setStatus] = useState('ENROLLED');
  const [programmeId, setProgrammeId] = useState(programmes[0]?.id || '');

  const handleSearchAndFilter = (query: string, prog: string, stat: string) => {
    startTransition(async () => {
      const res = await getStudents(query, prog, stat);
      if (res.success && res.students) {
        setStudents(res.students);
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    startTransition(async () => {
      const res = await createStudent({
        fullName,
        email,
        dateOfBirth,
        academicYear,
        status: status as any,
        programmeId,
      });

      if (!res.success) {
        setFormError(res.error || 'Failed to enroll student.');
      } else {
        setFormSuccess(`Student enrolled successfully! Assigned ID: ${res.student?.studentId}`);
        setFullName('');
        setEmail('');
        setTimeout(() => {
          setIsModalOpen(false);
          setFormSuccess('');
          handleSearchAndFilter(searchQuery, selectedProgramme, selectedStatus);
        }, 1500);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Student Enrolment Directory</h1>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            Manage student records, enrolment statuses, and auto-generated Student IDs.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary gap-2 shadow-lg shadow-sky-200/50 hover:shadow-sky-200/70 font-semibold transition-all"
        >
          <UserPlus className="w-4 h-4" /> Enroll New Student
        </button>
      </div>

      {/* Filter Controls */}
      <div className="animate-fade-in-up glass-card p-4 rounded-xl flex flex-col md:flex-row gap-3 items-center justify-between" style={{ animationDelay: '80ms' }}>
        {/* Search */}
        <div className="relative w-full md:w-96 group">
          <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400 transition-colors group-focus-within:text-sky-500" />
          <input
            type="text"
            placeholder="Search by Name, Student ID (SMS-2025-XXXX)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearchAndFilter(e.target.value, selectedProgramme, selectedStatus);
            }}
            className="input input-sm input-bordered w-full pl-9 text-xs focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
          />
          {isPending && (
            <RefreshCw className="w-3.5 h-3.5 absolute right-3 top-3.5 text-sky-500 animate-spin" />
          )}
        </div>

        {/* Programme & Status Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="p-2 bg-slate-100 rounded-lg hidden sm:block">
            <Filter className="w-4 h-4 text-slate-400" />
          </div>
          
          <select
            value={selectedProgramme}
            onChange={(e) => {
              setSelectedProgramme(e.target.value);
              handleSearchAndFilter(searchQuery, e.target.value, selectedStatus);
            }}
            className="select select-sm select-bordered text-xs flex-1 md:flex-none focus:border-sky-400"
          >
            <option value="ALL">All Programmes</option>
            {programmes.map((p) => (
              <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              handleSearchAndFilter(searchQuery, selectedProgramme, e.target.value);
            }}
            className="select select-sm select-bordered text-xs flex-1 md:flex-none focus:border-sky-400"
          >
            <option value="ALL">All Statuses</option>
            <option value="ENROLLED">Enrolled</option>
            <option value="DEFERRED">Deferred</option>
            <option value="WITHDRAWN">Withdrawn</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Student count */}
      <div className="animate-fade-in-up flex items-center gap-2 px-1" style={{ animationDelay: '120ms' }}>
        <Users className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-semibold text-slate-500">
          {students.length} student record{students.length !== 1 ? 's' : ''} found
        </span>
      </div>

      {/* Students Directory Table */}
      <div className="animate-fade-in-up glass-card rounded-xl overflow-hidden" style={{ animationDelay: '160ms' }}>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-gradient-to-r from-slate-100/80 to-slate-50/80 text-slate-700 font-semibold text-xs">
                <th>Student ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Programme</th>
                <th>Academic Year</th>
                <th>Status</th>
                <th>Date of Birth</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                        <Users className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="font-semibold text-slate-600">No records found</p>
                      <p className="text-xs text-slate-400">Try adjusting your search or filter criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                students.map((student, i) => (
                  <tr
                    key={student.id}
                    className="hover:bg-sky-50/50 transition-colors row-animate"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <td className="font-mono text-xs font-bold text-sky-700">{student.studentId}</td>
                    <td className="font-semibold text-slate-900">{student.fullName}</td>
                    <td className="text-slate-600 text-xs">{student.email}</td>
                    <td className="text-xs font-medium text-slate-700">{student.programme?.name || 'Unassigned'}</td>
                    <td className="text-xs text-slate-600">{student.academicYear}</td>
                    <td>
                      <StatusBadge type={student.status} />
                    </td>
                    <td className="text-xs text-slate-500">{formatDate(student.dateOfBirth)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enrolment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 modal-overlay">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 modal-content">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <div className="p-1.5 bg-sky-100 rounded-lg">
                  <UserPlus className="w-5 h-5 text-sky-600" />
                </div>
                Student Enrolment Form
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

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="label font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jane Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input input-sm input-bordered w-full focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div>
                <label className="label font-semibold text-slate-700">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="jane.doe@student.university.ac.uk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input input-sm input-bordered w-full focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label font-semibold text-slate-700">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="input input-sm input-bordered w-full focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="label font-semibold text-slate-700">Academic Year</label>
                  <input
                    type="text"
                    required
                    placeholder="2025/2026"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="input input-sm input-bordered w-full focus:border-sky-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label font-semibold text-slate-700">Programme</label>
                  <select
                    value={programmeId}
                    onChange={(e) => setProgrammeId(e.target.value)}
                    className="select select-sm select-bordered w-full focus:border-sky-400"
                  >
                    {programmes.map((p) => (
                      <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label font-semibold text-slate-700">Enrolment Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="select select-sm select-bordered w-full focus:border-sky-400"
                  >
                    <option value="ENROLLED">Enrolled</option>
                    <option value="DEFERRED">Deferred</option>
                    <option value="WITHDRAWN">Withdrawn</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-gradient-to-r from-slate-50 to-sky-50/50 rounded-xl border border-slate-200/80 text-slate-500">
                <span className="font-semibold block text-slate-700">Automatic ID Generator:</span>
                Student ID format will be generated as <code className="text-sky-700 font-bold bg-sky-50 px-1.5 py-0.5 rounded">SMS-2025-XXXX</code>. Initial programme fee record will be automatically assigned upon creation.
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
                  Save Student Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
