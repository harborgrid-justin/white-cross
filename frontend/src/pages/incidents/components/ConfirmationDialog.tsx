/**
 * ConfirmationDialog Component
 *
 * Reusable confirmation dialog with customizable variants for incidents module.
 * Provides accessible modal confirmation with variant styling (danger, warning, info).
 * Prevents accidental actions and supports ESC key to cancel.
 *
 * @component
 */

import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalTitle,
} from '@/components/ui/overlays/Modal';
import { Button } from '@/components/ui/buttons/Button';

/**
 * Confirmation dialog variant types
 * - danger: Red styling for destructive actions
 * - warning: Yellow/orange styling for caution
 * - info: Blue styling for informational confirmations
 */
export type ConfirmationVariant = 'danger' | 'warning' | 'info';

export interface ConfirmationDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Callback when dialog should close */
  onClose: () => void;
  /** Callback when user confirms the action */
  onConfirm: () => void;
  /** Dialog title */
  title: string;
  /** Confirmation message/description */
  message: string;
  /** Text for confirm button (default: "Confirm") */
  confirmText?: string;
  /** Text for cancel button (default: "Cancel") */
  cancelText?: string;
  /** Visual variant for the dialog (default: "info") */
  variant?: ConfirmationVariant;
  /** Show loading state on confirm button */
  loading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Variant configurations for visual styling
 * Each variant includes icon, colors, and button styles
 */
const variantConfig: Record<ConfirmationVariant, {
  icon: JSX.Element;
  iconBgColor: string;
  iconTextColor: string;
  buttonVariant: 'danger' | 'warning' | 'info';
}> = {
  danger: {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    iconBgColor: 'bg-danger-100 dark:bg-danger-900',
    iconTextColor: 'text-danger-600 dark:text-danger-400',
    buttonVariant: 'danger',
  },
  warning: {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    iconBgColor: 'bg-warning-100 dark:bg-warning-900',
    iconTextColor: 'text-warning-600 dark:text-warning-400',
    buttonVariant: 'warning',
  },
  info: {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    iconBgColor: 'bg-info-100 dark:bg-info-900',
    iconTextColor: 'text-info-600 dark:text-info-400',
    buttonVariant: 'info',
  },
};

/**
 * ConfirmationDialog component - Reusable confirmation dialog
 *
 * Production-grade confirmation dialog with:
 * - Customizable variants (danger, warning, info)
 * - Accessible keyboard navigation (ESC to cancel, Tab for focus trap)
 * - Loading state support
 * - Backdrop click prevention during confirmation
 * - Healthcare-compliant design patterns
 *
 * @example
 * ```tsx
 * <ConfirmationDialog
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onConfirm={handleSubmit}
 *   title="Submit Incident Report"
 *   message="Are you sure you want to submit this incident report? This action will notify the appropriate staff members."
 *   variant="info"
 *   confirmText="Submit Report"
 * />
 * ```
 */
const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
  loading = false,
  className = '',
}) => {
  const config = variantConfig[variant];

  const handleConfirm = () => {
    if (!loading) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (!loading) {
      onClose();
    }
  };

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
            {/* Icon */}
            <div
              className={`flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${config.iconBgColor}`}
              aria-hidden="true"
            >
              <span className={config.iconTextColor}>
                {config.icon}
              </span>
            </div>

            {/* Title */}
            <div className="flex-1 pt-1">
              <ModalTitle>{title}</ModalTitle>
            </div>
          </div>
        </ModalHeader>

        <ModalBody>
          <div className="pl-16">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {message}
            </p>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
            type="button"
          >
            {cancelText}
          </Button>
          <Button
            variant={config.buttonVariant}
            onClick={handleConfirm}
            loading={loading}
            disabled={loading}
            type="button"
            autoFocus
          >
            {confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationDialog;
