/**
 * @fileoverview Completed Medications Page
 * @module app/(dashboard)/medications/administration-completed
 *
 * Dashboard showing medications successfully administered today.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import CompletedMedicationsList from '@/components/medications/CompletedMedicationsList';
import { PageHeader } from '@/components/shared/PageHeader';
import { getCompletedAdministrations } from '@/lib/actions/medications.actions';
import { API_ENDPOINTS } from '@/constants/api';

export const metadata: Metadata = {
  title: 'Completed Administrations | White Cross',
  description: 'Successfully administered medications for today'
};



interface CompletedPageProps {
  searchParams: {
    date?: string;
    page?: string;
  };
}

/**
 * Fetch completed administrations
 */
async function getCompletedAdministrations(searchParams: any) {
  try {
    return await getCompletedAdministrations({
      date: searchParams.date,
      page: searchParams.page,
      limit: '50'
    });
  } catch (error) {
    console.error('Error fetching completed administrations:', error);
    return { completed: [], stats: {}, total: 0 };
  }
}

/**
 * Completed Medications Page
 *
 * Server Component showing successfully administered medications.
 */
export default async function CompletedAdministrationsPage({ searchParams }: CompletedPageProps) {
  const { completed, stats, total } = await getCompletedAdministrations(searchParams);
  const selectedDate = searchParams.date || new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Completed Administrations"
        description="Successfully administered medications"
        backLink="/medications"
        backLabel="Back to Medications"
      />

      {/* Success Summary */}
      {total > 0 && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                {total} medication{total !== 1 ? 's' : ''} administered successfully
              </h3>
              <p className="mt-1 text-sm text-green-700">
                All administrations for {new Date(selectedDate).toLocaleDateString()} have been recorded with HIPAA audit logs.
              </p>
            </div>
          </div>
        </div>
      )}

      <Suspense fallback={<CompletedLoadingSkeleton />}>
        <CompletedMedicationsList
          completed={completed}
          stats={stats}
          total={total}
          selectedDate={selectedDate}
        />
      </Suspense>
    </div>
  );
}

function CompletedLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 rounded-lg border border-gray-200 bg-white"></div>
        ))}
      </div>
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-24 rounded border border-gray-200 bg-white"></div>
        ))}
      </div>
    </div>
  );
}
