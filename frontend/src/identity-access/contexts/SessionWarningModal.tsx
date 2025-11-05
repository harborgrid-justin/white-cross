'use client';

/**
 * Session Warning Modal Component
 *
 * Displays a warning when the user's session is about to expire.
 * Separated into its own file for code splitting and lazy loading.
 *
 * @module contexts/SessionWarningModal
 */

import React, { useState, useEffect } from 'react';

const HIPAA_IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds

interface SessionWarningModalProps {
  onExtend: () => void;
  onLogout: () => void;
  lastActivityAt: number;
  isHydrated: boolean;
}

export function SessionWarningModal({
  onExtend,
  onLogout,
  lastActivityAt,
  isHydrated
}: SessionWarningModalProps) {
  const [countdown, setCountdown] = useState(120); // Default to 2 minutes

  useEffect(() => {
    // Calculate initial countdown based on lastActivityAt
    if (isHydrated && lastActivityAt > 0) {
      const timeRemaining = HIPAA_IDLE_TIMEOUT - (Date.now() - lastActivityAt);
      setCountdown(Math.floor(Math.max(0, timeRemaining) / 1000));
    }
  }, [lastActivityAt, isHydrated]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev: number) => {
        if (prev <= 1) {
          clearInterval(interval);
          onLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onLogout]);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="alertdialog"
      aria-labelledby="session-warning-title"
      aria-describedby="session-warning-description"
    >
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <svg
            className="w-6 h-6 text-yellow-500 mr-3"
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
          <h2 id="session-warning-title" className="text-xl font-semibold text-gray-900">
            Session Expiring Soon
          </h2>
        </div>

        <p id="session-warning-description" className="text-gray-600 mb-6">
          Your session will expire in{' '}
          <span className="font-bold text-red-600">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>{' '}
          due to inactivity. For security and HIPAA compliance, you will be automatically logged
          out.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onLogout}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            type="button"
          >
            Logout Now
          </button>
          <button
            onClick={onExtend}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            type="button"
            autoFocus
          >
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
}
