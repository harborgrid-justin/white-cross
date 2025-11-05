'use client';

/**
 * SessionWarningModal Component
 *
 * Displays a modal warning when user session is about to expire due to inactivity.
 * Provides options to extend the session or logout immediately.
 *
 * Features:
 * - Countdown timer showing remaining time
 * - Focus trap for accessibility
 * - Keyboard navigation (Escape to extend, Enter to confirm)
 * - ARIA attributes for screen readers
 * - Live region for countdown announcements
 *
 * @module components/session/SessionWarningModal
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';

// ==========================================
// TYPES & INTERFACES
// ==========================================

/**
 * Props for SessionWarningModal component
 */
export interface SessionWarningModalProps {
  /**
   * Whether the modal is visible
   */
  isOpen: boolean;

  /**
   * Time remaining in seconds before session expires
   */
  timeRemainingSeconds: number;

  /**
   * Callback when user chooses to extend session
   */
  onExtendSession: () => void;

  /**
   * Callback when user chooses to logout or session expires
   */
  onLogout: () => void;
}

// ==========================================
// COMPONENT
// ==========================================

/**
 * SessionWarningModal - Alert users of impending session expiration
 *
 * This component displays a modal dialog warning users that their session
 * is about to expire due to inactivity. It includes:
 * - A countdown timer
 * - Options to extend session or logout
 * - Full keyboard accessibility
 * - Screen reader support
 *
 * @example
 * ```tsx
 * <SessionWarningModal
 *   isOpen={showWarning}
 *   timeRemainingSeconds={120}
 *   onExtendSession={() => {
 *     updateActivity();
 *     setShowWarning(false);
 *   }}
 *   onLogout={handleLogout}
 * />
 * ```
 */
export function SessionWarningModal({
  isOpen,
  timeRemainingSeconds,
  onExtendSession,
  onLogout,
}: SessionWarningModalProps) {
  // ==========================================
  // STATE & REFS
  // ==========================================

  const [countdown, setCountdown] = useState(timeRemainingSeconds);
  const extendButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // ==========================================
  // COUNTDOWN LOGIC
  // ==========================================

  // Sync countdown with prop changes
  useEffect(() => {
    setCountdown(timeRemainingSeconds);
  }, [timeRemainingSeconds]);

  // Countdown interval
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, onLogout]);

  // ==========================================
  // FOCUS MANAGEMENT
  // ==========================================

  // Focus trap and initial focus
  useEffect(() => {
    if (!isOpen) return;

    // Focus the extend button when modal opens
    const focusTimeout = setTimeout(() => {
      extendButtonRef.current?.focus();
    }, 100);

    // Store previously focused element
    const previouslyFocusedElement = document.activeElement as HTMLElement;

    // Focus trap handler
    const handleTabKey = (e: KeyboardEvent) => {
      if (!modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        handleTabKey(e);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimeout);
      document.removeEventListener('keydown', handleKeyDown);
      // Restore focus to previously focused element
      previouslyFocusedElement?.focus();
    };
  }, [isOpen]);

  // ==========================================
  // KEYBOARD HANDLERS
  // ==========================================

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onExtendSession();
      }
    },
    [onExtendSession]
  );

  // ==========================================
  // STABLE HANDLERS
  // ==========================================

  const handleExtend = useCallback(() => {
    onExtendSession();
  }, [onExtendSession]);

  const handleLogout = useCallback(() => {
    onLogout();
  }, [onLogout]);

  // ==========================================
  // COUNTDOWN FORMATTING
  // ==========================================

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  // Determine announcement for screen readers (announce every 30 seconds)
  const shouldAnnounce = countdown % 30 === 0 || countdown <= 10;
  const screenReaderAnnouncement = shouldAnnounce
    ? `Session expires in ${minutes} ${minutes === 1 ? 'minute' : 'minutes'} and ${seconds} ${seconds === 1 ? 'second' : 'seconds'}`
    : '';

  // ==========================================
  // RENDER
  // ==========================================

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="session-warning-title"
      aria-describedby="session-warning-description"
      onKeyDown={handleKeyDown}
      data-testid="session-warning-modal"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
        data-testid="session-warning-modal-content"
      >
        {/* Header with Icon */}
        <div className="flex items-center mb-4">
          <svg
            className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2
            id="session-warning-title"
            className="text-xl font-semibold text-gray-900"
          >
            Session Expiring Soon
          </h2>
        </div>

        {/* Description */}
        <p
          id="session-warning-description"
          className="text-gray-600 mb-6"
        >
          Your session will expire in{' '}
          <span
            className="font-bold text-red-600"
            data-testid="countdown-display"
          >
            {formattedTime}
          </span>{' '}
          due to inactivity. For security and HIPAA compliance, you will be
          automatically logged out.
        </p>

        {/* Screen Reader Live Region */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
          data-testid="countdown-announcement"
        >
          {screenReaderAnnouncement}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            type="button"
            data-testid="logout-button"
          >
            Logout Now
          </button>
          <button
            ref={extendButtonRef}
            onClick={handleExtend}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            type="button"
            data-testid="extend-session-button"
          >
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
}

// Export as default as well for flexibility
export default SessionWarningModal;
