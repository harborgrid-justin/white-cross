/**
 * Create Growth Measurement Modal Component
 * Modal for recording new growth measurements with auto-calculated BMI
 */

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalTitle } from '@/components/ui/overlays/Modal';
import { Button } from '@/components/ui/buttons/Button';
import { Input } from '@/components/ui/inputs/Input';
import { Select } from '@/components/ui/inputs/Select';
import { Textarea } from '@/components/ui/inputs/Textarea';
import { Checkbox } from '@/components/ui/inputs/Checkbox';
import { useCreateGrowthMeasurement } from '@/hooks/domains/health-records/useHealthRecords';

interface CreateGrowthMeasurementModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
}

interface GrowthMeasurementFormData {
  measurementDate: string;
  measuredBy: string;
  height?: number;
  heightUnit: 'cm' | 'in';
  weight?: number;
  weightUnit: 'kg' | 'lb';
  headCircumference?: number;
  notes?: string;
}

export const CreateGrowthMeasurementModal: React.FC<CreateGrowthMeasurementModalProps> = ({
  isOpen,
  onClose,
  studentId,
}) => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<GrowthMeasurementFormData>({
    defaultValues: {
      measurementDate: new Date().toISOString().split('T')[0],
      heightUnit: 'cm',
      weightUnit: 'kg',
    },
  });

  const createMutation = useCreateGrowthMeasurement();
  const [calculatedBMI, setCalculatedBMI] = useState<number | null>(null);

  const height = watch('height');
  const heightUnit = watch('heightUnit');
  const weight = watch('weight');
  const weightUnit = watch('weightUnit');

  // Auto-calculate BMI when height and weight are provided
  useEffect(() => {
    if (height && weight) {
      // Convert to metric (cm and kg) for BMI calculation
      let heightInCm = height;
      let weightInKg = weight;

      if (heightUnit === 'in') {
        heightInCm = height * 2.54;
      }

      if (weightUnit === 'lb') {
        weightInKg = weight * 0.453592;
      }

      const heightInM = heightInCm / 100;
      const bmi = weightInKg / (heightInM * heightInM);
      setCalculatedBMI(Math.round(bmi * 10) / 10);
    } else {
      setCalculatedBMI(null);
    }
  }, [height, heightUnit, weight, weightUnit]);

  const onSubmit = async (data: GrowthMeasurementFormData) => {
    try {
      // Convert measurements to metric for API
      let heightInCm = data.height;
      let weightInKg = data.weight;

      if (data.height && data.heightUnit === 'in') {
        heightInCm = data.height * 2.54;
      }

      if (data.weight && data.weightUnit === 'lb') {
        weightInKg = data.weight * 0.453592;
      }

      await createMutation.mutateAsync({
        studentId,
        measurementDate: data.measurementDate,
        measuredBy: data.measuredBy,
        height: heightInCm,
        weight: weightInKg,
        headCircumference: data.headCircumference,
        notes: data.notes,
      });
      reset();
      setCalculatedBMI(null);
      onClose();
    } catch (error) {
      console.error('Failed to create growth measurement:', error);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      reset();
      setCalculatedBMI(null);
    }
  }, [isOpen, reset]);

  return (
    <Modal open={isOpen} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>
          <ModalTitle>Record Growth Measurement</ModalTitle>
        </ModalHeader>

        <ModalBody>
          <div className="space-y-4">
            {/* Measurement Date */}
            <div>
              <label htmlFor="measurementDate" className="block text-sm font-medium text-gray-700 mb-1">
                Measurement Date <span className="text-red-500">*</span>
              </label>
              <Input
                id="measurementDate"
                type="date"
                {...register('measurementDate', { required: 'Measurement date is required' })}
              />
              {errors.measurementDate && (
                <p className="text-red-600 text-sm mt-1">{errors.measurementDate.message}</p>
              )}
            </div>

            {/* Measured By */}
            <div>
              <label htmlFor="measuredBy" className="block text-sm font-medium text-gray-700 mb-1">
                Measured By <span className="text-red-500">*</span>
              </label>
              <Input
                id="measuredBy"
                {...register('measuredBy', { required: 'Measurer name is required' })}
                placeholder="Name of person who took measurements"
              />
              {errors.measuredBy && (
                <p className="text-red-600 text-sm mt-1">{errors.measuredBy.message}</p>
              )}
            </div>

            {/* Height */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                  Height
                </label>
                <Input
                  id="height"
                  type="number"
                  step="0.1"
                  {...register('height', { valueAsNumber: true })}
                  placeholder="e.g., 150"
                />
              </div>
              <div>
                <label htmlFor="heightUnit" className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <select
                  id="heightUnit"
                  {...register('heightUnit')}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="cm">cm</option>
                  <option value="in">in</option>
                </select>
              </div>
            </div>

            {/* Weight */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                  Weight
                </label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  {...register('weight', { valueAsNumber: true })}
                  placeholder="e.g., 45"
                />
              </div>
              <div>
                <label htmlFor="weightUnit" className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <select
                  id="weightUnit"
                  {...register('weightUnit')}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="kg">kg</option>
                  <option value="lb">lb</option>
                </select>
              </div>
            </div>

            {/* Calculated BMI Display */}
            {calculatedBMI !== null && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-sm font-medium text-blue-900">
                  Calculated BMI: <span className="text-lg">{calculatedBMI}</span>
                </p>
              </div>
            )}

            {/* Head Circumference */}
            <div>
              <label htmlFor="headCircumference" className="block text-sm font-medium text-gray-700 mb-1">
                Head Circumference (cm)
              </label>
              <Input
                id="headCircumference"
                type="number"
                step="0.1"
                {...register('headCircumference', { valueAsNumber: true })}
                placeholder="Optional, for infants/toddlers"
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
            {createMutation.isPending ? 'Recording...' : 'Record Measurement'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};
