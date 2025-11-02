'use client';

/**
 * MedicationDetailsModal Component
 * Modal wrapper for medication details view
 */

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Medication Details</DialogTitle>
        </DialogHeader>
        <MedicationDetails
          medication={medication}
          onEdit={onEdit}
          onDelete={onDelete}
          onClose={onClose}
          showActions={showActions}
        />
      </DialogContent>
    </Dialog>
  );
};

MedicationDetailsModal.displayName = 'MedicationDetailsModal';

export default MedicationDetailsModal;
