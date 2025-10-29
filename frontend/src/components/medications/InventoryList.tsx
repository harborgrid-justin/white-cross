'use client';

/**
 * InventoryList Component
 */

import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmptyState } from '@/components/ui/data/Table';
import { Button } from '@/components/ui/Button';

export interface InventoryItem {
  id: string;
  medicationName: string;
  quantity: number;
  unit: string;
  lotNumber?: string;
  expirationDate?: string;
  location?: string;
  lastRestocked?: string;
  reorderLevel?: number;
}

export interface InventoryListProps {
  inventoryItems: InventoryItem[];
  isLoading?: boolean;
  onViewDetails?: (itemId: string) => void;
  onAdjustStock?: (itemId: string) => void;
  onReorder?: (itemId: string) => void;
}

export const InventoryList: React.FC<InventoryListProps> = ({
  inventoryItems,
  isLoading,
  onViewDetails,
  onAdjustStock,
  onReorder,
}) => {
  const isLowStock = (item: InventoryItem) => {
    return item.reorderLevel !== undefined && item.quantity <= item.reorderLevel;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Medication Inventory</h2>

      <Table variant="striped">
        <TableHeader>
          <TableRow>
            <TableHead>Medication</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Lot Number</TableHead>
            <TableHead>Expiration</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventoryItems.length === 0 ? (
            <TableEmptyState colSpan={7} title="No inventory items found" />
          ) : (
            inventoryItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.medicationName}</TableCell>
                <TableCell>
                  {item.quantity} {item.unit}
                </TableCell>
                <TableCell>{item.lotNumber || 'N/A'}</TableCell>
                <TableCell>{item.expirationDate || 'N/A'}</TableCell>
                <TableCell>{item.location || 'N/A'}</TableCell>
                <TableCell>
                  {isLowStock(item) ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                      Low Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      In Stock
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {onViewDetails && (
                      <Button size="xs" variant="ghost" onClick={() => onViewDetails(item.id)}>
                        View
                      </Button>
                    )}
                    {onAdjustStock && (
                      <Button size="xs" variant="outline" onClick={() => onAdjustStock(item.id)}>
                        Adjust
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

InventoryList.displayName = 'InventoryList';

export default InventoryList;
