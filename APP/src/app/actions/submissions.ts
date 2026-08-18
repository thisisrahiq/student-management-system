'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';

export async function submitAssessment(formData: FormData) {
  try {
    const assessmentId = formData.get('assessmentId') as string;
    const studentId = formData.get('studentId') as string;
    const file = formData.get('file') as File;

    if (!assessmentId || !studentId || !file) {
      return { success: false, error: 'Missing required assessment, student, or file deliverable.' };
    }

    // Validate file type extension
    const ext = path.extname(file.name).toLowerCase();
    if (ext !== '.pdf' && ext !== '.docx') {
      return { success: false, error: 'Invalid file format. Only PDF (.pdf) and Word (.docx) files are accepted.' };
    }

    // Fetch assessment to check deadline
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
    });

    if (!assessment) {
      return { success: false, error: 'Assessment not found.' };
    }

    const now = new Date();
    const isLate = now.getTime() > new Date(assessment.deadline).getTime();

    // Check existing submission
    const existingSubmission = await prisma.submission.findUnique({
      where: {
        assessmentId_studentId: {
          assessmentId,
          studentId,
        },
      },
    });

    // If deadline has passed and user is attempting a resubmission, reject
    if (existingSubmission && isLate) {
      return { success: false, error: 'Resubmission is disallowed after the assessment deadline has passed.' };
    }

    // Prepare upload storage directory inside public/uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    const safeFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const filePath = path.join(uploadDir, safeFileName);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    const relativePath = `/uploads/${safeFileName}`;

    // Upsert submission record
    const submission = await prisma.submission.upsert({
      where: {
        assessmentId_studentId: {
          assessmentId,
          studentId,
        },
      },
      update: {
        filePath: relativePath,
        fileName: file.name,
        submittedAt: now,
        isLate,
      },
      create: {
        assessmentId,
        studentId,
        filePath: relativePath,
        fileName: file.name,
        submittedAt: now,
        isLate,
      },
    });

    revalidatePath('/student/assessments');
    revalidatePath('/student/submissions');
    revalidatePath('/staff/assessments');
    revalidatePath('/staff');

    return { success: true, submission: JSON.parse(JSON.stringify(submission)) };
  } catch (err: any) {
    console.error('Error submitting assessment:', err);
    return { success: false, error: err.message || 'Failed to submit assessment deliverable.' };
  }
}

export async function getStudentSubmissions(studentId: string) {
  try {
    const submissions = await prisma.submission.findMany({
      where: { studentId },
      include: {
        assessment: {
          include: {
            module: true,
          },
        },
        result: true,
      },
      orderBy: { submittedAt: 'desc' },
    });

    return { success: true, submissions: JSON.parse(JSON.stringify(submissions)) };
  } catch (err: any) {
    return { success: false, submissions: [] };
  }
}

export async function getAllSubmissions() {
  try {
    const submissions = await prisma.submission.findMany({
      include: {
        assessment: {
          include: { module: true },
        },
        student: {
          include: { programme: true },
        },
        result: true,
      },
      orderBy: { submittedAt: 'desc' },
    });

    return { success: true, submissions: JSON.parse(JSON.stringify(submissions)) };
  } catch (err: any) {
    return { success: false, submissions: [] };
  }
}
