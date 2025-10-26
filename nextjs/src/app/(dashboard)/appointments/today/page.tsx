/**
 * @fileoverview Today's Appointments Page
 * @module app/appointments/today
 *
 * Quick view of today's appointments with status update capabilities.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getAppointmentsAction } from '@/actions/appointments.actions';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { AppointmentCard } from '@/components/appointments/AppointmentCard';

export const metadata: Metadata = {
  title: "Today's Appointments | White Cross",
  description: "View and manage today's scheduled appointments",
};

/**
 * Today's Appointments Page
 *
 * Shows all appointments for today in chronological order
 */
export default async function TodayPage() {
  // Authentication check
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  // Get today's date
  const today = new Date().toISOString().split('T')[0];

  // Fetch today's appointments
  const result = await getAppointmentsAction({
    startDate: today,
    endDate: today,
    sortBy: 'scheduledTime',
    order: 'asc',
  });

  const appointments = result.success ? result.data?.appointments || [] : [];

  // Group by status
  const upcoming = appointments.filter((a) =>
    ['scheduled', 'confirmed'].includes(a.status)
  );
  const inProgress = appointments.filter((a) => a.status === 'in-progress');
  const completed = appointments.filter((a) => a.status === 'completed');
  const noShow = appointments.filter((a) => a.status === 'no-show');
  const cancelled = appointments.filter((a) => a.status === 'cancelled');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Today's Appointments</h1>
          <p className="mt-2 text-gray-600">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/appointments/new">Schedule New</Link>
          </Button>
          <Button variant="outline">Refresh</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Total Today</div>
          <div className="text-2xl font-bold text-gray-900">
            {appointments.length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Upcoming</div>
          <div className="text-2xl font-bold text-blue-600">{upcoming.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">In Progress</div>
          <div className="text-2xl font-bold text-yellow-600">
            {inProgress.length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Completed</div>
          <div className="text-2xl font-bold text-green-600">{completed.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">No Shows</div>
          <div className="text-2xl font-bold text-orange-600">{noShow.length}</div>
        </div>
      </div>

      {/* Appointments by Status */}
      <div className="space-y-6">
        {/* In Progress */}
        {inProgress.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              In Progress ({inProgress.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inProgress.map((appointment) => (
                <Suspense
                  key={appointment.id}
                  fallback={<div className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>}
                >
                  <AppointmentCard appointment={appointment} />
                </Suspense>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Upcoming ({upcoming.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcoming.map((appointment) => (
                <Suspense
                  key={appointment.id}
                  fallback={<div className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>}
                >
                  <AppointmentCard appointment={appointment} />
                </Suspense>
              ))}
            </div>
          </div>
        )}

        {/* Completed */}
        {completed.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Completed ({completed.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completed.map((appointment) => (
                <Suspense
                  key={appointment.id}
                  fallback={<div className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>}
                >
                  <AppointmentCard appointment={appointment} />
                </Suspense>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {appointments.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No appointments scheduled for today
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by scheduling a new appointment.
            </p>
            <Button asChild>
              <Link href="/appointments/new">Schedule Appointment</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
