/**
 * AddWitnessDialog Component
 *
 * Modal dialog for adding a new witness statement to an incident report.
 * Wraps WitnessStatementForm in a modal with proper focus management and accessibility.
 *
 * Features:
 * - Modal dialog for witness statement creation
 * - Form validation and submission
 * - Success toast notification
 * - Proper modal accessibility (focus trap, ESC key)
 * - Loading and error states
 * - Auto-close on successful submission
 */

import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalTitle } from '@/components/ui/overlays/Modal';
import WitnessStatementForm from './WitnessStatementForm';
import { UserPlus } from 'lucide-react';

interface AddWitnessDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Close dialog callback */
  onClose: () => void;
  /** Incident report ID to add witness to */
  incidentId: string;
  /** Optional CSS class name */
  className?: string;
}

/**
 * AddWitnessDialog component - Modal for adding witness statements
 */
const AddWitnessDialog: React.FC<AddWitnessDialogProps> = ({
  isOpen,
  onClose,
  incidentId,
  className = ''
}) => {
  // Handle successful form submission
  const handleSuccess = () => {
    // Close dialog on success
    onClose();
  };

  // Handle cancel
  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size="lg"
      centered
      closeOnBackdropClick={false}
      closeOnEscapeKey={true}
      showCloseButton={true}
    >
      <ModalHeader>
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
            <UserPlus className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <ModalTitle>Add Witness Statement</ModalTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Record a witness account of what was observed during this incident
            </p>
          </div>
        </div>
      </ModalHeader>

      <ModalBody>
        <div className={className}>
          <WitnessStatementForm
            incidentId={incidentId}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </ModalBody>
    </Modal>
  );
};

AddWitnessDialog.displayName = 'AddWitnessDialog';

export default AddWitnessDialog;
