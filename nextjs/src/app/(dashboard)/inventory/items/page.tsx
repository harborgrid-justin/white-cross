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

export default function InventoryItemsPage() {
  return <InventoryItemsContent />;
}
