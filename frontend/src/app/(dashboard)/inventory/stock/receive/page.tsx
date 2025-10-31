/**
 * @fileoverview Stock Receiving Page
 *
 * Interface for receiving inventory shipments, purchase orders, and donations
 * into stock. Implements comprehensive receiving workflow with quality checks,
 * batch tracking, and inventory valuation updates.
 *
 * **Receiving Workflow:**
 * 1. Scan/enter purchase order or shipment reference
 * 2. Verify item details (SKU, description, quantity)
 * 3. Perform quality inspection (damage, expiration checks)
 * 4. Record batch/lot numbers and expiration dates
 * 5. Assign storage location
 * 6. Update inventory quantities and valuation
 * 7. Generate receiving report
 *
 * **Quality Control:**
 * - Visual inspection for damage
 * - Temperature verification for refrigerated items
 * - Expiration date validation (reject if <90 days for short-shelf-life items)
 * - Package integrity checks
 * - Controlled substance verification (match DEA schedule)
 *
 * **Batch/Lot Tracking:**
 * - Mandatory batch number entry for medications
 * - Expiration date tracking for all perishable items
 * - Manufacturer information capture
 * - Recall tracking support (batch-level traceability)
 *
 * **Inventory Valuation Updates:**
 * - Increase on-hand quantity
 * - Update total stock value (quantity × unit cost)
 * - Calculate weighted average cost if using WAC method
 * - Record purchase price for cost analysis
 *
 * **Integration Points:**
 * - Purchase order system (auto-match PO line items)
 * - Vendor management (supplier tracking)
 * - Accounting (COGS and inventory asset updates)
 * - Alert system (clear low stock alerts when reorder point exceeded)
 *
 * @module app/(dashboard)/inventory/stock/receive
 * @see {@link ReceiveStockContent} Server component with receiving form
 * @see {@link module:app/(dashboard)/inventory/transactions} Receipt history
 */

import React from 'react';
import { Metadata } from 'next';
import { ReceiveStockContent } from './_components/ReceiveStockContent';

export const metadata: Metadata = {
  title: 'Receive Stock | Inventory',
  description: 'Receive stock shipments',
};

/**
 * Force dynamic rendering for real-time PO matching and validation.
 */
export const dynamic = 'force-dynamic';

/**
 * Stock Receiving Page Component
 *
 * @returns {JSX.Element} Server-rendered stock receiving form
 */
export default function ReceiveStockPage() {
  return <ReceiveStockContent />;
}
