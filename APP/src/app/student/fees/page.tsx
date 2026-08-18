import React from 'react';
import { prisma } from '@/lib/prisma';
import { StatusBadge } from '@/components/Badge';
import { ProgressBar } from '@/components/ProgressBar';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CreditCard, History, CheckCircle2, TrendingUp, Wallet } from 'lucide-react';

export const revalidate = 0;

export default async function StudentFeesPage() {
  const student = await prisma.student.findFirst({
    include: {
      programme: true,
      fee: {
        include: { payments: { orderBy: { paymentDate: 'desc' } } },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  if (!student || !student.fee) {
    return <div className="p-8 text-center text-slate-500 glass-card rounded-2xl">No fee record found.</div>;
  }

  const assigned = Number(student.fee.assignedAmount);
  const paid = Number(student.fee.totalPaid);
  const balance = assigned - paid > 0 ? assigned - paid : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up glass-card p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Tuition Fee Statement</h1>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            Official breakdown of assigned programme fees, payment transactions, and remaining balance.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {balance === 0 ? (
            <StatusBadge type="PAID" />
          ) : (
            <StatusBadge type="OVERDUE" />
          )}
        </div>
      </div>

      {/* Summary Cards with Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="animate-fade-in-up glass-card p-5 rounded-xl hover-lift" style={{ animationDelay: '80ms' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Assigned Fee</span>
            <div className="p-1.5 bg-sky-100 rounded-lg">
              <Wallet className="w-4 h-4 text-sky-600" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{formatCurrency(assigned)}</h3>
          <span className="text-xs text-slate-400 mt-1 block">{student.programme.name}</span>
        </div>

        <div className="animate-fade-in-up glass-card p-5 rounded-xl hover-lift" style={{ animationDelay: '120ms' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Total Payments</span>
            <div className="p-1.5 bg-emerald-100 rounded-lg">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-emerald-700 mt-1">{formatCurrency(paid)}</h3>
          <span className="text-xs text-slate-400 mt-1 block">{student.fee.payments.length} Transaction(s)</span>
        </div>

        <div className="animate-fade-in-up glass-card p-5 rounded-xl hover-lift" style={{ animationDelay: '160ms' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Outstanding Balance</span>
            <div className={`p-1.5 rounded-lg ${balance > 0 ? 'bg-red-100' : 'bg-emerald-100'}`}>
              <CreditCard className={`w-4 h-4 ${balance > 0 ? 'text-red-600' : 'text-emerald-600'}`} />
            </div>
          </div>
          <h3 className={`text-2xl font-extrabold mt-1 ${balance > 0 ? 'text-red-600' : 'text-slate-700'}`}>
            {formatCurrency(balance)}
          </h3>
          <span className="text-xs text-slate-400 mt-1 block">Real-time Calculation</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="animate-fade-in-up glass-card p-5 rounded-xl" style={{ animationDelay: '200ms' }}>
        <ProgressBar value={paid} max={assigned} label="Payment Progress" size="lg" />
      </div>

      {/* Payment Ledger */}
      <div className="animate-fade-in-up glass-card rounded-xl p-5 space-y-4" style={{ animationDelay: '240ms' }}>
        <h2 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
          <div className="p-1.5 bg-sky-100 rounded-lg">
            <History className="w-5 h-5 text-sky-600" />
          </div>
          Recorded Payment Transactions
        </h2>

        {student.fee.payments.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto mb-3">
              <CreditCard className="w-7 h-7 text-slate-400" />
            </div>
            <p className="font-semibold text-slate-600">No payments recorded yet</p>
            <p className="text-xs text-slate-400 mt-1">Payment transactions will appear here once recorded by Registry.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {student.fee.payments.map((p, i) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-slate-50/80 to-white border border-slate-100/80 hover-lift row-animate"
                style={{ animationDelay: `${(i + 1) * 60}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-mono font-semibold text-xs text-slate-800">{p.referenceNumber}</p>
                    <p className="text-[11px] text-slate-500">{formatDate(p.paymentDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm text-emerald-700">{formatCurrency(p.amount)}</span>
                  <span className="badge badge-sm bg-gradient-to-r from-emerald-500 to-teal-600 border-0 text-white gap-1 text-[10px] py-2.5">
                    <CheckCircle2 className="w-3 h-3" /> Confirmed
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
