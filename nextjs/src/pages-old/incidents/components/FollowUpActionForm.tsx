/**
 * FollowUpActionForm Component
 *
 * Form for creating or editing follow-up actions.
 * Features React Hook Form integration, Zod validation, and user assignment.
 */

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/inputs/Input';
import { Textarea } from '@/components/ui/inputs/Textarea';
import { Select } from '@/components/ui/inputs/Select';
import { Button } from '@/components/ui/buttons/Button';
import { Alert } from '@/components/ui/feedback/Alert';
import { useFollowUpActions } from '@/hooks/domains/incidents/FollowUpActionContext';
import { ActionStatus, ActionPriority, type FollowUpAction } from '@/types/incidents';
import { createFollowUpActionSchema, updateFollowUpActionSchema } from '@/validation/incidentReportValidation';
import { format } from 'date-fns';

interface FollowUpActionFormProps {
  incidentId: string;
  action?: FollowUpAction | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

// Form data type based on create/update scenarios
type FollowUpActionFormData = {
  action: string;
  dueDate: string;
  priority: ActionPriority;
  assignedTo?: string;
  status?: ActionStatus;
  notes?: string;
};

/**
 * FollowUpActionForm component - Create/edit follow-up action form
 */
const FollowUpActionForm: React.FC<FollowUpActionFormProps> = ({
  incidentId,
  action: existingAction,
  onSuccess,
  onCancel,
}) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [availableUsers, setAvailableUsers] = useState<Array<{ value: string; label: string }>>([]);

  const { createFollowUpAction, updateFollowUpAction, isCreating, isUpdating } = useFollowUpActions();

  const isEditMode = !!existingAction;
  const isSubmitting = isCreating || isUpdating;

  // Create schema based on mode
  const formSchema = isEditMode
    ? z.object({
        action: z.string().min(10, 'Action must be at least 10 characters').max(500, 'Action cannot exceed 500 characters'),
        dueDate: z.string().min(1, 'Due date is required'),
        priority: z.nativeEnum(ActionPriority),
        assignedTo: z.string().optional(),
        status: z.nativeEnum(ActionStatus).optional(),
        notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
      })
    : z.object({
        action: z.string().min(10, 'Action must be at least 10 characters').max(500, 'Action cannot exceed 500 characters'),
        dueDate: z.string().refine((val) => {
          const date = new Date(val);
          return date > new Date();
        }, 'Due date must be in the future'),
        priority: z.nativeEnum(ActionPriority),
        assignedTo: z.string().optional(),
      });

  // Initialize form with react-hook-form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<FollowUpActionFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: existingAction
      ? {
          action: existingAction.action,
          dueDate: format(new Date(existingAction.dueDate), 'yyyy-MM-dd'),
          priority: existingAction.priority,
          assignedTo: existingAction.assignedTo || '',
          status: existingAction.status,
          notes: existingAction.notes || '',
        }
      : {
          action: '',
          dueDate: format(new Date(Date.now() + 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), // Tomorrow
          priority: ActionPriority.MEDIUM,
          assignedTo: '',
          status: ActionStatus.PENDING,
          notes: '',
        },
  });

  const selectedPriority = watch('priority');

  // Load available users (mock data - replace with actual API call)
  useEffect(() => {
    // TODO: Replace with actual API call to fetch users
    const mockUsers = [
      { value: 'user-1', label: 'John Smith (Nurse)' },
      { value: 'user-2', label: 'Jane Doe (Admin)' },
      { value: 'user-3', label: 'Mike Johnson (Nurse)' },
    ];
    setAvailableUsers(mockUsers);
  }, []);

  // Show priority warning for URGENT
  useEffect(() => {
    if (selectedPriority === ActionPriority.URGENT) {
      console.info('URGENT priority actions should typically be due within 24 hours');
    }
  }, [selectedPriority]);

  const onSubmit = async (data: FollowUpActionFormData) => {
    try {
      setSubmitError(null);

      if (isEditMode && existingAction) {
        // Update existing action
        await updateFollowUpAction(existingAction.id, {
          action: data.action,
          dueDate: data.dueDate,
          priority: data.priority,
          assignedTo: data.assignedTo || undefined,
          status: data.status,
          notes: data.notes || undefined,
        });
      } else {
        // Create new action
        await createFollowUpAction({
          incidentReportId: incidentId,
          action: data.action,
          dueDate: data.dueDate,
          priority: data.priority,
          assignedTo: data.assignedTo || undefined,
        });
      }

      // Reset form and call success callback
      reset();
      onSuccess?.();
    } catch (error: any) {
      console.error('Failed to save follow-up action:', error);
      setSubmitError(error.message || 'Failed to save follow-up action. Please try again.');
    }
  };

  const handleCancel = () => {
    reset();
    onCancel?.();
  };

  // Priority options
  const priorityOptions = [
    { value: ActionPriority.LOW, label: 'Low' },
    { value: ActionPriority.MEDIUM, label: 'Medium' },
    { value: ActionPriority.HIGH, label: 'High' },
    { value: ActionPriority.URGENT, label: 'Urgent' },
  ];

  // Status options (for edit mode)
  const statusOptions = [
    { value: ActionStatus.PENDING, label: 'Pending' },
    { value: ActionStatus.IN_PROGRESS, label: 'In Progress' },
    { value: ActionStatus.COMPLETED, label: 'Completed' },
    { value: ActionStatus.CANCELLED, label: 'Cancelled' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Error Alert */}
      {submitError && (
        <Alert variant="error" title="Submission Error">
          {submitError}
        </Alert>
      )}

      {/* Action Description */}
      <div>
        <label htmlFor="action" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Action Description <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="action"
          {...register('action')}
          placeholder="Describe the follow-up action required..."
          rows={3}
          error={errors.action?.message}
          disabled={isSubmitting}
        />
        {errors.action && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.action.message}</p>
        )}
      </div>

      {/* Priority and Due Date Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Priority */}
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Priority <span className="text-red-500">*</span>
          </label>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select
                options={priorityOptions}
                value={field.value}
                onChange={(value) => field.onChange(value)}
                placeholder="Select priority"
                disabled={isSubmitting}
              />
            )}
          />
          {errors.priority && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.priority.message}</p>
          )}
          {selectedPriority === ActionPriority.URGENT && (
            <p className="mt-1 text-sm text-orange-600 dark:text-orange-400">
              Note: URGENT actions typically should be due within 24 hours
            </p>
          )}
        </div>

        {/* Due Date */}
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Due Date <span className="text-red-500">*</span>
          </label>
          <Input
            id="dueDate"
            type="date"
            {...register('dueDate')}
            error={errors.dueDate?.message}
            disabled={isSubmitting}
          />
          {errors.dueDate && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.dueDate.message}</p>
          )}
        </div>
      </div>

      {/* Assigned To and Status Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Assigned To */}
        <div>
          <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Assign To
          </label>
          <Controller
            name="assignedTo"
            control={control}
            render={({ field }) => (
              <Select
                options={availableUsers}
                value={field.value || ''}
                onChange={(value) => field.onChange(value)}
                placeholder="Select user (optional)"
                clearable
                disabled={isSubmitting}
              />
            )}
          />
          {errors.assignedTo && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.assignedTo.message}</p>
          )}
        </div>

        {/* Status (Edit Mode Only) */}
        {isEditMode && (
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  options={statusOptions}
                  value={field.value || ActionStatus.PENDING}
                  onChange={(value) => field.onChange(value)}
                  placeholder="Select status"
                  disabled={isSubmitting}
                />
              )}
            />
            {errors.status && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.status.message}</p>
            )}
          </div>
        )}
      </div>

      {/* Notes (Edit Mode Only) */}
      {isEditMode && (
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notes
          </label>
          <Textarea
            id="notes"
            {...register('notes')}
            placeholder="Add any additional notes or updates..."
            rows={3}
            error={errors.notes?.message}
            disabled={isSubmitting}
          />
          {errors.notes && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.notes.message}</p>
          )}
        </div>
      )}

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="secondary"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </>
          ) : (
            <>{isEditMode ? 'Update Action' : 'Create Action'}</>
          )}
        </Button>
      </div>
    </form>
  );
};

export default FollowUpActionForm;
