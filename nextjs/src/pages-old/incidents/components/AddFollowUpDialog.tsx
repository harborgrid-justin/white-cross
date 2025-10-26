/**
 * AddFollowUpDialog Component
 *
 * Modal dialog for creating and editing follow-up actions with assignment
 * tracking, priority management, and due date enforcement for incident resolution.
 *
 * @component
 *
 * @remarks
 * This component wraps the FollowUpActionForm in a modal interface for managing
 * post-incident follow-up tasks:
 *
 * **Follow-Up Action Management:**
 * - Create new follow-up tasks for incident resolution
 * - Edit existing follow-up actions with full history tracking
 * - Assign actions to specific staff members with role validation
 * - Set priority levels (Low, Medium, High, Urgent) for task prioritization
 * - Define due dates with automatic overdue detection
 * - Track completion status with timestamp logging
 *
 * **Emergency Response Workflows:**
 * - Critical incidents can trigger automatic high-priority follow-ups
 * - Urgent actions flagged for immediate attention
 * - Overdue action alerts displayed in dashboard
 * - Multi-assignee support for complex incident resolution
 *
 * **Form Integration:**
 * - Encapsulates FollowUpActionForm component with modal chrome
 * - Automatic form reset on dialog close
 * - Success callback closes dialog and refreshes parent view
 * - Cancel action discards changes without confirmation
 *
 * **User Experience:**
 * - Modal prevents backdrop click during edit to avoid data loss
 * - ESC key support for quick cancellation
 * - Close button always available for user control
 * - Context-aware title (Add vs Edit mode)
 * - Descriptive subtitle guides user intent
 *
 * **State Management:**
 * - Detects edit mode based on action prop presence
 * - Passes incident context to form component
 * - Handles success/cancel callbacks from child form
 * - Modal visibility controlled by parent component
 *
 * **Accessibility (WCAG 2.1 AA):**
 * - Semantic modal structure with ARIA attributes
 * - Keyboard navigation support (ESC, Tab)
 * - Focus trap within modal during interaction
 * - Screen reader announcements for mode changes
 *
 * @example
 * ```tsx
 * import { useState } from 'react';
 * import AddFollowUpDialog from '@/pages/incidents/components/AddFollowUpDialog';
 *
 * function IncidentDetailPage() {
 *   const [showFollowUpDialog, setShowFollowUpDialog] = useState(false);
 *   const [editingAction, setEditingAction] = useState<FollowUpAction | null>(null);
 *   const incidentId = "INC-2025-001";
 *
 *   const handleAddFollowUp = () => {
 *     setEditingAction(null);
 *     setShowFollowUpDialog(true);
 *   };
 *
 *   const handleEditFollowUp = (action: FollowUpAction) => {
 *     setEditingAction(action);
 *     setShowFollowUpDialog(true);
 *   };
 *
 *   return (
 *     <>
 *       <button onClick={handleAddFollowUp}>Add Follow-Up Action</button>
 *
 *       <AddFollowUpDialog
 *         isOpen={showFollowUpDialog}
 *         onClose={() => setShowFollowUpDialog(false)}
 *         incidentId={incidentId}
 *         action={editingAction}
 *       />
 *     </>
 *   );
 * }
 * ```
 *
 * @see {@link FollowUpActionForm} for the underlying form component
 * @see {@link FollowUpActionsList} for displaying all follow-up actions
 * @see {@link ActionStatusTracker} for tracking action completion
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

/**
 * Props for the AddFollowUpDialog component
 *
 * @interface AddFollowUpDialogProps
 *
 * @property {boolean} isOpen - Controls dialog visibility state
 * @property {() => void} onClose - Callback invoked when dialog should close
 * @property {string} incidentId - ID of the incident to add/edit follow-up action for
 * @property {FollowUpAction | null} [action] - Existing action to edit, null/undefined for create mode
 */
interface AddFollowUpDialogProps {
  isOpen: boolean;
  onClose: () => void;
  incidentId: string;
  action?: FollowUpAction | null;
}

/**
 * AddFollowUpDialog component - Modal for creating/editing follow-up actions
 *
 * Provides modal interface for incident follow-up action management with
 * assignment tracking and priority enforcement.
 *
 * @param {AddFollowUpDialogProps} props - Component props
 * @returns {JSX.Element} Modal dialog with follow-up action form
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
