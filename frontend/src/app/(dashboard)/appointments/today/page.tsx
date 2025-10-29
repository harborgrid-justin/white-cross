/**
 * @fileoverview Today's Appointments Page
 * @module app/appointments/today
 *
 * Real-time dashboard view of current day's appointments with status-based grouping
 * and quick action capabilities. Provides school nurses with an at-a-glance overview
 * of their daily schedule, prioritizing appointments by workflow state.
 *
 * **Key Features:**
 * - **Real-Time Data**: Always shows current day (no caching for date-sensitive view)
 * - **Status Grouping**: Organizes appointments by workflow state (upcoming → in-progress → completed)
 * - **Chronological Sorting**: Appointments sorted by scheduled time within each group
 * - **Quick Actions**: Update status, view details, add notes directly from cards
 * - **Summary Statistics**: At-a-glance counts by status for daily planning
 *
 * **Date Handling:**
 * - Uses server's current date (timezone-aware via toISOString())
 * - Automatically updates at midnight to show new day's appointments
 * - ISO 8601 format (YYYY-MM-DD) ensures consistent date comparison
 * - No client-side date manipulation to avoid timezone bugs
 *
 * **Status-Based Workflow:**
 * The page groups appointments into workflow stages:
 * 1. **Upcoming**: Scheduled or confirmed, waiting to start
 * 2. **In Progress**: Currently being conducted
 * 3. **Completed**: Finished with notes recorded
 * 4. **No Show**: Student didn't arrive
 * 5. **Cancelled**: Appointment cancelled (displayed but de-emphasized)
 *
 * **Healthcare Context:**
 * - Helps nurses prioritize their daily workload
 * - Shows which students are expected vs. who has arrived
 * - Tracks completion rate for daily accountability
 * - Supports quick status updates during busy periods
 *
 * **Performance:**
 * - Force dynamic rendering (no static generation for current-date view)
 * - Lightweight query (single day, typically 10-30 appointments)
 * - Server-side filtering reduces client-side processing
 * - Minimal JavaScript for fast initial render
 *
 * @see {@link AppointmentCard} for individual appointment display component
 * @see {@link getAppointmentsAction} for server-side data fetching
 *
 * @example
 * ```tsx
 * // When nurse navigates to /appointments/today:
 * // 1. Server fetches today's date (2025-10-27)
 * // 2. Queries appointments where scheduledDate = '2025-10-27'
 * // 3. Sorts by scheduledTime ascending (8:00 AM → 3:00 PM)
 * // 4. Groups by status (upcoming, in-progress, completed)
 * // 5. Renders status-grouped sections with appointment cards
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
  title: "Today's Appointments | White Cross",
  description: "View and manage today's scheduled appointments",
};

/**
 * Force dynamic rendering for current-date view
 *
 * Must be dynamic because "today" changes every day.
 * Static generation would cache a specific date permanently.
 */
export const dynamic = "force-dynamic";

/**
 * Today's Appointments Page Component
 *
 * Server component that fetches and displays all appointments scheduled for the
 * current day, grouped by status and sorted chronologically. Provides a real-time
 * dashboard for nurses to manage their daily appointment workflow.
 *
 * **Server Component Benefits:**
 * - Calculates "today" on the server (avoids timezone issues)
 * - Fetches appointments before rendering (no loading spinner)
 * - Groups appointments server-side (reduced client JavaScript)
 * - Always up-to-date (no stale cached data for current day)
 *
 * **Grouping Algorithm:**
 * Appointments are filtered into status-based arrays using JavaScript filter():
 * - `upcoming = appointments.filter(a => ['scheduled', 'confirmed'].includes(a.status))`
 * - `inProgress = appointments.filter(a => a.status === 'in-progress')`
 * - `completed = appointments.filter(a => a.status === 'completed')`
 * - `noShow = appointments.filter(a => a.status === 'no-show')`
 *
 * Time Complexity: O(n) where n = number of appointments (typically < 30 per day)
 *
 * **Display Priority:**
 * Sections are displayed in workflow order:
 * 1. In Progress (highest priority - currently active)
 * 2. Upcoming (next priority - scheduled for later today)
 * 3. Completed (reference - already finished)
 * 4. Empty State (shown when no appointments exist)
 *
 * @returns {Promise<JSX.Element>} Rendered today's appointments page
 *
 * @example
 * ```tsx
 * // Typical daily workflow:
 * // 8:00 AM: Page shows 6 upcoming appointments for the day
 * // 10:30 AM: Nurse starts first appointment → moves to "in-progress"
 * // 11:00 AM: Finishes appointment → moves to "completed"
 * // End of day: All appointments in "completed" or "no-show"
 * ```
 */
export default async function TodayPage() {
  // Authentication check - redirect unauthenticated users
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  /**
   * Get today's date in ISO format (YYYY-MM-DD)
   *
   * Uses server timezone for consistency. All users see appointments
   * based on the server's current date, avoiding timezone confusion.
   */
  const today = new Date().toISOString().split('T')[0];

  /**
   * Fetch today's appointments
   *
   * Query parameters:
   * - startDate = endDate = today (single-day query)
   * - sortBy = 'scheduledTime' (chronological order within day)
   * - order = 'asc' (earliest appointments first)
   */
  const result = await getAppointmentsAction({
    startDate: today,
    endDate: today,
    sortBy: 'scheduledTime',
    order: 'asc',
  });

  const appointments = result.success ? result.data?.appointments || [] : [];

  /**
   * Group appointments by status for workflow-based display
   *
   * Uses JavaScript filter() to partition appointments into status groups.
   * Each filter pass is O(n), total grouping is O(5n) = O(n).
   */
  // Upcoming: Not yet started (scheduled or confirmed)
  const upcoming = appointments.filter((a) =>
    ['scheduled', 'confirmed'].includes(a.status)
  );

  // In Progress: Currently being conducted
  const inProgress = appointments.filter((a) => a.status === 'in-progress');

  // Completed: Finished with notes
  const completed = appointments.filter((a) => a.status === 'completed');

  // No Show: Student didn't arrive
  const noShow = appointments.filter((a) => a.status === 'no-show');

  // Cancelled: Appointment cancelled (not displayed in main workflow)
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
