'use server';

import { prisma } from '@/lib/prisma';
import { gradeSchema, GradeFormValues } from '@/lib/validations';
import { calculateClassification } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { GradeClassification } from '@prisma/client';

export async function submitGrade(data: GradeFormValues) {
  try {
    const validated = gradeSchema.parse(data);

    // Calculate classification
    const classification = calculateClassification(validated.numericGrade);

    // Upsert Result
    const result = await prisma.result.upsert({
      where: { submissionId: validated.submissionId },
      update: {
        numericGrade: validated.numericGrade,
        classification: classification as GradeClassification,
        isPublished: validated.isPublished ?? false,
      },
      create: {
        submissionId: validated.submissionId,
        numericGrade: validated.numericGrade,
        classification: classification as GradeClassification,
        isPublished: validated.isPublished ?? false,
      },
    });

    revalidatePath('/staff/results');
    revalidatePath('/student/results');
    revalidatePath('/staff');
    revalidatePath('/student');

    return { success: true, result: JSON.parse(JSON.stringify(result)) };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to submit grade.' };
  }
}

export async function togglePublishResult(resultId: string, isPublished: boolean) {
  try {
    const updated = await prisma.result.update({
      where: { id: resultId },
      data: { isPublished },
    });

    revalidatePath('/staff/results');
    revalidatePath('/student/results');
    revalidatePath('/staff');
    revalidatePath('/student');

    return { success: true, result: JSON.parse(JSON.stringify(updated)) };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update publication status.' };
  }
}

export async function getStaffResults() {
  try {
    const results = await prisma.submission.findMany({
      include: {
        student: {
          include: { programme: true },
        },
        assessment: {
          include: { module: true },
        },
        result: true,
      },
      orderBy: { submittedAt: 'desc' },
    });

    return { success: true, results: JSON.parse(JSON.stringify(results)) };
  } catch (err: any) {
    return { success: false, results: [] };
  }
}

export async function getStudentPublishedResults(studentId: string) {
  try {
    // Strictly filter WHERE isPublished = true for student confidentiality
    const publishedResults = await prisma.result.findMany({
      where: {
        isPublished: true,
        submission: {
          studentId: studentId,
        },
      },
      include: {
        submission: {
          include: {
            assessment: {
              include: { module: true },
            },
          },
        },
      },
      orderBy: { gradedAt: 'desc' },
    });

    return { success: true, results: JSON.parse(JSON.stringify(publishedResults)) };
  } catch (err: any) {
    return { success: false, results: [] };
  }
}
