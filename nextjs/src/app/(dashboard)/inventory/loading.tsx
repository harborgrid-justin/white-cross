/**
 * Inventory Route Loading State
 * Displays skeleton UI while inventory data loads
 */

import { GenericListLoadingSkeleton } from '@/components/loading/GenericListLoadingSkeleton';

export default function InventoryLoading() {
  return (
    <GenericListLoadingSkeleton
      showStats={true}
      showFilters={true}
      itemCount={8}
    />
  );
}
