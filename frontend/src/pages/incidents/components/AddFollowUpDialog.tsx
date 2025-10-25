/**
 * AddFollowUpDialog Component
 *
 * Modal dialog for adding or editing follow-up actions.
 * Wraps FollowUpActionForm in a Modal component with proper state management.
 */

import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalTitle,
} from '@/components/ui/overlays/Modal';
import FollowUpActionForm from './FollowUpActionForm';
import { type FollowUpAction } from '@/types/incidents';

interface AddFollowUpDialogProps {
  isOpen: boolean;
  onClose: () => void;
  incidentId: string;
  action?: FollowUpAction | null;
}

/**
 * AddFollowUpDialog component - Modal for creating/editing follow-up actions
 */
const AddFollowUpDialog: React.FC<AddFollowUpDialogProps> = ({
  isOpen,
  onClose,
  incidentId,
  action = null,
}) => {
  const isEditMode = !!action;

  const handleSuccess = () => {
    onClose();
  };

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
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            {isEditMode ? 'Edit Follow-Up Action' : 'Add Follow-Up Action'}
          </ModalTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {isEditMode
              ? 'Update the details of this follow-up action.'
              : 'Create a new follow-up action for this incident report.'}
          </p>
        </ModalHeader>

        <ModalBody>
          <FollowUpActionForm
            incidentId={incidentId}
            action={action}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddFollowUpDialog;
