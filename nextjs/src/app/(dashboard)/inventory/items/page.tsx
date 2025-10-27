/**
 * Inventory Items List Page
 *
 * View and manage all inventory items
 */

import React from 'react';
import { Metadata } from 'next';
import { InventoryItemsContent } from './InventoryItemsContent';

export const metadata: Metadata = {
  title: 'Inventory Items | White Cross',
  description: 'View and manage inventory items',
};

/**
 * ISR Configuration - Cache inventory for 10 minutes (600 seconds)
 * Inventory data changes slowly, so we can cache it for longer
 * to significantly improve performance.
 */
export const revalidate = 600; // Revalidate every 10 minutes

export default function InventoryItemsPage() {
  return <InventoryItemsContent />;
}
