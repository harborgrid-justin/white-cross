/**
 * Create Screening Modal Component
 * Modal for recording new health screenings with type-specific fields
 */

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalTitle } from '@/components/ui/overlays/Modal';
import { Button } from '@/components/ui/buttons/Button';
import { Input } from '@/components/ui/inputs/Input';
import { Select } from '@/components/ui/inputs/Select';
import { Textarea } from '@/components/ui/inputs/Textarea';
import { Checkbox } from '@/components/ui/inputs/Checkbox';
import { useCreateScreening } from '@/hooks/domains/health-records/useHealthRecords';
import type { ScreeningType, ScreeningOutcome } from '@/types/healthRecords';

interface CreateScreeningModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
}

interface ScreeningFormData {
  screeningType: ScreeningType;
  screeningDate: string;
  screenedBy: string;
  outcome: ScreeningOutcome;
  referralRequired: boolean;
  referralTo?: string;
  rightEye?: string;
  leftEye?: string;
  rightEar?: string;
  leftEar?: string;
  notes?: string;
}

const SCREENING_TYPES: { value: ScreeningType; label: string }[] = [
  { value: 'VISION', label: 'Vision' },
  { value: 'HEARING', label: 'Hearing' },
  { value: 'SCOLIOSIS', label: 'Scoliosis' },
  { value: 'DENTAL', label: 'Dental' },
  { value: 'BMI', label: 'BMI' },
  { value: 'BLOOD_PRESSURE', label: 'Blood Pressure' },
  { value: 'DEVELOPMENTAL', label: 'Developmental' },
  { value: 'SPEECH', label: 'Speech' },
  { value: 'MENTAL_HEALTH', label: 'Mental Health' },
  { value: 'TUBERCULOSIS', label: 'Tuberculosis' },
  { value: 'LEAD', label: 'Lead' },
  { value: 'ANEMIA', label: 'Anemia' },
  { value: 'OTHER', label: 'Other' },
];

const SCREENING_OUTCOMES: { value: ScreeningOutcome; label: string }[] = [
  { value: 'PASS', label: 'Pass' },
  { value: 'REFER', label: 'Refer' },
  { value: 'FAIL', label: 'Fail' },
  { value: 'INCONCLUSIVE', label: 'Inconclusive' },
  { value: 'INCOMPLETE', label: 'Incomplete' },
];

export const CreateScreeningModal: React.FC<CreateScreeningModalProps> = ({
  isOpen,
  onClose,
  studentId,
}) => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<ScreeningFormData>({
    defaultValues: {
      referralRequired: false,
      screeningDate: new Date().toISOString().split('T')[0],
    },
  });

  const createMutation = useCreateScreening();
  const screeningType = watch('screeningType');
  const referralRequired = watch('referralRequired');

  const onSubmit = async (data: ScreeningFormData) => {
    try {
      await createMutation.mutateAsync({
        studentId,
        screeningType: data.screeningType,
        screeningDate: data.screeningDate,
        screenedBy: data.screenedBy,
        outcome: data.outcome,
        referralRequired: data.referralRequired,
        referralTo: data.referralRequired ? data.referralTo : undefined,
        rightEye: screeningType === 'VISION' ? data.rightEye : undefined,
        leftEye: screeningType === 'VISION' ? data.leftEye : undefined,
        rightEar: screeningType === 'HEARING' ? data.rightEar : undefined,
        leftEar: screeningType === 'HEARING' ? data.leftEar : undefined,
        notes: data.notes,
      });
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to create screening:', error);
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
          <ModalTitle>Record Health Screening</ModalTitle>
        </ModalHeader>

        <ModalBody>
          <div className="space-y-4">
            {/* Screening Type */}
            <div>
              <label htmlFor="screeningType" className="block text-sm font-medium text-gray-700 mb-1">
                Screening Type <span className="text-red-500">*</span>
              </label>
              <select
                id="screeningType"
                {...register('screeningType', { required: 'Screening type is required' })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select screening type</option>
                {SCREENING_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.screeningType && (
                <p className="text-red-600 text-sm mt-1">{errors.screeningType.message}</p>
              )}
            </div>

            {/* Screening Date */}
            <div>
              <label htmlFor="screeningDate" className="block text-sm font-medium text-gray-700 mb-1">
                Screening Date <span className="text-red-500">*</span>
              </label>
              <Input
                id="screeningDate"
                type="date"
                {...register('screeningDate', { required: 'Screening date is required' })}
              />
              {errors.screeningDate && (
                <p className="text-red-600 text-sm mt-1">{errors.screeningDate.message}</p>
              )}
            </div>

            {/* Screened By */}
            <div>
              <label htmlFor="screenedBy" className="block text-sm font-medium text-gray-700 mb-1">
                Screened By <span className="text-red-500">*</span>
              </label>
              <Input
                id="screenedBy"
                {...register('screenedBy', { required: 'Screener name is required' })}
                placeholder="Name of person who performed screening"
              />
              {errors.screenedBy && (
                <p className="text-red-600 text-sm mt-1">{errors.screenedBy.message}</p>
              )}
            </div>

            {/* Outcome */}
            <div>
              <label htmlFor="outcome" className="block text-sm font-medium text-gray-700 mb-1">
                Outcome <span className="text-red-500">*</span>
              </label>
              <select
                id="outcome"
                {...register('outcome', { required: 'Outcome is required' })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select outcome</option>
                {SCREENING_OUTCOMES.map((outcome) => (
                  <option key={outcome.value} value={outcome.value}>
                    {outcome.label}
                  </option>
                ))}
              </select>
              {errors.outcome && (
                <p className="text-red-600 text-sm mt-1">{errors.outcome.message}</p>
              )}
            </div>

            {/* Vision-specific fields */}
            {screeningType === 'VISION' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="rightEye" className="block text-sm font-medium text-gray-700 mb-1">
                      Right Eye Result
                    </label>
                    <Input
                      id="rightEye"
                      {...register('rightEye')}
                      placeholder="e.g., 20/20"
                    />
                  </div>
                  <div>
                    <label htmlFor="leftEye" className="block text-sm font-medium text-gray-700 mb-1">
                      Left Eye Result
                    </label>
                    <Input
                      id="leftEye"
                      {...register('leftEye')}
                      placeholder="e.g., 20/20"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Hearing-specific fields */}
            {screeningType === 'HEARING' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="rightEar" className="block text-sm font-medium text-gray-700 mb-1">
                      Right Ear Result
                    </label>
                    <Input
                      id="rightEar"
                      {...register('rightEar')}
                      placeholder="e.g., Pass/Fail"
                    />
                  </div>
                  <div>
                    <label htmlFor="leftEar" className="block text-sm font-medium text-gray-700 mb-1">
                      Left Ear Result
                    </label>
                    <Input
                      id="leftEar"
                      {...register('leftEar')}
                      placeholder="e.g., Pass/Fail"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Referral Required */}
            <div className="flex items-center">
              <input
                id="referralRequired"
                type="checkbox"
                {...register('referralRequired')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="referralRequired" className="ml-2 block text-sm text-gray-700">
                Referral Required
              </label>
            </div>

            {/* Referral To (conditional) */}
            {referralRequired && (
              <div>
                <label htmlFor="referralTo" className="block text-sm font-medium text-gray-700 mb-1">
                  Referral To <span className="text-red-500">*</span>
                </label>
                <Input
                  id="referralTo"
                  {...register('referralTo', {
                    required: referralRequired ? 'Referral destination is required' : false,
                  })}
                  placeholder="Specialist or provider for referral"
                />
                {errors.referralTo && (
                  <p className="text-red-600 text-sm mt-1">{errors.referralTo.message}</p>
                )}
              </div>
            )}

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <Textarea
                id="notes"
                {...register('notes')}
                rows={3}
                placeholder="Additional observations"
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
            {createMutation.isPending ? 'Recording...' : 'Record Screening'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};
