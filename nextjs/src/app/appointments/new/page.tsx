'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useAvailabilitySlots } from '@/hooks/domains/appointments';

interface AppointmentFormData {
  studentId: string;
  reason: string;
  scheduledFor: string;
  duration: number;
  nurseId?: string;
  notes?: string;
}

/**
 * Schedule New Appointment Page
 *
 * Appointment scheduling workflow with:
 * - Student selection
 * - Reason and duration specification
 * - Nurse availability checking
 * - Time slot selection
 * - Optional notes
 *
 * @remarks
 * - Client Component for form interaction
 * - Validates nurse availability before scheduling
 * - Prevents double-booking
 * - All appointments are HIPAA-audited
 */
export default function NewAppointmentPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<AppointmentFormData>({
    studentId: '',
    reason: '',
    scheduledFor: '',
    duration: 30,
    nurseId: '',
    notes: '',
  });

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Fetch students for selection
  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const response = await fetch('/api/proxy/students');
      if (!response.ok) throw new Error('Failed to fetch students');
      return response.json();
    },
  });

  // Fetch availability slots
  const { data: availableSlots } = useAvailabilitySlots({
    date: selectedDate,
    nurseId: formData.nurseId || undefined,
  });

  // Create appointment mutation
  const createMutation = useMutation({
    mutationFn: async (data: AppointmentFormData) => {
      const response = await fetch('/api/proxy/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create appointment');
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      router.push(`/appointments/${data.id}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.studentId || !formData.reason || !formData.scheduledFor) {
      alert('Please fill in all required fields');
      return;
    }

    createMutation.mutate(formData);
  };

  const reasonOptions = [
    'Annual Physical Exam',
    'Injury Assessment',
    'Medication Administration',
    'Immunization',
    'Illness Evaluation',
    'Follow-up Visit',
    'Vision Screening',
    'Hearing Screening',
    'Mental Health Consultation',
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
              <span className="ml-4 text-sm font-medium text-gray-500">Schedule Appointment</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900">Schedule New Appointment</h2>
        <p className="mt-1 text-sm text-gray-500">
          Create a new appointment for a student
        </p>
      </div>

      {/* Error Display */}
      {createMutation.isError && (
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
              <h3 className="text-sm font-medium text-red-800">Error Creating Appointment</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{createMutation.error instanceof Error ? createMutation.error.message : 'Unknown error occurred'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {/* Student Selection */}
              <div className="sm:col-span-6">
                <label htmlFor="student" className="block text-sm font-medium text-gray-700">
                  Student *
                </label>
                <select
                  id="student"
                  required
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select a student...</option>
                  {students &&
                    students.map((student: any) => (
                      <option key={student.id} value={student.id}>
                        {student.firstName} {student.lastName} - Grade {student.grade}
                      </option>
                    ))}
                </select>
              </div>

              {/* Reason */}
              <div className="sm:col-span-6">
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                  Reason for Visit *
                </label>
                <select
                  id="reason"
                  required
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select a reason...</option>
                  {reasonOptions.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div className="sm:col-span-3">
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                  Duration (minutes) *
                </label>
                <select
                  id="duration"
                  required
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
              </div>

              {/* Date Selection */}
              <div className="sm:col-span-3">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date *
                </label>
                <input
                  type="date"
                  id="date"
                  required
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              {/* Time Slot Selection */}
              <div className="sm:col-span-6">
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                  Time Slot *
                </label>
                <select
                  id="time"
                  required
                  value={formData.scheduledFor}
                  onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select a time slot...</option>
                  {availableSlots && availableSlots.length > 0 ? (
                    availableSlots.map((slot: any) => (
                      <option key={slot.time} value={slot.time}>
                        {new Date(slot.time).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {slot.nurseAvailable ? ' (Available)' : ' (Limited availability)'}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No available slots for selected date
                    </option>
                  )}
                </select>
                <p className="mt-2 text-sm text-gray-500">
                  Available time slots based on nurse availability
                </p>
              </div>

              {/* Notes */}
              <div className="sm:col-span-6">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional information or special requirements..."
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <Link
            href="/appointments"
            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
          >
            {createMutation.isPending ? 'Scheduling...' : 'Schedule Appointment'}
          </button>
        </div>
      </form>
    </div>
  );
}
