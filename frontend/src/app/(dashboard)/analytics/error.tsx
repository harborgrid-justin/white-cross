'use client';

/**
 * @fileoverview Analytics Route Error Boundary Component
 *
 * Provides graceful error handling for all analytics routes with contextual
 * recovery options. Implements Next.js 14+ error boundary pattern to catch
 * and display errors that occur during analytics data loading, chart rendering,
 * or user interactions within the analytics module.
 *
 * @module app/(dashboard)/analytics/error
 *
 * @remarks
 * This is a Next.js error boundary that wraps all analytics routes:
 * - `/analytics/*` - All analytics pages and sub-routes
 * - Catches both server-side and client-side errors
 * - Provides domain-specific recovery guidance for analytics failures
 * - Displays user-friendly error messages with actionable recovery steps
 *
 * Error scenarios handled:
 * - Data fetching failures (API errors, network issues)
 * - Chart rendering errors (invalid data, library errors)
 * - Permission/authorization failures
 * - Data processing/calculation errors
 *
 * @example
 * ```tsx
 * // Automatically used by Next.js App Router
 * // Route: /analytics/health-metrics
 * // If an error occurs, this component displays instead of the page
 * ```
 *
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/error-handling|Next.js Error Handling}
 */

import { GenericDomainError } from '@/components/shared/errors/GenericDomainError';
import { BarChart3 } from 'lucide-react';

/**
 * Analytics Error Boundary Component
 *
 * Client Component that handles errors within the analytics route segment.
 * Provides analytics-specific error messaging and recovery options.
 *
 * @param {Object} props - Component props
 * @param {Error & { digest?: string }} props.error - Error object with optional digest
 * @param {string} props.error.message - Error message describing what went wrong
 * @param {string} props.error.stack - Error stack trace for debugging
 * @param {string} [props.error.digest] - Next.js error digest for server error tracking
 * @param {() => void} props.reset - Function to attempt recovery by re-rendering segment
 *
 * @returns {JSX.Element} Error boundary UI with recovery options
 *
 * @remarks
 * - Uses `'use client'` directive as error boundaries must be Client Components
 * - The `reset()` function attempts to recover by re-rendering the error boundary's contents
 * - Error digest is provided for server-side errors and can be used for log correlation
 * - Delegates to GenericDomainError for consistent error UI across domains
 *
 * @example
 * ```tsx
 * // This component is automatically invoked by Next.js when an error occurs
 * // User sees the error UI with these recovery steps:
 * // 1. Click "Try Again" to reload analytics
 * // 2. Check if data is still being processed
 * // 3. Verify permissions for analytics access
 * // 4. Contact IT support if error persists
 * ```
 */
export default function AnalyticsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <GenericDomainError
      error={error}
      reset={reset}
      domain="Analytics"
      domainIcon={<BarChart3 className="h-8 w-8 text-red-600 dark:text-red-400" />}
      customMessage="Unable to load analytics data. Reports and charts may not be available."
      customRecoverySteps={[
        'Click "Try Again" to reload analytics',
        'Check if data is still being processed',
        'Verify your permissions for analytics access',
        'Contact IT support if error persists',
      ]}
    />
  );
}
