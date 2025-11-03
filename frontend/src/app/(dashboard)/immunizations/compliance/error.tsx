'use client';

import { ErrorState } from '@/components/common/ErrorStates';

export default function ComplianceDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      error={error}
      reset={reset}
      title="Failed to Load Compliance Dashboard"
      description="An error occurred while loading compliance data."
    />
  );
}
