/**
 * @fileoverview Refills Report Page
 * @module app/(dashboard)/medications/reports/refills
 *
 * Track prescription refill needs, pending requests, and authorization status.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import RefillsReport from '@/components/medications/reports/RefillsReport';
import { PageHeader } from '@/components/shared/PageHeader';
import { getRefillReports } from '@/lib/actions/medications';

export const metadata: Metadata = {
  title: 'Refills Report | White Cross',
  description: 'Track prescription refills and authorization status'
};



/**
 * Refills Report Page
 */
export default async function RefillsReportPage() {
  const reportData = await getRefillReports();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Prescription Refills Report"
        description="Track refill needs and pending authorization requests"
        backLink="/medications/reports"
        backLabel="Back to Reports"
      />

      {/* Needed Soon Alert */}
      {reportData.neededSoon && reportData.neededSoon.length > 0 && (
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                {reportData.neededSoon.length} prescription{reportData.neededSoon.length !== 1 ? 's' : ''} need{reportData.neededSoon.length === 1 ? 's' : ''} refill soon
              </h3>
              <p className="mt-1 text-sm text-yellow-700">
                Request refills proactively to avoid gaps in medication availability.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* No Refills Remaining Alert */}
      {reportData.noRefillsRemaining && reportData.noRefillsRemaining.length > 0 && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {reportData.noRefillsRemaining.length} prescription{reportData.noRefillsRemaining.length !== 1 ? 's' : ''} out of refills
              </h3>
              <p className="mt-1 text-sm text-red-700">
                Contact prescribers to obtain new prescriptions for these medications.
              </p>
            </div>
          </div>
        </div>
      )}

      <Suspense fallback={<RefillsLoadingSkeleton />}>
        <RefillsReport data={reportData} />
      </Suspense>
    </div>
  );
}

function RefillsLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 rounded-lg border border-gray-200 bg-white"></div>
        ))}
      </div>
      <div className="space-y-3">
        <div className="h-10 w-full rounded bg-gray-100"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 rounded border border-gray-200 bg-white"></div>
        ))}
      </div>
    </div>
  );
}
