import React from 'react';
import { getFeeStatements } from '@/app/actions/payments';
import { StaffFeesClient } from './client';

export const revalidate = 0;

export default async function StaffFeesPage() {
  const feesRes = await getFeeStatements();

  return <StaffFeesClient initialFees={feesRes.fees || []} />;
}
