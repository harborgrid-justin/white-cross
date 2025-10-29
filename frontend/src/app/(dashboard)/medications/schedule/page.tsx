/**
 * @fileoverview Medication Schedule Overview Page
 * @module app/(dashboard)/medications/schedule/page
 *
 * Complete medication schedule overview with upcoming administrations.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/PageHeader';
import { fetchWithAuth } from '@/lib/server/fetch';
import { API_ENDPOINTS } from '@/constants/api';
import MedicationSchedule from '@/components/medications/administration/MedicationSchedule';
import { Button } from '@/components/ui/Button';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Medication Schedule',
  description: 'Comprehensive medication schedule and upcoming administrations'
};

// Force dynamic rendering due to auth requirements
export const dynamic = 'force-dynamic';

interface SchedulePageProps {
  searchParams: {
    view?: 'day' | 'week' | 'month';
    date?: string;
    studentId?: string;
  };
}

/**
 * Fetch schedule data
 */
async function getScheduleData(searchParams: any) {
  const params = new URLSearchParams();

  if (searchParams.view) params.set('view', searchParams.view);
  if (searchParams.date) params.set('date', searchParams.date);
  if (searchParams.studentId) params.set('studentId', searchParams.studentId);

  try {
    const response = await fetchWithAuth(
      `${API_ENDPOINTS.MEDICATIONS.SCHEDULE}?${params}`,
      { next: { revalidate: 60 } } // 1 min cache
    );

    if (!response.ok) {
      throw new Error('Failed to fetch schedule');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return {
      events: [],
      upcoming: [],
      stats: {}
    };
  }
}

/**
 * Fetch upcoming administrations
 */
async function getUpcomingAdministrations() {
  try {
    const response = await fetchWithAuth(
      `${API_ENDPOINTS.MEDICATIONS.DUE}?limit=10`,
      { next: { revalidate: 30 } } // 30 sec cache
    );

    if (!response.ok) {
      throw new Error('Failed to fetch upcoming');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching upcoming:', error);
    return { data: [] };
  }
}

/**
 * Medication Schedule Page
 *
 * Displays comprehensive schedule with calendar view.
 */
export default async function MedicationSchedulePage({
  searchParams
}: SchedulePageProps) {
  const [schedule, upcoming] = await Promise.all([
    getScheduleData(searchParams),
    getUpcomingAdministrations()
  ]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Medication Schedule"
        description="View and manage medication administration schedules"
        action={
          <div className="flex gap-2">
            <Link href="/medications/administration-calendar">
              <Button
                variant="secondary"
                icon={<CalendarIcon className="h-5 w-5" />}
              >
                Calendar View
              </Button>
            </Link>
            <Link href="/medications/administration-due">
              <Button variant="primary" icon={<ClockIcon className="h-5 w-5" />}>
                Due Now
              </Button>
            </Link>
          </div>
        }
      />

      {/* Schedule Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard
          label="Total Scheduled"
          value={schedule.stats.total || 0}
          color="blue"
        />
        <StatCard
          label="Due Today"
          value={schedule.stats.dueToday || 0}
          color="yellow"
        />
        <StatCard
          label="Upcoming (7 days)"
          value={schedule.stats.upcoming || 0}
          color="green"
        />
        <StatCard
          label="Overdue"
          value={schedule.stats.overdue || 0}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Schedule - Calendar View */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Schedule Overview
            </h2>
            <Suspense fallback={<ScheduleSkeleton />}>
              <MedicationSchedule
                events={schedule.events}
                view={searchParams.view || 'week'}
                initialDate={searchParams.date}
              />
            </Suspense>
          </div>
        </div>

        {/* Sidebar - Upcoming Administrations */}
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 font-semibold text-gray-900">
              Upcoming Administrations
            </h3>
            <div className="space-y-3">
              {upcoming.data.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No upcoming administrations
                </p>
              ) : (
                upcoming.data.map((admin: any) => (
                  <div
                    key={admin.id}
                    className="flex items-start justify-between border-b border-gray-100 pb-3 last:border-0"
                  >
                    <div className="flex-1">
                      <Link
                        href={`/medications/${admin.medicationId}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        {admin.medicationName}
                      </Link>
                      <p className="mt-1 text-xs text-gray-500">
                        {admin.studentName}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {new Date(admin.scheduledTime).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        admin.priority === 'high'
                          ? 'bg-red-100 text-red-800'
                          : admin.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {admin.priority}
                    </span>
                  </div>
                ))
              )}
            </div>
            {upcoming.data.length > 0 && (
              <Link
                href="/medications/administration-due"
                className="mt-4 block text-center text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View All Due →
              </Link>
            )}
          </div>

          {/* Quick Filters */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 font-semibold text-gray-900">Quick Filters</h3>
            <div className="space-y-2">
              <Link
                href="/medications/schedule?view=day"
                className="block rounded-md bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Today's Schedule
              </Link>
              <Link
                href="/medications/schedule?view=week"
                className="block rounded-md bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                This Week
              </Link>
              <Link
                href="/medications/schedule?view=month"
                className="block rounded-md bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                This Month
              </Link>
              <Link
                href="/medications/administration-rules"
                className="block rounded-md bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Administration Rules
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Stat Card Component
 */
function StatCard({
  label,
  value,
  color
}: {
  label: string;
  value: number;
  color: 'blue' | 'green' | 'yellow' | 'red';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    red: 'bg-red-50 text-red-700'
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`rounded-full p-3 ${colorClasses[color]}`}>
          <CalendarIcon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

/**
 * Schedule Loading Skeleton
 */
function ScheduleSkeleton() {
  return (
    <div className="h-96 animate-pulse rounded bg-gray-100"></div>
  );
}
