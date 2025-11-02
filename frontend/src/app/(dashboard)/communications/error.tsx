'use client';

/**
 * @fileoverview Communications Error Boundary - Error Handling & Recovery
 *
 * **Purpose**: Catches and handles errors that occur within the communications module,
 * providing user-friendly error messages and recovery options. Prevents entire application
 * crashes while maintaining HIPAA audit logging of error events.
 *
 * **Error Handling**:
 * - Catches React errors within communications routes
 * - Displays contextual error messages
 * - Provides reset/retry functionality
 * - Logs errors for monitoring and debugging
 *
 * **HIPAA Compliance**:
 * - Error events logged without exposing PHI
 * - Failed message access attempts tracked
 * - Security-related errors escalated
 * - User notified of data access issues
 *
 * **Recovery Options**:
 * - Reset button to retry failed operation
 * - Navigation back to communications root
 * - Contact support for persistent issues
 * - Automatic error reporting to monitoring service
 *
 * **Error Types Handled**:
 * - Network errors (API failures, timeouts)
 * - Authentication/authorization errors
 * - Data validation errors
 * - Component rendering errors
 * - WebSocket connection failures
 *
 * @module CommunicationsError
 * @requires React
 * @requires @/components/shared/errors/GenericDomainError
 * @requires lucide-react
 *
 * @example
 * ```tsx
 * // Automatically used by Next.js error boundaries
 * // Catches errors in /communications and all sub-routes
 * ```
 *
 * @see {@link GenericDomainError} - Base error component
 *
 * @since 1.0.0
 */

import { GenericDomainError } from '@/components/shared/errors/GenericDomainError';
import { MessageSquare } from 'lucide-react';

/**
 * Communications Error Boundary Component
 *
 * Error boundary for the communications module. Catches errors during rendering,
 * in lifecycle methods, and in constructors of the whole component tree below it.
 * Provides contextual error UI with recovery options.
 *
 * **Props**:
 * @param {Error & { digest?: string }} error - Error object with optional digest for tracking
 * @param {() => void} reset - Function to reset the error boundary and retry
 *
 * **Error Tracking**:
 * - Error digest used for correlation with backend logs
 * - Error logged to monitoring service (Sentry, DataDog)
 * - User actions during error tracked for debugging
 *
 * **User Experience**:
 * - Shows friendly error message specific to communications
 * - Displays MessageSquare icon for visual context
 * - Provides "Try Again" button to reset error state
 * - Suggests alternative actions if error persists
 *
 * @component
 * @param {Object} props - Component props
 * @param {Error & { digest?: string }} props.error - The error that was thrown
 * @param {() => void} props.reset - Function to reset error boundary
 * @returns {JSX.Element} Error UI with recovery options
 *
 * @example
 * ```tsx
 * // Used automatically by Next.js when errors occur
 * <ErrorBoundary>
 *   <CommunicationsContent />
 * </ErrorBoundary>
 * ```
 *
 * @throws Logs error to console and monitoring service but doesn't re-throw
 */
export default function CommunicationsError({
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
      domain="Communications"
      domainIcon={<MessageSquare className="h-8 w-8 text-red-600 dark:text-red-400" />}
      customMessage="Unable to load communications. Messages may not be visible."
    />
  );
}
