'use client';

import { ErrorState } from '@/components/common/ErrorStates';

export default function SchedulesError({
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
      title="Failed to Load CDC Schedules"
      description="An error occurred while loading vaccination schedules."
    />
  );
}
