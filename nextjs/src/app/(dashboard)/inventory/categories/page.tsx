/**
 * Inventory Categories Page
 *
 * Manage inventory categories and subcategories
 */

import React from 'react';
import { Metadata } from 'next';
import { InventoryCategoriesContent } from './InventoryCategoriesContent';

export const metadata: Metadata = {
  title: 'Categories | Inventory',
  description: 'Manage inventory categories',
};

export default function InventoryCategoriesPage() {
  return <InventoryCategoriesContent />;
}
