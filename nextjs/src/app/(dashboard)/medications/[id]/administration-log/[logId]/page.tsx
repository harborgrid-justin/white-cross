/**
 * @fileoverview Administration Record Detail Page
 * @module app/(dashboard)/medications/[id]/administration-log/[logId]
 *
 * Detailed view of a single medication administration record with full audit trail.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AdministrationRecordDetail from '@/components/medications/AdministrationRecordDetail';
import { PageHeader } from '@/components/shared/PageHeader';
import { fetchWithAuth } from '@/lib/server/fetch';
import { API_ENDPOINTS } from '@/constants/api';

export const metadata: Metadata = {
  title: 'Administration Record | White Cross',
  description: 'Detailed medication administration record with Five Rights verification'
};

interface AdministrationRecordPageProps {
  params: {
    id: string;
    logId: string;
  };
}

/**
 * Fetch administration record
 */
async function getAdministrationRecord(medicationId: string, logId: string) {
  try {
    const response = await fetchWithAuth(
      `${API_ENDPOINTS.MEDICATIONS.BY_ID(medicationId)}/administration-log/${logId}`,
      { next: { tags: [`admin-record-${logId}`] } }
    );

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch administration record');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching administration record:', error);
    return null;
  }
}

/**
 * Administration Record Detail Page
 */
export default async function AdministrationRecordPage({ params }: AdministrationRecordPageProps) {
  const record = await getAdministrationRecord(params.id, params.logId);

  if (!record) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administration Record"
        description={`Administered on ${new Date(record.administeredAt).toLocaleString()}`}
        backLink={`/medications/${params.id}/administration-log`}
        backLabel="Back to Log"
      />

      <Suspense fallback={<RecordLoadingSkeleton />}>
        <AdministrationRecordDetail record={record} medicationId={params.id} />
      </Suspense>
    </div>
  );
}

function RecordLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6 rounded-lg border border-gray-200 bg-white p-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-32 rounded bg-gray-200"></div>
          <div className="h-6 w-full rounded bg-gray-100"></div>
        </div>
      ))}
    </div>
  );
}
