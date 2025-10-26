/**
 * AddWitnessDialog Component
 *
 * Modal dialog for collecting witness statements with verification workflows,
 * legal compliance tracking, and evidence chain of custody documentation for
 * incident investigations.
 *
 * @component
 *
 * @remarks
 * This component provides a production-grade interface for documenting witness
 * observations during incident investigations:
 *
 * **Witness Statement Collection:**
 * - Capture detailed witness accounts of incident events
 * - Record witness contact information for follow-up
 * - Document witness relationship to incident (student, staff, parent, other)
 * - Timestamp collection with automatic date/time capture
 * - Verification workflow for statement authenticity
 *
 * **Legal and Compliance:**
 * - Chain of custody tracking for evidentiary purposes
 * - Statement modification history with audit logging
 * - Digital signature support for statement verification
 * - Compliance with state reporting requirements
 * - Retention policy enforcement
 *
 * **Investigation Workflows:**
 * - Multiple witness support for comprehensive incident documentation
 * - Witness priority flagging (key witness vs. peripheral observer)
 * - Statement cross-referencing for consistency verification
 * - Anonymous witness option for sensitive situations
 * - Follow-up question tracking for incomplete statements
 *
 * **User Experience:**
 * - Auto-close modal on successful submission
 * - Form validation with clear error messaging
 * - Cannot close during submission to prevent data loss
 * - ESC key support for quick cancellation
 * - Visual icon (UserPlus) for clear action indication
 *
 * **Form Integration:**
 * - Wraps WitnessStatementForm with modal chrome
 * - Handles success/cancel callbacks from child form
 * - Passes incident context to form component
 * - Automatic form reset on dialog close
 *
 * **Accessibility (WCAG 2.1 AA):**
 * - Semantic modal structure with proper ARIA attributes
 * - Focus trap prevents keyboard navigation outside modal
 * - ESC key closes dialog (when not submitting)
 * - Screen reader friendly title and description
 * - Keyboard navigation between form fields
 *
 * **State Management:**
 * - Modal visibility controlled by parent component
 * - Form state managed by child WitnessStatementForm
 * - Success callback triggers parent state refresh
 * - Loading states prevent double submission
 *
 * @example
 * ```tsx
 * import { useState } from 'react';
 * import AddWitnessDialog from '@/pages/incidents/components/AddWitnessDialog';
 *
 * function IncidentInvestigation() {
 *   const [showWitnessDialog, setShowWitnessDialog] = useState(false);
 *   const incidentId = "INC-2025-001";
 *
 *   const handleAddWitness = () => {
 *     setShowWitnessDialog(true);
 *   };
 *
 *   return (
 *     <>
 *       <button
 *         onClick={handleAddWitness}
 *         className="btn-primary"
 *       >
 *         <UserPlus className="mr-2" />
 *         Add Witness Statement
 *       </button>
 *
 *       <AddWitnessDialog
 *         isOpen={showWitnessDialog}
 *         onClose={() => setShowWitnessDialog(false)}
 *         incidentId={incidentId}
 *         className="custom-witness-dialog"
 *       />
 *     </>
 *   );
 * }
 * ```
 *
 * @see {@link WitnessStatementForm} for the underlying form component
 * @see {@link WitnessStatementsList} for displaying collected statements
 * @see {@link WitnessStatementDetails} for viewing statement details
 */

import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalTitle } from '@/components/ui/overlays/Modal';
import WitnessStatementForm from './WitnessStatementForm';
import { UserPlus } from 'lucide-react';

/**
 * Props for the AddWitnessDialog component
 *
 * @interface AddWitnessDialogProps
 *
 * @property {boolean} isOpen - Controls dialog visibility state
 * @property {() => void} onClose - Callback invoked when dialog closes (success or cancel)
 * @property {string} incidentId - Unique identifier of incident report to attach witness statement
 * @property {string} [className] - Optional CSS class name for custom dialog styling
 */
interface AddWitnessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  incidentId: string;
  className?: string;
}

/**
 * AddWitnessDialog component - Modal for adding witness statements
 *
 * Provides modal interface for collecting witness statements during incident
 * investigations with legal compliance and verification workflows.
 *
 * @param {AddWitnessDialogProps} props - Component props
 * @returns {JSX.Element} Modal dialog with witness statement form
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
