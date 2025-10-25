/**
 * Edit Allergy Modal Component
 * Modal for editing existing allergy information
 */

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalTitle } from '@/components/ui/overlays/Modal';
import { Button } from '@/components/ui/buttons/Button';
import { Input } from '@/components/ui/inputs/Input';
import { Select } from '@/components/ui/inputs/Select';
import { Textarea } from '@/components/ui/inputs/Textarea';
import { Checkbox } from '@/components/ui/inputs/Checkbox';
import { useUpdateAllergy } from '@/hooks/domains/health-records/useHealthRecords';
import { ALLERGY_TYPES, SEVERITY_LEVELS } from '@/constants/healthRecords';
import type { Allergy, AllergyType, AllergySeverity } from '@/types/healthRecords';

interface EditAllergyModalProps {
  isOpen: boolean;
  onClose: () => void;
  allergy: Allergy;
}

interface AllergyFormData {
  allergen: string;
  allergyType: AllergyType;
  severity: AllergySeverity;
  symptoms?: string;
  treatment?: string;
  emergencyProtocol?: string;
  epiPenRequired: boolean;
  epiPenLocation?: string;
  notes?: string;
}

export const EditAllergyModal: React.FC<EditAllergyModalProps> = ({
  isOpen,
  onClose,
  allergy,
}) => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<AllergyFormData>();

  const updateMutation = useUpdateAllergy();
  const epiPenRequired = watch('epiPenRequired');

  useEffect(() => {
    if (allergy) {
      reset({
        allergen: allergy.allergen,
        allergyType: allergy.allergyType,
        severity: allergy.severity,
        symptoms: allergy.symptoms || '',
        treatment: allergy.treatment || '',
        emergencyProtocol: allergy.emergencyProtocol || '',
        epiPenRequired: allergy.epiPenRequired || false,
        epiPenLocation: allergy.epiPenLocation || '',
        notes: allergy.notes || '',
      });
    }
  }, [allergy, reset]);

  const onSubmit = async (data: AllergyFormData) => {
    try {
      await updateMutation.mutateAsync({
        id: allergy.id,
        data: {
          allergen: data.allergen,
          allergyType: data.allergyType,
          severity: data.severity,
          symptoms: data.symptoms,
          treatment: data.treatment,
          emergencyProtocol: data.emergencyProtocol,
          epiPenRequired: data.epiPenRequired,
          epiPenLocation: data.epiPenRequired ? data.epiPenLocation : undefined,
          notes: data.notes,
        },
      });
      onClose();
    } catch (error) {
      console.error('Failed to update allergy:', error);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>
          <ModalTitle>Edit Allergy</ModalTitle>
        </ModalHeader>

        <ModalBody>
          <div className="space-y-4">
            {/* Allergen */}
            <div>
              <label htmlFor="allergen" className="block text-sm font-medium text-gray-700 mb-1">
                Allergen <span className="text-red-500">*</span>
              </label>
              <Input
                id="allergen"
                {...register('allergen', { required: 'Allergen is required' })}
                placeholder="e.g., Peanuts, Penicillin"
              />
              {errors.allergen && (
                <p className="text-red-600 text-sm mt-1">{errors.allergen.message}</p>
              )}
            </div>

            {/* Allergy Type */}
            <div>
              <label htmlFor="allergyType" className="block text-sm font-medium text-gray-700 mb-1">
                Allergy Type <span className="text-red-500">*</span>
              </label>
              <select
                id="allergyType"
                {...register('allergyType', { required: 'Allergy type is required' })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select allergy type</option>
                {ALLERGY_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.allergyType && (
                <p className="text-red-600 text-sm mt-1">{errors.allergyType.message}</p>
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

            {/* Symptoms */}
            <div>
              <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">
                Symptoms
              </label>
              <Textarea
                id="symptoms"
                {...register('symptoms')}
                rows={3}
                placeholder="Known symptoms and reactions"
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
                placeholder="Standard treatment protocol"
              />
            </div>

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

            {/* EpiPen Required */}
            <div className="flex items-center">
              <input
                id="epiPenRequired"
                type="checkbox"
                {...register('epiPenRequired')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="epiPenRequired" className="ml-2 block text-sm text-gray-700">
                EpiPen Required
              </label>
            </div>

            {/* EpiPen Location (conditional) */}
            {epiPenRequired && (
              <div>
                <label htmlFor="epiPenLocation" className="block text-sm font-medium text-gray-700 mb-1">
                  EpiPen Location <span className="text-red-500">*</span>
                </label>
                <Input
                  id="epiPenLocation"
                  {...register('epiPenLocation', {
                    required: epiPenRequired ? 'EpiPen location is required when EpiPen is needed' : false,
                  })}
                  placeholder="e.g., Nurse's office, Student's backpack"
                />
                {errors.epiPenLocation && (
                  <p className="text-red-600 text-sm mt-1">{errors.epiPenLocation.message}</p>
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
                rows={2}
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
            {updateMutation.isPending ? 'Updating...' : 'Update Allergy'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};
