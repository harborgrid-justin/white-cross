'use client';

/**
 * @fileoverview Compliance Route Error Boundary
 *
 * Handles errors in compliance routes with user-friendly error display and recovery options.
 * Provides domain-specific error messaging for compliance-related failures.
 *
 * @module compliance/error
 *
 * @description
 * This error boundary catches errors in compliance pages and displays appropriate
 * error messages with recovery actions. Critical for maintaining user experience
 * when compliance data fails to load.
 *
 * **Error Scenarios Handled:**
 * - Database connection failures
 * - Audit log retrieval errors
 * - Metrics calculation failures
 * - Policy data access errors
 * - Training record fetch failures
 * - Authentication/authorization errors
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/error | Next.js Error Handling}
 *
 * @remarks
 * This is a Client Component (marked with 'use client') as required by Next.js
 * for error boundaries that use interactive features like reset buttons.
 *
 * @since 1.0.0
 */

import { GenericDomainError } from '@/components/errors/GenericDomainError';
import { Shield } from 'lucide-react';

/**
 * Compliance error boundary component props
 *
 * @interface ComplianceErrorProps
 * @property {Error & { digest?: string }} error - Error object with optional digest
 * @property {() => void} reset - Function to attempt recovery by re-rendering
 */
interface ComplianceErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Compliance Error Boundary Component
 *
 * React error boundary for compliance routes that displays user-friendly error
 * messages and provides recovery options when compliance data fails to load.
 *
 * @param {ComplianceErrorProps} props - Component props
 * @param {Error} props.error - Error that was caught, with optional digest for tracking
 * @param {() => void} props.reset - Function to reset error boundary and retry
 * @returns {JSX.Element} Error UI with recovery options
 *
 * @description
 * **Features:**
 * - Domain-specific error messaging for compliance context
 * - Shield icon for visual consistency with compliance theme
 * - Reset button to retry failed operation
 * - Error digest for debugging and support
 *
 * **User Actions:**
 * - Try Again: Attempts to re-fetch compliance data
 * - Return to Dashboard: Navigate back to main compliance page
 * - Contact Support: Access help with error digest included
 *
 * @example
 * ```tsx
 * // Automatically used by Next.js when error occurs in compliance routes
 * // User sees: "Unable to load compliance data. Audit logs and compliance reports may not be accessible."
 * <ComplianceError
 *   error={new Error("Database connection failed")}
 *   reset={() => window.location.reload()}
 * />
 * ```
 *
 * @remarks
 * Must be a Client Component to use interactive features.
 * Catches errors from child Server Components during rendering or data fetching.
 */
export default function ComplianceError({
  error,
  reset,
}: ComplianceErrorProps) {
  return (
    <GenericDomainError
      error={error}
      reset={reset}
      domain="Compliance"
      domainIcon={<Shield className="h-8 w-8 text-red-600 dark:text-red-400" />}
      customMessage="Unable to load compliance data. Audit logs and compliance reports may not be accessible."
    />
  );
}
