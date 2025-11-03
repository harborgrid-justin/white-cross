'use client';

import { ErrorState } from '@/components/common/ErrorStates';

export default function ExemptionsError({
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
      title="Failed to Load Exemptions"
      description="An error occurred while loading exemption data."
    />
  );
}
