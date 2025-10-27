'use client';

/**
 * ExpiringMedicationsList Component
 */

import React from 'react';
import { InventoryList, type InventoryItem } from './InventoryList';

export interface ExpiringMedicationsListProps {
  inventoryItems: InventoryItem[];
  daysThreshold?: number;
  isLoading?: boolean;
  onViewDetails?: (itemId: string) => void;
}

export const ExpiringMedicationsList: React.FC<ExpiringMedicationsListProps> = ({
  inventoryItems,
  daysThreshold = 30,
  isLoading,
  onViewDetails,
}) => {
  const today = new Date();
  const thresholdDate = new Date(today.getTime() + daysThreshold * 24 * 60 * 60 * 1000);

  const expiringItems = inventoryItems.filter((item) => {
    if (!item.expirationDate) return false;
    const expDate = new Date(item.expirationDate);
    return expDate <= thresholdDate && expDate >= today;
  });

  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-900">
          Expiring Soon: {expiringItems.length}
        </h3>
        <p className="text-sm text-yellow-700 mt-1">
          Medications expiring within {daysThreshold} days
        </p>
      </div>

      <InventoryList inventoryItems={expiringItems} isLoading={isLoading} onViewDetails={onViewDetails} />
    </div>
  );
};

ExpiringMedicationsList.displayName = 'ExpiringMedicationsList';

export default ExpiringMedicationsList;
