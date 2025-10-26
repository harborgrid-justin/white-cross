'use client';

/**
 * WF-COMP-086 | RollbackButton.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: @tanstack/react-query, @/utils/optimisticUpdates, @/utils/optimisticHelpers
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, functions, interfaces | Key Features: useState, functional component, component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Rollback Button Component
 *
 * Button component for manually rolling back optimistic updates.
 * Can be used in modals, toasts, or inline with update indicators.
 *
 * @module RollbackButton
 * @version 1.0.0
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { optimisticUpdateManager } from '@/utils/optimisticUpdates';
import { rollbackUpdate } from '@/utils/optimisticHelpers';

// =====================
// TYPES
// =====================

/**
 * Props for the RollbackButton component.
 *
 * @interface RollbackButtonProps
 *
 * @property {string} updateId - Unique identifier of the optimistic update to rollback
 * @property {('primary' | 'secondary' | 'danger' | 'ghost')} [variant='secondary'] - Visual style variant
 *   - primary: Blue action button
 *   - secondary: Gray neutral button
 *   - danger: Red warning button (recommended for rollback actions)
 *   - ghost: Transparent minimal button
 * @property {('sm' | 'md' | 'lg')} [size='md'] - Button size affecting padding and text
 * @property {boolean} [confirmBeforeRollback=true] - Whether to show inline confirmation before rollback
 * @property {string} [confirmMessage='Are you sure you want to undo this change?'] - Confirmation prompt text
 * @property {() => void} [onRollback] - Callback function executed after successful rollback
 * @property {string} [text='Undo'] - Button label text
 * @property {boolean} [showIcon=true] - Whether to display the undo icon
 * @property {boolean} [disabled=false] - Whether the button is disabled
 * @property {boolean} [fullWidth=false] - Whether to expand button to full container width
 * @property {string} [className=''] - Additional CSS classes to apply
 */
export interface RollbackButtonProps {
  /** Update ID to rollback */
  updateId: string;

  /** Button variant */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';

  /** Button size */
  size?: 'sm' | 'md' | 'lg';

  /** Show confirmation dialog */
  confirmBeforeRollback?: boolean;

  /** Confirmation message */
  confirmMessage?: string;

  /** Callback after rollback */
  onRollback?: () => void;

  /** Custom button text */
  text?: string;

  /** Show icon */
  showIcon?: boolean;

  /** Disabled state */
  disabled?: boolean;

  /** Full width */
  fullWidth?: boolean;

  /** Custom className */
  className?: string;
}

// =====================
// COMPONENT
// =====================

/**
 * RollbackButton - Manually rollback optimistic updates
 *
 * @example
 * ```tsx
 * <RollbackButton
 *   updateId={updateId}
 *   variant="danger"
 *   confirmBeforeRollback={true}
 *   onRollback={() => console.log('Rolled back')}
 * />
 * ```
 */
// Memoized RollbackButton component
export const RollbackButton = React.memo<RollbackButtonProps>(({
  updateId,
  variant = 'secondary',
  size = 'md',
  confirmBeforeRollback = true,
  confirmMessage = 'Are you sure you want to undo this change?',
  onRollback,
  text = 'Undo',
  showIcon = true,
  disabled = false,
  fullWidth = false,
  className = '',
}) => {
  const queryClient = useQueryClient();
  const [isRollingBack, setIsRollingBack] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Memoize rollback handler
  const handleRollback = useCallback(async () => {
    if (confirmBeforeRollback && !showConfirm) {
      setShowConfirm(true);
      return;
    }

    setIsRollingBack(true);

    try {
      await rollbackUpdate(queryClient, updateId, {
        message: 'Manually rolled back by user',
      });

      onRollback?.();
    } catch (error) {
      console.error('Failed to rollback:', error);
    } finally {
      setIsRollingBack(false);
      setShowConfirm(false);
    }
  }, [confirmBeforeRollback, showConfirm, queryClient, updateId, onRollback]);

  // Memoize cancel handler
  const handleCancel = useCallback(() => {
    setShowConfirm(false);
  }, []);

  // Memoize button classes
  const buttonClass = useMemo(() => {
    const variantClasses = {
      primary: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm hover:shadow-md dark:bg-blue-500 dark:hover:bg-blue-600',
      secondary: 'bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200',
      danger: 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm hover:shadow-md dark:bg-red-500 dark:hover:bg-red-600',
      ghost: 'bg-transparent hover:bg-gray-100 active:bg-gray-200 text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:active:bg-gray-700',
    };

    const sizeClasses = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return `
      inline-flex items-center justify-center gap-2
      font-medium rounded-lg
      transition-all duration-200 ease-in-out
      transform active:scale-[0.98]
      disabled:opacity-50 disabled:cursor-not-allowed
      motion-reduce:transition-none motion-reduce:transform-none
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `.trim();
  }, [variant, size, fullWidth, className]);

  // Memoize danger variant classes
  const dangerVariantClasses = useMemo(() =>
    'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm hover:shadow-md dark:bg-red-500 dark:hover:bg-red-600',
    []
  );

  const ghostVariantClasses = useMemo(() =>
    'bg-transparent hover:bg-gray-100 active:bg-gray-200 text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:active:bg-gray-700',
    []
  );

  if (showConfirm) {
    return (
      <div className="inline-flex items-center gap-2">
        <button
          onClick={handleRollback}
          disabled={isRollingBack}
          className={`${buttonClass} ${dangerVariantClasses}`}
        >
          {isRollingBack ? 'Undoing...' : 'Confirm Undo'}
        </button>
        <button
          onClick={handleCancel}
          className={`${buttonClass} ${ghostVariantClasses}`}
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleRollback}
      disabled={disabled || isRollingBack}
      className={buttonClass}
      title="Undo this change"
      aria-busy={isRollingBack}
      aria-disabled={disabled || isRollingBack}
    >
      {showIcon && (
        <UndoIcon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      )}
      <span>{isRollingBack ? 'Undoing...' : text}</span>
    </button>
  );
});

RollbackButton.displayName = 'RollbackButton';

// =====================
// BATCH ROLLBACK BUTTON
// =====================

/**
 * Props for the BatchRollbackButton component.
 *
 * @interface BatchRollbackButtonProps
 *
 * @property {string[]} updateIds - Array of update IDs to rollback in batch
 * @property {('primary' | 'secondary' | 'danger' | 'ghost')} [variant='danger'] - Visual style variant
 * @property {('sm' | 'md' | 'lg')} [size='md'] - Button size
 * @property {boolean} [confirmBeforeRollback=true] - Whether to show inline confirmation before batch rollback
 * @property {() => void} [onRollback] - Callback function executed after successful batch rollback
 * @property {string} [className=''] - Additional CSS classes to apply
 */
export interface BatchRollbackButtonProps {
  /** Update IDs to rollback */
  updateIds: string[];

  /** Button variant */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';

  /** Button size */
  size?: 'sm' | 'md' | 'lg';

  /** Show confirmation dialog */
  confirmBeforeRollback?: boolean;

  /** Callback after rollback */
  onRollback?: () => void;

  /** Custom className */
  className?: string;
}

/**
 * Batch rollback button for undoing multiple optimistic updates at once.
 *
 * Provides bulk rollback functionality with confirmation and progress feedback.
 * Useful for scenarios where multiple related updates need to be undone together.
 *
 * **Features:**
 * - Batch rollback of multiple updates
 * - Shows count of updates being rolled back
 * - Inline confirmation step
 * - Loading state during rollback
 * - Automatic disable when no updates
 *
 * **Performance:**
 * - Uses Promise.all for parallel rollback
 * - Efficient bulk cache invalidation
 * - Single callback after all complete
 *
 * @component
 * @param {BatchRollbackButtonProps} props - Batch rollback button props
 * @returns {JSX.Element} Rendered batch rollback button with confirmation
 *
 * @example
 * ```tsx
 * // Rollback multiple failed updates
 * const failedUpdateIds = ['update-1', 'update-2', 'update-3'];
 *
 * <BatchRollbackButton
 *   updateIds={failedUpdateIds}
 *   variant="danger"
 *   onRollback={() => toast.success('All changes undone')}
 * />
 *
 * // Conditional rendering based on update count
 * {pendingUpdates.length > 0 && (
 *   <BatchRollbackButton
 *     updateIds={pendingUpdates.map(u => u.id)}
 *     confirmBeforeRollback={true}
 *   />
 * )}
 * ```
 *
 * @see {@link RollbackButton} for single update rollback
 * @see {@link useRollback} for programmatic rollback
 */
export const BatchRollbackButton: React.FC<BatchRollbackButtonProps> = ({
  updateIds,
  variant = 'danger',
  size = 'md',
  confirmBeforeRollback = true,
  onRollback,
  className = '',
}) => {
  const queryClient = useQueryClient();
  const [isRollingBack, setIsRollingBack] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleBatchRollback = async () => {
    if (confirmBeforeRollback && !showConfirm) {
      setShowConfirm(true);
      return;
    }

    setIsRollingBack(true);

    try {
      await Promise.all(
        updateIds.map(id =>
          rollbackUpdate(queryClient, id, {
            message: 'Batch rollback by user',
          })
        )
      );

      onRollback?.();
    } catch (error) {
      console.error('Failed to batch rollback:', error);
    } finally {
      setIsRollingBack(false);
      setShowConfirm(false);
    }
  };

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const buttonClass = `
    inline-flex items-center justify-center gap-2
    font-medium rounded-lg
    transition-colors duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `.trim();

  if (showConfirm) {
    return (
      <div className="inline-flex items-center gap-2">
        <button onClick={handleBatchRollback} disabled={isRollingBack} className={buttonClass}>
          {isRollingBack ? 'Undoing...' : `Confirm Undo (${updateIds.length})`}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className={`${buttonClass} ${variantClasses.ghost}`}
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleBatchRollback}
      disabled={isRollingBack || updateIds.length === 0}
      className={buttonClass}
    >
      <UndoIcon className="w-4 h-4" />
      <span>
        {isRollingBack
          ? `Undoing ${updateIds.length} change${updateIds.length !== 1 ? 's' : ''}...`
          : `Undo ${updateIds.length} change${updateIds.length !== 1 ? 's' : ''}`}
      </span>
    </button>
  );
};

// =====================
// ICON COMPONENT
// =====================

/**
 * Undo icon component for rollback buttons.
 * Displays a curved arrow pointing left, standard undo symbol.
 *
 * @param props - Icon props
 * @param {string} [props.className='w-4 h-4'] - CSS classes for icon sizing
 * @returns {JSX.Element} SVG undo icon
 *
 * @internal
 */
const UndoIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
    />
  </svg>
);

// =====================
// HOOK FOR ROLLBACK
// =====================

/**
 * Custom React hook for programmatic rollback functionality.
 *
 * Provides rollback and batch rollback functions with loading state management.
 * Useful for implementing custom rollback UI or integrating rollback into
 * complex workflows without using the button components.
 *
 * **Features:**
 * - Single update rollback
 * - Batch update rollback
 * - Loading state tracking
 * - Success/error callbacks
 * - Automatic cache invalidation
 *
 * **Integration:**
 * - Works with optimisticUpdateManager
 * - Integrates with React Query cache
 * - Handles error recovery
 *
 * @returns {Object} Rollback utilities
 * @returns {(updateId: string, options?: {onSuccess?: () => void; onError?: (error: Error) => void}) => Promise<void>} rollback - Function to rollback single update
 * @returns {(updateIds: string[], options?: {onSuccess?: () => void; onError?: (error: Error) => void}) => Promise<void>} batchRollback - Function to rollback multiple updates
 * @returns {boolean} isRollingBack - Whether rollback operation is in progress
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { rollback, batchRollback, isRollingBack } = useRollback();
 *
 *   const handleUndo = async () => {
 *     await rollback('update-123', {
 *       onSuccess: () => toast.success('Change undone'),
 *       onError: (err) => toast.error(`Failed: ${err.message}`)
 *     });
 *   };
 *
 *   const handleUndoAll = async () => {
 *     await batchRollback(['update-1', 'update-2', 'update-3'], {
 *       onSuccess: () => console.log('All changes undone')
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleUndo} disabled={isRollingBack}>
 *         Undo Last Change
 *       </button>
 *       <button onClick={handleUndoAll} disabled={isRollingBack}>
 *         Undo All Changes
 *       </button>
 *       {isRollingBack && <LoadingSpinner />}
 *     </div>
 *   );
 * }
 * ```
 *
 * @see {@link RollbackButton} for pre-built rollback UI
 * @see {@link BatchRollbackButton} for batch rollback UI
 */
export function useRollback() {
  const queryClient = useQueryClient();
  const [isRollingBack, setIsRollingBack] = useState(false);

  const rollback = async (
    updateId: string,
    options?: {
      onSuccess?: () => void;
      onError?: (error: Error) => void;
    }
  ) => {
    setIsRollingBack(true);

    try {
      await rollbackUpdate(queryClient, updateId, {
        message: 'Rolled back by user',
      });

      options?.onSuccess?.();
    } catch (error) {
      options?.onError?.(error as Error);
    } finally {
      setIsRollingBack(false);
    }
  };

  const batchRollback = async (
    updateIds: string[],
    options?: {
      onSuccess?: () => void;
      onError?: (error: Error) => void;
    }
  ) => {
    setIsRollingBack(true);

    try {
      await Promise.all(
        updateIds.map(id =>
          rollbackUpdate(queryClient, id, {
            message: 'Batch rollback by user',
          })
        )
      );

      options?.onSuccess?.();
    } catch (error) {
      options?.onError?.(error as Error);
    } finally {
      setIsRollingBack(false);
    }
  };

  return {
    rollback,
    batchRollback,
    isRollingBack,
  };
}

