/**
 * Medications Route Loading State
 * Displays skeleton UI while medications data loads
 */

import { GenericListLoadingSkeleton } from '@/components/loading/GenericListLoadingSkeleton';

export default function MedicationsLoading() {
  return (
    <GenericListLoadingSkeleton
      showStats={true}
      showFilters={true}
      itemCount={8}
    />
  );
}
