/**
 * @fileoverview Inventory Items Master List Page
 *
 * Comprehensive inventory items catalog displaying all medical supplies, medications,
 * equipment, and general supplies. Provides search, filtering, sorting, and bulk
 * operations for efficient inventory management.
 *
 * **Features:**
 * - Searchable items list (name, SKU, category, manufacturer)
 * - Advanced filtering (category, location, stock status, expiration)
 * - Sortable columns (name, quantity, value, last updated)
 * - Bulk operations (export, print labels, batch updates)
 * - Quick stock level indicators (in stock, low, critical, out of stock)
 * - Category-based grouping and organization
 *
 * **Item Information Displayed:**
 * - Item name and description
 * - SKU/item number
 * - Category and subcategory
 * - Current quantity on hand (all locations)
 * - Reorder point and status
 * - Unit cost and total value
 * - Primary location
 * - Last transaction date
 *
 * **Healthcare-Specific Features:**
 * - Medication vs. supply differentiation
 * - Controlled substance indicators
 * - Expiration date warnings
 * - Lot/batch tracking visibility
 * - DEA schedule classification display
 *
 * **Performance Optimization:**
 * - ISR (Incremental Static Regeneration) with 10-minute cache
 * - Reduces database load for frequently accessed inventory list
 * - Background revalidation ensures data freshness
 * - Client-side search/filter for instant responsiveness
 *
 * @module app/(dashboard)/inventory/items
 * @see {@link InventoryItemsContent} Server component with items data
 * @see {@link module:app/(dashboard)/inventory/items/new} Create new item
 */

import React from 'react';
import { Metadata } from 'next';
import { InventoryItemsContent } from './_components/InventoryItemsContent';

export const metadata: Metadata = {
  title: 'Inventory Items | White Cross',
  description: 'View and manage inventory items',
};

/**
 * ISR Configuration - Incremental Static Regeneration
 *
 * Cache inventory items list for 10 minutes to improve performance while
 * maintaining reasonable data freshness. Inventory master data changes slowly
 * (new items added occasionally, metadata updates infrequent), making ISR
 * ideal for this use case.
 *
 * **Cache Strategy:**
 * - Page generated statically with 600-second (10-minute) stale time
 * - Background revalidation triggered after 10 minutes
 * - Users see cached version while new version generates
 * - Stock quantities fetched client-side for real-time accuracy
 *
 * **Trade-offs:**
 * - Pro: 10x+ performance improvement on inventory list loads
 * - Pro: Reduced database load for high-traffic endpoints
 * - Con: Item metadata (name, category) may be up to 10 minutes stale
 * - Con: New items take up to 10 minutes to appear (acceptable delay)
 */
export const revalidate = 600; // Revalidate every 10 minutes

/**
 * Inventory Items List Page Component
 *
 * @returns {JSX.Element} Server-rendered inventory items catalog
 */
export default function InventoryItemsPage() {
  return <InventoryItemsContent />;
}
