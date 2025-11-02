'use client';

/**
 * @fileoverview Inventory Error Boundary Component
 *
 * Next.js error boundary for graceful error handling within inventory routes.
 * Catches and displays errors that occur during server-side rendering, data
 * fetching, or client-side operations in the inventory management module.
 *
 * **Error Handling Strategy:**
 * - Catches all errors within /inventory/* routes
 * - Provides contextual error messaging for inventory operations
 * - Offers recovery mechanism via reset function
 * - Maintains application stability during failures
 *
 * **Common Error Scenarios:**
 * - Database connection failures
 * - API timeout or network errors
 * - Invalid inventory data or corrupted records
 * - Authentication/authorization failures
 * - Missing or expired medication batch data
 *
 * **Healthcare Considerations:**
 * - Critical alerts about stock/medication visibility issues
 * - User guidance for emergency inventory access
 * - Error logging for compliance and audit trails
 *
 * @module app/(dashboard)/inventory/error
 * @requires GenericDomainError - Reusable error UI component
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/error} Next.js Error Handling
 */

import { GenericDomainError } from '@/components/shared/errors/GenericDomainError';
import { Package } from 'lucide-react';

/**
 * Error boundary props interface for inventory route errors.
 */
interface InventoryErrorProps {
  /** Error object with optional digest for error tracking */
  error: Error & { digest?: string };
  /** Function to attempt recovery by re-rendering the route */
  reset: () => void;
}

/**
 * Inventory Error Boundary Component
 *
 * Next.js error boundary that catches and handles errors within inventory routes.
 * Provides user-friendly error display with contextual messaging specific to
 * inventory management operations and healthcare supply tracking.
 *
 * **Error Recovery:**
 * - Reset button attempts to re-render the failing component
 * - Useful for transient errors (network issues, temporary DB problems)
 * - Preserves user context and navigation state
 *
 * **User Communication:**
 * - Clear indication that inventory data may be unavailable
 * - Specific mention of stock levels and medication inventory
 * - Visual inventory icon for domain context
 *
 * @param {InventoryErrorProps} props - Error boundary props
 * @returns {JSX.Element} Error UI with recovery option
 *
 * @example
 * ```tsx
 * // Automatically rendered by Next.js when error occurs in:
 * // - /inventory/stock
 * // - /inventory/items
 * // - /inventory/transactions
 * // - Any other /inventory/* route
 * ```
 */
export default function InventoryError({
  error,
  reset,
}: InventoryErrorProps) {
  return (
    <GenericDomainError
      error={error}
      reset={reset}
      domain="Inventory"
      domainIcon={<Package className="h-8 w-8 text-red-600 dark:text-red-400" />}
      customMessage="Unable to load inventory data. Stock levels and medication inventory may not be visible."
    />
  );
}
