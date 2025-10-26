/**
 * Edit Inventory Item Page
 *
 * Edit an existing inventory item
 */

import React from 'react';
import { Metadata } from 'next';
import { EditInventoryItemContent } from './EditInventoryItemContent';

export const metadata: Metadata = {
  title: 'Edit Item | Inventory',
  description: 'Edit inventory item details',
};

interface EditInventoryItemPageProps {
  params: {
    id: string;
  };
}

export default function EditInventoryItemPage({ params }: EditInventoryItemPageProps) {
  return <EditInventoryItemContent itemId={params.id} />;
}
