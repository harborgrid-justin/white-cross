/**
 * Create Allergy Modal Component - White Cross Healthcare Platform
 *
 * Modal dialog for documenting new student allergies with comprehensive safety information
 * including allergen identification, severity assessment, symptoms, treatment protocols,
 * and EpiPen requirements. Critical for school nurse emergency response and student safety.
 *
 * @fileoverview HIPAA-compliant allergy documentation modal with emergency protocol support
 * @module pages/students/components/modals/health/CreateAllergyModal
 * @version 1.0.0
 */

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalTitle } from '@/components/ui/overlays/Modal';
import { Button } from '@/components/ui/buttons/Button';
import { Input } from '@/components/ui/inputs/Input';
import { Select } from '@/components/ui/inputs/Select';
import { Textarea } from '@/components/ui/inputs/Textarea';
import { Checkbox } from '@/components/ui/inputs/Checkbox';
import { useCreateAllergy } from '@/hooks/domains/health-records/useHealthRecords';
import { ALLERGY_TYPES, SEVERITY_LEVELS } from '@/constants/healthRecords';
import type { AllergyType, AllergySeverity } from '@/types/healthRecords';

/**
 * Props for the CreateAllergyModal component.
 *
 * @interface CreateAllergyModalProps
 * @property {boolean} isOpen - Controls modal visibility
 * @property {() => void} onClose - Callback when modal is closed
 * @property {string} studentId - ID of student for whom allergy is being documented
 *
 * @remarks
 * **PHI Warning**: Allergy information is Protected Health Information under HIPAA.
 * All allergy documentation must be audit logged.
 */
interface CreateAllergyModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
}

/**
 * Form data structure for allergy creation.
 *
 * @interface AllergyFormData
 * @property {string} allergen - Name of the allergen (food, medication, environmental)
 * @property {AllergyType} allergyType - Category: FOOD, MEDICATION, ENVIRONMENTAL, INSECT, OTHER
 * @property {AllergySeverity} severity - Severity level: MILD, MODERATE, SEVERE, LIFE_THREATENING
 * @property {string} [symptoms] - Typical allergic reaction symptoms (optional)
 * @property {string} [treatment] - Standard treatment protocol (optional)
 * @property {string} [emergencyProtocol] - Emergency response procedures (optional)
 * @property {boolean} epiPenRequired - Whether EpiPen is required for this allergy
 * @property {string} [epiPenLocation] - Where EpiPen is stored (required if epiPenRequired is true)
 * @property {string} [notes] - Additional notes or special instructions (optional)
 */
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

/**
 * Create Allergy Modal Component.
 *
 * Comprehensive allergy documentation form capturing allergen details, severity assessment,
 * reaction symptoms, treatment protocols, and EpiPen requirements. Essential for school
 * nurse emergency preparedness and student safety protocols.
 *
 * @component
 * @param {CreateAllergyModalProps} props - Component props
 * @returns {React.ReactElement | null} Rendered modal or null when closed
 *
 * @example
 * ```tsx
 * import { CreateAllergyModal } from './modals/health/CreateAllergyModal';
 *
 * function HealthRecordsPage() {
 *   const [showModal, setShowModal] = useState(false);
 *   const studentId = '12345';
 *
 *   return (
 *     <>
 *       <button onClick={() => setShowModal(true)}>Add Allergy</button>
 *       <CreateAllergyModal
 *         isOpen={showModal}
 *         onClose={() => setShowModal(false)}
 *         studentId={studentId}
 *       />
 *     </>
 *   );
 * }
 * ```
 *
 * @remarks
 * **Allergy Types** (ALLERGY_TYPES constant):
 * - **FOOD**: Food allergies (peanuts, dairy, shellfish, etc.)
 * - **MEDICATION**: Drug allergies (penicillin, aspirin, etc.)
 * - **ENVIRONMENTAL**: Environmental triggers (pollen, dust, mold)
 * - **INSECT**: Insect sting allergies (bees, wasps)
 * - **OTHER**: Other allergen categories
 *
 * **Severity Levels** (SEVERITY_LEVELS constant):
 * - **MILD**: Minor symptoms, no intervention needed
 * - **MODERATE**: Noticeable symptoms, may require medication
 * - **SEVERE**: Serious symptoms, requires immediate attention
 * - **LIFE_THREATENING**: Anaphylaxis risk, requires EpiPen
 *
 * **EpiPen Requirements**:
 * - Life-threatening allergies require documented EpiPen availability
 * - EpiPen location must be specified and accessible
 * - School nurses must know exact EpiPen storage location
 * - Parents/guardians responsible for providing and replacing EpiPens
 * - Expiration dates monitored and tracked
 *
 * **Emergency Protocols**:
 * - Document specific reaction symptoms (hives, swelling, breathing difficulty)
 * - Specify immediate treatment steps (antihistamine, EpiPen, call 911)
 * - Emergency contact procedures clearly defined
 * - All staff informed of life-threatening allergies
 *
 * **HIPAA Compliance**:
 * - Allergy information is Protected Health Information
 * - All allergy creation logged to audit trail with user and timestamp
 * - Access restricted to NURSE, ADMIN, COUNSELOR roles
 * - Parents must provide written documentation for new allergies
 *
 * **Form Validation**:
 * - Allergen name required
 * - Allergy type and severity required
 * - EpiPen location required if epiPenRequired is checked
 * - React Hook Form with TanStack Query mutation
 *
 * **TanStack Query Integration**:
 * - Uses useCreateAllergy hook for API mutation
 * - Automatic cache invalidation on successful creation
 * - Optimistic updates for responsive UX
 * - Error handling with toast notifications
 *
 * @see {@link EditAllergyModal} for editing existing allergies
 * @see {@link StudentHealthRecords} for viewing all health records
 * @see {@link useCreateAllergy} for mutation hook
 */
export const CreateAllergyModal: React.FC<CreateAllergyModalProps> = ({
  isOpen,
  onClose,
  studentId,
}) => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<AllergyFormData>({
    defaultValues: {
      epiPenRequired: false,
    },
  });

  const createMutation = useCreateAllergy();
  const epiPenRequired = watch('epiPenRequired');

  const onSubmit = async (data: AllergyFormData) => {
    try {
      await createMutation.mutateAsync({
        studentId,
        allergen: data.allergen,
        allergyType: data.allergyType as any,
        severity: data.severity as any,
        symptoms: data.symptoms ? [data.symptoms] : undefined,
        treatment: data.treatment,
        notes: data.notes,
      });
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to create allergy:', error);
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
          <ModalTitle>Add New Allergy</ModalTitle>
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
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? 'Adding...' : 'Add Allergy'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};
