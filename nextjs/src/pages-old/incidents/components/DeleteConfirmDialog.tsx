/**
 * DeleteConfirmDialog Component
 *
 * Specialized delete confirmation dialog with extra safety measures.
 * Red warning styling, "cannot undo" messaging, and optional type-to-confirm for critical items.
 *
 * @component
 */

import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalTitle,
} from '@/components/ui/overlays/Modal';
import { Button } from '@/components/ui/Button';

export interface DeleteConfirmDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Callback when dialog should close */
  onClose: () => void;
  /** Callback when user confirms deletion */
  onConfirm: () => void;
  /** Name of the item being deleted (e.g., "Incident Report #1234") */
  itemName: string;
  /** Type of item being deleted (e.g., "incident report", "witness statement") */
  itemType: string;
  /** Show loading state during deletion */
  loading?: boolean;
  /** Require typing item name to confirm (for critical items) */
  requireConfirmation?: boolean;
  /** Custom warning message (optional) */
  warningMessage?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * DeleteConfirmDialog component - Specialized delete confirmation
 *
 * Production-grade delete confirmation with:
 * - Red warning styling for destructive actions
 * - Clear "cannot undo" messaging
 * - Optional type-to-confirm for critical deletions
 * - Loading state during deletion
 * - Prevents accidental clicks with confirmation input
 * - Accessible keyboard navigation
 * - Healthcare-compliant design patterns
 *
 * @example
 * ```tsx
 * // Basic usage
 * <DeleteConfirmDialog
 *   isOpen={showDelete}
 *   onClose={() => setShowDelete(false)}
 *   onConfirm={handleDelete}
 *   itemName="Incident Report #1234"
 *   itemType="incident report"
 *   loading={isDeleting}
 * />
 *
 * // With confirmation requirement
 * <DeleteConfirmDialog
 *   isOpen={showDelete}
 *   onClose={() => setShowDelete(false)}
 *   onConfirm={handleDelete}
 *   itemName="Critical Incident Report"
 *   itemType="incident report"
 *   requireConfirmation={true}
 *   loading={isDeleting}
 * />
 * ```
 */
const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType,
  loading = false,
  requireConfirmation = false,
  warningMessage,
  className = '',
}) => {
  const [confirmText, setConfirmText] = useState('');
  const [canDelete, setCanDelete] = useState(!requireConfirmation);

  // Reset confirmation when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setConfirmText('');
      setCanDelete(!requireConfirmation);
    }
  }, [isOpen, requireConfirmation]);

  // Validate confirmation text matches item name
  useEffect(() => {
    if (requireConfirmation) {
      setCanDelete(confirmText.trim() === itemName.trim());
    }
  }, [confirmText, itemName, requireConfirmation]);

  const handleConfirm = () => {
    if (canDelete && !loading) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (!loading) {
      onClose();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && canDelete && !loading) {
      handleConfirm();
    }
  };

  const defaultWarningMessage = `This action cannot be undone. The ${itemType} and all associated data will be permanently deleted.`;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size="md"
      centered
      closeOnBackdropClick={!loading}
      closeOnEscapeKey={!loading}
      showCloseButton={!loading}
    >
      <ModalContent className={className}>
        <ModalHeader divider={false}>
          <div className="flex items-start space-x-4">
            {/* Danger Icon */}
            <div
              className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-danger-100 dark:bg-danger-900"
              aria-hidden="true"
            >
              <svg
                className="h-6 w-6 text-danger-600 dark:text-danger-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            {/* Title */}
            <div className="flex-1 pt-1">
              <ModalTitle>Delete {itemType}?</ModalTitle>
            </div>
          </div>
        </ModalHeader>

        <ModalBody>
          <div className="pl-16 space-y-4">
            {/* Item being deleted */}
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Are you sure you want to delete:
              </p>
              <p className="mt-1 text-sm font-semibold text-danger-700 dark:text-danger-400">
                {itemName}
              </p>
            </div>

            {/* Warning message */}
            <div className="bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-md p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-danger-600 dark:text-danger-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-danger-800 dark:text-danger-300">
                    {warningMessage || defaultWarningMessage}
                  </p>
                </div>
              </div>
            </div>

            {/* Optional confirmation input */}
            {requireConfirmation && (
              <div>
                <label
                  htmlFor="delete-confirm-input"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Type <span className="font-semibold">{itemName}</span> to confirm deletion:
                </label>
                <input
                  id="delete-confirm-input"
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  autoFocus
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-danger-500 focus:border-danger-500 dark:bg-gray-800 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder={itemName}
                  autoComplete="off"
                />
                {confirmText.length > 0 && !canDelete && (
                  <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
                    Confirmation text does not match. Please type exactly: {itemName}
                  </p>
                )}
              </div>
            )}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
            type="button"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            loading={loading}
            disabled={!canDelete || loading}
            type="button"
            autoFocus={!requireConfirmation}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmDialog;
