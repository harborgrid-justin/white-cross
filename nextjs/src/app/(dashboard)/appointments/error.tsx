'use client';

/**
 * @fileoverview Appointments Route Error Boundary Component
 * @module app/appointments/error
 *
 * Provides a specialized error boundary for the appointments section of the application.
 * This component handles runtime errors that occur during appointment data fetching,
 * scheduling operations, or calendar rendering. It displays user-friendly error messages
 * with healthcare-specific recovery guidance.
 *
 * **Healthcare Context:**
 * - Ensures appointment scheduling errors don't disrupt critical healthcare workflows
 * - Provides clear recovery steps for school nurses to maintain appointment tracking
 * - Integrates with the broader error handling strategy for HIPAA-compliant operations
 *
 * **Error Scenarios Handled:**
 * - Appointment data fetch failures (API errors, network issues)
 * - Calendar rendering errors (date calculation, timezone issues)
 * - Permission/authorization errors for appointment access
 * - Database connection failures affecting appointment retrieval
 *
 * @see {@link GenericDomainError} for the base error component implementation
 *
 * @example
 * ```tsx
 * // This component is automatically used by Next.js error boundaries
 * // in the /appointments route segment. No manual instantiation needed.
 *
 * // To test error boundary:
 * // 1. Navigate to /appointments/calendar
 * // 2. Simulate API failure or throw error in page component
 * // 3. Error boundary will catch and display this component
 * ```
 */

import { GenericDomainError } from '@/components/errors/GenericDomainError';
import { Calendar } from 'lucide-react';

/**
 * Appointments Error Boundary Component
 *
 * Next.js automatically invokes this component when an error occurs in any
 * route under the /appointments path. It provides appointment-specific
 * error messaging and recovery options.
 *
 * **Implementation Details:**
 * - Client-side component (requires 'use client' directive)
 * - Receives error object with optional digest for error tracking
 * - Provides reset function to attempt recovery without full page reload
 *
 * **Accessibility:**
 * - Error message is announced by screen readers
 * - Recovery actions are keyboard-navigable
 * - Color coding uses accessible contrast ratios
 *
 * @param {Object} props - Component props following Next.js error boundary contract
 * @param {Error & { digest?: string }} props.error - Error object with optional digest hash for tracking
 * @param {Function} props.reset - Function to reset error boundary and retry rendering
 *
 * @returns {JSX.Element} Rendered error boundary UI with recovery options
 *
 * @example
 * ```tsx
 * // Error boundary is automatically used by Next.js
 * // Props are provided by the framework:
 * <AppointmentsError
 *   error={new Error("Failed to fetch appointments")}
 *   reset={() => window.location.reload()}
 * />
 * ```
 */
export default function AppointmentsError({
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
      domain="Appointments"
      domainIcon={<Calendar className="h-8 w-8 text-red-600 dark:text-red-400" />}
      customMessage="Unable to load appointment information. Scheduled appointments may not be visible."
      customRecoverySteps={[
        'Click "Try Again" to reload appointments',
        'Check your calendar permissions',
        'Verify network connection',
        'Contact IT support if error persists',
      ]}
    />
  );
}
