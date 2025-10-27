/**
 * @fileoverview Edit Inventory Item Page
 *
 * Form interface for modifying existing inventory item master data. Supports
 * updates to item metadata, reorder parameters, pricing, and categorization
 * while maintaining stock quantity history.
 *
 * **Editable Fields:**
 * - Item name and description
 * - Category and subcategory assignment
 * - Unit cost and pricing (creates pricing history record)
 * - Reorder point and reorder quantity
 * - Supplier information
 * - Storage location assignment
 * - Special handling instructions
 * - Temperature requirements
 *
 * **Protected Fields (Read-Only):**
 * - SKU/item number (immutable after creation)
 * - Current stock quantities (use stock transactions instead)
 * - Historical transactions (immutable audit trail)
 * - Created date and original creator
 *
 * **Medical Supply Updates:**
 * - NDC code modification (with validation)
 * - DEA schedule changes (requires authorization)
 * - Lot/batch tracking toggle (affects future receipts)
 * - Expiration tracking settings
 *
 * **Business Rules:**
 * - Cannot reduce reorder point below current low stock threshold
 * - Unit cost changes create price history entry (for COGS accuracy)
 * - Category changes may affect reporting and compliance tracking
 * - Supplier changes update preferred supplier only
 *
 * **Audit Trail:**
 * - All field changes logged with timestamp and user
 * - Before/after values stored for compliance
 * - Price changes tracked separately for financial reporting
 * - Critical field changes (DEA schedule) require approval
 *
 * **Validation:**
 * - Required fields must remain populated
 * - Format validation for codes (NDC, etc.)
 * - Business rule enforcement (reorder point > 0)
 * - Unique constraint checking (if SKU editable in future)
 *
 * **Dynamic Route Parameter:**
 * - `params.id`: Inventory item UUID from URL path
 *
 * @module app/(dashboard)/inventory/items/[id]/edit
 * @see {@link EditInventoryItemContent} Form component with update logic
 * @see {@link module:app/(dashboard)/inventory/items/[id]} Item detail view
 */

import React from 'react';
import { Metadata } from 'next';
import { EditInventoryItemContent } from './EditInventoryItemContent';

export const metadata: Metadata = {
  title: 'Edit Item | Inventory',
  description: 'Edit inventory item details',
};

/**
 * Force dynamic rendering for authentication and data freshness.
 */
export const dynamic = "force-dynamic";

/**
 * Props interface for dynamic route page component.
 */
interface EditInventoryItemPageProps {
  /** Next.js dynamic route params */
  params: {
    /** Inventory item UUID from URL path */
    id: string;
  };
}

/**
 * Edit Inventory Item Page Component
 *
 * Dynamic route page that renders the edit form for a specific inventory item.
 * Extracts item ID from URL path parameters and passes to content component
 * for server-side data fetching and form population.
 *
 * @param {EditInventoryItemPageProps} props - Page props with route params
 * @returns {JSX.Element} Server-rendered item edit form
 *
 * @example
 * ```
 * // URL: /inventory/items/550e8400-e29b-41d4-a716-446655440000/edit
 * // Renders edit form for item with ID: 550e8400-e29b-41d4-a716-446655440000
 * ```
 */
export default function EditInventoryItemPage({ params }: EditInventoryItemPageProps) {
  return <EditInventoryItemContent itemId={params.id} />;
}
