/**
 * @fileoverview Inventory Item Detail View Page
 *
 * Comprehensive item detail page displaying all information about a specific
 * inventory item including metadata, stock levels across locations, transaction
 * history, batch/lot details, and quick action buttons.
 *
 * **Information Sections:**
 * 1. **Item Overview**: Name, SKU, category, description, supplier
 * 2. **Stock Levels**: Current quantity, reorder point, status by location
 * 3. **Pricing & Valuation**: Unit cost, total value, pricing history
 * 4. **Batches/Lots**: Active batches with quantities and expiration dates
 * 5. **Transaction History**: Recent receive, issue, adjust, transfer transactions
 * 6. **Alerts**: Low stock warnings, expiration alerts, reorder reminders
 *
 * **Healthcare-Specific Display:**
 * - Medication details: NDC, DEA schedule, dosage form, strength
 * - Controlled substance compliance information
 * - Temperature storage requirements
 * - Special handling instructions
 * - Expiration tracking across all batches
 *
 * **Quick Actions:**
 * - Receive stock (add quantity)
 * - Issue stock (dispense/use)
 * - Adjust stock (corrections)
 * - Transfer stock (between locations)
 * - Edit item details
 * - View full transaction history
 * - Generate reports (usage, valuation, turnover)
 *
 * **Multi-Location Stock Display:**
 * - Separate quantities shown for each storage location
 * - Location-specific reorder points
 * - Transfer capabilities between locations
 * - Total across all locations
 *
 * **Dynamic Route Parameter:**
 * - `params.id`: Inventory item UUID from URL path
 * - Passed to content component for server-side data fetching
 *
 * @module app/(dashboard)/inventory/items/[id]
 * @see {@link InventoryItemDetailContent} Server component with item data
 * @see {@link module:app/(dashboard)/inventory/transactions} Transaction history
 */

import React from 'react';
import { Metadata } from 'next';
import { InventoryItemDetailContent } from './InventoryItemDetailContent';

export const metadata: Metadata = {
  title: 'Item Details | Inventory',
  description: 'View inventory item details',
};

/**
 * Force dynamic rendering for real-time stock levels and transaction data.
 */
export const dynamic = "force-dynamic";

/**
 * Props interface for dynamic route page component.
 */
interface InventoryItemPageProps {
  /** Next.js dynamic route params */
  params: {
    /** Inventory item UUID from URL path */
    id: string;
  };
}

/**
 * Inventory Item Detail Page Component
 *
 * Dynamic route page that displays comprehensive details for a specific inventory item.
 * Extracts item ID from URL path parameters and passes to content component.
 *
 * @param {InventoryItemPageProps} props - Page props with route params
 * @returns {JSX.Element} Server-rendered item detail view
 *
 * @example
 * ```
 * // URL: /inventory/items/550e8400-e29b-41d4-a716-446655440000
 * // Renders detail page for item with ID: 550e8400-e29b-41d4-a716-446655440000
 * ```
 */
export default function InventoryItemDetailPage({ params }: InventoryItemPageProps) {
  return <InventoryItemDetailContent itemId={params.id} />;
}
