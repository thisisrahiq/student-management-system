import React from 'react';
import { getStaffResults } from '@/app/actions/results';
import { StaffResultsClient } from './client';

export const revalidate = 0;

export default async function StaffResultsPage() {
  const resultsRes = await getStaffResults();

  return <StaffResultsClient initialSubmissions={resultsRes.results || []} />;
}
