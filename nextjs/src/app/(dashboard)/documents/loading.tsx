/**
 * Documents Route Loading State
 * Displays skeleton UI while documents data loads
 */

import { GenericListLoadingSkeleton } from '@/components/loading/GenericListLoadingSkeleton';

export default function DocumentsLoading() {
  return (
    <GenericListLoadingSkeleton
      showStats={false}
      showFilters={true}
      itemCount={8}
    />
  );
}
