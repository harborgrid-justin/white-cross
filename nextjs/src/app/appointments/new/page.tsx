'use client';

import React, { use, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import SchedulingForm from '@/components/appointments/SchedulingForm';

/**
 * Schedule New Appointment Page
 *
 * Appointment scheduling workflow with:
 * - Student selection
 * - Conflict detection
 * - Real-time availability checking
 * - Reminder settings
 * - Form validation
 *
 * @remarks
 * - Client Component for form interaction
 * - Prevents double-booking with conflict detection
 * - All appointments are HIPAA-audited
 */
function NewAppointmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get pre-filled values from query params
  const prefillDate = searchParams.get('date') || undefined;
  const prefillTime = searchParams.get('time') || undefined;
  const prefillStudentId = searchParams.get('studentId') || undefined;

  // Fetch students for selection
  const { data: students, isLoading } = useQuery({
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
              <span className="ml-4 text-sm font-medium text-gray-500">Schedule Appointment</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900">Schedule New Appointment</h2>
        <p className="mt-1 text-sm text-gray-500">
          Create a new appointment with automated conflict detection and reminder scheduling
        </p>
      </div>

      {/* Appointment Form */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          ) : (
            <SchedulingForm
              studentId={prefillStudentId}
              prefillDate={prefillDate}
              prefillTime={prefillTime}
              students={students || []}
              onSuccess={(id) => router.push(`/appointments/${id}`)}
              onCancel={() => router.push('/appointments')}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function NewAppointmentPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    }>
      <NewAppointmentContent />
    </Suspense>
  );
}
