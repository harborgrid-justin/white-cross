/**
 * @fileoverview Recurring Appointments Management Page
 * @module app/appointments/recurring
 *
 * Specialized interface for managing recurring appointment series in healthcare settings.
 * Enables school nurses to create, edit, and manage repeating appointment patterns for
 * students requiring regular health interventions (medication administration, therapy
 * sessions, wellness checks).
 *
 * **Recurring Appointment Patterns:**
 * The system supports three recurrence types with flexible configuration:
 *
 * 1. **Daily Recurrence**
 *    - Repeat every N days (1-7 days interval)
 *    - Use Case: Daily medication administration, wound care
 *    - Example: "Every 2 days for 2 weeks"
 *
 * 2. **Weekly Recurrence**
 *    - Repeat on specific days of the week (M, T, W, Th, F)
 *    - Multi-day selection supported (e.g., Mon/Wed/Fri)
 *    - Use Case: Physical therapy, counseling sessions
 *    - Example: "Every Monday and Friday for 8 weeks"
 *
 * 3. **Monthly Recurrence**
 *    - Repeat on specific day of month (e.g., "15th of each month")
 *    - OR repeat on day-of-week pattern (e.g., "2nd Tuesday of each month")
 *    - Use Case: Monthly wellness checks, immunization follow-ups
 *    - Example: "First Friday of every month for 6 months"
 *
 * **Series Management:**
 * - **Edit Single Occurrence**: Modify one appointment without affecting series
 * - **Edit Future Occurrences**: Update all appointments from a specific date forward
 * - **Cancel Single**: Cancel one occurrence, mark as exception
 * - **Cancel Series**: Cancel all future appointments in series
 *
 * **Healthcare Use Cases:**
 * - Medication administration schedules (daily insulin, ADHD meds)
 * - Physical therapy sessions (2-3x per week for multiple weeks)
 * - Regular health monitoring (weekly blood pressure checks)
 * - Counseling appointments (weekly mental health sessions)
 * - Immunization series (multi-dose vaccines with specific intervals)
 *
 * **Conflict Detection:**
 * - Validates against existing appointments to prevent scheduling conflicts
 * - Checks nurse availability across all generated occurrences
 * - Warns when recurrence pattern creates overlapping appointments
 *
 * **Performance Considerations:**
 * - Recurrence patterns generate appointments on-demand, not all at once
 * - Maximum series length: 52 weeks (1 year) to prevent database bloat
 * - Background job handles series generation for minimal UI blocking
 *
 * @see {@link RecurringAppointmentManager} for the series management component
 *
 * @example
 * ```tsx
 * // Create daily recurrence:
 * // Pattern: Every weekday (Mon-Fri) for 4 weeks
 * // Generates: 20 appointments (5 days × 4 weeks)
 *
 * // Create weekly recurrence:
 * // Pattern: Every Monday and Wednesday for 8 weeks
 * // Generates: 16 appointments (2 days × 8 weeks)
 *
 * // Create monthly recurrence:
 * // Pattern: First Friday of each month for 6 months
 * // Generates: 6 appointments (1 per month × 6 months)
 * ```
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { RecurringAppointmentManager } from '@/components/appointments/RecurringAppointmentManager';

/**
 * Next.js Metadata Configuration
 *
 * SEO and browser metadata for recurring appointments management page.
 */
export const metadata: Metadata = {
  title: 'Recurring Appointments | White Cross',
  description: 'Manage recurring appointment series',
};

/**
 * Next.js Rendering Mode Configuration
 *
 * Forces dynamic rendering for authentication and real-time series data.
 *
 * @constant {string} dynamic - Disables static generation
 */
export const dynamic = "force-dynamic";

/**
 * Recurring Appointments Page Component
 *
 * Server component that provides the interface for managing recurring appointment
 * series. Handles authentication and delegates series management to the client-side
 * RecurringAppointmentManager component.
 *
 * **Component Responsibilities:**
 * - Authenticate user before displaying series management interface
 * - Provide informational guidance on recurring appointment patterns
 * - Display guidelines for appropriate use cases
 * - Render the RecurringAppointmentManager with user context
 *
 * **Series Creation Flow:**
 * 1. User clicks "Create Recurring Series" button
 * 2. Modal opens with pattern configuration options
 * 3. User selects recurrence type (daily/weekly/monthly)
 * 4. User configures pattern details and end date
 * 5. System validates pattern and checks for conflicts
 * 6. Background job generates appointment occurrences
 * 7. User sees series summary and can edit individual occurrences
 *
 * **Accessibility:**
 * - Recurrence pattern controls are keyboard-navigable
 * - Day-of-week selectors support arrow key navigation
 * - Series preview is announced to screen readers
 * - Error messages for invalid patterns are clearly communicated
 *
 * @returns {Promise<JSX.Element>} Rendered recurring appointments management page
 *
 * @example
 * ```tsx
 * // Server renders this page when user navigates to /appointments/recurring
 * // Checks authentication, then displays series management interface
 * ```
 */
export default async function RecurringPage() {
  // Authentication check - redirect unauthenticated users to login
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Recurring Appointments
          </h1>
          <p className="mt-2 text-gray-600">
            Manage appointment series and recurring schedules
          </p>
        </div>
        <Button asChild>
          <Link href="/appointments/new?recurring=true">
            Create Recurring Series
          </Link>
        </Button>
      </div>

      {/* Informational Card - Explains recurring appointments concept */}
      {/* Provides context for nurses unfamiliar with series functionality */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            {/* Information icon for visual context */}
            <svg
              className="h-5 w-5 text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              About Recurring Appointments
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Recurring appointments allow you to schedule a series of appointments
                that repeat on a regular basis (daily, weekly, or monthly). You can
                edit or cancel individual occurrences or the entire series.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recurring Appointment Manager Component */}
      {/* Client-side component that handles series CRUD operations */}
      {/* Provides pattern configuration, series preview, and conflict detection */}
      <div className="bg-white rounded-lg shadow p-6">
        <Suspense
          fallback={
            <div className="py-12 flex items-center justify-center">
              {/* Loading state while manager component initializes */}
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          }
        >
          {/*
            RecurringAppointmentManager: Interactive series management interface
            - Series creation wizard with pattern configuration
            - Series list with edit/delete actions
            - Individual occurrence override capabilities
            - Conflict detection and validation
            - Series preview showing all generated appointments
          */}
          <RecurringAppointmentManager userId={session.user.id} />
        </Suspense>
      </div>

      {/* Guidelines */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recurring Appointment Guidelines
        </h2>
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <h3 className="font-medium text-gray-900 mb-1">
              When to use recurring appointments:
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Regular medication administration schedules</li>
              <li>Weekly health checks for students with chronic conditions</li>
              <li>Monthly wellness visits</li>
              <li>Physical therapy sessions</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-1">
              Supported recurrence patterns:
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Daily (every 1-7 days)</li>
              <li>Weekly (specific days of the week)</li>
              <li>Monthly (specific day of month or day of week)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-1">
              Managing recurring series:
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Edit a single occurrence without affecting the series</li>
              <li>Edit all future occurrences starting from a specific date</li>
              <li>Cancel individual occurrences</li>
              <li>Cancel the entire series</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
