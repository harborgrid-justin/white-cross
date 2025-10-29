'use client';

/**
 * Medications Route Error Boundary
 * Handles errors in medication routes with contextual recovery
 */

import { GenericDomainError } from '@/components/errors/GenericDomainError';
import { Pill } from 'lucide-react';

export default function MedicationsError({
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
      domain="Medications"
      domainIcon={<Pill className="h-8 w-8 text-red-600 dark:text-red-400" />}
      customMessage="Unable to load medication information. This may affect medication administration and inventory management."
      customRecoverySteps={[
        'Click "Try Again" to reload medication data',
        'Verify network connection',
        'Check if scheduled maintenance is in progress',
        'If administering medication, verify administration was recorded before retrying',
        'Contact IT support if error persists',
      ]}
    />
  );
}
