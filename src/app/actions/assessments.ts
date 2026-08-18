'use server';

import { prisma } from '@/lib/prisma';
import { assessmentSchema, AssessmentFormValues } from '@/lib/validations';
import { revalidatePath } from 'next/cache';

export async function createAssessment(data: AssessmentFormValues) {
  try {
    const validated = assessmentSchema.parse(data);

    const assessment = await prisma.assessment.create({
      data: {
        title: validated.title,
        moduleId: validated.moduleId,
        deadline: new Date(validated.deadline),
      },
    });

    revalidatePath('/staff/assessments');
    revalidatePath('/student/assessments');
    revalidatePath('/staff');

    return { success: true, assessment: JSON.parse(JSON.stringify(assessment)) };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create assessment.' };
  }
}

export async function getAssessments() {
  try {
    const assessments = await prisma.assessment.findMany({
      include: {
        module: {
          include: {
            programme: true,
          },
        },
        submissions: {
          include: {
            student: true,
            result: true,
          },
        },
      },
      orderBy: { deadline: 'asc' },
    });

    return { success: true, assessments: JSON.parse(JSON.stringify(assessments)) };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to fetch assessments.', assessments: [] };
  }
}

export async function getModules() {
  try {
    const modules = await prisma.module.findMany({
      include: { programme: true },
      orderBy: { code: 'asc' },
    });
    return { success: true, modules: JSON.parse(JSON.stringify(modules)) };
  } catch (err: any) {
    return { success: false, modules: [] };
  }
}
