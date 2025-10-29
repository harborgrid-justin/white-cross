/**
 * Student Detail Route Loading State
 * Displays skeleton UI while student detail data loads
 */

import { GenericDetailLoadingSkeleton } from '@/components/loading/GenericDetailLoadingSkeleton';

export default function StudentDetailLoading() {
  return (
    <GenericDetailLoadingSkeleton showTabs={true} tabCount={5} />
  );
}
