'use client';

/**
 * Incidents Route Error Boundary
 * Handles errors in incident routes with contextual recovery
 */

import { GenericDomainError } from '@/components/errors/GenericDomainError';
import { AlertCircle } from 'lucide-react';

export default function IncidentsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <GenericDomainError
      error={error}
      reset={reset}
      domain="Incidents"
      domainIcon={<AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />}
      customMessage="Unable to load incident reports. This may affect incident tracking and reporting."
      customRecoverySteps={[
        'Click "Try Again" to reload incident data',
        'If you just submitted a report, verify it was saved',
        'Check your network connection',
        'Contact IT support if error persists',
      ]}
    />
  );
}
