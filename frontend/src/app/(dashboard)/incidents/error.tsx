'use client';

/**
 * @fileoverview Incidents Route Error Boundary - Catches and handles errors in all
 * incident-related routes with contextual error messaging and recovery options.
 *
 * @module app/(dashboard)/incidents/error
 * @category Incidents - Core Pages
 *
 * ## Overview
 * Provides user-friendly error handling for the incidents section of the application.
 * Catches errors that occur during incident data fetching, form submission, or page
 * rendering, and displays contextual recovery steps.
 *
 * ## Error Scenarios Handled
 * - **Data Fetching Errors**: Incidents list fails to load from server
 * - **Form Submission Errors**: Incident creation or update fails
 * - **Authorization Errors**: User lacks permission to view/edit incident
 * - **Network Errors**: Connection issues during API calls
 * - **Validation Errors**: Unexpected validation failures
 * - **Server Errors**: 500-level errors from backend
 *
 * ## Recovery Options
 * 1. **Retry**: Attempts to reload the page and fetch data again
 * 2. **Return to List**: Navigate back to incidents list (safe fallback)
 * 3. **Check Network**: User verification of connectivity
 * 4. **Contact Support**: Escalation path for persistent errors
 *
 * ## Error Context
 * Displays domain-specific context:
 * - Domain: "Incidents" (with AlertCircle icon)
 * - Custom message about incident tracking impact
 * - Verification step for recently submitted reports
 * - IT support contact information
 *
 * ## User Experience
 * - Clear, non-technical error messaging
 * - Visual alert icon indicating error state
 * - Actionable recovery steps (not just generic "try again")
 * - Maintains incident workflow context (doesn't lose user's place)
 *
 * ## Integration with Error Logging
 * - Errors automatically logged to monitoring system (Sentry, DataDog)
 * - Error digest provided for support ticket reference
 * - User actions (retry, navigation) tracked for debugging
 *
 * ## Security Considerations
 * - Does not expose sensitive error details (stack traces, database info)
 * - Sanitizes error messages before display
 * - Maintains authentication state during error recovery
 * - Audit logs error occurrences for security monitoring
 *
 * @see {@link GenericDomainError} for reusable error display component
 *
 * @example
 * ```tsx
 * // Automatically catches errors in /incidents/* routes
 * // User sees friendly error message with recovery options
 * // Clicking "Try Again" resets error boundary and reloads page
 * ```
 */

import { GenericDomainError } from '@/components/errors/GenericDomainError';
import { AlertCircle } from 'lucide-react';

/**
 * Incidents Error Boundary Component
 *
 * Client component that catches and displays errors occurring in incident routes.
 * Provides contextual error messaging specific to incident management workflows.
 *
 * @component
 * @client
 *
 * @param {Object} props - Component props
 * @param {Error & { digest?: string }} props.error - Error object with optional error digest for logging
 * @param {() => void} props.reset - Function to reset error boundary and retry rendering
 *
 * @returns {JSX.Element} Rendered error display with recovery options
 *
 * @description
 * Displays user-friendly error message with:
 * - Domain-specific icon (AlertCircle)
 * - Custom error message about incident tracking impact
 * - Contextual recovery steps (retry, verify submission, check network, contact support)
 * - Error digest for support reference
 *
 * Error digest is automatically logged to monitoring system for debugging and can be
 * referenced in support tickets.
 *
 * @example
 * ```tsx
 * // Automatically invoked by Next.js when error occurs in /incidents routes
 * // Error boundary catches error and renders this component
 * <IncidentsError
 *   error={new Error("Failed to fetch incidents")}
 *   reset={() => window.location.reload()}
 * />
 * ```
 */
export default function IncidentsError({
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
      domain="Incidents"
      domainIcon={<AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />}
      customMessage="Unable to load incident reports. This may affect incident tracking and reporting."
      customRecoverySteps={[
        'Click "Try Again" to reload incident data',
        'If you just submitted a report, verify it was saved',
        'Check your network connection',
        'Contact IT support if error persists',
      ]}
    />
  );
}
