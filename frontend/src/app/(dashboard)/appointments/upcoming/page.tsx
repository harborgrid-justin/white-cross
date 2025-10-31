/**
 * @fileoverview Upcoming Appointments Page
 * @module app/appointments/upcoming
 *
 * Forward-looking view of all scheduled appointments over the next 30 days, organized
 * by date for easy planning and preparation. Enables school nurses to anticipate
 * upcoming workload, send reminders, and prepare necessary materials.
 *
 * **Key Features:**
 * - **30-Day Forecast**: Shows all scheduled/confirmed appointments for next month
 * - **Date-Based Grouping**: Organizes appointments by calendar date for clear planning
 * - **Smart Date Labels**: "Today", "Tomorrow", then full date labels
 * - **Weekly Statistics**: Breakdown by time periods (this week, next week, later)
 * - **Bulk Actions**: Send reminders, export, prepare materials for multiple appointments
 *
 * **Date Range Algorithm:**
 * Calculates a 30-day rolling window from current date:
 * ```javascript
 * const today = new Date();
 * const endDate = new Date();
 * endDate.setDate(today.getDate() + 30);  // Adds 30 days to today
 * ```
 *
 * **Grouping Algorithm:**
 * Uses JavaScript reduce() to partition appointments by date:
 * ```javascript
 * grouped = appointments.reduce((acc, apt) => {
 *   if (!acc[apt.scheduledDate]) acc[apt.scheduledDate] = [];
 *   acc[apt.scheduledDate].push(apt);
 *   return acc;
 * }, {});
 * ```
 *
 * Time Complexity: O(n) where n = number of appointments
 * Space Complexity: O(n) for grouped data structure
 *
 * **Status Filtering:**
 * Only shows appointments in active states:
 * - `scheduled`: Initial state, not yet confirmed
 * - `confirmed`: Student/parent confirmed attendance
 * - Excludes: completed, cancelled, no-show (past states)
 *
 * **Healthcare Use Cases:**
 * - Review week's upcoming appointments each Monday
 * - Prepare medication doses for scheduled administrations
 * - Send appointment reminders to parents 24 hours in advance
 * - Identify scheduling conflicts before they occur
 * - Plan for days with high appointment volume
 *
 * **Statistics Breakdown:**
 * - **This Week**: Appointments within next 7 days (immediate planning)
 * - **Next Week**: Appointments in days 8-14 (short-term planning)
 * - **Later**: Appointments beyond 14 days (long-term planning)
 *
 * @see {@link AppointmentCard} for individual appointment display
 * @see {@link getAppointmentsAction} for filtered appointment fetching
 *
 * @example
 * ```tsx
 * // Typical usage flow:
 * // 1. Nurse navigates to /appointments/upcoming
 * // 2. Server calculates date range: today to today+30 days
 * // 3. Fetches scheduled/confirmed appointments in range
 * // 4. Groups by date: { '2025-10-27': [apt1, apt2], '2025-10-28': [apt3] }
 * // 5. Sorts dates chronologically
 * // 6. Renders date sections with "Today"/"Tomorrow" labels
 * ```
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getAppointmentsAction } from '@/actions/appointments.actions';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { AppointmentCard } from '@/components/appointments/AppointmentCard';

/**
 * Next.js Metadata Configuration
 */
export const metadata: Metadata = {
  title: 'Upcoming Appointments | White Cross',
  description: 'View all upcoming scheduled appointments',
};

/**
 * Force dynamic rendering for current-date-based view
 *
 * Must be dynamic because date range is calculated from "today".
 */
export const dynamic = 'force-dynamic';

/**
 * Grouped Appointments Type Definition
 *
 * Maps dates (YYYY-MM-DD format) to arrays of appointments scheduled on that date.
 * Enables efficient date-based rendering without repeated filtering.
 *
 * @example
 * ```tsx
 * const grouped: GroupedAppointments = {
 *   '2025-10-27': [appointment1, appointment2],
 *   '2025-10-28': [appointment3],
 *   '2025-10-30': [appointment4, appointment5, appointment6]
 * };
 * ```
 */
interface GroupedAppointments {
  [date: string]: any[];
}

/**
 * Upcoming Appointments Page Component
 *
 * Server component that fetches and displays all scheduled/confirmed appointments
 * for the next 30 days, grouped by date for planning purposes.
 *
 * **Server Component Benefits:**
 * - Calculates date range server-side (consistent timezone handling)
 * - Groups appointments before rendering (reduced client processing)
 * - Delivers pre-rendered HTML with appointment data
 * - No loading state on initial render
 *
 * **Date Range Calculation:**
 * Uses 30-day rolling window from current server date:
 * - Start: Today's date (inclusive)
 * - End: 30 days from today (inclusive)
 * - Automatically adjusts for month boundaries and leap years
 *
 * **Grouping Strategy:**
 * Partitions appointments into date buckets for organized display:
 * 1. Create empty object to store date groups
 * 2. Iterate through appointments array
 * 3. For each appointment, use scheduledDate as key
 * 4. Add appointment to array for that date key
 * 5. Sort date keys chronologically for rendering
 *
 * **Statistics Calculation:**
 * Divides appointments into time-based categories:
 * - This Week: `aptDate <= today + 7 days`
 * - Next Week: `today + 7 days < aptDate <= today + 14 days`
 * - Later: `aptDate > today + 14 days`
 *
 * @returns {Promise<JSX.Element>} Rendered upcoming appointments page
 *
 * @example
 * ```tsx
 * // Example rendering flow:
 * // Today: Oct 27, 2025
 * // Appointments:
 * //   - Oct 27 (Today): 2 appointments
 * //   - Oct 28 (Tomorrow): 1 appointment
 * //   - Oct 30: 3 appointments
 * //   - Nov 5: 2 appointments
 *
 * // Rendered sections:
 * // "Today - Monday, October 27, 2025" (2 appointments)
 * // "Tomorrow - Tuesday, October 28, 2025" (1 appointment)
 * // "Thursday, October 30, 2025" (3 appointments)
 * // "Wednesday, November 5, 2025" (2 appointments)
 * ```
 */
export default async function UpcomingPage() {
  // Authentication check - redirect unauthenticated users
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  /**
   * Calculate 30-day date range
   *
   * Creates a rolling 30-day window from today's date.
   * Uses server's current date to ensure consistent behavior across timezones.
   */
  const today = new Date();
  const endDate = new Date();
  endDate.setDate(today.getDate() + 30);  // Add 30 days to today

  const startDateStr = today.toISOString().split('T')[0];
  const endDateStr = endDate.toISOString().split('T')[0];

  /**
   * Fetch upcoming appointments
   *
   * Query parameters:
   * - startDate/endDate: 30-day range from today
   * - status: 'scheduled,confirmed' (only active appointments)
   * - sortBy: 'scheduledDate' (chronological order)
   * - order: 'asc' (earliest first)
   */
  const result = await getAppointmentsAction({
    startDate: startDateStr,
    endDate: endDateStr,
    status: 'scheduled,confirmed',
    sortBy: 'scheduledDate',
    order: 'asc',
  });

  const appointments = result.success ? result.data?.appointments || [] : [];

  /**
   * Group appointments by date using reduce
   *
   * Partitions appointments into date-keyed buckets for organized rendering.
   * Algorithm: O(n) time, O(n) space where n = number of appointments.
   */
  const grouped: GroupedAppointments = appointments.reduce((acc, appointment) => {
    const date = appointment.scheduledDate;
    if (!acc[date]) {
      acc[date] = [];  // Initialize array for new date
    }
    acc[date].push(appointment);  // Add appointment to date bucket
    return acc;
  }, {} as GroupedAppointments);

  /**
   * Sort dates chronologically for rendering
   *
   * Object.keys() returns unsorted keys; Array.sort() ensures chronological order.
   * ISO format (YYYY-MM-DD) sorts correctly lexicographically.
   */
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
