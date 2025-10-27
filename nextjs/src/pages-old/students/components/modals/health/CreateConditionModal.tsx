/**
 * Create Chronic Condition Modal Component
 * Modal for adding new chronic conditions with comprehensive care planning
 */

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalTitle } from '@/components/ui/overlays/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import { useCreateCondition } from '@/hooks/domains/health-records/useHealthRecords';
import { SEVERITY_LEVELS, CONDITION_STATUS_OPTIONS } from '@/constants/healthRecords';
import type { ConditionStatus, ConditionSeverity } from '@/types/healthRecords';

interface CreateConditionModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
}

interface ConditionFormData {
  condition: string;
  icdCode?: string;
  diagnosisDate: string;
  severity: ConditionSeverity;
  status: ConditionStatus;
  treatments?: string;
  accommodationsRequired: boolean;
  accommodationDetails?: string;
  emergencyProtocol?: string;
  actionPlan?: string;
  triggers?: string;
  notes?: string;
}

export const CreateConditionModal: React.FC<CreateConditionModalProps> = ({
  isOpen,
  onClose,
  studentId,
}) => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<ConditionFormData>({
    defaultValues: {
      accommodationsRequired: false,
      diagnosisDate: new Date().toISOString().split('T')[0],
    },
  });

  const createMutation = useCreateCondition();
  const accommodationsRequired = watch('accommodationsRequired');

  const onSubmit = async (data: ConditionFormData) => {
    try {
      await createMutation.mutateAsync({
        studentId,
        condition: data.condition,
        icdCode: data.icdCode,
        diagnosisDate: data.diagnosisDate,
        severity: data.severity as any,
        status: data.status as any,
        treatments: data.treatments ? [data.treatments] : undefined,
        notes: data.notes,
      });
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to create chronic condition:', error);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  return (
    <Modal open={isOpen} onClose={onClose} size="xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>
          <ModalTitle>Add New Chronic Condition</ModalTitle>
        </ModalHeader>

        <ModalBody>
          <div className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">
            {/* Condition */}
            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                Condition <span className="text-red-500">*</span>
              </label>
              <Input
                id="condition"
                {...register('condition', { required: 'Condition is required' })}
                placeholder="e.g., Type 1 Diabetes, Asthma"
              />
              {errors.condition && (
                <p className="text-red-600 text-sm mt-1">{errors.condition.message}</p>
              )}
            </div>

            {/* ICD Code */}
            <div>
              <label htmlFor="icdCode" className="block text-sm font-medium text-gray-700 mb-1">
                ICD-10 Code
              </label>
              <Input
                id="icdCode"
                {...register('icdCode')}
                placeholder="e.g., E10.9, J45.909"
              />
            </div>

            {/* Diagnosis Date */}
            <div>
              <label htmlFor="diagnosisDate" className="block text-sm font-medium text-gray-700 mb-1">
                Diagnosis Date <span className="text-red-500">*</span>
              </label>
              <Input
                id="diagnosisDate"
                type="date"
                {...register('diagnosisDate', { required: 'Diagnosis date is required' })}
              />
              {errors.diagnosisDate && (
                <p className="text-red-600 text-sm mt-1">{errors.diagnosisDate.message}</p>
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
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select severity</option>
                {SEVERITY_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              {errors.severity && (
                <p className="text-red-600 text-sm mt-1">{errors.severity.message}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                {...register('status', { required: 'Status is required' })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select status</option>
                {CONDITION_STATUS_OPTIONS.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="text-red-600 text-sm mt-1">{errors.status.message}</p>
              )}
            </div>

            {/* Treatments */}
            <div>
              <label htmlFor="treatments" className="block text-sm font-medium text-gray-700 mb-1">
                Treatments
              </label>
              <Textarea
                id="treatments"
                {...register('treatments')}
                rows={3}
                placeholder="Treatment protocols and therapies"
              />
            </div>

            {/* Accommodations Required */}
            <div className="flex items-center">
              <input
                id="accommodationsRequired"
                type="checkbox"
                {...register('accommodationsRequired')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="accommodationsRequired" className="ml-2 block text-sm text-gray-700">
                Educational Accommodations Required
              </label>
            </div>

            {/* Accommodation Details (conditional) */}
            {accommodationsRequired && (
              <div>
                <label htmlFor="accommodationDetails" className="block text-sm font-medium text-gray-700 mb-1">
                  Accommodation Details <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="accommodationDetails"
                  {...register('accommodationDetails', {
                    required: accommodationsRequired ? 'Accommodation details are required' : false,
                  })}
                  rows={3}
                  placeholder="Specific accommodation requirements (504/IEP details)"
                />
                {errors.accommodationDetails && (
                  <p className="text-red-600 text-sm mt-1">{errors.accommodationDetails.message}</p>
                )}
              </div>
            )}

            {/* Emergency Protocol */}
            <div>
              <label htmlFor="emergencyProtocol" className="block text-sm font-medium text-gray-700 mb-1">
                Emergency Protocol
              </label>
              <Textarea
                id="emergencyProtocol"
                {...register('emergencyProtocol')}
                rows={3}
                placeholder="Emergency response procedures"
              />
            </div>

            {/* Action Plan */}
            <div>
              <label htmlFor="actionPlan" className="block text-sm font-medium text-gray-700 mb-1">
                Action Plan
              </label>
              <Textarea
                id="actionPlan"
                {...register('actionPlan')}
                rows={3}
                placeholder="Student-specific action plan"
              />
            </div>

            {/* Triggers */}
            <div>
              <label htmlFor="triggers" className="block text-sm font-medium text-gray-700 mb-1">
                Triggers
              </label>
              <Textarea
                id="triggers"
                {...register('triggers')}
                rows={2}
                placeholder="Known triggers that worsen the condition (comma-separated)"
              />
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <Textarea
                id="notes"
                {...register('notes')}
                rows={2}
                placeholder="Additional notes or observations"
              />
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? 'Adding...' : 'Add Condition'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};
