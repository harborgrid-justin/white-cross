/**
 * @fileoverview PRN (As-Needed) Medications Page
 * @module app/(dashboard)/medications/as-needed
 *
 * Manage PRN medications with symptom-based administration triggers.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { Link } from 'next/link';
import PRNMedicationsList from '@/components/medications/PRNMedicationsList';
import { PageHeader } from '@/components/shared/PageHeader';
import { fetchWithAuth } from '@/lib/server/fetch';
import { API_ENDPOINTS } from '@/constants/api';

export const metadata: Metadata = {
  title: 'PRN Medications | White Cross',
  description: 'As-needed medications with symptom-based triggers'
};

/**
 * Fetch PRN medications
 */
async function getPRNMedications() {
  try {
    const response = await fetchWithAuth(
      `${API_ENDPOINTS.MEDICATIONS.BASE}?type=as_needed`,
      { next: { tags: ['medications-prn'], revalidate: 300 } }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch PRN medications');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching PRN medications:', error);
    return { medications: [], total: 0, stats: {} };
  }
}

/**
 * PRN Medications Page
 */
export default async function PRNMedicationsPage() {
  const { medications, total, stats } = await getPRNMedications();

  return (
    <div className="space-y-6">
      <PageHeader
        title="PRN (As-Needed) Medications"
        description="Medications administered based on symptoms or specific triggers"
        backLink="/medications"
        backLabel="Back to Medications"
      >
        <Link
          href="/medications/new?type=as_needed"
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          Add PRN Medication
        </Link>
      </PageHeader>

      <div className="rounded-md bg-blue-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">PRN Administration Guidelines</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc space-y-1 pl-5">
                <li>Document specific symptoms/triggers before administration</li>
                <li>Record student-reported pain/discomfort levels</li>
                <li>Note time since last dose for maximum frequency compliance</li>
                <li>Track effectiveness after administration</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={<PRNLoadingSkeleton />}>
        <PRNMedicationsList
          medications={medications}
          total={total}
          stats={stats}
        />
      </Suspense>
    </div>
  );
}

function PRNLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-20 rounded-lg border border-gray-200 bg-white"></div>
        ))}
      </div>
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-28 rounded border border-gray-200 bg-white"></div>
        ))}
      </div>
    </div>
  );
}
