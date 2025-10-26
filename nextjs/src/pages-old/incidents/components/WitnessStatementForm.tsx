/**
 * WitnessStatementForm Component
 *
 * Form component for creating or editing witness statements with validation.
 * Uses React Hook Form for form state management and validation.
 *
 * Features:
 * - Create new witness statements
 * - Edit existing witness statements
 * - Form validation with error messages
 * - Witness type selection
 * - Optional contact information
 * - Auto-save draft functionality (optional)
 * - Accessibility support
 * - Loading and submission states
 */

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useWitnessStatements } from '@/hooks/domains/incidents';
import { Input } from '@/components/ui/inputs/Input';
import { Textarea } from '@/components/ui/inputs/Textarea';
import { Select, type SelectOption } from '@/components/ui/inputs/Select';
import { Button } from '@/components/ui/buttons/Button';
import { Alert } from '@/components/ui/feedback/Alert';
import { Save, X } from 'lucide-react';
import type { WitnessStatement, WitnessType, WitnessStatementFormData } from '@/types/incidents';

interface WitnessStatementFormProps {
  /** Incident report ID for new statements */
  incidentId: string;
  /** Existing statement to edit (optional) */
  statement?: WitnessStatement;
  /** Success callback */
  onSuccess?: () => void;
  /** Cancel callback */
  onCancel?: () => void;
  /** Optional CSS class name */
  className?: string;
}

// Witness type options for select dropdown
const witnessTypeOptions: SelectOption[] = [
  { value: 'STUDENT', label: 'Student' },
  { value: 'STAFF', label: 'Staff Member' },
  { value: 'PARENT', label: 'Parent/Guardian' },
  { value: 'OTHER', label: 'Other' }
];

// Form validation rules
const validationRules = {
  witnessName: {
    required: 'Witness name is required',
    minLength: {
      value: 2,
      message: 'Name must be at least 2 characters'
    },
    maxLength: {
      value: 100,
      message: 'Name must not exceed 100 characters'
    }
  },
  witnessType: {
    required: 'Witness type is required'
  },
  witnessContact: {
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$|^\+?[\d\s\-()]+$/,
      message: 'Please enter a valid email address or phone number'
    },
    maxLength: {
      value: 100,
      message: 'Contact must not exceed 100 characters'
    }
  },
  statement: {
    required: 'Statement is required',
    minLength: {
      value: 10,
      message: 'Statement must be at least 10 characters'
    },
    maxLength: {
      value: 5000,
      message: 'Statement must not exceed 5000 characters'
    }
  }
};

/**
 * WitnessStatementForm component - Create/Edit witness statement form
 */
const WitnessStatementForm: React.FC<WitnessStatementFormProps> = ({
  incidentId,
  statement,
  onSuccess,
  onCancel,
  className = ''
}) => {
  const { createWitnessStatement, updateWitnessStatement, operationLoading } = useWitnessStatements();

  const isEditMode = !!statement;
  const isSubmitting = operationLoading.create || operationLoading.update;

  // Initialize form with react-hook-form
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch
  } = useForm<WitnessStatementFormData>({
    defaultValues: statement ? {
      witnessName: statement.witnessName,
      witnessType: statement.witnessType,
      witnessContact: statement.witnessContact || '',
      statement: statement.statement
    } : {
      witnessName: '',
      witnessType: 'STUDENT' as WitnessType,
      witnessContact: '',
      statement: ''
    }
  });

  // Watch statement field for character count
  const statementValue = watch('statement');
  const statementLength = statementValue?.length || 0;

  // Reset form when statement prop changes
  useEffect(() => {
    if (statement) {
      reset({
        witnessName: statement.witnessName,
        witnessType: statement.witnessType,
        witnessContact: statement.witnessContact || '',
        statement: statement.statement
      });
    }
  }, [statement, reset]);

  // Handle form submission
  const onSubmit = async (data: WitnessStatementFormData) => {
    try {
      if (isEditMode && statement) {
        // Update existing statement
        await updateWitnessStatement(statement.id, data);
      } else {
        // Create new statement
        await createWitnessStatement({
          incidentReportId: incidentId,
          ...data
        });
      }

      // Reset form and call success callback
      if (!isEditMode) {
        reset();
      }
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save witness statement:', error);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        reset();
        onCancel?.();
      }
    } else {
      onCancel?.();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`witness-statement-form ${className}`}>
      <div className="space-y-4">
        {/* Witness Name */}
        <div>
          <Input
            {...register('witnessName', validationRules.witnessName)}
            label="Witness Name"
            placeholder="Enter full name"
            error={errors.witnessName?.message}
            required
            disabled={isSubmitting}
            autoComplete="name"
          />
        </div>

        {/* Witness Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Witness Type <span className="text-danger-500">*</span>
          </label>
          <Controller
            name="witnessType"
            control={control}
            rules={validationRules.witnessType}
            render={({ field }) => (
              <Select
                options={witnessTypeOptions}
                value={field.value}
                onChange={(value) => field.onChange(value)}
                placeholder="Select witness type"
                error={errors.witnessType?.message}
                disabled={isSubmitting}
              />
            )}
          />
        </div>

        {/* Contact Information (Optional) */}
        <div>
          <Input
            {...register('witnessContact', validationRules.witnessContact)}
            label="Contact Information"
            placeholder="Email or phone number (optional)"
            error={errors.witnessContact?.message}
            helperText="Provide email or phone number for follow-up if needed"
            disabled={isSubmitting}
            autoComplete="email tel"
          />
        </div>

        {/* Statement */}
        <div>
          <Textarea
            {...register('statement', validationRules.statement)}
            label="Witness Statement"
            placeholder="Enter detailed statement of what the witness observed..."
            error={errors.statement?.message}
            helperText="Provide a detailed account of what was witnessed"
            required
            disabled={isSubmitting}
            rows={6}
            maxLength={5000}
            showCharCount
            autoResize
            minRows={6}
            maxRows={15}
          />
          <div className="flex justify-end mt-1">
            <span className={`text-xs ${
              statementLength > 4500 ? 'text-warning-600' :
              statementLength > 4900 ? 'text-danger-600' :
              'text-gray-500'
            }`}>
              {statementLength} / 5000 characters
            </span>
          </div>
        </div>

        {/* Info Alert for PHI/PII */}
        <Alert variant="info" size="sm">
          <p className="text-sm">
            <strong>Note:</strong> Witness statements may contain Protected Health Information (PHI) or
            Personally Identifiable Information (PII). Ensure proper handling and access controls are maintained.
          </p>
        </Alert>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              icon={<X className="h-4 w-4" />}
              iconPosition="left"
            >
              Cancel
            </Button>
          )}

          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            disabled={isSubmitting || !isDirty}
            icon={<Save className="h-4 w-4" />}
            iconPosition="left"
          >
            {isEditMode ? 'Update Statement' : 'Save Statement'}
          </Button>
        </div>
      </div>
    </form>
  );
};

WitnessStatementForm.displayName = 'WitnessStatementForm';

export default WitnessStatementForm;
