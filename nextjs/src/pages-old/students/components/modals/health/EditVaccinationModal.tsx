/**
 * Edit Vaccination Modal Component
 * Modal for editing existing vaccination records
 */

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalTitle } from '@/components/ui/overlays/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import { useUpdateVaccination } from '@/hooks/domains/health-records/useHealthRecords';
import type { Vaccination } from '@/types/healthRecords';

interface EditVaccinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  vaccination: Vaccination;
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

export const EditVaccinationModal: React.FC<EditVaccinationModalProps> = ({
  isOpen,
  onClose,
  vaccination,
}) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<VaccinationFormData>();

  const updateMutation = useUpdateVaccination();

  useEffect(() => {
    if (vaccination) {
      reset({
        vaccineName: vaccination.vaccineName,
        vaccineType: vaccination.vaccineType || '',
        manufacturer: vaccination.manufacturer || '',
        lotNumber: vaccination.lotNumber || '',
        doseNumber: vaccination.doseNumber || undefined,
        totalDoses: vaccination.totalDoses || undefined,
        seriesComplete: vaccination.seriesComplete || false,
        administrationDate: vaccination.administrationDate?.split('T')[0] || new Date().toISOString().split('T')[0],
        administeredBy: vaccination.administeredBy,
        facility: vaccination.facility || '',
        siteOfAdministration: vaccination.siteOfAdministration || '',
        dosageAmount: vaccination.dosageAmount || '',
        nextDueDate: vaccination.nextDueDate?.split('T')[0] || '',
        consentObtained: vaccination.consentObtained || false,
        notes: vaccination.notes || '',
      });
    }
  }, [vaccination, reset]);

  const onSubmit = async (data: VaccinationFormData) => {
    try {
      await updateMutation.mutateAsync({
        id: vaccination.id,
        data: {
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
        },
      });
      onClose();
    } catch (error) {
      console.error('Failed to update vaccination:', error);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} size="xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>
          <ModalTitle>Edit Vaccination Record</ModalTitle>
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
            disabled={updateMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Updating...' : 'Update Vaccination'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};
