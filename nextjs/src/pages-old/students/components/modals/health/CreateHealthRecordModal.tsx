/**
 * Create Health Record Modal Component
 * Modal for creating new health records with comprehensive form validation
 */

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalTitle } from '@/components/ui/overlays/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import { useCreateHealthRecord } from '@/hooks/domains/health-records/useHealthRecords';
import { RECORD_TYPES } from '@/constants/healthRecords';
import type { HealthRecordType } from '@/types/healthRecords';

interface CreateHealthRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
}

interface HealthRecordFormData {
  recordType: HealthRecordType;
  title: string;
  description: string;
  recordDate: string;
  provider?: string;
  diagnosis?: string;
  treatment?: string;
  followUpRequired: boolean;
  notes?: string;
}

export const CreateHealthRecordModal: React.FC<CreateHealthRecordModalProps> = ({
  isOpen,
  onClose,
  studentId,
}) => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<HealthRecordFormData>({
    defaultValues: {
      followUpRequired: false,
      recordDate: new Date().toISOString().split('T')[0],
    },
  });

  const createMutation = useCreateHealthRecord();

  const onSubmit = async (data: HealthRecordFormData) => {
    try {
      await createMutation.mutateAsync({
        studentId,
        type: data.recordType,
        date: data.recordDate,
        description: data.description,
        diagnosis: data.diagnosis,
        treatment: data.treatment,
        provider: data.provider,
        notes: data.notes,
        followUpRequired: data.followUpRequired,
      });
      reset();
      onClose();
    } catch (error) {
      // Error handling is done by the mutation hook
      console.error('Failed to create health record:', error);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  return (
    <Modal open={isOpen} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>
          <ModalTitle>Add New Health Record</ModalTitle>
        </ModalHeader>

        <ModalBody>
          <div className="space-y-4">
            {/* Record Type */}
            <div>
              <label htmlFor="recordType" className="block text-sm font-medium text-gray-700 mb-1">
                Record Type <span className="text-red-500">*</span>
              </label>
              <select
                id="recordType"
                {...register('recordType', { required: 'Record type is required' })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select record type</option>
                {RECORD_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.recordType && (
                <p className="text-red-600 text-sm mt-1">{errors.recordType.message}</p>
              )}
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                {...register('title', { required: 'Title is required' })}
                placeholder="Brief summary of the health record"
              />
              {errors.title && (
                <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Record Date */}
            <div>
              <label htmlFor="recordDate" className="block text-sm font-medium text-gray-700 mb-1">
                Record Date <span className="text-red-500">*</span>
              </label>
              <Input
                id="recordDate"
                type="date"
                {...register('recordDate', { required: 'Record date is required' })}
              />
              {errors.recordDate && (
                <p className="text-red-600 text-sm mt-1">{errors.recordDate.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="description"
                {...register('description', { required: 'Description is required' })}
                rows={3}
                placeholder="Detailed description of the health event"
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* Provider */}
            <div>
              <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-1">
                Healthcare Provider
              </label>
              <Input
                id="provider"
                {...register('provider')}
                placeholder="Provider name"
              />
            </div>

            {/* Diagnosis */}
            <div>
              <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-1">
                Diagnosis
              </label>
              <Input
                id="diagnosis"
                {...register('diagnosis')}
                placeholder="Medical diagnosis"
              />
            </div>

            {/* Treatment */}
            <div>
              <label htmlFor="treatment" className="block text-sm font-medium text-gray-700 mb-1">
                Treatment
              </label>
              <Textarea
                id="treatment"
                {...register('treatment')}
                rows={2}
                placeholder="Treatment provided or recommended"
              />
            </div>

            {/* Follow-up Required */}
            <div className="flex items-center">
              <input
                id="followUpRequired"
                type="checkbox"
                {...register('followUpRequired')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="followUpRequired" className="ml-2 block text-sm text-gray-700">
                Follow-up required
              </label>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <Textarea
                id="notes"
                {...register('notes')}
                rows={3}
                placeholder="Additional notes or comments"
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
            {createMutation.isPending ? 'Creating...' : 'Create Health Record'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};
