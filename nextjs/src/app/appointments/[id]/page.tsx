'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';

interface AppointmentDetails {
  id: string;
  studentId: string;
  studentName?: string;
  reason: string;
  scheduledFor: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  nurseId?: string;
  nurseName?: string;
  notes?: string;
  completedAt?: string;
  completionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Appointment Details Page
 *
 * Displays comprehensive information about a specific appointment including:
 * - Appointment details (date, time, duration, reason)
 * - Student information
 * - Nurse assignment
 * - Status and completion notes
 * - Actions (complete, cancel, reschedule)
 *
 * @remarks
 * - Client Component for interactive features
 * - Uses dynamic route parameter [id]
 * - All data access is HIPAA-audited
 * - Supports appointment status updates
 */
export default function AppointmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const appointmentId = params?.id as string;

  const { data: appointment, isLoading, error } = useQuery<AppointmentDetails>({
    queryKey: ['appointment', appointmentId],
    queryFn: async () => {
      const response = await fetch(`/api/proxy/appointments/${appointmentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch appointment details');
      }
      return response.json();
    },
    enabled: !!appointmentId,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: 'completed' | 'cancelled' | 'no-show') => {
      const response = await fetch(`/api/proxy/appointments/${appointmentId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update appointment status');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointment', appointmentId] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  const handleStatusUpdate = (newStatus: 'completed' | 'cancelled' | 'no-show') => {
    const confirmMessage =
      newStatus === 'completed'
        ? 'Mark this appointment as completed?'
        : newStatus === 'cancelled'
        ? 'Cancel this appointment?'
        : 'Mark this appointment as no-show?';

    if (window.confirm(confirmMessage)) {
      updateStatusMutation.mutate(newStatus);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        <span className="ml-3 text-sm text-gray-500">Loading appointment details...</span>
      </div>
    );
  }

  if (error || !appointment) {
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
            <h3 className="text-sm font-medium text-red-800">Error Loading Appointment</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>Unable to load appointment details. The appointment may not exist or you may not have permission to view it.</p>
            </div>
            <div className="mt-4">
              <Link
                href="/appointments"
                className="text-sm font-medium text-red-800 hover:text-red-900"
              >
                Back to Appointments
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    'no-show': 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-4">
          <li>
            <Link href="/appointments" className="text-gray-400 hover:text-gray-500">
              Appointments
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="h-5 w-5 flex-shrink-0 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              <span className="ml-4 text-sm font-medium text-gray-500">
                {appointment.studentName || `Appointment ${appointmentId.slice(0, 8)}`}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header with Actions */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
            Appointment Details
          </h2>
          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${statusColors[appointment.status]}`}>
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1).replace('-', ' ')}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex space-x-3 md:ml-4 md:mt-0">
          {appointment.status === 'scheduled' && (
            <>
              <button
                onClick={() => handleStatusUpdate('completed')}
                disabled={updateStatusMutation.isPending}
                className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 disabled:opacity-50"
              >
                Mark Complete
              </button>
              <button
                onClick={() => handleStatusUpdate('no-show')}
                disabled={updateStatusMutation.isPending}
                className="inline-flex items-center rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-700 disabled:opacity-50"
              >
                Mark No-Show
              </button>
              <button
                onClick={() => handleStatusUpdate('cancelled')}
                disabled={updateStatusMutation.isPending}
                className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-50"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Appointment Details */}
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">Appointment Information</h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">Student</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {appointment.studentName || appointment.studentId}
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">Scheduled For</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {new Date(appointment.scheduledFor).toLocaleString()}
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">Duration</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {appointment.duration} minutes
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">Reason</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {appointment.reason}
              </dd>
            </div>
            {appointment.nurseName && (
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                <dt className="text-sm font-medium text-gray-500">Assigned Nurse</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {appointment.nurseName}
                </dd>
              </div>
            )}
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${statusColors[appointment.status]}`}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1).replace('-', ' ')}
                </span>
              </dd>
            </div>
            {appointment.notes && (
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                <dt className="text-sm font-medium text-gray-500">Notes</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {appointment.notes}
                </dd>
              </div>
            )}
            {appointment.status === 'completed' && appointment.completedAt && (
              <>
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                  <dt className="text-sm font-medium text-gray-500">Completed At</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {new Date(appointment.completedAt).toLocaleString()}
                  </dd>
                </div>
                {appointment.completionNotes && (
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                    <dt className="text-sm font-medium text-gray-500">Completion Notes</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {appointment.completionNotes}
                    </dd>
                  </div>
                )}
              </>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}
