/**
 * @fileoverview Transaction History Page
 *
 * Comprehensive audit trail displaying all inventory transactions across all
 * items and locations. Provides searchable, filterable view of receive, issue,
 * adjust, and transfer operations for compliance and inventory analysis.
 *
 * **Transaction Types Tracked:**
 * - **Receive**: Stock receipts from purchase orders, donations, returns
 * - **Issue**: Stock dispensing to students, staff, departments
 * - **Adjust**: Manual corrections, physical count reconciliations, waste
 * - **Transfer**: Inter-location stock movements
 *
 * **Audit Trail Information:**
 * - Transaction ID (unique identifier)
 * - Transaction type and description
 * - Item details (name, SKU, category)
 * - Quantity and unit of measure
 * - Location (from/to for transfers)
 * - User who performed transaction
 * - Timestamp (date and time)
 * - Reason codes and notes
 * - Before/after quantities
 * - Cost impact (valuation changes)
 *
 * **Search and Filtering:**
 * - Date range selection (last 7/30/90 days, custom range)
 * - Transaction type filter
 * - Item/SKU search
 * - User filter (who performed transaction)
 * - Location filter
 * - Amount range filter
 *
 * **HIPAA Compliance:**
 * - All PHI-related transactions logged
 * - Medication dispensing linked to patient records
 * - Controlled substance transactions highlighted
 * - Access to transaction history logged for audit
 * - Tamper-proof audit trail (no deletions, only corrections via new transactions)
 *
 * **Export Capabilities:**
 * - CSV export for external analysis
 * - PDF reports for compliance documentation
 * - Filtered export (only selected transactions)
 * - Scheduled reports (daily, weekly, monthly summaries)
 *
 * **Integration Points:**
 * - Stock operations (all create transaction records)
 * - Compliance reporting (audit trail source)
 * - Financial reporting (COGS calculations)
 * - User activity tracking (who did what when)
 *
 * @module app/(dashboard)/inventory/transactions
 * @see {@link TransactionHistoryContent} Server component with transaction data
 * @see {@link module:app/(dashboard)/inventory/transactions/[id]} Transaction details
 */

import React from 'react';
import { Metadata } from 'next';
import { TransactionHistoryContent } from './_components/TransactionHistoryContent';

export const metadata: Metadata = {
  title: 'Transaction History | Inventory',
  description: 'View inventory transaction history',
};

/**
 * Force dynamic rendering for real-time transaction data and authentication.
 */
export const dynamic = 'force-dynamic';

/**
 * Transaction History Page Component
 *
 * @returns {JSX.Element} Server-rendered transaction history interface
 */
export default function TransactionHistoryPage() {
  return <TransactionHistoryContent />;
}
