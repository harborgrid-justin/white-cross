/**
 * Inventory Header Component
 *
 * Displays page header with title and action button
 *
 * @module components/InventoryHeader
 */

import React from 'react';
import { Plus } from 'lucide-react';

interface InventoryHeaderProps {
  onAddItem: () => void;
}

/**
 * Header component for inventory page
 */
export default function InventoryHeader({ onAddItem }: InventoryHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <p className="text-gray-600">
          Track medical supplies, equipment, and automated reordering
        </p>
      </div>
      <button className="btn-primary flex items-center" onClick={onAddItem}>
        <Plus className="h-4 w-4 mr-2" />
        Add Item
      </button>
    </div>
  );
}
