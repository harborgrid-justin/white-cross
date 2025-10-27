'use client';

/**
 * MedicationFormModal Component
 * Modal wrapper for medication form
 */

import React from 'react';
import { Modal } from '@/components/ui/overlays/Modal';
import { MedicationForm, type MedicationFormData } from '@/components/medications/forms/MedicationForm';

export interface MedicationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MedicationFormData) => Promise<void> | void;
  initialData?: Partial<MedicationFormData>;
  mode?: 'create' | 'edit';
  title?: string;
}

/**
 * MedicationFormModal - Modal for creating and editing medications
 *
 * @param props - Component props
 * @returns Modal with medication form
 */
const MedicationFormModal: React.FC<MedicationFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = 'create',
  title,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (data: MedicationFormData) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Error submitting medication form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || (mode === 'create' ? 'Add Medication' : 'Edit Medication')}
      size="lg"
    >
      <MedicationForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={onClose}
        isLoading={isLoading}
        mode={mode}
      />
    </Modal>
  );
};

MedicationFormModal.displayName = 'MedicationFormModal';

export default MedicationFormModal;
