'use client';

/**
 * AuthErrorAlert Component
 *
 * Displays authentication error messages with dismiss functionality.
 * Provides accessible error feedback with ARIA attributes and keyboard support.
 *
 * @module components/feedback/AuthErrorAlert
 */

import React, { useCallback } from 'react';

// ==========================================
// TYPES & INTERFACES
// ==========================================

/**
 * Props for AuthErrorAlert component
 */
export interface AuthErrorAlertProps {
  /**
   * Error message to display
   * If null or empty, alert is not rendered
   */
  error: string | null;

  /**
   * Callback when user dismisses the error (optional)
   */
  onDismiss?: () => void;
}

// ==========================================
// COMPONENT
// ==========================================

/**
 * AuthErrorAlert - Display authentication errors with accessibility
 *
 * This component renders an error alert for authentication-related errors.
 * It includes:
 * - Error icon and styled message
 * - Dismiss button with keyboard support
 * - ARIA attributes for screen readers
 * - Automatic role="alert" for immediate announcement
 *
 * @example
 * ```tsx
 * // Basic usage
 * <AuthErrorAlert
 *   error={authError}
 *   onDismiss={() => dispatch(clearAuthError())}
 * />
 *
 * // Without dismiss functionality
 * <AuthErrorAlert error="Invalid credentials" />
 * ```
 */
export function AuthErrorAlert({
  error,
  onDismiss,
}: AuthErrorAlertProps) {
  // ==========================================
  // HANDLERS
  // ==========================================

  const handleDismiss = useCallback(() => {
    onDismiss?.();
  }, [onDismiss]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleDismiss();
      }
    },
    [handleDismiss]
  );

  // ==========================================
  // RENDER
  // ==========================================

  // Don't render if no error
  if (!error) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4"
      data-testid="auth-error-alert"
    >
      <div className="flex items-start">
        {/* Error Icon */}
        <svg
          className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>

        {/* Error Message */}
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800">
            Authentication Error
          </h3>
          <p className="text-sm text-red-700 mt-1" data-testid="error-message">
            {error}
          </p>
        </div>

        {/* Dismiss Button */}
        {onDismiss && (
          <button
            onClick={handleDismiss}
            onKeyDown={handleKeyDown}
            className="ml-3 inline-flex flex-shrink-0 text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
            aria-label="Dismiss error"
            type="button"
            data-testid="dismiss-button"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// Export as default as well for flexibility
export default AuthErrorAlert;
