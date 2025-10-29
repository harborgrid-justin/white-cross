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
 * Dynamic Rendering Configuration
 *
 * Force dynamic rendering to allow authentication checks at request time.
 * This page requires access to headers/cookies for user authentication,
 * which is only available during request-time rendering, not at build time.
 *
 * **Rendering Strategy:**
 * - Page rendered dynamically on each request
 * - Authentication headers/cookies available at runtime
 * - Real-time data fetching for current inventory state
 *
 * **Trade-offs:**
 * - Pro: Always shows current data with proper authentication
 * - Pro: No build-time authentication errors
 * - Con: Slightly slower than ISR cached responses
 * - Mitigation: Client-side caching and optimized queries minimize impact
 */
export const dynamic = 'force-dynamic';

/**
 * Inventory Items List Page Component
 *
 * @returns {JSX.Element} Server-rendered inventory items catalog
 */
export default function InventoryItemsPage() {
  return <InventoryItemsContent />;
}
