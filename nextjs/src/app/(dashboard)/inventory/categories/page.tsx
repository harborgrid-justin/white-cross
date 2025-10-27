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

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

export default function InventoryCategoriesPage() {
  return <InventoryCategoriesContent />;
}
