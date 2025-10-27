/**
 * @fileoverview Administration Calendar Page
 * @module app/(dashboard)/medications/administration-calendar
 *
 * Calendar view of medication administrations with filtering and navigation.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import MedicationCalendar from '@/components/medications/MedicationCalendar';
import { PageHeader } from '@/components/shared/PageHeader';
import { fetchWithAuth } from '@/lib/server/fetch';
import { API_ENDPOINTS } from '@/constants/api';

export const metadata: Metadata = {
  title: 'Administration Calendar | White Cross',
  description: 'Calendar view of medication administrations and schedules'
};

// Force dynamic rendering due to auth requirements
export const dynamic = 'force-dynamic';

interface CalendarPageProps {
  searchParams: {
    month?: string;
    year?: string;
    studentId?: string;
  };
}

/**
 * Fetch calendar data
 */
async function getCalendarData(searchParams: any) {
  const now = new Date();
  const params = new URLSearchParams({
    month: searchParams.month || String(now.getMonth() + 1),
    year: searchParams.year || String(now.getFullYear()),
    ...(searchParams.studentId && { studentId: searchParams.studentId })
  });

  try {
    const response = await fetchWithAuth(
      `${API_ENDPOINTS.MEDICATIONS.BASE}/calendar?${params}`,
      { next: { revalidate: 600 } } // 10 min cache
    );

    if (!response.ok) {
      throw new Error('Failed to fetch calendar data');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching calendar:', error);
    return { events: [], stats: {} };
  }
}

/**
 * Administration Calendar Page
 *
 * Server Component displaying interactive calendar view of medications.
 */
export default async function AdministrationCalendarPage({ searchParams }: CalendarPageProps) {
  const calendarData = await getCalendarData(searchParams);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medication Calendar"
        description="Monthly view of medication administrations and schedules"
        backLink="/medications"
        backLabel="Back to Medications"
      />

      <Suspense fallback={<CalendarLoadingSkeleton />}>
        <MedicationCalendar
          events={calendarData.events}
          stats={calendarData.stats}
          initialMonth={searchParams.month}
          initialYear={searchParams.year}
        />
      </Suspense>
    </div>
  );
}

function CalendarLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="flex justify-between">
        <div className="h-10 w-48 rounded bg-gray-200"></div>
        <div className="flex space-x-2">
          <div className="h-10 w-10 rounded bg-gray-200"></div>
          <div className="h-10 w-10 rounded bg-gray-200"></div>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {[...Array(35)].map((_, i) => (
          <div key={i} className="h-24 rounded border border-gray-200 bg-white p-2">
            <div className="h-4 w-6 rounded bg-gray-100"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
