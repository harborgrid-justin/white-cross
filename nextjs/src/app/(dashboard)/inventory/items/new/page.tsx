/**
 * New Inventory Item Page
 *
 * Create a new inventory item
 */

import React from 'react';
import { Metadata } from 'next';
import { NewInventoryItemContent } from './NewInventoryItemContent';

export const metadata: Metadata = {
  title: 'New Inventory Item | White Cross',
  description: 'Add a new item to inventory',
};

export default function NewInventoryItemPage() {
  return <NewInventoryItemContent />;
}
