/**
 * SendNotificationDialog Component
 *
 * Modal dialog for sending or resending parent notifications for incidents.
 * Provides form interface for selecting notification method, recipients, and message.
 *
 * @module pages/incidents/components/SendNotificationDialog
 */

import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalTitle
} from '@/components/ui/overlays/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import { Alert } from '@/components/ui/feedback/Alert';
import { LoadingSpinner } from '@/components/ui/feedback/LoadingSpinner';
import {
  Mail,
  MessageSquare,
  Phone,
  Send,
  X,
  AlertTriangle,
  Eye,
  Users
} from 'lucide-react';
import { ParentNotificationMethod } from '@/types/incidents';
import { cn } from '@/utils/cn';

/**
 * Contact recipient information
 */
export interface NotificationRecipient {
  id: string;
  name: string;
  relationship: string;
  email?: string;
  phone?: string;
  isPrimary?: boolean;
}

/**
 * Props for SendNotificationDialog component
 */
export interface SendNotificationDialogProps {
  /** Whether dialog is open */
  isOpen: boolean;
  /** Callback when dialog closes */
  onClose: () => void;
  /** Incident ID to send notification for */
  incidentId: string;
  /** Available recipients (parents/guardians) */
  recipients?: NotificationRecipient[];
  /** Loading state while sending */
  isLoading?: boolean;
  /** Error state */
  error?: Error | null;
  /** Success callback after sending */
  onSuccess?: () => void;
  /** Callback to send notification */
  onSend?: (data: NotificationFormData) => Promise<void>;
  /** Pre-filled notification data (for resending) */
  initialData?: Partial<NotificationFormData>;
}

/**
 * Form data for sending notification
 */
export interface NotificationFormData {
  recipientIds: string[];
  methods: ParentNotificationMethod[];
  customMessage?: string;
  isUrgent: boolean;
  includeIncidentDetails: boolean;
}

/**
 * Default notification message template
 */
const getDefaultMessage = (isUrgent: boolean): string => {
  if (isUrgent) {
    return `[URGENT] Your child was involved in an incident at school. Please contact the school nurse immediately for details.`;
  }
  return `Your child was involved in an incident at school. The school nurse would like to inform you of the details. Please contact us at your earliest convenience.`;
};

/**
 * SendNotificationDialog - Modal for sending/resending parent notifications
 *
 * Interactive modal dialog for configuring and sending parent notifications.
 * Allows selection of notification methods, recipients, custom messages, and urgency.
 *
 * **Features:**
 * - Multiple notification methods (Email, SMS, Voice)
 * - Multi-recipient selection
 * - Custom message composition
 * - Message preview
 * - Urgent notification flag
 * - Incident details inclusion toggle
 * - Form validation
 * - Loading and error states
 * - HIPAA-compliant messaging
 *
 * @component
 * @param {SendNotificationDialogProps} props - Component props
 * @returns {JSX.Element} Rendered dialog
 *
 * @example
 * ```tsx
 * <SendNotificationDialog
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   incidentId="incident-123"
 *   recipients={recipients}
 *   onSend={handleSend}
 * />
 * ```
 */
export const SendNotificationDialog: React.FC<SendNotificationDialogProps> = ({
  isOpen,
  onClose,
  incidentId,
  recipients = [],
  isLoading = false,
  error = null,
  onSuccess,
  onSend,
  initialData
}) => {
  // Form state
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [selectedMethods, setSelectedMethods] = useState<ParentNotificationMethod[]>([
    ParentNotificationMethod.EMAIL
  ]);
  const [customMessage, setCustomMessage] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [includeDetails, setIncludeDetails] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  /**
   * Initialize form with initial data or defaults
   */
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setSelectedRecipients(initialData.recipientIds || []);
        setSelectedMethods(initialData.methods || [ParentNotificationMethod.EMAIL]);
        setCustomMessage(initialData.customMessage || '');
        setIsUrgent(initialData.isUrgent || false);
        setIncludeDetails(initialData.includeIncidentDetails ?? true);
      } else {
        // Select primary recipients by default
        const primaryRecipients = recipients
          .filter((r) => r.isPrimary)
          .map((r) => r.id);
        if (primaryRecipients.length > 0) {
          setSelectedRecipients(primaryRecipients);
        }
      }
    }
  }, [isOpen, initialData, recipients]);

  /**
   * Reset form when dialog closes
   */
  useEffect(() => {
    if (!isOpen) {
      setSelectedRecipients([]);
      setSelectedMethods([ParentNotificationMethod.EMAIL]);
      setCustomMessage('');
      setIsUrgent(false);
      setIncludeDetails(true);
      setShowPreview(false);
      setValidationErrors([]);
    }
  }, [isOpen]);

  /**
   * Toggle recipient selection
   */
  const toggleRecipient = (recipientId: string) => {
    setSelectedRecipients((prev) =>
      prev.includes(recipientId)
        ? prev.filter((id) => id !== recipientId)
        : [...prev, recipientId]
    );
  };

  /**
   * Toggle notification method
   */
  const toggleMethod = (method: ParentNotificationMethod) => {
    setSelectedMethods((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method]
    );
  };

  /**
   * Validate form before submission
   */
  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (selectedRecipients.length === 0) {
      errors.push('Please select at least one recipient');
    }

    if (selectedMethods.length === 0) {
      errors.push('Please select at least one notification method');
    }

    // Validate that selected methods are available for recipients
    const selectedRecipientData = recipients.filter((r) =>
      selectedRecipients.includes(r.id)
    );

    if (selectedMethods.includes(ParentNotificationMethod.EMAIL)) {
      const hasEmail = selectedRecipientData.some((r) => r.email);
      if (!hasEmail) {
        errors.push('Email selected but no recipients have email addresses');
      }
    }

    if (
      selectedMethods.includes(ParentNotificationMethod.SMS) ||
      selectedMethods.includes(ParentNotificationMethod.VOICE)
    ) {
      const hasPhone = selectedRecipientData.some((r) => r.phone);
      if (!hasPhone) {
        errors.push('SMS/Voice selected but no recipients have phone numbers');
      }
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (!onSend) {
      console.warn('No onSend handler provided');
      return;
    }

    const formData: NotificationFormData = {
      recipientIds: selectedRecipients,
      methods: selectedMethods,
      customMessage: customMessage.trim() || undefined,
      isUrgent,
      includeIncidentDetails: includeDetails
    };

    try {
      await onSend(formData);
      onSuccess?.();
      onClose();
    } catch (err) {
      // Error handled by parent component
      console.error('Failed to send notification:', err);
    }
  };

  /**
   * Get preview message
   */
  const getPreviewMessage = (): string => {
    const baseMessage = customMessage.trim() || getDefaultMessage(isUrgent);
    const urgentPrefix = isUrgent && !customMessage.includes('[URGENT]') ? '[URGENT] ' : '';
    return `${urgentPrefix}${baseMessage}`;
  };

  /**
   * Get method icon
   */
  const getMethodIcon = (method: ParentNotificationMethod) => {
    switch (method) {
      case ParentNotificationMethod.EMAIL:
        return Mail;
      case ParentNotificationMethod.SMS:
        return MessageSquare;
      case ParentNotificationMethod.VOICE:
        return Phone;
      default:
        return Mail;
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size="lg"
      centered
      closeOnBackdropClick={!isLoading}
      closeOnEscapeKey={!isLoading}
      showCloseButton={!isLoading}
    >
      <ModalContent>
        <ModalHeader divider>
          <ModalTitle>Send Parent Notification</ModalTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Notify parents/guardians about this incident via email, SMS, or phone call.
          </p>
        </ModalHeader>

        <ModalBody>
          {/* Error Alert */}
          {error && (
            <Alert variant="error" title="Failed to Send Notification" className="mb-4">
              {error.message || 'An error occurred while sending the notification.'}
            </Alert>
          )}

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <Alert variant="warning" title="Please Fix the Following:" className="mb-4">
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((err, index) => (
                  <li key={index} className="text-sm">
                    {err}
                  </li>
                ))}
              </ul>
            </Alert>
          )}

          <div className="space-y-6">
            {/* Recipients Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <Users className="inline h-4 w-4 mr-1" />
                Select Recipients
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md p-3">
                {recipients.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No contacts available for this student
                  </p>
                ) : (
                  recipients.map((recipient) => (
                    <label
                      key={recipient.id}
                      className={cn(
                        'flex items-start gap-3 p-2 rounded-md cursor-pointer transition-colors',
                        'hover:bg-gray-50 dark:hover:bg-gray-800',
                        selectedRecipients.includes(recipient.id) &&
                          'bg-blue-50 dark:bg-blue-900/20'
                      )}
                    >
                      <Checkbox
                        checked={selectedRecipients.includes(recipient.id)}
                        onChange={() => toggleRecipient(recipient.id)}
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {recipient.name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({recipient.relationship})
                          </span>
                          {recipient.isPrimary && (
                            <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-1.5 py-0.5 rounded">
                              Primary
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5 mt-1">
                          {recipient.email && <div>Email: {recipient.email}</div>}
                          {recipient.phone && <div>Phone: {recipient.phone}</div>}
                        </div>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Notification Methods */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Notification Method(s)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  ParentNotificationMethod.EMAIL,
                  ParentNotificationMethod.SMS,
                  ParentNotificationMethod.VOICE
                ].map((method) => {
                  const Icon = getMethodIcon(method);
                  const isSelected = selectedMethods.includes(method);
                  const label =
                    method === ParentNotificationMethod.EMAIL
                      ? 'Email'
                      : method === ParentNotificationMethod.SMS
                      ? 'SMS'
                      : 'Voice Call';

                  return (
                    <button
                      key={method}
                      type="button"
                      onClick={() => toggleMethod(method)}
                      className={cn(
                        'flex items-center gap-2 p-3 rounded-lg border-2 transition-all',
                        'hover:border-blue-300 dark:hover:border-blue-700',
                        isSelected
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500'
                          : 'border-gray-200 dark:border-gray-700'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-5 w-5',
                          isSelected
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 dark:text-gray-400'
                        )}
                      />
                      <span
                        className={cn(
                          'font-medium',
                          isSelected
                            ? 'text-blue-900 dark:text-blue-200'
                            : 'text-gray-700 dark:text-gray-300'
                        )}
                      >
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Message */}
            <div>
              <label
                htmlFor="custom-message"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Custom Message (Optional)
              </label>
              <Textarea
                id="custom-message"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder={getDefaultMessage(isUrgent)}
                rows={4}
                maxLength={500}
                className="w-full"
              />
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Leave blank to use default message
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {customMessage.length}/500
                </p>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox checked={isUrgent} onChange={(e) => setIsUrgent(e.target.checked)} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      Mark as Urgent
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    Will add [URGENT] prefix and prioritize delivery
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={includeDetails}
                  onChange={(e) => setIncludeDetails(e.target.checked)}
                />
                <div className="flex-1">
                  <span className="font-medium text-gray-900 dark:text-white">
                    Include Incident Details
                  </span>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    Attach incident summary and report link (HIPAA-compliant)
                  </p>
                </div>
              </label>
            </div>

            {/* Preview Button */}
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="w-full"
              >
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? 'Hide Preview' : 'Preview Message'}
              </Button>

              {showPreview && (
                <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message Preview:
                  </div>
                  <div className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                    {getPreviewMessage()}
                  </div>
                  {includeDetails && (
                    <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
                      <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                        + Incident details and secure link will be included
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </ModalBody>

        <ModalFooter divider>
          <div className="flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={onClose} disabled={isLoading}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Notification
                </>
              )}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

SendNotificationDialog.displayName = 'SendNotificationDialog';

export default React.memo(SendNotificationDialog);
