/**
 * @fileoverview Due Medications Page
 * @module app/(dashboard)/medications/administration-due
 *
 * Real-time dashboard of medications due now with quick administration workflow.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import DueMedicationsDashboard from '@/components/medications/DueMedicationsDashboard';
import { PageHeader } from '@/components/shared/PageHeader';
import { fetchWithAuth } from '@/lib/server/fetch';
import { API_ENDPOINTS } from '@/constants/api';

export const metadata: Metadata = {
  title: 'Medications Due Now | White Cross',
  description: 'Medications requiring immediate administration'
};

/**
 * Fetch due medications
 */
async function getDueMedications() {
  try {
    const response = await fetchWithAuth(
      `${API_ENDPOINTS.MEDICATIONS.BASE}/due-now`,
      { next: { revalidate: 60 } } // 1 min cache - frequent updates
    );

    if (!response.ok) {
      throw new Error('Failed to fetch due medications');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching due medications:', error);
    return { due: [], upcoming: [], stats: {} };
  }
}

/**
 * Due Medications Page
 *
 * Server Component displaying medications that need to be administered now.
 * CRITICAL for daily nurse workflow - highest priority page.
 */
export default async function DueMedicationsPage() {
  const { due, upcoming, stats } = await getDueMedications();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medications Due Now"
        description="Medications requiring immediate administration"
        backLink="/medications"
        backLabel="Back to Medications"
      />

      {/* Critical Alert Banner */}
      {due.length > 0 && (
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                {due.length} medication{due.length !== 1 ? 's' : ''} due now
              </h3>
              <p className="mt-1 text-sm text-yellow-700">
                Medications require immediate administration. Please review and administer.
              </p>
            </div>
          </div>
        </div>
      )}

      <Suspense fallback={<DueLoadingSkeleton />}>
        <DueMedicationsDashboard
          dueMedications={due}
          upcomingMedications={upcoming}
          stats={stats}
        />
      </Suspense>
    </div>
  );
}

function DueLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 rounded-lg border border-gray-200 bg-white p-4"></div>
        ))}
      </div>
      {/* Medication cards */}
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-32 rounded-lg border border-gray-200 bg-white p-4"></div>
        ))}
      </div>
    </div>
  );
}
