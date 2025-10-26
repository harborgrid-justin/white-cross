/**
 * @fileoverview Dedicated Calendar View Page
 * @module app/appointments/calendar
 *
 * Full-screen calendar view for appointment management
 */

'use client';

import React, { Suspense } from 'react';
import { useAppointmentsList } from '@/hooks/domains/appointments';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const AppointmentCalendar = dynamic(
  () => import('@/components/appointments/AppointmentCalendar'),
  {
    ssr: false,
    loading: () => <CalendarSkeleton />,
  }
);

function CalendarSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-10 bg-gray-200 rounded mb-4"></div>
      <div className="h-96 bg-gray-100 rounded"></div>
    </div>
  );
}

export default function AppointmentsCalendarPage() {
  const { data: appointments, isLoading } = useAppointmentsList({});

  // Transform appointments
  const calendarAppointments = React.useMemo(() => {
    if (!appointments) return [];

    return appointments.map((apt: any) => ({
      id: apt.id,
      studentId: apt.studentId,
      studentName: apt.studentName,
      nurseId: apt.nurseId,
      nurseName: apt.nurseName,
      appointmentType: apt.appointmentType || 'General',
      scheduledDate: apt.scheduledDate || apt.scheduledFor?.split('T')[0] || '',
      scheduledTime: apt.scheduledTime || apt.scheduledFor?.split('T')[1]?.slice(0, 5) || '',
      duration: apt.duration,
      status: apt.status,
      reason: apt.reason,
      notes: apt.notes,
      priority: apt.priority || 'medium',
    }));
  }, [appointments]);

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
              <span className="ml-4 text-sm font-medium text-gray-500">Calendar View</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Appointment Calendar
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Drag appointments to reschedule, click dates to create new appointments
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0 space-x-3">
          <Link
            href="/appointments"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            List View
          </Link>
          <Link
            href="/appointments/new"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            Schedule Appointment
          </Link>
        </div>
      </div>

      {/* Calendar */}
      {isLoading ? (
        <CalendarSkeleton />
      ) : (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <Suspense fallback={<CalendarSkeleton />}>
              <AppointmentCalendar
                appointments={calendarAppointments}
                initialView="timeGridWeek"
                editable={true}
                selectable={true}
                showWeekends={false}
                workingHours={{
                  start: '08:00',
                  end: '17:00',
                  daysOfWeek: [1, 2, 3, 4, 5],
                }}
              />
            </Suspense>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">Calendar Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-blue-500 mr-2"></div>
              <span className="text-sm text-gray-700">Scheduled</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-green-500 mr-2"></div>
              <span className="text-sm text-gray-700">Confirmed</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-amber-500 mr-2"></div>
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
    </div>
  );
}
