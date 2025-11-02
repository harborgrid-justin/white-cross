'use client';

/**
 * @fileoverview Documents Route Error Boundary - Error handling for document operations
 *
 * This error boundary catches and handles errors that occur within the documents
 * section of the application. It provides user-friendly error messages and recovery
 * options while maintaining security by not exposing sensitive system details.
 *
 * **Error Handling Features:**
 * - Catches runtime errors in documents pages
 * - Displays user-friendly error messages
 * - Provides "Try Again" recovery action
 * - Logs errors for debugging (without exposing to users)
 * - Maintains layout consistency during errors
 * - Prevents entire app from crashing
 *
 * **Common Error Scenarios:**
 * - Network failures during document fetch
 * - Permission denied accessing specific documents
 * - Document not found (deleted or moved)
 * - Server errors during document operations
 * - File storage service unavailable
 *
 * **Security Considerations:**
 * - Never displays stack traces to users
 * - Avoids leaking PHI in error messages
 * - Uses error digest for server-side correlation
 * - Sanitizes error messages before display
 *
 * @module app/documents/error
 * @requires @/components/shared/errors/GenericDomainError - Reusable error component
 * @requires lucide-react - Icon library for visual feedback
 *
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/error-handling|Next.js Error Handling}
 */

import { GenericDomainError } from '@/components/shared/errors/GenericDomainError';
import { FileText } from 'lucide-react';

/**
 * Props interface for Documents Error Boundary
 *
 * @interface DocumentsErrorProps
 * @property {Error & { digest?: string }} error - Error object with optional digest for logging
 * @property {() => void} reset - Function to reset error boundary and retry
 */
interface DocumentsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Documents Error Boundary Component
 *
 * Client component that catches errors in the documents section and displays
 * a user-friendly error page with recovery options. Integrates with Next.js
 * error handling system to provide resilient document management.
 *
 * **Error Recovery:**
 * - "Try Again" button calls reset() to retry the failed operation
 * - Reset re-renders the component tree from the error boundary
 * - Temporary errors (network issues) often resolve on retry
 * - Persistent errors should show appropriate guidance
 *
 * **Error Message Guidelines:**
 * - Generic but helpful: Indicates what failed (documents loading)
 * - Actionable: Suggests trying again
 * - Non-technical: No stack traces or error codes visible
 * - Contextual: Mentions specific domain (documents)
 *
 * **Error Digest:**
 * The error digest property is a unique identifier for this error instance.
 * It's used server-side to correlate client errors with server logs for debugging
 * without exposing sensitive implementation details to users.
 *
 * @function DocumentsError
 * @param {DocumentsErrorProps} props - Error and reset function
 * @returns {JSX.Element} Error UI with recovery option
 *
 * @example
 * // Network error during document fetch
 * // 1. API call fails with network timeout
 * // 2. Error boundary catches the error
 * // 3. User sees friendly message: "Unable to load documents..."
 * // 4. User clicks "Try Again"
 * // 5. reset() called, page attempts to reload
 * // 6. If network restored, documents load successfully
 *
 * @example
 * // Permission denied error
 * // 1. User tries to access restricted document
 * // 2. API returns 403 Forbidden
 * // 3. Error boundary shows: "Unable to load documents..."
 * // 4. User clicks "Try Again" but still lacks permission
 * // 5. Admin needs to grant access separately
 */
export default function DocumentsError({
  error,
  reset,
}: DocumentsErrorProps) {
  return (
    <GenericDomainError
      error={error}
      reset={reset}
      domain="Documents"
      domainIcon={<FileText className="h-8 w-8 text-red-600 dark:text-red-400" />}
      customMessage="Unable to load documents. Files and document templates may not be accessible."
    />
  );
}
