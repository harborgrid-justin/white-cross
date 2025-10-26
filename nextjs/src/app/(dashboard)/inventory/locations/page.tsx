/**
 * Inventory Locations Page
 *
 * Manage inventory locations
 */

import React from 'react';
import { Metadata } from 'next';
import { InventoryLocationsContent } from './InventoryLocationsContent';

export const metadata: Metadata = {
  title: 'Locations | Inventory',
  description: 'Manage inventory locations',
};

export default function InventoryLocationsPage() {
  return <InventoryLocationsContent />;
}
