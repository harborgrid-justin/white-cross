'use client';

/**
 * Student Detail Route Error Boundary
 * Handles errors in student detail routes with contextual recovery
 */

import { GenericDomainError } from '@/components/errors/GenericDomainError';
import { Users } from 'lucide-react';

export default function StudentDetailError({
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
      domain="Student Profile"
      domainIcon={<Users className="h-8 w-8 text-red-600 dark:text-red-400" />}
      customMessage="Unable to load student profile. Health records and medications may not be accessible."
      customRecoverySteps={[
        'Click "Try Again" to reload student data',
        'Verify you have permission to access this student record',
        'Check your network connection',
        'Contact IT support if error persists',
      ]}
    />
  );
}
