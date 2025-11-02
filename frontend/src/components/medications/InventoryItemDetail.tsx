'use client';

/**
 * InventoryItemDetail Component
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { type InventoryItem } from './InventoryList';

export interface InventoryItemDetailProps {
  item: InventoryItem;
  onClose?: () => void;
  onAdjustStock?: () => void;
  onReorder?: () => void;
}

export const InventoryItemDetail: React.FC<InventoryItemDetailProps> = ({
  item,
  onClose,
  onAdjustStock,
  onReorder,
}) => {
  const isLowStock = item.reorderLevel !== undefined && item.quantity <= item.reorderLevel;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{item.medicationName}</h2>
          <p className="text-sm text-gray-600 mt-1">Inventory Item</p>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      {isLowStock && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="font-semibold text-orange-900">Low Stock Alert</h3>
          <p className="text-sm text-orange-700 mt-1">
            Current quantity ({item.quantity}) is at or below reorder level ({item.reorderLevel})
          </p>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Current Quantity</dt>
            <dd className="mt-1 text-sm text-gray-900 font-medium">
              {item.quantity} {item.unit}
            </dd>
          </div>
          {item.reorderLevel !== undefined && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Reorder Level</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {item.reorderLevel} {item.unit}
              </dd>
            </div>
          )}
          {item.lotNumber && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Lot/Batch Number</dt>
              <dd className="mt-1 text-sm text-gray-900">{item.lotNumber}</dd>
            </div>
          )}
          {item.expirationDate && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Expiration Date</dt>
              <dd className="mt-1 text-sm text-gray-900">{item.expirationDate}</dd>
            </div>
          )}
          {item.location && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Storage Location</dt>
              <dd className="mt-1 text-sm text-gray-900">{item.location}</dd>
            </div>
          )}
          {item.lastRestocked && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Last Restocked</dt>
              <dd className="mt-1 text-sm text-gray-900">{item.lastRestocked}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="flex items-center gap-3">
        {onAdjustStock && (
          <Button variant="outline" onClick={onAdjustStock}>
            Adjust Stock
          </Button>
        )}
        {onReorder && isLowStock && (
          <Button variant="default" onClick={onReorder}>
            Reorder
          </Button>
        )}
      </div>
    </div>
  );
};

InventoryItemDetail.displayName = 'InventoryItemDetail';

export default InventoryItemDetail;



