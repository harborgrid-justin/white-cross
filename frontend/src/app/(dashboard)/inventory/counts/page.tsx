/**
 * @fileoverview Physical Inventory Counts Page
 *
 * Interface for conducting and reconciling physical inventory counts. Implements
 * cycle counting and annual physical inventory procedures with variance analysis
 * and automatic adjustment workflows.
 *
 * **Count Types:**
 * - **Full Physical**: Complete wall-to-wall count (annual requirement)
 * - **Cycle Count**: Regular partial counts of high-value or high-turnover items
 * - **Spot Count**: Random sampling for audit purposes
 * - **Location Count**: Count all items in specific location
 * - **Category Count**: Count all items in specific category
 * - **ABC Count**: Prioritized counting (A=high-value monthly, B=quarterly, C=annual)
 *
 * **Physical Count Workflow:**
 * 1. **Plan Count**: Select items, locations, schedule, assign counters
 * 2. **Freeze Transactions**: Optional transaction freeze during count
 * 3. **Print Count Sheets**: Generate count worksheets or use mobile app
 * 4. **Perform Count**: Count physical quantities, record batch/lot info
 * 5. **Enter Counts**: Input physical counts into system
 * 6. **Variance Analysis**: Compare physical vs. system quantities
 * 7. **Recount**: Items with large variances (>10% or >$100 value)
 * 8. **Approve**: Manager approval of final counts
 * 9. **Adjust System**: Create adjustment transactions to match physical
 * 10. **Report**: Generate variance and reconciliation reports
 *
 * **Variance Analysis:**
 * - Variance = Physical Count - System Count
 * - Variance % = (Variance / System Count) × 100
 * - Variance Value = Variance × Unit Cost
 * - Tolerance thresholds: <5% acceptable, 5-10% review, >10% recount
 *
 * **ABC Classification for Cycle Counting:**
 * - **A Items**: High value (80% of inventory $, 20% of items) - count monthly
 * - **B Items**: Medium value (15% of inventory $, 30% of items) - count quarterly
 * - **C Items**: Low value (5% of inventory $, 50% of items) - count annually
 * - Controlled substances: Count monthly regardless of ABC
 * - Emergency medications: Count monthly
 *
 * **Count Accuracy Metrics:**
 * - Count accuracy % = (Items within tolerance / Total items counted) × 100
 * - Target: >95% accuracy within ±5% tolerance
 * - Trend tracking: Monthly accuracy improvement/decline
 * - Reason code analysis: Identify root causes (shrinkage, data entry, etc.)
 *
 * **Healthcare Compliance:**
 * - Controlled substances: Mandatory periodic counting per DEA
 * - High-risk medications: Enhanced counting procedures
 * - Witness requirements: Two-person counts for controlled substances
 * - Audit trail: Complete count history with user identification
 *
 * **Variance Root Causes:**
 * - Shrinkage/theft
 * - Receiving errors (not recorded properly)
 * - Issuance errors (dispensed but not recorded)
 * - Data entry mistakes
 * - Damaged/expired items not removed
 * - Counting errors
 * - System bugs
 *
 * **Adjustment Workflow:**
 * - Variances >$500 or >20% require manager approval
 * - Reason code mandatory for all adjustments
 * - Supporting documentation attached (photos, notes)
 * - Audit trail created linking adjustment to count
 * - Recount verification for large discrepancies
 *
 * **Mobile Counting:**
 * - Barcode scanning for item identification
 * - Real-time count entry
 * - Variance alerts during counting
 * - Offline mode for areas without connectivity
 * - Photo documentation of issues
 *
 * **Reporting:**
 * - Count schedule and completion status
 * - Variance reports by item, category, location
 * - Accuracy trending over time
 * - Shrinkage and loss analysis
 * - Audit compliance reports
 *
 * @module app/(dashboard)/inventory/counts
 * @see {@link PhysicalCountsContent} Server component with count management
 * @see {@link module:app/(dashboard)/inventory/stock/adjust} Adjustment workflow
 */

import React from 'react';
import { Metadata } from 'next';
import { PhysicalCountsContent } from './_components/PhysicalCountsContent';

export const metadata: Metadata = {
  title: 'Physical Counts | Inventory',
  description: 'Manage physical inventory counts',
};

/**
 * Force dynamic rendering for real-time count data and variance calculation.
 */
export const dynamic = 'force-dynamic';

/**
 * Physical Inventory Counts Page Component
 *
 * @returns {JSX.Element} Server-rendered physical count management interface
 */
export default function PhysicalCountsPage() {
  return <PhysicalCountsContent />;
}
