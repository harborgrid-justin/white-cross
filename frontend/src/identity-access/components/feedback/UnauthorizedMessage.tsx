'use client';

/**
 * UnauthorizedMessage Component
 *
 * Displays a user-friendly message when access is denied due to insufficient permissions.
 * Provides clear feedback with appropriate visual styling and accessibility.
 *
 * @module components/feedback/UnauthorizedMessage
 */

import React from 'react';

// ==========================================
// TYPES & INTERFACES
// ==========================================

/**
 * Props for UnauthorizedMessage component
 */
export interface UnauthorizedMessageProps {
  /**
   * The specific permission that was required (optional)
   * Used to provide more specific feedback to the user
   */
  requiredPermission?: string;

  /**
   * Custom message to display (optional)
   * If not provided, a default message is shown
   */
  message?: string;
}

// ==========================================
// COMPONENT
// ==========================================

/**
 * UnauthorizedMessage - Display access denied message
 *
 * This component renders a styled message informing users that they
 * lack the necessary permissions to access certain content or features.
 * It includes:
 * - Lock icon for visual clarity
 * - Clear, user-friendly messaging
 * - Optional permission details
 * - Proper ARIA attributes for accessibility
 *
 * @example
 * ```tsx
 * // Default message
 * <UnauthorizedMessage />
 *
 * // With specific permission
 * <UnauthorizedMessage requiredPermission="students:edit" />
 *
 * // Custom message
 * <UnauthorizedMessage message="You need admin access to view this page" />
 * ```
 */
export function UnauthorizedMessage({
  requiredPermission,
  message,
}: UnauthorizedMessageProps) {
  // Generate default message if not provided
  const defaultMessage = requiredPermission
    ? `You don't have the required permission (${requiredPermission}) to access this content.`
    : "You don't have permission to access this content.";

  const displayMessage = message || defaultMessage;

  return (
    <div
      role="alert"
      aria-live="polite"
      className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200"
      data-testid="unauthorized-message"
    >
      {/* Lock Icon */}
      <div className="bg-red-100 rounded-full p-4 mb-4">
        <svg
          className="w-8 h-8 text-red-600"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Access Denied
      </h3>

      {/* Message */}
      <p
        className="text-sm text-gray-600 text-center max-w-md"
        data-testid="unauthorized-message-text"
      >
        {displayMessage}
      </p>

      {/* Help Text */}
      <p className="text-xs text-gray-500 text-center mt-4">
        If you believe you should have access, please contact your administrator.
      </p>
    </div>
  );
}

// Export as default as well for flexibility
export default UnauthorizedMessage;
