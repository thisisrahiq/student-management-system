import React from 'react';
import { getStudents, getProgrammes } from '@/app/actions/students';
import { StudentDirectoryClient } from './client';

export const revalidate = 0;

export default async function StaffStudentsPage() {
  const studentsRes = await getStudents();
  const programmesRes = await getProgrammes();

  return (
    <StudentDirectoryClient
      initialStudents={studentsRes.students || []}
      programmes={programmesRes.programmes || []}
    />
  );
}
