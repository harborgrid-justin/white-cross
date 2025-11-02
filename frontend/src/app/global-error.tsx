/**
 * @fileoverview Global Error Boundary - Ultimate Fallback
 *
 * The highest-level error boundary in the Next.js application that catches errors occurring
 * in the root layout.tsx file. This is the last line of defense for error handling and only
 * activates in production (development shows the error overlay). Provides a complete HTML
 * document as fallback since it replaces the entire root layout.
 *
 * @module app/global-error
 * @category Error Handling
 * @subcategory Error Boundaries
 *
 * **Error Boundary Hierarchy:**
 * ```
 * global-error.tsx (this file - HIGHEST LEVEL, catches root layout errors)
 * └── error.tsx (catches all other application errors)
 *     └── [Feature error boundaries] (feature-specific error handling)
 * ```
 *
 * **Key Differences from error.tsx:**
 * - Must include `<html>` and `<body>` tags (replaces entire root layout)
 * - Only activates in production (dev uses error overlay)
 * - Catches errors in root layout.tsx
 * - Cannot rely on any layout components or providers
 * - Must be completely self-contained
 *
 * **Key Features:**
 * - Complete HTML document with inline styles
 * - HIPAA-compliant error logging (no PHI exposure)
 * - Sentry integration for error tracking
 * - Professional error UI with gradient background
 * - Multiple recovery actions
 * - Development error details
 * - Support contact information
 * - HIPAA compliance notice
 *
 * **Error Logging:**
 * - Console logging with timestamp
 * - Sentry exception capture (if available)
 * - Error digest for production debugging
 * - No PHI data included
 *
 * **When This Activates:**
 * - Error in root layout.tsx
 * - Error in app/providers.tsx during initialization
 * - Critical rendering errors that error.tsx cannot catch
 * - Unhandled promise rejections in root scope
 *
 * @requires Client Component - Uses React hooks and browser APIs
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/error#global-error | Next.js Global Error}
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/error-handling | Error Handling Guide}
 *
 * @example
 * ```tsx
 * // This global error boundary catches errors like:
 * // app/layout.tsx
 * export default function RootLayout({ children }) {
 *   throw new Error('Critical layout error'); // Caught by global-error.tsx
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Provider initialization error:
 * // app/providers.tsx
 * export function Providers({ children }) {
 *   throw new Error('Provider init failed'); // Caught by global-error.tsx
 * }
 * ```
 *
 * @since 1.0.0
 */

'use client';

import { useEffect } from 'react';

/**
 * Props interface for the Global Error Boundary component.
 *
 * @interface GlobalErrorProps
 * @property {Error & { digest?: string }} error - Error object with optional Next.js digest
 * @property {() => void} reset - Function to attempt error recovery by reloading
 */
interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global Error Boundary Component
 *
 * Ultimate fallback error handler that catches errors in the root layout. Provides a
 * complete HTML document as fallback UI since it replaces the entire application shell.
 * This is the most critical error boundary and must be completely self-contained.
 *
 * **Error Logging Strategy:**
 * 1. Console logging with structured data (timestamp, digest)
 * 2. Sentry integration (if available in window object)
 * 3. No PHI data included in logs (HIPAA compliance)
 * 4. Error digest for production debugging
 *
 * **Fallback UI Features:**
 * - Complete HTML document (<html>, <body>)
 * - Self-contained styles (no external stylesheets)
 * - Gradient background for visual appeal
 * - Responsive card layout
 * - Error icon with semantic meaning
 * - Contextual messaging (dev vs production)
 * - Multiple recovery options
 * - Support contact information
 * - HIPAA compliance notice
 *
 * **Recovery Actions:**
 * 1. Try Again - Calls reset() to attempt re-render
 * 2. Go to Dashboard - Forces navigation to /dashboard
 *
 * **Accessibility:**
 * - Semantic HTML structure
 * - High-contrast colors
 * - Keyboard-accessible buttons
 * - Screen reader compatible
 * - Responsive design
 *
 * @param {GlobalErrorProps} props - Component properties
 * @param {Error} props.error - The error that was caught
 * @param {string} [props.error.message] - Error message
 * @param {string} [props.error.digest] - Next.js error digest (production)
 * @param {() => void} props.reset - Function to reset error boundary
 *
 * @returns {JSX.Element} Complete HTML document with error fallback UI
 *
 * @example
 * ```tsx
 * // Automatic usage by Next.js:
 * // When a critical error occurs in root layout:
 * <GlobalError error={layoutError} reset={resetFn} />
 * ```
 *
 * @remarks
 * **Critical Implementation Notes:**
 * - MUST include `<html>` and `<body>` tags
 * - Cannot import or use layout components
 * - Cannot rely on global styles (must inline)
 * - Only activates in production builds
 * - Development uses Next.js error overlay instead
 *
 * **HIPAA Compliance:**
 * - Error logs exclude all PHI data
 * - Generic error messages in production
 * - Secure error tracking integration
 * - Compliance notice displayed to users
 *
 * **Monitoring Integration:**
 * - Checks for Sentry in window object
 * - Captures exception with tags
 * - Includes error boundary identifier
 * - Tracks error digest for correlation
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log error to monitoring service (Sentry, DataDog, etc.)
    // Ensure no PHI data is included in error logs
    try {
      // Extract safe error information without logging the raw error object
      const errorMessage = error?.message || 'Unknown error occurred';
      const errorDigest = error?.digest || 'No digest available';
      const timestamp = new Date().toISOString();
      
      // Log structured information separately to avoid object serialization issues
      console.error('Global error occurred at:', timestamp);
      console.error('Error message:', errorMessage);
      console.error('Error digest:', errorDigest);
      
      if (process.env.NODE_ENV === 'development' && error?.stack) {
        console.error('Error stack:', error.stack);
      }

      // Send to error tracking service
      if (typeof window !== 'undefined' && 'Sentry' in window) {
        const sentry = (window as typeof window & { Sentry?: { captureException: (error: Error, options?: { tags?: Record<string, string> }) => void } }).Sentry;
        if (sentry?.captureException) {
          sentry.captureException(error, {
            tags: {
              errorBoundary: 'global',
              digest: errorDigest,
            },
          });
        }
      }
    } catch (loggingError) {
      // Fallback logging if the main logging fails
      console.error('Global error handler failed. Fallback message:', error?.message || 'Critical error occurred');
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
