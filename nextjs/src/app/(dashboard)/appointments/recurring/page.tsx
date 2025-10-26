/**
 * @fileoverview Recurring Appointments Management Page
 * @module app/appointments/recurring
 *
 * Manage recurring appointment series with create, edit, and delete capabilities.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { RecurringAppointmentManager } from '@/components/appointments/RecurringAppointmentManager';

export const metadata: Metadata = {
  title: 'Recurring Appointments | White Cross',
  description: 'Manage recurring appointment series',
};

export default async function RecurringPage() {
  // Authentication check
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

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
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

      {/* Recurring Appointment Manager */}
      <div className="bg-white rounded-lg shadow p-6">
        <Suspense
          fallback={
            <div className="py-12 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          }
        >
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
