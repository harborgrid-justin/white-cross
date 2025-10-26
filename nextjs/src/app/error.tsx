'use client';

/**
 * Global Error Boundary
 *
 * Catches errors in any part of the application and displays a user-friendly error message.
 * In production, errors are logged to monitoring services (Sentry, DataDog).
 *
 * This component is a Next.js App Router error boundary and must be a Client Component.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/error
 */

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // Send to Sentry, DataDog, etc.
      console.error('Application error:', error);
    } else {
      // Log to console in development
      console.error('Error caught by error boundary:', error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          {/* Error Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          {/* Error Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h1>

          {/* Error Message */}
          <p className="text-gray-600 mb-6">
            {process.env.NODE_ENV === 'development'
              ? error.message
              : 'An unexpected error occurred. Our team has been notified and is working on a fix.'}
          </p>

          {/* Error Digest (production) */}
          {error.digest && (
            <p className="text-xs text-gray-500 mb-6 font-mono">
              Error ID: {error.digest}
            </p>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full healthcare-button-primary"
            >
              Try again
            </button>

            <Link
              href="/dashboard"
              className="block w-full healthcare-button-secondary text-center"
            >
              Go to Dashboard
            </Link>

            <Link
              href="/"
              className="block w-full text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Return to Home
            </Link>
          </div>

          {/* Development Stack Trace */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 text-left">
              <summary className="text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900">
                View error details
              </summary>
              <pre className="mt-2 text-xs bg-gray-100 p-4 rounded overflow-auto max-h-64">
                {error.stack}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
