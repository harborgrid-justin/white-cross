'use client';

import { ErrorState } from '@/components/common/ErrorStates';

export default function NewVaccineError({
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
      title="Failed to Load Vaccine Form"
      description="An error occurred while loading the vaccine administration form."
    />
  );
}
