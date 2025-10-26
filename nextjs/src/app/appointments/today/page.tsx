/**
 * @fileoverview Today's Appointments Page
 * @module app/appointments/today
 *
 * Display today's scheduled appointments with quick actions
 */

'use client';

import React from 'react';
import { useAppointmentsList } from '@/hooks/domains/appointments';
import { AppointmentList } from '@/components/appointments/AppointmentList';
import Link from 'next/link';

export default function TodayAppointmentsPage() {
  const today = new Date().toISOString().split('T')[0];

  const { data: appointments, isLoading, error } = useAppointmentsList({
    startDate: today,
    endDate: today,
  });

  const todayAppointments = React.useMemo(() => {
    if (!appointments) return [];

    return appointments.map((apt: any) => ({
      id: apt.id,
      studentId: apt.studentId,
      studentName: apt.studentName,
      appointmentType: apt.appointmentType || 'General',
      scheduledDate: apt.scheduledDate || apt.scheduledFor?.split('T')[0] || '',
      scheduledTime: apt.scheduledTime || apt.scheduledFor?.split('T')[1]?.slice(0, 5) || '',
      duration: apt.duration,
      status: apt.status,
      priority: apt.priority || 'medium',
      reason: apt.reason,
      nurseId: apt.nurseId,
      nurseName: apt.nurseName,
    }));
  }, [appointments]);

  // Group by time
  const groupedByTime = React.useMemo(() => {
    const groups: Record<string, typeof todayAppointments> = {};
    todayAppointments.forEach((apt) => {
      const hour = parseInt(apt.scheduledTime.split(':')[0]);
      let period = 'Morning (8 AM - 12 PM)';
      if (hour >= 12 && hour < 17) {
        period = 'Afternoon (12 PM - 5 PM)';
      } else if (hour >= 17) {
        period = 'Evening (5 PM - 8 PM)';
      }
      if (!groups[period]) groups[period] = [];
      groups[period].push(apt);
    });
    return groups;
  }, [todayAppointments]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
              <span className="ml-4 text-sm font-medium text-gray-500">Today</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Today's Appointments
          </h2>
          <p className="mt-1 text-sm text-gray-500">{formatDate(new Date())}</p>
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

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Total Today</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {todayAppointments.length}
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Scheduled</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-blue-600">
            {todayAppointments.filter((a) => a.status === 'scheduled').length}
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Completed</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-green-600">
            {todayAppointments.filter((a) => a.status === 'completed').length}
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Remaining</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-amber-600">
            {
              todayAppointments.filter(
                (a) => a.status === 'scheduled' || a.status === 'confirmed' || a.status === 'in-progress'
              ).length
            }
          </dd>
        </div>
      </div>

      {/* Appointments by Time Period */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <span className="ml-3 text-sm text-gray-500">Loading appointments...</span>
        </div>
      ) : error ? (
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
                <p>{error instanceof Error ? error.message : 'Unable to load appointments'}</p>
              </div>
            </div>
          </div>
        </div>
      ) : todayAppointments.length === 0 ? (
        <div className="rounded-lg bg-white shadow text-center py-12">
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments today</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by scheduling a new appointment.</p>
          <div className="mt-6">
            <Link
              href="/appointments/new"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              Schedule Appointment
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByTime).map(([period, apts]) => (
            <div key={period} className="bg-white shadow sm:rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">{period}</h3>
                <p className="mt-1 text-sm text-gray-500">{apts.length} appointments</p>
              </div>
              <AppointmentList appointments={apts} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
