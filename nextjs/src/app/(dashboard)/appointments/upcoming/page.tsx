/**
 * @fileoverview Upcoming Appointments Page
 * @module app/appointments/upcoming
 *
 * View all future appointments with bulk operations.
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
  title: 'Upcoming Appointments | White Cross',
  description: 'View all upcoming scheduled appointments',
};

interface GroupedAppointments {
  [date: string]: any[];
}

export default async function UpcomingPage() {
  // Authentication check
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  // Get date range (today + 30 days)
  const today = new Date();
  const endDate = new Date();
  endDate.setDate(today.getDate() + 30);

  const startDateStr = today.toISOString().split('T')[0];
  const endDateStr = endDate.toISOString().split('T')[0];

  // Fetch upcoming appointments
  const result = await getAppointmentsAction({
    startDate: startDateStr,
    endDate: endDateStr,
    status: 'scheduled,confirmed',
    sortBy: 'scheduledDate',
    order: 'asc',
  });

  const appointments = result.success ? result.data?.appointments || [] : [];

  // Group appointments by date
  const grouped: GroupedAppointments = appointments.reduce((acc, appointment) => {
    const date = appointment.scheduledDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(appointment);
    return acc;
  }, {} as GroupedAppointments);

  const dates = Object.keys(grouped).sort();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Upcoming Appointments
          </h1>
          <p className="mt-2 text-gray-600">Next 30 days</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/appointments/new">Schedule New</Link>
          </Button>
          <Button variant="outline">Send Reminders</Button>
          <Button variant="outline">Export</Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Total Upcoming</div>
          <div className="text-2xl font-bold text-gray-900">
            {appointments.length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">This Week</div>
          <div className="text-2xl font-bold text-blue-600">
            {
              appointments.filter((a) => {
                const aptDate = new Date(a.scheduledDate);
                const weekEnd = new Date();
                weekEnd.setDate(today.getDate() + 7);
                return aptDate <= weekEnd;
              }).length
            }
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Next Week</div>
          <div className="text-2xl font-bold text-green-600">
            {
              appointments.filter((a) => {
                const aptDate = new Date(a.scheduledDate);
                const weekStart = new Date();
                weekStart.setDate(today.getDate() + 7);
                const weekEnd = new Date();
                weekEnd.setDate(today.getDate() + 14);
                return aptDate >= weekStart && aptDate <= weekEnd;
              }).length
            }
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Later</div>
          <div className="text-2xl font-bold text-purple-600">
            {
              appointments.filter((a) => {
                const aptDate = new Date(a.scheduledDate);
                const twoWeeks = new Date();
                twoWeeks.setDate(today.getDate() + 14);
                return aptDate > twoWeeks;
              }).length
            }
          </div>
        </div>
      </div>

      {/* Appointments Grouped by Date */}
      <div className="space-y-6">
        {dates.length > 0 ? (
          dates.map((date) => {
            const dateObj = new Date(date + 'T00:00:00');
            const isToday = date === today.toISOString().split('T')[0];
            const isTomorrow =
              date ===
              new Date(today.getTime() + 86400000).toISOString().split('T')[0];

            let dateLabel = dateObj.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });

            if (isToday) dateLabel = `Today - ${dateLabel}`;
            if (isTomorrow) dateLabel = `Tomorrow - ${dateLabel}`;

            return (
              <div key={date}>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {dateLabel}
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    ({grouped[date].length} {grouped[date].length === 1 ? 'appointment' : 'appointments'})
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {grouped[date].map((appointment) => (
                    <Suspense
                      key={appointment.id}
                      fallback={
                        <div className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>
                      }
                    >
                      <AppointmentCard appointment={appointment} />
                    </Suspense>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
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
              No upcoming appointments
            </h3>
            <p className="text-gray-600 mb-6">
              Schedule appointments for the next 30 days.
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
