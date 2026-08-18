'use server';

import { prisma } from '@/lib/prisma';
import { paymentSchema, PaymentFormValues } from '@/lib/validations';
import { revalidatePath } from 'next/cache';

export async function recordPayment(data: PaymentFormValues) {
  try {
    const validated = paymentSchema.parse(data);

    // Verify duplicate reference number
    const existingRef = await prisma.payment.findUnique({
      where: { referenceNumber: validated.referenceNumber },
    });

    if (existingRef) {
      return { success: false, error: 'A payment with this reference number already exists.' };
    }

    // Verify fee record
    const feeRecord = await prisma.fee.findUnique({
      where: { id: validated.feeId },
    });

    if (!feeRecord) {
      return { success: false, error: 'Student fee record not found.' };
    }

    const currentTotalPaid = Number(feeRecord.totalPaid);
    const newTotalPaid = currentTotalPaid + validated.amount;

    // Transaction: Save payment and increment totalPaid on fee record
    const payment = await prisma.$transaction(async (tx) => {
      const newPayment = await tx.payment.create({
        data: {
          studentId: validated.studentId,
          feeId: validated.feeId,
          amount: validated.amount,
          referenceNumber: validated.referenceNumber,
          paymentDate: validated.paymentDate ? new Date(validated.paymentDate) : new Date(),
        },
      });

      await tx.fee.update({
        where: { id: validated.feeId },
        data: {
          totalPaid: newTotalPaid,
        },
      });

      return newPayment;
    });

    revalidatePath('/staff/fees');
    revalidatePath('/staff');
    revalidatePath('/student/fees');
    revalidatePath('/student');

    return { success: true, payment: JSON.parse(JSON.stringify(payment)) };
  } catch (err: any) {
    console.error('Error recording payment:', err);
    return { success: false, error: err.message || 'Failed to record payment transaction.' };
  }
}

export async function getFeeStatements() {
  try {
    const fees = await prisma.fee.findMany({
      include: {
        student: {
          include: {
            programme: true,
          },
        },
        payments: {
          orderBy: { paymentDate: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, fees: JSON.parse(JSON.stringify(fees)) };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to fetch fee statements.', fees: [] };
  }
}

export async function getStudentFeeSummary(studentId: string) {
  try {
    const fee = await prisma.fee.findFirst({
      where: { studentId },
      include: {
        student: {
          include: { programme: true },
        },
        payments: {
          orderBy: { paymentDate: 'desc' },
        },
      },
    });

    return { success: true, fee: JSON.parse(JSON.stringify(fee)) };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to fetch student fee summary.' };
  }
}
