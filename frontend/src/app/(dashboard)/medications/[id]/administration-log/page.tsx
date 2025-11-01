/**
 * @fileoverview Medication Administration Log Page
 * @module app/(dashboard)/medications/[id]/administration-log
 *
 * Complete administration history for a specific medication with filtering and export.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AdministrationLog from '@/components/medications/AdministrationLog';
import { PageHeader } from '@/components/shared/PageHeader';
import { fetchWithAuth } from '@/lib/server/fetch';
import { API_ENDPOINTS } from '@/constants/api';

export const metadata: Metadata = {
  title: 'Administration Log | White Cross',
  description: 'Complete medication administration history with audit trail'
};

// Force dynamic rendering due to auth requirements
export const dynamic = 'force-dynamic';

interface AdministrationLogPageProps {
  params: {
    id: string;
  };
  searchParams: {
    page?: string;
    startDate?: string;
    endDate?: string;
  };
}

/**
 * Fetch medication and administration records
 */
async function getMedicationWithLog(id: string, searchParams: any) {
  try {
    const [medicationRes, logRes] = await Promise.all([
      fetchWithAuth(API_ENDPOINTS.MEDICATIONS.BY_ID(id), {
        next: { tags: [`medication-${id}`] }
      }),
      fetchWithAuth(
        `${API_ENDPOINTS.MEDICATIONS.BY_ID(id)}/administration-log?${new URLSearchParams(searchParams)}`,
        { next: { tags: [`medication-${id}-log`], revalidate: 60 } }
      )
    ]) as [Response, Response];

    if (!(medicationRes as Response).ok) return null;

    const medication = await (medicationRes as Response).json();
    const log = (logRes as Response).ok ? await (logRes as Response).json() : { records: [], total: 0 };

    return { medication, log };
  } catch (error) {
    console.error('Error fetching administration log:', error);
    return null;
  }
}

/**
 * Administration Log Page
 *
 * Server Component displaying complete administration history with HIPAA audit trail.
 */
export default async function AdministrationLogPage({
  params,
  searchParams
}: AdministrationLogPageProps) {
  const data = await getMedicationWithLog(params.id, searchParams);

  if (!data) {
    notFound();
  }

  const { medication, log } = data;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Administration Log - ${medication.name}`}
        description={`Complete administration history for ${medication.name} (${medication.dosage})`}
        backLink={`/medications/${params.id}`}
        backLabel="Back to Medication"
      />

      <Suspense fallback={<LogLoadingSkeleton />}>
        <AdministrationLog
          medicationId={params.id}
          medicationName={medication.name}
          records={log.records}
          total={log.total}
        />
      </Suspense>
    </div>
  );
}

function LogLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-10 w-full rounded bg-gray-100"></div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-24 w-full rounded border border-gray-200 bg-white p-4">
          <div className="space-y-2">
            <div className="h-4 w-3/4 rounded bg-gray-200"></div>
            <div className="h-4 w-1/2 rounded bg-gray-100"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
