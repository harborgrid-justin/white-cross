/**
 * EditIncidentForm Component
 *
 * Form for editing existing incident reports.
 * Pre-populates with existing data and shows modification history.
 *
 * Features:
 * - Pre-populated with existing incident data
 * - "Last modified" timestamp display
 * - Confirmation before save
 * - Field validation
 * - Loading and error states
 * - useUpdateIncident hook integration
 */

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useOptimisticIncidents } from '@/hooks/domains/incidents';
import {
  IncidentType,
  IncidentSeverity,
  type IncidentReport,
  type UpdateIncidentReportRequest
} from '@/types/incidents';
import { useQuery } from '@tanstack/react-query';
import { studentsApi } from '@/services/modules/studentsApi';
import { incidentReportsApi } from '@/services/modules/incidentReportsApi';
import toast from 'react-hot-toast';
import { AlertCircle, Loader2, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface EditIncidentFormProps {
  incidentId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
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
 * EditIncidentForm component - Edit existing incident report
 */
const EditIncidentForm: React.FC<EditIncidentFormProps> = ({
  incidentId,
  onSuccess,
  onCancel,
  className = ''
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { updateIncident, isUpdating } = useOptimisticIncidents();

  // Fetch incident data
  const {
    data: incidentData,
    isLoading: incidentLoading,
    error: incidentError
  } = useQuery({
    queryKey: ['incident', incidentId],
    queryFn: () => incidentReportsApi.getById(incidentId),
    enabled: !!incidentId,
  });

  const incident = incidentData?.report;

  // Fetch students for dropdown
  const { data: studentsData, isLoading: studentsLoading } = useQuery({
    queryKey: ['students', 'list'],
    queryFn: () => studentsApi.getAll({ page: 1, limit: 1000 }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    reset
  } = useForm<IncidentFormData>({
    defaultValues: {
      studentId: '',
      type: IncidentType.OTHER,
      severity: IncidentSeverity.LOW,
      description: '',
      location: '',
      occurredAt: new Date().toISOString().slice(0, 16),
      actionsTaken: '',
      followUpRequired: false,
      followUpNotes: '',
      parentNotified: false,
      parentNotificationMethod: '',
    },
  });

  // Reset form when incident data loads
  useEffect(() => {
    if (incident) {
      reset({
        studentId: incident.studentId || '',
        type: incident.type || IncidentType.OTHER,
        severity: incident.severity || IncidentSeverity.LOW,
        description: incident.description || '',
        location: incident.location || '',
        occurredAt: incident.occurredAt
          ? new Date(incident.occurredAt).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16),
        actionsTaken: incident.actionsTaken || '',
        followUpRequired: incident.followUpRequired || false,
        followUpNotes: incident.followUpNotes || '',
        parentNotified: incident.parentNotified || false,
        parentNotificationMethod: incident.parentNotificationMethod || '',
      });
    }
  }, [incident, reset]);

  const watchFollowUpRequired = watch('followUpRequired');
  const watchParentNotified = watch('parentNotified');

  const onSubmit = async (data: IncidentFormData) => {
    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    try {
      const payload: UpdateIncidentReportRequest = {
        studentId: data.studentId,
        type: data.type,
        severity: data.severity,
        description: data.description,
        location: data.location,
        occurredAt: new Date(data.occurredAt).toISOString(),
        actionsTaken: data.actionsTaken,
        followUpRequired: data.followUpRequired,
        parentNotified: data.parentNotified,
      };

      if (data.followUpRequired && data.followUpNotes) {
        payload.followUpNotes = data.followUpNotes;
      }

      if (data.parentNotified && data.parentNotificationMethod) {
        payload.parentNotificationMethod = data.parentNotificationMethod;
      }

      await updateIncident.mutateAsync({
        id: incidentId,
        data: payload
      });

      toast.success('Incident report updated successfully');
      setShowConfirmation(false);
      onSuccess?.();
    } catch (error: any) {
      console.error('Failed to update incident report:', error);
      toast.error(error.message || 'Failed to update incident report');
      setShowConfirmation(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        onCancel?.();
      }
    } else {
      onCancel?.();
    }
  };

  if (incidentLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <p className="ml-3 text-gray-600">Loading incident report...</p>
      </div>
    );
  }

  if (incidentError || !incident) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mb-3" />
        <p className="text-gray-900 font-medium">Failed to load incident report</p>
        <p className="text-gray-600 text-sm mt-1">Please try again or contact support</p>
      </div>
    );
  }

  return (
    <div className={`edit-incident-form ${className}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Header with Last Modified Info */}
        <div className="border-b border-gray-200 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Edit Incident Report</h3>
              <p className="text-sm text-gray-600 mt-1">
                Update incident report details below
              </p>
            </div>
            {incident.updatedAt && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>
                  Last modified: {format(new Date(incident.updatedAt), 'MMM d, yyyy h:mm a')}
                </span>
              </div>
            )}
          </div>

          {isDirty && (
            <div className="mt-3 flex items-center gap-2 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span>You have unsaved changes</span>
            </div>
          )}
        </div>

        {/* Student Selection */}
        <div>
          <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
            Student <span className="text-red-500">*</span>
          </label>
          <select
            id="studentId"
            {...register('studentId', { required: 'Student selection is required' })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
            disabled={studentsLoading || isUpdating}
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
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Incident Type <span className="text-red-500">*</span>
            </label>
            <select
              id="type"
              {...register('type', { required: 'Incident type is required' })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
              disabled={isUpdating}
            >
              <option value={IncidentType.INJURY}>Injury</option>
              <option value={IncidentType.ILLNESS}>Illness</option>
              <option value={IncidentType.BEHAVIORAL}>Behavioral</option>
              <option value={IncidentType.MEDICATION_ERROR}>Medication Error</option>
              <option value={IncidentType.ALLERGIC_REACTION}>Allergic Reaction</option>
              <option value={IncidentType.EMERGENCY}>Emergency</option>
              <option value={IncidentType.OTHER}>Other</option>
            </select>
            {errors.type && <p className="text-red-600 text-sm mt-1">{errors.type.message}</p>}
          </div>

          <div>
            <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
              Severity <span className="text-red-500">*</span>
            </label>
            <select
              id="severity"
              {...register('severity', { required: 'Severity is required' })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
              disabled={isUpdating}
            >
              <option value={IncidentSeverity.LOW}>Low</option>
              <option value={IncidentSeverity.MEDIUM}>Medium</option>
              <option value={IncidentSeverity.HIGH}>High</option>
              <option value={IncidentSeverity.CRITICAL}>Critical</option>
            </select>
            {errors.severity && <p className="text-red-600 text-sm mt-1">{errors.severity.message}</p>}
          </div>
        </div>

        {/* Location and Date/Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              id="location"
              type="text"
              {...register('location', { required: 'Location is required' })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
              placeholder="e.g., Playground, Cafeteria"
              disabled={isUpdating}
            />
            {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location.message}</p>}
          </div>

          <div>
            <label htmlFor="occurredAt" className="block text-sm font-medium text-gray-700 mb-1">
              Date & Time <span className="text-red-500">*</span>
            </label>
            <input
              id="occurredAt"
              type="datetime-local"
              {...register('occurredAt', { required: 'Date and time is required' })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
              disabled={isUpdating}
            />
            {errors.occurredAt && <p className="text-red-600 text-sm mt-1">{errors.occurredAt.message}</p>}
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
            disabled={isUpdating}
          />
          {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
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
            disabled={isUpdating}
          />
          {errors.actionsTaken && <p className="text-red-600 text-sm mt-1">{errors.actionsTaken.message}</p>}
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
                disabled={isUpdating}
              />
            </div>
            <div className="ml-3">
              <label htmlFor="followUpRequired" className="text-sm font-medium text-gray-700">
                Follow-up Required
              </label>
              <p className="text-xs text-gray-500">Check if this incident requires follow-up actions</p>
            </div>
          </div>
        </div>

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
              placeholder="Enter follow-up instructions..."
              disabled={isUpdating}
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
                disabled={isUpdating}
              />
            </div>
            <div className="ml-3">
              <label htmlFor="parentNotified" className="text-sm font-medium text-gray-700">
                Parent/Guardian Notified
              </label>
              <p className="text-xs text-gray-500">Check if parent has been notified</p>
            </div>
          </div>
        </div>

        {watchParentNotified && (
          <div className="pl-7">
            <label htmlFor="parentNotificationMethod" className="block text-sm font-medium text-gray-700 mb-1">
              Notification Method
            </label>
            <select
              id="parentNotificationMethod"
              {...register('parentNotificationMethod')}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
              disabled={isUpdating}
            >
              <option value="">Select method...</option>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="voice">Phone Call</option>
              <option value="in-person">In Person</option>
            </select>
          </div>
        )}

        {/* Confirmation Message */}
        {showConfirmation && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-yellow-900">Confirm Update</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Are you sure you want to save these changes to the incident report?
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          {showConfirmation && (
            <button
              type="button"
              onClick={() => setShowConfirmation(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isUpdating}
            >
              No, Go Back
            </button>
          )}
          {!showConfirmation && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isUpdating}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={isUpdating || (!isDirty && !showConfirmation)}
          >
            {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
            {showConfirmation
              ? (isUpdating ? 'Updating...' : 'Yes, Update')
              : 'Update Report'
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditIncidentForm;
