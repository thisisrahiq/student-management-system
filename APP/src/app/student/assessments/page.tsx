import React from 'react';
import { prisma } from '@/lib/prisma';
import { StudentAssessmentsClient } from './client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StudentAssessmentsPage() {
  let student: any = null;
  let assessments: any[] = [];

  try {
    student = await prisma.student.findFirst({
      include: { programme: true },
      orderBy: { createdAt: 'asc' },
    });

    assessments = await prisma.assessment.findMany({
      include: {
        module: true,
        submissions: {
          where: { studentId: student?.id || '' },
        },
      },
      orderBy: { deadline: 'asc' },
    });
  } catch (err) {
    console.error('Database connection error on Student Assessments Page:', err);
  }

  return (
    <StudentAssessmentsClient
      student={student ? JSON.parse(JSON.stringify(student)) : null}
      assessments={assessments ? JSON.parse(JSON.stringify(assessments)) : []}
    />
  );
}
