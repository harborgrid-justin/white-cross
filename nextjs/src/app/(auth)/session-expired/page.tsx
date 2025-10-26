'use client';

/**
 * Session Expired Page
 *
 * Shown when user session expires due to:
 * - Inactivity timeout (15 min HIPAA requirement)
 * - Token expiration
 * - Token refresh failure
 *
 * @module app/session-expired/page
 */

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SessionExpiredPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(10);

  // Get session expiry reason from query params
  const reason = searchParams.get('reason') || 'unknown';
  const redirectTo = searchParams.get('redirect') || '/login';

  // Auto-redirect countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      router.push(redirectTo);
    }
  }, [countdown, router, redirectTo]);

  // Determine message based on reason
  const getMessage = () => {
    switch (reason) {
      case 'idle':
        return {
          title: 'Session Expired Due to Inactivity',
          description: 'For your security and HIPAA compliance, your session has been automatically logged out after 15 minutes of inactivity.',
          icon: (
            <svg className="w-16 h-16 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        };
      case 'token':
        return {
          title: 'Session Expired',
          description: 'Your authentication token has expired. Please log in again to continue.',
          icon: (
            <svg className="w-16 h-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          ),
        };
      case 'refresh_failed':
        return {
          title: 'Session Refresh Failed',
          description: 'We were unable to refresh your session. Please log in again.',
          icon: (
            <svg className="w-16 h-16 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
        };
      default:
        return {
          title: 'Session Expired',
          description: 'Your session has ended. Please log in again to continue.',
          icon: (
            <svg className="w-16 h-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        };
    }
  };

  const { title, description, icon } = getMessage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-lg rounded-lg p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            {icon}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-4">
            {title}
          </h1>

          {/* Description */}
          <p className="text-gray-600 text-center mb-6">
            {description}
          </p>

          {/* Security Notice for Idle Timeout */}
          {reason === 'idle' && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6" role="note">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Security Tip:</strong> Always log out when you're done to protect patient health information (PHI).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Countdown */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500">
              Redirecting to login in{' '}
              <span className="font-bold text-blue-600" aria-live="polite">
                {countdown}
              </span>{' '}
              {countdown === 1 ? 'second' : 'seconds'}...
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link
              href={redirectTo}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign In Now
            </Link>

            <button
              onClick={() => router.back()}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              type="button"
            >
              Go Back
            </button>
          </div>

          {/* Help */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Having trouble? Contact your system administrator for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
