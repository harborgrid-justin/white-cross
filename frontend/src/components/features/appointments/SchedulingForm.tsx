/**
 * @fileoverview Appointment Scheduling Form Component
 * @module components/appointments/SchedulingForm
 *
 * Comprehensive form for creating and editing appointments with:
 * - Real-time conflict detection
 * - Availability checking
 * - Reminder settings
 * - Form validation with Zod schemas
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { appointmentCreateSchema } from '@/schemas/appointment.schemas';
import { checkConflict, findAvailableSlots } from '@/lib/appointments/conflicts';
import { createAppointment, updateAppointment } from '@/actions/appointments.actions';
import { toast } from 'react-hot-toast';
import type { z } from 'zod';

// ==========================================
// TYPES
// ==========================================

interface SchedulingFormProps {
  /** Existing appointment for editing */
  appointment?: {
    id: string;
    studentId: string;
    appointmentType: string;
    scheduledDate: string;
    scheduledTime: string;
    duration: number;
    reason: string;
    notes?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    reminderEnabled?: boolean;
  };
  /** Pre-selected student ID */
  studentId?: string;
  /** Pre-filled date */
  prefillDate?: string;
  /** Pre-filled time */
  prefillTime?: string;
  /** List of students for selection */
  students?: Array<{ id: string; name: string; grade?: string }>;
  /** Callback on successful submission */
  onSuccess?: (appointmentId: string) => void;
  /** Callback on cancel */
  onCancel?: () => void;
}

type FormData = z.infer<typeof appointmentCreateSchema>;

// ==========================================
// COMPONENT
// ==========================================

export default function SchedulingForm({
  appointment,
  studentId,
  prefillDate,
  prefillTime,
  students = [],
  onSuccess,
  onCancel,
}: SchedulingFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingConflict, setIsCheckingConflict] = useState(false);
  const [conflictMessage, setConflictMessage] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [showAvailableSlots, setShowAvailableSlots] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<FormData>>({
    studentId: appointment?.studentId || studentId || '',
    appointmentType: appointment?.appointmentType || 'check-up',
    scheduledDate: appointment?.scheduledDate || prefillDate || '',
    scheduledTime: appointment?.scheduledTime || prefillTime || '',
    duration: appointment?.duration || 30,
    reason: appointment?.reason || '',
    notes: appointment?.notes || '',
    priority: appointment?.priority || 'medium',
    reminderEnabled: appointment?.reminderEnabled ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Debounced conflict check
   */
  const checkForConflicts = useCallback(async () => {
    if (!formData.studentId || !formData.scheduledDate || !formData.scheduledTime || !formData.duration) {
      return;
    }

    setIsCheckingConflict(true);
    setConflictMessage(null);

    try {
      const result = await checkConflict({
        appointmentId: appointment?.id,
        studentId: formData.studentId,
        scheduledDate: formData.scheduledDate,
        scheduledTime: formData.scheduledTime,
        duration: formData.duration,
      });

      if (result.hasConflict) {
        setConflictMessage(result.message || 'Scheduling conflict detected');
      } else {
        setConflictMessage(null);
      }
    } catch (error) {
      console.error('Error checking conflicts:', error);
    } finally {
      setIsCheckingConflict(false);
    }
  }, [formData.studentId, formData.scheduledDate, formData.scheduledTime, formData.duration, appointment?.id]);

  /**
   * Find available time slots
   */
  const findSlots = useCallback(async () => {
    if (!formData.studentId || !formData.scheduledDate || !formData.duration) {
      return;
    }

    try {
      const result = await findAvailableSlots({
        studentId: formData.studentId,
        date: formData.scheduledDate,
        duration: formData.duration,
        workingHours: { start: '08:00', end: '17:00' },
      });

      if (result.success && result.slots) {
        setAvailableSlots(result.slots);
        setShowAvailableSlots(true);
      }
    } catch (error) {
      console.error('Error finding available slots:', error);
    }
  }, [formData.studentId, formData.scheduledDate, formData.duration]);

  /**
   * Trigger conflict check when relevant fields change
   */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkForConflicts();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [checkForConflicts]);

  /**
   * Handle form field changes
   */
  const handleChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  /**
   * Validate form data
   */
  const validateForm = (): boolean => {
    const result = appointmentCreateSchema.safeParse(formData);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        newErrors[field] = err.message;
      });
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix form errors');
      return;
    }

    if (conflictMessage) {
      toast.error('Please resolve scheduling conflicts');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = appointment
        ? await updateAppointment(appointment.id, formData as any)
        : await createAppointment(formData as any);

      if (result.success && result.data) {
        toast.success(appointment ? 'Appointment updated successfully' : 'Appointment created successfully');
        onSuccess?.(result.data.id);
        router.push(`/appointments/${result.data.id}`);
      } else {
        toast.error(result.error || 'Failed to save appointment');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Student Selection */}
      <div>
        <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
          Student <span className="text-red-500">*</span>
        </label>
        <select
          id="studentId"
          value={formData.studentId}
          onChange={(e) => handleChange('studentId', e.target.value)}
          disabled={!!appointment}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.studentId ? 'border-red-300' : ''
          }`}
        >
          <option value="">Select a student</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name} {student.grade ? `(${student.grade})` : ''}
            </option>
          ))}
        </select>
        {errors.studentId && <p className="mt-1 text-sm text-red-600">{errors.studentId}</p>}
      </div>

      {/* Appointment Type */}
      <div>
        <label htmlFor="appointmentType" className="block text-sm font-medium text-gray-700">
          Appointment Type <span className="text-red-500">*</span>
        </label>
        <select
          id="appointmentType"
          value={formData.appointmentType}
          onChange={(e) => handleChange('appointmentType', e.target.value)}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.appointmentType ? 'border-red-300' : ''
          }`}
        >
          <option value="check-up">Check-up</option>
          <option value="medication">Medication Administration</option>
          <option value="injury">Injury Assessment</option>
          <option value="illness">Illness Evaluation</option>
          <option value="immunization">Immunization</option>
          <option value="follow-up">Follow-up</option>
          <option value="screening">Health Screening</option>
          <option value="consultation">Consultation</option>
          <option value="other">Other</option>
        </select>
        {errors.appointmentType && <p className="mt-1 text-sm text-red-600">{errors.appointmentType}</p>}
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="scheduledDate"
            value={formData.scheduledDate}
            onChange={(e) => handleChange('scheduledDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.scheduledDate ? 'border-red-300' : ''
            }`}
          />
          {errors.scheduledDate && <p className="mt-1 text-sm text-red-600">{errors.scheduledDate}</p>}
        </div>

        <div>
          <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700">
            Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            id="scheduledTime"
            value={formData.scheduledTime}
            onChange={(e) => handleChange('scheduledTime', e.target.value)}
            step="900"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.scheduledTime ? 'border-red-300' : ''
            }`}
          />
          {errors.scheduledTime && <p className="mt-1 text-sm text-red-600">{errors.scheduledTime}</p>}
        </div>
      </div>

      {/* Conflict Warning */}
      {isCheckingConflict && (
        <div className="rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">Checking for conflicts...</p>
            </div>
          </div>
        </div>
      )}

      {conflictMessage && (
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
              <h3 className="text-sm font-medium text-red-800">Scheduling Conflict</h3>
              <p className="mt-1 text-sm text-red-700">{conflictMessage}</p>
              <button
                type="button"
                onClick={findSlots}
                className="mt-2 text-sm font-medium text-red-800 underline hover:text-red-900"
              >
                Find available time slots
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Available Slots */}
      {showAvailableSlots && availableSlots.length > 0 && (
        <div className="rounded-md bg-green-50 p-4">
          <h4 className="text-sm font-medium text-green-800 mb-2">Available Time Slots</h4>
          <div className="flex flex-wrap gap-2">
            {availableSlots.slice(0, 10).map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => {
                  handleChange('scheduledTime', slot);
                  setShowAvailableSlots(false);
                }}
                className="inline-flex items-center rounded-md bg-green-100 px-3 py-1 text-sm font-medium text-green-800 hover:bg-green-200"
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Duration */}
      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
          Duration (minutes) <span className="text-red-500">*</span>
        </label>
        <select
          id="duration"
          value={formData.duration}
          onChange={(e) => handleChange('duration', parseInt(e.target.value))}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.duration ? 'border-red-300' : ''
          }`}
        >
          <option value={15}>15 minutes</option>
          <option value={30}>30 minutes</option>
          <option value={45}>45 minutes</option>
          <option value={60}>1 hour</option>
        </select>
        {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
      </div>

      {/* Priority */}
      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
          Priority
        </label>
        <select
          id="priority"
          value={formData.priority}
          onChange={(e) => handleChange('priority', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      {/* Reason */}
      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
          Reason <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="reason"
          value={formData.reason}
          onChange={(e) => handleChange('reason', e.target.value)}
          placeholder="Brief description of the appointment"
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.reason ? 'border-red-300' : ''
          }`}
        />
        {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason}</p>}
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          id="notes"
          rows={3}
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Additional notes or instructions"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {/* Reminder Settings */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="reminderEnabled"
          checked={formData.reminderEnabled}
          onChange={(e) => handleChange('reminderEnabled', e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="reminderEnabled" className="ml-2 block text-sm text-gray-700">
          Send automated reminders (24 hours and 1 hour before appointment)
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 border-t border-gray-200 pt-6">
        <button
          type="button"
          onClick={onCancel || (() => router.back())}
          disabled={isSubmitting}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !!conflictMessage}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Saving...
            </>
          ) : appointment ? (
            'Update Appointment'
          ) : (
            'Create Appointment'
          )}
        </button>
      </div>
    </form>
  );
}
