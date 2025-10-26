/**
 * @fileoverview Expiration Report Page
 * @module app/(dashboard)/medications/reports/expiration
 *
 * Report on medications expiring soon or already expired with replacement tracking.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import ExpirationReport from '@/components/medications/reports/ExpirationReport';
import { PageHeader } from '@/components/shared/PageHeader';
import { fetchWithAuth } from '@/lib/server/fetch';
import { API_ENDPOINTS } from '@/constants/api';

export const metadata: Metadata = {
  title: 'Expiration Report | White Cross',
  description: 'Track medication expiration dates and replacement needs'
};

interface ExpirationReportPageProps {
  searchParams: {
    days?: string; // Look ahead period
  };
}

/**
 * Fetch expiration report data
 */
async function getExpirationReportData(searchParams: any) {
  const params = new URLSearchParams({
    days: searchParams.days || '90' // Default 90-day look ahead
  });

  try {
    const response = await fetchWithAuth(
      `${API_ENDPOINTS.MEDICATIONS.BASE}/reports/expiration?${params}`,
      { next: { revalidate: 3600 } } // 1 hour cache
    );

    if (!response.ok) {
      throw new Error('Failed to fetch expiration report');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching expiration report:', error);
    return { expired: [], expiringSoon: [], byMonth: {}, stats: {} };
  }
}

/**
 * Expiration Report Page
 */
export default async function ExpirationReportPage({ searchParams }: ExpirationReportPageProps) {
  const reportData = await getExpirationReportData(searchParams);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medication Expiration Report"
        description="Track expiring medications and plan replacements"
        backLink="/medications/reports"
        backLabel="Back to Reports"
      />

      {/* Expired Medications Alert */}
      {reportData.expired && reportData.expired.length > 0 && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {reportData.expired.length} expired medication{reportData.expired.length !== 1 ? 's' : ''}
              </h3>
              <p className="mt-1 text-sm text-red-700">
                Remove expired medications immediately and replace with fresh stock. Do not administer expired medications.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Expiring Soon Warning */}
      {reportData.expiringSoon && reportData.expiringSoon.length > 0 && (
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                {reportData.expiringSoon.length} medication{reportData.expiringSoon.length !== 1 ? 's' : ''} expiring soon
              </h3>
              <p className="mt-1 text-sm text-yellow-700">
                Plan replacement orders to maintain continuous medication availability.
              </p>
            </div>
          </div>
        </div>
      )}

      <Suspense fallback={<ExpirationLoadingSkeleton />}>
        <ExpirationReport data={reportData} filters={searchParams} />
      </Suspense>
    </div>
  );
}

function ExpirationLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 rounded-lg border border-gray-200 bg-white"></div>
        ))}
      </div>
      <div className="h-80 rounded-lg border border-gray-200 bg-white"></div>
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-20 rounded border border-gray-200 bg-white"></div>
        ))}
      </div>
    </div>
  );
}
