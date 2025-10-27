/**
 * Incidents Route Loading State
 * Displays skeleton UI while incidents data loads
 */

import { GenericListLoadingSkeleton } from '@/components/loading/GenericListLoadingSkeleton';

export default function IncidentsLoading() {
  return (
    <GenericListLoadingSkeleton
      showStats={true}
      showFilters={true}
      itemCount={5}
    />
  );
}
