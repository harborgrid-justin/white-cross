import React, { useState } from 'react';
import { Modal } from '@/components/ui/overlays/Modal';
import { Button } from '@/components/ui/buttons/Button';
import { AlertTriangle, AlertCircle, Info, CheckCircle, HelpCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

/**
 * ConfirmationDialog props
 */
export interface ConfirmationDialogProps {
  /** Whether dialog is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Confirm handler */
  onConfirm: () => void | Promise<void>;
  /** Dialog title */
  title: string;
  /** Dialog message/description */
  message: string;
  /** Confirm button label */
  confirmLabel?: string;
  /** Cancel button label */
  cancelLabel?: string;
  /** Variant for styling */
  variant?: 'danger' | 'warning' | 'info' | 'success' | 'question';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show loading state on confirm */
  loading?: boolean;
  /** Require confirmation input (type confirmation phrase) */
  requireConfirmation?: boolean;
  /** Confirmation phrase to type */
  confirmationPhrase?: string;
  /** Additional content */
  children?: React.ReactNode;
  /** Auto-focus confirm button */
  autoFocusConfirm?: boolean;
  /** Custom icon */
  icon?: React.ElementType;
}

const variantConfig = {
  danger: {
    icon: AlertTriangle,
    iconColor: 'text-red-500 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/20',
    confirmVariant: 'destructive' as const
  },
  warning: {
    icon: AlertCircle,
    iconColor: 'text-yellow-500 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    confirmVariant: 'warning' as const
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-500 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    confirmVariant: 'primary' as const
  },
  success: {
    icon: CheckCircle,
    iconColor: 'text-green-500 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
    confirmVariant: 'success' as const
  },
  question: {
    icon: HelpCircle,
    iconColor: 'text-gray-500 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    confirmVariant: 'primary' as const
  }
};

/**
 * ConfirmationDialog - Modal dialog for confirming actions
 *
 * @example
 * ```tsx
 * <ConfirmationDialog
 *   isOpen={showDeleteConfirm}
 *   onClose={() => setShowDeleteConfirm(false)}
 *   onConfirm={handleDelete}
 *   variant="danger"
 *   title="Delete Student"
 *   message="Are you sure you want to delete this student? This action cannot be undone."
 *   confirmLabel="Delete"
 *   requireConfirmation
 *   confirmationPhrase="DELETE"
 * />
 * ```
 */
export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'question',
  size = 'md',
  loading = false,
  requireConfirmation = false,
  confirmationPhrase = 'CONFIRM',
  children,
  autoFocusConfirm = false,
  icon: CustomIcon
}) => {
  const [confirmationInput, setConfirmationInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const config = variantConfig[variant];
  const Icon = CustomIcon || config.icon;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm();
      setConfirmationInput('');
      onClose();
    } catch (error) {
      console.error('Confirmation action failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting && !loading) {
      setConfirmationInput('');
      onClose();
    }
  };

  const isConfirmDisabled = requireConfirmation
    ? confirmationInput !== confirmationPhrase
    : false;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      size={size}
      closeOnOverlayClick={!isSubmitting && !loading}
    >
      <div className="space-y-4">
        {/* Icon and Title */}
        <div className="flex items-start gap-4">
          <div className={cn('flex-shrink-0 rounded-full p-3', config.bgColor)}>
            <Icon className={cn('h-6 w-6', config.iconColor)} aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {message}
            </p>
          </div>
        </div>

        {/* Additional Content */}
        {children && (
          <div className="pl-16">
            {children}
          </div>
        )}

        {/* Confirmation Input */}
        {requireConfirmation && (
          <div className="pl-16 space-y-2">
            <label
              htmlFor="confirmation-input"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Type <span className="font-mono font-bold">{confirmationPhrase}</span> to confirm
            </label>
            <input
              id="confirmation-input"
              type="text"
              value={confirmationInput}
              onChange={(e) => setConfirmationInput(e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-gray-200 transition-all duration-200"
              placeholder={confirmationPhrase}
              autoFocus={!autoFocusConfirm}
              disabled={isSubmitting || loading}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting || loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={config.confirmVariant}
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            isLoading={isSubmitting || loading}
            autoFocus={autoFocusConfirm && !requireConfirmation}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

ConfirmationDialog.displayName = 'ConfirmationDialog';

export default React.memo(ConfirmationDialog);
