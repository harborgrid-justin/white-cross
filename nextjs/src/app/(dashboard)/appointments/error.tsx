'use client';

/**
 * Appointments Route Error Boundary
 * Handles errors in appointment routes with contextual recovery
 */

import { GenericDomainError } from '@/components/errors/GenericDomainError';
import { Calendar } from 'lucide-react';

export default function AppointmentsError({
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
      domain="Appointments"
      domainIcon={<Calendar className="h-8 w-8 text-red-600 dark:text-red-400" />}
      customMessage="Unable to load appointment information. Scheduled appointments may not be visible."
      customRecoverySteps={[
        'Click "Try Again" to reload appointments',
        'Check your calendar permissions',
        'Verify network connection',
        'Contact IT support if error persists',
      ]}
    />
  );
}
