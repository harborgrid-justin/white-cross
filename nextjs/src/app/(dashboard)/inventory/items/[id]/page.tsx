/**
 * Inventory Item Detail Page
 *
 * View detailed information about a specific inventory item
 */

import React from 'react';
import { Metadata } from 'next';
import { InventoryItemDetailContent } from './InventoryItemDetailContent';

export const metadata: Metadata = {
  title: 'Item Details | Inventory',
  description: 'View inventory item details',
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

interface InventoryItemPageProps {
  params: {
    id: string;
  };
}

export default function InventoryItemDetailPage({ params }: InventoryItemPageProps) {
  return <InventoryItemDetailContent itemId={params.id} />;
}
