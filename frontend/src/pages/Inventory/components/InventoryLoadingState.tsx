/**
 * Inventory Loading State Component
 *
 * Displays loading indicator for inventory data
 *
 * @module components/InventoryLoadingState
 */

import React from 'react';

/**
 * Loading state component
 */
export default function InventoryLoadingState() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-gray-600">Loading inventory...</span>
    </div>
  );
}
