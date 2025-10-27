/**
 * Communications Route Loading State
 * Displays skeleton UI while communications data loads
 */

import { GenericListLoadingSkeleton } from '@/components/loading/GenericListLoadingSkeleton';

export default function CommunicationsLoading() {
  return (
    <GenericListLoadingSkeleton
      showStats={false}
      showFilters={true}
      itemCount={10}
    />
  );
}
