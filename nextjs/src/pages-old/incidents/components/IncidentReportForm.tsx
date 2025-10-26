/**
 * IncidentReportForm Component
 *
 * Complete incident report form with all fields, validation, and submission.
 * Used for creating new incidents or updating existing ones.
 *
 * Features:
 * - Full field coverage (type, severity, location, description, etc.)
 * - Student selection dropdown
 * - Date/time pickers
 * - Text areas for detailed descriptions
 * - Checkboxes for follow-up and parent notification
 * - React Hook Form validation
 * - Loading and error states
 * - Toast notifications
 */

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useOptimisticIncidents } from '@/hooks/domains/incidents';
import {
  IncidentType,
  IncidentSeverity,
  type IncidentReport,
  type CreateIncidentReportRequest
} from '@/types/incidents';
import { useQuery } from '@tanstack/react-query';
import { studentsApi } from '@/services/modules/studentsApi';
import toast from 'react-hot-toast';
import { AlertCircle, Loader2 } from 'lucide-react';

interface IncidentReportFormProps {
  incident?: IncidentReport;
  onSuccess?: () => void;
  className?: string;
}

interface IncidentFormData {
  studentId: string;
  type: IncidentType;
  severity: IncidentSeverity;
  description: string;
  location: string;
  occurredAt: string;
  actionsTaken: string;
  followUpRequired: boolean;
  followUpNotes?: string;
  parentNotified: boolean;
  parentNotificationMethod?: string;
}

/**
 * IncidentReportForm component - Complete incident report form
 */
const IncidentReportForm: React.FC<IncidentReportFormProps> = ({
  incident,
  onSuccess,
  className = ''
}) => {
  const isEditMode = !!incident;
  const { createIncident, updateIncident, isCreating, isUpdating } = useOptimisticIncidents();

  // Fetch students for dropdown
  const { data: studentsData, isLoading: studentsLoading } = useQuery({
    queryKey: ['students', 'list'],
    queryFn: () => studentsApi.getAll({ page: 1, limit: 1000 }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
    setValue
  } = useForm<IncidentFormData>({
    defaultValues: {
      studentId: incident?.studentId || '',
      type: incident?.type || IncidentType.OTHER,
      severity: incident?.severity || IncidentSeverity.LOW,
      description: incident?.description || '',
      location: incident?.location || '',
      occurredAt: incident?.occurredAt
        ? new Date(incident.occurredAt).toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16),
      actionsTaken: incident?.actionsTaken || '',
      followUpRequired: incident?.followUpRequired || false,
      followUpNotes: incident?.followUpNotes || '',
      parentNotified: incident?.parentNotified || false,
      parentNotificationMethod: incident?.parentNotificationMethod || '',
    },
  });

  const watchFollowUpRequired = watch('followUpRequired');
  const watchParentNotified = watch('parentNotified');

  const onSubmit = async (data: IncidentFormData) => {
    try {
      const payload: any = {
        studentId: data.studentId,
        type: data.type,
        severity: data.severity,
        description: data.description,
        location: data.location,
        occurredAt: new Date(data.occurredAt).toISOString(),
        actionsTaken: data.actionsTaken,
        followUpRequired: data.followUpRequired,
        parentNotified: data.parentNotified,
        reportedById: 'current-user-id', // Replace with actual user ID from auth context
      };

      if (data.followUpRequired && data.followUpNotes) {
        payload.followUpNotes = data.followUpNotes;
      }

      if (data.parentNotified && data.parentNotificationMethod) {
        payload.parentNotificationMethod = data.parentNotificationMethod;
      }

      if (isEditMode && incident) {
        await updateIncident.mutateAsync({
          id: incident.id,
          data: payload
        });
        toast.success('Incident report updated successfully');
      } else {
        await createIncident.mutateAsync(payload);
        toast.success('Incident report created successfully');
        reset();
      }

      onSuccess?.();
    } catch (error: any) {
      console.error('Failed to save incident report:', error);
      toast.error(error.message || 'Failed to save incident report');
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <div className={`incident-report-form ${className}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditMode ? 'Edit Incident Report' : 'New Incident Report'}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {isEditMode
              ? 'Update the incident report details below'
              : 'Complete all required fields to create a new incident report'
            }
          </p>
        </div>

        {/* Student Selection */}
        <div>
          <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
            Student <span className="text-red-500">*</span>
          </label>
          <select
            id="studentId"
            {...register('studentId', { required: 'Student selection is required' })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={studentsLoading || isSubmitting}
          >
            <option value="">Select a student...</option>
            {studentsData?.students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.firstName} {student.lastName} - {student.gradeLevel}
              </option>
            ))}
          </select>
          {errors.studentId && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.studentId.message}
            </p>
          )}
        </div>

        {/* Incident Type and Severity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Incident Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Incident Type <span className="text-red-500">*</span>
            </label>
            <select
              id="type"
              {...register('type', { required: 'Incident type is required' })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
              disabled={isSubmitting}
            >
              <option value={IncidentType.INJURY}>Injury</option>
              <option value={IncidentType.ILLNESS}>Illness</option>
              <option value={IncidentType.BEHAVIORAL}>Behavioral</option>
              <option value={IncidentType.MEDICATION_ERROR}>Medication Error</option>
              <option value={IncidentType.ALLERGIC_REACTION}>Allergic Reaction</option>
              <option value={IncidentType.EMERGENCY}>Emergency</option>
              <option value={IncidentType.OTHER}>Other</option>
            </select>
            {errors.type && (
              <p className="text-red-600 text-sm mt-1">{errors.type.message}</p>
            )}
          </div>

          {/* Severity */}
          <div>
            <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
              Severity <span className="text-red-500">*</span>
            </label>
            <select
              id="severity"
              {...register('severity', { required: 'Severity is required' })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
              disabled={isSubmitting}
            >
              <option value={IncidentSeverity.LOW}>Low</option>
              <option value={IncidentSeverity.MEDIUM}>Medium</option>
              <option value={IncidentSeverity.HIGH}>High</option>
              <option value={IncidentSeverity.CRITICAL}>Critical</option>
            </select>
            {errors.severity && (
              <p className="text-red-600 text-sm mt-1">{errors.severity.message}</p>
            )}
          </div>
        </div>

        {/* Location and Date/Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              id="location"
              type="text"
              {...register('location', { required: 'Location is required' })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
              placeholder="e.g., Playground, Cafeteria, Classroom 101"
              disabled={isSubmitting}
            />
            {errors.location && (
              <p className="text-red-600 text-sm mt-1">{errors.location.message}</p>
            )}
          </div>

          {/* Occurred At */}
          <div>
            <label htmlFor="occurredAt" className="block text-sm font-medium text-gray-700 mb-1">
              Date & Time <span className="text-red-500">*</span>
            </label>
            <input
              id="occurredAt"
              type="datetime-local"
              {...register('occurredAt', { required: 'Date and time is required' })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
              disabled={isSubmitting}
            />
            {errors.occurredAt && (
              <p className="text-red-600 text-sm mt-1">{errors.occurredAt.message}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Incident Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            {...register('description', {
              required: 'Description is required',
              minLength: { value: 10, message: 'Description must be at least 10 characters' }
            })}
            rows={4}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
            placeholder="Provide detailed description of what happened..."
            disabled={isSubmitting}
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Actions Taken */}
        <div>
          <label htmlFor="actionsTaken" className="block text-sm font-medium text-gray-700 mb-1">
            Actions Taken <span className="text-red-500">*</span>
          </label>
          <textarea
            id="actionsTaken"
            {...register('actionsTaken', {
              required: 'Actions taken is required',
              minLength: { value: 10, message: 'Actions taken must be at least 10 characters' }
            })}
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
            placeholder="Describe immediate actions taken..."
            disabled={isSubmitting}
          />
          {errors.actionsTaken && (
            <p className="text-red-600 text-sm mt-1">{errors.actionsTaken.message}</p>
          )}
        </div>

        {/* Follow-up Required */}
        <div>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="followUpRequired"
                type="checkbox"
                {...register('followUpRequired')}
                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 disabled:bg-gray-100"
                disabled={isSubmitting}
              />
            </div>
            <div className="ml-3">
              <label htmlFor="followUpRequired" className="text-sm font-medium text-gray-700">
                Follow-up Required
              </label>
              <p className="text-xs text-gray-500">
                Check if this incident requires follow-up actions or monitoring
              </p>
            </div>
          </div>
        </div>

        {/* Follow-up Notes (conditional) */}
        {watchFollowUpRequired && (
          <div className="pl-7">
            <label htmlFor="followUpNotes" className="block text-sm font-medium text-gray-700 mb-1">
              Follow-up Notes
            </label>
            <textarea
              id="followUpNotes"
              {...register('followUpNotes')}
              rows={2}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
              placeholder="Enter follow-up instructions or notes..."
              disabled={isSubmitting}
            />
          </div>
        )}

        {/* Parent Notified */}
        <div>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="parentNotified"
                type="checkbox"
                {...register('parentNotified')}
                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 disabled:bg-gray-100"
                disabled={isSubmitting}
              />
            </div>
            <div className="ml-3">
              <label htmlFor="parentNotified" className="text-sm font-medium text-gray-700">
                Parent/Guardian Notified
              </label>
              <p className="text-xs text-gray-500">
                Check if parent or guardian has been notified about this incident
              </p>
            </div>
          </div>
        </div>

        {/* Parent Notification Method (conditional) */}
        {watchParentNotified && (
          <div className="pl-7">
            <label htmlFor="parentNotificationMethod" className="block text-sm font-medium text-gray-700 mb-1">
              Notification Method
            </label>
            <select
              id="parentNotificationMethod"
              {...register('parentNotificationMethod')}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
              disabled={isSubmitting}
            >
              <option value="">Select method...</option>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="voice">Phone Call</option>
              <option value="in-person">In Person</option>
            </select>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting || !isDirty}
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting
              ? (isEditMode ? 'Updating...' : 'Creating...')
              : (isEditMode ? 'Update Report' : 'Create Report')
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default IncidentReportForm;
