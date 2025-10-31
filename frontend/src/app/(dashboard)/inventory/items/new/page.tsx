/**
 * @fileoverview New Inventory Item Creation Page
 *
 * Form-based interface for adding new items to the inventory master catalog.
 * Supports comprehensive item metadata entry including medical supply specifics,
 * reorder parameters, and multi-location setup.
 *
 * **Required Item Information:**
 * - Item name and description
 * - SKU/item number (must be unique)
 * - Category and subcategory
 * - Unit of measure (each, box, bottle, etc.)
 * - Unit cost and pricing
 * - Reorder point and reorder quantity
 * - Primary storage location
 * - Supplier/manufacturer information
 *
 * **Medical Supply Fields:**
 * - Item type (medication, medical supply, general supply, equipment)
 * - For medications: NDC code, DEA schedule, dosage form, strength
 * - Lot/batch tracking requirements (yes/no)
 * - Expiration tracking requirements (yes/no)
 * - Temperature storage requirements (room temp, refrigerated, frozen)
 * - Special handling instructions
 *
 * **Reorder Configuration:**
 * - Reorder point (quantity that triggers low stock alert)
 * - Reorder quantity (standard order amount)
 * - Lead time in days (for reorder calculation)
 * - Preferred supplier and supplier item number
 * - Economic order quantity (EOQ) if applicable
 *
 * **Business Rules:**
 * - SKU must be unique across all items
 * - Unit cost must be > 0
 * - Reorder point should be ≥ (average daily usage × lead time)
 * - Medications require DEA schedule if controlled
 * - Category must be selected from predefined list
 *
 * **Validation:**
 * - Required field checking
 * - Format validation (NDC code, currency, quantities)
 * - Duplicate SKU detection
 * - Business rule enforcement (reorder point > 0, etc.)
 *
 * @module app/(dashboard)/inventory/items/new
 * @see {@link NewInventoryItemContent} Form component
 * @see {@link module:app/(dashboard)/inventory/categories} Category management
 */

import React from 'react';
import { Metadata } from 'next';
import { NewInventoryItemContent } from './_components/NewInventoryItemContent';

export const metadata: Metadata = {
  title: 'New Inventory Item | White Cross',
  description: 'Add a new item to inventory',
};

/**
 * Force dynamic rendering for authentication and real-time validation.
 */
export const dynamic = 'force-dynamic';

/**
 * New Inventory Item Page Component
 *
 * @returns {JSX.Element} Server-rendered item creation form
 */
export default function NewInventoryItemPage() {
  return <NewInventoryItemContent />;
}
