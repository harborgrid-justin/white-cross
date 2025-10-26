/**
 * @fileoverview Edit Appointment Page
 * @module app/appointments/[id]/edit
 *
 * Page for editing an existing appointment
 */

'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import SchedulingForm from '@/components/appointments/SchedulingForm';

interface EditAppointmentContentProps {
  appointmentId: string;
}

function EditAppointmentContent({ appointmentId }: EditAppointmentContentProps) {
  const router = useRouter();

  // Fetch appointment details
  const { data: appointment, isLoading, error } = useQuery({
    queryKey: ['appointment', appointmentId],
    queryFn: async () => {
      const response = await fetch(`/api/proxy/appointments/${appointmentId}`);
      if (!response.ok) throw new Error('Failed to fetch appointment');
      return response.json();
    },
  });

  // Fetch students for selection
  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const response = await fetch('/api/proxy/students');
      if (!response.ok) throw new Error('Failed to fetch students');
      const data = await response.json();
      return data.map((student: any) => ({
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        grade: student.grade,
      }));
    },
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
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
              <p>{error instanceof Error ? error.message : 'Unable to load appointment'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Transform appointment for form
  const formAppointment = {
    id: appointment.id,
    studentId: appointment.studentId,
    appointmentType: appointment.appointmentType,
    scheduledDate: appointment.scheduledDate || appointment.scheduledFor?.split('T')[0],
    scheduledTime: appointment.scheduledTime || appointment.scheduledFor?.split('T')[1]?.slice(0, 5),
    duration: appointment.duration,
    reason: appointment.reason,
    notes: appointment.notes,
    priority: appointment.priority,
    reminderEnabled: appointment.reminderEnabled,
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
              <Link href={`/appointments/${appointmentId}`} className="ml-4 text-sm font-medium text-gray-400 hover:text-gray-500">
                Appointment Details
              </Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="h-5 w-5 flex-shrink-0 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              <span className="ml-4 text-sm font-medium text-gray-500">Edit</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900">Edit Appointment</h2>
        <p className="mt-1 text-sm text-gray-500">
          Update appointment details with automated conflict detection
        </p>
      </div>

      {/* Appointment Form */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <SchedulingForm
            appointment={formAppointment}
            students={students || []}
            onSuccess={(id) => router.push(`/appointments/${id}`)}
            onCancel={() => router.push(`/appointments/${appointmentId}`)}
          />
        </div>
      </div>
    </div>
  );
}

export default function EditAppointmentPage({ params }: { params: { id: string } }) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      }
    >
      <EditAppointmentContent appointmentId={params.id} />
    </Suspense>
  );
}
