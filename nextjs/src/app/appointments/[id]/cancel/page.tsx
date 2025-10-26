/**
 * @fileoverview Cancel Appointment Page
 * @module app/appointments/[id]/cancel
 *
 * Page for cancelling an appointment with reason
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { cancelAppointment } from '@/actions/appointments.actions';
import { toast } from 'react-hot-toast';

interface CancelAppointmentContentProps {
  appointmentId: string;
}

function CancelAppointmentContent({ appointmentId }: CancelAppointmentContentProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  // Fetch appointment details
  const { data: appointment, isLoading } = useQuery({
    queryKey: ['appointment', appointmentId],
    queryFn: async () => {
      const response = await fetch(`/api/proxy/appointments/${appointmentId}`);
      if (!response.ok) throw new Error('Failed to fetch appointment');
      return response.json();
    },
  });

  // Cancel mutation
  const cancelMutation = useMutation({
    mutationFn: async (cancelReason: string) => {
      const result = await cancelAppointment(appointmentId, cancelReason);
      if (!result.success) {
        throw new Error(result.error || 'Failed to cancel appointment');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment', appointmentId] });
      toast.success('Appointment cancelled successfully');
      router.push('/appointments');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalReason = reason === 'other' ? customReason : reason;

    if (!finalReason) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    cancelMutation.mutate(finalReason);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-sm text-red-800">Appointment not found</p>
      </div>
    );
  }

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const cancellationReasons = [
    'Student is absent',
    'Student no longer needs appointment',
    'Nurse unavailable',
    'Scheduling conflict',
    'Duplicate appointment',
    'Other',
  ];

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
              <Link
                href={`/appointments/${appointmentId}`}
                className="ml-4 text-sm font-medium text-gray-400 hover:text-gray-500"
              >
                Appointment Details
              </Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="h-5 w-5 flex-shrink-0 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              <span className="ml-4 text-sm font-medium text-gray-500">Cancel</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900">Cancel Appointment</h2>
        <p className="mt-1 text-sm text-gray-500">Please provide a reason for cancelling this appointment</p>
      </div>

      {/* Warning */}
      <div className="rounded-md bg-yellow-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Confirmation Required</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                This action cannot be undone. The appointment will be marked as cancelled and all participants will
                be notified.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Details */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">Appointment Details</h3>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Student</dt>
              <dd className="mt-1 text-sm text-gray-900">{appointment.studentName || appointment.studentId}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{appointment.appointmentType}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Scheduled For</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatDateTime(appointment.scheduledDate, appointment.scheduledTime)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Duration</dt>
              <dd className="mt-1 text-sm text-gray-900">{appointment.duration} minutes</dd>
            </div>
            {appointment.reason && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Reason</dt>
                <dd className="mt-1 text-sm text-gray-900">{appointment.reason}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Cancellation Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              {/* Reason Selection */}
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                  Reason for Cancellation <span className="text-red-500">*</span>
                </label>
                <select
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select a reason...</option>
                  {cancellationReasons.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Reason */}
              {reason === 'Other' && (
                <div>
                  <label htmlFor="customReason" className="block text-sm font-medium text-gray-700">
                    Please specify <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="customReason"
                    rows={3}
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    required
                    placeholder="Enter the reason for cancellation"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <Link
            href={`/appointments/${appointmentId}`}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Go Back
          </Link>
          <button
            type="submit"
            disabled={cancelMutation.isPending}
            className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelMutation.isPending ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Cancelling...
              </>
            ) : (
              'Cancel Appointment'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function CancelAppointmentPage({ params }: { params: { id: string } }) {
  return <CancelAppointmentContent appointmentId={params.id} />;
}
