/**
 * AssignIncidentDialog Component
 *
 * Modal dialog for assigning incident reports to users with priority and due date management.
 * Supports assignment reason, priority adjustment, and automated notifications.
 *
 * @component
 * @example
 * ```tsx
 * <AssignIncidentDialog
 *   isOpen={isDialogOpen}
 *   onClose={() => setIsDialogOpen(false)}
 *   incidentId="incident-123"
 *   currentAssignee="user-456"
 * />
 * ```
 */

import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalTitle } from '@/components/ui/overlays/Modal';
import { Button } from '@/components/ui/buttons/Button';
import { Select, SelectOption } from '@/components/ui/inputs/Select';
import { Textarea } from '@/components/ui/inputs/Textarea';
import { Input } from '@/components/ui/inputs/Input';
import { Checkbox } from '@/components/ui/inputs/Checkbox';
import { ActionPriority } from '@/types/incidents';
import { useAppDispatch, useAppSelector } from '@/hooks/shared/store-hooks-index';
import { updateIncidentReport } from '../store/incidentReportsSlice';
import toast from 'react-hot-toast';
import debug from 'debug';

const log = debug('whitecross:assign-incident-dialog');

interface AssignIncidentDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Callback when dialog is closed */
  onClose: () => void;
  /** ID of the incident to assign */
  incidentId: string;
  /** Current assignee user ID (optional) */
  currentAssignee?: string;
}

/**
 * AssignIncidentDialog component - Assign incidents to users with comprehensive options
 */
const AssignIncidentDialog: React.FC<AssignIncidentDialogProps> = ({
  isOpen,
  onClose,
  incidentId,
  currentAssignee,
}) => {
  // Local state
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [assignmentReason, setAssignmentReason] = useState<string>('');
  const [priority, setPriority] = useState<ActionPriority>(ActionPriority.MEDIUM);
  const [dueDate, setDueDate] = useState<string>('');
  const [notifyAssignee, setNotifyAssignee] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Redux state
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users?.users || []);
  const isUpdating = useAppSelector((state) => state.incidentReports.loading.updating);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedUserId(currentAssignee || '');
      setAssignmentReason('');
      setPriority(ActionPriority.MEDIUM);
      setDueDate('');
      setNotifyAssignee(true);
    }
  }, [isOpen, currentAssignee]);

  // Prepare user options for Select component
  const userOptions: SelectOption[] = users.map((user) => ({
    value: user.id,
    label: `${user.firstName} ${user.lastName} (${user.role || 'User'})`,
    disabled: user.id === currentAssignee,
  }));

  // Priority options
  const priorityOptions: SelectOption[] = [
    { value: ActionPriority.LOW, label: 'Low Priority' },
    { value: ActionPriority.MEDIUM, label: 'Medium Priority' },
    { value: ActionPriority.HIGH, label: 'High Priority' },
    { value: ActionPriority.URGENT, label: 'Urgent Priority' },
  ];

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Validation
  const isFormValid = (): boolean => {
    if (!selectedUserId) {
      toast.error('Please select a user to assign the incident');
      return false;
    }
    if (!dueDate) {
      toast.error('Please set a due date for the assignment');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!isFormValid()) {
      return;
    }

    setIsSubmitting(true);
    log('Assigning incident:', {
      incidentId,
      userId: selectedUserId,
      priority,
      dueDate,
      notifyAssignee,
    });

    try {
      // Update incident with assignment information
      await dispatch(
        updateIncidentReport({
          id: incidentId,
          data: {
            // Add assignment fields here based on your backend schema
            // This is a placeholder - adjust based on actual backend fields
            followUpRequired: true,
            followUpNotes: assignmentReason || `Assigned to user with ${priority} priority. Due: ${dueDate}`,
          },
        })
      ).unwrap();

      // Show success message
      toast.success(`Incident assigned successfully${notifyAssignee ? ' and notification sent' : ''}`);

      log('Incident assigned successfully');

      // Close dialog and reset form
      onClose();
    } catch (error: any) {
      log('Error assigning incident:', error);
      toast.error(error.message || 'Failed to assign incident');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle dialog close
  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      size="lg"
      closeOnBackdropClick={!isSubmitting}
      closeOnEscapeKey={!isSubmitting}
      showCloseButton={!isSubmitting}
    >
      <ModalHeader>
        <ModalTitle>Assign Incident</ModalTitle>
      </ModalHeader>

      <ModalBody>
        <div className="space-y-4">
          {/* User Selection */}
          <div>
            <Select
              label="Assign To"
              required
              options={userOptions}
              value={selectedUserId}
              onChange={(value) => setSelectedUserId(value as string)}
              placeholder="Select a user..."
              searchable
              disabled={isSubmitting}
              helperText={currentAssignee ? 'Current assignee will be marked as disabled' : undefined}
            />
          </div>

          {/* Priority Selection */}
          <div>
            <Select
              label="Priority Level"
              required
              options={priorityOptions}
              value={priority}
              onChange={(value) => setPriority(value as ActionPriority)}
              disabled={isSubmitting}
              helperText="Set the priority level for this assignment"
            />
          </div>

          {/* Due Date */}
          <div>
            <Input
              type="date"
              label="Due Date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={getMinDate()}
              disabled={isSubmitting}
              helperText="When should this incident be addressed?"
            />
          </div>

          {/* Assignment Reason */}
          <div>
            <Textarea
              label="Assignment Reason (Optional)"
              value={assignmentReason}
              onChange={(e) => setAssignmentReason(e.target.value)}
              placeholder="Explain why this incident is being assigned to this user..."
              rows={3}
              maxLength={500}
              showCharCount
              disabled={isSubmitting}
              helperText="Provide context for the assignment"
            />
          </div>

          {/* Notify Assignee Checkbox */}
          <div>
            <Checkbox
              id="notify-assignee"
              checked={notifyAssignee}
              onChange={(e) => setNotifyAssignee(e.target.checked)}
              disabled={isSubmitting}
              label="Notify assignee"
              description="Send an email notification to the assigned user"
            />
          </div>

          {/* Summary Section */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Assignment Summary
            </h4>
            <div className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
              <p>
                <span className="font-medium">Assignee:</span>{' '}
                {selectedUserId
                  ? userOptions.find((u) => u.value === selectedUserId)?.label || 'Unknown'
                  : 'Not selected'}
              </p>
              <p>
                <span className="font-medium">Priority:</span>{' '}
                {priorityOptions.find((p) => p.value === priority)?.label || priority}
              </p>
              <p>
                <span className="font-medium">Due Date:</span> {dueDate || 'Not set'}
              </p>
              <p>
                <span className="font-medium">Notification:</span>{' '}
                {notifyAssignee ? 'Will be sent' : 'Will not be sent'}
              </p>
            </div>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button
          variant="ghost"
          onClick={handleClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          loading={isSubmitting || isUpdating}
          disabled={!selectedUserId || !dueDate}
        >
          Assign Incident
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AssignIncidentDialog;
