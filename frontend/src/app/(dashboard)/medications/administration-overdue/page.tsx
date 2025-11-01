/**
 * @fileoverview Overdue Medications Page
 * @module app/(dashboard)/medications/administration-overdue
 *
 * Critical alert page for medications that are overdue for administration.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import OverdueMedicationsList from '@/components/medications/OverdueMedicationsList';
import { PageHeader } from '@/components/shared/PageHeader';
import { fetchWithAuth } from '@/lib/server/fetch';
import { API_ENDPOINTS } from '@/constants/api';

export const metadata: Metadata = {
  title: 'Overdue Medications | White Cross',
  description: 'Medications that have not been administered on schedule'
};



/**
 * Fetch overdue medications
 */
async function getOverdueMedications() {
  try {
    const response = await fetchWithAuth(
      `${API_ENDPOINTS.MEDICATIONS.BASE}/overdue`,
      { next: { revalidate: 60 } } // 1 min cache
    ) as Response;

    if (!(response as Response).ok) {
      throw new Error('Failed to fetch overdue medications');
    }

    return (response as Response).json();
  } catch (error) {
    console.error('Error fetching overdue medications:', error);
    return { overdue: [], stats: {} };
  }
}

/**
 * Overdue Medications Page
 *
 * Server Component displaying medications that are overdue for administration.
 * Requires immediate attention and follow-up actions.
 */
export default async function OverdueMedicationsPage() {
  const { overdue, stats } = await getOverdueMedications();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overdue Medications"
        description="Medications that have not been administered on schedule"
        backLink="/medications"
        backLabel="Back to Medications"
      />

      {/* Critical Alert Banner */}
      {overdue.length > 0 && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {overdue.length} medication{overdue.length !== 1 ? 's' : ''} overdue
              </h3>
              <p className="mt-1 text-sm text-red-700">
                These medications were not administered on schedule. Immediate action required.
              </p>
            </div>
          </div>
        </div>
      )}

      {overdue.length === 0 && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                All medications on schedule
              </h3>
              <p className="mt-1 text-sm text-green-700">
                No overdue medications at this time. Excellent work!
              </p>
            </div>
          </div>
        </div>
      )}

      <Suspense fallback={<OverdueLoadingSkeleton />}>
        <OverdueMedicationsList medications={overdue} stats={stats} />
      </Suspense>
    </div>
  );
}

function OverdueLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-28 rounded-lg border border-red-200 bg-white p-4"></div>
      ))}
    </div>
  );
}
