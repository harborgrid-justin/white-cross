/**
 * @fileoverview Administration Schedule Page
 * @module app/(dashboard)/medications/administration-schedule
 *
 * Daily medication administration schedule with time-based grouping and student roster.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import AdministrationSchedule from '@/components/medications/AdministrationSchedule';
import { PageHeader } from '@/components/shared/PageHeader';
import { fetchWithAuth } from '@/lib/server/fetch';
import { API_ENDPOINTS } from '@/constants/api';

export const metadata: Metadata = {
  title: 'Administration Schedule | White Cross',
  description: 'Daily medication administration schedule for all students'
};

// Force dynamic rendering due to auth requirements
export const dynamic = 'force-dynamic';

interface SchedulePageProps {
  searchParams: {
    date?: string;
    studentId?: string;
  };
}

/**
 * Fetch scheduled medications
 */
async function getScheduledMedications(searchParams: any) {
  const params = new URLSearchParams({
    date: searchParams.date || new Date().toISOString().split('T')[0],
    ...(searchParams.studentId && { studentId: searchParams.studentId })
  });

  try {
    const response = await fetchWithAuth(
      `${API_ENDPOINTS.MEDICATIONS.BASE}/schedule?${params}`,
      { next: { revalidate: 300 } } // 5 min cache
    );

    if (!response.ok) {
      throw new Error('Failed to fetch schedule');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return { scheduled: [], byTimeSlot: {} };
  }
}

/**
 * Administration Schedule Page
 *
 * Server Component displaying daily medication schedule organized by time slots.
 * Critical for daily nurse operations.
 */
export default async function AdministrationSchedulePage({ searchParams }: SchedulePageProps) {
  const schedule = await getScheduledMedications(searchParams);
  const selectedDate = searchParams.date || new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medication Administration Schedule"
        description="Daily schedule for all medication administrations"
        backLink="/medications"
        backLabel="Back to Medications"
      />

      <Suspense fallback={<ScheduleLoadingSkeleton />}>
        <AdministrationSchedule
          schedule={schedule}
          selectedDate={selectedDate}
        />
      </Suspense>
    </div>
  );
}

function ScheduleLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-12 w-full rounded bg-gray-100"></div>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="h-6 w-40 rounded bg-gray-200"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="h-20 w-full rounded border border-gray-200 bg-white"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
