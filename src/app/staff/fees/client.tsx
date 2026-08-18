'use client';

import React, { useState, useTransition } from 'react';
import { recordPayment, getFeeStatements } from '@/app/actions/payments';
import { StatusBadge } from '@/components/Badge';
import { ProgressBar } from '@/components/ProgressBar';
import { formatCurrency, formatDate, checkIsOverdue } from '@/lib/utils';
import { CreditCard, Plus, Search, CheckCircle, AlertCircle, RefreshCw, History, X, TrendingUp, ArrowRight } from 'lucide-react';

interface Props {
  initialFees: any[];
}

export function StaffFeesClient({ initialFees }: Props) {
  const [fees, setFees] = useState(initialFees);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFee, setSelectedFee] = useState<any | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [historyModalFee, setHistoryModalFee] = useState<any | null>(null);

  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Payment Form Fields
  const [amount, setAmount] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');

  const refreshFees = () => {
    startTransition(async () => {
      const res = await getFeeStatements();
      if (res.success && res.fees) {
        setFees(res.fees);
      }
    });
  };

  const handleOpenPaymentModal = (fee: any) => {
    setSelectedFee(fee);
    setFormError('');
    setFormSuccess('');
    setAmount('');
    setReferenceNumber(`PAY-${Date.now().toString().slice(-6)}`);
    setIsPaymentModalOpen(true);
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!selectedFee) return;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setFormError('Please enter a valid payment amount greater than £0.00.');
      return;
    }

    startTransition(async () => {
      const res = await recordPayment({
        studentId: selectedFee.studentId,
        feeId: selectedFee.id,
        amount: numAmount,
        referenceNumber,
      });

      if (!res.success) {
        setFormError(res.error || 'Failed to record payment.');
      } else {
        setFormSuccess(`Payment of ${formatCurrency(numAmount)} recorded successfully!`);
        setTimeout(() => {
          setIsPaymentModalOpen(false);
          setFormSuccess('');
          refreshFees();
        }, 1200);
      }
    });
  };

  const filteredFees = fees.filter((f) => {
    const q = searchQuery.toLowerCase();
    return (
      f.student.fullName.toLowerCase().includes(q) ||
      f.student.studentId.toLowerCase().includes(q) ||
      f.student.programme.name.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Programme Fees & Payment Tracking</h1>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            Audit student tuition fees, record payments, calculate outstanding balances, and flag overdue accounts.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="animate-fade-in-up glass-card p-4 rounded-xl flex items-center justify-between" style={{ animationDelay: '80ms' }}>
        <div className="relative w-full md:w-96 group">
          <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400 transition-colors group-focus-within:text-sky-500" />
          <input
            type="text"
            placeholder="Search student by Name, ID, or Programme..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-sm input-bordered w-full pl-9 text-xs focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
          />
        </div>
      </div>

      {/* Fee Statements Table */}
      <div className="animate-fade-in-up glass-card rounded-xl overflow-hidden" style={{ animationDelay: '120ms' }}>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-gradient-to-r from-slate-100/80 to-slate-50/80 text-slate-700 font-semibold text-xs">
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Programme</th>
                <th>Progress</th>
                <th>Assigned Fee</th>
                <th>Total Paid</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFees.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="font-semibold text-slate-600">No fee records found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredFees.map((f, i) => {
                  const assigned = Number(f.assignedAmount);
                  const paid = Number(f.totalPaid);
                  const balance = assigned - paid > 0 ? assigned - paid : 0;
                  const isOverdue = checkIsOverdue(assigned, paid);

                  return (
                    <tr key={f.id} className="hover:bg-sky-50/50 transition-colors text-xs row-animate" style={{ animationDelay: `${i * 40}ms` }}>
                      <td className="font-mono font-bold text-sky-700">{f.student.studentId}</td>
                      <td className="font-semibold text-slate-900">{f.student.fullName}</td>
                      <td className="text-slate-600">{f.student.programme.name}</td>
                      <td className="min-w-[120px]">
                        <ProgressBar value={paid} max={assigned} showPercentage={true} size="sm" />
                      </td>
                      <td className="font-medium text-slate-800">{formatCurrency(assigned)}</td>
                      <td className="font-semibold text-emerald-700">{formatCurrency(paid)}</td>
                      <td className={`font-bold ${balance > 0 ? 'text-red-600' : 'text-slate-700'}`}>
                        {formatCurrency(balance)}
                      </td>
                      <td>
                        {balance === 0 ? (
                          <StatusBadge type="PAID" />
                        ) : paid > 0 ? (
                          <StatusBadge type="PARTIAL" />
                        ) : isOverdue ? (
                          <StatusBadge type="OVERDUE" />
                        ) : (
                          <StatusBadge type="OVERDUE" />
                        )}
                      </td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleOpenPaymentModal(f)}
                            className="btn btn-xs btn-primary gap-1 shadow-sm"
                          >
                            <Plus className="w-3 h-3" /> Pay
                          </button>
                          <button
                            onClick={() => setHistoryModalFee(f)}
                            className="btn btn-xs btn-outline gap-1"
                            title="View Payment History"
                          >
                            <History className="w-3 h-3" /> Ledger
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {isPaymentModalOpen && selectedFee && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 modal-overlay">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 modal-content">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <div className="p-1.5 bg-emerald-100 rounded-lg">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                </div>
                Record Payment
              </h3>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="btn btn-sm btn-circle btn-ghost hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-gradient-to-r from-slate-50 to-sky-50/30 p-4 rounded-xl border border-slate-200/80 text-xs space-y-2">
              <p><span className="font-semibold text-slate-700">Student:</span> {selectedFee.student.fullName} ({selectedFee.student.studentId})</p>
              <p><span className="font-semibold text-slate-700">Programme:</span> {selectedFee.student.programme.name}</p>
              <ProgressBar
                value={Number(selectedFee.totalPaid)}
                max={Number(selectedFee.assignedAmount)}
                label="Payment Progress"
                size="md"
              />
              <p><span className="font-semibold text-slate-700">Remaining:</span> <strong className="text-red-600">{formatCurrency(Number(selectedFee.assignedAmount) - Number(selectedFee.totalPaid))}</strong></p>
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

            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              <div>
                <label className="label font-semibold text-slate-700">Payment Amount (£)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="e.g. 1500.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input input-sm input-bordered w-full font-bold text-slate-900 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="label font-semibold text-slate-700">Payment Reference Number</label>
                <input
                  type="text"
                  required
                  placeholder="PAY-2025-XXXX"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="input input-sm input-bordered w-full font-mono text-slate-800 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="btn btn-sm btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn btn-sm bg-gradient-to-r from-emerald-500 to-teal-600 border-0 text-white gap-1 shadow-md shadow-emerald-200/50"
                >
                  {isPending && <RefreshCw className="w-3 h-3 animate-spin" />}
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment History Modal */}
      {historyModalFee && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 modal-overlay">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 modal-content">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <div className="p-1.5 bg-sky-100 rounded-lg">
                  <History className="w-5 h-5 text-sky-600" />
                </div>
                Payment History
              </h3>
              <button
                onClick={() => setHistoryModalFee(null)}
                className="btn btn-sm btn-circle btn-ghost hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs space-y-1">
              <p className="font-semibold text-slate-800">{historyModalFee.student.fullName} ({historyModalFee.student.studentId})</p>
              <p className="text-slate-500">{historyModalFee.student.programme.name}</p>
            </div>

            {/* Timeline-style payment history */}
            {historyModalFee.payments.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <CreditCard className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="font-medium">No payments recorded yet</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {historyModalFee.payments.map((p: any, i: number) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-50/80 to-white border border-slate-100/80 row-animate"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono font-medium text-xs text-slate-700">{p.referenceNumber}</p>
                      <p className="text-[11px] text-slate-500">{formatDate(p.paymentDate)}</p>
                    </div>
                    <span className="font-bold text-sm text-emerald-700">{formatCurrency(p.amount)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setHistoryModalFee(null)}
                className="btn btn-sm btn-primary shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
