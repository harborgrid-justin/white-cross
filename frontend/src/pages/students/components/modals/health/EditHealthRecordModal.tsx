/**
 * Edit Health Record Modal Component
 * Modal for editing existing health records with pre-populated data
 */

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalTitle } from '@/components/ui/overlays/Modal';
import { Button } from '@/components/ui/buttons/Button';
import { Input } from '@/components/ui/inputs/Input';
import { Select } from '@/components/ui/inputs/Select';
import { Textarea } from '@/components/ui/inputs/Textarea';
import { Checkbox } from '@/components/ui/inputs/Checkbox';
import { useUpdateHealthRecord } from '@/hooks/domains/health-records/useHealthRecords';
import { RECORD_TYPES } from '@/constants/healthRecords';
import type { HealthRecord, HealthRecordType } from '@/types/healthRecords';

interface EditHealthRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: HealthRecord;
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

export const EditHealthRecordModal: React.FC<EditHealthRecordModalProps> = ({
  isOpen,
  onClose,
  record,
}) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<HealthRecordFormData>();

  const updateMutation = useUpdateHealthRecord();

  useEffect(() => {
    if (record) {
      reset({
        recordType: record.recordType,
        title: record.title,
        description: record.description,
        recordDate: record.recordDate?.split('T')[0] || new Date().toISOString().split('T')[0],
        provider: record.provider || '',
        diagnosis: record.diagnosis || '',
        treatment: record.treatment || '',
        followUpRequired: record.followUpRequired || false,
        notes: record.notes || '',
      });
    }
  }, [record, reset]);

  const onSubmit = async (data: HealthRecordFormData) => {
    try {
      await updateMutation.mutateAsync({
        id: record.id,
        data: {
          type: data.recordType,
          date: data.recordDate,
          description: data.description,
          diagnosis: data.diagnosis,
          treatment: data.treatment,
          provider: data.provider,
          notes: data.notes,
          followUpRequired: data.followUpRequired,
        },
      });
      onClose();
    } catch (error) {
      // Error handling is done by the mutation hook
      console.error('Failed to update health record:', error);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>
          <ModalTitle>Edit Health Record</ModalTitle>
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
            disabled={updateMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Updating...' : 'Update Health Record'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};
