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

import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { optimisticUpdateManager } from '@/utils/optimisticUpdates';
import { rollbackUpdate } from '@/utils/optimisticHelpers';

// =====================
// TYPES
// =====================

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
export const RollbackButton: React.FC<RollbackButtonProps> = ({
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

  const handleRollback = async () => {
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
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
  };

  // Size classes
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
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim();

  if (showConfirm) {
    return (
      <div className="inline-flex items-center gap-2">
        <button
          onClick={handleRollback}
          disabled={isRollingBack}
          className={`${buttonClass} ${variantClasses.danger}`}
        >
          {isRollingBack ? 'Undoing...' : 'Confirm Undo'}
        </button>
        <button
          onClick={handleCancel}
          className={`${buttonClass} ${variantClasses.ghost}`}
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
    >
      {showIcon && (
        <UndoIcon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      )}
      <span>{isRollingBack ? 'Undoing...' : text}</span>
    </button>
  );
};

// =====================
// BATCH ROLLBACK BUTTON
// =====================

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
 * Rollback multiple updates at once
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
 * Hook for rollback functionality in components
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

