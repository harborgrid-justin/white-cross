/**
 * @fileoverview Stock Transfer Page
 *
 * Interface for transferring inventory between locations (e.g., main health office
 * to satellite clinic, central storage to school building). Maintains accurate
 * multi-location inventory tracking and creates full audit trail for compliance.
 *
 * **Transfer Workflow:**
 * 1. Select source location (from)
 * 2. Select destination location (to)
 * 3. Choose items and quantities to transfer
 * 4. Verify availability at source location
 * 5. Create transfer record (pending status)
 * 6. Source location: Issue items (decrement quantity)
 * 7. Destination location: Receive items (increment quantity)
 * 8. Complete transfer (both locations updated atomically)
 *
 * **Multi-Location Tracking:**
 * - Maintains separate stock counts per location
 * - Prevents over-transfer (cannot transfer more than available)
 * - Tracks in-transit inventory during transfer
 * - Real-time location-specific stock levels
 * - Location-based reorder point calculations
 *
 * **Healthcare Use Cases:**
 * - Emergency medication transfers between school buildings
 * - Seasonal redistribution (flu season vaccine distribution)
 * - Equipment sharing between health offices
 * - Centralized procurement with distributed dispensing
 * - Athletic event supply transfers
 *
 * **Audit Trail:**
 * - Complete transfer history (from, to, quantity, date, user)
 * - Reason code for transfer
 * - Approval workflow for high-value or controlled items
 * - Chain of custody for controlled substances
 * - Integration with transaction log
 *
 * **Business Rules:**
 * - Cannot transfer negative quantities
 * - Cannot transfer more than available at source
 * - Cannot transfer to same location (source = destination)
 * - Controlled substances require additional authorization
 * - High-value items (>$500) may require approval
 *
 * **Atomic Transaction:**
 * - Both locations updated in single database transaction
 * - Rollback if either operation fails
 * - Prevents inventory discrepancies
 * - Ensures data consistency
 *
 * @module app/(dashboard)/inventory/stock/transfer
 * @see {@link TransferStockContent} Server component with transfer form
 * @see {@link module:app/(dashboard)/inventory/transactions} Transfer history
 * @see {@link module:app/(dashboard)/inventory/locations} Location management
 */

import React from 'react';
import { Metadata } from 'next';
import { TransferStockContent } from './_components/TransferStockContent';

export const metadata: Metadata = {
  title: 'Transfer Stock | Inventory',
  description: 'Transfer stock between locations',
};

/**
 * Force dynamic rendering for real-time location availability checks.
 */
export const dynamic = 'force-dynamic';

/**
 * Stock Transfer Page Component
 *
 * @returns {JSX.Element} Server-rendered stock transfer form
 */
export default function TransferStockPage() {
  return <TransferStockContent />;
}
