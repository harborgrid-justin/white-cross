/**
 * @fileoverview Missed Doses Page
 * @module app/(dashboard)/medications/administration-missed
 *
 * Tracking and documentation of missed medication doses with reasons and follow-up.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import MissedDosesList from '@/components/medications/MissedDosesList';
import { PageHeader } from '@/components/shared/PageHeader';
import { getMissedDoses } from '@/lib/actions/medications';

export const metadata: Metadata = {
  title: 'Missed Doses | White Cross',
  description: 'Documented missed medication doses requiring follow-up'
};



interface MissedDosesPageProps {
  searchParams: {
    startDate?: string;
    endDate?: string;
    studentId?: string;
    page?: string;
  };
}

/**
 * Missed Doses Page
 *
 * Server Component for tracking missed medication doses with documentation.
 * Critical for compliance and patient safety monitoring.
 */
export default async function MissedDosesPage({ searchParams }: MissedDosesPageProps) {
  const { missedDoses, stats, total } = await getMissedDoses(searchParams);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Missed Medication Doses"
        description="Documented missed doses requiring review and follow-up"
        backLink="/medications"
        backLabel="Back to Medications"
      />

      {/* Alert if missed doses exist */}
      {total > 0 && (
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                {total} missed dose{total !== 1 ? 's' : ''} documented
              </h3>
              <p className="mt-1 text-sm text-yellow-700">
                Review missed doses and ensure parent notifications and follow-up actions are completed.
              </p>
            </div>
          </div>
        </div>
      )}

      <Suspense fallback={<MissedDosesLoadingSkeleton />}>
        <MissedDosesList
          missedDoses={missedDoses}
          stats={stats}
          total={total}
        />
      </Suspense>
    </div>
  );
}

function MissedDosesLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 rounded-lg border border-gray-200 bg-white"></div>
        ))}
      </div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-28 rounded border border-yellow-200 bg-white"></div>
        ))}
      </div>
    </div>
  );
}
