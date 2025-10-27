/**
 * Compliance Route Loading State
 * Displays skeleton UI while compliance data loads
 */

import { GenericListLoadingSkeleton } from '@/components/loading/GenericListLoadingSkeleton';

export default function ComplianceLoading() {
  return (
    <GenericListLoadingSkeleton
      showStats={true}
      showFilters={true}
      itemCount={6}
    />
  );
}
