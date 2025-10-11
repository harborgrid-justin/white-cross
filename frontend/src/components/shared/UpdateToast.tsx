/**
 * Update Toast Component
 *
 * Toast notifications for optimistic update success/failure.
 * Integrates with react-hot-toast for consistent notifications.
 *
 * @module UpdateToast
 * @version 1.0.0
 */

import React, { useEffect } from 'react';
import toast, { Toaster, Toast } from 'react-hot-toast';
import { optimisticUpdateManager, UpdateStatus, OptimisticUpdate } from '@/utils/optimisticUpdates';

// =====================
// TYPES
// =====================

export interface UpdateToastProps {
  /** Position of toasts */
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';

  /** Duration in milliseconds */
  duration?: number;

  /** Show toasts for confirmed updates */
  showConfirmed?: boolean;

  /** Show toasts for failed updates */
  showFailed?: boolean;

  /** Custom messages for operations */
  messages?: {
    create?: string;
    update?: string;
    delete?: string;
    bulkCreate?: string;
    bulkUpdate?: string;
    bulkDelete?: string;
  };
}

// =====================
// COMPONENT
// =====================

/**
 * UpdateToast - Displays toast notifications for optimistic updates
 *
 * @example
 * ```tsx
 * <UpdateToast
 *   position="top-right"
 *   showConfirmed={true}
 *   showFailed={true}
 * />
 * ```
 */
export const UpdateToast: React.FC<UpdateToastProps> = ({
  position = 'top-right',
  duration = 3000,
  showConfirmed = true,
  showFailed = true,
  messages = {},
}) => {
  useEffect(() => {
    // Track shown toasts to avoid duplicates
    const shownToasts = new Set<string>();

    // Subscribe to update changes
    const unsubscribe = optimisticUpdateManager.subscribe((update: OptimisticUpdate) => {
      // Skip if already shown
      if (shownToasts.has(update.id)) {
        return;
      }

      // Show toast based on status
      if (update.status === UpdateStatus.CONFIRMED && showConfirmed) {
        const message = getSuccessMessage(update, messages);
        toast.success(message, {
          duration,
          id: update.id,
        });
        shownToasts.add(update.id);
      } else if (
        (update.status === UpdateStatus.FAILED || update.status === UpdateStatus.ROLLED_BACK) &&
        showFailed
      ) {
        const message = getErrorMessage(update);
        toast.error(message, {
          duration: duration * 1.5, // Errors stay longer
          id: update.id,
        });
        shownToasts.add(update.id);
      }
    });

    // Cleanup
    return () => {
      unsubscribe();
    };
  }, [duration, showConfirmed, showFailed, messages]);

  return <Toaster position={position} />;
};

// =====================
// CUSTOM TOAST COMPONENTS
// =====================

/**
 * Custom toast with rollback button
 */
export const UpdateToastWithRollback: React.FC<{
  update: OptimisticUpdate;
  onRollback: () => void;
}> = ({ update, onRollback }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="font-medium text-gray-900">Update Failed</div>
        <div className="text-sm text-gray-500">
          {update.error?.message || 'An error occurred'}
        </div>
      </div>
      <button
        onClick={onRollback}
        className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
      >
        Undo
      </button>
    </div>
  );
};

/**
 * Progress toast for long-running operations
 */
export const ProgressToast: React.FC<{
  message: string;
  progress: number;
}> = ({ message, progress }) => {
  return (
    <div className="w-64">
      <div className="font-medium text-gray-900 mb-2">{message}</div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-xs text-gray-500 mt-1 text-right">{progress}%</div>
    </div>
  );
};

// =====================
// UTILITY FUNCTIONS
// =====================

function getSuccessMessage(
  update: OptimisticUpdate,
  customMessages: UpdateToastProps['messages'] = {}
): string {
  const defaultMessages: Record<string, string> = {
    CREATE: customMessages.create || 'Created successfully',
    UPDATE: customMessages.update || 'Updated successfully',
    DELETE: customMessages.delete || 'Deleted successfully',
    BULK_CREATE: customMessages.bulkCreate || 'Items created successfully',
    BULK_UPDATE: customMessages.bulkUpdate || 'Items updated successfully',
    BULK_DELETE: customMessages.bulkDelete || 'Items deleted successfully',
  };

  return defaultMessages[update.operationType] || 'Operation completed successfully';
}

function getErrorMessage(update: OptimisticUpdate): string {
  if (update.error?.message) {
    return update.error.message;
  }

  const defaultMessages: Record<string, string> = {
    CREATE: 'Failed to create item',
    UPDATE: 'Failed to update item',
    DELETE: 'Failed to delete item',
    BULK_CREATE: 'Failed to create items',
    BULK_UPDATE: 'Failed to update items',
    BULK_DELETE: 'Failed to delete items',
  };

  return defaultMessages[update.operationType] || 'Operation failed';
}

// =====================
// HELPER FUNCTIONS
// =====================

/**
 * Show a simple success toast
 */
export function showSuccessToast(message: string): void {
  toast.success(message);
}

/**
 * Show a simple error toast
 */
export function showErrorToast(message: string): void {
  toast.error(message);
}

/**
 * Show a loading toast that can be updated
 */
export function showLoadingToast(message: string): string {
  return toast.loading(message);
}

/**
 * Update a loading toast to success
 */
export function updateToastSuccess(toastId: string, message: string): void {
  toast.success(message, { id: toastId });
}

/**
 * Update a loading toast to error
 */
export function updateToastError(toastId: string, message: string): void {
  toast.error(message, { id: toastId });
}

/**
 * Dismiss a toast
 */
export function dismissToast(toastId: string): void {
  toast.dismiss(toastId);
}

/**
 * Show a toast with custom component
 */
export function showCustomToast(
  component: React.ReactNode,
  options?: {
    duration?: number;
    position?:
      | 'top-left'
      | 'top-center'
      | 'top-right'
      | 'bottom-left'
      | 'bottom-center'
      | 'bottom-right';
  }
): void {
  toast.custom(component, options);
}

/**
 * Show a promise-based toast that updates automatically
 */
export function showPromiseToast<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: Error) => string);
  }
): Promise<T> {
  return toast.promise(promise, messages);
}
