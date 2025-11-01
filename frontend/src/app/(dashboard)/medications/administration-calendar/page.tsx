'use client';

/**
 * @fileoverview Administration Calendar Page
 * @module app/(dashboard)/medications/administration-calendar
 *
 * Calendar view of medication administrations with filtering and navigation.
 * Force dynamic rendering for medication calendar - schedule changes frequently
 */



import { useState, useEffect } from 'react';
import MedicationCalendar from '@/components/medications/MedicationCalendar';
import { PageHeader } from '@/components/shared/PageHeader';
import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/constants/api';

/**
 * Administration Calendar Page
 *
 * Client Component displaying interactive calendar view of medications.
 */
export default function AdministrationCalendarPage() {
  const [calendarData, setCalendarData] = useState<any>({ events: [], stats: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setLoading(true);
        const now = new Date();
        const params = {
          month: now.getMonth() + 1,
          year: now.getFullYear(),
        };

        const response = await apiClient.get<any>(
          `${API_ENDPOINTS.MEDICATIONS.BASE}/calendar`,
          params
        );

        console.log('[CalendarPage] API response:', response);

        // Handle response structure
        if (response.data) {
          setCalendarData({ events: response.data || [], stats: response.meta || {} });
        } else {
          setCalendarData({ events: response.events || [], stats: response.stats || {} });
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching calendar:', err);
        setError(err instanceof Error ? err.message : 'Failed to load calendar');
        setCalendarData({ events: [], stats: {} });
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medication Calendar"
        description="Monthly view of medication administrations and schedules"
        backLink="/medications"
        backLabel="Back to Medications"
      />

      {loading ? (
        <CalendarLoadingSkeleton />
      ) : error ? (
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </div>
      ) : (
        <MedicationCalendar
          medications={calendarData.events}
          stats={calendarData.stats}
        />
      )}
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
