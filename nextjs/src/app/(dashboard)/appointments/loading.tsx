/**
 * Appointments Route Loading State
 * Displays skeleton UI while appointments data loads
 */

import { GenericListLoadingSkeleton } from '@/components/loading/GenericListLoadingSkeleton';

export default function AppointmentsLoading() {
  return (
    <GenericListLoadingSkeleton
      showStats={true}
      showFilters={true}
      itemCount={6}
    />
  );
}
