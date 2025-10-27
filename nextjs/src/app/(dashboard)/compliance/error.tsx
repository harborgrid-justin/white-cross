'use client';

/**
 * Compliance Route Error Boundary
 * Handles errors in compliance routes with contextual recovery
 */

import { GenericDomainError } from '@/components/errors/GenericDomainError';
import { Shield } from 'lucide-react';

export default function ComplianceError({
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
      domain="Compliance"
      domainIcon={<Shield className="h-8 w-8 text-red-600 dark:text-red-400" />}
      customMessage="Unable to load compliance data. Audit logs and compliance reports may not be accessible."
    />
  );
}
