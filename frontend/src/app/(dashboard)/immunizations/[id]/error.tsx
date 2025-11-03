'use client';

import { ErrorState } from '@/components/common/ErrorStates';

export default function ImmunizationDetailError({
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
      title="Failed to Load Immunization Record"
      description="An error occurred while loading this immunization record."
    />
  );
}
