/**
 * @fileoverview Stock Adjustment Page
 *
 * Manual stock level adjustment interface for inventory corrections, physical
 * count reconciliations, and other non-transactional quantity changes. Provides
 * full audit trail logging for HIPAA compliance and inventory accountability.
 *
 * **Adjustment Types:**
 * - Physical count corrections (reconcile actual vs. system counts)
 * - Damage/loss adjustments (expired, broken, stolen items)
 * - Found inventory (discovered items not in system)
 * - System corrections (fix data entry errors)
 * - Waste disposal (expired medications, supplies)
 *
 * **Audit Trail Requirements:**
 * - Reason code mandatory for all adjustments
 * - User identification and timestamp
 * - Before/after quantities logged
 * - Supporting documentation references
 * - Supervisor approval for large adjustments (configurable threshold)
 *
 * **Healthcare Compliance:**
 * - Enhanced logging for controlled substances
 * - Medication waste documentation requirements
 * - DEA compliance for scheduled medications
 * - Chain of custody tracking
 *
 * **Business Rules:**
 * - Cannot adjust below zero
 * - Large adjustments may require approval (>20% of current quantity)
 * - Expiring items flagged for review before adjustment
 * - Multi-location adjustments handled separately
 *
 * @module app/(dashboard)/inventory/stock/adjust
 * @see {@link StockAdjustmentContent} Server component with adjustment form
 * @see {@link module:app/(dashboard)/inventory/transactions} Audit history
 */

import React from 'react';
import { Metadata } from 'next';
import { StockAdjustmentContent } from './_components/StockAdjustmentContent';

export const metadata: Metadata = {
  title: 'Adjust Stock | Inventory',
  description: 'Manually adjust stock levels',
};

/**
 * Force dynamic rendering for authentication and real-time validation.
 */
export const dynamic = 'force-dynamic';

/**
 * Stock Adjustment Page Component
 *
 * @returns {JSX.Element} Server-rendered stock adjustment form
 */
export default function StockAdjustmentPage() {
  return <StockAdjustmentContent />;
}
