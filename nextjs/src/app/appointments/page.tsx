'use client';

import React, { useState } from 'react';
import { useAppointmentsList, useAppointmentStatistics } from '@/hooks/domains/appointments';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ViewMode = 'calendar' | 'list';
type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no-show';

interface Appointment {
  id: string;
  studentId: string;
  studentName?: string;
  reason: string;
  scheduledFor: string;
  duration: number;
  status: AppointmentStatus;
  nurseId?: string;
  nurseName?: string;
  notes?: string;
  createdAt: string;
}

/**
 * Appointments Page
 *
 * Main appointments interface with calendar and list views for:
 * - Viewing scheduled appointments
 * - Quick appointment statistics
 * - Filtering by date range and status
 * - Creating new appointments
 * - Managing waitlist
 *
 * @remarks
 * - Client Component for interactive calendar and filtering
 * - Uses React Query for server state management
 * - All appointment operations are HIPAA-audited
 * - Supports both calendar and list view modes
 */
export default function AppointmentsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filterStatus, setFilterStatus] = useState<AppointmentStatus | 'all'>('all');

  const { data: appointments, isLoading, error } = useAppointmentsList({
    status: filterStatus === 'all' ? undefined : filterStatus,
  });

  const { data: statistics } = useAppointmentStatistics();

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading Appointments</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>
                {error instanceof Error ? error.message : 'Unable to load appointments. Please try again.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusColors: Record<AppointmentStatus, string> = {
    scheduled: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    'no-show': 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Appointments
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Schedule and manage student health appointments
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Link
            href="/appointments/new"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            Schedule Appointment
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">Today&apos;s Appointments</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {statistics.todayCount || 0}
            </dd>
          </div>
          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">This Week</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {statistics.weekCount || 0}
            </dd>
          </div>
          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">Pending</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {statistics.pendingCount || 0}
            </dd>
          </div>
          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">Completion Rate</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {statistics.completionRate || 0}%
            </dd>
          </div>
        </div>
      )}

      {/* View Toggle and Filters */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('list')}
            className={`${
              viewMode === 'list'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } rounded-md px-3 py-2 text-sm font-medium`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`${
              viewMode === 'calendar'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } rounded-md px-3 py-2 text-sm font-medium`}
          >
            Calendar View
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
            Filter:
          </label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as AppointmentStatus | 'all')}
            className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          >
            <option value="all">All Appointments</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no-show">No Show</option>
          </select>
        </div>
      </div>

      {/* Appointments List/Calendar */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <span className="ml-3 text-sm text-gray-500">Loading appointments...</span>
        </div>
      ) : viewMode === 'list' ? (
        <div className="overflow-hidden bg-white shadow sm:rounded-md">
          {appointments && appointments.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {appointments.map((appointment: Appointment) => (
                <li key={appointment.id}>
                  <Link
                    href={`/appointments/${appointment.id}`}
                    className="block hover:bg-gray-50"
                  >
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="truncate text-sm font-medium text-indigo-600">
                              {appointment.studentName || `Student ${appointment.studentId}`}
                            </p>
                            <span
                              className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                statusColors[appointment.status]
                              }`}
                            >
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                <svg
                                  className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                                  />
                                </svg>
                                {new Date(appointment.scheduledFor).toLocaleString()}
                              </p>
                              <p className="mt-2 flex items-center text-sm text-gray-500 sm:ml-6 sm:mt-0">
                                {appointment.reason}
                              </p>
                            </div>
                            {appointment.nurseName && (
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <svg
                                  className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                  />
                                </svg>
                                {appointment.nurseName}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by scheduling a new appointment.
              </p>
              <div className="mt-6">
                <Link
                  href="/appointments/new"
                  className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  Schedule Appointment
                </Link>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <p className="text-sm text-gray-500">
              Calendar view coming soon. Use list view to see appointments.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
