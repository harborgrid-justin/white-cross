/**
 * @fileoverview Low Stock Alerts Page
 *
 * Monitoring dashboard for items below reorder points, requiring immediate
 * attention to prevent stockouts. Implements prioritized alert system with
 * automatic reorder suggestions and procurement workflow integration.
 *
 * **Alert Priority Levels:**
 * - **Critical**: Quantity ≤ 25% of reorder point (immediate action required)
 * - **High**: Quantity ≤ 50% of reorder point (order within 48 hours)
 * - **Medium**: Quantity ≤ reorder point (order within 1 week)
 * - **Watch**: Quantity ≤ 120% of reorder point (monitor closely)
 *
 * **Alert Information Displayed:**
 * - Item name, SKU, and category
 * - Current quantity on hand
 * - Reorder point threshold
 * - Shortage quantity (reorder point - current)
 * - Suggested order quantity
 * - Primary location
 * - Days until stockout (based on usage rate)
 * - Preferred supplier information
 * - Last order date
 *
 * **Reorder Calculation Algorithm:**
 * ```
 * Reorder Point = (Average Daily Usage × Lead Time Days) + Safety Stock
 * Reorder Quantity = (Reorder Point - Current Quantity) + Economic Order Quantity
 * Days Until Stockout = Current Quantity / Average Daily Usage
 * ```
 *
 * **Healthcare-Critical Items:**
 * - Emergency medications flagged with high priority
 * - Life-saving supplies (EpiPens, inhalers) escalated alerts
 * - Controlled substances require DEA-compliant ordering
 * - Temperature-sensitive items need expedited delivery
 *
 * **Alert Actions:**
 * - Create purchase order (auto-populate from alert)
 * - Quick receive (if stock found in another location)
 * - Adjust reorder point (if alert threshold incorrect)
 * - Snooze alert (temporary dismissal with reason)
 * - Transfer from other location (if available)
 * - Mark as ordered (pending receipt)
 *
 * **Filtering and Sorting:**
 * - Priority level filter
 * - Category filter
 * - Location filter
 * - Supplier filter
 * - Sort by: priority, shortage quantity, days to stockout
 *
 * **Automated Notifications:**
 * - Email alerts to procurement staff
 * - Dashboard notifications
 * - Daily summary reports
 * - Escalation for critical items not addressed
 *
 * **Integration Points:**
 * - Purchase order system (create PO from alert)
 * - Supplier catalog (check availability)
 * - Budget management (verify funds available)
 * - Approval workflow (for high-value orders)
 *
 * @module app/(dashboard)/inventory/low-stock
 * @see {@link LowStockAlertsContent} Server component with alert data
 * @see {@link module:app/(dashboard)/inventory/stock/receive} Stock receiving
 */

import React from 'react';
import { Metadata } from 'next';
import { LowStockAlertsContent } from './_components/LowStockAlertsContent';

export const metadata: Metadata = {
  title: 'Low Stock Alerts | Inventory',
  description: 'View low stock alerts',
};

/**
 * Force dynamic rendering for real-time alert data and prioritization.
 */
export const dynamic = 'force-dynamic';

/**
 * Low Stock Alerts Page Component
 *
 * @returns {JSX.Element} Server-rendered low stock alert dashboard
 */
export default function LowStockAlertsPage() {
  return <LowStockAlertsContent />;
}
