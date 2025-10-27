/**
 * @fileoverview Appointments Calendar View Page
 * @module app/appointments/calendar
 *
 * Full calendar view with month/week/day modes, drag-and-drop rescheduling,
 * and conflict detection.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { AppointmentCalendar } from '@/components/appointments/AppointmentCalendar';
import { getAppointmentsAction } from '@/actions/appointments.actions';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Calendar View | Appointments',
  description: 'Interactive calendar view of all appointments',
};

/**
 * ISR Configuration - Cache appointments for 1 minute (60 seconds)
 * Appointments change more frequently than medications, so we use a shorter cache
 * to balance performance with data freshness.
 */
export const revalidate = 60; // Revalidate every 1 minute

/**
 * Appointments Calendar View Page
 *
 * Server Component that fetches appointments and renders calendar
 */
export default async function CalendarPage({
  searchParams,
}: {
  searchParams: {
    view?: 'month' | 'week' | 'day' | 'list';
    date?: string;
    nurse?: string;
    student?: string;
    status?: string;
  };
}) {
  // Authentication check
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  // Parse search params
  const view = searchParams.view || 'month';
  const initialDate = searchParams.date || new Date().toISOString().split('T')[0];
  const nurseId = searchParams.nurse;
  const studentId = searchParams.student;
  const status = searchParams.status;

  // Calculate date range based on view
  const date = new Date(initialDate);
  let startDate: string;
  let endDate: string;

  switch (view) {
    case 'day':
      startDate = initialDate;
      endDate = initialDate;
      break;
    case 'week':
      // Get start of week (Sunday)
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      startDate = weekStart.toISOString().split('T')[0];
      endDate = weekEnd.toISOString().split('T')[0];
      break;
    case 'month':
    case 'list':
    default:
      // Get start and end of month
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      startDate = monthStart.toISOString().split('T')[0];
      endDate = monthEnd.toISOString().split('T')[0];
      break;
  }

  // Fetch appointments for date range
  const result = await getAppointmentsAction({
    startDate,
    endDate,
    nurseId,
    studentId,
    status: status as any,
  });

  const appointments = result.success ? result.data?.appointments || [] : [];
  const total = result.success ? result.data?.total || 0 : 0;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Appointments Calendar</h1>
        <p className="mt-2 text-gray-600">
          Interactive calendar view with drag-and-drop scheduling
        </p>
      </div>

      {/* Statistics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Total Appointments</div>
          <div className="text-2xl font-bold text-gray-900">{total}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Scheduled</div>
          <div className="text-2xl font-bold text-blue-600">
            {appointments.filter((a) => a.status === 'scheduled').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Confirmed</div>
          <div className="text-2xl font-bold text-green-600">
            {appointments.filter((a) => a.status === 'confirmed').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">In Progress</div>
          <div className="text-2xl font-bold text-yellow-600">
            {appointments.filter((a) => a.status === 'in-progress').length}
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="flex-1 bg-white rounded-lg shadow p-6">
        <Suspense
          fallback={
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          }
        >
          <AppointmentCalendar
            appointments={appointments}
            initialView={view}
            initialDate={initialDate}
          />
        </Suspense>
      </div>

      {/* Legend */}
      <div className="mt-6 bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Status Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-blue-500 mr-2"></div>
            <span className="text-sm text-gray-700">Scheduled</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-green-500 mr-2"></div>
            <span className="text-sm text-gray-700">Confirmed</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-yellow-500 mr-2"></div>
            <span className="text-sm text-gray-700">In Progress</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-gray-500 mr-2"></div>
            <span className="text-sm text-gray-700">Completed</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-red-500 mr-2"></div>
            <span className="text-sm text-gray-700">Cancelled</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-orange-500 mr-2"></div>
            <span className="text-sm text-gray-700">No Show</span>
          </div>
        </div>
      </div>
    </div>
  );
}
