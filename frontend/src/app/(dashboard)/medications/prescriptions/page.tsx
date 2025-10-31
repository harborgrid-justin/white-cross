/**
 * @fileoverview Prescriptions List Page
 * @module app/(dashboard)/medications/prescriptions
 *
 * Complete list of all prescriptions with filtering and management.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import PrescriptionsList from '@/components/medications/PrescriptionsList';
import { PageHeader } from '@/components/shared/PageHeader';
import { fetchWithAuth } from '@/lib/server/fetch';
import { API_ENDPOINTS } from '@/constants/api';

export const metadata: Metadata = {
  title: 'Prescriptions | White Cross',
  description: 'Manage all medication prescriptions and refills'
};

// Force dynamic rendering due to auth requirements
export const dynamic = 'force-dynamic';

interface PrescriptionsPageProps {
  searchParams: {
    status?: string;
    studentId?: string;
    page?: string;
  };
}

/**
 * Fetch prescriptions
 */
async function getPrescriptions(searchParams: any) {
  const params = new URLSearchParams({
    ...(searchParams.status && { status: searchParams.status }),
    ...(searchParams.studentId && { studentId: searchParams.studentId }),
    page: searchParams.page || '1',
    limit: '25'
  });

  try {
    const response = await fetchWithAuth(
      `${API_ENDPOINTS.MEDICATIONS.BASE}/prescriptions?${params}`,
      { next: { tags: ['prescriptions'], revalidate: 300 } }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch prescriptions');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    return { prescriptions: [], total: 0, stats: {} };
  }
}

/**
 * Prescriptions Page
 *
 * Server Component listing all medication prescriptions.
 */
export default async function PrescriptionsPage({ searchParams }: PrescriptionsPageProps) {
  const { prescriptions, total, stats } = await getPrescriptions(searchParams);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Prescriptions"
        description="Manage medication prescriptions and refill requests"
        backLink="/medications"
        backLabel="Back to Medications"
      >
        <Link
          href="/medications/prescriptions/new"
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          New Prescription
        </Link>
      </PageHeader>

      <Suspense fallback={<PrescriptionsLoadingSkeleton />}>
        <PrescriptionsList
          prescriptions={prescriptions}
          total={total}
          stats={stats}
        />
      </Suspense>
    </div>
  );
}

function PrescriptionsLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 rounded-lg border border-gray-200 bg-white"></div>
        ))}
      </div>
      <div className="space-y-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-28 rounded border border-gray-200 bg-white"></div>
        ))}
      </div>
    </div>
  );
}
