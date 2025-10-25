/**
 * Create Vital Signs Modal Component
 * Modal for recording new vital signs measurements
 */

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalTitle } from '@/components/ui/overlays/Modal';
import { Button } from '@/components/ui/buttons/Button';
import { Input } from '@/components/ui/inputs/Input';
import { Select } from '@/components/ui/inputs/Select';
import { Textarea } from '@/components/ui/inputs/Textarea';
import { Checkbox } from '@/components/ui/inputs/Checkbox';
import { useCreateVitalSigns } from '@/hooks/domains/health-records/useHealthRecords';

interface CreateVitalSignsModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
}

interface VitalSignsFormData {
  measurementDate: string;
  temperature?: number;
  temperatureUnit: 'F' | 'C';
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  painLevel?: number;
  glucoseLevel?: number;
  notes?: string;
}

export const CreateVitalSignsModal: React.FC<CreateVitalSignsModalProps> = ({
  isOpen,
  onClose,
  studentId,
}) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<VitalSignsFormData>({
    defaultValues: {
      measurementDate: new Date().toISOString().split('T')[0],
      temperatureUnit: 'F',
    },
  });

  const createMutation = useCreateVitalSigns();

  const onSubmit = async (data: VitalSignsFormData) => {
    try {
      await createMutation.mutateAsync({
        studentId,
        measurementDate: data.measurementDate,
        temperature: data.temperature,
        temperatureUnit: data.temperatureUnit,
        bloodPressureSystolic: data.bloodPressureSystolic,
        bloodPressureDiastolic: data.bloodPressureDiastolic,
        heartRate: data.heartRate,
        respiratoryRate: data.respiratoryRate,
        oxygenSaturation: data.oxygenSaturation,
        painLevel: data.painLevel,
        glucoseLevel: data.glucoseLevel,
        notes: data.notes,
      });
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to create vital signs:', error);
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
          <ModalTitle>Record Vital Signs</ModalTitle>
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

            {/* Temperature */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-1">
                  Temperature
                </label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  {...register('temperature', { valueAsNumber: true })}
                  placeholder="e.g., 98.6"
                />
              </div>
              <div>
                <label htmlFor="temperatureUnit" className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <select
                  id="temperatureUnit"
                  {...register('temperatureUnit')}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="F">°F</option>
                  <option value="C">°C</option>
                </select>
              </div>
            </div>

            {/* Blood Pressure */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Pressure (mmHg)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    type="number"
                    {...register('bloodPressureSystolic', { valueAsNumber: true })}
                    placeholder="Systolic (e.g., 120)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Systolic</p>
                </div>
                <div>
                  <Input
                    type="number"
                    {...register('bloodPressureDiastolic', { valueAsNumber: true })}
                    placeholder="Diastolic (e.g., 80)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Diastolic</p>
                </div>
              </div>
            </div>

            {/* Heart Rate */}
            <div>
              <label htmlFor="heartRate" className="block text-sm font-medium text-gray-700 mb-1">
                Heart Rate (bpm)
              </label>
              <Input
                id="heartRate"
                type="number"
                {...register('heartRate', { valueAsNumber: true })}
                placeholder="e.g., 72"
              />
            </div>

            {/* Respiratory Rate */}
            <div>
              <label htmlFor="respiratoryRate" className="block text-sm font-medium text-gray-700 mb-1">
                Respiratory Rate (breaths/min)
              </label>
              <Input
                id="respiratoryRate"
                type="number"
                {...register('respiratoryRate', { valueAsNumber: true })}
                placeholder="e.g., 16"
              />
            </div>

            {/* Oxygen Saturation */}
            <div>
              <label htmlFor="oxygenSaturation" className="block text-sm font-medium text-gray-700 mb-1">
                Oxygen Saturation (%)
              </label>
              <Input
                id="oxygenSaturation"
                type="number"
                min="0"
                max="100"
                {...register('oxygenSaturation', { valueAsNumber: true })}
                placeholder="e.g., 98"
              />
            </div>

            {/* Pain Level */}
            <div>
              <label htmlFor="painLevel" className="block text-sm font-medium text-gray-700 mb-1">
                Pain Level (0-10)
              </label>
              <Input
                id="painLevel"
                type="number"
                min="0"
                max="10"
                {...register('painLevel', { valueAsNumber: true })}
                placeholder="0 = No pain, 10 = Worst pain"
              />
            </div>

            {/* Glucose Level */}
            <div>
              <label htmlFor="glucoseLevel" className="block text-sm font-medium text-gray-700 mb-1">
                Glucose Level (mg/dL)
              </label>
              <Input
                id="glucoseLevel"
                type="number"
                {...register('glucoseLevel', { valueAsNumber: true })}
                placeholder="e.g., 95"
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
            {createMutation.isPending ? 'Recording...' : 'Record Vital Signs'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};
