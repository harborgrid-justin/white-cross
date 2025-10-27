/**
 * @fileoverview Inventory Reports Page
 *
 * Comprehensive reporting interface for inventory analytics, compliance reports,
 * and operational insights. Provides pre-built and custom report generation with
 * export capabilities for data analysis and regulatory compliance.
 *
 * **Report Categories:**
 *
 * **1. Valuation Reports:**
 * - Inventory valuation by location, category, supplier
 * - Cost of goods sold (COGS) analysis
 * - Inventory turnover ratio
 * - Dead stock and obsolescence
 * - Price variance analysis
 * - Inventory aging report
 *
 * **2. Stock Status Reports:**
 * - Stock levels by item, category, location
 * - Reorder status and recommendations
 * - Stock availability and fill rate
 * - Safety stock analysis
 * - Out-of-stock incidents
 * - Overstock identification
 *
 * **3. Transaction Reports:**
 * - Transaction history (receive, issue, adjust, transfer)
 * - Usage trends and patterns
 * - Issue frequency by item
 * - Receiving history by supplier
 * - Adjustment audit trail
 * - Transfer activity between locations
 *
 * **4. Compliance Reports:**
 * - Controlled substance tracking (DEA compliance)
 * - Medication dispensing audit (HIPAA)
 * - Expiration management compliance
 * - Temperature monitoring logs
 * - Waste and disposal documentation
 * - Recall tracking and response
 *
 * **5. Alert and Exception Reports:**
 * - Low stock alerts summary
 * - Expiring items forecast
 * - High-value variances
 * - Unusual transaction patterns
 * - Slow-moving inventory
 * - High-shrinkage items
 *
 * **6. Performance Metrics:**
 * - Inventory turnover by category
 * - Days on hand (DOH)
 * - Fill rate and service level
 * - Stock accuracy percentage
 * - Order cycle time
 * - Carrying cost analysis
 *
 * **7. Healthcare-Specific Reports:**
 * - Medication usage by student population
 * - Emergency supply readiness
 * - Vaccine inventory and expiration
 * - Allergy medication availability
 * - Athletic injury supply usage
 * - Controlled substance accountability
 *
 * **Report Parameters:**
 * - Date range selection
 * - Location filter
 * - Category filter
 * - Item or SKU filter
 * - User/department filter
 * - Transaction type filter
 * - Custom field grouping
 *
 * **Report Formats:**
 * - **PDF**: Professional formatted reports for presentation
 * - **CSV**: Raw data export for Excel analysis
 * - **Excel**: Formatted spreadsheets with charts
 * - **Dashboard**: Interactive web-based visualization
 * - **Email**: Scheduled email delivery
 *
 * **Scheduled Reports:**
 * - Daily transaction summary
 * - Weekly low stock alerts
 * - Monthly valuation and turnover
 * - Quarterly compliance reports
 * - Annual physical inventory results
 *
 * **Custom Report Builder:**
 * - Drag-and-drop field selection
 * - Custom calculation columns
 * - Grouping and subtotals
 * - Chart and graph integration
 * - Save custom report templates
 * - Share reports with team
 *
 * **Key Performance Indicators (KPIs):**
 * - **Inventory Turnover**: COGS / Average Inventory Value
 * - **Days on Hand**: (Average Inventory / COGS) × 365
 * - **Fill Rate**: Orders Filled Completely / Total Orders × 100
 * - **Stock Accuracy**: Items within ±5% / Total Items × 100
 * - **Carrying Cost**: Annual Storage + Capital Cost
 * - **Waste Rate**: Value of Expired Items / Total Inventory Value × 100
 *
 * **Integration Points:**
 * - Accounting system (valuation, COGS)
 * - Compliance systems (DEA, FDA reporting)
 * - Business intelligence tools (data warehouse export)
 * - ERP systems (procurement, budgeting)
 *
 * @module app/(dashboard)/inventory/reports
 * @see {@link InventoryReportsContent} Server component with report generation
 * @see {@link module:app/(dashboard)/inventory/transactions} Transaction data source
 */

import React from 'react';
import { Metadata } from 'next';
import { InventoryReportsContent } from './InventoryReportsContent';

export const metadata: Metadata = {
  title: 'Reports | Inventory',
  description: 'Generate inventory reports',
};

/**
 * Force dynamic rendering for real-time report generation and data access.
 */
export const dynamic = "force-dynamic";

/**
 * Inventory Reports Page Component
 *
 * @returns {JSX.Element} Server-rendered report generation interface
 */
export default function InventoryReportsPage() {
  return <InventoryReportsContent />;
}
