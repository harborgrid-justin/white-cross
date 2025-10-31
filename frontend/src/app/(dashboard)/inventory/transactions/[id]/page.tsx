/**
 * @fileoverview Transaction Detail Page
 *
 * Detailed view of a specific inventory transaction including all metadata,
 * user information, before/after states, and related transactions. Provides
 * comprehensive audit trail information for compliance and investigation.
 *
 * **Transaction Details Displayed:**
 * - Transaction header (ID, type, timestamp, status)
 * - User information (who performed, role, department)
 * - Item details (name, SKU, category, location)
 * - Quantity changes (before, change, after)
 * - Cost impact (unit cost, total value change)
 * - Reason codes and detailed notes
 * - Batch/lot information (if applicable)
 * - Associated documents (PO, receipt, prescription)
 * - Approval information (if required)
 *
 * **Healthcare-Specific Details:**
 * - Patient association for medication dispensing
 * - Prescription/authorization reference
 * - DEA tracking for controlled substances
 * - Witness signatures (for waste/destruction)
 * - Temperature log reference (for cold chain items)
 *
 * **Related Transactions:**
 * - Parent/child transactions (e.g., original issue + correction)
 * - Linked transfers (source and destination transactions)
 * - Batch transactions (multiple items in single operation)
 * - Reversal/correction transactions
 *
 * **Audit Information:**
 * - Complete transaction lineage
 * - System-generated metadata
 * - IP address and session information
 * - Tamper detection (hash verification)
 * - Access log (who viewed this transaction)
 *
 * **Actions Available:**
 * - Print transaction receipt
 * - Export to PDF
 * - Create correction transaction (if needed)
 * - Flag for review (suspicious activity)
 * - Add administrative notes
 *
 * **Dynamic Route Parameter:**
 * - `params.id`: Transaction UUID from URL path
 *
 * @module app/(dashboard)/inventory/transactions/[id]
 * @see {@link TransactionDetailContent} Server component with transaction details
 * @see {@link module:app/(dashboard)/inventory/transactions} Transaction history list
 */

import React from 'react';
import { Metadata } from 'next';
import { TransactionDetailContent } from './_components/TransactionDetailContent';

export const metadata: Metadata = {
  title: 'Transaction Details | Inventory',
  description: 'View transaction details',
};

/**
 * Force dynamic rendering for authentication and audit logging.
 */
export const dynamic = 'force-dynamic';

/**
 * Props interface for dynamic route page component.
 */
interface TransactionDetailPageProps {
  /** Next.js dynamic route params */
  params: {
    /** Transaction UUID from URL path */
    id: string;
  };
}

/**
 * Transaction Detail Page Component
 *
 * Dynamic route page that displays comprehensive details for a specific inventory
 * transaction. Extracts transaction ID from URL and passes to content component.
 *
 * @param {TransactionDetailPageProps} props - Page props with route params
 * @returns {JSX.Element} Server-rendered transaction detail view
 *
 * @example
 * ```
 * // URL: /inventory/transactions/7c9e6679-7425-40de-944b-e07fc1f90ae7
 * // Renders detail page for transaction ID: 7c9e6679-7425-40de-944b-e07fc1f90ae7
 * ```
 */
export default function TransactionDetailPage({ params }: TransactionDetailPageProps) {
  return <TransactionDetailContent transactionId={params.id} />;
}
