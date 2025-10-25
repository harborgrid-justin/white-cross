/**
 * Create Vaccination Modal Component
 * Modal for recording new vaccination administrations with comprehensive tracking
 */

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalTitle } from '@/components/ui/overlays/Modal';
import { Button } from '@/components/ui/buttons/Button';
import { Input } from '@/components/ui/inputs/Input';
import { Select } from '@/components/ui/inputs/Select';
import { Textarea } from '@/components/ui/inputs/Textarea';
import { Checkbox } from '@/components/ui/inputs/Checkbox';
import { useCreateVaccination } from '@/hooks/domains/health-records/useHealthRecords';

interface CreateVaccinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
}

interface VaccinationFormData {
  vaccineName: string;
  vaccineType?: string;
  manufacturer?: string;
  lotNumber?: string;
  doseNumber?: number;
  totalDoses?: number;
  seriesComplete: boolean;
  administrationDate: string;
  administeredBy: string;
  facility?: string;
  siteOfAdministration?: string;
  dosageAmount?: string;
  nextDueDate?: string;
  consentObtained: boolean;
  notes?: string;
}

export const CreateVaccinationModal: React.FC<CreateVaccinationModalProps> = ({
  isOpen,
  onClose,
  studentId,
}) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<VaccinationFormData>({
    defaultValues: {
      seriesComplete: false,
      consentObtained: false,
      administrationDate: new Date().toISOString().split('T')[0],
    },
  });

  const createMutation = useCreateVaccination();

  const onSubmit = async (data: VaccinationFormData) => {
    try {
      await createMutation.mutateAsync({
        studentId,
        vaccineName: data.vaccineName,
        vaccineType: data.vaccineType,
        manufacturer: data.manufacturer,
        lotNumber: data.lotNumber,
        doseNumber: data.doseNumber,
        totalDoses: data.totalDoses,
        seriesComplete: data.seriesComplete,
        administrationDate: data.administrationDate,
        administeredBy: data.administeredBy,
        facility: data.facility,
        siteOfAdministration: data.siteOfAdministration,
        dosageAmount: data.dosageAmount,
        nextDueDate: data.nextDueDate,
        consentObtained: data.consentObtained,
        notes: data.notes,
      });
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to create vaccination:', error);
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
          <ModalTitle>Record New Vaccination</ModalTitle>
        </ModalHeader>

        <ModalBody>
          <div className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">
            {/* Vaccine Name */}
            <div>
              <label htmlFor="vaccineName" className="block text-sm font-medium text-gray-700 mb-1">
                Vaccine Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="vaccineName"
                {...register('vaccineName', { required: 'Vaccine name is required' })}
                placeholder="e.g., MMR, DTaP, COVID-19"
              />
              {errors.vaccineName && (
                <p className="text-red-600 text-sm mt-1">{errors.vaccineName.message}</p>
              )}
            </div>

            {/* Vaccine Type */}
            <div>
              <label htmlFor="vaccineType" className="block text-sm font-medium text-gray-700 mb-1">
                Vaccine Type
              </label>
              <Input
                id="vaccineType"
                {...register('vaccineType')}
                placeholder="Category of vaccine"
              />
            </div>

            {/* Administration Date */}
            <div>
              <label htmlFor="administrationDate" className="block text-sm font-medium text-gray-700 mb-1">
                Administration Date <span className="text-red-500">*</span>
              </label>
              <Input
                id="administrationDate"
                type="date"
                {...register('administrationDate', { required: 'Administration date is required' })}
              />
              {errors.administrationDate && (
                <p className="text-red-600 text-sm mt-1">{errors.administrationDate.message}</p>
              )}
            </div>

            {/* Administered By */}
            <div>
              <label htmlFor="administeredBy" className="block text-sm font-medium text-gray-700 mb-1">
                Administered By <span className="text-red-500">*</span>
              </label>
              <Input
                id="administeredBy"
                {...register('administeredBy', { required: 'Administrator name is required' })}
                placeholder="Name of person who administered vaccine"
              />
              {errors.administeredBy && (
                <p className="text-red-600 text-sm mt-1">{errors.administeredBy.message}</p>
              )}
            </div>

            {/* Manufacturer */}
            <div>
              <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700 mb-1">
                Manufacturer
              </label>
              <Input
                id="manufacturer"
                {...register('manufacturer')}
                placeholder="e.g., Pfizer, Moderna"
              />
            </div>

            {/* Lot Number */}
            <div>
              <label htmlFor="lotNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Lot Number
              </label>
              <Input
                id="lotNumber"
                {...register('lotNumber')}
                placeholder="Vaccine lot number"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Dose Number */}
              <div>
                <label htmlFor="doseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Dose Number
                </label>
                <Input
                  id="doseNumber"
                  type="number"
                  min="1"
                  {...register('doseNumber', { valueAsNumber: true })}
                  placeholder="e.g., 1"
                />
              </div>

              {/* Total Doses */}
              <div>
                <label htmlFor="totalDoses" className="block text-sm font-medium text-gray-700 mb-1">
                  Total Doses in Series
                </label>
                <Input
                  id="totalDoses"
                  type="number"
                  min="1"
                  {...register('totalDoses', { valueAsNumber: true })}
                  placeholder="e.g., 3"
                />
              </div>
            </div>

            {/* Series Complete */}
            <div className="flex items-center">
              <input
                id="seriesComplete"
                type="checkbox"
                {...register('seriesComplete')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="seriesComplete" className="ml-2 block text-sm text-gray-700">
                Vaccination series complete
              </label>
            </div>

            {/* Facility */}
            <div>
              <label htmlFor="facility" className="block text-sm font-medium text-gray-700 mb-1">
                Facility
              </label>
              <Input
                id="facility"
                {...register('facility')}
                placeholder="Facility where vaccine was administered"
              />
            </div>

            {/* Site of Administration */}
            <div>
              <label htmlFor="siteOfAdministration" className="block text-sm font-medium text-gray-700 mb-1">
                Site of Administration
              </label>
              <Input
                id="siteOfAdministration"
                {...register('siteOfAdministration')}
                placeholder="e.g., Left arm, Right thigh"
              />
            </div>

            {/* Dosage Amount */}
            <div>
              <label htmlFor="dosageAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Dosage Amount
              </label>
              <Input
                id="dosageAmount"
                {...register('dosageAmount')}
                placeholder="e.g., 0.5mL"
              />
            </div>

            {/* Next Due Date */}
            <div>
              <label htmlFor="nextDueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Next Dose Due Date
              </label>
              <Input
                id="nextDueDate"
                type="date"
                {...register('nextDueDate')}
              />
            </div>

            {/* Consent Obtained */}
            <div className="flex items-center">
              <input
                id="consentObtained"
                type="checkbox"
                {...register('consentObtained')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="consentObtained" className="ml-2 block text-sm text-gray-700">
                Parental/Guardian consent obtained
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
            {createMutation.isPending ? 'Recording...' : 'Record Vaccination'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};
