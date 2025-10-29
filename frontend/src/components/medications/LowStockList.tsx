'use client';

/**
 * LowStockList Component
 */

import React from 'react';
import { InventoryList, type InventoryItem } from './InventoryList';

export interface LowStockListProps {
  inventoryItems: InventoryItem[];
  isLoading?: boolean;
  onReorder?: (itemId: string) => void;
  onViewDetails?: (itemId: string) => void;
}

export const LowStockList: React.FC<LowStockListProps> = ({
  inventoryItems,
  isLoading,
  onReorder,
  onViewDetails,
}) => {
  const lowStockItems = inventoryItems.filter(
    (item) => item.reorderLevel !== undefined && item.quantity <= item.reorderLevel
  );

  return (
    <div className="space-y-4">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="font-semibold text-orange-900">Low Stock Items: {lowStockItems.length}</h3>
        <p className="text-sm text-orange-700 mt-1">Medications at or below reorder level</p>
      </div>

      <InventoryList
        inventoryItems={lowStockItems}
        isLoading={isLoading}
        onReorder={onReorder}
        onViewDetails={onViewDetails}
      />
    </div>
  );
};

LowStockList.displayName = 'LowStockList';

export default LowStockList;
