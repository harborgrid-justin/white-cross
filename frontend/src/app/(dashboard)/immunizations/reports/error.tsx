'use client';

import { ErrorState } from '@/components/common/ErrorStates';

export default function ReportsError({
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
      title="Failed to Load Reports"
      description="An error occurred while loading immunization reports."
    />
  );
}
