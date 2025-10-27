'use client';

/**
 * MedicationDetailsModal Component
 * Modal wrapper for medication details view
 */

import React from 'react';
import { Modal } from '@/components/ui/overlays/Modal';
import { MedicationDetails, type MedicationDetailData } from '@/components/medications/core/MedicationDetails';

export interface MedicationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  medication: MedicationDetailData | null;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

/**
 * MedicationDetailsModal - Modal for viewing medication details
 *
 * @param props - Component props
 * @returns Modal with medication details
 */
const MedicationDetailsModal: React.FC<MedicationDetailsModalProps> = ({
  isOpen,
  onClose,
  medication,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  if (!medication) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Medication Details"
      size="lg"
    >
      <MedicationDetails
        medication={medication}
        onEdit={onEdit}
        onDelete={onDelete}
        onClose={onClose}
        showActions={showActions}
      />
    </Modal>
  );
};

MedicationDetailsModal.displayName = 'MedicationDetailsModal';

export default MedicationDetailsModal;
