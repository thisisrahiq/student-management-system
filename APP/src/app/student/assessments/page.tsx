import React from 'react';
import { prisma } from '@/lib/prisma';
import { StudentAssessmentsClient } from './client';

export const revalidate = 0;

export default async function StudentAssessmentsPage() {
  const student = await prisma.student.findFirst({
    include: { programme: true },
    orderBy: { createdAt: 'asc' },
  });

  const assessments = await prisma.assessment.findMany({
    include: {
      module: true,
      submissions: {
        where: { studentId: student?.id || '' },
      },
    },
    orderBy: { deadline: 'asc' },
  });

  return (
    <StudentAssessmentsClient
      student={student ? JSON.parse(JSON.stringify(student)) : null}
      assessments={assessments ? JSON.parse(JSON.stringify(assessments)) : []}
    />
  );
}
