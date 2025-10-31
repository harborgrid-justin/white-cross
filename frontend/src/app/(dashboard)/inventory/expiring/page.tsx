/**
 * @fileoverview Expiring Items Monitoring Page
 *
 * Dashboard for tracking items approaching expiration dates, preventing waste
 * and ensuring medication safety. Implements FEFO (First Expired, First Out)
 * principles and automated expiration alerts for healthcare compliance.
 *
 * **Expiration Priority Levels:**
 * - **Critical**: Expires within 7 days (urgent use or disposal required)
 * - **High**: Expires within 14 days (prioritize for dispensing)
 * - **Medium**: Expires within 30 days (monitor and plan usage)
 * - **Watch**: Expires within 60 days (track for upcoming expiration)
 *
 * **Item Information Displayed:**
 * - Item name, SKU, and category
 * - Batch/lot number
 * - Expiration date
 * - Days until expiration
 * - Current quantity remaining
 * - Storage location
 * - Unit value (waste cost if expired)
 * - Supplier information
 * - Recall status (if applicable)
 *
 * **FEFO Implementation (First Expired, First Out):**
 * - Automatic batch selection during stock issuance
 * - Prioritizes batches closest to expiration
 * - Prevents issuance of expired items (system blocks)
 * - Alerts users when issuing near-expiration items
 *
 * **Healthcare Medication Safety:**
 * - FDA compliance: Never dispense expired medications
 * - Controlled substances: DEA-compliant disposal documentation
 * - Vaccines: Strict temperature and expiration monitoring
 * - Emergency medications: Proactive replacement before expiration
 *
 * **Expiration Actions:**
 * - **Use First**: Flag batch for priority dispensing
 * - **Transfer**: Move to high-usage location
 * - **Return to Supplier**: If unopened and within return window
 * - **Dispose/Waste**: Document disposal with witness signature
 * - **Extend Expiration**: If manufacturer extends (rare, requires documentation)
 * - **Emergency Use**: Override for critical situations (logged)
 *
 * **Waste Prevention Strategies:**
 * - Early warning notifications (30, 14, 7 days before expiration)
 * - Automatic reorder quantity adjustment (reduce if consistent waste)
 * - Usage rate analysis (identify slow-moving items)
 * - Transfer to higher-demand locations
 * - Donation to clinics (before expiration, if permitted)
 *
 * **Disposal Documentation:**
 * - Waste reason code (expired, damaged, contaminated)
 * - Disposal method (pharmaceutical waste, regular trash, DEA collection)
 * - Witness signature (required for controlled substances)
 * - Cost of waste (for financial tracking)
 * - Disposal date and user
 * - Certificate of destruction (for controlled substances)
 *
 * **Reporting and Analytics:**
 * - Waste cost by category and item
 * - Expiration trends over time
 * - Slow-moving item identification
 * - Reorder quantity optimization suggestions
 * - Supplier performance (short shelf-life deliveries)
 *
 * **Automated Notifications:**
 * - Email alerts at 30, 14, and 7 days before expiration
 * - Dashboard warnings for critical expirations
 * - Daily expiration summary report
 * - Weekly waste prevention report
 *
 * @module app/(dashboard)/inventory/expiring
 * @see {@link ExpiringItemsContent} Server component with expiration data
 * @see {@link module:app/(dashboard)/inventory/stock/issue} FEFO stock issuance
 */

import React from 'react';
import { Metadata } from 'next';
import { ExpiringItemsContent } from './_components/ExpiringItemsContent';

export const metadata: Metadata = {
  title: 'Expiring Items | Inventory',
  description: 'View items approaching expiration',
};

/**
 * Force dynamic rendering for real-time expiration tracking.
 */
export const dynamic = 'force-dynamic';

/**
 * Expiring Items Monitoring Page Component
 *
 * @returns {JSX.Element} Server-rendered expiration tracking dashboard
 */
export default function ExpiringItemsPage() {
  return <ExpiringItemsContent />;
}
