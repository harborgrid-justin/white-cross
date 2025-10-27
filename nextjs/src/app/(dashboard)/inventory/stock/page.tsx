/**
 * @fileoverview Stock Levels Monitoring Page
 *
 * Comprehensive view of current stock levels across all inventory locations.
 * Provides real-time visibility into on-hand quantities, reorder points, and
 * stock valuation for medical supplies and general inventory items.
 *
 * **Features:**
 * - Multi-location stock level display
 * - Real-time quantity monitoring
 * - Reorder point indicators
 * - Stock valuation calculations
 * - Batch/lot tracking for medical supplies
 * - Expiration date visibility
 * - Search and filtering capabilities
 *
 * **Healthcare Integration:**
 * - Critical medication tracking
 * - Emergency supply monitoring
 * - Controlled substance inventory levels
 * - Multi-location visibility for school health offices
 *
 * **Stock Monitoring Logic:**
 * - Green status: Quantity > reorder point
 * - Yellow status: Quantity ≤ reorder point
 * - Red status: Quantity ≤ 50% of reorder point (critical)
 *
 * @module app/(dashboard)/inventory/stock
 * @see {@link StockLevelsContent} Server component with stock data fetching
 * @see {@link module:app/(dashboard)/inventory/low-stock} Low stock alerts
 */

import React from 'react';
import { Metadata } from 'next';
import { StockLevelsContent } from './StockLevelsContent';

/**
 * Page metadata for stock levels view.
 */
export const metadata: Metadata = {
  title: 'Stock Levels | Inventory',
  description: 'View current stock levels',
};

/**
 * Force dynamic rendering for real-time stock data and authentication.
 */
export const dynamic = "force-dynamic";

/**
 * Stock Levels Page Component
 *
 * @returns {JSX.Element} Server-rendered stock levels interface
 */
export default function StockLevelsPage() {
  return <StockLevelsContent />;
}
