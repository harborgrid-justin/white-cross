'use client';

/**
 * AuthLoadingSpinner Component
 *
 * Displays a loading spinner for authentication operations.
 * Provides accessible loading feedback with ARIA attributes.
 *
 * @module components/feedback/AuthLoadingSpinner
 */

import React from 'react';

// ==========================================
// TYPES & INTERFACES
// ==========================================

/**
 * Props for AuthLoadingSpinner component
 */
export interface AuthLoadingSpinnerProps {
  /**
   * Custom message to display below spinner (optional)
   * Defaults to "Authenticating..."
   */
  message?: string;
}

// ==========================================
// COMPONENT
// ==========================================

/**
 * AuthLoadingSpinner - Loading indicator for auth operations
 *
 * This component displays an animated spinner with a message to indicate
 * that an authentication operation is in progress. It includes:
 * - Animated spinner SVG
 * - Customizable loading message
 * - ARIA live region for screen reader announcements
 * - Proper semantic HTML for accessibility
 *
 * @example
 * ```tsx
 * // Default message
 * <AuthLoadingSpinner />
 *
 * // Custom message
 * <AuthLoadingSpinner message="Logging in..." />
 * <AuthLoadingSpinner message="Refreshing session..." />
 * ```
 */
export function AuthLoadingSpinner({
  message = 'Authenticating...',
}: AuthLoadingSpinnerProps) {
  return (
    <div
      className="flex flex-col items-center justify-center p-8"
      data-testid="auth-loading-spinner"
    >
      {/* Spinner SVG */}
      <div
        className="relative"
        role="status"
        aria-live="polite"
        aria-label={message}
      >
        <svg
          className="animate-spin h-12 w-12 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          data-testid="spinner-icon"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>

        {/* Screen reader text */}
        <span className="sr-only">Loading</span>
      </div>

      {/* Loading Message */}
      <p
        className="mt-4 text-sm text-gray-600 font-medium"
        data-testid="loading-message"
      >
        {message}
      </p>

      {/* Additional screen reader announcement */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {message}
      </div>
    </div>
  );
}

// Export as default as well for flexibility
export default AuthLoadingSpinner;
