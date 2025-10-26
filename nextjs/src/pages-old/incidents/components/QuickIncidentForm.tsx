/**
 * QuickIncidentForm Component
 *
 * Compact modal form for quick incident entry.
 * Provides essential fields for fast incident reporting.
 *
 * Features:
 * - Minimal fields for quick entry
 * - Student, type, severity, brief description
 * - Optional location, date/time (defaults to now)
 * - Compact modal design
 * - Pre-filled with studentId if provided
 * - Fast submission with toast feedback
 */

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useOptimisticIncidents } from '@/hooks/domains/incidents';
import {
  IncidentType,
  IncidentSeverity,
  type CreateIncidentReportRequest
} from '@/types/incidents';
import { useQuery } from '@tanstack/react-query';
import { studentsApi } from '@/services/modules/studentsApi';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalTitle } from '@/components/ui/overlays/Modal';
import toast from 'react-hot-toast';
import { AlertCircle, Loader2, Zap } from 'lucide-react';

interface QuickIncidentFormProps {
  isOpen: boolean;
  onClose: () => void;
  studentId?: string;
  className?: string;
}

interface QuickIncidentFormData {
  studentId: string;
  type: IncidentType;
  severity: IncidentSeverity;
  description: string;
  location?: string;
  occurredAt?: string;
}

/**
 * QuickIncidentForm component - Quick modal form for fast incident entry
 */
const QuickIncidentForm: React.FC<QuickIncidentFormProps> = ({
  isOpen,
  onClose,
  studentId,
  className = ''
}) => {
  const { createIncident, isCreating } = useOptimisticIncidents();

  // Fetch students for dropdown
  const { data: studentsData, isLoading: studentsLoading } = useQuery({
    queryKey: ['students', 'list'],
    queryFn: () => studentsApi.getAll({ page: 1, limit: 1000 }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<QuickIncidentFormData>({
    defaultValues: {
      studentId: studentId || '',
      type: IncidentType.OTHER,
      severity: IncidentSeverity.LOW,
      description: '',
      location: '',
      occurredAt: new Date().toISOString().slice(0, 16),
    },
  });

  // Set student if provided
  useEffect(() => {
    if (studentId) {
      setValue('studentId', studentId);
    }
  }, [studentId, setValue]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset({
        studentId: studentId || '',
        type: IncidentType.OTHER,
        severity: IncidentSeverity.LOW,
        description: '',
        location: '',
        occurredAt: new Date().toISOString().slice(0, 16),
      });
    }
  }, [isOpen, reset, studentId]);

  const onSubmit = async (data: QuickIncidentFormData) => {
    try {
      const payload: CreateIncidentReportRequest = {
        studentId: data.studentId,
        type: data.type,
        severity: data.severity,
        description: data.description,
        location: data.location || 'Not specified',
        occurredAt: data.occurredAt
          ? new Date(data.occurredAt).toISOString()
          : new Date().toISOString(),
        actionsTaken: 'Quick report - details to be added',
        followUpRequired: false,
        parentNotified: false,
        reportedById: 'current-user-id', // Replace with actual user ID from auth
      };

      await createIncident.mutateAsync(payload);

      toast.success('Quick incident report created successfully');
      reset();
      onClose();
    } catch (error: any) {
      console.error('Failed to create quick incident report:', error);
      toast.error(error.message || 'Failed to create incident report');
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      reset();
      onClose();
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      size="md"
      closeOnBackdropClick={!isCreating}
      className={className}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>
          <ModalTitle>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span>Quick Incident Report</span>
            </div>
          </ModalTitle>
        </ModalHeader>

        <ModalBody>
          <div className="space-y-4">
            {/* Student Selection */}
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
                Student <span className="text-red-500">*</span>
              </label>
              <select
                id="studentId"
                {...register('studentId', { required: 'Student selection is required' })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                disabled={studentsLoading || isCreating || !!studentId}
              >
                <option value="">Select a student...</option>
                {studentsData?.students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.firstName} {student.lastName}
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

            {/* Type and Severity */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="type"
                  {...register('type', { required: 'Type is required' })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                  disabled={isCreating}
                >
                  <option value={IncidentType.INJURY}>Injury</option>
                  <option value={IncidentType.ILLNESS}>Illness</option>
                  <option value={IncidentType.BEHAVIORAL}>Behavioral</option>
                  <option value={IncidentType.MEDICATION_ERROR}>Med Error</option>
                  <option value={IncidentType.ALLERGIC_REACTION}>Allergic</option>
                  <option value={IncidentType.EMERGENCY}>Emergency</option>
                  <option value={IncidentType.OTHER}>Other</option>
                </select>
                {errors.type && <p className="text-red-600 text-xs mt-1">{errors.type.message}</p>}
              </div>

              <div>
                <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
                  Severity <span className="text-red-500">*</span>
                </label>
                <select
                  id="severity"
                  {...register('severity', { required: 'Severity is required' })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                  disabled={isCreating}
                >
                  <option value={IncidentSeverity.LOW}>Low</option>
                  <option value={IncidentSeverity.MEDIUM}>Medium</option>
                  <option value={IncidentSeverity.HIGH}>High</option>
                  <option value={IncidentSeverity.CRITICAL}>Critical</option>
                </select>
                {errors.severity && <p className="text-red-600 text-xs mt-1">{errors.severity.message}</p>}
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Brief Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                {...register('description', {
                  required: 'Description is required',
                  minLength: { value: 10, message: 'Description must be at least 10 characters' }
                })}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                placeholder="Quick summary of what happened..."
                disabled={isCreating}
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* Optional: Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location <span className="text-gray-400">(optional)</span>
              </label>
              <input
                id="location"
                type="text"
                {...register('location')}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                placeholder="e.g., Playground, Classroom"
                disabled={isCreating}
              />
            </div>

            {/* Optional: Date/Time */}
            <div>
              <label htmlFor="occurredAt" className="block text-sm font-medium text-gray-700 mb-1">
                Date & Time <span className="text-gray-400">(defaults to now)</span>
              </label>
              <input
                id="occurredAt"
                type="datetime-local"
                {...register('occurredAt')}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                disabled={isCreating}
              />
            </div>

            {/* Info Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> This creates a quick incident report. You can add more details later
                by editing the full report.
              </p>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
            disabled={isCreating}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={isCreating}
          >
            {isCreating && <Loader2 className="h-4 w-4 animate-spin" />}
            {isCreating ? 'Creating...' : 'Create Quick Report'}
          </button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default QuickIncidentForm;
