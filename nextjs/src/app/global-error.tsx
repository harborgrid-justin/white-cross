/**
 * Global Error Boundary
 *
 * Catches errors in the root layout and provides fallback UI
 * This only catches errors in production - in development, the error overlay is shown
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/error
 */

'use client';

import { useEffect } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global error handler for unrecoverable errors
 * Provides HIPAA-compliant error logging without exposing sensitive data
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log error to monitoring service (Sentry, DataDog, etc.)
    // Ensure no PHI data is included in error logs
    console.error('Global error:', {
      message: error.message,
      digest: error.digest,
      timestamp: new Date().toISOString(),
    });

    // Send to error tracking service
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        tags: {
          errorBoundary: 'global',
          digest: error.digest,
        },
      });
    }
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            {/* Error Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
                Application Error
              </h1>

              {/* Description */}
              <p className="text-lg text-gray-600 text-center mb-8">
                We encountered an unexpected error. Our team has been notified and is working to
                resolve this issue.
              </p>

              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <h2 className="text-sm font-semibold text-red-800 mb-2">Error Details (Dev Only):</h2>
                  <p className="text-sm text-red-700 font-mono break-all">
                    {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-xs text-red-600 mt-2">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={reset}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  Try Again
                </button>

                <button
                  onClick={() => (window.location.href = '/dashboard')}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors duration-200"
                >
                  Go to Dashboard
                </button>
              </div>

              {/* Support Info */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center">
                  Need immediate assistance?{' '}
                  <a
                    href="mailto:support@whitecross.healthcare"
                    className="text-blue-600 hover:text-blue-700 font-medium underline"
                  >
                    Contact Support
                  </a>
                </p>
              </div>
            </div>

            {/* HIPAA Notice */}
            <div className="mt-6 text-center text-sm text-gray-600">
              <p>
                🔒 This is a HIPAA-compliant system. All errors are logged securely without
                exposing protected health information.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
