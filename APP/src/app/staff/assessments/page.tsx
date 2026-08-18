import React from 'react';
import { getAssessments, getModules } from '@/app/actions/assessments';
import { StaffAssessmentsClient } from './client';

export const revalidate = 0;

export default async function StaffAssessmentsPage() {
  const assessmentsRes = await getAssessments();
  const modulesRes = await getModules();

  return (
    <StaffAssessmentsClient
      initialAssessments={assessmentsRes.assessments || []}
      modules={modulesRes.modules || []}
    />
  );
}
