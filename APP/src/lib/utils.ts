import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string | DecimalLike): string {
  const numeric = typeof amount === 'number' ? amount : Number(amount);
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric || 0);
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export type DecimalLike = { toString(): string } | number | string;

export function calculateClassification(grade: number): 'DISTINCTION' | 'MERIT' | 'PASS' | 'FAIL' {
  if (grade < 0 || grade > 100) {
    throw new Error('Grade must be between 0 and 100');
  }
  if (grade >= 70) return 'DISTINCTION';
  if (grade >= 60) return 'MERIT';
  if (grade >= 40) return 'PASS';
  return 'FAIL';
}

export function generateNextStudentId(counter: number, year: number = new Date().getFullYear()): string {
  const paddedCounter = String(counter).padStart(4, '0');
  return `SMS-${year}-${paddedCounter}`;
}

export function calculateOutstandingBalance(assignedFee: number, totalPaid: number): number {
  const balance = assignedFee - totalPaid;
  return balance < 0 ? 0 : balance;
}

export function checkIsOverdue(assignedFee: number, totalPaid: number): boolean {
  return assignedFee > totalPaid;
}
