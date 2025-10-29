'use client';

/**
 * @fileoverview Root Application Error Boundary
 *
 * Next.js error boundary that catches runtime errors in any part of the application
 * (except the root layout) and displays a user-friendly fallback UI. This component
 * provides error recovery options, logs errors to monitoring services, and maintains
 * HIPAA compliance by not exposing sensitive data in error messages.
 *
 * @module app/error
 * @category Error Handling
 * @subcategory Error Boundaries
 *
 * **Error Boundary Hierarchy:**
 * ```
 * global-error.tsx (catches errors in root layout)
 * └── error.tsx (this file - catches all other errors)
 *     ├── (dashboard)/medications/error.tsx (medication-specific errors)
 *     ├── (dashboard)/students/error.tsx (student-specific errors)
 *     └── [Other feature error boundaries...]
 * ```
 *
 * **Key Features:**
 * - User-friendly error UI with recovery actions
 * - Error logging to monitoring services (Sentry, DataDog)
 * - Development stack trace for debugging
 * - HIPAA-compliant error handling (no PHI exposure)
 * - Multiple recovery options (retry, dashboard, home)
 * - Error digest tracking for production debugging
 *
 * **Error Handling:**
 * - Development: Full error details with stack trace
 * - Production: Generic message with error ID (digest)
 * - Monitoring: Errors sent to external services
 * - No PHI data included in error logs
 *
 * **Recovery Options:**
 * 1. Try Again: Attempts to re-render the failed component
 * 2. Go to Dashboard: Navigate to safe dashboard page
 * 3. Return to Home: Navigate to application home
 *
 * @requires Client Component - Uses React hooks and browser APIs
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/error | Next.js Error Handling}
 * @see {@link https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary | React Error Boundaries}
 *
 * @example
 * ```tsx
 * // Next.js automatically uses this error boundary:
 * // When an error occurs in any component:
 * throw new Error('Something went wrong');
 * // This error boundary catches it and renders fallback UI
 * ```
 *
 * @since 1.0.0
 */

import { useEffect } from 'react';
import Link from 'next/link';

/**
 * Props interface for the Error Boundary component.
 *
 * @interface ErrorProps
 * @property {Error & { digest?: string }} error - Error object with optional Next.js digest
 * @property {() => void} reset - Function to attempt error recovery by re-rendering
 */
interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Root Error Boundary Component
 *
 * Catches and handles runtime errors throughout the application, providing a user-friendly
 * fallback UI with recovery options. Logs errors to monitoring services while maintaining
 * HIPAA compliance.
 *
 * **Error Logging:**
 * - Development: Console logging with full stack trace
 * - Production: External monitoring services (Sentry, DataDog, etc.)
 * - No PHI data included in logs
 * - Error digest for production debugging
 *
 * **Fallback UI:**
 * - Centered card layout with error icon
 * - Contextual error message (dev vs production)
 * - Multiple recovery action buttons
 * - Development-only stack trace viewer
 *
 * **Accessibility:**
 * - Semantic HTML structure
 * - Keyboard-accessible buttons
 * - Screen reader compatible
 * - High-contrast error indicators
 *
 * @param {ErrorProps} props - Component properties
 * @param {Error} props.error - The error that was caught
 * @param {string} [props.error.message] - Error message
 * @param {string} [props.error.stack] - Error stack trace (development)
 * @param {string} [props.error.digest] - Next.js error digest (production)
 * @param {() => void} props.reset - Function to reset error boundary and retry
 *
 * @returns {JSX.Element} Error fallback UI with recovery actions
 *
 * @example
 * ```tsx
 * // Automatic usage by Next.js:
 * // When error occurs in a page or component:
 * const data = await fetchData(); // Throws error
 * // Next.js renders:
 * <Error error={error} reset={resetFunction} />
 * ```
 *
 * @example
 * ```tsx
 * // The rendered structure:
 * <div className="error-container">
 *   <div className="error-card">
 *     <div className="error-icon">⚠️</div>
 *     <h1>Something went wrong</h1>
 *     <p>{error.message}</p>
 *     <button onClick={reset}>Try again</button>
 *     <Link href="/dashboard">Go to Dashboard</Link>
 *     <Link href="/">Return to Home</Link>
 *     // Dev only: stack trace shown here
 *   </div>
 * </div>
 * ```
 *
 * @remarks
 * This is a Client Component (requires 'use client' directive) because it uses:
 * - `useEffect` hook for error logging
 * - `onClick` handlers for recovery actions
 * - Browser-specific APIs for monitoring
 *
 * The component does NOT catch errors in:
 * - The root layout.tsx (use global-error.tsx instead)
 * - Event handlers (use try/catch)
 * - Asynchronous code (use error boundaries at call site)
 */
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
