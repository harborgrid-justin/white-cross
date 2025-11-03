'use client';

import { ErrorState } from '@/components/common/ErrorStates';

export default function OverdueVaccinesError({
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
      title="Failed to Load Overdue Vaccines"
      description="An error occurred while loading overdue vaccination data."
    />
  );
}
