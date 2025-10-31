/**
 * @fileoverview Over-the-Counter Medications Page
 * @module app/(dashboard)/medications/over-the-counter
 *
 * List and manage OTC medications with parental consent tracking.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { Link } from 'next/link';
import MedicationsList from '@/components/medications/MedicationsList';
import { PageHeader } from '@/components/shared/PageHeader';
import { fetchWithAuth } from '@/lib/server/fetch';
import { API_ENDPOINTS } from '@/constants/api';

export const metadata: Metadata = {
  title: 'Over-the-Counter Medications | White Cross',
  description: 'Manage OTC medications with parental consent'
};

// Force dynamic rendering due to auth requirements
export const dynamic = 'force-dynamic';

/**
 * Fetch OTC medications
 */
async function getOTCMedications() {
  try {
    const response = await fetchWithAuth(
      `${API_ENDPOINTS.MEDICATIONS.BASE}?type=over_the_counter`,
      { next: { tags: ['medications-otc'], revalidate: 300 } }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch OTC medications');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching OTC medications:', error);
    return { medications: [], total: 0 };
  }
}

/**
 * OTC Medications Page
 */
export default async function OTCMedicationsPage() {
  const { medications, total } = await getOTCMedications();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Over-the-Counter Medications"
        description="Manage OTC medications and parental consent forms"
        backLink="/medications"
        backLabel="Back to Medications"
      >
        <Link
          href="/medications/new?type=over_the_counter"
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          Add OTC Medication
        </Link>
      </PageHeader>

      <div className="rounded-md bg-blue-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-blue-800">Parental Consent Required</h3>
            <p className="mt-1 text-sm text-blue-700">
              All OTC medications require documented parental consent before administration. Ensure consent forms are on file.
            </p>
          </div>
        </div>
      </div>

      <Suspense fallback={<MedicationsLoadingSkeleton />}>
        <MedicationsList
          medications={medications}
          total={total}
          filterType="over_the_counter"
          showConsentStatus
        />
      </Suspense>
    </div>
  );
}

function MedicationsLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-24 rounded border border-gray-200 bg-white"></div>
      ))}
    </div>
  );
}
